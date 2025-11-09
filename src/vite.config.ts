import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Portfoliowebsite/', // GitHub Pagesのリポジトリ名に合わせて変更してください
  build: {
    outDir: 'dist',
    sourcemap: false,
    emptyOutDir: true,
  },
});
