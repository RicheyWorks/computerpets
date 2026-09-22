/** Desk presence is not a file API. A dropped host file is not a gift and not a place. */

export const HOUSE_FILES = ["card.json", "mind.json"] as const;

/**
 * Geolocation is not a standing grant. It opens only for one weather-button
 * locate, then closes. A browser may keep an origin grant after that click;
 * this page cannot revoke it. That cache can answer the next control use
 * without a new prompt. maximumAge 0 does not flush the grant.
 * Callers do not watch, do not re-query, and do not ask when a typed area is saved.
 */
export const WEATHER_LOCATE_MS = 120_000;

let weatherLocateUntil = 0;

export function allowNavigation(_url?: string): boolean {
  return false;
}

export function armWeatherLocate(now = Date.now()): number {
  const at = Number(now);
  const base = Number.isFinite(at) ? at : Date.now();
  weatherLocateUntil = base + WEATHER_LOCATE_MS;
  return weatherLocateUntil;
}

export function clearWeatherLocate(): void {
  weatherLocateUntil = 0;
}

export function weatherLocateOpen(now = Date.now()): boolean {
  const at = Number(now);
  const base = Number.isFinite(at) ? at : Date.now();
  return weatherLocateUntil > base;
}

export function allowPermission(permission: string, now = Date.now()): boolean {
  if (String(permission || "") !== "geolocation") return false;
  return weatherLocateOpen(now);
}

export function weatherLocateOptions(): { maximumAge: 0; timeout: number; enableHighAccuracy: false } {
  return { maximumAge: 0, timeout: WEATHER_LOCATE_MS, enableHighAccuracy: false };
}

type GeoLike = {
  getCurrentPosition: Geolocation["getCurrentPosition"];
} | null;

export type WeatherLocateHooks = {
  arm?: () => unknown;
  clear?: () => unknown;
};

function closeWeatherLocate(hooks?: WeatherLocateHooks | null): Promise<void> {
  clearWeatherLocate();
  if (!hooks || typeof hooks.clear !== "function") return Promise.resolve();
  try {
    return Promise.resolve(hooks.clear()).then(
      () => {},
      () => {},
    );
  } catch {
    return Promise.resolve();
  }
}

function requestWeatherFix(geo: GeoLike | undefined, opts: ReturnType<typeof weatherLocateOptions>): Promise<{ lat: number; lon: number } | null> {
  return new Promise((resolve) => {
    if (!geo || typeof geo.getCurrentPosition !== "function") {
      resolve(null);
      return;
    }
    let settled = false;
    const done = (value: { lat: number; lon: number } | null) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };
    try {
      geo.getCurrentPosition(
        (pos) => {
          const lat = Number(pos.coords.latitude);
          const lon = Number(pos.coords.longitude);
          done(Number.isFinite(lat) && Number.isFinite(lon) ? { lat, lon } : null);
        },
        () => done(null),
        opts,
      );
    } catch {
      done(null);
    }
  });
}

export type IpPlace = {
  id: string;
  name: string;
  query: string;
  lat: number;
  lon: number;
};

/**
 * IP place is not a location grant. There is no keeper control that asks
 * to use the network's city, so this returns nothing. A consent argument
 * does not open a lookup. Callers must not fetch a network city.
 */
export function ipPlace(..._ignored: unknown[]): IpPlace | null {
  return null;
}

/** The desk does not read a machine id. License binding is the overlay and the blotter. */
export function readMachineMark(): { read: false; raw: null; id: "" } {
  return { read: false, raw: null, id: "" };
}

/** One weather-button fix. Arms geolocation, asks once, then clears. Does not watch. Call only after the in-app Send yes. A cached origin grant can still answer that call without a new browser prompt. This does not revoke the grant. */
export function readWeatherHere(
  geo?: GeoLike,
  hooks?: WeatherLocateHooks | null,
): Promise<{ lat: number; lon: number } | null> {
  armWeatherLocate();
  let pending: Promise<unknown> = Promise.resolve();
  if (hooks && typeof hooks.arm === "function") {
    try {
      pending = Promise.resolve(hooks.arm());
    } catch (err) {
      pending = Promise.reject(err);
    }
  }
  const opts = weatherLocateOptions();
  return pending.then(() => requestWeatherFix(geo, opts)).then(
    (fix) => closeWeatherLocate(hooks).then(() => fix),
    (err) =>
      closeWeatherLocate(hooks).then(() => {
        throw err;
      }),
  );
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

/** Presence does not list a host folder. This does not touch the disk. */
export function listHostFolder(_name?: string): { listed: false; names: [] } {
  return { listed: false, names: [] };
}

/** Window glass has no title and no document name. */
export function windowCaption(_row?: object | null): null {
  return null;
}

/**
 * A host path is omitted unless the keeper has already consented.
 * There is no consent control on the desk.
 */
export function hostPathLabel(value: unknown, consent?: boolean): string {
  if (consent !== true) return "";
  if (typeof value !== "string") return "";
  return value.trim();
}

const FIELD_TAGS = new Set(["INPUT", "TEXTAREA", "SELECT"]);

type KeyTarget = {
  tagName?: string;
  tag?: string;
  isContentEditable?: boolean;
  closest?: (selector: string) => unknown;
};

type KeyEventLike = {
  key?: string;
  focused?: boolean;
  field?: boolean;
  target?: EventTarget | KeyTarget | null;
} | null;

function targetOf(event: KeyEventLike): KeyTarget | null {
  if (!event?.target || typeof event.target !== "object") return null;
  return event.target as KeyTarget;
}

function isFocusedField(event: KeyEventLike): boolean {
  if (!event || typeof event !== "object") return false;
  if (event.focused === true || event.field === true) return true;
  const target = targetOf(event);
  if (!target) return false;
  if (target.isContentEditable === true) return true;
  const tag = String(target.tagName || target.tag || "").toUpperCase();
  if (FIELD_TAGS.has(tag)) return true;
  if (typeof target.closest === "function") {
    try {
      return Boolean(target.closest("input, textarea, select, [contenteditable='true']"));
    } catch {
      return false;
    }
  }
  return false;
}

export type KeyNote = { record: false; field: boolean; toggle: false | "dismiss" };

/**
 * A key outside a focused field is not a presence log.
 * A focused field keeps the character. This does not read it.
 * Escape outside a field may dismiss a menu. The key text is not returned.
 */
function keyText(event: KeyEventLike): string {
  if (!event || typeof event !== "object" || !("key" in event)) return "";
  const value = event.key;
  return typeof value === "string" ? value : "";
}

export function classifyKey(event: KeyEventLike): KeyNote {
  if (isFocusedField(event)) return { record: false, field: true, toggle: false };
  if (keyText(event) === "Escape") return { record: false, field: false, toggle: "dismiss" };
  return { record: false, field: false, toggle: false };
}

/** Refuse a keystroke log. The buffer is not appended. The key is not returned. */
export function recordKeystroke(_buffer?: unknown, _event?: KeyEventLike): { record: false; keys: [] } {
  return { record: false, keys: [] };
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
