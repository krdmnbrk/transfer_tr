// Sosyal paylaşım görseli (Open Graph, 1200×630) üretir. Çalıştır: npm run gen:og
// Not: sharp yalnızca üretim anında gerekir — `npm install --no-save sharp`.
import sharp from "sharp";
import path from "path";

const out = path.join(process.cwd(), "public", "og.png");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b2a1c"/><stop offset="1" stop-color="#070d0b"/>
    </linearGradient>
    <linearGradient id="badge" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#22c55e"/><stop offset="1" stop-color="#14532d"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <g transform="translate(920,140)">
    <rect x="0" y="0" width="220" height="220" rx="48" fill="url(#badge)"/>
    <g stroke="#ffffff" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" fill="none">
      <path d="M58 86 H152"/>
      <path d="M130 64 L154 87 L130 110"/>
      <path d="M162 134 H68"/>
      <path d="M90 112 L66 135 L90 158"/>
    </g>
  </g>
  <text x="80" y="240" font-family="Segoe UI, Arial, sans-serif" font-size="40" font-weight="700" fill="#4ade80" letter-spacing="2">SÜPER LİG · 2026-27</text>
  <text x="80" y="345" font-family="Segoe UI, Arial, sans-serif" font-size="104" font-weight="800" fill="#ffffff">Transfer TR</text>
  <text x="80" y="420" font-family="Segoe UI, Arial, sans-serif" font-size="34" font-weight="500" fill="#cbd5e1">Hangi kulüp kimi istiyor? İmza, anlaşma, görüşme…</text>
  <text x="80" y="470" font-family="Segoe UI, Arial, sans-serif" font-size="26" font-weight="400" fill="#64748b">Kulüp kulüp transfer gündemi · 30 dakikada bir güncellenir</text>
</svg>`;

async function main() {
  await sharp(Buffer.from(svg)).png().toFile(out);
  console.log("OG görseli üretildi → public/og.png");
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
