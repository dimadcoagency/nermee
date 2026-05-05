'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

function getInitials(fullName) {
  if (!fullName) return '?';
  const parts = fullName.trim().split(' ');
  return (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '');
}

const SUPPORT_ITEMS = [
  { icon: '❓', label: 'Help & FAQ', desc: 'How Nearmee works', href: null },
  { icon: '🚩', label: 'Report a Problem', desc: 'Flag a service or merchant', href: '/report' },
  { icon: '📄', label: 'Terms of Service', desc: 'Usage terms', href: '/terms' },
  { icon: '🔒', label: 'Privacy Policy', desc: 'How we protect your data', href: '/privacy' },
];

export default function AccountPage() {
  const { user, profile, merchant, merchantMode, loading, logout, toggleMerchantMode } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-nearmee-coral border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-nearmee-surface">
      {/* Profile header */}
      <header className="bg-white px-4 pt-12 pb-5 border-b border-nearmee-border">
        {user ? (
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-nearmee-coral flex items-center justify-center shrink-0">
              <span className="text-xl font-bold text-white uppercase">
                {getInitials(profile?.full_name)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold text-nearmee-text">{profile?.full_name || 'My Account'}</p>
              <p className="text-sm text-nearmee-text-sec mt-0.5">{user?.phone || ''}</p>
              {profile?.city && (
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs">📍</span>
                  <span className="text-xs text-nearmee-text-sec">{profile.city}</span>
                </div>
              )}
            </div>
            <button
              onClick={() => router.push('/auth/setup')}
              className="px-3 py-1.5 border border-nearmee-border rounded-lg text-xs font-semibold text-nearmee-text-sec active:bg-nearmee-surface"
            >
              Edit
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-nearmee-surface border border-nearmee-border flex items-center justify-center shrink-0">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-base font-bold text-nearmee-text">Guest</p>
              <p className="text-sm text-nearmee-text-sec mt-0.5">Sign in to book services</p>
            </div>
            <button
              onClick={() => router.push('/auth/login')}
              className="px-4 py-2 bg-nearmee-coral text-white text-sm font-semibold rounded-lg active:opacity-90"
            >
              Log In
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="flex mt-5 border border-nearmee-border rounded-xl overflow-hidden">
          {[
            { label: 'Bookings', value: '0' },
            { label: 'Reviews', value: '0' },
            { label: 'Saved', value: '0' },
          ].map(({ label, value }, i, arr) => (
            <div key={label} className={`flex-1 py-3 text-center ${i < arr.length - 1 ? 'border-r border-nearmee-border' : ''}`}>
              <p className="text-base font-bold text-nearmee-text">{value}</p>
              <p className="text-xs text-nearmee-text-sec mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </header>

      <main className="flex-1 px-4 py-4 pb-28 space-y-4">

        {/* Merchant section */}
        {user && (
          <div>
            <p className="text-xs font-bold text-nearmee-text-sec uppercase tracking-widest mb-2 px-1">For Merchants</p>
            <div className="bg-white rounded-xl border border-nearmee-border overflow-hidden">
              {merchant ? (
                <>
                  {/* Mode toggle */}
                  <div className="flex items-center gap-3 px-4 py-3.5 border-b border-nearmee-border">
                    <span className="text-xl w-7 text-center shrink-0">🏪</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-nearmee-text">Merchant Mode</p>
                      <p className="text-xs text-nearmee-text-sec mt-0.5">{merchant.business_name}</p>
                    </div>
                    <button
                      onClick={toggleMerchantMode}
                      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${merchantMode ? 'bg-nearmee-coral' : 'bg-nearmee-border'}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${merchantMode ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                  {/* Dashboard shortcut */}
                  <button
                    onClick={() => { if (!merchantMode) toggleMerchantMode(); router.push('/merchant/dashboard'); }}
                    className="flex items-center gap-3 px-4 py-3.5 w-full text-left active:bg-nearmee-surface"
                  >
                    <span className="text-xl w-7 text-center shrink-0">📊</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-nearmee-text">Merchant Dashboard</p>
                      <p className="text-xs text-nearmee-text-sec mt-0.5">Manage bookings & earnings</p>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5" strokeLinecap="round"><path d="m9 18 6-6-6-6" /></svg>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => router.push('/merchant/register')}
                  className="flex items-center gap-3 px-4 py-3.5 w-full text-left active:bg-nearmee-surface"
                >
                  <span className="text-xl w-7 text-center shrink-0">🏪</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-nearmee-text">Become a Merchant</p>
                    <p className="text-xs text-nearmee-text-sec mt-0.5">List your services on Nearmee</p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5" strokeLinecap="round"><path d="m9 18 6-6-6-6" /></svg>
                </button>
              )}
            </div>
          </div>
        )}

        {/* My Account */}
        <div>
          <p className="text-xs font-bold text-nearmee-text-sec uppercase tracking-widest mb-2 px-1">My Account</p>
          <div className="bg-white rounded-xl border border-nearmee-border divide-y divide-nearmee-border overflow-hidden">
            {[
              { icon: '👤', label: 'Edit Profile', desc: 'Name, phone, photo' },
              { icon: '📍', label: 'My Location', desc: profile?.city || 'Set your city' },
              { icon: '🔔', label: 'Notifications', desc: 'Booking updates, promos' },
            ].map(({ icon, label, desc }) => (
              <button key={label} className="flex items-center gap-3 px-4 py-3.5 w-full text-left active:bg-nearmee-surface">
                <span className="text-xl w-7 text-center shrink-0">{icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-nearmee-text">{label}</p>
                  <p className="text-xs text-nearmee-text-sec mt-0.5">{desc}</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5" strokeLinecap="round"><path d="m9 18 6-6-6-6" /></svg>
              </button>
            ))}
          </div>
        </div>

        {/* Support */}
        <div>
          <p className="text-xs font-bold text-nearmee-text-sec uppercase tracking-widest mb-2 px-1">Support</p>
          <div className="bg-white rounded-xl border border-nearmee-border divide-y divide-nearmee-border overflow-hidden">
            {SUPPORT_ITEMS.map(({ icon, label, desc, href }) => (
              <button key={label} onClick={() => href && router.push(href)}
                className="flex items-center gap-3 px-4 py-3.5 w-full text-left active:bg-nearmee-surface">
                <span className="text-xl w-7 text-center shrink-0">{icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-nearmee-text">{label}</p>
                  <p className="text-xs text-nearmee-text-sec mt-0.5">{desc}</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5" strokeLinecap="round"><path d="m9 18 6-6-6-6" /></svg>
              </button>
            ))}
          </div>
        </div>

        {user && (
          <button
            onClick={() => { logout(); router.push('/'); }}
            className="w-full py-3.5 rounded-xl border border-red-200 text-red-500 text-sm font-semibold active:bg-red-50"
          >
            Log Out
          </button>
        )}

        <p className="text-center text-[11px] text-nearmee-text-sec pb-2">
          Nearmee v0.1.0 · Made with ♥ in Bayawan City
        </p>
      </main>
    </div>
  );
}
