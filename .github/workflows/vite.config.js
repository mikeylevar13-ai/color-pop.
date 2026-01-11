import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // IMPORTANT: replace "color-pop" with your EXACT repo name if different
  base: "/color-pop/",
});
