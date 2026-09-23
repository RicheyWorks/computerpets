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
