import { useEffect, useMemo, useState } from "react";
import { LivingPet, type PetCommand } from "@/components/desk/living-pet";
import {
  VISIT_GONE_MS,
  VISIT_LEAVE_MS,
  VISIT_TALK_MS,
  VISIT_WAIT_MS,
  VISIT_WANDER_MS,
  todaysVisitor,
  visitLine,
} from "@/lib/pets/visitor";
import { traitFor } from "@/lib/pets/traits";
import { petTapLabel, visibleTimeline } from "@/lib/pets/keeper";
import { ROBIN_KEY } from "@/lib/pets/robin-fly";

export function HouseVisit({ hostKey, hidden }: { hostKey: string; hidden?: boolean }) {
  const guest = useMemo(() => todaysVisitor(hostKey), [hostKey]);
  const trait = traitFor(guest.key);
  const [phase, setPhase] = useState<"wait" | "in" | "gone">("wait");
  const [order, setOrder] = useState<{ cmd: PetCommand; id: number }>({ cmd: "enter", id: 1 });
  const [speech, setSpeech] = useState<string | null>(null);
  const [startX, setStartX] = useState(420);

  useEffect(() => {
    setPhase("wait");
    setSpeech(null);
    // The visit runs on shown time: a hidden tab holds it where it is, so the keeper does not come
    // back to a visitor who arrived, talked, and left behind another tab.
    return visibleTimeline([
      {
        at: VISIT_WAIT_MS,
        run: () => {
          guest.preload();
          setStartX(Math.max(280, window.innerWidth - 72));
          setPhase("in");
          setOrder({ cmd: "enter", id: 1 });
        },
      },
      {
        at: VISIT_WAIT_MS + VISIT_TALK_MS,
        run: () => {
          setSpeech(visitLine(guest.key));
          setOrder({ cmd: "talk", id: 2 });
        },
      },
      {
        at: VISIT_WAIT_MS + VISIT_WANDER_MS,
        run: () => {
          setSpeech(null);
          setOrder({ cmd: "wander", id: 3 });
        },
      },
      {
        at: VISIT_WAIT_MS + VISIT_LEAVE_MS,
        run: () => {
          setSpeech(null);
          setOrder({ cmd: "leave", id: 4 });
        },
      },
      { at: VISIT_WAIT_MS + VISIT_GONE_MS, run: () => setPhase("gone") },
    ]);
  }, [guest, hostKey]);

  if (hidden || phase === "wait" || phase === "gone" || guest.key === ROBIN_KEY) return null;

  return (
    <LivingPet
      command={order.cmd}
      orderId={order.id}
      speech={speech}
      sprites={guest.sprites}
      fps={guest.fps}
      once={guest.once}
      gait={{ ...trait, scale: trait.scale * 0.72 }}
      kind={guest.key}
      startX={startX}
      stage="grown"
      onArrived={() => {
        if (order.cmd === "enter" || order.cmd === "wander") setOrder((o) => ({ cmd: "idle", id: o.id + 1 }));
        if (order.cmd === "leave") setPhase("gone");
      }}
      tapLabel={petTapLabel(guest.name, "hello")}
      onTap={() => {
        setSpeech(visitLine(guest.key));
        setOrder((o) => ({ cmd: "talk", id: o.id + 1 }));
      }}
    />
  );
}

export function visitCaption(hostKey: string) {
  const guest = todaysVisitor(hostKey);
  return `${guest.name} may call`;
}
