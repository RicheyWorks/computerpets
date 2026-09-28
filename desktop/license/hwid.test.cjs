"use strict";

const { describe, it, after } = require("node:test");
const assert = require("node:assert/strict");
const os = require("os");
const path = require("path");
const fs = require("fs");
const { readFileSync } = require("node:fs");
const { resolveHwid, resolveHwidDetail, peekHwid, describeMachineMarks, assertHwid, MAX_HWID_LENGTH, WEAK_FALLBACK_MESSAGE } = require("./hwid.cjs");
const { LicenseError } = require("./errors.cjs");

// Every temp folder a test makes is removed after the file runs (they used to pile up in the OS temp folder).
const madeDirs = [];
function tempDir(prefix) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  madeDirs.push(dir);
  return dir;
}
after(() => {
  for (const dir of madeDirs) fs.rmSync(dir, { recursive: true, force: true });
});

describe("hwid (CLIENT-CONTRACT §5)", () => {
  it("is at most 128 characters and stable across calls when persisted", () => {
    const dir = tempDir("cp-hwid-");
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

  it("hashes linux machine-id and does not return the raw id", () => {
    const dir = tempDir("cp-hwid-");
    const seen = [];
    const detail = resolveHwidDetail({
      userDataDir: dir,
      platform: "linux",
      readFile: (p) => {
        seen.push(String(p));
        if (String(p).endsWith("hwid.txt")) {
          const err = new Error("ENOENT");
          err.code = "ENOENT";
          throw err;
        }
        return "machine-aaa\n";
      },
      writeFile: (p, data) => {
        assert.equal(String(data).includes("machine-aaa"), false);
        fs.writeFileSync(p, data);
      },
    });
    assert.equal(detail.id, "eaa1f7bdd907e76c52b378ce67b87a05bb287933089e7adc50ca18399cbb53a4");
    assert.equal(detail.source, "etc-machine-id");
    assert.equal(detail.read, "machine");
    assert.equal(detail.raw, undefined);
    assert.equal(detail.rawLeavesMachine, false);
    assert.equal(JSON.stringify(detail).includes("machine-aaa"), false);
    const osReads = seen.filter((item) => !item.endsWith("hwid.txt"));
    assert.equal(osReads[0].endsWith("/etc/machine-id") || osReads[0] === "/etc/machine-id", true);
    assert.equal(fs.readFileSync(path.join(dir, "hwid.txt"), "utf8"), detail.id);
  });

  it("reuses a stored mark and does not read the OS id again", () => {
    const dir = tempDir("cp-hwid-");
    const file = path.join(dir, "hwid.txt");
    fs.writeFileSync(file, "legacy-device\n");
    let osReads = 0;
    const detail = resolveHwidDetail({
      userDataDir: dir,
      platform: "linux",
      readFile: (p) => {
        if (!String(p).endsWith("hwid.txt")) osReads += 1;
        return fs.readFileSync(p, "utf8");
      },
      writeFile: () => {
        throw new Error("stored mark must not be rewritten");
      },
    });
    assert.equal(osReads, 0);
    assert.equal(detail.id, "legacy-device");
    assert.equal(detail.read, "stored");
    assert.equal(detail.source, "hwid.txt");
    assert.equal(fs.readFileSync(file, "utf8"), "legacy-device\n");
  });

  it("peek does not read machine-id", () => {
    const dir = tempDir("cp-hwid-");
    const peeked = peekHwid({
      userDataDir: dir,
      readFile: (p) => {
        if (!String(p).endsWith("hwid.txt")) throw new Error("os read");
        const err = new Error("ENOENT");
        err.code = "ENOENT";
        throw err;
      },
    });
    assert.equal(peeked.read, "unread");
    assert.equal(peeked.id, "");
    const marks = describeMachineMarks("linux");
    assert.deepEqual(
      marks.slice(0, 2).map((mark) => mark.source),
      ["etc-machine-id", "dbus-machine-id"]
    );
    assert.equal(marks.some((mark) => mark.where === "/etc/machine-id"), true);
    const win = describeMachineMarks("win32").find((mark) => mark.source === "machine-guid");
    assert.equal(win.where, "HKLM\\SOFTWARE\\Microsoft\\Cryptography");
    assert.equal(win.value, "MachineGuid");
    assert.equal(describeMachineMarks("darwin").some((mark) => mark.source === "io-platform-uuid"), true);
  });

  it("refuses a computer-name or random mark until the keeper says yes", () => {
    const dir = tempDir("cp-hwid-");
    const file = path.join(dir, "hwid.txt");
    let writes = 0;
    const miss = {
      userDataDir: dir,
      platform: "win32",
      hostname: "KEEP-ME-SECRET",
      exec: () => {
        throw new Error("no registry");
      },
      readFile: () => {
        const err = new Error("ENOENT");
        err.code = "ENOENT";
        throw err;
      },
      writeFile: () => {
        writes += 1;
      },
    };
    assert.throws(
      () => resolveHwidDetail(miss),
      (err) => err instanceof LicenseError && err.code === "hwid_needs_fallback_yes" && err.message === WEAK_FALLBACK_MESSAGE
    );
    assert.equal(writes, 0);
    assert.equal(fs.existsSync(file), false);
    assert.equal(WEAK_FALLBACK_MESSAGE.includes("KEEP-ME-SECRET"), false);

    const detail = resolveHwidDetail({ ...miss, allowWeakFallback: true, writeFile: (p, data) => fs.writeFileSync(p, data) });
    assert.equal(detail.source, "hostname");
    assert.equal(detail.id, "db23d6351ce1544f7e49e1b6b54524ec310ce159e7d76bc88acfbbf431567440");
    assert.equal(JSON.stringify(detail).includes("KEEP-ME-SECRET"), false);
    assert.equal(fs.readFileSync(file, "utf8").includes("KEEP-ME-SECRET"), false);

    const blotter = resolveHwidDetail({
      ...miss,
      platform: "windows",
      allowWeakFallback: true,
      writeFile: () => {},
    });
    assert.notEqual(blotter.id, detail.id);
    assert.equal(blotter.id, "5640dd09c37971a09659282a53cc1357a58e6b3f13521a9e4e94768d39900f05");

    const again = resolveHwidDetail({
      userDataDir: dir,
      platform: "win32",
      hostname: "RENAMED",
      allowWeakFallback: false,
      exec: () => {
        throw new Error("no registry");
      },
      readFile: (p) => fs.readFileSync(p, "utf8"),
      writeFile: () => {
        throw new Error("stored mark must not be rewritten");
      },
    });
    assert.equal(again.read, "stored");
    assert.equal(again.id, detail.id);

    const randomDir = tempDir("cp-hwid-");
    assert.throws(
      () =>
        resolveHwidDetail({
          userDataDir: randomDir,
          platform: "linux",
          hostname: "",
          fallbackId: "do-not-mint",
          readFile: () => {
            const err = new Error("ENOENT");
            err.code = "ENOENT";
            throw err;
          },
          writeFile: () => {
            throw new Error("refused mark must not be written");
          },
        }),
      (err) => err instanceof LicenseError && err.code === "hwid_needs_fallback_yes"
    );
    const random = resolveHwidDetail({
      userDataDir: randomDir,
      platform: "linux",
      hostname: "",
      allowWeakFallback: true,
      readFile: () => {
        const err = new Error("ENOENT");
        err.code = "ENOENT";
        throw err;
      },
      writeFile: (p, data) => fs.writeFileSync(p, data),
    });
    assert.equal(random.source, "random");
    assert.match(random.id, /^[0-9a-f]{64}$/);
    assert.equal(fs.readFileSync(path.join(randomDir, "hwid.txt"), "utf8"), random.id);
  });

  it("queries MachineGuid with the historical registry command", () => {
    let cmd = "";
    resolveHwidDetail({
      platform: "win32",
      exec: (command) => {
        cmd = command;
        return "    MachineGuid    REG_SZ    aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee\r\n";
      },
      readFile: () => {
        const err = new Error("ENOENT");
        err.code = "ENOENT";
        throw err;
      },
      writeFile: () => {},
    });
    assert.equal(cmd, "reg query HKLM\\SOFTWARE\\Microsoft\\Cryptography /v MachineGuid");
  });

  it("names the read on the unlock screen and does not send the raw id from presence", () => {
    const settings = readFileSync(path.join(__dirname, "..", "renderer", "settings.html"), "utf8");
    const dialog = readFileSync(path.join(__dirname, "..", "..", "client", "computerpets_client", "unlock_dialog.py"), "utf8");
    for (const src of [settings, dialog]) {
      assert.match(src, /MachineGuid/);
      assert.match(src, /machine-id/);
      assert.match(src, /did not look at this computer's ID/);
      assert.match(src, /The ID itself is never sent/);
      assert.match(src, /like a fingerprint for this computer/);
      assert.match(src, /If the app cannot read that ID/);
      assert.match(src, /allowWeakFallback/);
      assert.match(src, /hwid_needs_fallback_yes/);
      assert.match(src, /Use the computer name, or a random ID if there is no name/);
    }
    // Both windows fold this detail under "Details" in whole sentences; the main
    // process and the blotter session still send WEAK_FALLBACK_MESSAGE as the error.
    for (const src of [settings, dialog]) {
      assert.match(src, /If the app cannot read that ID, Unlock stops and asks you first\./);
      assert.equal(src.includes("If that named read fails. "), false);
      assert.match(src, /SHA-256 into a code/);
      assert.match(src, /Renaming the computer changes a code made from its name\./);
      assert.match(src, /deleting hwid\.txt gives this computer a different code\./);
      assert.match(src, /Pets work without unlocking\. Unlocking is optional\./);
    }
    assert.match(settings, /If the app cannot read that ID, Unlock stops and asks you first\./);
    assert.match(settings, /scrambles the result with SHA-256 into a code/);
    assert.match(settings, /Renaming the computer changes a code made from its name\./);
    assert.match(settings, /If the code came from a random ID, deleting hwid\.txt gives this computer a different code\./);
    assert.match(dialog, /WEAK_FALLBACK_MESSAGE/);
    assert.match(settings, /status\.hwidMark/);
    assert.equal(settings.includes("status.hwid)"), false);
  });

  it("makes no real folder when the caller injects its own writer", () => {
    const dir = path.join(os.tmpdir(), `cp-hwid-nomkdir-${process.pid}-${Date.now()}`);
    const written = new Map();
    const readFile = (p) => {
      if (String(p).endsWith("hwid.txt")) {
        const err = new Error("ENOENT");
        err.code = "ENOENT";
        throw err;
      }
      return "machine-aaa\n";
    };
    const detail = resolveHwidDetail({
      userDataDir: dir,
      platform: "linux",
      readFile,
      writeFile: (p, data) => written.set(String(p), String(data)),
    });
    assert.equal(written.get(path.join(dir, "hwid.txt")), detail.id);
    assert.equal(fs.existsSync(dir), false);

    const made = [];
    resolveHwidDetail({
      userDataDir: dir,
      platform: "linux",
      readFile,
      writeFile: () => {},
      mkdir: (p, opts) => made.push([String(p), opts && opts.recursive]),
    });
    assert.deepEqual(made, [[dir, true]]);
    assert.equal(fs.existsSync(dir), false);
  });

  it("still makes the folder and writes hwid.txt when it writes to the real disk", () => {
    const base = fs.mkdtempSync(path.join(os.tmpdir(), "cp-hwid-real-"));
    const dir = path.join(base, "nested", "userData");
    try {
      const detail = resolveHwidDetail({
        userDataDir: dir,
        platform: "linux",
        readFile: (p) => (String(p).endsWith("hwid.txt") ? fs.readFileSync(p, "utf8") : "machine-aaa\n"),
      });
      assert.equal(fs.readFileSync(path.join(dir, "hwid.txt"), "utf8"), detail.id);
    } finally {
      fs.rmSync(base, { recursive: true, force: true });
    }
  });
});
