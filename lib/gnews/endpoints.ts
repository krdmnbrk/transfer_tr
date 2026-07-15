// Google News RSS arama uçları (anahtarsız, Türkçe sürüm).

export function clubSearchUrl(query: string): string {
  const q = encodeURIComponent(`"${query}" transfer`);
  return `https://news.google.com/rss/search?q=${q}&hl=tr&gl=TR&ceid=TR:tr`;
}
