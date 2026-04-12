'use client';

import { useState, useMemo } from 'react';
import ServiceCard from '@/components/services/ServiceCard';
import { MOCK_SERVICES, CATEGORIES } from '@/lib/constants';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = CATEGORIES.filter((c) => c.id !== 'all');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_SERVICES.filter((s) => {
      const matchesQuery =
        q === '' ||
        s.title.toLowerCase().includes(q) ||
        s.merchant.business_name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q);
      const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
      return matchesQuery && matchesCategory;
    }).sort((a, b) => b.is_boosted - a.is_boosted);
  }, [query, selectedCategory]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header + search input */}
      <header className="bg-white border-b border-nearmee-border px-4 pt-12 pb-3 sticky top-0 z-10">
        <h1 className="text-2xl font-extrabold text-nearmee-text mb-3">Search</h1>

        {/* Search input */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-nearmee-text-sec"
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services, plumbing, rides…"
            className="w-full bg-nearmee-surface rounded-xl pl-9 pr-9 py-3 text-sm text-nearmee-text placeholder:text-nearmee-text-sec outline-none focus:ring-2 focus:ring-nearmee-coral"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-nearmee-text-sec"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* Category filter pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mt-3 pb-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-nearmee-coral text-white'
                : 'bg-nearmee-surface text-nearmee-text-sec'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-nearmee-coral text-white'
                  : 'bg-nearmee-surface text-nearmee-text-sec'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 px-4 py-4 pb-28">
        {query === '' && selectedCategory === 'all' ? (
          /* Empty prompt */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-5xl mb-4">🔍</span>
            <p className="text-sm font-semibold text-nearmee-text">Find a service near you</p>
            <p className="text-xs text-nearmee-text-sec mt-1">
              Try "plumbing", "meals", or "cleaning"
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-5xl mb-4">😔</span>
            <p className="text-sm font-semibold text-nearmee-text">No results found</p>
            <p className="text-xs text-nearmee-text-sec mt-1">Try a different keyword or category.</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-nearmee-text-sec mb-3">
              {results.length} result{results.length !== 1 ? 's' : ''}
              {query && <> for "<span className="font-semibold text-nearmee-text">{query}</span>"</>}
            </p>
            <div className="flex flex-col gap-3">
              {results.map((service) => (
                <ServiceCard key={service.id} service={service} onClick={() => {}} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
