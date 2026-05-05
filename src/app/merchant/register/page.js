'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { registerMerchant } from '@/lib/hooks/useMerchant';
import { CATEGORIES, CITIES } from '@/lib/constants';

const STEPS = ['Business Info', 'Service Area', 'Review'];

export default function MerchantRegisterPage() {
  const router = useRouter();
  const { user, profile, refreshMerchant, toggleMerchantMode } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    businessName: '',
    phone: profile?.phone || user?.phone || '',
    category: '',
    city: 'bayawan',
    serviceArea: '',
    bio: '',
  });

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setError('');
  }

  function validateStep() {
    if (step === 0) {
      if (!form.businessName.trim()) return 'Business name is required';
      if (!form.phone.trim()) return 'Phone number is required';
      if (!form.category) return 'Select a service category';
    }
    if (step === 1) {
      if (!form.serviceArea.trim()) return 'Service area is required';
    }
    return '';
  }

  function next() {
    const err = validateStep();
    if (err) { setError(err); return; }
    setStep((s) => s + 1);
  }

  async function handleSubmit() {
    setLoading(true);
    const cityLabel = CITIES.find((c) => c.id === form.city)?.label ?? 'Bayawan City';
    const serviceArea = `${cityLabel}, ${form.serviceArea}`;

    const { error: regError } = await registerMerchant({
      userId: user.id,
      businessName: form.businessName.trim(),
      phone: form.phone.trim(),
      category: form.category,
      serviceArea,
      bio: form.bio.trim(),
    });

    if (regError) {
      setError('Registration failed. Please try again.');
      setLoading(false);
      return;
    }

    await refreshMerchant();
    toggleMerchantMode();
    setLoading(false);
    router.replace('/merchant/dashboard');
  }

  const inputClass = (err) =>
    `w-full border rounded-xl px-4 py-3.5 text-sm text-nearmee-text outline-none focus:ring-2 focus:ring-nearmee-coral ${err ? 'border-red-400' : 'border-nearmee-border'}`;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="px-4 pt-12 pb-4 border-b border-nearmee-border">
        <button onClick={() => step > 0 ? setStep(s => s - 1) : router.back()} className="text-nearmee-text-sec mb-4 flex items-center gap-1 text-sm">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back
        </button>
        <h1 className="text-2xl font-extrabold text-nearmee-text">Become a Merchant</h1>
        <p className="text-sm text-nearmee-text-sec mt-1">Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>

        {/* Progress bar */}
        <div className="flex gap-1.5 mt-3">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-nearmee-coral' : 'bg-nearmee-border'}`} />
          ))}
        </div>
      </header>

      <main className="flex-1 px-4 py-6 flex flex-col gap-5">

        {/* Step 0 — Business Info */}
        {step === 0 && (
          <>
            {/* Guide box */}
            <div className="bg-nearmee-light rounded-xl p-4">
              <p className="text-xs font-bold text-nearmee-coral mb-1">🏪 Your Business Profile</p>
              <p className="text-xs text-nearmee-text-sec leading-relaxed">
                This is your <span className="font-semibold text-nearmee-text">brand identity</span> — what customers see when they find you. You only register once. Think of it like your business signage.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-nearmee-text-sec uppercase tracking-wider mb-1.5 block">Business Name *</label>
              <input
                type="text"
                value={form.businessName}
                onChange={(e) => set('businessName', e.target.value)}
                placeholder="e.g. Mang Nestor Plumbing"
                autoCapitalize="words"
                className={inputClass(false)}
              />
              <div className="mt-2 bg-nearmee-surface rounded-lg px-3 py-2">
                <p className="text-[11px] font-semibold text-nearmee-text-sec mb-1">💡 Good examples:</p>
                <p className="text-[11px] text-nearmee-text-sec">• <span className="text-nearmee-text">Ate Leny's Lutong Bahay</span> — meals</p>
                <p className="text-[11px] text-nearmee-text-sec">• <span className="text-nearmee-text">JD Pasuyo Services</span> — errands</p>
                <p className="text-[11px] text-nearmee-text-sec">• <span className="text-nearmee-text">SparkleClean Bayawan</span> — cleaning</p>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-nearmee-text-sec uppercase tracking-wider mb-1.5 block">Contact Number *</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                placeholder="09XXXXXXXXX"
                className={inputClass(false)}
              />
              <p className="text-xs text-nearmee-text-sec mt-1">Customers will call or message you on this number after booking.</p>
            </div>

            <div>
              <label className="text-xs font-bold text-nearmee-text-sec uppercase tracking-wider mb-1.5 block">Primary Category *</label>
              <p className="text-xs text-nearmee-text-sec mb-2">Choose your main type of service. You can add services from other categories later.</p>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => set('category', cat.id)}
                    className={`flex items-center gap-2 px-3 py-3 rounded-xl border text-sm font-semibold transition-colors ${
                      form.category === cat.id
                        ? 'border-nearmee-coral bg-nearmee-light text-nearmee-coral'
                        : 'border-nearmee-border text-nearmee-text-sec'
                    }`}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Step 1 — Service Area */}
        {step === 1 && (
          <>
            <div className="bg-nearmee-light rounded-xl p-4">
              <p className="text-xs font-bold text-nearmee-coral mb-1">📍 Where You Operate</p>
              <p className="text-xs text-nearmee-text-sec leading-relaxed">
                Customers search by location — be specific so the right customers in your area can find you.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-nearmee-text-sec uppercase tracking-wider mb-1.5 block">City *</label>
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

            <div>
              <label className="text-xs font-bold text-nearmee-text-sec uppercase tracking-wider mb-1.5 block">Specific Area / Barangay *</label>
              <input
                type="text"
                value={form.serviceArea}
                onChange={(e) => set('serviceArea', e.target.value)}
                placeholder="e.g. Poblacion, Ubos, Timbao, Proper"
                className={inputClass(false)}
              />
              <div className="mt-2 bg-nearmee-surface rounded-lg px-3 py-2">
                <p className="text-[11px] font-semibold text-nearmee-text-sec mb-0.5">💡 Be specific:</p>
                <p className="text-[11px] text-nearmee-text-sec">Enter the barangay or area you serve most. If you cover the whole city, write <span className="font-semibold text-nearmee-text">Bayawan City, All Areas</span>.</p>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-nearmee-text-sec uppercase tracking-wider mb-1.5 block">
                About Your Business <span className="font-normal normal-case">(optional but recommended)</span>
              </label>
              <textarea
                value={form.bio}
                onChange={(e) => set('bio', e.target.value)}
                placeholder="e.g. Licensed plumber with 10 years experience. Available for emergency calls. Tools and materials included."
                rows={4}
                className="w-full border border-nearmee-border rounded-xl px-4 py-3 text-sm text-nearmee-text outline-none focus:ring-2 focus:ring-nearmee-coral resize-none"
              />
              <p className="text-xs text-nearmee-text-sec mt-1">Merchants with a bio get 3x more bookings. Mention your experience, certifications, and what makes you reliable.</p>
            </div>
          </>
        )}

        {/* Step 2 — Review */}
        {step === 2 && (
          <>
            <div className="bg-nearmee-surface rounded-xl p-4 space-y-3">
              {[
                { label: 'Business Name', value: form.businessName },
                { label: 'Phone', value: form.phone },
                { label: 'Category', value: CATEGORIES.find((c) => c.id === form.category)?.label },
                { label: 'City', value: CITIES.find((c) => c.id === form.city)?.label },
                { label: 'Service Area', value: form.serviceArea },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-4">
                  <span className="text-xs text-nearmee-text-sec shrink-0">{label}</span>
                  <span className="text-xs font-semibold text-nearmee-text text-right">{value || '—'}</span>
                </div>
              ))}
              {form.bio && (
                <div className="pt-3 border-t border-nearmee-border">
                  <p className="text-xs text-nearmee-text-sec mb-1">About</p>
                  <p className="text-xs text-nearmee-text">{form.bio}</p>
                </div>
              )}
            </div>

            <div className="bg-nearmee-light rounded-xl p-4">
              <p className="text-xs font-semibold text-nearmee-coral">📋 Free Starter Plan</p>
              <p className="text-xs text-nearmee-text-sec mt-1">1 active listing · 10 bookings/month · Upgrade anytime for more features</p>
            </div>
          </>
        )}

        {error && <p className="text-xs text-red-500">{error}</p>}
      </main>

      {/* CTA */}
      <div className="px-4 pb-10 pt-3 border-t border-nearmee-border">
        {step < 2 ? (
          <button
            onClick={next}
            className="w-full py-4 bg-nearmee-coral text-white text-sm font-bold rounded-xl active:opacity-90"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-4 text-white text-sm font-bold rounded-xl transition-opacity ${loading ? 'bg-nearmee-coral opacity-50' : 'bg-nearmee-coral active:opacity-90'}`}
          >
            {loading ? 'Registering…' : 'Complete Registration'}
          </button>
        )}
      </div>
    </div>
  );
}
