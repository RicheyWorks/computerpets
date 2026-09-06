import { LivingBlotter, GuideRail } from "@/components/desk/blotter-guests";
import { SNAKE_KEYS } from "@/lib/pets/snakes";

export function SnakeDen({
  selectedKey,
  onSelect,
}: {
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return (
    <LivingBlotter
      keys={SNAKE_KEYS}
      selectedKey={selectedKey}
      onSelect={onSelect}
      caption="They crawl and stay. Tap a snake — or a name — for the plaque."
    />
  );
}

export function SnakeRail({
  selectedKey,
  onSelect,
}: {
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return <GuideRail keys={SNAKE_KEYS} selectedKey={selectedKey} onSelect={onSelect} />;
}
