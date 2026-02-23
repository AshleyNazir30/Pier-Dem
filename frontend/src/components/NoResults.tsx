import { Search } from "lucide-react";

interface NoResultsProps {
  onClearFilters: () => void;
}

const NoResults = ({ onClearFilters }: NoResultsProps) => {
  return (
    <div 
      className="flex h-64 flex-col items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <Search className="mb-3 h-12 w-12 text-text-muted" aria-hidden="true" />
      <p className="text-lg font-medium text-text-primary">No items found</p>
      <p className="mt-1 text-sm text-text-secondary">
        Try adjusting your search or filter criteria
      </p>
      <button
        onClick={onClearFilters}
        type="button"
        aria-label="Clear all filters and search"
        className="mt-4 rounded-xl bg-brand px-4 py-2 text-sm font-medium text-text-inverse transition-colors hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-brand/50 focus:ring-offset-2"
      >
        Clear filters
      </button>
    </div>
  );
};

export default NoResults;
