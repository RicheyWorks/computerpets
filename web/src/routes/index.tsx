import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Toaster } from "sonner";
import { DeskStage } from "@/components/desk/desk-stage";
import { LoadProblem } from "@/components/load-problem";
import { SignedIn, SignedOut } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { careForPet, getSanctuary } from "@/lib/pets/actions";
import { normalizeCare } from "@/lib/pets/care";
import { sitDeskGuest } from "@/lib/pets/desk";
import {
  isLivingSpecies,
  livingByKey,
  loadActiveKindKey,
  saveActiveKindKey,
} from "@/lib/pets/living";
import { loadProblem } from "@/lib/plain-error";

const searchSchema = z.object({
  pet: z.string().optional(),
});

export const Route = createFileRoute("/")({
  validateSearch: searchSchema,
  component: DeskHome,
});

function useDeskKind() {
  const { pet } = Route.useSearch();
  const fromSearch = pet && isLivingSpecies(pet) ? pet : null;
  const [key, setKey] = useState(fromSearch ?? "red_panda");

  useEffect(() => {
    if (fromSearch) {
      setKey(fromSearch);
      saveActiveKindKey(fromSearch);
      return;
    }
    const stored = loadActiveKindKey();
    if (stored) setKey(stored);
  }, [fromSearch]);

  function select(next: string) {
    setKey(next);
    saveActiveKindKey(next);
  }

  return { kind: livingByKey(key), select };
}

function DeskHome() {
  const { user, isPending } = useCurrentUserState();
  const desk = useDeskKind();

  return (
    <>
      <Toaster theme="dark" position="top-center" />
      {isPending ? (
        <DeskStage kind={desk.kind} onSelectKind={desk.select} />
      ) : (
        <>
          <SignedOut>
            <DeskStage kind={desk.kind} onSelectKind={desk.select} />
          </SignedOut>
          <SignedIn>
            {user ? (
              <KeeperDesk kindKey={desk.kind.key} onSelectKind={desk.select} />
            ) : (
              <DeskStage kind={desk.kind} onSelectKind={desk.select} />
            )}
          </SignedIn>
        </>
      )}
    </>
  );
}

function KeeperDesk({
  kindKey,
  onSelectKind,
}: {
  kindKey: string;
  onSelectKind: (key: string) => void;
}) {
  const kind = livingByKey(kindKey);
  const [name, setName] = useState(kind.name);
  const [petId, setPetId] = useState<string | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setName(kind.name);
    setPetId(null);
    setProblem(null);
    void getSanctuary()
      .then((data) => {
        const mine = sitDeskGuest(data.pets, kind.key);
        if (mine) {
          setName(mine.name);
          setPetId(mine.id);
        }
      })
      // Not silently the default guest: say the desk could not load yours, with a retry.
      .catch((err) => setProblem(loadProblem("desk", err)));
  }, [kind, attempt]);

  if (problem) {
    return (
      <main className="mx-auto max-w-lg space-y-3 px-6 py-20">
        <h1 className="font-display text-3xl">The desk did not open.</h1>
        <LoadProblem line={problem} onRetry={() => setAttempt((n) => n + 1)} />
      </main>
    );
  }

  return (
    <DeskStage
      kind={kind}
      name={name}
      onSelectKind={onSelectKind}
      onCare={
        petId
          ? async (action) => {
              const next = await careForPet({ data: { petId, action } });
              return normalizeCare(next);
            }
          : undefined
      }
    />
  );
}
