import request from 'supertest';
import app from '../../app';
import * as squareService from '../../services/square.service';
import { cache } from '../../utils/cache';

jest.mock('../../services/square.service');

const mockSquareService = squareService as jest.Mocked<typeof squareService>;

describe('Locations API', () => {
  beforeEach(async () => {
    await cache.clear();
    jest.clearAllMocks();
  });

  describe('GET /api/locations', () => {
    it('should return active locations with simplified response', async () => {
      mockSquareService.listLocations.mockResolvedValue([
        {
          id: 'loc_1',
          name: 'Downtown Restaurant',
          status: 'ACTIVE',
          timezone: 'America/New_York',
          address: {
            addressLine1: '123 Main St',
            locality: 'New York',
            administrativeDistrictLevel1: 'NY',
            postalCode: '10001',
          },
        },
        {
          id: 'loc_2',
          name: 'Uptown Restaurant',
          status: 'ACTIVE',
          timezone: 'America/New_York',
          address: {
            addressLine1: '456 Broadway',
            locality: 'New York',
            administrativeDistrictLevel1: 'NY',
            postalCode: '10002',
          },
        },
      ]);

      const response = await request(app).get('/api/locations');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toEqual({
        id: 'loc_1',
        name: 'Downtown Restaurant',
        status: 'ACTIVE',
        timezone: 'America/New_York',
        address: '123 Main St, New York, NY, 10001',
      });
    });

    it('should filter out inactive locations', async () => {
      mockSquareService.listLocations.mockResolvedValue([
        {
          id: 'loc_1',
          name: 'Active Location',
          status: 'ACTIVE',
          timezone: 'America/New_York',
          address: {},
        },
        {
          id: 'loc_2',
          name: 'Inactive Location',
          status: 'INACTIVE',
          timezone: 'America/New_York',
          address: {},
        },
      ]);

      const response = await request(app).get('/api/locations');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('Active Location');
    });

    it('should return empty array when no locations exist', async () => {
      mockSquareService.listLocations.mockResolvedValue([]);

      const response = await request(app).get('/api/locations');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return cached data on subsequent requests', async () => {
      mockSquareService.listLocations.mockResolvedValue([
        {
          id: 'loc_1',
          name: 'Cached Location',
          status: 'ACTIVE',
          timezone: 'America/New_York',
          address: {},
        },
      ]);

      // First request - should call Square API
      await request(app).get('/api/locations');
      
      // Second request - should use cache
      await request(app).get('/api/locations');

      // Square service should only be called once
      expect(mockSquareService.listLocations).toHaveBeenCalledTimes(1);
    });

    it('should handle Square API errors gracefully', async () => {
      mockSquareService.listLocations.mockRejectedValue(new Error('Square API error'));

      const response = await request(app).get('/api/locations');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });
});
