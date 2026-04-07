'use client';

import { useState, useMemo } from 'react';
import CategoryPills from '@/components/services/CategoryPills';
import ServiceCard from '@/components/services/ServiceCard';
import FeaturedServiceCard from '@/components/services/FeaturedServiceCard';
import SwipeCarousel from '@/components/ui/SwipeCarousel';
import { MOCK_SERVICES, CITIES } from '@/lib/constants';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('bayawan');

  const cityLabel = CITIES.find((c) => c.id === selectedCity)?.label ?? '';

  // All services for the selected city
  const cityServices = useMemo(() =>
    MOCK_SERVICES.filter((s) =>
      s.city.toLowerCase().includes(selectedCity === 'bayawan' ? 'bayawan' : 'dumaguete')
    ),
    [selectedCity]
  );

  // Promoted = boosted services (up to 3)
  const promotedServices = useMemo(() =>
    cityServices.filter((s) => s.is_boosted).slice(0, 3),
    [cityServices]
  );

  // Top Rated = non-boosted, sorted by rating (up to 3)
  const topRatedServices = useMemo(() =>
    cityServices
      .filter((s) => !s.is_boosted)
      .sort((a, b) => b.merchant.rating_avg - a.merchant.rating_avg)
      .slice(0, 3),
    [cityServices]
  );

  // All Services = filtered by category, boosted first
  const allServices = useMemo(() => {
    return cityServices
      .filter((s) => selectedCategory === 'all' || s.category === selectedCategory)
      .sort((a, b) => b.is_boosted - a.is_boosted);
  }, [cityServices, selectedCategory]);

  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* ── Header ─────────────────────────────────── */}
      <header className="bg-white border-b border-nermee-border px-4 pt-10 pb-3 sticky top-0 z-10">
        <div className="flex items-start justify-between mb-3">
          {/* Location + title */}
          <div>
            <div className="flex items-center gap-1 text-xs text-nermee-text-sec font-medium mb-0.5">
              <span>📍</span>
              <span>{cityLabel}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-nermee-text tracking-tight">Nermee</h1>
          </div>

          {/* Profile avatar */}
          <button className="w-11 h-11 rounded-xl bg-nermee-green flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
          </button>
        </div>

        {/* Search bar */}
        <button className="w-full flex items-center gap-2 bg-nermee-surface rounded-xl px-3 py-3 text-sm text-nermee-text-sec">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          Search services…
        </button>
      </header>

      {/* ── Category pills ──────────────────────────── */}
      <CategoryPills selected={selectedCategory} onSelect={setSelectedCategory} />

      {/* ── Main content ───────────────────────────── */}
      <main className="flex-1 pb-28">

        {/* Show Promoted + Top Rated only on "All" tab */}
        {selectedCategory === 'all' && (
          <>
            {/* ── Promoted ─────────────────────────── */}
            {promotedServices.length > 0 && (
              <section className="px-4 mb-5">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-bold text-nermee-text">Promoted</h2>
                  <span className="text-xs font-semibold text-nermee-green">Sponsored</span>
                </div>
                <SwipeCarousel
                  items={promotedServices}
                  renderItem={(service) => (
                    <FeaturedServiceCard service={service} showAd />
                  )}
                />
              </section>
            )}

            {/* ── Top Rated ────────────────────────── */}
            {topRatedServices.length > 0 && (
              <section className="px-4 mb-5">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-bold text-nermee-text">Top Rated</h2>
                  <button className="text-xs font-semibold text-nermee-green">See all</button>
                </div>
                <SwipeCarousel
                  items={topRatedServices}
                  renderItem={(service) => (
                    <FeaturedServiceCard service={service} showAd={false} />
                  )}
                />
              </section>
            )}
          </>
        )}

        {/* ── All Services ─────────────────────────── */}
        <section className="px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-nermee-text">
              {selectedCategory === 'all' ? 'All Services' : (
                <>
                  {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
                </>
              )}
              <span className="ml-2 text-sm font-normal text-nermee-text-sec">
                ({allServices.length})
              </span>
            </h2>
            <button className="text-xs font-semibold text-nermee-green">Filter</button>
          </div>

          {allServices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <span className="text-5xl mb-4">🔍</span>
              <p className="text-sm font-semibold text-nermee-text">No services found</p>
              <p className="text-xs text-nermee-text-sec mt-1">
                Try a different category or switch cities.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {allServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </section>
      </main>

    </div>
  );
}
