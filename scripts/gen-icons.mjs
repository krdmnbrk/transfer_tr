// PWA ikonlarını üretir (geometrik SVG → PNG). Çalıştır: node scripts/gen-icons.mjs
// Not: sharp yalnızca üretim anında gerekir — `npm install --no-save sharp`.
import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";

const dir = path.join(process.cwd(), "public", "icons");

// Çift yönlü transfer oku: gelen (yeşil zeminde beyaz) + giden.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="#22c55e"/><stop offset="1" stop-color="#14532d"/></linearGradient></defs>
<rect width="512" height="512" rx="104" fill="url(#g)"/>
<g stroke="#ffffff" stroke-width="34" stroke-linecap="round" stroke-linejoin="round" fill="none">
<path d="M136 200 H352"/>
<path d="M300 148 L356 202 L300 256"/>
<path d="M376 312 H160"/>
<path d="M212 260 L156 314 L212 368"/>
</g></svg>`;

async function main() {
  await fs.mkdir(dir, { recursive: true });
  const buf = Buffer.from(svg);
  await sharp(buf).resize(512, 512).png().toFile(path.join(dir, "icon-512.png"));
  await sharp(buf).resize(192, 192).png().toFile(path.join(dir, "icon-192.png"));
  await sharp(buf)
    .resize(180, 180)
    .png()
    .toFile(path.join(dir, "apple-touch-icon.png"));
  console.log("İkonlar üretildi → public/icons/");
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
