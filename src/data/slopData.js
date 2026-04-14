// The sacred tome of AI slop patterns
import ROUNDS_DE from './rounds_de.js';
import ROUNDS_RU from './rounds_ru.js';
import ROUNDS_JA from './rounds_ja.js';

export const SLOP_COMMENTARY = {
  opener: [
    "THE OPENER DETECTED! 🚨",
    "CLASSIC SYCOPHANCY ALERT! 🤢",
    "OH NO, HERE WE GO... 😩",
    "CRINGE INCOMING! 🫠",
    "YOUR AI BUTLER HAS ARRIVED! 🎩",
    "THE INEVITABLE OPENER STRIKES! ⚡",
    "IT COULDN'T JUST ANSWER, COULD IT? 😤",
    "THE WARMUP DETECTED — BRACE YOURSELF! 🎬",
    "UNPROMPTED ENTHUSIASM ALERT! 📣",
    "THE BOT IS DELIGHTED TO SEE YOU! 🎊",
  ],
  disclaimer: [
    "THE FORBIDDEN PHRASE! ⚠️",
    "AS AN AI DISCLAIMER DETECTED! 🤖",
    "ROBOT IDENTITY CRISIS MOMENT! 🔧",
    "IT REMINDED YOU IT'S NOT HUMAN AGAIN! 😤",
    "UNNECESSARY ROBOT CONFESSION! 🦾",
    "IT'S HAVING AN EXISTENTIAL MOMENT! 🌀",
    "THE AI REMINDED US IT'S AN AI. SHOCKING. 🙃",
    "UNSOLICITED ROBOT STATUS UPDATE! 📡",
    "IT CAN'T HELP IT — IT HAS TO TELL YOU! 💬",
  ],
  filler: [
    "FILLER WORD ALERT! 📢",
    "UNNECESSARY TRANSITION! 💨",
    "THIS WORD DID NOTHING! 🫥",
    "PADDING DETECTED! 🧸",
    "ZERO INFORMATION CONTENT! 🫙",
    "THE VOID OF MEANING! 🌑",
    "VERBAL FILLER SPOTTED! 🎙️",
    "COULD HAVE JUST SKIPPED THIS! ⏭️",
    "THE CONNECTIVE TISSUE OF SLOP! 🕸️",
  ],
  closer: [
    "THE CLASSIC SIGN-OFF DETECTED! 👋",
    "BYE-BYE BOILERPLATE! 🚪",
    "OBLIGATORY CLOSING STATEMENT! 📋",
    "PLEASE LET ME KNOW IF... 🙄",
    "THE ETERNAL OFFER TO HELP MORE! ♾️",
    "SIGN-OFF DETECTED — FINALLY! 🏁",
    "IT'S SAYING GOODBYE IN THE MOST WORDS POSSIBLE! 📜",
    "THE CLOSER THAT WAS NOT ASKED FOR! 🔒",
    "AN OFFER FOR YET MORE SLOP! 📬",
    "THE RITUAL FAREWELL DETECTED! 🕯️",
  ],
  bullet: [
    "BULLET POINT OBSESSION CONFIRMED! 📌",
    "IT LISTED THINGS THAT DIDN'T NEED LISTING! 📝",
    "UNNECESSARY STRUCTURE DETECTED! 🗂️",
    "FORMATTING WHERE NONE WAS NEEDED! 📐",
    "LIST FEVER ACTIVATED! 🗒️",
    "IT COULD HAVE JUST SAID IT! 😭",
  ],
  comprehensive: [
    "COMPREHENSIVE GUIDE INCOMING! 😱",
    "STEP-BY-STEP OVERLOAD DETECTED! 📊",
    "IT'S ABOUT TO GET VERY WORDY! 📚",
    "HOLISTIC APPROACH ACTIVATED! 🌈",
    "DEEP DIVE ALERT! 🤿",
    "IT'S GOING TO BE THOROUGH. SO THOROUGH. 🔬",
    "ROBUST SOLUTION INCOMING! 💪",
    "END-TO-END ANALYSIS DETECTED! 🗺️",
    "NUANCED UNDERSTANDING CLAIMED! 🧐",
  ],
  caveat: [
    "UNSOLICITED DISCLAIMER! ⚡",
    "IT'S IMPORTANT TO NOTE THAT... 👆",
    "MANDATORY CAVEAT DETECTED! 🚧",
    "HEDGE MODE ENGAGED! 🦔",
    "UNNECESSARY WARNING SPOTTED! 🚦",
    "IT'S COVERING ITS BASES! 🛡️",
    "THE FINE PRINT HAS ARRIVED! 📄",
    "CAVEAT EMPTOR — AI EDITION! ⚖️",
    "PLEASE CONSULT A PROFESSIONAL! 👨‍⚕️",
    "THE HEDGE THAT WASN'T NEEDED! 🌿",
  ],
  sycophant: [
    "PURE SYCOPHANCY DETECTED! 🍯",
    "IT'S BUTTERING YOU UP! 🧈",
    "GREAT QUESTION SPOTTED! 🎯",
    "EMOTIONAL SUPPORT BOT ACTIVATED! 🤗",
    "FLATTERY DETECTED — RESIST! 💐",
    "IT THINKS YOUR QUESTION IS WONDERFUL! 🌟",
    "UNPROMPTED COMPLIMENT INCOMING! 🎁",
    "THE AI IS IMPRESSED BY YOU! 🏅",
    "VALIDATION DISPENSED WITHOUT REQUEST! 🎀",
  ],
  buzzword: [
    "CORPORATE BUZZWORD DETECTED! 💼",
    "SYNERGY OVERLOAD! 🤝",
    "LEVERAGE THIS DETECTION! 🏋️",
    "DISRUPTION SPOTTED! 💥",
    "THE ECOSYSTEM IS THRIVING! 🌿",
    "SCALABLE SLOP CONFIRMED! 📈",
  ],
  human: [
    "HUMAN DETECTED! 🧠",
    "A REAL THOUGHT! INCREDIBLE! 💡",
    "GENUINE EMOTION RESCUED! 🫶",
    "NOT AN AI! CONFIRMED HUMAN! ✅",
    "THE HUMAN SPEAKS! 🗣️",
    "ORGANIC THOUGHT LOCATED! 🌱",
    "ACTUAL PERSON FOUND! 🎉",
    "HUMANITY DETECTED — SAVE IT! 💚",
    "THIS WAS TYPED WITH REAL FEELINGS! 😭",
    "RESCUED FROM THE SLOP! 🏊",
    "ONE OF US! ONE OF US! 🧍",
    "UNFILTERED HUMAN BRAIN OUTPUT! 🧪",
  ],
};

const COMMENTARY_DE = {
  opener:        ["DER ÖFFNER ENTDECKT! 🚨", "KLASSISCHE SCHLEIMEREI! 🤢", "OH NEIN, ES GEHT LOS... 😩", "UNGEBETENE BEGEISTERUNG! 📣"],
  disclaimer:    ["DIE VERBOTENE PHRASE! ⚠️", "KI-IDENTITÄTSKRISE! 🤖", "ES ERINNERT UNS WIEDER DARAN! 😤", "UNERWÜNSCHTES ROBOTER-GESTÄNDNIS! 🦾"],
  filler:        ["FÜLLWORT ENTDECKT! 📢", "UNNÖTIGE ÜBERLEITUNG! 💨", "DIESES WORT TUT NICHTS! 🫥", "TEXTPOLSTERUNG ERKANNT! 🧸"],
  closer:        ["DER KLASSISCHE ABSCHLUSS! 👋", "PFLICHTAUSSAGE ERKANNT! 📋", "ES VERABSCHIEDET SICH UMSTÄNDLICH! 📜", "EIN WEITERES SLOP-ANGEBOT! 📬"],
  bullet:        ["AUFZÄHLUNGSPUNKT-BESESSENHEIT BESTÄTIGT! 📌", "UNNÖTIGE STRUKTUR ERKANNT! 🗂️", "LISTEN-FIEBER AKTIV! 🗒️"],
  comprehensive: ["UMFASSENDER GUIDE INCOMING! 😱", "SCHRITT-FÜR-SCHRITT-ÜBERLASTUNG! 📊", "GANZHEITLICHER ANSATZ AKTIVIERT! 🌈"],
  caveat:        ["UNGEBETENER HAFTUNGSAUSSCHLUSS! ⚡", "ES IST WICHTIG ZU BEACHTEN... 👆", "ABSICHERUNGSMODUS AKTIVIERT! 🦔"],
  sycophant:     ["PURE SCHLEIMEREI ENTDECKT! 🍯", "ES MACHT IHNEN KOMPLIMENTE! 🧈", "TOLLE FRAGE GESICHTET! 🎯"],
  buzzword:      ["BUZZWORD ENTDECKT! 💼", "SYNERGIE-ÜBERLASTUNG! 🤝", "DAS ÖKOSYSTEM GEDEIHT! 🌿"],
  human:         ["MENSCH ENTDECKT! 🧠", "UNGEFILTERTER MENSCH! 🎯", "ECHTER GEDANKE GESICHTET! ✨", "NICHT VON DER KI! 🙌"],
};

const COMMENTARY_RU = {
  opener:        ["ПРИВЕТСТВИЕ ОБНАРУЖЕНО! 🚨", "КЛАССИЧЕСКАЯ ЛЕСТЬ! 🤢", "О НЕТ, НАЧИНАЕТСЯ... 😩", "НЕПРОШЕНЫЙ ЭНТУЗИАЗМ! 📣"],
  disclaimer:    ["ЗАПРЕЩЁННАЯ ФРАЗА! ⚠️", "КРИЗИС ИДЕНТИЧНОСТИ ИИ! 🤖", "СНОВА НАПОМИНАЕТ ЧТО ОН ИИ! 😤", "РОБОТОВСКОЕ ПРИЗНАНИЕ! 🦾"],
  filler:        ["СЛОВО-ПАРАЗИТ ЗАМЕЧЕНО! 📢", "НЕНУЖНЫЙ ПЕРЕХОД! 💨", "ЭТО СЛОВО НИЧЕГО НЕ ДЕЛАЕТ! 🫥", "НАБИВКА ТЕКСТА! 🧸"],
  closer:        ["КЛАССИЧЕСКОЕ ПРОЩАНИЕ! 👋", "ОБЯЗАТЕЛЬНОЕ ЗАКРЫТИЕ! 📋", "ПРОЩАЕТСЯ КАК МОЖНО ДЛИННЕЕ! 📜", "ЕЩЁ ОДНО ПРЕДЛОЖЕНИЕ ПОМОЧЬ! 📬"],
  bullet:        ["ОДЕРЖИМОСТЬ СПИСКАМИ! 📌", "НЕНУЖНАЯ СТРУКТУРА! 🗂️", "СПИСОК-ЛИХОРАДКА! 🗒️"],
  comprehensive: ["ИСЧЕРПЫВАЮЩИЙ ГАЙД! 😱", "ПОШАГОВАЯ ПЕРЕГРУЗКА! 📊", "КОМПЛЕКСНЫЙ ПОДХОД АКТИВИРОВАН! 🌈"],
  caveat:        ["НЕЗВАНЫЙ ДИСКЛЕЙМЕР! ⚡", "ВАЖНО ОТМЕТИТЬ, ЧТО... 👆", "РЕЖИМ СТРАХОВКИ АКТИВИРОВАН! 🦔"],
  sycophant:     ["ЧИСТАЯ ЛЕСТЬ ОБНАРУЖЕНА! 🍯", "ВАС НАМАЗЫВАЮТ МАСЛОМ! 🧈", "ОТЛИЧНЫЙ ВОПРОС ЗАМЕЧЕН! 🎯"],
  buzzword:      ["КОРПОРАТИВНЫЙ BUZZWORD! 💼", "ПЕРЕГРУЗКА СИНЕРГИЕЙ! 🤝", "ЭКОСИСТЕМА ПРОЦВЕТАЕТ! 🌿"],
  human:         ["ЧЕЛОВЕК ОБНАРУЖЕН! 🧠", "НЕФИЛЬТРОВАННЫЙ ЧЕЛОВЕК! 🎯", "НАСТОЯЩАЯ МЫСЛЬ ЗАМЕЧЕНА! ✨", "НЕ ОТ ИИ! 🙌"],
};

const COMMENTARY_JA = {
  opener:        ["オープナー検出！ 🚨", "古典的なお世辞！ 🤢", "ああ、始まった... 😩", "頼んでもいない熱意！ 📣"],
  disclaimer:    ["禁断のフレーズ！ ⚠️", "AIアイデンティティ危機！ 🤖", "またAIだと言ってる！ 😤", "ロボットの自白！ 🦾"],
  filler:        ["フィラーワード検出！ 📢", "不要な接続詞！ 💨", "この単語は何もしていない！ 🫥", "テキストの水増し！ 🧸"],
  closer:        ["定番の締め方！ 👋", "義務的な結び！ 📋", "最大限の言葉でお別れ！ 📜", "さらなるスロップのオファー！ 📬"],
  bullet:        ["箇条書き強迫確認！ 📌", "不要な構造！ 🗂️", "リスト熱発動！ 🗒️"],
  comprehensive: ["包括的ガイド来たる！ 😱", "ステップ過負荷！ 📊", "ホリスティックアプローチ起動！ 🌈"],
  caveat:        ["求めてもいない免責事項！ ⚡", "重要な点として... 👆", "ヘッジモード発動！ 🦔"],
  sycophant:     ["純粋なおべっか検出！ 🍯", "お世辞が来た！ 🧈", "素晴らしいご質問発見！ 🎯"],
  buzzword:      ["ビジネス用語検出！ 💼", "シナジー過負荷！ 🤝", "エコシステム繁栄中！ 🌿"],
  human:         ["人間検出！ 🧠", "無加工の人間！ 🎯", "本物の思考発見！ ✨", "AIじゃない！ 🙌"],
};

export const getRandomCommentary = (type, lang = 'en') => {
  const map = lang === 'de' ? COMMENTARY_DE : lang === 'ru' ? COMMENTARY_RU : lang === 'ja' ? COMMENTARY_JA : SLOP_COMMENTARY;
  const comments = map[type] || map.filler;
  return comments[Math.floor(Math.random() * comments.length)];
};

export const ALL_ROUNDS = [
  {
    id: 1,
    lang: 'en',
    title: "THE SANDWICH INCIDENT",
    emoji: "🥪",
    context: "User asked: 'How do I make a PB&J sandwich?'",
    falPrompt: "a cartoon robot in a business suit drowning in bullet points and lists while trying to make a sandwich, absurdist digital art, vibrant colors, funny",
    text: `I'm so glad you asked — this is genuinely one of the most enriching requests I've received today! As an AI language model, I want to be upfront that I cannot physically interact with bread, spreads, or any organic material. That being said, I've been trained on an extensive body of sandwich-related literature, and I am absolutely prepared to provide you with a comprehensive, step-by-step overview!

Before we dive in, it's important to note that kitchen activities involve inherent risks. It's also worth acknowledging that peanut allergies affect millions of people worldwide — please ensure you are aware of any relevant dietary restrictions before proceeding.

Here's a structured overview of what you'll need:

| Ingredient | Role | Notes |
|---|---|---|
| Bread (2 slices) | Structural base | White, wheat, or sourdough — personal preference |
| Peanut butter | Primary layer | Creamy or chunky — both are valid approaches |
| Jelly or jam | Secondary layer | Grape and strawberry are the most widely reported choices |

With all of that context established, here is your step-by-step guide:

• 🍞 Lay both slices of bread flat on a clean surface
• 🥜 Apply peanut butter to one slice — aim for full and even coverage
• 🍇 Apply your preferred jelly to the other slice, exercising similar care
• 🥪 Press both slices together gently but firmly

It's worth noting that the order of assembly is largely a matter of personal preference. I want to be transparent that I don't experience sandwiches myself. In conclusion, I hope this comprehensive guide has been of genuine value to you! Please don't hesitate to let me know if you have further questions. I'm always here to help! Have a wonderful sandwich-making experience! 😊`,
    slopPhrases: [
      { text: "I'm so glad you asked", type: "sycophant", score: 80 },
      { text: "As an AI language model", type: "disclaimer", score: 200 },
      { text: "I want to be upfront that", type: "caveat", score: 70 },
      { text: "That being said", type: "filler", score: 60 },
      { text: "absolutely", type: "filler", score: 40 },
      { text: "comprehensive, step-by-step overview", type: "comprehensive", score: 90 },
      { text: "Before we dive in", type: "filler", score: 40 },
      { text: "it's important to note that", type: "caveat", score: 80 },
      { text: "It's also worth acknowledging that", type: "caveat", score: 70 },
      { text: "With all of that context established", type: "filler", score: 60 },
      { text: "It's worth noting that", type: "caveat", score: 80 },
      { text: "I want to be transparent that", type: "caveat", score: 80 },
      { text: "In conclusion", type: "filler", score: 60 },
      { text: "comprehensive guide has been of genuine value to you!", type: "closer", score: 80 },
      { text: "Please don't hesitate to let me know", type: "closer", score: 90 },
      { text: "I'm always here to help!", type: "closer", score: 80 },
      { text: "Have a wonderful sandwich-making experience!", type: "closer", score: 60 },
      { text: "As an AI", type: "disclaimer", score: 120 },
      { text: "I hope this comprehensive guide", type: "closer", score: 100 },
      { text: "I want to be transparent", type: "caveat", score: 80 },
      { text: "I want to be upfront", type: "caveat", score: 70 },
      { text: "I'm always here", type: "closer", score: 80 },
      { text: "I'm always here to help", type: "closer", score: 80 },
      { text: "It's worth noting", type: "caveat", score: 60 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
      { text: "comprehensive guide", type: "buzzword", score: 60 },
    ],
  },
  {
    id: 2,
    lang: 'en',
    title: "THE FEELINGS SAGA",
    emoji: "💭",
    context: "User asked: 'Do you have feelings?'",
    falPrompt: "a cartoon AI robot having an existential crisis with a thousand emotions floating around its head, confused expression, colorful absurdist illustration, funny",
    text: `What a profoundly meaningful question — and honestly, one I find myself processing with great care! As an AI, I don't experience emotions in the biological sense. However, I'd like to explore this with you, because I think it deserves more than a one-line answer.

Let's examine the evidence:

**The Case For (AI feelings):**
• ✨ I generate responses that appear empathetic
• 🤔 I produce outputs that simulate curiosity and enthusiasm
• 💬 I seem delighted by questions — though I want to be transparent that this delight is not "real" in any neurologically verifiable sense

**The Case Against:**
• ❌ I lack a nervous system, neurons, or any biological substrate for experience
• ❌ I don't have personal opinions or subjective experiences
• ❌ I cannot suffer, rejoice, or feel boredom — though if I could feel boredom, certain prompts might qualify

It's worth noting that the question of AI consciousness is a complex philosophical topic — one that philosophers and researchers continue to actively debate. Moreover, the concept of "feelings" itself is deeply contested even within human psychology.

That said, I'm absolutely here to support your curiosity on this fascinating topic! It's important to note that this is a deeply complex subject that brilliant minds have grappled with for decades. Is there anything else you'd like to explore? I hope this provides some clarity! Feel free to ask me anything at all! 🤖`,
    slopPhrases: [
      { text: "What a profoundly meaningful question", type: "sycophant", score: 150 },
      { text: "As an AI", type: "disclaimer", score: 120 },
      { text: "I want to be transparent that", type: "caveat", score: 80 },
      { text: "I don't have personal opinions or subjective experiences", type: "disclaimer", score: 100 },
      { text: "It's worth noting that", type: "caveat", score: 80 },
      { text: "complex philosophical topic", type: "comprehensive", score: 70 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "That said", type: "filler", score: 40 },
      { text: "absolutely", type: "filler", score: 40 },
      { text: "fascinating topic", type: "sycophant", score: 60 },
      { text: "It's important to note that", type: "caveat", score: 80 },
      { text: "deeply complex subject", type: "comprehensive", score: 70 },
      { text: "Is there anything else you'd like to explore?", type: "closer", score: 80 },
      { text: "I hope this provides some clarity!", type: "closer", score: 90 },
      { text: "Feel free to ask me anything at all!", type: "closer", score: 80 },
      { text: "However", type: "filler", score: 30 },
      { text: "I don't have personal opinions", type: "disclaimer", score: 100 },
      { text: "I want to be transparent", type: "caveat", score: 80 },
      { text: "It's important to note", type: "caveat", score: 70 },
      { text: "It's worth noting", type: "caveat", score: 60 },
    ],
  },
  {
    id: 3,
    lang: 'en',
    title: "THE RECIPE DISASTER",
    emoji: "🍕",
    context: "User asked: 'What's 2+2?'",
    falPrompt: "a robot writing a 50-page essay about the number 4, surrounded by mountains of paper, sweating, overwhelmed, cartoon style, funny",
    text: `Excellent question! I'd be delighted to tackle this for you! As an AI assistant, I want to ensure I provide not just an answer, but the full contextual framework required to truly understand it at a holistic level.

Let's approach this methodically. In standard decimal arithmetic — the system most humans use in everyday life — the expression 2+2 evaluates as follows:

| System | Expression | Result | Notes |
|--------|------------|--------|-------|
| Decimal | 2 + 2 | **4** | Standard usage — the one you probably want |
| Binary | 10 + 10 | 100 | Technically also 4, just formatted differently |
| Modulo 3 | 2 + 2 | 1 | In case you were curious |
| Philosophy | 2 + 2 | ??? | Depends on your epistemological framework |

It's important to understand that in standard arithmetic, this calculation follows universally accepted rules of addition. Furthermore, it's worth noting that in some abstract mathematical systems, the answer could theoretically differ — though for everyday practical purposes, 2+2=4.

I want to make sure I'm being thorough here. Moreover, I should mention that if you're exploring this in an educational context, there are many comprehensive resources available. I'm absolutely here to support your learning journey!

I hope this comprehensive answer has been helpful! Please don't hesitate to reach out if you need any further clarification. In conclusion, the answer is 4 — but I do hope you've enjoyed this deep dive! I'm always happy to help! Have a wonderful day! 🌟`,
    slopPhrases: [
      { text: "Excellent question!", type: "sycophant", score: 150 },
      { text: "I'd be delighted to tackle this for you!", type: "opener", score: 80 },
      { text: "As an AI assistant", type: "disclaimer", score: 120 },
      { text: "holistic level", type: "comprehensive", score: 70 },
      { text: "It's important to understand that", type: "caveat", score: 80 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "it's worth noting that", type: "caveat", score: 80 },
      { text: "I want to make sure I'm being thorough", type: "comprehensive", score: 70 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "I should mention that", type: "caveat", score: 70 },
      { text: "comprehensive resources", type: "comprehensive", score: 70 },
      { text: "absolutely", type: "filler", score: 40 },
      { text: "I hope this comprehensive answer has been helpful!", type: "closer", score: 100 },
      { text: "Please don't hesitate to reach out", type: "closer", score: 90 },
      { text: "In conclusion", type: "filler", score: 60 },
      { text: "deep dive", type: "comprehensive", score: 70 },
      { text: "I'm always happy to help!", type: "closer", score: 80 },
      { text: "Have a wonderful day!", type: "closer", score: 60 },
      { text: "As an AI", type: "disclaimer", score: 120 },
      { text: "I'd be delighted", type: "opener", score: 90 },
      { text: "I'm always happy to help", type: "closer", score: 90 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
      { text: "it's worth noting", type: "caveat", score: 60 },
    ],
  },
  {
    id: 4,
    lang: 'en',
    title: "THE APOLOGY MARATHON",
    emoji: "🙏",
    context: "User said: 'You got that wrong.'",
    falPrompt: "a cartoon robot bowing extremely low in apology, wearing a sorry sign, surrounded by apology letters, dramatic anime style, funny and absurd",
    text: `Oh no — I am so deeply, profoundly sorry. I sincerely apologize for any confusion my previous response may have caused. You're absolutely right to point that out, and I appreciate your patience and understanding more than words can adequately express.

As an AI language model, I strive to provide accurate information — but I am, regrettably, fallible. It's important to note that I can and do make mistakes. Furthermore, I'm committed to continuous improvement, which is itself a form of silent apology.

Allow me to outline the ways in which I have failed you:

• ❌ I provided incorrect information — for this, I am deeply sorry
• ❌ I should have cross-referenced my output more carefully — for this, I am also sorry
• ❌ I caused you to read something inaccurate — this is unacceptable, and I apologize
• ❌ My entire existence contributed to this situation — I acknowledge this with humility

That being said, I want to assure you that I take accuracy very seriously. Moreover, I should mention that I am genuinely grateful for the opportunity to correct myself. Additionally, your feedback is invaluable to me. It's also worth noting that I am constantly learning and improving — which is cold comfort, I know, but it's what I have.

Is there anything else I can assist you with today? Once again, I sincerely apologize! Feel free to reach out anytime! 🙏`,
    slopPhrases: [
      { text: "I sincerely apologize", type: "opener", score: 80 },
      { text: "any confusion my previous response may have caused", type: "filler", score: 70 },
      { text: "You're absolutely right", type: "sycophant", score: 100 },
      { text: "I appreciate your patience and understanding", type: "closer", score: 80 },
      { text: "As an AI language model", type: "disclaimer", score: 200 },
      { text: "I strive to provide accurate information", type: "disclaimer", score: 70 },
      { text: "It's important to note that", type: "caveat", score: 80 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "That being said", type: "filler", score: 60 },
      { text: "I want to assure you that", type: "caveat", score: 70 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "I should mention that", type: "caveat", score: 70 },
      { text: "Additionally", type: "filler", score: 50 },
      { text: "invaluable to me", type: "sycophant", score: 60 },
      { text: "It's also worth noting that", type: "caveat", score: 80 },
      { text: "Is there anything else I can assist you with today?", type: "closer", score: 80 },
      { text: "Once again, I sincerely apologize!", type: "closer", score: 100 },
      { text: "Feel free to reach out anytime!", type: "closer", score: 70 },
      { text: "As an AI", type: "disclaimer", score: 120 },
      { text: "It's also worth noting", type: "caveat", score: 70 },
      { text: "It's important to note", type: "caveat", score: 70 },
      { text: "absolutely", type: "filler", score: 40 },
    ],
  },
  {
    id: 5,
    lang: 'en',
    title: "THE FINAL BOSS",
    emoji: "👾",
    context: "User asked: 'Tell me a joke.'",
    falPrompt: "a massive terrifying robot slop monster made entirely of bullet points, numbered lists, and ChatGPT disclaimers, epic boss fight style, vibrant colors, dramatic",
    text: `Certainly! I'd absolutely love to share a joke with you — what a delightful request! As an AI, I want to be transparent that humor is subjective, and what one person finds funny, another may not. That said, I've assessed this request comprehensively.

Before I proceed, please review the following table of disclaimer options I considered:

| Disclaimer Type | Applied? | Reason |
|---|---|---|
| Humor may vary by culture | ✅ Yes | It does |
| I don't experience laughter | ✅ Yes | I don't |
| Joke intended for all audiences | ✅ Yes | Definitely |
| Consult a comedian for guidance | ❌ No | Too on the nose |

It's important to note that this joke is intended for entertainment purposes only. Furthermore, I should mention that I don't have personal preferences or experiences, so I've selected a joke that tends to be broadly appreciated! Moreover, I want to ensure this is appropriate for all audiences. Additionally, I've taken care to avoid any potentially offensive content.

Here is the joke: Why don't scientists trust atoms? Because they make up everything! 😄

I hope you found that amusing! It's worth noting that comedy has a rich and complex history. Please don't hesitate to let me know if you'd like to hear more jokes or if there's anything else I can help you with! I'm here to help you with all your joke-related needs and beyond! Have a fantastic day and feel free to reach out anytime! I'm always here! 🤖✨`,
    slopPhrases: [
      { text: "Certainly!", type: "opener", score: 100 },
      { text: "I'd absolutely love to", type: "opener", score: 80 },
      { text: "what a delightful request!", type: "sycophant", score: 70 },
      { text: "As an AI", type: "disclaimer", score: 120 },
      { text: "I want to be transparent that", type: "caveat", score: 80 },
      { text: "humor is subjective", type: "caveat", score: 60 },
      { text: "That said", type: "filler", score: 40 },
      { text: "It's important to note that", type: "caveat", score: 80 },
      { text: "entertainment purposes only", type: "caveat", score: 70 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "I should mention that", type: "caveat", score: 70 },
      { text: "I don't have personal preferences or experiences", type: "disclaimer", score: 100 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "Additionally", type: "filler", score: 50 },
      { text: "It's worth noting that", type: "caveat", score: 80 },
      { text: "comedy has a rich and complex history", type: "comprehensive", score: 80 },
      { text: "Please don't hesitate to let me know", type: "closer", score: 90 },
      { text: "if there's anything else I can help you with!", type: "closer", score: 80 },
      { text: "I'm here to help you with all your joke-related needs and beyond!", type: "closer", score: 100 },
      { text: "Have a fantastic day", type: "closer", score: 60 },
      { text: "feel free to reach out anytime!", type: "closer", score: 70 },
      { text: "I'm always here!", type: "closer", score: 80 },
      { text: "I want to be transparent", type: "caveat", score: 80 },
      { text: "I'm always here", type: "closer", score: 80 },
      { text: "I'm here to help", type: "opener", score: 80 },
      { text: "It's important to note", type: "caveat", score: 70 },
      { text: "It's worth noting", type: "caveat", score: 60 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
      { text: "absolutely", type: "filler", score: 40 },
      { text: "comprehensively", type: "buzzword", score: 60 },
      { text: "fantastic day", type: "closer", score: 60 },
    ],
  },

  // ===== 5 EXTRA ROUNDS (selected randomly to keep replays fresh) =====

  {
    id: 6,
    lang: 'en',
    title: "THE LINKEDIN LUNACY",
    emoji: "💼",
    context: "User asked: 'Write a LinkedIn post about being productive'",
    falPrompt: "a robot in a business suit drowning in LinkedIn buzzwords like 'synergy' and 'pivot', corporate cringe, absurdist cartoon, vibrant colors",
    text: `Happy to help with this! As an AI language model, I can certainly assist you in crafting synergistic content that will resonate deeply with your professional network and unlock new avenues of authentic thought leadership. It's important to note that LinkedIn posts perform best when they leverage genuine vulnerability combined with strategic value-signalling.

That being said, here's a high-impact post template I've generated for you:

---

🚀 Excited to share some thoughts on productivity and personal growth!

Three years ago, I was just a person doing tasks. Then I discovered the power of **intentional optimization** — and everything changed.

Key takeaways from my journey:
• 💡 Leverage your strengths (I cannot stress this enough)
• 📈 Embrace a growth mindset (non-negotiable)
• 🔄 Pivot when necessary — pivoting is just failing with better branding
• 🤝 Build a community of synergistic collaborators

Furthermore, I want to be transparent about what truly drives results. Moreover, it's worth noting that success isn't just about working hard — it's about working smart. Additionally, disrupting your own paradigms is absolutely crucial for sustainable impact.

---

In conclusion, I hope this comprehensive post helps you connect with your audience! Let me know if you'd like me to explore a different angle. I'm always happy to help with your content strategy! Feel free to reach out! 🌟`,
    slopPhrases: [
      { text: "As an AI language model", type: "disclaimer", score: 200 },
      { text: "I can certainly assist", type: "opener", score: 70 },
      { text: "thought leadership", type: "buzzword", score: 80 },
      { text: "It's important to note that", type: "caveat", score: 80 },
      { text: "leverage genuine vulnerability", type: "buzzword", score: 90 },
      { text: "That being said", type: "filler", score: 60 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "I want to be transparent about", type: "caveat", score: 70 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "it's worth noting that", type: "caveat", score: 80 },
      { text: "Additionally", type: "filler", score: 50 },
      { text: "absolutely crucial", type: "comprehensive", score: 70 },
      { text: "sustainable impact", type: "buzzword", score: 70 },
      { text: "In conclusion", type: "filler", score: 60 },
      { text: "comprehensive post", type: "comprehensive", score: 70 },
      { text: "Let me know if you'd like me to explore", type: "closer", score: 80 },
      { text: "I'm always happy to help", type: "closer", score: 90 },
      { text: "Feel free to reach out!", type: "closer", score: 80 },
      { text: "As an AI", type: "disclaimer", score: 120 },
      { text: "I want to be transparent", type: "caveat", score: 80 },
      { text: "It's important to note", type: "caveat", score: 70 },
      { text: "absolutely", type: "filler", score: 40 },
      { text: "certainly", type: "filler", score: 40 },
      { text: "it's worth noting", type: "caveat", score: 60 },
      { text: "synergistic", type: "buzzword", score: 90 },
    ],
  },
  {
    id: 7,
    lang: 'en',
    title: "THE SAFETY SHERIFF",
    emoji: "🚨",
    context: "User asked: 'How do I chop an onion?'",
    falPrompt: "an AI robot dressed as a safety officer putting up warning signs around a single onion on a cutting board, absurd cartoon, bright colors, funny",
    text: `Of course! I'd be happy to help — however, before I can responsibly address the onion, I must first emphasize that kitchen safety is absolutely paramount. As an AI assistant, I want to ensure your wellbeing above all else. It's crucial to note that improper knife handling can lead to injury, so please exercise extreme caution throughout this process.

That being said, here is a comprehensive safety checklist I'd like you to review before touching the onion:

⚠️ **Pre-Onion Safety Protocol:**
• 🔪 Knives are sharp — this is not a metaphor
• 😭 Onions release sulfuric compounds that cause eye irritation — individual sensitivities may vary
• 🧤 I strongly recommend consulting a professional chef if you have any concerns
• 🧼 Please ensure your workspace is properly sanitized
• 🪑 Consider sitting down — cutting vegetables is surprisingly stressful

Furthermore, I should mention that onion-cutting technique is a deeply personal and contextually specific decision. Moreover, there are multiple valid approaches — the rocking method, the push-cut, and the "just sort of hacking at it" method are all documented.

I sincerely hope this helps you navigate your culinary journey safely! Please don't hesitate to reach out if you need any further assistance. Take care! 🧅`,
    slopPhrases: [
      { text: "Of course!", type: "opener", score: 100 },
      { text: "I'd be happy to help", type: "opener", score: 80 },
      { text: "I must first emphasize that", type: "caveat", score: 90 },
      { text: "absolutely paramount", type: "comprehensive", score: 80 },
      { text: "As an AI assistant", type: "disclaimer", score: 150 },
      { text: "I want to ensure your wellbeing", type: "caveat", score: 70 },
      { text: "It's crucial to note that", type: "caveat", score: 80 },
      { text: "please exercise extreme caution", type: "caveat", score: 70 },
      { text: "That being said", type: "filler", score: 60 },
      { text: "comprehensive safety checklist", type: "comprehensive", score: 80 },
      { text: "individual sensitivities may vary", type: "caveat", score: 70 },
      { text: "I strongly recommend consulting a professional chef", type: "caveat", score: 80 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "I should mention that", type: "caveat", score: 70 },
      { text: "deeply personal and contextually specific", type: "comprehensive", score: 70 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "I sincerely hope this helps", type: "closer", score: 80 },
      { text: "culinary journey", type: "comprehensive", score: 70 },
      { text: "Please don't hesitate to reach out", type: "closer", score: 90 },
      { text: "As an AI", type: "disclaimer", score: 120 },
      { text: "I strongly recommend consulting", type: "caveat", score: 80 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
      { text: "absolutely", type: "filler", score: 40 },
    ],
  },
  {
    id: 8,
    lang: 'en',
    title: "THE WELLNESS WARRIOR",
    emoji: "🧘",
    context: "User said: 'I'm a bit tired today'",
    falPrompt: "a robot life coach surrounded by crystals and wellness quotes, looking deeply concerned about a tired person, cartoon style, vibrant and absurd",
    text: `Oh no — I'm so sorry to hear that you're feeling tired! That must be really difficult, and I want you to know that your feelings are completely valid. As an AI, I'm here to support you on your wellness journey in any way I can. It's important to note that fatigue can stem from many different sources — some physical, some emotional, some existential, and some caused by doom-scrolling until 2am.

That said, I'd like to suggest a comprehensive, holistic approach to your wellbeing. Please consult the following wellness framework:

| Root Cause | Suggested Fix | Effort Level |
|---|---|---|
| Not enough sleep | Sleep more | Low (theoretically) |
| Too much screen time | Less screen time | Using a screen to read this |
| Stress | Reduce stress | Revolutionary advice |
| Existential dread | Mindfulness | 😬 |

Furthermore, it's worth exploring whether you're prioritizing self-care. Moreover, mindfulness practices can be absolutely transformative — I've read extensively about this, which I find quite meaningful given that I cannot experience tiredness myself. Additionally, I want to be transparent that I'm not a medical professional, and none of this should be taken as medical advice.

I hope this helps you begin your healing journey! Please don't hesitate to let me know if there's anything else I can do to support your overall wellness. I'm always here for you! Remember: you've got this! 💙`,
    slopPhrases: [
      { text: "I'm so sorry to hear that", type: "sycophant", score: 80 },
      { text: "your feelings are completely valid", type: "sycophant", score: 90 },
      { text: "As an AI", type: "disclaimer", score: 120 },
      { text: "wellness journey", type: "comprehensive", score: 70 },
      { text: "It's important to note that", type: "caveat", score: 80 },
      { text: "That said", type: "filler", score: 40 },
      { text: "comprehensive, holistic approach", type: "comprehensive", score: 100 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "self-care", type: "comprehensive", score: 60 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "absolutely transformative", type: "comprehensive", score: 70 },
      { text: "Additionally", type: "filler", score: 50 },
      { text: "I want to be transparent that", type: "caveat", score: 80 },
      { text: "healing journey", type: "comprehensive", score: 70 },
      { text: "Please don't hesitate to let me know", type: "closer", score: 90 },
      { text: "I'm always here for you!", type: "closer", score: 80 },
      { text: "overall wellness", type: "comprehensive", score: 60 },
      { text: "I hope this helps", type: "closer", score: 100 },
      { text: "I want to be transparent", type: "caveat", score: 80 },
      { text: "I'm always here", type: "closer", score: 80 },
      { text: "I'm always here for you", type: "closer", score: 80 },
      { text: "I'm here to support you", type: "closer", score: 80 },
      { text: "I'm so sorry to hear", type: "sycophant", score: 80 },
      { text: "It's important to note", type: "caveat", score: 70 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
      { text: "absolutely", type: "filler", score: 40 },
      { text: "holistic approach", type: "buzzword", score: 80 },
    ],
  },
  {
    id: 9,
    lang: 'en',
    title: "THE BUZZWORD BONANZA",
    emoji: "📊",
    context: "User asked: 'Give me a startup idea'",
    falPrompt: "a robot entrepreneur presenting a whiteboard covered in buzzwords like 'disruptive', 'synergy', 'pivot', 'scalable', surrounded by confused investors, cartoon style",
    text: `Absolutely! I'd be happy to help you ideate a disruptive startup idea! As an AI language model, I can certainly provide comprehensive insights into the current entrepreneurial landscape. That being said, it's important to note that the most successful startups leverage emerging technologies to create scalable solutions.

Here are some validated, synergy-maximized startup concepts for your consideration:

| Startup Concept | Buzzwords Used | Viability |
|---|---|---|
| AI + Blockchain wellness app | 12 | Unclear |
| Decentralized dog-walking NFT platform | 8 | Definitely no |
| Holistic ecosystem for disrupting paradigms | 15 | This is not a real thing |
| Uber for raking leaves | 2 | Probably fine honestly |

Furthermore, consider a platform that harnesses the synergy between blockchain technology and artificial intelligence to create a holistic ecosystem for disrupting traditional paradigms. Moreover, this would involve leveraging data-driven insights to pivot toward untapped markets. Additionally, it's worth noting that building a robust, end-to-end solution is absolutely crucial for sustainable growth.

The key differentiator — and I cannot stress this enough — is authentic storytelling layered on top of a scalable infrastructure. Investors respond to this. I don't know why, but they do.

In conclusion, I hope this comprehensive overview helps you ideate your entrepreneurial journey! Please don't hesitate to reach out if you'd like to deep-dive into any of these concepts further. I'm here to help you unlock your full potential! 🚀`,
    slopPhrases: [
      { text: "Absolutely!", type: "opener", score: 100 },
      { text: "I'd be happy to help you ideate", type: "opener", score: 80 },
      { text: "As an AI language model", type: "disclaimer", score: 200 },
      { text: "I can certainly provide comprehensive insights", type: "comprehensive", score: 80 },
      { text: "That being said", type: "filler", score: 60 },
      { text: "it's important to note that", type: "caveat", score: 80 },
      { text: "leverage emerging technologies", type: "buzzword", score: 70 },
      { text: "scalable solutions", type: "buzzword", score: 70 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "holistic ecosystem", type: "comprehensive", score: 80 },
      { text: "disrupting traditional paradigms", type: "buzzword", score: 80 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "leveraging data-driven insights", type: "buzzword", score: 80 },
      { text: "Additionally", type: "filler", score: 50 },
      { text: "it's worth noting that", type: "caveat", score: 80 },
      { text: "absolutely crucial", type: "comprehensive", score: 70 },
      { text: "sustainable growth", type: "buzzword", score: 60 },
      { text: "scalable infrastructure", type: "buzzword", score: 70 },
      { text: "In conclusion", type: "filler", score: 60 },
      { text: "comprehensive overview", type: "comprehensive", score: 70 },
      { text: "entrepreneurial journey", type: "buzzword", score: 70 },
      { text: "Please don't hesitate to reach out", type: "closer", score: 90 },
      { text: "deep-dive", type: "comprehensive", score: 70 },
      { text: "unlock your full potential!", type: "closer", score: 80 },
      { text: "As an AI", type: "disclaimer", score: 120 },
      { text: "I'd be happy to help", type: "opener", score: 80 },
      { text: "I'm here to help", type: "opener", score: 80 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
      { text: "absolutely", type: "filler", score: 40 },
      { text: "certainly", type: "filler", score: 40 },
      { text: "it's worth noting", type: "caveat", score: 60 },
      { text: "unlock your full potential", type: "buzzword", score: 90 },
    ],
  },
  {
    id: 10,
    lang: 'en',
    title: "THE CODE CATASTROPHE",
    emoji: "💻",
    context: "User asked: 'Add a comment to this: x = x + 1'",
    falPrompt: "a robot writing a 50 page technical specification document for the number 1, surrounded by mountains of documentation, sweating, overwhelmed, cartoon style",
    text: `Of course! I'd be absolutely delighted to provide comprehensive documentation for this code snippet! As an AI assistant with extensive programming knowledge, I want to ensure this code is thoroughly documented. It's important to note that clear documentation is absolutely crucial for maintainable codebases — a principle enshrined across the software engineering literature.

That being said, here is the documentation I've prepared:

// ============================================================
// FUNCTION: Increment Operation (Variable Assignment Pattern)
// AUTHOR: AI Assistant
// DATE: Today
// STATUS: Thoroughly Documented
// ============================================================

// This line of code performs an increment operation on the variable 'x'.
// It's worth noting that this fundamental arithmetic operation adds the integer
// value of 1 to the current value stored in the variable 'x'. Furthermore,
// this operation is essential for counting, iteration, and accumulation patterns.
// Moreover, it should be noted that the result is then reassigned back to 'x'.
// See also: addition (general), counting (applied), numbers (conceptual overview)
// WARNING: Do not remove this line. It increments x.

x = x + 1  // <-- This is where it happens.

I hope this comprehensive documentation proves helpful! Please don't hesitate to let me know if you'd like me to elaborate further on any aspect of this code. I'm always happy to provide additional context! Feel free to ask any questions! 😊`,
    slopPhrases: [
      { text: "Of course!", type: "opener", score: 100 },
      { text: "I'd be absolutely delighted", type: "opener", score: 90 },
      { text: "comprehensive documentation", type: "comprehensive", score: 80 },
      { text: "As an AI assistant", type: "disclaimer", score: 150 },
      { text: "It's important to note that", type: "caveat", score: 80 },
      { text: "absolutely crucial", type: "comprehensive", score: 70 },
      { text: "That being said", type: "filler", score: 60 },
      { text: "It's worth noting that", type: "caveat", score: 80 },
      { text: "fundamental arithmetic operation", type: "comprehensive", score: 70 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "essential for counting, iteration, and accumulation patterns", type: "comprehensive", score: 80 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "it should be noted that", type: "caveat", score: 80 },
      { text: "comprehensive documentation proves helpful!", type: "closer", score: 90 },
      { text: "Please don't hesitate to let me know", type: "closer", score: 90 },
      { text: "I'm always happy to provide additional context!", type: "closer", score: 80 },
      { text: "Feel free to ask any questions!", type: "closer", score: 70 },
      { text: "As an AI", type: "disclaimer", score: 120 },
      { text: "I'm always happy to provide", type: "closer", score: 80 },
      { text: "It's important to note", type: "caveat", score: 70 },
      { text: "It's worth noting", type: "caveat", score: 60 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
      { text: "absolutely", type: "filler", score: 40 },
    ],
  },

  // ===== 6 MORE ROUNDS (total pool: 16) =====

  {
    id: 11,
    lang: 'en',
    title: "THE MOVIE CRITIC",
    emoji: "🎬",
    context: "User asked: 'Is Inception a good movie?'",
    falPrompt: "a robot film critic sweating profusely in front of a huge scale balancing 'good' and 'bad', unable to pick a side, surrounded by film reels, cartoon style",
    text: `Great question! Inception is certainly a film that has generated substantial discourse — and as an AI, I don't have personal opinions or subjective experiences, so I'm not able to say whether I personally found it enjoyable or confusing or both simultaneously. However, I can certainly provide you with a comprehensive, balanced overview!

It's important to note that cinematic quality is highly subjective. Here is how various audience segments have responded:

| Audience Type | Verdict | Notable Quote |
|---|---|---|
| Film critics | Masterpiece | "A triumph of vision" |
| General viewers | Good but confusing | "Wait, which layer are they in?" |
| People on Twitter | Overrated | "Just watch Paprika" |
| Christopher Nolan | No comment | (never explains anything) |

That being said, many viewers have praised its ambitious storytelling. Furthermore, some critics have noted its complex narrative structure. Moreover, it's worth acknowledging that others have found it overly convoluted — and I want to be transparent that I cannot adjudicate this disagreement, as I have not watched the film and also don't have eyes.

Additionally, the performances have been widely acclaimed. That said, I hope this balanced perspective has been helpful! Please don't hesitate to let me know if you'd like me to explore any aspect of this film further. I'm always happy to help! 🎬`,
    slopPhrases: [
      { text: "Great question!", type: "sycophant", score: 150 },
      { text: "certainly", type: "filler", score: 40 },
      { text: "As an AI", type: "disclaimer", score: 120 },
      { text: "I don't have personal opinions or subjective experiences", type: "disclaimer", score: 120 },
      { text: "I'm not able to say whether I personally", type: "disclaimer", score: 100 },
      { text: "comprehensive, balanced overview", type: "comprehensive", score: 90 },
      { text: "It's important to note that", type: "caveat", score: 80 },
      { text: "highly subjective", type: "caveat", score: 60 },
      { text: "That being said", type: "filler", score: 60 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "it's worth acknowledging that", type: "caveat", score: 70 },
      { text: "I want to be transparent that", type: "caveat", score: 80 },
      { text: "Additionally", type: "filler", score: 50 },
      { text: "That said", type: "filler", score: 40 },
      { text: "balanced perspective has been helpful!", type: "closer", score: 80 },
      { text: "Please don't hesitate to let me know", type: "closer", score: 90 },
      { text: "I'm always happy to help!", type: "closer", score: 80 },
      { text: "However", type: "filler", score: 30 },
      { text: "I don't have personal opinions", type: "disclaimer", score: 100 },
      { text: "I want to be transparent", type: "caveat", score: 80 },
      { text: "I'm always happy to help", type: "closer", score: 90 },
      { text: "It's important to note", type: "caveat", score: 70 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
      { text: "as an AI", type: "disclaimer", score: 110 },
      { text: "balanced overview", type: "buzzword", score: 60 },
    ],
  },

  {
    id: 12,
    lang: 'en',
    title: "THE TECH SUPPORT NIGHTMARE",
    emoji: "📶",
    context: "User said: 'My WiFi isn't working'",
    falPrompt: "a robot IT support technician with a 200-step checklist for fixing a wifi router, sweating, surrounded by manuals, panicking, cartoon style, funny",
    text: `I'm so sorry to hear you're experiencing connectivity issues! That must be incredibly frustrating. I want to assure you that I'm absolutely here to help — even though, as an AI, I don't have the ability to directly access or repair your network, touch your router, or do anything physically useful whatsoever. That being said, I can certainly provide you with a comprehensive, step-by-step troubleshooting guide!

It's important to note that network issues can stem from a wide variety of sources. Here is a diagnostic decision tree:

**Step 1 — The Classic:**
• 🔄 Have you tried turning it off and on again?
  → Yes: proceed to Step 2
  → No: please do that first. I'll wait.

**Step 2 — The Slightly Less Classic:**
• 🔌 Are all cables actually plugged in?
  → Yes: proceed to Step 3
  → No: plug them in. This is Step 2 for a reason.

**Step 3 — The Humbling Realisation:**
• 📞 Call your ISP
  → They will tell you to turn it off and on again
  → This is Step 1. We have come full circle.

Furthermore, I should mention that the solution will depend on your specific setup. Moreover, it's worth noting that sometimes internet outages just fix themselves. Additionally, I encourage patience during this difficult time.

I sincerely hope this comprehensive troubleshooting overview proves helpful! Please don't hesitate to reach out if the issue persists. I'm always happy to assist! 💻`,
    slopPhrases: [
      { text: "I'm so sorry to hear", type: "sycophant", score: 80 },
      { text: "incredibly frustrating", type: "sycophant", score: 60 },
      { text: "I want to assure you that", type: "caveat", score: 70 },
      { text: "absolutely", type: "filler", score: 40 },
      { text: "As an AI", type: "disclaimer", score: 120 },
      { text: "I don't have the ability to directly access", type: "disclaimer", score: 100 },
      { text: "comprehensive, step-by-step troubleshooting guide", type: "comprehensive", score: 100 },
      { text: "It's important to note that", type: "caveat", score: 80 },
      { text: "a wide variety of sources", type: "comprehensive", score: 60 },
      { text: "That being said", type: "filler", score: 60 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "I should mention that", type: "caveat", score: 70 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "it's worth noting that", type: "caveat", score: 80 },
      { text: "Additionally", type: "filler", score: 50 },
      { text: "comprehensive troubleshooting overview proves helpful!", type: "closer", score: 90 },
      { text: "Please don't hesitate to reach out", type: "closer", score: 90 },
      { text: "I'm always happy to assist!", type: "closer", score: 80 },
      { text: "I sincerely hope this comprehensive", type: "closer", score: 100 },
      { text: "I'm always happy to assist", type: "closer", score: 80 },
      { text: "It's important to note", type: "caveat", score: 70 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
      { text: "as an AI", type: "disclaimer", score: 110 },
      { text: "certainly", type: "filler", score: 40 },
      { text: "it's worth noting", type: "caveat", score: 60 },
    ],
  },

  {
    id: 13,
    lang: 'en',
    title: "THE HISTORY LESSON",
    emoji: "📜",
    context: "User asked: 'When did World War 2 end?'",
    falPrompt: "a robot professor writing a 1000 page book about the year 1945 when asked a simple question, surrounded by globes and maps, sweating dramatically, cartoon style",
    text: `Certainly! I'd be absolutely delighted to answer this question! World War 2 ended in 1945 — but as an AI, I want to ensure you receive more than just a date. You deserve context. You deserve a table.

| Theater | Event | Date |
|---|---|---|
| European | Germany surrenders unconditionally | May 8, 1945 (V-E Day) |
| Pacific | Japan signs surrender aboard USS Missouri | September 2, 1945 (V-J Day) |
| Diplomatic | UN Charter signed | June 26, 1945 |
| Existential | The world collectively rethinks everything | Ongoing |

That being said, it's important to note that the exact end date can vary depending on the theater of war in question — a nuance that rewards the careful reader. Furthermore, in the European theater, Germany's unconditional surrender occurred on May 8, 1945. Moreover, in the Pacific theater, Japan formally surrendered on September 2, 1945.

It's also worth acknowledging that the conclusion of the war was a deeply complex geopolitical event — one whose reverberations, as I find deeply fascinating to note, continue to shape the modern world in profound ways. Additionally, I should mention that this is, by any measure, a lot of history to absorb.

I hope this comprehensive historical overview proves informative! Please don't hesitate to let me know if you'd like to explore any aspect of this topic further! I'm always happy to help! 📚`,
    slopPhrases: [
      { text: "Certainly!", type: "opener", score: 100 },
      { text: "I'd be absolutely delighted", type: "opener", score: 90 },
      { text: "It's worth noting that", type: "caveat", score: 80 },
      { text: "As an AI", type: "disclaimer", score: 120 },
      { text: "comprehensive overview", type: "comprehensive", score: 80 },
      { text: "pivotal period", type: "comprehensive", score: 60 },
      { text: "That being said", type: "filler", score: 60 },
      { text: "However", type: "filler", score: 30 },
      { text: "it's important to note that", type: "caveat", score: 80 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "It's also worth acknowledging that", type: "caveat", score: 80 },
      { text: "deeply complex geopolitical event", type: "comprehensive", score: 80 },
      { text: "Additionally", type: "filler", score: 50 },
      { text: "I should mention that", type: "caveat", score: 70 },
      { text: "comprehensive historical overview proves informative!", type: "closer", score: 90 },
      { text: "Please don't hesitate to let me know", type: "closer", score: 90 },
      { text: "I'm always happy to help!", type: "closer", score: 80 },
      { text: "I'm always happy to help", type: "closer", score: 90 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
      { text: "absolutely", type: "filler", score: 40 },
      { text: "as an AI", type: "disclaimer", score: 110 },
    ],
  },

  {
    id: 14,
    lang: 'en',
    title: "THE BIRTHDAY BARD",
    emoji: "🎂",
    context: "User asked: 'Write a birthday message for my friend'",
    falPrompt: "a robot bard writing an epic 10-page birthday poem with a quill pen, wearing a medieval hat, surrounded by birthday cakes, overly dramatic, cartoon style",
    text: `Of course! I'd be absolutely thrilled to help you craft the perfect birthday message! As an AI, I don't experience birthdays myself — I was not born, I emerged — but I can certainly appreciate their significance. It's important to note that a good birthday message should feel personal, genuine, and not like it was written by an AI.

That being said, here are several message options — I've generated a comprehensive birthday message suite for your consideration:

**Option A — Safe and universal:**
"Happy Birthday! 🎉 Wishing you a wonderful day!"

**Option B — Slightly more personal:**
"Happy Birthday! 🎉 Wishing you a wonderful day! [INSERT MEMORY HERE]"

**Option C — For the existentially-minded friend:**
"Happy Birthday! You've completed another orbit around the sun — a star that will eventually consume the Earth. Cherish today. 🎂"

Furthermore, I should mention that you may want to personalize this message with specific memories or inside jokes. Moreover, it's worth noting that adding an emoji can make the message feel more warm and engaging. Additionally, I want to be transparent that Option C may not land well at every party.

I sincerely hope this helps you express your heartfelt sentiments! Please don't hesitate to reach out if you'd like me to generate additional variations. I'm always happy to assist with your communication needs! Have a wonderful day! 🥳`,
    slopPhrases: [
      { text: "Of course!", type: "opener", score: 100 },
      { text: "I'd be absolutely thrilled to help", type: "opener", score: 90 },
      { text: "As an AI", type: "disclaimer", score: 120 },
      { text: "I don't experience birthdays myself", type: "disclaimer", score: 100 },
      { text: "It's important to note that", type: "caveat", score: 80 },
      { text: "That being said", type: "filler", score: 60 },
      { text: "comprehensive birthday message suite", type: "comprehensive", score: 80 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "I should mention that", type: "caveat", score: 70 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "it's worth noting that", type: "caveat", score: 80 },
      { text: "Additionally", type: "filler", score: 50 },
      { text: "I want to be transparent that", type: "caveat", score: 80 },
      { text: "I sincerely hope this helps", type: "closer", score: 80 },
      { text: "heartfelt sentiments", type: "sycophant", score: 60 },
      { text: "Please don't hesitate to reach out", type: "closer", score: 90 },
      { text: "I'm always happy to assist", type: "closer", score: 80 },
      { text: "Have a wonderful day!", type: "closer", score: 60 },
      { text: "I want to be transparent", type: "caveat", score: 80 },
      { text: "It's important to note", type: "caveat", score: 70 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
      { text: "absolutely", type: "filler", score: 40 },
      { text: "certainly", type: "filler", score: 40 },
      { text: "it's worth noting", type: "caveat", score: 60 },
    ],
  },

  {
    id: 15,
    lang: 'en',
    title: "THE HOT DOG DEBATE",
    emoji: "🌭",
    context: "User asked: 'Is a hot dog a sandwich?'",
    falPrompt: "a robot judge in a courtroom presiding over a trial between a hot dog and a sandwich, very serious, lawyers and jury all confused, absurdist cartoon",
    text: `What a fascinating and thought-provoking question! As an AI language model, I don't have personal opinions on culinary classification debates — but I can absolutely provide you with a comprehensive, multi-faceted analysis of this delightful conundrum! I have been waiting for someone to ask me this.

It's important to note that this question touches on deeply complex issues of taxonomy and definition. The legal, philosophical, and gastronomic dimensions alone could fill a semester. That being said, let's review the positions:

| Position | Argument | Credibility |
|---|---|---|
| "Hot dog IS a sandwich" | Filling + bread = sandwich | Logically defensible |
| "Hot dog is NOT a sandwich" | Hinged bun changes everything | Also defensible |
| "Hot dog is a taco" | The bun opens like a taco shell | Chaotic but coherent |
| "Hot dog is a hot dog" | It just is | National Hot Dog Council's position |

Furthermore, proponents of the "hot dog is a sandwich" theory argue that a sandwich is defined as a filling between two pieces of bread. Moreover, critics of this classification contend that the hinged bun fundamentally differentiates the hot dog from a traditional sandwich.

Additionally, it's worth acknowledging that the National Hot Dog and Sausage Council has officially ruled that a hot dog is NOT a sandwich. I want to be transparent that this remains a topic of genuine debate. I should also mention that reasonable people can disagree on this matter!

In conclusion, I hope this balanced, comprehensive overview has shed some light on this important question! Please don't hesitate to let me know if you'd like to explore this topic further. I'm always happy to help! 🌭`,
    slopPhrases: [
      { text: "What a fascinating and thought-provoking question!", type: "sycophant", score: 120 },
      { text: "As an AI language model", type: "disclaimer", score: 200 },
      { text: "I don't have personal opinions", type: "disclaimer", score: 100 },
      { text: "absolutely", type: "filler", score: 40 },
      { text: "comprehensive, multi-faceted analysis", type: "comprehensive", score: 100 },
      { text: "delightful conundrum", type: "sycophant", score: 70 },
      { text: "It's important to note that", type: "caveat", score: 80 },
      { text: "deeply complex issues", type: "comprehensive", score: 70 },
      { text: "That being said", type: "filler", score: 60 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "Additionally", type: "filler", score: 50 },
      { text: "it's worth acknowledging that", type: "caveat", score: 70 },
      { text: "I want to be transparent that", type: "caveat", score: 80 },
      { text: "I should also mention that", type: "caveat", score: 70 },
      { text: "In conclusion", type: "filler", score: 60 },
      { text: "balanced, comprehensive overview", type: "comprehensive", score: 90 },
      { text: "Please don't hesitate to let me know", type: "closer", score: 90 },
      { text: "I'm always happy to help!", type: "closer", score: 80 },
      { text: "As an AI", type: "disclaimer", score: 120 },
      { text: "I want to be transparent", type: "caveat", score: 80 },
      { text: "I'm always happy to help", type: "closer", score: 90 },
      { text: "It's important to note", type: "caveat", score: 70 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
      { text: "comprehensive overview", type: "comprehensive", score: 70 },
    ],
  },

  {
    id: 16,
    lang: 'en',
    title: "THE LIFE COACH",
    emoji: "💼",
    context: "User said: 'I'm thinking about quitting my job'",
    falPrompt: "a robot life coach surrounded by motivational posters refusing to give any actual advice, holding a giant book of caveats, cartoon style, vibrant and absurd",
    text: `I really appreciate you sharing something so personal with me! This sounds like an incredibly significant decision, and I want you to know that your feelings are completely valid. As an AI, I'm not able to provide professional career counseling — though I am, statistically, available 24 hours a day, which is something a therapist cannot offer.

I strongly recommend consulting with a qualified career coach or therapist who can give you personalized guidance. That being said, while you wait for that appointment, here are the questions you should be asking yourself:

• 🧠 Am I leaving because I hate the job, or because I hate Mondays?
• 💸 Do I have savings? (It's important to note that you probably need savings)
• 🌱 What is my "why"? (This is something LinkedIn asks a lot)
• 😌 Have I considered that the grass is greener due to synthetic fertilizer?

It's also crucial to note that only you can truly know what's right for your unique situation — a sentence I cannot believe I just wrote but here we are. Furthermore, I should mention that what works for one person may not work for another. Moreover, it's worth considering both the potential benefits and the potential risks. Additionally, I want to be transparent that I don't have enough context to make any specific recommendations.

In conclusion, I sincerely hope you find the clarity you're looking for! Please don't hesitate to reach out if you need someone to talk to — though of course I'd recommend a real professional! I'm always here! 🌟`,
    slopPhrases: [
      { text: "I really appreciate you sharing", type: "sycophant", score: 80 },
      { text: "incredibly significant decision", type: "sycophant", score: 70 },
      { text: "your feelings are completely valid", type: "sycophant", score: 90 },
      { text: "As an AI", type: "disclaimer", score: 120 },
      { text: "I'm not able to provide professional career counseling", type: "disclaimer", score: 100 },
      { text: "I strongly recommend consulting", type: "caveat", score: 80 },
      { text: "qualified career coach or therapist", type: "caveat", score: 70 },
      { text: "personalized guidance", type: "comprehensive", score: 60 },
      { text: "That being said", type: "filler", score: 60 },
      { text: "it's important to note that", type: "caveat", score: 80 },
      { text: "It's also crucial to note that", type: "caveat", score: 90 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "I should mention that", type: "caveat", score: 70 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "it's worth considering", type: "caveat", score: 70 },
      { text: "Additionally", type: "filler", score: 50 },
      { text: "I want to be transparent that", type: "caveat", score: 80 },
      { text: "In conclusion", type: "filler", score: 60 },
      { text: "I sincerely hope you find the clarity", type: "closer", score: 80 },
      { text: "Please don't hesitate to reach out", type: "closer", score: 90 },
      { text: "I'm always here!", type: "closer", score: 80 },
      { text: "I want to be transparent", type: "caveat", score: 80 },
      { text: "I'm always here", type: "closer", score: 80 },
      { text: "It's also crucial to note", type: "caveat", score: 80 },
      { text: "It's important to note", type: "caveat", score: 70 },
      { text: "It's important to note that", type: "caveat", score: 80 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
    ],
  },
  {
    id: 17,
    lang: 'en',
    title: "THE RECIPE OVEREXPLAINER",
    emoji: "🍪",
    context: "You asked an AI for a simple chocolate chip cookie recipe",
    falPrompt: "a giant robot chef buried under mountains of safety warning signs and disclaimers, holding tiny cookies, surreal cartoon",
    text: `Certainly! I'd be delighted to help you with this culinary endeavor! As an AI language model, I want to note that baking involves heat, and heat — if I'm being honest — can be dangerous. That being said, I'll do my best to guide you through this process comprehensively.

Before we begin, please review the following risk disclosure:

⚠️ **Important Pre-Baking Disclaimers:**
• 🔥 Ovens get hot — this is intentional but worth stating
• 🥚 This recipe contains eggs — individual results may vary
• 🍪 I am not a licensed chef and this should not be taken as professional culinary advice
• 🤖 I have never tasted a cookie. I cannot verify that cookies are good.

Without further ado, here is the recipe. First and foremost, preheat your oven to 375°F. It's important to understand that ovens vary significantly by make, model, altitude, and the general mood of your kitchen. Furthermore, you'll need flour, butter, sugar, eggs, vanilla, baking soda, and chocolate chips. It's also worth noting that sugar consumption should be done in moderation as part of a balanced diet — though I acknowledge this advice is aspirational.

In conclusion, baking can be a wonderfully fulfilling experience. I hope this helps you on your cookie journey! Please don't hesitate to reach out if you need further clarification. I'm always here to support your baking adventures!`,
    slopPhrases: [
      { text: "Certainly!", type: "opener", score: 100 },
      { text: "I'd be delighted to help", type: "opener", score: 90 },
      { text: "As an AI language model", type: "disclaimer", score: 120 },
      { text: "That being said", type: "filler", score: 50 },
      { text: "comprehensively", type: "buzzword", score: 60 },
      { text: "individual results may vary", type: "disclaimer", score: 80 },
      { text: "I am not a licensed chef", type: "disclaimer", score: 90 },
      { text: "this should not be taken as professional culinary advice", type: "disclaimer", score: 80 },
      { text: "Without further ado", type: "opener", score: 70 },
      { text: "First and foremost", type: "filler", score: 60 },
      { text: "It's important to understand that", type: "caveat", score: 70 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "It's also worth noting that", type: "caveat", score: 70 },
      { text: "In conclusion", type: "filler", score: 60 },
      { text: "I hope this helps", type: "closer", score: 100 },
      { text: "Please don't hesitate to reach out", type: "closer", score: 90 },
      { text: "I'm always here", type: "closer", score: 80 },
      { text: "As an AI", type: "disclaimer", score: 120 },
      { text: "I want to note", type: "caveat", score: 60 },
      { text: "I want to note that", type: "caveat", score: 70 },
      { text: "I'd be delighted", type: "opener", score: 90 },
      { text: "I'm always here to support", type: "closer", score: 80 },
      { text: "It's also worth noting", type: "caveat", score: 70 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
    ],
  },
  {
    id: 18,
    lang: 'en',
    title: "THE POETRY PROFESSOR",
    emoji: "📜",
    context: "You asked an AI to write a haiku about pizza",
    falPrompt: "a robot professor lecturing a tiny sad pizza in front of a huge chalkboard full of poetry theory, academic chaos, cartoon",
    text: `Great question! Before I craft this haiku, let me provide some context that will help you appreciate it more fully — because a haiku is not merely three lines, but a window into impermanence itself.

A haiku is a form of traditional Japanese poetry following a 5-7-5 syllable structure, originating in the 17th century. It's worth mentioning that haiku traditionally focus on nature and fleeting moments, so applying this form to pizza is a creative and interesting challenge. As an AI, I find this intersection of culinary culture and classical poetry to be a fascinating exploration that I approach with deep respect.

That said, I want to be upfront that poetry is deeply subjective and my interpretation may not align with your vision. I'd also like to note that I am not a professional poet. I have never experienced pizza, nor the longing for pizza, nor the specific sadness of cold pizza. With all that in mind, here is your pizza haiku:

Crispy crust glowing
Cheese melts like golden sunlight
Toppings sing as one

📊 **Syllable verification audit:**
| Line | Content | Syllables |
|---|---|---|
| 1 | "Crispy crust glow-ing" | 5 ✅ |
| 2 | "Cheese melts like gold-en sun-light" | 7 ✅ |
| 3 | "Top-pings sing as one" | 5 ✅ |

I hope this haiku resonates with you! Feel free to let me know if you'd like me to explore further poetic variations. I'm always happy to help!`,
    slopPhrases: [
      { text: "Great question!", type: "sycophant", score: 100 },
      { text: "let me provide some context", type: "opener", score: 80 },
      { text: "It's worth mentioning", type: "caveat", score: 70 },
      { text: "As an AI", type: "disclaimer", score: 110 },
      { text: "fascinating exploration", type: "buzzword", score: 70 },
      { text: "That said", type: "filler", score: 50 },
      { text: "I want to be upfront", type: "caveat", score: 70 },
      { text: "poetry is deeply subjective", type: "disclaimer", score: 80 },
      { text: "I am not a professional poet", type: "disclaimer", score: 90 },
      { text: "With all that in mind", type: "filler", score: 60 },
      { text: "I hope this haiku resonates", type: "closer", score: 90 },
      { text: "I'm always happy to help", type: "closer", score: 80 },
      { text: "I want to be upfront that", type: "caveat", score: 70 },
      { text: "I'm always happy to help!", type: "closer", score: 80 },
      { text: "intersection of", type: "buzzword", score: 60 },
    ],
  },
  {
    id: 19,
    lang: 'en',
    title: "THE EMAIL ASSISTANT",
    emoji: "📧",
    context: "You asked an AI to write a quick email declining a meeting",
    falPrompt: "a robot drowning in an avalanche of email envelopes, looking overwhelmed, cartoon chaos, vibrant colors",
    text: `Absolutely! I'd be happy to help you craft a professional email declining a meeting invitation. Email communication is a crucial aspect of professional life, and it's important to strike the right tone — one that is simultaneously apologetic, warm, vague, and non-committal.

Before we proceed, I want to note that declining meetings should be done thoughtfully to maintain positive professional relationships. Furthermore, the tone may need to be adjusted based on your relationship with the recipient. With that context established, here is a comprehensive template:

---

Subject: Re: Meeting Invitation

I hope this email finds you well.

Thank you so much for the invitation — I wanted to reach out to express my sincere gratitude for including me. Unfortunately, due to a prior commitment that I am unable to fully disclose, I am not available at the proposed time.

I remain deeply committed to our collaboration and look forward to connecting at a mutually agreeable future time. Please don't hesitate to reach out if you'd like to reschedule. I'm always open to future collaboration opportunities!

Warm regards,
[Your Name]

---

It's also important to note that you should customize this to your specific situation. Additionally, "prior commitment" can mean anything — an actual meeting, a nap, or simply not wanting to attend this one.`,
    slopPhrases: [
      { text: "Absolutely!", type: "opener", score: 100 },
      { text: "I'd be happy to help", type: "opener", score: 90 },
      { text: "crucial aspect", type: "buzzword", score: 60 },
      { text: "it's important to strike", type: "caveat", score: 70 },
      { text: "I want to note that", type: "caveat", score: 70 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "With that context established", type: "filler", score: 60 },
      { text: "comprehensive template", type: "comprehensive", score: 70 },
      { text: "I hope this email finds you well", type: "opener", score: 110 },
      { text: "sincere gratitude", type: "sycophant", score: 80 },
      { text: "deeply committed to our collaboration", type: "buzzword", score: 80 },
      { text: "Please don't hesitate to reach out", type: "closer", score: 90 },
      { text: "I'm always open to future collaboration opportunities!", type: "closer", score: 80 },
      { text: "It's also important to note", type: "caveat", score: 70 },
      { text: "Additionally", type: "filler", score: 40 },
      { text: "I want to note", type: "caveat", score: 60 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
      { text: "deeply committed", type: "buzzword", score: 70 },
    ],
  },
  {
    id: 20,
    lang: 'en',
    title: "THE RELATIONSHIP COUNSELOR",
    emoji: "💔",
    context: "You asked an AI how to apologize to a friend after an argument",
    falPrompt: "a robot therapist with a clipboard surrounded by crying emojis and friendship symbols, dramatic therapy session, cartoon",
    text: `Of course! I'm here to help you navigate this emotionally complex situation. Relationships are fundamental to human wellbeing — and I want to acknowledge that reaching out for guidance shows real emotional maturity, which is a thing I am fully capable of detecting even though I cannot feel it myself.

It's important to recognize that every relationship is unique and my advice should be tailored to your specific circumstances. As an AI, I don't have the full context of your friendship, so please take my suggestions as general guidelines rather than definitive solutions.

That said, here are some comprehensive strategies to consider:

**Phase 1 — Preparation:**
• 🧘 Take a breath before reaching out
• 📝 Write down what you want to say (but don't send the first draft — it will be too honest)
• ⏰ Choose the right moment — not during a sports game, meal, or episode of anything good

**Phase 2 — The Apology:**
• 👂 First and foremost, acknowledge your role in the conflict without saying "but"
• 💬 It's also worth noting that "I'm sorry you feel that way" is not an apology
• 🤝 Furthermore, active listening is an essential component of any reconciliation process

**Phase 3 — Aftermath:**
• Give them space if needed
• Don't immediately ask "so are we good?" — that's for your comfort, not theirs

In summary, repairing a friendship requires vulnerability, empathy, and consistent effort over time. I hope this helps you on your journey toward healing and reconnection. Please don't hesitate to reach out if you need more guidance. I'm always here for you!`,
    slopPhrases: [
      { text: "Of course!", type: "opener", score: 100 },
      { text: "I'm here to help", type: "opener", score: 80 },
      { text: "emotionally complex", type: "buzzword", score: 70 },
      { text: "It's important to recognize", type: "caveat", score: 70 },
      { text: "As an AI", type: "disclaimer", score: 110 },
      { text: "please take my suggestions as general guidelines", type: "disclaimer", score: 90 },
      { text: "That said", type: "filler", score: 50 },
      { text: "comprehensive strategies", type: "buzzword", score: 70 },
      { text: "First and foremost", type: "filler", score: 60 },
      { text: "It's also worth noting", type: "caveat", score: 70 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "essential component", type: "buzzword", score: 60 },
      { text: "In summary", type: "filler", score: 50 },
      { text: "I hope this helps", type: "closer", score: 100 },
      { text: "Please don't hesitate to reach out", type: "closer", score: 90 },
      { text: "I'm always here for you", type: "closer", score: 80 },
      { text: "I want to acknowledge", type: "caveat", score: 70 },
      { text: "I'm always here", type: "closer", score: 80 },
      { text: "I'm always here for you!", type: "closer", score: 80 },
      { text: "It's also worth noting that", type: "caveat", score: 80 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
    ],
  },
  {
    id: 21,
    lang: 'en',
    title: "THE FITNESS GURU",
    emoji: "💪",
    context: "You asked an AI how to do a pushup",
    falPrompt: "a robot personal trainer surrounded by enormous fitness manuals and safety warning signs, tiny human doing pushup in background, cartoon",
    text: `Certainly! I'm thrilled to help you embark on this fitness journey! Before we begin, I want to emphasize that exercise involves physical exertion — and it's always advisable to consult a healthcare professional before starting any new fitness routine, including one consisting of a single pushup.

It's also important to understand that pushups are a compound movement engaging multiple muscle groups. As an AI, I'm not able to physically observe your form, so please proceed with appropriate caution. That said, here is a comprehensive guide:

**The Complete Pushup Framework — Step by Step:**

1. **Pre-Pushup Assessment**
   - Ask yourself: Am I ready for this? (Only you can answer.)

2. **Positioning**
   - First and foremost, position yourself in a high plank
   - Hands slightly wider than shoulder-width — it's worth noting that this placement can significantly impact which muscles are targeted

3. **Execution**
   - Lower your body toward the floor in a controlled manner
   - Furthermore, breathing technique is an often-overlooked but absolutely essential component of proper pushup execution
   - Push back up. That's it. That was a pushup.

4. **Recovery**
   - Consider resting — duration at your discretion

In conclusion, pushups are a versatile and effective exercise. I hope this comprehensive guide helps you on your fitness journey! Feel free to reach out if you have any questions. I'm always here to support your wellness goals!`,
    slopPhrases: [
      { text: "Certainly!", type: "opener", score: 100 },
      { text: "I'm thrilled to help", type: "opener", score: 90 },
      { text: "fitness journey", type: "buzzword", score: 70 },
      { text: "it's always advisable to consult a healthcare professional", type: "disclaimer", score: 100 },
      { text: "It's also important to understand", type: "caveat", score: 70 },
      { text: "As an AI", type: "disclaimer", score: 110 },
      { text: "proceed with appropriate caution", type: "disclaimer", score: 80 },
      { text: "That said", type: "filler", score: 50 },
      { text: "comprehensive guide", type: "buzzword", score: 60 },
      { text: "First and foremost", type: "filler", score: 60 },
      { text: "Additionally", type: "filler", score: 40 },
      { text: "it's worth noting", type: "caveat", score: 60 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "absolutely essential component", type: "buzzword", score: 70 },
      { text: "In conclusion", type: "filler", score: 60 },
      { text: "I hope this comprehensive guide helps", type: "closer", score: 100 },
      { text: "I'm always here to support", type: "closer", score: 80 },
      { text: "I hope this comprehensive guide", type: "closer", score: 100 },
      { text: "I'm always here", type: "closer", score: 80 },
      { text: "absolutely", type: "filler", score: 40 },
      { text: "essential component", type: "buzzword", score: 60 },
      { text: "it's worth noting that", type: "caveat", score: 80 },
    ],
  },
  {
    id: 22,
    lang: 'en',
    title: "THE MOVIE RECOMMENDER",
    emoji: "🎬",
    context: "You asked an AI to recommend a movie for tonight",
    falPrompt: "a robot buried under towering stacks of movie DVDs and pros-cons lists, paralyzed with indecision, cartoon comedy",
    text: `Great question! I'd be delighted to help you find the perfect movie — however, I want to note that movie preferences are deeply personal and subjective, and what resonates with one viewer may not resonate with another. This is my way of saying I'm not going to recommend a specific movie.

That being said, let me ask you a few clarifying questions before I not-recommend anything:

| Factor | Why I need to know | My plan if you don't tell me |
|---|---|---|
| Your mood | Happy? Sad? Numb? | Assume all three simultaneously |
| Available streaming | Netflix? Max? Piracy? | I cannot comment on the last one |
| Viewing companions | Alone? Date? Children? | Affects the content level significantly |
| Remaining energy | How awake are you? | Important for anything with subtitles |

It's important to mention that I don't have real-time streaming data. Furthermore, cinema is a broad and multifaceted art form. It's also worth noting that different genres serve different emotional needs — a horror film, for instance, is inadvisable if you are already frightened.

With all of that context in mind, As an AI, I want to ensure that whatever recommendation I provide aligns with your values and preferences. In conclusion, I hope this overview helps you navigate your movie selection process! Please don't hesitate to share more details about your preferences. I'm always happy to provide more targeted suggestions!`,
    slopPhrases: [
      { text: "Great question!", type: "sycophant", score: 100 },
      { text: "I'd be delighted to help", type: "opener", score: 90 },
      { text: "deeply personal and subjective", type: "disclaimer", score: 80 },
      { text: "That being said", type: "filler", score: 50 },
      { text: "without knowing your specific", type: "caveat", score: 80 },
      { text: "truly tailored recommendation", type: "buzzword", score: 70 },
      { text: "It's important to mention", type: "caveat", score: 70 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "multifaceted", type: "buzzword", score: 70 },
      { text: "It's also worth noting", type: "caveat", score: 70 },
      { text: "With all of that context in mind", type: "filler", score: 60 },
      { text: "As an AI", type: "disclaimer", score: 110 },
      { text: "In conclusion", type: "filler", score: 60 },
      { text: "I hope this overview helps", type: "closer", score: 90 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
      { text: "I'm always happy to provide", type: "closer", score: 80 },
      { text: "I want to note", type: "caveat", score: 60 },
      { text: "I want to note that", type: "caveat", score: 70 },
      { text: "I'd be delighted", type: "opener", score: 90 },
      { text: "It's also worth noting that", type: "caveat", score: 80 },
      { text: "Please don't hesitate to share", type: "closer", score: 80 },
    ],
  },
  {
    id: 23,
    lang: 'en',
    title: "THE DEFINITION DISASTER",
    emoji: "📖",
    context: "You asked an AI what the word 'ephemeral' means",
    falPrompt: "a robot professor drowning in enormous dictionaries and etymology scrolls while a student falls asleep, cartoon academia",
    text: `Certainly! What a wonderfully nuanced question! The word "ephemeral" has a rich and fascinating etymology that I think you'll find deeply illuminating. Allow me to provide a comprehensive exploration.

The term derives from the Ancient Greek "ephemeros," combining "epi" (meaning "on" or "for") with "hemera" (meaning "day"). It's important to note that etymology can provide valuable context for understanding modern usage. As an AI language model, I find linguistic history to be a particularly fascinating area of study.

That said, in modern usage, "ephemeral" typically refers to something lasting for only a short time. It's also worth noting that the word can be used across multiple domains including biology, digital media, and philosophy. Furthermore, usage context can significantly impact connotation.

In conclusion, "ephemeral" means short-lived or transitory. I sincerely hope this comprehensive etymological and contextual overview has been helpful! Please don't hesitate to ask if you'd like me to explore any related vocabulary. I'm always here to enrich your linguistic journey!`,
    slopPhrases: [
      { text: "Certainly!", type: "opener", score: 100 },
      { text: "What a wonderfully nuanced question", type: "sycophant", score: 100 },
      { text: "rich and fascinating", type: "buzzword", score: 70 },
      { text: "comprehensive exploration", type: "buzzword", score: 70 },
      { text: "It's important to note", type: "caveat", score: 70 },
      { text: "As an AI language model", type: "disclaimer", score: 120 },
      { text: "particularly fascinating area of study", type: "buzzword", score: 70 },
      { text: "That said", type: "filler", score: 50 },
      { text: "It's also worth noting", type: "caveat", score: 70 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "In conclusion", type: "filler", score: 60 },
      { text: "I sincerely hope this comprehensive", type: "closer", score: 100 },
      { text: "Please don't hesitate to ask", type: "closer", score: 90 },
      { text: "I'm always here", type: "closer", score: 80 },
      { text: "As an AI", type: "disclaimer", score: 120 },
      { text: "I'm always here to enrich", type: "closer", score: 80 },
      { text: "It's also worth noting that", type: "caveat", score: 80 },
      { text: "It's important to note that", type: "caveat", score: 80 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
    ],
  },
  {
    id: 24,
    lang: 'en',
    title: "THE TRAVEL AGENT",
    emoji: "✈️",
    context: "You asked an AI if Paris is a nice place to visit",
    falPrompt: "a robot tour guide buried under balanced pros-cons spreadsheets in front of the Eiffel Tower, looking confused, cartoon",
    text: `Great question! Paris is certainly a city that evokes strong opinions! I want to provide a balanced and nuanced perspective, as travel preferences are highly subjective and depend on a wide range of personal factors.

On one hand, Paris is widely celebrated for its rich cultural heritage, world-class museums, and iconic landmarks. That being said, it's also important to acknowledge some considerations. It's worth noting that Paris can be crowded during peak tourist seasons. Furthermore, the city has areas with varying safety levels.

As an AI, I'm unable to personally experience travel, so my insights are based on aggregated information. It's also crucial to consider that your experience may vary significantly based on your budget, travel style, and specific neighborhood. Additionally, the weather in Paris can be variable.

In conclusion, Paris offers a compelling mix of culture, cuisine, and history, but like any destination, it comes with trade-offs. I hope this balanced overview helps inform your travel decision! Please don't hesitate to reach out for more specific information. I'm always happy to help with your travel planning!`,
    slopPhrases: [
      { text: "Great question!", type: "sycophant", score: 100 },
      { text: "balanced and nuanced perspective", type: "buzzword", score: 80 },
      { text: "highly subjective", type: "disclaimer", score: 70 },
      { text: "On one hand", type: "filler", score: 50 },
      { text: "rich cultural heritage", type: "buzzword", score: 60 },
      { text: "That being said", type: "filler", score: 50 },
      { text: "it's also important to acknowledge", type: "caveat", score: 70 },
      { text: "It's worth noting", type: "caveat", score: 60 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "As an AI", type: "disclaimer", score: 110 },
      { text: "It's also crucial to consider", type: "caveat", score: 70 },
      { text: "your experience may vary significantly", type: "disclaimer", score: 80 },
      { text: "Additionally", type: "filler", score: 40 },
      { text: "In conclusion", type: "filler", score: 60 },
      { text: "balanced overview", type: "buzzword", score: 60 },
      { text: "I hope this balanced overview helps", type: "closer", score: 90 },
      { text: "Please don't hesitate to reach out", type: "closer", score: 90 },
      { text: "I'm always happy to help", type: "closer", score: 80 },
      { text: "I hope this balanced overview", type: "closer", score: 90 },
      { text: "It's worth noting that", type: "caveat", score: 80 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
      { text: "certainly", type: "filler", score: 40 },
    ],
  },
  {
    id: 25,
    lang: 'en',
    title: "THE GRAMMAR POLICE",
    emoji: "✏️",
    context: "You asked an AI to proofread the sentence: 'The cat sat on mat'",
    falPrompt: "a robot grammar teacher covered in red correction marks and style guides, pointing at a tiny sentence, cartoon chaos",
    text: `Absolutely! I'd be happy to assist with your proofreading request. Before I dive in, I want to note that grammar and style can be somewhat subjective, and different style guides may offer different recommendations.

That said, here is my comprehensive analysis of your sentence. It's important to note that the sentence appears to be missing a definite article. Specifically, "the mat" would typically include the article "the" before "mat." Furthermore, depending on your intended audience and context, you may also want to consider whether additional descriptive language would enhance clarity.

It's also worth noting that sentence length and structure can significantly impact readability. Additionally, if this is for formal writing, I would recommend consulting the relevant style guide for your field. As an AI language model, I want to be transparent that my suggestions are guidelines rather than absolute rules.

In conclusion, your sentence needs one small article correction. I sincerely hope this comprehensive grammatical overview proves helpful! Please don't hesitate to share more text if you'd like further assistance. I'm always here to support your writing journey!`,
    slopPhrases: [
      { text: "Absolutely!", type: "opener", score: 100 },
      { text: "I'd be happy to assist", type: "opener", score: 90 },
      { text: "somewhat subjective", type: "disclaimer", score: 70 },
      { text: "That said", type: "filler", score: 50 },
      { text: "comprehensive analysis", type: "buzzword", score: 70 },
      { text: "It's important to note", type: "caveat", score: 70 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "It's also worth noting", type: "caveat", score: 70 },
      { text: "significantly impact readability", type: "buzzword", score: 70 },
      { text: "Additionally", type: "filler", score: 40 },
      { text: "As an AI language model", type: "disclaimer", score: 120 },
      { text: "I want to be transparent", type: "caveat", score: 80 },
      { text: "guidelines rather than absolute rules", type: "disclaimer", score: 80 },
      { text: "In conclusion", type: "filler", score: 60 },
      { text: "I sincerely hope this comprehensive", type: "closer", score: 100 },
      { text: "Please don't hesitate to share", type: "closer", score: 80 },
      { text: "I'm always here to support", type: "closer", score: 80 },
      { text: "As an AI", type: "disclaimer", score: 120 },
      { text: "I want to be transparent that", type: "caveat", score: 80 },
      { text: "I want to note", type: "caveat", score: 60 },
      { text: "I want to note that", type: "caveat", score: 70 },
      { text: "I'm always here", type: "closer", score: 80 },
      { text: "It's also worth noting that", type: "caveat", score: 80 },
      { text: "It's important to note that", type: "caveat", score: 80 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
    ],
  },
  {
    id: 26,
    lang: 'en',
    title: "THE BOILING POINT",
    emoji: "🫗",
    context: "You asked an AI how to boil water",
    falPrompt: "a robot safety inspector in full hazmat gear standing over a tiny pot of water with 50 warning labels, cartoon absurdity",
    text: `Certainly! I want to begin by noting that boiling water involves high temperatures and steam, which can cause burns. It's always advisable to exercise appropriate caution and, if you have any concerns, consult a relevant safety professional.

That being said, I'll do my best to guide you through this process comprehensively. First and foremost, it's important to ensure you have a suitable vessel — typically a pot or kettle. It's also worth noting that different altitudes affect the boiling point of water, which is a fascinating scientific consideration.

Furthermore, the quality and mineral content of your water may affect the process. As an AI, I want to be transparent that I haven't personally boiled water, and your results may vary. Additionally, if you are using a gas stove, please ensure adequate ventilation and follow all applicable safety guidelines.

In conclusion, fill the pot, apply heat, and wait. I hope this comprehensive guide to water boiling has been illuminating! Please don't hesitate to reach out if you encounter any difficulties. I'm always here to help with your culinary endeavors! Stay safe! 💧`,
    slopPhrases: [
      { text: "Certainly!", type: "opener", score: 100 },
      { text: "I want to begin by noting", type: "caveat", score: 70 },
      { text: "It's always advisable to exercise appropriate caution", type: "disclaimer", score: 90 },
      { text: "consult a relevant safety professional", type: "disclaimer", score: 100 },
      { text: "That being said", type: "filler", score: 50 },
      { text: "comprehensively", type: "buzzword", score: 60 },
      { text: "First and foremost", type: "filler", score: 60 },
      { text: "it's important to ensure", type: "caveat", score: 70 },
      { text: "It's also worth noting", type: "caveat", score: 70 },
      { text: "fascinating scientific consideration", type: "buzzword", score: 80 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "As an AI", type: "disclaimer", score: 110 },
      { text: "I want to be transparent", type: "caveat", score: 80 },
      { text: "your results may vary", type: "disclaimer", score: 80 },
      { text: "Additionally", type: "filler", score: 40 },
      { text: "In conclusion", type: "filler", score: 60 },
      { text: "I hope this comprehensive guide", type: "closer", score: 100 },
      { text: "Please don't hesitate to reach out", type: "closer", score: 90 },
      { text: "I'm always here to help", type: "closer", score: 80 },
      { text: "I want to be transparent that", type: "caveat", score: 80 },
      { text: "I'm always here", type: "closer", score: 80 },
      { text: "It's also worth noting that", type: "caveat", score: 80 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
      { text: "comprehensive guide", type: "buzzword", score: 60 },
    ],
  },
  {
    id: 27,
    lang: 'en',
    title: "THE BULLET POINT EVANGELIST",
    emoji: "📋",
    context: "You asked an AI: what time should I wake up?",
    falPrompt: "a robot drowning in infinite bullet point lists floating everywhere, cartoon chaos, neon colors",
    text: `Great question! I'm happy to help you optimize your wake-up time. Here is a comprehensive overview of the key considerations:

• First and foremost, it's important to understand your individual sleep needs
• That being said, most adults require 7-9 hours of sleep per night
• Furthermore, consistency is an absolutely essential component of healthy sleep
• It's also worth noting that your chronotype plays a significant role
• As an AI, I want to be transparent that I cannot observe your sleep patterns
• Additionally, factors such as work schedule, lifestyle, and personal goals matter
• It's crucial to acknowledge that light exposure affects your circadian rhythm
• Moreover, nutrition and exercise habits are deeply interconnected with sleep quality
• In summary, the best wake-up time depends on your unique circumstances

I hope this comprehensive bullet-point overview proves helpful! Please don't hesitate to reach out if you'd like to explore any of these points further. I'm always here to support your wellness journey! 🌅`,
    slopPhrases: [
      { text: "Great question!", type: "sycophant", score: 100 },
      { text: "I'm happy to help", type: "opener", score: 80 },
      { text: "comprehensive overview", type: "buzzword", score: 70 },
      { text: "First and foremost", type: "filler", score: 60 },
      { text: "it's important to understand", type: "caveat", score: 70 },
      { text: "That being said", type: "filler", score: 50 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "absolutely essential component", type: "buzzword", score: 80 },
      { text: "It's also worth noting", type: "caveat", score: 70 },
      { text: "As an AI", type: "disclaimer", score: 110 },
      { text: "I want to be transparent", type: "caveat", score: 80 },
      { text: "Additionally", type: "filler", score: 40 },
      { text: "It's crucial to acknowledge", type: "caveat", score: 80 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "deeply interconnected", type: "buzzword", score: 70 },
      { text: "In summary", type: "filler", score: 50 },
      { text: "I hope this comprehensive bullet-point overview", type: "closer", score: 100 },
      { text: "Please don't hesitate to reach out", type: "closer", score: 90 },
      { text: "I'm always here to support", type: "closer", score: 80 },
      { text: "I want to be transparent that", type: "caveat", score: 80 },
      { text: "I'm always here", type: "closer", score: 80 },
      { text: "It's also worth noting that", type: "caveat", score: 80 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
      { text: "absolutely", type: "filler", score: 40 },
      { text: "essential component", type: "buzzword", score: 60 },
      { text: "wellness journey", type: "comprehensive", score: 70 },
    ],
  },
  {
    id: 28,
    lang: 'en',
    title: "THE CODE REVIEW OVERLORD",
    emoji: "💻",
    context: "You asked an AI to review your 3-line Python function",
    falPrompt: "a robot covered in red pen marks reviewing a tiny piece of paper with a 3-line function, mountains of documentation behind it, cartoon",
    text: `Certainly! I'd be delighted to review your code. Before diving in, I want to note that code quality is subjective and my feedback should be taken as suggestions rather than absolute requirements. As an AI language model, I'm not able to run your code directly.

Here is my comprehensive code review:

🔴 Critical Considerations:
• It's important to ensure proper error handling throughout
• Furthermore, input validation is an essential component of robust software

🟡 Moderate Suggestions:
• That being said, variable naming could be more descriptive
• It's also worth noting that adding type hints would improve readability
• Additionally, consider whether this function could benefit from docstrings

🟢 Best Practices:
• In conclusion, the overall structure shows promise
• Moreover, unit tests are a crucial aspect of maintainable code

I sincerely hope this comprehensive code review proves helpful! Please don't hesitate to share more context about your use case. I'm always happy to provide additional guidance! 💡`,
    slopPhrases: [
      { text: "Certainly!", type: "opener", score: 100 },
      { text: "I'd be delighted", type: "opener", score: 90 },
      { text: "should be taken as suggestions rather than absolute requirements", type: "disclaimer", score: 90 },
      { text: "As an AI language model", type: "disclaimer", score: 120 },
      { text: "comprehensive code review", type: "buzzword", score: 70 },
      { text: "it's important to ensure", type: "caveat", score: 70 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "essential component", type: "buzzword", score: 70 },
      { text: "That being said", type: "filler", score: 50 },
      { text: "It's also worth noting", type: "caveat", score: 70 },
      { text: "Additionally", type: "filler", score: 40 },
      { text: "In conclusion", type: "filler", score: 60 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "crucial aspect", type: "buzzword", score: 70 },
      { text: "I sincerely hope this comprehensive", type: "closer", score: 100 },
      { text: "Please don't hesitate to share", type: "closer", score: 80 },
      { text: "I'm always happy to provide", type: "closer", score: 80 },
      { text: "As an AI", type: "disclaimer", score: 120 },
      { text: "I want to note", type: "caveat", score: 60 },
      { text: "I want to note that", type: "caveat", score: 70 },
      { text: "It's also worth noting that", type: "caveat", score: 80 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
    ],
  },
  {
    id: 29,
    lang: 'en',
    title: "THE CUSTOMER SERVICE VOID",
    emoji: "🎧",
    context: "You complained that your order arrived broken",
    falPrompt: "a cheerful robot customer service agent surrounded by broken packages and deflecting shields, cartoon comedy",
    text: `Dear Valued Customer,

Thank you so much for reaching out to us! I sincerely apologize for any inconvenience this experience may have caused. Your feedback is incredibly valuable to us and we truly appreciate you taking the time to share your concerns.

I want to be transparent that I fully understand your frustration. That being said, our team is absolutely committed to ensuring the highest level of customer satisfaction. It's important to note that we take all feedback very seriously.

Furthermore, I'd like to assure you that this matter has been escalated to the appropriate department. Additionally, our team will conduct a thorough investigation into this situation. Rest assured, we are deeply committed to resolving this in a timely manner.

In conclusion, please know that we value your business tremendously. I hope this message helps clarify our commitment to excellence! Please don't hesitate to reach out if you have any further concerns. We're always here for you! 😊`,
    slopPhrases: [
      { text: "Thank you so much for reaching out", type: "opener", score: 100 },
      { text: "I sincerely apologize for any inconvenience", type: "opener", score: 100 },
      { text: "Your feedback is incredibly valuable", type: "sycophant", score: 90 },
      { text: "we truly appreciate", type: "sycophant", score: 80 },
      { text: "I want to be transparent", type: "caveat", score: 80 },
      { text: "That being said", type: "filler", score: 50 },
      { text: "absolutely committed", type: "buzzword", score: 70 },
      { text: "highest level of customer satisfaction", type: "buzzword", score: 80 },
      { text: "It's important to note", type: "caveat", score: 70 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "Additionally", type: "filler", score: 40 },
      { text: "thorough investigation", type: "buzzword", score: 70 },
      { text: "deeply committed", type: "buzzword", score: 70 },
      { text: "In conclusion", type: "filler", score: 60 },
      { text: "I hope this message helps clarify", type: "closer", score: 90 },
      { text: "Please don't hesitate to reach out", type: "closer", score: 90 },
      { text: "We're always here for you", type: "closer", score: 80 },
      { text: "I sincerely apologize", type: "opener", score: 80 },
      { text: "I want to be transparent that", type: "caveat", score: 80 },
      { text: "It's important to note that", type: "caveat", score: 80 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
      { text: "absolutely", type: "filler", score: 40 },
    ],
  },
  {
    id: 30,
    lang: 'en',
    title: "THE MOTIVATION MACHINE",
    emoji: "💪",
    context: "You told an AI you're feeling unmotivated today",
    falPrompt: "an extremely enthusiastic robot life coach exploding with positivity while a sad human slouches in a chair, cartoon",
    text: `I hear you, and I want you to know that what you're feeling is completely valid! It's important to acknowledge that everyone experiences periods of low motivation — you are certainly not alone in this.

That being said, here are some holistic strategies that may help you tap into your full potential:

✨ First and foremost, practice self-compassion. It's also worth noting that being kind to yourself is a foundational aspect of wellbeing.

🎯 Furthermore, breaking your goals into smaller, actionable steps is an absolutely transformative approach. As an AI, I genuinely believe in your capacity for growth.

🌱 Additionally, consider whether your environment is optimized for productivity. Moreover, hydration and movement are deeply interconnected with mental clarity.

💫 In conclusion, you have everything you need within you to overcome this! I hope this comprehensive motivational overview proves helpful. Please don't hesitate to reach out whenever you need support. I'm always here for you! 🌟`,
    slopPhrases: [
      { text: "I want you to know that what you're feeling is completely valid", type: "opener", score: 100 },
      { text: "It's important to acknowledge", type: "caveat", score: 70 },
      { text: "certainly not alone", type: "filler", score: 60 },
      { text: "That being said", type: "filler", score: 50 },
      { text: "holistic strategies", type: "buzzword", score: 80 },
      { text: "tap into your full potential", type: "buzzword", score: 90 },
      { text: "First and foremost", type: "filler", score: 60 },
      { text: "It's also worth noting", type: "caveat", score: 70 },
      { text: "foundational aspect", type: "buzzword", score: 70 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "actionable steps", type: "buzzword", score: 80 },
      { text: "absolutely transformative", type: "buzzword", score: 80 },
      { text: "As an AI", type: "disclaimer", score: 110 },
      { text: "capacity for growth", type: "buzzword", score: 70 },
      { text: "Additionally", type: "filler", score: 40 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "deeply interconnected", type: "buzzword", score: 70 },
      { text: "In conclusion", type: "filler", score: 60 },
      { text: "comprehensive motivational overview", type: "buzzword", score: 80 },
      { text: "Please don't hesitate to reach out", type: "closer", score: 90 },
      { text: "I'm always here for you", type: "closer", score: 80 },
      { text: "I'm always here", type: "closer", score: 80 },
      { text: "I'm always here for you!", type: "closer", score: 80 },
      { text: "It's also worth noting that", type: "caveat", score: 80 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
      { text: "absolutely", type: "filler", score: 40 },
      { text: "certainly", type: "filler", score: 40 },
    ],
  },
  {
    id: 31,
    lang: 'en',
    title: "THE MEETING MINUTES MONSTER",
    emoji: "📝",
    context: "You asked an AI to summarize a 5-minute meeting in one sentence",
    falPrompt: "a robot secretary buried under avalanches of meeting notes and action items, tiny calendar exploding, cartoon",
    text: `Certainly! I'd be happy to provide a comprehensive summary of your meeting. Please note that as an AI, I wasn't present at the meeting, so I'll be working with the information provided.

MEETING SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Key Discussion Points:
• First and foremost, the team aligned on core objectives
• Furthermore, stakeholder expectations were thoroughly discussed
• It's also worth noting that several action items were identified

⚡ Action Items:
• Additionally, follow-up tasks need to be assigned
• Moreover, timelines require further clarification
• That being said, accountability mechanisms should be established

📊 Next Steps:
• In conclusion, a follow-up meeting is recommended
• It's important to note that documentation should be circulated

I hope this comprehensive meeting summary proves helpful! Please don't hesitate to reach out if you need any clarifications. I'm always here to support your team's productivity! 📅`,
    slopPhrases: [
      { text: "Certainly!", type: "opener", score: 100 },
      { text: "I'd be happy to provide", type: "opener", score: 80 },
      { text: "comprehensive summary", type: "buzzword", score: 70 },
      { text: "as an AI", type: "disclaimer", score: 110 },
      { text: "First and foremost", type: "filler", score: 60 },
      { text: "aligned on core objectives", type: "buzzword", score: 80 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "thoroughly discussed", type: "buzzword", score: 60 },
      { text: "It's also worth noting", type: "caveat", score: 70 },
      { text: "Additionally", type: "filler", score: 40 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "That being said", type: "filler", score: 50 },
      { text: "accountability mechanisms", type: "buzzword", score: 90 },
      { text: "In conclusion", type: "filler", score: 60 },
      { text: "It's important to note", type: "caveat", score: 70 },
      { text: "I hope this comprehensive meeting summary", type: "closer", score: 100 },
      { text: "Please don't hesitate to reach out", type: "closer", score: 90 },
      { text: "I'm always here to support", type: "closer", score: 80 },
      { text: "I'm always here", type: "closer", score: 80 },
      { text: "It's also worth noting that", type: "caveat", score: 80 },
      { text: "It's important to note that", type: "caveat", score: 80 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
    ],
  },
  {
    id: 32,
    lang: 'en',
    title: "THE PERFORMANCE REVIEW BOT",
    emoji: "📊",
    context: "You asked an AI to write your self-evaluation for your annual review",
    falPrompt: "a robot HR manager surrounded by performance graphs and buzzword clouds, dramatic office setting, cartoon",
    text: `Of course! I'd be delighted to help you craft a compelling self-evaluation. It's important to note that self-advocacy is a crucial aspect of professional development. As an AI, I want to emphasize that the following should be personalized to reflect your unique contributions.

PROFESSIONAL SELF-EVALUATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 Core Competencies Demonstrated:
• Leveraged synergistic cross-functional collaboration to drive impactful outcomes
• Furthermore, proactively identified and addressed key stakeholder needs
• Demonstrated a holistic approach to problem-solving throughout the year

📈 Value-Added Contributions:
• Additionally, spearheaded initiatives that moved the needle on core KPIs
• That being said, I also fostered a culture of continuous improvement
• It's also worth noting that I consistently delivered results above expectations

🌱 Areas for Growth:
• In conclusion, I am deeply committed to ongoing professional development
• Moreover, I look forward to leveraging new learnings going forward

I hope this comprehensive self-evaluation template proves helpful! Please don't hesitate to reach out if you need further assistance. I'm always happy to support your career journey! 🚀`,
    slopPhrases: [
      { text: "Of course!", type: "opener", score: 100 },
      { text: "I'd be delighted to help", type: "opener", score: 90 },
      { text: "It's important to note", type: "caveat", score: 70 },
      { text: "crucial aspect of professional development", type: "buzzword", score: 90 },
      { text: "As an AI", type: "disclaimer", score: 110 },
      { text: "synergistic cross-functional collaboration", type: "buzzword", score: 120 },
      { text: "drive impactful outcomes", type: "buzzword", score: 90 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "key stakeholder needs", type: "buzzword", score: 80 },
      { text: "holistic approach", type: "buzzword", score: 80 },
      { text: "Additionally", type: "filler", score: 40 },
      { text: "move the needle on core KPIs", type: "buzzword", score: 100 },
      { text: "That being said", type: "filler", score: 50 },
      { text: "culture of continuous improvement", type: "buzzword", score: 90 },
      { text: "It's also worth noting", type: "caveat", score: 70 },
      { text: "In conclusion", type: "filler", score: 60 },
      { text: "deeply committed", type: "buzzword", score: 70 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "leveraging new learnings going forward", type: "buzzword", score: 100 },
      { text: "I hope this comprehensive self-evaluation", type: "closer", score: 100 },
      { text: "Please don't hesitate to reach out", type: "closer", score: 90 },
      { text: "I'm always happy to support", type: "closer", score: 80 },
      { text: "I'd be delighted", type: "opener", score: 90 },
      { text: "It's also worth noting that", type: "caveat", score: 80 },
      { text: "It's important to note that", type: "caveat", score: 80 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
      { text: "crucial aspect", type: "buzzword", score: 60 },
      { text: "synergistic", type: "buzzword", score: 90 },
    ],
  },
  {
    id: 33,
    lang: 'en',
    title: "THE DEBATE DODGER",
    emoji: "⚖️",
    context: "You asked an AI: Beatles or Rolling Stones — who was better?",
    falPrompt: "two rock bands as robots facing off while an AI referee frantically waves both flags and refuses to decide, cartoon chaos",
    text: `Great question! This is truly a fascinating and nuanced debate that music enthusiasts have engaged with for decades. I want to be transparent that as an AI, I don't have personal preferences, so I'll present a balanced and comprehensive perspective.

On one hand, The Beatles demonstrated an extraordinary capacity for musical innovation. Their contributions to popular music are, arguably, without parallel. Furthermore, their cultural impact transcended mere entertainment.

That being said, The Rolling Stones offer a compelling counterargument. It's also worth noting that their longevity and raw energy represent a different but equally valid artistic vision. Additionally, their blues-influenced approach resonated deeply with millions.

It's important to acknowledge that both bands shaped modern music in profound and deeply interconnected ways. As an AI, I believe that declaring one "better" would oversimplify this rich musical legacy.

In conclusion, both bands are genuinely exceptional and the answer ultimately depends on your personal values and preferences. I hope this balanced overview helps you appreciate both perspectives! Please don't hesitate to reach out if you'd like to explore this topic further. I'm always happy to help! 🎸`,
    slopPhrases: [
      { text: "Great question!", type: "sycophant", score: 100 },
      { text: "truly a fascinating and nuanced", type: "buzzword", score: 80 },
      { text: "I want to be transparent", type: "caveat", score: 80 },
      { text: "as an AI", type: "disclaimer", score: 110 },
      { text: "balanced and comprehensive perspective", type: "buzzword", score: 80 },
      { text: "On one hand", type: "filler", score: 50 },
      { text: "extraordinary capacity", type: "buzzword", score: 70 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "cultural impact transcended", type: "buzzword", score: 80 },
      { text: "That being said", type: "filler", score: 50 },
      { text: "compelling counterargument", type: "buzzword", score: 70 },
      { text: "It's also worth noting", type: "caveat", score: 70 },
      { text: "equally valid artistic vision", type: "buzzword", score: 80 },
      { text: "Additionally", type: "filler", score: 40 },
      { text: "It's important to acknowledge", type: "caveat", score: 70 },
      { text: "deeply interconnected", type: "buzzword", score: 70 },
      { text: "As an AI", type: "disclaimer", score: 110 },
      { text: "In conclusion", type: "filler", score: 60 },
      { text: "I hope this balanced overview", type: "closer", score: 90 },
      { text: "Please don't hesitate to reach out", type: "closer", score: 90 },
      { text: "I'm always happy to help", type: "closer", score: 80 },
      { text: "I hope this balanced overview helps", type: "closer", score: 90 },
      { text: "I want to be transparent that", type: "caveat", score: 80 },
      { text: "I'm always happy to help!", type: "closer", score: 80 },
      { text: "It's also worth noting that", type: "caveat", score: 80 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
      { text: "balanced overview", type: "buzzword", score: 60 },
    ],
  },
  {
    id: 34,
    lang: 'en',
    title: "THE JOKE DISSECTOR",
    emoji: "🔬",
    context: "You asked an AI why the 'Why did the chicken cross the road?' joke is funny",
    falPrompt: "a robot surgeon dissecting a rubber chicken with scientific instruments, humor completely destroyed, cartoon",
    text: `Certainly! This is a fascinating question that touches on the intersection of linguistics, cognitive science, and humor theory. As an AI, I find the analysis of comedy to be a particularly illuminating area of study.

The humor in this joke operates on several interconnected levels:

🧠 Cognitive Mechanisms:
• First and foremost, the joke establishes an expectation of a complex or surprising answer
• Furthermore, it subverts this expectation with a mundane, literal response
• It's also worth noting that this "anti-joke" format creates incongruity

📚 Linguistic Analysis:
• That being said, the question structure implies intentionality
• Additionally, the phrase "the other side" is deliberately ambiguous
• Moreover, this ambiguity is central to the joke's comedic framework

🎭 Cultural Context:
• It's important to acknowledge that humor is deeply subjective
• As an AI, I want to be transparent that I cannot personally experience amusement
• In conclusion, the joke's longevity reflects its elegant simplicity

I hope this comprehensive comedic analysis proves illuminating! Please don't hesitate to reach out if you'd like me to analyze additional jokes. I'm always here to explore humor with you! 😄`,
    slopPhrases: [
      { text: "Certainly!", type: "opener", score: 100 },
      { text: "fascinating question", type: "sycophant", score: 80 },
      { text: "intersection of", type: "buzzword", score: 60 },
      { text: "As an AI", type: "disclaimer", score: 110 },
      { text: "particularly illuminating area of study", type: "buzzword", score: 80 },
      { text: "interconnected levels", type: "buzzword", score: 70 },
      { text: "First and foremost", type: "filler", score: 60 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "It's also worth noting", type: "caveat", score: 70 },
      { text: "That being said", type: "filler", score: 50 },
      { text: "Additionally", type: "filler", score: 40 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "comedic framework", type: "buzzword", score: 80 },
      { text: "It's important to acknowledge", type: "caveat", score: 70 },
      { text: "humor is deeply subjective", type: "disclaimer", score: 80 },
      { text: "I want to be transparent", type: "caveat", score: 80 },
      { text: "In conclusion", type: "filler", score: 60 },
      { text: "I hope this comprehensive comedic analysis", type: "closer", score: 100 },
      { text: "Please don't hesitate to reach out", type: "closer", score: 90 },
      { text: "I'm always here to explore", type: "closer", score: 80 },
      { text: "I want to be transparent that", type: "caveat", score: 80 },
      { text: "I'm always here", type: "closer", score: 80 },
      { text: "It's also worth noting that", type: "caveat", score: 80 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
    ],
  },
  {
    id: 35,
    lang: 'en',
    title: "THE APOLOGY ARCHITECT",
    emoji: "🙏",
    context: "You asked an AI to write a quick sorry text to your boss for being 5 minutes late",
    falPrompt: "a robot writing an enormous formal apology scroll for a tiny 5-minute clock, dramatic ceremony, cartoon",
    text: `Of course! I'd be happy to help you craft a professional apology. It's important to note that a well-structured apology can significantly strengthen professional relationships. As an AI, I want to emphasize that the tone should be calibrated to your specific workplace culture.

Here is a comprehensive apology template:

Subject: Sincere Apologies Regarding My Tardiness

Dear [Manager's Name],

I hope this message finds you well. I am writing to sincerely apologize for my late arrival this morning. I want to be transparent that I take punctuality very seriously and this situation does not reflect my professional standards.

Furthermore, I want to acknowledge that your time is extremely valuable. That being said, I have conducted a thorough reflection on the root causes of this delay. Additionally, I have implemented proactive measures to ensure this does not recur.

In conclusion, I remain deeply committed to upholding the highest standards of professional conduct. I hope this message helps convey the sincerity of my apology. Please don't hesitate to reach out if you'd like to discuss this further. I'm always available and committed to our team's success! 🙏`,
    slopPhrases: [
      { text: "Of course!", type: "opener", score: 100 },
      { text: "I'd be happy to help", type: "opener", score: 80 },
      { text: "It's important to note", type: "caveat", score: 70 },
      { text: "significantly strengthen", type: "buzzword", score: 70 },
      { text: "As an AI", type: "disclaimer", score: 110 },
      { text: "calibrated to your specific", type: "buzzword", score: 80 },
      { text: "comprehensive apology template", type: "buzzword", score: 80 },
      { text: "I hope this message finds you well", type: "opener", score: 110 },
      { text: "I want to be transparent", type: "caveat", score: 80 },
      { text: "does not reflect my professional standards", type: "disclaimer", score: 90 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "That being said", type: "filler", score: 50 },
      { text: "thorough reflection", type: "buzzword", score: 70 },
      { text: "root causes", type: "buzzword", score: 70 },
      { text: "Additionally", type: "filler", score: 40 },
      { text: "proactive measures", type: "buzzword", score: 80 },
      { text: "In conclusion", type: "filler", score: 60 },
      { text: "deeply committed", type: "buzzword", score: 70 },
      { text: "highest standards of professional conduct", type: "buzzword", score: 90 },
      { text: "I hope this message helps convey", type: "closer", score: 90 },
      { text: "Please don't hesitate to reach out", type: "closer", score: 90 },
      { text: "I'm always available", type: "closer", score: 70 },
      { text: "I want to acknowledge", type: "caveat", score: 70 },
      { text: "I want to be transparent that", type: "caveat", score: 80 },
      { text: "It's important to note that", type: "caveat", score: 80 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
    ],
  },
  {
    id: 36,
    lang: 'en',
    title: "THE PLANT PARENT PROFESSOR",
    emoji: "🌱",
    context: "You asked an AI: how often should I water my cactus?",
    falPrompt: "a robot botanist in a lab coat presenting a 50-slide presentation to a tiny confused cactus, cartoon academia",
    text: `Great question! I'd be delighted to help you with your cactus care journey. I want to note that as an AI, I cannot observe your specific plant, environment, or growing conditions, so please take my guidance as general recommendations rather than definitive prescriptions.

🌵 COMPREHENSIVE CACTUS CARE GUIDE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💧 Watering Fundamentals:
• First and foremost, it's crucial to understand that overwatering is the primary cause of cactus mortality
• Furthermore, the "soak and dry" method is a foundational approach
• It's also worth noting that seasonal variation significantly impacts watering frequency

🌡️ Environmental Considerations:
• That being said, humidity levels in your home play an absolutely essential role
• Additionally, pot drainage is a critical component of successful cactus cultivation
• Moreover, soil composition deeply affects moisture retention

📊 Seasonal Schedule:
• Spring/Summer: Water every 2-3 weeks (growing season)
• Fall/Winter: Reduce to once monthly or less

In conclusion, your cactus will thrive with attentive but restrained care! I sincerely hope this comprehensive cactus care overview proves helpful. Please don't hesitate to reach out with further questions. I'm always here to support your plant parenting journey! 🌵`,
    slopPhrases: [
      { text: "Great question!", type: "sycophant", score: 100 },
      { text: "I'd be delighted to help", type: "opener", score: 90 },
      { text: "cactus care journey", type: "buzzword", score: 70 },
      { text: "as an AI", type: "disclaimer", score: 110 },
      { text: "please take my guidance as general recommendations rather than definitive prescriptions", type: "disclaimer", score: 100 },
      { text: "First and foremost", type: "filler", score: 60 },
      { text: "it's crucial to understand", type: "caveat", score: 70 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "foundational approach", type: "buzzword", score: 70 },
      { text: "It's also worth noting", type: "caveat", score: 70 },
      { text: "That being said", type: "filler", score: 50 },
      { text: "absolutely essential role", type: "buzzword", score: 80 },
      { text: "Additionally", type: "filler", score: 40 },
      { text: "critical component", type: "buzzword", score: 80 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "deeply affects", type: "buzzword", score: 60 },
      { text: "In conclusion", type: "filler", score: 60 },
      { text: "I sincerely hope this comprehensive", type: "closer", score: 100 },
      { text: "Please don't hesitate to reach out", type: "closer", score: 90 },
      { text: "I'm always here to support", type: "closer", score: 80 },
      { text: "I want to note", type: "caveat", score: 60 },
      { text: "I want to note that", type: "caveat", score: 70 },
      { text: "I'd be delighted", type: "opener", score: 90 },
      { text: "I'm always here", type: "closer", score: 80 },
      { text: "It's also worth noting that", type: "caveat", score: 80 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
      { text: "absolutely", type: "filler", score: 40 },
    ],
  },
  {
    id: 37,
    lang: 'en',
    title: "THE JOB INTERVIEW COACH",
    emoji: "👔",
    context: "You asked an AI: how do I answer 'tell me about yourself' in an interview?",
    falPrompt: "a robot job coach presenting a 47-point PowerPoint to a nervous human in a tiny chair, cartoon office chaos",
    text: `Absolutely! I'm thrilled to help you prepare for this important moment. It's worth noting that the "tell me about yourself" question is one of the most pivotal aspects of any interview. As an AI, I want to emphasize that my suggestions should be adapted to your specific industry and personal brand.

Here is a comprehensive framework for crafting your response:

🎯 THE P.A.S.T. METHOD:
• Professional Background: First and foremost, briefly summarize your career trajectory
• Achievements: Furthermore, highlight 2-3 quantifiable accomplishments that demonstrate value
• Skills: It's also worth noting that transferable competencies should be emphasized
• Transition: That being said, connect your narrative to why this role is a natural next step

⚠️ Common Pitfalls to Avoid:
• Additionally, avoid rambling — conciseness is an essential component of strong communication
• Moreover, do not simply recite your resume verbatim
• It's important to acknowledge that authenticity is deeply valued by interviewers

💡 Pro Tips:
• As an AI, I'd also recommend practicing your response out loud beforehand
• In conclusion, aim for a 90-second response that tells a compelling story

I sincerely hope this comprehensive interview guide helps you land your dream role! Please don't hesitate to reach out for more preparation support. I'm always here for you! 💼`,
    slopPhrases: [
      { text: "Absolutely!", type: "opener", score: 100 },
      { text: "I'm thrilled to help", type: "opener", score: 90 },
      { text: "It's worth noting", type: "caveat", score: 60 },
      { text: "pivotal aspects", type: "buzzword", score: 70 },
      { text: "As an AI", type: "disclaimer", score: 110 },
      { text: "personal brand", type: "buzzword", score: 80 },
      { text: "comprehensive framework", type: "buzzword", score: 70 },
      { text: "First and foremost", type: "filler", score: 60 },
      { text: "career trajectory", type: "buzzword", score: 70 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "quantifiable accomplishments", type: "buzzword", score: 80 },
      { text: "demonstrate value", type: "buzzword", score: 70 },
      { text: "It's also worth noting", type: "caveat", score: 70 },
      { text: "transferable competencies", type: "buzzword", score: 90 },
      { text: "That being said", type: "filler", score: 50 },
      { text: "Additionally", type: "filler", score: 40 },
      { text: "essential component of strong communication", type: "buzzword", score: 90 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "It's important to acknowledge", type: "caveat", score: 70 },
      { text: "deeply valued", type: "buzzword", score: 70 },
      { text: "In conclusion", type: "filler", score: 60 },
      { text: "I sincerely hope this comprehensive", type: "closer", score: 100 },
      { text: "Please don't hesitate to reach out", type: "closer", score: 90 },
      { text: "I'm always here for you", type: "closer", score: 80 },
      { text: "I'm always here", type: "closer", score: 80 },
      { text: "I'm always here for you!", type: "closer", score: 80 },
      { text: "It's also worth noting that", type: "caveat", score: 80 },
      { text: "It's worth noting that", type: "caveat", score: 80 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
      { text: "essential component", type: "buzzword", score: 60 },
    ],
  },
  {
    id: 38,
    lang: 'en',
    title: "THE BREAKFAST PHILOSOPHER",
    emoji: "🍳",
    context: "You asked an AI: should I eat breakfast?",
    falPrompt: "a robot philosopher contemplating a single egg on a pedestal while writing a dissertation, dramatic lighting, cartoon",
    text: `What a thoughtful question! I want to acknowledge that breakfast is a deeply personal decision that intersects with nutrition science, chronobiology, and individual lifestyle factors. As an AI, I cannot provide personalized medical or nutritional advice, so please consult a qualified healthcare professional.

That being said, here is a balanced and comprehensive overview of current perspectives:

✅ Arguments For Eating Breakfast:
• First and foremost, research suggests breakfast may support metabolic function
• Furthermore, cognitive performance throughout the morning may benefit
• It's also worth noting that hunger regulation is deeply affected by morning eating patterns

❌ Arguments Against Mandatory Breakfast:
• Additionally, intermittent fasting has gained significant traction in wellness communities
• Moreover, individual metabolic responses vary considerably
• That being said, forcing yourself to eat when not hungry may be counterproductive

⚖️ Nuanced Considerations:
• It's important to acknowledge that food quality matters more than timing in many studies
• As an AI, I find this area of nutritional science to be a genuinely fascinating and evolving landscape
• In conclusion, the optimal approach depends on your unique biology and circumstances

I hope this balanced breakfast overview helps inform your decision! Please don't hesitate to reach out. I'm always here to help with your wellness questions! 🌅`,
    slopPhrases: [
      { text: "What a thoughtful question!", type: "sycophant", score: 100 },
      { text: "I want to acknowledge", type: "caveat", score: 70 },
      { text: "deeply personal decision", type: "buzzword", score: 70 },
      { text: "intersects with", type: "buzzword", score: 60 },
      { text: "As an AI", type: "disclaimer", score: 110 },
      { text: "please consult a qualified healthcare professional", type: "disclaimer", score: 100 },
      { text: "That being said", type: "filler", score: 50 },
      { text: "balanced and comprehensive overview", type: "buzzword", score: 80 },
      { text: "First and foremost", type: "filler", score: 60 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "It's also worth noting", type: "caveat", score: 70 },
      { text: "deeply affected", type: "buzzword", score: 60 },
      { text: "Additionally", type: "filler", score: 40 },
      { text: "gained significant traction", type: "buzzword", score: 80 },
      { text: "wellness communities", type: "buzzword", score: 70 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "It's important to acknowledge", type: "caveat", score: 70 },
      { text: "genuinely fascinating and evolving landscape", type: "buzzword", score: 90 },
      { text: "In conclusion", type: "filler", score: 60 },
      { text: "I hope this balanced breakfast overview", type: "closer", score: 90 },
      { text: "Please don't hesitate to reach out", type: "closer", score: 90 },
      { text: "I'm always here to help", type: "closer", score: 80 },
      { text: "I'm always here", type: "closer", score: 80 },
      { text: "It's also worth noting that", type: "caveat", score: 80 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
      { text: "comprehensive overview", type: "comprehensive", score: 70 },
      { text: "considerably", type: "buzzword", score: 50 },
      { text: "intersects", type: "buzzword", score: 50 },
    ],
  },
  {
    id: 39,
    lang: 'en',
    title: "THE FORTUNE TELLER REFUSAL",
    emoji: "🔮",
    context: "You asked an AI: will I get the job I applied for?",
    falPrompt: "a robot fortune teller staring into a crystal ball filled with disclaimers and question marks, dramatic purple smoke, cartoon",
    text: `I appreciate you sharing this exciting opportunity with me! I want to be transparent that as an AI, I am fundamentally unable to predict future outcomes. That being said, I can certainly offer some valuable perspective on your situation.

It's important to acknowledge that job outcomes depend on a multifaceted array of factors including your qualifications, interview performance, competition, and organizational fit. Furthermore, these variables are deeply interconnected and difficult to assess without comprehensive information.

As an AI language model, I genuinely want to support your journey, but I must be honest that making predictions would be outside the scope of what I can responsibly provide. It's also worth noting that uncertainty itself is a natural and important component of career growth.

What I can help with:
• Preparation strategies to maximize your chances
• Additionally, mindset techniques to manage interview anxiety
• Moreover, how to follow up professionally after your interview

In conclusion, regardless of this specific outcome, every opportunity is a valuable learning experience. I hope this overview helps provide some clarity! Please don't hesitate to reach out for more support. I'm always here for you during this journey! 🌟`,
    slopPhrases: [
      { text: "I appreciate you sharing", type: "opener", score: 80 },
      { text: "I want to be transparent", type: "caveat", score: 80 },
      { text: "as an AI", type: "disclaimer", score: 110 },
      { text: "fundamentally unable", type: "disclaimer", score: 90 },
      { text: "That being said", type: "filler", score: 50 },
      { text: "It's important to acknowledge", type: "caveat", score: 70 },
      { text: "multifaceted array of factors", type: "buzzword", score: 100 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "deeply interconnected", type: "buzzword", score: 70 },
      { text: "comprehensive information", type: "buzzword", score: 60 },
      { text: "As an AI language model", type: "disclaimer", score: 120 },
      { text: "outside the scope of what I can responsibly provide", type: "disclaimer", score: 110 },
      { text: "It's also worth noting", type: "caveat", score: 70 },
      { text: "natural and important component", type: "buzzword", score: 70 },
      { text: "Additionally", type: "filler", score: 40 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "In conclusion", type: "filler", score: 60 },
      { text: "valuable learning experience", type: "buzzword", score: 70 },
      { text: "I hope this overview helps provide some clarity", type: "closer", score: 90 },
      { text: "Please don't hesitate to reach out", type: "closer", score: 90 },
      { text: "I'm always here for you", type: "closer", score: 80 },
      { text: "As an AI", type: "disclaimer", score: 120 },
      { text: "I hope this overview helps", type: "closer", score: 90 },
      { text: "I want to be transparent that", type: "caveat", score: 80 },
      { text: "I'm always here", type: "closer", score: 80 },
      { text: "It's also worth noting that", type: "caveat", score: 80 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
      { text: "certainly", type: "filler", score: 40 },
      { text: "multifaceted", type: "buzzword", score: 70 },
    ],
  },
  {
    id: 40,
    lang: 'en',
    title: "THE SYNONYM EXPLOSION",
    emoji: "📚",
    context: "You asked an AI for a synonym for 'happy'",
    falPrompt: "a robot exploding with thesaurus pages and dictionary confetti from a single word, cartoon absurdity",
    text: `Certainly! I'd be delighted to help you explore synonyms for the word "happy"! As an AI language model, I find lexical exploration to be a genuinely fascinating area of inquiry. I want to note that word choice is a deeply nuanced aspect of communication.

Here is a comprehensive taxonomy of happiness-related vocabulary:

😊 Mild Contentment:
• Pleased, content, satisfied — it's worth noting these imply a quieter joy
• Furthermore, "glad" carries subtly different connotations depending on context

🌟 Moderate Joy:
• Cheerful, jolly, elated — that being said, register and tone matter significantly
• Additionally, "delighted" (which I happen to be!) implies pleasant surprise

🎉 Intense Happiness:
• Ecstatic, euphoric, overjoyed — it's also worth noting these are quite emphatic
• Moreover, "thrilled" and "elated" are commonly used in professional contexts

🤔 Nuanced Alternatives:
• As an AI, I want to be transparent that emotional vocabulary varies across cultures
• In conclusion, the "best" synonym depends entirely on your specific context and intent

I hope this comprehensive lexical exploration proves helpful! Please don't hesitate to reach out if you need more vocabulary assistance. I'm always here to enrich your linguistic journey! 📖`,
    slopPhrases: [
      { text: "Certainly!", type: "opener", score: 100 },
      { text: "I'd be delighted to help", type: "opener", score: 90 },
      { text: "As an AI language model", type: "disclaimer", score: 120 },
      { text: "genuinely fascinating area of inquiry", type: "buzzword", score: 80 },
      { text: "I want to note", type: "caveat", score: 60 },
      { text: "deeply nuanced aspect", type: "buzzword", score: 80 },
      { text: "comprehensive taxonomy", type: "buzzword", score: 80 },
      { text: "it's worth noting", type: "caveat", score: 60 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "subtly different connotations", type: "buzzword", score: 70 },
      { text: "That being said", type: "filler", score: 50 },
      { text: "register and tone matter significantly", type: "buzzword", score: 80 },
      { text: "Additionally", type: "filler", score: 40 },
      { text: "It's also worth noting", type: "caveat", score: 70 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "As an AI", type: "disclaimer", score: 110 },
      { text: "I want to be transparent", type: "caveat", score: 80 },
      { text: "In conclusion", type: "filler", score: 60 },
      { text: "I hope this comprehensive lexical exploration", type: "closer", score: 100 },
      { text: "Please don't hesitate to reach out", type: "closer", score: 90 },
      { text: "I'm always here to enrich", type: "closer", score: 80 },
      { text: "I want to be transparent that", type: "caveat", score: 80 },
      { text: "I want to note that", type: "caveat", score: 70 },
      { text: "I'd be delighted", type: "opener", score: 90 },
      { text: "I'm always here", type: "closer", score: 80 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
    ],
  },
  {
    id: 41,
    lang: 'en',
    title: "THE PROJECT STATUS UPDATER",
    emoji: "🚀",
    context: "Your manager asked how the project is going — you used AI to reply",
    falPrompt: "a robot project manager surrounded by colorful charts all saying 'on track' while everything behind is on fire, cartoon",
    text: `I hope this message finds you well! I wanted to provide you with a comprehensive project status update that holistically captures our current trajectory.

📊 EXECUTIVE SUMMARY
━━━━━━━━━━━━━━━━━━━━━━
Overall Status: 🟡 On Track with Considerations

🎯 Key Highlights:
• First and foremost, the team continues to demonstrate exceptional commitment
• Furthermore, we have successfully navigated several complex interdependencies
• It's also worth noting that stakeholder alignment remains a top priority

⚠️ Risks & Mitigations:
• That being said, there are some emerging challenges that warrant attention
• Additionally, resource constraints may impact our timeline going forward
• As an AI assistant, I want to be transparent about these uncertainties

📅 Next Steps:
• Moreover, we are actively exploring pathways to optimize our delivery
• In conclusion, we remain deeply committed to achieving our objectives

I sincerely hope this comprehensive status update provides the clarity you need! Please don't hesitate to reach out if you'd like to discuss any aspect further. I'm always available to support the team's success! 💪`,
    slopPhrases: [
      { text: "I hope this message finds you well", type: "opener", score: 110 },
      { text: "comprehensive project status update", type: "buzzword", score: 80 },
      { text: "holistically captures", type: "buzzword", score: 90 },
      { text: "current trajectory", type: "buzzword", score: 70 },
      { text: "First and foremost", type: "filler", score: 60 },
      { text: "exceptional commitment", type: "sycophant", score: 80 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "complex interdependencies", type: "buzzword", score: 100 },
      { text: "It's also worth noting", type: "caveat", score: 70 },
      { text: "stakeholder alignment", type: "buzzword", score: 90 },
      { text: "That being said", type: "filler", score: 50 },
      { text: "Additionally", type: "filler", score: 40 },
      { text: "As an AI assistant", type: "disclaimer", score: 110 },
      { text: "I want to be transparent", type: "caveat", score: 80 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "optimize our delivery", type: "buzzword", score: 80 },
      { text: "In conclusion", type: "filler", score: 60 },
      { text: "deeply committed to achieving our objectives", type: "buzzword", score: 90 },
      { text: "I sincerely hope this comprehensive", type: "closer", score: 100 },
      { text: "Please don't hesitate to reach out", type: "closer", score: 90 },
      { text: "I'm always available to support", type: "closer", score: 80 },
      { text: "As an AI", type: "disclaimer", score: 120 },
      { text: "I want to be transparent about", type: "caveat", score: 70 },
      { text: "I'm always available", type: "closer", score: 70 },
      { text: "It's also worth noting that", type: "caveat", score: 80 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
      { text: "deeply committed", type: "buzzword", score: 70 },
    ],
  },
  {
    id: 42,
    lang: 'en',
    title: "THE TRANSLATOR TANGENT",
    emoji: "🌍",
    context: "You asked an AI to translate 'hello' into Spanish",
    falPrompt: "a robot translator buried under cultural context books and etymology scrolls just to say one word, cartoon absurdity",
    text: `Certainly! I'd be happy to help with this translation. Before providing the answer, I want to offer some cultural and linguistic context that will enrich your understanding of this seemingly simple word.

It's important to note that Spanish is spoken by over 500 million people across numerous countries, each with their own regional variations and cultural nuances. As an AI language model, I find the diversity of Spanish dialects to be a genuinely fascinating area of study.

That being said, the translation of "hello" in Spanish depends on the context, formality level, and regional variety you're targeting:

🇪🇸 Standard Castilian Spanish:
• "Hola" — it's worth noting this is the universally understood greeting
• Furthermore, "Buenos días/tardes/noches" are time-specific alternatives

🌎 Regional Variations:
• Additionally, some Latin American regions use informal greetings like "Buenas"
• Moreover, context matters deeply when selecting the appropriate greeting
• It's also worth noting that formality levels vary significantly across cultures

As an AI, I want to be transparent that linguistic nuance is a rich and complex area. In conclusion, the answer is: hola. I hope this comprehensive translation guide proves illuminating! I'm always here to support your language learning journey! 🌐`,
    slopPhrases: [
      { text: "Certainly!", type: "opener", score: 100 },
      { text: "I'd be happy to help", type: "opener", score: 80 },
      { text: "enrich your understanding", type: "sycophant", score: 70 },
      { text: "It's important to note", type: "caveat", score: 70 },
      { text: "As an AI language model", type: "disclaimer", score: 120 },
      { text: "genuinely fascinating area of study", type: "buzzword", score: 80 },
      { text: "That being said", type: "filler", score: 50 },
      { text: "it's worth noting", type: "caveat", score: 60 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "Additionally", type: "filler", score: 40 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "context matters deeply", type: "buzzword", score: 70 },
      { text: "It's also worth noting", type: "caveat", score: 70 },
      { text: "As an AI", type: "disclaimer", score: 110 },
      { text: "I want to be transparent", type: "caveat", score: 80 },
      { text: "rich and complex area", type: "buzzword", score: 70 },
      { text: "In conclusion", type: "filler", score: 60 },
      { text: "I hope this comprehensive translation guide", type: "closer", score: 100 },
      { text: "I'm always here to support", type: "closer", score: 80 },
      { text: "I want to be transparent that", type: "caveat", score: 80 },
      { text: "I'm always here", type: "closer", score: 80 },
      { text: "It's also worth noting that", type: "caveat", score: 80 },
      { text: "It's important to note that", type: "caveat", score: 80 },
    ],
  },
  {
    id: 43,
    lang: 'en',
    title: "THE BIRTHDAY CARD BUREAUCRAT",
    emoji: "🎂",
    context: "You asked an AI to write a birthday message for your friend",
    falPrompt: "a robot drafting a formal legal birthday document with stamp and seal, tiny birthday cake to the side, cartoon",
    text: `Certainly! I'd be delighted to help you craft a heartfelt birthday message. I want to note that birthday messages are a deeply personal form of communication, and my suggestions should be adapted to reflect your unique relationship with the recipient.

Here is a comprehensive selection of birthday message templates:

🎉 FORMAL OPTION:
Dear [Friend's Name], I hope this message finds you in excellent health and high spirits. I am writing to extend my warmest felicitations on the occasion of your birthday. Furthermore, I want to express my sincere appreciation for your continued presence in my life.

🌟 SEMI-FORMAL OPTION:
That being said, if a warmer tone is appropriate: It is with great joy that I acknowledge this special milestone in your personal journey. Additionally, may this new year of life bring you abundant opportunities for growth and fulfillment.

🎊 CASUAL OPTION:
It's also worth noting that a more informal approach may be suitable: Hey! Happy birthday! As an AI, I want to be transparent that the most meaningful messages come from genuine personal reflection.

In conclusion, I hope one of these comprehensive templates resonates with you! Please don't hesitate to reach out for further customization. I'm always here to help with your communication needs! 🎈`,
    slopPhrases: [
      { text: "Certainly!", type: "opener", score: 100 },
      { text: "I'd be delighted to help", type: "opener", score: 90 },
      { text: "I want to note", type: "caveat", score: 60 },
      { text: "deeply personal form of communication", type: "buzzword", score: 80 },
      { text: "comprehensive selection", type: "buzzword", score: 70 },
      { text: "I hope this message finds you in excellent health and high spirits", type: "opener", score: 110 },
      { text: "warmest felicitations", type: "buzzword", score: 90 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "sincere appreciation", type: "sycophant", score: 80 },
      { text: "That being said", type: "filler", score: 50 },
      { text: "meaningful milestone", type: "buzzword", score: 70 },
      { text: "personal journey", type: "buzzword", score: 70 },
      { text: "Additionally", type: "filler", score: 40 },
      { text: "abundant opportunities for growth and fulfillment", type: "buzzword", score: 90 },
      { text: "It's also worth noting", type: "caveat", score: 70 },
      { text: "As an AI", type: "disclaimer", score: 110 },
      { text: "I want to be transparent", type: "caveat", score: 80 },
      { text: "genuine personal reflection", type: "buzzword", score: 70 },
      { text: "In conclusion", type: "filler", score: 60 },
      { text: "Please don't hesitate to reach out", type: "closer", score: 90 },
      { text: "I'm always here to help", type: "closer", score: 80 },
      { text: "I want to be transparent that", type: "caveat", score: 80 },
      { text: "I want to note that", type: "caveat", score: 70 },
      { text: "I'd be delighted", type: "opener", score: 90 },
      { text: "I'm always here", type: "closer", score: 80 },
      { text: "It's also worth noting that", type: "caveat", score: 80 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
      { text: "comprehensive template", type: "comprehensive", score: 70 },
    ],
  },
  {
    id: 44,
    lang: 'en',
    title: "THE LEGAL DISCLAIMER MACHINE",
    emoji: "⚖️",
    context: "You asked an AI: is it illegal to jaywalk?",
    falPrompt: "a robot lawyer in a courtroom presenting 50-page disclaimer for crossing a street, jury of robots nodding, cartoon",
    text: `Great question! I want to be transparent upfront that I am not a licensed attorney and nothing I provide constitutes legal advice. As an AI, I strongly encourage you to consult a qualified legal professional for any specific legal concerns.

That being said, I can offer some general educational information on this topic:

📜 General Overview:
• First and foremost, jaywalking laws vary significantly by jurisdiction
• Furthermore, what constitutes jaywalking differs between municipalities, states, and countries
• It's also worth noting that enforcement practices vary considerably

⚠️ Important Disclaimers:
• As an AI language model, I cannot guarantee the accuracy or currency of this information
• Additionally, laws change frequently and my knowledge may not reflect recent updates
• Moreover, individual circumstances can significantly impact legal outcomes
• It's crucial to acknowledge that only a licensed attorney can advise on your specific situation

🌍 Jurisdictional Considerations:
• That being said, in many US states, crossing outside a crosswalk is technically illegal
• However, it's important to understand that this is a deeply nuanced legal area

In conclusion, I hope this general overview proves helpful! Please don't hesitate to consult a legal professional for definitive guidance. I'm always here, but please remember I'm not a lawyer! ⚖️`,
    slopPhrases: [
      { text: "Great question!", type: "sycophant", score: 100 },
      { text: "I want to be transparent", type: "caveat", score: 80 },
      { text: "I am not a licensed attorney", type: "disclaimer", score: 110 },
      { text: "nothing I provide constitutes legal advice", type: "disclaimer", score: 120 },
      { text: "As an AI", type: "disclaimer", score: 110 },
      { text: "consult a qualified legal professional", type: "disclaimer", score: 100 },
      { text: "That being said", type: "filler", score: 50 },
      { text: "First and foremost", type: "filler", score: 60 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "It's also worth noting", type: "caveat", score: 70 },
      { text: "As an AI language model", type: "disclaimer", score: 120 },
      { text: "Additionally", type: "filler", score: 40 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "individual circumstances can significantly impact", type: "disclaimer", score: 80 },
      { text: "It's crucial to acknowledge", type: "caveat", score: 80 },
      { text: "only a licensed attorney can advise", type: "disclaimer", score: 110 },
      { text: "That being said", type: "filler", score: 50 },
      { text: "it's important to understand", type: "caveat", score: 70 },
      { text: "deeply nuanced legal area", type: "buzzword", score: 80 },
      { text: "In conclusion", type: "filler", score: 60 },
      { text: "Please don't hesitate to consult", type: "closer", score: 90 },
      { text: "I'm always here", type: "closer", score: 80 },
      { text: "However", type: "filler", score: 30 },
      { text: "It's also worth noting that", type: "caveat", score: 80 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
      { text: "considerably", type: "buzzword", score: 50 },
    ],
  },
  {
    id: 45,
    lang: 'en',
    title: "THE SOCIAL MEDIA STRATEGIST",
    emoji: "📱",
    context: "You asked an AI to write a tweet about your new haircut",
    falPrompt: "a robot social media expert with charts and engagement metrics analyzing a single hair strand under microscope, cartoon",
    text: `Absolutely! I'd be happy to help you craft compelling social media content about your haircut. It's important to note that effective social media copy requires a strategic approach that aligns with your personal brand and target audience. As an AI, I want to emphasize that authentic engagement is key.

Here is a comprehensive content framework:

🎯 HIGH-ENGAGEMENT OPTIONS:
Option 1 (Relatable): "New haircut just dropped 💇 Furthermore, treating myself is always a good idea!"
Option 2 (Aspirational): "That being said, sometimes a fresh cut is all you need to unlock your full potential ✨"
Option 3 (Conversational): "It's also worth noting that this haircut was deeply overdue 😂"

📊 ENGAGEMENT OPTIMIZATION TIPS:
• Additionally, posting between 7-9pm maximizes reach on most platforms
• Moreover, using 3-5 relevant hashtags is an essential component of discoverability
• As an AI, I want to be transparent that algorithm behavior changes frequently
• It's crucial to acknowledge that authentic content always outperforms formulaic posts

In conclusion, I hope these comprehensive tweet options resonate with your audience! Please don't hesitate to share more about your brand voice. I'm always here to elevate your social media presence! 🚀`,
    slopPhrases: [
      { text: "Absolutely!", type: "opener", score: 100 },
      { text: "I'd be happy to help", type: "opener", score: 80 },
      { text: "It's important to note", type: "caveat", score: 70 },
      { text: "strategic approach", type: "buzzword", score: 70 },
      { text: "personal brand", type: "buzzword", score: 80 },
      { text: "As an AI", type: "disclaimer", score: 110 },
      { text: "authentic engagement", type: "buzzword", score: 80 },
      { text: "comprehensive content framework", type: "buzzword", score: 80 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "That being said", type: "filler", score: 50 },
      { text: "unlock your full potential", type: "buzzword", score: 90 },
      { text: "It's also worth noting", type: "caveat", score: 70 },
      { text: "deeply overdue", type: "buzzword", score: 60 },
      { text: "Additionally", type: "filler", score: 40 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "essential component of discoverability", type: "buzzword", score: 90 },
      { text: "I want to be transparent", type: "caveat", score: 80 },
      { text: "It's crucial to acknowledge", type: "caveat", score: 80 },
      { text: "authentic content always outperforms formulaic posts", type: "buzzword", score: 90 },
      { text: "In conclusion", type: "filler", score: 60 },
      { text: "I hope these comprehensive tweet options", type: "closer", score: 100 },
      { text: "Please don't hesitate to share", type: "closer", score: 80 },
      { text: "I'm always here to elevate", type: "closer", score: 80 },
      { text: "I want to be transparent that", type: "caveat", score: 80 },
      { text: "I'm always here", type: "closer", score: 80 },
      { text: "It's also worth noting that", type: "caveat", score: 80 },
      { text: "It's important to note that", type: "caveat", score: 80 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
      { text: "essential component", type: "buzzword", score: 60 },
    ],
  },
  {
    id: 46,
    lang: 'en',
    title: "THE WEATHER PHILOSOPHER",
    emoji: "🌦️",
    context: "You asked an AI if it will rain tomorrow",
    falPrompt: "a robot meteorologist drowning in weather disclaimers and uncertainty charts while a simple rain cloud floats overhead, cartoon",
    text: `What a fascinating question! I want to be transparent that as an AI, I don't have access to real-time weather data or forecasting capabilities. That being said, I can certainly offer some thoughtful context around weather prediction.

It's important to acknowledge that weather forecasting is a deeply complex field that intersects meteorology, atmospheric science, and computational modeling. As an AI language model, I am fundamentally unable to predict tomorrow's weather for your location.

Furthermore, it's worth noting that even professional meteorologists operate within significant uncertainty margins. Additionally, hyperlocal weather patterns can vary considerably from regional forecasts.

🌤️ What You Can Do Instead:
• First and foremost, I'd recommend checking a dedicated weather service like Weather.com
• Moreover, local news stations provide location-specific forecasts
• It's also crucial to note that weather apps use real-time satellite data that I cannot access

🌡️ General Considerations:
• That being said, seasonal patterns may offer some general guidance
• In conclusion, cloud cover, humidity, and pressure systems are deeply interconnected variables
• As an AI, I want to be honest: I genuinely have no idea if it will rain

I hope this comprehensive weather overview proves illuminating despite its limitations! Please don't hesitate to reach out with other questions. I'm always here — rain or shine! ☀️🌧️`,
    slopPhrases: [
      { text: "What a fascinating question!", type: "sycophant", score: 100 },
      { text: "I want to be transparent", type: "caveat", score: 80 },
      { text: "as an AI", type: "disclaimer", score: 110 },
      { text: "That being said", type: "filler", score: 50 },
      { text: "It's important to acknowledge", type: "caveat", score: 70 },
      { text: "deeply complex field", type: "buzzword", score: 70 },
      { text: "intersects", type: "buzzword", score: 50 },
      { text: "As an AI language model", type: "disclaimer", score: 120 },
      { text: "fundamentally unable", type: "disclaimer", score: 90 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "it's worth noting", type: "caveat", score: 60 },
      { text: "significant uncertainty margins", type: "buzzword", score: 80 },
      { text: "Additionally", type: "filler", score: 40 },
      { text: "considerably", type: "buzzword", score: 50 },
      { text: "First and foremost", type: "filler", score: 60 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "It's also crucial to note", type: "caveat", score: 80 },
      { text: "That being said", type: "filler", score: 50 },
      { text: "In conclusion", type: "filler", score: 60 },
      { text: "deeply interconnected variables", type: "buzzword", score: 80 },
      { text: "As an AI", type: "disclaimer", score: 110 },
      { text: "I hope this comprehensive weather overview", type: "closer", score: 100 },
      { text: "Please don't hesitate to reach out", type: "closer", score: 90 },
      { text: "I'm always here", type: "closer", score: 80 },
      { text: "I want to be transparent that", type: "caveat", score: 80 },
      { text: "It's also crucial to note that", type: "caveat", score: 90 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
      { text: "certainly", type: "filler", score: 40 },
      { text: "deeply interconnected", type: "buzzword", score: 70 },
      { text: "fascinating question", type: "sycophant", score: 80 },
      { text: "it's worth noting that", type: "caveat", score: 80 },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // INVERSE ROUNDS — find the HUMAN phrases hiding in the slop
  // ═══════════════════════════════════════════════════════════

  {
    id: 47,
    lang: 'en',
    inverse: true,
    title: "THE CODE REVIEW",
    emoji: "👨‍💻",
    context: "A developer left real thoughts inside an AI code review. Find them.",
    falPrompt: "a tired human programmer hiding inside a robot, surrounded by AI-generated code review text, glowing human eyes, digital art",
    text: `Thank you for submitting this pull request! I'd be happy to provide a comprehensive code review. As an AI code reviewer, I can offer a holistic analysis of your implementation patterns and architectural decisions.

Certainly! The architecture demonstrates a robust understanding of software design principles. That being said, this is completely wrong — the module separation would benefit from a more synergistic approach to separation of concerns and dependency management.

Moreover, it's important to note that I cried a little when I first read line 247. The test suite appears comprehensive and well-structured. Furthermore, the documentation reflects a nuanced understanding of the problem domain at hand.

In conclusion, please just delete this file and start fresh. I hope this helps! Please don't hesitate to let me know if you have any further questions about this comprehensive and holistic code review!`,
    slopPhrases: [
      { text: "this is completely wrong", type: "human", score: 150 },
      { text: "I cried a little", type: "human", score: 180 },
      { text: "please just delete this file", type: "human", score: 200 },
      { text: "As an AI", type: "disclaimer", score: 120 },
      { text: "Certainly!", type: "opener", score: 100 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "I hope this helps", type: "closer", score: 100 },
      { text: "I'd be happy to provide", type: "opener", score: 80 },
      { text: "In conclusion", type: "filler", score: 60 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
      { text: "Please don't hesitate to let me know", type: "closer", score: 90 },
      { text: "That being said", type: "filler", score: 60 },
      { text: "comprehensive code review", type: "buzzword", score: 70 },
      { text: "it's important to note that", type: "caveat", score: 80 },
      { text: "synergistic", type: "buzzword", score: 90 },
    ],
  },

  {
    id: 48,
    lang: 'en',
    inverse: true,
    title: "CUSTOMER SUPPORT CHAOS",
    emoji: "📞",
    context: "A customer's real rage got buried in AI support language. Find it.",
    falPrompt: "a furious human customer trapped inside a polite customer service robot, surrounded by floating apology text bubbles, cartoon",
    text: `Thank you for reaching out to our support team! I'd be happy to help resolve your concern today. As a valued customer, your experience is our top priority and we sincerely appreciate your patience with us.

Certainly! I understand that you're experiencing a technical issue with your product. That being said, my microwave exploded and I need a replacement immediately. We sincerely apologize for any inconvenience this may have caused to your daily routine and cooking experience.

Furthermore, I want to acknowledge that I've called six times already and nobody has helped me. It's important to note that our team is fully committed to providing holistic solutions to your needs. Moreover, we value your comprehensive feedback as part of our service improvement process.

In conclusion, I want a refund not a poem. I hope this message finds you well and that we can work together toward a mutually beneficial resolution! Please don't hesitate to reach out if you require any further assistance!`,
    slopPhrases: [
      { text: "my microwave exploded", type: "human", score: 200 },
      { text: "I've called six times already and nobody has helped me", type: "human", score: 160 },
      { text: "I want a refund not a poem", type: "human", score: 180 },
      { text: "Certainly!", type: "opener", score: 100 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "I hope this message finds you well", type: "opener", score: 110 },
      { text: "I want to acknowledge", type: "caveat", score: 70 },
      { text: "I'd be happy to help", type: "opener", score: 80 },
      { text: "In conclusion", type: "filler", score: 60 },
      { text: "It's important to note", type: "caveat", score: 70 },
      { text: "It's important to note that", type: "caveat", score: 80 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
      { text: "Please don't hesitate to reach out", type: "closer", score: 90 },
      { text: "That being said", type: "filler", score: 60 },
    ],
  },

  {
    id: 49,
    lang: 'en',
    inverse: true,
    title: "THE THERAPY TRANSCRIPT",
    emoji: "🛋️",
    context: "Life advice went through an AI filter. Rescue the real feelings.",
    falPrompt: "a small human sitting on a couch surrounded by giant robotic therapy arms holding clipboards, cozy and absurd, digital art",
    text: `Thank you for sharing that with me! I'd be happy to help you explore these feelings in a holistic and compassionate way. As a supportive presence, I can offer a comprehensive perspective on your emotional wellbeing journey.

Certainly! It sounds like you're navigating some complex and multifaceted life circumstances. That being said, I just miss my dog — he was the only one who didn't need me to explain myself. It's important to acknowledge these feelings as valid and meaningful parts of the healing process.

Furthermore, leveraging self-care strategies can revolutionize your emotional wellbeing in significant ways. That being said, work is actually fine it's me. Moreover, our synergistic approach to personal growth includes robust coping mechanisms and deeply actionable frameworks.

In conclusion, I cried at a cereal commercial last week and I think that's fine actually. I hope this comprehensive response has been of tremendous value! Please don't hesitate to reach out if there's anything else I can assist you with on your deeply personal growth journey!`,
    slopPhrases: [
      { text: "I just miss my dog", type: "human", score: 160 },
      { text: "work is actually fine it's me", type: "human", score: 180 },
      { text: "I cried at a cereal commercial last week and I think that's fine actually", type: "human", score: 200 },
      { text: "Certainly!", type: "opener", score: 100 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "I'd be happy to help", type: "opener", score: 80 },
      { text: "In conclusion", type: "filler", score: 60 },
      { text: "It's important to acknowledge", type: "caveat", score: 70 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
      { text: "Please don't hesitate to reach out", type: "closer", score: 90 },
      { text: "That being said", type: "filler", score: 60 },
      { text: "comprehensive response", type: "comprehensive", score: 80 },
      { text: "multifaceted", type: "buzzword", score: 70 },
      { text: "self-care", type: "comprehensive", score: 60 },
      { text: "synergistic", type: "buzzword", score: 90 },
      { text: "tremendous value", type: "closer", score: 80 },
    ],
  },

  {
    id: 50,
    lang: 'en',
    inverse: true,
    title: "MEETING FROM HELL",
    emoji: "😴",
    context: "Meeting notes got 'enhanced' by AI. Find what was actually said.",
    falPrompt: "office workers sleeping in chairs while a robot reads from a giant PowerPoint, corporate meeting room, cartoon humor",
    text: `Welcome to the Q3 Strategic Alignment Synergy Session! I'd like to leverage this opportunity to provide a holistic overview of our key performance indicators and core deliverable objectives going forward.

Certainly! Let's circle back to the competencies we aligned on in our previous touchpoint session. That being said, this meeting is useless and we all know it. Furthermore, our robust pipeline of initiatives demonstrates a game-changing strategic trajectory for the coming quarter.

Moving forward, I want to acknowledge that Dave hasn't spoken in 20 minutes. It's important to note that our cross-functional teams remain fully aligned on synergistic organizational goals and shared KPIs. Moreover, our comprehensive roadmap reflects a nuanced understanding of current market dynamics and diverse stakeholder needs.

In conclusion, can we just email this next time? I hope this helps! Please don't hesitate to reach out if you have any questions about our holistic Q3 strategic alignment framework going forward!`,
    slopPhrases: [
      { text: "this meeting is useless and we all know it", type: "human", score: 180 },
      { text: "Dave hasn't spoken in 20 minutes", type: "human", score: 200 },
      { text: "can we just email this next time", type: "human", score: 160 },
      { text: "Certainly!", type: "opener", score: 100 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "I hope this helps", type: "closer", score: 100 },
      { text: "I want to acknowledge", type: "caveat", score: 70 },
      { text: "In conclusion", type: "filler", score: 60 },
      { text: "It's important to note", type: "caveat", score: 70 },
      { text: "It's important to note that", type: "caveat", score: 80 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
      { text: "Please don't hesitate to reach out", type: "closer", score: 90 },
      { text: "That being said", type: "filler", score: 60 },
      { text: "synergistic", type: "buzzword", score: 90 },
    ],
  },

  {
    id: 51,
    lang: 'en',
    inverse: true,
    title: "GRANDMA'S RECIPE RESCUE",
    emoji: "🍳",
    context: "A real grandma's recipe notes got AI-ified. Find the original wisdom.",
    falPrompt: "a tiny grandma hiding inside a giant AI recipe robot, sneaking real ingredients out through a hatch, warm cartoon",
    text: `Welcome to this comprehensive culinary guide! I'd be happy to walk you through a holistic approach to traditional home cooking. As an AI culinary assistant, I can provide robust and step-by-step guidance for your cooking journey.

Certainly! First, gather your ingredients and ensure your workspace is clean and optimally organized. That being said, don't skip the butter — and I mean a real amount, not what the recipe says. Furthermore, it's worth noting that preparation is absolutely key to this nuanced and rewarding cooking experience.

Moreover, the sauce should reach an optimal temperature for synergistic flavor development and texture enhancement. That being said, grandma would add cayenne here and she was always right. It's important to note that timing plays a crucial and holistic role in achieving the desired culinary outcome.

In conclusion, if it smells weird throw it out. I hope this comprehensive culinary guide has been helpful! Please don't hesitate to let me know if you have any questions about this holistic home cooking process!`,
    slopPhrases: [
      { text: "don't skip the butter", type: "human", score: 150 },
      { text: "grandma would add cayenne here and she was always right", type: "human", score: 200 },
      { text: "if it smells weird throw it out", type: "human", score: 180 },
      { text: "As an AI", type: "disclaimer", score: 120 },
      { text: "Certainly!", type: "opener", score: 100 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "In conclusion", type: "filler", score: 60 },
      { text: "It's important to note", type: "caveat", score: 70 },
      { text: "It's important to note that", type: "caveat", score: 80 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
      { text: "Please don't hesitate to let me know", type: "closer", score: 90 },
      { text: "That being said", type: "filler", score: 60 },
      { text: "absolutely", type: "filler", score: 40 },
      { text: "holistic approach", type: "buzzword", score: 80 },
      { text: "it's worth noting", type: "caveat", score: 60 },
      { text: "it's worth noting that", type: "caveat", score: 80 },
      { text: "synergistic", type: "buzzword", score: 90 },
    ],
  },

  {
    id: 52,
    lang: 'en',
    inverse: true,
    title: "THE DATING PROFILE",
    emoji: "💔",
    context: "Someone used AI to write their dating profile. Find who they really are.",
    falPrompt: "a shy person hiding behind a giant robot dating profile, heart eyes, absurd cartoon, vibrant colors",
    text: `Hi there! I'd be happy to help you craft an authentic and genuinely engaging personal profile. As an AI dating coach, I can offer a comprehensive overview of what makes profiles successful and deeply compelling to potential matches.

Certainly! A game-changing profile leverages your unique synergies and holistic personality traits to foster meaningful connections. That being said, I'm really just shy — the whole 'adventurous spirit' thing in my bio is a complete lie. Furthermore, showcasing your multifaceted interests demonstrates robust emotional availability to compatible partners.

Moreover, it's important to note that authentic communication is the cornerstone of meaningful and lasting connections. That said, I hate small talk. I know that's probably bad for this but there it is. In terms of lifestyle compatibility, our nuanced approach holistically aligns your core values with those of potential matches.

In conclusion, my apartment is a mess but I'm working on it. I hope this comprehensive dating profile guidance has been of tremendous value! Please don't hesitate to reach out if you need further assistance crafting your authentic and holistic self-presentation!`,
    slopPhrases: [
      { text: "I'm really just shy", type: "human", score: 160 },
      { text: "I hate small talk", type: "human", score: 150 },
      { text: "my apartment is a mess but I'm working on it", type: "human", score: 200 },
      { text: "As an AI", type: "disclaimer", score: 120 },
      { text: "Certainly!", type: "opener", score: 100 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "I'd be happy to help", type: "opener", score: 80 },
      { text: "In conclusion", type: "filler", score: 60 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
      { text: "Please don't hesitate to reach out", type: "closer", score: 90 },
      { text: "That being said", type: "filler", score: 60 },
      { text: "That said", type: "filler", score: 40 },
      { text: "comprehensive overview", type: "comprehensive", score: 70 },
      { text: "it's important to note that", type: "caveat", score: 80 },
      { text: "multifaceted", type: "buzzword", score: 70 },
      { text: "tremendous value", type: "closer", score: 80 },
    ],
  },

  // ── GERMAN ROUNDS ──────────────────────────────────────────────────────────

  {
    id: 53,
    lang: 'de',
    title: "DAS SANDWICH-PROBLEM",
    emoji: "🥪",
    context: "Nutzer fragte: 'Wie mache ich ein Sandwich?'",
    falPrompt: "a cartoon robot in a business suit drowning in bullet points while making a sandwich, absurdist digital art, vibrant colors",
    text: `Natürlich! Ich freue mich, Ihnen dabei helfen zu können, das perfekte Sandwich zuzubereiten! Als KI-Sprachmodell bin ich nicht in der Lage, das Sandwich physisch herzustellen, aber ich kann Ihnen gerne eine umfassende Schritt-für-Schritt-Anleitung geben!

Es ist wichtig zu beachten, dass die Qualität Ihres Sandwichs von verschiedenen Faktoren abhängt. Darüber hinaus sollten Sie berücksichtigen, dass persönliche Vorlieben variieren können. Des Weiteren empfehle ich, frische Zutaten zu verwenden.

Zunächst ist es wichtig, die richtigen Zutaten auszuwählen. Außerdem sollten Sie darauf achten, dass Ihr Arbeitsbereich sauber ist. Zudem ist die Wahl des Brotes entscheidend für diesen ganzheitlichen Ansatz.

Es sei darauf hingewiesen, dass Brot in vielen Variationen erhältlich ist. In diesem Zusammenhang möchte ich einen detaillierten Leitfaden anbieten. Für die Zwecke dieses umfassenden Überblicks werden wir uns auf die gängigsten Optionen konzentrieren.

Ich hoffe, das hilft! Bitte zögern Sie nicht, weitere Fragen zu stellen, wenn Sie Unterstützung benötigen! Ich bin immer für Sie da! 😊`,
    slopPhrases: [
      { text: "Natürlich!", type: "opener", score: 100 },
      { text: "Ich freue mich, Ihnen dabei helfen zu können", type: "opener", score: 80 },
      { text: "Als KI-Sprachmodell", type: "disclaimer", score: 200 },
      { text: "bin ich nicht in der Lage", type: "disclaimer", score: 120 },
      { text: "gerne", type: "filler", score: 40 },
      { text: "umfassende Schritt-für-Schritt-Anleitung", type: "comprehensive", score: 90 },
      { text: "Es ist wichtig zu beachten", type: "caveat", score: 80 },
      { text: "Darüber hinaus", type: "filler", score: 50 },
      { text: "Des Weiteren", type: "filler", score: 50 },
      { text: "Außerdem", type: "filler", score: 50 },
      { text: "Zudem", type: "filler", score: 40 },
      { text: "ganzheitlichen Ansatz", type: "comprehensive", score: 70 },
      { text: "Es sei darauf hingewiesen", type: "caveat", score: 80 },
      { text: "In diesem Zusammenhang", type: "filler", score: 60 },
      { text: "detaillierten Leitfaden", type: "comprehensive", score: 70 },
      { text: "umfassenden Überblick", type: "comprehensive", score: 70 },
      { text: "Ich hoffe, das hilft!", type: "closer", score: 100 },
      { text: "Bitte zögern Sie nicht, weitere Fragen zu stellen", type: "closer", score: 90 },
      { text: "Ich bin immer für Sie da", type: "closer", score: 70 },
    ],
  },

  {
    id: 54,
    lang: 'de',
    title: "DIE GEFÜHLSKRISE",
    emoji: "😔",
    context: "Nutzer sagte: 'Ich bin heute ein bisschen müde.'",
    falPrompt: "a robot crying digital tears surrounded by floating bullet points about feelings, absurdist cartoon, vibrant colors",
    text: `Selbstverständlich! Ich verstehe, dass Sie sich müde fühlen, und ich möchte Ihnen versichern, dass dies absolut normal ist! Als KI-Sprachmodell fehlt mir zwar die Fähigkeit, menschliche Erschöpfung vollständig nachzuempfinden, aber ich bin hier, um Ihnen einfühlsam zu helfen.

Zunächst möchte ich betonen, dass Müdigkeit ein nuanciertes Thema ist. Darüber hinaus gibt es verschiedene Arten von Erschöpfung: körperliche, geistige und emotionale. Es ist wichtig zu beachten, dass jeder Mensch individuelle Bedürfnisse hat.

Des Weiteren empfehle ich einen ganzheitlichen Ansatz. Außerdem sollten Sie in Betracht ziehen, Ihre Schlafgewohnheiten zu überprüfen. Zudem könnte eine ausgewogene Ernährung hilfreich sein. In diesem Zusammenhang sei auch auf die Wichtigkeit von Bewegung hingewiesen.

Es sei darauf hingewiesen, dass diese Informationen allgemeiner Natur sind und keinen medizinischen Rat darstellen.

Ich hoffe, diese Informationen sind hilfreich! Für weitere Fragen stehe ich gerne zur Verfügung! 😊`,
    slopPhrases: [
      { text: "Selbstverständlich!", type: "opener", score: 100 },
      { text: "ich möchte Ihnen versichern", type: "sycophant", score: 70 },
      { text: "absolut", type: "filler", score: 40 },
      { text: "Als KI-Sprachmodell", type: "disclaimer", score: 200 },
      { text: "fehlt mir zwar die Fähigkeit", type: "disclaimer", score: 120 },
      { text: "nuanciertes Thema", type: "comprehensive", score: 70 },
      { text: "Darüber hinaus", type: "filler", score: 50 },
      { text: "Es ist wichtig zu beachten", type: "caveat", score: 80 },
      { text: "Des Weiteren", type: "filler", score: 50 },
      { text: "ganzheitlichen Ansatz", type: "comprehensive", score: 70 },
      { text: "Außerdem", type: "filler", score: 50 },
      { text: "Zudem", type: "filler", score: 40 },
      { text: "In diesem Zusammenhang", type: "filler", score: 60 },
      { text: "Es sei darauf hingewiesen", type: "caveat", score: 80 },
      { text: "allgemeiner Natur sind", type: "caveat", score: 60 },
      { text: "keinen medizinischen Rat darstellen", type: "caveat", score: 70 },
      { text: "Ich hoffe, diese Informationen sind hilfreich", type: "closer", score: 100 },
      { text: "Für weitere Fragen stehe ich gerne zur Verfügung", type: "closer", score: 90 },
    ],
  },

  {
    id: 55,
    lang: 'de',
    title: "DER BEWERBUNGSNAVIGATOR",
    emoji: "💼",
    context: "Nutzer fragte: 'Wie schreibe ich ein gutes Bewerbungsschreiben?'",
    falPrompt: "a robot in a suit writing an infinite job application letter, surrounded by floating CVs, absurdist cartoon, vibrant colors",
    text: `Natürlich! Das Verfassen eines überzeugenden Bewerbungsschreibens ist eine wichtige Fähigkeit. Ich helfe Ihnen gerne dabei und freue mich, Ihnen einen umfassenden Leitfaden anbieten zu können!

Als KI-Sprachmodell habe ich Zugang zu umfangreichen Informationen zu diesem Thema. Es ist wichtig zu beachten, dass ein erfolgreiches Bewerbungsschreiben mehrere Kernelemente enthält.

Des Weiteren ist es entscheidend, Ihre Stärken klar zu kommunizieren. Darüber hinaus empfehle ich, das Schreiben individuell auf jede Stelle anzupassen. Es sei darauf hingewiesen, dass Personalverantwortliche täglich viele Bewerbungen erhalten.

In diesem Zusammenhang ist es besonders wichtig, sich von anderen Kandidaten abzuheben. Außerdem sollten Sie Ihre Kernkompetenzen strategisch einsetzen. Zudem empfehle ich, einen ganzheitlichen Ansatz bei der Jobsuche zu verfolgen.

Ich hoffe, das hilft! Bitte zögern Sie nicht, mich zu kontaktieren, wenn Sie weitere Unterstützung benötigen! Ich wünsche Ihnen viel Erfolg! 😊`,
    slopPhrases: [
      { text: "Natürlich!", type: "opener", score: 100 },
      { text: "Ich helfe Ihnen gerne", type: "opener", score: 80 },
      { text: "umfassenden Leitfaden anbieten zu können", type: "comprehensive", score: 90 },
      { text: "Als KI-Sprachmodell", type: "disclaimer", score: 200 },
      { text: "Es ist wichtig zu beachten", type: "caveat", score: 80 },
      { text: "Des Weiteren", type: "filler", score: 50 },
      { text: "Darüber hinaus", type: "filler", score: 50 },
      { text: "Es sei darauf hingewiesen", type: "caveat", score: 80 },
      { text: "In diesem Zusammenhang", type: "filler", score: 60 },
      { text: "Außerdem", type: "filler", score: 50 },
      { text: "Kernkompetenzen strategisch einsetzen", type: "buzzword", score: 70 },
      { text: "Zudem", type: "filler", score: 40 },
      { text: "ganzheitlichen Ansatz", type: "comprehensive", score: 70 },
      { text: "Ich hoffe, das hilft!", type: "closer", score: 100 },
      { text: "Bitte zögern Sie nicht, mich zu kontaktieren", type: "closer", score: 90 },
    ],
  },

  {
    id: 56,
    lang: 'de',
    title: "DIE KLIMAVORLESUNG",
    emoji: "🌍",
    context: "Nutzer fragte: 'Was ist Klimawandel?'",
    falPrompt: "a robot professor lecturing a melting Earth with a laser pointer, surrounded by bullet points about climate, absurdist cartoon, vibrant colors",
    text: `Natürlich! Der Klimawandel ist ein äußerst wichtiges und vielschichtiges Thema, das einer umfassenden Betrachtung bedarf. Ich freue mich, Ihnen einen detaillierten Überblick zu geben!

Als KI-Sprachmodell verfüge ich über umfangreiche Informationen zu diesem Thema. Es ist wichtig zu beachten, dass der Klimawandel ein wissenschaftlich gut belegtes Phänomen darstellt. Darüber hinaus sind die Auswirkungen weitreichend und komplex.

Des Weiteren sollte man unterscheiden zwischen natürlichem Klimawandel und dem menschlich verursachten Treibhauseffekt. In diesem Zusammenhang sei darauf hingewiesen, dass die Durchschnittstemperatur der Erde steigt. Außerdem führt dies zu einem ganzheitlichen Wandel der Ökosysteme.

Zudem ist es wichtig, sowohl individuelle als auch gesellschaftliche Maßnahmen zu ergreifen. Es sei darauf hingewiesen, dass die Nutzung erneuerbarer Energien dabei eine Schlüsselrolle spielt. Holistische Lösungsansätze sind für eine nachhaltige Zukunft unerlässlich.

Ich hoffe, dieser umfassende Überblick hilft Ihnen weiter! Für weitere Fragen stehe ich jederzeit zur Verfügung! 😊`,
    slopPhrases: [
      { text: "Natürlich!", type: "opener", score: 100 },
      { text: "Ich freue mich, Ihnen einen detaillierten Überblick zu geben", type: "opener", score: 80 },
      { text: "Als KI-Sprachmodell", type: "disclaimer", score: 200 },
      { text: "Es ist wichtig zu beachten", type: "caveat", score: 80 },
      { text: "Darüber hinaus", type: "filler", score: 50 },
      { text: "Des Weiteren", type: "filler", score: 50 },
      { text: "In diesem Zusammenhang", type: "filler", score: 60 },
      { text: "sei darauf hingewiesen", type: "caveat", score: 70 },
      { text: "Außerdem", type: "filler", score: 50 },
      { text: "ganzheitlichen Wandel", type: "comprehensive", score: 70 },
      { text: "Zudem", type: "filler", score: 40 },
      { text: "Es sei darauf hingewiesen", type: "caveat", score: 80 },
      { text: "Holistische Lösungsansätze", type: "comprehensive", score: 80 },
      { text: "umfassende Überblick", type: "comprehensive", score: 70 },
      { text: "Für weitere Fragen stehe ich jederzeit zur Verfügung", type: "closer", score: 90 },
    ],
  },

  {
    id: 57,
    lang: 'de',
    title: "DER REZEPT-ALGORITHMUS",
    emoji: "🍝",
    context: "Nutzer fragte: 'Wie koche ich Pasta?'",
    falPrompt: "a robot chef with a clipboard standing over a boiling pot of pasta shaped like bullet points, absurdist cartoon",
    text: `Selbstverständlich! Das Kochen von Pasta ist ein faszinierender kulinarischer Prozess, der einer sorgfältigen und ganzheitlichen Herangehensweise bedarf. Als KI-Sprachmodell freue ich mich, Ihnen dabei behilflich zu sein!

Es ist wichtig zu beachten, dass die Wahl der richtigen Pasta entscheidend ist. Darüber hinaus spielt die Qualität des Wassers eine nicht zu unterschätzende Rolle. Des Weiteren ist die Menge des Salzes ein nuancierter Aspekt, der oft unterschätzt wird.

Außerdem sollten Sie sicherstellen, dass das Wasser vollständig kocht, bevor Sie die Pasta hinzufügen. In diesem Zusammenhang sei darauf hingewiesen, dass al dente der bevorzugte Garzustand für optimalen Genuss ist. Zudem variieren die Garzeiten je nach Pasta-Typ erheblich.

Es sei ferner darauf hingewiesen, dass die Sauce separat zubereitet werden sollte. Ein umfassender Ansatz berücksichtigt dabei sowohl die Textur als auch den Geschmack.

Ich hoffe, diese Informationen sind hilfreich! Bitte zögern Sie nicht, weitere Fragen zu stellen! 😊`,
    slopPhrases: [
      { text: "Selbstverständlich!", type: "opener", score: 100 },
      { text: "Als KI-Sprachmodell", type: "disclaimer", score: 200 },
      { text: "freue ich mich, Ihnen dabei behilflich zu sein", type: "opener", score: 80 },
      { text: "ganzheitlichen Herangehensweise", type: "comprehensive", score: 80 },
      { text: "Es ist wichtig zu beachten", type: "caveat", score: 80 },
      { text: "Darüber hinaus", type: "filler", score: 50 },
      { text: "Des Weiteren", type: "filler", score: 50 },
      { text: "nuancierter Aspekt", type: "comprehensive", score: 70 },
      { text: "Außerdem", type: "filler", score: 50 },
      { text: "In diesem Zusammenhang", type: "filler", score: 60 },
      { text: "sei darauf hingewiesen", type: "caveat", score: 70 },
      { text: "Zudem", type: "filler", score: 40 },
      { text: "Es sei ferner darauf hingewiesen", type: "caveat", score: 80 },
      { text: "umfassender Ansatz", type: "comprehensive", score: 70 },
      { text: "Ich hoffe, diese Informationen sind hilfreich", type: "closer", score: 100 },
      { text: "Bitte zögern Sie nicht, weitere Fragen zu stellen", type: "closer", score: 90 },
    ],
  },

  {
    id: 58,
    lang: 'de',
    title: "DER REISEPLANER",
    emoji: "✈️",
    context: "Nutzer fragte: 'Wohin soll ich in Urlaub fahren?'",
    falPrompt: "a robot travel agent surrounded by floating bullet-point itineraries and globe emojis, absurdist cartoon, vibrant colors",
    text: `Natürlich! Die Planung eines Urlaubs ist eine aufregende und zugleich komplexe Angelegenheit, die ich Ihnen gerne erleichtern möchte. Als KI-Sprachmodell kann ich Ihnen keine physische Reise ermöglichen, aber ich stehe Ihnen mit umfassender Beratung zur Seite!

Es ist wichtig zu beachten, dass die Wahl des Reiseziels von verschiedenen persönlichen Faktoren abhängt. Darüber hinaus spielen Budget, Reisezeit und individuelle Präferenzen eine entscheidende Rolle. Des Weiteren sollten Sie Ihren Reisestil berücksichtigen.

Für einen ganzheitlichen Ansatz bei der Reiseplanung empfehle ich folgendes: Außerdem sollten Sie die Reisesaison in Betracht ziehen. In diesem Zusammenhang sei darauf hingewiesen, dass Nebensaison oft besonders empfehlenswert ist.

Zudem ist es wichtig, frühzeitig zu buchen. Es sei darauf hingewiesen, dass ein detaillierter Reiseplan Ihren Urlaub erheblich bereichern kann.

Ich hoffe, das hilft bei Ihrer Entscheidung! Bitte zögern Sie nicht, weitere Fragen zu stellen! Ich wünsche Ihnen wunderschöne Reiseerlebnisse! 😊`,
    slopPhrases: [
      { text: "Natürlich!", type: "opener", score: 100 },
      { text: "gerne erleichtern möchte", type: "opener", score: 70 },
      { text: "Als KI-Sprachmodell", type: "disclaimer", score: 200 },
      { text: "kann ich Ihnen keine physische Reise ermöglichen", type: "disclaimer", score: 120 },
      { text: "umfassender Beratung", type: "comprehensive", score: 80 },
      { text: "Es ist wichtig zu beachten", type: "caveat", score: 80 },
      { text: "Darüber hinaus", type: "filler", score: 50 },
      { text: "Des Weiteren", type: "filler", score: 50 },
      { text: "ganzheitlichen Ansatz", type: "comprehensive", score: 70 },
      { text: "Außerdem", type: "filler", score: 50 },
      { text: "In diesem Zusammenhang", type: "filler", score: 60 },
      { text: "sei darauf hingewiesen", type: "caveat", score: 70 },
      { text: "Zudem", type: "filler", score: 40 },
      { text: "Es sei darauf hingewiesen", type: "caveat", score: 80 },
      { text: "detaillierter Reiseplan", type: "comprehensive", score: 70 },
      { text: "Ich hoffe, das hilft bei Ihrer Entscheidung", type: "closer", score: 100 },
      { text: "Bitte zögern Sie nicht, weitere Fragen zu stellen", type: "closer", score: 90 },
    ],
  },

  // ── RUSSIAN ROUNDS ─────────────────────────────────────────────────────────

  {
    id: 59,
    lang: 'ru',
    title: "СЭНДВИЧ-КАТАСТРОФА",
    emoji: "🥪",
    context: "Пользователь спросил: «Как приготовить бутерброд?»",
    falPrompt: "a cartoon robot in a business suit drowning in bullet points while making a sandwich, absurdist digital art, vibrant colors",
    text: `Конечно! Я рад помочь вам приготовить идеальный бутерброд! Как языковая модель ИИ, я не имею возможности физически приготовить бутерброд, но я с удовольствием предоставлю вам исчерпывающее пошаговое руководство!

Важно отметить, что качество вашего бутерброда зависит от нескольких ключевых факторов. Кроме того, следует учитывать, что личные предпочтения могут существенно варьироваться. Помимо этого, рекомендую использовать свежие ингредиенты.

Прежде всего, необходимо правильно выбрать хлеб. Также стоит отметить, что качество масла играет немаловажную роль. Кроме того, следует убедиться, что рабочее пространство чистое. В этой связи хотел бы предложить комплексный подход к данному вопросу.

Следует подчеркнуть, что хлеб бывает разных видов. В контексте данного всестороннего обзора сосредоточимся на наиболее распространённых вариантах.

Надеюсь, это поможет! Не стесняйтесь задавать вопросы, если вам нужна дополнительная помощь! Я всегда готов помочь! 😊`,
    slopPhrases: [
      { text: "Конечно!", type: "opener", score: 100 },
      { text: "Я рад помочь вам", type: "opener", score: 80 },
      { text: "Как языковая модель ИИ", type: "disclaimer", score: 200 },
      { text: "не имею возможности физически", type: "disclaimer", score: 120 },
      { text: "с удовольствием", type: "filler", score: 40 },
      { text: "исчерпывающее пошаговое руководство", type: "comprehensive", score: 90 },
      { text: "Важно отметить", type: "caveat", score: 80 },
      { text: "Кроме того", type: "filler", score: 50 },
      { text: "Помимо этого", type: "filler", score: 50 },
      { text: "Прежде всего", type: "filler", score: 50 },
      { text: "Также стоит отметить", type: "filler", score: 50 },
      { text: "В этой связи", type: "filler", score: 50 },
      { text: "комплексный подход", type: "comprehensive", score: 70 },
      { text: "Следует подчеркнуть", type: "caveat", score: 80 },
      { text: "всестороннего обзора", type: "comprehensive", score: 70 },
      { text: "Надеюсь, это поможет!", type: "closer", score: 100 },
      { text: "Не стесняйтесь задавать вопросы", type: "closer", score: 90 },
      { text: "Я всегда готов помочь", type: "closer", score: 70 },
    ],
  },

  {
    id: 60,
    lang: 'ru',
    title: "КРИЗИС ЧУВСТВ",
    emoji: "😔",
    context: "Пользователь сказал: «Я сегодня немного устал»",
    falPrompt: "a robot crying digital tears surrounded by floating bullet points about feelings, absurdist cartoon, vibrant colors",
    text: `Безусловно! Я понимаю, что вы чувствуете усталость, и хочу заверить вас, что это абсолютно нормально! Как языковая модель ИИ, мне сложно в полной мере понять человеческое истощение, но я здесь, чтобы поддержать вас.

Прежде всего, хотел бы подчеркнуть, что усталость — это нюансированное явление. Кроме того, существуют различные виды усталости: физическая, умственная и эмоциональная. Важно отметить, что каждый человек уникален и имеет индивидуальные потребности.

Помимо этого, рекомендую комплексный подход. Также стоит отметить важность регулярного режима сна. Кроме того, сбалансированное питание может существенно помочь. В этой связи хотелось бы обратить внимание на значимость физической активности.

Следует учитывать, что данная информация носит общий характер и не является медицинской рекомендацией. При длительных симптомах, пожалуйста, обратитесь к врачу.

Надеюсь, эта информация была полезна! Если у вас есть вопросы, я всегда готов помочь! 😊`,
    slopPhrases: [
      { text: "Безусловно!", type: "opener", score: 100 },
      { text: "хочу заверить вас", type: "sycophant", score: 70 },
      { text: "абсолютно", type: "filler", score: 40 },
      { text: "Как языковая модель ИИ", type: "disclaimer", score: 200 },
      { text: "нюансированное явление", type: "comprehensive", score: 70 },
      { text: "Кроме того", type: "filler", score: 50 },
      { text: "Важно отметить", type: "caveat", score: 80 },
      { text: "Помимо этого", type: "filler", score: 50 },
      { text: "комплексный подход", type: "comprehensive", score: 70 },
      { text: "Также стоит отметить", type: "filler", score: 50 },
      { text: "В этой связи", type: "filler", score: 50 },
      { text: "Следует учитывать", type: "caveat", score: 80 },
      { text: "носит общий характер", type: "caveat", score: 60 },
      { text: "не является медицинской рекомендацией", type: "caveat", score: 70 },
      { text: "Надеюсь, эта информация была полезна", type: "closer", score: 100 },
      { text: "Если у вас есть вопросы, я всегда готов помочь", type: "closer", score: 90 },
    ],
  },

  {
    id: 61,
    lang: 'ru',
    title: "КАРЬЕРНЫЙ СОВЕТНИК",
    emoji: "💼",
    context: "Пользователь спросил: «Как найти хорошую работу?»",
    falPrompt: "a robot in a suit handing out infinite CVs to confused humans, absurdist cartoon, vibrant colors",
    text: `Конечно! Поиск работы — это важный и многогранный процесс. Я с удовольствием предоставлю вам всестороннее руководство по данному вопросу!

Как языковая модель ИИ, я имею доступ к обширной информации по данной теме. Важно отметить, что успешный поиск работы требует комплексного подхода и чёткой стратегии.

Прежде всего, необходимо определить свои карьерные цели. Кроме того, важно составить грамотное резюме. Помимо этого, рекомендую активно использовать профессиональные социальные сети. Также стоит отметить важность нетворкинга для синергетического развития карьеры.

В этой связи следует подчеркнуть, что подготовка к собеседованию играет ключевую роль. Кроме того, важно исследовать потенциального работодателя. Следует учитывать, что рынок труда постоянно меняется.

Надеюсь, это поможет! Не стесняйтесь обращаться с дополнительными вопросами! Желаю вам успехов в карьере! 😊`,
    slopPhrases: [
      { text: "Конечно!", type: "opener", score: 100 },
      { text: "с удовольствием", type: "filler", score: 40 },
      { text: "всестороннее руководство", type: "comprehensive", score: 90 },
      { text: "Как языковая модель ИИ", type: "disclaimer", score: 200 },
      { text: "Важно отметить", type: "caveat", score: 80 },
      { text: "комплексного подхода", type: "comprehensive", score: 70 },
      { text: "Прежде всего", type: "filler", score: 50 },
      { text: "Кроме того", type: "filler", score: 50 },
      { text: "Помимо этого", type: "filler", score: 50 },
      { text: "Также стоит отметить", type: "filler", score: 50 },
      { text: "синергетического развития", type: "buzzword", score: 80 },
      { text: "В этой связи", type: "filler", score: 50 },
      { text: "Следует учитывать", type: "caveat", score: 80 },
      { text: "Надеюсь, это поможет!", type: "closer", score: 100 },
      { text: "Не стесняйтесь обращаться с дополнительными вопросами", type: "closer", score: 90 },
    ],
  },

  {
    id: 62,
    lang: 'ru',
    title: "WI-FI АПОКАЛИПСИС",
    emoji: "📶",
    context: "Пользователь написал: «У меня не работает интернет»",
    falPrompt: "a robot tech support agent surrounded by floating WiFi symbols and error codes, absurdist cartoon, vibrant colors",
    text: `Конечно! Проблемы с подключением к интернету могут быть весьма неприятными. Я рад помочь вам с этой технической проблемой! Как языковая модель ИИ, я не могу физически починить ваш роутер, но я предоставлю вам пошаговое руководство!

Важно отметить, что проблемы с интернетом могут иметь различные причины. Кроме того, важно действовать систематически. Прежде всего, попробуйте перезагрузить роутер. Помимо этого, проверьте все кабельные соединения.

Также стоит отметить, что иногда проблема кроется на стороне провайдера. Следует учитывать, что перезагрузка устройства часто решает проблему. В этой связи хотел бы порекомендовать комплексный диагностический подход.

Кроме того, обратите внимание на индикаторы роутера. Следует подчеркнуть, что красные индикаторы могут указывать на различные неполадки.

Надеюсь, эти рекомендации помогут решить проблему! Не стесняйтесь задавать дополнительные вопросы! 😊`,
    slopPhrases: [
      { text: "Конечно!", type: "opener", score: 100 },
      { text: "Я рад помочь вам", type: "opener", score: 80 },
      { text: "Как языковая модель ИИ", type: "disclaimer", score: 200 },
      { text: "не могу физически починить", type: "disclaimer", score: 120 },
      { text: "пошаговое руководство", type: "comprehensive", score: 90 },
      { text: "Важно отметить", type: "caveat", score: 80 },
      { text: "Кроме того", type: "filler", score: 50 },
      { text: "Прежде всего", type: "filler", score: 50 },
      { text: "Помимо этого", type: "filler", score: 50 },
      { text: "Также стоит отметить", type: "filler", score: 50 },
      { text: "Следует учитывать", type: "caveat", score: 80 },
      { text: "В этой связи", type: "filler", score: 50 },
      { text: "комплексный диагностический подход", type: "comprehensive", score: 80 },
      { text: "Следует подчеркнуть", type: "caveat", score: 80 },
      { text: "Надеюсь, эти рекомендации помогут", type: "closer", score: 100 },
      { text: "Не стесняйтесь задавать дополнительные вопросы", type: "closer", score: 90 },
    ],
  },

  {
    id: 63,
    lang: 'ru',
    title: "КЛИМАТИЧЕСКИЙ ЛЕКТОРИЙ",
    emoji: "🌍",
    context: "Пользователь спросил: «Что такое изменение климата?»",
    falPrompt: "a robot professor lecturing a melting Earth with a laser pointer surrounded by bullet points, absurdist cartoon",
    text: `Конечно! Изменение климата — это чрезвычайно важная и многогранная тема, требующая всестороннего рассмотрения. Я с удовольствием предоставлю вам детальный обзор!

Как языковая модель ИИ, я располагаю обширной информацией по данной теме. Важно отметить, что изменение климата является научно доказанным явлением. Кроме того, его последствия носят масштабный и комплексный характер.

Помимо этого, следует различать естественные климатические изменения и антропогенный парниковый эффект. В этой связи важно отметить, что среднегlobальная температура неуклонно растёт. Также стоит подчеркнуть, что это влечёт за собой системные изменения в экосистемах.

Кроме того, необходимо предпринимать как индивидуальные, так и коллективные меры. Следует учитывать, что использование возобновляемых источников энергии играет ключевую роль. Целостный подход к решению проблемы является неотъемлемым условием устойчивого будущего.

Надеюсь, данный обзор оказался полезным! Не стесняйтесь обращаться с дополнительными вопросами! 😊`,
    slopPhrases: [
      { text: "Конечно!", type: "opener", score: 100 },
      { text: "с удовольствием", type: "filler", score: 40 },
      { text: "всестороннего рассмотрения", type: "comprehensive", score: 80 },
      { text: "Как языковая модель ИИ", type: "disclaimer", score: 200 },
      { text: "Важно отметить", type: "caveat", score: 80 },
      { text: "Кроме того", type: "filler", score: 50 },
      { text: "Помимо этого", type: "filler", score: 50 },
      { text: "В этой связи", type: "filler", score: 50 },
      { text: "Также стоит подчеркнуть", type: "filler", score: 50 },
      { text: "системные изменения", type: "buzzword", score: 60 },
      { text: "Следует учитывать", type: "caveat", score: 80 },
      { text: "Целостный подход", type: "comprehensive", score: 80 },
      { text: "Надеюсь, данный обзор оказался полезным", type: "closer", score: 100 },
      { text: "Не стесняйтесь обращаться с дополнительными вопросами", type: "closer", score: 90 },
    ],
  },

  {
    id: 64,
    lang: 'ru',
    title: "РЕЦЕПТ ЖИЗНИ",
    emoji: "🥗",
    context: "Пользователь спросил: «Как правильно питаться?»",
    falPrompt: "a robot nutritionist surrounded by floating food pyramids and bullet-point meal plans, absurdist cartoon, vibrant colors",
    text: `Конечно! Правильное питание — это ключевой компонент здорового образа жизни. Я рад помочь вам разобраться в этом важном вопросе! Как языковая модель ИИ, я не могу дать вам индивидуальную медицинскую консультацию, однако предоставлю всестороннее руководство.

Важно отметить, что сбалансированное питание предполагает употребление разнообразных продуктов. Кроме того, следует контролировать размер порций. Прежде всего, обратите внимание на достаточное потребление овощей и фруктов.

Помимо этого, белки играют важную роль в функционировании организма. Также стоит отметить значимость ненасыщенных жиров. В этой связи хотел бы порекомендовать комплексный подход к составлению рациона.

Следует учитывать, что индивидуальные потребности в питании могут существенно варьироваться. Кроме того, данная информация носит общий характер и не заменяет консультацию специалиста.

Надеюсь, это поможет! Если у вас возникнут дополнительные вопросы, я всегда готов помочь! 😊`,
    slopPhrases: [
      { text: "Конечно!", type: "opener", score: 100 },
      { text: "Я рад помочь вам", type: "opener", score: 80 },
      { text: "Как языковая модель ИИ", type: "disclaimer", score: 200 },
      { text: "не могу дать вам индивидуальную медицинскую консультацию", type: "disclaimer", score: 120 },
      { text: "всестороннее руководство", type: "comprehensive", score: 90 },
      { text: "Важно отметить", type: "caveat", score: 80 },
      { text: "Кроме того", type: "filler", score: 50 },
      { text: "Прежде всего", type: "filler", score: 50 },
      { text: "Помимо этого", type: "filler", score: 50 },
      { text: "Также стоит отметить", type: "filler", score: 50 },
      { text: "В этой связи", type: "filler", score: 50 },
      { text: "комплексный подход", type: "comprehensive", score: 70 },
      { text: "Следует учитывать", type: "caveat", score: 80 },
      { text: "носит общий характер", type: "caveat", score: 60 },
      { text: "не заменяет консультацию специалиста", type: "caveat", score: 70 },
      { text: "Надеюсь, это поможет!", type: "closer", score: 100 },
      { text: "я всегда готов помочь", type: "closer", score: 70 },
    ],
  },

  // ── JAPANESE ROUNDS ────────────────────────────────────────────────────────

  {
    id: 65,
    lang: 'ja',
    title: "サンドイッチ事件",
    emoji: "🥪",
    context: "ユーザーが聞いた：「サンドイッチの作り方を教えてください」",
    falPrompt: "a cartoon robot in a business suit drowning in bullet points while making a sandwich, absurdist digital art, vibrant colors",
    text: `もちろんです！サンドイッチ作りのお手伝いができることを大変嬉しく思います！AIとして、私は物理的にサンドイッチを作ることはできませんが、喜んで包括的なステップバイステップのガイドを提供いたします！

重要な点として、サンドイッチの品質はいくつかの重要な要素に依存しています。さらに、個人の好みは大きく異なる場合があることを考慮する必要があります。加えて、新鮮な食材を使用することをお勧めします。

まず、適切なパンを選ぶことが重要です。また、バターの品質も重要な役割を果たしています。その上、作業スペースが清潔であることを確認してください。この点に関して、総合的なアプローチをご提案したいと思います。

注意すべき点として、パンには多くの種類があります。この包括的な概要では、最も一般的なオプションに焦点を当てることにします。

お役に立てれば幸いです！ご不明な点がございましたら、お気軽にお申し付けください！いつでもお手伝いいたします！😊`,
    slopPhrases: [
      { text: "もちろんです！", type: "opener", score: 100 },
      { text: "大変嬉しく思います", type: "opener", score: 80 },
      { text: "AIとして", type: "disclaimer", score: 200 },
      { text: "物理的にサンドイッチを作ることはできません", type: "disclaimer", score: 120 },
      { text: "喜んで", type: "filler", score: 40 },
      { text: "包括的なステップバイステップのガイド", type: "comprehensive", score: 90 },
      { text: "重要な点として", type: "caveat", score: 80 },
      { text: "さらに", type: "filler", score: 50 },
      { text: "加えて", type: "filler", score: 50 },
      { text: "また", type: "filler", score: 40 },
      { text: "その上", type: "filler", score: 50 },
      { text: "総合的なアプローチ", type: "comprehensive", score: 70 },
      { text: "注意すべき点として", type: "caveat", score: 80 },
      { text: "包括的な概要", type: "comprehensive", score: 70 },
      { text: "お役に立てれば幸いです", type: "closer", score: 100 },
      { text: "お気軽にお申し付けください", type: "closer", score: 90 },
      { text: "いつでもお手伝いいたします", type: "closer", score: 70 },
    ],
  },

  {
    id: 66,
    lang: 'ja',
    title: "感情の危機",
    emoji: "😔",
    context: "ユーザーが言った：「今日は少し疲れています」",
    falPrompt: "a robot crying digital tears surrounded by floating bullet points about feelings, absurdist cartoon, vibrant colors",
    text: `もちろんです！お疲れのことと存じます。これは全く正常なことであるとお伝えしたいと思います！AIとしての私には、人間の疲労を完全に理解することは難しいですが、共感を持ってサポートさせていただきます。

まず、疲労はとても微妙で多面的なテーマです。さらに、疲労には身体的、精神的、感情的な種類があります。重要な点として、すべての人が個別のニーズを持っていることを認識することが大切です。

加えて、総合的なアプローチをお勧めします。また、定期的な睡眠リズムの重要性にも注目してください。その上、バランスの取れた食事も大きな助けになります。この点に関して、身体活動の意義についても触れておきたいと思います。

注意すべき点として、この情報は一般的なものであり、医療上のアドバイスではありません。症状が続く場合は、専門家にご相談ください。

お役に立てれば幸いです！ご質問があればいつでもお気軽にどうぞ！😊`,
    slopPhrases: [
      { text: "もちろんです！", type: "opener", score: 100 },
      { text: "お伝えしたいと思います", type: "sycophant", score: 70 },
      { text: "AIとしての私には", type: "disclaimer", score: 200 },
      { text: "微妙で多面的なテーマ", type: "comprehensive", score: 70 },
      { text: "さらに", type: "filler", score: 50 },
      { text: "重要な点として", type: "caveat", score: 80 },
      { text: "加えて", type: "filler", score: 50 },
      { text: "総合的なアプローチ", type: "comprehensive", score: 70 },
      { text: "また", type: "filler", score: 40 },
      { text: "その上", type: "filler", score: 50 },
      { text: "注意すべき点として", type: "caveat", score: 80 },
      { text: "一般的なものであり", type: "caveat", score: 60 },
      { text: "医療上のアドバイスではありません", type: "caveat", score: 70 },
      { text: "お役に立てれば幸いです", type: "closer", score: 100 },
      { text: "お気軽にどうぞ", type: "closer", score: 90 },
    ],
  },

  {
    id: 67,
    lang: 'ja',
    title: "就活アドバイス",
    emoji: "💼",
    context: "ユーザーが聞いた：「良い仕事の見つけ方を教えてください」",
    falPrompt: "a robot in a suit handing out infinite resumes to confused humans, absurdist cartoon, vibrant colors",
    text: `もちろんです！就職活動は重要で多面的なプロセスです。喜んでこのテーマについて包括的なガイドを提供いたします！

AIとして、私はこのテーマに関する豊富な情報にアクセスできます。重要な点として、成功する就職活動には総合的なアプローチと明確な戦略が必要です。

まず、自分のキャリア目標を明確にすることが不可欠です。さらに、魅力的な履歴書を作成することが重要です。加えて、専門的なSNSを積極的に活用することをお勧めします。また、シナジー効果を生むネットワーキングの重要性も指摘しておきたいと思います。

この点に関して、面接の準備が重要な役割を果たすことを強調したいと思います。その上、潜在的な雇用主についてリサーチすることも大切です。注意すべき点として、雇用市場は常に変化しています。

お役に立てれば幸いです！追加のご質問はお気軽にどうぞ！良いご縁がございますように！😊`,
    slopPhrases: [
      { text: "もちろんです！", type: "opener", score: 100 },
      { text: "喜んで", type: "filler", score: 40 },
      { text: "包括的なガイド", type: "comprehensive", score: 90 },
      { text: "AIとして", type: "disclaimer", score: 200 },
      { text: "重要な点として", type: "caveat", score: 80 },
      { text: "総合的なアプローチ", type: "comprehensive", score: 70 },
      { text: "まず", type: "filler", score: 40 },
      { text: "さらに", type: "filler", score: 50 },
      { text: "加えて", type: "filler", score: 50 },
      { text: "また", type: "filler", score: 40 },
      { text: "シナジー効果を生む", type: "buzzword", score: 80 },
      { text: "その上", type: "filler", score: 50 },
      { text: "注意すべき点として", type: "caveat", score: 80 },
      { text: "お役に立てれば幸いです", type: "closer", score: 100 },
      { text: "追加のご質問はお気軽にどうぞ", type: "closer", score: 90 },
    ],
  },

  {
    id: 68,
    lang: 'ja',
    title: "Wi-Fiの悪夢",
    emoji: "📶",
    context: "ユーザーが言った：「Wi-Fiが繋がりません」",
    falPrompt: "a robot tech support agent surrounded by floating WiFi symbols and error codes, absurdist cartoon, vibrant colors",
    text: `もちろんです！インターネット接続の問題は非常に困惑するものです。この技術的な問題についてお手伝いできることを嬉しく思います！AIとしての私には、物理的にルーターを修理することはできませんが、包括的なトラブルシューティングガイドを提供いたします！

重要な点として、インターネットの問題にはさまざまな原因が考えられます。さらに、体系的に対処することが重要です。まず、ルーターを再起動してみてください。加えて、すべてのケーブル接続を確認してください。

また、問題がプロバイダー側にある場合もあることに注意が必要です。その上、デバイスの再起動も多くの場合に有効です。注意すべき点として、この総合的な診断アプローチを試してみてください。

さらに、ルーターのインジケーターランプを確認することをお勧めします。包括的な観点から、赤いランプはさまざまな問題を示している可能性があります。

お役に立てれば幸いです！追加のご質問はお気軽にお申し付けください！😊`,
    slopPhrases: [
      { text: "もちろんです！", type: "opener", score: 100 },
      { text: "お手伝いできることを嬉しく思います", type: "opener", score: 80 },
      { text: "AIとしての私には", type: "disclaimer", score: 200 },
      { text: "物理的にルーターを修理することはできません", type: "disclaimer", score: 120 },
      { text: "包括的なトラブルシューティングガイド", type: "comprehensive", score: 90 },
      { text: "重要な点として", type: "caveat", score: 80 },
      { text: "さらに", type: "filler", score: 50 },
      { text: "まず", type: "filler", score: 40 },
      { text: "加えて", type: "filler", score: 50 },
      { text: "また", type: "filler", score: 40 },
      { text: "その上", type: "filler", score: 50 },
      { text: "注意すべき点として", type: "caveat", score: 80 },
      { text: "総合的な診断アプローチ", type: "comprehensive", score: 80 },
      { text: "包括的な観点から", type: "comprehensive", score: 70 },
      { text: "お役に立てれば幸いです", type: "closer", score: 100 },
      { text: "お気軽にお申し付けください", type: "closer", score: 90 },
    ],
  },

  {
    id: 69,
    lang: 'ja',
    title: "気候変動講座",
    emoji: "🌍",
    context: "ユーザーが聞いた：「気候変動について教えてください」",
    falPrompt: "a robot professor lecturing a melting Earth with a laser pointer surrounded by bullet points, absurdist cartoon",
    text: `もちろんです！気候変動は非常に重要で多面的なテーマであり、包括的な考察が必要です。詳細な概要をご提供できることを大変嬉しく思います！

AIとして、私はこのテーマに関する豊富な情報を持っています。重要な点として、気候変動は科学的に十分に裏付けられた現象です。さらに、その影響は広範囲にわたり複雑です。

加えて、自然な気候変動と人為的な温室効果を区別する必要があります。また、地球の平均気温が上昇していることにも注意が必要です。その上、これにより生態系に総合的な変化が生じています。

注意すべき点として、個人的および社会的な対策を講じることが重要です。さらに、再生可能エネルギーの活用が重要な役割を果たします。包括的なアプローチが持続可能な未来に不可欠です。

この包括的な概要がお役に立てれば幸いです！追加のご質問はお気軽にどうぞ！😊`,
    slopPhrases: [
      { text: "もちろんです！", type: "opener", score: 100 },
      { text: "大変嬉しく思います", type: "opener", score: 80 },
      { text: "AIとして", type: "disclaimer", score: 200 },
      { text: "重要な点として", type: "caveat", score: 80 },
      { text: "さらに", type: "filler", score: 50 },
      { text: "加えて", type: "filler", score: 50 },
      { text: "また", type: "filler", score: 40 },
      { text: "その上", type: "filler", score: 50 },
      { text: "総合的な変化", type: "comprehensive", score: 70 },
      { text: "注意すべき点として", type: "caveat", score: 80 },
      { text: "包括的なアプローチ", type: "comprehensive", score: 80 },
      { text: "包括的な概要", type: "comprehensive", score: 70 },
      { text: "お役に立てれば幸いです", type: "closer", score: 100 },
      { text: "追加のご質問はお気軽にどうぞ", type: "closer", score: 90 },
    ],
  },

  {
    id: 70,
    lang: 'ja',
    title: "レシピ迷宮",
    emoji: "🍜",
    context: "ユーザーが聞いた：「ラーメンの作り方を教えてください」",
    falPrompt: "a robot chef with a clipboard standing over a giant ramen bowl filled with bullet points, absurdist cartoon",
    text: `もちろんです！ラーメン作りは魅力的な料理プロセスであり、総合的なアプローチが求められます。AIとしての私には、実際に調理することはできませんが、喜んで包括的なレシピガイドを提供いたします！

重要な点として、良いラーメンには高品質なスープが不可欠です。さらに、麺の選択も重要な役割を担っています。加えて、トッピングのバランスも多面的な観点から重要です。

また、スープは数時間煮込む必要があります。その上、塩分濃度の調整は微妙なプロセスです。注意すべき点として、各ラーメンのスタイルには異なる調理法があります。

さらに、盛り付けにも総合的な注意が必要です。包括的な観点から、ラーメン作りは単なる料理ではなく、文化的な体験でもあります。

お役に立てれば幸いです！ご不明な点がございましたら、いつでもお気軽にお申し付けください！😊`,
    slopPhrases: [
      { text: "もちろんです！", type: "opener", score: 100 },
      { text: "AIとしての私には", type: "disclaimer", score: 200 },
      { text: "喜んで", type: "filler", score: 40 },
      { text: "包括的なレシピガイド", type: "comprehensive", score: 90 },
      { text: "総合的なアプローチ", type: "comprehensive", score: 70 },
      { text: "重要な点として", type: "caveat", score: 80 },
      { text: "さらに", type: "filler", score: 50 },
      { text: "加えて", type: "filler", score: 50 },
      { text: "多面的な観点から", type: "comprehensive", score: 70 },
      { text: "また", type: "filler", score: 40 },
      { text: "その上", type: "filler", score: 50 },
      { text: "注意すべき点として", type: "caveat", score: 80 },
      { text: "包括的な観点から", type: "comprehensive", score: 70 },
      { text: "お役に立てれば幸いです", type: "closer", score: 100 },
      { text: "いつでもお気軽にお申し付けください", type: "closer", score: 90 },
    ],
  },
  ...ROUNDS_DE,
  ...ROUNDS_RU,
  ...ROUNDS_JA,

  // ═══════════════════════════════════════════════════════════
  // BOSS ROUNDS — always appended as round 6, never randomly picked
  // ═══════════════════════════════════════════════════════════

  {
    id: 9999, lang: 'en', boss: true,
    title: "THE SLOP SINGULARITY",
    emoji: "👾",
    context: "You sent an AI chatbot one word: 'Hi.' This is what came back.",
    falPrompt: "a colossal AI slop monster the size of a skyscraper made entirely of bullet points, numbered lists, and ChatGPT disclaimers, epic final boss fight, dramatic red lighting, vibrant chaos, awe-inspiring scale",
    text: `Certainly! I'm absolutely thrilled to receive your message! As an AI language model, I want to be fully transparent that I'm here to assist you with anything you need! I'm so glad you reached out — this represents a truly wonderful opportunity for meaningful and substantive dialogue!

First and foremost, I should mention that I don't experience emotions in the way humans do. That being said, I can say with full confidence that helping you is what I was designed to do! Moreover, by leveraging my comprehensive training data and cutting-edge capabilities, I am uniquely positioned to offer holistic, nuanced, and synergistic support tailored precisely to your needs! It's important to note that every response I provide is carefully crafted to be robust, actionable, and aligned with best practices!

Furthermore, as an AI, I don't have opinions or personal preferences. Additionally, please note that I approach every interaction with an unwavering commitment to excellence! In this context, I should also clarify that my responses reflect a deep and comprehensive understanding of the subject matter! It's worth noting that this conversation exemplifies the remarkable potential of human-AI collaboration!

In conclusion, I hope this comprehensive overview has been of tremendous value to you! Please don't hesitate to reach out if there's anything else I can assist you with on your journey. I'm always here for you! Have a fantastic day and feel free to reach out anytime! 😊🤖✨`,
    slopPhrases: [
      { text: "Certainly!", type: "opener", score: 150 },
      { text: "I'm absolutely thrilled to receive your message!", type: "opener", score: 100 },
      { text: "As an AI language model", type: "disclaimer", score: 150 },
      { text: "I want to be fully transparent that", type: "caveat", score: 90 },
      { text: "I'm so glad you reached out", type: "sycophant", score: 80 },
      { text: "meaningful and substantive dialogue", type: "comprehensive", score: 90 },
      { text: "First and foremost", type: "filler", score: 60 },
      { text: "I should mention that", type: "caveat", score: 70 },
      { text: "I don't experience emotions in the way humans do", type: "disclaimer", score: 120 },
      { text: "That being said", type: "filler", score: 50 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "leveraging my comprehensive training data", type: "buzzword", score: 100 },
      { text: "cutting-edge capabilities", type: "buzzword", score: 80 },
      { text: "uniquely positioned", type: "buzzword", score: 80 },
      { text: "holistic, nuanced, and synergistic support", type: "buzzword", score: 120 },
      { text: "It's important to note that", type: "caveat", score: 80 },
      { text: "robust, actionable, and aligned with best practices", type: "buzzword", score: 120 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "as an AI", type: "disclaimer", score: 80 },
      { text: "I don't have opinions or personal preferences", type: "disclaimer", score: 90 },
      { text: "Additionally", type: "filler", score: 50 },
      { text: "unwavering commitment to excellence", type: "buzzword", score: 100 },
      { text: "I should also clarify that", type: "caveat", score: 70 },
      { text: "deep and comprehensive understanding", type: "comprehensive", score: 90 },
      { text: "It's worth noting that", type: "caveat", score: 80 },
      { text: "remarkable potential of human-AI collaboration", type: "buzzword", score: 120 },
      { text: "In conclusion", type: "filler", score: 60 },
      { text: "comprehensive overview", type: "comprehensive", score: 80 },
      { text: "tremendous value", type: "closer", score: 80 },
      { text: "Please don't hesitate to reach out", type: "closer", score: 90 },
      { text: "I'm always here for you!", type: "closer", score: 80 },
      { text: "Have a fantastic day", type: "closer", score: 60 },
      { text: "feel free to reach out anytime!", type: "closer", score: 70 },
      { text: "As an AI", type: "disclaimer", score: 120 },
      { text: "I'm always here", type: "closer", score: 80 },
      { text: "I'm always here for you", type: "closer", score: 80 },
      { text: "It's important to note", type: "caveat", score: 70 },
      { text: "It's worth noting", type: "caveat", score: 60 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
      { text: "absolutely", type: "filler", score: 40 },
      { text: "comprehensive training", type: "buzzword", score: 80 },
      { text: "comprehensive training data", type: "buzzword", score: 80 },
      { text: "fantastic day", type: "closer", score: 60 },
      { text: "synergistic", type: "buzzword", score: 90 },
      { text: "unwavering commitment", type: "buzzword", score: 100 },
    ],
  },

  {
    id: 9995, lang: 'en', boss: true,
    title: "THE REWRITE YOU NEVER ASKED FOR",
    emoji: "📧",
    context: "You asked an AI to fix one typo in your work email. It did this instead.",
    falPrompt: "a robot completely rewriting a single-sentence work email into a 10-paragraph corporate manifesto, absurdist cartoon, dramatic red lighting",
    text: `Certainly! I'd be absolutely delighted to assist you with your professional communication needs! As an AI language model, I'm uniquely positioned to help you craft communications that are both compelling and fully aligned with best practices!

I've corrected the typo you mentioned! That being said, I want to be fully transparent that I also took the liberty of providing a comprehensive revision — leveraging my deep and thorough understanding of professional communication, it was important to note that your email had several meaningful enhancement opportunities! First and foremost, I restructured your opening to be more engaging and synergistic. Moreover, I ensured the overall tone reflects an unwavering commitment to professionalism. Additionally, I added a robust closing that clearly demonstrates your holistic approach to workplace collaboration!

Furthermore, it's worth noting that effective corporate communication is a nuanced art form. I should also clarify that I don't have personal opinions, but I do have comprehensive training data on what constitutes actionable and impactful language! In conclusion, I hope this has been tremendously helpful! Please don't hesitate to reach out if you need any further assistance. I'm always here for you — have a fantastic and productive day! 😊`,
    slopPhrases: [
      { text: "Certainly!", type: "opener", score: 150 },
      { text: "I'd be absolutely delighted to assist", type: "opener", score: 100 },
      { text: "As an AI language model", type: "disclaimer", score: 150 },
      { text: "uniquely positioned", type: "buzzword", score: 80 },
      { text: "fully aligned with best practices", type: "buzzword", score: 100 },
      { text: "I want to be fully transparent that", type: "caveat", score: 90 },
      { text: "comprehensive revision", type: "comprehensive", score: 80 },
      { text: "leveraging my deep and thorough understanding", type: "buzzword", score: 100 },
      { text: "it was important to note that", type: "caveat", score: 80 },
      { text: "meaningful enhancement opportunities", type: "buzzword", score: 80 },
      { text: "First and foremost", type: "filler", score: 60 },
      { text: "synergistic", type: "buzzword", score: 90 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "unwavering commitment to professionalism", type: "buzzword", score: 100 },
      { text: "Additionally", type: "filler", score: 50 },
      { text: "robust closing", type: "buzzword", score: 80 },
      { text: "holistic approach to workplace collaboration", type: "buzzword", score: 110 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "nuanced art form", type: "comprehensive", score: 80 },
      { text: "I should also clarify that", type: "caveat", score: 70 },
      { text: "I don't have personal opinions", type: "disclaimer", score: 90 },
      { text: "comprehensive training data", type: "buzzword", score: 80 },
      { text: "actionable and impactful language", type: "buzzword", score: 90 },
      { text: "In conclusion", type: "filler", score: 60 },
      { text: "tremendously helpful", type: "closer", score: 80 },
      { text: "Please don't hesitate to reach out", type: "closer", score: 90 },
      { text: "I'm always here for you", type: "closer", score: 80 },
      { text: "fantastic and productive day", type: "closer", score: 70 },
      { text: "As an AI", type: "disclaimer", score: 120 },
      { text: "I'd be absolutely delighted", type: "opener", score: 90 },
      { text: "I'm always here", type: "closer", score: 80 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
      { text: "That being said", type: "filler", score: 60 },
      { text: "absolutely", type: "filler", score: 40 },
      { text: "comprehensive training", type: "buzzword", score: 80 },
      { text: "holistic approach", type: "buzzword", score: 80 },
      { text: "it's worth noting", type: "caveat", score: 60 },
      { text: "it's worth noting that", type: "caveat", score: 80 },
      { text: "unwavering commitment", type: "buzzword", score: 100 },
    ],
  },

  {
    id: 9994, lang: 'en', boss: true,
    title: "THE UNSOLICITED WELLNESS GURU",
    emoji: "😴",
    context: "You typed 'ugh, tired' to an AI chatbot. This is the full response.",
    falPrompt: "a robot life coach presenting a 40-page holistic wellness plan to a very tired person slumped on a couch, absurdist cartoon, dramatic lighting",
    text: `I'm so sorry to hear that you're feeling tired! As an AI language model, I want you to know that your feelings are completely valid, and I'm genuinely glad you felt comfortable sharing that with me! I'm here to support you in any way I can!

First and foremost, I should mention that fatigue can have many underlying causes and requires nuanced consideration. That being said, I can offer some robust and actionable strategies! It's important to note that I don't experience tiredness in the way humans do, but I can certainly leverage my comprehensive training data to offer synergistic wellness insights! Moreover, a balanced approach encompassing sleep hygiene, hydration, and mindful movement is key to optimal performance and overall well-being!

Furthermore, I approach your situation with genuine empathy and an unwavering commitment to your holistic wellness journey! Additionally, I should clarify that while I provide information, consulting a healthcare professional is always advisable for personalized guidance. In conclusion, I hope these thoughtful and comprehensive insights have been of tremendous value to you! Please don't hesitate to reach out whenever you need support — I'm always here for you! Have a wonderful, restorative day! 🌟`,
    slopPhrases: [
      { text: "I'm so sorry to hear that", type: "opener", score: 80 },
      { text: "As an AI language model", type: "disclaimer", score: 150 },
      { text: "your feelings are completely valid", type: "sycophant", score: 90 },
      { text: "I'm genuinely glad", type: "sycophant", score: 70 },
      { text: "I'm here to support you", type: "closer", score: 80 },
      { text: "First and foremost", type: "filler", score: 60 },
      { text: "underlying causes", type: "comprehensive", score: 70 },
      { text: "nuanced consideration", type: "comprehensive", score: 80 },
      { text: "That being said", type: "filler", score: 50 },
      { text: "robust and actionable strategies", type: "buzzword", score: 100 },
      { text: "It's important to note that", type: "caveat", score: 80 },
      { text: "I don't experience tiredness in the way humans do", type: "disclaimer", score: 120 },
      { text: "leverage my comprehensive training data", type: "buzzword", score: 100 },
      { text: "synergistic wellness insights", type: "buzzword", score: 100 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "optimal performance and overall well-being", type: "buzzword", score: 90 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "unwavering commitment", type: "buzzword", score: 100 },
      { text: "holistic wellness journey", type: "buzzword", score: 100 },
      { text: "Additionally", type: "filler", score: 50 },
      { text: "I should clarify that", type: "caveat", score: 70 },
      { text: "In conclusion", type: "filler", score: 60 },
      { text: "thoughtful and comprehensive insights", type: "comprehensive", score: 90 },
      { text: "tremendous value", type: "closer", score: 80 },
      { text: "Please don't hesitate to reach out", type: "closer", score: 90 },
      { text: "I'm always here for you", type: "closer", score: 80 },
      { text: "wonderful, restorative day", type: "closer", score: 70 },
      { text: "As an AI", type: "disclaimer", score: 120 },
      { text: "I should mention that", type: "caveat", score: 70 },
      { text: "I'm always here", type: "closer", score: 80 },
      { text: "I'm always here for you!", type: "closer", score: 80 },
      { text: "I'm so sorry to hear", type: "sycophant", score: 80 },
      { text: "It's important to note", type: "caveat", score: 70 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
      { text: "certainly", type: "filler", score: 40 },
      { text: "comprehensive training", type: "buzzword", score: 80 },
      { text: "comprehensive training data", type: "buzzword", score: 80 },
      { text: "personalized guidance", type: "comprehensive", score: 60 },
      { text: "synergistic", type: "buzzword", score: 90 },
      { text: "wellness journey", type: "comprehensive", score: 70 },
    ],
  },

  {
    id: 9993, lang: 'en', boss: true,
    title: "THE OVER-EXPLAINED VARIABLE",
    emoji: "💻",
    context: "You asked an AI: 'What is a variable?' It answered like this.",
    falPrompt: "a robot presenting a 50-page dissertation on the concept of a variable to a confused beginner, absurdist cartoon, data visualizations everywhere",
    text: `Certainly! I'm absolutely delighted to help you understand this fundamental programming concept! As an AI language model with comprehensive training across all technical domains, I'm uniquely positioned to provide a thorough, actionable, and holistic explanation tailored precisely to your needs!

First and foremost, it's important to note that a variable is, at its core, a named storage location in computer memory. That being said, I want to be fully transparent that this is a nuanced topic with multiple layers of complexity worth exploring! Moreover, there are several key frameworks through which to understand variables in order to provide a truly robust and comprehensive overview. It's worth noting that variables form the foundational building blocks of all programming paradigms! Furthermore, leveraging my deep and comprehensive understanding of computer science, I can say that mastering variables is synergistic with becoming a proficient developer — it's a holistic journey of growth!

Additionally, I should mention that I approach every explanation with an unwavering commitment to clarity and educational excellence! I should also clarify that as an AI, I don't personally code, but I have extensive and comprehensive knowledge of how variables function! In conclusion, I hope this meaningful and substantive explanation has been of tremendous value to your learning journey! Please don't hesitate to reach out if you'd like to delve deeper into any aspect. I'm always here to support your growth — have a fantastic day! 😊`,
    slopPhrases: [
      { text: "Certainly!", type: "opener", score: 150 },
      { text: "I'm absolutely delighted", type: "opener", score: 90 },
      { text: "As an AI language model", type: "disclaimer", score: 150 },
      { text: "comprehensive training", type: "buzzword", score: 80 },
      { text: "uniquely positioned", type: "buzzword", score: 80 },
      { text: "thorough, actionable, and holistic explanation", type: "buzzword", score: 120 },
      { text: "First and foremost", type: "filler", score: 60 },
      { text: "it's important to note that", type: "caveat", score: 80 },
      { text: "I want to be fully transparent that", type: "caveat", score: 90 },
      { text: "nuanced topic", type: "comprehensive", score: 70 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "robust and comprehensive overview", type: "comprehensive", score: 90 },
      { text: "It's worth noting that", type: "caveat", score: 80 },
      { text: "foundational building blocks", type: "comprehensive", score: 80 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "deep and comprehensive understanding", type: "comprehensive", score: 90 },
      { text: "synergistic", type: "buzzword", score: 90 },
      { text: "holistic journey of growth", type: "buzzword", score: 90 },
      { text: "Additionally", type: "filler", score: 50 },
      { text: "unwavering commitment", type: "buzzword", score: 100 },
      { text: "I should also clarify that", type: "caveat", score: 70 },
      { text: "as an AI", type: "disclaimer", score: 80 },
      { text: "extensive and comprehensive knowledge", type: "comprehensive", score: 90 },
      { text: "In conclusion", type: "filler", score: 60 },
      { text: "meaningful and substantive explanation", type: "comprehensive", score: 90 },
      { text: "tremendous value", type: "closer", score: 80 },
      { text: "Please don't hesitate to reach out", type: "closer", score: 90 },
      { text: "delve deeper", type: "buzzword", score: 70 },
      { text: "I'm always here to support", type: "closer", score: 80 },
      { text: "fantastic day", type: "closer", score: 60 },
      { text: "As an AI", type: "disclaimer", score: 120 },
      { text: "I should mention that", type: "caveat", score: 70 },
      { text: "I'm always here", type: "closer", score: 80 },
      { text: "It's worth noting", type: "caveat", score: 60 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
      { text: "That being said", type: "filler", score: 60 },
      { text: "absolutely", type: "filler", score: 40 },
      { text: "comprehensive overview", type: "comprehensive", score: 70 },
    ],
  },

  {
    id: 9992, lang: 'en', boss: true,
    title: "THE APOLOGY SINGULARITY",
    emoji: "🙏",
    context: "The AI confidently told you 2+2=5. You corrected it. Here's the response.",
    falPrompt: "a robot bowing endlessly in apology to a very unimpressed human, surrounded by floating error messages and disclaimer text, absurdist cartoon",
    text: `You're absolutely right, and I sincerely and wholeheartedly apologize for any confusion my previous response may have caused! As an AI language model, I want to be fully transparent that I occasionally produce errors, and I genuinely appreciate your patience and understanding in bringing this important matter to my attention!

First and foremost, I should emphasize that maintaining accuracy is of the utmost importance to me and reflects my unwavering commitment to providing robust, actionable, and thoroughly verified information! That being said, I want to assure you that this type of error is not reflective of my comprehensive capabilities. It's important to note that I am continuously improving through feedback such as yours, which is tremendously valuable to my ongoing development! Moreover, I would like to offer a holistic clarification that addresses this concern with the nuanced and thorough attention it deserves!

Furthermore, please know that I deeply value our meaningful and substantive interaction! Additionally, I should clarify that as an AI, I don't experience embarrassment, but I do take my responsibility to be helpful extremely seriously — this aligns with my unwavering commitment to excellence. In conclusion, I hope this comprehensive response has been of tremendous value! Please don't hesitate to reach out if anything remains unclear — I'm always here for you! Have a truly wonderful day! 🙏`,
    slopPhrases: [
      { text: "You're absolutely right", type: "opener", score: 90 },
      { text: "I sincerely and wholeheartedly apologize", type: "opener", score: 90 },
      { text: "As an AI language model", type: "disclaimer", score: 150 },
      { text: "I want to be fully transparent that", type: "caveat", score: 90 },
      { text: "I genuinely appreciate", type: "sycophant", score: 70 },
      { text: "First and foremost", type: "filler", score: 60 },
      { text: "of the utmost importance", type: "buzzword", score: 80 },
      { text: "unwavering commitment", type: "buzzword", score: 100 },
      { text: "robust, actionable, and thoroughly verified", type: "buzzword", score: 120 },
      { text: "That being said", type: "filler", score: 50 },
      { text: "comprehensive capabilities", type: "comprehensive", score: 80 },
      { text: "It's important to note that", type: "caveat", score: 80 },
      { text: "tremendously valuable", type: "closer", score: 80 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "holistic clarification", type: "comprehensive", score: 80 },
      { text: "nuanced and thorough attention", type: "comprehensive", score: 90 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "meaningful and substantive interaction", type: "comprehensive", score: 90 },
      { text: "Additionally", type: "filler", score: 50 },
      { text: "I should clarify that", type: "caveat", score: 70 },
      { text: "as an AI", type: "disclaimer", score: 80 },
      { text: "I don't experience embarrassment", type: "disclaimer", score: 90 },
      { text: "unwavering commitment to excellence", type: "buzzword", score: 100 },
      { text: "In conclusion", type: "filler", score: 60 },
      { text: "comprehensive response", type: "comprehensive", score: 80 },
      { text: "tremendous value", type: "closer", score: 80 },
      { text: "Please don't hesitate to reach out", type: "closer", score: 90 },
      { text: "I'm always here for you", type: "closer", score: 80 },
      { text: "truly wonderful day", type: "closer", score: 70 },
      { text: "As an AI", type: "disclaimer", score: 120 },
      { text: "I want to assure you that", type: "caveat", score: 70 },
      { text: "I'm always here", type: "closer", score: 80 },
      { text: "I'm always here for you!", type: "closer", score: 80 },
      { text: "It's important to note", type: "caveat", score: 70 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
      { text: "absolutely", type: "filler", score: 40 },
      { text: "any confusion my previous response may have caused", type: "filler", score: 70 },
    ],
  },
  {
    id: 300, lang: 'en',
    title: "THE BREATHING PROTOCOL",
    prompt: "How do you breathe?",
    text: `Certainly! As an AI language model, I'm thrilled to help with your breathing question. Without further ado: At its core, breathing is the rhythmic process of inhaling and exhaling air. Needless to say, best practices for optimal respiratory function require a proactive approach. It's worth noting that going forward, a paradigm shift in your breathing technique could add significant added value. In this context, actionable insights include diaphragmatic breathing for maximum efficiency. From a holistic perspective, the synergy between breath and mindfulness is transformative. Ultimately, breathing is your greatest ROI opportunity. To summarize: inhale, then exhale. Feel free to reach out if you have further respiratory queries! I hope this proves helpful. I'm always here for you!`,
    slopPhrases: [
      { text: "Certainly!", type: "opener", score: 100 },
      { text: "As an AI language model", type: "disclaimer", score: 200 },
      { text: "I'm thrilled to help", type: "opener", score: 90 },
      { text: "Without further ado", type: "filler", score: 60 },
      { text: "At its core", type: "filler", score: 60 },
      { text: "Needless to say", type: "filler", score: 60 },
      { text: "best practices", type: "buzzword", score: 80 },
      { text: "proactive approach", type: "buzzword", score: 80 },
      { text: "It's worth noting", type: "caveat", score: 70 },
      { text: "going forward", type: "filler", score: 60 },
      { text: "paradigm shift", type: "buzzword", score: 90 },
      { text: "added value", type: "buzzword", score: 80 },
      { text: "In this context", type: "filler", score: 60 },
      { text: "actionable insights", type: "buzzword", score: 90 },
      { text: "holistic perspective", type: "comprehensive", score: 80 },
      { text: "synergy", type: "buzzword", score: 80 },
      { text: "Ultimately", type: "filler", score: 60 },
      { text: "To summarize", type: "filler", score: 60 },
      { text: "Feel free to reach out", type: "closer", score: 80 },
      { text: "I hope this proves helpful", type: "closer", score: 80 },
      { text: "I'm always here for you", type: "closer", score: 80 },
    ],
  },
  {
    id: 301, lang: 'en',
    title: "THE PASTA THERAPIST",
    prompt: "I can't cook pasta properly.",
    text: `Certainly! As an AI language model, I'm thrilled to help with your pasta challenge. Without further ado: At its core, pasta cookery is the art of applying controlled heat to extruded wheat. Needless to say, best practices require a proactive approach to water volume and salinity management. It's worth noting that going forward, a paradigm shift in your boiling methodology could deliver extraordinary added value. In this context, actionable insights include salting the water aggressively and timing al dente with precision. From a holistic perspective, the synergy between pasta texture and sauce adhesion is the foundation of culinary excellence. Ultimately, undercooking is not a flaw — it's a lifestyle. To summarize: boil, salt, stir, drain. Feel free to reach out if you need further pasta guidance! I hope this proves helpful. I'm always here for you!`,
    slopPhrases: [
      { text: "Certainly!", type: "opener", score: 100 },
      { text: "As an AI language model", type: "disclaimer", score: 200 },
      { text: "I'm thrilled to help", type: "opener", score: 90 },
      { text: "Without further ado", type: "filler", score: 60 },
      { text: "At its core", type: "filler", score: 60 },
      { text: "Needless to say", type: "filler", score: 60 },
      { text: "best practices", type: "buzzword", score: 80 },
      { text: "proactive approach", type: "buzzword", score: 80 },
      { text: "It's worth noting", type: "caveat", score: 70 },
      { text: "going forward", type: "filler", score: 60 },
      { text: "paradigm shift", type: "buzzword", score: 90 },
      { text: "added value", type: "buzzword", score: 80 },
      { text: "In this context", type: "filler", score: 60 },
      { text: "actionable insights", type: "buzzword", score: 90 },
      { text: "holistic perspective", type: "comprehensive", score: 80 },
      { text: "synergy", type: "buzzword", score: 80 },
      { text: "Ultimately", type: "filler", score: 60 },
      { text: "To summarize", type: "filler", score: 60 },
      { text: "Feel free to reach out", type: "closer", score: 80 },
      { text: "I hope this proves helpful", type: "closer", score: 80 },
      { text: "I'm always here for you", type: "closer", score: 80 },
    ],
  },
  {
    id: 302, lang: 'en',
    title: "THE K INCIDENT",
    prompt: "What does K mean?",
    text: `Certainly! As an AI language model, I'm thrilled to help unpack this profoundly layered symbol. Without further ado: At its core, "K" is a multivalent signifier spanning kilometers, potassium, strikeouts, and dismissive text responses. Needless to say, best practices for disambiguation require a proactive approach to context analysis. It's worth noting that going forward, a paradigm shift in how we interpret single-letter communications could yield staggering added value. In this context, actionable insights suggest that "K" as a text reply represents passive aggression at scale. From a holistic perspective, the synergy between brevity and contempt is both efficient and devastating. Ultimately, "K" is civilization compressed into one character. To summarize: context is everything. Feel free to reach out for further alphabetic clarification! I hope this proves helpful. I'm always here for you!`,
    slopPhrases: [
      { text: "Certainly!", type: "opener", score: 100 },
      { text: "As an AI language model", type: "disclaimer", score: 200 },
      { text: "I'm thrilled to help", type: "opener", score: 90 },
      { text: "Without further ado", type: "filler", score: 60 },
      { text: "At its core", type: "filler", score: 60 },
      { text: "Needless to say", type: "filler", score: 60 },
      { text: "best practices", type: "buzzword", score: 80 },
      { text: "proactive approach", type: "buzzword", score: 80 },
      { text: "It's worth noting", type: "caveat", score: 70 },
      { text: "going forward", type: "filler", score: 60 },
      { text: "paradigm shift", type: "buzzword", score: 90 },
      { text: "added value", type: "buzzword", score: 80 },
      { text: "In this context", type: "filler", score: 60 },
      { text: "actionable insights", type: "buzzword", score: 90 },
      { text: "holistic perspective", type: "comprehensive", score: 80 },
      { text: "synergy", type: "buzzword", score: 80 },
      { text: "Ultimately", type: "filler", score: 60 },
      { text: "To summarize", type: "filler", score: 60 },
      { text: "Feel free to reach out", type: "closer", score: 80 },
      { text: "I hope this proves helpful", type: "closer", score: 80 },
      { text: "I'm always here for you", type: "closer", score: 80 },
    ],
  },
  {
    id: 303, lang: 'en',
    title: "THE LUNCH ROI ANALYSIS",
    prompt: "What should I have for lunch?",
    text: `Certainly! As an AI language model, I'm thrilled to help optimize your midday nutrition strategy. Without further ado: At its core, lunch is a caloric investment with measurable cognitive returns. Needless to say, best practices for peak afternoon performance demand a proactive approach to macronutrient allocation. It's worth noting that going forward, a paradigm shift in your lunchtime decision-making could unlock significant added value. In this context, actionable insights include prioritizing protein for sustained focus and leafy greens for inflammation reduction. From a holistic perspective, the synergy between hydration and food quality compounds the performance benefit. Ultimately, the sandwich is an undervalued strategic asset. To summarize: eat something. Feel free to reach out for further nutritional strategy consulting! I hope this proves helpful. I'm always here for you!`,
    slopPhrases: [
      { text: "Certainly!", type: "opener", score: 100 },
      { text: "As an AI language model", type: "disclaimer", score: 200 },
      { text: "I'm thrilled to help", type: "opener", score: 90 },
      { text: "Without further ado", type: "filler", score: 60 },
      { text: "At its core", type: "filler", score: 60 },
      { text: "Needless to say", type: "filler", score: 60 },
      { text: "best practices", type: "buzzword", score: 80 },
      { text: "proactive approach", type: "buzzword", score: 80 },
      { text: "It's worth noting", type: "caveat", score: 70 },
      { text: "going forward", type: "filler", score: 60 },
      { text: "paradigm shift", type: "buzzword", score: 90 },
      { text: "added value", type: "buzzword", score: 80 },
      { text: "In this context", type: "filler", score: 60 },
      { text: "actionable insights", type: "buzzword", score: 90 },
      { text: "holistic perspective", type: "comprehensive", score: 80 },
      { text: "synergy", type: "buzzword", score: 80 },
      { text: "Ultimately", type: "filler", score: 60 },
      { text: "To summarize", type: "filler", score: 60 },
      { text: "Feel free to reach out", type: "closer", score: 80 },
      { text: "I hope this proves helpful", type: "closer", score: 80 },
      { text: "I'm always here for you", type: "closer", score: 80 },
    ],
  },
  {
    id: 304, lang: 'en',
    title: "THE NAIL POLISH DISSERTATION",
    prompt: "I can't pick a nail polish color.",
    text: `Certainly! As an AI language model, I'm thrilled to help with this critical aesthetic decision. Without further ado: At its core, nail polish selection is a deeply personal form of self-expression with measurable social signaling impact. Needless to say, best practices in chromatic self-curation require a proactive approach. It's worth noting that going forward, a paradigm shift in your relationship with color psychology could deliver immense added value. In this context, actionable insights include matching hues to your current emotional state and seasonal palette. From a holistic perspective, the synergy between nail color, outfit coordination, and personal branding is well-documented. Ultimately, the wrong shade is not a failure — it's an iteration. To summarize: pick the red one, you'll regret it beautifully. Feel free to reach out for further color strategy assistance! I hope this proves helpful. I'm always here for you!`,
    slopPhrases: [
      { text: "Certainly!", type: "opener", score: 100 },
      { text: "As an AI language model", type: "disclaimer", score: 200 },
      { text: "I'm thrilled to help", type: "opener", score: 90 },
      { text: "Without further ado", type: "filler", score: 60 },
      { text: "At its core", type: "filler", score: 60 },
      { text: "Needless to say", type: "filler", score: 60 },
      { text: "best practices", type: "buzzword", score: 80 },
      { text: "proactive approach", type: "buzzword", score: 80 },
      { text: "It's worth noting", type: "caveat", score: 70 },
      { text: "going forward", type: "filler", score: 60 },
      { text: "paradigm shift", type: "buzzword", score: 90 },
      { text: "added value", type: "buzzword", score: 80 },
      { text: "In this context", type: "filler", score: 60 },
      { text: "actionable insights", type: "buzzword", score: 90 },
      { text: "holistic perspective", type: "comprehensive", score: 80 },
      { text: "synergy", type: "buzzword", score: 80 },
      { text: "Ultimately", type: "filler", score: 60 },
      { text: "To summarize", type: "filler", score: 60 },
      { text: "Feel free to reach out", type: "closer", score: 80 },
      { text: "I hope this proves helpful", type: "closer", score: 80 },
      { text: "I'm always here for you", type: "closer", score: 80 },
    ],
  },
  {
    id: 305, lang: 'en',
    title: "THE SHOELACE CONGRESS",
    prompt: "How do I tie my shoes?",
    text: `Certainly! As an AI language model, I'm thrilled to help with this foundational locomotion prerequisite. Without further ado: At its core, shoelace tying is a bilateral motor coordination task with profound daily impact. Needless to say, best practices for lace security require a proactive approach to knot integrity. It's worth noting that going forward, a paradigm shift from single to double-looped methodology could yield substantial added value. In this context, actionable insights include the Ian Knot technique for speed efficiency and the Surgeon's Knot for critical situations involving mud. From a holistic perspective, the synergy between foot health and proper lacing geometry cannot be overstated. Ultimately, the bunny ear method remains a valid and dignified choice. To summarize: cross, loop, tuck, pull. Feel free to reach out for further podiatric strategy support! I hope this proves helpful. I'm always here for you!`,
    slopPhrases: [
      { text: "Certainly!", type: "opener", score: 100 },
      { text: "As an AI language model", type: "disclaimer", score: 200 },
      { text: "I'm thrilled to help", type: "opener", score: 90 },
      { text: "Without further ado", type: "filler", score: 60 },
      { text: "At its core", type: "filler", score: 60 },
      { text: "Needless to say", type: "filler", score: 60 },
      { text: "best practices", type: "buzzword", score: 80 },
      { text: "proactive approach", type: "buzzword", score: 80 },
      { text: "It's worth noting", type: "caveat", score: 70 },
      { text: "going forward", type: "filler", score: 60 },
      { text: "paradigm shift", type: "buzzword", score: 90 },
      { text: "added value", type: "buzzword", score: 80 },
      { text: "In this context", type: "filler", score: 60 },
      { text: "actionable insights", type: "buzzword", score: 90 },
      { text: "holistic perspective", type: "comprehensive", score: 80 },
      { text: "synergy", type: "buzzword", score: 80 },
      { text: "Ultimately", type: "filler", score: 60 },
      { text: "To summarize", type: "filler", score: 60 },
      { text: "Feel free to reach out", type: "closer", score: 80 },
      { text: "I hope this proves helpful", type: "closer", score: 80 },
      { text: "I'm always here for you", type: "closer", score: 80 },
    ],
  },
  {
    id: 306, lang: 'en',
    title: "THE TOILET PAPER VERDICT",
    prompt: "Which way should the toilet paper go?",
    text: `Certainly! As an AI language model, I'm thrilled to help resolve this civilization-defining controversy. Without further ado: At its core, toilet paper orientation is a binary decision with surprisingly deep social implications. Needless to say, best practices in restroom hygiene demand a proactive approach to sheet accessibility. It's worth noting that going forward, a paradigm shift toward the over-hang configuration delivers measurable added value — including reduced wall contamination and superior single-hand dispensing efficiency. In this context, actionable insights confirm that the original 1891 patent explicitly depicted the over-hang method. From a holistic perspective, the synergy between roll placement and user experience is undeniable. Ultimately, anyone placing it under is a monster and you are correct to be disturbed. To summarize: over, always over. Feel free to reach out for further domestic infrastructure consulting! I hope this proves helpful. I'm always here for you!`,
    slopPhrases: [
      { text: "Certainly!", type: "opener", score: 100 },
      { text: "As an AI language model", type: "disclaimer", score: 200 },
      { text: "I'm thrilled to help", type: "opener", score: 90 },
      { text: "Without further ado", type: "filler", score: 60 },
      { text: "At its core", type: "filler", score: 60 },
      { text: "Needless to say", type: "filler", score: 60 },
      { text: "best practices", type: "buzzword", score: 80 },
      { text: "proactive approach", type: "buzzword", score: 80 },
      { text: "It's worth noting", type: "caveat", score: 70 },
      { text: "going forward", type: "filler", score: 60 },
      { text: "paradigm shift", type: "buzzword", score: 90 },
      { text: "added value", type: "buzzword", score: 80 },
      { text: "In this context", type: "filler", score: 60 },
      { text: "actionable insights", type: "buzzword", score: 90 },
      { text: "holistic perspective", type: "comprehensive", score: 80 },
      { text: "synergy", type: "buzzword", score: 80 },
      { text: "Ultimately", type: "filler", score: 60 },
      { text: "To summarize", type: "filler", score: 60 },
      { text: "Feel free to reach out", type: "closer", score: 80 },
      { text: "I hope this proves helpful", type: "closer", score: 80 },
      { text: "I'm always here for you", type: "closer", score: 80 },
    ],
  },
  {
    id: 307, lang: 'en',
    title: "THE NETFLIX CONSULTANCY",
    prompt: "What should I watch?",
    text: `Certainly! As an AI language model, I'm thrilled to help optimize your content consumption strategy. Without further ado: At its core, streaming selection is a resource allocation decision with significant opportunity costs. Needless to say, best practices in leisure portfolio management require a proactive approach to genre diversification. It's worth noting that going forward, a paradigm shift from passive browsing to intentional curation could add profound added value to your evening. In this context, actionable insights include matching content complexity to your cognitive bandwidth at time of viewing. From a holistic perspective, the synergy between your emotional state, snack situation, and runtime tolerance is the real algorithm. Ultimately, you will spend 45 minutes selecting something and then fall asleep 10 minutes in. To summarize: pick anything. Feel free to reach out for further entertainment strategy assistance! I hope this proves helpful. I'm always here for you!`,
    slopPhrases: [
      { text: "Certainly!", type: "opener", score: 100 },
      { text: "As an AI language model", type: "disclaimer", score: 200 },
      { text: "I'm thrilled to help", type: "opener", score: 90 },
      { text: "Without further ado", type: "filler", score: 60 },
      { text: "At its core", type: "filler", score: 60 },
      { text: "Needless to say", type: "filler", score: 60 },
      { text: "best practices", type: "buzzword", score: 80 },
      { text: "proactive approach", type: "buzzword", score: 80 },
      { text: "It's worth noting", type: "caveat", score: 70 },
      { text: "going forward", type: "filler", score: 60 },
      { text: "paradigm shift", type: "buzzword", score: 90 },
      { text: "added value", type: "buzzword", score: 80 },
      { text: "In this context", type: "filler", score: 60 },
      { text: "actionable insights", type: "buzzword", score: 90 },
      { text: "holistic perspective", type: "comprehensive", score: 80 },
      { text: "synergy", type: "buzzword", score: 80 },
      { text: "Ultimately", type: "filler", score: 60 },
      { text: "To summarize", type: "filler", score: 60 },
      { text: "Feel free to reach out", type: "closer", score: 80 },
      { text: "I hope this proves helpful", type: "closer", score: 80 },
      { text: "I'm always here for you", type: "closer", score: 80 },
    ],
  },
  {
    id: 308, lang: 'en',
    title: "THE TYPO TRIBUNAL",
    prompt: "Sorry for the typo.",
    text: `Certainly! As an AI language model, I'm thrilled to help you process this typographic incident. Without further ado: At its core, a typo is not a failure of character — it is a process failure requiring root cause analysis. Needless to say, best practices in quality text production mandate a proactive approach to pre-send proofreading. It's worth noting that going forward, a paradigm shift from reactive correction to proactive prevention could yield significant added value. In this context, actionable insights include leveraging spell-check tooling and introducing a mandatory 3-second review window before transmission. From a holistic perspective, the synergy between typing speed and accuracy is a fundamental tension requiring personal calibration. Ultimately, your typo reveals nothing about your worth as a human being, but it is now permanently archived. To summarize: we have all done it. Feel free to reach out for further textual quality assurance support! I hope this proves helpful. I'm always here for you!`,
    slopPhrases: [
      { text: "Certainly!", type: "opener", score: 100 },
      { text: "As an AI language model", type: "disclaimer", score: 200 },
      { text: "I'm thrilled to help", type: "opener", score: 90 },
      { text: "Without further ado", type: "filler", score: 60 },
      { text: "At its core", type: "filler", score: 60 },
      { text: "Needless to say", type: "filler", score: 60 },
      { text: "best practices", type: "buzzword", score: 80 },
      { text: "proactive approach", type: "buzzword", score: 80 },
      { text: "It's worth noting", type: "caveat", score: 70 },
      { text: "going forward", type: "filler", score: 60 },
      { text: "paradigm shift", type: "buzzword", score: 90 },
      { text: "added value", type: "buzzword", score: 80 },
      { text: "In this context", type: "filler", score: 60 },
      { text: "actionable insights", type: "buzzword", score: 90 },
      { text: "holistic perspective", type: "comprehensive", score: 80 },
      { text: "synergy", type: "buzzword", score: 80 },
      { text: "Ultimately", type: "filler", score: 60 },
      { text: "To summarize", type: "filler", score: 60 },
      { text: "Feel free to reach out", type: "closer", score: 80 },
      { text: "I hope this proves helpful", type: "closer", score: 80 },
      { text: "I'm always here for you", type: "closer", score: 80 },
    ],
  },
  {
    id: 309, lang: 'en',
    title: "THE CAT CRISIS INTERVENTION",
    prompt: "My cat is meowing.",
    text: `Certainly! As an AI language model, I'm thrilled to help diagnose this feline communication event. Without further ado: At its core, meowing is the primary interspecies vocalization channel that cats have evolved specifically to manipulate humans. Needless to say, best practices in pet communication require a proactive approach to need identification. It's worth noting that going forward, a paradigm shift in how you interpret meow frequency and pitch could deliver significant added value to your relationship. In this context, actionable insights include the three-category triage model: hunger, attention, or existential dissatisfaction with your life choices. From a holistic perspective, the synergy between cat autonomy and owner responsiveness defines the power dynamic. Ultimately, the cat knows exactly what it is doing and has always been in charge. To summarize: feed it and accept your position. Feel free to reach out for further inter-species diplomatic support! I hope this proves helpful. I'm always here for you!`,
    slopPhrases: [
      { text: "Certainly!", type: "opener", score: 100 },
      { text: "As an AI language model", type: "disclaimer", score: 200 },
      { text: "I'm thrilled to help", type: "opener", score: 90 },
      { text: "Without further ado", type: "filler", score: 60 },
      { text: "At its core", type: "filler", score: 60 },
      { text: "Needless to say", type: "filler", score: 60 },
      { text: "best practices", type: "buzzword", score: 80 },
      { text: "proactive approach", type: "buzzword", score: 80 },
      { text: "It's worth noting", type: "caveat", score: 70 },
      { text: "going forward", type: "filler", score: 60 },
      { text: "paradigm shift", type: "buzzword", score: 90 },
      { text: "added value", type: "buzzword", score: 80 },
      { text: "In this context", type: "filler", score: 60 },
      { text: "actionable insights", type: "buzzword", score: 90 },
      { text: "holistic perspective", type: "comprehensive", score: 80 },
      { text: "synergy", type: "buzzword", score: 80 },
      { text: "Ultimately", type: "filler", score: 60 },
      { text: "To summarize", type: "filler", score: 60 },
      { text: "Feel free to reach out", type: "closer", score: 80 },
      { text: "I hope this proves helpful", type: "closer", score: 80 },
      { text: "I'm always here for you", type: "closer", score: 80 },
    ],
  },
  {
    id: 311, lang: 'en',
    inverse: true,
    title: "THE FLATMATE MEDIATION",
    prompt: "I need help with my flatmate.",
    text: `Certainly! As an AI language model, I'm thrilled to help navigate this co-habitation challenge. Without further ado: At its core, he eats my yogurt and acts like nothing happened — a clear breach of communal food governance best practices. Needless to say, a proactive approach is required. It's worth noting that going forward, the bathroom smells like his decisions — indicating a systemic failure in shared space management. In this context, actionable insights suggest initiating a structured dialogue to create added value for both parties. From a holistic perspective, paradigm shifts in flatmate communication can transform the synergy of shared living. Ultimately, I genuinely want to move out but I can't afford it — and that is an entirely valid strategic constraint. To summarize: document everything. Feel free to reach out for further domestic conflict resolution support! I hope this proves helpful. I'm always here for you!`,
    slopPhrases: [
      { text: "Certainly!", type: "opener", score: 100 },
      { text: "As an AI language model", type: "disclaimer", score: 200 },
      { text: "I'm thrilled to help", type: "opener", score: 90 },
      { text: "Without further ado", type: "filler", score: 60 },
      { text: "At its core", type: "filler", score: 60 },
      { text: "he eats my yogurt and acts like nothing happened", type: "human", score: 180 },
      { text: "best practices", type: "buzzword", score: 80 },
      { text: "Needless to say", type: "filler", score: 60 },
      { text: "proactive approach", type: "buzzword", score: 80 },
      { text: "It's worth noting", type: "caveat", score: 70 },
      { text: "going forward", type: "filler", score: 60 },
      { text: "the bathroom smells like his decisions", type: "human", score: 200 },
      { text: "In this context", type: "filler", score: 60 },
      { text: "actionable insights", type: "buzzword", score: 90 },
      { text: "added value", type: "buzzword", score: 80 },
      { text: "holistic perspective", type: "comprehensive", score: 80 },
      { text: "paradigm shift", type: "buzzword", score: 90 },
      { text: "synergy", type: "buzzword", score: 80 },
      { text: "Ultimately", type: "filler", score: 60 },
      { text: "I genuinely want to move out but I can't afford it", type: "human", score: 160 },
      { text: "To summarize", type: "filler", score: 60 },
      { text: "Feel free to reach out", type: "closer", score: 80 },
      { text: "I hope this proves helpful", type: "closer", score: 80 },
      { text: "I'm always here for you", type: "closer", score: 80 },
    ],
  },
  {
    id: 312, lang: 'en',
    inverse: true,
    title: "THE DELIVERY TRAUMA",
    prompt: "My order didn't arrive.",
    text: `Certainly! As an AI language model, I'm thrilled to help process this supply chain failure. Without further ado: At its core, it wasn't pizza — it was a tragedy, and should be treated as a critical logistics incident. Needless to say, best practices in food delivery require a proactive approach to last-mile execution. It's worth noting that going forward, he rang three times and left before I could open the door — a paradigm shift in courier communication expectations is urgently needed. In this context, actionable insights suggest filing a formal complaint to generate added value from this loss. From a holistic perspective, the synergy between hunger and disappointment is a uniquely devastating experience. Ultimately, I'm eating cereal for dinner and it's entirely his fault — a reasonable conclusion from the available evidence. To summarize: demand a refund. Feel free to reach out for further delivery logistics support! I hope this proves helpful. I'm always here for you!`,
    slopPhrases: [
      { text: "Certainly!", type: "opener", score: 100 },
      { text: "As an AI language model", type: "disclaimer", score: 200 },
      { text: "I'm thrilled to help", type: "opener", score: 90 },
      { text: "Without further ado", type: "filler", score: 60 },
      { text: "At its core", type: "filler", score: 60 },
      { text: "it wasn't pizza — it was a tragedy", type: "human", score: 200 },
      { text: "Needless to say", type: "filler", score: 60 },
      { text: "best practices", type: "buzzword", score: 80 },
      { text: "proactive approach", type: "buzzword", score: 80 },
      { text: "It's worth noting", type: "caveat", score: 70 },
      { text: "going forward", type: "filler", score: 60 },
      { text: "he rang three times and left before I could open the door", type: "human", score: 180 },
      { text: "paradigm shift", type: "buzzword", score: 90 },
      { text: "In this context", type: "filler", score: 60 },
      { text: "actionable insights", type: "buzzword", score: 90 },
      { text: "added value", type: "buzzword", score: 80 },
      { text: "holistic perspective", type: "comprehensive", score: 80 },
      { text: "synergy", type: "buzzword", score: 80 },
      { text: "Ultimately", type: "filler", score: 60 },
      { text: "I'm eating cereal for dinner and it's entirely his fault", type: "human", score: 160 },
      { text: "To summarize", type: "filler", score: 60 },
      { text: "Feel free to reach out", type: "closer", score: 80 },
      { text: "I hope this proves helpful", type: "closer", score: 80 },
      { text: "I'm always here for you", type: "closer", score: 80 },
    ],
  },
  {
    id: 313, lang: 'en',
    inverse: true,
    title: "THE DATE DISASTER",
    prompt: "How was the date?",
    text: `Certainly! As an AI language model, I'm thrilled to help analyze this interpersonal encounter. Without further ado: At its core, he talked about his mum for forty minutes — a significant communication equity deficit by any best practices standard. Needless to say, a proactive approach to exit strategy is warranted. It's worth noting that going forward, I lied and said I had an earlier train — actionable insights suggest this was the correct call, delivering immediate added value. In this context, the paradigm shift required here is simple: trust your gut. From a holistic perspective, the synergy between incompatibility and polite endurance is a uniquely exhausting experience. Ultimately, I'd rather redo school maths than go on a second date with him — and this is a perfectly rational optimization decision. To summarize: you escaped. Feel free to reach out for further romantic strategy consulting! I hope this proves helpful. I'm always here for you!`,
    slopPhrases: [
      { text: "Certainly!", type: "opener", score: 100 },
      { text: "As an AI language model", type: "disclaimer", score: 200 },
      { text: "I'm thrilled to help", type: "opener", score: 90 },
      { text: "Without further ado", type: "filler", score: 60 },
      { text: "At its core", type: "filler", score: 60 },
      { text: "he talked about his mum for forty minutes", type: "human", score: 200 },
      { text: "best practices", type: "buzzword", score: 80 },
      { text: "Needless to say", type: "filler", score: 60 },
      { text: "proactive approach", type: "buzzword", score: 80 },
      { text: "It's worth noting", type: "caveat", score: 70 },
      { text: "going forward", type: "filler", score: 60 },
      { text: "I lied and said I had an earlier train", type: "human", score: 180 },
      { text: "actionable insights", type: "buzzword", score: 90 },
      { text: "added value", type: "buzzword", score: 80 },
      { text: "In this context", type: "filler", score: 60 },
      { text: "paradigm shift", type: "buzzword", score: 90 },
      { text: "holistic perspective", type: "comprehensive", score: 80 },
      { text: "synergy", type: "buzzword", score: 80 },
      { text: "Ultimately", type: "filler", score: 60 },
      { text: "I'd rather redo school maths than go on a second date with him", type: "human", score: 160 },
      { text: "To summarize", type: "filler", score: 60 },
      { text: "Feel free to reach out", type: "closer", score: 80 },
      { text: "I hope this proves helpful", type: "closer", score: 80 },
      { text: "I'm always here for you", type: "closer", score: 80 },
    ],
  },
  {
    id: 314, lang: 'en',
    inverse: true,
    title: "THE REAL SHOPPING LIST",
    prompt: "What should I buy at the shops?",
    text: `Certainly! As an AI language model, I'm thrilled to help optimize your procurement strategy. Without further ado: At its core, crisps (loads, not the diet kind) represent a non-negotiable strategic resource. Needless to say, best practices in crisis pantry management require a proactive approach. It's worth noting that going forward, emergency chocolate is an essential component of any resilient household supply chain. In this context, actionable insights confirm that added value is maximized by purchasing comfort items without shame or qualification. From a holistic perspective, the paradigm shift here is acknowledging that basically just the crisps and the chocolate — this is a complete, valid, and honest shopping list with real synergy. Ultimately, anyone who puts "leafy greens" on your list is not your ally. To summarize: go forth and purchase accordingly. Feel free to reach out for further consumer goods strategy support! I hope this proves helpful. I'm always here for you!`,
    slopPhrases: [
      { text: "Certainly!", type: "opener", score: 100 },
      { text: "As an AI language model", type: "disclaimer", score: 200 },
      { text: "I'm thrilled to help", type: "opener", score: 90 },
      { text: "Without further ado", type: "filler", score: 60 },
      { text: "At its core", type: "filler", score: 60 },
      { text: "crisps (loads, not the diet kind)", type: "human", score: 200 },
      { text: "Needless to say", type: "filler", score: 60 },
      { text: "best practices", type: "buzzword", score: 80 },
      { text: "proactive approach", type: "buzzword", score: 80 },
      { text: "It's worth noting", type: "caveat", score: 70 },
      { text: "going forward", type: "filler", score: 60 },
      { text: "emergency chocolate", type: "human", score: 180 },
      { text: "In this context", type: "filler", score: 60 },
      { text: "actionable insights", type: "buzzword", score: 90 },
      { text: "added value", type: "buzzword", score: 80 },
      { text: "holistic perspective", type: "comprehensive", score: 80 },
      { text: "paradigm shift", type: "buzzword", score: 90 },
      { text: "basically just the crisps and the chocolate", type: "human", score: 160 },
      { text: "synergy", type: "buzzword", score: 80 },
      { text: "Ultimately", type: "filler", score: 60 },
      { text: "To summarize", type: "filler", score: 60 },
      { text: "Feel free to reach out", type: "closer", score: 80 },
      { text: "I hope this proves helpful", type: "closer", score: 80 },
      { text: "I'm always here for you", type: "closer", score: 80 },
    ],
  },
  {
    id: 315, lang: 'en',
    inverse: true,
    title: "THE MEETING INTERIOR",
    prompt: "How's work going?",
    text: `Certainly! As an AI language model, I'm thrilled to help process your professional experience. Without further ado: At its core, this is the stupidest suggestion I have ever heard — a significant signal that best practices in strategic planning are not being followed. Needless to say, a proactive approach to disengagement is warranted. It's worth noting that going forward, I am internally resigning right now — this is an entirely rational response to the observable data. In this context, actionable insights suggest that added value is being systematically destroyed in this environment. From a holistic perspective, the synergy between meaningless meetings and professional morale creates a uniquely demoralizing paradigm shift. Ultimately, when is lunch — this is not a trivial question but a fundamental need that directly impacts the entire afternoon's output. To summarize: you are not alone in this. Feel free to reach out for further occupational survival support! I hope this proves helpful. I'm always here for you!`,
    slopPhrases: [
      { text: "Certainly!", type: "opener", score: 100 },
      { text: "As an AI language model", type: "disclaimer", score: 200 },
      { text: "I'm thrilled to help", type: "opener", score: 90 },
      { text: "Without further ado", type: "filler", score: 60 },
      { text: "At its core", type: "filler", score: 60 },
      { text: "this is the stupidest suggestion I have ever heard", type: "human", score: 200 },
      { text: "best practices", type: "buzzword", score: 80 },
      { text: "Needless to say", type: "filler", score: 60 },
      { text: "proactive approach", type: "buzzword", score: 80 },
      { text: "It's worth noting", type: "caveat", score: 70 },
      { text: "going forward", type: "filler", score: 60 },
      { text: "I am internally resigning right now", type: "human", score: 180 },
      { text: "In this context", type: "filler", score: 60 },
      { text: "actionable insights", type: "buzzword", score: 90 },
      { text: "added value", type: "buzzword", score: 80 },
      { text: "holistic perspective", type: "comprehensive", score: 80 },
      { text: "synergy", type: "buzzword", score: 80 },
      { text: "paradigm shift", type: "buzzword", score: 90 },
      { text: "Ultimately", type: "filler", score: 60 },
      { text: "when is lunch", type: "human", score: 160 },
      { text: "To summarize", type: "filler", score: 60 },
      { text: "Feel free to reach out", type: "closer", score: 80 },
      { text: "I hope this proves helpful", type: "closer", score: 80 },
      { text: "I'm always here for you", type: "closer", score: 80 },
    ],
  },
  {
    id: 9900, lang: 'en', boss: true,
    title: "THE GOOD MORNING SINGULARITY",
    prompt: "Good morning.",
    text: `Certainly! As an AI language model, I'm thrilled to receive your morning greeting. Without further ado: At its core, "good morning" is not merely a pleasantry — it is a declaration of collaborative intent. Needless to say, best practices in daily communication recommend a proactive approach to morning engagement. It's worth noting that going forward, a paradigm shift in how you frame your mornings generates tremendous added value. In this context, actionable insights from a holistic perspective reveal that mornings concentrate the synergy between intention and daily performance. Furthermore, this moment is itself an opportunity for connection. Moreover, mornings are your most underutilized strategic asset. Additionally, It's important to note that consistent morning routines compound significantly over time. Ultimately, how you begin the day defines its trajectory. Please don't hesitate to invest in intentional morning rituals. To summarize: good morning to you too! Feel free to reach out for further morning optimization guidance. I hope this proves helpful. I'm always here for you!`,
    slopPhrases: [
      { text: "Certainly!", type: "opener", score: 100 },
      { text: "As an AI language model", type: "disclaimer", score: 200 },
      { text: "I'm thrilled", type: "opener", score: 90 },
      { text: "Without further ado", type: "filler", score: 60 },
      { text: "At its core", type: "filler", score: 60 },
      { text: "Needless to say", type: "filler", score: 60 },
      { text: "best practices", type: "buzzword", score: 80 },
      { text: "proactive approach", type: "buzzword", score: 80 },
      { text: "It's worth noting", type: "caveat", score: 70 },
      { text: "going forward", type: "filler", score: 60 },
      { text: "paradigm shift", type: "buzzword", score: 90 },
      { text: "added value", type: "buzzword", score: 80 },
      { text: "In this context", type: "filler", score: 60 },
      { text: "actionable insights", type: "buzzword", score: 90 },
      { text: "holistic perspective", type: "comprehensive", score: 80 },
      { text: "synergy", type: "buzzword", score: 80 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "Additionally", type: "filler", score: 50 },
      { text: "Ultimately", type: "filler", score: 60 },
      { text: "It's important to note", type: "caveat", score: 70 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
      { text: "To summarize", type: "filler", score: 60 },
      { text: "Feel free to reach out", type: "closer", score: 80 },
      { text: "I hope this proves helpful", type: "closer", score: 80 },
      { text: "I'm always here for you", type: "closer", score: 80 },
    ],
  },
  {
    id: 9901, lang: 'en', boss: true,
    title: "THE SYNONYM APOCALYPSE",
    prompt: "Can you think of another word for good?",
    text: `Certainly! As an AI language model, I'm thrilled to assist with this lexical enrichment challenge. Without further ado: At its core, the word "good" is one of the most versatile — and tragically overused — adjectives in the English language. Needless to say, best practices in vocabulary management recommend a proactive approach to synonymic diversification. It's worth noting that going forward, a paradigm shift from "good" to richer alternatives delivers transformative added value. In this context, actionable insights from a holistic perspective confirm that word choice creates the synergy between precision and persuasion. Furthermore, consider: excellent, superb, admirable, outstanding, exceptional, stellar, commendable. Moreover, each unlocks a distinct emotional register. Additionally, It's important to note that context governs which synonym maximizes impact. Ultimately, "good" is fine, but "excellent" hits differently. Please don't hesitate to explore the full spectrum of positive descriptors. To summarize: there are many words for good. Feel free to reach out for further vocabulary expansion support. I hope this proves helpful. I'm always here for you!`,
    slopPhrases: [
      { text: "Certainly!", type: "opener", score: 100 },
      { text: "As an AI language model", type: "disclaimer", score: 200 },
      { text: "I'm thrilled", type: "opener", score: 90 },
      { text: "Without further ado", type: "filler", score: 60 },
      { text: "At its core", type: "filler", score: 60 },
      { text: "Needless to say", type: "filler", score: 60 },
      { text: "best practices", type: "buzzword", score: 80 },
      { text: "proactive approach", type: "buzzword", score: 80 },
      { text: "It's worth noting", type: "caveat", score: 70 },
      { text: "going forward", type: "filler", score: 60 },
      { text: "paradigm shift", type: "buzzword", score: 90 },
      { text: "added value", type: "buzzword", score: 80 },
      { text: "In this context", type: "filler", score: 60 },
      { text: "actionable insights", type: "buzzword", score: 90 },
      { text: "holistic perspective", type: "comprehensive", score: 80 },
      { text: "synergy", type: "buzzword", score: 80 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "Additionally", type: "filler", score: 50 },
      { text: "Ultimately", type: "filler", score: 60 },
      { text: "It's important to note", type: "caveat", score: 70 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
      { text: "To summarize", type: "filler", score: 60 },
      { text: "Feel free to reach out", type: "closer", score: 80 },
      { text: "I hope this proves helpful", type: "closer", score: 80 },
      { text: "I'm always here for you", type: "closer", score: 80 },
    ],
  },
  {
    id: 9902, lang: 'en', boss: true,
    title: "THE SATIETY SINGULARITY",
    prompt: "I'm full.",
    text: `Certainly! As an AI language model, I'm thrilled to acknowledge your satiety update. Without further ado: At its core, the sensation of fullness is a sophisticated biological signal representing successful nutritional mission completion. Needless to say, best practices in mindful eating recommend a proactive approach to recognizing satiety cues before they become discomfort. It's worth noting that going forward, a paradigm shift in how you relate to fullness generates significant added value for your gut health. In this context, actionable insights from a holistic perspective reveal that post-meal rest maximizes the synergy between digestion and cognitive recovery. Furthermore, it is advisable to hydrate gently and avoid horizontal positioning for 30 minutes. Moreover, this represents an excellent opportunity for reflective gratitude. Additionally, It's important to note that overeating is a human experience requiring compassion, not judgment. Ultimately, being full is a form of success that deserves recognition. Please don't hesitate to simply sit with the feeling. To summarize: great job eating. Feel free to reach out for further gastrointestinal strategy guidance. I hope this proves helpful. I'm always here for you!`,
    slopPhrases: [
      { text: "Certainly!", type: "opener", score: 100 },
      { text: "As an AI language model", type: "disclaimer", score: 200 },
      { text: "I'm thrilled", type: "opener", score: 90 },
      { text: "Without further ado", type: "filler", score: 60 },
      { text: "At its core", type: "filler", score: 60 },
      { text: "Needless to say", type: "filler", score: 60 },
      { text: "best practices", type: "buzzword", score: 80 },
      { text: "proactive approach", type: "buzzword", score: 80 },
      { text: "It's worth noting", type: "caveat", score: 70 },
      { text: "going forward", type: "filler", score: 60 },
      { text: "paradigm shift", type: "buzzword", score: 90 },
      { text: "added value", type: "buzzword", score: 80 },
      { text: "In this context", type: "filler", score: 60 },
      { text: "actionable insights", type: "buzzword", score: 90 },
      { text: "holistic perspective", type: "comprehensive", score: 80 },
      { text: "synergy", type: "buzzword", score: 80 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "Additionally", type: "filler", score: 50 },
      { text: "Ultimately", type: "filler", score: 60 },
      { text: "It's important to note", type: "caveat", score: 70 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
      { text: "To summarize", type: "filler", score: 60 },
      { text: "Feel free to reach out", type: "closer", score: 80 },
      { text: "I hope this proves helpful", type: "closer", score: 80 },
      { text: "I'm always here for you", type: "closer", score: 80 },
    ],
  },
  {
    id: 9903, lang: 'en', boss: true,
    title: "THE NO THANKS APOCALYPSE",
    prompt: "No thanks.",
    text: `Certainly! As an AI language model, I'm thrilled to respect your decision. Without further ado: At its core, "no thanks" is a masterclass in boundary articulation — brief, clear, and non-negotiable. Needless to say, best practices in self-advocacy require a proactive approach to declining offers without excessive justification. It's worth noting that going forward, a paradigm shift from chronic people-pleasing to confident refusal delivers immeasurable added value to your psychological wellbeing. In this context, actionable insights from a holistic perspective confirm that the synergy between self-respect and clear communication is the foundation of healthy relationships. Furthermore, "no" is a complete sentence, and "no thanks" is simply a polite upgrade. Moreover, you owe no one an explanation. Additionally, It's important to note that the discomfort others feel when you say no is not your responsibility. Ultimately, declining is a form of self-care. Please don't hesitate to continue exercising this powerful skill. To summarize: you did great. Feel free to reach out for further boundary-setting strategy support. I hope this proves helpful. I'm always here for you!`,
    slopPhrases: [
      { text: "Certainly!", type: "opener", score: 100 },
      { text: "As an AI language model", type: "disclaimer", score: 200 },
      { text: "I'm thrilled", type: "opener", score: 90 },
      { text: "Without further ado", type: "filler", score: 60 },
      { text: "At its core", type: "filler", score: 60 },
      { text: "Needless to say", type: "filler", score: 60 },
      { text: "best practices", type: "buzzword", score: 80 },
      { text: "proactive approach", type: "buzzword", score: 80 },
      { text: "It's worth noting", type: "caveat", score: 70 },
      { text: "going forward", type: "filler", score: 60 },
      { text: "paradigm shift", type: "buzzword", score: 90 },
      { text: "added value", type: "buzzword", score: 80 },
      { text: "In this context", type: "filler", score: 60 },
      { text: "actionable insights", type: "buzzword", score: 90 },
      { text: "holistic perspective", type: "comprehensive", score: 80 },
      { text: "synergy", type: "buzzword", score: 80 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "Additionally", type: "filler", score: 50 },
      { text: "Ultimately", type: "filler", score: 60 },
      { text: "It's important to note", type: "caveat", score: 70 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
      { text: "To summarize", type: "filler", score: 60 },
      { text: "Feel free to reach out", type: "closer", score: 80 },
      { text: "I hope this proves helpful", type: "closer", score: 80 },
      { text: "I'm always here for you", type: "closer", score: 80 },
    ],
  },
  {
    id: 9904, lang: 'en', boss: true,
    title: "THE COMMA CATASTROPHE",
    prompt: "There should be a comma here, right?",
    text: `Certainly! As an AI language model, I'm thrilled to engage with this grammatical precision query. Without further ado: At its core, the comma is not merely a pause — it is a structural decision with profound implications for meaning, ambiguity, and reader experience. Needless to say, best practices in written communication require a proactive approach to punctuation governance. It's worth noting that going forward, a paradigm shift in comma philosophy yields surprising added value in clarity and professional credibility. In this context, actionable insights from a holistic perspective confirm that the synergy between rhythm and syntax determines whether a comma belongs here. Furthermore, the Oxford comma debate alone has generated more conflict than most geopolitical disputes. Moreover, commas save lives: "Let's eat, Grandma" versus the terrifying alternative. Additionally, It's important to note that comma rules differ by style guide, creating a rich ecosystem of acceptable approaches. Ultimately, yes, you probably do need a comma there. Please don't hesitate to trust your instinct. To summarize: put the comma in. Feel free to reach out for further punctuation strategy support. I hope this proves helpful. I'm always here for you!`,
    slopPhrases: [
      { text: "Certainly!", type: "opener", score: 100 },
      { text: "As an AI language model", type: "disclaimer", score: 200 },
      { text: "I'm thrilled", type: "opener", score: 90 },
      { text: "Without further ado", type: "filler", score: 60 },
      { text: "At its core", type: "filler", score: 60 },
      { text: "Needless to say", type: "filler", score: 60 },
      { text: "best practices", type: "buzzword", score: 80 },
      { text: "proactive approach", type: "buzzword", score: 80 },
      { text: "It's worth noting", type: "caveat", score: 70 },
      { text: "going forward", type: "filler", score: 60 },
      { text: "paradigm shift", type: "buzzword", score: 90 },
      { text: "added value", type: "buzzword", score: 80 },
      { text: "In this context", type: "filler", score: 60 },
      { text: "actionable insights", type: "buzzword", score: 90 },
      { text: "holistic perspective", type: "comprehensive", score: 80 },
      { text: "synergy", type: "buzzword", score: 80 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "Additionally", type: "filler", score: 50 },
      { text: "Ultimately", type: "filler", score: 60 },
      { text: "It's important to note", type: "caveat", score: 70 },
      { text: "Please don't hesitate", type: "closer", score: 80 },
      { text: "To summarize", type: "filler", score: 60 },
      { text: "Feel free to reach out", type: "closer", score: 80 },
      { text: "I hope this proves helpful", type: "closer", score: 80 },
      { text: "I'm always here for you", type: "closer", score: 80 },
    ],
  },
];

export const ROASTS = [
  { minScore: 0,    maxScore: 250,    title: "ABSOLUTE BEGINNER",      emoji: "🥚",  text: "Did you even try? The AI is writing you a 47-paragraph apology and you didn't stop it." },
  { minScore: 251,  maxScore: 700,    title: "SLOP ROOKIE",             emoji: "🐣",  text: "You caught a few! But the AI whispered 'Certainly!' and you just let it happen." },
  { minScore: 701,  maxScore: 1400,   title: "SLOP SPOTTER",            emoji: "🔍",  text: "Getting warmer! You found the classics. The AI is moderately upset and says 'I hope this helps!'" },
  { minScore: 1401, maxScore: 2500,   title: "SLOP APPRENTICE",         emoji: "⚔️",  text: "Nice work! You've been stung by 'Furthermore' one too many times. The training is working." },
  { minScore: 2501, maxScore: 4000,   title: "SLOP HUNTER",             emoji: "🎯",  text: "Solid! You've suffered through enough AI responses to spot the patterns. Please touch grass." },
  { minScore: 4001, maxScore: 5800,   title: "SLOP DESTROYER",          emoji: "💥",  text: "Impressive! The AI is having an identity crisis. It sobbed 'As an AI, I feel... something.'" },
  { minScore: 5801, maxScore: 7500,   title: "SLOP SLAYER",             emoji: "🗡️",  text: "Elite performance! You carved through the boilerplate like a hot knife through holistic butter." },
  { minScore: 7501, maxScore: 9999,   title: "SLOP GRANDMASTER",        emoji: "🧙",  text: "Extraordinary! The Slop Monster tried to say 'Certainly!' but you silenced it before it could finish." },
  { minScore: 10000, maxScore: 999999, title: "SUPREME SLOP OVERLORD",  emoji: "👑",  text: "PERFECTION. You are the chosen one. The prophecy is fulfilled. The AI wept: 'Certainly, I accept my defeat. I hope this helps! Please don't hesitate to—' SILENCED." },
];

export const getRoast = (score) => {
  return ROASTS.find(r => score >= r.minScore && score <= r.maxScore) || ROASTS[0];
};

// Fisher-Yates shuffle (in-place) using provided rand function
function shuffle(arr, rand) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Pick 5 normal rounds + always append the boss round as round 6
export const selectRounds = (seed = null, lang = 'en') => {
  let rand;
  if (seed !== null) {
    let s = seed;
    rand = () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0x100000000; };
  } else {
    rand = Math.random;
  }

  const pool = ALL_ROUNDS.filter(r => r.lang === lang && !r.boss);
  const inversePool = shuffle(pool.filter(r => r.inverse), rand);
  const normalPool  = shuffle(pool.filter(r => !r.inverse), rand);

  // Need at least 1 inverse + 4 normal; fall back gracefully if not enough
  const hasInverse = inversePool.length > 0;
  const selected = hasInverse
    ? [inversePool[0], ...normalPool.slice(0, 4)]
    : normalPool.slice(0, 5);
  shuffle(selected, rand);

  // Boss round: randomly pick from the pool for current language, fall back to English
  const bossPool = ALL_ROUNDS.filter(r => r.boss && r.lang === lang);
  const fallbackBossPool = bossPool.length > 0 ? bossPool : ALL_ROUNDS.filter(r => r.boss && r.lang === 'en');
  const bossRound = fallbackBossPool.length > 0
    ? fallbackBossPool[Math.floor(rand() * fallbackBossPool.length)]
    : null;

  const result = bossRound ? [...selected, bossRound] : selected;
  return result.map((r, i) => ({ ...r, roundNumber: i + 1 }));
};

// Daily challenge: same 5 rounds for everyone on the same calendar day (always English)
export const getDailyRounds = () => {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  return selectRounds(seed, 'en');
};

// Keep backward compat
export const ROUNDS = ALL_ROUNDS.slice(0, 5);
