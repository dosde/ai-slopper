// localStorage helpers for leaderboard, achievements, and stats
// Optional global leaderboard: set VITE_SCORES_URL + VITE_SCORES_KEY (Supabase)

const SCORES_KEY = 'slop_royale_scores_v2';
const ACHIEVEMENTS_KEY = 'slop_royale_achievements_v2';
const STATS_KEY = 'slop_royale_stats_v2';
const DICT_KEY = 'slop_royale_dict_v1';

const API_URL  = import.meta.env.VITE_SCORES_URL;  // e.g. https://xyz.supabase.co/rest/v1/scores
const API_KEY  = import.meta.env.VITE_SCORES_KEY;  // Supabase anon key

const apiHeaders = () => ({
  'Content-Type': 'application/json',
  ...(API_KEY ? { apikey: API_KEY, Authorization: `Bearer ${API_KEY}` } : {}),
});

// ========== LEADERBOARD ==========

export const getLeaderboard = () => {
  try {
    return JSON.parse(localStorage.getItem(SCORES_KEY) || '[]');
  } catch {
    return [];
  }
};

// Fetch global scores (async). Falls back to local on any error.
export const getGlobalLeaderboard = async () => {
  if (!API_URL) return getLeaderboard();
  try {
    const res = await fetch(`${API_URL}?order=score.desc&limit=20`, { headers: apiHeaders() });
    if (!res.ok) throw new Error(res.status);
    return await res.json();
  } catch {
    return getLeaderboard();
  }
};

// Returns true if global scores are configured
export const isGlobalEnabled = () => Boolean(API_URL);

export const saveScore = (score, initials, rank) => {
  const board = getLeaderboard();
  const entry = {
    score,
    initials: initials.toUpperCase().slice(0, 3).padEnd(3, '·'),
    rank,
    date: new Date().toLocaleDateString(),
    timestamp: Date.now(),
  };
  board.push(entry);
  board.sort((a, b) => b.score - a.score);
  const top10 = board.slice(0, 10);
  localStorage.setItem(SCORES_KEY, JSON.stringify(top10));
  return top10.findIndex(e => e.timestamp === entry.timestamp) + 1;
};

// Save to global API and local. Returns position.
export const saveScoreGlobal = async (score, initials, rank) => {
  const localRank = saveScore(score, initials, rank);
  if (!API_URL) return localRank;
  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: apiHeaders(),
      body: JSON.stringify({
        score,
        initials: initials.toUpperCase().slice(0, 3).padEnd(3, '·'),
        rank,
        date: new Date().toLocaleDateString(),
        timestamp: Date.now(),
      }),
    });
  } catch { /* non-fatal */ }
  return localRank;
};

export const getPlayerRank = (score) => {
  const board = getLeaderboard();
  const position = board.filter(e => e.score > score).length + 1;
  return position;
};

// ========== ACHIEVEMENTS ==========

export const ACHIEVEMENTS = [
  { id: 'first_slop',      emoji: '🔍', name: 'SLOP SPOTTER',        desc: 'Detect your first slop phrase' },
  { id: 'combo_3',         emoji: '🔥', name: 'ON FIRE',              desc: 'Get a 3x combo' },
  { id: 'combo_5',         emoji: '⚡', name: 'COMBO KING',           desc: 'Get a 5x combo' },
  { id: 'perfect_round',   emoji: '💯', name: 'PERFECTIONIST',        desc: 'Find 100% of slop in a round' },
  { id: 'speed_demon',     emoji: '🏃', name: 'SPEED DEMON',          desc: 'Finish a round with 25s left' },
  { id: 'score_3000',      emoji: '💥', name: 'SLOP DESTROYER',       desc: 'Score 3000+ total points' },
  { id: 'score_6000',      emoji: '🏆', name: 'SUPREME OVERLORD',     desc: 'Score 6000+ total points' },
  { id: 'score_10000',     emoji: '🌌', name: 'SLOP TRANSCENDENT',    desc: 'Score 10000+ total points' },
  { id: 'used_radar',      emoji: '📡', name: 'RADAR OPERATOR',       desc: 'Use the Slop Radar power-up' },
  { id: 'all_powerups',    emoji: '🦾', name: 'POWER USER',           desc: 'Use all 3 power-ups in one game' },
  { id: 'completionist',   emoji: '🎓', name: 'COMPLETIONIST',        desc: 'Complete all 5 rounds' },
  { id: 'chaos_clear',     emoji: '😈', name: 'CHAOS MASTER',         desc: 'Complete a game on CHAOS mode' },
  { id: 'certainly',       emoji: '🗡️', name: 'CERTAINLY SLAYER',     desc: 'Detect 10 "Certainly!" phrases across all games' },
  { id: 'no_powerups',     emoji: '🧘', name: 'PURIST',               desc: 'Complete a game without using any power-ups' },
  { id: 'daily_done',      emoji: '📅', name: 'DAILY DEVOTEE',        desc: 'Complete a Daily Challenge' },
  { id: 'two_perfect',     emoji: '🌟', name: 'DOUBLE PERFECT',       desc: 'Get 100% in 2 rounds in one game' },
  { id: 'score_1000_round',emoji: '💎', name: 'BIG ROUND',            desc: 'Score 1000+ in a single round' },
  { id: 'opener_hunter',   emoji: '🎯', name: 'OPENER HUNTER',        desc: 'Detect 20 opener phrases total' },
  { id: 'disclaimer_slayer',emoji: '🤖', name: 'DISCLAIMER SLAYER',   desc: 'Detect 15 AI disclaimer phrases total' },
  { id: 'five_games',      emoji: '🔁', name: 'FREQUENT SLOPPER',     desc: 'Complete 5 games total' },
];

export const getUnlockedAchievements = () => {
  try {
    return JSON.parse(localStorage.getItem(ACHIEVEMENTS_KEY) || '[]');
  } catch {
    return [];
  }
};

export const unlockAchievement = (id) => {
  const unlocked = getUnlockedAchievements();
  if (unlocked.includes(id)) return false; // already unlocked
  unlocked.push(id);
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(unlocked));
  return true; // newly unlocked
};

export const checkAndUnlockAchievements = (gameStats) => {
  const newlyUnlocked = [];

  const check = (id, condition) => {
    if (condition && unlockAchievement(id)) {
      const ach = ACHIEVEMENTS.find(a => a.id === id);
      if (ach) newlyUnlocked.push(ach);
    }
  };

  // Read cumulative stats for cross-game achievements
  const cum = getStats();

  check('first_slop',       gameStats.totalDetected >= 1);
  check('combo_3',          gameStats.maxCombo >= 3);
  check('combo_5',          gameStats.maxCombo >= 5);
  check('perfect_round',    gameStats.perfectRounds >= 1);
  check('two_perfect',      gameStats.perfectRounds >= 2);
  check('speed_demon',      gameStats.bestTimeLeft >= 25);
  check('score_3000',       gameStats.totalScore >= 3000);
  check('score_6000',       gameStats.totalScore >= 6000);
  check('score_10000',      gameStats.totalScore >= 10000);
  check('score_1000_round', gameStats.bestRoundScore >= 1000);
  check('used_radar',       gameStats.usedRadar);
  check('all_powerups',     gameStats.powerUpsUsed >= 3);
  check('no_powerups',      gameStats.powerUpsUsed === 0);
  check('completionist',    gameStats.roundsCompleted >= 5);
  check('chaos_clear',      gameStats.completedChaos);
  check('daily_done',       gameStats.isDaily);
  // Cumulative checks
  check('certainly',        (cum.certainlyCount || 0) + gameStats.certainlyCount >= 10);
  check('opener_hunter',    (cum.openerCount || 0) + gameStats.openerCount >= 20);
  check('disclaimer_slayer',(cum.disclaimerCount || 0) + gameStats.disclaimerCount >= 15);
  check('five_games',       (cum.gamesPlayed || 0) + 1 >= 5);

  return newlyUnlocked;
};

// ========== CUMULATIVE STATS ==========

export const getStats = () => {
  try {
    return JSON.parse(localStorage.getItem(STATS_KEY) || '{}');
  } catch {
    return {};
  }
};

export const updateStats = (delta) => {
  const stats = getStats();
  const merged = {
    ...stats,
    gamesPlayed:      (stats.gamesPlayed || 0)      + (delta.gamesPlayed || 0),
    totalDetected:    (stats.totalDetected || 0)    + (delta.totalDetected || 0),
    certainlyCount:   (stats.certainlyCount || 0)   + (delta.certainlyCount || 0),
    openerCount:      (stats.openerCount || 0)      + (delta.openerCount || 0),
    disclaimerCount:  (stats.disclaimerCount || 0)  + (delta.disclaimerCount || 0),
    maxCombo:         Math.max(stats.maxCombo || 0,  delta.maxCombo || 0),
    bestScore:        Math.max(stats.bestScore || 0, delta.totalScore || 0),
  };
  localStorage.setItem(STATS_KEY, JSON.stringify(merged));
  return merged;
};

// ========== SLOP DICTIONARY ==========
// Tracks every unique slop phrase ever detected, with count and type.

export const getSlopDict = () => {
  try {
    return JSON.parse(localStorage.getItem(DICT_KEY) || '{}');
  } catch {
    return {};
  }
};

// Call whenever a slop phrase is correctly detected
export const updateSlopDict = (text, type) => {
  const dict = getSlopDict();
  const key = text.toLowerCase().trim();
  if (!dict[key]) dict[key] = { text, type, count: 0 };
  dict[key].count += 1;
  localStorage.setItem(DICT_KEY, JSON.stringify(dict));
};

// Returns entries sorted by detection count descending
export const getSlopDictSorted = () =>
  Object.values(getSlopDict()).sort((a, b) => b.count - a.count);
