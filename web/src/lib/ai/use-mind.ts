import { useMemo, useSyncExternalStore } from "react";
import {
  DEFAULT_MIND,
  MIND_STORAGE_KEY,
  bindingFor,
  loadMindSettings,
  noteExternalMindStorage,
  onMindStoreChange,
} from "./settings";
import type { MindSettings } from "./types";

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((fn) => fn());
}

onMindStoreChange(() => emit());

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === MIND_STORAGE_KEY || e.key === null) {
      noteExternalMindStorage();
      emit();
    }
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
