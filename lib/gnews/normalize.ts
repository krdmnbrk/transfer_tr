// Google News RSS öğelerini alan modeline çeviren saf yardımcılar.

// Google News başlıkları " - Kaynak Adı" ile biter. <source> etiketi varsa
// önce onunla tam eşleşme denenir (başlık içi tireleri korur, ör. derbi
// başlıkları); yoksa sondaki kısa parça kaynak kabul edilir.
export function splitTitleSource(
  rawTitle: string,
  sourceName?: string,
): { title: string; source?: string } {
  const t = rawTitle.trim();
  if (sourceName) {
    const suffix = ` - ${sourceName}`;
    if (t.endsWith(suffix)) {
      return { title: t.slice(0, -suffix.length).trim(), source: sourceName };
    }
    return { title: t, source: sourceName };
  }
  const i = t.lastIndexOf(" - ");
  // Kaynak adları kısadır; uzun bir kuyruk büyük olasılıkla başlığın parçasıdır.
  if (i > 0 && t.length - (i + 3) <= 40) {
    return { title: t.slice(0, i).trim(), source: t.slice(i + 3).trim() };
  }
  return { title: t };
}

// Kararlı, kısa kimlik: iki farklı FNV-1a turunun birleşimi (64 bit hex).
export function toNewsId(seed: string): string {
  return fnv1a(seed, 0x811c9dc5) + fnv1a(seed, 0x01234567);
}

function fnv1a(s: string, basis: number): string {
  let h = basis >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}

// RFC-822 tarihini ISO'ya çevirir; geçersizse verilen geri dönüş değeri.
export function parsePubDate(
  pubDate: string | undefined,
  fallbackIso: string,
): string {
  if (pubDate) {
    const d = new Date(pubDate);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  }
  return fallbackIso;
}
