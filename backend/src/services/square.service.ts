import squareClient from "../config/square";
import { Location, CatalogObject } from "square";

export const listLocations = async (): Promise<Location[]> => {
  const response = await squareClient.locations.list();
  return response.locations ?? [];
};

export const fetchAllCatalogObjects = async (): Promise<CatalogObject[]> => {
  let allObjects: CatalogObject[] = [];
  let allRelatedObjects: CatalogObject[] = [];
  let cursor: string | undefined;

  // Square API uses cursor-based pagination, so we loop until there are no more pages
  do {
    const response = await squareClient.catalog.search({
      objectTypes: ["ITEM"],
      includeRelatedObjects: true,
      cursor,
    });

    const objects = response.objects ?? [];
    const relatedObjects = response.relatedObjects ?? [];

    allObjects = [...allObjects, ...objects];
    allRelatedObjects = [...allRelatedObjects, ...relatedObjects];
    cursor = response.cursor;
  } while (cursor);

  return [...allObjects, ...allRelatedObjects];
};
