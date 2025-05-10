import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import * as path from "path";

import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), VitePWA({ registerType: "autoUpdate" })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
});
