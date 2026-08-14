import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Toaster } from "sonner";
import { DeskStage } from "@/components/desk/desk-stage";
import { SignedIn, SignedOut } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { careForPet, getSanctuary } from "@/lib/pets/actions";
import {
  isLivingSpecies,
  livingByKey,
  loadActiveKindKey,
  saveActiveKindKey,
} from "@/lib/pets/living";

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

  useEffect(() => {
    setName(kind.name);
    setPetId(null);
    void getSanctuary()
      .then((data) => {
        const mine = data.pets.find((p) => p.species_key === kind.key);
        if (mine) {
          setName(mine.name);
          setPetId(mine.id);
        }
      })
      .catch(() => undefined);
  }, [kind]);

  return (
    <DeskStage
      kind={kind}
      name={name}
      onSelectKind={onSelectKind}
      onCare={
        petId
          ? async (action) => {
              const next = await careForPet({ data: { petId, action } });
              return { hunger: next.hunger, mood: next.mood, energy: next.energy };
            }
          : undefined
      }
    />
  );
}
