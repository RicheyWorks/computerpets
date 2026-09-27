import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const K = await import(pathToFileURL(join(root, "src/lib/pets/keeper.ts")).href);

const cardSrc = readFileSync(join(root, "src/components/desk/keeper-card.tsx"), "utf8");
const styleSrc = readFileSync(join(root, "src/styles.css"), "utf8");
const gridSrc = readFileSync(join(root, "src/lib/pets/grid.ts"), "utf8");
const insectsSrc = readFileSync(join(root, "src/lib/pets/insects.ts"), "utf8");
const demoPageSrc = readFileSync(join(root, "src/routes/demo.$slug.tsx"), "utf8");
const roomSrc = readFileSync(join(root, "src/components/desk/companion-room.tsx"), "utf8");
const demoSrc = readFileSync(join(root, "src/components/desk/demo-stage.tsx"), "utf8");
const deskSrc = readFileSync(join(root, "src/components/desk/desk-stage.tsx"), "utf8");
const liveSrc = readFileSync(join(root, "src/components/desk/live-stage.tsx"), "utf8");
const meetSrc = readFileSync(join(root, "src/routes/meet.tsx"), "utf8");
const overlayHtml = readFileSync(join(root, "../desktop/renderer/index.html"), "utf8");
const overlayKeeper = readFileSync(join(root, "../desktop/renderer/keeper.js"), "utf8");
const overlayStyle = readFileSync(join(root, "../desktop/renderer/styles.css"), "utf8");
const overlayPet = readFileSync(join(root, "../desktop/renderer/pet.js"), "utf8");
const javaSrc = readFileSync(join(root, "../src/main/java/com/enterprisepet/controller/HeartbeatController.java"), "utf8");

test("Java is 8081, the desk is 8080, and /pet/feed is not a door", () => {
  assert.equal(K.JAVA_PORT, 8081);
  assert.equal(K.DESK_PORT, 8080);
  assert.equal(K.HUD_WIDTH, 280);
  assert.equal(K.HUD_WIDTH_COLLAPSED, 168);
  const overlayVoice = overlayKeeper.match(/const VOICE_TRUTH = "([^"]+)"/);
  assert.ok(overlayVoice);
  assert.equal(K.VOICE_TRUTH, overlayVoice[1]);
  assert.equal(K.HEARTBEAT_URL, "http://127.0.0.1:8081/api/public/heartbeat");
  assert.equal(K.ADVERTISED_CARE.feed, "/pet/feed");
  assert.equal(K.ADVERTISED_CARE.play, "/pet/play");
  assert.equal(K.ADVERTISED_CARE.rest, "/pet/rest");
  assert.equal(K.CARE_DOOR_STATUS, 409);
  assert.equal(K.careDoorRefusal("feed").performed, false);
  assert.equal(K.careDoorRefusal("feed").detail, "Care is local. /pet/feed is not a door.");
  assert.equal(K.careDoorRefusal("play").verb, "play");
  assert.equal(K.careDoorRefusal("rest").status, 409);
  assert.equal(K.careTruth(), "Care is local. /pet/feed is not a door.");
  assert.match(overlayKeeper, /CARE_DOOR_STATUS = 409/);
  assert.match(overlayKeeper, /careDoorRefusal/);
  assert.match(javaSrc, /\/api\/public/);
  assert.match(javaSrc, /\/heartbeat/);
  assert.match(javaSrc, /uptimeSeconds/);
  assert.doesNotMatch(javaSrc, /GetMapping\("\/pet\/feed"\)/);
  assert.match(javaSrc, /care\.put\("feed", false\)/);
  assert.match(overlayKeeper, /127\.0\.0\.1:8081\/api\/public\/heartbeat/);
  assert.match(overlayKeeper, /HUD_WIDTH = 280/);
});

test("unread heartbeat stays DOWN; a live door can be UP", () => {
  assert.equal(K.parseHeartbeat(null).status, "DOWN");
  assert.equal(K.parseHeartbeat({ status: "UP", profile: "local", uptimeSeconds: 125, port: 8081 }).status, "UP");
  assert.match(K.heartbeatLine(K.UNREAD_HEARTBEAT), /Java 8081 · DOWN · unread · unread/);
  assert.equal(K.formatUptime(125), "2m");
  assert.equal(K.keeperMeters({ hunger: 12, energy: 80, bond: 80 }).bondTitle, "Devoted");
});

test("the poster face is name, stage, bond title, meters, verbs, heartbeat", () => {
  const face = K.keeperPoster("Rui", "grown", { hunger: 40, energy: 70, bond: 50 }, K.UNREAD_HEARTBEAT);
  assert.equal(face.kicker, "Keeper card");
  assert.equal(face.name, "Rui");
  assert.equal(face.stage, "grown");
  assert.equal(face.bondTitle, "Friend");
  assert.equal(face.hunger, 40);
  assert.equal(face.rest, 70);
  assert.equal(face.bond, 50);
  assert.deepEqual(face.verbs, K.KEEPER_CARE.map((verb) => verb.id));
  assert.ok(face.verbs.includes("feed"));
  assert.ok(face.verbs.includes("play"));
  assert.ok(face.verbs.includes("rest"));
  assert.match(face.heartbeat, /Java 8081 · DOWN/);
  assert.equal(face.truth, K.careTruth());
  assert.equal(face.voiceTruth, K.VOICE_TRUTH);
  assert.match(face.quitTruth, /desktop\.ps1/);
});

test("the same poster keeper card sits desk, /demo, Live, Meet, and the Windows overlay", () => {
  assert.match(roomSrc, /KeeperCard/);
  assert.match(demoSrc, /CompanionRoom/);
  assert.match(demoSrc, /WindowsDeskSit/);
  assert.match(deskSrc, /CompanionRoom/);
  assert.match(liveSrc, /CompanionRoom/);
  assert.match(meetSrc, /MeetKeeperCard/);
  assert.match(cardSrc, /export function MeetKeeperCard/);
  assert.match(cardSrc, /RED_PANDA_KIND/);
  assert.match(cardSrc, /aria-label="Keeper card"/);
  assert.match(cardSrc, /data-keeper-poster/);
  assert.match(cardSrc, /keeper-name/);
  assert.match(cardSrc, /keeper-stage/);
  assert.match(cardSrc, /keeper-bond-title/);
  assert.match(cardSrc, /data-care=\{verb\.id\}/);
  assert.match(cardSrc, /data-card="collapse"/);
  assert.match(cardSrc, /onFeed/);
  assert.match(cardSrc, /onPlay/);
  assert.match(cardSrc, /onRest/);
  assert.doesNotMatch(cardSrc, /paper-card/);
  assert.doesNotMatch(cardSrc, /BlotterCare/);
  assert.match(overlayHtml, /class="keeper-card"/);
  assert.match(overlayHtml, /id="hud-stage"/);
  assert.match(overlayHtml, /id="hud-bond-title"/);
  assert.match(overlayHtml, /data-care="feed"/);
  assert.match(overlayHtml, /id="hud-heartbeat"/);
  assert.doesNotMatch(overlayHtml, /id="hud"[^>]*data-hit/);
  assert.match(overlayPet, /hudStage/);
  assert.match(overlayPet, /hudBondTitle/);
  assert.match(overlayStyle, /width: 280px/);
  assert.match(styleSrc, /\.keeper-card \{/);
  assert.match(styleSrc, /\.keeper-bond-title/);
  assert.doesNotMatch(cardSrc, /POST \/pet\/feed/);
});

test("the grid ten keep /demo slugs, and Spark is crackle", () => {
  assert.equal(K.GRID_LIVE.length, 10);
  for (const guest of K.GRID_LIVE) {
    assert.match(gridSrc, new RegExp(`key: "${guest.key}"`));
    assert.match(gridSrc, new RegExp(`slug: "${guest.slug}"`));
    assert.match(gridSrc, new RegExp(`name: "${guest.name}"`));
  }
  assert.match(demoPageSrc, /livingBySlug/);
  assert.match(insectsSrc, /slug: "spark"/);
  assert.match(gridSrc, /slug: "crackle"/);
  assert.doesNotMatch(gridSrc, /slug: "spark"/);
});

