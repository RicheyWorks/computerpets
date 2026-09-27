import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const repo = join(root, "..");
const rootSrc = readFileSync(join(root, "src/routes/__root.tsx"), "utf8");
const cssSrc = readFileSync(join(root, "src/styles.css"), "utf8");
const ogSrc = readFileSync(join(root, "scripts/og-card.html"), "utf8");
const catalogSrc = readFileSync(join(root, "src/lib/pets/catalog.ts"), "utf8");
const keeperSrc = readFileSync(join(root, "src/lib/pets/keeper.ts"), "utf8");
const cardSrc = readFileSync(join(root, "src/components/desk/keeper-card.tsx"), "utf8");
const overlayKeeper = readFileSync(join(repo, "desktop/renderer/keeper.js"), "utf8");
const overlayPet = readFileSync(join(repo, "desktop/renderer/pet.js"), "utf8");
const overlayCss = readFileSync(join(repo, "desktop/renderer/styles.css"), "utf8");
const overlayHtml = readFileSync(join(repo, "desktop/renderer/index.html"), "utf8");

const FONT_HOST = /fonts\.googleapis\.com|fonts\.gstatic\.com/;

test("opening the house does not request a font host", () => {
  assert.doesNotMatch(rootSrc, FONT_HOST);
  assert.doesNotMatch(cssSrc, FONT_HOST);
  assert.doesNotMatch(ogSrc, FONT_HOST);
  assert.doesNotMatch(overlayCss, FONT_HOST);
  assert.doesNotMatch(overlayHtml, FONT_HOST);
  assert.match(cssSrc, /Iowan Old Style/);
  assert.match(cssSrc, /Segoe UI/);
  assert.match(cssSrc, /ui-monospace/);
  assert.match(cssSrc, /The house does not download a font/);
  assert.match(ogSrc, /Segoe UI/);
  assert.match(ogSrc, /Iowan Old Style/);
});

test("the desk heartbeat URL is loopback with no config override; the overlay row probes only a server the keeper named", () => {
  assert.match(keeperSrc, /HEARTBEAT_URL = `http:\/\/127\.0\.0\.1:\$\{JAVA_PORT\}\/api\/public\/heartbeat`/);
  assert.doesNotMatch(keeperSrc, /COMPUTERPETS_BACKEND_URL|process\.env|import\.meta\.env/);
  assert.match(keeperSrc, /const url = opts\.url \?\? HEARTBEAT_URL;/);
  assert.match(keeperSrc, /fetchImpl\(url, \{ cache: "no-store" \}\)/);
  assert.match(cardSrc, /heartbeatPoll\.subscribe\(setBeat\)/);
  assert.match(overlayKeeper, /HEARTBEAT_URL = "http:\/\/127\.0\.0\.1:8081\/api\/public\/heartbeat"/);
  assert.doesNotMatch(overlayKeeper, /COMPUTERPETS_BACKEND_URL|process\.env/);
  assert.doesNotMatch(overlayPet, /fetch\(/);
  assert.match(overlayPet, /setInterval\(readHouseServer, 15_000\)/);
  const keys = [...catalogSrc.matchAll(/\{ key: "([a-z0-9_]+)"/g)].map((m) => m[1]);
  assert.equal(keys.length, 221);
});
