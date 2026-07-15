import { ExternalLink, UserRound } from "lucide-react";
import type { Club, NewsItem } from "@/lib/domain/types";
import { formatShort } from "@/lib/datetime";
import { StageBadge } from "@/components/StageBadge";
import { ClubChip } from "@/components/ClubChip";

export function NewsCard({
  item,
  clubs,
  hideClubs = false,
}: {
  item: NewsItem;
  clubs: Club[];
  hideClubs?: boolean;
}) {
  const itemClubs = clubs.filter((c) => item.clubIds.includes(c.id));
  return (
    <article className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.3)] transition-colors hover:border-white/[0.16]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <StageBadge stage={item.stage} />
          {item.source && (
            <span className="text-[11px] font-medium text-slate-500">
              {item.source}
            </span>
          )}
        </div>
        <time
          dateTime={item.publishedAt}
          className="shrink-0 font-mono text-[11px] text-slate-500"
        >
          {formatShort(item.publishedAt)}
        </time>
      </div>

      <h3 className="mt-2 text-[15px] font-semibold leading-snug text-white">
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-green-300"
        >
          {item.title}
          <ExternalLink
            className="ml-1.5 inline h-3.5 w-3.5 align-[-1px] text-slate-500"
            aria-hidden
          />
        </a>
      </h3>

      {(itemClubs.length > 0 || item.players.length > 0) && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {!hideClubs && itemClubs.map((club) => <ClubChip key={club.id} club={club} />)}
          {item.players.map((name) => (
            <span
              key={name}
              title="Başlıktan otomatik çıkarım"
              className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-0.5 text-[11px] font-medium text-green-300/90 ring-1 ring-green-500/20"
            >
              <UserRound className="h-3 w-3" aria-hidden />
              {name}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
