import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'WebShorts',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
    },
    cssCodeSplit: false,
  },
  plugins: [react()],
});
