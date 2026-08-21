import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { BlotterMarks, DayWash, type BlotterMark, randomLureX, randomTreatX } from "@/components/desk/blotter";
import { BlotterCare, type CareMark } from "@/components/desk/blotter-care";
import { DenCabinet } from "@/components/desk/den-cabinet";
import { LivingPet, type PetCommand } from "@/components/desk/living-pet";
import { HouseVisit } from "@/components/desk/house-visit";
import { DeskGrain, RoomWash } from "@/components/desk/room-wash";
import { todaysVisitor } from "@/lib/pets/visitor";
import {
  applyBath,
  applyCall,
  applyClean,
  applyFeedFor,
  applyHide,
  applyMedicine,
  applyPlay,
  applyPraise,
  applyRest,
  applySnackFor,
  loadCare,
  leaveGift,
  maybeBondLine,
  normalizeCare,
  pickGift,
  pickMess,
  saveCare,
  stageOf,
  tickCare,
  type CareStats,
  type LifeStage,
  type SanctuaryCare,
} from "@/lib/pets/care";
import { saveActiveKindKey, type LivingKind } from "@/lib/pets/living";
import { converseWithPet } from "@/lib/pets/talk";
import { unlockDeskAudio } from "@/lib/pets/desk-audio";
import { useMindBinding, useMindSettings } from "@/lib/ai/use-mind";
import { traitFor } from "@/lib/pets/traits";
import { SNACK_LINE, callLine, dayPartLabel, dayPart, hideLine, isRestingHour, rememberVisit, returnLine } from "@/lib/pets/hours";
import { weatherIdle, weatherLabel, weatherLine, weatherOf } from "@/lib/pets/weather";
import { applySpecial } from "@/lib/pets/specials";
import { applyShed, isBlue, isSnake, shedLine, shedWaitLine } from "@/lib/pets/shed";
import { GIFT_LINE, treatFor } from "@/lib/pets/treats";
import { appendJournal, loadJournal } from "@/lib/pets/journal";
import { SpeciesPlaque } from "@/components/desk/species-plaque";
import { GuestChoice } from "@/components/desk/guest-choice";
import { roomOf } from "@/lib/pets/rooms";
import { playClaim } from "@/lib/pets/play";
import { colonyOf, colonyWord, isHivePlace, stampColony } from "@/lib/pets/hive";
import { isPhone, isTablet, readSit, tabletOrient, type TabletOrient } from "@/lib/pets/tablet-desk";
import { phoneOrient, type PhoneOrient } from "@/lib/pets/phone-desk";
import { guestMarks, guestPick, guestTap, type GuestChoiceId } from "@/lib/pets/guest-choice";

type DeskCare = "rest" | "clean" | "medicine" | "bath" | "praise";

function liveDeskCare(kind: LivingKind, persistLocal: boolean, seed?: Partial<CareStats>): CareStats {
  const fallback = seed ?? { hunger: 78, mood: 80, energy: 82 };
  const live = persistLocal ? loadCare(kind.localKey, fallback, kind.key) : normalizeCare(fallback);
  return isHivePlace(kind.key) ? stampColony(live) : live;
}

/** Desk local save keeps its own line; sanctuary meters overlay. Guest rooms take the remote line. */
function mergePersist(local: CareStats, remote: CareStats): CareStats {
  return {
    ...local,
    hunger: remote.hunger,
    mood: remote.mood,
    energy: remote.energy,
    hygiene: remote.hygiene,
    health: remote.health,
    lastTick: remote.lastTick,
    bornAt: remote.bornAt || local.bornAt,
  };
}

export function CompanionRoom({
  kind,
  name,
  stage,
  seed,
  guestKey,
  persistLocal = true,
  liveTick = false,
  onCare,
  onSelectKind,
  typedTalk = false,
  journal = false,
  phone = false,
  tablet = false,
  line,
  detail,
  extraCare,
  extraMarks,
  aside,
  footer,
}: {
  kind: LivingKind;
  name?: string;
  stage?: LifeStage;
  seed?: Partial<CareStats>;
  guestKey?: string;
  persistLocal?: boolean;
  /** Age in memory without writing the kept guest. /demo uses this. */
  liveTick?: boolean;
  onCare?: (action: SanctuaryCare) => Promise<CareStats | void>;
  onSelectKind?: (key: string) => void;
  typedTalk?: boolean;
  journal?: boolean;
  phone?: boolean;
  tablet?: boolean;
  line?: ReactNode;
  detail?: string;
  extraCare?: { label: string; action: DeskCare }[];
  extraMarks?: CareMark[];
  aside?: ReactNode;
  footer?: ReactNode;
}) {
  const displayName = name ?? kind.name;
  const mind = useMindBinding(kind.key);
  const mindSettings = useMindSettings();
  const trait = traitFor(kind.key);
  const [stats, setStats] = useState<CareStats>(() => liveDeskCare(kind, persistLocal, seed));
  const [speech, setSpeech] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [latestNote, setLatestNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [mark, setMark] = useState<BlotterMark | null>(null);
  const [leaving, setLeaving] = useState(false);
  const [order, setOrder] = useState<{ cmd: PetCommand; id: number }>({ cmd: "wander", id: 1 });
  const speechUntil = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const statsRef = useRef(stats);
  const markRef = useRef(mark);
  const takenRef = useRef(false);
  const acted = useRef(false);
  statsRef.current = stats;
  markRef.current = mark;
  const resetKey = guestKey ?? kind.key;
  const careRef = useRef<HTMLDivElement>(null);
  const [autoTablet, setAutoTablet] = useState(false);
  const [autoPhone, setAutoPhone] = useState(false);
  const [orient, setOrient] = useState<TabletOrient>("blotter");
  const [handOrient, setHandOrient] = useState<PhoneOrient>("blotter");
  const [tending, setTending] = useState(false);
  const [choiceOpen, setChoiceOpen] = useState(false);
  const pad = tablet || (!phone && autoTablet);
  const hand = phone || (!pad && autoPhone);

  useEffect(() => {
    function measure() {
      const sit = readSit(window);
      if (!phone && !tablet) {
        setAutoTablet(isTablet(sit));
        setAutoPhone(isPhone(sit));
      }
      setOrient(tabletOrient(window.innerWidth, window.innerHeight));
      setHandOrient(phoneOrient(window.innerWidth, window.innerHeight));
    }
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, [phone, tablet]);

  useEffect(() => {
    if (persistLocal) saveCare(kind.localKey, stats);
  }, [kind.localKey, persistLocal, stats]);

  useEffect(() => {
    if (!persistLocal && !liveTick) return;
    function age() {
      setStats((s) => {
        const live = tickCare(kind.key, s);
        if (
          live.hunger === s.hunger &&
          live.mood === s.mood &&
          live.energy === s.energy &&
          live.hygiene === s.hygiene &&
          live.health === s.health &&
          live.sick === s.sick &&
          live.mess === s.mess &&
          live.gifts === s.gifts
        ) {
          return s;
        }
        return live;
      });
    }
    const id = window.setInterval(() => {
      if (document.hidden) return;
      age();
    }, 20_000);
    function onVis() {
      if (!document.hidden) age();
    }
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [kind.key, persistLocal, liveTick]);

  useEffect(() => {
    if (!journal) {
      setLatestNote(null);
      return;
    }
    const mine = loadJournal().find((entry) => entry.species === kind.key);
    setLatestNote(mine?.text ?? null);
  }, [journal, kind.key]);

  const note = useCallback(
    (text: string) => {
      if (!journal) return;
      const next = appendJournal({ name: displayName, species: kind.key, text });
      setLatestNote(next[0]?.text ?? text);
    },
    [displayName, journal, kind.key],
  );

  const say = useCallback((text: string, hold = 4200) => {
    setSpeech(text);
    speechUntil.current = performance.now() + hold;
  }, []);

  const issue = useCallback((cmd: PetCommand) => {
    setOrder((o) => ({ cmd, id: o.id + 1 }));
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (speech && performance.now() > speechUntil.current) setSpeech(null);
    }, 350);
    return () => window.clearInterval(id);
  }, [speech]);

  useEffect(() => {
    kind.preload();
    acted.current = false;
    takenRef.current = false;
    setMark(null);
    setLeaving(false);
    setChoiceOpen(false);
    const live = liveDeskCare(kind, persistLocal, seed);
    setStats(live);
    const t = window.setTimeout(() => {
      if (acted.current) return;
      say(
        returnLine(persistLocal ? rememberVisit(kind.key) : 0) ??
          weatherLine(kind.key, weatherOf()) ??
          kind.greetLine(),
        5200,
      );
      issue("talk");
    }, 500);
    return () => window.clearTimeout(t);
    // seed is a mount snapshot; guestKey / kind change is the reset
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind, resetKey, persistLocal, issue, say]);

  useEffect(() => {
    if (!speech && order.cmd === "talk") issue("sit");
  }, [speech, order.cmd, issue]);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.hidden || busy || statsRef.current.hidden) return;
      if (performance.now() < speechUntil.current) return;
      if (statsRef.current.hunger < 26) {
        say(kind.ambientLine(statsRef.current));
        issue("wander");
        return;
      }
      const skyMood = weatherIdle(kind.key, weatherOf());
      if (skyMood && Math.random() < 0.45) {
        issue(skyMood);
        return;
      }
      if (isRestingHour(kind.key) && statsRef.current.energy < 88) {
        issue("sleep");
        return;
      }
      const roll = Math.random();
      if (roll < trait.wander) issue("wander");
      else if (roll < trait.wander + 0.22) issue(statsRef.current.energy < 35 ? "sleep" : "sit");
      else if (roll < trait.wander + 0.4) issue("idle");
      else {
        say(kind.ambientLine(statsRef.current));
        issue("talk");
      }
    }, 5200);
    return () => window.clearInterval(id);
  }, [busy, issue, say, kind, trait.wander]);

  async function playVoice(src?: string, text?: string) {
    if (src) {
      audioRef.current?.pause();
      const audio = new Audio(src);
      audioRef.current = audio;
      try {
        await audio.play();
        return;
      } catch {
        /* fall through */
      }
    }
    if (text && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.92;
      u.pitch = 1.1;
      window.speechSynthesis.speak(u);
    }
  }

  async function persist(action: SanctuaryCare): Promise<CareStats | null> {
    if (!onCare) return null;
    setBusy(true);
    try {
      const remote = await onCare(action);
      if (remote) {
        const next = persistLocal ? mergePersist(statsRef.current, remote) : normalizeCare(remote);
        setStats(next);
        return next;
      }
      return statsRef.current;
    } finally {
      setBusy(false);
    }
  }

  async function talk(message?: string) {
    if (busy) return;
    acted.current = true;
    unlockDeskAudio();
    setBusy(true);
    issue("talk");
    try {
      const res = await converseWithPet({
        data: {
          message,
          hunger: stats.hunger,
          mood: stats.mood,
          energy: stats.energy,
          hygiene: stats.hygiene,
          name: displayName,
          species: kind.key,
          speak: mindSettings.voice !== "none",
          mind,
          voice: mindSettings.voice,
        },
      });
      say(res.text, Math.min(9000, 2200 + res.text.length * 55));
      await playVoice(res.audio, res.text);
    } catch {
      say(message ? kind.listenLine() : kind.ambientLine(stats));
    } finally {
      setBusy(false);
    }
  }

  function dropTreatAt(x: number) {
    if (busy || stats.hidden || leaving) return;
    acted.current = true;
    unlockDeskAudio();
    takenRef.current = false;
    setMark({ kind: "treat", x: Math.max(8, Math.min(90, x)) });
    issue("seek");
  }

  function startChase() {
    if (busy || stats.hidden || leaving) return;
    acted.current = true;
    unlockDeskAudio();
    takenRef.current = false;
    setMark({ kind: "lure", x: randomLureX() });
    say(trait.special === "bug" ? "There. A bug." : "A ribbon. Catch it.");
    issue("seek");
  }

  async function catchLure() {
    const act = playClaim("catch", {
      taken: takenRef.current,
      cmd: order.cmd,
      mark: markRef.current?.kind ?? null,
    });
    if (act !== "play") return;
    takenRef.current = true;
    markRef.current = null;
    setMark(null);
    const prev = statsRef.current;
    if (onCare) {
      try {
        await persist("play");
      } catch {
        return;
      }
    } else {
      setStats(applyPlay(prev));
    }
    say("You caught it first. I still win.");
    note(`${displayName} played.`);
    const next = statsRef.current;
    const lineBond = maybeBondLine(prev.bond, next.bond);
    if (lineBond) window.setTimeout(() => say(lineBond), 900);
    issue("play");
  }

  function fleeLure(x: number) {
    if (stats.hidden || leaving) return;
    setMark({ kind: "lure", x, hops: 1 });
    issue("seek");
  }

  function hide() {
    if (busy || stats.hidden) return;
    acted.current = true;
    say(hideLine(kind.key));
    setLeaving(true);
    issue("leave");
    note(`${displayName} slipped off the blotter.`);
  }

  function callBack() {
    if (busy) return;
    acted.current = true;
    setLeaving(false);
    setStats((s) => applyCall(s));
    say(callLine(kind.key));
    issue("enter");
    note(`${displayName} came back.`);
  }

  async function feed() {
    if (busy || stats.hidden) return;
    acted.current = true;
    unlockDeskAudio();
    if (onCare) {
      try {
        await persist("feed");
      } catch {
        return;
      }
    } else {
      setStats((s) => applyFeedFor(kind.key, s));
    }
    say(kind.careLine("feed"));
    note(`${displayName} ate.`);
    issue("eat");
  }

  async function tend(action: DeskCare) {
    if (busy) return;
    acted.current = true;
    unlockDeskAudio();
    const persistable = action === "rest" || action === "clean" || action === "medicine";
    if (onCare && persistable) {
      try {
        await persist(action);
      } catch {
        return;
      }
    } else {
      setStats(
        action === "rest"
          ? applyRest
          : action === "clean"
            ? applyClean
            : action === "medicine"
              ? applyMedicine
              : action === "bath"
                ? applyBath
                : applyPraise,
      );
    }
    say(
      action === "rest"
        ? kind.careLine("rest")
        : action === "clean"
          ? "The blotter is honest again."
          : action === "bath"
            ? "Water. Then dignity."
            : action === "medicine"
              ? "Bitter. I will invoice you in kindness."
              : kind.fallbackLine("good", stats),
    );
    note(action === "rest" ? `${displayName} slept.` : `${displayName} was tended.`);
    issue(action === "rest" ? "sleep" : "sit");
  }

  function doSpecial() {
    acted.current = true;
    unlockDeskAudio();
    const next = applySpecial(statsRef.current, trait);
    const gifted = leaveGift(next.stats);
    setStats(gifted);
    say(trait.line);
    note(`${displayName}: ${trait.line}`);
    issue(next.cmd);
  }

  function pickFirstGift() {
    const gift = statsRef.current.gifts[0];
    if (!gift) return;
    const prev = statsRef.current;
    const next = pickGift(prev, gift.id);
    setStats(next);
    say(GIFT_LINE[kind.key] ?? "I left this.");
    note(`${displayName} left a gift.`);
    const bond = maybeBondLine(prev.bond, next.bond);
    if (bond) window.setTimeout(() => say(bond), 900);
  }

  function pickGuest(id: GuestChoiceId) {
    setChoiceOpen(false);
    if (id === "rest") void tend("rest");
    else if (id === "walk") issue("wander");
    else if (id === "sit") issue("sit");
    else if (id === "talk") void talk();
    else if (id === "treat") dropTreatAt(randomTreatX());
    else if (id === "play") startChase();
    else if (id === "special") doSpecial();
    else if (id === "hide") hide();
    else if (id === "call") callBack();
    else if (id === "pick") pickFirstGift();
  }

  const room = roomOf(kind.key);
  const gait = useMemo(() => ({ ...trait, scale: trait.scale * 1.24 }), [trait]);
  const hive = isHivePlace(kind.key) ? colonyOf(stats, stats.hidden) : null;
  const hour = isBlue(stats, kind.key) ? "Blue" : dayPartLabel(dayPart());
  const sky = weatherLabel(weatherOf());
  const caller = todaysVisitor(kind.key).name;
  const busyOrHidden = busy || stats.hidden;
  const age = stage ?? stageOf(stats);

  return (
    <section
      className="relative isolate h-dvh min-h-[520px] w-full overflow-hidden bg-elevated"
      data-tablet-floor={pad ? "" : undefined}
      data-tablet-orient={pad ? orient : undefined}
      data-tablet-tending={pad && tending ? "" : undefined}
      data-phone-floor={hand ? "" : undefined}
      data-phone-orient={hand ? handOrient : undefined}
      data-phone-tending={hand && tending ? "" : undefined}
    >
      <img
        src="/habitat.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[center_72%]"
      />
      <DayWash />
      <RoomWash room={room.id} />
      <DeskGrain />

      <BlotterMarks
        mark={mark}
        hidden={stats.hidden}
        treatShape={treatFor(kind.key).shape}
        onDropTreat={dropTreatAt}
        onCatchLure={() => void catchLure()}
        onFlee={fleeLure}
      />

      <LivingPet
        key={resetKey}
        command={order.cmd}
        orderId={order.id}
        speech={speech}
        sprites={kind.sprites}
        fps={kind.fps}
        once={kind.once}
        gait={gait}
        kind={kind.key}
        hidden={stats.hidden}
        unwell={stats.sick}
        dull={isBlue(stats, kind.key) || !!(hive && hive.quiet)}
        stage={age}
        seekX={mark?.x}
        onArrived={() => {
          const act = playClaim("arrive", {
            taken: takenRef.current,
            cmd: order.cmd,
            mark: markRef.current?.kind ?? null,
          });
          if (act === "hide") {
            setStats((s) => applyHide(s));
            setLeaving(false);
            return;
          }
          if (act === "snack") {
            setMark(null);
            const prev = statsRef.current;
            const next = applySnackFor(kind.key, prev);
            setStats(next);
            say(SNACK_LINE[kind.key] ?? "A small treaty.");
            note(`${displayName} found the treat.`);
            const bond = maybeBondLine(prev.bond, next.bond);
            if (bond) window.setTimeout(() => say(bond), 900);
            issue("eat");
            return;
          }
          if (act === "play") {
            takenRef.current = true;
            markRef.current = null;
            setMark(null);
            const prev = statsRef.current;
            const finishPlay = (next: CareStats) => {
              setStats(next);
              say(kind.careLine("play"));
              note(`${displayName} played.`);
              const bond = maybeBondLine(prev.bond, next.bond);
              if (bond) window.setTimeout(() => say(bond), 900);
              issue("play");
            };
            if (onCare) {
              void persist("play")
                .then((remote) => finishPlay(remote ?? applyPlay(prev)))
                .catch(() => undefined);
            } else {
              finishPlay(applyPlay(prev));
            }
            return;
          }
          if (act === "idle") {
            issue("idle");
          }
        }}
        onTap={() => {
          if (guestTap() !== "choice") return;
          setChoiceOpen((open) => !open);
        }}
        onTend={() => {
          setTending(true);
          careRef.current?.querySelector("button")?.focus();
          window.setTimeout(() => setTending(false), 1600);
        }}
      />
      <HouseVisit hostKey={kind.key} hidden={stats.hidden || leaving} />

      {choiceOpen ? (
        <GuestChoice
          marks={guestMarks({
            hidden: stats.hidden,
            leaving,
            walking: order.cmd === "wander" || order.cmd === "seek" || order.cmd === "play" || order.cmd === "enter",
            gifts: stats.gifts.length,
            treatVerb: treatFor(kind.key).verb,
            specialVerb: trait.verb,
          })}
          onPick={(id) => {
            const picked = guestPick(id);
            if (picked) pickGuest(picked);
          }}
          phone={hand}
          tablet={pad}
        />
      ) : null}

      {stats.gifts.map((gift) => (
        <button
          key={gift.id}
          type="button"
          aria-label="Pick up a gift"
          className={`${gift.kind === "shed" ? "desk-shed" : "desk-gift"} absolute z-10`}
          style={{ left: `${gift.x}%`, bottom: "20%" }}
          onClick={() => {
            const prev = statsRef.current;
            const next = pickGift(prev, gift.id);
            setStats(next);
            say(GIFT_LINE[kind.key] ?? "I left this.");
            note(`${displayName} left a gift.`);
            const bond = maybeBondLine(prev.bond, next.bond);
            if (bond) window.setTimeout(() => say(bond), 900);
          }}
        />
      ))}
      {stats.mess.map((pile) => (
        <button
          key={pile.id}
          type="button"
          aria-label="Clean a mess"
          className="absolute z-10 h-3.5 w-5 rounded-full bg-[#5a4a34]/80 shadow-sm"
          style={{ left: `${pile.x}%`, bottom: "19%" }}
          onClick={() => {
            const next = pickMess(statsRef.current, pile.id);
            setStats(next);
            say("The blotter is honest again.");
            note(`${displayName}'s desk was picked up.`);
          }}
        />
      ))}

      <aside
        className={
          hand
            ? handOrient === "sit"
              ? "absolute left-[max(0.75rem,env(safe-area-inset-left))] right-24 top-[calc(3.25rem+env(safe-area-inset-top))] z-20 max-w-[min(100%-7rem,16rem)]"
              : "absolute left-4 right-16 top-[calc(4.25rem+env(safe-area-inset-top))] z-20 max-w-[min(100%-5rem,18rem)]"
            : pad
              ? orient === "sit"
                ? "absolute left-4 right-16 top-[calc(5.5rem+env(safe-area-inset-top))] z-20 max-w-[min(100%-2rem,22rem)]"
                : "absolute left-[max(1.5rem,env(safe-area-inset-left))] top-[calc(5.5rem+env(safe-area-inset-top))] z-20 max-w-[min(100%-2rem,22rem)]"
              : "absolute left-4 top-20 z-20 max-w-[min(100%-2rem,20rem)] sm:left-8 sm:top-24"
        }
      >
        <p className="text-[11px] uppercase tracking-[0.2em] text-subtle">
          {hive ? `${colonyWord(hive)} · Brood · ${hive.brood} · Stores · ${hive.stores} · ` : ""}
          {hour} · {sky} · {caller} may call
          {detail ? ` · ${detail}` : ""}
        </p>
        <h1 className={hand ? "mt-2 font-display text-4xl leading-none" : "mt-2 font-display text-5xl leading-none sm:text-6xl"}>
          {displayName}
        </h1>
        <p className="mt-3 max-w-sm text-sm text-muted">{kind.tagline}</p>
        {line}
        {latestNote ? <p className="mt-2 max-w-sm text-xs text-subtle">{latestNote}</p> : null}
        <SpeciesPlaque speciesKey={kind.key} compact paper className="mt-5 max-w-sm" showDemoLink={false} />
        {aside}
      </aside>

      <div
        className={
          hand
            ? "absolute right-[max(0.75rem,env(safe-area-inset-right))] top-[calc(4.25rem+env(safe-area-inset-top))] z-20 max-w-[9rem] text-right"
            : pad
              ? "absolute right-[max(1rem,env(safe-area-inset-right))] top-[calc(5.5rem+env(safe-area-inset-top))] z-20 max-w-[11rem] text-right"
              : "absolute right-4 top-20 z-20 max-w-[11rem] text-right sm:right-8 sm:top-24"
        }
      >
        <DenCabinet currentRoom={room.id} currentKey={kind.key} drawers onSelectKind={onSelectKind} />
      </div>

      <div
        className={
          hand
            ? handOrient === "sit"
              ? "pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-2 px-[max(0.75rem,env(safe-area-inset-left))] pe-[max(0.75rem,env(safe-area-inset-right))] pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-10"
              : "pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-end gap-2 px-[max(0.75rem,env(safe-area-inset-left))] pe-[max(1rem,env(safe-area-inset-right))] pb-[max(1rem,env(safe-area-inset-bottom))] pt-10"
            : pad
              ? "pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-3 px-[max(1rem,env(safe-area-inset-left))] pe-[max(1rem,env(safe-area-inset-right))] pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-16"
              : "pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-3 px-4 pb-5 pt-16 sm:px-8"
        }
      >
        <div className="pointer-events-auto" ref={careRef}>
          <BlotterCare
            className={hand ? "blotter-care-phone" : pad ? "blotter-care-tablet" : undefined}
            marks={[
              { label: "Feed", onClick: () => void feed(), disabled: busyOrHidden },
              { label: treatFor(kind.key).verb, onClick: () => dropTreatAt(randomTreatX()), disabled: busyOrHidden },
              { label: "Play", onClick: startChase, disabled: busyOrHidden },
              {
                label: trait.verb,
                disabled: busy,
                onClick: doSpecial,
              },
              ...(isSnake(kind.key)
                ? [
                    {
                      label: "Shed",
                      disabled: busy,
                      onClick: () => {
                        acted.current = true;
                        unlockDeskAudio();
                        if (!isBlue(statsRef.current, kind.key)) {
                          say(shedWaitLine(kind.key));
                          issue("sit");
                          return;
                        }
                        void (async () => {
                          if (onCare && !persistLocal) {
                            try {
                              await persist("shed");
                            } catch {
                              return;
                            }
                          } else {
                            setStats(applyShed(statsRef.current));
                          }
                          say(shedLine(kind.key));
                          note(`${displayName} shed.`);
                          issue("sit");
                        })();
                      },
                    },
                  ]
                : []),
              ...(extraCare ?? []).map((mark) => ({
                label: mark.label,
                disabled: busy,
                onClick: () => void tend(mark.action),
              })),
              ...(extraMarks ?? []),
              { label: "Talk", onClick: () => void talk(), disabled: busy },
              stats.hidden || leaving
                ? { label: "Call back", onClick: callBack, disabled: busy }
                : { label: "Hide", onClick: hide, disabled: busy },
            ]}
          />
        </div>
        {typedTalk ? (
          <form
            className="pointer-events-auto flex w-full max-w-md items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const msg = draft.trim();
              if (!msg) return;
              setDraft("");
              void talk(msg);
            }}
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              maxLength={200}
              placeholder={`Say something to ${displayName}`}
              className="h-10 min-w-0 flex-1 rounded-[var(--radius-sm)] border border-border/60 bg-bg/40 px-3 text-sm text-fg outline-none placeholder:text-subtle focus:ring-2 focus:ring-primary/30"
            />
            <button
              type="submit"
              className="blotter-ink text-[11px] uppercase tracking-[0.16em]"
              disabled={busy || !draft.trim()}
            >
              Send
            </button>
          </form>
        ) : null}
        <div className="pointer-events-auto text-center text-[11px] uppercase tracking-[0.16em] text-subtle">
          {footer ?? (
            <p>
              <Link
                to="/"
                search={{ pet: kind.key }}
                onClick={() => saveActiveKindKey(kind.key)}
                className="text-fg no-underline hover:text-primary"
              >
                Open the desk
              </Link>
              {" · "}
              <Link to="/live" search={{ pet: kind.key }} className="text-muted no-underline hover:text-fg">
                Phone
              </Link>
              {" · "}
              <Link to={room.path} className="text-muted no-underline hover:text-fg">
                {room.kicker}
              </Link>
              {" · "}
              <Link to="/meet" className="text-muted no-underline hover:text-fg">
                The house
              </Link>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
