// Procedural chiptune + ambient music engine using Web Audio API

let audioCtx = null;
let isMusicPlaying = false;
let musicInterval = null;
let masterGain = null;
let tempoScale = 1.0;
let isBossMusicPlaying = false;
let bossMusicInterval = null;

// Persist music style preference
let currentMusicStyle = (() => {
  try { return localStorage.getItem('musicStyle') || 'sloppy'; } catch (e) { return 'sloppy'; }
})();

export const getMusicStyle = () => currentMusicStyle;
export const setMusicStyle = (style) => {
  currentMusicStyle = style;
  try { localStorage.setItem('musicStyle', style); } catch (e) {}
  if (isMusicPlaying) {
    isMusicPlaying = false;
    if (musicInterval) { clearInterval(musicInterval); musicInterval = null; }
    startMusic();
  }
};

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

// ── SLOPPY chiptune music (original) ─────────────────────────────────────────

const MELODY_A = [
  [N.C5,0.15],[N.E5,0.15],[N.G5,0.15],[N.E5,0.15],[N.C5,0.15],[N.D5,0.15],[N.F5,0.30],[0,0.10],
  [N.G5,0.15],[N.F5,0.15],[N.E5,0.15],[N.D5,0.15],[N.C5,0.30],[N.E5,0.30],[0,0.10],
  [N.A5,0.15],[N.G5,0.15],[N.F5,0.15],[N.E5,0.15],[N.D5,0.15],[N.C5,0.15],[N.B4,0.30],[0,0.10],
  [N.C5,0.15],[N.D5,0.15],[N.E5,0.15],[N.G5,0.15],[N.C5,0.60],[0,0.10],
];
const MELODY_B = [
  [N.E5,0.15],[N.E5,0.15],[N.F5,0.15],[N.G5,0.15],[N.G5,0.15],[N.F5,0.15],[N.E5,0.15],[N.D5,0.15],[0,0.10],
  [N.C5,0.15],[N.C5,0.15],[N.D5,0.15],[N.E5,0.15],[N.E5,0.30],[N.D5,0.30],[0,0.10],
  [N.E5,0.15],[N.E5,0.15],[N.F5,0.15],[N.G5,0.15],[N.G5,0.15],[N.F5,0.15],[N.E5,0.15],[N.D5,0.15],[0,0.10],
  [N.C5,0.15],[N.D5,0.15],[N.E5,0.15],[N.C5,0.15],[N.C5,0.55],[0,0.10],
];
const MELODY_C = [
  [N.G5,0.10],[N.A5,0.10],[N.B5,0.10],[N.A5,0.10],[N.G5,0.10],[N.F5,0.10],[N.E5,0.10],[N.F5,0.10],[0,0.05],
  [N.G5,0.20],[N.E5,0.20],[N.C5,0.20],[N.E5,0.20],[0,0.10],
  [N.A5,0.15],[N.G5,0.15],[N.F5,0.15],[N.E5,0.15],[N.D5,0.15],[N.E5,0.15],[N.F5,0.30],[0,0.10],
  [N.G5,0.10],[N.A5,0.10],[N.G5,0.10],[N.F5,0.10],[N.E5,0.10],[N.D5,0.10],[N.C5,0.10],[N.D5,0.10],[0,0.05],
  [N.E5,0.10],[N.G5,0.10],[N.C6,0.15],[N.B5,0.10],[N.A5,0.10],[N.G5,0.10],[N.C5,0.60],[0,0.10],
];
const MELODY = [...MELODY_A, ...MELODY_B, ...MELODY_C];

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

// ── PLEASANT ambient music ────────────────────────────────────────────────────
// C major: C-Am-F-G, gentle sine waves, ~12s loop
// Each bar = 3.00s exactly

const PLEASANT_MELODY = [
  // Bar 1: C major — gentle rising phrase
  [N.E5,0.60],[N.G5,0.45],[0,0.10],[N.A5,0.45],[0,0.10],[N.G5,0.30],[N.E5,0.60],[0,0.40],
  // Bar 2: Am — descending resolution
  [N.A5,0.80],[0,0.10],[N.G5,0.45],[0,0.10],[N.E5,0.45],[0,0.10],[N.C5,0.80],[0,0.20],
  // Bar 3: F major — lift
  [N.F5,0.60],[0,0.10],[N.A5,0.45],[0,0.10],[N.C6,0.45],[0,0.10],[N.A5,0.30],[N.G5,0.60],[0,0.30],
  // Bar 4: G — resolve back to C (ends on D5 for tension)
  [N.G5,0.60],[0,0.10],[N.B5,0.45],[0,0.10],[N.A5,0.45],[0,0.10],[N.G5,0.30],[N.D5,0.60],[0,0.30],
];
// Total: 4 × 3.00 = 12.00s

const PLEASANT_BASS = [
  // C major arpeggio (3.00s)
  [N.C3,0.75],[N.E3,0.75],[N.G3,0.75],[N.E3,0.75],
  // Am arpeggio (3.00s)
  [N.A3,0.75],[N.C3,0.75],[N.E3,0.75],[N.A3,0.75],
  // F major (3.00s)
  [N.F3,0.75],[N.A3,0.75],[N.F3,0.75],[N.A3,0.75],
  // G major (3.00s)
  [N.G3,0.75],[N.B3,0.75],[N.D3,0.75],[N.G3,0.75],
];
// Total: 16 × 0.75 = 12.00s

// ── BOSS music ────────────────────────────────────────────────────────────────
// A minor, aggressive sawtooth, ~5.6s loop

const BOSS_MELODY = [
  // Dark Am riff — staccato attack
  [N.A4,0.10],[0,0.05],[N.A4,0.10],[N.C5,0.15],[N.B4,0.10],[N.A4,0.10],[0,0.05],
  [N.G4,0.10],[0,0.05],[N.G4,0.10],[N.E5,0.15],[N.D5,0.10],[N.C5,0.10],[0,0.05],
  [N.F4,0.10],[0,0.05],[N.F4,0.10],[N.A4,0.15],[N.G4,0.10],[N.F4,0.10],[0,0.05],
  [N.E4,0.15],[0,0.05],[N.E4,0.15],[0,0.05],[N.E4,0.15],[N.G4,0.10],[N.A4,0.10],[0,0.05],
  // Climax run
  [N.A5,0.10],[N.G5,0.10],[N.F5,0.10],[N.E5,0.10],[0,0.05],[N.D5,0.10],[N.C5,0.10],[0,0.05],
  [N.B4,0.10],[N.A4,0.10],[N.G4,0.10],[N.A4,0.10],[N.B4,0.10],[N.C5,0.10],[0,0.05],
  [N.D5,0.10],[N.E5,0.10],[N.F5,0.10],[N.G5,0.10],[N.A5,0.10],[0,0.05],
  [N.A5,0.30],[0,0.05],[N.E5,0.15],[0,0.05],[N.A4,0.30],[0,0.10],
];

const BOSS_BASS = [
  [N.A3,0.15],[0,0.05],[N.A3,0.10],[0,0.05],[N.A3,0.15],[N.C3,0.10],[0,0.05],
  [N.G3,0.15],[0,0.05],[N.G3,0.10],[N.E3,0.10],[N.G3,0.10],[N.A3,0.10],[0,0.05],
  [N.F3,0.15],[0,0.05],[N.F3,0.10],[N.A3,0.10],[N.F3,0.15],[N.E3,0.10],[0,0.05],
  [N.E3,0.15],[0,0.05],[N.E3,0.15],[0,0.05],[N.E3,0.15],[N.G3,0.10],[N.A3,0.10],[0,0.05],
  [N.A3,0.15],[N.G3,0.10],[N.F3,0.10],[N.E3,0.10],[N.D3,0.10],[N.C3,0.10],[0,0.05],
  [N.C3,0.10],[N.D3,0.10],[N.E3,0.10],[N.F3,0.10],[N.E3,0.10],[N.D3,0.10],[0,0.05],
  [N.E3,0.15],[0,0.05],[N.A3,0.15],[0,0.05],[N.E3,0.10],[0,0.05],
  [N.A3,0.30],[0,0.05],[N.A3,0.15],[0,0.05],[N.A3,0.20],[0,0.10],
];

const getArrayDuration = (arr) => arr.reduce((sum, [, d]) => sum + d, 0);

// ── Sloppy music playback ─────────────────────────────────────────────────────
const playMusicBar = (scale = tempoScale) => {
  const ctx = getCtx();
  const now = ctx.currentTime;
  const s = scale;
  const loopDuration = getArrayDuration(MELODY) / s;

  let t = now;
  for (const [freq, dur] of MELODY) {
    if (freq > 0) playNote(freq, (dur / s) * 0.85, t, 'square', 0.11);
    t += dur / s;
  }
  t = now;
  for (const [freq, dur] of BASS) {
    if (freq > 0) playNote(freq, (dur / s) * 0.78, t, 'triangle', 0.13);
    t += dur / s;
  }
  for (let beat = 0; beat < loopDuration; beat += 0.5 / s) {
    const ko = ctx.createOscillator(); const kg = ctx.createGain();
    ko.type = 'sine';
    ko.frequency.setValueAtTime(160, now + beat);
    ko.frequency.exponentialRampToValueAtTime(0.01, now + beat + 0.18 / s);
    kg.gain.setValueAtTime(0.30, now + beat);
    kg.gain.exponentialRampToValueAtTime(0.001, now + beat + 0.18 / s);
    ko.connect(kg); kg.connect(masterGain);
    ko.start(now + beat); ko.stop(now + beat + 0.20 / s);
  }
  for (let beat = 0.5 / s; beat < loopDuration; beat += 1.0 / s) {
    const so = ctx.createOscillator(); const sg = ctx.createGain();
    so.type = 'sawtooth'; so.frequency.value = 220;
    sg.gain.setValueAtTime(0.09, now + beat);
    sg.gain.exponentialRampToValueAtTime(0.001, now + beat + 0.10 / s);
    so.connect(sg); sg.connect(masterGain);
    so.start(now + beat); so.stop(now + beat + 0.12 / s);
  }
  for (let beat = 0; beat < loopDuration; beat += 0.25 / s) {
    const ho = ctx.createOscillator(); const hg = ctx.createGain();
    ho.type = 'square'; ho.frequency.value = 7200;
    hg.gain.setValueAtTime(0.022, now + beat);
    hg.gain.exponentialRampToValueAtTime(0.001, now + beat + 0.04 / s);
    ho.connect(hg); hg.connect(masterGain);
    ho.start(now + beat); ho.stop(now + beat + 0.05 / s);
  }
};

// ── Pleasant music playback ───────────────────────────────────────────────────
const playPleasantBar = () => {
  const ctx = getCtx();
  const now = ctx.currentTime;
  const loopDuration = getArrayDuration(PLEASANT_MELODY);

  // Melody: warm sine with subtle detune for chorus effect
  let t = now;
  for (const [freq, dur] of PLEASANT_MELODY) {
    if (freq > 0) {
      playNote(freq, dur * 0.88, t, 'sine', 0.09);
      playNote(freq * 1.003, dur * 0.88, t, 'sine', 0.04); // detune warmth
    }
    t += dur;
  }

  // Bass: smooth triangle arpeggios
  t = now;
  for (const [freq, dur] of PLEASANT_BASS) {
    if (freq > 0) playNote(freq, dur * 0.72, t, 'triangle', 0.11);
    t += dur;
  }

  // Chord pads: very soft whole-note chords (one per 3s bar)
  const chordSets = [
    [N.C4, N.E4, N.G4],   // C major
    [N.A3, N.C4, N.E4],   // Am
    [N.F3, N.A3, N.C4],   // F major
    [N.G3, N.B3, N.D4],   // G major — D4 = 293.66Hz (in N)
  ];
  for (let i = 0; i < 4; i++) {
    const padStart = now + i * 3.0;
    for (const f of chordSets[i]) {
      playNote(f, 2.60, padStart, 'sine', 0.028);
    }
  }

  // Very soft, slow brush accent on beat 1 of each bar (just a faint hi shimmer)
  for (let i = 0; i < 4; i++) {
    const beat = now + i * 3.0;
    const ho = ctx.createOscillator(); const hg = ctx.createGain();
    ho.type = 'sine'; ho.frequency.value = 3200;
    hg.gain.setValueAtTime(0.012, beat);
    hg.gain.exponentialRampToValueAtTime(0.001, beat + 0.35);
    ho.connect(hg); hg.connect(masterGain);
    ho.start(beat); ho.stop(beat + 0.36);
  }
};

// ── Boss music playback ───────────────────────────────────────────────────────
const playBossBar = () => {
  const ctx = getCtx();
  const now = ctx.currentTime;
  const loopDuration = getArrayDuration(BOSS_MELODY);

  // Boss lead: aggressive sawtooth
  let t = now;
  for (const [freq, dur] of BOSS_MELODY) {
    if (freq > 0) playNote(freq, dur * 0.78, t, 'sawtooth', 0.14);
    t += dur;
  }

  // Heavy bass: triangle
  t = now;
  for (const [freq, dur] of BOSS_BASS) {
    if (freq > 0) playNote(freq, dur * 0.72, t, 'triangle', 0.20);
    t += dur;
  }

  // Heavy kick every 0.25s
  for (let beat = 0; beat < loopDuration; beat += 0.25) {
    const ko = ctx.createOscillator(); const kg = ctx.createGain();
    ko.type = 'sine';
    ko.frequency.setValueAtTime(200, now + beat);
    ko.frequency.exponentialRampToValueAtTime(0.01, now + beat + 0.14);
    kg.gain.setValueAtTime(0.42, now + beat);
    kg.gain.exponentialRampToValueAtTime(0.001, now + beat + 0.14);
    ko.connect(kg); kg.connect(masterGain);
    ko.start(now + beat); ko.stop(now + beat + 0.15);
  }

  // Aggressive snare on 2nd and 4th of each half-second
  for (let beat = 0.125; beat < loopDuration; beat += 0.25) {
    const so = ctx.createOscillator(); const sg = ctx.createGain();
    so.type = 'square'; so.frequency.value = 200;
    sg.gain.setValueAtTime(0.16, now + beat);
    sg.gain.exponentialRampToValueAtTime(0.001, now + beat + 0.07);
    so.connect(sg); sg.connect(masterGain);
    so.start(now + beat); so.stop(now + beat + 0.08);
  }

  // Fast 16th-note hi-hat
  for (let beat = 0; beat < loopDuration; beat += 0.08) {
    const ho = ctx.createOscillator(); const hg = ctx.createGain();
    ho.type = 'square'; ho.frequency.value = 9000;
    hg.gain.setValueAtTime(0.022, now + beat);
    hg.gain.exponentialRampToValueAtTime(0.001, now + beat + 0.025);
    ho.connect(hg); hg.connect(masterGain);
    ho.start(now + beat); ho.stop(now + beat + 0.03);
  }
};

// ── Loop managers ─────────────────────────────────────────────────────────────
const restartMusicLoop = (scale) => {
  if (musicInterval) { clearInterval(musicInterval); musicInterval = null; }
  const loopMs = getArrayDuration(MELODY) * 1000 / scale;
  playMusicBar(scale);
  musicInterval = setInterval(() => { if (isMusicPlaying) playMusicBar(tempoScale); }, loopMs);
};

const restartPleasantLoop = () => {
  if (musicInterval) { clearInterval(musicInterval); musicInterval = null; }
  const loopMs = getArrayDuration(PLEASANT_MELODY) * 1000;
  playPleasantBar();
  musicInterval = setInterval(() => { if (isMusicPlaying) playPleasantBar(); }, loopMs);
};

const restartBossLoop = () => {
  if (bossMusicInterval) { clearInterval(bossMusicInterval); bossMusicInterval = null; }
  const loopMs = getArrayDuration(BOSS_MELODY) * 1000;
  playBossBar();
  bossMusicInterval = setInterval(() => { if (isBossMusicPlaying) playBossBar(); }, loopMs);
};

// ── Public API ────────────────────────────────────────────────────────────────
export const startMusic = () => {
  if (isMusicPlaying) return;
  isMusicPlaying = true;
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();
  if (currentMusicStyle === 'pleasant') {
    restartPleasantLoop();
  } else {
    restartMusicLoop(1.0);
  }
};

export const stopMusic = () => {
  isMusicPlaying = false;
  isBossMusicPlaying = false;
  tempoScale = 1.0;
  if (musicInterval) { clearInterval(musicInterval); musicInterval = null; }
  if (bossMusicInterval) { clearInterval(bossMusicInterval); bossMusicInterval = null; }
};

export const startBossMusic = () => {
  if (!isMusicPlaying) return; // respect music-off
  // Stop regular music, start boss
  isMusicPlaying = false;
  if (musicInterval) { clearInterval(musicInterval); musicInterval = null; }
  isBossMusicPlaying = true;
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();
  restartBossLoop();
};

// Speed up / slow down sloppy music tempo (no-op for other styles)
export const setMusicTempo = (scale) => {
  if (currentMusicStyle !== 'sloppy' || isBossMusicPlaying) return;
  if (Math.abs(tempoScale - scale) < 0.01 || !isMusicPlaying) return;
  tempoScale = scale;
  restartMusicLoop(scale);
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
