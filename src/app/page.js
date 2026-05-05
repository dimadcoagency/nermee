'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CategoryPills from '@/components/services/CategoryPills';
import ServiceCard from '@/components/services/ServiceCard';
import FeaturedServiceCard from '@/components/services/FeaturedServiceCard';
import SwipeCarousel from '@/components/ui/SwipeCarousel';
import { useAuth } from '@/contexts/AuthContext';
import { useServices } from '@/lib/hooks/useServices';
import { CITIES } from '@/lib/constants';

// ── Landing page for unauthenticated users ──────────────────────────────────
function LandingPage() {
  const router = useRouter();

  return (
    <div className="relative flex flex-col min-h-screen bg-white overflow-hidden">

      {/* Top-right coral blob */}
      <div
        className="absolute -top-24 -right-24 w-72 h-72 rounded-full"
        style={{ background: '#FFB3B3', opacity: 0.6 }}
      />

      {/* Bottom-right coral blob */}
      <div
        className="absolute -bottom-20 -right-16 w-64 h-64 rounded-full"
        style={{ background: '#FF5757', opacity: 0.85 }}
      />

      {/* Center content */}
      <div className="relative flex flex-col items-center justify-center flex-1 px-8 z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-12">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo.png"
            alt="Nearmee"
            style={{ height: '52px', width: 'auto', display: 'block' }}
          />
        </div>

        {/* Tagline */}
        <p className="text-sm text-nearmee-text-sec text-center -mt-8 mb-16">
          Services at your doorstep.
        </p>
      </div>

      {/* Buttons */}
      <div className="relative z-10 px-8 pb-16 flex flex-col gap-4">
        <button
          onClick={() => router.push('/auth/login')}
          className="w-full py-4 rounded-2xl bg-nearmee-coral text-white text-base font-bold active:opacity-90 transition-opacity"
        >
          Log In
        </button>
        <button
          onClick={() => router.push('/auth/login')}
          className="w-full py-4 rounded-2xl text-white text-base font-bold active:opacity-90 transition-opacity"
          style={{ background: '#6B6B6B' }}
        >
          Sign up
        </button>
      </div>
    </div>
  );
}

// ── Home feed for authenticated users ───────────────────────────────────────
export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('bayawan');

  const cityLabel = CITIES.find((c) => c.id === selectedCity)?.label ?? '';
  const cityName = selectedCity === 'bayawan' ? 'Bayawan City' : 'Dumaguete City';

  const { services, loading: feedLoading } = useServices({
    city: cityName,
    category: selectedCategory,
  });

  const promotedServices = services.filter((s) => s.is_boosted).slice(0, 3);
  const topRatedServices = services
    .filter((s) => !s.is_boosted)
    .sort((a, b) => (b.merchant?.rating_avg ?? 0) - (a.merchant?.rating_avg ?? 0))
    .slice(0, 3);
  const allServices = [...services].sort((a, b) => b.is_boosted - a.is_boosted);

  const loading = authLoading;

  // Show loading spinner briefly
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-8 h-8 border-2 border-nearmee-coral border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Show landing page to unauthenticated users
  if (!user) return <LandingPage />;

  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* ── Header ─────────────────────────────────── */}
      <header className="bg-white border-b border-nearmee-border px-4 pt-10 pb-3 sticky top-0 z-10">
        <div className="flex items-start justify-between mb-3">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo.png"
              alt="Nearmee"
              style={{ height: '36px', width: 'auto', display: 'block' }}
            />
            <div className="flex items-center gap-1 text-xs text-nearmee-text-sec font-medium mt-0.5">
              <span>📍</span>
              <span>{cityLabel}</span>
            </div>
          </div>
          <button className="w-11 h-11 rounded-xl bg-nearmee-coral flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
          </button>
        </div>
        <button onClick={() => router.push('/search')} className="w-full flex items-center gap-2 bg-nearmee-surface rounded-xl px-3 py-3 text-sm text-nearmee-text-sec">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          Search services…
        </button>
      </header>

      {/* ── City toggle ─────────────────────────────── */}
      <div className="flex gap-2 px-4 pt-3">
        {CITIES.map((city) => (
          <button
            key={city.id}
            onClick={() => setSelectedCity(city.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              selectedCity === city.id
                ? 'bg-nearmee-coral text-white border-nearmee-coral'
                : 'bg-white text-nearmee-text-sec border-nearmee-border'
            }`}
          >
            {city.label}
          </button>
        ))}
      </div>

      {/* ── Category pills ──────────────────────────── */}
      <CategoryPills selected={selectedCategory} onSelect={setSelectedCategory} />

      {/* ── Main content ───────────────────────────── */}
      <main className="flex-1 pb-28">
        {feedLoading && (
          <div className="flex justify-center py-12">
            <div className="w-7 h-7 border-2 border-nearmee-coral border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {!feedLoading && selectedCategory === 'all' && (
          <>
            {promotedServices.length > 0 && (
              <section className="px-4 mb-5">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-bold text-nearmee-text">Promoted</h2>
                  <span className="text-xs font-semibold text-nearmee-coral">Sponsored</span>
                </div>
                <SwipeCarousel items={promotedServices} renderItem={(s) => <FeaturedServiceCard service={s} showAd />} />
              </section>
            )}
            {topRatedServices.length > 0 && (
              <section className="px-4 mb-5">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-bold text-nearmee-text">Top Rated</h2>
                  <button className="text-xs font-semibold text-nearmee-coral">See all</button>
                </div>
                <SwipeCarousel items={topRatedServices} renderItem={(s) => <FeaturedServiceCard service={s} showAd={false} />} />
              </section>
            )}
          </>
        )}

        {!feedLoading && <section className="px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-nearmee-text">
              {selectedCategory === 'all' ? 'All Services' : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
              <span className="ml-2 text-sm font-normal text-nearmee-text-sec">({allServices.length})</span>
            </h2>
            <button className="text-xs font-semibold text-nearmee-coral">Filter</button>
          </div>
          {allServices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <span className="text-5xl mb-4">🔍</span>
              <p className="text-sm font-semibold text-nearmee-text">No services found</p>
              <p className="text-xs text-nearmee-text-sec mt-1">Try a different category or switch cities.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {allServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </section>}
      </main>
    </div>
  );
}
