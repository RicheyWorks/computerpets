import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

// Companion-room feed / rest / clean / medicine saves and talk turns say why they failed; a revoke
// only counts when the ledger confirms it; desk plates and keeper-card sound say "couldn't load"
// or "couldn't play" with a retry instead of sitting empty; and test-all explains deploy-sh on Windows.

const web = join(dirname(fileURLToPath(import.meta.url)), "..");
const repo = join(web, "..");
const read = (base, rel) => readFileSync(join(base, rel), "utf8").replace(/\r\n/g, "\n");
const src = (rel) => read(web, rel);
const P = await import(pathToFileURL(join(web, "src/lib/plain-error.ts")).href);
const B = await import(pathToFileURL(join(web, "src/lib/admin/base.ts")).href);
const T = await import(pathToFileURL(join(web, "src/lib/pets/talk-post.ts")).href);
const quiet = () => {};
const refused = () => Object.assign(new TypeError("fetch failed"), { cause: { code: "ECONNREFUSED", message: "connect ECONNREFUSED 10.0.0.9:443" } });

test("careNotSaved: feed, rest, clean, and medicine each say the meters didn't change, plus a plain reason", () => {
  for (const act of ["play", "feed", "rest", "clean", "medicine"]) {
    const logged = [];
    const line = P.careNotSaved(act, refused(), (l, e) => logged.push([l, e]));
    assert.ok(line.startsWith(P.CARE_NOT_SAVED[act]), line);
    assert.match(P.CARE_NOT_SAVED[act], /wasn't saved, so the meters didn't change\.$/);
    assert.ok(line.endsWith(P.PLAIN_LINES.unreachable), line);
    assert.equal(logged.length, 1, "raw error only in the log");
    assert.doesNotMatch(line, /ECONNREFUSED|fetch failed|10\.0\.0\.9/);
  }
});

test("companion room: a failed feed or tend save is said plainly with Try again, and the meters stay put", () => {
  const text = src("src/components/desk/companion-room.tsx");
  const feed = text.slice(text.indexOf("async function feed()"), text.indexOf("async function tend("));
  assert.match(feed, /await persist\("feed"\);\n      \} catch \(err\) \{\n        careFailed\("feed", err\);\n        return;\n      \}\n      setCareProblem\(null\);/);
  assert.doesNotMatch(feed, /\} catch \{/, "no swallowed feed save");
  const tend = text.slice(text.indexOf("async function tend("), text.indexOf("function doSpecial()"));
  assert.match(tend, /const saved = action === "rest" \|\| action === "clean" \|\| action === "medicine" \? action : null;/);
  assert.match(tend, /await persist\(saved\);\n      \} catch \(err\) \{\n        careFailed\(saved, err\);\n        return;\n      \}\n      setCareProblem\(null\);/);
  assert.doesNotMatch(tend, /\} catch \{/, "no swallowed tend save");
  const fail = text.slice(text.indexOf("function careFailed"), text.indexOf("function playNotSaved"));
  assert.doesNotMatch(fail, /setStats/, "a failed save does not move the meters");
  const retry = text.slice(text.indexOf("function retryCare"), text.indexOf("async function retryPlay"));
  assert.match(retry, /if \(!act \|\| busy\) return;/);
  assert.match(retry, /else if \(act === "feed"\) void feed\(\);/);
  assert.match(retry, /else void tend\(act\);/);
  assert.match(text, /data-care-problem=\{careProblem\.act\}/);
  assert.match(text, /onClick=\{retryCare\}/);
});

test("talkProblem: a plugin failure gets the Minds reason, a house failure the house reason; raw text only in the log", () => {
  const logged = [];
  const log = (l, e) => logged.push([l, e]);
  const key = P.talkProblem(new Error("openai 401"), true, log);
  assert.equal(key, `${P.TALK_LINES.mind} ${P.MIND_LINES.key}`);
  assert.equal(P.talkProblem(new Error("anthropic 429"), true, quiet), `${P.TALK_LINES.mind} ${P.MIND_LINES.busy}`);
  assert.equal(P.talkProblem(new Error("custom 404"), true, quiet), `${P.TALK_LINES.mind} ${P.MIND_LINES.address}`);
  assert.equal(P.talkProblem(refused(), true, quiet), `${P.TALK_LINES.mind} ${P.MIND_LINES.unreachable}`);
  const house = P.talkProblem(refused(), false, log);
  assert.equal(house, `${P.TALK_LINES.house} ${P.PLAIN_LINES.unreachable}`);
  assert.equal(logged.length, 2, "each failure logged once");
  for (const line of [key, house]) assert.doesNotMatch(line, /openai|401|ECONNREFUSED|10\.0\.0\.9/);
  assert.equal(P.talkProblem(new P.HouseError("That guest has left the house."), false, quiet), `${P.TALK_LINES.house} That guest has left the house.`);
});

test("talkUsesPlugin: a mind other than the house, or a server voice, is a plugin turn", () => {
  assert.equal(T.talkUsesPlugin(null, "none"), false);
  assert.equal(T.talkUsesPlugin({ plugin: "local" }, "browser"), false);
  assert.equal(T.talkUsesPlugin({ plugin: " " }, "none"), false, "blank plugin is the house");
  assert.equal(T.talkUsesPlugin({ plugin: "openai", apiKey: "sk-test" }, "none"), true);
  assert.equal(T.talkUsesPlugin({ plugin: "local" }, "xai"), true);
  assert.equal(T.talkUsesPlugin({ plugin: "local" }, "openai"), true);
});

test("companion room: a failed talk keeps the house line and adds a quiet reason with Try again", () => {
  const text = src("src/components/desk/companion-room.tsx");
  const send = text.slice(text.indexOf("async function sendTalk"), text.indexOf("async function talk("));
  assert.match(send, /\} catch \(err\) \{/);
  assert.match(send, /say\(message \? kind\.listenLine\(\) : kind\.ambientLine\(stats\)\);/, "the house line still speaks");
  assert.match(send, /setTalkProblem\(\{ line: talkProblemLine\(err, talkUsesPlugin\(mind, mindSettings\.voice\)\), message \}\);/);
  assert.match(send, /setTalkProblem\(null\);\n      say\(res\.text/);
  assert.match(text, /<p role="status" aria-live="polite" data-talk-problem/);
  assert.match(text, /onClick=\{\(\) => void talk\(talkProblem\.message\)\}/);
});

test("admin revoke: only the ledger's own {revoked:true, jti} confirmation counts", () => {
  assert.equal(B.isRevokeDone({ revoked: true, jti: "a1", softDeleted: true }, "a1"), true);
  assert.equal(B.isRevokeDone({ revoked: true, jti: "b2" }, "a1"), false, "another jti");
  assert.equal(B.isRevokeDone({ revoked: "true", jti: "a1" }, "a1"), false);
  assert.equal(B.isRevokeDone({ ok: true }, "a1"), false);
  assert.equal(B.isRevokeDone([{ revoked: true, jti: "a1" }], "a1"), false);
  assert.equal(B.isRevokeDone(null, "a1"), false);
  assert.equal(B.isRevokeDone("<html>ok</html>", "a1"), false);
  const api = src("src/lib/admin/api.ts");
  const revoke = api.slice(api.indexOf("export async function revokeLicense"));
  const ok = revoke.indexOf('if (!res.ok) throw await failure(res, "Revoke failed.");');
  const done = revoke.indexOf('if (!isRevokeDone(await readJsonBody(res), jti)) throw notTheService(res.status, "the ledger\'s revoke confirmation");');
  assert.ok(ok > 0 && done > ok, "the confirmation is checked after a 2xx");
  // The Java service answers exactly this shape.
  const java = read(repo, "src/main/java/com/enterprisepet/controller/AdminController.java");
  assert.match(java, /return ResponseEntity\.ok\(Map\.of\(\n\s+"revoked", true,\n\s+"jti", jti,/);
});

test("plateProblem: couldn't load plus a plain reason with no house-server words", () => {
  const logged = [];
  const log = (l, e) => logged.push([l, e]);
  assert.equal(P.plateProblem("forecast", null, log), `${P.PLATE_LINES.forecast} ${P.PLATE_REASONS.answer}`);
  assert.equal(logged.length, 0, "an unreadable answer has no raw error");
  const timeout = Object.assign(new Error("quote request timed out"), { name: "QuoteTimeout" });
  assert.equal(P.plateProblem("price", timeout, log), `${P.PLATE_LINES.price} ${P.PLATE_REASONS.timeout}`);
  assert.equal(P.plateProblem("headlines", Object.assign(new Error("x"), { name: "NewsTimeout" }), log), `${P.PLATE_LINES.headlines} ${P.PLATE_REASONS.timeout}`);
  assert.equal(P.plateProblem("newer", refused(), log), `${P.PLATE_LINES.newer} ${P.PLATE_REASONS.unreachable}`);
  assert.equal(P.plateProblem("forecast", new Error("mystery"), log), `${P.PLATE_LINES.forecast} ${P.PLATE_REASONS.unknown}`);
  assert.equal(logged.length, 4);
  for (const line of Object.values(P.PLATE_REASONS)) assert.doesNotMatch(line, /house server/);
});

test("desk plates: forecast, headlines, and prices say couldn't load with Try again", () => {
  const text = src("src/components/desk/desk-plates.tsx");
  assert.doesNotMatch(text, /Unread\. The look-up did not land\./);
  const weather = text.slice(text.indexOf("export function DeskWeatherPlate"), text.indexOf("export function DeskNewsPlate"));
  assert.match(weather, /\.catch\(\(err\) => \{\n        if \(cancelled\) return;\n        liveKey\.current = "";\n        setUnread\(true\);\n        setProblem\(plateProblem\("forecast", err\)\);/);
  assert.match(weather, /setProblem\(next \? null : plateProblem\("forecast", null\)\);/);
  assert.match(weather, /\}, \[areas, card\.hereForecastAck, onSky, open, tab, attempt\]\);/);
  assert.match(weather, /data-plate-problem="forecast"/);
  const news = text.slice(text.indexOf("export function DeskNewsPlate"), text.indexOf("export function DeskMarketPlate"));
  assert.match(news, /setProblem\(plateProblem\(kept \? "newer" : "headlines", err\)\);/);
  assert.match(news, /function landed\(next: NewsItem\[\]\)/);
  assert.equal((news.match(/landed\(parse(Rss|News)\(/g) || []).length, 4, "every feed goes through landed()");
  assert.match(news, /\}, \[open, prefs, tab, topic\.id, topic\.query, attempt\]\);/);
  assert.match(news, /data-plate-problem="news"/);
  const market = text.slice(text.indexOf("export function DeskMarketPlate"));
  assert.match(market, /\} else if \(ticker\?\.geckoId && geckoIds\.includes\(ticker\.geckoId\)\) \{/, "an answer without this coin is not \"…\" forever");
  assert.equal((market.match(/setProblem\(plateProblem\("price", err\)\);/g) || []).length, 3);
  assert.match(market, /data-plate-problem="market"/);
  assert.match(market, /nft\?\.id, attempt\]\);/);
  assert.equal((market.match(/if \(json == null\) return;\n      const (coins|found) = parseSearch/g) || []).length, 0, "a look-up never leaves \"looking up…\" standing");
  assert.equal((text.match(/setAttempt\(\(n\) => n \+ 1\)/g) || []).length, 3);
});

test("soundProblem: music and sleep sounds that did not play say why; a deliberate pause says nothing", () => {
  const blocked = Object.assign(new Error("play() failed because the user didn't interact with the document first."), { name: "NotAllowedError" });
  const logged = [];
  const log = (l, e) => logged.push([l, e]);
  assert.equal(P.soundProblem("music", blocked, log), `${P.SOUND_LINES.music} ${P.SOUND_REASONS.blocked}`);
  const format = Object.assign(new Error("The element has no supported sources."), { name: "NotSupportedError" });
  assert.equal(P.soundProblem("sleep", format, log), `${P.SOUND_LINES.sleep} ${P.SOUND_REASONS.unsupported}`);
  assert.equal(P.soundProblem("music", refused(), log), `${P.SOUND_LINES.music} ${P.SOUND_REASONS.unreachable}`);
  assert.equal(P.soundProblem("sleep", new Error("mystery"), log), `${P.SOUND_LINES.sleep} ${P.SOUND_REASONS.unknown}`);
  assert.equal(logged.length, 4, "raw error only in the log, once each");
  assert.equal(P.soundInterrupted(Object.assign(new Error("The play() request was interrupted by a call to pause()."), { name: "AbortError" })), true);
  assert.equal(P.soundInterrupted(blocked), false);
});

test("keeper card: music and sleep sounds that fail say so with Try again; quiet reads are documented", () => {
  const text = src("src/components/desk/keeper-card.tsx");
  assert.doesNotMatch(text, /audio\.play\(\)\.catch\(\(\) => \{\}\)/, "no swallowed sleep sound");
  assert.doesNotMatch(text, /\.catch\(\(\) => onMusicChange\?\.\(false\)\)/, "no swallowed music");
  assert.match(text, /if \(!soundInterrupted\(err\)\) setSoundLine\(\{ what: "music", line: soundProblem\("music", err\) \}\);/);
  assert.match(text, /setSoundLine\(\{ what: "sleep", line: soundProblem\("sleep", err\) \}\);/);
  assert.equal((text.match(/cancelled = true;\n      audio\.pause\(\);/g) || []).length, 2, "a closed card never reports a late failure");
  assert.match(text, /streamAsked, soundTry\]\);/);
  assert.match(text, /guest\.volume, soundTry\]\);/);
  assert.match(text, /data-sound-problem=\{soundLine\.what\}/);
  assert.match(text, /setSoundTry\(\(n\) => n \+ 1\);/);
  // The sound line sits with the sleep aid for every guest, outside the guest-only music block.
  const line = text.indexOf("data-sound-problem");
  assert.ok(line > text.indexOf('aria-label="Sleep aid"') && line < text.indexOf('guestKey === "red_panda" ? ('));
  assert.match(text, /Quiet by design: an unreachable Java service reads "DOWN"/);
  assert.match(text, /Quiet by design: a failed read shows "Listening · unread"/);
  assert.match(text, /a held stream is the honesty gate, not a failure \(quiet\)/);
});

test("test-all: deploy-sh on Windows explains PyYAML for bash and installs nothing", () => {
  const doc = read(repo, "docs/CONTRIBUTING.md");
  assert.match(doc, /\*\*deploy-sh on Windows\.\*\*/);
  assert.match(doc, /py -3 -m pip install --user pyyaml/);
  assert.match(doc, /App execution aliases/);
  assert.match(doc, /python3 -c 'import yaml; print\(yaml\.__version__\)'/);
  const ps = read(repo, "scripts/test-all.ps1");
  assert.match(ps, /see 'deploy-sh on Windows' in docs\/CONTRIBUTING\.md/);
  assert.match(ps, /Nothing is installed\./);
  assert.doesNotMatch(ps, /pip install[^\n]*yaml/i, "test-all never installs PyYAML");
});
