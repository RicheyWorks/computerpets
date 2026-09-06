"use strict";

/**
 * TEST ONLY. A clearly-named stand-in for the house backend.
 * Speaks the published verify / download / signed-URL contract.
 * Not required by the overlay.
 */

const crypto = require("crypto");
const { signDownloadMac, downloadMacMessage } = require("./signed-url.cjs");

function encryptLicense(payload, secretB64) {
  const key = Buffer.from(secretB64, "base64");
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv, { authTagLength: 16 });
  const pt = Buffer.from(JSON.stringify(payload), "utf8");
  const packed = Buffer.concat([cipher.update(pt), cipher.final(), cipher.getAuthTag()]);
  return {
    ciphertext: packed.toString("base64"),
    iv: iv.toString("base64"),
    expiresAt: payload.validUntil,
  };
}

function json(status, body, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

/**
 * @param {{
 *   licenseSecret: string,
 *   signingKey?: string,
 *   revokedJtis?: Set<string>,
 *   denySteamIds?: string[],
 *   cdnBytes?: Buffer,
 * }} cfg
 */
function createContractTestDouble(cfg) {
  const issued = new Map();
  const revoked = cfg.revokedJtis || new Set();
  const deny = new Set(cfg.denySteamIds || []);
  const signingKey = cfg.signingKey || "test-bundle-signing-key-not-a-placeholder";
  const calls = [];

  async function fetchImpl(url, init = {}) {
    const u = new URL(url);
    const method = (init.method || "GET").toUpperCase();
    let body = {};
    if (init.body && typeof init.body === "string") {
      try {
        body = JSON.parse(init.body);
      } catch {
        body = {};
      }
    }
    calls.push({ method, path: u.pathname, query: u.search, body, headers: init.headers || {} });

    if (method === "POST" && /^\/api\/verify\/([^/]+)$/.test(u.pathname)) {
      const provider = u.pathname.split("/").pop();
      if (provider !== "steam") {
        return json(404, { error: "unknown provider", provider, validProviders: "steam" });
      }
      if (!body.steamId || !body.appId) {
        return json(403, { error: "steamId and appId are required", provider: "steam" });
      }
      if (typeof body.hwid === "string" && body.hwid.length > 128) {
        return json(400, { error: "hwid too long", maxLength: 128 });
      }
      if (deny.has(body.steamId)) {
        return json(403, { error: "ownership not verified", provider: "steam" });
      }
      const now = new Date();
      const validUntil = new Date(now.getTime() + 365 * 86400 * 1000);
      const jti = crypto.randomUUID();
      const pet = body.petType && String(body.petType).trim() ? body.petType.trim() : "red_panda";
      const hwid = body.hwid && String(body.hwid).trim() ? body.hwid : null;
      const payload = {
        jti,
        owner: body.steamId,
        pet,
        validUntil: validUntil.toISOString(),
        issuedAt: now.toISOString(),
        hwid,
      };
      const license = encryptLicense(payload, cfg.licenseSecret);
      issued.set(jti, { payload, license, provider: "steam" });
      return json(200, {
        status: "success",
        provider: "steam",
        license,
        auth: {
          token: `test.${jti}`,
          tokenType: "Bearer",
          expiresInSeconds: 1800,
          expiresAt: new Date(now.getTime() + 1800 * 1000).toISOString(),
        },
        pet: { key: pet, displayName: "Red Panda" },
        message: "Steam ownership verified. License issued.",
      });
    }

    if (method === "POST" && /^\/api\/download\/([^/]+)$/.test(u.pathname)) {
      const petKey = decodeURIComponent(u.pathname.split("/").pop());
      const auth = init.headers.Authorization || init.headers.authorization || "";
      if (!String(auth).startsWith("Bearer ")) {
        return json(401, { error: "missing bearer" });
      }
      const token = String(auth).slice("Bearer ".length);
      const jtiFromToken = token.startsWith("test.") ? token.slice(5) : null;
      const record = jtiFromToken ? issued.get(jtiFromToken) : null;
      if (!record) {
        return json(401, { error: "license missing, expired, or tampered" });
      }
      if (revoked.has(record.payload.jti)) {
        return json(401, { error: "license missing, expired, or tampered" });
      }
      if (body.ciphertext !== record.license.ciphertext || body.iv !== record.license.iv) {
        return json(401, { error: "license missing, expired, or tampered" });
      }
      if (record.payload.pet !== petKey) {
        return json(403, { error: "license is not valid for the requested pet" });
      }
      if (record.payload.hwid) {
        if (body.hwid !== record.payload.hwid) {
          return json(403, { error: "hardware binding mismatch", hint: "This license is bound to a specific device" });
        }
      }
      const exp = Math.floor(Date.now() / 1000) + 900;
      const message = downloadMacMessage({
        petKey,
        owner: record.payload.owner,
        jti: record.payload.jti,
        exp,
      });
      const sig = signDownloadMac(message, signingKey);
      const downloadUrl =
        `https://cdn.enterprisepet.example/bundles/${petKey}.zip` +
        `?owner=${encodeURIComponent(record.payload.owner)}` +
        `&jti=${encodeURIComponent(record.payload.jti)}` +
        `&exp=${exp}&sig=${sig}`;
      return json(200, {
        petKey,
        displayName: "Red Panda",
        rarity: "COMMON",
        downloadUrl,
        expiresAt: new Date(exp * 1000).toISOString(),
        ttlSeconds: 900,
        jti: record.payload.jti,
      });
    }

    if (method === "GET" && u.hostname === "cdn.enterprisepet.example") {
      return new Response(cfg.cdnBytes || Buffer.from("PK\u0003\u0004fake-zip"), {
        status: 200,
        headers: { "Content-Type": "application/zip" },
      });
    }

    return json(404, { error: "not found" });
  }

  return { fetchImpl, calls, issued, revoked, encryptLicense };
}

module.exports = { createContractTestDouble, encryptLicense };
