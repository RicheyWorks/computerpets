import { useEffect, useRef, useState, type RefObject } from "react";
import { guardedLoop, makeGuestGuard } from "@/lib/pets/frame-guard";
import { livingByKey } from "@/lib/pets/living";
import { linePicker } from "@/lib/pets/line-picker";
import {
  ROBIN_KEY,
  ROBIN_NAME,
  ROBIN_SONG,
  beginRobinFly,
  destSrc,
  type RobinFly,
  markSung,
  shouldSing,
  stepRobinFly,
  stillVisible,
} from "@/lib/pets/robin-fly";
import { playVoice } from "@/lib/pets/desk-audio";
import { paintBrickFrame } from "@/lib/pets/desk-sprite-surface";
import { ROBIN_REST, calmHold, reducedMotion, type CalmHold } from "@/lib/pets/calm-motion";

export function RobinFlyer({
  hidden,
  startId,
  onVisible,
  onSong,
  hostKey,
  hostSleeping,
  hostPoseRef,
}: {
  hidden?: boolean;
  startId: number;
  onVisible?: (on: boolean) => void;
  onSong?: (line: string) => void;
  hostKey?: string;
  hostSleeping?: boolean;
  hostPoseRef?: RefObject<{ x: number; facing: 1 | -1 }>;
}) {
  const guest = livingByKey(ROBIN_KEY);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [on, setOn] = useState(false);
  const sleepRef = useRef(hostSleeping);
  const keyRef = useRef(hostKey);
  const songRef = useRef(onSong);
  sleepRef.current = hostSleeping;
  keyRef.current = hostKey;
  songRef.current = onSong;
  // One guard for every flight, so a broken flight that comes back is logged once, not once per visit.
  const [guard] = useState(() => makeGuestGuard({ outcome: "The robin leaves the desk; the other pets keep moving." }));

  useEffect(() => {
    if (hidden || !startId) {
      setOn(false);
      onVisible?.(false);
      return;
    }
    let fly = beginRobinFly(window.innerWidth, window.innerHeight, true);
    let last = performance.now();
    let frame = 0;
    let acc = 0;
    // Reduced motion: where Brick is drawn still (calm-motion.ts); null until he lands.
    let hold: CalmHold = null;
    const first = destSrc(fly, guest.sprites);
    if (canvas.current) canvas.current.style.visibility = "";
    setOn(true);
    onVisible?.(true);
    if (canvas.current && first) paintBrickFrame(canvas.current, first);
    playVoice(ROBIN_KEY);
    // Hidden tab: requestAnimationFrame does not fire, so the flight (and its calls) holds still, and the
    // 0.08 s dt cap resumes it in place instead of jumping. No timer of its own to pause.
    let raf = 0;
    let gone = false;
    const leave = () => {
      if (gone) return;
      gone = true;
      setOn(false);
      onVisible?.(false);
    };
    // Safe state for a flight that threw: the robin leaves now (hidden, loop stopped) instead of hanging
    // mid-air. The next call flies again as usual.
    guard.onReset(() => {
      tick.stop();
      if (canvas.current) canvas.current.style.visibility = "hidden";
      leave();
    });
    const step = (now: number) => {
      const dt = Math.min(0.08, (now - last) / 1000);
      last = now;
      const pose = hostPoseRef?.current;
      fly = stepRobinFly(fly, dt, window.innerWidth, window.innerHeight, {
        hidden,
        hostKey: keyRef.current,
        hostSleeping: !!sleepRef.current,
        hostX: pose?.x,
        hostLift: 0,
        hostFacing: pose?.facing,
      })!;
      if (!stillVisible(fly)) {
        leave();
        return false;
      }
      if (shouldSing(fly)) {
        const song = linePicker.offer(ROBIN_KEY, ROBIN_SONG);
        if (song) songRef.current?.(song);
        fly = markSung(fly);
      }
      if (reducedMotion()) {
        // Drawn still where he lands or perches, on his first frame: no flight across the desk, tilt or wing beat.
        hold = calmHold(hold, fly, ROBIN_REST);
        const el = canvas.current;
        if (!el) return true;
        if (!hold) {
          el.style.visibility = "hidden";
          return true;
        }
        el.style.visibility = "";
        const still = destSrc({ ...fly, phase: hold.phase as RobinFly["phase"], frame: 0 }, guest.sprites);
        if (still) paintBrickFrame(el, still);
        el.style.transform = `translate3d(${hold.x}px, ${-hold.lift}px, 0) scale(${hold.facing}, 1)`;
        return true;
      }
      acc += dt;
      if (acc > 1 / 8) {
        acc = 0;
        frame = (frame + 1) % 4;
      }
      fly.frame = frame;
      const el = canvas.current;
      const src = destSrc(fly, guest.sprites);
      if (el && src) {
        paintBrickFrame(el, src);
        el.style.transform = `translate3d(${fly.x}px, ${-fly.lift}px, 0) rotate(${fly.rot}deg) scale(${fly.facing}, ${fly.flap || 1})`;
      }
      return true;
    };
    const tick = guardedLoop(step, (next) => { raf = window.requestAnimationFrame(next); }, guard, () => ROBIN_KEY, () => window.cancelAnimationFrame(raf));
    raf = window.requestAnimationFrame(tick);
    return () => {
      tick.stop();
      guard.onReset(null);
      window.cancelAnimationFrame(raf);
    };
  }, [guard, guest.sprites, hidden, hostPoseRef, onVisible, startId]);

  // Only while the robin is on the desk. When a flight ends, breaks, or the desk hides mid-flight, the canvas
  // is taken off the page, so no picture is left frozen on the desk or offscreen, and its loop has stopped.
  if (!on) return null;
  return (
    <canvas
      ref={canvas}
      role="img"
      aria-label={ROBIN_NAME}
      data-hit
      data-robin={ROBIN_KEY}
      data-surface="pending"
      style={reducedMotion() ? { visibility: "hidden" } : undefined}
      className="pointer-events-auto absolute bottom-0 left-0 z-[6] h-28 w-28 origin-bottom select-none border-0 bg-transparent shadow-none outline-none"
    />
  );
}
