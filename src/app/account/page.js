'use client';

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

export default function AccountPage() {
  return (
    <div className="flex flex-col min-h-screen bg-nermee-surface">
      {/* Profile header */}
      <header className="bg-white px-4 pt-12 pb-5 border-b border-nermee-border">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-nermee-green flex items-center justify-center shrink-0">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-nermee-text">Guest User</p>
            <p className="text-sm text-nermee-text-sec mt-0.5">Not logged in</p>
          </div>
          <button className="px-4 py-2 bg-nermee-green text-white text-sm font-semibold rounded-lg active:opacity-90">
            Log In
          </button>
        </div>

        {/* Stats row */}
        <div className="flex mt-5 border border-nermee-border rounded-xl overflow-hidden">
          {[
            { label: 'Bookings', value: '0' },
            { label: 'Reviews', value: '0' },
            { label: 'Saved', value: '0' },
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
      </header>

      {/* Menu sections */}
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

        {/* Log out */}
        <button className="w-full py-3.5 rounded-xl border border-red-200 text-red-500 text-sm font-semibold active:bg-red-50 transition-colors">
          Log Out
        </button>

        <p className="text-center text-[11px] text-nermee-text-sec pb-2">
          Nermee v0.1.0 · Made with ♥ in Bayawan City
        </p>
      </main>
    </div>
  );
}
