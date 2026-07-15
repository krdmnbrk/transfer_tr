import { Clock } from "lucide-react";
import { formatDateTime } from "@/lib/datetime";

// Statik sitede göreli zaman fosilleşir; bu yüzden mutlak TSİ damgası basılır.
export function LastUpdated({ iso }: { iso: string }) {
  return (
    <p className="flex items-center gap-1.5 text-xs text-slate-400">
      <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
      Veriler en son <span className="text-slate-300">{formatDateTime(iso)}</span>
      <span className="text-slate-500">(TSİ)&apos;de yenilendi · ~5 dakikada bir otomatik güncellenir</span>
    </p>
  );
}
