'use strict';
// Renders src/renderer/assets/logo.svg into build/icon.png, build/icon.ico and src/assets/icon.png.
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.join(__dirname, '..');
const svg = fs.readFileSync(path.join(root, 'src', 'renderer', 'assets', 'logo.svg'));
const ICO_SIZES = [16, 24, 32, 48, 64, 128, 256];

const render = (size) =>
  sharp(svg, { density: Math.ceil((72 * size) / 128) * 2 })
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

async function main() {
  const pngToIco = await import('png-to-ico').then((m) => m.default || m);
  fs.mkdirSync(path.join(root, 'build'), { recursive: true });
  fs.mkdirSync(path.join(root, 'src', 'assets'), { recursive: true });

  fs.writeFileSync(path.join(root, 'build', 'icon.png'), await render(512));
  fs.writeFileSync(path.join(root, 'src', 'assets', 'icon.png'), await render(256));
  const frames = await Promise.all(ICO_SIZES.map(render));
  fs.writeFileSync(path.join(root, 'build', 'icon.ico'), await pngToIco(frames));
  console.log('Icons written to build/ and src/assets/');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
