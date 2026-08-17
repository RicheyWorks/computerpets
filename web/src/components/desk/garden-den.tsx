import { LivingBlotter, GuideRail } from "@/components/desk/blotter-guests";
import { GARDEN_KEYS } from "@/lib/pets/garden";

export function GardenDen({
  selectedKey,
  onSelect,
}: {
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return (
    <LivingBlotter
      keys={GARDEN_KEYS}
      selectedKey={selectedKey}
      onSelect={onSelect}
      caption="They sit and grow. Tap a guest — or a name — for the plaque."
    />
  );
}

export function GardenRail({
  selectedKey,
  onSelect,
}: {
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return <GuideRail keys={GARDEN_KEYS} selectedKey={selectedKey} onSelect={onSelect} />;
}
