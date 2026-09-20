// Builds the derived images in public/ from src/assets/profile.png and
// commits them, so the Netlify build needs no image tooling. Run `npm run
// images` after replacing the source image.
//
// 1. Hero avatar: displayed at 220 CSS px, so 220 px (1x) and 400 px (the
//    source size, used for 2x screens) are emitted as AVIF and WebP, plus a
//    PNG fallback that also serves as the schema.org Person image. (The hero
//    is a string template, so Astro's <Image> component is not an option.)
// 2. Open Graph image (1200×630) for link previews on LinkedIn, Slack etc.:
//    the avatar on the site's dark theme with name, role and domain. Text is
//    rendered from an SVG, so it uses the fonts installed on this machine.
// 3. Simple Shot Timer screenshots (src/assets/simpleshottimer/*.png, the
//    1800×3000 Play Store listing images) at 520/1040 px as AVIF and WebP.

import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = resolve(ROOT, 'src/assets/profile.png');
const OUT = resolve(ROOT, 'public');

const WIDTHS = [220, 400];

// Language-neutral copy for the preview card.
const OG = {
  name: 'Tareq Jami',
  role: 'Angular & .NET Engineer',
  place: 'Hamburg, Germany',
  site: 'tareqjami.de',
};

mkdirSync(OUT, { recursive: true });

for (const width of WIDTHS) {
  const base = sharp(SRC).resize(width, width, { fit: 'cover' });
  await base.clone().avif({ quality: 60 }).toFile(resolve(OUT, `profile-${width}.avif`));
  await base.clone().webp({ quality: 80 }).toFile(resolve(OUT, `profile-${width}.webp`));
}
await sharp(SRC)
  .resize(400, 400, { fit: 'cover' })
  .png({ compressionLevel: 9, palette: true })
  .toFile(resolve(OUT, 'profile-400.png'));


// --- Open Graph image ------------------------------------------------------
const W = 1200;
const H = 630;
const AVATAR = 300;
const avatarPng = await sharp(SRC).resize(AVATAR, AVATAR).png().toBuffer();
const avatarB64 = avatarPng.toString('base64');
const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <clipPath id="circle"><circle cx="${AVATAR / 2}" cy="${AVATAR / 2}" r="${AVATAR / 2}"/></clipPath>
    <pattern id="grid" width="56" height="56" patternUnits="userSpaceOnUse">
      <path d="M56 0H0V56" fill="none" stroke="rgba(63,216,255,0.08)" stroke-width="1"/>
    </pattern>
    <radialGradient id="glow" cx="85%" cy="15%" r="55%">
      <stop offset="0" stop-color="#3fd8ff" stop-opacity="0.32"/>
      <stop offset="1" stop-color="#3fd8ff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#060911"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <g transform="translate(90 165)">
    <circle cx="${AVATAR / 2}" cy="${AVATAR / 2}" r="${AVATAR / 2 + 10}" fill="none" stroke="#3fd8ff" stroke-width="3" stroke-dasharray="14 10" opacity="0.8"/>
    <image href="data:image/png;base64,${avatarB64}" width="${AVATAR}" height="${AVATAR}" clip-path="url(#circle)"/>
  </g>
  <g font-family="'Segoe UI', 'Helvetica Neue', Arial, sans-serif" fill="#e8eefb">
    <text x="470" y="250" font-size="22" font-weight="600" letter-spacing="4" fill="#3fd8ff">${esc(OG.role.toUpperCase())}</text>
    <text x="466" y="345" font-size="92" font-weight="700" letter-spacing="-2">${esc(OG.name)}</text>
    <text x="470" y="410" font-size="30" fill="#93a1ba">${esc(OG.place)}</text>
    <text x="470" y="480" font-size="26" font-weight="600" fill="#3fd8ff">${esc(OG.site)}</text>
  </g>
</svg>`;
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(resolve(OUT, 'og-image.png'));

// --- App screenshots -------------------------------------------------------
const SHOTS_SRC = resolve(ROOT, 'src/assets/simpleshottimer');
const SHOTS_OUT = resolve(OUT, 'apps/simpleshottimer');
mkdirSync(SHOTS_OUT, { recursive: true });
for (const name of ['detect', 'settings', 'review']) {
  for (const width of [520, 1040]) {
    const base = sharp(resolve(SHOTS_SRC, `${name}.png`)).resize(width);
    await base.clone().avif({ quality: 55 }).toFile(resolve(SHOTS_OUT, `${name}-${width}.avif`));
    await base.clone().webp({ quality: 78 }).toFile(resolve(SHOTS_OUT, `${name}-${width}.webp`));
  }
}

console.log(`images written to ${OUT}`);
