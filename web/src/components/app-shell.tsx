import { Link, useRouterState } from "@tanstack/react-router";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/meet", label: "Meet", hideOnPhone: false, hideOnDemo: false },
  { to: "/study", label: "Study", hideOnPhone: false, hideOnDemo: true },
  { to: "/snakes", label: "Den", hideOnPhone: false, hideOnDemo: true },
  { to: "/sea", label: "Tide", hideOnPhone: false, hideOnDemo: true },
  { to: "/garden", label: "Garden", hideOnPhone: false, hideOnDemo: true },
  { to: "/hive", label: "Hive", hideOnPhone: false, hideOnDemo: true },
  { to: "/pond", label: "Pond", hideOnPhone: false, hideOnDemo: true },
  { to: "/roost", label: "Roost", hideOnPhone: false, hideOnDemo: true },
  { to: "/corner", label: "Corner", hideOnPhone: false, hideOnDemo: true },
  { to: "/cellar", label: "Cellar", hideOnPhone: false, hideOnDemo: true },
  { to: "/well", label: "Well", hideOnPhone: false, hideOnDemo: true },
  { to: "/far", label: "Far", hideOnPhone: false, hideOnDemo: true },
  { to: "/live", label: "Live", hideOnPhone: false, hideOnDemo: false },
  { to: "/", label: "Desk", hideOnPhone: false, hideOnDemo: false },
  { to: "/collection", label: "Kennel", hideOnPhone: true, hideOnDemo: true },
  { to: "/hatch", label: "Hatchery", hideOnPhone: true, hideOnDemo: true },
  { to: "/nest", label: "Nest", hideOnPhone: true, hideOnDemo: true },
  { to: "/mind", label: "Minds", hideOnPhone: true, hideOnDemo: true },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { isPending } = useCurrentUserState();
  const desk = pathname === "/";
  const demo = pathname.startsWith("/demo/");
  const kennelGuest = pathname.startsWith("/pets/");
  const kennel = pathname === "/collection";
  const shelf = pathname === "/catalog";
  const hatchery = pathname === "/hatch";
  const nest = pathname === "/nest";
  const meet = pathname === "/meet";
  const den = pathname === "/snakes";
  const tide = pathname === "/sea";
  const garden = pathname === "/garden";
  const hive = pathname === "/hive";
  const pond = pathname === "/pond";
  const roost = pathname === "/roost";
  const corner = pathname === "/corner";
  const cellar = pathname === "/cellar";
  const well = pathname === "/well";
  const far = pathname === "/far";
  const study = pathname === "/study";
  const live = pathname === "/live";

  return (
    <div className={cn("bg-bg text-fg", desk || demo || live || kennelGuest || kennel || shelf || hatchery || nest ? "h-dvh overflow-hidden" : "min-h-dvh")}>
      <header
        className={cn(
          "z-30 border-b border-border/80",
          demo || kennelGuest || kennel || shelf || hatchery || nest || desk
            ? "absolute inset-x-0 top-0 border-transparent bg-transparent"
            : meet || den || tide || garden || hive || pond || roost || corner || cellar || well || far || study || live
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
              if (demo && item.hideOnDemo) return null;
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
      {desk || demo || live || kennelGuest || kennel || shelf || hatchery || nest ? (
        <div className="h-dvh">{children}</div>
      ) : meet || den || tide || garden || hive || pond || roost || corner || cellar || well || far || study ? (
        <div>{children}</div>
      ) : (
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">{children}</div>
      )}
    </div>
  );
}
