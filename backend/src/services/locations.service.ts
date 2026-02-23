import { Location } from "square";
import { listLocations } from "./square.service";
import { LocationResponse } from "../types";
import { cache, CACHE_TTL, CACHE_KEYS } from "../utils/cache";

export const fetchLocations = async (): Promise<LocationResponse[]> => {
  const cacheKey = CACHE_KEYS.LOCATIONS;

  const cached = await cache.get<LocationResponse[]>(cacheKey);
  if (cached) {
    console.log(`[Cache] HIT: ${cacheKey}`);
    return cached;
  }

  console.log(`[Cache] MISS: ${cacheKey}`);

  const locations: Location[] = await listLocations();

  const result = locations
    .filter((loc: Location) => loc.status === "ACTIVE")
    .map((loc: Location): LocationResponse => ({
      id: loc.id,
      name: loc.name,
      timezone: loc.timezone,
      status: loc.status,
      address: [
        loc.address?.addressLine1,
        loc.address?.locality,
        loc.address?.administrativeDistrictLevel1,
        loc.address?.postalCode,
      ]
        .filter(Boolean)
        .join(", "),
    }));

  await cache.set(cacheKey, result, CACHE_TTL.LOCATIONS);

  return result;
};
