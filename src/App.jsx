import { useState, useCallback, useRef } from 'react';
import StartScreen from './components/StartScreen';
import RoundIntro from './components/RoundIntro';
import GameScreen from './components/GameScreen';
import RoundSummary from './components/RoundSummary';
import ResultScreen from './components/ResultScreen';
import AchievementToastLayer, { showAchievement } from './components/AchievementToast';
import { selectRounds, getDailyRounds } from './data/slopData';
import { stopMusic } from './utils/audio';
import { checkAndUnlockAchievements, updateStats } from './utils/storage';

const STATE = {
  START: 'start',
  ROUND_INTRO: 'round_intro',
  PLAYING: 'playing',
  ROUND_SUMMARY: 'round_summary',
  RESULT: 'result',
};

export default function App() {
  const [gameState, setGameState] = useState(STATE.START);
  const [rounds, setRounds] = useState([]);
  const [roundIdx, setRoundIdx] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [roundScores, setRoundScores] = useState([]);
  const [lastRoundScore, setLastRoundScore] = useState(0);
  const [lastFoundIds, setLastFoundIds] = useState(new Set());
  const [difficulty, setDifficulty] = useState('normal');
  const [newAchievements, setNewAchievements] = useState([]);

  const [isDaily, setIsDaily] = useState(false);
  const [usedPowerUps, setUsedPowerUps] = useState([]);

  // Per-game stats for achievements
  const gameStatsRef = useRef({
    totalDetected: 0,
    certainlyCount: 0,
    openerCount: 0,
    disclaimerCount: 0,
    maxCombo: 0,
    perfectRounds: 0,
    bestTimeLeft: 0,
    bestRoundScore: 0,
    totalScore: 0,
    roundsCompleted: 0,
    usedRadar: false,
    powerUpsUsed: 0,
    completedChaos: false,
  });

  const handleStart = useCallback(({ difficulty: diff, mode, musicEnabled }) => {
    const selectedRounds = mode === 'daily' ? getDailyRounds() : selectRounds();
    setRounds(selectedRounds);
    setRoundIdx(0);
    setTotalScore(0);
    setRoundScores([]);
    setLastRoundScore(0);
    setLastFoundIds(new Set());
    setDifficulty(diff);
    setNewAchievements([]);
    setUsedPowerUps([]);
    const daily = mode === 'daily';
    setIsDaily(daily);
    gameStatsRef.current = {
      totalDetected: 0, certainlyCount: 0, openerCount: 0,
      disclaimerCount: 0, maxCombo: 0, perfectRounds: 0,
      bestTimeLeft: 0, bestRoundScore: 0, totalScore: 0,
      roundsCompleted: 0, usedRadar: false, powerUpsUsed: 0,
      completedChaos: false, isDaily: daily,
    };
    setGameState(STATE.ROUND_INTRO);
  }, []);

  const handleRoundReady = useCallback(() => {
    setGameState(STATE.PLAYING);
  }, []);

  const handleRoundEnd = useCallback((score, foundIds, timeLeft = 0) => {
    setLastRoundScore(score);
    setLastFoundIds(foundIds);
    setTotalScore(prev => prev + score);
    setRoundScores(prev => [...prev, score]);

    // Update per-game stats
    const round = rounds[roundIdx];
    const totalPhrasesInRound = round?.slopPhrases?.length ?? 0;
    const foundInRound = foundIds.size;
    const stats = gameStatsRef.current;
    stats.totalDetected += foundInRound;
    stats.roundsCompleted += 1;
    if (score > stats.bestRoundScore) stats.bestRoundScore = score;
    if (timeLeft > stats.bestTimeLeft) stats.bestTimeLeft = timeLeft;
    if (foundInRound >= totalPhrasesInRound && totalPhrasesInRound > 0) stats.perfectRounds += 1;
    // Count phrase types for cross-game achievements
    if (round?.slopPhrases) {
      round.slopPhrases.forEach((p, i) => {
        // token IDs are indices in tokenized array; we check foundIds loosely by count
        if (p.type === 'opener') stats.openerCount = (stats.openerCount || 0) + 1;
        if (p.type === 'disclaimer') stats.disclaimerCount = (stats.disclaimerCount || 0) + 1;
        if (p.text === 'Certainly!') stats.certainlyCount = (stats.certainlyCount || 0) + 1;
      });
    }

    setGameState(STATE.ROUND_SUMMARY);
  }, [rounds, roundIdx]);

  const handleNextRound = useCallback(() => {
    const nextIdx = roundIdx + 1;
    if (nextIdx >= rounds.length) {
      // Game complete — check achievements
      const stats = gameStatsRef.current;
      stats.totalScore = totalScore + (roundScores[roundScores.length - 1] ?? 0);
      if (difficulty === 'chaos') stats.completedChaos = true;

      const unlocked = checkAndUnlockAchievements(stats);
      updateStats({ ...stats, gamesPlayed: 1 });

      // Show toasts sequentially
      unlocked.forEach((ach, i) => {
        setTimeout(() => showAchievement(ach), i * 800);
      });
      setNewAchievements(unlocked);
      setGameState(STATE.RESULT);
    } else {
      setRoundIdx(nextIdx);
      setGameState(STATE.ROUND_INTRO);
    }
  }, [roundIdx, rounds.length, totalScore, roundScores, difficulty]);

  const handleRestart = useCallback(() => {
    stopMusic();
    setGameState(STATE.START);
  }, []);

  const handlePowerUpUsed = useCallback((id) => {
    setUsedPowerUps(prev => [...prev, id]);
    const stats = gameStatsRef.current;
    stats.powerUpsUsed += 1;
    if (id === 'radar') stats.usedRadar = true;
  }, []);

  const handleComboUpdate = useCallback((combo) => {
    if (combo > gameStatsRef.current.maxCombo) {
      gameStatsRef.current.maxCombo = combo;
    }
  }, []);

  const currentRound = rounds[roundIdx];

  return (
    <>
      <div className="game-container">
        {gameState === STATE.START && (
          <StartScreen onStart={handleStart} />
        )}

        {gameState === STATE.ROUND_INTRO && currentRound && (
          <RoundIntro
            round={currentRound}
            totalRounds={rounds.length}
            difficulty={difficulty}
            onReady={handleRoundReady}
          />
        )}

        {gameState === STATE.PLAYING && currentRound && (
          <GameScreen
            key={`game-${roundIdx}-${currentRound.id}`}
            round={currentRound}
            roundIdx={roundIdx}
            totalRounds={rounds.length}
            totalScore={totalScore}
            difficulty={difficulty}
            onRoundEnd={handleRoundEnd}
            onPowerUpUsed={handlePowerUpUsed}
            usedPowerUps={usedPowerUps}
          />
        )}

        {gameState === STATE.ROUND_SUMMARY && currentRound && (
          <RoundSummary
            round={currentRound}
            roundScore={lastRoundScore}
            foundIds={lastFoundIds}
            totalScore={totalScore}
            isLastRound={roundIdx >= rounds.length - 1}
            onNext={handleNextRound}
          />
        )}

        {gameState === STATE.RESULT && (
          <ResultScreen
            totalScore={totalScore}
            roundScores={roundScores}
            newAchievements={newAchievements}
            difficulty={difficulty}
            onRestart={handleRestart}
          />
        )}
      </div>

      {/* Achievement toasts render outside game-container to avoid clipping */}
      <AchievementToastLayer />
    </>
  );
}
