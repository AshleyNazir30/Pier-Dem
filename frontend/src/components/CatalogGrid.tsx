import type { CatalogItem } from "../types";
import CatalogItemCard from "./CatalogItemCard";

interface CatalogGridProps {
  items: CatalogItem[];
  activeCategory: string;
  searchQuery: string;
}

const CatalogGrid = ({ items, activeCategory, searchQuery }: CatalogGridProps) => {
  return (
    <section aria-label="Menu items">
      <p className="mb-4 text-sm text-text-muted" role="status" aria-live="polite">
        Showing {items.length} item
        {items.length !== 1 ? "s" : ""}
        {activeCategory !== "All" && ` in ${activeCategory}`}
        {searchQuery && ` matching "${searchQuery}"`}
      </p>

      <div 
        id="catalog-items"
        role="tabpanel"
        aria-label={`${activeCategory} menu items`}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {items.map((item, index) => (
          <div
            key={item.id}
            style={{
              animationName: "fadeInUp",
              animationDuration: "0.4s",
              animationTimingFunction: "ease-out",
              animationFillMode: "forwards",
              animationDelay: `${index * 50}ms`,
            }}
          >
            <CatalogItemCard item={item} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default CatalogGrid;
