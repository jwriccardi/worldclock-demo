/**
 * Simple state management utility using localStorage.
 */
export const store = {
  /**
   * Save a value to localStorage.
   * @param {string} key 
   * @param {any} value 
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  },

  /**
   * Get a value from localStorage.
   * @param {string} key 
   * @param {any} defaultValue 
   * @returns {any}
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error('Error reading from localStorage', e);
      return defaultValue;
    }
  },

  /**
   * Remove a value from localStorage.
   * @param {string} key 
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Error removing from localStorage', e);
    }
  }
};
