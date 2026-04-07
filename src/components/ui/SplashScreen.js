'use client';

import { useState, useEffect } from 'react';

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Show every time on first mount (PWA launch)
    // Start exit after 1.6s
    const exitStart = setTimeout(() => setExiting(true), 1600);
    // Remove from DOM after exit animation (400ms)
    const remove = setTimeout(() => setVisible(false), 2000);
    return () => {
      clearTimeout(exitStart);
      clearTimeout(remove);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[999] bg-white flex items-center justify-center"
      style={{
        animation: exiting ? 'splash-fadeout 0.4s ease-in forwards' : 'none',
      }}
    >
      <img
        src="/images/logo.png"
        alt="NerMee"
        className="w-48 h-auto object-contain"
        style={{
          animation: 'splash-bounce 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        }}
      />
    </div>
  );
}
