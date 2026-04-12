import { useState, useEffect, useCallback, useRef } from 'react';
import SlopText from './SlopText';
import PowerUps from './PowerUps';
import { PopupLayer, usePopups } from './ScorePopup';
import { playRoundComplete, playMiss } from '../utils/audio';

const ROUND_TIME_NORMAL = 45;
const ROUND_TIME_CHAOS = 25;
const ROUND_TIME_BRAINROT = 40;
const TIME_BONUS_PER_SEC = 10;

const MISS_TAUNTS = [
  "That's just a word 💀",
  "AS AN AI: CERTAINLY WRONG",
  "I hope this helps: NO.",
  "Not slop. Or is it? It's not.",
  "Holistically speaking, wrong.",
  "Furthermore... nope.",
  "That being said: WRONG",
  "In conclusion: not slop",
  "CERTAINLY not that one!",
  "With all due respect... no.",
  "Touch grass. That's normal text.",
  "I cannot assist with that click.",
  "My training data is cringing.",
  "Error 404: Slop not found.",
  "Would you like to elaborate? That was wrong.",
  "Leveraging the wrong word, as always.",
  "Please note this is NOT slop.",
];

const INVERSE_MISS_TAUNTS = [
  "That's AI slop! Find the HUMAN! 🧠",
  "Wrong direction — that's robot text.",
  "Certainly! That phrase is pure AI. Keep looking.",
  "The robot approves. That's bad.",
  "That was generated, not felt.",
  "SLOP DETECTED — but not what we want!",
  "The machine is pleased you clicked its words.",
  "Moreover, that was the wrong click.",
  "No human wrote that. Trust your instincts.",
  "That's boilerplate. The human is hiding deeper.",
  "I hope this helps: it doesn't, that's AI.",
  "Holistically speaking: robot wrote that part.",
];

const getComboStyle = (c) => {
  if (c >= 5) return { emoji: '🌈', color: '#a78bfa', rainbow: true };
  if (c >= 4) return { emoji: '💥', color: '#ec4899', rainbow: false };
  if (c >= 3) return { emoji: '⚡', color: '#38bdf8', rainbow: false };
  return { emoji: '🔥', color: '#fbbf24', rainbow: false };
};

function TimerBar({ timeLeft, total }) {
  const pct = (timeLeft / total) * 100;
  let color = '#10b981';
  if (pct < 50) color = '#fbbf24';
  if (pct < 25) color = '#ef4444';

  return (
    <div className="timer-bar-track">
      <div
        className="timer-bar-fill"
        style={{ width: `${pct}%`, background: color, boxShadow: `0 0 8px ${color}` }}
      />
    </div>
  );
}

function SlopMeter({ found, total }) {
  const pct = total > 0 ? (found / total) * 100 : 0;
  let color = '#ef4444';
  if (pct >= 50) color = '#fbbf24';
  if (pct >= 80) color = '#10b981';
  if (pct >= 100) color = '#a78bfa';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <div style={{ fontSize: '0.6rem', color: '#64748b', fontFamily: "'Orbitron', sans-serif", whiteSpace: 'nowrap' }}>
        SLOP {found}/{total}
      </div>
      <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden', minWidth: 50 }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: color,
          borderRadius: 3,
          transition: 'width 0.3s ease, background 0.5s',
          boxShadow: pct >= 100 ? `0 0 6px ${color}` : 'none',
        }} />
      </div>
    </div>
  );
}

export default function GameScreen({ round, roundIdx, totalRounds, totalScore, onRoundEnd, difficulty = 'normal', onPowerUpUsed, usedPowerUps = [] }) {
  const isBrainrot = difficulty === 'brainrot';
  const ROUND_TIME = difficulty === 'chaos' ? ROUND_TIME_CHAOS : isBrainrot ? ROUND_TIME_BRAINROT : ROUND_TIME_NORMAL;
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [roundScore, setRoundScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [foundIds, setFoundIds] = useState(new Set());
  const [timerRunning, setTimerRunning] = useState(true);
  const [shakeHeader, setShakeHeader] = useState(false);
  const [typingDone, setTypingDone] = useState(false);
  const [meltdownClicks, setMeltdownClicks] = useState(0);
  const [meltdownActive, setMeltdownActive] = useState(false);
  const [corruptionCount, setCorruptionCount] = useState(0);

  // Power-ups (usedPowerUps comes from App so it persists across rounds)
  const [activePowerUp, setActivePowerUp] = useState(null);
  const [radarActive, setRadarActive] = useState(false);
  const [doublePoints, setDoublePoints] = useState(false);
  const powerUpTimerRef = useRef(null);

  const { popups, addPopup } = usePopups();
  const comboTimeoutRef = useRef(null);

  // Slop meter stats
  const totalSlop = round.slopPhrases.length;
  const foundSlop = foundIds.size;

  // Timer countdown
  useEffect(() => {
    if (!timerRunning) return;
    if (timeLeft <= 0) {
      setTimerRunning(false);
      setTimeout(() => onRoundEnd(roundScore, foundIds, timeLeft), 600);
      return;
    }
    const t = setTimeout(() => {
      setTimeLeft(t => t - 1);
      if (timeLeft === 10) setShakeHeader(true);
    }, 1000);
    return () => clearTimeout(t);
  }, [timeLeft, timerRunning, roundScore, foundIds, onRoundEnd]);

  useEffect(() => {
    if (shakeHeader) {
      const t = setTimeout(() => setShakeHeader(false), 500);
      return () => clearTimeout(t);
    }
  }, [shakeHeader]);

  const handleScore = useCallback((score, x, y, commentary, isDoubled) => {
    setRoundScore(prev => prev + score);
    setTimeLeft(prev => Math.min(prev + 1, ROUND_TIME + 60)); // +1s per correct slop
    addPopup(x, y, score, commentary, isDoubled);
  }, [addPopup, ROUND_TIME]);

  const handleCombo = useCallback((newCombo) => {
    setCombo(newCombo);
    if (comboTimeoutRef.current) clearTimeout(comboTimeoutRef.current);
    comboTimeoutRef.current = setTimeout(() => setCombo(0), 3000);
  }, []);

  const isInverse = !!round.inverse;

  const WRONG_PENALTY = 50;
  const handleWrongClick = useCallback((x, y) => {
    setRoundScore(prev => Math.max(0, prev - WRONG_PENALTY));
    setCombo(0);
    if (comboTimeoutRef.current) clearTimeout(comboTimeoutRef.current);
    const pool = isInverse ? INVERSE_MISS_TAUNTS : MISS_TAUNTS;
    const taunt = pool[Math.floor(Math.random() * pool.length)];
    addPopup(x, y, WRONG_PENALTY, taunt, false, true);
  }, [addPopup, isInverse]);

  const handleFinishEarly = () => {
    if (!timerRunning) return;
    setTimerRunning(false);
    playRoundComplete();
    const timeBonus = timeLeft * TIME_BONUS_PER_SEC;
    if (timeBonus > 0) {
      addPopup(
        Math.round(window.innerWidth / 2),
        160,
        timeBonus,
        `⏱ ${timeLeft}s TIME BONUS!`,
        false,
        false,
      );
      setTimeout(() => onRoundEnd(roundScore + timeBonus, foundIds, timeLeft), 1600);
    } else {
      setTimeout(() => onRoundEnd(roundScore, foundIds, timeLeft), 400);
    }
  };

  const handlePowerUp = (id) => {
    if (usedPowerUps.includes(id)) return;
    setActivePowerUp(id);
    if (powerUpTimerRef.current) clearTimeout(powerUpTimerRef.current);
    onPowerUpUsed?.(id); // App.jsx updates the persisted usedPowerUps

    if (id === 'radar') {
      setRadarActive(true);
      powerUpTimerRef.current = setTimeout(() => {
        setRadarActive(false);
        setActivePowerUp(null);
      }, 3000);
    } else if (id === 'time') {
      setTimeLeft(t => Math.min(t + 15, ROUND_TIME + 15));
      setActivePowerUp(null);
    } else if (id === 'double') {
      setDoublePoints(true);
      powerUpTimerRef.current = setTimeout(() => {
        setDoublePoints(false);
        setActivePowerUp(null);
      }, 10000);
    }
  };

  const isUrgent = timeLeft <= 10;
  const isDoubleActive = doublePoints || isInverse;
  const accentColor = isInverse ? '#38bdf8' : '#fbbf24';
  const accentGlow = isInverse ? 'rgba(56,189,248,0.5)' : 'rgba(251,191,36,0.5)';

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      zIndex: 1,
      overflow: 'hidden',
      background: isUrgent
        ? 'rgba(239,68,68,0.04)'
        : isInverse
        ? 'rgba(56,189,248,0.03)'
        : isDoubleActive
        ? 'rgba(251,191,36,0.03)'
        : 'transparent',
      transition: 'background 0.5s',
    }}>
      <PopupLayer popups={popups} />

      {/* SloppyGPT meltdown easter egg overlay */}
      {meltdownActive && (
        <div
          onClick={() => { setMeltdownActive(false); setMeltdownClicks(0); }}
          style={{
            position: 'fixed', inset: 0, zIndex: 10000,
            background: 'rgba(239,68,68,0.95)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '16px', cursor: 'pointer',
            animation: 'meltdown-glitch 0.12s ease infinite',
          }}
        >
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 'clamp(0.85rem,3vw,1.3rem)', color: 'white', textAlign: 'center', lineHeight: 1.8 }}>
            ⚠️ CRITICAL<br/>SLOP OVERLOAD
          </div>
          <div style={{ fontSize: '2.8rem', animation: 'wiggle 0.25s ease infinite' }}>💀🤖💀</div>
          <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '0.68rem', color: 'rgba(255,255,255,0.9)', textAlign: 'center', maxWidth: '280px', lineHeight: 1.7 }}>
            SloppyGPT™ has encountered too many wrong clicks.<br/>
            Initiating emergency cringe protocols...<br/>
            <span style={{ opacity: 0.7 }}>Certainly! I hope this helps! Moreover—</span>
          </div>
          <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '0.58rem', color: 'rgba(255,255,255,0.5)', marginTop: '8px' }}>
            TAP TO REBOOT
          </div>
        </div>
      )}

      {/* Header */}
      <div
        className="safe-top"
        style={{
          padding: '10px 14px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          borderBottom: `1px solid ${isInverse ? 'rgba(56,189,248,0.35)' : isDoubleActive ? 'rgba(251,191,36,0.3)' : 'rgba(124,58,237,0.2)'}`,
          background: 'rgba(15,15,26,0.97)',
          backdropFilter: 'blur(10px)',
          animation: shakeHeader ? 'shake 0.4s ease' : 'none',
          flexShrink: 0,
          transition: 'border-color 0.3s',
        }}
      >
        {/* Top row: round info + score */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.6rem', color: '#64748b', fontFamily: "'Orbitron', sans-serif" }}>
              ROUND {roundIdx + 1}/{totalRounds}
              {difficulty === 'chaos' && (
                <span style={{ color: '#ef4444', marginLeft: 6 }}>⚡ CHAOS</span>
              )}
              {isBrainrot && (
                <span style={{ color: '#fb923c', marginLeft: 6 }}>🧠 BRAINROT</span>
              )}
            </div>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '0.78rem', fontWeight: 700, color: '#e2e8f0' }}>
              {round.emoji} {round.title}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.55rem', color: '#64748b', fontFamily: "'Orbitron', sans-serif" }}>TOTAL</div>
            <div style={{
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 900,
              fontSize: '0.95rem',
              color: '#fbbf24',
              textShadow: '0 0 8px #fbbf24',
            }}>
              {(totalScore + roundScore).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Timer + slop meter row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TimerBar timeLeft={timeLeft} total={ROUND_TIME} />
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '0.7rem',
            color: isUrgent ? '#ef4444' : '#94a3b8',
            minWidth: '24px',
            textAlign: 'right',
            textShadow: isUrgent ? '0 0 8px #ef4444' : 'none',
            animation: isUrgent ? 'pulse 0.5s ease-in-out infinite' : 'none',
          }}>
            {timeLeft}
          </div>
        </div>

        {/* Slop meter + power-ups row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
          <SlopMeter found={foundSlop} total={totalSlop} />
          <PowerUps
            used={usedPowerUps}
            active={activePowerUp}
            onUse={handlePowerUp}
          />
        </div>

        {/* Combo badge */}
        {combo > 1 && (() => {
          const cs = getComboStyle(combo);
          return (
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <div className="combo-badge" style={{
                background: cs.rainbow
                  ? 'linear-gradient(135deg,#ff0080,#ff8000,#ffff00,#00ff80,#0080ff,#8000ff)'
                  : `linear-gradient(135deg, ${cs.color}, ${cs.color}bb)`,
                color: cs.rainbow ? 'white' : '#0f0f1a',
                textShadow: cs.rainbow ? '0 1px 3px rgba(0,0,0,0.5)' : 'none',
                boxShadow: `0 0 14px ${cs.color}`,
                animation: cs.rainbow ? 'wiggle 0.4s ease, rainbow-bg 1s linear infinite' : 'wiggle 0.5s ease',
              }}>
                {cs.emoji} {combo}x COMBO!
              </div>
              {isDoubleActive && (
                <div style={{
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  color: '#0f0f1a',
                  fontFamily: "'Orbitron', sans-serif",
                  fontWeight: 900,
                  borderRadius: '8px',
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                }}>
                  💥 2X ACTIVE!
                </div>
              )}
            </div>
          );
        })()}
        {combo <= 1 && isDoubleActive && (
          <div style={{
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            color: '#0f0f1a',
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 900,
            borderRadius: '8px',
            padding: '4px 10px',
            fontSize: '0.75rem',
            alignSelf: 'flex-start',
          }}>
            💥 DOUBLE POINTS ACTIVE!
          </div>
        )}

        <style>{`
          @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)} }
          @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
          @keyframes wiggle { 0%,100%{transform:rotate(0)} 25%{transform:rotate(-4deg)} 75%{transform:rotate(4deg)} }
          @keyframes rainbow-bg { 0%{filter:hue-rotate(0deg)} 100%{filter:hue-rotate(360deg)} }
          @keyframes meltdown-glitch { 0%,100%{transform:translate(0)} 20%{transform:translate(-4px,2px)} 40%{transform:translate(4px,-2px)} 60%{transform:translate(-2px,4px)} 80%{transform:translate(2px,-4px)} }
          @keyframes slide-in-up { from{transform:translateY(12px);opacity:0} to{transform:translateY(0);opacity:1} }
        `}</style>
      </div>

      {/* Context strip */}
      <div style={{
        background: 'rgba(124, 58, 237, 0.06)',
        borderBottom: '1px solid rgba(124,58,237,0.12)',
        padding: '6px 14px',
        fontSize: '0.72rem',
        color: '#94a3b8',
        fontStyle: 'italic',
        flexShrink: 0,
      }}>
        💬 {round.context}
      </div>

      {/* Scrollable text area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '14px',
        WebkitOverflowScrolling: 'touch',
      }}>
        {/* SloppyGPT header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '12px',
          padding: '8px 12px',
          background: 'rgba(26,26,46,0.8)',
          borderRadius: '12px',
          border: `1px solid ${radarActive ? 'rgba(16,185,129,0.4)' : 'rgba(124,58,237,0.2)'}`,
          transition: 'border-color 0.3s',
        }}>
          <div
            onClick={() => {
              const next = meltdownClicks + 1;
              setMeltdownClicks(next);
              if (next >= 5) setMeltdownActive(true);
            }}
            title={meltdownClicks > 0 && meltdownClicks < 5 ? `${5 - meltdownClicks} more...` : ''}
            style={{
              width: 30, height: 30,
              borderRadius: '50%',
              background: radarActive
                ? 'linear-gradient(135deg, #10b981, #3b82f6)'
                : meltdownActive
                ? 'linear-gradient(135deg, #ef4444, #7c3aed)'
                : 'linear-gradient(135deg, #10b981, #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.85rem', flexShrink: 0,
              transition: 'background 0.3s',
              cursor: 'pointer',
              animation: meltdownActive ? 'meltdown-glitch 0.2s ease infinite' : 'none',
            }}
          >
            {meltdownActive ? '💀' : radarActive ? '📡' : '🤖'}
          </div>
          <div>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '0.65rem', color: '#a78bfa' }}>SloppyGPT™</div>
            <div style={{ fontSize: '0.6rem', color: '#475569' }}>
              {radarActive ? 'SLOP RADAR ACTIVE' : 'Professional Slop Generator'}
            </div>
          </div>
          <div style={{
            marginLeft: 'auto',
            background: isInverse
              ? 'rgba(56,189,248,0.15)'
              : doublePoints ? 'rgba(251,191,36,0.15)' : 'rgba(251,191,36,0.08)',
            border: `1px solid ${isInverse
              ? 'rgba(56,189,248,0.6)'
              : doublePoints ? 'rgba(251,191,36,0.6)' : 'rgba(251,191,36,0.2)'}`,
            borderRadius: '6px',
            padding: '3px 8px',
            fontSize: '0.6rem',
            color: accentColor,
            fontFamily: "'Orbitron', sans-serif",
            whiteSpace: 'nowrap',
          }}>
            {isInverse ? '🧠 FIND HUMANS!' : doublePoints ? '💥 2X!' : 'TAP SLOP!'}
          </div>
        </div>

        {/* Brainrot mode alert banner */}
        {isBrainrot && (
          <div style={{
            marginBottom: '10px',
            padding: '7px 14px',
            background: 'rgba(249,115,22,0.08)',
            border: '1px solid rgba(249,115,22,0.3)',
            borderRadius: '10px',
            fontSize: '0.68rem',
            color: '#fb923c',
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 700,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span>🧠 BRAINROT — wrong clicks corrupt the text!</span>
            {corruptionCount > 0 && (
              <span style={{ color: corruptionCount > 10 ? '#ef4444' : '#fb923c' }}>
                ☣️ {corruptionCount} corrupted
              </span>
            )}
          </div>
        )}

        {/* Inverse mode alert banner */}
        {isInverse && (
          <div style={{
            marginBottom: '10px',
            padding: '8px 14px',
            background: 'rgba(56,189,248,0.1)',
            border: '1px solid rgba(56,189,248,0.35)',
            borderRadius: '10px',
            fontSize: '0.7rem',
            color: '#38bdf8',
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 700,
            textAlign: 'center',
            animation: 'slide-in-up 0.4s ease',
          }}>
            ⚠️ INVERSE ROUND — Click the HUMAN phrases, not the AI slop! · 2x POINTS
          </div>
        )}

        <SlopText
          round={round}
          onScore={handleScore}
          onCombo={handleCombo}
          combo={combo}
          found={foundIds}
          onFoundChange={setFoundIds}
          onWrongClick={handleWrongClick}
          radarActive={radarActive}
          doublePoints={isDoubleActive}
          brainrot={isBrainrot}
          onCorruptionChange={setCorruptionCount}
          onTypingComplete={() => setTypingDone(true)}
        />
      </div>

      {/* Bottom bar */}
      <div className="safe-bottom" style={{
        padding: '8px 14px',
        borderTop: '1px solid rgba(124,58,237,0.2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(15,15,26,0.97)',
        flexShrink: 0,
      }}>
        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
          Round: <span style={{ color: '#e2e8f0', fontWeight: 700 }}>{roundScore.toLocaleString()}</span>
          {timeLeft > 0 && (
            <span style={{ color: '#475569', marginLeft: 6, fontSize: '0.62rem' }}>
              +{timeLeft * TIME_BONUS_PER_SEC} bonus
            </span>
          )}
        </div>
        <button
          className="btn-secondary"
          onClick={handleFinishEarly}
          style={{ padding: '7px 14px', fontSize: '0.72rem' }}
        >
          DONE ⏱→
        </button>
      </div>
    </div>
  );
}
