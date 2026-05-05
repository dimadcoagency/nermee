'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const FAQS = [
  {
    category: 'Booking',
    items: [
      {
        q: 'How do I book a service?',
        a: 'Browse services on the home page, tap on a service you like, then tap "Book Now". Select your preferred date and time slot, add any notes for the provider, and confirm your booking.',
      },
      {
        q: 'Can I book a service without creating an account?',
        a: 'No. You need to register with your Philippine mobile number to book services. This protects both you and the merchant.',
      },
      {
        q: 'How far in advance can I book?',
        a: 'You can book up to 30 days in advance. Available time slots are set by the merchant.',
      },
      {
        q: 'Can I cancel a booking?',
        a: 'Yes. Go to the Bookings tab, find your booking, and tap "Cancel". Please cancel as early as possible to respect the merchant\'s time. Cancellations are free — Nearmee does not charge cancellation fees.',
      },
      {
        q: 'What happens after I book?',
        a: 'Your booking is sent to the merchant with "Pending" status. The merchant will Accept or Decline. Once accepted, your booking is "Confirmed". Check your Notifications for updates.',
      },
    ],
  },
  {
    category: 'Payment',
    items: [
      {
        q: 'How do I pay for a service?',
        a: 'All payments are made directly to the service provider — cash, GCash (person-to-person), or bank transfer. Nearmee does not process or collect any payments.',
      },
      {
        q: 'Is there a booking fee?',
        a: 'No. Nearmee does not charge customers any booking or service fees. The price shown in the app is what you pay the merchant directly.',
      },
      {
        q: 'What if the merchant charges more than the listed price?',
        a: 'Merchants are required to honor their listed prices. If a merchant overcharges you, please report it using the Report feature on the service listing.',
      },
    ],
  },
  {
    category: 'For Merchants',
    items: [
      {
        q: 'How do I become a merchant?',
        a: 'Go to Account → "Become a Merchant" and complete the 3-step registration. You\'ll need your business name, phone number, service category, and service area.',
      },
      {
        q: 'How many services can I post?',
        a: 'On the free Starter plan, you can post 1 active service listing. Upgrade to Pro (₱299/mo) for up to 5 listings, or Business (₱899/mo) for unlimited listings.',
      },
      {
        q: 'How do I accept or decline bookings?',
        a: 'Switch to Merchant Mode in your Account tab, then tap "Bookings". Pending bookings will appear — tap Accept or Decline. Accepted customers are notified immediately.',
      },
      {
        q: 'How do I edit or delete a service I posted?',
        a: 'In Merchant Mode, go to Services. Each listing has Edit, Pause, and Delete buttons. Pausing hides a service temporarily without deleting it.',
      },
    ],
  },
  {
    category: 'Account & Safety',
    items: [
      {
        q: 'How do I change my phone number?',
        a: 'Phone numbers cannot be changed after registration as they are used for identity verification. Contact us at infodimad.co@gmail.com if you need assistance.',
      },
      {
        q: 'How do I report a bad merchant or fake listing?',
        a: 'Tap the service listing and scroll to the bottom — tap "Report this listing". You can also go to Account → Support → Report a Problem.',
      },
      {
        q: 'Is my personal information safe?',
        a: 'Yes. Nearmee complies with the Data Privacy Act of 2012 (RA 10173). We only share your name and phone number with merchants when you make a booking. We never sell your data.',
      },
      {
        q: 'How do I delete my account?',
        a: 'Account deletion is currently handled manually. Email us at infodimad.co@gmail.com with your registered phone number and we\'ll process your request within 7 days.',
      },
    ],
  },
];

export default function HelpPage() {
  const router = useRouter();
  const [open, setOpen] = useState(null);

  function toggle(key) {
    setOpen((prev) => (prev === key ? null : key));
  }

  return (
    <div className="flex flex-col min-h-screen bg-nearmee-surface">
      <header className="flex items-center gap-3 px-4 pt-12 pb-4 border-b border-nearmee-border bg-white sticky top-0 z-10">
        <button onClick={() => router.back()} className="p-1 -ml-1 text-nearmee-text-sec">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <div>
          <h1 className="text-base font-bold text-nearmee-text">Help & FAQ</h1>
          <p className="text-xs text-nearmee-text-sec">How Nearmee works</p>
        </div>
      </header>

      <main className="flex-1 px-4 py-4 pb-16 space-y-5">
        {FAQS.map((section) => (
          <div key={section.category}>
            <p className="text-xs font-bold text-nearmee-text-sec uppercase tracking-widest mb-2 px-1">
              {section.category}
            </p>
            <div className="bg-white rounded-xl border border-nearmee-border overflow-hidden divide-y divide-nearmee-border">
              {section.items.map((item, i) => {
                const key = `${section.category}-${i}`;
                const isOpen = open === key;
                return (
                  <div key={key}>
                    <button
                      onClick={() => toggle(key)}
                      className="w-full flex items-start justify-between gap-3 px-4 py-3.5 text-left active:bg-nearmee-surface"
                    >
                      <p className="text-sm font-semibold text-nearmee-text leading-snug">{item.q}</p>
                      <svg
                        width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="#888" strokeWidth="2.5" strokeLinecap="round"
                        className={`shrink-0 mt-0.5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4">
                        <p className="text-sm text-nearmee-text-sec leading-relaxed">{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Contact */}
        <div className="bg-white rounded-xl border border-nearmee-border p-4">
          <p className="text-xs font-bold text-nearmee-text-sec uppercase tracking-widest mb-3">Still need help?</p>
          <p className="text-sm text-nearmee-text-sec mb-3">
            Can't find what you're looking for? Contact us directly.
          </p>
          <a
            href="mailto:infodimad.co@gmail.com"
            className="flex items-center gap-2 text-sm font-semibold text-nearmee-coral"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF5757" strokeWidth="2" strokeLinecap="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            infodimad.co@gmail.com
          </a>
        </div>
      </main>
    </div>
  );
}
