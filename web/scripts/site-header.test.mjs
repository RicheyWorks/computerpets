// Site header, landscape phones, the room rail, and two new-keeper gaps (audit fixes).
// - The header scrolled its 27 places sideways at every width: on a phone "Den" was cut in half and "Sign in"
//   wrapped; on a 1280 px laptop "Log" was cut and "Sign in" still wrapped. Now a Menu button (a disclosure: aria-
//   expanded, aria-controls, Escape and a tap outside close it, focus goes back to Menu) holds every place, and a
//   laptop shows the few a keeper uses most in the bar.
// - A landscape phone kept the desk window's 520 px floor, so the last row of care buttons sat below the screen
//   where the shell (h-dvh, overflow hidden) would not scroll to it.
// - The room rail stopped wherever it stopped, often with a label cut in half; now its rows snap and its height is
//   a whole number of rows.
// - The kennel, the hatchery, the nest and a pet page threw a React hydration mismatch on every hard load.
// - `npm run dev` printed 22 "will not be code-split" warnings (route files exported their page components).
// The real-browser proof is web/scripts/phone-desk-layout.test.mjs; this file pins the parts and runs the math.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { PHONE_FIT_GAP, phoneFit, railRows } from "../src/lib/pets/phone-desk.ts";

const SRC = join(import.meta.dirname, "..", "src");
const read = (...p) => readFileSync(join(SRC, ...p), "utf8").replace(/\r\n/g, "\n");

test("railRows cuts the rail to whole rows, never below one, and leaves it alone without a row height", () => {
  assert.equal(railRows(308, 32), 288);
  assert.equal(railRows(320, 32), 320);
  assert.equal(railRows(319.6, 32), 320, "half a pixel short of a row still counts (rounding)");
  assert.equal(railRows(20, 32), 32, "one row at least");
  assert.equal(railRows(100, undefined), 100);
  assert.equal(railRows(100, 0), 100);
  assert.equal(railRows(100, Number.NaN), 100);
  assert.equal(railRows(200, 25.4), 177.8);
});

test("phoneFit ends the rail on a whole row when it knows the row height; the panel keeps its measured height", () => {
  const fit = phoneFit({ asideTop: 68, railTop: 68, careTop: 384, railRow: 32 });
  assert.equal(fit.asideMax, 384 - 68 - PHONE_FIT_GAP);
  assert.equal(fit.railMax, 288);
  assert.ok(fit.railMax <= 384 - 68 - PHONE_FIT_GAP, "still ends above the care buttons");
  assert.deepEqual(phoneFit({ asideTop: 68, railTop: 68, careTop: 384 }), { asideMax: 308, railMax: 308 });
});

test("the header holds every place in one Menu (a disclosure), fits a phone, and wraps nothing", () => {
  const shell = read("components", "app-shell.tsx");
  const header = shell.slice(shell.indexOf("<header"), shell.indexOf("</header>"));
  assert.doesNotMatch(header, /overflow-x-auto/, "no sideways-scrolling nav");
  assert.match(header, /<SiteMenu items=\{nav\} pathname=\{pathname\} \/>/);
  assert.match(shell, /const nav = NAV\.filter\(\(item\) => !\(demo && item\.hideOnDemo\)\);/);
  assert.match(header, /aria-label="Main" data-site-inline className="hidden items-center gap-1 lg:flex"/, "a laptop shows a few places in the bar");
  assert.match(header, /whitespace-nowrap rounded-\[var\(--radius-sm\)\] border border-border px-3 py-2 text-sm text-fg no-underline hover:border-border-strong"\n\s+>\n\s+Sign in/);
  const menu = shell.slice(shell.indexOf("export function SiteMenu"), shell.indexOf("export function AppShell"));
  assert.match(menu, /aria-expanded=\{open\}/);
  assert.match(menu, /aria-controls=\{panelId\}/);
  assert.match(menu, /hidden=\{!open\}/);
  assert.match(menu, /<nav aria-label="Site">/);
  assert.match(menu, /if \(e\.key !== "Escape"\) return;[\s\S]*?setOpen\(false\);\n\s+buttonRef\.current\?\.focus\(\);/, "Escape closes and gives focus back");
  assert.match(menu, /document\.addEventListener\("pointerdown", onDown\);/, "a tap outside closes");
  assert.match(menu, /if \(open && next && !e\.currentTarget\.contains\(next\)\) setOpen\(false\);/, "focus leaving closes");
  assert.match(menu, /useEffect\(\(\) => \{\n\s+setOpen\(false\);\n\s+\}, \[pathname\]\);/, "a new page closes it");
  assert.doesNotMatch(menu, /role="menu"/, "site navigation is a disclosure of links, not an ARIA menu");
  // Every place is still in NAV (other tests pin the rooms), and every NAV item reaches the menu.
  const labels = [...shell.matchAll(/\{ to: "([^"]+)", label: "([^"]+)", inline: (true|false), hideOnDemo: (true|false) \}/g)];
  assert.equal(labels.length, 27);
  assert.deepEqual(labels.filter((m) => m[3] === "true").map((m) => m[2]), ["Meet", "Live", "Desk", "Kennel", "Hatchery"]);
});

test("a landscape phone fits the room to the screen, the care buttons take the width, and the panel starts below the header", () => {
  const room = read("components", "desk", "companion-room.tsx");
  assert.match(room, /hand\n\s+\? "relative isolate h-dvh min-h-0 w-full overflow-hidden bg-elevated"\n\s+: "relative isolate h-dvh min-h-\[520px\] w-full overflow-hidden bg-elevated"/);
  assert.match(room, /top-\[calc\(4\.25rem\+env\(safe-area-inset-top\)\)\] z-20 max-w-\[16rem\] overflow-y-auto/, "the landscape panel clears the 4 rem header");
  assert.doesNotMatch(room, /3\.25rem/);
  assert.match(room, /railRow: rail\.querySelector\("li"\)\?\.getBoundingClientRect\(\)\.height,/);
  const css = read("styles.css");
  assert.match(css, /\[data-phone-orient="sit"\] \.blotter-care-phone \{\n\s+max-width: min\(40rem, calc\(100vw - 2rem\)\);/);
  assert.match(css, /\[data-phone-orient="blotter"\] \.blotter-care-phone \{\n\s+max-width: 16rem;/, "portrait unchanged");
});

test("the phone rail snaps whole rows: one scroller, one row height, snap to the top", () => {
  const css = read("styles.css");
  assert.match(css, /\[data-phone-floor\] \[data-desk-rail\] \{\n\s+--rail-row: 2rem;\n\s+scroll-snap-type: y mandatory;/);
  assert.match(css, /\[data-phone-floor\] \[data-desk-rail\] \.den-cabinet-drawer \{\n\s+margin: 0;\n\s+max-height: none;\n\s+overflow: visible;/);
  assert.match(css, /\[data-phone-floor\] \[data-desk-rail\] li \{[^}]*height: var\(--rail-row\);[^}]*scroll-snap-align: start;[^}]*white-space: nowrap;/);
});

test("the session reads as loading until hydration, so a server-rendered page matches its first client render", () => {
  const hook = read("lib", "auth", "use-current-user.ts");
  assert.match(hook, /export function useHydrated\(\): boolean \{\n\s+return useSyncExternalStore\(noSubscribe, \(\) => true, \(\) => false\);/);
  assert.match(hook, /const hydrated = useHydrated\(\);[\s\S]*?const \{ data, isPending \} = authClient\.useSession\(\);\n\s+if \(!hydrated\) return \{ user: null, isPending: true \};/);
  assert.match(hook, /if \(!authEnabled\) return \{ user: DEV_USER, isPending: false \};/, "the dev user is the same on both sides");
});

test("route files export only their Route (TanStack code-splits them; npm run dev prints no warnings)", () => {
  const dir = join(SRC, "routes");
  const files = readdirSync(dir).filter((f) => f.endsWith(".tsx"));
  assert.ok(files.length >= 30);
  const loud = files.filter((f) => /^export (?!const Route\b)/m.test(readFileSync(join(dir, f), "utf8")));
  assert.deepEqual(loud, []);
});

test("the sign-in page has its own tab title", () => {
  assert.match(read("routes", "login.tsx"), /title: "Sign in — ComputerPets"/);
});
