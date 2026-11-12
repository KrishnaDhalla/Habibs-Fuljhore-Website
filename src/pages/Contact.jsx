import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { MapEmbed } from './Home';
import { useUI } from '../context/UIContext';
import { SITE, waGeneral } from '../data/site';

export default function Contact() {
  const { openAsk } = useUI();
  return (
    <section className="container contact">
      <div className="eyebrow">Contact</div>
      <h1 data-reveal="" className="contact__title">Visit Habib’s Fuljhore</h1>
      <div className="contact__grid">
        <div className="contact__info">
          <div>
            <div className="eyebrow eyebrow--icon"><MapPin size={15} aria-hidden="true" />Address</div>
            <p className="contact__big">{SITE.address}</p>
          </div>
          <div className="contact__pair">
            <div>
              <div className="eyebrow eyebrow--icon"><Phone size={15} aria-hidden="true" />Call Us</div>
              <a href={SITE.tel} className="contact__big contact__strong">{SITE.phoneDisplay}</a>
            </div>
            <div>
              <div className="eyebrow eyebrow--icon"><Mail size={15} aria-hidden="true" />Email</div>
              <a href={'mailto:' + SITE.email} className="contact__email">{SITE.email}</a>
            </div>
          </div>
          <div>
            <div className="eyebrow eyebrow--icon"><Clock size={15} aria-hidden="true" />Opening Hours</div>
            <p className="contact__big">{SITE.hoursDays}<br />{SITE.hoursTime}</p>
          </div>
          <div className="btn-row btn-row--tight">
            <a href={SITE.directions} target="_blank" rel="noopener noreferrer" className="btn btn--primary btn--54">Get Directions</a>
            <a href={SITE.tel} className="btn btn--outline btn--54">Call Now</a>
            <a href={waGeneral()} target="_blank" rel="noopener noreferrer" className="btn btn--outline btn--54">WhatsApp Us</a>
            <button type="button" className="btn btn--outline btn--54" onClick={() => openAsk()}>Ask a Question</button>
          </div>
        </div>
        <MapEmbed tall />
      </div>
    </section>
  );
}
