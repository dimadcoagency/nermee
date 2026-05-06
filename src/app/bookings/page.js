'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useBookings } from '@/lib/hooks/useBookings';
import { useToast } from '@/components/ui/Toast';
import { createClient } from '@/lib/supabase/client';
import { BOOKING_STATUSES, CATEGORIES } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';

function StarPicker({ value, onChange }) {
  return (
    <div className="flex gap-2 justify-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} onClick={() => onChange(star)} className="text-3xl transition-transform active:scale-110">
          <span className={star <= value ? 'text-amber-400' : 'text-nearmee-border'}>★</span>
        </button>
      ))}
    </div>
  );
}

const RATING_LABELS = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Great', 5: 'Excellent!' };

function ReviewModal({ booking, onClose, onSubmitted }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const supabase = createClient();

  async function handleSubmit() {
    if (!rating) return;
    setSubmitting(true);
    const { error } = await supabase
      .from('bookings')
      .update({ customer_rating: rating, customer_review: review.trim() || null, rated_at: new Date().toISOString() })
      .eq('id', booking.id);
    setSubmitting(false);
    if (!error) onSubmitted(booking.id, rating, review);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-8">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-app p-5 shadow-xl">
        <h3 className="text-base font-extrabold text-nearmee-text text-center mb-1">Leave a Review</h3>
        <p className="text-xs text-nearmee-text-sec text-center mb-5">
          {booking?.service?.title} · {booking?.merchant?.business_name}
        </p>

        {/* Stars */}
        <StarPicker value={rating} onChange={setRating} />
        {rating > 0 && (
          <p className="text-center text-xs font-bold text-amber-500 mt-1">{RATING_LABELS[rating]}</p>
        )}

        {/* Review text */}
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Share your experience (optional)..."
          rows={3}
          className="w-full mt-4 border border-nearmee-border rounded-xl px-4 py-3 text-sm text-nearmee-text outline-none focus:ring-2 focus:ring-nearmee-coral resize-none"
        />

        <div className="flex gap-3 mt-4">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-nearmee-border text-nearmee-text-sec text-sm font-semibold">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={!rating || submitting}
            className={`flex-1 py-3 rounded-xl text-white text-sm font-bold transition-opacity ${
              !rating || submitting ? 'bg-nearmee-coral opacity-40' : 'bg-nearmee-coral active:opacity-90'
            }`}>
            {submitting ? 'Submitting…' : 'Submit Review'}
          </button>
        </div>
      </div>
    </div>
  );
}

const TABS = ['Upcoming', 'Completed', 'Cancelled'];

function CancelConfirmDialog({ booking, onConfirm, onDismiss }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-8">
      <div className="absolute inset-0 bg-black/40" onClick={onDismiss} />
      <div className="relative bg-white rounded-2xl w-full max-w-app p-5 shadow-xl">
        <h3 className="text-base font-extrabold text-nearmee-text mb-2">Cancel Booking?</h3>
        <p className="text-sm text-nearmee-text-sec mb-1">
          <span className="font-semibold text-nearmee-text">{booking?.service?.title}</span>
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 my-4">
          <p className="text-xs font-bold text-amber-700 mb-1">⚠️ Please note</p>
          <p className="text-xs text-amber-600 leading-relaxed">
            The merchant has reserved time for this booking. Frequent cancellations may result in account restrictions on Nearmee. Only cancel if absolutely necessary.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onDismiss}
            className="flex-1 py-3 rounded-xl border border-nearmee-border text-nearmee-text text-sm font-semibold active:bg-nearmee-surface"
          >
            Keep Booking
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-bold active:opacity-90"
          >
            Yes, Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

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
  const [cancelTarget, setCancelTarget] = useState(null);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [ratedBookings, setRatedBookings] = useState({});
  const [activeTab, setActiveTab] = useState('Upcoming');

  function handleReviewSubmitted(bookingId, rating, review) {
    setRatedBookings((prev) => ({ ...prev, [bookingId]: { rating, review } }));
    setReviewTarget(null);
    showToast('Review submitted! Thank you. ⭐');
  }

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
                        onClick={() => setCancelTarget(booking)}
                        className="flex-1 py-2 rounded-lg border border-red-200 text-red-500 text-xs font-semibold active:bg-red-50"
                      >
                        Cancel
                      </button>
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => router.push(`/messages/${booking.id}`)}
                          className="flex-1 py-2 rounded-lg bg-nearmee-coral text-white text-xs font-semibold active:opacity-90 flex items-center justify-center gap-1"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                          Message
                        </button>
                      )}
                    </div>
                  )}
                  {booking.status === 'completed' && (
                    <div className="flex flex-col gap-2 mt-3">
                      {/* Review reminder banner */}
                      {!booking.customer_rating && !ratedBookings[booking.id] && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 flex items-center gap-2">
                          <span className="text-base shrink-0">⭐</span>
                          <p className="text-xs text-amber-700 font-medium flex-1">
                            How was your experience? Your review helps other customers.
                          </p>
                        </div>
                      )}

                      {/* Rated badge */}
                      {(booking.customer_rating || ratedBookings[booking.id]) && (
                        <div className="bg-green-50 border border-green-200 rounded-xl px-3 py-2 flex items-center gap-2">
                          <span className="text-base shrink-0">✅</span>
                          <p className="text-xs text-green-700 font-medium">
                            You rated this {ratedBookings[booking.id]?.rating ?? booking.customer_rating} ★ — thank you!
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        {!booking.customer_rating && !ratedBookings[booking.id] ? (
                          <button
                            onClick={() => setReviewTarget(booking)}
                            className="flex-1 py-2 rounded-lg bg-amber-400 text-white text-xs font-bold active:opacity-90"
                          >
                            ⭐ Leave a Review
                          </button>
                        ) : (
                          <div className="flex-1" />
                        )}
                        <button
                          onClick={() => router.push(`/services/${booking.service?.id}`)}
                          className="flex-1 py-2 rounded-lg bg-nearmee-coral text-white text-xs font-semibold active:opacity-90"
                        >
                          Book Again
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Cancel confirmation dialog */}
      {cancelTarget && (
        <CancelConfirmDialog
          booking={cancelTarget}
          onDismiss={() => setCancelTarget(null)}
          onConfirm={async () => {
            const ok = await cancelBooking(cancelTarget.id);
            setCancelTarget(null);
            showToast(ok ? 'Booking cancelled' : 'Could not cancel', ok ? 'success' : 'error');
          }}
        />
      )}

      {/* Review modal */}
      {reviewTarget && (
        <ReviewModal
          booking={reviewTarget}
          onClose={() => setReviewTarget(null)}
          onSubmitted={handleReviewSubmitted}
        />
      )}
    </div>
  );
}
