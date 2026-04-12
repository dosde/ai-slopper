// Procedural chiptune music engine using Web Audio API

let audioCtx = null;
let isMusicPlaying = false;
let musicInterval = null;
let masterGain = null;

const getCtx = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.28;
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

const N = {
  C3:130.81, D3:146.83, E3:164.81, F3:174.61, G3:196.00, A3:220.00, B3:246.94,
  C4:261.63, D4:293.66, E4:329.63, F4:349.23, G4:392.00, A4:440.00, B4:493.88,
  C5:523.25, D5:587.33, E5:659.25, F5:698.46, G5:783.99, A5:880.00, B5:987.77,
  C6:1046.50,
};

// ── Section A: upbeat main theme (~5.2s) ────────────────────────────────────
const MELODY_A = [
  [N.C5,0.15],[N.E5,0.15],[N.G5,0.15],[N.E5,0.15],[N.C5,0.15],[N.D5,0.15],[N.F5,0.30],[0,0.10],
  [N.G5,0.15],[N.F5,0.15],[N.E5,0.15],[N.D5,0.15],[N.C5,0.30],[N.E5,0.30],[0,0.10],
  [N.A5,0.15],[N.G5,0.15],[N.F5,0.15],[N.E5,0.15],[N.D5,0.15],[N.C5,0.15],[N.B4,0.30],[0,0.10],
  [N.C5,0.15],[N.D5,0.15],[N.E5,0.15],[N.G5,0.15],[N.C5,0.60],[0,0.10],
];

// ── Section B: Ode to Joy-inspired stepping melody (~5.2s) ──────────────────
const MELODY_B = [
  [N.E5,0.15],[N.E5,0.15],[N.F5,0.15],[N.G5,0.15],[N.G5,0.15],[N.F5,0.15],[N.E5,0.15],[N.D5,0.15],[0,0.10],
  [N.C5,0.15],[N.C5,0.15],[N.D5,0.15],[N.E5,0.15],[N.E5,0.30],[N.D5,0.30],[0,0.10],
  [N.E5,0.15],[N.E5,0.15],[N.F5,0.15],[N.G5,0.15],[N.G5,0.15],[N.F5,0.15],[N.E5,0.15],[N.D5,0.15],[0,0.10],
  [N.C5,0.15],[N.D5,0.15],[N.E5,0.15],[N.C5,0.15],[N.C5,0.55],[0,0.10],
];

// ── Section C: high-energy climax with fast runs (~5.25s) ───────────────────
const MELODY_C = [
  [N.G5,0.10],[N.A5,0.10],[N.B5,0.10],[N.A5,0.10],[N.G5,0.10],[N.F5,0.10],[N.E5,0.10],[N.F5,0.10],[0,0.05],
  [N.G5,0.20],[N.E5,0.20],[N.C5,0.20],[N.E5,0.20],[0,0.10],
  [N.A5,0.15],[N.G5,0.15],[N.F5,0.15],[N.E5,0.15],[N.D5,0.15],[N.E5,0.15],[N.F5,0.30],[0,0.10],
  [N.G5,0.10],[N.A5,0.10],[N.G5,0.10],[N.F5,0.10],[N.E5,0.10],[N.D5,0.10],[N.C5,0.10],[N.D5,0.10],[0,0.05],
  [N.E5,0.10],[N.G5,0.10],[N.C6,0.15],[N.B5,0.10],[N.A5,0.10],[N.G5,0.10],[N.C5,0.60],[0,0.10],
];

const MELODY = [...MELODY_A, ...MELODY_B, ...MELODY_C];

// ── Bass lines ───────────────────────────────────────────────────────────────
const BASS_A = [
  [N.C3,0.25],[0,0.05],[N.C3,0.25],[0,0.05],
  [N.G3,0.25],[0,0.05],[N.G3,0.25],[0,0.05],
  [N.A3,0.25],[0,0.05],[N.A3,0.25],[0,0.05],
  [N.E3,0.25],[0,0.05],[N.E3,0.25],[0,0.05],
  [N.C3,0.25],[0,0.05],[N.C3,0.25],[0,0.05],
  [N.G3,0.25],[0,0.05],[N.G3,0.25],[0,0.05],
  [N.A3,0.25],[0,0.05],[N.A3,0.25],[0,0.05],
  [N.E3,0.25],[0,0.05],[N.E3,0.60],[0,0.05],
];

const BASS_B = [
  [N.C3,0.15],[N.E3,0.15],[N.G3,0.15],[0,0.05],
  [N.C3,0.15],[N.E3,0.15],[N.G3,0.15],[0,0.05],
  [N.F3,0.15],[N.A3,0.15],[N.C3,0.15],[0,0.05],
  [N.G3,0.15],[N.B3,0.15],[N.D3,0.15],[0,0.05],
  [N.C3,0.15],[N.E3,0.15],[N.G3,0.15],[0,0.05],
  [N.C3,0.15],[N.E3,0.15],[N.G3,0.15],[0,0.05],
  [N.F3,0.15],[N.A3,0.15],[N.C3,0.15],[0,0.05],
  [N.G3,0.25],[0,0.05],[N.G3,0.25],[0,0.05],
  [N.C3,0.60],[0,0.05],
];

const BASS_C = [
  [N.C3,0.15],[0,0.05],[N.C3,0.10],[0,0.05],[N.G3,0.15],[0,0.05],[N.G3,0.10],[0,0.05],
  [N.A3,0.15],[0,0.05],[N.A3,0.10],[0,0.05],[N.G3,0.15],[0,0.05],[N.G3,0.10],[0,0.05],
  [N.F3,0.15],[0,0.05],[N.F3,0.10],[0,0.05],[N.E3,0.15],[0,0.05],[N.E3,0.10],[0,0.05],
  [N.D3,0.15],[0,0.05],[N.E3,0.15],[0,0.05],[N.G3,0.15],[0,0.05],[N.C3,0.10],[0,0.05],
  [N.C3,0.15],[0,0.05],[N.C3,0.10],[0,0.05],[N.G3,0.15],[0,0.05],[N.G3,0.10],[0,0.05],
  [N.A3,0.15],[0,0.05],[N.A3,0.10],[0,0.05],[N.E3,0.15],[0,0.05],[N.E3,0.10],[0,0.05],
  [N.G3,0.25],[0,0.05],[N.E3,0.25],[0,0.05],[N.C3,0.60],[0,0.05],
];

const BASS = [...BASS_A, ...BASS_B, ...BASS_C];

const getArrayDuration = (arr) => arr.reduce((sum, [, d]) => sum + d, 0);

const playMusicBar = () => {
  const ctx = getCtx();
  const now = ctx.currentTime;
  const loopDuration = getArrayDuration(MELODY);

  // Melody — square wave lead
  let t = now;
  for (const [freq, dur] of MELODY) {
    if (freq > 0) playNote(freq, dur * 0.85, t, 'square', 0.11);
    t += dur;
  }

  // Bass — triangle wave
  t = now;
  for (const [freq, dur] of BASS) {
    if (freq > 0) playNote(freq, dur * 0.78, t, 'triangle', 0.13);
    t += dur;
  }

  // Kick drum — sine sweep down every half-beat
  for (let beat = 0; beat < loopDuration; beat += 0.5) {
    const ko = ctx.createOscillator();
    const kg = ctx.createGain();
    ko.type = 'sine';
    ko.frequency.setValueAtTime(160, now + beat);
    ko.frequency.exponentialRampToValueAtTime(0.01, now + beat + 0.18);
    kg.gain.setValueAtTime(0.30, now + beat);
    kg.gain.exponentialRampToValueAtTime(0.001, now + beat + 0.18);
    ko.connect(kg); kg.connect(masterGain);
    ko.start(now + beat); ko.stop(now + beat + 0.20);
  }

  // Snare — sawtooth burst on every 2nd beat (off-beat feel)
  for (let beat = 0.5; beat < loopDuration; beat += 1.0) {
    const so = ctx.createOscillator();
    const sg = ctx.createGain();
    so.type = 'sawtooth';
    so.frequency.value = 220;
    sg.gain.setValueAtTime(0.09, now + beat);
    sg.gain.exponentialRampToValueAtTime(0.001, now + beat + 0.10);
    so.connect(sg); sg.connect(masterGain);
    so.start(now + beat); so.stop(now + beat + 0.12);
  }

  // Hi-hat — crisp 16th-note ticks
  for (let beat = 0; beat < loopDuration; beat += 0.25) {
    const ho = ctx.createOscillator();
    const hg = ctx.createGain();
    ho.type = 'square';
    ho.frequency.value = 7200;
    hg.gain.setValueAtTime(0.022, now + beat);
    hg.gain.exponentialRampToValueAtTime(0.001, now + beat + 0.04);
    ho.connect(hg); hg.connect(masterGain);
    ho.start(now + beat); ho.stop(now + beat + 0.05);
  }
};

export const startMusic = () => {
  if (isMusicPlaying) return;
  isMusicPlaying = true;
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();

  const loopMs = getArrayDuration(MELODY) * 1000;
  playMusicBar();
  musicInterval = setInterval(() => {
    if (isMusicPlaying) playMusicBar();
  }, loopMs);
};

export const stopMusic = () => {
  isMusicPlaying = false;
  if (musicInterval) { clearInterval(musicInterval); musicInterval = null; }
};

export const setMusicVolume = (vol) => {
  if (masterGain) masterGain.gain.value = vol;
};

// ── Sound effects ────────────────────────────────────────────────────────────

export const playSlopDetected = () => {
  const ctx = getCtx();
  const now = ctx.currentTime;
  [523, 659, 784].forEach((f, i) => playNote(f, 0.12, now + i * 0.08, 'square', 0.20));
};

export const playCombo = (multiplier) => {
  const ctx = getCtx();
  const now = ctx.currentTime;
  const freqs = [523, 659, 784, 1047];
  const count = Math.min(multiplier, 4);
  for (let i = 0; i < count; i++) playNote(freqs[i], 0.10, now + i * 0.07, 'square', 0.18);
};

export const playMiss = () => {
  const ctx = getCtx();
  const now = ctx.currentTime;
  [280, 180].forEach((f, i) => playNote(f, 0.14, now + i * 0.10, 'sawtooth', 0.14));
};

export const playRoundComplete = () => {
  const ctx = getCtx();
  const now = ctx.currentTime;
  [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) =>
    playNote(f, 0.15, now + i * 0.10, 'square', 0.18)
  );
};

export const playGameOver = () => {
  const ctx = getCtx();
  const now = ctx.currentTime;
  [784, 784, 784, 523, 659, 784, 1047].forEach((f, i) =>
    playNote(f, 0.20, now + i * 0.12, 'square', 0.20)
  );
};

export const initAudio = () => { getCtx(); };
