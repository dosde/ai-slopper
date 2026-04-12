import { useState, useEffect, useCallback, useRef } from 'react';
import SlopText from './SlopText';
import PowerUps from './PowerUps';
import { PopupLayer, usePopups } from './ScorePopup';
import { playRoundComplete } from '../utils/audio';

const ROUND_TIME_NORMAL = 45;
const ROUND_TIME_CHAOS = 25;

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

export default function GameScreen({ round, roundIdx, totalRounds, totalScore, onRoundEnd, difficulty = 'normal', onPowerUpUsed }) {
  const ROUND_TIME = difficulty === 'chaos' ? ROUND_TIME_CHAOS : ROUND_TIME_NORMAL;
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [roundScore, setRoundScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [foundIds, setFoundIds] = useState(new Set());
  const [timerRunning, setTimerRunning] = useState(true);
  const [shakeHeader, setShakeHeader] = useState(false);
  const [typingDone, setTypingDone] = useState(false);

  // Power-ups
  const [usedPowerUps, setUsedPowerUps] = useState([]);
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
    addPopup(x, y, score, commentary, isDoubled);
  }, [addPopup]);

  const handleCombo = useCallback((newCombo) => {
    setCombo(newCombo);
    if (comboTimeoutRef.current) clearTimeout(comboTimeoutRef.current);
    comboTimeoutRef.current = setTimeout(() => setCombo(0), 3000);
  }, []);

  const handleFinishEarly = () => {
    if (!timerRunning) return;
    setTimerRunning(false);
    playRoundComplete();
    setTimeout(() => onRoundEnd(roundScore, foundIds, timeLeft), 400);
  };

  const handlePowerUp = (id) => {
    if (usedPowerUps.includes(id)) return;
    setUsedPowerUps(prev => [...prev, id]);
    setActivePowerUp(id);
    if (powerUpTimerRef.current) clearTimeout(powerUpTimerRef.current);
    onPowerUpUsed?.(id);

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
  const isDoubleActive = doublePoints;

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
        : isDoubleActive
        ? 'rgba(251,191,36,0.03)'
        : 'transparent',
      transition: 'background 0.5s',
    }}>
      <PopupLayer popups={popups} />

      {/* Header */}
      <div
        className="safe-top"
        style={{
          padding: '10px 14px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          borderBottom: `1px solid ${isDoubleActive ? 'rgba(251,191,36,0.3)' : 'rgba(124,58,237,0.2)'}`,
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
        {combo > 1 && (
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <div className="combo-badge">🔥 {combo}x COMBO!</div>
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
        )}
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
          <div style={{
            width: 30, height: 30,
            borderRadius: '50%',
            background: radarActive
              ? 'linear-gradient(135deg, #10b981, #3b82f6)'
              : 'linear-gradient(135deg, #10b981, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.85rem', flexShrink: 0,
            transition: 'background 0.3s',
          }}>
            {radarActive ? '📡' : '🤖'}
          </div>
          <div>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '0.65rem', color: '#a78bfa' }}>SloppyGPT™</div>
            <div style={{ fontSize: '0.6rem', color: '#475569' }}>
              {radarActive ? 'SLOP RADAR ACTIVE' : 'Professional Slop Generator'}
            </div>
          </div>
          <div style={{
            marginLeft: 'auto',
            background: doublePoints
              ? 'rgba(251,191,36,0.15)'
              : 'rgba(251,191,36,0.08)',
            border: `1px solid ${doublePoints ? 'rgba(251,191,36,0.6)' : 'rgba(251,191,36,0.2)'}`,
            borderRadius: '6px',
            padding: '3px 8px',
            fontSize: '0.6rem',
            color: '#fbbf24',
            fontFamily: "'Orbitron', sans-serif",
            whiteSpace: 'nowrap',
          }}>
            {doublePoints ? '💥 2X!' : 'TAP SLOP!'}
          </div>
        </div>

        <SlopText
          round={round}
          onScore={handleScore}
          onCombo={handleCombo}
          combo={combo}
          found={foundIds}
          onFoundChange={setFoundIds}
          radarActive={radarActive}
          doublePoints={doublePoints}
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
        </div>
        <button
          className="btn-secondary"
          onClick={handleFinishEarly}
          style={{ padding: '7px 14px', fontSize: '0.72rem' }}
        >
          DONE →
        </button>
      </div>
    </div>
  );
}
