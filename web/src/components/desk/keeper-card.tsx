import { useEffect, useState } from "react";
import { BlotterCare } from "@/components/desk/blotter-care";
import {
  ADVERTISED_CARE,
  DESK_PORT,
  HEARTBEAT_URL,
  KEEPER_CARE,
  UNREAD_HEARTBEAT,
  careTruth,
  heartbeatLine,
  keeperMeters,
  parseHeartbeat,
  type Heartbeat,
} from "@/lib/pets/keeper";
import { cn } from "@/lib/utils";
import type { CareStats } from "@/lib/pets/care";

export function KeeperCard({
  name,
  stage,
  stats,
  busy,
  onFeed,
  onPlay,
  onRest,
  className,
}: {
  name: string;
  stage: string;
  stats: Pick<CareStats, "hunger" | "energy" | "bond">;
  busy?: boolean;
  onFeed: () => void;
  onPlay: () => void;
  onRest: () => void;
  className?: string;
}) {
  const meters = keeperMeters(stats);
  const [beat, setBeat] = useState<Heartbeat>(UNREAD_HEARTBEAT);

  useEffect(() => {
    let cancelled = false;
    async function read() {
      try {
        const res = await fetch(HEARTBEAT_URL, { cache: "no-store" });
        const raw = await res.json();
        if (!cancelled) setBeat(parseHeartbeat(raw));
      } catch {
        if (!cancelled) setBeat({ ...UNREAD_HEARTBEAT });
      }
    }
    void read();
    const id = window.setInterval(() => void read(), 15_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  const verbs = [
    { label: KEEPER_CARE[0]!.label, onClick: onFeed, disabled: busy },
    { label: KEEPER_CARE[1]!.label, onClick: onPlay, disabled: busy },
    { label: KEEPER_CARE[2]!.label, onClick: onRest, disabled: busy },
  ];

  return (
    <article
      className={cn("keeper-card paper-card rounded-[var(--radius-lg)] border border-border p-3", className)}
      aria-label="Keeper card"
    >
      <p className="text-[11px] uppercase tracking-[0.2em] text-subtle">Keeper card</p>
      <h2 className="mt-1 font-display text-2xl leading-none">
        {name} · {stage}
      </h2>
      <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-subtle">{meters.bondTitle}</p>
      <dl className="keeper-meters mt-3 grid gap-1.5">
        <Meter label="Hunger" value={meters.hunger} />
        <Meter label="Rest" value={meters.rest} />
        <Meter label="Bond" value={meters.bond} />
      </dl>
      <BlotterCare className="mt-3 justify-start" marks={verbs} />
      <p className="mt-2 font-mono text-[11px] text-subtle" data-heartbeat={beat.status}>
        {heartbeatLine(beat)}
      </p>
      <p className="mt-1 text-[11px] text-subtle">
        {careTruth()} Desk {DESK_PORT}. Not {ADVERTISED_CARE.feed}.
      </p>
    </article>
  );
}

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-[11px] uppercase tracking-[0.14em] text-subtle">
        <dt>{label}</dt>
        <dd>{value}</dd>
      </div>
      <div className="mt-0.5 h-1 overflow-hidden rounded-full bg-[#3d3831]">
        <i className="block h-full rounded-full bg-[#d8cfc0]" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function KeeperHeartbeat({ className }: { className?: string }) {
  const [beat, setBeat] = useState<Heartbeat>(UNREAD_HEARTBEAT);

  useEffect(() => {
    let cancelled = false;
    async function read() {
      try {
        const res = await fetch(HEARTBEAT_URL, { cache: "no-store" });
        const raw = await res.json();
        if (!cancelled) setBeat(parseHeartbeat(raw));
      } catch {
        if (!cancelled) setBeat({ ...UNREAD_HEARTBEAT });
      }
    }
    void read();
    const id = window.setInterval(() => void read(), 20_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  return (
    <p className={cn("font-mono text-[11px] uppercase tracking-[0.12em] text-subtle", className)} data-heartbeat={beat.status}>
      {heartbeatLine(beat)} · {careTruth()}
    </p>
  );
}
