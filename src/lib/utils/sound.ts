// Sound effects utility
// Uses Web Audio API for instant playback

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioContext;
}

// Generate a simple beep sound
function playBeep(frequency: number, duration: number, volume: number = 0.3) {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch {
    // Audio not supported or blocked
  }
}

// Sound effects
export const sounds = {
  // Success sound (ascending tone)
  success: () => {
    playBeep(523.25, 0.1); // C5
    setTimeout(() => playBeep(659.25, 0.1), 100); // E5
    setTimeout(() => playBeep(783.99, 0.15), 200); // G5
  },

  // Error sound (descending tone)
  error: () => {
    playBeep(392, 0.15); // G4
    setTimeout(() => playBeep(330, 0.2), 150); // E4
  },

  // Click sound (simple tap)
  click: () => {
    playBeep(600, 0.05, 0.2);
  },

  // Level up sound (fanfare)
  levelUp: () => {
    playBeep(523.25, 0.1); // C5
    setTimeout(() => playBeep(659.25, 0.1), 100); // E5
    setTimeout(() => playBeep(783.99, 0.1), 200); // G5
    setTimeout(() => playBeep(1046.5, 0.2), 300); // C6
  },

  // Toggle sound
  toggle: () => {
    playBeep(440, 0.08, 0.15);
  },

  // Correct answer
  correct: () => {
    playBeep(880, 0.1, 0.25);
  },

  // Wrong answer
  wrong: () => {
    playBeep(200, 0.15, 0.2);
  },
};

// Play sound if enabled in settings
export function playSound(soundName: keyof typeof sounds, enabled: boolean) {
  if (enabled && typeof window !== 'undefined') {
    sounds[soundName]();
  }
}
