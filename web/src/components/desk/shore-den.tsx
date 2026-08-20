import { LivingBlotter, GuideRail } from "@/components/desk/blotter-guests";
import { SHORE_KEYS } from "@/lib/pets/shore";

export function ShoreDen({
  selectedKey,
  onSelect,
}: {
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return (
    <LivingBlotter
      keys={SHORE_KEYS}
      selectedKey={selectedKey}
      onSelect={onSelect}
      caption="They walk the strand. The plaque teaches. Tap a guest — or a name — for the lesson."
    />
  );
}

export function ShoreRail({
  selectedKey,
  onSelect,
}: {
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return <GuideRail keys={SHORE_KEYS} selectedKey={selectedKey} onSelect={onSelect} />;
}
