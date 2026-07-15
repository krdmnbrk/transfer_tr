import { getTransferFeed, CLUBS } from "@/lib/data";
import { SITE } from "@/lib/i18n";
import { Container, Pill, StaleBanner } from "@/components/ui";
import { NewsFeed } from "@/components/NewsFeed";

export default async function HomePage() {
  const { data: feed, stale } = await getTransferFeed();

  const imzaCount = feed.items.filter((i) => i.stage === "imza").length;
  const gorusmeCount = feed.items.filter(
    (i) => i.stage === "gorusme" || i.stage === "anlasma",
  ).length;

  return (
    <>
      <StaleBanner stale={stale} />
      <Container className="py-8 sm:py-10">
        <header>
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            {SITE.longTitle}
          </h1>
          <p className="mt-1 text-sm text-slate-400">{SITE.subtitle}</p>
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <Pill tone="slate">{feed.items.length} haber</Pill>
            <Pill tone="emerald">{imzaCount} imza/resmi</Pill>
            <Pill tone="amber">{gorusmeCount} görüşme/anlaşma</Pill>
            <Pill tone="slate">{CLUBS.length} kulüp</Pill>
          </div>
          {feed.failedClubIds.length > 0 && (
            <p className="mt-2 text-xs text-amber-400/80">
              Not: {feed.failedClubIds.length} kulübün kaynağına bu derlemede
              ulaşılamadı; o kulüplerin haberleri eksik olabilir.
            </p>
          )}
        </header>

        <section className="mt-8">
          <NewsFeed items={feed.items.slice(0, 150)} clubs={CLUBS} />
        </section>
      </Container>
    </>
  );
}
