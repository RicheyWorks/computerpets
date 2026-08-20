import { LivingBlotter, GuideRail } from "@/components/desk/blotter-guests";
import { CANOPY_KEYS } from "@/lib/pets/canopy";

export function CanopyDen({
  selectedKey,
  onSelect,
}: {
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return (
    <LivingBlotter
      keys={CANOPY_KEYS}
      selectedKey={selectedKey}
      onSelect={onSelect}
      caption="They hang. They glide. They howl. They keep still. The plaque teaches. Tap a guest — or a name — for the lesson."
    />
  );
}

export function CanopyRail({
  selectedKey,
  onSelect,
}: {
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return <GuideRail keys={CANOPY_KEYS} selectedKey={selectedKey} onSelect={onSelect} />;
}
