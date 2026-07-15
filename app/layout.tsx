import type { Metadata, Viewport } from "next";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { SITE } from "@/lib/i18n";

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

const BASE = process.env.NODE_ENV === "production" ? "/transfer_tr" : "";
const SITE_URL = "https://krdmnbrk.github.io/transfer_tr";
const DESCRIPTION =
  "Süper Lig transfer gündemini takip edin: hangi kulüp hangi oyuncuyla görüşüyor — imzalar, anlaşmalar, kiralıklar ve ayrılıklar kulüp kulüp tek yerde.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE.longTitle,
    template: `%s · ${SITE.title}`,
  },
  description: DESCRIPTION,
  applicationName: SITE.title,
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: SITE.title,
  },
  icons: {
    icon: `${BASE}/icons/icon-192.png`,
    apple: `${BASE}/icons/apple-touch-icon.png`,
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: SITE.title,
    title: SITE.longTitle,
    description: DESCRIPTION,
    url: `${SITE_URL}/`,
    images: [
      {
        url: `${SITE_URL}/og.png`,
        width: 1200,
        height: 630,
        alt: SITE.longTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.longTitle,
    description: DESCRIPTION,
    images: [`${SITE_URL}/og.png`],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a1210",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${grotesk.variable} ${plexMono.variable} antialiased`}
    >
      <body className="flex min-h-screen flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
