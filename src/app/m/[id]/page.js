'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/Toast';
import { CATEGORIES } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';

function getCategoryIcon(id) {
  return CATEGORIES.find((c) => c.id === id)?.icon ?? '🛠️';
}

export default function MerchantProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { show: showToast } = useToast();
  const supabase = createClient();

  const [merchant, setMerchant] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [merchantRes, servicesRes] = await Promise.all([
        supabase.from('merchants')
          .select('id, business_name, bio, service_area, category, tier, is_verified, rating_avg, rating_count')
          .eq('id', id)
          .single(),
        supabase.from('services')
          .select('id, title, description, category, price, price_unit, is_boosted')
          .eq('merchant_id', id)
          .eq('status', 'active')
          .order('is_boosted', { ascending: false }),
      ]);
      setMerchant(merchantRes.data);
      setServices(servicesRes.data ?? []);
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleShareProfile() {
    const url = `https://nearmee.app/m/${id}`;
    const title = `${merchant?.business_name} on Nearmee`;
    if (navigator.share) {
      await navigator.share({ title, url, text: `Book services from ${merchant?.business_name} on Nearmee.` });
    } else {
      await navigator.clipboard.writeText(url);
      showToast('Profile link copied!');
    }
  }

  async function handleShareService(service) {
    const url = `https://nearmee.app/services/${service.id}`;
    if (navigator.share) {
      await navigator.share({ title: service.title, url, text: `Book ${service.title} on Nearmee.` });
    } else {
      await navigator.clipboard.writeText(url);
      showToast('Service link copied!');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-nearmee-coral border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!merchant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
        <span className="text-5xl mb-4">😕</span>
        <p className="text-base font-bold text-nearmee-text">Merchant not found</p>
        <button onClick={() => router.push('/')} className="mt-4 text-sm text-nearmee-coral font-semibold">
          Go back home
        </button>
      </div>
    );
  }

  const initials = merchant.business_name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col min-h-screen bg-nearmee-surface">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 pt-12 pb-3 bg-white border-b border-nearmee-border sticky top-0 z-10">
        <button onClick={() => router.back()} className="p-1 -ml-1 text-nearmee-text-sec">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-base font-bold text-nearmee-text flex-1 truncate">{merchant.business_name}</h1>
        <button onClick={handleShareProfile} className="p-1.5 text-nearmee-text-sec active:text-nearmee-coral shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        </button>
      </header>

      <main className="flex-1 pb-16">
        {/* Merchant card */}
        <div className="bg-white px-4 py-6 border-b border-nearmee-border">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-nearmee-coral flex items-center justify-center shrink-0">
              <span className="text-xl font-bold text-white">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-extrabold text-nearmee-text">{merchant.business_name}</h2>
                {merchant.is_verified && (
                  <span className="text-[10px] font-bold bg-green-50 text-green-600 px-2 py-0.5 rounded-full">✓ Verified</span>
                )}
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  merchant.tier === 'business' ? 'bg-nearmee-dark text-white' :
                  merchant.tier === 'pro' ? 'bg-nearmee-coral text-white' :
                  'bg-nearmee-surface text-nearmee-text-sec'
                }`}>
                  {merchant.tier === 'business' ? 'BIZ' : merchant.tier === 'pro' ? 'PRO' : 'FREE'}
                </span>
              </div>
              <p className="text-xs text-nearmee-text-sec mt-0.5">📍 {merchant.service_area}</p>
              {merchant.rating_count > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-amber-400 text-sm">★</span>
                  <span className="text-xs font-bold text-nearmee-text">{Number(merchant.rating_avg).toFixed(1)}</span>
                  <span className="text-xs text-nearmee-text-sec">({merchant.rating_count} reviews)</span>
                </div>
              )}
            </div>
          </div>

          {merchant.bio && (
            <p className="text-sm text-nearmee-text-sec leading-relaxed mb-4">{merchant.bio}</p>
          )}

          {/* Share profile button */}
          <button
            onClick={handleShareProfile}
            className="w-full flex items-center justify-center gap-2 py-3 border border-nearmee-coral rounded-xl text-sm font-bold text-nearmee-coral active:bg-nearmee-light"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF5757" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            Share this profile
          </button>
        </div>

        {/* Services */}
        <div className="px-4 py-4">
          <p className="text-xs font-bold text-nearmee-text-sec uppercase tracking-widest mb-3">
            Services ({services.length})
          </p>

          {services.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm text-nearmee-text-sec">No active services yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {services.map((service) => (
                <div key={service.id} className="bg-white rounded-xl border border-nearmee-border p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl shrink-0">{getCategoryIcon(service.category)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-nearmee-text truncate">{service.title}</p>
                        {service.is_boosted && (
                          <span className="text-[9px] font-bold bg-nearmee-dark text-white px-1.5 py-0.5 rounded shrink-0">AD</span>
                        )}
                      </div>
                      {service.description && (
                        <p className="text-xs text-nearmee-text-sec mt-0.5 line-clamp-2">{service.description}</p>
                      )}
                      <p className="text-sm font-extrabold text-nearmee-coral mt-1">
                        {formatPrice(service.price)} <span className="text-xs font-normal text-nearmee-text-sec">{service.price_unit}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleShareService(service)}
                      className="flex-1 py-2.5 rounded-xl border border-nearmee-border text-nearmee-text-sec text-xs font-semibold active:bg-nearmee-surface flex items-center justify-center gap-1.5"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                      </svg>
                      Share
                    </button>
                    <button
                      onClick={() => router.push(`/booking/${service.id}`)}
                      className="flex-1 py-2.5 rounded-xl bg-nearmee-coral text-white text-xs font-bold active:opacity-90"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Nearmee branding */}
        <div className="px-4 pb-6 text-center">
          <p className="text-xs text-nearmee-text-sec">
            Powered by{' '}
            <button onClick={() => router.push('/')} className="font-bold text-nearmee-coral">
              Nearmee
            </button>
            {' '}· Services at your doorstep
          </p>
        </div>
      </main>
    </div>
  );
}
