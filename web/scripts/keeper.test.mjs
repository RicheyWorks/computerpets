import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const K = await import(join(root, "src/lib/pets/keeper.ts"));
const Living = await import(join(root, "src/lib/pets/living.ts"));

const cardSrc = readFileSync(join(root, "src/components/desk/keeper-card.tsx"), "utf8");
const roomSrc = readFileSync(join(root, "src/components/desk/companion-room.tsx"), "utf8");
const demoSrc = readFileSync(join(root, "src/components/desk/demo-stage.tsx"), "utf8");
const deskSrc = readFileSync(join(root, "src/components/desk/desk-stage.tsx"), "utf8");
const liveSrc = readFileSync(join(root, "src/components/desk/live-stage.tsx"), "utf8");
const meetSrc = readFileSync(join(root, "src/routes/meet.tsx"), "utf8");
const overlayHtml = readFileSync(join(root, "../desktop/renderer/index.html"), "utf8");
const overlayKeeper = readFileSync(join(root, "../desktop/renderer/keeper.js"), "utf8");
const javaSrc = readFileSync(join(root, "../src/main/java/com/enterprisepet/controller/HeartbeatController.java"), "utf8");

test("Java is 8081, the desk is 8080, and /pet/feed is not a door", () => {
  assert.equal(K.JAVA_PORT, 8081);
  assert.equal(K.DESK_PORT, 8080);
  assert.equal(K.HEARTBEAT_URL, "http://127.0.0.1:8081/api/public/heartbeat");
  assert.equal(K.ADVERTISED_CARE.feed, "/pet/feed");
  assert.equal(K.careTruth(), "Care is local. /pet/feed is not a door.");
  assert.match(javaSrc, /\/api\/public/);
  assert.match(javaSrc, /\/heartbeat/);
  assert.match(javaSrc, /uptimeSeconds/);
  assert.doesNotMatch(javaSrc, /\/pet\/feed/);
  assert.match(overlayKeeper, /127\.0\.0\.1:8081\/api\/public\/heartbeat/);
});

test("unread heartbeat stays DOWN; a live door can be UP", () => {
  assert.equal(K.parseHeartbeat(null).status, "DOWN");
  assert.equal(K.parseHeartbeat({ status: "UP", profile: "local", uptimeSeconds: 125, port: 8081 }).status, "UP");
  assert.match(K.heartbeatLine(K.UNREAD_HEARTBEAT), /Java 8081 · DOWN · unread · unread/);
  assert.equal(K.formatUptime(125), "2m");
  assert.equal(K.keeperMeters({ hunger: 12, energy: 80, bond: 80 }).bondTitle, "Devoted");
});

test("the same keeper card sits desk, /demo, Live, Meet, and the Windows overlay", () => {
  assert.match(roomSrc, /KeeperCard/);
  assert.match(demoSrc, /CompanionRoom/);
  assert.match(deskSrc, /CompanionRoom/);
  assert.match(liveSrc, /CompanionRoom/);
  assert.match(meetSrc, /KeeperHeartbeat/);
  assert.match(cardSrc, /aria-label="Keeper card"/);
  assert.match(cardSrc, /onFeed/);
  assert.match(cardSrc, /onPlay/);
  assert.match(cardSrc, /onRest/);
  assert.match(overlayHtml, /data-care="feed"/);
  assert.match(overlayHtml, /id="hud-heartbeat"/);
  assert.doesNotMatch(cardSrc, /POST \/pet\/feed/);
});

test("the grid ten keep /demo slugs, and Spark is crackle", () => {
  assert.equal(K.GRID_LIVE.length, 10);
  for (const guest of K.GRID_LIVE) {
    const kind = Living.livingBySlug(guest.slug);
    assert.ok(kind, guest.slug);
    assert.equal(kind.key, guest.key);
    assert.equal(kind.name, guest.name);
    assert.equal(kind.slug, guest.slug);
  }
  assert.equal(Living.livingBySlug("spark")?.key, "firefly");
  assert.equal(Living.livingBySlug("crackle")?.key, "spark_dragon");
  assert.equal(Living.livingByKey("spark_dragon").slug, "crackle");
});
