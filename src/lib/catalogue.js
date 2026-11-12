// The salon's menu, offers and details, from the billing database (see lib/salonApi.js).
//
// Where the data comes from, best first:
//   1. live: web_site() from the database, fetched on every visit (refreshSite)
//   2. the copy saved in this browser on the last visit (shown at once, so there's no flash)
//   3. src/data/menu-snapshot.json, saved from the database at build time (scripts/sync-menu.mjs)
// Components call useCatalogue() so they re-render when the live prices arrive.
import { useSyncExternalStore } from 'react';
import SNAPSHOT from '../data/menu-snapshot.json';
import { apiReady, loadSite } from './salonApi';
import { setWaNumber, SITE_OFFERS } from '../data/site';
import { DETAIL_IMAGE, IMAGES } from '../data/images';

export const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN');

export const norm = (s) =>
  String(s || '').toLowerCase().replace(/colour/g, 'color').replace(/make-up/g, 'makeup').replace(/[-/()&+,.']/g, ' ');
export const tok = (q) => norm(q).split(/\s+/).filter(Boolean);

// How a service is named in booking summaries and WhatsApp messages, so "Full Legs" reads
// "Rica Wax — Full Legs" and "Global Colour" reads "Women's Global Colour".
// [prefix, joiner] by category id; categories not listed get "<Category> — <Service>".
const PREFIX = {
  'mens-cut': ["Men's", ' '], 'womens-cut': ["Women's", ' '],
  'mens-colour': ["Men's", ' '], 'womens-colour': ["Women's", ' '],
  'mens-hair-spa': ["Men's", ' '], 'womens-hair-spa': ["Women's", ' '],
  'lotus-facials': ['Lotus', ' '], 'o3-facials': ['O3+', ' '],
  'raaga-dtan': ['Raaga D-Tan', ' — '], 'o3-dtan': ['O3+ D-Tan', ' — '],
  'mens-rica': ["Men's Rica Wax", ' — '], 'peel-off-wax': ['Peel-off Wax', ' — '],
  'hair-treatments': ['', ''], 'manicure-and-pedicure': ['', ''], makeup: ['', ''],
};
function labelOf(g, n) {
  const [pre, join] = PREFIX[g.id] || [g.title, ' — '];
  if (!pre) return n;
  const hay = norm(n).replace(/\s+/g, ' ');
  const word = norm(pre).replace(/\s+/g, ' ').trim();
  const single = word.replace(/s$/, '');
  return hay.includes(word) || hay.includes(single) ? n : pre + join + n;
}

const extraText = (x) => (x && x.choices && x.choices.length
  ? x.title + ': ' + x.choices.map((c) => c.label + ' +' + fmt(c.price)).join(', ')
  : '');

function mk(g, it, i) {
  const p = (it.p || []).map(Number);
  const min = p.length ? Math.min(...p) : 0;
  const lbl = it.lbl && it.lbl.length === p.length ? it.lbl : null;
  let short;
  let full = '';
  if (!p.length) short = 'Price on request';
  else if (it.from) short = 'Starting from ' + fmt(min);
  else if (p.length > 1) {
    short = 'From ' + fmt(min);
    full = lbl ? lbl.map((l, k) => l + ' ' + fmt(p[k])).join('  ·  ') : p.map((v) => fmt(v)).join(' / ');
  } else short = fmt(min);
  return {
    id: it.slug || g.id + '-' + i,
    uid: it.uid || null, // the service id in the database; needed to book online
    gid: g.id, g, group: g.title, n: it.n, label: labelOf(g, it.n),
    sub: it.sub || '', inc: it.inc || [], desc: it.desc || '', p, lbl, min,
    from: !!it.from || p.length > 1, sized: !!it.sized,
    dur: it.dur || null, forG: it.for || 'any', book: it.book !== false,
    extra: it.extra && it.extra.choices && it.extra.choices.length ? it.extra : null,
    short, full, hint: extraText(it.extra),
    hay: norm([it.n, g.title, it.sub, (it.inc || []).join(' '), it.bill_name].join(' ')),
    head: norm(it.n + ' ' + g.title),
  };
}

const IMG_OK = (name) => (name && IMAGES[name] ? name : null);
const dayLabel = (s) => {
  const [y, m, d] = String(s).split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

// An offer from the database, in the shape the offers panel shows.
function mapOffer(o, byId) {
  const svc = (o.services || []).map((s) => byId[s]).filter(Boolean);
  const one = svc.length === 1 ? svc[0] : null;
  let price = '';
  let old = '';
  let save = '';
  if (o.kind === 'price') {
    price = fmt(o.value);
    if (one && one.min > o.value) { old = fmt(one.min); save = 'Save ' + fmt(one.min - o.value); }
  } else if (o.kind === 'percent') price = Number(o.value) + '% off';
  else if (o.kind === 'amount') price = fmt(o.value) + ' off';

  const bits = [o.text];
  if (o.min_bill) bits.push('On bills of ' + fmt(o.min_bill) + ' or more.');
  if (o.new_customers_only) bits.push('For first visits.');
  if (o.ends_on) bits.push('Valid till ' + dayLabel(o.ends_on) + '.');
  const live = o.live !== false;
  const bookIds = svc.filter((s) => s.book && s.uid).map((s) => s.id);

  return {
    id: o.id, live, title: o.title,
    tag: live ? (o.tag || 'OFFER') : 'FROM ' + dayLabel(o.starts_on).toUpperCase(),
    price, old, save, note: bits.filter(Boolean).join(' '),
    img: IMG_OK(o.image) || (svc[0] && DETAIL_IMAGE[svc[0].g.cat]) || 'cat-beauty', pos: '60% 30%',
    bookLabel: 'BOOK THIS OFFER',
    book: live
      ? {
        ids: bookIds,
        q: bookIds.length ? '' : (svc[0] ? svc[0].group : ''),
        offerId: o.id,
        req: 'Offer: ' + o.title + (price ? ' @ ' + price : ''),
        offer: o.kind === 'price' && one ? { id: one.id, price: Number(o.value), label: o.title + ' (offer)', was: fmt(one.min) } : null,
      }
      : null,
    waText: 'I’m interested in the ' + o.title + ' offer' + (price ? ' (' + price + ')' : '') + '. Please share availability.',
  };
}

// Today in India (offer dates are Indian dates)
const todayIST = () => new Date(Date.now() + 330 * 60000).toISOString().slice(0, 10);

// An offer from SITE_OFFERS (data/site.js), in the shape the offers panel shows.
function mapSiteOffer(o, byId) {
  const svc = (o.ids || []).map((id) => byId[id]).filter(Boolean);
  const ids = svc.filter((s) => s.book && s.uid).map((s) => s.id);
  const worth = o.worth || (o.bundle && svc.length ? svc.reduce((a, s) => a + s.min, 0) : 0);
  const price = o.bundle ? fmt(o.bundle) : (o.price || '');
  const label = o.title + (o.bundle ? ' combo @ ' + fmt(o.bundle) : ' offer') + (o.extra ? ' (includes ' + o.extra + ')' : '');
  return {
    id: o.id, live: true, title: o.title, tag: o.tag || 'OFFER', price,
    old: worth && o.bundle && worth > o.bundle ? fmt(worth) : '',
    save: worth && o.bundle && worth > o.bundle ? 'Save ' + fmt(worth - o.bundle) : '',
    note: o.note + (o.ends ? ' Valid till ' + dayLabel(o.ends) + '.' : ''),
    img: IMG_OK(o.img) || 'cat-beauty', pos: o.pos || '60% 30%', bookLabel: 'BOOK THIS OFFER',
    book: {
      ids, q: ids.length ? '' : (o.q || ''), offerId: null, req: 'Offer: ' + label,
      offer: o.bundle && ids.length ? { ids, price: o.bundle, label, was: worth ? fmt(worth) : '' } : null,
    },
    waText: 'I’m interested in the ' + label + '. Please share availability.',
  };
}

function build(data, source) {
  const menu = (data && Array.isArray(data.menu) && data.menu) || [];
  const items = [];
  const groups = menu.map((g) => ({
    ...g,
    tab: g.tab || '',
    type: g.type || '',
    its: (g.items || []).map((it, i) => {
      const x = mk(g, it, i);
      items.push(x);
      return x;
    }),
  })).filter((g) => g.its.length);
  const byId = Object.fromEntries(items.map((i) => [i.id, i]));
  const today = todayIST();
  const offers = [
    ...SITE_OFFERS.filter((o) => (!o.starts || o.starts <= today) && (!o.ends || o.ends >= today)).map((o) => mapSiteOffer(o, byId)),
    ...((data && data.offers) || []).map((o) => mapOffer(o, byId)),
  ];
  return {
    source, version: (data && data.version) || '', salon: (data && data.salon) || null,
    groups, items, byId, offers, liveOffers: offers.filter((o) => o.live).length,
    // Bookings go to the database only when we know each service's database id
    canBook: apiReady && items.length > 0 && items.every((i) => i.uid),
  };
}

// ---------- the store ----------
// The page is prerendered at build time with the snapshot, so the first render in the browser uses the
// same snapshot (it must match the HTML). Right after that, startSite() swaps in the copy saved in this
// browser (if newer), then the live data.
const CACHE = 'salon-site-v1';
const first = build(SNAPSHOT, 'snapshot');
let state = first;
setWaNumber(state.salon);

const listeners = new Set();
const subscribe = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };
const getState = () => state;
const getFirst = () => first;
const publish = (next) => {
  state = next;
  setWaNumber(state.salon);
  listeners.forEach((fn) => fn());
};

export const useCatalogue = () => useSyncExternalStore(subscribe, getState, getFirst);
export const getCatalogue = getState;

let loading = null;
export function refreshSite() {
  if (!apiReady) return Promise.resolve(state);
  if (!loading) {
    loading = loadSite()
      .then((fresh) => {
        if (!fresh || !Array.isArray(fresh.menu)) return state;
        try { localStorage.setItem(CACHE, JSON.stringify(fresh)); } catch { /* full or blocked */ }
        if (fresh.version !== state.version || state.source !== 'live') publish(build(fresh, 'live'));
        return state;
      })
      .catch(() => state) // keep showing the saved or bundled copy
      .finally(() => { loading = null; });
  }
  return loading;
}

// Browser only, after the page has hydrated: the saved copy at once (if it differs), then the live data.
export function startSite() {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE));
    if (cached && Array.isArray(cached.menu) && cached.menu.length && cached.version !== state.version) publish(build(cached, 'cache'));
  } catch { /* no storage: keep the snapshot */ }
  return refreshSite();
}

// ---------- helpers (read the current state) ----------
export const match = (it, t) => t.every((x) => it.hay.includes(x));

export function priceOk(it, pr) {
  if (pr === 'any') return true;
  if (!it.p.length) return false;
  if (pr === 'u1') return it.min < 1000;
  if (pr === 'm') return it.min >= 1000 && it.min <= 5000;
  return it.min > 5000;
}

export const forOk = (it, f) => f === 'any' || it.forG === 'any' || it.forG === f;

export const groupMin = (gid) => {
  const g = state.groups.find((x) => x.id === gid);
  const ps = g ? g.its.filter((i) => i.p.length).map((i) => i.min) : [];
  return ps.length ? Math.min(...ps) : null;
};

export const plusPrice = (it) => (it.from ? fmt(it.min) + '+' : fmt(it.min));

// A price for a home page list: the cheapest service in these categories whose name has these words.
// Returns { it, text } or null when nothing matches (the row is then hidden).
export function priceRef(gids, words) {
  const ids = [].concat(gids);
  const t = tok(words);
  const its = state.items.filter((i) => ids.includes(i.gid) && i.p.length && t.every((x) => norm(i.n).includes(x)));
  if (!its.length) return null;
  const it = its.reduce((a, b) => (b.min < a.min ? b : a));
  const open = its.length > 1 || it.from;
  return { it, min: it.min, text: (open ? 'From ' : '') + fmt(it.min) };
}

// Home search: ranked hits, best phrase matches first
export function searchServices(q) {
  const t = tok(q);
  if (!t.length) return [];
  const phrase = norm(q).trim().replace(/\s+/g, ' ');
  const score = (it) =>
    (it.head.replace(/\s+/g, ' ').includes(phrase) ? 0 : 2) - (t.every((x) => it.head.includes(x)) ? 1 : 0);
  return state.items
    .filter((it) => match(it, t))
    .map((it, i) => [it, score(it), i])
    .sort((a, b) => a[1] - b[1] || a[2] - b[2])
    .map((x) => x[0]);
}

// Price of one booked service, with the chosen option (hair length) and extra (thick hair).
// { v: rupees, from: true when the final price is still open }
// Is this service part of the offer being booked? (one service, or a combo of several)
export const inOffer = (offer, id) => !!offer && (offer.ids ? offer.ids.includes(id) : offer.id === id);

export function priceWith(it, choice) {
  const c = choice || {};
  const k = c.option && it.lbl ? it.lbl.indexOf(c.option) : -1;
  let v = k >= 0 ? it.p[k] : it.min;
  let from = k >= 0 ? false : it.from;
  if (it.from && it.p.length === 1) from = true;
  const ex = c.extra && it.extra ? it.extra.choices.find((x) => x.label === c.extra) : null;
  if (ex) v += Number(ex.price);
  return { v, from };
}

export function totalOf(sel, offer, choices = {}) {
  const its = sel.map((id) => state.byId[id]).filter(Boolean);
  if (!its.length) return '—';
  let sum = 0;
  let from = false;
  let counted = false;
  for (const i of its) {
    if (inOffer(offer, i.id)) { if (!counted) { sum += offer.price; counted = true; } continue; } // offer price once
    const x = priceWith(i, choices[i.id]);
    sum += x.v;
    from = from || x.from;
  }
  if (!sum) return '—';
  return (from ? 'From ' : '') + fmt(sum);
}
