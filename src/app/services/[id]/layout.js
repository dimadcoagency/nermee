import { createClient } from '@/lib/supabase/server';

export async function generateMetadata({ params }) {
  const supabase = await createClient();
  const { data: service } = await supabase
    .from('services')
    .select('title, description, price, price_unit, city, merchant:merchants(business_name)')
    .eq('id', params.id)
    .single();

  if (!service) return { title: 'Service — Nearmee' };

  const title = `${service.title} | ${service.merchant?.business_name}`;
  const description = `₱${service.price} ${service.price_unit} · ${service.city} · Book now on Nearmee — Services at your doorstep.`;

  return {
    title: `${service.title} — Nearmee`,
    description,
    openGraph: {
      title,
      description,
      url: `https://nearmee.app/services/${params.id}`,
      siteName: 'Nearmee',
      type: 'website',
      images: [{ url: 'https://nearmee.app/icons/icon-512.png', width: 512, height: 512 }],
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export default function ServiceLayout({ children }) {
  return children;
}
