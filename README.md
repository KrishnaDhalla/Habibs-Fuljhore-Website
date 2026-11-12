# Habib’s Fuljhore — React website

React 18 + Vite build of the Claude Design file, with real page URLs, responsive layouts from 320px phones to 4K screens, and optimised images.

## Run it

```bash
npm install
npm run dev        # local preview at http://localhost:5173
npm run build      # production build in dist/
npm run preview    # serve the production build locally
```

Requires Node.js 18 or newer.

## Deploy

The `dist/` folder is the finished website. Every host needs the "send all pages to index.html" rule, which is already included:

- **Netlify:** drag `dist/` onto app.netlify.com/drop (`_redirects` is included).
- **Vercel:** import the repo; framework "Vite" (`vercel.json` is included).
- **Hostinger / cPanel / any Apache host:** upload the contents of `dist/` to `public_html` (`.htaccess` is included).
- **Sub-folder hosting (e.g. GitHub Pages):** set `base: '/folder-name/'` in `vite.config.js` before building.

## How the build works (SEO)

`npm run build` does three things:

1. `scripts/sync-menu.mjs` saves today's menu from the billing database into `src/data/menu-snapshot.json`.
2. Vite builds the site, then a server build of `src/entry-server.jsx`.
3. `scripts/prerender.mjs` writes a **ready-made HTML file for every page** (`index.html`, `hair.html`, `services.html`, …) with
   its own title, description, link-preview tags (WhatsApp, Facebook, X), the page content and prices, and structured data for
   Google (salon, address, map pin, hours, and the services with prices). The app then takes over in the browser.

Set `SITE_URL` (in `.env` or the host's build settings) to the live address, e.g. `https://habibsfuljhore.in`, to also get
canonical links, absolute preview images, `sitemap.xml` and a `robots.txt` pointing to it. Then add the site in
**Google Search Console** and submit `https://YOUR-DOMAIN/sitemap.xml`.

Hosting: `/hair` is served from `hair.html`. Cloudflare Pages and Netlify do this by themselves; `vercel.json` has
`cleanUrls`, and `.htaccess` has the rule for Apache / Hostinger.

## Pages

| URL | Page |
|---|---|
| `/` | Home |
| `/services` | Full price list with search and filters |
| `/hair`, `/beauty` | Tabbed hair and beauty price lists |
| `/bridal` | Bridal, groom and occasion packages |
| `/about` | About and the Habibs story |
| `/contact` | Address, hours, map |

## Where to edit things

| What | File |
|---|---|
| Prices, services, descriptions | **The billing app (Habibs POS)**: Settings → Services & prices. The site reads them from the database |
| Phone, email, social links, address, hours | `SITE` in `src/data/site.js` |
| Facebook URL (currently a placeholder) | `SITE.facebook` in `src/data/site.js` |
| Offers | **The billing app**: Settings → Offers, tick "Show on the website" |
| WhatsApp number for every WhatsApp button | **The billing app**: Settings → Salon & bill → WhatsApp number (or its phone number) |
| Which prices the home page lists | `PRICE_PREVIEW` and `BRIDAL_LIST` in `src/data/site.js` |
| Reviews (currently placeholders) | `REVIEWS` in `src/data/site.js` |
| History timeline, "Why Habib’s", bridal list | `src/data/site.js` |
| Page titles and descriptions (SEO) | `PAGE_META` in `src/data/site.js` |
| Colours and fonts | CSS variables at the top of `src/styles/base.css` |
| Photos | `public/images/` — see below |

### Replacing photos

Photos are served as responsive WebP files (`name-width.webp`). Put your new originals in a folder with the same file names (`home-hero.png`, `bride.png`, …) and run:

```bash
pip install pillow
python3 scripts/optimize-images.py path/to/originals
```

The service drawer uses a photo per category; change the mapping in `DETAIL_IMAGE` (`src/data/images.js`).

## Connection to the billing app (prices, bookings, questions)

The site uses the same Supabase database as the billing app (Habibs POS), with the **public anon key only**. See `docs/WEBSITE.md` in the POS project.

1. Copy `.env.example` to `.env` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (on Cloudflare / Vercel / Netlify set them as build environment variables). Never use the `service_role` key.
2. `npm run build`. Before building, `scripts/sync-menu.mjs` saves the current menu into `src/data/menu-snapshot.json`, so the site opens with today's prices straight away.

What happens:

- **Prices:** every visit loads the menu, offers and salon details from the database (`web_site()`). Until it arrives, the visitor sees the copy saved in their browser from the last visit, or the build-time snapshot. A price changed in the billing app shows on the next page load, with no rebuild. Rebuilding only refreshes the snapshot.
- **Bookings:** sent to the database (`request_booking()`) and shown in the billing app under **Bookings → Requests**, and the owners get a Telegram message. The database works out the price; the website's estimate is only shown to the customer. Hair length and thick hair can be chosen on the confirm step. If the database refuses (e.g. too many requests), the customer sees the reason and a WhatsApp button.
- **Questions ("Ask us"):** the **Ask on WhatsApp** buttons (service drawer, bridal packages, Contact page, empty search) open a short form. Sending it opens WhatsApp to the salon with the question typed, and records it in the billing app under **Bookings → Enquiries** (`request_enquiry()`), with a Telegram message to the owners.
- **Without the keys** the site still works from the snapshot: bookings and questions go by WhatsApp only.

To refresh the snapshot by hand: `npm run sync-menu`.

## Project structure

```
src/
  App.jsx               routes + global overlays
  components/           Header, Footer, BookingModal, ServiceDetail, OffersPanel, …
  pages/                Home, Catalogue (services/hair/beauty), Bridal, About, Contact
  data/                 site.js, images.js, menu-snapshot.json (copy of the database menu)
  lib/                  catalogue.js (menu store, search, pricing), salonApi.js (database calls), dates
  hooks/                scroll reveal, page titles, media query
  styles/               base, layout, home, pages, overlays
public/images/          optimised WebP photos
```

## Before going live

- Replace the Facebook placeholder URL and the placeholder reviews.
- Confirm the founding year shown in the Heritage strip (1983) against the story timeline (1968).
- Point `.env` / the host's build variables at the **Live** Supabase project once it is set up (`.env` currently points at the Test project `habibs-test`).
- Add the Groom Makeup offer (₹2,999) in the billing app (Settings → Offers, "Show on the website"); the website no longer has its own offers.
- Copy the category descriptions and "what's included" lists into the billing app. The old text is in `docs/old-rate-card.js`.
- After connecting a domain, set `SITE_URL` and rebuild, then submit the sitemap in Google Search Console.
- Add real Google reviews to `REVIEWS` in `src/data/site.js`: the reviews section on the home page stays hidden until then.
