'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';

const REASONS = [
  'Fake or misleading listing',
  'No-show / did not fulfill booking',
  'Rude or unprofessional behavior',
  'Overcharging or price mismatch',
  'Scam or fraudulent activity',
  'Inappropriate content',
  'Safety concern',
  'Other',
];

function ReportForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const supabase = createClient();

  const serviceId = searchParams.get('service');
  const merchantId = searchParams.get('merchant');
  const bookingId = searchParams.get('booking');

  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    if (!reason) { setError('Please select a reason'); return; }
    if (!user) { router.push('/auth/login'); return; }

    setLoading(true);
    const { error: submitError } = await supabase.from('reports').insert({
      reporter_id: user.id,
      reported_service_id: serviceId || null,
      reported_merchant_id: merchantId || null,
      reported_booking_id: bookingId || null,
      reason,
      details: details.trim() || null,
      status: 'pending',
    });

    if (submitError) {
      setError('Failed to submit report. Please try again.');
      setLoading(false);
      return;
    }

    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col min-h-screen bg-white px-6">
        <div className="pt-12 mb-6">
          <button onClick={() => router.back()} className="text-nearmee-text-sec text-sm flex items-center gap-1">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m15 18-6-6 6-6" /></svg>
            Back
          </button>
        </div>
        <div className="flex flex-col items-center justify-center flex-1 text-center">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-5">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="text-xl font-extrabold text-nearmee-text mb-2">Report Submitted</h2>
          <p className="text-sm text-nearmee-text-sec mb-8 leading-relaxed">
            Thank you for helping keep Nearmee safe. Our team will review your report within 24–48 hours.
          </p>
          <button
            onClick={() => router.push('/')}
            className="w-full py-4 bg-nearmee-coral text-white text-sm font-bold rounded-xl"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="flex items-center gap-3 px-4 pt-12 pb-4 border-b border-nearmee-border sticky top-0 bg-white z-10">
        <button onClick={() => router.back()} className="p-1 -ml-1 text-nearmee-text-sec">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <div>
          <h1 className="text-base font-bold text-nearmee-text">Report a Problem</h1>
          <p className="text-xs text-nearmee-text-sec">Help us keep Nearmee safe</p>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 pb-32 space-y-6">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-amber-700">
            🚩 All reports are reviewed by our team within 24–48 hours. False reports may result in account suspension.
          </p>
        </div>

        {/* Reason */}
        <div>
          <p className="text-xs font-bold text-nearmee-text-sec uppercase tracking-widest mb-3">Select a Reason *</p>
          <div className="flex flex-col gap-2">
            {REASONS.map((r) => (
              <button
                key={r}
                onClick={() => { setReason(r); setError(''); }}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border text-sm font-semibold text-left transition-colors ${
                  reason === r
                    ? 'border-nearmee-coral bg-nearmee-light text-nearmee-coral'
                    : 'border-nearmee-border text-nearmee-text'
                }`}
              >
                <span className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                  reason === r ? 'border-nearmee-coral' : 'border-nearmee-border'
                }`}>
                  {reason === r && <span className="w-2 h-2 rounded-full bg-nearmee-coral block" />}
                </span>
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <p className="text-xs font-bold text-nearmee-text-sec uppercase tracking-widest mb-3">
            Additional Details <span className="font-normal normal-case">(optional)</span>
          </p>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Describe what happened in detail. Include dates, times, and any relevant information..."
            rows={5}
            className="w-full border border-nearmee-border rounded-xl px-4 py-3 text-sm text-nearmee-text placeholder:text-nearmee-border outline-none focus:ring-2 focus:ring-nearmee-coral resize-none"
          />
        </div>

        <div className="bg-nearmee-surface rounded-xl p-4">
          <p className="text-xs text-nearmee-text-sec leading-relaxed">
            Your report is confidential. The reported party will not know who filed this report. We take all reports seriously and act in accordance with Philippine law (RA 8792 — E-Commerce Act, RA 10173 — Data Privacy Act).
          </p>
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}
      </main>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-app bg-white border-t border-nearmee-border px-4 py-3 z-10">
        <button
          onClick={handleSubmit}
          disabled={loading || !reason}
          className={`w-full py-4 rounded-xl text-white text-sm font-bold transition-opacity ${
            loading || !reason ? 'bg-nearmee-coral opacity-40' : 'bg-nearmee-coral active:opacity-90'
          }`}
        >
          {loading ? 'Submitting…' : 'Submit Report'}
        </button>
      </div>
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-nearmee-coral border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ReportForm />
    </Suspense>
  );
}
