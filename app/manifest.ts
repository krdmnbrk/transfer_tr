import type { MetadataRoute } from "next";
import { SITE } from "@/lib/i18n";

// Statik dışa aktarım için gerekli.
export const dynamic = "force-static";

const BASE = process.env.NODE_ENV === "production" ? "/transfer_tr" : "";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.longTitle,
    short_name: SITE.title,
    description:
      "Süper Lig transfer gündemi: imzalar, anlaşmalar, kiralıklar ve görüşmeler.",
    start_url: `${BASE}/`,
    display: "standalone",
    background_color: "#0a1210",
    theme_color: "#0a1210",
    icons: [
      {
        src: `${BASE}/icons/icon-192.png`,
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: `${BASE}/icons/icon-512.png`,
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
