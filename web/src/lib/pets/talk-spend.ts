import type { MindBinding, VoiceKind } from "../ai/types";

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

/** Plugin → house env name. Matches `MIND_PRESETS` `envKey`. */
const HOUSE_ENV: Record<string, string> = {
  xai: "XAI_API_KEY",
  openai: "OPENAI_API_KEY",
  anthropic: "ANTHROPIC_API_KEY",
  google: "GEMINI_API_KEY",
  groq: "GROQ_API_KEY",
  openrouter: "OPENROUTER_API_KEY",
  together: "TOGETHER_API_KEY",
  fireworks: "FIREWORKS_API_KEY",
  deepseek: "DEEPSEEK_API_KEY",
  mistral: "MISTRAL_API_KEY",
};

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
  const envName = HOUSE_ENV[plugin];
  const houseKey = envName ? env[envName] : undefined;
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
