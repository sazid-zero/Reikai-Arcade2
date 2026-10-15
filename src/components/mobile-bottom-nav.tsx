'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/components/cart-context';
import { useMobileMenu } from '@/components/mobile-menu-context';
import {
  Home,
  Gift,
  ShoppingBag,
  Package,
  Menu,
  X,
} from 'lucide-react';

export function MobileBottomNav({
  onHomeClick,
}: {
  onHomeClick?: () => void;
}) {
  const pathname = usePathname();
  const { cartCount, setCartOpen, cartOpen } = useCart();
  const { isOpen, toggleMenu, closeMenu } = useMobileMenu();

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

  const handleCartClick = () => {
    closeMenu();
    setCartOpen(true);
  };

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      {/* 1. Home */}
      <Link
        href="/"
        onClick={handleHomeClick}
        className={`mobile-bottom-nav__item${isHome && !isOpen ? ' active' : ''}`}
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

      {/* 3. Cart Page */}
      <Link
        href="/cart"
        onClick={() => closeMenu()}
        className={`mobile-bottom-nav__item${pathname === '/cart' ? ' active' : ''}`}
        aria-label={`Cart with ${cartCount} items`}
        data-testid="bottom-nav-cart"
      >
        <span className="mobile-bottom-nav__icon">
          <ShoppingBag size={19} />
          {cartCount > 0 && (
            <span className="mobile-bottom-nav__badge">{cartCount}</span>
          )}
        </span>
        <span className="mobile-bottom-nav__label">Cart</span>
      </Link>

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

      {/* 5. Menu */}
      <button
        type="button"
        onClick={toggleMenu}
        className={`mobile-bottom-nav__item${isOpen ? ' active' : ''}`}
        aria-label="Toggle navigation menu"
        data-testid="bottom-nav-menu"
      >
        <span className="mobile-bottom-nav__icon">
          {isOpen ? <X size={19} /> : <Menu size={19} />}
        </span>
        <span className="mobile-bottom-nav__label">Menu</span>
      </button>
    </nav>
  );
}
