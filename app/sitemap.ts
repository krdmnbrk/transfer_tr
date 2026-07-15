import type { MetadataRoute } from "next";
import { CLUBS } from "@/data/clubs";

// Statik dışa aktarım için gerekli.
export const dynamic = "force-static";

const SITE_URL = "https://krdmnbrk.github.io/transfer_tr";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "/kulupler", "/asamalar"];
  const clubPaths = CLUBS.map((c) => `/kulupler/${c.id}`);

  return [...staticPaths, ...clubPaths].map((path) => ({
    url: `${SITE_URL}${path}/`,
    changeFrequency: "hourly",
    priority: path === "" ? 1 : 0.7,
  }));
}
