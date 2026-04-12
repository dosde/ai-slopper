import { useEffect, useState } from 'react';
import { initAudio, startMusic } from '../utils/audio';
import Leaderboard from './Leaderboard';
import { getLeaderboard, getUnlockedAchievements, ACHIEVEMENTS } from '../utils/storage';

const TAGLINES = [
  "CAN YOU SPOT THE AI GARBAGE?",
  "DEFEAT THE SLOP MONSTER!",
  "HOW MUCH CRINGE CAN YOU FIND?",
  "5 RANDOM ROUNDS EVERY GAME!",
  "POWER-UPS! COMBOS! CHAOS MODE!",
];

const SLOP_FACTS = [
  "ChatGPT has typed 'Certainly!' more times than all Shakespeare combined.",
  "73% of AI responses begin with 'Great question!'",
  "The word 'Moreover' has been used 4.2 billion times since GPT-3 launched.",
  "'I hope this helps!' has never actually helped anyone.",
  "AI disclaimers contain more words than the actual answer 62% of the time.",
  "Every 'As an AI language model' kills a developer's soul.",
  "Scientists estimate 'Furthermore' will go extinct by 2027 due to overuse.",
  "'Holistic approach' is code for 'I ran out of ideas'.",
  "The word 'synergy' is contractually required in all corporate AI responses.",
  "'Delve' usage increased 8,000% after GPT-4 launched. Coincidence? Certainly not.",
  "No AI has ever actually hoped anything helps. They are incapable of hope.",
  "Adding 'In conclusion:' before something does not make it a conclusion.",
  "The phrase 'game-changing' has not changed a single game.",
];

export default function StartScreen({ onStart }) {
  const [taglineIdx, setTaglineIdx] = useState(0);
  const [factIdx, setFactIdx] = useState(0);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [difficulty, setDifficulty] = useState('normal');
  const [mode, setMode] = useState('random'); // 'random' | 'daily'
  const [tab, setTab] = useState('play'); // 'play' | 'scores' | 'badges'
  const [titlePulse, setTitlePulse] = useState(false);

  const leaderboard = getLeaderboard();
  const unlockedIds = getUnlockedAchievements();

  useEffect(() => {
    const i = setInterval(() => setTaglineIdx(n => (n + 1) % TAGLINES.length), 2600);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    const i = setInterval(() => setFactIdx(n => (n + 1) % SLOP_FACTS.length), 4200);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    const p = setInterval(() => setTitlePulse(v => !v), 900);
    return () => clearInterval(p);
  }, []);

  const handleStart = () => {
    initAudio();
    if (musicEnabled) startMusic();
    onStart({ difficulty, mode, musicEnabled });
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      zIndex: 1,
      overflow: 'hidden',
    }}>
      {/* Floating background emoji */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {['🤖', '💬', '📋', '✅', '💩', '📝', '🫠', '🔫', '📌', '🗂️'].map((e, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${5 + i * 10}%`,
            top: `${30 + Math.sin(i * 1.3) * 25}%`,
            fontSize: '1.4rem',
            opacity: 0.08,
            animation: `float ${2.5 + i * 0.3}s ease-in-out infinite`,
            animationDelay: `${i * 0.25}s`,
          }}>{e}</div>
        ))}
        <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}`}</style>
      </div>

      {/* Header: Title */}
      <div style={{ textAlign: 'center', padding: '20px 16px 0', flexShrink: 0 }}>
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 'clamp(1.1rem, 4.5vw, 1.8rem)',
          color: '#a78bfa',
          textShadow: `0 0 20px #7c3aed, 0 0 40px #7c3aed, ${titlePulse ? '0 0 60px #ec4899' : ''}`,
          lineHeight: 1.5,
          transition: 'text-shadow 0.9s',
        }}>AI SLOP</div>
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 'clamp(0.8rem, 3vw, 1.2rem)',
          color: '#ec4899',
          textShadow: '0 0 15px #ec4899',
          letterSpacing: '4px',
          animation: 'glitch 4s infinite',
        }}>ROYALE</div>
        <style>{`
          @keyframes glitch{0%,90%,100%{text-shadow:0 0 15px #ec4899}92%{text-shadow:3px 0 #fbbf24,-3px 0 #7c3aed}94%{text-shadow:-3px 0 #fbbf24,3px 0 #7c3aed}}
          @keyframes bounce-in{0%{transform:scale(0);opacity:0}60%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}
        `}</style>

        {/* Tagline */}
        <div style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: 'clamp(0.58rem, 2vw, 0.78rem)',
          color: '#fbbf24',
          textShadow: '0 0 6px #fbbf24',
          marginTop: '6px',
          minHeight: '1.4em',
        }}>
          {TAGLINES[taglineIdx]}
        </div>

        {/* Slop facts ticker */}
        <div style={{
          fontSize: '0.58rem',
          color: '#475569',
          fontStyle: 'italic',
          marginTop: '4px',
          minHeight: '1.6em',
          maxWidth: '340px',
          margin: '4px auto 0',
          lineHeight: 1.5,
        }}>
          📊 {SLOP_FACTS[factIdx]}
        </div>
      </div>

      {/* Tab nav */}
      <div style={{
        display: 'flex',
        margin: '14px 16px 0',
        background: 'rgba(26,26,46,0.8)',
        borderRadius: '12px',
        padding: '3px',
        border: '1px solid rgba(124,58,237,0.2)',
        flexShrink: 0,
      }}>
        {[['play', '🎮 PLAY'], ['scores', '🏆 SCORES'], ['badges', '🎖 BADGES']].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              flex: 1,
              padding: '8px 4px',
              borderRadius: '9px',
              border: 'none',
              background: tab === id ? 'linear-gradient(135deg, #7c3aed, #ec4899)' : 'transparent',
              color: tab === id ? 'white' : '#94a3b8',
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(0.5rem, 1.8vw, 0.65rem)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab content (scrollable) */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        padding: '12px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>

        {tab === 'play' && (
          <>
            {/* Difficulty */}
            <div className="card" style={{ padding: '14px' }}>
              <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontFamily: "'Orbitron', sans-serif", marginBottom: '10px', letterSpacing: '1px' }}>
                DIFFICULTY
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { id: 'normal', label: '😌 NORMAL', desc: '45s per round', color: '#10b981' },
                  { id: 'chaos',  label: '😈 CHAOS',  desc: '25s per round', color: '#ef4444' },
                ].map(d => (
                  <button
                    key={d.id}
                    onClick={() => setDifficulty(d.id)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '10px',
                      border: `2px solid ${difficulty === d.id ? d.color : 'rgba(124,58,237,0.2)'}`,
                      background: difficulty === d.id ? `${d.color}20` : 'transparent',
                      color: difficulty === d.id ? d.color : '#94a3b8',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: '0.72rem' }}>{d.label}</div>
                    <div style={{ fontSize: '0.62rem', marginTop: '3px', opacity: 0.8 }}>{d.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Game mode */}
            <div className="card" style={{ padding: '14px' }}>
              <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontFamily: "'Orbitron', sans-serif", marginBottom: '10px', letterSpacing: '1px' }}>
                GAME MODE
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { id: 'random', label: '🎲 RANDOM',  desc: '5 fresh rounds every game' },
                  { id: 'daily',  label: '📅 DAILY',   desc: 'Same rounds for everyone today' },
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '10px',
                      border: `2px solid ${mode === m.id ? '#a78bfa' : 'rgba(124,58,237,0.2)'}`,
                      background: mode === m.id ? 'rgba(124,58,237,0.15)' : 'transparent',
                      color: mode === m.id ? '#a78bfa' : '#94a3b8',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: '0.72rem' }}>{m.label}</div>
                    <div style={{ fontSize: '0.62rem', marginTop: '3px', opacity: 0.8 }}>{m.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* How to play */}
            <div className="card" style={{ padding: '14px' }}>
              <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontFamily: "'Orbitron', sans-serif", marginBottom: '10px', letterSpacing: '1px' }}>
                HOW TO PLAY
              </div>
              {[
                ['👆', 'Click slop phrases hiding in plain text — all words look the same!'],
                ['⚡', 'Chain detections for COMBO MULTIPLIER up to 5x (+1s per hit)'],
                ['📡', 'Power-ups usable once per game: Radar, Time Boost, Double Points'],
                ['🎲', '5 random rounds every game from a pool of 46'],
              ].map(([icon, text]) => (
                <div key={icon} style={{ display: 'flex', gap: '10px', marginBottom: '8px', fontSize: '0.8rem', color: '#e2e8f0', alignItems: 'flex-start' }}>
                  <span style={{ flexShrink: 0 }}>{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* Slop examples */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {['Certainly!', 'As an AI...', 'I hope this helps!', 'Furthermore,', 'Great question!', 'Holistic approach', 'Moreover,', 'That being said'].map(p => (
                <div key={p} style={{
                  background: 'rgba(251,191,36,0.08)',
                  border: '1px solid rgba(251,191,36,0.25)',
                  borderRadius: '8px',
                  padding: '3px 9px',
                  fontSize: '0.72rem',
                  color: '#fbbf24',
                  fontStyle: 'italic',
                }}>"{p}"</div>
              ))}
            </div>

            {/* Music + start */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', paddingBottom: '8px' }}>
              <button className="btn-secondary" onClick={() => setMusicEnabled(m => !m)} style={{ fontSize: '0.7rem', padding: '7px 14px' }}>
                {musicEnabled ? '🎵 MUSIC: ON' : '🔇 MUSIC: OFF'}
              </button>
              <button className="btn-primary" onClick={handleStart} style={{ fontSize: '1rem', padding: '14px 36px' }}>
                🎮 START DETECTING
              </button>
              <div style={{ color: '#334155', fontSize: '0.62rem', fontFamily: "'Orbitron', sans-serif" }}>
                46 ROUNDS POOL • REAL AI SLOP™
              </div>
            </div>
          </>
        )}

        {tab === 'scores' && (
          <div>
            <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontFamily: "'Orbitron', sans-serif", marginBottom: '10px', letterSpacing: '1px' }}>
              HALL OF SHAME
            </div>
            <Leaderboard maxRows={10} />
            {leaderboard.length > 0 && (
              <div style={{ textAlign: 'center', marginTop: '12px' }}>
                <button className="btn-primary" onClick={handleStart} style={{ fontSize: '0.85rem', padding: '12px 28px' }}>
                  🎮 BEAT THE RECORD
                </button>
              </div>
            )}
          </div>
        )}

        {tab === 'badges' && (
          <div>
            <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontFamily: "'Orbitron', sans-serif", marginBottom: '10px', letterSpacing: '1px' }}>
              ACHIEVEMENTS ({unlockedIds.length}/{ACHIEVEMENTS.length})
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {ACHIEVEMENTS.map(a => {
                const unlocked = unlockedIds.includes(a.id);
                return (
                  <div key={a.id} style={{
                    padding: '12px',
                    borderRadius: '12px',
                    background: unlocked ? 'rgba(251,191,36,0.08)' : 'rgba(26,26,46,0.6)',
                    border: `1px solid ${unlocked ? 'rgba(251,191,36,0.4)' : 'rgba(124,58,237,0.15)'}`,
                    opacity: unlocked ? 1 : 0.5,
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '4px', filter: unlocked ? 'none' : 'grayscale(1)' }}>
                      {unlocked ? a.emoji : '🔒'}
                    </div>
                    <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '0.58rem', fontWeight: 700, color: unlocked ? '#fbbf24' : '#64748b', marginBottom: '3px' }}>
                      {a.name}
                    </div>
                    <div style={{ fontSize: '0.6rem', color: '#475569', lineHeight: 1.3 }}>
                      {unlocked ? a.desc : '???'}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ textAlign: 'center', marginTop: '14px', paddingBottom: '8px' }}>
              <button className="btn-primary" onClick={handleStart} style={{ fontSize: '0.85rem', padding: '12px 28px' }}>
                🎮 EARN MORE BADGES
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
