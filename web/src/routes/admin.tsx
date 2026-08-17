import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AdminApiError,
  clearAdminSession,
  defaultApiBase,
  listLicenses,
  loadAdminSession,
  lookupLicenses,
  revokeLicense,
  unlockAdmin,
  type LicenseAudit,
} from "@/lib/admin/api";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "License ledger — ComputerPets" },
      {
        name: "description",
        content: "Look up and revoke issued licenses. Requires the admin API key.",
      },
    ],
  }),
});

export function AdminPage() {
  const saved = loadAdminSession();
  const [apiBase, setApiBase] = useState(saved.apiBase || defaultApiBase());
  const [adminKey, setAdminKey] = useState(saved.adminKey);
  const [unlocked, setUnlocked] = useState(false);
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<LicenseAudit[]>([]);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [pendingJti, setPendingJti] = useState<string | null>(null);

  useEffect(() => {
    if (!saved.adminKey) return;
    void openLedger(saved.apiBase, saved.adminKey);
    // session restore once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function openLedger(base: string, key: string) {
    setBusy(true);
    setNote(null);
    try {
      await unlockAdmin(base, key);
      const recent = await listLicenses(base, key);
      setApiBase(base.trim().replace(/\/+$/, ""));
      setAdminKey(key);
      setRows(recent);
      setUnlocked(true);
    } catch (err) {
      setUnlocked(false);
      setRows([]);
      setNote(err instanceof Error ? err.message : "Unlock failed.");
    } finally {
      setBusy(false);
    }
  }

  async function onUnlock(e: FormEvent) {
    e.preventDefault();
    await openLedger(apiBase, adminKey);
  }

  async function onSearch(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setNote(null);
    try {
      const found = await lookupLicenses(apiBase, adminKey, query);
      setRows(found);
      if (found.length === 0) setNote("No licenses match.");
    } catch (err) {
      if (err instanceof AdminApiError && err.status === 401) {
        lock("Admin key rejected.");
        return;
      }
      setNote(err instanceof Error ? err.message : "Lookup failed.");
    } finally {
      setBusy(false);
    }
  }

  async function confirmRevoke(jti: string) {
    setBusy(true);
    setNote(null);
    try {
      await revokeLicense(apiBase, adminKey, jti);
      const next = await lookupLicenses(apiBase, adminKey, query);
      setRows(next);
      setPendingJti(null);
      setNote("License revoked. Downloads for this jti stop immediately.");
    } catch (err) {
      if (err instanceof AdminApiError && err.status === 401) {
        lock("Admin key rejected.");
        return;
      }
      setNote(err instanceof Error ? err.message : "Revoke failed.");
    } finally {
      setBusy(false);
    }
  }

  function lock(message?: string) {
    clearAdminSession();
    setUnlocked(false);
    setRows([]);
    setPendingJti(null);
    setNote(message ?? null);
  }

  return (
    <main className="space-y-8">
      <header className="max-w-2xl space-y-3">
        <p className="text-[11px] uppercase tracking-[0.2em] text-subtle">License ledger</p>
        <h1 className="font-display text-4xl leading-none sm:text-5xl">Look up. Revoke. Leave a mark.</h1>
        <p className="text-sm text-muted sm:text-base">
          Same gate as the API: <span className="font-mono text-fg">X-Admin-Key</span> /{" "}
          <span className="font-mono text-fg">ADMIN_API_KEY</span>. The key stays in this tab.
          Issued, last used, revoked, provider, and pet are on each row.
        </p>
      </header>

      {!unlocked ? (
        <form
          onSubmit={(e) => void onUnlock(e)}
          className="max-w-xl space-y-5 rounded-[var(--radius-xl)] border border-border bg-surface p-6"
        >
          <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">Unlock</p>
          <Field label="License service">
            <input
              value={apiBase}
              onChange={(e) => setApiBase(e.target.value)}
              autoComplete="off"
              spellCheck={false}
              className="h-11 w-full rounded-[var(--radius-sm)] border border-border bg-elevated px-3 font-mono text-sm"
            />
          </Field>
          <Field label="Admin key">
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              autoComplete="off"
              className="h-11 w-full rounded-[var(--radius-sm)] border border-border bg-elevated px-3 font-mono text-sm"
            />
          </Field>
          <Button type="submit" disabled={busy || !adminKey.trim()}>
            {busy ? "Opening…" : "Open the ledger"}
          </Button>
          {note ? <p className="text-sm text-muted">{note}</p> : null}
        </form>
      ) : (
        <section className="space-y-6">
          <form
            onSubmit={(e) => void onSearch(e)}
            className="space-y-4 rounded-[var(--radius-xl)] border border-border bg-surface p-5 sm:p-6"
          >
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">Find a license</p>
                <p className="mt-1 text-sm text-muted">jti or owner. Empty search shows the newest fifty.</p>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => lock()}>
                Lock
              </Button>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="jti or owner"
                autoComplete="off"
                spellCheck={false}
                className="h-11 min-w-0 flex-1 rounded-[var(--radius-sm)] border border-border bg-elevated px-3 font-mono text-sm"
              />
              <Button type="submit" disabled={busy}>
                {busy ? "Looking…" : "Look up"}
              </Button>
            </div>
          </form>

          {note ? <p className="text-sm text-muted">{note}</p> : null}

          <ul className="space-y-3">
            {rows.map((row) => (
              <li
                key={row.jti}
                className="space-y-4 rounded-[var(--radius-lg)] border border-border bg-surface p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">
                      {row.provider} · {row.pet}
                      {row.hwidBound ? " · hwid" : ""}
                    </p>
                    <p className="break-all font-mono text-sm text-fg">{row.jti}</p>
                    <p className="break-all text-sm text-muted">{row.owner}</p>
                  </div>
                  <StatusBadge row={row} />
                </div>
                <dl className="grid gap-3 sm:grid-cols-3">
                  <Stamp label="Issued" value={row.issuedAt} />
                  <Stamp label="Last used" value={row.lastUsedAt} />
                  <Stamp label="Revoked" value={row.revokedAt} />
                </dl>
                {row.revoked ? null : pendingJti === row.jti ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm text-muted">Downloads stop immediately.</p>
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      disabled={busy}
                      onClick={() => void confirmRevoke(row.jti)}
                    >
                      Confirm revoke
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setPendingJti(null)}>
                      Keep
                    </Button>
                  </div>
                ) : (
                  <Button type="button" variant="danger" size="sm" disabled={busy} onClick={() => setPendingJti(row.jti)}>
                    Revoke
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] uppercase tracking-[0.16em] text-subtle">{label}</span>
      {children}
    </label>
  );
}

function Stamp({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-[0.16em] text-subtle">{label}</dt>
      <dd className="mt-1 font-mono text-xs text-muted">{value ? formatWhen(value) : "—"}</dd>
    </div>
  );
}

function StatusBadge({ row }: { row: LicenseAudit }) {
  if (row.revoked) return <Badge>Revoked</Badge>;
  if (row.expiresAt && Date.parse(row.expiresAt) < Date.now()) return <Badge>Expired</Badge>;
  return <Badge>Active</Badge>;
}

function formatWhen(value: string): string {
  const ms = Date.parse(value);
  if (Number.isNaN(ms)) return value;
  return new Date(ms).toISOString().replace(".000Z", "Z");
}
