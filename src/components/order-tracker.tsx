'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, ArrowRight } from 'lucide-react';

export function OrderTracker() {
  const [phone, setPhone] = useState('');
  const router = useRouter();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const q = phone.trim();
    if (!q) return;
    router.push(`/orders?phone=${encodeURIComponent(q)}`);
  };

  return (
    <section className="ot-section" id="track-order" aria-labelledby="ot-title">
      {/* subtle bleed glow */}
      <div className="ot-glow" aria-hidden="true" />

      <div className="ot-inner">
        {/* left: text + form */}
        <div className="ot-content" data-reveal>
          <div className="ot-label-row">
            <span className="ot-label-line" aria-hidden="true" />
            <span className="ot-eyebrow">Track Order</span>
          </div>
          <h2 className="ot-title" id="ot-title">Where's my parcel?</h2>
          <p className="ot-desc">Enter the phone number you ordered with.</p>

          <form className="ot-form" onSubmit={handleTrack} aria-label="Order tracker">
            <div className="ot-input-wrap">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="ot-input"
                aria-label="Your phone number"
                maxLength={14}
                pattern="[0-9+\s\-]{7,14}"
              />
              <button type="submit" className="ot-submit" aria-label="Track order">
                <span>Track</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </form>
        </div>

        {/* right: glass card stats */}
        <div className="ot-stats" data-reveal>
          {[
            { icon: <Package size={18} />, stat: '12,000+', label: 'Orders delivered' },
            { icon: <span className="ot-stat-emoji">⚡</span>, stat: 'Same day', label: 'Dhaka dispatch' },
            { icon: <span className="ot-stat-emoji">🛡️</span>, stat: '100%', label: 'Delivery guarantee' },
          ].map(({ icon, stat, label }) => (
            <div className="ot-stat-card" key={label}>
              <div className="ot-stat-icon">{icon}</div>
              <div className="ot-stat-info">
                <strong className="ot-stat-num">{stat}</strong>
                <span className="ot-stat-label">{label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

