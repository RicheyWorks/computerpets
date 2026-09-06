from pathlib import Path

ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")

def sub_once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit("%s: expected 1 occurrence, found %d" % (label, n))
    return text.replace(old, new, 1)

JS_FUNCS = r'''
  function knobsPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 32;
    const span = Math.max(0, win.width - size - pad * 2);
    const x = win.x + pad + span * 0.23;
    const stool = Math.max(14, size * 0.09);
    const gripY = win.y + win.height - stool;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 18, maxLift) };
  }

  function knobsFace(target) {
    return target.approachX >= target.holdX ? -1 : 1;
  }

  function knobsOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.71) * 2.33;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (toX >= fromX ? 1 : -1) * 4.05 * (1 - ease) + stride * 0.13,
    };
  }

  function knobsPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.30) {
      const s = t / 0.30;
      const ease = s * s * (3 - 2 * s);
      return { x: ease * 0.5, lift: ease * -3.9, rot: ease * 10.4 };
    }
    if (t < 0.76) {
      const s = (t - 0.30) / 0.46;
      const pulse = Math.sin(s * Math.PI);
      return { x: 0.5 + pulse * 0.6, lift: -3.9 + pulse * 0.9, rot: 10.4 + pulse * 2.1 };
    }
    return { x: 0.6, lift: -3.5, rot: 11.2 };
  }

  function knobsHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.20;
    return { x: 0.6, lift: -3.5 + hush, rot: 11.2 };
  }

  function knobsOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.59) * 2.15;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (from && from.rot != null ? from.rot : 11.2) * (1 - ease),
    };
  }

'''

TS_FUNCS = r'''
export function knobsPoint(win: DeskWindow, sprite: number | undefined, work: WorkSpace) {
  const size = sprite == null ? SPRITE : sprite;
  const pad = 32;
  const span = Math.max(0, win.width - size - pad * 2);
  const x = win.x + pad + span * 0.23;
  const stool = Math.max(14, size * 0.09);
  const gripY = win.y + win.height - stool;
  const lift = gripLift(gripY, work);
  const maxLift = (work && work.height ? work.height : 800) - 48;
  return { x, lift: clamp(lift, 18, maxLift) };
}

export function knobsFace(target: PlayTarget) {
  return target.approachX >= target.holdX ? -1 : 1;
}

export function knobsOnPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.71) * 2.33;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (toX >= fromX ? 1 : -1) * 4.05 * (1 - ease) + stride * 0.13,
  };
}

export function knobsPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  if (t < 0.30) {
    const s = t / 0.30;
    const ease = s * s * (3 - 2 * s);
    return { x: ease * 0.5, lift: ease * -3.9, rot: ease * 10.4 };
  }
  if (t < 0.76) {
    const s = (t - 0.30) / 0.46;
    const pulse = Math.sin(s * Math.PI);
    return { x: 0.5 + pulse * 0.6, lift: -3.9 + pulse * 0.9, rot: 10.4 + pulse * 2.1 };
  }
  return { x: 0.6, lift: -3.5, rot: 11.2 };
}

export function knobsHoldPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.20;
  return { x: 0.6, lift: -3.5 + hush, rot: 11.2 };
}

export function knobsOffPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.59) * 2.15;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (from && (from as { rot?: number }).rot != null ? (from as { rot?: number }).rot : 11.2) * (1 - ease),
  };
}

'''

def patch_js():
    p = ROOT / "desktop" / "renderer" / "window-play.js"
    t = p.read_text(encoding="utf-8")
    t = sub_once(
        t,
        '''      rot: (from && from.rot != null ? from.rot : 14.8) * (1 - ease),
    };
  }


  function beginPlay(target, petX) {''',
        '''      rot: (from && from.rot != null ? from.rot : 14.8) * (1 - ease),
    };
  }

''' + JS_FUNCS + '''
  function beginPlay(target, petX) {''',
        "js funcs",
    )
    t = sub_once(
        t,
        '''        if (target.kind === SPINES) {
          return goPhase(next, "spines-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === WRAP) {''',
        '''        if (target.kind === SPINES) {
          return goPhase(next, "spines-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === KNOBS) {
          return goPhase(next, "knobs-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === WRAP) {''',
        "js approach",
    )
    t = sub_once(
        t,
        "    FLAT,\n    SPINES,\n    IGNORE,",
        "    FLAT,\n    SPINES,\n    KNOBS,\n    IGNORE,",
        "js export const",
    )
    t = sub_once(
        t,
        '''    spinesOnPath,
    spinesPath,
    spinesHoldPath,
    spinesOffPath,
    pickTarget,''',
        '''    spinesOnPath,
    spinesPath,
    spinesHoldPath,
    spinesOffPath,
    knobsPoint,
    knobsFace,
    knobsOnPath,
    knobsPath,
    knobsHoldPath,
    knobsOffPath,
    pickTarget,''',
        "js export funcs",
    )
    p.write_text(t, encoding="utf-8", newline="\n")
    print("js funcs/approach/export ok")

def patch_ts():
    p = ROOT / "web" / "src" / "lib" / "pets" / "window-play.ts"
    t = p.read_text(encoding="utf-8")
    t = sub_once(
        t,
        '''    rot: (from && (from as { rot?: number }).rot != null ? (from as { rot?: number }).rot : 14.8) * (1 - ease),
  };
}


export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {''',
        '''    rot: (from && (from as { rot?: number }).rot != null ? (from as { rot?: number }).rot : 14.8) * (1 - ease),
  };
}

''' + TS_FUNCS + '''
export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {''',
        "ts funcs",
    )
    t = sub_once(
        t,
        '''      if (target.kind === SPINES) {
        return goPhase(next, "spines-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {''',
        '''      if (target.kind === SPINES) {
        return goPhase(next, "spines-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === KNOBS) {
        return goPhase(next, "knobs-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {''',
        "ts approach",
    )
    p.write_text(t, encoding="utf-8", newline="\n")
    print("ts funcs/approach ok")

if __name__ == "__main__":
    patch_js()
    patch_ts()
    print("part3 done")
