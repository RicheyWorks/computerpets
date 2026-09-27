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

/** Failed loads say so (kennel, ember, desk, sign-in) and the admin ledger checks its address. */
async function loadProblems() {
  const P = await import(pathToFileURL(join(WEB, "src", "lib", "plain-error.ts")).href);
  const B = await import(pathToFileURL(join(WEB, "src", "lib", "admin", "base.ts")).href);
  const quiet = () => {};
  const refused = Object.assign(new TypeError("fetch failed"), { cause: { code: "ECONNREFUSED" } });
  const lines = {};
  for (const what of ["kennel", "ember", "desk", "signin"]) {
    const line = P.loadProblem(what, refused, quiet);
    if (!line.startsWith(P.LOAD_LINES[what]) || !line.endsWith(P.PLAIN_LINES.unreachable) || /ECONNREFUSED|fetch failed/.test(line)) {
      return fail(`loadProblem ${what} drift: ${line}`);
    }
    lines[what] = line;
  }
  const bases = {
    env: B.pickApiBase("https://license.example.com/", "https://pets.example.com"),
    site: B.pickApiBase("", "https://pets.example.com"),
    local: B.pickApiBase("", "http://localhost:3000"),
  };
  if (bases.env !== "https://license.example.com" || bases.site !== "https://pets.example.com" || bases.local !== B.DEV_API_BASE) {
    return fail("admin pickApiBase drift", { bases });
  }
  if (B.isLicenseList({ error: "license not found" }) || B.isLicenseList("<html>") || !B.isLicenseList([{ jti: "a" }])) {
    return fail("admin isLicenseList drift");
  }
  const when = B.formatLocalWhen("2026-09-27T18:29:45Z", { locale: "en-US", timeZone: "America/Los_Angeles" });
  if (when.text.replace(/\s/g, " ") !== "Sep 27, 2026, 11:29 AM" || when.iso !== "2026-09-27T18:29:45Z") {
    return fail(`admin formatLocalWhen drift: ${when.text} / ${when.iso}`);
  }
  const read = (...p) => readFileSync(join(WEB, "src", ...p), "utf8");
  const wires = [
    ["routes/collection.tsx", 'loadProblem("kennel", err)', ".catch(() => setPets([]))"],
    ["routes/hatch.tsx", 'loadProblem("ember", err)', "setEmber(0)"],
    ["routes/index.tsx", 'loadProblem("desk", err)', ".catch(() => undefined)"],
    ["routes/login.tsx", 'loadProblem("signin", err)', "onClick={() => signIn("],
    ["lib/admin/api.ts", "NOT_LICENSE_SERVICE", "__unlock-check__"],
  ];
  for (const [rel, need, gone] of wires) {
    const text = read(...rel.split("/"));
    if (!text.includes(need)) return fail(`${rel} missing ${need}`);
    if (text.includes(gone)) return fail(`${rel} still has ${gone}`);
  }
  return ok("load problems plain + admin address checked", { lines, bases, when }, [
    "kennel=plain+retry",
    "ember=plain+retry",
    "desk=plain+retry",
    "signin=plain",
    "admin.404=not_license_service",
    "admin.base=env>site>localhost",
    "admin.time=local+iso_title",
  ]);
}

/** Nest load, companion-room play save, admin search answers, and Minds test failures say why plainly. */
async function plainReasons() {
  const P = await import(pathToFileURL(join(WEB, "src", "lib", "plain-error.ts")).href);
  const B = await import(pathToFileURL(join(WEB, "src", "lib", "admin", "base.ts")).href);
  const logged = [];
  const log = (label, err) => logged.push([label, err]);
  const refused = Object.assign(new TypeError("fetch failed"), { cause: { code: "ECONNREFUSED" } });
  const nest = P.loadProblem("nest", refused, log);
  if (!nest.startsWith(P.LOAD_LINES.nest) || /ECONNREFUSED|fetch failed/.test(nest)) return fail(`nest drift: ${nest}`);
  const play = P.careNotSaved("play", refused, log);
  if (!play.startsWith(P.CARE_NOT_SAVED.play) || /ECONNREFUSED|fetch failed/.test(play)) return fail(`play drift: ${play}`);
  const minds = {
    key: P.mindProblemKind(new Error("openai 401")),
    busy: P.mindProblemKind(new Error("anthropic 429")),
    address: P.mindProblemKind(new Error("openai 404")),
    server: P.mindProblemKind(new Error("openai 503")),
    url: P.mindProblemKind(new Error("https only")),
    unreachable: P.mindProblemKind(refused),
  };
  for (const [want, got] of Object.entries(minds)) {
    if (want !== got) return fail(`mindProblemKind ${want} -> ${got}`, { minds });
  }
  const before = logged.length;
  const mind = P.mindProblem(new Error("openai 401"), log);
  if (!mind.startsWith("The mind did not answer. ") || mind.includes("401") || logged.length !== before + 1) {
    return fail(`mindProblem drift: ${mind}`);
  }
  const admin = {
    row: B.isLicenseRow({ jti: "a" }) && !B.isLicenseRow([{ jti: "a" }]) && !B.isLicenseRow("<html>"),
    missing: B.isLicenseMissing({ error: "license not found", jti: "a" }) && !B.isLicenseMissing({ error: "Not Found" }),
    revokeMiss: B.isRevokeMiss({ revoked: false, jti: "a" }) && !B.isRevokeMiss({ status: 404 }),
  };
  if (!admin.row || !admin.missing || !admin.revokeMiss) return fail("admin answer checks drift", { admin });
  const read = (...p) => readFileSync(join(WEB, "src", ...p), "utf8");
  const wires = [
    ["routes/nest.tsx", 'loadProblem("nest", err)', "<LoadProblem"],
    ["components/desk/companion-room.tsx", 'careNotSaved("play", err)', "data-play-problem"],
    ["routes/mind.tsx", "mindProblem(err)", "mindProblem"],
    ["lib/admin/api.ts", "isLicenseList(body)", "isLicenseRow(body)"],
  ];
  for (const [rel, a, b] of wires) {
    const text = read(...rel.split("/"));
    if (!text.includes(a) || !text.includes(b)) return fail(`${rel} missing ${a} / ${b}`);
  }
  return ok("nest, play save, admin search, and Minds test failures plain", { nest, play, mind, minds, admin }, [
    "nest=plain+retry",
    "play.save=plain+retry+meters_kept",
    "admin.search=license_rows_only",
    "mind.test=plain_reason",
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


async function speakOpts() {
  const cardUrl = pathToFileURL(join(WEB, "src", "lib", "pets", "card.ts")).href;
  const C = await import(cardUrl);
  const styles = C.VOICE_STYLES || [];
  const want = {
    hearth: { rate: 0.82, pitch: 0.88 },
    hush: { rate: 0.8, pitch: 1.02 },
    even: { rate: 0.92, pitch: 1 },
    low: { rate: 0.84, pitch: 0.76 },
    bright: { rate: 0.98, pitch: 1.1 },
  };
  if (styles.length !== 5) return fail("VOICE_STYLES count drift", { styles });
  for (const s of styles) {
    const w = want[s.id];
    if (!w) return fail("unexpected voice style " + s.id);
    if (s.rate !== w.rate || s.pitch !== w.pitch) return fail("voice style drift " + s.id, { s, w });
    const opts = C.speakOpts(s.id, 50);
    if (opts.rate !== w.rate || opts.pitch !== w.pitch) return fail("speakOpts drift " + s.id, { opts });
  }
  const hearth50 = C.speakOpts("hearth", 50);
  if (!(hearth50.volume < 0.5) || Math.abs(hearth50.volume - 0.46) > 1e-9) {
    return fail("hearth soft volume drift", { hearth50 });
  }
  const even50 = C.speakOpts("even", 50);
  if (Math.abs(even50.volume - 0.5) > 1e-9) return fail("even volume drift", { even50 });
  const hi = C.speakOpts("hearth", 250);
  if (Math.abs(hi.volume - 0.92) > 1e-9) return fail("clamp high drift", { hi });
  const lo = C.speakOpts("bright", -40);
  if (lo.volume !== 0) return fail("clamp low drift", { lo });
  const roomSrc = readFileSync(join(WEB, "src", "components", "desk", "companion-room.tsx"), "utf8");
  for (const needle of ["speakOpts(", "u.volume = opts.volume", "pickSystemVoice("]) {
    if (!roomSrc.includes(needle)) return fail(`companion-room missing ${needle}`);
  }
  const keeperSrc = readFileSync(join(WEB, "src", "components", "desk", "keeper-card.tsx"), "utf8");
  for (const needle of ["speakOpts(", "u.volume = opts.volume", "keeper-volume"]) {
    if (!keeperSrc.includes(needle)) return fail(`keeper-card missing ${needle}`);
  }
  return ok("web speakOpts styles=5", { styles: styles.map((s) => s.id), hearth50: hearth50.volume }, [
    "web.speakOpts.styles=5",
    "web.speakOpts.hearth.soft=0.46",
    "web.speakOpts.clamp",
    "companion-room.speakOpts",
    "keeper-card.speakOpts",
  ]);
}

async function volumeMutes() {
  const cardUrl = pathToFileURL(join(WEB, "src", "lib", "pets", "card.ts")).href;
  const C = await import(cardUrl);
  const buses = C.MUTE_BUSES || [];
  if (buses.join(",") !== "talk,special,weather,treats,steps,music") {
    return fail("MUTE_BUSES drift", { buses });
  }
  let card = C.blankCard();
  if (C.guestOf(card, "red_panda").volume !== 80) return fail("blank guest volume");
  card = C.setGuest(card, "red_panda", { volume: 150 });
  if (C.guestOf(card, "red_panda").volume !== 100) return fail("volume clamp high");
  card = C.setGuest(card, "red_panda", { volume: -5 });
  if (C.guestOf(card, "red_panda").volume !== 0) return fail("volume clamp low");
  card = C.setGuest(card, "red_panda", { volume: 40 });
  card = { ...card, mutes: { ...C.blankMutes(), talk: true, weather: true }, voiceStyle: "bright" };
  // Node has no localStorage — saveCard soft-persists in-memory parse only.
  const saved = C.saveCard(card);
  if (saved.pets.red_panda.volume !== 40) return fail("saveCard volume clamp/parse", { saved });
  if (!saved.mutes.talk || saved.voiceStyle !== "bright") return fail("saveCard mutes/style", { saved });
  if (!C.isMuted(saved.mutes, "chirp") || !C.isMuted(saved.mutes, "voice")) {
    return fail("talk mute mapping", { mutes: saved.mutes });
  }
  if (!C.isMuted(saved.mutes, "rain")) return fail("weather mute mapping");
  if (C.isMuted(saved.mutes, "hop")) return fail("special should be unmuted");
  const roomSrc = readFileSync(join(WEB, "src", "components", "desk", "companion-room.tsx"), "utf8");
  for (const needle of ["isMuted(", "guestOf(prefs, kind.key).volume", "speakOpts("]) {
    if (!roomSrc.includes(needle)) return fail(`companion-room volume/mute wire missing ${needle}`);
  }
  const keeperSrc = readFileSync(join(WEB, "src", "components", "desk", "keeper-card.tsx"), "utf8");
  for (const needle of ["MUTE_BUSES", "setGuest(card, guestKey, { volume:", "keeper-mutes", "guest.volume / 100"]) {
    if (!keeperSrc.includes(needle)) return fail(`keeper-card volume/mute wire missing ${needle}`);
  }
  return ok("web volume/mutes clamp+wire", { volume: 40, buses }, [
    "web.volume.clamp=0..100",
    "web.mutes.buses=6",
    "web.isMuted.talk/weather",
    "companion-room.volume+mute",
    "keeper-card.volume+mute",
  ]);
}


const COMMANDS = {
  guest_choice: guestChoice,
  demo_room: demoRoom,
  load_problems: loadProblems,
  plain_reasons: plainReasons,
  classroom_lockstep: classroomLockstep,
  return_memory: returnMemory,
  speak_opts: speakOpts,
  volume_mutes: volumeMutes,
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
