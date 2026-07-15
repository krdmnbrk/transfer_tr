// Derleme zamanı toplayıcı: 18 kulüp sorgusunu sınırlı eşzamanlılıkla çeker,
// normalize + sınıflandırma + tekrar birleştirme uygular, snapshot'a yazar.

import { CLUBS } from "@/data/clubs";
import type {
  Club,
  DataResult,
  NewsItem,
  TransferFeed,
} from "@/lib/domain/types";
import { fetchRssText } from "@/lib/gnews/client";
import { clubSearchUrl } from "@/lib/gnews/endpoints";
import { parseRss } from "@/lib/gnews/rss";
import {
  parsePubDate,
  splitTitleSource,
  toNewsId,
} from "@/lib/gnews/normalize";
import { classifyStage, matchClubs } from "@/lib/transfer/classify";
import { extractPlayerNames } from "@/lib/transfer/players";
import { dedupeNews } from "@/lib/transfer/dedupe";
import { withSnapshot } from "@/lib/snapshot";

// Kulüp başına ham öğe sınırı (dedupe öncesi) ve toplam akış sınırı.
const PER_CLUB_CAP = 60;
const TOTAL_CAP = 500;
const CONCURRENCY = 4;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Google'a karşı nazik ol: sınırlı eşzamanlılık + küçük gecikme.
async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const i = next++;
      if (i > 0) await sleep(150 + (i % limit) * 100);
      results[i] = await fn(items[i]);
    }
  });
  await Promise.all(workers);
  return results;
}

async function fetchClubNews(club: Club, nowIso: string): Promise<NewsItem[]> {
  const xml = await fetchRssText(clubSearchUrl(club.query), {
    tags: [`club-${club.id}`],
  });
  return parseRss(xml)
    .slice(0, PER_CLUB_CAP)
    .map((raw) => {
      const { title, source } = splitTitleSource(raw.title, raw.sourceName);
      return {
        id: toNewsId(raw.guid ?? raw.link),
        title,
        link: raw.link,
        source,
        publishedAt: parsePubDate(raw.pubDate, nowIso),
        clubIds: [...new Set([club.id, ...matchClubs(title, CLUBS)])],
        stage: classifyStage(title),
        players: extractPlayerNames(title, CLUBS),
      };
    });
}

async function fetchFeed(): Promise<TransferFeed> {
  const nowIso = new Date().toISOString();
  const failedClubIds: string[] = [];

  const perClub = await mapWithConcurrency(CLUBS, CONCURRENCY, async (club) => {
    try {
      return await fetchClubNews(club, nowIso);
    } catch {
      // Tek kulübün hatası akışı düşürmesin; kesinti bilgisi UI'a taşınır.
      failedClubIds.push(club.id);
      return [] as NewsItem[];
    }
  });

  const items = dedupeNews(perClub.flat())
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
    .slice(0, TOTAL_CAP);

  const clubCounts: Record<string, number> = {};
  for (const club of CLUBS) {
    clubCounts[club.id] = items.filter((i) => i.clubIds.includes(club.id)).length;
  }

  return { items, fetchedAt: nowIso, clubCounts, failedClubIds };
}

export async function getTransferFeed(): Promise<DataResult<TransferFeed>> {
  return withSnapshot("feed", fetchFeed, {
    // Boş akış (tümü engellendi/başarısız) iyi snapshot'ı ezmesin.
    isValid: (d) => d.items.length > 0,
  });
}
