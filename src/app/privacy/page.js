'use client';

import { useRouter } from 'next/navigation';

const LAST_UPDATED = 'May 5, 2026';

const SECTIONS = [
  {
    title: '1. Overview',
    content: `Nearmee ("we", "us", "our") is operated by MADINNO (Making A Dynamic Innovation), based in Bayawan City, Negros Oriental, Philippines. This Privacy Policy explains how we collect, use, and protect your personal information in compliance with the Republic Act No. 10173 — Data Privacy Act of 2012 and its Implementing Rules and Regulations.`,
  },
  {
    title: '2. What Information We Collect',
    content: `We collect the following personal information:\n\n• Mobile phone number (required for registration via OTP)\n• Full name (provided during profile setup)\n• Email address (optional)\n• City/location (Bayawan City or Dumaguete City)\n• Booking history (services booked, dates, times)\n• For merchants: business name, service area, service listings\n\nWe do NOT collect:\n• Payment card or bank account details\n• Government-issued ID numbers\n• Sensitive personal information as defined under RA 10173`,
  },
  {
    title: '3. How We Use Your Information',
    content: `We use your information to:\n• Verify your identity via phone OTP\n• Display your profile to merchants when you make a booking\n• Send booking confirmations and updates\n• Allow merchants to manage their listings and bookings\n• Improve the App and user experience\n• Comply with legal obligations\n\nWe do NOT sell your personal information to third parties.`,
  },
  {
    title: '4. Information Sharing',
    content: `Your information is shared only as follows:\n\n• With merchants: your name and phone number are visible to merchants when you make a booking so they can contact you\n• With customers: merchant business name, service area, and ratings are publicly visible\n• With service providers: we use Supabase (database and authentication) and Twilio (SMS OTP delivery) to operate the App\n\nAll third-party service providers are contractually obligated to protect your data.`,
  },
  {
    title: '5. SMS and Communications',
    content: `By registering on Nearmee, you consent to receiving SMS OTP codes for login verification. Your phone number is used solely for authentication and booking communications. We do not send promotional SMS without your explicit consent.`,
  },
  {
    title: '6. Data Retention',
    content: `We retain your personal information for as long as your account is active. If you delete your account, your personal data will be removed from our systems within 30 days, except where retention is required by law or for legitimate business purposes (e.g., completed booking records for tax purposes).`,
  },
  {
    title: '7. Data Security',
    content: `We implement appropriate technical and organizational security measures to protect your personal information, including:\n• Encrypted data transmission (HTTPS/TLS)\n• Secure database storage via Supabase with Row Level Security\n• OTP-based authentication (no passwords stored)\n• Access controls limiting who can view your data`,
  },
  {
    title: '8. Your Rights Under RA 10173',
    content: `As a data subject under the Data Privacy Act of 2012, you have the right to:\n\n• Be informed about how your data is used\n• Access your personal data held by us\n• Correct inaccurate or incomplete data\n• Erase or block your personal data (right to be forgotten)\n• Object to processing of your personal data\n• Data portability\n• Lodge a complaint with the National Privacy Commission (NPC)\n\nTo exercise these rights, contact us at infodimad.co@gmail.com.`,
  },
  {
    title: '9. Cookies and Local Storage',
    content: `Nearmee uses browser local storage to maintain your login session and app preferences. No advertising cookies or third-party trackers are used.`,
  },
  {
    title: '10. Children\'s Privacy',
    content: `Nearmee is not intended for users under 18 years of age. We do not knowingly collect personal information from minors. If you believe a minor has registered, please contact us immediately.`,
  },
  {
    title: '11. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. We will notify you of significant changes through the App. Continued use of the App after changes constitutes acceptance of the updated policy.`,
  },
  {
    title: '12. Contact and Complaints',
    content: `For privacy concerns, requests, or complaints:\n\nData Protection Officer\nMADINNO (Making A Dynamic Innovation)\nBayawan City, Negros Oriental, Philippines\nEmail: infodimad.co@gmail.com\n\nYou may also file a complaint with the National Privacy Commission (NPC) at www.privacy.gov.ph.`,
  },
];

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="flex items-center gap-3 px-4 pt-12 pb-4 border-b border-nearmee-border sticky top-0 bg-white z-10">
        <button onClick={() => router.back()} className="p-1 -ml-1 text-nearmee-text-sec">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <div>
          <h1 className="text-base font-bold text-nearmee-text">Privacy Policy</h1>
          <p className="text-xs text-nearmee-text-sec">Last updated: {LAST_UPDATED}</p>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 pb-16 space-y-6">
        <div className="bg-nearmee-light rounded-xl p-4">
          <p className="text-xs font-semibold text-nearmee-coral">
            Nearmee complies with the Data Privacy Act of 2012 (RA 10173) of the Philippines.
          </p>
        </div>

        {SECTIONS.map(({ title, content }) => (
          <div key={title}>
            <h2 className="text-sm font-bold text-nearmee-text mb-2">{title}</h2>
            <p className="text-sm text-nearmee-text-sec leading-relaxed whitespace-pre-line">{content}</p>
          </div>
        ))}

        <div className="border-t border-nearmee-border pt-6">
          <p className="text-xs text-nearmee-text-sec text-center">
            © {new Date().getFullYear()} MADINNO. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
}
