import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/maas-karsilastirici/',
  server: {
    host: true, // dış dünyaya açılmasını sağlar
    // allowedHosts: [
    //   '95c7-2404-4408-67a1-e600-44f3-cf9e-d72f-aa9c.ngrok-free.app' // güncel ngrok adresin
    // ]
  }
});
