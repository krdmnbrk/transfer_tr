import type { TransferStage } from "@/lib/domain/types";
import { stageLabel } from "@/lib/i18n";
import { Pill } from "@/components/ui";

const TONES: Record<
  TransferStage,
  "emerald" | "violet" | "red" | "blue" | "amber" | "slate"
> = {
  imza: "emerald",
  kiralik: "violet",
  ayrilik: "red",
  anlasma: "blue",
  gorusme: "amber",
  soylenti: "slate",
};

export function StageBadge({ stage }: { stage: TransferStage }) {
  return <Pill tone={TONES[stage]}>{stageLabel(stage)}</Pill>;
}
