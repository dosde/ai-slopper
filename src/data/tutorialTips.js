// Tutorial tip definitions + per-language round picks.
//
// Each language gets a hand-picked normal round + inverse round. Tip text
// is keyed by language with EN fallback. Falls back gracefully if a language
// doesn't define a translation: returns EN text.

export const TUTORIAL_ROUNDS_BY_LANG = {
  en: [1, 47],     // SANDWICH INCIDENT + CODE REVIEW
  de: [71, 111],   // DIE GEFÜHLS-FRAGE + RETTE DEN ECHTEN RAT
  ru: [117, 157],  // normal classic + СПАСИ НАСТОЯЩИЙ СОВЕТ
  ja: [163, 203],  // normal classic + 本当の助けを救え
};

// Lookup table — outer key is roundId, inner has trigger + text-by-lang.
export const TUTORIAL_TIPS = {
  // === EN: SANDWICH INCIDENT (normal)
  1: [
    { id: 'tut_power_ups', trigger: 'round_start',
      title: { en: '🎁 4 POWER-UPS UP TOP', de: '🎁 4 JOKER OBEN', ru: '🎁 4 ДЖОКЕРА СВЕРХУ', ja: '🎁 上部に4つのジョーカー' },
      text: {
        en: '📡 Radar reveals slop briefly • ⏰ Time Boost +15s • 💥 2× doubles your next clicks • 🛡️ Streak Saver eats one wrong click. Each is usable once per game — tap an icon in the top bar when you need help.',
        de: '📡 Radar zeigt kurz alle Slops • ⏰ Zeit-Boost +15s • 💥 2× verdoppelt deine nächsten Klicks • 🛡️ Combo-Schutz fängt einen Fehlklick ab. Jeweils einmal pro Spiel nutzbar — tippe oben auf ein Symbol, wenn du Hilfe brauchst.',
        ru: '📡 Радар на миг подсвечивает слоп • ⏰ Ускоритель +15с • 💥 2× удваивает следующие клики • 🛡️ Хранитель комбо съедает один неверный клик. Каждый — один раз за игру. Тапни иконку сверху, когда нужна помощь.',
        ja: '📡 レーダーは一瞬スロップを表示 • ⏰ タイムブースト +15秒 • 💥 2× で次のクリックが倍率に • 🛡️ ストリークセーバーが誤クリック1回を肩代わり。各1回ずつ使えます — 必要なときに上部のアイコンをタップ。',
      },
    },
    { id: 'en_normal_start', trigger: 'round_start',
      title: { en: '🎓 ROUND 1 OF 2 — SPOT THE SLOP', de: '🎓 RUNDE 1 VON 2 — SLOP ERKENNEN', ru: '🎓 РАУНД 1 ИЗ 2 — НАЙДИ СЛОП', ja: '🎓 ラウンド 1/2 — スロップを見つけよう' },
      text: {
        en: 'The AI wrote a wall of sloppy text. Click any phrase or word that sounds like generic AI fluff to score. Bigger hand-tagged phrases (like "As an AI language model") pay 60-200 pts.',
        de: 'Die KI hat eine Wand aus schleimigem Text geschrieben. Klicke jede Phrase oder jedes Wort an, das wie generischer KI-Schwulst klingt. Größere handmarkierte Phrasen (wie "Als KI-Sprachmodell") bringen 60-200 Punkte.',
        ru: 'ИИ написал стену слизкого текста. Кликай по любой фразе или слову, которое звучит как типичная ИИ-вата, чтобы получить очки. Длинные ручные фразы (например, «Как языковая модель ИИ») дают 60-200 очков.',
        ja: 'AIがべたべたなテキストの壁を書きました。AIっぽい無意味な言い回しに聞こえる単語やフレーズをクリックして得点しましょう。手動タグ付きの長いフレーズ（「AIの言語モデルとして」など）は60〜200ポイントになります。',
      },
    },
    { id: 'en_normal_first_hand', trigger: 'slop_found', when: e => !e.isDict,
      title: { en: '🎯 NICE CATCH', de: '🎯 GUT ERWISCHT', ru: '🎯 ОТЛИЧНЫЙ УЛОВ', ja: '🎯 ナイスキャッチ' },
      text: {
        en: 'That was a hand-tagged phrase. Chain more catches within ~2 seconds to build a COMBO multiplier — up to 3×. Combo decays if you slow down.',
        de: 'Das war eine handmarkierte Phrase. Reihe weitere Treffer innerhalb von ~2 Sekunden aneinander, um einen COMBO-Multiplikator aufzubauen — bis zu 3×. Die Combo verfällt, wenn du langsamer wirst.',
        ru: 'Это была фраза, отмеченная вручную. Цепляй ещё попадания в течение ~2 секунд, чтобы построить КОМБО-множитель — до 3×. Если замедлишься, комбо угаснет.',
        ja: 'これは手動でタグ付けされたフレーズでした。約2秒以内に続けて当てるとコンボ倍率が上がります（最大3倍）。手を止めるとコンボは減っていきます。',
      },
    },
    { id: 'en_normal_first_dict', trigger: 'slop_found', when: e => e.isDict,
      title: { en: '🔍 DICTIONARY HIT', de: '🔍 WÖRTERBUCH-TREFFER', ru: '🔍 СЛОВАРНОЕ ПОПАДАНИЕ', ja: '🔍 辞書ヒット' },
      text: {
        en: 'Small dict-tier catch — universal slop words ("robust", "truly", "holistic") pay a flat 25-40 pts. No combo, no shouty commentary. Pure bonus for reading carefully.',
        de: 'Kleiner Wörterbuch-Treffer — universelle Slop-Wörter ("robust", "wahrhaft", "ganzheitlich") bringen flache 25-40 Punkte. Keine Combo, keine lauten Kommentare. Reiner Bonus fürs aufmerksame Lesen.',
        ru: 'Маленькое попадание из словаря — универсальные слоп-слова («надёжный», «поистине», «целостный») дают фиксированные 25-40 очков. Без комбо, без кричащих комментариев. Чистый бонус за внимательное чтение.',
        ja: '辞書ティアの小さなキャッチ — 汎用スロップ語（"robust"、"truly"、"holistic"）は固定25〜40ポイントです。コンボなし、派手なコメントなし。注意深く読んだご褒美。',
      },
    },
    { id: 'en_normal_first_wrong', trigger: 'wrong_click',
      title: { en: '❌ NOT SLOP', de: '❌ KEIN SLOP', ru: '❌ НЕ СЛОП', ja: '❌ スロップじゃない' },
      text: {
        en: "That word wasn't slop — −50 pts and your combo resets. Be picky. When in doubt, don't click.",
        de: 'Das Wort war kein Slop — −50 Punkte und deine Combo wird zurückgesetzt. Sei wählerisch. Im Zweifel: nicht klicken.',
        ru: 'Это слово не было слопом — −50 очков, и твоё комбо обнулилось. Будь разборчив. Если сомневаешься — не кликай.',
        ja: 'その単語はスロップではありませんでした — −50ポイントでコンボもリセット。慎重に。迷ったらクリックしない。',
      },
    },
  ],
  // === EN: CODE REVIEW (inverse)
  47: [
    { id: 'en_inverse_start', trigger: 'round_start',
      title: { en: '🔄 ROUND 2 OF 2 — RULES REVERSED', de: '🔄 RUNDE 2 VON 2 — REGELN UMGEDREHT', ru: '🔄 РАУНД 2 ИЗ 2 — ПРАВИЛА НАОБОРОТ', ja: '🔄 ラウンド 2/2 — ルール逆転' },
      text: {
        en: 'Now the AI text is the decoy. Find the HUMAN thoughts hiding inside — short, real, often emotional. Every wrong click costs −150 pts here, so read before you click.',
        de: 'Jetzt ist der KI-Text die Ablenkung. Finde die MENSCHLICHEN Gedanken, die sich darin verstecken — kurz, echt, oft emotional. Jeder Fehlklick kostet hier −150 Punkte, also lies erst, dann klick.',
        ru: 'Теперь ИИ-текст — это приманка. Найди ЧЕЛОВЕЧЕСКИЕ мысли, спрятанные внутри — короткие, настоящие, часто эмоциональные. Здесь каждый неверный клик стоит −150 очков, так что сначала читай.',
        ja: '今度はAIテキストが囮です。中に隠れた人間の思考を見つけてください — 短く、本物で、しばしば感情的です。間違ったクリックは−150ポイント。クリックする前によく読んで。',
      },
    },
    { id: 'en_inverse_first_human', trigger: 'slop_found',
      title: { en: '✅ HUMAN FOUND', de: '✅ MENSCH GEFUNDEN', ru: '✅ ЧЕЛОВЕК НАЙДЕН', ja: '✅ 人間を発見' },
      text: {
        en: 'Real human thought! Inverse rounds pay 2× per find. Keep scanning — there are usually 2-3 hidden human phrases per round.',
        de: 'Echter menschlicher Gedanke! Umgekehrte Runden zahlen 2× pro Treffer. Lies weiter — meist gibt es 2-3 versteckte menschliche Phrasen pro Runde.',
        ru: 'Настоящая человеческая мысль! Перевёрнутые раунды платят 2× за каждый найденный. Продолжай искать — обычно прячется 2-3 человеческих фразы за раунд.',
        ja: '本物の人間の思考！逆転ラウンドは1つ見つけるごとに2倍。読み続けて — 通常1ラウンドに2〜3個の人間フレーズが隠れています。',
      },
    },
  ],
};

// Per-language clones of the same tip set — keyed under each language's
// chosen round IDs so the tip system can look them up by round id.
const _LANG_ROUND_TIPS = [
  ['de', 71, 111],
  ['ru', 117, 157],
  ['ja', 163, 203],
];
for (const [, normalId, inverseId] of _LANG_ROUND_TIPS) {
  TUTORIAL_TIPS[normalId] = TUTORIAL_TIPS[1];
  TUTORIAL_TIPS[inverseId] = TUTORIAL_TIPS[47];
}

export function getTipsForRound(roundId, lang = 'en') {
  const tips = TUTORIAL_TIPS[roundId] || [];
  return tips.map(t => ({
    ...t,
    title: t.title[lang] ?? t.title.en,
    text:  t.text[lang]  ?? t.text.en,
  }));
}

export function getTutorialRoundIds(lang = 'en') {
  return TUTORIAL_ROUNDS_BY_LANG[lang] ?? TUTORIAL_ROUNDS_BY_LANG.en;
}
