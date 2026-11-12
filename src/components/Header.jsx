import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Clock, Gift, Menu, X } from 'lucide-react';
import { BrandIcon } from './BrandIcon';
import { Img } from './Img';
import { useUI } from '../context/UIContext';
import { OfferCount } from './Floating';
import { NAV, SITE, waGeneral } from '../data/site';

export function Header() {
  const { openBooking, toggleOffers, toggleMenu, menuOpen, closeMenu } = useUI();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <header className={'site-header' + (scrolled ? ' is-scrolled' : '')}>
      <div className="topbar">
        <div className="container topbar__inner">
          <span className="topbar__hours"><Clock size={14} aria-hidden="true" />{SITE.hoursShort}</span>
          <div className="topbar__links">
            <a href={waGeneral()} target="_blank" rel="noopener noreferrer"><BrandIcon name="whatsapp" size={14} />WhatsApp</a>
            <a href={SITE.instagram} target="_blank" rel="noopener noreferrer"><BrandIcon name="instagram" size={13} />Instagram</a>
            <a href={SITE.facebook} target="_blank" rel="noopener noreferrer"><BrandIcon name="facebook" size={13} />Facebook</a>
            <a href={SITE.googleReviews} target="_blank" rel="noopener noreferrer"><span className="stars" aria-hidden="true">★★★★★</span> Google Reviews</a>
          </div>
        </div>
      </div>

      <div className="container header__main">
        <Link to="/" className="brand" onClick={closeMenu} aria-label="Habib’s Fuljhore home">
          <Img name="habibs-logo-red" alt="Habibs Hair & Beauty" className="brand__logo" loading="eager" />
          <span className="brand__rule" aria-hidden="true" />
          <span className="brand__place"><span>FULJHORE</span><span>DURGAPUR</span></span>
        </Link>

        <nav className="header__nav" aria-label="Main">
          {NAV.map((l) => (
            <NavLink key={l.to} to={l.to} end className={({ isActive }) => 'header__link' + (isActive ? ' is-active' : '')}>{l.label}</NavLink>
          ))}
        </nav>

        <div className="header__actions">
          <button type="button" className="header__offers" onClick={toggleOffers}>
            <Gift size={16} aria-hidden="true" />OFFERS<OfferCount className="header__count" />
          </button>
          <button type="button" className="btn btn--primary header__book" onClick={() => openBooking()}>Book Appointment</button>
          <button type="button" className="header__menu" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={toggleMenu}>
            {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  );
}

export function MobileMenu() {
  const { menuOpen, closeMenu } = useUI();
  if (!menuOpen) return null;
  return (
    <div className="mobile-menu" role="dialog" aria-label="Menu">
      {NAV.map((l) => (
        <NavLink key={l.to} to={l.to} end onClick={closeMenu} className="mobile-menu__link">
          {l.label}<span aria-hidden="true">→</span>
        </NavLink>
      ))}
      <div className="mobile-menu__meta">
        <span>{SITE.hoursLong}</span>
        <a href={SITE.tel}>{SITE.phoneDisplay}</a>
      </div>
    </div>
  );
}
