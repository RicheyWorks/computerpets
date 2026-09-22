"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const zlib = require("zlib");
const {
  FORMAT,
  MANIFEST_NAME,
  sha256Hex,
  alreadyCurrent,
  acceptBundleBytes,
} = require("./bundle-zip.cjs");

function storeZip(members) {
  const parts = [];
  const central = [];
  let offset = 0;
  for (const [name, body] of Object.entries(members)) {
    const nameBuf = Buffer.from(name, "utf8");
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0, 6);
    local.writeUInt16LE(0, 8); // store
    local.writeUInt16LE(0, 10);
    local.writeUInt16LE(0, 12);
    local.writeUInt32LE(0, 14);
    local.writeUInt32LE(body.length, 18);
    local.writeUInt32LE(body.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    local.writeUInt16LE(0, 28);
    const localFull = Buffer.concat([local, nameBuf, body]);
    parts.push(localFull);

    const cen = Buffer.alloc(46);
    cen.writeUInt32LE(0x02014b50, 0);
    cen.writeUInt16LE(20, 4);
    cen.writeUInt16LE(20, 6);
    cen.writeUInt16LE(0, 8);
    cen.writeUInt16LE(0, 10);
    cen.writeUInt16LE(0, 12);
    cen.writeUInt16LE(0, 14);
    cen.writeUInt32LE(0, 16);
    cen.writeUInt32LE(body.length, 20);
    cen.writeUInt32LE(body.length, 24);
    cen.writeUInt16LE(nameBuf.length, 28);
    cen.writeUInt16LE(0, 30);
    cen.writeUInt16LE(0, 32);
    cen.writeUInt16LE(0, 34);
    cen.writeUInt16LE(0, 36);
    cen.writeUInt32LE(0, 38);
    cen.writeUInt32LE(offset, 42);
    central.push(Buffer.concat([cen, nameBuf]));
    offset += localFull.length;
  }
  const centralBuf = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(Object.keys(members).length, 8);
  end.writeUInt16LE(Object.keys(members).length, 10);
  end.writeUInt32LE(centralBuf.length, 12);
  end.writeUInt32LE(offset, 16);
  end.writeUInt16LE(0, 20);
  return Buffer.concat([...parts, centralBuf, end]);
}

function goodZip(petKey = "red_panda", version = "1.0.0", platform = "win") {
  const sprite = Buffer.from([1, 2, 3, 4, 5]);
  const manifest = Buffer.from(
    JSON.stringify({
      format: FORMAT,
      petKey,
      version,
      platform,
      files: [{ path: "sprites/sit/1.png", sha256: sha256Hex(sprite) }],
    }),
    "utf8"
  );
  const bytes = storeZip({
    [MANIFEST_NAME]: manifest,
    "sprites/sit/1.png": sprite,
  });
  return { bytes, sha256: sha256Hex(bytes) };
}

describe("bundle-zip", () => {
  it("empty expectation stays opaque", () => {
    const decision = acceptBundleBytes(Buffer.from([1, 2, 3]), {});
    assert.equal(decision.action, "opaque");
    assert.equal(decision.accepted, true);
  });

  it("version without sha256 refuses", () => {
    const decision = acceptBundleBytes(Buffer.from([1]), {
      petKey: "red_panda",
      version: "1.0.0",
      platform: "win",
    });
    assert.equal(decision.error, "bundle_sha256_missing");
  });

  it("sha256 mismatch refuses", () => {
    const zip = goodZip();
    const decision = acceptBundleBytes(zip.bytes, {
      petKey: "red_panda",
      version: "1.0.0",
      platform: "win",
      sha256: "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
    });
    assert.equal(decision.error, "bundle_sha256_mismatch");
  });

  it("valid zip installs", () => {
    const zip = goodZip();
    const decision = acceptBundleBytes(zip.bytes, {
      petKey: "red_panda",
      version: "1.0.0",
      platform: "win",
      sha256: zip.sha256,
    });
    assert.equal(decision.action, "install");
    assert.equal(decision.accepted, true);
    assert.equal(decision.memberCount, 1);
  });

  it("matching local is current and alreadyCurrent", () => {
    const zip = goodZip();
    const expect = {
      petKey: "red_panda",
      version: "1.0.0",
      platform: "win",
      sha256: zip.sha256,
      local: {
        petKey: "red_panda",
        version: "1.0.0",
        platform: "win",
        sha256: zip.sha256,
      },
    };
    assert.equal(alreadyCurrent(expect), true);
    assert.equal(acceptBundleBytes(zip.bytes, expect).action, "current");
  });

  it("missing manifest refuses", () => {
    const bytes = storeZip({ "sprites/sit/1.png": Buffer.from([1, 2, 3, 4]) });
    const decision = acceptBundleBytes(bytes, {
      petKey: "red_panda",
      version: "1.0.0",
      platform: "win",
      sha256: sha256Hex(bytes),
    });
    assert.equal(decision.error, "bundle_zip_invalid");
  });

  it("deflated member still verifies", () => {
    const sprite = Buffer.from([9, 8, 7, 6, 5, 4, 3, 2, 1]);
    const manifest = Buffer.from(
      JSON.stringify({
        format: FORMAT,
        petKey: "red_panda",
        version: "1.0.0",
        platform: "win",
        files: [{ path: "sprites/sit/1.png", sha256: sha256Hex(sprite) }],
      }),
      "utf8"
    );
    const compressed = zlib.deflateRawSync(sprite);
    // Build a single deflated local header zip by hand for the sprite; store for manifest.
    const name = "sprites/sit/1.png";
    const nameBuf = Buffer.from(name, "utf8");
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0, 6);
    local.writeUInt16LE(8, 8); // deflate
    local.writeUInt32LE(compressed.length, 18);
    local.writeUInt32LE(sprite.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    const spriteLocal = Buffer.concat([local, nameBuf, compressed]);

    const manName = Buffer.from(MANIFEST_NAME, "utf8");
    const manLocal = Buffer.alloc(30);
    manLocal.writeUInt32LE(0x04034b50, 0);
    manLocal.writeUInt16LE(20, 4);
    manLocal.writeUInt16LE(0, 8);
    manLocal.writeUInt32LE(manifest.length, 18);
    manLocal.writeUInt32LE(manifest.length, 22);
    manLocal.writeUInt16LE(manName.length, 26);
    const manPart = Buffer.concat([manLocal, manName, manifest]);

    const offsetMan = 0;
    const offsetSprite = manPart.length;
    function central(nameStr, bodyLen, compLen, method, off) {
      const n = Buffer.from(nameStr, "utf8");
      const cen = Buffer.alloc(46);
      cen.writeUInt32LE(0x02014b50, 0);
      cen.writeUInt16LE(20, 4);
      cen.writeUInt16LE(20, 6);
      cen.writeUInt16LE(method, 10);
      cen.writeUInt32LE(compLen, 20);
      cen.writeUInt32LE(bodyLen, 24);
      cen.writeUInt16LE(n.length, 28);
      cen.writeUInt32LE(off, 42);
      return Buffer.concat([cen, n]);
    }
    const centralBuf = Buffer.concat([
      central(MANIFEST_NAME, manifest.length, manifest.length, 0, offsetMan),
      central(name, sprite.length, compressed.length, 8, offsetSprite),
    ]);
    const end = Buffer.alloc(22);
    end.writeUInt32LE(0x06054b50, 0);
    end.writeUInt16LE(2, 8);
    end.writeUInt16LE(2, 10);
    end.writeUInt32LE(centralBuf.length, 12);
    end.writeUInt32LE(manPart.length + spriteLocal.length, 16);
    const bytes = Buffer.concat([manPart, spriteLocal, centralBuf, end]);
    const decision = acceptBundleBytes(bytes, {
      petKey: "red_panda",
      version: "1.0.0",
      platform: "win",
      sha256: sha256Hex(bytes),
    });
    assert.equal(decision.action, "install");
  });
});
