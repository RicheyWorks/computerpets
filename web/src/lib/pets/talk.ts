import { createServerFn } from "@tanstack/react-start";
import { optionalAuthMiddleware } from "@/lib/auth/middleware";
import { livingByKey } from "./living";
import { normalizeCare } from "./care";
import { localMind, runMind } from "@/lib/ai/complete";
import { speakWithPlugin } from "@/lib/ai/voice";
import { bindTalkSpend } from "./talk-spend";
import { parseTalkBody } from "./talk-post";
import { isTalkTimeout, isVoiceTimeout, readTalk, readVoice } from "./talk-net";

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
    const house = localMind(turn);
    let reply;
    try {
      reply = await readTalk(
        data.talkLine,
        spend.mind,
        (signal) => runMind(turn, spend.mind, signal),
        house,
      );
    } catch (err) {
      if (!isTalkTimeout(err)) throw err;
      reply = house;
    }

    let audio: string | undefined;
    if (data.speak !== false) {
      try {
        audio = await readVoice(data.voiceLine, spend.voice, (signal) =>
          speakWithPlugin(reply.text, spend.voice, kind.voice, spend.voiceKey, signal),
        );
      } catch (err) {
        if (!isVoiceTimeout(err)) throw err;
        audio = undefined;
      }
    }
    return { text: reply.text, audio, source: reply.source };
  });
