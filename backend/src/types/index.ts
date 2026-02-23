export interface LocationResponse {
  id: string | undefined;
  name: string | null | undefined;
  timezone: string | null | undefined;
  status: string | undefined;
  address: string;
}

export interface ItemVariation {
  id: string | undefined;
  name: string;
  price: number;
  currency: string;
}

export interface CatalogItem {
  id: string | undefined;
  name: string | null | undefined;
  description: string | null | undefined;
  category: string;
  image_url: string | undefined;
  variations: ItemVariation[];
}

export interface GroupedCatalog {
  [categoryName: string]: CatalogItem[];
}

export interface CategorySummary {
  id: string;
  name: string;
  item_count: number;
}

export interface ApiErrorDetail {
  message: string;
  code: string;
}

export interface ApiErrorResponse {
  error: ApiErrorDetail;
}

export type ApiResponse<T> = T | ApiErrorResponse;
