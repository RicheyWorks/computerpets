from pathlib import Path
ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")

def load(p):
    return (ROOT / p).read_text(encoding="utf-8")

def save(p, text):
    (ROOT / p).write_text(text, encoding="utf-8", newline="\n")

def must_replace(text, old, new, n=1):
    count = text.count(old)
    if count != n:
        raise SystemExit(f"expected {n} of marker, found {count}: {old[:160]!r}")
    return text.replace(old, new)

FUNCS = """
  function signalPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 48;
    const span = Math.max(0, win.width - size - pad * 2);
    const x = win.x + pad + span * 0.24;
    const pan = Math.max(68, size * 0.38);
    const gripY = win.y + win.height - pan;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 28, maxLift) };
  }

  function signalFace(target) {
    return target.approachX >= target.holdX ? -1 : 1;
  }

  function signalOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 2.06) * 2.8;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (toX >= fromX ? 1 : -1) * 4.7 * (1 - ease) + stride * 0.13,
    };
  }

  function signalPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.26) {
      const s = t / 0.26;
      const ease = s * s * (3 - 2 * s);
      return { x: ease * 0.8, lift: ease * 4.2, rot: ease * 28.6 };
    }
    if (t < 0.78) {
      const s = (t - 0.26) / 0.52;
      const pulse = Math.sin(s * Math.PI * 2.1);
      return { x: 0.8 + pulse * 1.4, lift: 4.2 + Math.abs(pulse) * 3.6, rot: 28.6 + pulse * 6.8 };
    }
    return { x: 0.8, lift: 4.6, rot: 27.2 };
  }

  function signalHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const wait = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.24;
    return { x: 0.8, lift: 4.6 + wait, rot: 27.2 };
  }

  function signalOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.74) * 2.5;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (from && from.rot != null ? from.rot : 27.2) * (1 - ease),
    };
  }

"""

p = "desktop/renderer/window-play.js"
js = load(p)
js = must_replace(js,
"""      rot: (from && from.rot != null ? from.rot : 86.4) * (1 - ease),
    };
  }

  function beginPlay(target, petX) {
""",
"""      rot: (from && from.rot != null ? from.rot : 86.4) * (1 - ease),
    };
  }
""" + FUNCS + """  function beginPlay(target, petX) {
""")
save(p, js)
print("js funcs ok")
