'use client';

import { useRouter } from 'next/navigation';

const LAST_UPDATED = 'May 5, 2026';
const COMPANY = 'MADINNO (Making A Dynamic Innovation)';

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing or using Nearmee ("the App"), you agree to be bound by these Terms of Service. If you do not agree, do not use the App. These terms apply to all users including customers and merchants.`,
  },
  {
    title: '2. What Nearmee Is',
    content: `Nearmee is a local services marketplace that connects customers with nearby service providers (merchants) in Bayawan City and Dumaguete City, Negros Oriental, Philippines. Nearmee is a platform only — we do not employ merchants, guarantee service quality, or process payments between parties.`,
  },
  {
    title: '3. User Accounts',
    content: `To use Nearmee, you must register using a valid Philippine mobile number. You are responsible for all activity under your account. You must be at least 18 years old to register. One account per person is allowed. You may not share your account or OTP codes with others.`,
  },
  {
    title: '4. Customer Responsibilities',
    content: `As a customer, you agree to:\n• Provide accurate booking information\n• Pay merchants directly (cash, GCash, or bank transfer) at the agreed price\n• Treat merchants with respect\n• Not make false or fraudulent bookings\n• Cancel bookings promptly if you cannot attend\n• Leave honest reviews based on actual experience`,
  },
  {
    title: '5. Merchant Responsibilities',
    content: `As a merchant, you agree to:\n• Provide accurate business information and service listings\n• Fulfill bookings you accept in a timely and professional manner\n• Maintain the quality and safety of your services\n• Not misrepresent your qualifications, licenses, or experience\n• Respond to booking requests promptly\n• Comply with all applicable Philippine laws and regulations`,
  },
  {
    title: '6. Payments',
    content: `All payments are made directly between customers and merchants. Nearmee does not process, hold, or guarantee any payments. Nearmee is not responsible for payment disputes between customers and merchants. Price displayed in the App is as listed by the merchant and may be subject to change.`,
  },
  {
    title: '7. Prohibited Conduct',
    content: `You must not:\n• Use the App for any illegal purpose\n• Post false, misleading, or fraudulent listings\n• Harass, threaten, or abuse other users\n• Attempt to circumvent the platform by transacting outside the App in bad faith\n• Create fake reviews or manipulate ratings\n• Scrape or copy App content without permission\n• Attempt to hack, disrupt, or compromise the App's security`,
  },
  {
    title: '8. Listings and Content',
    content: `Merchants are solely responsible for the accuracy of their service listings. Nearmee reserves the right to remove listings that violate these terms, are misleading, or are reported by users. We may suspend or terminate accounts that repeatedly violate these terms.`,
  },
  {
    title: '9. Limitation of Liability',
    content: `Nearmee and ${COMPANY} shall not be liable for:\n• The quality, safety, or legality of services listed\n• Disputes between customers and merchants\n• Loss or damage arising from use of the App\n• Service interruptions or technical issues\n\nYour use of the App is at your own risk. Nearmee is provided "as is" without warranty of any kind.`,
  },
  {
    title: '10. Termination',
    content: `We may suspend or terminate your account at any time for violation of these terms, fraudulent activity, or any conduct we determine is harmful to the platform or other users. You may delete your account at any time by contacting us.`,
  },
  {
    title: '11. Changes to Terms',
    content: `We may update these Terms of Service at any time. Continued use of the App after changes constitutes acceptance of the updated terms. We will notify users of significant changes through the App.`,
  },
  {
    title: '12. Governing Law',
    content: `These Terms are governed by the laws of the Republic of the Philippines. Any disputes shall be subject to the jurisdiction of the courts of Negros Oriental, Philippines.`,
  },
  {
    title: '13. Contact Us',
    content: `For questions about these Terms, contact us at:\n\nMADINNO (Making A Dynamic Innovation)\nBayawan City, Negros Oriental, Philippines\nEmail: infodimad.co@gmail.com`,
  },
];

export default function TermsPage() {
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
          <h1 className="text-base font-bold text-nearmee-text">Terms of Service</h1>
          <p className="text-xs text-nearmee-text-sec">Last updated: {LAST_UPDATED}</p>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 pb-16 space-y-6">
        <div className="bg-nearmee-light rounded-xl p-4">
          <p className="text-xs font-semibold text-nearmee-coral">Please read these terms carefully before using Nearmee.</p>
        </div>

        {SECTIONS.map(({ title, content }) => (
          <div key={title}>
            <h2 className="text-sm font-bold text-nearmee-text mb-2">{title}</h2>
            <p className="text-sm text-nearmee-text-sec leading-relaxed whitespace-pre-line">{content}</p>
          </div>
        ))}

        <div className="border-t border-nearmee-border pt-6">
          <p className="text-xs text-nearmee-text-sec text-center">
            © {new Date().getFullYear()} MADINNO. All rights reserved.{'\n'}Nearmee is a product of MADINNO.
          </p>
        </div>
      </main>
    </div>
  );
}
