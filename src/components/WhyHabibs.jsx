import { Award, HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react';
import { WHY } from '../data/site';

const ICONS = { award: Award, sparkles: Sparkles, shield: ShieldCheck, heart: HeartHandshake };

export function WhyHabibs({ className = '' }) {
  return (
    <section className={'container why ' + className}>
      <h2 data-reveal="" className="why__title">Why Habib’s?</h2>
      <div className="why__grid">
        {WHY.map(([label, icon]) => {
          const Icon = ICONS[icon];
          return (
            <div data-reveal="" className="why__item" key={label}>
              <span className="why__icon"><Icon size={22} aria-hidden="true" /></span>
              <span className="why__label">{label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
