import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  server: {
    open: true,
  },
  build: {
    outDir: 'build',
  },
  plugins: [react()],
});
