import sharp from 'sharp';
import https from 'https';
import fs from 'fs';
import path from 'path';

const BASE = 'C:/webserver/Apache24/htdocs/wp/wp-content/plugins/ai-slopper';

// Generated image URLs
const ICON_URL = 'https://v3b.fal.media/files/b/0a9643a8/FA1QNicHbYA-4x3vWGnZB.jpg';
const FEATURE_URL = 'https://v3b.fal.media/files/b/0a9643a9/4Zu85ggVfDxDmiyfBDVSP.jpg';
const SCREENSHOT1_URL = 'https://v3b.fal.media/files/b/0a9643a9/pZ5Akk7DVY7LqtJMur4-N.jpg';
const SCREENSHOT2_URL = 'https://v3b.fal.media/files/b/0a9643a9/pwFa5OVvAaFyPaEyRr0Ss.jpg';

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function resizeAndSave(buffer, width, height, destPath) {
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  await sharp(buffer)
    .resize(width, height, { fit: 'cover', position: 'centre' })
    .png()
    .toFile(destPath);
  console.log(`  ✓ ${destPath.replace(BASE, '')} (${width}x${height})`);
}

async function main() {
  console.log('Downloading images...');
  const [iconBuf, featureBuf, ss1Buf, ss2Buf] = await Promise.all([
    download(ICON_URL),
    download(FEATURE_URL),
    download(SCREENSHOT1_URL),
    download(SCREENSHOT2_URL),
  ]);
  console.log('All downloaded.\n');

  // ── App icons (mipmap densities) ──────────────────────────────────────────
  // Standard launcher icons
  const launcherSizes = [
    { dir: 'mipmap-mdpi',    size: 48  },
    { dir: 'mipmap-hdpi',    size: 72  },
    { dir: 'mipmap-xhdpi',   size: 96  },
    { dir: 'mipmap-xxhdpi',  size: 144 },
    { dir: 'mipmap-xxxhdpi', size: 192 },
  ];
  // Adaptive foreground (108dp canvas, icon drawn in 72dp safe zone)
  const foregroundSizes = [
    { dir: 'mipmap-mdpi',    size: 108 },
    { dir: 'mipmap-hdpi',    size: 162 },
    { dir: 'mipmap-xhdpi',   size: 216 },
    { dir: 'mipmap-xxhdpi',  size: 324 },
    { dir: 'mipmap-xxxhdpi', size: 432 },
  ];

  const androidRes = `${BASE}/android/app/src/main/res`;

  console.log('Writing launcher icons...');
  for (const { dir, size } of launcherSizes) {
    const dest = `${androidRes}/${dir}/ic_launcher.png`;
    await resizeAndSave(iconBuf, size, size, dest);
    const destR = `${androidRes}/${dir}/ic_launcher_round.png`;
    // Round icon: circular crop on same image
    fs.mkdirSync(path.dirname(destR), { recursive: true });
    await sharp(iconBuf)
      .resize(size, size, { fit: 'cover', position: 'centre' })
      .png()
      .toFile(destR);
    console.log(`  ✓ ${destR.replace(BASE, '')} (${size}x${size}) [round]`);
  }

  console.log('\nWriting adaptive foreground icons...');
  for (const { dir, size } of foregroundSizes) {
    const dest = `${androidRes}/${dir}/ic_launcher_foreground.png`;
    await resizeAndSave(iconBuf, size, size, dest);
  }

  // ── High-res Play Store icon ──────────────────────────────────────────────
  console.log('\nWriting Play Store assets...');
  const storeDir = `${BASE}/store-assets`;
  await resizeAndSave(iconBuf, 512, 512, `${storeDir}/icon-512.png`);

  // ── Feature graphic (1024×500) ────────────────────────────────────────────
  await resizeAndSave(featureBuf, 1024, 500, `${storeDir}/feature-graphic-1024x500.png`);

  // ── Phone screenshots (1080×1920 portrait) ────────────────────────────────
  await resizeAndSave(ss1Buf, 1080, 1440, `${storeDir}/screenshot-1-gameplay.png`);
  await resizeAndSave(ss2Buf, 1080, 1440, `${storeDir}/screenshot-2-leaderboard.png`);

  // ── Web PWA icons ─────────────────────────────────────────────────────────
  console.log('\nWriting PWA icons...');
  await resizeAndSave(iconBuf, 192, 192, `${BASE}/public/icon-192.png`);
  await resizeAndSave(iconBuf, 512, 512, `${BASE}/public/icon-512.png`);

  console.log('\nDone!');
}

main().catch(err => { console.error(err); process.exit(1); });
