import { describe, expect, it } from "vitest";
import { decodeXmlEntities, parseRss } from "@/lib/gnews/rss";

// Google News RSS'in gerçek biçimini taklit eden fixture.
const FEED = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:media="http://search.yahoo.com/mrss/" version="2.0">
<channel>
<title>"Galatasaray" transfer - Google News</title>
<link>https://news.google.com/search?q=%22Galatasaray%22+transfer</link>
<item>
<title>Galatasaray, Victor Osimhen ile anla&#351;maya vard&#305; - Fanatik</title>
<link>https://news.google.com/rss/articles/CBMiT2h0dHBzOi8vd3d3?oc=5</link>
<guid isPermaLink="false">CBMiT2h0dHBzOi8vd3d3</guid>
<pubDate>Tue, 14 Jul 2026 18:45:00 GMT</pubDate>
<description>&lt;a href="..."&gt;Galatasaray...&lt;/a&gt;</description>
<source url="https://www.fanatik.com.tr">Fanatik</source>
</item>
<item>
<title><![CDATA[Fenerbahçe'de imza şov & yeni golcü - Sabah]]></title>
<link>https://news.google.com/rss/articles/XYZ?oc=5</link>
<guid isPermaLink="false">XYZ</guid>
<pubDate>Wed, 15 Jul 2026 07:12:00 GMT</pubDate>
<source url="https://www.sabah.com.tr">Sabah</source>
</item>
<item>
<title>Ba&#x11F;lant&#x131;s&#x131;z haber</title>
</item>
</channel>
</rss>`;

describe("parseRss", () => {
  it("öğeleri alanlarıyla ayrıştırır", () => {
    const items = parseRss(FEED);
    expect(items).toHaveLength(2); // linksiz üçüncü öğe atlanır
    expect(items[0]).toEqual({
      title: "Galatasaray, Victor Osimhen ile anlaşmaya vardı - Fanatik",
      link: "https://news.google.com/rss/articles/CBMiT2h0dHBzOi8vd3d3?oc=5",
      guid: "CBMiT2h0dHBzOi8vd3d3",
      pubDate: "Tue, 14 Jul 2026 18:45:00 GMT",
      sourceName: "Fanatik",
    });
  });

  it("CDATA başlıkları açar", () => {
    const items = parseRss(FEED);
    expect(items[1].title).toBe("Fenerbahçe'de imza şov & yeni golcü - Sabah");
    expect(items[1].sourceName).toBe("Sabah");
  });

  it("boş/bozuk girdide boş liste döner", () => {
    expect(parseRss("")).toEqual([]);
    expect(parseRss("<html>bir consent sayfası</html>")).toEqual([]);
    expect(parseRss("<rss><channel></channel></rss>")).toEqual([]);
  });
});

describe("decodeXmlEntities", () => {
  it("adlandırılmış ve sayısal entity'leri çözer", () => {
    expect(decodeXmlEntities("A &amp; B &lt;c&gt; &quot;d&quot; &#39;e&#39;")).toBe(
      "A & B <c> \"d\" 'e'",
    );
    expect(decodeXmlEntities("anla&#351;ma &#x11F;ol")).toBe("anlaşma ğol");
  });

  it("&amp; en son çözülür (çifte çözme yok)", () => {
    expect(decodeXmlEntities("&amp;lt;")).toBe("&lt;");
  });
});
