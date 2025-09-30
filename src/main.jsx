// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css"; // why: global styles + tailwind

// render root – ostaje kao kod tebe
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// PWA: registracija service workera (prod only, ne dira dev/HMR)
// why: sigurni uslovi → nema “poremetilo mi app” efekta
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        // optional update flow
        reg.onupdatefound = () => {
          const sw = reg.installing;
          if (!sw) return;
          sw.onstatechange = () => {
            // when new SW installed and postoji stari kontroler → ponudi refresh
            if (
              sw.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // TODO: zameni confirm toast-om ako imaš
              const ok = window.confirm("New version available. Reload now?");
              if (ok) window.location.reload();
            }
          };
        };
      })
      .catch((err) => console.error("SW registration failed:", err));
  });
}

// Dev guard: očisti stare SW registracije u development-u
if ("serviceWorker" in navigator && !import.meta.env.PROD) {
  navigator.serviceWorker.getRegistrations().then((regs) => {
    regs.forEach((r) => r.unregister());
  });
}
