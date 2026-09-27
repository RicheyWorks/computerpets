import { signAdminRequest, NONCE_HEADER, SIGNATURE_HEADER, TIMESTAMP_HEADER } from "@/lib/admin/sign";
import { HouseError, PLAIN_LINES } from "@/lib/plain-error";
import { NOT_LICENSE_SERVICE, isLicenseList, pickApiBase } from "@/lib/admin/base";

const KEY_STORAGE = "cp.admin.key";
const BASE_STORAGE = "cp.admin.apiBase";

export type LicenseAudit = {
  jti: string;
  owner: string;
  pet: string;
  provider: string;
  issuedAt: string | null;
  expiresAt: string | null;
  lastUsedAt: string | null;
  revokedAt: string | null;
  deletedAt: string | null;
  revoked: boolean;
  deleted: boolean;
  hwidBound: boolean;
};

/**
 * A license-service failure. `message` is always a plain line written here;
 * the service's own body text (if any) rides in `detail`, which the admin page
 * only shows behind a "Details" toggle.
 */
export class AdminApiError extends HouseError {
  status: number;
  detail: string;
  constructor(status: number, message: string, detail = "") {
    super(message);
    this.status = status;
    this.detail = detail;
  }
}

/** A 401: the key is wrong, or this computer's clock is far enough off that the signature is stale. */
export const ADMIN_KEY_REJECTED =
  "The license service did not accept this admin key. Check the key and this computer's clock, then try again.";

/** The plain line for a failed license-service answer. */
export function adminStatusLine(status: number, fallback: string): string {
  if (status === 429) return PLAIN_LINES.busy;
  if (status >= 500) return `The license service had a problem (error ${status}). Try again later.`;
  return fallback;
}

export function loadAdminSession(): { apiBase: string; adminKey: string } {
  if (typeof sessionStorage === "undefined") {
    return { apiBase: defaultApiBase(), adminKey: "" };
  }
  return {
    apiBase: sessionStorage.getItem(BASE_STORAGE) || defaultApiBase(),
    adminKey: sessionStorage.getItem(KEY_STORAGE) || "",
  };
}

export function saveAdminSession(apiBase: string, adminKey: string) {
  sessionStorage.setItem(BASE_STORAGE, apiBase.trim().replace(/\/+$/, ""));
  sessionStorage.setItem(KEY_STORAGE, adminKey);
}

export function clearAdminSession() {
  sessionStorage.removeItem(KEY_STORAGE);
}

/**
 * Where the License service field starts: VITE_LICENSE_API_URL when set, else this site's own origin,
 * else (only when the page itself is local) the Java service on this computer. See pickApiBase.
 */
export function defaultApiBase(): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return pickApiBase(import.meta.env.VITE_LICENSE_API_URL, origin);
}

function splitTarget(path: string): { path: string; query: string } {
  const q = path.indexOf("?");
  if (q < 0) return { path, query: "" };
  return { path: path.slice(0, q), query: path.slice(q + 1) };
}

function resolve(apiBase: string, path: string): string {
  const base = apiBase.trim().replace(/\/+$/, "") || defaultApiBase();
  return `${base}${path}`;
}

/** The service's raw body text, kept for the Details toggle and the console. */
async function readDetail(res: Response): Promise<string> {
  try {
    const text = (await res.text()).trim();
    if (!text) return "";
    try {
      const body = JSON.parse(text) as { error?: unknown; reason?: unknown; detail?: unknown };
      for (const v of [body.detail, body.error, body.reason]) {
        if (typeof v === "string" && v.trim()) return v.trim().slice(0, 300);
      }
    } catch {
      // not JSON; fall through to the raw text
    }
    return text.slice(0, 300);
  } catch {
    return "";
  }
}

async function failure(res: Response, fallback: string): Promise<AdminApiError> {
  const detail = await readDetail(res);
  if (detail) console.error(`[admin] license service ${res.status}:`, detail);
  return new AdminApiError(res.status, adminStatusLine(res.status, fallback), detail);
}

async function adminFetch(apiBase: string, adminKey: string, path: string, init?: RequestInit): Promise<Response> {
  if (init?.body != null && typeof init.body !== "string") {
    throw new AdminApiError(0, "Admin request body must be the exact string that was signed.");
  }
  const method = (init?.method ?? "GET").toUpperCase();
  const target = splitTarget(path);
  const body = typeof init?.body === "string" ? init.body : "";
  const signed = await signAdminRequest({
    key: adminKey,
    method,
    path: target.path,
    query: target.query,
    body,
  });
  let res: Response;
  try {
    res = await fetch(resolve(apiBase, path), {
      ...init,
      headers: {
        "Content-Type": "application/json",
        [TIMESTAMP_HEADER]: signed.timestamp,
        [NONCE_HEADER]: signed.nonce,
        [SIGNATURE_HEADER]: signed.signature,
        ...(init?.headers ?? {}),
      },
    });
  } catch (err) {
    console.error("[admin] license service unreachable:", err);
    throw new AdminApiError(0, "Cannot reach the license service. Check the API URL.");
  }
  if (res.status === 401) {
    throw await failure(res, ADMIN_KEY_REJECTED);
  }
  return res;
}

/**
 * Open the ledger: a signed read of the newest licenses. Only a real license list counts. A 404, or an
 * answer that is not a license list (a web page, another service), means the address is not the
 * ComputerPets license service, and nothing is saved. Returns the rows so the page shows them at once.
 */
export async function unlockAdmin(apiBase: string, adminKey: string): Promise<LicenseAudit[]> {
  const res = await adminFetch(apiBase, adminKey, "/api/admin/licenses");
  if (res.status === 404) throw await failure(res, NOT_LICENSE_SERVICE);
  if (!res.ok) throw await failure(res, "Unlock failed.");
  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }
  if (!isLicenseList(body)) {
    console.error("[admin] the address answered with something that is not a license list");
    throw new AdminApiError(res.status, NOT_LICENSE_SERVICE);
  }
  saveAdminSession(apiBase, adminKey);
  return body as LicenseAudit[];
}

export async function getLicense(apiBase: string, adminKey: string, jti: string): Promise<LicenseAudit | null> {
  const res = await adminFetch(apiBase, adminKey, `/api/admin/licenses/${encodeURIComponent(jti)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw await failure(res, "Lookup failed.");
  return (await res.json()) as LicenseAudit;
}

export async function listLicenses(
  apiBase: string,
  adminKey: string,
  owner?: string,
): Promise<LicenseAudit[]> {
  const path = owner
    ? `/api/admin/licenses?owner=${encodeURIComponent(owner)}`
    : "/api/admin/licenses";
  const res = await adminFetch(apiBase, adminKey, path);
  if (!res.ok) throw await failure(res, "Lookup failed.");
  return (await res.json()) as LicenseAudit[];
}

export async function lookupLicenses(
  apiBase: string,
  adminKey: string,
  query: string,
): Promise<LicenseAudit[]> {
  const q = query.trim();
  if (!q) return listLicenses(apiBase, adminKey);
  const byJti = await getLicense(apiBase, adminKey, q);
  if (byJti) return [byJti];
  return listLicenses(apiBase, adminKey, q);
}

export async function revokeLicense(apiBase: string, adminKey: string, jti: string): Promise<void> {
  const res = await adminFetch(apiBase, adminKey, "/api/admin/revoke", {
    method: "POST",
    body: JSON.stringify({ jti }),
  });
  if (res.status === 404) {
    throw await failure(res, "Not found or already revoked.");
  }
  if (!res.ok) throw await failure(res, "Revoke failed.");
}
