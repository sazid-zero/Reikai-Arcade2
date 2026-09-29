'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/components/cart-context';
import { ChevronDown, Gamepad2, Menu, Search, ShoppingBag, Sparkles, X } from 'lucide-react';

export function SiteHeader({
  reducedMotion = false,
  onMotionToggle,
}: {
  reducedMotion?: boolean;
  onMotionToggle?: () => void;
}) {
  const pathname = usePathname();
  const { cartCount, setCartOpen } = useCart();
  const [mobileNav, setMobileNav] = useState(false);
  const [shopDropdown, setShopDropdown] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link
          href="/"
          className="wordmark border-0 bg-transparent p-0 cursor-pointer flex items-center gap-2.5"
          data-testid="button-home"
        >
          <Gamepad2 size={24} className="text-[#a855f7]" />
          <span className="wordmark-text">
            REIKAI <span className="wordmark-highlight">ARCADE</span>
          </span>
        </Link>

        <nav className="header-nav" aria-label="Main navigation">
          {/* Shop with dropdown */}
          <div
            className="nav-dropdown-wrapper"
            onMouseEnter={() => setShopDropdown(true)}
            onMouseLeave={() => setShopDropdown(false)}
          >
            <Link
              href="/#browse"
              className={`nav-dropdown-link ${pathname.startsWith('/accessories') || pathname.startsWith('/games') ? 'active' : ''}`}
            >
              Shop <ChevronDown size={13} className="nav-chevron" />
            </Link>
            {shopDropdown && (
              <div className="nav-dropdown-menu">
                <Link href="/accessories" className="nav-dropdown-item" onClick={() => setShopDropdown(false)}>
                  <strong>ACCESSORIES VAULT</strong>
                  <span>Headsets, controllers &amp; setup gear</span>
                </Link>
                <Link href="/games" className="nav-dropdown-item" onClick={() => setShopDropdown(false)}>
                  <strong>PS5 GAMES VAULT</strong>
                  <span>Exclusives, GOTY hits &amp; pre-orders</span>
                </Link>
                <Link href="/#browse" className="nav-dropdown-item" onClick={() => setShopDropdown(false)}>
                  <strong>ALL HARDWARE DROPS</strong>
                  <span>Consoles &amp; full inventory</span>
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/accessories"
            className={`nav-link ${pathname.startsWith('/accessories') ? 'nav-link-active' : ''}`}
          >
            Accessories
          </Link>

          <Link
            href="/games"
            className={`nav-link ${pathname.startsWith('/games') ? 'nav-link-active' : ''}`}
          >
            Games
          </Link>

          <Link href="/#categories" className="nav-link">
            Categories
          </Link>

          <Link
            href="/top-up"
            className={`nav-link ${pathname.startsWith('/top-up') ? 'nav-link-active' : ''}`}
          >
            Top-up
          </Link>

          <Link
            href="/gift-cards"
            className={`nav-link ${pathname.startsWith('/gift-cards') ? 'nav-link-active' : ''}`}
          >
            Gift cards
          </Link>
        </nav>

        <div className="header-actions">
          {onMotionToggle && (
            <button
              type="button"
              className="header-icon-button motion-pill"
              onClick={onMotionToggle}
              aria-label={reducedMotion ? 'Enable motion' : 'Reduce motion'}
              data-testid="button-motion-toggle"
            >
              <Sparkles size={13} className="text-[#c084fc]" />
              <span className="hidden sm:inline text-xs font-semibold">{reducedMotion ? 'Still' : 'Motion'}</span>
            </button>
          )}

          <Link
            href="/#browse"
            className="header-icon-button"
            aria-label="Search products"
          >
            <Search size={16} />
          </Link>

          <button
            type="button"
            className="header-icon-button cart-pill-btn"
            onClick={() => setCartOpen(true)}
            aria-label={`Open shopping bag with ${cartCount} items`}
            data-testid="button-cart"
          >
            <ShoppingBag size={16} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          <button
            type="button"
            className="header-icon-button mobile-only"
            onClick={() => setMobileNav(!mobileNav)}
            aria-label="Toggle navigation menu"
          >
            {mobileNav ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileNav && (
        <div className="mobile-nav-menu">
          <Link href="/" onClick={() => setMobileNav(false)}>Home</Link>
          <Link href="/accessories" onClick={() => setMobileNav(false)}>Accessories</Link>
          <Link href="/games" onClick={() => setMobileNav(false)}>Games</Link>
          <Link href="/#categories" onClick={() => setMobileNav(false)}>Categories</Link>
          <Link href="/top-up" onClick={() => setMobileNav(false)}>Top-up</Link>
          <Link href="/gift-cards" onClick={() => setMobileNav(false)}>Gift cards</Link>
        </div>
      )}
    </header>
  );
}
