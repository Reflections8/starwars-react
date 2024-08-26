import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import vitePluginPrettier from "vite-plugin-prettier";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    vitePluginPrettier({
      configFile: true,
      include: "**/*.+(js|jsx|ts|tsx|json|css|less|scss|html|vue)",
      exclude: ["node_modules/**", ".git/**"],
    }),
  ],
  base: "./",
});
