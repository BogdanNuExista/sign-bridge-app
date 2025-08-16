#!/usr/bin/env node
// Simple asset generator to create placeholder icons if missing.
const fs = require('fs');
const path = require('path');
const sharpAvailable = (() => { try { require.resolve('sharp'); return true; } catch { return false; } })();

const assetsDir = path.join(__dirname, '..', 'assets');
if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir);

const files = [
  { name: 'icon.png', size: 1024 },
  { name: 'splash.png', size: 1242 },
  { name: 'adaptive-icon.png', size: 1024 },
  { name: 'favicon.png', size: 48 }
];

function pngPlaceholder(size, label) {
  // Very small inline 1x1 pixel if sharp not present.
  return Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAuMBg9EukrkAAAAASUVORK5CYII=',
    'base64'
  );
}

for (const f of files) {
  const target = path.join(assetsDir, f.name);
  if (fs.existsSync(target)) continue;
  try {
    if (sharpAvailable) {
      const sharp = require('sharp');
      // Create solid background with text overlay
      const svg = `<svg width="${f.size}" height="${f.size}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#6366F1"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="${Math.floor(
        f.size / 8
      )}" fill="#ffffff" font-family="Arial">${f.name.replace('.png','')}</text></svg>`;
      sharp(Buffer.from(svg)).png().toFile(target);
      console.log('Generated', f.name);
    } else {
      fs.writeFileSync(target, pngPlaceholder(f.size, f.name));
      console.log('Created tiny placeholder', f.name);
    }
  } catch (e) {
    console.warn('Failed to generate', f.name, e.message);
  }
}
