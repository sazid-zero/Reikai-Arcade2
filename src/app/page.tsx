'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import useScrollAnimations from '@/hooks/use-scroll-animations';
import { useLenis } from '@/components/lenis-provider';
import { useCart } from '@/components/cart-context';
import {
  ArrowDownRight,
  ArrowRight,
  ChevronDown,
  Gamepad2,
  Gem,
  Globe,
  Menu,
  Minus,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import type { Product } from '@/lib/products';
import { ProductCard as StandardProductCard } from '@/components/product-card';
import { useSearch } from '@/components/search-modal';

type StagePose = {
  x: number;
  scale: number;
  theta: number;
  phi: number;
  radius: number;
  roll?: number;
};

// ── Section poses ────────────────────────────────────────────────────────────
// Scale/radius control apparent size: higher scale + lower radius = bigger model.
// Theta accumulates +360° per transition = guaranteed full-spin between every section.
// Effective view angle = theta % 360:
//   180° = front face (top-down look),  90° = left side,  270° = right side,  0° = back
const heroPose: StagePose = { x: 0, scale: 1.05, theta: 184, phi: 43, radius: 1.95, roll: -7 }; // Asymmetrical tilt: left corner up, right corner down

const products: Product[] = [
  // ── GAMES ──────────────────────────────────
  {
    id: 'astro-bot',
    name: 'Astro Bot / PS5',
    type: 'games',
    category: 'games',
    subCategory: 'Platformer',
    label: 'PS5 Exclusive',
    price: 5999,
    glyph: 'ASTRO',
    wash: 'hsl(272 90% 68% / .32)',
    badge: 'GOTY WINNER',
    spec: 'Haptic Enhanced · 4K 60',
    coverImage: '/covers/astro-bot.jpg',
    rating: 4.98,
    reviewsCount: 4150,
    inStock: true,
    shortDesc: 'Join ASTRO in a monumental PS5 space adventure across 50+ diverse planets.',
    fullDesc: 'Join ASTRO in a supersized space adventure! When the PS5 mothership is attacked by an alien nemesis, ASTRO needs your help to rescue his crew and repair the ship.',
    features: ['Dynamic Haptic Feedback', 'Adaptive Triggers', '4K 60FPS Fidelity'],
    specs: [{ label: 'Platform', value: 'PS5 Exclusive' }],
  },
  {
    id: 'dualsense-edge',
    name: 'DualSense Edge™ Wireless Controller',
    type: 'gear',
    category: 'accessories',
    subCategory: 'Controllers',
    label: 'Pro Controller',
    price: 24999,
    glyph: 'EDGE',
    wash: 'hsl(285 85% 72% / .32)',
    badge: 'PRO HARDWARE',
    spec: 'Swappable Stick Modules · Back Paddles',
    coverImage: '/accessories/dualsense-edge.jpg',
    rating: 4.95,
    reviewsCount: 2450,
    inStock: true,
    shortDesc: 'Ultra-customizable pro controller built for high performance with back buttons and replaceable stick modules.',
    fullDesc: 'Gain an edge in gameplay by crafting your own custom controls to fit your playstyle.',
    features: ['Remappable Back Buttons', 'Adjustable Triggers', 'Replaceable Stick Modules'],
    specs: [{ label: 'Weight', value: '325g' }],
  },
  {
    id: 'elden-ring',
    name: 'Elden Ring Shadow of the Erdtree',
    type: 'games',
    category: 'games',
    subCategory: 'Action RPG',
    label: 'Action RPG',
    price: 4999,
    glyph: 'ER',
    wash: 'hsl(270 50% 55% / .32)',
    badge: 'SHADOW DLC',
    spec: 'Action RPG of the Year',
    coverImage: '/covers/elden-ring.jpg',
    rating: 4.96,
    reviewsCount: 8920,
    inStock: true,
    shortDesc: 'Journey deeper into the Lands Between with Miquella in the acclaimed expansion.',
    fullDesc: 'Guided by Empyrean Miquella, players are summoned to the Land of Shadow to uncover dark secrets.',
    features: ['Shadow of the Erdtree DLC Included', '100+ New Weapons', '4K Ray Tracing'],
    specs: [{ label: 'Platform', value: 'PC & PS5' }],
  },
  {
    id: 'pulse-elite',
    name: 'PULSE Elite™ Wireless Headset',
    type: 'gear',
    category: 'accessories',
    subCategory: 'Audio & Headsets',
    label: 'Planar Magnetic',
    price: 18999,
    glyph: 'ELITE',
    wash: 'hsl(272 90% 68% / .32)',
    badge: 'LOSSLESS AUDIO',
    spec: 'Planar Magnetic Drivers · Retractable Mic',
    coverImage: '/accessories/pulse-elite.jpg',
    rating: 4.92,
    reviewsCount: 1280,
    inStock: true,
    shortDesc: 'Studio-inspired planar magnetic drivers deliver acoustic soundscapes with ultra-low latency wireless.',
    fullDesc: 'Experience extraordinarily lifelike audio in your favorite games with planar magnetic drivers and PlayStation Link wireless.',
    features: ['Planar Magnetic Drivers', 'PlayStation Link Lossless Audio', 'AI Noise Rejection Mic'],
    specs: [{ label: 'Battery', value: 'Up to 30 Hours' }],
  },
  {
    id: 'ps5-slim',
    name: 'PlayStation® 5 Slim / Disc Edition',
    type: 'consoles',
    category: 'consoles',
    subCategory: 'Consoles',
    label: 'Next-Gen Console',
    price: 54999,
    glyph: 'PS5',
    wash: 'hsl(260 70% 65% / .26)',
    badge: '1TB HIGH-SPEED',
    spec: 'Ultra-HD Disc · Ray Tracing · 4K 120Hz',
    coverImage: '/covers/ps5-slim.jpg',
    rating: 4.96,
    reviewsCount: 7800,
    inStock: true,
    shortDesc: 'The PS5 Slim packs powerful gaming technology inside a sleek, compact console with 1TB SSD.',
    fullDesc: 'Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with haptic feedback, and an all-new generation of incredible PlayStation games.',
    features: ['1TB Integrated Ultra-Fast SSD', 'Ultra HD Blu-ray Disc Drive', 'Ray Tracing & 4K 120Hz'],
    specs: [{ label: 'Storage', value: '1TB Custom NVMe SSD' }],
  },
  {
    id: 'spider-man',
    name: "Marvel's Spider-Man 2",
    type: 'games',
    category: 'games',
    subCategory: 'Action Adventure',
    label: 'PS5 Exclusive',
    price: 54999,
    glyph: 'SM2',
    wash: 'hsl(275 92% 70% / .32)',
    badge: 'EXCLUSIVE',
    spec: 'Near-Instant Fast Travel · 3D Audio',
    coverImage: '/covers/spider-man.jpg',
    rating: 4.91,
    reviewsCount: 6240,
    inStock: true,
    shortDesc: 'Peter Parker and Miles Morales return for an exciting new chapter in Marvel’s New York.',
    fullDesc: 'Nine months after Marvel’s Spider-Man: Miles Morales, Peter Parker and Miles Morales struggle with balancing their personal lives and super hero responsibilities.',
    features: ['Fast Travel via Ultra SSD', 'Symbiote Abilities', 'Tempest 3D Audio'],
    specs: [{ label: 'Platform', value: 'PS5 Exclusive' }],
  },
  {
    id: 'dualsense-cosmic',
    name: 'DualSense® Controller - Galactic Purple',
    type: 'gear',
    category: 'accessories',
    subCategory: 'Controllers',
    label: 'Wireless Controller',
    price: 8499,
    glyph: 'DS-P',
    wash: 'hsl(285 85% 72% / .3)',
    badge: 'HAPTIC CORE',
    spec: 'Haptic Feedback · Dynamic Triggers',
    coverImage: '/accessories/dualsense-cosmic.jpg',
    rating: 4.9,
    reviewsCount: 3820,
    inStock: true,
    shortDesc: 'Discover a deeper gaming experience with tactile feedback and dynamic adaptive triggers in Galactic Purple.',
    fullDesc: 'The DualSense wireless controller for PS5 offers immersive haptic feedback and dynamic triggers integrated into an iconic design.',
    features: ['Dual Voice-Coil Haptics', 'Adaptive Triggers', 'Built-in Microphone'],
    specs: [{ label: 'Connectivity', value: 'Bluetooth 5.1' }],
  },
  {
    id: 'wallet-50',
    name: 'PlayStation® Store Wallet / $50 Card',
    type: 'top-ups',
    category: 'top-ups',
    subCategory: 'Digital Top-ups',
    label: 'Digital top-up',
    price: 5900,
    glyph: '$50',
    wash: 'hsl(290 85% 65% / .3)',
    badge: 'INSTANT CODE',
    spec: 'Encrypted Digital Key · Instant Delivery',
    coverImage: '/covers/wallet-50.jpg',
    rating: 4.99,
    reviewsCount: 5200,
    inStock: true,
    shortDesc: 'Instant PSN wallet digital code for games, add-ons, subscriptions, and movies.',
    fullDesc: 'Add funds to your PlayStation Network wallet without needing a credit card. Redeem for anything on the PlayStation Store.',
    features: ['Instant Digital Delivery', 'No Expiration Date', 'Redeemable on PS5, PS4, Web'],
    specs: [{ label: 'Region', value: 'Global / US PSN' }],
  },
  {
    id: 'wukong',
    name: 'Black Myth: Wukong',
    type: 'games',
    category: 'games',
    subCategory: 'Action RPG',
    label: 'Action RPG',
    price: 3599,
    glyph: 'BMW',
    wash: 'hsl(35 70% 50% / .3)',
    badge: 'BESTSELLER',
    spec: 'Unreal Engine 5 · Path Tracing',
    coverImage: '/covers/wukong.jpg',
    rating: 4.91,
    reviewsCount: 14200,
    inStock: true,
    shortDesc: 'Embark as the Destined One through Chinese mythology to uncover an ancient truth.',
    fullDesc: 'Black Myth: Wukong is an action RPG rooted in Chinese mythology featuring fluid combat and mythical transformations.',
    features: ['Staff Combat System', 'Unreal Engine 5 Full Path Tracing', 'Dozens of Mythical Bosses'],
    specs: [{ label: 'Platform', value: 'PC & PS5' }],
  },
  {
    id: 'charging-station',
    name: 'DualSense® Charging Station',
    type: 'gear',
    category: 'accessories',
    subCategory: 'Charging & Docks',
    label: 'Setup Gear',
    price: 3499,
    glyph: 'CHG',
    wash: 'hsl(240 65% 75% / .28)',
    badge: 'CLICK-IN DOCK',
    spec: 'Dual Fast-Charge Hub · USB-C Stand',
    coverImage: '/accessories/charging-station.jpg',
    rating: 4.93,
    reviewsCount: 1840,
    inStock: true,
    shortDesc: 'Dock and charge two DualSense controllers simultaneously without using console USB ports.',
    fullDesc: 'Click-in charging station charges up to two controllers as quickly as when connected directly to your PS5 console.',
    features: ['Click-in Design', 'Frees Up Console USB Ports', 'Dual Fast Charge'],
    specs: [{ label: 'Capacity', value: '2 Controllers' }],
  },
  {
    id: 'ps5-digital',
    name: 'PlayStation® 5 Slim / Digital Edition',
    type: 'consoles',
    category: 'consoles',
    subCategory: 'Consoles',
    label: 'Digital Console',
    price: 48999,
    glyph: 'PS5-D',
    wash: 'hsl(270 75% 65% / .26)',
    badge: 'ALL-DIGITAL',
    spec: '1TB NVMe SSD · Ray Tracing · Tempest 3D',
    coverImage: '/covers/ps5-slim.jpg',
    rating: 4.93,
    reviewsCount: 5120,
    inStock: true,
    shortDesc: 'All-digital PS5 Slim edition for lightning fast downloads and disc-free next-gen gaming.',
    fullDesc: 'Sign in to your account for PlayStation Network and go to PlayStation Store to buy and download games without discs.',
    features: ['Disc-Free Slim Profile', '1TB Ultra-Fast SSD', 'Full Backward Compatibility'],
    specs: [{ label: 'Storage', value: '1TB NVMe SSD' }],
  },
  {
    id: 'wallet-100',
    name: 'PlayStation® Store Wallet / $100 Card',
    type: 'top-ups',
    category: 'top-ups',
    subCategory: 'Digital Top-ups',
    label: 'Digital top-up',
    price: 11800,
    glyph: '$100',
    wash: 'hsl(290 85% 65% / .3)',
    badge: 'BEST VALUE',
    spec: 'Encrypted Digital Key · Instant Delivery',
    coverImage: '/covers/wallet-50.jpg',
    rating: 4.99,
    reviewsCount: 3950,
    inStock: true,
    shortDesc: 'Maximum value PSN wallet digital code delivered instantly to your inbox or account.',
    fullDesc: 'Top up your account with $100 store credit. Great for pre-ordering upcoming AAA releases and yearly PS Plus subscriptions.',
    features: ['Instant Digital Delivery', 'Safe & Encrypted Code', 'Use for Games & DLC'],
    specs: [{ label: 'Region', value: 'Global / US PSN' }],
  },
];

const filterLabels: { id: 'all' | Product['type']; label: string }[] = [
  { id: 'all', label: 'All drops' },
  { id: 'consoles', label: 'Consoles' },
  { id: 'games', label: 'Games' },
  { id: 'gear', label: 'Gear' },
  { id: 'top-ups', label: 'Top-ups' },
];

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true }) ||
      canvas.getContext('webgl', { failIfMajorPerformanceCaveat: true }) ||
      canvas.getContext('experimental-webgl', { failIfMajorPerformanceCaveat: true }),
    );
  } catch {
    return false;
  }
}

function scrollToId(id: string, lenis?: ReturnType<typeof useLenis>) {
  if (lenis) {
    lenis.scrollTo(`#${id}`, { duration: 1.4, offset: -80 });
  } else {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function ModelStage({
  orbit,
  modelScale,
  parallax,
  stageX,
  roll,
  reducedMotion,
  opacity = 1,
}: {
  orbit: string;
  modelScale: number;
  parallax: number;
  stageX: number;
  roll: number;
  reducedMotion: boolean;
  opacity?: number;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const modelRef = useRef<HTMLElement | null>(null);

  // Effect 1: detect WebGL support only — no DOM interaction here.
  // Splitting from the mount effect is critical: this sets webglSupported=true which
  // triggers a re-render that puts the model-host div in the DOM. The second effect
  // then runs after that re-render, so hostRef.current is guaranteed to be non-null.
  useEffect(() => {
    const supported = supportsWebGL();
    setWebglSupported(supported);
    if (!supported) setReady(true);
  }, []);

  // Effect 2: mount model-viewer — only runs when webglSupported is true, which means
  // the model-host div is already rendered and hostRef.current is populated.
  // This fixes the "model missing after client-side navigation" bug where
  // customElements.get('model-viewer') returned immediately (no async delay),
  // causing mount() to run before the host div existed in the DOM.
  useEffect(() => {
    if (!webglSupported) return;

    let active = true;
    const mount = () => {
      if (!active || !hostRef.current || modelRef.current) return;
      try {
        const model = document.createElement('model-viewer');
        model.setAttribute('src', '/ps5.glb');
        model.setAttribute('alt', 'A white PlayStation 5 DualSense controller facing forward');
        model.setAttribute('camera-controls', '');
        model.setAttribute('disable-zoom', '');
        model.setAttribute('interaction-prompt', 'none');
        model.setAttribute('shadow-intensity', '1.1');
        model.setAttribute('exposure', '1.05');
        model.setAttribute('camera-orbit', orbit);
        model.setAttribute('interpolation-decay', '0');
        model.addEventListener('load', () => active && setReady(true));
        model.addEventListener('error', () => active && setFailed(true));
        hostRef.current.appendChild(model);
        modelRef.current = model;
      } catch {
        if (active) setFailed(true);
      }
    };

    const existing = customElements.get('model-viewer');
    if (existing) {
      // Custom element already registered (e.g. returning from another page):
      // mount() is safe to call immediately because this effect runs after the
      // re-render triggered by webglSupported=true, so hostRef.current is set.
      mount();
    } else {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://unpkg.com/@google/model-viewer@3.5.0/dist/model-viewer.min.js';
      script.onload = mount;
      script.onerror = () => active && setFailed(true);
      document.head.appendChild(script);
    }
    return () => {
      active = false;
      modelRef.current?.remove();
      modelRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webglSupported]); // intentionally omit `orbit` — camera-orbit updates are handled below

  useEffect(() => {
    if (modelRef.current) modelRef.current.setAttribute('camera-orbit', orbit);
  }, [orbit]);

  const dockStyle = {
    '--parallax': `${reducedMotion ? 0 : parallax}px`,
    '--model-scale': `${modelScale}`,
    '--stage-x': `${stageX}vw`,
    '--model-roll': `${reducedMotion ? 0 : roll}deg`,
    opacity,
    pointerEvents: opacity < 0.05 ? 'none' : undefined,
    visibility: opacity < 0.01 ? 'hidden' : 'visible',
    transition: 'opacity 0.25s ease-out, transform 0.45s ease-out',
  } as CSSProperties;

  return (
    <div className="model-dock" style={dockStyle} aria-label="Interactive PS5 controller model">
      {webglSupported && (
        <div
          ref={hostRef}
          className="model-host"
          style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1 }}
        />
      )}

    </div>
  );
}

function Header({
  cartCount,
  onCart,
}: {
  cartCount: number;
  onCart: () => void;
}) {
  const [mobileNav, setMobileNav] = useState(false);
  const { openSearch } = useSearch();

  return (
    <header className="site-header">
      <div className="header-inner">
        <button
          type="button"
          className="wordmark border-0 bg-transparent p-0 cursor-pointer flex items-center gap-2.5"
          onClick={() => scrollToId('top')}
          data-testid="button-home"
        >
          <Gamepad2 size={24} className="text-[#a855f7]" />
          <span className="wordmark-text">
            REIKAI <span className="wordmark-highlight">ARCADE</span>
          </span>
        </button>
        <nav className="header-nav" aria-label="Main navigation">
          <Link href="/accessories" className="nav-dropdown-link" data-testid="link-accessories">
            Accessories
          </Link>
          <Link href="/games" className="nav-dropdown-link" data-testid="link-games">
            Games
          </Link>
          <a href="#categories" className="nav-dropdown-link" data-testid="link-categories">
            Categories
          </a>
          <Link href="/top-up" className="nav-dropdown-link" data-testid="link-top-up">
            Top-up
          </Link>
          <Link href="/gift-cards" className="nav-dropdown-link" data-testid="link-gift-cards">
            Gift cards
          </Link>
        </nav>
        <div className="header-actions">
          {/* Desktop Search Bar */}
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

          {/* Search icon button */}
          <button
            type="button"
            className="header-icon-button md:hidden"
            onClick={() => openSearch()}
            aria-label="Search products"
            data-testid="button-search"
          >
            <Search size={16} />
          </button>
          <button
            type="button"
            className="header-icon-button cart-pill-btn"
            onClick={onCart}
            aria-label={`Open cart with ${cartCount} items`}
            data-testid="button-open-cart"
          >
            <ShoppingBag size={16} />
            <span className="cart-count" data-testid="text-cart-count">{cartCount}</span>
          </button>
          <button
            type="button"
            className="header-icon-button mobile-only md:hidden"
            aria-label="Open navigation"
            onClick={() => setMobileNav((open) => !open)}
            data-testid="button-mobile-menu"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>
      {mobileNav && (
        <div className="absolute left-0 right-0 top-full border-b border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 md:hidden">
          <button
            type="button"
            className="mobile-nav-search-btn mb-3 w-full"
            onClick={() => {
              setMobileNav(false);
              openSearch();
            }}
            data-testid="mobile-menu-search"
          >
            <Search size={16} className="text-[#c084fc]" />
            <span>Search games, gear &amp; codes...</span>
            <span className="mobile-search-pill">Search</span>
          </button>
          <Link
            href="/accessories"
            onClick={() => setMobileNav(false)}
            className="block border-b border-[hsl(var(--border))] py-3 font-mono-ui text-xs uppercase tracking-[.12em]"
            data-testid="link-mobile-accessories"
          >
            Accessories Vault
          </Link>
          <Link
            href="/games"
            onClick={() => setMobileNav(false)}
            className="block border-b border-[hsl(var(--border))] py-3 font-mono-ui text-xs uppercase tracking-[.12em]"
            data-testid="link-mobile-games"
          >
            PS5 Games Catalog
          </Link>
          <a
            href="#categories"
            onClick={() => setMobileNav(false)}
            className="block border-b border-[hsl(var(--border))] py-3 font-mono-ui text-xs uppercase tracking-[.12em]"
            data-testid="link-mobile-categories"
          >
            Categories
          </a>
          <Link
            href="/top-up"
            onClick={() => setMobileNav(false)}
            className="block border-b border-[hsl(var(--border))] py-3 font-mono-ui text-xs uppercase tracking-[.12em]"
            data-testid="link-mobile-top-up"
          >
            Top-up
          </Link>
          <Link
            href="/gift-cards"
            onClick={() => setMobileNav(false)}
            className="block py-3 font-mono-ui text-xs uppercase tracking-[.12em]"
            data-testid="link-mobile-gift-cards"
          >
            Gift cards
          </Link>
        </div>
      )}
    </header>
  );
}

function MobileBottomNav({
  cartCount,
  onCart,
  onScrollTo,
}: {
  cartCount: number;
  onCart: () => void;
  onScrollTo: (id: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<'home' | 'search' | 'categories' | 'cart' | 'menu'>('home');
  const { openSearch } = useSearch();

  const handleHome = () => { setActive('home'); onScrollTo('top'); setMenuOpen(false); };
  const handleSearch = () => {
    setActive('search');
    setMenuOpen(false);
    openSearch();
  };
  const handleCategories = () => { setActive('categories'); onScrollTo('categories'); setMenuOpen(false); };
  const handleCart = () => { setActive('cart'); onCart(); setMenuOpen(false); };
  const handleMenuToggle = () => {
    setActive(menuOpen ? active : 'menu');
    setMenuOpen((o) => !o);
  };

  return (
    <>
      {/* Slide-up menu sheet */}
      {menuOpen && (
        <>
          <div className="mobile-menu-overlay" onClick={() => { setMenuOpen(false); setActive('home'); }} aria-hidden="true" />
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
              <Search size={16} className="text-[#c084fc]" />
              <span>Search the entire vault...</span>
              <span className="mobile-search-pill">Find</span>
            </button>
            <Link
              href="/accessories"
              className="mobile-menu-sheet__link"
              onClick={() => setMenuOpen(false)}
              data-testid="link-sheet-accessories"
            >
              <span className="mobile-menu-sheet__link-icon">
                <Gamepad2 size={18} />
              </span>
              Accessories Vault
            </Link>
            <Link
              href="/games"
              className="mobile-menu-sheet__link"
              onClick={() => setMenuOpen(false)}
              data-testid="link-sheet-games"
            >
              <span className="mobile-menu-sheet__link-icon">
                <Sparkles size={18} />
              </span>
              PS5 Games Catalog
            </Link>
            <div className="mobile-menu-sheet__divider" />
            <Link
              href="/top-up"
              className="mobile-menu-sheet__link"
              onClick={() => setMenuOpen(false)}
              data-testid="link-sheet-top-up"
            >
              <span className="mobile-menu-sheet__link-icon">
                <Zap size={18} />
              </span>
              Top-up
            </Link>
            <Link
              href="/gift-cards"
              className="mobile-menu-sheet__link"
              onClick={() => setMenuOpen(false)}
              data-testid="link-sheet-gift-cards"
            >
              <span className="mobile-menu-sheet__link-icon">
                <Gem size={18} />
              </span>
              Gift Cards
            </Link>
          </div>
        </>
      )}

      {/* Bottom nav bar */}
      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        {/* Home */}
        <button
          type="button"
          className={`mobile-bottom-nav__item${active === 'home' ? ' active' : ''}`}
          onClick={handleHome}
          aria-label="Go to top"
          data-testid="mobile-nav-home"
        >
          <span className="mobile-bottom-nav__icon">
            <Gamepad2 size={20} />
          </span>
          <span className="mobile-bottom-nav__label">Home</span>
        </button>

        {/* Search */}
        <button
          type="button"
          className={`mobile-bottom-nav__item${active === 'search' ? ' active' : ''}`}
          onClick={handleSearch}
          aria-label="Search products"
          data-testid="mobile-nav-browse"
        >
          <span className="mobile-bottom-nav__icon">
            <Search size={20} />
          </span>
          <span className="mobile-bottom-nav__label">Search</span>
        </button>

        {/* Categories */}
        <button
          type="button"
          className={`mobile-bottom-nav__item${active === 'categories' ? ' active' : ''}`}
          onClick={handleCategories}
          aria-label="View categories"
          data-testid="mobile-nav-categories"
        >
          <span className="mobile-bottom-nav__icon">
            <Globe size={20} />
          </span>
          <span className="mobile-bottom-nav__label">Categories</span>
        </button>

        {/* Cart */}
        <button
          type="button"
          className={`mobile-bottom-nav__item${active === 'cart' ? ' active' : ''}`}
          onClick={handleCart}
          aria-label={`Open cart, ${cartCount} items`}
          data-testid="mobile-nav-cart"
        >
          <span className="mobile-bottom-nav__icon">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="mobile-bottom-nav__badge">{cartCount}</span>
            )}
          </span>
          <span className="mobile-bottom-nav__label">Cart</span>
        </button>

        {/* More / Hamburger */}
        <button
          type="button"
          className={`mobile-bottom-nav__item${active === 'menu' ? ' active' : ''}`}
          onClick={handleMenuToggle}
          aria-label="More navigation options"
          aria-expanded={menuOpen}
          data-testid="mobile-nav-menu"
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


function ProductCard({ product, onAdd }: { product: Product; onAdd: (product: Product) => void }) {
  const detailHref =
    product.type === 'games'
      ? `/games/${product.id}`
      : product.type === 'gear'
      ? `/accessories/${product.id}`
      : null;

  return (
    <StandardProductCard product={product} href={detailHref ?? undefined} onAdd={onAdd} />
  );

  /* legacy card markup retained below for safe incremental migration */
  return (
    <article className="product-card" data-testid={`card-product-${product.id}`}>
      {detailHref ? (
        <Link href={detailHref ?? '/'} className="product-card-art-link">
          <div className="product-art" style={{ '--product-wash': product.wash } as CSSProperties}>
            {product.badge && (
              <span className="product-badge">
                <span className="product-badge-dot" />
                {product.badge}
              </span>
            )}
            <div className="product-glyph">
              <span>{product.glyph}</span>
            </div>
            <div className="product-hud-corner" aria-hidden="true" />
          </div>
        </Link>
      ) : (
        <div className="product-art" style={{ '--product-wash': product.wash } as CSSProperties}>
          {product.badge && (
            <span className="product-badge">
              <span className="product-badge-dot" />
              {product.badge}
            </span>
          )}
          <div className="product-glyph">
            <span>{product.glyph}</span>
          </div>
          <div className="product-hud-corner" aria-hidden="true" />
        </div>
      )}
      <div className="product-info">
        <div className="product-meta-row">
          <span className="product-type">{product.label}</span>
          {product.spec && <span className="product-spec">{product.spec}</span>}
        </div>
        {detailHref ? (
          <Link href={detailHref ?? '/'} className="product-name-link">
            <h3 className="product-name" data-testid={`text-product-${product.id}`}>{product.name}</h3>
          </Link>
        ) : (
          <h3 className="product-name" data-testid={`text-product-${product.id}`}>{product.name}</h3>
        )}
        <div className="product-bottom">
          <div className="product-price-col">
            <span className="product-price-label">PRICE</span>
            <span className="product-price">${product.price.toFixed(2)}</span>
          </div>
          <button
            type="button"
            className="add-button"
            onClick={() => onAdd(product)}
            aria-label={`Add ${product.name} to bag`}
            data-testid={`button-add-${product.id}`}
          >
            <Plus size={15} />
            <span className="add-button-text">ADD</span>
          </button>
        </div>
      </div>
    </article>
  );
}



function mapDbRowsToProducts(rows: any[]): Product[] {
  const map = new Map<string, any>()
  for (const r of rows) {
    if (!map.has(r.id)) {
      map.set(r.id, {
        id: r.slug,
        name: r.name,
        type: r.type === 'game' ? 'games' : 'gear',
        category: r.type === 'game' ? 'games' : 'accessories',
        subCategory: r.category || (r.type === 'game' ? 'PS5 Game' : 'Gear'),
        label: r.brand || (r.type === 'game' ? 'PS5 Game' : 'Gear'),
        price: (r.price ?? 0) / 100,
        glyph: (r.slug || r.name).slice(0, 4).toUpperCase(),
        wash: r.type === 'game' ? 'hsl(272 90% 68% / .32)' : 'hsl(285 85% 72% / .32)',
        badge: r.featured ? 'FEATURED DROP' : undefined,
        spec: r.platform || '',
        coverImage: r.imageUrl || (r.type === 'game' ? '/astro-bot.jpg' : '/dualsense-edge.jpg'),
        rating: r.rating || 4.9,
        reviewsCount: r.reviewCount || 100,
        inStock: (r.stockQuantity ?? 0) > 0,
        totalStock: r.stockQuantity ?? 0,
        shortDesc: r.shortDescription || '',
        fullDesc: r.description || '',
        features: Array.isArray(r.features) ? r.features : [],
        specs: r.specs && typeof r.specs === 'object'
          ? Object.entries(r.specs).map(([label, value]) => ({ label, value: String(value) }))
          : [],
      })
    } else {
      const existing = map.get(r.id)
      // Accumulate stock across all variants
      existing.totalStock += r.stockQuantity ?? 0
      existing.inStock = existing.totalStock > 0
      // Use lowest price variant
      if (r.price && (r.price / 100) < existing.price) {
        existing.price = r.price / 100
      }
    }
  }
  return Array.from(map.values())
}


export default function StorefrontPage() {
  const { addToCart, cartCount, setCartOpen } = useCart();
  const [liveProducts, setLiveProducts] = useState<Product[]>(products);
  const [filter, setFilter] = useState<'all' | Product['type']>('all');
  const [catalogSearch, setCatalogSearch] = useState('');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [stagePose, setStagePose] = useState<StagePose>(heroPose);
  const [modelOpacity, setModelOpacity] = useState(1);
  const [signalEmail, setSignalEmail] = useState('');
  const [signalSubscribed, setSignalSubscribed] = useState(false);
  const lenis = useLenis();
  useScrollAnimations(reducedMotion);

  useEffect(() => {
    fetch('/api/catalog')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = mapDbRowsToProducts(data);
          if (mapped.length > 0) {
            setLiveProducts(mapped);
          }
        }
      })
      .catch((err) => console.warn('Could not fetch live catalog:', err));
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(media.matches);
    const onPreference = () => setReducedMotion(media.matches);
    media.addEventListener('change', onPreference);

    const onScroll = () => {
      const scrollTop = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? Math.min(1, scrollTop / max) : 0);

      const isMobile = window.innerWidth <= 768;

      // Desktop poses (100% original):
      const desktopStops: { selector: string; pose: StagePose }[] = [
        { selector: '.hero',             pose: heroPose },
        { selector: '#categories',       pose: { x: -52, scale: 0.92, theta: 540,  phi: 52, radius: 2.45 } },
        { selector: '#browse',           pose: { x: 0,   scale: 1.15, theta: 900,  phi: 34, radius: 1.95 } },
        { selector: '.feature-section',  pose: { x: 38,  scale: 0.87, theta: 1170, phi: 68, radius: 2.52 } },
      ];

      // Mobile phone poses (Dynamic Floating Orbit):
      const mobileStops: { selector: string; pose: StagePose }[] = [
        { selector: '.hero',             pose: { x: 0,  scale: 0.88, theta: 184,  phi: 44, radius: 2.15, roll: -5 } },
        { selector: '#categories',       pose: { x: 14, scale: 0.68, theta: 544,  phi: 56, radius: 2.65, roll: -3 } },
        { selector: '#browse',           pose: { x: 0,  scale: 0.78, theta: 900,  phi: 36, radius: 2.30, roll: -6 } },
        { selector: '.feature-section',  pose: { x: 10, scale: 0.65, theta: 1170, phi: 66, radius: 2.70, roll: 0 } },
      ];

      const stops = isMobile ? mobileStops : desktopStops;
      const measured: { center: number; pose: StagePose }[] = [];
      for (const stop of stops) {
        const section = document.querySelector<HTMLElement>(stop.selector);
        if (section) {
          measured.push({
            center: scrollTop + section.getBoundingClientRect().top + section.offsetHeight / 2,
            pose: stop.pose,
          });
        }
      }
      if (measured.length === 0) return;

      const focusY = scrollTop + window.innerHeight * 0.52;
      let from = measured[0];
      let to = measured[0];
      const last = measured[measured.length - 1];
      if (focusY >= last.center) {
        from = last;
        to = last;
      } else {
        for (let index = 0; index < measured.length - 1; index += 1) {
          if (focusY <= measured[index + 1].center) {
            from = measured[index];
            to = measured[index + 1];
            break;
          }
        }
      }
      const distance = to.center - from.center;
      const amount = distance > 0 ? Math.max(0, Math.min(1, (focusY - from.center) / distance)) : 0;
      const eased = amount * amount * (3 - 2 * amount);
      const mix = (start: number, end: number) => start + (end - start) * eased;
      setStagePose({
        x: mix(from.pose.x, to.pose.x),
        scale: mix(from.pose.scale, to.pose.scale),
        theta: mix(from.pose.theta, to.pose.theta),
        phi: mix(from.pose.phi, to.pose.phi),
        radius: mix(from.pose.radius, to.pose.radius),
        roll: mix(from.pose.roll ?? 0, to.pose.roll ?? 0),
      });

      // Smoothly fade out model as user scrolls past the feature section towards CTA and footer
      let currentOpacity = 1;
      const featureSec = document.querySelector<HTMLElement>('.feature-section');
      if (featureSec) {
        const featureRect = featureSec.getBoundingClientRect();
        if (featureRect.bottom < window.innerHeight * 0.85) {
          const fadeRange = window.innerHeight * 0.55;
          const dist = (window.innerHeight * 0.85) - featureRect.bottom;
          currentOpacity = Math.max(0, Math.min(1, 1 - (dist / fadeRange)));
        }
      }
      setModelOpacity(currentOpacity);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();

    return () => {
      media.removeEventListener('change', onPreference);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const q = catalogSearch.trim().toLowerCase();
    return liveProducts.filter((product) => {
      const matchesCategory = filter === 'all' || product.type === filter;
      if (!matchesCategory) return false;
      if (!q) return true;
      const nameMatch = product.name.toLowerCase().includes(q);
      const labelMatch = (product.label || '').toLowerCase().includes(q);
      const subCatMatch = (product.subCategory || '').toLowerCase().includes(q);
      const descMatch = (product.shortDesc || '').toLowerCase().includes(q);
      const badgeMatch = (product.badge || '').toLowerCase().includes(q);
      const specMatch = (product.spec || '').toLowerCase().includes(q);
      return nameMatch || labelMatch || subCatMatch || descMatch || badgeMatch || specMatch;
    });
  }, [filter, liveProducts, catalogSearch]);

  const setCategory = (category: 'all' | Product['type']) => {
    setFilter(category);
    scrollToId('browse');
  };

  const orbit = reducedMotion
    ? '180deg 38deg 1.85m'
    : `${stagePose.theta.toFixed(1)}deg ${stagePose.phi.toFixed(1)}deg ${stagePose.radius.toFixed(2)}m`;
  const modelScale = reducedMotion ? 0.95 : stagePose.scale;
  const parallax = Math.sin(scrollProgress * Math.PI * 2) * 24;
  const stageX = reducedMotion ? 0 : stagePose.x;
  const stageRoll = reducedMotion ? 0 : (stagePose.roll ?? 0);

  return (
    <main className="site-shell noise" id="top" style={{ '--scroll-pct': `${(scrollProgress * 100).toFixed(1)}%` } as CSSProperties}>
      {/* Scroll progress indicator */}
      <div className="scroll-progress-bar" aria-hidden="true" />
      <Header cartCount={cartCount} onCart={() => setCartOpen(true)} />

      <ModelStage
        orbit={orbit}
        modelScale={modelScale}
        parallax={parallax}
        stageX={stageX}
        roll={stageRoll}
        reducedMotion={reducedMotion}
        opacity={modelOpacity}
      />

      <section className="hero" aria-labelledby="hero-title">
        {/* Fixed Hero Neon Orbital Ring & Accent - stays anchored in hero, does NOT move with model */}
        <div className="hero-orbital-stage" aria-hidden="true">
          <div className="hero-orbital-tag">REIKAI // ARCADE-01</div>
          <div className="hero-orbital-ring" />
        </div>

        <div className="hero-grid">
          {/* Vertical HUD accent line on the left */}
          <div className="hero-hud-rail" aria-hidden="true">
            <span className="hud-star">✦</span>
            <span className="hud-line" />
            <span className="hud-star">✦</span>
          </div>

          <div className="hero-copy" data-reveal-group>
            <div className="eyebrow hero-protocol-badge" data-reveal>
              <Sparkles size={11} className="text-[#d946ef]" />
              <span>REIKAI VOID PROTOCOL</span>
            </div>

            <h1 id="hero-title" className="hero-title-sculpt" data-reveal>
              <span className="title-play-row">PLAY</span>
              <span className="title-beyond-row">
                BEYOND.
                <span className="title-sparkle" aria-hidden="true">✦</span>
              </span>
            </h1>

            <div className="hero-subhead-tags" data-reveal>
              <span>GAMES</span>
              <span className="subhead-slash">//</span>
              <span>ACCESSORIES</span>
              <span className="subhead-slash">//</span>
              <span>TOP UPS</span>
            </div>

            <p className="hero-intro" data-reveal>
              Consoles, celestial drops, and the gear that turns a dark room into an obsidian sanctum. Reach beyond the void.
            </p>

            <div className="hero-ctas" data-reveal>
              <button
                type="button"
                className="button-primary hero-btn-drop"
                onClick={() => scrollToId('browse', lenis)}
                data-testid="button-shop-the-drop"
              >
                <ShoppingCart size={16} />
                <span>SHOP THE DROP</span>
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                className="button-quiet hero-btn-explore"
                onClick={() => scrollToId('categories', lenis)}
                data-testid="button-explore-categories"
              >
                <Globe size={16} />
                <span>EXPLORE THE WORLD</span>
              </button>
            </div>

            <div className="hero-features-bar" data-reveal>
              <div className="feature-item">
                <div className="feature-icon"><Gamepad2 size={24} /></div>
                <div className="feature-info">
                  <strong>GAMING GEAR</strong>
                  <span>Consoles &amp; Accessories</span>
                </div>
              </div>
              <div className="feature-sep" aria-hidden="true" />
              <div className="feature-item">
                <div className="feature-icon"><Gem size={24} /></div>
                <div className="feature-info">
                  <strong>GAME TOP UPS</strong>
                  <span>Fast &amp; Secure</span>
                </div>
              </div>
              <div className="feature-sep" aria-hidden="true" />
              <div className="feature-item">
                <div className="feature-icon"><ShieldCheck size={24} /></div>
                <div className="feature-info">
                  <strong>TRUSTED STORE</strong>
                  <span>Genuine Products</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-avatar-badge" aria-label="Brand seal">N</div>
      </section>

      <div className="marquee" aria-label="Store highlights">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <span key={copy}>
              REIKAI ARCADE / BEYOND THE VOID <i /> CELESTIAL DROPS / ZERO FRICTION <i /> PLAY BEYOND <i /> REIKAI ARCADE <i /> OBSIDIAN VAULT <i />
            </span>
          ))}
        </div>
      </div>

      <section className="section category-section" id="categories" aria-labelledby="categories-title">
        <div className="cat-split">
          {/* ── LEFT PANEL ── big cinematic image with overlay */}
          <div className="cat-panel-left" aria-hidden="true">
            <img src="/cat-panel-ps5.jpg" alt="PS5 console standing on cosmic terrain" className="cat-panel-img" />
            <div className="cat-panel-overlay" />
            <div className="cat-panel-hud">
              <div className="cat-panel-kicker">
                <span className="cat-hud-dot" />
                01 // PICK YOUR LANE
              </div>
              <div className="cat-panel-headline">
                PLAY<br />
                <span>YOUR WAY.</span>
              </div>
              <div className="cat-panel-tagline">THE ONLY RIGHT SETUP IS YOURS.</div>
            </div>
          </div>

          {/* ── RIGHT PANEL ── header + category rows */}
          <div className="cat-panel-right" data-reveal-group>
            <div className="cat-right-head" data-reveal>
              <div className="section-kicker">01 // Pick your lane</div>
              <h2 id="categories-title" className="cat-right-title">
                Find your<br /><span>next level.</span>
              </h2>
              <p className="cat-right-lead">
                The setup is personal. Start with the thing you cannot stop thinking about, then build out from there.
              </p>
            </div>

            <div className="cat-menu-list" data-reveal>
              {/* CONSOLES */}
              <button
                type="button"
                className="cat-menu-row"
                onClick={() => setCategory('consoles')}
                data-testid="button-category-consoles"
              >
                <span className="cat-menu-num">01</span>
                <div className="cat-menu-bar" />
                <div className="cat-menu-copy">
                  <strong>CONSOLES</strong>
                  <span>Play the latest. Official and genuine.</span>
                </div>
                <div className="cat-menu-thumb">
                  <img src="/cat-panel-left.jpg" alt="Consoles" />
                </div>
                <div className="cat-menu-arrow">
                  <ArrowDownRight size={18} />
                </div>
              </button>

              {/* GAMES */}
              <button
                type="button"
                className="cat-menu-row"
                onClick={() => setCategory('games')}
                data-testid="button-category-games"
              >
                <span className="cat-menu-num">02</span>
                <div className="cat-menu-bar" />
                <div className="cat-menu-copy">
                  <strong>GAMES</strong>
                  <span>Digital &amp; physical. New releases and classics.</span>
                </div>
                <div className="cat-menu-thumb">
                  <img src="/cat-thumb-games.jpg" alt="Games" />
                </div>
                <div className="cat-menu-arrow">
                  <ArrowDownRight size={18} />
                </div>
              </button>

              {/* SETUP GEAR */}
              <button
                type="button"
                className="cat-menu-row"
                onClick={() => setCategory('gear')}
                data-testid="button-category-gear"
              >
                <span className="cat-menu-num">03</span>
                <div className="cat-menu-bar" />
                <div className="cat-menu-copy">
                  <strong>SETUP GEAR</strong>
                  <span>Controllers, headsets, keyboards and more.</span>
                </div>
                <div className="cat-menu-thumb">
                  <img src="/cat-thumb-gear.jpg" alt="Setup Gear" />
                </div>
                <div className="cat-menu-arrow">
                  <ArrowDownRight size={18} />
                </div>
              </button>

              {/* DIGITAL TOP-UPS */}
              <button
                type="button"
                className="cat-menu-row"
                onClick={() => setCategory('top-ups')}
                data-testid="button-category-topups"
              >
                <span className="cat-menu-num">04</span>
                <div className="cat-menu-bar" />
                <div className="cat-menu-copy">
                  <strong>DIGITAL TOP-UPS</strong>
                  <span>Fast, secure, and reliable.</span>
                </div>
                <div className="cat-menu-thumb">
                  <img src="/cat-thumb-topups.jpg" alt="Digital Top-Ups" />
                </div>
                <div className="cat-menu-arrow">
                  <ArrowDownRight size={18} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>


      <section className="section browse-section" id="browse" aria-labelledby="browse-title">
        <div className="browse-bg-layer" aria-hidden="true" />
        <div className="section-inner browse-section-inner">
          <div className="browse-head" data-reveal-group>
            <div>
              <div className="section-kicker">02 / The current drop</div>
              <h2 className="section-title" id="browse-title" data-reveal>Good stuff. <span>Right now.</span></h2>
            </div>
            <div className="browse-controls-row" data-reveal>
              <div className="filter-bar" role="group" aria-label="Filter products">
                {filterLabels.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    className={`filter-button ${filter === item.id ? 'active' : ''}`}
                    onClick={() => setFilter(item.id)}
                    data-testid={`button-filter-${item.id}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="catalog-search-sort">
                <div className="catalog-search-wrap">
                  <Search size={14} className="catalog-search-icon" />
                  <input
                    type="text"
                    placeholder="Search current drop..."
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    className="catalog-search-input"
                    aria-label="Filter products in current drop"
                    data-testid="input-catalog-search"
                  />
                  {catalogSearch && (
                    <button
                      type="button"
                      onClick={() => setCatalogSearch('')}
                      className="catalog-search-clear-btn"
                      aria-label="Clear filter search"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="product-grid" data-testid="grid-products">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAdd={addToCart} />
              ))
            ) : (
              <div className="catalog-empty-wrap">
                <Search size={32} className="text-[#a855f7] opacity-60 mb-2" />
                <h3 className="text-lg font-bold">No products match &ldquo;{catalogSearch}&rdquo;</h3>
                <p className="text-sm text-white/50 mt-1 max-w-sm">
                  Try searching another keyword or reset the filter to view all available drops.
                </p>
                <button
                  type="button"
                  className="button-primary mt-4 text-xs py-2 px-5 inline-flex items-center gap-2"
                  onClick={() => {
                    setCatalogSearch('');
                    setFilter('all');
                  }}
                >
                  Reset Search &amp; Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section feature-section" aria-labelledby="feature-title">
        <div className="section-inner feature-layout">
          <div className="feature-copy" data-reveal-group>
            <div className="section-kicker">03 // The Void Edit</div>
            <h2 id="feature-title" data-reveal>Build your<br /><span>ideal setup.</span></h2>
            <p data-reveal>
              Choose the console, games, and accessories that make your setup feel right. Everything you need for better play, in one place.
            </p>
            <div className="feature-perks" data-reveal>
              <div className="feature-perk">
                <Zap size={15} className="feature-perk-icon" />
                <span>Zero-Latency RF Wireless Protocol</span>
              </div>
              <div className="feature-perk">
                <Sparkles size={15} className="feature-perk-icon" />
                <span>Spatial Acoustic Immersion Architecture</span>
              </div>
              <div className="feature-perk">
                <ShieldCheck size={15} className="feature-perk-icon" />
                <span>CNC Obsidian Finish with Cosmic Ambient Sync</span>
              </div>
            </div>
            <button
              type="button"
              className="button-primary"
              data-reveal
              onClick={() => setCategory('gear')}
              data-testid="button-build-setup"
            >
              Build the setup <ArrowRight size={16} />
            </button>
          </div>

          <div className="feature-stack" aria-label="Featured setup cards">
            {/* Card 1 */}
            <div className="feature-card feature-card-aurora" data-label="REIKAI / AURORA">
              <div className="feature-card-header">
                <span className="card-index">DROP 01 // FLAGSHIP SPEC</span>
                <span className="feature-card-status">LIVE VAULT</span>
              </div>
              <div className="feature-card-body">
                <h4 className="feature-card-title">AURORA SYNAPSE RIG</h4>
                <div className="feature-specs-grid">
                  <div className="spec-item">
                    <span className="spec-label">DISPLAY</span>
                    <span className="spec-val">240Hz OLED</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">RESPONSE</span>
                    <span className="spec-val">0.03ms</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">AUDIO</span>
                    <span className="spec-val">3D Spatial</span>
                  </div>
                </div>
              </div>
              <div className="feature-card-glow-rings" aria-hidden="true" />
            </div>

            {/* Card 2 */}
            <div className="feature-card feature-card-haptic" data-label="VOID / HAPTIC">
              <div className="feature-card-header">
                <span className="card-index">DROP 02 // TACTILE CORE</span>
                <span className="feature-card-status">DEPLOYED</span>
              </div>
              <div className="feature-card-body">
                <h4 className="feature-card-title">OBSIDIAN DUAL-CORE</h4>
                <div className="feature-specs-grid">
                  <div className="spec-item">
                    <span className="spec-label">HAPTICS</span>
                    <span className="spec-val">Dual Actuators</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">TRIGGERS</span>
                    <span className="spec-val">Adaptive Sync</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">FINISH</span>
                    <span className="spec-val">Anti-Slip Matte</span>
                  </div>
                </div>
              </div>
              <div className="feature-card-glow-rings" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      <section className="signal-section" id="signal" aria-labelledby="signal-title">
        <div className="signal-inner">
          {/* Left: headline + telemetry */}
          <div className="signal-left">
            <div className="section-kicker" style={{ color: 'rgba(192,132,252,0.85)', marginBottom: '16px' }}>
              04 // ReiKai Frequency
            </div>
<h2 className="signal-title" id="signal-title">
  Get drop alerts<br /><span>first.</span>
  </h2>
            <div className="signal-telemetry">
              <div className="telemetry-pill">
                <span className="telemetry-dot" />
                <span>FREQ 142.85 MHz</span>
              </div>
              <div className="telemetry-pill">
                <span>ENCRYPT: QUANTUM 256</span>
              </div>
              <div className="telemetry-pill">
                <span>2,490 OPERATORS ONLINE</span>
              </div>
            </div>
          </div>

          {/* Center: divider */}
          <div className="signal-divider" aria-hidden="true" />

          {/* Right: copy + transmitter form */}
          <div className="signal-cta-block">
            <p className="signal-copy">
              Join our mailing list for new product launches, restocks, deals, and gaming updates.
            </p>
            <form
              className="signal-form"
              onSubmit={(e) => {
                e.preventDefault();
                setSignalSubscribed(true);
              }}
            >
              {!signalSubscribed ? (
                <div className="signal-input-wrap">
                  <input
                    type="email"
                    required
                    placeholder="ENTER PILOT COMMS ID // EMAIL"
                    value={signalEmail}
                    onChange={(e) => setSignalEmail(e.target.value)}
                    className="signal-field"
                    aria-label="Email address for ReiKai Frequency"
                  />
                  <button type="submit" className="signal-submit-btn" data-testid="button-signal-submit">
                    <span>JOIN LIST</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              ) : (
                <div className="signal-success-msg">
                  <span className="signal-success-icon">✓</span>
                  <span>FREQUENCY LOCKED // ACCESS GRANTED TO VAULT DROPS</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand-col">
              <button
                type="button"
                className="wordmark border-0 bg-transparent p-0 cursor-pointer flex items-center gap-2.5"
                onClick={() => scrollToId('top')}
                data-testid="button-footer-home"
              >
                <Gamepad2 size={24} className="text-[#a855f7]" />
                <span className="wordmark-text">
                  REIKAI <span className="wordmark-highlight">ARCADE</span>
                </span>
              </button>
              <p className="footer-blurb">
                A celestial storefront for consoles, cosmic artifacts, and curated gear engineered for those who play beyond.
              </p>
              <div className="footer-status-pill">
                <span className="status-live-dot" />
                <span>ORBITAL SERVERS: 100% OPERATIONAL</span>
              </div>
            </div>
            <div className="footer-links">
              <div>
                <h3>Navigate</h3>
                <a href="#browse" data-testid="link-footer-shop">Shop</a>
                <a href="#categories" data-testid="link-footer-categories">Categories</a>
                <a href="#signal" data-testid="link-footer-signal">Signal</a>
              </div>
              <div>
                <h3>Hardware Vault</h3>
                <button type="button" className="footer-quick-filter" onClick={() => { setCategory('consoles'); scrollToId('browse'); }}>Consoles</button>
                <button type="button" className="footer-quick-filter" onClick={() => { setCategory('games'); scrollToId('browse'); }}>Games</button>
                <button type="button" className="footer-quick-filter" onClick={() => { setCategory('gear'); scrollToId('browse'); }}>Setup Gear</button>
              </div>
              <div>
                <h3>Protocol</h3>
                <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer" data-testid="link-footer-license">
                  Model license
                </a>
                <a href="#top" data-testid="link-footer-accessibility">Accessibility</a>
                <a href="#top" data-testid="link-footer-status">Store status</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2025 REIKAI ARCADE · VOID PROTOCOL · ALL RIGHTS RESERVED</span>
            <span className="footer-disclaimer">GENUINE SONY PLAYSTATION HARDWARE · SECURE END-TO-END TRANSACTIONS</span>
          </div>
        </div>
      </footer>

      {/* Mobile bottom nav – only renders at ≤768px via CSS */}
      <MobileBottomNav
        cartCount={cartCount}
        onCart={() => setCartOpen(true)}
        onScrollTo={(id) => scrollToId(id, lenis)}
      />
    </main>
  );
}
