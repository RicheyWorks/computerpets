import { useMemo, useSyncExternalStore } from "react";
import { DEFAULT_MIND, bindingFor, loadMindSettings } from "./settings";
import type { MindSettings } from "./types";

const listeners = new Set<() => void>();

function emit() {
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
    loadMindSettings,
    () => DEFAULT_MIND,
  );
}

export function useMindBinding(species: string) {
  const settings = useMindSettings();
  return useMemo(() => bindingFor(settings, species), [settings, species]);
}
