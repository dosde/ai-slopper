import { useCallback, useRef, useState, useEffect } from 'react';
import { getRandomCommentary } from '../data/slopData';
import { playSlopDetected, playCombo, playMiss } from '../utils/audio';

/**
 * Tokenizes text into slop phrases and individual words.
 * Slop phrases matched longest-first to avoid substring conflicts.
 * Non-slop segments are then split into individual words so every
 * word is independently hoverable/clickable.
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
      if (idx + phrase.text.length < seg.text.length)
        next.push({ text: seg.text.slice(idx + phrase.text.length), isSlop: false, phraseData: null });
    }
    segments = next;
  }

  // Split non-slop segments into individual words so all text looks clickable
  const result = [];
  let id = 0;
  for (const seg of segments) {
    if (seg.isSlop) {
      result.push({ ...seg, id: id++ });
    } else {
      const parts = seg.text.split(/(\s+)/);
      for (const part of parts) {
        if (!part) continue;
        result.push({
          text: part,
          isSlop: false,
          isSpace: /^\s+$/.test(part),
          phraseData: null,
          id: id++,
        });
      }
    }
  }
  return result;
}

const WORDS_PER_SECOND = 18;

export default function SlopText({
  round, onScore, onCombo, combo,
  found, onFoundChange,
  onWrongClick,
  radarActive = false, doublePoints = false,
  onTypingComplete,
}) {
  const tokens = useRef(null);
  const [revealedCount, setRevealedCount] = useState(0);
  const [wrongIds, setWrongIds] = useState(new Set());
  const intervalRef = useRef(null);

  // Build tokens once per round
  if (!tokens.current) {
    tokens.current = tokenize(round.text, round.slopPhrases);
  }

  // Typing animation — reveal tokens progressively
  useEffect(() => {
    setRevealedCount(0);
    setWrongIds(new Set());
    tokens.current = tokenize(round.text, round.slopPhrases);

    const totalTokens = tokens.current.length;
    const totalWords = round.text.split(/\s+/).length;
    const msPerToken = (1000 / WORDS_PER_SECOND) * (totalWords / totalTokens);
    const delay = Math.max(20, Math.min(msPerToken, 80));
    let count = 0;

    intervalRef.current = setInterval(() => {
      count += Math.ceil(totalTokens / (totalWords / 2));
      setRevealedCount(Math.min(count, totalTokens));
      if (count >= totalTokens) {
        clearInterval(intervalRef.current);
        onTypingComplete?.();
      }
    }, delay);

    return () => clearInterval(intervalRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round.id]);

  // Correct click — slop phrase found
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

  // Wrong click — normal word clicked
  const handleNormalClick = useCallback((e, token) => {
    if (token.isSpace) return;
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;

    // Flash red
    setWrongIds(prev => new Set([...prev, token.id]));
    setTimeout(() => {
      setWrongIds(prev => { const n = new Set(prev); n.delete(token.id); return n; });
    }, 500);

    playMiss();
    onWrongClick?.(x, y);
  }, [onWrongClick]);

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

        if (!isRevealed) {
          return <span key={token.id} style={{ opacity: 0 }}>{token.text}</span>;
        }

        if (token.isSlop) {
          const isFound = found.has(token.id);
          const showRadar = radarActive && !isFound;
          const isInverse = !!round.inverse;
          return (
            <span
              key={token.id}
              className={`slop-token${isFound ? (isInverse ? ' human-found' : ' found') : ' active'}`}
              onClick={!isFound ? (e) => handleSlopClick(e, token) : undefined}
              style={{
                ...(showRadar ? {
                  background: 'rgba(56,189,248,0.3)',
                  borderBottom: '2px solid #38bdf8',
                  boxShadow: '0 0 8px rgba(56,189,248,0.6)',
                  animation: 'radar-pulse 0.5s ease-in-out infinite alternate',
                } : {}),
                ...(!isFound && !showRadar && doublePoints ? {
                  borderBottom: `2px solid rgba(${isInverse ? '56,189,248' : '251,191,36'},0.5)`,
                } : {}),
              }}
            >
              {token.text}
            </span>
          );
        }

        // Normal (non-slop) token
        if (token.isSpace) {
          return <span key={token.id}>{token.text}</span>;
        }

        const isWrong = wrongIds.has(token.id);
        return (
          <span
            key={token.id}
            className={`normal-token${isWrong ? ' wrong-click' : ''}`}
            onClick={(e) => handleNormalClick(e, token)}
          >
            {token.text}
          </span>
        );
      })}
      <style>{`
        @keyframes radar-pulse {
          from { background: rgba(56,189,248,0.18); box-shadow: 0 0 4px rgba(56,189,248,0.3); }
          to   { background: rgba(56,189,248,0.45); box-shadow: 0 0 14px rgba(56,189,248,0.8); }
        }
        .slop-token.human-found {
          background: rgba(56,189,248,0.22) !important;
          color: #38bdf8 !important;
          text-decoration: none !important;
          font-weight: 700;
          box-shadow: 0 0 10px rgba(56,189,248,0.4);
          border-radius: 3px;
          cursor: default;
          animation: pop-in 0.25s ease;
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
