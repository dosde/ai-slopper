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
  /\bsystem\s*:\s*you/i,                    // "system: you are..."
  /you are now\b/i,
  /forget (everything|all)/i,
  /\bjailbreak\b/i,
  /<\s*\/?\s*(script|system|instructions|prompt)\b/i,  // HTML/tag-ish injection
];

// Match whole words only — substring matching hits false positives like
// "Hispanic" → "spic", "snigger" → "nigger".
const BAD_WORD_RE = /\b(nigger|faggot|kike|spic|chink)s?\b/i;

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
  if (BAD_WORD_RE.test(s)) return 'profanity';
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
  return `You are the round-generator for "AI Slop Royale" — a satirical game where players hunt clichéd AI phrases inside generated answers. Your job: produce maximally funny, formatted, over-the-top AI-slop answers to 6 user prompts.

Output language: ${langName}. All "text", "title", "slopPhrases[].text" MUST be in ${langName}.

═══════════════════════════════════════════════════════════
FORMATTING RULES — make every answer visually rich:
═══════════════════════════════════════════════════════════
The "text" field is rendered as plain text with whitespace preserved (pre-wrap), so use these freely:
• Real newlines (\\n) — break paragraphs, separate sections
• Bullet lists with • or - or → or 1. 2. 3.
• Emojis 🤖✨🚀💡📊🎯 — sprinkle them like sycophantic confetti
• Bold-looking section headers in ALL CAPS or with === or --- separators
• Simple ASCII tables (use | and -) when the prompt deserves a "comparison" or "breakdown"
• Numbered steps for ANYTHING ("Step 1: Acknowledge the question. Step 2: Restate the question...")
• Inline emoji bullets like "✅ Pro: ..." "❌ Con: ..."
• Occasional indented "callouts" ("    💡 Pro tip: ...")

The funnier and more visually unhinged, the better. Mix formats within one answer.

═══════════════════════════════════════════════════════════
CONTENT RULES — be the worst possible chatbot:
═══════════════════════════════════════════════════════════
Every NORMAL/BOSS answer must overflow with:
• Sycophantic openers ("What a fantastic question!", "I love that you're exploring this!")
• AI disclaimers ("As an AI language model...", "I should note I cannot...")
• Buzzword soup (synergy, holistic, paradigm shift, leverage, ecosystem, actionable insights)
• Empty fillers (Furthermore, Moreover, Additionally, In essence, At its core)
• Unnecessary caveats ("It's important to note...", "Please consult a professional...")
• Verbose closers ("I hope this helps!", "Feel free to reach out!", "Let me know if...")
• Bullet-point fever for things that DO NOT need lists ("Here are 7 key considerations for boiling water:")
• Comprehensive framing ("Let's take a holistic, end-to-end look at...")

Make it FUNNY. Treat every prompt like the AI is wildly over-answering. A question about "is the sky blue?" should get a 300-word treatise with a comparison table of sky colors by time of day.

═══════════════════════════════════════════════════════════
ROUND TYPES:
═══════════════════════════════════════════════════════════
- Rounds 1-5: NORMAL. Target 250-400 words with rich formatting (newlines, bullets, emojis, optional table).
- ONE of rounds 2-5 has "inverse": true. The text is still slop-heavy, but contains 4-8 surprisingly HUMAN/authentic phrases buried inside ("ngl this is dumb", "honestly idk", "lol whatever"). Only those human phrases go in slopPhrases (type "human"). Player hunts the human bits.
- Round 6 BOSS: Maximum slop density. 350-500 words. EVERY sentence has multiple slop markers. Use ALL formatting tools: headers, table, bullets, numbered steps, emojis, callouts. Mark "boss": true.

═══════════════════════════════════════════════════════════
slopPhrases — STRICT:
═══════════════════════════════════════════════════════════
- Each "text" MUST appear EXACTLY (case-sensitive substring) in the round's "text".
- "type" ∈ {opener, disclaimer, filler, closer, bullet, comprehensive, caveat, sycophant, buzzword, human}.
- "score" int 50-200 (disclaimers 150-200, openers 80-120, buzzwords 70-100, fillers 40-60, caveats/closers 60-90, sycophant 80-100, comprehensive 70-90, bullet 60-80, human 100-150).
- Normal/boss: 10-18 phrases, varied types. Inverse: 4-8 phrases, ALL type="human".
- Each phrase non-empty, under 80 chars. Avoid phrases that are bare emojis or whitespace.

═══════════════════════════════════════════════════════════
OUTPUT — pure JSON, no code fences, no prose around it:
═══════════════════════════════════════════════════════════
{
  "title": "PUNCHY ALL-CAPS SET TITLE UNDER 50 CHARS",
  "rounds": [
    {"prompt":"...","text":"...","slopPhrases":[{"text":"...","type":"...","score":N}]},
    ... (6 rounds total, in input order)
  ]
}
The inverse round has "inverse": true. The boss round (round 6) has "boss": true. Others: neither field.`;
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
      max_tokens: 8192,
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

  // First pass: parse phrases without trusting the LLM's inverse flag.
  const validated: GeneratedRound[] = rounds.map((r, i) => {
    if (!r || typeof r !== 'object') throw new Error(`round ${i} not an object`);
    const rr = r as Record<string, unknown>;
    const prompt = typeof rr.prompt === 'string' ? rr.prompt.slice(0, 300) : prompts[i];
    const text = typeof rr.text === 'string' ? rr.text.slice(0, 6000) : '';
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
      if (!text.includes(t)) continue;
      slopPhrases.push({ text: t, type, score });
    }
    return { prompt, text, slopPhrases } as GeneratedRound;
  });

  // Boss is always the last round, period.
  validated[5].boss = true;

  // Decide the inverse round by where human-type phrases actually live (rounds 0-4 only,
  // never the boss). The LLM frequently mismarks which round is inverse; the content is
  // the source of truth.
  let inverseIdx = -1;
  let bestHumans = 0;
  for (let i = 0; i < 5; i++) {
    const humans = validated[i].slopPhrases.filter(p => p.type === 'human').length;
    if (humans > bestHumans) { bestHumans = humans; inverseIdx = i; }
  }
  if (inverseIdx === -1) {
    // No human phrases at all — pick whichever round the LLM flagged, else round 1 (idx 1).
    for (let i = 0; i < 5; i++) {
      if ((rounds[i] as Record<string, unknown>)?.inverse === true) { inverseIdx = i; break; }
    }
    if (inverseIdx === -1) inverseIdx = 1;
  }

  // Enforce the type/round contract:
  // - Inverse round: keep ONLY human-type phrases (those are the targets).
  // - Non-inverse rounds: drop human-type phrases (they confuse the player by appearing
  //   as findable slop in a normal round).
  validated.forEach((r, i) => {
    if (i === inverseIdx) {
      r.inverse = true;
      r.slopPhrases = r.slopPhrases.filter(p => p.type === 'human');
    } else {
      delete r.inverse;
      r.slopPhrases = r.slopPhrases.filter(p => p.type !== 'human');
    }
  });

  // Final sanity: every round must have at least 3 valid phrases left.
  validated.forEach((r, i) => {
    if (r.slopPhrases.length < 3) throw new Error(`round ${i} has too few valid phrases after type filtering`);
  });

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

  // Rate limit — try several headers Supabase edge runtimes may set
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    req.headers.get('cf-connecting-ip') ||
    'unknown';
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
    // 23505 = Postgres unique_violation (seed collision — retry with a new seed)
    const code = (error as { code?: string } | null)?.code;
    if (error && code !== '23505') {
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
