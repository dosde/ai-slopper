import { useCallback, useRef, useState, useEffect } from 'react';
import { getRandomCommentary } from '../data/slopData';
import { playSlopDetected, playCombo } from '../utils/audio';

/**
 * Tokenizes text into normal and slop phrase segments.
 * Longest phrases matched first to avoid substring conflicts.
 */
function tokenize(text, slopPhrases) {
  const sorted = [...slopPhrases].sort((a, b) => b.text.length - a.text.length);
  let segments = [{ text, isSlop: false, phraseData: null }];

  for (const phrase of sorted) {
    const next = [];
    for (const seg of segments) {
      if (seg.isSlop) { next.push(seg); continue; }
      const idx = seg.text.toLowerCase().indexOf(phrase.text.toLowerCase());
      if (idx === -1) { next.push(seg); continue; }
      if (idx > 0) next.push({ text: seg.text.slice(0, idx), isSlop: false, phraseData: null });
      next.push({ text: seg.text.slice(idx, idx + phrase.text.length), isSlop: true, phraseData: phrase });
      if (idx + phrase.text.length < seg.text.length) {
        next.push({ text: seg.text.slice(idx + phrase.text.length), isSlop: false, phraseData: null });
      }
    }
    segments = next;
  }
  return segments.map((seg, i) => ({ ...seg, id: i }));
}

// Words per second for typing reveal
const WORDS_PER_SECOND = 18;

export default function SlopText({
  round, onScore, onCombo, combo,
  found, onFoundChange,
  radarActive = false, doublePoints = false,
  onTypingComplete,
}) {
  const tokens = useRef(null);
  const [revealedCount, setRevealedCount] = useState(0);
  const [typingDone, setTypingDone] = useState(false);
  const intervalRef = useRef(null);

  // Build tokens once per round
  if (!tokens.current) {
    tokens.current = tokenize(round.text, round.slopPhrases);
  }
  const total = tokens.current.length;

  // Typing animation: reveal tokens progressively
  useEffect(() => {
    // Reset on new round
    setRevealedCount(0);
    setTypingDone(false);
    tokens.current = tokenize(round.text, round.slopPhrases);

    const totalTokens = tokens.current.length;
    // Approximate total words across all tokens
    const totalWords = round.text.split(/\s+/).length;
    const msPerToken = (1000 / WORDS_PER_SECOND) * (totalWords / totalTokens);
    const delay = Math.max(20, Math.min(msPerToken, 80));

    let count = 0;
    intervalRef.current = setInterval(() => {
      count += Math.ceil(totalTokens / (totalWords / 2));
      setRevealedCount(Math.min(count, totalTokens));
      if (count >= totalTokens) {
        clearInterval(intervalRef.current);
        setTypingDone(true);
        onTypingComplete?.();
      }
    }, delay);

    return () => clearInterval(intervalRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round.id]);

  const handleSlopClick = useCallback((e, token) => {
    if (!found || found.has(token.id)) return;
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;

    const newFound = new Set(found);
    newFound.add(token.id);
    onFoundChange(newFound);

    const commentary = getRandomCommentary(token.phraseData.type);
    const newCombo = (combo || 0) + 1;
    const multiplier = Math.min(newCombo, 5);
    const baseScore = token.phraseData.score * multiplier;
    const score = doublePoints ? baseScore * 2 : baseScore;

    playSlopDetected();
    if (newCombo > 1) playCombo(newCombo);

    onScore(score, x, y, commentary, doublePoints);
    onCombo(newCombo);
  }, [found, combo, onScore, onCombo, onFoundChange, doublePoints]);

  return (
    <div style={{
      fontFamily: "'Inter', sans-serif",
      fontSize: '0.95rem',
      lineHeight: '1.9',
      color: '#e2e8f0',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    }}>
      {tokens.current.map((token, idx) => {
        const isRevealed = idx < revealedCount;

        if (!token.isSlop) {
          return (
            <span
              key={token.id}
              style={{
                opacity: isRevealed ? 1 : 0,
                transition: 'opacity 0.1s',
              }}
            >
              {token.text}
            </span>
          );
        }

        const isFound = found.has(token.id);
        const showRadar = radarActive && !isFound && isRevealed;

        return (
          <span
            key={token.id}
            className={`slop-token ${isFound ? 'found' : isRevealed ? 'active' : ''}`}
            onClick={isRevealed && !isFound ? (e) => handleSlopClick(e, token) : undefined}
            title={isFound ? undefined : isRevealed ? `Click to detect slop! (+${token.phraseData.score} pts)` : undefined}
            style={{
              opacity: isRevealed ? 1 : 0,
              transition: 'opacity 0.1s',
              ...(showRadar ? {
                background: 'rgba(16, 185, 129, 0.35)',
                borderBottom: '2px solid #10b981',
                boxShadow: '0 0 8px rgba(16,185,129,0.6)',
                animation: 'radar-pulse 0.5s ease-in-out infinite alternate',
              } : {}),
              ...(doublePoints && !isFound && isRevealed ? {
                borderBottom: '2px solid rgba(251,191,36,0.6)',
              } : {}),
            }}
          >
            {token.text}
          </span>
        );
      })}
      <style>{`
        @keyframes radar-pulse {
          from { background: rgba(16,185,129,0.2); box-shadow: 0 0 4px rgba(16,185,129,0.4); }
          to   { background: rgba(16,185,129,0.5); box-shadow: 0 0 12px rgba(16,185,129,0.8); }
        }
      `}</style>
    </div>
  );
}

export function getSlopStats(round, found) {
  const tokens = tokenize(round.text, round.slopPhrases);
  const slopTokens = tokens.filter(t => t.isSlop);
  const foundCount = slopTokens.filter(t => found.has(t.id)).length;
  return {
    total: slopTokens.length,
    found: foundCount,
    missed: slopTokens.length - foundCount,
    tokens: slopTokens,
  };
}
