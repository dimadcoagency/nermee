import { createClient } from '@/lib/supabase/server';

export async function generateMetadata({ params }) {
  const supabase = await createClient();
  const { data: merchant } = await supabase
    .from('merchants')
    .select('business_name, bio, service_area, category, rating_avg, rating_count')
    .eq('id', params.id)
    .single();

  if (!merchant) return { title: 'Merchant — Nearmee' };

  const title = `${merchant.business_name} — Nearmee`;
  const description = merchant.bio
    ? `${merchant.bio} · ${merchant.service_area}`
    : `Book services from ${merchant.business_name} in ${merchant.service_area} on Nearmee.`;

  return {
    title,
    description,
    openGraph: {
      title: merchant.business_name,
      description,
      url: `https://nearmee.app/m/${params.id}`,
      siteName: 'Nearmee',
      type: 'profile',
      images: [{ url: 'https://nearmee.app/icons/icon-512.png', width: 512, height: 512 }],
    },
    twitter: { card: 'summary', title, description },
  };
}

export default function MerchantProfileLayout({ children }) {
  return children;
}
