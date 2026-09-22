/** Desk presence is not a file API. A dropped host file is not a gift and not a place. */

export const HOUSE_FILES = ["card.json", "mind.json"] as const;

const ALLOWED_PERMISSIONS = new Set(["geolocation"]);

export function allowNavigation(_url?: string): boolean {
  return false;
}

export function allowPermission(permission: string): boolean {
  return ALLOWED_PERMISSIONS.has(String(permission || ""));
}

export function houseFile(userDataDir: string, name: string): string | null {
  if (!userDataDir || !userDataDir.trim()) return null;
  if (!HOUSE_FILES.includes(name as (typeof HOUSE_FILES)[number])) return null;
  if (name.includes("/") || name.includes("\\") || name.includes("..")) return null;
  const root = userDataDir.replace(/[/\\]+$/, "");
  return `${root}/${name}`;
}

type DropTransfer = {
  types?: Iterable<string> | ArrayLike<string> | null;
  files?: ArrayLike<unknown> | null;
  fileCount?: number;
} | null;

function typesOf(transfer: DropTransfer): string[] {
  if (!transfer || transfer.types == null) return [];
  try {
    return Array.from(transfer.types).map((t) => String(t));
  } catch {
    return [];
  }
}

/** Never read the path or the bytes. `files` means the drag is a host file. */
export function refuseFileDrop(transfer: DropTransfer): { accept: false; read: false; files: boolean } {
  const types = typesOf(transfer);
  let fileCount = 0;
  if (transfer && typeof transfer.fileCount === "number") fileCount = transfer.fileCount;
  else if (transfer && transfer.files && typeof transfer.files.length === "number") fileCount = transfer.files.length;
  const uri = types.includes("text/uri-list") || types.includes("application/x-moz-file");
  const files = fileCount > 0 || types.includes("Files") || uri;
  return { accept: false, read: false, files };
}

export function installFileDropGuard(target: EventTarget): () => void {
  const onDrag = (event: Event) => {
    const drag = event as DragEvent;
    const verdict = refuseFileDrop(drag.dataTransfer);
    if (!verdict.files) return;
    event.preventDefault();
    event.stopPropagation();
  };
  target.addEventListener("dragenter", onDrag, true);
  target.addEventListener("dragover", onDrag, true);
  target.addEventListener("drop", onDrag, true);
  return () => {
    target.removeEventListener("dragenter", onDrag, true);
    target.removeEventListener("dragover", onDrag, true);
    target.removeEventListener("drop", onDrag, true);
  };
}
