import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// If you deploy inside a sub-folder (for example GitHub Pages at /repo-name/),
// set base to '/repo-name/'. For a normal domain keep it as '/'.
// `npm run build` makes two builds: the site itself, then a server build of src/entry-server.jsx that
// scripts/prerender.mjs uses to write a ready-made HTML file for every page.
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  base: '/',
  build: {
    target: 'es2019',
    cssCodeSplit: true,
    rollupOptions: isSsrBuild ? {} : {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
}));
