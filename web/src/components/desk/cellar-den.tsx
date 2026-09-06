import { LivingBlotter, GuideRail } from "@/components/desk/blotter-guests";
import { FUNGI_KEYS } from "@/lib/pets/fungi";

export function CellarDen({
  selectedKey,
  onSelect,
}: {
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return (
    <LivingBlotter
      keys={FUNGI_KEYS}
      selectedKey={selectedKey}
      onSelect={onSelect}
      caption="They stay. The plaque teaches. Tap a guest — or a name — for the lesson."
    />
  );
}

export function CellarRail({
  selectedKey,
  onSelect,
}: {
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return <GuideRail keys={FUNGI_KEYS} selectedKey={selectedKey} onSelect={onSelect} />;
}
