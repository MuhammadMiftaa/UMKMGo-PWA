import "./PWABadge.css";

import { useState, useEffect } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { Wifi, WifiOff, RefreshCw, X, Download } from "lucide-react";

function PWABadge() {
  // periodic sync is disabled, change the value to enable it, the period is in milliseconds
  // You can remove onRegisteredSW callback and registerPeriodicSync function
  const period = 0;
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineBanner, setShowOfflineBanner] = useState(false);

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      if (period <= 0) return;
      if (r?.active?.state === "activated") {
        registerPeriodicSync(period, swUrl, r);
      } else if (r?.installing) {
        r.installing.addEventListener("statechange", (e) => {
          const sw = e.target as ServiceWorker;
          if (sw.state === "activated") registerPeriodicSync(period, swUrl, r);
        });
      }
    },
  });

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineBanner(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineBanner(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check initial state
    if (!navigator.onLine) {
      setIsOnline(false);
      setShowOfflineBanner(true);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  function close() {
    setOfflineReady(false);
    setNeedRefresh(false);
  }

  return (
    <>
      {/* Offline Banner - Fixed at top */}
      {showOfflineBanner && !isOnline && (
        <div className="animate-slide-down fixed top-0 right-0 left-0 z-[9999] flex items-center justify-between bg-amber-500 px-4 py-2 text-white shadow-lg">
          <div className="flex items-center gap-2">
            <WifiOff size={18} />
            <span className="text-sm font-medium">
              Mode Offline - Menggunakan data tersimpan
            </span>
          </div>
          <button
            onClick={() => setShowOfflineBanner(false)}
            className="rounded-full p-1 transition-colors hover:bg-amber-600"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Online Restored Banner */}
      {isOnline && showOfflineBanner && (
        <div className="animate-slide-down fixed top-0 right-0 left-0 z-[9999] flex items-center justify-between bg-green-500 px-4 py-2 text-white shadow-lg">
          <div className="flex items-center gap-2">
            <Wifi size={18} />
            <span className="text-sm font-medium">
              Koneksi dipulihkan - Anda kembali online
            </span>
          </div>
          <button
            onClick={() => setShowOfflineBanner(false)}
            className="rounded-full p-1 transition-colors hover:bg-green-600"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* PWA Update/Offline Ready Toast */}
      <div className="PWABadge" role="alert" aria-labelledby="toast-message">
        {(offlineReady || needRefresh) && (
          <div className="animate-slide-up fixed right-4 bottom-20 left-4 z-[9999] rounded-xl border border-gray-100 bg-white p-4 shadow-2xl">
            <div className="flex items-start gap-3">
              <div
                className={`rounded-full p-2 ${
                  needRefresh ? "bg-blue-100" : "bg-green-100"
                }`}
              >
                {needRefresh ? (
                  <Download size={20} className="text-blue-600" />
                ) : (
                  <Wifi size={20} className="text-green-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {offlineReady ? "Siap Mode Offline" : "Pembaruan Tersedia"}
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  {offlineReady
                    ? "Aplikasi dapat digunakan tanpa koneksi internet"
                    : "Versi baru tersedia. Muat ulang untuk memperbarui."}
                </p>
              </div>
              <button
                onClick={() => close()}
                className="rounded-full p-1 transition-colors hover:bg-gray-100"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <div className="mt-4 flex gap-2">
              {needRefresh && (
                <button
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                  onClick={() => updateServiceWorker(true)}
                >
                  <RefreshCw size={16} />
                  Muat Ulang
                </button>
              )}
              <button
                className={`${
                  needRefresh ? "flex-1" : "w-full"
                } rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200`}
                onClick={() => close()}
              >
                {needRefresh ? "Nanti" : "Mengerti"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default PWABadge;

/**
 * This function will register a periodic sync check every hour, you can modify the interval as needed.
 */
function registerPeriodicSync(
  period: number,
  swUrl: string,
  r: ServiceWorkerRegistration,
) {
  if (period <= 0) return;

  setInterval(async () => {
    if ("onLine" in navigator && !navigator.onLine) return;

    const resp = await fetch(swUrl, {
      cache: "no-store",
      headers: {
        cache: "no-store",
        "cache-control": "no-cache",
      },
    });

    if (resp?.status === 200) await r.update();
  }, period);
}
