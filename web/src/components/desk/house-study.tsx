import { LivingBlotter, GuideRail } from "@/components/desk/blotter-guests";
import { HOUSE_KEYS } from "@/lib/pets/house-guide";

export function HouseStudy({
  selectedKey,
  onSelect,
}: {
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return (
    <LivingBlotter
      keys={HOUSE_KEYS}
      selectedKey={selectedKey}
      onSelect={onSelect}
      caption="They walk and stay. Tap a guest — or a name — for the plaque."
    />
  );
}

export function StudyRail({
  selectedKey,
  onSelect,
}: {
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return <GuideRail keys={HOUSE_KEYS} selectedKey={selectedKey} onSelect={onSelect} />;
}
