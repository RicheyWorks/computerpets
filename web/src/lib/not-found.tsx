import { Link } from "@tanstack/react-router";
import { pageTitle, useDocumentTitle } from "@/lib/page-title";

/** The tab and the words a mistyped or old link gets (the router's defaultNotFoundComponent, src/router.tsx). */
export const NOT_FOUND_TITLE = pageTitle("No room here");
export const NOT_FOUND_HEADING = "No room by that name.";
export const NOT_FOUND_LINE = "The link may be old or mistyped. The house is still here:";

/**
 * A page the house does not have. Before this the router drew a bare "Not Found" (TanStack's generic default,
 * with a warning on every such request) and the tab said only "ComputerPets": no word on what happened and no way
 * on but the Menu. The server still answers 404.
 */
export function AppNotFound() {
  useDocumentTitle(NOT_FOUND_TITLE);
  const link = "inline-flex min-h-11 items-center rounded-md border border-border px-4 text-sm text-fg no-underline hover:border-primary";
  return (
    <main className="mx-auto max-w-lg space-y-4 px-6 py-16" data-not-found>
      <h1 className="font-display text-3xl">{NOT_FOUND_HEADING}</h1>
      <p className="text-sm text-muted">{NOT_FOUND_LINE}</p>
      <nav aria-label="Ways on" className="flex flex-wrap gap-2">
        <Link to="/" className={link}>
          Open the desk
        </Link>
        <Link to="/meet" className={link}>
          Meet the guests
        </Link>
        <Link to="/collection" className={link}>
          Your kennel
        </Link>
      </nav>
    </main>
  );
}
