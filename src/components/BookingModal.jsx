import { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { fmt, getCatalogue, inOffer, match, priceWith, tok, totalOf, useCatalogue } from '../lib/catalogue';
import { dateLabel, googleCalendarLink, iso, shortDate, slotDate } from '../lib/dates';
import { requestBooking } from '../lib/salonApi';
import { CAT_LABELS, SITE, SLOTS, waHello } from '../data/site';

const LABELS = ['Service', 'Date', 'Time', 'Details', 'Confirm'];
const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const MAX_DAYS = 90; // the database takes requests up to 90 days ahead

const digits = (s) => (s || '').replace(/\D/g, '');
const phoneOk = (b) => b.name.trim().length > 1 && /^(91|0)?[6-9]\d{9}$/.test(digits(b.phone));
const canContinue = (b) => [false, b.sel.length > 0, !!b.date, !!b.time, phoneOk(b), true][b.step];

export function BookingModal() {
  const { booking, closeBooking } = useUI();
  if (!booking) return null;
  return <BookingFlow key={booking.key} init={booking} onClose={closeBooking} />;
}

function BookingFlow({ init, onClose }) {
  const [b, setB] = useState(() => {
    const sel = init.ids.filter((id) => getCatalogue().byId[id]);
    return {
      step: sel.length ? 2 : 1, sel, choices: {}, q: init.q, tab: 'all', mOff: 0, date: null, time: null,
      name: '', phone: '', email: '', stylist: '', req: init.req, offer: init.offer, offerId: init.offerId,
      tried: false, done: false, sent: false, bid: '', sending: false, error: '',
    };
  });
  const set = (patch) => setB((s) => ({ ...s, ...patch }));
  const paneRef = useRef(null);
  const dialogRef = useRef(null);
  const { byId, items, canBook } = useCatalogue();

  useEffect(() => { paneRef.current && paneRef.current.scrollTo(0, 0); }, [b.step]);
  useEffect(() => { dialogRef.current && dialogRef.current.focus(); }, []);

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const lastDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + MAX_DAYS);
  const maxReach = b.sel.length ? (b.date ? (b.time ? (phoneOk(b) ? 5 : 4) : 3) : 2) : 1;

  const selIts = b.sel.map((id) => byId[id]).filter(Boolean);
  const isOffer = (it) => inOffer(b.offer, it.id);
  const isCombo = !!(b.offer && b.offer.ids);
  const firstInOffer = selIts.find(isOffer);
  const choiceText = (it) => { const c = b.choices[it.id] || {}; return [c.option, c.extra].filter(Boolean).join(' · '); };
  const priceOf = (it) => {
    if (isOffer(it) && isCombo) {
      return it === firstInOffer ? fmt(b.offer.price) + ' for the combo' + (b.offer.was ? ' (worth ' + b.offer.was + ')' : '') : 'In the combo';
    }
    if (isOffer(it)) return fmt(b.offer.price) + ' (offer, was ' + b.offer.was + ')';
    if (!choiceText(it)) return it.short;
    const x = priceWith(it, b.choices[it.id]);
    return (x.from ? 'From ' : '') + fmt(x.v) + ' (' + choiceText(it) + ')';
  };
  const nameOf = (it) => (isOffer(it) && !isCombo ? b.offer.label : it.label);
  const total = totalOf(b.sel, b.offer, b.choices);
  const svcNames = selIts.map((i) => nameOf(i) + (choiceText(i) ? ' (' + choiceText(i) + ')' : '')).join(', ');
  const needChoice = selIts.filter((i) => !isOffer(i) && ((i.lbl && i.p.length > 1) || i.extra));
  const choose = (id, patch) => set({ choices: { ...b.choices, [id]: { ...(b.choices[id] || {}), ...patch } } });
  const ok = canContinue(b);

  const toggle = (id) => set({
    sel: b.sel.includes(id) ? b.sel.filter((x) => x !== id) : [...b.sel, id],
    offer: inOffer(b.offer, id) && b.sel.includes(id) ? null : b.offer, // removing part of an offer drops the offer price
  });
  const remove = (id) => set({ sel: b.sel.filter((x) => x !== id), offer: inOffer(b.offer, id) ? null : b.offer });

  const waDone = (ref) => waHello(
    (ref ? 'I’ve requested an appointment (ref ' + ref + ').' : 'I’d like to book an appointment.') +
    '\nServices: ' + svcNames + '\nDate: ' + dateLabel(b.date) + '\nTime: ' + (b.time || '') + '\nName: ' + b.name.trim() +
    (b.req.trim() ? '\nRequest: ' + b.req.trim() : '') + '\nEstimated total: ' + total,
  );

  async function confirm() {
    // Without the database (not set up, or the menu came from an old copy) the request goes on WhatsApp
    if (!canBook || selIts.some((i) => !i.uid)) { set({ done: true, sent: false, bid: '' }); return; }
    set({ sending: true, error: '' });
    const note = [
      b.req.trim(),
      b.offer && !b.req.includes(b.offer.label) ? 'Offer: ' + b.offer.label + ' @ ' + fmt(b.offer.price) : '',
      b.stylist.trim() ? 'Preferred stylist: ' + b.stylist.trim() : '',
      b.email.trim() ? 'Email: ' + b.email.trim() : '',
    ].filter(Boolean).join('\n').slice(0, 500);
    try {
      const out = await requestBooking({
        name: b.name.trim(), phone: b.phone.trim(), date: b.date, time: b.time, note,
        items: selIts.map((i) => {
          const c = isOffer(i) ? {} : (b.choices[i.id] || {});
          return { service_id: i.uid, option: c.option || null, extra: c.extra || null };
        }),
        offerId: b.offerId,
      });
      set({ done: true, sent: true, sending: false, bid: (out && out.ref) || '' });
    } catch (e) {
      set({ sending: false, error: e.message + '. You can send your request on WhatsApp instead, or call ' + SITE.phoneDisplay + '.' });
    }
  }

  const next = () => (b.step < 5 ? set({ step: b.step + 1 }) : confirm());

  // Calendar
  const base = new Date(today.getFullYear(), today.getMonth() + b.mOff, 1);
  const lead = (base.getDay() + 6) % 7;
  const dim = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
  const lastMonth = (lastDay.getFullYear() - today.getFullYear()) * 12 + lastDay.getMonth() - today.getMonth();

  return (
    <div className="modal-wrap">
      <div className="booking" role="dialog" aria-modal="true" aria-label="Book an appointment" ref={dialogRef} tabIndex={-1}>
        <div className="booking__head">
          <div className="booking__title">Book an Appointment</div>
          <button type="button" className="square-btn" onClick={onClose} aria-label="Close"><X size={20} aria-hidden="true" /></button>
        </div>

        {!b.done ? (
          <>
            <div className="steps" role="list">
              {LABELS.map((l, k0) => {
                const k = k0 + 1;
                const cur = k === b.step;
                const done = k < b.step;
                return (
                  <button
                    type="button" role="listitem" key={l}
                    className={'step' + (cur ? ' is-current' : '') + (done ? ' is-done' : '')}
                    onClick={() => { if (k <= maxReach) set({ step: k }); }}
                    aria-current={cur ? 'step' : undefined}
                    disabled={k > maxReach}
                  >
                    <span className="step__n">{done ? '✓' : k}</span>
                    <span className="step__label">{l}</span>
                  </button>
                );
              })}
            </div>

            <div className="booking__body">
              <div className="booking__pane" ref={paneRef}>
                {b.step === 1 && (
                  <>
                    <h3 className="booking__h">Choose your services</h3>
                    <p className="booking__p">Select one or more.</p>
                    <label className="search-field search-field--sm">
                      <Search size={18} aria-hidden="true" />
                      <input value={b.q} onChange={(e) => set({ q: e.target.value })} placeholder="Search services..." aria-label="Search services" />
                    </label>
                    <BookList
                      items={items} q={b.q} sel={b.sel} onToggle={toggle} tab={b.tab}
                      onTab={(tab) => { set({ tab }); if (paneRef.current) paneRef.current.scrollTo(0, 0); }}
                      onClear={() => set({ q: '' })}
                    />
                  </>
                )}

                {b.step === 2 && (
                  <>
                    <h3 className="booking__h">Choose a date</h3>
                    <p className="booking__p">Open every day, {SITE.hoursTime}.</p>
                    <div className="cal">
                      <div className="cal__head">
                        <button type="button" className="square-btn" disabled={b.mOff <= 0} onClick={() => set({ mOff: b.mOff - 1 })} aria-label="Previous month">←</button>
                        <div className="cal__month">{base.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</div>
                        <button type="button" className="square-btn" disabled={b.mOff >= lastMonth} onClick={() => set({ mOff: b.mOff + 1 })} aria-label="Next month">→</button>
                      </div>
                      <div className="cal__dow">{WEEKDAYS.map((d) => <span key={d}>{d}</span>)}</div>
                      <div className="cal__grid">
                        {Array.from({ length: lead }, (_, i) => <span key={'x' + i} />)}
                        {Array.from({ length: dim }, (_, i) => {
                          const dd = i + 1;
                          const dt = new Date(base.getFullYear(), base.getMonth(), dd);
                          const id = iso(dt);
                          const off = dt < today || dt > lastDay;
                          const sel = b.date === id;
                          const isT = +dt === +today;
                          return (
                            <button
                              type="button" key={id} disabled={off}
                              className={'cal__day' + (sel ? ' is-selected' : '') + (isT ? ' is-today' : '')}
                              onClick={() => set({ date: id, time: null })}
                              aria-pressed={sel}
                              aria-label={dateLabel(id)}
                            >{dd}</button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}

                {b.step === 3 && (
                  <>
                    <h3 className="booking__h">Choose a time</h3>
                    <p className="booking__p">{dateLabel(b.date)}</p>
                    <div className="slots">
                      {SLOTS.map((tm) => {
                        const gone = b.date && slotDate(b.date, tm) < now;
                        return (
                          <button type="button" key={tm} disabled={gone} aria-pressed={b.time === tm}
                            className={'slot' + (b.time === tm ? ' is-selected' : '')} onClick={() => set({ time: tm })}>{tm}</button>
                        );
                      })}
                    </div>
                    <p className="booking__fine">Times shown are indicative. The salon will confirm your exact slot.</p>
                  </>
                )}

                {b.step === 4 && (
                  <>
                    <h3 className="booking__h">Your details</h3>
                    <div className="form-grid">
                      <label className="field">Name *
                        <input value={b.name} onChange={(e) => set({ name: e.target.value })} autoComplete="name"
                          className={b.tried && b.name.trim().length < 2 ? 'is-bad' : ''} />
                      </label>
                      <label className="field">Phone *
                        <input value={b.phone} onChange={(e) => set({ phone: e.target.value })} type="tel" inputMode="numeric" autoComplete="tel" placeholder="10-digit mobile"
                          className={b.tried && !phoneOk(b) ? 'is-bad' : ''} />
                      </label>
                      <label className="field">Email
                        <input value={b.email} onChange={(e) => set({ email: e.target.value })} type="email" autoComplete="email" />
                      </label>
                      <label className="field">Preferred stylist (optional)
                        <input value={b.stylist} onChange={(e) => set({ stylist: e.target.value })} />
                      </label>
                      <label className="field field--full">Special request
                        <textarea value={b.req} onChange={(e) => set({ req: e.target.value })} rows={3} maxLength={400} />
                      </label>
                    </div>
                    {b.tried && !phoneOk(b) && <p className="form-error" role="alert">Please enter your name and a valid 10-digit mobile number.</p>}
                  </>
                )}

                {b.step === 5 && (
                  <>
                    <h3 className="booking__h">Review &amp; confirm</h3>
                    {needChoice.length > 0 && (
                      <div className="choices">
                        <p className="booking__p">For a closer estimate (optional; the stylist will check at the salon):</p>
                        {needChoice.map((it) => (
                          <div className="choice" key={it.id}>
                            <span className="choice__name">{it.label}</span>
                            {it.lbl && it.p.length > 1 && (
                              <select value={(b.choices[it.id] || {}).option || ''} onChange={(e) => choose(it.id, { option: e.target.value })} aria-label={'Option for ' + it.label}>
                                <option value="">{it.sized ? 'Hair length: not sure' : 'Choose: not sure'}</option>
                                {it.lbl.map((l, k) => <option key={l} value={l}>{(it.sized ? SIZE_NAME[l] || l : l) + ' · ' + fmt(it.p[k])}</option>)}
                              </select>
                            )}
                            {it.extra && (
                              <select value={(b.choices[it.id] || {}).extra || ''} onChange={(e) => choose(it.id, { extra: e.target.value })} aria-label={it.extra.title + ' for ' + it.label}>
                                <option value="">{it.extra.title}: normal</option>
                                {it.extra.choices.map((c) => <option key={c.label} value={c.label}>{it.extra.title}: {c.label} +{fmt(c.price)}</option>)}
                              </select>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="review-list">
                      <ReviewRow k="Service" v={selIts.map((i) => nameOf(i) + '  (' + priceOf(i) + ')').join('\n')} />
                      <ReviewRow k="Date" v={dateLabel(b.date)} />
                      <ReviewRow k="Time" v={b.time || ''} />
                      <ReviewRow k="Customer" v={[b.name, b.phone, b.email].filter(Boolean).join('\n') + (b.stylist ? '\nPreferred stylist: ' + b.stylist : '') + (b.req ? '\nRequest: ' + b.req : '')} />
                      <ReviewRow k="Estimated price" v={total} />
                      <ReviewRow k="Salon" v={'Habib’s Fuljhore\n' + SITE.address} />
                    </div>
                    <p className="booking__fine booking__fine--wide">
                      This is an appointment request. The salon will confirm your slot on WhatsApp or by phone.
                      Final price may vary with hair length and add-ons.
                    </p>
                    {b.error && (
                      <p className="form-error" role="alert">{b.error} <a href={waDone('')} target="_blank" rel="noopener noreferrer">Send on WhatsApp</a></p>
                    )}
                  </>
                )}
              </div>

              <aside className="booking__summary" aria-label="Your appointment">
                <div className="label-caps">Your appointment</div>
                {selIts.length ? (
                  <div className="sum-list">
                    {selIts.map((it) => (
                      <div className="sum-row" key={it.id}>
                        <span>{nameOf(it)}<span className="sum-row__price">{priceOf(it)}</span></span>
                        <button type="button" onClick={() => remove(it.id)} aria-label={'Remove ' + nameOf(it)}>×</button>
                      </div>
                    ))}
                  </div>
                ) : <p className="sum-empty">No services selected yet.</p>}
                <div className="sum-facts">
                  <div><span>Date</span><span>{shortDate(b.date)}</span></div>
                  <div><span>Time</span><span>{b.time || '—'}</span></div>
                  <div><span>Est. duration</span><span className="muted-2">To be confirmed</span></div>
                </div>
                <div className="sum-total">
                  <span className="label-caps">Estimated total</span>
                  <span className="sum-total__v">{total}</span>
                </div>
                <div className="sum-address">{SITE.addressShort}</div>
              </aside>
            </div>

            <div className="booking__foot">
              {b.step > 1 && <button type="button" className="btn btn--line" onClick={() => set({ step: b.step - 1 })}>BACK</button>}
              <div className="booking__mtotal">
                <span>{selIts.length ? selIts.length + ' service' + (selIts.length > 1 ? 's' : '') + ' · estimated' : 'No services selected'}</span>
                <strong>{total}</strong>
              </div>
              <button
                type="button"
                className={'btn ' + (ok ? 'btn--primary' : 'btn--disabled')}
                aria-disabled={!ok || b.sending}
                onClick={() => (ok && !b.sending ? next() : set({ tried: true }))}
              >
                {b.step === 5
                  ? (b.sending ? 'SENDING…' : <><span className="lbl-long">CONFIRM APPOINTMENT</span><span className="lbl-short">CONFIRM</span></>)
                  : 'CONTINUE'}
              </button>
            </div>
          </>
        ) : b.sent ? (
          <div className="done">
            <div className="done__tick" aria-hidden="true">✓</div>
            <h3 className="done__title">Your Appointment Request Has Been Received</h3>
            {b.bid && (<><div className="done__label">Booking reference</div><div className="done__id">{b.bid}</div></>)}
            <p className="done__line">We’ll confirm your {b.time} slot on {dateLabel(b.date)} on WhatsApp or by phone on {b.phone}.</p>
            <div className="done__actions">
              <a href={waDone(b.bid)} target="_blank" rel="noopener noreferrer" className="btn btn--wa">WHATSAPP SALON</a>
              <a href={SITE.tel} className="btn btn--outline">CALL SALON</a>
              <a
                href={googleCalendarLink({ date: b.date, time: b.time, title: 'Appointment at Habib’s Fuljhore', details: 'Booking ' + b.bid + ': ' + svcNames, location: SITE.calendarLocation })}
                target="_blank" rel="noopener noreferrer" className="btn btn--outline"
              >ADD TO CALENDAR</a>
            </div>
            <button type="button" className="done__back" onClick={onClose}>Back to website</button>
          </div>
        ) : (
          <div className="done">
            <div className="done__tick" aria-hidden="true">→</div>
            <h3 className="done__title">One Last Step: Send It on WhatsApp</h3>
            <p className="done__line">Your request is typed and ready. Tap below, then press Send in WhatsApp. The salon will confirm your {b.time} slot on {dateLabel(b.date)}.</p>
            <div className="done__actions">
              <a href={waDone('')} target="_blank" rel="noopener noreferrer" className="btn btn--wa">SEND ON WHATSAPP</a>
              <a href={SITE.tel} className="btn btn--outline">CALL SALON</a>
            </div>
            <button type="button" className="done__back" onClick={onClose}>Back to website</button>
          </div>
        )}
      </div>
    </div>
  );
}

const SIZE_NAME = { S: 'S (shoulder)', M: 'M (below shoulder)', L: 'L (waist)', XL: 'XL (below waist)' };

// Booking tabs come from the categories in the billing app: the category's tab ("Facials", "Colour", …),
// or for categories without tabs (Makeup, Bridal, Groom) the category name. Shorter names for small screens.
const TAB_SHORT = { 'Cuts & Styling': 'Haircut & Styling', 'Spa & Treatments': 'Hair Spa & Treatments', 'Mani / Pedi': 'Manicure & Pedicure' };
const tabOf = (g) => g.tab || CAT_LABELS[g.cat] || g.title;

function BookList({ items, q, sel, onToggle, tab, onTab, onClear }) {
  const t = tok(q);
  const bookable = items.filter((it) => it.book);
  const tabs = [...new Set(bookable.map((it) => tabOf(it.g)))];
  const cur = tabs.includes(tab) ? tab : 'all';
  const hits = bookable.filter((it) => match(it, t));
  const list = cur === 'all' ? hits : hits.filter((it) => tabOf(it.g) === cur);
  const count = (tb) => (tb === 'all' ? hits : hits.filter((it) => tabOf(it.g) === tb)).length;
  const picked = (tb) => sel.filter((id) => bookable.some((it) => it.id === id && tabOf(it.g) === tb)).length;

  // Grouped under category headings (Men's Hair Spa, O3+ Facials, …)
  const groups = [];
  list.forEach((it) => {
    const last = groups[groups.length - 1];
    if (last && last.title === it.group) last.its.push(it);
    else groups.push({ title: it.group, its: [it] });
  });

  return (
    <>
      <div className="book-tabs" role="tablist" aria-label="Service categories">
        {['all', ...tabs].map((tb) => {
          const n = picked(tb);
          if (t.length && tb !== cur && tb !== 'all' && count(tb) === 0) return null; // while searching, only tabs with matches
          return (
            <button
              type="button" role="tab" key={tb} aria-selected={cur === tb}
              className={'chip chip--solid' + (cur === tb ? ' is-active' : '')}
              onClick={(e) => { onTab(tb); e.currentTarget.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }}
            >
              {tb === 'all' ? 'All' : TAB_SHORT[tb] || tb}
              {t.length > 0 && <span className="book-tabs__n">{count(tb)}</span>}
              {n > 0 && !t.length && <span className="book-tabs__sel" aria-label={n + ' selected'}>{n}</span>}
            </button>
          );
        })}
      </div>
      <div className="book-list" role="tabpanel">
        {groups.map((g) => (
          <div className="book-group" key={g.title}>
            <div className="book-group__title">{g.title}</div>
            {g.its.map((it) => {
              const on = sel.includes(it.id);
              return (
                <button type="button" role="checkbox" aria-checked={on} key={it.id} className={'book-item' + (on ? ' is-on' : '')} onClick={() => onToggle(it.id)}>
                  <span className="book-item__box" aria-hidden="true">{on ? '✓' : ''}</span>
                  <span className="book-item__text"><span className="book-item__name">{it.label}</span>{it.sub && <span className="book-item__group">{it.sub}</span>}</span>
                  <span className="book-item__price">{it.short}</span>
                </button>
              );
            })}
          </div>
        ))}
        {list.length === 0 && (
          <div className="booking__fine">
            {t.length ? <>No services match “{q}”{cur !== 'all' ? ' in ' + (TAB_SHORT[cur] || cur) : ''}. </> : 'Nothing here yet. '}
            {cur !== 'all' && hits.length > 0
              ? <button type="button" className="link-btn" onClick={() => onTab('all')}>Show {hits.length} match{hits.length > 1 ? 'es' : ''} in all services</button>
              : t.length > 0 && <>Try a shorter word, like “spa” or “wax”, or <button type="button" className="link-btn" onClick={onClear}>clear the search</button>.</>}
          </div>
        )}
      </div>
    </>
  );
}

function ReviewRow({ k, v }) {
  return (
    <div className="review-row"><span className="review-row__k">{k}</span><span className="review-row__v">{v}</span></div>
  );
}
