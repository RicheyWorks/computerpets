export const ADMIN_MAC_VERSION = "computerpets-admin-v1";
export const TIMESTAMP_HEADER = "X-ComputerPets-Timestamp";
export const NONCE_HEADER = "X-ComputerPets-Nonce";
export const SIGNATURE_HEADER = "X-ComputerPets-Signature";

function randomNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return base64Url(bytes);
}

function utf8(value: string): Uint8Array {
  return new TextEncoder().encode(value);
}

function asBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

function hex(bytes: Uint8Array): string {
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function base64Url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/g, "");
}

/** HMAC-SHA256 over an /api/admin request. Key is ADMIN_API_KEY (UTF-8), not a header. */
export async function signAdminRequest(parts: {
  key: string;
  method: string;
  path: string;
  query?: string;
  timestamp?: string;
  nonce?: string;
  body?: Uint8Array | string;
}): Promise<{ timestamp: string; nonce: string; signature: string }> {
  if (!parts.key) {
    throw new Error("ADMIN_API_KEY is missing");
  }
  const timestamp = parts.timestamp ?? String(Math.floor(Date.now() / 1000));
  const nonce = parts.nonce ?? randomNonce();
  if (!/^[A-Za-z0-9_-]{16,128}$/.test(nonce)) {
    throw new Error("admin nonce is not 16-128 chars of [A-Za-z0-9_-]");
  }
  const bodyBytes = typeof parts.body === "string" ? utf8(parts.body) : (parts.body ?? new Uint8Array());
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", asBuffer(bodyBytes)));
  const canonical = [
    ADMIN_MAC_VERSION,
    (parts.method || "GET").toUpperCase(),
    parts.path || "",
    parts.query || "",
    timestamp,
    nonce,
    hex(digest),
  ].join("\n");
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    asBuffer(utf8(parts.key)),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = new Uint8Array(await crypto.subtle.sign("HMAC", cryptoKey, asBuffer(utf8(canonical))));
  return { timestamp, nonce, signature: base64Url(mac) };
}
