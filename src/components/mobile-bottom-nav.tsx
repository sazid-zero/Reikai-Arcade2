'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/components/cart-context';
import { useSearch } from '@/components/search-modal';
import {
  Gamepad2,
  Gem,
  Headphones,
  Heart,
  Home,
  Menu,
  Search,
  ShoppingBag,
  Sparkles,
  User,
  X,
  Zap,
  Crown,
  Layers,
} from 'lucide-react';
import { UserAuthButton } from '@/components/user-auth-button';

export function MobileBottomNav({
  onHomeClick,
}: {
  onHomeClick?: () => void;
}) {
  const pathname = usePathname();
  const { cartCount, setCartOpen } = useCart();
  const { openSearch } = useSearch();
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = pathname === '/';
  const isGames = pathname.startsWith('/games');

  const handleHome = () => {
    setMenuOpen(false);
    if (isHome && onHomeClick) {
      onHomeClick();
    } else if (isHome) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearch = () => {
    setMenuOpen(false);
    openSearch();
  };

  const handleCart = () => {
    setMenuOpen(false);
    setCartOpen(true);
  };

  return (
    <>
      {/* Slide-up sheet for 'More' */}
      {menuOpen && (
        <>
          <div
            className="mobile-menu-overlay"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="mobile-menu-sheet" role="dialog" aria-label="Navigation menu">
            <div className="mobile-menu-handle" />

            <button
              type="button"
              className="mobile-nav-search-btn mb-4 w-full"
              onClick={() => {
                setMenuOpen(false);
                openSearch();
              }}
              data-testid="sheet-search-btn"
            >
              <Search size={16} className="text-[#00f0ff]" />
              <span>Search games, gear &amp; codes...</span>
              <span className="mobile-search-pill">Find</span>
            </button>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold block mb-2 px-3">
                Categories
              </span>

              <Link
                href="/games"
                className="mobile-menu-sheet__link"
                onClick={() => setMenuOpen(false)}
                data-testid="link-sheet-games"
              >
                <span className="mobile-menu-sheet__link-icon text-purple-400">
                  <Gamepad2 size={18} />
                </span>
                <span>PS5 Games</span>
              </Link>

              <Link
                href="/top-up"
                className="mobile-menu-sheet__link"
                onClick={() => setMenuOpen(false)}
                data-testid="link-sheet-top-up"
              >
                <span className="mobile-menu-sheet__link-icon text-[#00f0ff]">
                  <Zap size={18} />
                </span>
                <span>Game Top-Up</span>
              </Link>

              <Link
                href="/accessories"
                className="mobile-menu-sheet__link"
                onClick={() => setMenuOpen(false)}
                data-testid="link-sheet-accessories"
              >
                <span className="mobile-menu-sheet__link-icon text-pink-400">
                  <Headphones size={18} />
                </span>
                <span>Accessories &amp; Hardware</span>
              </Link>

              <Link
                href="/subscriptions"
                className="mobile-menu-sheet__link"
                onClick={() => setMenuOpen(false)}
                data-testid="link-sheet-subscriptions"
              >
                <span className="mobile-menu-sheet__link-icon text-violet-400">
                  <Crown size={18} />
                </span>
                <span>Gaming Subscriptions</span>
              </Link>

              <Link
                href="/gift-cards"
                className="mobile-menu-sheet__link"
                onClick={() => setMenuOpen(false)}
                data-testid="link-sheet-gift-cards"
              >
                <span className="mobile-menu-sheet__link-icon text-amber-400">
                  <Gem size={18} />
                </span>
                <span>Digital Gift Cards</span>
              </Link>
            </div>

            <div className="mobile-menu-sheet__divider my-3" />

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold block mb-2 px-3">
                Saved &amp; Account
              </span>

              <Link
                href="/wishlist"
                className="mobile-menu-sheet__link"
                onClick={() => setMenuOpen(false)}
                data-testid="link-sheet-wishlist"
              >
                <span className="mobile-menu-sheet__link-icon text-pink-400">
                  <Heart size={18} />
                </span>
                <span>My Wishlist</span>
              </Link>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between px-2">
              <span className="text-xs text-zinc-400 font-mono">Account</span>
              <UserAuthButton />
            </div>
          </div>
        </>
      )}

      {/* Fixed bottom navigation bar */}
      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        {isHome ? (
          <button
            type="button"
            onClick={handleHome}
            className={`mobile-bottom-nav__item active`}
            aria-label="Home"
            data-testid="bottom-nav-home"
          >
            <span className="mobile-bottom-nav__icon">
              <Gamepad2 size={20} />
            </span>
            <span className="mobile-bottom-nav__label">Home</span>
          </button>
        ) : (
          <Link
            href="/"
            onClick={handleHome}
            className={`mobile-bottom-nav__item`}
            aria-label="Home"
            data-testid="bottom-nav-home"
          >
            <span className="mobile-bottom-nav__icon">
              <Gamepad2 size={20} />
            </span>
            <span className="mobile-bottom-nav__label">Home</span>
          </Link>
        )}

        <button
          type="button"
          onClick={handleSearch}
          className="mobile-bottom-nav__item"
          aria-label="Search"
          data-testid="bottom-nav-search"
        >
          <span className="mobile-bottom-nav__icon">
            <Search size={20} />
          </span>
          <span className="mobile-bottom-nav__label">Search</span>
        </button>

        <Link
          href="/games"
          onClick={() => setMenuOpen(false)}
          className={`mobile-bottom-nav__item${isGames ? ' active' : ''}`}
          aria-label="Games"
          data-testid="bottom-nav-games"
        >
          <span className="mobile-bottom-nav__icon">
            <Sparkles size={20} />
          </span>
          <span className="mobile-bottom-nav__label">Games</span>
        </Link>

        <button
          type="button"
          onClick={handleCart}
          className="mobile-bottom-nav__item"
          aria-label={`Cart with ${cartCount} items`}
          data-testid="bottom-nav-cart"
        >
          <span className="mobile-bottom-nav__icon">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="mobile-bottom-nav__badge">{cartCount}</span>
            )}
          </span>
          <span className="mobile-bottom-nav__label">Cart</span>
        </button>

        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className={`mobile-bottom-nav__item${menuOpen ? ' active' : ''}`}
          aria-label="More options"
          data-testid="bottom-nav-more"
        >
          <span className="mobile-bottom-nav__icon">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </span>
          <span className="mobile-bottom-nav__label">More</span>
        </button>
      </nav>
    </>
  );
}
