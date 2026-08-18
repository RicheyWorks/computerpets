import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { LivingPet, type PetCommand } from "@/components/desk/living-pet";
import { DayWash } from "@/components/desk/blotter";
import { LIVING_KINDS } from "@/lib/pets/living";
import { traitFor } from "@/lib/pets/traits";
import { todaysVisitor } from "@/lib/pets/visitor";

const KEYS = ["red_panda", "ball_python", "corn_snake", "green_tree_python"] as const;
const STARTS = [36, 210, 390, 560];

function Guest({ species, startX }: { species: string; startX: number }) {
  const kind = LIVING_KINDS.find((k) => k.key === species) ?? LIVING_KINDS[0]!;
  const trait = traitFor(kind.key);
  const [order, setOrder] = useState<{ cmd: PetCommand; id: number }>({ cmd: "wander", id: 1 });
  const [speech, setSpeech] = useState<string | null>(null);

  useEffect(() => {
    kind.preload();
    const id = window.setInterval(() => {
      const roll = Math.random();
      if (roll < 0.55) setOrder((o) => ({ cmd: "wander", id: o.id + 1 }));
      else if (roll < 0.78) setOrder((o) => ({ cmd: trait.wander < 0.2 ? "sit" : "idle", id: o.id + 1 }));
      else {
        setSpeech(kind.greetLine());
        setOrder((o) => ({ cmd: "talk", id: o.id + 1 }));
        window.setTimeout(() => setSpeech(null), 2800);
      }
    }, 3800 + Math.random() * 2400);
    return () => window.clearInterval(id);
  }, [kind, trait.wander]);

  return (
    <LivingPet
      command={order.cmd}
      orderId={order.id}
      speech={speech}
      sprites={kind.sprites}
      fps={kind.fps}
      once={kind.once}
      gait={{ ...trait, scale: trait.scale * 0.78 }}
      kind={kind.key}
      startX={startX}
      onArrived={() => {
        if (order.cmd === "wander") setOrder((o) => ({ cmd: "idle", id: o.id + 1 }));
      }}
      onTap={() => {
        setSpeech(kind.greetLine());
        setOrder((o) => ({ cmd: "talk", id: o.id + 1 }));
      }}
    />
  );
}

export function HouseFloor() {
  return (
    <section className="relative h-[340px] overflow-hidden border-t border-border sm:h-[400px]">
      <img
        src="/habitat.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[center_72%]"
      />
      <DayWash />
      {KEYS.map((key, i) => (
        <Guest key={key} species={key} startX={STARTS[i] ?? 80} />
      ))}
      <p className="absolute bottom-4 left-5 text-[11px] uppercase tracking-[0.18em] text-subtle">
        Today {todaysVisitor("red_panda").name} is calling ·{" "}
        <Link to="/study" className="text-fg no-underline hover:text-primary">
          The study
        </Link>
        {" · "}
        <Link to="/snakes" className="text-fg no-underline hover:text-primary">
          The den
        </Link>
        {" · "}
        <Link to="/sea" className="text-fg no-underline hover:text-primary">
          The tide
        </Link>
        {" · "}
        <Link to="/garden" className="text-fg no-underline hover:text-primary">
          The garden
        </Link>
        {" · "}
        <Link to="/hive" className="text-fg no-underline hover:text-primary">
          The hive
        </Link>
        {" · "}
        <Link to="/cellar" className="text-fg no-underline hover:text-primary">
          The cellar
        </Link>
      </p>
    </section>
  );
}
