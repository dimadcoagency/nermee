'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [merchant, setMerchant] = useState(null);
  const [merchantMode, setMerchantMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  async function fetchProfile(userId) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    setProfile(data ?? null);
  }

  async function fetchMerchant(userId) {
    const { data } = await supabase
      .from('merchants')
      .select('*')
      .eq('user_id', userId)
      .single();
    setMerchant(data ?? null);
    // Auto-restore merchant mode if they were previously a merchant
    if (data) {
      const saved = localStorage.getItem('nearmee_merchant_mode');
      if (saved === 'true') setMerchantMode(true);
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        fetchMerchant(session.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        fetchMerchant(session.user.id);
      } else {
        setProfile(null);
        setMerchant(null);
        setMerchantMode(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  function toggleMerchantMode() {
    const next = !merchantMode;
    setMerchantMode(next);
    localStorage.setItem('nearmee_merchant_mode', String(next));
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setMerchant(null);
    setMerchantMode(false);
    localStorage.removeItem('nearmee_merchant_mode');
  }

  async function refreshProfile() {
    if (user) await fetchProfile(user.id);
  }

  async function refreshMerchant() {
    if (user) await fetchMerchant(user.id);
  }

  return (
    <AuthContext.Provider value={{
      user, profile, merchant, merchantMode,
      loading, logout, refreshProfile, refreshMerchant, toggleMerchantMode,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
