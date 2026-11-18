'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

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
        <div className="ot-card" data-reveal>
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
      </div>
    </section>
  );
}

