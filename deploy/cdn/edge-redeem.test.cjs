#!/usr/bin/env node
/**
 * Unit checks for deploy/cdn/edge-redeem.js (no AWS, stub fetch).
 */
"use strict";

const assert = require("node:assert/strict");
const {
  parseQuery,
  resolvePetKey,
  extractRedeemFields,
  buildRedeemUrl,
  verifyRedeem,
  handler,
} = require("./edge-redeem.js");

let pass = 0;
let fail = 0;

function ok(name) {
  pass += 1;
  console.log("ok - " + name);
}

function bad(name, err) {
  fail += 1;
  console.log("not ok - " + name);
  if (err) console.error(err);
}

async function check(name, fn) {
  try {
    await fn();
    ok(name);
  } catch (e) {
    bad(name, e);
  }
}

(async () => {
  await check("parseQuery decodes owner/jti", () => {
    const q = parseQuery("pet=red_panda&owner=steam%3Aowner&jti=j-1&exp=1&sig=abc");
    assert.equal(q.pet, "red_panda");
    assert.equal(q.owner, "steam:owner");
    assert.equal(q.jti, "j-1");
  });

  await check("resolvePetKey prefers pet= over catalog path", () => {
    assert.equal(
      resolvePetKey("/bundles/red_panda-win-1.0.0.zip", { pet: "red_panda" }),
      "red_panda"
    );
  });

  await check("resolvePetKey falls back to {petKey}.zip basename", () => {
    assert.equal(resolvePetKey("/bundles/red_panda.zip", {}), "red_panda");
  });

  await check("extractRedeemFields refuses missing sig", () => {
    const r = extractRedeemFields({
      uri: "/bundles/red_panda.zip",
      querystring: "pet=red_panda&owner=o&jti=j&exp=1",
      clientIp: "203.0.113.9",
    });
    assert.equal(r.ok, false);
    assert.equal(r.status, 403);
  });

  await check("extractRedeemFields accepts complete query", () => {
    const r = extractRedeemFields({
      uri: "/bundles/red_panda-win-1.0.0.zip",
      querystring: "pet=red_panda&owner=o&jti=j&exp=1755411300&sig=abc",
      clientIp: "203.0.113.9",
    });
    assert.equal(r.ok, true);
    assert.equal(r.petKey, "red_panda");
    assert.equal(r.clientIp, "203.0.113.9");
  });

  await check("buildRedeemUrl matches CLIENT-CONTRACT path", () => {
    const url = buildRedeemUrl("https://house.example", {
      petKey: "red_panda",
      owner: "steam:owner",
      jti: "jti-1",
      exp: "1755411300",
      sig: "sigValue",
    });
    assert.match(url, /^https:\/\/house\.example\/api\/bundles\/red_panda\/redeem\?/);
    assert.match(url, /owner=steam%3Aowner/);
    assert.match(url, /jti=jti-1/);
    assert.match(url, /exp=1755411300/);
    assert.match(url, /sig=sigValue/);
  });

  await check("verifyRedeem denies when HOUSE_API_BASE missing", async () => {
    const d = await verifyRedeem(
      {
        uri: "/bundles/red_panda.zip",
        querystring: "pet=red_panda&owner=o&jti=j&exp=1&sig=s",
        clientIp: "1.2.3.4",
      },
      { houseApiBase: "", fetchImpl: async () => ({ status: 200, json: async () => ({ allowed: true }) }) }
    );
    assert.equal(d.allow, false);
    assert.equal(d.status, 503);
  });

  await check("verifyRedeem allows when house returns allowed", async () => {
    let seenUrl = "";
    let seenXff = "";
    const d = await verifyRedeem(
      {
        uri: "/bundles/red_panda.zip",
        querystring: "pet=red_panda&owner=o&jti=j&exp=1755411300&sig=s",
        clientIp: "203.0.113.9",
      },
      {
        houseApiBase: "https://house.example",
        fetchImpl: async (url, init) => {
          seenUrl = url;
          seenXff = init.headers["X-Forwarded-For"];
          return { status: 200, json: async () => ({ allowed: true, petKey: "red_panda" }) };
        },
      }
    );
    assert.equal(d.allow, true);
    assert.match(seenUrl, /\/api\/bundles\/red_panda\/redeem\?/);
    assert.equal(seenXff, "203.0.113.9");
  });

  await check("verifyRedeem denies already-used (403)", async () => {
    const d = await verifyRedeem(
      {
        uri: "/bundles/red_panda.zip",
        querystring: "pet=red_panda&owner=o&jti=j&exp=1755411300&sig=s",
        clientIp: "203.0.113.9",
      },
      {
        houseApiBase: "https://house.example",
        fetchImpl: async () => ({ status: 403, json: async () => ({ error: "download grant already used" }) }),
      }
    );
    assert.equal(d.allow, false);
    assert.equal(d.status, 403);
  });

  await check("verifyRedeem denies invalid signature (401)", async () => {
    const d = await verifyRedeem(
      {
        uri: "/bundles/red_panda.zip",
        querystring: "pet=red_panda&owner=o&jti=j&exp=1755411300&sig=bad",
        clientIp: "203.0.113.9",
      },
      {
        houseApiBase: "https://house.example",
        fetchImpl: async () => ({ status: 401, json: async () => ({ error: "download signature invalid" }) }),
      }
    );
    assert.equal(d.allow, false);
    assert.equal(d.status, 401);
  });

  await check("verifyRedeem denies when grant store 503", async () => {
    const d = await verifyRedeem(
      {
        uri: "/bundles/red_panda.zip",
        querystring: "pet=red_panda&owner=o&jti=j&exp=1755411300&sig=s",
        clientIp: "203.0.113.9",
      },
      {
        houseApiBase: "https://house.example",
        fetchImpl: async () => ({ status: 503, json: async () => ({ error: "download grant store unavailable" }) }),
      }
    );
    assert.equal(d.allow, false);
    assert.equal(d.status, 503);
  });

  await check("verifyRedeem denies on fetch throw", async () => {
    const d = await verifyRedeem(
      {
        uri: "/bundles/red_panda.zip",
        querystring: "pet=red_panda&owner=o&jti=j&exp=1755411300&sig=s",
        clientIp: "203.0.113.9",
      },
      {
        houseApiBase: "https://house.example",
        fetchImpl: async () => {
          throw new Error("network down");
        },
      }
    );
    assert.equal(d.allow, false);
    assert.equal(d.status, 503);
  });

  await check("verifyRedeem denies 200 without allowed:true", async () => {
    const d = await verifyRedeem(
      {
        uri: "/bundles/red_panda.zip",
        querystring: "pet=red_panda&owner=o&jti=j&exp=1755411300&sig=s",
        clientIp: "203.0.113.9",
      },
      {
        houseApiBase: "https://house.example",
        fetchImpl: async () => ({ status: 200, json: async () => ({ allowed: false }) }),
      }
    );
    assert.equal(d.allow, false);
    assert.equal(d.status, 403);
  });

  await check("handler returns request when allowed", async () => {
    const prev = process.env.HOUSE_API_BASE;
    process.env.HOUSE_API_BASE = "https://house.example";
    const origFetch = globalThis.fetch;
    globalThis.fetch = async () => ({
      status: 200,
      json: async () => ({ allowed: true }),
    });
    try {
      const req = {
        uri: "/bundles/red_panda.zip",
        querystring: "pet=red_panda&owner=o&jti=j&exp=1755411300&sig=s",
        clientIp: "203.0.113.9",
      };
      const out = await handler({ Records: [{ cf: { request: req } }] });
      assert.equal(out, req);
    } finally {
      globalThis.fetch = origFetch;
      if (prev === undefined) delete process.env.HOUSE_API_BASE;
      else process.env.HOUSE_API_BASE = prev;
    }
  });

  await check("handler denies when HOUSE_API_BASE unset", async () => {
    const prev = process.env.HOUSE_API_BASE;
    delete process.env.HOUSE_API_BASE;
    try {
      const out = await handler({
        Records: [
          {
            cf: {
              request: {
                uri: "/bundles/red_panda.zip",
                querystring: "pet=red_panda&owner=o&jti=j&exp=1755411300&sig=s",
                clientIp: "203.0.113.9",
              },
            },
          },
        ],
      });
      assert.equal(out.status, "503");
      assert.match(out.body, /unavailable/);
    } finally {
      if (prev === undefined) delete process.env.HOUSE_API_BASE;
      else process.env.HOUSE_API_BASE = prev;
    }
  });

  console.log("");
  console.log(pass + " passed, " + fail + " failed");
  process.exit(fail === 0 ? 0 : 1);
})();
