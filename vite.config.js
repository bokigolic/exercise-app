import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import fs from "fs";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "copy-redirects",
      closeBundle() {
        const redirects = `/.netlify/functions/* /.netlify/functions/:splat 200
/* /index.html 200`;
        fs.writeFileSync(resolve(__dirname, "dist/_redirects"), redirects);
      },
    },
  ],
});
