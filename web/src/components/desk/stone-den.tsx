import { LivingBlotter, GuideRail } from "@/components/desk/blotter-guests";
import { STONE_KEYS } from "@/lib/pets/stone";

export function StoneDen({
  selectedKey,
  onSelect,
}: {
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return (
    <LivingBlotter
      keys={STONE_KEYS}
      selectedKey={selectedKey}
      onSelect={onSelect}
      caption="A gecko climbs. A chameleon walks slow. An alligator sits the bank. A tuatara is still. The plaque teaches. Tap a guest — or a name — for the lesson."
    />
  );
}

export function StoneRail({
  selectedKey,
  onSelect,
}: {
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return <GuideRail keys={STONE_KEYS} selectedKey={selectedKey} onSelect={onSelect} />;
}
