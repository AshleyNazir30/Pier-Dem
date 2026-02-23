import { fetchLocations } from '../../services/locations.service';
import * as squareService from '../../services/square.service';
import { cache } from '../../utils/cache';

// Mock dependencies
jest.mock('../../services/square.service');
jest.mock('../../utils/cache');

const mockSquareService = squareService as jest.Mocked<typeof squareService>;
const mockCache = cache as jest.Mocked<typeof cache>;

describe('LocationsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCache.get.mockResolvedValue(undefined);
    mockCache.set.mockResolvedValue(undefined);
  });

  describe('fetchLocations', () => {
    it('should return only active locations', async () => {
      mockSquareService.listLocations.mockResolvedValue([
        {
          id: 'loc_1',
          name: 'Active Location',
          status: 'ACTIVE',
          timezone: 'America/New_York',
          address: { addressLine1: '123 Main St' },
        },
        {
          id: 'loc_2',
          name: 'Inactive Location',
          status: 'INACTIVE',
          timezone: 'America/New_York',
          address: {},
        },
      ]);

      const result = await fetchLocations();

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Active Location');
      expect(result[0].status).toBe('ACTIVE');
    });

    it('should format address correctly with all fields', async () => {
      mockSquareService.listLocations.mockResolvedValue([
        {
          id: 'loc_1',
          name: 'Test Location',
          status: 'ACTIVE',
          timezone: 'America/Chicago',
          address: {
            addressLine1: '456 Oak Ave',
            locality: 'Chicago',
            administrativeDistrictLevel1: 'IL',
            postalCode: '60601',
          },
        },
      ]);

      const result = await fetchLocations();

      expect(result[0].address).toBe('456 Oak Ave, Chicago, IL, 60601');
    });

    it('should handle partial address fields', async () => {
      mockSquareService.listLocations.mockResolvedValue([
        {
          id: 'loc_1',
          name: 'Test Location',
          status: 'ACTIVE',
          timezone: 'America/New_York',
          address: {
            addressLine1: '789 Pine St',
          },
        },
      ]);

      const result = await fetchLocations();

      expect(result[0].address).toBe('789 Pine St');
    });

    it('should handle empty address', async () => {
      mockSquareService.listLocations.mockResolvedValue([
        {
          id: 'loc_1',
          name: 'Test Location',
          status: 'ACTIVE',
          timezone: 'America/New_York',
          address: {},
        },
      ]);

      const result = await fetchLocations();

      expect(result[0].address).toBe('');
    });

    it('should return cached data when available', async () => {
      const cachedData = [
        { id: 'cached_loc', name: 'Cached', status: 'ACTIVE', timezone: 'UTC', address: '123 St' },
      ];
      mockCache.get.mockResolvedValue(cachedData);

      const result = await fetchLocations();

      expect(result).toEqual(cachedData);
      expect(mockSquareService.listLocations).not.toHaveBeenCalled();
    });

    it('should cache results after fetching from Square', async () => {
      mockSquareService.listLocations.mockResolvedValue([
        {
          id: 'loc_1',
          name: 'New Location',
          status: 'ACTIVE',
          timezone: 'America/New_York',
          address: {},
        },
      ]);

      await fetchLocations();

      expect(mockCache.set).toHaveBeenCalledWith(
        'locations',
        expect.any(Array),
        600 // CACHE_TTL.LOCATIONS
      );
    });

    it('should return empty array when no locations exist', async () => {
      mockSquareService.listLocations.mockResolvedValue([]);

      const result = await fetchLocations();

      expect(result).toEqual([]);
    });

    it('should return empty array when all locations are inactive', async () => {
      mockSquareService.listLocations.mockResolvedValue([
        { id: 'loc_1', name: 'Inactive 1', status: 'INACTIVE', timezone: 'UTC', address: {} },
        { id: 'loc_2', name: 'Inactive 2', status: 'INACTIVE', timezone: 'UTC', address: {} },
      ]);

      const result = await fetchLocations();

      expect(result).toEqual([]);
    });

    it('should propagate errors from Square service', async () => {
      mockSquareService.listLocations.mockRejectedValue(new Error('Square API error'));

      await expect(fetchLocations()).rejects.toThrow('Square API error');
    });
  });
});
