import { createServerFn } from "@tanstack/react-start";
import { optionalAuthMiddleware } from "@/lib/auth/middleware";
import { livingByKey } from "./living";
import { normalizeCare } from "./care";
import { localMind, runMind } from "@/lib/ai/complete";
import { speakWithPlugin } from "@/lib/ai/voice";
import { bindTalkSpend } from "./talk-spend";
import { parseTalkBody } from "./talk-post";
import { talkHonesty, talkMaySend, voiceHonesty, voiceMaySend } from "./talk-net";

export type TalkResult = {
  text: string;
  audio?: string;
  source: string;
};

export const converseWithPet = createServerFn({ method: "POST" })
  .middleware([optionalAuthMiddleware])
  .validator((raw: unknown) => parseTalkBody(raw))
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

    const turn = {
      name: data.name,
      species: data.species,
      speciesLabel: kind.speciesLabel,
      systemPrompt: kind.systemPrompt,
      hunger: stats.hunger,
      mood: stats.mood,
      energy: stats.energy,
      hygiene: stats.hygiene,
      message: data.message,
    };
    const reply = talkMaySend(spend.mind, data.talkLine === talkHonesty(spend.mind))
      ? await runMind(turn, spend.mind)
      : localMind(turn);

    const audio =
      data.speak === false || !voiceMaySend(spend.voice, data.voiceLine === voiceHonesty(spend.voice))
        ? undefined
        : await speakWithPlugin(reply.text, spend.voice, kind.voice, spend.voiceKey);
    return { text: reply.text, audio, source: reply.source };
  });
