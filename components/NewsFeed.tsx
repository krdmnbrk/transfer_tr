"use client";

// Ana akış filtreleri: kulüp çoklu seçimi + aşama seçimi.
// Veri derleme zamanından prop olarak gelir; burada yalnızca süzülür.

import { useMemo, useState } from "react";
import { ListFilter } from "lucide-react";
import type { Club, NewsItem, TransferStage } from "@/lib/domain/types";
import { stageLabel } from "@/lib/i18n";
import { STAGE_PRECEDENCE } from "@/lib/transfer/classify";
import { NewsCard } from "@/components/NewsCard";
import { EmptyState } from "@/components/ui";

export function NewsFeed({ items, clubs }: { items: NewsItem[]; clubs: Club[] }) {
  const [selectedClubs, setSelectedClubs] = useState<Set<string>>(new Set());
  const [stage, setStage] = useState<TransferStage | "all">("all");

  const toggleClub = (id: string) => {
    setSelectedClubs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        if (stage !== "all" && item.stage !== stage) return false;
        if (selectedClubs.size > 0 && !item.clubIds.some((id) => selectedClubs.has(id)))
          return false;
        return true;
      }),
    [items, stage, selectedClubs],
  );

  return (
    <div>
      {/* Kulüp filtresi — yatay kaydırmalı çip şeridi */}
      <div className="x-scroll -mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        <button
          type="button"
          onClick={() => setSelectedClubs(new Set())}
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
            selectedClubs.size === 0
              ? "bg-green-500/20 text-green-300 ring-1 ring-green-500/40"
              : "bg-white/[0.04] text-slate-300 ring-1 ring-white/10 hover:bg-white/10"
          }`}
        >
          Tüm kulüpler
        </button>
        {clubs.map((club) => {
          const active = selectedClubs.has(club.id);
          return (
            <button
              key={club.id}
              type="button"
              onClick={() => toggleClub(club.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                active
                  ? "bg-green-500/20 text-green-300 ring-1 ring-green-500/40"
                  : "bg-white/[0.04] text-slate-300 ring-1 ring-white/10 hover:bg-white/10"
              }`}
              aria-pressed={active}
            >
              <span
                className="h-2 w-2 rounded-full ring-1 ring-white/20"
                style={{ backgroundColor: club.colors.primary }}
                aria-hidden
              />
              {club.name}
            </button>
          );
        })}
      </div>

      {/* Aşama filtresi */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <ListFilter className="h-4 w-4 text-slate-500" aria-hidden />
        <button
          type="button"
          onClick={() => setStage("all")}
          className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
            stage === "all"
              ? "bg-white/15 text-white ring-1 ring-white/30"
              : "bg-white/[0.04] text-slate-400 ring-1 ring-white/10 hover:bg-white/10"
          }`}
        >
          Hepsi
        </button>
        {STAGE_PRECEDENCE.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStage(s === stage ? "all" : s)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              stage === s
                ? "bg-white/15 text-white ring-1 ring-white/30"
                : "bg-white/[0.04] text-slate-400 ring-1 ring-white/10 hover:bg-white/10"
            }`}
            aria-pressed={stage === s}
          >
            {stageLabel(s)}
          </button>
        ))}
      </div>

      <p className="mt-3 text-xs text-slate-500">
        {filtered.length} haber gösteriliyor
      </p>

      {/* Akış */}
      {filtered.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            title="Bu filtrelerle haber bulunamadı"
            hint="Filtreleri temizleyip yeniden deneyin."
          />
        </div>
      ) : (
        <div className="mt-4 grid gap-3">
          {filtered.slice(0, 100).map((item, i) => (
            <div
              key={item.id}
              className="rise-in"
              style={{ animationDelay: `${Math.min(i, 12) * 30}ms` }}
            >
              <NewsCard item={item} clubs={clubs} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
