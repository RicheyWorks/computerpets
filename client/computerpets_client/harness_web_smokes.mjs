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
  if (!/^\d+$/.test(baselineJs) || Number(baselineJs) > 58) bad.push(`desktop checkJs baseline is ${baselineJs}, above 58`);
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
