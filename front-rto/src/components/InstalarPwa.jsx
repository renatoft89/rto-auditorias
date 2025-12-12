import { useEffect, useRef, useState } from "react";
import "../styles/InstalarPwa/index.css";

const isStandalone = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
};

const resolveManifestUrl = () => {
  if (typeof window === "undefined") return null;
  try {
    return new URL("/manifest.json", window.location.origin).href;
  } catch {
    return null;
  }
};

function InstalarPwa() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isAlreadyInstalled, setIsAlreadyInstalled] = useState(isStandalone());
  const hasPromptedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleAppInstalled = () => {
      setIsAlreadyInstalled(true);
      setShowModal(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("appinstalled", handleAppInstalled);
    return () => window.removeEventListener("appinstalled", handleAppInstalled);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (isStandalone()) {
      setIsAlreadyInstalled(true);
      return;
    }

    const checkInstalled = async () => {
      if (!navigator.getInstalledRelatedApps) return;

      try {
        const relatedApps = await navigator.getInstalledRelatedApps();
        const manifestUrl = resolveManifestUrl();

        const alreadyInstalled = relatedApps.some((app) => {
          if (manifestUrl && app.url) return app.url === manifestUrl;
          if (app.id) return app.id === manifestUrl || app.id === window.location.origin;
          return false;
        });

        if (alreadyInstalled) {
          setIsAlreadyInstalled(true);
          setShowModal(false);
          setDeferredPrompt(null);
        }
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.warn("Falha ao verificar apps instalados:", error);
        }
      }
    };

    checkInstalled();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (isStandalone() || isAlreadyInstalled) return;

    if (hasPromptedRef.current) return;

    if (deferredPrompt && !showModal) {
      const timerId = window.setTimeout(() => {
        if (hasPromptedRef.current) return;
        hasPromptedRef.current = true;
        setShowModal(true);
      }, 800);

      return () => {
        window.clearTimeout(timerId);
      };
    }
  }, [deferredPrompt, showModal, isAlreadyInstalled]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    setIsInstalling(true);

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setShowModal(false);
      setIsAlreadyInstalled(true);
    }

    setIsInstalling(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  if (!showModal || isAlreadyInstalled) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Instalar Aplicativo Consultech</h2>
        {/* <p>Instalar o aplicativo  em seu dispositivo?</p> */}
        <div className="modal-actions">
          <button onClick={handleCancel} className="btn-cancelar" disabled={isInstalling}>
            Cancelar
          </button>
          <button onClick={handleInstall} className="btn-excluir" disabled={isInstalling}>
            {isInstalling ? "Instalando..." : "Instalar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default InstalarPwa;
