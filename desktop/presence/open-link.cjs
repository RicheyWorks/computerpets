"use strict";

/**
 * Overlay links open in the keeper's own browser, never in an Electron window.
 *
 * A headline, Wikipedia, or favorite link on the overlay is an <a target="_blank">.
 * Chromium hands that click to the window-open handler. The handler lets only a plain
 * http(s) web page through to the operating system's default browser (shell.openExternal)
 * and always answers "deny", so Electron never creates a window for it. Every other
 * scheme (javascript:, data:, file:, blob:, about:, chrome:, mailto:, ...) is refused and
 * logged by scheme only; the rest of the link is not written to the log.
 *
 * The overlay itself still never navigates: sealContents refuses will-navigate,
 * will-redirect, and will-frame-navigate for every URL, web pages included.
 */

const LINK_CHARS = 2048;
const OPEN_SCHEMES = Object.freeze(["http:", "https:"]);

function schemeOf(text) {
  const m = /^([a-z][a-z0-9+.-]*):/i.exec(String(text || "").trim());
  return m ? `${m[1].toLowerCase()}:` : "none";
}

/**
 * @param {unknown} raw
 * @returns {{ open: boolean, url: string, host: string, scheme: string, reason: string }}
 */
function linkVerdict(raw) {
  const no = (reason, scheme) => ({ open: false, url: "", host: "", scheme: scheme || "none", reason });
  if (typeof raw !== "string") return no("not text");
  const text = raw.trim();
  if (!text) return no("empty");
  const scheme = schemeOf(text);
  if (text.length > LINK_CHARS) return no("too long", scheme);
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u0020\u007f]/.test(text)) return no("space or control character", scheme);
  if (OPEN_SCHEMES.indexOf(scheme) === -1) return no(`scheme ${scheme} is not a web page`, scheme);
  let url;
  try {
    url = new URL(text);
  } catch {
    return no("not a URL", scheme);
  }
  if (OPEN_SCHEMES.indexOf(url.protocol) === -1) return no(`scheme ${url.protocol} is not a web page`, url.protocol);
  if (!url.hostname) return no("no host", scheme);
  if (url.username || url.password) return no("a name or password in the link", scheme);
  return { open: true, url: url.href, host: url.host, scheme: url.protocol, reason: "" };
}

/** The line a link carries before it is clicked: which host the browser will open. */
function linkHostLine(raw) {
  const v = linkVerdict(raw);
  return v.open ? `Opens ${v.host} in your browser` : "";
}

/**
 * Hand one link to the default browser if it is a web page. Never throws.
 * @param {unknown} raw
 * @param {{ openExternal: (url: string) => unknown, log?: (line: string) => void }} deps
 */
function openLink(raw, deps) {
  const log = deps && typeof deps.log === "function" ? deps.log : () => {};
  const v = linkVerdict(raw);
  if (!v.open) {
    log(`[links] refused ${v.scheme} link: ${v.reason}`);
    return { opened: false, reason: v.reason, scheme: v.scheme };
  }
  try {
    const done = deps.openExternal(v.url);
    if (done && typeof done.then === "function") {
      done.then(
        () => {},
        () => log(`[links] the browser did not open ${v.host}`),
      );
    }
  } catch {
    log(`[links] the browser did not open ${v.host}`);
    return { opened: false, reason: "openExternal failed", scheme: v.scheme };
  }
  return { opened: true, reason: "", scheme: v.scheme, host: v.host };
}

/** The overlay's window-open handler. Always "deny": no Electron window is ever made. */
function windowOpenHandler(deps) {
  return (details) => {
    openLink(details && details.url, deps);
    return { action: "deny" };
  };
}

/**
 * Seal one renderer's webContents. Navigation stays refused for every URL, the
 * window-open handler sends web pages to the browser and denies the window, and
 * permissions go through Presence.
 * @param {any} contents
 * @param {{ presence: { allowNavigation: (url?: string) => boolean, allowPermission: (p: string) => boolean },
 *   openExternal: (url: string) => unknown, log?: (line: string) => void, sealed?: WeakSet<object> }} deps
 */
function sealContents(contents, deps) {
  if (!contents) return false;
  const sealed = deps.sealed;
  if (sealed && sealed.has(contents)) return false;
  if (sealed) sealed.add(contents);
  const presence = deps.presence;
  const refuseNav = (event, url) => {
    if (!presence.allowNavigation(url)) event.preventDefault();
  };
  contents.on("will-navigate", refuseNav);
  contents.on("will-redirect", refuseNav);
  contents.on("will-frame-navigate", refuseNav);
  if (typeof contents.setWindowOpenHandler === "function") {
    contents.setWindowOpenHandler(windowOpenHandler(deps));
  }
  const session = contents.session;
  if (session && typeof session.setPermissionRequestHandler === "function") {
    session.setPermissionRequestHandler((_wc, permission, callback) => {
      callback(presence.allowPermission(permission));
    });
  }
  if (session && typeof session.setPermissionCheckHandler === "function") {
    session.setPermissionCheckHandler((_wc, permission) => presence.allowPermission(permission));
  }
  return true;
}

module.exports = {
  LINK_CHARS,
  OPEN_SCHEMES,
  linkVerdict,
  linkHostLine,
  openLink,
  windowOpenHandler,
  sealContents,
};
