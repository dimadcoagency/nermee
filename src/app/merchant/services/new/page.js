'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createService } from '@/lib/hooks/useMerchant';
import { CATEGORIES, PRICE_UNITS } from '@/lib/constants';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const TIME_SLOTS = ['7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

export default function NewServicePage() {
  const router = useRouter();
  const { merchant } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    category: '',
    price: '',
    priceUnit: 'per visit',
    description: '',
    days: [1, 2, 3, 4, 5],
    times: ['8:00 AM', '9:00 AM', '10:00 AM', '2:00 PM', '3:00 PM'],
  });

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setError('');
  }

  function toggleDay(day) {
    setForm((f) => ({
      ...f,
      days: f.days.includes(day) ? f.days.filter((d) => d !== day) : [...f.days, day],
    }));
  }

  function toggleTime(time) {
    setForm((f) => ({
      ...f,
      times: f.times.includes(time) ? f.times.filter((t) => t !== time) : [...f.times, time],
    }));
  }

  async function handleSubmit() {
    if (!form.title.trim()) { setError('Service title is required'); return; }
    if (!form.category) { setError('Select a category'); return; }
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) { setError('Enter a valid price'); return; }
    if (form.days.length === 0) { setError('Select at least one available day'); return; }
    if (form.times.length === 0) { setError('Select at least one time slot'); return; }

    setLoading(true);
    // Derive city from merchant's service_area (e.g. "Bayawan City, Poblacion" → "Bayawan City")
    const city = merchant?.service_area?.toLowerCase().includes('dumaguete')
      ? 'Dumaguete City'
      : 'Bayawan City';

    const { error: createError } = await createService({
      merchantId: merchant.id,
      city,
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      price: form.price,
      priceUnit: form.priceUnit,
      availability: { days: form.days, times: form.times },
    });

    if (createError) {
      setError('Failed to create service. Please try again.');
      setLoading(false);
      return;
    }

    setLoading(false);
    router.replace('/merchant/services');
  }

  const inputClass = 'w-full border border-nearmee-border rounded-xl px-4 py-3.5 text-sm text-nearmee-text outline-none focus:ring-2 focus:ring-nearmee-coral';

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="flex items-center gap-3 px-4 pt-12 pb-3 border-b border-nearmee-border sticky top-0 bg-white z-10">
        <button onClick={() => router.back()} className="p-1 -ml-1 text-nearmee-text-sec">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-base font-bold text-nearmee-text">Post a Service</h1>
      </header>

      <main className="flex-1 pb-32 divide-y divide-nearmee-border">
        {/* Guide box */}
        <section className="px-4 py-4">
          <div className="bg-nearmee-light rounded-xl p-4">
            <p className="text-xs font-bold text-nearmee-coral mb-1">📋 What is a Service?</p>
            <p className="text-xs text-nearmee-text-sec leading-relaxed mb-2">
              A service is a <span className="font-semibold text-nearmee-text">specific task</span> you offer at a specific price. One merchant can have multiple services. Think of it as your menu item.
            </p>
            <p className="text-xs font-semibold text-nearmee-text mb-1">✅ Good service names:</p>
            <p className="text-xs text-nearmee-text-sec">• Pipe Repair & Leak Fixing</p>
            <p className="text-xs text-nearmee-text-sec">• Home-cooked Lunch Box Delivery</p>
            <p className="text-xs text-nearmee-text-sec">• Grocery Errand – SM & Savemore</p>
            <p className="text-xs text-nearmee-text-sec">• House Deep Cleaning (2–3 BR)</p>
            <p className="text-xs text-nearmee-text-sec mt-1 font-semibold text-red-400">❌ Too vague: "Plumbing" · "My Service" · "Available"</p>
          </div>
        </section>

        {/* Basic info */}
        <section className="px-4 py-5 flex flex-col gap-4">
          <p className="text-xs font-bold text-nearmee-text-sec uppercase tracking-widest">Service Details</p>

          <div>
            <label className="text-xs font-semibold text-nearmee-text-sec mb-1.5 block">Service Title *</label>
            <input type="text" value={form.title} onChange={(e) => set('title', e.target.value)}
              placeholder="e.g. Plumbing Repair & Pipe Fixing" className={inputClass} autoCapitalize="words" />
            <p className="text-xs text-nearmee-text-sec mt-1">Format: <span className="font-semibold text-nearmee-text">[Action] + [Specific Task]</span></p>
          </div>

          <div>
            <label className="text-xs font-semibold text-nearmee-text-sec mb-1.5 block">Category *</label>
            <p className="text-xs text-nearmee-text-sec mb-2">Choose the category that best matches this specific service.</p>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => (
                <button key={cat.id} onClick={() => set('category', cat.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-colors ${
                    form.category === cat.id ? 'border-nearmee-coral bg-nearmee-light text-nearmee-coral' : 'border-nearmee-border text-nearmee-text-sec'
                  }`}>
                  <span>{cat.icon}</span><span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-semibold text-nearmee-text-sec mb-1.5 block">Price *</label>
              <div className="flex items-center border border-nearmee-border rounded-xl px-4 focus-within:ring-2 focus-within:ring-nearmee-coral">
                <span className="text-sm font-bold text-nearmee-text-sec mr-1">₱</span>
                <input type="number" inputMode="decimal" value={form.price} onChange={(e) => set('price', e.target.value)}
                  placeholder="0.00" className="flex-1 py-3.5 text-sm text-nearmee-text outline-none bg-transparent" />
              </div>
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-nearmee-text-sec mb-1.5 block">Unit</label>
              <div className="relative">
                <select value={form.priceUnit} onChange={(e) => set('priceUnit', e.target.value)}
                  className="w-full border border-nearmee-border rounded-xl px-3 py-3.5 text-sm text-nearmee-text outline-none appearance-none focus:ring-2 focus:ring-nearmee-coral bg-white">
                  {PRICE_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5" strokeLinecap="round">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-nearmee-text-sec mb-1.5 block">Description <span className="font-normal">(optional but recommended)</span></label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)}
              placeholder="e.g. Includes labor. Leaky pipes, faucet replacement, drain unclogging. Tools included. Materials charged separately. Available for emergency calls."
              rows={4} className="w-full border border-nearmee-border rounded-xl px-4 py-3 text-sm text-nearmee-text outline-none focus:ring-2 focus:ring-nearmee-coral resize-none" />
            <div className="mt-2 bg-nearmee-surface rounded-lg px-3 py-2">
              <p className="text-[11px] font-semibold text-nearmee-text-sec mb-0.5">💡 What to include:</p>
              <p className="text-[11px] text-nearmee-text-sec">• What's included in the price</p>
              <p className="text-[11px] text-nearmee-text-sec">• Any requirements from the customer</p>
              <p className="text-[11px] text-nearmee-text-sec">• Minimum order or conditions</p>
              <p className="text-[11px] text-nearmee-text-sec">• Special notes (e.g. materials not included)</p>
            </div>
          </div>
        </section>

        {/* Availability */}
        <section className="px-4 py-5 flex flex-col gap-4">
          <div>
            <p className="text-xs font-bold text-nearmee-text-sec uppercase tracking-widest mb-1">Availability</p>
            <p className="text-xs text-nearmee-text-sec">Set the days and times customers can book this service. You can change this anytime.</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-nearmee-text-sec mb-2">Available Days</p>
            <div className="flex gap-2 flex-wrap">
              {DAYS.map((day, i) => (
                <button key={day} onClick={() => toggleDay(i)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                    form.days.includes(i) ? 'bg-nearmee-coral text-white' : 'bg-nearmee-surface text-nearmee-text-sec'
                  }`}>
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-nearmee-text-sec mb-2">Available Times</p>
            <div className="flex gap-2 flex-wrap">
              {TIME_SLOTS.map((time) => (
                <button key={time} onClick={() => toggleTime(time)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                    form.times.includes(time) ? 'bg-nearmee-coral text-white' : 'bg-nearmee-surface text-nearmee-text-sec'
                  }`}>
                  {time}
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-app bg-white border-t border-nearmee-border px-4 py-3 z-10">
        {error && <p className="text-xs text-red-500 text-center mb-2">{error}</p>}
        <button onClick={handleSubmit} disabled={loading}
          className={`w-full py-4 rounded-xl text-white text-sm font-bold transition-opacity ${loading ? 'bg-nearmee-coral opacity-50' : 'bg-nearmee-coral active:opacity-90'}`}>
          {loading ? 'Posting…' : 'Post Service'}
        </button>
      </div>
    </div>
  );
}
