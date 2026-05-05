'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { CITIES } from '@/lib/constants';

export default function EditProfilePage() {
  const router = useRouter();
  const { user, profile, refreshProfile } = useAuth();
  const supabase = createClient();

  const [form, setForm] = useState({ firstName: '', lastName: '', city: 'bayawan' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (profile?.full_name) {
      const parts = profile.full_name.trim().split(' ');
      setForm({
        firstName: parts[0] ?? '',
        lastName: parts.slice(1).join(' ') ?? '',
        city: profile.city?.toLowerCase().includes('dumaguete') ? 'dumaguete' : 'bayawan',
      });
    }
  }, [profile]);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setError('');
    setSuccess(false);
  }

  async function handleSave() {
    if (!form.firstName.trim()) { setError('First name is required'); return; }
    setLoading(true);

    const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();
    const cityLabel = CITIES.find((c) => c.id === form.city)?.label ?? 'Bayawan City';

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ full_name: fullName, city: cityLabel })
      .eq('id', user.id);

    if (updateError) {
      setError('Failed to save. Please try again.');
      setLoading(false);
      return;
    }

    await refreshProfile();
    setLoading(false);
    setSuccess(true);
    setTimeout(() => router.back(), 800);
  }

  const inputClass = 'w-full border border-nearmee-border rounded-xl px-4 py-3.5 text-sm text-nearmee-text outline-none focus:ring-2 focus:ring-nearmee-coral';

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="flex items-center gap-3 px-4 pt-12 pb-4 border-b border-nearmee-border sticky top-0 bg-white z-10">
        <button onClick={() => router.back()} className="p-1 -ml-1 text-nearmee-text-sec">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-base font-bold text-nearmee-text">Edit Profile</h1>
      </header>

      <main className="flex-1 px-4 py-6 flex flex-col gap-5">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-2">
          <div className="w-20 h-20 rounded-full bg-nearmee-coral flex items-center justify-center mb-3">
            <span className="text-2xl font-bold text-white uppercase">
              {(form.firstName[0] ?? '') + (form.lastName[0] ?? '') || '?'}
            </span>
          </div>
          <p className="text-xs text-nearmee-text-sec">Profile photo coming soon</p>
        </div>

        {/* Phone — read only */}
        <div>
          <label className="text-xs font-bold text-nearmee-text-sec uppercase tracking-wider mb-1.5 block">Mobile Number</label>
          <div className="flex items-center gap-2 border border-nearmee-border rounded-xl px-4 py-3.5 bg-nearmee-surface">
            <span className="text-base shrink-0">🇵🇭</span>
            <span className="text-sm text-nearmee-text-sec">{user?.phone || '—'}</span>
            <span className="ml-auto text-[10px] font-bold text-nearmee-text-sec bg-nearmee-border px-2 py-0.5 rounded">Verified</span>
          </div>
          <p className="text-xs text-nearmee-text-sec mt-1">Phone number cannot be changed</p>
        </div>

        {/* Name */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs font-bold text-nearmee-text-sec uppercase tracking-wider mb-1.5 block">
              First Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => set('firstName', e.target.value)}
              autoCapitalize="words"
              className={inputClass}
            />
          </div>
          <div className="flex-1">
            <label className="text-xs font-bold text-nearmee-text-sec uppercase tracking-wider mb-1.5 block">Last Name</label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => set('lastName', e.target.value)}
              autoCapitalize="words"
              className={inputClass}
            />
          </div>
        </div>

        {/* City */}
        <div>
          <label className="text-xs font-bold text-nearmee-text-sec uppercase tracking-wider mb-1.5 block">Location</label>
          <div className="flex gap-3">
            {CITIES.map((city) => (
              <button
                key={city.id}
                onClick={() => set('city', city.id)}
                className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-colors ${
                  form.city === city.id
                    ? 'border-nearmee-coral bg-nearmee-light text-nearmee-coral'
                    : 'border-nearmee-border text-nearmee-text-sec'
                }`}
              >
                {city.label}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}
        {success && <p className="text-xs text-green-600 font-semibold">✓ Profile updated!</p>}
      </main>

      <div className="px-4 pb-10 pt-3 border-t border-nearmee-border">
        <button
          onClick={handleSave}
          disabled={loading}
          className={`w-full py-4 rounded-xl text-white text-sm font-bold transition-opacity ${
            loading ? 'bg-nearmee-coral opacity-50' : 'bg-nearmee-coral active:opacity-90'
          }`}
        >
          {loading ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
