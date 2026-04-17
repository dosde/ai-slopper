import { useState, useCallback } from 'react';

let popupId = 0;

export const usePopups = () => {
  const [popups, setPopups] = useState([]);

  const addPopup = useCallback((x, y, score, commentary, isDoubled = false, isMiss = false, combo = 1) => {
    const id = ++popupId;
    setPopups(prev => [...prev, { id, x, y, score, commentary, isDoubled, isMiss, combo }]);
    setTimeout(() => {
      setPopups(prev => prev.filter(p => p.id !== id));
    }, isMiss ? 1200 : 2000);
  }, []);

  return { popups, addPopup };
};

export const PopupLayer = ({ popups }) => (
  <>
    {popups.map(p => (
      <div key={p.id}>
        <div
          className="score-popup"
          style={{
            left: p.x,
            top: p.y - 20,
            /* Tiers retuned for post-rebalance score range (30–~6700). Cursed
               glow now kicks in at 400+, jackpot size at 1000+. Previous
               thresholds assumed uncapped rizz math where 2000+ was common. */
            fontSize: p.isMiss
              ? '1.1rem'
              : p.score >= 1000 ? '2.4rem'
              : p.score >= 400 ? '1.95rem'
              : p.score >= 150 ? '1.6rem'
              : p.score >= 60  ? '1.3rem'
              : '1.1rem',
            color: p.isMiss ? '#ef4444' : p.isDoubled ? '#ec4899' : p.score >= 400 ? '#f9a8d4' : '#fbbf24',
            textShadow: p.isMiss
              ? '0 0 8px #ef4444'
              : p.isDoubled ? '0 0 10px #ec4899' : p.score >= 400 ? '0 0 14px #f9a8d4, 0 0 28px rgba(236,72,153,0.5)' : '0 0 10px #fbbf24',
          }}
        >
          {p.isMiss
            ? `−${Math.abs(p.score)}`
            : (
              <>
                {p.isDoubled && <span style={{ fontSize: '0.7em' }}>💥</span>}
                +{p.score}
                {p.combo > 1 && <span style={{ fontSize: '0.65em', opacity: 0.85 }}> x{p.combo}</span>}
                {p.isDoubled && <span style={{ fontSize: '0.7em' }}> 2X!</span>}
              </>
            )
          }
        </div>
        {p.commentary && (
          <div
            className="commentary-popup"
            style={{
              left: Math.max(8, Math.min(p.x - 80, window.innerWidth - 310)),
              top: p.y + 30,
              ...(p.isMiss ? { color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)' } : {}),
            }}
          >
            {p.commentary}
          </div>
        )}
      </div>
    ))}
  </>
);
