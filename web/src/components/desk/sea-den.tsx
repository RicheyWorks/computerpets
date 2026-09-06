import { LivingBlotter, GuideRail } from "@/components/desk/blotter-guests";
import { SEA_KEYS } from "@/lib/pets/sea";

export function SeaDen({
  selectedKey,
  onSelect,
}: {
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return (
    <LivingBlotter
      keys={SEA_KEYS}
      selectedKey={selectedKey}
      onSelect={onSelect}
      caption="They swim and stay. Tap a guest — or a name — for the plaque."
    />
  );
}

export function SeaRail({
  selectedKey,
  onSelect,
}: {
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return <GuideRail keys={SEA_KEYS} selectedKey={selectedKey} onSelect={onSelect} />;
}
