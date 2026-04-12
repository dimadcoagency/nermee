'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function formatPhone(raw) {
    // Strip non-digits
    const digits = raw.replace(/\D/g, '');
    // Format as 09XX XXX XXXX
    if (digits.length <= 4) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 11)}`;
  }

  const rawDigits = phone.replace(/\D/g, '');
  const isValid = rawDigits.length === 11 && rawDigits.startsWith('09');

  async function handleSendOTP(e) {
    e.preventDefault();
    if (!isValid) {
      setError('Enter a valid Philippine mobile number (e.g. 09171234567)');
      return;
    }
    setError('');
    setLoading(true);

    // Store phone for the verify page
    localStorage.setItem('nermee_pending_phone', rawDigits);

    // Simulate network delay — replace with Supabase OTP in Sprint 2
    await new Promise((r) => setTimeout(r, 1000));

    setLoading(false);
    router.push('/auth/verify');
  }

  return (
    <div className="flex flex-col min-h-screen bg-white px-6">
      {/* Back */}
      <div className="pt-12 pb-2">
        <Link href="/" className="inline-flex items-center gap-1 text-nearmee-text-sec text-sm">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back
        </Link>
      </div>

      {/* Logo */}
      <div className="mt-8 mb-10">
        <div className="w-14 h-14 rounded-2xl bg-nearmee-coral flex items-center justify-center mb-5">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
            <path d="M9 21V12h6v9" fill="white" />
          </svg>
        </div>
        <h1 className="text-2xl font-extrabold text-nearmee-text">Welcome to Nearmee</h1>
        <p className="text-sm text-nearmee-text-sec mt-1">Enter your mobile number to get started</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSendOTP} className="flex flex-col gap-5">
        <div>
          <label className="text-xs font-bold text-nearmee-text-sec uppercase tracking-wider mb-2 block">
            Mobile Number
          </label>
          <div className="flex items-center gap-2 border border-nearmee-border rounded-xl px-4 py-3.5 focus-within:ring-2 focus-within:ring-nearmee-coral transition-all bg-white">
            {/* PH flag + code */}
            <span className="text-base shrink-0">🇵🇭</span>
            <span className="text-sm font-semibold text-nearmee-text shrink-0">+63</span>
            <div className="w-px h-4 bg-nearmee-border mx-1 shrink-0" />
            <input
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 11);
                setPhone(formatPhone(digits));
                setError('');
              }}
              placeholder="09XX XXX XXXX"
              className="flex-1 outline-none text-sm font-medium text-nearmee-text placeholder:text-nearmee-border bg-transparent"
            />
          </div>
          {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
          <p className="text-xs text-nearmee-text-sec mt-2">
            We'll send a one-time code to verify your number.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-xl text-white text-sm font-bold transition-opacity ${
            loading || !isValid ? 'bg-nearmee-coral opacity-50' : 'bg-nearmee-coral active:opacity-90'
          }`}
        >
          {loading ? 'Sending code…' : 'Send OTP'}
        </button>
      </form>

      <p className="text-xs text-nearmee-text-sec text-center mt-8 leading-relaxed">
        By continuing, you agree to Nearmee's{' '}
        <span className="text-nearmee-coral font-semibold">Terms of Service</span>{' '}
        and{' '}
        <span className="text-nearmee-coral font-semibold">Privacy Policy</span>.
      </p>
    </div>
  );
}
