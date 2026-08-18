import { LivingBlotter, GuideRail } from "@/components/desk/blotter-guests";
import { INSECT_KEYS } from "@/lib/pets/insects";

export function HiveDen({
  selectedKey,
  onSelect,
}: {
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return (
    <LivingBlotter
      keys={INSECT_KEYS}
      selectedKey={selectedKey}
      onSelect={onSelect}
      caption="They stay. The plaque teaches. Tap a guest — or a name — for the lesson."
    />
  );
}

export function HiveRail({
  selectedKey,
  onSelect,
}: {
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return <GuideRail keys={INSECT_KEYS} selectedKey={selectedKey} onSelect={onSelect} />;
}
