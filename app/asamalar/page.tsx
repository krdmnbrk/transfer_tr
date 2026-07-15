import type { Metadata } from "next";
import { getTransferFeed, CLUBS } from "@/lib/data";
import type { NewsItem, TransferStage } from "@/lib/domain/types";
import { STAGE_PRECEDENCE } from "@/lib/transfer/classify";
import { stageDescription, stageLabel } from "@/lib/i18n";
import { Container, EmptyState, SectionTitle, StaleBanner } from "@/components/ui";
import { NewsCard } from "@/components/NewsCard";

export const metadata: Metadata = {
  title: "Aşamalar",
  description:
    "Süper Lig transfer gündemi aşama aşama: resmi imzalar, anlaşmalar, kiralıklar, görüşmeler ve ayrılıklar.",
};

export default async function StagesPage() {
  const { data: feed, stale } = await getTransferFeed();

  const byStage = new Map<TransferStage, NewsItem[]>();
  for (const stage of STAGE_PRECEDENCE) {
    const items = feed.items.filter((i) => i.stage === stage);
    if (items.length > 0) byStage.set(stage, items);
  }

  return (
    <>
      <StaleBanner stale={stale} />
      <Container className="py-8 sm:py-10">
        <SectionTitle
          title="Aşamalar"
          subtitle="Ligin tüm transfer gündemi kesinlik sırasıyla"
        />
        {byStage.size === 0 ? (
          <EmptyState
            title="Şu an gösterilecek haber yok"
            hint="Kaynak ~5 dakikada bir yenilenir; daha sonra tekrar bakın."
          />
        ) : (
          [...byStage.entries()].map(([stage, items]) => (
            <section key={stage} className="mb-10">
              <SectionTitle
                title={`${stageLabel(stage)} (${items.length})`}
                subtitle={stageDescription(stage)}
              />
              <div className="grid gap-3">
                {items.slice(0, 20).map((item) => (
                  <NewsCard key={item.id} item={item} clubs={CLUBS} />
                ))}
              </div>
            </section>
          ))
        )}
      </Container>
    </>
  );
}
