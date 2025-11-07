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
        const distDir = resolve(__dirname, "dist");
        const redirects = `/.netlify/functions/* /.netlify/functions/:splat 200
/* /index.html 200`;

        // ✅ Ako ne postoji dist, napravi ga
        if (!fs.existsSync(distDir)) {
          fs.mkdirSync(distDir, { recursive: true });
        }

        // ✅ Zapiši _redirects fajl u dist
        fs.writeFileSync(resolve(distDir, "_redirects"), redirects);
        console.log("✅ _redirects file created in dist/");
      },
    },
  ],
});
