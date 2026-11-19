import React, { useState, useEffect } from 'react';
import { Smartphone, X, Download, Sparkles } from 'lucide-react';

export const MobileInstallPromptBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deviceType, setDeviceType] = useState<'ios' | 'android' | 'desktop'>('desktop');

  useEffect(() => {
    // 1. Check if already in standalone app mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://');

    if (isStandalone) {
      return;
    }

    // 2. Check if user dismissed it in this session
    const isDismissed = sessionStorage.getItem('shreeji_install_banner_dismissed');
    if (isDismissed) {
      return;
    }

    // 3. Detect device
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(ua);
    if (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream) {
      setDeviceType('ios');
    } else if (/android/i.test(ua)) {
      setDeviceType('android');
    } else {
      setDeviceType('desktop');
    }

    // 4. Capture prompt or show mobile banner after 2 seconds
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      (window as any).__shreejiDeferredPrompt = e;
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if ((window as any).__shreejiDeferredPrompt) {
      setDeferredPrompt((window as any).__shreejiDeferredPrompt);
      setIsVisible(true);
    } else if (isMobileDevice) {
      // On mobile devices (like iOS Safari or Android before prompt fires), show banner after 2 seconds
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }

    window.addEventListener('appinstalled', () => {
      setIsVisible(false);
      setDeferredPrompt(null);
      (window as any).__shreejiDeferredPrompt = null;
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
          setIsVisible(false);
        }
        setDeferredPrompt(null);
        (window as any).__shreejiDeferredPrompt = null;
      } catch (err) {
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('shreeji_install_banner_dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Bottom App Install Bar */}
      <div className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-20 z-40 max-w-md mx-auto bg-white/98 border border-saffron-300 shadow-2xl rounded-2xl p-3 flex items-center justify-between gap-3 animate-fadeIn gpu-accelerated">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-saffron-600 to-amber-500 p-0.5 shrink-0 shadow-md">
            <img
              src="/icon-192.png"
              alt="Shree Ji"
              className="w-full h-full object-cover rounded-[10px]"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div className="min-w-0">
            <p className="font-serif font-black text-xs sm:text-sm text-deepbrown-950 truncate flex items-center gap-1">
              <span>Shree Ji Fast Food</span>
              <Sparkles className="w-3 h-3 text-saffron-600 fill-saffron-500" />
            </p>
            <p className="text-[10px] sm:text-xs text-stone-600 truncate">
              Mobile me install karein & fast order karein
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleInstallClick}
            className="px-3 py-1.5 bg-gradient-to-r from-saffron-600 to-amber-600 hover:from-saffron-700 hover:to-amber-700 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>
          <button
            onClick={handleDismiss}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Visual Guide Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border-2 border-saffron-400 relative overflow-hidden animate-scale-up text-deepbrown-900">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-saffron-600 to-amber-500 p-1 mx-auto mb-3 shadow-lg flex items-center justify-center">
              <img
                src="/icon-192.png"
                alt="Shree Ji App Icon"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            <h3 className="text-lg font-serif font-black text-deepbrown-950 mb-1">
              Shree Ji Fast Food App
            </h3>
            <p className="text-xs text-stone-600 mb-5">
              1-Click me apne mobile par download karein:
            </p>

            {deviceType === 'ios' ? (
              <div className="bg-orange-50/70 border border-orange-200/80 rounded-2xl p-4 text-left space-y-2.5 text-xs text-stone-700">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-saffron-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                  <p>Safari browser me neeche <strong>Share button (⎋)</strong> dabayein.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-saffron-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                  <p>Neeche scroll karke <strong>"Add to Home Screen" (➕)</strong> chunein.</p>
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
                  <p>Browser me URL address bar ke right side me <strong>Install icon (📥)</strong> par click karein.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-saffron-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                  <p>Popup me <strong>"Install"</strong> dabayein.</p>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="mt-5 w-full py-2.5 bg-gradient-to-r from-saffron-600 to-amber-600 text-white text-xs font-bold rounded-xl shadow-md hover:from-saffron-700 hover:to-amber-700 transition-colors"
            >
              Theek Hai (OK)
            </button>
          </div>
        </div>
      )}
    </>
  );
};
