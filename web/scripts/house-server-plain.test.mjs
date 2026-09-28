import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const repo = join(root, "..");
const read = (...parts) => readFileSync(join(repo, ...parts), "utf8");
const require = createRequire(import.meta.url);

test("Settings and the blotter call it the house server, in plain words", () => {
  const settings = read("desktop", "renderer", "settings.html");
  const dialog = read("client", "computerpets_client", "unlock_dialog.py");
  assert.match(settings, /<label>House server address<\/label>/);
  assert.match(settings, /licenseOk\.textContent = "Asking the house server…";/);
  assert.match(settings, /by asking the house server named under House server address\./);
  assert.match(dialog, /form\.addRow\("House server address", self\.backend\)/);
  assert.match(dialog, /self\.ok\.setText\("Asking the house server…"\)/);
  assert.match(dialog, /Unlock proves Steam ownership to the house server\./);
  for (const [name, src] of [["settings.html", settings], ["unlock_dialog.py", dialog]]) {
    assert.doesNotMatch(src, /Talking to the backend|house backend|under Backend URL|<label>Backend URL|"Backend URL"/, name);
    assert.match(src, /The line under the house server address names the website before the code is sent\./, name);
    assert.match(src, /If the house server is on this computer, the code stays on this computer\./, name);
  }
});

test("license errors point at the house server address, the same on the overlay and the blotter", () => {
  const P = require(join(repo, "desktop", "license", "plain-error.cjs"));
  const js = read("desktop", "license", "plain-error.cjs");
  const py = read("client", "computerpets_client", "license", "plain_error.py");
  assert.doesNotMatch(js + py, /Backend URL/);
  const need = "The house server address needs to be a web address, like http://127.0.0.1:8081 or https://house.example.";
  assert.ok(js.includes(need) && py.includes(need));
  assert.ok(js.includes("Check the house server address.") && py.includes("Check the house server address."));
  const missing = P.plainLicenseError(Object.assign(new Error("backend base URL is not a URL"), { code: "missing_backend" }));
  assert.equal(missing.message, `${need} Pets still work without it.`);
  const house = read("desktop", "house-server.cjs");
  assert.match(house, /const BAD_URL = "That house server address does not start with http or https, so it was not saved\.";/);
});

test("the admin page's fallback lines are whole sentences, not 'Unlock failed.'", () => {
  const api = readFileSync(join(root, "src", "lib", "admin", "api.ts"), "utf8");
  const page = readFileSync(join(root, "src", "routes", "admin.tsx"), "utf8");
  const block = api.slice(api.indexOf("export const ADMIN_FALLBACK = {"), api.indexOf("} as const;", api.indexOf("export const ADMIN_FALLBACK = {")));
  const lines = Object.fromEntries([...block.matchAll(/^\s+(unlock|lookup|revoke): "([^"]+)",\r?$/gm)].map((m) => [m[1], m[2]]));
  assert.deepEqual(lines, {
    unlock: "Couldn't open the license list. Try again in a moment.",
    lookup: "Couldn't look up those licenses. Try again in a moment.",
    revoke: "The license was not revoked. Try again in a moment.",
  });
  assert.doesNotMatch(api + page, /"(Unlock|Lookup|Revoke) failed\."/);
  for (const k of ["unlock", "lookup", "revoke"]) assert.match(page, new RegExp(`showError\\(err, ADMIN_FALLBACK\\.${k}\\);`));
});

test("the license fallbacks say the license website and the download website in all three places", () => {
  const Main = require(join(repo, "desktop", "license", "license-net.cjs"));
  const Page = require(join(repo, "desktop", "renderer", "license-net.js"));
  const py = read("client", "computerpets_client", "license", "license_net.py");
  for (const M of [Main, Page]) {
    assert.equal(M.LICENSE_HOST_NAME, "the license website");
    assert.equal(M.BUNDLE_HOST_NAME, "the download website");
  }
  assert.match(py, /^LICENSE_HOST_NAME = "the license website"\r?$/m);
  assert.match(py, /^BUNDLE_HOST_NAME = "the download website"\r?$/m);
});

test("the news and quotes file headers are plain and name the right websites", () => {
  const heads = {
    newsJs: read("desktop", "renderer", "news.js"),
    newsTs: readFileSync(join(root, "src", "lib", "pets", "news.ts"), "utf8"),
    marketJs: read("desktop", "renderer", "market.js"),
    marketTs: readFileSync(join(root, "src", "lib", "pets", "market.ts"), "utf8"),
  };
  for (const [name, src] of Object.entries(heads)) {
    const head = src.split(/\r?\n/)[0];
    assert.doesNotMatch(head, /rejects|late body|RSS|unread|invented/, name);
    assert.match(head, /does not answer in twelve seconds counts as a miss/, name);
    assert.match(head, /an answer that comes later is thrown away\./, name);
    if (name.startsWith("news")) {
      assert.match(head, /\(Google News or Wikipedia\)/, name);
      assert.doesNotMatch(head, /CoinGecko|GeckoTerminal|Yahoo/, name);
    } else {
      assert.match(head, /\(CoinGecko, GeckoTerminal, or Yahoo Finance\)/, name);
      assert.doesNotMatch(head, /Google News|Wikipedia/, name);
    }
  }
});

test("ADR 0036 and 0037 titles are plain and match the index; 0019 has a plain-words note", () => {
  const dir = join(repo, "docs", "adr");
  const file = (n) => readdirSync(dir).find((f) => f.startsWith(`${n}-`));
  const title = (n) => (readFileSync(join(dir, file(n)), "utf8").match(/^# \d{4}\. (.+?)\r?$/m) || [])[1];
  const index = readFileSync(join(dir, "README.md"), "utf8");
  assert.equal(title("0036"), "Cloud talk and cloud voice say this computer's internet address goes to that website");
  assert.equal(title("0037"), "Unlock names the license website before the code made from this computer's ID is sent");
  for (const n of ["0036", "0037"]) {
    assert.ok(index.includes(`[${n}](${file(n)}) | ${title(n)} |`), n);
  }
  const adr19 = readFileSync(join(dir, file("0019")), "utf8");
  assert.match(adr19, /- \*\*Plain words \(2026-09-27\):\*\* "device fingerprint" below means a code that stays the same for this computer/);
  assert.match(adr19, /The decision is unchanged\./);
});
