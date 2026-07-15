import { describe, expect, it } from "vitest";
import { CLUBS } from "@/data/clubs";
import { extractPlayerNames } from "@/lib/transfer/players";

describe("extractPlayerNames", () => {
  it("ad-soyad dizilerini çıkarır", () => {
    expect(
      extractPlayerNames("Galatasaray, Victor Osimhen için yeni teklif hazırlıyor", CLUBS),
    ).toEqual(["Victor Osimhen"]);
  });

  it("Türkçe karakterli adları destekler", () => {
    expect(
      extractPlayerNames("Barış Alper Yılmaz için dev bonservis beklentisi", CLUBS),
    ).toEqual(["Barış Alper Yılmaz"]);
  });

  it("kesme işaretli ekleri soyar", () => {
    expect(
      extractPlayerNames("Kerem Aktürkoğlu'nun yeni adresi belli oluyor", CLUBS),
    ).toEqual(["Kerem Aktürkoğlu"]);
  });

  it("kulüp adları, şehirler ve kalıp sözcükler ad sayılmaz", () => {
    expect(extractPlayerNames("Son Dakika Süper Lig transfer haberleri", CLUBS)).toEqual([]);
    expect(extractPlayerNames("Fenerbahçe Beşiktaş derbisinde gündem transfer", CLUBS)).toEqual([]);
    expect(extractPlayerNames("Teknik Direktör kararını verdi", CLUBS)).toEqual([]);
  });

  it("adsız başlıkta boş liste döner", () => {
    expect(extractPlayerNames("kadroya iki takviye daha geliyor", CLUBS)).toEqual([]);
  });

  it("en fazla üç ad döndürür", () => {
    const names = extractPlayerNames(
      "Mert Yandaş, Ada Kerem, Deniz Çelik ve Umut Aydın listede; Emre Duran da takipte",
      CLUBS,
    );
    expect(names.length).toBeLessThanOrEqual(3);
  });
});
