import { useEffect, useState } from 'react';
import { generateSet } from '../utils/communityApi';
import { startTitleMusic, stopTitleMusic } from '../utils/audio';

const EXAMPLE_PROMPTS = [
  'How do I boil an egg?',
  "What's the meaning of life?",
  'Write a haiku about Mondays',
  'Should I buy Bitcoin?',
  'Is pineapple pizza acceptable?',
  'How do I tell my cat I love him?',
];

const inputStyle = {
  width: '100%',
  padding: '8px 10px',
  borderRadius: 8,
  border: '1px solid rgba(124,58,237,0.35)',
  background: 'rgba(15,23,42,0.6)',
  color: '#e2e8f0',
  fontSize: '0.82rem',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
};

export default function CreateSet({ lang, onBack, onCreated }) {
  const [prompts, setPrompts] = useState(['', '', '', '', '', '']);
  const [title, setTitle] = useState('');
  const [initials, setInitials] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    startTitleMusic();
    return () => stopTitleMusic();
  }, []);

  const updatePrompt = (i, v) => {
    setPrompts(prev => prev.map((p, idx) => (idx === i ? v : p)));
  };
  const useExamples = () => setPrompts([...EXAMPLE_PROMPTS]);

  const canSubmit = prompts.every(p => p.trim().length >= 2) && !submitting;

  const handleSubmit = async () => {
    setError('');
    setSubmitting(true);
    try {
      const cleanInitials = initials.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6) || null;
      const res = await generateSet({
        prompts: prompts.map(p => p.trim()),
        title: title.trim() || undefined,
        initials: cleanInitials,
        lang,
        visibility,
      });
      onCreated(res.seed);
    } catch (e) {
      setError(e.message || 'Generation failed');
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '16px', flex: 1, overflowY: 'auto', color: '#e2e8f0', position: 'relative', zIndex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <button className="btn-secondary" onClick={onBack} disabled={submitting} style={{ fontSize: '0.7rem', padding: '6px 10px' }}>← BACK</button>
        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.9rem', color: '#a78bfa', textShadow: '0 0 20px #7c3aed' }}>
          CREATE SET
        </div>
      </div>

      {submitting ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: '1.3rem', marginBottom: 10 }}>🤖</div>
          <div style={{ fontFamily: "'Orbitron', sans-serif", color: '#a78bfa', fontSize: '0.85rem', marginBottom: 6 }}>
            GENERATING SLOP...
          </div>
          <div style={{ color: '#64748b', fontSize: '0.7rem' }}>
            Asking the AI to produce maximum-cringe responses to your prompts. This takes ~15s.
          </div>
        </div>
      ) : (
        <>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: 12 }}>
            Write 6 prompts to ask the AI. We'll generate 4 normal rounds, 1 inverse round, and a boss round from them. Difficulty is locked to NORMAL.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
            {prompts.map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b', width: 20, textAlign: 'center', flexShrink: 0 }}>
                  {i + 1}.
                </div>
                <input
                  type="text"
                  placeholder={EXAMPLE_PROMPTS[i]}
                  value={p}
                  onChange={e => updatePrompt(i, e.target.value)}
                  maxLength={200}
                  style={inputStyle}
                />
              </div>
            ))}
          </div>

<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
            <div>
              <label style={{ fontSize: '0.65rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>TITLE (OPTIONAL)</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} maxLength={60} style={inputStyle} placeholder="Auto-generated" />
            </div>
            <div>
              <label style={{ fontSize: '0.65rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>YOUR INITIALS (OPTIONAL)</label>
              <input type="text" value={initials} onChange={e => setInitials(e.target.value.toUpperCase())} maxLength={6} style={inputStyle} placeholder="ABC" />
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: '0.65rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>VISIBILITY</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {[
                { id: 'public', label: '🌍 PUBLIC', desc: 'Listed for everyone' },
                { id: 'private', label: '🔒 PRIVATE', desc: 'Link-only' },
              ].map(v => (
                <button
                  key={v.id}
                  onClick={() => setVisibility(v.id)}
                  style={{
                    flex: 1, padding: '8px 6px', borderRadius: 8,
                    border: `2px solid ${visibility === v.id ? '#a78bfa' : 'rgba(124,58,237,0.2)'}`,
                    background: visibility === v.id ? 'rgba(167,139,250,0.1)' : 'transparent',
                    color: visibility === v.id ? '#a78bfa' : '#94a3b8',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.7rem' }}>{v.label}</div>
                  <div style={{ fontSize: '0.6rem', opacity: 0.8 }}>{v.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {error && <div style={{ color: '#ef4444', fontSize: '0.72rem', marginBottom: 10 }}>{error}</div>}

          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={!canSubmit}
            style={{ fontSize: '0.9rem', padding: '12px 24px', width: '100%', opacity: canSubmit ? 1 : 0.5 }}
          >
            🎲 GENERATE SET
          </button>
          <div style={{ color: '#64748b', fontSize: '0.6rem', textAlign: 'center', marginTop: 8 }}>
            Max 3 sets per day. Be creative — funny prompts = funnier slop.
          </div>
        </>
      )}
    </div>
  );
}
