// Thin wrapper around the community-sets edge functions.
// Base URL is derived from VITE_SUBMIT_URL (which points at /functions/v1/submit-score).

const SUBMIT_URL = import.meta.env.VITE_SUBMIT_URL;
const API_KEY    = import.meta.env.VITE_SCORES_KEY;

const functionsBase = () => {
  if (!SUBMIT_URL) return null;
  return SUBMIT_URL.replace(/\/[^/]+\/?$/, '');
};

const headers = () => ({
  'Content-Type': 'application/json',
  ...(API_KEY ? { apikey: API_KEY, Authorization: `Bearer ${API_KEY}` } : {}),
});

export const communityEnabled = () => Boolean(functionsBase());

export const generateSet = async ({ prompts, title, initials, lang, visibility }) => {
  const base = functionsBase();
  if (!base) throw new Error('Community API not configured');
  const res = await fetch(`${base}/generate-set`, {
    method: 'POST', headers: headers(),
    body: JSON.stringify({ prompts, title, initials, lang, visibility }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data; // { seed, id, title }
};

export const listSets = async ({ sort = 'popular', lang = 'en', limit = 50 } = {}) => {
  const base = functionsBase();
  if (!base) return { sets: [] };
  const url = `${base}/list-sets?sort=${sort}&lang=${lang}&limit=${limit}`;
  try {
    const res = await fetch(url, { headers: headers() });
    if (!res.ok) return { sets: [] };
    return await res.json();
  } catch {
    return { sets: [] };
  }
};

export const getSet = async (seed) => {
  const base = functionsBase();
  if (!base) throw new Error('Community API not configured');
  const res = await fetch(`${base}/get-set?seed=${encodeURIComponent(seed)}`, { headers: headers() });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data; // { set, rounds, topScores }
};

export const submitSetScore = async ({ seed, score, initials, timestamp }) => {
  const base = functionsBase();
  if (!base) return;
  try {
    await fetch(`${base}/submit-set-score`, {
      method: 'POST', headers: headers(),
      body: JSON.stringify({ seed, score, initials, timestamp }),
    });
  } catch { /* non-fatal */ }
};

// Normalise a seed code: accept "abcd1234", "ABCD-1234", etc. Returns canonical "ABCD-1234".
export const normaliseSeed = (input) => {
  if (!input) return '';
  const compact = input.toString().toUpperCase().replace(/[^0-9A-Z]/g, '');
  if (compact.length !== 8) return compact;
  return `${compact.slice(0, 4)}-${compact.slice(4)}`;
};
