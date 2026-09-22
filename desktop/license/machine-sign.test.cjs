"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { signMachineRequest, TIMESTAMP_HEADER, SIGNATURE_HEADER } = require("./machine-sign.cjs");

describe("machine verify signature", () => {
  it("matches the house vector", () => {
    const signed = signMachineRequest({
      key: "test-license-secret",
      method: "POST",
      path: "/api/verify/steam",
      query: "",
      timestamp: "1700000000",
      body: Buffer.from('{"petType":"red_panda"}', "utf8"),
    });
    assert.equal(signed.signature, "aQnHDFNgA6mc5FUEYEc3XsqmUFRtefDA_KfiCluM47E");
    assert.equal(signed.headers[TIMESTAMP_HEADER], "1700000000");
    assert.equal(signed.headers[SIGNATURE_HEADER], signed.signature);
  });

  it("fails closed without the license key", () => {
    assert.throws(
      () => signMachineRequest({ key: "", path: "/api/verify/steam", body: Buffer.alloc(0) }),
      (err) => err.code === "missing_secret"
    );
  });
});
