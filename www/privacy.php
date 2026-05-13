<?php
// AI Slop Royal — Privacy Policy
header('Content-Type: text/html; charset=utf-8');
$updated = '2026-05-12';
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#7c3aed" />
  <meta name="description" content="Privacy Policy for AI Slop Royal" />
  <title>AI SLOP ROYAL 🤖 — Privacy Policy</title>
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
    }
    body {
      background: radial-gradient(ellipse at top, #1a0a2e 0%, #0f0f1a 60%) fixed;
      padding: 24px 16px 64px;
    }
    .wrap {
      max-width: 720px;
      margin: 0 auto;
    }
    header.hero {
      text-align: center;
      padding: 32px 12px 24px;
    }
    .logo {
      font-family: 'Press Start 2P', monospace;
      font-size: 1.4rem;
      line-height: 1.4;
      background: linear-gradient(135deg, #a78bfa, #ec4899, #fbbf24);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      letter-spacing: 1px;
    }
    .sub {
      margin-top: 14px;
      font-family: 'Orbitron', sans-serif;
      font-weight: 700;
      font-size: 0.85rem;
      color: var(--purple-light);
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .card {
      background: rgba(26, 26, 46, 0.95);
      border: 1px solid rgba(124, 58, 237, 0.3);
      border-radius: 16px;
      box-shadow: 0 0 30px rgba(124, 58, 237, 0.15);
      padding: 24px 22px;
      margin-top: 20px;
    }
    h1 {
      font-family: 'Orbitron', sans-serif;
      font-weight: 900;
      font-size: 1.6rem;
      margin-bottom: 6px;
      background: linear-gradient(135deg, #a78bfa, #ec4899);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    h2 {
      font-family: 'Orbitron', sans-serif;
      font-weight: 700;
      font-size: 1.05rem;
      color: var(--purple-light);
      margin: 22px 0 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    p, li {
      font-size: 0.97rem;
      line-height: 1.65;
      color: var(--text);
    }
    p + p { margin-top: 10px; }
    ul {
      margin: 8px 0 4px 20px;
    }
    li { margin: 4px 0; }
    .muted {
      color: var(--text-muted);
      font-size: 0.85rem;
    }
    a {
      color: #fbbf24;
      text-decoration: none;
      border-bottom: 1px dashed rgba(251, 191, 36, 0.5);
    }
    a:hover { color: #fff; border-bottom-color: #fff; }
    .pill {
      display: inline-block;
      background: rgba(16, 185, 129, 0.18);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.4);
      border-radius: 999px;
      padding: 4px 12px;
      font-family: 'Orbitron', sans-serif;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-right: 6px;
    }
    footer {
      text-align: center;
      margin-top: 28px;
      color: var(--text-muted);
      font-size: 0.8rem;
    }
    code {
      background: rgba(124, 58, 237, 0.15);
      border: 1px solid rgba(124, 58, 237, 0.3);
      border-radius: 4px;
      padding: 1px 6px;
      font-size: 0.88em;
      color: #a78bfa;
    }
  </style>
</head>
<body>
  <div class="wrap">
    <header class="hero">
      <div class="logo">AI SLOP ROYAL 🤖</div>
      <div class="sub">Privacy Policy</div>
    </header>

    <main class="card">
      <h1>Privacy Policy</h1>
      <p class="muted">Last updated: <?= htmlspecialchars($updated) ?></p>

      <p style="margin-top:14px">
        <span class="pill">No PII</span>
        <span class="pill">No Ads</span>
        <span class="pill">No Tracking</span>
      </p>

      <h2>The Short Version</h2>
      <p>
        AI Slop Royal does not ask for your name, email, phone number, location, or any other personally identifiable information.
        We don&rsquo;t run ads. We don&rsquo;t sell data. We don&rsquo;t want it.
      </p>

      <h2>What We Don&rsquo;t Collect</h2>
      <ul>
        <li>Names, email addresses, phone numbers, or postal addresses</li>
        <li>Precise location data</li>
        <li>Contacts, photos, microphone, or camera access</li>
        <li>Advertising identifiers</li>
      </ul>

      <h2>What Gets Sent (and Why)</h2>
      <p>The game works almost entirely on your device. A few features touch the network:</p>

      <h2>In-App Purchases (RevenueCat)</h2>
      <p>
        Optional in-app purchases (cosmetics, power-ups, ad-free unlocks) are processed by the platform store
        (Google Play or the App Store) and managed through <strong>RevenueCat</strong>. To verify and restore your
        purchases, RevenueCat receives an anonymous app-user ID and the purchase token issued by the store. It
        does <em>not</em> receive your name, email, or payment details &mdash; those stay with Google/Apple.
        See <a href="https://www.revenuecat.com/privacy" target="_blank" rel="noopener">RevenueCat&rsquo;s privacy policy</a>.
      </p>

      <h2>Leaderboard &amp; Global Stats (Supabase)</h2>
      <p>
        If you submit a score to the leaderboard, the game sends a nickname you choose and your score to a
        <strong>Supabase</strong>-hosted database. The nickname is entirely your choice &mdash; pick whatever you want;
        it does not need to identify you. Aggregate gameplay counters (e.g. total rounds played across all players)
        may also be incremented anonymously. No account, login, or personal data is required.
        See <a href="https://supabase.com/privacy" target="_blank" rel="noopener">Supabase&rsquo;s privacy policy</a>.
      </p>

      <h2>Local Storage</h2>
      <p>
        Your high scores, settings, unlocked items, and tutorial progress are stored locally on your device.
        Uninstalling the app or clearing app data removes them.
      </p>

      <h2>Children</h2>
      <p>
        The game is suitable for general audiences. Because we don&rsquo;t collect personal information from
        anyone, we don&rsquo;t knowingly collect any from children either.
      </p>

      <h2>Your Rights</h2>
      <p>
        Since we don&rsquo;t store personal data tied to you, there is nothing personal to access, correct, or delete on our side.
        Leaderboard entries can be removed on request &mdash; just contact us with the nickname and approximate date.
      </p>

      <h2>Changes</h2>
      <p>
        If this policy changes meaningfully, we&rsquo;ll update the date at the top. Continued use of the app after
        an update means you accept the revised policy.
      </p>

      <h2>Contact</h2>
      <p>
        Questions, concerns, or removal requests:<br>
        <a href="mailto:admin@ai-slop-royal.com">admin@ai-slop-royal.com</a>
      </p>
    </main>

    <footer>
      &copy; <?= date('Y') ?> AI Slop Royal &mdash; Spot the ChatGPT cringe.
    </footer>
  </div>
</body>
</html>
