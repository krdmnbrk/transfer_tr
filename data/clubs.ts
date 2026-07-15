// 2026-27 sezonu Süper Lig kulüpleri (18 takım).
// 2025-26 sonunda düşenler: Antalyaspor, Kayserispor, Fatih Karagümrük.
// Yükselenler: Erzurumspor FK, Amed SFK, Çorum FK.
// Sezon değişiminde bu liste elle güncellenir.

import type { Club } from "@/lib/domain/types";

export const CLUBS: Club[] = [
  {
    id: "galatasaray",
    name: "Galatasaray",
    query: "Galatasaray",
    aliases: ["Cimbom"],
    colors: { primary: "#a90432", secondary: "#fdb912" },
    city: "İstanbul",
  },
  {
    id: "fenerbahce",
    name: "Fenerbahçe",
    query: "Fenerbahçe",
    aliases: ["Kanarya"],
    colors: { primary: "#163962", secondary: "#ffed00" },
    city: "İstanbul",
  },
  {
    id: "besiktas",
    name: "Beşiktaş",
    query: "Beşiktaş",
    aliases: ["Kara Kartal"],
    colors: { primary: "#1f1f1f", secondary: "#ffffff" },
    city: "İstanbul",
  },
  {
    id: "trabzonspor",
    name: "Trabzonspor",
    query: "Trabzonspor",
    aliases: ["Fırtına"],
    colors: { primary: "#841e3d", secondary: "#25396f" },
    city: "Trabzon",
  },
  {
    id: "basaksehir",
    name: "Başakşehir",
    query: "Başakşehir",
    aliases: [],
    colors: { primary: "#14294f", secondary: "#f26522" },
    city: "İstanbul",
  },
  {
    id: "samsunspor",
    name: "Samsunspor",
    query: "Samsunspor",
    aliases: [],
    colors: { primary: "#c8102e", secondary: "#ffffff" },
    city: "Samsun",
  },
  {
    id: "alanyaspor",
    name: "Alanyaspor",
    query: "Alanyaspor",
    aliases: [],
    colors: { primary: "#f58220", secondary: "#00964b" },
    city: "Alanya",
  },
  {
    id: "eyupspor",
    name: "Eyüpspor",
    query: "Eyüpspor",
    aliases: [],
    colors: { primary: "#5d2e8e", secondary: "#ffd700" },
    city: "İstanbul",
  },
  {
    id: "gaziantep-fk",
    name: "Gaziantep FK",
    query: "Gaziantep FK",
    aliases: ["Gaziantep Futbol Kulübü"],
    colors: { primary: "#e30613", secondary: "#1f1f1f" },
    city: "Gaziantep",
  },
  {
    id: "goztepe",
    name: "Göztepe",
    query: "Göztepe",
    aliases: [],
    colors: { primary: "#fdc52c", secondary: "#e4022d" },
    city: "İzmir",
  },
  {
    id: "kasimpasa",
    name: "Kasımpaşa",
    query: "Kasımpaşa",
    aliases: [],
    colors: { primary: "#003b7e", secondary: "#ffffff" },
    city: "İstanbul",
  },
  {
    id: "kocaelispor",
    name: "Kocaelispor",
    query: "Kocaelispor",
    aliases: [],
    colors: { primary: "#00854a", secondary: "#1f1f1f" },
    city: "Kocaeli",
  },
  {
    id: "konyaspor",
    name: "Konyaspor",
    query: "Konyaspor",
    aliases: [],
    colors: { primary: "#007a3d", secondary: "#ffffff" },
    city: "Konya",
  },
  {
    id: "rizespor",
    name: "Çaykur Rizespor",
    query: "Rizespor",
    aliases: ["Rizespor"],
    colors: { primary: "#0066b3", secondary: "#009344" },
    city: "Rize",
  },
  {
    id: "genclerbirligi",
    name: "Gençlerbirliği",
    query: "Gençlerbirliği",
    aliases: [],
    colors: { primary: "#e30613", secondary: "#1f1f1f" },
    city: "Ankara",
  },
  {
    id: "erzurumspor",
    name: "Erzurumspor FK",
    query: "Erzurumspor",
    aliases: ["Erzurumspor"],
    colors: { primary: "#0c4da2", secondary: "#ffffff" },
    city: "Erzurum",
  },
  {
    id: "amed",
    name: "Amed SFK",
    query: "Amed Sportif",
    aliases: ["Amed Sportif Faaliyetler", "Amedspor"],
    colors: { primary: "#e30613", secondary: "#00964b" },
    city: "Diyarbakır",
  },
  {
    id: "corum-fk",
    name: "Çorum FK",
    query: "Çorum FK",
    aliases: ["Çorumspor"],
    colors: { primary: "#e30613", secondary: "#231f20" },
    city: "Çorum",
  },
];

const BY_ID = new Map(CLUBS.map((c) => [c.id, c]));

export function getClub(id: string): Club | undefined {
  return BY_ID.get(id);
}
