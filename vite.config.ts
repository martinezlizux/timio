import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  }
});
