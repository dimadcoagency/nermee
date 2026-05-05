'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useMerchantServices } from '@/lib/hooks/useMerchant';
import { CATEGORIES } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';

function getCategoryIcon(id) {
  return CATEGORIES.find((c) => c.id === id)?.icon ?? '🛠️';
}

export default function MerchantServicesPage() {
  const router = useRouter();
  const { merchant } = useAuth();
  const { services, loading, deleteService, togglePause } = useMerchantServices(merchant?.id);

  return (
    <div className="flex flex-col min-h-screen bg-nearmee-surface">
      <header className="bg-white border-b border-nearmee-border px-4 pt-12 pb-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-nearmee-text">My Services</h1>
          <button
            onClick={() => router.push('/merchant/services/new')}
            className="flex items-center gap-1.5 bg-nearmee-coral text-white text-xs font-bold px-3 py-2 rounded-xl active:opacity-90"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add Service
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 py-4 pb-28">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-nearmee-coral border-t-transparent rounded-full animate-spin" />
          </div>
        ) : services.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-5xl mb-4">📋</span>
            <p className="text-sm font-semibold text-nearmee-text">No services yet</p>
            <p className="text-xs text-nearmee-text-sec mt-1 mb-5">Post your first service to start getting bookings.</p>
            <button
              onClick={() => router.push('/merchant/services/new')}
              className="px-6 py-3 bg-nearmee-coral text-white text-sm font-bold rounded-xl"
            >
              Post a Service
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-xl border border-nearmee-border p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">{getCategoryIcon(service.category)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-nearmee-text truncate">{service.title}</p>
                    <p className="text-xs text-nearmee-text-sec mt-0.5">
                      {formatPrice(service.price)} {service.price_unit}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    service.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-nearmee-surface text-nearmee-text-sec'
                  }`}>
                    {service.status === 'active' ? 'Active' : 'Paused'}
                  </span>
                </div>

                <div className="flex gap-2 mt-3 pt-3 border-t border-nearmee-border">
                  <button
                    onClick={() => router.push(`/merchant/services/edit/${service.id}`)}
                    className="flex-1 py-2 rounded-lg bg-nearmee-coral text-white text-xs font-semibold active:opacity-90"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => togglePause(service.id, service.status)}
                    className="flex-1 py-2 rounded-lg border border-nearmee-border text-nearmee-text-sec text-xs font-semibold active:bg-nearmee-surface"
                  >
                    {service.status === 'active' ? 'Pause' : 'Activate'}
                  </button>
                  <button
                    onClick={() => deleteService(service.id)}
                    className="flex-1 py-2 rounded-lg border border-red-200 text-red-500 text-xs font-semibold active:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
