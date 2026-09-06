import { LivingBlotter, GuideRail } from "@/components/desk/blotter-guests";
import { CORNER_KEYS } from "@/lib/pets/corner";

export function CornerDen({
  selectedKey,
  onSelect,
}: {
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return (
    <LivingBlotter
      keys={CORNER_KEYS}
      selectedKey={selectedKey}
      onSelect={onSelect}
      caption="They walk. They sit. The plaque teaches. Tap a guest — or a name — for the lesson."
    />
  );
}

export function CornerRail({
  selectedKey,
  onSelect,
}: {
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return <GuideRail keys={CORNER_KEYS} selectedKey={selectedKey} onSelect={onSelect} />;
}
