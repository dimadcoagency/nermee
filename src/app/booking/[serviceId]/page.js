'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DatePicker from '@/components/booking/DatePicker';
import TimePicker from '@/components/booking/TimePicker';
import { useService } from '@/lib/hooks/useServices';
import { createBooking } from '@/lib/hooks/useBookings';
import { useAuth } from '@/contexts/AuthContext';
import { CATEGORIES } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';

const EMPTY_ITEM = { item: '', qty: '1', store: '', budget: '' };

function ErrandsOrderForm({ items, onChange }) {
  function update(index, field, value) {
    const next = items.map((it, i) => i === index ? { ...it, [field]: value } : it);
    onChange(next);
  }
  function add() { onChange([...items, { ...EMPTY_ITEM }]); }
  function remove(index) { onChange(items.filter((_, i) => i !== index)); }

  return (
    <section className="px-4 py-4 border-b border-nearmee-border">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold text-nearmee-text-sec uppercase tracking-widest">Errand Items</p>
        <button onClick={add} className="text-xs font-bold text-nearmee-coral flex items-center gap-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF5757" strokeWidth="3" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
          Add Item
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {items.map((it, i) => (
          <div key={i} className="bg-nearmee-surface rounded-xl p-3 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                type="text" value={it.item}
                onChange={(e) => update(i, 'item', e.target.value)}
                placeholder={`Item ${i + 1} (e.g. Rice, Milk)`}
                className="flex-1 bg-white border border-nearmee-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-nearmee-coral"
              />
              {items.length > 1 && (
                <button onClick={() => remove(i)} className="text-red-400 shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text" value={it.qty}
                onChange={(e) => update(i, 'qty', e.target.value)}
                placeholder="Qty"
                className="w-16 bg-white border border-nearmee-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-nearmee-coral"
              />
              <input
                type="text" value={it.store}
                onChange={(e) => update(i, 'store', e.target.value)}
                placeholder="Store (optional)"
                className="flex-1 bg-white border border-nearmee-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-nearmee-coral"
              />
              <div className="flex items-center bg-white border border-nearmee-border rounded-lg px-2 py-2 w-24">
                <span className="text-xs text-nearmee-text-sec mr-0.5">₱</span>
                <input
                  type="number" value={it.budget}
                  onChange={(e) => update(i, 'budget', e.target.value)}
                  placeholder="Max"
                  className="w-full text-sm outline-none bg-transparent"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-nearmee-text-sec mt-2">
        📦 This list will be sent to your errand provider with your booking.
      </p>
    </section>
  );
}

function getCategoryIcon(categoryId) {
  return CATEGORIES.find((c) => c.id === categoryId)?.icon ?? '🛠️';
}

export default function BookingPage() {
  const { serviceId } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { service, loading: serviceLoading } = useService(serviceId);

  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [errandItems, setErrandItems] = useState([{ ...EMPTY_ITEM }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isErrands = service?.category === 'errands';

  if (serviceLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-nearmee-coral border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-sm text-nearmee-text-sec">Service not found.</p>
      </div>
    );
  }

  const canConfirm = selectedDate && selectedTime;

  // Get time slots for the selected date
  const selectedDayOfWeek = new Date(selectedDate + 'T00:00:00').getDay();
  const timeSlots = (service.availability ?? [])
    .filter((a) => a.day_of_week === selectedDayOfWeek && a.is_available)
    .map((a) => a.time_slot);

  async function handleConfirm() {
    if (!canConfirm || !user) return;
    setLoading(true);
    setError('');

    // Format errand items into notes if applicable
    let finalNotes = notes;
    if (isErrands) {
      const filled = errandItems.filter((it) => it.item.trim());
      if (filled.length > 0) {
        const itemLines = filled.map((it, i) =>
          `${i + 1}. ${it.item} (x${it.qty || 1})${it.store ? ' — ' + it.store : ''}${it.budget ? ' — ₱' + it.budget + ' max' : ''}`
        ).join('\n');
        finalNotes = `ERRAND ITEMS:\n${itemLines}${notes ? '\n\nNotes: ' + notes : ''}`;
      }
    }

    const { data, error: bookingError } = await createBooking({
      customerId: user.id,
      merchantId: service.merchant.id,
      serviceId: service.id,
      date: selectedDate,
      time: selectedTime,
      notes: finalNotes,
      price: service.price,
    });

    if (bookingError) {
      setError('Could not confirm booking. Please try again.');
      setLoading(false);
      return;
    }

    // Store ref for confirmed page
    localStorage.setItem('nearmee_last_booking', JSON.stringify({
      id: data.id,
      serviceTitle: service.title,
      merchantName: service.merchant.business_name,
      date: selectedDate,
      time: selectedTime,
      price: service.price,
      price_unit: service.price_unit,
    }));

    setLoading(false);
    router.push('/booking/confirmed');
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="flex items-center gap-3 px-4 pt-12 pb-3 bg-white border-b border-nearmee-border sticky top-0 z-10">
        <button onClick={() => router.back()} className="p-1 -ml-1 text-nearmee-text-sec">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-base font-bold text-nearmee-text flex-1 truncate">Book Service</h1>
      </header>

      <main className="flex-1 pb-36">
        {/* Service summary */}
        <div className="flex items-center gap-3 px-4 py-3 bg-nearmee-surface border-b border-nearmee-border">
          <div className="w-12 h-12 rounded-xl bg-nearmee-light flex items-center justify-center text-2xl shrink-0">
            {getCategoryIcon(service.category)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-nearmee-text truncate">{service.title}</p>
            <p className="text-xs text-nearmee-text-sec mt-0.5">{service.merchant?.business_name}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-extrabold text-nearmee-coral">{formatPrice(service.price)}</p>
            <p className="text-[11px] text-nearmee-text-sec">{service.price_unit}</p>
          </div>
        </div>

        {/* Select Date */}
        <section className="px-4 py-4 border-b border-nearmee-border">
          <p className="text-xs font-bold text-nearmee-text-sec uppercase tracking-widest mb-3">Select Date</p>
          <DatePicker selected={selectedDate} onSelect={(d) => { setSelectedDate(d); setSelectedTime(''); }} />
        </section>

        {/* Select Time */}
        <section className="px-4 py-4 border-b border-nearmee-border">
          <p className="text-xs font-bold text-nearmee-text-sec uppercase tracking-widest mb-3">Select Time</p>
          <TimePicker slots={timeSlots} selected={selectedTime} onSelect={setSelectedTime} />
        </section>

        {/* Errands order form — only for errands category */}
        {isErrands && (
          <ErrandsOrderForm items={errandItems} onChange={setErrandItems} />
        )}

        {/* Notes */}
        <section className="px-4 py-4 border-b border-nearmee-border">
          <p className="text-xs font-bold text-nearmee-text-sec uppercase tracking-widest mb-3">
            Notes <span className="font-normal normal-case">(optional)</span>
          </p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Please bring extra tools. Gate code is 1234."
            rows={3}
            className="w-full border border-nearmee-border rounded-xl px-4 py-3 text-sm text-nearmee-text placeholder:text-nearmee-border outline-none focus:ring-2 focus:ring-nearmee-coral resize-none"
          />
        </section>

        {/* Booking summary */}
        <section className="px-4 py-4">
          <p className="text-xs font-bold text-nearmee-text-sec uppercase tracking-widest mb-3">Booking Summary</p>
          <div className="bg-nearmee-surface rounded-xl p-4 space-y-2.5">
            {[
              { label: 'Service',  value: service.title },
              { label: 'Provider', value: service.merchant?.business_name },
              { label: 'Date',     value: selectedDate || '—' },
              { label: 'Time',     value: selectedTime || '—' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-start gap-4">
                <span className="text-xs text-nearmee-text-sec shrink-0">{label}</span>
                <span className="text-xs font-semibold text-nearmee-text text-right">{value}</span>
              </div>
            ))}
            <div className="pt-2 border-t border-nearmee-border flex justify-between items-center">
              <span className="text-sm font-bold text-nearmee-text">Total</span>
              <span className="text-base font-extrabold text-nearmee-coral">
                {formatPrice(service.price)} <span className="text-xs font-normal text-nearmee-text-sec">{service.price_unit}</span>
              </span>
            </div>
          </div>
          <p className="text-xs text-nearmee-text-sec mt-2 text-center">
            Payment is made directly to the provider (cash or GCash).
          </p>

          {/* Cancellation policy warning */}
          <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3">
            <p className="text-xs font-bold text-amber-700 mb-1">⚠️ Cancellation Policy</p>
            <p className="text-xs text-amber-600 leading-relaxed">
              Only book if you can commit. Frequent cancellations or no-shows may result in account restrictions. The merchant is reserving time specifically for you.
            </p>
          </div>
          {error && <p className="text-xs text-red-500 text-center mt-2">{error}</p>}
        </section>
      </main>

      {/* Confirm CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-app bg-white border-t border-nearmee-border px-4 py-3 z-10">
        {!canConfirm && (
          <p className="text-xs text-center text-nearmee-text-sec mb-2">
            {!selectedDate ? 'Select a date' : 'Select a time slot'}
          </p>
        )}
        <button
          onClick={handleConfirm}
          disabled={!canConfirm || loading}
          className={`w-full py-4 rounded-xl text-white text-sm font-bold transition-opacity ${
            !canConfirm || loading ? 'bg-nearmee-coral opacity-40' : 'bg-nearmee-coral active:opacity-90'
          }`}
        >
          {loading ? 'Confirming…' : 'Confirm Booking'}
        </button>
      </div>
    </div>
  );
}
