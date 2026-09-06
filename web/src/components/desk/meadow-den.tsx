import { LivingBlotter, GuideRail } from "@/components/desk/blotter-guests";
import { MEADOW_KEYS } from "@/lib/pets/meadow";

export function MeadowDen({
  selectedKey,
  onSelect,
}: {
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return (
    <LivingBlotter
      keys={MEADOW_KEYS}
      selectedKey={selectedKey}
      onSelect={onSelect}
      caption="They walk the grass. The plaque teaches. Tap a guest — or a name — for the lesson."
    />
  );
}

export function MeadowRail({
  selectedKey,
  onSelect,
}: {
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return <GuideRail keys={MEADOW_KEYS} selectedKey={selectedKey} onSelect={onSelect} />;
}
