import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { guestsIn, ROOMS, type RoomId } from "@/lib/pets/rooms";
import { cn } from "@/lib/utils";

export function DenCabinet({
  currentRoom,
  currentKey,
  drawers = false,
  className,
}: {
  currentRoom?: RoomId;
  currentKey?: string;
  drawers?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState<RoomId | null>(currentRoom ?? null);
  useEffect(() => {
    setOpen(currentRoom ?? null);
  }, [currentRoom]);
  const shown = drawers ? open : null;

  return (
    <nav className={cn("den-cabinet", drawers && "den-cabinet-drawers", className)} aria-label="Rooms of the house">
      <ul className="den-cabinet-rooms">
        {ROOMS.map((room) => {
          const active = room.id === currentRoom;
          if (drawers) {
            return (
              <li key={room.id}>
                <button
                  type="button"
                  className={cn("den-cabinet-room", active && "is-here")}
                  aria-expanded={shown === room.id}
                  onClick={() => setOpen((prev) => (prev === room.id ? null : room.id))}
                >
                  {room.label}
                </button>
              </li>
            );
          }
          return (
            <li key={room.id}>
              <Link
                to={room.path}
                className={cn("den-cabinet-room", active && "is-here")}
              >
                {room.label}
              </Link>
            </li>
          );
        })}
      </ul>
      {drawers && shown ? (
        <ul className="den-cabinet-drawer">
          {guestsIn(shown).map((kind) => (
            <li key={kind.key}>
              <Link
                to="/demo/$slug"
                params={{ slug: kind.slug }}
                className={cn("den-cabinet-guest", kind.key === currentKey && "is-here")}
              >
                {kind.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </nav>
  );
}
