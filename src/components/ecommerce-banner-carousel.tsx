'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/cart-context';
import { getAccessoryById, getGameById, Product } from '@/lib/products';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  ShoppingBag,
  Sparkles,
  Star,
  Zap,
} from 'lucide-react';

export interface BannerSlide {
  id: string;
  kicker: string;
  title: string;
  highlightWord?: string;
  description: string;
  price: string;
  originalPrice?: string;
  badge?: string;
  tags: string[];
  bgImage: string;
  productHref: string;
  productId?: string;
  glyph?: string;
  wash?: string;
}

interface EcommerceBannerCarouselProps {
  slides: BannerSlide[];
  categoryType: 'accessories' | 'games';
}

export function EcommerceBannerCarousel({
  slides,
  categoryType,
}: EcommerceBannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [quickAddNotice, setQuickAddNotice] = useState<string | null>(null);
  const { addToCart } = useCart();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-advance carousel every 6 seconds if not paused
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, slides.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const currentSlide = slides[currentIndex];

  const handleQuickAdd = (slide: BannerSlide) => {
    if (!slide.productId) return;
    const product =
      categoryType === 'accessories'
        ? getAccessoryById(slide.productId)
        : getGameById(slide.productId);

    if (product) {
      addToCart(product);
      setQuickAddNotice(`Added ${product.name} to cart!`);
      setTimeout(() => setQuickAddNotice(null), 3000);
    }
  };

  return (
    <div
      className="ecommerce-carousel-wrapper"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Featured drops carousel"
    >
      {/* Background slide imagery with crossfade */}
      <div className="carousel-backdrop-stage">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`carousel-backdrop-slide ${idx === currentIndex ? 'active' : ''}`}
            style={
              {
                backgroundImage: `url(${slide.bgImage})`,
                '--slide-wash': slide.wash || 'hsl(272 90% 50% / .3)',
              } as React.CSSProperties
            }
          >
            {/* Dark & Cosmic Overlays */}
            <div className="carousel-ambient-wash" />
            <div className="carousel-gradient-overlay" />
            <div className="carousel-cyber-grid" />
          </div>
        ))}
      </div>

      {/* Main Content Container */}
      <div className="carousel-content-container">
        <div className="carousel-slide-content" key={currentSlide.id}>
          {/* Left Column: Headline, Specs, Actions */}
          <div className="carousel-text-col">
            <div className="carousel-kicker-row">
              <span className="carousel-kicker-pill">
                <span className="carousel-pulse-dot" />
                {currentSlide.kicker}
              </span>
              {currentSlide.badge && (
                <span className="carousel-badge-pill">
                  <Sparkles size={11} className="text-[#e879f9]" />
                  {currentSlide.badge}
                </span>
              )}
            </div>

            <h1 className="carousel-slide-title">
              {currentSlide.title}{' '}
              {currentSlide.highlightWord && (
                <span className="title-gradient-word">{currentSlide.highlightWord}</span>
              )}
            </h1>

            <p className="carousel-slide-desc">{currentSlide.description}</p>

            {/* Spec & Feature Tags */}
            <div className="carousel-tags-row">
              {currentSlide.tags.map((tag) => (
                <span key={tag} className="carousel-tag-chip">
                  <Zap size={11} className="text-[#a855f7]" />
                  {tag}
                </span>
              ))}
            </div>

            {/* Pricing & CTA Actions */}
            <div className="carousel-actions-row">
              <div className="carousel-price-block">
                <span className="price-label">DIRECT VAULT PRICE</span>
                <div className="price-values">
                  <span className="current-val">{currentSlide.price}</span>
                  {currentSlide.originalPrice && (
                    <span className="original-val">{currentSlide.originalPrice}</span>
                  )}
                </div>
              </div>

              <div className="carousel-buttons-group">
                <Link
                  href={currentSlide.productHref}
                  className="carousel-btn-primary"
                  data-testid={`banner-view-${currentSlide.id}`}
                >
                  <span>EXPLORE PRODUCT</span>
                  <ArrowRight size={16} />
                </Link>

                {currentSlide.productId && (
                  <button
                    type="button"
                    className="carousel-btn-secondary"
                    onClick={() => handleQuickAdd(currentSlide)}
                    data-testid={`banner-add-${currentSlide.id}`}
                  >
                    <ShoppingBag size={15} />
                    <span>QUICK ADD</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quick Added Toast */}
            {quickAddNotice && (
              <div className="carousel-quick-toast" role="status">
                <Sparkles size={13} className="text-[#4ade80]" />
                <span>{quickAddNotice}</span>
              </div>
            )}
          </div>

          {/* Right Column: Holographic Showcase Card */}
          <div className="carousel-visual-col">
            <Link href={currentSlide.productHref} className="carousel-holo-card-link">
              <div
                className="carousel-holo-card"
                style={{ '--card-wash': currentSlide.wash } as React.CSSProperties}
              >
                <div className="holo-corner-hud tl" />
                <div className="holo-corner-hud tr" />
                <div className="holo-corner-hud bl" />
                <div className="holo-corner-hud br" />

                <div className="holo-badge-top">
                  <span className="telemetry-live-dot" />
                  <span>AUTHENTIC PS5 ECOSYSTEM</span>
                </div>

                <div className="holo-center-glyph">
                  <span>{currentSlide.glyph || 'PS5'}</span>
                </div>

                <div className="holo-bottom-telemetry">
                  <div className="telemetry-row">
                    <span>SECURITY HASH:</span>
                    <strong>RK-0982-VAULT</strong>
                  </div>
                  <div className="telemetry-row">
                    <span>ORBITAL SYNC:</span>
                    <strong className="text-[#4ade80]">ONLINE (0.4ms)</strong>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        type="button"
        className="carousel-nav-arrow prev"
        onClick={handlePrev}
        aria-label="Previous featured banner"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        type="button"
        className="carousel-nav-arrow next"
        onClick={handleNext}
        aria-label="Next featured banner"
      >
        <ChevronRight size={22} />
      </button>

      {/* Bottom Track Controls & Pagination */}
      <div className="carousel-bottom-dock">
        <div className="carousel-slide-counter">
          <span className="counter-current">0{currentIndex + 1}</span>
          <span className="counter-sep">/</span>
          <span className="counter-total">0{slides.length}</span>
        </div>

        <div className="carousel-pill-indicators">
          {slides.map((slide, idx) => (
            <button
              type="button"
              key={slide.id}
              className={`carousel-indicator-bar ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}: ${slide.title}`}
            >
              <span className="indicator-progress" />
            </button>
          ))}
        </div>

        <button
          type="button"
          className="carousel-pause-toggle"
          onClick={() => setIsPaused((prev) => !prev)}
          aria-label={isPaused ? 'Resume auto carousel' : 'Pause auto carousel'}
        >
          {isPaused ? <Play size={12} /> : <Pause size={12} />}
        </button>
      </div>
    </div>
  );
}
