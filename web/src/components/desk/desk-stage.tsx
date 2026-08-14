import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Meter } from "@/components/ui/progress";
import { LivingPet, type PetCommand } from "@/components/desk/living-pet";
import {
  applyFeed,
  applyPlay,
  applyRest,
  decayStats,
  moodWord,
  type CareStats,
} from "@/lib/pets/care";
import {
  ambientLine,
  careLine,
  greetLine,
  preloadRedPandaSprites,
  RED_PANDA_NAME,
} from "@/lib/pets/red-panda";
import { converseWithPet } from "@/lib/pets/talk";
import { unlockDeskAudio } from "@/lib/pets/desk-audio";

const LOCAL_KEY = "computerpets.desk.red_panda.v1";

type Saved = CareStats & { lastTick: number };

function loadLocal(): Saved {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) return JSON.parse(raw) as Saved;
  } catch {
    /* ignore */
  }
  return { hunger: 76, mood: 72, energy: 80, lastTick: Date.now() };
}

function saveLocal(s: Saved) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

export function DeskStage({
  name = RED_PANDA_NAME,
  onCare,
}: {
  name?: string;
  onCare?: (action: "feed" | "play" | "rest") => Promise<CareStats | void>;
}) {
  const [stats, setStats] = useState<CareStats>({ hunger: 76, mood: 72, energy: 80 });
  const [speech, setSpeech] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
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
    preloadRedPandaSprites();
    const saved = loadLocal();
    const live = decayStats(saved, saved.lastTick);
    setStats(live);
    saveLocal({ ...live, lastTick: Date.now() });
    const t = window.setTimeout(() => {
      if (acted.current) return;
      say(greetLine(), 5000);
      issue("talk");
    }, 700);
    return () => window.clearTimeout(t);
  }, [issue, say]);

  useEffect(() => {
    if (!speech && order.cmd === "talk") issue("sit");
  }, [speech, order.cmd, issue]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setStats((prev) => {
        const next = decayStats(prev, Date.now() - 15_000, Date.now());
        saveLocal({ ...next, lastTick: Date.now() });
        return next;
      });
    }, 15_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.hidden) return;
      if (performance.now() < speechUntil.current) return;
      if (busy) return;
      const live = statsRef.current;
      const roll = Math.random();
      if (roll < 0.4) issue("wander");
      else if (roll < 0.62) issue(live.energy < 35 ? "sleep" : "sit");
      else if (roll < 0.8) issue("idle");
      else {
        say(ambientLine(live));
        issue("talk");
      }
    }, 5600);
    return () => window.clearInterval(id);
  }, [busy, issue, say]);

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
      u.pitch = 1.15;
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
          name,
          speak: true,
        },
      });
      say(res.text, Math.min(9000, 2200 + res.text.length * 55));
      await playVoice(res.audio, res.text);
    } catch {
      const line = message ? "I heard a rustle. Try again in a moment." : ambientLine(stats);
      say(line);
    } finally {
      setBusy(false);
    }
  }

  async function care(action: "feed" | "play" | "rest") {
    if (busy) return;
    acted.current = true;
    unlockDeskAudio();
    setBusy(true);
    try {
      const remote = await onCare?.(action);
      setStats((prev) => {
        const next = remote ?? (action === "feed" ? applyFeed(prev) : action === "play" ? applyPlay(prev) : applyRest(prev));
        saveLocal({ ...next, lastTick: Date.now() });
        return next;
      });
      say(careLine(action));
      if (action === "play") issue("play");
      else if (action === "rest") issue("sleep");
      else issue("eat");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="relative isolate h-[calc(100dvh-4rem)] min-h-[520px] w-full overflow-hidden bg-elevated sm:h-[calc(100dvh-4.5rem)]">
      <img
        src="/habitat.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[center_70%]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/15 to-bg/30" />
      <div className="desk-lamp pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <span className="desk-mote" style={{ left: "18%", bottom: "30%" }} />
        <span className="desk-mote" style={{ left: "42%", bottom: "38%", animationDelay: "1.4s" }} />
        <span className="desk-mote" style={{ left: "61%", bottom: "28%", animationDelay: "2.6s" }} />
        <span className="desk-mote" style={{ left: "78%", bottom: "34%", animationDelay: "0.7s" }} />
      </div>

      <LivingPet
        command={order.cmd}
        orderId={order.id}
        speech={speech}
        onArrived={() => {
          if (order.cmd === "wander" || order.cmd === "play" || order.cmd === "eat") issue("idle");
        }}
        onTap={() => void talk()}
      />

      <aside className="absolute left-3 top-3 z-20 max-w-[min(100%-1.5rem,22rem)] rounded-[var(--radius-lg)] border border-border bg-bg/80 p-3 backdrop-blur-sm sm:left-5 sm:top-5 sm:p-5">
        <p className="text-xs uppercase tracking-[0.18em] text-subtle">First to wake</p>
        <h1 className="mt-1 font-display text-2xl leading-none sm:text-3xl">{name}</h1>
        <p className="mt-2 hidden text-sm text-muted sm:block">
          Red Panda. Lives on the blotter. Drag, tap to talk, or send a word.
        </p>
        <p className="mt-1 text-xs text-subtle sm:mt-2">{busy ? "Listening" : moodWord(stats)}</p>
        <div className="mt-2 grid grid-cols-3 gap-2 sm:mt-3">
          <Meter label="Hunger" value={stats.hunger} />
          <Meter label="Mood" value={stats.mood} />
          <Meter label="Energy" value={stats.energy} />
        </div>
      </aside>

      <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-border bg-bg/85 p-3 backdrop-blur-sm sm:p-4">
        <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center">
          <div className="grid grid-cols-4 gap-2 sm:flex sm:flex-wrap">
            <Button disabled={busy} onClick={() => void care("feed")}>
              Feed
            </Button>
            <Button variant="secondary" disabled={busy} onClick={() => void care("play")}>
              Play
            </Button>
            <Button variant="secondary" disabled={busy} onClick={() => void care("rest")}>
              Rest
            </Button>
            <Button variant="ghost" disabled={busy} onClick={() => void talk()}>
              Talk
            </Button>
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
              placeholder="Say something to Rui"
              className="h-11 min-w-0 flex-1 rounded-[var(--radius-sm)] border border-border bg-elevated px-3 text-sm text-fg outline-none placeholder:text-subtle focus:ring-2 focus:ring-primary/30"
            />
            <Button type="submit" variant="secondary" disabled={busy || !draft.trim()}>
              Send
            </Button>
          </form>
          <Link
            to="/catalog"
            className="hidden text-xs text-muted no-underline hover:text-fg sm:inline"
          >
            Next: Cat
          </Link>
        </div>
      </div>
    </section>
  );
}
