// Responsive image manifest. Files live in public/images as <name>-<width>.webp.
// To replace a photo, run scripts/optimize-images.py on your new originals (same file names).
export const IMAGES = {
  'home-hero': { widths: [960, 1600], w: 1672, h: 941 },
  'cat-hair': { widths: [640, 1200], w: 1448, h: 1086 },
  'cat-beauty': { widths: [640, 1200], w: 1448, h: 1086 },
  'cat-bridal': { widths: [640, 1200], w: 1448, h: 1086 },
  bride: { widths: [640, 1200], w: 1402, h: 1122 },
  groom: { widths: [640, 1200], w: 1586, h: 992 },
  'page-hair': { widths: [800, 1400], w: 1586, h: 992 },
  'page-beauty': { widths: [800, 1400], w: 1586, h: 992 },
  'history-1968': { widths: [400], w: 400, h: 328 },
  'history-1984': { widths: [400], w: 381, h: 381 },
  'history-1987a': { widths: [400], w: 315, h: 253 },
  'history-1987b': { widths: [400], w: 306, h: 405 },
  'history-1990': { widths: [400], w: 398, h: 399 },
  'history-today': { widths: [440], w: 434, h: 333 },
  'habibs-logo-red': { widths: [400], w: 400, h: 131 },
  'habibs-logo-white': { widths: [400], w: 400, h: 131 },
};

// Photo shown at the top of the service detail drawer, by catalogue category
export const DETAIL_IMAGE = { hair: 'page-hair', beauty: 'cat-beauty', nails: 'page-beauty', makeup: 'cat-bridal', bridal: 'bride', groom: 'groom' };
