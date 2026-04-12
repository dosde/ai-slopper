import { useState, useEffect } from 'react';

let toastQueue = [];
let setToastsExternal = null;

export const showAchievement = (achievement) => {
  if (setToastsExternal) {
    setToastsExternal(prev => [...prev, { ...achievement, key: Date.now() + Math.random() }]);
  }
};

export default function AchievementToastLayer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    setToastsExternal = setToasts;
    return () => { setToastsExternal = null; };
  }, []);

  const removeToast = (key) => setToasts(prev => prev.filter(t => t.key !== key));

  return (
    <div style={{
      position: 'fixed',
      top: 60,
      right: 12,
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      pointerEvents: 'none',
      maxWidth: 280,
    }}>
      {toasts.map(t => (
        <AchievementToast key={t.key} achievement={t} onDone={() => removeToast(t.key)} />
      ))}
    </div>
  );
}

function AchievementToast({ achievement, onDone }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Animate in
    const showTimer = setTimeout(() => setVisible(true), 50);
    // Animate out
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 400);
    }, 3500);
    return () => { clearTimeout(showTimer); clearTimeout(hideTimer); };
  }, [onDone]);

  return (
    <div style={{
      background: 'rgba(15,15,26,0.97)',
      border: '2px solid #fbbf24',
      borderRadius: '14px',
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      boxShadow: '0 0 20px rgba(251,191,36,0.3)',
      transform: visible ? 'translateX(0) scale(1)' : 'translateX(100px) scale(0.8)',
      opacity: visible ? 1 : 0,
      transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s',
      pointerEvents: 'auto',
    }}>
      <div style={{ fontSize: '2rem', flexShrink: 0 }}>{achievement.emoji}</div>
      <div>
        <div style={{
          fontSize: '0.55rem',
          color: '#fbbf24',
          fontFamily: "'Orbitron', sans-serif",
          letterSpacing: '1px',
          marginBottom: '2px',
        }}>
          ACHIEVEMENT UNLOCKED!
        </div>
        <div style={{
          fontFamily: "'Orbitron', sans-serif",
          fontWeight: 700,
          fontSize: '0.72rem',
          color: '#f8fafc',
        }}>
          {achievement.name}
        </div>
        <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '2px' }}>
          {achievement.desc}
        </div>
      </div>
    </div>
  );
}
