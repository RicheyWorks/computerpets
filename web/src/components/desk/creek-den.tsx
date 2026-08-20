import { LivingBlotter, GuideRail } from "@/components/desk/blotter-guests";
import { CREEK_KEYS } from "@/lib/pets/creek";

export function CreekDen({
  selectedKey,
  onSelect,
}: {
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return (
    <LivingBlotter
      keys={CREEK_KEYS}
      selectedKey={selectedKey}
      onSelect={onSelect}
      caption="They swim. The plaque teaches. Tap a guest — or a name — for the lesson."
    />
  );
}

export function CreekRail({
  selectedKey,
  onSelect,
}: {
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return <GuideRail keys={CREEK_KEYS} selectedKey={selectedKey} onSelect={onSelect} />;
}
