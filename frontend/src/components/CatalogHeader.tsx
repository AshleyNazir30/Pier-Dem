import { MapPin, Coffee } from "lucide-react";
import type { Location } from "../types";

interface CatalogHeaderProps {
  location: Location;
  onBackToLocations: () => void;
}

const CatalogHeader = ({ location, onBackToLocations }: CatalogHeaderProps) => {
  return (
    <div className="border-b border-border/50 bg-surface-card px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToLocations}
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-text-inverse transition-colors hover:bg-brand-hover"
        >
          <MapPin className="h-4 w-4" />
          <span className="hidden sm:inline">Pick Another Location</span>
          <span className="sm:hidden">Change</span>
        </button>

        <div className="flex items-center gap-2 rounded-lg bg-surface-elevated px-3 py-1.5 text-sm">
          <Coffee className="h-4 w-4 text-brand" />
          <span className="font-medium text-text-primary">{location.name}</span>
        </div>
      </div>
    </div>
  );
};

export default CatalogHeader;
