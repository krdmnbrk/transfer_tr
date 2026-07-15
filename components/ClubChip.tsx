import Link from "next/link";
import type { Club } from "@/lib/domain/types";

export function ClubChip({ club }: { club: Club }) {
  return (
    <Link
      href={`/kulupler/${club.id}`}
      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-semibold text-slate-200 transition-colors hover:border-white/25 hover:bg-white/10"
    >
      <span
        className="h-2 w-2 shrink-0 rounded-full ring-1 ring-white/20"
        style={{ backgroundColor: club.colors.primary }}
        aria-hidden
      />
      {club.name}
    </Link>
  );
}
