// Used only at build time by scripts/prerender.mjs: renders each page to HTML with the menu snapshot,
// so search engines and link previews (WhatsApp, Facebook) see the full page, prices included.
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';
import { getCatalogue } from './lib/catalogue';
import { PAGE_META, SITE } from './data/site';

export { PAGE_META, SITE };

export function render(url) {
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  );
}

// Services shown on a page, for the structured data Google reads (name + starting price)
export function servicesFor(path) {
  const { groups, salon } = getCatalogue();
  const pick = {
    '/services': () => true,
    '/hair': (g) => g.cat === 'hair',
    '/beauty': (g) => g.cat === 'beauty' || g.cat === 'nails',
    '/bridal': (g) => ['bridal', 'groom', 'makeup'].includes(g.cat),
  }[path];
  if (!pick) return null;
  return {
    gst: !!(salon && salon.prices_include_gst),
    groups: groups.filter(pick).map((g) => ({ title: g.title, items: g.its.filter((i) => i.p.length).map((i) => ({ n: i.label, min: i.min, from: i.from })) })),
  };
}
