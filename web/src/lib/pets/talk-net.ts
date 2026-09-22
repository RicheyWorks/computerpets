/** Cloud talk and cloud voice name the host before the request leaves. `readTalk` and `readVoice` refuse a remote request when that painted host line is missing. A remote leave gives up after twelve seconds. A loopback mind and on-device speech stay local. Same sentence as News and Radio (`clientNetLine`). Overlay connect-src names these hosts. ADR 0048. ADR 0052. */
import { mindPreset } from "../ai/catalog.ts";
import { assertSafeMindUrl } from "../ai/safe-url.ts";
import type { MindBinding, VoiceKind } from "../ai/types.ts";
import { clientNetLine } from "./weather-areas.ts";

export const TALK_HOST_NAME = "the talk host";
export const VOICE_HOST_NAME = "the voice host";

/** Hosts the cloud voice calls. Path stays off the line. */
export const VOICE_URLS: Record<"xai" | "openai", string> = {
  xai: "https://api.x.ai/v1/tts",
  openai: "https://api.openai.com/v1/audio/speech",
};

const LOOPBACK = new Set(["127.0.0.1", "localhost", "::1"]);

export function talkHostName(raw: string): string {
  try {
    return new URL(raw).hostname.replace(/^\[|\]$/g, "") || "";
  } catch {
    return "";
  }
}

function isLoopback(host: string) {
  return LOOPBACK.has(host.toLowerCase());
}

/**
 * The base the house will actually call. Empty when the plugin is local or the URL is refused.
 * A loopback base is returned and marked local by `talkTarget`.
 */
export function resolvedTalkBase(binding: Pick<MindBinding, "plugin" | "baseUrl"> | null | undefined): string {
  const plugin = binding?.plugin?.trim() || "local";
  const preset = mindPreset(plugin);
  if (preset.kind === "local") return "";
  const raw = (binding?.baseUrl || preset.defaultBaseUrl || "").trim();
  if (!raw) return "";
  try {
    return assertSafeMindUrl(raw, { presetId: preset.id, kind: preset.kind });
  } catch {
    return "";
  }
}

export function talkTarget(
  binding: Pick<MindBinding, "plugin" | "baseUrl"> | null | undefined,
): { local: boolean; label: string } | null {
  const base = resolvedTalkBase(binding);
  if (!base) return null;
  const host = talkHostName(base);
  return { local: isLoopback(host), label: host || TALK_HOST_NAME };
}

/** Empty when this talk does not leave the computer. */
export function talkHonesty(binding: Pick<MindBinding, "plugin" | "baseUrl"> | null | undefined): string {
  const target = talkTarget(binding);
  if (!target || target.local) return "";
  return `this talk sends the keeper line. ${clientNetLine(target.label)}`;
}

/**
 * A remote talk leaves only when that line is in view.
 * Local, loopback, and a URL the house will not call do not need the line.
 */
export function talkMaySend(
  binding: Pick<MindBinding, "plugin" | "baseUrl"> | null | undefined,
  lineInView: boolean,
): boolean {
  const target = talkTarget(binding);
  if (!target || target.local) return true;
  const line = talkHonesty(binding);
  if (!line || lineInView !== true) return false;
  return line.includes(clientNetLine(target.label));
}

/** Empty for browser speech, silence, and anything that is not a cloud voice. */
export function voiceHonesty(voice: VoiceKind | string | null | undefined): string {
  if (voice !== "xai" && voice !== "openai") return "";
  const host = talkHostName(VOICE_URLS[voice]) || VOICE_HOST_NAME;
  return `this voice sends the spoken line. ${clientNetLine(host)}`;
}

export function voiceMaySend(voice: VoiceKind | string | null | undefined, lineInView: boolean): boolean {
  const line = voiceHonesty(voice);
  if (!line) return true;
  if (lineInView !== true) return false;
  const host =
    voice === "xai" || voice === "openai" ? talkHostName(VOICE_URLS[voice]) || VOICE_HOST_NAME : VOICE_HOST_NAME;
  return line.includes(clientNetLine(host));
}

/**
 * A remote talk leaves only when the painted line names that talk host.
 * A local or loopback mind does not need the line. Another host's line does not count.
 */
export function talkMayLeave(
  shown: unknown,
  binding: Pick<MindBinding, "plugin" | "baseUrl"> | null | undefined,
): boolean {
  const target = talkTarget(binding);
  if (!target || target.local) return true;
  const line = talkHonesty(binding);
  if (!line || typeof shown !== "string") return false;
  return shown.includes(line);
}

/** Twelve seconds covers headers and the body. Matches weather, news, quote, and radio page wrappers. */
export const TALK_TIMEOUT_MS = 12_000;
export const VOICE_TIMEOUT_MS = 12_000;

/** A silent talk host. Callers keep the house line. */
export class TalkTimeout extends Error {
  constructor() {
    super("talk request timed out");
    this.name = "TalkTimeout";
  }
}

/** A silent voice host. Callers keep silence — no invented audio. */
export class VoiceTimeout extends Error {
  constructor() {
    super("voice request timed out");
    this.name = "VoiceTimeout";
  }
}

function isAbortTimeout(err: unknown, name: string): boolean {
  if (!err || typeof err !== "object") return false;
  const errName = (err as { name?: string }).name;
  const code = (err as { code?: string }).code;
  return errName === name || errName === "AbortError" || errName === "TimeoutError" || code === "ABORT_ERR";
}

export function isTalkTimeout(err: unknown): boolean {
  return isAbortTimeout(err, "TalkTimeout");
}

export function isVoiceTimeout(err: unknown): boolean {
  return isAbortTimeout(err, "VoiceTimeout");
}

type TalkRequest<T> = (signal?: AbortSignal) => Promise<T> | T;
type VoiceRequest<T> = (signal?: AbortSignal) => Promise<T | undefined> | T | undefined;

/**
 * One remote talk or voice leave. The timer covers headers and the body.
 * A timeout rejects with the named error. The caller does not get a body.
 * A late body after the deadline is not parsed.
 */
function readRemote<T>(
  request: TalkRequest<T>,
  Timeout: new () => Error,
  timeoutName: string,
  timeoutMs: number,
): Promise<T> {
  if (typeof request !== "function") return Promise.reject(new Timeout());

  const ctrl = new AbortController();
  let settled = false;
  let timer: ReturnType<typeof setTimeout> | undefined;

  return new Promise((resolve, reject) => {
    timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      ctrl.abort();
      reject(new Timeout());
    }, timeoutMs);

    Promise.resolve()
      .then(() => request(ctrl.signal))
      .then((value) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve(value);
      })
      .catch((err) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        if (isAbortTimeout(err, timeoutName)) reject(new Timeout());
        else reject(err);
      });
  });
}

/**
 * The only cloud-talk request. A miss resolves to the local reply and does not call `request`.
 * A loopback mind still calls `request` with no remote deadline. That fetch stays on this computer.
 * A remote hang rejects with TalkTimeout. The caller keeps the house line and does not parse a late body.
 */
export function readTalk<T>(
  shown: unknown,
  binding: Pick<MindBinding, "plugin" | "baseUrl"> | null | undefined,
  request: TalkRequest<T>,
  local: T,
  timeoutMs: number = TALK_TIMEOUT_MS,
): Promise<T> {
  if (!talkMayLeave(shown, binding)) return Promise.resolve(local);
  const target = talkTarget(binding);
  if (!target || target.local) return Promise.resolve().then(() => request());
  return readRemote(request, TalkTimeout, "TalkTimeout", timeoutMs);
}

/**
 * A cloud voice leaves only when the painted line names that voice host.
 * Browser speech, silence, and the talk sentence do not count as a voice send.
 */
export function voiceMayLeave(shown: unknown, voice: VoiceKind | string | null | undefined): boolean {
  const line = voiceHonesty(voice);
  if (!line) return true;
  if (typeof shown !== "string") return false;
  return shown.includes(line);
}

/**
 * The only cloud-voice request. A miss resolves to undefined and does not call `request`.
 * Browser speech and silence do not call `request`. `speechSynthesis` stays on this computer.
 * A remote hang rejects with VoiceTimeout. The caller keeps silence and does not parse a late body.
 */
export function readVoice<T>(
  shown: unknown,
  voice: VoiceKind | string | null | undefined,
  request: VoiceRequest<T>,
  timeoutMs: number = VOICE_TIMEOUT_MS,
): Promise<T | undefined> {
  if (voice !== "xai" && voice !== "openai") return Promise.resolve(undefined);
  if (!voiceMayLeave(shown, voice)) return Promise.resolve(undefined);
  return readRemote(request, VoiceTimeout, "VoiceTimeout", timeoutMs);
}
