// CI teşhis aracı: her kulübün Google News RSS sorgusunun gerçekten veri
// döndürdüğünü loglar. Build'i BLOKLAMAZ — çıkış kodu her zaman 0.
// Kullanım: npm run check:feeds

const CLUB_QUERIES = [
  "Galatasaray", "Fenerbahçe", "Beşiktaş", "Trabzonspor", "Başakşehir",
  "Samsunspor", "Alanyaspor", "Eyüpspor", "Gaziantep FK", "Göztepe",
  "Kasımpaşa", "Kocaelispor", "Konyaspor", "Rizespor", "Gençlerbirliği",
  "Erzurumspor", "Amed Sportif", "Çorum FK",
];

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

function url(query) {
  const q = encodeURIComponent(`"${query}" transfer`);
  return `https://news.google.com/rss/search?q=${q}&hl=tr&gl=TR&ceid=TR:tr`;
}

let total = 0;
let failed = 0;

for (const query of CLUB_QUERIES) {
  try {
    const res = await fetch(url(query), {
      headers: { "User-Agent": UA, Accept: "application/rss+xml, */*" },
      signal: AbortSignal.timeout(12000),
    });
    const text = res.ok ? await res.text() : "";
    const count = (text.match(/<item[\s>]/g) ?? []).length;
    total += count;
    if (!res.ok || count === 0) failed++;
    console.log(
      `${res.ok ? "✓" : "✗"} ${query.padEnd(16)} HTTP ${res.status} — ${count} öğe`,
    );
  } catch (err) {
    failed++;
    console.log(`✗ ${query.padEnd(16)} HATA — ${err?.message ?? err}`);
  }
  await new Promise((r) => setTimeout(r, 250));
}

console.log(`\nToplam ${total} öğe; ${failed} sorun (${CLUB_QUERIES.length} sorgu).`);
if (failed === CLUB_QUERIES.length) {
  console.log(
    "UYARI: Hiçbir sorgu veri döndürmedi — build snapshot'a düşecek (stale).",
  );
}
process.exit(0);
