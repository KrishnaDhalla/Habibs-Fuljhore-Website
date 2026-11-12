import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Img } from '../components/Img';
import { useUI } from '../context/UIContext';
import { forOk, match, priceOk, tok, useCatalogue } from '../lib/catalogue';
import { CAT_LABELS } from '../data/site';

const uniq = (xs) => [...new Set(xs.filter(Boolean))];
const tabOf = (g) => g.tab || g.title;
const onPage = (mode, g) => (mode === 'hair' ? g.cat === 'hair' : g.cat === 'beauty' || g.cat === 'nails');

const COPY = {
  hair: {
    title: 'Hair', eyebrow: 'Hair Services & Prices', img: 'page-hair',
    intro: 'Cuts, styling, colour, spa and smoothing treatments. Treatment prices are listed by hair length.',
  },
  beauty: {
    title: 'Beauty', eyebrow: 'Beauty Services & Prices', img: 'page-beauty',
    intro: 'D-tan and bleach, threading, waxing, manicures, pedicures, clean-ups and facials.',
  },
};

// One page component for /services (searchable full list), /hair and /beauty (tabbed)
export default function Catalogue({ mode }) {
  const [params] = useSearchParams();
  const [q, setQ] = useState(() => params.get('q') || '');
  const [cat, setCat] = useState('all');
  const [price, setPrice] = useState('any');
  const [type, setType] = useState('any');
  const [who, setWho] = useState('any');
  const [tabPick, setTab] = useState('');

  // Tabs, chips and types come from the categories in the billing app
  const { groups: ALL_GROUPS } = useCatalogue();
  const tabs = mode === 'services' ? [] : uniq(ALL_GROUPS.filter((g) => onPage(mode, g)).map(tabOf));
  const tab = tabs.includes(tabPick) ? tabPick : tabs[0];
  const chips = [['all', 'All'], ...uniq(ALL_GROUPS.map((g) => g.cat)).map((c) => [c, CAT_LABELS[c] || c])];
  const types = uniq(ALL_GROUPS.map((g) => g.type));

  const t = tok(q);
  const gs = ALL_GROUPS.filter((g) => {
    if (mode !== 'services') return onPage(mode, g) && tabOf(g) === tab;
    return (cat === 'all' || g.cat === cat) && (type === 'any' || g.type === type);
  })
    .map((g) => ({ g, its: mode === 'services' ? g.its.filter((it) => priceOk(it, price) && forOk(it, who) && match(it, t)) : g.its }))
    .filter((x) => x.its.length);
  const count = gs.reduce((a, x) => a + x.its.length, 0);
  const reset = () => { setQ(''); setCat('all'); setPrice('any'); setType('any'); setWho('any'); };

  return (
    <>
      {mode === 'services' ? (
        <section className="cat-hero">
          <div className="container cat-hero__inner">
            <div className="eyebrow">Services &amp; Prices</div>
            <h1 data-reveal="" className="cat-hero__title">What are you looking for?</h1>
            <label className="search-field search-field--page">
              <Search size={19} aria-hidden="true" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search haircut, facial, hair spa, bridal makeup..." aria-label="Search services" />
            </label>
            <div className="chip-scroll">
              {chips.map(([k, l]) => (
                <button type="button" key={k} className={'chip chip--solid' + (cat === k ? ' is-active' : '')} aria-pressed={cat === k} onClick={() => setCat(k)}>{l}</button>
              ))}
            </div>
            <div className="filters">
              <select value={price} onChange={(e) => setPrice(e.target.value)} aria-label="Price range">
                <option value="any">Price: Any</option>
                <option value="u1">Under ₹1,000</option>
                <option value="m">₹1,000 – ₹5,000</option>
                <option value="o5">Above ₹5,000</option>
              </select>
              <select value={type} onChange={(e) => setType(e.target.value)} aria-label="Service type">
                <option value="any">Service type: All</option>
                {types.map((ty) => <option key={ty} value={ty}>{ty}</option>)}
              </select>
              <select value={who} onChange={(e) => setWho(e.target.value)} aria-label="For">
                <option value="any">For: Everyone</option>
                <option value="women">Women</option>
                <option value="men">Men</option>
              </select>
              <span className="filters__count" aria-live="polite">{count} {count === 1 ? 'service' : 'services'}</span>
            </div>
          </div>
        </section>
      ) : (
        <section className="page-hero">
          <div className="container page-hero__inner">
            <div className="page-hero__copy">
              <div className="eyebrow">{COPY[mode].eyebrow}</div>
              <h1 data-reveal="" className="page-hero__title">{COPY[mode].title}</h1>
              <p className="muted mt-18 maxw-460">{COPY[mode].intro}</p>
            </div>
            <div className="page-hero__media"><Img name={COPY[mode].img} alt={COPY[mode].title + ' services at Habib’s Fuljhore'} priority sizes="(max-width: 899px) 100vw, 640px" /></div>
          </div>
          <div className="container">
            <div className="tabs" role="tablist" aria-label={COPY[mode].title + ' categories'}>
              {tabs.map((tb) => (
                <button type="button" role="tab" aria-selected={tb === tab} key={tb} className={'tab' + (tb === tab ? ' is-active' : '')} onClick={() => setTab(tb)}>{tb}</button>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="container groups">
        {gs.map(({ g, its }) => <Group key={g.id + (mode === 'services' ? '' : tab)} g={g} its={its} />)}
        {gs.length === 0 && (
          <div className="groups__empty">
            <p className="groups__empty-title">No services match your search.</p>
            <p className="muted">Try a different term or clear the filters.</p>
            <button type="button" className="btn btn--primary btn--48" onClick={reset}>CLEAR FILTERS</button>
          </div>
        )}
      </section>
    </>
  );
}

function Group({ g, its }) {
  const { openDetail, openBooking, openAsk } = useUI();
  const sized = its.some((i) => i.sized);
  return (
    <div className="group">
      <div>
        <h2 data-reveal="" className="group__title">{g.title}</h2>
        {g.desc && <p className="group__desc">{g.desc}</p>}
        {g.note && <div className="group__note"><span className="diamond" aria-hidden="true" /><span>{g.note}</span></div>}
        {sized && <div className="group__sizes">Sizes: S – Shoulder · M – Below Shoulder · L – Waist · XL – Below Waist</div>}
        {g.consult && (
          <button type="button" className="btn btn--outline btn--46 mt-20" onClick={() => openBooking({ q: g.title })}>BOOK CONSULTATION</button>
        )}
      </div>
      <div>
        {its.map((it) => (
          <div className="svc-row" key={it.id}>
            <button type="button" className="svc-row__open" onClick={() => openDetail(it.id)}>
              <span className="svc-row__name">{it.n}</span>
              {it.sub && <span className="svc-row__sub">{it.sub}</span>}
              {it.inc.length > 0 && <span className="svc-row__inc">{it.inc.join(' · ')}</span>}
              {it.full && <span className="svc-row__full">{it.full}</span>}
              {it.hint && <span className="svc-row__hint">{it.hint}</span>}
            </button>
            <div className="svc-row__side">
              <span className="svc-row__price">{it.short}</span>
              {it.book
                ? <button type="button" className="btn btn--outline btn--book" onClick={() => openBooking({ ids: [it.id] })} aria-label={'Book ' + it.label}>BOOK</button>
                : <button type="button" className="btn btn--outline btn--book" onClick={() => openAsk({ ids: [it.id] })} aria-label={'Ask about ' + it.label}>ASK</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
