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
  assert.equal(K.HUD_WIDTH_COLLAPSED, 168);
  assert.equal(K.VOICE_TRUTH, "Rui, Soot, Wedge, Heart, Hook, Dee, Brick, Drake, Vee, Drum, Sip, Echo, Peck, Quill, Keel, Ember, Miso, Pip, Thimble, Clip, Whee, Ink, Coin, Rue, Wick, Burr, Floss, Bloom, Vesper, Nori, Saffron, Bandit, Jade, Bluff, Sash, Lula, Coral, Blush, Atlas, Cup, Sepia, Chamber, Pulse, Ochre, Tenant, Ledger, Anchor, Kite, Door, Felt, Vein, Fan, Mast, Disk, Moth, Arm, Snap, Well, Dew, Comb, Milk, Ghost, Spark, Dart, Twig, Column, Seven, Fold, Brood, Wax, Frill, Cap, Lattice, Horn, Ring, Mane, Puff, Flame, Starter, Pact, Gleam, Choir, Drift, Shard, Dusk, Knot, Brine, Beacon, Hush, Arca, Reed, Pebble, Eft, Dapple, Slip, Pinch, Whorl, Hinge, Latch, Prickle, Boot, Reach, Spot, Orb, Pane, Hold, Loom, and Leap talk with house cry first; system speech is the backup.");
  assert.equal(K.HEARTBEAT_URL, "http://127.0.0.1:8081/api/public/heartbeat");
  assert.equal(K.ADVERTISED_CARE.feed, "/pet/feed");
  assert.equal(K.ADVERTISED_CARE.play, "/pet/play");
  assert.equal(K.ADVERTISED_CARE.rest, "/pet/rest");
  assert.equal(K.CARE_DOOR_STATUS, 409);
  assert.equal(K.careDoorRefusal("feed").detail, "Care is local. /pet/feed is not a door.");
  assert.equal(K.careDoorRefusal("play").performed, false);
  assert.equal(K.careDoorRefusal("rest").status, 409);
  assert.equal(K.careTruth(), "Your pet's care stays on this computer.");
  assert.match(webKeeper, /CARE_DOOR_STATUS = 409/);
  assert.deepEqual(K.KEEPER_CARE.map((m) => m.id), ["feed", "snack", "play", "rest", "talk", "hide", "call", "clean", "bath", "medicine", "praise", "special", "shed"]);
  assert.match(webKeeper, /JAVA_PORT = 8081/);
  assert.match(webKeeper, /DESK_PORT = 8080/);
  assert.match(webKeeper, /HUD_WIDTH = 280/);
  assert.match(webKeeper, /\/api\/public\/heartbeat/);
  assert.match(cardSrc, /KeeperCard/);
  assert.match(roomSrc, /KeeperCard/);
  assert.match(demoSrc, /CompanionRoom/);
  assert.match(meetSrc, /MeetKeeperCard/);
});

test("an unread heartbeat is DOWN, not a painted UP; the card row says it in plain words", () => {
  assert.equal(K.parseHeartbeat(null).status, "DOWN");
  assert.equal(K.parseHeartbeat({}).status, "DOWN");
  assert.equal(K.parseHeartbeat({ status: "UP", profile: "local", uptimeSeconds: 90, port: 8081 }).status, "UP");
  assert.equal(K.heartbeatLine, undefined);
  assert.equal(K.houseServerLine({ show: false }), "");
  assert.equal(K.houseServerLine({ show: true, reachable: false }), "House server stopped answering (optional). Pets still work.");
  assert.equal(K.houseServerLine({ show: true, reachable: true, uptimeSeconds: 90 }), "House server running · up 1m");
  assert.equal(K.formatUptime(90), "1m");
  assert.equal(K.meters({ hunger: 40, energy: 70, bond: 50 }).bondTitle, "Friend");
});

test("the poster HUD is name, stage, bond title, meters, verbs, house-server row", () => {
  const face = K.poster("Rui", "grown", { hunger: 40, energy: 70, bond: 50 }, K.HOUSE_SERVER_HIDDEN);
  assert.equal(face.kicker, "Keeper card");
  assert.equal(face.name, "Rui");
  assert.equal(face.stage, "grown");
  assert.equal(face.bondTitle, "Friend");
  assert.equal(face.hunger, 40);
  assert.equal(face.rest, 70);
  assert.equal(face.bond, 50);
  assert.deepEqual(face.verbs, ["feed", "snack", "play", "rest", "talk", "hide", "call", "clean", "bath", "medicine", "praise", "special", "shed"]);
  assert.equal(face.heartbeat, "");
  assert.equal(K.poster("Rui", "grown", {}, { show: true, reachable: true }).heartbeat, "House server running");
  assert.equal(face.truth, "Your pet's care stays on this computer.");
  assert.equal(face.voiceTruth, K.VOICE_TRUTH);
  assert.match(face.quitTruth, /desktop\.ps1/);
});

test("the overlay HUD is a keeper card with full care verbs and a heartbeat", () => {
  assert.match(htmlSrc, /id="hud"/);
  assert.match(htmlSrc, /class="keeper-card"/);
  assert.match(htmlSrc, /id="hud-stage"/);
  assert.match(htmlSrc, /id="hud-bond-title"/);
  assert.doesNotMatch(htmlSrc, /id="hud"[^>]*data-hit/);
  for (const id of K.KEEPER_CARE.map((m) => m.id)) {
    assert.match(htmlSrc, new RegExp(`data-care="${id}"`));
  }
  assert.match(htmlSrc, /data-care="snack">Treat</);
  assert.match(htmlSrc, /data-care="call">Call back</);
  assert.match(htmlSrc, /id="hud-heartbeat"/);
  assert.match(htmlSrc, /id="hud-bond"/);
  assert.match(htmlSrc, /keeper\.js/);
  assert.match(htmlSrc, /card\.js/);
  assert.match(htmlSrc, /data-card="collapse"/);
  assert.match(petSrc, /PetKeeper/);
  assert.match(petSrc, /houseServerLine/);
  assert.doesNotMatch(petSrc, /HEARTBEAT_URL/);
  assert.match(petSrc, /data-care/);
  assert.match(petSrc, /hudStage/);
  assert.match(petSrc, /hudBondTitle/);
  assert.match(petSrc, /if \(id\) handle\(id\)/);
  // A saved station is not streaming until Play or a pick asks for it (#1404), so the label follows audible, not music.playing.
  assert.match(petSrc, /const audible = !!\(music\.playing && music\.plugin !== "off" && \(!remoteStream \|\| streamAsked\)\)/);
  assert.match(petSrc, /play\.textContent = audible \? "Pause" : "Play"/);
  assert.doesNotMatch(petSrc, /play\.textContent = music\.playing \?/);
  assert.match(petSrc, /play\.hidden = music\.plugin === "off"/);
  assert.doesNotMatch(petSrc, /music\.playing \? "Stop"/);
  assert.doesNotMatch(petSrc, /audible \? "Stop"/);
  assert.doesNotMatch(petSrc, /\/pet\/feed/);
  assert.match(styleSrc, /#hud-care button/);
  assert.match(styleSrc, /#hud-care,[\s\S]*flex-wrap:\s*wrap/);
  assert.match(styleSrc, /width: 280px/);
  assert.match(styleSrc, /pointer-events: auto/);
  assert.match(cardSrc, /data-keeper-poster/);
  assert.doesNotMatch(cardSrc, /paper-card/);
});
