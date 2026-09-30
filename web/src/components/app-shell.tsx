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

/**
 * Escape closes the drawer (a <details>) the keyboard is in and puts the focus on its summary, the way Escape closes
 * the Menu and the keeper card. A drawer only closed on a second press of its summary. Only this page's own keys; a
 * key another control already took (defaultPrevented) is left alone.
 */
export function closeDrawerOnEscape(e: Pick<KeyboardEvent, "key" | "defaultPrevented" | "target" | "preventDefault">): boolean {
  if (e.key !== "Escape" || e.defaultPrevented) return false;
  const t = e.target as Element | null;
  const drawer = t && typeof t.closest === "function" ? (t.closest("details[open]") as HTMLDetailsElement | null) : null;
  if (!drawer) return false;
  e.preventDefault();
  drawer.open = false;
  (drawer.querySelector(":scope > summary") as HTMLElement | null)?.focus();
  return true;
}

/** Opens every closed drawer (a print shows them all) and returns the ones it opened, to close after the print. */
export function openDrawersForPrint(doc: Document): HTMLDetailsElement[] {
  const shut = Array.from(doc.querySelectorAll<HTMLDetailsElement>("details:not([open])"));
  for (const d of shut) d.open = true;
  return shut;
}

/** The care row a desk or den draws (BlotterCare, not a keeper card's own row): the skip link's target. */
export const CARE_ROW = '.blotter-care[role="toolbar"]';

/**
 * Where the skip link sends the keyboard: the first care button that can be pressed (the row itself while the pet is
 * busy and every word is greyed out), else the page's <main>, else the page under the header. Focus only; nothing is
 * pressed. A target that is not a Tab stop gets tabindex -1 for as long as it holds the focus.
 */
export function skipTarget(doc: Document, page: HTMLElement | null): HTMLElement | null {
  const row = doc.querySelector<HTMLElement>(CARE_ROW);
  if (row) {
    const ready = Array.from(row.querySelectorAll<HTMLButtonElement>("button")).find((b) => !b.disabled && b.getClientRects().length > 0);
    return ready ?? row;
  }
  return doc.querySelector<HTMLElement>("main") ?? page;
}

/**
 * The first Tab stop on every page: hidden until the keyboard reaches it, then a small plate at the top left. On a
 * desk it skips the header and the room rail (about 55 Tab stops) to the care buttons; elsewhere it skips the header.
 */
function SkipLink({ pathname, page }: { pathname: string; page: React.RefObject<HTMLDivElement | null> }) {
  const [care, setCare] = useState(false);
  useEffect(() => {
    const check = () => setCare(!!document.querySelector(CARE_ROW));
    check();
    const watch = new MutationObserver(check);
    watch.observe(document.body, { childList: true, subtree: true });
    return () => watch.disconnect();
  }, [pathname]);
  return (
    <a
      href="#page"
      data-skip-link
      className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-[var(--radius-sm)] focus:border focus:border-border-strong focus:bg-elevated focus:px-4 focus:text-sm focus:text-fg focus:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      onClick={(e) => {
        e.preventDefault();
        const to = skipTarget(document, page.current);
        if (!to) return;
        if (!to.matches("a[href], button, input, select, textarea, [tabindex]")) {
          to.setAttribute("tabindex", "-1");
          to.addEventListener("blur", () => to.removeAttribute("tabindex"), { once: true });
        }
        to.focus();
      }}
    >
      {care ? "Skip to the care buttons" : "Skip to the page"}
    </a>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const pageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => void closeDrawerOnEscape(e);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    // A print shows every field note: the closed drawers open for it and close again after.
    let opened: HTMLDetailsElement[] = [];
    const before = () => {
      opened = openDrawersForPrint(document);
    };
    const afterPrint = () => {
      for (const d of opened) d.open = false;
      opened = [];
    };
    window.addEventListener("beforeprint", before);
    window.addEventListener("afterprint", afterPrint);
    return () => {
      window.removeEventListener("beforeprint", before);
      window.removeEventListener("afterprint", afterPrint);
    };
  }, []);
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
    // A desk page is one screen that does not scroll, except in a window shorter than the room's 520 px floor (a
    // laptop at 200 % zoom is 384 px tall) with a mouse: there it scrolls, so the care buttons under the fold can be
    // reached. A phone (a coarse pointer) keeps its own fit, which measures the room to the screen.
    <div
      className={cn(
        "bg-bg text-fg",
        desk || demo || live || kennelGuest || kennel || shelf || hatchery || nest ? "h-dvh overflow-hidden [@media(max-height:519px)_and_(pointer:fine)]:overflow-y-auto" : "min-h-dvh",
      )}
    >
      <SkipLink pathname={pathname} page={pageRef} />
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
        {/* Under 320 px wide (a 280 px phone, or a narrow window zoomed in) the bar tightens so Sign in stays on
            the screen; it ran 20 px past the right edge at 280 px. */}
        <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 max-[319px]:gap-1.5 max-[319px]:px-2">
          <Link to="/meet" className="flex shrink-0 items-baseline gap-2 whitespace-nowrap no-underline">
            <span className="font-display text-lg tracking-tight text-fg max-[319px]:text-base">ComputerPets</span>
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
        <div ref={pageRef} id="page" className="h-dvh">{children}</div>
      ) : meet || den || tide || garden || hive || pond || roost || corner || wood || canopy || stone || creek || log || shore || reef || meadow || cellar || well || far || grid || study ? (
        <div ref={pageRef} id="page">{children}</div>
      ) : (
        <div ref={pageRef} id="page" className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 [@media(max-height:480px)]:py-3">{children}</div>
      )}
      <PortraitNote />
    </div>
  );
}
