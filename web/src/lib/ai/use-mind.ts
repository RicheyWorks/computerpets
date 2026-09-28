import { useMemo, useSyncExternalStore } from "react";
import {
  DEFAULT_MIND,
  MIND_STORAGE_KEY,
  askedBinding,
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

/** The mind a talk post asks for. Nothing picked: House lines unless `signedIn`. */
export function useMindBinding(species: string, signedIn = false) {
  const settings = useMindSettings();
  return useMemo(() => bindingFor(settings, species, signedIn), [settings, species, signedIn]);
}

/** The mind a listener read names; null when nothing is picked, so the house decides who answers. */
export function useAskedBinding(species: string) {
  const settings = useMindSettings();
  return useMemo(() => askedBinding(settings, species), [settings, species]);
}
