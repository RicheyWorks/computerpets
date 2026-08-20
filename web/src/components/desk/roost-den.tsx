import { LivingBlotter, GuideRail } from "@/components/desk/blotter-guests";
import { ROOST_KEYS } from "@/lib/pets/roost";

export function RoostDen({
  selectedKey,
  onSelect,
}: {
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return (
    <LivingBlotter
      keys={ROOST_KEYS}
      selectedKey={selectedKey}
      onSelect={onSelect}
      caption="They fly. They hop. The plaque teaches. Tap a guest — or a name — for the lesson."
    />
  );
}

export function RoostRail({
  selectedKey,
  onSelect,
}: {
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return <GuideRail keys={ROOST_KEYS} selectedKey={selectedKey} onSelect={onSelect} />;
}
