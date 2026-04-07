'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function SplashScreen() {
  // 'visible' → 'exiting' → 'gone'
  const [phase, setPhase] = useState('visible');

  useEffect(() => {
    // Only show splash once per session
    if (sessionStorage.getItem('nermee_splashed')) {
      setPhase('gone');
      return;
    }

    // Hold for 1.5s then start fade-out
    const exitTimer = setTimeout(() => setPhase('exiting'), 1500);
    return () => clearTimeout(exitTimer);
  }, []);

  // When fade-out animation ends, remove from DOM and mark session
  function handleAnimationEnd() {
    if (phase === 'exiting') {
      sessionStorage.setItem('nermee_splashed', '1');
      setPhase('gone');
    }
  }

  if (phase === 'gone') return null;

  return (
    <div
      onAnimationEnd={handleAnimationEnd}
      className={`fixed inset-0 z-50 bg-white flex items-center justify-center ${
        phase === 'exiting' ? 'splash-exit' : ''
      }`}
    >
      <div className="splash-logo flex items-center justify-center px-12">
        <Image
          src="/images/logo.png"
          alt="NerMee"
          width={220}
          height={80}
          priority
          style={{ objectFit: 'contain' }}
        />
      </div>
    </div>
  );
}
