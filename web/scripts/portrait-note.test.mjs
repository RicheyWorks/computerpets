// Mount test: the real PetPortrait and PortraitNote rendered with React into the small DOM
// (scripts/mount-dom.mjs). A portrait that cannot be drawn (a Git LFS placeholder, or no file) turns into
// a name-and-kind tile, and the page shows one note with the Git LFS steps, not one per picture.
import { test, before } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { mountSetup } from "./mount-setup.mjs";
import { STEPS } from "./pictures-check.mjs";

const ROOT = join(import.meta.dirname, "..");
let m;
let P;
let S;

before(async () => {
  m = await mountSetup();
  P = await m.load("components/pet-portrait.tsx");
  S = await m.load("lib/pets/portrait-state.ts");
});

function all(node, pred, out = []) {
  if (pred(node)) out.push(node);
  for (const c of node.childNodes || []) all(c, pred, out);
  return out;
}
const tag = (name) => (n) => n.tagName === name;
const attr = (name) => (n) => typeof n.getAttribute === "function" && n.getAttribute(name) !== null;

/** Fire the img error listeners the way the browser does when it cannot draw a picture. */
async function breakImage(img) {
  await m.React.act(async () => {
    for (const fn of img.listeners.get("error") || []) fn({ type: "error", target: img, currentTarget: img, bubbles: false, cancelable: false, defaultPrevented: false, eventPhase: 2, isTrusted: true, timeStamp: 0, preventDefault() {}, stopPropagation() {} });
  });
}

test("the note words carry the same Git LFS steps as the dev server, the overlay and the start scripts", () => {
  assert.equal(S.PORTRAIT_STEPS, STEPS);
  assert.equal(S.PORTRAIT_NOTE_TITLE, "Some pet portraits did not load.");
  assert.equal(
    S.PORTRAIT_NOTE,
    "If you copied ComputerPets with Git, the portraits come through Git LFS. Install Git LFS from https://git-lfs.com, then in the computerpets folder run git lfs install and then git lfs pull, and reload this page.",
  );
});

test("three broken portraits become name-and-kind tiles, and the page shows one note until Got it", async () => {
  S.resetPortraitState();
  const s = m.stage();
  const h = m.h;
  await s.render(
    h("div", null,
      h(P.PetPortrait, { speciesKey: "crow", alt: "Soot", name: "Soot", kind: "American Crow" }),
      h(P.PetPortrait, { speciesKey: "cat", alt: "Miso", name: "Miso", kind: "Cat" }),
      h(P.PetPortrait, { speciesKey: "dog", alt: "", name: "Pip", kind: "Corgi" }),
      h(P.PortraitNote, null),
    ),
  );
  const imgs = all(s.container, tag("IMG"));
  assert.equal(imgs.length, 3);
  assert.equal(imgs[0].getAttribute("src"), "/pets/crow.jpg");
  assert.equal(all(s.container, attr("data-portrait-note")).length, 0, "no note while the pictures are fine");

  for (const img of imgs) await breakImage(img);

  assert.equal(all(s.container, tag("IMG")).length, 0, "no broken-image icons left");
  const tiles = all(s.container, attr("data-portrait-fallback"));
  assert.deepEqual(tiles.map((t) => t.getAttribute("data-portrait-fallback")), ["crow", "cat", "dog"]);
  assert.equal(tiles[0].textContent, "SSootAmerican Crow");
  assert.equal(tiles[0].getAttribute("role"), "img");
  assert.equal(tiles[0].getAttribute("aria-label"), "Soot, American Crow");
  assert.equal(tiles[2].getAttribute("aria-hidden"), "true", "a decorative portrait stays decorative");
  assert.deepEqual(S.failedPortraits(), ["crow", "cat", "dog"]);

  const notes = all(s.container, attr("data-portrait-note"));
  assert.equal(notes.length, 1, "one note for the page, not one per picture");
  assert.equal(notes[0].getAttribute("role"), "status");
  assert.ok(notes[0].textContent.includes(S.PORTRAIT_NOTE_TITLE));
  assert.ok(notes[0].textContent.includes(STEPS));

  const button = all(notes[0], tag("BUTTON"))[0];
  assert.equal(button.textContent, "Got it");
  // React listens for clicks on the root container and finds the button from the event target.
  await m.React.act(async () => {
    for (const fn of s.container.listeners.get("click") || []) fn({ type: "click", target: button, currentTarget: button, bubbles: true, button: 0, preventDefault() {}, stopPropagation() {} });
  });
  assert.equal(all(s.container, attr("data-portrait-note")).length, 0, "Got it hides the note");
  assert.equal(all(s.container, attr("data-portrait-fallback")).length, 3, "the tiles stay");
  await s.unmount();
});

test("the page wires one note in the app shell, and every portrait goes through PetPortrait", () => {
  const shell = readFileSync(join(ROOT, "src", "components", "app-shell.tsx"), "utf8");
  assert.equal((shell.match(/<PortraitNote \/>/g) || []).length, 1);
  const meet = readFileSync(join(ROOT, "src", "routes", "meet.tsx"), "utf8");
  assert.doesNotMatch(meet, /portraitSrc/);
  assert.match(meet, /<PetPortrait\s+speciesKey=\{kind\.key\}\s+alt=""\s+name=\{kind\.name\}\s+kind=\{kind\.speciesLabel\}/);
  const card = readFileSync(join(ROOT, "src", "components", "pet-card.tsx"), "utf8");
  assert.doesNotMatch(card, /<img/);
  const portrait = readFileSync(join(ROOT, "src", "components", "pet-portrait.tsx"), "utf8");
  assert.match(portrait, /onError=\{fail\}/);
  assert.match(portrait, /el\.complete && el\.naturalWidth === 0/, "a picture that failed before React listened is caught after mount");
});
