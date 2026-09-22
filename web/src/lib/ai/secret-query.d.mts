export const SECRET_QUERY_NAMES: ReadonlySet<string>;

export function isSecretQueryName(name: string): boolean;

/** Drop a pasted `key` / `api_key` (and the same kind of secret) from a URL. */
export function stripSecretQuery(url: URL): void;

/**
 * Same drop, on a base URL string the desk is about to post.
 * A URL with no secret query is returned as typed. A string that is not a URL is left as typed.
 */
export function scrubSecretQueryString(raw: string): string;
