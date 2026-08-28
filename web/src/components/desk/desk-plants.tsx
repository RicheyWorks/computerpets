import { useEffect, useRef, useState } from "react";
import { livingByKey } from "@/lib/pets/living";
import {
  DEST_PX,
  beginDrag,
  destStyle,
  endDrag,
  loadPlants,
  moveDrag,
  paintTransform,
  plantSrc,
  savePlants,
  selectOnly,
  windLean,
  type DeskPlant,
} from "@/lib/pets/desk-plants";

export function DeskPlants({ windOn }: { windOn?: boolean }) {
  const [plants, setPlants] = useState<DeskPlant[]>([]);
  const [lean, setLean] = useState(0);
  const plantsRef = useRef(plants);
  plantsRef.current = plants;
  const wind = useRef(!!windOn);
  wind.current = !!windOn;

  useEffect(() => {
    setPlants(loadPlants(window.innerWidth, window.innerHeight));
  }, []);

  useEffect(() => {
    let last = performance.now();
    let age = 0;
    let raf = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.08, (now - last) / 1000);
      last = now;
      age += dt;
      const selected = plantsRef.current.some((p) => p.selected);
      setLean(windLean(age, wind.current, selected));
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, []);

  function persist(next: DeskPlant[]) {
    setPlants(savePlants(next));
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-[5]">
      {plants.map((plant) => {
        const guest = livingByKey(plant.key);
        const src = plantSrc(plant.key, guest.sprites);
        return (
          <button
            key={plant.key}
            type="button"
            data-hit
            data-plant={plant.key}
            aria-label={plant.name}
            className="pointer-events-auto absolute left-0 top-0 origin-bottom border-0 bg-transparent p-0"
            style={{
              width: DEST_PX,
              height: DEST_PX,
              transform: paintTransform(plant, plant.selected ? lean * 0.4 : lean),
              outline: plant.selected ? "1px solid rgb(216 207 192 / 0.45)" : "none",
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              e.currentTarget.setPointerCapture(e.pointerId);
              persist(selectOnly(plants, plant.key).map((p) => (p.key === plant.key ? beginDrag(p, e.clientX, e.clientY) : p)));
            }}
            onPointerMove={(e) => {
              if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
              persist(plantsRef.current.map((p) => (p.key === plant.key ? moveDrag(p, e.clientX, e.clientY, window.innerWidth, window.innerHeight) : p)));
            }}
            onPointerUp={() => {
              persist(plantsRef.current.map((p) => (p.key === plant.key ? endDrag(p) : p)));
            }}
          >
            <img
              alt={plant.name}
              src={src}
              className="h-full w-full border-0 bg-transparent object-contain object-bottom shadow-none outline-none"
              style={destStyle()}
              draggable={false}
            />
          </button>
        );
      })}
    </div>
  );
}
