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

      gain.gain.setValueAtTime(0.3, startTime);
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

    // Mobile Vibration if supported
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 300]);
    }
  } catch (err) {
    console.log('Audio playback prevented or unsupported:', err);
  }
};

// 2. Celebratory Chime for Customer when Order is Accepted (Ding-Ring-Ping!)
export const playOrderAcceptedChime = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    const playTone = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    // Ascending celebratory triad: C5 (523.25) -> E5 (659.25) -> G5 (783.99) -> C6 (1046.5)
    playTone(523.25, now, 0.3);
    playTone(659.25, now + 0.12, 0.3);
    playTone(783.99, now + 0.24, 0.35);
    playTone(1046.5, now + 0.36, 0.8);

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([150, 100, 250]);
    }
  } catch (err) {
    console.log('Audio playback prevented or unsupported:', err);
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

// Trigger Browser Notification
export const sendBrowserNotification = (title: string, options?: NotificationOptions) => {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission === 'granted') {
    try {
      new Notification(title, {
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        ...options,
      });
    } catch (e) {
      // Ignore
    }
  }
};
