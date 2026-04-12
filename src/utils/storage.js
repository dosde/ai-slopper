// localStorage helpers for leaderboard, achievements, and stats

const SCORES_KEY = 'slop_royale_scores_v2';
const ACHIEVEMENTS_KEY = 'slop_royale_achievements_v2';
const STATS_KEY = 'slop_royale_stats_v2';

// ========== LEADERBOARD ==========

export const getLeaderboard = () => {
  try {
    return JSON.parse(localStorage.getItem(SCORES_KEY) || '[]');
  } catch {
    return [];
  }
};

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

export const getPlayerRank = (score) => {
  const board = getLeaderboard();
  const position = board.filter(e => e.score > score).length + 1;
  return position;
};

// ========== ACHIEVEMENTS ==========

export const ACHIEVEMENTS = [
  { id: 'first_slop',    emoji: '🔍', name: 'SLOP SPOTTER',       desc: 'Detect your first slop phrase' },
  { id: 'combo_3',       emoji: '🔥', name: 'ON FIRE',            desc: 'Get a 3x combo' },
  { id: 'combo_5',       emoji: '⚡', name: 'COMBO KING',         desc: 'Get a 5x combo' },
  { id: 'perfect_round', emoji: '💯', name: 'PERFECTIONIST',      desc: 'Find 100% of slop in a round' },
  { id: 'speed_demon',   emoji: '🏃', name: 'SPEED DEMON',        desc: 'Finish a round with 25s left' },
  { id: 'score_3000',    emoji: '💥', name: 'SLOP DESTROYER',     desc: 'Score 3000+ total points' },
  { id: 'score_6000',    emoji: '🏆', name: 'SUPREME OVERLORD',   desc: 'Score 6000+ total points' },
  { id: 'used_radar',    emoji: '📡', name: 'RADAR OPERATOR',     desc: 'Use the Slop Radar power-up' },
  { id: 'all_powerups',  emoji: '🦾', name: 'POWER USER',         desc: 'Use all 3 power-ups in one game' },
  { id: 'completionist', emoji: '🎓', name: 'COMPLETIONIST',      desc: 'Complete all 5 rounds' },
  { id: 'chaos_clear',   emoji: '😈', name: 'CHAOS MASTER',       desc: 'Complete a game on CHAOS mode' },
  { id: 'certainly',     emoji: '🗡️', name: 'CERTAINLY SLAYER',   desc: 'Detect 10 "Certainly!" phrases' },
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

  check('first_slop',    gameStats.totalDetected >= 1);
  check('combo_3',       gameStats.maxCombo >= 3);
  check('combo_5',       gameStats.maxCombo >= 5);
  check('perfect_round', gameStats.perfectRounds >= 1);
  check('speed_demon',   gameStats.bestTimeLeft >= 25);
  check('score_3000',    gameStats.totalScore >= 3000);
  check('score_6000',    gameStats.totalScore >= 6000);
  check('used_radar',    gameStats.usedRadar);
  check('all_powerups',  gameStats.powerUpsUsed >= 3);
  check('completionist', gameStats.roundsCompleted >= 5);
  check('chaos_clear',   gameStats.completedChaos);
  check('certainly',     gameStats.certainlyCount >= 10);

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
    gamesPlayed: (stats.gamesPlayed || 0) + (delta.gamesPlayed || 0),
    totalDetected: (stats.totalDetected || 0) + (delta.totalDetected || 0),
    certainlyCount: (stats.certainlyCount || 0) + (delta.certainlyCount || 0),
    maxCombo: Math.max(stats.maxCombo || 0, delta.maxCombo || 0),
    bestScore: Math.max(stats.bestScore || 0, delta.totalScore || 0),
  };
  localStorage.setItem(STATS_KEY, JSON.stringify(merged));
  return merged;
};
