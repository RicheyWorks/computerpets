import { LivingBlotter, GuideRail } from "@/components/desk/blotter-guests";
import { WOOD_KEYS } from "@/lib/pets/wood";

export function WoodDen({
  selectedKey,
  onSelect,
}: {
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return (
    <LivingBlotter
      keys={WOOD_KEYS}
      selectedKey={selectedKey}
      onSelect={onSelect}
      caption="They walk. A bat flies. An otter swims. The plaque teaches. Tap a guest — or a name — for the lesson."
    />
  );
}

export function WoodRail({
  selectedKey,
  onSelect,
}: {
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return <GuideRail keys={WOOD_KEYS} selectedKey={selectedKey} onSelect={onSelect} />;
}
