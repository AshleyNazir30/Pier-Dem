import CatalogItemSkeleton from "./CatalogItemSkeleton";

const CatalogPageSkeleton = () => {
  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b border-border/50 bg-surface-card px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="h-10 w-40 animate-pulse rounded-xl bg-skeleton" />
          <div className="h-6 w-32 animate-pulse rounded-lg bg-skeleton" />
        </div>
      </div>

      <div className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="h-12 w-full animate-pulse rounded-xl bg-skeleton" />
      </div>

      <div className="flex gap-2 overflow-hidden px-4 py-3 sm:px-6 lg:px-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-10 w-24 shrink-0 animate-pulse rounded-full bg-skeleton"
          />
        ))}
      </div>

      <div className="flex-1 px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CatalogItemSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CatalogPageSkeleton;
