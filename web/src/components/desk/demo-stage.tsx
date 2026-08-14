import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { LivingPet, type PetCommand } from "@/components/desk/living-pet";
import { applyFeed, applyPlay, applyRest, type CareStats } from "@/lib/pets/care";
import { LIVING_KINDS, saveActiveKindKey, type LivingKind } from "@/lib/pets/living";
import { converseWithPet } from "@/lib/pets/talk";
import { unlockDeskAudio } from "@/lib/pets/desk-audio";
import { cn } from "@/lib/utils";

export function DemoStage({ kind }: { kind: LivingKind }) {
  const [stats, setStats] = useState<CareStats>({ hunger: 78, mood: 80, energy: 82 });
  const [speech, setSpeech] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [order, setOrder] = useState<{ cmd: PetCommand; id: number }>({ cmd: "wander", id: 1 });
  const speechUntil = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const statsRef = useRef(stats);
  const acted = useRef(false);
  statsRef.current = stats;

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
    const t = window.setTimeout(() => {
      if (acted.current) return;
      say(kind.greetLine(), 5200);
      issue("talk");
    }, 500);
    return () => window.clearTimeout(t);
  }, [kind, issue, say]);

  useEffect(() => {
    if (!speech && order.cmd === "talk") issue("sit");
  }, [speech, order.cmd, issue]);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.hidden || busy) return;
      if (performance.now() < speechUntil.current) return;
      const roll = Math.random();
      if (roll < 0.45) issue("wander");
      else if (roll < 0.68) issue(statsRef.current.energy < 35 ? "sleep" : "sit");
      else if (roll < 0.82) issue("idle");
      else {
        say(kind.ambientLine(statsRef.current));
        issue("talk");
      }
    }, 5200);
    return () => window.clearInterval(id);
  }, [busy, issue, say, kind]);

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
      u.rate = kind.key === "dog" ? 1.02 : kind.key === "cat" ? 0.86 : 0.92;
      u.pitch = kind.key === "dog" ? 1.05 : kind.key === "cat" ? 0.95 : 1.15;
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
          name: kind.name,
          species: kind.key,
          speak: true,
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

  function care(action: "feed" | "play" | "rest") {
    if (busy) return;
    acted.current = true;
    unlockDeskAudio();
    setStats((prev) =>
      action === "feed" ? applyFeed(prev) : action === "play" ? applyPlay(prev) : applyRest(prev),
    );
    say(kind.careLine(action));
    if (action === "play") issue("play");
    else if (action === "rest") issue("sleep");
    else issue("eat");
  }

  return (
    <section className="relative isolate h-dvh min-h-[520px] w-full overflow-hidden bg-elevated">
      <img
        src="/habitat.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[center_68%]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-bg/35" />
      <div className="desk-lamp pointer-events-none absolute inset-0" />

      <LivingPet
        key={kind.key}
        command={order.cmd}
        orderId={order.id}
        speech={speech}
        sprites={kind.sprites}
        fps={kind.fps}
        once={kind.once}
        onArrived={() => {
          if (order.cmd === "wander" || order.cmd === "play" || order.cmd === "eat") issue("idle");
        }}
        onTap={() => void talk()}
      />

      <aside className="absolute left-4 top-20 z-20 max-w-[min(100%-2rem,22rem)] sm:left-8 sm:top-24">
        <p className="text-[11px] uppercase tracking-[0.2em] text-subtle">Living demo</p>
        <h1 className="mt-2 font-display text-4xl leading-none sm:text-5xl">{kind.name}</h1>
        <p className="mt-3 max-w-sm text-sm text-muted">{kind.tagline}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button size="sm" disabled={busy} onClick={() => care("feed")}>
            Feed
          </Button>
          <Button size="sm" variant="secondary" disabled={busy} onClick={() => care("play")}>
            Play
          </Button>
          <Button size="sm" variant="ghost" disabled={busy} onClick={() => void talk()}>
            Talk
          </Button>
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
        <p className="text-sm text-muted">A browser demo. They also live on the desk.</p>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link to="/" search={{ pet: kind.key }} onClick={() => saveActiveKindKey(kind.key)}>
              Open the desk
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
