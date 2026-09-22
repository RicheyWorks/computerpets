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
