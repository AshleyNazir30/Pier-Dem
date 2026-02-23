import request from 'supertest';
import app from '../../app';
import * as squareService from '../../services/square.service';
import { cache } from '../../utils/cache';

jest.mock('../../services/square.service');

const mockSquareService = squareService as jest.Mocked<typeof squareService>;

const mockCatalogObjects = [
  {
    type: 'ITEM',
    id: 'item_1',
    presentAtAllLocations: true,
    itemData: {
      name: 'Burger',
      description: 'Delicious beef burger',
      categories: [{ id: 'cat_1' }],
      imageIds: ['img_1'],
      variations: [
        {
          id: 'var_1',
          itemVariationData: {
            name: 'Regular',
            priceMoney: { amount: BigInt(1250), currency: 'USD' },
          },
        },
      ],
    },
  },
  {
    type: 'ITEM',
    id: 'item_2',
    presentAtLocationIds: ['loc_1'],
    itemData: {
      name: 'Pizza',
      description: 'Fresh pizza',
      categories: [{ id: 'cat_2' }],
      variations: [
        {
          id: 'var_2',
          itemVariationData: {
            name: 'Small',
            priceMoney: { amount: BigInt(1000), currency: 'USD' },
          },
        },
        {
          id: 'var_3',
          itemVariationData: {
            name: 'Large',
            priceMoney: { amount: BigInt(1500), currency: 'USD' },
          },
        },
      ],
    },
  },
  {
    type: 'ITEM',
    id: 'item_3',
    presentAtLocationIds: ['loc_2'],
    itemData: {
      name: 'Salad',
      description: 'Fresh garden salad',
      categories: [{ id: 'cat_1' }],
      variations: [
        {
          id: 'var_4',
          itemVariationData: {
            name: 'Regular',
            priceMoney: { amount: BigInt(800), currency: 'USD' },
          },
        },
      ],
    },
  },
  {
    type: 'CATEGORY',
    id: 'cat_1',
    categoryData: { name: 'Main Courses' },
  },
  {
    type: 'CATEGORY',
    id: 'cat_2',
    categoryData: { name: 'Pizzas' },
  },
  {
    type: 'IMAGE',
    id: 'img_1',
    imageData: { url: 'https://example.com/burger.jpg' },
  },
];

describe('Catalog API', () => {
  beforeEach(async () => {
    await cache.clear();
    jest.clearAllMocks();
  });

  describe('GET /api/catalog', () => {
    it('should return catalog items grouped by category for a location', async () => {
      mockSquareService.fetchAllCatalogObjects.mockResolvedValue(mockCatalogObjects as any);

      const response = await request(app)
        .get('/api/catalog')
        .query({ location_id: 'loc_1' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('Main Courses');
      expect(response.body).toHaveProperty('Pizzas');
      expect(response.body['Main Courses']).toHaveLength(1);
      expect(response.body['Main Courses'][0].name).toBe('Burger');
    });

    it('should filter items by location', async () => {
      mockSquareService.fetchAllCatalogObjects.mockResolvedValue(mockCatalogObjects as any);

      const response = await request(app)
        .get('/api/catalog')
        .query({ location_id: 'loc_1' });

      expect(response.status).toBe(200);
      
      const allItems = Object.values(response.body).flat() as any[];
      const salad = allItems.find((item: any) => item.name === 'Salad');
      expect(salad).toBeUndefined();
    });

    it('should include item variations with prices', async () => {
      mockSquareService.fetchAllCatalogObjects.mockResolvedValue(mockCatalogObjects as any);

      const response = await request(app)
        .get('/api/catalog')
        .query({ location_id: 'loc_1' });

      expect(response.status).toBe(200);
      
      const pizza = response.body['Pizzas'][0];
      expect(pizza.variations).toHaveLength(2);
      expect(pizza.variations[0]).toEqual({
        id: 'var_2',
        name: 'Small',
        price: 10,
        currency: 'USD',
      });
    });

    it('should include image URLs when available', async () => {
      mockSquareService.fetchAllCatalogObjects.mockResolvedValue(mockCatalogObjects as any);

      const response = await request(app)
        .get('/api/catalog')
        .query({ location_id: 'loc_1' });

      expect(response.status).toBe(200);
      
      const burger = response.body['Main Courses'][0];
      expect(burger.image_url).toBe('https://example.com/burger.jpg');
    });

    it('should return 400 when location_id is missing', async () => {
      const response = await request(app).get('/api/catalog');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should cache catalog results', async () => {
      mockSquareService.fetchAllCatalogObjects.mockResolvedValue(mockCatalogObjects as any);

      await request(app).get('/api/catalog').query({ location_id: 'loc_1' });
      await request(app).get('/api/catalog').query({ location_id: 'loc_1' });

      expect(mockSquareService.fetchAllCatalogObjects).toHaveBeenCalledTimes(1);
    });

    it('should use separate cache for different locations', async () => {
      mockSquareService.fetchAllCatalogObjects.mockResolvedValue(mockCatalogObjects as any);

      await request(app).get('/api/catalog').query({ location_id: 'loc_1' });
      await request(app).get('/api/catalog').query({ location_id: 'loc_2' });

      expect(mockSquareService.fetchAllCatalogObjects).toHaveBeenCalledTimes(2);
    });
  });

  describe('GET /api/catalog/categories', () => {
    it('should return categories with item counts for a location', async () => {
      mockSquareService.fetchAllCatalogObjects.mockResolvedValue(mockCatalogObjects as any);

      const response = await request(app)
        .get('/api/catalog/categories')
        .query({ location_id: 'loc_1' });

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      
      const mainCourses = response.body.find((c: any) => c.name === 'Main Courses');
      expect(mainCourses).toBeDefined();
      expect(mainCourses.item_count).toBe(1);
    });

    it('should only return categories with items at the location', async () => {
      mockSquareService.fetchAllCatalogObjects.mockResolvedValue(mockCatalogObjects as any);

      const response = await request(app)
        .get('/api/catalog/categories')
        .query({ location_id: 'loc_2' });

      expect(response.status).toBe(200);
      
      const categoryNames = response.body.map((c: any) => c.name);
      expect(categoryNames).toContain('Main Courses');
    });

    it('should return 400 when location_id is missing', async () => {
      const response = await request(app).get('/api/catalog/categories');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
});
