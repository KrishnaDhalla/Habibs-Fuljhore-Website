export const iso = (d) =>
  d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

export const dateObj = (s) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const dateLabel = (s) =>
  s ? dateObj(s).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '';

export const shortDate = (s) =>
  s ? dateObj(s).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }) : '—';

export function slotDate(s, t) {
  const d = dateObj(s);
  const [hm, ap] = t.split(' ');
  let [h, m] = hm.split(':').map(Number);
  if (ap === 'PM' && h !== 12) h += 12;
  d.setHours(h, m, 0, 0);
  return d;
}

const stamp = (d) =>
  iso(d).replace(/-/g, '') + 'T' + String(d.getHours()).padStart(2, '0') + String(d.getMinutes()).padStart(2, '0') + '00';

export function googleCalendarLink({ date, time, title, details, location }) {
  if (!date || !time) return '#';
  const st = slotDate(date, time);
  const en = new Date(+st + 3600000);
  return (
    'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(title) +
    '&dates=' + stamp(st) + '/' + stamp(en) + '&ctz=Asia/Kolkata&details=' + encodeURIComponent(details) +
    '&location=' + encodeURIComponent(location)
  );
}
