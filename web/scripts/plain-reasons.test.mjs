import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

// The nest says when it did not load; a play the house could not save says so; admin search
// refuses answers that are not the license service; the Minds test names why the mind did not
// answer; and the deploy configs name VITE_LICENSE_API_URL and ADMIN_ALLOWED_ORIGINS.

const web = join(dirname(fileURLToPath(import.meta.url)), "..");
const repo = join(web, "..");
const read = (base, rel) => readFileSync(join(base, rel), "utf8").replace(/\r\n/g, "\n");
const src = (rel) => read(web, rel);
const P = await import(pathToFileURL(join(web, "src/lib/plain-error.ts")).href);
const B = await import(pathToFileURL(join(web, "src/lib/admin/base.ts")).href);
const quiet = () => {};

test("/nest: a failed load is not 0 ember and an empty nest", () => {
  const text = src("src/routes/nest.tsx");
  assert.doesNotMatch(text, /setEmber\(0\)/);
  assert.doesNotMatch(text, /setPets\(\[\]\)/);
  assert.match(text, /\.catch\(\(err\) => setProblem\(loadProblem\("nest", err\)\)\)/);
  assert.match(text, /<LoadProblem line=\{problem\} onRetry=\{retryLoad\} \/>/);
  assert.match(text, /\}, \[user, attempt\]\);/);
  assert.equal(P.LOAD_LINES.nest, "Couldn't load the nest.");
  assert.equal(P.loadProblem("nest", new Error("mystery"), quiet), "Couldn't load the nest. Try again in a moment.");
});

test("careNotSaved: the play wasn't saved, plus a plain reason; raw text only in the log", () => {
  const logged = [];
  const refused = Object.assign(new TypeError("fetch failed"), { cause: { code: "ECONNREFUSED" } });
  const line = P.careNotSaved("play", refused, (l, e) => logged.push([l, e]));
  assert.equal(line, `The play wasn't saved, so the meters didn't change. ${P.PLAIN_LINES.unreachable}`);
  assert.equal(logged.length, 1);
  const house = new P.HouseError("That guest has left the house.");
  assert.equal(P.careNotSaved("play", house, quiet), "The play wasn't saved, so the meters didn't change. That guest has left the house.");
});

test("companion room: a failed play save is told plainly with a retry, and the meters stay put", () => {
  const text = src("src/components/desk/companion-room.tsx");
  assert.doesNotMatch(text, /\.catch\(\(\) => undefined\)/, "no swallowed play save");
  assert.match(text, /\.catch\(\(err\) => playNotSaved\(err\)\)/);
  assert.match(text, /await persist\("play"\);\n      \} catch \(err\) \{\n        playNotSaved\(err\);\n        return;/);
  const fn = text.slice(text.indexOf("function playNotSaved"), text.indexOf("function retryCare"));
  assert.match(fn, /takenRef\.current = false;/);
  assert.match(fn, /setMark\(null\);/);
  assert.match(fn, /careFailed\("play", err\);/);
  assert.doesNotMatch(fn, /setStats/, "a failed save does not move the meters");
  assert.match(text, /setCareProblem\(\{ act, line: careNotSaved\(act, err\) \}\);/);
  assert.match(text, /<p role="status" aria-live="polite" data-care-problem=\{careProblem\.act\}/);
  assert.match(text, /if \(act === "play"\) void retryPlay\(\);/);
  assert.match(text, /\{RETRY_LABEL\}/);
  // persist only sets stats after the house answered.
  const persist = text.slice(text.indexOf("async function persist"), text.indexOf("function careFailed"));
  assert.ok(persist.indexOf("await onCare(action)") < persist.indexOf("setStats(next)"));
});

test("admin search: only license answers count; anything else is not the license service", () => {
  assert.equal(B.isLicenseRow({ jti: "a" }), true);
  assert.equal(B.isLicenseRow([{ jti: "a" }]), false);
  assert.equal(B.isLicenseRow("<html>"), false);
  assert.equal(B.isLicenseMissing({ error: "license not found", jti: "x" }), true);
  assert.equal(B.isLicenseMissing({ timestamp: "t", status: 404, error: "Not Found", path: "/x" }), false);
  assert.equal(B.isLicenseMissing(null), false);
  assert.equal(B.isRevokeMiss({ revoked: false, jti: "x", reason: "not found or already revoked" }), true);
  assert.equal(B.isRevokeMiss({ error: "Not Found" }), false);
  const api = src("src/lib/admin/api.ts");
  const list = api.slice(api.indexOf("export async function listLicenses"), api.indexOf("export async function lookupLicenses"));
  assert.match(list, /if \(res\.status === 404\) throw await failure\(res, NOT_LICENSE_SERVICE\);/);
  assert.match(list, /if \(!isLicenseList\(body\)\) throw notTheService\(res\.status, "a license list"\);/);
  assert.doesNotMatch(list, /res\.json\(\)/, "no unchecked json cast");
  const one = api.slice(api.indexOf("export async function getLicense"), api.indexOf("export async function listLicenses"));
  assert.match(one, /if \(isLicenseMissing\(await readJsonBody\(res\)\)\) return null;/);
  assert.match(one, /if \(!isLicenseRow\(body\)\) throw notTheService\(res\.status, "a license row"\);/);
  const revoke = api.slice(api.indexOf("export async function revokeLicense"));
  assert.match(revoke, /if \(!isRevokeMiss\(body\)\) throw notTheService\(404, /);
  assert.match(api, /return new AdminApiError\(status, NOT_LICENSE_SERVICE\);/);
});

test("Minds test: the mind did not answer, and why, in plain words", () => {
  const cases = [
    [new Error("openai 401"), "key"],
    [new Error("anthropic 403"), "key"],
    [new Error("openrouter 429"), "busy"],
    [new Error("custom 404"), "address"],
    [new Error("gemini 503"), "server"],
    [Object.assign(new Error("The operation was aborted due to timeout"), { name: "TimeoutError" }), "timeout"],
    [Object.assign(new TypeError("fetch failed"), { cause: { code: "ECONNREFUSED", message: "connect ECONNREFUSED 127.0.0.1:11434" } }), "unreachable"],
    [Object.assign(new TypeError("fetch failed"), { cause: { code: "ENOTFOUND", message: "getaddrinfo ENOTFOUND api.nowhere.test" } }), "not_found"],
    [Object.assign(new TypeError("fetch failed"), { cause: { code: "CERT_HAS_EXPIRED" } }), "tls"],
    [new Error("https only"), "url"],
    [new Error("private host"), "url"],
    [new Error("empty"), "empty"],
    [new Error("mystery internals"), "unknown"],
  ];
  for (const [err, kind] of cases) {
    assert.equal(P.mindProblemKind(err), kind, String(err && err.message));
    const logged = [];
    const line = P.mindProblem(err, (l, e) => logged.push([l, e]));
    assert.equal(line, `The mind did not answer. ${P.MIND_LINES[kind]} House lines will.`);
    assert.equal(logged.length, 1, "raw error only in the log");
    assert.doesNotMatch(line, /ECONNREFUSED|ENOTFOUND|CERT_|openai|anthropic|127\.0\.0\.1|nowhere\.test/);
  }
  const page = src("src/routes/mind.tsx");
  assert.match(page, /\} catch \(err\) \{\n[^\n]*\n      setTestLine\(mindProblem\(err\)\);/);
  assert.doesNotMatch(page, /setTestLine\("The mind did not answer\. House lines will\."\)/);
});

test("deploy: VITE_LICENSE_API_URL and ADMIN_ALLOWED_ORIGINS are documented placeholders, no invented hosts", () => {
  const env = read(web, ".env.example");
  assert.match(env, /^VITE_LICENSE_API_URL=$/m, "empty placeholder, no value");
  assert.match(env, /ADMIN_ALLOWED_ORIGINS/);
  assert.doesNotMatch(env, /^[A-Z_]+=\S/m, "no filled-in values");
  assert.match(read(web, "README.md"), /VITE_LICENSE_API_URL/);
  const k8s = read(repo, "deploy/k8s/configmap.yaml");
  assert.match(k8s, /^  # ADMIN_ALLOWED_ORIGINS: "https:\/\/replace-with-your-web-site\.example"$/m, "commented placeholder only");
  assert.doesNotMatch(k8s, /^  ADMIN_ALLOWED_ORIGINS:/m, "not set live by this repo");
  const tf = read(repo, "deploy/terraform/configmap-managed.example.yaml");
  assert.match(tf, /^  # ADMIN_ALLOWED_ORIGINS: "https:\/\/replace-with-your-web-site\.example"$/m);
  // Closed by default (same-origin only); loopback pages in dev and compose; prod refuses "*".
  const compose = read(repo, "docker-compose.yml");
  assert.match(compose, /- ADMIN_ALLOWED_ORIGINS=\$\{ADMIN_ALLOWED_ORIGINS:-http:\/\/localhost:\[\*\],http:\/\/127\.0\.0\.1:\[\*\]\}/);
  assert.doesNotMatch(compose, /ADMIN_ALLOWED_ORIGINS:-\*/);
  assert.match(read(repo, "src/main/resources/application.yml"), /allowed-origins: "\$\{ADMIN_ALLOWED_ORIGINS:\}"/);
  assert.match(read(repo, "src/main/resources/application-dev.yml"), /allowed-origins: "\$\{ADMIN_ALLOWED_ORIGINS:http:\/\/localhost:\[\*\],/);
  const sec = read(repo, "src/main/java/com/enterprisepet/config/SecurityConfig.java");
  assert.match(sec, /admin\.setAllowedOriginPatterns\(adminOriginPatterns\(adminAllowedOrigins\)\);/);
  assert.match(sec, /@Value\("\$\{admin\.allowed-origins:\}"\) String adminAllowedOrigins/);
  assert.match(read(repo, "src/main/java/com/enterprisepet/config/ProductionProfileGuard.java"), /rejectAnyAdminOrigin\(\);/);
  const readme = read(repo, "deploy/k8s/README.md");
  assert.match(readme, /## Admin ledger from the web site/);
  assert.match(readme, /VITE_LICENSE_API_URL/);
  assert.match(readme, /ADMIN_ALLOWED_ORIGINS/);
});
