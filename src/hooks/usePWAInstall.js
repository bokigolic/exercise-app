import { useCallback, useEffect, useRef, useState } from "react";

/** why: enkapsulira beforeinstallprompt i status instalacije */
export default function usePWAInstall() {
  const deferredRef = useRef(null);
  const [canInstall, setCanInstall] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onPrompt = (e) => {
      e.preventDefault();
      deferredRef.current = e;
      setCanInstall(true);
    };
    const onInstalled = () => setInstalled(true);

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    const evt = deferredRef.current;
    if (!evt) return { outcome: "dismissed" };
    setCanInstall(false);
    deferredRef.current = null;
    const res = await evt.prompt();
    // Some browsers: res.outcome or await evt.userChoice
    try {
      const choice = await evt.userChoice;
      return choice || res;
    } catch {
      return res || { outcome: "unknown" };
    }
  }, []);

  return { canInstall, promptInstall, installed };
}