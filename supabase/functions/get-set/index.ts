import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const jsonResp = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status, headers: { ...CORS, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  const url = new URL(req.url);
  const seed = (url.searchParams.get('seed') ?? '').toUpperCase().trim();
  if (!/^[0-9A-Z]{4}-[0-9A-Z]{4}$/.test(seed)) return jsonResp({ error: 'Invalid seed' }, 400);

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { data: set, error: setErr } = await supabase
    .from('sets')
    .select('id, seed, title, creator_initials, lang, visibility, play_count, created_at')
    .eq('seed', seed)
    .maybeSingle();
  if (setErr) { console.error(setErr); return jsonResp({ error: 'DB error' }, 500); }
  if (!set) return jsonResp({ error: 'Not found' }, 404);

  const [roundsRes, scoresRes] = await Promise.all([
    supabase.from('set_rounds').select('round_index, round').eq('set_id', set.id).order('round_index'),
    supabase.from('set_scores').select('score, initials, timestamp').eq('set_id', set.id).order('score', { ascending: false }).limit(10),
  ]);
  if (roundsRes.error) { console.error(roundsRes.error); return jsonResp({ error: 'DB error' }, 500); }

  const rounds = (roundsRes.data ?? []).map(r => r.round);
  return jsonResp({
    set, rounds,
    topScores: scoresRes.data ?? [],
  });
});
