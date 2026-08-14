import { useEffect, useRef } from "react";
import { playDeskSound } from "@/lib/pets/desk-audio";
import {
  ANIM_FPS,
  ONCE_ANIMS,
  RED_PANDA_SPRITES,
  type PetAnim,
} from "@/lib/pets/red-panda";

export type PetCommand = PetAnim | "wander" | "none";

type LivingPetProps = {
  command: PetCommand;
  orderId: number;
  speech: string | null;
  onArrived?: () => void;
  onTap?: () => void;
};

type Dust = { x: number; y: number; vx: number; vy: number; life: number; size: number };

type Sim = {
  x: number;
  facing: 1 | -1;
  anim: PetAnim;
  frame: number;
  acc: number;
  target: number | null;
  hop: number;
  land: number;
  walkAge: number;
  dragging: boolean;
  dragDx: number;
  pointerStart: { x: number; y: number } | null;
  cursorX: number | null;
  dust: Dust[];
  stepAcc: number;
};

const WALK_SPEED = 98;
const PAD = 20;
const SPRITE = 176;
const BUBBLE_W = 220;

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function floorY(h: number) {
  return h * 0.27;
}

function walkSpeed(remaining: number, age: number) {
  const accel = Math.min(1, age / 0.28);
  const decel = remaining < 56 ? remaining / 56 : 1;
  return WALK_SPEED * Math.max(0.3, accel * decel);
}

export function LivingPet({ command, orderId, speech, onArrived, onTap }: LivingPetProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const dustRef = useRef<HTMLDivElement>(null);
  const sim = useRef<Sim>({
    x: 120,
    facing: 1,
    anim: "idle",
    frame: 0,
    acc: 0,
    target: null,
    hop: 0,
    land: 0,
    walkAge: 0,
    dragging: false,
    dragDx: 0,
    pointerStart: null,
    cursorX: null,
    dust: [],
    stepAcc: 0,
  });
  const cmdRef = useRef(command);
  const orderRef = useRef(orderId);
  const lastOrder = useRef(-1);
  const arrivedRef = useRef(onArrived);
  const tapRef = useRef(onTap);
  cmdRef.current = command;
  orderRef.current = orderId;
  arrivedRef.current = onArrived;
  tapRef.current = onTap;

  useEffect(() => {
    const root = wrapRef.current;
    if (!root) return;
    const s = sim.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let last = performance.now();
    let raf = 0;

    const stage = () => root.parentElement?.getBoundingClientRect();

    const puff = (x: number, y: number, n = 4) => {
      for (let i = 0; i < n; i++) {
        s.dust.push({
          x: x + 60 + (Math.random() - 0.5) * 36,
          y: y + 8,
          vx: (Math.random() - 0.5) * 36,
          vy: -12 - Math.random() * 22,
          life: 0.45 + Math.random() * 0.25,
          size: 3 + Math.random() * 4,
        });
      }
      if (s.dust.length > 18) s.dust.splice(0, s.dust.length - 18);
    };

    const applyCommand = (cmd: PetCommand, order: number) => {
      if (s.dragging) return;
      if (order === lastOrder.current || cmd === "none") return;
      lastOrder.current = order;
      if (cmd === "wander") {
        const box = stage();
        const max = (box?.width ?? 400) - SPRITE - PAD;
        const span = Math.max(48, max - PAD);
        let next = PAD + Math.random() * span;
        if (Math.abs(next - s.x) < 50) next = clamp(s.x + (s.facing * 90 || 90), PAD, max);
        s.target = next;
        s.facing = s.target >= s.x ? 1 : -1;
        s.anim = "walk";
        s.frame = 0;
        s.walkAge = 0;
        return;
      }
      if (cmd === "play") {
        s.hop = 1;
        s.anim = "play";
        s.target = null;
        s.frame = 0;
        s.acc = 0;
        playDeskSound("hop");
        return;
      }
      if (cmd === "eat" || cmd === "talk" || cmd === "idle" || cmd === "sit" || cmd === "sleep") {
        s.anim = cmd;
        s.target = null;
        s.frame = 0;
        s.acc = 0;
        if (cmd === "eat") playDeskSound("munch");
        if (cmd === "talk") playDeskSound("chirp");
      }
    };

    const tick = (now: number) => {
      try {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const box = stage();
      const width = box?.width ?? 800;
      const height = box?.height ?? 500;
      const maxX = Math.max(PAD, width - SPRITE - PAD);

      if (s.hop > 0) {
        const prev = s.hop;
        s.hop = Math.max(0, s.hop - dt * 2.15);
        if (prev > 0 && s.hop === 0) {
          s.land = 1;
          puff(s.x, 0, 5);
        }
      }
      if (s.land > 0) s.land = Math.max(0, s.land - dt * 3.4);

      if (!s.dragging) {
        applyCommand(cmdRef.current, orderRef.current);
        if (s.anim === "walk" && s.target != null && !reduced) {
          const remaining = Math.abs(s.target - s.x);
          const dir = s.target >= s.x ? 1 : -1;
          s.facing = dir;
          s.walkAge += dt;
          s.x += dir * walkSpeed(remaining, s.walkAge) * dt;
          s.stepAcc += dt;
          if (s.stepAcc > 0.22) {
            s.stepAcc = 0;
            playDeskSound("step");
            if (Math.random() < 0.45) puff(s.x, 4, 2);
          }
          if ((dir === 1 && s.x >= s.target) || (dir === -1 && s.x <= s.target)) {
            s.x = s.target;
            s.target = null;
            s.anim = "idle";
            s.frame = 0;
            s.land = 0.7;
            arrivedRef.current?.();
          }
        } else if (
          (s.anim === "idle" || s.anim === "sit") &&
          s.cursorX != null &&
          Math.abs(s.cursorX - (s.x + SPRITE / 2)) > 36
        ) {
          s.facing = s.cursorX >= s.x + SPRITE / 2 ? 1 : -1;
        }
        s.x = clamp(s.x, PAD, maxX);

        const fps = reduced ? 0 : ANIM_FPS[s.anim];
        if (fps > 0) {
          s.acc += dt;
          const step = 1 / fps;
          while (s.acc >= step) {
            s.acc -= step;
            const frames = RED_PANDA_SPRITES[s.anim];
            const len = frames.length;
            if (s.anim === "sit") {
              s.frame = Math.min(len - 1, s.frame + 1);
            } else if (ONCE_ANIMS.has(s.anim)) {
              if (s.frame + 1 >= len) {
                s.anim = "idle";
                s.frame = 0;
                arrivedRef.current?.();
              } else {
                s.frame += 1;
                if (s.anim === "eat" && s.frame === 1) playDeskSound("munch");
              }
            } else {
              s.frame = (s.frame + 1) % len;
            }
          }
        }
      }

      for (const d of s.dust) {
        d.life -= dt;
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        d.vy += 28 * dt;
      }
      s.dust = s.dust.filter((d) => d.life > 0);

      const frames = RED_PANDA_SPRITES[s.anim];
      const src = frames[Math.min(s.frame, frames.length - 1)]!;
      const hopPx = s.hop > 0 ? Math.sin(s.hop * Math.PI) * 26 : 0;
      const y = floorY(height) + hopPx;
      const breathe =
        s.anim === "idle" || s.anim === "sit" || s.anim === "sleep"
          ? 1 + Math.sin(now * (s.anim === "sleep" ? 0.0032 : 0.0046)) * (s.anim === "sleep" ? 0.03 : 0.016)
          : 1;
      const stretch = s.hop > 0 ? 1 + Math.sin(s.hop * Math.PI) * 0.09 : s.land > 0 ? 1 - Math.sin(s.land * Math.PI) * 0.08 : breathe;
      const squat = 2 - stretch;

      if (imgRef.current) {
        if (imgRef.current.src !== new URL(src, window.location.origin).href) {
          imgRef.current.src = src;
        }
        imgRef.current.style.transform = `translate3d(${s.x}px, ${-y}px, 0) scale(${s.facing * squat}, ${stretch})`;
      }
      if (shadowRef.current) {
        const shrink = 1 - hopPx / 90;
        shadowRef.current.style.transform = `translate3d(${s.x + 34}px, ${8}px, 0) scale(${shrink}, ${shrink})`;
        shadowRef.current.style.opacity = String(0.32 - hopPx / 90);
      }
      if (bubbleRef.current) {
        const bx = clamp(s.x + SPRITE * 0.5 - BUBBLE_W * 0.5, 10, Math.max(10, width - BUBBLE_W - 10));
        bubbleRef.current.style.transform = `translate3d(${bx}px, ${-y - 18}px, 0)`;
      }
      if (dustRef.current) {
        const nodes = dustRef.current.children;
        for (let i = 0; i < nodes.length; i++) {
          const el = nodes[i] as HTMLElement;
          const d = s.dust[i];
          if (!d) {
            el.style.opacity = "0";
            continue;
          }
          el.style.opacity = String(Math.max(0, d.life * 1.4));
          el.style.width = `${d.size}px`;
          el.style.height = `${d.size}px`;
          el.style.transform = `translate3d(${d.x}px, ${-floorY(height) + d.y}px, 0)`;
        }
      }

      raf = requestAnimationFrame(tick);
      } catch {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);

    const onDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest("[data-pet]")) return;
      s.dragging = true;
      s.pointerStart = { x: e.clientX, y: e.clientY };
      s.dragDx = e.clientX - s.x;
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      const box = stage();
      s.cursorX = e.clientX - (box?.left ?? 0);
      if (!s.dragging) return;
      const maxX = Math.max(PAD, (box?.width ?? 800) - SPRITE - PAD);
      s.x = clamp(e.clientX - s.dragDx, PAD, maxX);
      if (s.pointerStart && Math.abs(e.clientX - s.pointerStart.x) > 10) {
        s.facing = e.clientX >= s.pointerStart.x ? 1 : -1;
      }
    };
    const onUp = (e: PointerEvent) => {
      if (!s.dragging) return;
      const start = s.pointerStart;
      s.dragging = false;
      s.pointerStart = null;
      if (start && Math.hypot(e.clientX - start.x, e.clientY - start.y) < 8) {
        tapRef.current?.();
      } else {
        s.anim = "idle";
        s.land = 0.55;
        puff(s.x, 4, 3);
        arrivedRef.current?.();
      }
    };

    root.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <div ref={wrapRef} className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        ref={shadowRef}
        className="absolute bottom-0 left-0 h-3.5 w-24 rounded-[100%] bg-bg/55 blur-[4px]"
        style={{ willChange: "transform" }}
      />
      <div ref={dustRef} className="absolute bottom-0 left-0">
        {Array.from({ length: 12 }, (_, i) => (
          <span
            key={i}
            className="absolute bottom-0 left-0 rounded-full bg-primary/50"
            style={{ opacity: 0, willChange: "transform, opacity" }}
          />
        ))}
      </div>
      <div
        ref={bubbleRef}
        className="absolute bottom-[214px] left-0 z-10 w-[min(220px,70vw)] pointer-events-none transition-opacity duration-200"
        style={{ willChange: "transform", opacity: speech ? 1 : 0 }}
      >
        <p className="rounded-[var(--radius-md)] border border-border bg-surface/95 px-3 py-2 text-sm leading-snug text-fg shadow-lg">
          {speech ?? "\u00a0"}
        </p>
      </div>
      <img
        ref={imgRef}
        data-pet
        src={RED_PANDA_SPRITES.idle[0]}
        alt=""
        draggable={false}
        className="pointer-events-auto absolute bottom-0 left-0 h-44 w-44 cursor-grab object-contain object-bottom active:cursor-grabbing select-none touch-none"
        style={{ willChange: "transform", transformOrigin: "center bottom" }}
      />
    </div>
  );
}
