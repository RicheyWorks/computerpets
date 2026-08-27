/** House-made rain and distant thunder. CC0. About three minutes, loop-safe. Not a radio stream. */
import { mkdirSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

const RATE = 22050;
const DUR = 180;
const FADE = 2.4;
const NAME = "sleep-rain";

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function wav(samples) {
  const n = samples.length;
  const bytes = Buffer.alloc(44 + n * 2);
  bytes.write("RIFF", 0);
  bytes.writeUInt32LE(36 + n * 2, 4);
  bytes.write("WAVE", 8);
  bytes.write("fmt ", 12);
  bytes.writeUInt32LE(16, 16);
  bytes.writeUInt16LE(1, 20);
  bytes.writeUInt16LE(1, 22);
  bytes.writeUInt32LE(RATE, 24);
  bytes.writeUInt32LE(RATE * 2, 28);
  bytes.writeUInt16LE(2, 32);
  bytes.writeUInt16LE(16, 34);
  bytes.write("data", 36);
  bytes.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) {
    const v = Math.max(-1, Math.min(1, samples[i]));
    bytes.writeInt16LE(Math.round(v * 32767), 44 + i * 2);
  }
  return bytes;
}

function makeStorm() {
  const rand = mulberry32(0x5e1ee7);
  const extra = Math.floor(RATE * FADE);
  const n = Math.floor(RATE * DUR) + extra;
  const out = new Float64Array(n);
  let brown = 0;
  let lp = 0;
  let hp = 0;
  let drop = 0;
  const thunders = [
    { at: 16.4, dur: 5.8, gain: 0.22 },
    { at: 38.2, dur: 7.1, gain: 0.18 },
    { at: 61.5, dur: 4.6, gain: 0.2 },
    { at: 84.8, dur: 6.4, gain: 0.16 },
    { at: 109.1, dur: 8.2, gain: 0.24 },
    { at: 133.6, dur: 5.2, gain: 0.17 },
    { at: 157.3, dur: 6.8, gain: 0.21 },
  ];

  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    const white = rand() * 2 - 1;
    brown = (brown + white * 0.018) * 0.988;
    const prev = lp;
    lp += 0.14 * (brown - lp);
    hp = 0.992 * hp + lp - prev;
    if (rand() < 0.0009) drop = 0.08 + rand() * 0.1;
    drop *= 0.93;
    const gust =
      0.7 +
      0.18 * Math.sin((2 * Math.PI * t) / 13.7) +
      0.09 * Math.sin((2 * Math.PI * t) / 4.2 + 1.1) +
      0.05 * (rand() - 0.5);
    let sample = (hp * 0.62 + drop * white * 0.35) * gust;

    for (const th of thunders) {
      const u = t - th.at;
      if (u < 0 || u > th.dur) continue;
      const attack = Math.min(1, u / 0.38);
      const decay = Math.exp(-u * (1.15 / th.dur));
      const env = attack * decay;
      const rumble = Math.sin(2 * Math.PI * (46 + 18 * Math.sin(u * 0.7)) * t) * 0.45;
      const body = brown * 0.7 + lp * 0.4;
      sample += (rumble + body) * env * th.gain;
    }
    out[i] = sample;
  }

  const fadeN = extra;
  const loopN = Math.floor(RATE * DUR);
  const looped = new Float64Array(loopN);
  for (let i = 0; i < loopN; i++) {
    if (i < fadeN) {
      const w = i / fadeN;
      looped[i] = out[i] * w + out[loopN + i] * (1 - w);
    } else {
      looped[i] = out[i];
    }
  }

  let peak = 0;
  for (let i = 0; i < looped.length; i++) peak = Math.max(peak, Math.abs(looped[i]));
  const gain = peak > 0 ? 0.72 / peak : 1;
  for (let i = 0; i < looped.length; i++) looped[i] *= gain;
  return looped;
}

const here = dirname(fileURLToPath(import.meta.url));
const dirs = [join(here, "../web/public/sounds"), join(here, "../desktop/renderer/sounds")];
const samples = makeStorm();
const wavBytes = wav(samples);
const wavPath = join(tmpdir(), `${NAME}.wav`);
writeFileSync(wavPath, wavBytes);

for (const dir of dirs) {
  mkdirSync(dir, { recursive: true });
  const oggPath = join(dir, `${NAME}.ogg`);
  const ogg = spawnSync("ffmpeg", ["-y", "-i", wavPath, "-c:a", "libvorbis", "-q:a", "2", oggPath], {
    encoding: "utf8",
  });
  if (ogg.status !== 0) {
    throw new Error(ogg.stderr || "ffmpeg could not write the sleep-aid ogg");
  }
}

try {
  unlinkSync(wavPath);
} catch {
  /* leftover wav in tmp is fine */
}

console.log(`wrote ${NAME} · ${DUR}s · ${dirs.length} folders`);
