const LocationCardSkeleton = () => (
  <div className="animate-pulse rounded-2xl border border-border/50 bg-surface-card p-5">
    <div className="flex items-start gap-4">
      <div className="h-12 w-12 rounded-xl bg-skeleton" />
      <div className="flex-1 space-y-3">
        <div className="h-5 w-3/4 rounded-lg bg-skeleton" />
        <div className="h-4 w-full rounded-lg bg-skeleton" />
        <div className="flex gap-3">
          <div className="h-4 w-20 rounded-lg bg-skeleton" />
          <div className="h-4 w-16 rounded-lg bg-skeleton" />
        </div>
      </div>
      <div className="h-10 w-10 rounded-full bg-skeleton" />
    </div>
  </div>
);

export default LocationCardSkeleton;
