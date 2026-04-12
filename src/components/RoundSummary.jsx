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

  const isPerfect = accuracy === 100;

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
      background: isPerfect && show ? 'radial-gradient(ellipse at center, rgba(16,185,129,0.12) 0%, transparent 70%)' : 'transparent',
      transition: 'background 1s',
    }}>
      {/* Perfect round confetti */}
      {isPerfect && show && Array.from({ length: 18 }, (_, i) => (
        <div key={i} style={{
          position: 'fixed',
          left: `${(i * 5.5) % 100}%`,
          top: '-5%',
          fontSize: '1.3rem',
          animation: `confetti-fall ${1.5 + (i % 4) * 0.4}s ease-in ${(i % 6) * 0.18}s both`,
          pointerEvents: 'none',
          zIndex: 9998,
        }}>{['✨','🎉','⭐','💚','🌟','💥'][i % 6]}</div>
      ))}

      {/* Round complete banner */}
      <div style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: isPerfect ? 'clamp(0.85rem, 3.2vw, 1.1rem)' : 'clamp(0.8rem, 3vw, 1rem)',
        color: isPerfect ? '#a78bfa' : '#10b981',
        textShadow: isPerfect ? '0 0 20px #a78bfa, 0 0 40px #7c3aed' : '0 0 15px #10b981',
        textAlign: 'center',
        animation: show ? (isPerfect ? 'bounce-in 0.5s ease, perfect-pulse 1.5s ease 0.5s infinite' : 'bounce-in 0.5s ease') : 'none',
      }}>
        {isPerfect ? '🧹 SLOP ERADICATED!' : '✓ ROUND COMPLETE'}
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
        @keyframes confetti-fall { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(110vh) rotate(540deg);opacity:0} }
        @keyframes perfect-pulse { 0%,100%{text-shadow:0 0 20px #a78bfa,0 0 40px #7c3aed} 50%{text-shadow:0 0 30px #ec4899,0 0 60px #ec4899} }
      `}</style>
    </div>
  );
}
