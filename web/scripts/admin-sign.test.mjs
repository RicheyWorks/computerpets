import assert from "node:assert/strict";
import test from "node:test";
import { signAdminRequest } from "../src/lib/admin/sign.ts";

test("house ledger admin MAC matches AdminRequestSignature vector", async () => {
  const signed = await signAdminRequest({
    key: "test-admin-secret",
    method: "POST",
    path: "/api/admin/revoke",
    query: "",
    timestamp: "1700000000",
    nonce: "0123456789abcdef",
    body: '{"jti":"abc"}',
  });
  assert.equal(signed.timestamp, "1700000000");
  assert.equal(signed.nonce, "0123456789abcdef");
  assert.equal(signed.signature, "mIV045pY8c-HU1s7kMEQ2eFV02JmJQfWA_CpYl3e9pA");
});
