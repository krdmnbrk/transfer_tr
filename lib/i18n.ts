// Türkçe site metinleri ve etiketler.

import type { TransferStage } from "@/lib/domain/types";

export const SITE = {
  title: "Transfer TR",
  subtitle: "Süper Lig · 2026-27 yaz transfer dönemi",
  longTitle: "Süper Lig Transfer Haberleri Merkezi",
};

export const NAV = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/kulupler", label: "Kulüpler" },
  { href: "/asamalar", label: "Aşamalar" },
];

export function stageLabel(stage: TransferStage): string {
  switch (stage) {
    case "imza":
      return "İmza / Resmi";
    case "kiralik":
      return "Kiralık";
    case "ayrilik":
      return "Ayrılık";
    case "anlasma":
      return "Anlaşma";
    case "gorusme":
      return "Görüşme";
    default:
      return "Söylenti";
  }
}

export function stageDescription(stage: TransferStage): string {
  switch (stage) {
    case "imza":
      return "Resmen açıklanan ve imzalanan transferler";
    case "kiralik":
      return "Kiralık gidiş-gelişler";
    case "ayrilik":
      return "Ayrılıklar, fesihler ve vedalar";
    case "anlasma":
      return "El sıkışılan, imza bekleyen transferler";
    case "gorusme":
      return "Görüşme, temas ve teklif aşamasındakiler";
    default:
      return "Henüz doğrulanmamış transfer söylentileri";
  }
}
