"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const os = require("os");
const path = require("path");
const fs = require("fs");
const { resolveHwid, assertHwid, MAX_HWID_LENGTH } = require("./hwid.cjs");
const { LicenseError } = require("./errors.cjs");

describe("hwid (CLIENT-CONTRACT §5)", () => {
  it("is at most 128 characters and stable across calls when persisted", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "cp-hwid-"));
    const files = new Map();
    const readFile = (p) => {
      if (!files.has(p)) {
        const err = new Error("ENOENT");
        err.code = "ENOENT";
        throw err;
      }
      return files.get(p);
    };
    const writeFile = (p, data) => {
      files.set(p, String(data));
    };

    const a = resolveHwid({
      userDataDir: dir,
      platform: "linux",
      readFile: (p, enc) => (String(p).endsWith("hwid.txt") ? readFile(p) : "machine-aaa\n"),
      writeFile,
      fallbackId: "unused",
    });
    const b = resolveHwid({
      userDataDir: dir,
      platform: "linux",
      readFile: (p) => (String(p).endsWith("hwid.txt") ? readFile(p) : "machine-bbb\n"),
      writeFile,
    });

    assert.equal(a.length <= MAX_HWID_LENGTH, true);
    assert.equal(a, b);
    assert.match(a, /^[0-9a-f]{64}$/);
  });

  it("rejects hwid longer than 128 characters with the contract error", () => {
    assert.throws(
      () => assertHwid("x".repeat(129)),
      (err) => err instanceof LicenseError && err.code === "hwid_too_long" && err.detail.maxLength === 128
    );
  });

  it("does not normalize case — exact string equality is the caller's job", () => {
    assert.equal(assertHwid("Device-ABC"), "Device-ABC");
    assert.notEqual(assertHwid("Device-ABC"), "device-abc");
  });
});
