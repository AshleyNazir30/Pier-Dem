export interface Location {
  id: string;
  name: string;
  timezone: string;
  status: string;
  address: string;
}

export interface ApiError {
  message: string;
  code: string;
}

export interface CatalogVariation {
  id: string;
  name: string;
  price: number;
  currency: string;
}

export interface CatalogItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  image_url?: string;
  variations: CatalogVariation[];
}

export interface CatalogCategory {
  id: string;
  name: string;
  item_count: number;
}

export type CatalogByCategory = Record<string, CatalogItem[]>;
