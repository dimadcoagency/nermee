'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';

const STATUS_CONFIG = {
  pending:     { icon: '🕐', label: 'Booking request sent',    color: 'text-amber-600',  bg: 'bg-amber-50' },
  confirmed:   { icon: '✅', label: 'Booking confirmed',       color: 'text-green-600',  bg: 'bg-green-50' },
  in_progress: { icon: '🔧', label: 'Service in progress',     color: 'text-blue-600',   bg: 'bg-blue-50' },
  completed:   { icon: '⭐', label: 'Service completed',       color: 'text-gray-600',   bg: 'bg-gray-50' },
  cancelled:   { icon: '✕',  label: 'Booking cancelled',       color: 'text-red-500',    bg: 'bg-red-50' },
  no_show:     { icon: '😔', label: 'No-show recorded',        color: 'text-red-400',    bg: 'bg-red-50' },
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' });
}

export default function NotificationsPage() {
  const router = useRouter();
  const { user, merchant } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!user) return;
    async function fetch() {
      const items = [];

      // Customer bookings
      const { data: customerBookings } = await supabase
        .from('bookings')
        .select('id, status, updated_at, booking_date, booking_time, customer_rating, service:services(id, title)')
        .eq('customer_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(20);

      (customerBookings ?? []).forEach((b) => {
        // Review reminder for completed unreviewed bookings
        if (b.status === 'completed' && !b.customer_rating) {
          items.push({
            id: `review-${b.id}`,
            icon: '⭐',
            title: 'Leave a review',
            body: b.service?.title ?? 'Completed service',
            sub: 'Tap to rate your experience',
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            time: b.updated_at,
            href: '/bookings',
          });
        }

        const cfg = STATUS_CONFIG[b.status] ?? STATUS_CONFIG.pending;
        items.push({
          id: `c-${b.id}`,
          icon: cfg.icon,
          title: cfg.label,
          body: b.service?.title ?? 'Service',
          sub: `${b.booking_date} · ${b.booking_time}`,
          color: cfg.color,
          bg: cfg.bg,
          time: b.updated_at,
          href: '/bookings',
        });
      });

      // Merchant bookings (if merchant)
      if (merchant?.id) {
        const { data: merchantBookings } = await supabase
          .from('bookings')
          .select('id, status, updated_at, booking_date, booking_time, service:services(title), customer:profiles(full_name)')
          .eq('merchant_id', merchant.id)
          .order('updated_at', { ascending: false })
          .limit(20);

        (merchantBookings ?? []).forEach((b) => {
          const cfg = STATUS_CONFIG[b.status] ?? STATUS_CONFIG.pending;
          items.push({
            id: `m-${b.id}`,
            icon: cfg.icon,
            title: b.status === 'pending' ? 'New booking request' : cfg.label,
            body: `${b.service?.title ?? 'Service'} — ${b.customer?.full_name ?? 'Customer'}`,
            sub: `${b.booking_date} · ${b.booking_time}`,
            color: b.status === 'pending' ? 'text-nearmee-coral' : cfg.color,
            bg: b.status === 'pending' ? 'bg-nearmee-light' : cfg.bg,
            time: b.updated_at,
            href: '/merchant/bookings',
          });
        });
      }

      // Sort all by time
      items.sort((a, b) => new Date(b.time) - new Date(a.time));
      setNotifications(items);
      setLoading(false);
    }
    fetch();
  }, [user, merchant]);

  return (
    <div className="flex flex-col min-h-screen bg-nearmee-surface">
      <header className="flex items-center gap-3 px-4 pt-12 pb-4 border-b border-nearmee-border bg-white sticky top-0 z-10">
        <button onClick={() => router.back()} className="p-1 -ml-1 text-nearmee-text-sec">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-base font-bold text-nearmee-text">Notifications</h1>
      </header>

      <main className="flex-1 px-4 py-4 pb-28">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-nearmee-coral border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-5xl mb-4">🔔</span>
            <p className="text-sm font-semibold text-nearmee-text">No notifications yet</p>
            <p className="text-xs text-nearmee-text-sec mt-1">Booking updates will appear here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => router.push(n.href)}
                className="w-full bg-white rounded-xl border border-nearmee-border p-4 text-left active:bg-nearmee-surface flex gap-3"
              >
                <div className={`w-10 h-10 rounded-full ${n.bg} flex items-center justify-center text-lg shrink-0`}>
                  {n.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold ${n.color}`}>{n.title}</p>
                  <p className="text-xs text-nearmee-text mt-0.5 truncate">{n.body}</p>
                  <p className="text-xs text-nearmee-text-sec mt-0.5">{n.sub}</p>
                </div>
                <span className="text-[10px] text-nearmee-text-sec shrink-0 mt-0.5">{timeAgo(n.time)}</span>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
