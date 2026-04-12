import { useState, useCallback } from 'react';

let popupId = 0;

export const usePopups = () => {
  const [popups, setPopups] = useState([]);

  const addPopup = useCallback((x, y, score, commentary, isDoubled = false) => {
    const id = ++popupId;
    setPopups(prev => [...prev, { id, x, y, score, commentary, isDoubled }]);
    setTimeout(() => {
      setPopups(prev => prev.filter(p => p.id !== id));
    }, 2400);
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
            fontSize: p.score >= 300 ? '2rem' : p.score >= 150 ? '1.6rem' : '1.2rem',
            color: p.isDoubled ? '#ec4899' : '#fbbf24',
            textShadow: p.isDoubled ? '0 0 10px #ec4899' : '0 0 10px #fbbf24',
          }}
        >
          {p.isDoubled && <span style={{ fontSize: '0.7em' }}>💥</span>}
          +{p.score}
          {p.isDoubled && <span style={{ fontSize: '0.7em' }}> 2X!</span>}
        </div>
        {p.commentary && (
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
