import { LivingBlotter, GuideRail } from "@/components/desk/blotter-guests";
import { BEE_KEYS } from "@/lib/pets/bees";
import { INSECT_KEYS } from "@/lib/pets/insects";

const HIVE_KEYS = [...INSECT_KEYS, ...BEE_KEYS];

export function HiveDen({
  selectedKey,
  onSelect,
}: {
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return (
    <LivingBlotter
      keys={HIVE_KEYS}
      selectedKey={selectedKey}
      onSelect={onSelect}
      caption="The bees walk. The comb sits. The plaque teaches. Tap a guest — or a name — for the lesson."
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
  return <GuideRail keys={HIVE_KEYS} selectedKey={selectedKey} onSelect={onSelect} />;
}
