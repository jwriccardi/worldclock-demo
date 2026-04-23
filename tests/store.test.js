/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { store } from '../store.js';

// Manual mock for localStorage if it's broken in the environment
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('store', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  it('should set and get values', () => {
    store.set('testKey', { a: 1 });
    expect(store.get('testKey')).toEqual({ a: 1 });
  });

  it('should return default value if key does not exist', () => {
    expect(store.get('nonExistent', 'default')).toBe('default');
  });

  it('should remove values', () => {
    store.set('testKey', 'value');
    store.remove('testKey');
    expect(store.get('testKey')).toBeNull();
  });

  it('should handle malformed JSON gracefully', () => {
    window.localStorage.setItem('badKey', 'invalid-json');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(store.get('badKey', 'default')).toBe('default');
    expect(consoleSpy).toHaveBeenCalled();
  });
});
