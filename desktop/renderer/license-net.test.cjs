"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");

require("./weather-areas.js");
const page = require("./license-net.js");
const main = require("../license/license-net.cjs");

describe("overlay license line matches the main-process gate", () => {
  it("names the same host with the shared sentence", () => {
    const url = "https://user:secret@license.example.test/api?hwid=raw-id#room";
    assert.equal(page.licenseHonesty(url), main.licenseHonesty(url));
    assert.equal(page.licenseMaySend(url, page.licenseHonesty(url)), true);
    assert.equal(page.licenseMaySend(url, false), false);
    assert.equal(page.licenseHonesty("http://127.0.0.1:8081"), "");
    assert.equal(page.LOCAL_STAYS, main.LOCAL_STAYS);
    assert.equal(page.licenseHonesty(url).includes(path.basename("raw-id")), false);
  });
});
