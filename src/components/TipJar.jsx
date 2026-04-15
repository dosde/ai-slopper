import { useState } from 'react';
import { TIP_TIERS, tip, getTipStats } from '../utils/tipjar';

export default function TipJar({ onClose }) {
  const [status, setStatus] = useState(null); // null | 'pending' | { type, message }
  const [stats, setStats] = useState(() => getTipStats());

  const handleTip = async (tier) => {
    setStatus('pending');
    const result = await tip(tier);
    if (result.status === 'purchased') {
      setStats(getTipStats());
      setStatus({ type: 'success', message: `${tier.emoji} Thank you! You're a legend.` });
    } else if (result.status === 'external') {
      setStatus({ type: 'info', message: '🔗 Opened tip page in your browser' });
    } else {
      setStatus({ type: 'error', message: '⚠️ Tip could not be processed' });
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.75)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '420px',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(236,72,153,0.3)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 80px rgba(236,72,153,0.15)',
          padding: '24px',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div style={{ fontSize: '2.2rem', marginBottom: '6px' }}>💝</div>
          <div
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '1rem',
              color: '#ec4899',
              textShadow: '0 0 15px rgba(236,72,153,0.6)',
              marginBottom: '6px',
            }}
          >
            SUPPORT THE DEV
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.5 }}>
            This game is free and ad-friendly. If you're enjoying it, consider
            throwing a tip — every bit funds more rounds, more music, less slop.
          </div>
        </div>

        {/* Tip tiers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
          {TIP_TIERS.map((t) => (
            <button
              key={t.id}
              onClick={() => handleTip(t)}
              disabled={status === 'pending'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
                borderRadius: '12px',
                border: '2px solid rgba(236,72,153,0.25)',
                background: 'rgba(236,72,153,0.08)',
                color: '#e2e8f0',
                cursor: status === 'pending' ? 'wait' : 'pointer',
                textAlign: 'left',
                opacity: status === 'pending' ? 0.5 : 1,
                transition: 'transform 0.15s, border-color 0.15s',
              }}
              onMouseOver={(e) => {
                if (status !== 'pending') {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.borderColor = '#ec4899';
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(236,72,153,0.25)';
              }}
            >
              <div style={{ fontSize: '1.8rem', flexShrink: 0 }}>{t.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    color: '#fbbf24',
                  }}
                >
                  {t.label}
                </div>
                <div style={{ fontSize: '0.66rem', color: '#94a3b8', marginTop: '2px' }}>
                  {t.tagline}
                </div>
              </div>
              <div
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  color: '#ec4899',
                  flexShrink: 0,
                }}
              >
                {t.amount}
              </div>
            </button>
          ))}
        </div>

        {/* Status message */}
        {status && status !== 'pending' && (
          <div
            style={{
              textAlign: 'center',
              padding: '10px',
              borderRadius: '8px',
              marginBottom: '12px',
              fontSize: '0.75rem',
              background:
                status.type === 'success'
                  ? 'rgba(16,185,129,0.15)'
                  : status.type === 'info'
                  ? 'rgba(124,58,237,0.15)'
                  : 'rgba(239,68,68,0.15)',
              color:
                status.type === 'success'
                  ? '#10b981'
                  : status.type === 'info'
                  ? '#a78bfa'
                  : '#ef4444',
            }}
          >
            {status.message}
          </div>
        )}

        {/* Supporter stats */}
        {stats.count > 0 && (
          <div
            style={{
              textAlign: 'center',
              fontSize: '0.64rem',
              color: '#64748b',
              marginBottom: '12px',
              padding: '8px',
              background: 'rgba(124,58,237,0.06)',
              borderRadius: '8px',
            }}
          >
            🙏 You've tipped <span style={{ color: '#fbbf24', fontWeight: 700 }}>{stats.count}×</span> · lifetime{' '}
            <span style={{ color: '#fbbf24', fontWeight: 700 }}>€{stats.total.toFixed(2)}</span>
          </div>
        )}

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '10px',
            border: '1px solid rgba(148,163,184,0.3)',
            background: 'transparent',
            color: '#94a3b8',
            cursor: 'pointer',
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 700,
            fontSize: '0.72rem',
          }}
        >
          CLOSE
        </button>

        {/* Disclaimer */}
        <div
          style={{
            fontSize: '0.54rem',
            color: '#334155',
            textAlign: 'center',
            marginTop: '10px',
            lineHeight: 1.4,
          }}
        >
          Payments processed via Google Play on Android. On web, a tip page opens externally.
          Tips are not refundable and grant no gameplay advantage.
        </div>
      </div>
    </div>
  );
}
