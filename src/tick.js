import { getFormatters, getTimeParts, getTZAbbr } from './formatters.js';

export function createTick(cardMap) {
  return function tick() {
    const now = new Date();

    Object.entries(cardMap).forEach(([tz, refs]) => {
      const parts = getTimeParts(tz, now);
      const fmts  = getFormatters(tz);

      refs.hoursEl.textContent = parts.hours;
      refs.minsEl.textContent  = parts.minutes;
      refs.secsEl.textContent  = parts.seconds;
      refs.ampmEl.textContent  = parts.ampm;
      refs.dateEl.textContent  = fmts.date.format(now);

      const abbr = getTZAbbr(tz, now);
      if (refs.badge.textContent !== abbr) {
        refs.badge.textContent = abbr;
      }
    });
  };
}
