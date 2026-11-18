import React, { useState, useEffect } from 'react';
import { Download, Monitor, Check } from 'lucide-react';

export const InstallAppButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already in standalone desktop mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Guide user how to install directly from browser bar if prompt wasn't cached
      alert('Desktop App Install Karne Ke Liye:\n\n1. Apne Chrome ya Edge browser me URL bar ke right side me "Install" icon (📥) par click karein.\n2. Ya browser ke three dots (⋮) menu me jakar "Install Shree Ji Fast Food..." par click karein.\n\nYeh aapke desktop par app icon create kar dega!');
    }
  };

  if (isInstalled) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-semibold">
        <Check className="w-3.5 h-3.5" />
        <span>Desktop App Installed</span>
      </span>
    );
  }

  if (compact) {
    return (
      <button
        onClick={handleInstallClick}
        title="Install Shree Ji Fast Food on Desktop"
        className="inline-flex items-center gap-1.5 bg-deepbrown-900 hover:bg-deepbrown-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-colors"
      >
        <Monitor className="w-3.5 h-3.5 text-amber-300" />
        <span>App Install</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleInstallClick}
      className="inline-flex items-center gap-2 bg-gradient-to-r from-deepbrown-900 to-deepbrown-950 hover:from-black hover:to-deepbrown-900 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm border border-deepbrown-800 transition-all hover:scale-105"
      title="Install Shree Ji Fast Food as Windows Desktop App"
    >
      <Monitor className="w-4 h-4 text-warmamber-400" />
      <span>Install Desktop App</span>
    </button>
  );
};
