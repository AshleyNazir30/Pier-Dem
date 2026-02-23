import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { useStore } from "../stores/rootStore";
import { useLocalStorage } from "../hooks/useLocalStorage";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import CategoryBar from "../components/CategoryBar";
import CatalogHeader from "../components/CatalogHeader";
import SearchBar from "../components/SearchBar";
import CatalogPageSkeleton from "../components/CatalogPageSkeleton";
import CatalogGrid from "../components/CatalogGrid";
import NoResults from "../components/NoResults";
import type { Location } from "../types";

const CatalogPage = observer(() => {
  const navigate = useNavigate();
  const { catalogStore } = useStore();
  const [savedLocation] = useLocalStorage<Location | null>(
    "selectedLocation",
    null
  );

  useEffect(() => {
    if (!savedLocation) {
      navigate("/");
      return;
    }

    catalogStore.fetchCatalog(savedLocation.id);

    return () => {
      catalogStore.reset();
    };
  }, [savedLocation, catalogStore, navigate]);

  const handleBackToLocations = () => {
    navigate("/");
  };

  const handleCategorySelect = (category: string) => {
    catalogStore.setActiveCategory(category);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    catalogStore.setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    catalogStore.clearSearch();
  };

  const handleClearFilters = () => {
    catalogStore.clearSearch();
    catalogStore.setActiveCategory("All");
  };

  if (catalogStore.loading) {
    return <CatalogPageSkeleton />;
  }

  if (catalogStore.error) {
    return (
      <div className="flex flex-1 items-center justify-center px-4">
        <ErrorState
          message={catalogStore.error.message}
          onRetry={() =>
            savedLocation && catalogStore.fetchCatalog(savedLocation.id)
          }
        />
      </div>
    );
  }

  if (!savedLocation) {
    return (
      <div className="flex flex-1 items-center justify-center px-4">
        <EmptyState message="Please select a location first." />
      </div>
    );
  }

  const displayItems = catalogStore.displayItems;
  const hasNoResults =
    displayItems.length === 0 &&
    (catalogStore.searchQuery || catalogStore.activeCategory !== "All");

  return (
    <div className="flex flex-1 flex-col">
      <CatalogHeader
        location={savedLocation}
        onBackToLocations={handleBackToLocations}
      />

      <SearchBar
        value={catalogStore.searchQuery}
        onChange={handleSearchChange}
        onClear={handleClearSearch}
      />

      <CategoryBar
        categories={catalogStore.categories}
        activeCategory={catalogStore.activeCategory}
        totalItemCount={catalogStore.totalItemCount}
        onSelectCategory={handleCategorySelect}
      />

      <div className="flex-1 px-4 py-4 sm:px-6 lg:px-8">
        {catalogStore.allItems.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <EmptyState message="No menu items available at this location." />
          </div>
        )}

        {hasNoResults && <NoResults onClearFilters={handleClearFilters} />}

        {displayItems.length > 0 && (
          <CatalogGrid
            items={displayItems}
            activeCategory={catalogStore.activeCategory}
            searchQuery={catalogStore.searchQuery}
          />
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
});

export default CatalogPage;