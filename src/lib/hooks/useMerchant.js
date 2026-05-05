'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useMerchantServices(merchantId) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!merchantId) { setLoading(false); return; }
    async function fetch() {
      const { data } = await supabase
        .from('services')
        .select('id, title, category, price, price_unit, status, is_boosted')
        .eq('merchant_id', merchantId)
        .neq('status', 'deleted')
        .order('created_at', { ascending: false });
      setServices(data ?? []);
      setLoading(false);
    }
    fetch();
  }, [merchantId]);

  async function deleteService(serviceId) {
    const { error } = await supabase
      .from('services')
      .update({ status: 'deleted' })
      .eq('id', serviceId);
    if (!error) {
      setServices((prev) => prev.filter((s) => s.id !== serviceId));
    }
    return !error;
  }

  async function togglePause(serviceId, currentStatus) {
    const next = currentStatus === 'active' ? 'paused' : 'active';
    const { error } = await supabase
      .from('services')
      .update({ status: next })
      .eq('id', serviceId);
    if (!error) {
      setServices((prev) => prev.map((s) => s.id === serviceId ? { ...s, status: next } : s));
    }
    return !error;
  }

  return { services, loading, deleteService, togglePause };
}

export function useMerchantBookings(merchantId) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!merchantId) { setLoading(false); return; }
    async function fetch() {
      const { data } = await supabase
        .from('bookings')
        .select(`
          id, booking_date, booking_time, status, total_price, notes, created_at,
          service:services(id, title, category),
          customer:profiles(id, full_name, phone)
        `)
        .eq('merchant_id', merchantId)
        .order('created_at', { ascending: false });
      setBookings(data ?? []);
      setLoading(false);
    }
    fetch();
  }, [merchantId]);

  async function updateStatus(bookingId, status) {
    await supabase.from('bookings').update({ status }).eq('id', bookingId);
    setBookings((prev) => prev.map((b) => b.id === bookingId ? { ...b, status } : b));
  }

  return { bookings, loading, updateStatus };
}

export function useMerchantStats(merchantId) {
  const [stats, setStats] = useState({ pending: 0, confirmed: 0, completed: 0, totalEarnings: 0, activeServices: 0 });
  const supabase = createClient();

  useEffect(() => {
    if (!merchantId) return;
    async function fetch() {
      const [bookingsRes, servicesRes] = await Promise.all([
        supabase.from('bookings').select('status, total_price').eq('merchant_id', merchantId),
        supabase.from('services').select('status').eq('merchant_id', merchantId).neq('status', 'deleted'),
      ]);

      const bookings = bookingsRes.data ?? [];
      const services = servicesRes.data ?? [];

      setStats({
        pending: bookings.filter((b) => b.status === 'pending').length,
        confirmed: bookings.filter((b) => b.status === 'confirmed').length,
        completed: bookings.filter((b) => b.status === 'completed').length,
        totalEarnings: bookings
          .filter((b) => b.status === 'completed')
          .reduce((sum, b) => sum + Number(b.total_price ?? 0), 0),
        activeServices: services.filter((s) => s.status === 'active').length,
      });
    }
    fetch();
  }, [merchantId]);

  return stats;
}

export async function registerMerchant({ userId, businessName, phone, category, serviceArea, bio }) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('merchants')
    .insert({
      user_id: userId,
      business_name: businessName,
      phone,
      category,
      service_area: serviceArea,
      bio: bio || null,
      tier: 'free',
      is_active: true,
    })
    .select()
    .single();
  return { data, error };
}

export async function createService({ merchantId, city, title, description, category, price, priceUnit, availability }) {
  const supabase = createClient();

  const { data: service, error } = await supabase
    .from('services')
    .insert({
      merchant_id: merchantId,
      title,
      description: description || null,
      category,
      price: Number(price),
      price_unit: priceUnit,
      status: 'active',
      city: city || 'Bayawan City',
    })
    .select()
    .single();

  if (error || !service) return { error };

  // Insert availability slots
  if (availability.days.length > 0 && availability.times.length > 0) {
    const slots = [];
    availability.days.forEach((day) => {
      availability.times.forEach((time) => {
        slots.push({ service_id: service.id, day_of_week: day, time_slot: time, is_available: true });
      });
    });
    await supabase.from('availability').insert(slots);
  }

  return { data: service, error: null };
}
