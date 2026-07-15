import { describe, expect, it } from "vitest";
import { CLUBS } from "@/data/clubs";
import {
  STAGE_PRECEDENCE,
  classifyStage,
  matchClubs,
} from "@/lib/transfer/classify";

describe("classifyStage", () => {
  it("aşamaları gerçekçi başlıklardan tanır", () => {
    expect(classifyStage("Galatasaray yeni golcüsüne imzayı attırdı")).toBe("imza");
    expect(classifyStage("Fenerbahçe stoperi kiralık olarak kadrosuna kattı")).toBe("imza"); // "kadrosuna katt" > kiralik
    expect(classifyStage("Beşiktaş genç kanadı bir yıllığına kiraladı, kiralandı")).toBe("kiralik");
    expect(classifyStage("Trabzonspor'da yıldız isim takımdan ayrılıyor")).toBe("ayrilik");
    expect(classifyStage("Başakşehir orta sahayla her konuda anlaştı")).toBe("anlasma");
    expect(classifyStage("Samsunspor sol bek için resmi teklifini iletti, görüşmeler sürüyor")).toBe("gorusme");
    expect(classifyStage("Göztepe'ye sürpriz golcü iddiası")).toBe("soylenti");
  });

  it("öncelik sırası: imza kiralıktan önce gelir", () => {
    expect(classifyStage("Kiralık transferde imzalar atıldı")).toBe("imza");
    expect(STAGE_PRECEDENCE[0]).toBe("imza");
    expect(STAGE_PRECEDENCE[STAGE_PRECEDENCE.length - 1]).toBe("soylenti");
  });

  it("Türkçe İ/ı büyük harfleri doğru küçültülür", () => {
    // "İMZA".toLowerCase() === "i̇mza" (noktalı) — tr-TR ile "imza" olmalı.
    expect(classifyStage("İMZA ATTI")).toBe("imza");
    expect(classifyStage("KİRALIK GİDİYOR")).toBe("kiralik");
  });
});

describe("matchClubs", () => {
  it("ekli kulüp adlarını ve birden çok kulübü yakalar", () => {
    const ids = matchClubs(
      "Fenerbahçe'nin istediği stoper Galatasaray'a gidiyor",
      CLUBS,
    );
    expect(ids).toContain("fenerbahce");
    expect(ids).toContain("galatasaray");
  });

  it("lakapları tanır", () => {
    expect(matchClubs("Cimbom'dan orta saha harekatı", CLUBS)).toContain(
      "galatasaray",
    );
  });

  it("geçmeyen kulübü uydurmaz", () => {
    expect(matchClubs("Konyaspor kaleci arayışında", CLUBS)).toEqual(["konyaspor"]);
  });
});
