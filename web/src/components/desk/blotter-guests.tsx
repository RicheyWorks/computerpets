import { useEffect, useState } from "react";
import { LivingPet, type PetCommand } from "@/components/desk/living-pet";
import { DayWash } from "@/components/desk/blotter";
import { LIVING_KINDS } from "@/lib/pets/living";
import { plaqueFor } from "@/lib/pets/plaques";
import { traitFor } from "@/lib/pets/traits";
import { cn } from "@/lib/utils";

const ON_BLOTTER = 5;
const STARTS = [28, 150, 280, 420, 560];

function nextWaiting(keys: readonly string[], onBlotter: string[], pinned: string | null) {
  return keys.find((key) => !onBlotter.includes(key) && key !== pinned) ?? null;
}

export function BlotterGuest({
  species,
  startX,
  selected,
  onSelect,
}: {
  species: string;
  startX: number;
  selected: boolean;
  onSelect: () => void;
}) {
  const kind = LIVING_KINDS.find((k) => k.key === species) ?? LIVING_KINDS[0]!;
  const trait = traitFor(kind.key);
  const guide = plaqueFor(kind.key);
  const [order, setOrder] = useState<{ cmd: PetCommand; id: number }>({ cmd: "enter", id: 1 });
  const [speech, setSpeech] = useState<string | null>(null);

  useEffect(() => {
    kind.preload();
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
  }, [kind, trait.wander, guide?.lesson]);

  return (
    <LivingPet
      command={order.cmd}
      orderId={order.id}
      speech={speech}
      sprites={kind.sprites}
      fps={kind.fps}
      once={kind.once}
      gait={{ ...trait, scale: trait.scale * (selected ? 0.86 : 0.74) }}
      kind={kind.key}
      startX={startX}
      onArrived={() => {
        if (order.cmd === "wander" || order.cmd === "enter") {
          setOrder((o) => ({ cmd: "idle", id: o.id + 1 }));
        }
      }}
      onTap={() => {
        onSelect();
        setSpeech(guide?.lesson ?? kind.greetLine());
        setOrder((o) => ({ cmd: "talk", id: o.id + 1 }));
      }}
    />
  );
}

export function LivingBlotter({
  keys,
  selectedKey,
  onSelect,
  caption,
}: {
  keys: readonly string[];
  selectedKey: string;
  onSelect: (key: string) => void;
  caption: string;
}) {
  const [onBlotter, setOnBlotter] = useState<string[]>(() => {
    const head = keys.includes(selectedKey) ? [selectedKey] : [];
    return [...head, ...keys.filter((key) => key !== selectedKey)].slice(0, ON_BLOTTER);
  });

  useEffect(() => {
    setOnBlotter((current) => {
      if (current.includes(selectedKey)) return current;
      const leave = current.find((key) => key !== selectedKey) ?? current[current.length - 1]!;
      return current.map((key) => (key === leave ? selectedKey : key));
    });
  }, [selectedKey]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setOnBlotter((current) => {
        const waiting = nextWaiting(keys, current, selectedKey);
        if (!waiting) return current;
        const leave = current.find((key) => key !== selectedKey);
        if (!leave) return current;
        return current.map((key) => (key === leave ? waiting : key));
      });
    }, 14000);
    return () => window.clearInterval(id);
  }, [keys, selectedKey]);

  return (
    <section className="relative h-[360px] overflow-hidden border-t border-border sm:h-[440px]">
      <img
        src="/habitat.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[center_72%]"
      />
      <DayWash />
      {onBlotter.map((key, i) => (
        <BlotterGuest
          key={key}
          species={key}
          startX={STARTS[i] ?? 80}
          selected={key === selectedKey}
          onSelect={() => onSelect(key)}
        />
      ))}
      <p className="absolute bottom-4 left-5 max-w-[16rem] text-[11px] uppercase tracking-[0.18em] text-subtle">
        {caption}
      </p>
    </section>
  );
}

export function GuideRail({
  keys,
  selectedKey,
  onSelect,
}: {
  keys: readonly string[];
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return (
    <nav className="flex flex-wrap gap-1.5">
      {keys.map((key) => {
        const guide = plaqueFor(key);
        if (!guide) return null;
        const active = key === selectedKey;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(key)}
            className={cn(
              "rounded-[var(--radius-sm)] border px-3 py-1.5 text-left text-sm transition-colors duration-150",
              active
                ? "border-border-strong bg-elevated text-fg"
                : "border-border bg-surface text-muted hover:text-fg",
            )}
          >
            <span className="font-display">{guide.name}</span>
            <span className="ml-2 text-[11px] uppercase tracking-[0.12em] text-subtle">{guide.species}</span>
          </button>
        );
      })}
    </nav>
  );
}
