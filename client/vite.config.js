import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Requests to /api go to the Express server during development
export default defineConfig({
  plugins: [react()],
  server: { proxy: { "/api": "http://localhost:5000" } },
});
