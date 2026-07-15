import Link from "next/link";
import { ChevronRight, Newspaper } from "lucide-react";
import type { Club, NewsItem } from "@/lib/domain/types";

export function ClubCard({
  club,
  count,
  latest,
}: {
  club: Club;
  count: number;
  latest?: NewsItem;
}) {
  return (
    <Link
      href={`/kulupler/${club.id}`}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.3)] transition-colors hover:border-white/[0.2]"
    >
      {/* Kulüp renginden üst şerit */}
      <span
        className="absolute inset-x-0 top-0 h-1"
        style={{
          background: `linear-gradient(90deg, ${club.colors.primary}, ${club.colors.secondary})`,
        }}
        aria-hidden
      />
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-extrabold text-white ring-1 ring-white/20"
            style={{ backgroundColor: club.colors.primary }}
            aria-hidden
          >
            {club.name.slice(0, 2).toLocaleUpperCase("tr-TR")}
          </span>
          <div>
            <p className="text-sm font-bold text-white">{club.name}</p>
            <p className="text-[11px] text-slate-500">{club.city}</p>
          </div>
        </div>
        <ChevronRight
          className="h-4 w-4 shrink-0 text-slate-600 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-300"
          aria-hidden
        />
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
        <Newspaper className="h-3.5 w-3.5 shrink-0 text-slate-500" aria-hidden />
        {count > 0 ? `${count} haber` : "Haber yok"}
      </div>
      {latest && (
        <p className="mt-1.5 line-clamp-2 text-xs leading-snug text-slate-500">
          {latest.title}
        </p>
      )}
    </Link>
  );
}
