'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

export default function BookingConfirmedPage() {
  const router = useRouter();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('nermee_last_booking');
    if (stored) setBooking(JSON.parse(stored));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white px-6">
      <div className="flex-1 flex flex-col items-center justify-center text-center pt-12 pb-6">
        {/* Success animation */}
        <div className="w-24 h-24 rounded-full bg-nermee-light flex items-center justify-center mb-6">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#00B14F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>

        <h1 className="text-2xl font-extrabold text-nermee-text">Booking Sent!</h1>
        <p className="text-sm text-nermee-text-sec mt-2 leading-relaxed max-w-xs">
          Your booking request has been sent to the provider. They will confirm shortly.
        </p>

        {/* Booking details card */}
        {booking && (
          <div className="w-full mt-6 bg-nermee-surface rounded-2xl p-4 text-left space-y-3">
            {/* Ref number */}
            <div className="flex items-center justify-between pb-3 border-b border-nermee-border">
              <span className="text-xs text-nermee-text-sec">Reference</span>
              <span className="text-xs font-bold text-nermee-green">{booking.id}</span>
            </div>

            {[
              { label: 'Service',  value: booking.serviceTitle },
              { label: 'Provider', value: booking.merchantName },
              { label: 'Date',     value: booking.date },
              { label: 'Time',     value: booking.time },
              { label: 'Amount',   value: `${formatPrice(booking.price)} ${booking.price_unit}` },
              { label: 'Payment',  value: 'Cash / GCash to provider' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-start gap-4">
                <span className="text-xs text-nermee-text-sec shrink-0">{label}</span>
                <span className="text-xs font-semibold text-nermee-text text-right">{value}</span>
              </div>
            ))}

            {/* Status badge */}
            <div className="pt-3 border-t border-nermee-border flex items-center justify-between">
              <span className="text-xs text-nermee-text-sec">Status</span>
              <span className="text-xs font-bold text-amber-500 bg-amber-50 px-3 py-1 rounded-lg">
                Pending Confirmation
              </span>
            </div>
          </div>
        )}

        <p className="text-xs text-nermee-text-sec mt-4 leading-relaxed max-w-xs">
          The provider will contact you directly via phone to confirm your booking.
        </p>
      </div>

      {/* Action buttons */}
      <div className="pb-10 flex flex-col gap-3">
        <Link
          href="/bookings"
          className="w-full py-4 rounded-xl bg-nermee-green text-white text-sm font-bold text-center active:opacity-90"
        >
          View My Bookings
        </Link>
        <Link
          href="/"
          className="w-full py-4 rounded-xl border border-nermee-border text-nermee-text text-sm font-semibold text-center active:bg-nermee-surface"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
