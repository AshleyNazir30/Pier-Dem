import { makeAutoObservable, runInAction } from "mobx";
import { getCatalog, getCatalogCategories } from "../services/catalogApi";
import type {
  ApiError,
  CatalogItem,
  CatalogCategory,
  CatalogByCategory,
} from "../types";

class CatalogStore {
  allItems: CatalogItem[] = [];
  catalogByCategory: CatalogByCategory = {};
  categories: CatalogCategory[] = [];
  activeCategory: string = "All";
  searchQuery: string = "";
  loading = false;
  error: ApiError | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get displayItems(): CatalogItem[] {
    let items = this.allItems;

    if (this.activeCategory !== "All") {
      items = items.filter((item) => item.category === this.activeCategory);
    }

    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      items = items.filter((item) =>
        item.name.toLowerCase().includes(query)
      );
    }

    return items;
  }

  get totalItemCount(): number {
    return this.allItems.length;
  }

  setActiveCategory(category: string) {
    this.activeCategory = category;
  }

  setSearchQuery(query: string) {
    this.searchQuery = query;
  }

  clearSearch() {
    this.searchQuery = "";
  }

  reset() {
    this.allItems = [];
    this.catalogByCategory = {};
    this.categories = [];
    this.activeCategory = "All";
    this.searchQuery = "";
    this.loading = false;
    this.error = null;
  }

  async fetchCatalog(locationId: string) {
    this.loading = true;
    this.error = null;

    try {
      const [catalogData, categoriesData] = await Promise.all([
        getCatalog(locationId),
        getCatalogCategories(locationId),
      ]);

      runInAction(() => {
        this.catalogByCategory = catalogData as CatalogByCategory;
        this.categories = categoriesData as CatalogCategory[];
        this.allItems = Object.values(this.catalogByCategory).flat();
        this.loading = false;
      });
    } catch (err) {
      runInAction(() => {
        this.error = {
          message: err instanceof Error ? err.message : "Failed to fetch catalog",
          code: "CATALOG_FETCH_ERROR",
        };
        this.loading = false;
      });
    }
  }
}

export const catalogStore = new CatalogStore();
