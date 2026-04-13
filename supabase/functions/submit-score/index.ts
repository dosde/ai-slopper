import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Theoretical max: 6 rounds × (10 phrases × 5x combo × ~200pts) + time bonuses + iron bonus
// Set generously high to only catch obvious fakes (999999 etc.)
const MAX_SCORE = 500_000;
const MAX_TIMESTAMP_AGE_MS = 10 * 60 * 1000; // 10 minutes

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }

  let body: { score?: unknown; initials?: unknown; rank?: unknown; date?: unknown; timestamp?: unknown };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }

  const { score, initials, rank, date, timestamp } = body;

  // --- Validate score ---
  if (typeof score !== 'number' || !Number.isInteger(score) || score < 1 || score > MAX_SCORE) {
    return new Response(JSON.stringify({ error: 'Invalid score' }), {
      status: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }

  // --- Validate initials ---
  if (
    typeof initials !== 'string' ||
    initials.length < 1 ||
    initials.length > 6 ||
    !/^[A-Z0-9·]+$/.test(initials)
  ) {
    return new Response(JSON.stringify({ error: 'Invalid initials' }), {
      status: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }

  // --- Validate timestamp (reject stale/replayed submissions) ---
  if (typeof timestamp !== 'number' || Math.abs(Date.now() - timestamp) > MAX_TIMESTAMP_AGE_MS) {
    return new Response(JSON.stringify({ error: 'Timestamp expired' }), {
      status: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }

  // --- Insert using service role (bypasses RLS — safe server-side only) ---
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { error } = await supabase.from('scores').insert({
    score,
    initials,
    rank: typeof rank === 'string' ? rank.slice(0, 64) : null,
    date: typeof date === 'string' ? date.slice(0, 32) : null,
    timestamp,
  });

  if (error) {
    return new Response(JSON.stringify({ error: 'DB error' }), {
      status: 500, headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200, headers: { ...CORS, 'Content-Type': 'application/json' },
  });
});
