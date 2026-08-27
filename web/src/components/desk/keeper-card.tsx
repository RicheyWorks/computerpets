import { useEffect, useMemo, useState } from "react";
import {
  ADVERTISED_CARE,
  DESK_PORT,
  HEARTBEAT_URL,
  KEEPER_CARE,
  KEEPER_KICKER,
  QUIT_TRUTH,
  UNREAD_HEARTBEAT,
  VOICE_TRUTH,
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
import {
  CARD_COLORS,
  MUTE_BUSES,
  VOICE_STYLES,
  addLine,
  alarmDue,
  formatRemain,
  guestOf,
  lineById,
  loadCard,
  markAlarmRang,
  pickSystemVoice,
  removeLine,
  saveCard,
  setGuest,
  speakOpts,
  startTimer,
  stopTimer,
  timerTick,
  type CardPrefs,
  type SavedKind,
} from "@/lib/pets/card";
import { playDeskSound } from "@/lib/pets/desk-audio";
import { cn } from "@/lib/utils";

export function KeeperCard({
  name,
  stage,
  stats,
  busy,
  guestKey = "red_panda",
  onFeed,
  onPlay,
  onRest,
  onSay,
  onDo,
  onOff,
  className,
}: {
  name: string;
  stage: string;
  stats: Pick<CareStats, "hunger" | "energy" | "bond">;
  busy?: boolean;
  guestKey?: string;
  onFeed: () => void;
  onPlay: () => void;
  onRest: () => void;
  onSay?: (text: string) => void;
  onDo?: (text: string) => void;
  onOff?: () => void;
  className?: string;
}) {
  const meters = keeperMeters(stats);
  const [beat, setBeat] = useState<Heartbeat>(UNREAD_HEARTBEAT);
  const [card, setCard] = useState<CardPrefs>(() => loadCard());
  const [draft, setDraft] = useState("");
  const [offArmed, setOffArmed] = useState(false);
  const guest = useMemo(() => guestOf(card, guestKey), [card, guestKey]);

  function write(next: CardPrefs) {
    setCard(saveCard(next));
  }

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

  useEffect(() => {
    const id = window.setInterval(() => {
      const live = loadCard();
      const g = guestOf(live, guestKey);
      if (alarmDue(g.alarm)) {
        g.alarm = markAlarmRang(g.alarm);
        const next = setGuest(live, guestKey, g);
        write(next);
        const line = lineById(next, guestKey, g.alarm.lineId);
        playHouse(line?.kind ?? "say", line?.text ?? "The clock asked.");
        return;
      }
      if (g.timer.running) {
        const tick = timerTick(g.timer);
        g.timer = tick.timer;
        const next = setGuest(live, guestKey, g);
        write(next);
        if (tick.rang) {
          const line = lineById(next, guestKey, g.timer.lineId);
          playHouse(line?.kind ?? "say", line?.text ?? "The timer is done.");
        }
      }
    }, 1000);
    return () => window.clearInterval(id);
    // playHouse is stable enough for the desk tick
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guestKey]);

  const verbs = [
    { id: KEEPER_CARE[0]!.id, label: KEEPER_CARE[0]!.label, onClick: onFeed },
    { id: KEEPER_CARE[1]!.id, label: KEEPER_CARE[1]!.label, onClick: onPlay },
    { id: KEEPER_CARE[2]!.id, label: KEEPER_CARE[2]!.label, onClick: onRest },
  ];

  function playHouse(kind: SavedKind, text: string) {
    if (kind === "do" && onDo) {
      onDo(text);
      return;
    }
    if (onSay) onSay(text);
    else speakBrowser(text);
  }

  function speakBrowser(text: string) {
    if (!text || !("speechSynthesis" in window)) return;
    if (card.mutes.talk) return;
    window.speechSynthesis.cancel();
    const opts = speakOpts(card.voiceStyle, guest.volume);
    const u = new SpeechSynthesisUtterance(text);
    u.rate = opts.rate;
    u.pitch = opts.pitch;
    u.volume = opts.volume;
    const picked = pickSystemVoice(window.speechSynthesis.getVoices(), card.voiceStyle);
    if (picked && "voiceURI" in picked) u.voice = picked as SpeechSynthesisVoice;
    window.speechSynthesis.speak(u);
  }

  return (
    <article
      className={cn("keeper-card", className)}
      aria-label="Keeper card"
      data-keeper-poster
      data-color={card.color}
      data-collapsed={card.collapsed ? "1" : "0"}
      onClick={(e) => {
        const hit = (e.target as HTMLElement).closest("button, input, label, [data-care]");
        if (hit || card.collapsed) return;
        write({ ...card, collapsed: true });
      }}
    >
      <button
        type="button"
        className="keeper-collapse"
        data-card="collapse"
        aria-expanded={!card.collapsed}
        onClick={(e) => {
          e.stopPropagation();
          write({ ...card, collapsed: !card.collapsed });
        }}
      >
        <p className="keeper-kicker">{KEEPER_KICKER}</p>
        <h2 className="keeper-name">{name}</h2>
      </button>
      {card.collapsed ? null : (
        <div className="keeper-body">
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
                onClick={(e) => {
                  e.stopPropagation();
                  verb.onClick();
                }}
              >
                {verb.label}
              </button>
            ))}
          </div>
          <label className="keeper-volume">
            Voice
            <input
              type="range"
              min={0}
              max={100}
              value={guest.volume}
              onChange={(e) => write(setGuest(card, guestKey, { volume: Number(e.target.value) }))}
              onClick={(e) => e.stopPropagation()}
            />
          </label>
          <div className="keeper-colors" role="group" aria-label="Card color">
            {CARD_COLORS.map((color) => (
              <button
                key={color.id}
                type="button"
                data-on={card.color === color.id ? "1" : "0"}
                onClick={(e) => {
                  e.stopPropagation();
                  write({ ...card, color: color.id });
                }}
              >
                {color.name}
              </button>
            ))}
          </div>
          <div className="keeper-voices" role="group" aria-label="Voice style">
            {VOICE_STYLES.map((style) => (
              <button
                key={style.id}
                type="button"
                data-on={card.voiceStyle === style.id ? "1" : "0"}
                onClick={(e) => {
                  e.stopPropagation();
                  write({ ...card, voiceStyle: style.id });
                }}
              >
                {style.name}
              </button>
            ))}
          </div>
          <p className="keeper-truth">{VOICE_TRUTH}</p>
          <div className="keeper-lines">
            <label>
              Saved line
              <input
                type="text"
                maxLength={140}
                value={draft}
                placeholder="A house line."
                onChange={(e) => setDraft(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </label>
            <div className="keeper-line-row">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  write(addLine(card, guestKey, draft, "say"));
                  setDraft("");
                }}
              >
                Save say
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  write(addLine(card, guestKey, draft, "do"));
                  setDraft("");
                }}
              >
                Save do
              </button>
            </div>
            <ul className="keeper-line-list">
              {guest.lines.map((line) => (
                <li key={line.id}>
                  <span>
                    {line.kind === "do" ? "Do" : "Say"} · {line.text}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      playHouse(line.kind, line.text);
                    }}
                  >
                    Play
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      write(removeLine(card, guestKey, line.id));
                    }}
                  >
                    Drop
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="keeper-clocks">
            <label>
              Alarm
              <input
                type="time"
                value={`${String(guest.alarm.hour).padStart(2, "0")}:${String(guest.alarm.minute).padStart(2, "0")}`}
                onChange={(e) => {
                  const [h, m] = e.target.value.split(":");
                  write(setGuest(card, guestKey, { alarm: { ...guest.alarm, hour: Number(h), minute: Number(m) } }));
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </label>
            <button
              type="button"
              data-on={guest.alarm.on ? "1" : "0"}
              onClick={(e) => {
                e.stopPropagation();
                write(setGuest(card, guestKey, { alarm: { ...guest.alarm, on: !guest.alarm.on } }));
              }}
            >
              {guest.alarm.on ? "On" : "Off"}
            </button>
            <label>
              Timer
              <input
                type="number"
                min={1}
                max={180}
                value={Math.max(1, Math.round(guest.timer.durationMs / 60_000))}
                onChange={(e) =>
                  write(setGuest(card, guestKey, { timer: { ...guest.timer, durationMs: Math.max(1, Number(e.target.value) || 5) * 60_000 } }))
                }
                onClick={(e) => e.stopPropagation()}
              />
              min
            </label>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                write(
                  setGuest(card, guestKey, {
                    timer: guest.timer.running ? stopTimer(guest.timer) : startTimer(guest.timer, guest.timer.durationMs),
                  }),
                );
              }}
            >
              {guest.timer.running ? "Stop" : "Start"}
            </button>
            <p className="keeper-timer-left">{formatRemain(guest.timer.remainingMs)}</p>
          </div>
          <div className="keeper-mutes" role="group" aria-label="Mute">
            {MUTE_BUSES.map((bus) => (
              <button
                key={bus}
                type="button"
                data-on={card.mutes[bus] ? "1" : "0"}
                onClick={(e) => {
                  e.stopPropagation();
                  write({ ...card, mutes: { ...card.mutes, [bus]: !card.mutes[bus] } });
                  if (bus === "special" && !card.mutes[bus]) playDeskSound("hop", guestKey);
                }}
              >
                {card.mutes[bus] ? `Muted ${bus}` : `Mute ${bus}`}
              </button>
            ))}
          </div>
          <div className="keeper-off">
            <button
              type="button"
              data-card="off"
              onClick={(e) => {
                e.stopPropagation();
                if (!offArmed) {
                  setOffArmed(true);
                  return;
                }
                write({ ...card, off: true });
                onOff?.();
              }}
            >
              {offArmed ? "Off" : "Turn off"}
            </button>
            <p className="keeper-truth">{QUIT_TRUTH}</p>
          </div>
          <p className="keeper-heartbeat" data-heartbeat={beat.status}>
            {heartbeatLine(beat)}
          </p>
          <p className="keeper-truth">
            {careTruth()} Desk {DESK_PORT}. Not {ADVERTISED_CARE.feed}.
          </p>
        </div>
      )}
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
  const [hidden, setHidden] = useState(() => loadCard().off);

  useEffect(() => {
    setStats(loadCare(kind.localKey, undefined, kind.key));
  }, [kind.key, kind.localKey]);

  function tend(next: CareStats) {
    saveCare(kind.localKey, next);
    setStats(next);
  }

  if (hidden) {
    return (
      <article className={cn("keeper-card", className)} aria-label="Keeper card" data-keeper-poster>
        <p className="keeper-kicker">{KEEPER_KICKER}</p>
        <h2 className="keeper-name">{kind.name}</h2>
        <p className="keeper-truth">{QUIT_TRUTH}</p>
        <button
          type="button"
          onClick={() => {
            saveCard({ ...loadCard(), off: false });
            setHidden(false);
          }}
        >
          Sit again
        </button>
      </article>
    );
  }

  return (
    <KeeperCard
      className={className}
      name={kind.name}
      stage={stageOf(stats)}
      stats={stats}
      guestKey={kind.key}
      onFeed={() => tend(applyFeedFor(kind.key, stats))}
      onPlay={() => tend(applyPlay(stats))}
      onRest={() => tend(applyRest(stats))}
      onOff={() => setHidden(true)}
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
