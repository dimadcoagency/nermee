'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useMerchantBookings } from '@/lib/hooks/useMerchant';
import { useToast } from '@/components/ui/Toast';
import { BOOKING_STATUSES, CATEGORIES } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';

const TABS = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

function isPastBooking(dateStr, timeStr) {
  const bookingDate = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return bookingDate < today;
}

function CustomerBadge({ noShows, cancellations }) {
  if (noShows === 0 && cancellations === 0) return null;
  return (
    <div className="flex gap-2 mt-2">
      {noShows > 0 && (
        <span className="text-[10px] font-bold bg-red-50 text-red-500 px-2 py-0.5 rounded-full">
          {noShows} no-show{noShows > 1 ? 's' : ''}
        </span>
      )}
      {cancellations > 0 && (
        <span className="text-[10px] font-bold bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">
          {cancellations} cancellation{cancellations > 1 ? 's' : ''}
        </span>
      )}
    </div>
  );
}

function getCategoryIcon(id) {
  return CATEGORIES.find((c) => c.id === id)?.icon ?? '🛠️';
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-PH', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export default function MerchantBookingsPage() {
  const router = useRouter();
  const { merchant } = useAuth();
  const { bookings, loading, updateStatus } = useMerchantBookings(merchant?.id);
  const { show: showToast } = useToast();
  const [activeTab, setActiveTab] = useState('Pending');

  const filtered = bookings.filter((b) => b.status === activeTab.toLowerCase());

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="bg-white border-b border-nearmee-border px-4 pt-12 pb-0 sticky top-0 z-10">
        <h1 className="text-2xl font-extrabold text-nearmee-text mb-3">Incoming Bookings</h1>
        <div className="flex overflow-x-auto no-scrollbar border-b border-nearmee-border">
          {TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 -mb-px shrink-0 ${
                activeTab === tab ? 'border-nearmee-coral text-nearmee-coral' : 'border-transparent text-nearmee-text-sec'
              }`}>
              {tab}
              {tab === 'Pending' && bookings.filter((b) => b.status === 'pending').length > 0 && (
                <span className="ml-1.5 bg-nearmee-coral text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {bookings.filter((b) => b.status === 'pending').length}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 px-4 py-4 pb-28">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-nearmee-coral border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-5xl mb-4">📭</span>
            <p className="text-sm font-semibold text-nearmee-text">No {activeTab.toLowerCase()} bookings</p>
            <p className="text-xs text-nearmee-text-sec mt-1">
              {activeTab === 'Pending' ? 'New bookings will appear here.' : 'Nothing here yet.'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((booking) => {
              const statusMeta = BOOKING_STATUSES[booking.status] ?? BOOKING_STATUSES.pending;
              return (
                <div key={booking.id} className="bg-white border border-nearmee-border rounded-xl p-4">
                  {/* Service + status */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-xl shrink-0">{getCategoryIcon(booking.service?.category)}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-nearmee-text truncate">{booking.service?.title}</p>
                        <p className="text-xs text-nearmee-text-sec mt-0.5">{formatPrice(booking.total_price)}</p>
                      </div>
                    </div>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg shrink-0 ${statusMeta.color} ${statusMeta.bg}`}>
                      {statusMeta.label}
                    </span>
                  </div>

                  {/* Customer info + reliability badge */}
                  <div className="bg-nearmee-surface rounded-lg px-3 py-2.5 mb-3">
                    <p className="text-xs font-bold text-nearmee-text">{booking.customer?.full_name || 'Customer'}</p>
                    <p className="text-xs text-nearmee-text-sec mt-0.5">{booking.customer?.phone || ''}</p>
                    <CustomerBadge
                      noShows={bookings.filter((b) => b.customer?.id === booking.customer?.id && b.status === 'no_show').length}
                      cancellations={bookings.filter((b) => b.customer?.id === booking.customer?.id && b.status === 'cancelled').length}
                    />
                  </div>

                  {/* Date + time */}
                  <div className="flex items-center justify-between text-xs text-nearmee-text-sec mb-3">
                    <span>📅 {formatDate(booking.booking_date)}</span>
                    <span>🕐 {booking.booking_time}</span>
                  </div>

                  {booking.notes && (
                    <p className="text-xs text-nearmee-text-sec bg-nearmee-surface rounded-lg px-3 py-2 mb-3">
                      📝 {booking.notes}
                    </p>
                  )}

                  {/* Actions */}
                  {booking.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={async () => { await updateStatus(booking.id, 'cancelled'); showToast('Booking declined'); }}
                        className="flex-1 py-2.5 rounded-xl border border-red-200 text-red-500 text-xs font-bold active:bg-red-50"
                      >
                        Decline
                      </button>
                      <button
                        onClick={async () => { await updateStatus(booking.id, 'confirmed'); showToast('Booking accepted!'); }}
                        className="flex-1 py-2.5 rounded-xl bg-nearmee-coral text-white text-xs font-bold active:opacity-90"
                      >
                        Accept
                      </button>
                    </div>
                  )}
                  {booking.status === 'confirmed' && (
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push(`/messages/${booking.id}`)}
                          className="flex-1 py-2.5 rounded-xl border border-nearmee-coral text-nearmee-coral text-xs font-bold active:bg-nearmee-light flex items-center justify-center gap-1"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF5757" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                          Message
                        </button>
                        <button
                          onClick={async () => { await updateStatus(booking.id, 'completed'); showToast('Marked as completed!'); }}
                          className="flex-1 py-2.5 rounded-xl bg-green-600 text-white text-xs font-bold active:opacity-90"
                        >
                          Completed
                        </button>
                      </div>
                      {isPastBooking(booking.booking_date) && (
                        <button
                          onClick={async () => {
                            await updateStatus(booking.id, 'no_show');
                            showToast('Marked as no-show. Customer has been flagged.', 'warning');
                          }}
                          className="w-full py-2.5 rounded-xl border border-red-200 text-red-500 text-xs font-bold active:bg-red-50"
                        >
                          😔 Customer No-Show
                        </button>
                      )}
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
