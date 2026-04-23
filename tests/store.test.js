import { describe, it, expect, beforeEach } from 'vitest';
import { get, set, remove, subscribe, _resetForTesting } from '../src/store.js';

describe('store', () => {
  beforeEach(() => {
    // Some jsdom versions don't expose .clear(); iterate instead
    Object.keys(localStorage).forEach(k => localStorage.removeItem(k));
    // Reset module-level listeners between tests
    _resetForTesting();
  });

  it('returns defaultValue when key is absent', () => {
    expect(get('missing', 'fallback')).toBe('fallback');
  });

  it('returns null by default when key is absent and no default given', () => {
    expect(get('missing')).toBeNull();
  });

  it('persists a string value and retrieves it', () => {
    set('theme', 'daylight');
    expect(get('theme')).toBe('daylight');
  });

  it('persists an object value and retrieves it', () => {
    const obj = { running: true, startTime: 1234567890 };
    set('stopwatch', obj);
    expect(get('stopwatch')).toEqual(obj);
  });

  it('removes a key', () => {
    set('clockMode', 'analog');
    remove('clockMode');
    expect(get('clockMode')).toBeNull();
  });

  it('uses the wc.settings.* namespace in localStorage', () => {
    set('theme', 'midnight');
    expect(localStorage.getItem('wc.settings.theme')).toBe('"midnight"');
  });

  it('notifies subscribers when a value is set', () => {
    const fn = vi.fn();
    subscribe('theme', fn);
    set('theme', 'sepia');
    expect(fn).toHaveBeenCalledWith('sepia');
  });

  it('returns an unsubscribe function that stops notifications', () => {
    const fn = vi.fn();
    const unsub = subscribe('theme', fn);
    unsub();
    set('theme', 'daylight');
    expect(fn).not.toHaveBeenCalled();
  });
});
