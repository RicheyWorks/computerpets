import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

// A failed load says it did not load (plain reason + retry) instead of passing for an empty
// kennel, zero ember, the default desk guest, or a silent sign-in button. The admin ledger
// refuses an address that is not the license service and shows the viewer's local time.

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = (rel) => readFileSync(join(root, rel), "utf8").replace(/\r\n/g, "\n");
const P = await import(pathToFileURL(join(root, "src/lib/plain-error.ts")).href);
const B = await import(pathToFileURL(join(root, "src/lib/admin/base.ts")).href);

const quiet = () => {};

test("loadProblem: 'Couldn't load …' plus a plain reason, never raw text", () => {
  const logged = [];
  const log = (label, err) => logged.push([label, err]);
  const refused = Object.assign(new TypeError("fetch failed"), { cause: { code: "ECONNREFUSED", message: "connect ECONNREFUSED 10.0.0.9:5432" } });
  const kennel = P.loadProblem("kennel", refused, log);
  assert.equal(kennel, `Couldn't load your kennel. ${P.PLAIN_LINES.unreachable}`);
  assert.doesNotMatch(kennel, /ECONNREFUSED|10\.0\.0\.9|fetch failed/);
  assert.equal(logged.length, 1, "the raw error goes to the log");

  assert.equal(P.loadProblem("ember", new Error("relation \"pets\" does not exist"), quiet), `Couldn't load your ember. ${P.PLAIN_LINES.database}`);
  assert.equal(P.loadProblem("desk", Object.assign(new Error("x"), { status: 503 }), quiet), `Couldn't load your guests for the desk. ${P.PLAIN_LINES.server}`);
  assert.equal(P.loadProblem("signin", new Error("mystery internals"), quiet), "Couldn't start sign-in. Try again in a moment.");
  // A deliberate house line passes through unchanged.
  const house = new P.HouseError("The sign-in window closed before sign-in finished. Try again.");
  assert.equal(P.loadProblem("signin", house, quiet), "Couldn't start sign-in. The sign-in window closed before sign-in finished. Try again.");
  assert.deepEqual(Object.keys(P.LOAD_LINES).sort(), ["desk", "ember", "kennel", "nest", "signin"]);
  assert.equal(P.RETRY_LABEL, "Try again");
});

test("LoadProblem component: plain line, alert role, one retry button", () => {
  const text = src("src/components/load-problem.tsx");
  assert.match(text, /role="alert"/);
  assert.match(text, /onClick=\{onRetry\}/);
  assert.match(text, /\{RETRY_LABEL\}/);
  assert.doesNotMatch(text, /\.message\b/);
});

test("/collection: a failed load is not an empty kennel", () => {
  const text = src("src/routes/collection.tsx");
  assert.doesNotMatch(text, /\.catch\(\(\) => setPets\(\[\]\)\)/);
  assert.match(text, /\.catch\(\(err\) => setProblem\(loadProblem\("kennel", err\)\)\)/);
  assert.match(text, /<LoadProblem line=\{problem\} onRetry=\{retry\} \/>/);
  assert.match(text, /\}, \[user, attempt\]\);/);
  // The problem is checked before the loading pulse and before the empty-kennel line.
  assert.ok(text.indexOf("if (problem)") < text.indexOf("if (pets === null)"));
  assert.ok(text.indexOf("if (problem)") < text.indexOf("The kennel is quiet."));
});

test("/hatch: a failed ember load is not zero ember, and the draw stays off", () => {
  const text = src("src/routes/hatch.tsx");
  assert.doesNotMatch(text, /setEmber\(0\)/);
  assert.match(text, /\.catch\(\(err\) => setEmberProblem\(loadProblem\("ember", err\)\)\)/);
  assert.match(text, /<LoadProblem className="mt-3" line=\{emberProblem\} onRetry=\{retryEmber\} \/>/);
  assert.match(text, /disabled: busy \|\| ember === null/);
  assert.match(text, /\{ember \?\? "—"\}/);
});

test("signed-in desk home: a failed load says so with a retry, not silently the default guest", () => {
  const text = src("src/routes/index.tsx");
  assert.doesNotMatch(text, /\.catch\(\(\) => undefined\)/);
  assert.match(text, /\.catch\(\(err\) => setProblem\(loadProblem\("desk", err\)\)\)/);
  assert.match(text, /<LoadProblem line=\{problem\} onRetry=\{\(\) => setAttempt\(\(n\) => n \+ 1\)\} \/>/);
  assert.match(text, /\}, \[kind, attempt\]\);/);
});

test("/login: a failed sign-in click shows one plain sentence", () => {
  const text = src("src/routes/login.tsx");
  // Sign-in returns to the page that sent the visitor (safeReturnTo; the desk when there was none).
  assert.match(text, /await signIn\(providerId, \{ callbackURL: returnTo, errorCallbackURL: signInHref\(returnTo\) \}\);/);
  assert.match(text, /const returnTo = safeReturnTo\(next\);/);
  assert.match(text, /setProblem\(loadProblem\("signin", err\)\)/);
  assert.match(text, /onClick=\{\(\) => void start\(p\.providerId\)\}/);
  assert.match(text, /role="alert"/);
  assert.doesNotMatch(text, /onClick=\{\(\) => signIn\(/);
  const client = src("src/lib/auth/client.ts");
  assert.match(client, /throw new HouseError\("Your browser blocked the sign-in window\. Allow pop-ups for this site, then try again\."\)/);
  assert.match(client, /throw new HouseError\("The sign-in window closed before sign-in finished\. Try again\."\)/);
  assert.doesNotMatch(client, /Pop-up blocked — allow pop-ups/);
});

test("admin: the License service field starts from env, then this site, then localhost only for a local page", () => {
  assert.equal(B.pickApiBase("https://license.example.com/", "https://pets.example.com"), "https://license.example.com");
  assert.equal(B.pickApiBase("  ", "https://pets.example.com"), "https://pets.example.com");
  assert.equal(B.pickApiBase(undefined, "https://pets.example.com/"), "https://pets.example.com");
  assert.equal(B.pickApiBase("not a url", "https://pets.example.com"), "https://pets.example.com");
  assert.equal(B.pickApiBase(undefined, "http://localhost:3000"), B.DEV_API_BASE);
  assert.equal(B.pickApiBase(undefined, "http://127.0.0.1:5173"), B.DEV_API_BASE);
  assert.equal(B.pickApiBase(undefined, ""), B.DEV_API_BASE);
  assert.equal(B.DEV_API_BASE, "http://localhost:8081");
  const api = src("src/lib/admin/api.ts");
  assert.doesNotMatch(api, /"http:\/\/localhost:8081"/, "no hard-coded address in the api module");
  assert.match(api, /pickApiBase\(import\.meta\.env\.VITE_LICENSE_API_URL, origin\)/);
  const page = src("src/routes/admin.tsx");
  assert.match(page, /hint="The address of your ComputerPets license service\./);
});

test("admin: only a real license list opens the ledger; a 404 says it is not the license service", () => {
  assert.equal(B.isLicenseList([]), true);
  assert.equal(B.isLicenseList([{ jti: "abc", owner: "o" }]), true);
  assert.equal(B.isLicenseList({ error: "license not found" }), false);
  assert.equal(B.isLicenseList("<!doctype html>"), false);
  assert.equal(B.isLicenseList([{ id: 1 }]), false);
  assert.equal(B.isLicenseList(null), false);
  assert.match(B.NOT_LICENSE_SERVICE, /isn't the ComputerPets license service/);
  const api = src("src/lib/admin/api.ts");
  assert.doesNotMatch(api, /__unlock-check__/);
  assert.doesNotMatch(api, /res\.status !== 404 && !res\.ok/, "a 404 must not count as success");
  assert.match(api, /adminFetch\(apiBase, adminKey, "\/api\/admin\/licenses"\);\n  if \(res\.status === 404\) throw await failure\(res, NOT_LICENSE_SERVICE\);/);
  assert.match(api, /if \(!isLicenseList\(body\)\) throw notTheService\(res\.status, "a license list"\);/);
  // saveAdminSession only after the answer checks out.
  assert.ok(api.indexOf("if (!isLicenseList(body))") < api.indexOf("saveAdminSession(apiBase, adminKey);\n  return body"));
  const page = src("src/routes/admin.tsx");
  assert.match(page, /const recent = await unlockAdmin\(base, key\);/);
});

test("admin: ledger times read in the viewer's local time, the ISO instant in the tooltip", () => {
  const la = B.formatLocalWhen("2026-09-27T18:29:45Z", { locale: "en-US", timeZone: "America/Los_Angeles" });
  assert.equal(la.text.replace(/\s/g, " "), "Sep 27, 2026, 11:29 AM");
  assert.equal(la.iso, "2026-09-27T18:29:45Z");
  const tokyo = B.formatLocalWhen("2026-09-27T18:29:45.000Z", { locale: "en-US", timeZone: "Asia/Tokyo" });
  assert.equal(tokyo.text.replace(/\s/g, " "), "Sep 28, 2026, 3:29 AM");
  assert.deepEqual(B.formatLocalWhen("not a time"), { text: "not a time", iso: "not a time" });
  const page = src("src/routes/admin.tsx");
  assert.match(page, /<time dateTime=\{when\.iso\} title=\{when\.iso\}>/);
  assert.doesNotMatch(page, /toISOString\(\)\.replace/);
});
