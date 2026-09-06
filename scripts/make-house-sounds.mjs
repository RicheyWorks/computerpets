/** House-synthesized PCM clips. Public-domain. Not zoo recordings. */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const RATE = 22050;

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

function tone(freq, dur, gain = 0.22, attack = 0.01, release = 0.04) {
  const n = Math.floor(RATE * dur);
  const out = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    const env =
      t < attack ? t / attack : t > dur - release ? Math.max(0, (dur - t) / release) : 1;
    out[i] = Math.sin(2 * Math.PI * freq * t) * gain * env;
  }
  return out;
}

function noise(dur, gain = 0.12) {
  const n = Math.floor(RATE * dur);
  const out = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    const env = t < 0.004 ? t / 0.004 : Math.max(0, 1 - t / dur);
    out[i] = (Math.random() * 2 - 1) * gain * env;
  }
  return out;
}

function concat(...parts) {
  let n = 0;
  for (const p of parts) n += p.length;
  const out = new Float64Array(n);
  let o = 0;
  for (const p of parts) {
    out.set(p, o);
    o += p.length;
  }
  return out;
}

function silence(dur) {
  return new Float64Array(Math.floor(RATE * dur));
}

function glide(from, to, dur, gain = 0.2) {
  const n = Math.floor(RATE * dur);
  const out = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const u = i / n;
    const f = from + (to - from) * u;
    const env = u < 0.08 ? u / 0.08 : u > 0.75 ? (1 - u) / 0.25 : 1;
    out[i] = Math.sin(2 * Math.PI * f * (i / RATE)) * gain * env;
  }
  return out;
}

const clips = {
  "red_panda.wav": concat(
    tone(980, 0.07, 0.18),
    silence(0.04),
    tone(1180, 0.06, 0.16),
    silence(0.05),
    tone(860, 0.08, 0.14),
  ),
  "hummingbird.wav": concat(
    tone(3200, 0.035, 0.12),
    silence(0.02),
    tone(3800, 0.03, 0.1),
    silence(0.018),
    tone(3400, 0.04, 0.11),
    silence(0.02),
    tone(4000, 0.028, 0.09),
  ),
  "cat.wav": concat(glide(420, 780, 0.18, 0.2), glide(780, 360, 0.22, 0.16)),
  "dog.wav": concat(glide(180, 140, 0.09, 0.28), silence(0.06), glide(200, 130, 0.08, 0.22)),
  "chickadee.wav": concat(tone(3100, 0.09, 0.16), silence(0.05), tone(2400, 0.14, 0.14)),
  "step-soft.wav": concat(noise(0.05, 0.07), tone(90, 0.04, 0.05)),
  "step-tap.wav": concat(noise(0.03, 0.1), tone(220, 0.035, 0.08)),
  "step-claw.wav": concat(noise(0.025, 0.12), tone(640, 0.03, 0.06)),
  "step-wood.wav": concat(tone(160, 0.04, 0.1), noise(0.04, 0.08)),
};

const loop = new Float64Array(RATE * 4);
const notes = [262, 330, 392, 330, 294, 392, 440, 392];
for (let i = 0; i < loop.length; i++) {
  const t = i / RATE;
  const beat = Math.floor(t * 2) % notes.length;
  const f = notes[beat];
  const local = t * 2 - Math.floor(t * 2);
  const env = local < 0.08 ? local / 0.08 : Math.max(0.15, 1 - local);
  loop[i] =
    Math.sin(2 * Math.PI * f * t) * 0.07 * env +
    Math.sin(2 * Math.PI * (f / 2) * t) * 0.04 * env;
}
clips["house-loop.wav"] = loop;

const here = dirname(fileURLToPath(import.meta.url));
const dirs = [join(here, "../web/public/sounds"), join(here, "../desktop/renderer/sounds")];
for (const dir of dirs) {
  mkdirSync(dir, { recursive: true });
  for (const [name, samples] of Object.entries(clips)) {
    writeFileSync(join(dir, name), wav(samples));
  }
}
console.log(`wrote ${Object.keys(clips).length} clips to ${dirs.length} folders`);
