import { Link } from 'react-router-dom';
import { Img } from '../components/Img';
import { WhyHabibs } from '../components/WhyHabibs';
import { useUI } from '../context/UIContext';
import { useCatalogue } from '../lib/catalogue';
import { STORY } from '../data/site';

export default function About() {
  const { openBooking } = useUI();
  const pricedCount = useCatalogue().items.filter((i) => i.p.length).length;
  const stats = [['Founded', '1968'], ['Salons', '150+'], ['Generations', '3'], ['Services here', String(pricedCount)]];
  return (
    <>
      <section className="container about-intro">
        <div className="min-w-0">
          <div className="eyebrow eyebrow--xwide">Oldest Family Salon Chain</div>
          <h1 data-reveal="" className="about-intro__title">About<br />Habib’s Fuljhore</h1>
          <span className="rule-56" aria-hidden="true" />
          <p data-reveal="" className="about-intro__p">Habib’s Fuljhore is a Habibs Hair &amp; Beauty salon in Fuljhore, Durgapur. We offer haircuts, colour and hair treatments, skin and beauty services, manicures and pedicures, and complete makeup and bridal packages for brides and grooms.</p>
          <p data-reveal="" className="about-intro__p2">We are open every day from 10:30 AM to 9:00 PM on the first floor, above Rangoli Bistro at B1 More, Fuljhore.</p>
          <div data-reveal="" className="hero__ctas mt-34">
            <button type="button" className="btn btn--primary" onClick={() => openBooking()}>Book an Appointment →</button>
            <Link to="/contact" className="link-cta">Visit Us</Link>
          </div>
        </div>
        <div className="about-intro__pics">
          <div data-reveal="" className="about-intro__pic about-intro__pic--tall"><Img name="page-hair" alt="Hair styling at Habib’s Fuljhore" sizes="(max-width: 899px) 55vw, 360px" /></div>
          <div data-reveal="" className="about-intro__pic about-intro__pic--short"><Img name="page-beauty" alt="Habibs skin care products" sizes="(max-width: 899px) 45vw, 300px" /></div>
        </div>
      </section>

      <section className="story">
        <div className="container story__inner">
          <div className="story__head">
            <div className="story__title-wrap">
              <h2 data-reveal="" className="story__title">The Story<br />of Habibs</h2>
              <span className="story__badge"><span>SINCE</span><strong>1968</strong></span>
            </div>
            <p data-reveal="" className="story__lead">From one hairdresser at a Delhi hotel to three generations and more than 150 salons — the story behind the name above our door.</p>
          </div>
          <div className="story__track">
            {STORY.map((st, i) => {
              const last = i === STORY.length - 1;
              return (
                <article data-reveal="" className="story__item" key={st.year + i}>
                  <div className="story__pic"><Img name={st.img} alt={st.year} style={{ objectPosition: st.pos, filter: last ? 'none' : 'grayscale(1) contrast(1.05)' }} /></div>
                  <div className={'story__year' + (last ? ' is-now' : '')}>{st.year}</div>
                  <p className="story__text">{st.text}</p>
                </article>
              );
            })}
          </div>
          <div className="story__stats">
            {stats.map(([k, v]) => (
              <div data-reveal="" key={k}>
                <div className="story__stat-k">{k}</div>
                <div className="story__stat-v">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WhyHabibs className="why--about" />
    </>
  );
}
