import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PAGE_META } from '../data/site';

// Keeps the title, description and share tags right when moving between pages in the browser.
// (Each page's first load already has them in its HTML: scripts/prerender.mjs.)
const setAttr = (sel, attr, v) => { const el = document.querySelector(sel); if (el) el.setAttribute(attr, v); };

export function usePageMeta() {
  const { pathname } = useLocation();
  useEffect(() => {
    const [title, desc] = PAGE_META[pathname] || PAGE_META['/'];
    document.title = title;
    setAttr('meta[name="description"]', 'content', desc);
    setAttr('meta[property="og:title"]', 'content', title);
    setAttr('meta[property="og:description"]', 'content', desc);
    const canon = document.querySelector('link[rel="canonical"]');
    if (canon) {
      const url = new URL(canon.href).origin + pathname;
      canon.setAttribute('href', url);
      setAttr('meta[property="og:url"]', 'content', url);
    }
  }, [pathname]);
}
