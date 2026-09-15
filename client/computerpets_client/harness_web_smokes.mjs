/**
 * Offline web companion-room smokes for app_harness (Buffffff).
 * Drives real web/src modules via node --experimental-strip-types.
 * --gui stays Electron desktop (gui-harness.cjs); this file is headless only.
 */
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = join(here, "..", "..");
const WEB = join(ROOT, "web");
const RENDERER = join(ROOT, "desktop", "renderer");
const require = createRequire(import.meta.url);

function ok(detail, extras = {}, trace = []) {
  return { ok: true, detail, extras, trace };
}
function fail(error, extras = {}) {
  return { ok: false, error, detail: error, extras, trace: [] };
}

async function guestChoice() {
  const webUrl = pathToFileURL(join(WEB, "src", "lib", "pets", "guest-choice.ts")).href;
  const C = await import(webUrl);
  const Overlay = require(join(RENDERER, "choice.js"));
  const ids = (marks) => marks.map((m) => m.id);

  if (C.guestTap() !== "choice") return fail("web guestTap is not choice");
  if (Overlay.guestTap() !== "choice") return fail("desktop guestTap is not choice");

  const webChoice = [...C.GUEST_CHOICE];
  const deskChoice = [...Overlay.GUEST_CHOICE];
  if (JSON.stringify(webChoice) !== JSON.stringify(deskChoice)) {
    return fail("GUEST_CHOICE web/desktop drift", { webChoice, deskChoice });
  }
  if (webChoice.slice(-2).join("/") !== "close/exit") {
    return fail("GUEST_CHOICE must end close/exit", { webChoice });
  }

  const webMarks = ids(C.guestMarks({ walking: true }));
  const deskMarks = ids(Overlay.guestMarks({ walking: true }));
  if (webMarks.slice(-2).join("/") !== "close/exit") {
    return fail("web guestMarks must end close/exit", { webMarks });
  }
  if (deskMarks.slice(-2).join("/") !== "close/exit") {
    return fail("desktop guestMarks must end close/exit", { deskMarks });
  }
  if (JSON.stringify(webMarks) !== JSON.stringify(deskMarks)) {
    return fail("guestMarks web/desktop drift", { webMarks, deskMarks });
  }
  if (C.guestPick("close") !== "close" || C.guestPick("exit") !== "exit") {
    return fail("web guestPick close/exit failed");
  }
  if (C.guestPick("bath") !== null) {
    return fail("web guestPick must reject blotter tend bath");
  }

  const roomSrc = readFileSync(join(WEB, "src", "components", "desk", "companion-room.tsx"), "utf8");
  const choiceSrc = readFileSync(join(WEB, "src", "components", "desk", "guest-choice.tsx"), "utf8");
  for (const needle of ["guestTap()", "guestMarks(", "GuestChoice", "pickGuest", 'id === "close"', 'id === "exit"']) {
    if (!roomSrc.includes(needle)) return fail(`companion-room missing ${needle}`);
  }
  if (!choiceSrc.includes("data-guest-choice")) return fail("guest-choice.tsx missing data-guest-choice");

  return ok("web guest-choice close/exit", {
    marks: webMarks,
    choice_n: webChoice.length,
  }, [
    `marks=${webMarks.join("/")}`,
    "pick.close",
    "pick.exit",
    "tap=choice",
    "lockstep=choice.js",
    "companion-room",
  ]);
}

function demoRoom() {
  const demoSrc = readFileSync(join(WEB, "src", "components", "desk", "demo-stage.tsx"), "utf8");
  const routeSrc = readFileSync(join(WEB, "src", "routes", "demo.$slug.tsx"), "utf8");
  const needDemo = ["CompanionRoom", "persistLocal={false}", "liveTick", "DESK_TEND"];
  const missing = needDemo.filter((n) => !demoSrc.includes(n));
  if (missing.length) return fail(`demo-stage missing ${missing.join(",")}`, { missing });
  if (!routeSrc.includes("DemoStage")) return fail("demo.$slug route missing DemoStage");
  // No invented static-export smoke — TanStack/nitro app has no pure offline export check.
  return ok("demo room CompanionRoom", { missing: [] }, [
    "demo-stage.CompanionRoom",
    "persistLocal=false",
    "demo.$slug.DemoStage",
  ]);
}

async function classroomLockstep(expectPath) {
  if (!expectPath) return fail("classroom_lockstep needs expect JSON path argv");
  let expect;
  try {
    expect = JSON.parse(readFileSync(expectPath, "utf8"));
  } catch (err) {
    return fail(`expect JSON read failed: ${err && err.message}`);
  }
  const plaquesUrl = pathToFileURL(join(WEB, "src", "lib", "pets", "plaques.ts")).href;
  const P = await import(plaquesUrl);
  const keys = Object.keys(expect);
  let matched = 0;
  const drift = [];
  for (const key of keys) {
    const want = expect[key];
    const got = P.classroomFor(key);
    if (!got) {
      drift.push(key + ":missing");
      continue;
    }
    if (got.label !== want.label || got.verb !== want.verb || got.to !== want.to) {
      drift.push(key);
      continue;
    }
    matched += 1;
  }
  if (drift.length) {
    return fail(`classroomFor drift n=${drift.length}`, { drift: drift.slice(0, 12), matched });
  }
  const plaqueSrc = readFileSync(join(WEB, "src", "components", "desk", "species-plaque.tsx"), "utf8");
  for (const needle of ["classroomFor", "classroom.verb", "classroom.label", "classroom.to"]) {
    if (!plaqueSrc.includes(needle)) return fail(`species-plaque missing ${needle}`);
  }
  // Desktop has no classroom peer — not invented.
  const deskHours = readFileSync(join(RENDERER, "hours.js"), "utf8");
  if (deskHours.includes("classroomFor") || deskHours.includes("classroom_for")) {
    return fail("unexpected desktop classroom API");
  }
  return ok(`classroom lockstep=${matched}`, { matched, n: keys.length }, [
    `matched=${matched}`,
    `keys=${keys.length}`,
    "species-plaque.classroomFor",
    "desktop_classroom=absent",
  ]);
}

async function returnMemory() {
  const hoursUrl = pathToFileURL(join(WEB, "src", "lib", "pets", "hours.ts")).href;
  const H = await import(hoursUrl);
  const cases = [
    [0, 14, null],
    [0.3 * 3_600_000, 14, null],
    [0.5 * 3_600_000, 14, "Back. I noticed."],
    [1 * 3_600_000, 14, "You were elsewhere. I practiced waiting."],
    [6 * 3_600_000, 14, "Hours. I sat in most of them."],
    [20 * 3_600_000, 8, "You were gone a night. I kept the blotter."],
    [20 * 3_600_000, 14, "A long absence. I counted the dust."],
  ];
  let matched = 0;
  for (const [away, hour, want] of cases) {
    const got = H.returnLine(away, hour);
    if (got !== want) {
      return fail(`returnLine(${away},${hour}) got ${JSON.stringify(got)} want ${JSON.stringify(want)}`);
    }
    matched += 1;
  }
  if (typeof H.rememberVisit !== "function") {
    return fail("web rememberVisit missing");
  }
  // localStorage is absent in plain node — rememberVisit should soft-fail to away=0.
  const away = H.rememberVisit("red_panda");
  if (away !== 0) {
    return fail(`rememberVisit without localStorage away=${away}`);
  }
  const roomSrc = readFileSync(join(WEB, "src", "components", "desk", "companion-room.tsx"), "utf8");
  for (const needle of ["rememberVisit", "returnLine", "persistLocal ? rememberVisit"]) {
    if (!roomSrc.includes(needle)) return fail(`companion-room missing ${needle}`);
  }
  const deskHours = readFileSync(join(RENDERER, "hours.js"), "utf8");
  if (deskHours.includes("returnLine") || deskHours.includes("rememberVisit")) {
    return fail("unexpected desktop returnLine/rememberVisit");
  }
  if (!deskHours.includes("callLine")) return fail("desktop callLine missing");
  return ok(`return_memory thresholds=${matched}`, { matched }, [
    `thresholds=${matched}`,
    "rememberVisit.soft=0",
    "companion-room.rememberVisit+returnLine",
    "desktop_return=absent",
  ]);
}

const COMMANDS = {
  guest_choice: guestChoice,
  demo_room: demoRoom,
  classroom_lockstep: classroomLockstep,
  return_memory: returnMemory,
};

async function main(argv) {
  const cmd = argv[2];
  if (!cmd || cmd === "--list") {
    process.stdout.write(JSON.stringify({ ok: true, commands: Object.keys(COMMANDS) }) + "\n");
    return 0;
  }
  const fn = COMMANDS[cmd];
  if (!fn) {
    process.stdout.write(JSON.stringify({ ok: false, error: `unknown command ${cmd}` }) + "\n");
    return 1;
  }
  try {
    const result = await fn(...argv.slice(3));
    process.stdout.write(JSON.stringify(result) + "\n");
    return result.ok ? 0 : 1;
  } catch (err) {
    process.stdout.write(
      JSON.stringify({ ok: false, error: `${err && err.name}: ${err && err.message}` }) + "\n",
    );
    return 1;
  }
}

process.exitCode = await main(process.argv);
