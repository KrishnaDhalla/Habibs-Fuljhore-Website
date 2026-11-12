// Saves a copy of the salon's menu from the billing database into src/data/menu-snapshot.json.
// Runs before every build (npm run build), so the site opens with today's prices even before the live
// data arrives, and still has a full menu if the database can't be reached.
// If the database can't be reached now, the existing snapshot is kept and the build carries on.
//
//   node scripts/sync-menu.mjs           (reads VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY from .env or the environment)
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(root, 'src/data/menu-snapshot.json');

// Same files Vite reads for a production build, later ones win; real environment variables win over all.
const env = {};
for (const f of ['.env', '.env.local', '.env.production', '.env.production.local']) {
  const p = resolve(root, f);
  if (!existsSync(p)) continue;
  for (const line of readFileSync(p, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
  }
}
const URL = (process.env.VITE_SUPABASE_URL || env.VITE_SUPABASE_URL || '').replace(/\/+$/, '');
const KEY = process.env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY || '';

const keep = (why) => {
  console.warn(`[sync-menu] ${why}. Keeping the existing src/data/menu-snapshot.json.`);
  process.exit(0);
};

if (!URL || !KEY) keep('VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY not set');

try {
  const r = await fetch(`${URL}/rest/v1/rpc/web_site`, {
    method: 'POST',
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: '{}',
    signal: AbortSignal.timeout(15000),
  });
  if (!r.ok) keep(`Database answered ${r.status}`);
  const data = await r.json();
  if (!Array.isArray(data.menu) || !data.menu.length) keep('The database returned an empty menu');
  writeFileSync(out, JSON.stringify(data, null, 1) + '\n');
  const n = data.menu.reduce((a, g) => a + g.items.length, 0);
  console.log(`[sync-menu] Saved ${n} services in ${data.menu.length} categories, ${data.offers.length} offers (version ${data.version}).`);
} catch (e) {
  keep(`Could not reach the database (${e.message})`);
}
