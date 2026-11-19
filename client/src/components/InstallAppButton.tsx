import React, { useState, useEffect } from 'react';
import { Download, Monitor, Check, Smartphone, X, ExternalLink, Sparkles } from 'lucide-react';

export const InstallAppButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [deviceType, setDeviceType] = useState<'ios' | 'android' | 'desktop'>('desktop');

  useEffect(() => {
    // 1. Detect if running inside standalone PWA mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://');

    if (isStandalone) {
      setIsInstalled(true);
    }

    // 2. Detect device OS
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    if (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream) {
      setDeviceType('ios');
    } else if (/android/i.test(ua)) {
      setDeviceType('android');
    } else {
      setDeviceType('desktop');
    }

    // 3. Capture beforeinstallprompt event (Chrome, Edge, Samsung Internet)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      (window as any).__shreejiDeferredPrompt = e;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Also pick up if already captured globally
    if ((window as any).__shreejiDeferredPrompt) {
      setDeferredPrompt((window as any).__shreejiDeferredPrompt);
    }

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      (window as any).__shreejiDeferredPrompt = null;
      setShowGuide(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    const prompt = deferredPrompt || (window as any).__shreejiDeferredPrompt;
    if (prompt) {
      try {
        prompt.prompt();
        const choiceResult = await prompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          setIsInstalled(true);
        }
        setDeferredPrompt(null);
        (window as any).__shreejiDeferredPrompt = null;
      } catch (err) {
        setShowGuide(true);
      }
    } else {
      // Fallback: Show visual step-by-step install guide modal tailored to the user's phone/device
      setShowGuide(true);
    }
  };

  if (isInstalled) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-200 font-semibold shadow-sm">
        <Check className="w-3.5 h-3.5 text-emerald-600" />
        <span>App Installed</span>
      </span>
    );
  }

  return (
    <>
      {compact ? (
        <button
          onClick={handleInstallClick}
          title="Install Shree Ji Fast Food App on Phone / Desktop"
          className="inline-flex items-center gap-1.5 bg-gradient-to-r from-saffron-600 to-amber-600 hover:from-saffron-700 hover:to-amber-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md transition-all active:scale-95"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>App Install</span>
        </button>
      ) : (
        <button
          onClick={handleInstallClick}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-saffron-600 to-amber-600 hover:from-saffron-700 hover:to-amber-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md border border-saffron-500/30 transition-all hover:scale-105 active:scale-95"
          title="Install Shree Ji Fast Food App on Mobile / Desktop"
        >
          <Smartphone className="w-4 h-4 text-amber-200" />
          <span>Install App</span>
        </button>
      )}

      {/* Visual Install Guide Modal for Mobile & Desktop */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border-2 border-saffron-400 relative overflow-hidden animate-scale-up text-deepbrown-900">
            {/* Close Button */}
            <button
              onClick={() => setShowGuide(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* App Icon */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-saffron-600 to-amber-500 p-1 mx-auto mb-3 shadow-lg flex items-center justify-center">
              <img
                src="/icon-192.png"
                alt="Shree Ji App Icon"
                className="w-full h-full object-cover rounded-xl"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            <span className="inline-flex items-center gap-1 px-3 py-0.5 bg-saffron-100 text-saffron-800 text-[11px] font-bold rounded-full mb-2">
              <Sparkles className="w-3 h-3 text-saffron-600" />
              1-Click Mobile App Download
            </span>

            <h3 className="text-lg font-serif font-black text-deepbrown-950 mb-1">
              Shree Ji Fast Food App
            </h3>
            <p className="text-xs text-stone-600 mb-5">
              Apne mobile display par direct install karein taaki har baar bina link khole direct khana order kar sakein!
            </p>

            {/* Instructions based on OS */}
            {deviceType === 'ios' ? (
              <div className="bg-orange-50/70 border border-orange-200/80 rounded-2xl p-4 text-left space-y-2.5 text-xs text-stone-700">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-saffron-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                  <p>Safari browser me neeche <strong>Share button (⎋)</strong> par click karein.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-saffron-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                  <p>Menu me neeche scroll karke <strong>"Add to Home Screen" (➕)</strong> chunein.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-saffron-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                  <p>Upar right me <strong>"Add"</strong> dabayein — App display par aa jayega!</p>
                </div>
              </div>
            ) : deviceType === 'android' ? (
              <div className="bg-orange-50/70 border border-orange-200/80 rounded-2xl p-4 text-left space-y-2.5 text-xs text-stone-700">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-saffron-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                  <p>Chrome browser me upar right corner me <strong>3 dots (⋮)</strong> par click karein.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-saffron-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                  <p>Wahan <strong>"Install app"</strong> ya <strong>"Add to Home screen"</strong> par click karein.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-saffron-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                  <p><strong>"Install"</strong> dabayein — App turant mobile display par aa jayega!</p>
                </div>
              </div>
            ) : (
              <div className="bg-orange-50/70 border border-orange-200/80 rounded-2xl p-4 text-left space-y-2.5 text-xs text-stone-700">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-saffron-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                  <p>Chrome ya Edge browser me URL address bar ke right side me <strong>Install icon (📥)</strong> par click karein.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-saffron-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                  <p>Popup aane par <strong>"Install"</strong> par click karein.</p>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowGuide(false)}
              className="mt-5 w-full py-2.5 bg-gradient-to-r from-saffron-600 to-amber-600 text-white text-xs font-bold rounded-xl shadow-md hover:from-saffron-700 hover:to-amber-700 transition-colors"
            >
              Samajh Gaya (OK)
            </button>
          </div>
        </div>
      )}
    </>
  );
};
