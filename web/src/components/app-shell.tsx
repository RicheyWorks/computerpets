import { Link, useRouterState } from "@tanstack/react-router";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/meet", label: "Meet", hideOnPhone: false },
  { to: "/live", label: "Live", hideOnPhone: false },
  { to: "/", label: "Desk", hideOnPhone: false },
  { to: "/collection", label: "Kennel", hideOnPhone: true },
  { to: "/hatch", label: "Hatchery", hideOnPhone: true },
  { to: "/catalog", label: "Catalog", hideOnPhone: true },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { isPending } = useCurrentUserState();
  const desk = pathname === "/";
  const demo = pathname.startsWith("/demo/");
  const meet = pathname === "/meet";
  const live = pathname === "/live";

  return (
    <div className={cn("bg-bg text-fg", desk || demo || live ? "h-dvh overflow-hidden" : "min-h-dvh")}>
      <header
        className={cn(
          "z-30 border-b border-border/80",
          desk || demo || meet || live
            ? "absolute inset-x-0 top-0 bg-bg/40 backdrop-blur-sm"
            : "sticky top-0 bg-bg/90 backdrop-blur-sm",
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/meet" className="flex items-baseline gap-2 no-underline">
            <span className="font-display text-lg tracking-tight text-fg">ComputerPets</span>
            <span className="hidden text-[11px] uppercase tracking-[0.18em] text-subtle sm:inline">
              Living desk
            </span>
          </Link>
          <nav className="flex items-center gap-1 overflow-x-auto">
            {NAV.map((item) => {
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "rounded-[var(--radius-sm)] px-3 py-2 text-sm no-underline transition-colors duration-150",
                    item.hideOnPhone ? "hidden sm:inline-flex" : "",
                    active ? "bg-elevated text-fg" : "text-muted hover:text-fg",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex min-w-10 items-center justify-end">
            {isPending ? (
              <div className="size-8 animate-pulse rounded-full bg-elevated" />
            ) : (
              <>
                <SignedIn>
                  <UserButton />
                </SignedIn>
                <SignedOut>
                  <Link
                    to="/login"
                    className="rounded-[var(--radius-sm)] border border-border px-3 py-2 text-sm text-fg no-underline hover:border-border-strong"
                  >
                    Sign in
                  </Link>
                </SignedOut>
              </>
            )}
          </div>
        </div>
      </header>
      {desk || demo || live ? (
        <div className={demo || live ? "h-dvh" : "h-dvh pt-16"}>{children}</div>
      ) : meet ? (
        <div>{children}</div>
      ) : (
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">{children}</div>
      )}
    </div>
  );
}
