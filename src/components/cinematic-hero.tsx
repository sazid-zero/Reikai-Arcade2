'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';

interface CinematicHeroProps {
  onExplore?: () => void;
  cartCount?: number;
}

const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

// Smoothstep cubic Hermite interpolation for butter-smooth fluid easing curves
const smoothProgress = (y: number, start: number, end: number) => {
  const p = clamp((y - start) / (end - start), 0, 1);
  return p * p * (3 - 2 * p);
};

export function CinematicHero({ onExplore }: CinematicHeroProps) {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const btn1Ref = useRef<HTMLButtonElement>(null);
  const btn2Ref = useRef<HTMLAnchorElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial slow cinematic reveal on mount
    const timer = setTimeout(() => setMounted(true), 100);

    let rafId: number | null = null;

    // Lock hero height on phone to prevent address bar collapse/expand from causing layout jumps
    if (typeof window !== 'undefined' && window.innerWidth <= 768 && containerRef.current) {
      containerRef.current.style.height = `${window.innerHeight}px`;
    }

    const onScroll = () => {
      const isSmallScreen = typeof window !== 'undefined' && window.innerWidth <= 768;
      const supportsTimeline = typeof CSS !== 'undefined' && CSS.supports && CSS.supports('animation-timeline', 'scroll()');

      // On Android Chrome with 120Hz display: CSS Scroll-Driven Animations run directly
      // on the GPU compositor thread at 120 FPS native with zero JS main-thread lag.
      if (isSmallScreen && supportsTimeline) {
        return;
      }

      if (rafId !== null) return;

      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (!contentRef.current) return;
        const y = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;

        if (isSmallScreen) {
          // JS Fallback for browsers without native animation-timeline support (e.g. older iOS)
          if (bottomBarRef.current) {
            const p0 = smoothProgress(y, 0, 45);
            bottomBarRef.current.style.opacity = String(Math.max(0, 1 - p0));
            bottomBarRef.current.style.transform = `translate3d(0, ${p0 * 12}px, 0)`;
            bottomBarRef.current.style.pointerEvents = p0 >= 0.95 ? 'none' : 'auto';
          }

          if (titleRef.current) {
            const p1 = smoothProgress(y, 0, 90);
            titleRef.current.style.opacity = String(Math.max(0, 1 - p1));
            titleRef.current.style.transform = `translate3d(0, -${p1 * 26}px, 0)`;
            titleRef.current.style.pointerEvents = p1 >= 0.95 ? 'none' : 'auto';
          }

          if (descRef.current) {
            const p2 = smoothProgress(y, 45, 150);
            descRef.current.style.opacity = String(Math.max(0, 1 - p2));
            descRef.current.style.transform = `translate3d(0, -${p2 * 22}px, 0)`;
            descRef.current.style.pointerEvents = p2 >= 0.95 ? 'none' : 'auto';
          }

          if (btn1Ref.current) {
            const p3 = smoothProgress(y, 100, 210);
            btn1Ref.current.style.opacity = String(Math.max(0, 1 - p3));
            btn1Ref.current.style.transform = `translate3d(0, -${p3 * 18}px, 0)`;
            btn1Ref.current.style.pointerEvents = p3 >= 0.95 ? 'none' : 'auto';
          }

          if (btn2Ref.current) {
            const p4 = smoothProgress(y, 160, 270);
            btn2Ref.current.style.opacity = String(Math.max(0, 1 - p4));
            btn2Ref.current.style.transform = `translate3d(0, -${p4 * 18}px, 0)`;
            btn2Ref.current.style.pointerEvents = p4 >= 0.95 ? 'none' : 'auto';
          }

          contentRef.current.style.opacity = '1';
          contentRef.current.style.transform = 'none';
          contentRef.current.style.pointerEvents = y > 270 ? 'none' : 'auto';
        } else {
          // ── DESKTOP: RETAIN EXISTING SUPERB PARALLAX (100% UNTOUCHED) ──
          if (titleRef.current) {
            titleRef.current.style.opacity = '';
            titleRef.current.style.transform = '';
            titleRef.current.style.pointerEvents = '';
          }
          if (descRef.current) {
            descRef.current.style.opacity = '';
            descRef.current.style.transform = '';
            descRef.current.style.pointerEvents = '';
          }
          if (btn1Ref.current) {
            btn1Ref.current.style.opacity = '';
            btn1Ref.current.style.transform = '';
            btn1Ref.current.style.pointerEvents = '';
          }
          if (btn2Ref.current) {
            btn2Ref.current.style.opacity = '';
            btn2Ref.current.style.transform = '';
            btn2Ref.current.style.pointerEvents = '';
          }
          if (bottomBarRef.current) {
            bottomBarRef.current.style.opacity = '';
            bottomBarRef.current.style.transform = '';
            bottomBarRef.current.style.pointerEvents = '';
          }

          const fadeDistance = 550;
          const cutoff = 750;

          if (y > cutoff) {
            contentRef.current.style.opacity = '0';
            contentRef.current.style.pointerEvents = 'none';
            return;
          }

          const opacity = Math.max(0, 1 - y / fadeDistance);
          contentRef.current.style.opacity = String(opacity);
          contentRef.current.style.transform = `translate3d(0, ${y * 0.2}px, 0)`;
          contentRef.current.style.pointerEvents = opacity <= 0.05 ? 'none' : 'auto';
        }
      });
    };

    const onResize = () => {
      if (typeof window !== 'undefined' && window.innerWidth <= 768 && containerRef.current) {
        containerRef.current.style.height = `${window.innerHeight}px`;
      }
      onScroll();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('touchmove', onScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('touchmove', onScroll);
    };
  }, []);

  const word1 = 'REIKAI'.split('');
  const word2 = 'ARCADE'.split('');

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

      {/* ── 2. CINEMATIC HERO CENTERPIECE ── */}
      <div
        ref={contentRef}
        className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-10 flex-1 flex flex-col items-center justify-center text-center py-2 sm:py-4"
        style={{ willChange: 'transform, opacity' }}
      >
        {/* Letter-by-Letter Cinematic Title: "REIKAI ARCADE" */}
        <h1
          ref={titleRef}
          className="mobile-scroll-title font-['Cinzel',serif] text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-[0.14em] sm:tracking-[0.19em] uppercase text-white leading-tight mb-4 sm:mb-6 flex flex-wrap justify-center gap-x-4 sm:gap-x-7"
          style={{
            textShadow: '0 20px 45px rgba(0, 0, 0, 0.95), 0 4px 14px rgba(0,0,0,0.85)',
            willChange: 'opacity, transform',
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
          ref={descRef}
          className={`mobile-scroll-desc max-w-xl font-['Space_Grotesk',sans-serif] text-xs sm:text-sm md:text-base text-zinc-300/90 font-light leading-relaxed tracking-wide mb-6 sm:mb-8 px-4 transition-all duration-[1400ms] ease-out ${
            mounted
              ? 'opacity-100 translate-y-0 blur-0'
              : 'opacity-0 translate-y-5 blur-sm'
          }`}
          style={{ transitionDelay: '1400ms', willChange: 'opacity, transform' }}
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
            ref={btn1Ref}
            type="button"
            onClick={scrollToCatalog}
            className="mobile-scroll-btn1 group relative inline-flex items-center justify-center gap-3 px-8 sm:px-9 py-3 sm:py-3.5 rounded-full bg-white text-black font-['Space_Grotesk',sans-serif] font-bold text-xs uppercase tracking-[0.22em] shadow-[0_8px_30px_rgba(255,255,255,0.18)] hover:bg-zinc-200 hover:shadow-[0_12px_40px_rgba(255,255,255,0.28)] transition-all duration-300 active:scale-95 cursor-pointer w-full sm:w-auto"
            style={{ willChange: 'opacity, transform' }}
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
            ref={btn2Ref}
            href="/games"
            className="mobile-scroll-btn2 inline-flex items-center justify-center gap-2.5 px-8 sm:px-9 py-3 sm:py-3.5 rounded-full border border-white/20 bg-white/[0.04] backdrop-blur-xl text-white font-['Space_Grotesk',sans-serif] font-medium text-xs uppercase tracking-[0.22em] hover:bg-white/[0.09] hover:border-white/40 transition-all duration-300 active:scale-95 cursor-pointer w-full sm:w-auto"
            style={{ willChange: 'opacity, transform' }}
            data-testid="hero-secondary-cta"
          >
            <span>BROWSE CATALOG</span>
          </Link>
        </div>
      </div>

      {/* ── 3. BOTTOM AMBIENT STATUS BAR & SCROLL PROMPT ──
          Lifted higher up on phone with pb-24 (96px) so the Explore button rests with generous
          clearance above the bottom navigation bar without pushing the rest of the hero up.
      */}
      <div
        ref={bottomBarRef}
        className="mobile-scroll-explore relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 flex items-center justify-between text-[10px] font-['DM_Mono'] tracking-[0.25em] uppercase text-zinc-300/80 pointer-events-none pb-24 sm:pb-6"
        style={{ willChange: 'opacity, transform' }}
      >
        {/* Left Specification Index */}
        <div className="hidden sm:block flex-1 text-left">
          <span>01 // STOREFRONT INDEX</span>
        </div>

        {/* Center Scroll Prompt — positioned comfortably above the mobile bottom navigation bar */}
        <div className="flex-1 flex justify-center items-center">
          <button
            type="button"
            onClick={scrollToCatalog}
            className="pointer-events-auto flex flex-col items-center gap-1.5 text-zinc-300/80 hover:text-white transition-colors cursor-pointer group"
            aria-label="Scroll to explore products"
          >
            <span className="tracking-[0.3em]">EXPLORE</span>
            <ChevronDown
              size={13}
              className="animate-bounce transition-transform duration-300 group-hover:translate-y-0.5"
            />
          </button>
        </div>

        {/* Right Status Indicator */}
        <div className="hidden sm:flex flex-1 justify-end items-center gap-2 text-right">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>AUTHENTICATED // DIRECT DISPATCH</span>
        </div>
      </div>
    </section>
  );
}
