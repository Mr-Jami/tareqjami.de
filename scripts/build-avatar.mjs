// Builds the hero avatar variants in public/ from src/assets/profile.png.
// The hero is rendered from a string template shared by server and browser
// (src/lib/i18n.ts), so Astro's <Image> component cannot be used there; the
// optimized files are generated here and committed instead. Run `npm run
// avatar` after replacing the source image.
//
// The avatar is displayed at 220 CSS px, so 220 px (1x) and 400 px (the
// source size, used for 2x screens) are emitted as AVIF and WebP, plus a PNG
// fallback that also serves as the schema.org Person image.

import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = resolve(ROOT, 'src/assets/profile.png');
const OUT = resolve(ROOT, 'public');

const WIDTHS = [220, 400];

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

console.log(`avatar variants written to ${OUT}`);
