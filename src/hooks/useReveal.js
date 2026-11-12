import { useEffect } from 'react';

// Scroll-reveal for any element with a data-reveal attribute ("img" for images).
// Siblings reveal with a short stagger. Skipped entirely for reduced-motion users.
// Anything already on screen when it appears is shown at once (no waiting for the observer),
// so a page load or reload never shows an empty first screen.
export function useReveal() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) return undefined;

    // Cards in a side-swipe carousel reveal together when the carousel comes into view
    // (not one by one mid-swipe). groups: carousel element → its cards.
    const groups = new Map();
    const reveal = (el) => {
      el.classList.add('is-in');
      (groups.get(el) || []).forEach((c) => c.classList.add('is-in'));
    };
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (!e.isIntersecting) return;
        reveal(e.target);
        io.unobserve(e.target);
      }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );
    const scrollerOf = (el) => {
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        const o = getComputedStyle(p).overflowX;
        if (o === 'auto' || o === 'scroll') return p;
      }
      return null;
    };

    // Tracked per run (not with an attribute on the element), so when React runs this effect a
    // second time (StrictMode in development, or a remount) every element is watched again.
    const seen = new WeakSet();
    const scan = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      document.querySelectorAll('[data-reveal]').forEach((el) => {
        if (seen.has(el) || el.classList.contains('is-in')) return;
        seen.add(el);
        const sibs = el.parentElement ? [...el.parentElement.children].filter((c) => c.hasAttribute('data-reveal')) : [el];
        el.style.setProperty('--rv-i', String(Math.min(Math.max(sibs.indexOf(el), 0), 6)));
        const sc = scrollerOf(el);
        const target = sc || el;
        const r = target.getBoundingClientRect();
        if (r.top < vh && r.bottom > 0) { el.classList.add('is-in'); return; } // already on screen
        if (sc) {
          if (!groups.has(sc)) { groups.set(sc, []); io.observe(sc); }
          groups.get(sc).push(el);
        } else io.observe(el);
      });
    };
    scan(); // before hiding anything, so on-screen content is never hidden
    root.classList.add('reveal-on');
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    const showAll = () => document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in'));
    window.addEventListener('beforeprint', showAll);
    return () => {
      io.disconnect();
      mo.disconnect();
      window.removeEventListener('beforeprint', showAll);
      root.classList.remove('reveal-on');
    };
  }, []);
}
