import { fetchAllCatalogObjects } from "./square.service";
import { CatalogItem, CategorySummary, GroupedCatalog, ItemVariation } from "../types";
import { cache, CACHE_TTL, CACHE_KEYS } from "../utils/cache";

const buildCategoryMap = (categories: any[]): Record<string, string> => {
  const categoryMap: Record<string, string> = {};
  categories.forEach((cat) => {
    if (cat.id && cat.categoryData?.name) {
      categoryMap[cat.id] = cat.categoryData.name;
    }
  });
  return categoryMap;
};

const buildImageMap = (images: any[]): Record<string, string> => {
  const imageMap: Record<string, string> = {};
  images.forEach((img) => {
    if (img.id && img.imageData?.url) {
      imageMap[img.id] = img.imageData.url;
    }
  });
  return imageMap;
};

const formatVariations = (rawVariations: any[]): ItemVariation[] => {
  return (rawVariations ?? []).map((variation: any) => {
    const variationData = variation.itemVariationData;
    const priceMoney = variationData?.priceMoney;
    return {
      id: variation.id,
      name: variationData?.name || "Default",
      price: Number(priceMoney?.amount ?? 0) / 100, // Convert cents to dollars
      currency: priceMoney?.currency || "USD",
    };
  });
};

const getCategoryId = (itemData: any): string | undefined => {
  if (itemData.categories?.length > 0) {
    return itemData.categories[0].id;
  }
  return itemData.categoryId || undefined;
};

const getCategoryName = (itemData: any, categoryMap: Record<string, string>): string => {
  const categoryId = getCategoryId(itemData);
  if (categoryId && categoryMap[categoryId]) {
    return categoryMap[categoryId];
  }
  return "Uncategorized";
};

const getImageUrl = (itemData: any, imageMap: Record<string, string>): string | undefined => {
  return itemData.imageIds?.length > 0 ? imageMap[itemData.imageIds[0]] : undefined;
};

const isItemAtLocation = (item: any, locationId: string): boolean => {
  return (
    item.presentAtAllLocations === true ||
    item.presentAtLocationIds?.includes(locationId) === true
  );
};

const formatCatalogItem = (
  item: any,
  categoryMap: Record<string, string>,
  imageMap: Record<string, string>
): CatalogItem => {
  const itemData = item.itemData;
  const categoryName = getCategoryName(itemData, categoryMap);
  const imageUrl = getImageUrl(itemData, imageMap);
  const variations = formatVariations(itemData.variations);

  return {
    id: item.id,
    name: itemData.name,
    description: itemData.description,
    category: categoryName,
    image_url: imageUrl,
    variations,
  };
};

export const getCatalogByLocation = async (
  locationId: string
): Promise<GroupedCatalog> => {
  const cacheKey = `${CACHE_KEYS.CATALOG}:${locationId}`;

  const cached = await cache.get<GroupedCatalog>(cacheKey);
  if (cached) {
    console.log(`[Cache] HIT: ${cacheKey}`);
    return cached;
  }

  console.log(`[Cache] MISS: ${cacheKey}`);

  const objects: any[] = (await fetchAllCatalogObjects()) as any[];

  const items = objects.filter((obj) => obj.type === "ITEM");
  const categories = objects.filter((obj) => obj.type === "CATEGORY");
  const images = objects.filter((obj) => obj.type === "IMAGE");

  const categoryMap = buildCategoryMap(categories);
  const imageMap = buildImageMap(images);

  const grouped: GroupedCatalog = {};

  items.forEach((item) => {
    const itemData = item.itemData;
    if (!itemData) return;

    if (!isItemAtLocation(item, locationId)) return;

    const formattedItem = formatCatalogItem(item, categoryMap, imageMap);
    const categoryName = formattedItem.category;

    if (!grouped[categoryName]) {
      grouped[categoryName] = [];
    }

    grouped[categoryName].push(formattedItem);
  });

  await cache.set(cacheKey, grouped, CACHE_TTL.CATALOG);

  return grouped;
};

export const getCategoriesByLocation = async (
  locationId: string
): Promise<CategorySummary[]> => {
  const cacheKey = `${CACHE_KEYS.CATEGORIES}:${locationId}`;

  const cached = await cache.get<CategorySummary[]>(cacheKey);
  if (cached) {
    console.log(`[Cache] HIT: ${cacheKey}`);
    return cached;
  }

  console.log(`[Cache] MISS: ${cacheKey}`);

  const objects: any[] = (await fetchAllCatalogObjects()) as any[];

  const items = objects.filter((obj) => obj.type === "ITEM");
  const categories = objects.filter((obj) => obj.type === "CATEGORY");
  const categoryMap = buildCategoryMap(categories);

  const categoryCounts: Record<string, number> = {};

  items.forEach((item) => {
    const itemData = item.itemData;
    if (!itemData) return;
    if (!isItemAtLocation(item, locationId)) return;

    const categoryId = getCategoryId(itemData);
    if (categoryId && categoryMap[categoryId]) {
      categoryCounts[categoryId] = (categoryCounts[categoryId] || 0) + 1;
    }
  });

  const result = Object.entries(categoryCounts).map(([id, count]) => ({
    id,
    name: categoryMap[id],
    item_count: count,
  }));

  await cache.set(cacheKey, result, CACHE_TTL.CATEGORIES);

  return result;
};