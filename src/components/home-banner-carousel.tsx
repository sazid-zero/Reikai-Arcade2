'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export type HomeBannerSlide = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  label?: string;
  ctaText: string;
  ctaHref: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  imageUrl: string;
  overlayColor?: string;
};

interface HomeBannerCarouselProps {
  /** If provided, use these slides (ssr preloaded). Otherwise fetch from API. */
  initialSlides?: HomeBannerSlide[];
  autoPlayInterval?: number;
}

export function HomeBannerCarousel({
  initialSlides,
  autoPlayInterval = 6000,
}: HomeBannerCarouselProps) {
  const [slides, setSlides] = useState<HomeBannerSlide[]>(initialSlides ?? []);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch from admin API if no initial slides provided
  useEffect(() => {
    if (initialSlides && initialSlides.length > 0) {
      setLoaded(true);
      return;
    }
    fetch('/api/banners')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.slides?.length) {
          setSlides(data.slides);
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  // Auto-advance
  useEffect(() => {
    if (paused || slides.length <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrent((p) => (p + 1) % slides.length);
    }, autoPlayInterval);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, slides.length, autoPlayInterval]);

  const prev = () => setCurrent((p) => (p - 1 + slides.length) % slides.length);
  const next = () => setCurrent((p) => (p + 1) % slides.length);

  // Touch swipe
  const touchStartX = useRef<number>(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
  };

  if (!loaded || slides.length === 0) return null;

  const slide = slides[current];

  return (
    <div className="hbc-wrapper">
      {/* Banner */}
      <section
        className="hbc-section"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-label="Featured promotions carousel"
      >
        {/* Background slides */}
        <div className="hbc-backdrop">
          {slides.map((s, i) => (
            <div
              key={s.id}
              className={`hbc-backdrop-slide${i === current ? ' active' : ''}`}
              aria-hidden={i !== current}
            >
              {s.imageUrl && (
                <img
                  src={s.imageUrl}
                  alt=""
                  className="hbc-backdrop-img"
                  draggable={false}
                />
              )}
              <div
                className="hbc-overlay"
                style={s.overlayColor ? { background: s.overlayColor } : undefined}
              />
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="hbc-content">
          <div className="hbc-text" key={slide.id}>
            {slide.label && (
              <p className="hbc-label">{slide.label}</p>
            )}
            <h2 className="hbc-title">{slide.title}</h2>
            {slide.subtitle && (
              <p className="hbc-subtitle">{slide.subtitle}</p>
            )}
            {slide.description && (
              <p className="hbc-desc">{slide.description}</p>
            )}
            <div className="hbc-actions">
              <Link href={slide.ctaHref} className="hbc-btn-primary">
                <span>{slide.ctaText}</span>
                <ArrowRight size={13} />
              </Link>
              {slide.secondaryCtaText && slide.secondaryCtaHref && (
                <Link href={slide.secondaryCtaHref} className="hbc-btn-secondary">
                  <span>{slide.secondaryCtaText}</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Prev / Next arrows — always shown on both sides */}
        {slides.length > 1 && (
          <>
            <button type="button" className="hbc-nav hbc-nav--prev" onClick={prev} aria-label="Previous slide">
              <ChevronLeft size={16} />
            </button>
            <button type="button" className="hbc-nav hbc-nav--next" onClick={next} aria-label="Next slide">
              <ChevronRight size={16} />
            </button>
          </>
        )}
      </section>

      {/* Dots indicator — OUTSIDE the banner, below it */}
      {slides.length > 1 && (
        <div className="hbc-dock-outer">
          <div className="hbc-dots">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                className={`hbc-dot${i === current ? ' active' : ''}`}
                onClick={() => setCurrent(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
