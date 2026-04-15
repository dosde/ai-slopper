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
  const sort = url.searchParams.get('sort') === 'recent' ? 'recent' : 'popular';
  const lang = url.searchParams.get('lang') ?? 'en';
  const limit = Math.min(Number(url.searchParams.get('limit') ?? 50), 100);

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const q = supabase
    .from('sets')
    .select('id, seed, title, creator_initials, lang, play_count, created_at')
    .eq('visibility', 'public')
    .eq('lang', lang)
    .limit(limit);

  const { data, error } = sort === 'recent'
    ? await q.order('created_at', { ascending: false })
    : await q.order('play_count', { ascending: false });

  if (error) { console.error(error); return jsonResp({ error: 'DB error' }, 500); }
  return jsonResp({ sets: data ?? [] });
});
