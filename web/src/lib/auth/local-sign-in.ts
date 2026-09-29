/**
 * Sign-in on this computer's own copy of the site.
 *
 * With no per-site sign-in client injected (a deployed site gets one), the server falls back to the shared preview
 * client, and that client only accepts callbacks on the hosted preview (`*.grok-sandbox.com`, see `./preview`). On
 * `localhost` the Google / X button left for the hosted sign-in page and never came back signed in. The login page
 * says so there instead of offering a button that cannot finish. A deployed site and the hosted preview are not
 * loopback hosts, so they keep the buttons exactly as before.
 */

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
