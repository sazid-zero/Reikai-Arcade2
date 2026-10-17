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
    // Only smooth mouse wheels; keep mobile touch 100% native 120Hz momentum scrolling
    const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !isTouch,
      syncTouch: false,
      touchMultiplier: 1,
    });
    setLenisInstance(lenis);

    // Sync Lenis with GSAP ticker with lag smoothing to prevent stutter
    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(500, 33);

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
