import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { safeReturnTo, signInHref } from "@/lib/auth/return-to";
import { Button } from "@/components/ui/button";
import { loadProblem } from "@/lib/plain-error";

// `next` is where sign-in returns to: the gated page that sent the visitor here. It is read through
// safeReturnTo (same-site paths only), so a link like /login?next=https://elsewhere lands on the desk.
const searchSchema = z.object({
  next: z.string().optional().catch(undefined),
  // Better Auth comes back here with ?error=… when the provider round trip fails or is cancelled.
  error: z.string().optional().catch(undefined),
});

/** A sign-in that came back with an error. It used to land on the desk with no word; now it says so here. */
const SIGN_IN_UNFINISHED = "Sign-in did not finish. Try again.";

export const Route = createFileRoute("/login")({
  validateSearch: searchSchema,
  component: Login,
  // The tab said only "ComputerPets" here (and on every signed-in page a signed-out visitor is sent to).
  head: () => ({ meta: [{ title: "Sign in — ComputerPets" }, { name: "description", content: "Sign in to sit with the house." }] }),
});

function Login() {
  const { next, error } = Route.useSearch();
  const returnTo = safeReturnTo(next);
  const [problem, setProblem] = useState<string | null>(error ? SIGN_IN_UNFINISHED : null);
  const [starting, setStarting] = useState<string | null>(null);

  async function start(providerId: string) {
    setProblem(null);
    setStarting(providerId);
    try {
      await signIn(providerId, { callbackURL: returnTo, errorCallbackURL: signInHref(returnTo) });
    } catch (err) {
      // A failed sign-in click says so in one plain sentence; the raw error goes to the console.
      setProblem(loadProblem("signin", err));
    } finally {
      setStarting(null);
    }
  }

  return (
    <main className="mx-auto grid min-h-[70vh] max-w-md place-items-center">
      <div className="w-full space-y-6 rounded-[var(--radius-xl)] border border-border bg-surface p-6 sm:p-8">
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.18em] text-subtle">Keeper desk</p>
          <h1 className="font-display text-3xl">Sit, hatch, nest</h1>
          <p className="text-sm text-muted">
            Sign in to sit with the house. Hatch, nest, and keep a kennel.
          </p>
        </div>
        {authEnabled ? (
          <div className="space-y-2">
            {GROK_PROVIDERS.map((p) => (
              <Button
                key={p.providerId}
                type="button"
                variant="secondary"
                className="w-full"
                disabled={starting !== null}
                onClick={() => void start(p.providerId)}
              >
                Continue with {p.label}
              </Button>
            ))}
            {problem ? (
              <p role="alert" className="text-sm text-muted">
                {problem}
              </p>
            ) : null}
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted">
              Sign-in is off on this site, so there is no account to open. The desk, the catalog, and the
              demo rooms work without one.
            </p>
            <Link to="/" className="text-sm text-primary">
              Go to the desk
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
