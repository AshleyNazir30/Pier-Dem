
export const CACHE_TTL = {
  LOCATIONS: 600,     // 10 minutes as locations rarely change
  CATALOG: 300,       // 5 minutes as catalog items may change more frequently
  CATEGORIES: 300,    // 5 minutes as categories may change more frequently
} as const;


export const CACHE_KEYS = {
  LOCATIONS: "locations",
  CATALOG: "catalog",
  CATEGORIES: "categories",
} as const;


export const DEFAULT_CACHE_TTL = 300;

export const REDIS_KEY_PREFIX = "perdiem:";

export const DEFAULT_PORT = 4000;
