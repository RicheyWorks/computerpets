import { z } from "zod";
import type { MindBinding, VoiceKind } from "../ai/types";

/**
 * What desk talk may post to the house.
 * Plugin, model, and base URL. The plugin key is not a field.
 */
const houseMind = z.object({
  plugin: z.string().trim().min(1).max(32).default("local"),
  model: z.string().trim().max(80).optional(),
  baseUrl: z.string().trim().max(240).optional(),
});

function withoutClientKey(raw: unknown): unknown {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return raw;
  const copy = { ...(raw as Record<string, unknown>) };
  delete copy.apiKey;
  const mind = copy.mind;
  if (mind && typeof mind === "object" && !Array.isArray(mind)) {
    const mindCopy = { ...(mind as Record<string, unknown>) };
    delete mindCopy.apiKey;
    copy.mind = mindCopy;
  }
  return copy;
}

export const talkBodySchema = z.preprocess(
  withoutClientKey,
  z.object({
    message: z.string().trim().max(200).optional(),
    hunger: z.number().min(0).max(100),
    mood: z.number().min(0).max(100),
    energy: z.number().min(0).max(100),
    hygiene: z.number().min(0).max(100).optional(),
    name: z.string().trim().min(1).max(24).default("Rui"),
    species: z.string().trim().min(1).max(32).default("red_panda"),
    speak: z.boolean().optional(),
    mind: houseMind.optional(),
    voice: z.enum(["browser", "xai", "openai", "none"]).optional(),
  }),
);

export function parseTalkBody(raw: unknown) {
  return talkBodySchema.parse(raw);
}

/** Plugin, model, and base URL. Never the key, even when the binding still holds one. */
export function mindForHouse(binding: MindBinding | null | undefined): {
  plugin: string;
  model?: string;
  baseUrl?: string;
} {
  const plugin = binding?.plugin?.trim() || "local";
  const model = binding?.model?.trim();
  const baseUrl = binding?.baseUrl?.trim();
  const mind: { plugin: string; model?: string; baseUrl?: string } = { plugin };
  if (model) mind.model = model;
  if (baseUrl) mind.baseUrl = baseUrl;
  return mind;
}

export type TalkPostInput = {
  message?: string;
  hunger: number;
  mood: number;
  energy: number;
  hygiene?: number;
  name: string;
  species: string;
  speak?: boolean;
  mind?: MindBinding | null;
  voice?: VoiceKind;
};

/**
 * JSON body for house talk. There is no query string.
 * `apiKey` is not copied onto the body or into `mind`.
 */
export function talkBody(input: TalkPostInput) {
  return {
    ...(input.message !== undefined ? { message: input.message } : {}),
    hunger: input.hunger,
    mood: input.mood,
    energy: input.energy,
    ...(input.hygiene !== undefined ? { hygiene: input.hygiene } : {}),
    name: input.name,
    species: input.species,
    ...(input.speak !== undefined ? { speak: input.speak } : {}),
    mind: mindForHouse(input.mind),
    ...(input.voice !== undefined ? { voice: input.voice } : {}),
  };
}
