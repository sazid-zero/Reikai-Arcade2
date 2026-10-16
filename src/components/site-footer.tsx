'use client';

import React from 'react';
import Link from 'next/link';
import { Gamepad2 } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand-col">
            <Link
              href="/"
              className="wordmark border-0 bg-transparent p-0 cursor-pointer flex items-center gap-2.5"
              data-testid="button-footer-home"
            >
              <img
                src="/logo.jpeg"
                alt="Reikai Arcade"
                className="w-8 h-8 rounded-lg object-cover border border-[#a0e4f1]/40 shadow-[0_0_15px_rgba(160,228,241,0.4)] transition-transform duration-300 hover:scale-110"
              />
              <span className="wordmark-text font-['Outfit'] font-black tracking-[0.14em] text-white text-base">
                REIKAI <span className="wordmark-highlight text-[#a0e4f1] drop-shadow-[0_0_12px_rgba(160,228,241,0.7)]">ARCADE</span>
              </span>
            </Link>
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
              <h3>Vault Navigation</h3>
              <Link href="/">Home Storefront</Link>
              <Link href="/accessories">Accessories Vault</Link>
              <Link href="/games">PS5 Games Catalog</Link>
              <Link href="/#browse">All Drops</Link>
              <Link href="/admin">Admin Control Room</Link>
            </div>

            <div>
              <h3>Digital Store</h3>
              <Link href="/top-up">Game Top-Up</Link>
              <Link href="/gift-cards">Gift Cards</Link>
              <Link href="/subscriptions">Subscriptions</Link>
              <Link href="/subscriptions">PS Plus / Game Pass</Link>
              <Link href="/top-up">Valorant / PUBG Top-Up</Link>
            </div>

            <div>
              <h3>Gear Categories</h3>
              <Link href="/accessories?cat=Controllers">Pro Controllers</Link>
              <Link href="/accessories?cat=Headsets">Planar &amp; 3D Audio</Link>
              <Link href="/accessories?cat=Charging%20%26%20Docks">Charging Docks</Link>
              <Link href="/accessories?cat=Storage">NVMe Storage</Link>
              <Link href="/accessories?cat=Custom%20Plates">Console Covers</Link>
            </div>

            <div>
              <h3>Protocol &amp; Security</h3>
              <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">
                Model License (CC BY 4.0)
              </a>
              <Link href="/#top">Accessibility Settings</Link>
              <Link href="/#top">Telemetry Status</Link>
              <Link href="/#top">Quantum Encryption</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2025 REIKAI ARCADE · VOID PROTOCOL · ALL RIGHTS RESERVED</span>
          <span className="footer-disclaimer">GENUINE SONY PLAYSTATION HARDWARE · SECURE END-TO-END TRANSACTIONS</span>
        </div>
      </div>
    </footer>
  );
}
