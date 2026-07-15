// Hafif RSS 2.0 ayrıştırıcı — yalnızca ihtiyaç duyulan alanlar, bağımlılıksız.
// Google News RSS'in bilinen biçimini hedefler; bozuk girdide boş liste döner.

export interface RssItem {
  title: string;
  link: string;
  pubDate?: string;
  guid?: string;
  // Google News'e özgü <source url="...">Kaynak Adı</source> etiketi.
  sourceName?: string;
}

// Sıra önemli: &amp; en son çözülmeli, yoksa "&amp;lt;" yanlışlıkla "<" olur.
export function decodeXmlEntities(s: string): string {
  return s
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex: string) =>
      safeFromCodePoint(parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, dec: string) =>
      safeFromCodePoint(parseInt(dec, 10)),
    )
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function safeFromCodePoint(code: number): string {
  try {
    return String.fromCodePoint(code);
  } catch {
    return "";
  }
}

// <tag ...>içerik</tag> içeriğini döndürür; CDATA'yı açar, entity'leri çözer.
function tagText(block: string, tag: string): string | undefined {
  const re = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, "i");
  const m = block.match(re);
  if (!m) return undefined;
  let text = m[1].trim();
  const cdata = text.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/);
  if (cdata) text = cdata[1].trim();
  const decoded = decodeXmlEntities(text).trim();
  return decoded.length > 0 ? decoded : undefined;
}

export function parseRss(xml: string): RssItem[] {
  const blocks = xml.match(/<item(?:\s[^>]*)?>[\s\S]*?<\/item>/gi) ?? [];
  const items: RssItem[] = [];
  for (const block of blocks) {
    const title = tagText(block, "title");
    const link = tagText(block, "link");
    if (!title || !link) continue; // başlıksız/bağlantısız öğe işe yaramaz
    items.push({
      title,
      link,
      pubDate: tagText(block, "pubDate"),
      guid: tagText(block, "guid"),
      sourceName: tagText(block, "source"),
    });
  }
  return items;
}
