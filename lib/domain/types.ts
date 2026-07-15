// Alan modeli: transfer haber akışının tip sözleşmeleri.

// Aşamalar kesinlik sırasına göre: imza en kesin, söylenti en belirsiz.
export type TransferStage =
  | "imza" // resmi imza / açıklanan transfer
  | "kiralik" // kiralık transfer
  | "ayrilik" // ayrılık / fesih / veda
  | "anlasma" // anlaşmaya varıldı / el sıkışıldı
  | "gorusme" // görüşme / temas / teklif
  | "soylenti"; // sınıflandırılamayan varsayılan

export interface Club {
  // URL kimliği (ör. "galatasaray") — route slug olarak kullanılır.
  id: string;
  name: string;
  // Google News aramasında kullanılan ad (tırnak içine alınır).
  query: string;
  // Başlık eşleştirmede ek adlar/lakaplar (tr-TR küçük harf duyarsız aranır).
  aliases: string[];
  colors: { primary: string; secondary: string };
  city: string;
}

export interface NewsItem {
  // guid ?? link üzerinden üretilen kararlı hash.
  id: string;
  // Kaynak eki (" - Fanatik") temizlenmiş başlık.
  title: string;
  // Google News yönlendirme URL'si — çözümlemeden olduğu gibi kullanılır.
  link: string;
  source?: string;
  // ISO 8601 (UTC).
  publishedAt: string;
  // Eşleşen kulüpler: sorgunun kulübü + başlıkta adı geçenler.
  clubIds: string[];
  stage: TransferStage;
  // Başlıktan otomatik çıkarılan oyuncu adları (en fazla 3, sezgisel).
  players: string[];
}

export interface TransferFeed {
  // publishedAt'e göre yeniden eskiye sıralı.
  items: NewsItem[];
  // Derleme anı — "Son güncelleme" damgası.
  fetchedAt: string;
  // Kulüp başına haber sayısı (dedupe sonrası).
  clubCounts: Record<string, number>;
  // Sorgusu başarısız olan kulüpler (kısmi kesinti göstergesi).
  failedClubIds: string[];
}

// Snapshot katmanının döndürdüğü zarf: stale=true → son bilinen veri.
export interface DataResult<T> {
  data: T;
  stale: boolean;
}
