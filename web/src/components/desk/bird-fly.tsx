import { useEffect, useRef, useState, type RefObject } from "react";
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
    setOn(true);
    onVisible?.(true);
    playVoice(FLY_BIRD_KEY);
    fly = markCalled(fly);
    let raf = 0;
    const tick = (now: number) => {
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
        setOn(false);
        onVisible?.(false);
        return;
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
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [guest.sprites.idle, guest.sprites.play, hidden, hostPoseRef, onVisible, startId]);

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
