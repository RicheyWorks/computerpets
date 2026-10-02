import { useEffect, useRef, useState } from "react";
import { guardedLoop, makeGuestGuard } from "@/lib/pets/frame-guard";
import { livingByKey } from "@/lib/pets/living";
import {
  DEST_PX,
  beginDrag,
  clickMoved,
  endDrag,
  loadPlants,
  moveDrag,
  paintTransform,
  plantChoiceMarks,
  plantSrc,
  savePlants,
  selectOnly,
  setMode,
  windLean,
  type DeskPlant,
  type PlantMode,
} from "@/lib/pets/desk-plants";
import { paintPlantFrame } from "@/lib/pets/desk-sprite-surface";
import { reducedMotion } from "@/lib/pets/calm-motion";
import { giveWay } from "@/lib/pets/give-way";

export function DeskPlants({ windOn }: { windOn?: boolean }) {
  const [plants, setPlants] = useState<DeskPlant[]>([]);
  const [lean, setLean] = useState(0);
  const [choiceKey, setChoiceKey] = useState<string | null>(null);
  const plantsRef = useRef(plants);
  plantsRef.current = plants;
  const wind = useRef(!!windOn);
  wind.current = !!windOn;
  const press = useRef<{ key: string; x: number; y: number } | null>(null);
  const [guard] = useState(() => makeGuestGuard({ outcome: "The plants stand upright and the wind keeps going." }));

  useEffect(() => {
    setPlants(loadPlants(window.innerWidth, window.innerHeight));
  }, []);

  useEffect(() => {
    let last = performance.now();
    let age = 0;
    let raf = 0;
    // Safe state for a lean that threw: the plants stand upright; the loop keeps running.
    guard.onReset(() => setLean(0));
    const step = (now: number) => {
      const dt = Math.min(0.08, (now - last) / 1000);
      last = now;
      age += dt;
      const selected = plantsRef.current.some((p) => p.selected);
      // Reduced motion: the plants stand still in the wind (calm-motion.ts), whatever each one is set to.
      const still = reducedMotion() || plantsRef.current.every((p) => p.mode === "still");
      setLean(still ? 0 : windLean(age, wind.current, selected));
    };
    const tick = guardedLoop(step, (next) => { raf = window.requestAnimationFrame(next); }, guard, () => "plants", () => window.cancelAnimationFrame(raf));
    raf = window.requestAnimationFrame(tick);
    return () => {
      tick.stop();
      guard.onReset(null);
      window.cancelAnimationFrame(raf);
    };
  }, [guard]);

  function persist(next: DeskPlant[]) {
    setPlants(savePlants(next));
  }

  function pickMode(key: string, mode: PlantMode) {
    persist(plantsRef.current.map((p) => (p.key === key ? setMode(p, mode) : p)));
    setChoiceKey(null);
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-[5]">
      {plants.map((plant) => {
        const guest = livingByKey(plant.key);
        const src = plantSrc(plant.key, guest.sprites);
        const plantLean = plant.mode === "still" ? 0 : plant.selected ? lean * 0.4 : lean;
        return (
          <button
            key={plant.key}
            type="button"
            data-hit
            data-plant={plant.key}
            data-mode={plant.mode}
            // On a small phone the care row stands over the plants' spot: under it a plant gives way (give-way.ts),
            // so the keyboard is not sent to a plant hidden behind the care buttons, and it comes back once clear.
            ref={giveWay}
            aria-label={plant.name}
            className="pointer-events-auto absolute left-0 top-0 origin-bottom border-0 bg-transparent p-0"
            style={{
              width: DEST_PX,
              height: DEST_PX,
              transform: paintTransform(plant, plantLean),
              outline: plant.selected ? "1px solid rgb(216 207 192 / 0.45)" : "none",
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              e.currentTarget.setPointerCapture(e.pointerId);
              press.current = { key: plant.key, x: e.clientX, y: e.clientY };
              persist(selectOnly(plants, plant.key));
            }}
            onPointerMove={(e) => {
              if (!e.currentTarget.hasPointerCapture(e.pointerId) || !press.current || press.current.key !== plant.key) return;
              const row = plantsRef.current.find((p) => p.key === plant.key);
              if (!row) return;
              if (!row.dragging && clickMoved(e.clientX - press.current.x, e.clientY - press.current.y)) {
                persist(plantsRef.current.map((p) => (p.key === plant.key ? beginDrag(p, press.current!.x, press.current!.y) : p)));
                setChoiceKey(null);
              }
              const live = plantsRef.current.find((p) => p.key === plant.key);
              if (live?.dragging) persist(plantsRef.current.map((p) => (p.key === plant.key ? moveDrag(p, e.clientX, e.clientY, window.innerWidth, window.innerHeight) : p)));
            }}
            onPointerUp={() => {
              const row = plantsRef.current.find((p) => p.key === plant.key);
              if (row?.dragging) persist(plantsRef.current.map((p) => (p.key === plant.key ? endDrag(p) : p)));
              else setChoiceKey(plant.key);
              press.current = null;
            }}
          >
            <canvas
              role="img"
              aria-label={plant.name}
              data-surface="pending"
              ref={(node) => {
                if (!node || node.dataset.seed === "1" || !src) return;
                node.dataset.seed = "1";
                paintPlantFrame(node, src);
              }}
              className="block h-full w-full border-0 bg-transparent shadow-none outline-none"
            />
          </button>
        );
      })}
      {choiceKey
        ? plants
            .filter((p) => p.key === choiceKey)
            .map((plant) => (
              <div
                key={`choice-${plant.key}`}
                data-hit
                data-plant-choice={plant.key}
                className="pointer-events-auto absolute z-[7] flex w-32 flex-col gap-0.5 rounded-[10px] border border-[#2a2621] bg-[rgb(22_20_18_/_0.94)] px-2 py-1.5"
                style={{ left: plant.x, top: Math.max(8, plant.y - 8) }}
              >
                {plantChoiceMarks().map((mark) => (
                  <button
                    key={mark.id}
                    type="button"
                    data-hit
                    data-plant-mode={mark.id}
                    className="min-h-8 border-0 bg-transparent px-1.5 py-2 text-left text-[13px] tracking-[0.04em] text-[#f2ece3]"
                    onClick={(e) => {
                      e.stopPropagation();
                      pickMode(plant.key, mark.id);
                    }}
                  >
                    {mark.label}
                  </button>
                ))}
              </div>
            ))
        : null}
    </div>
  );
}
