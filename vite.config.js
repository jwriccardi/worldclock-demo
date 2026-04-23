import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    assetsInlineLimit: Infinity,
    cssCodeSplit: false,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.js'],
    environmentOptions: {
      jsdom: { url: 'http://localhost' },
    },
  },
});
