import { useState } from "react";
import { ImageOff } from "lucide-react";
import type { CatalogItem, CatalogVariation } from "../types";

interface CatalogItemCardProps {
  item: CatalogItem;
}

const formatPrice = (price: number, currency: string = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price);
};

const CatalogItemCard = ({ item }: CatalogItemCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const hasMultipleVariations = item.variations.length > 1;
  const primaryVariation = item.variations[0];
  const descriptionTruncateLength = 100;
  const shouldTruncate =
    item.description && item.description.length > descriptionTruncateLength;

  const displayDescription =
    shouldTruncate && !isExpanded
      ? `${item.description?.slice(0, descriptionTruncateLength)}...`
      : item.description;

  const renderVariations = (variations: CatalogVariation[]) => {
    return variations
      .map((v) => `${v.name} ${formatPrice(v.price, v.currency)}`)
      .join(" · ");
  };

  return (
    <article 
      className="group flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-surface-card shadow-sm transition-all duration-300 hover:shadow-md"
      aria-label={`${item.name}, ${item.category}`}
    >
      <div className="relative aspect-4/3 w-full overflow-hidden bg-surface-elevated">
        {item.image_url && !imageError ? (
          <img
            src={item.image_url}
            alt={`${item.name} product image`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center" aria-label="No image available">
            <div className="flex flex-col items-center gap-2 text-text-muted">
              <ImageOff className="h-10 w-10" aria-hidden="true" />
              <span className="text-xs">No image</span>
            </div>
          </div>
        )}

        <div className="absolute left-3 top-3">
          <span className="rounded-full bg-surface-card/90 px-2.5 py-1 text-xs font-medium text-text-secondary backdrop-blur-sm">
            {item.category}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-1 text-base font-semibold text-text-primary sm:text-lg">
          {item.name}
        </h3>

        <div className="mb-3 min-h-10">
          {item.description ? (
            <>
              <p className="text-sm leading-relaxed text-text-secondary">
                {displayDescription}
              </p>
              {shouldTruncate && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  type="button"
                  aria-expanded={isExpanded}
                  aria-label={isExpanded ? "Show less description" : "Read more description"}
                  className="mt-1 text-xs font-medium text-brand hover:text-brand-hover focus:outline-none focus:ring-2 focus:ring-brand/50 rounded"
                >
                  {isExpanded ? "Show less" : "Read more"}
                </button>
              )}
            </>
          ) : (
            <p className="text-sm italic text-text-muted">
              No description available
            </p>
          )}
        </div>

        <div className="mt-auto pt-2">
          {hasMultipleVariations ? (
            <div className="flex flex-wrap gap-1.5">
              <p className="w-full text-xs font-medium text-text-muted">
                Options:
              </p>
              <p className="text-sm font-medium text-text-primary" aria-label={`Price options: ${renderVariations(item.variations)}`}>
                {renderVariations(item.variations)}
              </p>
            </div>
          ) : (
            primaryVariation && (
              <p className="text-lg font-bold text-text-primary" aria-label={`Price: ${formatPrice(primaryVariation.price, primaryVariation.currency)}`}>
                {formatPrice(primaryVariation.price, primaryVariation.currency)}
              </p>
            )
          )}
        </div>
      </div>
    </article>
  );
};

export default CatalogItemCard;
