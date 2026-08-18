import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { BlotterMarks, DayWash, type BlotterMark, randomLureX, randomTreatX } from "@/components/desk/blotter";
import { BlotterCare } from "@/components/desk/blotter-care";
import { DenCabinet } from "@/components/desk/den-cabinet";
import { LivingPet, type PetCommand } from "@/components/desk/living-pet";
import { HouseVisit } from "@/components/desk/house-visit";
import { DeskGrain, RoomWash } from "@/components/desk/room-wash";
import { todaysVisitor } from "@/lib/pets/visitor";
import { applyFeed, applyHide, applyPlay, applySnack, loadCare, leaveGift, maybeBondLine, normalizeCare, pickGift, saveCare, stageOf, type CareStats } from "@/lib/pets/care";
import { saveActiveKindKey, type LivingKind } from "@/lib/pets/living";
import { converseWithPet } from "@/lib/pets/talk";
import { unlockDeskAudio } from "@/lib/pets/desk-audio";
import { useMindBinding, useMindSettings } from "@/lib/ai/use-mind";
import { traitFor } from "@/lib/pets/traits";
import { HIDE_LINE, SNACK_LINE, dayPartLabel, dayPart, isRestingHour, rememberVisit, returnLine } from "@/lib/pets/hours";
import { weatherIdle, weatherLabel, weatherLine, weatherOf } from "@/lib/pets/weather";
import { applySpecial } from "@/lib/pets/specials";
import { applyShed, isBlue, isSnake, shedLine, shedWaitLine } from "@/lib/pets/shed";
import { GIFT_LINE, treatFor } from "@/lib/pets/treats";
import { SpeciesPlaque } from "@/components/desk/species-plaque";
import { roomOf } from "@/lib/pets/rooms";

export function DemoStage({ kind }: { kind: LivingKind }) {
  const mind = useMindBinding(kind.key);
  const mindSettings = useMindSettings();
  const trait = traitFor(kind.key);
  const [stats, setStats] = useState<CareStats>(() => normalizeCare({ hunger: 78, mood: 80, energy: 82 }));
  const [speech, setSpeech] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
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

  useEffect(() => {
    saveCare(kind.localKey, stats);
  }, [kind.localKey, stats]);

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
    setMark(null);
    setLeaving(false);
    const live = loadCare(kind.localKey, { hunger: 78, mood: 80, energy: 82 });
    setStats(live);
    const t = window.setTimeout(() => {
      if (acted.current) return;
      say(returnLine(rememberVisit(kind.key)) ?? weatherLine(kind.key, weatherOf()) ?? kind.greetLine(), 5200);
      issue("talk");
    }, 500);
    return () => window.clearTimeout(t);
  }, [kind, issue, say]);

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

  async function talk() {
    if (busy) return;
    acted.current = true;
    unlockDeskAudio();
    setBusy(true);
    issue("talk");
    try {
      const res = await converseWithPet({
        data: {
          hunger: stats.hunger,
          mood: stats.mood,
          energy: stats.energy,
          hygiene: stats.hygiene,
          name: kind.name,
          species: kind.key,
          speak: mindSettings.voice !== "none",
          mind,
          voice: mindSettings.voice,
        },
      });
      say(res.text, Math.min(9000, 2200 + res.text.length * 55));
      await playVoice(res.audio, res.text);
    } catch {
      say(kind.ambientLine(stats));
    } finally {
      setBusy(false);
    }
  }

  function dropTreatAt(x: number) {
    if (busy || stats.hidden || leaving) return;
    acted.current = true;
    unlockDeskAudio();
    setMark({ kind: "treat", x: Math.max(8, Math.min(90, x)) });
    issue("seek");
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
    const prev = statsRef.current;
    const next = applyPlay(prev);
    setStats(next);
    setMark(null);
    say("You caught it first. I still win.");
    const line = maybeBondLine(prev.bond, next.bond);
    if (line) window.setTimeout(() => say(line), 900);
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
    say(HIDE_LINE[kind.key] ?? "I went where the ribbon goes.");
    setLeaving(true);
    issue("leave");
  }

  function callBack() {
    if (busy) return;
    acted.current = true;
    setLeaving(false);
    setStats((s) => ({ ...s, hidden: false }));
    say("You called. I brought the whole tail.");
    issue("enter");
  }

  function feed() {
    if (busy || stats.hidden) return;
    acted.current = true;
    unlockDeskAudio();
    setStats(applyFeed);
    say(kind.careLine("feed"));
    issue("eat");
  }

  const room = roomOf(kind.key);
  const gait = useMemo(() => ({ ...trait, scale: trait.scale * 1.24 }), [trait]);
  const hour = isBlue(stats, kind.key) ? "Blue" : dayPartLabel(dayPart());
  const sky = weatherLabel(weatherOf());
  const caller = todaysVisitor(kind.key).name;
  const busyOrHidden = busy || stats.hidden;

  return (
    <section className="relative isolate h-dvh min-h-[520px] w-full overflow-hidden bg-elevated">
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
        gait={gait}
        kind={kind.key}
        hidden={stats.hidden}
        unwell={stats.sick}
        dull={isBlue(stats, kind.key)}
        stage={stageOf(stats)}
        seekX={mark?.x}
        onArrived={() => {
          if (order.cmd === "leave") {
            setStats((s) => applyHide(s));
            setLeaving(false);
            return;
          }
          if (order.cmd === "seek" && markRef.current) {
            const caught = markRef.current;
            setMark(null);
            if (caught.kind === "treat") {
              const prev = statsRef.current;
              const next = applySnack(prev);
              setStats(next);
              say(SNACK_LINE[kind.key] ?? "A small treaty.");
              const line = maybeBondLine(prev.bond, next.bond);
              if (line) window.setTimeout(() => say(line), 900);
              issue("eat");
            } else {
              const prev = statsRef.current;
              const next = applyPlay(prev);
              setStats(next);
              say(kind.careLine("play"));
              const line = maybeBondLine(prev.bond, next.bond);
              if (line) window.setTimeout(() => say(line), 900);
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
            const prev = statsRef.current;
            const next = pickGift(prev, gift.id);
            setStats(next);
            say(GIFT_LINE[kind.key] ?? "I left this.");
            const line = maybeBondLine(prev.bond, next.bond);
            if (line) window.setTimeout(() => say(line), 900);
          }}
        />
      ))}

      <aside className="absolute left-4 top-20 z-20 max-w-[min(100%-2rem,20rem)] sm:left-8 sm:top-24">
        <p className="text-[11px] uppercase tracking-[0.2em] text-subtle">
          {hour} · {sky} · {caller} may call
        </p>
        <h1 className="mt-2 font-display text-5xl leading-none sm:text-6xl">{kind.name}</h1>
        <p className="mt-3 max-w-sm text-sm text-muted">{kind.tagline}</p>
        <SpeciesPlaque speciesKey={kind.key} compact paper className="mt-5 max-w-sm" showDemoLink={false} />
      </aside>

      <div className="absolute right-4 top-20 z-20 max-w-[11rem] text-right sm:right-8 sm:top-24">
        <DenCabinet currentRoom={room.id} currentKey={kind.key} drawers />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-3 px-4 pb-5 pt-16 sm:px-8">
        <div className="pointer-events-auto">
          <BlotterCare
            marks={[
              { label: "Feed", onClick: feed, disabled: busyOrHidden },
              { label: treatFor(kind.key).verb, onClick: () => dropTreatAt(randomTreatX()), disabled: busyOrHidden },
              { label: "Play", onClick: startChase, disabled: busyOrHidden },
              {
                label: trait.verb,
                disabled: busy,
                onClick: () => {
                  acted.current = true;
                  unlockDeskAudio();
                  const next = applySpecial(statsRef.current, trait);
                  const gifted = leaveGift(next.stats);
                  setStats(gifted);
                  say(trait.line);
                  issue(next.cmd);
                },
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
                        const next = applyShed(statsRef.current);
                        setStats(next);
                        say(shedLine(kind.key));
                        issue("sit");
                      },
                    },
                  ]
                : []),
              { label: "Talk", onClick: () => void talk(), disabled: busy },
              stats.hidden || leaving
                ? { label: "Call back", onClick: callBack, disabled: busy }
                : { label: "Hide", onClick: hide, disabled: busy },
            ]}
          />
        </div>
        <p className="pointer-events-auto text-center text-[11px] uppercase tracking-[0.16em] text-subtle">
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
      </div>
    </section>
  );
}
