import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue()
  ],
  build: {
    outDir:"./static/js",
    name:"main.js",
    rollupOptions: {
      input: 'src/main.js',
      output:{
        entryFileNames:"[name].js"
      },
    },
  },
});
