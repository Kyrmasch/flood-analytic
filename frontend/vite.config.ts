import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        // Дополнительные настройки Sass, если нужно
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("react-router-dom")) {
            return "react-router";
          }

          if (id.includes("mapbox-gl")) {
            return "mapbox";
          }

          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
  server: {},
});
