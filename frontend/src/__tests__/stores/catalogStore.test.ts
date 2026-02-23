import { describe, it, expect, beforeEach, vi } from 'vitest';
import { catalogStore } from '../../stores/catalogStore';
import * as catalogApi from '../../services/catalogApi';

vi.mock('../../services/catalogApi');

const mockCatalogApi = catalogApi as unknown as {
  getCatalog: ReturnType<typeof vi.fn>;
  getCatalogCategories: ReturnType<typeof vi.fn>;
};

describe('CatalogStore', () => {
  beforeEach(() => {
    catalogStore.reset();
    vi.clearAllMocks();
  });

  describe('fetchCatalog', () => {
    it('should set loading to true while fetching', async () => {
      mockCatalogApi.getCatalog.mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve({}), 100))
      );
      mockCatalogApi.getCatalogCategories.mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve([]), 100))
      );

      const fetchPromise = catalogStore.fetchCatalog('loc_1');
      expect(catalogStore.loading).toBe(true);

      await fetchPromise;
      expect(catalogStore.loading).toBe(false);
    });

    it('should populate catalog and categories on success', async () => {
      const mockCatalog = {
        'Main Courses': [
          { id: 'item_1', name: 'Burger', category: 'Main Courses', variations: [] },
        ],
        'Sides': [
          { id: 'item_2', name: 'Fries', category: 'Sides', variations: [] },
        ],
      };
      const mockCategories = [
        { id: 'cat_1', name: 'Main Courses', item_count: 1 },
        { id: 'cat_2', name: 'Sides', item_count: 1 },
      ];

      mockCatalogApi.getCatalog.mockResolvedValue(mockCatalog);
      mockCatalogApi.getCatalogCategories.mockResolvedValue(mockCategories);

      await catalogStore.fetchCatalog('loc_1');

      expect(catalogStore.catalogByCategory).toEqual(mockCatalog);
      expect(catalogStore.categories).toEqual(mockCategories);
      expect(catalogStore.allItems).toHaveLength(2);
      expect(catalogStore.error).toBeNull();
    });

    it('should set error on failed fetch', async () => {
      mockCatalogApi.getCatalog.mockRejectedValue(new Error('API Error'));
      mockCatalogApi.getCatalogCategories.mockRejectedValue(new Error('API Error'));

      await catalogStore.fetchCatalog('loc_1');

      expect(catalogStore.error).toBeDefined();
      expect(catalogStore.error?.code).toBe('CATALOG_FETCH_ERROR');
    });
  });

  describe('displayItems (computed)', () => {
    beforeEach(() => {
      catalogStore.allItems = [
        { id: '1', name: 'Burger', category: 'Main', description: '', image_url: '', variations: [] },
        { id: '2', name: 'Pizza', category: 'Main', description: '', image_url: '', variations: [] },
        { id: '3', name: 'Fries', category: 'Sides', description: '', image_url: '', variations: [] },
        { id: '4', name: 'Salad', category: 'Sides', description: '', image_url: '', variations: [] },
      ];
    });

    it('should return all items when activeCategory is "All"', () => {
      catalogStore.activeCategory = 'All';
      expect(catalogStore.displayItems).toHaveLength(4);
    });

    it('should filter items by category', () => {
      catalogStore.setActiveCategory('Main');
      expect(catalogStore.displayItems).toHaveLength(2);
      expect(catalogStore.displayItems.every(item => item.category === 'Main')).toBe(true);
    });

    it('should filter items by search query', () => {
      catalogStore.setSearchQuery('burger');
      expect(catalogStore.displayItems).toHaveLength(1);
      expect(catalogStore.displayItems[0].name).toBe('Burger');
    });

    it('should combine category and search filters', () => {
      catalogStore.setActiveCategory('Sides');
      catalogStore.setSearchQuery('sal');
      expect(catalogStore.displayItems).toHaveLength(1);
      expect(catalogStore.displayItems[0].name).toBe('Salad');
    });

    it('should be case-insensitive for search', () => {
      catalogStore.setSearchQuery('PIZZA');
      expect(catalogStore.displayItems).toHaveLength(1);
      expect(catalogStore.displayItems[0].name).toBe('Pizza');
    });
  });

  describe('setActiveCategory', () => {
    it('should update activeCategory', () => {
      catalogStore.setActiveCategory('Desserts');
      expect(catalogStore.activeCategory).toBe('Desserts');
    });
  });

  describe('setSearchQuery', () => {
    it('should update searchQuery', () => {
      catalogStore.setSearchQuery('test query');
      expect(catalogStore.searchQuery).toBe('test query');
    });
  });

  describe('clearSearch', () => {
    it('should clear searchQuery', () => {
      catalogStore.searchQuery = 'some search';
      catalogStore.clearSearch();
      expect(catalogStore.searchQuery).toBe('');
    });
  });

  describe('reset', () => {
    it('should reset all state to defaults', () => {
      catalogStore.allItems = [{ id: '1', name: 'Item', category: 'Cat', description: '', image_url: '', variations: [] }];
      catalogStore.activeCategory = 'Some Category';
      catalogStore.searchQuery = 'search';
      catalogStore.loading = true;
      catalogStore.error = { message: 'Error', code: 'ERR' };

      catalogStore.reset();

      expect(catalogStore.allItems).toEqual([]);
      expect(catalogStore.activeCategory).toBe('All');
      expect(catalogStore.searchQuery).toBe('');
      expect(catalogStore.loading).toBe(false);
      expect(catalogStore.error).toBeNull();
    });
  });

  describe('totalItemCount (computed)', () => {
    it('should return correct count', () => {
      catalogStore.allItems = [
        { id: '1', name: 'A', category: 'C', description: '', image_url: '', variations: [] },
        { id: '2', name: 'B', category: 'C', description: '', image_url: '', variations: [] },
      ];
      expect(catalogStore.totalItemCount).toBe(2);
    });
  });
});
