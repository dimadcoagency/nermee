'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useBookings } from '@/lib/hooks/useBookings';
import { useToast } from '@/components/ui/Toast';
import { BOOKING_STATUSES, CATEGORIES } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';

const TABS = ['Upcoming', 'Completed', 'Cancelled'];

function getCategoryIcon(categoryId) {
  return CATEGORIES.find((c) => c.id === categoryId)?.icon ?? '🛠️';
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-PH', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function tabKey(booking) {
  if (['pending', 'confirmed', 'in_progress'].includes(booking.status)) return 'upcoming';
  if (booking.status === 'completed') return 'completed';
  return 'cancelled';
}

export default function BookingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { bookings, loading: bookingsLoading, cancelBooking } = useBookings(user?.id);
  const { show: showToast } = useToast();
  const [activeTab, setActiveTab] = useState('Upcoming');

  // Redirect to login if not authenticated
  if (!authLoading && !user) {
    router.replace('/auth/login');
    return null;
  }

  if (authLoading || bookingsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-nearmee-coral border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const filtered = bookings.filter((b) => tabKey(b) === activeTab.toLowerCase());

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="bg-white border-b border-nearmee-border px-4 pt-12 pb-0 sticky top-0 z-10">
        <h1 className="text-2xl font-extrabold text-nearmee-text mb-3">Bookings</h1>
        <div className="flex border-b border-nearmee-border">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? 'border-nearmee-coral text-nearmee-coral'
                  : 'border-transparent text-nearmee-text-sec'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 px-4 py-4 pb-28">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-5xl mb-4">📭</span>
            <p className="text-sm font-semibold text-nearmee-text">No {activeTab.toLowerCase()} bookings</p>
            <p className="text-xs text-nearmee-text-sec mt-1">
              {activeTab === 'Upcoming' ? 'Book a service to get started.' : 'Your history will show here.'}
            </p>
            {activeTab === 'Upcoming' && (
              <button
                onClick={() => router.push('/')}
                className="mt-4 px-6 py-2.5 bg-nearmee-coral text-white text-sm font-bold rounded-xl"
              >
                Browse Services
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((booking) => {
              const statusMeta = BOOKING_STATUSES[booking.status] ?? BOOKING_STATUSES.pending;
              return (
                <div
                  key={booking.id}
                  className="bg-white border border-nearmee-border rounded-xl p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-xl shrink-0">{getCategoryIcon(booking.service?.category)}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-nearmee-text truncate">{booking.service?.title}</p>
                        <p className="text-xs text-nearmee-text-sec mt-0.5">{booking.merchant?.business_name}</p>
                      </div>
                    </div>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg shrink-0 ${statusMeta.color} ${statusMeta.bg}`}>
                      {statusMeta.label}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-nearmee-border">
                    <div className="text-xs text-nearmee-text-sec">
                      <span>{formatDate(booking.booking_date)}</span>
                      <span className="mx-1.5">·</span>
                      <span>{booking.booking_time}</span>
                    </div>
                    <span className="text-sm font-bold text-nearmee-text">{formatPrice(booking.total_price)}</span>
                  </div>

                  {['pending', 'confirmed'].includes(booking.status) && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={async () => {
                        const ok = await cancelBooking(booking.id);
                        showToast(ok ? 'Booking cancelled' : 'Could not cancel booking', ok ? 'success' : 'error');
                      }}
                        className="flex-1 py-2 rounded-lg border border-red-200 text-red-500 text-xs font-semibold active:bg-red-50"
                      >
                        Cancel
                      </button>
                      <button className="flex-1 py-2 rounded-lg bg-nearmee-coral text-white text-xs font-semibold active:opacity-90">
                        View Details
                      </button>
                    </div>
                  )}
                  {booking.status === 'completed' && (
                    <div className="flex gap-2 mt-3">
                      <button className="flex-1 py-2 rounded-lg border border-nearmee-border text-nearmee-text-sec text-xs font-semibold active:bg-nearmee-surface">
                        Leave a Review
                      </button>
                      <button
                        onClick={() => router.push(`/services/${booking.service?.id}`)}
                        className="flex-1 py-2 rounded-lg bg-nearmee-coral text-white text-xs font-semibold active:opacity-90"
                      >
                        Book Again
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
