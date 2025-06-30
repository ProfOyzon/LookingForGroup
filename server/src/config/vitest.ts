import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    // include: ['client/src/test/**/*.test.js'],
    include: ['server/test-frontend/**/*.test.js'],
  },
});
