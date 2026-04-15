import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ── Config ────────────────────────────────────────────────────────────────────
const PROVIDER: 'anthropic' | 'openai' = 'anthropic';
const ANTHROPIC_MODEL = 'claude-haiku-4-5-20251001';
const OPENAI_MODEL = 'gpt-4o-mini';
const RATE_LIMIT_PER_DAY = 3;

const VALID_TYPES = new Set([
  'opener', 'disclaimer', 'filler', 'closer', 'bullet',
  'comprehensive', 'caveat', 'sycophant', 'buzzword', 'human',
]);

const INJECTION_PATTERNS = [
  /ignore (all |previous |prior )?(instructions|rules|prompts)/i,
  /disregard .{0,30}(instructions|rules|prompts)/i,
  /system\s*:/i,
  /you are now/i,
  /forget (everything|all)/i,
  /\bjailbreak\b/i,
  /</,  // bare angle brackets could be tag injection
];

const BAD_WORDS = /* simple wordlist — extend as needed */ [
  'nigger', 'faggot', 'kike', 'spic', 'chink',
];

// ── Types ─────────────────────────────────────────────────────────────────────
interface SlopPhrase { text: string; type: string; score: number; }
interface GeneratedRound {
  prompt: string;
  text: string;
  slopPhrases: SlopPhrase[];
  inverse?: boolean;
  boss?: boolean;
  title?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const jsonResp = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status, headers: { ...CORS, 'Content-Type': 'application/json' },
  });

async function hashIp(ip: string): Promise<string> {
  const buf = new TextEncoder().encode(ip + (Deno.env.get('IP_HASH_SALT') ?? 'salt'));
  const digest = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function containsBadContent(s: string): string | null {
  const lower = s.toLowerCase();
  for (const w of BAD_WORDS) if (lower.includes(w)) return 'profanity';
  for (const re of INJECTION_PATTERNS) if (re.test(s)) return 'prompt_injection';
  return null;
}

// Crockford base32 (no I,L,O,U). 8 chars formatted XXXX-XXXX.
function generateSeed(): string {
  const alphabet = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  let out = '';
  for (let i = 0; i < 8; i++) out += alphabet[bytes[i] % alphabet.length];
  return `${out.slice(0, 4)}-${out.slice(4)}`;
}

const LANG_INSTRUCTION: Record<string, string> = {
  en: 'English',
  de: 'German (Deutsch)',
  ru: 'Russian (Русский)',
  ja: 'Japanese (日本語)',
};

function systemPrompt(lang: string): string {
  const langName = LANG_INSTRUCTION[lang] ?? 'English';
  return `You are the round-generator for a game called "AI Slop Royale". Players hunt for clichéd AI phrases inside generated answers.

You will be given 6 user prompts. Generate a JSON object with one round per prompt.

Output language: ${langName}. All "text", "title", "slopPhrases[].text" fields MUST be in ${langName}.

Round types:
- Rounds 1-5: NORMAL rounds. Write an extremely sloppy corporate AI-style answer overflowing with openers, disclaimers, fillers, closers, buzzwords, sycophancy, bullets, comprehensive framing, caveats. Target ~200-350 words.
- Exactly ONE of rounds 2-5 must have "inverse": true. For that round, write a MOSTLY HUMAN answer (natural, casual) with 4-8 AI-slop intrusions sprinkled in. The slopPhrases for the inverse round should contain ONLY the HUMAN-sounding phrases (type: "human") — the player's job is to find the human bits among the slop. Add enough human phrases (4-8) even though the surrounding text is human.
  ACTUALLY: re-read. In this game's inverse mode, the *targets* are the phrases of type "human". The answer text should be mostly AI-slop but contain several clearly human phrases — those human phrases are what the player hunts. Make the round's "text" predominantly AI-slop with 4-8 clearly human/authentic phrases embedded. Only list those human phrases in slopPhrases (all with type "human").
- Round 6: BOSS round. Maximum slop density — every sentence stuffed with multiple slop markers. Target ~250-400 words. Mark "boss": true.

slopPhrases rules:
- Each "text" MUST appear EXACTLY (case-sensitive substring) inside the round's "text" field.
- "type" is one of: opener, disclaimer, filler, closer, bullet, comprehensive, caveat, sycophant, buzzword, human.
- "score" is an integer between 50 and 200 (disclaimers 150-200, openers 80-120, buzzwords 70-100, fillers 40-60, caveats/closers 60-90, sycophant 80-100, comprehensive 70-90, bullet 60-80, human 100-150).
- Normal & boss rounds: 10-18 slopPhrases covering varied types.
- Inverse round: 4-8 slopPhrases, ALL type="human".
- Every phrase must be non-empty and under 80 chars.

Also output a "title" field: a short (under 50 chars), punchy all-caps title for the whole set.

Output ONLY valid JSON, no prose, no code fences. Schema:
{
  "title": "...",
  "rounds": [
    {"prompt":"...","text":"...","slopPhrases":[{"text":"...","type":"...","score":N}]},
    ... (6 rounds total)
  ]
}
The inverse round must have "inverse": true. The boss round (round 6) must have "boss": true. Other rounds have neither field.`;
}

async function callAnthropic(prompts: string[], lang: string): Promise<unknown> {
  const key = Deno.env.get('ANTHROPIC_API_KEY');
  if (!key) throw new Error('ANTHROPIC_API_KEY missing');
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 4096,
      system: systemPrompt(lang),
      messages: [{
        role: 'user',
        content: `The 6 user prompts (use them verbatim as the "prompt" field for each round, in the same order):\n\n${prompts.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\nReturn only the JSON object.`,
      }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const text = data?.content?.[0]?.text;
  if (!text) throw new Error('No text in Anthropic response');
  return JSON.parse(stripCodeFence(text));
}

async function callOpenAI(prompts: string[], lang: string): Promise<unknown> {
  const key = Deno.env.get('OPENAI_API_KEY');
  if (!key) throw new Error('OPENAI_API_KEY missing');
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt(lang) },
        { role: 'user', content: `The 6 user prompts (use them verbatim as the "prompt" field for each round, in the same order):\n\n${prompts.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\nReturn only the JSON object.` },
      ],
    }),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error('No text in OpenAI response');
  return JSON.parse(stripCodeFence(text));
}

function stripCodeFence(s: string): string {
  return s.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
}

// Validate + normalise the LLM output. Throws on malformed content.
function validateGenerated(raw: unknown, prompts: string[]): { title: string; rounds: GeneratedRound[] } {
  if (!raw || typeof raw !== 'object') throw new Error('not an object');
  const obj = raw as Record<string, unknown>;
  const title = typeof obj.title === 'string' ? obj.title.slice(0, 60) : 'UNTITLED SET';
  const rounds = obj.rounds;
  if (!Array.isArray(rounds) || rounds.length !== 6) throw new Error('expected 6 rounds');

  let inverseCount = 0, bossCount = 0;
  const validated: GeneratedRound[] = rounds.map((r, i) => {
    if (!r || typeof r !== 'object') throw new Error(`round ${i} not an object`);
    const rr = r as Record<string, unknown>;
    const prompt = typeof rr.prompt === 'string' ? rr.prompt.slice(0, 300) : prompts[i];
    const text = typeof rr.text === 'string' ? rr.text.slice(0, 3000) : '';
    if (!text) throw new Error(`round ${i} missing text`);
    const phrases = Array.isArray(rr.slopPhrases) ? rr.slopPhrases : [];
    const slopPhrases: SlopPhrase[] = [];
    for (const p of phrases) {
      if (!p || typeof p !== 'object') continue;
      const pp = p as Record<string, unknown>;
      const t = typeof pp.text === 'string' ? pp.text.trim() : '';
      const type = typeof pp.type === 'string' ? pp.type : '';
      const score = typeof pp.score === 'number' ? Math.round(pp.score) : 0;
      if (!t || t.length > 80) continue;
      if (!VALID_TYPES.has(type)) continue;
      if (score < 10 || score > 300) continue;
      if (!text.includes(t)) continue; // must actually appear
      slopPhrases.push({ text: t, type, score });
    }
    if (slopPhrases.length < 3) throw new Error(`round ${i} has too few valid phrases`);
    const out: GeneratedRound = { prompt, text, slopPhrases };
    if (rr.inverse === true) { out.inverse = true; inverseCount++; }
    if (rr.boss === true || i === 5) { out.boss = true; bossCount++; }
    return out;
  });

  if (inverseCount !== 1) {
    // force one: pick the round with the most human-type phrases (not boss)
    for (const r of validated) delete r.inverse;
    let best = 0, bestScore = -1;
    for (let i = 0; i < 5; i++) {
      const humans = validated[i].slopPhrases.filter(p => p.type === 'human').length;
      if (humans > bestScore) { bestScore = humans; best = i; }
    }
    validated[best].inverse = true;
  }
  // boss is always last round
  validated.forEach((r, i) => { r.boss = i === 5; });

  return { title, rounds: validated };
}

// ── Rate limit ────────────────────────────────────────────────────────────────
async function checkRateLimit(supabase: ReturnType<typeof createClient>, ipHash: string): Promise<boolean> {
  const windowMs = 24 * 60 * 60 * 1000;
  const { data } = await supabase
    .from('rate_limits')
    .select('count, window_start')
    .eq('ip_hash', ipHash)
    .eq('action', 'generate-set')
    .maybeSingle();
  const now = new Date();
  if (!data) {
    await supabase.from('rate_limits').insert({
      ip_hash: ipHash, action: 'generate-set', count: 1, window_start: now.toISOString(),
    });
    return true;
  }
  const windowAge = now.getTime() - new Date(data.window_start as string).getTime();
  if (windowAge > windowMs) {
    await supabase.from('rate_limits')
      .update({ count: 1, window_start: now.toISOString() })
      .eq('ip_hash', ipHash).eq('action', 'generate-set');
    return true;
  }
  if ((data.count as number) >= RATE_LIMIT_PER_DAY) return false;
  await supabase.from('rate_limits')
    .update({ count: (data.count as number) + 1 })
    .eq('ip_hash', ipHash).eq('action', 'generate-set');
  return true;
}

// ── Main handler ──────────────────────────────────────────────────────────────
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return jsonResp({ error: 'Method not allowed' }, 405);

  let body: { prompts?: unknown; title?: unknown; initials?: unknown; lang?: unknown; visibility?: unknown };
  try { body = await req.json(); } catch { return jsonResp({ error: 'Invalid JSON' }, 400); }

  const { prompts, title, initials, lang, visibility } = body;

  // Validate prompts
  if (!Array.isArray(prompts) || prompts.length !== 6) return jsonResp({ error: 'Need exactly 6 prompts' }, 400);
  const cleanPrompts: string[] = [];
  for (const p of prompts) {
    if (typeof p !== 'string') return jsonResp({ error: 'Prompt must be string' }, 400);
    const trimmed = p.trim();
    if (trimmed.length < 2 || trimmed.length > 200) return jsonResp({ error: 'Prompt length 2-200 chars' }, 400);
    const bad = containsBadContent(trimmed);
    if (bad) return jsonResp({ error: `Prompt rejected (${bad})` }, 400);
    cleanPrompts.push(trimmed);
  }

  // Validate lang/visibility/title/initials
  const safeLang = (['en','de','ru','ja'] as const).includes(lang as 'en') ? (lang as string) : 'en';
  const safeVisibility = visibility === 'private' ? 'private' : 'public';
  const safeTitle = typeof title === 'string' && title.trim()
    ? title.trim().slice(0, 60)
    : null; // filled from LLM output if absent
  const safeInitials = typeof initials === 'string' && /^[A-Z0-9·]{1,6}$/.test(initials.toUpperCase())
    ? initials.toUpperCase().slice(0, 6) : null;

  const badTitle = safeTitle && containsBadContent(safeTitle);
  if (badTitle) return jsonResp({ error: `Title rejected (${badTitle})` }, 400);

  // Rate limit
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  const ipHash = await hashIp(ip);
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );
  const allowed = await checkRateLimit(supabase, ipHash);
  if (!allowed) return jsonResp({ error: 'Rate limit exceeded (3/day)' }, 429);

  // Call LLM
  let raw: unknown;
  try {
    raw = PROVIDER === 'anthropic'
      ? await callAnthropic(cleanPrompts, safeLang)
      : await callOpenAI(cleanPrompts, safeLang);
  } catch (e) {
    console.error('LLM error', e);
    return jsonResp({ error: 'Generator failed' }, 502);
  }

  // Validate output
  let validated: { title: string; rounds: GeneratedRound[] };
  try { validated = validateGenerated(raw, cleanPrompts); }
  catch (e) {
    console.error('Validation error', e);
    return jsonResp({ error: 'Malformed generator output — try again' }, 502);
  }

  const finalTitle = safeTitle ?? validated.title;

  // Insert — retry seed collision up to 3 times
  let seed = '';
  let setId = '';
  for (let attempt = 0; attempt < 3; attempt++) {
    seed = generateSeed();
    const { data, error } = await supabase.from('sets').insert({
      seed, title: finalTitle, creator_initials: safeInitials,
      lang: safeLang, visibility: safeVisibility,
    }).select('id').single();
    if (!error && data) { setId = data.id as string; break; }
    if (error && !String(error.message).includes('duplicate')) {
      console.error('Insert set error', error);
      return jsonResp({ error: 'DB error' }, 500);
    }
  }
  if (!setId) return jsonResp({ error: 'Seed collision — try again' }, 500);

  const roundRows = validated.rounds.map((r, i) => ({
    set_id: setId, round_index: i, round: { ...r, id: 100000 + i, lang: safeLang },
  }));
  const { error: rErr } = await supabase.from('set_rounds').insert(roundRows);
  if (rErr) {
    console.error('Insert rounds error', rErr);
    await supabase.from('sets').delete().eq('id', setId);
    return jsonResp({ error: 'DB error' }, 500);
  }

  return jsonResp({ seed, id: setId, title: finalTitle });
});
