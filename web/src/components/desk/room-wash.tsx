import type { RoomId } from "@/lib/pets/rooms";

export function RoomWash({ room }: { room: RoomId }) {
  return <div className={`room-wash room-wash-${room}`} aria-hidden />;
}

export function DeskGrain() {
  return <div className="desk-grain" aria-hidden />;
}
