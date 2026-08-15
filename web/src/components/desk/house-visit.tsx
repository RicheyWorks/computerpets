import { useEffect, useMemo, useState } from "react";
import { LivingPet, type PetCommand } from "@/components/desk/living-pet";
import { todaysVisitor, visitLine } from "@/lib/pets/visitor";
import { traitFor } from "@/lib/pets/traits";

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
    const timers: number[] = [];
    timers.push(
      window.setTimeout(() => {
        guest.preload();
        setStartX(Math.max(280, window.innerWidth - 72));
        setPhase("in");
        setOrder({ cmd: "enter", id: 1 });
        timers.push(
          window.setTimeout(() => {
            setSpeech(visitLine(guest.key));
            setOrder({ cmd: "talk", id: 2 });
          }, 1600),
        );
        timers.push(
          window.setTimeout(() => {
            setSpeech(null);
            setOrder({ cmd: "wander", id: 3 });
          }, 5200),
        );
        timers.push(
          window.setTimeout(() => {
            setSpeech(null);
            setOrder({ cmd: "leave", id: 4 });
          }, 14000),
        );
        timers.push(window.setTimeout(() => setPhase("gone"), 18500));
      }, 7500),
    );
    return () => {
      for (const id of timers) window.clearTimeout(id);
    };
  }, [guest, hostKey]);

  if (hidden || phase === "wait" || phase === "gone") return null;

  return (
    <LivingPet
      command={order.cmd}
      orderId={order.id}
      speech={speech}
      sprites={guest.sprites}
      fps={guest.fps}
      once={guest.once}
      gait={{ ...trait, scale: trait.scale * 0.72 }}
      startX={startX}
      stage="grown"
      onArrived={() => {
        if (order.cmd === "enter" || order.cmd === "wander") setOrder((o) => ({ cmd: "idle", id: o.id + 1 }));
        if (order.cmd === "leave") setPhase("gone");
      }}
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
