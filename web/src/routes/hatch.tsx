import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { RarityBadge } from "@/components/pet-card";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getSanctuary, hatchPet } from "@/lib/pets/actions";
import { HATCH_COST, RARITY_WEIGHT, type Rarity } from "@/lib/pets/catalog";

export const Route = createFileRoute("/hatch")({ component: Hatchery });

const TIERS: Rarity[] = ["COMMON", "UNCOMMON", "RARE", "LEGENDARY"];

function Hatchery() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [ember, setEmber] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    void getSanctuary()
      .then((d) => setEmber(d.ember))
      .catch(() => setEmber(0));
  }, [user]);

  if (isPending) return <div className="h-64 animate-pulse rounded-[var(--radius-xl)] bg-surface" />;
  if (!user) return <RedirectToSignIn />;

  async function hatch() {
    setBusy(true);
    try {
      const pet = await hatchPet();
      toast.success(`${pet.name} hatched · ${pet.token_id}`);
      await navigate({ to: "/pets/$key", params: { key: pet.id } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Hatch failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="space-y-8">
      <Toaster theme="dark" position="bottom-center" />
      <header className="max-w-xl space-y-3">
        <p className="text-[11px] uppercase tracking-[0.2em] text-subtle">Hatchery</p>
        <h1 className="font-display text-4xl">Draw from the house catalog.</h1>
        <p className="text-sm text-muted">
          Weighted toward common companions. Legendaries are scarce on purpose.
          Cost is taken after the roll.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <div className="space-y-5 rounded-[var(--radius-xl)] border border-border bg-surface p-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-subtle">Ember on hand</p>
              <p className="font-display text-5xl tabular-nums">{ember ?? "—"}</p>
            </div>
            <Button size="lg" disabled={busy || ember === null} onClick={() => void hatch()}>
              {busy ? "Hatching…" : "Hatch"}
            </Button>
          </div>
          <p className="text-sm text-muted">
            First hatch is cheap enough: twelve ember to start, commons cost four.
          </p>
        </div>
        <ul className="space-y-3">
          {TIERS.map((rarity) => (
            <li
              key={rarity}
              className="flex items-center justify-between rounded-[var(--radius-lg)] border border-border bg-surface px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <RarityBadge rarity={rarity} />
                <span className="text-sm text-muted">{RARITY_WEIGHT[rarity]}% draw</span>
              </div>
              <span className="font-mono text-sm tabular-nums text-fg/80">
                {HATCH_COST[rarity]} ember
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
