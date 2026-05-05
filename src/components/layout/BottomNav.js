'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const HIDDEN_ON = ['/auth/login', '/auth/verify', '/auth/setup'];
const HIDDEN_STARTS_WITH = ['/services/', '/booking/', '/merchant/register', '/merchant/services/new', '/merchant/services/edit'];

const CUSTOMER_NAV = [
  {
    href: '/', label: 'Home',
    icon: (a) => <svg width="22" height="22" viewBox="0 0 24 24" fill={a ? '#FF5757' : 'none'} stroke={a ? '#FF5757' : '#888'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" /><path d="M9 21V12h6v9" /></svg>,
  },
  {
    href: '/search', label: 'Search',
    icon: (a) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a ? '#FF5757' : '#888'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>,
  },
  {
    href: '/bookings', label: 'Bookings',
    icon: (a) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a ? '#FF5757' : '#888'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
  },
  {
    href: '/messages', label: 'Messages',
    icon: (a) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a ? '#FF5757' : '#888'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
  },
  {
    href: '/account', label: 'Account',
    icon: (a) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a ? '#FF5757' : '#888'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  },
];

const MERCHANT_NAV = [
  {
    href: '/merchant/dashboard', label: 'Dashboard',
    icon: (a) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a ? '#FF5757' : '#888'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>,
  },
  {
    href: '/merchant/services', label: 'Services',
    icon: (a) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a ? '#FF5757' : '#888'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" /></svg>,
  },
  {
    href: '/merchant/bookings', label: 'Bookings',
    icon: (a) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a ? '#FF5757' : '#888'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
  },
  {
    href: '/account', label: 'Account',
    icon: (a) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a ? '#FF5757' : '#888'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { user, loading, merchantMode } = useAuth();

  if (HIDDEN_ON.includes(pathname)) return null;
  if (HIDDEN_STARTS_WITH.some((p) => pathname.startsWith(p))) return null;
  if (!loading && !user) return null;

  const items = merchantMode ? MERCHANT_NAV : CUSTOMER_NAV;

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-app bg-white border-t border-nearmee-border z-20">
      {merchantMode && (
        <div className="bg-nearmee-coral text-white text-[10px] font-bold text-center py-1 tracking-widest uppercase">
          Merchant Mode
        </div>
      )}
      <div className="flex justify-around py-1">
        {items.map(({ href, label, icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link key={href} href={href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 min-w-0 flex-1 transition-colors ${active ? 'text-nearmee-coral' : 'text-nearmee-text-sec'}`}>
              {icon(active)}
              <span className={`text-[9px] font-semibold leading-tight ${active ? 'text-nearmee-coral' : 'text-nearmee-text-sec'}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
