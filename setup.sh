#!/bin/bash

# ============================================
# NERMEE PROJECT SCAFFOLDER
# Run this AFTER `npx create-next-app@latest nermee`
# Usage: cd nermee && bash setup.sh
# ============================================

echo "🏘️ Setting up Nermee project structure..."

# ── Create directory structure ──
mkdir -p src/app/auth/login
mkdir -p src/app/auth/register
mkdir -p src/app/auth/callback
mkdir -p src/app/search
mkdir -p src/app/services/\[id\]
mkdir -p src/app/booking/\[serviceId\]
mkdir -p src/app/booking/confirmed
mkdir -p src/app/bookings
mkdir -p src/app/merchant/register
mkdir -p src/app/merchant/dashboard
mkdir -p src/app/merchant/services/new
mkdir -p src/app/merchant/services/\[id\]/edit
mkdir -p src/app/merchant/bookings
mkdir -p src/app/merchant/boost
mkdir -p src/app/profile/edit
mkdir -p src/app/api/bookings
mkdir -p src/app/api/services

mkdir -p src/components/ui
mkdir -p src/components/layout
mkdir -p src/components/services
mkdir -p src/components/booking
mkdir -p src/components/merchant

mkdir -p src/lib/supabase
mkdir -p src/lib/hooks
mkdir -p src/contexts
mkdir -p src/styles

mkdir -p supabase/migrations

mkdir -p public/icons
mkdir -p public/images

echo "📁 Directory structure created."

# ── Create placeholder files ──

# .env.example
cat > .env.example << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
EOF

# .gitignore additions
cat >> .gitignore << 'EOF'

# Environment
.env.local
.env.*.local

# Supabase
supabase/.temp
EOF

# PWA manifest
cat > public/manifest.json << 'EOF'
{
  "name": "Nermee",
  "short_name": "Nermee",
  "description": "Services at your doorstep",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FFFFFF",
  "theme_color": "#00B14F",
  "orientation": "portrait",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
EOF

# Constants file
cat > src/lib/constants.js << 'EOF'
export const APP_NAME = 'Nermee';
export const APP_TAGLINE = 'Services at your doorstep';

export const CATEGORIES = [
  { id: 'ride', label: 'Rides', icon: '🚗' },
  { id: 'plumbing', label: 'Plumbing', icon: '🔧' },
  { id: 'meals', label: 'Meals', icon: '🍱' },
  { id: 'cleaning', label: 'Cleaning', icon: '🧹' },
  { id: 'electrical', label: 'Electrical', icon: '⚡' },
  { id: 'laundry', label: 'Laundry', icon: '👕' },
  { id: 'tutoring', label: 'Tutoring', icon: '📚' },
  { id: 'errands', label: 'Errands', icon: '📦' },
];

export const CITIES = [
  { id: 'bayawan', label: 'Bayawan City', region: 'Negros Oriental' },
  { id: 'dumaguete', label: 'Dumaguete City', region: 'Negros Oriental' },
];

export const TIERS = {
  free:     { name: 'Starter',  price: 0,   listings: 1,  bookings: 10 },
  pro:      { name: 'Pro',      price: 299, listings: 5,  bookings: -1 },
  business: { name: 'Business', price: 899, listings: -1, bookings: -1 },
};

export const BOOST_PACKAGES = [
  { id: '1d', label: '1 Day',  price: 29,  days: 1 },
  { id: '3d', label: '3 Days', price: 79,  days: 3 },
  { id: '7d', label: '7 Days', price: 149, days: 7 },
];

export const PRICE_UNITS = [
  'per visit', 'per hour', 'per km', 'per kilo',
  'per meal', 'per session', 'per task',
];

export const BOOKING_STATUSES = {
  pending:     { label: 'Pending',     color: 'text-amber-500',  bg: 'bg-amber-50' },
  confirmed:   { label: 'Confirmed',   color: 'text-green-600',  bg: 'bg-green-50' },
  in_progress: { label: 'In Progress', color: 'text-blue-600',   bg: 'bg-blue-50' },
  completed:   { label: 'Completed',   color: 'text-gray-500',   bg: 'bg-gray-100' },
  cancelled:   { label: 'Cancelled',   color: 'text-red-500',    bg: 'bg-red-50' },
  no_show:     { label: 'No Show',     color: 'text-red-400',    bg: 'bg-red-50' },
};
EOF

# Utils file
cat > src/lib/utils.js << 'EOF'
export function formatPrice(amount) {
  return `₱${Number(amount).toLocaleString()}`;
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-PH', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function getDatesAhead(days = 7) {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      date: d.toISOString().split('T')[0],
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : formatDate(d),
      dayOfWeek: d.getDay(),
    };
  });
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
EOF

# Supabase client (browser)
cat > src/lib/supabase/client.js << 'EOF'
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
EOF

# Supabase client (server)
cat > src/lib/supabase/server.js << 'EOF'
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch { /* Server component — ignore */ }
        },
      },
    }
  );
}
EOF

# Globals CSS
cat > src/styles/globals.css << 'EOF'
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  -webkit-tap-highlight-color: transparent;
}

body {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: #F5F5F5;
}

/* Hide scrollbars for horizontal scroll areas */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* PWA safe area padding */
.safe-bottom {
  padding-bottom: env(safe-area-inset-bottom, 16px);
}
EOF

echo "✅ All files created."
echo ""
echo "📋 Next steps:"
echo "  1. Run: npm install @supabase/supabase-js @supabase/ssr"
echo "  2. Copy your Supabase URL + anon key to .env.local"
echo "  3. Run the SQL migration in Supabase dashboard"
echo "  4. Update tailwind.config.js with Nermee brand tokens"
echo "  5. Start building with: npm run dev"
echo ""
echo "🏘️ Nermee — Services at your doorstep"
