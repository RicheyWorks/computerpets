const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const K = require("./keeper.js");

const htmlSrc = readFileSync(join(__dirname, "index.html"), "utf8");
const petSrc = readFileSync(join(__dirname, "pet.js"), "utf8");
const styleSrc = readFileSync(join(__dirname, "styles.css"), "utf8");
const webKeeper = readFileSync(join(__dirname, "..", "..", "web", "src", "lib", "pets", "keeper.ts"), "utf8");
const cardSrc = readFileSync(join(__dirname, "..", "..", "web", "src", "components", "desk", "keeper-card.tsx"), "utf8");
const roomSrc = readFileSync(join(__dirname, "..", "..", "web", "src", "components", "desk", "companion-room.tsx"), "utf8");
const demoSrc = readFileSync(join(__dirname, "..", "..", "web", "src", "components", "desk", "demo-stage.tsx"), "utf8");
const meetSrc = readFileSync(join(__dirname, "..", "..", "web", "src", "routes", "meet.tsx"), "utf8");

test("the overlay keeper card tells the same truth as the desk", () => {
  assert.equal(K.JAVA_PORT, 8081);
  assert.equal(K.DESK_PORT, 8080);
  assert.equal(K.HUD_WIDTH, 280);
  assert.equal(K.HEARTBEAT_URL, "http://127.0.0.1:8081/api/public/heartbeat");
  assert.equal(K.ADVERTISED_CARE.feed, "/pet/feed");
  assert.equal(K.careTruth(), "Care is local. /pet/feed is not a door.");
  assert.deepEqual(K.KEEPER_CARE.map((m) => m.id), ["feed", "play", "rest"]);
  assert.match(webKeeper, /JAVA_PORT = 8081/);
  assert.match(webKeeper, /DESK_PORT = 8080/);
  assert.match(webKeeper, /HUD_WIDTH = 280/);
  assert.match(webKeeper, /\/api\/public\/heartbeat/);
  assert.match(cardSrc, /KeeperCard/);
  assert.match(roomSrc, /KeeperCard/);
  assert.match(demoSrc, /CompanionRoom/);
  assert.match(meetSrc, /MeetKeeperCard/);
});

test("unread Java is DOWN, not a painted UP", () => {
  assert.equal(K.parseHeartbeat(null).status, "DOWN");
  assert.equal(K.parseHeartbeat({}).status, "DOWN");
  assert.equal(K.parseHeartbeat({ status: "UP", profile: "local", uptimeSeconds: 90, port: 8081 }).status, "UP");
  assert.match(K.heartbeatLine(K.UNREAD), /Java 8081 · DOWN · unread · unread/);
  assert.equal(K.formatUptime(90), "1m");
  assert.equal(K.meters({ hunger: 40, energy: 70, bond: 50 }).bondTitle, "Friend");
});

test("the poster HUD is name, stage, bond title, meters, verbs, heartbeat", () => {
  const face = K.poster("Rui", "grown", { hunger: 40, energy: 70, bond: 50 }, K.UNREAD);
  assert.equal(face.kicker, "Keeper card");
  assert.equal(face.name, "Rui");
  assert.equal(face.stage, "grown");
  assert.equal(face.bondTitle, "Friend");
  assert.equal(face.hunger, 40);
  assert.equal(face.rest, 70);
  assert.equal(face.bond, 50);
  assert.deepEqual(face.verbs, ["feed", "play", "rest"]);
  assert.match(face.heartbeat, /Java 8081 · DOWN/);
  assert.match(face.truth, /Care is local/);
});

test("the overlay HUD is a keeper card with feed / play / rest and a heartbeat", () => {
  assert.match(htmlSrc, /id="hud"/);
  assert.match(htmlSrc, /class="keeper-card"/);
  assert.match(htmlSrc, /id="hud-stage"/);
  assert.match(htmlSrc, /id="hud-bond-title"/);
  assert.doesNotMatch(htmlSrc, /id="hud"[^>]*data-hit/);
  assert.match(htmlSrc, /data-care="feed"/);
  assert.match(htmlSrc, /data-care="play"/);
  assert.match(htmlSrc, /data-care="rest"/);
  assert.match(htmlSrc, /id="hud-heartbeat"/);
  assert.match(htmlSrc, /id="hud-bond"/);
  assert.match(htmlSrc, /keeper\.js/);
  assert.match(petSrc, /PetKeeper/);
  assert.match(petSrc, /HEARTBEAT_URL/);
  assert.match(petSrc, /data-care/);
  assert.match(petSrc, /hudStage/);
  assert.match(petSrc, /hudBondTitle/);
  assert.match(petSrc, /handle\("feed"\)|handle\(id\)/);
  assert.doesNotMatch(petSrc, /\/pet\/feed/);
  assert.match(styleSrc, /#hud-care button/);
  assert.match(styleSrc, /width: 280px/);
  assert.match(styleSrc, /pointer-events: auto/);
  assert.match(cardSrc, /data-keeper-poster/);
  assert.doesNotMatch(cardSrc, /paper-card/);
});
