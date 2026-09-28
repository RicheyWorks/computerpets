import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode, type RefObject } from "react";
import { REVOKED_NOTE, focusAfterGate, formatLocalWhen, ledgerCaption, markRevoked, rereadOnce, revokeAskFocus, revokeDoneFocus, revokedListStale } from "@/lib/admin/base";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ADMIN_FALLBACK,
  ADMIN_KEY_REJECTED,
  AdminApiError,
  clearAdminSession,
  defaultApiBase,
  loadAdminSession,
  lookupLicenses,
  revokeLicense,
  unlockAdmin,
  type LicenseAudit,
} from "@/lib/admin/api";
import { plainMessage } from "@/lib/plain-error";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "License ledger — ComputerPets" },
      {
        name: "description",
        content: "Look up and revoke issued licenses. Needs the admin key.",
      },
    ],
  }),
});

function AdminPage() {
  const saved = loadAdminSession();
  const [apiBase, setApiBase] = useState(saved.apiBase || defaultApiBase());
  const [adminKey, setAdminKey] = useState(saved.adminKey);
  const [unlocked, setUnlocked] = useState(false);
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<LicenseAudit[]>([]);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [detail, setDetail] = useState<string | null>(null);
  const [pendingJti, setPendingJti] = useState<string | null>(null);
  /** After a stale-list revoke: cancel for the one scheduled re-read, and a generation so a late answer is dropped. */
  const reread = useRef<(() => void) | null>(null);
  const rereadGen = useRef(0);
  /** Focus after the gate changes: the search once unlocked, the admin key after a lock or a refused unlock. */
  const keyInput = useRef<HTMLInputElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const gateSeen = useRef(false);
  const ledgerId = useId();
  /** The row whose ask was kept (Keep or Escape): its Revoke gets focus back. */
  const keptJti = useRef<string | null>(null);
  const ledgerList = useRef<HTMLUListElement>(null);
  /** The status line; after a confirmed revoke focus moves here (revokeDoneFocus) so the result is read. */
  const statusLine = useRef<HTMLDivElement>(null);
  const statusFocus = useRef(false);

  useEffect(() => {
    if (!statusFocus.current || !note) return;
    statusFocus.current = false;
    statusLine.current?.focus();
  }, [note]);

  useEffect(() => {
    const kept = keptJti.current;
    keptJti.current = null;
    const want = revokeAskFocus(pendingJti, kept);
    const list = ledgerList.current;
    if (!want || !list) return;
    const target =
      want === "confirm"
        ? list.querySelector<HTMLElement>("[data-revoke-confirm]")
        : [...list.querySelectorAll<HTMLElement>("[data-revoke]")].find((el) => el.dataset.revoke === kept);
    target?.focus();
  }, [pendingJti]);

  function keepLicense(jti: string) {
    keptJti.current = jti;
    setPendingJti(null);
  }

  useEffect(() => {
    if (!gateSeen.current) {
      gateSeen.current = true;
      return;
    }
    (focusAfterGate(unlocked) === "search" ? searchInput : keyInput).current?.focus();
  }, [unlocked]);

  function cancelReread() {
    rereadGen.current += 1;
    reread.current?.();
    reread.current = null;
  }

  useEffect(() => cancelReread, []);

  useEffect(() => {
    if (!saved.adminKey) return;
    void openLedger(saved.apiBase, saved.adminKey);
    // session restore once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** One plain line; the service's raw text only behind the Details toggle. */
  function showError(err: unknown, fallback: string) {
    setNote(plainMessage(err, fallback));
    setDetail(err instanceof AdminApiError && err.detail ? err.detail : null);
  }

  function clearNote() {
    setNote(null);
    setDetail(null);
  }

  async function openLedger(base: string, key: string) {
    cancelReread();
    setBusy(true);
    clearNote();
    try {
      const recent = await unlockAdmin(base, key);
      setApiBase(base.trim().replace(/\/+$/, ""));
      setAdminKey(key);
      setRows(recent);
      setUnlocked(true);
    } catch (err) {
      setUnlocked(false);
      setRows([]);
      // A rejected key must not stay in this tab, or every reload retries it and shows the same refusal.
      if (err instanceof AdminApiError && err.status === 401) clearAdminSession();
      showError(err, ADMIN_FALLBACK.unlock);
      keyInput.current?.focus();
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
    cancelReread();
    setBusy(true);
    clearNote();
    try {
      const found = await lookupLicenses(apiBase, adminKey, query);
      setRows(found);
      if (found.length === 0) setNote("No licenses match.");
    } catch (err) {
      if (err instanceof AdminApiError && err.status === 401) {
        lock(ADMIN_KEY_REJECTED);
        return;
      }
      showError(err, ADMIN_FALLBACK.lookup);
    } finally {
      setBusy(false);
    }
  }

  /**
   * The one quiet re-read after a stale-list revoke. Success replaces the local mark with the ledger's
   * rows and the plain revoked note; a failure leaves the stale note as it is (no loop).
   */
  async function rereadAfterRevoke(base: string, key: string, q: string) {
    const gen = rereadGen.current;
    try {
      const next = await lookupLicenses(base, key, q);
      if (gen !== rereadGen.current) return;
      setRows(next);
      setNote(REVOKED_NOTE);
      setDetail(null);
    } catch (err) {
      if (gen !== rereadGen.current) return;
      if (err instanceof AdminApiError && err.status === 401) lock(`License revoked. ${ADMIN_KEY_REJECTED}`);
    }
  }

  async function confirmRevoke(jti: string) {
    cancelReread();
    setBusy(true);
    clearNote();
    try {
      await revokeLicense(apiBase, adminKey, jti);
    } catch (err) {
      setBusy(false);
      if (err instanceof AdminApiError && err.status === 401) {
        lock(ADMIN_KEY_REJECTED);
        return;
      }
      showError(err, ADMIN_FALLBACK.revoke);
      return;
    }
    // The ledger confirmed the revoke. From here on only the list can fail, and it must not read as a failed revoke.
    setPendingJti(null);
    try {
      const next = await lookupLicenses(apiBase, adminKey, query);
      setRows(next);
      statusFocus.current = revokeDoneFocus("revoked") === "status";
      setNote(REVOKED_NOTE);
    } catch (err) {
      if (err instanceof AdminApiError && err.status === 401) {
        lock(`License revoked. ${ADMIN_KEY_REJECTED}`);
        return;
      }
      setRows((was) => markRevoked(was, jti));
      statusFocus.current = revokeDoneFocus("stale") === "status";
      setNote(revokedListStale(plainMessage(err, "Try again in a moment.")));
      setDetail(err instanceof AdminApiError && err.detail ? err.detail : null);
      // Read the list once more shortly (or when this window gets focus back), then stop.
      const [base, key, q] = [apiBase, adminKey, query];
      reread.current = rereadOnce(() => {
        reread.current = null;
        void rereadAfterRevoke(base, key, q);
      });
    } finally {
      setBusy(false);
    }
  }

  function lock(message?: string) {
    cancelReread();
    clearAdminSession();
    setUnlocked(false);
    setRows([]);
    setPendingJti(null);
    setNote(message ?? null);
    setDetail(null);
  }

  return (
    <main className="space-y-8">
      <header className="max-w-2xl space-y-3">
        <p className="text-[11px] uppercase tracking-[0.2em] text-subtle">License ledger</p>
        <h1 className="font-display text-4xl leading-none sm:text-5xl">Look up. Revoke. Leave a mark.</h1>
        <p className="text-sm text-muted sm:text-base">
          This page needs the same admin key as the license service
          (<span className="font-mono text-fg">ADMIN_API_KEY</span>). The key stays in this tab: it signs
          each request and is never sent itself. Each row shows when a license was issued, last used,
          revoked, or marked deleted, where it came from, and which pet it unlocks. Revoking a license
          marks it deleted; its row stays on the ledger as a record.
        </p>
      </header>

      {!unlocked ? (
        <form
          onSubmit={(e) => void onUnlock(e)}
          className="max-w-xl space-y-5 rounded-[var(--radius-xl)] border border-border bg-surface p-6"
        >
          <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">Unlock</p>
          <Field
            label="License service"
            hint="The address of your ComputerPets license service. It starts from this site's settings; change it if yours runs somewhere else."
          >
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
              ref={keyInput}
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
          <Note note={note} detail={detail} />
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
                <p className="mt-1 text-sm text-muted">A license ID or an owner. Leave it empty to see the newest fifty.</p>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => lock()}>
                Lock
              </Button>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                ref={searchInput}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="License ID or owner"
                aria-label="License ID or owner"
                autoComplete="off"
                spellCheck={false}
                className="h-11 min-w-0 flex-1 rounded-[var(--radius-sm)] border border-border bg-elevated px-3 font-mono text-sm"
              />
              <Button type="submit" disabled={busy}>
                {busy ? "Looking…" : "Look up"}
              </Button>
            </div>
          </form>

          <Note note={note} detail={detail} statusRef={statusLine} />

          <h2 id={ledgerId} className="sr-only">
            {ledgerCaption(rows.length)}
          </h2>
          <ul className="space-y-3" aria-labelledby={ledgerId} ref={ledgerList}>
            {rows.map((row, i) => (
              <li
                key={row.jti}
                aria-labelledby={`${ledgerId}-jti-${i}`}
                className="space-y-4 rounded-[var(--radius-lg)] border border-border bg-surface p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">
                      {row.provider} · {row.pet}
                      {row.hwidBound ? " · one computer only" : ""}
                    </p>
                    <p id={`${ledgerId}-jti-${i}`} className="break-all font-mono text-sm text-fg">
                      <span className="sr-only">License </span>
                      {row.jti}
                    </p>
                    <p className="break-all text-sm text-muted">{row.owner}</p>
                  </div>
                  <StatusBadge row={row} />
                </div>
                <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Stamp label="Issued" value={row.issuedAt} />
                  <Stamp label="Last used" value={row.lastUsedAt} />
                  <Stamp label="Revoked" value={row.revokedAt} />
                  <Stamp label="Marked deleted" value={row.deletedAt} />
                </dl>
                {row.revoked ? null : pendingJti === row.jti ? (
                  <div
                    className="flex flex-wrap items-center gap-2"
                    role="group"
                    aria-labelledby={`${ledgerId}-ask-${i} ${ledgerId}-jti-${i}`}
                    onKeyDown={(e) => {
                      if (e.key !== "Escape") return;
                      e.preventDefault();
                      keepLicense(row.jti);
                    }}
                  >
                    <p id={`${ledgerId}-ask-${i}`} className="text-sm text-muted">
                      Downloads stop immediately.
                    </p>
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      data-revoke-confirm
                      aria-describedby={`${ledgerId}-jti-${i}`}
                      disabled={busy}
                      onClick={() => void confirmRevoke(row.jti)}
                    >
                      Confirm revoke
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => keepLicense(row.jti)}>
                      Keep
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    data-revoke={row.jti}
                    aria-describedby={`${ledgerId}-jti-${i}`}
                    disabled={busy}
                    onClick={() => setPendingJti(row.jti)}
                  >
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

/**
 * The page note, read out as a status. Raw service text stays folded behind the "Details" toggle
 * (aria-expanded / aria-controls) and is never the default view; a new detail folds it again.
 */
function Note({ note, detail, statusRef }: { note: string | null; detail: string | null; statusRef?: RefObject<HTMLDivElement | null> }) {
  const detailId = useId();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [detail]);
  if (!note) return null;
  return (
    <div className="space-y-1" role="status" ref={statusRef} tabIndex={statusRef ? -1 : undefined} data-admin-status>
      <p className="text-sm text-muted">{note}</p>
      {detail ? (
        <div className="text-xs text-subtle">
          <button
            type="button"
            className="cursor-pointer select-none underline-offset-2 hover:underline"
            aria-expanded={open}
            aria-controls={detailId}
            onClick={() => setOpen((was) => !was)}
          >
            Details
          </button>
          <p id={detailId} hidden={!open} className="mt-1 break-all font-mono">
            {detail}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] uppercase tracking-[0.16em] text-subtle">{label}</span>
      {children}
      {hint ? <span className="block text-xs text-subtle">{hint}</span> : null}
    </label>
  );
}

function Stamp({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-[0.16em] text-subtle">{label}</dt>
      <dd className="mt-1 font-mono text-xs text-muted">{value ? <When value={value} /> : "—"}</dd>
    </div>
  );
}

function StatusBadge({ row }: { row: LicenseAudit }) {
  if (row.revoked || row.deleted) return <Badge>Revoked</Badge>;
  if (row.expiresAt && Date.parse(row.expiresAt) < Date.now()) return <Badge>Expired</Badge>;
  return <Badge>Active</Badge>;
}

/** The viewer's local time; the exact ISO instant stays in the tooltip and the time element. */
function When({ value }: { value: string }) {
  const when = formatLocalWhen(value);
  return (
    <time dateTime={when.iso} title={when.iso}>
      {when.text}
    </time>
  );
}
