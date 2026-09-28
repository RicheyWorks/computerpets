import { useEffect, useId, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast, Toaster } from "sonner";
import { CompanionRoom } from "@/components/desk/companion-room";
import { DayWash } from "@/components/desk/blotter";
import { DeskGrain, RoomWash } from "@/components/desk/room-wash";
import { PetPortrait } from "@/components/pet-card";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  careForPet,
  getSanctuary,
  releasePet,
  renamePet,
  setActivePet,
  type CompanionView,
} from "@/lib/pets/actions";
import { findSpecies } from "@/lib/pets/catalog";
import { pageTitle, petTitle, useDocumentTitle } from "@/lib/page-title";
import { moodWord, normalizeCare, type SanctuaryCare } from "@/lib/pets/care";
import { livingByKey, saveActiveKindKey } from "@/lib/pets/living";
import { departLine, originPhrase } from "@/lib/pets/nest";
import { roomOf } from "@/lib/pets/rooms";
import { RETRY_LABEL, petNotSaved, plainMessage, roomReportsCare, type PetNotSavedAct } from "@/lib/plain-error";

export const Route = createFileRoute("/pets/$key")({
  component: PetDetail,
  head: () => ({ meta: [{ title: pageTitle("Your pet") }] }),
});

function PetDetail() {
  const { key } = Route.useParams();
  const { user, isPending } = useCurrentUserState();
  const [pet, setPet] = useState<CompanionView | null | undefined>(undefined);
  const [house, setHouse] = useState<CompanionView[]>([]);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [loadProblem, setLoadProblem] = useState<string | null>(null);
  /** A rename or let-go the house could not save: one plain line with Try again, never a silent no-op. */
  const [petProblem, setPetProblem] = useState<{ act: PetNotSavedAct; line: string } | null>(null);
  const problemId = useId();

  useEffect(() => {
    if (!user) return;
    void getSanctuary()
      .then((d) => {
        const all = [...d.pets, ...d.departed];
        const found = all.find((p) => p.id === key) ?? null;
        setHouse(all);
        setLoadProblem(null);
        setPet(found);
        setName(found?.name ?? "");
      })
      .catch((err) => {
        // A failed load is not "missing": say the kennel did not open, in plain words.
        setLoadProblem(plainMessage(err, "Couldn't open your kennel just now. Try again in a moment."));
        setPet(null);
      });
  }, [user, key]);

  // "Mochi the Red Panda — ComputerPets" once the kennel says who this is.
  useDocumentTitle(pet ? petTitle(pet.name, findSpecies(pet.species_key)?.displayName ?? livingByKey(pet.species_key).speciesLabel) : null);

  if (isPending) return <div className="h-dvh animate-pulse bg-surface" />;
  if (!user) return <RedirectToSignIn />;
  if (pet === undefined) return <div className="h-dvh animate-pulse bg-surface" />;
  if (!pet) {
    return (
      <main className="mx-auto max-w-lg space-y-3 px-6 py-20">
        <h1 className="font-display text-3xl">
          {loadProblem ? "Couldn't open your kennel." : "This pet is not in your kennel."}
        </h1>
        {loadProblem ? <p className="text-sm text-muted">{loadProblem}</p> : null}
        <Link to="/collection" data-back-kennel className="inline-flex min-h-11 items-center text-sm text-primary">
          Back to kennel
        </Link>
      </main>
    );
  }

  const gone = pet.departed;
  const petId = pet.id;
  const kind = livingByKey(pet.species_key);
  const phrase = originPhrase(pet, house);
  const species = findSpecies(pet.species_key);

  function rename(petId: string, next: string) {
    setPetProblem(null);
    setBusy(true);
    void renamePet({ data: { petId, name: next } })
      .then(() => {
        setPet((was) => (was ? { ...was, name: next } : was));
        toast.success("Name sealed");
      })
      .catch((err) => setPetProblem({ act: "rename", line: petNotSaved("rename", err) }))
      .finally(() => setBusy(false));
  }

  function release(petId: string) {
    if (!window.confirm("Let this one go? The line may end here.")) return;
    setPetProblem(null);
    setBusy(true);
    void releasePet({ data: { petId } })
      .then(() => {
        toast.success("Gone from this house.");
        setPet(null);
      })
      .catch((err) => setPetProblem({ act: "release", line: petNotSaved("release", err) }))
      .finally(() => setBusy(false));
  }

  /** The plain line plus Try again; `inline` renders a block span for use inside another paragraph. */
  function problemLine(act: PetNotSavedAct, retry: () => void, inline = false) {
    if (petProblem?.act !== act) return null;
    const id = `${problemId}-${act}`;
    const Line = inline ? "span" : "p";
    return (
      <Line role="status" aria-live="polite" data-pet-problem={act} className={`${inline ? "mt-2 block normal-case tracking-normal " : ""}text-sm text-muted`}>
        <span id={id}>{petProblem.line}</span>{" "}
        <button
          type="button"
          disabled={busy}
          aria-describedby={id}
          onClick={retry}
          className="text-fg underline underline-offset-2 hover:text-primary disabled:opacity-40"
        >
          {RETRY_LABEL}
        </button>
      </Line>
    );
  }

  async function persistCare(action: SanctuaryCare) {
    try {
      const next = await careForPet({ data: { petId, action } });
      setPet(next);
      if (next.note) toast.message(next.note);
      return normalizeCare(next);
    } catch (err) {
      // Feed, play, rest, clean, and medicine: the room says it plainly with Try again, so no second toast.
      if (!roomReportsCare(action)) toast.error(plainMessage(err, "Care failed."));
      try {
        const d = await getSanctuary();
        const all = [...d.pets, ...d.departed];
        setHouse(all);
        setPet(all.find((p) => p.id === petId) ?? null);
      } catch {
        /* keep the thrown care error */
      }
      throw err;
    }
  }

  if (gone) {
    return (
      <section className="relative isolate h-dvh min-h-[520px] w-full overflow-hidden bg-elevated">
        <Toaster theme="dark" position="bottom-center" />
        <img
          src="/habitat.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_72%]"
        />
        <DayWash />
        <RoomWash room={roomOf(pet.species_key).id} />
        <DeskGrain />
        <article className="paper-card absolute left-1/2 top-1/2 z-20 w-[min(100%-2rem,22rem)] -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-lg)] border p-6">
          <p className="text-[11px] uppercase tracking-[0.2em] text-subtle">A quiet end</p>
          <div className="mt-4 aspect-[4/5] overflow-hidden rounded-[var(--radius-md)] border border-border">
            <PetPortrait speciesKey={pet.species_key} alt={pet.name} />
          </div>
          <h1 className="mt-4 font-display text-4xl leading-none">{pet.name}</h1>
          <p className="mt-3 text-sm text-muted">{pet.farewell ?? departLine(pet.name, pet.species_key)}</p>
          <p className="mt-4">
            <Link to="/collection" className="text-sm text-fg no-underline hover:text-primary">
              Back to kennel
            </Link>
          </p>
        </article>
      </section>
    );
  }

  return (
    <>
      <Toaster theme="dark" position="bottom-center" />
      <CompanionRoom
        kind={kind}
        name={pet.name}
        stage={pet.stage}
        guestKey={pet.id}
        persistLocal={false}
        seed={normalizeCare(pet)}
        onCare={persistCare}
        detail={`${pet.stage} · ${moodWord(pet)} · Health ${pet.health}`}
        extraCare={[
          { label: "Rest", action: "rest" },
          { label: "Clean", action: "clean" },
          { label: "Medicine", action: "medicine" },
        ]}
        line={
          <p className="mt-3 max-w-sm text-sm text-muted">
            <PedigreeLead phrase={phrase} /> They wear {phrase.wear}.
          </p>
        }
        aside={
          <div className="mt-5 max-w-sm space-y-3">
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                rename(pet.id, name);
              }}
            >
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={24}
                aria-label="Name"
                className="h-10 min-w-0 flex-1 rounded-[var(--radius-sm)] border border-border bg-bg/80 px-3 text-sm text-fg outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button
                type="submit"
                disabled={busy}
                className="blotter-ink text-[11px] uppercase tracking-[0.16em]"
              >
                Rename
              </button>
            </form>
            {problemLine("rename", () => rename(pet.id, name))}
            <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">
              {species?.displayName ?? pet.species_key}
              {pet.is_active ? " · On desk" : ""}
            </p>
          </div>
        }
        footer={
          <p>
            <Link to="/collection" className="text-fg no-underline hover:text-primary">
              The kennel
            </Link>
            {" · "}
            <Link to="/nest" className="text-muted no-underline hover:text-fg">
              Pair at the nest
            </Link>
            {" · "}
            <Link
              to="/"
              search={{ pet: kind.key }}
              onClick={() => {
                saveActiveKindKey(kind.key);
                // The desk reads the local pick either way; a failed server save is logged, not thrown.
                if (!pet.is_active) void setActivePet({ data: { petId: pet.id } }).catch((err) => plainMessage(err));
              }}
              className="text-muted no-underline hover:text-fg"
            >
              Open the desk
            </Link>
            {" · "}
            <Link to="/meet" className="text-muted no-underline hover:text-fg">
              The house
            </Link>
            {" · "}
            <button
              type="button"
              disabled={busy}
              className="text-muted uppercase tracking-[0.16em] hover:text-fg"
              onClick={() => release(petId)}
            >
              Let go
            </button>
            {problemLine("release", () => release(petId), true)}
          </p>
        }
      />
    </>
  );
}

function PedigreeLead({ phrase }: { phrase: ReturnType<typeof originPhrase> }) {
  if (phrase.kind === "hatch" || phrase.parents.length === 0) {
    return <>{phrase.lead}.</>;
  }
  return (
    <>
      Of{" "}
      {phrase.parents.map((parent, i) => (
        <span key={parent.id}>
          {i > 0 ? " and " : null}
          {parent.inHouse ? (
            <Link
              to="/pets/$key"
              params={{ key: parent.id }}
              className="text-fg no-underline hover:text-primary"
            >
              {parent.name}
            </Link>
          ) : (
            parent.name
          )}
        </span>
      ))}
      .
    </>
  );
}
