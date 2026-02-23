import { describe, it, expect, beforeEach, vi } from 'vitest';
import { locationStore } from '../../stores/locationStore';
import * as locationApi from '../../services/locationApi';

vi.mock('../../services/locationApi');

const mockLocationApi = locationApi as unknown as {
  getLocations: ReturnType<typeof vi.fn>;
};

describe('LocationStore', () => {
  beforeEach(() => {
    locationStore.locations = [];
    locationStore.loading = false;
    locationStore.error = null;
    vi.clearAllMocks();
  });

  describe('fetchLocations', () => {
    it('should set loading to true while fetching', async () => {
      mockLocationApi.getLocations.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve([]), 100))
      );

      const fetchPromise = locationStore.fetchLocations();
      expect(locationStore.loading).toBe(true);
      
      await fetchPromise;
      expect(locationStore.loading).toBe(false);
    });

    it('should populate locations on successful fetch', async () => {
      const mockLocations = [
        { id: 'loc_1', name: 'Downtown', status: 'ACTIVE', timezone: 'UTC', address: '123 Main St' },
        { id: 'loc_2', name: 'Uptown', status: 'ACTIVE', timezone: 'UTC', address: '456 Oak Ave' },
      ];
      mockLocationApi.getLocations.mockResolvedValue(mockLocations);

      await locationStore.fetchLocations();

      expect(locationStore.locations).toEqual(mockLocations);
      expect(locationStore.error).toBeNull();
    });

    it('should set error on failed fetch', async () => {
      const mockError = { message: 'Network error', code: 'NETWORK_ERROR' };
      mockLocationApi.getLocations.mockRejectedValue(mockError);

      await locationStore.fetchLocations();

      expect(locationStore.error).toEqual(mockError);
      expect(locationStore.locations).toEqual([]);
    });

    it('should clear previous error on new fetch', async () => {
      locationStore.error = { message: 'Previous error', code: 'PREV_ERROR' };
      mockLocationApi.getLocations.mockResolvedValue([]);

      await locationStore.fetchLocations();

      expect(locationStore.error).toBeNull();
    });
  });
});
