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
import { playDeskSound, playStep, playVoice } from "@/lib/pets/desk-audio";
import { STEP_KINDS, STEP_LABELS, parseStep, stepOf } from "@/lib/pets/house-sounds";
import { HOUSE_LOOP_LICENSE, MUSIC_PLUGINS, RADIO_CANT_REACH, RADIO_EMPTY, RADIO_LABEL, RADIO_LOCAL, RADIO_PLACEHOLDER, mergeStations, parseMusic, parseStations, playSrc, radioSearchUrls, rankStations, type MusicPrefs, type RadioStation } from "@/lib/pets/house-music";
import { currentArea, parseAreas } from "@/lib/pets/weather-areas";
import { FLY_BIRD_NAME } from "@/lib/pets/bird-fly";
import { CALL_EMPTY, callKeys, groups as callGroups } from "@/lib/pets/call-guests";
import { LIVING_KINDS } from "@/lib/pets/living";
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
  onCallBird,
  onCallGuests,
  onMusicChange,
  onCollapse,
  stayOpen,
  openTick,
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
  onCallBird?: () => void;
  onCallGuests?: (keys: string[]) => void;
  onMusicChange?: (on: boolean) => void;
  onCollapse?: () => void;
  stayOpen?: boolean;
  openTick?: number;
  className?: string;
}) {
  const meters = keeperMeters(stats);
  const [beat, setBeat] = useState<Heartbeat>(UNREAD_HEARTBEAT);
  const [card, setCard] = useState<CardPrefs>(() => loadCard());
  const [draft, setDraft] = useState("");
  const [offArmed, setOffArmed] = useState(false);
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [radioUnread, setRadioUnread] = useState(false);
  const [radioEmpty, setRadioEmpty] = useState(false);
  const [radioQ, setRadioQ] = useState("");
  const [callQ, setCallQ] = useState("");
  const [callPick, setCallPick] = useState("");
  const [callGroup, setCallGroup] = useState("");
  const [callTruth, setCallTruth] = useState("");
  const guest = useMemo(() => guestOf(card, guestKey), [card, guestKey]);
  const dens = useMemo(() => callGroups(), []);
  const callRoster = useMemo(
    () => LIVING_KINDS.map((k) => ({ key: k.key, slug: k.slug, name: k.name, speciesLabel: k.speciesLabel })).sort((a, b) => a.name.localeCompare(b.name)),
    [],
  );
  const music = parseMusic(card.music);
  const houseStep = parseStep(card.stepKind);

  function write(next: CardPrefs) {
    setCard(saveCard(next));
  }

  function writeMusic(next: MusicPrefs) {
    write({ ...card, music: next });
    onMusicChange?.(!!next.playing && next.plugin !== "off");
  }

  function hideCard() {
    write({ ...card, collapsed: true });
    onCollapse?.();
  }

  function weatherRadioArea() {
    return currentArea(parseAreas(card));
  }

  function lookupRadio(query: string) {
    const area = weatherRadioArea();
    const urls = radioSearchUrls(query, area);
    if (!urls.length) {
      setStations([]);
      setRadioUnread(false);
      setRadioEmpty(true);
      return;
    }
    void Promise.all(
      urls.map((url) =>
        fetch(url, { cache: "no-store", headers: { Accept: "application/json" } })
          .then((r) => r.json())
          .then((json) => parseStations(json))
          .catch(() => null),
      ),
    )
      .then((batches) => {
        if (batches.every((b) => b == null)) {
          setRadioUnread(true);
          setRadioEmpty(false);
          setStations([]);
          return;
        }
        const merged = mergeStations(batches.filter((b): b is RadioStation[] => !!b));
        const next = rankStations(merged, query, area).slice(0, 16);
        setStations(next);
        setRadioUnread(false);
        setRadioEmpty(!next.length);
      })
      .catch(() => {
        setRadioUnread(true);
        setRadioEmpty(false);
      });
  }

  useEffect(() => {
    if (!openTick) return;
    write({ ...loadCard(), collapsed: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openTick]);

  useEffect(() => {
    const src = playSrc(music);
    if (!src || card.mutes.music) {
      onMusicChange?.(false);
      return;
    }
    const audio = new Audio(src);
    audio.loop = music.plugin === "house";
    audio.volume = Math.max(0, Math.min(1, guest.volume / 100));
    void audio.play().then(() => onMusicChange?.(true)).catch(() => onMusicChange?.(false));
    return () => {
      audio.pause();
      audio.src = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [music.plugin, music.playing, music.stationUrl, card.mutes.music, guest.volume]);

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

  function runCall() {
    const keys = callKeys(callQ || callPick, callRoster, callGroup || null);
    setCallTruth(keys.length ? "" : CALL_EMPTY);
    if (!keys.length) return;
    if (keys.includes("hummingbird")) onCallBird?.();
    onCallGuests?.(keys);
  }

  if (card.collapsed && !stayOpen) return null;

  return (
    <article
      className={cn("keeper-card", className)}
      aria-label="Keeper card"
      data-keeper-poster
      data-color={card.color}
      data-collapsed="0"
      onClick={(e) => {
        const hit = (e.target as HTMLElement).closest("button, input, label, select, [data-care]");
        if (hit) return;
        hideCard();
      }}
    >
      <button
        type="button"
        className="keeper-collapse"
        data-card="collapse"
        aria-expanded="true"
        onClick={(e) => {
          e.stopPropagation();
          hideCard();
        }}
      >
        <p className="keeper-kicker">{KEEPER_KICKER}</p>
        <h2 className="keeper-name">{name}</h2>
      </button>
      {(
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
                  if (bus === "steps" && !card.mutes[bus]) playStep(guestKey);
                }}
              >
                {card.mutes[bus] ? `Muted ${bus}` : `Mute ${bus}`}
              </button>
            ))}
          </div>
          <div className="keeper-steps" role="group" aria-label="Footsteps">
            <p>Footsteps</p>
            {STEP_KINDS.map((kind) => (
              <button
                key={kind}
                type="button"
                data-on={houseStep === kind ? "1" : "0"}
                onClick={(e) => {
                  e.stopPropagation();
                  write({ ...card, stepKind: kind });
                  if (kind !== "mute") playStep(guestKey);
                }}
              >
                {STEP_LABELS[kind]}
              </button>
            ))}
            <p className="keeper-truth">Now {STEP_LABELS[stepOf(houseStep, guest.stepKind, guestKey)]}. House-wide, or this guest if you pick on their card later.</p>
          </div>
          {guestKey === "red_panda" ? (
            <div className="keeper-music" data-hit>
              <p>Music · Rui</p>
              {MUSIC_PLUGINS.map((plugin) => (
                <button
                  key={plugin.id}
                  type="button"
                  data-on={music.plugin === plugin.id ? "1" : "0"}
                  onClick={(e) => {
                    e.stopPropagation();
                    writeMusic({ ...music, plugin: plugin.id, playing: plugin.id !== "off" });
                  }}
                >
                  {plugin.name}
                </button>
              ))}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  writeMusic({ ...music, playing: !music.playing && music.plugin !== "off" });
                }}
              >
                {music.playing ? "Stop" : "Play"}
              </button>
              {music.plugin === "house" ? <p className="keeper-truth">{HOUSE_LOOP_LICENSE}</p> : null}
              {music.plugin === "radio" ? (
                <>
                  <p className="keeper-truth">{MUSIC_PLUGINS[2]!.license}</p>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      lookupRadio(radioQ);
                    }}
                  >
                    <label>
                      {RADIO_LABEL}
                      <input
                        type="text"
                        autoComplete="off"
                        spellCheck={false}
                        value={radioQ}
                        onChange={(e) => setRadioQ(e.target.value)}
                        placeholder={RADIO_PLACEHOLDER}
                        aria-label={RADIO_LABEL}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </label>
                    <button type="submit">Find</button>
                    {weatherRadioArea() ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRadioQ("");
                          lookupRadio("");
                        }}
                      >
                        {RADIO_LOCAL}
                      </button>
                    ) : null}
                  </form>
                  {radioUnread ? <p className="keeper-truth">{RADIO_CANT_REACH}</p> : null}
                  {radioEmpty ? <p className="keeper-truth">{RADIO_EMPTY}</p> : null}
                  <ul className="keeper-line-list">
                    {stations.map((st) => (
                      <li key={st.id}>
                        <button
                          type="button"
                          data-on={music.stationId === st.id ? "1" : "0"}
                          onClick={(e) => {
                            e.stopPropagation();
                            writeMusic({ ...music, plugin: "radio", stationId: st.id, stationName: st.name, stationUrl: st.url, playing: true });
                          }}
                        >
                          {st.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                  {music.stationName ? <p>Now {music.stationName}. No now-playing inventing.</p> : null}
                </>
              ) : null}
            </div>
          ) : null}
          <div className="keeper-call">
            <p>Call a guest</p>
            <label>
              Guest
              <select
                aria-label="Call guest dropdown"
                value={callPick}
                onChange={(e) => setCallPick(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              >
                <option value="">Pick a guest</option>
                {callRoster.map((row) => (
                  <option key={row.key} value={row.name}>
                    {row.name} · {row.speciesLabel}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Name or group
              <input
                type="text"
                autoComplete="off"
                spellCheck={false}
                value={callQ}
                onChange={(e) => setCallQ(e.target.value)}
                placeholder="Rui, Sip, plant…"
                aria-label="Call by name or group"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    runCall();
                  }
                }}
              />
            </label>
            <label>
              Den
              <select
                aria-label="Call by den"
                value={callGroup}
                onChange={(e) => setCallGroup(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              >
                <option value="">Pick a den</option>
                {dens.map((den) => (
                  <option key={den.id} value={den.id}>
                    {den.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="keeper-line-row">
              <button
                type="button"
                data-card="call-go"
                onClick={(e) => {
                  e.stopPropagation();
                  runCall();
                }}
              >
                Call
              </button>
              <button
                type="button"
                data-card="call-bird"
                onClick={(e) => {
                  e.stopPropagation();
                  playVoice("hummingbird");
                  onCallBird?.();
                }}
              >
                Call {FLY_BIRD_NAME}
              </button>
            </div>
            {callTruth ? <p className="keeper-truth">{callTruth}</p> : null}
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
      stayOpen
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
