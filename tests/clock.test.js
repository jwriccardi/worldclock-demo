/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { getTimeParts, getTZAbbr, getHandAngles, CITIES } from '../clock.js';

describe('clock logic', () => {
  const testDate = new Date('2026-04-23T12:00:00Z'); // Noon UTC

  it('should return correct time parts for New York', () => {
    const parts = getTimeParts('America/New_York', testDate);
    // 12:00 PM UTC is 8:00 AM EDT in April
    expect(parts.hours).toBe('08');
    expect(parts.minutes).toBe('00');
    expect(parts.ampm).toMatch(/AM/);
  });

  it('should return correct time parts for Tokyo', () => {
    const parts = getTimeParts('Asia/Tokyo', testDate);
    // 12:00 PM UTC is 9:00 PM JST
    expect(parts.hours).toBe('09');
    expect(parts.minutes).toBe('00');
    expect(parts.ampm).toMatch(/PM/);
  });

  it('should return timezone abbreviations', () => {
    const nyAbbr = getTZAbbr('America/New_York', testDate);
    // In some environments it might return EDT, in others GMT-4
    expect(nyAbbr).toMatch(/EDT|GMT-4/);
    
    const tokyoAbbr = getTZAbbr('Asia/Tokyo', testDate);
    expect(tokyoAbbr).toMatch(/JST|GMT\+9/);
  });

  it('should have 6 cities defined', () => {
    expect(CITIES).toHaveLength(6);
  });

  describe('getHandAngles', () => {
    it('should calculate correct angles for 1:00:00 AM', () => {
      const midnight = new Date('2026-04-23T00:00:00Z');
      // London is at UTC+1 in April (BST) -> 1:00:00 AM
      const angles = getHandAngles('Europe/London', midnight);
      
      expect(angles.hour).toBe(30); // 1 * 30
      expect(angles.minute).toBe(0);
      expect(angles.second).toBe(0);
    });

    it('should calculate correct angles for 4:30:30 PM', () => {
      // 15:30:30 UTC -> London (UTC+1) is 16:30:30
      const date = new Date('2026-04-23T15:30:30Z'); 
      const angles = getHandAngles('Europe/London', date);
      
      expect(angles.second).toBe(180); // 30s * 6
      expect(angles.minute).toBe(183); // 30m * 6 + 30s * 0.1
      // 4:30:30 PM is 16:30:30
      // Hour hand: (4h * 30) + (30m * 0.5) + (30s * 0.5/60) = 120 + 15 + 0.25 = 135.25
      expect(angles.hour).toBe(135.25);
    });

    it('should handle wrap-around (11:59:59)', () => {
      // 10:59:59 UTC -> London (UTC+1) is 11:59:59
      const date = new Date('2026-04-23T10:59:59Z'); 
      const angles = getHandAngles('Europe/London', date);
      
      expect(angles.second).toBe(354); // 59 * 6
      expect(angles.minute).toBeCloseTo(359.9, 1);
      expect(angles.hour).toBeCloseTo(359.99, 2);
    });
  });
});
