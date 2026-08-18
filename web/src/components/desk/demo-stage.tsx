import { CompanionRoom } from "@/components/desk/companion-room";
import type { LivingKind } from "@/lib/pets/living";

export function DemoStage({ kind }: { kind: LivingKind }) {
  return <CompanionRoom kind={kind} />;
}
