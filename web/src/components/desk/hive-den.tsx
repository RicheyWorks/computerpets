import { useEffect, useState } from "react";
import { LivingPet, type PetCommand } from "@/components/desk/living-pet";
import { DayWash } from "@/components/desk/blotter";
import { BlotterCare } from "@/components/desk/blotter-care";
import { GuideRail } from "@/components/desk/blotter-guests";
import { BEE_KEYS } from "@/lib/pets/bees";
import {
  applySanctuaryCare,
  loadCare,
  saveCare,
  tickCare,
  type CareStats,
} from "@/lib/pets/care";
import {
  colonyOf,
  colonyWord,
  combSeats,
  hiveWalkers,
  HIVE_PLACE,
} from "@/lib/pets/hive";
import { INSECT_KEYS } from "@/lib/pets/insects";
import { livingByKey } from "@/lib/pets/living";
import { plaqueFor } from "@/lib/pets/plaques";
import { traitFor } from "@/lib/pets/traits";

const HIVE_KEYS = [...INSECT_KEYS, ...BEE_KEYS];
const WALKER_KEYS = hiveWalkers(HIVE_KEYS);
const ON_WOOD = 3;
const WALKER_STARTS = [36, 520, 640];
const COMB_X = 268;
const CARE_KEY = "computerpets.desk.honeycomb.v1";

function nextWaiting(onWood: string[], pinned: string | null) {
  return WALKER_KEYS.find((key) => !onWood.includes(key) && key !== pinned) ?? null;
}

function HiveGuest({
  species,
  startX,
  lift = 0,
  selected,
  sit,
  scale,
  dull,
  onSelect,
}: {
  species: string;
  startX: number;
  lift?: number;
  selected: boolean;
  sit?: boolean;
  scale?: number;
  dull?: boolean;
  onSelect: () => void;
}) {
  const kind = livingByKey(species);
  const trait = traitFor(kind.key);
  const guide = plaqueFor(kind.key);
  const [order, setOrder] = useState<{ cmd: PetCommand; id: number }>({
    cmd: sit ? "sit" : "enter",
    id: 1,
  });
  const [speech, setSpeech] = useState<string | null>(null);

  useEffect(() => {
    kind.preload();
    if (sit) return;
    const id = window.setInterval(() => {
      const roll = Math.random();
      if (roll < 0.58) setOrder((o) => ({ cmd: "wander", id: o.id + 1 }));
      else if (roll < 0.8) setOrder((o) => ({ cmd: trait.wander < 0.2 ? "sit" : "idle", id: o.id + 1 }));
      else {
        setSpeech(guide?.lesson ?? kind.greetLine());
        setOrder((o) => ({ cmd: "talk", id: o.id + 1 }));
        window.setTimeout(() => setSpeech(null), 3200);
      }
    }, 3600 + Math.random() * 2200);
    return () => window.clearInterval(id);
  }, [kind, trait.wander, guide?.lesson, sit]);

  return (
    <LivingPet
      command={order.cmd}
      orderId={order.id}
      speech={speech}
      sprites={kind.sprites}
      fps={kind.fps}
      once={kind.once}
      gait={{ ...trait, scale: (scale ?? trait.scale) * (selected ? 1 : 0.92) }}
      kind={kind.key}
      startX={startX}
      lift={lift}
      dull={dull}
      onArrived={() => {
        if (sit) {
          setOrder((o) => ({ cmd: "sit", id: o.id + 1 }));
          return;
        }
        if (order.cmd === "wander" || order.cmd === "enter") {
          setOrder((o) => ({ cmd: "idle", id: o.id + 1 }));
        }
      }}
      onTap={() => {
        onSelect();
        setSpeech(guide?.lesson ?? kind.greetLine());
        setOrder((o) => ({ cmd: sit ? "talk" : "talk", id: o.id + 1 }));
      }}
    />
  );
}

export function HiveDen({
  selectedKey,
  onSelect,
}: {
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  const [onWood, setOnWood] = useState<string[]>(() => {
    const head = WALKER_KEYS.includes(selectedKey) ? [selectedKey] : [];
    return [...head, ...WALKER_KEYS.filter((key) => key !== selectedKey)].slice(0, ON_WOOD);
  });
  const [stats, setStats] = useState<CareStats>(() =>
    loadCare(CARE_KEY, { hunger: 78, mood: 74, energy: 80, health: 92 }, HIVE_PLACE),
  );

  useEffect(() => {
    setOnWood((current) => {
      if (!WALKER_KEYS.includes(selectedKey) || current.includes(selectedKey)) return current;
      const leave = current.find((key) => key !== selectedKey) ?? current[current.length - 1]!;
      return current.map((key) => (key === leave ? selectedKey : key));
    });
  }, [selectedKey]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setOnWood((current) => {
        const waiting = nextWaiting(current, WALKER_KEYS.includes(selectedKey) ? selectedKey : null);
        if (!waiting) return current;
        const leave = current.find((key) => key !== selectedKey);
        if (!leave) return current;
        return current.map((key) => (key === leave ? waiting : key));
      });
    }, 14000);
    return () => window.clearInterval(id);
  }, [selectedKey]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setStats((prior) => {
        const next = tickCare(HIVE_PLACE, prior);
        saveCare(CARE_KEY, next);
        return next;
      });
    }, 8000);
    return () => window.clearInterval(id);
  }, []);

  const colony = colonyOf(stats);
  const seats = combSeats();

  function tend(action: "feed" | "rest") {
    const next = applySanctuaryCare(action, HIVE_PLACE, stats).stats;
    saveCare(CARE_KEY, next);
    setStats(next);
  }

  return (
    <section className="relative h-[400px] overflow-hidden border-t border-border sm:h-[480px]">
      <img
        src="/habitat.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[center_72%]"
      />
      <DayWash />

      <HiveGuest
        species={HIVE_PLACE}
        startX={COMB_X}
        selected={selectedKey === HIVE_PLACE}
        sit
        scale={1.38}
        dull={colony.quiet}
        onSelect={() => onSelect(HIVE_PLACE)}
      />

      {seats.map((seat, i) => (
        <HiveGuest
          key={`${seat.seat}-${i}`}
          species={seat.key}
          startX={seat.x}
          lift={seat.lift}
          selected={selectedKey === seat.key}
          sit
          scale={seat.seat === "keep" ? 0.78 : 0.52}
          dull={colony.quiet}
          onSelect={() => onSelect(seat.key)}
        />
      ))}

      {onWood.map((key, i) => (
        <HiveGuest
          key={key}
          species={key}
          startX={WALKER_STARTS[i] ?? 80}
          selected={key === selectedKey}
          onSelect={() => onSelect(key)}
        />
      ))}

      <div className="absolute bottom-4 left-5 max-w-[18rem] space-y-2">
        <p className="text-[11px] uppercase tracking-[0.18em] text-subtle">
          {colony.quiet
            ? "The comb went quiet. Nectar can still lift a cell."
            : "The comb sits. Comb, Keep, and Hum keep it. The line is the brood."}
        </p>
        <p className="font-display text-xl leading-none text-fg">{colonyWord(colony)}</p>
        <p className="font-mono text-[11px] text-subtle">
          Brood · {colony.brood} {colony.brood === 1 ? "cell" : "cells"} · Stores · {colony.stores}
        </p>
        <BlotterCare
          marks={[
            { label: "Nectar", onClick: () => tend("feed") },
            { label: "Tend", onClick: () => tend("rest") },
          ]}
        />
      </div>
    </section>
  );
}

export function HiveRail({
  selectedKey,
  onSelect,
}: {
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return <GuideRail keys={HIVE_KEYS} selectedKey={selectedKey} onSelect={onSelect} />;
}
