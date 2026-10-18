'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/components/cart-context';
import { useMobileMenu } from '@/components/mobile-menu-context';
import { useSearch } from '@/components/search-modal';
import {
  Home,
  Gift,
  Search,
  Package,
  User,
} from 'lucide-react';
import { UserAuthButton } from '@/components/user-auth-button';

export function MobileBottomNav({
  onHomeClick,
}: {
  onHomeClick?: () => void;
}) {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const { closeMenu } = useMobileMenu();
  const { openSearch } = useSearch();

  const isHome = pathname === '/';
  const isOrders = pathname.startsWith('/orders');

  const handleHomeClick = (e: React.MouseEvent) => {
    closeMenu();
    if (isHome) {
      e.preventDefault();
      if (onHomeClick) {
        onHomeClick();
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleOffersClick = (e: React.MouseEvent) => {
    closeMenu();
    if (isHome) {
      const browseSection = document.getElementById('browse') || document.getElementById('categories');
      if (browseSection) {
        e.preventDefault();
        browseSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleSearchClick = (e: React.MouseEvent) => {
    e.preventDefault();
    closeMenu();
    openSearch();
  };

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      {/* 1. Home */}
      <Link
        href="/"
        onClick={handleHomeClick}
        className={`mobile-bottom-nav__item${isHome ? ' active' : ''}`}
        aria-label="Home"
        data-testid="bottom-nav-home"
      >
        <span className="mobile-bottom-nav__icon">
          <Home size={19} />
        </span>
        <span className="mobile-bottom-nav__label">Home</span>
      </Link>

      {/* 2. Offers */}
      <Link
        href="/#browse"
        onClick={handleOffersClick}
        className="mobile-bottom-nav__item"
        aria-label="Offers"
        data-testid="bottom-nav-offers"
      >
        <span className="mobile-bottom-nav__icon">
          <Gift size={19} />
        </span>
        <span className="mobile-bottom-nav__label">Offers</span>
      </Link>

      {/* 3. Search (replaces Cart — cart moved to top mobile header) */}
      <button
        type="button"
        onClick={handleSearchClick}
        className="mobile-bottom-nav__item"
        aria-label="Search"
        data-testid="bottom-nav-search"
      >
        <span className="mobile-bottom-nav__icon">
          <Search size={19} />
        </span>
        <span className="mobile-bottom-nav__label">Search</span>
      </button>

      {/* 4. Orders */}
      <Link
        href="/orders"
        onClick={() => closeMenu()}
        className={`mobile-bottom-nav__item${isOrders ? ' active' : ''}`}
        aria-label="Orders"
        data-testid="bottom-nav-orders"
      >
        <span className="mobile-bottom-nav__icon">
          <Package size={19} />
        </span>
        <span className="mobile-bottom-nav__label">Orders</span>
      </Link>

      {/* 5. Profile — replaces Menu (menu moved to top mobile header) */}
      <div className="mobile-bottom-nav__item mobile-bottom-nav__profile" data-testid="bottom-nav-profile">
        <span className="mobile-bottom-nav__icon">
          <UserAuthButton compact />
        </span>
        <span className="mobile-bottom-nav__label">Account</span>
      </div>
    </nav>
  );
}
