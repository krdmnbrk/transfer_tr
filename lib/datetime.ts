// Türkiye saatiyle (Europe/Istanbul) deterministik tarih biçimlendirme.
// Statik dışa aktarımda "x dakika önce" gibi göreli metinler fosilleşeceği
// için her yerde mutlak zaman kullanılır.

const TZ = "Europe/Istanbul";

const dateTimeFmt = new Intl.DateTimeFormat("tr-TR", {
  timeZone: TZ,
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const shortFmt = new Intl.DateTimeFormat("tr-TR", {
  timeZone: TZ,
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

// "15 Temmuz 2026 14:30" — "Son güncelleme" damgası için.
export function formatDateTime(iso: string): string {
  return dateTimeFmt.format(new Date(iso));
}

// "15 Tem 14:30" — haber kartları için.
export function formatShort(iso: string): string {
  return shortFmt.format(new Date(iso));
}
