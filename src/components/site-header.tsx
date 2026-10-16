'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/components/cart-context';
import { useSearch } from '@/components/search-modal';
import { useMobileMenu } from '@/components/mobile-menu-context';
import {
  ChevronDown,
  Gamepad2,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  X,
  Layers,
  Zap,
  Gift,
  Crown,
  Headphones,
} from 'lucide-react';
import { UserAuthButton } from '@/components/user-auth-button';
import { MobileBottomNav } from '@/components/mobile-bottom-nav';
import { MobileRightSidebar } from '@/components/mobile-right-sidebar';

export function SiteHeader({
  reducedMotion = false,
  onMotionToggle,
  onHomeClick,
  onStageJump,
}: {
  reducedMotion?: boolean;
  onMotionToggle?: () => void;
  onHomeClick?: () => void;
  onStageJump?: (index: number) => void;
}) {
  const pathname = usePathname();
  const { cartCount, setCartOpen } = useCart();
  const { openSearch } = useSearch();
  const { isOpen: isMobileMenuOpen, toggleMenu: toggleMobileMenu } = useMobileMenu();
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
    }, 220);
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

  const handleLogoClick = (e: React.MouseEvent) => {
    if (pathname === '/') {
      if (onStageJump) {
        e.preventDefault();
        onStageJump(0);
      } else if (onHomeClick) {
        e.preventDefault();
        onHomeClick();
      }
    }
  };

  return (
    <>
      <header className="site-header site-header-capsule">
        <div className="header-inner">
          {/* Row 1: Logo (Left) and UserAuthButton (Right on mobile, or right actions on desktop) */}
          <div className="site-header-row1 flex items-center justify-between w-full md:w-auto">
            <Link
              href="/"
              onClick={handleLogoClick}
              className="header-logo-badge border-0 bg-transparent p-0 cursor-pointer flex items-center gap-2.5 sm:gap-3 shrink-0"
              data-testid="button-home"
            >
              <img
                src="/logo.jpeg"
                alt="Reikai Arcade"
                className="header-logo-img"
              />
              <span className="wordmark-text font-['Outfit'] font-black tracking-[0.14em] text-white text-sm sm:text-base">
                REIKAI <span className="wordmark-highlight text-[#a0e4f1]/80">ARCADE</span>
              </span>
            </Link>

            {/* Mobile Only: Sign in or Profile icon based on sign in logic */}
            <div className="flex md:hidden items-center gap-2">
              <UserAuthButton />
            </div>
          </div>

          {/* Desktop Navigation — Categories dropdown */}
          <nav className="header-nav hidden md:flex items-center" aria-label="Main navigation">
            <div
              ref={dropdownRef}
              className="nav-dropdown-wrapper relative py-2"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setCategoriesDropdown((prev) => !prev)}
                className={`nav-dropdown-link flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-['DM_Mono'] text-xs font-semibold tracking-wider uppercase text-zinc-300 hover:text-white hover:bg-white/5 transition cursor-pointer ${
                  categoriesDropdown ||
                  pathname.startsWith('/accessories') ||
                  pathname.startsWith('/games') ||
                  pathname.startsWith('/top-up') ||
                  pathname.startsWith('/gift-cards') ||
                  pathname.startsWith('/subscriptions')
                    ? 'text-white bg-white/8'
                    : ''
                }`}
                aria-expanded={categoriesDropdown}
                aria-haspopup="true"
              >
                <Layers size={13} className="text-white/50" />
                <span>Categories</span>
                <ChevronDown
                  size={12}
                  className={`nav-chevron text-zinc-400 transition-transform duration-200 ${
                    categoriesDropdown ? 'rotate-180 text-white/70' : ''
                  }`}
                />
              </button>
              {categoriesDropdown && (
                <div
                  className="nav-dropdown-menu absolute top-full left-0 pt-2 w-64 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="rounded-2xl border border-white/10 bg-zinc-950/98 p-2 shadow-2xl backdrop-blur-xl">
                    <Link
                      href="/games"
                      className="nav-dropdown-item flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition group"
                      onClick={() => setCategoriesDropdown(false)}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[#c673e2]/70">
                        <Gamepad2 size={16} />
                      </div>
                      <div>
                        <strong className="block text-xs font-bold text-white group-hover:text-white">
                          PS5 Games
                        </strong>
                        <span className="block text-[11px] text-zinc-400">Exclusives, hits &amp; discs</span>
                      </div>
                    </Link>

                    <Link
                      href="/top-up"
                      className="nav-dropdown-item flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition group"
                      onClick={() => setCategoriesDropdown(false)}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[#a0e4f1]/60">
                        <Zap size={16} />
                      </div>
                      <div>
                        <strong className="block text-xs font-bold text-white">
                          Game Top-Up
                        </strong>
                        <span className="block text-[11px] text-zinc-400">Valorant, PUBG, Genshin</span>
                      </div>
                    </Link>

                    <Link
                      href="/accessories"
                      className="nav-dropdown-item flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition group"
                      onClick={() => setCategoriesDropdown(false)}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[#5ba2c0]/70">
                        <Headphones size={16} />
                      </div>
                      <div>
                        <strong className="block text-xs font-bold text-white">
                          Accessories
                        </strong>
                        <span className="block text-[11px] text-zinc-400">DualSense, headsets &amp; gear</span>
                      </div>
                    </Link>

                    <Link
                      href="/subscriptions"
                      className="nav-dropdown-item flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition group"
                      onClick={() => setCategoriesDropdown(false)}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[#c673e2]/70">
                        <Crown size={16} />
                      </div>
                      <div>
                        <strong className="block text-xs font-bold text-white">
                          Subscriptions
                        </strong>
                        <span className="block text-[11px] text-zinc-400">PS Plus, Game Pass &amp; EA</span>
                      </div>
                    </Link>

                    <Link
                      href="/gift-cards"
                      className="nav-dropdown-item flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition group"
                      onClick={() => setCategoriesDropdown(false)}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-zinc-400">
                        <Gift size={16} />
                      </div>
                      <div>
                        <strong className="block text-xs font-bold text-white">
                          Gift Cards
                        </strong>
                        <span className="block text-[11px] text-zinc-400">PSN, Steam, Google &amp; Apple</span>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Actions */}
          <div className="header-actions hidden md:flex items-center gap-2">
            {/* Desktop Search Bar */}
            <button
              type="button"
              className="header-search-bar inline-flex"
              onClick={() => openSearch()}
              aria-label="Search store"
              data-testid="header-search-bar"
            >
              <Search size={14} className="header-search-bar-icon" />
              <span className="header-search-bar-text">Search store...</span>
              <kbd className="header-search-bar-kbd">⌘K</kbd>
            </button>

            {/* Wishlist Button */}
            <Link
              href="/wishlist"
              className="header-icon-button inline-flex"
              aria-label="View saved wishlist"
              data-testid="button-wishlist"
            >
              <Heart size={15} className="text-pink-400 hover:fill-pink-400/40 transition" />
            </Link>

            {/* Cart Pill Link */}
            <Link
              href="/cart"
              className="header-icon-button cart-pill-btn inline-flex"
              aria-label={`Open shopping bag with ${cartCount} items`}
              data-testid="button-cart"
            >
              <ShoppingBag size={15} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>

            {/* User Sign In / Profile Button */}
            <UserAuthButton />
          </div>

          {/* Mobile Only: Row 2 - Search bar on left/center, Menu toggle on right */}
          <div className="site-header-row2 flex md:hidden items-center gap-2 w-full min-w-0 mt-2.5">
            <button
              type="button"
              onClick={() => openSearch()}
              className="mobile-search-capsule-bar flex-1 min-w-0 h-10 px-3.5 rounded-xl bg-white/[0.06] border border-white/10 hover:border-white/25 flex items-center justify-between text-xs text-zinc-300 transition active:scale-[0.99] cursor-pointer overflow-hidden"
              aria-label="Search store"
              data-testid="mobile-search-bar"
            >
              <span className="text-zinc-400 font-['DM_Mono'] truncate min-w-0 flex-1 text-left">
                Search games, accessories, top up...
              </span>
              <Search size={16} className="text-white/40 shrink-0 ml-2" />
            </button>

            <button
              type="button"
              onClick={toggleMobileMenu}
              className={`mobile-menu-toggle-btn h-10 w-10 shrink-0 rounded-xl border flex items-center justify-center transition active:scale-95 cursor-pointer ${
                isMobileMenuOpen
                  ? 'border-white/25 text-white bg-white/10 shadow-md'
                  : 'bg-white/[0.06] border-white/10 text-white/70 hover:text-white hover:border-white/20'
              }`}
              aria-label="Toggle navigation menu"
              data-testid="mobile-menu-toggle"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Persistent mobile bottom navigation bar */}
      <MobileBottomNav onHomeClick={onHomeClick} />

      {/* Right slide-in sidebar drawer */}
      <MobileRightSidebar />
    </>
  );
}
