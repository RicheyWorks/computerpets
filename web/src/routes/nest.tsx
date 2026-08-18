import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";
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
import { canPair, extinctLines, fairHouse, nestPath } from "@/lib/pets/nest";

export const Route = createFileRoute("/nest")({
  component: NestPage,
  head: () => ({
    meta: [
      { title: "The nest — ComputerPets" },
      {
        name: "description",
        content: "Two of a kind. A square. A clutch. A line, or not.",
      },
    ],
  }),
});

function NestPage() {
  const { user, isPending } = useCurrentUserState();
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

  if (isPending) return <div className="h-64 animate-pulse rounded-[var(--radius-xl)] bg-surface" />;
  if (!user) return <RedirectToSignIn />;

  async function pair() {
    if (!a) return;
    setBusy(true);
    try {
      const result = await pairNest({
        data: { parentA: a.id, parentB: b?.id ?? null, name: name.trim() || undefined },
      });
      if (result.waiting) {
        toast.success(`${result.word} is waiting · ${result.plaque}`);
      } else {
        const first = result.pets[0];
        toast.success(first ? `${first.name} · ${result.word}` : result.word);
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

  return (
    <main className="space-y-10">
      <Toaster theme="dark" position="bottom-center" />
      <header className="max-w-xl space-y-3">
        <p className="text-[11px] uppercase tracking-[0.2em] text-subtle">The nest</p>
        <h1 className="font-display text-4xl">Two of a kind.</h1>
        <p className="text-sm text-muted">
          A square on the blotter. A clutch, or a rise. Grown and elder may sit.
          A hatchling waits. Neglect can close a line. The nest still keeps one.
        </p>
        <p className="flex flex-wrap gap-4 text-sm">
          <Link to="/hatch" className="text-fg">
            The hatchery
          </Link>
          <Link to="/collection" className="text-fg">
            The kennel
          </Link>
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="space-y-5 rounded-[var(--radius-xl)] border border-border bg-surface p-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs text-subtle">Ember on hand</p>
              <p className="font-display text-5xl tabular-nums">{ember ?? "—"}</p>
            </div>
            <p className="max-w-[12rem] text-right text-xs text-muted">
              {path ? `${path.word} · ${path.cost} ember` : "Seat two grown guests you already keep."}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <SeatCard pet={a} label="This one" empty="Choose a guest." />
            <SeatCard
              pet={b}
              label="And this one"
              empty={
                a && (a.species_key === "yeast" || a.species_key === "lichen" || a.species_key === "nexus")
                  ? "Or leave the chair empty."
                  : "Another of the same kind."
              }
            />
          </div>

          {path ? <p className="text-sm text-muted">{path.plaque}</p> : null}

          {verdict && !verdict.ok ? <p className="text-sm text-muted">{verdict.reason}</p> : null}

          {a && (b || verdict?.ok) ? (
            <form
              className="flex flex-col gap-2 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                void pair();
              }}
            >
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={24}
                placeholder="A house name, or leave it"
                className="h-11 flex-1 rounded-[var(--radius-sm)] border border-border bg-elevated px-3 text-sm text-fg outline-none focus:ring-2 focus:ring-primary/30"
              />
              <Button type="submit" disabled={busy || !verdict?.ok || ember === null}>
                {busy ? "Pairing…" : path?.word ?? "Pair"}
              </Button>
            </form>
          ) : null}
        </div>

        <div className="space-y-4">
          {square?.kind === "mono" ? (
            <PunnettCard
              title={square.locus.label}
              rows={square.mono.rowGametes}
              cols={square.mono.colGametes}
              cells={square.mono.cells.map((row) => row.map((c) => c.label))}
              geno={square.mono.genotypeRatio}
              pheno={square.mono.phenotypeRatio}
              watch={watch}
              watches={lociFor(speciesKey).map((l) => l.id).concat(isDihybridMark(a!.genes, b!.genes) ? ["mark"] : [])}
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
            <aside className="rounded-[var(--radius-xl)] border border-border bg-surface p-6">
              <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">The square</p>
              <p className="mt-2 font-display text-2xl">Seat a pair.</p>
              <p className="mt-2 text-sm text-muted">
                Then the blotter shows the cross. Recessives hide. They can come back.
              </p>
            </aside>
          )}

          {a && hw[0] ? (
            <aside className="rounded-[var(--radius-xl)] border border-border bg-surface p-5">
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
        </div>
      </section>

      {clutches.length > 0 ? (
        <section className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">Waiting</p>
          <ul className="space-y-2">
            {clutches.map((c) => {
              const species = findSpecies(c.species_key);
              return (
                <li key={c.id} className="rounded-[var(--radius-lg)] border border-border bg-surface px-4 py-3 text-sm text-muted">
                  {c.count} {c.verb}
                  {species ? ` of ${species.displayName}` : ""} · due {new Date(c.due_at).toLocaleString()}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {extinct.length > 0 ? (
        <p className="text-sm text-muted">{extinct.map((e) => e.line).join(" ")}</p>
      ) : null}

      <section className="space-y-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">The rail</p>
          <h2 className="mt-2 font-display text-3xl">What this house has shown.</h2>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Same species, every look the nest has thrown. Ghosts are still in the catalog draw.
          </p>
        </div>
        {fair.length === 0 ? (
          <p className="text-sm text-muted">The kennel is empty. The hatchery can still bring a bird.</p>
        ) : (
          <div className="space-y-6">
            {fair.map((row) => (
              <article key={row.key} className="rounded-[var(--radius-xl)] border border-border bg-surface p-5">
                <h3 className="font-display text-2xl">{row.name}</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {row.held.map((h) => (
                    <li
                      key={h.look}
                      className="rounded-[var(--radius-sm)] border border-border bg-elevated px-3 py-1 text-xs text-fg"
                    >
                      {h.look}
                      {h.count > 1 ? ` · ${h.count}` : ""}
                    </li>
                  ))}
                  {row.ghosts.map((g) => (
                    <li
                      key={g}
                      className="rounded-[var(--radius-sm)] border border-dashed border-border px-3 py-1 text-xs text-subtle"
                    >
                      {g}
                    </li>
                  ))}
                </ul>
                {row.ribbons.map((r) => (
                  <p key={r.kind} className="mt-3 text-sm text-muted">
                    {r.line}
                  </p>
                ))}
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">The house</p>
        {pets === null ? (
          <div className="h-24 animate-pulse rounded-[var(--radius-xl)] bg-surface" />
        ) : pets.length === 0 ? (
          <p className="text-sm text-muted">No one to pair. Hatch first.</p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2">
            {pets.map((pet) => {
              const selected = pet.id === seatA || pet.id === seatB;
              const pheno = phenotypeLine(phenotypeOf(pet.genes, pet.species_key));
              return (
                <li key={pet.id}>
                  <button
                    type="button"
                    onClick={() => seat(pet.id)}
                    className={`flex w-full items-center gap-3 rounded-[var(--radius-lg)] border px-3 py-2 text-left transition-colors ${
                      selected ? "border-border-strong bg-elevated" : "border-border bg-surface hover:border-border-strong"
                    }`}
                  >
                    <div className="size-12 overflow-hidden rounded-[var(--radius-sm)] bg-elevated">
                      <PetPortrait speciesKey={pet.species_key} alt={pet.name} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-display text-lg leading-tight">{pet.name}</p>
                      <p className="truncate text-xs text-muted">{pet.stage} · {pheno}</p>
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
      </section>
    </main>
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
    <div className="rounded-[var(--radius-lg)] border border-border bg-elevated p-3">
      <p className="text-[11px] uppercase tracking-[0.14em] text-subtle">{label}</p>
      {pet ? (
        <>
          <p className="mt-2 font-display text-xl leading-none">{pet.name}</p>
          <p className="mt-1 text-xs text-muted">{pet.stage} · {phenotypeLine(phenotypeOf(pet.genes, pet.species_key))}</p>
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
    <aside className="rounded-[var(--radius-xl)] border border-border bg-surface p-5">
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
                watch === id ? "bg-elevated text-fg" : "text-subtle hover:text-fg"
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
                  <td key={`${i}-${j}`} className="border border-border bg-elevated p-2 text-fg">
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
