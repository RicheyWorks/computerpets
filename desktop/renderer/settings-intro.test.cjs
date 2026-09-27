const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");

const html = readFileSync(join(__dirname, "settings.html"), "utf8").replace(/\r\n/g, "\n");

const unlockStart = html.indexOf("<h2>Unlock</h2>");
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
  const before = html.slice(unlockStart + "<h2>Unlock</h2>".length, detailsStart);
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
    /did not read the operating-system machine id/,
    /machine-id file on Linux, MachineGuid on Windows, or the platform UUID on a Mac/,
    /hashes the result with SHA-256/,
    /saves only the hash in hwid\.txt/,
    /reuse the stored hash/,
    /The raw id is not sent\./,
    /device fingerprint/,
    /names the host before the hash leaves/,
    /If that named read fails, Unlock stops and asks you first\./,
    /random id instead if this computer has no name/,
  ]) {
    assert.match(mark, claim);
  }
  const stored = html.match(/const storedMarkText = "([^"]+)";/);
  assert.ok(stored, "the stored-hash wording is one string");
  assertWholeSentences(stored[1], "storedMarkText");
  // The first-read wording lives once, in the markup; paintMark restores it rather than keeping a second copy.
  assert.equal(html.split("Opening this window did not read").length - 1, 1);
  assert.match(html, /node\.textContent = mark\.read === "stored" \? storedMarkText : firstMarkText;/);
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