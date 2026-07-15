import { Container } from "@/components/ui";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-black/20">
      <Container className="py-8">
        <div className="flex flex-col gap-3 text-xs text-slate-500 sm:flex-row sm:items-start sm:justify-between">
          <p>
            Süper Lig Transfer Haberleri Merkezi — gayriresmî, hayran projesi.
            Kulüp adları ve renkleri ilgili kulüplerin markasıdır.
          </p>
          <p className="sm:max-w-md sm:text-right">
            Haberler <span className="text-slate-400">Google News RSS</span>{" "}
            üzerinden otomatik derlenir; bağlantılar orijinal habere gider.
            Aşama rozetleri ve oyuncu adları başlıktan{" "}
            <span className="text-slate-400">otomatik sınıflandırma/çıkarımdır</span>,
            doğruluk garantisi yoktur.
          </p>
        </div>
      </Container>
    </footer>
  );
}
