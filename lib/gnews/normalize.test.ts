import { describe, expect, it } from "vitest";
import {
  parsePubDate,
  splitTitleSource,
  toNewsId,
} from "@/lib/gnews/normalize";

describe("splitTitleSource", () => {
  it("<source> adı başlık sonuyla eşleşince keser", () => {
    expect(splitTitleSource("Osimhen için flaş gelişme - Fanatik", "Fanatik")).toEqual(
      { title: "Osimhen için flaş gelişme", source: "Fanatik" },
    );
  });

  it("başlık içi tireleri korur, yalnızca son ek kesilir", () => {
    const r = splitTitleSource(
      "Galatasaray - Fenerbahçe derbisi öncesi transfer sürprizi - Sabah",
      "Sabah",
    );
    expect(r.title).toBe("Galatasaray - Fenerbahçe derbisi öncesi transfer sürprizi");
    expect(r.source).toBe("Sabah");
  });

  it("<source> eşleşmezse başlığı bozmaz ama kaynağı taşır", () => {
    const r = splitTitleSource("Kısa başlık", "NTV Spor");
    expect(r).toEqual({ title: "Kısa başlık", source: "NTV Spor" });
  });

  it("<source> yoksa son ' - ' parçasını kaynak sayar", () => {
    const r = splitTitleSource("Trabzonspor'dan stoper hamlesi - Sporx");
    expect(r).toEqual({ title: "Trabzonspor'dan stoper hamlesi", source: "Sporx" });
  });

  it("uzun kuyruğu kaynak sanmaz", () => {
    const t =
      "Beşiktaş - bu yaz kadroya en az üç takviye planlayan yönetimden sürpriz karar bekleniyor";
    expect(splitTitleSource(t)).toEqual({ title: t });
  });
});

describe("toNewsId", () => {
  it("aynı girdiye aynı, farklı girdiye farklı kimlik üretir", () => {
    expect(toNewsId("abc")).toBe(toNewsId("abc"));
    expect(toNewsId("abc")).not.toBe(toNewsId("abd"));
    expect(toNewsId("abc")).toMatch(/^[0-9a-f]{16}$/);
  });
});

describe("parsePubDate", () => {
  const fallback = "2026-07-15T09:00:00.000Z";

  it("RFC-822 tarihini ISO'ya çevirir", () => {
    expect(parsePubDate("Tue, 14 Jul 2026 18:45:00 GMT", fallback)).toBe(
      "2026-07-14T18:45:00.000Z",
    );
  });

  it("geçersiz/eksik tarihte geri dönüş değerini kullanır", () => {
    expect(parsePubDate(undefined, fallback)).toBe(fallback);
    expect(parsePubDate("garbage", fallback)).toBe(fallback);
  });
});
