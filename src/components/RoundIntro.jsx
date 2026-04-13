import { useEffect, useState } from 'react';
import FalImage from './FalImage';
import { t as tr } from '../i18n/index';
import { playCountdownTick, playCountdownGo } from '../utils/audio';


export default function RoundIntro({ round, totalRounds, onReady, difficulty = 'normal', lang = 'en' }) {
  const isInverse = !!round?.inverse;
  const isBoss = !!round?.boss;
  const isBrainrot = difficulty === 'brainrot';
  const isIronDetector = difficulty === 'iron';
  const [countdown, setCountdown] = useState(5);
  const [readyToStart, setReadyToStart] = useState(false);
  const [thinkingIdx, setThinkingIdx] = useState(0);

  useEffect(() => {
    if (countdown <= 0) {
      playCountdownGo();
      setReadyToStart(true);
      return;
    }
    playCountdownTick(countdown);
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const thinkingMsgs = tr('thinking', lang);
  useEffect(() => {
    const i = setInterval(() => setThinkingIdx(n => (n + 1) % thinkingMsgs.length), 650);
    return () => clearInterval(i);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      gap: '20px',
      position: 'relative',
      zIndex: 1,
    }}>
      {/* Round badge */}
      <div style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: '0.7rem',
        color: '#94a3b8',
        letterSpacing: '2px',
      }}>
        {tr('round', lang)} {round.roundNumber ?? round.id} / {totalRounds}
      </div>

      {/* Round title */}
      <div style={{
        fontFamily: "'Orbitron', sans-serif",
        fontSize: 'clamp(1.2rem, 5vw, 1.8rem)',
        fontWeight: 900,
        color: isBoss ? '#ef4444' : '#a78bfa',
        textAlign: 'center',
        textShadow: isBoss ? '0 0 20px #ef4444, 0 0 40px rgba(239,68,68,0.5)' : '0 0 15px #7c3aed',
        animation: isBoss ? 'bounce-in 0.5s ease, boss-flicker 1.4s ease-in-out infinite' : 'bounce-in 0.5s ease',
      }}>
        {round.emoji} {round.title}
      </div>

      {isBoss && (
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: '0.55rem',
          color: '#fca5a5',
          letterSpacing: '2px',
          textAlign: 'center',
          opacity: 0.85,
        }}>
          ⚔️ ROUND 6 / 6 — THE FINAL BOSS
        </div>
      )}

      {/* Context box */}
      <div className="card" style={{
        padding: '12px 20px',
        maxWidth: '380px',
        width: '100%',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '4px', fontFamily: "'Orbitron', sans-serif" }}>
          {tr('the_prompt', lang)}
        </div>
        <div style={{ color: '#e2e8f0', fontSize: '0.9rem', fontStyle: 'italic' }}>
          {round.context}
        </div>
      </div>

      {/* Fal.ai image */}
      <FalImage prompt={round.falPrompt} roundId={round.id} size={180} />

      {/* Instructions */}
      <div style={{
        background: isBoss ? 'rgba(239,68,68,0.1)' : isInverse ? 'rgba(56,189,248,0.08)' : isIronDetector ? 'rgba(236,72,153,0.08)' : 'rgba(124, 58, 237, 0.1)',
        border: `2px solid ${isBoss ? 'rgba(239,68,68,0.6)' : isInverse ? 'rgba(56,189,248,0.4)' : isIronDetector ? 'rgba(236,72,153,0.5)' : 'rgba(124, 58, 237, 0.3)'}`,
        borderRadius: '12px',
        padding: '10px 18px',
        textAlign: 'center',
        maxWidth: '380px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        boxShadow: isBoss ? '0 0 20px rgba(239,68,68,0.3)' : 'none',
        animation: isBoss ? 'boss-pulse 2s ease-in-out infinite' : 'none',
      }}>
        {isBoss ? (
          <>
            <div style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 700, textShadow: '0 0 8px #ef4444' }}>
              ⚔️ THE SLOP SINGULARITY
            </div>
            <div style={{ fontSize: '0.78rem', color: '#fca5a5' }}>
              This is it. The AI gave 100% slop. Find <strong>every single phrase</strong>.
            </div>
            <div style={{ fontSize: '0.65rem', color: '#fca5a5', fontStyle: 'italic', opacity: 0.85 }}>
              {round.slopPhrases?.length ?? '?'} phrases · 60 seconds · Miss penalty on DONE
            </div>
          </>
        ) : isInverse ? (
          <>
            <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 700 }}>
              {tr('inverse_header', lang)}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#e2e8f0' }}>
              {tr('inverse_body', lang)}
            </div>
            <div style={{ fontSize: '0.65rem', color: '#64748b', fontStyle: 'italic' }}>
              {tr('inverse_hint', lang)}
            </div>
          </>
        ) : isIronDetector ? (
          <>
            <div style={{ fontSize: '0.8rem', color: '#ec4899', fontWeight: 700 }}>
              ☠ IRON DETECTOR MODE
            </div>
            <div style={{ fontSize: '0.78rem', color: '#e2e8f0' }}>
              Find all AI slop phrases. One wrong click and the run is over.
            </div>
            <div style={{ fontSize: '0.65rem', color: '#ec4899', fontStyle: 'italic' }}>
              Timer counts up — faster completion = higher score bonus
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: '0.8rem', color: isBrainrot ? '#fb923c' : '#a78bfa' }}>
              {isBrainrot ? tr('brainrot_header', lang) : tr('normal_body', lang)}
            </div>
            {isBrainrot && (
              <div style={{ fontSize: '0.65rem', color: '#64748b' }}>
                {tr('brainrot_hint', lang)}
              </div>
            )}
            <div style={{
              fontSize: '0.62rem',
              color: '#475569',
              fontStyle: 'italic',
              minHeight: '1.3em',
            }}>
              💭 "{thinkingMsgs[thinkingIdx]}"
            </div>
          </>
        )}
      </div>

      {/* Countdown */}
      <div style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 'clamp(2.5rem, 10vw, 4rem)',
        color: countdown <= 1 && !readyToStart ? '#ef4444' : countdown <= 2 ? '#fbbf24' : (isBoss ? '#ef4444' : isInverse ? '#38bdf8' : isIronDetector ? '#ec4899' : '#10b981'),
        textShadow: `0 0 20px currentColor`,
        animation: 'bounce-in 0.3s ease',
        key: countdown,
        minHeight: '5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {countdown > 0 ? countdown : tr('go', lang)}
      </div>

      {/* Start button — appears after countdown */}
      {readyToStart && (
        <button
          className="btn-primary"
          onClick={onReady}
          style={{
            fontSize: '1rem',
            padding: '14px 36px',
            animation: 'bounce-in 0.4s ease',
          }}
        >
          ▶ START
        </button>
      )}

      <style>{`
        @keyframes bounce-in {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes boss-flicker { 0%,100%{opacity:1} 50%{opacity:0.65} }
        @keyframes boss-pulse { 0%,100%{box-shadow:0 0 14px rgba(239,68,68,0.3)} 50%{box-shadow:0 0 28px rgba(239,68,68,0.75)} }
      `}</style>
    </div>
  );
}
