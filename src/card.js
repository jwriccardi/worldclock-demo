import { el } from './dom.js';

export function buildCard(city) {
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

  // Time display
  const timeWrap = el('div', 'time-display');
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
    refs: { badge, hoursEl, minsEl, secsEl, ampmEl, dateEl },
  };
}
