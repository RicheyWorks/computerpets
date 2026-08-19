import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { optionalAuthMiddleware } from "@/lib/auth/middleware";
import { livingByKey } from "./living";
import { normalizeCare } from "./care";
import { runMind } from "@/lib/ai/complete";
import { speakWithPlugin } from "@/lib/ai/voice";
import { bindTalkSpend } from "./talk-spend";

const binding = z.object({
  plugin: z.string().trim().min(1).max(32).default("local"),
  model: z.string().trim().max(80).optional(),
  baseUrl: z.string().trim().max(240).optional(),
  apiKey: z.string().trim().max(400).optional(),
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

export const converseWithPet = createServerFn({ method: "POST" })
  .middleware([optionalAuthMiddleware])
  .validator((raw: unknown) => input.parse(raw))
  .handler(async ({ data, context }): Promise<TalkResult> => {
    const kind = livingByKey(data.species);
    const stats = normalizeCare({
      hunger: data.hunger,
      mood: data.mood,
      energy: data.energy,
      hygiene: data.hygiene,
    });
    const spend = bindTalkSpend({
      mind: data.mind,
      voice: data.voice,
      signedIn: Boolean(context.userId),
    });

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
      spend.mind,
    );

    const audio =
      data.speak === false ? undefined : await speakWithPlugin(reply.text, spend.voice, kind.voice, spend.voiceKey);
    return { text: reply.text, audio, source: reply.source };
  });
