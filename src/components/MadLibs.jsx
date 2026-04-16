import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { PopupLayer, usePopups } from './ScorePopup';
import { playSlopDetected, playMiss, playRoundComplete, startMusic, stopMusic, stopSummaryMusic } from '../utils/audio';
import { getRandomCommentary } from '../data/slopData';
import { t } from '../i18n/index';

const ROUND_TIME = 60;

/**
 * Mad Libs mode — whole round is fill-in-the-blanks. The round object provides
 * a `template` string with ___N___ markers and a `wordBank` of chips keyed to
 * slot numbers. Tap a word → tap a slot → fills it and scores. All slots
 * filled ends the round.
 *
 * Shaped to mirror GameScreen's header/bottom-bar so the UI feels consistent,
 * but the body is a fundamentally different interaction (no tap-slop).
 */
export default function MadLibs({ round, roundIdx, totalRounds, totalScore, onRoundEnd, lang = 'en', musicEnabled = true, onMechanicHit }) {
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [selectedWordIdx, setSelectedWordIdx] = useState(null); // index into wordBank
  const [filled, setFilled] = useState({}); // slotNum → { wordIdx, score, cursed }
  const [slotFlash, setSlotFlash] = useState(null); // slotNum currently flashing wrong
  const [roundScore, setRoundScore] = useState(0);
  const [timerRunning, setTimerRunning] = useState(true);
  // Drag-and-drop state (desktop). Tap flow still works too — kept as fallback
  // so the round is playable on touch devices where HTML5 drag is flaky.
  const [draggedWordIdx, setDraggedWordIdx] = useState(null);
  const [dragOverSlot, setDragOverSlot] = useState(null);
  const endedRef = useRef(false);
  const { popups, addPopup } = usePopups();

  // Parse template into segments: { type: 'text' | 'slot', text?, slotNum? }
  const segments = useMemo(() => {
    const re = /___(\d+)___/g;
    const out = [];
    let idx = 0;
    let m;
    const tpl = round.template || '';
    while ((m = re.exec(tpl)) !== null) {
      if (m.index > idx) out.push({ type: 'text', text: tpl.slice(idx, m.index) });
      out.push({ type: 'slot', slotNum: parseInt(m[1], 10) });
      idx = m.index + m[0].length;
    }
    if (idx < tpl.length) out.push({ type: 'text', text: tpl.slice(idx) });
    return out;
  }, [round.template]);

  const slotNums = useMemo(
    () => [...new Set(segments.filter(s => s.type === 'slot').map(s => s.slotNum))],
    [segments],
  );
  const totalSlots = slotNums.length;
  const filledCount = Object.keys(filled).length;

  // Used word indices (so the bank can grey out)
  const usedWordIdxs = useMemo(
    () => new Set(Object.values(filled).map(f => f.wordIdx)),
    [filled],
  );

  // Start music
  useEffect(() => {
    stopSummaryMusic();
    if (musicEnabled) startMusic();
    return () => stopMusic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Timer
  useEffect(() => {
    if (!timerRunning) return;
    if (timeLeft <= 0) {
      if (endedRef.current) return;
      endedRef.current = true;
      setTimerRunning(false);
      setTimeout(() => onRoundEnd(roundScore, new Set(Object.keys(filled)), 0, 0, false, {}), 500);
      return;
    }
    const h = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(h);
  }, [timeLeft, timerRunning, roundScore, filled, onRoundEnd]);

  // All slots filled → end round with a beat
  useEffect(() => {
    if (endedRef.current || totalSlots === 0 || filledCount < totalSlots) return;
    endedRef.current = true;
    setTimerRunning(false);
    playRoundComplete();
    const timeBonus = timeLeft * 10;
    const finalScore = roundScore + timeBonus;
    if (timeBonus > 0) {
      addPopup(Math.round(window.innerWidth / 2), 160, timeBonus, `⏱ ${timeLeft}s TIME BONUS!`, false, false);
    }
    const foundSet = new Set(Object.keys(filled));
    setTimeout(() => onRoundEnd(finalScore, foundSet, timeLeft, 0, false, {}), timeBonus > 0 ? 1200 : 400);
  }, [filledCount, totalSlots, roundScore, timeLeft, filled, addPopup, onRoundEnd]);

  const onWordTap = (idx) => {
    if (!timerRunning || usedWordIdxs.has(idx)) return;
    setSelectedWordIdx(prev => (prev === idx ? null : idx));
  };

  // Shared fill logic used by both the tap flow and the drop handler. Returns
  // true if the slot was successfully filled, false if the attempt failed
  // (wrong slot, no word, round ended). Caller supplies the screen x/y used
  // to anchor the score popup — usually the slot element's center.
  const tryFillSlot = useCallback((slotNum, wordIdx, anchorX, anchorY) => {
    if (!timerRunning) return false;
    if (filled[slotNum]) return false;
    const word = round.wordBank?.[wordIdx];
    if (!word) return false;
    if (word.slot !== slotNum) {
      setSlotFlash(slotNum);
      setTimeout(() => setSlotFlash(null), 400);
      playMiss();
      return false;
    }
    const commentary = word.cursed
      ? getRandomCommentary('cursed', lang)
      : getRandomCommentary(word.type || 'filler', lang);
    setFilled(prev => ({ ...prev, [slotNum]: { wordIdx, score: word.score, cursed: word.cursed } }));
    setRoundScore(prev => prev + word.score);
    setSelectedWordIdx(null);
    playSlopDetected();
    addPopup(anchorX, anchorY, word.score, commentary, false, false, 1);
    if (word.cursed) onMechanicHit?.('madlibs_cursed');
    onMechanicHit?.('madlibs_slot');
    return true;
  }, [filled, timerRunning, round.wordBank, addPopup, lang, onMechanicHit]);

  const onSlotTap = useCallback((slotNum, e) => {
    if (!timerRunning) return;
    // If the slot is already filled, tapping clears it (undo)
    if (filled[slotNum]) {
      setRoundScore(prev => prev - filled[slotNum].score);
      setFilled(prev => {
        const next = { ...prev };
        delete next[slotNum];
        return next;
      });
      playMiss();
      return;
    }
    if (selectedWordIdx === null) return;
    const rect = e.currentTarget.getBoundingClientRect();
    tryFillSlot(slotNum, selectedWordIdx, rect.left + rect.width / 2, rect.top);
  }, [filled, selectedWordIdx, timerRunning, tryFillSlot]);

  // ── Drag and drop handlers (desktop). Word chips are HTML5-draggable; slot
  //    spans accept drops. Mobile users get the tap flow instead because HTML5
  //    drag doesn't play well with touch.
  //    The `draggable` attribute on the chip already gates by `!used && timerRunning`
  //    (see render below), so we don't need to call preventDefault here — calling
  //    it when drag isn't actually initiated can confuse some browsers.
  const onWordDragStart = (idx) => (e) => {
    setDraggedWordIdx(idx);
    // setData is a no-op on most Chromium browsers but REQUIRED in Firefox for
    // drag to actually initiate. If it throws, log in dev so we notice.
    try {
      e.dataTransfer.setData('text/plain', String(idx));
    } catch (err) {
      if (typeof console !== 'undefined') console.warn('[MadLibs] setData failed', err);
    }
    e.dataTransfer.effectAllowed = 'move';
  };
  const onWordDragEnd = () => {
    setDraggedWordIdx(null);
    setDragOverSlot(null);
  };
  const onSlotDragOver = (slotNum) => (e) => {
    if (!timerRunning || draggedWordIdx === null || filled[slotNum]) return;
    e.preventDefault(); // required to allow drop
    e.dataTransfer.dropEffect = 'move';
    if (dragOverSlot !== slotNum) setDragOverSlot(slotNum);
  };
  const onSlotDragLeave = (slotNum) => () => {
    if (dragOverSlot === slotNum) setDragOverSlot(null);
  };
  const onSlotDrop = (slotNum) => (e) => {
    e.preventDefault();
    setDragOverSlot(null);
    const wordIdx = draggedWordIdx;
    setDraggedWordIdx(null);
    if (wordIdx === null) return;
    // If the slot filled mid-drag (very rare, but possible via timer fill
    // or external re-render), show the red "wrong slot" flash instead of a
    // silent no-op so the player knows their drop was rejected.
    if (filled[slotNum]) {
      setSlotFlash(slotNum);
      setTimeout(() => setSlotFlash(null), 400);
      playMiss();
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    tryFillSlot(slotNum, wordIdx, rect.left + rect.width / 2, rect.top);
  };

  // If the timer runs out while a word is mid-drag (or any other cross-state
  // freeze), clear drag UI so we don't leave a 40%-opacity chip stuck on screen.
  useEffect(() => {
    if (!timerRunning && (draggedWordIdx !== null || dragOverSlot !== null)) {
      setDraggedWordIdx(null);
      setDragOverSlot(null);
    }
  }, [timerRunning, draggedWordIdx, dragOverSlot]);

  const urgent = timeLeft <= 15;
  const pct = (timeLeft / ROUND_TIME) * 100;
  const timerColor = pct < 25 ? '#ef4444' : pct < 50 ? '#fbbf24' : '#10b981';

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      position: 'relative', zIndex: 1, overflow: 'hidden',
      background: urgent ? 'rgba(239,68,68,0.06)' : 'transparent',
      transition: 'background 0.5s',
    }}>
      <PopupLayer popups={popups} />

      {/* Header — same visual grammar as GameScreen */}
      <div className="safe-top" style={{
        padding: '10px 14px 8px', display: 'flex', flexDirection: 'column', gap: '6px',
        borderBottom: '1px solid rgba(168,85,247,0.3)',
        background: 'rgba(15,15,26,0.97)', backdropFilter: 'blur(10px)', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.6rem', color: '#64748b', fontFamily: "'Orbitron', sans-serif" }}>
              {t('round', lang)} {roundIdx + 1}/{totalRounds}
              <span style={{ color: '#a855f7', marginLeft: 6 }}>📝 MAD LIBS</span>
            </div>
            <div style={{
              fontFamily: "'Orbitron', sans-serif", fontSize: '0.78rem', fontWeight: 700,
              color: '#e2e8f0',
            }}>
              {round.emoji} {round.title}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.55rem', color: '#64748b', fontFamily: "'Orbitron', sans-serif" }}>{t('total', lang)}</div>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 900, fontSize: '0.95rem', color: '#fbbf24', textShadow: '0 0 8px #fbbf24' }}>
              {(totalScore + roundScore).toLocaleString()}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="timer-bar-track">
            <div className="timer-bar-fill" style={{ width: `${pct}%`, background: timerColor, boxShadow: `0 0 8px ${timerColor}` }} />
          </div>
          <div style={{
            fontFamily: "'Press Start 2P', monospace", fontSize: '0.7rem',
            color: urgent ? '#ef4444' : '#94a3b8', minWidth: '24px', textAlign: 'right',
            textShadow: urgent ? '0 0 8px #ef4444' : 'none',
          }}>{timeLeft}</div>
        </div>
        <div style={{ fontSize: '0.6rem', color: '#a855f7', fontFamily: "'Orbitron', sans-serif" }}>
          SLOTS {filledCount}/{totalSlots}
        </div>
      </div>

      {/* Context strip */}
      <div style={{
        background: 'rgba(168,85,247,0.08)',
        borderBottom: '1px solid rgba(168,85,247,0.25)',
        padding: '6px 14px', fontSize: '0.72rem', color: '#c4b5fd', fontStyle: 'italic', flexShrink: 0,
      }}>
        📝 {round.context || 'Fill in the blanks — pick the worst slop you can!'}
      </div>

      {/* Body — template + word bank */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px', WebkitOverflowScrolling: 'touch' }}>
        <div style={{
          fontFamily: "'Inter', sans-serif", fontSize: '1rem', lineHeight: '2',
          color: '#e2e8f0', marginBottom: '16px', padding: '12px 14px',
          background: 'rgba(26,26,46,0.6)', borderRadius: '12px',
          border: '1px solid rgba(168,85,247,0.25)',
        }}>
          {segments.map((seg, i) => {
            if (seg.type === 'text') return <span key={i} style={{ whiteSpace: 'pre-wrap' }}>{seg.text}</span>;
            const fill = filled[seg.slotNum];
            const flash = slotFlash === seg.slotNum;
            const isDragOver = dragOverSlot === seg.slotNum && !fill;
            // When the player has a word selected / is dragging, every empty
            // slot gets the same "you can drop here" dashed border — we
            // intentionally do NOT reveal which slot is correct for the word.
            // (The old code highlighted only the matching slot, which trivialised
            // the puzzle: you just clicked whichever slot lit up.)
            const hasPending = selectedWordIdx !== null || draggedWordIdx !== null;
            const isOpenTarget = !fill && hasPending && !isDragOver;
            const word = fill ? round.wordBank[fill.wordIdx] : null;
            return (
              <span
                key={i}
                onClick={(e) => onSlotTap(seg.slotNum, e)}
                onDragOver={onSlotDragOver(seg.slotNum)}
                onDragLeave={onSlotDragLeave(seg.slotNum)}
                onDrop={onSlotDrop(seg.slotNum)}
                style={{
                  display: 'inline-block',
                  minWidth: '80px',
                  padding: '2px 10px',
                  margin: '0 3px',
                  borderRadius: '6px',
                  cursor: timerRunning ? 'pointer' : 'default',
                  background: fill
                    ? (fill.cursed ? 'linear-gradient(135deg, rgba(236,72,153,0.35), rgba(168,85,247,0.35))' : 'rgba(251,191,36,0.2)')
                    : isDragOver ? 'rgba(168,85,247,0.55)'
                    : (flash ? 'rgba(239,68,68,0.35)' : 'rgba(168,85,247,0.15)'),
                  border: flash
                    ? '2px solid #ef4444'
                    : isDragOver ? '2px solid #fff'
                    : (isOpenTarget ? '2px dashed rgba(168,85,247,0.7)' : `2px dashed ${fill ? 'transparent' : 'rgba(168,85,247,0.4)'}`),
                  color: fill ? (fill.cursed ? '#f9a8d4' : '#fbbf24') : isDragOver ? '#fff' : '#c4b5fd',
                  fontWeight: fill ? 700 : 400,
                  textAlign: 'center',
                  transition: 'all 0.2s',
                  transform: isDragOver ? 'scale(1.08)' : 'scale(1)',
                  boxShadow: isDragOver ? '0 0 16px rgba(168,85,247,0.8)' : 'none',
                  animation: flash ? 'slot-shake 0.4s ease' : 'none',
                }}
              >
                {fill ? word.text : `\u00A0·\u00A0${seg.slotNum}\u00A0·\u00A0`}
              </span>
            );
          })}
        </div>

        <div style={{
          fontSize: '0.65rem', color: '#64748b', fontFamily: "'Orbitron', sans-serif",
          marginBottom: '8px', letterSpacing: '1px',
        }}>
          WORD BANK — TAP OR DRAG ONTO A SLOT
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {(round.wordBank || []).map((w, i) => {
            const used = usedWordIdxs.has(i);
            const selected = selectedWordIdx === i;
            const isDragging = draggedWordIdx === i;
            return (
              <button
                key={i}
                disabled={used || !timerRunning}
                draggable={!used && timerRunning}
                onDragStart={onWordDragStart(i)}
                onDragEnd={onWordDragEnd}
                onClick={() => onWordTap(i)}
                style={{
                  padding: '6px 12px', borderRadius: '10px',
                  fontFamily: "'Inter', sans-serif", fontWeight: 600,
                  cursor: used ? 'default' : (isDragging ? 'grabbing' : 'grab'),
                  background: used
                    ? 'rgba(51,65,85,0.35)'
                    : selected
                      ? 'linear-gradient(135deg, #a855f7, #7c3aed)'
                      : w.cursed
                        ? 'linear-gradient(135deg, rgba(236,72,153,0.25), rgba(168,85,247,0.25))'
                        : 'rgba(30,41,59,0.85)',
                  color: used ? '#475569' : selected ? '#fff' : w.cursed ? '#f9a8d4' : '#e2e8f0',
                  border: selected ? '2px solid #fff' : `1px solid ${w.cursed ? 'rgba(236,72,153,0.5)' : 'rgba(124,58,237,0.35)'}`,
                  boxShadow: selected ? '0 0 12px rgba(168,85,247,0.6)' : 'none',
                  textDecoration: used ? 'line-through' : 'none',
                  opacity: used ? 0.5 : (isDragging ? 0.4 : 1),
                  transform: isDragging ? 'scale(0.95)' : 'scale(1)',
                  transition: 'all 0.15s',
                  fontSize: '0.82rem',
                  userSelect: 'none',
                }}
              >
                <span style={{ fontSize: '0.55rem', opacity: 0.7, marginRight: 4, fontFamily: "'Orbitron',sans-serif" }}>
                  #{w.slot}
                </span>
                {w.text}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="safe-bottom" style={{
        padding: '8px 14px', borderTop: '1px solid rgba(168,85,247,0.3)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'rgba(15,15,26,0.97)', flexShrink: 0,
      }}>
        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
          Round: <span style={{ color: '#e2e8f0', fontWeight: 700 }}>{roundScore.toLocaleString()}</span>
          {timeLeft > 0 && <span style={{ color: '#475569', marginLeft: 6, fontSize: '0.62rem' }}>+{timeLeft * 10} bonus</span>}
        </div>
        <button
          className="btn-secondary"
          onClick={() => {
            if (endedRef.current) return;
            endedRef.current = true;
            setTimerRunning(false);
            const foundSet = new Set(Object.keys(filled));
            setTimeout(() => onRoundEnd(roundScore, foundSet, timeLeft, 0, false, {}), 300);
          }}
          style={{ padding: '7px 14px', fontSize: '0.72rem' }}
        >
          {t('done', lang)} ⏱→
        </button>
      </div>

      <style>{`
        @keyframes slot-shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-4px)} 75%{transform:translateX(4px)} }
        @keyframes slot-beckon { 0%,100%{box-shadow:0 0 0 rgba(168,85,247,0)} 50%{box-shadow:0 0 12px rgba(168,85,247,0.6)} }
      `}</style>
    </div>
  );
}
