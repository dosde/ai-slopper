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

export const ALL_ROUNDS = [
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

  // ===== 5 EXTRA ROUNDS (selected randomly to keep replays fresh) =====

  {
    id: 6,
    title: "THE LINKEDIN LUNACY",
    emoji: "💼",
    context: "User asked: 'Write a LinkedIn post about being productive'",
    falPrompt: "a robot in a business suit drowning in LinkedIn buzzwords like 'synergy' and 'pivot', corporate cringe, absurdist cartoon, vibrant colors",
    text: `Certainly! I'd be absolutely thrilled to craft an engaging LinkedIn post for you! As an AI language model, I can certainly help you create content that will resonate with your professional network. It's important to note that LinkedIn posts perform best when they're authentic and value-driven. That being said, here's a post you might find useful:

🚀 Excited to share some thoughts on productivity and personal growth!

Furthermore, I've been reflecting on my journey and I want to be transparent about what truly drives results. Moreover, it's worth noting that success isn't just about working hard — it's about working smart. Additionally, leveraging the right mindset is absolutely crucial.

In conclusion, I hope this comprehensive post helps you connect with your audience! Let me know if you'd like me to explore a different angle. I'm always happy to help with your content strategy! Feel free to reach out! 🌟`,
    slopPhrases: [
      { text: "Certainly!", type: "opener", score: 100 },
      { text: "I'd be absolutely thrilled", type: "opener", score: 90 },
      { text: "As an AI language model", type: "disclaimer", score: 200 },
      { text: "I can certainly help", type: "opener", score: 70 },
      { text: "It's important to note that", type: "caveat", score: 80 },
      { text: "That being said", type: "filler", score: 60 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "I want to be transparent about", type: "caveat", score: 70 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "it's worth noting that", type: "caveat", score: 80 },
      { text: "Additionally", type: "filler", score: 50 },
      { text: "absolutely crucial", type: "comprehensive", score: 70 },
      { text: "In conclusion", type: "filler", score: 60 },
      { text: "comprehensive post", type: "comprehensive", score: 70 },
      { text: "Let me know if you'd like me to explore", type: "closer", score: 80 },
      { text: "I'm always happy to help", type: "closer", score: 90 },
      { text: "Feel free to reach out!", type: "closer", score: 80 },
    ],
  },
  {
    id: 7,
    title: "THE SAFETY SHERIFF",
    emoji: "🚨",
    context: "User asked: 'How do I chop an onion?'",
    falPrompt: "an AI robot dressed as a safety officer putting up warning signs around a single onion on a cutting board, absurd cartoon, bright colors, funny",
    text: `Of course! I'd be happy to help, though I must first emphasize that kitchen safety is absolutely paramount. As an AI assistant, I want to ensure your wellbeing above all else. It's crucial to note that improper knife handling can lead to injury, so please exercise extreme caution throughout this process.

That being said, it's worth noting that onions contain compounds that may cause eye irritation. Furthermore, I should mention that individual sensitivities may vary. Moreover, I strongly recommend consulting a professional chef if you have any concerns. Additionally, please ensure your workspace is properly sanitized.

With all of that in mind, here are some safety-first guidelines I hope will be helpful! Please don't hesitate to reach out if you need any further assistance. I sincerely hope this helps you navigate your culinary journey safely! Take care! 🧅`,
    slopPhrases: [
      { text: "Of course!", type: "opener", score: 100 },
      { text: "I'd be happy to help", type: "opener", score: 80 },
      { text: "I must first emphasize that", type: "caveat", score: 90 },
      { text: "absolutely paramount", type: "comprehensive", score: 80 },
      { text: "As an AI assistant", type: "disclaimer", score: 150 },
      { text: "It's crucial to note that", type: "caveat", score: 80 },
      { text: "please exercise extreme caution", type: "caveat", score: 70 },
      { text: "That being said", type: "filler", score: 60 },
      { text: "it's worth noting that", type: "caveat", score: 80 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "I should mention that", type: "caveat", score: 70 },
      { text: "individual sensitivities may vary", type: "caveat", score: 70 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "Additionally", type: "filler", score: 50 },
      { text: "With all of that in mind", type: "filler", score: 60 },
      { text: "Please don't hesitate to reach out", type: "closer", score: 90 },
      { text: "I sincerely hope this helps", type: "closer", score: 80 },
      { text: "culinary journey", type: "comprehensive", score: 70 },
    ],
  },
  {
    id: 8,
    title: "THE WELLNESS WARRIOR",
    emoji: "🧘",
    context: "User said: 'I'm a bit tired today'",
    falPrompt: "a robot life coach surrounded by crystals and wellness quotes, looking deeply concerned about a tired person, cartoon style, vibrant and absurd",
    text: `I'm so sorry to hear that you're feeling tired! That must be really difficult, and I want you to know that your feelings are completely valid. As an AI, I'm here to support you on your wellness journey in any way I can. It's important to note that fatigue can stem from many different sources.

That said, I'd like to suggest a comprehensive, holistic approach to your wellbeing. Furthermore, it's worth exploring whether you're prioritizing self-care. Moreover, mindfulness practices can be absolutely transformative. Additionally, I want to be transparent that I'm not a medical professional.

I hope this helps you begin your healing journey! Please don't hesitate to let me know if there's anything else I can do to support your overall wellness. I'm always here for you! Remember: you've got this! Take care of yourself! 💙`,
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
    ],
  },
  {
    id: 9,
    title: "THE BUZZWORD BONANZA",
    emoji: "📊",
    context: "User asked: 'Give me a startup idea'",
    falPrompt: "a robot entrepreneur presenting a whiteboard covered in buzzwords like 'disruptive', 'synergy', 'pivot', 'scalable', surrounded by confused investors, cartoon style",
    text: `Absolutely! I'd be happy to help you brainstorm a disruptive startup idea! As an AI language model, I can certainly provide comprehensive insights into the current entrepreneurial landscape. That being said, it's important to note that the most successful startups leverage emerging technologies to create scalable solutions.

Furthermore, consider a platform that harnesses the synergy between blockchain technology and artificial intelligence to create a holistic ecosystem for disrupting traditional paradigms. Moreover, this would involve leveraging data-driven insights to pivot toward untapped markets. Additionally, it's worth noting that building a robust, end-to-end solution is absolutely crucial for sustainable growth.

In conclusion, I hope this comprehensive overview helps you ideate your entrepreneurial journey! Please don't hesitate to reach out if you'd like to deep-dive into any of these concepts further. I'm here to help you unlock your full potential! 🚀`,
    slopPhrases: [
      { text: "Absolutely!", type: "opener", score: 100 },
      { text: "I'd be happy to help you brainstorm", type: "opener", score: 80 },
      { text: "As an AI language model", type: "disclaimer", score: 200 },
      { text: "I can certainly provide comprehensive insights", type: "comprehensive", score: 80 },
      { text: "That being said", type: "filler", score: 60 },
      { text: "it's important to note that", type: "caveat", score: 80 },
      { text: "leverage emerging technologies", type: "comprehensive", score: 70 },
      { text: "scalable solutions", type: "comprehensive", score: 70 },
      { text: "Furthermore", type: "filler", score: 50 },
      { text: "holistic ecosystem", type: "comprehensive", score: 80 },
      { text: "disrupting traditional paradigms", type: "comprehensive", score: 80 },
      { text: "Moreover", type: "filler", score: 50 },
      { text: "leveraging data-driven insights", type: "comprehensive", score: 80 },
      { text: "Additionally", type: "filler", score: 50 },
      { text: "it's worth noting that", type: "caveat", score: 80 },
      { text: "absolutely crucial", type: "comprehensive", score: 70 },
      { text: "sustainable growth", type: "comprehensive", score: 60 },
      { text: "In conclusion", type: "filler", score: 60 },
      { text: "comprehensive overview", type: "comprehensive", score: 70 },
      { text: "entrepreneurial journey", type: "comprehensive", score: 70 },
      { text: "Please don't hesitate to reach out", type: "closer", score: 90 },
      { text: "deep-dive", type: "comprehensive", score: 70 },
      { text: "unlock your full potential!", type: "closer", score: 80 },
    ],
  },
  {
    id: 10,
    title: "THE CODE CATASTROPHE",
    emoji: "💻",
    context: "User asked: 'Add a comment to this: x = x + 1'",
    falPrompt: "a robot writing a 50 page technical specification document for the number 1, surrounded by mountains of documentation, sweating, overwhelmed, cartoon style",
    text: `Of course! I'd be absolutely delighted to provide comprehensive documentation for this code snippet! As an AI assistant with extensive programming knowledge, I want to ensure this code is thoroughly documented. It's important to note that clear documentation is absolutely crucial for maintainable codebases.

That being said, here is the documentation I've prepared:

// This line of code performs an increment operation on the variable 'x'.
// It's worth noting that this fundamental arithmetic operation adds the integer
// value of 1 to the current value stored in the variable 'x'. Furthermore,
// this operation is essential for counting, iteration, and accumulation patterns.
// Moreover, it should be noted that the result is then reassigned back to 'x'.

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

// Pick 5 random rounds from the pool, always shuffled for replayability
export const selectRounds = (seed = null) => {
  const pool = [...ALL_ROUNDS];
  // Fisher-Yates shuffle with optional deterministic seed
  let rand;
  if (seed !== null) {
    let s = seed;
    rand = () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0x100000000; };
  } else {
    rand = Math.random;
  }
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, 5).map((r, i) => ({ ...r, roundNumber: i + 1 }));
};

// Daily challenge: same 5 rounds for everyone on the same calendar day
export const getDailyRounds = () => {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  return selectRounds(seed);
};

// Keep backward compat
export const ROUNDS = ALL_ROUNDS.slice(0, 5);
