import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

import { githubPagesSpa } from '@sctg/vite-plugin-github-pages-spa';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: "/mesza",
  plugins: [
    react(),
    tailwindcss(),
    githubPagesSpa({
      verbose: false, // Set to false to disable console logs
    }),
    VitePWA({
      registerType: "prompt",
      injectRegister: false,

      pwaAssets: {
        disabled: false,
        config: true,
      },

      manifest: {
        name: "mesza",
        short_name: "mesza",
        description: "Yet another habit tracker.",
        theme_color: "#54bc6e",
        orientation: "portrait",
        display: "standalone",
        start_url: ".",
        background_color: "#070707",
      },

      // add this to cache all the
      // static assets in the public folder
      includeAssets: ["**/*"],
      workbox: {
        globPatterns: ["**/*"],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },

      devOptions: {
        enabled: false,
        navigateFallback: "index.html",
        suppressWarnings: true,
        type: "module",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
