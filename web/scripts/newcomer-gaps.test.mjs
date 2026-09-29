import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

// Newcomer product-gap pass (September 2026): a first-time Windows keeper followed README and START-HERE
// literally. Each test pins one gap that walk found, so the words stay true to what the app and Windows do.
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const repo = join(root, "..");
const read = (...p) => readFileSync(join(...p), "utf8").replace(/\r\n/g, "\n");
const readme = read(repo, "README.md");
const start = read(repo, "docs/START-HERE.md");
const webReadme = read(root, "README.md");

/** From a heading line to the next heading of the same or higher level. */
function section(src, heading) {
  const at = src.indexOf(heading);
  assert.ok(at >= 0, `missing ${heading}`);
  const level = heading.match(/^#+/)[0].length;
  const rest = src.slice(at + heading.length);
  const next = rest.search(new RegExp(`\\n#{1,${level}} `));
  return next < 0 ? rest : rest.slice(0, next);
}

test("scripts disabled: the first fallback is the one-window Bypass start, and the three-line start types npm.cmd", () => {
  // Windows' default policy stops .\desktop.ps1 and also plain `npm` (PowerShell resolves it to npm.ps1).
  const bypass = "powershell -ExecutionPolicy Bypass -File .\\desktop.ps1";
  const desk = section(start, "### If Windows says it will not run scripts");
  assert.ok(desk.includes(bypass), "START-HERE names the Bypass start");
  assert.match(desk, /running scripts is disabled on this system/);
  assert.match(desk, /It changes nothing for good\./);
  assert.match(desk, /^cd desktop\nnpm\.cmd install\nnpm\.cmd start$/m);
  assert.doesNotMatch(desk, /^npm (install|start)$/m, "bare npm is a script and is blocked too");
  assert.ok(desk.indexOf(bypass) < desk.indexOf("npm.cmd install"), "the script start stays first");

  assert.ok(readme.includes(bypass), "README names the Bypass start");
  assert.match(readme, /^cd desktop\nnpm\.cmd install\nnpm\.cmd start$/m);
  assert.doesNotMatch(readme, /will not run that script:\n\n```powershell\ncd desktop\nnpm install/);
  assert.match(readme, /type `npm\.cmd` in place of `npm`/);

  // The browser door and the next visit say the same.
  assert.match(section(start, "## Another way to visit them (browser)"), /`npm\.cmd install` and `npm\.cmd run dev`/);
  assert.ok(section(start, "## Tomorrow (you do not install again)").includes(bypass));
  // The script still owns the real start.
  assert.match(read(repo, "desktop.ps1"), /npm start/);
});

test("the recovery step never runs npm install in the computerpets folder (it has no package.json)", () => {
  assert.equal(existsSync(join(repo, "package.json")), false);
  assert.equal(existsSync(join(repo, "desktop", "package.json")), true);
  const errs = section(start, "### The window printed errors, then stopped");
  assert.doesNotMatch(errs, /Stay in the `computerpets` folder \(or `desktop`/);
  assert.match(errs, /In the `computerpets` folder, run `\.\\desktop\.ps1` again/);
  assert.match(errs, /stay in the `desktop` folder and run `npm\.cmd install` again, then `npm\.cmd start`/);
});

test("a click on the pet opens the keeper card and a row of choices; the docs no longer say 'first click is a sit'", () => {
  for (const src of [readme, start]) {
    assert.doesNotMatch(src, /first click (on the pet )?is a sit/i);
  }
  assert.match(readme, /\*\*Click\*\* the pet: they stop, and the keeper card opens with a small row of choices/);
  assert.match(section(start, "## Step 6 — Say hello"), /\*\*Click\*\* the pet\. They stop, and the keeper card opens with a small row of choices/);
  // The choices the docs name are the overlay's own labels, and the hello says a click opens the card.
  const choice = read(repo, "desktop/renderer/choice.js");
  for (const label of ["Walk", "Sit", "Feed", "Talk", "Hide"]) {
    assert.match(choice, new RegExp(`label: "${label}"`), label);
  }
  // A click on the overlay lands on the pet on every desktop (not only a focus).
  const D = read(repo, "desktop/renderer/desk.js");
  assert.match(D, /isMac\(platform\) \|\| isLinux\(platform\) \|\| isWindows\(platform\) \? "accept" : "focus"/);
});

test("the /demo room the docs name opens Rui's room instead of a 404", () => {
  assert.match(readme, /`\/demo` stays lockstep with the overlay/);
  assert.match(start, /The `\/demo` room shows/);
  const route = read(root, "src/routes/demo.index.tsx");
  assert.match(route, /createFileRoute\("\/demo\/"\)/);
  assert.match(route, /throw redirect\(\{ to: "\/demo\/\$slug", params: \{ slug: "rui" \}, replace: true \}\)/);
  const tree = read(root, "src/routeTree.gen.ts");
  assert.match(tree, /import \{ Route as DemoIndexRouteImport \} from '\.\/routes\/demo\.index'/);
  assert.match(tree, /'\/demo\/': typeof DemoIndexRoute/);
  // A mistyped name still answers 404 in the slug route.
  assert.match(read(root, "src/routes/demo.$slug.tsx"), /if \(!livingBySlug\(params\.slug\)\) throw notFound\(\);/);
});

test("the copy step says the house is private: an invited GitHub account signs in, and Repository not found means no invite", () => {
  assert.match(readme, /The page is private for now: the copy works for a GitHub account the owner has invited/);
  assert.match(read(repo, "LICENSE"), /This is a private house\./);
  assert.doesNotMatch(start, /click through and still copy the pets/);
  assert.match(start, /Sign in with the GitHub account the owner invited\./);
  assert.match(section(start, "## Step 3 — Copy the pets onto your computer"), /The house is private for now\. The copy works only for a GitHub account the owner has invited\./);
  const cloneFails = start.slice(start.indexOf("**If clone fails:**"), start.indexOf("If it says the folder already exists"));
  assert.match(cloneFails, /`Repository not found`/);
  assert.match(section(start, "### `git clone` failed"), /`Repository not found`, or keeps asking you to sign in, the house is private/);
  // Still honest that there is no store download.
  assert.match(readme, /There is no Steam, Itch, or Microsoft Store download yet/);
});

test("the house server address lives under Unlock… in the tray menu (there is no Settings item)", () => {
  assert.doesNotMatch(start, /house server address in Settings/);
  assert.match(start, /Its address goes in \*\*Unlock…\*\* on the tray menu, under \*\*House server address\*\*\./);
  const main = read(repo, "desktop/main.cjs");
  assert.match(main, /\{ label: "Unlock…", click: \(\) => openSettings\("unlock"\) \}/);
  assert.doesNotMatch(main, /label: "Settings/);
  assert.match(read(repo, "desktop/renderer/settings.html"), /<label for="backend">House server address<\/label>/);
});

test("the web README says local sign-in is not set up for localhost and how to try the kennel with one local keeper", () => {
  assert.match(webReadme, /not for `localhost`/);
  assert.match(webReadme, /put the line `VITE_AUTH_ENABLED=false` in a file named `web\/\.env`/);
  assert.match(webReadme, /\*\*Dev User\*\*/);
  // .env is ignored, .env.example lists the switch, and both sides read the same flag.
  assert.match(read(repo, ".gitignore"), /^\.env$/m);
  assert.match(read(root, ".env.example"), /# VITE_AUTH_ENABLED=false/);
  assert.match(read(root, "src/lib/auth/server.ts"), /env\("VITE_AUTH_ENABLED"\) === "false"/);
  assert.match(read(root, "src/lib/auth/client.ts"), /import\.meta\.env\.VITE_AUTH_ENABLED !== "false"/);
  assert.match(read(root, "src/lib/auth/use-current-user.ts"), /if \(!authEnabled\) return \{ user: DEV_USER, isPending: false \};/);
});
