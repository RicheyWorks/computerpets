import { useMemo, useSyncExternalStore } from "react";
import { bindingFor, loadMindSettings } from "./settings";
import type { MindSettings } from "./types";

let cached = loadMindSettings();
const listeners = new Set<() => void>();

function emit() {
  cached = loadMindSettings();
  listeners.forEach((fn) => fn());
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === "computerpets.mind.v1") emit();
  });
}

export function refreshMindSettings() {
  emit();
}

export function useMindSettings(): MindSettings {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    () => cached,
    () => cached,
  );
}

export function useMindBinding(species: string) {
  const settings = useMindSettings();
  return useMemo(() => bindingFor(settings, species), [settings, species]);
}
