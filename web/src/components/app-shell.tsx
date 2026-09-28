import { useEffect, useId, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { PortraitNote } from "@/components/pet-portrait";
import { MenuSignOut, SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { RETURN_FALLBACK, safeReturnTo } from "@/lib/auth/return-to";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/meet", label: "Meet", inline: true, hideOnDemo: false },
  { to: "/study", label: "Study", inline: false, hideOnDemo: true },
  { to: "/snakes", label: "Den", inline: false, hideOnDemo: true },
  { to: "/sea", label: "Tide", inline: false, hideOnDemo: true },
  { to: "/garden", label: "Garden", inline: false, hideOnDemo: true },
  { to: "/hive", label: "Hive", inline: false, hideOnDemo: true },
  { to: "/pond", label: "Pond", inline: false, hideOnDemo: true },
  { to: "/roost", label: "Roost", inline: false, hideOnDemo: true },
  { to: "/corner", label: "Corner", inline: false, hideOnDemo: true },
  { to: "/wood", label: "Wood", inline: false, hideOnDemo: true },
  { to: "/canopy", label: "Canopy", inline: false, hideOnDemo: true },
  { to: "/stone", label: "Stone", inline: false, hideOnDemo: true },
  { to: "/creek", label: "Creek", inline: false, hideOnDemo: true },
  { to: "/log", label: "Log", inline: false, hideOnDemo: true },
  { to: "/shore", label: "Shore", inline: false, hideOnDemo: true },
  { to: "/reef", label: "Reef", inline: false, hideOnDemo: true },
  { to: "/meadow", label: "Meadow", inline: false, hideOnDemo: true },
  { to: "/cellar", label: "Cellar", inline: false, hideOnDemo: true },
  { to: "/well", label: "Well", inline: false, hideOnDemo: true },
  { to: "/far", label: "Far", inline: false, hideOnDemo: true },
  { to: "/grid", label: "Grid", inline: false, hideOnDemo: true },
  { to: "/live", label: "Live", inline: true, hideOnDemo: false },
  { to: "/", label: "Desk", inline: true, hideOnDemo: false },
  { to: "/collection", label: "Kennel", inline: true, hideOnDemo: true },
  { to: "/hatch", label: "Hatchery", inline: true, hideOnDemo: true },
  { to: "/nest", label: "Nest", inline: false, hideOnDemo: true },
  { to: "/mind", label: "Minds", inline: false, hideOnDemo: true },
] as const;

type NavItem = (typeof NAV)[number];

/**
 * The whole site in one menu: a button that says Menu, and a list of every place under it. It fits a 320 px phone
 * (the old header scrolled its 28 links sideways at every width, cutting "Den" in half on a phone and "Log" on a
 * laptop, and "Sign in" wrapped). A disclosure, not an ARIA menu: the button carries aria-expanded and
 * aria-controls, the list is a labelled nav of plain links, Escape or a tap outside closes it and gives focus back
 * to the button, and focus leaving the list closes it.
 */
export function SiteMenu({ items, pathname }: { items: readonly NavItem[]; pathname: string }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node | null;
      if (t && (panelRef.current?.contains(t) || buttonRef.current?.contains(t))) return;
      setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    // Keyboard users land on the page they are on (or the first place), not back at the top of the page.
    const here = panelRef.current?.querySelector<HTMLElement>('a[aria-current="page"]') ?? panelRef.current?.querySelector<HTMLElement>("a");
    here?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <div
      onBlur={(e) => {
        const next = e.relatedTarget as Node | null;
        if (open && next && !e.currentTarget.contains(next)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        data-site-menu-button
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-[var(--radius-sm)] border border-border px-2.5 py-2 text-sm text-fg hover:border-border-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          {open ? <path d="M4 4l8 8M12 4l-8 8" /> : <path d="M2.5 4.5h11M2.5 8h11M2.5 11.5h11" />}
        </svg>
        Menu
      </button>
      <div
        ref={panelRef}
        id={panelId}
        data-site-menu
        hidden={!open}
        className="absolute right-4 top-full z-40 -mt-1 sm:right-6 max-h-[calc(100dvh-5rem)] w-[min(22rem,calc(100vw-2rem))] overflow-y-auto overscroll-contain rounded-[var(--radius-md)] border border-border bg-bg/95 p-2 shadow-lg backdrop-blur-sm"
      >
        <nav aria-label="Site">
          <ul className="grid grid-cols-3 gap-1">
            {items.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block whitespace-nowrap rounded-[var(--radius-sm)] px-3 py-2.5 text-sm no-underline transition-colors duration-150",
                    pathname === item.to ? "bg-elevated text-fg" : "text-muted hover:text-fg",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <MenuSignOut />
      </div>
    </div>
  );
}

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
  const wood = pathname === "/wood";
  const canopy = pathname === "/canopy";
  const stone = pathname === "/stone";
  const creek = pathname === "/creek";
  const log = pathname === "/log";
  const shore = pathname === "/shore";
  const reef = pathname === "/reef";
  const meadow = pathname === "/meadow";
  const cellar = pathname === "/cellar";
  const well = pathname === "/well";
  const far = pathname === "/far";
  const grid = pathname === "/grid";
  const study = pathname === "/study";
  const live = pathname === "/live";
  const nav = NAV.filter((item) => !(demo && item.hideOnDemo));
  // Sign in from any page comes back to that page (a safe same-site path; the desk needs no reminder).
  const back = safeReturnTo(pathname);
  const signInSearch = back === RETURN_FALLBACK ? {} : { next: back };

  return (
    <div className={cn("bg-bg text-fg", desk || demo || live || kennelGuest || kennel || shelf || hatchery || nest ? "h-dvh overflow-hidden" : "min-h-dvh")}>
      <header
        data-site-header
        className={cn(
          "z-30 border-b border-border/80",
          demo || kennelGuest || kennel || shelf || hatchery || nest || desk
            ? "absolute inset-x-0 top-0 border-transparent bg-transparent"
            : meet || den || tide || garden || hive || pond || roost || corner || wood || canopy || stone || creek || log || shore || reef || meadow || cellar || well || far || grid || study || live
              ? "absolute inset-x-0 top-0 bg-bg/40 backdrop-blur-sm"
              : "sticky top-0 bg-bg/90 backdrop-blur-sm",
        )}
      >
        <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link to="/meet" className="flex shrink-0 items-baseline gap-2 whitespace-nowrap no-underline">
            <span className="font-display text-lg tracking-tight text-fg">ComputerPets</span>
            <span className="hidden text-[11px] uppercase tracking-[0.18em] text-subtle sm:inline">
              Living desk
            </span>
          </Link>
          {/* On a laptop the few places a keeper uses most sit in the bar; every place is in the menu at every width. */}
          <nav aria-label="Main" data-site-inline className="hidden items-center gap-1 lg:flex">
            {nav.filter((item) => item.inline).map((item) => {
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "whitespace-nowrap rounded-[var(--radius-sm)] px-3 py-2 text-sm no-underline transition-colors duration-150",
                    active ? "bg-elevated text-fg" : "text-muted hover:text-fg",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex shrink-0 items-center justify-end gap-2">
            <SiteMenu items={nav} pathname={pathname} />
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
                      search={signInSearch}
                      className="whitespace-nowrap rounded-[var(--radius-sm)] border border-border px-3 py-2 text-sm text-fg no-underline hover:border-border-strong"
                    >
                      Sign in
                    </Link>
                  </SignedOut>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      {desk || demo || live || kennelGuest || kennel || shelf || hatchery || nest ? (
        <div className="h-dvh">{children}</div>
      ) : meet || den || tide || garden || hive || pond || roost || corner || wood || canopy || stone || creek || log || shore || reef || meadow || cellar || well || far || grid || study ? (
        <div>{children}</div>
      ) : (
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 [@media(max-height:480px)]:py-3">{children}</div>
      )}
      <PortraitNote />
    </div>
  );
}
