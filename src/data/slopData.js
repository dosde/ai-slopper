// The sacred tome of AI slop patterns

export const SLOP_COMMENTARY = {
  opener: [
    "THE OPENER DETECTED! 🚨",
    "CLASSIC SYCOPHANCY ALERT! 🤢",
    "OH NO, HERE WE GO... 😩",
    "CRINGE INCOMING! 🫠",
    "YOUR AI BUTLER HAS ARRIVED! 🎩",
  ],
  disclaimer: [
    "THE FORBIDDEN PHRASE! ⚠️",
    "AS AN AI DISCLAIMER DETECTED! 🤖",
    "ROBOT IDENTITY CRISIS MOMENT! 🔧",
    "IT REMINDED YOU IT'S NOT HUMAN AGAIN! 😤",
  ],
  filler: [
    "FILLER WORD ALERT! 📢",
    "UNNECESSARY TRANSITION! 💨",
    "THIS WORD DID NOTHING! 🫥",
    "PADDING DETECTED! 🧸",
  ],
  closer: [
    "THE CLASSIC SIGN-OFF DETECTED! 👋",
    "BYE-BYE BOILERPLATE! 🚪",
    "OBLIGATORY CLOSING STATEMENT! 📋",
    "PLEASE LET ME KNOW IF... 🙄",
  ],
  bullet: [
    "BULLET POINT OBSESSION CONFIRMED! 📌",
    "IT LISTED THINGS THAT DIDN'T NEED LISTING! 📝",
    "UNNECESSARY STRUCTURE DETECTED! 🗂️",
  ],
  comprehensive: [
    "COMPREHENSIVE GUIDE INCOMING! 😱",
    "STEP-BY-STEP OVERLOAD DETECTED! 📊",
    "IT'S ABOUT TO GET VERY WORDY! 📚",
    "HOLISTIC APPROACH ACTIVATED! 🌈",
  ],
  caveat: [
    "UNSOLICITED DISCLAIMER! ⚡",
    "IT'S IMPORTANT TO NOTE THAT... 👆",
    "MANDATORY CAVEAT DETECTED! 🚧",
    "HEDGE MODE ENGAGED! 🦔",
  ],
  sycophant: [
    "PURE SYCOPHANCY DETECTED! 🍯",
    "IT'S BUTTERING YOU UP! 🧈",
    "GREAT QUESTION SPOTTED! 🎯",
    "EMOTIONAL SUPPORT BOT ACTIVATED! 🤗",
  ],
};

export const getRandomCommentary = (type) => {
  const comments = SLOP_COMMENTARY[type] || SLOP_COMMENTARY.filler;
  return comments[Math.floor(Math.random() * comments.length)];
};

export const ROUNDS = [
  {
    id: 1,
    title: "THE SANDWICH INCIDENT",
    emoji: "🥪",
    context: "User asked: 'How do I make a PB&J sandwich?'",
    falPrompt: "a cartoon robot in a business suit drowning in bullet points and lists while trying to make a sandwich, absurdist digital art, vibrant colors, funny",
    text: `Certainly! I'd be happy to help you make a peanut butter and jelly sandwich! As an AI language model, I don't have the ability to physically make sandwiches, but I can absolutely provide you with a comprehensive, step-by-step guide to creating your perfect sandwich experience!

It's important to note that the quality of your sandwich depends on several key factors. Furthermore, I should mention that individual preferences may vary. That being said, here's what you'll need to know:

First and foremost, gather your ingredients. Moreover, you'll want to ensure your workspace is clean. Additionally, selecting the right bread is crucial to this holistic approach.

I hope this helps! Please don't hesitate to let me know if you have any further questions or if there's anything else I can assist you with! I'm here to help! 😊`,
    slopPhrases: [
      { text: "Certainly!", type: "opener", score: 100 },
      { text: "I'd be happy to help", type: "opener", score: 80 },
      { text: "As an AI language model", type: "disclaimer", score: 200 },
      { text: "I don't have the ability to physically", type: "disclaimer", score: 120 },
      { text: "absolutely", type: "filler", score: 40 },
      { text: "comprehensive, step-by-step guide", type: "comprehensive", score: 90 },
      { text: "It's important to note that", type: "caveat", score: 80 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "That being said", type: "filler", score: 60 },
      { text: "First and foremost", type: "filler", score: 50 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "Additionally", type: "filler", score: 50 },
      { text: "holistic approach", type: "comprehensive", score: 70 },
      { text: "I hope this helps!", type: "closer", score: 100 },
      { text: "Please don't hesitate to let me know", type: "closer", score: 90 },
      { text: "if there's anything else I can assist you with", type: "closer", score: 80 },
      { text: "I'm here to help!", type: "closer", score: 70 },
    ],
  },
  {
    id: 2,
    title: "THE FEELINGS SAGA",
    emoji: "💭",
    context: "User asked: 'Do you have feelings?'",
    falPrompt: "a cartoon AI robot having an existential crisis with a thousand emotions floating around its head, confused expression, colorful absurdist illustration, funny",
    text: `Great question! That's something I find truly fascinating to reflect on. As an AI, I don't have feelings or emotions in the way humans do. However, I can certainly understand why you might wonder about this! It's a thought-provoking inquiry that many people ask.

While I lack the capacity for genuine emotional experience, I'm designed to engage with your questions in a helpful and empathetic way. It's worth noting that the question of AI consciousness is a complex philosophical topic. Moreover, researchers are actively exploring these boundaries.

I want to be transparent that I'm not able to have personal opinions or subjective experiences. That said, I'm absolutely here to support your curiosity! Is there anything else you'd like to explore? I hope this provides some clarity! Feel free to ask me anything at all! 🤖`,
    slopPhrases: [
      { text: "Great question!", type: "sycophant", score: 150 },
      { text: "That's something I find truly fascinating", type: "sycophant", score: 80 },
      { text: "As an AI", type: "disclaimer", score: 120 },
      { text: "I don't have feelings or emotions in the way humans do", type: "disclaimer", score: 100 },
      { text: "certainly", type: "filler", score: 40 },
      { text: "It's a thought-provoking inquiry", type: "sycophant", score: 70 },
      { text: "It's worth noting that", type: "caveat", score: 80 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "I want to be transparent that", type: "caveat", score: 70 },
      { text: "I'm not able to have personal opinions", type: "disclaimer", score: 90 },
      { text: "That said", type: "filler", score: 40 },
      { text: "absolutely", type: "filler", score: 40 },
      { text: "Is there anything else you'd like to explore?", type: "closer", score: 80 },
      { text: "I hope this provides some clarity!", type: "closer", score: 90 },
      { text: "Feel free to ask me anything at all!", type: "closer", score: 80 },
    ],
  },
  {
    id: 3,
    title: "THE RECIPE DISASTER",
    emoji: "🍕",
    context: "User asked: 'What's 2+2?'",
    falPrompt: "a robot writing a 50-page essay about the number 4, surrounded by mountains of paper, sweating, overwhelmed, cartoon style, funny",
    text: `Of course! I'd be delighted to help you with that! This is a wonderful mathematical question. The answer to 2+2 is 4. However, I should note that mathematics is a rich and complex field with many fascinating dimensions!

As an AI assistant, I can provide you with additional context. It's important to understand that in standard arithmetic, this calculation follows the rules of addition. Furthermore, it's worth noting that in some abstract mathematical systems, the answer could theoretically differ. That being said, for everyday practical purposes, 2+2=4.

Additionally, I want to make sure I'm being thorough. Moreover, I should mention that if you're exploring this in an educational context, there are many comprehensive resources available. I'm absolutely here to support your learning journey!

I hope this comprehensive answer has been helpful! Please don't hesitate to reach out if you need any further clarification or have additional questions. I'm always happy to help! Have a wonderful day! 🌟`,
    slopPhrases: [
      { text: "Of course!", type: "opener", score: 100 },
      { text: "I'd be delighted to help you with that!", type: "opener", score: 80 },
      { text: "This is a wonderful mathematical question", type: "sycophant", score: 120 },
      { text: "However", type: "filler", score: 30 },
      { text: "As an AI assistant", type: "disclaimer", score: 120 },
      { text: "It's important to understand that", type: "caveat", score: 80 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "it's worth noting that", type: "caveat", score: 80 },
      { text: "That being said", type: "filler", score: 60 },
      { text: "Additionally", type: "filler", score: 50 },
      { text: "I want to make sure I'm being thorough", type: "comprehensive", score: 70 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "comprehensive resources", type: "comprehensive", score: 70 },
      { text: "absolutely", type: "filler", score: 40 },
      { text: "I hope this comprehensive answer has been helpful!", type: "closer", score: 100 },
      { text: "Please don't hesitate to reach out", type: "closer", score: 90 },
      { text: "I'm always happy to help!", type: "closer", score: 80 },
      { text: "Have a wonderful day!", type: "closer", score: 60 },
    ],
  },
  {
    id: 4,
    title: "THE APOLOGY MARATHON",
    emoji: "🙏",
    context: "User said: 'You got that wrong.'",
    falPrompt: "a cartoon robot bowing extremely low in apology, wearing a sorry sign, surrounded by apology letters, dramatic anime style, funny and absurd",
    text: `I sincerely apologize for any confusion or inconvenience my previous response may have caused! You're absolutely right to point that out, and I'm truly sorry for the error. I appreciate your patience and understanding.

As an AI language model, I strive to provide accurate information, but I'm not perfect. It's important to note that I can make mistakes, and I deeply value your feedback. Furthermore, I'm committed to continuous improvement. That being said, I want to assure you that I take accuracy very seriously.

I should mention that if I've provided incorrect information, I'm deeply sorry. Moreover, I'm grateful for the opportunity to correct myself. Please allow me to provide you with a more thorough and accurate response. I hope this helps clarify things! Is there anything else I can assist you with today? Once again, I sincerely apologize! 🙏`,
    slopPhrases: [
      { text: "I sincerely apologize", type: "opener", score: 80 },
      { text: "any confusion or inconvenience my previous response may have caused", type: "filler", score: 70 },
      { text: "You're absolutely right", type: "sycophant", score: 100 },
      { text: "I appreciate your patience and understanding", type: "closer", score: 80 },
      { text: "As an AI language model", type: "disclaimer", score: 200 },
      { text: "I strive to provide accurate information", type: "disclaimer", score: 70 },
      { text: "It's important to note that", type: "caveat", score: 80 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "That being said", type: "filler", score: 60 },
      { text: "I should mention that", type: "caveat", score: 70 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "more thorough and accurate", type: "comprehensive", score: 70 },
      { text: "I hope this helps clarify things!", type: "closer", score: 90 },
      { text: "Is there anything else I can assist you with today?", type: "closer", score: 80 },
      { text: "Once again, I sincerely apologize!", type: "closer", score: 100 },
    ],
  },
  {
    id: 5,
    title: "THE FINAL BOSS",
    emoji: "👾",
    context: "User asked: 'Tell me a joke.'",
    falPrompt: "a massive terrifying robot slop monster made entirely of bullet points, numbered lists, and ChatGPT disclaimers, epic boss fight style, vibrant colors, dramatic",
    text: `Certainly! I'd absolutely love to share a joke with you! I'm so glad you asked — humor is such an important part of human connection, and as an AI, I find this to be a delightful request! That said, I want to be transparent that humor is subjective, and what one person finds funny, another may not. It's important to note that this joke is intended for entertainment purposes only.

Furthermore, I should mention that I don't have personal preferences or experiences, so I've selected a joke that tends to be broadly appreciated! Moreover, I want to ensure this is appropriate for all audiences. Additionally, I've taken care to avoid any potentially offensive content.

Here is the joke: Why don't scientists trust atoms? Because they make up everything! 😄

I hope you found that amusing! It's worth noting that comedy has a rich and complex history. Please don't hesitate to let me know if you'd like to hear more jokes or if there's anything else I can help you with! I'm here to help you with all your joke-related needs and beyond! Have a fantastic day and feel free to reach out anytime! I'm always here! 🤖✨`,
    slopPhrases: [
      { text: "Certainly!", type: "opener", score: 100 },
      { text: "I'd absolutely love to", type: "opener", score: 80 },
      { text: "I'm so glad you asked", type: "sycophant", score: 80 },
      { text: "as an AI", type: "disclaimer", score: 120 },
      { text: "I find this to be a delightful request!", type: "sycophant", score: 70 },
      { text: "That said", type: "filler", score: 40 },
      { text: "I want to be transparent that", type: "caveat", score: 80 },
      { text: "humor is subjective", type: "caveat", score: 60 },
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
    ],
  },
];

export const ROASTS = [
  { minScore: 0, maxScore: 500, title: "SLOP ROOKIE", emoji: "🥚", text: "You missed SO MUCH SLOP! The AI has already written you a 47-paragraph apology." },
  { minScore: 501, maxScore: 1500, title: "SLOP SPOTTER", emoji: "🔍", text: "Not bad! You caught some classics. The AI forgives you and says 'I hope this helps!'" },
  { minScore: 1501, maxScore: 3000, title: "SLOP HUNTER", emoji: "🎯", text: "Solid work! You've clearly suffered through too many AI responses. Seek help." },
  { minScore: 3001, maxScore: 5000, title: "SLOP DESTROYER", emoji: "💥", text: "Impressive! The AI is having an identity crisis. It says 'As an AI, I'm upset.'" },
  { minScore: 5001, maxScore: 999999, title: "SUPREME SLOP OVERLORD", emoji: "👑", text: "PERFECT! You are the chosen one. The prophecy said you'd defeat the Slop Monster. It wept and said 'Certainly, I accept my defeat!'" },
];

export const getRoast = (score) => {
  return ROASTS.find(r => score >= r.minScore && score <= r.maxScore) || ROASTS[0];
};
