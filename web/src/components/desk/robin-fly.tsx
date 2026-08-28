import { useEffect, useRef, useState, type RefObject } from "react";
import { livingByKey } from "@/lib/pets/living";
import {
  ROBIN_KEY,
  ROBIN_NAME,
  ROBIN_SONG,
  beginRobinFly,
  destSrc,
  destStyle,
  markSung,
  shouldSing,
  stepRobinFly,
  stillVisible,
} from "@/lib/pets/robin-fly";
import { playVoice } from "@/lib/pets/desk-audio";

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
  const img = useRef<HTMLImageElement>(null);
  const [on, setOn] = useState(false);
  const sleepRef = useRef(hostSleeping);
  const keyRef = useRef(hostKey);
  const songRef = useRef(onSong);
  sleepRef.current = hostSleeping;
  keyRef.current = hostKey;
  songRef.current = onSong;

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
    const first = destSrc(fly, guest.sprites);
    setOn(true);
    onVisible?.(true);
    if (img.current && first) {
      img.current.setAttribute("src", first);
      Object.assign(img.current.style, destStyle());
    }
    playVoice(ROBIN_KEY);
    let raf = 0;
    const tick = (now: number) => {
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
        setOn(false);
        onVisible?.(false);
        return;
      }
      if (shouldSing(fly)) {
        songRef.current?.(ROBIN_SONG);
        fly = markSung(fly);
      }
      acc += dt;
      if (acc > 1 / 8) {
        acc = 0;
        frame = (frame + 1) % 4;
      }
      fly.frame = frame;
      const el = img.current;
      const src = destSrc(fly, guest.sprites);
      if (el && src) {
        if (el.getAttribute("src") !== src) el.setAttribute("src", src);
        Object.assign(el.style, destStyle());
        el.style.transform = `translate3d(${fly.x}px, ${-fly.lift}px, 0) rotate(${fly.rot}deg) scale(${fly.facing}, ${fly.flap || 1})`;
      }
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [guest.sprites, hidden, hostPoseRef, onVisible, startId]);

  if (!on && !startId) return null;
  return (
    <img
      ref={img}
      alt={ROBIN_NAME}
      data-hit
      data-robin={ROBIN_KEY}
      src={destSrc({ key: ROBIN_KEY, phase: "stay", t: 0, age: 0, x: 0, lift: 0, rot: 0, facing: 1, fromX: 0, toX: 0, fromLift: 0, toLift: 0, sungAt: 0, flap: 1 }, guest.sprites)}
      className="pointer-events-auto absolute bottom-0 left-0 z-[6] h-28 w-28 origin-bottom select-none border-0 bg-transparent object-contain object-bottom shadow-none outline-none"
      draggable={false}
    />
  );
}
