'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const MOCK_OTP = '123456'; // Replace with Supabase verify in Sprint 2

export default function VerifyPage() {
  const router = useRouter();
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [phone, setPhone] = useState('');
  const inputRefs = useRef([]);

  useEffect(() => {
    const stored = localStorage.getItem('nermee_pending_phone');
    if (!stored) { router.replace('/auth/login'); return; }
    // Display masked: 0917 *** 4567
    setPhone(`${stored.slice(0, 4)} *** ${stored.slice(7)}`);
    inputRefs.current[0]?.focus();
  }, []);

  // Countdown for resend
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
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    // Auto-verify when all 6 filled
    if (digit && index === 5) {
      const code = [...next].join('');
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
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    // Mock: accept 123456 — replace with Supabase verifyOtp() in Sprint 2
    if (code !== MOCK_OTP) {
      setError('Incorrect code. Try 123456 for now.');
      setLoading(false);
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      return;
    }

    // Check if user already has a profile
    const stored = localStorage.getItem('nermee_user');
    setLoading(false);

    if (stored) {
      router.replace('/');
    } else {
      router.replace('/auth/setup');
    }
  }

  async function handleResend() {
    if (resendTimer > 0) return;
    setResendTimer(30);
    setDigits(['', '', '', '', '', '']);
    setError('');
    inputRefs.current[0]?.focus();
  }

  const filled = digits.join('').length;

  return (
    <div className="flex flex-col min-h-screen bg-white px-6">
      {/* Back */}
      <div className="pt-12 pb-2">
        <Link href="/auth/login" className="inline-flex items-center gap-1 text-nermee-text-sec text-sm">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back
        </Link>
      </div>

      <div className="mt-8 mb-10">
        <div className="w-14 h-14 rounded-2xl bg-nermee-light flex items-center justify-center mb-5">
          <span className="text-3xl">📱</span>
        </div>
        <h1 className="text-2xl font-extrabold text-nermee-text">Enter your code</h1>
        <p className="text-sm text-nermee-text-sec mt-1">
          We sent a 6-digit code to <span className="font-semibold text-nermee-text">{phone}</span>
        </p>
        <p className="text-xs text-nermee-text-sec mt-1">(Use <span className="font-bold">123456</span> to test)</p>
      </div>

      {/* OTP inputs */}
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
              ${d ? 'border-nermee-green bg-nermee-light text-nermee-green' : 'border-nermee-border bg-white text-nermee-text'}
              focus:border-nermee-green`}
          />
        ))}
      </div>

      {error && (
        <p className="text-xs text-red-500 text-center mb-4">{error}</p>
      )}

      {/* Verify button */}
      <button
        onClick={() => verifyOTP(digits.join(''))}
        disabled={filled < 6 || loading}
        className={`w-full py-4 rounded-xl text-white text-sm font-bold transition-opacity ${
          filled < 6 || loading ? 'bg-nermee-green opacity-50' : 'bg-nermee-green active:opacity-90'
        }`}
      >
        {loading ? 'Verifying…' : 'Verify Code'}
      </button>

      {/* Resend */}
      <div className="text-center mt-6">
        {resendTimer > 0 ? (
          <p className="text-sm text-nermee-text-sec">
            Resend code in <span className="font-semibold text-nermee-text">{resendTimer}s</span>
          </p>
        ) : (
          <button
            onClick={handleResend}
            className="text-sm font-semibold text-nermee-green"
          >
            Resend Code
          </button>
        )}
      </div>
    </div>
  );
}
