import { mindPreset } from "./catalog";
import type { MindBinding, MindSettings, VoiceKind } from "./types";

const KEY = "computerpets.mind.v1";

export const DEFAULT_MIND: MindSettings = {
  default: { plugin: "xai", model: "grok-4.5" },
  voice: "browser",
  pets: {},
};

export function loadMindSettings(): MindSettings {
  if (typeof window === "undefined") return DEFAULT_MIND;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_MIND;
    const parsed = JSON.parse(raw) as Partial<MindSettings>;
    return {
      default: { ...DEFAULT_MIND.default, ...parsed.default },
      voice: parsed.voice ?? "browser",
      pets: parsed.pets ?? {},
    };
  } catch {
    return DEFAULT_MIND;
  }
}

export function saveMindSettings(next: MindSettings) {
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function bindingFor(settings: MindSettings, species: string): MindBinding {
  return settings.pets[species] ?? settings.default;
}

export function describeBinding(binding: MindBinding) {
  const preset = mindPreset(binding.plugin);
  return binding.model ? `${preset.name} · ${binding.model}` : preset.name;
}

export function asVoice(id: string | undefined): VoiceKind {
  if (id === "xai" || id === "openai" || id === "none" || id === "browser") return id;
  return "browser";
}
