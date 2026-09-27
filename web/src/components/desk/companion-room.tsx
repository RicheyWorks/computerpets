import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
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
  leaveGift,
  maybeBondLine,
  normalizeCare,
  pickGift,
  pickMess,
  saveCare,
  stageOf,
  switchGuest,
  tickCare,
  type CareStats,
  type LifeStage,
  type SanctuaryCare,
} from "@/lib/pets/care";
import { saveActiveKindKey, type LivingKind } from "@/lib/pets/living";
import { converseWithPet } from "@/lib/pets/talk";
import { talkBody, talkUsesPlugin } from "@/lib/pets/talk-post";
import { talkHonesty, voiceHonesty } from "@/lib/pets/talk-net";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { playDeskSound, unlockDeskAudio } from "@/lib/pets/desk-audio";
import { loadCard, saveCard, wanderWhileAsleep, isMuted, pickSystemVoice, speakOpts, guestOf, prefersHouseCry } from "@/lib/pets/card";
import { useMindBinding, useMindSettings } from "@/lib/ai/use-mind";
import { traitFor } from "@/lib/pets/traits";
import { SNACK_LINE, callLine, dayPartLabel, dayPart, hideLine, isRestingHour, rememberVisit, returnLine } from "@/lib/pets/hours";
import { weatherIdle, weatherLabel, weatherLine, weatherOf, type Weather } from "@/lib/pets/weather";
import { blankAreas, currentArea } from "@/lib/pets/weather-areas";
import { DeskMarketPlate, DeskNewsPlate, DeskWeatherPlate, WEATHER_ID } from "@/components/desk/desk-plates";
import { BirdFlyer } from "@/components/desk/bird-fly";
import { RobinFlyer } from "@/components/desk/robin-fly";
import { DeskPlants } from "@/components/desk/desk-plants";
import { CalledGuests } from "@/components/desk/called-guests";
import { FLY_BIRD_KEY } from "@/lib/pets/bird-fly";
import { ROBIN_KEY } from "@/lib/pets/robin-fly";
import { nextAutoMeet, shouldRobinFly, walkersOf } from "@/lib/pets/call-guests";
import { playVoice as playAnimalVoice } from "@/lib/pets/desk-audio";
import { dropRibbon, RIBBON_CATCH, RIBBON_SPECIAL, stealRibbon } from "@/lib/pets/ribbon";
import type { LiveSky } from "@/lib/pets/weather-areas";
import { applySpecial } from "@/lib/pets/specials";
import { applyShed, isBlue, isSnake, shedLine, shedWaitLine } from "@/lib/pets/shed";
import { GIFT_LINE, treatFor } from "@/lib/pets/treats";
import { appendJournal, loadJournal } from "@/lib/pets/journal";
import { SpeciesPlaque } from "@/components/desk/species-plaque";
import { KeeperCard } from "@/components/desk/keeper-card";
import { GuestChoice } from "@/components/desk/guest-choice";
import { FirstHint } from "@/components/desk/first-hint";
import { DemoWindowPlate } from "@/components/desk/demo-window-plate";
import type { DeskWindow } from "@/lib/pets/windows";
import { roomOf } from "@/lib/pets/rooms";
import { playClaim } from "@/lib/pets/play";
import { colonyOf, colonyWord, isHivePlace, stampColony } from "@/lib/pets/hive";
import { isPhone, isTablet, readSit, tabletOrient, type TabletOrient } from "@/lib/pets/tablet-desk";
import { phoneOrient, type PhoneOrient } from "@/lib/pets/phone-desk";
import { guestMarks, guestPick, guestTap, type GuestChoiceId } from "@/lib/pets/guest-choice";
import { classifyKey, installFileDropGuard } from "@/lib/pets/presence";
import { careNotSaved, RETRY_LABEL, talkProblem as talkProblemLine, type CareNotSavedAct } from "@/lib/plain-error";
import { everyVisible, petArtLabel, petTapLabel, roomLabel } from "@/lib/pets/keeper";

type DeskCare = "rest" | "clean" | "medicine" | "bath" | "praise";

function liveDeskCare(
  kind: LivingKind,
  persistLocal: boolean,
  seed?: Partial<CareStats>,
  leaving?: { localKey: string; stats: CareStats } | null,
): CareStats {
  const fallback = seed ?? { hunger: 78, mood: 80, energy: 82 };
  const live = switchGuest(
    persistLocal ? (leaving ?? null) : null,
    { localKey: kind.localKey, speciesKey: kind.key, seed: fallback },
    persistLocal,
  );
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
  demoWindow = false,
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
  /** /demo draws a window plate. Overlay uses real window rects. */
  demoWindow?: boolean;
}) {
  const displayName = name ?? kind.name;
  const mind = useMindBinding(kind.key);
  const mindSettings = useMindSettings();
  const { user, isPending } = useCurrentUserState();
  const signedIn = !isPending && user != null;
  const talkLine = signedIn ? talkHonesty(mind) : "";
  const voiceLine = signedIn ? voiceHonesty(mindSettings.voice) : "";
  const [talkAsked, setTalkAsked] = useState(false);
  const [voiceAsked, setVoiceAsked] = useState(false);
  const pendingTalk = useRef<{ message?: string } | null>(null);
  const [talkTick, setTalkTick] = useState(0);
  const trait = traitFor(kind.key);
  const [stats, setStats] = useState<CareStats>(() => liveDeskCare(kind, persistLocal, seed));
  const [speech, setSpeech] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [latestNote, setLatestNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  /** A care act (play, feed, rest, clean, medicine) the house could not save; the meters stayed put. */
  const [careProblem, setCareProblem] = useState<{ act: CareNotSavedAct; line: string } | null>(null);
  /** A talk turn that fell back to a house line, and why. `message` is re-sent by Try again. */
  const [talkProblem, setTalkProblem] = useState<{ line: string; message?: string } | null>(null);
  const [mark, setMark] = useState<BlotterMark | null>(null);
  const [leaving, setLeaving] = useState(false);
  const [order, setOrder] = useState<{ cmd: PetCommand; id: number }>({ cmd: "wander", id: 1 });
  const speechUntil = useRef(0);
  /** Ties each Try again to its problem line for screen readers. */
  const problemId = useId();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const statsRef = useRef(stats);
  const markRef = useRef(mark);
  const takenRef = useRef(false);
  const acted = useRef(false);
  statsRef.current = stats;
  markRef.current = mark;
  const resetKey = guestKey ?? kind.key;
  const sittingRef = useRef(kind.localKey);
  const careRef = useRef<HTMLDivElement>(null);
  const roomRef = useRef<HTMLElement>(null);
  /** The sit choice was opened with Enter or Space on the pet: focus goes into it, then back to the pet. */
  const choiceByKeys = useRef(false);
  /** After a keyboard open or Escape on the keeper card: where focus goes once the card has (un)rendered. */
  const cardFocus = useRef<"card" | "open" | null>(null);
  const [autoTablet, setAutoTablet] = useState(false);
  const [autoPhone, setAutoPhone] = useState(false);
  const [orient, setOrient] = useState<TabletOrient>("blotter");
  const [handOrient, setHandOrient] = useState<PhoneOrient>("blotter");
  const [tending, setTending] = useState(false);
  const [choiceOpen, setChoiceOpen] = useState(false);
  const [deskOff, setDeskOff] = useState(() => loadCard().off);
  const [deskWindows, setDeskWindows] = useState<DeskWindow[]>([]);
  const [weatherWin, setWeatherWin] = useState<DeskWindow | null>(null);
  const [liveSky, setLiveSky] = useState<LiveSky | null>(null);
  const [birdCall, setBirdCall] = useState(1);
  const [birdOn, setBirdOn] = useState(false);
  const [robinCall, setRobinCall] = useState(1);
  const [ruiLieHold, setRuiLieHold] = useState(false);
  const sipSleepCalled = useRef(false);
  const [calledKeys, setCalledKeys] = useState<string[]>([]);
  const [cardOpenTick, setCardOpenTick] = useState(0);
  const [cardOpen, setCardOpen] = useState(() => !loadCard().collapsed);
  const [musicOn, setMusicOn] = useState(() => !!loadCard().music?.playing);
  const poseRef = useRef<{ x: number; facing: 1 | -1 }>({ x: 120, facing: 1 });
  const skyNow = (): Weather => weatherOf(new Date(), currentArea({ ...blankAreas(), areas: loadCard().weatherAreas || [], currentId: loadCard().currentAreaId ?? null }) ? liveSky?.sky ?? null : null);
  const pad = tablet || (!phone && autoTablet);
  const hand = phone || (!pad && autoPhone);

  useEffect(() => installFileDropGuard(window), []);

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
    // Only write the guest who is sitting. A kind change must not pour this body onto the next slot.
    if (persistLocal && sittingRef.current === kind.localKey) saveCare(kind.localKey, stats);
  }, [kind.localKey, persistLocal, stats]);

  useEffect(() => {
    const sleeping = kind.key === "red_panda" && (!!stats.asleep || ruiLieHold) && !stats.hidden && !leaving;
    if (sleeping && !sipSleepCalled.current) {
      sipSleepCalled.current = true;
      if (!birdOn) setBirdCall((n) => n + 1);
    }
    if (!sleeping) sipSleepCalled.current = false;
  }, [birdOn, kind.key, leaving, ruiLieHold, stats.asleep, stats.hidden]);

  useEffect(() => {
    if (kind.key !== "red_panda" || stats.hidden || leaving) return;
    // A hidden tab pauses the house's auto-meet; it resumes when the room shows again.
    const stopMeet = everyVisible(() => {
      setCalledKeys((keys) => {
        const next = nextAutoMeet(keys, kind.key);
        return next ? [...keys, next] : keys;
      });
    }, 16000);
    const first = window.setTimeout(() => {
      setCalledKeys((keys) => {
        const next = nextAutoMeet(keys, kind.key);
        return next ? [...keys, next] : keys;
      });
    }, 4500);
    return () => {
      stopMeet();
      window.clearTimeout(first);
    };
  }, [kind.key, leaving, stats.hidden]);

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
    // A hidden tab stops the 20s care tick; showing the room ages them once and starts it again.
    return everyVisible(age, 20_000, { onResume: true });
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
    // Only while a line is up, and only while the room shows; on return an expired line clears at once.
    if (!speech) return;
    return everyVisible(
      () => {
        if (performance.now() > speechUntil.current) setSpeech(null);
      },
      350,
      { onResume: true },
    );
  }, [speech]);

  useEffect(() => {
    kind.preload();
    acted.current = false;
    takenRef.current = false;
    setMark(null);
    setLeaving(false);
    setChoiceOpen(false);
    const live = liveDeskCare(
      kind,
      persistLocal,
      seed,
      persistLocal && sittingRef.current !== kind.localKey
        ? { localKey: sittingRef.current, stats: statsRef.current }
        : null,
    );
    sittingRef.current = kind.localKey;
    if (kind.key === "red_panda") {
      live.hidden = false;
      live.asleep = false;
      live.sleepHeld = false;
    }
    setStats(live);
    const t = window.setTimeout(() => {
      if (acted.current) return;
      say(
        returnLine(persistLocal ? rememberVisit(kind.key) : 0) ??
          weatherLine(kind.key, skyNow()) ??
          kind.greetLine(),
        5200,
      );
      issue(kind.key === "red_panda" ? "wander" : "talk");
    }, 500);
    return () => window.clearTimeout(t);
    // seed is a mount snapshot; guestKey / kind change is the reset
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind, resetKey, persistLocal, issue, say]);

  useEffect(() => {
    if (!speech && order.cmd === "talk") issue(kind.key === "red_panda" ? "wander" : "sit");
  }, [speech, order.cmd, issue]);

  useEffect(() => {
    // Stopped while the tab is hidden; resumes when the room shows.
    return everyVisible(() => {
      if (busy || statsRef.current.hidden || deskOff) return;
      if (performance.now() < speechUntil.current) return;
      const held = wanderWhileAsleep(statsRef.current.asleep);
      if (held) {
        issue(held.cmd);
        return;
      }
      if (statsRef.current.hunger < 26) {
        say(kind.ambientLine(statsRef.current));
        issue("wander");
        return;
      }
      const skyMood = weatherIdle(kind.key, skyNow());
      if (skyMood && Math.random() < 0.45) {
        issue(skyMood);
        return;
      }
      if (kind.key !== "red_panda" && isRestingHour(kind.key) && statsRef.current.energy < 28 && !statsRef.current.asleep) {
        issue("sleep");
        return;
      }
      const roll = Math.random();
      if (kind.key === "red_panda") {
        if (roll < trait.wander || (statsRef.current.energy < 8 && roll < 0.7)) issue("wander");
        else if (roll < 0.84) issue("wander");
        else {
          say(kind.ambientLine(statsRef.current));
          issue("talk");
        }
        return;
      }
      if (roll < trait.wander || (statsRef.current.energy < 8 && roll < 0.7)) issue("wander");
      else if (roll < 0.7) issue("sit");
      else if (roll < 0.84) issue("idle");
      else {
        say(kind.ambientLine(statsRef.current));
        issue("talk");
      }
    }, 5200);
  }, [busy, deskOff, issue, say, kind, trait.wander, cardOpen]);

  useEffect(() => {
    if (deskOff) return;
    // Rain and wind taps stop while the tab is hidden and start again when it shows.
    return everyVisible(() => {
      const sky = skyNow();
      if ((sky === "rain" || sky === "wind") && Math.random() < 0.55) playDeskSound(sky, kind.key);
    }, 1000);
  }, [deskOff, kind.key]);

  async function playVoice(src?: string, text?: string) {
    if (!src && prefersHouseCry(kind.key)) {
      const cried = await playAnimalVoice(kind.key);
      if (cried) return;
      /* house cry missing or blocked — fall through to system speech */
    } else if (src) {
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
      const prefs = loadCard();
      if (isMuted(prefs.mutes, "chirp")) return;
      window.speechSynthesis.cancel();
      const opts = speakOpts(prefs.voiceStyle, guestOf(prefs, kind.key).volume);
      const u = new SpeechSynthesisUtterance(text);
      u.rate = opts.rate;
      u.pitch = opts.pitch;
      u.volume = opts.volume;
      const picked = pickSystemVoice(window.speechSynthesis.getVoices(), prefs.voiceStyle);
      if (picked && "voiceURI" in picked) u.voice = picked as SpeechSynthesisVoice;
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

  /**
   * A care act the house could not save: the meters stay where they were (persist only sets stats on
   * success) and one quiet line says why, with Try again.
   */
  function careFailed(act: CareNotSavedAct, err: unknown) {
    setCareProblem({ act, line: careNotSaved(act, err) });
  }

  /** A play the house could not save: as careFailed, and the claim and the mark are released. */
  function playNotSaved(err: unknown) {
    takenRef.current = false;
    markRef.current = null;
    setMark(null);
    careFailed("play", err);
  }

  /** Try again: re-send the act that was not saved. */
  function retryCare() {
    const act = careProblem?.act;
    if (!act || busy) return;
    if (act === "play") void retryPlay();
    else if (act === "feed") void feed();
    else void tend(act);
  }

  async function retryPlay() {
    if (busy) return;
    setCareProblem(null);
    const prev = statsRef.current;
    let next: CareStats;
    try {
      next = (await persist("play")) ?? statsRef.current;
    } catch (err) {
      playNotSaved(err);
      return;
    }
    say(kind.careLine("play"));
    note(`${displayName} played.`);
    const bond = maybeBondLine(prev.bond, next.bond);
    if (bond) window.setTimeout(() => say(bond), 900);
    issue("play");
  }

  function cloudLinesInView() {
    if (talkLine) {
      const el = document.getElementById("hud-talk-net");
      if (!talkAsked || !el || el.hidden || !(el.textContent || "").includes(talkLine)) return false;
    }
    if (voiceLine) {
      const el = document.getElementById("hud-voice-net");
      if (!voiceAsked || !el || el.hidden || !(el.textContent || "").includes(voiceLine)) return false;
    }
    return true;
  }

  async function sendTalk(message?: string) {
    if (busy) return;
    setBusy(true);
    issue("talk");
    try {
      const res = await converseWithPet({
        data: talkBody({
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
          ...(talkLine ? { talkLine } : {}),
          ...(voiceLine ? { voiceLine } : {}),
        }),
      });
      setTalkProblem(null);
      say(res.text, Math.min(9000, 2200 + res.text.length * 55));
      await playVoice(res.audio, res.text);
    } catch (err) {
      // The pet still answers with a house line; a quiet line says why. Raw text goes to the console only.
      say(message ? kind.listenLine() : kind.ambientLine(stats));
      setTalkProblem({ line: talkProblemLine(err, talkUsesPlugin(mind, mindSettings.voice)), message });
    } finally {
      setBusy(false);
    }
  }

  async function talk(message?: string) {
    if (busy || pendingTalk.current) return;
    acted.current = true;
    unlockDeskAudio();
    setStats((s) => ({ ...s, asleep: false }));
    if (talkLine || voiceLine) {
      setTalkAsked(!!talkLine);
      setVoiceAsked(!!voiceLine);
      if (!cloudLinesInView()) {
        pendingTalk.current = { message };
        setTalkTick((n) => n + 1);
        return;
      }
    }
    await sendTalk(message);
  }

  useEffect(() => {
    if (pendingTalk.current == null) return;
    if (!cloudLinesInView()) return;
    const message = pendingTalk.current.message;
    pendingTalk.current = null;
    void sendTalk(message);
    // The line has to be painted before the post. A load does not talk.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [talkTick, talkAsked, voiceAsked, talkLine, voiceLine]);

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
    setMark({ kind: "lure", x: randomLureX(), hops: 0, stolen: false, carried: false });
    say(trait.special === "bug" ? "There. A bug." : RIBBON_CATCH);
    issue("seek");
  }

  async function catchLure() {
    if (markRef.current?.carried) {
      const dropped = { ...dropRibbon(markRef.current, markRef.current.x), kind: "lure" as const };
      takenRef.current = false;
      markRef.current = dropped;
      setMark(dropped);
      return;
    }
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
      } catch (err) {
        playNotSaved(err);
        return;
      }
      setCareProblem(null);
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
    setMark({ kind: "lure", x, hops: 1, stolen: false, carried: false });
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
      } catch (err) {
        careFailed("feed", err);
        return;
      }
      setCareProblem(null);
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
    const saved = action === "rest" || action === "clean" || action === "medicine" ? action : null;
    if (onCare && saved) {
      try {
        await persist(saved);
      } catch (err) {
        careFailed(saved, err);
        return;
      }
      setCareProblem(null);
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
    if (trait.special === "ribbon") {
      takenRef.current = false;
      setMark({ kind: "lure", x: randomLureX(), hops: 0, stolen: false, carried: false });
      issue("seek");
      return;
    }
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

  useEffect(() => {
    if (!choiceByKeys.current) return;
    const room = roomRef.current;
    if (choiceOpen) {
      room?.querySelector<HTMLElement>("[data-guest-choice] button")?.focus();
      return;
    }
    choiceByKeys.current = false;
    room?.querySelector<HTMLElement>("[data-pet-hit]")?.focus();
  }, [choiceOpen]);

  useEffect(() => {
    const want = cardFocus.current;
    if (!want) return;
    cardFocus.current = null;
    const pick = want === "card" ? '[data-keeper-poster] [data-card="collapse"]' : '[data-card="open"]';
    // The card renders a beat after the room (its openTick effect), so look for it over a few frames.
    let tries = 0;
    let frame = 0;
    const find = () => {
      const el = roomRef.current?.querySelector<HTMLElement>(pick);
      if (el) el.focus();
      else if (tries++ < 6) frame = window.requestAnimationFrame(find);
    };
    find();
    return () => window.cancelAnimationFrame(frame);
  }, [cardOpen]);

  function openCardByKeys() {
    saveCard({ ...loadCard(), collapsed: false });
    cardFocus.current = "card";
    setCardOpen(true);
    setCardOpenTick((n) => n + 1);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const note = classifyKey(e);
      if (note.record || note.field || note.toggle !== "dismiss") return;
      if (!choiceOpen) return;
      setChoiceOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [choiceOpen]);

  function pickGuest(id: GuestChoiceId) {
    setChoiceOpen(false);
    // Close: dismiss menu only. Exit: leave pet care (collapse keeper card).
    if (id === "close") return;
    if (id === "exit") {
      setCardOpen(false);
      return;
    }
    if (id === "feed") void feed();
    else if (id === "rest") void tend("rest");
    else if (id === "walk") {
      setStats((s) => ({ ...s, asleep: false, sleepHeld: false }));
      issue("wander");
    }
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
  const sky = weatherLabel(skyNow());
  const caller = todaysVisitor(kind.key).name;
  const busyOrHidden = busy || stats.hidden;
  const age = stage ?? stageOf(stats);

  return (
    <section
      ref={roomRef}
      className="relative isolate h-dvh min-h-[520px] w-full overflow-hidden bg-elevated"
      aria-label={roomLabel(displayName)}
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
      <DayWash sky={skyNow()} />
      <RoomWash room={room.id} />
      <DeskGrain />
      {demoWindow ? (
        <DemoWindowPlate
          onBounds={(wins) => {
            setDeskWindows(weatherWin ? [...wins, weatherWin] : wins);
          }}
        />
      ) : null}
      {demoWindow ? (
        <DeskWeatherPlate
          onBounds={(win) => {
            setWeatherWin(win);
            setDeskWindows((prev) => {
              const others = prev.filter((w) => w.id !== WEATHER_ID);
              return win ? [...others, win] : others;
            });
          }}
          onSky={setLiveSky}
        />
      ) : null}
      {demoWindow ? <DeskNewsPlate /> : null}
      {demoWindow ? <DeskMarketPlate /> : null}

      <BlotterMarks
        mark={mark}
        hidden={stats.hidden}
        treatShape={treatFor(kind.key).shape}
        onDropTreat={dropTreatAt}
        onCatchLure={() => void catchLure()}
        onFlee={fleeLure}
        onDragLure={(x) => {
          takenRef.current = false;
          setMark((prev) => (prev && prev.kind === "lure" ? { ...dropRibbon(prev, x), kind: "lure", hops: 1 } : prev));
          issue("seek");
        }}
        poseRef={poseRef}
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
        hidden={stats.hidden || deskOff}
        asleep={!!stats.asleep}
        unwell={stats.sick}
        dull={isBlue(stats, kind.key) || !!(hive && hive.quiet)}
        stage={age}
        seekX={mark && !mark.carried ? mark.x : undefined}
        onPose={(x, facing) => {
          poseRef.current = { x, facing };
        }}
        onLieHold={setRuiLieHold}
        windows={demoWindow ? deskWindows : []}
        musicOn={kind.key === "red_panda" && musicOn}
        label={petArtLabel(displayName, { hidden: stats.hidden || deskOff, asleep: !!stats.asleep, unwell: stats.sick })}
        cardOpen={cardOpen}
        tapLabel={petTapLabel(displayName, "choice", petArtLabel(displayName, { hidden: stats.hidden || deskOff, asleep: !!stats.asleep, unwell: stats.sick }))}
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
            const prev = statsRef.current;
            const finishPlay = (next: CareStats) => {
              setCareProblem(null);
              setStats(next);
              if (trait.special === "ribbon" && markRef.current?.kind === "lure") {
                const stolen = { ...stealRibbon(markRef.current, poseRef.current.x), kind: "lure" as const };
                markRef.current = stolen;
                setMark(stolen);
                say(RIBBON_SPECIAL);
              } else {
                markRef.current = null;
                setMark(null);
                say(kind.careLine("play"));
              }
              note(`${displayName} played.`);
              const bond = maybeBondLine(prev.bond, next.bond);
              if (bond) window.setTimeout(() => say(bond), 900);
              issue("play");
            };
            if (onCare) {
              void persist("play")
                .then((remote) => finishPlay(remote ?? applyPlay(prev)))
                // Not swallowed: the keeper hears the play wasn't saved, and the meters stay put.
                .catch((err) => playNotSaved(err));
            } else {
              finishPlay(applyPlay(prev));
            }
            return;
          }
          if (act === "idle") {
            issue("idle");
          }
        }}
        onTap={(how) => {
          saveCard({ ...loadCard(), collapsed: false });
          setCardOpen(true);
          setCardOpenTick((n) => n + 1);
          if (guestTap() !== "choice") return;
          choiceByKeys.current = !!how?.keys;
          setChoiceOpen((open) => !open);
        }}
        onTend={() => {
          setTending(true);
          careRef.current?.querySelector("button")?.focus();
          window.setTimeout(() => setTending(false), 1600);
        }}
      />
      <HouseVisit hostKey={kind.key} hidden={stats.hidden || leaving} />
      <DeskPlants windOn={skyNow() === "wind"} />
      {demoWindow && kind.key !== FLY_BIRD_KEY ? (
        <BirdFlyer
          hidden={stats.hidden || leaving}
          startId={birdCall}
          onVisible={setBirdOn}
          hostKey={kind.key}
          hostSleeping={kind.key === "red_panda" && (!!stats.asleep || ruiLieHold)}
          hostPoseRef={poseRef}
        />
      ) : null}
      {demoWindow && kind.key !== ROBIN_KEY ? (
        <RobinFlyer
          hidden={stats.hidden || leaving}
          startId={robinCall}
          onSong={say}
          hostKey={kind.key}
          hostSleeping={kind.key === "red_panda" && (!!stats.asleep || ruiLieHold)}
          hostPoseRef={poseRef}
        />
      ) : null}
      <CalledGuests
        keys={walkersOf(calledKeys, kind.key)}
        hostKey={kind.key}
        hidden={stats.hidden || leaving}
        hostSleeping={kind.key === "red_panda" && (!!stats.asleep || ruiLieHold)}
        hostPoseRef={poseRef}
        onSong={say}
        windows={demoWindow ? deskWindows : []}
      />

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
          onPick={(id, how) => {
            if (how?.keys) choiceByKeys.current = true;
            const picked = guestPick(id);
            if (picked) pickGuest(picked);
          }}
          onClose={() => {
            choiceByKeys.current = true;
            setChoiceOpen(false);
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
        {careProblem ? (
          <p role="status" aria-live="polite" data-care-problem={careProblem.act} className="mt-2 max-w-sm text-sm text-muted">
            <span id={`${problemId}-care`}>{careProblem.line}</span>{" "}
            <button
              type="button"
              disabled={busy}
              aria-describedby={`${problemId}-care`}
              onClick={retryCare}
              className="text-fg underline underline-offset-2 hover:text-primary disabled:opacity-40"
            >
              {RETRY_LABEL}
            </button>
          </p>
        ) : null}
        {talkProblem ? (
          <p role="status" aria-live="polite" data-talk-problem className="mt-2 max-w-sm text-sm text-muted">
            <span id={`${problemId}-talk`}>{talkProblem.line}</span>{" "}
            <button
              type="button"
              disabled={busy}
              aria-describedby={`${problemId}-talk`}
              onClick={() => void talk(talkProblem.message)}
              className="text-fg underline underline-offset-2 hover:text-primary disabled:opacity-40"
            >
              {RETRY_LABEL}
            </button>
          </p>
        ) : null}
        {latestNote ? <p className="mt-2 max-w-sm text-xs text-subtle">{latestNote}</p> : null}
        <SpeciesPlaque speciesKey={kind.key} compact paper className="mt-5 max-w-sm" showDemoLink={false} />
        <FirstHint
          name={displayName}
          onDone={() => {
            // Got it is gone; keyboard focus lands on the keeper card's open (or name) button, not nowhere.
            roomRef.current?.querySelector<HTMLElement>('[data-card="open"], [data-card="collapse"]')?.focus();
          }}
        />
        {cardOpen ? null : (
          <button
            type="button"
            data-card="open"
            aria-expanded="false"
            className="sr-only mt-4 text-[11px] uppercase tracking-[0.14em] text-muted focus:not-sr-only focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            onClick={openCardByKeys}
          >
            Open {displayName}&apos;s keeper card
          </button>
        )}
        <KeeperCard
          className="mt-4 max-w-sm"
          name={displayName}
          stage={age}
          stats={stats}
          guestKey={kind.key}
          busy={busyOrHidden}
          onFeed={() => void feed()}
          onPlay={startChase}
          onRest={() => void tend("rest")}
          onSay={(text) => {
            say(text);
            void playVoice(undefined, text);
            issue("talk");
          }}
          onDo={(text) => {
            const verb = text.trim().toLowerCase();
            if (verb === "sit" || verb === "wander" || verb === "sleep" || verb === "idle") issue(verb);
            else if (verb === "talk") void talk();
            else if (verb === "feed") void feed();
            else if (verb === "play") startChase();
            else if (verb === "rest") void tend("rest");
            else {
              say(text);
              issue("talk");
            }
          }}
          onOff={() => {
            saveCard({ ...loadCard(), off: true });
            setDeskOff(true);
          }}
          onCallBird={() => {
            unlockDeskAudio();
            setBirdCall((n) => n + 1);
            playAnimalVoice(FLY_BIRD_KEY);
          }}
          onCallGuests={(keys) => {
            unlockDeskAudio();
            setCalledKeys(keys);
            if (shouldRobinFly(keys, kind.key)) setRobinCall((n) => n + 1);
          }}
          openTick={cardOpenTick}
          onCollapse={(how) => {
            if (how?.keys) cardFocus.current = "open";
            setCardOpen(false);
          }}
          onMusicChange={(on) => setMusicOn(on)}
        />
        {deskOff ? (
          <button
            type="button"
            className="mt-2 text-[11px] uppercase tracking-[0.14em] text-muted"
            onClick={() => {
              saveCard({ ...loadCard(), off: false });
              setDeskOff(false);
            }}
          >
            Sit again
          </button>
        ) : null}
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
          <p id="hud-talk-net" className="keeper-truth" hidden={!talkAsked || !talkLine}>
            {talkAsked ? talkLine : ""}
          </p>
          <p id="hud-voice-net" className="keeper-truth" hidden={!voiceAsked || !voiceLine}>
            {voiceAsked ? voiceLine : ""}
          </p>
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
