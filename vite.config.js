import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  define: {
    'process.env.MEDIAN_APP': JSON.stringify(process.env.MEDIAN_APP || false)
  }
});
