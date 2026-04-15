import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MAX_SCORE = 500_000;
const MAX_TIMESTAMP_AGE_MS = 10 * 60 * 1000;

const jsonResp = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status, headers: { ...CORS, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return jsonResp({ error: 'Method not allowed' }, 405);

  let body: { seed?: unknown; score?: unknown; initials?: unknown; timestamp?: unknown };
  try { body = await req.json(); } catch { return jsonResp({ error: 'Invalid JSON' }, 400); }

  const { seed, score, initials, timestamp } = body;

  if (typeof seed !== 'string' || !/^[0-9A-Z]{4}-[0-9A-Z]{4}$/.test(seed))
    return jsonResp({ error: 'Invalid seed' }, 400);
  if (typeof score !== 'number' || !Number.isInteger(score) || score < 1 || score > MAX_SCORE)
    return jsonResp({ error: 'Invalid score' }, 400);
  if (typeof initials !== 'string' || !/^[A-Z0-9·]{1,6}$/.test(initials))
    return jsonResp({ error: 'Invalid initials' }, 400);
  if (typeof timestamp !== 'number' || Math.abs(Date.now() - timestamp) > MAX_TIMESTAMP_AGE_MS)
    return jsonResp({ error: 'Timestamp expired' }, 400);

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { data: set, error: setErr } = await supabase
    .from('sets').select('id').eq('seed', seed).maybeSingle();
  if (setErr || !set) return jsonResp({ error: 'Set not found' }, 404);

  const { error } = await supabase.from('set_scores').insert({
    set_id: set.id, score, initials, timestamp,
  });
  if (error) { console.error(error); return jsonResp({ error: 'DB error' }, 500); }

  await supabase.rpc('inc_set_play_count', { p_set_id: set.id });

  return jsonResp({ ok: true });
});
