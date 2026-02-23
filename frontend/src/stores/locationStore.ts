import { makeAutoObservable, runInAction } from "mobx";
import type { Location, ApiError } from "../types";
import { getLocations } from "../services/locationApi";

class LocationStore {
  locations: Location[] = [];
  loading = false;
  error: ApiError | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchLocations() {
    this.loading = true;
    this.error = null;

    try {
      const data = await getLocations();
      runInAction(() => {
        this.locations = data;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err as ApiError || {
          message: "An unknown error occurred",
          code: "UNKNOWN_ERROR",
        };
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}

export const locationStore = new LocationStore();
