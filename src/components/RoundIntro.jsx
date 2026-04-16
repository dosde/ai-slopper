import { useEffect, useState } from 'react';
import FalImage from './FalImage';
import { t as tr } from '../i18n/index';
import { playCountdownTick, playCountdownGo, startSummaryMusic, stopSummaryMusic, startInverseMusic, stopInverseMusic } from '../utils/audio';


// Which special mechanics does this round use? Returns an array of
// { key, label, emoji, color, hint } for each active mechanic so the intro
// can tease the player before the round starts. Pure inspection — no mutation.
function detectMechanics(round) {
  if (!round) return [];
  const out = [];
  if (round.madlibs) {
    out.push({ key: 'madlibs', label: 'MAD LIBS', emoji: '📝', color: '#a855f7', hint: 'Tap a word, tap a slot — fill in the blanks' });
    return out; // madlibs takes over the whole round — no other mechanics coexist
  }
  const phs = round.slopPhrases || [];
  if (phs.some(p => p.rizz)) {
    out.push({ key: 'rizz', label: 'RIZZ ROUND', emoji: '🔥', color: '#ec4899', hint: 'A phrase is hiding in here. Find it — it pays 10×' });
  }
  if (phs.some(p => p.morph)) {
    out.push({ key: 'morph', label: 'DOUBLE AGENT', emoji: '⚡', color: '#38bdf8', hint: 'Some phrases change after a moment — catch them fast for a bonus' });
  }
  if (phs.some(p => p.autocorrect)) {
    out.push({ key: 'autocorrect', label: 'AUTOCORRECT', emoji: '🔁', color: '#fb923c', hint: 'Chain-click a phrase to make it worse — lock in for massive score' });
  }
  return out;
}

export default function RoundIntro({ round, totalRounds, onReady, difficulty = 'normal', lang = 'en', musicEnabled = true }) {
  const isInverse = !!round?.inverse;
  const isBoss = !!round?.boss;
  const isBrainrot = difficulty === 'brainrot';
  const isIronDetector = difficulty === 'iron';
  const mechanics = detectMechanics(round);
  const [countdown, setCountdown] = useState(5);
  const [readyToStart, setReadyToStart] = useState(false);
  const [thinkingIdx, setThinkingIdx] = useState(0);

  // Inverse rounds play the haunting inverse track during countdown so there is no
  // jarring fanfare→inverse crossfade when the round actually starts. All other
  // round types keep the summary fanfare as a neutral between-rounds bridge.
  useEffect(() => {
    if (musicEnabled) {
      if (isInverse) startInverseMusic();
      else startSummaryMusic();
    }
    return () => {
      if (isInverse) stopInverseMusic();
      else stopSummaryMusic();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      playCountdownGo();
      setReadyToStart(true);
      return;
    }
    playCountdownTick(countdown);
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const thinkingMsgs = tr('thinking', lang);
  useEffect(() => {
    const i = setInterval(() => setThinkingIdx(n => (n + 1) % thinkingMsgs.length), 650);
    return () => clearInterval(i);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: '28px',
      padding: '28px 24px 24px',
      gap: '16px',
      position: 'relative',
      zIndex: 1,
      overflowY: 'auto',
      background: isInverse
        ? 'radial-gradient(ellipse at top, rgba(8,145,178,0.18) 0%, transparent 65%)'
        : 'transparent',
      transition: 'background 0.5s',
    }}>
      {/* Round badge */}
      <div style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: '0.7rem',
        color: '#94a3b8',
        letterSpacing: '2px',
      }}>
        {tr('round', lang)} {round.roundNumber ?? round.id} / {totalRounds}
      </div>

      {/* Round title */}
      <div style={{
        fontFamily: "'Orbitron', sans-serif",
        fontSize: 'clamp(1.2rem, 5vw, 1.8rem)',
        fontWeight: 900,
        color: isBoss ? '#ef4444' : '#a78bfa',
        textAlign: 'center',
        textShadow: isBoss ? '0 0 20px #ef4444, 0 0 40px rgba(239,68,68,0.5)' : '0 0 15px #7c3aed',
        animation: isBoss ? 'bounce-in 0.5s ease, boss-flicker 1.4s ease-in-out infinite' : 'bounce-in 0.5s ease',
      }}>
        {round.emoji} {round.title}
      </div>

      {isBoss && (
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: '0.55rem',
          color: '#fca5a5',
          letterSpacing: '2px',
          textAlign: 'center',
          opacity: 0.85,
        }}>
          ⚔️ ROUND 6 / 6 — THE FINAL BOSS
        </div>
      )}

      {/* Inverse mode warning — shown before context box for maximum visibility */}
      {isInverse && (
        <div style={{
          padding: '14px 20px',
          background: 'linear-gradient(135deg, rgba(8,145,178,0.35), rgba(14,116,144,0.15))',
          border: '2px solid rgba(56,189,248,0.85)',
          borderRadius: '14px',
          textAlign: 'center',
          maxWidth: '380px',
          width: '100%',
          animation: 'bounce-in 0.5s ease, inverse-glow 1.6s ease-in-out infinite',
          boxShadow: '0 0 22px rgba(56,189,248,0.35)',
        }}>
          <div style={{ fontSize: '2.2rem', marginBottom: '4px' }}>🔄</div>
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'clamp(0.7rem, 2.5vw, 0.9rem)',
            color: '#38bdf8',
            textShadow: '0 0 14px #38bdf8, 0 0 28px rgba(56,189,248,0.5)',
            letterSpacing: '2px',
            marginBottom: '8px',
          }}>
            RULES REVERSED!
          </div>
          <div style={{ fontSize: '0.78rem', color: '#7dd3fc', lineHeight: 1.6, maxWidth: '300px', margin: '0 auto' }}>
            The AI text is <strong style={{ color: '#38bdf8' }}>everywhere</strong> — find the <strong style={{ color: '#a5f3fc' }}>HUMAN phrases</strong> hiding inside!
          </div>
          <div style={{ fontSize: '0.62rem', color: '#0891b2', marginTop: '6px', fontStyle: 'italic' }}>
            {tr('inverse_hint', lang)}
          </div>
        </div>
      )}

      {/* Mechanic badges — tell the player what's special about this round.
          Rendered above the context box so they see it before the prompt. */}
      {mechanics.length > 0 && (
        <div style={{
          display: 'flex', flexDirection: 'column', gap: '6px',
          maxWidth: '380px', width: '100%',
          animation: 'bounce-in 0.5s ease',
        }}>
          {mechanics.map(m => (
            <div key={m.key} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '8px 14px',
              background: `linear-gradient(135deg, ${m.color}22, ${m.color}08)`,
              border: `1.5px solid ${m.color}99`,
              borderRadius: '10px',
              boxShadow: `0 0 12px ${m.color}33`,
            }}>
              <div style={{ fontSize: '1.3rem', flexShrink: 0 }}>{m.emoji}</div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: '0.6rem', letterSpacing: '1.5px',
                  color: m.color, textShadow: `0 0 6px ${m.color}`,
                }}>
                  {m.label}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#cbd5e1', marginTop: '2px', lineHeight: 1.4 }}>
                  {m.hint}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Context box */}
      <div className="card" style={{
        padding: '12px 20px',
        maxWidth: '380px',
        width: '100%',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '4px', fontFamily: "'Orbitron', sans-serif" }}>
          {tr('the_prompt', lang)}
        </div>
        <div style={{ color: '#e2e8f0', fontSize: '0.9rem', fontStyle: 'italic' }}>
          {round.context || round.prompt /* legacy rounds (311-315 + some ru) use `prompt` */}
        </div>
      </div>

      {/* Fal.ai image */}
      <FalImage prompt={round.falPrompt} roundId={round.id} size={180} />

      {/* Instructions */}
      <div style={{
        background: isBoss ? 'rgba(239,68,68,0.1)' : isInverse ? 'rgba(56,189,248,0.08)' : isIronDetector ? 'rgba(236,72,153,0.08)' : 'rgba(124, 58, 237, 0.1)',
        border: `2px solid ${isBoss ? 'rgba(239,68,68,0.6)' : isInverse ? 'rgba(56,189,248,0.4)' : isIronDetector ? 'rgba(236,72,153,0.5)' : 'rgba(124, 58, 237, 0.3)'}`,
        borderRadius: '12px',
        padding: '10px 18px',
        textAlign: 'center',
        maxWidth: '380px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        boxShadow: isBoss ? '0 0 20px rgba(239,68,68,0.3)' : 'none',
        animation: isBoss ? 'boss-pulse 2s ease-in-out infinite' : 'none',
      }}>
        {isBoss ? (
          <>
            <div style={{ fontSize: '0.78rem', color: '#fca5a5' }}>
              This is it. The AI gave 100% slop. Find <strong>every single phrase</strong>.
            </div>
            <div style={{ fontSize: '0.65rem', color: '#fca5a5', fontStyle: 'italic', opacity: 0.85 }}>
              {round.slopPhrases?.length ?? '?'} phrases · 60 seconds · Miss penalty on DONE
            </div>
          </>
        ) : isInverse ? (
          <>
            <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 700 }}>
              {tr('inverse_header', lang)}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#e2e8f0' }}>
              {tr('inverse_body', lang)}
            </div>
            <div style={{ fontSize: '0.65rem', color: '#64748b', fontStyle: 'italic' }}>
              {tr('inverse_hint', lang)}
            </div>
          </>
        ) : isIronDetector ? (
          <>
            <div style={{ fontSize: '0.8rem', color: '#ec4899', fontWeight: 700 }}>
              ☠ IRON DETECTOR MODE
            </div>
            <div style={{ fontSize: '0.78rem', color: '#e2e8f0' }}>
              Find all AI slop phrases. One wrong click and the run is over.
            </div>
            <div style={{ fontSize: '0.65rem', color: '#ec4899', fontStyle: 'italic' }}>
              Timer counts up — faster completion = higher score bonus
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: '0.8rem', color: isBrainrot ? '#fb923c' : '#a78bfa' }}>
              {isBrainrot ? tr('brainrot_header', lang) : tr('normal_body', lang)}
            </div>
            {isBrainrot && (
              <div style={{ fontSize: '0.65rem', color: '#64748b' }}>
                {tr('brainrot_hint', lang)}
              </div>
            )}
            <div style={{
              fontSize: '0.62rem',
              color: '#475569',
              fontStyle: 'italic',
              minHeight: '1.3em',
            }}>
              💭 "{thinkingMsgs[thinkingIdx]}"
            </div>
          </>
        )}
      </div>

      {/* Countdown */}
      <div style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 'clamp(2.5rem, 10vw, 4rem)',
        color: countdown <= 1 && !readyToStart ? '#ef4444' : countdown <= 2 ? '#fbbf24' : (isBoss ? '#ef4444' : isInverse ? '#38bdf8' : isIronDetector ? '#ec4899' : '#10b981'),
        textShadow: `0 0 20px currentColor`,
        animation: 'bounce-in 0.3s ease',
        key: countdown,
        minHeight: '5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {countdown > 0 ? countdown : tr('go', lang)}
      </div>

      {/* Start button area — always reserves height to prevent layout shift */}
      <div style={{ minHeight: '54px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {readyToStart && (
          <button
            className="btn-primary"
            onClick={onReady}
            style={{ fontSize: '1rem', padding: '14px 36px', animation: 'bounce-in 0.4s ease' }}
          >
            ▶ START
          </button>
        )}
      </div>

      <style>{`
        @keyframes bounce-in {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes boss-flicker { 0%,100%{opacity:1} 50%{opacity:0.65} }
        @keyframes boss-pulse { 0%,100%{box-shadow:0 0 14px rgba(239,68,68,0.3)} 50%{box-shadow:0 0 28px rgba(239,68,68,0.75)} }
        @keyframes inverse-glow { 0%,100%{box-shadow:0 0 16px rgba(56,189,248,0.35)} 50%{box-shadow:0 0 32px rgba(56,189,248,0.8),0 0 60px rgba(56,189,248,0.25)} }
      `}</style>
    </div>
  );
}
