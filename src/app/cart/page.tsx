'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/components/cart-context';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Zap,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

function formatTaka(amount: number) {
  return `৳${amount.toLocaleString('en-BD')}`;
}

export default function CartPage() {
  const { cart, changeQuantity, removeFromCart, clearCart, cartTotal, cartCount } = useCart();
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setCheckoutBusy(true);
    setCheckoutError(null);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim() || undefined,
          customerPhone: customerPhone.trim() || undefined,
          customerEmail: customerEmail.trim() || undefined,
          notes: customerAddress.trim() ? `Delivery: ${customerAddress.trim()}` : undefined,
          items: cart.map((item) => {
            const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            const targetVariantId =
              item.variantId && uuidPattern.test(item.variantId)
                ? item.variantId
                : item.id && uuidPattern.test(item.id)
                ? item.id
                : undefined;

            return {
              variantId: targetVariantId,
              productName: item.name,
              variantTitle: item.selectedEdition,
              quantity: item.quantity,
              // price in Taka, API expects paisa (smallest unit)
              unitPrice: Math.round(item.price * 100),
              sku: (item.sku as string) || item.id,
            };
          }),
        }),
      });

      const data = await response.json();
      if (response.ok && data?.id) {
        clearCart();
        setPlacedOrderId(data.id);
      } else {
        setCheckoutError(data?.error || 'Checkout failed. Please try again.');
      }
    } catch {
      setCheckoutError('Network connection error. Please try again.');
    } finally {
      setCheckoutBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#f4f2ff] flex flex-col">
      <SiteHeader />

      <main className="flex-1 mx-auto max-w-6xl w-full px-4 py-8 sm:px-6 lg:px-8 pb-24 md:pb-16">
        {/* Breadcrumb navigation */}
        <nav className="mb-6 flex items-center gap-1.5 text-xs text-white/40">
          <Link href="/" className="hover:text-white transition">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-white/70">Cart</span>
        </nav>

        {placedOrderId ? (
          /* Order Confirmed Screen */
          <div className="mx-auto max-w-lg rounded-3xl border border-[#a0e4f1]/30 bg-black/90 p-8 text-center backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.9),0_0_30px_rgba(160,228,241,0.15)] my-12">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 size={36} />
            </div>
            <h1 className="text-2xl font-black text-white">Order Confirmed!</h1>
            <p className="mt-2 text-sm text-zinc-300">
              Your order has been recorded into the ReiKai database.
            </p>
            <div className="my-6 rounded-2xl bg-white/[0.04] border border-white/10 p-4 text-xs font-mono">
              <span className="text-zinc-400 block mb-1">Order Reference ID:</span>
              <span className="text-[#a0e4f1] font-bold text-sm tracking-wider">{placedOrderId}</span>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                href={`/orders/${placedOrderId}`}
                className="w-full rounded-xl bg-gradient-to-r from-[#4b22d2] via-[#c673e2] to-[#a0e4f1] py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(160,228,241,0.35)] hover:shadow-[0_0_28px_rgba(160,228,241,0.55)] transition text-center"
              >
                Track Order Details →
              </Link>
              <Link
                href="/games"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-zinc-300 hover:text-white hover:bg-white/10 transition text-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : cart.length === 0 ? (
          /* Empty Bag Screen */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] text-purple-400 shadow-[0_0_30px_rgba(198,115,226,0.2)]">
              <ShoppingBag size={40} className="text-[#a0e4f1]" />
            </div>
            <h1 className="text-2xl font-black text-white sm:text-3xl">Your Cart is Empty</h1>
            <p className="mt-2 max-w-sm text-sm text-zinc-400">
              Explore genuine PlayStation gear, next-gen games, instant top-ups, and subscriptions.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/games"
                className="rounded-xl bg-gradient-to-r from-[#4b22d2] via-[#c673e2] to-[#a0e4f1] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-[0_0_16px_rgba(160,228,241,0.3)] hover:shadow-[0_0_24px_rgba(160,228,241,0.5)] transition"
              >
                Browse Games →
              </Link>
              <Link
                href="/accessories"
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-xs sm:text-sm font-bold text-zinc-300 hover:text-white hover:border-white/20 transition"
              >
                Browse Accessories →
              </Link>
              <Link
                href="/top-up"
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-xs sm:text-sm font-bold text-zinc-300 hover:text-white hover:border-white/20 transition"
              >
                Game Top-Up →
              </Link>
            </div>
          </div>
        ) : (
          /* Filled Cart: Two Columns on PC, Single Column on Mobile */
          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* Left: Cart Items (8 cols) */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <h1 className="text-xl sm:text-2xl font-black text-white">Your Shopping Cart</h1>
                  <span className="rounded-full bg-[#a0e4f1]/15 border border-[#a0e4f1]/30 px-2.5 py-0.5 text-xs font-mono font-bold text-[#a0e4f1]">
                    {cartCount} {cartCount === 1 ? 'item' : 'items'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs font-medium text-rose-400 hover:text-rose-300 transition flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 size={13} />
                  Clear Bag
                </button>
              </div>

              {/* Items List */}
              <div className="flex flex-col gap-3">
                {cart.map((item, idx) => (
                  <div
                    key={`${item.id}-${item.selectedColor || ''}-${item.selectedEdition || ''}-${idx}`}
                    className="flex gap-3.5 sm:gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 sm:p-4 backdrop-blur-md transition hover:border-white/20"
                  >
                    {/* Item Image */}
                    <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-xl bg-white/5 border border-white/10">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 80px, 96px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-3xl">🎮</div>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm sm:text-base font-bold text-white truncate">{item.name}</h3>
                          {item.selectedEdition && (
                            <p className="text-xs text-[#c673e2]/90 font-mono mt-0.5">
                              Edition: {item.selectedEdition}
                            </p>
                          )}
                          {item.selectedColor && (
                            <p className="text-xs text-zinc-400 font-mono mt-0.5">
                              Color: {item.selectedColor}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-zinc-500 hover:text-rose-400 p-1 transition shrink-0 cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Quantity Controls & Price */}
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
                        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2 py-1">
                          <button
                            type="button"
                            onClick={() => changeQuantity(item.id, -1)}
                            className="text-zinc-400 hover:text-white p-0.5 transition cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-mono text-xs font-bold text-white px-2">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => changeQuantity(item.id, 1)}
                            className="text-zinc-400 hover:text-white p-0.5 transition cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <span className="font-mono font-black text-sm sm:text-base text-[#a0e4f1] drop-shadow-[0_0_10px_rgba(160,228,241,0.3)]">
                          {formatTaka(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Guarantees Bar */}
              <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl border border-white/5 bg-white/[0.02] p-3 text-center text-[11px] text-zinc-400">
                <div className="flex items-center justify-center gap-1.5">
                  <ShieldCheck size={14} className="text-[#a0e4f1]" />
                  <span>100% Genuine</span>
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  <Zap size={14} className="text-[#c673e2]" />
                  <span>Fast Dispatch</span>
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  <RotateCcw size={14} className="text-[#5ba2c0]" />
                  <span>Warranty Covered</span>
                </div>
              </div>
            </div>

            {/* Right: Checkout & Order Summary (4-5 cols) */}
            <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
              <form
                onSubmit={handleCheckout}
                className="rounded-3xl border border-white/10 bg-black/90 p-5 sm:p-6 backdrop-blur-xl shadow-2xl"
              >
                <h2 className="text-lg font-black text-white mb-4 pb-3 border-b border-white/10">
                  Order Summary
                </h2>

                <div className="flex flex-col gap-2.5 text-sm">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal</span>
                    <span className="font-mono font-bold text-white">{formatTaka(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Shipping (Bangladesh)</span>
                    <span className="font-mono text-emerald-400 font-medium">Calculated / Standard</span>
                  </div>
                  <div className="my-2 border-t border-white/10" />
                  <div className="flex justify-between text-base font-black text-white">
                    <span>Total Amount</span>
                    <span className="font-mono text-lg text-[#a0e4f1] drop-shadow-[0_0_12px_rgba(160,228,241,0.4)]">
                      {formatTaka(cartTotal)}
                    </span>
                  </div>
                </div>

                {/* Customer Details Form */}
                <div className="mt-6 flex flex-col gap-3">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#c673e2]">
                    Shipping &amp; Contact
                  </h3>

                  <input
                    type="text"
                    required
                    placeholder="Your Full Name *"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#a0e4f1] transition"
                  />

                  <input
                    type="tel"
                    required
                    placeholder="Phone Number (e.g. 017...) *"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#a0e4f1] transition"
                  />

                  <input
                    type="email"
                    placeholder="Email Address (optional)"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#a0e4f1] transition"
                  />

                  <textarea
                    rows={2}
                    placeholder="Delivery Address (City, Area, House) *"
                    required
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#a0e4f1] transition resize-none"
                  />
                </div>

                {checkoutError && (
                  <p className="mt-3 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl">
                    {checkoutError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={checkoutBusy || cart.length === 0}
                  className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#4b22d2] via-[#c673e2] to-[#a0e4f1] py-3.5 text-sm font-extrabold text-white shadow-[0_0_24px_rgba(160,228,241,0.35)] hover:shadow-[0_0_36px_rgba(160,228,241,0.55)] active:scale-[0.99] transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {checkoutBusy ? (
                    <span>Processing Order...</span>
                  ) : (
                    <>
                      <span>Complete Order</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
