import { Store, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import type { Location } from "../types";

interface LocationCardProps {
  location: Location;
  isSelected: boolean;
  animationDelay?: number;
  onSelect: (location: Location) => void;
}

const LocationCard = ({
  location,
  isSelected,
  animationDelay = 0,
  onSelect,
}: LocationCardProps) => {
  const isActive = location.status === "ACTIVE";

  const formatTimezone = (tz: string) => {
    return tz.replace(/_/g, " ").split("/").pop() || tz;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(location);
    }
  };

  return (
    <button
      onClick={() => onSelect(location)}
      onKeyDown={handleKeyDown}
      aria-label={`Select ${location.name} location. ${isActive ? "Currently open" : "Currently closed"}. ${location.address}`}
      aria-pressed={isSelected}
      className={`group relative flex w-full flex-col rounded-2xl border bg-surface-card p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand/50 focus:ring-offset-2 ${
        isSelected
          ? "border-brand/50 ring-2 ring-brand/20"
          : "border-border/50 hover:border-brand/30"
      }`}
      style={{
        animationDelay: `${animationDelay}ms`,
        animation: "fadeInUp 0.5s ease-out forwards",
      }}
    >
      {isSelected && (
        <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-brand shadow-md" aria-hidden="true">
          <CheckCircle2 className="h-4 w-4 text-text-inverse" />
        </div>
      )}

      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
            isSelected
              ? "bg-brand/10 text-brand"
              : "bg-surface-elevated text-text-secondary group-hover:bg-brand/10 group-hover:text-brand"
          }`}
          aria-hidden="true"
        >
          <Store className="h-6 w-6" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <h3 className="truncate text-base font-semibold text-text-primary sm:text-lg">
              {location.name}
            </h3>
          </div>

=          <p className="mb-3 line-clamp-2 text-sm text-text-secondary">
            {location.address}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-1 font-medium ${
                isActive
                  ? "bg-success-light text-success-text"
                  : "bg-neutral-light text-neutral-text"
              }`}
              role="status"
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isActive ? "bg-success" : "bg-neutral"
                }`}
                aria-hidden="true"
              />
              {isActive ? "Open" : "Closed"}
            </span>

            <span className="inline-flex items-center gap-1 text-text-muted">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              <span aria-label={`Timezone: ${formatTimezone(location.timezone)}`}>
                {formatTimezone(location.timezone)}
              </span>
            </span>
          </div>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-elevated text-text-muted transition-all duration-300 group-hover:bg-brand group-hover:text-text-inverse" aria-hidden="true">
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </div>
      </div>
    </button>
  );
};

export default LocationCard;
