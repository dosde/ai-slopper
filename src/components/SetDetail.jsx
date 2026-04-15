import { useEffect, useState } from 'react';
import { getSet } from '../utils/communityApi';
import { startTitleMusic, stopTitleMusic } from '../utils/audio';

export default function SetDetail({ seed, onBack, onPlay }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    startTitleMusic();
    return () => stopTitleMusic();
  }, []);

  useEffect(() => {
    let cancelled = false;
    getSet(seed).then(d => { if (!cancelled) setData(d); })
      .catch(e => { if (!cancelled) setError(e.message || 'Load failed'); });
    return () => { cancelled = true; };
  }, [seed]);

  const shareUrl = `${window.location.origin}${window.location.pathname}?seed=${seed}`;
  const handleShare = async () => {
    try {
      if (navigator.share) await navigator.share({ title: data?.set?.title, url: shareUrl });
      else {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true); setTimeout(() => setCopied(false), 2000);
      }
    } catch { /* user cancelled */ }
  };

  if (error) {
    return (
      <div style={{ padding: 24, color: '#e2e8f0', textAlign: 'center' }}>
        <div style={{ color: '#ef4444', marginBottom: 12 }}>⚠ {error}</div>
        <button className="btn-secondary" onClick={onBack}>← Back</button>
      </div>
    );
  }
  if (!data) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>Loading...</div>;
  }

  const { set, rounds, topScores } = data;

  return (
    <div style={{ padding: '16px', flex: 1, overflowY: 'auto', color: '#e2e8f0', position: 'relative', zIndex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <button className="btn-secondary" onClick={onBack} style={{ fontSize: '0.7rem', padding: '6px 10px' }}>← BACK</button>
      </div>

      <div style={{ textAlign: 'center', marginBottom: 14 }}>
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 'clamp(0.9rem, 3.5vw, 1.3rem)',
          color: '#a78bfa',
          textShadow: '0 0 20px #7c3aed',
          marginBottom: 8,
          wordBreak: 'break-word',
        }}>
          {set.title}
        </div>
        <div style={{ fontSize: '0.7rem', color: '#64748b', display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <span>SEED: <span style={{ color: '#a78bfa', fontWeight: 700 }}>{set.seed}</span></span>
          {set.creator_initials && <span>by {set.creator_initials}</span>}
          <span>▶ {set.play_count} plays</span>
          <span>{set.visibility === 'private' ? '🔒 private' : '🌍 public'}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
        <button className="btn-primary" onClick={() => onPlay({ set, rounds })} style={{ fontSize: '0.9rem', padding: '12px 16px' }}>
          🎮 PLAY
        </button>
        <button className="btn-secondary" onClick={handleShare} style={{ fontSize: '0.75rem', padding: '12px 16px' }}>
          {copied ? '✓ COPIED' : '🔗 SHARE'}
        </button>
      </div>

      <div className="card" style={{ padding: '12px 14px', marginBottom: 12 }}>
        <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontFamily: "'Orbitron', sans-serif", marginBottom: 8, letterSpacing: '1px' }}>
          PROMPTS IN THIS SET
        </div>
        <ol style={{ margin: 0, paddingLeft: 20, fontSize: '0.75rem', color: '#cbd5e1' }}>
          {rounds.map((r, i) => (
            <li key={i} style={{ marginBottom: 4 }}>
              {r.prompt} {r.inverse && <span style={{ color: '#10b981' }}>(inverse)</span>} {r.boss && <span style={{ color: '#ef4444' }}>(BOSS)</span>}
            </li>
          ))}
        </ol>
      </div>

      <div className="card" style={{ padding: '12px 14px' }}>
        <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontFamily: "'Orbitron', sans-serif", marginBottom: 8, letterSpacing: '1px' }}>
          TOP 10 SCORES
        </div>
        {topScores.length === 0 ? (
          <div style={{ color: '#64748b', fontSize: '0.75rem' }}>No scores yet — be the first!</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {topScores.map((s, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', padding: '3px 0', borderBottom: i < topScores.length - 1 ? '1px solid rgba(124,58,237,0.1)' : 'none' }}>
                <span><span style={{ color: '#64748b', marginRight: 8 }}>#{i + 1}</span>{s.initials}</span>
                <span style={{ color: '#10b981', fontWeight: 700 }}>{s.score.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
