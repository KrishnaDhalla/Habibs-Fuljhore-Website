// Talks to the salon's billing database (Habibs POS, Supabase).
// The website uses only the public (anon) key and can only call these three functions:
//   web_site()         menu, prices, offers and salon details
//   request_booking()  a booking request  → POS: Bookings → Requests
//   request_enquiry()  a question         → POS: Bookings → Enquiries
// See docs/WEBSITE.md in the POS project.

const URL = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/+$/, '');
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const apiReady = !!(URL && KEY);

const headers = { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' };

async function rpc(name, body, fallbackMsg) {
  if (!apiReady) throw new Error(fallbackMsg);
  let r;
  try {
    r = await fetch(`${URL}/rest/v1/rpc/${name}`, { method: 'POST', headers, body: JSON.stringify(body) });
  } catch {
    throw new Error('No internet connection. ' + fallbackMsg);
  }
  let out = null;
  try { out = await r.json(); } catch { /* empty body */ }
  // The database writes its error messages for the customer ("Enter a 10-digit mobile number")
  if (!r.ok) throw new Error((out && out.message) || fallbackMsg);
  return out;
}

// Tell the owners on Telegram. Optional: needs the login-approval function deployed.
const notifyOwners = (action, id) => {
  if (!apiReady || !id) return;
  fetch(`${URL}/functions/v1/login-approval`, { method: 'POST', headers, body: JSON.stringify({ action, id }) }).catch(() => {});
};

export const loadSite = () => rpc('web_site', {}, 'Menu not available');

// UTM tags from the link that brought the visitor (?utm_source=instagram&utm_campaign=diwali).
// Read once on arrival and kept for the visit, because the URL changes as they move between pages.
const UTM_KEY = 'hf-utm';
const UTM_FIELDS = ['source', 'medium', 'campaign', 'content', 'term'];
function readUtm() {
  try {
    const q = new URLSearchParams(window.location.search);
    const fresh = {};
    UTM_FIELDS.forEach((k) => { const v = q.get('utm_' + k); if (v) fresh[k] = v.slice(0, 100); });
    if (Object.keys(fresh).length) { sessionStorage.setItem(UTM_KEY, JSON.stringify(fresh)); return fresh; }
    return JSON.parse(sessionStorage.getItem(UTM_KEY)) || null;
  } catch {
    return null;
  }
}
const utm = typeof window !== 'undefined' ? readUtm() : null;

// items: [{ service_id: item.uid, option: 'M', extra: 'Thick' }]. Prices are taken from the menu by the database.
export async function requestBooking({ name, phone, date, time, note, items, offerId }) {
  const out = await rpc(
    'request_booking',
    { p: { name, phone, date, time, note, items, offer_id: offerId || null, utm } },
    'Could not send the booking',
  );
  notifyOwners('booking', out && out.id);
  return out; // { id, ref, status }
}

export async function askUs({ name, phone, message, serviceIds }) {
  const out = await rpc(
    'request_enquiry',
    { p: { name, phone, message, service_ids: serviceIds && serviceIds.length ? serviceIds : null, utm } },
    'Could not send your question',
  );
  notifyOwners('enquiry', out && out.id);
  return out; // { id, ref }
}
