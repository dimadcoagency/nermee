'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function VerifyPage() {
  const router = useRouter();
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [phone, setPhone] = useState('');
  const [e164, setE164] = useState('');
  const inputRefs = useRef([]);
  const supabase = createClient();

  useEffect(() => {
    const stored = localStorage.getItem('nearmee_pending_phone');
    if (!stored) { router.replace('/auth/login'); return; }
    setE164(stored);
    // Display masked: +63917 *** 4567
    const local = '0' + stored.slice(3);
    setPhone(`${local.slice(0, 4)} *** ${local.slice(7)}`);
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  function handleDigit(index, value) {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    setError('');
    if (digit && index < 5) inputRefs.current[index + 1]?.focus();
    if (digit && index === 5) {
      const code = next.join('');
      if (code.length === 6) verifyOTP(code);
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const next = [...digits];
    pasted.split('').forEach((d, i) => { next[i] = d; });
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    if (pasted.length === 6) verifyOTP(pasted);
  }

  async function verifyOTP(code) {
    if (!e164) return;
    setLoading(true);

    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      phone: e164,
      token: code,
      type: 'sms',
    });

    if (verifyError) {
      setError('Incorrect code. Please try again.');
      setLoading(false);
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      return;
    }

    localStorage.removeItem('nearmee_pending_phone');

    // Check if profile is complete (has a full_name set)
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', data.user.id)
      .single();

    setLoading(false);

    const redirect = localStorage.getItem('nearmee_redirect');

    if (profile?.full_name) {
      if (redirect) {
        localStorage.removeItem('nearmee_redirect');
        router.replace(redirect);
      } else {
        router.replace('/');
      }
    } else {
      router.replace('/auth/setup');
    }
  }

  async function handleResend() {
    if (resendTimer > 0 || !e164) return;
    setResendTimer(30);
    setDigits(['', '', '', '', '', '']);
    setError('');
    await supabase.auth.signInWithOtp({ phone: e164 });
    inputRefs.current[0]?.focus();
  }

  const filled = digits.join('').length;

  return (
    <div className="flex flex-col min-h-screen bg-white px-6">
      <div className="pt-12 pb-2">
        <Link href="/auth/login" className="inline-flex items-center gap-1 text-nearmee-text-sec text-sm">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back
        </Link>
      </div>

      <div className="mt-8 mb-10">
        <div className="w-14 h-14 rounded-2xl bg-nearmee-light flex items-center justify-center mb-5">
          <span className="text-3xl">📱</span>
        </div>
        <h1 className="text-2xl font-extrabold text-nearmee-text">Enter your code</h1>
        <p className="text-sm text-nearmee-text-sec mt-1">
          We sent a 6-digit code to <span className="font-semibold text-nearmee-text">{phone}</span>
        </p>
      </div>

      <div className="flex gap-3 justify-center mb-6" onPaste={handlePaste}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => (inputRefs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={(e) => handleDigit(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all
              ${d ? 'border-nearmee-coral bg-nearmee-light text-nearmee-coral' : 'border-nearmee-border bg-white text-nearmee-text'}
              focus:border-nearmee-coral`}
          />
        ))}
      </div>

      {error && <p className="text-xs text-red-500 text-center mb-4">{error}</p>}

      <button
        onClick={() => verifyOTP(digits.join(''))}
        disabled={filled < 6 || loading}
        className={`w-full py-4 rounded-xl text-white text-sm font-bold transition-opacity ${
          filled < 6 || loading ? 'bg-nearmee-coral opacity-50' : 'bg-nearmee-coral active:opacity-90'
        }`}
      >
        {loading ? 'Verifying…' : 'Verify Code'}
      </button>

      <div className="text-center mt-6">
        {resendTimer > 0 ? (
          <p className="text-sm text-nearmee-text-sec">
            Resend code in <span className="font-semibold text-nearmee-text">{resendTimer}s</span>
          </p>
        ) : (
          <button onClick={handleResend} className="text-sm font-semibold text-nearmee-coral">
            Resend Code
          </button>
        )}
      </div>
    </div>
  );
}
