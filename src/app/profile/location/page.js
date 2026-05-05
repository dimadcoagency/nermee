'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { CITIES } from '@/lib/constants';

export default function LocationPage() {
  const router = useRouter();
  const { user, profile, refreshProfile } = useAuth();
  const supabase = createClient();
  const [selected, setSelected] = useState('bayawan');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile?.city?.toLowerCase().includes('dumaguete')) {
      setSelected('dumaguete');
    } else {
      setSelected('bayawan');
    }
  }, [profile]);

  async function handleSave(cityId) {
    setSelected(cityId);
    setLoading(true);
    const cityLabel = CITIES.find((c) => c.id === cityId)?.label ?? 'Bayawan City';
    await supabase.from('profiles').update({ city: cityLabel }).eq('id', user.id);
    await refreshProfile();
    setLoading(false);
    router.back();
  }

  const CITY_INFO = {
    bayawan: {
      desc: 'Bayawan City, Negros Oriental',
      pop: '126,000+ population',
      note: 'Our founding city 🏙️',
    },
    dumaguete: {
      desc: 'Dumaguete City, Negros Oriental',
      pop: '142,000+ population',
      note: 'UNESCO Creative City 🎓',
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="flex items-center gap-3 px-4 pt-12 pb-4 border-b border-nearmee-border sticky top-0 bg-white z-10">
        <button onClick={() => router.back()} className="p-1 -ml-1 text-nearmee-text-sec">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <div>
          <h1 className="text-base font-bold text-nearmee-text">My Location</h1>
          <p className="text-xs text-nearmee-text-sec">Choose your city to see nearby services</p>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 flex flex-col gap-4">
        <p className="text-xs text-nearmee-text-sec">
          Your location determines which services appear on your home feed. You can change this anytime.
        </p>

        {CITIES.map((city) => {
          const info = CITY_INFO[city.id];
          const isActive = selected === city.id;
          return (
            <button
              key={city.id}
              onClick={() => handleSave(city.id)}
              disabled={loading}
              className={`w-full flex items-start gap-4 p-4 rounded-2xl border-2 text-left transition-colors ${
                isActive
                  ? 'border-nearmee-coral bg-nearmee-light'
                  : 'border-nearmee-border bg-white active:bg-nearmee-surface'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center ${
                isActive ? 'border-nearmee-coral' : 'border-nearmee-border'
              }`}>
                {isActive && <span className="w-2.5 h-2.5 rounded-full bg-nearmee-coral block" />}
              </div>
              <div className="flex-1">
                <p className={`text-base font-bold ${isActive ? 'text-nearmee-coral' : 'text-nearmee-text'}`}>
                  {city.label}
                </p>
                <p className="text-xs text-nearmee-text-sec mt-0.5">{info.desc}</p>
                <p className="text-xs text-nearmee-text-sec">{info.pop}</p>
                <p className="text-xs font-semibold text-nearmee-coral mt-1">{info.note}</p>
              </div>
              {isActive && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF5757" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          );
        })}

        <div className="bg-nearmee-surface rounded-xl p-4 mt-2">
          <p className="text-xs text-nearmee-text-sec leading-relaxed">
            📍 More cities coming soon. Nearmee is currently serving Bayawan City and Dumaguete City, Negros Oriental, Philippines.
          </p>
        </div>
      </main>
    </div>
  );
}
