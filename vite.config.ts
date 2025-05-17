import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: process.env.PORT || 3000,
    host: '0.0.0.0',
    strictPort: true,
    proxy: {
      '/api': process.env.VITE_API_URL || 'http://localhost:5000',
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
