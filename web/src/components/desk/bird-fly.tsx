import { useEffect, useRef, useState } from "react";
import { livingByKey } from "@/lib/pets/living";
import { beginFly, FLY_BIRD_KEY, FLY_BIRD_NAME, markCalled, shouldCall, stepFly, stillVisible } from "@/lib/pets/bird-fly";
import { playVoice } from "@/lib/pets/desk-audio";

export function BirdFlyer({
  hidden,
  startId,
  onVisible,
}: {
  hidden?: boolean;
  startId: number;
  onVisible?: (on: boolean) => void;
}) {
  const guest = livingByKey(FLY_BIRD_KEY);
  const img = useRef<HTMLImageElement>(null);
  const [on, setOn] = useState(false);

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
      fly = stepFly(fly, dt, window.innerWidth, window.innerHeight, { hidden });
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
      const el = img.current;
      if (el) {
        el.src = frames[frame]!;
        el.style.transform = `translate3d(${fly.x}px, ${-fly.lift}px, 0) rotate(${fly.rot}deg) scale(${fly.facing}, 1)`;
      }
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [guest.sprites.idle, guest.sprites.play, hidden, onVisible, startId]);

  if (!on && !startId) return null;
  return (
    <img
      ref={img}
      alt={FLY_BIRD_NAME}
      data-hit
      data-bird={FLY_BIRD_KEY}
      className="pointer-events-auto absolute bottom-[18%] left-0 z-[6] h-28 w-28 origin-bottom select-none"
      draggable={false}
    />
  );
}
