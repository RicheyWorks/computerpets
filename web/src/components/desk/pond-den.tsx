import { LivingBlotter, GuideRail } from "@/components/desk/blotter-guests";
import { POND_KEYS } from "@/lib/pets/pond";

export function PondDen({
  selectedKey,
  onSelect,
}: {
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return (
    <LivingBlotter
      keys={POND_KEYS}
      selectedKey={selectedKey}
      onSelect={onSelect}
      caption="They walk. They swim. The plaque teaches. Tap a guest — or a name — for the lesson."
    />
  );
}

export function PondRail({
  selectedKey,
  onSelect,
}: {
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return <GuideRail keys={POND_KEYS} selectedKey={selectedKey} onSelect={onSelect} />;
}
