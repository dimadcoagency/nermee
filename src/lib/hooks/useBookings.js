'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useBookings(userId) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    async function fetch() {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id, booking_date, booking_time, status, total_price, notes,
          created_at,
          service:services(id, title, category, price, price_unit),
          merchant:merchants(id, business_name)
        `)
        .eq('customer_id', userId)
        .order('booking_date', { ascending: false });

      if (!error) setBookings(data ?? []);
      setLoading(false);
    }
    fetch();
  }, [userId]);

  async function cancelBooking(bookingId) {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId);
    if (!error) setBookings((prev) =>
      prev.map((b) => b.id === bookingId ? { ...b, status: 'cancelled' } : b)
    );
    return !error;
  }

  return { bookings, loading, cancelBooking };
}

export async function createBooking({ customerId, merchantId, serviceId, date, time, notes, price }) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      customer_id: customerId,
      merchant_id: merchantId,
      service_id: serviceId,
      booking_date: date,
      booking_time: time,
      notes: notes || null,
      total_price: price,
      status: 'pending',
    })
    .select()
    .single();

  return { data, error };
}
