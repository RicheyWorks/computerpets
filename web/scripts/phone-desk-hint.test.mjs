// Phone desk (audit fix): on a 390×844 phone the first-run hello and the open species plaque ran under the care
// buttons. Now the hello comes first and the plaque waits for Got it, then sits folded (name and kind) above them.
import { test, before } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { mountSetup } from "./mount-setup.mjs";

const WEB = join(import.meta.dirname, "..");
let m;

before(async () => {
  m = await mountSetup({ stubs: { "@tanstack/react-router": join(import.meta.dirname, "mount-stubs", "react-router.mjs") } });
});

function click(s, el) {
  return m.React.act(async () => {
    for (const fn of s.container.listeners.get("click") || []) fn({ type: "click", target: el, currentTarget: s.container, bubbles: true, cancelable: true, defaultPrevented: false, eventPhase: 3, isTrusted: true, timeStamp: 0, button: 0, preventDefault() {}, stopPropagation() {} });
  });
}

test("a folded plaque shows the name and kind, and opens to the rest on one tap", async () => {
  const { SpeciesPlaque } = await m.load("components/desk/species-plaque.tsx");
  const { plaqueFor } = await m.load("lib/pets/plaques.ts");
  const guide = plaqueFor("red_panda");
  const s = m.stage();
  await s.render(m.h(SpeciesPlaque, { speciesKey: "red_panda", compact: true, paper: true, folded: true, showDemoLink: false }));
  let text = s.container.textContent;
  assert.ok(text.includes(guide.name) && text.includes(guide.species), "name and kind show");
  assert.ok(!text.includes(guide.tell), "the long tell waits");
  const open = s.container.querySelectorAll("button").find((b) => b.textContent === `About the ${guide.species}`);
  assert.ok(open, "one plain button opens it");
  await click(s, open);
  text = s.container.textContent;
  assert.ok(text.includes(guide.tell) && text.includes(guide.mixup), "opened: the tell and the mix-up");
  await s.render(m.h(SpeciesPlaque, { speciesKey: "red_panda", compact: true, paper: true, showDemoLink: false }));
  assert.ok(s.container.textContent.includes(guide.tell), "not folded (tablet and computer): the tell shows as before");
  await s.unmount();
});

test("the desk room: on a phone the plaque waits while the hello is up, then shows folded", () => {
  const room = readFileSync(join(WEB, "src", "components", "desk", "companion-room.tsx"), "utf8");
  assert.match(room, /const \[hintUp, setHintUp\] = useState\(false\);\n\s+useEffect\(\(\) => setHintUp\(!firstHintSeen\(\)\), \[\]\);/);
  // A short desktop screen folds it too (deskFold, kennel-targets.test.mjs).
  assert.match(room, /\{\(hand \|\| deskFold\) && hintUp && !stats\.hidden \? null : \(\n\s+<SpeciesPlaque speciesKey=\{kind\.key\} compact paper folded=\{hand \|\| deskFold\} /);
  assert.match(room, /onDone=\{\(\) => \{\n\s+setHintUp\(false\);/);
});

test("phoneFit: each panel ends a small gap above the care buttons and scrolls inside past that", async () => {
  const P = await import("../src/lib/pets/phone-desk.ts");
  assert.deepEqual(P.phoneFit({ asideTop: 68, railTop: 68, careTop: 384 }), { asideMax: 308, railMax: 308 });
  assert.deepEqual(P.phoneFit({ asideTop: 68, railTop: 100, careTop: 285.5 }), { asideMax: 209, railMax: 177 });
  assert.deepEqual(P.phoneFit({ asideTop: 68, railTop: 68, careTop: 90 }), { asideMax: P.PHONE_FIT_MIN, railMax: P.PHONE_FIT_MIN });
  assert.equal(P.PHONE_FIT_GAP, 8);
  assert.equal(P.samePhoneFit({ asideMax: 1, railMax: 2 }, { asideMax: 1, railMax: 2 }), true);
  assert.equal(P.samePhoneFit(null, { asideMax: 1, railMax: 2 }), false);
  assert.equal(P.plaqueNeedsLine(420, 308), true);
  assert.equal(P.plaqueNeedsLine(309, 308), false);
});

test("a one-line plaque on a short phone opens to the whole card on one tap", async () => {
  const { SpeciesPlaque } = await m.load("components/desk/species-plaque.tsx");
  const { plaqueFor } = await m.load("lib/pets/plaques.ts");
  const guide = plaqueFor("red_panda");
  const s = m.stage();
  await s.render(m.h(SpeciesPlaque, { speciesKey: "red_panda", compact: true, paper: true, folded: true, line: true, showDemoLink: false }));
  const art = s.container.querySelector("article");
  assert.equal(art.getAttribute("data-plaque"), "line");
  assert.ok(!s.container.textContent.includes(guide.tell));
  const open = s.container.querySelectorAll("button").find((b) => b.textContent.includes(`About the ${guide.species}`));
  assert.ok(open);
  await click(s, open);
  assert.equal(s.container.querySelector("article").getAttribute("data-plaque"), "open");
  assert.ok(s.container.textContent.includes(guide.tell) && s.container.textContent.includes(guide.mixup));
  await s.unmount();
});

test("the room wires the fit: aside and rail get the measured max height, the plaque goes to one line, bubbles on top", () => {
  const room = readFileSync(join(WEB, "src", "components", "desk", "companion-room.tsx"), "utf8");
  const living = readFileSync(join(WEB, "src", "components", "desk", "living-pet.tsx"), "utf8");
  // At desktop sizes deskFit does the same (kennel-targets.test.mjs).
  assert.match(room, /ref=\{asideRef\}\n\s+data-desk-aside\n\s+data-aside-fit=\{!hand && !pad && deskFit \? "" : undefined\}\n\s+style=\{hand && fit \? \{ maxHeight: fit\.asideMax \} : !hand && !pad && deskFit \? \{ maxHeight: deskFit\.asideMax \} : undefined\}/);
  assert.match(room, /ref=\{railRef\}\n\s+data-desk-rail\n\s+data-rail-fit=\{!hand && !pad && deskFit \? "" : undefined\}\n\s+style=\{hand && fit \? \{ maxHeight: fit\.railMax \} : !hand && !pad && deskFit \? \{ maxHeight: deskFit\.railMax \} : undefined\}/);
  assert.match(room, /ref=\{careRef\} data-desk-care/);
  assert.match(room, /careTop: care\.getBoundingClientRect\(\)\.top - top,/);
  assert.match(room, /if \(plaqueNeedsLine\(aside\.scrollHeight, aside\.clientHeight\)\) setPlaqueLine\(true\);/);
  assert.match(room, /line=\{hand && plaqueLine\}/);
  // The rail has a fixed width on a phone and the panel stops before it.
  assert.match(room, /z-20 w-\[5\.5rem\] overflow-y-auto overscroll-contain text-right/);
  assert.equal((room.match(/right-\[max\(6\.75rem,calc\(6rem\+env\(safe-area-inset-right\)\)\)\]/g) || []).length, 2);
  // The speech bubble (the pet's and the guests' lines) paints above the panels (z-20).
  assert.match(living, /absolute bottom-\[214px\] left-0 z-30 w-\[min\(220px,70vw\)\]/);
});
