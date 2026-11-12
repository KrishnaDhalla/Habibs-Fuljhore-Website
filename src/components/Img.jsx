import { IMAGES } from '../data/images';

const BASE = import.meta.env.BASE_URL;
const url = (name, w) => `${BASE}images/${name}-${w}.webp`;

// Responsive <img> built from the manifest in data/images.js
export function Img({ name, sizes = '100vw', alt = '', priority = false, className, style, ...rest }) {
  const m = IMAGES[name];
  if (!m) return null;
  const multi = m.widths.length > 1;
  return (
    <img
      src={url(name, m.widths[m.widths.length - 1])}
      srcSet={multi ? m.widths.map((w) => `${url(name, w)} ${w}w`).join(', ') : undefined}
      sizes={multi ? sizes : undefined}
      width={m.w}
      height={m.h}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchpriority={priority ? 'high' : undefined}
      className={className}
      style={style}
      {...rest}
    />
  );
}
