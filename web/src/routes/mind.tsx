import { useMemo, useState, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { MIND_PRESETS, VOICE_PRESETS, mindPreset } from "@/lib/ai/catalog";
import { describeBinding, loadMindSettings, saveMindSettings } from "@/lib/ai/settings";
import { refreshMindSettings, useMindSettings } from "@/lib/ai/use-mind";
import { LIVING_KINDS } from "@/lib/pets/living";
import { converseWithPet } from "@/lib/pets/talk";
import type { MindBinding, MindSettings, VoiceKind } from "@/lib/ai/types";

export const Route = createFileRoute("/mind")({
  component: MindPage,
  head: () => ({
    meta: [
      { title: "Minds — ComputerPets" },
      { name: "description", content: "Plug any AI into the house. One contract, fourteen plugins." },
    ],
  }),
});

function MindPage() {
  const live = useMindSettings();
  const [draft, setDraft] = useState<MindSettings>(live);
  const [petKey, setPetKey] = useState(LIVING_KINDS[0]!.key);
  const [testLine, setTestLine] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const selected = mindPreset(draft.default.plugin);
  const petBind = draft.pets[petKey] ?? draft.default;

  const counts = useMemo(() => {
    const used = new Set<string>([draft.default.plugin, ...Object.values(draft.pets).map((b) => b.plugin)]);
    return used.size;
  }, [draft]);

  function write(next: MindSettings) {
    setDraft(next);
    saveMindSettings(next);
    refreshMindSettings();
  }

  function setDefault(patch: Partial<MindBinding>) {
    const plugin = patch.plugin ?? draft.default.plugin;
    const preset = mindPreset(plugin);
    write({
      ...draft,
      default: {
        ...draft.default,
        ...patch,
        plugin,
        model: patch.model ?? (patch.plugin ? preset.defaultModel : draft.default.model),
        baseUrl: patch.baseUrl ?? (patch.plugin ? preset.defaultBaseUrl : draft.default.baseUrl),
      },
    });
  }

  function setPet(patch: Partial<MindBinding> | null) {
    const pets = { ...draft.pets };
    if (patch === null) {
      delete pets[petKey];
    } else {
      const base = pets[petKey] ?? { ...draft.default };
      const plugin = patch.plugin ?? base.plugin;
      const preset = mindPreset(plugin);
      pets[petKey] = {
        ...base,
        ...patch,
        plugin,
        model: patch.model ?? (patch.plugin ? preset.defaultModel : base.model),
        baseUrl: patch.baseUrl ?? (patch.plugin ? preset.defaultBaseUrl : base.baseUrl),
      };
    }
    write({ ...draft, pets });
  }

  async function test() {
    setBusy(true);
    setTestLine(null);
    try {
      const kind = LIVING_KINDS.find((k) => k.key === petKey) ?? LIVING_KINDS[0]!;
      const res = await converseWithPet({
        data: {
          message: "Hello. Who are you?",
          hunger: 70,
          mood: 72,
          energy: 68,
          name: kind.name,
          species: kind.key,
          speak: false,
          mind: petBind,
          voice: "none",
        },
      });
      setTestLine(`${res.source}: ${res.text}`);
    } catch {
      setTestLine("The mind did not answer. House lines will.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="space-y-10 pb-16 pt-20">
      <header className="max-w-2xl space-y-3">
        <p className="text-[11px] uppercase tracking-[0.2em] text-subtle">Plugin bus</p>
        <h1 className="font-display text-5xl leading-none">Any mind. Same house.</h1>
        <p className="text-base text-muted">
          Fourteen plugins. OpenAI-compatible, Claude, Gemini, Ollama, a custom webhook.
          Assign a house default or give each animal their own brain.
        </p>
        <p className="text-sm text-subtle">{counts} mind{counts === 1 ? "" : "s"} in use · keys stay in this browser</p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {MIND_PRESETS.map((preset) => {
          const active = draft.default.plugin === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => setDefault({ plugin: preset.id })}
              className={
                active
                  ? "rounded-[var(--radius-lg)] border border-border-strong bg-elevated p-4 text-left"
                  : "rounded-[var(--radius-lg)] border border-border bg-surface p-4 text-left hover:border-border-strong"
              }
            >
              <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">{preset.kind}</p>
              <p className="mt-1 font-display text-2xl">{preset.name}</p>
              <p className="mt-2 text-sm text-muted">{preset.blurb}</p>
              {preset.defaultModel ? (
                <p className="mt-3 font-mono text-xs text-subtle">{preset.defaultModel}</p>
              ) : null}
            </button>
          );
        })}
      </section>

      <section className="grid gap-6 rounded-[var(--radius-xl)] border border-border bg-surface p-5 sm:p-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="font-display text-2xl">House default</h2>
          <Field label="Model">
            <input
              value={draft.default.model ?? selected.defaultModel ?? ""}
              onChange={(e) => setDefault({ model: e.target.value })}
              placeholder={selected.defaultModel}
              className="h-11 w-full rounded-[var(--radius-sm)] border border-border bg-elevated px-3 text-sm"
            />
          </Field>
          <Field label="Base URL">
            <input
              value={draft.default.baseUrl ?? selected.defaultBaseUrl ?? ""}
              onChange={(e) => setDefault({ baseUrl: e.target.value })}
              placeholder={selected.defaultBaseUrl}
              className="h-11 w-full rounded-[var(--radius-sm)] border border-border bg-elevated px-3 text-sm"
            />
          </Field>
          {selected.needsKey ? (
            <Field label="API key">
              <input
                type="password"
                autoComplete="off"
                value={draft.default.apiKey ?? ""}
                onChange={(e) => setDefault({ apiKey: e.target.value })}
                placeholder={selected.envKey ? `or ${selected.envKey} on the server` : "optional"}
                className="h-11 w-full rounded-[var(--radius-sm)] border border-border bg-elevated px-3 text-sm"
              />
            </Field>
          ) : (
            <p className="text-sm text-muted">No key. This mind lives here.</p>
          )}
          <div>
            <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-subtle">Voice</p>
            <div className="flex flex-wrap gap-2">
              {VOICE_PRESETS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => write({ ...draft, voice: v.id as VoiceKind })}
                  className={
                    draft.voice === v.id
                      ? "rounded-[var(--radius-sm)] bg-elevated px-3 py-2 text-sm"
                      : "rounded-[var(--radius-sm)] px-3 py-2 text-sm text-muted hover:text-fg"
                  }
                >
                  {v.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="font-display text-2xl">Per animal</h2>
          <Field label="Companion">
            <select
              value={petKey}
              onChange={(e) => setPetKey(e.target.value)}
              className="h-11 w-full rounded-[var(--radius-sm)] border border-border bg-elevated px-3 text-sm"
            >
              {LIVING_KINDS.map((k) => (
                <option key={k.key} value={k.key}>
                  {k.name} — {k.speciesLabel}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Mind">
            <select
              value={draft.pets[petKey]?.plugin ?? "inherit"}
              onChange={(e) => {
                if (e.target.value === "inherit") setPet(null);
                else setPet({ plugin: e.target.value });
              }}
              className="h-11 w-full rounded-[var(--radius-sm)] border border-border bg-elevated px-3 text-sm"
            >
              <option value="inherit">House default ({describeBinding(draft.default)})</option>
              {MIND_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </Field>
          {draft.pets[petKey] ? (
            <Field label="Model override">
              <input
                value={petBind.model ?? ""}
                onChange={(e) => setPet({ model: e.target.value })}
                className="h-11 w-full rounded-[var(--radius-sm)] border border-border bg-elevated px-3 text-sm"
              />
            </Field>
          ) : (
            <p className="text-sm text-muted">Using the house default.</p>
          )}
          <div className="flex flex-wrap gap-2">
            <Button disabled={busy} onClick={() => void test()}>
              Test this mind
            </Button>
            <Button asChild variant="secondary">
              <Link to="/" search={{ pet: petKey }}>
                Open desk
              </Link>
            </Button>
          </div>
          {testLine ? <p className="text-sm text-muted">{testLine}</p> : null}
        </div>
      </section>

      <section className="rounded-[var(--radius-xl)] border border-border bg-surface p-5 sm:p-6">
        <h2 className="font-display text-2xl">Write a plugin</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Point Custom webhook at any URL. We POST JSON. Reply with <code>{"{ text }"}</code>.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-[var(--radius-md)] bg-elevated p-4 font-mono text-xs text-muted">{`POST /mind
{
  "name": "Rui",
  "species": "red_panda",
  "system": "...",
  "user": "The keeper says: hello",
  "stats": { "hunger": 70, "mood": 72, "energy": 68 },
  "message": "hello"
}

{ "text": "You came back. The desk was almost lonely." }`}</pre>
      </section>
    </main>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] uppercase tracking-[0.16em] text-subtle">{label}</span>
      {children}
    </label>
  );
}
