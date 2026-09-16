import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    // Allow preview host for Arena
    hmr: {
      clientPort: 443
    },
    cors: true,
    // @ts-ignore - allowedHosts may not be typed in older vite
    allowedHosts: true as any
  },
  preview: {
    host: '0.0.0.0',
    port: 5173
  }
});
