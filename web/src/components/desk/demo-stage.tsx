import { CompanionRoom } from "@/components/desk/companion-room";
import { MacDeskExtra } from "@/components/desk/mac-desk-extra";
import type { LivingKind } from "@/lib/pets/living";

export function DemoStage({ kind }: { kind: LivingKind }) {
  return (
    <div className="relative">
      <MacDeskExtra name={kind.name} />
      <CompanionRoom kind={kind} persistLocal={false} />
    </div>
  );
}
