import { useCallback, useEffect, useRef, useState } from "react";
import { LivingPet, type PetCommand } from "@/components/desk/living-pet";
import { BlotterMarks, DayWash, type BlotterMark, randomLureX, randomTreatX } from "@/components/desk/blotter";
import {
  applyFeed,
  applyHide,
  applyPlay,
  applyRest,
  applySnack,
  bondTitle,
  loadCare,
  leaveGift,
  maybeBondLine,
  normalizeCare,
  pickGift,
  saveCare,
  stageOf,
  type CareStats,
} from "@/lib/pets/care";
import {
  LIVING_KINDS,
  livingByKey,
  loadActiveKindKey,
  saveActiveKindKey,
  type LivingKind,
} from "@/lib/pets/living";
import { converseWithPet } from "@/lib/pets/talk";
import { unlockDeskAudio } from "@/lib/pets/desk-audio";
import { useMindBinding, useMindSettings } from "@/lib/ai/use-mind";
import { traitFor } from "@/lib/pets/traits";
import { applySpecial } from "@/lib/pets/specials";
import { HIDE_LINE, SNACK_LINE, dayPart, dayPartLabel, isRestingHour, rememberVisit, returnLine } from "@/lib/pets/hours";
import { weatherIdle, weatherLabel, weatherLine, weatherOf } from "@/lib/pets/weather";
import { GIFT_LINE, treatFor } from "@/lib/pets/treats";
import { Button } from "@/components/ui/button";

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    Boolean((navigator as Navigator & { standalone?: boolean }).standalone)
  );
}

export function LiveStage({ initial }: { initial?: LivingKind }) {
  const [kind, setKind] = useState(initial ?? LIVING_KINDS[0]!);
  const mind = useMindBinding(kind.key);
  const mindSettings = useMindSettings();
  const trait = traitFor(kind.key);
  const [stats, setStats] = useState<CareStats>(() => normalizeCare({ hunger: 78, mood: 80, energy: 82 }));
  const [speech, setSpeech] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [mark, setMark] = useState<BlotterMark | null>(null);
  const [leaving, setLeaving] = useState(false);
  const [order, setOrder] = useState<{ cmd: PetCommand; id: number }>({ cmd: "wander", id: 1 });
  const [installed, setInstalled] = useState(true);
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
    setInstalled(isStandalone());
    if (!initial) setKind(livingByKey(loadActiveKindKey()));
  }, [initial]);

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
      say(returnLine(rememberVisit(kind.key)) ?? weatherLine(kind.key, weatherOf()) ?? kind.greetLine(), 5000);
      issue("talk");
    }, 450);
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
      else if (roll < trait.wander + 0.25) issue("sit");
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
      u.rate = 0.94;
      u.pitch = 1.05;
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
    say("You called.");
    issue("enter");
  }

  function select(key: string) {
    const next = livingByKey(key);
    setKind(next);
    saveActiveKindKey(next.key);
    setStats(loadCare(next.localKey, { hunger: 78, mood: 80, energy: 82 }));
  }

  return (
    <section className="relative isolate h-dvh min-h-[520px] w-full overflow-hidden bg-elevated">
      <img
        src="/habitat.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[center_70%]"
      />
      <DayWash />

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
        hidden={stats.hidden}
        unwell={stats.sick}
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

      {stats.gifts.map((gift) => (
        <button
          key={gift.id}
          type="button"
          aria-label="Pick up a gift"
          className="desk-gift absolute z-10"
          style={{ left: `${gift.x}%`, bottom: "20%" }}
          onClick={() => {
            const prev = statsRef.current;
            const next = pickGift(prev, gift.id);
            setStats(next);
            say(GIFT_LINE[kind.key] ?? "I left this.");
          }}
        />
      ))}

      <aside className="absolute left-4 right-4 top-[calc(5.5rem+env(safe-area-inset-top))] z-20 sm:left-6 sm:right-auto sm:max-w-sm">
        <p className="text-[11px] uppercase tracking-[0.2em] text-subtle">
          On this device · {dayPartLabel(dayPart())} · {weatherLabel(weatherOf())} · {bondTitle(stats.bond)} · {stageOf(stats)}
        </p>
        <h1 className="mt-1 font-display text-4xl leading-none">{kind.name}</h1>
        <p className="mt-2 text-sm text-muted">{kind.tagline}</p>
        {!installed ? (
          <p className="mt-3 text-xs text-subtle">Add to Home Screen. Tap the blotter for a treat.</p>
        ) : null}
      </aside>

      <div className="absolute bottom-0 left-0 right-0 z-20 space-y-3 border-t border-border/80 bg-bg/85 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-sm sm:px-6">
        <label className="block">
          <span className="sr-only">Companion</span>
          <select
            value={kind.key}
            onChange={(e) => select(e.target.value)}
            className="h-12 w-full rounded-[var(--radius-sm)] border border-border bg-elevated px-3 text-base text-fg outline-none focus:ring-2 focus:ring-primary/30"
          >
            {LIVING_KINDS.map((item) => (
              <option key={item.key} value={item.key}>
                {item.name} — {item.speciesLabel}
              </option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-4 gap-2">
          <Button className="h-12" disabled={busy || stats.hidden} onClick={() => {
            acted.current = true;
            unlockDeskAudio();
            setStats(applyFeed);
            say(kind.careLine("feed"));
            issue("eat");
          }}>
            Feed
          </Button>
          <Button className="h-12" variant="secondary" disabled={busy || stats.hidden} onClick={() => dropTreatAt(randomTreatX())}>
            {treatFor(kind.key).verb}
          </Button>
          <Button className="h-12" variant="secondary" disabled={busy || stats.hidden} onClick={startChase}>
            Play
          </Button>
          <Button className="h-12" variant="ghost" disabled={busy} onClick={() => void talk()}>
            Talk
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Button className="h-12" variant="secondary" disabled={busy} onClick={() => {
            acted.current = true;
            setStats(applyRest);
            say(kind.careLine("rest"));
            issue("sleep");
          }}>
            Rest
          </Button>
          {stats.hidden || leaving ? (
            <Button className="h-12" disabled={busy} onClick={callBack}>
              Call back
            </Button>
          ) : (
            <Button className="h-12" variant="ghost" disabled={busy} onClick={hide}>
              Hide
            </Button>
          )}
          <Button className="h-12" variant="ghost" disabled={busy} onClick={() => {
            acted.current = true;
            const next = applySpecial(statsRef.current, trait);
            setStats(leaveGift(next.stats));
            say(trait.line);
            issue(next.cmd);
          }}>
            {trait.verb}
          </Button>
        </div>
      </div>
    </section>
  );
}
