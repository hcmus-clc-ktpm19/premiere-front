import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default () => {
  // Load app-level env vars to node-level env vars.
  return defineConfig({
    plugins: [react()],
    build: {
      commonjsOptions: {
        esmExternals: true,
      },
    },
    server: {
      port: 3000,
    },
    define: {
      global: 'window',
    },
    resolve: {
      alias: {
        '~animate.css': 'animate.css',
        '~bootstrap': 'bootstrap',
        '~bootstrap-icons': 'bootstrap-icons',
        '~socicon': 'socicon',
        '~@fortawesome': '@fortawesome',
        '~line-awesome': 'line-awesome',
        '~prism-themes': 'prism-themes',

        // Path resolver
        '@': path.resolve(__dirname, './src'),
        '@assets': path.resolve(__dirname, './src/assets'),
        '@components': path.resolve(__dirname, './src/components'),
        '@models': path.resolve(__dirname, './src/models'),
        '@services': path.resolve(__dirname, './src/services'),
        '@_metronic': path.resolve(__dirname, './src/_metronic'),
        '@pages': path.resolve(__dirname, './src/app/pages'),
      },
    },
  });
};
