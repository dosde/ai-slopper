import { useEffect, useState } from 'react';
import { initAudio, startMusic } from '../utils/audio';

const TAGLINES = [
  "CAN YOU SPOT THE AI GARBAGE?",
  "DEFEAT THE SLOP MONSTER!",
  "HOW MUCH CRINGE CAN YOU FIND?",
  "FIGHT THE BULLET POINTS!",
];

export default function StartScreen({ onStart }) {
  const [taglineIdx, setTaglineIdx] = useState(0);
  const [titlePulse, setTitlePulse] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIdx(i => (i + 1) % TAGLINES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const pulse = setInterval(() => setTitlePulse(p => !p), 800);
    return () => clearInterval(pulse);
  }, []);

  const handleStart = () => {
    initAudio();
    if (musicEnabled) startMusic();
    onStart(musicEnabled);
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      gap: '24px',
      position: 'relative',
      zIndex: 1,
      overflowY: 'auto',
    }}>

      {/* Floating emoji background */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {['🤖', '💬', '📋', '✅', '🔫', '💩', '📝', '🫠'].map((emoji, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${10 + i * 12}%`,
            top: `${Math.sin(i * 1.5) * 20 + 40}%`,
            fontSize: '1.5rem',
            opacity: 0.12,
            animation: `float ${2 + i * 0.4}s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
          }}>
            {emoji}
          </div>
        ))}
        <style>{`@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-15px)} }`}</style>
      </div>

      {/* Main title */}
      <div style={{ textAlign: 'center', animation: 'slide-in-down 0.6s ease' }}>
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 'clamp(1.2rem, 5vw, 2rem)',
          color: '#a78bfa',
          textShadow: `0 0 20px #7c3aed, 0 0 40px #7c3aed, ${titlePulse ? '0 0 60px #ec4899' : '0 0 30px #ec4899'}`,
          lineHeight: 1.5,
          letterSpacing: '2px',
          marginBottom: '8px',
          transition: 'text-shadow 0.8s',
        }}>
          AI SLOP
        </div>
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 'clamp(0.9rem, 3.5vw, 1.4rem)',
          color: '#ec4899',
          textShadow: '0 0 15px #ec4899',
          letterSpacing: '4px',
          animation: 'glitch 3s infinite',
        }}>
          ROYALE
        </div>
        <style>{`
          @keyframes glitch {
            0%,90%,100% { text-shadow: 0 0 15px #ec4899; }
            92% { text-shadow: 3px 0 #fbbf24, -3px 0 #7c3aed; }
            94% { text-shadow: -3px 0 #fbbf24, 3px 0 #7c3aed; }
            96% { text-shadow: 3px 0 #ec4899; }
          }
          @keyframes slide-in-down { from { transform: translateY(-30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
          @keyframes slide-in-up { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        `}</style>
      </div>

      {/* Subtitle robot */}
      <div style={{ fontSize: '4rem', animation: 'float 2s ease-in-out infinite' }}>🤖</div>

      {/* Tagline */}
      <div style={{
        fontFamily: "'Orbitron', sans-serif",
        fontSize: 'clamp(0.65rem, 2.5vw, 0.85rem)',
        color: '#fbbf24',
        textShadow: '0 0 8px #fbbf24',
        textAlign: 'center',
        minHeight: '2em',
        animation: 'slide-in-up 0.4s ease',
        key: taglineIdx,
      }}>
        {TAGLINES[taglineIdx]}
      </div>

      {/* Instructions card */}
      <div className="card" style={{
        padding: '20px',
        maxWidth: '440px',
        width: '100%',
        animation: 'slide-in-up 0.8s ease',
      }}>
        <div style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: '0.7rem',
          color: '#a78bfa',
          marginBottom: '12px',
          letterSpacing: '1px',
        }}>
          HOW TO PLAY
        </div>
        {[
          ['👆', 'Tap the highlighted slop phrases in each AI response'],
          ['⚡', 'Chain detections for a COMBO MULTIPLIER (up to 5x!)'],
          ['⏱️', 'You have 45 seconds per round — speed matters!'],
          ['🏆', 'Score big to unlock the SUPREME SLOP OVERLORD title'],
        ].map(([icon, text]) => (
          <div key={icon} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            marginBottom: '10px',
            fontSize: '0.85rem',
            color: '#e2e8f0',
          }}>
            <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{icon}</span>
            <span>{text}</span>
          </div>
        ))}
      </div>

      {/* Slop examples */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        justifyContent: 'center',
        maxWidth: '440px',
        animation: 'slide-in-up 1s ease',
      }}>
        {['Certainly!', 'As an AI...', 'I hope this helps!', 'Furthermore,', 'Great question!', 'Please don\'t hesitate...'].map(phrase => (
          <div key={phrase} style={{
            background: 'rgba(251, 191, 36, 0.1)',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            borderRadius: '8px',
            padding: '4px 10px',
            fontSize: '0.78rem',
            color: '#fbbf24',
            fontStyle: 'italic',
          }}>
            "{phrase}"
          </div>
        ))}
      </div>

      {/* Music toggle + Start */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', animation: 'slide-in-up 1.2s ease' }}>
        <button
          className="btn-secondary"
          onClick={() => setMusicEnabled(m => !m)}
          style={{ fontSize: '0.75rem', padding: '8px 16px' }}
        >
          {musicEnabled ? '🎵 MUSIC: ON' : '🔇 MUSIC: OFF'}
        </button>

        <button
          className="btn-primary"
          onClick={handleStart}
          style={{ fontSize: '1.1rem', padding: '16px 40px' }}
        >
          🎮 START DETECTING
        </button>
      </div>

      <div style={{
        color: '#475569',
        fontSize: '0.7rem',
        textAlign: 'center',
        fontFamily: "'Orbitron', sans-serif",
      }}>
        5 ROUNDS • POWERED BY GENUINE AI SLOP™
      </div>
    </div>
  );
}
