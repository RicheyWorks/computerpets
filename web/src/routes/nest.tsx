import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast, Toaster } from "sonner";
import { CompanionRoom } from "@/components/desk/companion-room";
import { PetPortrait } from "@/components/pet-card";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getSanctuary, pairNest, type CompanionView, type ClutchView } from "@/lib/pets/actions";
import { findSpecies } from "@/lib/pets/catalog";
import {
  formatDiploid,
  houseHw,
  isDihybridMark,
  lociFor,
  locusById,
  phenotypeLine,
  phenotypeOf,
  punnettDihybridMark,
  punnettMono,
  watchLocusId,
} from "@/lib/pets/genetics";
import { livingByKey, RED_PANDA_KIND } from "@/lib/pets/living";
import { canPair, duePhrase, extinctLines, fairHouse, nestPath } from "@/lib/pets/nest";

export const Route = createFileRoute("/nest")({
  component: NestPage,
  head: () => ({
    meta: [
      { title: "The nest — ComputerPets" },
      {
        name: "description",
        content: "The nest is a room. The square sits on the paper.",
      },
    ],
  }),
});

function NestPage() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [ember, setEmber] = useState<number | null>(null);
  const [pets, setPets] = useState<CompanionView[] | null>(null);
  const [departed, setDeparted] = useState<CompanionView[]>([]);
  const [clutches, setClutches] = useState<ClutchView[]>([]);
  const [seatA, setSeatA] = useState<string | null>(null);
  const [seatB, setSeatB] = useState<string | null>(null);
  const [watch, setWatch] = useState<string>("eyes");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  async function reload() {
    const d = await getSanctuary();
    setEmber(d.ember);
    setPets(d.pets);
    setDeparted(d.departed);
    setClutches(d.clutches);
  }

  useEffect(() => {
    if (!user) return;
    void reload().catch(() => {
      setEmber(0);
      setPets([]);
    });
  }, [user]);

  const a = pets?.find((p) => p.id === seatA) ?? null;
  const b = pets?.find((p) => p.id === seatB) ?? null;
  const walker = a ?? b;
  const kind = walker ? livingByKey(walker.species_key) : RED_PANDA_KIND;

  const verdict = a
    ? canPair(a.species_key, b?.species_key ?? null, {
        a: { stage: a.stage },
        b: b ? { stage: b.stage } : undefined,
      })
    : null;
  const speciesKey = a?.species_key ?? "dog";

  useEffect(() => {
    if (!a) return;
    if (b) setWatch(watchLocusId(a.genes, b.genes, a.species_key));
    else setWatch("eyes");
  }, [a, b]);

  const square = useMemo(() => {
    if (!a || !b || a.species_key !== b.species_key) return null;
    if (watch === "mark" && isDihybridMark(a.genes, b.genes)) {
      return { kind: "di" as const, di: punnettDihybridMark(a.genes, b.genes) };
    }
    const locus = locusById(watch === "mark" ? "band" : watch, speciesKey);
    if (!locus) return null;
    const mother = a.genes[locus.id];
    const father = b.genes[locus.id];
    if (!mother || !father) return null;
    return { kind: "mono" as const, locus, mono: punnettMono(locus, mother, father) };
  }, [a, b, watch, speciesKey]);

  const hw = useMemo(() => {
    if (!a) return [];
    const house = (pets ?? []).filter((p) => p.species_key === a.species_key).map((p) => p.genes);
    return houseHw(a.species_key, house);
  }, [a, pets]);

  const fair = useMemo(
    () =>
      fairHouse(
        (pets ?? []).map((p) => ({
          id: p.id,
          species_key: p.species_key,
          name: p.name,
          genotype: p.genes,
        })),
        departed.map((p) => ({
          id: p.id,
          species_key: p.species_key,
          name: p.name,
          genotype: p.genes,
          departed: true,
        })),
      ),
    [pets, departed],
  );

  const extinct = useMemo(() => {
    const once = new Set([...departed, ...(pets ?? [])].map((p) => p.species_key));
    for (const c of clutches) once.add(c.species_key);
    return extinctLines(
      once,
      (pets ?? []).map((p) => p.species_key),
      clutches.map((c) => c.species_key),
    );
  }, [pets, departed, clutches]);

  if (isPending) return <div className="h-dvh animate-pulse bg-surface" />;
  if (!user) return <RedirectToSignIn />;

  async function pair() {
    if (!a) return;
    setBusy(true);
    try {
      const result = await pairNest({
        data: { parentA: a.id, parentB: b?.id ?? null, name: name.trim() || undefined },
      });
      if (result.waiting) {
        toast.success(`${result.word} is waiting. ${duePhrase(result.due_at ?? "")}`);
      } else {
        const first = result.pets[0];
        toast.success(first ? `${first.name} · ${result.word}` : result.word);
        if (first) {
          await navigate({ to: "/pets/$key", params: { key: first.id } });
          return;
        }
      }
      setName("");
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "The nest refused.");
    } finally {
      setBusy(false);
    }
  }

  function seat(id: string) {
    const guest = pets?.find((p) => p.id === id);
    if (guest && guest.stage === "hatchling") {
      toast.message("A hatchling cannot pair. Grown and elder may.");
      return;
    }
    if (seatA === id) {
      setSeatA(seatB);
      setSeatB(null);
      return;
    }
    if (seatB === id) {
      setSeatB(null);
      return;
    }
    if (!seatA) {
      setSeatA(id);
      return;
    }
    const first = pets?.find((p) => p.id === seatA);
    const next = pets?.find((p) => p.id === id);
    if (first && next && first.species_key !== next.species_key) {
      const solo = first.species_key === "yeast" || first.species_key === "lichen" || first.species_key === "nexus";
      if (solo) {
        toast.message("This one splits, shares, or buds alone.");
        return;
      }
      toast.message("Same kind only.");
      return;
    }
    setSeatB(id);
  }

  const path = a ? nestPath(a.species_key, b ? 2 : 1) : null;
  const splitter =
    a && (a.species_key === "yeast" || a.species_key === "lichen" || a.species_key === "nexus");

  return (
    <>
      <Toaster theme="dark" position="bottom-center" />
      <CompanionRoom
        kind={kind}
        name={walker?.name}
        stage={walker?.stage}
        guestKey={walker ? `nest-${walker.id}` : "nest"}
        persistLocal={false}
        detail="Nest"
        extraMarks={[
          {
            label: busy ? "Pairing…" : path?.word ?? "Pair",
            onClick: () => void pair(),
            disabled: busy || !verdict?.ok || ember === null,
          },
        ]}
        line={
          <p className="mt-3 max-w-sm text-sm text-muted">
            The nest is a room. Two of a kind. Grown and elder may sit. A hatchling waits. Neglect can
            close a line.{" "}
            <Link to="/hatch" className="text-fg no-underline hover:text-primary">
              Or draw at the hatchery.
            </Link>
          </p>
        }
        aside={
          <div className="mt-5 max-h-[calc(100dvh-16rem)] max-w-sm space-y-3 overflow-y-auto pr-1">
            <article className="paper-card rounded-[var(--radius-lg)] border p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">Ember on hand</p>
              <p className="mt-2 font-display text-4xl tabular-nums">{ember ?? "—"}</p>
              <p className="mt-3 text-sm text-muted">
                {path ? `${path.word} · ${path.cost} ember` : "Seat two grown guests you already keep."}
              </p>
              {path ? <p className="mt-2 text-xs text-subtle">{path.plaque}</p> : null}
              {verdict && !verdict.ok ? <p className="mt-2 text-sm text-muted">{verdict.reason}</p> : null}
              <div className="mt-4 grid gap-2">
                <SeatCard pet={a} label="This one" empty="Choose a guest." />
                <SeatCard
                  pet={b}
                  label="And this one"
                  empty={splitter ? "Or leave the chair empty." : "Another of the same kind."}
                />
              </div>
              {a && (b || verdict?.ok) ? (
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={24}
                  placeholder="A house name, or leave it"
                  className="mt-3 h-10 w-full rounded-[var(--radius-sm)] border border-border bg-bg/70 px-3 text-sm text-fg outline-none focus:ring-2 focus:ring-primary/30"
                />
              ) : null}
            </article>

            {square?.kind === "mono" ? (
              <PunnettCard
                title={square.locus.label}
                rows={square.mono.rowGametes}
                cols={square.mono.colGametes}
                cells={square.mono.cells.map((row) => row.map((c) => c.label))}
                geno={square.mono.genotypeRatio}
                pheno={square.mono.phenotypeRatio}
                watch={watch}
                watches={lociFor(speciesKey)
                  .map((l) => l.id)
                  .concat(isDihybridMark(a!.genes, b!.genes) ? ["mark"] : [])}
                onWatch={setWatch}
              />
            ) : square?.kind === "di" ? (
              <PunnettCard
                title="Mark"
                rows={square.di.rowGametes}
                cols={square.di.colGametes}
                cells={square.di.cells.map((row) => row.map((c) => c.mark))}
                geno={square.di.genotypeRatio}
                pheno={square.di.phenotypeRatio}
                watch={watch}
                watches={["mark", ...lociFor(speciesKey).map((l) => l.id)]}
                onWatch={setWatch}
              />
            ) : (
              <aside className="paper-card rounded-[var(--radius-lg)] border p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">The square</p>
                <p className="mt-2 font-display text-2xl">Seat a pair.</p>
                <p className="mt-2 text-sm text-muted">
                  Then the blotter shows the cross. Recessives hide. They can come back.
                </p>
              </aside>
            )}

            {a && hw[0] ? (
              <aside className="paper-card rounded-[var(--radius-lg)] border p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">This blotter</p>
                <p className="mt-2 text-sm text-muted">{hw[0].note}</p>
                <ul className="mt-3 space-y-1 font-mono text-[11px] text-subtle">
                  {hw.slice(0, 3).map((report) => (
                    <li key={report.locus}>
                      {report.locus}
                      {Object.entries(report.freq)
                        .filter(([, v]) => v > 0)
                        .map(([k, v]) => ` · ${k} ${v.toFixed(2)}`)
                        .join("")}
                    </li>
                  ))}
                </ul>
              </aside>
            ) : null}

            {clutches.length > 0 ? (
              <aside className="paper-card rounded-[var(--radius-lg)] border p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">Waiting</p>
                <ul className="mt-2 space-y-2">
                  {clutches.map((c) => {
                    const species = findSpecies(c.species_key);
                    return (
                      <li key={c.id} className="text-sm text-muted">
                        A wait. {c.count} {c.verb}
                        {species ? ` of ${species.displayName}` : ""}. {duePhrase(c.due_at)}.
                      </li>
                    );
                  })}
                </ul>
              </aside>
            ) : null}

            {extinct.length > 0 ? (
              <p className="text-sm text-muted">{extinct.map((e) => e.line).join(" ")}</p>
            ) : null}

            <aside className="paper-card rounded-[var(--radius-lg)] border p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">The house</p>
              {pets === null ? (
                <div className="mt-3 h-16 animate-pulse rounded-[var(--radius-sm)] bg-bg/50" />
              ) : pets.length === 0 ? (
                <p className="mt-2 text-sm text-muted">No one to pair. Hatch first.</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {pets.map((pet) => {
                    const selected = pet.id === seatA || pet.id === seatB;
                    const pheno = phenotypeLine(phenotypeOf(pet.genes, pet.species_key));
                    return (
                      <li key={pet.id}>
                        <button
                          type="button"
                          onClick={() => seat(pet.id)}
                          className={`flex w-full items-center gap-3 rounded-[var(--radius-sm)] border px-2 py-2 text-left ${
                            selected ? "border-border-strong bg-bg/70" : "border-border bg-bg/40 hover:border-border-strong"
                          }`}
                        >
                          <div className="size-10 overflow-hidden rounded-[var(--radius-sm)] bg-bg/70">
                            <PetPortrait speciesKey={pet.species_key} alt={pet.name} />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-display text-base leading-tight">{pet.name}</p>
                            <p className="truncate text-xs text-muted">
                              {pet.stage} · {pheno}
                            </p>
                            <p className="font-mono text-[10px] text-subtle">
                              {formatDiploid(pet.genes.eyes ?? ["A", "A"])} · {formatDiploid(pet.genes.band ?? ["B", "B"])}
                              {formatDiploid(pet.genes.mask ?? ["m", "m"])} · {formatDiploid(pet.genes.aura ?? ["s", "s"])}
                            </p>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </aside>

            <aside className="paper-card rounded-[var(--radius-lg)] border p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">The rail</p>
              <p className="mt-2 font-display text-2xl">What this house has shown.</p>
              <p className="mt-2 text-sm text-muted">
                Same species, every look the nest has thrown. Ghosts are still in the catalog draw.
              </p>
              {fair.length === 0 ? (
                <p className="mt-3 text-sm text-muted">The kennel is empty. The hatchery can still bring a bird.</p>
              ) : (
                <div className="mt-3 space-y-4">
                  {fair.map((row) => (
                    <article key={row.key}>
                      <h3 className="font-display text-xl">{row.name}</h3>
                      <ul className="mt-2 flex flex-wrap gap-1.5">
                        {row.held.map((h) => (
                          <li
                            key={h.look}
                            className="rounded-[var(--radius-sm)] border border-border bg-bg/50 px-2 py-0.5 text-[11px] text-fg"
                          >
                            {h.look}
                            {h.count > 1 ? ` · ${h.count}` : ""}
                          </li>
                        ))}
                        {row.ghosts.map((g) => (
                          <li
                            key={g}
                            className="rounded-[var(--radius-sm)] border border-dashed border-border px-2 py-0.5 text-[11px] text-subtle"
                          >
                            {g}
                          </li>
                        ))}
                      </ul>
                      {row.ribbons.map((r) => (
                        <p key={r.kind} className="mt-2 text-sm text-muted">
                          {r.line}
                        </p>
                      ))}
                    </article>
                  ))}
                </div>
              )}
            </aside>
          </div>
        }
        footer={
          <p>
            <Link to="/hatch" className="text-fg no-underline hover:text-primary">
              The hatchery
            </Link>
            {" · "}
            <Link to="/collection" className="text-muted no-underline hover:text-fg">
              The kennel
            </Link>
            {" · "}
            <Link to="/catalog" className="text-muted no-underline hover:text-fg">
              The shelf
            </Link>
            {" · "}
            <Link to="/meet" className="text-muted no-underline hover:text-fg">
              The house
            </Link>
          </p>
        }
      />
    </>
  );
}

function SeatCard({
  pet,
  label,
  empty,
}: {
  pet: CompanionView | null;
  label: string;
  empty: string;
}) {
  return (
    <div className="rounded-[var(--radius-sm)] border border-border bg-bg/40 p-3">
      <p className="text-[11px] uppercase tracking-[0.14em] text-subtle">{label}</p>
      {pet ? (
        <>
          <p className="mt-2 font-display text-xl leading-none">{pet.name}</p>
          <p className="mt-1 text-xs text-muted">
            {pet.stage} · {phenotypeLine(phenotypeOf(pet.genes, pet.species_key))}
          </p>
        </>
      ) : (
        <p className="mt-2 text-sm text-muted">{empty}</p>
      )}
    </div>
  );
}

function PunnettCard({
  title,
  rows,
  cols,
  cells,
  geno,
  pheno,
  watch,
  watches,
  onWatch,
}: {
  title: string;
  rows: string[];
  cols: string[];
  cells: string[][];
  geno: string;
  pheno: string;
  watch: string;
  watches: string[];
  onWatch: (id: string) => void;
}) {
  const unique = [...new Set(watches)];
  return (
    <aside className="paper-card rounded-[var(--radius-lg)] border p-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">The square</p>
          <p className="mt-1 font-display text-2xl">{title}</p>
        </div>
        <div className="flex flex-wrap gap-1">
          {unique.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => onWatch(id)}
              className={`rounded-[var(--radius-sm)] px-2 py-1 text-[11px] uppercase tracking-[0.12em] ${
                watch === id ? "bg-bg/70 text-fg" : "text-subtle hover:text-fg"
              }`}
            >
              {id}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse text-center font-mono text-[11px]">
          <thead>
            <tr>
              <th className="p-1 text-subtle" />
              {cols.map((c, i) => (
                <th key={`${c}-${i}`} className="p-1 text-subtle">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cells.map((row, i) => (
              <tr key={`r-${i}`}>
                <th className="p-1 text-subtle">{rows[i]}</th>
                {row.map((cell, j) => (
                  <td key={`${i}-${j}`} className="border border-border bg-bg/50 p-2 text-fg">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-muted">{geno}</p>
      <p className="text-sm text-muted">{pheno}</p>
    </aside>
  );
}
