import { useEffect, useState } from 'react';
import FalImage from './FalImage';

export default function RoundIntro({ round, totalRounds, onReady }) {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (countdown <= 0) {
      onReady();
      return;
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, onReady]);

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
        ROUND {round.id} / {totalRounds}
      </div>

      {/* Round title */}
      <div style={{
        fontFamily: "'Orbitron', sans-serif",
        fontSize: 'clamp(1.2rem, 5vw, 1.8rem)',
        fontWeight: 900,
        color: '#a78bfa',
        textAlign: 'center',
        textShadow: '0 0 15px #7c3aed',
        animation: 'bounce-in 0.5s ease',
      }}>
        {round.emoji} {round.title}
      </div>

      {/* Context box */}
      <div className="card" style={{
        padding: '12px 20px',
        maxWidth: '380px',
        width: '100%',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '4px', fontFamily: "'Orbitron', sans-serif" }}>
          THE PROMPT
        </div>
        <div style={{ color: '#e2e8f0', fontSize: '0.9rem', fontStyle: 'italic' }}>
          {round.context}
        </div>
      </div>

      {/* Fal.ai image */}
      <FalImage prompt={round.falPrompt} roundId={round.id} size={180} />

      {/* Instructions */}
      <div style={{
        background: 'rgba(124, 58, 237, 0.1)',
        border: '1px solid rgba(124, 58, 237, 0.3)',
        borderRadius: '12px',
        padding: '12px 20px',
        textAlign: 'center',
        maxWidth: '360px',
      }}>
        <div style={{ fontSize: '0.8rem', color: '#a78bfa' }}>
          👆 Tap the <span style={{ color: '#fbbf24', fontWeight: 700 }}>highlighted slop phrases</span> before time runs out!
        </div>
      </div>

      {/* Countdown */}
      <div style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 'clamp(2.5rem, 10vw, 4rem)',
        color: countdown <= 1 ? '#ef4444' : countdown <= 2 ? '#fbbf24' : '#10b981',
        textShadow: `0 0 20px currentColor`,
        animation: 'bounce-in 0.3s ease',
        key: countdown,
        minHeight: '5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {countdown > 0 ? countdown : 'GO!'}
      </div>

      <style>{`
        @keyframes bounce-in {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
