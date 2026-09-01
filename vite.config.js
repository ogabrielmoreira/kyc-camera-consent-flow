import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base = "/<nome-do-repositorio>/" — obrigatório para GitHub Pages em subdiretório
export default defineConfig({
  plugins: [react()],
  base: "/kyc-camera-consent-flow/",
});
