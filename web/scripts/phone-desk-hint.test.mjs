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
  assert.match(room, /\{hand && hintUp \? null : \(\n\s+<SpeciesPlaque speciesKey=\{kind\.key\} compact paper folded=\{hand\} /);
  assert.match(room, /onDone=\{\(\) => \{\n\s+setHintUp\(false\);/);
});
