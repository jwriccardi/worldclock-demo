// localStorage state utility
// Key namespace: wc.settings.*

const PREFIX = 'wc.settings.';
const listeners = {};

function fullKey(key) {
  return PREFIX + key;
}

export function get(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(fullKey(key));
    if (raw === null) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

export function set(key, value) {
  try {
    localStorage.setItem(fullKey(key), JSON.stringify(value));
    const fk = fullKey(key);
    if (listeners[fk]) {
      listeners[fk].forEach(fn => fn(value));
    }
  } catch {
    // localStorage unavailable (private browsing, etc.)
  }
}

export function remove(key) {
  try {
    localStorage.removeItem(fullKey(key));
  } catch {
    // ignore
  }
}

export function subscribe(key, fn) {
  const fk = fullKey(key);
  if (!listeners[fk]) listeners[fk] = [];
  listeners[fk].push(fn);
  // Return unsubscribe function
  return () => {
    listeners[fk] = listeners[fk].filter(f => f !== fn);
  };
}

// For testing only
export function _resetForTesting() {
  Object.keys(listeners).forEach(key => {
    listeners[key] = [];
  });
}
