import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTransferFeed, getClub, CLUBS } from "@/lib/data";
import { Container, StaleBanner } from "@/components/ui";
import { ClubNews } from "@/components/ClubNews";

// Kulüp listesi statiktir (ağ gerekmez) — 18 sayfa her derlemede üretilir.
export function generateStaticParams() {
  return CLUBS.map((c) => ({ kulupId: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kulupId: string }>;
}): Promise<Metadata> {
  const { kulupId } = await params;
  const club = getClub(kulupId);
  if (!club) return {};
  return {
    title: `${club.name} Transfer Haberleri`,
    description: `${club.name} transfer gündemi: görüşmeler, anlaşmalar, imzalar ve ayrılıklar.`,
  };
}

export default async function ClubPage({
  params,
}: {
  params: Promise<{ kulupId: string }>;
}) {
  const { kulupId } = await params;
  const club = getClub(kulupId);
  if (!club) notFound();

  const { data: feed, stale } = await getTransferFeed();
  const items = feed.items.filter((i) => i.clubIds.includes(club.id));

  return (
    <>
      <StaleBanner stale={stale} />
      {/* Kulüp renkleriyle başlık şeridi */}
      <div
        className="border-b border-white/10"
        style={{
          background: `linear-gradient(120deg, ${club.colors.primary}26 0%, transparent 55%), linear-gradient(240deg, ${club.colors.secondary}1f 0%, transparent 55%)`,
        }}
      >
        <Container className="py-8 sm:py-10">
          <div className="flex items-center gap-3.5">
            <span
              className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-lg font-extrabold text-white ring-1 ring-white/25"
              style={{ backgroundColor: club.colors.primary }}
              aria-hidden
            >
              {club.name.slice(0, 2).toLocaleUpperCase("tr-TR")}
            </span>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                {club.name}
              </h1>
              <p className="mt-0.5 text-sm text-slate-400">
                {club.city} · {items.length} transfer haberi
              </p>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        <ClubNews items={items} clubs={CLUBS} />
      </Container>
    </>
  );
}
