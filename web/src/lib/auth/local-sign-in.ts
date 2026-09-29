/**
 * Sign-in on this computer's own copy of the site.
 *
 * With no per-site sign-in client injected (a deployed site gets one), the server falls back to the shared preview
 * client, and that client only accepts callbacks on the hosted preview (`*.grok-sandbox.com`, see `./preview`). On
 * `localhost` the Google / X button left for the hosted sign-in page and never came back signed in. The login page
 * says so there instead of offering a button that cannot finish. A deployed site and the hosted preview are not
 * loopback hosts, so they keep the buttons exactly as before. A copy on this computer that has its own sign-in
 * client (GROK_AUTH_CLIENT_ID and GROK_AUTH_CLIENT_SECRET, set up to call back to this address) can finish, so it
 * keeps the buttons too: the note depends on the host AND on which client the server signs in with.
 */

/** The shared preview client's id (lib/auth/preview.ts PREVIEW_CLIENT_ID; a test keeps the two equal). */
export const PREVIEW_CLIENT_NAME = "grok_preview";

/**
 * True when the server signs in with a client of its own, not the shared preview client: both GROK_AUTH_CLIENT_ID
 * and GROK_AUTH_CLIENT_SECRET are set (blank counts as unset, as in lib/auth/server.ts) and the id is not the
 * preview client's. Server-side only (it reads the server's environment); the login page asks through a server
 * function.
 */
export function hasOwnSignInClient(env: Record<string, string | undefined>): boolean {
  const id = env.GROK_AUTH_CLIENT_ID?.trim();
  const secret = env.GROK_AUTH_CLIENT_SECRET?.trim();
  return Boolean(id && secret && id !== PREVIEW_CLIENT_NAME);
}

/** The login page shows the local note (not the buttons) only where the hosted sign-in cannot come back. */
export function localSignInBlocked(hostname: string | null | undefined, ownClient: boolean): boolean {
  return isLoopbackHost(hostname) && !ownClient;
}

/** True for this computer's own addresses: localhost (and *.localhost), 127.x.x.x, and ::1. */
export function isLoopbackHost(hostname: string | null | undefined): boolean {
  const h = String(hostname ?? "").trim().toLowerCase().replace(/^\[|\]$/g, "");
  if (!h) return false;
  if (h === "localhost" || h.endsWith(".localhost")) return true;
  if (h === "::1") return true;
  return /^127(\.\d{1,3}){3}$/.test(h);
}

/** What the login page says on this computer's own copy, in place of the sign-in buttons. */
export const LOCAL_SIGN_IN_WORDS =
  "Sign-in with Google or X does not finish on this computer's own copy of the site (localhost). It works on the hosted site. The desk, the catalog and the demo rooms work without an account.";

/** How to try the kennel and the hatchery here anyway (web/README.md says the same). */
export const LOCAL_SIGN_IN_TRY =
  "To try the kennel and the hatchery here, put VITE_AUTH_ENABLED=false in a file named web/.env and start npm run dev again.";
