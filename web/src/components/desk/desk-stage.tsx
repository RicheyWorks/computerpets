import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Meter } from "@/components/ui/progress";
import { LivingPet, type PetCommand } from "@/components/desk/living-pet";
import { HouseVisit } from "@/components/desk/house-visit";
import { todaysVisitor } from "@/lib/pets/visitor";
import { BlotterMarks, DayWash, type BlotterMark, randomLureX, randomTreatX } from "@/components/desk/blotter";
import {
  applyBath,
  applyCall,
  applyClean,
  applyHide,
  applyMedicine,
  applyFeed,
  applyPlay,
  applyPraise,
  applyRest,
  applySnack,
  bondTitle,
  decayStats,
  maybeBondLine,
  moodWord,
  normalizeCare,
  pickMess,
  pickGift,
  leaveGift,
  stageOf,
  type CareStats,
} from "@/lib/pets/care";
import { LIVING_KINDS, type LivingKind } from "@/lib/pets/living";
import { converseWithPet } from "@/lib/pets/talk";
import { unlockDeskAudio } from "@/lib/pets/desk-audio";
import { useMindBinding, useMindSettings } from "@/lib/ai/use-mind";
import { describeBinding } from "@/lib/ai/settings";
import { traitFor } from "@/lib/pets/traits";
import { applySpecial } from "@/lib/pets/specials";
import { isFungus } from "@/lib/pets/fungi";
import { isGarden } from "@/lib/pets/garden";
import { isInsect } from "@/lib/pets/insects";
import { isSea } from "@/lib/pets/sea";
import { applyShed, isBlue, isSnake, shedLine, shedWaitLine } from "@/lib/pets/shed";
import { SpeciesPlaque } from "@/components/desk/species-plaque";
import { GIFT_LINE, treatFor } from "@/lib/pets/treats";
import { appendJournal, loadJournal, type JournalEntry } from "@/lib/pets/journal";
import { HIDE_LINE, SNACK_LINE, dayPart, dayPartLabel, isRestingHour, returnLine } from "@/lib/pets/hours";
import { weatherIdle, weatherLabel, weatherLine, weatherOf } from "@/lib/pets/weather";

function loadLocal(key: string): CareStats {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return normalizeCare(JSON.parse(raw) as Partial<CareStats>);
  } catch {
    /* ignore */
  }
  return normalizeCare(null);
}

function saveLocal(key: string, s: CareStats) {
  try {
    localStorage.setItem(key, JSON.stringify({ ...s, lastTick: Date.now() }));
  } catch {
    /* ignore */
  }
}

export function DeskStage({
  kind,
  name,
  onCare,
  onSelectKind,
}: {
  kind: LivingKind;
  name?: string;
  onCare?: (action: "feed" | "play" | "rest") => Promise<CareStats | void>;
  onSelectKind?: (key: string) => void;
}) {
  const displayName = name ?? kind.name;
  const trait = traitFor(kind.key);
  const mind = useMindBinding(kind.key);
  const mindSettings = useMindSettings();
  const [stats, setStats] = useState<CareStats>(() => normalizeCare(null));
  const [speech, setSpeech] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [mark, setMark] = useState<BlotterMark | null>(null);
  const [leaving, setLeaving] = useState(false);
  const [order, setOrder] = useState<{ cmd: PetCommand; id: number }>({ cmd: "wander", id: 1 });
  const speechUntil = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const statsRef = useRef(stats);
  const markRef = useRef(mark);
  const acted = useRef(false);
  statsRef.current = stats;
  markRef.current = mark;

  function speakBond(prev: CareStats, next: CareStats) {
    const line = maybeBondLine(prev.bond, next.bond);
    if (line) {
      window.setTimeout(() => say(line), 900);
      note(`${displayName} is ${bondTitle(next.bond)}.`);
    }
  }

  const say = useCallback((text: string, hold = 4200) => {
    setSpeech(text);
    speechUntil.current = performance.now() + hold;
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (speech && performance.now() > speechUntil.current) setSpeech(null);
    }, 350);
    return () => window.clearInterval(id);
  }, [speech]);

  const issue = useCallback((cmd: PetCommand) => {
    setOrder((o) => ({ cmd, id: o.id + 1 }));
  }, []);

  useEffect(() => {
    setJournal(loadJournal());
  }, [kind.key]);

  const note = useCallback(
    (text: string) => {
      setJournal(appendJournal({ name: displayName, species: kind.key, text }));
    },
    [displayName, kind.key],
  );

  useEffect(() => {
    kind.preload();
    const saved = loadLocal(kind.localKey);
    const live = decayStats(saved, saved.lastTick);
    setStats(live);
    saveLocal(kind.localKey, { ...live, lastTick: Date.now() });
    acted.current = false;
    setLeaving(false);
    setMark(null);
    const t = window.setTimeout(() => {
      if (acted.current) return;
      const away = Date.now() - saved.lastTick;
      say(returnLine(away) ?? weatherLine(kind.key, weatherOf()) ?? kind.greetLine(), 5200);
      issue("talk");
    }, 700);
    return () => window.clearTimeout(t);
  }, [kind, issue, say]);

  useEffect(() => {
    if (!speech && order.cmd === "talk") issue("sit");
  }, [speech, order.cmd, issue]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setStats((prev) => {
        const next = decayStats(prev, Date.now() - 15_000, Date.now());
        saveLocal(kind.localKey, { ...next, lastTick: Date.now() });
        return next;
      });
    }, 15_000);
    return () => window.clearInterval(id);
  }, [kind.localKey]);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.hidden) return;
      if (performance.now() < speechUntil.current) return;
      if (busy) return;
      const live = statsRef.current;
      if (live.hidden) return;
      if (live.hunger < 26) {
        say(kind.ambientLine(live));
        issue("wander");
        return;
      }
      const skyMood = weatherIdle(kind.key, weatherOf());
      if (skyMood && Math.random() < 0.45) {
        if (Math.random() < 0.4) {
          const line = weatherLine(kind.key, weatherOf());
          if (line) say(line);
        }
        issue(skyMood);
        return;
      }
      if (isRestingHour(kind.key) && live.energy < 88) {
        issue("sleep");
        return;
      }
      const roll = Math.random();
      if (roll < trait.wander) issue("wander");
      else if (roll < trait.wander + 0.22) issue(live.energy < 35 ? "sleep" : "sit");
      else if (roll < trait.wander + 0.4) issue("idle");
      else {
        say(kind.ambientLine(live));
        issue("talk");
      }
    }, 5600);
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
      u.rate = kind.key === "cat" ? 0.86 : 0.92;
      u.pitch = kind.key === "cat" ? 0.95 : 1.15;
      window.speechSynthesis.speak(u);
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
      const line = message ? kind.listenLine() : kind.ambientLine(stats);
      say(line);
    } finally {
      setBusy(false);
    }
  }

  async function care(action: "feed" | "play" | "rest" | "clean" | "bath" | "medicine" | "praise") {
    if (busy) return;
    acted.current = true;
    unlockDeskAudio();
    setBusy(true);
    try {
      const remote = action === "feed" || action === "play" || action === "rest" ? await onCare?.(action) : undefined;
      setStats((prev) => {
        const next =
          remote ??
          (action === "feed"
            ? applyFeed(prev)
            : action === "play"
              ? applyPlay(prev)
              : action === "rest"
                ? applyRest(prev)
                : action === "clean"
                  ? applyClean(prev)
                  : action === "bath"
                    ? applyBath(prev)
                    : action === "medicine"
                      ? applyMedicine(prev)
                      : applyPraise(prev));
        saveLocal(kind.localKey, { ...next, lastTick: Date.now() });
        speakBond(prev, next);
        return next;
      });
      if (action === "feed" || action === "play" || action === "rest") say(kind.careLine(action));
      else if (action === "clean") say("The blotter is honest again.");
      else if (action === "bath") say("Water. Then dignity.");
      else if (action === "medicine") say("Bitter. I will invoice you in kindness.");
      else say(kind.fallbackLine("good", stats));
      note(
        action === "feed"
          ? `${displayName} ate.`
          : action === "play"
            ? `${displayName} played.`
            : action === "rest"
              ? `${displayName} slept.`
              : `${displayName} was tended.`,
      );
      if (action === "play") issue("play");
      else if (action === "rest") issue("sleep");
      else if (action === "feed") issue("eat");
      else issue("sit");
    } finally {
      setBusy(false);
    }
  }

  function special() {
    if (busy) return;
    acted.current = true;
    unlockDeskAudio();
    const next = applySpecial(statsRef.current, trait);
    setStats(next.stats);
    saveLocal(kind.localKey, { ...next.stats, lastTick: Date.now() });
    say(trait.line);
    issue(next.cmd);
    note(`${displayName}: ${trait.line}`);
    speakBond(statsRef.current, next.stats);
    if (next.stats.bond >= 25) {
      const gifted = leaveGift(next.stats);
      if (gifted.gifts.length > next.stats.gifts.length) {
        setStats(gifted);
        saveLocal(kind.localKey, { ...gifted, lastTick: Date.now() });
      }
    }
  }

  function hide() {
    if (busy || stats.hidden) return;
    acted.current = true;
    say(HIDE_LINE[kind.key] ?? "I went where the ribbon goes.");
    setLeaving(true);
    issue("leave");
    note(`${displayName} slipped off the blotter.`);
  }

  function callBack() {
    if (busy) return;
    acted.current = true;
    setLeaving(false);
    const next = applyCall(statsRef.current);
    setStats(next);
    saveLocal(kind.localKey, { ...next, lastTick: Date.now() });
    say("You called. I brought the whole tail.");
    issue("enter");
    note(`${displayName} came back.`);
  }

  function dropTreatAt(x: number) {
    if (busy || stats.hidden || leaving) return;
    acted.current = true;
    unlockDeskAudio();
    setMark({ kind: "treat", x: Math.max(8, Math.min(90, x)) });
    issue("seek");
  }

  function dropTreat() {
    dropTreatAt(randomTreatX());
  }

  function startChase() {
    if (busy || stats.hidden || leaving) return;
    acted.current = true;
    unlockDeskAudio();
    setMark({ kind: "lure", x: randomLureX() });
    say(trait.special === "bug" ? "There. A bug." : "A ribbon. Catch it.");
    issue("seek");
  }

  function catchLure() {
    if (!mark || mark.kind !== "lure") return;
    const next = applyPlay(statsRef.current);
    setStats(next);
    saveLocal(kind.localKey, { ...next, lastTick: Date.now() });
    setMark(null);
    say("You caught it first. I still win.");
    note(`${displayName} played. You helped.`);
    speakBond(statsRef.current, next);
    issue("play");
  }

  function fleeLure(x: number) {
    if (stats.hidden || leaving) return;
    setMark({ kind: "lure", x, hops: 1 });
    issue("seek");
  }

  const part = dayPart();

  return (
    <section className="relative isolate h-[calc(100dvh-4rem)] min-h-[520px] w-full overflow-hidden bg-elevated sm:h-[calc(100dvh-4.5rem)]">
      <img
        src="/habitat.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[center_70%]"
      />
      <DayWash />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <span className="desk-mote" style={{ left: "18%", bottom: "30%" }} />
        <span className="desk-mote" style={{ left: "42%", bottom: "38%", animationDelay: "1.4s" }} />
        <span className="desk-mote" style={{ left: "61%", bottom: "28%", animationDelay: "2.6s" }} />
        <span className="desk-mote" style={{ left: "78%", bottom: "34%", animationDelay: "0.7s" }} />
      </div>

      <BlotterMarks
        mark={mark}
        hidden={stats.hidden}
        treatShape={treatFor(kind.key).shape}
        onDropTreat={dropTreatAt}
        onCatchLure={catchLure}
        onFlee={fleeLure}
      />

      <LivingPet
        key={kind.key}
        command={order.cmd}
        orderId={order.id}
        speech={speech}
        sprites={kind.sprites}
        fps={kind.fps}
        once={kind.once}
        gait={trait}
        kind={kind.key}
        hidden={stats.hidden}
        unwell={stats.sick}
        dull={isBlue(stats, kind.key)}
        stage={stageOf(stats)}
        seekX={mark?.x}
        onArrived={() => {
          if (order.cmd === "leave") {
            const next = applyHide(statsRef.current);
            setStats(next);
            setLeaving(false);
            saveLocal(kind.localKey, { ...next, lastTick: Date.now() });
            return;
          }
          if (order.cmd === "seek" && markRef.current) {
            const caught = markRef.current;
            setMark(null);
            if (caught.kind === "treat") {
              const next = applySnack(statsRef.current);
              setStats(next);
              saveLocal(kind.localKey, { ...next, lastTick: Date.now() });
              say(SNACK_LINE[kind.key] ?? "A small treaty.");
              note(`${displayName} found the treat.`);
              speakBond(statsRef.current, next);
              issue("eat");
            } else {
              const next = applyPlay(statsRef.current);
              setStats(next);
              saveLocal(kind.localKey, { ...next, lastTick: Date.now() });
              say(kind.careLine("play"));
              note(`${displayName} caught the lure.`);
              speakBond(statsRef.current, next);
              issue("play");
            }
            return;
          }
          if (order.cmd === "wander" || order.cmd === "play" || order.cmd === "eat" || order.cmd === "enter") {
            issue("idle");
          }
        }}
        onTap={() => void talk()}
      />
      <HouseVisit hostKey={kind.key} hidden={stats.hidden || leaving} />

      {stats.gifts.map((gift) => (
        <button
          key={gift.id}
          type="button"
          aria-label="Pick up a gift"
          className={`${gift.kind === "shed" ? "desk-shed" : "desk-gift"} absolute z-10`}
          style={{ left: `${gift.x}%`, bottom: "20%" }}
          onClick={() => {
            const next = pickGift(statsRef.current, gift.id);
            setStats(next);
            saveLocal(kind.localKey, { ...next, lastTick: Date.now() });
            say(GIFT_LINE[kind.key] ?? "I left this.");
            note(`${displayName} left a gift.`);
            speakBond(statsRef.current, next);
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
            saveLocal(kind.localKey, { ...next, lastTick: Date.now() });
            say("The blotter is honest again.");
            note(`${displayName}'s desk was picked up.`);
          }}
        />
      ))}

      <aside className="absolute left-3 top-3 z-20 max-w-[min(100%-1.5rem,22rem)] rounded-[var(--radius-lg)] border border-border bg-bg/80 p-3 backdrop-blur-sm sm:left-5 sm:top-5 sm:p-5">
        <label className="block">
          <span className="sr-only">Companion</span>
          <select
            value={kind.key}
            onChange={(e) => onSelectKind?.(e.target.value)}
            className="h-9 w-full rounded-[var(--radius-sm)] border border-border bg-elevated px-2 text-sm text-fg outline-none focus:ring-2 focus:ring-primary/30"
          >
            {LIVING_KINDS.map((item) => (
              <option key={item.key} value={item.key}>
                {item.name} — {item.speciesLabel}
              </option>
            ))}
          </select>
        </label>
        <h1 className="mt-2 font-display text-2xl leading-none sm:text-3xl">{displayName}</h1>
        <p className="mt-2 hidden text-sm text-muted sm:block">{kind.blurb}</p>
        <SpeciesPlaque speciesKey={kind.key} compact className="mt-3 hidden sm:block" showDemoLink={false} />
        <p className="mt-1 text-xs text-subtle sm:mt-2">
          {busy
            ? "Listening"
            : `${isBlue(stats, kind.key) ? "Blue" : moodWord(stats)} · ${bondTitle(stats.bond)} · ${stageOf(stats)} · ${dayPartLabel(part)} · ${weatherLabel(weatherOf())}${stats.gifts.length ? ` · ${stats.gifts.length} gift${stats.gifts.length > 1 ? "s" : ""}` : ""} · ${todaysVisitor(kind.key).name} may call`}
        </p>
        <p className="mt-1 text-[11px] text-subtle" suppressHydrationWarning>
          {describeBinding(mind)}
        </p>
        <ul className="mt-3 hidden space-y-1 sm:block">
          {journal.slice(0, 3).map((entry) => (
            <li key={`${entry.at}-${entry.text}`} className="truncate text-[11px] text-subtle">
              {entry.text}
            </li>
          ))}
        </ul>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:mt-3 sm:grid-cols-4">
          <Meter label="Hunger" value={stats.hunger} />
          <Meter label="Mood" value={stats.mood} />
          <Meter label="Energy" value={stats.energy} />
          <Meter label="Hygiene" value={stats.hygiene} />
        </div>
      </aside>

      <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-border bg-bg/85 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-sm sm:p-4">
        <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center">
          <div className="grid grid-cols-4 gap-2 sm:flex sm:flex-wrap">
            <Button variant="secondary" disabled={busy} onClick={() => void care("feed")}>
              Feed
            </Button>
            <Button disabled={busy || stats.hidden} onClick={dropTreat}>
              {treatFor(kind.key).verb}
            </Button>
            <Button variant="secondary" disabled={busy || stats.hidden} onClick={startChase}>
              Play
            </Button>
            <Button variant="secondary" disabled={busy} onClick={() => void care("rest")}>
              Rest
            </Button>
            <Button variant="ghost" disabled={busy} onClick={() => void talk()}>
              Talk
            </Button>
            <Button variant="secondary" disabled={busy} onClick={() => void care("clean")}>
              Clean
            </Button>
            <Button variant="secondary" disabled={busy} onClick={() => void care("bath")}>
              Bath
            </Button>
            <Button variant="secondary" disabled={busy} onClick={() => void care("medicine")}>
              Medicine
            </Button>
            <Button variant="ghost" disabled={busy} onClick={() => void care("praise")}>
              Praise
            </Button>
            <Button disabled={busy} onClick={special}>
              {trait.verb}
            </Button>
            {isSnake(kind.key) ? (
              <Button
                variant="secondary"
                disabled={busy}
                onClick={() => {
                  if (!isBlue(statsRef.current, kind.key)) {
                    say(shedWaitLine(kind.key));
                    issue("sit");
                    return;
                  }
                  const next = applyShed(statsRef.current);
                  setStats(next);
                  saveLocal(kind.localKey, { ...next, lastTick: Date.now() });
                  say(shedLine(kind.key));
                  note(`${displayName} shed.`);
                  speakBond(statsRef.current, next);
                  issue("sit");
                }}
              >
                Shed
              </Button>
            ) : null}
            {stats.hidden || leaving ? (
              <Button variant="secondary" disabled={busy} onClick={callBack}>
                Call back
              </Button>
            ) : (
              <Button variant="ghost" disabled={busy} onClick={hide}>
                Hide
              </Button>
            )}
          </div>
          <form
            className="flex min-w-0 flex-1 gap-2"
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
              className="h-11 min-w-0 flex-1 rounded-[var(--radius-sm)] border border-border bg-elevated px-3 text-sm text-fg outline-none placeholder:text-subtle focus:ring-2 focus:ring-primary/30"
            />
            <Button type="submit" variant="secondary" disabled={busy || !draft.trim()}>
              Send
            </Button>
          </form>
          <Link to="/meet" className="hidden text-xs text-muted no-underline hover:text-fg sm:inline">
            The house
          </Link>
          {isSnake(kind.key) ? (
            <Link to="/snakes" className="hidden text-xs text-muted no-underline hover:text-fg sm:inline">
              The den
            </Link>
          ) : isSea(kind.key) ? (
            <Link to="/sea" className="hidden text-xs text-muted no-underline hover:text-fg sm:inline">
              The tide
            </Link>
          ) : isGarden(kind.key) ? (
            <Link to="/garden" className="hidden text-xs text-muted no-underline hover:text-fg sm:inline">
              The garden
            </Link>
          ) : isInsect(kind.key) ? (
            <Link to="/hive" className="hidden text-xs text-muted no-underline hover:text-fg sm:inline">
              The hive
            </Link>
          ) : isFungus(kind.key) ? (
            <Link to="/cellar" className="hidden text-xs text-muted no-underline hover:text-fg sm:inline">
              The cellar
            </Link>
          ) : (
            <Link to="/study" className="hidden text-xs text-muted no-underline hover:text-fg sm:inline">
              The study
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
