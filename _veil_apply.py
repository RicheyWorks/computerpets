#!/usr/bin/env python3
"""Apply Veil leftover: rays a window apron as a reef ledge."""
from pathlib import Path
import re

ROOT = Path(".")

VEIL_SENTENCE = (
    "Veil rays a window apron as a reef ledge: walk onto the apron, fan the rays, then leave. "
    "Tube still owns papillae. Scrub still owns station. Scrape still owns rasps. Paint still owns bars. "
    "Wreath still owns tentacles. Ridge still owns valleys. Ochre still owns reef. "
    "This is the leftover after Tube. Seventh leftover of remaining reef/sea after well ten closed. "
    "Next leftover is Gate. Others walk a sill."
)

RAYS_FUNCS_JS = r'''
  function raysPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 30;
    const span = Math.max(0, win.width - size - pad * 2);
    // window apron as a reef ledge — sit the rays on the apron; she rays, she does not veil/lionfish/papillae/station/rasps/bars/tentacles/valleys/reef/many/soar; rays is the tell
    // not Tube sand-well papillae, not Scrub sash-well station, not Scrape rock-plate rasps, not Paint wreath-cup bars, not Wreath column-dish tentacles, not Ridge boulder-dish valleys, not Ochre damp-blotter reef, not Cap moss-cup warts, not Puff spore-dish cloud, not Vault grass plate, not Hook lamp-post soar
    const x = win.x + pad + span * 0.48;
    const apron = Math.max(26, Math.min(size * 0.15, win.height * 0.07));
    const gripY = win.y + win.height - apron;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 16, maxLift) };
  }

  function raysFace(target) {
    return target.approachX >= target.holdX ? -1 : 1;
  }

  function raysOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.41) * 1.57;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (toX >= fromX ? 1 : -1) * 2.48 * (1 - ease) + stride * 0.07,
    };
  }

  function raysPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.20) {
      const s = t / 0.20;
      const ease = s * s * (3 - 2 * s);
      // walk onto the apron — take the reef ledge; the rays; not Tube papillae, not Scrub station, not Scrape rasps, not Paint bars, not Wreath tentacles, not Ridge valleys, not Ochre reef
      return { x: ease * 0.19, lift: ease * 1.22, rot: ease * 3.4 };
    }
    if (t < 0.68) {
      const s = (t - 0.20) / 0.48;
      // fan/review the rays once — pectoral rays spread; she rays, she does not papillae/station/rasps/bars/tentacles/valleys/reef/soar; rays is the tell
      const fan = Math.sin(s * Math.PI * 2);
      return { x: 0.19 + fan * 0.27, lift: 1.22 + Math.abs(fan) * 0.48, rot: 3.4 + s * 4.1 };
    }
    if (t < 0.88) {
      const s = (t - 0.68) / 0.20;
      const ease = s * s * (3 - 2 * s);
      // remain a lionfish / hover-hold / review the rays
      return { x: 0.19 + ease * 0.09, lift: 1.22 + ease * 0.24, rot: 3.4 + ease * 1.72 };
    }
    return { x: 0.28, lift: 1.46, rot: 5.12 };
  }

  function raysHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.16;
    // sit the rays on the window apron as a reef ledge; she rays, she does not papillae
    return { x: 0.28, lift: 1.46 + hush, rot: 5.12 };
  }

  function raysOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.33) * 1.46;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (from && from.rot != null ? from.rot : 5.12) * (1 - ease),
    };
  }
'''

RAYS_FUNCS_TS = r'''
export function raysPoint(win: DeskWindow, sprite: number | undefined, work: WorkSpace) {
  const size = sprite == null ? SPRITE : sprite;
  const pad = 30;
  const span = Math.max(0, win.width - size - pad * 2);
  // window apron as a reef ledge — sit the rays on the apron; she rays, she does not veil/lionfish/papillae/station/rasps/bars/tentacles/valleys/reef/many/soar; rays is the tell
  // not Tube sand-well papillae, not Scrub sash-well station, not Scrape rock-plate rasps, not Paint wreath-cup bars, not Wreath column-dish tentacles, not Ridge boulder-dish valleys, not Ochre damp-blotter reef, not Cap moss-cup warts, not Puff spore-dish cloud, not Vault grass plate, not Hook lamp-post soar
  const x = win.x + pad + span * 0.48;
  const apron = Math.max(26, Math.min(size * 0.15, win.height * 0.07));
  const gripY = win.y + win.height - apron;
  const lift = gripLift(gripY, work);
  const maxLift = (work && work.height ? work.height : 800) - 48;
  return { x, lift: clamp(lift, 16, maxLift) };
}

export function raysFace(target: PlayTarget) {
  return target.approachX >= target.holdX ? -1 : 1;
}

export function raysOnPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.41) * 1.57;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (toX >= fromX ? 1 : -1) * 2.48 * (1 - ease) + stride * 0.07,
  };
}

export function raysPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  if (t < 0.20) {
    const s = t / 0.20;
    const ease = s * s * (3 - 2 * s);
    // walk onto the apron — take the reef ledge; the rays; not Tube papillae, not Scrub station, not Scrape rasps, not Paint bars, not Wreath tentacles, not Ridge valleys, not Ochre reef
    return { x: ease * 0.19, lift: ease * 1.22, rot: ease * 3.4 };
  }
  if (t < 0.68) {
    const s = (t - 0.20) / 0.48;
    // fan/review the rays once — pectoral rays spread; she rays, she does not papillae/station/rasps/bars/tentacles/valleys/reef/soar; rays is the tell
    const fan = Math.sin(s * Math.PI * 2);
    return { x: 0.19 + fan * 0.27, lift: 1.22 + Math.abs(fan) * 0.48, rot: 3.4 + s * 4.1 };
  }
  if (t < 0.88) {
    const s = (t - 0.68) / 0.20;
    const ease = s * s * (3 - 2 * s);
    // remain a lionfish / hover-hold / review the rays
    return { x: 0.19 + ease * 0.09, lift: 1.22 + ease * 0.24, rot: 3.4 + ease * 1.72 };
  }
  return { x: 0.28, lift: 1.46, rot: 5.12 };
}

export function raysHoldPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.16;
  // sit the rays on the window apron as a reef ledge; she rays, she does not papillae
  return { x: 0.28, lift: 1.46 + hush, rot: 5.12 };
}

export function raysOffPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.33) * 1.46;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (from && from.rot != null ? from.rot : 5.12) * (1 - ease),
  };
}
'''

RAYS_PHASE_JS = r'''
    if (next.phase === "rays-on") {
      const face = raysFace(target);
      const u = next.t / DUR.raysOn;
      const pose = raysOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot * face;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "rays", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "rays") {
      const face = raysFace(target);
      const pose = raysPath(Math.min(1, next.t / DUR.rays));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.rays) {
        return goPhase(next, "rays-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "rays-hold") {
      const face = raysFace(target);
      const pose = raysHoldPath(Math.min(1, next.t / DUR.raysHold));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.raysHold) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        const done = raysHoldPath(1);
        return goPhase(next, "rays-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "rays-off") {
      const u = next.t / DUR.raysOff;
      const pose = raysOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }
'''

RAYS_PHASE_TS = RAYS_PHASE_JS.replace("const face", "const face").replace("    if", "  if").replace("\n      ", "\n    ").replace("\n    if", "\n  if").replace("\n    }", "\n  }")
# Fix TS indentation more carefully below

RAYS_PICK_JS = r'''
    if (kind === RAYS) {
      const hold = raysPoint(best, size, work);
      const fromLeft = hold.x >= workW / 2;
      const approachOff = fromLeft ? -54 : 54;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 48 : -48;
      return {
        id: best.id,
        kind,
        side: "reefledge",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "rayed",
        spin: "none",
      };
    }
'''

def patch_header(text: str, is_ts: bool = False) -> str:
    old = "Next leftover is Veil. Others walk a sill."
    if old not in text:
        raise SystemExit("header Next leftover is Veil not found")
    suffix = " Same map as desktop `window-play.js`." if is_ts and "Same map" in text[text.find(old):text.find(old)+80] else ""
    # Preserve TS same-map suffix if present after sill.
    after = text[text.find(old) + len(old): text.find(old) + len(old) + 60]
    keep = ""
    if is_ts and after.startswith(" Same map"):
        keep = " Same map as desktop `window-play.js`."
        # old string in TS is "Next leftover is Veil. Others walk a sill. Same map..."
        old_ts = "Next leftover is Veil. Others walk a sill. Same map as desktop `window-play.js`."
        if old_ts in text:
            return text.replace(old_ts, VEIL_SENTENCE + " Same map as desktop `window-play.js`.", 1)
    return text.replace(old, VEIL_SENTENCE, 1)

def patch_js(path: Path) -> None:
    js = path.read_text(encoding="utf-8")
    js = patch_header(js, False)
    if "const RAYS" in js:
        raise SystemExit("RAYS already in JS")
    js = js.replace('  const PAPILLAE = "papillae";\n  const SILL = "sill";',
                    '  const PAPILLAE = "papillae";\n  const RAYS = "rays";\n  const SILL = "sill";', 1)
    js = js.replace(
        "    papillaeOff: 3.07,\n    sillHop: 0.38,",
        "    papillaeOff: 3.07,\n    raysOn: 3.09,\n    rays: 2.77,\n    raysHold: 6.01,\n    raysOff: 3.05,\n    sillHop: 0.38,",
        1,
    )
    js = js.replace(
        '    if (key === "sea_cucumber") return PAPILLAE;\n    return SILL;',
        '    if (key === "sea_cucumber") return PAPILLAE;\n    if (key === "lionfish") return RAYS;\n    return SILL;',
        1,
    )
    js = js.replace(
        "    if (kind === PAPILLAE) return w.width >= 189 && w.height >= 200;\n    return w.width >= 180 && w.height >= 70;",
        "    if (kind === PAPILLAE) return w.width >= 189 && w.height >= 200;\n    if (kind === RAYS) return w.width >= 187 && w.height >= 192;\n    return w.width >= 180 && w.height >= 70;",
        1,
    )
    # pickTarget after PAPILLAE block
    marker = '        leave: "papillaed",\n        spin: "none",\n      };\n    }\n    if (kind === WRAP) {'
    if marker not in js:
        raise SystemExit("pickTarget PAPILLAE marker missing")
    js = js.replace(marker, '        leave: "papillaed",\n        spin: "none",\n      };\n    }\n' + RAYS_PICK_JS + '    if (kind === WRAP) {', 1)
    # refit
    js = js.replace(
        "    if (target.kind === PAPILLAE) {\n      const hold = papillaePoint(win, sprite, work);\n      return { ...target, holdX: hold.x, holdLift: hold.lift };\n    }\n    if (target.kind === BURY) {",
        "    if (target.kind === PAPILLAE) {\n      const hold = papillaePoint(win, sprite, work);\n      return { ...target, holdX: hold.x, holdLift: hold.lift };\n    }\n    if (target.kind === RAYS) {\n      const hold = raysPoint(win, sprite, work);\n      return { ...target, holdX: hold.x, holdLift: hold.lift };\n    }\n    if (target.kind === BURY) {",
        1,
    )
    # helpers before beginPlay
    if "function beginPlay(target, petX)" not in js:
        raise SystemExit("beginPlay missing")
    js = js.replace("  function beginPlay(target, petX)", RAYS_FUNCS_JS + "\n  function beginPlay(target, petX)", 1)
    # approach
    js = js.replace(
        '        if (target.kind === PAPILLAE) {\n          return goPhase(next, "papillae-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n        }\n        if (target.kind === WRAP) {',
        '        if (target.kind === PAPILLAE) {\n          return goPhase(next, "papillae-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n        }\n        if (target.kind === RAYS) {\n          return goPhase(next, "rays-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n        }\n        if (target.kind === WRAP) {',
        1,
    )
    # phase machine before sill-hop
    sill = '    if (next.phase === "sill-hop") {'
    # insert after papillae-off block
    pap_off_end = '      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);\n      return next;\n    }\n    if (next.phase === "sill-hop") {'
    # There may be multiple land returns; find the papillae-off specific one
    idx = js.find('    if (next.phase === "papillae-off")')
    if idx < 0:
        raise SystemExit("papillae-off phase missing")
    idx2 = js.find('    if (next.phase === "sill-hop") {', idx)
    if idx2 < 0:
        raise SystemExit("sill-hop after papillae-off missing")
    js = js[:idx2] + RAYS_PHASE_JS + "\n" + js[idx2:]
    # exports
    js = js.replace("    PAPILLAE,\n    SILL,", "    PAPILLAE,\n    RAYS,\n    SILL,", 1)
    js = js.replace(
        "    papillaeOffPath,\n    pickTarget,",
        "    papillaeOffPath,\n    raysPoint,\n    raysFace,\n    raysOnPath,\n    raysPath,\n    raysHoldPath,\n    raysOffPath,\n    pickTarget,",
        1,
    )
    path.write_text(js, encoding="utf-8")
    print("patched JS")

def patch_ts(path: Path) -> None:
    ts = path.read_text(encoding="utf-8")
    ts = patch_header(ts, True)
    if "export const RAYS" in ts:
        raise SystemExit("RAYS already in TS")
    ts = ts.replace('export const PAPILLAE = "papillae";\nexport const SILL = "sill";',
                    'export const PAPILLAE = "papillae";\nexport const RAYS = "rays";\nexport const SILL = "sill";', 1)
    ts = ts.replace(
        "  papillaeOff: 3.07,\n  sillHop: 0.38,",
        "  papillaeOff: 3.07,\n  raysOn: 3.09,\n  rays: 2.77,\n  raysHold: 6.01,\n  raysOff: 3.05,\n  sillHop: 0.38,",
        1,
    )
    # WindowPlayKind union — insert | typeof RAYS after PAPILLAE
    if "typeof PAPILLAE" in ts and "typeof RAYS" not in ts:
        ts = ts.replace("typeof PAPILLAE |", "typeof PAPILLAE | typeof RAYS |", 1)
        if "typeof PAPILLAE |" not in ts and "| typeof PAPILLAE |" not in ts:
            # try without trailing pipe variants
            ts = ts.replace("| typeof PAPILLAE | typeof SILL", "| typeof PAPILLAE | typeof RAYS | typeof SILL", 1)
            ts = ts.replace("| typeof PAPILLAE | typeof IGNORE", "| typeof PAPILLAE | typeof RAYS | typeof IGNORE", 1)
            ts = ts.replace("| typeof PAPILLAE;", "| typeof PAPILLAE | typeof RAYS;", 1)
    ts = ts.replace(
        '  if (key === "sea_cucumber") return PAPILLAE;\n  return SILL;',
        '  if (key === "sea_cucumber") return PAPILLAE;\n  if (key === "lionfish") return RAYS;\n  return SILL;',
        1,
    )
    # size gate lives inside filter callback (4-space indent before if)
    old_size = "    if (kind === PAPILLAE) return w.width >= 189 && w.height >= 200;\n    return w.width >= 180 && w.height >= 70;"
    new_size = "    if (kind === PAPILLAE) return w.width >= 189 && w.height >= 200;\n    if (kind === RAYS) return w.width >= 187 && w.height >= 192;\n    return w.width >= 180 && w.height >= 70;"
    if old_size not in ts:
        raise SystemExit("TS size gate marker missing")
    ts = ts.replace(old_size, new_size, 1)
    # pickTarget — TS uses different indent
    marker = '      leave: "papillaed",\n      spin: "none",\n    };\n  }\n  if (kind === WRAP) {'
    pick_ts = RAYS_PICK_JS.replace("    if (kind === RAYS)", "  if (kind === RAYS)").replace("\n      ", "\n    ").replace("\n    }", "\n  }")
    # manual pick block for TS
    pick_ts = '''  if (kind === RAYS) {
    const hold = raysPoint(best, size, work);
    const fromLeft = hold.x >= workW / 2;
    const approachOff = fromLeft ? -54 : 54;
    const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
    const away = hold.x < workW / 2 ? 48 : -48;
    return {
      id: best.id,
      kind,
      side: "reefledge",
      holdX: hold.x,
      holdLift: hold.lift,
      approachX,
      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
      leave: "rayed",
      spin: "none",
    };
  }
'''
    if marker not in ts:
        raise SystemExit("TS pickTarget marker missing")
    ts = ts.replace(marker, '      leave: "papillaed",\n      spin: "none",\n    };\n  }\n' + pick_ts + '  if (kind === WRAP) {', 1)
    ts = ts.replace(
        "  if (target.kind === PAPILLAE) {\n    const hold = papillaePoint(win, sprite, work);\n    return { ...target, holdX: hold.x, holdLift: hold.lift };\n  }\n  if (target.kind === BURY) {",
        "  if (target.kind === PAPILLAE) {\n    const hold = papillaePoint(win, sprite, work);\n    return { ...target, holdX: hold.x, holdLift: hold.lift };\n  }\n  if (target.kind === RAYS) {\n    const hold = raysPoint(win, sprite, work);\n    return { ...target, holdX: hold.x, holdLift: hold.lift };\n  }\n  if (target.kind === BURY) {",
        1,
    )
    # helpers — insert before export function beginPlay or function beginPlay
    for needle in ["export function beginPlay", "function beginPlay"]:
        if needle in ts:
            # insert before first beginPlay that is the play begin
            idx = ts.find(needle)
            # prefer the one after papillaeOffPath
            idx2 = ts.find("export function papillaeOffPath")
            if idx2 > 0:
                idx3 = ts.find("\nexport function", idx2 + 10)
                # find beginPlay after papillae helpers
                idx = ts.find("export function beginPlay", idx2)
                if idx < 0:
                    idx = ts.find("\nfunction beginPlay", idx2)
            ts = ts[:idx] + RAYS_FUNCS_TS + "\n" + ts[idx:]
            break
    else:
        raise SystemExit("TS beginPlay missing")
    # approach
    ts = ts.replace(
        '    if (target.kind === PAPILLAE) {\n      return goPhase(next, "papillae-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n    }\n    if (target.kind === WRAP) {',
        '    if (target.kind === PAPILLAE) {\n      return goPhase(next, "papillae-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n    }\n    if (target.kind === RAYS) {\n      return goPhase(next, "rays-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n    }\n    if (target.kind === WRAP) {',
        1,
    )
    # phase — TS 2-space indent version
    phase_ts = '''  if (next.phase === "rays-on") {
    const face = raysFace(target);
    const u = next.t / DUR.raysOn;
    const pose = raysOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot * face;
    next.anim = "walk";
    next.facing = face;
    if (u >= 1) {
      return goPhase(next, "rays", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
    }
    return next;
  }

  if (next.phase === "rays") {
    const face = raysFace(target);
    const pose = raysPath(Math.min(1, next.t / DUR.rays));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "play";
    next.facing = face;
    if (next.t >= DUR.rays) {
      return goPhase(next, "rays-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
    }
    return next;
  }

  if (next.phase === "rays-hold") {
    const face = raysFace(target);
    const pose = raysHoldPath(Math.min(1, next.t / DUR.raysHold));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "sit";
    next.facing = face;
    if (next.t >= DUR.raysHold) {
      const leaveFace = target.landX >= target.holdX ? 1 : -1;
      const done = raysHoldPath(1);
      return goPhase(next, "rays-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
    }
    return next;
  }

  if (next.phase === "rays-off") {
    const u = next.t / DUR.raysOff;
    const pose = raysOffPath(Math.min(1, u), next.from, next.to);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = target.landX >= target.holdX ? 1 : -1;
    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
    return next;
  }

'''
    idx = ts.find('  if (next.phase === "papillae-off")')
    if idx < 0:
        raise SystemExit("TS papillae-off missing")
    idx2 = ts.find('  if (next.phase === "sill-hop") {', idx)
    if idx2 < 0:
        raise SystemExit("TS sill-hop missing")
    ts = ts[:idx2] + phase_ts + ts[idx2:]
    path.write_text(ts, encoding="utf-8")
    print("patched TS")

VEIL_TEST = r'''
test("Veil leftover rays a window apron as a reef ledge: walk onto the apron, fan the rays, then leave", () => {
  const WIN_B = { id: "pw2", x: 980, y: 90, width: 300, height: 360 };
  assert.equal(P.playFor("lionfish"), "rays");
  assert.equal(P.RAYS, "rays");
  assert.notEqual(P.playFor("lionfish"), "veil");
  assert.notEqual(P.playFor("lionfish"), "lionfish");
  assert.notEqual(P.playFor("lionfish"), "fins");
  assert.notEqual(P.playFor("lionfish"), "papillae");
  assert.notEqual(P.playFor("lionfish"), "station");
  assert.notEqual(P.playFor("lionfish"), "rasps");
  assert.notEqual(P.playFor("lionfish"), "bars");
  assert.notEqual(P.playFor("lionfish"), "tentacles");
  assert.notEqual(P.playFor("lionfish"), "valleys");
  assert.notEqual(P.playFor("lionfish"), "reef");
  assert.notEqual(P.playFor("lionfish"), "many");
  assert.notEqual(P.playFor("lionfish"), "soar");
  assert.notEqual(P.playFor("lionfish"), "sill");
  assert.equal(P.playFor("sea_cucumber"), "papillae");
  assert.equal(P.PAPILLAE, "papillae");
  assert.equal(P.playFor("cleaner_shrimp"), "station");
  assert.equal(P.STATION, "station");
  assert.equal(P.playFor("parrotfish"), "rasps");
  assert.equal(P.RASPS, "rasps");
  assert.equal(P.playFor("clownfish"), "bars");
  assert.equal(P.BARS, "bars");
  assert.equal(P.playFor("anemone"), "tentacles");
  assert.equal(P.TENTACLES, "tentacles");
  assert.equal(P.playFor("brain_coral"), "valleys");
  assert.equal(P.VALLEYS, "valleys");
  assert.equal(P.playFor("haloarchaea"), "blush");
  assert.equal(P.BLUSH, "blush");
  assert.equal(P.playFor("sea_star"), "reef");
  assert.equal(P.REEF, "reef");
  assert.equal(P.playFor("nexus"), "many");
  assert.equal(P.MANY, "many");
  assert.equal(P.playFor("halovore"), "frost");
  assert.equal(P.FROST, "frost");
  assert.equal(P.playFor("terminator"), "rim");
  assert.equal(P.RIM, "rim");
  assert.equal(P.playFor("ladybird"), "spot");
  assert.equal(P.SPOT, "spot");
  assert.equal(P.playFor("giant_clam"), "sill");
  const target = P.pickTarget([WIN], 80, "lionfish", WORK, P.SPRITE);
  assert.ok(target);
  assert.equal(target.kind, "rays");
  assert.equal(target.side, "reefledge");
  assert.equal(target.leave, "rayed");
  assert.notEqual(target.kind, "papillae");
  assert.notEqual(target.kind, "station");
  assert.notEqual(target.kind, "rasps");
  assert.notEqual(target.kind, "bars");
  assert.notEqual(target.kind, "tentacles");
  assert.notEqual(target.kind, "valleys");
  assert.notEqual(target.kind, "reef");
  assert.notEqual(target.kind, "sill");
  assert.ok(target.holdLift > 8, "it rays a window apron as a reef ledge");
  assert.ok(P.DUR.raysHold > P.DUR.rays * 1.2, "the hold is the sit; rays is the tell");
  assert.ok(P.DUR.raysOn > 1.0, "a walk onto the apron, not a cling");
  assert.ok(P.DUR.raysOn !== P.DUR.papillaeOn);
  assert.ok(P.DUR.raysOn !== P.DUR.stationOn);
  assert.ok(P.DUR.raysOn !== P.DUR.raspsOn);
  assert.ok(P.DUR.raysOn !== P.DUR.barsOn);
  assert.ok(P.DUR.raysOn !== P.DUR.tentaclesOn);
  assert.ok(P.DUR.raysOn !== P.DUR.valleysOn);
  assert.ok(P.DUR.raysOn !== P.DUR.blushOn);
  assert.ok(P.DUR.raysOn !== P.DUR.reefOn);
  assert.ok(P.DUR.raysOn !== P.DUR.sillHop);
  assert.ok(P.DUR.rays !== P.DUR.papillae);
  assert.ok(P.DUR.rays !== P.DUR.station);
  assert.ok(P.DUR.raysHold !== P.DUR.papillaeHold);
  assert.ok(P.DUR.raysOff !== P.DUR.papillaeOff);
  const rays = P.raysPoint(WIN, P.SPRITE, WORK);
  const papillae = P.papillaePoint(WIN, P.SPRITE, WORK);
  const station = P.stationPoint(WIN, P.SPRITE, WORK);
  const rasps = P.raspsPoint(WIN, P.SPRITE, WORK);
  const bars = P.barsPoint(WIN, P.SPRITE, WORK);
  const tentacles = P.tentaclesPoint(WIN, P.SPRITE, WORK);
  const valleys = P.valleysPoint(WIN, P.SPRITE, WORK);
  const blush = P.blushPoint(WIN, P.SPRITE, WORK);
  const tumble = P.tumblePoint(WIN, P.SPRITE, WORK);
  const trumpet = P.trumpetPoint(WIN, P.SPRITE, WORK);
  const many = P.manyPoint(WIN, P.SPRITE, WORK);
  const frost = P.frostPoint(WIN, P.SPRITE, WORK);
  const reef = P.reefPoint(WIN, P.SPRITE, WORK);
  const two = P.twoPoint(WIN, P.SPRITE, WORK);
  assert.ok(rays.lift > 8, "the window apron as a reef ledge, not the sky");
  assert.ok(Math.abs(rays.x - papillae.x) > 8 || Math.abs(rays.lift - papillae.lift) > 1, "not Tube sand-well papillae");
  assert.ok(Math.abs(rays.x - station.x) > 8 || Math.abs(rays.lift - station.lift) > 1, "not Scrub station-dish station");
  assert.ok(Math.abs(rays.x - rasps.x) > 8 || Math.abs(rays.lift - rasps.lift) > 1, "not Scrape rock-plate rasps");
  assert.ok(Math.abs(rays.x - bars.x) > 8 || Math.abs(rays.lift - bars.lift) > 1, "not Paint wreath-cup bars");
  assert.ok(Math.abs(rays.x - tentacles.x) > 8 || Math.abs(rays.lift - tentacles.lift) > 1, "not Wreath column-dish tentacles");
  assert.ok(Math.abs(rays.x - valleys.x) > 8 || Math.abs(rays.lift - valleys.lift) > 1, "not Ridge boulder-dish valleys");
  assert.ok(Math.abs(rays.x - blush.x) > 8 || Math.abs(rays.lift - blush.lift) > 1, "not Rose salt-pan blush");
  assert.ok(Math.abs(rays.x - tumble.x) > 8 || Math.abs(rays.lift - tumble.lift) > 1, "not Rod broth-cup tumble");
  assert.ok(Math.abs(rays.x - trumpet.x) > 8 || Math.abs(rays.lift - trumpet.lift) > 1, "not Bell trumpet-rim trumpet");
  assert.ok(Math.abs(rays.x - many.x) > 8 || Math.abs(rays.lift - many.lift) > 1, "not Knot paperweight many");
  assert.ok(Math.abs(rays.x - frost.x) > 8 || Math.abs(rays.lift - frost.lift) > 1, "not Brine salt-dish frost");
  assert.ok(Math.abs(rays.x - reef.x) > 8 || Math.abs(rays.lift - reef.lift) > 1, "not Ochre damp-blotter reef");
  assert.ok(Math.abs(rays.x - two.x) > 8 || Math.abs(rays.lift - two.lift) > 1, "not Spin wet-plate two");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "lionfish", WORK, P.SPRITE);
  assert.equal(tiny, null, "a real window apron, not a thin strip");
  const short = P.pickTarget([{ id: "short", x: 200, y: 80, width: 180, height: 80 }], 80, "lionfish", WORK, P.SPRITE);
  assert.equal(short, null, "a real window apron, not a short pane");
  const thin = P.pickTarget([{ id: "thin", x: 200, y: 80, width: 187, height: 191 }], 80, "lionfish", WORK, P.SPRITE);
  assert.equal(thin, null, "a real window apron, not a shorter apron");
  const okRays = P.pickTarget([{ id: "rays", x: 200, y: 80, width: 187, height: 192 }], 80, "lionfish", WORK, P.SPRITE);
  assert.ok(okRays, "a real window apron as a reef ledge");
  const shortW = P.pickTarget([{ id: "shortW", x: 200, y: 80, width: 186, height: 192 }], 80, "lionfish", WORK, P.SPRITE);
  assert.equal(shortW, null, "a real window apron, not a thinner apron");
  const tubeOk = P.pickTarget([{ id: "tube", x: 200, y: 80, width: 189, height: 200 }], 80, "sea_cucumber", WORK, P.SPRITE);
  assert.ok(tubeOk, "Tube still takes a window well");
  const scrubOk = P.pickTarget([{ id: "scrub", x: 200, y: 80, width: 191, height: 206 }], 80, "cleaner_shrimp", WORK, P.SPRITE);
  assert.ok(scrubOk, "Scrub still takes a sash well");
  const scrapeOk = P.pickTarget([{ id: "scrape", x: 200, y: 80, width: 193, height: 188 }], 80, "parrotfish", WORK, P.SPRITE);
  assert.ok(scrapeOk, "Scrape still takes a sill pan");
  const paintOk = P.pickTarget([{ id: "paint", x: 200, y: 80, width: 195, height: 176 }], 80, "clownfish", WORK, P.SPRITE);
  assert.ok(paintOk, "Paint still takes a sash pocket");
  const wreathOk = P.pickTarget([{ id: "wreath", x: 200, y: 80, width: 197, height: 182 }], 80, "anemone", WORK, P.SPRITE);
  assert.ok(wreathOk, "Wreath still takes a sash stile");
  const ridgeOk = P.pickTarget([{ id: "ridge", x: 200, y: 80, width: 199, height: 170 }], 80, "brain_coral", WORK, P.SPRITE);
  assert.ok(ridgeOk, "Ridge still takes a window stool");
  const roseOk = P.pickTarget([{ id: "rose", x: 200, y: 80, width: 194, height: 204 }], 80, "haloarchaea", WORK, P.SPRITE);
  assert.ok(roseOk, "Rose still takes a sash well");
  const knotOk = P.pickTarget([{ id: "knot", x: 200, y: 80, width: 194, height: 162 }], 80, "nexus", WORK, P.SPRITE);
  assert.ok(knotOk, "Knot still takes a window stool");
  const walkOn = P.raysOnPath(0.25, { x: 40, lift: 0 }, { x: rays.x, lift: rays.lift });
  const papillaeOn = P.papillaeOnPath(0.25, { x: 40, lift: 0 }, { x: papillae.x, lift: papillae.lift });
  const stationOn = P.stationOnPath(0.25, { x: 40, lift: 0 }, { x: station.x, lift: station.lift });
  const raspsOn = P.raspsOnPath(0.25, { x: 40, lift: 0 }, { x: rasps.x, lift: rasps.lift });
  const barsOn = P.barsOnPath(0.25, { x: 40, lift: 0 }, { x: bars.x, lift: bars.lift });
  const tentaclesOn = P.tentaclesOnPath(0.25, { x: 40, lift: 0 }, { x: tentacles.x, lift: tentacles.lift });
  const valleysOn = P.valleysOnPath(0.25, { x: 40, lift: 0 }, { x: valleys.x, lift: valleys.lift });
  assert.ok(walkOn.lift >= 0, "it walks onto the window apron as a reef ledge");
  assert.ok(walkOn.rot !== papillaeOn.rot, "a walk onto the apron, not Tube papillae");
  assert.ok(walkOn.rot !== stationOn.rot, "a walk onto the apron, not Scrub station");
  assert.ok(walkOn.rot !== raspsOn.rot, "a walk onto the apron, not Scrape rasps");
  assert.ok(walkOn.rot !== barsOn.rot, "a walk onto the apron, not Paint bars");
  assert.ok(walkOn.rot !== tentaclesOn.rot, "a walk onto the apron, not Wreath tentacles");
  assert.ok(walkOn.rot !== valleysOn.rot, "a walk onto the apron, not Ridge valleys");
  const raysPose = P.raysPath(0.3);
  const papillaePose = P.papillaePath(0.3);
  const stationPose = P.stationPath(0.3);
  const raspsPose = P.raspsPath(0.3);
  const barsPose = P.barsPath(0.3);
  const tentaclesPose = P.tentaclesPath(0.3);
  const valleysPose = P.valleysPath(0.3);
  const blushPose = P.blushPath(0.3);
  const tumblePose = P.tumblePath(0.3);
  const trumpetPose = P.trumpetPath(0.3);
  const manyPose = P.manyPath(0.3);
  const frostPose = P.frostPath(0.3);
  assert.ok(Math.abs(raysPose.lift) > 0.15 || Math.abs(raysPose.rot) > 0.8, "it rays once; rays is the tell");
  assert.ok(raysPose.rot !== papillaePose.rot, "rays, not papillae");
  assert.ok(raysPose.rot !== stationPose.rot, "rays, not station");
  assert.ok(raysPose.rot !== raspsPose.rot, "rays, not rasps");
  assert.ok(raysPose.rot !== barsPose.rot, "rays, not bars");
  assert.ok(raysPose.rot !== tentaclesPose.rot, "rays, not tentacles");
  assert.ok(raysPose.rot !== valleysPose.rot, "rays, not valleys");
  assert.ok(raysPose.rot !== blushPose.rot, "rays, not blush");
  assert.ok(raysPose.rot !== tumblePose.rot, "rays, not tumble");
  assert.ok(raysPose.rot !== trumpetPose.rot, "rays, not trumpet");
  assert.ok(raysPose.rot !== manyPose.rot, "rays, not many");
  assert.ok(raysPose.rot !== frostPose.rot, "rays, not frost");
  const hold = P.raysHoldPath(0.5);
  assert.ok(Math.abs(hold.rot - 5.12) < 0.2, "it holds the sit on the reef ledge");
  assert.ok(Math.abs(hold.x - 0.28) < 0.05, "it stays on the window apron");
  assert.ok(hold.lift > 0, "sit the rays, not a papillae");
  const off0 = P.raysOffPath(0, { x: rays.x, lift: rays.lift + 1.46, rot: 5.12 }, { x: rays.x + 50, lift: 0 });
  const offMid = P.raysOffPath(0.5, { x: rays.x, lift: rays.lift + 1.46, rot: 5.12 }, { x: rays.x + 50, lift: 0 });
  const off1 = P.raysOffPath(1, { x: rays.x, lift: rays.lift + 1.46, rot: 5.12 }, { x: rays.x + 50, lift: 0 });
  assert.ok(Math.abs(off0.x - rays.x) < 2);
  assert.ok(Math.abs(offMid.x - rays.x) > 8, "a walk leave off the reef ledge");
  assert.ok(Math.abs(off1.lift) < 3);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, P.SPRITE, { cmd: "idle" });
    assert.notEqual(play.phase, "papillae");
    assert.notEqual(play.phase, "station");
    assert.notEqual(play.phase, "rasps");
    assert.notEqual(play.phase, "bars");
    assert.notEqual(play.phase, "tentacles");
    assert.notEqual(play.phase, "valleys");
    assert.notEqual(play.phase, "blush");
    assert.notEqual(play.phase, "reef");
    assert.notEqual(play.phase, "sill-walk");
    if (play.phase === "rays") {
      assert.ok(play.lift !== undefined, "it rays on the reef ledge");
    }
  }
  assert.ok(seen.has("rays-on"));
  assert.ok(seen.has("rays"));
  assert.ok(seen.has("rays-hold"));
  assert.ok(seen.has("rays-off"));
  assert.ok(seen.has("approach") || seen.has("walk") || seen.has("land"));
  assert.equal(windowIds.size, 1, "one window; bounds-only");
  assert.equal(play.phase, "done");
});

test("a moved window refits Veil's reef-ledge rays; sleep, card, and hide abort; Veil never starts asleep", () => {
  assert.equal(P.canStart({ asleep: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ card: true, cmd: "idle" }), false);
  assert.equal(P.canStart({ hidden: true, cmd: "wander" }), false);
  assert.equal(P.shouldAbort({ cmd: "sleep" }), true);
  assert.equal(P.shouldAbort({ cmd: "hide" }), true);
  assert.equal(P.shouldAbort({ card: true, cmd: "idle" }), true);
  const target = P.pickTarget([WIN], 200, "lionfish", WORK, P.SPRITE);
  assert.ok(target);
  let play = P.beginPlay(target, target.approachX);
  for (let i = 0; i < 900 && play.phase !== "rays"; i++) {
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN], WORK, P.SPRITE, { cmd: "idle" });
  }
  assert.equal(play.phase, "rays");
  const beforeX = play.target.holdX;
  const moved = { ...WIN, x: WIN.x + 140 };
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });
  assert.equal(play.phase, "rays");
  assert.ok(Math.abs(play.target.holdX - beforeX) > 40, "refit follows the moved reef ledge");
  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });
  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "rays-off");
  assert.equal(play.abort, true);
});
'''

def patch_tests_cjs(path: Path) -> None:
    t = path.read_text(encoding="utf-8")
    t = t.replace(
        'const target = P.pickTarget([WIN], 80, "lionfish", WORK, P.SPRITE);',
        'const target = P.pickTarget([WIN], 80, "giant_clam", WORK, P.SPRITE);',
        1,
    )
    t = t.replace(
        '  assert.equal(P.playFor("lionfish"), "sill");\n  const target = P.pickTarget([WIN], 80, "sea_cucumber"',
        '  assert.equal(P.playFor("lionfish"), "rays");\n  const target = P.pickTarget([WIN], 80, "sea_cucumber"',
        1,
    )
    if 'test("Veil leftover rays' in t:
        raise SystemExit("Veil test already in cjs")
    t = t.rstrip() + "\n" + VEIL_TEST + "\n"
    path.write_text(t, encoding="utf-8")
    print("patched cjs tests")

def patch_tests_mjs(path: Path) -> None:
    t = path.read_text(encoding="utf-8")
    # generic sill guest pin — find lionfish in other-guests test if present
    # mjs may use different guest; search
    if 'pickTarget([WIN], 80, "lionfish"' in t:
        t = t.replace(
            'const target = P.pickTarget([WIN], 80, "lionfish", WORK, P.SPRITE);',
            'const target = P.pickTarget([WIN], 80, "giant_clam", WORK, P.SPRITE);',
            1,
        )
    t = t.replace(
        '  assert.equal(P.playFor("lionfish"), "sill");\n  const target = P.pickTarget([WIN], 80, "sea_cucumber"',
        '  assert.equal(P.playFor("lionfish"), "rays");\n  const target = P.pickTarget([WIN], 80, "sea_cucumber"',
        1,
    )
    if 'test("Veil leftover rays' in t:
        raise SystemExit("Veil test already in mjs")
    t = t.rstrip() + "\n" + VEIL_TEST + "\n"
    path.write_text(t, encoding="utf-8")
    print("patched mjs tests")

def patch_house(path: Path) -> None:
    t = path.read_text(encoding="utf-8")
    old_prefix = 'test("Tube leftover papillaes a window well as a sand well; sixth leftover of remaining reef/sea after well ten closed;'
    if old_prefix not in t:
        raise SystemExit("house test title missing")
    # Prepend Veil to the long test name
    t = t.replace(
        'test("Tube leftover papillaes a window well as a sand well; sixth leftover of remaining reef/sea after well ten closed;',
        'test("Veil leftover rays a window apron as a reef ledge; seventh leftover of remaining reef/sea after well ten closed; Tube leftover still papillaes a window well as a sand well; sixth leftover of remaining reef/sea after well ten closed;',
        1,
    )
    # also update "Next leftover is Veil" if present in the long name
    t = t.replace("Next leftover is Veil", "Next leftover is Gate")
    block = '''  assert.equal(WP.playFor("lionfish"), "rays");
  assert.equal(WP.RAYS, "rays");
  assert.notEqual(WP.playFor("lionfish"), "veil");
  assert.notEqual(WP.playFor("lionfish"), "lionfish");
  assert.notEqual(WP.playFor("lionfish"), "fins");
  assert.notEqual(WP.playFor("lionfish"), "papillae");
  assert.notEqual(WP.playFor("lionfish"), "station");
  assert.notEqual(WP.playFor("lionfish"), "rasps");
  assert.notEqual(WP.playFor("lionfish"), "bars");
  assert.notEqual(WP.playFor("lionfish"), "tentacles");
  assert.notEqual(WP.playFor("lionfish"), "valleys");
  assert.notEqual(WP.playFor("lionfish"), "reef");
  assert.notEqual(WP.playFor("lionfish"), "many");
  assert.notEqual(WP.playFor("lionfish"), "soar");
  assert.notEqual(WP.playFor("lionfish"), "sill");
  assert.equal(WP.playFor("sea_cucumber"), "papillae");
  assert.equal(WP.PAPILLAE, "papillae");
  assert.equal(WP.playFor("cleaner_shrimp"), "station");
  assert.equal(WP.playFor("parrotfish"), "rasps");
  assert.equal(WP.playFor("nexus"), "many");
  assert.equal(WP.playFor("giant_clam"), "sill");
});'''
    old = '''  assert.equal(WP.playFor("lionfish"), "sill");
});'''
    if old not in t:
        raise SystemExit("house lionfish sill pin missing")
    t = t.replace(old, block, 1)
    path.write_text(t, encoding="utf-8")
    print("patched house test")

def patch_docs() -> None:
    # ARCHITECTURE last updated
    arch = Path("docs/ARCHITECTURE.md")
    a = arch.read_text(encoding="utf-8")
    a = re.sub(
        r"(\| \*\*Last Updated\*\* \| )2026-09-02 \([^)]+\)",
        r"\g<1>2026-09-02 (Veil leftover rays a window apron as a reef ledge; seventh leftover of remaining reef/sea after well ten closed; Tube leftover still papillaes a window well as a sand well; catalog 220)",
        a,
        count=1,
    )
    arch.write_text(a, encoding="utf-8")

    road = Path("docs/ROADMAP.md")
    r = road.read_text(encoding="utf-8")
    tube_line = None
    for line in r.splitlines():
        if "Tube (`sea_cucumber`" in line and "papillaes" in line:
            tube_line = line
            break
    if not tube_line:
        raise SystemExit("Tube roadmap line missing")
    veil_line = (
        "- [x] Veil (`lionfish` / `veil`) rays a real window apron as a reef ledge: walk onto the apron "
        "(window apron — she rays, she does not veil/lionfish/papillae/station/rasps/bars/tentacles/valleys/reef/many/soar; "
        "a red lionfish; not Tube sand-well papillae, not Scrub station-dish station, not Scrape rock-plate rasps, "
        "not Paint wreath-cup bars, not Wreath column-dish tentacles, not Ridge boulder-dish valleys, not Ochre damp-blotter reef, "
        "not Cap moss-cup warts, not Hook lamp-post soar; The fins are the tell / Review the rays). "
        "Catalog stays 220. Next leftover is Gate (`giant_clam`). Do not start Gate."
    )
    if "Veil (`lionfish`" not in r:
        r = r.replace(tube_line, tube_line + "\n" + veil_line, 1)
    # Last Updated footer
    r = re.sub(
        r"\*\*Last Updated:\*\* 2026-09-02 \([^)]+\)",
        "**Last Updated:** 2026-09-02 (Phase 6 leftover: Veil leftover rays a window apron as a reef ledge; seventh leftover of remaining reef/sea after well ten closed; Tube leftover still papillaes; catalog 220)",
        r,
        count=1,
    )
    road.write_text(r, encoding="utf-8")

    # README — append brief Veil note near Tube if present, else near the Windows overlay sentence
    for readme in [Path("README.md"), Path("desktop/README.md")]:
        txt = readme.read_text(encoding="utf-8")
        needle = "Tube papillaes"
        if "Veil rays" in txt:
            continue
        if needle in txt:
            txt = txt.replace(needle, "Veil rays a window apron as a reef ledge. Tube papillaes", 1)
        else:
            # find a unique short marker in the long Windows sentence
            mark = "then drop or dive back to the desk."
            if mark in txt and "Veil rays" not in txt:
                txt = txt.replace(
                    mark,
                    mark + " Veil rays a window apron as a reef ledge (The fins are the tell).",
                    1,
                )
            else:
                mark2 = "First click is a sit."
                if mark2 in txt:
                    pass  # desktop README may differ
                mark3 = "Hits stay on the pet"
                if mark3 in txt and "Veil rays" not in txt:
                    # insert after first sentence of that paragraph's Tube mention if any
                    idx = txt.find(mark3)
                    # append near Tube/Scrub mention if found later in same paragraph
                    para_end = txt.find("\n\n", idx)
                    chunk = txt[idx:para_end]
                    if "Tube" in chunk:
                        txt = txt[:idx] + chunk.replace("Tube", "Veil rays a window apron as a reef ledge. Tube", 1) + txt[para_end:]
                    elif "Veil rays" not in txt:
                        txt = txt[:para_end] + " Veil rays a window apron as a reef ledge." + txt[para_end:]
        readme.write_text(txt, encoding="utf-8")
    print("patched docs")

def main():
    patch_js(Path("desktop/renderer/window-play.js"))
    patch_ts(Path("web/src/lib/pets/window-play.ts"))
    patch_tests_cjs(Path("desktop/renderer/window-play.test.cjs"))
    patch_tests_mjs(Path("web/scripts/window-play.test.mjs"))
    patch_house(Path("desktop/renderer/leftover-house.test.cjs"))
    patch_docs()
    print("DONE")

if __name__ == "__main__":
    main()
