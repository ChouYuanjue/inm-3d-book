import { defineConfig } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('.',import.meta.url));
export default defineConfig({
  base:'/inm-3d-book/',
  build:{
    outDir:'dist',
    assetsDir:'assets',
    rollupOptions:{
      input:{
        main:path.resolve(root,'index.html'),
        lab:path.resolve(root,'lab.html')
      }
    }
  }
});
