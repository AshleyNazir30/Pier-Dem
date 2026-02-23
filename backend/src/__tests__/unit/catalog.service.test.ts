import { getCatalogByLocation, getCategoriesByLocation } from '../../services/catalog.service';
import * as squareService from '../../services/square.service';
import { cache } from '../../utils/cache';

jest.mock('../../services/square.service');
jest.mock('../../utils/cache');

const mockSquareService = squareService as jest.Mocked<typeof squareService>;
const mockCache = cache as jest.Mocked<typeof cache>;

const createMockCatalogData = () => [
  {
    type: 'ITEM',
    id: 'item_burger',
    presentAtAllLocations: true,
    itemData: {
      name: 'Burger',
      description: 'Juicy beef burger',
      categories: [{ id: 'cat_main' }],
      imageIds: ['img_burger'],
      variations: [
        {
          id: 'var_burger_reg',
          itemVariationData: {
            name: 'Regular',
            priceMoney: { amount: BigInt(1299), currency: 'USD' },
          },
        },
      ],
    },
  },
  {
    type: 'ITEM',
    id: 'item_pizza',
    presentAtLocationIds: ['loc_downtown'],
    itemData: {
      name: 'Pizza',
      description: 'Wood-fired pizza',
      categories: [{ id: 'cat_main' }],
      variations: [
        {
          id: 'var_pizza_sm',
          itemVariationData: {
            name: 'Small',
            priceMoney: { amount: BigInt(1099), currency: 'USD' },
          },
        },
        {
          id: 'var_pizza_lg',
          itemVariationData: {
            name: 'Large',
            priceMoney: { amount: BigInt(1599), currency: 'USD' },
          },
        },
      ],
    },
  },
  {
    type: 'ITEM',
    id: 'item_salad',
    presentAtLocationIds: ['loc_uptown'],
    itemData: {
      name: 'Garden Salad',
      description: 'Fresh mixed greens',
      categories: [{ id: 'cat_sides' }],
      variations: [
        {
          id: 'var_salad',
          itemVariationData: {
            name: 'Regular',
            priceMoney: { amount: BigInt(899), currency: 'USD' },
          },
        },
      ],
    },
  },
  {
    type: 'ITEM',
    id: 'item_no_category',
    presentAtAllLocations: true,
    itemData: {
      name: 'Mystery Item',
      description: 'No category assigned',
      variations: [
        {
          id: 'var_mystery',
          itemVariationData: {
            name: 'Default',
            priceMoney: { amount: BigInt(500), currency: 'USD' },
          },
        },
      ],
    },
  },
  {
    type: 'ITEM',
    id: 'item_no_price',
    presentAtAllLocations: true,
    itemData: {
      name: 'Free Item',
      categories: [{ id: 'cat_main' }],
      variations: [
        {
          id: 'var_free',
          itemVariationData: {
            name: 'Free',
          },
        },
      ],
    },
  },
  {
    type: 'CATEGORY',
    id: 'cat_main',
    categoryData: { name: 'Main Courses' },
  },
  {
    type: 'CATEGORY',
    id: 'cat_sides',
    categoryData: { name: 'Sides' },
  },
  {
    type: 'IMAGE',
    id: 'img_burger',
    imageData: { url: 'https://example.com/burger.jpg' },
  },
];

describe('CatalogService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCache.get.mockResolvedValue(undefined);
    mockCache.set.mockResolvedValue(undefined);
  });

  describe('getCatalogByLocation', () => {
    it('should return items grouped by category', async () => {
      mockSquareService.fetchAllCatalogObjects.mockResolvedValue(createMockCatalogData() as any);

      const result = await getCatalogByLocation('loc_downtown');

      expect(result).toHaveProperty('Main Courses');
      expect(result['Main Courses'].length).toBeGreaterThan(0);
    });

    it('should filter items by location (presentAtLocationIds)', async () => {
      mockSquareService.fetchAllCatalogObjects.mockResolvedValue(createMockCatalogData() as any);

      const result = await getCatalogByLocation('loc_downtown');

      // Salad is only at loc_uptown, should not appear
      const allItems = Object.values(result).flat();
      const salad = allItems.find(item => item.name === 'Garden Salad');
      expect(salad).toBeUndefined();
    });

    it('should include items with presentAtAllLocations', async () => {
      mockSquareService.fetchAllCatalogObjects.mockResolvedValue(createMockCatalogData() as any);

      const result = await getCatalogByLocation('loc_downtown');

      const allItems = Object.values(result).flat();
      const burger = allItems.find(item => item.name === 'Burger');
      expect(burger).toBeDefined();
    });

    it('should format item with all details correctly', async () => {
      mockSquareService.fetchAllCatalogObjects.mockResolvedValue(createMockCatalogData() as any);

      const result = await getCatalogByLocation('loc_downtown');

      const burger = result['Main Courses'].find(item => item.name === 'Burger');
      expect(burger).toEqual({
        id: 'item_burger',
        name: 'Burger',
        description: 'Juicy beef burger',
        category: 'Main Courses',
        image_url: 'https://example.com/burger.jpg',
        variations: [
          {
            id: 'var_burger_reg',
            name: 'Regular',
            price: 12.99,
            currency: 'USD',
          },
        ],
      });
    });

    it('should handle multiple variations with prices', async () => {
      mockSquareService.fetchAllCatalogObjects.mockResolvedValue(createMockCatalogData() as any);

      const result = await getCatalogByLocation('loc_downtown');

      const pizza = result['Main Courses'].find(item => item.name === 'Pizza');
      expect(pizza?.variations).toHaveLength(2);
      expect(pizza?.variations[0].price).toBe(10.99);
      expect(pizza?.variations[1].price).toBe(15.99);
    });

    it('should categorize items without category as "Uncategorized"', async () => {
      mockSquareService.fetchAllCatalogObjects.mockResolvedValue(createMockCatalogData() as any);

      const result = await getCatalogByLocation('loc_downtown');

      expect(result).toHaveProperty('Uncategorized');
      const mystery = result['Uncategorized'].find(item => item.name === 'Mystery Item');
      expect(mystery).toBeDefined();
    });

    it('should handle items without price (default to 0)', async () => {
      mockSquareService.fetchAllCatalogObjects.mockResolvedValue(createMockCatalogData() as any);

      const result = await getCatalogByLocation('loc_downtown');

      const freeItem = result['Main Courses'].find(item => item.name === 'Free Item');
      expect(freeItem?.variations[0].price).toBe(0);
    });

    it('should handle items without images', async () => {
      mockSquareService.fetchAllCatalogObjects.mockResolvedValue(createMockCatalogData() as any);

      const result = await getCatalogByLocation('loc_downtown');

      const pizza = result['Main Courses'].find(item => item.name === 'Pizza');
      expect(pizza?.image_url).toBeUndefined();
    });

    it('should return cached data when available', async () => {
      const cachedData = { 'Cached Category': [{ id: 'cached', name: 'Cached Item' }] };
      mockCache.get.mockResolvedValue(cachedData);

      const result = await getCatalogByLocation('loc_downtown');

      expect(result).toEqual(cachedData);
      expect(mockSquareService.fetchAllCatalogObjects).not.toHaveBeenCalled();
    });

    it('should cache results with location-specific key', async () => {
      mockSquareService.fetchAllCatalogObjects.mockResolvedValue(createMockCatalogData() as any);

      await getCatalogByLocation('loc_downtown');

      expect(mockCache.set).toHaveBeenCalledWith(
        'catalog:loc_downtown',
        expect.any(Object),
        300 // CACHE_TTL.CATALOG
      );
    });

    it('should return empty object when no items at location', async () => {
      mockSquareService.fetchAllCatalogObjects.mockResolvedValue(createMockCatalogData() as any);

      const result = await getCatalogByLocation('loc_nonexistent');

      // Only items with presentAtAllLocations should appear
      const allItems = Object.values(result).flat();
      expect(allItems.every(item => 
        item.name === 'Burger' || item.name === 'Mystery Item' || item.name === 'Free Item'
      )).toBe(true);
    });

    it('should skip items without itemData', async () => {
      const dataWithBadItem = [
        ...createMockCatalogData(),
        { type: 'ITEM', id: 'bad_item', presentAtAllLocations: true },
      ];
      mockSquareService.fetchAllCatalogObjects.mockResolvedValue(dataWithBadItem as any);

      const result = await getCatalogByLocation('loc_downtown');

      const allItems = Object.values(result).flat();
      const badItem = allItems.find(item => item.id === 'bad_item');
      expect(badItem).toBeUndefined();
    });
  });

  describe('getCategoriesByLocation', () => {
    it('should return categories with item counts', async () => {
      mockSquareService.fetchAllCatalogObjects.mockResolvedValue(createMockCatalogData() as any);

      const result = await getCategoriesByLocation('loc_downtown');

      const mainCourses = result.find(cat => cat.name === 'Main Courses');
      expect(mainCourses).toBeDefined();
      expect(mainCourses?.item_count).toBeGreaterThan(0);
    });

    it('should only include categories with items at location', async () => {
      mockSquareService.fetchAllCatalogObjects.mockResolvedValue(createMockCatalogData() as any);

      const result = await getCategoriesByLocation('loc_downtown');

      // Sides category only has Salad which is at loc_uptown
      const sides = result.find(cat => cat.name === 'Sides');
      expect(sides).toBeUndefined();
    });

    it('should return correct item counts per category', async () => {
      mockSquareService.fetchAllCatalogObjects.mockResolvedValue(createMockCatalogData() as any);

      const result = await getCategoriesByLocation('loc_downtown');

      const mainCourses = result.find(cat => cat.name === 'Main Courses');
      expect(mainCourses?.item_count).toBe(3);
    });

    it('should return cached data when available', async () => {
      const cachedData = [{ id: 'cat_cached', name: 'Cached', item_count: 5 }];
      mockCache.get.mockResolvedValue(cachedData);

      const result = await getCategoriesByLocation('loc_downtown');

      expect(result).toEqual(cachedData);
      expect(mockSquareService.fetchAllCatalogObjects).not.toHaveBeenCalled();
    });

    it('should cache results with location-specific key', async () => {
      mockSquareService.fetchAllCatalogObjects.mockResolvedValue(createMockCatalogData() as any);

      await getCategoriesByLocation('loc_downtown');

      expect(mockCache.set).toHaveBeenCalledWith(
        'categories:loc_downtown',
        expect.any(Array),
        300 // CACHE_TTL.CATEGORIES
      );
    });

    it('should return empty array when no items have categories', async () => {
      const dataWithoutCategories = [
        {
          type: 'ITEM',
          id: 'item_1',
          presentAtAllLocations: true,
          itemData: {
            name: 'No Category Item',
            variations: [],
          },
        },
      ];
      mockSquareService.fetchAllCatalogObjects.mockResolvedValue(dataWithoutCategories as any);

      const result = await getCategoriesByLocation('loc_downtown');

      expect(result).toEqual([]);
    });

    it('should include category id in response', async () => {
      mockSquareService.fetchAllCatalogObjects.mockResolvedValue(createMockCatalogData() as any);

      const result = await getCategoriesByLocation('loc_downtown');

      const mainCourses = result.find(cat => cat.name === 'Main Courses');
      expect(mainCourses?.id).toBe('cat_main');
    });
  });
});
