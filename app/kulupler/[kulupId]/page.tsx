import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { UserRound } from "lucide-react";
import { getTransferFeed, getClub, CLUBS } from "@/lib/data";
import type { NewsItem, TransferStage } from "@/lib/domain/types";
import { STAGE_PRECEDENCE } from "@/lib/transfer/classify";
import { stageDescription, stageLabel } from "@/lib/i18n";
import { Container, EmptyState, Pill, SectionTitle, StaleBanner } from "@/components/ui";
import { LastUpdated } from "@/components/LastUpdated";
import { NewsCard } from "@/components/NewsCard";

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

// Başlıklarda en sık geçen otomatik çıkarım adları (en fazla 8).
function topPlayers(items: NewsItem[]): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const item of items)
    for (const name of item.players)
      counts.set(name, (counts.get(name) ?? 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({ name, count }));
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
  const players = topPlayers(items);

  const byStage = new Map<TransferStage, NewsItem[]>();
  for (const stage of STAGE_PRECEDENCE) {
    const stageItems = items.filter((i) => i.stage === stage);
    if (stageItems.length > 0) byStage.set(stage, stageItems);
  }

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
          <div className="mt-4">
            <LastUpdated iso={feed.fetchedAt} />
          </div>
        </Container>
      </div>

      <Container className="py-8">
        {players.length > 0 && (
          <section className="mb-8">
            <SectionTitle
              title="Öne çıkan isimler"
              subtitle="Başlıklardan otomatik çıkarım — kesin bilgi değildir"
            />
            <div className="flex flex-wrap gap-1.5">
              {players.map((p) => (
                <Pill key={p.name} tone="emerald">
                  <UserRound className="h-3 w-3" aria-hidden />
                  {p.name}
                  <span className="opacity-60">×{p.count}</span>
                </Pill>
              ))}
            </div>
          </section>
        )}

        {items.length === 0 ? (
          <EmptyState
            title="Şu an bu kulüp için haber bulunamadı"
            hint="Kaynak ~30 dakikada bir yenilenir; daha sonra tekrar bakın."
          />
        ) : (
          [...byStage.entries()].map(([stage, stageItems]) => (
            <section key={stage} className="mb-8">
              <SectionTitle
                title={stageLabel(stage)}
                subtitle={stageDescription(stage)}
              />
              <div className="grid gap-3">
                {stageItems.slice(0, 30).map((item) => (
                  <NewsCard key={item.id} item={item} clubs={CLUBS} hideClubs />
                ))}
              </div>
            </section>
          ))
        )}
      </Container>
    </>
  );
}
