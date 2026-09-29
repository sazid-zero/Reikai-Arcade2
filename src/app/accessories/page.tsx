'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { ACCESSORIES_STOREFRONT, Product, formatTaka } from '@/lib/products';
import { useCart } from '@/components/cart-context';
import { ProductCard } from '@/components/product-card';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  ShoppingCart,
  LayoutGrid,
  List,
  Check,
  ChevronDown,
  ArrowRight,
  SlidersHorizontal,
  X,
  Headphones,
  Keyboard,
  Zap,
  Glasses,
} from 'lucide-react';

// Platform / Brand icons
function PlatformBadgeIcon({ platform }: { platform?: string }) {
  if (platform === 'playstation') {
    return (
      <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current text-white" aria-label="PlayStation">
        <path d="M8.01 19.34a6.6 6.6 0 0 1-2.94-.65l-1.03-.59 2.01-1.39.95.53c1.07.6 2.45.69 3.48.23 1.03-.45 1.67-1.37 1.67-2.4 0-1.74-1.38-2.61-3.66-3.23-2.91-.79-4.82-1.99-4.82-4.57 0-2.09 1.48-3.8 3.8-4.4a8.2 8.2 0 0 1 4.55.3l1.1.48-1.92 1.4-.95-.44a5.2 5.2 0 0 0-2.73-.24c-.99.23-1.63.95-1.63 1.83 0 1.5 1.25 2.3 3.51 2.92 3.03.82 4.97 2.08 4.97 4.88 0 2.22-1.57 4.02-4.04 4.67-.78.21-1.58.32-2.39.32v.56zm10.22-5.71v-8.4l-3.32 1.26v11.95l3.32-1.2v-3.61z" />
      </svg>
    );
  }
  if (platform === 'xbox') {
    return (
      <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current text-white" aria-label="Xbox">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.85 4.82c.62-.25 1.28-.39 1.96-.39.68 0 1.34.14 1.96.39l-2.07 3.4-1.85-3.4zm-4.7 1.83c1.07-.84 2.32-1.44 3.68-1.74l2.12 3.88-5.8-2.14zm13.1 0l-5.8 2.14 2.12-3.88c1.36.3 2.61.9 3.68 1.74zm-9.39 6.81l-4.5 4.54c-.66-1.18-1.05-2.54-1.05-3.99 0-1.12.24-2.18.66-3.14l4.89 2.59zm12.38 0l4.89-2.59c.42.96.66 2.02.66 3.14 0 1.45-.39 2.81-1.05 3.99l-4.5-4.54zm-8.84.86l2.3 3.77 2.3-3.77 3.91 3.94c-1.63 1.55-3.84 2.5-6.21 2.5s-4.58-.95-6.21-2.5l3.91-3.94z" />
      </svg>
    );
  }
  if (platform === 'nintendo') {
    return (
      <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current text-white" aria-label="Nintendo Switch">
        <path d="M10.875 0H5.85C2.62 0 0 2.62 0 5.85v12.3C0 21.38 2.62 24 5.85 24h5.025V0zm-4.2 8.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2zm11.475-8.4h-5.025v24h5.025C21.38 24 24 21.38 24 18.15V5.85C24 2.62 21.38 0 18.15 0zm-1.8 19.8a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2z" />
      </svg>
    );
  }
  // PC / Steam
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current text-white" aria-label="PC Gaming">
      <path d="M11.979 0C5.362 0 0 5.362 0 11.979c0 5.176 3.284 9.585 7.892 11.233l2.846-4.148a3.75 3.75 0 0 1-.362-1.616c0-2.072 1.68-3.752 3.752-3.752.41 0 .805.066 1.176.19l3.35-4.88A7.472 7.472 0 0 0 11.979 4.5a7.479 7.479 0 0 0-7.479 7.479c0 .668.09 1.314.253 1.93L.82 15.65C.293 14.502 0 13.274 0 11.979 0 5.362 5.362 0 11.979 0zm0 6.002a5.978 5.978 0 0 1 5.977 5.977c0 .678-.114 1.328-.323 1.933l-2.479-1.026a2.25 2.25 0 0 0-4.35 1.07l-2.476 1.025a5.975 5.975 0 0 1-.349-3.002 5.978 5.978 0 0 1 5.977-5.977z" />
    </svg>
  );
}

// Custom Category Pill Icons
function GamepadIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H9v2H7v-2H5v-2h2V9h2v2h2v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3-3c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
    </svg>
  );
}

export default function AccessoriesPage() {
  const [selectedPill, setSelectedPill] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeSlide, setActiveSlide] = useState(0);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const { addToCart } = useCart();

  const slides = [
    {
      kicker: 'PRO HARDWARE',
      title1: 'DUALSENSE EDGE',
      title2: 'WIRELESS CONTROLLER',
      desc: 'Gain a competitive edge with customizable controls, remappable paddles and tunable trigger stops.',
      btnText: 'SHOP NOW',
      link: '/accessories/dualsense-edge',
      bg: '/banner-acc-1.jpg',
      slogan: ['PRECISION', 'CONTROL', 'VICTORY.'],
    },
    {
      kicker: 'AUDIOPHILE SPEC',
      title1: 'PULSE ELITE',
      title2: 'PLANAR ACOUSTICS',
      desc: 'Studio-inspired planar magnetic drivers reproducing acoustic soundscapes with ultra-low distortion.',
      btnText: 'SHOP NOW',
      link: '/accessories/pulse-elite',
      bg: '/banner-acc-2.jpg',
      slogan: ['LOSSLESS', 'SPATIAL', 'IMMERSIVE.'],
    },
    {
      kicker: 'NEXT-GEN VR',
      title1: 'PLAYSTATION VR2',
      title2: 'SENSE TECHNOLOGY',
      desc: 'Escape into worlds that feel truly real with 4K HDR visuals and intuitive eye-tracking feedback.',
      btnText: 'SHOP NOW',
      link: '/accessories/playstation-vr2',
      bg: '/cat-thumb-consoles.jpg',
      slogan: ['VIRTUAL', 'TACTILE', 'EXPANSIVE.'],
    },
  ];

  const currentSlide = slides[activeSlide % slides.length];

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const toggleCategory = (c: string) => {
    setSelectedCategories((prev) =>
      prev.includes(c) ? prev.filter((item) => item !== c) : [...prev, c]
    );
  };

  const togglePlatform = (p: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((item) => item !== p) : [...prev, p]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedPlatforms([]);
    setSearchQuery('');
    setSelectedPill('all');
  };

  const filteredItems = useMemo(() => {
    return ACCESSORIES_STOREFRONT.filter((item) => {
      // Pill category filter
      if (selectedPill !== 'all') {
        if (selectedPill === 'controllers' && item.subCategory !== 'Controllers') return false;
        if (selectedPill === 'headsets' && item.subCategory !== 'Audio & Headsets') return false;
        if (selectedPill === 'keyboards' && item.subCategory !== 'Keyboards & Mice') return false;
        if (selectedPill === 'charging' && item.subCategory !== 'Charging & Docks') return false;
        if (selectedPill === 'vr' && item.subCategory !== 'VR & Displays') return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesSub = item.subCategory?.toLowerCase().includes(q);
        if (!matchesName && !matchesSub) return false;
      }

      // Sidebar categories
      if (selectedCategories.length > 0) {
        if (!selectedCategories.includes(item.subCategory)) return false;
      }

      // Sidebar platforms
      if (selectedPlatforms.length > 0) {
        if (!item.platform || !selectedPlatforms.includes(item.platform)) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });
  }, [selectedPill, searchQuery, selectedCategories, selectedPlatforms, sortBy]);

  return (
    <div className="arcade-store-wrapper">
      <SiteHeader />

      <main className="arcade-store-container">
        {/* HERO BANNER */}
        <section className="arcade-hero-card" aria-label="Featured Accessory Banner">
          <Image
            src={currentSlide.bg}
            alt={currentSlide.title1}
            fill
            priority
            className="arcade-hero-bg"
          />
          <div className="arcade-hero-overlay" />

          {/* Left Arrow */}
          <button
            onClick={handlePrevSlide}
            className="arcade-banner-arrow left"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Inner Content */}
          <div className="arcade-hero-inner">
            <div className="arcade-hero-left">
              <div className="arcade-hero-kicker">{currentSlide.kicker}</div>
              <div className="arcade-hero-title-main">{currentSlide.title1}</div>
              <div className="arcade-hero-title-sub">{currentSlide.title2}</div>
              <p className="arcade-hero-desc">{currentSlide.desc}</p>
              <Link href={currentSlide.link} className="arcade-hero-btn">
                <span>{currentSlide.btnText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="arcade-hero-right">
              <div className="arcade-hero-slogan">
                {currentSlide.slogan.map((word, i) => (
                  <div key={i}>{word}</div>
                ))}
              </div>

              <div className="arcade-hero-counter">
                <span className="arcade-counter-text">
                  0{activeSlide + 1} / 0{slides.length}
                </span>
                <div className="arcade-counter-track">
                  <div
                    className="arcade-counter-fill"
                    style={{
                      width: `${((activeSlide + 1) / slides.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNextSlide}
            className="arcade-banner-arrow right"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </section>

        {/* CATEGORY PILLS BAR */}
        <div className="arcade-pills-bar" role="tablist">
          {/* All Gear */}
          <button
            onClick={() => setSelectedPill('all')}
            className={`arcade-pill ${selectedPill === 'all' ? 'active' : ''}`}
            role="tab"
            aria-selected={selectedPill === 'all'}
          >
            <div className="arcade-pill-icon">
              <GamepadIcon />
            </div>
            <div className="arcade-pill-texts">
              <span className="arcade-pill-title">All Gear</span>
              <span className="arcade-pill-sub">Browse All</span>
            </div>
          </button>

          {/* Controllers */}
          <button
            onClick={() => setSelectedPill('controllers')}
            className={`arcade-pill ${selectedPill === 'controllers' ? 'active' : ''}`}
            role="tab"
            aria-selected={selectedPill === 'controllers'}
          >
            <div className="arcade-pill-icon">
              <PlatformBadgeIcon platform="playstation" />
            </div>
            <div className="arcade-pill-texts">
              <span className="arcade-pill-title">Controllers</span>
              <span className="arcade-pill-sub">Pro & Wireless</span>
            </div>
          </button>

          {/* Audio & Headsets */}
          <button
            onClick={() => setSelectedPill('headsets')}
            className={`arcade-pill ${selectedPill === 'headsets' ? 'active' : ''}`}
            role="tab"
            aria-selected={selectedPill === 'headsets'}
          >
            <div className="arcade-pill-icon">
              <Headphones className="w-4 h-4" />
            </div>
            <div className="arcade-pill-texts">
              <span className="arcade-pill-title">Headsets</span>
              <span className="arcade-pill-sub">Spatial 3D Audio</span>
            </div>
          </button>

          {/* Keyboards & Mice */}
          <button
            onClick={() => setSelectedPill('keyboards')}
            className={`arcade-pill ${selectedPill === 'keyboards' ? 'active' : ''}`}
            role="tab"
            aria-selected={selectedPill === 'keyboards'}
          >
            <div className="arcade-pill-icon">
              <Keyboard className="w-4 h-4" />
            </div>
            <div className="arcade-pill-texts">
              <span className="arcade-pill-title">Keyboards & Mice</span>
              <span className="arcade-pill-sub">Mechanical & Rapid</span>
            </div>
          </button>

          {/* Charging & Docks */}
          <button
            onClick={() => setSelectedPill('charging')}
            className={`arcade-pill ${selectedPill === 'charging' ? 'active' : ''}`}
            role="tab"
            aria-selected={selectedPill === 'charging'}
          >
            <div className="arcade-pill-icon">
              <Zap className="w-4 h-4 text-purple-400" />
            </div>
            <div className="arcade-pill-texts">
              <span className="arcade-pill-title">Charging & Docks</span>
              <span className="arcade-pill-sub">Fast Hubs</span>
            </div>
          </button>

          {/* VR & Displays */}
          <button
            onClick={() => setSelectedPill('vr')}
            className={`arcade-pill ${selectedPill === 'vr' ? 'active' : ''}`}
            role="tab"
            aria-selected={selectedPill === 'vr'}
          >
            <div className="arcade-pill-icon">
              <Glasses className="w-4 h-4" />
            </div>
            <div className="arcade-pill-texts">
              <span className="arcade-pill-title">VR & Displays</span>
              <span className="arcade-pill-sub">PlayStation VR2</span>
            </div>
          </button>

          <button
            onClick={handleNextSlide}
            className="arcade-pills-arrow-btn"
            aria-label="Scroll more categories"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* MOBILE FILTER TOGGLE BUTTON */}
        <div className="lg:hidden mt-4 flex items-center justify-between">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#141026] border border-white/10 text-sm font-semibold text-white"
          >
            <SlidersHorizontal className="w-4 h-4 text-purple-400" />
            <span>Filters ({selectedCategories.length + selectedPlatforms.length})</span>
          </button>
          <div className="text-xs text-slate-400">{filteredItems.length} items available</div>
        </div>

        {/* MAIN BODY LAYOUT */}
        <div className="arcade-store-body">
          {/* LEFT SIDEBAR */}
          <aside className={`arcade-sidebar ${mobileFilterOpen ? 'fixed inset-0 z-50 bg-[#0c0916] p-6 overflow-y-auto block' : 'hidden lg:block'}`}>
            {mobileFilterOpen && (
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4 lg:hidden">
                <span className="font-bold text-lg text-white">Filters</span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg bg-white/5 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            <div className="arcade-filters-header">
              <span className="arcade-filters-title">FILTERS</span>
              <button onClick={clearAllFilters} className="arcade-filters-clear">
                Clear All
              </button>
            </div>

            {/* Search */}
            <div className="arcade-search-box">
              <Search className="arcade-search-icon w-4 h-4" />
              <input
                type="text"
                placeholder="Search accessories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="arcade-search-input"
              />
            </div>

            {/* CATEGORY SECTION */}
            <div className="arcade-filter-group">
              <div className="arcade-group-title">CATEGORY</div>
              <div className="space-y-1">
                {[
                  { id: 'Controllers', label: 'Controllers', count: 14 },
                  { id: 'Audio & Headsets', label: 'Audio & Headsets', count: 18 },
                  { id: 'Keyboards & Mice', label: 'Keyboards & Mice', count: 12 },
                  { id: 'Charging & Docks', label: 'Charging & Docks', count: 8 },
                  ...(showMoreCategories
                    ? [
                        { id: 'Custom Plates', label: 'Custom Plates', count: 6 },
                        { id: 'VR & Displays', label: 'VR & Displays', count: 4 },
                      ]
                    : []),
                ].map((item) => {
                  const isChecked = selectedCategories.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleCategory(item.id)}
                      className={`arcade-checkbox-item ${isChecked ? 'checked' : ''}`}
                    >
                      <div className="arcade-checkbox-left">
                        <div className="arcade-custom-checkbox">
                          {isChecked && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="arcade-checkbox-label">{item.label}</span>
                      </div>
                      <span className="arcade-checkbox-count">{item.count}</span>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setShowMoreCategories(!showMoreCategories)}
                className="arcade-show-more"
              >
                <span>{showMoreCategories ? 'Show Less' : 'Show More'}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${showMoreCategories ? 'rotate-180' : ''}`}
                />
              </button>
            </div>

            {/* PLATFORM / BRAND SECTION */}
            <div className="arcade-filter-group">
              <div className="arcade-group-title">PLATFORM</div>
              <div className="space-y-1">
                {[
                  { id: 'playstation', label: 'PlayStation', count: 24 },
                  { id: 'pc', label: 'PC Gaming', count: 18 },
                  { id: 'xbox', label: 'Xbox', count: 12 },
                  { id: 'nintendo', label: 'Nintendo', count: 8 },
                ].map((item) => {
                  const isChecked = selectedPlatforms.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => togglePlatform(item.id)}
                      className={`arcade-checkbox-item ${isChecked ? 'checked' : ''}`}
                    >
                      <div className="arcade-checkbox-left">
                        <div className="arcade-custom-checkbox">
                          {isChecked && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="arcade-checkbox-label">{item.label}</span>
                      </div>
                      <span className="arcade-checkbox-count">{item.count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {mobileFilterOpen && (
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full mt-6 py-3 rounded-xl bg-purple-600 text-white font-bold text-sm lg:hidden"
              >
                Apply Filters ({filteredItems.length} Results)
              </button>
            )}
          </aside>

          {/* RIGHT MAIN COLUMN */}
          <section className="arcade-main-col">
            {/* Header with Title & Sort */}
            <div className="arcade-main-header">
              <div className="arcade-heading-left">
                <h1 className="arcade-section-title">All Accessories</h1>
                <span className="arcade-section-subtitle">
                  Elevate your battlestation with pro-grade gear.
                </span>
              </div>

              <div className="arcade-heading-right">
                <div className="arcade-sort-wrap">
                  <span>Sort by</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="arcade-sort-select"
                  >
                    <option value="popular">Popular</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>

                <div className="arcade-view-switch">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`arcade-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    aria-label="Grid View"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`arcade-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    aria-label="List View"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* 6-COLUMN CARDS GRID */}
            <div className="arcade-grid-6">
              {filteredItems.map((item) => (
                <ProductCard key={item.id} product={item} href={`/accessories/${item.id}`} onAdd={addToCart} />
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-16 bg-[#130f24] rounded-2xl border border-white/5 mt-4">
                <p className="text-slate-400 text-sm">No accessories found matching your active filters.</p>
                <button
                  onClick={clearAllFilters}
                  className="mt-3 text-xs font-bold text-purple-400 hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
