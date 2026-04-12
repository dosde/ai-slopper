import { useState, useEffect, useCallback, useRef } from 'react';
import SlopText from './SlopText';
import { PopupLayer, usePopups } from './ScorePopup';
import { playRoundComplete } from '../utils/audio';

const ROUND_TIME = 45; // seconds

function TimerBar({ timeLeft, total }) {
  const pct = (timeLeft / total) * 100;
  let color = '#10b981';
  if (pct < 50) color = '#fbbf24';
  if (pct < 25) color = '#ef4444';

  return (
    <div className="timer-bar-track">
      <div
        className="timer-bar-fill"
        style={{
          width: `${pct}%`,
          background: color,
          boxShadow: `0 0 8px ${color}`,
          transition: 'width 0.25s linear, background 0.5s',
        }}
      />
    </div>
  );
}

export default function GameScreen({ round, roundIdx, totalRounds, totalScore, onRoundEnd }) {
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [roundScore, setRoundScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [foundIds, setFoundIds] = useState(new Set());
  const [timerRunning, setTimerRunning] = useState(true);
  const [shakeHeader, setShakeHeader] = useState(false);
  const { popups, addPopup } = usePopups();
  const comboTimeoutRef = useRef(null);
  const textRef = useRef(null);

  // Timer countdown
  useEffect(() => {
    if (!timerRunning) return;
    if (timeLeft <= 0) {
      setTimerRunning(false);
      setTimeout(() => onRoundEnd(roundScore, foundIds), 800);
      return;
    }
    const t = setTimeout(() => {
      setTimeLeft(t => t - 1);
      if (timeLeft <= 10) setShakeHeader(true);
    }, 1000);
    return () => clearTimeout(t);
  }, [timeLeft, timerRunning, roundScore, foundIds, onRoundEnd]);

  useEffect(() => {
    if (shakeHeader) {
      const t = setTimeout(() => setShakeHeader(false), 500);
      return () => clearTimeout(t);
    }
  }, [shakeHeader]);

  const handleScore = useCallback((score, x, y, commentary) => {
    setRoundScore(prev => prev + score);
    addPopup(x, y, score, commentary);
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
    setTimeout(() => onRoundEnd(roundScore, foundIds), 400);
  };

  const pct = (timeLeft / ROUND_TIME) * 100;
  const isUrgent = timeLeft <= 10;

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      zIndex: 1,
      overflow: 'hidden',
      background: isUrgent ? 'rgba(239,68,68,0.03)' : 'transparent',
      transition: 'background 0.5s',
    }}>
      <PopupLayer popups={popups} />

      {/* Header */}
      <div
        className="safe-top"
        style={{
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          borderBottom: '1px solid rgba(124,58,237,0.2)',
          background: 'rgba(15,15,26,0.95)',
          backdropFilter: 'blur(10px)',
          animation: shakeHeader ? 'shake 0.4s ease' : 'none',
          flexShrink: 0,
        }}
      >
        {/* Top row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontFamily: "'Orbitron', sans-serif" }}>
              ROUND {roundIdx + 1}/{totalRounds}
            </div>
            <div style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#e2e8f0',
            }}>
              {round.emoji} {round.title}
            </div>
          </div>

          {/* Score area */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.6rem', color: '#94a3b8', fontFamily: "'Orbitron', sans-serif" }}>TOTAL</div>
            <div style={{
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 900,
              fontSize: '1rem',
              color: '#fbbf24',
              textShadow: '0 0 8px #fbbf24',
            }}>
              {(totalScore + roundScore).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Timer row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <TimerBar timeLeft={timeLeft} total={ROUND_TIME} />
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '0.75rem',
            color: isUrgent ? '#ef4444' : '#94a3b8',
            minWidth: '28px',
            textAlign: 'right',
            textShadow: isUrgent ? '0 0 8px #ef4444' : 'none',
            animation: isUrgent ? 'pulse 0.5s ease-in-out infinite' : 'none',
          }}>
            {timeLeft}
          </div>
        </div>

        {/* Combo meter */}
        {combo > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="combo-badge" style={{ animation: 'wiggle 0.4s ease' }}>
              🔥 {combo}x COMBO!
            </div>
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
        background: 'rgba(124, 58, 237, 0.08)',
        borderBottom: '1px solid rgba(124,58,237,0.15)',
        padding: '8px 16px',
        fontSize: '0.75rem',
        color: '#94a3b8',
        fontStyle: 'italic',
        flexShrink: 0,
      }}>
        💬 {round.context}
      </div>

      {/* Scrollable text area */}
      <div
        ref={textRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* "ChatGPT" response header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '12px',
          padding: '10px 14px',
          background: 'rgba(26,26,46,0.8)',
          borderRadius: '12px',
          border: '1px solid rgba(124,58,237,0.2)',
        }}>
          <div style={{
            width: 32, height: 32,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.9rem', flexShrink: 0,
          }}>🤖</div>
          <div>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '0.7rem', color: '#a78bfa' }}>SloppyGPT™</div>
            <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Professional Slop Generator • Always Helpful™</div>
          </div>
          <div style={{
            marginLeft: 'auto',
            background: 'rgba(251,191,36,0.1)',
            border: '1px solid rgba(251,191,36,0.3)',
            borderRadius: '6px',
            padding: '3px 8px',
            fontSize: '0.65rem',
            color: '#fbbf24',
            fontFamily: "'Orbitron', sans-serif",
          }}>
            TAP SLOP!
          </div>
        </div>

        <SlopText
          round={round}
          onScore={handleScore}
          onCombo={handleCombo}
          combo={combo}
          found={foundIds}
          onFoundChange={setFoundIds}
        />
      </div>

      {/* Bottom bar */}
      <div className="safe-bottom" style={{
        padding: '10px 16px',
        borderTop: '1px solid rgba(124,58,237,0.2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(15,15,26,0.95)',
        flexShrink: 0,
      }}>
        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
          Round pts: <span style={{ color: '#e2e8f0', fontWeight: 700 }}>{roundScore.toLocaleString()}</span>
        </div>
        <button
          className="btn-secondary"
          onClick={handleFinishEarly}
          style={{ padding: '8px 16px', fontSize: '0.75rem' }}
        >
          DONE →
        </button>
      </div>
    </div>
  );
}
