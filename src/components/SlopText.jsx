import { useCallback, useRef } from 'react';
import { getRandomCommentary } from '../data/slopData';
import { playSlopDetected, playCombo } from '../utils/audio';

/**
 * Tokenizes text into normal text and slop phrase segments.
 * Returns an array of { text, isSlopPhrase, phraseData, id } tokens.
 */
function tokenize(text, slopPhrases) {
  // Sort by phrase length descending to match longer phrases first
  const sorted = [...slopPhrases].sort((a, b) => b.text.length - a.text.length);
  let segments = [{ text, isSlop: false, phraseData: null }];

  for (const phrase of sorted) {
    const next = [];
    for (const seg of segments) {
      if (seg.isSlop) {
        next.push(seg);
        continue;
      }
      // Find the phrase (case-insensitive search, but preserve original case)
      const idx = seg.text.toLowerCase().indexOf(phrase.text.toLowerCase());
      if (idx === -1) {
        next.push(seg);
        continue;
      }
      // Split into before, match, after
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

export default function SlopText({ round, onScore, onCombo, combo, found, onFoundChange }) {
  const tokens = useRef(null);

  if (!tokens.current) {
    tokens.current = tokenize(round.text, round.slopPhrases);
  }

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
    const score = token.phraseData.score * multiplier;

    playSlopDetected();
    if (newCombo > 1) playCombo(newCombo);

    onScore(score, x, y, commentary);
    onCombo(newCombo);
  }, [found, combo, onScore, onCombo, onFoundChange]);

  return (
    <div style={{
      fontFamily: "'Inter', sans-serif",
      fontSize: '0.95rem',
      lineHeight: '1.9',
      color: '#e2e8f0',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    }}>
      {tokens.current.map(token => {
        if (!token.isSlop) {
          return <span key={token.id}>{token.text}</span>;
        }
        const isFound = found.has(token.id);
        return (
          <span
            key={token.id}
            className={`slop-token ${isFound ? 'found' : 'active'}`}
            onClick={isFound ? undefined : (e) => handleSlopClick(e, token)}
            title={isFound ? undefined : `Click to detect slop! (+${token.phraseData.score} pts)`}
          >
            {token.text}
          </span>
        );
      })}
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
