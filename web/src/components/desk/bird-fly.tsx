import { useEffect, useRef, useState, type RefObject } from "react";
import { guardedLoop, makeGuestGuard } from "@/lib/pets/frame-guard";
import { livingByKey } from "@/lib/pets/living";
import { beginFly, FLY_BIRD_KEY, FLY_BIRD_NAME, markCalled, shouldCall, stepFly, stillVisible } from "@/lib/pets/bird-fly";
import { playVoice } from "@/lib/pets/desk-audio";
import { paintSipFrame } from "@/lib/pets/desk-sprite-surface";

export function BirdFlyer({
  hidden,
  startId,
  onVisible,
  hostKey,
  hostSleeping,
  hostPoseRef,
}: {
  hidden?: boolean;
  startId: number;
  onVisible?: (on: boolean) => void;
  hostKey?: string;
  hostSleeping?: boolean;
  hostPoseRef?: RefObject<{ x: number; facing: 1 | -1 }>;
}) {
  const guest = livingByKey(FLY_BIRD_KEY);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [on, setOn] = useState(false);
  const sleepRef = useRef(hostSleeping);
  const keyRef = useRef(hostKey);
  sleepRef.current = hostSleeping;
  keyRef.current = hostKey;
  // One guard for every flight, so a broken flight that comes back is logged once, not once per visit.
  const [guard] = useState(() => makeGuestGuard({ outcome: "The bird leaves the desk; the other pets keep moving." }));

  useEffect(() => {
    if (hidden || !startId) {
      setOn(false);
      onVisible?.(false);
      return;
    }
    const frames = guest.sprites.play?.length ? guest.sprites.play : guest.sprites.idle;
    let fly = beginFly(window.innerWidth, window.innerHeight, true);
    let last = performance.now();
    let frame = 0;
    let acc = 0;
    if (canvas.current) canvas.current.style.visibility = "";
    setOn(true);
    onVisible?.(true);
    playVoice(FLY_BIRD_KEY);
    fly = markCalled(fly);
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
    // Safe state for a flight that threw: the bird leaves now (hidden, loop stopped) instead of hanging
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
      fly = stepFly(fly, dt, window.innerWidth, window.innerHeight, {
        hidden,
        hostKey: keyRef.current,
        hostSleeping: !!sleepRef.current,
        hostX: pose?.x,
        hostLift: 0,
        hostFacing: pose?.facing,
      });
      if (!stillVisible(fly)) {
        leave();
        return false;
      }
      if (shouldCall(fly)) {
        playVoice(FLY_BIRD_KEY);
        fly = markCalled(fly);
      }
      acc += dt;
      if (acc > 1 / 8) {
        acc = 0;
        frame = (frame + 1) % frames.length;
      }
      const el = canvas.current;
      if (el) {
        paintSipFrame(el, frames[frame]!);
        el.style.transform = `translate3d(${fly.x}px, ${-fly.lift}px, 0) rotate(${fly.rot}deg) scale(${fly.facing}, 1)`;
      }
      return true;
    };
    const tick = guardedLoop(step, (next) => { raf = window.requestAnimationFrame(next); }, guard, () => FLY_BIRD_KEY);
    raf = window.requestAnimationFrame(tick);
    return () => {
      tick.stop();
      guard.onReset(null);
      window.cancelAnimationFrame(raf);
    };
  }, [guard, guest.sprites.idle, guest.sprites.play, hidden, hostPoseRef, onVisible, startId]);

  if (!on && !startId) return null;
  return (
    <canvas
      ref={canvas}
      role="img"
      aria-label={FLY_BIRD_NAME}
      data-hit
      data-bird={FLY_BIRD_KEY}
      data-surface="pending"
      className="pointer-events-auto absolute bottom-[18%] left-0 z-[6] h-28 w-28 origin-bottom select-none bg-transparent"
    />
  );
}
