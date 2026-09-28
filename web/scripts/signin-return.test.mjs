import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

// After signing in from a gated page (the kennel, the hatchery, the nest, a pet page) the visitor goes back to
// that page, not the desk. Only same-site paths are ever followed: absolute URLs, protocol-relative //,
// backslashes, schemes (javascript:, data:), control characters and whitespace, the same tricks
// percent-encoded, dot segments that collapse to //, and loops back to /login all land on the desk.
// The browser half (a signed-out /collection lands on /login?next=%2Fcollection) is in phone-desk-layout.test.mjs.

const web = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = (rel) => readFileSync(join(web, rel), "utf8").replace(/\r\n/g, "\n");
const R = await import(pathToFileURL(join(web, "src/lib/auth/return-to.ts")).href);

test("safeReturnTo keeps same-site pages: path, query and hash", () => {
  for (const [raw, want] of [
    ["/collection", "/collection"],
    ["/hatch", "/hatch"],
    ["/nest", "/nest"],
    ["/pets/0b7c1a2e-5d0f-4d7e-9a57-2f1d3c4b5a69", "/pets/0b7c1a2e-5d0f-4d7e-9a57-2f1d3c4b5a69"],
    ["/pets/rui?x=1#a", "/pets/rui?x=1#a"],
    ["/?pet=raccoon", "/?pet=raccoon"],
    ["/meet", "/meet"],
    ["/log/../collection", "/collection"],
  ]) {
    assert.equal(R.safeReturnTo(raw), want, raw);
  }
});

test("safeReturnTo refuses everything that could leave the site, or loop, and lands on the desk", () => {
  const bad = [
    undefined,
    null,
    42,
    {},
    "",
    "collection",
    "https://evil.example/collection",
    "http://127.0.0.1:8081/api/public/heartbeat",
    "//evil.example",
    "///evil.example",
    "/\\evil.example",
    "\\\\evil.example",
    "/\\/evil.example",
    "javascript:alert(1)",
    "JaVaScRiPt:alert(1)",
    " javascript:alert(1)",
    "data:text/html,hi",
    "/\t/evil.example",
    "/\n/evil.example",
    "/ /evil.example",
    "/%2F%2Fevil.example",
    "%2F%2Fevil.example",
    "/%5Cevil.example",
    "/%255Cevil.example",
    "/%252F%252Fevil.example",
    "/%09/evil.example",
    "/%E0%A4%A",
    "/.//evil.example",
    "/%2e%2e//evil.example",
    "/a/..//evil.example",
    "/login",
    "/login?next=%2Fcollection",
    "/login/",
    "/api/auth/sign-out",
    "/auth/popup?done=1",
    `/${"a".repeat(R.RETURN_MAX)}`,
  ];
  for (const raw of bad) assert.equal(R.safeReturnTo(raw), R.RETURN_FALLBACK, JSON.stringify(raw));
  assert.equal(R.RETURN_FALLBACK, "/");
});

test("signInHref remembers the page (encoded), and says nothing extra for the desk or an unsafe page", () => {
  assert.equal(R.signInHref("/collection"), "/login?next=%2Fcollection");
  assert.equal(R.signInHref("/pets/rui?x=1#a"), "/login?next=%2Fpets%2Frui%3Fx%3D1%23a");
  assert.equal(R.signInHref("/"), "/login");
  assert.equal(R.signInHref("//evil.example"), "/login");
  assert.equal(R.signInHref("https://evil.example"), "/login");
  // Round trip: what signInHref writes, safeReturnTo reads back.
  const next = new URL(R.signInHref("/hatch?pair=1"), "https://x.invalid").searchParams.get("next");
  assert.equal(R.safeReturnTo(next), "/hatch?pair=1");
});

test("the gate, the header and /login carry the page through sign-in", () => {
  const gates = src("src/lib/auth/gates.tsx");
  assert.match(gates, /safeReturnTo\(/);
  assert.match(gates, /const \[next\] = useState\(\(\) => safeReturnTo\(here\)\);/);
  assert.match(gates, /<Navigate to=\{SIGN_IN_PATH\} search=\{\{ next \}\} \/>/);
  const login = src("src/routes/login.tsx");
  assert.match(login, /next: z\.string\(\)\.optional\(\)\.catch\(undefined\)/);
  assert.match(login, /const returnTo = safeReturnTo\(next\);/);
  assert.match(login, /callbackURL: returnTo, errorCallbackURL: signInHref\(returnTo\)/);
  assert.doesNotMatch(login, /callbackURL: next\b/, "the raw search value never reaches signIn");
  // A sign-in that comes back with ?error= (failed or cancelled at the provider) says so on /login, not silently
  // on the desk (errorCallbackURL used to be "/").
  assert.match(login, /error: z\.string\(\)\.optional\(\)\.catch\(undefined\)/);
  assert.match(login, /const SIGN_IN_UNFINISHED = "Sign-in did not finish\. Try again\.";/);
  assert.match(login, /useState<string \| null>\(error \? SIGN_IN_UNFINISHED : null\)/);
  assert.doesNotMatch(login, /^export (?!const Route\b)/m, "a route file exports only Route (no code-split warning)");
  const shell = src("src/components/app-shell.tsx");
  assert.match(shell, /const back = safeReturnTo\(pathname\);/);
});

test("a signed-in header fits a 320 px phone: the initial only, Sign out in the Menu", () => {
  // The signed-in sweep (a stand-in session) found the header row 9 px wider than a 320 px screen.
  const gates = src("src/lib/auth/gates.tsx");
  assert.match(gates, /<span className="hidden max-w-\[10rem\] truncate text-sm font-medium sm:inline" title=\{label\}>/);
  assert.match(gates, /<span className="sr-only sm:hidden">Signed in as \{label\}<\/span>/);
  assert.match(gates, /className="hidden cursor-pointer whitespace-nowrap text-sm underline-offset-4 opacity-70 hover:underline sm:inline"/);
  assert.match(gates, /export function MenuSignOut\(\) \{\n\s+const user = useCurrentUser\(\);\n\s+if \(!user \|\| !authEnabled\) return null;/);
  const shell = src("src/components/app-shell.tsx");
  assert.match(shell, /<\/nav>\n\s+<MenuSignOut \/>\n\s+<\/div>/);
});
