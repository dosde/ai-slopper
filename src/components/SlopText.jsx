import React, { useCallback, useRef, useState, useEffect } from 'react';
import { getRandomCommentary } from '../data/slopData';
import { playSlopDetected, playCombo, playMiss } from '../utils/audio';
import { updateSlopDict } from '../utils/storage';

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

/**
 * Splits tokens into text and table segments by detecting markdown pipe-table
 * lines (lines whose first non-space character is '|'). Each token is
 * annotated with its absolute character offset (_s) so table cells can be
 * mapped to token subsets.
 */
function buildSegments(rawText, tokens) {
  // Annotate tokens with absolute start positions
  let pos = 0;
  for (const tok of tokens) {
    tok._s = pos;
    pos += tok.text.length;
  }

  // Parse line ranges
  const lines = [];
  let ls = 0;
  for (let i = 0; i <= rawText.length; i++) {
    if (i === rawText.length || rawText[i] === '\n') {
      lines.push({ start: ls, end: i });
      ls = i + 1;
    }
  }

  const isTableLine = (start, end) => {
    for (let i = start; i < end; i++) {
      const c = rawText[i];
      if (c === ' ' || c === '\t') continue;
      return c === '|';
    }
    return false;
  };

  const isSepLine = (start, end) => /^\|[\s|:\-]+\|?\s*$/.test(rawText.slice(start, end).trim());

  // Group consecutive lines into text vs table blocks
  const groups = [];
  let i = 0;
  while (i < lines.length) {
    if (isTableLine(lines[i].start, lines[i].end)) {
      const g = { isTable: true, lines: [] };
      while (i < lines.length && isTableLine(lines[i].start, lines[i].end)) {
        g.lines.push(lines[i]); i++;
      }
      groups.push(g);
    } else {
      const g = { isTable: false, lines: [] };
      while (i < lines.length && !isTableLine(lines[i].start, lines[i].end)) {
        g.lines.push(lines[i]); i++;
      }
      groups.push(g);
    }
  }

  // Return token indices whose _s falls in [charA, charB)
  const tokensInRange = (charA, charB) => {
    const result = [];
    for (let ti = 0; ti < tokens.length; ti++) {
      const t = tokens[ti];
      if (t._s >= charA && t._s < charB) result.push(ti);
    }
    return result;
  };

  const segments = [];
  for (const group of groups) {
    if (!group.lines.length) continue;
    const charStart = group.lines[0].start;
    const lastLine = group.lines[group.lines.length - 1];
    const charEnd = Math.min(lastLine.end + 1, rawText.length);

    if (!group.isTable) {
      segments.push({ type: 'text', tokenIndices: tokensInRange(charStart, charEnd) });
    } else {
      const rows = [];
      for (const line of group.lines) {
        const lineText = rawText.slice(line.start, line.end);
        const sep = isSepLine(line.start, line.end);
        const pipes = [];
        for (let ci = 0; ci < lineText.length; ci++) {
          if (lineText[ci] === '|') pipes.push(line.start + ci);
        }
        if (pipes.length < 2) { rows.push({ isSeparator: true, cells: [] }); continue; }
        const cells = [];
        for (let pi = 0; pi + 1 < pipes.length; pi++) {
          cells.push(tokensInRange(pipes[pi] + 1, pipes[pi + 1]));
        }
        rows.push({ isSeparator: sep, cells });
      }
      segments.push({ type: 'table', rows });
    }
  }
  return segments;
}

// ── Brainrot corruption engine ───────────────────────────────────────────────

const L33T = { a:'4', e:'3', o:'0', i:'1', s:'$', t:'7', b:'8', g:'9', l:'|', z:'2' };

function corruptToken(text) {
  if (!text || text.length < 2) return text;
  const roll = Math.random();
  const pos = Math.floor(Math.random() * text.length);

  if (roll < 0.30) {
    // l33t substitute — find first eligible character
    for (let i = 0; i < text.length; i++) {
      const c = text[i].toLowerCase();
      if (L33T[c]) {
        return text.slice(0, i) + L33T[c] + text.slice(i + 1);
      }
    }
  }
  if (roll < 0.50 && text.length > 1) {
    // Swap two adjacent characters
    const i = Math.min(pos, text.length - 2);
    return text.slice(0, i) + text[i + 1] + text[i] + text.slice(i + 2);
  }
  if (roll < 0.68) {
    // Duplicate a character
    return text.slice(0, pos) + text[pos] + text[pos] + text.slice(pos + 1);
  }
  if (roll < 0.82 && text.length > 3) {
    // Drop a middle character
    const safe = 1 + Math.floor(Math.random() * (text.length - 2));
    return text.slice(0, safe) + text.slice(safe + 1);
  }
  if (roll < 0.92) {
    // Random caps on one letter
    return text.slice(0, pos) + text[pos].toUpperCase() + text.slice(pos + 1);
  }
  // Insert a random nearby keyboard character
  const noise = 'qwrtypsdfghjklzxcvbnm'.split('');
  const ch = noise[Math.floor(Math.random() * noise.length)];
  return text.slice(0, pos) + ch + text.slice(pos);
}

// ─────────────────────────────────────────────────────────────────────────────

const WORDS_PER_SECOND = 18;

export default function SlopText({
  round, onScore, onCombo, combo,
  found, onFoundChange,
  onWrongClick,
  radarActive = false, doublePoints = false,
  brainrot = false,
  lang = 'en',
  onTypingComplete,
  onCorruptionChange,
}) {
  const tokens = useRef(null);
  const segmentsRef = useRef(null);
  const [revealedCount, setRevealedCount] = useState(0);
  const [wrongIds, setWrongIds] = useState(new Set());
  const [corruptions, setCorruptions] = useState(new Map()); // tokenId → corrupted display text
  const intervalRef = useRef(null);
  const brainrotTimerRef = useRef(null);
  const revealedCountRef = useRef(0);

  // Build tokens once per round
  if (!tokens.current) {
    tokens.current = tokenize(round.text, round.slopPhrases);
    segmentsRef.current = buildSegments(round.text, tokens.current);
  }

  // Typing animation — reveal tokens progressively
  useEffect(() => {
    setRevealedCount(0);
    setWrongIds(new Set());
    setCorruptions(new Map());
    revealedCountRef.current = 0;
    tokens.current = tokenize(round.text, round.slopPhrases);
    segmentsRef.current = buildSegments(round.text, tokens.current);

    const totalTokens = tokens.current.length;
    const totalWords = round.text.split(/\s+/).length;
    const msPerToken = (1000 / WORDS_PER_SECOND) * (totalWords / totalTokens);
    const delay = Math.max(20, Math.min(msPerToken, 80));
    let count = 0;

    intervalRef.current = setInterval(() => {
      count += Math.ceil(totalTokens / (totalWords / 2));
      const next = Math.min(count, totalTokens);
      setRevealedCount(next);
      revealedCountRef.current = next;
      if (count >= totalTokens) {
        clearInterval(intervalRef.current);
        onTypingComplete?.();
      }
    }, delay);

    return () => clearInterval(intervalRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round.id]);

  // Brainrot background corruption timer — randomly corrupts a token every 4-8s
  useEffect(() => {
    if (!brainrot) return;

    const scheduleNext = () => {
      const delay = 4000 + Math.random() * 4000;
      brainrotTimerRef.current = setTimeout(() => {
        const visible = tokens.current.slice(0, revealedCountRef.current);
        const candidates = visible.filter(t => !t.isSpace && t.text.length > 2);
        if (candidates.length > 0) {
          const target = candidates[Math.floor(Math.random() * candidates.length)];
          setCorruptions(prev => {
            const next = new Map(prev);
            const current = next.get(target.id) ?? target.text;
            const corrupted = corruptToken(current);
            next.set(target.id, corrupted);
            onCorruptionChange?.(next.size);
            return next;
          });
        }
        scheduleNext();
      }, delay);
    };

    scheduleNext();
    return () => { if (brainrotTimerRef.current) clearTimeout(brainrotTimerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brainrot]);

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

    const commentary = getRandomCommentary(token.phraseData.type, lang);
    const newCombo = (combo || 0) + 1;
    const multiplier = Math.min(newCombo, 5);
    const baseScore = token.phraseData.score * multiplier;
    const score = doublePoints ? baseScore * 2 : baseScore;

    updateSlopDict(token.phraseData.text, token.phraseData.type);
    playSlopDetected();
    if (newCombo > 1) playCombo(newCombo);
    onScore(score, x, y, commentary, doublePoints, multiplier, token.id);
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

    // Brainrot: corrupt 2-3 random visible tokens on wrong click
    if (brainrot) {
      const visible = tokens.current.slice(0, revealedCountRef.current);
      const candidates = visible.filter(t => !t.isSpace && t.text.length > 2 && t.id !== token.id);
      const count = 2 + Math.floor(Math.random() * 2); // 2 or 3
      const victims = [...candidates].sort(() => Math.random() - 0.5).slice(0, count);
      if (victims.length > 0) {
        setCorruptions(prev => {
          const next = new Map(prev);
          for (const v of victims) {
            const current = next.get(v.id) ?? v.text;
            next.set(v.id, corruptToken(current));
          }
          onCorruptionChange?.(next.size);
          return next;
        });
      }
    }

    playMiss();
    onWrongClick?.(x, y);
  }, [onWrongClick, brainrot]);

  // Render a single token (used for both text and table segments)
  const renderTok = (token, idx) => {
    const isRevealed = idx < revealedCount;

    if (!isRevealed) {
      return <span key={token.id} style={{ opacity: 0 }}>{token.text}</span>;
    }

    const isCorrupted = brainrot && corruptions.has(token.id);
    const displayText = isCorrupted ? corruptions.get(token.id) : token.text;

    if (token.isSlop) {
      const isFound = found.has(token.id);
      const showRadar = radarActive && !isFound;
      const isInverse = !!round.inverse;
      const className = `slop-token${isFound ? (isInverse ? ' human-found' : ' found') : ' active'}`;
      const extraStyle = {
        ...(isCorrupted && !isFound ? { color: '#fb923c', transition: 'color 0.3s' } : {}),
        ...(showRadar ? {
          background: 'rgba(56,189,248,0.3)',
          borderBottom: '2px solid #38bdf8',
          boxShadow: '0 0 8px rgba(56,189,248,0.6)',
          animation: 'radar-pulse 0.5s ease-in-out infinite alternate',
        } : {}),
        ...(!isFound && !showRadar && doublePoints && !isInverse ? {
          borderBottom: `2px solid rgba(251,191,36,0.5)`,
        } : {}),
      };
      if (isFound) {
        return (
          <span key={token.id} className={className} style={{ borderRadius: '4px', padding: '0 1px' }}>
            {displayText}
          </span>
        );
      }
      // Not yet found — split into individual words (indistinguishable from normal text)
      const parts = displayText.split(/(\s+)/);
      return (
        <React.Fragment key={token.id}>
          {parts.map((part, pi) => {
            if (!part) return null;
            if (/^\s+$/.test(part)) return <span key={pi}>{part}</span>;
            return (
              <span
                key={pi}
                className={className}
                onClick={(e) => handleSlopClick(e, token)}
                style={extraStyle}
              >
                {part}
              </span>
            );
          })}
        </React.Fragment>
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
        style={isCorrupted ? { color: '#fb923c', transition: 'color 0.3s' } : undefined}
        onClick={(e) => handleNormalClick(e, token)}
      >
        {displayText}
      </span>
    );
  };

  const segments = segmentsRef.current || [];

  return (
    <div style={{
      fontFamily: "'Inter', sans-serif",
      fontSize: '0.95rem',
      lineHeight: '1.9',
      color: '#e2e8f0',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
      userSelect: 'none',
      WebkitUserSelect: 'none',
    }}>
      {segments.map((seg, si) => {
        if (seg.type === 'text') {
          return (
            <React.Fragment key={si}>
              {seg.tokenIndices.map(idx => renderTok(tokens.current[idx], idx))}
            </React.Fragment>
          );
        }

        // Table segment — render as proper HTML table
        const nonSepRows = seg.rows.filter(r => !r.isSeparator);
        if (!nonSepRows.length) return null;
        const [headerRow, ...dataRows] = nonSepRows;
        return (
          <table key={si} className="slop-table">
            <thead>
              <tr>
                {headerRow.cells.map((tokenIndices, ci) => (
                  <th key={ci}>
                    {tokenIndices.map(idx => renderTok(tokens.current[idx], idx))}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row, ri) => (
                <tr key={ri}>
                  {row.cells.map((tokenIndices, ci) => (
                    <td key={ci}>
                      {tokenIndices.map(idx => renderTok(tokens.current[idx], idx))}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
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
