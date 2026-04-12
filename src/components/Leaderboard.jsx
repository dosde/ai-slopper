import { useState, useEffect } from 'react';
import { getGlobalLeaderboard, isGlobalEnabled } from '../utils/storage';

export default function Leaderboard({ highlight = null, maxRows = 20 }) {
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGlobalLeaderboard().then(data => {
      setBoard((data || []).slice(0, maxRows));
      setLoading(false);
    });
  }, [maxRows]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '16px', color: '#475569', fontSize: '0.75rem', fontFamily: "'Orbitron', sans-serif" }}>
        {isGlobalEnabled() ? '📡 LOADING GLOBAL SCORES...' : 'LOADING...'}
      </div>
    );
  }

  if (board.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '16px', color: '#475569', fontSize: '0.75rem', fontFamily: "'Orbitron', sans-serif" }}>
        NO SCORES YET — BE THE FIRST!
      </div>
    );
  }

  const medals = ['🥇', '🥈', '🥉', '4.', '5.', '6.', '7.', '8.', '9.', '10.',
                  '11.','12.','13.','14.','15.','16.','17.','18.','19.','20.'];

  return (
    <div style={{ width: '100%' }}>
      {isGlobalEnabled() && (
        <div style={{ fontSize: '0.55rem', color: '#10b981', fontFamily: "'Orbitron', sans-serif", marginBottom: '8px', textAlign: 'center' }}>
          🌍 GLOBAL LEADERBOARD
        </div>
      )}
      {board.map((entry, i) => {
        const isHighlight = highlight !== null && entry.score === highlight;
        return (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 10px',
            borderRadius: '10px',
            marginBottom: '4px',
            background: isHighlight ? 'rgba(251,191,36,0.12)' : i === 0 ? 'rgba(251,191,36,0.06)' : 'rgba(124,58,237,0.05)',
            border: isHighlight ? '1px solid rgba(251,191,36,0.5)' : '1px solid rgba(124,58,237,0.1)',
          }}>
            <div style={{ width: 28, textAlign: 'center', fontSize: i < 3 ? '1.1rem' : '0.75rem', color: '#94a3b8', fontFamily: "'Orbitron', sans-serif", flexShrink: 0 }}>
              {medals[i] ?? `${i+1}.`}
            </div>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: '0.85rem', color: isHighlight ? '#fbbf24' : '#e2e8f0', flexShrink: 0, letterSpacing: '1px' }}>
              {entry.initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.65rem', color: isHighlight ? '#fbbf24' : '#a78bfa', fontFamily: "'Orbitron', sans-serif", textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {entry.rank}
              </div>
            </div>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 900, fontSize: '0.9rem', color: isHighlight ? '#fbbf24' : i === 0 ? '#fbbf24' : '#e2e8f0', textShadow: isHighlight ? '0 0 8px #fbbf24' : 'none', flexShrink: 0 }}>
              {entry.score.toLocaleString()}
            </div>
            {isHighlight && (
              <div style={{ fontSize: '0.6rem', color: '#fbbf24', fontFamily: "'Orbitron', sans-serif", flexShrink: 0, animation: 'new-score 0.5s ease-in-out infinite alternate' }}>
                ← YOU
              </div>
            )}
          </div>
        );
      })}
      <style>{`@keyframes new-score { from{opacity:0.5} to{opacity:1} }`}</style>
    </div>
  );
}
