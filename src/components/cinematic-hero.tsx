'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';

interface CinematicHeroProps {
  onExplore?: () => void;
  cartCount?: number;
}

export function CinematicHero({ onExplore }: CinematicHeroProps) {
  const [mounted, setMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Trigger the slow cinematic reveal on mount
    const timer = setTimeout(() => setMounted(true), 100);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const word1 = 'REIKAI'.split('');
  const word2 = 'ARCADE'.split('');

  // Subtle scroll fade only (no cursor/mouse movement)
  const textOpacity = Math.max(0, 1 - scrollY / 550);
  const textBlur = Math.min(8, scrollY * 0.02);

  const scrollToCatalog = () => {
    if (onExplore) {
      onExplore();
    } else {
      const target = document.getElementById('browse') || document.getElementById('categories');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      ref={containerRef}
      className="cinematic-hero-section relative w-full flex flex-col justify-between items-center overflow-hidden bg-black select-none"
      id="discover"
    >
      {/* ── 1. BACKGROUND VIDEO LAYER ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/*
          poster= shows a still image instantly while the video loads.
          preload="metadata" on mobile saves bandwidth (only fetches first few KB).
          preload="auto" on desktop starts buffering for smooth instant play.
          WebM source first — much smaller, natively supported on Chrome/Android.
        */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/videos/hero-poster.jpg"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ willChange: 'transform' }}
        >
          <source src="/videos/hero.webm" type="video/webm" />
          <source src="/videos/hero-opt.mp4" type="video/mp4" />
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>

        {/* Pure darkened overlay */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />

        {/* Soft bottom vignette */}
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />
      </div>

      {/* ── 2. CINEMATIC HERO CENTERPIECE (Perfect Vertical Centering Inside Viewport) ── */}
      <div
        className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-10 flex-1 flex flex-col items-center justify-center text-center transition-all duration-300 py-4"
        style={{
          opacity: textOpacity,
          filter: textBlur > 0.2 ? `blur(${textBlur}px)` : 'none',
        }}
      >
        {/* Letter-by-Letter Cinematic Title: "REIKAI ARCADE" */}
        <h1
          className="font-['Cinzel',serif] text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-[0.14em] sm:tracking-[0.19em] uppercase text-white leading-tight mb-4 sm:mb-6 flex flex-wrap justify-center gap-x-4 sm:gap-x-7"
          style={{
            textShadow: '0 20px 45px rgba(0, 0, 0, 0.95), 0 4px 14px rgba(0,0,0,0.85)',
          }}
          aria-label="REIKAI ARCADE"
        >
          {/* Word 1: REIKAI */}
          <span className="inline-flex overflow-hidden">
            {word1.map((char, i) => (
              <span
                key={`w1-${i}`}
                className={`inline-block transition-all duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  mounted
                    ? 'opacity-100 translate-y-0 scale-100 blur-0'
                    : 'opacity-0 translate-y-10 scale-90 blur-md'
                }`}
                style={{
                  transitionDelay: `${300 + i * 85}ms`,
                  background: 'linear-gradient(180deg, #ffffff 0%, #ffffff 50%, rgba(255,255,255,0.7) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {char}
              </span>
            ))}
          </span>

          {/* Word 2: ARCADE */}
          <span className="inline-flex overflow-hidden">
            {word2.map((char, i) => (
              <span
                key={`w2-${i}`}
                className={`inline-block transition-all duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  mounted
                    ? 'opacity-100 translate-y-0 scale-100 blur-0'
                    : 'opacity-0 translate-y-10 scale-90 blur-md'
                }`}
                style={{
                  transitionDelay: `${850 + i * 85}ms`,
                  background: 'linear-gradient(180deg, #ffffff 0%, #ffffff 50%, rgba(255,255,255,0.65) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {char}
              </span>
            ))}
          </span>
        </h1>

        {/* Editorial Subtitle / Manifesto Description */}
        <p
          className={`max-w-xl font-['Space_Grotesk',sans-serif] text-xs sm:text-sm md:text-base text-zinc-300/90 font-light leading-relaxed tracking-wide mb-6 sm:mb-8 px-4 transition-all duration-[1400ms] ease-out ${
            mounted
              ? 'opacity-100 translate-y-0 blur-0'
              : 'opacity-0 translate-y-5 blur-sm'
          }`}
          style={{ transitionDelay: '1400ms' }}
        >
          Curated PlayStation hardware, verified digital vouchers, and tournament artefacts.
          Engineered for those who demand absolute distinction.
        </p>

        {/* Essential Premium Action Buttons */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto px-4 transition-all duration-[1400ms] ease-out ${
            mounted
              ? 'opacity-100 translate-y-0 blur-0'
              : 'opacity-0 translate-y-5 blur-sm'
          }`}
          style={{ transitionDelay: '1750ms' }}
        >
          {/* Primary Action Button */}
          <button
            type="button"
            onClick={scrollToCatalog}
            className="group relative inline-flex items-center justify-center gap-3 px-8 sm:px-9 py-3 sm:py-3.5 rounded-full bg-white text-black font-['Space_Grotesk',sans-serif] font-bold text-xs uppercase tracking-[0.22em] shadow-[0_8px_30px_rgba(255,255,255,0.18)] hover:bg-zinc-200 hover:shadow-[0_12px_40px_rgba(255,255,255,0.28)] transition-all duration-300 active:scale-95 cursor-pointer w-full sm:w-auto"
            data-testid="hero-primary-cta"
          >
            <span>ENTER VAULT</span>
            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>

          {/* Secondary Action Button */}
          <Link
            href="/games"
            className="inline-flex items-center justify-center gap-2.5 px-8 sm:px-9 py-3 sm:py-3.5 rounded-full border border-white/20 bg-white/[0.04] backdrop-blur-xl text-white font-['Space_Grotesk',sans-serif] font-medium text-xs uppercase tracking-[0.22em] hover:bg-white/[0.09] hover:border-white/40 transition-all duration-300 active:scale-95 cursor-pointer w-full sm:w-auto"
            data-testid="hero-secondary-cta"
          >
            <span>BROWSE CATALOG</span>
          </Link>
        </div>
      </div>

      {/* ── 3. BOTTOM AMBIENT STATUS BAR & SCROLL PROMPT ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 pb-4 sm:pb-6 flex items-center justify-between text-[10px] font-['DM_Mono'] tracking-[0.25em] uppercase text-zinc-300/80 pointer-events-none">
        {/* Left Specification Index */}
        <div className="hidden sm:block">
          <span>01 // STOREFRONT INDEX</span>
        </div>

        {/* Center Scroll Prompt */}
        <button
          type="button"
          onClick={scrollToCatalog}
          className="pointer-events-auto mx-auto sm:mx-0 flex flex-col items-center gap-1 text-zinc-300/80 hover:text-white transition-colors cursor-pointer group"
          aria-label="Scroll to explore products"
        >
          <span className="tracking-[0.3em]">EXPLORE</span>
          <ChevronDown
            size={13}
            className="animate-bounce transition-transform duration-300 group-hover:translate-y-0.5"
          />
        </button>

        {/* Right Status Indicator */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>AUTHENTICATED // DIRECT DISPATCH</span>
        </div>
      </div>
    </section>
  );
}
