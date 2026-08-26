import { LivingBlotter, GuideRail } from "@/components/desk/blotter-guests";
import { GRID_KEYS } from "@/lib/pets/grid";

export function GridDen({
  selectedKey,
  onSelect,
}: {
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return (
    <LivingBlotter
      keys={GRID_KEYS}
      selectedKey={selectedKey}
      onSelect={onSelect}
      caption="Arc sits. Then she arcs. Volt coils. The plaque teaches. Tap the guest — or the name — for the lesson."
    />
  );
}

export function GridRail({
  selectedKey,
  onSelect,
}: {
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return <GuideRail keys={GRID_KEYS} selectedKey={selectedKey} onSelect={onSelect} />;
}
