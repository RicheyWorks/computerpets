import { LivingBlotter, GuideRail } from "@/components/desk/blotter-guests";
import { LOG_KEYS } from "@/lib/pets/log";

export function LogDen({
  selectedKey,
  onSelect,
}: {
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return (
    <LivingBlotter
      keys={LOG_KEYS}
      selectedKey={selectedKey}
      onSelect={onSelect}
      caption="They walk. They hunt. They roll. The plaque teaches. Tap a guest — or a name — for the lesson."
    />
  );
}

export function LogRail({
  selectedKey,
  onSelect,
}: {
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return <GuideRail keys={LOG_KEYS} selectedKey={selectedKey} onSelect={onSelect} />;
}
