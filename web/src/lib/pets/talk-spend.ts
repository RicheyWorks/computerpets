import { mindPreset } from "@/lib/ai/catalog";
import type { MindBinding, VoiceKind } from "@/lib/ai/types";

export type TalkSpendInput = {
  mind?: MindBinding;
  voice?: VoiceKind;
  signedIn: boolean;
};

export type TalkSpend = {
  mind: MindBinding;
  voice: VoiceKind;
  voiceKey: string | undefined;
};

type EnvMap = Record<string, string | undefined>;

function quietVoice(voice: VoiceKind | undefined): VoiceKind {
  if (voice === "none") return "none";
  return "browser";
}

/**
 * Who may spend a house key.
 *
 * A guest (demo, meet, a desk with no session) gets house lines only.
 * Client `apiKey` is stripped. It never unlocks `XAI_API_KEY` / `OPENAI_API_KEY`.
 * A signed-in keeper may use the env key for the mind they asked for, and for
 * house voice. The key stays on the server.
 */
export function bindTalkSpend(input: TalkSpendInput, env: EnvMap = process.env): TalkSpend {
  if (!input.signedIn) {
    return {
      mind: { plugin: "local" },
      voice: quietVoice(input.voice),
      voiceKey: undefined,
    };
  }

  const asked = input.mind;
  const plugin = asked?.plugin?.trim() || (env.XAI_API_KEY ? "xai" : "local");
  const preset = mindPreset(plugin);
  const houseKey = preset.envKey ? env[preset.envKey] : undefined;
  const voice = input.voice ?? "browser";
  const voiceKey =
    voice === "xai" ? env.XAI_API_KEY : voice === "openai" ? env.OPENAI_API_KEY : undefined;

  return {
    mind: {
      plugin,
      model: asked?.model,
      baseUrl: asked?.baseUrl,
      apiKey: houseKey,
    },
    voice,
    voiceKey,
  };
}
