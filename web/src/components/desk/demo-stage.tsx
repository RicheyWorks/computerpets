import { CompanionRoom } from "@/components/desk/companion-room";
import { LinuxDeskExtra } from "@/components/desk/linux-desk-extra";
import { MacDeskExtra } from "@/components/desk/mac-desk-extra";
import { TabletDeskSit } from "@/components/desk/tablet-desk-sit";
import type { LivingKind } from "@/lib/pets/living";

export function DemoStage({ kind }: { kind: LivingKind }) {
  return (
    <div className="relative">
      <MacDeskExtra name={kind.name} />
      <LinuxDeskExtra name={kind.name} />
      <TabletDeskSit name={kind.name} />
      <CompanionRoom kind={kind} persistLocal={false} />
    </div>
  );
}
