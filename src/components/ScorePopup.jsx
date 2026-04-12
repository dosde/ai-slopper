import { useState, useCallback } from 'react';

let popupId = 0;

export const usePopups = () => {
  const [popups, setPopups] = useState([]);

  const addPopup = useCallback((x, y, score, commentary, isDoubled = false, isMiss = false) => {
    const id = ++popupId;
    setPopups(prev => [...prev, { id, x, y, score, commentary, isDoubled, isMiss }]);
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
            fontSize: p.isMiss ? '1.1rem' : p.score >= 300 ? '2rem' : p.score >= 150 ? '1.6rem' : '1.2rem',
            color: p.isMiss ? '#ef4444' : p.isDoubled ? '#ec4899' : '#fbbf24',
            textShadow: p.isMiss
              ? '0 0 8px #ef4444'
              : p.isDoubled ? '0 0 10px #ec4899' : '0 0 10px #fbbf24',
          }}
        >
          {p.isMiss
            ? `−${Math.abs(p.score)}`
            : (
              <>
                {p.isDoubled && <span style={{ fontSize: '0.7em' }}>💥</span>}
                +{p.score}
                {p.isDoubled && <span style={{ fontSize: '0.7em' }}> 2X!</span>}
              </>
            )
          }
        </div>
        {p.commentary && !p.isMiss && (
          <div
            className="commentary-popup"
            style={{
              left: Math.max(8, Math.min(p.x - 80, window.innerWidth - 310)),
              top: p.y + 30,
            }}
          >
            {p.commentary}
          </div>
        )}
      </div>
    ))}
  </>
);
