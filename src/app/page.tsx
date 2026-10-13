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

type StagePose = {
  x: number;
  y?: number;
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
const heroPose: StagePose = { x: 0, y: 0, scale: 1.10, theta: 184, phi: 43, radius: 1.95, roll: -7 }; // Centered initial pose

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
  stageX,
  stageY = 0,
  roll,
  reducedMotion,
  opacity = 1,
}: {
  orbit: string;
  modelScale: number;
  stageX: number;
  stageY?: number;
  roll: number;
  reducedMotion: boolean;
  opacity?: number;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const modelRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const supported = supportsWebGL();
    setWebglSupported(supported);
    if (!supported) setReady(true);
  }, []);

  useEffect(() => {
    if (!webglSupported) return;

    let active = true;
    const mount = () => {
      if (!active || !hostRef.current || modelRef.current) return;
      try {
        const model = document.createElement('model-viewer');
        model.setAttribute('src', '/ps5.glb');
        model.setAttribute('alt', 'PlayStation 5 DualSense wireless controller');
        model.setAttribute('camera-controls', '');
        model.setAttribute('disable-zoom', '');
        model.setAttribute('interaction-prompt', 'none');
        model.setAttribute('shadow-intensity', '1.4');
        model.setAttribute('shadow-softness', '0.7');
        model.setAttribute('exposure', '1.15');
        model.setAttribute('camera-orbit', orbit);
        model.setAttribute('interpolation-decay', '0');
        model.setAttribute('loading', 'eager');
        model.setAttribute('reveal', 'auto');
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
  }, [webglSupported]);

  useEffect(() => {
    if (modelRef.current) modelRef.current.setAttribute('camera-orbit', orbit);
  }, [orbit]);

  const dockStyle = {
    '--model-scale': `${modelScale}`,
    '--stage-x': `${stageX}vw`,
    '--stage-y': `${stageY}px`,
    '--model-roll': `${reducedMotion ? 0 : roll}deg`,
    opacity,
    pointerEvents: opacity < 0.05 ? 'none' : undefined,
    visibility: opacity < 0.01 ? 'hidden' : 'visible',
    transition: 'opacity 0.25s ease-out',
  } as CSSProperties;

  return (
    <div className="hero-model-stage" style={dockStyle} aria-label="Interactive PS5 DualSense Controller 3D Model">
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
  onStageJump,
}: {
  cartCount: number;
  onCart: () => void;
  onStageJump?: (index: number) => void;
}) {
  const [mobileNav, setMobileNav] = useState(false);
  const [categoriesDropdown, setCategoriesDropdown] = useState(false);
  const { openSearch } = useSearch();

  return (
    <header className="site-header">
      <div className="header-inner">
        <button
          type="button"
          className="header-logo-badge border-0 bg-transparent p-0 cursor-pointer flex items-center gap-3 shrink-0"
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
          <span className="wordmark-text font-['Outfit'] font-black tracking-[0.14em] text-white text-base">
            REIKAI <span className="wordmark-highlight text-[#00f0ff] drop-shadow-[0_0_12px_rgba(0,240,255,0.7)]">ARCADE</span>
          </span>
        </button>

        <nav className="header-nav flex items-center" aria-label="Main navigation">
          {/* Categories Dropdown Menu */}
          <div
            className="nav-dropdown-wrapper relative"
            onMouseEnter={() => setCategoriesDropdown(true)}
            onMouseLeave={() => setCategoriesDropdown(false)}
          >
            <button
              type="button"
              onClick={() => setCategoriesDropdown((prev) => !prev)}
              className="nav-dropdown-link flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg font-['DM_Mono'] text-xs font-semibold tracking-wider uppercase text-zinc-300 hover:text-[#00f0ff] hover:bg-white/5 transition"
              data-testid="button-categories-dropdown"
            >
              <Layers size={13} className="text-[#00f0ff]" />
              <span className="hidden xs:inline">Categories</span>
              <ChevronDown size={12} className="nav-chevron text-zinc-400" />
            </button>
            {categoriesDropdown && (
              <div className="nav-dropdown-menu absolute top-full left-0 mt-2 w-64 rounded-2xl border border-[#a855f7]/30 bg-[#080315]/95 p-2 shadow-2xl backdrop-blur-2xl z-50">
                <Link
                  href="/games"
                  className="nav-dropdown-item flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition group"
                  onClick={() => setCategoriesDropdown(false)}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 group-hover:text-[#00f0ff]">
                    <Gamepad2 size={16} />
                  </div>
                  <div>
                    <strong className="block text-xs font-bold text-white group-hover:text-[#00f0ff]">PS5 Games</strong>
                    <span className="block text-[11px] text-zinc-400">Exclusives, hits &amp; discs</span>
                  </div>
                </Link>

                <Link
                  href="/top-up"
                  className="nav-dropdown-item flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition group"
                  onClick={() => setCategoriesDropdown(false)}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-[#00f0ff]">
                    <Zap size={16} />
                  </div>
                  <div>
                    <strong className="block text-xs font-bold text-white group-hover:text-[#00f0ff]">Game Top-Up</strong>
                    <span className="block text-[11px] text-zinc-400">Valorant, PUBG, Genshin</span>
                  </div>
                </Link>

                <Link
                  href="/accessories"
                  className="nav-dropdown-item flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition group"
                  onClick={() => setCategoriesDropdown(false)}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-500/10 text-pink-400 group-hover:text-[#00f0ff]">
                    <Headphones size={16} />
                  </div>
                  <div>
                    <strong className="block text-xs font-bold text-white group-hover:text-[#00f0ff]">Accessories</strong>
                    <span className="block text-[11px] text-zinc-400">DualSense, headsets &amp; gear</span>
                  </div>
                </Link>

                <Link
                  href="/subscriptions"
                  className="nav-dropdown-item flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition group"
                  onClick={() => setCategoriesDropdown(false)}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400 group-hover:text-[#00f0ff]">
                    <Crown size={16} />
                  </div>
                  <div>
                    <strong className="block text-xs font-bold text-white group-hover:text-[#00f0ff]">Subscriptions</strong>
                    <span className="block text-[11px] text-zinc-400">PS Plus, Game Pass &amp; EA</span>
                  </div>
                </Link>

                <Link
                  href="/gift-cards"
                  className="nav-dropdown-item flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition group"
                  onClick={() => setCategoriesDropdown(false)}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 group-hover:text-[#00f0ff]">
                    <Gift size={16} />
                  </div>
                  <div>
                    <strong className="block text-xs font-bold text-white group-hover:text-[#00f0ff]">Gift Cards</strong>
                    <span className="block text-[11px] text-zinc-400">PSN, Steam, Google &amp; Apple</span>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </nav>

        <div className="header-actions flex items-center gap-1.5 sm:gap-2">
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

          {/* Mobile Search icon button */}
          <button
            type="button"
            className="header-icon-button md:hidden"
            onClick={() => openSearch()}
            aria-label="Search products"
            data-testid="button-search"
          >
            <Search size={15} />
          </button>

          {/* Wishlist Button */}
          <Link
            href="/wishlist"
            className="header-icon-button"
            aria-label="View saved wishlist"
            data-testid="header-wishlist"
          >
            <Heart size={15} className="text-pink-400 hover:fill-pink-400/40 transition" />
          </Link>

          {/* Cart Button */}
          <button
            type="button"
            className="header-icon-button cart-pill-btn"
            onClick={onCart}
            aria-label={`Open cart with ${cartCount} items`}
            data-testid="button-open-cart"
          >
            <ShoppingBag size={15} />
            <span className="cart-count" data-testid="text-cart-count">{cartCount}</span>
          </button>

          {/* User Profile Avatar or Sign In button */}
          <UserAuthButton />
        </div>
      </div>
      {mobileNav && (
        <div className="absolute left-0 right-0 top-full border-b border-[hsl(var(--border))] bg-[#0b0618]/95 backdrop-blur-xl p-5 md:hidden z-50">
          <button
            type="button"
            className="mobile-nav-search-btn mb-3 w-full"
            onClick={() => {
              setMobileNav(false);
              openSearch();
            }}
            data-testid="mobile-menu-search"
          >
            <Search size={16} className="text-[#00f0ff]" />
            <span>Search games, gear &amp; codes...</span>
            <span className="mobile-search-pill">Search</span>
          </button>
          <div className="py-2 border-b border-[hsl(var(--border))]">
            <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold block mb-2">Categories</span>
            <Link
              href="/games"
              onClick={() => setMobileNav(false)}
              className="flex items-center gap-2 py-2 font-mono-ui text-xs uppercase tracking-[.12em] text-[#e2e8f0] hover:text-[#00f0ff]"
            >
              <Gamepad2 size={14} className="text-purple-400" /> PS5 Games
            </Link>
            <Link
              href="/top-up"
              onClick={() => setMobileNav(false)}
              className="flex items-center gap-2 py-2 font-mono-ui text-xs uppercase tracking-[.12em] text-[#e2e8f0] hover:text-[#00f0ff]"
            >
              <Zap size={14} className="text-[#00f0ff]" /> Game Top-Up
            </Link>
            <Link
              href="/accessories"
              onClick={() => setMobileNav(false)}
              className="flex items-center gap-2 py-2 font-mono-ui text-xs uppercase tracking-[.12em] text-[#e2e8f0] hover:text-[#00f0ff]"
            >
              <Headphones size={14} className="text-pink-400" /> Accessories &amp; Gear
            </Link>
            <Link
              href="/subscriptions"
              onClick={() => setMobileNav(false)}
              className="flex items-center gap-2 py-2 font-mono-ui text-xs uppercase tracking-[.12em] text-[#e2e8f0] hover:text-[#00f0ff]"
            >
              <Crown size={14} className="text-violet-400" /> Gaming Subscriptions
            </Link>
            <Link
              href="/gift-cards"
              onClick={() => setMobileNav(false)}
              className="flex items-center gap-2 py-2 font-mono-ui text-xs uppercase tracking-[.12em] text-[#e2e8f0] hover:text-[#00f0ff]"
            >
              <Gift size={14} className="text-amber-400" /> Digital Gift Cards
            </Link>
          </div>
          <div className="pt-3 flex justify-between items-center">
            <span className="text-xs text-zinc-400 font-mono">Account</span>
            <UserAuthButton />
          </div>
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
  const [active, setActive] = useState<'home' | 'search' | 'games' | 'cart' | 'menu'>('home');
  const { openSearch } = useSearch();

  const handleHome = () => { setActive('home'); onScrollTo('top'); setMenuOpen(false); };
  const handleSearch = () => {
    setActive('search');
    setMenuOpen(false);
    openSearch();
  };
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

        {/* Games */}
        <Link
          href="/games"
          className="mobile-bottom-nav__item"
          aria-label="View games"
          data-testid="mobile-nav-games"
        >
          <span className="mobile-bottom-nav__icon">
            <Gamepad2 size={20} />
          </span>
          <span className="mobile-bottom-nav__label">Games</span>
        </Link>

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
        existing.price = r.price / 100
      }
    }
  }
  return Array.from(map.values())
}


const heroStages = [
  {
    num: '01',
    badge: 'REIKAI VOID PROTOCOL // DISCOVER',
    title: 'Reikai Arcade',
    p1: 'Power your games. Own your digital world. A premium marketplace for digital gaming products, subscriptions, and accessories.',
    p2: 'Experience the future of digital gaming with instant delivery, secure wallet system, and exclusive offers on game top-ups, gift cards, and more.',
    ctaPrimary: 'Shop The Drop',
    ctaPrimaryTarget: 'browse',
    ctaSecondary: 'Explore Categories',
    ctaSecondaryTarget: 'categories',
  },
  {
    num: '02',
    badge: 'INSTANT PLATFORM RELOAD // SPEED',
    title: 'Power Your Game',
    p1: 'Game top-ups for all major platforms. From mobile hits to PC masterpieces. Fuel your gaming journey with seamless digital delivery.',
    p2: 'Instant code dispatch, 100% verified publisher vouchers, zero waiting time directly to your player account.',
    ctaPrimary: 'Instant Top-Up',
    ctaPrimaryTarget: 'top-up',
    ctaSecondary: 'Browse Games',
    ctaSecondaryTarget: 'browse',
  },
  {
    num: '03',
    badge: 'ENCRYPTED ESCROW // ZERO FRICTION',
    title: 'Digital Wallet',
    p1: 'Next-generation digital gaming wallet with encrypted instant checkout, reward cashback tokens, and multi-currency support.',
    p2: 'Zero transaction friction. Deposit, top-up, and unlock members-only vault drops in a single tap.',
    ctaPrimary: 'Explore Drops',
    ctaPrimaryTarget: 'browse',
    ctaSecondary: 'Protocol Specs',
    ctaSecondaryTarget: 'signal',
  },
  {
    num: '04',
    badge: 'OBSIDIAN SANCTUM // DROPS & PASSES',
    title: 'Play Beyond',
    p1: 'Console games, gift cards, subscriptions, and premium gaming accessories. Everything you need to elevate your gaming experience, all in one cinematic destination.',
    p2: 'Enter the Reikai realm and curate your ultimate digital arsenal with genuine hardware and instant access.',
    ctaPrimary: 'Browse Vault',
    ctaPrimaryTarget: 'browse',
    ctaSecondary: 'Join Frequency',
    ctaSecondaryTarget: 'signal',
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

const HERO_POSES: StagePose[] = [
  // Stage 0: REIKAI ARCADE (Centered frontal hero view with sleek tilt)
  { theta: 184, phi: 43, radius: 1.95, roll: -7, x: 0, y: 0, scale: 1.10 },
  // Stage 1: POWER YOUR GAME (360° spin to back triggers, centered elevated floating)
  { theta: 544, phi: 55, radius: 2.15, roll: 8, x: 0, y: -20, scale: 1.15 },
  // Stage 2: DIGITAL WALLET (180° turn showcasing glowing touchpad & buttons close-up)
  { theta: 724, phi: 30, radius: 1.82, roll: -10, x: 0, y: 16, scale: 1.20 },
  // Stage 3: PLAY BEYOND (Heroic elevated finish)
  { theta: 904, phi: 45, radius: 2.00, roll: 4, x: 0, y: 0, scale: 1.12 },
];

const MOBILE_HERO_POSES: StagePose[] = [
  { theta: 184, phi: 44, radius: 2.25, roll: -5, x: 0, y: 0, scale: 0.82 },
  { theta: 544, phi: 56, radius: 2.40, roll: 6, x: 0, y: 0, scale: 0.80 },
  { theta: 724, phi: 34, radius: 2.15, roll: -6, x: 0, y: 0, scale: 0.84 },
  { theta: 904, phi: 46, radius: 2.30, roll: 4, x: 0, y: 0, scale: 0.82 },
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

  // 4. Exiting: scrolls DOWN and parallax, completely gone (0px -> +110px)
  if (progress >= exitStart && progress < exitEnd) {
    const t = (progress - exitStart) / (exitEnd - exitStart);
    const ease = t * t * (3 - 2 * t);
    return {
      opacity: 1 - ease,
      translateY: ease * 110,
      blur: ease * 8,
      active: ease < 0.5,
    };
  }

  // 5. Completely gone
  return {
    opacity: 0,
    translateY: 110,
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
  const [stagePose, setStagePose] = useState<StagePose>(heroPose);
  const [modelOpacity, setModelOpacity] = useState(1);
  const [signalEmail, setSignalEmail] = useState('');
  const [signalSubscribed, setSignalSubscribed] = useState(false);
  const [heroScrollProgress, setHeroScrollProgress] = useState(0);
  const [activeStage, setActiveStage] = useState(0);
  const heroTrackRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  useScrollAnimations(reducedMotion);

  const jumpToStage = (idx: number) => {
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

    const onScroll = () => {
      const scrollTop = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? Math.min(1, scrollTop / max) : 0);

      const isMobile = window.innerWidth <= 768;

      // Measure multi-stage hero track
      const track = heroTrackRef.current;
      if (track) {
        const rect = track.getBoundingClientRect();
        const trackScrollable = track.offsetHeight - window.innerHeight;
        if (trackScrollable > 0) {
          const rawProgress = -rect.top / trackScrollable;
          const clamped = Math.max(0, Math.min(1, rawProgress));
          setHeroScrollProgress(clamped);

          // Find active / nearest stage center
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

          // Continuous 3D controller interpolation across the 4 hero stages:
          const poses = isMobile ? MOBILE_HERO_POSES : HERO_POSES;
          let segIndex = 0;
          if (clamped >= STAGE_CENTERS[2]) segIndex = 2;
          else if (clamped >= STAGE_CENTERS[1]) segIndex = 1;
          else segIndex = 0;

          const span = (STAGE_CENTERS[segIndex + 1] ?? 1) - STAGE_CENTERS[segIndex];
          const segT = span > 0 ? Math.max(0, Math.min(1, (clamped - STAGE_CENTERS[segIndex]) / span)) : 0;
          const eased = segT * segT * (3 - 2 * segT);
          const p0 = poses[segIndex];
          const p1 = poses[segIndex + 1] ?? poses[segIndex];
          const mix = (a: number, b: number) => a + (b - a) * eased;

          setStagePose({
            theta: mix(p0.theta, p1.theta),
            phi: mix(p0.phi, p1.phi),
            radius: mix(p0.radius, p1.radius),
            roll: mix(p0.roll ?? 0, p1.roll ?? 0),
            x: mix(p0.x, p1.x),
            y: mix(p0.y ?? 0, p1.y ?? 0),
            scale: mix(p0.scale, p1.scale),
          });

          // Smoothly fade out model when scrolling past hero track:
          if (rect.bottom < window.innerHeight) {
            const exitDist = window.innerHeight - rect.bottom;
            const exitFade = Math.max(0, 1 - exitDist / 350);
            setModelOpacity(exitFade);
          } else {
            setModelOpacity(1);
          }
        }
      }
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

          {/* Glowing Halo behind 3D Controller */}
          <div
            className="hero-model-glow-halo"
            style={{
              transform: `translate(calc(-50% + ${stagePose.x * 0.3}vw), calc(-50% + ${(stagePose.y ?? 0) * 0.5}px)) scale(${stagePose.scale})`,
            }}
          />

          {/* Original PS5 Controller 3D Model with Continuous Dynamic Camera Orbit & Rotation */}
          <ModelStage
            orbit={orbit}
            modelScale={modelScale}
            stageX={stageX}
            stageY={stagePose.y ?? 0}
            roll={stageRoll}
            reducedMotion={reducedMotion}
            opacity={modelOpacity}
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

          {/* Left/Center Multi-Phase Story Hero Content (Sequential slow & smooth scroll up / scroll down parallax) */}
          <div className="hero-story-container">
            {heroStages.map((stage, idx) => {
              const motion = getStageMotion(heroScrollProgress, idx);
              const isVisible = motion.opacity > 0.005;
              const y = motion.translateY;

              return (
                <div
                  key={stage.num}
                  className="hero-stage-item"
                  style={{
                    opacity: motion.opacity,
                    filter: motion.blur > 0.15 ? `blur(${motion.blur.toFixed(1)}px)` : 'none',
                    pointerEvents: motion.active ? 'auto' : 'none',
                    visibility: isVisible ? 'visible' : 'hidden',
                  }}
                >
                  {/* Eyebrow badge (Parallax factor 1.3 - moves faster) */}
                  <div
                    className="eyebrow hero-protocol-badge mb-3"
                    style={{
                      transform: `translate3d(0, ${(y * 1.3).toFixed(1)}px, 0)`,
                    }}
                  >
                    <Sparkles size={11} className="text-[#00f0ff]" />
                    <span>{stage.badge}</span>
                  </div>

                  {/* Editorial Headline (Parallax factor 1.0) */}
                  <h1
                    className="hero-editorial-headline hero-editorial-gradient"
                    style={{
                      transform: `translate3d(0, ${y.toFixed(1)}px, 0)`,
                    }}
                  >
                    {stage.title}
                  </h1>

                  {/* Two-Column Paragraphs (Parallax factor 0.75 - subtle drag) */}
                  <div
                    className="hero-two-col-grid"
                    style={{
                      transform: `translate3d(0, ${(y * 0.75).toFixed(1)}px, 0)`,
                    }}
                  >
                    <p className="hero-story-para">{stage.p1}</p>
                    <p className="hero-story-para">{stage.p2}</p>
                  </div>

                  {/* Action Buttons (Parallax factor 0.55 - anchors composition) */}
                  <div
                    className="hero-action-buttons"
                    style={{
                      transform: `translate3d(0, ${(y * 0.55).toFixed(1)}px, 0)`,
                    }}
                  >
                    <button
                      type="button"
                      className="hero-primary-btn"
                      onClick={() => scrollToId(stage.ctaPrimaryTarget, lenis)}
                      data-testid={`button-hero-primary-${idx}`}
                    >
                      <ShoppingCart size={15} />
                      <span>{stage.ctaPrimary}</span>
                      <ArrowRight size={15} />
                    </button>
                    <button
                      type="button"
                      className="hero-secondary-btn"
                      onClick={() => scrollToId(stage.ctaSecondaryTarget, lenis)}
                      data-testid={`button-hero-secondary-${idx}`}
                    >
                      <Globe size={15} />
                      <span>{stage.ctaSecondary}</span>
                    </button>
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
                  key={s.num}
                  type="button"
                  className={`hero-stage-pill ${activeStage === idx ? 'active' : ''}`}
                  onClick={() => jumpToStage(idx)}
                  aria-label={`Jump to stage ${s.title}`}
                >
                  {s.num} {s.title.split(' ')[0].toUpperCase()}
                </button>
              ))}
            </div>
            <div className="hero-stage-indicator-bar" aria-hidden="true">
              <div
                className="hero-stage-indicator-fill"
                style={{ width: `${heroScrollProgress * 100}%` }}
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
          {filter === 'all' && !catalogSearch ? (
            <div className="store-shelves-wrap flex flex-col gap-12 w-full">
              {/* 1. TOP GAMES */}
              <div className="store-shelf-section">
                <div className="store-shelf-header">
                  <div className="store-shelf-title-wrap">
                    <span className="store-shelf-badge">
                      <Gamepad2 size={13} /> 01 // Blockbuster Exclusives
                    </span>
                    <h3 className="store-shelf-title">Top <span>PS5 Games</span></h3>
                    <p className="store-shelf-desc">Next-gen titles, 4K 60FPS ray tracing &amp; official physical discs.</p>
                  </div>
                  <Link href="/games" className="store-shelf-view-more" data-testid="link-view-more-games">
                    <span>View More Games</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="product-grid" data-testid="grid-top-games">
                  {gamesProducts.slice(0, 4).map((p) => (
                    <ProductCard key={p.id} product={p} onAdd={addToCart} />
                  ))}
                </div>
              </div>

              {/* 2. GAME TOP-UPS */}
              <div className="store-shelf-section">
                <div className="store-shelf-header">
                  <div className="store-shelf-title-wrap">
                    <span className="store-shelf-badge">
                      <Zap size={13} /> 02 // Instant In-Game Currency
                    </span>
                    <h3 className="store-shelf-title">Game <span>Top-Ups</span></h3>
                    <p className="store-shelf-desc">Fast, secure direct ID top-ups for Valorant, PUBG Mobile, Genshin &amp; Free Fire.</p>
                  </div>
                  <Link href="/top-up" className="store-shelf-view-more" data-testid="link-view-more-topups">
                    <span>View More Top-Ups</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="product-grid" data-testid="grid-top-ups">
                  {topUpProducts.slice(0, 4).map((p) => (
                    <ProductCard key={p.id} product={p} onAdd={addToCart} />
                  ))}
                </div>
              </div>

              {/* 3. HARDWARE & ACCESSORIES */}
              <div className="store-shelf-section">
                <div className="store-shelf-header">
                  <div className="store-shelf-title-wrap">
                    <span className="store-shelf-badge">
                      <Headphones size={13} /> 03 // Pro Esports Gear
                    </span>
                    <h3 className="store-shelf-title">Accessories &amp; <span>Hardware</span></h3>
                    <p className="store-shelf-desc">DualSense Edge controllers, spatial audio headsets &amp; click-in charging docks.</p>
                  </div>
                  <Link href="/accessories" className="store-shelf-view-more" data-testid="link-view-more-accessories">
                    <span>View More Accessories</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="product-grid" data-testid="grid-accessories">
                  {gearProducts.slice(0, 4).map((p) => (
                    <ProductCard key={p.id} product={p} onAdd={addToCart} />
                  ))}
                </div>
              </div>

              {/* 4. GAMING SUBSCRIPTIONS */}
              <div className="store-shelf-section">
                <div className="store-shelf-header">
                  <div className="store-shelf-title-wrap">
                    <span className="store-shelf-badge">
                      <Crown size={13} /> 04 // Passes &amp; Memberships
                    </span>
                    <h3 className="store-shelf-title">Gaming <span>Subscriptions</span></h3>
                    <p className="store-shelf-desc">PlayStation Plus Deluxe, Xbox Game Pass Ultimate &amp; EA Play instant passes.</p>
                  </div>
                  <Link href="/subscriptions" className="store-shelf-view-more" data-testid="link-view-more-subscriptions">
                    <span>View More Subscriptions</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="product-grid" data-testid="grid-subscriptions">
                  {subscriptionProducts.slice(0, 4).map((p) => (
                    <ProductCard key={p.id} product={p} onAdd={addToCart} />
                  ))}
                </div>
              </div>

              {/* 5. DIGITAL GIFT CARDS */}
              <div className="store-shelf-section">
                <div className="store-shelf-header">
                  <div className="store-shelf-title-wrap">
                    <span className="store-shelf-badge">
                      <Gift size={13} /> 05 // Store Balances &amp; Wallets
                    </span>
                    <h3 className="store-shelf-title">Digital <span>Gift Cards</span></h3>
                    <p className="store-shelf-desc">PlayStation Network, Steam Wallet, Apple &amp; Google Play prepaid cards.</p>
                  </div>
                  <Link href="/gift-cards" className="store-shelf-view-more" data-testid="link-view-more-giftcards">
                    <span>View More Gift Cards</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="product-grid" data-testid="grid-gift-cards">
                  {giftCardProducts.slice(0, 4).map((p) => (
                    <ProductCard key={p.id} product={p} onAdd={addToCart} />
                  ))}
                </div>
              </div>
            </div>
          ) : (
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
          )}
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
                  REIKAI <span className="wordmark-highlight text-[#00f0ff] drop-shadow-[0_0_12px_rgba(0,240,255,0.7)]">ARCADE</span>
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
