export const getCatalog = async (locationId: string) => {
  const response = await fetch(`/api/catalog?location_id=${locationId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch catalog: ${response.statusText}`);
  }
  return response.json();
};

export const getCatalogCategories = async (locationId: string) => {
  const response = await fetch(`/api/catalog/categories?location_id=${locationId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch catalog categories: ${response.statusText}`);
  }
  return response.json();
};
