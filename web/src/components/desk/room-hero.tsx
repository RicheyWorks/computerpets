import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { DayWash } from "@/components/desk/blotter";
import { DenCabinet } from "@/components/desk/den-cabinet";
import { DeskGrain, RoomWash } from "@/components/desk/room-wash";
import { roomById, type RoomId } from "@/lib/pets/rooms";

export function RoomHero({
  room,
  headline,
  line,
}: {
  room: RoomId;
  headline: string;
  line: string;
}) {
  const def = roomById(room);

  return (
    <section className="relative isolate min-h-[62dvh] overflow-hidden">
      <img
        src="/habitat.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[center_62%]"
      />
      <DayWash />
      <RoomWash room={room} />
      <DeskGrain />
      <div className="absolute inset-0 bg-gradient-to-t from-bg/70 via-bg/15 to-transparent" />
      <div className="relative mx-auto flex min-h-[62dvh] max-w-5xl flex-col justify-end px-5 pb-12 pt-28 sm:px-8">
        <p className="text-[11px] uppercase tracking-[0.22em] text-subtle">{def.kicker}</p>
        <h1 className="mt-3 max-w-2xl font-display text-5xl leading-[0.95] sm:text-7xl">{headline}</h1>
        <p className="mt-5 max-w-lg text-base text-muted sm:text-lg">{line}</p>
        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
          <Button asChild>
            <Link to="/demo/$slug" params={{ slug: def.watchSlug }}>
              Watch {def.watchName}
            </Link>
          </Button>
          <Link to="/meet" className="text-sm text-muted no-underline hover:text-fg">
            The house
          </Link>
        </div>
        <DenCabinet currentRoom={room} className="mt-8" />
      </div>
    </section>
  );
}
