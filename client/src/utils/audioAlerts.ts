// Web Audio API Synthetic Chimes for Orders & Notifications (Works offline, no external mp3 files needed)

let audioCtx: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

// 1. Kitchen Alert for Admin: Loud Dual-Tone Restaurant Bell (Ding-Dong! Ding-Dong!)
export const playKitchenOrderBell = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    const playTone = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.35, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    // First Ding-Dong
    playTone(880, now, 0.4);        // Ding
    playTone(659.25, now + 0.15, 0.6); // Dong

    // Second Ding-Dong
    playTone(880, now + 0.6, 0.4);
    playTone(659.25, now + 0.75, 0.8);

    // Mobile Vibration (Double Strong Buzz)
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([300, 100, 300, 100, 400]);
    }
  } catch (err) {
    console.log('Audio playback prevented or unsupported:', err);
  }
};

// 2. Signature WhatsApp-style Crisp Pop & Notification Chime (Tring-Ping!)
export const playWhatsAppMessageTone = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    const playPop = (freq: number, startTime: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.4, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.18);
    };

    // Crisp high-frequency WhatsApp-like double tap: E6 (1318Hz) -> A6 (1760Hz)
    playPop(1318.51, now);
    playPop(1760.0, now + 0.08);

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([200, 80, 200]);
    }
  } catch (err) {
    console.log('Audio playback error:', err);
  }
};

// 3. Celebratory Chime for Customer when Order is Accepted (Ding-Ring-Ping!)
export const playOrderAcceptedChime = () => {
  try {
    // Play both the WhatsApp pop and the rising melody
    playWhatsAppMessageTone();

    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime + 0.2;

    const playTone = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    // Ascending celebratory triad: C5 (523.25) -> E5 (659.25) -> G5 (783.99) -> C6 (1046.5)
    playTone(523.25, now, 0.25);
    playTone(659.25, now + 0.1, 0.25);
    playTone(783.99, now + 0.2, 0.3);
    playTone(1046.5, now + 0.3, 0.7);
  } catch (err) {
    console.log('Audio playback error:', err);
  }
};

// Request Web Push Notification Permission
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};

// Trigger Browser Notification (Uses Service Worker for Mobile Heads-up Banner if available)
export const sendBrowserNotification = async (title: string, options?: NotificationOptions) => {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  const defaultOptions: any = {
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [300, 100, 300, 100, 300],
    requireInteraction: true,
    tag: 'shreeji-order',
    renotify: true,
    ...options,
  };

  // Try Service Worker registration first (standard for Android / mobile PWA heads-up notification)
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.ready;
      if (reg && 'showNotification' in reg) {
        await reg.showNotification(title, defaultOptions);
        return;
      }
    } catch (e) {
      console.log('SW notification fallback to window Notification:', e);
    }
  }

  // Fallback to standard window.Notification
  try {
    new Notification(title, defaultOptions);
  } catch (e) {
    console.log('Notification error:', e);
  }
};
