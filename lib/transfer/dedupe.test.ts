import { describe, expect, it } from "vitest";
import type { NewsItem } from "@/lib/domain/types";
import { dedupeNews, normalizeTitleKey } from "@/lib/transfer/dedupe";

function item(overrides: Partial<NewsItem>): NewsItem {
  return {
    id: "x1",
    title: "Başlık",
    link: "https://example.com/1",
    publishedAt: "2026-07-15T10:00:00.000Z",
    clubIds: [],
    stage: "soylenti",
    players: [],
    ...overrides,
  };
}

describe("dedupeNews", () => {
  it("aynı id'li kopyaları kulüp birleşimiyle teke indirir", () => {
    const merged = dedupeNews([
      item({ id: "a", clubIds: ["galatasaray"], players: ["Victor Osimhen"] }),
      item({ id: "a", clubIds: ["fenerbahce"] }),
    ]);
    expect(merged).toHaveLength(1);
    expect(merged[0].clubIds.sort()).toEqual(["fenerbahce", "galatasaray"]);
    expect(merged[0].players).toEqual(["Victor Osimhen"]);
  });

  it("aynı başlıklı farklı kayıtları birleştirir, güçlü aşama kazanır", () => {
    const merged = dedupeNews([
      item({ id: "a", title: "Osimhen imzayı attı!", stage: "gorusme" }),
      item({ id: "b", title: "Osimhen imzayı attı", stage: "imza" }),
    ]);
    expect(merged).toHaveLength(1);
    expect(merged[0].stage).toBe("imza");
  });

  it("en erken yayın tarihi korunur", () => {
    const merged = dedupeNews([
      item({ id: "a", publishedAt: "2026-07-15T12:00:00.000Z" }),
      item({ id: "a", publishedAt: "2026-07-15T08:00:00.000Z" }),
    ]);
    expect(merged[0].publishedAt).toBe("2026-07-15T08:00:00.000Z");
  });

  it("farklı haberleri birleştirmez", () => {
    const merged = dedupeNews([
      item({ id: "a", title: "Galatasaray golcü istiyor" }),
      item({ id: "b", title: "Fenerbahçe stoper istiyor" }),
    ]);
    expect(merged).toHaveLength(2);
  });
});

describe("normalizeTitleKey", () => {
  it("noktalama ve büyük/küçük farkını yok sayar", () => {
    expect(normalizeTitleKey("Osimhen İmzayı Attı!")).toBe(
      normalizeTitleKey("osimhen imzayı attı"),
    );
  });
});
