'use client';

import { useState } from 'react';
import { BOOKING_STATUSES } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';

const TABS = ['Upcoming', 'Completed', 'Cancelled'];

const MOCK_BOOKINGS = [
  {
    id: 'b1',
    service: 'Plumbing Repair & Pipe Fixing',
    merchant: 'Mang Nestor Plumbing',
    date: 'Apr 8, 2026',
    time: '10:00 AM',
    amount: 350,
    status: 'confirmed',
    category: 'upcoming',
  },
  {
    id: 'b2',
    service: 'Tricycle Ride – Bayawan Poblacion',
    merchant: "JM's Ride Service",
    date: 'Apr 7, 2026',
    time: '8:00 AM',
    amount: 50,
    status: 'pending',
    category: 'upcoming',
  },
  {
    id: 'b3',
    service: 'Home-cooked Lunch Box Delivery',
    merchant: "Ate Leny's Homemade Meals",
    date: 'Apr 4, 2026',
    time: '12:00 PM',
    amount: 85,
    status: 'completed',
    category: 'completed',
  },
  {
    id: 'b4',
    service: 'House Deep Cleaning (2–3 BR)',
    merchant: 'SparkleClean Services',
    date: 'Apr 2, 2026',
    time: '9:00 AM',
    amount: 500,
    status: 'completed',
    category: 'completed',
  },
  {
    id: 'b5',
    service: 'Laundry Pick-up & Delivery',
    merchant: 'Fresh Fold Laundry',
    date: 'Mar 30, 2026',
    time: '2:00 PM',
    amount: 135,
    status: 'cancelled',
    category: 'cancelled',
  },
];

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState('Upcoming');

  const tabKey = activeTab.toLowerCase();
  const filtered = MOCK_BOOKINGS.filter((b) => b.category === tabKey);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-nermee-border px-4 pt-12 pb-0 sticky top-0 z-10">
        <h1 className="text-2xl font-extrabold text-nermee-text mb-3">Bookings</h1>

        {/* Tabs */}
        <div className="flex border-b border-nermee-border">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? 'border-nermee-green text-nermee-green'
                  : 'border-transparent text-nermee-text-sec'
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
            <p className="text-sm font-semibold text-nermee-text">No {activeTab.toLowerCase()} bookings</p>
            <p className="text-xs text-nermee-text-sec mt-1">
              {activeTab === 'Upcoming'
                ? 'Book a service to get started.'
                : 'Your history will show here.'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((booking) => {
              const statusMeta = BOOKING_STATUSES[booking.status];
              return (
                <button
                  key={booking.id}
                  className="w-full bg-white border border-nermee-border rounded-xl p-4 text-left active:bg-nermee-surface transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-nermee-text truncate">{booking.service}</p>
                      <p className="text-xs text-nermee-text-sec mt-0.5">{booking.merchant}</p>
                    </div>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg shrink-0 ${statusMeta.color} ${statusMeta.bg}`}>
                      {statusMeta.label}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-nermee-border">
                    <div className="text-xs text-nermee-text-sec">
                      <span>{booking.date}</span>
                      <span className="mx-1.5">·</span>
                      <span>{booking.time}</span>
                    </div>
                    <span className="text-sm font-bold text-nermee-text">{formatPrice(booking.amount)}</span>
                  </div>

                  {booking.status === 'pending' || booking.status === 'confirmed' ? (
                    <div className="flex gap-2 mt-3">
                      <button className="flex-1 py-2 rounded-lg border border-red-200 text-red-500 text-xs font-semibold active:bg-red-50">
                        Cancel
                      </button>
                      <button className="flex-1 py-2 rounded-lg bg-nermee-green text-white text-xs font-semibold active:opacity-90">
                        View Details
                      </button>
                    </div>
                  ) : booking.status === 'completed' ? (
                    <div className="flex gap-2 mt-3">
                      <button className="flex-1 py-2 rounded-lg border border-nermee-border text-nermee-text-sec text-xs font-semibold active:bg-nermee-surface">
                        Leave a Review
                      </button>
                      <button className="flex-1 py-2 rounded-lg bg-nermee-green text-white text-xs font-semibold active:opacity-90">
                        Book Again
                      </button>
                    </div>
                  ) : null}
                </button>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
