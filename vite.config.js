import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/maas-karsilastirici/',
  server: {
    host: true, // dış dünyaya açılmasını sağlar
    // allowedHosts: [
    //   '87fc-2404-4408-67a1-e600-8da-859d-4c97-7f04.ngrok-free.app' // güncel ngrok adresin
    // ]


  }
});
