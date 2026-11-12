import { Link } from 'react-router-dom';
import { BrandIcon } from './BrandIcon';
import { Img } from './Img';
import { NAV, SITE, waGeneral } from '../data/site';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer__inner">
        <div className="footer__grid">
          <div>
            <Img name="habibs-logo-white" alt="Habibs Hair & Beauty" className="footer__logo" />
            <div className="footer__place">FULJHORE</div>
            <p className="footer__text">Hair • Beauty • Makeup<br />Fuljhore, Durgapur, West Bengal</p>
          </div>
          <div>
            <div className="footer__head">Quick Links</div>
            <div className="footer__list">
              {NAV.map((l) => <Link key={l.to} to={l.to}>{l.label}</Link>)}
              <Link to="/services">All Services &amp; Prices</Link>
            </div>
          </div>
          <div>
            <div className="footer__head">Contact</div>
            <div className="footer__list">
              <a href={SITE.tel} className="footer__phone">{SITE.phoneDisplay}</a>
              <a href={'mailto:' + SITE.email} className="footer__email">{SITE.email}</a>
            </div>
            <div className="footer__head footer__head--spaced">Opening Hours</div>
            <p className="footer__text footer__text--tight">{SITE.hoursDays}<br />{SITE.hoursTime}</p>
          </div>
          <div>
            <div className="footer__head">Visit Us</div>
            <p className="footer__text footer__address">{SITE.address}</p>
            <div className="footer__social">
              <a href={SITE.instagram} target="_blank" rel="noopener noreferrer"><BrandIcon name="instagram" size={15} />INSTAGRAM</a>
              <a href={SITE.facebook} target="_blank" rel="noopener noreferrer"><BrandIcon name="facebook" size={15} />FACEBOOK</a>
              <a href={waGeneral()} target="_blank" rel="noopener noreferrer"><BrandIcon name="whatsapp" size={15} />WHATSAPP</a>
              <a href={SITE.googleReviews} target="_blank" rel="noopener noreferrer"><BrandIcon name="google" size={14} />GOOGLE</a>
            </div>
          </div>
        </div>
        <div className="footer__bottom">
          <span suppressHydrationWarning>© {new Date().getFullYear()} Habib’s Fuljhore Hair &amp; Beauty</span>
          <span>Premium Hair &amp; Beauty Salon in Durgapur</span>
        </div>
      </div>
    </footer>
  );
}
