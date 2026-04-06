import { formatPrice } from '@/lib/utils';
import { CATEGORIES } from '@/lib/constants';

function getCategoryIcon(categoryId) {
  const cat = CATEGORIES.find((c) => c.id === categoryId);
  return cat?.icon ?? '🛠️';
}

const TIER_LABELS = {
  pro:      { label: 'PRO', classes: 'bg-nermee-green text-white' },
  business: { label: 'BIZ', classes: 'bg-nermee-dark text-white' },
};

export default function FeaturedServiceCard({ service, showAd = false, onClick }) {
  if (!service) return null;

  const { title, category, price, price_unit, merchant } = service;
  const tier = TIER_LABELS[merchant?.tier];

  return (
    <button
      onClick={() => onClick?.(service)}
      className="w-full bg-white border border-nermee-border rounded-xl overflow-hidden flex gap-4 items-center p-4 text-left active:bg-nermee-surface transition-colors"
    >
      {/* Icon */}
      <div className="relative bg-nermee-surface rounded-xl w-20 h-20 flex items-center justify-center shrink-0">
        <span className="text-4xl">{getCategoryIcon(category)}</span>
        {showAd && (
          <span className="absolute top-1.5 right-1.5 text-[9px] font-bold bg-nermee-dark text-white rounded px-1 py-0.5 leading-none">
            AD
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        {/* Business name + tier */}
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-nermee-text truncate flex-1">
            {merchant?.business_name}
          </p>
          {tier && (
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${tier.classes}`}>
              {tier.label}
            </span>
          )}
        </div>

        {/* Title */}
        <p className="text-xs text-nermee-text-sec mt-0.5 line-clamp-2 leading-relaxed">
          {title}
        </p>

        {/* Owner · distance */}
        <p className="text-xs text-nermee-text-sec mt-1 truncate">
          {merchant?.owner_name}
          {merchant?.distance_km != null && <> · {merchant.distance_km} km</>}
        </p>

        {/* Rating + price */}
        <div className="flex items-center justify-between mt-2">
          {merchant?.rating_count > 0 ? (
            <span className="flex items-center gap-0.5 text-xs text-nermee-text-sec">
              <span className="text-amber-400">★</span>
              {merchant.rating_avg.toFixed(1)}
              <span className="ml-0.5">({merchant.rating_count})</span>
            </span>
          ) : <span />}
          <div>
            <span className="text-base font-bold text-nermee-green">{formatPrice(price)}</span>
            <span className="text-xs text-nermee-text-sec ml-1">{price_unit}</span>
          </div>
        </div>
      </div>
    </button>
  );
}
