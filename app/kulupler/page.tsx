import type { Metadata } from "next";
import { getTransferFeed, CLUBS } from "@/lib/data";
import { Container, SectionTitle, StaleBanner } from "@/components/ui";
import { LastUpdated } from "@/components/LastUpdated";
import { ClubCard } from "@/components/ClubCard";

export const metadata: Metadata = {
  title: "Kulüpler",
  description:
    "Süper Lig kulüplerinin transfer gündemi — kulüp kulüp haber sayıları ve son gelişmeler.",
};

export default async function ClubsPage() {
  const { data: feed, stale } = await getTransferFeed();

  return (
    <>
      <StaleBanner stale={stale} />
      <Container className="py-8 sm:py-10">
        <SectionTitle
          title="Kulüpler"
          subtitle="Transfer gündemini kulüp kulüp inceleyin"
        />
        <div className="mb-6">
          <LastUpdated iso={feed.fetchedAt} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CLUBS.map((club) => (
            <ClubCard
              key={club.id}
              club={club}
              count={feed.clubCounts[club.id] ?? 0}
              latest={feed.items.find((i) => i.clubIds.includes(club.id))}
            />
          ))}
        </div>
      </Container>
    </>
  );
}
