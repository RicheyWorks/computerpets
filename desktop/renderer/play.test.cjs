const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const P = require("./play.js");

const petSrc = readFileSync(join(__dirname, "pet.js"), "utf8");
const htmlSrc = readFileSync(join(__dirname, "index.html"), "utf8");
const cssSrc = readFileSync(join(__dirname, "styles.css"), "utf8");
const mainSrc = readFileSync(join(__dirname, "..", "main.cjs"), "utf8");

function lureSeek() {
  return { taken: false, cmd: "seek", mark: "lure" };
}

function handleSrc() {
  const start = petSrc.indexOf("function handle(cmd)");
  const end = petSrc.indexOf("async function askMind");
  return petSrc.slice(start, end);
}

test("one lure chase finishes play once; catch then arrive does not double", () => {
  const sameTick = P.playHop(lureSeek(), "catch");
  assert.equal(sameTick.act, "play");
  assert.equal(sameTick.applyPlay, 1);
  assert.equal(sameTick.issuePlay, 1);
  assert.equal(P.playClaim("arrive", { taken: true, cmd: "seek", mark: null }), "none");
  assert.equal(P.playClaim("arrive", { taken: true, cmd: "seek", mark: "lure" }), "none");

  const local = P.playChase(["catch", "arrive"], lureSeek());
  assert.deepEqual(local.acts, ["play", "idle"]);
  assert.equal(local.applyPlay, 1);
  assert.equal(local.persistPlay, 0);
  assert.equal(local.issuePlay, 1);
  assert.equal(local.taken, true);
  assert.equal(local.mark, null);
  assert.equal(local.cmd, "idle");
});

test("arrive then catch is the same hop, not a second play", () => {
  const local = P.playChase(["arrive", "catch"], lureSeek());
  assert.deepEqual(local.acts, ["play", "none"]);
  assert.equal(local.applyPlay, 1);
  assert.equal(local.issuePlay, 1);
  assert.equal(P.playClaim("catch", { taken: true, cmd: "seek", mark: "lure" }), "none");
  assert.equal(P.playClaim("arrive", { taken: true, cmd: "seek", mark: "lure" }), "none");
});

test("treat seek still snacks; hide still hides; a catch is not a snack", () => {
  const treat = P.playChase(["arrive"], { taken: false, cmd: "seek", mark: "treat" });
  assert.deepEqual(treat.acts, ["snack"]);
  assert.equal(treat.applyPlay, 0);
  assert.equal(treat.issuePlay, 0);
  assert.equal(treat.issueEat, 1);
  assert.equal(treat.cmd, "eat");

  assert.equal(P.playClaim("catch", { taken: false, cmd: "seek", mark: "treat" }), "none");
  assert.equal(P.playClaim("arrive", { taken: false, cmd: "leave", mark: null }), "hide");
  assert.equal(P.playClaim("arrive", { taken: false, cmd: "play", mark: null }), "idle");
});

test("a snack or feed is a thing on the work-area floor; they walk to it", () => {
  const handle = handleSrc();
  assert.match(handle, /cmd === "play"/);
  assert.match(handle, /cmd === "snack"/);
  assert.match(handle, /cmd === "feed"/);
  assert.match(handle, /placeMark\("treat"/);
  assert.match(handle, /placeMark\("lure"/);
  assert.match(handle, /issue\("seek"\)/);
  assert.doesNotMatch(handle, /PetLife\.act\(life, trait, "feed"\)/);
  assert.doesNotMatch(handle, /PetLife\.act\(life, trait, "snack"\)/);
  assert.match(petSrc, /playHop/);
  assert.match(petSrc, /playClaim|"arrive"/);
  assert.match(petSrc, /meal === "feed"/);
});

test("catch and arrive share one hop; the overlay claims play once", () => {
  assert.match(petSrc, /playHop/);
  assert.match(petSrc, /"catch"/);
  assert.match(petSrc, /"arrive"/);
  const lureClick = petSrc.slice(petSrc.indexOf('lureEl.addEventListener("click"'), petSrc.indexOf('window.addEventListener("resize"'));
  assert.match(lureClick, /playHop/);
  assert.match(lureClick, /"catch"/);
  assert.equal([...lureClick.matchAll(/issue\("play"\)/g)].length, 1);
  assert.match(petSrc, /function applyArrive/);
  const arrive = petSrc.slice(petSrc.indexOf("function applyArrive"), petSrc.indexOf("function clearAct"));
  assert.match(arrive, /playHop/);
  assert.equal([...arrive.matchAll(/issue\("play"\)/g)].length, 1);
  assert.match(arrive, /issue\("eat"\)/);
});

test("only the pet and a treat, ribbon, or mess on the floor is hittable", () => {
  assert.match(htmlSrc, /id="treat"[^>]*data-hit/);
  assert.match(htmlSrc, /id="lure"[^>]*data-hit/);
  assert.match(htmlSrc, /id="pet"[^>]*data-hit/);
  assert.doesNotMatch(htmlSrc, /id="hud"[^>]*data-hit/);
  assert.match(cssSrc, /#treat\.show[\s\S]*pointer-events:\s*auto/);
  assert.match(petSrc, /dataset\.hit/);
  assert.match(petSrc, /setIgnoreMouseEvents|setClickable/);
  assert.match(mainSrc, /setIgnoreMouseEvents\(!clickable, \{ forward: true \}\)/);
  assert.match(mainSrc, /getPrimaryDisplay\(\)\.workArea/);
  assert.match(mainSrc, /fitWorkArea/);
});

test("tray care stays the house verbs; hide-the-guest is not hide-the-window", () => {
  for (const verb of ["Feed", "Treat", "Play", "Rest", "Talk", "Hide", "Call back", "Clean", "Bath", "Medicine", "Praise", "Shed"]) {
    assert.match(mainSrc, new RegExp(`label: "${verb}"`));
  }
  assert.match(mainSrc, /lastVitals\.verb \|\| "Special"/);
  assert.equal([...mainSrc.matchAll(/label: "Call back"/g)].length, 1);
  assert.equal([...mainSrc.matchAll(/label: "Hide the window"/g)].length, 2);
  assert.doesNotMatch(mainSrc, /label: "Hide", click: \(\) => win\?\.hide/);
  assert.doesNotMatch(mainSrc, /Hide \$\{currentName\(\)\}/);
});
