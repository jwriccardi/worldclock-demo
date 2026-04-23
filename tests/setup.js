// Vitest setup: provide a working localStorage mock.
// The test environment receives a broken localStorage stub (missing getItem/setItem)
// due to a --localstorage-file flag with no valid path. Replace it entirely.

const storage = {};

const localStorageMock = {
  getItem: (key) => Object.prototype.hasOwnProperty.call(storage, key) ? storage[key] : null,
  setItem: (key, value) => { storage[key] = String(value); },
  removeItem: (key) => { delete storage[key]; },
  clear: () => { Object.keys(storage).forEach(k => delete storage[k]); },
  get length() { return Object.keys(storage).length; },
  key: (i) => Object.keys(storage)[i] ?? null,
};

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
});
