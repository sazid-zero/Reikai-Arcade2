'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/components/cart-context';
import { useSearch } from '@/components/search-modal';
import { ChevronDown, Gamepad2, Heart, Menu, Search, ShoppingBag, Sparkles, X, Layers, Zap, Gift, Crown, Headphones } from 'lucide-react';
import { UserAuthButton } from '@/components/user-auth-button';

import { MobileBottomNav } from '@/components/mobile-bottom-nav';

export function SiteHeader({
  reducedMotion = false,
  onMotionToggle,
}: {
  reducedMotion?: boolean;
  onMotionToggle?: () => void;
}) {
  const pathname = usePathname();
  const { cartCount, setCartOpen } = useCart();
  const { openSearch } = useSearch();
  const [categoriesDropdown, setCategoriesDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setCategoriesDropdown(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setCategoriesDropdown(false);
    }, 220); // 220ms grace period ensures mouse moving into dropdown never drops state
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCategoriesDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setCategoriesDropdown(false);
  }, [pathname]);

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link
            href="/"
            className="header-logo-badge border-0 bg-transparent p-0 cursor-pointer flex items-center gap-2.5 sm:gap-3 shrink-0"
            data-testid="button-home"
          >
            <img
              src="/logo.jpeg"
              alt="Reikai Arcade"
              className="header-logo-img"
            />
            <span className="wordmark-text font-['Outfit'] font-black tracking-[0.14em] text-white text-sm sm:text-base">
              REIKAI <span className="wordmark-highlight text-[#00f0ff] drop-shadow-[0_0_12px_rgba(0,240,255,0.7)]">ARCADE</span>
            </span>
          </Link>

          <nav className="header-nav hidden md:flex items-center" aria-label="Main navigation">
            {/* Categories Dropdown Menu with robust click + hover bridge */}
            <div
              ref={dropdownRef}
              className="nav-dropdown-wrapper relative py-2"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setCategoriesDropdown((prev) => !prev)}
                className={`nav-dropdown-link flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-['DM_Mono'] text-xs font-semibold tracking-wider uppercase text-zinc-300 hover:text-[#00f0ff] hover:bg-white/5 transition cursor-pointer ${
                  categoriesDropdown || pathname.startsWith('/accessories') || pathname.startsWith('/games') || pathname.startsWith('/top-up') || pathname.startsWith('/gift-cards') || pathname.startsWith('/subscriptions')
                    ? 'text-[#00f0ff] bg-[#00f0ff]/10'
                    : ''
                }`}
                aria-expanded={categoriesDropdown}
                aria-haspopup="true"
              >
                <Layers size={13} className="text-[#00f0ff]" />
                <span>Categories</span>
                <ChevronDown size={12} className={`nav-chevron text-zinc-400 transition-transform duration-200 ${categoriesDropdown ? 'rotate-180 text-[#00f0ff]' : ''}`} />
              </button>
              {categoriesDropdown && (
                <div 
                  className="nav-dropdown-menu absolute top-full left-0 pt-2 w-64 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="rounded-2xl border border-[#a855f7]/30 bg-[#080315]/95 p-2 shadow-2xl backdrop-blur-2xl">
                    <Link href="/games" className="nav-dropdown-item flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition group" onClick={() => setCategoriesDropdown(false)}>
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 group-hover:text-[#00f0ff]">
                        <Gamepad2 size={16} />
                      </div>
                      <div>
                        <strong className="block text-xs font-bold text-white group-hover:text-[#00f0ff]">PS5 Games</strong>
                        <span className="block text-[11px] text-zinc-400">Exclusives, hits &amp; discs</span>
                      </div>
                    </Link>

                    <Link href="/top-up" className="nav-dropdown-item flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition group" onClick={() => setCategoriesDropdown(false)}>
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-[#00f0ff]">
                        <Zap size={16} />
                      </div>
                      <div>
                        <strong className="block text-xs font-bold text-white group-hover:text-[#00f0ff]">Game Top-Up</strong>
                        <span className="block text-[11px] text-zinc-400">Valorant, PUBG, Genshin</span>
                      </div>
                    </Link>

                    <Link href="/accessories" className="nav-dropdown-item flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition group" onClick={() => setCategoriesDropdown(false)}>
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-500/10 text-pink-400 group-hover:text-[#00f0ff]">
                        <Headphones size={16} />
                      </div>
                      <div>
                        <strong className="block text-xs font-bold text-white group-hover:text-[#00f0ff]">Accessories</strong>
                        <span className="block text-[11px] text-zinc-400">DualSense, headsets &amp; gear</span>
                      </div>
                    </Link>

                    <Link href="/subscriptions" className="nav-dropdown-item flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition group" onClick={() => setCategoriesDropdown(false)}>
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400 group-hover:text-[#00f0ff]">
                        <Crown size={16} />
                      </div>
                      <div>
                        <strong className="block text-xs font-bold text-white group-hover:text-[#00f0ff]">Subscriptions</strong>
                        <span className="block text-[11px] text-zinc-400">PS Plus, Game Pass &amp; EA</span>
                      </div>
                    </Link>

                    <Link href="/gift-cards" className="nav-dropdown-item flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition group" onClick={() => setCategoriesDropdown(false)}>
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 group-hover:text-[#00f0ff]">
                        <Gift size={16} />
                      </div>
                      <div>
                        <strong className="block text-xs font-bold text-white group-hover:text-[#00f0ff]">Gift Cards</strong>
                        <span className="block text-[11px] text-zinc-400">PSN, Steam, Google &amp; Apple</span>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          <div className="header-actions flex items-center gap-2">
            {/* Desktop Search Bar - only on desktop */}
            <button
              type="button"
              className="header-search-bar hidden md:inline-flex"
              onClick={() => openSearch()}
              aria-label="Search store"
              data-testid="header-search-bar"
            >
              <Search size={14} className="header-search-bar-icon" />
              <span className="header-search-bar-text">Search store...</span>
              <kbd className="header-search-bar-kbd">⌘K</kbd>
            </button>

            {/* Wishlist Button - desktop / tablet */}
            <Link
              href="/wishlist"
              className="header-icon-button hidden sm:inline-flex"
              aria-label="View saved wishlist"
              data-testid="button-wishlist"
            >
              <Heart size={15} className="text-pink-400 hover:fill-pink-400/40 transition" />
            </Link>

            {/* Cart Pill Button - desktop */}
            <button
              type="button"
              className="header-icon-button cart-pill-btn hidden md:inline-flex"
              onClick={() => setCartOpen(true)}
              aria-label={`Open shopping bag with ${cartCount} items`}
              data-testid="button-cart"
            >
              <ShoppingBag size={15} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>

            {/* User Sign In / Profile Button - always visible and accessible */}
            <UserAuthButton />
          </div>
        </div>
      </header>

      {/* Persistent mobile bottom navigation bar */}
      <MobileBottomNav />
    </>
  );
}
