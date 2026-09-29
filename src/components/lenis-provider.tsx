'use client';

import Lenis from 'lenis';
import gsap from 'gsap';
import { createContext, useContext, useEffect, useRef } from 'react';

const LenisCtx = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisCtx);
}

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.8,
    });
    lenisRef.current = lenis;

    // Sync Lenis with GSAP ticker for perfect ScrollTrigger compat
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <LenisCtx.Provider value={lenisRef.current}>
      {children}
    </LenisCtx.Provider>
  );
}
