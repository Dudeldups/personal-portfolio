import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return;
          }

          if (
            id.includes("react-router-dom") ||
            id.includes("react-dom") ||
            id.includes("\\react\\") ||
            id.includes("/react/")
          ) {
            return "react-vendor";
          }

          if (
            id.includes("i18next") ||
            id.includes("react-i18next") ||
            id.includes("country-flag-icons")
          ) {
            return "i18n-vendor";
          }

          if (id.includes("react-icons")) {
            return "icons-vendor";
          }

          if (id.includes("motion")) {
            return "motion-vendor";
          }
        },
      },
    },
  },
});
