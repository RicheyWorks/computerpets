import { LivingBlotter, GuideRail } from "@/components/desk/blotter-guests";
import { FAR_KEYS } from "@/lib/pets/far";

export function FarDen({
  selectedKey,
  onSelect,
}: {
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return (
    <LivingBlotter
      keys={FAR_KEYS}
      selectedKey={selectedKey}
      onSelect={onSelect}
      caption="They arrived. They stay. The plaque teaches. Tap a guest — or a name — for the lesson."
    />
  );
}

export function FarRail({
  selectedKey,
  onSelect,
}: {
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return <GuideRail keys={FAR_KEYS} selectedKey={selectedKey} onSelect={onSelect} />;
}
