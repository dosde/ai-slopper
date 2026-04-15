import { useEffect, useState } from 'react';
import { listSets, normaliseSeed, communityEnabled } from '../utils/communityApi';
import { startTitleMusic, stopTitleMusic } from '../utils/audio';

const cardStyle = {
  padding: '12px 14px',
  background: 'rgba(15,23,42,0.7)',
  border: '1px solid rgba(124,58,237,0.35)',
  borderRadius: '12px',
  cursor: 'pointer',
  transition: 'all 0.15s',
};

export default function CommunityMenu({ lang, onBack, onOpenCreate, onOpenSet }) {
  const [sort, setSort] = useState('popular');
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seedInput, setSeedInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    startTitleMusic();
    return () => stopTitleMusic();
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    listSets({ sort, lang }).then(res => {
      if (!cancelled) { setSets(res.sets || []); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [sort, lang]);

  const handleSeedGo = () => {
    const seed = normaliseSeed(seedInput);
    if (!/^[0-9A-Z]{4}-[0-9A-Z]{4}$/.test(seed)) {
      setError('Enter an 8-character code (e.g. HTX9-K4Q2)');
      return;
    }
    setError('');
    onOpenSet(seed);
  };

  if (!communityEnabled()) {
    return (
      <div style={{ padding: 24, color: '#e2e8f0', textAlign: 'center' }}>
        <p>Community sets require Supabase configuration (VITE_SUBMIT_URL).</p>
        <button className="btn-secondary" onClick={onBack}>← Back</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '16px', flex: 1, overflowY: 'auto', color: '#e2e8f0', position: 'relative', zIndex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <button className="btn-secondary" onClick={onBack} style={{ fontSize: '0.7rem', padding: '6px 10px' }}>← BACK</button>
        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.95rem', color: '#a78bfa', textShadow: '0 0 20px #7c3aed' }}>
          COMMUNITY SETS
        </div>
      </div>

      {/* Create + enter-seed row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        <button
          className="btn-primary"
          onClick={onOpenCreate}
          style={{ fontSize: '0.75rem', padding: '12px 10px' }}
        >
          ➕ CREATE SET
        </button>
        <div style={{ display: 'flex', gap: 6 }}>
          <input
            type="text"
            placeholder="SEED CODE"
            value={seedInput}
            onChange={e => setSeedInput(e.target.value.toUpperCase())}
            maxLength={9}
            style={{
              flex: 1, minWidth: 0,
              padding: '8px 10px',
              borderRadius: 10,
              border: '1px solid rgba(124,58,237,0.4)',
              background: 'rgba(15,23,42,0.6)',
              color: '#e2e8f0',
              fontFamily: "'Orbitron', sans-serif",
              fontSize: '0.8rem',
              letterSpacing: '2px',
              textAlign: 'center',
            }}
          />
          <button className="btn-secondary" onClick={handleSeedGo} style={{ fontSize: '0.7rem', padding: '8px 12px' }}>GO</button>
        </div>
      </div>
      {error && <div style={{ color: '#ef4444', fontSize: '0.7rem', marginBottom: 10 }}>{error}</div>}

      {/* Sort tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        {[['popular','🔥 POPULAR'], ['recent','🆕 RECENT']].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setSort(id)}
            className="btn-secondary"
            style={{
              fontSize: '0.65rem', padding: '6px 10px',
              background: sort === id ? 'rgba(124,58,237,0.3)' : 'transparent',
              color: sort === id ? '#a78bfa' : '#94a3b8',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading && <div style={{ textAlign: 'center', padding: 30, color: '#64748b' }}>Loading...</div>}
      {!loading && sets.length === 0 && (
        <div style={{ textAlign: 'center', padding: 30, color: '#64748b', fontSize: '0.8rem' }}>
          No public sets yet — be the first!
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sets.map(s => (
          <div
            key={s.id}
            onClick={() => onOpenSet(s.seed)}
            style={cardStyle}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10 }}>
              <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, color: '#e2e8f0', fontSize: '0.85rem', wordBreak: 'break-word' }}>
                {s.title}
              </div>
              <div style={{ color: '#10b981', fontSize: '0.7rem', whiteSpace: 'nowrap' }}>
                ▶ {s.play_count}
              </div>
            </div>
            <div style={{ marginTop: 4, display: 'flex', gap: 10, color: '#64748b', fontSize: '0.65rem' }}>
              <span>{s.seed}</span>
              {s.creator_initials && <span>by {s.creator_initials}</span>}
              <span style={{ textTransform: 'uppercase' }}>{s.lang}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
