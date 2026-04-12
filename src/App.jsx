import { useState, useCallback } from 'react';
import StartScreen from './components/StartScreen';
import RoundIntro from './components/RoundIntro';
import GameScreen from './components/GameScreen';
import RoundSummary from './components/RoundSummary';
import ResultScreen from './components/ResultScreen';
import { ROUNDS } from './data/slopData';
import { stopMusic } from './utils/audio';

const STATE = {
  START: 'start',
  ROUND_INTRO: 'round_intro',
  PLAYING: 'playing',
  ROUND_SUMMARY: 'round_summary',
  RESULT: 'result',
};

export default function App() {
  const [gameState, setGameState] = useState(STATE.START);
  const [roundIdx, setRoundIdx] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [roundScores, setRoundScores] = useState([]);
  const [lastRoundScore, setLastRoundScore] = useState(0);
  const [lastFoundIds, setLastFoundIds] = useState(new Set());

  const handleStart = useCallback(() => {
    setRoundIdx(0);
    setTotalScore(0);
    setRoundScores([]);
    setLastRoundScore(0);
    setLastFoundIds(new Set());
    setGameState(STATE.ROUND_INTRO);
  }, []);

  const handleRoundReady = useCallback(() => {
    setGameState(STATE.PLAYING);
  }, []);

  const handleRoundEnd = useCallback((score, foundIds) => {
    setLastRoundScore(score);
    setLastFoundIds(foundIds);
    setTotalScore(prev => prev + score);
    setRoundScores(prev => [...prev, score]);
    setGameState(STATE.ROUND_SUMMARY);
  }, []);

  const handleNextRound = useCallback(() => {
    const nextIdx = roundIdx + 1;
    if (nextIdx >= ROUNDS.length) {
      setGameState(STATE.RESULT);
    } else {
      setRoundIdx(nextIdx);
      setGameState(STATE.ROUND_INTRO);
    }
  }, [roundIdx]);

  const handleRestart = useCallback(() => {
    stopMusic();
    setGameState(STATE.START);
  }, []);

  const currentRound = ROUNDS[roundIdx];

  return (
    <div className="game-container">
      {gameState === STATE.START && (
        <StartScreen onStart={handleStart} />
      )}

      {gameState === STATE.ROUND_INTRO && (
        <RoundIntro
          round={currentRound}
          totalRounds={ROUNDS.length}
          onReady={handleRoundReady}
        />
      )}

      {gameState === STATE.PLAYING && (
        <GameScreen
          key={`game-${roundIdx}`}
          round={currentRound}
          roundIdx={roundIdx}
          totalRounds={ROUNDS.length}
          totalScore={totalScore}
          onRoundEnd={handleRoundEnd}
        />
      )}

      {gameState === STATE.ROUND_SUMMARY && (
        <RoundSummary
          round={currentRound}
          roundScore={lastRoundScore}
          foundIds={lastFoundIds}
          totalScore={totalScore}
          isLastRound={roundIdx >= ROUNDS.length - 1}
          onNext={handleNextRound}
        />
      )}

      {gameState === STATE.RESULT && (
        <ResultScreen
          totalScore={totalScore}
          roundScores={roundScores}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
