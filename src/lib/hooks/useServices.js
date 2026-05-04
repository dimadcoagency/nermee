'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useServices({ city, category } = {}) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      let query = supabase
        .from('services')
        .select(`
          id, title, description, category, price, price_unit,
          is_boosted, city, status,
          merchant:merchants(
            id, business_name, phone, service_area,
            tier, is_verified, rating_avg, rating_count,
            profile:profiles(full_name)
          )
        `)
        .eq('status', 'active')
        .order('is_boosted', { ascending: false });

      if (city) query = query.ilike('city', `%${city}%`);
      if (category && category !== 'all') query = query.eq('category', category);

      const { data, error } = await query;
      if (!error) setServices(data ?? []);
      setLoading(false);
    }
    fetch();
  }, [city, category]);

  return { services, loading };
}

export function useService(id) {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!id) return;
    async function fetch() {
      const { data, error } = await supabase
        .from('services')
        .select(`
          id, title, description, category, price, price_unit,
          is_boosted, city, status,
          merchant:merchants(
            id, business_name, phone, service_area, bio,
            tier, is_verified, rating_avg, rating_count,
            profile:profiles(full_name)
          ),
          availability(day_of_week, time_slot, is_available)
        `)
        .eq('id', id)
        .single();

      if (!error) setService(data);
      setLoading(false);
    }
    fetch();
  }, [id]);

  return { service, loading };
}

export function useSearch(query, category) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (!query && (!category || category === 'all')) {
      setResults([]);
      return;
    }
    async function fetch() {
      setLoading(true);
      let q = supabase
        .from('services')
        .select(`
          id, title, description, category, price, price_unit, is_boosted, city,
          merchant:merchants(id, business_name, tier, is_verified, rating_avg, rating_count)
        `)
        .eq('status', 'active')
        .order('is_boosted', { ascending: false });

      if (query) q = q.or(`title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`);
      if (category && category !== 'all') q = q.eq('category', category);

      const { data, error } = await q;
      if (!error) setResults(data ?? []);
      setLoading(false);
    }
    fetch();
  }, [query, category]);

  return { results, loading };
}
