// localStorage helpers for leaderboard, achievements, and stats
// Optional global leaderboard:
//   VITE_SCORES_URL  — Supabase REST endpoint for reads  (anon key, SELECT only)
//   VITE_SCORES_KEY  — Supabase anon key
//   VITE_SUBMIT_URL  — Edge Function URL for writes (validates + uses service role)

// Per-difficulty local leaderboard keys (v3 introduces difficulty separation)
const DIFFICULTY_KEY = (d) => `slop_royale_scores_${d || 'normal'}_v3`;
const DAILY_SCORES_KEY = 'slop_royale_daily_v1';
const ACHIEVEMENTS_KEY = 'slop_royale_achievements_v2';
const STATS_KEY = 'slop_royale_stats_v2';
const DICT_KEY = 'slop_royale_dict_v1';
const XP_KEY = 'slop_royale_xp_v1';
const SLOP_INDEX_KEY = 'slop_royale_slop_index_v1';

const getTodayKey = () => new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD

const API_URL    = import.meta.env.VITE_SCORES_URL;  // REST read endpoint
const API_KEY    = import.meta.env.VITE_SCORES_KEY;  // Supabase anon key
const SUBMIT_URL = import.meta.env.VITE_SUBMIT_URL;  // Edge Function submit endpoint

const apiHeaders = () => ({
  'Content-Type': 'application/json',
  ...(API_KEY ? { apikey: API_KEY, Authorization: `Bearer ${API_KEY}` } : {}),
});

// ========== LEADERBOARD ==========

export const getLeaderboard = (difficulty = 'normal') => {
  try {
    return JSON.parse(localStorage.getItem(DIFFICULTY_KEY(difficulty)) || '[]');
  } catch {
    return [];
  }
};

// Fetch global scores (async). Falls back to local on any error.
export const getGlobalLeaderboard = async (difficulty = 'normal') => {
  if (!API_URL) return getLeaderboard(difficulty);
  try {
    if (difficulty === 'daily') {
      const today = getTodayKey();
      const url = `${API_URL}?order=score.desc&limit=20&date=eq.${encodeURIComponent(today)}`;
      const res = await fetch(url, { headers: apiHeaders() });
      if (!res.ok) throw new Error(res.status);
      return await res.json();
    }
    const url = `${API_URL}?order=score.desc&limit=20&difficulty=eq.${encodeURIComponent(difficulty)}`;
    const res = await fetch(url, { headers: apiHeaders() });
    if (!res.ok) throw new Error(res.status);
    return await res.json();
  } catch {
    return difficulty === 'daily' ? getDailyLeaderboard() : getLeaderboard(difficulty);
  }
};

// Returns true if global scores are configured
export const isGlobalEnabled = () => Boolean(API_URL);

export const saveScore = (score, initials, rank, difficulty = 'normal') => {
  const board = getLeaderboard(difficulty);
  const entry = {
    score,
    initials: initials.toUpperCase().slice(0, 6).padEnd(3, '·'),
    rank,
    difficulty,
    date: new Date().toLocaleDateString(),
    timestamp: Date.now(),
  };
  board.push(entry);
  board.sort((a, b) => b.score - a.score);
  const top10 = board.slice(0, 10);
  localStorage.setItem(DIFFICULTY_KEY(difficulty), JSON.stringify(top10));
  return top10.findIndex(e => e.timestamp === entry.timestamp) + 1;
};

// Save to global backend and local. Returns local rank position.
// Writes go through the Edge Function (VITE_SUBMIT_URL) which validates server-side.
// Falls back to direct REST insert if no edge function is configured.
export const saveScoreGlobal = async (score, initials, rank, difficulty = 'normal') => {
  const localRank = saveScore(score, initials, rank, difficulty);
  if (!API_URL) return localRank;
  const payload = {
    score,
    initials: initials.toUpperCase().slice(0, 6).padEnd(3, '·'),
    rank,
    difficulty,
    date: new Date().toLocaleDateString(),
    timestamp: Date.now(),
  };
  try {
    await fetch(SUBMIT_URL || API_URL, {
      method: 'POST',
      headers: apiHeaders(),
      body: JSON.stringify(payload),
    });
  } catch { /* non-fatal */ }
  return localRank;
};

// ========== DAILY LEADERBOARD ==========

export const getDailyLeaderboard = () => {
  try {
    const data = JSON.parse(localStorage.getItem(DAILY_SCORES_KEY) || 'null');
    if (!data || data.date !== getTodayKey()) return [];
    return data.scores || [];
  } catch {
    return [];
  }
};

export const saveDailyScore = (score, initials, rank) => {
  const today = getTodayKey();
  let data;
  try {
    data = JSON.parse(localStorage.getItem(DAILY_SCORES_KEY) || 'null');
  } catch {
    data = null;
  }
  const entry = {
    score,
    initials: initials.toUpperCase().slice(0, 3).padEnd(3, '·'),
    rank,
    date: new Date().toLocaleDateString(),
    timestamp: Date.now(),
  };
  const existing = (data && data.date === today) ? data.scores : [];
  const scores = [...existing, entry];
  scores.sort((a, b) => b.score - a.score);
  const top10 = scores.slice(0, 10);
  localStorage.setItem(DAILY_SCORES_KEY, JSON.stringify({ date: today, scores: top10 }));
  return top10.findIndex(e => e.timestamp === entry.timestamp) + 1;
};

export const getPlayerRank = (score, difficulty = 'normal') => {
  const board = getLeaderboard(difficulty);
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

// ========== PER-ROUND BESTS ==========

const ROUND_BESTS_KEY = 'slop_royale_round_bests_v1';

export const getRoundBest = (roundNumber, difficulty = 'normal') => {
  try {
    const data = JSON.parse(localStorage.getItem(ROUND_BESTS_KEY) || '{}');
    return data[`${difficulty}_${roundNumber}`] ?? 0;
  } catch {
    return 0;
  }
};

// Returns true if this score beats the previous best.
export const setRoundBest = (roundNumber, score, difficulty = 'normal') => {
  try {
    const data = JSON.parse(localStorage.getItem(ROUND_BESTS_KEY) || '{}');
    const key = `${difficulty}_${roundNumber}`;
    if (score > (data[key] ?? 0)) {
      data[key] = score;
      localStorage.setItem(ROUND_BESTS_KEY, JSON.stringify(data));
      return true;
    }
    return false;
  } catch {
    return false;
  }
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

// ========== XP & LEVELS ==========

export const LEVELS = [
  { level:  1, xpRequired:     0, title: 'SLOP ROOKIE' },
  { level:  2, xpRequired:   150, title: 'PHRASE FINDER' },
  { level:  3, xpRequired:   350, title: 'CLICHÉ HUNTER' },
  { level:  4, xpRequired:   600, title: 'BUZZWORD BUSTER' },
  { level:  5, xpRequired:  1000, title: 'AI DETECTOR' },
  { level:  6, xpRequired:  1500, title: 'SLOP SLAYER' },
  { level:  7, xpRequired:  2100, title: 'NEURAL NEMESIS' },
  { level:  8, xpRequired:  2800, title: 'PARADIGM PULVERIZER' },
  { level:  9, xpRequired:  3600, title: 'TOKEN TERMINATOR' },
  { level: 10, xpRequired:  4500, title: 'SLOP SOVEREIGN' },
  { level: 11, xpRequired:  5500, title: 'BULLET POINT BANE' },
  { level: 12, xpRequired:  6600, title: 'DISCLAIMER DESTROYER' },
  { level: 13, xpRequired:  7800, title: 'LEVERAGE LORD' },
  { level: 14, xpRequired:  9100, title: 'GRAND SLOP MASTER' },
  { level: 15, xpRequired: 10500, title: 'SLOP TRANSCENDENT' },
  { level: 16, xpRequired: 12000, title: 'CERTAINLY SLAYER' },
  { level: 17, xpRequired: 13600, title: 'AI EXTINCTION AGENT' },
  { level: 18, xpRequired: 15300, title: 'SUPREME OVERLORD' },
  { level: 19, xpRequired: 17100, title: 'HOLISTIC DESTROYER' },
  { level: 20, xpRequired: 19000, title: 'SLOP GOD' },
];

export const getLevelFromXP = (xp) => {
  let current = LEVELS[0];
  for (const l of LEVELS) {
    if (xp >= l.xpRequired) current = l;
    else break;
  }
  return current;
};

export const getNextLevel = (currentLevel) =>
  LEVELS.find(l => l.level === currentLevel + 1) || null;

export const getXPData = () => {
  try { return JSON.parse(localStorage.getItem(XP_KEY) || '{"xp":0}'); }
  catch { return { xp: 0 }; }
};

// Adds XP and returns { xp, prevLevel, newLevel, leveledUp }
export const addXP = (amount) => {
  const data = getXPData();
  const prevXP = data.xp || 0;
  const prevLevel = getLevelFromXP(prevXP);
  const newXP = prevXP + amount;
  const newLevel = getLevelFromXP(newXP);
  localStorage.setItem(XP_KEY, JSON.stringify({ xp: newXP }));
  return { xp: newXP, prevXP, prevLevel, newLevel, leveledUp: newLevel.level > prevLevel.level };
};

// XP earned per game: score/20 + perfect bonuses, scaled by difficulty
const DIFF_MULTI = { normal: 1.0, chaos: 1.3, brainrot: 1.2, iron: 1.5, daily: 1.1 };
export const calculateXP = (totalScore, perfectRounds, difficulty) => {
  const base = Math.floor(Math.max(0, totalScore) / 20);
  const bonus = perfectRounds * 50;
  return Math.round((base + bonus) * (DIFF_MULTI[difficulty] || 1.0));
};

// ========== SLOP INDEX ==========

export const getSlopIndex = () => {
  try { return parseInt(localStorage.getItem(SLOP_INDEX_KEY) || '0', 10); }
  catch { return 0; }
};

export const incrementSlopIndex = (count) => {
  const next = getSlopIndex() + Math.max(0, count);
  localStorage.setItem(SLOP_INDEX_KEY, String(next));
  return next;
};

// ========== GLOBAL STATS (Supabase) ==========
// Requires two tables in the same Supabase project as the leaderboard:
//
//   create table slop_stats (
//     key text primary key,
//     value bigint not null default 0
//   );
//   insert into slop_stats (key, value) values ('total_eradicated', 0) on conflict do nothing;
//   alter table slop_stats enable row level security;
//   create policy "Public read" on slop_stats for select using (true);
//
//   create table slop_phrases (
//     phrase text primary key,
//     phrase_type text,
//     count bigint not null default 0,
//     updated_at timestamptz default now()
//   );
//   alter table slop_phrases enable row level security;
//   create policy "Public read" on slop_phrases for select using (true);
//
// And two security-definer RPC functions so anon can write atomically:
//
//   create or replace function inc_stat(stat_key text, amount bigint default 1)
//   returns void language plpgsql security definer as $$
//   begin
//     insert into slop_stats (key, value) values (stat_key, amount)
//     on conflict (key) do update set value = slop_stats.value + excluded.value;
//   end; $$;
//   grant execute on function inc_stat to anon;
//
//   create or replace function inc_phrase(p_phrase text, p_type text)
//   returns void language plpgsql security definer as $$
//   begin
//     insert into slop_phrases (phrase, phrase_type, count, updated_at)
//     values (p_phrase, p_type, 1, now())
//     on conflict (phrase) do update set
//       count = slop_phrases.count + 1,
//       updated_at = now();
//   end; $$;
//   grant execute on function inc_phrase to anon;

// Derive the /rest/v1 base URL from the scores table URL
const supabaseBase = () => {
  if (!API_URL) return null;
  return API_URL.replace(/\/[^/?]+(\?.*)?$/, '');
};

export const getGlobalSlopIndex = async () => {
  const base = supabaseBase();
  if (!base) return null;
  try {
    const res = await fetch(
      `${base}/slop_stats?key=eq.total_eradicated&select=value`,
      { headers: apiHeaders() }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data[0]?.value === 'number' ? data[0].value : null;
  } catch { return null; }
};

export const submitGlobalSlopIndex = async (count) => {
  const base = supabaseBase();
  if (!base || count <= 0) return;
  try {
    await fetch(`${base}/rpc/inc_stat`, {
      method: 'POST',
      headers: apiHeaders(),
      body: JSON.stringify({ stat_key: 'total_eradicated', amount: count }),
    });
  } catch { /* fire and forget */ }
};

export const getGlobalTopPhrases = async (limit = 10) => {
  const base = supabaseBase();
  if (!base) return null;
  try {
    const res = await fetch(
      `${base}/slop_phrases?order=count.desc&limit=${limit}&select=phrase,phrase_type,count`,
      { headers: apiHeaders() }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    return data.map(d => ({ text: d.phrase, type: d.phrase_type, count: Number(d.count) }));
  } catch { return null; }
};

export const submitGlobalPhrase = async (text, type) => {
  const base = supabaseBase();
  if (!base) return;
  try {
    await fetch(`${base}/rpc/inc_phrase`, {
      method: 'POST',
      headers: apiHeaders(),
      body: JSON.stringify({ p_phrase: text, p_type: type }),
    });
  } catch { /* fire and forget */ }
};
