import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '../', '');
  const port = env.PORT || 8081;

  return {
    server: {
      open: true,
      proxy: {
        '/api': {
          target: `http://localhost:${port}`,
          changeOrigin: false,
          secure: false,
        },
      }
    },
    build: {
      outDir: 'build',
    },
    plugins: [react()],
  };
});
