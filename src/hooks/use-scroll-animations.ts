'use client';

import { useEffect } from 'react';

/**
 * High-performance, hardware-accelerated scroll reveal observer.
 * - Adds .is-revealed when sections and headers scroll into viewport.
 * - Removes .is-revealed when scrolled out of viewport, allowing repeatable
 *   slow luxury entrance animations every time the user scrolls in and out.
 */
export default function useScrollAnimations(reducedMotion: boolean) {
  useEffect(() => {
    if (reducedMotion) return;

    // Small delay to ensure client hydration and dynamic catalogs are in DOM
    const initTimer = setTimeout(() => {
      const targets = document.querySelectorAll<HTMLElement>(
        '.sf-section-head, .sf-browse-head, .sf-signal-text, .section-head, .sf-cat-card, .sf-trust-card'
      );

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed');
            } else {
              entry.target.classList.remove('is-revealed');
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -30px 0px',
        }
      );

      targets.forEach((el) => observer.observe(el));

      return () => {
        observer.disconnect();
      };
    }, 100);

    return () => clearTimeout(initTimer);
  }, [reducedMotion]);
}
