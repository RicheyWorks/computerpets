import { CompanionRoom } from "@/components/desk/companion-room";
import { LinuxDeskExtra } from "@/components/desk/linux-desk-extra";
import { MacDeskExtra } from "@/components/desk/mac-desk-extra";
import { PhoneDeskSit } from "@/components/desk/phone-desk-sit";
import { TabletDeskSit } from "@/components/desk/tablet-desk-sit";
import { DESK_TEND } from "@/lib/pets/care";
import type { LivingKind } from "@/lib/pets/living";

export function DemoStage({ kind }: { kind: LivingKind }) {
  return (
    <div className="relative">
      <MacDeskExtra name={kind.name} />
      <LinuxDeskExtra name={kind.name} />
      <TabletDeskSit name={kind.name} />
      <PhoneDeskSit name={kind.name} />
      <CompanionRoom kind={kind} persistLocal={false} liveTick extraCare={[...DESK_TEND]} />
    </div>
  );
}
