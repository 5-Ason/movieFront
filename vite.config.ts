import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // 当请求路径以 /api 开头时，转发到 Spring Boot 后端
      '/api': {
        target: 'http://localhost:3334', // 您的 Spring Boot 地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api') // 根据后端接口调整
      }
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});