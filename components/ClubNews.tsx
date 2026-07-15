"use client";

// Kulüp sayfası haber akışı: "Öne çıkan isimler" çipleri tıklanınca
// liste yalnızca o ismin geçtiği haberlere süzülür (tekrar tıklama temizler).
// Veri derleme zamanından prop olarak gelir; burada yalnızca süzülür.

import { useMemo, useRef, useState } from "react";
import { UserRound, X } from "lucide-react";
import type { Club, NewsItem, TransferStage } from "@/lib/domain/types";
import { STAGE_PRECEDENCE } from "@/lib/transfer/classify";
import { stageDescription, stageLabel } from "@/lib/i18n";
import { EmptyState, SectionTitle } from "@/components/ui";
import { NewsCard } from "@/components/NewsCard";

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

export function ClubNews({ items, clubs }: { items: NewsItem[]; clubs: Club[] }) {
  const [player, setPlayer] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const players = useMemo(() => topPlayers(items), [items]);

  const visible = useMemo(
    () => (player ? items.filter((i) => i.players.includes(player)) : items),
    [items, player],
  );

  const byStage = useMemo(() => {
    const map = new Map<TransferStage, NewsItem[]>();
    for (const stage of STAGE_PRECEDENCE) {
      const stageItems = visible.filter((i) => i.stage === stage);
      if (stageItems.length > 0) map.set(stage, stageItems);
    }
    return map;
  }, [visible]);

  const togglePlayer = (name: string) => {
    const next = player === name ? null : name;
    setPlayer(next);
    if (next) listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {players.length > 0 && (
        <section className="mb-8">
          <SectionTitle
            title="Öne çıkan isimler"
            subtitle="Başlıklardan otomatik çıkarım — kesin bilgi değildir. İsme tıklayınca ilgili haberler listelenir."
          />
          <div className="flex flex-wrap gap-1.5">
            {players.map((p) => {
              const active = player === p.name;
              return (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => togglePlayer(p.name)}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ring-1 transition-colors ${
                    active
                      ? "bg-emerald-500/30 text-emerald-100 ring-emerald-400/60"
                      : "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30 hover:bg-emerald-500/25"
                  }`}
                >
                  <UserRound className="h-3 w-3" aria-hidden />
                  {p.name}
                  <span className="opacity-60">×{p.count}</span>
                  {active && <X className="h-3 w-3" aria-hidden />}
                </button>
              );
            })}
          </div>
        </section>
      )}

      <div ref={listRef} className="scroll-mt-20">
        {player && (
          <p className="mb-4 flex flex-wrap items-center gap-2 text-sm text-slate-300">
            <span>
              <span className="font-semibold text-emerald-300">{player}</span> ile
              ilgili {visible.length} haber gösteriliyor
            </span>
            <button
              type="button"
              onClick={() => setPlayer(null)}
              className="inline-flex items-center gap-1 rounded-full bg-white/[0.06] px-2.5 py-0.5 text-xs font-semibold text-slate-300 ring-1 ring-white/10 transition-colors hover:bg-white/10"
            >
              <X className="h-3 w-3" aria-hidden />
              Filtreyi temizle
            </button>
          </p>
        )}

        {visible.length === 0 ? (
          <EmptyState
            title={
              player
                ? "Bu isimle eşleşen haber bulunamadı"
                : "Şu an bu kulüp için haber bulunamadı"
            }
            hint="Kaynak ~5 dakikada bir yenilenir; daha sonra tekrar bakın."
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
                  <NewsCard key={item.id} item={item} clubs={clubs} hideClubs />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </>
  );
}
