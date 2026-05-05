'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useMerchantStats } from '@/lib/hooks/useMerchant';
import { formatPrice } from '@/lib/utils';

export default function MerchantDashboardPage() {
  const router = useRouter();
  const { merchant, profile, loading } = useAuth();
  const stats = useMerchantStats(merchant?.id);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-nearmee-coral border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!merchant) {
    router.replace('/account');
    return null;
  }

  const QUICK_ACTIONS = [
    { label: 'Post a Service', icon: '➕', href: '/merchant/services/new' },
    { label: 'My Services', icon: '📋', href: '/merchant/services' },
    { label: 'Bookings', icon: '📅', href: '/merchant/bookings' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-nearmee-surface">
      {/* Header */}
      <header className="bg-nearmee-coral px-4 pt-12 pb-6">
        <p className="text-white/80 text-xs font-semibold mb-1">Welcome back,</p>
        <h1 className="text-xl font-extrabold text-white">{merchant.business_name}</h1>
        <div className="flex items-center gap-2 mt-1">
          {merchant.is_verified && (
            <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full">✓ Verified</span>
          )}
          <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full capitalize">{merchant.tier} Plan</span>
        </div>
      </header>

      <main className="flex-1 px-4 py-4 pb-28 space-y-4">
        {/* Earnings card */}
        <div className="bg-white rounded-2xl p-4 border border-nearmee-border">
          <p className="text-xs font-bold text-nearmee-text-sec uppercase tracking-widest mb-3">Total Earnings</p>
          <p className="text-3xl font-extrabold text-nearmee-coral">{formatPrice(stats.totalEarnings)}</p>
          <p className="text-xs text-nearmee-text-sec mt-1">From {stats.completed} completed booking{stats.completed !== 1 ? 's' : ''}</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Pending', value: stats.pending, color: 'text-amber-500' },
            { label: 'Confirmed', value: stats.confirmed, color: 'text-green-600' },
            { label: 'Active Services', value: stats.activeServices, color: 'text-nearmee-coral' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-xl p-3 border border-nearmee-border text-center">
              <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
              <p className="text-[10px] text-nearmee-text-sec mt-1 leading-tight">{label}</p>
            </div>
          ))}
        </div>

        {/* Pending bookings alert */}
        {stats.pending > 0 && (
          <button
            onClick={() => router.push('/merchant/bookings')}
            className="w-full bg-amber-50 border border-amber-200 rounded-xl p-4 text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-amber-700">
                  {stats.pending} pending booking{stats.pending !== 1 ? 's' : ''}
                </p>
                <p className="text-xs text-amber-600 mt-0.5">Tap to accept or decline</p>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </div>
          </button>
        )}

        {/* Quick actions */}
        <div>
          <p className="text-xs font-bold text-nearmee-text-sec uppercase tracking-widest mb-3">Quick Actions</p>
          <div className="flex flex-col gap-2">
            {QUICK_ACTIONS.map(({ label, icon, href }) => (
              <button
                key={label}
                onClick={() => router.push(href)}
                className="flex items-center gap-3 bg-white rounded-xl px-4 py-3.5 border border-nearmee-border active:bg-nearmee-surface w-full text-left"
              >
                <span className="text-xl w-8 text-center">{icon}</span>
                <span className="text-sm font-semibold text-nearmee-text flex-1">{label}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5" strokeLinecap="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Rating */}
        {merchant.rating_count > 0 && (
          <div className="bg-white rounded-xl p-4 border border-nearmee-border">
            <p className="text-xs font-bold text-nearmee-text-sec uppercase tracking-widest mb-2">Your Rating</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold text-nearmee-text">{Number(merchant.rating_avg).toFixed(1)}</span>
              <div className="flex">
                {[1,2,3,4,5].map((s) => (
                  <span key={s} className={`text-lg ${s <= Math.round(merchant.rating_avg) ? 'text-amber-400' : 'text-nearmee-border'}`}>★</span>
                ))}
              </div>
              <span className="text-xs text-nearmee-text-sec">({merchant.rating_count} reviews)</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
