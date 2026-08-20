import { LivingBlotter, GuideRail } from "@/components/desk/blotter-guests";
import { WELL_KEYS } from "@/lib/pets/well";

export function WellDen({
  selectedKey,
  onSelect,
}: {
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return (
    <LivingBlotter
      keys={WELL_KEYS}
      selectedKey={selectedKey}
      onSelect={onSelect}
      caption="A drop you look into. The plaque teaches. Tap a guest — or a name — for the lesson."
    />
  );
}

export function WellRail({
  selectedKey,
  onSelect,
}: {
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return <GuideRail keys={WELL_KEYS} selectedKey={selectedKey} onSelect={onSelect} />;
}
