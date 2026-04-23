import './styles/tokens.css';
import { CITIES } from './cities.js';
import { buildCard } from './card.js';
import { createTick } from './tick.js';

const grid    = document.getElementById('clock-grid');
const cardMap = {};

CITIES.forEach((city, i) => {
  const { card, refs } = buildCard(city);
  card.style.animationDelay = `${i * 60}ms`;
  grid.appendChild(card);
  cardMap[city.tz] = refs;
});

const tick = createTick(cardMap);
tick();
setInterval(tick, 1000);
