// A small DOM, just enough for react-dom/client to mount the desk's pets in a plain Node test.
// No jsdom in this repo: this keeps the mount tests free of new packages. It does elements, text,
// attributes, style, dataset, events (listeners only), querySelector by [attr] / [attr="v"] / tag,
// a canvas with a 2D context, Image that loads at once, and a requestAnimationFrame queue that the
// test steps by hand with a fake clock.

const HTML_NS = "http://www.w3.org/1999/xhtml";

function camelToKebab(name) {
  return name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
}

function kebabToCamel(name) {
  return name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function makeStyle() {
  const values = new Map();
  const target = {
    setProperty(name, value) {
      values.set(name, String(value));
    },
    removeProperty(name) {
      values.delete(name);
    },
    getPropertyValue(name) {
      return values.get(name) ?? "";
    },
  };
  return new Proxy(target, {
    get(t, key) {
      if (key in t) return t[key];
      if (typeof key !== "string") return undefined;
      return values.get(camelToKebab(key)) ?? "";
    },
    set(t, key, value) {
      if (typeof key !== "string") return false;
      const name = camelToKebab(key);
      if (value === "" || value == null) values.delete(name);
      else values.set(name, String(value));
      return true;
    },
  });
}

class Node {
  constructor(doc, nodeType, nodeName) {
    this.ownerDocument = doc;
    this.nodeType = nodeType;
    this.nodeName = nodeName;
    this.parentNode = null;
    this.childNodes = [];
    this.listeners = new Map();
  }
  get firstChild() {
    return this.childNodes[0] ?? null;
  }
  get lastChild() {
    return this.childNodes[this.childNodes.length - 1] ?? null;
  }
  get nextSibling() {
    const p = this.parentNode;
    if (!p) return null;
    return p.childNodes[p.childNodes.indexOf(this) + 1] ?? null;
  }
  get previousSibling() {
    const p = this.parentNode;
    if (!p) return null;
    const i = p.childNodes.indexOf(this);
    return i > 0 ? p.childNodes[i - 1] : null;
  }
  get parentElement() {
    return this.parentNode && this.parentNode.nodeType === 1 ? this.parentNode : null;
  }
  appendChild(child) {
    return this.insertBefore(child, null);
  }
  insertBefore(child, ref) {
    if (child.nodeType === 11) {
      for (const c of [...child.childNodes]) this.insertBefore(c, ref);
      return child;
    }
    if (child.parentNode) child.parentNode.removeChild(child);
    const i = ref ? this.childNodes.indexOf(ref) : -1;
    if (i < 0) this.childNodes.push(child);
    else this.childNodes.splice(i, 0, child);
    child.parentNode = this;
    return child;
  }
  removeChild(child) {
    const i = this.childNodes.indexOf(child);
    if (i >= 0) this.childNodes.splice(i, 1);
    child.parentNode = null;
    return child;
  }
  contains(node) {
    for (let n = node; n; n = n.parentNode) if (n === this) return true;
    return false;
  }
  get textContent() {
    if (this.nodeType === 3 || this.nodeType === 8) return this.data;
    return this.childNodes.map((c) => c.textContent).join("");
  }
  set textContent(value) {
    if (this.nodeType === 3 || this.nodeType === 8) {
      this.data = String(value);
      return;
    }
    for (const c of this.childNodes) c.parentNode = null;
    this.childNodes = [];
    if (value !== "" && value != null) this.appendChild(this.ownerDocument.createTextNode(String(value)));
  }
  addEventListener(type, fn) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type).add(fn);
  }
  removeEventListener(type, fn) {
    this.listeners.get(type)?.delete(fn);
  }
  dispatchEvent() {
    return true;
  }
}

class Text extends Node {
  constructor(doc, data) {
    super(doc, 3, "#text");
    this.data = String(data);
  }
  get nodeValue() {
    return this.data;
  }
  set nodeValue(v) {
    this.data = String(v);
  }
}

class Comment extends Node {
  constructor(doc, data) {
    super(doc, 8, "#comment");
    this.data = String(data);
  }
}

class Element extends Node {
  constructor(doc, tag, ns = HTML_NS) {
    const upper = ns === HTML_NS ? tag.toUpperCase() : tag;
    super(doc, 1, upper);
    this.tagName = upper;
    this.localName = tag.toLowerCase();
    this.namespaceURI = ns;
    this.attributes = new Map();
    this.style = makeStyle();
    const attrs = this.attributes;
    const name = (key) => `data-${camelToKebab(String(key))}`;
    this.dataset = new Proxy(
      {},
      {
        get: (_, key) => (typeof key === "string" ? attrs.get(name(key)) : undefined),
        set: (_, key, value) => {
          attrs.set(name(key), String(value));
          return true;
        },
        deleteProperty: (_, key) => {
          attrs.delete(name(key));
          return true;
        },
        has: (_, key) => attrs.has(name(key)),
        ownKeys: () => [...attrs.keys()].filter((k) => k.startsWith("data-")).map((k) => kebabToCamel(k.slice(5))),
        getOwnPropertyDescriptor: (_, key) => {
          const v = attrs.get(name(key));
          return v === undefined ? undefined : { value: v, enumerable: true, configurable: true, writable: true };
        },
      },
    );
  }
  get children() {
    return this.childNodes.filter((c) => c.nodeType === 1);
  }
  setAttribute(name, value) {
    if (name === "style") return;
    this.attributes.set(name, String(value));
  }
  setAttributeNS(_ns, name, value) {
    this.setAttribute(name, value);
  }
  getAttribute(name) {
    return this.attributes.has(name) ? this.attributes.get(name) : null;
  }
  hasAttribute(name) {
    return this.attributes.has(name);
  }
  removeAttribute(name) {
    this.attributes.delete(name);
  }
  removeAttributeNS(_ns, name) {
    this.removeAttribute(name);
  }
  get className() {
    return this.getAttribute("class") ?? "";
  }
  set className(v) {
    this.setAttribute("class", v);
  }
  get id() {
    return this.getAttribute("id") ?? "";
  }
  /** A <select>'s <option> list: react-dom marks each one `selected` to match the select's value. */
  get options() {
    return this.localName === "select" ? this.querySelectorAll("option") : undefined;
  }
  /** An <option> with no value attribute reads its text, as in a browser. */
  get value() {
    if (this._value !== undefined) return this._value;
    const attr = this.getAttribute("value");
    if (attr != null) return attr;
    return this.localName === "option" ? this.textContent : "";
  }
  set value(v) {
    this._value = String(v);
  }
  getBoundingClientRect() {
    const w = this.ownerDocument.defaultView.innerWidth;
    const h = this.ownerDocument.defaultView.innerHeight;
    return { x: 0, y: 0, left: 0, top: 0, right: w, bottom: h, width: w, height: h };
  }
  focus() {
    this.ownerDocument.activeElement = this;
  }
  blur() {
    this.ownerDocument.activeElement = this.ownerDocument.body;
  }
  matches(selector) {
    return matchOne(this, selector);
  }
  closest(selector) {
    if (matchOne(this, selector)) return this;
    const up = this.parentNode;
    return up && up.nodeType === 1 ? up.closest(selector) : null;
  }
  querySelectorAll(selector) {
    const out = [];
    const walk = (node) => {
      for (const c of node.childNodes) {
        if (c.nodeType !== 1) continue;
        if (selector.split(",").some((s) => matchOne(c, s.trim()))) out.push(c);
        walk(c);
      }
    };
    walk(this);
    return out;
  }
  querySelector(selector) {
    return this.querySelectorAll(selector)[0] ?? null;
  }
}

/** One simple selector: `tag`, `[attr]`, `[attr="v"]`, or `tag[attr="v"]`. */
function matchOne(el, selector) {
  const m = /^([a-zA-Z][\w-]*)?((?:\[[^\]]+\])*)$/.exec(selector);
  if (!m) return false;
  if (m[1] && el.localName !== m[1].toLowerCase()) return false;
  const attrs = m[2] ? m[2].match(/\[[^\]]+\]/g) : [];
  for (const part of attrs) {
    const a = /^\[([\w-]+)(?:=["']?([^"'\]]*)["']?)?\]$/.exec(part);
    if (!a) return false;
    if (!el.hasAttribute(a[1])) return false;
    if (a[2] !== undefined && el.getAttribute(a[1]) !== a[2]) return false;
  }
  return true;
}

class HTMLElement extends Element {}
class HTMLIFrameElement extends HTMLElement {}
class SVGElement extends Element {}

/** A 2D context that records what was drawn and draws nothing. */
function makeContext2d(canvas) {
  const calls = [];
  const noop = (name) => (...args) => {
    calls.push([name, ...args]);
  };
  return {
    canvas,
    calls,
    drawImage: noop("drawImage"),
    clearRect: noop("clearRect"),
    fillRect: noop("fillRect"),
    setTransform: noop("setTransform"),
    resetTransform: noop("resetTransform"),
    save: noop("save"),
    restore: noop("restore"),
    scale: noop("scale"),
    translate: noop("translate"),
    imageSmoothingEnabled: true,
    imageSmoothingQuality: "high",
    globalAlpha: 1,
  };
}

class HTMLCanvasElement extends HTMLElement {
  constructor(doc) {
    super(doc, "canvas");
    this.width = 300;
    this.height = 150;
    this.ctx2d = null;
  }
  getContext(type) {
    if (type !== "2d") return null;
    if (!this.ctx2d) this.ctx2d = makeContext2d(this);
    return this.ctx2d;
  }
}

class Document extends Node {
  constructor(win) {
    super(null, 9, "#document");
    this.ownerDocument = null;
    this.defaultView = win;
    this.documentElement = this.createElement("html");
    this.head = this.createElement("head");
    this.body = this.createElement("body");
    this.documentElement.appendChild(this.head);
    this.documentElement.appendChild(this.body);
    this.appendChild(this.documentElement);
    this.activeElement = this.body;
  }
  createElement(tag) {
    const t = String(tag).toLowerCase();
    if (t === "canvas") return new HTMLCanvasElement(this);
    if (t === "iframe") return new HTMLIFrameElement(this, t);
    return new HTMLElement(this, t);
  }
  createElementNS(ns, tag) {
    if (ns === HTML_NS) return this.createElement(tag);
    return new SVGElement(this, tag, ns);
  }
  createTextNode(data) {
    return new Text(this, data);
  }
  createComment(data) {
    return new Comment(this, data);
  }
  createDocumentFragment() {
    return new Node(this, 11, "#document-fragment");
  }
  getElementById(id) {
    return this.documentElement.querySelector(`[id="${id}"]`);
  }
  querySelectorAll(selector) {
    return this.documentElement.querySelectorAll(selector);
  }
  querySelector(selector) {
    return this.documentElement.querySelector(selector);
  }
  getSelection() {
    return null;
  }
}

/** An Image that "loads" as soon as its src is set, 64 by 64. */
class Image {
  constructor() {
    this.onload = null;
    this.onerror = null;
    this.complete = false;
    this.naturalWidth = 0;
    this.naturalHeight = 0;
    this.width = 0;
    this.height = 0;
    this._src = "";
    this.decoding = "auto";
  }
  get src() {
    return this._src;
  }
  set src(v) {
    this._src = String(v);
    this.complete = true;
    this.naturalWidth = this.width = 64;
    this.naturalHeight = this.height = 64;
  }
  decode() {
    return Promise.resolve();
  }
}

/** A small seeded random (mulberry32): the same seed gives the same numbers on every run and every computer. */
export function seededRandom(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * The seed a mount test starts from. The desk's flights, waits, and dances roll Math.random.
 * COMPUTERPETS_MOUNT_SEED picks another one, to sweep many seeds when hunting a flake.
 */
export const MOUNT_SEED = Number(process.env.COMPUTERPETS_MOUNT_SEED) || 20260927;

/**
 * Installs the DOM on globalThis. Call before importing react-dom. Returns the test's handles:
 * `frames(n, ms)` runs n animation frames `ms` apart on the fake clock; `logs` has console.warn lines.
 * Math.random is seeded (`seed`, default MOUNT_SEED), so a run is the same every time; `reseed(n)` starts a new
 * stream and `restoreRandom()` puts the real one back. Timers stay real, but no mounted desk loop uses one.
 */
export function installDom({ width = 1000, height = 600, seed = MOUNT_SEED } = {}) {
  let clock = 1000;
  const realRandom = Math.random;
  Math.random = seededRandom(seed);
  let nextId = 1;
  let queue = new Map();
  const win = {
    innerWidth: width,
    innerHeight: height,
    devicePixelRatio: 1,
    listeners: new Map(),
    addEventListener(type, fn) {
      if (!this.listeners.has(type)) this.listeners.set(type, new Set());
      this.listeners.get(type).add(fn);
    },
    removeEventListener(type, fn) {
      this.listeners.get(type)?.delete(fn);
    },
    dispatchEvent() {
      return true;
    },
    matchMedia: (query) => ({ matches: false, media: query, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }),
    requestAnimationFrame(fn) {
      const id = nextId++;
      queue.set(id, fn);
      return id;
    },
    cancelAnimationFrame(id) {
      queue.delete(id);
    },
    getComputedStyle: () => makeStyle(),
    getSelection: () => null,
    setTimeout: (...a) => setTimeout(...a),
    clearTimeout: (id) => clearTimeout(id),
    setInterval: (...a) => setInterval(...a),
    clearInterval: (id) => clearInterval(id),
  };
  const doc = new Document(win);
  win.document = doc;
  win.window = win;
  win.navigator = { platform: "Win32", userAgent: "mount-test", maxTouchPoints: 0 };
  win.HTMLElement = HTMLElement;
  win.HTMLCanvasElement = HTMLCanvasElement;
  win.HTMLIFrameElement = HTMLIFrameElement;
  win.Element = Element;
  win.Node = Node;
  win.Image = Image;
  const store = new Map();
  win.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
  };
  const perf = { now: () => clock, timeOrigin: 0, mark() {}, measure() {} };
  win.performance = perf;

  const put = (name, value) => Object.defineProperty(globalThis, name, { value, configurable: true, writable: true });
  put("window", win);
  put("document", doc);
  put("navigator", win.navigator);
  put("HTMLElement", HTMLElement);
  put("HTMLCanvasElement", HTMLCanvasElement);
  put("HTMLIFrameElement", HTMLIFrameElement);
  put("Element", Element);
  put("Node", Node);
  put("Image", Image);
  put("localStorage", win.localStorage);
  put("performance", perf);
  put("matchMedia", win.matchMedia);
  put("requestAnimationFrame", win.requestAnimationFrame.bind(win));
  put("cancelAnimationFrame", win.cancelAnimationFrame.bind(win));
  put("IS_REACT_ACT_ENVIRONMENT", true);

  const logs = [];
  const warn = console.warn;
  console.warn = (...args) => {
    logs.push(args.map(String).join(" "));
  };

  return {
    window: win,
    document: doc,
    logs,
    restoreConsole() {
      console.warn = warn;
    },
    /** Starts Math.random again from `n`. */
    reseed(n) {
      Math.random = seededRandom(n);
    },
    restoreRandom() {
      Math.random = realRandom;
    },
    now: () => clock,
    pending: () => queue.size,
    /** Runs `n` animation frames, `ms` apart. Each frame runs what was asked for before it began. */
    frames(n, ms = 16) {
      for (let i = 0; i < n; i++) {
        clock += ms;
        const due = queue;
        queue = new Map();
        for (const fn of due.values()) fn(clock);
      }
    },
  };
}
