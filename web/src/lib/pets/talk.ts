import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { livingByKey } from "./living";
import { normalizeCare } from "./care";
import { mindPreset } from "@/lib/ai/catalog";
import { runMind } from "@/lib/ai/complete";
import { speakWithPlugin } from "@/lib/ai/voice";
import type { MindBinding, VoiceKind } from "@/lib/ai/types";

const binding = z.object({
  plugin: z.string().trim().min(1).max(32).default("local"),
  model: z.string().trim().max(80).optional(),
  baseUrl: z.string().trim().max(200).optional(),
  apiKey: z.string().trim().max(200).optional(),
});

const input = z.object({
  message: z.string().trim().max(200).optional(),
  hunger: z.number().min(0).max(100),
  mood: z.number().min(0).max(100),
  energy: z.number().min(0).max(100),
  hygiene: z.number().min(0).max(100).optional(),
  name: z.string().trim().min(1).max(24).default("Rui"),
  species: z.string().trim().min(1).max(32).default("red_panda"),
  speak: z.boolean().optional(),
  mind: binding.optional(),
  voice: z.enum(["browser", "xai", "openai", "none"]).optional(),
});

export type TalkResult = {
  text: string;
  audio?: string;
  source: string;
};

function resolveKey(mind: MindBinding): string | undefined {
  if (mind.apiKey) return mind.apiKey;
  const envName = mindPreset(mind.plugin).envKey;
  if (!envName) return undefined;
  return process.env[envName];
}

export const converseWithPet = createServerFn({ method: "POST" })
  .validator((raw: unknown) => input.parse(raw))
  .handler(async ({ data }): Promise<TalkResult> => {
    const kind = livingByKey(data.species);
    const stats = normalizeCare({
      hunger: data.hunger,
      mood: data.mood,
      energy: data.energy,
      hygiene: data.hygiene,
    });
    const mind: MindBinding = data.mind ?? { plugin: process.env.XAI_API_KEY ? "xai" : "local" };
    const withKey: MindBinding = { ...mind, apiKey: resolveKey(mind) };

    const reply = await runMind(
      {
        name: data.name,
        species: data.species,
        speciesLabel: kind.speciesLabel,
        systemPrompt: kind.systemPrompt,
        hunger: stats.hunger,
        mood: stats.mood,
        energy: stats.energy,
        hygiene: stats.hygiene,
        message: data.message,
      },
      withKey,
    );

    const voice: VoiceKind = data.voice ?? "browser";
    const voiceKey =
      voice === "xai" ? process.env.XAI_API_KEY ?? withKey.apiKey : voice === "openai" ? process.env.OPENAI_API_KEY ?? withKey.apiKey : undefined;
    const audio =
      data.speak === false ? undefined : await speakWithPlugin(reply.text, voice, kind.voice, voiceKey);
    return { text: reply.text, audio, source: reply.source };
  });
