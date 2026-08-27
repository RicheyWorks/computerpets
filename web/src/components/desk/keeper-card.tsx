import { useEffect, useState } from "react";
import {
  ADVERTISED_CARE,
  DESK_PORT,
  HEARTBEAT_URL,
  KEEPER_CARE,
  KEEPER_KICKER,
  UNREAD_HEARTBEAT,
  careTruth,
  heartbeatLine,
  keeperMeters,
  parseHeartbeat,
  type Heartbeat,
} from "@/lib/pets/keeper";
import {
  applyFeedFor,
  applyPlay,
  applyRest,
  blankCare,
  loadCare,
  saveCare,
  stageOf,
  type CareStats,
} from "@/lib/pets/care";
import { RED_PANDA_KIND } from "@/lib/pets/living";
import { cn } from "@/lib/utils";

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
    { id: KEEPER_CARE[0]!.id, label: KEEPER_CARE[0]!.label, onClick: onFeed },
    { id: KEEPER_CARE[1]!.id, label: KEEPER_CARE[1]!.label, onClick: onPlay },
    { id: KEEPER_CARE[2]!.id, label: KEEPER_CARE[2]!.label, onClick: onRest },
  ];

  return (
    <article className={cn("keeper-card", className)} aria-label="Keeper card" data-keeper-poster>
      <p className="keeper-kicker">{KEEPER_KICKER}</p>
      <h2 className="keeper-name">{name}</h2>
      <p className="keeper-stage">{stage}</p>
      <p className="keeper-bond-title">{meters.bondTitle}</p>
      <dl className="keeper-meters">
        <Meter label="Hunger" value={meters.hunger} />
        <Meter label="Rest" value={meters.rest} />
        <Meter label="Bond" value={meters.bond} />
      </dl>
      <div className="keeper-care" role="toolbar" aria-label="Care">
        {verbs.map((verb) => (
          <button
            key={verb.id}
            type="button"
            data-care={verb.id}
            disabled={busy}
            onClick={verb.onClick}
          >
            {verb.label}
          </button>
        ))}
      </div>
      <p className="keeper-heartbeat" data-heartbeat={beat.status}>
        {heartbeatLine(beat)}
      </p>
      <p className="keeper-truth">
        {careTruth()} Desk {DESK_PORT}. Not {ADVERTISED_CARE.feed}.
      </p>
    </article>
  );
}

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
      <i style={{ ["--w" as string]: `${value}%` }} />
    </div>
  );
}

/** Rui sits the Meet door. Same card. Care stays on her desk key. */
export function MeetKeeperCard({ className }: { className?: string }) {
  const kind = RED_PANDA_KIND;
  const [stats, setStats] = useState<CareStats>(() => blankCare());

  useEffect(() => {
    setStats(loadCare(kind.localKey, undefined, kind.key));
  }, [kind.key, kind.localKey]);

  function tend(next: CareStats) {
    saveCare(kind.localKey, next);
    setStats(next);
  }

  return (
    <KeeperCard
      className={className}
      name={kind.name}
      stage={stageOf(stats)}
      stats={stats}
      onFeed={() => tend(applyFeedFor(kind.key, stats))}
      onPlay={() => tend(applyPlay(stats))}
      onRest={() => tend(applyRest(stats))}
    />
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
    <p className={cn("keeper-heartbeat", className)} data-heartbeat={beat.status}>
      {heartbeatLine(beat)} · {careTruth()}
    </p>
  );
}
