'use client';

import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import Link from 'next/link';

// Generic cart product — works with both static legacy products and DB products
export type CartProduct = {
  id: string;
  name: string;
  price: number; // in display currency (Taka), NOT paisa
  image?: string | null;
  type?: string;
  // Legacy fields (optional)
  glyph?: string;
  [key: string]: unknown;
};

export type CartItem = CartProduct & {
  quantity: number;
  selectedColor?: string;
  selectedEdition?: string;
};

type CartContextType = {
  cart: CartItem[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (product: CartProduct, options?: { color?: string; edition?: string; price?: number }) => void;
  changeQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('reikai_arcade_cart');
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('reikai_arcade_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  const addToCart = (product: CartProduct, options?: { color?: string; edition?: string; price?: number }) => {
    setCart((current) => {
      const itemPrice = options?.price ?? product.price;

      const foundIndex = current.findIndex(
        (item) =>
          item.id === product.id &&
          item.selectedColor === options?.color &&
          item.selectedEdition === options?.edition
      );

      if (foundIndex > -1) {
        return current.map((item, index) =>
          index === foundIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [
        ...current,
        {
          ...product,
          price: itemPrice,
          selectedColor: options?.color,
          selectedEdition: options?.edition,
          quantity: 1,
        },
      ];
    });
    setCartOpen(true);
  };

  const changeQuantity = (id: string, delta: number) => {
    setCart((current) =>
      current.flatMap((item) => {
        if (item.id === id) {
          const next = item.quantity + delta;
          return next > 0 ? [{ ...item, quantity: next }] : [];
        }
        return [item];
      })
    );
  };

  const removeFromCart = (id: string) => {
    setCart((current) => current.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartOpen,
        setCartOpen,
        addToCart,
        changeQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
      {cartOpen && <GlobalCartPanel />}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

function formatTaka(amount: number) {
  return `৳${amount.toLocaleString('en-BD')}`;
}

function GlobalCartPanel() {
  const { cart, setCartOpen, changeQuantity, removeFromCart, cartTotal, cartCount, clearCart } = useCart();
  const [checkoutDone, setCheckoutDone] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setCheckoutBusy(true);
    setCheckoutError(null);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((item) => ({
            variantId: item.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item.id) ? item.id : undefined,
            productName: item.name,
            variantTitle: item.selectedEdition,
            quantity: item.quantity,
            // price is in Taka, API expects paisa
            unitPrice: Math.round(item.price * 100),
            sku: item.id,
          })),
        }),
      });
      const data = await response.json();
      if (response.ok && data?.id) {
        clearCart();
        setPlacedOrderId(data.id);
        setCheckoutDone(true);
      } else {
        setCheckoutError('Checkout failed. Please try again.');
      }
    } catch {
      setCheckoutError('Network error. Please try again.');
    }
    setCheckoutBusy(false);
  };

  return (
    <div
      className="cart-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping bag"
      onClick={() => setCartOpen(false)}
    >
      <aside className="cart-panel" onClick={(e) => e.stopPropagation()}>
        <div className="cart-head">
          <div>
            <div className="section-kicker" style={{ color: 'rgba(192,132,252,0.85)', marginBottom: '4px' }}>
              REIKAI VAULT // BAG ({cartCount})
            </div>
            <h2>ACQUISITION MATRIX</h2>
          </div>
          <button
            type="button"
            className="cart-close"
            onClick={() => setCartOpen(false)}
            aria-label="Close bag"
          >
            <X size={18} />
          </button>
        </div>

        {checkoutDone ? (
          <div className="cart-empty" style={{ margin: 'auto 0' }}>
            <div style={{ color: '#22c55e', fontSize: '2.5rem', marginBottom: '16px' }}>✓</div>
            <strong>ORDER CONFIRMED!</strong>
            <p style={{ maxWidth: '300px', fontSize: '.85rem', color: '#94a3b8', lineHeight: 1.6 }}>
              Your order has been recorded into the ReiKai database.
            </p>
            {placedOrderId && (
              <div style={{ marginTop: '20px' }}>
                <Link
                  href={`/orders/${placedOrderId}`}
                  className="button-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
                  onClick={() => { setCheckoutDone(false); setCartOpen(false); }}
                >
                  Track Order Details →
                </Link>
              </div>
            )}
            <button
              type="button"
              className="button-ghost"
              style={{ marginTop: '12px' }}
              onClick={() => { setCheckoutDone(false); setCartOpen(false); }}
            >
              Continue Shopping
            </button>
          </div>
        ) : cart.length === 0 ? (
          <div className="cart-empty">
            <ShoppingBag size={48} className="text-[#a855f7] opacity-60 mb-3" />
            <strong>BAG IS EMPTY</strong>
            <p>No items added yet.</p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <Link href="/accessories" onClick={() => setCartOpen(false)} className="cart-empty-link">
                Browse Accessories →
              </Link>
              <Link href="/games" onClick={() => setCartOpen(false)} className="cart-empty-link">
                Browse Games →
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div key={`${item.id}-${item.selectedColor || ''}-${item.selectedEdition || ''}`} className="cart-item">
                  <div className="cart-thumb">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image as string} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <span>{item.glyph ?? (item.type === 'game' ? '🎮' : '🎧')}</span>
                    )}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div className="cart-item-name">{item.name}</div>
                    {(item.selectedColor || item.selectedEdition) && (
                      <div className="cart-item-variant">
                        {item.selectedEdition && <span>{item.selectedEdition}</span>}
                        {item.selectedColor && <span> · {item.selectedColor}</span>}
                      </div>
                    )}
                    <div className="cart-item-price">{formatTaka(item.price * item.quantity)}</div>
                    <div className="quantity-controls">
                      <button type="button" onClick={() => changeQuantity(item.id, -1)} aria-label="Decrease quantity">
                        <Minus size={11} />
                      </button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => changeQuantity(item.id, 1)} aria-label="Increase quantity">
                        <Plus size={11} />
                      </button>
                      <button type="button" onClick={() => removeFromCart(item.id)} className="cart-item-remove" aria-label="Remove item">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-note">
                <span className="cart-note-dot" />
                <span>FREE DELIVERY INCLUDED ON ORDERS OVER ৳5,000</span>
              </div>
              <div className="cart-total">
                <span>TOTAL</span>
                <strong>{formatTaka(cartTotal)}</strong>
              </div>
              {checkoutError && <p role="alert" style={{ color: '#f87171', fontSize: '.8rem', marginBottom: '12px' }}>{checkoutError}</p>}
              <button
                type="button"
                className="button-primary checkout-btn"
                onClick={handleCheckout}
                disabled={checkoutBusy}
              >
                <span>{checkoutBusy ? 'PROCESSING…' : 'PLACE ORDER'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
