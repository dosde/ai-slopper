import { useState, useEffect, useCallback } from 'react';

let popupId = 0;

export const usePopups = () => {
  const [popups, setPopups] = useState([]);

  const addPopup = useCallback((x, y, score, commentary) => {
    const id = ++popupId;
    setPopups(prev => [...prev, { id, x, y, score, commentary }]);
    setTimeout(() => {
      setPopups(prev => prev.filter(p => p.id !== id));
    }, 2200);
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
            fontSize: p.score >= 150 ? '1.8rem' : '1.2rem',
          }}
        >
          +{p.score}
        </div>
        {p.commentary && (
          <div
            className="commentary-popup"
            style={{
              left: Math.min(p.x - 60, window.innerWidth - 300),
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
