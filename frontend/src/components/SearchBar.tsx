import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  placeholder?: string;
}

const SearchBar = ({
  value,
  onChange,
  onClear,
  placeholder = "Search menu items...",
}: SearchBarProps) => {
  return (
    <div className="px-4 py-4 sm:px-6 lg:px-8">
      <div className="relative" role="search">
        <Search 
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" 
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          aria-label="Search menu items"
          className="w-full rounded-xl border border-border bg-surface py-3 pl-12 pr-10 text-sm text-text-primary placeholder:text-text-muted transition-all duration-200 focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-border-focus/10"
        />
        {value && (
          <button
            onClick={onClear}
            type="button"
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-text-muted hover:bg-surface-elevated hover:text-text-secondary focus:outline-none focus:ring-2 focus:ring-brand/50"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
