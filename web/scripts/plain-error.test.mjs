import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = (rel) => readFileSync(join(root, rel), "utf8");
const { HouseError, PLAIN_LINES, UNKNOWN_LINE, classify, isHouseError, plainMessage, toHouseError } = await import(
  pathToFileURL(join(root, "src/lib/plain-error.ts")).href
);

/** Raw tokens that must never reach a keeper's screen. */
const RAW = [
  /ECONNREFUSED/,
  /ECONNRESET/,
  /ENOTFOUND/,
  /ETIMEDOUT/,
  /getaddrinfo/i,
  /fetch failed/i,
  /failed to fetch/i,
  /relation "/,
  /\b42P01\b/,
  /\b23505\b/,
  /\b57P01\b/,
  /duplicate key/i,
  /CERT_/,
  /UND_ERR/,
  /Internal Server Error/i,
  /Too Many Requests/i,
  /"code"\s*:/,
  /pglite/i,
];

function quiet() {
  const logged = [];
  return { logged, log: (label, err) => logged.push([label, err]) };
}

function pgError(code, message, severity = "ERROR") {
  const e = new Error(message);
  Object.assign(e, { code, severity, routine: "parserOpenTable" });
  return e;
}

function undiciFetchFailed(code) {
  const cause = new Error(`connect ${code} 127.0.0.1:5432`);
  cause.code = code;
  return new TypeError("fetch failed", { cause });
}

function httpError(status, message) {
  const e = new Error(message);
  e.status = status;
  return e;
}

const CASES = [
  ["undici ECONNREFUSED", undiciFetchFailed("ECONNREFUSED"), "unreachable"],
  ["browser Failed to fetch", new TypeError("Failed to fetch"), "unreachable"],
  ["socket reset", undiciFetchFailed("ECONNRESET"), "unreachable"],
  ["DNS miss", undiciFetchFailed("ENOTFOUND"), "not_found"],
  ["getaddrinfo", new Error("getaddrinfo EAI_AGAIN db.neon.tech"), "not_found"],
  ["connect timeout", undiciFetchFailed("ETIMEDOUT"), "timeout"],
  ["abort", Object.assign(new Error("This operation was aborted"), { name: "AbortError" }), "timeout"],
  ["timeout name", Object.assign(new Error("signal timed out"), { name: "TimeoutError" }), "timeout"],
  ["TLS", Object.assign(new Error("unable to verify the first certificate"), { code: "UNABLE_TO_VERIFY_LEAF_SIGNATURE" }), "tls"],
  ["TLS cert expired", Object.assign(new Error("certificate has expired"), { code: "CERT_HAS_EXPIRED" }), "tls"],
  ["pg missing table", pgError("42P01", 'relation "pets" does not exist'), "database"],
  ["pg duplicate key", pgError("23505", 'duplicate key value violates unique constraint "pets_pkey"'), "database"],
  ["pg admin shutdown", pgError("57P01", "terminating connection due to administrator command", "FATAL"), "database"],
  ["plain pg object", { code: "42P01", severity: "ERROR", message: 'relation "pets" does not exist' }, "database"],
  ["neon message only", new Error('password authentication failed for user "neondb_owner"'), "database"],
  ["429 status", httpError(429, "Too Many Requests"), "busy"],
  ["429 text", new Error("HTTP 429 rate limit"), "busy"],
  ["503 status", httpError(503, "Service Unavailable"), "server"],
  ["500 status", httpError(500, "Internal Server Error"), "server"],
  ["502 text", new Error("anthropic 502"), "server"],
  ["signed out", Object.assign(new Error("Unauthorized"), { name: "UnauthorizedError" }), "signin"],
  ["cross-site", Object.assign(new Error("Forbidden: cross-site request"), { name: "CrossSiteRequestError" }), "blocked"],
  ["zod dump", Object.assign(new Error('[{"code":"too_small","path":["key"]}]'), { name: "ZodError", issues: [{}] }), "invalid"],
];

for (const [label, err, kind] of CASES) {
  test(`plain-error: ${label} maps to its one sentence`, () => {
    const { logged, log } = quiet();
    assert.equal(classify(err), kind);
    const line = plainMessage(err, "The draw failed.", log);
    assert.equal(line, PLAIN_LINES[kind]);
    for (const raw of RAW) assert.doesNotMatch(line, raw, `${label} leaked ${raw}`);
    assert.equal(logged.length, 1, "the raw error is logged once");
    assert.equal(logged[0][1], err, "the log gets the raw error itself");
  });
}

test("plain-error: every plain sentence is one clean line", () => {
  for (const line of [...Object.values(PLAIN_LINES), UNKNOWN_LINE]) {
    assert.match(line, /^[A-Z][^\n]*[.!]$/);
    assert.ok(line.length <= 90, line);
    for (const raw of RAW) assert.doesNotMatch(line, raw);
  }
});

test("plain-error: an unrecognized error falls back to the surface's own line", () => {
  const { logged, log } = quiet();
  assert.equal(plainMessage(new Error("kaboom 0xdeadbeef"), "The nest refused.", log), "The nest refused.");
  assert.equal(plainMessage("weird", "", log), UNKNOWN_LINE);
  assert.equal(plainMessage(undefined, undefined, log), UNKNOWN_LINE);
  assert.equal(logged.length, 3);
});

test("plain-error: the house's own lines pass through unchanged", () => {
  const { logged, log } = quiet();
  const lines = [
    "Need 40 ember to hatch a rare companion.",
    "The first guest is not in this house.",
    "Pair two, or let a starter split. Not one guest twice.",
    "Companion not found.",
  ];
  for (const line of lines) {
    const err = new HouseError(line);
    assert.equal(err.name, "HouseError");
    assert.equal(err.house, true);
    assert.ok(err instanceof Error);
    assert.ok(isHouseError(err));
    assert.equal(plainMessage(err, "fallback", log), line);
    // After the server-function wire (seroval keeps name + own props, not the prototype).
    const wire = { name: "HouseError", house: true, message: line, stack: "" };
    assert.equal(plainMessage(wire, "fallback", log), line);
  }
  // A house line that happens to mention a status code is still the house's line.
  assert.equal(plainMessage(new HouseError("Need 500 ember for the long nest."), "x", log), "Need 500 ember for the long nest.");
  assert.equal(logged.length, 0, "house lines are not logged as failures");
});

test("plain-error: an empty house marker does not pass through", () => {
  const { log } = quiet();
  assert.equal(isHouseError({ name: "HouseError", house: true, message: "" }), false);
  assert.equal(plainMessage({ house: true, message: "" }, "Care failed.", log), "Care failed.");
});

test("plain-error: toHouseError carries only the plain line across the wire", () => {
  const { logged, log } = quiet();
  const raw = pgError("42P01", 'relation "pets" does not exist');
  const out = toHouseError(raw, PLAIN_LINES.database, log);
  assert.ok(out instanceof HouseError);
  assert.equal(out.message, PLAIN_LINES.database);
  assert.equal(out.cause, undefined, "no cause crosses the wire");
  assert.equal(out.code, undefined, "no pg code crosses the wire");
  const own = JSON.stringify(Object.getOwnPropertyNames(out).map((k) => out[k]));
  for (const token of RAW) assert.doesNotMatch(own, token);
  assert.equal(logged.length, 1);
  assert.equal(logged[0][1], raw);
  const house = new HouseError("Companion not found.");
  assert.equal(toHouseError(house, "x", log), house);
  assert.equal(toHouseError(new Error("mystery"), PLAIN_LINES.database, log).message, PLAIN_LINES.database);
});

const SURFACES = [
  ["src/routes/pets.$key.tsx", 'plainMessage(err, "Care failed.")'],
  ["src/routes/hatch.tsx", 'plainMessage(err, "The draw failed.")'],
  ["src/routes/nest.tsx", 'plainMessage(err, "The nest refused.")'],
  ["src/routes/admin.tsx", "plainMessage(err, fallback)"],
  ["src/lib/error-component.tsx", "plainMessage(error, "],
];

for (const [rel, call] of SURFACES) {
  test(`plain-error: ${rel} renders errors only through plainMessage`, () => {
    const text = src(rel);
    assert.match(text, /import \{ plainMessage \} from "@\/lib\/plain-error";/);
    assert.ok(text.includes(call), `${rel} should call ${call}`);
    assert.doesNotMatch(text, /\berr(or)?\.message\b/, `${rel} still renders a raw message`);
    assert.doesNotMatch(text, /err instanceof Error \? err\.message/);
  });
}

test("plain-error: admin raw detail sits behind a Details toggle, never the default", () => {
  const text = src("src/routes/admin.tsx");
  assert.match(text, /<details[^>]*>\s*<summary[^>]*>Details<\/summary>/);
  assert.match(text, /err instanceof AdminApiError && err\.detail/);
  assert.equal((text.match(/<Note note=\{note\} detail=\{detail\} \/>/g) ?? []).length, 2);
  assert.doesNotMatch(text, /\{note\}\s*<\/p>\s*:\s*null/);
  const api = src("src/lib/admin/api.ts");
  assert.match(api, /class AdminApiError extends HouseError/);
  assert.match(api, /Cannot reach the license service\. Check the API URL\./);
  assert.match(api, /status === 429\) return PLAIN_LINES\.busy/);
  assert.match(api, /status >= 500\) return `The license service had a problem \(error \$\{status\}\)\. Try again later\.`/);
  assert.doesNotMatch(api, /readError/, "service body text is detail, not the message");
});

test("plain-error: the house's deliberate server lines are HouseErrors", () => {
  const text = src("src/lib/pets/actions.ts");
  assert.match(text, /import \{ HouseError \} from "@\/lib\/plain-error";/);
  assert.doesNotMatch(text, /throw new Error\(/);
  assert.ok((text.match(/throw new HouseError\(/g) ?? []).length >= 11);
  assert.match(text, /throw new HouseError\(`Need \$\{cost\} ember to hatch/);
});

test("plain-error: db.ts logs raw database errors and hands back the plain line", () => {
  const text = src("src/lib/db.ts");
  assert.match(text, /import \{ PLAIN_LINES, toHouseError \} from "\.\/plain-error";/);
  assert.match(text, /toHouseError\(err, PLAIN_LINES\.database/);
  assert.match(text, /console\.error\(`\[db\] \$\{stage\} failed:`, raw\)/);
  assert.match(text, /throw plainDbError\("query", err\)/);
  assert.match(text, /throw plainDbError\("open", err\)/);
});