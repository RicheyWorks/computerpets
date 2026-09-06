# -*- coding: utf-8 -*-
"""Rewrite copied Frill helpers into Cap warts helpers."""
from pathlib import Path

# --- CORE ---
core = Path("_cap_core.py").read_text(encoding="utf-8")
# docstring
core = core.replace("Apply Frill shelf leftover across window-play.js (mirror Rob #510).",
                    "Apply Cap warts leftover across window-play.js (mirror Frill #511).")

# headers: replace old/new tails entirely by rebuilding from current Frill state
old_header_old = '''HEADER_OLD_TAIL = (
    " Rob seizes a window stool as a grass perch: walk onto the stool, sit, seize once, sit the perch, then leave. "
    "Click still owns right. Relay still owns click. Haste still owns hunt. Dart still owns hawk. Sip still owns sip. Thrum still owns forage. Spine still owns bristle. Hook still owns soar. Leap still owns pounce. Hum still owns drone. "
    "This is the tenth leftover of the meadow den and closes meadow ten. Others walk a sill. */"
)

HEADER_NEW_TAIL = (
    " Rob seizes a window stool as a grass perch: walk onto the stool, sit, seize once, sit the perch, then leave. "
    "Click still owns right. Relay still owns click. Haste still owns hunt. Dart still owns hawk. Sip still owns sip. Thrum still owns forage. Spine still owns bristle. Hook still owns soar. Leap still owns pounce. Hum still owns drone. "
    "This is the tenth leftover of the meadow den and closes meadow ten. "
    "Frill shelves a sash stile as a timber shelf: walk onto the stile, sit, lean then bracket again, sit the shelf, then leave. "
    "Rob still owns seize. Fan still owns gold. Felt still owns lean. Cape still owns fold. Mast still owns seed. Auger still owns bore. Vein still owns unfurl. "
    "This is the first leftover of the fungi den. Others walk a sill. */"
)'''

new_header = '''HEADER_OLD_TAIL = (
    " Frill shelves a sash stile as a timber shelf: walk onto the stile, sit, lean then bracket again, sit the shelf, then leave. "
    "Rob still owns seize. Fan still owns gold. Felt still owns lean. Cape still owns fold. Mast still owns seed. Auger still owns bore. Vein still owns unfurl. "
    "This is the first leftover of the fungi den. Others walk a sill. */"
)

HEADER_NEW_TAIL = (
    " Frill shelves a sash stile as a timber shelf: walk onto the stile, sit, lean then bracket again, sit the shelf, then leave. "
    "Rob still owns seize. Fan still owns gold. Felt still owns lean. Cape still owns fold. Mast still owns seed. Auger still owns bore. Vein still owns unfurl. "
    "This is the first leftover of the fungi den. "
    "Cap warts a window apron as a moss cup: walk onto the apron, sit, wart once, sit the cup, then leave. "
    "Frill still owns shelf. Seven still owns spot. Sepia still owns flush. Rob still owns seize. Slip still owns ring. "
    "This is the second leftover of the fungi den. Others walk a sill. */"
)'''

if old_header_old not in core:
    raise SystemExit("core header block missing")
core = core.replace(old_header_old, new_header, 1)

# Replace SHELF_FNS block with WARTS_FNS
start = core.find("SHELF_FNS = r'''")
end = core.find("'''\n\ndef patch_js", start)
if start < 0 or end < 0:
    raise SystemExit("SHELF_FNS block missing")
warts_fns = r'''WARTS_FNS = r'''
  function wartsPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 34;
    const span = Math.max(0, win.width - size - pad * 2);
    // window apron — moss cup under the sill; not Frill's stile shelf, not Vault's grass plate, not Vee's blotter green
    const x = win.x + pad + span * 0.38;
    const apron = Math.max(24, Math.min(size * 0.14, win.height * 0.065));
    const gripY = win.y + win.height - apron;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 16, maxLift) };
  }

  function wartsFace(target) {
    return target.approachX >= target.holdX ? -1 : 1;
  }

  function wartsOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.38) * 0.68;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (toX >= fromX ? 1 : -1) * 1.28 * (1 - ease) + stride * 0.04,
    };
  }

  function wartsPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.18) {
      const s = t / 0.18;
      const ease = s * s * (3 - 2 * s);
      // rise the red — white gills, skirt, volva; a warning, not lunch
      return { x: ease * 0.35, lift: ease * 1.15, rot: ease * -5.4 };
    }
    if (t < 0.52) {
      const s = (t - 0.18) / 0.34;
      const wave = Math.sin(s * Math.PI * 2.15);
      // wart once — white veil scraps on the red; warts is the tell; not Seven spot, not Sepia flush
      return { x: 0.35 + wave * 2.4, lift: 1.15 + Math.abs(wave) * 2.85, rot: -5.4 + wave * 3.6 };
    }
    if (t < 0.78) {
      const s = (t - 0.52) / 0.26;
      const ease = s * s * (3 - 2 * s);
      // flush then warning again — trade with roots; the cup kept my red
      return { x: 0.35 - ease * 0.12, lift: 1.15 - ease * 0.48, rot: -5.4 + ease * 2.8 };
    }
    return { x: 0.23, lift: 0.67, rot: -2.6 };
  }

  function wartsHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.08;
    // sit the moss cup; spots record the warning
    return { x: 0.23, lift: 0.67 + hush, rot: -2.6 };
  }

  function wartsOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.32) * 0.82;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (from && from.rot != null ? from.rot : -2.6) * (1 - ease),
    };
  }

'''
core = core[:start] + warts_fns + core[end:]

# Now rewrite patch_js body replacements: Frill mirrored Rob; Cap mirrors Frill similarly.
# Replace the SEIZE->SHELF pattern with SHELF->WARTS pattern throughout patch_js.

replacements = [
    (
        """    text = must_replace(
        text,
        '  const SEIZE = "seize";\\n  const SILL = "sill";',
        '  const SEIZE = "seize";\\n  const SHELF = "shelf";\\n  const SILL = "sill";',
        "js SHELF const",
    )""",
        """    text = must_replace(
        text,
        '  const SHELF = "shelf";\\n  const SILL = "sill";',
        '  const SHELF = "shelf";\\n  const WARTS = "warts";\\n  const SILL = "sill";',
        "js WARTS const",
    )""",
    ),
    (
        """    text = must_replace(
        text,
        "    seizeOn: 2.58,\\n    seize: 1.68,\\n    seizeHold: 4.05,\\n    seizeOff: 2.48,",
        "    seizeOn: 2.58,\\n    seize: 1.68,\\n    seizeHold: 4.05,\\n    seizeOff: 2.48,\\n    shelfOn: 2.72,\\n    shelf: 2.05,\\n    shelfHold: 4.35,\\n    shelfOff: 2.62,",
        "js DUR shelf",
    )""",
        """    text = must_replace(
        text,
        "    shelfOn: 2.72,\\n    shelf: 2.05,\\n    shelfHold: 4.35,\\n    shelfOff: 2.62,",
        "    shelfOn: 2.72,\\n    shelf: 2.05,\\n    shelfHold: 4.35,\\n    shelfOff: 2.62,\\n    wartsOn: 2.64,\\n    warts: 1.88,\\n    wartsHold: 4.18,\\n    wartsOff: 2.55,",
        "js DUR warts",
    )""",
    ),
    (
        """    text = must_replace(
        text,
        '    if (key === "robber_fly") return SEIZE;\\n    return SILL;',
        '    if (key === "robber_fly") return SEIZE;\\n    if (key === "oyster") return SHELF;\\n    return SILL;',
        "js playFor oyster",
    )""",
        """    text = must_replace(
        text,
        '    if (key === "oyster") return SHELF;\\n    return SILL;',
        '    if (key === "oyster") return SHELF;\\n    if (key === "fly_agaric") return WARTS;\\n    return SILL;',
        "js playFor fly_agaric",
    )""",
    ),
    (
        """    text = must_replace(
        text,
        "    if (kind === SEIZE) return w.width >= 184 && w.height >= 152;",
        "    if (kind === SEIZE) return w.width >= 184 && w.height >= 152;\\n    if (kind === SHELF) return w.width >= 188 && w.height >= 204;",
        "js size gate",
    )""",
        """    text = must_replace(
        text,
        "    if (kind === SHELF) return w.width >= 188 && w.height >= 204;",
        "    if (kind === SHELF) return w.width >= 188 && w.height >= 204;\\n    if (kind === WARTS) return w.width >= 186 && w.height >= 148;",
        "js size gate",
    )""",
    ),
]

for old, new in replacements:
    if old not in core:
        raise SystemExit("missing replacement block: " + old[:80])
    core = core.replace(old, new, 1)

Path("_cap_core_part1.py").write_text(core, encoding="utf-8")
print("part1 written", len(core))
