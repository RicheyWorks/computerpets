import { useState, type ReactNode } from "react";
import { Navigate, useRouterState } from "@tanstack/react-router";
import { authEnabled, signOut } from "./client";
import { RETURN_FALLBACK, safeReturnTo } from "./return-to";
import { useCurrentUser, useCurrentUserState } from "./use-current-user";

/**
 * Auth state components — plain wrappers around `useCurrentUserState()`.
 *
 * Auth is ON by default (including the sandbox live preview, which does real
 * sign-in). Visitors are signed out until they authenticate. The shared dev
 * user only appears when auth is explicitly disabled (`VITE_AUTH_ENABLED=false`).
 * While the session is still resolving, gates that care about signed-out state
 * render nothing so there's no signed-out flash on hard reload.
 */

/** Where `RedirectToSignIn` sends signed-out visitors. Create this route. */
export const SIGN_IN_PATH = "/login";

/** Render children only when a user is present (real session, or the disabled-auth dev user). */
export function SignedIn({ children }: { children: ReactNode }) {
  const { user } = useCurrentUserState();
  return user ? <>{children}</> : null;
}

/**
 * Render children only once we KNOW the visitor is signed out (`isPending` has
 * cleared and there is no user). Hidden while the session is still loading.
 */
export function SignedOut({ children }: { children: ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  if (isPending || user) return null;
  return <>{children}</>;
}

/**
 * Client-side redirect to the sign-in route (TanStack `<Navigate>` — NOT a full
 * `window.location` reload). A hard navigation re-bootstraps the SPA and re-runs
 * session loading, which feels like a second "Loading…" on /login.
 *
 * Guard routes by waiting out `isPending` first (see `use-current-user`), then
 * render this.
 */
export function RedirectToSignIn({ to = SIGN_IN_PATH }: { to?: string }) {
  // Remember the page that asked for sign-in (a safe same-site path only), so sign-in returns there.
  const here = useRouterState({ select: (s) => `${s.location.pathname}${s.location.searchStr ?? ""}` });
  // Read once: this stays mounted for a moment after the move, and on /login itself `here` would say "back to /login"
  // (refused, so the desk), and a second Navigate without `next` wiped the page it had remembered.
  const [next] = useState(() => safeReturnTo(here));
  if (to !== SIGN_IN_PATH || next === RETURN_FALLBACK) return <Navigate to={to} />;
  return <Navigate to={SIGN_IN_PATH} search={{ next }} />;
}

/**
 * Minimal signed-in identity chip + sign-out. Restyle freely (see the
 * `design-ui` skill). Sign-out is only shown when auth is enabled (the
 * disabled-auth dev user has nothing to sign out of).
 */
export function UserButton() {
  const user = useCurrentUser();
  if (!user) return null;
  const label = user.displayName ?? user.primaryEmail ?? "Account";
  return (
    <div className="flex items-center gap-2">
      {user.profileImageUrl ? (
        <img
          src={user.profileImageUrl}
          alt=""
          className="h-8 w-8 rounded-full object-cover"
        />
      ) : (
        <span className="grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20">
          {label.charAt(0).toUpperCase()}
        </span>
      )}
      {/* On a phone the header has room for the initial only (a signed-in header ran 9 px off a 320 px screen):
          the name shows from sm up, and Sign out moves into the Menu (MenuSignOut). */}
      <span className="hidden max-w-[10rem] truncate text-sm font-medium sm:inline" title={label}>
        {label}
      </span>
      <span className="sr-only sm:hidden">Signed in as {label}</span>
      {authEnabled && (
        <button
          type="button"
          onClick={() => void signOut()}
          className="hidden cursor-pointer whitespace-nowrap text-sm underline-offset-4 opacity-70 hover:underline sm:inline"
        >
          Sign out
        </button>
      )}
    </div>
  );
}

/** Sign out inside the site Menu, on a phone only (the header shows it from sm up). Nothing when signed out. */
export function MenuSignOut() {
  const user = useCurrentUser();
  if (!user || !authEnabled) return null;
  return (
    <div className="mt-1 border-t border-border/60 pt-1 sm:hidden">
      <button
        type="button"
        data-menu-sign-out
        onClick={() => void signOut()}
        className="block w-full cursor-pointer whitespace-nowrap rounded-[var(--radius-sm)] px-3 py-2.5 text-left text-sm text-muted hover:text-fg"
      >
        Sign out
      </button>
    </div>
  );
}
