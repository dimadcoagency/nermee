'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { CITIES } from '@/lib/constants';
import { createClient } from '@/lib/supabase/client';

export default function ProfileSetupPage() {
  const router = useRouter();
  const { user, refreshProfile } = useAuth();
  const [form, setForm] = useState({ name: '', lastName: '', email: '', city: 'bayawan' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: '' }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'First name is required';
    if (!form.lastName.trim()) e.lastName = 'Last name is required';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Enter a valid email address';
    }
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);

    const cityLabel = CITIES.find((c) => c.id === form.city)?.label ?? form.city;
    const fullName = `${form.name.trim()} ${form.lastName.trim()}`;

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        city: cityLabel,
      })
      .eq('id', user?.id);

    if (error) {
      setErrors({ name: 'Something went wrong. Please try again.' });
      setLoading(false);
      return;
    }

    await refreshProfile();
    setLoading(false);
    router.replace('/');
  }

  return (
    <div className="flex flex-col min-h-screen bg-white px-6 pb-10">
      <div className="pt-12 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-nearmee-coral flex items-center justify-center mb-5">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <h1 className="text-2xl font-extrabold text-nearmee-text">Complete your profile</h1>
        <p className="text-sm text-nearmee-text-sec mt-1">Just a few details to get started</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs font-bold text-nearmee-text-sec uppercase tracking-wider mb-1.5 block">
              First Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Juan"
              autoCapitalize="words"
              className={`w-full border rounded-xl px-4 py-3.5 text-sm text-nearmee-text placeholder:text-nearmee-border outline-none transition-all focus:ring-2 focus:ring-nearmee-coral ${
                errors.name ? 'border-red-400' : 'border-nearmee-border'
              }`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div className="flex-1">
            <label className="text-xs font-bold text-nearmee-text-sec uppercase tracking-wider mb-1.5 block">
              Last Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => set('lastName', e.target.value)}
              placeholder="Dela Cruz"
              autoCapitalize="words"
              className={`w-full border rounded-xl px-4 py-3.5 text-sm text-nearmee-text placeholder:text-nearmee-border outline-none transition-all focus:ring-2 focus:ring-nearmee-coral ${
                errors.lastName ? 'border-red-400' : 'border-nearmee-border'
              }`}
            />
            {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-nearmee-text-sec uppercase tracking-wider mb-1.5 block">
            Email <span className="text-nearmee-text-sec font-normal normal-case">(optional)</span>
          </label>
          <input
            type="email"
            inputMode="email"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder="juan@example.com"
            className={`w-full border rounded-xl px-4 py-3.5 text-sm text-nearmee-text placeholder:text-nearmee-border outline-none transition-all focus:ring-2 focus:ring-nearmee-coral ${
              errors.email ? 'border-red-400' : 'border-nearmee-border'
            }`}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="text-xs font-bold text-nearmee-text-sec uppercase tracking-wider mb-1.5 block">
            Location <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <select
              value={form.city}
              onChange={(e) => set('city', e.target.value)}
              className="w-full border border-nearmee-border rounded-xl px-4 py-3.5 text-sm text-nearmee-text outline-none appearance-none focus:ring-2 focus:ring-nearmee-coral bg-white"
            >
              {CITIES.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.label}, {city.region}
                </option>
              ))}
            </select>
            <svg
              className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-nearmee-text-sec"
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-xl text-white text-sm font-bold mt-2 transition-opacity ${
            loading ? 'bg-nearmee-coral opacity-60' : 'bg-nearmee-coral active:opacity-90'
          }`}
        >
          {loading ? 'Saving…' : 'Save & Continue'}
        </button>
      </form>
    </div>
  );
}
