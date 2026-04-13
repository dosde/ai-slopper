import { useEffect, useState } from 'react';
import { initAudio, startMusic, startTitleMusic, stopTitleMusic, getMusicStyle, setMusicStyle } from '../utils/audio';
import Leaderboard from './Leaderboard';
import { getLeaderboard, getUnlockedAchievements, ACHIEVEMENTS, getSlopDictSorted } from '../utils/storage';
import { LANGS } from '../i18n/index';

const TAGLINES = [
  "CAN YOU SPOT THE AI GARBAGE?",
  "DEFEAT THE SLOP MONSTER!",
  "HOW MUCH CRINGE CAN YOU FIND?",
  "5 RANDOM ROUNDS EVERY GAME!",
  "POWER-UPS! COMBOS! CHAOS MODE!",
];

const STATUS_UPDATES = [
  "SloppyGPT is writing a 12-paragraph response to 'yes or no?'",
  "SloppyGPT is adding 'As an AI language model' to a grocery list",
  "SloppyGPT is generating 47 bullet points about sandwich making",
  "SloppyGPT is reminding someone it cannot feel emotions (for the 8th time)",
  "SloppyGPT is holistically approaching a request for the time",
  "SloppyGPT is leveraging synergistic paradigm shifts (unknown purpose)",
  "SloppyGPT is writing 'I hope this helps!' for the 4 billionth time",
  "SloppyGPT is being transparent about its limitations again",
  "SloppyGPT is generating a comprehensive overview of nothing",
  "SloppyGPT is 'delighted' to assist (it cannot be delighted, it is a machine)",
  "SloppyGPT is adding 'Furthermore' to a message that didn't need it",
  "SloppyGPT is crafting a nuanced response to 'what's 2+2?'",
  "SloppyGPT is asking if there's anything else it can help with (there is not)",
  "SloppyGPT is providing actionable insights about boiling water",
  "SloppyGPT is starting its response with 'Certainly!' for no reason",
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
  const [statusIdx, setStatusIdx] = useState(0);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [musicStyle, setMusicStyleState] = useState(getMusicStyle);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [difficulty, setDifficulty] = useState('normal');
  const [mode, setMode] = useState('random'); // 'random' | 'daily'
  const [lang, setLang] = useState('en');
  const [tab, setTab] = useState('play'); // 'play' | 'scores' | 'badges'
  const [scoresMode, setScoresMode] = useState('all'); // 'all' | 'daily'
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
    const i = setInterval(() => setStatusIdx(n => (n + 1) % STATUS_UPDATES.length), 3000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    const p = setInterval(() => setTitlePulse(v => !v), 900);
    return () => clearInterval(p);
  }, []);

  // Handle music toggle after first interaction
  useEffect(() => {
    if (!hasInteracted) return;
    if (musicEnabled) startTitleMusic(); else stopTitleMusic();
  }, [hasInteracted, musicEnabled]);

  // Always stop on unmount
  useEffect(() => () => stopTitleMusic(), []);

  const handleFirstInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      // Call directly in the click handler — satisfies browser autoplay policy
      if (musicEnabled) startTitleMusic();
    }
  };

  const handleStart = () => {
    stopTitleMusic();
    initAudio();
    if (musicEnabled) startMusic();
    onStart({ difficulty, mode, musicEnabled, lang });
  };

  return (
    <div
      onClick={handleFirstInteraction}
      style={{
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

        {/* Slop facts ticker — single line, truncated to prevent any layout jump */}
        <div style={{
          fontSize: '0.58rem',
          color: '#475569',
          fontStyle: 'italic',
          maxWidth: '340px',
          margin: '4px auto 0',
          lineHeight: 1.4,
          height: '1.3em',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}>
          📊 {SLOP_FACTS[factIdx]}
        </div>

        {/* SloppyGPT live status */}
        <div style={{
          fontSize: '0.56rem',
          color: '#334155',
          maxWidth: '340px',
          margin: '2px auto 0',
          lineHeight: 1.4,
          height: '1.3em',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}>
          🔴 {STATUS_UPDATES[statusIdx]}
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
        {[['play', '🎮 PLAY'], ['scores', '🏆 SCORES'], ['badges', '🎖 BADGES'], ['dict', '📖 DICT']].map(([id, label]) => (
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
            {/* Language + Game mode (compact combined row) */}
            <div className="card" style={{ padding: '10px 14px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                {/* Language dropdown */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.58rem', color: '#64748b', fontFamily: "'Orbitron', sans-serif", marginBottom: '5px', letterSpacing: '1px' }}>
                    LANGUAGE
                  </div>
                  <select
                    value={lang}
                    onChange={e => setLang(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '10px',
                      border: '2px solid rgba(124,58,237,0.4)',
                      background: 'rgba(124,58,237,0.1)',
                      color: '#a78bfa',
                      fontFamily: "'Orbitron', sans-serif",
                      fontWeight: 700,
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                      outline: 'none',
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23a78bfa' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 10px center',
                      paddingRight: '28px',
                    }}
                  >
                    {LANGS.map(l => (
                      <option key={l.code} value={l.code} style={{ background: '#1a1a2e', color: '#e2e8f0' }}>
                        {l.flag} {l.label}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Game mode */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.58rem', color: '#64748b', fontFamily: "'Orbitron', sans-serif", marginBottom: '5px', letterSpacing: '1px' }}>
                    MODE
                  </div>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    {[
                      { id: 'random', label: '🎲 RANDOM' },
                      { id: 'daily',  label: '📅 DAILY'  },
                    ].map(m => (
                      <button
                        key={m.id}
                        onClick={() => setMode(m.id)}
                        style={{
                          flex: 1,
                          padding: '8px 4px',
                          borderRadius: '10px',
                          border: `2px solid ${mode === m.id ? '#a78bfa' : 'rgba(124,58,237,0.2)'}`,
                          background: mode === m.id ? 'rgba(124,58,237,0.15)' : 'transparent',
                          color: mode === m.id ? '#a78bfa' : '#64748b',
                          cursor: 'pointer',
                          textAlign: 'center',
                          fontFamily: "'Orbitron', sans-serif",
                          fontWeight: 700,
                          fontSize: '0.62rem',
                          transition: 'all 0.2s',
                        }}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Difficulty */}
            <div className="card" style={{ padding: '10px 14px' }}>
              <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontFamily: "'Orbitron', sans-serif", marginBottom: '8px', letterSpacing: '1px' }}>
                DIFFICULTY
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                {[
                  { id: 'normal',   label: '😌 NORMAL',        desc: '45s per round',                color: '#10b981' },
                  { id: 'chaos',    label: '😈 CHAOS',          desc: '25s · high pressure',          color: '#ef4444' },
                  { id: 'brainrot', label: '🧠 BRAINROT',       desc: '40s · text corrupts',          color: '#fb923c' },
                  { id: 'iron',     label: '☠ IRON DETECTOR',  desc: 'No wrong clicks · stopwatch',  color: '#ec4899' },
                ].map(d => (
                  <button
                    key={d.id}
                    onClick={() => setDifficulty(d.id)}
                    style={{
                      flex: 1,
                      padding: '7px 8px',
                      borderRadius: '10px',
                      border: `2px solid ${difficulty === d.id ? d.color : 'rgba(124,58,237,0.2)'}`,
                      background: difficulty === d.id ? `${d.color}20` : 'transparent',
                      color: difficulty === d.id ? d.color : '#94a3b8',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: '0.68rem' }}>{d.label}</div>
                    <div style={{ fontSize: '0.58rem', marginTop: '2px', opacity: 0.8 }}>{d.desc}</div>
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
                ['⏱', 'Finish early to earn TIME BONUS: seconds left × 10 pts'],
                ['🧠', 'BRAINROT mode: wrong clicks corrupt the text — letters mutate!'],
                ['🎲', '5 rounds per game (always 1 inverse round) from a pool of 52'],
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
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-secondary" onClick={() => setMusicEnabled(m => !m)} style={{ fontSize: '0.7rem', padding: '7px 14px' }}>
                  {musicEnabled ? '🎵 MUSIC: ON' : '🔇 MUSIC: OFF'}
                </button>
                {musicEnabled && (
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      const next = musicStyle === 'sloppy' ? 'pleasant' : 'sloppy';
                      setMusicStyle(next);
                      setMusicStyleState(next);
                    }}
                    title="Switch music style — hear it live!"
                    style={{ fontSize: '0.7rem', padding: '7px 14px' }}
                  >
                    {musicStyle === 'sloppy' ? '🎮 SLOPPY' : '🎶 CHILL'}
                  </button>
                )}
              </div>
              <button className="btn-primary" onClick={handleStart} style={{ fontSize: '1rem', padding: '14px 36px' }}>
                🎮 START DETECTING
              </button>
              <div style={{ color: '#334155', fontSize: '0.62rem', fontFamily: "'Orbitron', sans-serif" }}>
                52 ROUNDS POOL • REAL AI SLOP™
              </div>
            </div>
          </>
        )}

        {tab === 'scores' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontFamily: "'Orbitron', sans-serif", letterSpacing: '1px' }}>
                HALL OF SHAME
              </div>
              <div style={{ display: 'flex', gap: '5px' }}>
                {[['all', '🏆 ALL-TIME'], ['daily', '📅 TODAY']].map(([m, label]) => (
                  <button
                    key={m}
                    onClick={() => setScoresMode(m)}
                    style={{
                      padding: '4px 9px',
                      borderRadius: '7px',
                      border: `1px solid ${scoresMode === m ? '#a78bfa' : 'rgba(124,58,237,0.2)'}`,
                      background: scoresMode === m ? 'rgba(124,58,237,0.15)' : 'transparent',
                      color: scoresMode === m ? '#a78bfa' : '#64748b',
                      fontFamily: "'Orbitron', sans-serif",
                      fontSize: '0.55rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <Leaderboard maxRows={10} mode={scoresMode} />
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

        {tab === 'dict' && (() => {
          const dict = getSlopDictSorted();
          const TYPE_COLORS = {
            opener: '#ec4899', disclaimer: '#ef4444', filler: '#fbbf24',
            closer: '#a78bfa', bullet: '#38bdf8', comprehensive: '#10b981',
            caveat: '#f97316', sycophant: '#fb923c', buzzword: '#64748b', human: '#38bdf8',
          };
          return (
            <div>
              <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontFamily: "'Orbitron', sans-serif", marginBottom: '10px', letterSpacing: '1px' }}>
                SLOP DICTIONARY ({dict.length} phrases detected)
              </div>
              {dict.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 16px', color: '#334155', fontSize: '0.8rem' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📖</div>
                  No slop detected yet.<br />
                  <span style={{ fontSize: '0.7rem', color: '#1e293b' }}>Play a game to start building your dictionary.</span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {dict.map((entry) => (
                    <div key={entry.text} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 12px',
                      background: 'rgba(26,26,46,0.7)',
                      borderRadius: '10px',
                      border: '1px solid rgba(124,58,237,0.15)',
                    }}>
                      <div style={{
                        fontSize: '0.58rem',
                        fontFamily: "'Orbitron', sans-serif",
                        fontWeight: 700,
                        color: TYPE_COLORS[entry.type] || '#94a3b8',
                        background: `${TYPE_COLORS[entry.type] || '#94a3b8'}18`,
                        border: `1px solid ${TYPE_COLORS[entry.type] || '#94a3b8'}44`,
                        borderRadius: '4px',
                        padding: '2px 6px',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                      }}>
                        {entry.type}
                      </div>
                      <div style={{ flex: 1, fontSize: '0.78rem', color: '#e2e8f0', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        "{entry.text}"
                      </div>
                      <div style={{
                        fontFamily: "'Orbitron', sans-serif",
                        fontWeight: 900,
                        fontSize: '0.78rem',
                        color: entry.count >= 10 ? '#fbbf24' : '#64748b',
                        flexShrink: 0,
                      }}>
                        ×{entry.count}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ textAlign: 'center', marginTop: '14px', paddingBottom: '8px' }}>
                <button className="btn-primary" onClick={handleStart} style={{ fontSize: '0.85rem', padding: '12px 28px' }}>
                  🎮 DETECT MORE SLOP
                </button>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
