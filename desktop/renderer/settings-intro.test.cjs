const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");

const html = readFileSync(join(__dirname, "settings.html"), "utf8").replace(/\r\n/g, "\n");

const unlockStart = html.indexOf('<h2 id="unlockSection">Unlock</h2>');
const fieldsetStart = html.indexOf('<fieldset class="optional" id="unlockOptional">');
const fieldsetEnd = html.indexOf("</fieldset>", fieldsetStart);
const detailsStart = html.indexOf('<details class="fold" id="unlockDetails">');
const detailsEnd = html.indexOf("</details>", detailsStart);

function textOf(fragment) {
  return fragment
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function words(text) {
  return text.split(/\s+/).filter(Boolean);
}

function paragraph(id) {
  const m = html.match(new RegExp(`<p[^>]*id="${id}"[^>]*>([\\s\\S]*?)</p>`));
  assert.ok(m, `#${id} is in settings.html`);
  return textOf(m[1]);
}

function sentences(text) {
  return text.split(/(?<=[.!?])\s+/).filter(Boolean);
}

function assertWholeSentences(text, label) {
  for (const s of sentences(text)) {
    assert.match(s, /^[A-Z]/, `${label}: "${s}" starts a sentence`);
    assert.match(s, /[.!?]$/, `${label}: "${s}" ends a sentence`);
    assert.ok(words(s).length >= 4, `${label}: "${s}" is not a fragment`);
    if (/^(If|When|Unless|Because|Although)\b/.test(s)) {
      assert.match(s, /,/, `${label}: "${s}" is a dangling clause`);
    }
  }
}

test("settings: the sections are where the Unlock layout expects them", () => {
  assert.ok(unlockStart > 0);
  assert.ok(detailsStart > unlockStart, "Details toggle sits under the Unlock heading");
  assert.ok(detailsEnd > detailsStart);
  assert.ok(fieldsetStart > detailsEnd, "the optional fields come after the folded detail");
  assert.ok(fieldsetEnd > fieldsetStart);
});

test("settings: the first visible Unlock text is one short plain line", () => {
  const before = html.slice(unlockStart + '<h2 id="unlockSection">Unlock</h2>'.length, detailsStart);
  const visible = textOf(before);
  assert.equal(visible, "Pets work without unlocking. Unlocking is optional.");
  assert.ok(words(visible).length <= 12, "short enough to read at a glance");
  assert.equal(paragraph("unlockIntro"), visible);
  // Nothing else the keeper reads sits between that line and the fields, except the folded summary.
  const between = html.slice(detailsEnd + "</details>".length, fieldsetStart);
  assert.equal(textOf(between), "");
  const summary = html.slice(detailsStart, detailsEnd).match(/<summary>([^<]*)<\/summary>/);
  assert.ok(summary);
  assert.equal(summary[1], "Details");
});

test("settings: the machine-id privacy detail sits inside the Details toggle", () => {
  const folded = html.slice(detailsStart, detailsEnd);
  assert.match(folded, /<p id="licenseMark">/);
  assert.match(folded, /<p id="unlockAbout">/);
  const outside = html.slice(0, detailsStart) + html.slice(detailsEnd);
  assert.doesNotMatch(outside, /id="licenseMark"/);
  assert.doesNotMatch(outside, /id="unlockAbout"/);
  assert.doesNotMatch(outside, /Prove Steam ownership/);
  assert.doesNotMatch(html, /<details[^>]*\bopen\b/, "the toggle starts folded");
});

test("settings: the privacy detail is whole, careful sentences", () => {
  const mark = paragraph("licenseMark");
  assertWholeSentences(mark, "licenseMark");
  assertWholeSentences(paragraph("unlockAbout"), "unlockAbout");
  assert.doesNotMatch(mark, /If that named read fails\./, "the old fragment is gone");
  for (const claim of [
    /did not look at this computer's ID/,
    /machine-id file on Linux, MachineGuid on Windows, or the platform UUID on a Mac/,
    /scrambles the result with SHA-256 into a code/,
    /saves only that code in hwid\.txt/,
    /use the saved code again/,
    /The ID itself is never sent\./,
    /like a fingerprint for this computer/,
    /names the website before the code is sent/,
    /If the app cannot read that ID, Unlock stops and asks you first\./,
    /random ID instead if this computer has no name/,
  ]) {
    assert.match(mark, claim);
  }
  const stored = html.match(/const storedMarkText = "([^"]+)";/);
  assert.ok(stored, "the stored-code wording is one string");
  assertWholeSentences(stored[1], "storedMarkText");
  assert.match(stored[1], /^A code is already saved in hwid\.txt\./);
  assert.match(stored[1], /The ID itself is never sent\./);
  assert.match(stored[1], /like a fingerprint for this computer/);
  // Kid-plain and still honest: no hash, raw id, host, or operating-system words in either line.
  for (const text of [mark, stored[1]]) {
    assert.doesNotMatch(text, /\bhash|raw id|device fingerprint|operating-system|the host\b|\bleaves\b|mark\./i);
  }
  // The first-read wording lives once, in the markup; paintMark restores it rather than keeping a second copy.
  assert.equal(html.split("Opening this window did not look").length - 1, 1);
  assert.match(html, /node\.textContent = mark\.read === "stored" \? storedMarkText\.split\(\/\(\?<=\\\.\) \(\?=\[A-Z\]\)\/\)\.join\("\\n"\) : firstMarkText;/);
});

test("settings: Unlock Details reads like START-HERE, one short sentence per line, every fact kept", () => {
  const raw = html.match(/<p id="licenseMark">([^<]*)<\/p>/);
  assert.ok(raw, "licenseMark is one plain paragraph");
  const lines = raw[1].split("\n").map((l) => l.trim()).filter(Boolean);
  assert.ok(lines.length >= 15, `short lines, not a wall (${lines.length} lines)`);
  for (const line of lines) {
    assert.equal(sentences(line).length, 1, `"${line}" is one sentence on its own line`);
    assert.ok(words(line).length <= 18, `"${line}" is short (${words(line).length} words)`);
  }
  // The box keeps the line breaks; without this the lines would run together again.
  assert.match(html, /#licenseMark \{ white-space: pre-line; \}/);
  // Every fact from the old one-paragraph wording is still there.
  const text = lines.join(" ");
  for (const fact of [
    "Opening this window did not look at this computer's ID.",
    "looks at the ID only when no code is saved yet",
    "downloading a pet whose license belongs to this computer",
    "The ID is the machine-id file on Linux, MachineGuid on Windows, or the platform UUID on a Mac.",
    "mixes that ID with its own name and the kind of computer",
    "It scrambles the result with SHA-256 into a code.",
    "It saves only that code in hwid.txt in its data folder.",
    "Later unlocks use the saved code again.",
    "So your license keeps working on this computer.",
    "The ID itself is never sent.",
    "Only the code goes to the license website.",
    "only when you unlock or download a pet whose license belongs to this computer",
    "The code still works like a fingerprint for this computer.",
    "this computer always makes the same code",
    "The line under the house server address names the website before the code is sent.",
    "If the house server is on this computer, the code stays on this computer.",
    "If the app cannot read that ID, Unlock stops and asks you first.",
    "It uses the computer's name only after you press the button that says so.",
    "It uses a random ID instead if this computer has no name.",
    "Renaming the computer changes a code made from its name.",
    "If the code came from a random ID, deleting hwid.txt gives this computer a different code.",
  ]) {
    assert.ok(text.includes(fact), `still says: ${fact}`);
  }
  // The stored-code wording is painted one sentence per line too (hwid.txt keeps its dot).
  const stored = html.match(/const storedMarkText = "([^"]+)";/)[1];
  const painted = stored.split(/(?<=\.) (?=[A-Z])/);
  assert.equal(painted[0], "A code is already saved in hwid.txt.");
  assert.equal(painted.length, sentences(stored).length);
  for (const line of painted) assert.ok(words(line).length <= 18, `stored line "${line}" is short`);
});

test("settings: Backend URL and license fields are a labeled optional section", () => {
  const optional = html.slice(fieldsetStart, fieldsetEnd);
  assert.match(optional, /<legend>Optional: only needed to unlock<\/legend>/);
  for (const id of ["backend", "licenseNet", "bundleNet", "provider", "steamId", "appId", "petType", "unlock", "redownload", "lock", "weakMark"]) {
    assert.match(optional, new RegExp(`id="${id}"`), `#${id} is inside the optional section`);
  }
  // The host lines stay visible (not folded) so the keeper sees the host before anything leaves.
  const folded = html.slice(detailsStart, detailsEnd);
  assert.doesNotMatch(folded, /id="licenseNet"|id="bundleNet"/);
});
test("settings: each Unlock field has a plain label and one true helper line", () => {
  const optional = html.slice(fieldsetStart, fieldsetEnd);
  const fields = [
    ["provider", "Where you own the game", "Only Steam works here for now. Other stores cannot unlock from this window yet."],
    ["steamId", "Your Steam ID", "Your Steam account number: 17 digits that start with 7656. Steam shows it under Account details."],
    ["appId", "Steam App ID", "The game's number on Steam. Ask whoever runs the house server. ComputerPets has no Steam page yet."],
  ];
  for (const [id, label, help] of fields) {
    assert.match(optional, new RegExp(`<label for="${id}">${label}</label>`), `${id} label`);
    assert.equal(paragraph(`${id}Help`), help);
    assert.match(help, /^[A-Z][^]*\.$/, `${id} helper is whole sentences`);
    assert.ok(words(help).length <= 20, `${id} helper is one short line`);
  }
  // Only Steam is offered, and the helper says so.
  assert.match(optional, /<select id="provider"><option value="steam">Steam<\/option><\/select>/);
  assert.doesNotMatch(optional, /<label>(Provider|Steam ID|App ID)<\/label>/);
});

test("settings: Minds says first that pets talk without an AI, and House lines hide the AI boxes", () => {
  const mindsStart = html.indexOf('<h1 id="mindsSection">Minds</h1>');
  const pluginAt = html.indexOf('<select id="plugin"></select>');
  assert.ok(mindsStart >= 0 && pluginAt > mindsStart);
  const before = textOf(html.slice(mindsStart + '<h1 id="mindsSection">Minds</h1>'.length, html.indexOf('<label for="plugin">Which AI</label>')));
  assert.equal(before, "Pets talk without an AI. Adding one is optional.");
  assert.equal(paragraph("mindsIntro"), before);
  assert.equal(paragraph("mindHouse"), "House lines need nothing else. Your pets answer with their own words.");
  const fieldsStart = html.indexOf('<div id="mindFields">');
  const fieldsEnd = html.indexOf("</div>", fieldsStart);
  assert.ok(fieldsStart > pluginAt && fieldsEnd > fieldsStart);
  const fields = html.slice(fieldsStart, fieldsEnd);
  for (const id of ["model", "base", "key", "mindAbout"]) assert.match(fields, new RegExp(`id="${id}"`), `${id} sits in the AI boxes`);
  assert.match(html, /const house = !p \|\| p\.kind === "local";\s*if \(mindFields\) mindFields\.hidden = house;\s*if \(mindHouse\) mindHouse\.hidden = !house;/);
  assert.match(html, /<button id="redownload" class="ghost" type="button">Download my pet<\/button>/);
  assert.doesNotMatch(html, />Signed download</);
});

test("settings: Download my pet waits, with a plain reason, until a license is saved", () => {
  const optional = html.slice(fieldsetStart, fieldsetEnd);
  assert.match(optional, /<p class="hint" id="downloadHelp" hidden>Download my pet works after an unlock on this computer\.<\/p>/);
  // status.held is license.json holding an issued license (license/session.cjs hasStoredLicense).
  assert.match(html, /const canDownload = status\.held === true \|\| Boolean\(status\.unlocked && status\.license\);/);
  assert.match(html, /redownloadBtn\.disabled = !canDownload;\s*downloadHelp\.hidden = canDownload;/);
  assert.match(html, /button:disabled \{ opacity: 0\.45; cursor: default; \}/);
  // One locked sentence, the same as the blotter's (client/computerpets_client/unlock_dialog.py LOCKED_LINE).
  assert.equal(html.split('licenseOk.textContent = "Locked. Pets still work without unlocking.";').length - 1, 2);
  assert.doesNotMatch(html, /Pets on the desk still work/);
});
