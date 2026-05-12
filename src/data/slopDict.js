// Universal slop dictionary — applied to every (non-inverse) round on top of
// the hand-authored slopPhrases. These are the low-effort "feels like slop
// but didn't count" phrases. Score is intentionally low (25-40) so hand-
// authored phrases keep their punch, and they're tagged `fromDict: true`
// so completion counters ignore them (bonus points only).

const E = (text, type, score = 30) => ({ text, type, score, fromDict: true });

export const SLOP_DICT_EN = [
  // Corporate buzzwords
  E("robust", "buzzword"),
  E("holistic", "buzzword"),
  E("scalable", "buzzword"),
  E("seamless", "buzzword"),
  E("synergistic", "buzzword"),
  E("synergy", "buzzword"),
  E("leverage", "buzzword"),
  E("leveraging", "buzzword"),
  E("ecosystem", "buzzword"),
  E("paradigm", "buzzword"),
  E("framework", "buzzword"),
  E("actionable insights", "buzzword", 35),
  E("best practices", "buzzword", 35),
  E("going forward", "buzzword"),
  E("at its core", "buzzword"),
  E("end-to-end", "buzzword"),
  E("value-add", "buzzword"),
  E("added value", "buzzword"),
  E("mission-critical", "buzzword"),
  E("low-hanging fruit", "buzzword", 35),
  E("move the needle", "buzzword", 35),
  E("circle back", "buzzword"),
  E("deep dive", "buzzword"),
  E("thought leadership", "buzzword", 35),
  E("north star", "buzzword"),
  E("optimize", "buzzword"),
  E("optimized", "buzzword"),
  E("game-changer", "buzzword", 35),

  // Filler transitions
  E("ultimately", "filler", 25),
  E("essentially", "filler", 25),
  E("fundamentally", "filler", 25),
  E("broadly speaking", "filler"),
  E("generally speaking", "filler"),
  E("to summarize", "filler"),
  E("to recap", "filler"),
  E("to sum up", "filler"),
  E("in essence", "filler", 25),
  E("in summary", "filler", 25),
  E("needless to say", "filler"),
  E("without further ado", "filler"),
  E("first and foremost", "filler"),
  E("that said", "filler", 25),
  E("indeed", "filler", 25),

  // Hedges / caveats
  E("it's worth noting", "caveat"),
  E("it's worth mentioning", "caveat", 35),
  E("having said that", "caveat"),
  E("with that said", "caveat"),
  E("with that in mind", "caveat"),
  E("on the other hand", "caveat"),
  E("arguably", "caveat", 25),
  E("presumably", "caveat", 25),
  E("in principle", "caveat", 25),
  E("in theory", "caveat", 25),
  E("one could argue", "caveat", 35),

  // Sycophantic intensifiers
  E("truly", "sycophant", 25),
  E("genuinely", "sycophant", 25),
  E("deeply", "sycophant", 25),
  E("profoundly", "sycophant", 25),
  E("incredibly", "sycophant", 25),
  E("remarkably", "sycophant", 25),
  E("thoughtfully", "sycophant", 25),
  E("meaningfully", "sycophant", 25),
  E("beautifully", "sycophant", 25),

  // AI tics
  E("delve into", "comprehensive", 40),
  E("dive into", "comprehensive", 35),
  E("unpack", "comprehensive", 30),
  E("embark on", "comprehensive", 35),
  E("navigate", "comprehensive", 30),
  E("navigating", "comprehensive", 30),
  E("comprehensive understanding", "comprehensive", 40),
  E("rich understanding", "comprehensive", 40),
  E("nuanced perspective", "comprehensive", 40),
  E("holistic perspective", "comprehensive", 40),
  E("thoughtful consideration", "comprehensive", 35),
  E("rich tapestry", "comprehensive", 40),
];

export const SLOP_DICT_DE = [
  // Buzzwords
  E("nachhaltig", "buzzword"),
  E("robust", "buzzword"),
  E("ganzheitlich", "buzzword"),
  E("skalierbar", "buzzword"),
  E("synergistisch", "buzzword"),
  E("Synergie", "buzzword"),
  E("Mehrwert", "buzzword"),
  E("Paradigmenwechsel", "buzzword", 35),
  E("Ökosystem", "buzzword"),
  E("Best Practices", "buzzword", 35),
  E("Game Changer", "buzzword", 35),
  E("Deep Dive", "buzzword"),
  E("handlungsorientiert", "buzzword"),
  E("zukunftsorientiert", "buzzword"),
  E("ergebnisorientiert", "buzzword"),
  E("bestmöglich", "buzzword", 25),
  // Filler
  E("im Wesentlichen", "filler", 25),
  E("im Grunde", "filler", 25),
  E("letztendlich", "filler", 25),
  E("grundsätzlich", "filler", 25),
  E("zusammenfassend", "filler"),
  E("allgemein gesprochen", "filler"),
  E("ohne Übertreibung", "filler"),
  E("zweifellos", "filler", 25),
  E("gewiss", "filler", 25),
  // Caveats
  E("es sei erwähnt", "caveat"),
  E("anzumerken sei", "caveat"),
  E("wie bereits erwähnt", "caveat"),
  E("in diesem Sinne", "caveat"),
  E("nebenbei bemerkt", "caveat"),
  // Sycophant
  E("wahrhaft", "sycophant", 25),
  E("wirklich", "sycophant", 25),
  E("durchaus", "sycophant", 25),
  E("äußerst", "sycophant", 25),
  E("bemerkenswert", "sycophant", 25),
  E("zutiefst", "sycophant", 25),
  // AI tics
  E("eintauchen", "comprehensive", 35),
  E("vertiefen", "comprehensive", 35),
  E("beleuchten", "comprehensive", 30),
  E("erkunden", "comprehensive", 30),
  E("navigieren", "comprehensive", 30),
  E("umfassendes Verständnis", "comprehensive", 40),
  E("ganzheitliche Perspektive", "comprehensive", 40),
  E("nuancierte Sichtweise", "comprehensive", 40),
];

export const SLOP_DICT_RU = [
  // Buzzwords
  E("надёжный", "buzzword"),
  E("целостный", "buzzword"),
  E("масштабируемый", "buzzword"),
  E("синергетический", "buzzword"),
  E("синергия", "buzzword"),
  E("ценность", "buzzword", 25),
  E("парадигма", "buzzword"),
  E("экосистема", "buzzword"),
  E("лучшие практики", "buzzword", 35),
  E("точка роста", "buzzword", 35),
  E("глубокое погружение", "buzzword", 35),
  E("драйвер роста", "buzzword", 35),
  E("проактивный подход", "buzzword", 35),
  // Filler
  E("по сути", "filler", 25),
  E("в сущности", "filler", 25),
  E("в конечном счёте", "filler", 25),
  E("фундаментально", "filler", 25),
  E("в целом", "filler", 25),
  E("итого", "filler", 25),
  E("разумеется", "filler", 25),
  E("безусловно", "filler", 25),
  // Caveats
  E("стоит отметить", "caveat"),
  E("следует подчеркнуть", "caveat"),
  E("как известно", "caveat"),
  E("в этом отношении", "caveat"),
  E("в этом смысле", "caveat"),
  // Sycophant
  E("действительно", "sycophant", 25),
  E("поистине", "sycophant", 25),
  E("искренне", "sycophant", 25),
  E("по-настоящему", "sycophant", 25),
  E("замечательно", "sycophant", 25),
  E("исключительно", "sycophant", 25),
  // AI tics
  E("погружаться", "comprehensive", 35),
  E("исследовать", "comprehensive", 30),
  E("разбирать", "comprehensive", 30),
  E("рассмотреть", "comprehensive", 30),
  E("осветить", "comprehensive", 30),
  E("комплексное понимание", "comprehensive", 40),
  E("целостная перспектива", "comprehensive", 40),
  E("нюансированный взгляд", "comprehensive", 40),
];

export const SLOP_DICT_JA = [
  // Buzzwords
  E("包括的", "buzzword"),
  E("全体的", "buzzword"),
  E("持続可能", "buzzword"),
  E("拡張性のある", "buzzword"),
  E("シナジー", "buzzword"),
  E("パラダイム", "buzzword"),
  E("エコシステム", "buzzword"),
  E("価値", "buzzword", 25),
  E("ベストプラクティス", "buzzword", 35),
  E("ゲームチェンジャー", "buzzword", 35),
  E("ディープダイブ", "buzzword", 35),
  E("プロアクティブな取り組み", "buzzword", 35),
  E("アクショナブルな洞察", "buzzword", 35),
  // Filler
  E("本質的に", "filler", 25),
  E("根本的に", "filler", 25),
  E("究極的に", "filler", 25),
  E("基本的には", "filler", 25),
  E("要するに", "filler", 25),
  E("一般的に言えば", "filler"),
  E("もちろん", "filler", 25),
  E("確実に", "filler", 25),
  E("間違いなく", "filler", 25),
  E("言うまでもなく", "filler"),
  // Caveats
  E("触れておきたい", "caveat"),
  E("言及しておきたい", "caveat"),
  E("付け加えておくと", "caveat"),
  E("補足しておくと", "caveat"),
  // Sycophant
  E("真に", "sycophant", 25),
  E("本当に", "sycophant", 25),
  E("心から", "sycophant", 25),
  E("深く", "sycophant", 25),
  E("著しく", "sycophant", 25),
  E("非常に", "sycophant", 25),
  // AI tics
  E("掘り下げる", "comprehensive", 35),
  E("探究する", "comprehensive", 35),
  E("紐解く", "comprehensive", 35),
  E("取り組む", "comprehensive", 30),
  E("ナビゲート", "comprehensive", 30),
  E("包括的な理解", "comprehensive", 40),
  E("全体的な視点", "comprehensive", 40),
  E("ニュアンスのある視点", "comprehensive", 40),
];

export function getSlopDict(lang) {
  switch (lang) {
    case 'de': return SLOP_DICT_DE;
    case 'ru': return SLOP_DICT_RU;
    case 'ja': return SLOP_DICT_JA;
    default:   return SLOP_DICT_EN;
  }
}
