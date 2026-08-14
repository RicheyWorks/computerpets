import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { ambientLine, listenLine, RED_PANDA_VOICE, SYSTEM_PROMPT } from "./red-panda";

const input = z.object({
  message: z.string().trim().max(200).optional(),
  hunger: z.number().min(0).max(100),
  mood: z.number().min(0).max(100),
  energy: z.number().min(0).max(100),
  name: z.string().trim().min(1).max(24).default("Rui"),
  speak: z.boolean().optional(),
});

export type TalkResult = {
  text: string;
  audio?: string;
  source: "local" | "grok";
};

function localFallback(message: string | undefined, stats: { hunger: number; mood: number; energy: number }) {
  if (!message) return ambientLine(stats);
  const q = message.toLowerCase();
  if (q.includes("name")) return "Rui. It fits in a mouth and on a collar.";
  if (q.includes("food") || q.includes("eat") || q.includes("hungry")) return "Something rust-colored and polite. I am not proud.";
  if (q.includes("sleep") || q.includes("tired")) return "The tail knows what to do.";
  if (q.includes("love") || q.includes("good")) return "I heard that. I will store it in the left ear.";
  return listenLine();
}

async function maybeSpeak(text: string): Promise<string | undefined> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) return undefined;
  try {
    const res = await fetch("https://api.x.ai/v1/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        text: text.slice(0, 220),
        voice_id: RED_PANDA_VOICE,
        language: "en",
      }),
    });
    if (!res.ok) return undefined;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.byteLength < 80) return undefined;
    return `data:audio/mpeg;base64,${buf.toString("base64")}`;
  } catch {
    return undefined;
  }
}

export const converseWithPet = createServerFn({ method: "POST" })
  .validator((raw: unknown) => input.parse(raw))
  .handler(async ({ data }): Promise<TalkResult> => {
    const stats = { hunger: data.hunger, mood: data.mood, energy: data.energy };
    const apiKey = process.env.XAI_API_KEY;
    let text = localFallback(data.message, stats);
    let source: TalkResult["source"] = "local";

    if (apiKey && data.message) {
      try {
        const res = await fetch("https://api.x.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "grok-4.5",
            max_tokens: 80,
            temperature: 0.9,
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              {
                role: "user",
                content: `Your name is ${data.name}. Hunger ${data.hunger}/100, mood ${data.mood}/100, energy ${data.energy}/100. The keeper says: ${data.message}`,
              },
            ],
          }),
        });
        if (res.ok) {
          const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
          const next = body.choices?.[0]?.message?.content?.trim();
          if (next) {
            text = next.replace(/^["']|["']$/g, "").slice(0, 220);
            source = "grok";
          }
        }
      } catch {
        // keep local line
      }
    }

    const audio = data.speak === false ? undefined : await maybeSpeak(text);
    return { text, audio, source };
  });
