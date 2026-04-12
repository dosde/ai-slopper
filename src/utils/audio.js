// Procedural chiptune music engine using Web Audio API
// No external dependencies - runs everywhere

let audioCtx = null;
let musicNodes = [];
let isMusicPlaying = false;
let musicInterval = null;
let masterGain = null;

const getCtx = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.3;
    masterGain.connect(audioCtx.destination);
  }
  return audioCtx;
};

const playNote = (freq, duration, startTime, type = 'square', gain = 0.15) => {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = type;
  osc.frequency.value = freq;

  gainNode.gain.setValueAtTime(gain, startTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc.connect(gainNode);
  gainNode.connect(masterGain);

  osc.start(startTime);
  osc.stop(startTime + duration);
};

// Notes frequencies
const NOTES = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
  G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46,
  G5: 783.99, A5: 880.00, B5: 987.77,
  C3: 130.81, G3: 196.00, A3: 220.00, E3: 164.81,
};

// Main game melody - upbeat and ridiculous
const MELODY = [
  [NOTES.C5, 0.15], [NOTES.E5, 0.15], [NOTES.G5, 0.15], [NOTES.E5, 0.15],
  [NOTES.C5, 0.15], [NOTES.D5, 0.15], [NOTES.F5, 0.30], [0, 0.10],
  [NOTES.G5, 0.15], [NOTES.F5, 0.15], [NOTES.E5, 0.15], [NOTES.D5, 0.15],
  [NOTES.C5, 0.30], [NOTES.E5, 0.30], [0, 0.10],
  [NOTES.A5, 0.15], [NOTES.G5, 0.15], [NOTES.F5, 0.15], [NOTES.E5, 0.15],
  [NOTES.D5, 0.15], [NOTES.C5, 0.15], [NOTES.B4, 0.30], [0, 0.10],
  [NOTES.C5, 0.15], [NOTES.D5, 0.15], [NOTES.E5, 0.15], [NOTES.G5, 0.15],
  [NOTES.C5, 0.60], [0, 0.10],
];

const BASS = [
  [NOTES.C3, 0.25], [0, 0.05], [NOTES.C3, 0.25], [0, 0.05],
  [NOTES.G3, 0.25], [0, 0.05], [NOTES.G3, 0.25], [0, 0.05],
  [NOTES.A3, 0.25], [0, 0.05], [NOTES.A3, 0.25], [0, 0.05],
  [NOTES.E3, 0.25], [0, 0.05], [NOTES.E3, 0.25], [0, 0.05],
  [NOTES.C3, 0.25], [0, 0.05], [NOTES.C3, 0.25], [0, 0.05],
  [NOTES.G3, 0.25], [0, 0.05], [NOTES.G3, 0.25], [0, 0.05],
  [NOTES.A3, 0.25], [0, 0.05], [NOTES.A3, 0.25], [0, 0.05],
  [NOTES.E3, 0.25], [0, 0.05], [NOTES.E3, 0.60], [0, 0.05],
];

let musicLoopId = null;

const playMusicBar = () => {
  const ctx = getCtx();
  const now = ctx.currentTime;
  let t = now;

  // Play melody
  for (const [freq, dur] of MELODY) {
    if (freq > 0) {
      playNote(freq, dur * 0.9, t, 'square', 0.12);
    }
    t += dur;
  }

  // Play bass
  t = now;
  for (const [freq, dur] of BASS) {
    if (freq > 0) {
      playNote(freq, dur * 0.8, t, 'triangle', 0.15);
    }
    t += dur;
  }

  // Simple drum kick simulation using noise
  const kicks = [0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5];
  for (const beat of kicks) {
    const kickOsc = ctx.createOscillator();
    const kickGain = ctx.createGain();
    kickOsc.type = 'sine';
    kickOsc.frequency.setValueAtTime(150, now + beat);
    kickOsc.frequency.exponentialRampToValueAtTime(0.01, now + beat + 0.15);
    kickGain.gain.setValueAtTime(0.3, now + beat);
    kickGain.gain.exponentialRampToValueAtTime(0.001, now + beat + 0.15);
    kickOsc.connect(kickGain);
    kickGain.connect(masterGain);
    kickOsc.start(now + beat);
    kickOsc.stop(now + beat + 0.15);
  }

  return t - now; // Return duration
};

export const startMusic = () => {
  if (isMusicPlaying) return;
  isMusicPlaying = true;

  const ctx = getCtx();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const barDuration = 4.2; // seconds per loop
  playMusicBar();
  musicInterval = setInterval(() => {
    if (isMusicPlaying) playMusicBar();
  }, barDuration * 1000);
};

export const stopMusic = () => {
  isMusicPlaying = false;
  if (musicInterval) {
    clearInterval(musicInterval);
    musicInterval = null;
  }
};

export const setMusicVolume = (vol) => {
  if (masterGain) masterGain.gain.value = vol;
};

// Sound effects
export const playSlopDetected = () => {
  const ctx = getCtx();
  const now = ctx.currentTime;
  // Ascending ding!
  [523, 659, 784].forEach((f, i) => {
    playNote(f, 0.12, now + i * 0.08, 'square', 0.2);
  });
};

export const playCombo = (multiplier) => {
  const ctx = getCtx();
  const now = ctx.currentTime;
  const baseFreqs = [523, 659, 784, 1047];
  const count = Math.min(multiplier, 4);
  for (let i = 0; i < count; i++) {
    playNote(baseFreqs[i], 0.1, now + i * 0.07, 'square', 0.18);
  }
};

export const playMiss = () => {
  const ctx = getCtx();
  const now = ctx.currentTime;
  [300, 200].forEach((f, i) => {
    playNote(f, 0.15, now + i * 0.12, 'sawtooth', 0.15);
  });
};

export const playRoundComplete = () => {
  const ctx = getCtx();
  const now = ctx.currentTime;
  const victory = [523, 659, 784, 1047, 784, 1047, 1319];
  victory.forEach((f, i) => {
    playNote(f, 0.15, now + i * 0.1, 'square', 0.18);
  });
};

export const playGameOver = () => {
  const ctx = getCtx();
  const now = ctx.currentTime;
  const fanfare = [784, 784, 784, 523, 659, 784, 1047];
  fanfare.forEach((f, i) => {
    playNote(f, 0.2, now + i * 0.12, 'square', 0.2);
  });
};

export const initAudio = () => {
  // Called on first user interaction to unlock AudioContext
  getCtx();
};
