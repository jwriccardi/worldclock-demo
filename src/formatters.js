const fmtCache = {};

export function getFormatters(tz) {
  if (!fmtCache[tz]) {
    fmtCache[tz] = {
      hm:     new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric',   minute: '2-digit', hour12: true }),
      ss:     new Intl.DateTimeFormat('en-US', { timeZone: tz, second: '2-digit' }),
      date:   new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'long', month: 'long', day: 'numeric' }),
      tzName: new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'short' }),
    };
  }
  return fmtCache[tz];
}

export function getTimeParts(tz, date) {
  const fmts = getFormatters(tz);
  const hm   = fmts.hm.format(date);
  const ss   = fmts.ss.format(date);
  const [timePart, ampm] = hm.split(' ');
  const [hours, minutes] = timePart.split(':');
  return { hours, minutes, seconds: ss, ampm: ampm || '' };
}

export function getTZAbbr(tz, date) {
  const fmts  = getFormatters(tz);
  const parts = fmts.tzName.formatToParts(date);
  const found = parts.find(p => p.type === 'timeZoneName');
  return found ? found.value : tz;
}
