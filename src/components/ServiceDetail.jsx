import { Clock, X } from 'lucide-react';
import { Img } from './Img';
import { useUI } from '../context/UIContext';
import { useCatalogue } from '../lib/catalogue';
import { DETAIL_IMAGE } from '../data/images';

export function ServiceDetail() {
  const { detailId, closeDetail, openBooking, openAsk } = useUI();
  const { byId } = useCatalogue();
  const d = detailId && byId[detailId];
  if (!d) return null;

  const notes = [];
  if (d.g.note) notes.push(d.g.note);
  if (d.hint) notes.push(d.hint + '.');
  if (d.from && d.p.length === 1) notes.push('Starting price. Final price is confirmed at the salon.');

  return (
    <div className="drawer-wrap" onClick={closeDetail}>
      <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="detail-title" onClick={(e) => e.stopPropagation()}>
        <div className="drawer__media">
          <Img name={DETAIL_IMAGE[d.g.cat] || 'cat-hair'} alt="" sizes="(max-width: 560px) 100vw, 520px" />
          <button type="button" className="drawer__close" onClick={closeDetail} aria-label="Close"><X size={20} aria-hidden="true" /></button>
        </div>
        <div className="drawer__body">
          <div>
            <div className="eyebrow eyebrow--sm">{d.group}</div>
            <h2 id="detail-title" className="drawer__title">{d.label}</h2>
            {d.sub && <p className="drawer__sub">{d.sub}</p>}
            {(d.desc || d.g.desc) && <p className="drawer__desc">{d.desc || d.g.desc}</p>}
          </div>

          <div className="drawer__facts">
            <div className="fact">
              <span className="fact__k">Price</span>
              <span className="fact__v"><strong>{d.short}</strong>{d.full && <span className="fact__small">{d.full}</span>}</span>
            </div>
            <div className="fact">
              <span className="fact__k"><Clock size={15} aria-hidden="true" />Duration</span>
              {d.dur
                ? <span className="fact__v">About {d.dur} min</span>
                : <span className="fact__v fact__v--muted">To be confirmed</span>}
            </div>
            {d.sized && (
              <div className="fact">
                <span className="fact__k">Hair length</span>
                <span className="fact__v fact__v--sm">S – Shoulder · M – Below Shoulder<br />L – Waist · XL – Below Waist</span>
              </div>
            )}
          </div>

          {d.inc.length > 0 && (
            <div>
              <div className="label-caps">Includes</div>
              <ul className="drawer__inc">{d.inc.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
          )}

          {notes.length > 0 && (
            <div className="drawer__notes">
              <strong className="label-caps">Important notes</strong>
              {notes.map((nt) => <span key={nt}>{nt}</span>)}
            </div>
          )}

          <div className="drawer__actions">
            {d.book && <button type="button" className="btn btn--primary btn--lg" onClick={() => openBooking({ ids: [d.id] })}>BOOK THIS SERVICE</button>}
            <button type="button" className={'btn btn--lg ' + (d.book ? 'btn--outline' : 'btn--primary')} onClick={() => openAsk({ ids: [d.id] })}>ASK ON WHATSAPP</button>
          </div>
        </div>
      </aside>
    </div>
  );
}
