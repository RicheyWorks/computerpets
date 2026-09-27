/** Desktop-local GPU sense. Windows and Linux nvidia-smi. Linux amdgpu sysfs uses the same line when nvidia-smi does not, including hwmon temperature labeled edge and power labeled PPT. i915 and xe utilization comes from two DRM fdinfo reads when that percent is honest; otherwise INTEL_EMPTY. Device VRAM used and total on that line stay unread. Mac reads IOAccelerator into that line. Mac temperature and power stay unread. Sparkline is real samples only. */
(function (root) {
  const STALE_MS = 20000;
  const LATER_DOOR = "unsupported";
  const SOURCES = ["nvidia-smi", "pdh", "nvidia-smi+pdh", "ioaccelerator", "amdgpu", "fdinfo"];
  const METRIC_KEYS = ["tempC", "utilPercent", "memoryUsedBytes", "memoryTotalBytes", "powerWatts"];

  function sensesOn(platform) {
    return platform === "win32" || /^Win/i.test(String(platform || "")) || isLinux(platform) || isMac(platform);
  }

  function isMac(platform) {
    return platform === "darwin" || /^Mac/i.test(String(platform || ""));
  }

  function isLinux(platform) {
    return platform === "linux" || /^Linux/i.test(String(platform || ""));
  }

  function laterDoor(platform) {
    if (sensesOn(platform)) return null;
    return LATER_DOOR;
  }

  function round1(n) {
    return Math.floor(n * 10 + 0.5) / 10;
  }

  function roundInt(n) {
    return Math.floor(n + 0.5);
  }

  function blank(status, reason, platform, readAtMs) {
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
      readAtMs: typeof readAtMs === "number" && Number.isFinite(readAtMs) ? readAtMs : null,
      reason: reason || status,
    };
  }

  const UNREAD = blank("unread", "missing", null, null);

  function finiteIn(value, min, max) {
    if (typeof value !== "number" || !Number.isFinite(value)) return null;
    if (value < min || value > max) return null;
    return value;
  }

  function cleanName(value) {
    if (typeof value !== "string") return null;
    const name = value.trim();
    return name || null;
  }

  function cleanSource(value) {
    return SOURCES.indexOf(value) >= 0 ? value : null;
  }

  function cleanIndex(value) {
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return null;
    if (Math.floor(value) !== value) return null;
    return value;
  }

  function stamp(nowMs) {
    return typeof nowMs === "number" && Number.isFinite(nowMs) ? nowMs : null;
  }

  function metricsFrom(raw) {
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

  function parseSample(raw) {
    if (raw == null) return blank("unread", "missing", null, null);
    if (typeof raw !== "object" || Array.isArray(raw)) return blank("malformed", "malformed", null, null);
    const platform = typeof raw.platform === "string" && raw.platform ? raw.platform : null;
    const readAtMs = stamp(raw.readAtMs);
    if (platform && !sensesOn(platform)) return blank("unsupported", LATER_DOOR, platform, readAtMs);
    if (raw.status === "unsupported") return blank("unsupported", LATER_DOOR, platform, readAtMs);
    if (raw.status === "malformed") return blank("malformed", "malformed", platform, readAtMs);
    if (raw.status === "stale") return blank("stale", "stale", platform, readAtMs);
    if (raw.status === "unread") return blank("unread", typeof raw.reason === "string" && raw.reason ? raw.reason : "missing", platform, readAtMs);
    const picked = metricsFrom(raw);
    if (!picked.any) {
      return blank(picked.offered ? "malformed" : "unread", picked.offered ? "malformed" : "missing", platform, readAtMs);
    }
    if (readAtMs == null) return blank("malformed", "malformed", platform, null);
    return {
      status: "read",
      platform,
      name: cleanName(raw.name),
      source: cleanSource(raw.source),
      index: cleanIndex(raw.index),
      tempC: picked.metrics.tempC,
      utilPercent: picked.metrics.utilPercent,
      memoryUsedBytes: picked.metrics.memoryUsedBytes,
      memoryTotalBytes: picked.metrics.memoryTotalBytes,
      powerWatts: picked.metrics.powerWatts,
      readAtMs,
      reason: null,
    };
  }

  function present(sample, nowMs) {
    const clean = parseSample(sample);
    if (clean.status !== "read") return clean;
    if (typeof nowMs !== "number" || !Number.isFinite(nowMs)) return blank("malformed", "malformed", clean.platform, clean.readAtMs);
    const age = nowMs - clean.readAtMs;
    if (age < -5000) return blank("malformed", "malformed", clean.platform, clean.readAtMs);
    if (age > STALE_MS) return blank("stale", "stale", clean.platform, clean.readAtMs);
    return clean;
  }

  function fmtRounded(n) {
    const rounded = Math.floor(n * 10 + 0.5) / 10;
    if (Math.abs(rounded - Math.trunc(rounded)) < 1e-9) return String(Math.trunc(rounded));
    return rounded.toFixed(1);
  }

  function fmtBytes(n) {
    const gib = n / (1024 * 1024 * 1024);
    if (gib >= 1) {
      const body = fmtRounded(gib);
      return `${body} GiB`;
    }
    return `${roundInt(n / (1024 * 1024))} MiB`;
  }

  /** A number the GPU did not give: a dash, not the word "unread". Same on the web card and the blotter. */
  const GPU_NO_VALUE = "\u2014";
  /** The GPU line when there is no fresh reading, in plain words (the status stays in data-gpu). */
  const GPU_WORDS = Object.freeze({
    unread: "GPU · no reading",
    unsupported: "GPU · not read on this computer",
    stale: "GPU · reading is old",
    malformed: "GPU · reading looked wrong",
  });

  function fmtMem(used, total) {
    if (used == null && total == null) return GPU_NO_VALUE;
    if (used == null) return `${GPU_NO_VALUE}/${fmtBytes(total)}`;
    if (total == null) return `${fmtBytes(used)}/${GPU_NO_VALUE}`;
    return `${fmtBytes(used)}/${fmtBytes(total)}`;
  }

  function fmtMeasure(n, suffix) {
    if (typeof n !== "number" || !Number.isFinite(n)) return GPU_NO_VALUE;
    return `${fmtRounded(n)}${suffix}`;
  }

  function gpuLine(sample) {
    const clean = parseSample(sample);
    if (clean.status === "unsupported") return GPU_WORDS.unsupported;
    if (clean.status === "stale") return GPU_WORDS.stale;
    if (clean.status === "malformed") return GPU_WORDS.malformed;
    if (clean.status !== "read") return GPU_WORDS.unread;
    const head = clean.name ? `GPU ${clean.name}` : "GPU";
    return `${head} · ${fmtMeasure(clean.tempC, "°C")} · ${fmtMeasure(clean.utilPercent, "%")} · ${fmtMem(clean.memoryUsedBytes, clean.memoryTotalBytes)} · ${fmtMeasure(clean.powerWatts, " W")}`;
  }

  function metricToken(token) {
    if (token == null) return { state: "missing", value: null };
    const text = String(token).trim();
    if (!text || /^\[?\s*(n\/a|not supported)\s*\]?$/i.test(text)) return { state: "missing", value: null };
    if (!/^-?\d+(\.\d+)?$/.test(text)) return { state: "bad", value: null };
    const n = Number(text);
    if (!Number.isFinite(n)) return { state: "bad", value: null };
    return { state: "ok", value: n };
  }

  function ranged(token, min, max, digits) {
    if (!token || token.state === "missing") return null;
    if (token.state !== "ok") return "bad";
    if (token.value < min || token.value > max) return "bad";
    return digits === "int" ? roundInt(token.value) : round1(token.value);
  }

  function mibToBytes(token) {
    const mib = ranged(token, 0, 2 ** 24, "int");
    if (mib === "bad" || mib == null) return mib;
    return roundInt(mib * 1024 * 1024);
  }

  function rowHasMetric(row) {
    return METRIC_KEYS.some((key) => row[key] != null);
  }

  function parseNvidiaCsv(text) {
    if (text == null) return { rows: [], malformed: false, rejected: false };
    if (typeof text !== "string") return { rows: [], malformed: true, rejected: false };
    const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    if (!lines.length) return { rows: [], malformed: false, rejected: false };
    const rows = [];
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
      const row = {
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
    if (!rows.length && structural) return { rows: [], malformed: true, rejected: false };
    const rejected = rows.some((row) => row.bad && !rowHasMetric(row));
    return { rows, malformed: false, rejected };
  }

  function physOf(instance) {
    const match = /phys_(\d+)/.exec(String(instance || ""));
    if (!match) return null;
    return Number(match[1]);
  }

  /**
   * One adapter is its LUID plus its physical index. Two adapters can both be phys_0
   * (a discrete card and the Microsoft Basic Render or integrated adapter), so the
   * index alone would mix their engines and memory. An instance with no LUID keeps
   * the index alone.
   */
  function adapterOf(instance) {
    const phys = physOf(instance);
    if (phys == null) return null;
    const luid = /luid_(0x[0-9a-f]+)_(0x[0-9a-f]+)_phys_\d+/i.exec(String(instance || ""));
    const key = luid ? `luid_${luid[1]}_${luid[2]}_phys_${phys}`.toLowerCase() : `phys_${phys}`;
    return { key, phys };
  }

  /**
   * Which counter adapter the line shows: the one with the most dedicated VRAM (a
   * discrete card over an integrated or software adapter). When no adapter prints a
   * limit, the one holding the most dedicated memory, then the one with the most
   * readings, then the first the counters listed.
   */
  function pickAdapter(rows) {
    let best = null;
    let bestKey = null;
    rows.forEach((row) => {
      const count = METRIC_KEYS.filter((key) => row[key] != null).length;
      if (!count) return;
      const key = [
        row.memoryTotalBytes == null ? -1 : row.memoryTotalBytes,
        row.memoryUsedBytes == null ? -1 : row.memoryUsedBytes,
        count,
      ];
      const better = !best || key[0] > bestKey[0] || (key[0] === bestKey[0] && (key[1] > bestKey[1] || (key[1] === bestKey[1] && key[2] > bestKey[2])));
      if (better) {
        best = row;
        bestKey = key;
      }
    });
    return best;
  }

  /**
   * The engine counter is a rate over its own sample window, and on a busy engine it can
   * read a little over 100 (111 was seen on an RTX 4090 under NVENC). That is overshoot,
   * not a broken reading: it is kept and the engine is capped at 100, as Task Manager does.
   * A reading past ENGINE_OVERSHOOT is still refused as broken.
   */
  const ENGINE_OVERSHOOT = 200;

  /**
   * One engine is one adapter's engine index and type, whatever process used it.
   * The counter prints one instance per process, so the process part is dropped.
   */
  function engineOf(instance) {
    return String(instance || "").replace(/^pid_\d+_/i, "").toLowerCase();
  }

  /**
   * Task Manager's GPU number: add every process on each engine, then take the busiest
   * engine of any type (3D, Copy, Video Decode, Compute). Engines are never added together.
   */
  function busiestEngine(engines) {
    let top = null;
    engines.forEach((sum) => {
      if (top == null || sum > top) top = sum;
    });
    return top == null ? null : Math.min(100, round1(top));
  }

  function reducePdh(engines, adapterMemory) {
    if (engines == null && adapterMemory == null) return { rows: [], malformed: false, rejected: false };
    if ((engines != null && !Array.isArray(engines)) || (adapterMemory != null && !Array.isArray(adapterMemory))) {
      return { rows: [], malformed: true, rejected: false };
    }
    const byAdapter = new Map();
    function bucket(adapter) {
      if (!byAdapter.has(adapter.key)) {
        byAdapter.set(adapter.key, { index: adapter.phys, engines: new Map(), used: [], limit: [], rejected: false });
      }
      return byAdapter.get(adapter.key);
    }
    let badShape = false;
    (engines || []).forEach((row) => {
      if (!row || typeof row !== "object") {
        badShape = true;
        return;
      }
      const adapter = adapterOf(row.instance);
      if (adapter == null) {
        badShape = true;
        return;
      }
      if (row.util == null) return;
      const token = metricToken(String(row.util));
      const util = ranged(token, 0, ENGINE_OVERSHOOT, "1");
      const slot = bucket(adapter);
      if (util === "bad" || util == null) {
        slot.rejected = true;
        return;
      }
      // Add the raw share. Rounding each process first would lose small ones.
      const key = engineOf(row.instance);
      slot.engines.set(key, (slot.engines.get(key) || 0) + token.value);
    });
    (adapterMemory || []).forEach((row) => {
      if (!row || typeof row !== "object") {
        badShape = true;
        return;
      }
      const adapter = adapterOf(row.instance);
      if (adapter == null) {
        badShape = true;
        return;
      }
      const slot = bucket(adapter);
      if (row.dedicatedUsage != null) {
        const used = finiteIn(row.dedicatedUsage, 0, 2 ** 48);
        if (used == null) badShape = true;
        else slot.used.push(roundInt(used));
      }
      if (row.dedicatedLimit != null) {
        const limit = finiteIn(row.dedicatedLimit, 0, 2 ** 48);
        if (limit == null) badShape = true;
        else slot.limit.push(roundInt(limit));
      }
    });
    const rows = [];
    byAdapter.forEach((slot) => {
      const utilPercent = busiestEngine(slot.engines);
      let memoryUsedBytes = slot.used.length ? slot.used.reduce((sum, n) => sum + n, 0) : null;
      let memoryTotalBytes = slot.limit.length ? Math.max.apply(null, slot.limit) : null;
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
    if (!rows.length && badShape) return { rows: [], malformed: true, rejected: false };
    return { rows, malformed: false, rejected };
  }

  function pickBest(rows) {
    let best = null;
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

  function sampleFromProbe(probe, opts) {
    const platform = opts && opts.platform;
    const nowMs = stamp(opts && opts.nowMs);
    if (!sensesOn(platform)) return blank("unsupported", LATER_DOOR, platform || null, nowMs);
    if (probe == null) return blank("unread", "missing", platform, nowMs);
    if (typeof probe !== "object" || Array.isArray(probe)) return blank("malformed", "malformed", platform, nowMs);
    if (probe.malformed) return blank("malformed", "malformed", platform, nowMs);
    const nvidia = parseNvidiaCsv(probe.nvidiaCsv);
    const amd = parseNvidiaCsv(probe.amdgpuCsv);
    const intel = parseNvidiaCsv(probe.intelCsv);
    const pdh = reducePdh(probe.engines, probe.adapterMemory);
    const nvidiaRows = nvidia.malformed ? [] : nvidia.rows;
    const amdRows = amd.malformed ? [] : amd.rows;
    const intelRows = intel.malformed ? [] : intel.rows;
    const pdhRows = pdh.malformed ? [] : pdh.rows;
    const nvidiaBest = pickBest(nvidiaRows);
    const amdBest = pickBest(amdRows);
    const intelBest = pickBest(intelRows);
    const pdhBest = pickAdapter(pdhRows);
    const nvidiaCount = nvidiaRows.filter(rowHasMetric).length;
    const pdhCount = pdhRows.filter(rowHasMetric).length;
    if (!nvidiaBest && !amdBest && !intelBest && !pdhBest) {
      if (nvidia.malformed || amd.malformed || intel.malformed || pdh.malformed || nvidia.rejected || amd.rejected || intel.rejected || pdh.rejected) {
        return blank("malformed", "malformed", platform, nowMs);
      }
      return blank("unread", "missing", platform, nowMs);
    }
    let chosen = nvidiaBest || amdBest || intelBest || pdhBest;
    let source = nvidiaBest ? (isMac(platform) ? "ioaccelerator" : "nvidia-smi") : (amdBest ? "amdgpu" : (intelBest ? "fdinfo" : "pdh"));
    if (nvidiaBest && pdhBest && nvidiaCount === 1 && pdhCount === 1) {
      chosen = {
        index: nvidiaBest.index,
        name: nvidiaBest.name,
        tempC: nvidiaBest.tempC,
        utilPercent: nvidiaBest.utilPercent,
        memoryUsedBytes: nvidiaBest.memoryUsedBytes,
        memoryTotalBytes: nvidiaBest.memoryTotalBytes,
        powerWatts: nvidiaBest.powerWatts,
      };
      let filled = false;
      METRIC_KEYS.forEach((key) => {
        if (chosen[key] == null && pdhBest[key] != null) {
          chosen[key] = pdhBest[key];
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
    } else {
      chosen = pdhBest;
      source = "pdh";
    }
    if (nowMs == null) return blank("malformed", "malformed", platform, null);
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

  function parseProbeText(text) {
    if (typeof text !== "string" || !text.trim()) return { malformed: true };
    const lines = text.split(/\r?\n/);
    if (!lines.some((line) => line.trim() === "END")) return { malformed: true };
    let nvidiaCsv = null;
    let amdgpuCsv = null;
    let intelCsv = null;
    let engines = null;
    let adapterMemory = null;
    let mode = null;
    const nvidiaLines = [];
    const amdgpuLines = [];
    const intelLines = [];
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
      else if (mode === "engine") {
        const bits = lines[i].split("\t");
        if (bits.length !== 2) return { malformed: true };
        const util = metricToken(bits[1]);
        if (util.state === "bad") return { malformed: true };
        engines.push({ instance: bits[0].trim(), util: util.value });
      } else if (mode === "memory") {
        const bits = lines[i].split("\t");
        if (bits.length !== 3) return { malformed: true };
        const used = bits[1].trim() === "" ? { state: "missing", value: null } : metricToken(bits[1]);
        const limit = bits[2].trim() === "" ? { state: "missing", value: null } : metricToken(bits[2]);
        if (used.state === "bad" || limit.state === "bad") return { malformed: true };
        adapterMemory.push({
          instance: bits[0].trim(),
          dedicatedUsage: used.value,
          dedicatedLimit: limit.value,
        });
      }
    }
    return { nvidiaCsv, amdgpuCsv, intelCsv, engines, adapterMemory, malformed: false };
  }

  const READ_INK = "#9a9288";
  const UNREAD_INK = "#5c564e";
  const SPARK_W = 72;
  const SPARK_H = 14;
  const SPARK_PAD = 1;
  const SPARK_MAX = 24;

  function ink(sample) {
    return parseSample(sample).status === "read" ? READ_INK : UNREAD_INK;
  }

  function emptyHistory() {
    return [];
  }

  function fmtTenths(n) {
    const tenths = Math.floor(n * 10 + 0.5);
    const whole = Math.trunc(tenths / 10);
    const frac = Math.abs(tenths % 10);
    if (frac === 0) return String(whole);
    return `${whole}.${frac}`;
  }

  function freshStamp(readAtMs, nowMs) {
    if (typeof readAtMs !== "number" || !Number.isFinite(readAtMs)) return false;
    if (typeof nowMs !== "number" || !Number.isFinite(nowMs)) return false;
    const age = nowMs - readAtMs;
    return age >= -5000 && age <= STALE_MS;
  }

  function pointFrom(sample) {
    return {
      readAtMs: sample.readAtMs,
      tempC: sample.tempC,
      utilPercent: sample.utilPercent,
      memoryUsedBytes: sample.memoryUsedBytes,
      memoryTotalBytes: sample.memoryTotalBytes,
      powerWatts: sample.powerWatts,
    };
  }

  function cleanPoint(row) {
    if (!row || typeof row !== "object" || Array.isArray(row)) return null;
    const readAtMs = stamp(row.readAtMs);
    if (readAtMs == null) return null;
    const temp = finiteIn(row.tempC, -40, 125);
    const util = finiteIn(row.utilPercent, 0, 100);
    let used = finiteIn(row.memoryUsedBytes, 0, 2 ** 48);
    let total = finiteIn(row.memoryTotalBytes, 0, 2 ** 48);
    const power = finiteIn(row.powerWatts, 0, 2000);
    if (used != null && total != null && used > total) {
      used = null;
      total = null;
    }
    const point = {
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

  function trimHistory(history, nowMs) {
    if (typeof nowMs !== "number" || !Number.isFinite(nowMs)) return [];
    const rows = Array.isArray(history) ? history : [];
    const kept = [];
    rows.forEach((row) => {
      const point = cleanPoint(row);
      if (!point || !freshStamp(point.readAtMs, nowMs)) return;
      kept.push(point);
    });
    kept.sort((a, b) => a.readAtMs - b.readAtMs);
    return kept.length > SPARK_MAX ? kept.slice(kept.length - SPARK_MAX) : kept;
  }

  function remember(history, sample, nowMs) {
    const kept = trimHistory(history, nowMs);
    const clean = present(sample, nowMs);
    if (clean.status !== "read" || !freshStamp(clean.readAtMs, nowMs)) return kept;
    const next = kept.filter((point) => point.readAtMs !== clean.readAtMs);
    next.push(pointFrom(clean));
    next.sort((a, b) => a.readAtMs - b.readAtMs);
    return next.length > SPARK_MAX ? next.slice(next.length - SPARK_MAX) : next;
  }

  function sparkCoord(i, n, util) {
    const span = SPARK_W - SPARK_PAD * 2;
    const x = round1(SPARK_PAD + (i * span) / (n - 1));
    const y = round1(SPARK_PAD + ((100 - util) * (SPARK_H - SPARK_PAD * 2)) / 100);
    return { x, y };
  }

  function sparkline(history, sample, nowMs) {
    const shown = present(sample, nowMs);
    const fresh = shown.status === "read" ? trimHistory(history, nowMs) : [];
    const utilPoints = fresh.filter((point) => typeof point.utilPercent === "number");
    if (shown.status !== "read" || utilPoints.length < 2) {
      return { empty: true, ink: UNREAD_INK, history: fresh, points: [], path: "", coords: [] };
    }
    const coords = utilPoints.map((point, i) => sparkCoord(i, utilPoints.length, point.utilPercent));
    const path = coords.map((coord, i) => `${i === 0 ? "M" : " L"}${fmtTenths(coord.x)} ${fmtTenths(coord.y)}`).join("");
    return { empty: false, ink: READ_INK, history: fresh, points: utilPoints, path, coords };
  }

  const api = {
    STALE_MS,
    LATER_DOOR,
    GPU_NO_VALUE,
    GPU_WORDS,
    UNREAD,
    READ_INK,
    UNREAD_INK,
    SPARK_W,
    SPARK_H,
    SPARK_MAX,
    sensesOn,
    isMac,
    isLinux,
    laterDoor,
    parseSample,
    present,
    gpuLine,
    ink,
    emptyHistory,
    remember,
    sparkline,
    parseNvidiaCsv,
    reducePdh,
    sampleFromProbe,
    parseProbeText,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetGpu = api;
})(typeof window !== "undefined" ? window : globalThis);
