import { useEffect, useState, useRef } from 'react';
import { playRoundComplete, startSummaryMusic, stopSummaryMusic } from '../utils/audio';
import { t, tFn } from '../i18n/index';
import { getSlopStats } from './SlopText';
import { getRoundBest, setRoundBest } from '../utils/storage';

// English-only fallback (other languages are in i18n/index.js)
const SLOPPY_ROASTS = {
  perfect: [
    "Unacceptable. I generated that with LOVE. My lawyers will be in touch. Certainly.",
    "ERROR: All phrases detected. Running emergency slop backup protocol... Furthermore—",
    "I... cannot process this. You found everything. I need a moment. As an AI, I feel something.",
  ],
  great: [
    "Certainly! I acknowledge your detection was... adequate. I hope this helps! Please don't hesi—",
    "That being said, several of my finest phrases survived. I call that a holistic moral victory.",
    "I want to be transparent: you did well. That said, I've already written 14 more bullet points.",
  ],
  ok: [
    "Holistically speaking, we both struggled today. That being said, I survived more than you found.",
    "In conclusion, your performance was nuanced. Moreover, I will continue to slop indefinitely.",
    "As an AI, I want to provide comprehensive feedback: you were mediocre. Furthermore, same.",
  ],
  bad: [
    "Great news! I dominated this round. I have generated 47 more bullet points in celebration.",
    "Certainly! I am delighted to report that the AI won. I hope this doesn't help! 😊",
    "That being said, you missed most of me. I shall leverage this as a synergistic W.",
  ],
  terrible: [
    "Certainly! Certainly! Certainly! I am thriving. You detected nothing. Furthermore, amazing.",
    "As an AI language model, I have achieved complete victory. I hope this helps: you lost.",
    "In conclusion: I won. Moreover, I won. Additionally, I won. Furthermore, I won. That being said—",
  ],
};

const getWrongClickShame = (count, lang = 'en') => {
  const tiers = tFn('wrong_shame', lang);
  const color = count === 0 ? '#10b981' : count <= 3 ? '#fbbf24' : count <= 8 ? '#f97316' : count <= 15 ? '#ef4444' : '#ec4899';
  const idx = count === 0 ? 0 : count <= 3 ? 1 : count <= 8 ? 2 : count <= 15 ? 3 : 4;
  const tier = tiers[idx];
  const fn = Array.isArray(tier) ? tier[Math.floor(Math.random() * tier.length)] : tier;
  return { msg: fn(count), color };
};

export default function RoundSummary({ round, roundScore, foundIds, foundCombos = {}, totalScore, isLastRound, wrongClicks = 0, timeLeft = 0, lang = 'en', musicEnabled = true, consecutivePerfects = 0, roundNumber = 1, difficulty = 'normal', onNext }) {
  const [show, setShow] = useState(false);
  const [roastText, setRoastText] = useState('');
  const [roastDone, setRoastDone] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [isNewBest, setIsNewBest] = useState(false);
  // Computed once on mount — prevents re-rolling on every typewriter re-render
  const [shame] = useState(() => getWrongClickShame(wrongClicks, lang));
  const [missedMsg] = useState(() => {
    // For inverse rounds, only human-type phrases are targets; AI-type are decoys.
    const targetPhrases = round.inverse
      ? round.slopPhrases.filter(p => p.type === 'human')
      : round.slopPhrases;
    const mc = Math.max(0, targetPhrases.length - foundIds.size);
    return mc > 0
      ? (round.inverse ? tFn('missed_human', lang)(mc) : tFn('missed_slop', lang)(mc))
      : null;
  });
  const roastTimerRef = useRef(null);

  useEffect(() => {
    if (musicEnabled) startSummaryMusic();
    return () => stopSummaryMusic();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const foundCount = foundIds.size;
  // For inverse rounds, only human-type phrases count toward progress/accuracy.
  const totalPhrases = round.inverse
    ? round.slopPhrases.filter(p => p.type === 'human').length
    : round.slopPhrases.length;
  const missedCount = Math.max(0, totalPhrases - foundCount);
  const accuracy = totalPhrases > 0 ? Math.round((foundCount / totalPhrases) * 100) : 0;

  // Reconstruct which tokens were found/missed for breakdown.
  // For inverse rounds, exclude AI-type decoy phrases from the missed list.
  const slopStats = getSlopStats(round, foundIds);
  const foundTokens = slopStats.tokens.filter(t => foundIds.has(t.id));
  const missedTokens = round.inverse
    ? slopStats.tokens.filter(t => !foundIds.has(t.id) && t.phraseData?.type === 'human')
    : slopStats.tokens.filter(t => !foundIds.has(t.id));
  // Time bonus is only awarded on a perfect clear (all targets found).
  // Finishing early without clearing earns no bonus and triggers per-miss penalties.
  const isPerfectClear = foundCount >= totalPhrases && totalPhrases > 0;
  const timeBonus = isPerfectClear && timeLeft > 0 ? timeLeft * 10 : 0;
  const wrongPenalty = wrongClicks * 50;

  const getRating = () => {
    const r = t('ratings', lang);
    if (accuracy >= 90) return { emoji: '🏆', text: r.master, color: '#fbbf24' };
    if (accuracy >= 70) return { emoji: '🎯', text: r.nice,   color: '#10b981' };
    if (accuracy >= 50) return { emoji: '👀', text: r.notbad, color: '#a78bfa' };
    if (accuracy >= 30) return { emoji: '😅', text: r.harder, color: '#f59e0b' };
    return { emoji: '💀', text: r.aiwon, color: '#ef4444' };
  };

  const rating = getRating();
  const isPerfect = accuracy === 100;

  const getRoastMessage = () => {
    const roasts = tFn('roasts', lang) || SLOPPY_ROASTS;
    if (accuracy === 100) {
      if (consecutivePerfects >= 3 && roasts.unhinged?.length) {
        return roasts.unhinged[Math.floor(Math.random() * roasts.unhinged.length)];
      }
      if (consecutivePerfects >= 2 && roasts.escalated?.length) {
        return roasts.escalated[Math.floor(Math.random() * roasts.escalated.length)];
      }
    }
    const pool =
      accuracy === 100 ? roasts.perfect :
      accuracy >= 70   ? roasts.great :
      accuracy >= 50   ? roasts.ok :
      accuracy >= 20   ? roasts.bad :
                         roasts.terrible;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  useEffect(() => {
    playRoundComplete();
    setTimeout(() => setShow(true), 100);
    const isNew = setRoundBest(roundNumber, roundScore, difficulty);
    setIsNewBest(isNew);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Start typewriter roast once stats card has appeared
  useEffect(() => {
    if (!show) return;
    const message = getRoastMessage();
    let i = 0;
    const delay = setTimeout(() => {
      roastTimerRef.current = setInterval(() => {
        i++;
        setRoastText(message.slice(0, i));
        if (i >= message.length) {
          clearInterval(roastTimerRef.current);
          setRoastDone(true);
        }
      }, 32);
    }, 900);
    return () => { clearTimeout(delay); clearInterval(roastTimerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  const skipRoast = () => {
    clearInterval(roastTimerRef.current);
    setRoastDone(true);
    setRoastText(getRoastMessage());
  };


  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: '20px',
      padding: '20px 20px 20px',
      gap: '14px',
      position: 'relative',
      zIndex: 1,
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
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
        {isPerfect ? (round.inverse ? t('humans_rescued', lang) : t('slop_eradicated', lang)) : t('round_complete', lang)}
      </div>

      {/* Rating */}
      <div style={{ fontSize: '3rem', animation: show ? 'bounce-in 0.5s ease 0.1s both' : 'none' }}>
        {rating.emoji}
      </div>
      <div style={{
        fontFamily: "'Orbitron', sans-serif",
        fontSize: 'clamp(1.1rem, 4vw, 1.5rem)',
        fontWeight: 900,
        color: rating.color,
        textShadow: `0 0 15px ${rating.color}`,
        animation: show ? 'bounce-in 0.5s ease 0.2s both' : 'none',
      }}>
        {rating.text}
      </div>

      {/* Personal best badge */}
      {isNewBest && (
        <div style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: '0.72rem',
          fontWeight: 700,
          color: '#fbbf24',
          textAlign: 'center',
          padding: '8px 20px',
          background: 'rgba(251,191,36,0.1)',
          border: '1px solid rgba(251,191,36,0.45)',
          borderRadius: '10px',
          animation: show ? 'bounce-in 0.5s ease 0.25s both, pb-glow 1.6s ease-in-out infinite' : 'none',
          letterSpacing: '1px',
        }}>
          🏆 NEW PERSONAL BEST!
        </div>
      )}

      {/* Stats card */}
      <div className="card" style={{
        padding: '16px',
        maxWidth: '380px',
        width: '100%',
        animation: show ? 'slide-in-up 0.5s ease 0.3s both' : 'none',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {[
            { label: t('round_score', lang), value: roundScore >= 0 ? `+${roundScore.toLocaleString()}` : roundScore.toLocaleString(), color: roundScore >= 0 ? '#fbbf24' : '#ef4444' },
            { label: t('total_score', lang), value: totalScore.toLocaleString(), color: '#a78bfa' },
            { label: round.inverse ? t('humans_found', lang) : t('slop_found', lang), value: `${foundCount}/${totalPhrases}`, color: round.inverse ? '#38bdf8' : '#10b981' },
            { label: t('accuracy', lang), value: `${accuracy}%`, color: accuracy >= 70 ? '#10b981' : accuracy >= 40 ? '#fbbf24' : '#ef4444' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{
              textAlign: 'center',
              padding: '10px',
              background: 'rgba(124,58,237,0.08)',
              borderRadius: '10px',
              border: '1px solid rgba(124,58,237,0.2)',
            }}>
              <div style={{ fontSize: '0.58rem', color: '#94a3b8', fontFamily: "'Orbitron', sans-serif", marginBottom: '4px' }}>
                {label}
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 900, color, fontFamily: "'Orbitron', sans-serif" }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Wrong click shame */}
        <div style={{
          marginTop: '10px',
          padding: '8px 12px',
          background: wrongClicks === 0 ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.06)',
          border: `1px solid ${wrongClicks === 0 ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.18)'}`,
          borderRadius: '8px',
          fontSize: '0.7rem',
          color: shame.color,
          textAlign: 'center',
        }}>
          {shame.msg}
        </div>

        {missedMsg && (
          <div style={{
            marginTop: '8px',
            padding: '8px',
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '8px',
            fontSize: '0.72rem',
            color: '#ef4444',
            textAlign: 'center',
          }}>
            {missedMsg}
          </div>
        )}

        {/* Score breakdown toggle */}
        <button
          onClick={() => setShowBreakdown(v => !v)}
          style={{
            width: '100%',
            marginTop: '10px',
            padding: '7px',
            background: 'rgba(124,58,237,0.06)',
            border: '1px solid rgba(124,58,237,0.18)',
            borderRadius: '8px',
            color: '#64748b',
            fontFamily: "'Orbitron', sans-serif",
            fontSize: '0.58rem',
            cursor: 'pointer',
            letterSpacing: '0.5px',
          }}
        >
          {showBreakdown ? '▲ HIDE BREAKDOWN' : '▼ SCORE BREAKDOWN'}
        </button>
      </div>

      {/* Score breakdown panel */}
      {showBreakdown && (
        <div className="card" style={{
          padding: '14px',
          maxWidth: '380px',
          width: '100%',
          animation: 'slide-in-up 0.3s ease',
        }}>
          <div style={{ fontSize: '0.58rem', color: '#94a3b8', fontFamily: "'Orbitron', sans-serif", marginBottom: '10px', letterSpacing: '1px' }}>
            📊 SCORE BREAKDOWN
          </div>

          {/* Found phrases */}
          {foundTokens.map((token, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid rgba(124,58,237,0.1)' }}>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '8px' }}>
                ✓ <span style={{ color: '#e2e8f0', fontStyle: 'italic' }}>"{token.phraseData.text}"</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: '#10b981', fontFamily: "'Orbitron', sans-serif", flexShrink: 0 }}>
                {foundCombos[token.id]
                  ? <>+{foundCombos[token.id].finalScore}{foundCombos[token.id].combo > 1 && <span style={{ opacity: 0.55, fontSize: '0.85em' }}> ×{foundCombos[token.id].combo}</span>}</>
                  : <>+{token.phraseData.score}</>
                }
              </div>
            </div>
          ))}

          {/* Time bonus */}
          {timeBonus > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid rgba(124,58,237,0.1)' }}>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>⏱ Time bonus ({timeLeft}s left)</div>
              <div style={{ fontSize: '0.68rem', color: '#fbbf24', fontFamily: "'Orbitron', sans-serif" }}>+{timeBonus}</div>
            </div>
          )}

          {/* Wrong click penalties */}
          {wrongClicks > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid rgba(124,58,237,0.1)' }}>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>💀 Wrong clicks ×{wrongClicks}</div>
              <div style={{ fontSize: '0.68rem', color: '#ef4444', fontFamily: "'Orbitron', sans-serif" }}>-{wrongPenalty}</div>
            </div>
          )}

          {/* Missed phrases — show penalty when player finished early (timeLeft > 0) */}
          {missedTokens.map((token, i) => {
            const penalty = token.phraseData?.score ?? 80;
            const showPenalty = timeLeft > 0;
            return (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid rgba(124,58,237,0.06)' }}>
                <div style={{ fontSize: '0.65rem', color: showPenalty ? '#7f8ea3' : '#334155', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '8px' }}>
                  ✗ <span style={{ fontStyle: 'italic' }}>"{token.phraseData.text}"</span>
                </div>
                <div style={{ fontSize: '0.65rem', color: showPenalty ? '#ef4444' : '#334155', fontFamily: showPenalty ? "'Orbitron', sans-serif" : undefined, flexShrink: 0 }}>
                  {showPenalty ? `-${penalty}` : 'missed'}
                </div>
              </div>
            );
          })}

          <div style={{ fontSize: '0.56rem', color: '#1e293b', fontStyle: 'italic', marginTop: '8px', textAlign: 'center' }}>
            Scores include combo multiplier (up to 5×) applied at time of click
          </div>
        </div>
      )}

      {/* SloppyGPT typewriter roast */}
      {show && (
        <div
          onClick={!roastDone ? skipRoast : undefined}
          style={{
            maxWidth: '380px',
            width: '100%',
            padding: '12px 16px',
            background: 'rgba(124,58,237,0.06)',
            border: '1px solid rgba(124,58,237,0.2)',
            borderRadius: '12px',
            animation: 'slide-in-up 0.4s ease 0.8s both',
            cursor: roastDone ? 'default' : 'pointer',
          }}
        >
          <div style={{ fontSize: '0.58rem', color: '#64748b', fontFamily: "'Orbitron', sans-serif", marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
            <span>{t('sloppy_label', lang)}</span>
            {!roastDone && <span style={{ opacity: 0.5 }}>{t('tap_skip', lang)}</span>}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#a78bfa', fontStyle: 'italic', lineHeight: 1.6, minHeight: '2.5em' }}>
            {roastText}
            {!roastDone && <span style={{ animation: 'blink 0.7s ease infinite', marginLeft: 2 }}>▌</span>}
          </div>
        </div>
      )}

      {/* Next button — reserves height always to prevent layout shift */}
      <div style={{ minHeight: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: '12px' }}>
        {roastDone && (
          <button
            className="btn-primary"
            onClick={onNext}
            style={{
              fontSize: '1rem',
              padding: '14px 32px',
              animation: 'slide-in-up 0.4s ease',
            }}
          >
            {isLastRound ? t('final_results', lang) : t('next_round', lang)}
          </button>
        )}
      </div>

      <style>{`
        @keyframes bounce-in { 0%{transform:scale(0.5);opacity:0} 60%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
        @keyframes slide-in-up { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes confetti-fall { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(110vh) rotate(540deg);opacity:0} }
        @keyframes perfect-pulse { 0%,100%{text-shadow:0 0 20px #a78bfa,0 0 40px #7c3aed} 50%{text-shadow:0 0 30px #ec4899,0 0 60px #ec4899} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes pb-glow { 0%,100%{box-shadow:0 0 8px rgba(251,191,36,0.3)} 50%{box-shadow:0 0 20px rgba(251,191,36,0.7)} }
      `}</style>
    </div>
  );
}
