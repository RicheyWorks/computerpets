import { Link } from "@tanstack/react-router";
import { CompanionRoom } from "@/components/desk/companion-room";
import { DESK_TEND, type CareStats, type SanctuaryCare } from "@/lib/pets/care";
import type { LivingKind } from "@/lib/pets/living";
import { roomOf } from "@/lib/pets/rooms";

export function DeskStage({
  kind,
  name,
  onCare,
  onSelectKind,
}: {
  kind: LivingKind;
  name?: string;
  onCare?: (action: SanctuaryCare) => Promise<CareStats | void>;
  onSelectKind?: (key: string) => void;
}) {
  const room = roomOf(kind.key);
  return (
    <CompanionRoom
      kind={kind}
      name={name}
      onCare={onCare}
      onSelectKind={onSelectKind}
      typedTalk
      journal
      extraCare={[...DESK_TEND]}
      footer={
        <p>
          <Link to="/meet" className="text-fg no-underline hover:text-primary">
            The house
          </Link>
          {" · "}
          <Link to={room.path} className="text-muted no-underline hover:text-fg">
            {room.kicker}
          </Link>
          {" · "}
          <Link to="/live" search={{ pet: kind.key }} className="text-muted no-underline hover:text-fg">
            Phone
          </Link>
        </p>
      }
    />
  );
}
