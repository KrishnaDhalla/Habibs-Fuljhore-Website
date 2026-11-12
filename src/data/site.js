// Salon details, links and page content. Edit these to update the site.

export const SITE = {
  name: 'Habib’s Fuljhore',
  phone: '918927563835', // used for WhatsApp links (country code + number, no +)
  phoneDisplay: '+91 8927563835',
  tel: 'tel:+918927563835',
  email: 'rkbservicesofficial@gmail.com',
  instagram: 'https://instagram.com/habibs_fuljhore',
  instagramHandle: '@habibs_fuljhore',
  facebook: 'https://facebook.com', // TODO: replace with your Facebook page URL
  // The salon's Google listing ("Habibs Salon ( Fuljhore )"): opens the exact place, with reviews and directions
  googleMaps: 'https://share.google/2t80jFVc80yH1dhtR',
  googleReviews: 'https://share.google/2t80jFVc80yH1dhtR',
  // Directions to the listing's location (the centre of the map embed below: Habibs Salon ( Fuljhore ))
  directions: 'https://www.google.com/maps/dir/?api=1&destination=23.538136796893326,87.33127847478549',
  // Map on the home and contact pages: Google Maps → the listing → Share → "Embed a map" (the src="…" part)
  mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.8433278061584!2d87.33127847478549!3d23.538136796893326!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f771d8e0e807ab%3A0xc24a524120966287!2sHabibs%20Salon%20(%20Fuljhore%20)!5e0!3m2!1sen!2sin!4v1794481060154!5m2!1sen!2sin',
  address: '1st Floor, Above Rangoli Bistro, B1 More, Fuljhore, Durgapur, West Bengal – 713214',
  addressShort: 'Habib’s Fuljhore · 1st Floor, Above Rangoli Bistro, B1 More, Fuljhore, Durgapur',
  calendarLocation: 'Habib’s Hair & Beauty, 1st Floor, Above Rangoli Bistro, B1 More, Fuljhore, Durgapur, West Bengal 713214',
  hoursShort: 'Open 7 days · 10:30 AM – 9:00 PM',
  hoursLong: 'Monday – Sunday · 10:30 AM – 9:00 PM',
  hoursDays: 'Monday – Sunday',
  hoursTime: '10:30 AM – 9:00 PM',
  // For Google's business details (structured data in every page, see scripts/prerender.mjs)
  street: '1st Floor, Above Rangoli Bistro, B1 More, Fuljhore',
  postalCode: '713214',
  geo: { lat: 23.538136796893326, lng: 87.33127847478549 },
  opens: '10:30',
  closes: '21:00',
};

// WhatsApp number for every "WhatsApp" button: the one set in the billing app (Settings → Salon & bill →
// WhatsApp number, or its phone number), as 91 + 10 digits. SITE.phone is used until the menu has loaded.
let waNum = SITE.phone;
export function setWaNumber(salon) {
  const d = String((salon && (salon.whatsapp || salon.phone)) || '').replace(/\D/g, '').slice(-10);
  waNum = d.length === 10 ? '91' + d : SITE.phone;
}
export const wa = (text) => `https://wa.me/${waNum}?text=${encodeURIComponent(text)}`;
export const waHello = (text) => wa('Hi Habib’s Fuljhore, ' + text);
export const waGeneral = () => waHello('I would like to book an appointment.');
export const waBridal = () => waHello('I’m interested in Bridal Makeup. Please share availability and details.');

export const NAV = [
  { to: '/', label: 'Home' },
  { to: '/hair', label: 'Hair' },
  { to: '/beauty', label: 'Beauty' },
  { to: '/bridal', label: 'Bridal' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

// Page titles for the browser tab and search results
export const PAGE_META = {
  '/': ['Habib’s Fuljhore | Premium Hair & Beauty Salon in Durgapur', 'Experience premium hair, beauty, makeup and bridal services at Habib’s Fuljhore, Fuljhore, Durgapur. Book your appointment today.'],
  '/services': ['Services & Prices | Habib’s Fuljhore, Durgapur', 'The full Habib’s Fuljhore rate card: haircuts, colour, hair spa, keratin, facials, waxing, makeup and bridal packages.'],
  '/hair': ['Hair Services & Prices | Habib’s Fuljhore, Durgapur', 'Haircuts, styling, colour, highlights, hair spa, smoothening and keratin treatments in Fuljhore, Durgapur.'],
  '/beauty': ['Beauty Services & Prices | Habib’s Fuljhore, Durgapur', 'D-tan, bleach, threading, waxing, manicure, pedicure, clean-ups and facials in Fuljhore, Durgapur.'],
  '/bridal': ['Bridal & Groom Makeup Packages | Habib’s Fuljhore, Durgapur', 'Bridal makeup, pre-bridal packages, groom packages, party makeup and saree draping in Durgapur.'],
  '/about': ['About Us | Habib’s Fuljhore, Durgapur', 'Habib’s Fuljhore brings the Habibs name and its decades of hair and beauty craft to Durgapur.'],
  '/contact': ['Contact & Directions | Habib’s Fuljhore, Durgapur', '1st Floor, Above Rangoli Bistro, B1 More, Fuljhore, Durgapur. Open every day, 10:30 AM – 9:00 PM. Call +91 8927563835.'],
};

export const SLOTS = ['10:30 AM', '11:00 AM', '12:00 PM', '1:30 PM', '3:00 PM', '4:30 PM', '6:00 PM', '7:30 PM'];

export const MARQUEE = ['Haircuts', 'Colour & Highlights', 'Balayage', 'Hair Spa', 'Keratin', 'Facials', 'Bridal Makeup', 'Groom Packages'];

export const QUICK_TERMS = ['Haircut', 'Hair Spa', 'Facial', 'Keratin', 'Bridal Makeup', 'Waxing'];

export const CATEGORIES = [
  { title: 'Hair', list: 'Haircuts • Styling • Colour • Highlights • Hair Spa • Keratin & Treatments', to: '/hair', img: 'cat-hair' },
  { title: 'Beauty', list: 'Threading • Waxing • D-Tan • Facials • Manicure • Pedicure', to: '/beauty', img: 'cat-beauty' },
  { title: 'Bridal & Makeup', list: 'Bridal • Groom • Party Makeup • Hairstyling • Saree Draping', to: '/bridal', img: 'cat-bridal' },
];

// Home page price list. [label, category id(s) in the database, words in the service name (optional)].
// The price is the lowest matching price in the database; rows whose category is missing are skipped.
export const PRICE_PREVIEW = [
  ['Women’s Cut & Styling', 'womens-cut', 'haircut styling'], ['Men’s Cut & Styling', 'mens-cut', 'haircut styling'],
  ['Hair Spa', ['womens-hair-spa', 'mens-hair-spa']], ['Global Colour (Women)', 'womens-colour', 'global colour'],
  ['Keratin & Smoothening', 'hair-treatments'], ['Clean-Up & Facials', ['lotus-facials', 'o3-facials']],
  ['Manicure / Pedicure', 'manicure-and-pedicure'], ['Bridal Makeup', 'makeup', 'bridal makeup'],
];

// Home page bridal list, same format.
export const BRIDAL_LIST = [
  ['Bridal Makeup', 'makeup', 'bridal makeup'], ['Pre-Bridal', 'bridal-package', 'pre bridal'],
  ['Wedding Day', 'bridal-package', 'wedding day'], ['Reception', 'makeup', 'reception'],
  ['Groom Packages', 'groom-package'], ['Party Makeup', 'makeup', 'party'], ['Saree Draping', 'makeup', 'saree'],
];

// icon names map to lucide-react icons in components/WhyHabibs.jsx
export const WHY = [
  ['Expert Professionals', 'award'], ['Premium Products', 'sparkles'], ['Hygienic & Safe', 'shield'], ['Personalised Care', 'heart'],
];

// Real reviews from the salon's Google listing (Habibs Salon ( Fuljhore )), copied word for word, November 2026.
// stars = the rating given on Google. Add new ones at the top; the home page shows the first three.
export const REVIEWS = [
  {
    text: 'Today I visited salon for hair treatment I’m fully satisfied nd this salon truly recommended for best services and staff was very polite and humble and ambience was good 💗',
    name: 'Saniya S.', service: 'Hair treatment · Google review', stars: 5,
  },
  { text: 'Legit good salon, with amazing opening offers 🔥', name: 'Shashi K.', service: 'Google review', stars: 5 },
  { text: '🤩🤩🤩🤩💗💗💗💗 Amazing experience', name: 'Aritra D.', service: 'Local Guide · Google review', stars: 5 },
];

export const STORY = [
  { year: '1968', img: 'history-1968', w: 400, text: 'Habib Ahmed becomes a celebrated hairdresser with the Oberoi Group of hotels.', pos: '50% 30%' },
  { year: '1984', img: 'history-1984', w: 400, text: 'Hair-styling and cosmetology courses begin, led by Habib Ahmed and his three sons.', pos: '50% 30%' },
  { year: '1987', img: 'history-1987a', w: 400, text: 'The first Habibs salon opens at the Lodhi Hotel, Delhi.', pos: '50% 30%' },
  { year: '1987', img: 'history-1987b', w: 400, text: 'A second store opens with India’s first salon academy — nearly 900 students a year.', pos: '50% 20%' },
  { year: '1990', img: 'history-1990', w: 400, text: 'Habibs launches its own organic skin and hair care range.', pos: '50% 25%' },
  { year: 'TODAY', img: 'history-today', w: 440, text: '150+ salons, run by the third generation — and now Durgapur.', pos: '50% 25%' },
];

// Services page chips: [page id in the database, label]. Pages with no services are hidden.
export const CAT_LABELS = { hair: 'Hair', beauty: 'Beauty', nails: 'Manicure/Pedicure', makeup: 'Makeup', bridal: 'Bridal', groom: 'Groom' };

export const SIZE_CHART = [['S', 'Shoulder'], ['M', 'Below Shoulder'], ['L', 'Waist'], ['XL', 'Below Waist']];

// Offers come from the billing app (Settings → Offers, "Show on the website"). These two cards are always shown
// with them: a bridal consultation card, and a "more offers soon" card when there are no offers.
export const BRIDAL_CARD = {
  id: 'bridal', live: true, tag: 'BRIDAL', title: 'Bridal Makeup Consultation',
  note: 'Bridal and reception makeup, pre-bridal care and wedding-day packages. Talk to our team about your date.',
  img: 'bride', pos: '70% 30%', bookLabel: 'BOOK CONSULTATION', book: { ids: [], q: 'bridal' },
  waText: 'I’d like a bridal makeup consultation. Please share availability and details.',
};
export const SOON_CARD = {
  id: 'soon', live: false, tag: 'COMING SOON', title: 'More offers on the way', price: '',
  note: 'New seasonal, hair and beauty offers are added here first. Message us to hear about them on WhatsApp.',
  img: 'cat-beauty', pos: '50% 40%', book: null, waText: 'Please notify me about new offers.',
};

// Offers set on the website itself (from the printed flyer), shown with the billing app's offers.
// Each shows only between `starts` and `ends` (dates in India). `ids` are services in the billing app,
// preselected when the customer taps BOOK; `bundle` = one price for all of them together.
// Better long term: add these in the billing app (Settings → Offers) so the bill applies them too.
export const SITE_OFFERS = [
  {
    id: 'diwali-hair-50', starts: '2026-11-01', ends: '2026-11-15', tag: 'GRAND OPENING · DIWALI',
    title: '50% Off Hair Treatments & Spa', price: '50% off',
    note: 'Keratin from ₹1,999 · Smoothening from ₹2,249 · Botox & Nanoplastia from ₹2,749 · Hair Spa from ₹399. By appointment. Prices for short / bob length. Botox & nanoplastia: 50% off bob length, 25% off longer hair.',
    img: 'page-hair', q: 'hair treatments',
  },
  {
    id: 'diwali-everyday-20', starts: '2026-11-01', ends: '2026-11-15', tag: 'GRAND OPENING · DIWALI',
    title: '20% Off Everyday Services', price: '20% off',
    note: 'Haircut, beard, threading, waxing, D-tan, manicure & pedicure. Not on colour, facials or makeup.',
    img: 'cat-beauty', q: '',
  },
  {
    id: 'combo-bhai-phonta', starts: '2026-11-01', ends: '2026-11-15', tag: 'DIWALI COMBO',
    title: 'Bhai Phonta Grooming', bundle: 899,
    note: 'Haircut + beard trim + O3+ D-tan.',
    img: 'groom', ids: ['mens-haircut-and-styling', 'beard-trim-shape', 'o3-d-tan-face-and-neck'],
  },
  {
    id: 'combo-diwali-glow', starts: '2026-11-01', ends: '2026-11-15', tag: 'DIWALI COMBO',
    title: 'Diwali Glow', bundle: 1799, worth: 2248,
    note: 'Lotus fruit facial + O3+ D-tan + eyebrows.',
    img: 'page-beauty', ids: ['o3-d-tan-face-and-neck', 'threading-eyebrows'], extra: 'Lotus fruit facial',
  },
  {
    id: 'combo-diwali-glow-plus', starts: '2026-11-01', ends: '2026-11-15', tag: 'DIWALI COMBO',
    title: 'Diwali Glow Plus', bundle: 2999, worth: 4248,
    note: 'O3+ premium facial + O3+ D-tan + eyebrows.',
    img: 'cat-bridal', ids: ['o3-d-tan-face-and-neck', 'threading-eyebrows'], extra: 'O3+ premium facial',
  },
];
