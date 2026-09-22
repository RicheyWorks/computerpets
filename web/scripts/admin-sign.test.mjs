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
    body: '{"jti":"abc"}',
  });
  assert.equal(signed.timestamp, "1700000000");
  assert.equal(signed.signature, "-VMFZenWBOFRVfYpmAGRHN-njILBKegCBerR6B3RnE0");
});
