import { useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, X } from 'lucide-react';
import { BrandIcon } from './BrandIcon';
import { Img } from './Img';
import { useUI } from '../context/UIContext';
import { priceRef, useCatalogue } from '../lib/catalogue';
import { BRIDAL_CARD, SOON_CARD, waHello } from '../data/site';

// Offers from the billing app, then the bridal card; "more offers soon" when there are none.
function useOffers() {
  const { offers } = useCatalogue();
  const bridal = priceRef('makeup', 'bridal makeup');
  return [
    ...offers,
    { ...BRIDAL_CARD, price: bridal ? bridal.text : '' },
    ...(offers.length ? [] : [SOON_CARD]),
  ];
}

// Offer carousel: advances every 6 s (the progress bar's CSS animation drives it), pauses on hover.
export function OffersPanel() {
  const { offersOpen, closeOffers, openBooking } = useUI();
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const OFFERS = useOffers();
  if (!offersOpen) return null;

  const n = OFFERS.length;
  const i = ((idx % n) + n) % n;
  const off = OFFERS[i];
  const go = (k) => setIdx(k);

  return (
    <>
      <div className="overlay overlay--light" onClick={closeOffers} aria-hidden="true" />
      <div
        className="offers-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Latest offers"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="offers-panel__head">
          <div className="offers-panel__title"><Sparkles size={18} aria-hidden="true" /><span>LATEST OFFERS</span></div>
          <button type="button" className="icon-btn" onClick={closeOffers} aria-label="Close offers"><X size={18} aria-hidden="true" /></button>
        </div>

        <div className="offer" key={i}>
          <div className="offer__media">
            <Img name={off.img} alt={off.title} sizes="380px" style={{ objectPosition: off.pos }} />
            <span className="offer__tag">{off.tag}</span>
          </div>
          <div className="offer__body">
            <h3 className="offer__title">{off.title}</h3>
            {off.price && (
              <div className="offer__price">
                <span className="offer__now">{off.price}</span>
                {off.old && <span className="offer__old">{off.old}</span>}
                {off.save && <span className="offer__save">{off.save}</span>}
              </div>
            )}
            <p className="offer__note">{off.note}</p>
          </div>
          <div className={'offer__actions' + (off.book ? '' : ' offer__actions--single')}>
            {off.book && (
              <button type="button" className="btn btn--primary btn--md" onClick={() => openBooking(off.book)}>{off.bookLabel}</button>
            )}
            <a href={waHello(off.waText)} target="_blank" rel="noopener noreferrer" className="btn btn--soft btn--md"><BrandIcon name="whatsapp" size={16} color="#25D366" />WHATSAPP</a>
          </div>
        </div>

        <div className="offers-panel__nav">
          <button type="button" className="icon-btn" onClick={() => go(i - 1)} aria-label="Previous offer"><ChevronLeft size={18} aria-hidden="true" /></button>
          <div className="offers-panel__dots">
            {OFFERS.map((o, k) => (
              <button type="button" key={k} onClick={() => go(k)} aria-label={'Show offer: ' + o.title} aria-current={k === i} className={'dot' + (k === i ? ' is-active' : '')} />
            ))}
          </div>
          <button type="button" className="icon-btn" onClick={() => go(i + 1)} aria-label="Next offer"><ChevronRight size={18} aria-hidden="true" /></button>
        </div>
        <div className="offers-panel__progress">
          <div
            key={i}
            className="offers-panel__bar"
            style={{ animationPlayState: paused ? 'paused' : 'running' }}
            onAnimationEnd={() => go(i + 1)}
          />
        </div>
      </div>
    </>
  );
}
