import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { BrandIcon } from './BrandIcon';
import { useUI } from '../context/UIContext';
import { useCatalogue } from '../lib/catalogue';
import { apiReady, askUs } from '../lib/salonApi';
import { SITE, waHello } from '../data/site';

const digits = (s) => (s || '').replace(/\D/g, '');
const phoneOk = (p) => /^(91|0)?[6-9]\d{9}$/.test(digits(p));

// "Ask us" form. One tap does two things:
//   1. opens WhatsApp to the salon with the question already typed (the customer presses Send there)
//   2. records the question in the billing app (Bookings → Enquiries) and tells the owners on Telegram,
//      so it's followed up even if the WhatsApp message is never sent
export function AskModal() {
  const { ask, closeAsk } = useUI();
  if (!ask) return null;
  return <AskForm key={ask.key} init={ask} onClose={closeAsk} />;
}

function AskForm({ init, onClose }) {
  const { byId } = useCatalogue();
  const [ids, setIds] = useState(init.ids.filter((id) => byId[id]));
  const [f, setF] = useState({ name: '', phone: '', message: init.message });
  const [tried, setTried] = useState(false);
  const [done, setDone] = useState(null); // { wa, ref }
  const dialogRef = useRef(null);
  useEffect(() => { dialogRef.current && dialogRef.current.focus(); }, []);

  const set = (patch) => setF((s) => ({ ...s, ...patch }));
  const svcs = ids.map((id) => byId[id]).filter(Boolean);
  const msg = f.message.trim();
  const nameOk = f.name.trim().length > 1;
  const ok = nameOk && phoneOk(f.phone) && (msg.length > 1 || svcs.length > 0);

  const waText = () => {
    const lines = ['I’m ' + f.name.trim() + '.'];
    if (svcs.length) lines.push('About: ' + svcs.map((s) => s.label + ' (' + s.short + ')').join(', '));
    if (msg) lines.push(msg);
    else lines.push('Please share availability and details.');
    return lines.join('\n');
  };

  function send() {
    if (!ok) { setTried(true); return; }
    const link = waHello(waText());
    // Open WhatsApp straight from the tap, so browsers don't block it
    window.open(link, '_blank', 'noopener');
    setDone({ wa: link, ref: '' });
    if (apiReady) {
      askUs({
        name: f.name.trim(), phone: f.phone.trim(),
        message: msg || (svcs.length ? 'Asked about ' + svcs.map((s) => s.label).join(', ') : ''),
        serviceIds: svcs.map((s) => s.uid).filter(Boolean),
      })
        .then((out) => setDone((d) => d && { ...d, ref: (out && out.ref) || '' }))
        .catch(() => { /* WhatsApp is the main channel; the record is a bonus */ });
    }
  }

  return (
    <div className="modal-wrap" onClick={onClose}>
      <div className="ask" role="dialog" aria-modal="true" aria-labelledby="ask-title" ref={dialogRef} tabIndex={-1} onClick={(e) => e.stopPropagation()}>
        <div className="booking__head">
          <div className="booking__title" id="ask-title">Ask Us</div>
          <button type="button" className="square-btn" onClick={onClose} aria-label="Close"><X size={20} aria-hidden="true" /></button>
        </div>

        {!done ? (
          <div className="ask__body">
            <p className="booking__p">Questions about a service, price or your date? We reply on WhatsApp.</p>
            {svcs.length > 0 && (
              <div className="ask__svcs">
                {svcs.map((s) => (
                  <span className="ask__svc" key={s.id}>
                    <span>{s.label}<span className="ask__svc-price">{s.short}</span></span>
                    <button type="button" onClick={() => setIds(ids.filter((x) => x !== s.id))} aria-label={'Remove ' + s.label}>×</button>
                  </span>
                ))}
              </div>
            )}
            <div className="form-grid">
              <label className="field">Name *
                <input value={f.name} onChange={(e) => set({ name: e.target.value })} autoComplete="name"
                  className={tried && !nameOk ? 'is-bad' : ''} />
              </label>
              <label className="field">Mobile *
                <input value={f.phone} onChange={(e) => set({ phone: e.target.value })} type="tel" inputMode="numeric" autoComplete="tel" placeholder="10-digit mobile"
                  className={tried && !phoneOk(f.phone) ? 'is-bad' : ''} />
              </label>
              <label className="field field--full">Your question{svcs.length ? '' : ' *'}
                <textarea value={f.message} onChange={(e) => set({ message: e.target.value })} rows={4} maxLength={1000}
                  placeholder="e.g. How long does keratin take? Is Sunday 4 pm free?"
                  className={tried && !svcs.length && msg.length < 2 ? 'is-bad' : ''} />
              </label>
            </div>
            {tried && !ok && (
              <p className="form-error" role="alert">
                {!nameOk ? 'Please enter your name. ' : ''}
                {!phoneOk(f.phone) ? 'Please enter a 10-digit mobile number. ' : ''}
                {!svcs.length && msg.length < 2 ? 'Please write your question.' : ''}
              </p>
            )}
            <div className="ask__foot">
              <button type="button" className={'btn btn--wa' + (ok ? '' : ' is-dim')} onClick={send}>
                <BrandIcon name="whatsapp" size={18} color="#fff" />SEND ON WHATSAPP
              </button>
              <a href={SITE.tel} className="btn btn--outline">CALL INSTEAD</a>
            </div>
          </div>
        ) : (
          <div className="done done--ask">
            <div className="done__tick" aria-hidden="true">✓</div>
            <h3 className="done__title">Press Send in WhatsApp</h3>
            <p className="done__line">
              Your message is typed and ready in WhatsApp. If it didn’t open, use the button below.
              {done.ref ? ' We’ve also noted your question, so the salon will get back to you on ' + f.phone.trim() + '.' : ''}
            </p>
            {done.ref && (<><div className="done__label">Reference</div><div className="done__id">{done.ref}</div></>)}
            <div className="done__actions">
              <a href={done.wa} target="_blank" rel="noopener noreferrer" className="btn btn--wa">OPEN WHATSAPP</a>
              <a href={SITE.tel} className="btn btn--outline">CALL SALON</a>
            </div>
            <button type="button" className="done__back" onClick={onClose}>Back to website</button>
          </div>
        )}
      </div>
    </div>
  );
}
