import type { VoiceKind } from "./types";

export async function speakWithPlugin(
  text: string,
  voice: VoiceKind,
  petVoice: string,
  apiKey?: string,
): Promise<string | undefined> {
  if (voice === "none" || voice === "browser") return undefined;
  if (voice === "xai") {
    if (!apiKey) return undefined;
    const res = await fetch("https://api.x.ai/v1/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ text: text.slice(0, 220), voice_id: petVoice, language: "en" }),
    });
    if (!res.ok) return undefined;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.byteLength < 80) return undefined;
    return `data:audio/mpeg;base64,${buf.toString("base64")}`;
  }
  if (voice === "openai") {
    if (!apiKey) return undefined;
    const res = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini-tts",
        voice: petVoice === "leo" ? "ash" : petVoice === "ara" ? "coral" : "verse",
        input: text.slice(0, 220),
      }),
    });
    if (!res.ok) return undefined;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.byteLength < 80) return undefined;
    return `data:audio/mpeg;base64,${buf.toString("base64")}`;
  }
  return undefined;
}
