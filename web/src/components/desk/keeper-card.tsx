import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  KEEPER_CARE,
  KEEPER_KICKER,
  QUIT_TRUTH,
  VOICE_TRUTH,
  careTruth,
  heartbeatDetail,
  heartbeatTone,
  heartbeatLine,
  heartbeatPoll,
  keeperMeters,
  type Heartbeat,
} from "@/lib/pets/keeper";
import { UNREAD_LISTENER, presentListener, type ListenerName } from "@/lib/ai/listener";
import { listenerReadBody } from "@/lib/ai/listener-post";
import { readMindListener } from "@/lib/ai/listener-read";
import { useMindBinding } from "@/lib/ai/use-mind";
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
  afterDrop,
  clockTick,
  createCardTickReader,
  formatRemain,
  guestOf,
  lineById,
  loadCard,
  pickSystemVoice,
  removeLine,
  saveCard,
  setGuest,
  speakOpts,
  startTimer,
  stopTimer,
  type CardPrefs,
  type SavedKind,
} from "@/lib/pets/card";
import { playDeskSound, playStep, playVoice } from "@/lib/pets/desk-audio";
import { STEP_KINDS, STEP_LABELS, parseStep, stepOf } from "@/lib/pets/house-sounds";
import { HOUSE_LOOP_LICENSE, HOUSE_MUSIC_LABEL, MUSIC_PLUGINS, houseMusicToggle, sharedMusicHint, sharedMusicShows, RADIO_CANT_REACH, RADIO_EMPTY, RADIO_FIND, RADIO_LABEL, RADIO_LOCAL, RADIO_PLACEHOLDER, openStationStream, parseMusic, playSrc, radioHonesty, radioMaySend, readRadioSearch, streamHonesty, streamMaySend, type MusicPrefs, type RadioStation } from "@/lib/pets/house-music";
import { SLEEP_AID_LABEL, SLEEP_AID_LICENSE, SLEEP_AID_MUTE_TRUTH, SLEEP_AID_PLUGINS, parseSleepAid, playSrc as sleepPlaySrc, type SleepAidPrefs } from "@/lib/pets/house-sleep";
import { currentArea, parseAreas } from "@/lib/pets/weather-areas";
import { FLY_BIRD_NAME } from "@/lib/pets/bird-fly";
import { CALL_EMPTY, callKeys, groups as callGroups } from "@/lib/pets/call-guests";
import { classifyKey } from "@/lib/pets/presence";
import { LIVING_KINDS } from "@/lib/pets/living";
import { cn } from "@/lib/utils";
import { RETRY_LABEL, soundInterrupted, soundProblem, type SoundWhat } from "@/lib/plain-error";

/** The clock's read: parses the saved card only when its stored text changed. */
const readCardForTick = createCardTickReader();

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
  /** `keys` is true when Escape closed the card, so the room can put focus on its open button. */
  onCollapse?: (how?: { keys?: boolean }) => void;
  stayOpen?: boolean;
  openTick?: number;
  className?: string;
}) {
  const meters = keeperMeters(stats);
  const beat = useHeartbeat();
  const [listener, setListener] = useState<ListenerName>(UNREAD_LISTENER);
  const asked = useMindBinding(guestKey);
  const askedPlugin = asked.plugin;
  const askedBase = asked.baseUrl;
  const [card, setCard] = useState<CardPrefs>(() => loadCard());
  const [draft, setDraft] = useState("");
  /** A keyboard Drop removes its own button; focus goes to the line that slid up (or the field). */
  const draftInput = useRef<HTMLInputElement>(null);
  const lineList = useRef<HTMLUListElement>(null);
  const dropFocus = useRef<number | null>(null);
  const [offArmed, setOffArmed] = useState(false);
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [radioUnread, setRadioUnread] = useState(false);
  const [radioEmpty, setRadioEmpty] = useState(false);
  const [radioQ, setRadioQ] = useState("");
  const [streamAsked, setStreamAsked] = useState(false);
  /** Music or sleep sounds the keeper turned on that did not play, and why. Try again bumps soundTry. */
  const [soundLine, setSoundLine] = useState<{ what: SoundWhat; line: string } | null>(null);
  const soundLineId = useId();
  const [soundTry, setSoundTry] = useState(0);
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
  const sleepAid = parseSleepAid(card.sleepAid);
  const houseStep = parseStep(card.stepKind);

  function write(next: CardPrefs) {
    setCard(saveCard(next));
  }

  function writeMusic(next: MusicPrefs, asked = streamAsked) {
    write({ ...card, music: next });
    const remote = next.plugin === "radio" && !!next.stationUrl;
    onMusicChange?.(!!next.playing && next.plugin !== "off" && (!remote || asked));
  }

  function commitMusic(next: MusicPrefs) {
    const ask = next.plugin === "radio" && !!next.playing && !!next.stationUrl;
    if (ask) setStreamAsked(true);
    writeMusic(next, ask || streamAsked);
  }

  function writeSleepAid(next: SleepAidPrefs) {
    write({ ...card, sleepAid: next });
  }

  function hideCard(how?: { keys?: boolean }) {
    write({ ...card, collapsed: true });
    onCollapse?.(how);
  }

  useEffect(() => {
    const at = dropFocus.current;
    if (at == null) return;
    dropFocus.current = null;
    const drops = [...(lineList.current?.querySelectorAll<HTMLButtonElement>("[data-line-drop]") ?? [])];
    const next = afterDrop(at, drops.length);
    (next < 0 ? draftInput.current : drops[next])?.focus();
  }, [guest.lines.length]);

  function weatherRadioArea() {
    return currentArea(parseAreas(card));
  }

  function lookupRadio(query: string) {
    const el = document.getElementById("hud-radio-net");
    const line = radioHonesty();
    const shown = !!el && !!line && (el.textContent || "").includes(line);
    if (!radioMaySend(shown)) return;
    void readRadioSearch(line, query, weatherRadioArea())
      .then((stations) => {
        if (stations == null) return;
        setStations(stations);
        setRadioUnread(false);
        setRadioEmpty(!stations.length);
      })
      .catch(() => {
        setRadioUnread(true);
        setRadioEmpty(false);
        setStations([]);
      });
  }

  useEffect(() => {
    if (!openTick) return;
    write({ ...loadCard(), collapsed: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openTick]);

  function soundOk(what: SoundWhat) {
    setSoundLine((was) => (was?.what === what ? null : was));
  }

  useEffect(() => {
    const src = playSrc(music);
    if (!src || card.mutes.music) {
      soundOk("music");
      onMusicChange?.(false);
      return;
    }
    const remote = music.plugin === "radio" && /^https?:/i.test(src);
    let audio: HTMLAudioElement;
    if (remote) {
      const line = streamHonesty(music);
      const el = document.getElementById("hud-stream-net");
      const shown = streamAsked === true && !!el && !el.hidden ? el.textContent || "" : "";
      // Not sent until the stream line is shown: a held stream is the honesty gate, not a failure (quiet).
      if (!streamMaySend(music, !!line && shown.includes(line))) {
        onMusicChange?.(false);
        return;
      }
      const opened = openStationStream(shown, music, src, (next) => new Audio(next));
      if (!opened) {
        onMusicChange?.(false);
        return;
      }
      audio = opened;
    } else {
      audio = new Audio(src);
    }
    audio.loop = music.plugin === "house";
    audio.volume = Math.max(0, Math.min(1, guest.volume / 100));
    let cancelled = false;
    void audio
      .play()
      .then(() => {
        if (cancelled) return;
        soundOk("music");
        onMusicChange?.(true);
      })
      .catch((err) => {
        if (cancelled) return;
        onMusicChange?.(false);
        // A pause or switch cuts play() short on purpose; anything else is said plainly.
        if (!soundInterrupted(err)) setSoundLine({ what: "music", line: soundProblem("music", err) });
      });
    return () => {
      cancelled = true;
      audio.pause();
      audio.src = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [music.plugin, music.playing, music.stationUrl, card.mutes.music, guest.volume, streamAsked, soundTry]);

  useEffect(() => {
    const src = sleepPlaySrc(sleepAid);
    if (!src || card.mutes.music) {
      soundOk("sleep");
      return;
    }
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = Math.max(0, Math.min(1, guest.volume / 100));
    let cancelled = false;
    void audio
      .play()
      .then(() => {
        if (!cancelled) soundOk("sleep");
      })
      .catch((err) => {
        if (cancelled || soundInterrupted(err)) return;
        setSoundLine({ what: "sleep", line: soundProblem("sleep", err) });
      });
    return () => {
      cancelled = true;
      audio.pause();
      audio.src = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sleepAid.plugin, sleepAid.playing, card.mutes.music, guest.volume, soundTry]);


  useEffect(() => {
    let cancelled = false;
    setListener(UNREAD_LISTENER);
    // Quiet by design: a failed read shows "Listening · not sure" in its own line, which is the truth.
    void readMindListener({ data: listenerReadBody({ plugin: askedPlugin, baseUrl: askedBase }) })
      .then((row) => {
        if (!cancelled) setListener(presentListener(row));
      })
      .catch(() => {
        if (!cancelled) setListener(UNREAD_LISTENER);
      });
    return () => {
      cancelled = true;
    };
  }, [askedPlugin, askedBase]);

  useEffect(() => {
    // since is the last look: a background tab ticks slowly, so a passed alarm minute still rings once.
    let since = Date.now();
    const id = window.setInterval(() => {
      const now = Date.now();
      const live = readCardForTick();
      const tick = clockTick(guestOf(live, guestKey), now, since);
      since = now;
      if (!tick.changed) return;
      const next = setGuest(live, guestKey, { alarm: tick.alarm, timer: tick.timer });
      write(next);
      if (!tick.rang) return;
      const line = lineById(next, guestKey, tick.lineId);
      playHouse(line?.kind ?? "say", line?.text ?? (tick.rang === "alarm" ? "The clock asked." : "The timer is done."));
    }, 1000);
    return () => window.clearInterval(id);
    // playHouse is stable enough for the desk tick
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guestKey]);

  const careClicks: Record<string, (() => void) | undefined> = {
    feed: onFeed,
    play: onPlay,
    rest: onRest,
  };
  const verbs = KEEPER_CARE.filter((v) => careClicks[v.id]).map((v) => ({
    id: v.id,
    label: v.label,
    onClick: careClicks[v.id]!,
  }));

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
      onKeyDown={(e) => {
        // Escape closes the card (a field keeps its own Escape, ADR 0012); the room focuses the open button.
        const note = classifyKey(e.nativeEvent);
        if (stayOpen || note.field || note.toggle !== "dismiss") return;
        e.stopPropagation();
        hideCard({ keys: true });
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
                aria-pressed={card.color === color.id}
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
                aria-pressed={card.voiceStyle === style.id}
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
                ref={draftInput}
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
            <ul className="keeper-line-list" ref={lineList}>
              {guest.lines.map((line, at) => (
                <li key={line.id}>
                  <span>
                    {line.kind === "do" ? "Do" : "Say"} · {line.text}
                  </span>
                  <button
                    type="button"
                    data-line-play={line.id}
                    aria-label={`Play: ${line.text}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      playHouse(line.kind, line.text);
                    }}
                  >
                    Play
                  </button>
                  <button
                    type="button"
                    data-line-drop={line.id}
                    aria-label={`Drop: ${line.text}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (document.activeElement === e.currentTarget) dropFocus.current = at;
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
              aria-label={guest.alarm.on ? "Alarm on" : "Alarm off"}
              aria-pressed={guest.alarm.on}
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
                aria-pressed={!!card.mutes[bus]}
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
                aria-pressed={houseStep === kind}
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
          <div className="keeper-sleep" data-hit role="group" aria-label="Sleep aid">
            <p>{SLEEP_AID_LABEL}</p>
            {SLEEP_AID_PLUGINS.map((plugin) => (
              <button
                key={plugin.id}
                type="button"
                data-on={sleepAid.plugin === plugin.id ? "1" : "0"}
                aria-pressed={sleepAid.plugin === plugin.id}
                data-sleep={plugin.id}
                onClick={(e) => {
                  e.stopPropagation();
                  writeSleepAid({ plugin: plugin.id, playing: plugin.id !== "off" });
                }}
              >
                {plugin.name}
              </button>
            ))}
            {sleepAid.plugin === "rain" ? <p className="keeper-truth">{SLEEP_AID_LICENSE}</p> : null}
            <p className="keeper-truth">{SLEEP_AID_MUTE_TRUTH}</p>
          </div>
          {sharedMusicShows(guestKey, music) ? (
            // House music plays for every guest, but only one guest's card has the full music block.
            // This small control lets any other card pause or play it; it is hidden where that block shows.
            <div className="keeper-music keeper-house-music" data-hit data-house-music role="group" aria-label={HOUSE_MUSIC_LABEL}>
              <p>{HOUSE_MUSIC_LABEL}</p>
              <button
                type="button"
                aria-pressed={houseMusicToggle(music, streamAsked).audible}
                onClick={(e) => {
                  e.stopPropagation();
                  commitMusic(houseMusicToggle(music, streamAsked).next);
                }}
              >
                {houseMusicToggle(music, streamAsked).label}
              </button>
              {music.plugin === "radio" ? (
                <p id="hud-stream-net" className="keeper-truth" hidden={!streamAsked || !streamHonesty(music)}>
                  {streamAsked ? streamHonesty(music) : ""}
                </p>
              ) : null}
            </div>
          ) : null}
          {sharedMusicHint(guestKey, music) ? (
            // Off, or radio with no station: nothing for the shared Pause/Play yet, so say where to pick.
            <p className="keeper-truth" data-house-music-hint>
              {sharedMusicHint(guestKey, music)}
            </p>
          ) : null}
          {soundLine ? (
            <p className="keeper-truth" role="status" aria-live="polite" data-sound-problem={soundLine.what}>
              <span id={soundLineId}>{soundLine.line}</span>{" "}
              <button
                type="button"
                aria-describedby={soundLineId}
                onClick={(e) => {
                  e.stopPropagation();
                  setSoundLine(null);
                  setSoundTry((n) => n + 1);
                }}
              >
                {RETRY_LABEL}
              </button>
            </p>
          ) : null}
          {guestKey === "red_panda" ? (
            <div className="keeper-music" data-hit>
              <p>Music · Rui</p>
              {music.plugin !== "off" ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const remoteStream = music.plugin === "radio" && !!music.stationUrl;
                    const audible = music.playing && (!remoteStream || streamAsked);
                    commitMusic({ ...music, playing: !audible && music.plugin !== "off" });
                  }}
                >
                  {music.playing && (music.plugin !== "radio" || !music.stationUrl || streamAsked) ? "Pause" : "Play"}
                </button>
              ) : null}
              {music.plugin === "radio" ? (
                <p id="hud-stream-net" className="keeper-truth" hidden={!streamAsked || !streamHonesty(music)}>
                  {streamAsked ? streamHonesty(music) : ""}
                </p>
              ) : null}
              {MUSIC_PLUGINS.map((plugin) => (
                <button
                  key={plugin.id}
                  type="button"
                  data-on={music.plugin === plugin.id ? "1" : "0"}
                  onClick={(e) => {
                    e.stopPropagation();
                    commitMusic({ ...music, plugin: plugin.id, playing: plugin.id !== "off" });
                  }}
                >
                  {plugin.name}
                </button>
              ))}
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
                    <p id="hud-radio-net" className="keeper-truth">
                      {RADIO_FIND}
                    </p>
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
                            commitMusic({ ...music, plugin: "radio", stationId: st.id, stationName: st.name, stationUrl: st.url, playing: true });
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
          <p className="keeper-heartbeat" data-heartbeat={heartbeatTone(beat, heartbeatPoll.answered())} title={heartbeatDetail(beat)}>
            {heartbeatLine(beat, heartbeatPoll.answered())}
          </p>
          {/* No GPU line on the web page: a browser cannot read the GPU, so it would always say "no reading". The desktop app and the blotter show it. */}
          <p className="keeper-listener" data-listener={listener.id}>
            {listener.line}
          </p>
          <p className="keeper-truth">{careTruth()}</p>
        </div>
      )}
    </article>
  );
}

/** One care meter: the text for sighted keepers, and a named 0-100 meter for screen readers. */
function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
      <i
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-valuetext={`${value} of 100`}
        style={{ ["--w" as string]: `${value}%` }}
      />
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

/**
 * The heartbeat every keeper surface shows, from the one shared poll (lib/pets/keeper.ts heartbeatPoll):
 * one fetch every 15 seconds however many cards and lines are on the page.
 * Quiet by design: an unreachable house server says so in the heartbeat line itself, and the read
 * repeats, so no separate problem line or retry button. "House server stopped answering (optional).
 * Pets still work." is only for a server that answered this session and then stopped; one that never
 * answered reads "House server not running (optional)". Port and profile sit in the line's tooltip.
 * The line re-renders on each beat, so `heartbeatPoll.answered()` is read fresh.
 */
function useHeartbeat(): Heartbeat {
  const [beat, setBeat] = useState<Heartbeat>(() => heartbeatPoll.current());
  useEffect(() => heartbeatPoll.subscribe(setBeat), []);
  return beat;
}

export function KeeperHeartbeat({ className }: { className?: string }) {
  const beat = useHeartbeat();

  return (
    <p className={cn("keeper-heartbeat", className)} data-heartbeat={heartbeatTone(beat, heartbeatPoll.answered())} title={heartbeatDetail(beat)}>
      {heartbeatLine(beat, heartbeatPoll.answered())} · {careTruth()}
    </p>
  );
}
