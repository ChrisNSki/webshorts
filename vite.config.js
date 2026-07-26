import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { copyFileSync } from 'node:fs';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'WebShorts',
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@radix-ui/react-dialog', 'sonner'],
    },
    cssCodeSplit: false,
  },
  plugins: [
    react(),
    dts({ include: ['src'] }),
    {
      name: 'copy-public-types',
      closeBundle() {
        copyFileSync('src/index.d.ts', 'dist/index.d.ts');
      },
    },
  ],
});
