<?php
// AI Slop Royal — Homepage
header('Content-Type: text/html; charset=utf-8');
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#7c3aed" />
  <meta name="description" content="AI Slop Royal — the ultimate AI slop detector game. Spot the ChatGPT cringe before time runs out." />
  <meta property="og:title" content="AI SLOP ROYAL 🤖" />
  <meta property="og:description" content="The ultimate AI slop detector game. Spot the ChatGPT cringe before time runs out." />
  <meta property="og:image" content="assets/icon-512.png" />
  <title>AI SLOP ROYAL 🤖 — Spot the ChatGPT Cringe</title>
  <link rel="icon" type="image/png" href="assets/icon-512.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Orbitron:wght@400;700;900&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --purple: #7c3aed;
      --purple-light: #a78bfa;
      --purple-dark: #4c1d95;
      --pink: #ec4899;
      --yellow: #fbbf24;
      --green: #10b981;
      --red: #ef4444;
      --bg: #0f0f1a;
      --bg-card: #1a1a2e;
      --text: #f8fafc;
      --text-muted: #94a3b8;
    }
    html, body {
      min-height: 100%;
      background: var(--bg);
      color: var(--text);
      font-family: 'Inter', sans-serif;
      -webkit-font-smoothing: antialiased;
      scroll-behavior: smooth;
    }
    body {
      background: radial-gradient(ellipse at top, #1a0a2e 0%, #0f0f1a 60%) fixed;
    }
    .wrap {
      max-width: 1080px;
      margin: 0 auto;
      padding: 0 20px;
    }

    /* ============ NAV ============ */
    nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 18px 0;
      border-bottom: 1px solid rgba(124, 58, 237, 0.18);
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      font-family: 'Press Start 2P', monospace;
      font-size: 0.85rem;
      background: linear-gradient(135deg, #a78bfa, #ec4899, #fbbf24);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      letter-spacing: 1px;
    }
    .brand img { width: 36px; height: 36px; border-radius: 8px; }
    .nav-links {
      display: flex;
      gap: 22px;
      align-items: center;
    }
    .nav-links a {
      font-family: 'Orbitron', sans-serif;
      font-weight: 700;
      font-size: 0.8rem;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: var(--purple-light);
      text-decoration: none;
    }
    .nav-links a:hover { color: var(--yellow); }

    /* ============ HERO ============ */
    .hero {
      display: grid;
      grid-template-columns: 1fr;
      gap: 32px;
      padding: 56px 0 40px;
      align-items: center;
    }
    @media (min-width: 820px) {
      .hero { grid-template-columns: 1.2fr 0.8fr; gap: 48px; padding: 72px 0 56px; }
    }
    .hero-title {
      font-family: 'Press Start 2P', monospace;
      font-size: clamp(1.6rem, 5vw, 2.8rem);
      line-height: 1.25;
      background: linear-gradient(135deg, #a78bfa, #ec4899, #fbbf24);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      letter-spacing: 1px;
    }
    .hero-tag {
      margin-top: 18px;
      font-family: 'Orbitron', sans-serif;
      font-weight: 700;
      font-size: 1.05rem;
      color: var(--purple-light);
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .hero-blurb {
      margin-top: 18px;
      font-size: 1.05rem;
      line-height: 1.65;
      color: var(--text);
      max-width: 56ch;
    }
    .cta-row {
      margin-top: 28px;
      display: flex;
      flex-wrap: wrap;
      gap: 14px;
    }
    .btn-primary, .btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-family: 'Orbitron', sans-serif;
      font-weight: 700;
      text-decoration: none;
      border-radius: 12px;
      padding: 14px 24px;
      font-size: 0.95rem;
      transition: transform 0.1s, box-shadow 0.2s, background 0.2s;
      cursor: pointer;
    }
    .btn-primary {
      background: linear-gradient(135deg, #7c3aed, #ec4899);
      color: white;
      box-shadow: 0 4px 20px rgba(124, 58, 237, 0.5);
      border: none;
    }
    .btn-primary:hover { transform: scale(1.04); box-shadow: 0 8px 30px rgba(124, 58, 237, 0.7); }
    .btn-secondary {
      color: var(--purple-light);
      border: 2px solid var(--purple);
      background: transparent;
    }
    .btn-secondary:hover { background: rgba(124, 58, 237, 0.18); color: white; }

    .hero-art {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .phone {
      position: relative;
      width: 100%;
      max-width: 280px;
      border-radius: 28px;
      overflow: hidden;
      border: 3px solid rgba(124, 58, 237, 0.5);
      box-shadow: 0 0 60px rgba(124, 58, 237, 0.35), 0 0 120px rgba(236, 72, 153, 0.2);
      animation: float 6s ease-in-out infinite;
    }
    .phone img { width: 100%; display: block; }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-12px); }
    }

    /* ============ SECTIONS ============ */
    section {
      padding: 56px 0;
    }
    .section-title {
      font-family: 'Orbitron', sans-serif;
      font-weight: 900;
      font-size: 1.7rem;
      text-align: center;
      margin-bottom: 8px;
      background: linear-gradient(135deg, #a78bfa, #ec4899);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .section-sub {
      text-align: center;
      color: var(--text-muted);
      margin-bottom: 36px;
      font-size: 1rem;
    }

    /* ============ FEATURE GRID ============ */
    .features {
      display: grid;
      grid-template-columns: 1fr;
      gap: 18px;
    }
    @media (min-width: 640px) { .features { grid-template-columns: repeat(2, 1fr); } }
    @media (min-width: 980px) { .features { grid-template-columns: repeat(3, 1fr); } }

    .card {
      background: rgba(26, 26, 46, 0.95);
      border: 1px solid rgba(124, 58, 237, 0.3);
      border-radius: 16px;
      box-shadow: 0 0 30px rgba(124, 58, 237, 0.12);
      padding: 24px 22px;
      transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
    }
    .card:hover {
      transform: translateY(-4px);
      border-color: rgba(236, 72, 153, 0.5);
      box-shadow: 0 0 40px rgba(236, 72, 153, 0.2);
    }
    .card .emoji {
      font-size: 2rem;
      display: block;
      margin-bottom: 10px;
    }
    .card h3 {
      font-family: 'Orbitron', sans-serif;
      font-size: 1rem;
      color: var(--yellow);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }
    .card p {
      font-size: 0.95rem;
      line-height: 1.55;
      color: var(--text);
    }

    /* ============ HOW IT WORKS ============ */
    .steps {
      display: grid;
      grid-template-columns: 1fr;
      gap: 18px;
      counter-reset: step;
    }
    @media (min-width: 720px) { .steps { grid-template-columns: repeat(3, 1fr); } }
    .step {
      background: rgba(26, 26, 46, 0.7);
      border: 1px solid rgba(124, 58, 237, 0.25);
      border-radius: 16px;
      padding: 24px 22px;
      position: relative;
    }
    .step::before {
      counter-increment: step;
      content: counter(step);
      position: absolute;
      top: -18px;
      left: 18px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, #7c3aed, #ec4899);
      color: white;
      font-family: 'Orbitron', sans-serif;
      font-weight: 900;
      font-size: 1.05rem;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 14px rgba(124, 58, 237, 0.5);
    }
    .step h3 {
      font-family: 'Orbitron', sans-serif;
      color: var(--purple-light);
      font-size: 1rem;
      margin: 8px 0 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .step p { font-size: 0.95rem; line-height: 1.55; }

    /* ============ SCREENSHOTS ============ */
    .shots {
      display: grid;
      grid-template-columns: 1fr;
      gap: 18px;
    }
    @media (min-width: 640px) { .shots { grid-template-columns: repeat(2, 1fr); } }
    .shot {
      border-radius: 16px;
      overflow: hidden;
      border: 2px solid rgba(124, 58, 237, 0.4);
      box-shadow: 0 0 25px rgba(124, 58, 237, 0.2);
      background: #000;
    }
    .shot img { width: 100%; display: block; }

    /* ============ FOOTER ============ */
    footer {
      border-top: 1px solid rgba(124, 58, 237, 0.18);
      padding: 32px 0 40px;
      margin-top: 40px;
      text-align: center;
      color: var(--text-muted);
      font-size: 0.88rem;
    }
    footer a {
      color: var(--yellow);
      text-decoration: none;
      border-bottom: 1px dashed rgba(251, 191, 36, 0.5);
    }
    footer a:hover { color: white; border-bottom-color: white; }
    .footer-links {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 18px;
      margin-bottom: 14px;
      font-family: 'Orbitron', sans-serif;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }
  </style>
</head>
<body>
  <div class="wrap">
    <nav>
      <a href="#" class="brand">
        <img src="assets/icon-512.png" alt="AI Slop Royal icon">
        <span>AI SLOP ROYAL</span>
      </a>
      <div class="nav-links">
        <a href="#features">Features</a>
        <a href="#how">How It Works</a>
        <a href="privacy.php">Privacy</a>
      </div>
    </nav>

    <header class="hero">
      <div>
        <h1 class="hero-title">SPOT THE<br>CHATGPT<br>CRINGE 🤖</h1>
        <div class="hero-tag">The Ultimate AI Slop Detector</div>
        <p class="hero-blurb">
          Tap the AI-generated nonsense before the timer runs out. Em dashes, &ldquo;in today&rsquo;s fast-paced world,&rdquo;
          tortured metaphors, that one phrase ChatGPT says <em>every single time</em> &mdash; if it reeks of slop, hit it.
          Stack combos, climb the leaderboard, and laugh at how predictable the machines are.
        </p>
        <div class="cta-row">
          <a class="btn-primary" href="#how">Play the Game ▶</a>
          <a class="btn-secondary" href="#features">See Features</a>
        </div>
      </div>
      <div class="hero-art">
        <div class="phone">
          <img src="assets/screenshot-1-home.png" alt="AI Slop Royal home screen">
        </div>
      </div>
    </header>

    <section id="features">
      <h2 class="section-title">Why You&rsquo;ll Get Hooked</h2>
      <p class="section-sub">Fast rounds. Sharp jokes. Zero patience for slop.</p>
      <div class="features">
        <div class="card">
          <span class="emoji">⚡</span>
          <h3>60-Second Rounds</h3>
          <p>Quick bursts of slop-hunting. Easy to pick up between meetings, impossible to put down at 1am.</p>
        </div>
        <div class="card">
          <span class="emoji">🎯</span>
          <h3>Combos &amp; Multipliers</h3>
          <p>Chain correct taps to rack up score multipliers. Miss a beat and your combo resets &mdash; precision pays.</p>
        </div>
        <div class="card">
          <span class="emoji">🏆</span>
          <h3>Global Leaderboard</h3>
          <p>Climb a worldwide ranking with nothing but a nickname. No account, no email, no spam.</p>
        </div>
        <div class="card">
          <span class="emoji">🎖️</span>
          <h3>Badges to Unlock</h3>
          <p>Earn badges for streaks, perfect rounds, and absurd feats of slop-spotting prowess.</p>
        </div>
        <div class="card">
          <span class="emoji">🧠</span>
          <h3>Slop Dictionary</h3>
          <p>An ever-growing catalogue of AI tells &mdash; from clich&eacute;d openers to that one em dash everyone notices.</p>
        </div>
        <div class="card">
          <span class="emoji">🔒</span>
          <h3>Privacy First</h3>
          <p>No PII collected. No ads. No tracking SDKs. Just you, the slop, and a satisfying tap.</p>
        </div>
      </div>
    </section>

    <section id="how">
      <h2 class="section-title">How It Works</h2>
      <p class="section-sub">Three steps. No tutorial wall.</p>
      <div class="steps">
        <div class="step">
          <h3>Read the Passage</h3>
          <p>Each round drops a chunk of text. Some of it is human; some of it is AI doing its hardest to sound smart.</p>
        </div>
        <div class="step">
          <h3>Tap the Slop</h3>
          <p>Spot the AI-isms &mdash; clich&eacute;s, em dashes, tortured phrasing &mdash; and tap them before the timer dies.</p>
        </div>
        <div class="step">
          <h3>Beat Your Score</h3>
          <p>Stack combos, earn badges, and post your run to the global leaderboard with a nickname of your choice.</p>
        </div>
      </div>
    </section>

    <section>
      <h2 class="section-title">Screenshots</h2>
      <p class="section-sub">A few moments from the slop trenches.</p>
      <div class="shots">
        <div class="shot"><img src="assets/screenshot-6b-gameplay-2.png" alt="Gameplay screenshot"></div>
        <div class="shot"><img src="assets/screenshot-8-results.png" alt="Results screen screenshot"></div>
      </div>
    </section>

    <footer>
      <div class="footer-links">
        <a href="privacy.php">Privacy Policy</a>
        <a href="mailto:patrick.kunath@gmail.com">Contact</a>
      </div>
      <div>&copy; <?= date('Y') ?> AI Slop Royal &mdash; Built by humans, for spotting machines.</div>
    </footer>
  </div>
</body>
</html>
