/**
 * Core clock logic and city definitions.
 */

export const CITIES = [
  { name: 'New York',    country: 'United States',  tz: 'America/New_York'    },
  { name: 'London',      country: 'United Kingdom', tz: 'Europe/London'       },
  { name: 'Dubai',       country: 'UAE',            tz: 'Asia/Dubai'          },
  { name: 'Mumbai',      country: 'India',          tz: 'Asia/Kolkata'        },
  { name: 'Tokyo',       country: 'Japan',          tz: 'Asia/Tokyo'          },
  { name: 'Los Angeles', country: 'United States',  tz: 'America/Los_Angeles' },
];

const fmtCache = Object.create(null);

/**
 * Get cached Intl formatters for a timezone.
 * @param {string} tz 
 * @returns {object}
 */
export function getFormatters(tz) {
  if (fmtCache[tz]) return fmtCache[tz];
  fmtCache[tz] = {
    hm: new Intl.DateTimeFormat('en-US', {
      timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: true,
    }),
    ss: new Intl.DateTimeFormat('en-US', {
      timeZone: tz, second: '2-digit',
    }),
    date: new Intl.DateTimeFormat('en-US', {
      timeZone: tz, weekday: 'short', month: 'short',
      day: 'numeric', year: 'numeric',
    }),
    tzName: new Intl.DateTimeFormat('en-US', {
      timeZone: tz, timeZoneName: 'short',
    }),
  };
  return fmtCache[tz];
}

/**
 * Get time parts for a timezone and date.
 * @param {string} tz 
 * @param {Date} date 
 * @returns {object}
 */
export function getTimeParts(tz, date) {
  const { hm, ss } = getFormatters(tz);
  const hmParts = hm.formatToParts(date);
  const ssParts = ss.formatToParts(date);
  const val = (parts, type) => {
    const p = parts.find(x => x.type === type);
    return p ? p.value : '';
  };
  return {
    hours:   val(hmParts, 'hour'),
    minutes: val(hmParts, 'minute'),
    seconds: val(ssParts, 'second').padStart(2, '0'),
    ampm:    val(hmParts, 'dayPeriod'),
  };
}

/**
 * Get continuous hand angles for analog display.
 * @param {string} tz 
 * @param {Date} date 
 * @returns {object} { hour, minute, second } in degrees
 */
export function getHandAngles(tz, date) {
  // Use Intl to get the local time components accurately for the timezone
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  });
  
  const parts = fmt.formatToParts(date);
  const get = (type) => parseInt(parts.find(p => p.type === type).value, 10);
  
  const h = get('hour') % 12;
  const m = get('minute');
  const s = get('second');
  
  // Continuous movement:
  // Seconds: 6 degrees per second
  const secondAngle = s * 6;
  
  // Minutes: 6 degrees per minute + (seconds / 60 * 6)
  const minuteAngle = (m * 6) + (s * 0.1);
  
  // Hours: 30 degrees per hour + (minutes / 60 * 30) + (seconds / 3600 * 30)
  const hourAngle = (h * 30) + (m * 0.5) + (s * (0.5 / 60));
  
  return {
    hour: hourAngle,
    minute: minuteAngle,
    second: secondAngle
  };
}

/**
 * Get timezone abbreviation for a timezone and date.
 * @param {string} tz 
 * @param {Date} date 
 * @returns {string}
 */
export function getTZAbbr(tz, date) {
  const parts = getFormatters(tz).tzName.formatToParts(date);
  const p = parts.find(x => x.type === 'timeZoneName');
  return p ? p.value : '';
}
