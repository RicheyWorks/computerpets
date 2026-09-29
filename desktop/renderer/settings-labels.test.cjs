// The House window (settings.html): every label names its field, and the unlock's forget button says what it does.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "settings.html"), "utf8");

test("every <label> in the House window points at a field that is there", () => {
  const labels = [...html.matchAll(/<label([^>]*)>([^<]*)<\/label>/g)];
  assert.ok(labels.length >= 9, `found ${labels.length} labels`);
  for (const [, attrs, text] of labels) {
    const f = /\bfor="([^"]+)"/.exec(attrs);
    assert.ok(f, `"${text}" names no field (a click on it and a screen reader reach nothing)`);
    assert.match(html, new RegExp(`<(input|select|textarea)[^>]*\\bid="${f[1]}"`), `"${text}" points at #${f[1]}, which is missing`);
  }
});

test("the unlock's forget button says what it forgets, and that the pets keep working", () => {
  assert.match(html, /<button id="lock" class="ghost" type="button" title="Forgets the saved unlock on this computer\. The pets keep working\.">Forget the unlock<\/button>/);
});
