const CatalogItemSkeleton = () => (
  <div className="animate-pulse overflow-hidden rounded-2xl border border-border/50 bg-surface-card">
    <div className="aspect-[4/3] w-full bg-skeleton" />
    <div className="p-4">
      <div className="mb-2 h-5 w-3/4 rounded-lg bg-skeleton" />
      <div className="mb-1 h-4 w-full rounded-lg bg-skeleton" />
      <div className="mb-3 h-4 w-2/3 rounded-lg bg-skeleton" />
      <div className="h-6 w-20 rounded-lg bg-skeleton" />
    </div>
  </div>
);

export default CatalogItemSkeleton;
