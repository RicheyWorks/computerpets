/** Catalog frames on a surface Chromium composites. The host pet, Sip, Brick, called guests, and plants share this path. OffscreenCanvas when that 2d context and a bitmap renderer exist; otherwise an on-screen 2d canvas. Not a WebGL context, not a shader, not DirectX 12, and not Vulkan. The glass still opens only on hardware gpu_compositing (ADR 0125). */
(function (root) {
  const CSS = 176;
  const BOX = { host: CSS, sip: 112, brick: 112, called: 128, plant: 128 };
  const FRAME = /^sprites\/[a-z0-9_]+\/(?:idle|walk|sit|sleep|talk|eat|play)\/[1-9]\d*\.png$/;
  const held = new WeakMap();

  function catalogFrame(src) {
    return typeof src === "string" && FRAME.test(src);
  }

  function cssSize(opts) {
    const n = opts && opts.cssSize;
    return typeof n === "number" && Number.isFinite(n) && n > 0 ? n : CSS;
  }

  function ratio(opts) {
    if (opts && Object.prototype.hasOwnProperty.call(opts, "devicePixelRatio")) {
      const n = opts.devicePixelRatio;
      return typeof n === "number" && Number.isFinite(n) && n > 0 ? n : 1;
    }
    const live = typeof window !== "undefined" ? window.devicePixelRatio : 1;
    return typeof live === "number" && Number.isFinite(live) && live > 0 ? live : 1;
  }

  function backingOf(css, dpr) {
    return Math.max(1, Math.round(css * dpr));
  }

  /** Same box as the old img: contain, then sit on the bottom. */
  function fitContainBottom(iw, ih, box) {
    if (!(iw > 0) || !(ih > 0) || !(box > 0)) return null;
    const scale = Math.min(box / iw, box / ih);
    const w = iw * scale;
    const h = ih * scale;
    return { x: (box - w) / 2, y: box - h, w, h };
  }

  function sizeCanvas(canvas, px) {
    if (canvas.width !== px) canvas.width = px;
    if (canvas.height !== px) canvas.height = px;
  }

  function refused(reason, css, dpr, px) {
    return { ok: false, kind: "refused", reason, css, dpr, px, off: null, octx: null, bctx: null, ctx: null };
  }

  function openSurface(canvas, opts) {
    const css = cssSize(opts);
    const dpr = ratio(opts);
    const px = backingOf(css, dpr);
    if (!canvas || typeof canvas.getContext !== "function") return refused("no-canvas", css, dpr, px);
    const ImageCtor = imageCtor(opts);
    if (!ImageCtor) return refused("no-image", css, dpr, px);
    sizeCanvas(canvas, px);
    const Offscreen = offscreenCtor(opts);
    if (typeof Offscreen === "function") {
      let off = null;
      try {
        off = new Offscreen(px, px);
      } catch {
        off = null;
      }
      if (off) {
        const octx = typeof off.getContext === "function" ? off.getContext("2d") : null;
        if (!octx || typeof octx.drawImage !== "function") return refused("offscreencanvas-context", css, dpr, px);
        const bctx = canvas.getContext("bitmaprenderer");
        if (bctx && typeof bctx.transferFromImageBitmap === "function" && typeof off.transferToImageBitmap === "function") {
          return { ok: true, kind: "offscreencanvas", reason: "", css, dpr, px, off, octx, bctx, ctx: null, ImageCtor };
        }
        if (bctx) return refused("bitmaprenderer", css, dpr, px);
      }
    }
    const ctx = canvas.getContext("2d");
    if (!ctx || typeof ctx.drawImage !== "function") return refused("canvas-context", css, dpr, px);
    return { ok: true, kind: "canvas", reason: "", css, dpr, px, off: null, octx: null, bctx: null, ctx, ImageCtor };
  }

  function offscreenCtor(opts) {
    if (opts && Object.prototype.hasOwnProperty.call(opts, "OffscreenCanvas")) return opts.OffscreenCanvas;
    return typeof OffscreenCanvas === "function" ? OffscreenCanvas : null;
  }

  function imageCtor(opts) {
    if (opts && Object.prototype.hasOwnProperty.call(opts, "Image")) return opts.Image;
    return typeof Image === "function" ? Image : null;
  }

  function mark(canvas, kind, frame) {
    if (!canvas || !canvas.dataset) return;
    canvas.dataset.surface = kind;
    if (frame) canvas.dataset.frame = frame;
    else delete canvas.dataset.frame;
  }

  function blit(state, image) {
    const dest = fitContainBottom(image.naturalWidth || image.width, image.naturalHeight || image.height, state.css);
    if (!dest) return false;
    const ctx = state.octx || state.ctx;
    if (!ctx || typeof ctx.drawImage !== "function") return false;
    if (typeof ctx.setTransform === "function") ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    if (typeof ctx.clearRect === "function") ctx.clearRect(0, 0, state.css, state.css);
    ctx.drawImage(image, dest.x, dest.y, dest.w, dest.h);
    if (state.kind === "offscreencanvas") {
      try {
        const bitmap = state.off.transferToImageBitmap();
        if (!bitmap) return false;
        state.bctx.transferFromImageBitmap(bitmap);
      } catch {
        return false;
      }
    }
    state.draws += 1;
    state.last = dest;
    return true;
  }

  function remember(state, src) {
    state.frame = src;
    mark(state.canvas, state.kind, src);
  }

  function finish(state, slot, src, image) {
    if (slot.done) return;
    slot.done = true;
    slot.pending = false;
    slot.image = image;
    if (state.wanted !== src) return;
    if (blit(state, image)) remember(state, src);
  }

  function failDecode(state, src) {
    state.cache.delete(src);
    if (state.wanted !== src) return;
    state.broken = src;
  }

  function paint(state, src) {
    if (!state.ok) return { ok: false, kind: "refused", reason: state.reason, src: src || "" };
    if (!catalogFrame(src)) return { ok: false, kind: state.kind, reason: "frame", src: typeof src === "string" ? src : "" };
    state.wanted = src;
    const slot = state.cache.get(src);
    if (slot && slot.image && state.frame === src) {
      return { ok: true, kind: state.kind, reason: "", src, cached: true };
    }
    if (slot && slot.image) {
      if (!blit(state, slot.image)) return { ok: false, kind: state.kind, reason: "blit", src };
      remember(state, src);
      return { ok: true, kind: state.kind, reason: "", src, cached: true };
    }
    if (slot && slot.pending) return { ok: true, kind: state.kind, reason: "", src, pending: true };
    const next = { image: null, pending: true, done: false };
    state.cache.set(src, next);
    let image;
    try {
      image = new state.ImageCtor();
    } catch {
      state.cache.delete(src);
      return { ok: false, kind: state.kind, reason: "no-image", src };
    }
    image.onload = () => finish(state, next, src, image);
    image.onerror = () => failDecode(state, src);
    try {
      image.src = src;
    } catch {
      failDecode(state, src);
      return { ok: false, kind: state.kind, reason: "decode", src };
    }
    if (image.complete && (image.naturalWidth || image.width)) finish(state, next, src, image);
    if (state.broken === src) return { ok: false, kind: state.kind, reason: "decode", src };
    if (next.done && state.frame === src) return { ok: true, kind: state.kind, reason: "", src };
    if (next.done) return { ok: false, kind: state.kind, reason: "frame-size", src };
    if (!next.pending && !next.image) return { ok: false, kind: state.kind, reason: "decode", src };
    return { ok: true, kind: state.kind, reason: "", src, pending: !next.done };
  }

  function paintHeld(canvas, src, opts) {
    const css = cssSize(opts);
    let row = canvas && typeof canvas === "object" ? held.get(canvas) : null;
    if (!row || row.css !== css) {
      row = { css, surface: attach(canvas, Object.assign({}, opts, { cssSize: css })) };
      if (canvas && typeof canvas === "object") held.set(canvas, row);
    }
    return row.surface.paint(src);
  }

  function attach(canvas, opts) {
    const opened = openSurface(canvas, opts || {});
    const state = {
      ok: opened.ok,
      kind: opened.kind,
      reason: opened.reason,
      css: opened.css,
      dpr: opened.dpr,
      px: opened.px,
      off: opened.off,
      octx: opened.octx,
      bctx: opened.bctx,
      ctx: opened.ctx,
      ImageCtor: opened.ImageCtor,
      canvas,
      cache: new Map(),
      wanted: "",
      frame: "",
      broken: "",
      draws: 0,
      last: null,
    };
    mark(canvas, opened.ok ? opened.kind : "refused", "");
    return {
      ok: opened.ok,
      kind: opened.kind,
      reason: opened.reason,
      paint(src) {
        return paint(state, src);
      },
      frame() {
        return state.frame;
      },
      draws() {
        return state.draws;
      },
      last() {
        return state.last;
      },
    };
  }

  const api = {
    CSS,
    BOX,
    catalogFrame,
    fitContainBottom,
    backingOf,
    attach,
    paintHeld,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetSpriteSurface = api;
})(typeof window !== "undefined" ? window : globalThis);
