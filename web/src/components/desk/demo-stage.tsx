import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { BlotterMarks, DayWash, type BlotterMark, randomLureX, randomTreatX } from "@/components/desk/blotter";
import { LivingPet, type PetCommand } from "@/components/desk/living-pet";
import { applyFeed, applyHide, applyPlay, applySnack, bondTitle, loadCare, maybeBondLine, normalizeCare, saveCare, stageOf, type CareStats } from "@/lib/pets/care";
import { LIVING_KINDS, saveActiveKindKey, type LivingKind } from "@/lib/pets/living";
import { converseWithPet } from "@/lib/pets/talk";
import { unlockDeskAudio } from "@/lib/pets/desk-audio";
import { useMindBinding, useMindSettings } from "@/lib/ai/use-mind";
import { traitFor } from "@/lib/pets/traits";
import { HIDE_LINE, SNACK_LINE, dayPartLabel, dayPart, isRestingHour, rememberVisit, returnLine } from "@/lib/pets/hours";
import { cn } from "@/lib/utils";

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
      say(returnLine(rememberVisit(kind.key)) ?? kind.greetLine(), 5200);
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

  return (
    <section className="relative isolate h-dvh min-h-[520px] w-full overflow-hidden bg-elevated">
      <img
        src="/habitat.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[center_68%]"
      />
      <DayWash />

      <BlotterMarks
        mark={mark}
        hidden={stats.hidden}
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

      <aside className="absolute left-4 top-20 z-20 max-w-[min(100%-2rem,22rem)] sm:left-8 sm:top-24">
        <p className="text-[11px] uppercase tracking-[0.2em] text-subtle">
          Living demo · {dayPartLabel(dayPart())} · {bondTitle(stats.bond)} · {stageOf(stats)}
        </p>
        <h1 className="mt-2 font-display text-4xl leading-none sm:text-5xl">{kind.name}</h1>
        <p className="mt-3 max-w-sm text-sm text-muted">{kind.tagline}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button size="sm" disabled={busy || stats.hidden} onClick={feed}>
            Feed
          </Button>
          <Button size="sm" variant="secondary" disabled={busy || stats.hidden} onClick={() => dropTreatAt(randomTreatX())}>
            Treat
          </Button>
          <Button size="sm" variant="secondary" disabled={busy || stats.hidden} onClick={startChase}>
            Play
          </Button>
          <Button size="sm" variant="ghost" disabled={busy} onClick={() => void talk()}>
            Talk
          </Button>
          {stats.hidden || leaving ? (
            <Button size="sm" variant="secondary" disabled={busy} onClick={callBack}>
              Call back
            </Button>
          ) : (
            <Button size="sm" variant="ghost" disabled={busy} onClick={hide}>
              Hide
            </Button>
          )}
        </div>
      </aside>

      <nav className="absolute right-4 top-20 z-20 flex max-h-[46dvh] flex-col gap-0.5 overflow-y-auto sm:right-8 sm:top-24">
        {LIVING_KINDS.map((item) => (
          <Link
            key={item.slug}
            to="/demo/$slug"
            params={{ slug: item.slug }}
            className={cn(
              "rounded-[var(--radius-sm)] px-3 py-1.5 text-right text-sm no-underline",
              item.key === kind.key ? "bg-bg/70 text-fg" : "text-muted hover:text-fg",
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col gap-3 border-t border-border/80 bg-bg/80 px-4 py-3 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="text-sm text-muted">Click the blotter. Chase the ribbon. Same house on phones and Windows.</p>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link to="/" search={{ pet: kind.key }} onClick={() => saveActiveKindKey(kind.key)}>
              Open the desk
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/live" search={{ pet: kind.key }}>
              Phone and tablet
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/meet">All demos</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
