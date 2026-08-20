import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CompanionRoom } from "@/components/desk/companion-room";
import { livingByKey, loadActiveKindKey, RED_PANDA_KIND, saveActiveKindKey, type LivingKind } from "@/lib/pets/living";
import { roomOf } from "@/lib/pets/rooms";
import { isTablet, readSit } from "@/lib/pets/tablet-desk";

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    Boolean((navigator as Navigator & { standalone?: boolean }).standalone)
  );
}

export function LiveStage({ initial }: { initial?: LivingKind }) {
  const [kind, setKind] = useState(initial ?? RED_PANDA_KIND);
  const [installed, setInstalled] = useState(true);
  const [pad, setPad] = useState(false);

  useEffect(() => {
    setInstalled(isStandalone());
    setPad(isTablet(readSit(window)));
    if (initial) {
      setKind(initial);
      return;
    }
    setKind(livingByKey(loadActiveKindKey()));
  }, [initial]);

  const room = roomOf(kind.key);

  function select(key: string) {
    const next = livingByKey(key);
    setKind(next);
    saveActiveKindKey(next.key);
  }

  return (
    <CompanionRoom
      kind={kind}
      onSelectKind={select}
      phone={!pad}
      tablet={pad}
      detail="On this device"
      extraCare={[{ label: "Rest", action: "rest" }]}
      line={
        !installed ? (
          <p className="mt-3 text-xs text-subtle">Add to Home Screen. Tap the blotter for a treat.</p>
        ) : null
      }
      footer={
        <p>
          <Link
            to="/"
            search={{ pet: kind.key }}
            onClick={() => saveActiveKindKey(kind.key)}
            className="text-fg no-underline hover:text-primary"
          >
            Open the desk
          </Link>
          {" · "}
          <Link to={room.path} className="text-muted no-underline hover:text-fg">
            {room.kicker}
          </Link>
          {" · "}
          <Link to="/meet" className="text-muted no-underline hover:text-fg">
            The house
          </Link>
        </p>
      }
    />
  );
}
