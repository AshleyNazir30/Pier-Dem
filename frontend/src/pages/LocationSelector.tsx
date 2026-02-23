import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import LocationCard from "../components/LocationCard";
import LocationCardSkeleton from "../components/LocationCardSkeleton";
import { useStore } from "../stores/rootStore";
import type { Location } from "../types";

const LocationSelector = observer(() => {
  const navigate = useNavigate();
  const { locationStore } = useStore();
  const [savedLocation, setSavedLocation] = useLocalStorage<Location | null>(
    "selectedLocation",
    null
  );

  useEffect(() => {
    if (locationStore.locations.length === 0) {
      locationStore.fetchLocations();    
    } 
    }, [locationStore]);

  const handleSelect = (location: Location) => {
    setSavedLocation(location);
    navigate("/menu");
  };

  if (locationStore.loading) {
    return (
      <div className="flex flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-2xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 h-16 w-16 animate-pulse rounded-2xl bg-skeleton" />
            <div className="mx-auto mb-2 h-8 w-48 animate-pulse rounded-lg bg-skeleton" />
            <div className="mx-auto h-5 w-64 animate-pulse rounded-lg bg-skeleton" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <LocationCardSkeleton />
            <LocationCardSkeleton />
            <LocationCardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (locationStore.error) {
    return (
      <div className="flex flex-1 items-center justify-center px-4">
        <ErrorState
          message={locationStore.error.message}
          onRetry={() => locationStore.fetchLocations()}
        />
      </div>
    );
  }

  if (locationStore.locations.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-4">
        <EmptyState message="No locations available." />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand shadow-sm">
            <MapPin className="h-8 w-8 text-text-inverse" />
          </div>
          <h1 className="mb-2 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            Choose Your Location
          </h1>
          <p className="text-base text-text-secondary sm:text-lg">
            Select a store to explore the menu and start ordering
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {locationStore.locations.map((location, index) => (
            <LocationCard
              key={location.id}
              location={location}
              isSelected={savedLocation?.id === location.id}
              animationDelay={index * 100}
              onSelect={handleSelect}
            />
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-text-muted">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            {locationStore.locations.length} location
            {locationStore.locations.length !== 1 ? "s" : ""} available
          </span>
        </p>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
});

export default LocationSelector;

