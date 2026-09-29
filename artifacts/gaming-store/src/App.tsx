import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArrowDownRight, ArrowRight, ChevronDown, ChevronUp, Gamepad2, Menu, Minus, Plus, Search, ShoppingBag, Sparkles, X, Zap } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

type Product = {
  id: string;
  name: string;
  type: 'consoles' | 'games' | 'gear' | 'top-ups';
  label: string;
  price: number;
  glyph: string;
  wash: string;
};

type CartItem = Product & { quantity: number };

type StagePose = {
  x: number;
  scale: number;
  theta: number;
  phi: number;
  radius: number;
};

const heroPose: StagePose = { x: 0, scale: 0.94, theta: 0, phi: 90, radius: 2.45 };

const queryClient = new QueryClient();

const products: Product[] = [
  { id: 'pulse-pro', name: 'Pulse 3D Wireless Headset', type: 'gear', label: 'Setup gear', price: 89.99, glyph: 'PULSE', wash: 'hsl(192 65% 63% / .25)' },
  { id: 'astro-bot', name: 'Astro Bot / PS5', type: 'games', label: 'New release', price: 59.99, glyph: 'ASTRO', wash: 'hsl(283 54% 70% / .25)' },
  { id: 'dual-sense', name: 'DualSense Wireless Controller', type: 'gear', label: 'Controllers', price: 74.99, glyph: 'DS', wash: 'hsl(8 100% 65% / .24)' },
  { id: 'ps5-slim', name: 'PlayStation 5 Slim / Disc', type: 'consoles', label: 'Console', price: 499.99, glyph: 'PS5', wash: 'hsl(70 83% 64% / .2)' },
  { id: 'elden-ring', name: 'Elden Ring / Shadow Edition', type: 'games', label: 'RPG', price: 69.99, glyph: 'ER', wash: 'hsl(38 100% 66% / .22)' },
  { id: 'charging-station', name: 'DualSense Charging Station', type: 'gear', label: 'Setup gear', price: 29.99, glyph: 'CHG', wash: 'hsl(192 65% 63% / .2)' },
  { id: 'wallet-50', name: 'PlayStation Store Wallet / $50', type: 'top-ups', label: 'Digital top-up', price: 50, glyph: '$50', wash: 'hsl(8 100% 65% / .22)' },
  { id: 'spider-man', name: 'Marvel’s Spider-Man 2', type: 'games', label: 'PS5 exclusive', price: 69.99, glyph: 'SM2', wash: 'hsl(283 54% 70% / .2)' },
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

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function ModelStage({ orbit, modelScale, parallax, stageX, reducedMotion }: { orbit: string; modelScale: number; parallax: number; stageX: number; reducedMotion: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [webglSupported] = useState(() => supportsWebGL());
  const [ready, setReady] = useState(!webglSupported);
  const [failed, setFailed] = useState(false);
  const modelRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!webglSupported) return;
    let active = true;
    const mount = () => {
      if (!active || !hostRef.current || modelRef.current) return;
      try {
        const model = document.createElement('model-viewer');
        model.setAttribute('src', `${import.meta.env.BASE_URL}ps5.glb`);
        model.setAttribute('alt', 'A white PlayStation 5 DualSense controller facing forward');
        model.setAttribute('camera-controls', '');
        model.setAttribute('disable-zoom', '');
        model.setAttribute('interaction-prompt', 'none');
        model.setAttribute('shadow-intensity', '1.1');
        model.setAttribute('exposure', '1.05');
        model.setAttribute('camera-orbit', orbit);
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
  }, [webglSupported]);

  useEffect(() => {
    if (modelRef.current) modelRef.current.setAttribute('camera-orbit', orbit);
  }, [orbit]);

  const dockStyle = {
    '--parallax': `${reducedMotion ? 0 : parallax}px`,
    '--model-scale': `${modelScale}`,
    '--stage-x': `${stageX}vw`,
  } as CSSProperties;

  return (
    <div className="model-dock" style={dockStyle} aria-label="Interactive PS5 controller model">
      {webglSupported && <div ref={hostRef} className="model-host" style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1 }} />}
      {(!webglSupported || !ready || failed) && (
        <div className="model-fallback">
          <div className="fallback-controller" aria-hidden="true">
            <span className="fallback-touchpad" />
            <span className="fallback-stick fallback-stick-left" />
            <span className="fallback-stick fallback-stick-right" />
            <span className="fallback-buttons">△ ○<br />× □</span>
            <i className="fallback-light" />
          </div>
          <p><strong>{!webglSupported ? '2D / READY' : failed ? 'MODEL / ALT' : 'LOADING / 3D'}</strong>{!webglSupported ? '3D is unavailable here. The store preview still plays on.' : failed ? 'The 3D model is unavailable. The store preview still plays on.' : 'Preparing the controller for your next session.'}</p>
        </div>
      )}
      <div className="model-credit">
        Model <a href="https://sketchfab.com/3d-models/ps5-f0b4a0131f784059b0b339d2911478f3" target="_blank" rel="noreferrer">“Ps5” by KIARASH 3D</a> · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>
      </div>
    </div>
  );
}

function Header({ cartCount, onCart, reducedMotion, onMotionToggle }: { cartCount: number; onCart: () => void; reducedMotion: boolean; onMotionToggle: () => void }) {
  const [mobileNav, setMobileNav] = useState(false);
  return (
    <>
      <div className="topline">
        <div className="mx-auto flex max-w-[1380px] items-center justify-center px-5 py-2 text-center font-mono-ui text-[.58rem] uppercase tracking-[.13em] text-[hsl(var(--muted-foreground))]">
        Sample catalog · Demo pricing <span className="mx-3 text-[hsl(var(--primary))]">/</span> Preview store · Checkout not connected
        </div>
      </div>
      <header className="site-header">
        <div className="header-inner">
          <button type="button" className="wordmark border-0 bg-transparent p-0" onClick={() => scrollToId('top')} data-testid="button-home">
            LEVEL <span>/</span> UP
          </button>
          <nav className="header-nav" aria-label="Main navigation">
            <a href="#browse" data-testid="link-shop">Shop</a>
            <a href="#categories" data-testid="link-categories">Categories</a>
            <a href="/top-up" data-testid="link-top-up">Top-up</a>
            <a href="/gift-cards" data-testid="link-gift-cards">Gift cards</a>
          </nav>
          <div className="header-actions">
            <button type="button" className="header-icon-button mobile-only" aria-label="Open navigation" onClick={() => setMobileNav((open) => !open)} data-testid="button-mobile-menu"><Menu size={16} /></button>
            <button type="button" className="header-icon-button" onClick={onMotionToggle} aria-label={reducedMotion ? 'Enable motion' : 'Reduce motion'} data-testid="button-motion-toggle">
              <Sparkles size={14} /> <span className="hidden sm:inline">{reducedMotion ? 'Still' : 'Motion'}</span>
            </button>
            <button type="button" className="header-icon-button" onClick={() => scrollToId('browse')} aria-label="Search products" data-testid="button-search"><Search size={15} /></button>
            <button type="button" className="header-icon-button" onClick={onCart} aria-label={`Open cart with ${cartCount} items`} data-testid="button-open-cart">
              <ShoppingBag size={15} /><span className="hidden sm:inline">Bag</span><span className="cart-count" data-testid="text-cart-count">{cartCount}</span>
            </button>
          </div>
        </div>
        {mobileNav && (
          <div className="absolute left-0 right-0 top-full border-b border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 md:hidden">
            <a href="#browse" onClick={() => setMobileNav(false)} className="block border-b border-[hsl(var(--border))] py-3 font-mono-ui text-xs uppercase tracking-[.12em]" data-testid="link-mobile-shop">Shop</a>
            <a href="#categories" onClick={() => setMobileNav(false)} className="block border-b border-[hsl(var(--border))] py-3 font-mono-ui text-xs uppercase tracking-[.12em]" data-testid="link-mobile-categories">Categories</a>
            <a href="/top-up" onClick={() => setMobileNav(false)} className="block border-b border-[hsl(var(--border))] py-3 font-mono-ui text-xs uppercase tracking-[.12em]" data-testid="link-mobile-top-up">Top-up</a>
            <a href="/gift-cards" onClick={() => setMobileNav(false)} className="block py-3 font-mono-ui text-xs uppercase tracking-[.12em]" data-testid="link-mobile-gift-cards">Gift cards</a>
          </div>
        )}
      </header>
    </>
  );
}

function ProductCard({ product, onAdd }: { product: Product; onAdd: (product: Product) => void }) {
  return (
    <article className="product-card" data-testid={`card-product-${product.id}`}>
      <div className="product-art" style={{ '--product-wash': product.wash } as CSSProperties}>
        <div className="product-glyph"><span>{product.glyph}</span></div>
      </div>
      <div className="product-info">
        <div className="product-type">{product.label}</div>
        <h3 className="product-name" data-testid={`text-product-${product.id}`}>{product.name}</h3>
        <div className="product-bottom">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button type="button" className="add-button" onClick={() => onAdd(product)} aria-label={`Add ${product.name} to bag`} data-testid={`button-add-${product.id}`}><Plus size={17} /></button>
        </div>
      </div>
    </article>
  );
}

function CartPanel({ cart, onClose, onChangeQuantity, onRemove }: { cart: CartItem[]; onClose: () => void; onChangeQuantity: (id: string, delta: number) => void; onRemove: (id: string) => void }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return (
    <div className="cart-overlay" role="dialog" aria-modal="true" aria-label="Shopping bag" onClick={onClose} data-testid="dialog-cart">
      <aside className="cart-panel" onClick={(event) => event.stopPropagation()}>
        <div className="cart-head">
          <div><div className="section-kicker">Your loadout</div><h2>Bag / {cart.reduce((sum, item) => sum + item.quantity, 0)}</h2></div>
          <button type="button" className="cart-close" onClick={onClose} aria-label="Close shopping bag" data-testid="button-close-cart"><X size={17} /></button>
        </div>
        <div className="cart-note">This is a client-side bag preview. Checkout and payment are not connected in this MVP.</div>
        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="cart-empty"><div><strong>Bag is quiet.</strong><span>Add a drop and keep the session going.</span></div></div>
          ) : cart.map((item) => (
            <div className="cart-item" key={item.id} data-testid={`row-cart-${item.id}`}>
              <div className="cart-thumb">{item.glyph}</div>
              <div>
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</div>
                <div className="quantity-controls">
                  <button type="button" onClick={() => onChangeQuantity(item.id, -1)} aria-label={`Decrease ${item.name}`} data-testid={`button-decrease-${item.id}`}><Minus size={12} /></button>
                  <span data-testid={`text-quantity-${item.id}`}>{item.quantity}</span>
                  <button type="button" onClick={() => onChangeQuantity(item.id, 1)} aria-label={`Increase ${item.name}`} data-testid={`button-increase-${item.id}`}><Plus size={12} /></button>
                </div>
              </div>
              <button type="button" className="cart-close" onClick={() => onRemove(item.id)} aria-label={`Remove ${item.name}`} data-testid={`button-remove-${item.id}`}><X size={14} /></button>
            </div>
          ))}
        </div>
        {cart.length > 0 && <><div className="cart-total"><span>Sample total</span><strong>${total.toFixed(2)}</strong></div><button type="button" className="button-primary w-full" onClick={onClose} data-testid="button-keep-shopping">Keep browsing <ArrowRight size={15} /></button></>}
      </aside>
    </div>
  );
}

function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [filter, setFilter] = useState<'all' | Product['type']>('all');
  const [cartOpen, setCartOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [stagePose, setStagePose] = useState<StagePose>(heroPose);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(media.matches);
    const onPreference = () => setReducedMotion(media.matches);
    media.addEventListener('change', onPreference);
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? Math.min(1, scrollTop / max) : 0);

      const categoryX = window.innerWidth <= 720 ? -16 : -52;
      const stops: { selector: string; pose: StagePose }[] = [
        { selector: '.hero', pose: heroPose },
        { selector: '#categories', pose: { x: categoryX, scale: 1.04, theta: 28, phi: 78, radius: 2.3 } },
        { selector: '#browse', pose: { x: 0, scale: 0.88, theta: -16, phi: 88, radius: 2.55 } },
      ];
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
      });
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

  const filteredProducts = useMemo(() => filter === 'all' ? products : products.filter((product) => product.type === filter), [filter]);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const addToCart = (product: Product) => setCart((current) => {
    const found = current.find((item) => item.id === product.id);
    if (found) return current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
    return [...current, { ...product, quantity: 1 }];
  });
  const changeQuantity = (id: string, delta: number) => setCart((current) => current.flatMap((item) => item.id === id ? (item.quantity + delta > 0 ? [{ ...item, quantity: item.quantity + delta }] : []) : [item]));
  const setCategory = (category: 'all' | Product['type']) => {
    setFilter(category);
    scrollToId('browse');
  };
  const orbit = reducedMotion ? '0deg 90deg 2.45m' : `${stagePose.theta.toFixed(1)}deg ${stagePose.phi.toFixed(1)}deg ${stagePose.radius.toFixed(2)}m`;
  const modelScale = reducedMotion ? 0.95 : stagePose.scale;
  const parallax = Math.sin(scrollProgress * Math.PI * 2) * 24;
  const stageX = reducedMotion ? 0 : stagePose.x;

  return (
    <main className="site-shell noise" id="top">
      <Header cartCount={cartCount} onCart={() => setCartOpen(true)} reducedMotion={reducedMotion} onMotionToggle={() => setReducedMotion((value) => !value)} />
      <ModelStage orbit={orbit} modelScale={modelScale} parallax={parallax} stageX={stageX} reducedMotion={reducedMotion} />

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-grid">
          <div className="hero-copy reveal">
            <div className="eyebrow"><Zap size={13} /> The new game store</div>
            <h1 id="hero-title">Play<br /><em>louder.</em></h1>
            <p className="hero-intro">Consoles, cult classics, and the gear that turns a room into a reason to stay up. Pick your next obsession.</p>
            <div className="hero-ctas">
              <button type="button" className="button-primary" onClick={() => scrollToId('browse')} data-testid="button-shop-the-drop">Shop the drop <ArrowDownRight size={16} /></button>
              <button type="button" className="button-quiet" onClick={() => scrollToId('categories')} data-testid="button-explore-categories">Explore the world</button>
            </div>
            <div className="hero-stats">
              <div className="hero-stat"><strong>04</strong><span>worlds to browse</span></div>
              <div className="hero-stat"><strong>08</strong><span>fresh drops</span></div>
              <div className="hero-stat"><strong>01</strong><span>next main quest</span></div>
            </div>
          </div>
        </div>
        <div className="scroll-mark"><i /> Scroll to shift the loadout</div>
      </section>

      <div className="marquee" aria-label="Store highlights">
        <div className="marquee-track">
          {[0, 1].map((copy) => <span key={copy}>NEW GAMES / CLEAN SETUPS <i /> TOP UPS / ZERO FRICTION <i /> PLAY LOUDER <i /> LEVEL / UP <i /></span>)}
        </div>
      </div>

      <section className="section category-section" id="categories" aria-labelledby="categories-title">
        <div className="section-inner category-layout">
          <div>
            <div className="section-kicker">01 / Pick your lane</div>
            <h2 className="section-title" id="categories-title">Find your<br /><span>next level.</span></h2>
            <p className="section-lead">The setup is personal. Start with the thing you cannot stop thinking about, then build out from there.</p>
            <div className="category-list">
              <button type="button" className="category-row w-full bg-transparent text-left" onClick={() => setCategory('consoles')} data-testid="button-category-consoles"><span>Consoles</span><small>01 / HARDWARE <ArrowRight size={16} /></small></button>
              <button type="button" className="category-row w-full bg-transparent text-left" onClick={() => setCategory('games')} data-testid="button-category-games"><span>Games</span><small>02 / STORIES <ArrowRight size={16} /></small></button>
              <button type="button" className="category-row w-full bg-transparent text-left" onClick={() => setCategory('gear')} data-testid="button-category-gear"><span>Setup gear</span><small>03 / FEEL <ArrowRight size={16} /></small></button>
              <button type="button" className="category-row w-full bg-transparent text-left" onClick={() => setCategory('top-ups')} data-testid="button-category-topups"><span>Digital top-ups</span><small>04 / MORE TIME <ArrowRight size={16} /></small></button>
            </div>
          </div>
          <div className="category-art" aria-label="Abstract artwork for the category section">
            <div className="art-caption"><strong>Play<br />your way.</strong><span>THE ONLY RIGHT SETUP IS YOURS</span></div>
          </div>
        </div>
      </section>

      <section className="section browse-section" id="browse" aria-labelledby="browse-title">
        <div className="section-inner">
          <div className="browse-head">
            <div>
              <div className="section-kicker">02 / The current drop</div>
              <h2 className="section-title" id="browse-title">Good stuff.<br /><span>Right now.</span></h2>
            </div>
            <div className="filter-bar" role="group" aria-label="Filter products">
              {filterLabels.map((item) => <button type="button" key={item.id} className={`filter-button ${filter === item.id ? 'active' : ''}`} onClick={() => setFilter(item.id)} data-testid={`button-filter-${item.id}`}>{item.label}</button>)}
            </div>
          </div>
          <div className="product-grid" data-testid="grid-products">
            {filteredProducts.map((product) => <ProductCard key={product.id} product={product} onAdd={addToCart} />)}
          </div>
        </div>
      </section>

      <section className="section feature-section" aria-labelledby="feature-title">
        <div className="section-inner feature-layout">
          <div className="feature-copy">
            <div className="section-kicker">03 / The setup edit</div>
            <h2 id="feature-title">Make room<br />for <span>one more.</span></h2>
            <p>A great setup does not need to look like a spaceship. It needs the right screen, the right controller, and a game you will still talk about next week.</p>
            <button type="button" className="button-primary" onClick={() => setCategory('gear')} data-testid="button-build-setup">Build the setup <ArrowRight size={16} /></button>
          </div>
          <div className="feature-stack" aria-label="Featured setup cards">
            <div className="feature-card" data-label="SCREEN / SOUND"><span className="card-index">DROP 01</span></div>
            <div className="feature-card" data-label="FEEL / FLOW"><span className="card-index">DROP 02</span></div>
          </div>
        </div>
      </section>

      <section className="signal-section" id="signal" aria-labelledby="signal-title">
        <div className="signal-inner">
          <div><div className="section-kicker" style={{ color: 'hsl(var(--primary-foreground) / .7)' }}>04 / Keep your signal</div><h2 className="signal-title" id="signal-title">Do not miss<br />the drop.</h2></div>
          <p className="signal-copy">A sample lineup of games, hardware, setup gear, and top-ups—ready to explore. The catalog and prices are placeholders; checkout is not connected yet.</p>
          <button type="button" className="button-primary" onClick={() => scrollToId('browse')} data-testid="button-browse-signal">Browse the drops <ArrowRight size={15} /></button>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div><button type="button" className="wordmark border-0 bg-transparent p-0" onClick={() => scrollToId('top')} data-testid="button-footer-home">LEVEL <span>/</span> UP</button><p className="footer-blurb">A storefront for the games, hardware, and little upgrades that make the night yours.</p></div>
            <div className="footer-links">
              <div><h3>Navigate</h3><a href="#browse" data-testid="link-footer-shop">Shop</a><a href="#categories" data-testid="link-footer-categories">Categories</a><a href="#signal" data-testid="link-footer-signal">Signal</a></div>
              <div><h3>Small print</h3><a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer" data-testid="link-footer-license">Model license</a><a href="#top" data-testid="link-footer-accessibility">Accessibility</a><a href="#top" data-testid="link-footer-status">Store status</a></div>
            </div>
          </div>
          <div className="footer-bottom"><span>© 2025 LEVEL / UP · FRONTEND MVP</span><span>Made for people who press start.</span></div>
        </div>
      </footer>

      {cartOpen && <CartPanel cart={cart} onClose={() => setCartOpen(false)} onChangeQuantity={changeQuantity} onRemove={(id) => setCart((current) => current.filter((item) => item.id !== id))} />}
    </main>
  );
}

const topUpProducts: Product[] = [
  { id: 'wallet-10', name: 'PlayStation Store Wallet / $10', type: 'top-ups', label: 'Digital top-up', price: 10, glyph: '$10', wash: 'hsl(192 65% 63% / .28)' },
  { id: 'wallet-25', name: 'PlayStation Store Wallet / $25', type: 'top-ups', label: 'Digital top-up', price: 25, glyph: '$25', wash: 'hsl(70 83% 64% / .24)' },
  { id: 'wallet-50', name: 'PlayStation Store Wallet / $50', type: 'top-ups', label: 'Digital top-up', price: 50, glyph: '$50', wash: 'hsl(8 100% 65% / .28)' },
  { id: 'wallet-100', name: 'PlayStation Store Wallet / $100', type: 'top-ups', label: 'Digital top-up', price: 100, glyph: '$100', wash: 'hsl(283 54% 70% / .28)' },
];

const giftCardProducts: Product[] = [
  { id: 'gift-25', name: 'ReiKai Gift Card / $25', type: 'top-ups', label: 'Gift card', price: 25, glyph: 'GIFT', wash: 'hsl(8 100% 65% / .28)' },
  { id: 'gift-50', name: 'ReiKai Gift Card / $50', type: 'top-ups', label: 'Gift card', price: 50, glyph: 'GIFT', wash: 'hsl(192 65% 63% / .28)' },
  { id: 'gift-100', name: 'ReiKai Gift Card / $100', type: 'top-ups', label: 'Gift card', price: 100, glyph: 'GIFT', wash: 'hsl(70 83% 64% / .24)' },
];

function CollectionPage({ kind, products: collection }: { kind: 'top-up' | 'gift-cards'; products: Product[] }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const isGift = kind === 'gift-cards';
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const addToCart = (product: Product) => setCart((current) => {
    const found = current.find((item) => item.id === product.id);
    return found ? current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { ...product, quantity: 1 }];
  });
  const changeQuantity = (id: string, delta: number) => setCart((current) => current.flatMap((item) => item.id === id ? (item.quantity + delta > 0 ? [{ ...item, quantity: item.quantity + delta }] : []) : [item]));

  return (
    <main className="site-shell noise collection-page">
      <Header cartCount={cartCount} onCart={() => setCartOpen(true)} reducedMotion={false} onMotionToggle={() => undefined} />
      <section className="collection-hero">
        <div className="collection-hero-inner">
          <div className="section-kicker">{isGift ? '02 / Pass the controller' : '01 / Keep playing'}</div>
          <h1>{isGift ? <>Give the<br /><span>good stuff.</span></> : <>Top up.<br /><span>Play on.</span></>}</h1>
          <p>{isGift ? 'A little extra fuel for the player in your life. Choose a value, send a card, and let them pick their next level.' : 'Instant digital credit for your PlayStation wallet. No waiting, no friction, just more time in the worlds you love.'}</p>
          <div className="collection-meta"><span>INSTANT DELIVERY</span><span>SECURE CHECKOUT</span><span>NO EXPIRY</span></div>
        </div>
        <div className={`collection-orb ${isGift ? 'gift-orb' : ''}`} aria-hidden="true"><span>{isGift ? 'GIFT' : 'TOP / UP'}</span></div>
      </section>
      <section className="section collection-products" aria-labelledby="collection-title">
        <div className="section-inner">
          <div className="collection-heading"><div><div className="section-kicker">{isGift ? 'Gift values' : 'Wallet values'}</div><h2 className="section-title" id="collection-title">Choose your<br /><span>amount.</span></h2></div><p className="section-lead">{isGift ? 'Every card is delivered digitally and ready to make someone’s next session better.' : 'Codes are delivered digitally after checkout and can be redeemed on your account.'}</p></div>
          <div className="product-grid collection-grid">{collection.map((product) => <ProductCard key={product.id} product={product} onAdd={addToCart} />)}</div>
        </div>
      </section>
      <section className="collection-note"><div><div className="section-kicker">Built for zero friction</div><h2>More game.<br /><span>Less wait.</span></h2></div><p>Digital products keep the session moving. Pick a value, add it to your bag, and we’ll take care of the rest.</p></section>
      <footer className="site-footer"><div className="footer-inner"><div className="footer-bottom"><span>© 2025 LEVEL / UP · FRONTEND MVP</span><span>Made for people who press start.</span></div></div></footer>
      {cartOpen && <CartPanel cart={cart} onClose={() => setCartOpen(false)} onChangeQuantity={changeQuantity} onRemove={(id) => setCart((current) => current.filter((item) => item.id !== id))} />}
    </main>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/top-up" component={() => <CollectionPage kind="top-up" products={topUpProducts} />} />
        <Route path="/gift-cards" component={() => <CollectionPage kind="gift-cards" products={giftCardProducts} />} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
