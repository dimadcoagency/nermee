import '../styles/globals.css';
import BottomNav from '@/components/layout/BottomNav';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata = {
  title: 'Nearmee — Services at your doorstep',
  description: 'Find trusted local service providers near you in Bayawan City and Dumaguete City, Negros Oriental.',
  keywords: ['services', 'plumbing', 'cleaning', 'meals', 'rides', 'Bayawan', 'Dumaguete', 'Philippines'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Nearmee',
  },
  openGraph: {
    title: 'Nearmee — Services at your doorstep',
    description: 'Find trusted local service providers near you in Bayawan City and Dumaguete City.',
    type: 'website',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#FF5757',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-nearmee-surface min-h-screen font-sans antialiased">
        <AuthProvider>
          <div className="mx-auto max-w-app min-h-screen bg-white relative">
            {children}
            <BottomNav />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
