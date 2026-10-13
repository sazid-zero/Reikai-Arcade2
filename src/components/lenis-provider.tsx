'use client';

import Lenis from 'lenis';
import gsap from 'gsap';
import { createContext, useContext, useEffect, useState, useRef } from 'react';

const LenisCtx = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisCtx);
}

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.8,
    });
    setLenisInstance(lenis);

    // Sync Lenis with GSAP ticker for perfect ScrollTrigger compat
    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      setLenisInstance(null);
    };
  }, []);

  return (
    <LenisCtx.Provider value={lenisInstance}>
      {children}
    </LenisCtx.Provider>
  );
}
