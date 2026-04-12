import { useEffect, useState, useRef } from 'react';
import { getRoast } from '../data/slopData';
import { playGameOver, stopMusic } from '../utils/audio';
import FalImage from './FalImage';
import Leaderboard from './Leaderboard';
import { saveScoreGlobal, getLeaderboard, ACHIEVEMENTS, getUnlockedAchievements, isGlobalEnabled } from '../utils/storage';

const SHARE_MESSAGES = [
  "I scored {score} pts destroying AI slop on AI Slop Royale! Can you beat me? 🤖💥",
  "Just annihilated {score} ChatGPT clichés! AI Slop Royale is absolutely unhinged 😂",
  "I spotted {score} pts worth of AI slop. 'Certainly!' is defeated. 🎯",
];

export default function ResultScreen({ totalScore, roundScores, newAchievements = [], difficulty, totalRunTime = 0, ironFailedRound = null, onRestart }) {
  const [show, setShow] = useState(false);
  const [particles, setParticles] = useState([]);
  const [initials, setInitials] = useState('');
  const [saved, setSaved] = useState(false);
  const [savedRank, setSavedRank] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const inputRef = useRef(null);
  const roast = getRoast(totalScore);
  const unlockedIds = getUnlockedAchievements();

  useEffect(() => {
    stopMusic();
    playGameOver();
    setTimeout(() => setShow(true), 100);

    const newParticles = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 1.2,
      duration: 1.8 + Math.random() * 2,
      emoji: ['🎉', '🌟', '✨', '💥', '🏆', '🎊', '🤖', '💩'][Math.floor(Math.random() * 8)],
    }));
    setParticles(newParticles);
  }, []);

  const handleSave = async () => {
    if (initials.trim().length === 0) return;
    const rank = await saveScoreGlobal(totalScore, initials.trim(), roast.title);
    setSaved(true);
    setSavedRank(rank);
    setShowLeaderboard(true);
  };

  const handleShare = () => {
    const msg = SHARE_MESSAGES[Math.floor(Math.random() * SHARE_MESSAGES.length)].replace('{score}', totalScore.toLocaleString());
    if (navigator.share) {
      navigator.share({ title: 'AI Slop Royale', text: msg });
    } else {
      navigator.clipboard?.writeText(msg).then(() => alert('Copied to clipboard! 📋'));
    }
  };

  const maxRoundScore = Math.max(...roundScores);
  const bestRound = roundScores.indexOf(maxRoundScore) + 1;
  const isHighScore = getLeaderboard().length === 0 || totalScore > (getLeaderboard()[0]?.score ?? 0);

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '16px',
      gap: '14px',
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
          fontSize: '1.1rem',
          animation: `confetti-fall ${p.duration}s ease-in ${p.delay}s both`,
          pointerEvents: 'none',
          zIndex: 9998,
        }}>{p.emoji}</div>
      ))}

      <style>{`
        @keyframes confetti-fall{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}
        @keyframes bounce-in{0%{transform:scale(0);opacity:0}60%{transform:scale(1.2)}100%{transform:scale(1);opacity:1}}
        @keyframes slide-in-up{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes glow-pulse{0%,100%{text-shadow:0 0 20px #fbbf24,0 0 40px #fbbf24}50%{text-shadow:0 0 40px #fbbf24,0 0 80px #f59e0b}}
      `}</style>

      {/* Game Over + rank */}
      <div style={{ textAlign: 'center', animation: show ? 'bounce-in 0.6s ease' : 'none', marginTop: '4px' }}>
        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 'clamp(0.7rem, 2.5vw, 0.9rem)', color: '#10b981', textShadow: '0 0 15px #10b981', marginBottom: '8px' }}>
          {difficulty === 'iron' && ironFailedRound ? 'ELIMINATED!' : 'GAME OVER!'}
          {difficulty === 'chaos' && <span style={{ color: '#ef4444', marginLeft: 10 }}>⚡ CHAOS</span>}
          {difficulty === 'iron' && <span style={{ color: '#ec4899', marginLeft: 10 }}>☠ IRON</span>}
        </div>
        <div style={{ fontSize: '2.5rem' }}>{roast.emoji}</div>
        <div style={{
          fontFamily: "'Orbitron', sans-serif",
          fontWeight: 900,
          fontSize: 'clamp(0.9rem, 3.5vw, 1.3rem)',
          color: '#fbbf24',
          animation: show ? 'glow-pulse 2s ease infinite' : 'none',
          margin: '4px 0',
        }}>{roast.title}</div>
        <div style={{ fontSize: '0.78rem', color: '#94a3b8', maxWidth: '320px', lineHeight: 1.5 }}>{roast.text}</div>
      </div>

      {/* Score */}
      <div style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 'clamp(1.8rem, 7vw, 3rem)',
        color: '#fbbf24',
        textShadow: '0 0 20px #fbbf24, 0 0 40px #fbbf24',
        animation: show ? 'bounce-in 0.5s ease 0.2s both' : 'none',
      }}>
        {totalScore.toLocaleString()}
      </div>
      <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontFamily: "'Orbitron', sans-serif", marginTop: '-8px' }}>TOTAL CRINGE POINTS</div>

      {/* Iron Detector summary */}
      {difficulty === 'iron' && (
        <div className="card" style={{
          padding: '14px 16px',
          maxWidth: '380px',
          width: '100%',
          animation: show ? 'slide-in-up 0.5s ease 0.25s both' : 'none',
          border: ironFailedRound ? '1px solid rgba(236,72,153,0.4)' : '1px solid rgba(16,185,129,0.4)',
        }}>
          {ironFailedRound ? (
            <>
              <div style={{ fontSize: '0.62rem', color: '#ec4899', fontFamily: "'Orbitron', sans-serif", marginBottom: '8px' }}>
                ☠ IRON DETECTOR STATUS
              </div>
              <div style={{ fontSize: '0.85rem', color: '#ec4899', fontWeight: 700, textAlign: 'center', marginBottom: '6px', fontFamily: "'Orbitron', sans-serif" }}>
                ELIMINATED ON ROUND {ironFailedRound} / {roundScores.length + 1}
              </div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8', textAlign: 'center' }}>
                One wrong click ended the run.
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: '0.62rem', color: '#10b981', fontFamily: "'Orbitron', sans-serif", marginBottom: '10px' }}>
                ☠ IRON DETECTOR COMPLETE!
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Total Time</span>
                <span style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: '0.9rem', color: '#ec4899' }}>
                  {`${Math.floor(totalRunTime / 60)}:${String(totalRunTime % 60).padStart(2, '0')}`}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Speed Bonus</span>
                <span style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: '0.9rem', color: '#10b981' }}>
                  +{Math.max(0, 15000 - totalRunTime * 15).toLocaleString()}
                </span>
              </div>
            </>
          )}
        </div>
      )}

      {/* New achievements */}
      {newAchievements.length > 0 && (
        <div className="card" style={{ padding: '12px 16px', maxWidth: '380px', width: '100%', animation: show ? 'slide-in-up 0.5s ease 0.3s both' : 'none' }}>
          <div style={{ fontSize: '0.62rem', color: '#fbbf24', fontFamily: "'Orbitron', sans-serif", marginBottom: '8px' }}>
            🎖 NEW ACHIEVEMENTS!
          </div>
          {newAchievements.map(a => (
            <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0', borderBottom: '1px solid rgba(251,191,36,0.1)' }}>
              <span style={{ fontSize: '1.4rem' }}>{a.emoji}</span>
              <div>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '0.7rem', fontWeight: 700, color: '#fbbf24' }}>{a.name}</div>
                <div style={{ fontSize: '0.62rem', color: '#94a3b8' }}>{a.desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Round breakdown */}
      <div className="card" style={{ padding: '14px', maxWidth: '380px', width: '100%', animation: show ? 'slide-in-up 0.5s ease 0.3s both' : 'none' }}>
        <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontFamily: "'Orbitron', sans-serif", marginBottom: '8px' }}>ROUND BREAKDOWN</div>
        {roundScores.map((score, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: i < roundScores.length - 1 ? '1px solid rgba(124,58,237,0.12)' : 'none' }}>
            <div style={{ fontSize: '0.78rem', color: '#e2e8f0' }}>{i === bestRound - 1 && '⭐ '}Round {i + 1}</div>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: '0.82rem', color: i === bestRound - 1 ? '#fbbf24' : '#a78bfa' }}>
              {score.toLocaleString()} pts
            </div>
          </div>
        ))}
      </div>

      {/* Save score */}
      {!saved ? (
        <div className="card" style={{ padding: '14px', maxWidth: '380px', width: '100%', animation: show ? 'slide-in-up 0.5s ease 0.4s both' : 'none' }}>
          <div style={{ fontSize: '0.62rem', color: '#fbbf24', fontFamily: "'Orbitron', sans-serif", marginBottom: '10px' }}>
            {isGlobalEnabled() ? '🌍 SAVE TO GLOBAL LEADERBOARD' : '🏆 SAVE YOUR SCORE'}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              ref={inputRef}
              type="text"
              maxLength={3}
              placeholder="AAA"
              value={initials}
              onChange={e => setInitials(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              style={{
                flex: 1,
                background: 'rgba(124,58,237,0.1)',
                border: '2px solid rgba(124,58,237,0.4)',
                borderRadius: '10px',
                padding: '10px 14px',
                color: '#f8fafc',
                fontFamily: "'Orbitron', sans-serif",
                fontWeight: 700,
                fontSize: '1.1rem',
                textAlign: 'center',
                letterSpacing: '6px',
                outline: 'none',
              }}
            />
            <button
              className="btn-primary"
              onClick={handleSave}
              disabled={initials.length === 0}
              style={{ padding: '10px 18px', fontSize: '0.8rem', opacity: initials.length === 0 ? 0.5 : 1 }}
            >
              SAVE
            </button>
          </div>
        </div>
      ) : (
        <div style={{
          padding: '12px 20px',
          background: 'rgba(16,185,129,0.1)',
          border: '1px solid rgba(16,185,129,0.4)',
          borderRadius: '14px',
          textAlign: 'center',
          maxWidth: '380px',
          width: '100%',
        }}>
          <div style={{ fontSize: '1.5rem' }}>✅</div>
          <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '0.75rem', color: '#10b981', marginTop: '4px' }}>
            SAVED! RANK #{savedRank} ON LEADERBOARD
          </div>
        </div>
      )}

      {/* Leaderboard toggle */}
      <div style={{ maxWidth: '380px', width: '100%' }}>
        <button
          onClick={() => setShowLeaderboard(v => !v)}
          style={{
            width: '100%',
            padding: '10px',
            background: 'rgba(124,58,237,0.08)',
            border: '1px solid rgba(124,58,237,0.2)',
            borderRadius: '10px',
            color: '#a78bfa',
            fontFamily: "'Orbitron', sans-serif",
            fontSize: '0.7rem',
            cursor: 'pointer',
            marginBottom: showLeaderboard ? '8px' : '0',
          }}
        >
          {showLeaderboard ? '▲ HIDE LEADERBOARD' : '▼ SHOW LEADERBOARD'}
        </button>
        {showLeaderboard && (
          <div className="card" style={{ padding: '12px' }}>
            <Leaderboard highlight={saved ? totalScore : null} maxRows={10} />
          </div>
        )}
      </div>

      {/* Fal image */}
      <FalImage
        prompt="a triumphant human warrior defeating a giant robot slop monster made of bullet points and ChatGPT disclaimers, epic victory, colorful cartoon"
        roundId={6}
        size={150}
      />

      {/* Action buttons */}
      <div style={{
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingBottom: '20px',
      }}>
        <button className="btn-primary" onClick={onRestart} style={{ fontSize: '0.88rem', padding: '12px 24px' }}>
          🔄 PLAY AGAIN
        </button>
        <button className="btn-secondary" onClick={handleShare} style={{ fontSize: '0.88rem', padding: '12px 24px' }}>
          📤 SHARE
        </button>
      </div>
    </div>
  );
}
