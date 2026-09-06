from pathlib import Path

def load(p):
    raw = Path(p).read_bytes()
    nl = "\r\n" if b"\r\n" in raw else "\n"
    text = raw.decode("utf-8")
    if text.startswith("\ufeff"):
        text = text[1:]
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    return text, nl

def save(p, text, nl):
    if nl != "\n":
        text = text.replace("\n", nl)
    Path(p).write_bytes(text.encode("utf-8"))

def must_replace(text, old, new, label):
    if old not in text:
        raise SystemExit("MISSING: " + label)
    n = text.count(old)
    if n != 1:
        raise SystemExit("COUNT %s for %s" % (n, label))
    return text.replace(old, new, 1)

OLD_PATH = """function songPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.28) {
      const s = t / 0.28;
      const ease = s * s * (3 - 2 * s);
      return { x: ease * 0.15, lift: ease * 0.55, rot: ease * -3.2 };
    }
    if (t < 0.78) {
      const s = (t - 0.28) / 0.50;
      const pulse = Math.sin(s * Math.PI * 3.2) * 2.4;
      const ease = s * s * (3 - 2 * s);
      return { x: 0.15 + ease * 0.12 + pulse * 0.08, lift: 0.55 + ease * 0.35 + Math.abs(pulse) * 0.12, rot: -3.2 + ease * 8.6 + pulse };
    }
    return { x: 0.27, lift: 0.9, rot: 5.4 };
  }"""

NEW_PATH = """function songPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.22) {
      const s = t / 0.22;
      const ease = s * s * (3 - 2 * s);
      return { x: ease * 0.2, lift: ease * 0.8, rot: ease * -7.5 };
    }
    if (t < 0.82) {
      const s = (t - 0.22) / 0.60;
      const pulse = Math.sin(s * Math.PI * 2.6) * 5.2;
      const ease = s * s * (3 - 2 * s);
      return { x: 0.2 + ease * 0.18 + pulse * 0.12, lift: 0.8 + ease * 0.7 + Math.abs(pulse) * 0.16, rot: -7.5 + ease * 22.5 + pulse };
    }
    return { x: 0.38, lift: 1.5, rot: 15.0 };
  }"""

OLD_HOLD = """function songHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const night = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 2.4) * 1.15;
    return { x: 0.27 + night * 0.04, lift: 0.9 + Math.abs(night) * 0.08, rot: 5.4 + night };
  }"""

NEW_HOLD = """function songHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const night = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 2.4) * 1.45;
    return { x: 0.38 + night * 0.05, lift: 1.5 + Math.abs(night) * 0.12, rot: 15.0 + night };
  }"""

OLD_OFF_TAIL = """rot: (from && from.rot != null ? from.rot : 5.4) * (1 - ease),
    };
  }


  function beginPlay(target, petX) {"""

NEW_OFF_TAIL = """rot: (from && from.rot != null ? from.rot : 15.0) * (1 - ease),
    };
  }


  function beginPlay(target, petX) {"""

OLD_OFF_TAIL_TS = """rot: (from && from.rot != null ? from.rot : 5.4) * (1 - ease),
  };
}


export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {"""

NEW_OFF_TAIL_TS = """rot: (from && from.rot != null ? from.rot : 15.0) * (1 - ease),
  };
}


export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {"""

js, nl = load("desktop/renderer/window-play.js")
js = must_replace(js, OLD_PATH, NEW_PATH, "js songPath")
js = must_replace(js, OLD_HOLD, NEW_HOLD, "js songHold")
js = must_replace(js, OLD_OFF_TAIL, NEW_OFF_TAIL, "js songOff+begin")
save("desktop/renderer/window-play.js", js, nl)
print("js ok")

ts, tnl = load("web/src/lib/pets/window-play.ts")
ts = must_replace(ts, "export " + OLD_PATH, "export " + NEW_PATH, "ts songPath")
ts = must_replace(ts, "export " + OLD_HOLD, "export " + NEW_HOLD, "ts songHold")
ts = must_replace(ts, OLD_OFF_TAIL_TS, NEW_OFF_TAIL_TS, "ts songOff+begin")
save("web/src/lib/pets/window-play.ts", ts, tnl)
print("ts ok")

# quick check songPath(0.5) rot
import math
def songPath(t):
    if t < 0.22:
        s = t / 0.22
        ease = s * s * (3 - 2 * s)
        return ease * -7.5
    if t < 0.82:
        s = (t - 0.22) / 0.60
        pulse = math.sin(s * math.pi * 2.6) * 5.2
        ease = s * s * (3 - 2 * s)
        return -7.5 + ease * 22.5 + pulse
    return 15.0
print("rot at 0.5", songPath(0.5), "abs", abs(songPath(0.5)))

cjs, cnl = load("desktop/renderer/window-play.test.cjs")
cjs = must_replace(
    cjs,
    '  assert.ok(Math.abs(hold.rot - 5.4) < 2.0, "she holds the night song");\n  assert.ok(Math.abs(hold.x - 0.27) < 0.4, "she stays on the grass dish");\n  assert.ok(hold.lift < 3, "night song on the stool, not a husk burst");\n  const off0 = P.songOffPath(0, { x: dish.x, lift: dish.lift + 0.9, rot: 5.4 }, { x: dish.x + 50, lift: 0 });\n  const offMid = P.songOffPath(0.5, { x: dish.x, lift: dish.lift + 0.9, rot: 5.4 }, { x: dish.x + 50, lift: 0 });\n  const off1 = P.songOffPath(1, { x: dish.x, lift: dish.lift + 0.9, rot: 5.4 }, { x: dish.x + 50, lift: 0 });',
    '  assert.ok(Math.abs(hold.rot - 15.0) < 2.5, "she holds the night song");\n  assert.ok(Math.abs(hold.x - 0.38) < 0.4, "she stays on the grass dish");\n  assert.ok(hold.lift < 4.5, "night song on the stool, not a husk burst");\n  const off0 = P.songOffPath(0, { x: dish.x, lift: dish.lift + 1.5, rot: 15.0 }, { x: dish.x + 50, lift: 0 });\n  const offMid = P.songOffPath(0.5, { x: dish.x, lift: dish.lift + 1.5, rot: 15.0 }, { x: dish.x + 50, lift: 0 });\n  const off1 = P.songOffPath(1, { x: dish.x, lift: dish.lift + 1.5, rot: 15.0 }, { x: dish.x + 50, lift: 0 });',
    "cjs hold",
)
cjs = must_replace(
    cjs,
    '      assert.ok(Math.abs(play.lift - (play.target.holdLift + 0.9)) < 3, "she holds the night song on the stool");',
    '      assert.ok(Math.abs(play.lift - (play.target.holdLift + 1.5)) < 3.5, "she holds the night song on the stool");',
    "cjs lift",
)
save("desktop/renderer/window-play.test.cjs", cjs, cnl)
print("cjs ok")
