import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const repo = join(root, "..");

const startSrc = readFileSync(join(repo, "docs/START-HERE.md"), "utf8");
const readmeSrc = readFileSync(join(repo, "README.md"), "utf8");
const deskReadmeSrc = readFileSync(join(repo, "desktop/README.md"), "utf8");
const pkg = JSON.parse(readFileSync(join(repo, "desktop/package.json"), "utf8"));
const ps1Src = readFileSync(join(repo, "desktop.ps1"), "utf8");
const windowsSitSrc = readFileSync(join(root, "src/components/desk/windows-desk-sit.tsx"), "utf8");
const demoSrc = readFileSync(join(root, "src/components/desk/demo-stage.tsx"), "utf8");
const meetSrc = readFileSync(join(root, "src/routes/meet.tsx"), "utf8");
const overlayHtml = readFileSync(join(repo, "desktop/renderer/index.html"), "utf8");
const mainSrc = readFileSync(join(repo, "desktop/main.cjs"), "utf8");

const FAKE_STORE = [
  /ms-windows-store:/i,
  /microsoft\.com\/store\/productId/i,
  /9N[A-Z0-9]{12}/,
  /Get it from (the )?Microsoft Store/i,
  /Download from the Microsoft Store/i,
];

function firstIndex(src, pattern) {
  const match = src.match(pattern);
  assert.ok(match && match.index != null, `missing ${pattern}`);
  return match.index;
}

test("the first teaching point is a pet on the real Windows desktop", () => {
  assert.match(startSrc, /real Windows desktop/);
  assert.match(startSrc, /Windows 10 and Windows 11/);
  assert.match(startSrc, /What that looks like/);
  assert.match(readmeSrc, /Put a pet on your real desktop/);
  assert.match(readmeSrc, /readme-hero\.jpg/);
  assert.match(readmeSrc, /How to get your first pet/);
  assert.match(startSrc, /readme-rui\.jpg/);

  const picture = firstIndex(startSrc, /What that looks like/);
  const nodeStep = firstIndex(startSrc, /Step 2 — Install Node/);
  assert.ok(picture < nodeStep, "Node is taught after the pets-on-the-desk picture");

  const deskPicture = firstIndex(readmeSrc, /Put a pet on your real desktop/);
  const nodeHelper = firstIndex(readmeSrc, /nodejs\.org/);
  assert.ok(deskPicture < nodeHelper, "README names the desk walk before Node");
});

test("the honest download is GitHub plus the overlay, not a Store listing", () => {
  assert.match(startSrc, /There is no Microsoft Store button/);
  assert.match(startSrc, /no live Store ID/);
  assert.match(startSrc, /no magic `\.\exe` sitting on a website/);
  assert.match(readmeSrc, /There is no Steam, Itch, or Microsoft Store download yet/);
  assert.match(readmeSrc, /no live Store ID/);
  assert.match(deskReadmeSrc, /no Microsoft Store listing and no live Store ID/);
  assert.match(startSrc, /github\.com\/RicheyWorks\/computerpets/);
  for (const src of [startSrc, readmeSrc, deskReadmeSrc]) {
    for (const pattern of FAKE_STORE) {
      assert.doesNotMatch(src, pattern);
    }
    assert.doesNotMatch(src, /cyber-scorpion/);
    assert.doesNotMatch(src, /\bBus\b/);
  }
});

test("today's start is desktop.ps1 → npm start → electron .", () => {
  assert.match(startSrc, /desktop\.ps1/);
  assert.match(startSrc, /npm start/);
  assert.match(startSrc, /electron \./);
  assert.match(readmeSrc, /desktop\.ps1/);
  assert.match(readmeSrc, /electron \./);
  assert.equal(pkg.scripts.start, "electron .");
  assert.match(pkg.scripts.dist, /electron-builder/);
  assert.match(pkg.scripts["dist:win"], /electron-builder --win/);
  assert.match(ps1Src, /npm start/);
  assert.match(startSrc, /electron-builder/);
  assert.match(readmeSrc, /electron-builder/);
  assert.match(startSrc, /We do not publish one/);
});

test("the taught house is the overlay that runs: keeper card, On the desk, local care", () => {
  assert.match(startSrc, /keeper card/);
  assert.match(startSrc, /Hunger, Rest, Bond/);
  assert.match(startSrc, /\*\*Feed\*\*, \*\*Play\*\*, \*\*Rest\*\*/);
  assert.match(startSrc, /On the desk/);
  assert.match(startSrc, /Rui, Sip, Arc, Volt, Trace, Flux, Spark, Ion, Gauss, Relay, Fuse, Ground/);
  assert.match(startSrc, /House server · unreachable/);
  assert.doesNotMatch(startSrc, /Java 8081 · DOWN · unread/);
  assert.match(startSrc, /Care is local/);
  assert.match(startSrc, /\/pet\/feed` is not a door/);
  assert.match(startSrc, /Clicks on empty glass pass through/);
  assert.match(readmeSrc, /On the desk/);
  assert.match(readmeSrc, /keeper card/);

  assert.match(overlayHtml, /class="keeper-card"/);
  assert.match(overlayHtml, /data-care="feed"/);
  assert.match(mainSrc, /label: "On the desk"/);
  assert.match(windowsSitSrc, /On the desk/);
  assert.match(demoSrc, /WindowsDeskSit/);
  assert.match(meetSrc, /On Windows they walk on the real desktop/);
});

test("the browser door comes after, and /demo stays the same house", () => {
  const deskQuest = firstIndex(startSrc, /Put Rui on your real desktop/);
  const browser = firstIndex(startSrc, /Another way to visit them \(browser\)/);
  assert.ok(deskQuest < browser, "browser is taught after the desktop walk");
  assert.match(startSrc, /localhost:8080\/demo\/rui/);
  assert.match(startSrc, /localhost:8080\/demo\/crackle/);
  assert.match(startSrc, /same house as the overlay/);
  assert.match(readmeSrc, /Spark's room is `\/demo\/crackle`/);
  assert.match(readmeSrc, /Another way to visit them \(browser\)/);
  const readmeDesk = firstIndex(readmeSrc, /Put a pet on your real desktop/);
  const readmeBrowser = firstIndex(readmeSrc, /Another way to visit them \(browser\)/);
  assert.ok(readmeDesk < readmeBrowser);
});

test("START-HERE tells the honest house count without owning house-count", () => {
  assert.match(startSrc, /There are \*\*221\*\* animals/);
  assert.match(startSrc, /all \*\*221\*\*/);
  assert.doesNotMatch(startSrc, /\*\*211\*\*/);
  assert.doesNotMatch(startSrc, /\*\*219\*\*/);
  assert.doesNotMatch(startSrc, /\*\*220\*\*/);
  assert.match(readmeSrc, /There are \*\*221\*\* animals/);
  assert.match(readmeSrc, /Two hundred twenty-one living kinds/);
});

const clientReadmeSrc = readFileSync(join(repo, "client/README.md"), "utf8").replace(/\r\n/g, "\n");
const clientPyproject = readFileSync(join(repo, "client/pyproject.toml"), "utf8");
const clientMain = readFileSync(join(repo, "client/computerpets_client/__main__.py"), "utf8");
const clientApp = readFileSync(join(repo, "client/computerpets_client/app.py"), "utf8");
const clientSession = readFileSync(join(repo, "client/computerpets_client/license/session.py"), "utf8");

function fences(src, lang) {
  const out = [];
  const re = new RegExp("```" + lang + "\\n([\\s\\S]*?)```", "g");
  for (let m = re.exec(src); m; m = re.exec(src)) out.push(m[1].trimEnd().split("\n"));
  return out;
}

function sectionOf(src, heading) {
  const start = src.indexOf(`\n## ${heading}\n`);
  assert.ok(start >= 0, `missing ## ${heading}`);
  const next = src.indexOf("\n## ", start + 4);
  return src.slice(start, next < 0 ? src.length : next);
}

test("START-HERE teaches the blotter as an optional side door in PowerShell", () => {
  const start = startSrc.replace(/\r\n/g, "\n");
  const blotter = sectionOf(start, "Blotter (optional)");
  const browser = firstIndex(start, /## Another way to visit them \(browser\)/);
  const blotterAt = firstIndex(start, /## Blotter \(optional\)/);
  const done = firstIndex(start, /## You did it/);
  assert.ok(browser < blotterAt && blotterAt < done, "the blotter comes after the desktop walk and the browser");
  assert.match(blotter, /This is \*\*not\*\* the main quest/);
  assert.match(blotter, /You do not need a backend\. You do not need a license key\./);
  assert.match(blotter, /Python 3\.11 or newer/);
  const boxes = fences(blotter, "powershell");
  assert.ok(boxes.length >= 3);
  for (const lines of boxes) assert.match(lines[0], /^cd client$/, "each box starts with cd");
  const all = boxes.flat().join("\n");
  assert.match(all, /^py -3 -m venv \.venv$/m);
  assert.match(all, /^\.\\\.venv\\Scripts\\Activate\.ps1$/m);
  assert.match(all, /^python -m pip install -e \.$/m);
  assert.match(all, /^python -m computerpets_client$/m);
  assert.match(all, /^\.\\\.venv\\Scripts\\python\.exe -m computerpets_client$/m);
  assert.doesNotMatch(blotter, /```bash|source \.venv|export /);
  assert.match(blotter, /ComputerPets — blotter/);
  assert.match(clientApp, /setWindowTitle\("ComputerPets — blotter"\)/);
});

test("client README runs in bash and PowerShell, and says backend and key are optional", () => {
  const run = sectionOf(clientReadmeSrc, "Run");
  assert.match(run, /The backend URL and the license key are optional\./);
  assert.match(run, /The blotter pets walk\s+without\s+them\./);
  const bash = fences(run, "bash").flat().join("\n");
  const ps = fences(run, "powershell").flat().join("\n");
  for (const [shell, src] of [["bash", bash], ["powershell", ps]]) {
    assert.match(src, /^cd client$/m, `${shell} starts in client`);
    assert.match(src, /-m venv \.venv/, `${shell} makes the venv`);
    assert.match(src, /pip install -e "\.\[dev\]"/, `${shell} installs from pyproject`);
    assert.match(src, /^python -m computerpets_client$/m, `${shell} runs the package`);
    assert.match(src, /COMPUTERPETS_BACKEND_URL/, `${shell} shows the optional backend`);
    assert.match(src, /LICENSE_SECRET_KEY/, `${shell} shows the optional key`);
    assert.match(src, /computerpets_client --check/, `${shell} has the headless smoke`);
  }
  assert.match(bash, /^source \.venv\/bin\/activate$/m);
  assert.match(ps, /^py -3 -m venv \.venv$/m);
  assert.match(ps, /^\.\\\.venv\\Scripts\\Activate\.ps1$/m);
  assert.match(ps, /^\$env:COMPUTERPETS_BACKEND_URL = "http:\/\/127\.0\.0\.1:8081"$/m);
  assert.match(ps, /^\$env:LICENSE_SECRET_KEY = /m);
  assert.doesNotMatch(ps, /\bexport\b|\bsource\b|QT_QPA_PLATFORM=/, "no bash syntax in the PowerShell boxes");
  // The commands match the real client: package entry, script name, python floor, env names, default backend, --check offscreen.
  assert.match(clientMain, /from \.app import main/);
  assert.match(clientPyproject, /computerpets-client = "computerpets_client\.app:main"/);
  assert.match(run, /`computerpets-client` is the same entry/);
  assert.match(clientPyproject, /requires-python = ">=3\.11"/);
  assert.match(run, /Python 3\.11\+/);
  assert.match(clientPyproject, /dev = \["pytest>=8"\]/);
  assert.match(clientSession, /env\.get\("COMPUTERPETS_BACKEND_URL"\)/);
  assert.match(clientSession, /env\.get\("LICENSE_SECRET_KEY"\)/);
  assert.match(clientSession, /DEFAULT_BACKEND = "http:\/\/127\.0\.0\.1:8081"/);
  assert.match(run, /Without `COMPUTERPETS_BACKEND_URL`, Unlock uses `http:\/\/127\.0\.0\.1:8081`\./);
  assert.match(clientApp, /if args\.offscreen or args\.check:\r?\n\s+os\.environ\.setdefault\("QT_QPA_PLATFORM", "offscreen"\)/);
});