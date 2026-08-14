export type MindKind = "local" | "openai" | "anthropic" | "ollama" | "gemini" | "custom";

export type MindContext = {
  name: string;
  species: string;
  speciesLabel?: string;
  systemPrompt: string;
  hunger: number;
  mood: number;
  energy: number;
  hygiene?: number;
  message?: string;
};

export type MindOptions = {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  extraHeaders?: Record<string, string>;
};

export type MindReply = {
  text: string;
  source: string;
};

export type MindPreset = {
  id: string;
  name: string;
  blurb: string;
  kind: MindKind;
  needsKey: boolean;
  defaultBaseUrl?: string;
  defaultModel?: string;
  models?: string[];
  envKey?: string;
};

export type VoiceKind = "browser" | "xai" | "openai" | "none";

export type VoicePreset = {
  id: VoiceKind;
  name: string;
  blurb: string;
  needsKey: boolean;
};

export type MindBinding = {
  plugin: string;
  model?: string;
  baseUrl?: string;
  apiKey?: string;
};

export type MindSettings = {
  default: MindBinding;
  voice: VoiceKind;
  pets: Record<string, MindBinding>;
};
