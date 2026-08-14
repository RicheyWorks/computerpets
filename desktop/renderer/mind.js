(function () {
  const KEY = "computerpets.mind.v1";
  const PRESETS = [
    { id: "local", name: "House lines", kind: "local" },
    { id: "xai", name: "xAI Grok", kind: "openai", base: "https://api.x.ai/v1", model: "grok-4.5" },
    { id: "openai", name: "OpenAI", kind: "openai", base: "https://api.openai.com/v1", model: "gpt-4.1-mini" },
    { id: "anthropic", name: "Anthropic", kind: "anthropic", base: "https://api.anthropic.com", model: "claude-sonnet-4-5" },
    { id: "google", name: "Google Gemini", kind: "gemini", base: "https://generativelanguage.googleapis.com/v1beta", model: "gemini-2.5-flash" },
    { id: "groq", name: "Groq", kind: "openai", base: "https://api.groq.com/openai/v1", model: "llama-3.3-70b-versatile" },
    { id: "openrouter", name: "OpenRouter", kind: "openai", base: "https://openrouter.ai/api/v1", model: "x-ai/grok-4.5" },
    { id: "together", name: "Together", kind: "openai", base: "https://api.together.xyz/v1", model: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo" },
    { id: "fireworks", name: "Fireworks", kind: "openai", base: "https://api.fireworks.ai/inference/v1", model: "accounts/fireworks/models/llama-v3p1-70b-instruct" },
    { id: "deepseek", name: "DeepSeek", kind: "openai", base: "https://api.deepseek.com/v1", model: "deepseek-chat" },
    { id: "mistral", name: "Mistral", kind: "openai", base: "https://api.mistral.ai/v1", model: "mistral-small-latest" },
    { id: "ollama", name: "Ollama", kind: "ollama", base: "http://127.0.0.1:11434", model: "llama3.2" },
    { id: "lmstudio", name: "LM Studio", kind: "openai", base: "http://127.0.0.1:1234/v1", model: "local-model" },
    { id: "custom", name: "Custom webhook", kind: "custom", base: "http://127.0.0.1:8787/mind", model: "default" },
  ];

  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || "null");
      return raw || { default: { plugin: "local" }, voice: "browser", pets: {} };
    } catch {
      return { default: { plugin: "local" }, voice: "browser", pets: {} };
    }
  }

  function save(next) {
    localStorage.setItem(KEY, JSON.stringify(next));
  }

  function preset(id) {
    return PRESETS.find((p) => p.id === id) || PRESETS[0];
  }

  function binding(species) {
    const s = load();
    return s.pets?.[species] || s.default || { plugin: "local" };
  }

  function clip(t) {
    return String(t || "")
      .replace(/^["']|["']$/g, "")
      .trim()
      .slice(0, 220);
  }

  function userTurn(ctx) {
    return `Your name is ${ctx.name}. Hunger ${ctx.hunger}/100, mood ${ctx.mood}/100, energy ${ctx.energy}/100. ${
      ctx.message ? `The keeper says: ${ctx.message}` : "The keeper is nearby. Say something small."
    }`;
  }

  async function run(ctx) {
    const bind = binding(ctx.species);
    const p = preset(bind.plugin);
    const base = (bind.baseUrl || p.base || "").replace(/\/$/, "");
    const model = bind.model || p.model;
    const key = bind.apiKey || "";
    if (p.kind === "local") return { text: ctx.fallback, source: "local" };
    try {
      if (p.kind === "openai") {
        const res = await fetch(`${base}/chat/completions`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...(key ? { Authorization: `Bearer ${key}` } : {}) },
          body: JSON.stringify({
            model,
            max_tokens: 80,
            temperature: 0.9,
            messages: [
              { role: "system", content: ctx.system },
              { role: "user", content: userTurn(ctx) },
            ],
          }),
        });
        const body = await res.json();
        const text = clip(body.choices?.[0]?.message?.content);
        if (text) return { text, source: p.id };
      } else if (p.kind === "anthropic") {
        const res = await fetch(`${base}/v1/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": key,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model,
            max_tokens: 80,
            system: ctx.system,
            messages: [{ role: "user", content: userTurn(ctx) }],
          }),
        });
        const body = await res.json();
        const text = clip(body.content?.[0]?.text);
        if (text) return { text, source: p.id };
      } else if (p.kind === "ollama") {
        const res = await fetch(`${base}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model,
            stream: false,
            messages: [
              { role: "system", content: ctx.system },
              { role: "user", content: userTurn(ctx) },
            ],
          }),
        });
        const body = await res.json();
        const text = clip(body.message?.content);
        if (text) return { text, source: p.id };
      } else if (p.kind === "gemini") {
        const res = await fetch(`${base}/models/${model}:generateContent?key=${encodeURIComponent(key)}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: ctx.system }] },
            contents: [{ role: "user", parts: [{ text: userTurn(ctx) }] }],
            generationConfig: { maxOutputTokens: 80, temperature: 0.9 },
          }),
        });
        const body = await res.json();
        const text = clip(body.candidates?.[0]?.content?.parts?.[0]?.text);
        if (text) return { text, source: p.id };
      } else if (p.kind === "custom") {
        const res = await fetch(base, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...(key ? { Authorization: `Bearer ${key}` } : {}) },
          body: JSON.stringify({
            name: ctx.name,
            species: ctx.species,
            system: ctx.system,
            user: userTurn(ctx),
            stats: { hunger: ctx.hunger, mood: ctx.mood, energy: ctx.energy },
            message: ctx.message ?? null,
          }),
        });
        const body = await res.json();
        const text = clip(body.text || body.content);
        if (text) return { text, source: "custom" };
      }
    } catch {
      /* house lines */
    }
    return { text: ctx.fallback, source: "local" };
  }

  window.PetMind = { PRESETS, load, save, preset, binding, run };
})();
