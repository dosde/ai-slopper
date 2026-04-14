import { useState } from 'react';

export const POWERUP_DEFS = [
  {
    id: 'radar',
    emoji: '📡',
    name: 'SLOP RADAR',
    desc: 'Reveals ALL slop for 3s',
    color: '#10b981',
    glowColor: 'rgba(16,185,129,0.4)',
  },
  {
    id: 'time',
    emoji: '⏰',
    name: 'TIME BOOST',
    desc: '+15 seconds',
    color: '#3b82f6',
    glowColor: 'rgba(59,130,246,0.4)',
  },
  {
    id: 'double',
    emoji: '💥',
    name: '2X POINTS',
    desc: 'Double score for 10s',
    color: '#fbbf24',
    glowColor: 'rgba(251,191,36,0.4)',
  },
  {
    id: 'streak',
    emoji: '🛡️',
    name: 'STREAK SAVER',
    desc: 'Absorbs 1 wrong click — no combo break, no penalty',
    color: '#a78bfa',
    glowColor: 'rgba(167,139,250,0.4)',
  },
];

export default function PowerUps({ used, active, onUse }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
    }}>
      {POWERUP_DEFS.map(p => {
        const isUsed = used.includes(p.id);
        const isActive = active === p.id;
        const isHovered = hovered === p.id;

        return (
          <button
            key={p.id}
            onClick={() => !isUsed && onUse(p.id)}
            onMouseEnter={() => setHovered(p.id)}
            onMouseLeave={() => setHovered(null)}
            disabled={isUsed}
            title={`${p.name}: ${p.desc}`}
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              border: isActive
                ? `2px solid ${p.color}`
                : isUsed
                ? '2px solid rgba(100,100,100,0.3)'
                : `2px solid ${p.color}55`,
              background: isActive
                ? `${p.glowColor}`
                : isUsed
                ? 'rgba(30,30,50,0.5)'
                : isHovered
                ? `${p.glowColor}`
                : 'rgba(26,26,46,0.8)',
              cursor: isUsed ? 'not-allowed' : 'pointer',
              fontSize: '1.3rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s',
              transform: isActive ? 'scale(1.15)' : isHovered && !isUsed ? 'scale(1.08)' : 'scale(1)',
              boxShadow: isActive ? `0 0 12px ${p.color}` : 'none',
              opacity: isUsed ? 0.35 : 1,
              position: 'relative',
              flexShrink: 0,
            }}
          >
            <span style={{
              filter: isUsed ? 'grayscale(1)' : 'none',
              fontSize: isActive ? '1.5rem' : '1.2rem',
              transition: 'font-size 0.15s',
            }}>
              {isUsed ? '✗' : p.emoji}
            </span>
            {isActive && (
              <div style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 8,
                border: `2px solid ${p.color}`,
                animation: 'ping 1s ease-in-out infinite',
              }} />
            )}
          </button>
        );
      })}
      <style>{`
        @keyframes ping {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
