// Procedural chiptune + ambient music engine using Web Audio API
// ─────────────────────────────────────────────────────────────────
// Music design notes:
//   SLOPPY  → Undertale-inspired (Ruins ambience → Megalovania intensity), D minor
//   CHILL   → Super Meat Boy inspired (Forest Funk groove + Burning Squirrel warmth), G major
//   IRON    → dedicated 3-minute epic combining both moods for the Iron Detector mode
//   All main game loops are 90s+ (1.5min), iron is ~180s (3min).

let audioCtx = null;
let isMusicPlaying = false;
let musicInterval = null;
let masterGain = null;
let gameGain = null;   // routes all game-music oscillators; disconnect on stopMusic
let tempoScale = 1.0;
// Base BPM multipliers so in-game music feels energetic. Higher = faster.
// These apply on top of any urgency scaling from setMusicTempo().
const SLOP_BASE_SPEED = 1.45;   // bumped up — user wanted much higher tension
const CHILL_BASE_SPEED = 1.30;  // chill with more drive
const IRON_BASE_SPEED = 1.15;   // iron still stately but less sluggish
let isBossMusicPlaying = false;
let bossMusicInterval = null;
let isTitleMusicPlaying = false;
let titleMusicInterval = null;
let titleGain = null;
let isIronMode = false; // when true, startMusic() uses the iron-mode epic track

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
    if (gameGain) { gameGain.disconnect(); gameGain = null; }
    startMusic();
  }
  if (isSummaryMusicPlaying) {
    restartSummaryLoop();
  }
  if (isTitleMusicPlaying) {
    isTitleMusicPlaying = false;
    if (titleMusicInterval) { clearInterval(titleMusicInterval); titleMusicInterval = null; }
    if (titleGain) {
      const tg = titleGain;
      titleGain = null;
      const ctx = getCtx();
      tg.gain.cancelScheduledValues(ctx.currentTime);
      tg.gain.setValueAtTime(0.0001, ctx.currentTime);
      setTimeout(() => { try { tg.disconnect(); } catch (e) {} }, 60);
    }
    setTimeout(() => startTitleMusic(), 30);
  }
};

// Iron-mode music toggle: GameScreen sets this before startMusic() on iron runs.
export const setIronMode = (enabled) => {
  const want = !!enabled;
  if (isIronMode === want) return;
  isIronMode = want;
  if (isMusicPlaying) {
    isMusicPlaying = false;
    if (musicInterval) { clearInterval(musicInterval); musicInterval = null; }
    if (gameGain) { gameGain.disconnect(); gameGain = null; }
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
  C6:1046.50, D6: 1174.66, E6: 1318.51,
  // Chromatic additions
  Bb2: 116.54, A2: 110.00, D2: 73.42, F2: 87.31, G2: 98.00,
  Eb3: 155.56, Fs3: 185.00, Ab3: 207.65, Bb3: 233.08, Cs3: 138.59,
  Cs4: 277.18, Eb4: 311.13, Fs4: 369.99, Ab4: 415.30, Bb4: 466.16,
  Cs5: 554.37, Eb5: 622.25, Fs5: 739.99, Ab5: 830.61, Bb5: 932.33,
};

const getArrayDuration = (arr) => arr.reduce((sum, [, d]) => sum + d, 0);

// ── SLOPPY game music ─ Undertale-inspired ─────────────────────────────────
// Section A: "Ruins" — D minor, atmospheric, slower moody intro (~24s)
// Section B: "Rising tension" — walking bass, melody grows (~22s)
// Section C: "Megalovania build" — syncopated riff, tritone stabs (~22s)
// Section D: "Megalovania hook" — the iconic fast descending phrase (~22s)
// Total ≈ 90s

const SLOP_MELODY_A = [
  // Ruins-style: gentle D-minor arpeggios, sparse (24s)
  [N.D5,0.55],[0,0.10],[N.F5,0.55],[0,0.10],[N.A5,0.55],[0,0.10],[N.F5,0.55],[0,0.20],   // 2.7
  [N.E5,0.55],[0,0.10],[N.G5,0.55],[0,0.10],[N.Bb5,0.55],[0,0.10],[N.G5,0.55],[0,0.20],  // 2.7
  [N.F5,0.55],[0,0.10],[N.A5,0.55],[0,0.10],[N.D6,0.70],[0,0.10],[N.A5,0.55],[0,0.20],   // 2.85
  [N.E5,0.55],[0,0.10],[N.D5,0.70],[0,0.15],[N.A4,1.10],[0,0.30],                         // 2.90
  [N.D5,0.55],[0,0.10],[N.F5,0.55],[0,0.10],[N.A5,0.55],[0,0.10],[N.F5,0.55],[0,0.20],   // 2.7
  [N.E5,0.55],[0,0.10],[N.G5,0.55],[0,0.10],[N.Bb5,0.55],[0,0.10],[N.A5,0.55],[0,0.20],  // 2.7
  [N.D5,0.55],[0,0.10],[N.F5,0.55],[0,0.10],[N.Cs5,0.55],[0,0.10],[N.E5,0.55],[0,0.20],  // 2.7
  [N.D5,1.40],[0,0.35],                                                                    // 1.75
  [N.A4,0.70],[N.D5,0.70],[0,0.20],                                                        // 1.60
];
// Bar totals ~ 24.60s

const SLOP_BASS_A = [
  [N.D3,0.70],[N.A3,0.70],[N.F3,0.70],[N.A3,0.60],
  [N.E3,0.70],[N.B3,0.70],[N.G3,0.70],[N.B3,0.60],
  [N.F3,0.70],[N.C4,0.70],[N.A3,0.70],[N.C4,0.60],
  [N.A3,0.70],[N.E3,0.70],[N.Cs4,0.70],[N.E3,0.65],
  [N.D3,0.70],[N.A3,0.70],[N.F3,0.70],[N.A3,0.60],
  [N.E3,0.70],[N.B3,0.70],[N.G3,0.70],[N.B3,0.60],
  [N.D3,0.70],[N.F3,0.70],[N.A3,0.70],[N.Cs4,0.60],
  [N.D3,1.40],[N.A3,0.35],
  [N.D3,0.70],[N.A3,0.70],[0,0.20],
];

const SLOP_MELODY_B = [
  // Rising tension: eighth-note melody building, call and response (22s)
  [N.D5,0.18],[N.F5,0.18],[N.A5,0.18],[N.D6,0.36],[0,0.10],
  [N.C6,0.18],[N.A5,0.18],[N.F5,0.18],[N.D5,0.36],[0,0.10],
  [N.E5,0.18],[N.G5,0.18],[N.Bb5,0.18],[N.D6,0.36],[0,0.10],
  [N.C6,0.18],[N.Bb5,0.18],[N.A5,0.18],[N.G5,0.36],[0,0.10],
  [N.F5,0.18],[N.A5,0.18],[N.C6,0.18],[N.F6 || N.E6,0.36],[0,0.10],
  [N.E6,0.18],[N.D6,0.18],[N.C6,0.18],[N.A5,0.36],[0,0.10],
  [N.A5,0.18],[N.G5,0.18],[N.F5,0.18],[N.E5,0.18],[N.D5,0.18],[N.Cs5,0.18],[0,0.10],
  [N.D5,0.45],[N.F5,0.45],[N.A5,0.45],[0,0.15],
  // Call/response
  [N.D6,0.20],[N.A5,0.20],[N.F5,0.20],[N.D5,0.20],[0,0.10],
  [N.Cs5,0.20],[N.E5,0.20],[N.G5,0.20],[N.Bb5,0.20],[0,0.10],
  [N.A5,0.30],[N.Bb5,0.20],[N.A5,0.30],[N.G5,0.40],[0,0.10],
  [N.F5,0.30],[N.E5,0.30],[N.D5,0.60],[0,0.20],
  // Transition sting
  [N.A4,0.15],[N.D5,0.15],[N.F5,0.15],[N.A5,0.15],[N.D6,0.30],[N.A5,0.15],[N.F5,0.15],[N.D5,0.30],[0,0.15],
];

const SLOP_BASS_B = [
  [N.D3,0.30],[N.A3,0.30],[N.F3,0.30],[N.D3,0.30],
  [N.D3,0.30],[N.A3,0.30],[N.F3,0.30],[N.D3,0.30],
  [N.E3,0.30],[N.B3,0.30],[N.G3,0.30],[N.E3,0.30],
  [N.G3,0.30],[N.D3,0.30],[N.Bb3,0.30],[N.G3,0.30],
  [N.F3,0.30],[N.C4,0.30],[N.A3,0.30],[N.F3,0.30],
  [N.A3,0.30],[N.E3,0.30],[N.Cs4,0.30],[N.A3,0.30],
  [N.D3,0.30],[N.A3,0.30],[N.F3,0.30],[N.A3,0.30],
  [N.D3,0.60],[N.A3,0.60],[0,0.15],
  [N.D3,0.25],[N.A3,0.25],[N.F3,0.25],[N.A3,0.25],
  [N.E3,0.25],[N.G3,0.25],[N.Bb3,0.25],[N.E3,0.25],
  [N.F3,0.30],[N.C4,0.30],[N.A3,0.30],[N.F3,0.30],
  [N.D3,0.30],[N.A3,0.30],[N.D3,0.60],[0,0.20],
  [N.D3,0.30],[N.D3,0.30],[N.A3,0.30],[N.F3,0.30],[N.D3,0.30],[N.A3,0.30],[N.F3,0.30],[0,0.15],
];

// Section C — original arpeggiated slop theme: triplet-feel D-minor sweeps
// with tritone color. No Megalovania hook.
const SLOP_MELODY_C = [
  // Triplet arpeggios climbing Dm → Gm → A7 → Dm
  [N.D5,0.13],[N.F5,0.13],[N.A5,0.13],[N.F5,0.13],[N.D5,0.13],[N.F5,0.13],[N.A5,0.26],[0,0.06],
  [N.G4,0.13],[N.Bb4,0.13],[N.D5,0.13],[N.Bb4,0.13],[N.G4,0.13],[N.Bb4,0.13],[N.D5,0.26],[0,0.06],
  [N.A4,0.13],[N.Cs5,0.13],[N.E5,0.13],[N.Cs5,0.13],[N.A4,0.13],[N.Cs5,0.13],[N.E5,0.26],[0,0.06],
  [N.D5,0.13],[N.F5,0.13],[N.A5,0.13],[N.D6,0.26],[N.A5,0.13],[N.F5,0.13],[N.D5,0.26],[0,0.06],
  // Answering motif: staccato call with chromatic neighbor tones
  [N.A5,0.15],[N.G5,0.10],[N.A5,0.15],[N.Bb5,0.15],[N.A5,0.30],[0,0.08],
  [N.F5,0.15],[N.E5,0.10],[N.F5,0.15],[N.G5,0.15],[N.F5,0.30],[0,0.08],
  [N.D5,0.15],[N.Cs5,0.10],[N.D5,0.15],[N.E5,0.15],[N.F5,0.30],[0,0.08],
  [N.A4,0.15],[N.D5,0.15],[N.F5,0.30],[N.A5,0.50],[0,0.12],
  // Tritone punch + resolution
  [N.Eb5,0.18],[N.A4,0.18],[N.Eb5,0.18],[N.A5,0.36],[0,0.10],
  [N.D5,0.20],[N.F5,0.20],[N.A5,0.20],[N.D6,0.50],[0,0.12],
  [N.Cs6 || N.D6,0.18],[N.D6,0.18],[N.A5,0.18],[N.F5,0.36],[N.D5,0.55],[0,0.15],
];

const SLOP_BASS_C = [
  // Walking bass under the arpeggios
  [N.D3,0.26],[N.A3,0.26],[N.F3,0.26],[N.A3,0.26],
  [N.G3,0.26],[N.D3,0.26],[N.Bb2,0.26],[N.D3,0.26],
  [N.A2,0.26],[N.E3,0.26],[N.Cs4,0.26],[N.E3,0.26],
  [N.D3,0.26],[N.A3,0.26],[N.F3,0.26],[N.A3,0.26],
  [N.D3,0.30],[N.A3,0.30],[N.F3,0.30],[N.D3,0.38],
  [N.F3,0.30],[N.C4,0.30],[N.A3,0.30],[N.F3,0.38],
  [N.D3,0.30],[N.F3,0.30],[N.Cs4,0.30],[N.A3,0.38],
  [N.A2,0.30],[N.D3,0.30],[N.F3,0.30],[N.A3,0.50],
  [N.Eb3,0.18],[N.A2,0.18],[N.Eb3,0.18],[N.A2,0.36],[0,0.10],
  [N.D3,0.20],[N.F3,0.20],[N.A3,0.20],[N.D3,0.50],[0,0.12],
  [N.A2,0.18],[N.D3,0.18],[N.A3,0.18],[N.F3,0.36],[N.D3,0.55],[0,0.15],
];

// Section D — original urgent slop chase: syncopated call/answer, Phrygian flavor
const SLOP_MELODY_D = [
  // Chase motif in D Phrygian (uses Eb for distinctive tension)
  [N.D5,0.12],[N.Eb5,0.12],[N.F5,0.12],[N.E5 || N.F5,0.12],[N.D5,0.24],[0,0.06],
  [N.F5,0.12],[N.G5,0.12],[N.A5,0.12],[N.G5,0.12],[N.F5,0.24],[0,0.06],
  [N.A5,0.12],[N.Bb5,0.12],[N.C6,0.12],[N.Bb5,0.12],[N.A5,0.24],[0,0.06],
  [N.F5,0.12],[N.A5,0.12],[N.D6,0.24],[N.Bb5,0.12],[N.A5,0.30],[0,0.08],
  // Syncopated answer
  [N.G5,0.10],[N.A5,0.20],[N.G5,0.10],[N.F5,0.20],[N.E5,0.10],[N.D5,0.30],[0,0.08],
  [N.A4,0.10],[N.D5,0.20],[N.F5,0.10],[N.A5,0.20],[N.D6,0.10],[N.A5,0.30],[0,0.08],
  // Climb to climax — ascending scale in thirds
  [N.D5,0.10],[N.F5,0.10],[N.E5,0.10],[N.G5,0.10],[N.F5,0.10],[N.A5,0.10],[N.G5,0.10],[N.Bb5,0.10],[0,0.06],
  [N.A5,0.10],[N.C6,0.10],[N.Bb5,0.10],[N.D6,0.10],[N.C6,0.10],[N.E6,0.10],[N.D6,0.10],[N.F5,0.10],[0,0.06],
  // Landing
  [N.A5,0.22],[0,0.06],[N.F5,0.22],[0,0.06],[N.D5,0.22],[0,0.06],[N.A4,0.70],[0,0.20],
  [N.D5,0.28],[N.A4,0.28],[N.D5,0.80],[0,0.25],
];

const SLOP_BASS_D = [
  // Syncopated bass pumping root-fifth
  [N.D3,0.12],[N.D3,0.12],[N.A3,0.12],[N.D3,0.12],[N.D3,0.24],[0,0.06],
  [N.F3,0.12],[N.F3,0.12],[N.C4,0.12],[N.F3,0.12],[N.F3,0.24],[0,0.06],
  [N.Bb3,0.12],[N.Bb3,0.12],[N.F3,0.12],[N.Bb3,0.12],[N.Bb3,0.24],[0,0.06],
  [N.D3,0.12],[N.A3,0.12],[N.F3,0.24],[N.D3,0.12],[N.A3,0.30],[0,0.08],
  [N.G3,0.10],[N.G3,0.20],[N.D3,0.10],[N.A3,0.20],[N.E3,0.10],[N.D3,0.30],[0,0.08],
  [N.A2,0.10],[N.D3,0.20],[N.F3,0.10],[N.A3,0.20],[N.D3,0.10],[N.A3,0.30],[0,0.08],
  [N.D3,0.20],[N.F3,0.20],[N.G3,0.20],[N.Bb3,0.20],
  [N.A3,0.20],[N.C4,0.20],[N.D4,0.20],[N.E3,0.20],[0,0.06],
  [N.A2,0.22],[0,0.06],[N.F2,0.22],[0,0.06],[N.D2,0.22],[0,0.06],[N.A2,0.70],[0,0.20],
  [N.D3,0.28],[N.A2,0.28],[N.D2,0.80],[0,0.25],
];

// Joined loop for sloppy music (90s+)
const SLOP_SECTIONS = [
  { mel: SLOP_MELODY_A, bass: SLOP_BASS_A, intensity: 0 },
  { mel: SLOP_MELODY_B, bass: SLOP_BASS_B, intensity: 1 },
  { mel: SLOP_MELODY_C, bass: SLOP_BASS_C, intensity: 2 },
  { mel: SLOP_MELODY_D, bass: SLOP_BASS_D, intensity: 2 },
];

// ── CHILL game music — Super Meat Boy Forest Funk / Burning Squirrel inspired
// G major, warm, funky/syncopated. ~90s.
// Section A: Burning Squirrel-style warm ballad intro (22s)
// Section B: Forest Funk groove lift (23s)
// Section C: Melodic bridge (22s)
// Section D: Return to warm theme + resolution (23s)

const CHILL_MELODY_A = [
  [N.D5,0.60],[0,0.10],[N.G5,0.55],[0,0.10],[N.B5,0.55],[0,0.10],[N.A5,0.45],[0,0.15],
  [N.G5,0.55],[0,0.10],[N.E5,0.55],[0,0.10],[N.D5,0.80],[0,0.20],
  [N.C5,0.55],[0,0.10],[N.E5,0.55],[0,0.10],[N.G5,0.55],[0,0.10],[N.E5,0.45],[0,0.15],
  [N.D5,0.55],[0,0.10],[N.C5,0.55],[0,0.10],[N.D5,0.80],[0,0.20],
  [N.B4,0.55],[0,0.10],[N.D5,0.55],[0,0.10],[N.G5,0.55],[0,0.10],[N.A5,0.45],[0,0.15],
  [N.B5,0.55],[0,0.10],[N.A5,0.55],[0,0.10],[N.G5,0.80],[0,0.30],
  [N.E5,0.55],[0,0.10],[N.D5,0.55],[0,0.10],[N.G5,1.20],[0,0.30],
];

const CHILL_BASS_A = [
  [N.G2,0.80],[N.D3,0.80],[N.B2,0.80],[N.D3,0.80],   // G
  [N.C3,0.80],[N.G3,0.80],[N.E3,0.80],[N.G3,0.80],   // C/Em
  [N.C3,0.80],[N.E3,0.80],[N.G3,0.80],[N.E3,0.80],   // C
  [N.D3,0.80],[N.A3,0.80],[N.Fs3,0.80],[N.A3,0.80],  // D
  [N.G2,0.80],[N.D3,0.80],[N.B2,0.80],[N.D3,0.80],   // G
  [N.E3,0.80],[N.B3,0.80],[N.G3,0.80],[N.B3,0.80],   // Em
  [N.C3,0.80],[N.D3,0.80],[N.G2,1.60],                // C-D-G
];

const CHILL_MELODY_B = [
  // Forest Funk syncopated groove (23s)
  [N.G5,0.18],[0,0.06],[N.B5,0.18],[0,0.06],[N.D6,0.30],[N.B5,0.18],[N.G5,0.30],[0,0.10],
  [N.A5,0.18],[0,0.06],[N.C6,0.18],[0,0.06],[N.E6,0.30],[N.C6,0.18],[N.A5,0.30],[0,0.10],
  [N.G5,0.18],[0,0.06],[N.B5,0.18],[0,0.06],[N.D6,0.30],[N.B5,0.18],[N.G5,0.30],[0,0.10],
  [N.Fs5,0.18],[N.G5,0.18],[N.A5,0.18],[N.B5,0.36],[N.A5,0.18],[N.G5,0.36],[0,0.10],
  // Syncopated answer
  [N.B5,0.15],[N.A5,0.15],[N.G5,0.15],[N.E5,0.30],[0,0.08],
  [N.D5,0.15],[N.E5,0.15],[N.G5,0.15],[N.A5,0.30],[0,0.08],
  [N.B5,0.15],[N.D6,0.15],[N.B5,0.15],[N.A5,0.30],[N.G5,0.40],[0,0.12],
  [N.E5,0.15],[N.Fs5,0.15],[N.G5,0.15],[N.A5,0.15],[N.B5,0.15],[N.C6,0.15],[N.D6,0.60],[0,0.15],
  // Call
  [N.D6,0.18],[N.B5,0.18],[N.G5,0.18],[N.D5,0.36],[0,0.10],
  [N.E5,0.18],[N.G5,0.18],[N.B5,0.18],[N.D6,0.36],[0,0.10],
  [N.C6,0.30],[N.B5,0.30],[N.A5,0.30],[N.G5,0.60],[0,0.20],
];

const CHILL_BASS_B = [
  // Syncopated walking bass — funk feel
  [N.G2,0.24],[0,0.08],[N.G2,0.16],[N.D3,0.24],[0,0.08],[N.B2,0.24],[0,0.06],
  [N.A2,0.24],[0,0.08],[N.A2,0.16],[N.E3,0.24],[0,0.08],[N.C3,0.24],[0,0.06],
  [N.G2,0.24],[0,0.08],[N.G2,0.16],[N.D3,0.24],[0,0.08],[N.B2,0.24],[0,0.06],
  [N.D3,0.24],[0,0.08],[N.Fs3,0.24],[N.A3,0.24],[0,0.08],[N.D3,0.24],[0,0.06],
  [N.C3,0.30],[N.G3,0.30],[N.E3,0.30],[N.C3,0.30],
  [N.D3,0.30],[N.A3,0.30],[N.Fs3,0.30],[N.D3,0.30],
  [N.G2,0.30],[N.D3,0.30],[N.B2,0.60],[N.G2,0.30],
  [N.C3,0.30],[N.D3,0.30],[N.G2,0.60],[0,0.15],
  [N.G2,0.50],[N.D3,0.50],[N.B2,0.50],[N.D3,0.50],
  [N.C3,0.50],[N.G3,0.50],[N.E3,0.50],[N.G3,0.50],
  [N.C3,0.60],[N.D3,0.60],[N.G2,1.20],[0,0.20],
];

const CHILL_MELODY_C = [
  // Melodic bridge — sustained, emotional (22s)
  [N.B5,0.70],[0,0.10],[N.A5,0.55],[0,0.10],[N.G5,0.55],[0,0.10],[N.E5,0.70],[0,0.20],
  [N.D5,0.70],[0,0.10],[N.E5,0.55],[0,0.10],[N.G5,0.55],[0,0.10],[N.B5,0.90],[0,0.20],
  [N.C6,0.70],[0,0.10],[N.B5,0.55],[0,0.10],[N.A5,0.55],[0,0.10],[N.G5,0.70],[0,0.20],
  [N.Fs5,0.70],[0,0.10],[N.G5,0.55],[0,0.10],[N.A5,0.55],[0,0.10],[N.D5,0.90],[0,0.20],
  // Lift
  [N.G5,0.40],[N.B5,0.40],[N.D6,0.40],[N.B5,0.40],[N.G5,0.40],[0,0.15],
  [N.E5,0.40],[N.G5,0.40],[N.A5,0.40],[N.G5,0.40],[N.E5,0.40],[0,0.20],
];

const CHILL_BASS_C = [
  [N.E3,0.90],[N.B3,0.90],[N.G3,0.90],[N.B3,0.90],   // Em
  [N.G3,0.90],[N.D3,0.90],[N.B2,0.90],[N.D3,0.90],   // G
  [N.A3,0.90],[N.E3,0.90],[N.C3,0.90],[N.E3,0.90],   // Am
  [N.D3,0.90],[N.A3,0.90],[N.Fs3,0.90],[N.A3,0.90],  // D
  [N.G2,0.50],[N.D3,0.50],[N.B2,0.50],[N.G2,0.50],
  [N.C3,0.50],[N.G3,0.50],[N.E3,0.50],[N.C3,0.50],
];

const CHILL_MELODY_D = [
  // Warm resolution (23s)
  [N.D5,0.55],[0,0.10],[N.G5,0.55],[0,0.10],[N.B5,0.55],[0,0.10],[N.D6,0.70],[0,0.20],
  [N.C6,0.55],[0,0.10],[N.B5,0.55],[0,0.10],[N.A5,0.55],[0,0.10],[N.G5,0.70],[0,0.20],
  [N.Fs5,0.55],[0,0.10],[N.G5,0.55],[0,0.10],[N.A5,0.55],[0,0.10],[N.D5,0.70],[0,0.20],
  [N.G5,0.55],[0,0.10],[N.B5,0.55],[0,0.10],[N.G5,0.55],[0,0.10],[N.D5,0.90],[0,0.30],
  [N.D5,0.30],[N.E5,0.30],[N.G5,0.30],[N.B5,0.30],[N.G5,0.30],[0,0.10],
  [N.E5,0.30],[N.D5,0.30],[N.C5,0.30],[N.D5,0.30],[N.G5,0.60],[0,0.30],
  [N.B4,0.40],[N.D5,0.40],[N.G5,1.60],[0,0.40],
];

const CHILL_BASS_D = [
  [N.G2,0.80],[N.D3,0.80],[N.B2,0.80],[N.D3,0.80],
  [N.C3,0.80],[N.G3,0.80],[N.E3,0.80],[N.C3,0.80],
  [N.D3,0.80],[N.A3,0.80],[N.Fs3,0.80],[N.A3,0.80],
  [N.G2,0.80],[N.D3,0.80],[N.B2,0.80],[N.G2,0.80],
  [N.G2,0.40],[N.B2,0.40],[N.D3,0.40],[N.G3,0.40],[N.D3,0.40],
  [N.C3,0.40],[N.E3,0.40],[N.G3,0.40],[N.E3,0.40],[N.G3,0.60],[0,0.30],
  [N.D3,0.40],[N.Fs3,0.40],[N.G2,1.80],[0,0.20],
];

const CHILL_SECTIONS = [
  { mel: CHILL_MELODY_A, bass: CHILL_BASS_A, intensity: 0 },
  { mel: CHILL_MELODY_B, bass: CHILL_BASS_B, intensity: 2 },
  { mel: CHILL_MELODY_C, bass: CHILL_BASS_C, intensity: 1 },
  { mel: CHILL_MELODY_D, bass: CHILL_BASS_D, intensity: 1 },
];

// ── IRON mode music — 3-minute epic (combines Undertale + Meat Boy moods) ──
// Section 1: Slow ominous intro (Ruins mood)            ~30s
// Section 2: Warm counter-theme (Burning Squirrel feel) ~30s
// Section 3: Tension build (walking bass)               ~30s
// Section 4: Funk/forest groove                         ~30s
// Section 5: Megalovania-style climax                   ~30s
// Section 6: Resolution, warm outro                     ~30s
// Total ~180s. Reuses all section arrays above plus two unique new ones.

const IRON_INTRO_MEL = [
  // Haunting slow ascending motif, A minor (30s)
  [N.A4,1.0],[0,0.15],[N.C5,1.0],[0,0.15],[N.E5,1.4],[0,0.30],
  [N.A5,1.4],[0,0.20],[N.G5,1.0],[0,0.15],[N.E5,1.0],[0,0.20],
  [N.D5,1.0],[0,0.15],[N.F5,1.0],[0,0.15],[N.A5,1.4],[0,0.30],
  [N.G5,1.2],[0,0.15],[N.F5,1.0],[0,0.15],[N.E5,1.4],[0,0.30],
  [N.A4,1.0],[0,0.15],[N.B4,1.0],[0,0.15],[N.C5,1.4],[0,0.30],
  [N.E5,1.2],[0,0.15],[N.D5,1.0],[0,0.15],[N.A4,1.6],[0,0.40],
];

const IRON_INTRO_BASS = [
  [N.A2,1.5],[N.E3,1.5],
  [N.F2,1.5],[N.C3,1.5],
  [N.D3,1.5],[N.A3,1.5],
  [N.E3,1.5],[N.B3,1.5],
  [N.A2,1.5],[N.E3,1.5],
  [N.F2,1.5],[N.G2,1.5],
  [N.A2,1.5],[N.E3,1.5],
  [N.D3,1.5],[N.A2,1.5],
  [N.F2,1.5],[N.G2,1.5],
  [N.A2,3.0],
];

const IRON_OUTRO_MEL = [
  // Triumphant resolution theme (30s)
  [N.C5,0.50],[N.E5,0.50],[N.G5,0.80],[0,0.15],
  [N.A5,0.80],[N.G5,0.50],[N.E5,0.50],[0,0.15],
  [N.F5,0.50],[N.A5,0.50],[N.C6,0.80],[0,0.15],
  [N.B5,0.80],[N.A5,0.50],[N.G5,0.50],[0,0.15],
  [N.E5,0.50],[N.G5,0.50],[N.B5,0.80],[0,0.15],
  [N.C6,0.80],[N.B5,0.50],[N.A5,0.50],[0,0.15],
  [N.G5,0.50],[N.F5,0.50],[N.E5,0.80],[0,0.15],
  [N.D5,0.80],[N.C5,1.60],[0,0.40],
  // Final cadence
  [N.G5,0.40],[N.A5,0.40],[N.B5,0.40],[N.C6,1.20],[0,0.40],
  [N.E5,0.40],[N.G5,0.40],[N.C5,2.00],[0,0.50],
];

const IRON_OUTRO_BASS = [
  [N.C3,0.95],[N.E3,0.95],
  [N.F3,0.95],[N.C3,0.95],
  [N.F3,0.95],[N.A3,0.95],
  [N.G3,0.95],[N.D3,0.95],
  [N.C3,0.95],[N.G3,0.95],
  [N.F3,0.95],[N.A3,0.95],
  [N.C3,0.95],[N.E3,0.95],
  [N.G3,0.95],[N.C3,1.95],
  [N.G3,0.40],[N.A3,0.40],[N.B3,0.40],[N.C4,1.20],[0,0.40],
  [N.E3,0.40],[N.G3,0.40],[N.C3,2.00],[0,0.50],
];

const IRON_SECTIONS = [
  { mel: IRON_INTRO_MEL, bass: IRON_INTRO_BASS, intensity: 0, kind: 'intro' },
  { mel: CHILL_MELODY_A, bass: CHILL_BASS_A, intensity: 0, kind: 'chill' },
  { mel: SLOP_MELODY_B, bass: SLOP_BASS_B, intensity: 1, kind: 'slop' },
  { mel: CHILL_MELODY_B, bass: CHILL_BASS_B, intensity: 2, kind: 'chill' },
  { mel: SLOP_MELODY_D, bass: SLOP_BASS_D, intensity: 2, kind: 'slop' },
  { mel: IRON_OUTRO_MEL, bass: IRON_OUTRO_BASS, intensity: 1, kind: 'outro' },
];

// ── BOSS music (unchanged mood) ────────────────────────────────────────────
const BOSS_MELODY = [
  [N.A4,0.09],[0,0.03],[N.A4,0.09],[N.Eb5,0.12],[N.D5,0.09],[N.A4,0.09],[0,0.03],
  [N.G4,0.09],[0,0.03],[N.G4,0.09],[N.E5,0.12],[N.D5,0.09],[N.C5,0.09],[0,0.03],
  [N.F4,0.09],[0,0.03],[N.F4,0.09],[N.Bb4,0.12],[N.A4,0.09],[N.G4,0.09],[0,0.03],
  [N.E4,0.12],[0,0.03],[N.E4,0.09],[N.G4,0.09],[N.A4,0.09],[N.Bb4,0.09],[0,0.03],
  [N.A5,0.09],[N.Ab5,0.09],[N.G5,0.09],[N.Fs5,0.09],[N.F5,0.09],[N.E5,0.09],[0,0.03],
  [N.Eb5,0.09],[N.D5,0.09],[N.Cs5,0.09],[N.C5,0.09],[N.B4,0.09],[N.A4,0.09],[0,0.03],
  [N.G4,0.09],[N.A4,0.09],[N.B4,0.09],[N.Cs5,0.09],[N.Eb5,0.09],[0,0.03],
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

// ── TITLE SCREEN music ──────────────────────────────────────────────────────
// Sloppy title — original D-minor arcade fanfare with Ruins-style arpeggios
// leading to a punchy tritone-colored hook. Undertale flavor, original pattern.
const TITLE_SLOPPY_MELODY = [
  // Phrase 1: ascending D-minor arpeggios (Ruins feel but faster)
  [N.D5,0.12],[N.F5,0.12],[N.A5,0.12],[N.D6,0.22],[N.A5,0.12],[N.F5,0.12],[0,0.06],
  [N.G4,0.12],[N.Bb4,0.12],[N.D5,0.12],[N.G5,0.22],[N.D5,0.12],[N.Bb4,0.12],[0,0.06],
  // Phrase 2: call with chromatic tension
  [N.A5,0.15],[N.G5,0.15],[N.F5,0.15],[N.E5,0.15],[N.F5,0.30],[0,0.08],
  [N.Eb5,0.15],[N.F5,0.15],[N.A5,0.30],[N.Eb5,0.18],[0,0.08],
  // Phrase 3: descending flourish
  [N.D6,0.12],[N.Bb5,0.12],[N.A5,0.12],[N.F5,0.12],[N.D5,0.24],[0,0.06],
  [N.Cs5,0.12],[N.E5,0.12],[N.G5,0.12],[N.A5,0.30],[0,0.08],
  // Phrase 4: tritone resolution cadence
  [N.A5,0.18],[N.Eb5,0.14],[N.A4,0.22],[N.D5,0.50],[0,0.12],
];
const TITLE_SLOPPY_BASS = [
  [N.D3,0.24],[N.A3,0.24],[N.F3,0.24],[N.A3,0.24],
  [N.G3,0.24],[N.D3,0.24],[N.Bb2,0.24],[N.D3,0.24],
  [N.F3,0.30],[N.A3,0.30],[N.C4,0.30],[N.F3,0.30],
  [N.Bb2,0.30],[N.F3,0.30],[N.Bb3,0.56],
  [N.D3,0.24],[N.F3,0.24],[N.A3,0.24],[N.D3,0.24],[N.A2,0.30],
  [N.A2,0.24],[N.E3,0.24],[N.G3,0.24],[N.A3,0.30],[0,0.08],
  [N.A2,0.18],[N.Eb3,0.14],[N.A2,0.22],[N.D3,0.50],[0,0.12],
];

// Chill title — Meat Boy "Forest Funk" style, syncopated major-key groove (~14s)
const TITLE_CHILL_MELODY = [
  // Phrase 1 — bright ascending motif
  [N.G5,0.18],[0,0.06],[N.B5,0.18],[0,0.06],[N.D6,0.30],[N.B5,0.18],[N.G5,0.30],[0,0.08],
  // Phrase 2 — bright answer
  [N.A5,0.18],[0,0.06],[N.C6,0.18],[0,0.06],[N.E6,0.30],[N.C6,0.18],[N.A5,0.30],[0,0.08],
  // Phrase 3 — warm Burning Squirrel lift
  [N.B5,0.35],[0,0.08],[N.A5,0.30],[N.G5,0.30],[N.E5,0.55],[0,0.10],
  [N.D5,0.30],[N.E5,0.30],[N.G5,0.30],[N.A5,0.55],[0,0.10],
  // Phrase 4 — funk sixteenth bounce
  [N.B5,0.15],[N.A5,0.15],[N.G5,0.15],[N.D5,0.30],[0,0.08],
  [N.E5,0.15],[N.G5,0.15],[N.A5,0.15],[N.B5,0.30],[0,0.08],
  // Resolution
  [N.D6,0.20],[N.B5,0.20],[N.G5,0.20],[N.D5,0.40],[N.G5,0.80],[0,0.20],
];
const TITLE_CHILL_BASS = [
  // Syncopated funk: G-D skip, C-G skip
  [N.G2,0.24],[0,0.08],[N.G2,0.16],[N.D3,0.24],[0,0.08],[N.B2,0.24],[0,0.06],
  [N.A2,0.24],[0,0.08],[N.A2,0.16],[N.E3,0.24],[0,0.08],[N.C3,0.24],[0,0.06],
  [N.E3,0.43],[N.B3,0.43],[N.G3,0.43],[0,0.10],
  [N.D3,0.43],[N.A3,0.43],[N.Fs3,0.43],[0,0.10],
  [N.G2,0.30],[N.D3,0.30],[N.B2,0.30],[N.D3,0.30],
  [N.C3,0.30],[N.G3,0.30],[N.E3,0.30],[N.G3,0.30],
  [N.D3,0.40],[N.Fs3,0.40],[N.G2,1.20],[0,0.20],
];

// ── Sloppy music playback (multi-section) ───────────────────────────────────
let slopSectionIdx = 0;
const playSlopSection = (scale = tempoScale) => {
  const section = SLOP_SECTIONS[slopSectionIdx % SLOP_SECTIONS.length];
  slopSectionIdx = (slopSectionIdx + 1) % SLOP_SECTIONS.length;
  const ctx = getCtx();
  const now = ctx.currentTime;
  // Combine base speed with urgency scale so the tempo always reflects both.
  const s = scale * SLOP_BASE_SPEED;
  const loopDuration = getArrayDuration(section.mel) / s;

  const gg = getGameGain();
  let t = now;
  for (const [freq, dur] of section.mel) {
    if (freq > 0) playNote(freq, (dur / s) * 0.85, t, 'square', 0.11, gg);
    t += dur / s;
  }
  t = now;
  for (const [freq, dur] of section.bass) {
    if (freq > 0) {
      playNote(freq, (dur / s) * 0.78, t, 'triangle', 0.13, gg);
      if (section.intensity >= 2) playNote(freq, (dur / s) * 0.70, t, 'sawtooth', 0.05, gg);
    }
    t += dur / s;
  }
  // Drums — density scales with intensity
  const kickStep = section.intensity >= 2 ? 0.25 / s : 0.5 / s;
  for (let beat = 0; beat < loopDuration; beat += kickStep) {
    const ko = ctx.createOscillator(); const kg = ctx.createGain();
    ko.type = 'sine';
    ko.frequency.setValueAtTime(160, now + beat);
    ko.frequency.exponentialRampToValueAtTime(0.01, now + beat + 0.18 / s);
    kg.gain.setValueAtTime(section.intensity >= 2 ? 0.32 : 0.22, now + beat);
    kg.gain.exponentialRampToValueAtTime(0.001, now + beat + 0.18 / s);
    ko.connect(kg); kg.connect(gg);
    ko.start(now + beat); ko.stop(now + beat + 0.20 / s);
  }
  // Snare on 2 and 4 (intensity >= 1)
  if (section.intensity >= 1) {
    for (let beat = 0.5 / s; beat < loopDuration; beat += 1.0 / s) {
      const so = ctx.createOscillator(); const sg = ctx.createGain();
      so.type = 'sawtooth'; so.frequency.value = 220;
      sg.gain.setValueAtTime(0.09, now + beat);
      sg.gain.exponentialRampToValueAtTime(0.001, now + beat + 0.10 / s);
      so.connect(sg); sg.connect(gg);
      so.start(now + beat); so.stop(now + beat + 0.12 / s);
    }
  }
  // Hi-hat
  const hatStep = section.intensity >= 2 ? 0.125 / s : 0.25 / s;
  for (let beat = 0; beat < loopDuration; beat += hatStep) {
    const ho = ctx.createOscillator(); const hg = ctx.createGain();
    ho.type = 'square'; ho.frequency.value = 7200;
    hg.gain.setValueAtTime(0.020, now + beat);
    hg.gain.exponentialRampToValueAtTime(0.001, now + beat + 0.04 / s);
    ho.connect(hg); hg.connect(gg);
    ho.start(now + beat); ho.stop(now + beat + 0.05 / s);
  }
  return loopDuration;
};

// ── Chill music playback (multi-section) ────────────────────────────────────
let chillSectionIdx = 0;
const playChillSection = (scale = tempoScale) => {
  const section = CHILL_SECTIONS[chillSectionIdx % CHILL_SECTIONS.length];
  chillSectionIdx = (chillSectionIdx + 1) % CHILL_SECTIONS.length;
  const ctx = getCtx();
  const now = ctx.currentTime;
  const gg = getGameGain();
  const s = scale * CHILL_BASE_SPEED;
  const loopDuration = getArrayDuration(section.mel) / s;

  // Melody: warm sine + slight detune (chorus) + triangle body on groove
  let t = now;
  for (const [freq, dur] of section.mel) {
    const d = dur / s;
    if (freq > 0) {
      playNote(freq, d * 0.88, t, 'sine', 0.09, gg);
      playNote(freq * 1.003, d * 0.88, t, 'sine', 0.04, gg);
      if (section.intensity >= 2) playNote(freq, d * 0.80, t, 'triangle', 0.035, gg);
    }
    t += d;
  }
  // Bass: triangle + light sawtooth on groove section
  t = now;
  for (const [freq, dur] of section.bass) {
    const d = dur / s;
    if (freq > 0) {
      playNote(freq, d * 0.72, t, 'triangle', 0.11, gg);
      if (section.intensity >= 2) playNote(freq, d * 0.55, t, 'sawtooth', 0.03, gg);
    }
    t += d;
  }
  // Soft shimmer
  for (let beat = 0; beat < loopDuration; beat += 3.0 / s) {
    const ho = ctx.createOscillator(); const hg = ctx.createGain();
    ho.type = 'sine'; ho.frequency.value = 3200;
    hg.gain.setValueAtTime(0.012, now + beat);
    hg.gain.exponentialRampToValueAtTime(0.001, now + beat + 0.30 / s);
    ho.connect(hg); hg.connect(gg);
    ho.start(now + beat); ho.stop(now + beat + 0.32 / s);
  }
  // Kick on the 1-and-3, with extra hi-hats — gives every chill section drive
  for (let beat = 0; beat < loopDuration; beat += 0.80 / s) {
    const ko = ctx.createOscillator(); const kg = ctx.createGain();
    ko.type = 'sine';
    ko.frequency.setValueAtTime(130, now + beat);
    ko.frequency.exponentialRampToValueAtTime(0.01, now + beat + 0.14 / s);
    kg.gain.setValueAtTime(section.intensity >= 2 ? 0.22 : 0.14, now + beat);
    kg.gain.exponentialRampToValueAtTime(0.001, now + beat + 0.14 / s);
    ko.connect(kg); kg.connect(gg);
    ko.start(now + beat); ko.stop(now + beat + 0.16 / s);
  }
  // Off-beat rim tick for groove
  for (let beat = 0.40 / s; beat < loopDuration; beat += 0.80 / s) {
    const so = ctx.createOscillator(); const sg = ctx.createGain();
    so.type = 'triangle'; so.frequency.value = 1200;
    sg.gain.setValueAtTime(section.intensity >= 2 ? 0.06 : 0.035, now + beat);
    sg.gain.exponentialRampToValueAtTime(0.001, now + beat + 0.06 / s);
    so.connect(sg); sg.connect(gg);
    so.start(now + beat); so.stop(now + beat + 0.07 / s);
  }
  // Shaker-style hi-hat fills on all sections to make chill feel moving
  for (let beat = 0; beat < loopDuration; beat += 0.20 / s) {
    const ho = ctx.createOscillator(); const hg = ctx.createGain();
    ho.type = 'square'; ho.frequency.value = 8400;
    hg.gain.setValueAtTime(0.010, now + beat);
    hg.gain.exponentialRampToValueAtTime(0.001, now + beat + 0.03 / s);
    ho.connect(hg); hg.connect(gg);
    ho.start(now + beat); ho.stop(now + beat + 0.04 / s);
  }
  return loopDuration;
};

// ── Iron mode music playback (multi-section epic) ──────────────────────────
let ironSectionIdx = 0;
const playIronSection = (scale = tempoScale) => {
  const section = IRON_SECTIONS[ironSectionIdx % IRON_SECTIONS.length];
  ironSectionIdx = (ironSectionIdx + 1) % IRON_SECTIONS.length;
  const ctx = getCtx();
  const now = ctx.currentTime;
  const gg = getGameGain();
  const s = scale * IRON_BASE_SPEED;
  // NOTE: to avoid rewriting every timing below, we apply the speed by scaling
  // the time offset we advance for each note. Durations use `d / s` everywhere.
  const loopDuration = getArrayDuration(section.mel) / s;
  const isAmbient = section.kind === 'intro' || section.kind === 'outro' || section.kind === 'chill';

  // Melody — sine for ambient sections, square-ish bite for slop
  let t = now;
  for (const [freq, dur] of section.mel) {
    const d = dur / s;
    if (freq > 0) {
      if (isAmbient) {
        playNote(freq, d * 0.88, t, 'sine', 0.10, gg);
        playNote(freq * 1.004, d * 0.88, t, 'sine', 0.04, gg);
      } else {
        playNote(freq, d * 0.82, t, 'square', 0.10, gg);
        playNote(freq * 0.5, d * 0.80, t, 'triangle', 0.04, gg);
      }
    }
    t += d;
  }
  // Bass
  t = now;
  for (const [freq, dur] of section.bass) {
    const d = dur / s;
    if (freq > 0) {
      playNote(freq, d * 0.74, t, 'triangle', 0.12, gg);
      if (!isAmbient && section.intensity >= 2) playNote(freq, d * 0.65, t, 'sawtooth', 0.05, gg);
    }
    t += d;
  }
  // Drums only in non-intro sections
  if (!isAmbient) {
    for (let beat = 0; beat < loopDuration; beat += 0.5 / s) {
      const ko = ctx.createOscillator(); const kg = ctx.createGain();
      ko.type = 'sine';
      ko.frequency.setValueAtTime(155, now + beat);
      ko.frequency.exponentialRampToValueAtTime(0.01, now + beat + 0.16 / s);
      kg.gain.setValueAtTime(section.intensity >= 2 ? 0.30 : 0.22, now + beat);
      kg.gain.exponentialRampToValueAtTime(0.001, now + beat + 0.16 / s);
      ko.connect(kg); kg.connect(gg);
      ko.start(now + beat); ko.stop(now + beat + 0.18 / s);
    }
    if (section.intensity >= 1) {
      for (let beat = 0.25 / s; beat < loopDuration; beat += 0.5 / s) {
        const ho = ctx.createOscillator(); const hg = ctx.createGain();
        ho.type = 'square'; ho.frequency.value = 6200;
        hg.gain.setValueAtTime(0.016, now + beat);
        hg.gain.exponentialRampToValueAtTime(0.001, now + beat + 0.04 / s);
        ho.connect(hg); hg.connect(gg);
        ho.start(now + beat); ho.stop(now + beat + 0.05 / s);
      }
    }
  } else {
    // Ambient: soft pad shimmer
    for (let beat = 0; beat < loopDuration; beat += 4.0 / s) {
      const ho = ctx.createOscillator(); const hg = ctx.createGain();
      ho.type = 'sine'; ho.frequency.value = 2600;
      hg.gain.setValueAtTime(0.012, now + beat);
      hg.gain.exponentialRampToValueAtTime(0.001, now + beat + 1.5 / s);
      ho.connect(hg); hg.connect(gg);
      ho.start(now + beat); ho.stop(now + beat + 1.6 / s);
    }
  }
  return loopDuration;
};

// ── Boss music playback ─────────────────────────────────────────────────────
const playBossBar = () => {
  const ctx = getCtx();
  const now = ctx.currentTime;
  const loopDuration = getArrayDuration(BOSS_MELODY);
  const gg = getGameGain();

  let t = now;
  for (const [freq, dur] of BOSS_MELODY) {
    if (freq > 0) playNote(freq, dur * 0.75, t, 'sawtooth', 0.13, gg);
    t += dur;
  }
  t = now;
  for (const [freq, dur] of BOSS_BASS) {
    if (freq > 0) {
      playNote(freq, dur * 0.70, t, 'triangle', 0.22, gg);
      playNote(freq, dur * 0.68, t, 'sawtooth', 0.07, gg);
    }
    t += dur;
  }
  const drone = ctx.createOscillator(); const droneG = ctx.createGain();
  drone.type = 'sawtooth'; drone.frequency.value = N.A2;
  droneG.gain.setValueAtTime(0.09, now);
  droneG.gain.setValueAtTime(0.06, now + loopDuration * 0.5);
  droneG.gain.setValueAtTime(0.09, now + loopDuration - 0.1);
  drone.connect(droneG); droneG.connect(gg);
  drone.start(now); drone.stop(now + loopDuration);

  for (let beat = 0.48; beat < loopDuration; beat += 0.96) {
    const s = ctx.createOscillator(); const sg = ctx.createGain();
    s.type = 'square'; s.frequency.value = N.Eb3;
    sg.gain.setValueAtTime(0.06, now + beat);
    sg.gain.exponentialRampToValueAtTime(0.001, now + beat + 0.08);
    s.connect(sg); sg.connect(gg);
    s.start(now + beat); s.stop(now + beat + 0.09);
  }
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
  for (let beat = 0.48; beat < loopDuration; beat += 0.96) {
    const so = ctx.createOscillator(); const sg = ctx.createGain();
    so.type = 'square'; so.frequency.value = 260;
    sg.gain.setValueAtTime(0.22, now + beat);
    sg.gain.exponentialRampToValueAtTime(0.001, now + beat + 0.06);
    so.connect(sg); sg.connect(gg);
    so.start(now + beat); so.stop(now + beat + 0.07);
  }
  for (let beat = 0; beat < loopDuration; beat += 0.06) {
    const ho = ctx.createOscillator(); const hg = ctx.createGain();
    ho.type = 'square'; ho.frequency.value = 11000;
    hg.gain.setValueAtTime(0.018, now + beat);
    hg.gain.exponentialRampToValueAtTime(0.001, now + beat + 0.018);
    ho.connect(hg); hg.connect(gg);
    ho.start(now + beat); ho.stop(now + beat + 0.02);
  }
};

// ── Section-based loop managers ─────────────────────────────────────────────
const scheduleNext = (intervalVarName, playFn, keepPlayingGetter) => {
  // Chain sections by scheduling the next one when the current section ends.
  const dur = playFn();
  const ms = dur * 1000;
  const id = setTimeout(() => {
    if (!keepPlayingGetter()) return;
    scheduleNext(intervalVarName, playFn, keepPlayingGetter);
  }, ms);
  // Store the timeout id the same way as old intervals so stopMusic clears it
  if (intervalVarName === 'music') musicInterval = id;
  else if (intervalVarName === 'boss') bossMusicInterval = id;
  else if (intervalVarName === 'title') titleMusicInterval = id;
  else if (intervalVarName === 'summary') summaryMusicInterval = id;
  else if (intervalVarName === 'inverse') inverseMusicInterval = id;
};

// keepSection: when true, don't reset the section index (used for tempo-change
// restarts so the music picks up where it left off at the new tempo).
const restartSlopLoop = (scale, keepSection = false) => {
  if (musicInterval) { clearTimeout(musicInterval); clearInterval(musicInterval); musicInterval = null; }
  if (!keepSection) slopSectionIdx = 0;
  if (gameGain) { gameGain.disconnect(); gameGain = null; }
  scheduleNext('music', () => playSlopSection(scale), () => isMusicPlaying);
};

const restartChillLoop = (scale = 1.0, keepSection = false) => {
  if (musicInterval) { clearTimeout(musicInterval); clearInterval(musicInterval); musicInterval = null; }
  if (!keepSection) chillSectionIdx = 0;
  if (gameGain) { gameGain.disconnect(); gameGain = null; }
  scheduleNext('music', () => playChillSection(scale), () => isMusicPlaying);
};

const restartIronLoop = (scale = 1.0, keepSection = false) => {
  if (musicInterval) { clearTimeout(musicInterval); clearInterval(musicInterval); musicInterval = null; }
  if (!keepSection) ironSectionIdx = 0;
  if (gameGain) { gameGain.disconnect(); gameGain = null; }
  scheduleNext('music', () => playIronSection(scale), () => isMusicPlaying);
};

const restartBossLoop = () => {
  if (bossMusicInterval) { clearTimeout(bossMusicInterval); clearInterval(bossMusicInterval); bossMusicInterval = null; }
  const loopMs = getArrayDuration(BOSS_MELODY) * 1000;
  playBossBar();
  bossMusicInterval = setInterval(() => { if (isBossMusicPlaying) playBossBar(); }, loopMs);
};

// ── Summary / between-rounds music (short loops, kept concise) ───────────────
// Chill summary — Meat Boy-style brief warm hook (~4s)
const SUMMARY_CHILL_MELODY = [
  [N.G5,0.30],[N.B5,0.30],[N.D6,0.45],[0,0.10],
  [N.C6,0.30],[N.B5,0.30],[N.G5,0.55],[0,0.15],
  [N.E5,0.30],[N.G5,0.30],[N.D5,0.55],[0,0.15],
];
const SUMMARY_CHILL_BASS = [
  [N.G3,0.50],[N.D3,0.50],
  [N.C3,0.50],[N.G2,0.50],
  [N.E3,0.50],[N.G2,0.65],
];

// Slop summary — Undertale ruins-ish minor key with dancing D-minor hook (~4s)
const SUMMARY_MELODY = [
  [N.D5,0.10],[N.F5,0.10],[N.A5,0.10],[N.D6,0.18],[0,0.05],
  [N.A5,0.10],[N.G5,0.10],[N.F5,0.10],[N.E5,0.10],[0,0.05],
  [N.F5,0.10],[N.A5,0.10],[N.D6,0.10],[N.A5,0.18],[0,0.05],
  [N.Cs5,0.10],[N.E5,0.10],[N.G5,0.10],[N.A5,0.10],[0,0.05],
  [N.D6,0.14],[N.A5,0.12],[N.F5,0.12],[N.D5,0.34],[0,0.10],
];
const SUMMARY_BASS = [
  [N.D3,0.20],[N.A3,0.20],[N.F3,0.20],[N.A3,0.20],
  [N.Bb2,0.20],[N.F3,0.20],[N.A3,0.20],[N.Bb3,0.20],
  [N.F3,0.20],[N.A3,0.20],[N.D4,0.20],[N.A3,0.23],
  [N.A2,0.20],[N.E3,0.20],[N.A3,0.20],[N.Cs4,0.23],
  [N.D3,0.70],
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

const playChillSummaryBar = () => {
  const ctx = getCtx();
  const now = ctx.currentTime;
  const sg = getSummaryGain();
  let t = now;
  for (const [freq, dur] of SUMMARY_CHILL_MELODY) {
    if (freq > 0) {
      playNote(freq, dur * 0.85, t, 'sine', 0.09, sg);
      playNote(freq * 0.5, dur * 0.80, t, 'sine', 0.04, sg);
    }
    t += dur;
  }
  t = now;
  for (const [freq, dur] of SUMMARY_CHILL_BASS) {
    if (freq > 0) playNote(freq, dur * 0.78, t, 'triangle', 0.11, sg);
    t += dur;
  }
};

const playSlopSummaryBar = () => {
  const ctx = getCtx();
  const now = ctx.currentTime;
  const sg = getSummaryGain();
  let t = now;
  for (const [freq, dur] of SUMMARY_MELODY) {
    if (freq > 0) {
      playNote(freq, dur * 0.82, t, 'square', 0.10, sg);
      playNote(freq * 0.5, dur * 0.78, t, 'triangle', 0.05, sg);
    }
    t += dur;
  }
  t = now;
  for (const [freq, dur] of SUMMARY_BASS) {
    if (freq > 0) playNote(freq, dur * 0.72, t, 'triangle', 0.13, sg);
    t += dur;
  }
  const loopDuration = getArrayDuration(SUMMARY_MELODY);
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

const playSummaryBar = () => {
  if (currentMusicStyle === 'pleasant') playChillSummaryBar();
  else playSlopSummaryBar();
};

const restartSummaryLoop = () => {
  if (summaryMusicInterval) { clearInterval(summaryMusicInterval); clearTimeout(summaryMusicInterval); summaryMusicInterval = null; }
  const melody = currentMusicStyle === 'pleasant' ? SUMMARY_CHILL_MELODY : SUMMARY_MELODY;
  const loopMs = getArrayDuration(melody) * 1000;
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
  const curGain = sg.gain.value;
  sg.gain.setValueAtTime(curGain, ctx.currentTime);
  if (curGain < 0.9) {
    sg.gain.linearRampToValueAtTime(1.0, ctx.currentTime + 0.12);
  }
  if (!summaryMusicInterval) restartSummaryLoop();
};

export const stopSummaryMusic = () => {
  isSummaryMusicPlaying = false;
  if (summaryMusicInterval) { clearInterval(summaryMusicInterval); clearTimeout(summaryMusicInterval); summaryMusicInterval = null; }
  if (summaryGain) {
    const sg = summaryGain;
    summaryGain = null;
    const ctx = getCtx();
    sg.gain.cancelScheduledValues(ctx.currentTime);
    sg.gain.setValueAtTime(sg.gain.value, ctx.currentTime);
    sg.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.015);
    setTimeout(() => { try { sg.disconnect(); } catch (e) {} }, 25);
  }
};

// ── Inverse mode music ──────────────────────────────────────────────────────
const INVERSE_MELODY = [
  [N.A5,0.22],[0,0.06],[N.F5,0.18],[N.D5,0.18],[N.C5,0.18],[N.A4,0.44],[0,0.12],
  [N.G4,0.14],[N.Bb4,0.14],[N.D5,0.14],[N.G5,0.36],[0,0.10],
  [N.F5,0.14],[N.D5,0.14],[N.Bb4,0.28],[0,0.10],
  [N.E5,0.20],[N.Cs5,0.16],[N.A4,0.16],[N.G4,0.16],[N.Eb4,0.38],[0,0.12],
  [N.D5,0.22],[N.F5,0.18],[N.A5,0.18],[N.F5,0.18],[N.D5,0.50],[0,0.12],
];
const INVERSE_BASS = [
  [N.D3,0.35],[N.A3,0.35],[N.F3,0.35],[N.D3,0.33],
  [N.G3,0.39],[N.D3,0.39],[N.Bb3,0.38],[N.G3,0.38],
  [N.A3,0.30],[N.E3,0.30],[N.Cs4,0.30],[N.A3,0.28],
  [N.D3,0.35],[N.F3,0.35],[N.A3,0.35],[N.D3,0.35],
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
  let t = now;
  for (const [freq, dur] of INVERSE_MELODY) {
    if (freq > 0) {
      playNote(freq, dur * 0.88, t, 'sine', 0.11, ig);
      playNote(freq * 1.006, dur * 0.85, t, 'sine', 0.04, ig);
      playNote(freq * 0.5, dur * 0.80, t, 'sine', 0.03, ig);
    }
    t += dur;
  }
  t = now;
  for (const [freq, dur] of INVERSE_BASS) {
    if (freq > 0) playNote(freq, dur * 0.75, t, 'triangle', 0.12, ig);
    t += dur;
  }
  const padChords = [
    { start: 0,    dur: 1.38, notes: [N.D3, N.F3, N.A3] },
    { start: 1.38, dur: 1.54, notes: [N.G3, N.Bb3, N.D4] },
    { start: 2.92, dur: 1.18, notes: [N.A3, N.Cs4, N.E4] },
    { start: 4.10, dur: 1.40, notes: [N.D3, N.F3, N.A3] },
  ];
  for (const pad of padChords) {
    for (const f of pad.notes) {
      playNote(f, pad.dur * 0.88, now + pad.start, 'sine', 0.022, ig);
    }
  }
};

const restartInverseLoop = () => {
  if (inverseMusicInterval) { clearInterval(inverseMusicInterval); clearTimeout(inverseMusicInterval); inverseMusicInterval = null; }
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
    ig.gain.linearRampToValueAtTime(1.0, ctx.currentTime + 0.01);
    restartInverseLoop();
  });
};

export const stopInverseMusic = () => {
  isInverseMusicPlaying = false;
  if (inverseMusicInterval) { clearInterval(inverseMusicInterval); clearTimeout(inverseMusicInterval); inverseMusicInterval = null; }
  if (inverseGain) {
    const ig = inverseGain;
    inverseGain = null;
    const ctx = getCtx();
    ig.gain.cancelScheduledValues(ctx.currentTime);
    ig.gain.setValueAtTime(ig.gain.value, ctx.currentTime);
    ig.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.015);
    setTimeout(() => { try { ig.disconnect(); } catch (e) {} }, 25);
  }
};

// ── Title music playback ────────────────────────────────────────────────────
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
  for (let beat = 0; beat < loopDuration; beat += 0.50) {
    const ko = ctx.createOscillator(); const kg = ctx.createGain();
    ko.type = 'sine';
    ko.frequency.setValueAtTime(155, now + beat);
    ko.frequency.exponentialRampToValueAtTime(0.01, now + beat + 0.20);
    kg.gain.setValueAtTime(0.26, now + beat);
    kg.gain.exponentialRampToValueAtTime(0.001, now + beat + 0.20);
    ko.connect(kg); kg.connect(tg);
    ko.start(now + beat); ko.stop(now + beat + 0.22);
  }
  for (let beat = 0.25; beat < loopDuration; beat += 0.50) {
    const so = ctx.createOscillator(); const sg = ctx.createGain();
    so.type = 'sawtooth'; so.frequency.value = 220;
    sg.gain.setValueAtTime(0.07, now + beat);
    sg.gain.exponentialRampToValueAtTime(0.001, now + beat + 0.09);
    so.connect(sg); sg.connect(tg);
    so.start(now + beat); so.stop(now + beat + 0.10);
  }
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

  let t = now;
  for (const [freq, dur] of TITLE_CHILL_MELODY) {
    if (freq > 0) {
      playNote(freq, dur * 0.86, t, 'sine', 0.10, tg);
      playNote(freq * 1.004, dur * 0.86, t, 'sine', 0.04, tg);
    }
    t += dur;
  }
  t = now;
  for (const [freq, dur] of TITLE_CHILL_BASS) {
    if (freq > 0) playNote(freq, dur * 0.72, t, 'triangle', 0.10, tg);
    t += dur;
  }
  // Soft shimmer
  for (let beat = 0; beat < loopDuration; beat += 2.5) {
    const ho = ctx.createOscillator(); const hg = ctx.createGain();
    ho.type = 'sine'; ho.frequency.value = 2800;
    hg.gain.setValueAtTime(0.010, now + beat);
    hg.gain.exponentialRampToValueAtTime(0.001, now + beat + 0.40);
    ho.connect(hg); hg.connect(tg);
    ho.start(now + beat); ho.stop(now + beat + 0.42);
  }
};

const restartTitleSloppyLoop = () => {
  if (titleMusicInterval) { clearInterval(titleMusicInterval); clearTimeout(titleMusicInterval); titleMusicInterval = null; }
  const loopMs = getArrayDuration(TITLE_SLOPPY_MELODY) * 1000;
  playTitleSloppyBar();
  titleMusicInterval = setInterval(() => { if (isTitleMusicPlaying) playTitleSloppyBar(); }, loopMs);
};

const restartTitleChillLoop = () => {
  if (titleMusicInterval) { clearInterval(titleMusicInterval); clearTimeout(titleMusicInterval); titleMusicInterval = null; }
  const loopMs = getArrayDuration(TITLE_CHILL_MELODY) * 1000;
  playTitleChillBar();
  titleMusicInterval = setInterval(() => { if (isTitleMusicPlaying) playTitleChillBar(); }, loopMs);
};

// ── Public API ──────────────────────────────────────────────────────────────
const withRunningCtx = (fn) => {
  const ctx = getCtx();
  if (ctx.state === 'running') { fn(); return; }
  ctx.resume().then(() => fn()).catch(() => {});
};

export const startMusic = () => {
  if (isMusicPlaying) return;
  isMusicPlaying = true;
  withRunningCtx(() => {
    if (!isMusicPlaying) return;
    if (isIronMode) restartIronLoop(tempoScale);
    else if (currentMusicStyle === 'pleasant') restartChillLoop(tempoScale);
    else restartSlopLoop(tempoScale);
  });
};

export const stopMusic = () => {
  isMusicPlaying = false;
  isBossMusicPlaying = false;
  tempoScale = 1.0;
  if (musicInterval) { clearInterval(musicInterval); clearTimeout(musicInterval); musicInterval = null; }
  if (bossMusicInterval) { clearInterval(bossMusicInterval); clearTimeout(bossMusicInterval); bossMusicInterval = null; }
  if (gameGain) { gameGain.disconnect(); gameGain = null; }
};

export const startTitleMusic = () => {
  if (isTitleMusicPlaying) {
    if (audioCtx && audioCtx.state !== 'running') audioCtx.resume().catch(() => {});
    return;
  }
  isTitleMusicPlaying = true;
  if (titleGain) { titleGain.disconnect(); titleGain = null; }
  withRunningCtx(() => {
    if (!isTitleMusicPlaying) return;
    const ctx = getCtx();
    const tg = getTitleGain();
    tg.gain.setValueAtTime(0.0001, ctx.currentTime);
    tg.gain.linearRampToValueAtTime(1.0, ctx.currentTime + 0.15);
    if (currentMusicStyle === 'pleasant') restartTitleChillLoop();
    else restartTitleSloppyLoop();
  });
};

export const stopTitleMusic = () => {
  isTitleMusicPlaying = false;
  if (titleMusicInterval) { clearInterval(titleMusicInterval); clearTimeout(titleMusicInterval); titleMusicInterval = null; }
  if (titleGain) {
    const ctx = getCtx();
    const tg = titleGain;
    titleGain = null;
    tg.gain.cancelScheduledValues(ctx.currentTime);
    tg.gain.setValueAtTime(tg.gain.value, ctx.currentTime);
    tg.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.06);
    setTimeout(() => { try { tg.disconnect(); } catch (e) {} }, 80);
  }
};

export const startBossMusic = () => {
  isMusicPlaying = false;
  if (musicInterval) { clearInterval(musicInterval); clearTimeout(musicInterval); musicInterval = null; }
  if (gameGain) { gameGain.disconnect(); gameGain = null; }
  stopInverseMusic();
  isBossMusicPlaying = true;
  withRunningCtx(() => { if (isBossMusicPlaying) restartBossLoop(); });
};

// Speed up / slow down the active game-music tempo. Applies to slop, chill,
// and iron modes. Boss music ignores this (it has its own feel).
export const setMusicTempo = (scale) => {
  if (isBossMusicPlaying) return;
  if (Math.abs(tempoScale - scale) < 0.01 || !isMusicPlaying) return;
  tempoScale = scale;
  if (isIronMode) restartIronLoop(scale, true);
  else if (currentMusicStyle === 'pleasant') restartChillLoop(scale, true);
  else restartSlopLoop(scale, true);
};

export const setMusicVolume = (vol) => {
  if (masterGain) masterGain.gain.value = vol;
};

// ── Countdown sounds ────────────────────────────────────────────────────────
const COUNTDOWN_FREQS = { 5: N.A3, 4: N.B3, 3: N.D4, 2: N.E4, 1: N.G4 };

export const playCountdownTick = (num) => {
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();
  const now = ctx.currentTime;
  const freq = COUNTDOWN_FREQS[num] || N.C4;
  const dur = num <= 2 ? 0.22 : 0.14;
  playNote(freq, dur, now, 'sine', 0.38);
  if (num <= 2) playNote(freq * 2, dur * 0.6, now, 'sine', 0.14);
  if (num === 1) playNote(freq * 3, dur * 0.4, now, 'sine', 0.06);
};

export const playCountdownGo = () => {
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();
  const now = ctx.currentTime;
  [[N.C5, 0], [N.E5, 0.07], [N.G5, 0.14], [N.C6, 0.21]].forEach(([f, delay]) => {
    playNote(f, 0.40, now + delay, 'sine', 0.38);
  });
};

// ── Sound effects ───────────────────────────────────────────────────────────
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

// Returns true if AudioContext is running (i.e. user has already interacted).
export const isAudioReady = () => audioCtx && audioCtx.state === 'running';

// ── Android/mobile background-pause ─────────────────────────────────────────
// When the app goes to the background on Android (or any page-hidden event),
// suspend the AudioContext so music doesn't keep playing. Resume automatically
// when the page is visible again.
let wasCtxRunningBeforeHide = false;
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (!audioCtx) return;
    if (document.hidden) {
      wasCtxRunningBeforeHide = audioCtx.state === 'running';
      if (wasCtxRunningBeforeHide) audioCtx.suspend().catch(() => {});
    } else {
      if (wasCtxRunningBeforeHide) audioCtx.resume().catch(() => {});
    }
  });
  // Extra belt-and-braces: pagehide / pageshow for older Android webviews
  window.addEventListener('pagehide', () => {
    if (audioCtx && audioCtx.state === 'running') audioCtx.suspend().catch(() => {});
  });
  window.addEventListener('pageshow', () => {
    if (audioCtx && audioCtx.state === 'suspended' && !document.hidden) audioCtx.resume().catch(() => {});
  });
}
