// Başlıktan aşama sınıflandırma ve kulüp eşleştirme (saf, sezgisel).
// Türkçe ekleri yakalamak için tam kelime yerine KÖK araması yapılır.

import type { Club, TransferStage } from "@/lib/domain/types";

// Türkçe İ/ı dönüşümü için mutlaka tr-TR ile küçült (testle sabitlenir).
export const trLower = (s: string) => s.toLocaleLowerCase("tr-TR");

// Kesinlik sırası: birleşmelerde ve sınıflandırmada öncelik bu dizidedir.
export const STAGE_PRECEDENCE: TransferStage[] = [
  "imza",
  "kiralik",
  "ayrilik",
  "anlasma",
  "gorusme",
  "soylenti",
];

const STAGE_STEMS: ReadonlyArray<[TransferStage, string[]]> = [
  [
    "imza",
    [
      "imza",
      "resmen",
      "resmî",
      "resmi olarak",
      "kadrosuna katt",
      "transferini duyurdu",
      "transferi duyur",
      "transferi açıkla",
      "transferini açıkla",
      "transferi tamamland",
      "renklerine bağla",
    ],
  ],
  ["kiralik", ["kiralık", "kiraland", "kiralama", "satın alma opsiyonu"]],
  [
    "ayrilik",
    ["ayrıl", "veda", "fesih", "feshet", "feshed", "serbest kal", "satış listesi"],
  ],
  [
    "anlasma",
    ["anlaş", "el sıkış", "prensipte", "prensip anlaşma", "her konuda tamam", "bitirdi", "bitiriyor"],
  ],
  [
    "gorusme",
    [
      "görüş",
      "temas",
      "pazarlık",
      "teklif",
      "istiyor",
      "gündem",
      "listesinde",
      "takip ediyor",
      "takibinde",
      "radar",
      "ilgileniyor",
      "kancası",
      "peşinde",
    ],
  ],
];

export function classifyStage(title: string): TransferStage {
  const t = trLower(title);
  for (const [stage, stems] of STAGE_STEMS) {
    if (stems.some((stem) => t.includes(stem))) return stage;
  }
  return "soylenti";
}

// Başlıkta adı (veya lakabı) geçen kulüplerin id'leri.
// Türkçe ekler ("Fenerbahçe'nin") alt dize aramasıyla kendiliğinden yakalanır.
export function matchClubs(title: string, clubs: Club[]): string[] {
  const t = trLower(title);
  const ids: string[] = [];
  for (const club of clubs) {
    const names = [club.name, ...club.aliases];
    if (names.some((n) => t.includes(trLower(n)))) ids.push(club.id);
  }
  return ids;
}
