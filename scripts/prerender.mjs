// Runs after `vite build` (see package.json): turns the single-page app into one ready-made HTML file per page.
// Each page gets its own title, description, link-preview tags (WhatsApp / Facebook / X), structured data for
// Google (salon details, map pin, hours, services and prices) and the page content itself, so search engines
// don't have to run JavaScript to see it. The app then takes over in the browser as before.
//
// Set SITE_URL (e.g. https://habibsfuljhore.in) in .env or the host's build settings to also get canonical links,
// absolute preview images and sitemap.xml. Without it those are left out (everything else still works).
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const ssrDir = resolve(root, 'dist-ssr');

// Same env files Vite reads for a production build; real environment variables win
const env = {};
for (const f of ['.env', '.env.local', '.env.production', '.env.production.local']) {
  const p = resolve(root, f);
  if (!existsSync(p)) continue;
  for (const line of readFileSync(p, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
  }
}
const read = (k) => process.env[k] || env[k] || '';
const SITE_URL = (read('SITE_URL') || read('VITE_SITE_URL')).replace(/\/+$/, '');
const API_URL = read('VITE_SUPABASE_URL').replace(/\/+$/, '');

const entry = readdirSync(ssrDir).find((f) => /^entry-server\.m?js$/.test(f));
const { render, servicesFor, PAGE_META, SITE } = await import(pathToFileURL(resolve(ssrDir, entry)).href);

const template = readFileSync(resolve(dist, 'index.html'), 'utf8');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const json = (o) => JSON.stringify(o).replace(/</g, '\\u003c');
const abs = (p) => (SITE_URL ? SITE_URL + p : '');

// Preview image per page (files in public/images)
const OG_IMAGE = {
  '/': 'home-hero-1600', '/hair': 'page-hair-1400', '/beauty': 'page-beauty-1400', '/bridal': 'bride-1200',
  '/services': 'cat-hair-1200', '/about': 'history-today-440', '/contact': 'home-hero-1600',
};
const PAGE_NAME = { '/services': 'Services & Prices', '/hair': 'Hair', '/beauty': 'Beauty', '/bridal': 'Bridal & Groom', '/about': 'About', '/contact': 'Contact' };

// Fonts used above the fold: fetched in parallel with the CSS instead of after it
const fonts = readdirSync(resolve(dist, 'assets')).filter((f) => /^jost-latin-(400|500)-normal-.*\.woff2$/.test(f));

function salonData(path) {
  const d = {
    '@context': 'https://schema.org',
    '@type': 'HairSalon',
    name: SITE.name,
    alternateName: 'Habibs Salon ( Fuljhore )',
    description: 'Premium hair, beauty, makeup and bridal salon at B1 More, Fuljhore, Durgapur.',
    telephone: SITE.phoneDisplay,
    email: SITE.email,
    address: {
      '@type': 'PostalAddress', streetAddress: SITE.street, addressLocality: 'Durgapur',
      addressRegion: 'West Bengal', postalCode: SITE.postalCode, addressCountry: 'IN',
    },
    geo: { '@type': 'GeoCoordinates', latitude: SITE.geo.lat, longitude: SITE.geo.lng },
    hasMap: SITE.googleMaps,
    openingHoursSpecification: [{
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: SITE.opens, closes: SITE.closes,
    }],
    sameAs: [SITE.instagram, SITE.googleMaps].filter((u) => u && !/^https:\/\/facebook\.com\/?$/.test(u)),
    priceRange: '₹₹',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, UPI, Card',
  };
  if (SITE_URL) { d.url = SITE_URL + '/'; d.image = abs('/images/home-hero-1600.webp'); d.logo = abs('/images/habibs-logo-red-400.webp'); }
  const svc = servicesFor(path);
  if (svc && svc.groups.length) {
    d.hasOfferCatalog = {
      '@type': 'OfferCatalog',
      name: (PAGE_NAME[path] || 'Services') + ' at ' + SITE.name,
      itemListElement: svc.groups.map((g) => ({
        '@type': 'OfferCatalog',
        name: g.title,
        itemListElement: g.items.map((i) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: i.n },
          priceCurrency: 'INR',
          ...(i.from
            ? { priceSpecification: { '@type': 'PriceSpecification', minPrice: i.min, priceCurrency: 'INR', valueAddedTaxIncluded: svc.gst } }
            : { price: i.min }),
        })),
      })),
    };
  }
  return d;
}

function headFor(path, title, desc) {
  const url = abs(path === '/' ? '/' : path);
  const img = abs('/images/' + (OG_IMAGE[path] || OG_IMAGE['/']) + '.webp');
  const tags = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(desc)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(SITE.name)}" />`,
    `<meta property="og:locale" content="en_IN" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(desc)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(desc)}" />`,
  ];
  if (url) tags.push(`<link rel="canonical" href="${url}" />`, `<meta property="og:url" content="${url}" />`);
  if (img) tags.push(`<meta property="og:image" content="${img}" />`, `<meta name="twitter:image" content="${img}" />`, `<meta property="og:image:alt" content="${esc(SITE.name)}" />`);
  if (API_URL) tags.push(`<link rel="preconnect" href="${API_URL}" crossorigin />`);
  fonts.forEach((f) => tags.push(`<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`));
  const ld = [salonData(path)];
  if (SITE_URL && path !== '/') {
    ld.push({
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL + '/' },
        { '@type': 'ListItem', position: 2, name: PAGE_NAME[path] || title, item: url },
      ],
    });
  }
  ld.forEach((o) => tags.push(`<script type="application/ld+json">${json(o)}</script>`));
  return tags.join('\n    ');
}

const pages = Object.keys(PAGE_META);
for (const path of pages) {
  const [title, desc] = PAGE_META[path];
  const html = render(path);
  if (!html || html.length < 500) throw new Error(`Prerender of ${path} looks empty`);
  const out = template
    // the template's own title / description / preview tags / structured data are replaced per page
    .replace(/<title>[\s\S]*?<\/title>/, '')
    .replace(/\s*<meta (name="description"|property="og:[a-z:]+")[^>]*>/g, '')
    .replace(/\s*<!-- After you connect a domain[\s\S]*?-->/, '')
    .replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/, '')
    .replace('<link rel="icon"', () => `${headFor(path, title, desc)}\n    <link rel="icon"`)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`);
  // "/" → index.html (also the fallback for unknown addresses); "/hair" → hair.html (served at /hair)
  const file = path === '/' ? 'index.html' : path.slice(1) + '.html';
  mkdirSync(dirname(resolve(dist, file)), { recursive: true });
  writeFileSync(resolve(dist, file), out);
  console.log(`[prerender] ${path.padEnd(10)} → dist/${file} (${Math.round(out.length / 1024)} KB)`);
}

// Search engines: the page list, and where to find it
if (SITE_URL) {
  const today = new Date().toISOString().slice(0, 10);
  const prio = { '/': '1.0', '/services': '0.9', '/hair': '0.9', '/beauty': '0.9', '/bridal': '0.9' };
  writeFileSync(resolve(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${SITE_URL}${p === '/' ? '/' : p}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>${prio[p] || '0.6'}</priority></url>`).join('\n')}
</urlset>
`);
  writeFileSync(resolve(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
  console.log('[prerender] sitemap.xml and robots.txt written for ' + SITE_URL);
} else {
  console.warn('[prerender] SITE_URL not set: no canonical links, absolute preview images or sitemap.xml. Set it once the domain is known.');
}

rmSync(ssrDir, { recursive: true, force: true });
