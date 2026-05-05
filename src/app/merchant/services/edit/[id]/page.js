'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { CATEGORIES, PRICE_UNITS } from '@/lib/constants';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const TIME_SLOTS = ['7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

export default function EditServicePage() {
  const { id } = useParams();
  const router = useRouter();
  const { merchant } = useAuth();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '', category: '', price: '', priceUnit: 'per visit',
    description: '', days: [], times: [],
  });

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('services')
        .select('*, availability(day_of_week, time_slot)')
        .eq('id', id)
        .single();

      if (data) {
        setForm({
          title: data.title,
          category: data.category,
          price: String(data.price),
          priceUnit: data.price_unit,
          description: data.description || '',
          days: [...new Set((data.availability ?? []).map((a) => a.day_of_week))],
          times: [...new Set((data.availability ?? []).map((a) => a.time_slot))],
        });
      }
      setLoading(false);
    }
    load();
  }, [id]);

  function set(field, value) { setForm((f) => ({ ...f, [field]: value })); setError(''); }
  function toggleDay(day) { setForm((f) => ({ ...f, days: f.days.includes(day) ? f.days.filter((d) => d !== day) : [...f.days, day] })); }
  function toggleTime(time) { setForm((f) => ({ ...f, times: f.times.includes(time) ? f.times.filter((t) => t !== time) : [...f.times, time] })); }

  async function handleSave() {
    if (!form.title.trim()) { setError('Title is required'); return; }
    if (!form.price || Number(form.price) <= 0) { setError('Enter a valid price'); return; }
    setSaving(true);

    await supabase.from('services').update({
      title: form.title.trim(),
      category: form.category,
      price: Number(form.price),
      price_unit: form.priceUnit,
      description: form.description.trim() || null,
    }).eq('id', id);

    // Replace availability
    await supabase.from('availability').delete().eq('service_id', id);
    const slots = [];
    form.days.forEach((day) => {
      form.times.forEach((time) => {
        slots.push({ service_id: id, day_of_week: day, time_slot: time, is_available: true });
      });
    });
    if (slots.length > 0) await supabase.from('availability').insert(slots);

    setSaving(false);
    router.replace('/merchant/services');
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-2 border-nearmee-coral border-t-transparent rounded-full animate-spin" /></div>;
  }

  const inputClass = 'w-full border border-nearmee-border rounded-xl px-4 py-3.5 text-sm text-nearmee-text outline-none focus:ring-2 focus:ring-nearmee-coral';

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="flex items-center gap-3 px-4 pt-12 pb-3 border-b border-nearmee-border sticky top-0 bg-white z-10">
        <button onClick={() => router.back()} className="p-1 -ml-1 text-nearmee-text-sec">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m15 18-6-6 6-6" /></svg>
        </button>
        <h1 className="text-base font-bold text-nearmee-text">Edit Service</h1>
      </header>

      <main className="flex-1 pb-32 divide-y divide-nearmee-border">
        <section className="px-4 py-5 flex flex-col gap-4">
          <p className="text-xs font-bold text-nearmee-text-sec uppercase tracking-widest">Service Details</p>

          <div>
            <label className="text-xs font-semibold text-nearmee-text-sec mb-1.5 block">Service Title *</label>
            <input type="text" value={form.title} onChange={(e) => set('title', e.target.value)} className={inputClass} autoCapitalize="words" />
          </div>

          <div>
            <label className="text-xs font-semibold text-nearmee-text-sec mb-1.5 block">Category</label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => (
                <button key={cat.id} onClick={() => set('category', cat.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold ${form.category === cat.id ? 'border-nearmee-coral bg-nearmee-light text-nearmee-coral' : 'border-nearmee-border text-nearmee-text-sec'}`}>
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
                  className="flex-1 py-3.5 text-sm text-nearmee-text outline-none bg-transparent" />
              </div>
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-nearmee-text-sec mb-1.5 block">Unit</label>
              <div className="relative">
                <select value={form.priceUnit} onChange={(e) => set('priceUnit', e.target.value)}
                  className="w-full border border-nearmee-border rounded-xl px-3 py-3.5 text-sm text-nearmee-text outline-none appearance-none focus:ring-2 focus:ring-nearmee-coral bg-white">
                  {PRICE_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5" strokeLinecap="round"><path d="m6 9 6 6 6-6" /></svg>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-nearmee-text-sec mb-1.5 block">Description</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)}
              rows={3} className="w-full border border-nearmee-border rounded-xl px-4 py-3 text-sm text-nearmee-text outline-none focus:ring-2 focus:ring-nearmee-coral resize-none" />
          </div>
        </section>

        <section className="px-4 py-5 flex flex-col gap-4">
          <p className="text-xs font-bold text-nearmee-text-sec uppercase tracking-widest">Availability</p>
          <div>
            <p className="text-xs font-semibold text-nearmee-text-sec mb-2">Available Days</p>
            <div className="flex gap-2 flex-wrap">
              {DAYS.map((day, i) => (
                <button key={day} onClick={() => toggleDay(i)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold ${form.days.includes(i) ? 'bg-nearmee-coral text-white' : 'bg-nearmee-surface text-nearmee-text-sec'}`}>
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
                  className={`px-3 py-2 rounded-xl text-xs font-bold ${form.times.includes(time) ? 'bg-nearmee-coral text-white' : 'bg-nearmee-surface text-nearmee-text-sec'}`}>
                  {time}
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-app bg-white border-t border-nearmee-border px-4 py-3 z-10">
        {error && <p className="text-xs text-red-500 text-center mb-2">{error}</p>}
        <button onClick={handleSave} disabled={saving}
          className={`w-full py-4 rounded-xl text-white text-sm font-bold ${saving ? 'bg-nearmee-coral opacity-50' : 'bg-nearmee-coral active:opacity-90'}`}>
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
