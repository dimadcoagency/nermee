'use client';

import { BOOKING_STATUSES } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';

const MOCK_ACTIVITY = [
  {
    id: 'a1',
    type: 'booking_confirmed',
    service: 'Plumbing Repair & Pipe Fixing',
    merchant: 'Mang Nestor Plumbing',
    amount: 350,
    status: 'confirmed',
    date: 'Today, 9:42 AM',
  },
  {
    id: 'a2',
    type: 'booking_completed',
    service: 'Home-cooked Lunch Box Delivery',
    merchant: "Ate Leny's Homemade Meals",
    amount: 85,
    status: 'completed',
    date: 'Yesterday, 1:15 PM',
  },
  {
    id: 'a3',
    type: 'booking_pending',
    service: 'House Deep Cleaning (2–3 BR)',
    merchant: 'SparkleClean Services',
    amount: 500,
    status: 'pending',
    date: 'Apr 4, 10:00 AM',
  },
  {
    id: 'a4',
    type: 'booking_cancelled',
    service: 'Tricycle Ride – Bayawan Poblacion',
    merchant: "JM's Ride Service",
    amount: 50,
    status: 'cancelled',
    date: 'Apr 3, 8:30 AM',
  },
];

export default function ActivityPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-nearmee-border px-4 pt-12 pb-4 sticky top-0 z-10">
        <h1 className="text-2xl font-extrabold text-nearmee-text">Activity</h1>
        <p className="text-sm text-nearmee-text-sec mt-0.5">Your recent bookings and updates</p>
      </header>

      <main className="flex-1 px-4 py-4 pb-28">
        {MOCK_ACTIVITY.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-5xl mb-4">📭</span>
            <p className="text-sm font-semibold text-nearmee-text">No activity yet</p>
            <p className="text-xs text-nearmee-text-sec mt-1">Your booking history will appear here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {MOCK_ACTIVITY.map((item) => {
              const statusMeta = BOOKING_STATUSES[item.status];
              return (
                <button
                  key={item.id}
                  className="w-full bg-white border border-nearmee-border rounded-xl p-4 text-left active:bg-nearmee-surface transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-nearmee-text truncate">{item.service}</p>
                      <p className="text-xs text-nearmee-text-sec mt-0.5">{item.merchant}</p>
                    </div>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg shrink-0 ${statusMeta.color} ${statusMeta.bg}`}>
                      {statusMeta.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-nearmee-text-sec">{item.date}</span>
                    <span className="text-sm font-bold text-nearmee-text">{formatPrice(item.amount)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
