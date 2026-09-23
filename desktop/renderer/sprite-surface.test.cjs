const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const Surface = require("./sprite-surface.js");
const GpuPath = require("../gpu-path.cjs");

const fixture = JSON.parse(readFileSync(join(__dirname, "fixtures", "sprite-surface-frames.json"), "utf8"));
const surfaceSrc = readFileSync(join(__dirname, "sprite-surface.js"), "utf8");
const petSrc = readFileSync(join(__dirname, "pet.js"), "utf8");
const htmlSrc = readFileSync(join(__dirname, "index.html"), "utf8");
const gateSrc = readFileSync(join(__dirname, "..", "gpu-path.cjs"), "utf8");
const styleSrc = readFileSync(join(__dirname, "styles.css"), "utf8");

function fake2d() {
  const calls = [];
  return {
    calls,
    setTransform(...args) {
      calls.push(["setTransform", ...args]);
    },
    clearRect(...args) {
      calls.push(["clearRect", ...args]);
    },
    drawImage(img, x, y, w, h) {
      calls.push(["drawImage", img && img.src, x, y, w, h]);
    },
  };
}

function fakeCanvas() {
  const contexts = {};
  const el = {
    width: 0,
    height: 0,
    dataset: {},
    contextType: "",
    getContext(type) {
      if (el.contextType && el.contextType !== type) return null;
      if (!Object.prototype.hasOwnProperty.call(contexts, type)) return null;
      const ctx = contexts[type];
      if (!ctx) return null;
      el.contextType = type;
      return ctx;
    },
  };
  el.provide = (type, ctx) => {
    contexts[type] = ctx;
    return el;
  };
  return el;
}

function FakeOffscreen(ctx) {
  function Offscreen(w, h) {
    this.width = w;
    this.height = h;
    this.ctx = ctx;
    this.bitmaps = [];
  }
  Offscreen.prototype.getContext = function getContext(type) {
    return type === "2d" ? this.ctx : null;
  };
  Offscreen.prototype.transferToImageBitmap = function transferToImageBitmap() {
    const bitmap = { width: this.width, height: this.height, id: this.bitmaps.length + 1 };
    this.bitmaps.push(bitmap);
    return bitmap;
  };
  Offscreen.made = [];
  const Real = Offscreen;
  function Ctor(w, h) {
    const off = new Real(w, h);
    Ctor.made.push(off);
    return off;
  }
  Ctor.prototype = Real.prototype;
  Ctor.made = Real.made;
  return Ctor;
}

function imagesFrom(frames) {
  const table = new Map(frames.map((frame) => [frame.src, frame]));
  function Image() {
    this.complete = false;
    this.naturalWidth = 0;
    this.naturalHeight = 0;
    this.width = 0;
    this.height = 0;
    this.onload = null;
    this.onerror = null;
    this._src = "";
  }
  Image.loads = [];
  Object.defineProperty(Image.prototype, "src", {
    set(value) {
      this._src = value;
      Image.loads.push(value);
      const row = table.get(value);
      if (!row) {
        this.complete = true;
        if (typeof this.onerror === "function") this.onerror();
        return;
      }
      this.width = row.width;
      this.height = row.height;
      this.naturalWidth = row.width;
      this.naturalHeight = row.height;
      this.complete = true;
      if (typeof this.onload === "function") this.onload();
    },
    get() {
      return this._src;
    },
  });
  return Image;
}

function drawCall(ctx) {
  return ctx.calls.filter((row) => row[0] === "drawImage");
}

test("fixture frames sit contain-bottom in the pet box", () => {
  assert.equal(fixture.box, Surface.CSS);
  assert.equal(Surface.CSS, 176);
  for (const frame of fixture.frames) {
    assert.equal(Surface.catalogFrame(frame.src), true);
    const fit = Surface.fitContainBottom(frame.width, frame.height, fixture.box);
    assert.deepEqual(fit, { x: frame.x, y: frame.y, w: frame.w, h: frame.h });
  }
  assert.match(styleSrc, /#pet\s*\{[^}]*width:\s*176px/);
  assert.match(styleSrc, /#pet\s*\{[^}]*height:\s*176px/);
});

test("offscreencanvas draws the catalog sprite and keeps the hardware gate", () => {
  const soft = GpuPath.decide("hardware", { kind: "software", because: "gpu-compositing" });
  const hard = GpuPath.decide("hardware", { kind: "hardware", because: "enabled" });
  assert.equal(soft.open, false);
  assert.equal(soft.label, GpuPath.LABEL.softwareRefused);
  assert.equal(hard.open, true);
  assert.equal(hard.label, "Chromium GPU compositor");
  assert.equal(GpuPath.HARDWARE_COMPOSITING.has("enabled_readback"), true);
  assert.equal(GpuPath.SOFTWARE_COMPOSITING.has("disabled_software"), true);
  assert.match(gateSrc, /0126/);
  assert.doesNotMatch(surfaceSrc, /getContext\(\s*["']webgl/);
  assert.doesNotMatch(surfaceSrc, /texImage2D/);
  assert.doesNotMatch(surfaceSrc, /getGPUFeatureStatus/);
  assert.doesNotMatch(surfaceSrc, /getGPUInfo/);
  assert.doesNotMatch(surfaceSrc, /--use-angle/);

  const ctx = fake2d();
  const Offscreen = FakeOffscreen(ctx);
  const bitmap = { transfers: [], transferFromImageBitmap(bitmap) { this.transfers.push(bitmap); } };
  const canvas = fakeCanvas().provide("bitmaprenderer", bitmap);
  const Image = imagesFrom(fixture.frames);
  const surface = Surface.attach(canvas, { OffscreenCanvas: Offscreen, Image, devicePixelRatio: 1 });
  assert.equal(surface.ok, true);
  assert.equal(surface.kind, "offscreencanvas");
  assert.equal(canvas.dataset.surface, "offscreencanvas");
  assert.equal(canvas.width, 176);
  const painted = surface.paint(fixture.frames[0].src);
  assert.equal(painted.ok, true);
  assert.equal(painted.pending, undefined);
  const drawn = drawCall(ctx);
  assert.equal(drawn.length, 1);
  assert.deepEqual(drawn[0].slice(1), [fixture.frames[0].src, 44, 0, 88, 176]);
  assert.equal(bitmap.transfers.length, 1);
  assert.equal(canvas.dataset.frame, fixture.frames[0].src);
  assert.equal(surface.frame(), fixture.frames[0].src);

  const again = surface.paint(fixture.frames[0].src);
  assert.equal(again.cached, true);
  assert.equal(Image.loads.length, 1);
  assert.equal(surface.draws(), 1);

  surface.paint(fixture.frames[1].src);
  const second = drawCall(ctx).at(-1);
  assert.deepEqual(second.slice(1), [fixture.frames[1].src, 0, 88, 176, 88]);
  assert.equal(canvas.dataset.frame, fixture.frames[1].src);
  surface.paint(fixture.frames[0].src);
  assert.equal(surface.draws(), 3);
  assert.equal(Image.loads.length, 2);
  assert.equal(canvas.dataset.frame, fixture.frames[0].src);
});

test("a higher device ratio sizes the backing store and still fits in css pixels", () => {
  const ctx = fake2d();
  const Offscreen = FakeOffscreen(ctx);
  const bitmap = { transfers: [], transferFromImageBitmap(b) { this.transfers.push(b); } };
  const canvas = fakeCanvas().provide("bitmaprenderer", bitmap);
  const surface = Surface.attach(canvas, {
    OffscreenCanvas: Offscreen,
    Image: imagesFrom(fixture.frames),
    devicePixelRatio: 2,
  });
  assert.equal(canvas.width, 352);
  assert.equal(Offscreen.made[0].width, 352);
  surface.paint(fixture.frames[0].src);
  assert.deepEqual(ctx.calls[0], ["setTransform", 2, 0, 0, 2, 0, 0]);
  assert.deepEqual(drawCall(ctx)[0].slice(1), [fixture.frames[0].src, 44, 0, 88, 176]);
});

test("a missing offscreencanvas uses the on-screen canvas and still refuses a bad frame", () => {
  const ctx = fake2d();
  const canvas = fakeCanvas().provide("2d", ctx);
  const surface = Surface.attach(canvas, {
    OffscreenCanvas: null,
    Image: imagesFrom(fixture.frames),
    devicePixelRatio: 1,
  });
  assert.equal(surface.ok, true);
  assert.equal(surface.kind, "canvas");
  assert.equal(canvas.dataset.surface, "canvas");
  const bad = surface.paint("sprites/../secret.png");
  assert.equal(bad.ok, false);
  assert.equal(bad.reason, "frame");
  assert.equal(surface.draws(), 0);
  assert.equal(canvas.dataset.frame, undefined);
  surface.paint("https://example.test/sprites/cat/idle/1.png");
  surface.paint("sprites/cat/idle/1.gif");
  surface.paint("sprites/red_panda/write/1.png");
  assert.equal(Surface.catalogFrame("sprites/cat/sit/3.png"), true);
  assert.equal(surface.draws(), 0);
  const ok = surface.paint(fixture.frames[0].src);
  assert.equal(ok.ok, true);
  assert.equal(canvas.dataset.frame, fixture.frames[0].src);
});

test("offscreencanvas without a 2d context stays closed", () => {
  function Offscreen() {}
  Offscreen.prototype.getContext = () => null;
  const ctx = fake2d();
  const canvas = fakeCanvas().provide("2d", ctx).provide("bitmaprenderer", { transferFromImageBitmap() {} });
  const surface = Surface.attach(canvas, {
    OffscreenCanvas: Offscreen,
    Image: imagesFrom(fixture.frames),
    devicePixelRatio: 1,
  });
  assert.equal(surface.ok, false);
  assert.equal(surface.kind, "refused");
  assert.equal(surface.reason, "offscreencanvas-context");
  assert.equal(canvas.dataset.surface, "refused");
  const painted = surface.paint(fixture.frames[0].src);
  assert.equal(painted.ok, false);
  assert.equal(surface.draws(), 0);
  assert.equal(ctx.calls.length, 0);
  assert.equal(canvas.dataset.frame, undefined);
});

test("a bitmap renderer that cannot take the bitmap stays closed", () => {
  const ctx = fake2d();
  const Offscreen = FakeOffscreen(ctx);
  const canvas = fakeCanvas().provide("bitmaprenderer", {}).provide("2d", fake2d());
  const surface = Surface.attach(canvas, {
    OffscreenCanvas: Offscreen,
    Image: imagesFrom(fixture.frames),
    devicePixelRatio: 1,
  });
  assert.equal(surface.ok, false);
  assert.equal(surface.reason, "bitmaprenderer");
  assert.equal(surface.paint(fixture.frames[0].src).ok, false);
  assert.equal(canvas.contextType, "bitmaprenderer");
});

test("no canvas context and no image decoder stay closed", () => {
  const canvas = fakeCanvas();
  const missing = Surface.attach(canvas, { OffscreenCanvas: null, Image: imagesFrom(fixture.frames), devicePixelRatio: 1 });
  assert.equal(missing.reason, "canvas-context");
  assert.equal(missing.paint(fixture.frames[0].src).ok, false);
  const noImage = Surface.attach(fakeCanvas().provide("2d", fake2d()), {
    OffscreenCanvas: null,
    Image: null,
    devicePixelRatio: 1,
  });
  assert.equal(noImage.reason, "no-image");
  assert.equal(Surface.attach(null, { Image: imagesFrom(fixture.frames) }).reason, "no-canvas");
});

test("a thrown offscreencanvas constructor uses the on-screen canvas", () => {
  function Offscreen() {
    throw new Error("unimplemented");
  }
  const ctx = fake2d();
  const canvas = fakeCanvas().provide("2d", ctx);
  const surface = Surface.attach(canvas, {
    OffscreenCanvas: Offscreen,
    Image: imagesFrom(fixture.frames),
    devicePixelRatio: 1,
  });
  assert.equal(surface.kind, "canvas");
  assert.equal(surface.paint(fixture.frames[1].src).ok, true);
  assert.deepEqual(drawCall(ctx)[0].slice(1), [fixture.frames[1].src, 0, 88, 176, 88]);
});

test("a failed decode does not invent a frame and does not clear a good one", () => {
  const ctx = fake2d();
  const canvas = fakeCanvas().provide("2d", ctx);
  const Image = imagesFrom(fixture.frames);
  const surface = Surface.attach(canvas, { OffscreenCanvas: null, Image, devicePixelRatio: 1 });
  surface.paint(fixture.frames[0].src);
  assert.equal(canvas.dataset.frame, fixture.frames[0].src);
  const missed = surface.paint("sprites/cat/idle/9.png");
  assert.equal(missed.ok, false);
  assert.equal(missed.reason, "decode");
  assert.equal(canvas.dataset.frame, fixture.frames[0].src);
  assert.equal(surface.frame(), fixture.frames[0].src);
});

test("a zero-size decode does not claim the frame", () => {
  const ctx = fake2d();
  const canvas = fakeCanvas().provide("2d", ctx);
  const Image = imagesFrom([{ src: "sprites/cat/idle/1.png", width: 0, height: 0 }]);
  const surface = Surface.attach(canvas, { OffscreenCanvas: null, Image, devicePixelRatio: 1 });
  const painted = surface.paint("sprites/cat/idle/1.png");
  assert.equal(painted.ok, false);
  assert.equal(painted.reason, "frame-size");
  assert.equal(surface.frame(), "");
  assert.equal(canvas.dataset.frame, undefined);
  assert.equal(drawCall(ctx).length, 0);
});

test("the host pet element is the canvas and pet.js does not assign an img src", () => {
  assert.match(htmlSrc, /<canvas id="pet" data-hit data-surface="pending"/);
  assert.match(htmlSrc, /sprite-surface\.js/);
  const scriptAt = htmlSrc.indexOf('src="sprite-surface.js"');
  const petAt = htmlSrc.indexOf('src="pet.js"');
  assert.ok(scriptAt > 0 && scriptAt < petAt);
  assert.doesNotMatch(htmlSrc, /<img id="pet"/);
  assert.match(petSrc, /PetSpriteSurface/);
  assert.match(petSrc, /paintPetFrame\(src\)/);
  assert.doesNotMatch(petSrc, /pet\.src\s*=/);
  assert.match(petSrc, /dataset\.frame/);
  assert.doesNotMatch(petSrc, /createCanvas/);
  assert.doesNotMatch(petSrc, /getContext\(\s*["']webgl/);
});

test("Sip, Brick, called guests, and plants use the same contain-bottom boxes", () => {
  const Robin = require("./robin-fly.js");
  const Plants = require("./desk-plants.js");
  const Call = require("./call-guests.js");
  assert.equal(Surface.BOX.host, 176);
  assert.equal(Surface.BOX.sip, 112);
  assert.equal(Surface.BOX.brick, 112);
  assert.equal(Surface.BOX.called, 128);
  assert.equal(Surface.BOX.plant, 128);
  assert.equal(Surface.BOX.guest, 128);
  assert.equal(Robin.DEST_PX, Surface.BOX.brick);
  assert.equal(Plants.DEST_PX, Surface.BOX.plant);
  assert.equal(Call.GUEST_DEST, Surface.BOX.called);
  assert.deepEqual(Surface.fitContainBottom(80, 160, 112), { x: 28, y: 0, w: 56, h: 112 });
  assert.deepEqual(Surface.fitContainBottom(160, 80, 112), { x: 0, y: 56, w: 112, h: 56 });
  assert.deepEqual(Surface.fitContainBottom(80, 160, 128), { x: 32, y: 0, w: 64, h: 128 });
  assert.deepEqual(Surface.fitContainBottom(160, 80, 128), { x: 0, y: 64, w: 128, h: 64 });
  assert.match(styleSrc, /#guest\s*\{[^}]*width:\s*128px/);
  assert.match(styleSrc, /#guest\s*\{[^}]*height:\s*128px/);
  assert.match(styleSrc, /#bird\s*\{[^}]*width:\s*112px/);
  assert.match(styleSrc, /#bird\s*\{[^}]*height:\s*112px/);
  assert.match(styleSrc, /#robin\s*\{[^}]*width:\s*112px/);
  assert.match(styleSrc, /\.called-guest\s*\{[^}]*width:\s*128px/);
  assert.match(styleSrc, /\.desk-plant\s*\{[^}]*width:\s*128px/);
  assert.match(htmlSrc, /<canvas id="bird" data-hit data-surface="pending"/);
  assert.match(htmlSrc, /<canvas id="robin" data-hit data-surface="pending"/);
  assert.match(htmlSrc, /<canvas id="guest" data-hit data-surface="pending"/);
  assert.doesNotMatch(htmlSrc, /<img id="guest"/);
  assert.doesNotMatch(htmlSrc, /<img id="bird"/);
  assert.doesNotMatch(htmlSrc, /<img id="robin"/);
  assert.match(petSrc, /paintActor\(birdEl,/);
  assert.match(petSrc, /paintActor\(robinEl,/);
  assert.match(petSrc, /paintActor\(node, src, "plant"\)/);
  assert.match(petSrc, /paintActor\(guestEl,/);
  assert.doesNotMatch(petSrc, /guestEl\.src\s*=/);
  assert.match(petSrc, /createElement\("canvas"\)/);
  assert.doesNotMatch(petSrc, /birdEl\.src\s*=/);
  assert.doesNotMatch(petSrc, /robinEl\.setAttribute\(\s*"src"/);
  assert.doesNotMatch(petSrc, /createElement\(\s*"img"\s*\)/);
  const callSrc = readFileSync(join(__dirname, "call-guests.js"), "utf8");
  assert.match(callSrc, /createElement\("canvas"\)/);
  assert.match(callSrc, /paintHeld/);
  assert.doesNotMatch(callSrc, /createElement\(\s*"img"\s*\)/);
  assert.doesNotMatch(callSrc, /setAttribute\(\s*"src"/);
  assert.match(gateSrc, /0126/);
  assert.match(gateSrc, /0127/);
  assert.match(gateSrc, /0128/);
  assert.doesNotMatch(gateSrc, /paintHeld/);
  assert.doesNotMatch(surfaceSrc, /getContext\(\s*["']webgl/);
});

test("paintHeld draws Sip and a plant on separate canvases and refuses a closed one", () => {
  const sipCtx = fake2d();
  const plantCtx = fake2d();
  const sip = fakeCanvas().provide("2d", sipCtx);
  const plant = fakeCanvas().provide("2d", plantCtx);
  const Image = imagesFrom(fixture.frames);
  const opts = { OffscreenCanvas: null, Image, devicePixelRatio: 1 };
  const sipPaint = Surface.paintHeld(sip, fixture.frames[0].src, Object.assign({ cssSize: Surface.BOX.sip }, opts));
  assert.equal(sipPaint.ok, true);
  assert.equal(sip.dataset.surface, "canvas");
  assert.equal(sip.width, 112);
  assert.deepEqual(drawCall(sipCtx)[0].slice(1), [fixture.frames[0].src, 28, 0, 56, 112]);
  const plantPaint = Surface.paintHeld(plant, fixture.frames[1].src, Object.assign({ cssSize: Surface.BOX.plant }, opts));
  assert.equal(plantPaint.ok, true);
  assert.equal(plant.dataset.frame, fixture.frames[1].src);
  assert.deepEqual(drawCall(plantCtx)[0].slice(1), [fixture.frames[1].src, 0, 64, 128, 64]);
  assert.equal(drawCall(sipCtx).length, 1);
  assert.equal(Image.loads.length, 2);
  const again = Surface.paintHeld(sip, fixture.frames[0].src, Object.assign({ cssSize: Surface.BOX.sip }, opts));
  assert.equal(again.cached, true);
  assert.equal(drawCall(sipCtx).length, 1);

  const closed = fakeCanvas();
  closed.src = "";
  closed.setAttribute = () => {
    throw new Error("img-src");
  };
  const refused = Surface.paintHeld(closed, fixture.frames[0].src, Object.assign({ cssSize: Surface.BOX.brick }, opts));
  assert.equal(refused.ok, false);
  assert.equal(refused.reason, "canvas-context");
  assert.equal(closed.dataset.surface, "refused");
  assert.equal(closed.dataset.frame, undefined);
  assert.equal(closed.src, "");

  const noImage = fakeCanvas().provide("2d", fake2d());
  const missing = Surface.paintHeld(noImage, fixture.frames[0].src, {
    OffscreenCanvas: null,
    Image: null,
    cssSize: Surface.BOX.sip,
    devicePixelRatio: 1,
  });
  assert.equal(missing.reason, "no-image");
  assert.equal(noImage.dataset.surface, "refused");
  assert.equal(noImage.dataset.frame, undefined);
});

test("a dead offscreencanvas and a bitmap transfer miss stay closed for company sprites", () => {
  function Offscreen() {}
  Offscreen.prototype.getContext = () => null;
  const onscreen = fake2d();
  const dead = fakeCanvas().provide("2d", onscreen).provide("bitmaprenderer", { transferFromImageBitmap() {} });
  const deadPaint = Surface.paintHeld(dead, fixture.frames[0].src, {
    OffscreenCanvas: Offscreen,
    Image: imagesFrom(fixture.frames),
    cssSize: Surface.BOX.called,
    devicePixelRatio: 1,
  });
  assert.equal(deadPaint.ok, false);
  assert.equal(deadPaint.reason, "offscreencanvas-context");
  assert.equal(dead.dataset.surface, "refused");
  assert.equal(dead.dataset.frame, undefined);
  assert.equal(onscreen.calls.length, 0);

  const ctx = fake2d();
  const canvas = fakeCanvas().provide("bitmaprenderer", {}).provide("2d", ctx);
  const missed = Surface.paintHeld(canvas, fixture.frames[0].src, {
    OffscreenCanvas: FakeOffscreen(fake2d()),
    Image: imagesFrom(fixture.frames),
    cssSize: Surface.BOX.sip,
    devicePixelRatio: 1,
  });
  assert.equal(missed.ok, false);
  assert.equal(missed.reason, "bitmaprenderer");
  assert.equal(canvas.dataset.surface, "refused");
  assert.equal(drawCall(ctx).length, 0);
});

test("called guests paint a catalog frame on a canvas and do not assign an img src", () => {
  const Call = require("./call-guests.js");
  const ctx = fake2d();
  const canvas = fakeCanvas().provide("2d", ctx);
  canvas.className = "";
  canvas.alt = "";
  canvas.style = {};
  canvas.draggable = false;
  canvas.addEventListener = () => {};
  canvas.setAttribute = (name, value) => {
    if (name === "src") throw new Error("img-src");
    canvas[name] = value;
  };
  canvas.getAttribute = (name) => canvas[name] || "";
  const Image = imagesFrom(fixture.frames);
  const surface = { Image, OffscreenCanvas: null, devicePixelRatio: 1 };
  const src = fixture.frames[0].src;
  assert.equal(Call.assignSrc(canvas, src, surface), true);
  assert.equal(canvas.dataset.frame, src);
  assert.equal(canvas.dataset.surface, "canvas");
  assert.equal(Call.assignSrc(canvas, src, surface), false);
  assert.equal(drawCall(ctx).length, 1);
  assert.deepEqual(drawCall(ctx)[0].slice(1), [src, 32, 0, 64, 128]);
  assert.equal(Call.assignSrc(canvas, fixture.frames[1].src, surface), true);
  assert.deepEqual(drawCall(ctx).at(-1).slice(1), [fixture.frames[1].src, 0, 64, 128, 64]);

  const nodes = [];
  const root = {
    children: nodes,
    appendChild(el) {
      nodes.push(el);
      return el;
    },
    removeChild(el) {
      const i = nodes.indexOf(el);
      if (i >= 0) nodes.splice(i, 1);
      return el;
    },
  };
  const guestCtx = fake2d();
  function createImg() {
    const el = fakeCanvas().provide("2d", guestCtx);
    el.className = "";
    el.alt = "";
    el.style = {};
    el.draggable = false;
    el.addEventListener = () => {};
    el.remove = () => root.removeChild(el);
    el.setAttribute = (name, value) => {
      if (name === "src") throw new Error("img-src");
      el[name] = value;
    };
    el.getAttribute = (name) => el[name] || "";
    return el;
  }
  const guests = [{ ...Call.beginCalled("cat", 800, 0, 1), name: "Miso", frame: 0, sprites: { idle: [src] } }];
  const painted = Call.syncCalledPaint(root, guests, { createImg, surface });
  assert.equal(painted.added, 1);
  assert.equal(nodes[0].dataset.frame, src);
  assert.equal(nodes[0].dataset.surface, "canvas");
  assert.equal(nodes[0].className, "called-guest");
  assert.equal(drawCall(guestCtx).length, 1);
  const kept = nodes[0];
  const again = Call.syncCalledPaint(root, guests, { createImg, surface });
  assert.equal(again.reused, 1);
  assert.equal(again.added, 0);
  assert.strictEqual(nodes[0], kept);

  const plain = { src: "keep", dataset: {}, setAttribute() { throw new Error("img-src"); } };
  assert.equal(Call.assignSrc(plain, src, surface), false);
  assert.equal(plain.src, "keep");
  assert.equal(plain.dataset.surface, "refused");
  assert.equal(plain.dataset.frame, undefined);
});

test("the visit guest and the desk /demo pet paint on the shared canvas and stay blank when it refuses", () => {
  const livingSrc = readFileSync(join(__dirname, "..", "..", "web", "src", "components", "desk", "living-pet.tsx"), "utf8");
  const roomSrc = readFileSync(join(__dirname, "..", "..", "web", "src", "components", "desk", "companion-room.tsx"), "utf8");
  const demoPaintSrc = readFileSync(join(__dirname, "..", "..", "web", "src", "lib", "pets", "desk-sprite-surface.ts"), "utf8");
  assert.equal(Surface.BOX.guest, 128);
  assert.equal(Surface.catalogFrame("/sprites/cat/idle/1.png"), true);
  assert.equal(Surface.catalogFrame("sprites/cat/idle/1.png"), true);
  assert.equal(Surface.catalogFrame("//sprites/cat/idle/1.png"), false);
  assert.equal(Surface.catalogFrame("https://example.test/sprites/cat/idle/1.png"), false);
  assert.equal(Surface.catalogFrame("/sprites/../secret.png"), false);

  const guestCtx = fake2d();
  const guest = fakeCanvas().provide("2d", guestCtx);
  guest.src = "";
  guest.setAttribute = (name) => {
    if (name === "src") throw new Error("img-src");
  };
  const demoSrc = "/sprites/cat/idle/1.png";
  const Image = imagesFrom(fixture.frames.concat([{ src: demoSrc, width: 80, height: 160 }]));
  const opts = { OffscreenCanvas: null, Image, devicePixelRatio: 1 };
  const guestPaint = Surface.paintHeld(guest, fixture.frames[0].src, Object.assign({ cssSize: Surface.BOX.guest }, opts));
  assert.equal(guestPaint.ok, true);
  assert.equal(guest.dataset.surface, "canvas");
  assert.equal(guest.dataset.frame, fixture.frames[0].src);
  assert.equal(guest.width, 128);
  assert.deepEqual(drawCall(guestCtx)[0].slice(1), [fixture.frames[0].src, 32, 0, 64, 128]);
  assert.equal(guest.src, "");

  const demoCtx = fake2d();
  const demo = fakeCanvas().provide("2d", demoCtx);
  demo.src = "";
  demo.setAttribute = (name) => {
    if (name === "src") throw new Error("img-src");
  };
  const demoPaint = Surface.paintHeld(demo, demoSrc, Object.assign({ cssSize: Surface.BOX.host }, opts));
  assert.equal(demoPaint.ok, true);
  assert.equal(demo.dataset.surface, "canvas");
  assert.equal(demo.dataset.frame, demoSrc);
  assert.equal(demo.width, 176);
  assert.deepEqual(drawCall(demoCtx)[0].slice(1), [demoSrc, 44, 0, 88, 176]);
  const cached = Surface.paintHeld(demo, demoSrc, Object.assign({ cssSize: Surface.BOX.host }, opts));
  assert.equal(cached.cached, true);
  assert.equal(drawCall(demoCtx).length, 1);

  const closed = fakeCanvas();
  closed.src = "keep";
  closed.setAttribute = () => {
    throw new Error("img-src");
  };
  const refused = Surface.paintHeld(closed, demoSrc, Object.assign({ cssSize: Surface.BOX.host }, opts));
  assert.equal(refused.ok, false);
  assert.equal(refused.reason, "canvas-context");
  assert.equal(closed.dataset.surface, "refused");
  assert.equal(closed.dataset.frame, undefined);
  assert.equal(closed.src, "keep");

  assert.match(htmlSrc, /<canvas id="guest" data-hit data-surface="pending"/);
  assert.doesNotMatch(htmlSrc, /<img id="guest"/);
  assert.match(petSrc, /paintActor\(guestEl, [^;]*"guest"\)/);
  assert.doesNotMatch(petSrc, /guestEl\.src\s*=/);
  assert.match(roomSrc, /spriteSurface=\{demoWindow\}/);
  assert.match(livingSrc, /spriteSurface \? \(/);
  assert.match(livingSrc, /<canvas/);
  assert.match(livingSrc, /paintDemoFrame\(canvasRef\.current, src\)/);
  assert.match(livingSrc, /<img/);
  assert.match(demoPaintSrc, /paintHeld/);
  assert.match(demoPaintSrc, /BOX\.host/);
  assert.doesNotMatch(demoPaintSrc, /\.src\s*=/);
  assert.doesNotMatch(demoPaintSrc, /setAttribute\(\s*"src"/);
  assert.doesNotMatch(demoPaintSrc, /getContext\(\s*["']webgl/);
  assert.doesNotMatch(livingSrc, /getContext\(\s*["']webgl/);
  assert.match(gateSrc, /0128/);
  assert.doesNotMatch(gateSrc, /paintHeld/);
});
