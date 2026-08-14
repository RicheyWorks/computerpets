import { livingByKey } from "@/lib/pets/living";
import { mindPreset } from "./catalog";
import { assertSafeMindUrl, mindTimeout, sanitizeModel } from "./safe-url";
import type { MindBinding, MindContext, MindReply } from "./types";

function userTurn(ctx: MindContext) {
  const bits = [
    `Your name is ${ctx.name}.`,
    `Hunger ${ctx.hunger}/100, mood ${ctx.mood}/100, energy ${ctx.energy}/100.`,
  ];
  if (ctx.hygiene != null) bits.push(`Hygiene ${ctx.hygiene}/100.`);
  if (ctx.message) bits.push(`The keeper says: ${ctx.message}`);
  else bits.push("The keeper is nearby. Say something small.");
  return bits.join(" ");
}

function clip(text: string) {
  return text.replace(/^["']|["']$/g, "").trim().slice(0, 220);
}

async function readJson(res: Response) {
  return (await res.json()) as Record<string, unknown>;
}

function endpoint(binding: MindBinding, presetId: string, suffix = "") {
  const preset = mindPreset(presetId);
  const base = assertSafeMindUrl(binding.baseUrl || preset.defaultBaseUrl, {
    presetId,
    kind: preset.kind,
  });
  return `${base}${suffix}`;
}

async function openaiCompat(ctx: MindContext, binding: MindBinding, presetId: string): Promise<MindReply> {
  const preset = mindPreset(presetId);
  const model = sanitizeModel(binding.model, preset.defaultModel || "gpt-4.1-mini");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (binding.apiKey) headers.Authorization = `Bearer ${binding.apiKey}`;
  if (presetId === "openrouter") {
    headers["HTTP-Referer"] = "https://computerpets.local";
    headers["X-Title"] = "ComputerPets";
  }
  const res = await fetch(endpoint(binding, presetId, "/chat/completions"), {
    method: "POST",
    headers,
    redirect: "error",
    signal: mindTimeout(),
    body: JSON.stringify({
      model,
      max_tokens: 80,
      temperature: 0.9,
      messages: [
        { role: "system", content: ctx.systemPrompt },
        { role: "user", content: userTurn(ctx) },
      ],
    }),
  });
  if (!res.ok) throw new Error(`${presetId} ${res.status}`);
  const body = await readJson(res);
  const choices = body.choices as { message?: { content?: string } }[] | undefined;
  const text = clip(choices?.[0]?.message?.content ?? "");
  if (!text) throw new Error("empty");
  return { text, source: presetId };
}

async function anthropic(ctx: MindContext, binding: MindBinding): Promise<MindReply> {
  const preset = mindPreset("anthropic");
  const res = await fetch(endpoint(binding, "anthropic", "/v1/messages"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": binding.apiKey || "",
      "anthropic-version": "2023-06-01",
    },
    redirect: "error",
    signal: mindTimeout(),
    body: JSON.stringify({
      model: sanitizeModel(binding.model, preset.defaultModel || "claude-sonnet-4-5"),
      max_tokens: 80,
      temperature: 0.9,
      system: ctx.systemPrompt,
      messages: [{ role: "user", content: userTurn(ctx) }],
    }),
  });
  if (!res.ok) throw new Error(`anthropic ${res.status}`);
  const body = await readJson(res);
  const content = body.content as { text?: string }[] | undefined;
  const text = clip(content?.[0]?.text ?? "");
  if (!text) throw new Error("empty");
  return { text, source: "anthropic" };
}

async function ollama(ctx: MindContext, binding: MindBinding): Promise<MindReply> {
  const preset = mindPreset("ollama");
  const res = await fetch(endpoint(binding, "ollama", "/api/chat"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    redirect: "error",
    signal: mindTimeout(),
    body: JSON.stringify({
      model: sanitizeModel(binding.model, preset.defaultModel || "llama3.2"),
      stream: false,
      messages: [
        { role: "system", content: ctx.systemPrompt },
        { role: "user", content: userTurn(ctx) },
      ],
    }),
  });
  if (!res.ok) throw new Error(`ollama ${res.status}`);
  const body = await readJson(res);
  const message = body.message as { content?: string } | undefined;
  const text = clip(message?.content ?? "");
  if (!text) throw new Error("empty");
  return { text, source: "ollama" };
}

async function gemini(ctx: MindContext, binding: MindBinding): Promise<MindReply> {
  const preset = mindPreset("google");
  const model = sanitizeModel(binding.model, preset.defaultModel || "gemini-2.5-flash");
  const base = endpoint(binding, "google");
  const url = `${base}/models/${model}:generateContent`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(binding.apiKey ? { "x-goog-api-key": binding.apiKey } : {}),
    },
    redirect: "error",
    signal: mindTimeout(),
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: ctx.systemPrompt }] },
      contents: [{ role: "user", parts: [{ text: userTurn(ctx) }] }],
      generationConfig: { maxOutputTokens: 80, temperature: 0.9 },
    }),
  });
  if (!res.ok) throw new Error(`gemini ${res.status}`);
  const body = await readJson(res);
  const candidates = body.candidates as { content?: { parts?: { text?: string }[] } }[] | undefined;
  const text = clip(candidates?.[0]?.content?.parts?.[0]?.text ?? "");
  if (!text) throw new Error("empty");
  return { text, source: "google" };
}

async function custom(ctx: MindContext, binding: MindBinding): Promise<MindReply> {
  const url = endpoint(binding, "custom");
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(binding.apiKey ? { Authorization: `Bearer ${binding.apiKey}` } : {}),
    },
    redirect: "error",
    signal: mindTimeout(),
    body: JSON.stringify({
      name: ctx.name,
      species: ctx.species,
      system: ctx.systemPrompt,
      user: userTurn(ctx),
      stats: { hunger: ctx.hunger, mood: ctx.mood, energy: ctx.energy, hygiene: ctx.hygiene },
      message: ctx.message ?? null,
    }),
  });
  if (!res.ok) throw new Error(`custom ${res.status}`);
  const body = await readJson(res);
  const text = clip(
    String(body.text ?? body.content ?? (body.message as { content?: string } | undefined)?.content ?? ""),
  );
  if (!text) throw new Error("empty");
  return { text, source: "custom" };
}

export function localMind(ctx: MindContext): MindReply {
  const kind = livingByKey(ctx.species);
  const stats = {
    hunger: ctx.hunger,
    mood: ctx.mood,
    energy: ctx.energy,
    hygiene: ctx.hygiene ?? 80,
    health: 90,
    bond: 40,
    sick: false,
    bornAt: Date.now(),
    lastTick: Date.now(),
  };
  return { text: kind.fallbackLine(ctx.message, stats), source: "local" };
}

export async function runMind(ctx: MindContext, binding: MindBinding): Promise<MindReply> {
  const preset = mindPreset(binding.plugin);
  if (preset.kind === "local") return localMind(ctx);
  try {
    if (preset.kind === "openai") return await openaiCompat(ctx, binding, preset.id);
    if (preset.kind === "anthropic") return await anthropic(ctx, binding);
    if (preset.kind === "ollama") return await ollama(ctx, binding);
    if (preset.kind === "gemini") return await gemini(ctx, binding);
    if (preset.kind === "custom") return await custom(ctx, binding);
  } catch {
    return localMind(ctx);
  }
  return localMind(ctx);
}
