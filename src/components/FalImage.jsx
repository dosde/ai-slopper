import { useState, useEffect } from 'react';
import { generateSlopImage, isFalConfigured } from '../utils/falClient';

const PLACEHOLDER_BOTS = [
  '🤖', '👾', '🦾', '🧠', '💻', '📡',
];

const BOT_COLORS = [
  'linear-gradient(135deg, #7c3aed, #ec4899)',
  'linear-gradient(135deg, #ec4899, #fbbf24)',
  'linear-gradient(135deg, #10b981, #7c3aed)',
  'linear-gradient(135deg, #fbbf24, #ef4444)',
  'linear-gradient(135deg, #3b82f6, #10b981)',
];

export default function FalImage({ prompt, roundId, size = 200 }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!isFalConfigured()) return;
    setLoading(true);
    setError(false);
    setImageUrl(null);

    generateSlopImage(prompt)
      .then(url => {
        setImageUrl(url);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [prompt, roundId]);

  const botEmoji = PLACEHOLDER_BOTS[(roundId - 1) % PLACEHOLDER_BOTS.length];
  const botColor = BOT_COLORS[(roundId - 1) % BOT_COLORS.length];

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt="AI Slop Monster"
        className="fal-image"
        style={{ width: size, height: size, flexShrink: 0 }}
      />
    );
  }

  return (
    <div style={{
      width: size,
      height: size,
      flexShrink: 0,
      borderRadius: 16,
      background: botColor,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      border: '3px solid rgba(124,58,237,0.5)',
      boxShadow: '0 0 30px rgba(124,58,237,0.3)',
      gap: 8,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated circuit lines */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(255,255,255,0.05) 20px, rgba(255,255,255,0.05) 21px)',
        pointerEvents: 'none',
      }} />
      <div style={{ fontSize: size * 0.35, filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))', animation: loading ? 'spin-slow 2s linear infinite' : 'float 2s ease-in-out infinite', position: 'relative' }}>
        {loading ? '⚙️' : botEmoji}
      </div>
      {loading && (
        <div style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: '0.6rem',
          color: 'rgba(255,255,255,0.8)',
          textAlign: 'center',
          padding: '0 10px',
          position: 'relative',
        }}>
          GENERATING SLOP...
        </div>
      )}

      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
      `}</style>
    </div>
  );
}
