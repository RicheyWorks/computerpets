import { LivingBlotter, GuideRail } from "@/components/desk/blotter-guests";
import { REEF_KEYS } from "@/lib/pets/reef";

export function ReefDen({
  selectedKey,
  onSelect,
}: {
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return (
    <LivingBlotter
      keys={REEF_KEYS}
      selectedKey={selectedKey}
      onSelect={onSelect}
      caption="They walk the living rock. The plaque teaches. Tap a guest — or a name — for the lesson."
    />
  );
}

export function ReefRail({
  selectedKey,
  onSelect,
}: {
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return <GuideRail keys={REEF_KEYS} selectedKey={selectedKey} onSelect={onSelect} />;
}
