'use client';

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, X, ShoppingBag, ArrowRight, Sparkles, Gamepad2, Zap, Check, CornerDownLeft } from 'lucide-react';
import { ALL_PRODUCTS, formatTaka, type Product } from '@/lib/products';
import { useCart } from '@/components/cart-context';
import { normalizeProductImageUrl } from '@/lib/utils';

type SearchContextType = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  openSearch: (initialQuery?: string) => void;
  closeSearch: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}

const POPULAR_SEARCHES = [
  'Astro Bot',
  'DualSense Edge',
  'Elden Ring',
  'PlayStation 5 Slim',
  'Pulse Elite',
  'Gift Card',
  'God of War',
  'Spider-Man',
];

const CATEGORY_TABS: { id: 'all' | 'games' | 'gear' | 'consoles' | 'top-ups'; label: string }[] = [
  { id: 'all', label: 'All Items' },
  { id: 'games', label: 'PS5 Games' },
  { id: 'gear', label: 'Accessories' },
  { id: 'consoles', label: 'Consoles' },
  { id: 'top-ups', label: 'Top-ups & Cards' },
];

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'games' | 'gear' | 'consoles' | 'top-ups'>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [liveCatalog, setLiveCatalog] = useState<Product[]>(ALL_PRODUCTS);
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { addToCart } = useCart();

  const openSearch = (initialQuery = '') => {
    setSearchQuery(initialQuery);
    setSelectedIndex(0);
    setIsOpen(true);
  };

  const closeSearch = () => {
    setIsOpen(false);
  };

  // Fetch live API products to enrich static catalog if available
  useEffect(() => {
    fetch('/api/catalog')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const map = new Map<string, Product>();
          ALL_PRODUCTS.forEach((p) => map.set(p.id, p));

          // Group rows by slug since API returns one row per variant
          const grouped = new Map<string, any>();
          data.forEach((r: any) => {
            const key = r.slug || r.id;
            if (!grouped.has(key)) {
              grouped.set(key, { ...r, _totalStock: 0 });
            }
            const g = grouped.get(key)!;
            g._totalStock += r.stockQuantity ?? 0;
          });

          grouped.forEach((r, id) => {
            const mappedType = r.type === 'game' ? 'games' : 'gear';
            const mappedCategory = r.type === 'game' ? 'games' : 'accessories';
            const price = (r.price ?? 0) / 100;

            if (!map.has(id)) {
              map.set(id, {
                id,
                name: r.name,
                type: mappedType,
                category: mappedCategory,
                subCategory: r.category || (r.type === 'game' ? 'PS5 Game' : 'Gear'),
                label: r.brand || (r.type === 'game' ? 'PS5 Game' : 'Gear'),
                price: price > 0 ? price : 59.99,
                glyph: (r.slug || r.name).slice(0, 4).toUpperCase(),
                wash: r.type === 'game' ? 'hsl(272 90% 68% / .32)' : 'hsl(285 85% 72% / .32)',
                badge: r.featured ? 'FEATURED DROP' : undefined,
                spec: r.platform || '',
                coverImage: normalizeProductImageUrl(r.imageUrl, r.type),
                rating: r.rating || 4.9,
                reviewsCount: r.reviewCount || 100,
                inStock: r._totalStock > 0,
                shortDesc: r.shortDescription || '',
                fullDesc: r.description || '',
                features: Array.isArray(r.features) ? r.features : [],
                specs: r.specs && typeof r.specs === 'object'
                  ? Object.entries(r.specs).map(([label, value]) => ({ label, value: String(value) }))
                  : [],
              });
            }
          });

          setLiveCatalog(Array.from(map.values()));
        }
      })
      .catch(() => {});
  }, []);

  // Global keyboard shortcuts (Ctrl+K, Cmd+K, /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }

      // '/' to search (if not typing in an editable field)
      if (e.key === '/' && !isOpen) {
        const target = e.target as HTMLElement | null;
        const isEditable =
          target?.tagName === 'INPUT' ||
          target?.tagName === 'TEXTAREA' ||
          target?.isContentEditable;
        if (!isEditable) {
          e.preventDefault();
          openSearch();
        }
      }

      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        closeSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Lock scroll and focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  // Filtered search results
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return liveCatalog.filter((item) => {
      // Category filter
      if (activeCategory !== 'all') {
        if (activeCategory === 'gear' && item.type !== 'gear' && item.category !== 'accessories') {
          return false;
        } else if (activeCategory === 'games' && item.type !== 'games' && item.category !== 'games') {
          return false;
        } else if (activeCategory === 'consoles' && item.type !== 'consoles' && item.category !== 'consoles') {
          return false;
        } else if (activeCategory === 'top-ups' && item.type !== 'top-ups' && item.category !== 'top-ups') {
          return false;
        }
      }

      // Text query match
      if (!q) return true;

      const nameMatch = item.name.toLowerCase().includes(q);
      const labelMatch = (item.label || '').toLowerCase().includes(q);
      const subCatMatch = (item.subCategory || '').toLowerCase().includes(q);
      const descMatch = (item.shortDesc || '').toLowerCase().includes(q);
      const badgeMatch = (item.badge || '').toLowerCase().includes(q);
      const platformMatch = (item.spec || '').toLowerCase().includes(q);

      return nameMatch || labelMatch || subCatMatch || descMatch || badgeMatch || platformMatch;
    });
  }, [liveCatalog, searchQuery, activeCategory]);

  // Keyboard navigation within list
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : Math.max(0, searchResults.length - 1)));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = searchResults[selectedIndex];
      if (current) {
        handleNavigateToProduct(current);
      }
    }
  };

  const getItemHref = (product: Product) => {
    if (product.type === 'games' || product.category === 'games') {
      return `/games/${product.id}`;
    }
    if (product.type === 'gear' || product.category === 'accessories') {
      return `/accessories/${product.id}`;
    }
    if (product.type === 'top-ups' || product.category === 'top-ups') {
      return '/top-up';
    }
    return `/#browse`;
  };

  const handleNavigateToProduct = (product: Product) => {
    closeSearch();
    const href = getItemHref(product);
    router.push(href);
  };

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.coverImage || null,
      type: product.type,
      glyph: product.glyph,
    });
    setAddedItemIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1600);
  };

  return (
    <SearchContext.Provider
      value={{
        isOpen,
        setIsOpen,
        openSearch,
        closeSearch,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}

      {/* Global Interactive Search Modal */}
      {isOpen && (
        <div
          className="search-modal-backdrop"
          onClick={closeSearch}
          role="dialog"
          aria-modal="true"
          aria-label="Search ReiKai Arcade"
        >
          <div
            className="search-modal-box"
            onClick={(e) => e.stopPropagation()}
            data-testid="search-modal"
          >
            {/* Top Search Input Bar */}
            <div className="search-modal-header">
              <Search className="search-modal-icon" size={20} />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleInputKeyDown}
                placeholder="Search games, accessories, hardware, top-ups..."
                className="search-modal-input"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck="false"
                data-testid="search-modal-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedIndex(0);
                    inputRef.current?.focus();
                  }}
                  className="search-modal-clear-btn"
                  aria-label="Clear query"
                >
                  <X size={16} />
                </button>
              )}
              <button
                type="button"
                onClick={closeSearch}
                className="search-modal-close-btn"
                aria-label="Close search"
              >
                <span className="hidden sm:inline text-xs font-mono">ESC</span>
                <X size={18} className="sm:hidden" />
              </button>
            </div>

            {/* Quick Category Filter Pills */}
            <div className="search-modal-categories" role="tablist" aria-label="Search categories">
              {CATEGORY_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === tab.id}
                  className={`search-modal-cat-pill ${activeCategory === tab.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCategory(tab.id);
                    setSelectedIndex(0);
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Suggestions or Results */}
            <div className="search-modal-body">
              {!searchQuery.trim() && (
                <div className="search-modal-suggestions">
                  <div className="search-suggestions-title">
                    <Sparkles size={13} className="text-[#c084fc]" />
                    <span>POPULAR SEARCHES</span>
                  </div>
                  <div className="search-chips-list">
                    {POPULAR_SEARCHES.map((term) => (
                      <button
                        key={term}
                        type="button"
                        className="search-chip"
                        onClick={() => {
                          setSearchQuery(term);
                          setSelectedIndex(0);
                        }}
                      >
                        {term}
                      </button>
                    ))}
                  </div>

                  <div className="search-suggestions-title mt-5">
                    <Gamepad2 size={13} className="text-[#a855f7]" />
                    <span>FEATURED IN VAULT</span>
                  </div>
                </div>
              )}

              {/* Product Result List */}
              <div className="search-modal-results-list" role="listbox">
                {searchResults.length > 0 ? (
                  searchResults.slice(0, 15).map((product, index) => {
                    const isSelected = index === selectedIndex;
                    const isAdded = !!addedItemIds[product.id];
                    const imageSrc = product.coverImage || '/covers/astro-bot.jpg';

                    return (
                      <div
                        key={product.id}
                        role="option"
                        aria-selected={isSelected}
                        className={`search-result-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleNavigateToProduct(product)}
                        onMouseEnter={() => setSelectedIndex(index)}
                      >
                        <div className="search-result-thumb">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imageSrc}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>

                        <div className="search-result-info">
                          <div className="search-result-top">
                            <span className="search-result-badge">
                              {product.badge || product.subCategory || product.label}
                            </span>
                            {product.inStock && (
                              <span className="search-result-stock">
                                <span className="stock-dot" /> In Stock
                              </span>
                            )}
                          </div>
                          <h4 className="search-result-title">{product.name}</h4>
                          <div className="search-result-meta">
                            <span className="search-result-price">{formatTaka(product.price)}</span>
                            {product.rating && (
                              <span className="search-result-rating">
                                ★ {product.rating} ({product.reviewsCount})
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="search-result-actions" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            className={`search-result-add-btn ${isAdded ? 'added' : ''}`}
                            onClick={(e) => handleQuickAdd(e, product)}
                            aria-label={`Add ${product.name} to cart`}
                          >
                            {isAdded ? (
                              <>
                                <Check size={14} />
                                <span className="hidden md:inline">Added</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag size={14} />
                                <span className="hidden md:inline">Add</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="search-modal-empty">
                    <div className="search-empty-radar">
                      <Search size={32} className="text-[#a855f7] opacity-60" />
                    </div>
                    <strong>NO SIGNALS DETECTED</strong>
                    <p>
                      No items matched &ldquo;{searchQuery}&rdquo;. Try another term or explore our categories.
                    </p>
                    <button
                      type="button"
                      className="button-primary mt-4 text-xs py-2 px-5 inline-flex items-center gap-2"
                      onClick={() => {
                        setSearchQuery('');
                        setActiveCategory('all');
                      }}
                    >
                      Clear Search & Show All Drops
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Keyboard Hint Bar (desktop) */}
            <div className="search-modal-footer">
              <div className="search-hints">
                <span className="search-hint">
                  <kbd>↑</kbd> <kbd>↓</kbd> Navigate
                </span>
                <span className="search-hint">
                  <kbd>↵</kbd> Select
                </span>
                <span className="search-hint">
                  <kbd>ESC</kbd> Close
                </span>
              </div>
              <div className="search-footer-count">
                {searchResults.length} {searchResults.length === 1 ? 'item' : 'items'} available
              </div>
            </div>
          </div>
        </div>
      )}
    </SearchContext.Provider>
  );
}
