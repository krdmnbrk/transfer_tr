// Başlıktan olası oyuncu adlarını çıkaran sezgisel (best-effort) fonksiyon.
// UI'da her zaman "otomatik çıkarım" olarak etiketlenir — kesin bilgi değildir.

import type { Club } from "@/lib/domain/types";
import { trLower } from "@/lib/transfer/classify";

const MAX_NAMES = 3;

// Başlıklarda büyük harfle geçen ama oyuncu adı olmayan yaygın sözcükler.
const STOPWORDS = new Set(
  [
    "Son", "Dakika", "Transfer", "Transferi", "Transferde", "Haber", "Haberi",
    "Haberleri", "Süper", "Lig", "Ligi", "Trendyol", "Türkiye", "Avrupa",
    "Şampiyonlar", "UEFA", "FIFA", "TFF", "Milli", "Takım", "Takımı",
    "Teknik", "Direktör", "Direktörü", "Başkan", "Başkanı", "Hoca", "Hocası",
    "Kulüp", "Kulübü", "Sezon", "Sezonu", "Yaz", "Kış", "Dönem", "Dönemi",
    "Bonservis", "Bonservisi", "Golcü", "Stoper", "Kaleci", "Forvet",
    "Orta", "Saha", "Kanat", "Bek", "Yıldız", "Yıldızı", "Dev", "Sürpriz",
    "Flaş", "Resmi", "Resmî", "Açıklama", "İddia", "Gündem", "Derbi",
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz",
    "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
    "Premier", "Bundesliga", "Serie", "LaLiga", "Ligue",
  ].map((w) => trLower(w)),
);

// Bir token'ın kesme işaretli ekini at ("Osimhen'in" -> "Osimhen").
function stripSuffix(token: string): string {
  return token.replace(/['’ʼ].*$/u, "");
}

// Büyük harfle başlayan, devamı küçük harf/işaret olan sözcük (Unicode).
const CAP_TOKEN = /^\p{Lu}[\p{Ll}'’ʼ.-]+$/u;

export function extractPlayerNames(title: string, clubs: Club[]): string[] {
  // Kulüp adları, lakaplar ve şehirlerdeki her sözcük dışlama listesine girer;
  // "Galatasaraylı" gibi ekli biçimler için startsWith ile karşılaştırılır.
  const excluded: string[] = [];
  for (const club of clubs) {
    for (const phrase of [club.name, ...club.aliases, club.city]) {
      for (const w of phrase.split(/\s+/)) {
        const lw = trLower(w);
        if (lw.length >= 3) excluded.push(lw);
      }
    }
  }

  const isExcluded = (token: string): boolean => {
    const lw = trLower(stripSuffix(token));
    if (lw.length < 2) return true;
    if (STOPWORDS.has(lw)) return true;
    return excluded.some((ex) => lw.startsWith(ex));
  };

  const tokens = title.split(/[\s,:;!?"“”„()[\]|·—…]+/).filter(Boolean);

  const names: string[] = [];
  let run: string[] = [];
  const flush = () => {
    // En az iki sözcüklü diziler ad-soyad adayıdır ("Victor Osimhen").
    if (run.length >= 2) {
      const candidate = run.map(stripSuffix).join(" ");
      if (!names.includes(candidate)) names.push(candidate);
    }
    run = [];
  };

  for (const token of tokens) {
    if (CAP_TOKEN.test(token) && !isExcluded(token)) {
      run.push(token);
    } else {
      flush();
    }
  }
  flush();

  return names.slice(0, MAX_NAMES);
}
