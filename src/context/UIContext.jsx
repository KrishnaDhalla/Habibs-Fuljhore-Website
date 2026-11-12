import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [booking, setBooking] = useState(null); // { key, ids, q, req, offer, offerId }
  const [ask, setAsk] = useState(null); // { key, ids, message }
  const [detailId, setDetailId] = useState(null);
  const [offersOpen, setOffersOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const openBooking = useCallback((opts = {}) => {
    setDetailId(null);
    setMenuOpen(false);
    setOffersOpen(false);
    setAsk(null);
    setBooking({ key: Date.now(), ids: opts.ids || [], q: opts.q || '', req: opts.req || '', offer: opts.offer || null, offerId: opts.offerId || null });
  }, []);

  // The "Ask us" form: sends the question on WhatsApp and records it in the billing app
  const openAsk = useCallback((opts = {}) => {
    setDetailId(null);
    setMenuOpen(false);
    setOffersOpen(false);
    setAsk({ key: Date.now(), ids: opts.ids || [], message: opts.message || '' });
  }, []);

  const value = useMemo(
    () => ({
      booking, openBooking, closeBooking: () => setBooking(null),
      ask, openAsk, closeAsk: () => setAsk(null),
      detailId, openDetail: (id) => setDetailId(id), closeDetail: () => setDetailId(null),
      offersOpen, toggleOffers: () => { setMenuOpen(false); setOffersOpen((o) => !o); }, closeOffers: () => setOffersOpen(false),
      menuOpen, toggleMenu: () => setMenuOpen((m) => !m), closeMenu: () => setMenuOpen(false),
    }),
    [booking, openBooking, ask, openAsk, detailId, offersOpen, menuOpen],
  );

  // Lock page scroll while an overlay is open
  const locked = !!booking || !!ask || !!detailId || offersOpen || menuOpen;
  useEffect(() => {
    if (!locked) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [locked]);

  // Escape closes the top-most overlay
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (ask) setAsk(null);
      else if (booking) setBooking(null);
      else if (detailId) setDetailId(null);
      else if (offersOpen) setOffersOpen(false);
      else if (menuOpen) setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [booking, ask, detailId, offersOpen, menuOpen]);

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export const useUI = () => useContext(UIContext);
