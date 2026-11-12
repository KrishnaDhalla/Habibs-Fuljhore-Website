import { CalendarDays, Check } from 'lucide-react';
import { BrandIcon } from '../components/BrandIcon';
import { Img } from '../components/Img';
import { useUI } from '../context/UIContext';
import { plusPrice, priceRef, useCatalogue } from '../lib/catalogue';
import { SIZE_CHART, waBridal } from '../data/site';

const LETTERS = 'ABCDEFGH';
const card = (it, k) => ({
  id: it.id, letter: LETTERS[k], n: it.n.replace(/ \((Groom|Bride)\)$/, '').replace(/^[A-H]\. /, ''), price: plusPrice(it),
  sub: it.sub, desc: it.desc, inc: it.inc.length ? it.inc : [], book: it.book,
});

// Built from the billing app's Bridal, Groom and Makeup categories (cat = bridal / groom / makeup)
export default function Bridal() {
  const { openBooking, openAsk } = useUI();
  const { groups } = useCatalogue();
  const its = (cat) => groups.filter((g) => g.cat === cat).flatMap((g) => g.its);

  const bride = its('bridal');
  const total = bride.find((i) => /\bA\s*\+\s*B\b/i.test(i.n)) || null;
  const pkgs = bride.filter((i) => i !== total && /pre.?bridal|wedding day/i.test(i.n)).slice(0, 2);
  const brideCards = pkgs.map(card);
  const brideExtras = bride.filter((i) => i !== total && !pkgs.includes(i)).map((it) => card(it, 0));
  const groomCards = its('groom').map(card);
  const styleCards = its('makeup').filter((i) => !/bridal|reception/i.test(i.n))
    .map((it) => ({ id: it.id, n: it.n, group: it.group, sub: it.sub, price: plusPrice(it), book: it.book }));
  const heroPrices = [['Bridal Makeup Service', priceRef('makeup', 'bridal makeup')], ['Reception Makeup Service', priceRef('makeup', 'reception')]]
    .filter((x) => x[1]);
  const startFrom = (r) => (r.it.from ? 'Starting from ' + r.text.replace(/^From /, '') : r.text);

  return (
    <>
      <section className="bridal-hero">
        <div className="container bridal-hero__inner">
          <div>
            <div className="eyebrow eyebrow--onred">Makeup &amp; Bridal</div>
            <h1 data-reveal="" className="bridal-hero__title">Your Special Moments, <span className="tint">Beautifully Yours.</span></h1>
            <div className="bridal-hero__prices">
              {heroPrices.map(([l, r]) => (
                <div data-reveal="" className="price-box" key={l}>
                  <div className="price-box__k">{l}</div>
                  <div className="price-box__v">{startFrom(r)}</div>
                </div>
              ))}
            </div>
            <div className="btn-row mt-28">
              <button type="button" className="btn btn--light btn--lg" onClick={() => openBooking({ q: 'bridal' })}>Book a Bridal Consultation</button>
              <a href={waBridal()} target="_blank" rel="noopener noreferrer" className="btn btn--ghost btn--lg">WhatsApp Our Team</a>
            </div>
          </div>
          <Img data-reveal="img" name="bride" alt="Bridal makeup at Habibs" priority className="bridal-hero__img" sizes="(max-width: 899px) 100vw, 560px" />
        </div>
      </section>

      <section className="container pkg-section">
        <div className="pkg-layout pkg-layout--bride">
          <div className="pkg-cards">
            {total && (
            <article data-reveal="" className="pkg-total">
              <div>
                <div className="pkg-total__k">COMPLETE BRIDE PACKAGE · A + B</div>
                <div className="pkg-total__v">{plusPrice(total)}</div>
                {pkgs.length > 0 && <div className="pkg-total__sub">{brideCards.map((c) => c.n).join(' + ')}</div>}
              </div>
              <div className="btn-row">
                <button type="button" className="btn btn--cream btn--48" onClick={() => openBooking({ ids: [total.id] })}>BOOK CONSULTATION <span aria-hidden="true">→</span></button>
                <button type="button" onClick={() => openAsk({ ids: [total.id] })} className="btn btn--ghost btn--48"><BrandIcon name="whatsapp" size={15} />ASK</button>
              </div>
            </article>
            )}
            {brideCards.map((c) => <PackageCard key={c.id} c={c} />)}
            {brideExtras.length > 0 && <div className="pkg-extras-label">ADD FOR FAMILY &amp; RECEPTION</div>}
            <div className="pkg-extras">
              {brideExtras.map((e) => (
                <article data-reveal="" className="extra-card" key={e.id}>
                  <div className="extra-card__head"><h3>{e.n}</h3><span>{e.price}</span></div>
                  {(e.sub || e.desc) && <p>{e.sub || e.desc}</p>}
                  <button type="button" className="btn btn--outline-red btn--40" onClick={() => openBooking({ ids: [e.id] })}>BOOK</button>
                </article>
              ))}
            </div>
          </div>
          <div className="pkg-intro">
            <div className="eyebrow eyebrow--xwide">For the bride</div>
            <h2 data-reveal="" className="t-xl mt-14">Bridal Packages</h2>
            <p className="pkg-intro__p">Pre-bridal care five days before the wedding, then makeup, hair styling and saree draping on the day.</p>
            <Img data-reveal="img" name="cat-bridal" alt="Bride" className="pkg-intro__img" sizes="(max-width: 899px) 100vw, 520px" style={{ objectPosition: '60% 30%' }} />
          </div>
        </div>
      </section>

      <section className="container pkg-section">
        <div className="pkg-layout pkg-layout--groom">
          <div className="pkg-intro">
            <div className="eyebrow eyebrow--xwide">For the groom</div>
            <h2 data-reveal="" className="t-xl mt-14">Groom Packages</h2>
            <p className="pkg-intro__p">Grooming for the days before the wedding and makeup for the day itself.</p>
            <Img data-reveal="img" name="groom" alt="Groom" className="pkg-intro__img" sizes="(max-width: 899px) 100vw, 520px" style={{ objectPosition: '62% 35%' }} />
          </div>
          <div className="pkg-cards">
            {groomCards.map((c) => <PackageCard key={c.id} c={c} />)}
          </div>
        </div>
      </section>

      <section className="container occasion">
        <div className="eyebrow">Occasion &amp; party</div>
        <h2 data-reveal="" className="t-xl mt-12">Makeup, Hairstyle &amp; Saree Draping</h2>
        <div className="occasion__grid">
          {styleCards.map((s) => (
            <div data-reveal="" className="style-card" key={s.id}>
              <div className="style-card__group">{s.group}</div>
              <h3 className="style-card__name">{s.n}</h3>
              <div className="style-card__sub">{s.sub || '\u00A0'}</div>
              <div className="style-card__foot">
                <span className="style-card__price">{s.price}</span>
                <button type="button" className="btn btn--outline btn--44" onClick={() => openBooking({ ids: [s.id] })}>BOOK</button>
              </div>
            </div>
          ))}
        </div>
        <div className="size-chart">
          <strong>Size chart</strong>
          {SIZE_CHART.map(([k, v]) => <span key={k}>{k} – {v}</span>)}
        </div>
      </section>
    </>
  );
}

function PackageCard({ c }) {
  const { openBooking, openAsk } = useUI();
  return (
    <article data-reveal="" className="pkg-card">
      <span className="pkg-card__letter" aria-hidden="true">{c.letter}</span>
      <div className="pkg-card__main">
        <div className="pkg-card__head">
          <h3>{c.n}</h3>
          <span className="pkg-card__price">{c.price}</span>
        </div>
        {c.sub && <div className="pkg-card__when"><CalendarDays size={14} aria-hidden="true" />{c.sub}</div>}
        {c.inc.length > 0 && (
          <ul className="pkg-card__inc">
            {c.inc.map((x) => <li key={x}><Check size={15} aria-hidden="true" />{x}</li>)}
          </ul>
        )}
        {!c.inc.length && c.desc && <p className="pkg-card__desc">{c.desc}</p>}
        <div className="btn-row mt-22">
          <button type="button" className="btn btn--primary btn--46" onClick={() => openBooking({ ids: [c.id] })}>BOOK PACKAGE <span aria-hidden="true">→</span></button>
          <button type="button" onClick={() => openAsk({ ids: [c.id] })} className="btn btn--soft btn--46"><BrandIcon name="whatsapp" size={15} color="#25D366" />ASK</button>
        </div>
      </div>
    </article>
  );
}
