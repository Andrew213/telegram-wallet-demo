import react from "@vitejs/plugin-react";
import path from "path";
import {defineConfig} from "vite";
import svgr from "vite-plugin-svgr";

//
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        exportType: "default",
        ref: true,
        svgo: false,
        titleProp: true,
      },
      include: "**/*.svg",
    }),
  ],
  base: "/tg-webapp-wallet/",
  server: {
    port: 3000,
    host: "127.0.0.1",
  },
  preview: {
    port: 3030,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@api": path.resolve(__dirname, "./src/api"),
      "@providers": path.resolve(__dirname, "./src/core/providers"),
    },
  },
});
