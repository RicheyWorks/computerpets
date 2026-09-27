import { z } from "zod";
import { scrubSecretModel, scrubSecretQueryString } from "../ai/secret-query.mjs";
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
    if (typeof mindCopy.model === "string") {
      const model = scrubSecretModel(mindCopy.model);
      if (model) mindCopy.model = model;
      else delete mindCopy.model;
    }
    if (typeof mindCopy.baseUrl === "string") mindCopy.baseUrl = scrubSecretQueryString(mindCopy.baseUrl);
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
    talkLine: z.string().max(400).optional(),
    voiceLine: z.string().max(400).optional(),
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
  const model = scrubSecretModel(binding?.model);
  const baseUrl = binding?.baseUrl?.trim();
  const mind: { plugin: string; model?: string; baseUrl?: string } = { plugin };
  if (model) mind.model = model;
  if (baseUrl) {
    const scrubbed = scrubSecretQueryString(baseUrl);
    if (scrubbed) mind.baseUrl = scrubbed;
  }
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
  talkLine?: string;
  voiceLine?: string;
};

/**
 * JSON body for house talk. There is no query string on the post.
 * `apiKey` is not copied onto the body or into `mind`.
 * A pasted secret query on the base URL is dropped before the post.
 * A pasted secret in the model field is dropped too. A normal model id stays. The rest of the body stays.
 */
/**
 * True when a talk turn goes through a plugin: a mind other than the house ("local"), or a server
 * voice (xAI, OpenAI). Browser speech and no voice stay on this computer. A failed turn then gets
 * the Minds reasons (key, rate limit, address…) instead of the house ones.
 */
export function talkUsesPlugin(binding: MindBinding | null | undefined, voice?: VoiceKind | string | null): boolean {
  return mindForHouse(binding).plugin !== "local" || voice === "xai" || voice === "openai";
}

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
    ...(input.talkLine ? { talkLine: input.talkLine } : {}),
    ...(input.voiceLine ? { voiceLine: input.voiceLine } : {}),
  };
}
