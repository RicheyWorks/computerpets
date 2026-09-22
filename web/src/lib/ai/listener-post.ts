import { z } from "zod";
import { scrubSecretQueryString } from "./secret-query.mjs";

/**
 * What the listener read may post to the house.
 * Plugin id and base URL. The plugin key is not a field.
 * A pasted secret query on the base URL is dropped before the post.
 */
function scrubPostedBase(raw: unknown): unknown {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return raw;
  const copy = { ...(raw as Record<string, unknown>) };
  if (typeof copy.baseUrl === "string") copy.baseUrl = scrubSecretQueryString(copy.baseUrl);
  return copy;
}

export const listenerReadSchema = z.preprocess(
  scrubPostedBase,
  z
    .object({
      plugin: z.string().trim().max(32).optional(),
      baseUrl: z.string().trim().max(240).optional(),
    })
    .strict(),
);

export function parseListenerRead(raw: unknown) {
  return listenerReadSchema.parse(raw ?? {});
}

/**
 * JSON body for the listener read. There is no query string on the post.
 * `apiKey` is not copied. A pasted secret query on the base URL is dropped first.
 */
export function listenerReadBody(input: { plugin?: string | null; baseUrl?: string | null } | null | undefined): {
  plugin?: string;
  baseUrl?: string;
} {
  const body: { plugin?: string; baseUrl?: string } = {};
  const plugin = typeof input?.plugin === "string" ? input.plugin.trim() : "";
  if (plugin) body.plugin = plugin;
  if (typeof input?.baseUrl === "string" && input.baseUrl.trim()) {
    const scrubbed = scrubSecretQueryString(input.baseUrl);
    if (scrubbed) body.baseUrl = scrubbed;
  }
  return body;
}
