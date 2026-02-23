import type { Location } from "../types";

export const getLocations = async (): Promise<Location[]> => {
  const response = await fetch("/api/locations");
  if (!response.ok) {
    throw new Error(`Failed to fetch locations: ${response.statusText}`);
  }
  return response.json();
};