import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const C = await import(join(root, "src/lib/pets/card.ts"));
const Care = await import(join(root, "src/lib/pets/care.ts"));
const K = await import(join(root, "src/lib/pets/keeper.ts"));

const cardSrc = readFileSync(join(root, "src/components/desk/keeper-card.tsx"), "utf8");
const livingSrc = readFileSync(join(root, "src/components/desk/living-pet.tsx"), "utf8");
const roomSrc = readFileSync(join(root, "src/components/desk/companion-room.tsx"), "utf8");
const overlayCard = readFileSync(join(root, "../desktop/renderer/card.js"), "utf8");
const overlayPet = readFileSync(join(root, "../desktop/renderer/pet.js"), "utf8");
const overlayHtml = readFileSync(join(root, "../desktop/renderer/index.html"), "utf8");
const overlayLife = readFileSync(join(root, "../desktop/renderer/life.js"), "utf8");
const styleSrc = readFileSync(join(root, "src/styles.css"), "utf8");

test("the desk card law matches the overlay card", () => {
  assert.deepEqual(C.CARD_COLORS.map((c) => c.id), ["ink", "blotter", "moss", "ember", "dusk", "frost"]);
  assert.deepEqual(C.VOICE_STYLES.map((s) => s.id), ["hearth", "hush", "even", "low", "bright"]);
  assert.deepEqual([...C.MUTE_BUSES], ["talk", "special", "weather", "treats", "steps", "music"]);
  assert.equal(C.VOICE_TRUTH, "Rui, Soot, Wedge, Heart, Hook, Dee, Brick, Drake, Vee, Drum, Sip, Echo, Peck, Quill, Keel, Ember, Miso, Pip, Thimble, Clip, Whee, Ink, Coin, Rue, Wick, Burr, Floss, Bloom, Vesper, Nori, Saffron, Bandit, Jade, Bluff, Sash, Lula, Coral, Blush, Atlas, Cup, Sepia, and Chamber talk with house cry first; system speech is the backup.");
  assert.equal(K.VOICE_TRUTH, C.VOICE_TRUTH);
  assert.match(K.QUIT_TRUTH, /desktop\.ps1/);
  assert.equal(C.busOf("chirp"), "talk");
  assert.equal(C.isMuted({ talk: true }, "chirp"), true);
  assert.match(overlayCard, /VOICE_TRUTH/);
  assert.match(overlayHtml, /data-card="collapse"/);
  assert.match(cardSrc, /data-card="collapse"/);
  assert.match(cardSrc, /if \(card\.collapsed && !stayOpen\) return null/);
  assert.match(styleSrc, /\.keeper-card\[data-collapsed="1"\][\s\S]*display:\s*none/);
  assert.match(overlayPet, /openKeeperCard/);
  assert.match(cardSrc, /Save say/);
  assert.match(cardSrc, /Turn off/);
});

test("an asleep guest keeps sleep on the wander tick", () => {
  assert.deepEqual(C.wanderWhileAsleep(true), { cmd: "sleep", pose: "sleep" });
  assert.equal(C.wanderWhileAsleep(false), null);
  assert.equal(C.sleepHolds(true, "wander"), false);
  assert.equal(C.sleepHolds(true, "sit"), true);
  assert.equal(C.sleepHolds(true, "idle"), true);
  assert.equal(C.sleepHolds(true, "talk"), false);
  const rested = Care.applyRest({ energy: 40, hunger: 70 });
  assert.equal(rested.asleep, true);
  const day = Care.decayStats(rested, Date.now(), Date.now() + 20_000, false);
  assert.equal(day.asleep, true);
  assert.deepEqual(C.wanderWhileAsleep(day.asleep), { cmd: "sleep", pose: "sleep" });
  const woke = Care.applyCall(day);
  assert.equal(woke.asleep, false);
  assert.match(livingSrc, /asleepRef\.current/);
  assert.match(roomSrc, /wanderWhileAsleep/);
  assert.match(overlayPet, /wanderWhileAsleep/);
  assert.match(overlayLife, /sleepHeld/);
});

test("saved lines, alarm, and timer are machine-local", () => {
  let card = C.addLine(C.blankCard(), "red_panda", "A ribbon I was keeping.", "say");
  assert.equal(C.guestOf(card, "red_panda").lines[0].text, "A ribbon I was keeping.");
  const noon = new Date(2026, 7, 27, 7, 0, 5).getTime();
  assert.equal(C.alarmDue({ on: true, hour: 7, minute: 0, lastRingDay: "" }, noon), true);
  const started = C.startTimer(C.blankTimer(), 4000, 1000);
  assert.equal(C.timerTick(started, 5000).rang, true);
  const voices = [
    { name: "Zarvox" },
    { name: "Microsoft David Desktop" },
    { name: "Microsoft Aria Online (Natural)" },
    { name: "Microsoft Zira Compact" },
  ];
  assert.equal(C.pickSystemVoice(voices, "hearth")?.name, "Microsoft Aria Online (Natural)");
  assert.equal(C.prefersHouseCry("red_panda"), true);
  assert.equal(C.prefersHouseCry("crow"), true);
  assert.equal(C.prefersHouseCry("raven"), true);
  assert.equal(C.prefersHouseCry("barn_owl"), true);
  assert.equal(C.prefersHouseCry("red_tail"), true);
  assert.equal(C.prefersHouseCry("chickadee"), true);
  assert.equal(C.prefersHouseCry("robin"), true);
  assert.equal(C.prefersHouseCry("mallard"), true);
  assert.equal(C.prefersHouseCry("canada_goose"), true);
  assert.equal(C.prefersHouseCry("pileated"), true);
  assert.equal(C.prefersHouseCry("hummingbird"), true);
  assert.equal(C.prefersHouseCry("budgie"), true);
  assert.equal(C.prefersHouseCry("penguin"), true);
  assert.equal(C.prefersHouseCry("parrot"), true);
  assert.equal(C.prefersHouseCry("toucan"), true);
  assert.equal(C.prefersHouseCry("phoenix"), true);
  assert.equal(C.prefersHouseCry("cat"), true);
  assert.equal(C.prefersHouseCry("dog"), true);
  assert.equal(C.prefersHouseCry("rabbit"), true);
  assert.equal(C.prefersHouseCry("hamster"), true);
  assert.equal(C.prefersHouseCry("guinea_pig"), true);
  assert.equal(C.prefersHouseCry("turtle"), true);
  assert.equal(C.prefersHouseCry("goldfish"), true);
  assert.equal(C.prefersHouseCry("fox"), true);
  assert.equal(C.prefersHouseCry("ferret"), true);
  assert.equal(C.prefersHouseCry("hedgehog"), true);
  assert.equal(C.prefersHouseCry("chinchilla"), true);
  assert.equal(C.prefersHouseCry("axolotl"), true);
  assert.equal(C.prefersHouseCry("dragon"), true);
  assert.equal(C.prefersHouseCry("ball_python"), true);
  assert.equal(C.prefersHouseCry("corn_snake"), true);
  assert.equal(C.prefersHouseCry("kingsnake"), true);
  assert.equal(C.prefersHouseCry("green_tree_python"), true);
  assert.equal(C.prefersHouseCry("hognose"), true);
  assert.equal(C.prefersHouseCry("garter"), true);
  assert.equal(C.prefersHouseCry("boa"), true);
  assert.equal(C.prefersHouseCry("milk_snake"), true);
  assert.equal(C.prefersHouseCry("rosy_boa"), true);
  assert.equal(C.prefersHouseCry("carpet_python"), true);
  assert.equal(C.prefersHouseCry("octopus"), true);
  assert.equal(C.prefersHouseCry("cuttlefish"), true);
  assert.equal(C.prefersHouseCry("nautilus"), true);
  assert.ok(C.speakOpts("hearth", 50).volume < 0.5);
  assert.match(roomSrc, /prefersHouseCry/);
  assert.match(roomSrc, /const cried = await playAnimalVoice/);
  assert.match(roomSrc, /house cry missing or blocked/);
  assert.match(overlayPet, /prefersHouseCry/);
  assert.match(overlayPet, /if \(!played\) speakText\(text\)/);
  assert.equal(C.CARD_STORE, "computerpets.card.v1");
  assert.equal(C.blankCard().collapsed, true);
  assert.equal(C.blankCard().sleepAid.plugin, "off");
  const withBed = C.parseCard({ sleepAid: { plugin: "rain", playing: true } });
  assert.equal(withBed.sleepAid.plugin, "rain");
  assert.equal(withBed.sleepAid.playing, true);
  assert.match(cardSrc, /SLEEP_AID_LABEL/);
  assert.match(overlayHtml, /id="hud-sleep"/);
});
