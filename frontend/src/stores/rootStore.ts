// src/stores/rootStore.ts
import React, { useContext } from "react";
import { locationStore } from "./locationStore";
import { catalogStore } from "./catalogStore";
import { themeStore } from "./themeStore";

export const stores = {
  locationStore,
  catalogStore,
  themeStore,
};

export type RootStore = typeof stores;

export const StoreContext = React.createContext(stores);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
