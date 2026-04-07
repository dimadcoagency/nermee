'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const HIDDEN_ON = ['/auth/login', '/auth/verify', '/auth/setup'];

const NAV_ITEMS = [
  {
    href: '/',
    label: 'Home',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#00B14F' : 'none'} stroke={active ? '#00B14F' : '#888888'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    href: '/search',
    label: 'Search',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#00B14F' : '#888888'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
  },
  {
    href: '/bookings',
    label: 'Bookings',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#00B14F' : '#888888'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    href: '/messages',
    label: 'Messages',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#00B14F' : '#888888'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    href: '/account',
    label: 'Account',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#00B14F' : '#888888'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  if (HIDDEN_ON.includes(pathname)) return null;

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-app bg-white border-t border-nermee-border safe-bottom z-20">
      <div className="flex justify-around py-1">
        {NAV_ITEMS.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 min-w-0 flex-1 transition-colors ${
                active ? 'text-nermee-green' : 'text-nermee-text-sec'
              }`}
            >
              {icon(active)}
              <span className={`text-[9px] font-semibold leading-tight ${active ? 'text-nermee-green' : 'text-nermee-text-sec'}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
