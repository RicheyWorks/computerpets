import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { MIND_PRESETS, VOICE_PRESETS, mindPreset } from "@/lib/ai/catalog";
import { MIND_WORDS, presetTag } from "@/lib/ai/mind-words";
import { describeKeyKept, saveMindSettings } from "@/lib/ai/settings";
import { refreshMindSettings, useMindSettings } from "@/lib/ai/use-mind";
import { LIVING_KINDS } from "@/lib/pets/living";
import { converseWithPet } from "@/lib/pets/talk";
import { talkBody } from "@/lib/pets/talk-post";
import { talkHonesty } from "@/lib/pets/talk-net";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { mindProblem } from "@/lib/plain-error";
import type { MindBinding, MindSettings, VoiceKind } from "@/lib/ai/types";

export const Route = createFileRoute("/mind")({
  component: MindPage,
  head: () => ({
    meta: [
      { title: "Minds — ComputerPets" },
      { name: "description", content: "Pets talk without an AI. Pick one if you like, for the whole house or one animal." },
    ],
  }),
});

function MindPage() {
  const live = useMindSettings();
  const [draft, setDraft] = useState<MindSettings>(live);
  useEffect(() => {
    setDraft(live);
  }, [live]);
  const [petKey, setPetKey] = useState(LIVING_KINDS[0]!.key);
  const [testLine, setTestLine] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [talkAsked, setTalkAsked] = useState(false);
  const pendingTest = useRef(false);
  const [talkTick, setTalkTick] = useState(0);
  const { user, isPending } = useCurrentUserState();
  const signedIn = !isPending && user != null;
  const selected = mindPreset(draft.default.plugin);
  const petBind = draft.pets[petKey] ?? draft.default;
  const talkLine = signedIn ? talkHonesty(petBind) : "";

  const counts = useMemo(() => {
    const used = new Set<string>([draft.default.plugin, ...Object.values(draft.pets).map((b) => b.plugin)]);
    return used.size;
  }, [draft]);

  function write(next: MindSettings) {
    setDraft(next);
    void saveMindSettings(next).then(() => refreshMindSettings());
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

  function talkLineInView() {
    if (!talkLine) return true;
    const el = document.getElementById("mind-talk-net");
    return talkAsked && !!el && !el.hidden && (el.textContent || "").includes(talkLine);
  }

  async function runTest() {
    setBusy(true);
    setTestLine(null);
    try {
      const kind = LIVING_KINDS.find((k) => k.key === petKey) ?? LIVING_KINDS[0]!;
      const res = await converseWithPet({
        data: talkBody({
          message: "Hello. Who are you?",
          hunger: 70,
          mood: 72,
          energy: 68,
          name: kind.name,
          species: kind.key,
          speak: false,
          mind: petBind,
          voice: "none",
          ...(talkLine ? { talkLine } : {}),
        }),
      });
      setTestLine(`${res.source}: ${res.text}`);
    } catch (err) {
      // The plain reason (key, rate limit, address, timeout, refused…); the raw error goes to the console.
      setTestLine(mindProblem(err));
    } finally {
      setBusy(false);
    }
  }

  function test() {
    if (busy || pendingTest.current) return;
    if (talkLine) {
      setTalkAsked(true);
      if (!talkLineInView()) {
        pendingTest.current = true;
        setTalkTick((n) => n + 1);
        return;
      }
    }
    void runTest();
  }

  useEffect(() => {
    if (!pendingTest.current) return;
    if (!talkLineInView()) return;
    pendingTest.current = false;
    void runTest();
    // The line has to be painted before the test post. A load does not test.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [talkTick, talkAsked, talkLine]);

  return (
    <main className="space-y-10 pb-16 pt-20">
      <header className="max-w-2xl space-y-3">
        <p className="text-[11px] uppercase tracking-[0.2em] text-subtle">Talk</p>
        <h1 className="font-display text-5xl leading-none">Minds</h1>
        <p id="mind-intro" className="text-base">
          {MIND_WORDS.intro}
        </p>
        <p id="mind-how" className="text-base text-muted">
          Pick an AI below, or keep House lines. One animal can have its own AI too.
        </p>
        <p className="text-sm text-subtle">
          {counts} mind{counts === 1 ? "" : "s"} in use · {describeKeyKept(live.keyKept)}
        </p>
      </header>

      <h2 id="mind-which" className="font-display text-2xl">
        {MIND_WORDS.which}
      </h2>
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
              <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">{presetTag(preset)}</p>
              <p className="mt-1 font-display text-2xl">{preset.name}</p>
              <p className="mt-2 text-sm text-muted">{preset.blurb}</p>
            </button>
          );
        })}
      </section>

      <section className="grid gap-6 rounded-[var(--radius-xl)] border border-border bg-surface p-5 sm:p-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 id="mind-all-pets" className="font-display text-2xl">{MIND_WORDS.allPets}</h2>
          {selected.kind === "local" ? (
            // House lines: no AI, so no model, address, or key boxes.
            <p id="mind-house" className="text-sm text-muted">
              {MIND_WORDS.house}
            </p>
          ) : (
            <div id="mind-fields" className="space-y-4">
              <Field label={MIND_WORDS.model} hint={MIND_WORDS.modelHelp}>
                <input
                  value={draft.default.model ?? selected.defaultModel ?? ""}
                  onChange={(e) => setDefault({ model: e.target.value })}
                  placeholder={selected.defaultModel}
                  className="h-11 w-full rounded-[var(--radius-sm)] border border-border bg-elevated px-3 text-sm"
                />
              </Field>
              <Field label={MIND_WORDS.address} hint={MIND_WORDS.addressHelp}>
                <input
                  value={draft.default.baseUrl ?? selected.defaultBaseUrl ?? ""}
                  onChange={(e) => setDefault({ baseUrl: e.target.value })}
                  placeholder={selected.defaultBaseUrl}
                  className="h-11 w-full rounded-[var(--radius-sm)] border border-border bg-elevated px-3 text-sm"
                />
              </Field>
              {selected.needsKey ? (
                <>
                  <Field label={MIND_WORDS.key} hint={MIND_WORDS.keyHelp}>
                    <input
                      type="password"
                      autoComplete="off"
                      value={draft.default.apiKey ?? ""}
                      onChange={(e) => setDefault({ apiKey: e.target.value })}
                      placeholder={MIND_WORDS.keyPlaceholder}
                      className="h-11 w-full rounded-[var(--radius-sm)] border border-border bg-elevated px-3 text-sm"
                    />
                  </Field>
                  <p className="text-sm text-muted">{describeKeyKept(live.keyKept)}</p>
                </>
              ) : (
                <p className="text-sm text-muted">No key needed for this AI.</p>
              )}
            </div>
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
          <h2 className="font-display text-2xl">One animal</h2>
          <Field label="Animal">
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
          <Field label={MIND_WORDS.which}>
            <select
              value={draft.pets[petKey]?.plugin ?? "inherit"}
              onChange={(e) => {
                if (e.target.value === "inherit") setPet(null);
                else setPet({ plugin: e.target.value });
              }}
              className="h-11 w-full rounded-[var(--radius-sm)] border border-border bg-elevated px-3 text-sm"
            >
              <option value="inherit">{MIND_WORDS.sameAsAll} ({mindPreset(draft.default.plugin).name})</option>
              {MIND_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </Field>
          {draft.pets[petKey] ? (
            <Field label={MIND_WORDS.model} hint="Only for this animal. Empty uses what that AI picks.">
              <input
                value={petBind.model ?? ""}
                onChange={(e) => setPet({ model: e.target.value })}
                className="h-11 w-full rounded-[var(--radius-sm)] border border-border bg-elevated px-3 text-sm"
              />
            </Field>
          ) : (
            <p className="text-sm text-muted">{MIND_WORDS.sameAsAll}.</p>
          )}
          <div className="flex flex-wrap gap-2">
            <Button disabled={busy} onClick={() => test()}>
              Test this mind
            </Button>
            <p id="mind-talk-net" className="text-sm text-muted" hidden={!talkAsked || !talkLine}>
              {talkAsked ? talkLine : ""}
            </p>
            <Button asChild variant="secondary">
              <Link to="/" search={{ pet: petKey }}>
                Open desk
              </Link>
            </Button>
          </div>
          {testLine ? <p className="text-sm text-muted">{testLine}</p> : null}
        </div>
      </section>

      {/* Builder words (plugin bus, server key names, the webhook contract) stay here, folded away. docs/MIND.md has the rest. */}
      <details id="mind-builders" className="rounded-[var(--radius-xl)] border border-border bg-surface p-5 sm:p-6">
        <summary className="cursor-pointer font-display text-2xl">For builders</summary>
        <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-subtle">Plugin bus</p>
        <p className="mt-1 font-display text-xl">Any mind. Same house.</p>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Fourteen plugins. OpenAI-compatible, Claude, Gemini, Ollama, a custom webhook.
          Pick one AI under {MIND_WORDS.allPets}, or give one animal its own under One animal.
        </p>
        {selected.envKey ? (
          <p id="mind-env-key" className="mt-2 max-w-2xl text-sm text-muted">
            A signed-in keeper can leave the key box empty when the server has <code>{selected.envKey}</code> set.
          </p>
        ) : null}
        <h3 className="mt-6 font-display text-xl">Model ids</h3>
        <p className="mt-2 max-w-2xl text-sm text-muted">The model each AI starts with. The AI model name box can change it.</p>
        <ul id="mind-model-ids" className="mt-2 space-y-1 text-sm text-muted">
          {MIND_PRESETS.filter((p) => p.defaultModel).map((p) => (
            <li key={p.id}>
              {p.name}: <code className="font-mono text-xs">{p.defaultModel}</code>
            </li>
          ))}
        </ul>
        <h3 className="mt-6 font-display text-xl">Write a plugin</h3>
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
      </details>
    </main>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] uppercase tracking-[0.16em] text-subtle">{label}</span>
      {children}
      {hint ? <span className="block text-xs text-muted">{hint}</span> : null}
    </label>
  );
}
