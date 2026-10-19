import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { DownloadCloud, Smartphone } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors whitespace-nowrap"
      >
        <DownloadCloud className="w-3.5 h-3.5" />
        Instaliraj PWA za Gradilište
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800 whitespace-nowrap"
        >
          <Smartphone className="w-3.5 h-3.5 text-sky-400" />
          Instaliraj na iOS
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
              <h3 className="text-base font-bold text-white">Instalacija na iPhone / iPad</h3>
              <p className="mt-2 text-xs text-slate-300 space-y-1">
                1. Dodirnite ikonu <strong>Dijeli (Share)</strong> na dnu Safari preglednika.<br />
                2. Pomaknite se dolje i odaberite <strong>Dodaj na početni zaslon (Add to Home Screen)</strong>.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-lg bg-slate-800 py-2 text-xs font-semibold text-white hover:bg-slate-700"
              >
                U redu
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
