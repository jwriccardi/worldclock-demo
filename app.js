/**
 * Main application logic and UI orchestration.
 */
import { CITIES, getTimeParts, getFormatters, getTZAbbr, getHandAngles } from './clock.js';
import { store } from './store.js';

// ── Theme Management ─────────────────────────────────────────────

const THEME_KEY = 'worldclock-theme';
const root = document.documentElement;

function initTheme() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  const stored = store.get(THEME_KEY);
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  const initial = stored || (prefersLight ? 'light' : 'dark');

  function apply(theme) {
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }
    const isLight = theme === 'light';
    btn.setAttribute('aria-pressed', String(isLight));
    btn.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
  }

  apply(initial);

  btn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    apply(next);
    store.set(THEME_KEY, next);
  });
}

// ── Clock Mode Management ────────────────────────────────────────

const MODE_KEY = 'worldclock-mode';
const grid = document.getElementById('clockGrid');

function initMode() {
  const btn = document.getElementById('modeToggle');
  if (!btn || !grid) return;

  const initial = store.get(MODE_KEY, 'digital');

  function apply(mode) {
    grid.setAttribute('data-clock-mode', mode);
    const isAnalog = mode === 'analog';
    btn.setAttribute('aria-pressed', String(isAnalog));
    btn.setAttribute('aria-label', isAnalog ? 'Switch to digital clock' : 'Switch to analog clock');
  }

  apply(initial);

  btn.addEventListener('click', () => {
    const next = grid.getAttribute('data-clock-mode') === 'analog' ? 'digital' : 'analog';
    apply(next);
    store.set(MODE_KEY, next);
  });
}

// ── UI Building ──────────────────────────────────────────────────

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function elSVG(tag, attrs = {}) {
  const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [key, val] of Object.entries(attrs)) {
    node.setAttribute(key, val);
  }
  return node;
}

function buildAnalogFace() {
  const wrapper = el('div', 'analog-display');
  const svg = elSVG('svg', { viewBox: '0 0 140 140', class: 'clock-face' });
  
  // Face circle
  svg.appendChild(elSVG('circle', { cx: 70, cy: 70, r: 65, class: 'face' }));
  
  // Hands
  const hourHand   = elSVG('line', { x1: 70, y1: 70, x2: 70, y2: 40, class: 'hand hour-hand' });
  const minuteHand = elSVG('line', { x1: 70, y1: 70, x2: 70, y2: 25, class: 'hand minute-hand' });
  const secondHand = elSVG('line', { x1: 70, y1: 70, x2: 70, y2: 20, class: 'hand second-hand' });
  
  svg.appendChild(hourHand);
  svg.appendChild(minuteHand);
  svg.appendChild(secondHand);
  svg.appendChild(elSVG('circle', { cx: 70, cy: 70, r: 2.5, class: 'center-dot' }));
  
  wrapper.appendChild(svg);
  return { wrapper, hourHand, minuteHand, secondHand };
}

function buildCard(city) {
  const card = el('article', 'clock-card');
  card.setAttribute('aria-label', city.name + ' local time');

  // Header
  const header  = el('div', 'card-header');
  const meta    = el('div');
  const nameEl  = el('div', 'city-name');
  const cntryEl = el('div', 'city-country');
  const badge   = el('div', 'tz-badge');

  nameEl.textContent  = city.name;
  cntryEl.textContent = city.country;
  meta.appendChild(nameEl);
  meta.appendChild(cntryEl);
  header.appendChild(meta);
  header.appendChild(badge);
  card.appendChild(header);

  // Digital Time display
  const timeWrap = el('div', 'time-display digital-display');
  const hmRow    = el('div', 'time-hm');
  const hoursEl  = el('span');
  const sepEl    = el('span', 'time-sep');
  const minsEl   = el('span');
  sepEl.textContent = ':';
  hmRow.appendChild(hoursEl);
  hmRow.appendChild(sepEl);
  hmRow.appendChild(minsEl);
  timeWrap.appendChild(hmRow);

  const ssRow   = el('div', 'time-seconds-row');
  const ssWrap  = el('span', 'time-ss');
  const ssColon = document.createTextNode(':');
  const secsEl  = el('span');
  const ampmEl  = el('span', 'time-ampm');
  ssWrap.appendChild(ssColon);
  ssWrap.appendChild(secsEl);
  ssRow.appendChild(ssWrap);
  ssRow.appendChild(ampmEl);
  timeWrap.appendChild(ssRow);
  card.appendChild(timeWrap);

  // Analog Time display
  const { wrapper: analogWrap, hourHand, minuteHand, secondHand } = buildAnalogFace();
  card.appendChild(analogWrap);

  // Divider
  const divider = el('div', 'card-divider');
  divider.setAttribute('role', 'separator');
  card.appendChild(divider);

  // Date
  const dateWrap = el('div', 'date-display');
  const dateEl   = el('span');
  dateWrap.appendChild(dateEl);
  card.appendChild(dateWrap);

  return {
    card,
    refs: { badge, hoursEl, minsEl, secsEl, ampmEl, dateEl, hourHand, minuteHand, secondHand },
  };
}

// ── Initialization ───────────────────────────────────────────────

const cardMap = Object.create(null); // tz → refs

function init() {
  initTheme();
  initMode();
  
  if (!grid) return;
  
  CITIES.forEach(city => {
    const { card, refs } = buildCard(city);
    grid.appendChild(card);
    cardMap[city.tz] = refs;
  });

  tick();
  setInterval(tick, 1000);
}

/**
 * Main update loop.
 */
function tick() {
  const now = new Date();

  CITIES.forEach(city => {
    const refs  = cardMap[city.tz];
    if (!refs) return;

    const parts  = getTimeParts(city.tz, now);
    const fmts   = getFormatters(city.tz);
    const angles = getHandAngles(city.tz, now);

    // Update Digital
    refs.hoursEl.textContent = parts.hours;
    refs.minsEl.textContent  = parts.minutes;
    refs.secsEl.textContent  = parts.seconds;
    refs.ampmEl.textContent  = parts.ampm;
    refs.dateEl.textContent  = fmts.date.format(now);

    // Update Analog
    refs.hourHand.style.transform   = `rotate(${angles.hour}deg)`;
    refs.minuteHand.style.transform = `rotate(${angles.minute}deg)`;
    refs.secondHand.style.transform = `rotate(${angles.second}deg)`;

    const abbr = getTZAbbr(city.tz, now);
    if (refs.badge.textContent !== abbr) {
      refs.badge.textContent = abbr;
    }
  });
}

// Start the app
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
