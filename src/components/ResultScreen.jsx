import { useEffect, useState, useRef, useCallback } from 'react';
import { getRoast } from '../data/slopData';
import { playGameOver, stopMusic } from '../utils/audio';
import FalImage from './FalImage';
import Leaderboard from './Leaderboard';
import { saveScoreGlobal, saveDailyScore, getLeaderboard, ACHIEVEMENTS, getUnlockedAchievements, isGlobalEnabled, getSlopDictSorted, LEVELS } from '../utils/storage';

const SHARE_MESSAGES = [
  "I scored {score} pts destroying AI slop on AI Slop Royale! Can you beat me? 🤖💥",
  "Just annihilated {score} ChatGPT clichés! AI Slop Royale is absolutely unhinged 😂",
  "I spotted {score} pts worth of AI slop. 'Certainly!' is defeated. 🎯",
];

export default function ResultScreen({ totalScore, roundScores, newAchievements = [], difficulty, totalRunTime = 0, ironFailedRound = null, totalRounds = 5, isDaily = false, xpResult = null, rageMoments = [], onRestart }) {
  const [show, setShow] = useState(false);
  const [particles, setParticles] = useState([]);
  const [initials, setInitials] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedRank, setSavedRank] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardMode, setLeaderboardMode] = useState(isDaily ? 'daily' : difficulty);
  const [showCard, setShowCard] = useState(false);
  const inputRef = useRef(null);
  const canvasRef = useRef(null);
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
    if (initials.trim().length === 0 || saving || saved) return;
    setSaving(true);
    // Daily mode scores save under the 'daily' bucket, not the regular difficulty bucket.
    // This prevents daily scores from polluting the normal/chaos/iron leaderboards.
    const saveKey = isDaily ? 'daily' : difficulty;
    const rank = await saveScoreGlobal(totalScore, initials.trim(), roast.title, saveKey);
    // Only write to the daily local bucket for actual daily-mode games.
    if (isDaily) saveDailyScore(totalScore, initials.trim(), roast.title);
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
  const isHighScore = getLeaderboard(difficulty).length === 0 || totalScore > (getLeaderboard(difficulty)[0]?.score ?? 0);

  const drawCard = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try { await document.fonts.ready; } catch {}
    const ctx = canvas.getContext('2d');
    const W = 400;
    const H = Math.max(560, 230 + roundScores.length * 26 + 140);
    canvas.width = W;
    canvas.height = H;

    // Background
    ctx.fillStyle = '#0c0c1a';
    ctx.fillRect(0, 0, W, H);
    const grad = ctx.createLinearGradient(0, 0, W, H * 0.4);
    grad.addColorStop(0, 'rgba(124,58,237,0.5)');
    grad.addColorStop(1, 'rgba(124,58,237,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Border
    ctx.strokeStyle = 'rgba(124,58,237,0.65)';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, W - 2, H - 2);

    // Title
    ctx.textAlign = 'center';
    ctx.fillStyle = '#a78bfa';
    ctx.font = 'bold 12px Orbitron, sans-serif';
    ctx.fillText('AI SLOP ROYALE', W / 2, 38);

    // Divider
    ctx.strokeStyle = 'rgba(124,58,237,0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(20, 50); ctx.lineTo(W - 20, 50); ctx.stroke();

    // Score
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 48px Orbitron, sans-serif';
    ctx.fillText(totalScore.toLocaleString(), W / 2, 112);
    ctx.fillStyle = '#475569';
    ctx.font = '9px Orbitron, sans-serif';
    ctx.fillText('CRINGE POINTS', W / 2, 130);

    // Roast title
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 14px Orbitron, sans-serif';
    ctx.fillText(roast.title, W / 2, 158);

    // Difficulty badge
    const diffText = difficulty.toUpperCase() + ' MODE';
    ctx.font = '10px Orbitron, sans-serif';
    const dtw = ctx.measureText(diffText).width + 24;
    ctx.fillStyle = 'rgba(167,139,250,0.2)';
    ctx.fillRect(W / 2 - dtw / 2, 168, dtw, 20);
    ctx.fillStyle = '#a78bfa';
    ctx.fillText(diffText, W / 2, 182);

    // Divider
    ctx.strokeStyle = 'rgba(124,58,237,0.3)';
    ctx.beginPath(); ctx.moveTo(20, 200); ctx.lineTo(W - 20, 200); ctx.stroke();

    // Round breakdown
    ctx.fillStyle = '#475569';
    ctx.font = '9px Orbitron, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('ROUND BREAKDOWN', 22, 218);

    const barMaxW = 190;
    const maxRnd = Math.max(...roundScores, 1);
    roundScores.forEach((s, i) => {
      const y = 228 + i * 26;
      const bw = (s / maxRnd) * barMaxW;
      const isBest = i === bestRound - 1;
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px Orbitron, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`R${i + 1}`, 22, y + 12);
      ctx.fillStyle = 'rgba(124,58,237,0.25)';
      ctx.fillRect(42, y, barMaxW, 14);
      ctx.fillStyle = isBest ? 'rgba(251,191,36,0.65)' : 'rgba(124,58,237,0.6)';
      ctx.fillRect(42, y, bw, 14);
      ctx.fillStyle = isBest ? '#fbbf24' : '#a78bfa';
      ctx.textAlign = 'right';
      ctx.fillText((isBest ? '\u2B50 ' : '') + s.toLocaleString() + ' pts', W - 22, y + 12);
    });

    const afterBars = 228 + roundScores.length * 26 + 10;

    // Divider
    ctx.strokeStyle = 'rgba(124,58,237,0.3)';
    ctx.beginPath(); ctx.moveTo(20, afterBars); ctx.lineTo(W - 20, afterBars); ctx.stroke();

    // Hall of shame
    const topPhrases = getSlopDictSorted().slice(0, 3);
    if (topPhrases.length > 0) {
      ctx.fillStyle = '#475569';
      ctx.font = '9px Orbitron, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('YOUR HALL OF SHAME', 22, afterBars + 18);
      topPhrases.forEach((entry, i) => {
        const y = afterBars + 32 + i * 22;
        const raw = `"${entry.text}"`;
        const display = raw.length > 42 ? raw.slice(0, 41) + '\u2026"' : raw;
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '11px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(display, 22, y);
        ctx.fillStyle = '#64748b';
        ctx.font = '9px Orbitron, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`\u00D7${entry.count}`, W - 22, y);
      });
    }

    // Date + watermark
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    ctx.fillStyle = 'rgba(100,116,139,0.55)';
    ctx.font = '9px Orbitron, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(dateStr + '  \u00B7  AI SLOP ROYALE', W / 2, H - 14);
  }, [totalScore, roundScores, roast, difficulty, bestRound]);

  useEffect(() => {
    if (showCard) setTimeout(drawCard, 60);
  }, [showCard, drawCard]);

  const downloadCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ai-slop-royale.png';
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="result-screen-root" style={{
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
        .result-screen-root > * { flex-shrink: 0; }
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
        color: totalScore < 0 ? '#ef4444' : '#fbbf24',
        textShadow: totalScore < 0 ? '0 0 20px #ef4444, 0 0 40px #ef4444' : '0 0 20px #fbbf24, 0 0 40px #fbbf24',
        animation: show ? 'bounce-in 0.5s ease 0.2s both' : 'none',
      }}>
        {totalScore.toLocaleString()}
      </div>
      <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontFamily: "'Orbitron', sans-serif", marginTop: '-8px' }}>TOTAL CRINGE POINTS</div>

      {/* Negative score easter egg */}
      {totalScore < 0 && (
        <div className="card" style={{
          padding: '18px 20px',
          maxWidth: '380px',
          width: '100%',
          border: '2px solid rgba(239,68,68,0.5)',
          background: 'rgba(239,68,68,0.07)',
          textAlign: 'center',
          animation: show ? 'slide-in-up 0.5s ease 0.25s both' : 'none',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🤖</div>
          <div style={{
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 900,
            fontSize: '1rem',
            color: '#ef4444',
            marginBottom: '8px',
            letterSpacing: '1px',
          }}>THE SLOP HAS WON</div>
          <div style={{ fontSize: '0.72rem', color: '#fca5a5', lineHeight: 1.6 }}>
            The AI's buzzwords have overwhelmed your defenses.<br />
            You are now officially part of the slop.
          </div>
          <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '10px', fontStyle: 'italic' }}>
            "Certainly! As an AI language model, I helped you lose."
          </div>
        </div>
      )}

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
                ELIMINATED ON ROUND {ironFailedRound} / {totalRounds}
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

      {/* XP gain */}
      {xpResult && (
        <div className="card" style={{
          padding: '14px 16px',
          maxWidth: '380px',
          width: '100%',
          animation: show ? 'slide-in-up 0.5s ease 0.32s both' : 'none',
          border: xpResult.leveledUp ? '1px solid rgba(251,191,36,0.5)' : '1px solid rgba(124,58,237,0.25)',
        }}>
          <div style={{ fontSize: '0.62rem', color: '#a78bfa', fontFamily: "'Orbitron', sans-serif", marginBottom: '10px' }}>
            ⚡ XP EARNED
          </div>
          {xpResult.leveledUp && (
            <div style={{
              textAlign: 'center',
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 900,
              fontSize: '1rem',
              color: '#fbbf24',
              marginBottom: '10px',
              animation: 'glow-pulse 1.5s ease infinite',
              letterSpacing: '2px',
            }}>
              ⬆ LEVEL UP!
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>XP Earned</span>
            <span style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#fbbf24' }}>
              +{xpResult.xpEarned.toLocaleString()}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '0.7rem' }}>
            <span style={{ color: '#94a3b8' }}>Level</span>
            <span style={{ fontFamily: "'Orbitron', sans-serif", color: '#a78bfa' }}>
              {xpResult.prevLevel.level !== xpResult.newLevel.level ? (
                <><span style={{ color: '#64748b' }}>LVL {xpResult.prevLevel.level}</span>{' → '}<span style={{ color: '#fbbf24', fontWeight: 700 }}>LVL {xpResult.newLevel.level}</span></>
              ) : (
                <span>LVL {xpResult.newLevel.level}</span>
              )}
            </span>
          </div>
          <div style={{ marginBottom: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', color: '#64748b', fontFamily: "'Orbitron', sans-serif" }}>
            <span>{xpResult.newLevel.title}</span>
            <span>{xpResult.xp.toLocaleString()} XP total</span>
          </div>
          {(() => {
            const nextLvl = LEVELS.find(l => l.level === xpResult.newLevel.level + 1);
            if (!nextLvl) return null;
            const xpIntoLevel = xpResult.xp - xpResult.newLevel.xpRequired;
            const xpForNext = nextLvl.xpRequired - xpResult.newLevel.xpRequired;
            const pct = Math.min(100, Math.max(0, (xpIntoLevel / xpForNext) * 100));
            return (
              <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${pct}%`,
                  background: 'linear-gradient(90deg, #7c3aed, #fbbf24)',
                  borderRadius: 3,
                  transition: 'width 0.8s ease',
                }} />
              </div>
            );
          })()}
        </div>
      )}

      {/* Rage moments replay */}
      {rageMoments.length > 0 && (
        <div className="card" style={{
          padding: '14px 16px',
          maxWidth: '380px',
          width: '100%',
          animation: show ? 'slide-in-up 0.5s ease 0.35s both' : 'none',
          border: '1px solid rgba(239,68,68,0.3)',
        }}>
          <div style={{ fontSize: '0.62rem', color: '#ef4444', fontFamily: "'Orbitron', sans-serif", marginBottom: '8px' }}>
            😤 RAGE MOMENTS
          </div>
          <div style={{ fontSize: '0.65rem', color: '#64748b', marginBottom: '10px' }}>
            words that fooled you:
          </div>
          {rageMoments.map((m, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '7px 10px',
              marginBottom: i < rageMoments.length - 1 ? '6px' : 0,
              background: 'rgba(239,68,68,0.07)',
              border: '1px solid rgba(239,68,68,0.18)',
              borderRadius: '8px',
            }}>
              <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '0.78rem', color: '#fca5a5', fontWeight: 700 }}>
                "{m.word}"
              </span>
              <span style={{ fontSize: '0.62rem', color: '#94a3b8', fontFamily: "'Orbitron', sans-serif" }}>
                Round {m.round}
              </span>
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
      {totalScore > 0 && (!saved ? (
        <div className="card" style={{ padding: '14px', maxWidth: '380px', width: '100%', animation: show ? 'slide-in-up 0.5s ease 0.4s both' : 'none' }}>
          <div style={{ fontSize: '0.62rem', color: '#fbbf24', fontFamily: "'Orbitron', sans-serif", marginBottom: '10px' }}>
            {isGlobalEnabled() ? '🌍 SAVE TO GLOBAL LEADERBOARD' : '🏆 SAVE YOUR SCORE'}
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch' }}>
            <input
              ref={inputRef}
              type="text"
              maxLength={6}
              placeholder="ABCDEF"
              value={initials}
              onChange={e => setInitials(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              style={{
                flex: 1,
                minWidth: 0,
                background: 'rgba(124,58,237,0.1)',
                border: '2px solid rgba(124,58,237,0.4)',
                borderRadius: '10px',
                padding: '8px 10px',
                color: '#f8fafc',
                fontFamily: "'Orbitron', sans-serif",
                fontWeight: 700,
                fontSize: '0.95rem',
                textAlign: 'center',
                letterSpacing: '2px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <button
              className="btn-primary"
              onClick={handleSave}
              disabled={initials.length === 0 || saving}
              style={{ padding: '8px 14px', fontSize: '0.75rem', opacity: (initials.length === 0 || saving) ? 0.5 : 1, flexShrink: 0 }}
            >
              {saving ? '...' : 'SAVE'}
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
      ))}

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
            {/* Mode tabs: current difficulty + daily */}
            <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
              {[[difficulty, `🏆 ${difficulty.toUpperCase()}`], ['daily', '📅 TODAY']].map(([m, label]) => (
                <button
                  key={m}
                  onClick={() => setLeaderboardMode(m)}
                  style={{
                    flex: 1,
                    padding: '6px 4px',
                    borderRadius: '8px',
                    border: `1px solid ${leaderboardMode === m ? '#a78bfa' : 'rgba(124,58,237,0.2)'}`,
                    background: leaderboardMode === m ? 'rgba(124,58,237,0.15)' : 'transparent',
                    color: leaderboardMode === m ? '#a78bfa' : '#64748b',
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <Leaderboard
              key={`${leaderboardMode}-${String(saved)}`}
              highlight={saved ? totalScore : null}
              maxRows={10}
              mode={leaderboardMode}
            />
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
        <button className="btn-secondary" onClick={() => setShowCard(true)} style={{ fontSize: '0.88rem', padding: '12px 24px' }}>
          📸 CARD
        </button>
      </div>

      {/* Screenshot card modal */}
      {showCard && (
        <div
          onClick={() => setShowCard(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '14px', padding: '20px',
          }}
        >
          <canvas
            ref={canvasRef}
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '100%', borderRadius: '12px', boxShadow: '0 0 40px rgba(124,58,237,0.5)' }}
          />
          <div style={{ display: 'flex', gap: '10px' }} onClick={e => e.stopPropagation()}>
            <button
              className="btn-primary"
              onClick={downloadCard}
              style={{ fontSize: '0.85rem', padding: '10px 22px' }}
            >
              ⬇ DOWNLOAD
            </button>
            <button
              className="btn-secondary"
              onClick={() => setShowCard(false)}
              style={{ fontSize: '0.85rem', padding: '10px 22px' }}
            >
              ✕ CLOSE
            </button>
          </div>
          <div style={{ fontSize: '0.65rem', color: '#475569', fontFamily: "'Orbitron', sans-serif" }}>
            tap outside to close
          </div>
        </div>
      )}
    </div>
  );
}
