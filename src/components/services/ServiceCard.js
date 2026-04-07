import Link from 'next/link';
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

export default function ServiceCard({ service }) {
  if (!service) return null;

  const { id, title, category, price, price_unit, is_boosted, merchant } = service;
  const tier = TIER_LABELS[merchant?.tier];

  return (
    <Link
      href={`/services/${id}`}
      className="w-full bg-white border border-nermee-border rounded-xl p-3 flex gap-3 items-start text-left active:bg-nermee-surface transition-colors"
    >
      {/* Category icon */}
      <div className="w-12 h-12 rounded-xl bg-nermee-light flex items-center justify-center text-2xl shrink-0">
        {getCategoryIcon(category)}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-bold text-nermee-text leading-tight truncate flex-1">
            {merchant?.business_name}
          </p>
          {tier && (
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${tier.classes}`}>
              {tier.label}
            </span>
          )}
          {is_boosted && (
            <span className="text-[9px] font-bold bg-nermee-dark text-white px-1.5 py-0.5 rounded shrink-0">
              AD
            </span>
          )}
        </div>

        {/* Owner · distance */}
        <p className="text-xs text-nermee-text-sec mt-0.5 truncate">
          {merchant?.owner_name}
          {merchant?.distance_km != null && (
            <> · {merchant.distance_km} km</>
          )}
        </p>

        <div className="flex items-center justify-between mt-2">
          {/* Rating */}
          {merchant?.rating_count > 0 ? (
            <span className="flex items-center gap-0.5 text-xs text-nermee-text-sec">
              <span className="text-amber-400">★</span>
              {merchant.rating_avg.toFixed(1)}
              <span className="ml-0.5">({merchant.rating_count})</span>
            </span>
          ) : (
            <span />
          )}

          {/* Price */}
          <div className="text-right">
            <span className="text-base font-bold text-nermee-green">
              {formatPrice(price)}
            </span>
            <span className="text-xs text-nermee-text-sec ml-1">{price_unit}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
