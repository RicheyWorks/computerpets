import { useCallback, useEffect, useRef, useState } from "react";
import { LivingPet, type PetCommand } from "@/components/desk/living-pet";
import { applyFeed, applyPlay, applyRest, type CareStats } from "@/lib/pets/care";
import {
  LIVING_KINDS,
  livingByKey,
  loadActiveKindKey,
  saveActiveKindKey,
  type LivingKind,
} from "@/lib/pets/living";
import { converseWithPet } from "@/lib/pets/talk";
import { unlockDeskAudio } from "@/lib/pets/desk-audio";
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
  const [stats, setStats] = useState<CareStats>({ hunger: 78, mood: 80, energy: 82 });
  const [speech, setSpeech] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [order, setOrder] = useState<{ cmd: PetCommand; id: number }>({ cmd: "wander", id: 1 });
  const [installed, setInstalled] = useState(true);
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
    const t = window.setTimeout(() => {
      if (acted.current) return;
      say(kind.greetLine(), 5000);
      issue("talk");
    }, 450);
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
      else if (roll < 0.7) issue("sit");
      else if (roll < 0.84) issue("idle");
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

  function select(key: string) {
    const next = livingByKey(key);
    setKind(next);
    saveActiveKindKey(next.key);
  }

  return (
    <section className="relative isolate h-dvh min-h-[520px] w-full overflow-hidden bg-elevated">
      <img
        src="/habitat.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[center_70%]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-bg/40" />
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

      <aside className="absolute left-4 right-4 top-[calc(5.5rem+env(safe-area-inset-top))] z-20 sm:left-6 sm:right-auto sm:max-w-sm">
        <p className="text-[11px] uppercase tracking-[0.2em] text-subtle">On this device</p>
        <h1 className="mt-1 font-display text-4xl leading-none">{kind.name}</h1>
        <p className="mt-2 text-sm text-muted">{kind.tagline}</p>
        {!installed ? (
          <p className="mt-3 text-xs text-subtle">
            Add to Home Screen to keep them on your phone or tablet.
          </p>
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
          <Button className="h-12" disabled={busy} onClick={() => care("feed")}>
            Feed
          </Button>
          <Button className="h-12" variant="secondary" disabled={busy} onClick={() => care("play")}>
            Play
          </Button>
          <Button className="h-12" variant="secondary" disabled={busy} onClick={() => care("rest")}>
            Rest
          </Button>
          <Button className="h-12" variant="ghost" disabled={busy} onClick={() => void talk()}>
            Talk
          </Button>
        </div>
      </div>
    </section>
  );
}
