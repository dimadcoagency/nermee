'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const MENU_SECTIONS = [
  {
    title: 'My Account',
    items: [
      { icon: '👤', label: 'Edit Profile', desc: 'Name, phone, photo' },
      { icon: '📍', label: 'My Location', desc: 'Bayawan City' },
      { icon: '🔔', label: 'Notifications', desc: 'Booking updates, promos' },
    ],
  },
  {
    title: 'For Merchants',
    items: [
      { icon: '🏪', label: 'Become a Merchant', desc: 'List your services on Nermee' },
      { icon: '📊', label: 'Merchant Dashboard', desc: 'Manage bookings & earnings' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: '❓', label: 'Help & FAQ', desc: 'How Nermee works' },
      { icon: '🚩', label: 'Report a Problem', desc: 'Flag a service or merchant' },
      { icon: '📄', label: 'Terms & Privacy', desc: 'Legal stuff' },
    ],
  },
];

function getInitials(name, lastName) {
  return `${name?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase() || '?';
}

export default function AccountPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-nermee-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-nermee-surface">
      {/* Profile header */}
      <header className="bg-white px-4 pt-12 pb-5 border-b border-nermee-border">
        {user ? (
          /* Logged in state */
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-nermee-green flex items-center justify-center shrink-0">
              <span className="text-xl font-bold text-white">
                {getInitials(user.name, user.lastName)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold text-nermee-text">
                {user.name} {user.lastName}
              </p>
              <p className="text-sm text-nermee-text-sec mt-0.5">
                {user.phone ? `+63 ${user.phone.slice(1)}` : ''}
              </p>
              {user.email ? (
                <p className="text-xs text-nermee-text-sec truncate">{user.email}</p>
              ) : null}
            </div>
            <button
              onClick={() => router.push('/auth/setup')}
              className="px-3 py-1.5 border border-nermee-border rounded-lg text-xs font-semibold text-nermee-text-sec active:bg-nermee-surface"
            >
              Edit
            </button>
          </div>
        ) : (
          /* Logged out state */
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-nermee-surface border border-nermee-border flex items-center justify-center shrink-0">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold text-nermee-text">Guest</p>
              <p className="text-sm text-nermee-text-sec mt-0.5">Sign in to book services</p>
            </div>
            <button
              onClick={() => router.push('/auth/login')}
              className="px-4 py-2 bg-nermee-green text-white text-sm font-semibold rounded-lg active:opacity-90"
            >
              Log In
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="flex mt-5 border border-nermee-border rounded-xl overflow-hidden">
          {[
            { label: 'Bookings', value: '0' },
            { label: 'Reviews', value: '0' },
            { label: 'Saved',   value: '0' },
          ].map(({ label, value }, i, arr) => (
            <div
              key={label}
              className={`flex-1 py-3 text-center ${i < arr.length - 1 ? 'border-r border-nermee-border' : ''}`}
            >
              <p className="text-base font-bold text-nermee-text">{value}</p>
              <p className="text-xs text-nermee-text-sec mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Location badge */}
        {user?.cityLabel && (
          <div className="flex items-center gap-1.5 mt-3 px-1">
            <span className="text-sm">📍</span>
            <span className="text-xs text-nermee-text-sec">{user.cityLabel}</span>
          </div>
        )}
      </header>

      {/* Menu */}
      <main className="flex-1 px-4 py-4 pb-28 space-y-4">
        {MENU_SECTIONS.map((section) => (
          <div key={section.title}>
            <p className="text-xs font-bold text-nermee-text-sec uppercase tracking-widest mb-2 px-1">
              {section.title}
            </p>
            <div className="bg-white rounded-xl border border-nermee-border divide-y divide-nermee-border overflow-hidden">
              {section.items.map(({ icon, label, desc }) => (
                <button
                  key={label}
                  className="flex items-center gap-3 px-4 py-3.5 w-full text-left active:bg-nermee-surface transition-colors"
                >
                  <span className="text-xl w-7 text-center shrink-0">{icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-nermee-text">{label}</p>
                    {desc && <p className="text-xs text-nermee-text-sec mt-0.5">{desc}</p>}
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5" strokeLinecap="round">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        ))}

        {user && (
          <button
            onClick={() => { logout(); router.push('/'); }}
            className="w-full py-3.5 rounded-xl border border-red-200 text-red-500 text-sm font-semibold active:bg-red-50 transition-colors"
          >
            Log Out
          </button>
        )}

        <p className="text-center text-[11px] text-nermee-text-sec pb-2">
          Nermee v0.1.0 · Made with ♥ in Bayawan City
        </p>
      </main>
    </div>
  );
}
