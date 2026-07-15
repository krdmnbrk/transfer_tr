# Transfer TR — Süper Lig Transfer Haberleri Merkezi

Süper Lig kulüplerinin transfer gündemini tek yerde toplayan, tamamen statik,
mobil öncelikli ve Türkçe bir site: hangi kulüp hangi oyuncuyla görüşüyor,
kim imzayı attı, kim ayrılıyor.

**Canlı site:** https://krdmnbrk.github.io/transfer_tr/

> [worldcup_2026](https://github.com/krdmnbrk/worldcup_2026) projesi örnek
> alınarak aynı mimariyle kurulmuştur.

## Özellikler

- **Ana akış** — tüm kulüplerin haberleri; kulüp ve aşama filtreleriyle
- **Kulüp sayfaları** (`/kulupler/<kulüp>`) — kulübe özel gündem, aşama aşama
  gruplu + başlıklardan otomatik çıkarılan "öne çıkan isimler"
- **Aşamalar** (`/asamalar`) — ligin tamamı kesinlik sırasıyla:
  İmza → Kiralık → Ayrılık → Anlaşma → Görüşme → Söylenti
- Haber kartlarındaki bağlantılar orijinal habere gider

## Nasıl çalışır?

- **Veri kaynağı:** [Google News RSS](https://news.google.com) — kulüp başına
  bir arama sorgusu (`"<kulüp>" transfer`, `hl=tr`). Anahtarsız ve ücretsizdir.
- **Derleme zamanı çekim:** Veri yalnızca `next build` sırasında çekilir
  (`lib/data/news.ts`). Google News RSS CORS vermediği için tarayıcıdan canlı
  yenileme yapılmaz; bunun yerine GitHub Actions **30 dakikada bir** siteyi
  yeniden derleyip yayınlar (`.github/workflows/deploy.yml`).
- **Sınıflandırma sezgiseldir:** Aşama rozetleri başlıktaki Türkçe anahtar
  köklerden (`lib/transfer/classify.ts`), oyuncu adları büyük harf dizisi
  sezgiselinden (`lib/transfer/players.ts`) üretilir. UI'da "otomatik
  çıkarım" olarak etiketlenir; doğruluk garantisi yoktur.
- **Dayanıklılık:** `lib/snapshot.ts` başarılı her çekimi
  `data/snapshots/feed.json`'a yazar; kaynak erişilemezse build kırılmaz,
  son bilinen veri "stale" uyarısıyla servis edilir.
- **Tekrar birleştirme:** Aynı haber birden çok kulüp sorgusunda görünür;
  id ve normalize başlık üzerinden birleştirilir (`lib/transfer/dedupe.ts`).

## Teknoloji

Next.js 16 (App Router, statik dışa aktarım) · React 19 · TypeScript (strict) ·
Tailwind CSS v4 · lucide-react · Vitest

## Komutlar

```bash
npm run dev        # geliştirme sunucusu
npm run build      # statik üretim (out/)
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm test           # birim testleri (parser/sınıflandırma/dedupe)
npm run check:feeds  # kulüp başına RSS öğe sayısı teşhisi
npm run gen:icons  # PWA ikonları (npm install --no-save sharp gerektirir)
```

## Dağıtım

`main`'e her push, 30 dakikalık zamanlayıcı ve elle tetikleme
(`workflow_dispatch`) GitHub Pages dağıtımını çalıştırır. Kalite kapısı:
lint → typecheck → test → build. Notlar:

- Depoda ~60 gün commit olmazsa GitHub zamanlanmış workflow'u durdurur;
  Actions sekmesinden tek tıkla yeniden etkinleştirilebilir.
- Kulüp listesi (`data/clubs.ts`) sezonluk statiktir; sezon değişiminde
  (düşen/çıkan takımlar) elle güncellenir.

## Feragat

Gayriresmî bir hayran projesidir. Haber içeriği ilgili yayıncılara aittir;
bu site yalnızca başlık ve bağlantı listeler. Kulüp adları ve renkleri ilgili
kulüplerin markasıdır, yalnızca tanıtım amaçlı kullanılır.
