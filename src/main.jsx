import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// PWA samo u produkciji
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        reg.onupdatefound = () => {
          const sw = reg.installing;
          if (!sw) return;
          sw.onstatechange = () => {
            if (
              sw.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              const ok = window.confirm("New version available. Reload now?");
              if (ok) window.location.reload();
            }
          };
        };
      })
      .catch((e) => console.error("SW registration failed:", e));
  });
} else if ("serviceWorker" in navigator && !import.meta.env.PROD) {
  // Dev: očisti stare SW da ne smetaju HMR-u
  navigator.serviceWorker
    .getRegistrations()
    .then((regs) => regs.forEach((r) => r.unregister()));
}
