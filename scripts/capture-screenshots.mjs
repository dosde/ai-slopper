import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const BASE = 'C:/webserver/Apache24/htdocs/wp/wp-content/plugins/ai-slopper';
const OUT  = `${BASE}/store-assets`;
const URL  = 'http://localhost:5173';

fs.mkdirSync(OUT, { recursive: true });

// Helper: click a button by its visible text
async function clickText(page, text) {
  await page.evaluate((t) => {
    const btn = [...document.querySelectorAll('button')].find(b =>
      b.textContent.trim().includes(t)
    );
    if (btn) btn.click();
    else throw new Error(`Button "${t}" not found`);
  }, text);
}

// Helper: take a screenshot and save it
async function shot(page, name) {
  const file = path.join(OUT, name);
  await page.screenshot({ path: file, type: 'png' });
  console.log(`  ✓ ${name}`);
}

// Walk React fiber tree to find a hook with one of the given string values
async function findAndSetState(page, values, newValue) {
  return page.evaluate(({ values, newValue }) => {
    const root = document.getElementById('root');
    const fiberKey = Object.keys(root).find(k => k.startsWith('__reactContainer'));
    if (!fiberKey) return false;

    function walk(node, depth = 0) {
      if (!node || depth > 200) return false;
      if (node.memoizedState) {
        let hook = node.memoizedState;
        while (hook) {
          if (typeof hook.memoizedState === 'string' && values.includes(hook.memoizedState)) {
            hook.queue.dispatch(newValue);
            return true;
          }
          hook = hook.next;
        }
      }
      return walk(node.child, depth + 1) || walk(node.sibling, depth + 1);
    }
    return walk(root[fiberKey]);
  }, { values, newValue });
}

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 390, height: 844, deviceScaleFactor: 3 },
  });
  const page = await browser.newPage();
  // Suppress audio errors
  await page.on('pageerror', () => {});

  await page.goto(URL, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  console.log('Capturing screenshots...\n');

  // ── 1. Home / Play tab ────────────────────────────────────────────────────
  await shot(page, 'screenshot-1-home.png');

  // ── 2. Scores tab ─────────────────────────────────────────────────────────
  await clickText(page, 'SCORES');
  await new Promise(r => setTimeout(r, 500));
  await shot(page, 'screenshot-2-scores.png');

  // ── 3. Badges tab ─────────────────────────────────────────────────────────
  await clickText(page, 'BADGES');
  await new Promise(r => setTimeout(r, 500));
  await shot(page, 'screenshot-3-badges.png');

  // ── 4. DICT tab ───────────────────────────────────────────────────────────
  await clickText(page, 'DICT');
  await new Promise(r => setTimeout(r, 500));
  await shot(page, 'screenshot-4-dict.png');

  // ── 5. Back to Play, start game ───────────────────────────────────────────
  await clickText(page, 'PLAY');
  await new Promise(r => setTimeout(r, 400));
  // Click the main START DETECTING button
  await clickText(page, 'DETECTING');
  await new Promise(r => setTimeout(r, 600));

  // ── 6. Round intro countdown ──────────────────────────────────────────────
  await shot(page, 'screenshot-5-round-intro.png');

  // Wait for 5s countdown to finish → START button appears
  console.log('  Waiting for round countdown (5s)...');
  await new Promise(r => setTimeout(r, 5500));

  // ── 6b. Round intro at GO! state ─────────────────────────────────────────
  await shot(page, 'screenshot-5b-round-go.png');

  // Click START to enter gameplay
  await clickText(page, 'START');
  await new Promise(r => setTimeout(r, 800));

  // ── 7. Active gameplay ────────────────────────────────────────────────────
  await shot(page, 'screenshot-6-gameplay.png');
  await new Promise(r => setTimeout(r, 1500));
  await shot(page, 'screenshot-6b-gameplay-2.png');

  // ── 8. Force round to end: set timeLeft to 0 ─────────────────────────────
  // timeLeft is a number useState in GameScreen, starts at 45 (normal mode).
  // React 18 + Vite stores the root fiber under __reactContainer$xxx (not __reactFiber).
  const timerKilled = await page.evaluate(() => {
    const root = document.getElementById('root');
    // React 18 createRoot stores the FiberNode directly on __reactContainer$*
    const fiberKey = Object.keys(root).find(k => k.startsWith('__reactContainer'));
    if (!fiberKey) return 'no-key';
    const startNode = root[fiberKey]; // FiberNode (HostRoot or direct child)

    let found = 0;
    function walk(node, depth = 0) {
      if (!node || depth > 200) return;
      if (node.memoizedState) {
        let hook = node.memoizedState;
        while (hook) {
          if (typeof hook.memoizedState === 'number' &&
              hook.memoizedState >= 1 && hook.memoizedState <= 65 &&
              hook.queue?.dispatch) {
            hook.queue.dispatch(0);
            found++;
            // Only zero first match (the timer)
            return;
          }
          hook = hook.next;
        }
      }
      walk(node.child, depth + 1);
      if (!found) walk(node.sibling, depth + 1);
    }
    walk(startNode);
    return found;
  });
  console.log(`  Timer zeroed: ${timerKilled}`);
  await new Promise(r => setTimeout(r, 1200));

  // ── 9. Round Summary ──────────────────────────────────────────────────────
  await shot(page, 'screenshot-7-round-summary.png');

  // ── 10. Advance through all 6 rounds to reach the Result screen ──────────
  async function killTimer() {
    await page.evaluate(() => {
      const root = document.getElementById('root');
      const fiberKey = Object.keys(root).find(k => k.startsWith('__reactContainer'));
      if (!fiberKey) return;
      function walk(node, depth = 0) {
        if (!node || depth > 200) return;
        if (node.memoizedState) {
          let hook = node.memoizedState;
          while (hook) {
            if (typeof hook.memoizedState === 'number' &&
                hook.memoizedState >= 1 && hook.memoizedState <= 65 &&
                hook.queue?.dispatch) {
              hook.queue.dispatch(0);
              return;
            }
            hook = hook.next;
          }
        }
        walk(node.child, depth + 1);
      }
      walk(root[fiberKey]);
    });
  }

  // Force roastDone=true in RoundSummary so the Next button appears immediately.
  // Targets only the RoundSummary fiber node to avoid flipping unrelated booleans.
  async function skipRoastAnimation() {
    await page.evaluate(() => {
      const root = document.getElementById('root');
      const fiberKey = Object.keys(root).find(k => k.startsWith('__reactContainer'));
      if (!fiberKey) return;
      function walk(node, depth = 0) {
        if (!node || depth > 200) return;
        // Only touch hooks inside the RoundSummary component
        if (node.type?.name === 'RoundSummary' && node.memoizedState) {
          let hook = node.memoizedState;
          while (hook) {
            if (hook.memoizedState === false && hook.queue?.dispatch) {
              hook.queue.dispatch(true); // roastDone = true
              return; // only flip the first false boolean (roastDone)
            }
            hook = hook.next;
          }
          return;
        }
        walk(node.child, depth + 1);
        walk(node.sibling, depth + 1);
      }
      walk(root[fiberKey]);
    });
  }

  // Poll until a condition is true (max maxMs)
  async function waitFor(condFn, maxMs = 8000, intervalMs = 300) {
    const deadline = Date.now() + maxMs;
    while (Date.now() < deadline) {
      if (await condFn()) return true;
      await new Promise(r => setTimeout(r, intervalMs));
    }
    return false;
  }

  // Helper: run one full round (intro → play → summary) and return true when result screen reached
  async function runRound(roundNum) {
    // 1. Wait for countdown to reach GO! and START button to appear
    console.log(`  Round ${roundNum}: waiting for START button...`);
    await waitFor(() => page.evaluate(() =>
      [...document.querySelectorAll('button')].some(b => b.textContent.includes('START'))
    ), 8000);

    // 2. Click START
    const hasStart = await page.evaluate(() =>
      [...document.querySelectorAll('button')].some(b => b.textContent.includes('START'))
    );
    if (hasStart) {
      await clickText(page, 'START');
      console.log(`  Round ${roundNum}: clicked START`);
    }
    await new Promise(r => setTimeout(r, 800));

    // 3. Kill the timer → triggers round end
    await killTimer();

    // 4. Wait for RoundSummary to mount (polls for "ROUND COMPLETE" text)
    console.log(`  Round ${roundNum}: waiting for round summary...`);
    await waitFor(() => page.evaluate(() =>
      document.body.textContent.includes('ROUND COMPLETE')
    ), 5000);
    await new Promise(r => setTimeout(r, 500));

    // 5. Skip roast animation
    await skipRoastAnimation();

    // 6. Wait for NEXT ROUND button to appear
    await waitFor(() => page.evaluate(() =>
      [...document.querySelectorAll('button')].some(b =>
        b.textContent.includes('NEXT') || b.textContent.includes('RESULT')
      )
    ), 5000);

    // 7. Click it
    const btn = await page.evaluate(() => {
      const b = [...document.querySelectorAll('button')].find(b =>
        b.textContent.includes('NEXT') || b.textContent.includes('RESULT')
      );
      if (b) { b.click(); return b.textContent.trim().slice(0, 40); }
      return null;
    });
    console.log(`  Round ${roundNum}: clicked "${btn}"`);
    await new Promise(r => setTimeout(r, 600));

    // 8. Check if we've reached the result screen (no more round intro)
    return page.evaluate(() =>
      !document.body.textContent.includes('ROUND') ||
      document.body.textContent.includes('FINAL SCORE') ||
      [...document.querySelectorAll('button')].some(b =>
        b.textContent.includes('PLAY AGAIN') || b.textContent.includes('RESTART')
      )
    );
  }

  for (let r = 2; r <= 6; r++) {
    const done = await runRound(r);
    if (done) { console.log('  Result screen reached!'); break; }
  }

  // ── 11. Result screen ─────────────────────────────────────────────────────
  await shot(page, 'screenshot-8-results.png');

  await browser.close();

  // List what we captured
  console.log('\nFiles written:');
  fs.readdirSync(OUT)
    .filter(f => f.startsWith('screenshot-'))
    .sort()
    .forEach(f => {
      const size = fs.statSync(path.join(OUT, f)).size;
      console.log(`  ${f}  (${(size/1024).toFixed(0)} KB)`);
    });
}

main().catch(err => { console.error(err); process.exit(1); });
