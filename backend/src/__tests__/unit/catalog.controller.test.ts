import { Request, Response } from 'express';
import { getCatalog, getCatalogCategories } from '../../controllers/catalog.controller';
import * as catalogService from '../../services/catalog.service';
import { GroupedCatalog } from '../../types';

jest.mock('../../services/catalog.service');

const mockCatalogService = catalogService as jest.Mocked<typeof catalogService>;

describe('CatalogController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockRequest = {
      query: {},
    };
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };
  });

  describe('getCatalog', () => {
    it('should return 200 with catalog grouped by category', async () => {
      const mockCatalog: GroupedCatalog = {
        'Main Courses': [
          { id: 'item_1', name: 'Burger', description: 'Tasty', category: 'Main Courses', image_url: undefined, variations: [] },
        ],
        'Sides': [
          { id: 'item_2', name: 'Fries', description: 'Crispy', category: 'Sides', image_url: undefined, variations: [] },
        ],
      };
      mockRequest.query = { location_id: 'loc_1' };
      mockCatalogService.getCatalogByLocation.mockResolvedValue(mockCatalog);

      await getCatalog(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockCatalog);
    });

    it('should return 400 when location_id is missing', async () => {
      mockRequest.query = {};

      await getCatalog(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: {
          message: 'location_id is required',
          code: 'MISSING_LOCATION_ID',
        },
      });
    });

    it('should return 500 on service error', async () => {
      mockRequest.query = { location_id: 'loc_1' };
      mockCatalogService.getCatalogByLocation.mockRejectedValue(new Error('Service error'));

      await getCatalog(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: {
          message: 'Failed to fetch catalog',
          code: 'CATALOG_FETCH_FAILED',
        },
      });
    });

    it('should call service with correct location_id', async () => {
      mockRequest.query = { location_id: 'loc_123' };
      mockCatalogService.getCatalogByLocation.mockResolvedValue({});

      await getCatalog(mockRequest as Request, mockResponse as Response);

      expect(mockCatalogService.getCatalogByLocation).toHaveBeenCalledWith('loc_123');
    });

    it('should return empty object when no items at location', async () => {
      mockRequest.query = { location_id: 'loc_empty' };
      mockCatalogService.getCatalogByLocation.mockResolvedValue({});

      await getCatalog(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({});
    });
  });

  describe('getCatalogCategories', () => {
    it('should return 200 with categories', async () => {
      const mockCategories = [
        { id: 'cat_1', name: 'Main Courses', item_count: 5 },
        { id: 'cat_2', name: 'Sides', item_count: 3 },
      ];
      mockRequest.query = { location_id: 'loc_1' };
      mockCatalogService.getCategoriesByLocation.mockResolvedValue(mockCategories);

      await getCatalogCategories(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockCategories);
    });

    it('should return 400 when location_id is missing', async () => {
      mockRequest.query = {};

      await getCatalogCategories(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: {
          message: 'location_id is required',
          code: 'MISSING_LOCATION_ID',
        },
      });
    });

    it('should return 404 when no categories found', async () => {
      mockRequest.query = { location_id: 'loc_empty' };
      mockCatalogService.getCategoriesByLocation.mockResolvedValue([]);

      await getCatalogCategories(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        error: {
          message: 'No categories found for the given location with items',
          code: 'CATEGORIES_NOT_FOUND',
        },
      });
    });

    it('should return 500 on service error', async () => {
      mockRequest.query = { location_id: 'loc_1' };
      mockCatalogService.getCategoriesByLocation.mockRejectedValue(new Error('Service error'));

      await getCatalogCategories(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: {
          message: 'Failed to fetch categories',
          code: 'CATEGORIES_FETCH_FAILED',
        },
      });
    });

    it('should call service with correct location_id', async () => {
      mockRequest.query = { location_id: 'loc_456' };
      mockCatalogService.getCategoriesByLocation.mockResolvedValue([
        { id: 'cat_1', name: 'Test', item_count: 1 },
      ]);

      await getCatalogCategories(mockRequest as Request, mockResponse as Response);

      expect(mockCatalogService.getCategoriesByLocation).toHaveBeenCalledWith('loc_456');
    });
  });
});
