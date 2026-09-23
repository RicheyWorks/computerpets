/** Desktop-local GPU sense. The browser has no sensor, so this page stays unread and the sparkline stays empty. Windows and Linux nvidia-smi share the line. Linux amdgpu sysfs uses that line when nvidia-smi does not, including hwmon temperature labeled edge and power labeled PPT. i915 and xe utilization comes from two DRM fdinfo reads when that percent is honest; otherwise INTEL_EMPTY. Mac reads IOAccelerator into that same line. */

export const STALE_MS = 20000;
export const LATER_DOOR = "unsupported";

const SOURCES = ["nvidia-smi", "pdh", "nvidia-smi+pdh", "ioaccelerator", "amdgpu", "fdinfo"] as const;
const METRIC_KEYS = ["tempC", "utilPercent", "memoryUsedBytes", "memoryTotalBytes", "powerWatts"] as const;

export type GpuSource = (typeof SOURCES)[number];
export type GpuStatus = "read" | "unread" | "unsupported" | "malformed" | "stale";

export type GpuSample = {
  status: GpuStatus;
  platform: string | null;
  name: string | null;
  source: GpuSource | null;
  index: number | null;
  tempC: number | null;
  utilPercent: number | null;
  memoryUsedBytes: number | null;
  memoryTotalBytes: number | null;
  powerWatts: number | null;
  readAtMs: number | null;
  reason: string | null;
};

type MetricKey = (typeof METRIC_KEYS)[number];
type Token = { state: "missing" | "bad" | "ok"; value: number | null };
type NvidiaRow = {
  index: number;
  name: string | null;
  tempC: number | null;
  utilPercent: number | null;
  memoryUsedBytes: number | null;
  memoryTotalBytes: number | null;
  powerWatts: number | null;
  bad: boolean;
};

export function sensesOn(platform: string | null | undefined) {
  return platform === "win32" || /^Win/i.test(String(platform || "")) || isLinux(platform) || isMac(platform);
}

export function isMac(platform: string | null | undefined) {
  return platform === "darwin" || /^Mac/i.test(String(platform || ""));
}

export function isLinux(platform: string | null | undefined) {
  return platform === "linux" || /^Linux/i.test(String(platform || ""));
}

export function laterDoor(platform: string | null | undefined) {
  if (sensesOn(platform)) return null;
  return LATER_DOOR;
}

function round1(n: number) {
  return Math.floor(n * 10 + 0.5) / 10;
}

function roundInt(n: number) {
  return Math.floor(n + 0.5);
}

function stamp(readAtMs: unknown) {
  return typeof readAtMs === "number" && Number.isFinite(readAtMs) ? readAtMs : null;
}

function blank(status: GpuStatus, reason: string, platform: string | null, readAtMs: number | null): GpuSample {
  return {
    status,
    platform: platform || null,
    name: null,
    source: null,
    index: null,
    tempC: null,
    utilPercent: null,
    memoryUsedBytes: null,
    memoryTotalBytes: null,
    powerWatts: null,
    readAtMs: stamp(readAtMs),
    reason: reason || status,
  };
}

export const UNREAD_GPU: GpuSample = blank("unread", "missing", null, null);

function finiteIn(value: unknown, min: number, max: number) {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  if (value < min || value > max) return null;
  return value;
}

function cleanName(value: unknown) {
  if (typeof value !== "string") return null;
  const name = value.trim();
  return name || null;
}

function cleanSource(value: unknown): GpuSource | null {
  return SOURCES.includes(value as GpuSource) ? (value as GpuSource) : null;
}

function cleanIndex(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return null;
  if (Math.floor(value) !== value) return null;
  return value;
}

function metricsFrom(raw: Record<string, unknown>) {
  const offered = METRIC_KEYS.some((key) => raw[key] != null);
  const temp = finiteIn(raw.tempC, -40, 125);
  const util = finiteIn(raw.utilPercent, 0, 100);
  let used = finiteIn(raw.memoryUsedBytes, 0, 2 ** 48);
  let total = finiteIn(raw.memoryTotalBytes, 0, 2 ** 48);
  const power = finiteIn(raw.powerWatts, 0, 2000);
  if (used != null && total != null && used > total) {
    used = null;
    total = null;
  }
  const metrics = {
    tempC: temp == null ? null : round1(temp),
    utilPercent: util == null ? null : round1(util),
    memoryUsedBytes: used == null ? null : roundInt(used),
    memoryTotalBytes: total == null ? null : roundInt(total),
    powerWatts: power == null ? null : round1(power),
  };
  const any = METRIC_KEYS.some((key) => metrics[key] != null);
  return { metrics, any, offered };
}

export function parseSample(raw: unknown): GpuSample {
  if (raw == null) return blank("unread", "missing", null, null);
  if (typeof raw !== "object" || Array.isArray(raw)) return blank("malformed", "malformed", null, null);
  const row = raw as Record<string, unknown>;
  const platform = typeof row.platform === "string" && row.platform ? row.platform : null;
  const readAtMs = stamp(row.readAtMs);
  if (platform && !sensesOn(platform)) return blank("unsupported", LATER_DOOR, platform, readAtMs);
  if (row.status === "unsupported") return blank("unsupported", LATER_DOOR, platform, readAtMs);
  if (row.status === "malformed") return blank("malformed", "malformed", platform, readAtMs);
  if (row.status === "stale") return blank("stale", "stale", platform, readAtMs);
  if (row.status === "unread") {
    const reason = typeof row.reason === "string" && row.reason ? row.reason : "missing";
    return blank("unread", reason, platform, readAtMs);
  }
  const picked = metricsFrom(row);
  if (!picked.any) {
    return blank(picked.offered ? "malformed" : "unread", picked.offered ? "malformed" : "missing", platform, readAtMs);
  }
  if (readAtMs == null) return blank("malformed", "malformed", platform, null);
  return {
    status: "read",
    platform,
    name: cleanName(row.name),
    source: cleanSource(row.source),
    index: cleanIndex(row.index),
    tempC: picked.metrics.tempC,
    utilPercent: picked.metrics.utilPercent,
    memoryUsedBytes: picked.metrics.memoryUsedBytes,
    memoryTotalBytes: picked.metrics.memoryTotalBytes,
    powerWatts: picked.metrics.powerWatts,
    readAtMs,
    reason: null,
  };
}

export function present(sample: unknown, nowMs: number): GpuSample {
  const clean = parseSample(sample);
  if (clean.status !== "read") return clean;
  if (typeof nowMs !== "number" || !Number.isFinite(nowMs)) return blank("malformed", "malformed", clean.platform, clean.readAtMs);
  const age = nowMs - (clean.readAtMs as number);
  if (age < -5000) return blank("malformed", "malformed", clean.platform, clean.readAtMs);
  if (age > STALE_MS) return blank("stale", "stale", clean.platform, clean.readAtMs);
  return clean;
}

function fmtRounded(n: number) {
  const rounded = Math.floor(n * 10 + 0.5) / 10;
  if (Math.abs(rounded - Math.trunc(rounded)) < 1e-9) return String(Math.trunc(rounded));
  return rounded.toFixed(1);
}

function fmtBytes(n: number) {
  const gib = n / (1024 * 1024 * 1024);
  if (gib >= 1) return `${fmtRounded(gib)} GiB`;
  return `${roundInt(n / (1024 * 1024))} MiB`;
}

function fmtMem(used: number | null, total: number | null) {
  if (used == null && total == null) return "unread";
  if (used == null) return `unread/${fmtBytes(total as number)}`;
  if (total == null) return `${fmtBytes(used)}/unread`;
  return `${fmtBytes(used)}/${fmtBytes(total)}`;
}

function fmtMeasure(n: number | null, suffix: string) {
  if (typeof n !== "number" || !Number.isFinite(n)) return "unread";
  return `${fmtRounded(n)}${suffix}`;
}

export function gpuLine(sample: unknown) {
  const clean = parseSample(sample);
  if (clean.status === "unsupported") return `GPU unread · ${LATER_DOOR}`;
  if (clean.status === "stale") return "GPU unread · stale";
  if (clean.status === "malformed") return "GPU unread · malformed";
  if (clean.status !== "read") return "GPU unread";
  const name = clean.name || "unread";
  return `GPU ${name} · ${fmtMeasure(clean.tempC, "°C")} · ${fmtMeasure(clean.utilPercent, "%")} · ${fmtMem(clean.memoryUsedBytes, clean.memoryTotalBytes)} · ${fmtMeasure(clean.powerWatts, " W")}`;
}

export const READ_INK = "#9a9288";
export const UNREAD_INK = "#5c564e";
export const SPARK_W = 72;
export const SPARK_H = 14;
export const SPARK_PAD = 1;
export const SPARK_MAX = 24;

export type GpuPoint = {
  readAtMs: number;
  tempC: number | null;
  utilPercent: number | null;
  memoryUsedBytes: number | null;
  memoryTotalBytes: number | null;
  powerWatts: number | null;
};

export type GpuSpark = {
  empty: boolean;
  ink: string;
  history: GpuPoint[];
  points: GpuPoint[];
  path: string;
  coords: { x: number; y: number }[];
};

export function gpuInk(sample: unknown) {
  return parseSample(sample).status === "read" ? READ_INK : UNREAD_INK;
}

export function emptyHistory(): GpuPoint[] {
  return [];
}

function fmtTenths(n: number) {
  const tenths = Math.floor(n * 10 + 0.5);
  const whole = Math.trunc(tenths / 10);
  const frac = Math.abs(tenths % 10);
  if (frac === 0) return String(whole);
  return `${whole}.${frac}`;
}

function freshStamp(readAtMs: number, nowMs: number) {
  if (typeof readAtMs !== "number" || !Number.isFinite(readAtMs)) return false;
  if (typeof nowMs !== "number" || !Number.isFinite(nowMs)) return false;
  const age = nowMs - readAtMs;
  return age >= -5000 && age <= STALE_MS;
}

function pointFrom(sample: GpuSample): GpuPoint {
  return {
    readAtMs: sample.readAtMs as number,
    tempC: sample.tempC,
    utilPercent: sample.utilPercent,
    memoryUsedBytes: sample.memoryUsedBytes,
    memoryTotalBytes: sample.memoryTotalBytes,
    powerWatts: sample.powerWatts,
  };
}

function cleanPoint(row: unknown): GpuPoint | null {
  if (!row || typeof row !== "object" || Array.isArray(row)) return null;
  const raw = row as Record<string, unknown>;
  const readAtMs = stamp(raw.readAtMs);
  if (readAtMs == null) return null;
  const temp = finiteIn(raw.tempC, -40, 125);
  const util = finiteIn(raw.utilPercent, 0, 100);
  let used = finiteIn(raw.memoryUsedBytes, 0, 2 ** 48);
  let total = finiteIn(raw.memoryTotalBytes, 0, 2 ** 48);
  const power = finiteIn(raw.powerWatts, 0, 2000);
  if (used != null && total != null && used > total) {
    used = null;
    total = null;
  }
  const point: GpuPoint = {
    readAtMs,
    tempC: temp == null ? null : round1(temp),
    utilPercent: util == null ? null : round1(util),
    memoryUsedBytes: used == null ? null : roundInt(used),
    memoryTotalBytes: total == null ? null : roundInt(total),
    powerWatts: power == null ? null : round1(power),
  };
  if (!METRIC_KEYS.some((key) => point[key] != null)) return null;
  return point;
}

function trimHistory(history: unknown, nowMs: number): GpuPoint[] {
  if (typeof nowMs !== "number" || !Number.isFinite(nowMs)) return [];
  const rows = Array.isArray(history) ? history : [];
  const kept: GpuPoint[] = [];
  rows.forEach((row) => {
    const point = cleanPoint(row);
    if (!point || !freshStamp(point.readAtMs, nowMs)) return;
    kept.push(point);
  });
  kept.sort((a, b) => a.readAtMs - b.readAtMs);
  return kept.length > SPARK_MAX ? kept.slice(kept.length - SPARK_MAX) : kept;
}

export function remember(history: unknown, sample: unknown, nowMs: number): GpuPoint[] {
  const kept = trimHistory(history, nowMs);
  const clean = present(sample, nowMs);
  if (clean.status !== "read" || clean.readAtMs == null || !freshStamp(clean.readAtMs, nowMs)) return kept;
  const next = kept.filter((point) => point.readAtMs !== clean.readAtMs);
  next.push(pointFrom(clean));
  next.sort((a, b) => a.readAtMs - b.readAtMs);
  return next.length > SPARK_MAX ? next.slice(next.length - SPARK_MAX) : next;
}

function sparkCoord(i: number, n: number, util: number) {
  const span = SPARK_W - SPARK_PAD * 2;
  const x = round1(SPARK_PAD + (i * span) / (n - 1));
  const y = round1(SPARK_PAD + ((100 - util) * (SPARK_H - SPARK_PAD * 2)) / 100);
  return { x, y };
}

export function sparkline(history: unknown, sample: unknown, nowMs: number): GpuSpark {
  const shown = present(sample, nowMs);
  const fresh = shown.status === "read" ? trimHistory(history, nowMs) : [];
  const utilPoints = fresh.filter((point) => typeof point.utilPercent === "number");
  if (shown.status !== "read" || utilPoints.length < 2) {
    return { empty: true, ink: UNREAD_INK, history: fresh, points: [], path: "", coords: [] };
  }
  const coords = utilPoints.map((point, i) => sparkCoord(i, utilPoints.length, point.utilPercent as number));
  const path = coords.map((coord, i) => `${i === 0 ? "M" : " L"}${fmtTenths(coord.x)} ${fmtTenths(coord.y)}`).join("");
  return { empty: false, ink: READ_INK, history: fresh, points: utilPoints, path, coords };
}

function metricToken(token: unknown): Token {
  if (token == null) return { state: "missing", value: null };
  const text = String(token).trim();
  if (!text || /^\[?\s*(n\/a|not supported)\s*\]?$/i.test(text)) return { state: "missing", value: null };
  if (!/^-?\d+(\.\d+)?$/.test(text)) return { state: "bad", value: null };
  const n = Number(text);
  if (!Number.isFinite(n)) return { state: "bad", value: null };
  return { state: "ok", value: n };
}

function ranged(token: Token, min: number, max: number, digits: "1" | "int") {
  if (!token || token.state === "missing") return null;
  if (token.state !== "ok" || token.value == null) return "bad";
  if (token.value < min || token.value > max) return "bad";
  return digits === "int" ? roundInt(token.value) : round1(token.value);
}

function mibToBytes(token: Token) {
  const mib = ranged(token, 0, 2 ** 24, "int");
  if (mib === "bad" || mib == null) return mib;
  return roundInt(mib * 1024 * 1024);
}

function rowHasMetric(row: Record<MetricKey, number | null>) {
  return METRIC_KEYS.some((key) => row[key] != null);
}

export function parseNvidiaCsv(text: unknown) {
  if (text == null) return { rows: [] as NvidiaRow[], malformed: false, rejected: false };
  if (typeof text !== "string") return { rows: [] as NvidiaRow[], malformed: true, rejected: false };
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (!lines.length) return { rows: [] as NvidiaRow[], malformed: false, rejected: false };
  const rows: NvidiaRow[] = [];
  let structural = false;
  lines.forEach((line) => {
    if (/^name\s*,/i.test(line) && /temperature/i.test(line)) return;
    const parts = line.split(",").map((part) => part.trim());
    if (parts.length < 6) {
      structural = true;
      return;
    }
    const temp = ranged(metricToken(parts[parts.length - 5]), -40, 125, "1");
    const util = ranged(metricToken(parts[parts.length - 4]), 0, 100, "1");
    const used = mibToBytes(metricToken(parts[parts.length - 3]));
    const total = mibToBytes(metricToken(parts[parts.length - 2]));
    const power = ranged(metricToken(parts[parts.length - 1]), 0, 2000, "1");
    const bad = [temp, util, used, total, power].some((value) => value === "bad");
    const name = parts.slice(0, parts.length - 5).join(", ").trim() || null;
    const row: NvidiaRow = {
      index: rows.length,
      name,
      tempC: temp === "bad" ? null : temp,
      utilPercent: util === "bad" ? null : util,
      memoryUsedBytes: used === "bad" ? null : used,
      memoryTotalBytes: total === "bad" ? null : total,
      powerWatts: power === "bad" ? null : power,
      bad,
    };
    if (row.memoryUsedBytes != null && row.memoryTotalBytes != null && row.memoryUsedBytes > row.memoryTotalBytes) {
      row.memoryUsedBytes = null;
      row.memoryTotalBytes = null;
      row.bad = true;
    }
    rows.push(row);
  });
  if (!rows.length && structural) return { rows, malformed: true, rejected: false };
  const rejected = rows.some((row) => row.bad && !rowHasMetric(row));
  return { rows, malformed: false, rejected };
}

function physOf(instance: unknown) {
  const match = /phys_(\d+)/.exec(String(instance || ""));
  return match ? Number(match[1]) : null;
}

export function reducePdh(engines: unknown, adapterMemory: unknown) {
  if (engines == null && adapterMemory == null) return { rows: [] as NvidiaRow[], malformed: false, rejected: false };
  if ((engines != null && !Array.isArray(engines)) || (adapterMemory != null && !Array.isArray(adapterMemory))) {
    return { rows: [] as NvidiaRow[], malformed: true, rejected: false };
  }
  const byPhys = new Map<number, { index: number; utils3d: number[]; utils: number[]; used: number[]; limit: number[]; rejected: boolean }>();
  function bucket(phys: number) {
    if (!byPhys.has(phys)) byPhys.set(phys, { index: phys, utils3d: [], utils: [], used: [], limit: [], rejected: false });
    return byPhys.get(phys)!;
  }
  let badShape = false;
  (engines || []).forEach((row) => {
    if (!row || typeof row !== "object") {
      badShape = true;
      return;
    }
    const rec = row as Record<string, unknown>;
    const phys = physOf(rec.instance);
    if (phys == null) {
      badShape = true;
      return;
    }
    if (rec.util == null) return;
    const util = ranged(metricToken(String(rec.util)), 0, 100, "1");
    const slot = bucket(phys);
    if (util === "bad" || util == null) {
      slot.rejected = true;
      return;
    }
    if (/engtype_3D/i.test(String(rec.instance))) slot.utils3d.push(util);
    else slot.utils.push(util);
  });
  (adapterMemory || []).forEach((row) => {
    if (!row || typeof row !== "object") {
      badShape = true;
      return;
    }
    const rec = row as Record<string, unknown>;
    const phys = physOf(rec.instance);
    if (phys == null) {
      badShape = true;
      return;
    }
    const slot = bucket(phys);
    if (rec.dedicatedUsage != null) {
      const used = finiteIn(rec.dedicatedUsage, 0, 2 ** 48);
      if (used == null) badShape = true;
      else slot.used.push(roundInt(used));
    }
    if (rec.dedicatedLimit != null) {
      const limit = finiteIn(rec.dedicatedLimit, 0, 2 ** 48);
      if (limit == null) badShape = true;
      else slot.limit.push(roundInt(limit));
    }
  });
  const rows: Array<NvidiaRow & { rejected: boolean }> = [];
  byPhys.forEach((slot) => {
    const utilPercent = slot.utils3d.length ? Math.max(...slot.utils3d) : (slot.utils.length ? Math.max(...slot.utils) : null);
    let memoryUsedBytes = slot.used.length ? slot.used.reduce((sum, n) => sum + n, 0) : null;
    let memoryTotalBytes = slot.limit.length ? Math.max(...slot.limit) : null;
    if (memoryUsedBytes != null && memoryTotalBytes != null && memoryUsedBytes > memoryTotalBytes) {
      memoryUsedBytes = null;
      memoryTotalBytes = null;
    }
    rows.push({
      index: slot.index,
      name: null,
      tempC: null,
      utilPercent,
      memoryUsedBytes,
      memoryTotalBytes,
      powerWatts: null,
      bad: false,
      rejected: slot.rejected,
    });
  });
  const rejected = rows.some((row) => row.rejected && !rowHasMetric(row));
  if (!rows.length && badShape) return { rows: [] as NvidiaRow[], malformed: true, rejected: false };
  return { rows, malformed: false, rejected };
}

function pickBest<T extends NvidiaRow>(rows: T[]) {
  let best: T | null = null;
  let bestCount = 0;
  rows.forEach((row) => {
    const count = METRIC_KEYS.filter((key) => row[key] != null).length;
    if (!count) return;
    if (!best || count > bestCount || (count === bestCount && row.index < best.index)) {
      best = row;
      bestCount = count;
    }
  });
  return best;
}

export function sampleFromProbe(probe: unknown, opts: { platform?: string | null; nowMs?: number | null }) {
  const platform = opts && opts.platform;
  const nowMs = stamp(opts && opts.nowMs);
  if (!sensesOn(platform)) return blank("unsupported", LATER_DOOR, platform || null, nowMs);
  if (probe == null) return blank("unread", "missing", platform || null, nowMs);
  if (typeof probe !== "object" || Array.isArray(probe)) return blank("malformed", "malformed", platform || null, nowMs);
  const rec = probe as Record<string, unknown>;
  if (rec.malformed) return blank("malformed", "malformed", platform || null, nowMs);
  const nvidia = parseNvidiaCsv(rec.nvidiaCsv);
  const amd = parseNvidiaCsv(rec.amdgpuCsv);
  const intel = parseNvidiaCsv(rec.intelCsv);
  const pdh = reducePdh(rec.engines, rec.adapterMemory);
  const nvidiaRows = nvidia.malformed ? [] : nvidia.rows;
  const amdRows = amd.malformed ? [] : amd.rows;
  const intelRows = intel.malformed ? [] : intel.rows;
  const pdhRows = pdh.malformed ? [] : pdh.rows;
  const nvidiaBest = pickBest(nvidiaRows);
  const amdBest = pickBest(amdRows);
  const intelBest = pickBest(intelRows);
  const pdhBest = pickBest(pdhRows);
  const nvidiaCount = nvidiaRows.filter((row) => rowHasMetric(row)).length;
  const pdhCount = pdhRows.filter((row) => rowHasMetric(row)).length;
  if (!nvidiaBest && !amdBest && !intelBest && !pdhBest) {
    if (nvidia.malformed || amd.malformed || intel.malformed || pdh.malformed || nvidia.rejected || amd.rejected || intel.rejected || pdh.rejected) {
      return blank("malformed", "malformed", platform || null, nowMs);
    }
    return blank("unread", "missing", platform || null, nowMs);
  }
  let chosen = (nvidiaBest || amdBest || intelBest || pdhBest) as NvidiaRow;
  let source: GpuSource = nvidiaBest ? (isMac(platform) ? "ioaccelerator" : "nvidia-smi") : (amdBest ? "amdgpu" : (intelBest ? "fdinfo" : "pdh"));
  if (nvidiaBest && pdhBest && nvidiaCount === 1 && pdhCount === 1) {
    chosen = {
      index: nvidiaBest.index,
      name: nvidiaBest.name,
      tempC: nvidiaBest.tempC,
      utilPercent: nvidiaBest.utilPercent,
      memoryUsedBytes: nvidiaBest.memoryUsedBytes,
      memoryTotalBytes: nvidiaBest.memoryTotalBytes,
      powerWatts: nvidiaBest.powerWatts,
      bad: false,
    };
    let filled = false;
    METRIC_KEYS.forEach((key) => {
      if (chosen[key] == null && pdhBest[key] != null) {
        chosen = { ...chosen, [key]: pdhBest[key] };
        filled = true;
      }
    });
    source = filled ? "nvidia-smi+pdh" : (isMac(platform) ? "ioaccelerator" : "nvidia-smi");
  } else if (nvidiaBest) {
    chosen = nvidiaBest;
    source = isMac(platform) ? "ioaccelerator" : "nvidia-smi";
  } else if (amdBest) {
    chosen = amdBest;
    source = "amdgpu";
  } else if (intelBest) {
    chosen = intelBest;
    source = "fdinfo";
  } else if (pdhBest) {
    chosen = pdhBest;
    source = "pdh";
  }
  if (nowMs == null) return blank("malformed", "malformed", platform || null, null);
  return parseSample({
    status: "read",
    platform,
    name: chosen.name,
    source,
    index: chosen.index,
    tempC: chosen.tempC,
    utilPercent: chosen.utilPercent,
    memoryUsedBytes: chosen.memoryUsedBytes,
    memoryTotalBytes: chosen.memoryTotalBytes,
    powerWatts: chosen.powerWatts,
    readAtMs: nowMs,
  });
}

export function parseProbeText(text: unknown) {
  if (typeof text !== "string" || !text.trim()) return { malformed: true as const };
  const lines = text.split(/\r?\n/);
  if (!lines.some((line) => line.trim() === "END")) return { malformed: true as const };
  let nvidiaCsv: string | null = null;
  let amdgpuCsv: string | null = null;
  let intelCsv: string | null = null;
  let engines: Array<{ instance: string; util: number | null }> | null = null;
  let adapterMemory: Array<{ instance: string; dedicatedUsage: number | null; dedicatedLimit: number | null }> | null = null;
  let mode: "nvidia" | "amdgpu" | "intel" | "engine" | "memory" | null = null;
  const nvidiaLines: string[] = [];
  const amdgpuLines: string[] = [];
  const intelLines: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const tag = lines[i].trim();
    if (tag === "END") break;
    if (tag === "NVIDIA_ABSENT") {
      nvidiaCsv = null;
      mode = null;
      continue;
    }
    if (tag === "NVIDIA_EMPTY") {
      nvidiaCsv = "";
      mode = null;
      continue;
    }
    if (tag === "NVIDIA") {
      mode = "nvidia";
      nvidiaLines.length = 0;
      continue;
    }
    if (tag === "ENDNVIDIA") {
      nvidiaCsv = nvidiaLines.join("\n");
      mode = null;
      continue;
    }
    if (tag === "AMDGPU_ABSENT") {
      amdgpuCsv = null;
      mode = null;
      continue;
    }
    if (tag === "AMDGPU_EMPTY") {
      amdgpuCsv = "";
      mode = null;
      continue;
    }
    if (tag === "AMDGPU") {
      mode = "amdgpu";
      amdgpuLines.length = 0;
      continue;
    }
    if (tag === "ENDAMDGPU") {
      amdgpuCsv = amdgpuLines.join("\n");
      mode = null;
      continue;
    }
    if (tag === "INTEL_ABSENT" || tag === "INTEL_EMPTY") {
      mode = null;
      continue;
    }
    if (tag === "INTEL") {
      mode = "intel";
      intelLines.length = 0;
      continue;
    }
    if (tag === "ENDINTEL") {
      intelCsv = intelLines.join("\n");
      mode = null;
      continue;
    }
    if (tag === "ENGINE_ABSENT") {
      engines = null;
      mode = null;
      continue;
    }
    if (tag === "ENGINE") {
      mode = "engine";
      engines = [];
      continue;
    }
    if (tag === "ENDENGINE") {
      mode = null;
      continue;
    }
    if (tag === "MEMORY_ABSENT") {
      adapterMemory = null;
      mode = null;
      continue;
    }
    if (tag === "MEMORY") {
      mode = "memory";
      adapterMemory = [];
      continue;
    }
    if (tag === "ENDMEMORY") {
      mode = null;
      continue;
    }
    if (mode === "nvidia") nvidiaLines.push(tag);
    else if (mode === "amdgpu") amdgpuLines.push(tag);
    else if (mode === "intel") intelLines.push(tag);
    else if (mode === "engine" && engines) {
      const bits = lines[i].split("\t");
      if (bits.length !== 2) return { malformed: true as const };
      const util = metricToken(bits[1]);
      if (util.state === "bad") return { malformed: true as const };
      engines.push({ instance: bits[0].trim(), util: util.value });
    } else if (mode === "memory" && adapterMemory) {
      const bits = lines[i].split("\t");
      if (bits.length !== 3) return { malformed: true as const };
      const used = bits[1].trim() === "" ? { state: "missing" as const, value: null } : metricToken(bits[1]);
      const limit = bits[2].trim() === "" ? { state: "missing" as const, value: null } : metricToken(bits[2]);
      if (used.state === "bad" || limit.state === "bad") return { malformed: true as const };
      adapterMemory.push({ instance: bits[0].trim(), dedicatedUsage: used.value, dedicatedLimit: limit.value });
    }
  }
  return { nvidiaCsv, amdgpuCsv, intelCsv, engines, adapterMemory, malformed: false as const };
}
