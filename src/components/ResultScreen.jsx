import { useEffect, useState } from 'react';
import { getRoast } from '../data/slopData';
import { playGameOver, stopMusic } from '../utils/audio';
import FalImage from './FalImage';

const SHARE_MESSAGES = [
  "I scored {score} pts destroying AI slop on AI Slop Royale! Can you beat me? 🤖💥",
  "Just annihilated {score} ChatGPT clichés! AI Slop Royale is absolutely unhinged 😂",
  "The AI said 'Certainly!' and I said 'DETECTED!' - scored {score} pts! 🎯",
];

export default function ResultScreen({ totalScore, roundScores, onRestart }) {
  const [show, setShow] = useState(false);
  const [particles, setParticles] = useState([]);
  const roast = getRoast(totalScore);

  useEffect(() => {
    stopMusic();
    playGameOver();
    setTimeout(() => setShow(true), 100);

    // Generate confetti particles
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 1.5,
      duration: 1.5 + Math.random() * 2,
      color: ['#7c3aed', '#ec4899', '#fbbf24', '#10b981', '#a78bfa'][Math.floor(Math.random() * 5)],
      emoji: ['🎉', '🌟', '✨', '💥', '🏆', '🎊'][Math.floor(Math.random() * 6)],
    }));
    setParticles(newParticles);
  }, []);

  const maxRoundScore = Math.max(...roundScores);
  const bestRound = roundScores.indexOf(maxRoundScore) + 1;

  const handleShare = () => {
    const msg = SHARE_MESSAGES[Math.floor(Math.random() * SHARE_MESSAGES.length)].replace('{score}', totalScore.toLocaleString());
    if (navigator.share) {
      navigator.share({ title: 'AI Slop Royale', text: msg });
    } else {
      navigator.clipboard?.writeText(msg).then(() => alert('Copied to clipboard! 📋'));
    }
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '20px',
      gap: '16px',
      position: 'relative',
      zIndex: 1,
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
    }}>
      {/* Confetti */}
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'fixed',
          left: `${p.x}%`,
          top: '-5%',
          fontSize: '1.2rem',
          animation: `confetti-fall ${p.duration}s ease-in ${p.delay}s both`,
          pointerEvents: 'none',
          zIndex: 9998,
        }}>
          {p.emoji}
        </div>
      ))}

      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes bounce-in { 0%{transform:scale(0);opacity:0} 60%{transform:scale(1.2)} 100%{transform:scale(1);opacity:1} }
        @keyframes slide-in-up { from{transform:translateY(25px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes glow-pulse { 0%,100%{text-shadow:0 0 20px #fbbf24, 0 0 40px #fbbf24} 50%{text-shadow:0 0 40px #fbbf24, 0 0 80px #f59e0b, 0 0 120px #fbbf24} }
      `}</style>

      {/* Title */}
      <div style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 'clamp(0.8rem, 3vw, 1rem)',
        color: '#10b981',
        textShadow: '0 0 15px #10b981',
        marginTop: '8px',
        animation: show ? 'bounce-in 0.6s ease' : 'none',
      }}>
        GAME OVER!
      </div>

      {/* Trophy + rank */}
      <div style={{ textAlign: 'center', animation: show ? 'bounce-in 0.5s ease 0.1s both' : 'none' }}>
        <div style={{ fontSize: '3rem', marginBottom: '4px' }}>{roast.emoji}</div>
        <div style={{
          fontFamily: "'Orbitron', sans-serif",
          fontWeight: 900,
          fontSize: 'clamp(1rem, 4vw, 1.4rem)',
          color: '#fbbf24',
          animation: show ? 'glow-pulse 2s ease infinite' : 'none',
          marginBottom: '4px',
        }}>
          {roast.title}
        </div>
        <div style={{ fontSize: '0.8rem', color: '#94a3b8', maxWidth: '340px', lineHeight: 1.5 }}>
          {roast.text}
        </div>
      </div>

      {/* Score */}
      <div style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 'clamp(2rem, 8vw, 3.5rem)',
        color: '#fbbf24',
        textShadow: '0 0 20px #fbbf24, 0 0 40px #fbbf24',
        animation: show ? 'bounce-in 0.5s ease 0.2s both' : 'none',
      }}>
        {totalScore.toLocaleString()}
      </div>
      <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: "'Orbitron', sans-serif", marginTop: '-8px' }}>
        TOTAL CRINGE POINTS
      </div>

      {/* Round breakdown */}
      <div className="card" style={{
        padding: '16px',
        maxWidth: '380px',
        width: '100%',
        animation: show ? 'slide-in-up 0.5s ease 0.3s both' : 'none',
      }}>
        <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontFamily: "'Orbitron', sans-serif", marginBottom: '10px' }}>
          ROUND BREAKDOWN
        </div>
        {roundScores.map((score, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '6px 0',
            borderBottom: i < roundScores.length - 1 ? '1px solid rgba(124,58,237,0.15)' : 'none',
          }}>
            <div style={{ fontSize: '0.8rem', color: '#e2e8f0' }}>
              {i === bestRound - 1 && '⭐ '}Round {i + 1}
            </div>
            <div style={{
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 700,
              fontSize: '0.85rem',
              color: i === bestRound - 1 ? '#fbbf24' : '#a78bfa',
            }}>
              {score.toLocaleString()} pts
            </div>
          </div>
        ))}
      </div>

      {/* Fal image for result */}
      <FalImage
        prompt="a triumphant human warrior defeating a giant robot slop monster made of ChatGPT disclaimers and bullet points, epic victory scene, colorful cartoon"
        roundId={6}
        size={160}
      />

      {/* Action buttons */}
      <div style={{
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        animation: show ? 'slide-in-up 0.5s ease 0.5s both' : 'none',
        paddingBottom: '20px',
      }}>
        <button className="btn-primary" onClick={onRestart} style={{ fontSize: '0.9rem', padding: '12px 24px' }}>
          🔄 PLAY AGAIN
        </button>
        <button className="btn-secondary" onClick={handleShare} style={{ fontSize: '0.9rem', padding: '12px 24px' }}>
          📤 SHARE SCORE
        </button>
      </div>
    </div>
  );
}
