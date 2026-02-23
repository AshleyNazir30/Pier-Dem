import { observer } from "mobx-react-lite";
import { LayoutGrid } from "lucide-react";
import type { CatalogCategory } from "../types";

interface CategoryBarProps {
  categories: CatalogCategory[];
  activeCategory: string;
  totalItemCount: number;
  onSelectCategory: (category: string) => void;
}

const CategoryBar = observer(
  ({
    categories,
    activeCategory,
    totalItemCount,
    onSelectCategory,
  }: CategoryBarProps) => {
    const handleKeyDown = (e: React.KeyboardEvent, category: string) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelectCategory(category);
      }
    };

    return (
      <div className="sticky top-0 z-10 bg-surface-page/95 backdrop-blur-sm">
        <nav aria-label="Category navigation">
          <div className="overflow-x-auto scrollbar-hide">
            <div 
              className="flex gap-2 px-4 py-3 sm:px-6 lg:px-8"
              role="tablist"
              aria-label="Menu categories"
            >
              <button
                role="tab"
                aria-selected={activeCategory === "All"}
                aria-controls="catalog-items"
                onClick={() => onSelectCategory("All")}
                onKeyDown={(e) => handleKeyDown(e, "All")}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:ring-offset-2 ${
                  activeCategory === "All"
                    ? "bg-brand text-text-inverse shadow-sm"
                    : "bg-surface-card text-text-secondary hover:bg-surface-elevated hover:text-text-primary"
                }`}
              >
                <LayoutGrid className="h-4 w-4" aria-hidden="true" />
                All
                <span
                  className={`rounded-full px-1.5 py-0.5 text-xs ${
                    activeCategory === "All"
                      ? "bg-surface/20 text-text-inverse"
                      : "bg-surface-elevated text-text-muted"
                  }`}
                  aria-label={`${totalItemCount} items`}
                >
                  {totalItemCount}
                </span>
              </button>

              {categories.map((category) => (
                <button
                  key={category.id}
                  role="tab"
                  aria-selected={activeCategory === category.name}
                  aria-controls="catalog-items"
                  onClick={() => onSelectCategory(category.name)}
                  onKeyDown={(e) => handleKeyDown(e, category.name)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:ring-offset-2 ${
                    activeCategory === category.name
                      ? "bg-brand text-text-inverse shadow-sm"
                      : "bg-surface-card text-text-secondary hover:bg-surface-elevated hover:text-text-primary"
                  }`}
                >
                  {category.name}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-xs ${
                      activeCategory === category.name
                        ? "bg-surface/20 text-text-inverse"
                        : "bg-surface-elevated text-text-muted"
                    }`}
                    aria-label={`${category.item_count} items`}
                  >
                    {category.item_count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </nav>
      </div>
    );
  }
);

export default CategoryBar;
