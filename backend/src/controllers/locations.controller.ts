import { Request, Response } from "express";
import { fetchLocations } from "../services/locations.service";
import { LocationResponse, ApiErrorResponse } from "../types";

export const getLocations = async (
  req: Request,
  res: Response<LocationResponse[] | ApiErrorResponse>
): Promise<void> => {
  try {
    const locations: LocationResponse[] = await fetchLocations();
    res.status(200).json(locations);
  } catch (error) {
    const errorResponse: ApiErrorResponse = {
      error: {
        message: "Failed to fetch locations",
        code: "LOCATION_FETCH_FAILED",
      },
    };
    res.status(500).json(errorResponse);
  }
};
