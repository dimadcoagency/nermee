'use client';

import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { MOCK_SERVICES, CATEGORIES } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';

// Leaflet must be client-only (no SSR)
const MerchantMap = dynamic(() => import('@/components/services/MerchantMap'), { ssr: false });

const TIER_LABELS = {
  pro:      { label: 'PRO', classes: 'bg-nearmee-coral text-white' },
  business: { label: 'BIZ', classes: 'bg-nearmee-dark text-white' },
};

function getCategoryIcon(categoryId) {
  return CATEGORIES.find((c) => c.id === categoryId)?.icon ?? '🛠️';
}

function StarRating({ avg, count }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1,2,3,4,5].map((s) => (
          <span key={s} className={`text-base ${s <= Math.round(avg) ? 'text-amber-400' : 'text-nearmee-border'}`}>★</span>
        ))}
      </div>
      <span className="text-sm font-semibold text-nearmee-text">{avg.toFixed(1)}</span>
      <span className="text-sm text-nearmee-text-sec">({count} reviews)</span>
    </div>
  );
}

export default function ServiceDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const service = useMemo(() => MOCK_SERVICES.find((s) => s.id === id), [id]);

  if (!service) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <span className="text-5xl mb-4">😕</span>
        <p className="text-base font-bold text-nearmee-text">Service not found</p>
        <Link href="/" className="mt-4 text-sm text-nearmee-coral font-semibold">Go back home</Link>
      </div>
    );
  }

  const { title, description, category, price, price_unit, city, is_boosted, lat, lng, availability, merchant } = service;
  const tier = TIER_LABELS[merchant?.tier];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* ── Header ─────────────────────────────────── */}
      <header className="flex items-center gap-3 px-4 pt-12 pb-3 bg-white border-b border-nearmee-border sticky top-0 z-10">
        <button onClick={() => router.back()} className="p-1 -ml-1 text-nearmee-text-sec">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-base font-bold text-nearmee-text flex-1 truncate">{title}</h1>
        {is_boosted && (
          <span className="text-[9px] font-bold bg-nearmee-dark text-white px-1.5 py-0.5 rounded shrink-0">AD</span>
        )}
      </header>

      <main className="flex-1 pb-32">
        {/* ── Hero icon block ─────────────────────── */}
        <div className="bg-nearmee-surface flex items-center justify-center h-40 border-b border-nearmee-border">
          <span className="text-7xl">{getCategoryIcon(category)}</span>
        </div>

        {/* ── Service info ────────────────────────── */}
        <section className="px-4 py-4 border-b border-nearmee-border">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-lg font-extrabold text-nearmee-text leading-tight flex-1">{title}</h2>
            {tier && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${tier.classes}`}>
                {tier.label}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-2xl font-extrabold text-nearmee-coral">{formatPrice(price)}</span>
            <span className="text-sm text-nearmee-text-sec">{price_unit}</span>
          </div>

          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-nearmee-text-sec">
            <span>📍</span>
            <span>{city}</span>
          </div>

          {description && (
            <p className="text-sm text-nearmee-text-sec mt-3 leading-relaxed">{description}</p>
          )}
        </section>

        {/* ── Merchant info ───────────────────────── */}
        <section className="px-4 py-4 border-b border-nearmee-border">
          <p className="text-xs font-bold text-nearmee-text-sec uppercase tracking-widest mb-3">Provider</p>

          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-nearmee-coral flex items-center justify-center shrink-0">
              <span className="text-base font-bold text-white">
                {merchant.owner_name.split(' ').map((n) => n[0]).join('').slice(0,2).toUpperCase()}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-nearmee-text truncate">{merchant.business_name}</p>
                {merchant.is_verified && (
                  <span className="text-nearmee-coral text-sm shrink-0" title="Verified">✓</span>
                )}
              </div>
              <p className="text-xs text-nearmee-text-sec mt-0.5">{merchant.owner_name} · {merchant.distance_km} km away</p>
              {merchant.rating_count > 0 && (
                <div className="mt-1">
                  <StarRating avg={merchant.rating_avg} count={merchant.rating_count} />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Map ─────────────────────────────────── */}
        {lat && lng && (
          <section className="px-4 py-4 border-b border-nearmee-border">
            <p className="text-xs font-bold text-nearmee-text-sec uppercase tracking-widest mb-3">Location</p>
            <MerchantMap lat={lat} lng={lng} businessName={merchant.business_name} />
            <p className="text-xs text-nearmee-text-sec mt-2 text-center">
              Approximate location · {merchant.distance_km} km from you
            </p>
          </section>
        )}

        {/* ── Available Schedule ──────────────────── */}
        {availability && availability.length > 0 && (
          <section className="px-4 py-4">
            <p className="text-xs font-bold text-nearmee-text-sec uppercase tracking-widest mb-3">Available Times</p>
            <div className="flex flex-wrap gap-2">
              {availability.map((slot) => (
                <span
                  key={slot}
                  className="px-3 py-1.5 rounded-lg border border-nearmee-border text-xs font-semibold text-nearmee-text bg-white"
                >
                  {slot}
                </span>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ── Sticky Book Now CTA ─────────────────── */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-app bg-white border-t border-nearmee-border px-4 py-3 safe-bottom z-10">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-xs text-nearmee-text-sec">Starting from</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-nearmee-text">{formatPrice(price)}</span>
              <span className="text-xs text-nearmee-text-sec">{price_unit}</span>
            </div>
          </div>
          <button
            onClick={() => router.push(`/booking/${service.id}`)}
            className="bg-nearmee-coral text-white px-8 py-3.5 rounded-xl text-sm font-bold active:opacity-90"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
