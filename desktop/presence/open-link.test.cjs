const assert = require("node:assert/strict");
const { EventEmitter } = require("node:events");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const OpenLink = require("./open-link.cjs");
const Presence = require("../presence.cjs");

const mainSrc = readFileSync(join(__dirname, "..", "main.cjs"), "utf8");
const linkSrc = readFileSync(join(__dirname, "open-link.cjs"), "utf8");

const REFUSED = [
  "javascript:alert(1)",
  " JavaScript:alert(1)",
  "data:text/html,<script>alert(1)</script>",
  "file:///C:/Users/keeper/Documents/secret.txt",
  "file:///etc/passwd",
  "blob:https://example.test/1234",
  "about:blank",
  "chrome://settings",
  "devtools://devtools/bundled/inspector.html",
  "vbscript:msgbox(1)",
  "mailto:keeper@example.test",
  "ftp://example.test/file",
  "ms-settings:privacy",
  "./Tilcayo",
  "//evil.test/path",
  "news.google.com/rss",
  "https://",
  "https://keeper:hunter2@example.test/",
  "https://example.test/a b",
  "https://example.test/\u0000",
  `https://example.test/${"a".repeat(2100)}`,
  "",
  null,
  undefined,
  42,
  { url: "https://example.test" },
];

function recorder() {
  const opened = [];
  const logs = [];
  return {
    opened,
    logs,
    deps: {
      openExternal: (url) => {
        opened.push(url);
        return Promise.resolve();
      },
      log: (line) => logs.push(line),
    },
  };
}

test("an http(s) link goes to the default browser once, as the normalized URL", () => {
  const r = recorder();
  const long = "https://news.google.com/rss/articles/CBMi" + "x".repeat(400) + "?oc=5&hl=en-US";
  for (const url of ["https://en.wikipedia.org/wiki/Tilcayo", "http://example.test/a?b=1&c=2", long, "HTTPS://Example.TEST/Path"]) {
    const out = OpenLink.openLink(url, r.deps);
    assert.equal(out.opened, true, url);
  }
  assert.deepEqual(r.opened, [
    "https://en.wikipedia.org/wiki/Tilcayo",
    "http://example.test/a?b=1&c=2",
    long,
    "https://example.test/Path",
  ]);
  assert.deepEqual(r.logs, []);
  assert.equal(OpenLink.linkHostLine("https://en.wikipedia.org/wiki/Tilcayo"), "Opens en.wikipedia.org in your browser");
  assert.equal(OpenLink.linkHostLine("javascript:alert(1)"), "");
});

test("every other scheme is refused, logged by scheme only, and never reaches the browser", () => {
  const r = recorder();
  for (const raw of REFUSED) {
    const out = OpenLink.openLink(raw, r.deps);
    assert.equal(out.opened, false, String(raw).slice(0, 40));
  }
  assert.deepEqual(r.opened, []);
  assert.equal(r.logs.length, REFUSED.length);
  r.logs.forEach((line) => assert.match(line, /^\[links\] refused /));
  // The log names the scheme and the reason, not the link's contents.
  assert.ok(r.logs.some((l) => /refused javascript: link/.test(l)));
  assert.ok(r.logs.some((l) => /refused data: link/.test(l)));
  assert.ok(r.logs.some((l) => /refused file: link/.test(l)));
  for (const line of r.logs) {
    assert.doesNotMatch(line, /alert|passwd|secret|hunter2|Documents/);
  }
});

test("a browser that fails to open is logged, not thrown", async () => {
  const logs = [];
  const out = OpenLink.openLink("https://example.test/", { openExternal: () => Promise.reject(new Error("no browser")), log: (l) => logs.push(l) });
  assert.equal(out.opened, true);
  await new Promise((r) => setImmediate(r));
  assert.deepEqual(logs, ["[links] the browser did not open example.test"]);
  const thrown = OpenLink.openLink("https://example.test/", {
    openExternal: () => {
      throw new Error("boom");
    },
    log: (l) => logs.push(l),
  });
  assert.equal(thrown.opened, false);
});

function fakeContents() {
  const contents = new EventEmitter();
  contents.windowOpen = null;
  contents.permissionRequest = null;
  contents.permissionCheck = null;
  contents.setWindowOpenHandler = (fn) => {
    contents.windowOpen = fn;
  };
  contents.session = {
    setPermissionRequestHandler: (fn) => {
      contents.permissionRequest = fn;
    },
    setPermissionCheckHandler: (fn) => {
      contents.permissionCheck = fn;
    },
  };
  return contents;
}

function navEvent() {
  return {
    prevented: false,
    preventDefault() {
      this.prevented = true;
    },
  };
}

test("the sealed overlay never navigates and never makes a window; web links go to the browser", () => {
  const r = recorder();
  const contents = fakeContents();
  const sealed = new WeakSet();
  assert.equal(OpenLink.sealContents(contents, { presence: Presence, sealed, ...r.deps }), true);
  assert.equal(OpenLink.sealContents(contents, { presence: Presence, sealed, ...r.deps }), false, "seals once");

  for (const name of ["will-navigate", "will-redirect", "will-frame-navigate"]) {
    for (const url of ["https://en.wikipedia.org/wiki/Tilcayo", "file:///C:/Windows/win.ini", "javascript:alert(1)"]) {
      const ev = navEvent();
      contents.emit(name, ev, url);
      assert.equal(ev.prevented, true, `${name} ${url}`);
    }
  }

  const answers = [];
  for (const url of ["https://en.wikipedia.org/wiki/Tilcayo", "http://example.test/", ...REFUSED.filter((u) => typeof u === "string")]) {
    answers.push(contents.windowOpen({ url, frameName: "", features: "", disposition: "foreground-tab" }));
  }
  assert.equal(answers.length > 2, true);
  // Every answer is deny: Electron makes no BrowserWindow for any link.
  answers.forEach((a) => assert.deepEqual(a, { action: "deny" }));
  assert.deepEqual(r.opened, ["https://en.wikipedia.org/wiki/Tilcayo", "http://example.test/"]);
  assert.ok(r.logs.length >= 10);

  // Permissions still go through Presence: nothing but a live weather locate.
  let granted = null;
  contents.permissionRequest(null, "media", (ok) => {
    granted = ok;
  });
  assert.equal(granted, false);
  assert.equal(contents.permissionCheck(null, "notifications"), false);
});

test("main seals both windows through open-link and creates no window for a link", () => {
  assert.match(mainSrc, /shell \} = require\("electron"\)/);
  assert.match(mainSrc, /OpenLink\.sealContents\(contents, \{/);
  assert.match(mainSrc, /openExternal: \(url\) => shell\.openExternal\(url\)/);
  assert.equal((mainSrc.match(/shell\.openExternal\(/g) || []).length, 1, "openExternal only through the link gate");
  assert.equal((mainSrc.match(/new BrowserWindow\(/g) || []).length, 2, "the overlay and the house window, nothing else");
  assert.equal((mainSrc.match(/sealDeskContents\((settingsWin|win)\.webContents\)/g) || []).length, 2);
  assert.doesNotMatch(mainSrc, /action: "allow"/);
  assert.doesNotMatch(linkSrc, /action: "allow"/);
  assert.doesNotMatch(mainSrc, /\.loadURL\(/);
  assert.doesNotMatch(linkSrc, /BrowserWindow|loadURL|webContents\.create/);
  assert.equal(Presence.allowNavigation("https://en.wikipedia.org/wiki/Tilcayo"), false);
});
