'use client';

import { useState, useEffect } from 'react';

export default function SplashScreen() {
  // Start hidden — set to true only after mount (client-only)
  const [show, setShow] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Show immediately on mount
    setShow(true);

    // Begin fade-out after 1.6s
    const t1 = setTimeout(() => setExiting(true), 1600);
    // Hide completely after fade (400ms)
    const t2 = setTimeout(() => setShow(false), 2000);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[999] bg-white flex items-center justify-center"
      style={{ animation: exiting ? 'splash-fadeout 0.4s ease-in forwards' : 'none' }}
    >
      {/* Crop whitespace from 2000x2000 PNG */}
      <div style={{ width: '260px', height: '88px', overflow: 'hidden', position: 'relative', animation: 'splash-bounce 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/logo.png"
          alt="NerMee"
          style={{
            position: 'absolute',
            width: '200%',
            height: '200%',
            top: '-22%',
            left: '-35%',
            objectFit: 'cover',
          }}
        />
      </div>
    </div>
  );
}
