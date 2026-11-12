import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Search } from 'lucide-react';
import { BrandIcon } from '../components/BrandIcon';
import { Img } from '../components/Img';
import { WhyHabibs } from '../components/WhyHabibs';
import { useUI } from '../context/UIContext';
import { priceRef, searchServices, useCatalogue } from '../lib/catalogue';
import {
  BRIDAL_LIST, CATEGORIES, MARQUEE, PRICE_PREVIEW, QUICK_TERMS, REVIEWS, SITE, waBridal, waGeneral,
} from '../data/site';

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <HomeSearch />
      <Explore />
      <PricePreview />
      <BridalFeature />
      <WhyHabibs />
      <Heritage />
      <Connect />
      <Reviews />
      <FindUs />
    </>
  );
}

const scrollToExplore = (e) => {
  e.preventDefault();
  const el = document.getElementById('explore');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

function Hero() {
  const { openBooking } = useUI();
  const mediaRef = useRef(null);

  // Gentle parallax on the hero photo
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let raf = 0;
    const on = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        if (mediaRef.current && y < 1200) mediaRef.current.style.transform = `translate3d(0,${y * 0.25}px,0)`;
      });
    };
    window.addEventListener('scroll', on, { passive: true });
    return () => { window.removeEventListener('scroll', on); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section className="hero">
      <div className="hero__media" ref={mediaRef}>
        <div className="hero__kenburns">
          <Img name="home-hero" alt="Client with a styled updo at Habib’s Fuljhore" priority sizes="(max-width: 759px) 200vw, 100vw" />
        </div>
      </div>
      <div className="hero__wash" aria-hidden="true" />
      <div className="container hero__inner">
        <div className="hero__copy">
          <div data-reveal="" className="hero__kicker">Beauty Lives Here</div>
          <h1 data-reveal="" className="hero__title">Your Beauty.<br />Our Expertise.</h1>
          <h2 data-reveal="" className="hero__sub">Premium Hair &amp; Beauty Services<br />in Fuljhore, Durgapur.</h2>
          <p data-reveal="" className="hero__lead">From everyday grooming and hair transformations to bridal beauty and professional makeup, experience premium salon services designed around you.</p>
          <div data-reveal="" className="hero__ctas">
            <button type="button" className="btn btn--primary" onClick={() => openBooking()}>Book an Appointment <span aria-hidden="true">→</span></button>
            <a href="#explore" className="link-cta" onClick={scrollToExplore}>Explore Services</a>
          </div>
          <div data-reveal="" className="hero__loc"><MapPin size={17} aria-hidden="true" />Fuljhore, Durgapur</div>
        </div>
        <div className="hero__tagline" aria-hidden="true">
          <span className="hero__tagline-rule" /><span>HAIR</span><span>BEAUTY</span><span>MAKEUP</span><span>BRIDAL</span><span>AND YOU</span>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const row = (hidden) => MARQUEE.map((t, i) => (
    <span className="marquee__item" key={(hidden ? 'b' : 'a') + i} aria-hidden={hidden || undefined}>
      <span className={'marquee__text' + (i % 2 ? ' is-red' : '')}>{t}</span>
      <span className="marquee__diamond" aria-hidden="true" />
    </span>
  ));
  return (
    <div className="marquee" aria-label="Our services">
      <div className="marquee__track">{row(false)}{row(true)}</div>
    </div>
  );
}

function HomeSearch() {
  const { openDetail, openBooking, openAsk } = useUI();
  const { items } = useCatalogue();
  const navigate = useNavigate();
  const [hq, setHq] = useState('');
  const has = !!hq.trim();
  const hits = has ? searchServices(hq) : [];
  const shown = hits.slice(0, 10);
  const byGroup = [];
  shown.forEach((it) => {
    let g = byGroup.find((x) => x.title === it.group);
    if (!g) byGroup.push((g = { title: it.group, rows: [] }));
    g.rows.push(it);
  });

  return (
    <section className="home-search">
      <div className="container home-search__inner">
        <div>
          <div className="eyebrow">Full price list · {items.length}+ services</div>
          <h2 data-reveal="" className="t-lg mt-12">What are you looking for?</h2>
          <p className="muted mt-14 maxw-440">Search any service to see its price and book it in a few taps.</p>
        </div>
        <div>
          <label className="search-field">
            <Search size={19} aria-hidden="true" />
            <input value={hq} onChange={(e) => setHq(e.target.value)} placeholder="Search haircut, facial, hair spa, bridal makeup..." aria-label="Search services" />
            {has && <button type="button" className="search-field__clear" onClick={() => setHq('')}>CLEAR</button>}
          </label>
          {!has && (
            <div className="chips mt-14">
              {QUICK_TERMS.map((t) => <button type="button" key={t} className="chip" onClick={() => setHq(t)}>{t}</button>)}
            </div>
          )}
          {has && (
            <div className="results" aria-live="polite">
              {byGroup.map((g) => (
                <div key={g.title}>
                  <div className="results__group">{g.title}</div>
                  {g.rows.map((it) => (
                    <div className="results__row" key={it.id}>
                      <button type="button" className="results__open" onClick={() => openDetail(it.id)}>
                        <span className="results__name">{it.n}</span>
                        <span className="results__price">{it.full ? it.short + '  ·  ' + it.full : it.short}</span>
                      </button>
                      {it.book
                        ? <button type="button" className="btn btn--primary btn--sm" onClick={() => openBooking({ ids: [it.id] })}>BOOK</button>
                        : <button type="button" className="btn btn--primary btn--sm" onClick={() => openAsk({ ids: [it.id] })}>ASK</button>}
                    </div>
                  ))}
                </div>
              ))}
              {hits.length === 0 && (
                <div className="results__empty">No services match “{hq}”. Try “facial”, “colour” or “waxing”, or <button type="button" className="link-inline" onClick={() => openAsk({ message: 'Do you do ' + hq.trim() + '?' })}>ask us on WhatsApp</button>.</div>
              )}
              {hits.length > shown.length && (
                <button type="button" className="results__all" onClick={() => navigate('/services?q=' + encodeURIComponent(hq))}>VIEW ALL {hits.length} RESULTS →</button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Explore() {
  return (
    <section id="explore" className="explore">
      <div className="container explore__head">
        <div className="explore__title-wrap">
          <h2 data-reveal="" className="explore__title">Explore Our Services</h2>
          <span className="rule-40" aria-hidden="true" />
        </div>
        <span className="muted fs-14">Beauty for every you.</span>
      </div>
      <div className="explore__track">
        {CATEGORIES.map((c) => (
          <div data-reveal="" className="explore__cell" key={c.title}>
            <Link to={c.to} className="cat-card">
              <div className="cat-card__media"><Img name={c.img} alt="" sizes="(max-width: 759px) 78vw, 420px" /></div>
              <div className="cat-card__body">
                <h3 className="cat-card__title">{c.title}</h3>
                <p className="cat-card__list">{c.list}</p>
                <div className="cat-card__cta">EXPLORE →</div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

function PricePreview() {
  const { openDetail } = useUI();
  useCatalogue(); // re-render when the live prices arrive
  const rows = PRICE_PREVIEW.map(([label, gids, words]) => [label, priceRef(gids, words)]).filter((r) => r[1]);
  return (
    <section className="price-preview">
      <div className="container price-preview__inner">
        <div>
          <div className="eyebrow">Transparent pricing</div>
          <h2 data-reveal="" className="t-lg mt-12">Know the price<br />before you arrive.</h2>
          <p className="muted mt-18 maxw-420">Every service on our rate card is listed online, including size-based pricing and any additional charges.</p>
          <Link to="/services" className="btn btn--outline mt-28">View all prices</Link>
        </div>
        <div>
          {rows.map(([label, r]) => (
            <button type="button" data-reveal="" key={label} className="leader-row" onClick={() => openDetail(r.it.id)}>
              <span className="leader-row__label">{label}</span>
              <span className="leader-row__dots" aria-hidden="true" />
              <span className="leader-row__price">{r.text}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function BridalFeature() {
  const { openBooking } = useUI();
  useCatalogue();
  const rows = BRIDAL_LIST.map(([label, gids, words]) => [label, priceRef(gids, words)]).filter((r) => r[1]);
  return (
    <section className="bridal-feature">
      <div className="container bridal-feature__inner">
        <div className="bridal-feature__pics">
          <Img data-reveal="img" name="bride" alt="Bridal makeup at Habibs" sizes="(max-width: 759px) 45vw, 320px" style={{ objectPosition: '72% 30%' }} />
          <Img data-reveal="img" name="groom" alt="Groom styling at Habibs" sizes="(max-width: 759px) 45vw, 320px" style={{ objectPosition: '68% 40%' }} className="is-offset" />
        </div>
        <div>
          <div className="eyebrow eyebrow--onred">Makeup &amp; Bridal</div>
          <h2 data-reveal="" className="bridal-feature__title">Your Big Day<br /><span className="tint">Deserves the Best.</span></h2>
          <div className="bridal-feature__list">
            {rows.map(([label, r]) => (
              <div className="bridal-feature__row" key={label}><span>{label}</span><span className="bridal-feature__price">{r.text}</span></div>
            ))}
          </div>
          <div className="btn-row mt-36">
            <button type="button" className="btn btn--light btn--lg" onClick={() => openBooking({ q: 'bridal' })}>Book a Bridal Consultation</button>
            <a href={waBridal()} target="_blank" rel="noopener noreferrer" className="btn btn--ghost btn--lg">WhatsApp Our Team</a>
          </div>
          <Link to="/bridal" className="bridal-feature__more">See all bridal &amp; groom packages →</Link>
        </div>
      </div>
    </section>
  );
}

function Heritage() {
  return (
    <section className="heritage">
      <div className="container heritage__inner">
        <div className="eyebrow eyebrow--wide">Oldest Family Salon Chain · Since 1983</div>
        <p className="heritage__quote">Habib’s Fuljhore brings the Habibs name, and its decades of hair and beauty craft, to Durgapur.</p>
        <Link to="/about" className="link-cta link-cta--ink mt-26">About the salon →</Link>
      </div>
    </section>
  );
}

function Connect() {
  const cards = [
    { href: waGeneral(), icon: <span className="connect__icon connect__icon--wa"><BrandIcon name="whatsapp" size={26} color="#fff" /></span>, label: 'WhatsApp', labelColor: '#128C4B', big: SITE.phoneDisplay, cta: 'CHAT TO BOOK →' },
    { href: SITE.instagram, icon: <span className="connect__icon connect__icon--ig"><BrandIcon name="instagram" size={26} color="#fff" /></span>, label: 'Instagram', labelColor: '#8B1E25', big: SITE.instagramHandle, cta: 'FOLLOW US →' },
    { href: SITE.facebook, icon: <span className="connect__icon connect__icon--fb"><BrandIcon name="facebook" size={26} color="#fff" /></span>, label: 'Facebook', labelColor: '#1667D1', big: 'Habib’s Fuljhore', cta: 'LIKE OUR PAGE →' },
    { href: SITE.googleReviews, icon: <span className="connect__icon connect__icon--g"><BrandIcon name="google" size={24} color="#4285F4" /></span>, label: 'Google Reviews', labelColor: '#7D6536', big: <><span className="gold">★★★★★</span><br />Rate your visit</>, cta: 'WRITE A REVIEW →' },
  ];
  return (
    <section className="connect">
      <div className="container connect__inner">
        <div className="connect__head">
          <h2 data-reveal="" className="t-connect">Stay Connected<br /><span className="red">with Habib’s Fuljhore</span></h2>
          <p className="muted maxw-460">Message us to book, follow our latest looks, and share your experience with other clients in Durgapur.</p>
        </div>
        <div className="connect__grid">
          {cards.map((c) => (
            <div data-reveal="" key={c.label} className="connect__cell">
              <a href={c.href} target="_blank" rel="noopener noreferrer" className="connect__card">
                {c.icon}
                <span className="connect__label" style={{ color: c.labelColor }}>{c.label}</span>
                <span className="connect__big">{c.big}</span>
                <span className="connect__cta">{c.cta}</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const starsOf = (n) => '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n);

// Real Google reviews from REVIEWS in data/site.js (the first three); hidden if there are none
function Reviews() {
  const list = REVIEWS.filter((r) => r.text).slice(0, 3);
  if (!list.length) return null;
  return (
    <section className="container reviews">
      <div className="reviews__head">
        <div>
          <div className="reviews__stars" aria-hidden="true">★★★★★</div>
          <h2 data-reveal="" className="t-xl mt-10">What Our Clients Say</h2>
        </div>
        <a href={SITE.googleReviews} target="_blank" rel="noopener noreferrer" className="btn btn--outline">All Reviews on Google →</a>
      </div>
      <div className="reviews__grid">
        {list.map((r) => (
          <figure data-reveal="" className="review" key={r.name}>
            <div className="review__stars" role="img" aria-label={`Rated ${r.stars || 5} out of 5 on Google`}>{starsOf(r.stars || 5)}</div>
            <blockquote className="review__text">{r.text}</blockquote>
            <figcaption className="review__who"><strong>{r.name}</strong><span>{r.service}</span></figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function MapEmbed({ tall = false }) {
  return (
    <div className="map-wrap">
      <div className={'map' + (tall ? ' map--tall' : '')}>
        <iframe title="Habib’s Fuljhore on Google Maps" src={SITE.mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      </div>
      <a href={SITE.googleMaps} target="_blank" rel="noopener noreferrer" className="map__link">
        <MapPin size={15} aria-hidden="true" />View Habibs Salon (Fuljhore) on Google Maps →
      </a>
    </div>
  );
}

function FindUs() {
  return (
    <section className="find-us">
      <div className="container find-us__inner">
        <div>
          <div className="eyebrow">B-1 More · Durgapur</div>
          <h2 data-reveal="" className="t-xl mt-12">Find Us in Fuljhore</h2>
          <p className="find-us__addr">{SITE.address}</p>
          <p className="muted fs-15 mt-14">{SITE.hoursLong}</p>
          <div className="btn-row mt-28">
            <a href={SITE.directions} target="_blank" rel="noopener noreferrer" className="btn btn--primary btn--54">Get Directions →</a>
            <a href={SITE.tel} className="btn btn--outline btn--54">Call Now</a>
          </div>
        </div>
        <MapEmbed />
      </div>
    </section>
  );
}
