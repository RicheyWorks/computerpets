export const SECRET_QUERY_NAMES: ReadonlySet<string>;

export function isSecretQueryName(name: string): boolean;

/** Drop userinfo, a pasted key path, and a pasted `key` / `api_key` query from a URL. */
export function stripSecretQuery(url: URL): void;

/**
 * Same drop, on a base URL string the desk is about to store or post.
 * A URL with nothing to drop is returned as typed.
 * A non-URL loses `key=` / `api_key=` (and the same secret-name family) and is otherwise left as typed.
 */
export function scrubSecretQueryString(raw: string): string;

/**
 * True when a model field is a pasted secret, not a model id.
 * A normal model id (`gemini-2.5-flash`, `gpt-4o`, `claude-sonnet-4-5`, a slash path) is not.
 */
export function isSecretModel(raw: string): boolean;

/**
 * Drop a pasted secret in the model field.
 * A normal model id is returned trimmed.
 * A secret becomes `fallback`, or empty when the caller is about to store.
 */
export function scrubSecretModel(raw: string | null | undefined, fallback?: string | null): string;
