import React from 'react';

// Modal-style overlay that freezes the game while a tutorial tip is visible.
// The parent (App) decides which tip is current and handles dismissal — this
// component is purely presentational.
export default function TutorialOverlay({ tip, onDismiss }) {
  if (!tip) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(2, 6, 23, 0.78)',
        backdropFilter: 'blur(3px)',
        zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
        animation: 'fade-in 0.2s ease',
      }}
    >
      <div
        style={{
          maxWidth: '440px', width: '100%',
          background: 'linear-gradient(160deg, rgba(124,58,237,0.18), rgba(56,189,248,0.10))',
          border: '1px solid rgba(124,58,237,0.55)',
          borderRadius: '12px',
          padding: '20px 22px 18px',
          boxShadow: '0 0 36px rgba(124,58,237,0.35), 0 12px 30px rgba(0,0,0,0.4)',
          animation: 'slide-in-up 0.25s ease',
        }}
      >
        <div style={{
          fontSize: '0.62rem', color: '#c4b5fd',
          fontFamily: "'Orbitron', sans-serif", letterSpacing: '1.5px',
          marginBottom: '10px',
        }}>
          {tip.title}
        </div>
        <div style={{
          fontSize: '0.92rem', color: '#e2e8f0',
          lineHeight: 1.55, marginBottom: '16px',
        }}>
          {tip.text}
        </div>
        <button
          className="btn-primary"
          onClick={onDismiss}
          style={{
            fontSize: '0.85rem',
            padding: '10px 22px',
            display: 'block',
            marginLeft: 'auto',
          }}
          autoFocus
        >
          GOT IT ▶
        </button>
      </div>
    </div>
  );
}
