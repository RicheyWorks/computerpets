/**
 * Offline web companion-room smokes for app_harness (Buffffff).
 * Drives real web/src modules via node --experimental-strip-types.
 * --gui stays Electron desktop (gui-harness.cjs); this file is headless only.
 */
import { createRequire } from "node:module";
import { existsSync, readFileSync, readdirSync } from "node:fs";
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
    ["components/desk/companion-room.tsx", 'careFailed("play", err)', "data-care-problem"],
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

/** Feed/tend saves, talk turns, revoke confirmation, desk plates, and keeper sound say why they failed. */
async function careTalkPlates() {
  const P = await import(pathToFileURL(join(WEB, "src", "lib", "plain-error.ts")).href);
  const B = await import(pathToFileURL(join(WEB, "src", "lib", "admin", "base.ts")).href);
  const quiet = () => {};
  const refused = Object.assign(new TypeError("fetch failed"), { cause: { code: "ECONNREFUSED" } });
  const raw = /ECONNREFUSED|fetch failed|openai|401/;
  const care = {};
  for (const act of ["feed", "rest", "clean", "medicine"]) {
    const line = P.careNotSaved(act, refused, quiet);
    if (!line.startsWith(P.CARE_NOT_SAVED[act]) || raw.test(line)) return fail(`careNotSaved ${act} drift: ${line}`);
    care[act] = line;
  }
  const talk = {
    mind: P.talkProblem(new Error("openai 401"), true, quiet),
    house: P.talkProblem(refused, false, quiet),
  };
  if (talk.mind !== `${P.TALK_LINES.mind} ${P.MIND_LINES.key}` || talk.house !== `${P.TALK_LINES.house} ${P.PLAIN_LINES.unreachable}`) {
    return fail("talkProblem drift", { talk });
  }
  const revoke = {
    done: B.isRevokeDone({ revoked: true, jti: "a1" }, "a1"),
    other: B.isRevokeDone({ revoked: true, jti: "b2" }, "a1"),
    page: B.isRevokeDone("<html>", "a1"),
  };
  if (!revoke.done || revoke.other || revoke.page) return fail("isRevokeDone drift", { revoke });
  const plates = {
    forecast: P.plateProblem("forecast", null, quiet),
    price: P.plateProblem("price", Object.assign(new Error("t"), { name: "QuoteTimeout" }), quiet),
    newer: P.plateProblem("newer", refused, quiet),
  };
  if (
    plates.forecast !== `${P.PLATE_LINES.forecast} ${P.PLATE_REASONS.answer}` ||
    plates.price !== `${P.PLATE_LINES.price} ${P.PLATE_REASONS.timeout}` ||
    plates.newer !== `${P.PLATE_LINES.newer} ${P.PLATE_REASONS.unreachable}`
  ) {
    return fail("plateProblem drift", { plates });
  }
  const sound = {
    blocked: P.soundProblem("music", Object.assign(new Error("x"), { name: "NotAllowedError" }), quiet),
    paused: P.soundInterrupted(Object.assign(new Error("x"), { name: "AbortError" })),
  };
  if (sound.blocked !== `${P.SOUND_LINES.music} ${P.SOUND_REASONS.blocked}` || !sound.paused) return fail("soundProblem drift", { sound });
  const read = (...p) => readFileSync(join(WEB, "src", ...p), "utf8");
  const wires = [
    ["components/desk/companion-room.tsx", ['careFailed("feed", err)', "careFailed(saved, err)", "data-care-problem", "data-talk-problem", "talkUsesPlugin(mind, mindSettings.voice)"]],
    ["lib/admin/api.ts", ["isRevokeDone(await readJsonBody(res), jti)"]],
    ["components/desk/desk-plates.tsx", ['plateProblem("forecast", err)', 'data-plate-problem="news"', 'data-plate-problem="market"']],
    ["components/desk/keeper-card.tsx", ['soundProblem("music", err)', 'soundProblem("sleep", err)', "data-sound-problem"]],
  ];
  for (const [rel, needs] of wires) {
    const text = read(...rel.split("/"));
    for (const need of needs) if (!text.includes(need)) return fail(`${rel} missing ${need}`);
  }
  return ok("care saves, talk, revoke, plates, and keeper sound say why", { care, talk, revoke, plates, sound }, [
    "feed+tend.save=plain+retry+meters_kept",
    "talk=house_line+plain_reason",
    "admin.revoke=confirmed_only",
    "plates=couldnt_load+retry",
    "keeper.sound=couldnt_play+retry",
  ]);
}

/** One message per failed care act, revoke vs list refresh, shared house music, one heartbeat poll, NFT floor line. */
async function petsAdminMusic() {
  const P = await import(pathToFileURL(join(WEB, "src", "lib", "plain-error.ts")).href);
  const B = await import(pathToFileURL(join(WEB, "src", "lib", "admin", "base.ts")).href);
  const K = await import(pathToFileURL(join(WEB, "src", "lib", "pets", "keeper.ts")).href);
  const M = await import(pathToFileURL(join(WEB, "src", "lib", "pets", "house-music.ts")).href);
  const Overlay = require(join(RENDERER, "house-music.js"));
  const quiet = () => {};
  const room = {};
  for (const act of ["play", "feed", "rest", "clean", "medicine", "shed"]) room[act] = P.roomReportsCare(act);
  if (Object.values(room).filter(Boolean).length !== 5 || room.shed) return fail("roomReportsCare drift", { room });
  const rows = B.markRevoked([{ jti: "a", revoked: false, deleted: false }, { jti: "b", revoked: false, deleted: false }], "b");
  const stale = B.revokedListStale("Couldn't reach the house server.");
  if (rows[0].revoked || !rows[1].revoked || !rows[1].deleted || !stale.startsWith("License revoked.") || /failed/i.test(stale)) {
    return fail("revoke/list split drift", { rows, stale });
  }
  const music = {};
  for (const [guest, raw] of [["red_panda", { plugin: "house", playing: true }], ["robin", { plugin: "house", playing: true }], ["robin", { plugin: "off" }], ["robin", { plugin: "radio" }]]) {
    const web = M.sharedMusicShows(guest, M.parseMusic(raw));
    const desk = Overlay.sharedMusicShows(guest, Overlay.parseMusic(raw));
    if (web !== desk) return fail("sharedMusicShows web/desktop drift", { guest, raw, web, desk });
    music[`${guest}:${raw.plugin}`] = web;
  }
  if (music["red_panda:house"] || !music["robin:house"] || music["robin:off"] || music["robin:radio"]) return fail("sharedMusicShows drift", { music });
  const pause = M.houseMusicToggle(M.parseMusic({ plugin: "house", playing: true }), false);
  if (pause.label !== "Pause music" || pause.next.playing || M.houseMusicToggle(pause.next, false).label !== "Play music") {
    return fail("houseMusicToggle drift", { pause });
  }
  const timers = new Map();
  let reads = 0;
  const poll = K.createHeartbeatPoll({
    url: "http://127.0.0.1:1/api/public/heartbeat",
    fetchImpl: async () => {
      reads += 1;
      throw new TypeError("fetch failed");
    },
    setIntervalImpl: (fn, ms) => {
      timers.set(timers.size + 1, { fn, ms });
      return timers.size;
    },
    clearIntervalImpl: (id) => timers.delete(id),
  });
  const seen = [];
  const offA = poll.subscribe((b) => seen.push(b));
  const offB = poll.subscribe((b) => seen.push(b));
  await new Promise((r) => setImmediate(r));
  const heartbeat = { intervals: timers.size, reads, status: seen.at(-1)?.status };
  offA();
  offB();
  heartbeat.after = timers.size;
  if (heartbeat.intervals !== 1 || heartbeat.reads !== 1 || heartbeat.after !== 0 || heartbeat.status !== K.UNREAD_HEARTBEAT.status) {
    return fail("heartbeat poll drift", { heartbeat });
  }
  const floor = P.plateProblem("floor", null, quiet);
  if (floor !== `Couldn't load the floor price. ${P.PLATE_REASONS.answer}`) return fail("floor line drift", { floor });
  const read = (...p) => readFileSync(join(ROOT, ...p), "utf8");
  const wires = [
    ["web/src/routes/pets.$key.tsx", ['if (!roomReportsCare(action)) toast.error(plainMessage(err, "Care failed."));']],
    ["web/src/routes/admin.tsx", ["setRows((was) => markRevoked(was, jti));", "revokedListStale(plainMessage(err"]],
    ["web/src/components/desk/keeper-card.tsx", ["sharedMusicShows(guestKey, music)", "heartbeatPoll.subscribe(setBeat)"]],
    ["web/src/components/desk/desk-plates.tsx", ['data-plate-problem="floor"']],
    ["desktop/renderer/index.html", ['id="hud-house-music"', 'id="hud-house-music-play"']],
    ["desktop/renderer/pet.js", ["function paintHouseMusic", "function streamLineEl"]],
  ];
  for (const [rel, needs] of wires) {
    const text = read(...rel.split("/")).replace(/\r\n/g, "\n");
    for (const need of needs) if (!text.includes(need)) return fail(`${rel} missing ${need}`);
  }
  const card = read("web", "src", "components", "desk", "keeper-card.tsx");
  if (/fetch\(HEARTBEAT_URL/.test(card)) return fail("keeper-card still has its own heartbeat fetch");
  return ok("one care message, revoke vs list, shared house music, one heartbeat poll, NFT floor", { room, music, heartbeat, floor }, [
    "pets.care=room_line_only",
    "admin.revoke=done_even_if_list_stale",
    "music.shared=every_guest_but_rui",
    "heartbeat.poll=one_interval",
    "plates.floor=couldnt_load+retry",
  ]);
}

/** Rename / let-go lines, the music pick hint, one stale-list re-read, overlay keys, screen-reader names, idle pauses. */
async function petsKeysIdle() {
  const P = await import(pathToFileURL(join(WEB, "src", "lib", "plain-error.ts")).href);
  const B = await import(pathToFileURL(join(WEB, "src", "lib", "admin", "base.ts")).href);
  const K = await import(pathToFileURL(join(WEB, "src", "lib", "pets", "keeper.ts")).href);
  const M = await import(pathToFileURL(join(WEB, "src", "lib", "pets", "house-music.ts")).href);
  const V = K; // everyVisible lives beside the heartbeat poll in pets/keeper.ts
  const OverlayMusic = require(join(RENDERER, "house-music.js"));
  const OverlayKeeper = require(join(RENDERER, "keeper.js"));
  const quiet = () => {};
  const refused = Object.assign(new TypeError("fetch failed"), { cause: { code: "ECONNREFUSED" } });
  const pet = { rename: P.petNotSaved("rename", refused, quiet), release: P.petNotSaved("release", refused, quiet) };
  if (!pet.rename.startsWith(P.PET_NOT_SAVED.rename) || !pet.release.startsWith(P.PET_NOT_SAVED.release) || /ECONNREFUSED/.test(pet.rename)) {
    return fail("petNotSaved drift", { pet });
  }
  const hint = {
    off: M.sharedMusicHint("robin", M.parseMusic({ plugin: "off" })),
    radio: M.sharedMusicHint("robin", M.parseMusic({ plugin: "radio" })),
    house: M.sharedMusicHint("robin", M.parseMusic({ plugin: "house" })),
    rui: M.sharedMusicHint("red_panda", M.parseMusic({ plugin: "off" })),
    desk: OverlayMusic.sharedMusicHint("robin", OverlayMusic.parseMusic({ plugin: "off" })),
  };
  if (hint.off !== M.MUSIC_PICK_HINT || hint.radio !== M.MUSIC_PICK_HINT || hint.house || hint.rui || hint.desk !== hint.off) {
    return fail("sharedMusicHint drift", { hint });
  }
  let runs = 0;
  let fire = null;
  const cancel = B.rereadOnce(() => runs++, { setTimeoutImpl: (fn) => ((fire = fn), 1), clearTimeoutImpl: () => {}, target: null });
  fire();
  fire();
  cancel();
  if (runs !== 1) return fail("rereadOnce ran more than once", { runs });
  const keys = {
    wrap: OverlayKeeper.tabWrap(3, 2, false),
    back: OverlayKeeper.tabWrap(3, 0, true),
    esc: OverlayKeeper.cardKey({ key: "Escape", cardOpen: true }),
    escMenu: OverlayKeeper.cardKey({ key: "Escape", cardOpen: true, menuOpen: true }),
  };
  if (keys.wrap !== 0 || keys.back !== 2 || keys.esc !== "close" || keys.escMenu !== "none") return fail("overlay keys drift", { keys });
  const fns = new Set();
  const doc = { hidden: false, addEventListener: (_t, fn) => fns.add(fn), removeEventListener: (_t, fn) => fns.delete(fn) };
  const timers = new Map();
  let ticks = 0;
  const stop = V.everyVisible(() => ticks++, 1000, {
    doc,
    onResume: true,
    setIntervalImpl: (fn) => (timers.set(1, fn), 1),
    clearIntervalImpl: (id) => timers.delete(id),
  });
  doc.hidden = true;
  for (const fn of fns) fn();
  const paused = timers.size === 0;
  doc.hidden = false;
  for (const fn of fns) fn();
  const idle = { paused, resumed: timers.size === 1, ticks };
  stop();
  if (!idle.paused || !idle.resumed || idle.ticks !== 1) return fail("everyVisible drift", { idle });
  const names = { art: K.petArtLabel("Rui", { asleep: true }), room: K.roomLabel("Rui") };
  if (names.art !== "Rui, asleep" || names.room !== "Rui's room") return fail("labels drift", { names });
  const read = (...p) => readFileSync(join(ROOT, ...p), "utf8").replace(/\r\n/g, "\n");
  const wires = [
    ["web/src/routes/pets.$key.tsx", ['petNotSaved("rename", err)', 'petNotSaved("release", err)', "aria-describedby={id}"]],
    ["web/src/routes/admin.tsx", ["rereadOnce(", "cancelReread();"]],
    ["web/src/components/desk/keeper-card.tsx", ["sharedMusicHint(guestKey, music)", 'role="meter"', "aria-describedby={soundLineId}"]],
    ["web/src/components/desk/companion-room.tsx", ["roomLabel(displayName)", "petArtLabel(displayName", "everyVisible("]],
    ["desktop/renderer/pet.js", ["function cardKeys", 'cmd.type === "open-card"', "if (card.collapsed) cardKeys(false);"]],
    ["desktop/main.cjs", ['{ label: "Keeper card", click: () => openKeeperCardFromMenu() }']],
    ["desktop/renderer/styles.css", ["#hud button:focus-visible"]],
  ];
  for (const [rel, needs] of wires) {
    const text = read(...rel.split("/"));
    for (const need of needs) if (!text.includes(need)) return fail(`${rel} missing ${need}`);
  }
  return ok("rename/let-go lines, music hint, one re-read, overlay keys, screen-reader names, idle pauses", { pet, hint, keys, idle, names }, [
    "pets.rename+release=plain+retry",
    "music.hint=pick_on_rui",
    "admin.reread=once",
    "overlay.keys=tab_wrap+escape",
    "a11y=describedby+meter+names",
    "idle=pause_while_hidden",
  ]);
}

/** The pet as a keyboard button, plates in the overlay's Tab cycle, idle pauses, a cheaper clock, alarm and mutes pressed, admin names. */
async function petKeysPlates() {
  const K = await import(pathToFileURL(join(WEB, "src", "lib", "pets", "keeper.ts")).href);
  const Card = await import(pathToFileURL(join(WEB, "src", "lib", "pets", "card.ts")).href);
  const B = await import(pathToFileURL(join(WEB, "src", "lib", "admin", "base.ts")).href);
  const tap = {
    room: K.petTapLabel("Rui", "choice", "Rui, asleep"),
    pick: K.petTapLabel("Chirp", "pick", "chosen"),
    hello: K.petTapLabel("Wave", "hello"),
    keys: ["Enter", " ", "Escape", "a"].map((k) => K.isTapKey(k)),
    repeat: K.isTapKey("Enter", true),
  };
  if (tap.room !== "Choose what Rui does (Rui, asleep)" || tap.pick !== "Pick Chirp (chosen)" || tap.hello !== "Say hello to Wave")
    return fail("pet tap names drift", { tap });
  if (JSON.stringify(tap.keys) !== JSON.stringify([true, true, false, false]) || tap.repeat) return fail("tap keys drift", { tap });
  const stale = [K.isStale(null, 10, 5), K.isStale(0, 4, 5), K.isStale(0, 5, 5)];
  if (JSON.stringify(stale) !== JSON.stringify([true, false, true])) return fail("isStale drift", { stale });
  let raw = '{"color":"ink"}';
  let loads = 0;
  const read = Card.createCardTickReader({ getRaw: () => raw, load: () => ({ n: ++loads }) });
  const a = read();
  const b = read();
  raw = '{"color":"moss"}';
  const c = read();
  const clock = { loads, same: a === b, changed: c !== b };
  if (clock.loads !== 2 || !clock.same || !clock.changed) return fail("clock reader parsed a still card", { clock });
  const admin = {
    none: B.ledgerCaption(0),
    one: B.ledgerCaption(1),
    many: B.ledgerCaption(3),
    open: B.focusAfterGate(true),
    locked: B.focusAfterGate(false),
  };
  if (admin.many !== "Licenses: 3 shown" || admin.one !== "Licenses: 1 shown" || admin.open !== "search" || admin.locked !== "key")
    return fail("admin names drift", { admin });
  const text = (...p) => readFileSync(join(ROOT, ...p), "utf8").replace(/\r\n/g, "\n");
  const wires = [
    ["web/src/components/desk/living-pet.tsx", ['role={onTap && tapLabel ? "button" : undefined}', "tabIndex={onTap && tapLabel ? (tabStop ? 0 : -1) : undefined}", "isTapKey(e.key, e.repeat)", "tapRef.current?.({ keys: true })"]],
    ["web/src/components/desk/companion-room.tsx", ['petTapLabel(displayName, "choice"', "choiceByKeys.current = !!how?.keys;", "everyVisible(age, 20_000, { onResume: true })"]],
    ["web/src/components/desk/house-floor.tsx", ["everyVisible(", 'petTapLabel(kind.name, "hello")']],
    ["web/src/components/desk/desk-plates.tsx", ["isStale(newsReadAt.current, Date.now(), NEWS_STALE_MS)", "{ onResume: true }"]],
    ["web/src/components/desk/keeper-card.tsx", ["readCardForTick()", "aria-pressed={guest.alarm.on}", "aria-pressed={!!card.mutes[bus]}"]],
    ["web/src/routes/admin.tsx", ["aria-expanded={open}", "aria-controls={detailId}", "aria-labelledby={ledgerId}", "focusAfterGate(unlocked)"]],
    ["web/src/styles.css", ["[data-pet-hit]:focus-visible"]],
    ["desktop/renderer/pet.js", ["const list = cardFocusables();", "refocusRebuilt(refocus);", 'btn.setAttribute("aria-pressed", card.mutes[bus] ? "true" : "false");', 'hudAlarmOn.setAttribute("aria-pressed"']],
    ["desktop/renderer/index.html", ['id="hud-alarm-on" data-hit data-card="alarm" aria-label="Alarm off" aria-pressed="false"']],
    ["desktop/README.md", ["The tray and the pet menu have **Keeper card**"]],
  ];
  for (const [rel, needs] of wires) {
    const body = text(...rel.split("/"));
    for (const need of needs) if (!body.includes(need)) return fail(`${rel} missing ${need}`);
  }
  // ADR 0012: main registers no global shortcut or keyboard hook.
  if (/globalShortcut/.test(text("desktop", "main.cjs"))) return fail("main.cjs registers a global shortcut (ADR 0012)");
  return ok("pet keyboard button, overlay plates in the Tab cycle, idle pauses, cheaper clock, alarm and mutes pressed, admin names", { tap, clock, admin }, [
    "pet.keys=button+enter_space",
    "overlay.plates=tab_cycle",
    "idle=floor+news+room",
    "clock=parse_on_change",
    "admin=expanded+caption+focus",
    "alarm_mute=pressed",
  ]);
}

/** Sit menu keys, Escape and a key for the web card, plate Escape and tabs, Drop focus, one walker stop, revoke focus, hidden-tab rests. */
async function menuKeysEscape() {
  const K = await import(pathToFileURL(join(WEB, "src", "lib", "pets", "keeper.ts")).href);
  const Card = await import(pathToFileURL(join(WEB, "src", "lib", "pets", "card.ts")).href);
  const B = await import(pathToFileURL(join(WEB, "src", "lib", "admin", "base.ts")).href);
  const P2P = await import(pathToFileURL(join(WEB, "src", "lib", "multiplayer", "p2p.ts")).href);
  const OverlayKeeper = require(join(ROOT, "desktop", "renderer", "keeper.js"));
  const menu = {
    right: K.rovingIndex("ArrowRight", 3, 4),
    left: K.rovingIndex("ArrowLeft", 0, 4),
    end: K.menuKey("End", 0, 4),
    esc: K.menuKey("Escape", 1, 4),
    tab: K.menuKey("Tab", 1, 4),
  };
  if (menu.right !== 0 || menu.left !== 3 || menu.end !== 3 || menu.esc !== "close" || menu.tab !== null) return fail("menu keys drift", { menu });
  // The visit on shown time: a hidden page holds the next step; showing it again runs it on time.
  let now = 0;
  const timers = new Map();
  let seq = 0;
  const listeners = new Set();
  const doc = { hidden: false, addEventListener: (_t, fn) => listeners.add(fn), removeEventListener: (_t, fn) => listeners.delete(fn) };
  const flip = (h) => { doc.hidden = h; for (const fn of [...listeners]) fn(); };
  const advance = (ms) => {
    const end = now + ms;
    for (;;) {
      const due = [...timers.entries()].filter(([, t]) => t.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
      if (!due) break;
      timers.delete(due[0]);
      now = due[1].at;
      due[1].fn();
    }
    now = end;
  };
  const ran = [];
  const stop = K.visibleTimeline([{ at: 1000, run: () => ran.push("in") }, { at: 2000, run: () => ran.push("gone") }], {
    doc,
    now: () => now,
    setTimeoutImpl: (fn, ms) => { timers.set(++seq, { fn, at: now + ms }); return seq; },
    clearTimeoutImpl: (id) => timers.delete(id),
  });
  advance(1500);
  flip(true);
  advance(60_000);
  const whileHidden = ran.length;
  flip(false);
  advance(500);
  stop();
  const visit = { whileHidden, after: ran.join(","), listeners: listeners.size };
  if (visit.whileHidden !== 1 || visit.after !== "in,gone" || visit.listeners !== 0) return fail("visit timeline ran behind a hidden tab", { visit });
  const plates = {
    esc: OverlayKeeper.cardKey({ key: "Escape", cardOpen: true, inPlate: true }),
    closed: OverlayKeeper.cardKey({ key: "Escape", cardOpen: false, inPlate: true }),
    card: OverlayKeeper.cardKey({ key: "Escape", cardOpen: true }),
    tab: OverlayKeeper.rovingIndex("ArrowRight", 3, 4),
  };
  if (plates.esc !== "card" || plates.closed !== "leave" || plates.card !== "close" || plates.tab !== 0) return fail("plate keys drift", { plates });
  const drop = [Card.afterDrop(1, 3), Card.afterDrop(3, 3), Card.afterDrop(0, 0), OverlayKeeper.afterDrop(3, 3)];
  if (JSON.stringify(drop) !== JSON.stringify([1, 2, -1, 2])) return fail("afterDrop drift", { drop });
  const ask = [B.revokeAskFocus("a", null), B.revokeAskFocus(null, "a"), B.revokeAskFocus(null, null)];
  if (JSON.stringify(ask) !== JSON.stringify(["confirm", "revoke", null])) return fail("revokeAskFocus drift", { ask });
  const poll = [P2P.pollDelay(true, true), P2P.pollDelay(false, false), P2P.pollDelay(false, true)];
  if (JSON.stringify(poll) !== JSON.stringify([400, 2000, 10000])) return fail("pollDelay drift", { poll });
  const text = (...p) => readFileSync(join(ROOT, ...p), "utf8").replace(/\r\n/g, "\n");
  const wires = [
    ["web/src/components/desk/guest-choice.tsx", ['role="menuitem"', "tabIndex={i === stop ? 0 : -1}", "menuKey(e.key", "onClose?.();"]],
    ["web/src/components/desk/companion-room.tsx", ['data-card="open"', "function openCardByKeys()", 'if (how?.keys) cardFocus.current = "open";', "onClose={() => {"]],
    ["web/src/components/desk/keeper-card.tsx", ["hideCard({ keys: true });", "data-line-drop={line.id}", "afterDrop(at, drops.length)"]],
    ["web/src/components/desk/house-floor.tsx", ['role="group" aria-label="Say hello to the walkers"', "tabStop={i === stop}"]],
    ["web/src/components/desk/house-visit.tsx", ["return visibleTimeline(["]],
    ["web/src/routes/admin.tsx", ["revokeAskFocus(pendingJti, kept)", "data-revoke-confirm", "keepLicense(row.jti)"]],
    ["web/src/lib/multiplayer/p2p.ts", ["this.schedulePoll(this.nextDelay());", 'this.doc?.removeEventListener("visibilitychange", this.onVisible);']],
    ["desktop/renderer/pet.js", ["backToCard();", "if (plateTabKey(e)) return;", '"linePlay", "lineDrop"', 'document.getElementById("hud-line-text")']],
    ["desktop/renderer/desk-house.js", ["btn.tabIndex = on ? 0 : -1;"]],
  ];
  for (const [rel, needs] of wires) {
    const body = text(...rel.split("/"));
    for (const need of needs) if (!body.includes(need)) return fail(`${rel} missing ${need}`);
  }
  if (/globalShortcut/.test(text("desktop", "main.cjs"))) return fail("main.cjs registers a global shortcut (ADR 0012)");
  return ok("sit menu keys, Escape and a key for the card, plate Escape and tabs, Drop keeps focus, one walker stop, revoke focus, hidden rests", { menu, visit, plates, drop, ask, poll }, [
    "menu=menuitem+arrows+escape",
    "card.web=escape+open_key",
    "plates=escape_to_card+tab_arrows",
    "lines.drop=focus_next",
    "walkers=one_stop",
    "admin=row_names+ask_focus",
    "idle=visit+flyers+p2p",
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

/**
 * First run on the web for a brand-new keeper: no saved storage at all. The card loads the house defaults,
 * the one-time hello shows, Got it keeps it gone across reloads (its own key, not the card), the heartbeat
 * says "House server not running (optional)" until the server answers once, and the clean-profile plate
 * words match the overlay. Also: the overlay choice menu keys match the web, and a confirmed revoke focuses
 * the status line.
 */
async function firstRun() {
  const store = new Map();
  const storage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
  };
  const hadWindow = Object.prototype.hasOwnProperty.call(globalThis, "window");
  const oldWindow = globalThis.window;
  globalThis.window = { localStorage: storage };
  try {
    const lib = (rel) => import(pathToFileURL(join(WEB, "src", "lib", ...rel.split("/"))).href);
    const Card = await lib("pets/card.ts");
    const F = await lib("pets/first-run.ts");
    const K = await lib("pets/keeper.ts");
    const WA = await lib("pets/weather-areas.ts");
    const M = await lib("pets/market.ts");
    const B = await lib("admin/base.ts");
    const OverlayKeeper = require(join(RENDERER, "keeper.js"));
    const OverlayChoice = require(join(RENDERER, "choice.js"));
    const bad = [];
    if (store.size) bad.push("the stand-in storage is not clean");
    const card = Card.loadCard();
    const defaults = { collapsed: card.collapsed, off: card.off, color: card.color, voiceStyle: card.voiceStyle };
    const blank = Card.blankCard();
    if (JSON.stringify(defaults) !== JSON.stringify({ collapsed: blank.collapsed, off: false, color: blank.color, voiceStyle: blank.voiceStyle })) {
      bad.push(`clean card is not the house defaults ${JSON.stringify(defaults)}`);
    }
    if (store.size) bad.push("loading a clean card wrote storage");
    let shows = 0;
    if (!F.firstHintSeen()) shows += 1;
    else bad.push("the hello does not show on a clean browser");
    if (F.firstHintSeen()) bad.push("the hello vanished before Got it");
    const hint = F.firstHintWeb("Rui");
    if (hint.title !== "Hi! This is Rui." || hint.ok !== "Got it" || hint.lines.length !== 3) bad.push("the web hello lost its words");
    F.markFirstHintSeen();
    // An older card write (the keeper card writes from its own copy) must not bring it back.
    Card.saveCard({ ...card, color: "moss" });
    if (!F.firstHintSeen()) shows += 1;
    if (shows !== 1) bad.push(`the hello showed ${shows} times across Got it and a reload`);
    if (JSON.stringify(OverlayKeeper.firstHint("Rui")) !== JSON.stringify(F.firstHintOverlay("Rui"))) bad.push("overlay hello words drifted from the web copy");

    let up = false;
    const poll = K.createHeartbeatPoll({
      doc: null,
      setIntervalImpl: () => 1,
      clearIntervalImpl: () => {},
      fetchImpl: async () => {
        if (!up) throw new TypeError("fetch failed");
        return { json: async () => ({ status: "UP", profile: "local", uptimeSeconds: 5, port: 8081 }) };
      },
    });
    const lines = [];
    await poll.read();
    lines.push(K.heartbeatLine(poll.current(), poll.answered()));
    up = true;
    await poll.read();
    lines.push(K.heartbeatLine(poll.current(), poll.answered()));
    up = false;
    await poll.read();
    lines.push(K.heartbeatLine(poll.current(), poll.answered()));
    const wantLines = ["House server not running (optional)", "House server running · up 5s", "House server stopped answering (optional). Pets still work."];
    if (JSON.stringify(lines) !== JSON.stringify(wantLines)) bad.push(`heartbeat lines ${JSON.stringify(lines)}`);

    const Areas = require(join(RENDERER, "weather-areas.js"));
    const Market = require(join(RENDERER, "market.js"));
    if (WA.NO_AREA_NEXT !== Areas.NO_AREA_NEXT || !/Look up/.test(WA.NO_AREA_NEXT)) bad.push("weather next step drifted");
    if (M.QUOTE_WAITS !== Market.QUOTE_WAITS) bad.push("quotes waiting words drifted");
    const house = M.parseMarket(undefined);
    const closed = M.plateLine(house, null, false, true);
    if (!closed.endsWith("· open to see the price")) bad.push(`closed web quotes read ${JSON.stringify(closed)}`);

    const keys = ["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End", "Escape", "x"];
    const drift = keys.filter((k) => JSON.stringify(OverlayChoice.menuKey(k, 1, 4)) !== JSON.stringify(K.menuKey(k, 1, 4)));
    if (drift.length) bad.push(`overlay menu keys drift from the web: ${drift.join(", ")}`);
    if (B.revokeDoneFocus("revoked") !== "status" || B.revokeDoneFocus("failed") !== null) bad.push("revokeDoneFocus drifted");
    const read = (...p) => readFileSync(join(ROOT, ...p), "utf8");
    const room = read("web", "src", "components", "desk", "companion-room.tsx");
    const plates = read("web", "src", "components", "desk", "desk-plates.tsx");
    const admin = read("web", "src", "routes", "admin.tsx");
    const html = read("desktop", "renderer", "index.html");
    const p2p = read("web", "src", "lib", "multiplayer", "p2p.ts");
    if (!room.includes("<FirstHint")) bad.push("the room does not show the hello");
    if ((plates.match(/role="tabpanel"/g) || []).length !== 2) bad.push("web plate tabs have no tabpanel");
    if (!/aria-controls="weather-panel"/.test(html) || !/role="tabpanel"/.test(html)) bad.push("overlay plate tabs have no tabpanel");
    if (!admin.includes("statusLine.current?.focus()")) bad.push("a confirmed revoke does not focus the status line");
    if (/signaling\.server\.ts/.test(p2p) || !/DORMANT/.test(p2p)) bad.push("p2p still points at a missing relay");
    if (/globalShortcut/.test(read("desktop", "main.cjs"))) bad.push("main.cjs registers a global shortcut");
    return bad.length
      ? fail(bad.join("; "), { defaults, lines })
      : ok("a clean browser gets the house defaults, the hello once, and a calm heartbeat until the server answers", { defaults, lines, shows }, [
          "clean=no_storage",
          "defaults=house",
          "hint=shows_once+own_key",
          "heartbeat=optional>up>down",
          "plates=next_step+quotes_wait",
          "menu=overlay_matches_web",
          "admin=revoke_focus_status",
          "p2p=dormant",
        ]);
  } finally {
    if (hadWindow) globalThis.window = oldWindow;
    else delete globalThis.window;
  }
}

/**
 * Kid-plain words on the keeper card and desk plates, web and overlay in lockstep: the heartbeat and the
 * overlay's house-server row say running / stopped answering / not running (optional), with the port and
 * profile only in the tooltip; the care, Turn off, GPU, listener, and forecast-miss lines never say
 * "unread", a port, a path, or "door"; the closed weather and news headers say to open the plate; and
 * the web plate tabs are one Tab stop (no aria-pressed) that take the overlay's arrow / Home / End keys.
 */
async function plainWords() {
  const lib = (rel) => import(pathToFileURL(join(WEB, "src", "lib", ...rel.split("/"))).href);
  const K = await lib("pets/keeper.ts");
  const G = await lib("pets/gpu.ts");
  const L = await lib("ai/listener.ts");
  const WA = await lib("pets/weather-areas.ts");
  const N = await lib("pets/news.ts");
  const OK = require(join(RENDERER, "keeper.js"));
  const OG = require(join(RENDERER, "gpu.js"));
  const OL = require(join(RENDERER, "listener.js"));
  const OWA = require(join(RENDERER, "weather-areas.js"));
  const ON = require(join(RENDERER, "news.js"));
  const JARGON = /\bunread\b|\bJava\b|\b808[01]\b|\/pet\/|\bdoor\b|\bDOWN\b|\bRSS\b|site:|\bmalformed\b/;
  const bad = [];

  const beat = K.parseHeartbeat({ status: "UP", profile: "local", uptimeSeconds: 7200, port: 8081 });
  const heartbeat = {
    never: K.heartbeatLine(K.UNREAD_HEARTBEAT, false),
    up: K.heartbeatLine(beat, true),
    stopped: K.heartbeatLine(K.UNREAD_HEARTBEAT, true),
    tooltip: K.heartbeatDetail(beat),
  };
  const rows = {
    never: OK.houseServerLine({ show: true, reachable: false, seen: false }),
    up: OK.houseServerLine({ show: true, reachable: true, seen: true, uptimeSeconds: 7200 }),
    stopped: OK.houseServerLine({ show: true, reachable: false, seen: true }),
  };
  if (heartbeat.never !== "House server not running (optional)") bad.push(`never answered reads ${heartbeat.never}`);
  if (heartbeat.up !== "House server running · up 2h") bad.push(`up reads ${heartbeat.up}`);
  if (heartbeat.stopped !== "House server stopped answering (optional). Pets still work.") bad.push(`stopped reads ${heartbeat.stopped}`);
  if (heartbeat.tooltip !== "Java 8081 · UP · local · 2h") bad.push(`tooltip lost the detail: ${heartbeat.tooltip}`);
  if (JSON.stringify(rows) !== JSON.stringify({ never: heartbeat.never, up: heartbeat.up, stopped: heartbeat.stopped })) {
    bad.push(`overlay row drifted from the web line ${JSON.stringify(rows)}`);
  }

  const mac = G.sampleFromProbe({ nvidiaCsv: "Apple M2, [N/A], 16, 542, [N/A], [N/A]" }, { platform: "darwin", nowMs: 1790000000000 });
  const gpu = [G.gpuLine(G.UNREAD_GPU), G.gpuLine(G.parseSample(0)), G.gpuLine(mac), ...Object.values(G.GPU_WORDS)];
  const overlayGpu = [OG.gpuLine(OG.UNREAD), OG.gpuLine(OG.parseSample(0)), OG.gpuLine(mac), ...Object.values(OG.GPU_WORDS)];
  if (JSON.stringify(gpu) !== JSON.stringify(overlayGpu)) bad.push(`GPU words drifted ${JSON.stringify([gpu, overlayGpu])}`);
  if (gpu[0] !== "GPU · no reading" || gpu[2] !== "GPU Apple M2 · — · 16% · 542 MiB/— · —") bad.push(`GPU lines ${JSON.stringify(gpu)}`);

  const seattle = WA.addArea(WA.blankAreas(), { name: "Seattle", lat: 47.6, lon: -122.3 });
  const lines = {
    care: K.careTruth(),
    quitWeb: K.QUIT_TRUTH,
    quitOverlay: OK.QUIT_TRUTH,
    listener: L.UNREAD_LISTENER.line,
    forecastMiss: WA.plateLine(seattle, null, true),
    sky: WA.skyLabel("clear", 8, ""),
    weatherClosed: WA.plateLine(WA.blankAreas(), null, false, false, false, true),
    weatherOpen: WA.plateLine(WA.blankAreas(), null),
    newsClosed: N.newsLine([], false, true),
    newsOpen: N.newsLine([], false, false),
    topics: N.TOPIC_TRUTH,
  };
  if (lines.care !== OK.careTruth() || lines.care !== "Your pet's care stays on this computer.") bad.push(`care line ${lines.care}`);
  if (!/Sit again/.test(lines.quitWeb) || !/type \.\\desktop\.ps1 again/.test(lines.quitOverlay)) bad.push("Turn off lines lost their next step");
  if (lines.listener !== OL.UNREAD.line || lines.listener !== "Listening · not sure") bad.push(`listener line ${lines.listener}`);
  if (lines.forecastMiss !== "Seattle · can't reach" || OWA.plateLine(seattle, null, true) !== lines.forecastMiss) bad.push(`forecast miss ${lines.forecastMiss}`);
  if (lines.weatherClosed !== "open to add a place" || OWA.plateLine(OWA.blankAreas(), null, false, false, false, true) !== lines.weatherClosed) bad.push(`closed weather ${lines.weatherClosed}`);
  if (lines.newsClosed !== "open to see headlines" || ON.newsLine([], false, true) !== lines.newsClosed) bad.push(`closed news ${lines.newsClosed}`);
  if (lines.weatherOpen !== "no place yet" || lines.newsOpen !== "no headlines yet") bad.push("open headers changed");
  if (N.TOPIC_TRUTH !== ON.TOPIC_TRUTH) bad.push("topic words drifted");
  const said = [...Object.values(heartbeat).slice(0, 3), ...Object.values(rows), ...gpu, ...Object.entries(lines).filter(([k]) => k !== "quitOverlay").map(([, v]) => v)];
  const leaks = said.filter((s) => JARGON.test(s));
  if (leaks.length) bad.push(`developer words on screen: ${JSON.stringify(leaks)}`);

  const html = readFileSync(join(RENDERER, "index.html"), "utf8");
  const text = (id) => (html.match(new RegExp(`id="${id}"[^>]*>([^<]*)<`)) || [])[1];
  if (text("hud-truth") !== lines.care || text("hud-gpu-line") !== gpu[0] || text("weather-line") !== lines.weatherClosed || text("news-line") !== lines.newsClosed) {
    bad.push("overlay index.html ships old words before the first paint");
  }
  if (text("hud-off-truth") !== lines.quitOverlay) bad.push("overlay Turn off line drifted from keeper.js");

  const plates = readFileSync(join(WEB, "src", "components", "desk", "desk-plates.tsx"), "utf8");
  const tabs = plates.split(/role="tab"\s/).slice(1).map((s) => s.slice(0, s.indexOf("onClick")));
  if (tabs.length !== 2 || tabs.some((t) => /aria-pressed/.test(t) || !/aria-selected=\{tab === id\}/.test(t) || !/tabIndex=\{tab === id \? 0 : -1\}/.test(t))) {
    bad.push("web plate tabs are not a roving tablist without aria-pressed");
  }
  if ((plates.match(/onKeyDown=\{onPlateTabKey\}/g) || []).length !== 2) bad.push("web plate tablists do not take arrow keys");
  const keys = ["ArrowRight", "ArrowLeft", "Home", "End", "ArrowUp", "ArrowDown", "Enter", " "];
  const drift = keys.filter((k) => K.tabKey(k, 1, 4) !== OK.rovingIndex(k, 1, 4));
  if (drift.length) bad.push(`web tab keys drift from the overlay: ${drift.join(", ")}`);

  if (bad.length) return fail(bad.join("; "), { heartbeat, rows, gpu, lines });
  return ok("kid-plain keeper card and plates on web and overlay; web plate tabs rove like the overlay", { heartbeat, rows, gpu, lines }, [
    "heartbeat=optional+running+stopped",
    "tooltip=port_profile",
    "care=plain",
    "gpu=no_unread",
    "listener=not_sure",
    "plates.closed=open_to",
    "tabs.web=roving+no_pressed",
    "lockstep=web+overlay",
  ]);
}

async function consentPlain() {
  const lib = (rel) => import(pathToFileURL(join(WEB, "src", "lib", ...rel.split("/"))).href);
  const WA = await lib("pets/weather-areas.ts");
  const N = await lib("pets/news.ts");
  const M = await lib("pets/market.ts");
  const K = await lib("pets/keeper.ts");
  const B = await lib("admin/base.ts");
  const HM = await lib("pets/house-music.ts");
  const OWA = require(join(RENDERER, "weather-areas.js"));
  const ON = require(join(RENDERER, "news.js"));
  const OM = require(join(RENDERER, "market.js"));
  const OK = require(join(RENDERER, "keeper.js"));
  const PlateNet = require(join(ROOT, "desktop", "presence", "plate-net.cjs"));
  const JARGON = /https request|as any client|geocode host|forecast host|news host|quote host|terminal host|stock host|wikipedia host|rss feed|os or browser prompt|revoke that grant|\bjti\b|soft-delet|pump mint|mint or contract|honest offline|needs a key/i;
  const bad = [];

  const mixedPrefs = { marketTickers: [
    { symbol: "ETH", kind: "crypto", geckoId: "ethereum", name: "Ethereum" },
    { symbol: "PUMP", kind: "crypto", name: "Pump", platform: "solana", address: "So11111111111111111111111111111111111111112" },
  ], nftCollections: [], nftCustomized: true };
  const lines = {
    forecast: WA.TYPED_FORECAST,
    savedForecast: WA.SAVED_FORECAST_CONTINUE,
    savedAsk: WA.SAVED_HERE_ASK,
    look: WA.GEOCODE_LOOK,
    reverse: WA.GEOCODE_REVERSE,
    hereAsk: WA.HERE_ASK,
    hereSend: WA.HERE_SEND,
    news: N.NEWS_RSS_HONESTY,
    wiki: N.NEWS_WIKI_HONESTY,
    quote: M.quoteHonesty(M.parseMarket(mixedPrefs)),
    quoteLook: M.QUOTE_LOOK,
  };
  const overlay = {
    forecast: OWA.TYPED_FORECAST,
    savedForecast: OWA.SAVED_FORECAST_CONTINUE,
    savedAsk: OWA.SAVED_HERE_ASK,
    look: OWA.GEOCODE_LOOK,
    reverse: OWA.GEOCODE_REVERSE,
    hereAsk: OWA.HERE_ASK,
    hereSend: OWA.HERE_SEND,
    news: ON.NEWS_RSS_HONESTY,
    wiki: ON.NEWS_WIKI_HONESTY,
    quote: OM.quoteHonesty(OM.parseMarket(mixedPrefs)),
    quoteLook: OM.QUOTE_LOOK,
  };
  if (JSON.stringify(lines) !== JSON.stringify(overlay)) bad.push(`web and overlay consent lines drifted ${JSON.stringify([lines, overlay])}`);
  const names = { forecast: "Open-Meteo", savedForecast: "Open-Meteo", savedAsk: "Open-Meteo", look: "Open-Meteo", reverse: "Open-Meteo", hereSend: "Open-Meteo", news: "Google News", wiki: "Wikipedia", quote: "CoinGecko and GeckoTerminal", quoteLook: "CoinGecko" };
  for (const [k, site] of Object.entries(names)) if (!lines[k].includes(site)) bad.push(`${k} does not name ${site}`);
  for (const k of ["forecast", "savedForecast", "savedAsk", "look", "reverse", "news", "wiki", "quote", "quoteLook"]) {
    if (!/This computer's internet address also goes to .+, like visiting any website\./.test(lines[k])) bad.push(`${k} does not say the internet address goes along`);
    if (!/It sends |This sends /.test(lines[k])) bad.push(`${k} does not say what it sends`);
  }
  const leaks = Object.entries(lines).filter(([, v]) => JARGON.test(v)).map(([k]) => k);
  if (leaks.length) bad.push(`developer words in consent lines: ${leaks.join(", ")}`);

  const gate = {
    forecast: WA.forecastMayLeave(lines.forecast) && WA.forecastMayLeave(lines.savedForecast) && !WA.forecastMayLeave(lines.look) && !WA.forecastMayLeave(WA.FORECAST_NET) && !WA.forecastMayLeave(lines.savedAsk),
    look: WA.geocodeLookMayLeave(lines.look) && !WA.geocodeLookMayLeave(lines.reverse),
    reverse: WA.geocodeReverseMayLeave(lines.reverse) && !WA.geocodeReverseMayLeave(lines.look),
    news: N.rssMayLeave(lines.news) && !N.rssMayLeave(lines.wiki) && N.featuredMayLeave(lines.wiki) && !N.featuredMayLeave(lines.news),
    quote: M.quoteHostMayLeave(lines.quote, M.TERMINAL_HOST_NAME) && M.quoteHostMayLeave(lines.quote, M.QUOTE_HOST_NAME) && !M.quoteHostMayLeave(lines.quote, M.STOCK_HOST_NAME) && M.lookMayLeave(lines.quoteLook) && !M.lookMayLeave(lines.quote),
    main: PlateNet.mayFetch("news", lines.news, ["https://news.google.com/rss"]) && PlateNet.mayFetch("quote", lines.quote, ["https://api.coingecko.com/api/v3/simple/price"])
      && PlateNet.mayFetch("terminal", lines.quote, ["https://api.geckoterminal.com/x"]) && !PlateNet.mayFetch("stock", lines.quote, ["https://query1.finance.yahoo.com/x"])
      && PlateNet.mayFetch("look", lines.quoteLook, ["https://api.coingecko.com/api/v3/search"]) && !PlateNet.mayFetch("news", lines.wiki, ["https://news.google.com/rss"])
      && !PlateNet.mayFetch("news", "this news send reads the rss feed. " + WA.clientNetLine("the news host"), ["https://news.google.com/rss"]),
    radioKept: HM.RADIO_NET === WA.clientNetLine("the radio host") && PlateNet.mayFetch("radio", `${PlateNet.RADIO_LEAD} ${HM.RADIO_NET}`, ["https://de1.api.radio-browser.info/json"]),
  };
  const shut = Object.entries(gate).filter(([, v]) => !v).map(([k]) => k);
  if (shut.length) bad.push(`gates drifted: ${shut.join(", ")}`);

  const html = readFileSync(join(RENDERER, "index.html"), "utf8");
  const shipped = ["savedAsk", "look", "reverse", "hereAsk", "hereSend", "quoteLook"].filter((k) => !html.includes(lines[k]));
  if (shipped.length) bad.push(`overlay index.html ships old consent words: ${shipped.join(", ")}`);

  const card = readFileSync(join(WEB, "src", "components", "desk", "keeper-card.tsx"), "utf8");
  if (/keeper-gpu|gpuLine\(/.test(card)) bad.push("the web card still paints a GPU line");
  const tones = {
    webNever: K.heartbeatTone(K.UNREAD_HEARTBEAT, false),
    webStopped: K.heartbeatTone(K.UNREAD_HEARTBEAT, true),
    webUp: K.heartbeatTone(K.parseHeartbeat({ status: "UP" }), true),
    overlayNever: OK.houseServerTone({ show: true, reachable: false, seen: false }),
    overlayStopped: OK.houseServerTone({ show: true, reachable: false, seen: true }),
    overlayUp: OK.houseServerTone({ show: true, reachable: true, seen: true }),
  };
  if (JSON.stringify(tones) !== JSON.stringify({ webNever: "OFF", webStopped: "DOWN", webUp: "UP", overlayNever: "OFF", overlayStopped: "DOWN", overlayUp: "UP" })) bad.push(`heartbeat tones ${JSON.stringify(tones)}`);
  const webCss = readFileSync(join(WEB, "src", "styles.css"), "utf8");
  const deskCss = readFileSync(join(RENDERER, "styles.css"), "utf8");
  if (!/\.keeper-heartbeat\[data-heartbeat="DOWN"\]/.test(webCss) || !/#hud-heartbeat\[data-heartbeat="DOWN"\]/.test(deskCss) || /data-heartbeat="OFF"\]/.test(webCss + deskCss)) {
    bad.push("only a stopped server should be styled as a warning");
  }
  if (!/data-heartbeat=\{heartbeatTone\(beat, heartbeatPoll\.answered\(\)\)\}/.test(card)) bad.push("the web card does not paint the heartbeat tone");

  const quotes = { placeholder: M.MARKET_PLACEHOLDER, truth: M.MARKET_TRUTH, nft: M.NFT_TRUTH, venue: M.parseMarket({}).marketplaces[0].note };
  const overlayQuotes = { placeholder: OM.MARKET_PLACEHOLDER, truth: OM.MARKET_TRUTH, nft: OM.NFT_TRUTH, venue: OM.parseMarket({}).marketplaces[0].note };
  if (JSON.stringify(quotes) !== JSON.stringify(overlayQuotes)) bad.push("quotes plate words drifted between web and overlay");
  const admin = readFileSync(join(WEB, "src", "routes", "admin.tsx"), "utf8");
  const adminSaid = [B.REVOKED_NOTE, B.revokedListStale("Try again in a moment."), ...Object.values(quotes)];
  if (adminSaid.some((s) => JARGON.test(s)) || /jti or owner|Soft-deleted|" · hwid"|Same gate as the API/.test(admin)) bad.push("admin or quotes words still carry developer words");

  if (bad.length) return fail(bad.join("; "), { lines, gate, tones, quotes });
  return ok("network consent lines name the website in plain words on web and overlay; same gates; web GPU hidden; calm server tone", { lines, gate, tones, quotes }, [
    "consent=names_site+what_is_sent",
    "consent=no_https_jargon",
    "gate=same_painted_lines",
    "main=plain_lines+radio_kept",
    "overlay.html=same_words",
    "gpu.web=hidden",
    "heartbeat=off_neutral+down_warns",
    "quotes+admin=plain",
    "lockstep=web+overlay",
  ]);
}

async function consentTypesPlain() {
  const lib = (rel) => import(pathToFileURL(join(WEB, "src", "lib", ...rel.split("/"))).href);
  const T = await lib("pets/talk-net.ts");
  const P = await lib("multiplayer/p2p.ts");
  const WA = await lib("pets/weather-areas.ts");
  const N = await lib("pets/news.ts");
  const M = await lib("pets/market.ts");
  const vm = await import("node:vm");
  const fs = await import("node:fs");
  const OWA = require(join(RENDERER, "weather-areas.js"));
  const ON = require(join(RENDERER, "news.js"));
  const OM = require(join(RENDERER, "market.js"));
  const page = require(join(RENDERER, "license-net.js"));
  const main = require(join(ROOT, "desktop", "license", "license-net.cjs"));
  const py = readFileSync(join(ROOT, "client", "computerpets_client", "license", "license_net.py"), "utf8");
  const JARGON = /https request|as any client|network address|license hash|signed bundle|the talk host|the voice host|STUN host|name the host/i;
  const PLAIN = /This computer's internet address (also )?goes to .+, like visiting any website\./;
  const bad = [];

  const win = {
    PetWeatherAreas: OWA,
    localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    sessionStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    URL, URLSearchParams, AbortController, setTimeout, clearTimeout,
    fetch: async () => ({ ok: true, json: async () => ({}) }),
  };
  win.window = win;
  vm.runInContext(readFileSync(join(RENDERER, "mind.js"), "utf8"), vm.createContext(win));
  const backend = "https://license.example.test/api/verify";
  const cdn = "https://cdn.example.test/pet.zip?sig=abc";
  const lines = {
    talk: T.talkHonesty({ plugin: "xai" }),
    voice: T.voiceHonesty("xai"),
    stun: P.stunNetLine("stun.example.test"),
    unlock: main.licenseHonesty(backend),
    download: main.downloadTalkHonesty(backend),
    bundle: main.bundleHonesty(cdn),
  };
  if (!lines.talk.startsWith("This sends what you typed, your pet's name, and how hungry, happy, and rested it is to xAI, an AI website, so your pet can answer.")) bad.push(`talk line ${lines.talk}`);
  if (!lines.voice.startsWith("This sends the words your pet will say to xAI, an AI website,")) bad.push(`voice line ${lines.voice}`);
  if (!lines.stun.startsWith("This asks stun.example.test, a website that helps computers find each other")) bad.push(`stun line ${lines.stun}`);
  if (!lines.unlock.startsWith("This asks license.example.test, the license website, to check your license.")) bad.push(`unlock line ${lines.unlock}`);
  if (!lines.download.startsWith("This asks license.example.test, the license website, for your pet.")) bad.push(`download line ${lines.download}`);
  if (!lines.bundle.startsWith("This gets your pet's files from cdn.example.test, the download website")) bad.push(`bundle line ${lines.bundle}`);
  for (const [k, v] of Object.entries(lines)) {
    if (JARGON.test(v)) bad.push(`${k} still has developer words`);
    if (!PLAIN.test(v)) bad.push(`${k} does not say the internet address goes along`);
  }
  const overlay = {
    talk: ["xai", "openai", "anthropic", "google"].every((plugin) => win.PetMind.talkHonesty({ plugin }) === T.talkHonesty({ plugin })),
    unlock: page.licenseHonesty(backend) === lines.unlock,
    download: page.downloadTalkHonesty(backend) === lines.download,
    bundle: page.bundleHonesty(cdn) === lines.bundle,
    idle: ["LOCAL_STAYS", "DOWNLOAD_LOCAL", "BUNDLE_LOCAL", "BUNDLE_IDLE"].every((k) => page[k] === main[k] && py.includes(`${k} = ${JSON.stringify(main[k])}`)),
    python: ["unlock", "download", "bundle"].every((k) => py.includes(lines[k].slice(0, lines[k].indexOf(" This computer's")).replace(/license\.example\.test|cdn\.example\.test/g, "{target['label']}"))),
  };
  const drift = Object.entries(overlay).filter(([, v]) => !v).map(([k]) => k);
  if (drift.length) bad.push(`web, overlay, main, and blotter lines drifted: ${drift.join(", ")}`);
  const gate = {
    talk: T.talkMaySend({ plugin: "xai" }, true) && !T.talkMaySend({ plugin: "xai" }, false) && win.PetMind.talkMaySend({ plugin: "xai" }, true) && !T.talkMayLeave(WA.plainNetLine("xAI"), { plugin: "xai" }),
    voice: T.voiceMayLeave(lines.voice, "xai") && !T.voiceMayLeave(lines.talk, "xai"),
    unlock: main.licenseMaySend(backend, lines.unlock) && !main.licenseMaySend(backend, lines.download),
    download: main.downloadMayPost(backend, lines.download) && !main.downloadMayPost(backend, lines.unlock),
    bundle: main.bundleMayFetch(cdn, lines.bundle) && !main.bundleMayFetch(cdn, main.plainNetLine("cdn.example.test")),
  };
  const shut = Object.entries(gate).filter(([, v]) => !v).map(([k]) => k);
  if (shut.length) bad.push(`gates drifted: ${shut.join(", ")}`);

  const lum = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)).reduce((s, c, i) => s + c * [0.2126, 0.7152, 0.0722][i], 0);
  const lumRgb = (rgb) => lum("#" + rgb.map((c) => Math.round(c).toString(16).padStart(2, "0")).join(""));
  const ratio = (a, b) => { const [x, y] = [a, b].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const webCss = readFileSync(join(WEB, "src", "styles.css"), "utf8");
  const deskCss = readFileSync(join(RENDERER, "styles.css"), "utf8");
  const warnDark = (webCss.match(/@theme \{[\s\S]*?--color-warn: (#[0-9a-f]{6});/i) || [])[1];
  const warnPaper = (webCss.match(/\.paper-card \{[\s\S]*?--color-warn: (#[0-9a-f]{6});/i) || [])[1];
  const warnDesk = (deskCss.match(/:root \{\s*--color-warn: (#[0-9a-f]{6});/i) || [])[1];
  const cards = [[12, 11, 10, 0.92], [58, 48, 38, 0.94], [24, 36, 28, 0.94], [48, 28, 22, 0.94], [28, 26, 42, 0.94], [28, 34, 40, 0.94]];
  let worst = Infinity;
  if (warnDark) for (const [r, g, b, a] of cards) for (const u of [0, 255]) worst = Math.min(worst, ratio(lum(warnDark), lumRgb([r, g, b].map((c) => a * c + (1 - a) * u))));
  const paperRatio = warnPaper ? ratio(lum(warnPaper), lum("#e8dfd0")) : 0;
  const contrast = { dark: warnDark, paper: warnPaper, overlay: warnDesk, worstDark: Math.round(worst * 100) / 100, paperRatio: Math.round(paperRatio * 100) / 100 };
  if (!warnDark || warnDesk !== warnDark || worst < 4.5 || paperRatio < 4.5 || /#c79a5a/i.test(webCss + deskCss)
    || !/data-heartbeat="DOWN"\] \{\s*color: var\(--color-warn\);/.test(webCss) || !/data-heartbeat="DOWN"\] \{\s*color: var\(--color-warn\);/.test(deskCss)) {
    bad.push(`warning colour ${JSON.stringify(contrast)}`);
  }

  const words = {
    favorites: [WA.FAVORITES_EMPTY, N.FAVORITES_EMPTY, M.FAVORITES_EMPTY].every((s) => s.startsWith("Nothing saved yet. Tap ☆ next to"))
      && OWA.FAVORITES_EMPTY === WA.FAVORITES_EMPTY && ON.FAVORITES_EMPTY === N.FAVORITES_EMPTY && OM.FAVORITES_EMPTY === M.FAVORITES_EMPTY,
    waits: WA.FORECAST_WAITS === "open to see the weather" && OWA.FORECAST_WAITS === WA.FORECAST_WAITS && OWA.FORECAST_LOOKING === WA.FORECAST_LOOKING,
    price: OM.PRICE_LOOKING === M.PRICE_LOOKING && OM.SEARCHING === M.SEARCHING,
    gone: ![join(WEB, "src", "components", "desk", "desk-plates.tsx"), join(RENDERER, "pet.js"), join(RENDERER, "desk-house.js"), join(RENDERER, "market.js")]
      .some((f) => /looking up|forecast waits|No favorites yet/.test(readFileSync(f, "utf8"))),
  };
  const stale = Object.entries(words).filter(([, v]) => !v).map(([k]) => k);
  if (stale.length) bad.push(`old plate words: ${stale.join(", ")}`);

  const Morel = await lib("pets/morel-tricks.ts");
  const OMorel = require(join(RENDERER, "morel-tricks.js"));
  const ends = (Mod) => { let tr = Mod.beginTrick("costa", 100, 1); let n = 0; while (tr.phase !== "done" && n < 200) { tr = Mod.stepTrick(tr, 0.05, {}); n++; } return tr.phase === "done"; };
  const poseOk = [["choir-tricks", "motetPose", "motet"], ["nimbus-tricks", "fogbowPose", "fogbow"], ["gecko-tricks", "denspadPose", "denspad"], ["gecko-tricks", "inkpadPose", "inkpad"]];
  const thankYous = [];
  for (const [mod, pose, key] of poseOk) {
    const W = await lib(`pets/${mod}.ts`);
    const O = require(join(RENDERER, `${mod}.js`));
    const mid = W.HAPPY_DUR[key] / 2;
    thankYous.push(Number.isFinite(W[pose](mid).lift) && Number.isFinite(O[pose](mid).lift));
  }
  const STOPS = [{ asleep: true }, { hidden: true }, { cmd: "talk" }, { card: true }];
  const throwers = [];
  for (const f of fs.readdirSync(RENDERER).filter((n) => n.endsWith("-tricks.js") && n !== "ground-tricks.js")) {
    const Mod = require(join(RENDERER, f));
    try {
      for (const k of Mod.TRICKS || []) for (const s of STOPS) Mod.stepTrick(Mod.beginTrick(k, 100, 1), 0.05, s);
      for (const k of Mod.HAPPY || []) for (const s of STOPS) Mod.stepHappy(Mod.beginHappy(k, 100, 1), 0.05, s);
      if (Mod.startThankYou) Mod.startThankYou(Mod.TRICK_KEY, null, 100, 1, { cmd: "idle" });
    } catch (err) {
      throwers.push(`${f}: ${err.message}`);
    }
  }
  const baseline = readFileSync(join(WEB, "tsc-baseline.txt"), "utf8").trim();
  const bugs = { morelCosta: ends(Morel) && ends(OMorel) && Morel.DUR.costa === 1.68, thankYous: thankYous.every(Boolean), overlayThrows: throwers.length, tscBaseline: baseline };
  if (!bugs.morelCosta) bad.push("Morel costa still never ends");
  if (!bugs.thankYous) bad.push("a thank-you pose is still not a number");
  if (throwers.length) bad.push(`overlay tricks throw: ${throwers.slice(0, 5).join("; ")}`);
  if (baseline !== "0") bad.push(`web tsc baseline is ${baseline}, not 0`);
  const gpu = readFileSync(join(WEB, "src", "lib", "pets", "gpu.ts"), "utf8");
  if (!/Why this file stays although no web component imports it/.test(gpu)) bad.push("web gpu.ts does not say why it stays");

  if (bad.length) return fail(bad.join("; "), { lines, gate, contrast, words, bugs });
  return ok("cloud talk, voice, license, and STUN lines name the website in plain words on web, overlay, main, and blotter; same gates; warning colour passes AA; plain plate words; type-found bugs stay fixed", { lines, gate, contrast, words, bugs }, [
    "consent=talk+voice+license+stun_plain",
    "lockstep=web+overlay+main+blotter",
    "gate=same_painted_lines",
    "warn=css_var+wcag_aa",
    "words=favorites+waits+price_plain",
    "bugs=morel_costa+thank_you_nan+overlay_shorthand",
    "tsc=0",
    "gpu.ts=kept_for_parity",
  ]);
}

async function loopGuardUnlockPlain() {
  const bad = [];
  const fs = await import("node:fs");
  const FG = require(join(RENDERER, "frame-guard.js"));
  const Cat = require(join(RENDERER, "cat-tricks.js"));
  // A real trick module whose step throws, run through the same guarded loop pet.js uses.
  const Broken = { ...Cat, stepTrick() { throw new Error("injected trick fault"); } };
  const queue = [];
  const schedule = (fn) => queue.push(fn);
  const logs = [];
  const sim = { x: 300, facing: 1, anim: "idle", hop: 0, land: 0, cmd: "wander", trick: null, trickWait: 0, happy: null, play: null, thankYou: false, act: null };
  const guard = FG.makeGuard({ log: (t) => logs.push(t), reset: (key) => { if (key === Cat.TRICK_KEY) FG.safeIdle(sim); } });
  let frames = 0;
  let begun = 0;
  let resets = 0;
  let last = 0;
  function frame(now) {
    const dt = Math.min(0.08, (now - last) / 1000);
    last = now;
    frames += 1;
    if (sim.trick) {
      sim.trick = Broken.stepTrick(sim.trick, dt, { cmd: sim.cmd });
      sim.x = sim.trick.x;
    } else {
      sim.trickWait -= dt;
      if (sim.trickWait <= 0) {
        sim.trick = Broken.beginTrick(Broken.TRICKS[0], sim.x, sim.facing);
        sim.anim = sim.trick.anim;
        begun += 1;
        sim.trickWait = Broken.nextTrickWait(false);
      }
    }
  }
  const tick = FG.guardedLoop(frame, schedule, guard, () => Cat.TRICK_KEY);
  schedule(tick);
  let now = 0;
  for (let i = 0; i < 1200 && queue.length; i += 1) {
    const hadTrick = !!sim.trick;
    now += 1000 / 60;
    queue.shift()(now);
    if (hadTrick && !sim.trick && sim.anim === "idle") resets += 1;
  }
  const guardRun = { frames, pending: queue.length, caught: guard.caught(), logs: logs.length, begun, resets, idle: sim.anim === "idle" && sim.trick === null, log: logs[0] || "" };
  if (frames !== 1200 || queue.length !== 1) bad.push(`loop stopped: ${frames} frames, ${queue.length} queued`);
  if (guard.caught() < 2 || begun < 2 || resets !== guard.caught()) bad.push(`broken trick was not reset each time ${JSON.stringify(guardRun)}`);
  if (logs.length !== 1 || !logs[0].includes("(cat)") || !logs[0].includes("injected trick fault")) bad.push(`log was not once with the pet key: ${JSON.stringify(logs)}`);
  const pet = readFileSync(join(RENDERER, "pet.js"), "utf8");
  const html = readFileSync(join(RENDERER, "index.html"), "utf8");
  const body = pet.slice(pet.indexOf("function tickFrame(now)"), pet.indexOf("function resetAfterFrameError"));
  const wired = {
    loop: /const tick = window\.PetFrameGuard\.guardedLoop\(tickFrame,/.test(pet),
    noTailRaf: body.length > 1000 && !/requestAnimationFrame\(tick\)/.test(body),
    guests: ["visit guest", "bird", "robin", "plants", "called guests"].every((k) => body.includes(`"${k}")`)),
    reset: /window\.PetFrameGuard\.safeIdle\(sim\)/.test(pet),
    script: html.indexOf('src="frame-guard.js"') > 0 && html.indexOf('src="frame-guard.js"') < html.indexOf('src="pet.js"'),
  };
  const unwired = Object.entries(wired).filter(([, v]) => !v).map(([k]) => k);
  if (unwired.length) bad.push(`pet.js loop guard not wired: ${unwired.join(", ")}`);
  // checkJs: the pass is wired, and the bugs it found stay fixed.
  const baselineJs = readFileSync(join(ROOT, "desktop", "checkjs-baseline.txt"), "utf8").trim();
  const WP = require(join(RENDERER, "window-play.js"));
  const wpSrc = readFileSync(join(RENDERER, "window-play.js"), "utf8");
  const apiStart = wpSrc.indexOf("  const api = {");
  const apiKeys = wpSrc.slice(apiStart, wpSrc.indexOf("\n  };", apiStart)).match(/[A-Za-z_$][\w$]*(?=\s*,)/g) || [];
  const repeats = [];
  const realRandom = Math.random;
  try {
    for (const f of fs.readdirSync(RENDERER).filter((n) => n.endsWith("-tricks.js") && n !== "ground-tricks.js")) {
      const Mod = require(join(RENDERER, f));
      if (typeof Mod.startThankYou !== "function" || !Array.isArray(Mod.HAPPY) || Mod.HAPPY.length < 2) continue;
      Math.random = () => 0;
      const got = Mod.startThankYou(Mod.TRICK_KEY, Mod.HAPPY[0], 100, 1, { cmd: "idle" });
      if (got && got.kind === Mod.HAPPY[0]) repeats.push(f);
    }
  } finally {
    Math.random = realRandom;
  }
  const checkjs = {
    baseline: baselineJs,
    wired: ["test-all.ps1", "test-all.sh"].every((f) => readFileSync(join(ROOT, "scripts", f), "utf8").includes("checkjs-baseline.mjs")),
    apiDuplicates: apiKeys.length - new Set(apiKeys).size,
    thankYouRepeats: repeats.length,
    ignoreGuard: WP.playFor("cat") !== WP.IGNORE && /if \(kind === IGNORE\) return null;/.test(wpSrc),
  };
  // The line is desktop/checkjs-baseline.txt itself (scripts/checkjs-baseline.mjs fails the run above it), so
  // this row writes no number of its own: it checks the file holds one whole number and CONTRIBUTING quotes it.
  const contributingDoc = readFileSync(join(ROOT, "docs", "CONTRIBUTING.md"), "utf8");
  checkjs.docCount = (contributingDoc.match(/`desktop\/checkjs-baseline\.txt` \((\d+) at last count/) || [])[1] || "";
  if (!/^\d+$/.test(baselineJs)) bad.push(`desktop/checkjs-baseline.txt should hold one whole number, not "${baselineJs}"`);
  else if (checkjs.docCount !== baselineJs) bad.push(`CONTRIBUTING says ${checkjs.docCount || "no"} checkJs errors at last count; desktop/checkjs-baseline.txt holds ${baselineJs}`);
  if (!checkjs.wired) bad.push("checkjs is not in test-all.ps1 and test-all.sh");
  if (checkjs.apiDuplicates) bad.push(`window-play api has ${checkjs.apiDuplicates} duplicate key(s)`);
  if (repeats.length) bad.push(`a thank-you repeats itself: ${repeats.slice(0, 5).join(", ")}`);

  // Unlock privacy words: kid-plain on the overlay Settings and the blotter dialog, still honest.
  const settings = readFileSync(join(RENDERER, "settings.html"), "utf8");
  const dialogSrc = readFileSync(join(ROOT, "client", "computerpets_client", "unlock_dialog.py"), "utf8");
  const firstMark = (settings.match(/<p id="licenseMark">([^<]*)<\/p>/) || [])[1] || "";
  const storedMark = (settings.match(/const storedMarkText = "([^"]*)";/) || [])[1] || "";
  const OLD_MARK = /\bhash|raw id|device fingerprint|operating-system|the host\b|\bleaves\b/i;
  const unlock = {
    first: /did not look at this computer's ID/.test(firstMark) && /The ID itself is never sent\./.test(firstMark) && /like a fingerprint for this computer/.test(firstMark) && /MachineGuid/.test(firstMark),
    stored: /^A code is already saved in hwid\.txt\./.test(storedMark) && /The ID itself is never sent\./.test(storedMark),
    plain: !OLD_MARK.test(firstMark) && !OLD_MARK.test(storedMark),
    dialog: dialogSrc.includes('"A code is already saved in hwid.txt."') && dialogSrc.includes('"The ID itself is never sent."') && !/raw id is not sent|device fingerprint|A license hash is already stored/.test(dialogSrc),
    pin: /A code is already saved in hwid\\\.txt/.test(readFileSync(join(here, "harness_windows.cjs"), "utf8")),
  };
  const unplain = Object.entries(unlock).filter(([, v]) => !v).map(([k]) => k);
  if (unplain.length) bad.push(`unlock privacy words: ${unplain.join(", ")}`);

  // The license gate's own error lines (they reach Settings as-is) use the same plain words.
  const Net = require(join(ROOT, "desktop", "license", "license-net.cjs"));
  const gateMessages = [];
  for (const run of [
    () => Net.postLicenseHash("", "https://license.example.test", () => ({})),
    () => Net.postUnboundDownload("", "https://license.example.test", () => ({})),
    () => Net.getSignedBundle("", "https://cdn.example.test/p.zip?sig=x", () => ({}), true),
  ]) {
    try {
      await run();
      gateMessages.push("(sent)");
    } catch (err) {
      gateMessages.push(String(err && err.message));
    }
  }
  const pySrc = readFileSync(join(ROOT, "client", "computerpets_client", "license", "license_net.py"), "utf8");
  const OLD_GATE = /license hash|signed bundle|name that host|before it leaves/i;
  const gates = {
    messages: gateMessages,
    plain: gateMessages.length === 3 && gateMessages.every((m) => /^(Nothing was sent to|Your pet's files were not downloaded from) \S+\. This page has to name the (license|download) website first\.$/.test(m)),
    py: !/name that host before it leaves|the license hash was not sent/.test(pySrc) && pySrc.includes("This page has to name the license website first."),
    hosts: gateMessages[0].includes("license.example.test") && gateMessages[2].includes("cdn.example.test") && !gateMessages[2].includes("sig="),
  };
  if (!gates.plain || !gates.py || !gates.hosts || gateMessages.some((m) => OLD_GATE.test(m))) bad.push(`license gate messages: ${JSON.stringify(gateMessages)}`);
  const roadmap = readFileSync(join(ROOT, "docs", "ROADMAP.md"), "utf8");
  const updated = (roadmap.match(/Last Updated[^0-9]*(\d{4}-\d{2}-\d{2})/) || [])[1] || "";
  if (updated < "2026-09-27") bad.push(`ROADMAP Last Updated is ${updated}`);
  if (bad.length) return fail(bad.join("; "), { guardRun, wired, checkjs, unlock, gates });
  return ok("the overlay loop schedules first and survives a throwing trick; desktop checkJs is held to its baseline and its bugs stay fixed; unlock privacy and license gate lines are kid-plain", { guardRun, wired, checkjs, unlock, gates, updated }, [
    "loop=schedule_first+guarded",
    "fault=injected_trick_throws",
    "log=once_per_error+pet_key",
    "reset=safe_idle",
    "checkjs=baseline_held+wired",
    "bugs=thank_you_repeat+api_dup_keys+dead_compares",
    "unlock=plain_words+honest",
    "gate=plain_license_messages",
  ]);
}

async function deskGuardPlain() {
  const bad = [];
  const lib = (rel) => import(pathToFileURL(join(WEB, "src", "lib", ...rel.split("/"))).href);
  const FG = await lib("pets/frame-guard.ts");
  const Cat = await lib("pets/cat-tricks.ts");
  const Overlay = require(join(RENDERER, "frame-guard.js"));
  // The web desk's loop shape with a real trick module whose step throws.
  const Broken = { ...Cat, stepTrick() { throw new Error("injected trick fault"); } };
  const queue = [];
  const logs = [];
  const pet = { x: 300, facing: 1, anim: "idle", hop: 0, land: 0, trick: null, trickWait: 0, happy: null, play: null, act: null, actMotion: null, pendingPose: null, poseHold: 0 };
  const guard = FG.makeGuard({ log: (t) => logs.push(t), reset: () => FG.safeIdle(pet) });
  let frames = 0;
  let begun = 0;
  let resets = 0;
  let last = 0;
  const frame = (now) => {
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    frames += 1;
    if (pet.trick) {
      pet.trick = Broken.stepTrick(pet.trick, dt, { cmd: "wander" });
    } else {
      pet.trickWait -= dt;
      if (pet.trickWait <= 0) {
        pet.trick = Broken.beginTrick(Broken.TRICKS[0], pet.x, pet.facing);
        pet.anim = pet.trick.anim;
        begun += 1;
        pet.trickWait = Broken.nextTrickWait(false);
      }
    }
  };
  const tick = FG.guardedLoop(frame, (fn) => queue.push(fn), guard, () => Cat.TRICK_KEY);
  queue.push(tick);
  let now = 0;
  for (let i = 0; i < 1200 && queue.length; i += 1) {
    const had = !!pet.trick;
    now += 1000 / 60;
    queue.shift()(now);
    if (had && !pet.trick && pet.anim === "idle") resets += 1;
  }
  const guardRun = { frames, pending: queue.length, caught: guard.caught(), logs: logs.length, begun, resets, idle: pet.anim === "idle" && pet.trick === null, log: logs[0] || "" };
  if (frames !== 1200 || queue.length !== 1) bad.push(`web desk loop stopped: ${frames} frames, ${queue.length} queued`);
  if (guard.caught() < 2 || begun < 2 || resets !== guard.caught()) bad.push(`broken trick was not reset each time ${JSON.stringify(guardRun)}`);
  if (logs.length !== 1 || !/^desk frame error \(cat\): Error: injected trick fault\./.test(logs[0])) bad.push(`log was not once with the pet key: ${JSON.stringify(logs)}`);
  // Shared rules: the web guard and the overlay guard reset a pet the same way.
  const sim = { ...pet, trick: { kind: "loaf" }, happy: {}, play: {}, act: "sniff", actMotion: {}, pendingPose: "sit", poseHold: 2, anim: "loaf", hop: 3, land: 1, trickWait: 2, thankYou: true, cmd: "talk" };
  const parity = {
    safeIdle: JSON.stringify(FG.safeIdle({ ...sim })) === JSON.stringify(Overlay.safeIdle({ ...sim })),
    backoff: FG.TRICK_BACKOFF === Overlay.TRICK_BACKOFF,
    limit: FG.LOG_LIMIT === Overlay.LOG_LIMIT,
    errorText: FG.errorText(new TypeError("x")) === Overlay.errorText(new TypeError("x")),
  };
  if (!Object.values(parity).every(Boolean)) bad.push(`web and overlay frame guards differ: ${JSON.stringify(parity)}`);
  // The desk runs its frame through that guard, and the trick calls are typed (no `as never`).
  const livingPet = readFileSync(join(WEB, "src", "components", "desk", "living-pet.tsx"), "utf8");
  const body = livingPet.slice(livingPet.indexOf("const frame = (now: number) => {"), livingPet.indexOf("const tick = guardedLoop("));
  const wired = {
    loop: /const tick = guardedLoop\(\s*frame,/.test(livingPet),
    reset: /safeIdle\(s\);/.test(livingPet),
    noTailRaf: body.length > 5000 && !/requestAnimationFrame|catch \{/.test(body),
    noAsNever: !/as never/.test(livingPet),
    typedSteps: /stepGroundTrick\(GT, s\.trick,/.test(livingPet) && /stepGroundHappy\(GT, s\.happy,/.test(livingPet) && /nextGroundTrickWait\(GT, true, undefined, s\.lastTrick\)/.test(livingPet),
  };
  const unwired = Object.entries(wired).filter(([, v]) => !v).map(([k]) => k);
  if (unwired.length) bad.push(`web desk loop guard not wired: ${unwired.join(", ")}`);
  // Desktop checkJs: held to desktop/checkjs-baseline.txt (the file test-all checks against), with Electron's own
  // types checked when installed. The number is read from the file, never written here.
  const baselineJs = readFileSync(join(ROOT, "desktop", "checkjs-baseline.txt"), "utf8").trim();
  const contributingJs = readFileSync(join(ROOT, "docs", "CONTRIBUTING.md"), "utf8");
  const petJs = readFileSync(join(RENDERER, "pet.js"), "utf8");
  const script = readFileSync(join(ROOT, "scripts", "checkjs-baseline.mjs"), "utf8");
  const electronCfg = readFileSync(join(ROOT, "desktop", "tsconfig.checkjs-electron.json"), "utf8");
  const checkjs = {
    baseline: baselineJs,
    noFunctionState: !/playSound\.ctx|startVisit\.timer/.test(petJs) && /let soundCtx = null;/.test(petJs) && /let visitTimer = 0;/.test(petJs),
    typedLookups: /function htmlAll\(root, sel\)/.test(petJs) && /function htmlOne\(root, sel\)/.test(petJs) && /\(\/\*\* @type \{PointerEvent\} \*\/ e\)/.test(petJs),
    electron: /"extends": "\.\/tsconfig\.checkjs\.json"/.test(electronCfg) && /node_modules\/electron\/electron\.d\.ts/.test(electronCfg) && script.includes("tsconfig.checkjs-electron.json"),
    docCount: (contributingJs.match(/`desktop\/checkjs-baseline\.txt` \((\d+) at last count/) || [])[1] || "",
  };
  if (!/^\d+$/.test(baselineJs)) bad.push(`desktop/checkjs-baseline.txt should hold one whole number, not "${baselineJs}"`);
  else if (checkjs.docCount !== baselineJs) bad.push(`CONTRIBUTING says ${checkjs.docCount || "no"} checkJs errors at last count; desktop/checkjs-baseline.txt holds ${baselineJs}`);
  if (!checkjs.noFunctionState || !checkjs.typedLookups || !checkjs.electron) bad.push(`checkjs cleanup: ${JSON.stringify(checkjs)}`);
  // Plain words.
  const settings = readFileSync(join(RENDERER, "settings.html"), "utf8");
  const dialog = readFileSync(join(ROOT, "client", "computerpets_client", "unlock_dialog.py"), "utf8");
  const plainErrJs = readFileSync(join(ROOT, "desktop", "license", "plain-error.cjs"), "utf8");
  const plainErrPy = readFileSync(join(ROOT, "client", "computerpets_client", "license", "plain_error.py"), "utf8");
  const admin = readFileSync(join(WEB, "src", "routes", "admin.tsx"), "utf8");
  const adminApi = readFileSync(join(WEB, "src", "lib", "admin", "api.ts"), "utf8");
  const fallbackBlock = adminApi.slice(adminApi.indexOf("export const ADMIN_FALLBACK = {"), adminApi.indexOf("} as const;", adminApi.indexOf("export const ADMIN_FALLBACK = {")));
  const adminFallbacks = [...fallbackBlock.matchAll(/^\s+(unlock|lookup|revoke): "([^"]+)",\r?$/gm)].map((m) => m[2]);
  const netFiles = [join(ROOT, "desktop", "license", "license-net.cjs"), join(RENDERER, "license-net.js"), join(ROOT, "client", "computerpets_client", "license", "license_net.py")].map((f) => readFileSync(f, "utf8"));
  const heads = ["desktop/renderer/news.js", "web/src/lib/pets/news.ts", "desktop/renderer/market.js", "web/src/lib/pets/market.ts"].map((f) => readFileSync(join(ROOT, ...f.split("/")), "utf8").split(/\r?\n/)[0]);
  const adrIndex = readFileSync(join(ROOT, "docs", "adr", "README.md"), "utf8");
  const adrTitle = (n) => (readdirSync(join(ROOT, "docs", "adr")).find((f) => f.startsWith(`${n}-`)) || "");
  const title = (n) => (readFileSync(join(ROOT, "docs", "adr", adrTitle(n)), "utf8").match(/^# \d{4}\. (.+)$/m) || [])[1] || "";
  const adr19 = readFileSync(join(ROOT, "docs", "adr", adrTitle("0019")), "utf8");
  const words = {
    settings: settings.includes("<label>House server address</label>") && settings.includes('"Asking the house server…"') && !/Talking to the backend|<label>Backend URL|house backend|under Backend URL/.test(settings),
    dialog: dialog.includes('form.addRow("House server address", self.backend)') && dialog.includes('"Asking the house server…"') && !/Talking to the backend|"Backend URL"|house backend|under Backend URL/.test(dialog),
    errors: !/Backend URL/.test(plainErrJs) && !/Backend URL/.test(plainErrPy) && plainErrJs.includes("Check the house server address.") && plainErrPy.includes("Check the house server address."),
    admin: !/showError\(err, "[^"]*failed\."\)/.test(admin) && adminFallbacks.length === 3 && adminFallbacks.every((s) => /^[A-Z][^.]+\. Try again in a moment\.$/.test(s) && !/failed/i.test(s)) && !/failure\(res, "[^"]*failed\."\)/.test(adminApi),
    fallbacks: netFiles.every((src) => !/HOST_NAME/.test(src) && /label: host \}|"label": host\}/.test(src) && !/"the (license|bundle) host"/.test(src)),
    docComments: heads.every((h) => !/rejects|late body|RSS read refuses|unread/.test(h) && h.includes("thrown away")) && !/CoinGecko/.test(heads[0] + heads[1]) && !/Google News|Wikipedia/.test(heads[2] + heads[3]),
    adr: ["0036", "0037"].every((n) => title(n) && adrIndex.includes(`| ${title(n)} |`) && !/network address|host|hash/.test(title(n))) && /\*\*Plain words \(2026-09-27\):\*\* "device fingerprint"/.test(adr19),
  };
  const unplain = Object.entries(words).filter(([, v]) => !v).map(([k]) => k);
  if (unplain.length) bad.push(`plain words: ${unplain.join(", ")}`);
  const roadmap = readFileSync(join(ROOT, "docs", "ROADMAP.md"), "utf8");
  const updated = (roadmap.match(/Last Updated[^0-9]*(\d{4}-\d{2}-\d{2})/) || [])[1] || "";
  if (updated < "2026-09-27") bad.push(`ROADMAP Last Updated is ${updated}`);
  if (bad.length) return fail(bad.join("; "), { guardRun, parity, wired, checkjs, words });
  return ok(`the web desk loop logs a throwing trick once and sends the pet back to idle; trick calls are typed; desktop checkJs is held to its baseline file (${baselineJs}); house-server, admin, license, and ADR words are plain`, { guardRun, parity, wired, checkjs, words, updated }, [
    "web_loop=schedule_first+guarded",
    "fault=injected_trick_throws",
    "log=once_per_error+pet_key",
    "reset=safe_idle",
    "share=overlay_frame_guard_rules",
    "types=no_as_never",
    "checkjs=baseline_file+electron_types",
    "words=house_server+admin+license_website+adr",
  ]);
}

async function guestLoopsMount() {
  const bad = [];
  const lib = (rel) => import(pathToFileURL(join(WEB, "src", "lib", ...rel.split("/"))).href);
  const FG = await lib("pets/frame-guard.ts");
  const Overlay = require(join(RENDERER, "frame-guard.js"));
  const DESK = join(WEB, "src", "components", "desk");
  const read = (...parts) => readFileSync(join(ROOT, ...parts), "utf8");

  // 1) Each guest loop shape, driven with a step that throws once: a guest that leaves stops its own loop,
  // plants and the carried lure keep stepping, and one error across visits is logged once.
  const drive = (leaves) => {
    const logs = [];
    const guard = FG.makeGuestGuard({ log: (t) => logs.push(t), outcome: "x" });
    let queue = [];
    let steps = 0;
    let resets = 0;
    for (let visit = 0; visit < 2; visit += 1) {
      let n = 0;
      const loop = FG.guardedLoop(() => {
        n += 1;
        steps += 1;
        if (n === 3) throw new Error("injected guest fault");
        return true;
      }, (fn) => queue.push(fn), guard, () => "guest");
      guard.onReset(() => {
        resets += 1;
        if (leaves) loop.stop();
      });
      queue.push(loop);
      for (let i = 0; i < 20 && queue.length; i += 1) {
        const due = queue;
        queue = [];
        for (const fn of due) fn(i * 16);
      }
      if (leaves && (n !== 3 || queue.length)) bad.push(`a guest that leaves kept its loop: ${n} steps, ${queue.length} queued`);
      if (!leaves && n !== 20) bad.push(`a guest that stays stopped after a throw: ${n} steps`);
      queue = [];
      guard.onReset(null);
    }
    return { steps, resets, logs: logs.length, caught: guard.caught() };
  };
  const shapes = { leaves: drive(true), stays: drive(false) };
  for (const [k, r] of Object.entries(shapes)) if (r.logs !== 1 || r.resets !== 2 || r.caught !== 2) bad.push(`${k}: ${JSON.stringify(r)}`);

  // 2) The five components run their loops through that guard, schedule first, and clean up.
  const guests = { "robin-fly.tsx": "() => ROBIN_KEY", "bird-fly.tsx": "() => FLY_BIRD_KEY", "called-guests.tsx": "() => ALL_CALLED", "desk-plants.tsx": '() => "plants"', "blotter.tsx": '() => "carried lure"' };
  const wired = {};
  for (const [file, key] of Object.entries(guests)) {
    const src = readFileSync(join(DESK, file), "utf8");
    wired[file] =
      src.includes(`const tick = guardedLoop(step, (next) => { raf = window.requestAnimationFrame(next); }, guard, ${key}, () => window.cancelAnimationFrame(raf));`) &&
      /const \[guard\] = useState\(\(\) => makeGuestGuard\(\{ outcome: "[^"]+" \}\)\);/.test(src) &&
      /guard\.onReset\(/.test(src) &&
      /tick\.stop\(\);\s*guard\.onReset\(null\);\s*window\.cancelAnimationFrame\(raf\);/.test(src) &&
      !/raf = window\.requestAnimationFrame\(tick\);\s*\};/.test(src);
  }
  const unwired = Object.entries(wired).filter(([, v]) => !v).map(([k]) => k);
  if (unwired.length) bad.push(`guest loops not guarded: ${unwired.join(", ")}`);

  // 3) The real components mounted with React in a small DOM, a step made to throw in each (web/scripts/desk-mount.test.mjs).
  const { spawnSync } = require("node:child_process");
  const run = spawnSync(process.execPath, ["--experimental-strip-types", "--no-warnings", "--test", "--test-reporter=tap", join("scripts", "desk-mount.test.mjs")], { cwd: WEB, encoding: "utf8", timeout: 40000 });
  const tap = `${run.stdout || ""}`;
  const count = (label) => Number((tap.match(new RegExp(`^# ${label} (\\d+)$`, "m")) || [])[1] || -1);
  const mount = { status: run.status, pass: count("pass"), fail: count("fail"), tests: [...tap.matchAll(/^ok \d+ - (.+)$/gm)].map((m) => m[1].split(":")[0]) };
  if (run.status !== 0 || mount.pass !== 9 || mount.fail !== 0) bad.push(`mount tests: ${JSON.stringify({ ...mount, err: (run.stderr || "").slice(0, 200) })}`);

  // 4) Music waits out the backoff after a broken dance (web and overlay), and the thank-you call is typed.
  const music = [FG, Overlay].map((M) => {
    const p = M.safeIdle({ trick: null, happy: null, play: null, act: null, actMotion: null, pendingPose: null, poseHold: 0, anim: "play", hop: 0, land: 0, trickWait: 0 });
    let held = 0;
    while (!M.musicMayDance(p, 0.5) && held < 100) held += 1;
    return held;
  });
  if (music.some((h) => h !== 16)) bad.push(`music did not wait the backoff: ${music.join(",")}`);
  const living = readFileSync(join(DESK, "living-pet.tsx"), "utf8");
  const petJs = read("desktop", "renderer", "pet.js");
  const ground = readFileSync(join(WEB, "src", "lib", "pets", "ground-tricks.ts"), "utf8");
  const typed = {
    webMusic: /const musicWantsDance = musicMayDance\(s, dt\) && musicRef\.current/.test(living),
    overlayMusic: /const musicWantsDance = window\.PetFrameGuard\.musicMayDance\(sim, dt\) && musicOn\(\)/.test(petJs),
    thankYou: /const mod: ThankYouStarter = T;\s*return mod\.startThankYou\(key \?\? undefined, lastKind, x, facing, flags\) \?\? null;/.test(ground) && !/as never/.test(ground),
  };
  if (!Object.values(typed).every(Boolean)) bad.push(`music / typed calls: ${JSON.stringify(typed)}`);

  // 5) No dead stand-in host names in the three license files, and a miss names the real host.
  const Main = require(join(ROOT, "desktop", "license", "license-net.cjs"));
  const netSrc = [read("desktop", "license", "license-net.cjs"), read("desktop", "renderer", "license-net.js"), read("client", "computerpets_client", "license", "license_net.py")];
  let missLine = "";
  try {
    await Main.postLicenseHash("", "https://license.example.test/a", () => 1);
  } catch (err) {
    missLine = err.message;
  }
  const license = {
    noStandIn: netSrc.every((s) => !/HOST_NAME/.test(s)),
    miss: missLine === "Nothing was sent to license.example.test. This page has to name the license website first.",
    label: JSON.stringify(Main.bundleTarget("https://cdn.example.test/p.zip")) === JSON.stringify({ local: false, label: "cdn.example.test" }),
  };
  if (!Object.values(license).every(Boolean)) bad.push(`license fallbacks: ${JSON.stringify(license)}`);

  // 6) Plain words: READMEs, the admin unreachable line, ADR titles, CONTRIBUTING counts, and Settings Minds.
  const adrDir = join(ROOT, "docs", "adr");
  const adrFile = (n) => readdirSync(adrDir).find((f) => f.startsWith(`${n}-`)) || "";
  const adrTitle = (n) => (readFileSync(join(adrDir, adrFile(n)), "utf8").match(/^# \d{4}\. (.+?)\r?$/m) || [])[1] || "";
  const adrIndex = read("docs", "adr", "README.md");
  const contributing = read("docs", "CONTRIBUTING.md");
  const settings = read("desktop", "renderer", "settings.html");
  const words = {
    readmes: [read("client", "README.md"), read("desktop", "README.md")].every((s) => !/house backend|backend URL|backend host|Backend origin/i.test(s)),
    admin: /export const ADMIN_UNREACHABLE =\s*"Couldn't reach the license service\. Check that its address is right and that it is running, then try again\.";/.test(read("web", "src", "lib", "admin", "api.ts")) && !/API URL/.test(read("web", "src", "lib", "admin", "api.ts")),
    adr: ["0019", "0032", "0033", "0034", "0035"].every((n) => adrTitle(n) && adrIndex.includes(`[${n}](${adrFile(n)}) | ${adrTitle(n)} |`) && !/network address|\bhash\b|geocode|machine id/.test(adrTitle(n))),
    counts: contributing.includes(`\`web\` has ${Number(read("web", "tsc-baseline.txt").trim()).toLocaleString("en-US")} known TypeScript errors at last count`) && contributing.includes(`\`desktop/checkjs-baseline.txt\` (${read("desktop", "checkjs-baseline.txt").trim()} at last count`),
    minds: settings.includes('<p class="lead" id="mindsIntro">Pets talk without an AI. Adding one is optional.</p>') && settings.includes('<div id="mindFields">') && settings.includes(">Download my pet</button>") && !/>Signed download</.test(settings),
  };
  const unplain = Object.entries(words).filter(([, v]) => !v).map(([k]) => k);
  if (unplain.length) bad.push(`plain words: ${unplain.join(", ")}`);
  const roadmap = read("docs", "ROADMAP.md");
  const updated = (roadmap.match(/Last Updated[^0-9]*(\d{4}-\d{2}-\d{2})/) || [])[1] || "";
  if (updated < "2026-09-27") bad.push(`ROADMAP Last Updated is ${updated}`);
  if (bad.length) return fail(bad.join("; "), { shapes, wired, mount, music, typed, license, words });
  return ok("every web desk guest loop survives a throwing step; LivingPet and each guest mounted with React show the reset on screen; music waits after a broken dance; no dead license stand-ins; plain README, admin, ADR, and Settings words", { shapes, wired, mount, music, typed, license, words, updated }, [
    "guests=robin+bird+called+plants+lure",
    "loop=schedule_first+guest_guard",
    "log=once_per_error+key",
    "reset=leave_or_rest",
    "mount=living_pet+5_guests_react_dom",
    "music=backoff_after_broken_dance",
    "types=typed_thank_you",
    "license=no_dead_stand_in",
    "words=readme+admin+adr+minds",
  ]);
}

async function mindsFlightPlain() {
  const bad = [];
  const read = (...parts) => readFileSync(join(ROOT, ...parts), "utf8");
  const lib = (rel) => import(pathToFileURL(join(WEB, "src", "lib", ...rel.split("/"))).href);

  // 1) Minds words: the same plain sentences on the web desk, the overlay Settings window, and the blotter.
  const { MIND_WORDS } = await lib("ai/mind-words.ts");
  const settings = read("desktop", "renderer", "settings.html");
  const mindsPy = read("client", "computerpets_client", "minds.py");
  const page = read("web", "src", "routes", "mind.tsx");
  const pyConst = { intro: "MINDS_INTRO", house: "HOUSE_NOTE", address: "ADDRESS_LABEL", addressHelp: "ADDRESS_HELP", key: "KEY_LABEL", keyHelp: "KEY_HELP" };
  const pyWord = (name) => (mindsPy.match(new RegExp(`^${name} = "([^"]*)"\\r?$`, "m")) || [])[1];
  const same = Object.fromEntries(Object.entries(pyConst).map(([k, py]) => [k, pyWord(py) === MIND_WORDS[k] && settings.includes(MIND_WORDS[k])]));
  if (!Object.values(same).every(Boolean)) bad.push(`Minds words differ between web, overlay, and blotter: ${JSON.stringify(same)}`);
  const Mind = (() => {
    const window = { PetMindSecret: null, desk: null, location: { protocol: "file:" } };
    window.window = window;
    require("node:vm").runInNewContext(read("desktop", "renderer", "mind.js"), window, { filename: "mind.js" });
    return window.PetMind;
  })();
  const refusals = [
    ["xai", "api.x.ai/v1"],
    ["openai", "https://me:hunter2@api.openai.com/v1"],
    ["xai", "http://localhost:8080/v1"],
    ["openai", "http://api.openai.com/v1"],
    ["custom", "https://192.168.1.20/v1"],
  ].map(([id, raw]) => Mind.baseUrlProblem(raw, id));
  const P = await lib("plain-error.ts");
  const mindLines = Object.values(P.MIND_LINES);
  const minds = {
    same: Object.values(same).every(Boolean),
    webHidesForHouse: /\{selected\.kind === "local" \? \(/.test(page) && page.includes("{MIND_WORDS.house}") && page.includes('id="mind-intro"'),
    webLabels: page.includes("label={MIND_WORDS.address} hint={MIND_WORDS.addressHelp}") && page.includes("label={MIND_WORDS.key} hint={MIND_WORDS.keyHelp}") && !/label="(Base URL|API key)"/.test(page),
    overlayLabels: settings.includes('<label for="base">AI website address</label>') && settings.includes('<label for="key">Your key for that AI website</label>') && !/<label[^>]*>(Base URL|API key)<\/label>/.test(settings),
    refusals: refusals.every((r) => /^[A-Z].*\.$/.test(r) && !/Base URL|API key|plugin's/.test(r)) && refusals.some((r) => r.includes("AI website address")),
    mindLines: mindLines.every((l) => !/Base URL|API key|mind's service/.test(l)) && P.MIND_LINES.key.includes("your key"),
    blotter: read("client", "computerpets_client", "app.py").includes('print(f"ok: minds {MINDS_INTRO} House lines, no AI boxes")'),
  };
  if (!Object.values(minds).every(Boolean)) bad.push(`Minds words: ${JSON.stringify(minds)}`);

  // 2) "Download my pet" in the plain-error headers and the harness label; desk_guard_plain reads the checkJs file.
  const smokes = read("client", "computerpets_client", "harness_web_smokes.mjs");
  const deskGuard = smokes.slice(smokes.indexOf("async function deskGuardPlain()"), smokes.indexOf("async function guestLoopsMount()"));
  const words = {
    plainErrorJs: /^ \* Plain words for Unlock \/ Download my pet failures\./m.test(read("desktop", "license", "plain-error.cjs")),
    plainErrorPy: read("client", "computerpets_client", "license", "plain_error.py").startsWith('"""Plain words for Unlock / Download my pet failures.'),
    harnessLabel: read("client", "computerpets_client", "app_harness.py").includes('"Unlock / Download my pet offline:') && !/Signed download/.test(read("client", "computerpets_client", "app_harness.py")),
    deskGuardFile: deskGuard.includes('readFileSync(join(ROOT, "desktop", "checkjs-baseline.txt"), "utf8")') && !/Number\(baselineJs\) > \d/.test(deskGuard) && deskGuard.includes("checkjs.docCount !== baselineJs"),
  };
  if (!Object.values(words).every(Boolean)) bad.push(`download words / checkJs file: ${JSON.stringify(words)}`);

  // 3) The robin and the bird leave the page after a flight (normal end or the desk hiding mid-flight), with no loop left.
  const flyers = ["robin-fly.tsx", "bird-fly.tsx"].map((f) => read("web", "src", "components", "desk", f).replace(/\r\n/g, "\n"));
  const flightSrc = flyers.every((src) => /\n  if \(!on\) return null;\n/.test(src) && !/!on && !startId/.test(src));
  const { spawnSync } = require("node:child_process");
  const run = spawnSync(process.execPath, ["--experimental-strip-types", "--no-warnings", "--test", "--test-reporter=tap", "--test-name-pattern=normal flight|mid-flight", join("scripts", "desk-mount.test.mjs")], { cwd: WEB, encoding: "utf8", timeout: 40000 });
  const tap = `${run.stdout || ""}`;
  const count = (label) => Number((tap.match(new RegExp(`^# ${label} (\\d+)$`, "m")) || [])[1] || -1);
  const flight = { src: flightSrc, status: run.status, pass: count("pass"), fail: count("fail") };
  if (!flightSrc || run.status !== 0 || flight.pass !== 2 || flight.fail !== 0) bad.push(`flight end: ${JSON.stringify({ ...flight, err: (run.stderr || "").slice(0, 200) })}`);

  // 4) START-HERE opens with short kid-plain lines, desktop first, the honest download, and the browser after.
  const start = read("docs", "START-HERE.md").replace(/\r\n/g, "\n");
  const look = start.slice(start.indexOf("\n## What that looks like\n"), start.indexOf("\n### More detail, for later\n"));
  const bullets = look.split("\n").filter((l) => l.startsWith("- "));
  const wordsIn = (l) => l.replace(/\*\*/g, "").slice(2).split(/\s+/).filter(Boolean).length;
  const startHere = {
    bullets: bullets.length,
    longest: Math.max(...bullets.map(wordsIn)),
    desktopFirst: /real desktop/.test(bullets[0] || ""),
    honest: bullets.some((b) => /no store download yet/.test(b) && /GitHub/.test(b)),
    helpers: bullets.some((b) => /install two free helper programs once/.test(b)),
    browserAfter: /The browser comes later\. The desktop comes first\./.test(bullets[bullets.length - 1] || ""),
    detailKept: start.indexOf("\n### More detail, for later\n") > 0 && start.includes("Rui, Sip, Arc, Volt, Trace, Flux, Spark, Ion, Gauss, Relay, Fuse, Ground"),
    // Step 6 (the first minutes with a pet): Talk is one short line; the full list of cries is folded, not lost.
    talkShort: (() => {
      const talk = (start.match(/^- \*\*Talk\*\* [^\n]*$/m) || [""])[0];
      return talk.length > 0 && wordsIn(talk) <= 25;
    })(),
    // The folded list: Rui's line first, then small room headings, one pet per line, Rose last, 109 pets in all.
    talkListKept: (() => {
      const at = start.indexOf("<summary>Which sound each pet makes (for later)</summary>\n\n**Talk** from Rui plays his warm house cry (`red_panda.wav`).\nEvery other pet here plays its own cry the same way:\n\n");
      const fold = at < 0 ? "" : start.slice(at, start.indexOf("</details>", at));
      const lines = fold.split("\n").filter(Boolean).slice(3);
      const pets = lines.filter((l) => /^- [A-Z][a-z]+ prefers `[a-z_]+\.wav`$/.test(l));
      const heads = lines.filter((l) => /^\*\*[A-Z][A-Za-z -]+\*\*$/.test(l));
      return pets.length === 109 && heads.length >= 8 && pets.length + heads.length + 2 === lines.length
        && pets[pets.length - 1] === "- Rose prefers `haloarchaea.wav`"
        && lines.slice(-2).join("\n") === "Words still show in the bubble.\nSystem speech stays the backup for other guests.";
    })(),
  };
  if (startHere.bullets < 4 || startHere.bullets > 8 || startHere.longest > 20 || !startHere.desktopFirst || !startHere.honest || !startHere.helpers || !startHere.browserAfter || !startHere.detailKept || !startHere.talkShort || !startHere.talkListKept) bad.push(`START-HERE opening: ${JSON.stringify(startHere)}`);

  // 5) ARCHITECTURE: a plain-words paragraph comes before the dense now/later lists and the hard locks; detail kept.
  const arch = read("docs", "ARCHITECTURE.md").replace(/\r\n/g, "\n");
  const plainAt = arch.indexOf("### 11.4 Honest now vs later\n\n**In plain words:**");
  const architecture = {
    plainFirst: plainAt > 0 && plainAt < arch.indexOf("**Now (already in the house)**"),
    locks: /### 11\.5 Hard locks\n\nIn plain words: /.test(arch),
    detailKept: arch.includes("- DirectX 12 and Vulkan are not started.") && arch.includes("- Desktop presence is not filesystem theft."),
  };
  if (!Object.values(architecture).every(Boolean)) bad.push(`ARCHITECTURE plain words: ${JSON.stringify(architecture)}`);

  const roadmap = read("docs", "ROADMAP.md");
  const updated = (roadmap.match(/Last Updated[^0-9]*(\d{4}-\d{2}-\d{2})/) || [])[1] || "";
  if (updated < "2026-09-27") bad.push(`ROADMAP Last Updated is ${updated}`);
  if (bad.length) return fail(bad.join("; "), { same, minds, words, flight, startHere, architecture });
  return ok("Minds says 'AI website address' and 'Your key for that AI website' with a helper line on the web desk, the overlay, and the blotter; the blotter says pets talk without an AI; Download my pet everywhere; desk_guard_plain reads the checkJs file; the robin and the bird leave the page after a flight; START-HERE opens kid-plain; ARCHITECTURE has plain words first", { same, minds, words, flight, startHere, architecture, updated }, [
    "minds=same_words_web+overlay+blotter",
    "minds=plain_address_and_key+helper",
    "minds=house_lines_no_ai_boxes",
    "download=download_my_pet",
    "checkjs=baseline_file_in_desk_guard",
    "flight=canvas_off_page+no_loop",
    "start_here=kid_plain+desktop_first+honest",
    "architecture=plain_words_first",
  ]);
}

async function overlayBirdsPlain() {
  const bad = [];
  const read = (...parts) => readFileSync(join(ROOT, ...parts), "utf8").replace(/\r\n/g, "\n");
  const lib = (rel) => import(pathToFileURL(join(WEB, "src", "lib", ...rel.split("/"))).href);
  const { spawnSync } = require("node:child_process");

  // 1) The overlay robin and bird: the real pet.js functions fly, hide, and break on a fake element; none stays on the glass.
  const run = spawnSync(process.execPath, ["--test", "--test-reporter=tap", join(RENDERER, "overlay-birds.test.cjs")], { cwd: join(ROOT, "desktop"), encoding: "utf8", timeout: 40000 });
  const tap = `${run.stdout || ""}`;
  const count = (label) => Number((tap.match(new RegExp(`^# ${label} (\\d+)$`, "m")) || [])[1] || -1);
  const pet = read("desktop", "renderer", "pet.js");
  const resetAt = pet.indexOf("function resetAfterFrameError(petKey) {");
  const reset = pet.slice(resetAt, pet.indexOf("\n}", resetAt));
  const birds = {
    status: run.status,
    pass: count("pass"),
    fail: count("fail"),
    resetDrops: reset.includes('petKey === "robin") dropRobin()') && reset.includes('petKey === "bird") dropBird()') && reset.includes('petKey === "visit guest") endVisit()') && reset.includes("safeIdle(sim)"),
    oneWayOut: !/robinFly = null;\s*robinEl\.classList\.remove/.test(pet) && !/birdFly = null;\s*birdEl\.classList\.remove/.test(pet),
  };
  if (birds.status !== 0 || birds.pass !== 9 || birds.fail !== 0 || !birds.resetDrops || !birds.oneWayOut) bad.push(`overlay birds: ${JSON.stringify({ ...birds, err: (run.stderr || "").slice(0, 200) })}`);

  // 2) + 4) Which AI, the model box, and the key box: the same plain words on the web, the overlay, and the Python client.
  const { MIND_WORDS, presetTag } = await lib("ai/mind-words.ts");
  const settings = read("desktop", "renderer", "settings.html");
  const mindsPy = read("client", "computerpets_client", "minds.py");
  const page = read("web", "src", "routes", "mind.tsx");
  const pyWord = (name) => (mindsPy.match(new RegExp(`^${name} = "([^"]*)"$`, "m")) || [])[1];
  const pyConst = { which: "WHICH_LABEL", model: "MODEL_LABEL", modelHelp: "MODEL_HELP", keyPlaceholder: "KEY_PLACEHOLDER" };
  const same = Object.fromEntries(Object.entries(pyConst).map(([k, py]) => [k, !!MIND_WORDS[k] && pyWord(py) === MIND_WORDS[k] && settings.includes(MIND_WORDS[k])]));
  if (!Object.values(same).every(Boolean)) bad.push(`Which AI / model / key words differ: ${JSON.stringify(same)}`);
  const mindsHtml = settings.slice(settings.indexOf('<h1 id="mindsSection">'), settings.indexOf('<h2 id="unlockSection">'));
  const keyLines = [...settings.slice(settings.indexOf("function paintKey("), settings.indexOf("paintKey(s.keyKept);")).matchAll(/textContent = "([^"]*)"/g)].map((m) => m[1]);
  const overlay = {
    whichLabel: settings.includes(`<label for="plugin">${MIND_WORDS.which}</label>`) && !/<label[^>]*>Plugin<\/label>/.test(settings),
    modelLabel: settings.includes(`<label for="model">${MIND_WORDS.model}</label>`) && settings.includes(`<p class="hint" id="modelHelp">${MIND_WORDS.modelHelp}</p>`),
    keyPlaceholder: settings.includes(`placeholder="${MIND_WORDS.keyPlaceholder}"`),
    noJargon: !/plugin key|mind\.json|\bPlugin\b/.test(mindsHtml.replace(/<[^>]+>/g, " ")),
    keyLines: keyLines.length === 6 && keyLines.every((l) => !/plugin key|mind\.json|OS secret store/.test(l)),
    saveErr: /mindErr\.textContent = "Not saved\. The settings file could not be written/.test(settings),
    python: mindsPy.includes('{"id": "model", "label": MODEL_LABEL, "help": MODEL_HELP}'),
  };
  if (!Object.values(overlay).every(Boolean)) bad.push(`overlay Minds words: ${JSON.stringify(overlay)}`);

  // 3) The web /mind top is kid-plain; builder material sits in a closed For builders fold.
  const foldAt = page.indexOf('<details id="mind-builders"');
  const fold = foldAt > 0 ? page.slice(foldAt, page.indexOf("</details>", foldAt)) : "";
  const top = foldAt > 0 ? page.slice(page.indexOf("return ("), foldAt) : page;
  const builderWords = ["Plugin bus", "Any mind. Same house.", "Fourteen plugins", "OpenAI-compatible", "Write a plugin", "POST /mind", "envKey"];
  const { MIND_PRESETS } = await lib("ai/catalog.ts");
  const web = {
    fold: /<summary[^>]*>For builders<\/summary>/.test(fold) && !/\bopen\b/.test(page.slice(foldAt, page.indexOf(">", foldAt))),
    topPlain: builderWords.every((w) => !top.includes(w)),
    kept: builderWords.every((w) => fold.includes(w)),
    placeholder: page.includes("placeholder={MIND_WORDS.keyPlaceholder}") && !page.includes("on the server` : \"optional\""),
    modelBox: page.includes("label={MIND_WORDS.model} hint={MIND_WORDS.modelHelp}") && !/label="(Model|Model override)"/.test(page),
    which: page.includes("{MIND_WORDS.which}") && page.includes("<Field label={MIND_WORDS.which}>"),
    cards: MIND_PRESETS.length === 14 && MIND_PRESETS.every((p) => !/OpenAI-compatible|OpenAI shape|generateContent|POST|plugin|roster/.test(p.blurb)) && page.includes("{presetTag(preset)}") && presetTag({ id: "local", kind: "local" }) === "No AI",
  };
  if (!Object.values(web).every(Boolean)) bad.push(`web /mind: ${JSON.stringify(web)}`);

  // 5) START-HERE "More detail, for later" and the Step 6 tray block: short lines, every fact kept.
  const start = read("docs", "START-HERE.md");
  const detail = start.slice(start.indexOf("### More detail, for later"), start.indexOf("That walk is the Electron overlay"));
  const tray = start.slice(start.indexOf("The tray has a line named **On the desk**."), start.indexOf("Clicks on empty glass pass through. If you click"));
  const sentences = (blk) => blk.split("\n").map((l) => l.replace(/^\s*-\s*/, "").trim()).filter((l) => l && !l.startsWith("#") && !/^\*\*[^*]+\*\*$/.test(l)).flatMap((l) => l.split(/(?<=[.:])\s+(?=[A-Z(`*])/));
  const longest = Math.max(...sentences(detail).concat(sentences(tray)).map((s) => s.split(/\s+/).length));
  const facts = [
    "Hunger, Rest, Bond", "**Feed**, **Play**, **Rest**", "Rui, Sip, Arc, Volt, Trace, Flux, Spark, Ion, Gauss, Relay, Fuse, Ground",
    "Clicks on empty glass pass through to your windows.", "House server stopped answering (optional). Pets still work.",
    "House server not running (optional)", "Your pet's care stays on this computer.", "`/pet/feed`, `/pet/play`, and `/pet/rest` answer 409",
    "Listening · House lines", "It never prints a key.", "Type `99.9 seattle fm` or `KEXP` and Find actually returns stations.",
    "Mac and Linux window play is a later door.", "**Companions** still has all **221**.", "`/demo/crackle`", "The firefly already owns `/demo/spark`.",
  ];
  const startHere = { longest, missing: facts.filter((f) => !(detail + tray).includes(f)), trayBullets: (tray.match(/^- /gm) || []).length };
  if (longest > 18 || startHere.missing.length || startHere.trayBullets !== 5) bad.push(`START-HERE detail: ${JSON.stringify(startHere)}`);

  const roadmap = read("docs", "ROADMAP.md");
  const updated = (roadmap.match(/Last Updated[^0-9]*(\d{4}-\d{2}-\d{2})/) || [])[1] || "";
  const entry = roadmap.includes("- [x] The overlay robin and bird leave the glass when a frame breaks");
  if (updated < "2026-09-27" || !entry) bad.push(`ROADMAP: ${JSON.stringify({ updated, entry })}`);
  if (bad.length) return fail(bad.join("; "), { birds, same, overlay, web, startHere });
  return ok("the overlay robin and bird never stay on the glass (flight end, hide, broken frame); Which AI, AI model name, and the key placeholder read the same on the web, the overlay, and the Python client; /mind is kid-plain with builder words folded; START-HERE detail is short lines", { birds, same, overlay, web, startHere, updated }, [
    "overlay_birds=flight_end+hide+broken_frame_leave",
    "reset=drop_robin+drop_bird+end_visit",
    "minds=which_ai+model_name+key_placeholder_same",
    "overlay=no_plugin_key_or_mind_json_words",
    "mind_page=kid_top+for_builders_fold",
    "cards=plain_blurbs+tags",
    "start_here=detail_short_lines+facts_kept",
  ]);
}

/**
 * The desk-mount flake is gone, and the Minds / Unlock / START-HERE words read plainly.
 * The flake: a guest frame that returned false left one stale rAF queued, and the bird's random flight
 * length sometimes ended on the last frame of a 60-frame batch (about 1 run in 60). guardedLoop now
 * cancels that frame when the loop stops, and the mount tests seed Math.random.
 */
async function flakeHousePlain() {
  const bad = [];
  const read = (...parts) => readFileSync(join(ROOT, ...parts), "utf8").replace(/\r\n/g, "\n");
  const lib = (rel) => import(pathToFileURL(join(WEB, "src", "lib", ...rel.split("/"))).href);
  const { spawnSync } = require("node:child_process");

  // 1) desk-mount.test.mjs under several seeds: 9/9 every time, including the every-alignment test.
  const seeds = [1, 1813, 20260927];
  const runs = seeds.map((seed) => {
    const run = spawnSync(process.execPath, ["--experimental-strip-types", "--no-warnings", "--test", "--test-reporter=tap", join("scripts", "desk-mount.test.mjs")], { cwd: WEB, encoding: "utf8", timeout: 60000, env: { ...process.env, COMPUTERPETS_MOUNT_SEED: String(seed) } });
    const tap = `${run.stdout || ""}`;
    const count = (label) => Number((tap.match(new RegExp(`^# ${label} (\\d+)$`, "m")) || [])[1] || -1);
    return { seed, status: run.status, pass: count("pass"), fail: count("fail"), aligned: /^ok \d+ - RobinFlyer and BirdFlyer: on the very frame a flight ends/m.test(tap) };
  });
  if (!runs.every((r) => r.status === 0 && r.pass === 9 && r.fail === 0 && r.aligned)) bad.push(`desk-mount seeds: ${JSON.stringify(runs)}`);
  const guardTs = read("web", "src", "lib", "pets", "frame-guard.ts");
  const guardJs = read("desktop", "renderer", "frame-guard.js");
  const mountDom = read("web", "scripts", "mount-dom.mjs");
  const sites = ["robin-fly.tsx", "bird-fly.tsx", "called-guests.tsx", "desk-plants.tsx", "blotter.tsx"];
  const flake = {
    webHalt: /if \(frame\(now\) === false\) halt\(\);/.test(guardTs) && guardTs.includes("loop.stop = halt;") && guardTs.includes("cancel?.();"),
    overlayHalt: /if \(frame\(now\) === false\) halt\(\);/.test(guardJs) && guardJs.includes("loop.stop = halt;") && guardJs.includes('if (typeof cancel === "function") cancel();'),
    sites: sites.every((f) => read("web", "src", "components", "desk", f).includes("() => window.cancelAnimationFrame(raf)")),
    seeded: /export function seededRandom/.test(mountDom) && /COMPUTERPETS_MOUNT_SEED/.test(mountDom),
    noRetry: !/retry|retries|flaky/i.test(read("web", "scripts", "desk-mount.test.mjs")),
  };
  if (!Object.values(flake).every(Boolean)) bad.push(`flake fix: ${JSON.stringify(flake)}`);

  // 2) "Use for all pets" / "Same as all pets" word for word on the web, the overlay, and the Python client.
  const { MIND_WORDS } = await lib("ai/mind-words.ts");
  const settings = read("desktop", "renderer", "settings.html");
  const mindsPy = read("client", "computerpets_client", "minds.py");
  const page = read("web", "src", "routes", "mind.tsx");
  const pyWord = (name) => (mindsPy.match(new RegExp(`^${name} = "([^"]*)"$`, "m")) || [])[1];
  const allPets = {
    words: MIND_WORDS.allPets === "Use for all pets" && MIND_WORDS.sameAsAll === "Same as all pets",
    python: pyWord("ALL_PETS_LABEL") === MIND_WORDS.allPets && pyWord("SAME_AS_ALL_LABEL") === MIND_WORDS.sameAsAll,
    overlay: settings.includes(`<button id="save" type="button">${MIND_WORDS.allPets}</button>`),
    web: page.includes("{MIND_WORDS.allPets}</h2>") && page.includes("{MIND_WORDS.sameAsAll} ({selected.name})"),
    gone: ![settings, page, mindsPy, read("docs", "MIND.md")].some((s) => /house default/i.test(s)),
  };
  if (!Object.values(allPets).every(Boolean)) bad.push(`all pets words: ${JSON.stringify(allPets)}`);

  // 3) /mind AI cards: name, plain tag, plain blurb; model ids only inside For builders.
  const foldAt = page.indexOf('<details id="mind-builders"');
  const fold = page.slice(foldAt, page.indexOf("</details>", foldAt));
  const outside = page.slice(0, foldAt) + page.slice(page.indexOf("</details>", foldAt));
  const cardsAt = page.indexOf("MIND_PRESETS.map((preset)");
  const card = cardsAt > 0 ? page.slice(cardsAt, page.indexOf("</button>", cardsAt)) : "";
  const cardText = [...card.matchAll(/<p [^>]*>([^<]*)<\/p>/g)].map((m) => m[1]);
  const cards = {
    card: JSON.stringify(cardText) === JSON.stringify(["{presetTag(preset)}", "{preset.name}", "{preset.blurb}"]) && !card.includes("defaultModel") && !card.includes("font-mono"),
    fold: fold.includes('<ul id="mind-model-ids"') && fold.includes("{p.defaultModel}"),
    noModelCode: !/<code[^>]*>\{[a-z.]*defaultModel\}/.test(outside),
  };
  if (!Object.values(cards).every(Boolean)) bad.push(`mind cards: ${JSON.stringify(cards)}`);

  // 4) Unlock Details (overlay and blotter): one short sentence per line.
  const markLines = ((settings.match(/<p id="licenseMark">([^<]*)<\/p>/) || [])[1] || "").split("\n").map((l) => l.trim()).filter(Boolean);
  const dialogSrc = read("client", "computerpets_client", "unlock_dialog.py");
  const pyLines = (name) => { const at = dialogSrc.indexOf(`${name} = "\\n".join(`); return at < 0 ? [] : [...dialogSrc.slice(at, dialogSrc.indexOf("\n)\n", at)).matchAll(/^ {8}"(.*)",$/gm)].map((m) => m[1]); };
  const wordCount = (l) => l.split(/\s+/).filter(Boolean).length;
  const unlock = {
    overlayLines: markLines.length,
    overlayLongest: Math.max(...markLines.map(wordCount)),
    preLine: settings.includes("#licenseMark { white-space: pre-line; }"),
    storedPainted: settings.includes('storedMarkText.split(/(?<=\\.) (?=[A-Z])/).join("\\n")'),
    blotterLines: pyLines("MARK_UNREAD_TEXT").length,
    blotterLongest: Math.max(...pyLines("MARK_UNREAD_TEXT").concat(pyLines("MARK_STORED_TEXT")).map(wordCount)),
    facts: ["MachineGuid", "SHA-256", "hwid.txt", "The ID itself is never sent.", "like a fingerprint for this computer", "random ID instead if this computer has no name"].every((f) => markLines.join(" ").includes(f)),
  };
  if (unlock.overlayLines < 15 || unlock.overlayLongest > 18 || !unlock.preLine || !unlock.storedPainted || unlock.blotterLines < 15 || unlock.blotterLongest > 18 || !unlock.facts) bad.push(`unlock lines: ${JSON.stringify(unlock)}`);

  // 5) START-HERE: the folded cry list is one pet per line.
  const start = read("docs", "START-HERE.md");
  const sAt = start.indexOf("<summary>Which sound each pet makes (for later)</summary>");
  const soundFold = sAt > 0 ? start.slice(sAt, start.indexOf("</details>", sAt)) : "";
  const petLines = soundFold.split("\n").filter((l) => /^- [A-Z][a-z]+ prefers `[a-z_]+\.wav`$/.test(l));
  const sounds = {
    pets: petLines.length,
    rui: soundFold.includes("**Talk** from Rui plays his warm house cry (`red_panda.wav`)."),
    last: petLines[petLines.length - 1] === "- Rose prefers `haloarchaea.wav`",
    kept: soundFold.includes("Words still show in the bubble.") && soundFold.includes("System speech stays the backup for other guests."),
    wavs: (soundFold.match(/`[a-z_]+\.wav`/g) || []).length,
  };
  if (sounds.pets !== 109 || !sounds.rui || !sounds.last || !sounds.kept || sounds.wavs !== 110) bad.push(`START-HERE sounds: ${JSON.stringify(sounds)}`);

  // 6) docs/README.md Minds line: the plain /mind top first, builder detail after.
  const readmeLine = (read("docs", "README.md").match(/^\| \*\*\[Mind plugins\]\(MIND\.md\)\*\* \| ([^|]*) \|$/m) || [])[1] || "";
  const readme = { plainFirst: readmeLine.startsWith(`${MIND_WORDS.intro} `), builder: /OpenAI-compatible, Claude, Gemini, Ollama, custom webhook\.$/.test(readmeLine) };
  if (!Object.values(readme).every(Boolean)) bad.push(`README Minds line: ${JSON.stringify({ ...readme, readmeLine })}`);

  const roadmap = read("docs", "ROADMAP.md");
  const entry = roadmap.includes("- [x] The desk-mount flake is fixed at the root");
  if (!entry) bad.push("ROADMAP entry missing");
  const extras = { runs, flake, allPets, cards, unlock, sounds, readme };
  if (bad.length) return fail(bad.join("; "), extras);
  return ok("desk-mount passes 9/9 under every seed (a stopped guest loop cancels its queued frame); Use for all pets reads the same on the web, the overlay, and the Python client; AI cards show name, tag, and blurb only; Unlock Details and the START-HERE cry list are one line each; README Minds starts plain", extras, [
    `mount=seeds_${seeds.length}_all_9_of_9`,
    "loop=halt_cancels_queued_frame",
    "guests=5_pass_cancel",
    "minds=use_for_all_pets_same",
    "cards=name_tag_blurb+model_ids_folded",
    "unlock=short_lines_overlay+blotter",
    "start_here=one_pet_per_line",
    "readme=minds_plain_first",
  ]);
}

/**
 * Plain Unlock fields on the overlay and the blotter, "random ID" everywhere, the START-HERE cry list in
 * small room groups, and the Git LFS check a Mac or Linux keeper needs (a Git without LFS copies text
 * pointers for the overlay pictures, so every pet was invisible with no word why).
 */
async function unlockPlainLfs() {
  const bad = [];
  const read = (...parts) => readFileSync(join(ROOT, ...parts), "utf8").replace(/\r\n/g, "\n");
  const settings = read("desktop", "renderer", "settings.html");
  const dialogPy = read("client", "computerpets_client", "unlock_dialog.py");
  const pyWord = (name) => (dialogPy.match(new RegExp(`^${name} = "([^"]*)"$`, "m")) || [])[1];

  // 1) Unlock fields: a plain label and one true helper line each, word for word on both doors.
  const fieldIds = { provider: "PROVIDER", steamId: "STEAM_ID", appId: "APP_ID" };
  const fields = Object.fromEntries(Object.entries(fieldIds).map(([id, py]) => {
    const label = pyWord(`${py}_LABEL`);
    const help = pyWord(`${py}_HELP`);
    return [id, !!label && !!help && settings.includes(`<label for="${id}">${label}</label>`) && settings.includes(`<p class="hint" id="${id}Help">${help}</p>`) && help.split(/\s+/).length <= 20];
  }));
  const honest = {
    steamOnly: /^Only Steam works here for now\./.test(pyWord("PROVIDER_HELP") || "") && settings.includes('<select id="provider"><option value="steam">Steam</option></select>'),
    steamIdShape: /17 digits that start with 7656/.test(pyWord("STEAM_ID_HELP") || ""),
    noSteamPage: /ComputerPets has no Steam page yet\./.test(pyWord("APP_ID_HELP") || ""),
    oldLabelsGone: !/<label>(Provider|Steam ID|App ID)<\/label>/.test(settings) && !/form\.addRow\("(Provider|Steam ID|App ID)"/.test(dialogPy),
    petList: settings.includes("o.textContent = window.PetRoster.choiceText(row);") && read("desktop", "renderer", "roster-load.js").includes("return kind ? `${name} · ${kind}` : name;") && dialogPy.includes('return f"{name} · {kind}" if kind else name'),
    askTitle: pyWord("WEAK_ASK_TITLE") === "Could not read this computer's ID" && !/operating-system id/.test(dialogPy),
  };
  if (!Object.values(fields).every(Boolean) || !Object.values(honest).every(Boolean)) bad.push(`Unlock fields: ${JSON.stringify({ fields, honest })}`);

  // 2) "random ID" in every user-facing place and pin; no lowercase "random id" left outside the ROADMAP history.
  const idFiles = [
    ["desktop", "renderer", "settings.html"], ["client", "computerpets_client", "unlock_dialog.py"], ["client", "computerpets_client", "license", "hwid.py"],
    ["desktop", "license", "hwid.cjs"], ["desktop", "license", "hwid.test.cjs"], ["desktop", "license", "session.test.cjs"], ["client", "tests", "test_unlock.py"],
    ["desktop", "README.md"], ["client", "README.md"], ["docs", "CLIENT-CONTRACT.md"], ["docs", "adr", "0030-missing-os-id-waits-for-a-yes.md"],
  ];
  const lower = idFiles.filter((f) => /\brandom id\b/.test(read(...f))).map((f) => f.join("/"));
  const randomId = { lower, button: settings.includes(">Use the computer name, or a random ID if there is no name</button>"), python: pyWord("WEAK_FALLBACK_YES") === "Use the computer name, or a random ID if there is no name" };
  if (lower.length || !randomId.button || !randomId.python) bad.push(`random ID: ${JSON.stringify(randomId)}`);

  // 3) START-HERE: the folded cry list under small room headings, every pet and file kept, Rui's line first.
  const start = read("docs", "START-HERE.md");
  const sAt = start.indexOf("<summary>Which sound each pet makes (for later)</summary>");
  const fold = sAt > 0 ? start.slice(sAt, start.indexOf("</details>", sAt)) : "";
  const heads = [...fold.matchAll(/^\*\*([A-Z][A-Za-z -]+)\*\*$/gm)].map((m) => m[1]);
  const pets = [...fold.matchAll(/^- ([A-Z][a-z]+) prefers `([a-z_]+)\.wav`$/gm)].map((m) => [m[1], m[2]]);
  const sounds = {
    heads,
    pets: pets.length,
    unique: new Set(pets.map(([, k]) => k)).size,
    rui: fold.includes("**Talk** from Rui plays his warm house cry (`red_panda.wav`)."),
    first: pets[0] && pets[0].join(" ") === "Soot crow",
    last: pets.length > 0 && pets[pets.length - 1].join(" ") === "Rose haloarchaea",
    kept: fold.includes("Words still show in the bubble.") && fold.includes("System speech stays the backup for other guests."),
  };
  if (heads.length !== 10 || sounds.pets !== 109 || sounds.unique !== 109 || !sounds.rui || !sounds.first || !sounds.last || !sounds.kept) bad.push(`START-HERE sounds: ${JSON.stringify(sounds)}`);

  // 4) Git LFS: the overlay pictures are LFS files; both start scripts say so in plain words and stop early.
  const attrs = read(".gitattributes");
  const sh = read("desktop.sh");
  const ps1 = read("desktop.ps1");
  const lfsStop = (src) => {
    const printed = src.search(/pictures: \$seen/);
    const stop = src.search(/The pet pictures did not download\. They come through Git LFS/);
    const install = src.search(/& npm install|^\s*npm install \|\|/m);
    return printed > 0 && stop > printed && stop < install && /version https:\/\/git-lfs/.test(src) && /git lfs install and then git lfs pull/.test(src);
  };
  const mac = start.slice(start.indexOf("\n## Mac\n"), start.indexOf("\n## Linux\n"));
  const linux = start.slice(start.indexOf("\n## Linux\n"), start.indexOf("\n## Another way to visit them (browser)\n"));
  const lfs = {
    attrs: /^desktop\/renderer\/sprites\/\*\* filter=lfs/m.test(attrs),
    sh: lfsStop(sh),
    ps1: lfsStop(ps1),
    docs: [mac, linux].every((part) => /git lfs install/.test(part) && /git lfs pull/.test(part)) && /git lfs pull/.test(read("README.md")) && /lfs-pointers/.test(read("desktop", "README.md")),
    test: existsSync(join(RENDERER, "sprites-real.test.cjs")) && /version https:\/\/git-lfs/.test(read("desktop", "renderer", "sprites-real.test.cjs")),
    harness: /launch_pictures_state/.test(read("client", "computerpets_client", "app_harness.py")),
  };
  if (!Object.values(lfs).every(Boolean)) bad.push(`Git LFS check: ${JSON.stringify(lfs)}`);

  const roadmap = read("docs", "ROADMAP.md");
  const entry = roadmap.includes("- [x] Mac and Linux keepers are told when the pet pictures did not download");
  if (!entry) bad.push("ROADMAP entry missing");
  const extras = { fields, honest, randomId, sounds, lfs };
  if (bad.length) return fail(bad.join("; "), extras);
  return ok("Unlock fields have plain labels and one true helper each on the overlay and the blotter; random ID everywhere; the START-HERE cry list sits under room headings; both start scripts stop with plain Git LFS words when the pictures are pointers", extras, [
    "unlock_fields=plain_labels+helpers_same",
    "pet_list=name_and_kind",
    "random_id=capital_ID_everywhere",
    "start_here=cry_list_room_groups",
    "lfs=start_scripts_stop_on_pointers",
    "lfs=mac_linux_docs",
  ]);
}

/**
 * The picture check at app start (the overlay from `npm start`, the web dev server), YAML pinned to LF so
 * a Windows checkout passes the deploy checks, one kind name per pet across every catalog, and the
 * START-HERE size line a new keeper needs before a 4 GB copy.
 */
async function picturesStartNames() {
  const bad = [];
  const read = (...parts) => readFileSync(join(ROOT, ...parts), "utf8").replace(/\r\n/g, "\n");

  // 1) The overlay checks the pictures itself before it opens the glass; same picture, same steps.
  const P = require(join(RENDERER, "pictures.js"));
  const main = read("desktop", "main.cjs");
  const boot = main.slice(main.indexOf("function bootDesk()"));
  const at = boot.indexOf('Pictures.picturesSurvey(path.join(__dirname, "renderer"), fs, path.join)');
  const sh = read("desktop.sh");
  const ps1 = read("desktop.ps1");
  const shPicture = (sh.match(/^picture=(\S+)$/m) || [])[1];
  const realState = P.picturesState(RENDERER, require("node:fs"), join);
  const w = P.words("lfs-pointers");
  const overlay = {
    beforeWindow: at > 0 && boot.indexOf("createWindow();") > at,
    smallWindow: /dialog\s*\.showMessageBox\(\{[\s\S]*?message: w\.message,\s*detail: w\.detail,/.test(main),
    tray: P.trayRows(w).map((r) => r.label || r.type).join("|") === "Pet pictures did not download|How to fix…|Open git-lfs.com|separator|Quit",
    samePicture: shPicture === "renderer/" + P.PICTURE.join("/"),
    // Every pet's folder, not only the crow's: a pull that stopped partway left the crow real (see pictures.test.cjs).
    everyPet: /find "\$sprites" -type f -name '\*\.png' -size -1024c -exec grep -l '\^version https:\/\/git-lfs' \{\} \+/.test(sh) && /\$f\.Length -ge 1024/.test(ps1) && P.SMALL === 1024,
    sameSteps: sh.includes(P.STEPS) && ps1.includes(P.STEPS) && w.detail.includes(P.STEPS),
    secondStart: /if \(picturesGate\) \{\s*showPicturesMessage\(\);\s*return;\s*\}/.test(main),
  };
  if (!Object.values(overlay).every(Boolean)) bad.push(`overlay picture check: ${JSON.stringify(overlay)}`);

  // Web dev server: the site portraits are Git LFS too; the plugin warns with the same steps.
  const web = await import(pathToFileURL(join(ROOT, "web", "scripts", "pictures-check.mjs")).href);
  const said = [];
  const fakePointer = { readFileSync: () => Buffer.from("version https://git-lfs.github.com/spec/v1\n") };
  web.picturesCheckPlugin(join(ROOT, "web", "public"), fakePointer).configResolved({ logger: { warn: (l) => said.push(l) } });
  const vite = read("web", "vite.config.ts");
  const webCheck = {
    lfsPortraits: /^web\/public\/pets\/\*\* filter=lfs/m.test(read(".gitattributes")),
    wired: /plugins: \[\s*\/\/[^\n]*\n\s*picturesCheckPlugin\(\),/.test(vite),
    warns: said.length === 1 && said[0].includes(web.STEPS) && said[0].includes("run npm run dev again"),
    sameSteps: web.STEPS === P.STEPS,
    state: web.portraitsState(),
  };
  if (!webCheck.lfsPortraits || !webCheck.wired || !webCheck.warns || !webCheck.sameSteps) bad.push(`web picture check: ${JSON.stringify(webCheck)}`);

  // Python blotter: draws its own pets (frames.py), loads no picture files, so it has nothing to check.
  const frames = read("client", "computerpets_client", "frames.py");
  const python = { drawsOwn: frames.includes("The repo does not ship PNG sprite packs.") && frames.includes("QPainter") };
  if (!python.drawsOwn) bad.push("python blotter picture truth");

  // 2) YAML stays LF on a Windows checkout (the deploy checks grep line ends).
  const attrs = read(".gitattributes");
  const yaml = { yaml: /^\*\.yaml text eol=lf$/m.test(attrs), yml: /^\*\.yml text eol=lf$/m.test(attrs), sh: /^\*\.sh text eol=lf$/m.test(attrs) };
  if (!Object.values(yaml).every(Boolean)) bad.push(`YAML eol: ${JSON.stringify(yaml)}`);

  // 3) One kind name per pet: overlay roster, web roster, web catalog, Python, backend.
  const overlayRoster = new Map(JSON.parse(read("desktop", "renderer", "roster.json")).map((r) => [r.key, r.speciesLabel]));
  const webRoster = new Map(JSON.parse(read("web", "public", "companion-roster.json")).map((r) => [r.key, r.speciesLabel]));
  const catalog = new Map([...read("web", "src", "lib", "pets", "catalog.ts").matchAll(/\{ key: "([a-z0-9_]+)", displayName: "([^"]+)"/g)].map((m) => [m[1], m[2]]));
  const py = new Map([...read("client", "computerpets_client", "species.py").matchAll(/key="([a-z0-9_]+)",\s*\n\s*slug="[^"]*",\s*\n\s*name="[^"]*",\s*\n\s*label="([^"]+)"/g)].map((m) => [m[1], m[2]]));
  const java = new Map([...read("src", "main", "java", "com", "enterprisepet", "pet", "PetType.java").matchAll(/^\s+[A-Z0-9_]+\s*\("([a-z0-9_]+)",\s*"([^"]+)",\s*Rarity\./gm)].map((m) => [m[1], m[2]]));
  const drift = [...overlayRoster].filter(([k, n]) => [webRoster, catalog, py, java].some((m) => m.get(k) !== n)).map(([k]) => k);
  const names = { overlay: overlayRoster.size, web: webRoster.size, catalog: catalog.size, python: py.size, backend: java.size, drift, bees: ["mason_bee", "leafcutter", "honey_drone", "honey_queen"].map((k) => py.get(k)) };
  if (drift.length || [names.overlay, names.web, names.catalog, names.python, names.backend].some((n) => n !== 221)) bad.push(`kind names: ${JSON.stringify(names)}`);

  // 4) Audit: START-HERE says the copy is about 4 GB and needs about 8 GB free, before and when it fails.
  const start = read("docs", "START-HERE.md");
  const size = {
    need: start.includes("- About 8 GB of free space. The copy is big: about 4 GB comes down the internet the first time"),
    wait: start.includes("8. Wait until it finishes. The copy is about 4 GB, so this can take a while. Let it run."),
    failed: start.includes("- Check the computer has about 8 GB of free space. A full disk stops the copy partway."),
  };
  if (!Object.values(size).every(Boolean)) bad.push(`START-HERE size: ${JSON.stringify(size)}`);

  const roadmap = read("docs", "ROADMAP.md");
  if (!roadmap.includes("- [x] The overlay and the web dev server say so when the pet pictures did not download")) bad.push("ROADMAP entry missing");
  const extras = { overlay, web: webCheck, python, yaml, names, size, pictures: realState };
  if (bad.length) return fail(bad.join("; "), extras);
  return ok("The overlay started from npm start and the web dev server both say plainly when the pictures are Git LFS pointers; YAML stays LF; every kind name matches across all five catalogs; START-HERE gives the copy size", extras, [
    "pictures=overlay_checks_before_glass",
    "pictures=web_dev_server_warns",
    "pictures=python_draws_own",
    "eol=yaml_lf",
    "names=one_per_kind_221",
    "start_here=copy_size",
  ]);
}

async function portraitsTrayMinds() {
  const bad = [];
  const read = (...parts) => readFileSync(join(ROOT, ...parts), "utf8").replace(/\r\n/g, "\n");
  const importTs = (...parts) => import(pathToFileURL(join(ROOT, ...parts)).href);

  // 1) Web portraits: a portrait that cannot be drawn becomes a name-and-kind tile; the page shows one note.
  const S = await importTs("web", "src", "lib", "pets", "portrait-state.ts");
  const steps = (await importTs("web", "scripts", "pictures-check.mjs")).STEPS;
  S.resetPortraitState();
  let tells = 0;
  const off = S.subscribePortraits(() => tells++);
  for (const k of ["crow", "raven", "crow", "barn_owl"]) S.markPortraitFailed(k);
  const shownAfterBreaks = S.portraitNoteShown();
  S.dismissPortraitNote();
  S.markPortraitFailed("heron");
  const portraitState = { failed: S.failedPortraits().length, tells, shownAfterBreaks, shownAfterGotIt: S.portraitNoteShown() };
  off();
  S.resetPortraitState();
  const comp = read("web", "src", "components", "pet-portrait.tsx");
  const shell = read("web", "src", "components", "app-shell.tsx");
  const card = read("web", "src", "components", "pet-card.tsx");
  const meet = read("web", "src", "routes", "meet.tsx");
  const portraits = {
    oneNoteForMany: portraitState.failed === 4 && portraitState.tells === 2 && portraitState.shownAfterBreaks && !portraitState.shownAfterGotIt,
    sameSteps: S.PORTRAIT_STEPS === steps && S.PORTRAIT_NOTE.includes(steps),
    tile: comp.includes("data-portrait-fallback") && comp.includes("onError={fail}") && /naturalWidth === 0/.test(comp),
    noteOnce: (shell.match(/<PortraitNote \/>/g) || []).length === 1,
    cardNames: card.includes("name={pet.name}") && card.includes("kind={species?.displayName}"),
    meetTile: meet.includes("<PetPortrait") && !/<img[^>]*portraitSrc/.test(meet),
  };
  if (!Object.values(portraits).every(Boolean)) bad.push(`portraits: ${JSON.stringify({ portraits, portraitState })}`);

  // 2) Audit bug: the overlay sprite surface is a plain script; a default import stopped npm run dev from starting.
  const surfaceSrc = read("desktop", "renderer", "sprite-surface.js");
  const had = globalThis.PetSpriteSurface;
  delete globalThis.PetSpriteSurface;
  const ns = await import("data:text/javascript;base64," + Buffer.from(surfaceSrc).toString("base64"));
  const esm = { noDefault: !("default" in ns), setsGlobal: typeof globalThis.PetSpriteSurface?.paintHeld === "function" };
  if (had) globalThis.PetSpriteSurface = had;
  const desk = read("web", "src", "lib", "pets", "desk-sprite-surface.ts");
  const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(join(dir, d.name)) : /\.tsx?$/.test(d.name) ? [join(dir, d.name)] : []));
  const valueImports = walk(join(WEB, "src")).filter((f) => /^\s*import\s+(?!type\b)[^"';]+?\s+from\s+["'][^"']*desktop\/renderer\//m.test(readFileSync(f, "utf8")));
  const dev = { ...esm, sideEffect: /^import "\.\.\/\.\.\/\.\.\/\.\.\/desktop\/renderer\/sprite-surface\.js";$/m.test(desk), valueImports: valueImports.length };
  if (!dev.noDefault || !dev.setsGlobal || !dev.sideEffect || dev.valueImports) bad.push(`dev server surface: ${JSON.stringify(dev)}`);

  // 3) One pet line everywhere: tray, house window, card Call list, Unlock and the Python blotter say Name · Kind.
  const Roster = require(join(RENDERER, "roster-load.js"));
  const rows = JSON.parse(read("desktop", "renderer", "roster.json"));
  const wrong = rows.filter((r) => Roster.choiceText(r) !== `${r.name} · ${r.speciesLabel}`).map((r) => r.key);
  const main = read("desktop", "main.cjs");
  const settings = read("desktop", "renderer", "settings.html");
  const pet = read("desktop", "renderer", "pet.js");
  const py = read("client", "computerpets_client", "unlock_dialog.py");
  const tray = {
    rows: rows.length,
    wrong,
    trayUses: /label: Roster\.choiceText\(r\),/.test(main),
    houseWindow: settings.includes('<script src="roster-load.js"></script>') && settings.includes("o.textContent = window.PetRoster.choiceText(row);"),
    cardCall: pet.includes("opt.textContent = window.PetRoster.choiceText(row);"),
    python: py.includes('return f"{name} · {kind}" if kind else name'),
    nameOnly: Roster.choiceText({ key: "x", name: "Ada" }) === "Ada" && Roster.choiceText({ key: "x" }) === "x",
  };
  if (tray.rows !== 221 || wrong.length || !tray.trayUses || !tray.houseWindow || !tray.cardCall || !tray.python || !tray.nameOnly) bad.push(`pet lines: ${JSON.stringify(tray)}`);

  // 4) Audit: Test this mind says who answered in plain words, not the raw source.
  const T = await importTs("web", "src", "lib", "ai", "test-line.ts");
  const mindPage = read("web", "src", "routes", "mind.tsx");
  const guest = T.mindTestLine({ source: "local", text: "Hi." }, { name: "xAI Grok", local: false }, false);
  const minds = {
    guest,
    plainGuest: guest === "House lines answered: “Hi.” xAI Grok only answers for a signed-in keeper, so pets use house lines until you sign in.",
    wired: mindPage.includes("setTestLine(mindTestLine(res,") && !mindPage.includes("${res.source}: ${res.text}"),
  };
  if (!minds.plainGuest || !minds.wired) bad.push(`mind test line: ${JSON.stringify(minds)}`);

  // 5) START-HERE: the smaller copy, with sizes measured on Windows.
  const start = read("docs", "START-HERE.md");
  const depth = {
    command: /^git clone --depth 1 https:\/\/github\.com\/RicheyWorks\/computerpets$/m.test(start),
    sizes: start.includes("the plain copy downloaded about 3.6 GB and used about 6.5 GB of disk. With `--depth 1` it downloaded about 1.6 GB and used about 4.4 GB."),
    updates: start.includes("`git pull` in the `computerpets` folder still gets updates"),
  };
  if (!Object.values(depth).every(Boolean)) bad.push(`START-HERE smaller copy: ${JSON.stringify(depth)}`);

  const roadmap = read("docs", "ROADMAP.md");
  if (!roadmap.includes("- [x] Web portraits that did not download show a name tile and one Git LFS note")) bad.push("ROADMAP entry missing");
  const extras = { portraits, dev, tray: { ...tray, wrong: wrong.length }, minds, depth };
  if (bad.length) return fail(bad.join("; "), extras);
  return ok("Broken web portraits show a name tile and one Git LFS note; npm run dev starts again; every pet list says Name · Kind; Test this mind says who answered; START-HERE offers the smaller copy", extras, [
    "portraits=tile_and_one_note",
    "dev_server=surface_global",
    "pet_line=name_kind_221",
    "mind_test=plain_source",
    "start_here=depth_1",
  ]);
}

async function houseLinesTalk() {
  const bad = [];
  const read = (...parts) => readFileSync(join(ROOT, ...parts), "utf8").replace(/\r\n/g, "\n");
  const importTs = (...parts) => import(pathToFileURL(join(ROOT, ...parts)).href);
  const vm = await import("node:vm");
  const KEY = "computerpets.mind.v1";
  const memStore = (seed) => {
    const map = new Map(seed ? [[KEY, JSON.stringify(seed)]] : []);
    return { getItem: (k) => (map.has(k) ? map.get(k) : null), setItem: (k, v) => map.set(k, String(v)), removeItem: (k) => map.delete(k) };
  };

  // 1) House lines by default: web (guest or no pick), overlay fresh install, Python blotter.
  const S = await importTs("web", "src", "lib", "ai", "settings.ts");
  const hadWindow = globalThis.window;
  const install = (seed) => {
    globalThis.window = { localStorage: memStore(seed), sessionStorage: memStore(), addEventListener() {}, removeEventListener() {} };
    S.resetMindStoreForTests();
    return S.loadMindSettings();
  };
  const fresh = install();
  const oldStock = install({ default: { plugin: "xai", model: "grok-4.5" }, voice: "browser", pets: {} });
  const pickedAi = install({ default: { plugin: "anthropic", model: "claude-sonnet-4-5" }, voice: "browser", pets: {} });
  const flagged = install({ picked: true, default: { plugin: "xai", model: "grok-4.5" }, voice: "browser", pets: {} });
  S.resetMindStoreForTests();
  if (hadWindow === undefined) delete globalThis.window;
  else globalThis.window = hadWindow;
  const MindSecret = require(join(ROOT, "desktop", "mind-secret.cjs"));
  const overlayFresh = MindSecret.readMindRecord(null, null).mind;
  const win = { localStorage: memStore(), sessionStorage: memStore(), addEventListener() {}, location: { protocol: "file:" } };
  win.window = win;
  vm.runInContext(read("desktop", "renderer", "mind.js"), vm.createContext(win));
  const listenerPy = read("client", "computerpets_client", "listener.py");
  const web = {
    guest: S.effectiveDefault(fresh, false).plugin === "local" && fresh.picked === false,
    guestBinding: S.bindingFor(fresh, "red_panda").plugin === "local" && S.askedBinding(fresh, "red_panda") === null,
    signedInNoPick: S.effectiveDefault(fresh, true).plugin === "xai" && S.effectiveDefault(fresh, true, false).plugin === "local",
    oldStockIsNoPick: oldStock.picked === false && S.effectiveDefault(oldStock, false).plugin === "local",
    pickKept: [false, true].every((si) => S.effectiveDefault(pickedAi, si).plugin === "anthropic" && S.effectiveDefault(flagged, si).plugin === "xai"),
  };
  const everywhere = {
    ...web,
    overlay: overlayFresh.default.plugin === "local" && win.PetMind.binding("red_panda").plugin === "local",
    python: /if door == "blotter":\n\s+return _house\(\)/.test(listenerPy),
  };
  if (!Object.values(everywhere).every(Boolean)) bad.push(`house lines default: ${JSON.stringify(everywhere)}`);

  // 2) /mind shows the mind that will answer, in words; the desk asks for it.
  const page = read("web", "src", "routes", "mind.tsx");
  const room = read("web", "src", "components", "desk", "companion-room.tsx");
  const keeper = read("web", "src", "components", "desk", "keeper-card.tsx");
  const T = await importTs("web", "src", "lib", "ai", "test-line.ts");
  const mind = {
    shown: page.includes("const shown = effectiveDefault(draft, signedIn, houseDefaultKey);") && page.includes("const active = shown.plugin === preset.id;") && !page.includes("draft.default."),
    inUse: page.includes("aria-pressed={active}") && page.includes('{guestPickedAi ? "Picked" : "In use"}'),
    guestNote: page.includes("{guestNote(selected.name)}") && T.guestNote("OpenAI") === "OpenAI only answers for a signed-in keeper. Until you sign in, House lines answer.",
    desk: room.includes("const mind = useMindBinding(kind.key, signedIn);") && keeper.includes("const asked = useAskedBinding(guestKey);"),
  };
  if (!Object.values(mind).every(Boolean)) bad.push(`/mind shows who answers: ${JSON.stringify(mind)}`);

  // 3) Talk with no AI: the keeper's words show back; the answer holds 4 s + 0.3 s a word (12 s cap) on web and overlay; a click closes it.
  const B = await importTs("web", "src", "lib", "pets", "talk-bubble.ts");
  const samples = ["", "Hi.", "Say that again, closer to my ear tufts.", "word ".repeat(40)];
  const pet = read("desktop", "renderer", "pet.js");
  const html = read("desktop", "renderer", "index.html");
  const css = read("desktop", "renderer", "styles.css");
  const living = read("web", "src", "components", "desk", "living-pet.tsx");
  const talk = {
    holds: samples.map((t) => B.replyHoldMs(t)),
    same: samples.every((t) => win.PetMind.replyHoldMs(t) === B.replyHoldMs(t)),
    echo: B.heardLine("hello rui") === "You said: “hello rui”" && room.includes("{heardLine(heard)}") && room.includes("data-talk-echo"),
    guestWaits: (room.match(/onSong=\{guestSay\}/g) || []).length === 2 && !room.includes("onSong={say}") && room.includes("if (performance.now() < replyUntil.current) return;"),
    webClose: room.includes("onSpeechClose={closeSpeech}") && living.includes("data-speech-close") && living.includes("onClick={onSpeechClose}"),
    overlayHold: pet.includes("say(reply.text, replyHold(reply.text));") && pet.includes("say(fallback, replyHold(fallback));"),
    overlayClose: /bubble\.addEventListener\("click", \(\) => \{\n\s+speechUntil = 0;/.test(pet) && html.includes('<div id="bubble" data-hit title="Click to close">') && /#bubble\.open \{\n  opacity: 1;\n  pointer-events: auto;/.test(css),
  };
  if (JSON.stringify(talk.holds) !== JSON.stringify([4000, 4300, 6400, 12000]) || !talk.same || !talk.echo || !talk.guestWaits || !talk.webClose || !talk.overlayHold || !talk.overlayClose) bad.push(`talk: ${JSON.stringify(talk)}`);

  // 4) Python floor: 3.10 written everywhere, and an older Python is told so in one line at start.
  const init = read("client", "computerpets_client", "__init__.py");
  const py = {
    pyproject: read("client", "pyproject.toml").includes('requires-python = ">=3.10"'),
    guard: init.includes("MIN_PYTHON = (3, 10)") && init.includes("ComputerPets needs Python %d.%d or newer. This is Python %d.%d.%d. ") && init.includes("raise SystemExit(1)"),
    docs: ["docs/START-HERE.md", "docs/SETUP.md", "docs/CONTRIBUTING.md", "client/README.md", "docs/APP-HARNESS.md"].every((d) => !/Python 3\.11|3\.11 or newer|>=3\.11/.test(read(...d.split("/")))),
  };
  if (!Object.values(py).every(Boolean)) bad.push(`python floor: ${JSON.stringify(py)}`);

  const roadmap = read("docs", "ROADMAP.md");
  if (!roadmap.includes("- [x] House lines is the default mind for anyone not signed in")) bad.push("ROADMAP entry missing");
  const extras = { everywhere, mind, talk, py };
  if (bad.length) return fail(bad.join("; "), extras);
  return ok("House lines answer by default for guests and fresh installs on web, overlay and blotter; /mind marks the mind In use; talk shows your words and holds the answer long enough to read, click to close; Python 3.10 floor", extras, [
    "default=house_lines_web_overlay_blotter",
    "pick=kept",
    "mind_page=in_use",
    "talk=echo+hold+click_close",
    "python=3.10_floor+plain_stop",
  ]);
}

async function noRepeatSignedIn() {
  const bad = [];
  const read = (...parts) => readFileSync(join(ROOT, ...parts), "utf8").replace(/\r\n/g, "\n");
  const importTs = (...parts) => import(pathToFileURL(join(ROOT, ...parts)).href);

  // 1) One no-recent-repeat picker: web and overlay pick the same lines from the same seeded rolls; Python keeps the same numbers.
  const W = await importTs("web", "src", "lib", "pets", "line-picker.ts");
  const O = require(join(ROOT, "desktop", "renderer", "line-picker.js"));
  const ROLLS = [0.9, 0.1, 0.5, 0.7, 0.3, 0.99, 0, 0.45, 0.62, 0.2, 0.8, 0.05];
  const run = (make, pool, stepMs, n) => {
    let i = 0;
    let t = 0;
    const p = make({ random: () => ROLLS[i++ % ROLLS.length], now: () => t });
    const out = [];
    for (let k = 0; k < n; k += 1) {
      out.push(p.pick("rui", pool));
      t += stepMs;
    }
    return out;
  };
  const five = ["a", "b", "c", "d", "e"];
  const seq = {
    web5: run(W.createLinePicker, five, 4000, 12),
    overlay5: run(O.createLinePicker, five, 4000, 12),
    web2: run(W.createLinePicker, ["x", "y"], 1000, 6),
    overlay2: run(O.createLinePicker, ["x", "y"], 1000, 6),
  };
  const noCloseRepeat = (s) => s.every((line, k) => !s.slice(Math.max(0, k - 3), k).includes(line));
  let clock = 0;
  const offerer = W.createLinePicker({ random: () => 0, now: () => clock });
  const offers = [];
  for (const at of [100, 7600, 59_000, 60_200]) {
    clock = at;
    offers.push(offerer.offer("dee", "Dee-dee."));
  }
  const py = read("client", "computerpets_client", "line_picker.py");
  const picker = {
    sameWebOverlay: JSON.stringify(seq.web5) === JSON.stringify(seq.overlay5) && JSON.stringify(seq.web2) === JSON.stringify(seq.overlay2),
    noCloseRepeat: noCloseRepeat(seq.web5),
    smallPoolAnswers: seq.web2.every((l) => l === "x" || l === "y") && seq.web2.length === 6,
    numbers: W.RECENT_LINES === 3 && W.RECENT_WITHIN_MS === 60_000 && O.RECENT_LINES === 3 && O.RECENT_WITHIN_MS === 60_000 && py.includes("RECENT_LINES = 3") && py.includes("RECENT_WITHIN_MS = 60_000"),
    guestTellQuiet: JSON.stringify(offers) === JSON.stringify(["Dee-dee.", "", "", "Dee-dee."]),
  };
  if (!Object.values(picker).every(Boolean)) bad.push(`picker: ${JSON.stringify({ picker, seq, offers })}`);

  // 2) Every door picks through it; the words are not touched.
  const html = read("desktop", "renderer", "index.html");
  const wires = {
    webLiving: read("web", "src", "lib", "pets", "living.ts").includes("return linePicker.pick(speaker, lines);"),
    webRui: read("web", "src", "lib", "pets", "red-panda.ts").includes('return linePicker.pick("red_panda", lines);'),
    webGuests: read("web", "src", "components", "desk", "called-guests.tsx").includes("const line = linePicker.offer(next.key, tellLine(next));"),
    webRobin: read("web", "src", "components", "desk", "robin-fly.tsx").includes("const song = linePicker.offer(ROBIN_KEY, ROBIN_SONG);"),
    overlayLoads: html.indexOf('<script src="line-picker.js"></script>') > 0 && html.indexOf('<script src="line-picker.js"></script>') < html.indexOf('<script src="call-guests.js"></script>'),
    overlayPet: read("desktop", "renderer", "pet.js").includes('if (Lines && Lines.pick) return Lines.pick(kind?.key || "pet", list);'),
    overlayLife: read("desktop", "renderer", "life.js").includes('if (Lines && Lines.pick) return Lines.pick(key || "pet", list);'),
    python: read("client", "computerpets_client", "life.py").includes("return _lines.line_picker.pick(speaker, lines) if lines else \"\""),
    catLineKept: read("web", "src", "lib", "pets", "call-guests.ts").includes('export const CAT_RUI_LINE = "I sat. You were already here.";') && read("desktop", "renderer", "call-guests.js").includes('const CAT_RUI_LINE = "I sat. You were already here.";'),
  };
  if (!Object.values(wires).every(Boolean)) bad.push(`wires: ${JSON.stringify(wires)}`);

  // 3) Signed-in keeper: the house key gives xAI Grok by default, a pick is kept; the mounted /mind test uses doubles only.
  const S = await importTs("web", "src", "lib", "ai", "settings.ts");
  const none = { picked: false, default: { plugin: "local", model: "house-lines" }, voice: "browser", pets: {} };
  const openai = { picked: true, default: { plugin: "openai", model: "gpt-5" }, voice: "browser", pets: {} };
  const mountTest = read("web", "scripts", "signed-in-mind.test.mjs");
  const signedIn = {
    defaultWithKey: S.effectiveDefault(none, true, true).plugin === "xai",
    noKeyHouse: S.effectiveDefault(none, true, false).plugin === "local",
    pickKept: S.effectiveDefault(openai, true, true).plugin === "openai",
    guestHouse: S.effectiveDefault(none, false, true).plugin === "local",
    doublesOnly: mountTest.includes('"test-double-xai-key"') && mountTest.includes('"test-double-openai-key"') && !/xai-[A-Za-z0-9]{20,}|sk-[A-Za-z0-9]{20,}/.test(mountTest),
    realPage: mountTest.includes("Route.options.component") && mountTest.includes("converseWithPet"),
  };
  if (!Object.values(signedIn).every(Boolean)) bad.push(`signed in: ${JSON.stringify(signedIn)}`);

  // 4) The real-window bubble click check and the phone desk fix.
  const main = read("desktop", "main.cjs");
  const room = read("web", "src", "components", "desk", "companion-room.tsx");
  const plaque = read("web", "src", "components", "desk", "species-plaque.tsx");
  const more = {
    bubbleClick: main.includes('payload.results["gui.bubble_click"] = bubble;') && main.includes('wc.sendInputEvent({ type: "mouseDown", x, y, button: "left", clickCount: 1 });'),
    harnessTempPruned: main.includes("HarnessData.pruneStale(fs, path, os.tmpdir(), process.pid);"),
    phoneHintFirst: room.includes("{(hand || deskFold) && hintUp ? null : (") && room.includes("folded={hand || deskFold}"),
    plaqueFolds: plaque.includes("folded") && plaque.includes("About the "),
  };
  if (!Object.values(more).every(Boolean)) bad.push(`more: ${JSON.stringify(more)}`);

  const roadmap = read("docs", "ROADMAP.md");
  if (!roadmap.includes("- [x] No close repeats: one line picker for web, overlay and blotter")) bad.push("ROADMAP entry missing");
  const extras = { picker, seq, offers, wires, signedIn, more };
  if (bad.length) return fail(bad.join("; "), extras);
  return ok("One no-recent-repeat line picker on web, overlay and blotter (same seeded picks; a guest's line waits 60 s); signed-in keeper gets the house AI by default and keeps a pick; real bubble click check; phone desk hello first", extras, [
    "picker=same_web_overlay_python",
    "repeat=not_last_3_or_60s",
    "guest_tell=quiet_60s",
    "words=unchanged",
    "signed_in=house_key_default+pick_kept",
    "gui=bubble_click",
    "phone=hint_then_folded_plaque",
  ]);
}

async function phoneLayoutToldOnce() {
  const bad = [];
  const read = (...parts) => readFileSync(join(ROOT, ...parts), "utf8").replace(/\r\n/g, "\n");
  const importTs = (...parts) => import(pathToFileURL(join(ROOT, ...parts)).href);

  // 1) Phone desk: panels end above the care buttons, a short phone gets a one-line plaque, bubbles paint on top;
  //    the real-browser sweep covers widths 320 to 414, short and tall, and two landscape phones.
  const P = await importTs("web", "src", "lib", "pets", "phone-desk.ts");
  const room = read("web", "src", "components", "desk", "companion-room.tsx");
  const living = read("web", "src", "components", "desk", "living-pet.tsx");
  const plaque = read("web", "src", "components", "desk", "species-plaque.tsx");
  const sweep = read("web", "scripts", "phone-desk-layout.test.mjs");
  const sizes = [...sweep.matchAll(/\{ w: (\d+), h: (\d+),/g)].map((m) => [Number(m[1]), Number(m[2])]);
  const widths = [...new Set(sizes.filter(([w, h]) => h > w).map(([w]) => w))].sort((a, b) => a - b);
  const phone = {
    fit: JSON.stringify(P.phoneFit({ asideTop: 68, railTop: 68, careTop: 384 })) === JSON.stringify({ asideMax: 308, railMax: 308 }) && P.PHONE_FIT_GAP === 8,
    tight: P.plaqueNeedsLine(420, 308) === true && P.plaqueNeedsLine(308, 308) === false,
    wired: room.includes("style={hand && fit ? { maxHeight: fit.asideMax } : !hand && !pad && deskFit ? { maxHeight: deskFit.asideMax } : undefined}") && room.includes("style={hand && fit ? { maxHeight: fit.railMax } : !hand && !pad && deskFit ? { maxHeight: deskFit.railMax } : undefined}") && room.includes("line={hand && plaqueLine}"),
    railWidth: room.includes("z-20 w-[5.5rem] overflow-y-auto overscroll-contain text-right"),
    plaqueLine: plaque.includes('data-plaque="line"'),
    bubbleOnTop: living.includes("absolute bottom-[214px] left-0 z-30 w-[min(220px,70vw)]"),
    sweepWidths: JSON.stringify(widths) === JSON.stringify([320, 360, 375, 390, 414]),
    sweepShortTall: sizes.some(([w, h]) => h > w && h <= 640) && sizes.some(([w, h]) => h > w && h >= 844) && sizes.filter(([w, h]) => w > h).length >= 2,
    sweepChecks: ["aside\", \"rail", "plaque\", \"care", "covers the care buttons", "is under the", "Got it is covered"].every((s) => sweep.includes(s)),
  };
  if (!Object.values(phone).every(Boolean)) bad.push(`phone: ${JSON.stringify({ phone, widths })}`);

  // 2) A called guest tells once per visit on web and overlay (an approach no longer clears told); same steps both.
  const Call = await importTs("web", "src", "lib", "pets", "call-guests.ts");
  const Overlay = require(join(ROOT, "desktop", "renderer", "call-guests.js"));
  const HOST = { hostKey: "red_panda", hostX: 200, hostFacing: 1, hostLift: 0 };
  const visit = (M, key) => {
    const out = [];
    let g = M.beginCalled(key, 800, 0, 1);
    for (const [flags, n] of [[HOST, 16], [{ ...HOST, hidden: true }, 1], [HOST, 21]]) {
      for (let i = 0; i < n; i += 1) {
        g = M.stepCalled(g, 0.05, 800, flags);
        if (M.shouldTell(g)) {
          out.push(M.tellLine(g));
          g = M.markTold(g);
        }
      }
    }
    return out;
  };
  const told = {
    webDee: JSON.stringify(visit(Call, "chickadee")) === JSON.stringify([Call.DEE_RUI_LINE]),
    webCat: JSON.stringify(visit(Call, "cat")) === JSON.stringify([Call.CAT_RUI_LINE]),
    overlaySame: JSON.stringify(visit(Overlay, "chickadee")) === JSON.stringify(visit(Call, "chickadee")) && JSON.stringify(visit(Overlay, "cat")) === JSON.stringify(visit(Call, "cat")),
    noReset: !/told: false/.test(read("web", "src", "lib", "pets", "call-guests.ts")) && !/told: false/.test(read("desktop", "renderer", "call-guests.js")),
    pickerStays: read("web", "src", "components", "desk", "called-guests.tsx").includes("const line = linePicker.offer(next.key, tellLine(next));"),
  };
  if (!Object.values(told).every(Boolean)) bad.push(`told once: ${JSON.stringify(told)}`);

  // 3) GUI harness temp folder: removed at the end of a passing run (a detached helper after exit when Chromium
  //    still holds it), kept on failure and said so; 4) the click-through decision is checked in the real window.
  const H = require(join(ROOT, "desktop", "gui-harness-data.cjs"));
  const main = read("desktop", "main.cjs");
  const runner = read("desktop", "gui-harness.cjs");
  const harness = {
    words: H.finishWords({ dir: "D", removed: false, kept: true }) === "gui-harness: run failed, kept temp userData for debugging: D" && H.finishWords({ dir: "D", removed: true, kept: false }) === "gui-harness: removed its temp userData D",
    guard: H.AFTER_EXIT_CODE.includes("computerpets-gui-harness-") && H.removeAfterExit(() => { throw new Error("must not spawn"); }, "x", "/tmp/not-ours", 1) === false,
    quit: main.includes("const done = HarnessData.finishRun(fs, harnessData, guiHarnessOk);") && main.includes("HarnessData.removeAfterExit(require(\"child_process\").spawn, process.execPath, harnessData, process.pid)"),
    runner: runner.includes("HarnessData.finishRun(fs, payload.userData, !!payload.ok)"),
    clickThrough: main.includes('payload.results["gui.clickthrough_hits"] = through;') && main.includes("const takesClick = Desk.cursorHits({ x: bubble.cx, y: bubble.cy }, hitsOpen);"),
  };
  if (!Object.values(harness).every(Boolean)) bad.push(`harness: ${JSON.stringify(harness)}`);

  // 5) npm run dev leaves git status clean: the route tree is checked in the way the generator writes it.
  const tree = read("web", "src", "routeTree.gen.ts");
  const paths = [...tree.matchAll(/^import \{ Route as \w+ \} from '\.\/routes\/([^']+)'$/gm)].map((m) => m[1]);
  const flat = paths.slice(2).filter((p) => !p.includes(".") && !p.includes("/") && !p.includes("$"));
  const routeTree = paths[0] === "__root" && paths[1] === "index" && JSON.stringify(flat) === JSON.stringify([...flat].sort());
  if (!routeTree) bad.push("route tree not in the generator's order");

  const roadmap = read("docs", "ROADMAP.md");
  if (!roadmap.includes("- [x] Small phones: the hello, the species plaque, the room rail and the care buttons never overlap")) bad.push("ROADMAP entry missing");
  const extras = { phone, widths, sizes: sizes.length, told, harness, routeTree };
  if (bad.length) return fail(bad.join("; "), extras);
  return ok("Phone desk panels end above the care buttons (one-line plaque when short, bubbles on top; swept 320-414 wide, short, tall, landscape); a guest tells once per visit on web and overlay; GUI harness removes its temp folder (kept on failure); click-through decision checked; route tree in generator order", extras, [
    "phone=no_overlap_sweep",
    "plaque=folded_or_line",
    "bubble=on_top",
    "guest_tell=once_per_visit",
    "gui_temp=removed_or_kept_on_failure",
    "gui=clickthrough_hits",
    "dev=route_tree_clean",
  ]);
}

async function siteHeaderRail() {
  const bad = [];
  const read = (...parts) => readFileSync(join(ROOT, ...parts), "utf8").replace(/\r\n/g, "\n");
  const importTs = (...parts) => import(pathToFileURL(join(ROOT, ...parts)).href);
  const sweep = read("web", "scripts", "phone-desk-layout.test.mjs");

  // 1) The site header: every place in one Menu (a disclosure) that fits a 320 px phone and a laptop; nothing wraps.
  const shell = read("web", "src", "components", "app-shell.tsx");
  const headerSrc = shell.slice(shell.indexOf("<header"), shell.indexOf("</header>"));
  const menuSrc = shell.slice(shell.indexOf("export function SiteMenu"), shell.indexOf("export function AppShell"));
  const header = {
    noSideScroll: !headerSrc.includes("overflow-x-auto"),
    menu: headerSrc.includes("<SiteMenu items={nav} pathname={pathname} />"),
    disclosure: menuSrc.includes("aria-expanded={open}") && menuSrc.includes("aria-controls={panelId}") && menuSrc.includes('<nav aria-label="Site">') && !menuSrc.includes('role="menu"'),
    escape: menuSrc.includes('if (e.key !== "Escape") return;') && menuSrc.includes("buttonRef.current?.focus();"),
    outside: menuSrc.includes('document.addEventListener("pointerdown", onDown);'),
    signInOneLine: /whitespace-nowrap[^"]*"\n\s+>\n\s+Sign in/.test(headerSrc),
    places: [...shell.matchAll(/\{ to: "[^"]+", label: "[^"]+", inline: (?:true|false), hideOnDemo: (?:true|false) \}/g)].length === 27,
    sweep: ["headerProblems", "menuProblems", "Escape did not close the menu", "Escape did not give focus back to Menu", "a tap outside did not close the menu", "wraps onto", "is clipped by its"].every((s) => sweep.includes(s)),
  };
  if (!Object.values(header).every(Boolean)) bad.push(`header: ${JSON.stringify(header)}`);

  // 2) A landscape phone: the room fits the screen (no 520 px floor on a phone), the care buttons take the width.
  const room = read("web", "src", "components", "desk", "companion-room.tsx");
  const css = read("web", "src", "styles.css");
  const landscape = {
    noFloorOnPhone: room.includes('? "relative isolate h-dvh min-h-0 w-full overflow-hidden bg-elevated"') && room.includes(': "relative isolate h-dvh min-h-[520px] w-full overflow-hidden bg-elevated"'),
    wideCare: /\[data-phone-orient="sit"\] \.blotter-care-phone \{\n\s+max-width: min\(40rem, calc\(100vw - 2rem\)\);/.test(css),
    belowHeader: !room.includes("3.25rem"),
    sweep: sweep.includes("is off the screen") && sweep.includes("the desk page scrolls") && /\{ w: 667, h: 375,/.test(sweep) && /\{ w: 844, h: 390,/.test(sweep),
  };
  if (!Object.values(landscape).every(Boolean)) bad.push(`landscape: ${JSON.stringify(landscape)}`);

  // 3) The room rail rests on whole rows: rows snap to the top and the rail's height is whole rows.
  const P = await importTs("web", "src", "lib", "pets", "phone-desk.ts");
  const rail = {
    rows: P.railRows(308, 32) === 288 && P.railRows(20, 32) === 32 && P.railRows(100, undefined) === 100,
    fit: P.phoneFit({ asideTop: 68, railTop: 68, careTop: 384, railRow: 32 }).railMax === 288,
    measured: room.includes('railRow: rail.querySelector("li")?.getBoundingClientRect().height,'),
    snap: css.includes("scroll-snap-type: y mandatory;") && /\[data-phone-floor\] \[data-desk-rail\] li \{[^}]*scroll-snap-align: start;/.test(css),
    sweep: sweep.includes("cut in half") && sweep.includes("after a wheel"),
  };
  if (!Object.values(rail).every(Boolean)) bad.push(`rail: ${JSON.stringify(rail)}`);

  // 4) New-keeper audit: no hydration mismatch (the session reads as loading until hydration), no code-split
  //    warnings from npm run dev (route files export only Route), and the sign-in page has a tab title.
  const hook = read("web", "src", "lib", "auth", "use-current-user.ts");
  const routesDir = join(ROOT, "web", "src", "routes");
  const loud = readdirSync(routesDir).filter((f) => f.endsWith(".tsx") && /^export (?!const Route\b)/m.test(readFileSync(join(routesDir, f), "utf8")));
  const audit = {
    hydration: hook.includes("return useSyncExternalStore(noSubscribe, () => true, () => false);") && hook.includes("if (!hydrated) return { user: null, isPending: true };"),
    codeSplit: loud.length === 0,
    loginTitle: read("web", "src", "routes", "login.tsx").includes('title: "Sign in — ComputerPets"'),
    sweepPages: ["/meet", "/catalog", "/collection", "/login", "/hatch", "/log", "/pets/rui"].every((p) => sweep.includes(`"${p}"`)) && sweep.includes("the page threw"),
  };
  if (!Object.values(audit).every(Boolean)) bad.push(`audit: ${JSON.stringify({ audit, loud })}`);

  const roadmap = read("docs", "ROADMAP.md");
  if (!roadmap.includes("- [x] Site header on phones: one Menu holds every place")) bad.push("ROADMAP entry missing");
  const extras = { header, landscape, rail, audit, loud };
  if (bad.length) return fail(bad.join("; "), extras);
  return ok("Site header: one Menu (disclosure; Escape and a tap outside close it, focus back) fits 320 px to a laptop, nothing wraps; landscape phones fit the room so every care button is on screen; the rail snaps whole rows; no hydration mismatch, no code-split warnings, a titled sign-in page", extras, [
    "header=menu_fits_320_to_laptop",
    "menu=escape_outside_tab_close",
    "landscape=care_on_screen",
    "rail=snap_whole_rows",
    "ssr=no_hydration_mismatch",
    "dev=no_code_split_warnings",
    "login=titled",
  ]);
}

async function signinReturnQuiet() {
  const bad = [];
  const read = (...parts) => readFileSync(join(ROOT, ...parts), "utf8").replace(/\r\n/g, "\n");
  const importTs = (...parts) => import(pathToFileURL(join(ROOT, ...parts)).href);
  const sweep = read("web", "scripts", "phone-desk-layout.test.mjs");

  // 1) Sign-in returns to the gated page it came from; only same-site paths are followed.
  const R = await importTs("web", "src", "lib", "auth", "return-to.ts");
  const refused = ["https://evil.example", "//evil.example", "/\\evil.example", "javascript:alert(1)", "/\t/evil.example", "/%2F%2Fevil.example", "/%5Cevil.example", "/.//evil.example", "/a/..//evil.example", "/login", "/api/auth/sign-out", `/${"a".repeat(600)}`];
  const login = read("web", "src", "routes", "login.tsx");
  const gates = read("web", "src", "lib", "auth", "gates.tsx");
  const shell = read("web", "src", "components", "app-shell.tsx");
  const signin = {
    kept: R.safeReturnTo("/collection") === "/collection" && R.safeReturnTo("/pets/rui?x=1#a") === "/pets/rui?x=1#a",
    refused: refused.every((s) => R.safeReturnTo(s) === "/"),
    href: R.signInHref("/collection") === "/login?next=%2Fcollection" && R.signInHref("/") === "/login",
    gate: gates.includes("const [next] = useState(() => safeReturnTo(here));") && gates.includes("<Navigate to={SIGN_IN_PATH} search={{ next }} />"),
    login: login.includes("const returnTo = safeReturnTo(next);") && login.includes("callbackURL: returnTo, errorCallbackURL: signInHref(returnTo)"),
    header: shell.includes("const back = safeReturnTo(pathname);") && shell.includes("search={signInSearch}"),
    sweep: sweep.includes('["/collection", "/login?next=%2Fcollection"]') && sweep.includes("/login?next=%2Fmeet"),
  };
  if (!Object.values(signin).every(Boolean)) bad.push(`signin: ${JSON.stringify(signin)}`);

  // 2) The heartbeat probe asks nothing on its own until a house server has answered on this browser.
  const K = await importTs("web", "src", "lib", "pets", "keeper.ts");
  const timers = new Map();
  let reads = 0;
  const poll = K.createHeartbeatPoll({
    doc: null,
    url: "http://127.0.0.1:1/x",
    gate: () => false,
    setIntervalImpl: (fn, ms) => (timers.set(timers.size + 1, { fn, ms }), timers.size),
    clearIntervalImpl: (id) => timers.delete(id),
    fetchImpl: async () => {
      reads++;
      throw new TypeError("fetch failed");
    },
  });
  const off = poll.subscribe(() => {});
  await new Promise((r) => setImmediate(r));
  const quietReads = reads;
  const quietTimers = timers.size;
  const unchecked = K.heartbeatLine(poll.current(), poll.answered());
  await poll.check();
  off();
  const keeper = read("web", "src", "lib", "pets", "keeper.ts");
  const card = read("web", "src", "components", "desk", "keeper-card.tsx");
  const quiet = {
    noRequest: quietReads === 0 && quietTimers === 0,
    words: unchecked === "House server not checked (optional)",
    check: reads === 1,
    gated: /export const heartbeatPoll = createHeartbeatPoll\(\{\n\s+gate: \(\) => houseServerSeen\(\),\n\s+onAnswer: \(\) => rememberHouseServer\(\),\n\s+onMiss: \(\) => houseServerMissed\(\),\n\s+backoff: true,/.test(keeper),
    backoff: K.HEARTBEAT_BACKOFF_MAX_SKIPS === 31,
    button: card.includes("data-heartbeat-check") && card.includes("void heartbeatPoll.check();"),
    sweep: sweep.includes("the desk asked the house server nobody ran") && sweep.includes("the gate is shut for good"),
  };
  if (!Object.values(quiet).every(Boolean)) bad.push(`quiet: ${JSON.stringify(quiet)}`);

  // 3) Thumb-sized on phones: rail rows and the room's own links are 44 px; the rail still rests on whole rows.
  const css = read("web", "src", "styles.css");
  const room = read("web", "src", "components", "desk", "companion-room.tsx");
  const P = await importTs("web", "src", "lib", "pets", "phone-desk.ts");
  const taps = {
    rail: /\[data-phone-floor\] \[data-desk-rail\] \{\n\s+--rail-row: 2\.75rem;/.test(css),
    links: /\[data-phone-floor\] \[data-room-links\] a,\n\s+\[data-phone-floor\] \[data-talk-send\] \{[^}]*min-height: 2\.75rem;/.test(css),
    marked: room.includes("<div data-room-links ") && room.includes("data-talk-send"),
    wholeRows: P.railRows(308, 44) === 308 && P.railRows(300, 44) === 264,
    sweep: sweep.includes("export const TAP_MIN = 44;") && sweep.includes("tapProblems"),
  };
  if (!Object.values(taps).every(Boolean)) bad.push(`taps: ${JSON.stringify(taps)}`);

  // 4) The speech bubble never rises over the site header.
  const pet = read("web", "src", "components", "desk", "living-pet.tsx");
  const bubble = {
    room: P.bubbleRoom(101, 62) === 33 && P.bubbleLift(120, 33) === 33 && P.bubbleLift(18, 33) === 18 && P.bubbleRoom(101, null) === Infinity,
    wired: pet.includes("let lift = bubbleLift(drawY + 18, bubbleRoomRef.current);") && shell.includes("data-site-header"),
    sweep: sweep.includes("sits over the site header") && sweep.includes("rose over the site header"),
  };
  if (!Object.values(bubble).every(Boolean)) bad.push(`bubble: ${JSON.stringify(bubble)}`);

  // 5) Tab titles for the desk and a pet page.
  const T = await importTs("web", "src", "lib", "page-title.ts");
  const titles = {
    pet: T.petTitle("Rui", "Red Panda") === "Rui the Red Panda — ComputerPets" && T.pageTitle("The desk") === "The desk — ComputerPets",
    desk: read("web", "src", "routes", "index.tsx").includes('head: () => ({ meta: [{ title: pageTitle("The desk") }] }),') && read("web", "src", "components", "desk", "desk-stage.tsx").includes("useDocumentTitle(petTitle(name ?? kind.name, kind.speciesLabel));"),
    petPage: read("web", "src", "routes", "pets.$key.tsx").includes('head: () => ({ meta: [{ title: pageTitle("Your pet") }] }),'),
    sweep: sweep.includes("Rui the Red Panda — ComputerPets") && sweep.includes("Your pet — ComputerPets"),
  };
  if (!Object.values(titles).every(Boolean)) bad.push(`titles: ${JSON.stringify(titles)}`);

  // 6) Signed-in rooms in the phone sweep, with a stand-in session (auth off, in-memory PGLite; no account).
  const signedIn = {
    standIn: sweep.includes('VITE_AUTH_ENABLED: "false", DATABASE_URL: ""') && sweep.includes("async function standInSite()"),
    pages: sweep.includes('export const SIGNED_IN_PAGES = ["/collection", "/hatch", "/nest"];'),
    checks: sweep.includes("the header still offers Sign in") && sweep.includes("(signed in)"),
  };
  if (!Object.values(signedIn).every(Boolean)) bad.push(`signedIn: ${JSON.stringify(signedIn)}`);

  // 7) New-keeper audit: a sign-in that came back with an error says so on /login (it used to land on the desk silently).
  const audit = {
    unfinished: login.includes('const SIGN_IN_UNFINISHED = "Sign-in did not finish. Try again.";') && login.includes("useState<string | null>(error ? SIGN_IN_UNFINISHED : null)"),
    sweep: sweep.includes("&error=access_denied"),
  };
  if (!Object.values(audit).every(Boolean)) bad.push(`audit: ${JSON.stringify(audit)}`);

  const roadmap = read("docs", "ROADMAP.md");
  if (!roadmap.includes("- [x] Sign-in returns to the page that asked")) bad.push("ROADMAP entry missing");
  const extras = { signin, quiet, taps, bubble, titles, signedIn, audit };
  if (bad.length) return fail(bad.join("; "), extras);
  return ok("Sign-in returns to the gated page (same-site paths only); the desk asks the optional house server only after it has answered here (Check, backoff); 44 px rail rows and room links on phones; the speech bubble stays under the header; tab titles for the desk and a pet page; signed-in rooms in the phone sweep (stand-in session); a failed sign-in says so", extras, [
    "signin=returns_same_site_only",
    "heartbeat=quiet_until_seen",
    "taps=44px_rail_and_links",
    "bubble=under_header",
    "titles=desk_and_pet",
    "sweep=signed_in_rooms",
    "login=unfinished_says_so",
  ]);
}

async function meetIndexForget() {
  const bad = [];
  const read = (...parts) => readFileSync(join(ROOT, ...parts), "utf8").replace(/\r\n/g, "\n");
  const importTs = (...parts) => import(pathToFileURL(join(ROOT, ...parts)).href);
  const sweep = read("web", "scripts", "phone-desk-layout.test.mjs");

  // 1) /meet on a phone: a room index, closed room drawers and a guest search instead of ~135,000 px of cards.
  const M = await importTs("web", "src", "lib", "pets", "meet-index.ts");
  const meetSrc = read("web", "src", "routes", "meet.tsx");
  const rui = { key: "red_panda", slug: "rui", name: "Rui", speciesLabel: "Red Panda" };
  const meet = {
    hash: M.roomFromHash("#room-snakes", ["house", "snakes"]) === "snakes" && M.roomFromHash("#room-attic", ["house", "snakes"]) === null && M.meetRoomAnchor("tide") === "room-tide",
    search: M.guestMatches(rui, "rui") && M.guestMatches(rui, "RED panda") && !M.guestMatches(rui, "rui fox") && M.guestMatches(rui, ""),
    words: M.matchLine(0, 221, "zz", 20) === "No guest by that name. Try a kind, like fox or owl." && M.matchLine(221, 221, "", 20) === "221 guests in 20 rooms. Open a room, or type a name.",
    wired: ["<MeetShelves />", "data-meet-index", "data-meet-search", "data-meet-room", "data-meet-guest", "hashchange", "LIVING_KINDS"].every((s) => meetSrc.includes(s)),
    sweep: sweep.includes("export const MEET_PHONE_MAX_HEIGHT = 12_000;") && sweep.includes("export const MEET_GUESTS = 221;") && sweep.includes("the rooms reach") && sweep.includes("/meet#room-snakes did not open"),
  };
  if (!Object.values(meet).every(Boolean)) bad.push(`meet: ${JSON.stringify(meet)}`);

  // 2) 44 px on phones: The house under a room's title (every room hero), the keeper card's Check.
  const css = read("web", "src", "styles.css");
  const taps = {
    house: read("web", "src", "components", "desk", "room-hero.tsx").includes('data-hero-house className="inline-flex min-h-11 items-center'),
    check: /@media \(pointer: coarse\), \(max-width: 639px\) \{\s*\.keeper-heartbeat-check \{[^}]*min-height: 2\.75rem;/.test(css),
    sweep: sweep.includes('"The house" is') && sweep.includes("the keeper card's Check is"),
  };
  if (!Object.values(taps).every(Boolean)) bad.push(`taps: ${JSON.stringify(taps)}`);

  // 3) /login fits a landscape phone.
  const login = read("web", "src", "routes", "login.tsx");
  const landscape = {
    login: login.includes("<main data-login ") && login.includes("[@media(max-height:480px)]:min-h-0") && login.includes("[@media(max-height:480px)]:p-4"),
    shell: read("web", "src", "components", "app-shell.tsx").includes("[@media(max-height:480px)]:py-3"),
    sweep: sweep.includes("for (const [w, h] of [[568, 320], [667, 375], [844, 390]])") && sweep.includes(": the page scrolls by"),
  };
  if (!Object.values(landscape).every(Boolean)) bad.push(`landscape: ${JSON.stringify(landscape)}`);

  // 4) The browser forgets a house server that stayed silent: three visits with no answer, or three days.
  const K = await importTs("web", "src", "lib", "pets", "keeper.ts");
  const box = new Map();
  const store = { getItem: (k) => (box.has(k) ? box.get(k) : null), setItem: (k, v) => box.set(k, String(v)), removeItem: (k) => box.delete(k) };
  K.rememberHouseServer(store, 0);
  const silent = [];
  for (let i = 1; i <= 4; i++) {
    const open = K.houseServerSeen(store, i);
    silent.push(open);
    if (open) K.houseServerMissed(store, i);
  }
  const gone = box.size === 0;
  K.rememberHouseServer(store, 10);
  K.houseServerMissed(store, 11);
  K.houseServerMissed(store, 12);
  K.rememberHouseServer(store, 13);
  const afterAnswer = K.readHouseServerSeen(store, 14);
  const DAY = 24 * 60 * 60 * 1000;
  const forget = {
    rule: K.HOUSE_SERVER_FORGET_VISITS === 3 && K.HOUSE_SERVER_FORGET_MS === 3 * DAY,
    visits: JSON.stringify(silent) === "[true,true,true,false]" && gone,
    reset: afterAnswer?.missed === 0,
    days: K.houseServerSeen(store, 13 + 3 * DAY - 1) === true && K.houseServerSeen(store, 13 + 3 * DAY) === false,
    legacy: (() => {
      const s = new Map([["computerpets.houseServer.seen", "1"]]);
      return K.houseServerSeen({ getItem: (k) => s.get(k) ?? null, setItem: (k, v) => s.set(k, v) }, 5) === true;
    })(),
    sweep: sweep.includes("silent for three visits is still asked") && sweep.includes("missed: 3"),
  };
  if (!Object.values(forget).every(Boolean)) bad.push(`forget: ${JSON.stringify(forget)}`);

  // 5) The stand-in session sees a kennel: a dev-only seed on in-memory PGLite (sign-in off, the dev keeper only).
  const S = await importTs("web", "src", "lib", "pets", "dev-seed.ts");
  const C = await importTs("web", "src", "lib", "pets", "catalog.ts");
  const g = { env: { COMPUTERPETS_DEV_SEED: "kennel" }, dbSource: "pglite", authConfigured: false, userId: "dev-user", devUserId: "dev-user" };
  const actions = read("web", "src", "lib", "pets", "actions.ts");
  const seed = {
    allowed: S.devSeedAllowed(g),
    refused: [{ env: {} }, { dbSource: "neon" }, { authConfigured: true }, { userId: "someone" }, { env: { COMPUTERPETS_DEV_SEED: "kennel", DATABASE_URL: "postgres://x" } }].every((o) => !S.devSeedAllowed({ ...g, ...o })),
    catalog: S.DEV_SEED_PETS.length === 6 && S.DEV_SEED_PETS.every((p) => !!C.SPECIES_BY_KEY[p.key]),
    once: /await ensureKeeper\(context\.userId\);\s*await seedDevKennelOnce\(context\.userId\);/.test(actions) && actions.includes('await import("./dev-seed.server")'),
    sweep: sweep.includes('COMPUTERPETS_DEV_SEED: "kennel"') && sweep.includes("export const DEV_KENNEL_SIZE = 6;") && sweep.includes("a kennel pet's page was checked"),
  };
  if (!Object.values(seed).every(Boolean)) bad.push(`seed: ${JSON.stringify(seed)}`);

  // 6) New-visitor audit: a mistyped link gets words, a tab title and ways on (it was a bare "Not Found").
  const nf = read("web", "src", "lib", "not-found.tsx");
  const audit = {
    router: read("web", "src", "router.tsx").includes("defaultNotFoundComponent: AppNotFound"),
    page: nf.includes('pageTitle("No room here")') && nf.includes('to="/meet"') && nf.includes("min-h-11"),
    sweep: sweep.includes("/no-such-room"),
  };
  if (!Object.values(audit).every(Boolean)) bad.push(`audit: ${JSON.stringify(audit)}`);

  const roadmap = read("docs", "ROADMAP.md");
  if (!roadmap.includes("- [x] A way through /meet on a phone")) bad.push("ROADMAP entry missing");
  const extras = { meet, taps, landscape, forget, seed, audit };
  if (bad.length) return fail(bad.join("; "), extras);
  return ok("/meet on a phone: room index, closed drawers, guest search, all 221 reachable; 44 px house links and Check; /login fits a landscape phone; the browser forgets a house server silent for three visits or three days; the stand-in session sees a seeded kennel and a pet page; a mistyped link gets ways on", extras, [
    "meet=index_drawers_search",
    "taps=house_link_and_check_44px",
    "login=fits_landscape",
    "heartbeat=forgets_silent_server",
    "sweep=seeded_kennel_and_pet_page",
    "audit=not_found_ways_on",
  ]);
}

/** The next new-keeper slice (#1550 audit): the kennel first on a phone, 44 px line links and /login's way back,
 * /study and /log as field-note indexes, /login still at 568×320, the not-found title from the server, and /demo no
 * longer looping on a phone. Source and pure-function checks; the browser side is phone-desk-layout.test.mjs. */
async function kennelFirstNotes() {
  const bad = [];
  const read = (...parts) => readFileSync(join(ROOT, ...parts), "utf8").replace(/\r\n/g, "\n");
  const importTs = (...parts) => import(pathToFileURL(join(ROOT, ...parts)).href);
  const sweep = read("web", "scripts", "phone-desk-layout.test.mjs");
  const css = read("web", "src", "styles.css");
  const room = read("web", "src", "components", "desk", "companion-room.tsx");

  // 1) /collection on a phone: the kennel right under the name, short cards, nothing boxed inside the panel.
  const kennel = {
    aside: room.includes("asideFirst?: boolean") && room.includes("{hand && asideFirst ? null : kicker}") && room.includes("{hand && asideFirst ? null : aside}"),
    wired: read("web", "src", "routes", "collection.tsx").includes("asideFirst") && read("web", "src", "routes", "collection.tsx").includes("data-kennel"),
    short: css.includes("[data-phone-floor] [data-kennel] [data-card-more] {") && read("web", "src", "components", "pet-card.tsx").includes("data-card-more"),
    sweep: sweep.includes("export const KENNEL_WHOLE_CARD") && sweep.includes("the first kennel card's name is not on the screen"),
  };
  if (!Object.values(kennel).every(Boolean)) bad.push(`kennel: ${JSON.stringify(kennel)}`);

  // 2) 44 px: the room line links (hatchery, kennel, nest, the plaque) and /login's "Go to the desk".
  const taps = {
    css: /\[data-phone-floor\] \[data-line-link\] \{[^}]*min-height: 2\.75rem;/.test(css),
    lines: [["routes", "hatch.tsx"], ["routes", "nest.tsx"], ["routes", "collection.tsx"], ["components", "desk", "species-plaque.tsx"]].every((p) => read("web", "src", ...p).includes("data-line-link")),
    login: read("web", "src", "routes", "login.tsx").includes('data-login-desk className="inline-flex min-h-11 items-center'),
    sweep: sweep.includes("panel link") && sweep.includes("(sign-in off): \"Go to the desk\" is"),
  };
  if (!Object.values(taps).every(Boolean)) bad.push(`taps: ${JSON.stringify(taps)}`);

  // 3) /study and /log: field notes as closed drawers with a search, #note-<slug> opens one.
  const M = await importTs("web", "src", "lib", "pets", "meet-index.ts");
  const fn = read("web", "src", "components", "desk", "field-notes.tsx");
  const notes = {
    hash: M.noteFromHash("#note-rui", ["rui", "pip"]) === "rui" && M.noteFromHash("#note-attic", ["rui"]) === null && M.noteAnchor("pip") === "note-pip",
    words: M.notesLine(20, 20, "", "fox") === "20 field notes. Open one, or type a name." && M.notesLine(0, 10, "zz", "millipede") === "No guest by that name here. Try a kind, like millipede." && M.notesLine(1, 20, "fox", "fox") === "1 note matches.",
    wired: read("web", "src", "routes", "study.tsx").includes("<FieldNotes notes={HOUSE_GUIDE}") && read("web", "src", "routes", "log.tsx").includes("<FieldNotes notes={LOG_GUIDE}"),
    drawers: ["<details", "data-notes-search", "data-notes-all", "data-note-tell", "hashchange", "/demo/$slug"].every((s) => fn.includes(s)),
    sweep: sweep.includes('["/study", 5_500, 20, "fox"]') && sweep.includes('["/log", 4_500, 10, "millipede"]') && sweep.includes("did not open that note"),
  };
  if (!Object.values(notes).every(Boolean)) bad.push(`notes: ${JSON.stringify(notes)}`);

  // 4) /login at 568×320 and 5) the not-found title in the first server HTML.
  const login = read("web", "src", "routes", "login.tsx");
  const root = read("web", "src", "routes", "__root.tsx");
  const edges = {
    login: login.includes("[@media(max-height:480px)]:p-4") && login.includes('[@media(max-height:340px)]:hidden">Keeper desk'),
    title: root.includes("title: notFoundHere(matches) ? NOT_FOUND_TITLE : APP_NAME") && read("web", "src", "lib", "not-found.tsx").includes('matches.every((m) => m.routeId === "__root__")'),
    sweep: sweep.includes("[[568, 320], [667, 375], [844, 390]]") && sweep.includes("the server's first tab title is"),
  };
  if (!Object.values(edges).every(Boolean)) bad.push(`edges: ${JSON.stringify(edges)}`);

  // 6) Audit fix: /demo looped on a phone ("Maximum update depth exceeded") and never took the phone layout.
  const W = await importTs("web", "src", "lib", "pets", "windows.ts");
  const a = { id: W.DEMO_WINDOW_ID, x: 1, y: 2, width: 90, height: 80 };
  const list = W.swapWindows([], [a.id], [a], true);
  const demo = {
    same: W.swapWindows(list, [a.id], [{ ...a, x: 1.2 }], true) === list,
    moved: W.swapWindows(list, [a.id], [{ ...a, x: 30 }], true) !== list,
    steady: room.includes("const onDemoBounds = useCallback(") && room.includes("<DemoWindowPlate onBounds={onDemoBounds} />") && !room.includes("onBounds={("),
    sit: read("web", "src", "components", "desk", "demo-stage.tsx").includes("data-demo-stage") && css.includes("[data-demo-stage]:has([data-phone-floor])"),
    sweep: sweep.includes("the demo never took the phone layout") && sweep.includes("Maximum update depth"),
  };
  if (!Object.values(demo).every(Boolean)) bad.push(`demo: ${JSON.stringify(demo)}`);

  const roadmap = read("docs", "ROADMAP.md");
  if (!roadmap.includes("- [x] The kennel first on a phone")) bad.push("ROADMAP entry missing");
  const extras = { kennel, taps, notes, edges, demo };
  if (bad.length) return fail(bad.join("; "), extras);
  return ok("/collection shows the kennel first on a phone; 44 px line links and /login way back; /study and /log are field-note indexes; /login fits 568x320; the not-found title comes from the server; /demo stops looping on a phone", extras, [
    "kennel=first_card_on_screen",
    "taps=line_links_and_login_desk_44px",
    "notes=study_log_drawers_search",
    "login=fits_568x320",
    "title=not_found_from_server",
    "demo=no_update_loop_phone_floor",
  ]);
}

async function kennelDrawers() {
  const bad = [];
  const read = (...parts) => readFileSync(join(ROOT, ...parts), "utf8").replace(/\r\n/g, "\n");
  const sweep = read("web", "scripts", "phone-desk-layout.test.mjs");

  // 1) The eighteen room pages: field-note drawers (they listed 6,221 to 11,181 px of notes one after another).
  const ROOMS = { canopy: ["CANOPY_GUIDE"], cellar: ["FUNGI_GUIDE"], corner: ["CORNER_GUIDE"], creek: ["CREEK_GUIDE"], far: ["FAR_GUIDE"], garden: ["GARDEN_GUIDE"], grid: ["GRID_GUIDE"], hive: ["INSECT_GUIDE", "BEE_GUIDE"], meadow: ["MEADOW_GUIDE"], pond: ["POND_GUIDE"], reef: ["REEF_GUIDE"], roost: ["ROOST_GUIDE"], sea: ["SEA_GUIDE"], shore: ["SHORE_GUIDE"], snakes: ["SNAKE_GUIDE"], stone: ["STONE_GUIDE"], well: ["WELL_GUIDE"], wood: ["WOOD_GUIDE"] };
  const unwired = Object.entries(ROOMS).filter(([r, gs]) => {
    const s = read("web", "src", "routes", `${r}.tsx`);
    return /_GUIDE\.map\(/.test(s) || !gs.every((g, i) => new RegExp(i ? `notes: ${g},` : `<FieldNotes\\s+notes=\\{${g}\\}`).test(s));
  }).map(([r]) => r);
  const fn = read("web", "src", "components", "desk", "field-notes.tsx");
  const rooms = {
    eighteen: Object.keys(ROOMS).length === 18 && unwired.length === 0,
    props: fn.includes('kicker = "Field notes"') && fn.includes("intro?: ReactNode") && fn.includes("example ?? (all[all.length - 1]?.species.toLowerCase()"),
    hive: read("web", "src", "routes", "hive.tsx").includes('kicker: "Bees and comb"'),
    sweep: sweep.includes("export const ROOM_NOTE_PAGES") && sweep.includes('["/hive", 6_000, 20]') && sweep.includes("Open all opened"),
  };
  if (!Object.values(rooms).every(Boolean)) bad.push(`rooms: ${JSON.stringify(rooms)} unwired=${unwired.join(",")}`);

  // 2) /demo on a phone: the plates dock in the panel, off the kicker and the name.
  const plates = read("web", "src", "components", "desk", "desk-plates.tsx");
  const room = read("web", "src", "components", "desk", "companion-room.tsx");
  const demo = {
    docked: plates.includes("function usePlateChrome(key: PlateKey, docked = false)") && plates.includes("const DOCKED_PLATE =") && ["weather", "news", "market"].every((k) => plates.includes(`usePlateChrome("${k}", docked)`)),
    room: room.includes("<div data-demo-plates") && room.includes("<DeskNewsPlate docked />") && !room.includes("windows={demoWindow ? deskWindows"),
    taps: read("web", "src", "styles.css").includes("[data-plate-docked] > button:first-child {"),
    sweep: sweep.includes("still float over the room") && sweep.includes("sit over the kicker or the name"),
  };
  if (!Object.values(demo).every(Boolean)) bad.push(`demo: ${JSON.stringify(demo)}`);

  // 3) Both start scripts' check mode ends with what to type next.
  const sh = read("desktop.sh");
  const ps = read("desktop.ps1");
  const next = {
    sh: sh.includes("next: Type sh desktop.sh and press Enter to turn the pets on.") && sh.includes("It finishes getting the pieces"),
    ps: ps.includes("next: Type .\\desktop.ps1 and press Enter to turn the pets on.") && ps.includes("It finishes getting the pieces"),
    harness: read("client", "computerpets_client", "app_harness.py").includes("def launch_next("),
  };
  if (!Object.values(next).every(Boolean)) bad.push(`next: ${JSON.stringify(next)}`);

  // 4) 44 px missing-page links, 5) /mind short on a phone, 7) the audit fix: /demo/<unknown> has its own tab title.
  const demoPage = read("web", "src", "routes", "demo.$slug.tsx");
  const mind = read("web", "src", "routes", "mind.tsx");
  const edges = {
    back: read("web", "src", "routes", "pets.$key.tsx").includes('data-back-kennel className="inline-flex min-h-11 items-center'),
    missing: demoPage.includes('data-demo-missing className="inline-flex min-h-11 items-center'),
    mind: mind.includes("data-mind-cards className=\"grid grid-flow-row-dense grid-cols-2") && mind.includes('${active ? "" : "max-sm:hidden"}'),
    title: demoPage.includes(': "No demo here — ComputerPets"'),
    sweep: sweep.includes("export const MIND_PHONE_MAX_HEIGHT = 2_400") && sweep.includes("/pets/not-a-pet: \"Back to kennel\" is") && sweep.includes('"No demo here — ComputerPets"'),
  };
  if (!Object.values(edges).every(Boolean)) bad.push(`edges: ${JSON.stringify(edges)}`);

  const roadmap = read("docs", "ROADMAP.md");
  if (!roadmap.includes("- [x] The kennel drawers on a phone")) bad.push("ROADMAP entry missing");
  const extras = { rooms, demo, next, edges };
  if (bad.length) return fail(bad.join("; "), extras);
  return ok("the eighteen room pages are field-note drawers; /demo docks its plates on a phone; both start checks say what to type next; 44 px missing-page links; /mind is short on a phone; /demo/<unknown> has its own tab title", extras, [
    "rooms=eighteen_drawers",
    "demo=plates_docked_phone",
    "next=plain_command_both_scripts",
    "taps=missing_links_44px",
    "mind=two_per_row_phone",
    "title=demo_unknown",
  ]);
}

async function kennelTargets() {
  const bad = [];
  const read = (...parts) => readFileSync(join(ROOT, ...parts), "utf8").replace(/\r\n/g, "\n");
  const sweep = read("web", "scripts", "phone-desk-layout.test.mjs");
  const room = read("web", "src", "components", "desk", "companion-room.tsx");

  // 1) /demo/<unknown> is a real 404 (the loader throws notFound), with its words, tab title and 44 px link.
  const demoPage = read("web", "src", "routes", "demo.$slug.tsx");
  const missing = {
    loader: demoPage.includes("if (!livingBySlug(params.slug)) throw notFound();") && demoPage.includes("notFoundComponent: DemoMissing,"),
    words: demoPage.includes("function DemoMissing()") && demoPage.includes('data-demo-missing className="inline-flex min-h-11 items-center') && demoPage.includes(': "No demo here — ComputerPets"'),
    sweep: sweep.includes("the server answered ${res.status}, not 404"),
  };
  if (!Object.values(missing).every(Boolean)) bad.push(`missing: ${JSON.stringify(missing)}`);

  // 2) Desktop sizes: 24×24 targets; the panel and the rail end on the screen.
  const css = read("web", "src", "styles.css");
  const Desk = await import(pathToFileURL(join(WEB, "src", "lib", "pets", "phone-desk.ts")).href);
  const fit = Desk.deskFit({ aside: { top: 120, left: 32, right: 352 }, rail: { top: 140, left: 1072, right: 1248 }, below: [{ top: 600, left: 200, right: 700 }], viewH: 800, gap: 8 });
  const targets = {
    css: css.includes(":is(.den-cabinet-room, .den-cabinet-guest):not([data-phone-floor] *) {") && css.includes(":is([data-line-link], [data-room-links] a, [data-talk-send], [data-open-room]):not([data-phone-floor] *) {"),
    fit: fit.asideMax === 472 && fit.railMax === 652 && room.includes("maxHeight: deskFit.asideMax") && room.includes("maxHeight: deskFit.railMax"),
    helloFirst: room.includes("{(hand || deskFold) && hintUp ? null : ("),
    sweep: sweep.includes("export const DESK_TARGET_MIN = 24;") && sweep.includes("function deskTargetProblems(") && sweep.includes('export const DESK_PAGES = ["/", "/catalog", "/demo/rui"];'),
  };
  if (!Object.values(targets).every(Boolean)) bad.push(`targets: ${JSON.stringify(targets)}`);

  // 3) /demo's plates start clear of the panel, the rail and the header; the desktop overlay's spots are unchanged.
  const P = await import(pathToFileURL(join(WEB, "src", "lib", "pets", "desk-plates.ts")).href);
  const Overlay = require(join(RENDERER, "desk-plates.js"));
  const keep = { left: 352, right: 208, top: 57 };
  let lockstep = true;
  for (const [w, h] of [[1024, 768], [1280, 800], [1440, 900], [1920, 1080]]) {
    for (const k of P.PLATE_KEYS) {
      if (JSON.stringify(P.defaultSpot(k, w, h, keep)) !== JSON.stringify(Overlay.defaultSpot(k, w, h, keep))) lockstep = false;
      if (JSON.stringify(P.defaultSpot(k, w, h)) !== JSON.stringify(Overlay.defaultSpot(k, w, h))) lockstep = false;
    }
  }
  const weather = P.defaultSpot("weather", 1280, 800, keep);
  const bare = Overlay.defaultSpot("weather", 1280, 800);
  const plates = {
    lockstep,
    clear: weather.x >= 352 + P.KEEP_GAP && weather.y >= 57 + 8,
    overlayUnchanged: bare.x === 51.2 && bare.y === 64 && !/loadPlates\([^)]*,[^)]*,[^)]*,/.test(read("desktop", "renderer", "pet.js")),
    web: read("web", "src", "components", "desk", "desk-plates.tsx").includes("loadPlates(window.innerWidth, window.innerHeight, undefined, roomKeepOff())"),
  };
  if (!Object.values(plates).every(Boolean)) bad.push(`plates: ${JSON.stringify(plates)}`);

  // 4) /hive: one search for the insects and bees and comb. 5) A phone's /demo jumps to its plates.
  const hive = read("web", "src", "routes", "hive.tsx");
  const more = {
    hive: (hive.match(/<FieldNotes\b/g) || []).length === 1 && hive.includes("more={BEES_AND_COMB}") && hive.includes("notes: BEE_GUIDE,"),
    notes: read("web", "src", "components", "desk", "field-notes.tsx").includes("more?: FieldNoteSet;"),
    jump: room.includes("data-plates-jump") && room.includes('<div data-demo-plates role="group" aria-label="Weather, news, market"'),
  };
  if (!Object.values(more).every(Boolean)) bad.push(`more: ${JSON.stringify(more)}`);

  const roadmap = read("docs", "ROADMAP.md");
  if (!roadmap.includes("- [x] The kennel targets at desktop sizes")) bad.push("ROADMAP entry missing");
  const extras = { missing, targets, plates, more };
  if (bad.length) return fail(bad.join("; "), extras);
  return ok("/demo/<unknown> is a real 404; desktop targets are 24 px and the panel and rail fit the screen; /demo's plates start clear of the panel; /hive has one search; a phone's /demo jumps to its plates", extras, [
    "missing=real_404",
    "targets=desktop_24px",
    "fit=panel_rail_on_screen",
    "plates=clear_of_panel",
    "hive=one_search",
    "jump=phone_plates",
  ]);
}

async function kennelScroll() {
  const bad = [];
  const read = (...parts) => readFileSync(join(ROOT, ...parts), "utf8").replace(/\r\n/g, "\n");
  const sweep = read("web", "scripts", "phone-desk-layout.test.mjs");
  const room = read("web", "src", "components", "desk", "companion-room.tsx");
  const Desk = await import(pathToFileURL(join(WEB, "src", "lib", "pets", "phone-desk.ts")).href);

  // 1) The rail scrolls the current guest into view (a phone's on whole rows).
  const phoneRow = Desk.railScrollFor({ scrollTop: 0, viewH: 176, scrollH: 1760, rowTop: 880, rowH: 44, snap: 44 });
  const rail = {
    math: Desk.railScrollFor({ scrollTop: 0, viewH: 400, scrollH: 1200, rowTop: 120, rowH: 32 }) === 0 && Desk.railScrollFor({ scrollTop: 0, viewH: 400, scrollH: 1200, rowTop: 800, rowH: 32 }) === 616 && phoneRow % 44 === 0 && phoneRow <= 880 && phoneRow + 176 >= 924,
    wired: room.includes("const railRoom = roomOf(kind.key).id;") && room.includes('rail.querySelector<HTMLElement>(".den-cabinet-guest.is-here")') && room.includes("}, [railRoom, kind.key, hand, pad, fit, deskFit]);"),
    sweep: sweep.includes("export const RAIL_DEEP_GUESTS =") && sweep.includes("the current guest is not in the rail's view on arrival"),
  };
  if (!Object.values(rail).every(Boolean)) bad.push(`rail: ${JSON.stringify(rail)}`);

  // 2) The drawn second window starts right of the panel.
  const Win = await import(pathToFileURL(join(WEB, "src", "lib", "pets", "demo-windows.ts")).href);
  const b = Win.secondWindowSpot(1024, 768, 352);
  const a = Win.firstWindowSpot(1024, 768);
  const windows = {
    spot: b.left >= 352 + Win.DEMO_WINDOW_GAP && (b.top >= a.top + a.height || b.left >= a.left + a.width),
    wired: read("web", "src", "components", "desk", "demo-window-plate.tsx").includes('import { secondWindowSpot, type DemoWindowBox } from "@/lib/pets/demo-windows";'),
    sweep: sweep.includes("the second window sits behind the panel"),
  };
  if (!Object.values(windows).every(Boolean)) bad.push(`windows: ${JSON.stringify(windows)}`);

  // 3) Signed in, the panel is the one scroller (the rules sit in the utilities layer, where they win).
  const css = read("web", "src", "styles.css");
  const utilities = css.slice(css.lastIndexOf("@layer utilities {"));
  const scroller = {
    css: utilities.includes("[data-phone-floor] [data-aside-list],\n  [data-aside-fit] [data-aside-list] {") && !css.slice(0, css.lastIndexOf("@layer utilities {")).includes("[data-aside-list]"),
    lists: ["collection.tsx", "catalog.tsx", "nest.tsx"].every((f) => read("web", "src", "routes", f).includes("data-aside-list")),
    fit: room.includes('data-aside-fit={!hand && !pad && deskFit ? "" : undefined}'),
    sweep: sweep.includes("scrolls inside the panel"),
  };
  if (!Object.values(scroller).every(Boolean)) bad.push(`scroller: ${JSON.stringify(scroller)}`);

  // 4) The speech bubble steps around the plates. 5) A landscape phone's jump sits beside the name.
  const plates = [{ left: 900, top: 120, right: 1188, bottom: 158 }];
  const moved = Desk.bubbleDodge({ x: 950, top: 110, w: 220, h: 56, plates, width: 1280, minTop: 72, maxTop: 600 });
  const crosses = Math.min(moved.x + 220, 1188) - Math.max(moved.x, 900) > 0 && Math.min(moved.top + 56, 158) - Math.max(moved.top, 120) > 0;
  const bubble = {
    math: !crosses && JSON.stringify(Desk.bubbleDodge({ x: 300, top: 200, w: 220, h: 56, plates, width: 1280 })) === JSON.stringify({ x: 300, top: 200 }),
    wired: read("web", "src", "components", "desk", "living-pet.tsx").includes("bubbleDodge("),
    sweep: sweep.includes("function bubbleOverPlates()"),
  };
  if (!Object.values(bubble).every(Boolean)) bad.push(`bubble: ${JSON.stringify(bubble)}`);
  const jump = {
    wired: room.includes('const landJump = demoWindow && hand && handOrient === "sit";') && room.includes("<div data-name-row data-bubble-avoid={bubbleAvoid} className=") && room.includes("{landJump ? null : platesJump}"),
    sweep: sweep.includes("the plates jump takes a scroll to reach"),
  };
  if (!Object.values(jump).every(Boolean)) bad.push(`jump: ${JSON.stringify(jump)}`);

  // 6) No care bar shows two buttons with the same word.
  const Labels = await import(pathToFileURL(join(WEB, "src", "lib", "pets", "care-labels.ts")).href);
  const words = {
    label: Labels.distinctLabel("Ember", ["Feed", "Ember"]) === "Ember trick" && Labels.distinctLabel("Climb", ["Feed"]) === "Climb",
    wired: room.includes("specialVerb: trickWord,") && room.includes("label: trickWord,"),
  };
  if (!Object.values(words).every(Boolean)) bad.push(`words: ${JSON.stringify(words)}`);

  const roadmap = read("docs", "ROADMAP.md");
  if (!roadmap.includes("- [x] The kennel scroll pass")) bad.push("ROADMAP entry missing");
  const extras = { rail, windows, scroller, bubble, jump, words };
  if (bad.length) return fail(bad.join("; "), extras);
  return ok("the rail shows the current guest; /demo's second window is clear of the panel; signed in the panel is the one scroller; the speech bubble steps around the plates; a landscape phone's jump sits beside the name; no two care buttons share a word", extras, [
    "rail=current_guest_in_view",
    "window=clear_of_panel",
    "scroll=one_scroller",
    "bubble=clear_of_plates",
    "jump=beside_name_landscape",
    "words=distinct_care_words",
  ]);
}

const COMMANDS = {
  guest_choice: guestChoice,
  demo_room: demoRoom,
  load_problems: loadProblems,
  plain_reasons: plainReasons,
  care_talk_plates: careTalkPlates,
  pets_admin_music: petsAdminMusic,
  pets_keys_idle: petsKeysIdle,
  pet_keys_plates: petKeysPlates,
  menu_keys_escape: menuKeysEscape,
  first_run: firstRun,
  plain_words: plainWords,
  consent_plain: consentPlain,
  consent_types_plain: consentTypesPlain,
  loop_guard_unlock_plain: loopGuardUnlockPlain,
  desk_guard_plain: deskGuardPlain,
  guest_loops_mount: guestLoopsMount,
  minds_flight_plain: mindsFlightPlain,
  overlay_birds_plain: overlayBirdsPlain,
  flake_house_plain: flakeHousePlain,
  unlock_plain_lfs: unlockPlainLfs,
  pictures_start_names: picturesStartNames,
  portraits_tray_minds: portraitsTrayMinds,
  house_lines_talk: houseLinesTalk,
  no_repeat_signed_in: noRepeatSignedIn,
  phone_layout_told_once: phoneLayoutToldOnce,
  site_header_rail: siteHeaderRail,
  signin_return_quiet: signinReturnQuiet,
  meet_index_forget: meetIndexForget,
  kennel_first_notes: kennelFirstNotes,
  kennel_drawers: kennelDrawers,
  kennel_targets: kennelTargets,
  kennel_scroll: kennelScroll,
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
