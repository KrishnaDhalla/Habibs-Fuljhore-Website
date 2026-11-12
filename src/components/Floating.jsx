import { useEffect, useState } from 'react';
import { CalendarDays, Gift, Phone } from 'lucide-react';
import { BrandIcon } from './BrandIcon';
import { useUI } from '../context/UIContext';
import { useCatalogue } from '../lib/catalogue';
import { SITE, waGeneral } from '../data/site';

// Instagram / Facebook / WhatsApp buttons on the right edge
export function FloatingSocial() {
  const { booking, detailId } = useUI();
  if (booking || detailId) return null;
  return (
    <div className="fab-stack">
      <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram" className="fab fab--ig"><BrandIcon name="instagram" size={24} /></a>
      <a href={SITE.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook" className="fab fab--fb"><BrandIcon name="facebook" size={24} /></a>
      <a href={waGeneral()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" title="WhatsApp" className="fab fab--wa"><BrandIcon name="whatsapp" size={26} /></a>
    </div>
  );
}

// Vertical "Offers" tab on the left edge (large screens)
export function OffersTab() {
  const { booking, detailId, offersOpen, toggleOffers } = useUI();
  if (booking || detailId || offersOpen) return null;
  return (
    <button type="button" className="offers-tab" onClick={toggleOffers} aria-label="Latest offers">
      <span className="offers-tab__pulse" aria-hidden="true" />
      <Gift size={16} aria-hidden="true" />
      <span className="offers-tab__label">OFFERS</span>
      <OfferCount className="offers-tab__count" />
    </button>
  );
}

// Fixed action bar on phones
export function MobileBar() {
  const { openBooking, toggleOffers } = useUI();
  return (
    <nav className="mobile-bar" aria-label="Quick actions">
      <a href={SITE.tel}><Phone size={20} aria-hidden="true" />Call</a>
      <a href={waGeneral()} target="_blank" rel="noopener noreferrer"><BrandIcon name="whatsapp" size={20} />WhatsApp</a>
      <button type="button" onClick={toggleOffers}>
        <Gift size={20} aria-hidden="true" />Offers<OfferCount className="mobile-bar__count" />
      </button>
      <button type="button" onClick={() => openBooking()}><CalendarDays size={20} aria-hidden="true" />Book</button>
    </nav>
  );
}

// Number of offers live in the billing app (hidden when there are none)
// Shown only in the browser: offers start and end by date, so the count on visit day can differ from the build.
export function OfferCount({ className }) {
  const { liveOffers } = useCatalogue();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return ready && liveOffers ? <span className={className}>{liveOffers}</span> : null;
}
