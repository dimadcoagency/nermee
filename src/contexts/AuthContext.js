'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // { phone, name, lastName, email, city }
  const [loading, setLoading] = useState(true);

  // Load persisted user from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('nermee_user');
      if (stored) setUser(JSON.parse(stored));
    } catch {}
    setLoading(false);
  }, []);

  function saveUser(userData) {
    setUser(userData);
    localStorage.setItem('nermee_user', JSON.stringify(userData));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('nermee_user');
    localStorage.removeItem('nermee_pending_phone');
  }

  return (
    <AuthContext.Provider value={{ user, loading, saveUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
