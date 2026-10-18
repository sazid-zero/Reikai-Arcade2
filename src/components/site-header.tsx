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
  Package,
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
  const { cartCount } = useCart();
  const { openSearch } = useSearch();
  const { isOpen: isMobileMenuOpen, toggleMenu: toggleMobileMenu } = useMobileMenu();
  const [categoriesDropdown, setCategoriesDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll detection for transparent → smooth blur transition without visible edge
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <header className={`site-header${scrolled ? ' site-header--scrolled' : ''}`}>
        <div className="header-inner">

          {/* ── DESKTOP LAYOUT (>= 769px) ── */}
          {/* Logo — left */}
          <Link
            href="/"
            onClick={handleLogoClick}
            className="header-logo-badge hidden md:flex items-center gap-2.5 shrink-0 border-0 bg-transparent p-0 cursor-pointer text-white"
            data-testid="button-home"
          >
            <img src="/reikai_logo.jpeg" alt="Reikai Arcade" className="header-logo-img h-8 w-8 rounded-full object-cover border border-white/20" />
            <span className="wordmark-text font-['Outfit'] font-black tracking-[0.14em] text-white text-sm">
              REIKAI <span className="text-white/60">ARCADE</span>
            </span>
          </Link>

          {/* Desktop Nav — center */}
          <nav className="header-nav hidden md:flex items-center gap-1" aria-label="Main navigation">
            <div
              ref={dropdownRef}
              className="nav-dropdown-wrapper relative py-2"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setCategoriesDropdown((prev) => !prev)}
                className={`nav-dropdown-link flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-['DM_Mono'] text-xs font-semibold tracking-wider uppercase text-zinc-400 hover:text-white hover:bg-white/5 transition cursor-pointer ${
                  categoriesDropdown ||
                  pathname.startsWith('/accessories') ||
                  pathname.startsWith('/games') ||
                  pathname.startsWith('/top-up') ||
                  pathname.startsWith('/gift-cards') ||
                  pathname.startsWith('/subscriptions')
                    ? 'text-white bg-white/10'
                    : ''
                }`}
                aria-expanded={categoriesDropdown}
                aria-haspopup="true"
              >
                <Layers size={13} className="text-white/60" />
                <span>Categories</span>
                <ChevronDown
                  size={12}
                  className={`nav-chevron text-zinc-500 transition-transform duration-200 ${
                    categoriesDropdown ? 'rotate-180 text-white' : ''
                  }`}
                />
              </button>
              {categoriesDropdown && (
                <div
                  className="nav-dropdown-menu absolute top-full left-0 pt-2 w-72 sm:w-80 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="rounded-2xl border border-white/10 bg-zinc-950/98 p-2 shadow-2xl backdrop-blur-2xl">
                    {[
                      { href: '/games', icon: <Gamepad2 size={18} />, label: 'PS5 Games', desc: 'Exclusives, hits & discs' },
                      { href: '/top-up', icon: <Zap size={18} />, label: 'Game Top-Up', desc: 'Valorant, PUBG, Genshin' },
                      { href: '/accessories', icon: <Headphones size={18} />, label: 'Accessories', desc: 'DualSense, headsets & gear' },
                      { href: '/subscriptions', icon: <Crown size={18} />, label: 'Subscriptions', desc: 'PS Plus, Game Pass & EA' },
                      { href: '/gift-cards', icon: <Gift size={18} />, label: 'Gift Cards', desc: 'PSN, Steam, Google & Apple' },
                    ].map(({ href, icon, label, desc }) => (
                      <Link
                        key={href}
                        href={href}
                        className="nav-dropdown-item flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-white/5 transition group text-left"
                        onClick={() => setCategoriesDropdown(false)}
                      >
                        <div className="shrink-0 flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-white/60 group-hover:text-white group-hover:bg-white/10 transition">
                          {icon}
                        </div>
                        <div className="text-left min-w-0">
                          <strong className="block text-xs font-bold text-white/80 group-hover:text-white text-left transition-colors">
                            {label}
                          </strong>
                          <span className="block text-[11px] text-zinc-500 text-left truncate">{desc}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Offers */}
            <Link
              href="/#browse"
              className="nav-dropdown-link flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-['DM_Mono'] text-xs font-semibold tracking-wider uppercase text-zinc-400 hover:text-white hover:bg-white/5 transition"
              data-testid="nav-link-offers"
            >
              <Gift size={13} className="text-white/60" />
              <span>Offers</span>
            </Link>

            {/* Orders */}
            <Link
              href="/orders"
              className={`nav-dropdown-link flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-['DM_Mono'] text-xs font-semibold tracking-wider uppercase text-zinc-400 hover:text-white hover:bg-white/5 transition ${
                pathname.startsWith('/orders') ? 'text-white bg-white/10' : ''
              }`}
              data-testid="nav-link-orders"
            >
              <Package size={13} className="text-white/60" />
              <span>Orders</span>
            </Link>
          </nav>

          {/* Desktop Actions — right */}
          <div className="header-actions hidden md:flex items-center gap-2">
            <button
              type="button"
              className="header-search-bar inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-white transition cursor-pointer text-xs"
              onClick={() => openSearch()}
              aria-label="Search store"
              data-testid="header-search-bar"
            >
              <Search size={14} className="text-white/60" />
              <span className="font-['DM_Mono']">Search store...</span>
              <kbd className="text-[10px] font-mono px-1 py-0.5 rounded bg-white/10 text-zinc-400">⌘K</kbd>
            </button>

            <Link
              href="/wishlist"
              className="header-icon-button inline-flex items-center justify-center h-8 w-8 rounded-full border border-white/10 bg-white/5 text-zinc-300 hover:border-white/20 hover:text-white transition"
              aria-label="View saved wishlist"
              data-testid="button-wishlist"
            >
              <Heart size={15} />
            </Link>

            <Link
              href="/cart"
              className="header-icon-button cart-pill-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/15 bg-white/10 text-white hover:bg-white/15 transition text-xs font-mono font-bold"
              aria-label={`Open shopping bag with ${cartCount} items`}
              data-testid="button-cart"
            >
              <ShoppingBag size={14} />
              <span>CART ({cartCount})</span>
            </Link>

            <UserAuthButton />
          </div>

          {/* ── MOBILE LAYOUT (<= 768px) — single row: menu (left) | logo (center, no text) | cart (right) ── */}
          <div className="mobile-header-row md:hidden">
            {/* Left: Hamburger menu toggle */}
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="mobile-header-menu-btn"
              aria-label="Toggle navigation menu"
              data-testid="mobile-menu-toggle"
            >
              {isMobileMenuOpen ? (
                <X size={22} strokeWidth={1.75} />
              ) : (
                <Menu size={22} strokeWidth={1.75} />
              )}
            </button>

            {/* Middle: Logo emblem only, no text, strictly centered */}
            <Link
              href="/"
              onClick={handleLogoClick}
              className="mobile-header-logo-center"
              data-testid="button-home-mobile"
              aria-label="Reikai Arcade Home"
            >
              <img
                src="/reikai_logo.jpeg"
                alt="Reikai Arcade"
                className="h-8 w-8 rounded-full object-cover shadow-md"
              />
            </Link>

            {/* Right: Cart */}
            <Link
              href="/cart"
              className="mobile-header-cart-btn"
              aria-label={`Cart with ${cartCount} items`}
              data-testid="mobile-cart-btn"
            >
              <span className="mobile-header-cart-text">CART ({cartCount})</span>
            </Link>
          </div>

        </div>
      </header>

      {/* Mobile bottom nav: Home | Offers | Search | Orders | Account */}
      <MobileBottomNav onHomeClick={onHomeClick} />

      {/* Right slide-in drawer sidebar */}
      <MobileRightSidebar />
    </>
  );
}
