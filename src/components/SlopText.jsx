import React, { useCallback, useRef, useState, useEffect } from 'react';
import { getRandomCommentary } from '../data/slopData';
import { playSlopDetected, playCombo, playMiss } from '../utils/audio';
import { updateSlopDict, submitGlobalPhrase } from '../utils/storage';

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
  onMechanicHit,
}) {
  const tokens = useRef(null);
  const segmentsRef = useRef(null);
  const [revealedCount, setRevealedCount] = useState(0);
  const [wrongIds, setWrongIds] = useState(new Set());
  const [corruptions, setCorruptions] = useState(new Map()); // tokenId → current display text
  const [autocorrectPhases, setAutocorrectPhases] = useState(new Map()); // tokenId → phase index
  const [justMorphed, setJustMorphed] = useState(new Set()); // tokens that just shifted — for the Double Agent flash
  const intervalRef = useRef(null);
  const brainrotTimerRef = useRef(null);
  const revealedCountRef = useRef(0);
  const morphTimersRef = useRef(new Map()); // tokenId → timeout handle for Double Agent morph
  const morphFlashTimersRef = useRef(new Set()); // outstanding clear-flash timeouts, so we can cancel on unmount
  const foundRef = useRef(null);
  foundRef.current = found;

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
    setAutocorrectPhases(new Map());
    setJustMorphed(new Set());
    revealedCountRef.current = 0;
    // Clear any pending Double Agent morph timers + flash timers from the
    // previous round so they don't trigger state updates after this effect
    // has already reset the round.
    morphTimersRef.current.forEach(t => clearTimeout(t));
    morphTimersRef.current.clear();
    morphFlashTimersRef.current.forEach(t => clearTimeout(t));
    morphFlashTimersRef.current.clear();
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
        // Double Agent: schedule each morph phrase to auto-swap if the player doesn't
        // click it in time. Works on desktop + mobile since there's no hover required.
        const morphTokens = tokens.current.filter(t => t.phraseData?.morph);
        morphTokens.forEach(token => {
          const after = token.phraseData.morphAfter || 2500;
          const handle = setTimeout(() => {
            let didMorph = false;
            setCorruptions(prev => {
              if (prev.has(token.id)) return prev; // already morphed or autocorrected
              if (foundRef.current?.has(token.id)) return prev; // already caught
              const next = new Map(prev);
              next.set(token.id, token.phraseData.morph);
              didMorph = true;
              return next;
            });
            morphTimersRef.current.delete(token.id);
            // Visual hint so the player notices the phrase shifted —
            // brief pulse that auto-clears in 900ms. We track the clear-timer
            // handle so the reset/unmount cleanup below can cancel it and
            // avoid a "set state on unmounted component" leak when the round
            // changes while a flash is still fading.
            if (didMorph) {
              setJustMorphed(prev => new Set(prev).add(token.id));
              const clearH = setTimeout(() => {
                setJustMorphed(prev => {
                  const n = new Set(prev);
                  n.delete(token.id);
                  return n;
                });
                morphFlashTimersRef.current.delete(clearH);
              }, 900);
              morphFlashTimersRef.current.add(clearH);
            }
          }, after);
          morphTimersRef.current.set(token.id, handle);
        });
      }
    }, delay);

    return () => {
      clearInterval(intervalRef.current);
      morphTimersRef.current.forEach(t => clearTimeout(t));
      morphTimersRef.current.clear();
      // Cancel any pending morph-flash clear timers so they don't call
      // setJustMorphed on an unmounted/next-round component.
      morphFlashTimersRef.current.forEach(t => clearTimeout(t));
      morphFlashTimersRef.current.clear();
    };
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

    // In inverse rounds, AI-type phrases are decoys — clicking them is a wrong click.
    // Only 'human' type phrases are the correct targets.
    if (round.inverse && token.phraseData?.type !== 'human') {
      setWrongIds(prev => new Set([...prev, token.id]));
      setTimeout(() => {
        setWrongIds(prev => { const n = new Set(prev); n.delete(token.id); return n; });
      }, 500);
      playMiss();
      onWrongClick?.(x, y, token.text);
      return;
    }

    const pd = token.phraseData;

    // Cancel any pending Double Agent morph for this token — the player caught it.
    const pendingMorph = morphTimersRef.current.get(token.id);
    if (pendingMorph) {
      clearTimeout(pendingMorph);
      morphTimersRef.current.delete(token.id);
    }

    // ── Mechanic: Slop Autocorrect ──────────────────────────────────────────
    // Phrase has `autocorrect: [v2, v3, ...]`. Each click mutates text to the
    // next worse version. Only the FINAL click marks it found.
    if (pd.autocorrect && Array.isArray(pd.autocorrect) && pd.autocorrect.length > 0) {
      const currentPhase = autocorrectPhases.get(token.id) ?? 0;
      const nextPhase = currentPhase + 1;
      const nextText = pd.autocorrect[currentPhase];
      const scoreArr = Array.isArray(pd.score) ? pd.score : [pd.score];
      const stepScore = scoreArr[currentPhase] ?? (scoreArr[scoreArr.length - 1] ?? 80);
      const isFinal = nextPhase >= pd.autocorrect.length;

      setCorruptions(prev => {
        const next = new Map(prev);
        next.set(token.id, nextText);
        return next;
      });
      setAutocorrectPhases(prev => {
        const next = new Map(prev);
        next.set(token.id, nextPhase);
        return next;
      });

      const commentary = isFinal
        ? 'TERMINAL SLOP! ☠️'
        : currentPhase === 0 ? 'IT GOT WORSE! 🤢' : 'EVEN WORSE! 🤮';

      const newCombo = (combo || 0) + 1;
      const multiplier = Math.min(newCombo, 5);
      const baseScore = stepScore * multiplier;
      const score = doublePoints ? baseScore * 2 : baseScore;

      playSlopDetected();
      if (newCombo > 1) playCombo(newCombo);
      onScore(score, x, y, commentary, doublePoints, multiplier, token.id);
      onCombo(newCombo);

      if (isFinal) {
        const newFound = new Set(found);
        newFound.add(token.id);
        onFoundChange(newFound);
        updateSlopDict(pd.text, pd.type);
        submitGlobalPhrase(pd.text, pd.type);
        onMechanicHit?.('autocorrect_lock');
      }
      return;
    }

    // ── Mechanic: Rizz Detector + Double Agent modifiers ────────────────────
    let scoreMultiplier = 1;
    let forcedCommentary = null;

    if (pd.rizz) {
      scoreMultiplier *= 10;
      forcedCommentary = getRandomCommentary('cursed', lang);
      onMechanicHit?.('rizz');
    }

    // Double Agent: if the phrase hasn't morphed yet (player caught it fast).
    // Bumped default fast-bonus from 1.5× to 2× so the "caught it!" moment feels
    // meaningfully more rewarding than just tapping a normal phrase.
    const caughtBeforeMorph = pd.morph && !corruptions.has(token.id);
    if (caughtBeforeMorph) {
      scoreMultiplier *= (pd.fastBonus ?? 2.0);
      if (!forcedCommentary) forcedCommentary = '⚡ CAUGHT IT FAST!';
      onMechanicHit?.('morph_fast');
    }

    const newFound = new Set(found);
    newFound.add(token.id);
    onFoundChange(newFound);

    const commentary = forcedCommentary || getRandomCommentary(pd.type, lang);
    const newCombo = (combo || 0) + 1;
    const multiplier = Math.min(newCombo, 5);
    const baseScore = pd.score * multiplier * scoreMultiplier;
    const score = Math.round(doublePoints ? baseScore * 2 : baseScore);

    updateSlopDict(pd.text, pd.type);
    submitGlobalPhrase(pd.text, pd.type);
    playSlopDetected();
    if (newCombo > 1) playCombo(newCombo);
    onScore(score, x, y, commentary, doublePoints, multiplier, token.id);
    onCombo(newCombo);
  }, [found, combo, onScore, onCombo, onFoundChange, onWrongClick, doublePoints, round.inverse, lang, autocorrectPhases, corruptions, onMechanicHit]);

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
    onWrongClick?.(x, y, token.text);
  }, [onWrongClick, brainrot]);

  // Render a single token (used for both text and table segments)
  const renderTok = (token, idx) => {
    const isRevealed = idx < revealedCount;

    if (!isRevealed) {
      return <span key={token.id} style={{ opacity: 0 }}>{token.text}</span>;
    }

    // Corruptions now serve three purposes: brainrot text-decay, Double Agent
    // morph swaps, and Autocorrect phase progression. Only brainrot wants the
    // orange "decaying" tint — the other two should blend seamlessly.
    const hasCorruption = corruptions.has(token.id);
    const displayText = hasCorruption ? corruptions.get(token.id) : token.text;
    const isBrainrotCorrupted = brainrot && hasCorruption;

    if (token.isSlop) {
      const isFound = found.has(token.id);
      const showRadar = radarActive && !isFound;
      const isInverse = !!round.inverse;
      const isRizz = token.phraseData?.rizz && !isFound;
      const isFlashing = justMorphed.has(token.id) && !isFound;
      const className = `slop-token${isFound ? (isInverse ? ' human-found' : ' found') : ' active'}${isRizz ? ' rizz-hint' : ''}${isFlashing ? ' morph-flash' : ''}`;
      const extraStyle = {
        ...(isBrainrotCorrupted && !isFound ? { color: '#fb923c', transition: 'color 0.3s' } : {}),
        ...(showRadar ? {
          background: 'rgba(56,189,248,0.3)',
          borderBottom: '2px solid #38bdf8',
          boxShadow: '0 0 8px rgba(56,189,248,0.6)',
          animation: 'radar-pulse 0.5s ease-in-out infinite alternate',
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
        style={isBrainrotCorrupted ? { color: '#fb923c', transition: 'color 0.3s' } : undefined}
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
        /* Rizz Detector: subtle pink shimmer hints that something unhinged
           is hiding in this phrase. Easy to miss if you're not looking. */
        @keyframes rizz-shimmer {
          0%, 100% { text-shadow: none; }
          50% { text-shadow: 0 0 4px rgba(236,72,153,0.45), 0 0 10px rgba(236,72,153,0.18); }
        }
        .rizz-hint {
          animation: rizz-shimmer 3.2s ease-in-out infinite;
        }
        /* Double Agent: brief cyan pulse when a phrase morphs so the player
           actually notices the swap instead of it happening silently. */
        @keyframes morph-flash-anim {
          0% { background: rgba(56,189,248,0.45); box-shadow: 0 0 14px rgba(56,189,248,0.6); }
          60% { background: rgba(56,189,248,0.15); box-shadow: 0 0 6px rgba(56,189,248,0.25); }
          100% { background: transparent; box-shadow: none; }
        }
        .morph-flash {
          animation: morph-flash-anim 0.9s ease-out;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
}

export function getSlopStats(round, found) {
  // Mad Libs rounds use `template` instead of `text` and have no tokenizable
  // slop phrases. Return empty stats so callers (RoundSummary) don't crash.
  if (!round?.text || round.madlibs) {
    const slotCount = Array.isArray(round?.wordBank)
      ? new Set(round.wordBank.map(w => w.slot)).size
      : 0;
    return { total: slotCount, found: found?.size ?? 0, missed: Math.max(0, slotCount - (found?.size ?? 0)), tokens: [] };
  }
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
