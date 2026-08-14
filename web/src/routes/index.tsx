import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { DeskStage } from "@/components/desk/desk-stage";
import { SignedIn, SignedOut } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { careForPet, getSanctuary } from "@/lib/pets/actions";
import { RED_PANDA_KEY, RED_PANDA_NAME } from "@/lib/pets/red-panda";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({ component: DeskHome });

function DeskHome() {
  const { user, isPending } = useCurrentUserState();

  return (
    <>
      <Toaster theme="dark" position="top-center" />
      {isPending ? (
        <DeskStage name={RED_PANDA_NAME} />
      ) : (
        <>
          <SignedOut>
            <DeskStage name={RED_PANDA_NAME} />
          </SignedOut>
          <SignedIn>
            {user ? <KeeperDesk /> : <DeskStage name={RED_PANDA_NAME} />}
          </SignedIn>
        </>
      )}
    </>
  );
}

function KeeperDesk() {
  const [name, setName] = useState(RED_PANDA_NAME);
  const [petId, setPetId] = useState<string | null>(null);

  useEffect(() => {
    void getSanctuary()
      .then((data) => {
        const mine = data.pets.find((p) => p.species_key === RED_PANDA_KEY);
        if (mine) {
          setName(mine.name);
          setPetId(mine.id);
        }
      })
      .catch(() => undefined);
  }, []);

  return (
    <DeskStage
      name={name}
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
