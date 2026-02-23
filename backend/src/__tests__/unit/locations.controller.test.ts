import { Request, Response } from 'express';
import { getLocations } from '../../controllers/locations.controller';
import * as locationsService from '../../services/locations.service';

jest.mock('../../services/locations.service');

const mockLocationsService = locationsService as jest.Mocked<typeof locationsService>;

describe('LocationsController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockRequest = {};
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };
  });

  describe('getLocations', () => {
    it('should return 200 with locations on success', async () => {
      const mockLocations = [
        { id: 'loc_1', name: 'Location 1', status: 'ACTIVE', timezone: 'UTC', address: '123 St' },
        { id: 'loc_2', name: 'Location 2', status: 'ACTIVE', timezone: 'UTC', address: '456 Ave' },
      ];
      mockLocationsService.fetchLocations.mockResolvedValue(mockLocations);

      await getLocations(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockLocations);
    });

    it('should return 200 with empty array when no locations', async () => {
      mockLocationsService.fetchLocations.mockResolvedValue([]);

      await getLocations(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith([]);
    });

    it('should return 500 with error response on service failure', async () => {
      mockLocationsService.fetchLocations.mockRejectedValue(new Error('Service error'));

      await getLocations(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: {
          message: 'Failed to fetch locations',
          code: 'LOCATION_FETCH_FAILED',
        },
      });
    });

    it('should call fetchLocations service', async () => {
      mockLocationsService.fetchLocations.mockResolvedValue([]);

      await getLocations(mockRequest as Request, mockResponse as Response);

      expect(mockLocationsService.fetchLocations).toHaveBeenCalledTimes(1);
    });
  });
});
