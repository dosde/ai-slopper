import { useState, useEffect, useCallback, useRef } from 'react';
import SlopText, { getSlopStats } from './SlopText';
import PowerUps from './PowerUps';
import { PopupLayer, usePopups } from './ScorePopup';
import { playRoundComplete, playMiss, setMusicTempo, startMusic, startBossMusic, startInverseMusic, stopInverseMusic, stopMusic } from '../utils/audio';
import { t } from '../i18n/index';

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

const ROUND_TIME_BOSS = 60;

export default function GameScreen({ round, roundIdx, totalRounds, totalScore, onRoundEnd, difficulty = 'normal', lang = 'en', musicEnabled = true, onPowerUpUsed, usedPowerUps = [], onRageClick }) {
  const isBrainrot = difficulty === 'brainrot';
  const isIronDetector = difficulty === 'iron';
  const isBoss = !!round.boss;
  const isInverse = !!round.inverse;
  const ROUND_TIME = isBoss ? ROUND_TIME_BOSS : difficulty === 'chaos' ? ROUND_TIME_CHAOS : isBrainrot ? ROUND_TIME_BRAINROT : ROUND_TIME_NORMAL;
  const [timeLeft, setTimeLeft] = useState(isIronDetector ? 0 : ROUND_TIME);
  const [roundScore, setRoundScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [foundIds, setFoundIds] = useState(new Set());
  const [timerRunning, setTimerRunning] = useState(true);
  const [shakeHeader, setShakeHeader] = useState(false);
  const [typingDone, setTypingDone] = useState(false);
  const [meltdownClicks, setMeltdownClicks] = useState(0);
  const [meltdownActive, setMeltdownActive] = useState(false);
  const [corruptionCount, setCorruptionCount] = useState(0);
  const [wrongClickCount, setWrongClickCount] = useState(0);
  const [comboDecaying, setComboDecaying] = useState(false);
  const [comboFlash, setComboFlash] = useState(false);

  // Power-ups (usedPowerUps comes from App so it persists across rounds)
  const [activePowerUp, setActivePowerUp] = useState(null);
  const [radarActive, setRadarActive] = useState(false);
  const [doublePoints, setDoublePoints] = useState(false);
  const [streakSaverActive, setStreakSaverActive] = useState(false);
  const powerUpTimerRef = useRef(null);

  const { popups, addPopup } = usePopups();
  const comboDecayDelayRef = useRef(null);   // setTimeout ID for the 2s idle delay
  const comboDecayIntervalRef = useRef(null); // setInterval ID for the per-tick decay
  const foundCombosRef = useRef({});
  const ironGameOverRef = useRef(false);
  const allFoundRef = useRef(false);
  const [allFoundFlash, setAllFoundFlash] = useState(false);
  // Always-fresh snapshot of values needed inside iron-mode callbacks
  const liveRef = useRef({});

  // Slop meter stats
  const totalSlop = round.slopPhrases.length;
  const foundSlop = foundIds.size;

  // isUrgent must be declared BEFORE the music-tempo useEffect that lists it as a dependency
  const isUrgent = !isIronDetector && timeLeft <= 10;

  // Keep liveRef in sync every render so effects always have fresh values
  liveRef.current = { roundScore, foundIds, timeLeft, wrongClickCount, onRoundEnd, addPopup };

  // Start music when round mounts. Boss/inverse use their own tracks; regular
  // rounds restart the game music (which was stopped by the previous round's cleanup).
  useEffect(() => {
    if (musicEnabled) {
      if (isBoss) startBossMusic();
      else if (isInverse) startInverseMusic();
      else startMusic();
    }
    return () => { stopMusic(); stopInverseMusic(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Timer (count-down for normal modes, count-up for iron)
  useEffect(() => {
    if (!timerRunning) return;
    if (isIronDetector) {
      const t = setTimeout(() => setTimeLeft(t => t + 1), 1000);
      return () => clearTimeout(t);
    }
    if (timeLeft <= 0) {
      setTimerRunning(false);
      // Use liveRef so any click registered in the 600ms gap is included in the final score.
      setTimeout(() => {
        const { roundScore: rs, foundIds: fi, wrongClickCount: wc, onRoundEnd: cb } = liveRef.current;
        cb(rs, fi, 0, wc, false, foundCombosRef.current);
      }, 600);
      return;
    }
    const t = setTimeout(() => {
      setTimeLeft(t => t - 1);
      if (timeLeft === 10) setShakeHeader(true);
    }, 1000);
    return () => clearTimeout(t);
  }, [timeLeft, timerRunning, roundScore, foundIds, onRoundEnd, isIronDetector, wrongClickCount]);

  // Auto-complete when all phrases found — all modes (reads from liveRef to avoid stale closure)
  useEffect(() => {
    if (allFoundRef.current || !timerRunning || totalSlop === 0 || foundSlop < totalSlop) return;
    allFoundRef.current = true;
    setTimerRunning(false);
    setAllFoundFlash(true);
    playRoundComplete();
    setTimeout(() => {
      setAllFoundFlash(false);
      const { roundScore: rs, foundIds: fi, timeLeft: tl, wrongClickCount: wc, onRoundEnd: cb, addPopup: ap } = liveRef.current;
      if (isIronDetector) { cb(rs, fi, tl, wc, false, foundCombosRef.current); return; }
      const timeBonus = tl * TIME_BONUS_PER_SEC;
      let finalScore = rs;
      if (timeBonus > 0) {
        finalScore += timeBonus;
        ap(Math.round(window.innerWidth / 2), 160, timeBonus, `⏱ ${tl}s TIME BONUS!`, false, false);
      }
      setTimeout(() => cb(finalScore, fi, tl, wc, false, foundCombosRef.current), timeBonus > 0 ? 1000 : 200);
    }, 1800);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [foundSlop, totalSlop]);

  useEffect(() => {
    if (shakeHeader) {
      const t = setTimeout(() => setShakeHeader(false), 500);
      return () => clearTimeout(t);
    }
  }, [shakeHeader]);

  useEffect(() => {
    if (comboFlash) {
      const t = setTimeout(() => setComboFlash(false), 620);
      return () => clearTimeout(t);
    }
  }, [comboFlash]);

  // Speed up music when timer hits danger zone, restore when time is added back
  useEffect(() => {
    setMusicTempo(isUrgent ? 1.4 : 1.0);
  }, [isUrgent]);

  const handleScore = useCallback((score, x, y, commentary, isDoubled, combo, tokenId) => {
    setRoundScore(prev => prev + score);
    if (!isIronDetector) setTimeLeft(prev => Math.min(prev + 1, ROUND_TIME + 60));
    addPopup(x, y, score, commentary, isDoubled, false, combo);
    if (tokenId !== undefined) foundCombosRef.current[tokenId] = { combo, finalScore: score };
  }, [addPopup, ROUND_TIME, isIronDetector]);

  const handleCombo = useCallback((newCombo) => {
    const capped = Math.min(newCombo, 5);
    setCombo(capped);
    setComboDecaying(false);
    // Cancel any pending delay or in-progress decay
    clearTimeout(comboDecayDelayRef.current);
    clearInterval(comboDecayIntervalRef.current);
    comboDecayDelayRef.current = null;
    comboDecayIntervalRef.current = null;
    // Start decay: after 2s of inactivity, reduce combo by 1 every 1.2s
    comboDecayDelayRef.current = setTimeout(() => {
      setComboDecaying(true);
      comboDecayIntervalRef.current = setInterval(() => {
        setCombo(prev => {
          if (prev <= 1) {
            clearInterval(comboDecayIntervalRef.current);
            comboDecayIntervalRef.current = null;
            setComboDecaying(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1200);
    }, 2000);
  }, []);

  const isDoubleActive = doublePoints || isInverse;
  const accentColor = isBoss ? '#ef4444' : isInverse ? '#38bdf8' : '#fbbf24';
  const accentGlow = isBoss ? 'rgba(239,68,68,0.5)' : isInverse ? 'rgba(56,189,248,0.5)' : 'rgba(251,191,36,0.5)';

  const WRONG_PENALTY = 50;
  const handleWrongClick = useCallback((x, y, tokenText) => {
    // Streak Saver absorbs one wrong click — no combo break, no score penalty
    if (streakSaverActive && !isIronDetector) {
      setStreakSaverActive(false);
      setActivePowerUp(null);
      addPopup(x, y, 0, '🛡️ STREAK SAVED!', false, false);
      return;
    }
    if (isIronDetector) {
      if (ironGameOverRef.current) return;
      ironGameOverRef.current = true;
      setTimerRunning(false);
      playMiss();
      addPopup(x, y, 0, '☠ RUN TERMINATED!', false, true);
      setTimeout(() => {
        const { roundScore: rs, foundIds: fi, timeLeft: tl, onRoundEnd: cb } = liveRef.current;
        cb(rs, fi, tl, 1, true, foundCombosRef.current);
      }, 1400);
      return;
    }
    setRoundScore(prev => prev - WRONG_PENALTY);
    setComboFlash(true);
    setCombo(0);
    setComboDecaying(false);
    setWrongClickCount(prev => prev + 1);
    clearTimeout(comboDecayDelayRef.current);
    clearInterval(comboDecayIntervalRef.current);
    comboDecayDelayRef.current = null;
    comboDecayIntervalRef.current = null;
    if (tokenText) onRageClick?.({ word: tokenText, round: roundIdx + 1 });
    const pool = isInverse ? INVERSE_MISS_TAUNTS : MISS_TAUNTS;
    const taunt = pool[Math.floor(Math.random() * pool.length)];
    addPopup(x, y, WRONG_PENALTY, taunt, false, true);
  }, [addPopup, isInverse, isIronDetector, roundScore, foundIds, timeLeft, onRoundEnd, onRageClick, roundIdx]);

  const handleFinishEarly = () => {
    if (!timerRunning) return;
    setTimerRunning(false);
    playRoundComplete();
    if (isIronDetector) {
      setTimeout(() => onRoundEnd(roundScore, foundIds, timeLeft, wrongClickCount, false, foundCombosRef.current), 400);
      return;
    }

    // Penalty for each unfound slop phrase (deduct its full score value)
    const stats = getSlopStats(round, foundIds);
    const missedTokens = stats.tokens.filter(t => !foundIds.has(t.id));
    const missPenalty = missedTokens.reduce((sum, t) => sum + (t.phraseData?.score ?? 80), 0);
    const cx = Math.round(window.innerWidth / 2);

    let finalScore = roundScore;
    let delay = 400;

    if (missPenalty > 0) {
      finalScore -= missPenalty;
      addPopup(cx, 200, missPenalty, `💀 MISSED ${missedTokens.length} — PENALTY!`, false, true);
      delay = 1600;
    }

    // Early finish: time bonus is ÷10 (1pt/s) as a penalty for skipping
    const timeBonus = timeLeft;
    if (timeBonus > 0) {
      finalScore += timeBonus;
      addPopup(cx, 160, timeBonus, `⏱ ${timeLeft}s TIME BONUS (÷10)`, false, false);
      delay = 1800;
    }

    setTimeout(() => onRoundEnd(finalScore, foundIds, timeLeft, wrongClickCount, false, foundCombosRef.current), delay);
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
    } else if (id === 'streak') {
      setStreakSaverActive(true);
      // No timer — stays until consumed by a wrong click
    }
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      zIndex: 1,
      overflow: 'hidden',
      background: isUrgent
        ? 'rgba(239,68,68,0.06)'
        : isBoss
        ? 'rgba(239,68,68,0.05)'
        : isInverse
        ? 'rgba(56,189,248,0.03)'
        : isDoubleActive
        ? 'rgba(251,191,36,0.03)'
        : 'transparent',
      transition: 'background 0.5s',
    }}>
      <PopupLayer popups={popups} />

      {/* All-found flash overlay */}
      {allFoundFlash && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9500,
          background: isInverse
            ? 'linear-gradient(135deg, rgba(8,145,178,0.95), rgba(14,116,144,0.9))'
            : 'linear-gradient(135deg, rgba(5,150,105,0.95), rgba(4,120,87,0.9))',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: '16px',
          animation: 'all-found-pop 1.8s ease forwards',
          pointerEvents: 'none',
        }}>
          <div style={{ fontSize: '4rem' }}>{isInverse ? '🧠' : '🏆'}</div>
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'clamp(0.9rem, 3.5vw, 1.3rem)',
            color: 'white',
            textAlign: 'center',
            lineHeight: 2,
            textShadow: '0 0 24px rgba(255,255,255,0.6)',
          }}>
            {isInverse ? 'ALL HUMANS\nRESCUED!' : 'ALL SLOP\nERADICATED!'}
          </div>
          <div style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: '0.95rem',
            color: 'rgba(255,255,255,0.9)',
            fontWeight: 700,
            letterSpacing: '3px',
          }}>
            PERFECT! 💯
          </div>
        </div>
      )}

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
          borderBottom: `1px solid ${isBoss ? 'rgba(239,68,68,0.5)' : isInverse ? 'rgba(56,189,248,0.35)' : isDoubleActive ? 'rgba(251,191,36,0.3)' : 'rgba(124,58,237,0.2)'}`,
          background: isBoss ? 'rgba(15,5,5,0.98)' : 'rgba(15,15,26,0.97)',
          backdropFilter: 'blur(10px)',
          animation: shakeHeader ? 'shake 0.4s ease' : 'none',
          flexShrink: 0,
          transition: 'border-color 0.3s',
        }}
      >
        {/* Top row: round info + score */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.6rem', color: isBoss ? '#fca5a5' : '#64748b', fontFamily: "'Orbitron', sans-serif" }}>
              {t('round', lang)} {roundIdx + 1}/{totalRounds}
              {isBoss && (
                <span style={{ color: '#ef4444', marginLeft: 6, animation: 'boss-flicker 1.2s ease-in-out infinite' }}>⚔️ FINAL BOSS</span>
              )}
              {!isBoss && difficulty === 'chaos' && (
                <span style={{ color: '#ef4444', marginLeft: 6 }}>⚡ CHAOS</span>
              )}
              {isBrainrot && (
                <span style={{ color: '#fb923c', marginLeft: 6 }}>🧠 BRAINROT</span>
              )}
              {isIronDetector && (
                <span style={{ color: '#ec4899', marginLeft: 6 }}>☠ IRON</span>
              )}
            </div>
            <div style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: '0.78rem',
              fontWeight: 700,
              color: isBoss ? '#ef4444' : isInverse ? '#38bdf8' : '#e2e8f0',
              textShadow: isBoss ? '0 0 10px rgba(239,68,68,0.7)' : isInverse ? '0 0 8px rgba(56,189,248,0.6)' : 'none',
            }}>
              {isInverse && <span style={{ fontSize: '0.6rem', marginRight: 4, letterSpacing: 1 }}>🔄 INVERSE</span>}
              {round.emoji} {round.title}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.55rem', color: '#64748b', fontFamily: "'Orbitron', sans-serif" }}>{t('total', lang)}</div>
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
          {isIronDetector ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ fontSize: '0.58rem', color: '#ec4899', fontFamily: "'Orbitron', sans-serif", whiteSpace: 'nowrap', textShadow: '0 0 6px #ec4899' }}>
                ⏱ ELAPSED
              </div>
              <div style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '0.85rem',
                color: '#ec4899',
                textShadow: '0 0 10px #ec4899',
                letterSpacing: '1px',
              }}>
                {`${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')}`}
              </div>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* Slop meter + power-ups row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
          <SlopMeter found={foundSlop} total={totalSlop} />
          <PowerUps
            used={isIronDetector ? [...usedPowerUps, 'time'] : usedPowerUps}
            active={activePowerUp}
            onUse={handlePowerUp}
          />
        </div>

        {/* Combo + double badge row — always rendered so height is always reserved */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', minHeight: '26px' }}>
          {combo > 1 && (() => {
            const cs = getComboStyle(combo);
            return (
              <>
                <div className="combo-badge" style={{
                  background: comboFlash
                    ? 'linear-gradient(135deg, #ef4444, #b91c1c)'
                    : cs.rainbow
                    ? 'linear-gradient(135deg,#ff0080,#ff8000,#ffff00,#00ff80,#0080ff,#8000ff)'
                    : `linear-gradient(135deg, ${cs.color}, ${cs.color}bb)`,
                  color: cs.rainbow ? 'white' : '#0f0f1a',
                  textShadow: cs.rainbow ? '0 1px 3px rgba(0,0,0,0.5)' : 'none',
                  boxShadow: comboFlash ? '0 0 18px #ef4444' : `0 0 14px ${cs.color}`,
                  opacity: comboDecaying ? 0.65 : 1,
                  animation: comboFlash
                    ? 'combo-break 0.62s ease forwards'
                    : cs.rainbow
                    ? 'wiggle 0.4s ease, rainbow-bg 1s linear infinite'
                    : comboDecaying ? 'combo-decay-pulse 0.6s ease-in-out infinite' : 'wiggle 0.5s ease',
                }}>
                  {cs.emoji} {combo}x COMBO!{comboDecaying ? ' ↓' : ''}
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
              </>
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
            }}>
              💥 DOUBLE POINTS ACTIVE!
            </div>
          )}
        </div>

        <style>{`
          @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)} }
          @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
          @keyframes wiggle { 0%,100%{transform:rotate(0)} 25%{transform:rotate(-4deg)} 75%{transform:rotate(4deg)} }
          @keyframes rainbow-bg { 0%{filter:hue-rotate(0deg)} 100%{filter:hue-rotate(360deg)} }
          @keyframes meltdown-glitch { 0%,100%{transform:translate(0)} 20%{transform:translate(-4px,2px)} 40%{transform:translate(4px,-2px)} 60%{transform:translate(-2px,4px)} 80%{transform:translate(2px,-4px)} }
          @keyframes slide-in-up { from{transform:translateY(12px);opacity:0} to{transform:translateY(0);opacity:1} }
          @keyframes inverse-pulse { 0%,100%{box-shadow:0 0 14px rgba(56,189,248,0.3)} 50%{box-shadow:0 0 24px rgba(56,189,248,0.65)} }
          @keyframes combo-decay-pulse { 0%,100%{opacity:0.65;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.96)} }
          @keyframes combo-break { 0%{transform:scale(1.2) rotate(-4deg);opacity:1} 25%{transform:scale(0.9) rotate(3deg)} 60%{transform:scale(1.05) rotate(-1deg)} 100%{transform:scale(1) rotate(0);opacity:0.85} }
          @keyframes boss-flicker { 0%,100%{opacity:1} 50%{opacity:0.65} }
          @keyframes boss-pulse { 0%,100%{box-shadow:0 0 14px rgba(239,68,68,0.3)} 50%{box-shadow:0 0 28px rgba(239,68,68,0.75)} }
          @keyframes all-found-pop { 0%{opacity:0;transform:scale(0.92)} 15%{opacity:1;transform:scale(1)} 80%{opacity:1;transform:scale(1)} 100%{opacity:0;transform:scale(1.04)} }
        `}</style>
      </div>

      {/* Context strip */}
      <div style={{
        background: isInverse ? 'rgba(56,189,248,0.08)' : 'rgba(124, 58, 237, 0.06)',
        borderBottom: isInverse ? '1px solid rgba(56,189,248,0.25)' : '1px solid rgba(124,58,237,0.12)',
        padding: '6px 14px',
        fontSize: '0.72rem',
        color: isInverse ? '#7dd3fc' : '#94a3b8',
        fontStyle: 'italic',
        flexShrink: 0,
        transition: 'background 0.3s, border-color 0.3s, color 0.3s',
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

        {/* Iron detector alert banner */}
        {isIronDetector && (
          <div style={{
            marginBottom: '10px',
            padding: '8px 14px',
            background: 'rgba(236,72,153,0.1)',
            border: '1px solid rgba(236,72,153,0.5)',
            borderRadius: '10px',
            fontSize: '0.7rem',
            color: '#ec4899',
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 700,
            textAlign: 'center',
            animation: 'slide-in-up 0.4s ease',
          }}>
            ☠ IRON DETECTOR — ONE WRONG CLICK = RUN OVER
          </div>
        )}

        {/* Boss round alert banner */}
        {isBoss && (
          <div style={{
            marginBottom: '10px',
            padding: '10px 14px',
            background: 'linear-gradient(90deg, rgba(239,68,68,0.22), rgba(239,68,68,0.08), rgba(239,68,68,0.22))',
            border: '2px solid rgba(239,68,68,0.6)',
            borderRadius: '10px',
            fontSize: '0.72rem',
            color: '#fca5a5',
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 700,
            textAlign: 'center',
            boxShadow: '0 0 16px rgba(239,68,68,0.35)',
            animation: 'slide-in-up 0.4s ease, boss-pulse 2s ease-in-out infinite',
          }}>
            <div style={{ fontSize: '0.85rem', color: '#ef4444', marginBottom: 2, textShadow: '0 0 8px #ef4444' }}>
              ⚔️ FINAL BOSS ROUND
            </div>
            <div style={{ fontSize: '0.65rem', opacity: 0.95 }}>
              {round.slopPhrases?.length ?? '?'} SLOP PHRASES — FIND THEM ALL!
            </div>
          </div>
        )}

        {/* Inverse mode alert banner */}
        {isInverse && (
          <div style={{
            marginBottom: '10px',
            padding: '10px 14px',
            background: 'linear-gradient(90deg, rgba(56,189,248,0.22), rgba(56,189,248,0.08), rgba(56,189,248,0.22))',
            border: '2px solid rgba(56,189,248,0.6)',
            borderRadius: '10px',
            fontSize: '0.72rem',
            color: '#7dd3fc',
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 700,
            textAlign: 'center',
            boxShadow: '0 0 16px rgba(56,189,248,0.35)',
            animation: 'slide-in-up 0.4s ease, inverse-pulse 2s ease-in-out infinite',
            letterSpacing: '0.5px',
          }}>
            <div style={{ fontSize: '0.85rem', color: '#38bdf8', marginBottom: 2, textShadow: '0 0 8px #38bdf8' }}>
              🔄 {t('inverse_header', lang)}
            </div>
            <div style={{ fontSize: '0.65rem', opacity: 0.95 }}>{t('inverse_body', lang)}</div>
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
          lang={lang}
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
          {!isIronDetector && timeLeft > 0 && (
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
          {t('done', lang)} ⏱→
        </button>
      </div>
    </div>
  );
}
