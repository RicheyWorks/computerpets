import { createFileRoute, Link } from "@tanstack/react-router";
import { CompanionRoom } from "@/components/desk/companion-room";
import { SpeciesCard } from "@/components/pet-card";
import { findSpecies } from "@/lib/pets/catalog";
import { RED_PANDA_KIND } from "@/lib/pets/living";
import { guestsIn, ROOMS } from "@/lib/pets/rooms";

export const Route = createFileRoute("/catalog")({
  component: Catalog,
  head: () => ({
    meta: [
      { title: "The shelf — ComputerPets" },
      {
        name: "description",
        content: "The shelf is a room. The ninety sit by den, not by rarity.",
      },
    ],
  }),
});

function Catalog() {
  return (
    <CompanionRoom
      kind={RED_PANDA_KIND}
      guestKey="shelf"
      persistLocal={false}
      detail="Shelf"
      line={
        <p className="mt-3 max-w-sm text-sm text-muted">
          The shelf is a room. The ninety sit by den, not by rarity. Open a room, or pick a name.
        </p>
      }
      aside={
        <div className="mt-5 max-h-[calc(100dvh-16rem)] max-w-sm space-y-3 overflow-y-auto pr-1">
          <aside className="paper-card rounded-[var(--radius-lg)] border p-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">Shelf</p>
            <h2 className="mt-1 font-display text-2xl">The ninety.</h2>
            <p className="mt-2 text-sm text-muted">
              Ninety guests, on their shelves. By den, not by rarity. They will be walking when the page opens.
            </p>
          </aside>

          {ROOMS.map((room) => (
            <aside key={room.id} className="paper-card rounded-[var(--radius-lg)] border p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">{room.kicker}</p>
              <h2 className="mt-1 font-display text-2xl">{room.label}</h2>
              <p className="mt-1 text-sm text-muted">{room.line}</p>
              <p className="mt-2">
                <Link to={room.path} className="text-sm text-fg no-underline hover:text-primary">
                  Open the room
                </Link>
              </p>
              <ul className="mt-3 space-y-3">
                {guestsIn(room).map((kind) => {
                  const species = findSpecies(kind.key);
                  return (
                    <li key={kind.key}>
                      <SpeciesCard
                        speciesKey={kind.key}
                        name={kind.name}
                        rarity={species?.rarity ?? "COMMON"}
                        blurb={kind.tagline}
                        to={`/demo/${kind.slug}`}
                      />
                    </li>
                  );
                })}
              </ul>
            </aside>
          ))}
        </div>
      }
      footer={
        <p>
          <Link to="/meet" className="text-fg no-underline hover:text-primary">
            The house
          </Link>
          {" · "}
          <Link to="/study" className="text-muted no-underline hover:text-fg">
            The study
          </Link>
          {" · "}
          <Link to="/snakes" className="text-muted no-underline hover:text-fg">
            The den
          </Link>
          {" · "}
          <Link to="/far" className="text-muted no-underline hover:text-fg">
            The far den
          </Link>
          {" · "}
          <Link to="/collection" className="text-muted no-underline hover:text-fg">
            The kennel
          </Link>
        </p>
      }
    />
  );
}
