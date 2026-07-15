import Link from "next/link";
import { Container } from "@/components/ui";

// Statik dışa aktarımda bu sayfa 404.html üretir; GitHub Pages bilinmeyen
// yolları bununla karşılar (varsayılan çirkin 404 yerine markalı Türkçe sayfa).
export default function NotFound() {
  return (
    <Container className="py-20 text-center">
      <p className="text-6xl">🔎</p>
      <h1 className="mt-4 text-2xl font-bold text-white">Sayfa bulunamadı</h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
        Aradığınız sayfa taşınmış ya da hiç var olmamış olabilir. Buradan devam
        edebilirsiniz:
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm">
        <Link
          href="/"
          className="rounded-lg bg-green-500/15 px-4 py-2 font-medium text-green-300 hover:bg-green-500/25"
        >
          Ana sayfa
        </Link>
        <Link
          href="/kulupler"
          className="rounded-lg border border-white/10 px-4 py-2 text-slate-200 hover:bg-white/5"
        >
          Kulüpler
        </Link>
        <Link
          href="/asamalar"
          className="rounded-lg border border-white/10 px-4 py-2 text-slate-200 hover:bg-white/5"
        >
          Aşamalar
        </Link>
      </div>
    </Container>
  );
}
