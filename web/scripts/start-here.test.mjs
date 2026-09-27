import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const repo = join(root, "..");

const startSrc = readFileSync(join(repo, "docs/START-HERE.md"), "utf8");
const readmeSrc = readFileSync(join(repo, "README.md"), "utf8");
const deskReadmeSrc = readFileSync(join(repo, "desktop/README.md"), "utf8");
const pkg = JSON.parse(readFileSync(join(repo, "desktop/package.json"), "utf8"));
const ps1Src = readFileSync(join(repo, "desktop.ps1"), "utf8");
const windowsSitSrc = readFileSync(join(root, "src/components/desk/windows-desk-sit.tsx"), "utf8");
const demoSrc = readFileSync(join(root, "src/components/desk/demo-stage.tsx"), "utf8");
const meetSrc = readFileSync(join(root, "src/routes/meet.tsx"), "utf8");
const overlayHtml = readFileSync(join(repo, "desktop/renderer/index.html"), "utf8");
const mainSrc = readFileSync(join(repo, "desktop/main.cjs"), "utf8");

const FAKE_STORE = [
  /ms-windows-store:/i,
  /microsoft\.com\/store\/productId/i,
  /9N[A-Z0-9]{12}/,
  /Get it from (the )?Microsoft Store/i,
  /Download from the Microsoft Store/i,
];

function firstIndex(src, pattern) {
  const match = src.match(pattern);
  assert.ok(match && match.index != null, `missing ${pattern}`);
  return match.index;
}

test("the first teaching point is a pet on the real Windows desktop", () => {
  assert.match(startSrc, /real Windows desktop/);
  assert.match(startSrc, /Windows 10 and Windows 11/);
  assert.match(startSrc, /What that looks like/);
  assert.match(readmeSrc, /Put a pet on your real desktop/);
  assert.match(readmeSrc, /readme-hero\.jpg/);
  assert.match(readmeSrc, /How to get your first pet/);
  assert.match(startSrc, /readme-rui\.jpg/);

  const picture = firstIndex(startSrc, /What that looks like/);
  const nodeStep = firstIndex(startSrc, /Step 2 — Install Node/);
  assert.ok(picture < nodeStep, "Node is taught after the pets-on-the-desk picture");

  const deskPicture = firstIndex(readmeSrc, /Put a pet on your real desktop/);
  const nodeHelper = firstIndex(readmeSrc, /nodejs\.org/);
  assert.ok(deskPicture < nodeHelper, "README names the desk walk before Node");
});

test("the honest download is GitHub plus the overlay, not a Store listing", () => {
  assert.match(startSrc, /There is no Microsoft Store button/);
  assert.match(startSrc, /no live Store ID/);
  assert.match(startSrc, /no magic `\.\exe` sitting on a website/);
  assert.match(readmeSrc, /There is no Steam, Itch, or Microsoft Store download yet/);
  assert.match(readmeSrc, /no live Store ID/);
  assert.match(deskReadmeSrc, /no Microsoft Store listing and no live Store ID/);
  assert.match(startSrc, /github\.com\/RicheyWorks\/computerpets/);
  for (const src of [startSrc, readmeSrc, deskReadmeSrc]) {
    for (const pattern of FAKE_STORE) {
      assert.doesNotMatch(src, pattern);
    }
    assert.doesNotMatch(src, /cyber-scorpion/);
    assert.doesNotMatch(src, /\bBus\b/);
  }
});

test("today's start is desktop.ps1 → npm start → electron .", () => {
  assert.match(startSrc, /desktop\.ps1/);
  assert.match(startSrc, /npm start/);
  assert.match(startSrc, /electron \./);
  assert.match(readmeSrc, /desktop\.ps1/);
  assert.match(readmeSrc, /electron \./);
  assert.equal(pkg.scripts.start, "electron .");
  assert.match(pkg.scripts.dist, /electron-builder/);
  assert.match(pkg.scripts["dist:win"], /electron-builder --win/);
  assert.match(ps1Src, /npm start/);
  assert.match(startSrc, /electron-builder/);
  assert.match(readmeSrc, /electron-builder/);
  assert.match(startSrc, /We do not publish one/);
});

test("the taught house is the overlay that runs: keeper card, On the desk, local care", () => {
  assert.match(startSrc, /keeper card/);
  assert.match(startSrc, /Hunger, Rest, Bond/);
  assert.match(startSrc, /\*\*Feed\*\*, \*\*Play\*\*, \*\*Rest\*\*/);
  assert.match(startSrc, /On the desk/);
  assert.match(startSrc, /Rui, Sip, Arc, Volt, Trace, Flux, Spark, Ion, Gauss, Relay, Fuse, Ground/);
  assert.match(startSrc, /Java 8081 · DOWN · unread/);
  assert.match(startSrc, /Care is local/);
  assert.match(startSrc, /\/pet\/feed` is not a door/);
  assert.match(startSrc, /Clicks on empty glass pass through/);
  assert.match(readmeSrc, /On the desk/);
  assert.match(readmeSrc, /keeper card/);

  assert.match(overlayHtml, /class="keeper-card"/);
  assert.match(overlayHtml, /data-care="feed"/);
  assert.match(mainSrc, /label: "On the desk"/);
  assert.match(windowsSitSrc, /On the desk/);
  assert.match(demoSrc, /WindowsDeskSit/);
  assert.match(meetSrc, /On Windows they walk on the real desktop/);
});

test("the browser door comes after, and /demo stays the same house", () => {
  const deskQuest = firstIndex(startSrc, /Put Rui on your real desktop/);
  const browser = firstIndex(startSrc, /Another way to visit them \(browser\)/);
  assert.ok(deskQuest < browser, "browser is taught after the desktop walk");
  assert.match(startSrc, /localhost:8080\/demo\/rui/);
  assert.match(startSrc, /localhost:8080\/demo\/crackle/);
  assert.match(startSrc, /same house as the overlay/);
  assert.match(readmeSrc, /Spark's room is `\/demo\/crackle`/);
  assert.match(readmeSrc, /Another way to visit them \(browser\)/);
  const readmeDesk = firstIndex(readmeSrc, /Put a pet on your real desktop/);
  const readmeBrowser = firstIndex(readmeSrc, /Another way to visit them \(browser\)/);
  assert.ok(readmeDesk < readmeBrowser);
});

test("START-HERE tells the honest house count without owning house-count", () => {
  assert.match(startSrc, /There are \*\*221\*\* animals/);
  assert.match(startSrc, /all \*\*221\*\*/);
  assert.doesNotMatch(startSrc, /\*\*211\*\*/);
  assert.doesNotMatch(startSrc, /\*\*219\*\*/);
  assert.doesNotMatch(startSrc, /\*\*220\*\*/);
  assert.match(readmeSrc, /There are \*\*221\*\* animals/);
  assert.match(readmeSrc, /Two hundred twenty-one living kinds/);
});
