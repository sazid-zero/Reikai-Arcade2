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
  ChevronRight,
  CreditCard,
  Crown,
  Gamepad2,
  Gem,
  Gift,
  Globe,
  Headphones,
  Heart,
  Layers,
  Lock,
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
import { normalizeProductImageUrl } from '@/lib/utils';
import { TutorialVideoPlayer } from '@/components/tutorial-video-player';
import { UserAuthButton } from '@/components/user-auth-button';
import { MobileBottomNav } from '@/components/mobile-bottom-nav';
import { MobileRightSidebar } from '@/components/mobile-right-sidebar';
import { useMobileMenu } from '@/components/mobile-menu-context';


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
    subCategory: 'Gift Cards',
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
  {
    id: 'ps-plus-deluxe',
    name: 'PlayStation® Plus Deluxe – 12 Month',
    type: 'top-ups',
    category: 'top-ups',
    subCategory: 'Subscriptions',
    label: 'Annual Subscription',
    price: 13500,
    glyph: 'PS+',
    wash: 'hsl(260 90% 70% / .32)',
    badge: 'FLAGSHIP PASS',
    spec: 'Game Catalog · Classic Games · Cloud Streaming',
    coverImage: '/covers/wallet-50.jpg',
    rating: 4.97,
    reviewsCount: 3410,
    inStock: true,
    shortDesc: 'Hundreds of incredible games, game trials, and online multiplayer access on PS5 & PS4.',
    fullDesc: 'Enjoy all the PlayStation Plus benefits from the Extra and Essential plans, plus game trials and the Classics Catalog with hundreds of classic games.',
    features: ['Hundreds of PS5/PS4 Games', 'Time-Limited Game Trials', 'Online Multiplayer & Cloud Saves'],
    specs: [{ label: 'Duration', value: '12 Months' }],
  },
  {
    id: 'xbox-game-pass',
    name: 'Xbox Game Pass Ultimate – 3 Months',
    type: 'top-ups',
    category: 'top-ups',
    subCategory: 'Subscriptions',
    label: 'Gaming Pass',
    price: 5200,
    glyph: 'XGPU',
    wash: 'hsl(142 70% 50% / .3)',
    badge: 'DAY ONE GAMES',
    spec: 'Day One Releases · EA Play Included',
    coverImage: '/covers/wallet-50.jpg',
    rating: 4.95,
    reviewsCount: 2890,
    inStock: true,
    shortDesc: 'Play hundreds of high-quality games on console, PC, and cloud with Xbox Game Pass Ultimate.',
    fullDesc: 'Includes day one new titles, EA Play membership, online multiplayer, and member discounts.',
    features: ['Day 1 Release Access', 'EA Play Membership Included', 'Cloud Gaming on Any Device'],
    specs: [{ label: 'Duration', value: '3 Months' }],
  },
  {
    id: 'valorant-points-2050',
    name: 'Valorant 2,050 Riot Points',
    type: 'top-ups',
    category: 'top-ups',
    subCategory: 'Game Top-Up',
    label: 'Instant Top-Up',
    price: 2450,
    glyph: 'VAL',
    wash: 'hsl(350 85% 65% / .3)',
    badge: 'POPULAR DROP',
    spec: 'Direct Riot ID Credit · Instant Delivery',
    coverImage: '/covers/wallet-50.jpg',
    rating: 4.94,
    reviewsCount: 7600,
    inStock: true,
    shortDesc: 'Instant Valorant Riot Points credited directly to your Riot account ID for skins and battle passes.',
    fullDesc: 'Upgrade your weapon skins, unlock new agent tiers, and level up your current battle pass with official VP.',
    features: ['Direct Riot ID Credit', 'Instant Automatic Delivery', 'Safe & Ban-Free'],
    specs: [{ label: 'Delivery', value: 'Instant via Player ID' }],
  },
  {
    id: 'pubg-uc-660',
    name: 'PUBG Mobile 660 Unknown Cash (UC)',
    type: 'top-ups',
    category: 'top-ups',
    subCategory: 'Game Top-Up',
    label: 'Instant Top-Up',
    price: 1150,
    glyph: 'UC',
    wash: 'hsl(45 95% 55% / .3)',
    badge: 'ROYALE PASS',
    spec: 'Player ID Direct Top-Up · 60s Delivery',
    coverImage: '/covers/wallet-50.jpg',
    rating: 4.96,
    reviewsCount: 8900,
    inStock: true,
    shortDesc: 'Get 660 UC to unlock the Royale Pass and premium crates in PUBG Mobile instantly.',
    fullDesc: 'Official PUBG Mobile UC delivered in seconds via your numeric Player ID.',
    features: ['Instant Delivery', 'Unlock Royale Pass', 'Official Midasbuy Partner Code'],
    specs: [{ label: 'Delivery', value: 'Player ID Instant' }],
  },
  {
    id: 'steam-wallet-50',
    name: 'Steam Wallet $50 Global Digital Code',
    type: 'top-ups',
    category: 'top-ups',
    subCategory: 'Gift Cards',
    label: 'Digital Code',
    price: 6100,
    glyph: 'STEAM',
    wash: 'hsl(215 80% 60% / .3)',
    badge: 'NO EXPIRY',
    spec: 'Global Region · Instant Digital Redeem Code',
    coverImage: '/covers/wallet-50.jpg',
    rating: 4.99,
    reviewsCount: 6150,
    inStock: true,
    shortDesc: 'Add $50 USD to your Steam balance for purchasing games, DLC, and community items.',
    fullDesc: 'Redeem immediately on Steam client or browser without fees or credit cards.',
    features: ['100% Genuine Code', 'No Expiration Date', 'Global Compatibility'],
    specs: [{ label: 'Region', value: 'Global' }],
  },
];

const filterLabels: { id: 'all' | Product['type']; label: string }[] = [
  { id: 'all', label: 'All Vault' },
  { id: 'games', label: 'Games' },
  { id: 'gear', label: 'Accessories' },
  { id: 'top-ups', label: 'Top-Ups & Subs' },
  { id: 'consoles', label: 'Consoles' },
];

function scrollToId(id: string, lenis?: ReturnType<typeof useLenis>) {
  if (lenis) {
    lenis.scrollTo(`#${id}`, { duration: 1.4, offset: -80 });
  } else {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}



function Header({
  cartCount,
  onCart,
  onStageJump,
}: {
  cartCount: number;
  onCart: () => void;
  onStageJump?: (index: number) => void;
}) {
  const [categoriesDropdown, setCategoriesDropdown] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { openSearch } = useSearch();
  const { isOpen: isMobileMenuOpen, toggleMenu: toggleMobileMenu } = useMobileMenu();

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setCategoriesDropdown(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setCategoriesDropdown(false);
    }, 220);
  };

  return (
    <header className="site-header site-header-capsule">
      <div className="header-inner">
        {/* Row 1: Logo (left) + UserAuthButton (right, mobile only) */}
        <div className="site-header-row1 flex items-center justify-between w-full md:w-auto">
          <button
            type="button"
            className="header-logo-badge border-0 bg-transparent p-0 cursor-pointer flex items-center gap-2.5 sm:gap-3 shrink-0"
            onClick={() => {
              if (onStageJump) onStageJump(0);
              else scrollToId('top');
            }}
            data-testid="button-home"
          >
            <img
              src="/logo.jpeg"
              alt="Reikai Arcade Logo"
              className="header-logo-img"
            />
            <span className="wordmark-text font-['Outfit'] font-black tracking-[0.14em] text-white text-sm sm:text-base">
              REIKAI <span className="wordmark-highlight text-[#a0e4f1] drop-shadow-[0_0_12px_rgba(160,228,241,0.7)]">ARCADE</span>
            </span>
          </button>

          {/* Mobile Only: user auth button (sign in / profile) */}
          <div className="flex md:hidden items-center">
            <UserAuthButton />
          </div>
        </div>

        {/* Desktop navigation — hidden on mobile */}
        <nav className="header-nav hidden md:flex items-center" aria-label="Main navigation">
          <div
            className="nav-dropdown-wrapper relative py-2"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => setCategoriesDropdown((prev) => !prev)}
              className={`nav-dropdown-link flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-['DM_Mono'] text-xs font-semibold tracking-wider uppercase text-zinc-300 hover:text-[#a0e4f1] hover:bg-white/5 transition cursor-pointer ${
                categoriesDropdown ? 'text-[#a0e4f1] bg-[#a0e4f1]/10' : ''
              }`}
              data-testid="button-categories-dropdown"
            >
              <Layers size={13} className="text-[#a0e4f1]" />
              <span>Categories</span>
              <ChevronDown size={12} className={`nav-chevron text-zinc-400 transition-transform duration-200 ${categoriesDropdown ? 'rotate-180 text-[#a0e4f1]' : ''}`} />
            </button>
            {categoriesDropdown && (
              <div
                className="nav-dropdown-menu absolute top-full left-0 pt-2 w-64 z-50 animate-in fade-in zoom-in-95 duration-150"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="rounded-2xl border border-[#c673e2]/30 bg-[#080315]/95 p-2 shadow-2xl backdrop-blur-2xl">
                  <Link href="/games" className="nav-dropdown-item flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition group" onClick={() => setCategoriesDropdown(false)}>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 group-hover:text-[#a0e4f1]"><Gamepad2 size={16} /></div>
                    <div><strong className="block text-xs font-bold text-white group-hover:text-[#a0e4f1]">PS5 Games</strong><span className="block text-[11px] text-zinc-400">Exclusives, hits &amp; discs</span></div>
                  </Link>
                  <Link href="/top-up" className="nav-dropdown-item flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition group" onClick={() => setCategoriesDropdown(false)}>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-[#a0e4f1]"><Zap size={16} /></div>
                    <div><strong className="block text-xs font-bold text-white group-hover:text-[#a0e4f1]">Game Top-Up</strong><span className="block text-[11px] text-zinc-400">Valorant, PUBG, Genshin</span></div>
                  </Link>
                  <Link href="/accessories" className="nav-dropdown-item flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition group" onClick={() => setCategoriesDropdown(false)}>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-500/10 text-pink-400 group-hover:text-[#a0e4f1]"><Headphones size={16} /></div>
                    <div><strong className="block text-xs font-bold text-white group-hover:text-[#a0e4f1]">Accessories</strong><span className="block text-[11px] text-zinc-400">DualSense, headsets &amp; gear</span></div>
                  </Link>
                  <Link href="/subscriptions" className="nav-dropdown-item flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition group" onClick={() => setCategoriesDropdown(false)}>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400 group-hover:text-[#a0e4f1]"><Crown size={16} /></div>
                    <div><strong className="block text-xs font-bold text-white group-hover:text-[#a0e4f1]">Subscriptions</strong><span className="block text-[11px] text-zinc-400">PS Plus, Game Pass &amp; EA</span></div>
                  </Link>
                  <Link href="/gift-cards" className="nav-dropdown-item flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition group" onClick={() => setCategoriesDropdown(false)}>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 group-hover:text-[#a0e4f1]"><Gift size={16} /></div>
                    <div><strong className="block text-xs font-bold text-white group-hover:text-[#a0e4f1]">Gift Cards</strong><span className="block text-[11px] text-zinc-400">PSN, Steam, Google &amp; Apple</span></div>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Desktop actions */}
        <div className="header-actions hidden md:flex items-center gap-1.5 sm:gap-2">
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

          <Link
            href="/wishlist"
            className="header-icon-button inline-flex"
            aria-label="View saved wishlist"
            data-testid="header-wishlist"
          >
            <Heart size={15} className="text-pink-400 hover:fill-pink-400/40 transition" />
          </Link>

          <Link
            href="/cart"
            className="header-icon-button cart-pill-btn inline-flex"
            aria-label={`Open cart with ${cartCount} items`}
            data-testid="button-open-cart"
          >
            <ShoppingBag size={15} />
            <span className="cart-count" data-testid="text-cart-count">{cartCount}</span>
          </Link>

          <UserAuthButton />
        </div>

        {/* Mobile Row 2: search bar (left/center) + menu toggle (right) */}
        <div className="site-header-row2 flex md:hidden items-center gap-2 w-full min-w-0 mt-2.5">
          <button
            type="button"
            onClick={() => openSearch()}
            className="mobile-search-capsule-bar flex-1 min-w-0 h-10 px-3.5 rounded-xl bg-white/[0.06] border border-white/10 hover:border-[#a0e4f1]/50 flex items-center justify-between text-xs text-zinc-300 transition active:scale-[0.99] cursor-pointer overflow-hidden"
            aria-label="Search store"
            data-testid="mobile-search-bar"
          >
            <span className="text-zinc-400 font-['DM_Mono'] truncate min-w-0 flex-1 text-left">
              Search games, accessories, top up...
            </span>
            <Search size={16} className="text-[#a0e4f1] shrink-0 ml-2" />
          </button>

          <button
            type="button"
            onClick={toggleMobileMenu}
            className={`mobile-menu-toggle-btn h-10 w-10 shrink-0 rounded-xl border flex items-center justify-center transition active:scale-95 cursor-pointer ${
              isMobileMenuOpen
                ? 'border-[#a0e4f1] text-[#a0e4f1] bg-[#a0e4f1]/15 shadow-[0_0_12px_rgba(160,228,241,0.35)]'
                : 'bg-white/[0.06] border-white/10 text-white hover:text-[#a0e4f1] hover:border-white/20'
            }`}
            aria-label="Toggle navigation menu"
            data-testid="mobile-menu-toggle"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}





function ProductCard({ product, onAdd }: { product: Product; onAdd: (product: Product) => void }) {
  const rawType = (product as any).rawType;
  const detailHref =
    product.type === 'games' || rawType === 'game'
      ? `/games/${product.id}`
      : product.type === 'gear' || rawType === 'accessory'
      ? `/accessories/${product.id}`
      : rawType === 'subscription' || product.subCategory?.toLowerCase().includes('subscription')
      ? `/subscriptions`
      : rawType === 'giftcard' || product.subCategory?.toLowerCase().includes('gift')
      ? `/gift-cards`
      : `/top-up`;

  return (
    <StandardProductCard product={product} href={detailHref ?? undefined} onAdd={onAdd} />
  );
}

function mapDbRowsToProducts(rows: any[]): Product[] {
  const map = new Map<string, any>()
  for (const r of rows) {
    if (!map.has(r.id)) {
      const isGame = r.type === 'game';
      const isTopUpOrSub = r.type === 'topup' || r.type === 'giftcard' || r.type === 'subscription';
      const mappedType: Product['type'] = isGame ? 'games' : isTopUpOrSub ? 'top-ups' : 'gear';
      const mappedCategory = isGame ? 'games' : isTopUpOrSub ? 'top-ups' : 'accessories';

      map.set(r.id, {
        id: r.slug,
        rawType: r.type,
        name: r.name,
        type: mappedType,
        category: mappedCategory,
        subCategory: r.category || (isGame ? 'PS5 Game' : r.type === 'subscription' ? 'Subscription' : r.type === 'giftcard' ? 'Gift Cards' : r.type === 'topup' ? 'Game Top-Up' : 'Gear'),
        label: r.brand || (isGame ? 'PS5 Game' : r.type === 'subscription' ? 'Subscription' : r.type === 'giftcard' ? 'Gift Card' : r.type === 'topup' ? 'Top-Up' : 'Gear'),
        price: (r.price ?? 0) / 100,
        glyph: (r.slug || r.name).slice(0, 4).toUpperCase(),
        wash: isGame ? 'hsl(272 90% 68% / .32)' : isTopUpOrSub ? 'hsl(180 85% 65% / .3)' : 'hsl(285 85% 72% / .32)',
        badge: r.featured ? 'FEATURED DROP' : undefined,
        spec: r.platform || '',
        coverImage: normalizeProductImageUrl(r.imageUrl, r.type),
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
        existing.price = r.price / 100;
      }
    }
  }
  return Array.from(map.values());
}

type HeroStage = {
  num: string;
  tabLabel: string;
  badge: string;
  title: string;
  p1: string;
  p2: string;
  ctaPrimary: string;
  ctaPrimaryHref?: string;
  ctaPrimaryTarget?: string;
  ctaSecondary: string;
  ctaSecondaryHref?: string;
  ctaSecondaryTarget?: string;
};

const heroStages: HeroStage[] = [
  {
    num: '01',
    tabLabel: 'GAMES',
    badge: 'CORE GAMING CATALOG // PHYSICAL & DIGITAL',
    title: 'Console & PC Games',
    p1: 'Original PS5, PS4, Nintendo Switch and PC game discs and digital editions.',
    p2: 'Grab the latest AAA releases, legendary RPGs, and indie blockbusters with instant dispatch and guaranteed authenticity.',
    ctaPrimary: 'Shop Games',
    ctaPrimaryHref: '/games',
    ctaSecondary: 'Browse Drop',
    ctaSecondaryTarget: 'browse',
  },
  {
    num: '02',
    tabLabel: 'ACCESSORIES',
    badge: 'PRO HARDWARE // CONTROLLERS & GEAR',
    title: 'Gaming Accessories',
    p1: 'High-performance DualSense Wireless controllers, custom faceplates, pro headsets, and charging docks.',
    p2: 'Equip tournament-grade precision, tactile haptic feedback, and celestial aesthetic mods for your setup.',
    ctaPrimary: 'Shop Accessories',
    ctaPrimaryHref: '/accessories',
    ctaSecondary: 'Explore Categories',
    ctaSecondaryTarget: 'categories',
  },
  {
    num: '03',
    tabLabel: 'TOP-UPS',
    badge: 'INSTANT DIGITAL RELOAD // ZERO FRICTION',
    title: 'Game Top-Ups',
    p1: 'Instant in-game credits, wallet codes, and digital reloads for all major mobile, PC, and console games.',
    p2: 'Instant code dispatch, 100% verified publisher vouchers, zero waiting time directly to your player account.',
    ctaPrimary: 'Instant Top-Up',
    ctaPrimaryHref: '/top-up',
    ctaSecondary: 'View Rates',
    ctaSecondaryTarget: 'categories',
  },
  {
    num: '04',
    tabLabel: 'SUBSCRIPTIONS',
    badge: 'MEMBERSHIP VAULT // PASSES & CODES',
    title: 'Subscriptions & Passes',
    p1: 'PlayStation Plus, Xbox Game Pass, EA Play, and global gift cards with instant automated digital activation.',
    p2: 'Unlock monthly games, online multiplayer access, exclusive cloud saves, and member perks with zero hassle.',
    ctaPrimary: 'Get Subscriptions',
    ctaPrimaryHref: '/subscriptions',
    ctaSecondary: 'Gift Cards',
    ctaSecondaryHref: '/gift-cards',
  },
];

const categoryRail = [
  {
    title: 'Game Top-Up',
    desc: 'Instant mobile & PC top-up',
    icon: Zap,
    href: '/top-up',
  },
  {
    title: 'Subscriptions',
    desc: 'Gaming & digital pass',
    icon: Sparkles,
    href: '/gift-cards',
  },
  {
    title: 'Gift Cards',
    desc: 'Global digital codes',
    icon: Gem,
    href: '/gift-cards',
  },
  {
    title: 'Console Games',
    desc: 'PlayStation, Xbox, PC',
    icon: Gamepad2,
    href: '/games',
  },
  {
    title: 'Accessories',
    desc: 'Gaming gear & perks',
    icon: ShoppingBag,
    href: '/accessories',
  },
];

const STAGE_WINDOWS = [
  // Stage 0: starts visible, then scrolls down & fades completely gone between 0.15 and 0.23
  { enterStart: -0.05, enterEnd: 0.00, exitStart: 0.15, exitEnd: 0.23, center: 0.07 },
  // Stage 1: scrolls UP (0.26..0.33), plateaus, then scrolls DOWN completely gone (0.43..0.50)
  { enterStart: 0.26, enterEnd: 0.33, exitStart: 0.43, exitEnd: 0.50, center: 0.38 },
  // Stage 2: scrolls UP (0.53..0.60), plateaus, then scrolls DOWN completely gone (0.70..0.77)
  { enterStart: 0.53, enterEnd: 0.60, exitStart: 0.70, exitEnd: 0.77, center: 0.65 },
  // Stage 3: scrolls UP (0.80..0.87), plateaus, exits towards categories (0.96..1.00)
  { enterStart: 0.80, enterEnd: 0.87, exitStart: 0.96, exitEnd: 1.00, center: 0.91 },
];

const STAGE_CENTERS = STAGE_WINDOWS.map((w) => w.center);

type StageMotion = {
  opacity: number;
  translateY: number;
  blur: number;
  active: boolean;
};

function getStageMotion(progress: number, stageIdx: number): StageMotion {
  const win = STAGE_WINDOWS[stageIdx];
  const { enterStart, enterEnd, exitStart, exitEnd } = win;

  // 1. Before entering: waiting below
  if (progress < enterStart) {
    return {
      opacity: 0,
      translateY: 110,
      blur: 8,
      active: false,
    };
  }

  // 2. Entering: scrolls UP slowly into place (+110px -> 0px)
  if (progress >= enterStart && progress < enterEnd) {
    const t = enterEnd > enterStart ? (progress - enterStart) / (enterEnd - enterStart) : 1;
    const ease = t * t * (3 - 2 * t);
    return {
      opacity: ease,
      translateY: (1 - ease) * 110,
      blur: (1 - ease) * 8,
      active: ease > 0.5,
    };
  }

  // 3. Plateau: centered, slow subtle parallax breathing drift
  if (progress >= enterEnd && progress < exitStart) {
    const plateauProgress = (progress - enterEnd) / (exitStart - enterEnd);
    const drift = (plateauProgress - 0.5) * 12;
    return {
      opacity: 1,
      translateY: drift,
      blur: 0,
      active: true,
    };
  }

  // 4. Exiting: scrolls UP and floats away into the void (0px -> -110px)
  if (progress >= exitStart && progress < exitEnd) {
    const t = (progress - exitStart) / (exitEnd - exitStart);
    const ease = t * t * (3 - 2 * t);
    return {
      opacity: 1 - ease,
      translateY: -ease * 110,
      blur: ease * 8,
      active: ease < 0.5,
    };
  }

  // 5. Completely gone above
  return {
    opacity: 0,
    translateY: -110,
    blur: 8,
    active: false,
  };
}

export default function StorefrontPage() {
  const { addToCart, cartCount, setCartOpen } = useCart();
  const [liveProducts, setLiveProducts] = useState<Product[]>(products);
  const [filter, setFilter] = useState<'all' | Product['type']>('all');
  const [catalogSearch, setCatalogSearch] = useState('');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [signalEmail, setSignalEmail] = useState('');
  const [signalSubscribed, setSignalSubscribed] = useState(false);
  const [heroScrollProgress, setHeroScrollProgress] = useState(0);
  const [activeStage, setActiveStage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const heroTrackRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  useScrollAnimations(reducedMotion);

  const jumpToStage = (idx: number) => {
    setActiveStage(idx);
    const mobileNow = typeof window !== 'undefined' && window.innerWidth <= 768;
    if (!mobileNow) {
      const track = heroTrackRef.current;
      if (!track) return;
      const trackTop = window.scrollY + track.getBoundingClientRect().top;
      const trackScrollable = track.offsetHeight - window.innerHeight;
      const targetScroll = trackTop + (STAGE_CENTERS[idx] ?? 0) * trackScrollable;
      if (lenis) {
        lenis.scrollTo(targetScroll, { duration: 1.2 });
      } else {
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
      }
    }
  };

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

    const checkMobile = () => {
      const mobileNow = window.innerWidth <= 768;
      setIsMobile(mobileNow);
      return mobileNow;
    };

    const onScroll = () => {
      const scrollTop = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? Math.min(1, scrollTop / max) : 0);

      const track = heroTrackRef.current;
      if (track) {
        const rect = track.getBoundingClientRect();
        const trackScrollable = track.offsetHeight - window.innerHeight;
        const mobileNow = window.innerWidth <= 768;

        if (!mobileNow && trackScrollable > 0) {
          const rawProgress = -rect.top / trackScrollable;
          const clamped = Math.max(0, Math.min(1, rawProgress));
          setHeroScrollProgress(clamped);

          let nearestStage = 0;
          let minDiff = 999;
          STAGE_CENTERS.forEach((c, i) => {
            const d = Math.abs(clamped - c);
            if (d < minDiff) {
              minDiff = d;
              nearestStage = i;
            }
          });
          setActiveStage(nearestStage);
        }
      }
    };

    const onResize = () => {
      checkMobile();
      onScroll();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    if (lenis) {
      lenis.on('scroll', onScroll);
    }

    checkMobile();
    onScroll();

    return () => {
      media.removeEventListener('change', onPreference);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (lenis) {
        lenis.off('scroll', onScroll);
      }
    };
  }, [activeStage, lenis]);

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

  // Curated shelf groups for separate storefront sections
  const gamesProducts = useMemo(() => {
    return liveProducts.filter((p) => (p as any).rawType === 'game' || p.type === 'games' || p.category === 'games');
  }, [liveProducts]);

  const topUpProducts = useMemo(() => {
    return liveProducts.filter(
      (p) =>
        (p as any).rawType === 'topup' ||
        p.subCategory?.toLowerCase().includes('top-up') ||
        p.id?.toLowerCase().includes('top-up') ||
        p.name?.toLowerCase().includes('valorant') ||
        p.name?.toLowerCase().includes('pubg') ||
        p.name?.toLowerCase().includes('genshin')
    );
  }, [liveProducts]);

  const gearProducts = useMemo(() => {
    return liveProducts.filter((p) => (p as any).rawType === 'accessory' || p.type === 'gear' || p.category === 'accessories');
  }, [liveProducts]);

  const subscriptionProducts = useMemo(() => {
    return liveProducts.filter(
      (p) =>
        (p as any).rawType === 'subscription' ||
        p.subCategory?.toLowerCase().includes('subscription') ||
        p.name?.toLowerCase().includes('plus') ||
        p.name?.toLowerCase().includes('pass') ||
        p.name?.toLowerCase().includes('ea play')
    );
  }, [liveProducts]);

  const giftCardProducts = useMemo(() => {
    return liveProducts.filter(
      (p) =>
        (p as any).rawType === 'giftcard' ||
        p.subCategory?.toLowerCase().includes('gift') ||
        p.name?.toLowerCase().includes('wallet') ||
        p.name?.toLowerCase().includes('card')
    );
  }, [liveProducts]);

  const setCategory = (category: 'all' | Product['type']) => {
    setFilter(category);
    scrollToId('browse');
  };

  return (
    <main className="site-shell noise" id="top">
      {/* Scroll progress indicator */}
      <div
        className="scroll-progress-bar"
        style={{ '--scroll-pct': `${scrollProgress * 100}%` } as CSSProperties}
        aria-hidden="true"
      />

      {/* ── REDESIGNED 3D MULTI-STAGE SCROLL TRACK (LOGO PALETTE & VIDEO) ── */}
      <section className="hero-scroll-track" ref={heroTrackRef} id="discover">
        <div className="hero-sticky-viewport">
          {/* Ambient Aurora Glow Ribbons */}
          <div className="hero-aurora-bg">
            <div
              className="hero-aurora-ribbon hero-aurora-ribbon-1"
              style={{
                transform: `rotate(${-15 + heroScrollProgress * 30}deg) translateY(${heroScrollProgress * 60}px)`,
                opacity: 0.5 + Math.sin(heroScrollProgress * Math.PI) * 0.35,
              }}
            />
            <div
              className="hero-aurora-ribbon hero-aurora-ribbon-2"
              style={{
                transform: `rotate(${18 - heroScrollProgress * 28}deg) translateY(${-heroScrollProgress * 50}px)`,
                opacity: 0.45 + Math.sin(heroScrollProgress * Math.PI) * 0.4,
              }}
            />
          </div>

          {/* Sweeping Volumetric Atmospheric Spotlights */}
          <div
            className="hero-spotlight-beam hero-spotlight-left"
            style={{
              transform: `rotate(${-22 + heroScrollProgress * 36}deg) scaleX(${0.8 + Math.sin(heroScrollProgress * Math.PI) * 0.4})`,
              opacity: 0.75 + Math.sin(heroScrollProgress * Math.PI) * 0.25,
            }}
          />
          <div
            className="hero-spotlight-beam hero-spotlight-right"
            style={{
              transform: `rotate(${24 - heroScrollProgress * 38}deg) scaleX(${0.8 + Math.cos(heroScrollProgress * Math.PI) * 0.3})`,
              opacity: 0.7 + Math.sin(heroScrollProgress * Math.PI) * 0.3,
            }}
          />

          {/* Top Header */}
          <Header
            cartCount={cartCount}
            onCart={() => setCartOpen(true)}
            onStageJump={jumpToStage}
          />

          {/* Right Vertical Category Rail (matching sample video) */}
          <aside className="hero-right-dock" aria-label="Quick Category Access">
            {categoryRail.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.title}
                  href={cat.href}
                  className="hero-dock-card"
                  data-testid={`dock-category-${i}`}
                >
                  <div className="hero-dock-icon">
                    <Icon size={19} />
                  </div>
                  <div className="hero-dock-content">
                    <span className="hero-dock-title">{cat.title}</span>
                    <span className="hero-dock-desc">{cat.desc}</span>
                  </div>
                  <ArrowRight size={14} className="hero-dock-arrow" />
                </Link>
              );
            })}
          </aside>

          {/* Left/Center Multi-Phase Story Hero Content (Scroll parallax on PC, active tab on phone) */}
          <div className="hero-story-container">
            {heroStages.map((stage, idx) => {
              if (isMobile) {
                const isActive = activeStage === idx;
                return (
                  <div
                    key={stage.num}
                    className={`hero-stage-item hero-stage-mobile ${isActive ? 'hero-stage-active' : 'hero-stage-inactive'}`}
                    aria-hidden={!isActive}
                  >
                    {/* Editorial Headline */}
                    <h1 className="hero-editorial-headline hero-editorial-gradient">
                      {stage.title}
                    </h1>

                    {/* Story Paragraph */}
                    <div className="hero-two-col-grid">
                      <p className="hero-story-para">{stage.p1}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="hero-action-buttons">
                      {stage.ctaPrimaryHref ? (
                        <Link
                          href={stage.ctaPrimaryHref}
                          className="hero-primary-btn"
                          data-testid={`button-hero-primary-${idx}`}
                        >
                          <ShoppingCart size={15} />
                          <span>{stage.ctaPrimary}</span>
                          <ArrowRight size={15} />
                        </Link>
                      ) : (
                        <button
                          type="button"
                          className="hero-primary-btn"
                          onClick={() => stage.ctaPrimaryTarget && scrollToId(stage.ctaPrimaryTarget, lenis)}
                          data-testid={`button-hero-primary-${idx}`}
                        >
                          <ShoppingCart size={15} />
                          <span>{stage.ctaPrimary}</span>
                          <ArrowRight size={15} />
                        </button>
                      )}

                      {stage.ctaSecondaryHref ? (
                        <Link
                          href={stage.ctaSecondaryHref}
                          className="hero-secondary-btn"
                          data-testid={`button-hero-secondary-${idx}`}
                        >
                          <Globe size={15} />
                          <span>{stage.ctaSecondary}</span>
                        </Link>
                      ) : (
                        <button
                          type="button"
                          className="hero-secondary-btn"
                          onClick={() => stage.ctaSecondaryTarget && scrollToId(stage.ctaSecondaryTarget, lenis)}
                          data-testid={`button-hero-secondary-${idx}`}
                        >
                          <Globe size={15} />
                          <span>{stage.ctaSecondary}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              }

              // PC / Big Screen version: continuous scroll-triggered tab switching with multi-depth parallax
              const motion = getStageMotion(heroScrollProgress, idx);
              const isVisible = motion.opacity > 0.005;
              const y = motion.translateY;

              return (
                <div
                  key={stage.num}
                  className="hero-stage-item hero-stage-desktop"
                  style={{
                    opacity: motion.opacity,
                    filter: motion.blur > 0.15 ? `blur(${motion.blur.toFixed(1)}px)` : 'none',
                    pointerEvents: motion.active ? 'auto' : 'none',
                    visibility: isVisible ? 'visible' : 'hidden',
                  }}
                  aria-hidden={!motion.active}
                >
                  {/* Editorial Headline (Parallax factor 1.0) */}
                  <h1
                    className="hero-editorial-headline hero-editorial-gradient"
                    style={{
                      transform: `translate3d(0, ${y.toFixed(1)}px, 0)`,
                    }}
                  >
                    {stage.title}
                  </h1>

                  {/* Story Paragraph (Parallax factor 0.75 - subtle drag) */}
                  <div
                    className="hero-two-col-grid"
                    style={{
                      transform: `translate3d(0, ${(y * 0.75).toFixed(1)}px, 0)`,
                    }}
                  >
                    <p className="hero-story-para">{stage.p1}</p>
                  </div>

                  {/* Action Buttons (Parallax factor 0.55 - anchors composition) */}
                  <div
                    className="hero-action-buttons"
                    style={{
                      transform: `translate3d(0, ${(y * 0.55).toFixed(1)}px, 0)`,
                    }}
                  >
                    {stage.ctaPrimaryHref ? (
                      <Link
                        href={stage.ctaPrimaryHref}
                        className="hero-primary-btn"
                        data-testid={`button-hero-primary-${idx}`}
                      >
                        <ShoppingCart size={15} />
                        <span>{stage.ctaPrimary}</span>
                        <ArrowRight size={15} />
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className="hero-primary-btn"
                        onClick={() => stage.ctaPrimaryTarget && scrollToId(stage.ctaPrimaryTarget, lenis)}
                        data-testid={`button-hero-primary-${idx}`}
                      >
                        <ShoppingCart size={15} />
                        <span>{stage.ctaPrimary}</span>
                        <ArrowRight size={15} />
                      </button>
                    )}

                    {stage.ctaSecondaryHref ? (
                      <Link
                        href={stage.ctaSecondaryHref}
                        className="hero-secondary-btn"
                        data-testid={`button-hero-secondary-${idx}`}
                      >
                        <Globe size={15} />
                        <span>{stage.ctaSecondary}</span>
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className="hero-secondary-btn"
                        onClick={() => stage.ctaSecondaryTarget && scrollToId(stage.ctaSecondaryTarget, lenis)}
                        data-testid={`button-hero-secondary-${idx}`}
                      >
                        <Globe size={15} />
                        <span>{stage.ctaSecondary}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom-Left Stage Navigator */}
          <div className="hero-stage-nav" aria-label="Hero Stage Navigator">
            <div className="hero-stage-pills">
              {heroStages.map((s, idx) => (
                <button
                  key={s.tabLabel}
                  type="button"
                  className={`hero-stage-pill ${activeStage === idx ? 'active' : ''}`}
                  onClick={() => jumpToStage(idx)}
                  aria-label={`Jump to stage ${s.tabLabel}`}
                >
                  {s.tabLabel}
                </button>
              ))}
            </div>
            <div className="hero-stage-indicator-bar" aria-hidden="true">
              <div
                className="hero-stage-indicator-fill"
                style={{
                  width: isMobile
                    ? `${((activeStage + 1) / heroStages.length) * 100}%`
                    : `${Math.max(4, Math.min(100, Math.round(heroScrollProgress * 100)))}%`,
                }}
              />
            </div>
          </div>
        </div>
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
          {/* ── LEFT PANEL ── Interactive Tutorial Video Player (Admin Uploaded & Managed) */}
          <div className="cat-panel-left" data-testid="tutorial-video-wrapper">
            <TutorialVideoPlayer />
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
          {/* View More CTA row — shown when a specific category tab is active */}
          {filter !== 'all' && (() => {
            const viewMoreMap: Record<string, { href: string; label: string }> = {
              games: { href: '/games', label: 'View All Games' },
              gear: { href: '/accessories', label: 'View All Accessories' },
              'top-ups': { href: '/top-up', label: 'View All Top-Ups' },
              consoles: { href: '/games', label: 'View All Consoles' },
            };
            const vm = viewMoreMap[filter];
            return vm ? (
              <div className="browse-view-more-row">
                <Link href={vm.href} className="store-shelf-view-more" data-testid={`link-view-more-${filter}`}>
                  <span>{vm.label}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            ) : null;
          })()}

          {/* Unified product grid — same for ALL VAULT, specific tab, or search */}
          <div className="product-grid" data-testid="grid-products">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAdd={addToCart} />
              ))
            ) : (
              <div className="catalog-empty-wrap">
                <Search size={32} className="text-[#c673e2] opacity-60 mb-2" />
                <h3 className="text-lg font-bold">
                  {catalogSearch
                    ? `No products match "${catalogSearch}"`
                    : 'No products in this category yet.'}
                </h3>
                <p className="text-sm text-white/50 mt-1 max-w-sm">
                  {catalogSearch
                    ? 'Try searching another keyword or reset the filter to view all available drops.'
                    : 'Check back soon — new drops land regularly.'}
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

      <section className="section trust-section" aria-labelledby="trust-title">
        <div className="trust-section-inner">
          <div className="trust-head" data-reveal>
            <div className="section-kicker">03 // Why ReiKai</div>
            <h2 id="trust-title" className="trust-title">Built different. <span>Backed by trust.</span></h2>
          </div>
          <div className="trust-grid" data-reveal>
            <div className="trust-card">
              <div className="trust-card-icon"><ShieldCheck size={22} /></div>
              <strong>100% Genuine</strong>
              <span>All products are sourced from official publishers and authorized distributors. No fakes, no grey market.</span>
            </div>
            <div className="trust-card">
              <div className="trust-card-icon"><Zap size={22} /></div>
              <strong>Instant Delivery</strong>
              <span>Digital codes and top-ups delivered to your screen and SMS within seconds of payment confirmation.</span>
            </div>
            <div className="trust-card">
              <div className="trust-card-icon"><Lock size={22} /></div>
              <strong>Secure Checkout</strong>
              <span>bKash, Nagad, Visa, Mastercard & encrypted ReiKai escrow wallet — your payment is always protected.</span>
            </div>
            <div className="trust-card">
              <div className="trust-card-icon"><Headphones size={22} /></div>
              <strong>24/7 Support</strong>
              <span>Live chat and Discord support around the clock. Any issue resolved within 2 hours, guaranteed.</span>
            </div>
            <div className="trust-card">
              <div className="trust-card-icon"><Globe size={22} /></div>
              <strong>Nationwide Shipping</strong>
              <span>Same-day dispatch for physical gear across Bangladesh. Real-time tracking from warehouse to door.</span>
            </div>
            <div className="trust-card">
              <div className="trust-card-icon"><Sparkles size={22} /></div>
              <strong>Exclusive Drops</strong>
              <span>First access to limited editions, bundles, and restocks before they go public — subscribe to the vault.</span>
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
                className="header-logo-badge border-0 bg-transparent p-0 cursor-pointer flex items-center gap-3"
                onClick={() => scrollToId('top')}
                data-testid="button-footer-home"
              >
                <img
                  src="/logo.jpeg"
                  alt="Reikai Arcade"
                  className="header-logo-img"
                />
                <span className="wordmark-text font-['Outfit'] font-black tracking-[0.14em] text-white text-base">
                  REIKAI <span className="wordmark-highlight text-[#a0e4f1] drop-shadow-[0_0_12px_rgba(160,228,241,0.7)]">ARCADE</span>
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
        onHomeClick={() => scrollToId('top', lenis)}
      />

      {/* Mobile right sidebar drawer */}
      <MobileRightSidebar />

    </main>
  );
}
