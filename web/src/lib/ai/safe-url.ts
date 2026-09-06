import type { MindKind } from "./types";

const LOCAL_HOSTS = new Set(["127.0.0.1", "localhost", "::1"]);

function isPrivateIpv4(host: string) {
  const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(host);
  if (!m) return false;
  const [a, b] = [Number(m[1]), Number(m[2])];
  if (a === 10 || a === 0 || a === 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  return false;
}

function isPrivateHost(host: string) {
  const h = host.toLowerCase().replace(/^\[|\]$/g, "");
  if (LOCAL_HOSTS.has(h)) return true;
  if (h.endsWith(".local") || h.endsWith(".internal")) return true;
  if (h.includes("metadata")) return true;
  if (h.startsWith("fc") || h.startsWith("fd") || h.startsWith("fe80")) return true;
  return isPrivateIpv4(h);
}

export function sanitizeModel(raw: string | undefined, fallback: string) {
  const value = (raw || fallback).trim();
  if (value.includes("..") || value.includes("\\")) return fallback;
  if (!/^[a-zA-Z0-9._:/-]{1,80}$/.test(value)) return fallback;
  return value;
}

export function allowLocalEndpoint(presetId: string, kind: MindKind) {
  return presetId === "ollama" || presetId === "lmstudio" || kind === "custom";
}

export function assertSafeMindUrl(raw: string | undefined, opts: { presetId: string; kind: MindKind }) {
  if (!raw?.trim()) throw new Error("missing url");
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    throw new Error("bad url");
  }
  if (url.username || url.password) throw new Error("userinfo");
  if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("protocol");
  const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  const local = LOCAL_HOSTS.has(host);
  if (local) {
    if (!allowLocalEndpoint(opts.presetId, opts.kind)) throw new Error("localhost blocked");
    return url.toString().replace(/\/$/, "");
  }
  if (url.protocol !== "https:") throw new Error("https only");
  if (isPrivateHost(host)) throw new Error("private host");
  return url.toString().replace(/\/$/, "");
}

export function mindTimeout() {
  return AbortSignal.timeout(8_000);
}
