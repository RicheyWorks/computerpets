"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { signMachineRequest, NONCE_HEADER, TIMESTAMP_HEADER, SIGNATURE_HEADER } = require("./machine-sign.cjs");

describe("machine verify signature", () => {
  it("matches the house vector", () => {
    const signed = signMachineRequest({
      key: "test-license-secret",
      method: "POST",
      path: "/api/verify/steam",
      query: "",
      timestamp: "1700000000",
      nonce: "0123456789abcdef",
      body: Buffer.from('{"petType":"red_panda"}', "utf8"),
    });
    assert.equal(signed.signature, "8na55WUBS507nkCWT83Goq-Cec4o1FpXeweNUm26UqU");
    assert.equal(signed.nonce, "0123456789abcdef");
    assert.equal(signed.headers[TIMESTAMP_HEADER], "1700000000");
    assert.equal(signed.headers[NONCE_HEADER], "0123456789abcdef");
    assert.equal(signed.headers[SIGNATURE_HEADER], signed.signature);
  });

  it("fails closed without the license key", () => {
    assert.throws(
      () => signMachineRequest({ key: "", path: "/api/verify/steam", body: Buffer.alloc(0) }),
      (err) => err.code === "missing_secret"
    );
  });
});
