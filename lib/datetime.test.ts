import { describe, expect, it } from "vitest";
import { formatDateTime, formatShort } from "@/lib/datetime";

describe("datetime", () => {
  // 11:30 UTC = 14:30 TSİ (Europe/Istanbul, UTC+3)
  const iso = "2026-07-15T11:30:00.000Z";

  it("Türkiye saatiyle tam tarih üretir", () => {
    const s = formatDateTime(iso);
    expect(s).toContain("15 Temmuz 2026");
    expect(s).toContain("14:30");
  });

  it("kısa biçim gün+saat içerir", () => {
    const s = formatShort(iso);
    expect(s).toContain("15");
    expect(s).toContain("14:30");
  });
});
