// The access pass 2 (September 2026), the overlay's half: under reduced motion Brick, Sip, called guests and the desk
// plants are drawn still where they rest (calm-motion.js, read from the system setting through the page), and the
// Menu key or Shift+F10 opens the pet's own menu while the overlay has the keyboard.
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const G = require("./call-guests.js");
const Keeper = require("./keeper.js");

const read = (f) => readFileSync(join(__dirname, f), "utf8");

test("calm-motion.js loads before pet.js", () => {
  const html = read("index.html");
  const calm = html.indexOf('<script src="calm-motion.js"></script>');
  assert.ok(calm > 0 && calm < html.indexOf('<script src="pet.js"></script>'));
});

test("a called guest drawn at its rest spot, or kept out of sight until it rests (syncCalledPaint's place)", () => {
  const nodes = [];
  const root = {
    children: nodes,
    appendChild(el) {
      nodes.push(el);
      return el;
    },
    removeChild(el) {
      nodes.splice(nodes.indexOf(el), 1);
      return el;
    },
  };
  const createImg = () => ({ className: "", alt: "", dataset: {}, src: "", style: {}, draggable: false, addEventListener() {}, remove() {} });
  const guests = ["cat", "dog"].map((key, i) => ({ ...G.beginCalled(key, 800, i, 2), name: key, frame: 3 }));
  G.syncCalledPaint(root, guests, {
    createImg,
    frameOf: () => ["a.png", "b.png"],
    place: (g) => (g.key === "cat" ? { x: 120, lift: 0, facing: -1, frame: 0 } : null),
  });
  const [cat, dog] = nodes;
  assert.equal(cat.style.transform, "translate3d(120px, 0px, 0) scale(-1, 1)");
  assert.equal(dog.style.visibility, "hidden");
  // Without place (motion as usual) the guest is drawn where it walks, and shows again.
  G.syncCalledPaint(root, guests, { createImg, frameOf: () => ["a.png", "b.png"] });
  assert.equal(dog.style.visibility, "");
  assert.match(dog.style.transform, new RegExp(`translate3d\\(${guests[1].x}px`));
});

test("pet.js draws the robin, the bird, called guests and the plants still under reduced motion", () => {
  const pet = read("pet.js");
  assert.match(pet, /function calmNow\(\) \{\n\s+return !!\(window\.PetCalm && window\.PetCalm\.reducedMotion\(\)\);/);
  assert.match(pet, /robinHold = window\.PetCalm\.calmHold\(robinHold, robinFly, window\.PetCalm\.ROBIN_REST\);/);
  assert.match(pet, /birdHold = window\.PetCalm\.calmHold\(birdHold, birdFly, window\.PetCalm\.BIRD_REST\);/);
  assert.match(pet, /window\.PetCalm\.calmHold\(calledHold\[g\.key\] \|\| null, g, window\.PetCalm\.CALLED_REST\)/);
  assert.match(pet, /const lean = calmNow\(\) \? 0 : P\.windLean\(plantAge, windOn, plant\.selected, plant\.mode\);/);
  assert.match(pet, /if \(!calmNow\(\)\) robinEl\.classList\.add\("show"\);/);
  assert.match(pet, /if \(!calmNow\(\)\) birdEl\.classList\.add\("show"\);/);
});

test("the Menu key or Shift+F10 opens the pet's menu from the open card, not from a field", () => {
  assert.equal(Keeper.cardKey({ key: "ContextMenu", cardOpen: true }), "menu");
  assert.equal(Keeper.cardKey({ key: "F10", shiftKey: true, cardOpen: true }), "menu");
  assert.equal(Keeper.cardKey({ key: "ContextMenu", cardOpen: true, inField: true }), "none");
  assert.equal(Keeper.cardKey({ key: "ContextMenu", cardOpen: false }), "none");
  assert.equal(Keeper.cardKey({ key: "Escape", cardOpen: true }), "close");
  assert.match(read("pet.js"), /inField: !!fieldOf\(active\) \}\);\n\s+if \(act === "menu"\) \{/);
});
