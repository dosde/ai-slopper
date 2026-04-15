import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import StartScreen from './components/StartScreen';
import RoundIntro from './components/RoundIntro';
import GameScreen from './components/GameScreen';
import RoundSummary from './components/RoundSummary';
import ResultScreen from './components/ResultScreen';
import CommunityMenu from './components/CommunityMenu';
import CreateSet from './components/CreateSet';
import SetDetail from './components/SetDetail';
import AchievementToastLayer, { showAchievement } from './components/AchievementToast';
import { selectRounds, getDailyRounds, createRoundsFromSet } from './data/slopData';
import { stopMusic } from './utils/audio';
import { checkAndUnlockAchievements, updateStats, calculateXP, addXP, incrementSlopIndex, submitGlobalSlopIndex, getLevelFromXP, getXPData } from './utils/storage';
import { submitSetScore, normaliseSeed } from './utils/communityApi';

function Starfield() {
  const stars = useMemo(() =>
    Array.from({ length: 24 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      opacity: 0.08 + Math.random() * 0.12,
      size: Math.random() < 0.75 ? 1 : 1.5,
    }))
  , []);
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
      {stars.map(s => (
        <div key={s.id} style={{
          position: 'absolute',
          left: `${s.x}%`,
          top: `${s.y}%`,
          width: `${s.size}px`,
          height: `${s.size}px`,
          borderRadius: '50%',
          background: `rgba(255,255,255,${s.opacity.toFixed(2)})`,
        }} />
      ))}
    </div>
  );
}

const STATE = {
  START: 'start',
  ROUND_INTRO: 'round_intro',
  PLAYING: 'playing',
  ROUND_SUMMARY: 'round_summary',
  RESULT: 'result',
  COMMUNITY_MENU: 'community_menu',
  COMMUNITY_CREATE: 'community_create',
  COMMUNITY_DETAIL: 'community_detail',
};

export default function App() {
  const [gameState, setGameState] = useState(STATE.START);
  const [rounds, setRounds] = useState([]);
  const [roundIdx, setRoundIdx] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [roundScores, setRoundScores] = useState([]);
  const [lastRoundScore, setLastRoundScore] = useState(0);
  const [lastFoundIds, setLastFoundIds] = useState(new Set());
  const [lastFoundCombos, setLastFoundCombos] = useState({});
  const [lastWrongClicks, setLastWrongClicks] = useState(0);
  const [lastTimeLeft, setLastTimeLeft] = useState(0);
  const [difficulty, setDifficulty] = useState('normal');
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [lang, setLang] = useState('en');
  const [newAchievements, setNewAchievements] = useState([]);

  const [isDaily, setIsDaily] = useState(false);
  const [usedPowerUps, setUsedPowerUps] = useState([]);
  const [totalRunTime, setTotalRunTime] = useState(0);
  const [ironFailedRound, setIronFailedRound] = useState(null);
  const consecutivePerfectsRef = useRef(0);
  const [consecutivePerfects, setConsecutivePerfects] = useState(0);
  const rageMomentsRef = useRef([]);
  const [xpResult, setXpResult] = useState(null); // { xpEarned, prevLevel, newLevel, leveledUp }
  const [communitySeed, setCommunitySeed] = useState(null); // non-null when playing a community set
  const [communityDetailSeed, setCommunityDetailSeed] = useState(null);

  // Deep-link: ?seed=XXXX-XXXX jumps into the community set detail screen
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const raw = params.get('seed');
      if (raw) {
        const seed = normaliseSeed(raw);
        if (/^[0-9A-Z]{4}-[0-9A-Z]{4}$/.test(seed)) {
          setCommunityDetailSeed(seed);
          setGameState(STATE.COMMUNITY_DETAIL);
          // Strip ?seed= from the URL so reloading / restarting doesn't re-trigger.
          params.delete('seed');
          const qs = params.toString();
          const newUrl = window.location.pathname + (qs ? `?${qs}` : '') + window.location.hash;
          window.history.replaceState({}, '', newUrl);
        }
      }
    } catch { /* ignore */ }
  }, []);

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

  const handleStart = useCallback(({ difficulty: diff, mode, musicEnabled: mu, lang: l = 'en', communitySet = null }) => {
    let selectedRounds;
    if (communitySet) {
      selectedRounds = createRoundsFromSet(communitySet.rounds);
      setCommunitySeed(communitySet.set.seed);
    } else {
      selectedRounds = mode === 'daily' ? getDailyRounds() : selectRounds(null, l);
      setCommunitySeed(null);
    }
    setLang(l);
    setMusicEnabled(mu);
    setRounds(selectedRounds);
    setRoundIdx(0);
    setTotalScore(0);
    setRoundScores([]);
    setLastRoundScore(0);
    setLastFoundIds(new Set());
    setDifficulty(diff);
    setNewAchievements([]);
    setUsedPowerUps([]);
    setTotalRunTime(0);
    setIronFailedRound(null);
    consecutivePerfectsRef.current = 0;
    setConsecutivePerfects(0);
    rageMomentsRef.current = [];
    setXpResult(null);
    const daily = mode === 'daily';
    setIsDaily(daily);
    gameStatsRef.current = {
      totalDetected: 0, certainlyCount: 0, openerCount: 0,
      disclaimerCount: 0, maxCombo: 0, perfectRounds: 0,
      bestTimeLeft: 0, bestRoundScore: 0, totalScore: 0,
      roundsCompleted: 0, usedRadar: false, powerUpsUsed: 0,
      completedChaos: false, isDaily: daily,
      // New tracking for added achievements
      wrongClicksTotal: 0,
      maxConsecutivePerfects: 0,
      bossPerfect: false,
      inversePerfect: false,
      completedBrainrot: false,
      completedIron: false,
      ironFailedRound: null,
      difficulty: diff,
      newLevel: 0,
    };
    setGameState(STATE.ROUND_INTRO);
  }, []);

  const handleRoundReady = useCallback(() => {
    setGameState(STATE.PLAYING);
  }, []);

  // Called at the very end of a game (normal finish or iron game-over)
  const finaliseGame = useCallback((finalScore, stats) => {
    const xpEarned = calculateXP(finalScore, stats.perfectRounds, difficulty);
    const result = addXP(xpEarned);
    setXpResult({ xpEarned, ...result });
    incrementSlopIndex(stats.totalDetected);
    submitGlobalSlopIndex(stats.totalDetected);
  }, [difficulty]);

  const handleRoundEnd = useCallback((score, foundIds, time = 0, wrongClicks = 0, isGameOver = false, foundCombos = {}) => {
    setLastRoundScore(score);
    setLastFoundIds(foundIds);
    setLastFoundCombos(foundCombos);
    setLastWrongClicks(wrongClicks);
    setLastTimeLeft(time);
    setTotalScore(prev => prev + score);
    setRoundScores(prev => [...prev, score]);

    if (difficulty === 'iron') {
      setTotalRunTime(prev => prev + time);
    }

    // Update per-game stats
    const round = rounds[roundIdx];
    // Inverse rounds: only the human-type phrases are targets (AI-type are decoys).
    const totalPhrasesInRound = round?.inverse
      ? (round.slopPhrases?.filter(p => p.type === 'human').length ?? 0)
      : (round?.slopPhrases?.length ?? 0);
    const foundInRound = foundIds.size;
    const stats = gameStatsRef.current;
    stats.totalDetected += foundInRound;
    stats.roundsCompleted += 1;
    if (score > stats.bestRoundScore) stats.bestRoundScore = score;
    if (difficulty !== 'iron' && time > stats.bestTimeLeft) stats.bestTimeLeft = time;
    const wasPerfect = foundInRound >= totalPhrasesInRound && totalPhrasesInRound > 0;
    if (wasPerfect) stats.perfectRounds += 1;
    if (wasPerfect) consecutivePerfectsRef.current += 1;
    else consecutivePerfectsRef.current = 0;
    if (consecutivePerfectsRef.current > (stats.maxConsecutivePerfects || 0)) {
      stats.maxConsecutivePerfects = consecutivePerfectsRef.current;
    }
    setConsecutivePerfects(consecutivePerfectsRef.current);
    stats.wrongClicksTotal = (stats.wrongClicksTotal || 0) + wrongClicks;
    if (wasPerfect && round?.boss) stats.bossPerfect = true;
    if (wasPerfect && round?.inverse) stats.inversePerfect = true;
    if (round?.slopPhrases) {
      round.slopPhrases.forEach((p) => {
        if (p.type === 'opener') stats.openerCount = (stats.openerCount || 0) + 1;
        if (p.type === 'disclaimer') stats.disclaimerCount = (stats.disclaimerCount || 0) + 1;
        if (p.text === 'Certainly!') stats.certainlyCount = (stats.certainlyCount || 0) + 1;
      });
    }

    if (isGameOver) {
      setIronFailedRound(roundIdx + 1);
      stats.ironFailedRound = roundIdx + 1;
      stats.totalScore = totalScore + score;
      // finaliseGame runs addXP — do it FIRST so level-based achievements see the new level.
      finaliseGame(stats.totalScore, stats);
      stats.newLevel = getLevelFromXP(getXPData().xp || 0).level;
      const unlocked = checkAndUnlockAchievements(stats);
      updateStats({ ...stats, gamesPlayed: 1 });
      unlocked.forEach((ach, i) => { setTimeout(() => showAchievement(ach), i * 800); });
      setNewAchievements(unlocked);
      setGameState(STATE.RESULT);
      return;
    }

    setGameState(STATE.ROUND_SUMMARY);
  }, [rounds, roundIdx, difficulty, totalScore, finaliseGame]);

  const handleNextRound = useCallback(() => {
    const nextIdx = roundIdx + 1;
    if (nextIdx >= rounds.length) {
      // Game complete — check achievements
      const stats = gameStatsRef.current;
      stats.totalScore = totalScore;
      if (difficulty === 'chaos') stats.completedChaos = true;
      if (difficulty === 'brainrot') stats.completedBrainrot = true;
      if (difficulty === 'iron') stats.completedIron = true;

      // Iron detector: award speed bonus on successful full completion
      if (difficulty === 'iron') {
        const speedBonus = Math.max(0, 15000 - totalRunTime * 15);
        if (speedBonus > 0) setTotalScore(prev => prev + speedBonus);
      }

      // finaliseGame runs addXP — do it FIRST so level-based achievements see the new level.
      finaliseGame(totalScore, stats);
      stats.newLevel = getLevelFromXP(getXPData().xp || 0).level;
      const unlocked = checkAndUnlockAchievements(stats);
      updateStats({ ...stats, gamesPlayed: 1 });

      unlocked.forEach((ach, i) => {
        setTimeout(() => showAchievement(ach), i * 800);
      });
      setNewAchievements(unlocked);
      setGameState(STATE.RESULT);
    } else {
      setRoundIdx(nextIdx);
      setGameState(STATE.ROUND_INTRO);
    }
  }, [roundIdx, rounds.length, totalScore, roundScores, difficulty, totalRunTime, finaliseGame]);

  const handleRestart = useCallback(() => {
    stopMusic();
    setCommunitySeed(null);
    setGameState(STATE.START);
  }, []);

  const openCommunityMenu = useCallback(() => setGameState(STATE.COMMUNITY_MENU), []);
  const openCommunityCreate = useCallback(() => setGameState(STATE.COMMUNITY_CREATE), []);
  const openCommunityDetail = useCallback((seed) => {
    setCommunityDetailSeed(seed);
    setGameState(STATE.COMMUNITY_DETAIL);
  }, []);
  const handleCommunityCreated = useCallback((seed) => {
    setCommunityDetailSeed(seed);
    setGameState(STATE.COMMUNITY_DETAIL);
  }, []);
  const handleCommunityPlay = useCallback(({ set, rounds: roundsFromSet }) => {
    handleStart({
      difficulty: 'normal',
      mode: 'community',
      musicEnabled,
      lang: set.lang || 'en',
      communitySet: { set, rounds: roundsFromSet },
    });
  }, [handleStart, musicEnabled]);

  // Submit community score in addition to / instead of global leaderboard
  const submitCommunityScoreOverride = useCallback(async (score, initials) => {
    if (!communitySeed) return null;
    await submitSetScore({
      seed: communitySeed,
      score,
      initials: initials.toUpperCase().slice(0, 6).padEnd(3, '·'),
      timestamp: Date.now(),
    });
    return null; // no local rank
  }, [communitySeed]);

  const handleRageClick = useCallback(({ word, round }) => {
    if (rageMomentsRef.current.length < 3) {
      rageMomentsRef.current = [...rageMomentsRef.current, { word, round }];
    }
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
        <Starfield />
        {gameState === STATE.START && (
          <StartScreen onStart={handleStart} onOpenCommunity={openCommunityMenu} />
        )}

        {gameState === STATE.COMMUNITY_MENU && (
          <CommunityMenu
            lang={lang}
            onBack={() => setGameState(STATE.START)}
            onOpenCreate={openCommunityCreate}
            onOpenSet={openCommunityDetail}
          />
        )}

        {gameState === STATE.COMMUNITY_CREATE && (
          <CreateSet
            lang={lang}
            onBack={() => setGameState(STATE.COMMUNITY_MENU)}
            onCreated={handleCommunityCreated}
          />
        )}

        {gameState === STATE.COMMUNITY_DETAIL && communityDetailSeed && (
          <SetDetail
            seed={communityDetailSeed}
            onBack={() => setGameState(STATE.COMMUNITY_MENU)}
            onPlay={handleCommunityPlay}
          />
        )}

        {gameState === STATE.ROUND_INTRO && currentRound && (
          <RoundIntro
            round={currentRound}
            totalRounds={rounds.length}
            difficulty={difficulty}
            lang={lang}
            musicEnabled={musicEnabled}
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
            lang={lang}
            musicEnabled={musicEnabled}
            onRoundEnd={handleRoundEnd}
            onPowerUpUsed={handlePowerUpUsed}
            usedPowerUps={usedPowerUps}
            onRageClick={handleRageClick}
          />
        )}

        {gameState === STATE.ROUND_SUMMARY && currentRound && (
          <RoundSummary
            round={currentRound}
            roundScore={lastRoundScore}
            foundIds={lastFoundIds}
            foundCombos={lastFoundCombos}
            totalScore={totalScore}
            isLastRound={roundIdx >= rounds.length - 1}
            wrongClicks={lastWrongClicks}
            timeLeft={lastTimeLeft}
            lang={lang}
            musicEnabled={musicEnabled}
            consecutivePerfects={consecutivePerfects}
            roundNumber={roundIdx + 1}
            difficulty={difficulty}
            onNext={handleNextRound}
          />
        )}

        {gameState === STATE.RESULT && (
          <ResultScreen
            totalScore={totalScore}
            roundScores={roundScores}
            newAchievements={newAchievements}
            difficulty={difficulty}
            totalRunTime={totalRunTime}
            ironFailedRound={ironFailedRound}
            totalRounds={rounds.length}
            isDaily={isDaily}
            xpResult={xpResult}
            rageMoments={rageMomentsRef.current}
            communitySeed={communitySeed}
            onSubmitCommunityScore={communitySeed ? submitCommunityScoreOverride : null}
            onRestart={handleRestart}
          />
        )}
      </div>

      {/* Achievement toasts render outside game-container to avoid clipping */}
      <AchievementToastLayer />
    </>
  );
}
