import { useEffect, useState } from 'react';
import { playRoundComplete } from '../utils/audio';

export default function RoundSummary({ round, roundScore, foundIds, totalScore, isLastRound, onNext }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    playRoundComplete();
    setTimeout(() => setShow(true), 100);
  }, []);

  // foundIds.size tracks how many slop tokens were clicked
  // We derive total from round.slopPhrases length
  const foundCount = foundIds.size;
  const totalPhrases = round.slopPhrases.length;
  const missedCount = Math.max(0, totalPhrases - foundCount);
  const accuracy = totalPhrases > 0 ? Math.round((foundCount / totalPhrases) * 100) : 0;

  const getRating = () => {
    if (accuracy >= 90) return { emoji: '🏆', text: 'SLOP MASTER!', color: '#fbbf24' };
    if (accuracy >= 70) return { emoji: '🎯', text: 'NICE SHOT!', color: '#10b981' };
    if (accuracy >= 50) return { emoji: '👀', text: 'NOT BAD!', color: '#a78bfa' };
    if (accuracy >= 30) return { emoji: '😅', text: 'TRY HARDER!', color: '#f59e0b' };
    return { emoji: '💀', text: 'THE AI WON!', color: '#ef4444' };
  };

  const rating = getRating();

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      gap: '16px',
      position: 'relative',
      zIndex: 1,
      overflowY: 'auto',
    }}>
      {/* Round complete banner */}
      <div style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 'clamp(0.8rem, 3vw, 1rem)',
        color: '#10b981',
        textShadow: '0 0 15px #10b981',
        textAlign: 'center',
        animation: show ? 'bounce-in 0.5s ease' : 'none',
      }}>
        ✓ ROUND COMPLETE
      </div>

      {/* Rating */}
      <div style={{
        fontSize: '3.5rem',
        animation: show ? 'bounce-in 0.5s ease 0.1s both' : 'none',
      }}>
        {rating.emoji}
      </div>
      <div style={{
        fontFamily: "'Orbitron', sans-serif",
        fontSize: 'clamp(1.2rem, 4vw, 1.6rem)',
        fontWeight: 900,
        color: rating.color,
        textShadow: `0 0 15px ${rating.color}`,
        animation: show ? 'bounce-in 0.5s ease 0.2s both' : 'none',
      }}>
        {rating.text}
      </div>

      {/* Stats card */}
      <div className="card" style={{
        padding: '20px',
        maxWidth: '380px',
        width: '100%',
        animation: show ? 'slide-in-up 0.5s ease 0.3s both' : 'none',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {[
            { label: 'ROUND SCORE', value: `+${roundScore.toLocaleString()}`, color: '#fbbf24' },
            { label: 'TOTAL SCORE', value: totalScore.toLocaleString(), color: '#a78bfa' },
            { label: 'SLOP FOUND', value: `${foundCount}/${totalPhrases}`, color: '#10b981' },
            { label: 'ACCURACY', value: `${accuracy}%`, color: accuracy >= 70 ? '#10b981' : accuracy >= 40 ? '#fbbf24' : '#ef4444' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{
              textAlign: 'center',
              padding: '12px',
              background: 'rgba(124,58,237,0.08)',
              borderRadius: '10px',
              border: '1px solid rgba(124,58,237,0.2)',
            }}>
              <div style={{ fontSize: '0.6rem', color: '#94a3b8', fontFamily: "'Orbitron', sans-serif", marginBottom: '4px' }}>
                {label}
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color, fontFamily: "'Orbitron', sans-serif" }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        {missedCount > 0 && (
          <div style={{
            marginTop: '12px',
            padding: '10px',
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '10px',
            fontSize: '0.75rem',
            color: '#ef4444',
            textAlign: 'center',
          }}>
            😤 You missed {missedCount} slop phrase{missedCount > 1 ? 's' : ''}! The AI is still out there slopping...
          </div>
        )}
      </div>

      {/* Next button */}
      <button
        className="btn-primary"
        onClick={onNext}
        style={{
          fontSize: '1rem',
          padding: '14px 32px',
          animation: show ? 'slide-in-up 0.5s ease 0.5s both' : 'none',
        }}
      >
        {isLastRound ? '🏁 SEE FINAL RESULTS' : '▶ NEXT ROUND'}
      </button>

      <style>{`
        @keyframes bounce-in { 0%{transform:scale(0.5);opacity:0} 60%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
        @keyframes slide-in-up { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
      `}</style>
    </div>
  );
}
