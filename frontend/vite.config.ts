import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  resolve: {

    tsconfigPaths: true,
  },
  server: {
    proxy: {
      "/api": { target: "http://127.0.0.1:4000", changeOrigin: true },
    },
    port: 5173,

    host: true,

    allowedHosts: true,
  },
});
