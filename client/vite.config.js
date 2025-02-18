import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';

export default defineConfig(() => {
    return {
        server: {
            open: true,
        },
        build: {
            outDir: 'build',
            target: 'esnext', //browsers can handle the latest ES features
        },
        plugins: [react()],
    };
});