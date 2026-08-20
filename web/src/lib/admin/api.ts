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
  revoked: boolean;
  hwidBound: boolean;
};

export class AdminApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
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

export function defaultApiBase(): string {
  // Java house door. The desk keeps 8080.
  return "http://localhost:8081";
}

function headers(adminKey: string): HeadersInit {
  return {
    "X-Admin-Key": adminKey,
    "Content-Type": "application/json",
  };
}

function resolve(apiBase: string, path: string): string {
  const base = apiBase.trim().replace(/\/+$/, "") || defaultApiBase();
  return `${base}${path}`;
}

async function readError(res: Response, fallback: string): Promise<string> {
  try {
    const body = (await res.json()) as { error?: string; reason?: string };
    return body.error || body.reason || fallback;
  } catch {
    return fallback;
  }
}

async function adminFetch(apiBase: string, adminKey: string, path: string, init?: RequestInit): Promise<Response> {
  let res: Response;
  try {
    res = await fetch(resolve(apiBase, path), {
      ...init,
      headers: { ...headers(adminKey), ...(init?.headers ?? {}) },
    });
  } catch {
    throw new AdminApiError(0, "Cannot reach the license service. Check the API URL.");
  }
  if (res.status === 401) {
    throw new AdminApiError(401, "Admin key rejected.");
  }
  return res;
}

export async function unlockAdmin(apiBase: string, adminKey: string): Promise<void> {
  const res = await adminFetch(apiBase, adminKey, "/api/admin/licenses/__unlock-check__");
  if (res.status !== 404 && !res.ok) {
    throw new AdminApiError(res.status, await readError(res, "Unlock failed."));
  }
  saveAdminSession(apiBase, adminKey);
}

export async function getLicense(apiBase: string, adminKey: string, jti: string): Promise<LicenseAudit | null> {
  const res = await adminFetch(apiBase, adminKey, `/api/admin/licenses/${encodeURIComponent(jti)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new AdminApiError(res.status, await readError(res, "Lookup failed."));
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
  if (!res.ok) throw new AdminApiError(res.status, await readError(res, "Lookup failed."));
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
    throw new AdminApiError(404, await readError(res, "Not found or already revoked."));
  }
  if (!res.ok) throw new AdminApiError(res.status, await readError(res, "Revoke failed."));
}
