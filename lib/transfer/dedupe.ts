// Aynı haberin tekrarını birleştirme: aynı hikaye birden çok kulüp sorgusunda
// (aynı id) ve aynı başlıkla farklı kayıtlarda görünebilir.

import type { NewsItem, TransferStage } from "@/lib/domain/types";
import { STAGE_PRECEDENCE, trLower } from "@/lib/transfer/classify";

// Başlığı karşılaştırma anahtarına indirger: küçük harf, işaretler sadeleşir.
export function normalizeTitleKey(title: string): string {
  return trLower(title)
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function strongerStage(a: TransferStage, b: TransferStage): TransferStage {
  return STAGE_PRECEDENCE.indexOf(a) <= STAGE_PRECEDENCE.indexOf(b) ? a : b;
}

function merge(into: NewsItem, from: NewsItem): NewsItem {
  return {
    ...into,
    clubIds: [...new Set([...into.clubIds, ...from.clubIds])],
    players: [...new Set([...into.players, ...from.players])],
    stage: strongerStage(into.stage, from.stage),
    publishedAt:
      from.publishedAt < into.publishedAt ? from.publishedAt : into.publishedAt,
    source: into.source ?? from.source,
  };
}

export function dedupeNews(items: NewsItem[]): NewsItem[] {
  // 1. geçiş: aynı id (aynı guid/link) — birden çok kulüp sorgusundan gelen kopya.
  const byId = new Map<string, NewsItem>();
  for (const item of items) {
    const existing = byId.get(item.id);
    byId.set(item.id, existing ? merge(existing, item) : item);
  }

  // 2. geçiş: aynı başlık — aynı sendikasyon metni farklı kayıtlarla gelebilir.
  const byTitle = new Map<string, NewsItem>();
  for (const item of byId.values()) {
    const key = normalizeTitleKey(item.title);
    const existing = byTitle.get(key);
    byTitle.set(key, existing ? merge(existing, item) : item);
  }

  return [...byTitle.values()];
}
