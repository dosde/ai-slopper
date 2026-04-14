// Procedural chiptune + ambient music engine using Web Audio API

let audioCtx = null;
let isMusicPlaying = false;
let musicInterval = null;
let masterGain = null;
let gameGain = null;   // routes all game-music oscillators; disconnect on stopMusic
let tempoScale = 1.0;
let isBossMusicPlaying = false;
let bossMusicInterval = null;
let isTitleMusicPlaying = false;
let titleMusicInterval = null;
let titleGain = null;
// Lazy getter — routes all title audio through one gain node so we can fade instantly
const getTitleGain = () => {
  const ctx = getCtx(); // ensures masterGain exists
  if (!titleGain) {
    titleGain = ctx.createGain();
    titleGain.gain.value = 1.0;
    titleGain.connect(masterGain);
  }
  return titleGain;
};

// Persist music style preference
let currentMusicStyle = (() => {
  try { return localStorage.getItem('musicStyle') || 'pleasant'; } catch (e) { return 'pleasant'; }
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
  if (isTitleMusicPlaying) {
    // Cut gain immediately so old notes are silenced before new bar starts
    isTitleMusicPlaying = false;
    if (titleMusicInterval) { clearInterval(titleMusicInterval); titleMusicInterval = null; }
    if (titleGain) {
      const ctx = getCtx();
      titleGain.gain.cancelScheduledValues(ctx.currentTime);
      titleGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    }
    // Short gap so any in-flight oscillators can reach their stop() time
    setTimeout(() => startTitleMusic(), 40);
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

// Lazy getter — all game music routes through this so stopMusic() can disconnect it
const getGameGain = () => {
  const ctx = getCtx();
  if (!gameGain) {
    gameGain = ctx.createGain();
    gameGain.gain.value = 1.0;
    gameGain.connect(masterGain);
  }
  return gameGain;
};

const playNote = (freq, duration, startTime, type = 'square', gain = 0.15, dest = null) => {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gainNode.gain.setValueAtTime(gain, startTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc.connect(gainNode);
  gainNode.connect(dest || masterGain);
  osc.start(startTime);
  osc.stop(startTime + duration);
};

const N = {
  C3:130.81, D3:146.83, E3:164.81, F3:174.61, G3:196.00, A3:220.00, B3:246.94,
  C4:261.63, D4:293.66, E4:329.63, F4:349.23, G4:392.00, A4:440.00, B4:493.88,
  C5:523.25, D5:587.33, E5:659.25, F5:698.46, G5:783.99, A5:880.00, B5:987.77,
  C6:1046.50,
  // Chromatic additions
  Bb2: 116.54, A2: 110.00,
  Eb3: 155.56, Fs3: 185.00, Ab3: 207.65, Bb3: 233.08,
  Cs4: 277.18, Eb4: 311.13, Fs4: 369.99, Ab4: 415.30, Bb4: 466.16,
  Cs5: 554.37, Eb5: 622.25, Fs5: 739.99, Ab5: 830.61, Bb5: 932.33,
  D6: 1174.66,
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
// A minor, aggressive sawtooth with tritone stabs, ~5.8s loop

const BOSS_MELODY = [
  // Riff 1 — staccato attack with tritone stabs (Eb against A)
  [N.A4,0.09],[0,0.03],[N.A4,0.09],[N.Eb5,0.12],[N.D5,0.09],[N.A4,0.09],[0,0.03],
  [N.G4,0.09],[0,0.03],[N.G4,0.09],[N.E5,0.12],[N.D5,0.09],[N.C5,0.09],[0,0.03],
  [N.F4,0.09],[0,0.03],[N.F4,0.09],[N.Bb4,0.12],[N.A4,0.09],[N.G4,0.09],[0,0.03],
  [N.E4,0.12],[0,0.03],[N.E4,0.09],[N.G4,0.09],[N.A4,0.09],[N.Bb4,0.09],[0,0.03],
  // Chromatic descent — full chromatic run with speed
  [N.A5,0.09],[N.Ab5,0.09],[N.G5,0.09],[N.Fs5,0.09],[N.F5,0.09],[N.E5,0.09],[0,0.03],
  [N.Eb5,0.09],[N.D5,0.09],[N.Cs5,0.09],[N.C5,0.09],[N.B4,0.09],[N.A4,0.09],[0,0.03],
  [N.G4,0.09],[N.A4,0.09],[N.B4,0.09],[N.Cs5,0.09],[N.Eb5,0.09],[0,0.03],
  // Tritone landing — A vs Eb
  [N.A5,0.24],[0,0.04],[N.Eb5,0.14],[0,0.04],[N.A4,0.24],[0,0.08],
];

const BOSS_BASS = [
  [N.A3,0.09],[N.A3,0.09],[0,0.03],[N.A3,0.09],[N.E3,0.09],[0,0.03],[N.A3,0.09],[N.Eb3,0.09],[0,0.03],
  [N.G3,0.09],[N.G3,0.09],[0,0.03],[N.G3,0.09],[N.D3,0.09],[0,0.03],[N.G3,0.09],[0,0.03],
  [N.F3,0.09],[N.F3,0.09],[0,0.03],[N.F3,0.09],[N.C3,0.09],[0,0.03],[N.F3,0.09],[N.Bb2,0.09],[0,0.03],
  [N.E3,0.12],[0,0.03],[N.E3,0.09],[N.G3,0.09],[N.A3,0.09],[N.Bb3,0.09],[0,0.03],
  [N.A3,0.09],[0,0.03],[N.G3,0.09],[0,0.03],[N.F3,0.09],[0,0.03],[N.E3,0.09],[0,0.03],
  [N.D3,0.09],[0,0.03],[N.E3,0.09],[0,0.03],[N.F3,0.09],[N.G3,0.09],[0,0.03],
  [N.E3,0.12],[N.A3,0.09],[N.E4,0.09],[0,0.03],
  [N.A3,0.24],[0,0.04],[N.Eb3,0.14],[0,0.04],[N.A2,0.24],[0,0.08],
];

// ── TITLE SCREEN music ────────────────────────────────────────────────────────

// Sloppy title: punchy arcade fanfare, ~7.57s loop
const TITLE_SLOPPY_MELODY = [
  // Part 1: Opening fanfare — C major arpeggio + answer (4.00s)
  [N.C5,0.10],[N.E5,0.10],[N.G5,0.10],[N.C6,0.15],[0,0.05],               // 0.50
  [N.B5,0.10],[N.G5,0.10],[N.E5,0.10],[N.G5,0.15],[0,0.05],               // 0.50
  [N.A5,0.12],[N.G5,0.10],[N.F5,0.10],[N.E5,0.10],[0,0.08],               // 0.50
  [N.D5,0.10],[N.E5,0.10],[N.G5,0.10],[N.A5,0.15],[0,0.05],               // 0.50
  [N.F5,0.08],[N.G5,0.08],[N.A5,0.08],[N.C6,0.08],[N.A5,0.08],[0,0.10],  // 0.50
  [N.G5,0.08],[N.F5,0.08],[N.E5,0.08],[N.D5,0.08],[N.C5,0.08],[0,0.10],  // 0.50
  [N.E5,0.10],[N.G5,0.10],[N.A5,0.10],[N.G5,0.10],[N.E5,0.10],[0,0.05],  // 0.55
  [N.C5,0.35],[0,0.10],                                                     // 0.45
  // Part 2: F + G bridge (2.0s)
  [N.F5,0.10],[N.A5,0.10],[N.C6,0.10],[N.A5,0.10],[N.F5,0.10],[0,0.05],  // 0.55
  [N.G5,0.10],[N.B5,0.10],[N.G5,0.10],[N.E5,0.10],[N.D5,0.10],[0,0.05],  // 0.55
  // Part 3: Chromatic fills (1.14s)
  [N.C5,0.08],[N.D5,0.08],[N.E5,0.08],[N.F5,0.08],[N.E5,0.08],[N.D5,0.08],[0,0.08], // 0.56
  [N.E5,0.08],[N.G5,0.08],[N.A5,0.08],[N.C6,0.10],[N.B5,0.08],[N.A5,0.08],[0,0.08], // 0.58
  // Part 4: Grand finale sweep (1.33s)
  [N.C6,0.10],[N.B5,0.08],[N.A5,0.08],[N.G5,0.08],[N.F5,0.08],[N.E5,0.08],[0,0.08], // 0.58
  [N.D5,0.10],[N.C5,0.50],[0,0.15],                                                    // 0.75
];
// Total: ~7.57s

const TITLE_SLOPPY_BASS = [
  // Part 1 (4.00s = 8×0.50)
  [N.C3,0.20],[0,0.05],[N.G3,0.20],[0,0.05],
  [N.C3,0.20],[0,0.05],[N.G3,0.20],[0,0.05],
  [N.A3,0.20],[0,0.05],[N.E3,0.20],[0,0.05],
  [N.F3,0.20],[0,0.05],[N.C3,0.20],[0,0.05],
  [N.G3,0.20],[0,0.05],[N.D3,0.20],[0,0.05],
  [N.C3,0.20],[0,0.05],[N.E3,0.20],[0,0.05],
  [N.F3,0.20],[0,0.05],[N.G3,0.20],[0,0.05],
  [N.C3,0.40],[0,0.10],
  // Part 2-4 (3.57s)
  [N.F3,0.20],[0,0.05],[N.C3,0.20],[0,0.05],
  [N.G3,0.20],[0,0.05],[N.D3,0.20],[0,0.05],
  [N.C3,0.20],[0,0.05],[N.E3,0.20],[0,0.05],
  [N.A3,0.20],[0,0.05],[N.C3,0.20],[0,0.05],
  [N.F3,0.20],[0,0.05],[N.G3,0.20],[0,0.05],
  [N.E3,0.20],[0,0.05],[N.G3,0.20],[0,0.05],
  [N.C3,0.40],[0,0.17],
];
// Total: ~7.57s

// Chill title: slow ambient C-G-Am-F-Am-C progression, ~14.75s loop
const TITLE_CHILL_MELODY = [
  // Bar 1: C major — gentle opening (2.20s)
  [N.G5,0.60],[0,0.10],[N.E5,0.50],[0,0.10],[N.C5,0.40],[0,0.10],[N.E5,0.30],[0,0.10],
  // Bar 2: G major — warm rise (2.00s)
  [N.B5,0.65],[0,0.10],[N.G5,0.50],[0,0.10],[N.D5,0.55],[0,0.10],
  // Bar 3: Am — gentle dip (2.20s)
  [N.A5,0.60],[0,0.10],[N.C5,0.45],[0,0.10],[N.E5,0.45],[0,0.10],[N.A5,0.30],[0,0.10],
  // Bar 4: F major — lift (2.80s)
  [N.F5,0.65],[0,0.10],[N.A5,0.50],[0,0.10],[N.C6,0.45],[0,0.10],[N.F5,0.60],[0,0.30],
  // Bar 5: Am descend — emotional dip (2.55s)
  [N.E5,0.55],[0,0.10],[N.C5,0.50],[0,0.10],[N.A4,0.55],[0,0.10],[N.G4,0.55],[0,0.10],
  // Bar 6: C major finale — warm resolution (3.00s)
  [N.C5,0.65],[0,0.15],[N.E5,0.55],[0,0.10],[N.G5,0.60],[0,0.15],[N.C5,0.65],[0,0.15],
];
// Bar durations: 2.20+2.00+2.20+2.80+2.55+3.00 = 14.75s

const TITLE_CHILL_BASS = [
  [N.C3,0.55],[N.E3,0.55],[N.G3,0.55],[N.E3,0.55],    // C major  2.20s
  [N.G3,0.65],[N.B3,0.65],[N.D3,0.70],                 // G major  2.00s
  [N.A3,0.55],[N.C3,0.55],[N.E3,0.55],[N.A3,0.55],    // Am       2.20s
  [N.F3,0.70],[N.A3,0.70],[N.C3,0.70],[N.F3,0.70],    // F major  2.80s
  [N.A3,0.64],[N.E3,0.64],[N.C3,0.64],[N.A3,0.63],    // Am       2.55s
  [N.C3,0.75],[N.E3,0.75],[N.G3,0.75],[N.C3,0.75],    // C major  3.00s
];
// Total: 14.75s

const getArrayDuration = (arr) => arr.reduce((sum, [, d]) => sum + d, 0);

// ── Sloppy music playback ─────────────────────────────────────────────────────
const playMusicBar = (scale = tempoScale) => {
  const ctx = getCtx();
  const now = ctx.currentTime;
  const s = scale;
  const loopDuration = getArrayDuration(MELODY) / s;

  const gg = getGameGain();
  let t = now;
  for (const [freq, dur] of MELODY) {
    if (freq > 0) playNote(freq, (dur / s) * 0.85, t, 'square', 0.11, gg);
    t += dur / s;
  }
  t = now;
  for (const [freq, dur] of BASS) {
    if (freq > 0) playNote(freq, (dur / s) * 0.78, t, 'triangle', 0.13, gg);
    t += dur / s;
  }
  for (let beat = 0; beat < loopDuration; beat += 0.5 / s) {
    const ko = ctx.createOscillator(); const kg = ctx.createGain();
    ko.type = 'sine';
    ko.frequency.setValueAtTime(160, now + beat);
    ko.frequency.exponentialRampToValueAtTime(0.01, now + beat + 0.18 / s);
    kg.gain.setValueAtTime(0.30, now + beat);
    kg.gain.exponentialRampToValueAtTime(0.001, now + beat + 0.18 / s);
    ko.connect(kg); kg.connect(gg);
    ko.start(now + beat); ko.stop(now + beat + 0.20 / s);
  }
  for (let beat = 0.5 / s; beat < loopDuration; beat += 1.0 / s) {
    const so = ctx.createOscillator(); const sg = ctx.createGain();
    so.type = 'sawtooth'; so.frequency.value = 220;
    sg.gain.setValueAtTime(0.09, now + beat);
    sg.gain.exponentialRampToValueAtTime(0.001, now + beat + 0.10 / s);
    so.connect(sg); sg.connect(gg);
    so.start(now + beat); so.stop(now + beat + 0.12 / s);
  }
  for (let beat = 0; beat < loopDuration; beat += 0.25 / s) {
    const ho = ctx.createOscillator(); const hg = ctx.createGain();
    ho.type = 'square'; ho.frequency.value = 7200;
    hg.gain.setValueAtTime(0.022, now + beat);
    hg.gain.exponentialRampToValueAtTime(0.001, now + beat + 0.04 / s);
    ho.connect(hg); hg.connect(gg);
    ho.start(now + beat); ho.stop(now + beat + 0.05 / s);
  }
  // Low sub-bass rumble on beat 3 — adds tension/weight
  for (let beat = loopDuration * 0.5; beat < loopDuration; beat += loopDuration) {
    const ro = ctx.createOscillator(); const rg = ctx.createGain();
    ro.type = 'sine'; ro.frequency.value = 65;
    rg.gain.setValueAtTime(0.18, now + beat);
    rg.gain.exponentialRampToValueAtTime(0.001, now + beat + 0.35 / s);
    ro.connect(rg); rg.connect(gg);
    ro.start(now + beat); ro.stop(now + beat + 0.36 / s);
  }
};

// ── Pleasant music playback ───────────────────────────────────────────────────
const playPleasantBar = () => {
  const ctx = getCtx();
  const now = ctx.currentTime;
  const loopDuration = getArrayDuration(PLEASANT_MELODY);
  const gg = getGameGain();

  // Melody: warm sine with subtle detune for chorus effect
  let t = now;
  for (const [freq, dur] of PLEASANT_MELODY) {
    if (freq > 0) {
      playNote(freq, dur * 0.88, t, 'sine', 0.09, gg);
      playNote(freq * 1.003, dur * 0.88, t, 'sine', 0.04, gg); // detune warmth
    }
    t += dur;
  }

  // Bass: smooth triangle arpeggios
  t = now;
  for (const [freq, dur] of PLEASANT_BASS) {
    if (freq > 0) playNote(freq, dur * 0.72, t, 'triangle', 0.11, gg);
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
      playNote(f, 2.60, padStart, 'sine', 0.028, gg);
    }
  }

  // Very soft, slow brush accent on beat 1 of each bar (just a faint hi shimmer)
  for (let i = 0; i < 4; i++) {
    const beat = now + i * 3.0;
    const ho = ctx.createOscillator(); const hg = ctx.createGain();
    ho.type = 'sine'; ho.frequency.value = 3200;
    hg.gain.setValueAtTime(0.012, beat);
    hg.gain.exponentialRampToValueAtTime(0.001, beat + 0.35);
    ho.connect(hg); hg.connect(gg);
    ho.start(beat); ho.stop(beat + 0.36);
  }
  // Tension pulse — soft Dm7 dissonance on bar 4 before looping back
  const tensionStart = now + 9.0;
  [N.D3, N.F3, N.C4].forEach(f => {
    playNote(f, 2.80, tensionStart, 'sine', 0.018, gg);
  });
};

// ── Boss music playback ───────────────────────────────────────────────────────
const playBossBar = () => {
  const ctx = getCtx();
  const now = ctx.currentTime;
  const loopDuration = getArrayDuration(BOSS_MELODY);
  const gg = getGameGain();

  // Boss lead: aggressive sawtooth
  let t = now;
  for (const [freq, dur] of BOSS_MELODY) {
    if (freq > 0) playNote(freq, dur * 0.75, t, 'sawtooth', 0.13, gg);
    t += dur;
  }

  // Heavy bass: triangle + sawtooth layer for grit
  t = now;
  for (const [freq, dur] of BOSS_BASS) {
    if (freq > 0) {
      playNote(freq, dur * 0.70, t, 'triangle', 0.22, gg);
      playNote(freq, dur * 0.68, t, 'sawtooth', 0.07, gg);
    }
    t += dur;
  }

  // Low drone — A2 pedal tone, buzzy, creates weight
  const drone = ctx.createOscillator(); const droneG = ctx.createGain();
  drone.type = 'sawtooth'; drone.frequency.value = N.A2;
  droneG.gain.setValueAtTime(0.09, now);
  droneG.gain.setValueAtTime(0.06, now + loopDuration * 0.5);
  droneG.gain.setValueAtTime(0.09, now + loopDuration - 0.1);
  drone.connect(droneG); droneG.connect(gg);
  drone.start(now); drone.stop(now + loopDuration);

  // Tritone sting (Eb) accent — hits on every 4th 16th note for dissonance
  for (let beat = 0.48; beat < loopDuration; beat += 0.96) {
    const s = ctx.createOscillator(); const sg = ctx.createGain();
    s.type = 'square'; s.frequency.value = N.Eb3;
    sg.gain.setValueAtTime(0.06, now + beat);
    sg.gain.exponentialRampToValueAtTime(0.001, now + beat + 0.08);
    s.connect(sg); sg.connect(gg);
    s.start(now + beat); s.stop(now + beat + 0.09);
  }

  // Heavy kick — syncopated pattern
  for (let beat = 0; beat < loopDuration; beat += 0.24) {
    const ko = ctx.createOscillator(); const kg = ctx.createGain();
    ko.type = 'sine';
    ko.frequency.setValueAtTime(220, now + beat);
    ko.frequency.exponentialRampToValueAtTime(0.01, now + beat + 0.14);
    kg.gain.setValueAtTime(0.45, now + beat);
    kg.gain.exponentialRampToValueAtTime(0.001, now + beat + 0.14);
    ko.connect(kg); kg.connect(gg);
    ko.start(now + beat); ko.stop(now + beat + 0.15);
  }

  // Sharp snare on 2 and 4
  for (let beat = 0.48; beat < loopDuration; beat += 0.96) {
    const so = ctx.createOscillator(); const sg = ctx.createGain();
    so.type = 'square'; so.frequency.value = 260;
    sg.gain.setValueAtTime(0.22, now + beat);
    sg.gain.exponentialRampToValueAtTime(0.001, now + beat + 0.06);
    so.connect(sg); sg.connect(gg);
    so.start(now + beat); so.stop(now + beat + 0.07);
  }

  // Fast 32nd-note hi-hat
  for (let beat = 0; beat < loopDuration; beat += 0.06) {
    const ho = ctx.createOscillator(); const hg = ctx.createGain();
    ho.type = 'square'; ho.frequency.value = 11000;
    hg.gain.setValueAtTime(0.018, now + beat);
    hg.gain.exponentialRampToValueAtTime(0.001, now + beat + 0.018);
    ho.connect(hg); hg.connect(gg);
    ho.start(now + beat); ho.stop(now + beat + 0.02);
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

// ── Summary / between-rounds music ───────────────────────────────────────────
// C major, upbeat victory fanfare, ~3.8s loop

const SUMMARY_MELODY = [
  // Bar 1: Rising arpeggio flourish
  [N.C5,0.09],[N.E5,0.09],[N.G5,0.09],[N.C6,0.18],[0,0.06],
  [N.B5,0.09],[N.A5,0.09],[N.G5,0.09],[0,0.06],
  // Bar 2: F major color with 6th
  [N.F5,0.12],[N.A5,0.12],[N.C6,0.12],[N.A5,0.20],[0,0.06],
  [N.G5,0.09],[N.F5,0.09],[N.E5,0.09],[0,0.06],
  // Bar 3: Tension — Am walk to G
  [N.A5,0.10],[N.G5,0.10],[N.F5,0.10],[N.E5,0.10],[N.D5,0.10],[0,0.06],
  [N.E5,0.10],[N.G5,0.10],[N.B5,0.10],[0,0.06],
  // Bar 4: Bright resolution
  [N.C6,0.22],[N.G5,0.14],[N.E5,0.14],[N.C5,0.38],[0,0.10],
];

const SUMMARY_BASS = [
  [N.C3,0.21],[N.G3,0.21],[N.E3,0.21],[N.G3,0.21],
  [N.F3,0.24],[N.C4,0.24],[N.A3,0.24],[N.F3,0.25],
  [N.A3,0.23],[N.E3,0.23],[N.C3,0.23],[N.G3,0.23],
  [N.C3,0.25],[N.E3,0.24],[N.G3,0.24],[N.C3,0.25],
];

let isSummaryMusicPlaying = false;
let summaryMusicInterval = null;
let summaryGain = null;
const getSummaryGain = () => {
  const ctx = getCtx();
  if (!summaryGain) {
    summaryGain = ctx.createGain();
    summaryGain.gain.value = 1.0;
    summaryGain.connect(masterGain);
  }
  return summaryGain;
};

const playSummaryBar = () => {
  const ctx = getCtx();
  const now = ctx.currentTime;
  const sg = getSummaryGain();
  let t = now;
  for (const [freq, dur] of SUMMARY_MELODY) {
    if (freq > 0) {
      playNote(freq, dur * 0.82, t, 'square', 0.10, sg);
      playNote(freq * 0.5, dur * 0.78, t, 'triangle', 0.05, sg); // octave lower for warmth
    }
    t += dur;
  }
  t = now;
  for (const [freq, dur] of SUMMARY_BASS) {
    if (freq > 0) playNote(freq, dur * 0.72, t, 'triangle', 0.13, sg);
    t += dur;
  }
  const loopDuration = getArrayDuration(SUMMARY_MELODY);
  // Light kick on beat 1
  for (let beat = 0; beat < loopDuration; beat += 0.95) {
    const ko = ctx.createOscillator(); const kg = ctx.createGain();
    ko.type = 'sine';
    ko.frequency.setValueAtTime(120, now + beat);
    ko.frequency.exponentialRampToValueAtTime(0.01, now + beat + 0.12);
    kg.gain.setValueAtTime(0.22, now + beat);
    kg.gain.exponentialRampToValueAtTime(0.001, now + beat + 0.12);
    ko.connect(kg); kg.connect(sg);
    ko.start(now + beat); ko.stop(now + beat + 0.13);
  }
};

const restartSummaryLoop = () => {
  if (summaryMusicInterval) { clearInterval(summaryMusicInterval); summaryMusicInterval = null; }
  const loopMs = getArrayDuration(SUMMARY_MELODY) * 1000;
  playSummaryBar();
  summaryMusicInterval = setInterval(() => { if (isSummaryMusicPlaying) playSummaryBar(); }, loopMs);
};

export const startSummaryMusic = () => {
  if (isSummaryMusicPlaying) return;
  isSummaryMusicPlaying = true;
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();
  const sg = getSummaryGain();
  sg.gain.cancelScheduledValues(ctx.currentTime);
  sg.gain.setValueAtTime(0, ctx.currentTime);
  sg.gain.linearRampToValueAtTime(1.0, ctx.currentTime + 0.12);
  restartSummaryLoop();
};

export const stopSummaryMusic = () => {
  isSummaryMusicPlaying = false;
  if (summaryMusicInterval) { clearInterval(summaryMusicInterval); summaryMusicInterval = null; }
  if (summaryGain) {
    const ctx = getCtx();
    summaryGain.gain.cancelScheduledValues(ctx.currentTime);
    summaryGain.gain.setValueAtTime(summaryGain.gain.value, ctx.currentTime);
    summaryGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
  }
};

// ── Inverse mode music ────────────────────────────────────────────────────────
// D minor, haunting/ethereal, no drums, ~5.5s loop

const INVERSE_MELODY = [
  // Dm — descending haunting motif
  [N.A5,0.22],[0,0.06],[N.F5,0.18],[N.D5,0.18],[N.C5,0.18],[N.A4,0.44],[0,0.12],
  // Gm — Bb adds minor color
  [N.G4,0.14],[N.Bb4,0.14],[N.D5,0.14],[N.G5,0.36],[0,0.10],
  [N.F5,0.14],[N.D5,0.14],[N.Bb4,0.28],[0,0.10],
  // A7 — tritone tension: Eb against A
  [N.E5,0.20],[N.Cs5,0.16],[N.A4,0.16],[N.G4,0.16],[N.Eb4,0.38],[0,0.12],
  // Dm resolution with chromatic approach
  [N.D5,0.22],[N.F5,0.18],[N.A5,0.18],[N.F5,0.18],[N.D5,0.50],[0,0.12],
];

const INVERSE_BASS = [
  [N.D3,0.35],[N.A3,0.35],[N.F3,0.35],[N.D3,0.33],   // Dm  ~1.38s
  [N.G3,0.39],[N.D3,0.39],[N.Bb3,0.38],[N.G3,0.38],   // Gm  ~1.54s
  [N.A3,0.30],[N.E3,0.30],[N.Cs4,0.30],[N.A3,0.28],   // A7  ~1.18s
  [N.D3,0.35],[N.F3,0.35],[N.A3,0.35],[N.D3,0.35],    // Dm  ~1.40s
];

let isInverseMusicPlaying = false;
let inverseMusicInterval = null;
let inverseGain = null;
const getInverseGain = () => {
  const ctx = getCtx();
  if (!inverseGain) {
    inverseGain = ctx.createGain();
    inverseGain.gain.value = 1.0;
    inverseGain.connect(masterGain);
  }
  return inverseGain;
};

const playInverseBar = () => {
  const ctx = getCtx();
  const now = ctx.currentTime;
  const ig = getInverseGain();
  // Melody: warm sine with slight chorus for ethereal feel
  let t = now;
  for (const [freq, dur] of INVERSE_MELODY) {
    if (freq > 0) {
      playNote(freq, dur * 0.88, t, 'sine', 0.11, ig);
      playNote(freq * 1.006, dur * 0.85, t, 'sine', 0.04, ig); // detune for chorus
      playNote(freq * 0.5, dur * 0.80, t, 'sine', 0.03, ig);   // sub-octave shimmer
    }
    t += dur;
  }
  // Bass: soft triangle
  t = now;
  for (const [freq, dur] of INVERSE_BASS) {
    if (freq > 0) playNote(freq, dur * 0.75, t, 'triangle', 0.12, ig);
    t += dur;
  }
  // Chord pads: sustained minor chords
  const loopDuration = getArrayDuration(INVERSE_MELODY);
  const padChords = [
    { start: 0,    dur: 1.38, notes: [N.D3, N.F3, N.A3] },   // Dm
    { start: 1.38, dur: 1.54, notes: [N.G3, N.Bb3, N.D4] },  // Gm
    { start: 2.92, dur: 1.18, notes: [N.A3, N.Cs4, N.E4] },  // A7
    { start: 4.10, dur: 1.40, notes: [N.D3, N.F3, N.A3] },   // Dm
  ];
  for (const pad of padChords) {
    for (const f of pad.notes) {
      playNote(f, pad.dur * 0.88, now + pad.start, 'sine', 0.022, ig);
    }
  }
};

const restartInverseLoop = () => {
  if (inverseMusicInterval) { clearInterval(inverseMusicInterval); inverseMusicInterval = null; }
  const loopMs = getArrayDuration(INVERSE_MELODY) * 1000;
  playInverseBar();
  inverseMusicInterval = setInterval(() => { if (isInverseMusicPlaying) playInverseBar(); }, loopMs);
};

export const startInverseMusic = () => {
  if (isInverseMusicPlaying) return;
  isInverseMusicPlaying = true;
  withRunningCtx(() => {
    if (!isInverseMusicPlaying) return;
    const ctx = getCtx();
    const ig = getInverseGain();
    ig.gain.cancelScheduledValues(ctx.currentTime);
    ig.gain.setValueAtTime(0, ctx.currentTime);
    ig.gain.linearRampToValueAtTime(1.0, ctx.currentTime + 0.20);
    restartInverseLoop();
  });
};

export const stopInverseMusic = () => {
  isInverseMusicPlaying = false;
  if (inverseMusicInterval) { clearInterval(inverseMusicInterval); inverseMusicInterval = null; }
  if (inverseGain) {
    const ctx = getCtx();
    inverseGain.gain.cancelScheduledValues(ctx.currentTime);
    inverseGain.gain.setValueAtTime(inverseGain.gain.value, ctx.currentTime);
    inverseGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
  }
};

// ── Title music playback ──────────────────────────────────────────────────────
const playTitleSloppyBar = () => {
  const ctx = getCtx();
  const now = ctx.currentTime;
  const tg = getTitleGain();
  const loopDuration = getArrayDuration(TITLE_SLOPPY_MELODY);

  let t = now;
  for (const [freq, dur] of TITLE_SLOPPY_MELODY) {
    if (freq > 0) playNote(freq, dur * 0.80, t, 'square', 0.13, tg);
    t += dur;
  }
  t = now;
  for (const [freq, dur] of TITLE_SLOPPY_BASS) {
    if (freq > 0) playNote(freq, dur * 0.75, t, 'triangle', 0.14, tg);
    t += dur;
  }
  // Kick on every half-beat
  for (let beat = 0; beat < loopDuration; beat += 0.50) {
    const ko = ctx.createOscillator(); const kg = ctx.createGain();
    ko.type = 'sine';
    ko.frequency.setValueAtTime(155, now + beat);
    ko.frequency.exponentialRampToValueAtTime(0.01, now + beat + 0.20);
    kg.gain.setValueAtTime(0.28, now + beat);
    kg.gain.exponentialRampToValueAtTime(0.001, now + beat + 0.20);
    ko.connect(kg); kg.connect(tg);
    ko.start(now + beat); ko.stop(now + beat + 0.22);
  }
  // Snare on off-beats
  for (let beat = 0.25; beat < loopDuration; beat += 0.50) {
    const so = ctx.createOscillator(); const sg = ctx.createGain();
    so.type = 'sawtooth'; so.frequency.value = 220;
    sg.gain.setValueAtTime(0.07, now + beat);
    sg.gain.exponentialRampToValueAtTime(0.001, now + beat + 0.09);
    so.connect(sg); sg.connect(tg);
    so.start(now + beat); so.stop(now + beat + 0.10);
  }
  // Hi-hat every quarter-beat
  for (let beat = 0; beat < loopDuration; beat += 0.25) {
    const ho = ctx.createOscillator(); const hg = ctx.createGain();
    ho.type = 'square'; ho.frequency.value = 5800;
    hg.gain.setValueAtTime(0.016, now + beat);
    hg.gain.exponentialRampToValueAtTime(0.001, now + beat + 0.04);
    ho.connect(hg); hg.connect(tg);
    ho.start(now + beat); ho.stop(now + beat + 0.05);
  }
};

const playTitleChillBar = () => {
  const ctx = getCtx();
  const now = ctx.currentTime;
  const tg = getTitleGain();
  const loopDuration = getArrayDuration(TITLE_CHILL_MELODY);

  // Melody: warm sine with chorus detune
  let t = now;
  for (const [freq, dur] of TITLE_CHILL_MELODY) {
    if (freq > 0) {
      playNote(freq, dur * 0.86, t, 'sine', 0.10, tg);
      playNote(freq * 1.004, dur * 0.86, t, 'sine', 0.04, tg);
    }
    t += dur;
  }
  // Bass: soft triangle arpeggios
  t = now;
  for (const [freq, dur] of TITLE_CHILL_BASS) {
    if (freq > 0) playNote(freq, dur * 0.72, t, 'triangle', 0.10, tg);
    t += dur;
  }
  // Chord pads: C-G-Am-F-Am-C, one per bar
  const chordSets = [
    [N.C4, N.E4, N.G4],
    [N.G3, N.B3, N.D4],
    [N.A3, N.C4, N.E4],
    [N.F3, N.A3, N.C4],
    [N.A3, N.C4, N.E4],
    [N.C4, N.E4, N.G4],
  ];
  // Bar start times derived from bass
  const barSizes = [4, 3, 4, 4, 4, 4];
  let bi = 0; let bt = 0;
  for (let b = 0; b < 6; b++) {
    const barStart = bt;
    const barDur = barSizes[b] === 3
      ? TITLE_CHILL_BASS.slice(bi, bi + 3).reduce((s, [, d]) => s + d, 0)
      : TITLE_CHILL_BASS.slice(bi, bi + 4).reduce((s, [, d]) => s + d, 0);
    for (const f of chordSets[b]) {
      playNote(f, barDur * 0.82, now + barStart, 'sine', 0.024, tg);
    }
    // Soft shimmer on bar 1
    const ho = ctx.createOscillator(); const hg = ctx.createGain();
    ho.type = 'sine'; ho.frequency.value = 2800;
    hg.gain.setValueAtTime(0.010, now + barStart);
    hg.gain.exponentialRampToValueAtTime(0.001, now + barStart + 0.40);
    ho.connect(hg); hg.connect(tg);
    ho.start(now + barStart); ho.stop(now + barStart + 0.42);
    bt += barDur;
    bi += barSizes[b];
  }
};

const restartTitleSloppyLoop = () => {
  if (titleMusicInterval) { clearInterval(titleMusicInterval); titleMusicInterval = null; }
  const loopMs = getArrayDuration(TITLE_SLOPPY_MELODY) * 1000;
  playTitleSloppyBar();
  titleMusicInterval = setInterval(() => { if (isTitleMusicPlaying) playTitleSloppyBar(); }, loopMs);
};

const restartTitleChillLoop = () => {
  if (titleMusicInterval) { clearInterval(titleMusicInterval); titleMusicInterval = null; }
  const loopMs = getArrayDuration(TITLE_CHILL_MELODY) * 1000;
  playTitleChillBar();
  titleMusicInterval = setInterval(() => { if (isTitleMusicPlaying) playTitleChillBar(); }, loopMs);
};

// ── Public API ────────────────────────────────────────────────────────────────

// Resume the AudioContext if needed, then call fn. Schedules fn synchronously
// if context is already running, otherwise awaits the resume promise so notes
// are never scheduled against a frozen AudioContext clock.
const withRunningCtx = (fn) => {
  const ctx = getCtx();
  if (ctx.state === 'running') { fn(); return; }
  ctx.resume().then(() => fn()).catch(() => {});
};

export const startMusic = () => {
  if (isMusicPlaying) return;
  isMusicPlaying = true;
  withRunningCtx(() => {
    if (!isMusicPlaying) return; // stopped while awaiting resume
    if (currentMusicStyle === 'pleasant') restartPleasantLoop();
    else restartMusicLoop(1.0);
  });
};

export const stopMusic = () => {
  isMusicPlaying = false;
  isBossMusicPlaying = false;
  tempoScale = 1.0;
  if (musicInterval) { clearInterval(musicInterval); musicInterval = null; }
  if (bossMusicInterval) { clearInterval(bossMusicInterval); bossMusicInterval = null; }
  // Disconnect the game gain node — instantly silences any still-scheduled oscillators
  if (gameGain) { gameGain.disconnect(); gameGain = null; }
};

export const startTitleMusic = () => {
  if (isTitleMusicPlaying) return;
  isTitleMusicPlaying = true;
  // Disconnect the old gain node so any still-running oscillators from the
  // previous session play into silence instead of bleeding into the new one.
  if (titleGain) { titleGain.disconnect(); titleGain = null; }
  withRunningCtx(() => {
    if (!isTitleMusicPlaying) return;
    const ctx = getCtx();
    const tg = getTitleGain(); // fresh gain node connected to masterGain
    tg.gain.setValueAtTime(0.0001, ctx.currentTime);
    tg.gain.linearRampToValueAtTime(1.0, ctx.currentTime + 0.15);
    if (currentMusicStyle === 'pleasant') restartTitleChillLoop();
    else restartTitleSloppyLoop();
  });
};

export const stopTitleMusic = () => {
  isTitleMusicPlaying = false;
  if (titleMusicInterval) { clearInterval(titleMusicInterval); titleMusicInterval = null; }
  // Fade out quickly — kills already-scheduled Web Audio nodes without a hard cut
  if (titleGain) {
    const ctx = getCtx();
    titleGain.gain.cancelScheduledValues(ctx.currentTime);
    titleGain.gain.setValueAtTime(titleGain.gain.value, ctx.currentTime);
    titleGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
  }
};

export const startBossMusic = () => {
  // Stop regular music (if any) and start boss music.
  // Callers are responsible for checking musicEnabled.
  isMusicPlaying = false;
  if (musicInterval) { clearInterval(musicInterval); musicInterval = null; }
  isBossMusicPlaying = true;
  withRunningCtx(() => { if (isBossMusicPlaying) restartBossLoop(); });
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

// ── Countdown sounds ─────────────────────────────────────────────────────────
// Rising pitch as tension builds: 5→low, 1→high
const COUNTDOWN_FREQS = { 5: N.A3, 4: N.B3, 3: N.D4, 2: N.E4, 1: N.G4 };

export const playCountdownTick = (num) => {
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();
  const now = ctx.currentTime;
  const freq = COUNTDOWN_FREQS[num] || N.C4;
  const dur = num <= 2 ? 0.22 : 0.14;
  playNote(freq, dur, now, 'sine', 0.38);
  // Add overtone for last two ticks — urgency
  if (num <= 2) playNote(freq * 2, dur * 0.6, now, 'sine', 0.14);
  if (num === 1) playNote(freq * 3, dur * 0.4, now, 'sine', 0.06);
};

export const playCountdownGo = () => {
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();
  const now = ctx.currentTime;
  // Triumphant C major arpeggio launch
  [[N.C5, 0], [N.E5, 0.07], [N.G5, 0.14], [N.C6, 0.21]].forEach(([f, delay]) => {
    playNote(f, 0.40, now + delay, 'sine', 0.38);
  });
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
