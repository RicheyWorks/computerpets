#!/usr/bin/env python3
"""Paint honest pond sprites and append the desktop roster.

The pond needs distinct Animalia — Reed is not Pebble, Eft is not Sol,
Slip is not a worm, Pinch is not Comb, Whorl grew her shell.
These frames are painted specimen plates on black, then copied to the
Electron overlay. Portraits sit the same plate on the study blotter.
Bloom stays the only axolotl. Do not reuse her gills.
"""

from __future__ import annotations

import json
import math
import os
import re
import shutil
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[2]
WEB_SPRITES = ROOT / "web" / "public" / "sprites"
WEB_PETS = ROOT / "web" / "public" / "pets"
DESK_SPRITES = ROOT / "desktop" / "renderer" / "sprites"
ROSTER_PATH = ROOT / "desktop" / "renderer" / "roster.json"
POND_TS = ROOT / "web" / "src" / "lib" / "pets" / "pond.ts"
HABITAT = ROOT / "web" / "public" / "habitat.jpg"

OUT = 512
HI = 1024
ANIMS = {
    "idle": 4,
    "walk": 6,
    "sit": 4,
    "sleep": 4,
    "talk": 4,
    "eat": 4,
    "play": 4,
}

KEYS = [
    "frog",
    "toad",
    "newt",
    "salamander",
    "caecilian",
    "crayfish",
    "pond_snail",
    "mussel",
    "leech",
    "stickleback",
]

LATIN = {
    "frog": "Lithobates clamitans",
    "toad": "Anaxyrus americanus",
    "newt": "Notophthalmus viridescens",
    "salamander": "Ambystoma maculatum",
    "caecilian": "Typhlonectes natans",
    "crayfish": "Cambarus bartonii",
    "pond_snail": "Lymnaea stagnalis",
    "mussel": "Elliptio complanata",
    "leech": "Haemopis sanguisuga",
    "stickleback": "Gasterosteus aculeatus",
}


def pose_for(key: str, anim: str, i: int, n: int) -> dict:
    u = i / max(1, n - 1)
    wave = math.sin(i * 1.15)
    pose = {
        "dx": 0.0,
        "dy": 0.0,
        "rot": 0.0,
        "scale": 1.0,
        "glow": 0.0,
        "open": 0.0,
        "dim": 1.0,
        "hop": 0.0,
    }
    sitters = ("pond_snail", "mussel")
    if anim == "idle":
        pose["rot"] = wave * (1.2 if key not in sitters else 0.3)
        if key in ("frog", "toad"):
            pose["dy"] = abs(wave) * 1.2
        if key in ("newt", "leech", "caecilian", "stickleback"):
            pose["dx"] = wave * 2
        if key == "mussel":
            pose["open"] = 0.12 + 0.08 * (0.5 + 0.5 * math.sin(i * 1.4))
    elif anim == "walk":
        if key == "frog":
            pose["hop"] = abs(wave)
            pose["dy"] = -10 * pose["hop"]
            pose["dx"] = wave * 10
        elif key == "toad":
            pose["hop"] = abs(wave) * 0.55
            pose["dy"] = -5 * pose["hop"]
            pose["dx"] = wave * 6
        elif key == "stickleback":
            pose["dx"] = wave * 12
            pose["dy"] = wave * 3
            pose["rot"] = wave * 2
        elif key == "crayfish":
            pose["dx"] = -wave * 8
            pose["rot"] = wave * 1.4
        elif key in ("caecilian", "leech"):
            pose["dx"] = wave * 10
            pose["rot"] = wave * 4
        elif key == "pond_snail":
            pose["dx"] = wave * 2
        elif key == "mussel":
            pose["dx"] = wave * 0.6
            pose["open"] = 0.1
        else:
            pose["dx"] = wave * 7
            pose["dy"] = abs(wave) * 2
    elif anim == "sit":
        pose["dy"] = 14
        pose["scale"] = 0.96
        pose["rot"] = -2
        if key == "mussel":
            pose["open"] = 0.04
        if key == "toad":
            pose["scale"] = 1.04
    elif anim == "sleep":
        pose["rot"] = -8
        pose["dy"] = 20
        pose["dim"] = 0.78
        if key == "mussel":
            pose["open"] = 0.0
    elif anim == "talk":
        pose["dy"] = -3 + wave * 2
        if key == "frog":
            pose["glow"] = 0.3 + 0.2 * (i % 2)
            pose["scale"] = 1.02 + 0.03 * (i % 2)
        if key == "toad":
            pose["scale"] = 1.06 + 0.04 * (i % 2)
    elif anim == "eat":
        pose["dy"] = 8
        pose["rot"] = 2 + wave * 2
        if key == "mussel":
            pose["open"] = 0.35
        if key == "pond_snail":
            pose["rot"] = 6
    elif anim == "play":
        if key == "frog":
            pose["hop"] = 0.8 + 0.2 * abs(math.sin(u * math.pi))
            pose["dy"] = -16 * pose["hop"]
            pose["dx"] = wave * 8
        elif key == "crayfish":
            pose["rot"] = wave * 10
            pose["dx"] = -wave * 10
        elif key == "stickleback":
            pose["dx"] = wave * 16
            pose["rot"] = wave * 6
            pose["dy"] = -6 + wave * 4
        elif key == "mussel":
            pose["open"] = 0.55
        else:
            pose["rot"] = wave * 6
            pose["dy"] = -8 + wave * 3
    return pose


def _c(rgb, dim, a=255):
    return tuple(max(0, min(255, int(c * dim))) for c in rgb) + (a,)


def paint_pond(key: str, anim: str, index: int) -> Image.Image:
    n = ANIMS[anim]
    pose = pose_for(key, anim, index, n)
    img = Image.new("RGBA", (HI, HI), (0, 0, 0, 255))
    d = ImageDraw.Draw(img, "RGBA")
    cx, cy = HI / 2 + pose["dx"] * 2, HI / 2 + 48 + pose["dy"] * 2
    s = 2.2 * pose["scale"]
    rot = math.radians(pose["rot"])
    dim = pose["dim"]
    open_amt = pose["open"]

    def xf(x, y):
        x, y = x * s, y * s
        return cx + x * math.cos(rot) - y * math.sin(rot), cy + x * math.sin(rot) + y * math.cos(rot)

    def ell(x, y, rx, ry, rgb, a=255):
        X, Y = xf(x, y)
        rx, ry = rx * s, ry * s
        d.ellipse((X - rx, Y - ry, X + rx, Y + ry), fill=_c(rgb, dim, a))

    def ln(x0, y0, x1, y1, rgb, w=2, a=255):
        A, B = xf(x0, y0)
        C, D = xf(x1, y1)
        d.line((A, B, C, D), fill=_c(rgb, dim, a), width=max(1, int(w * s)))

    def poly(pts, rgb, a=220):
        d.polygon([xf(*p) for p in pts], fill=_c(rgb, dim, a))

    if key == "frog":
        # Long hind legs, smooth damp green, tympanum. Not a toad.
        green, pale, dark = (72, 140, 80), (196, 220, 168), (32, 64, 40)
        poly([(-6, 10), (-28, 22), (-18, 8), (-4, 6)], green, 230)
        poly([(6, 10), (28, 22), (18, 8), (4, 6)], green, 230)
        poly([(-10, 8), (-8, 20), (-2, 18)], pale, 200)
        poly([(10, 8), (8, 20), (2, 18)], pale, 200)
        ell(0, 2, 18, 12, green, 235)
        ell(0, 6, 12, 7, pale, 210)
        ell(-10, -10, 10, 9, green, 235)
        ell(2, -8, 8, 7, green, 220)
        ell(-12, -12, 3.2, 3.2, (28, 28, 24), 240)
        ell(-4, -8, 4, 4, (48, 88, 56), 180)
        ln(-18, 8, -26, 4, dark, 2)
        ln(-16, 12, -24, 14, dark, 2)
        ln(16, 8, 24, 4, dark, 2)
        ln(14, 12, 22, 14, dark, 2)
    elif key == "toad":
        # Squat, warty, parotoids. Not a frog.
        brown, cream, wart = (140, 100, 64), (212, 188, 148), (96, 68, 44)
        ell(0, 6, 20, 14, brown, 235)
        ell(0, 10, 12, 7, cream, 200)
        ell(-2, -6, 12, 10, brown, 235)
        ell(-10, -8, 5, 4, wart, 220)
        ell(6, -6, 4.5, 3.6, wart, 210)
        for x, y, r in ((-8, 4, 2.2), (6, 6, 2), (0, 2, 1.8), (10, 8, 1.6), (-12, 10, 1.8)):
            ell(x, y, r, r * 0.8, wart, 200)
        ell(-8, -8, 2.6, 2.6, (28, 24, 20), 240)
        poly([(-8, 14), (-14, 20), (-6, 16)], brown, 220)
        poly([(8, 14), (14, 20), (6, 16)], brown, 220)
        poly([(-16, 4), (-20, 10), (-14, 8)], brown, 200)
        poly([(16, 4), (20, 10), (14, 8)], brown, 200)
    elif key == "newt":
        # Orange eft / aquatic newt. Flattened tail. Not a lizard. No gills.
        orange, spot, tail = (220, 92, 48), (236, 212, 160), (188, 72, 40)
        poly([(10, 2), (34, -2), (36, 6), (12, 8)], tail, 220)
        poly([(18, 0), (32, -6), (30, 2)], (244, 160, 88), 180)
        ell(0, 4, 16, 7, orange, 235)
        ell(-14, 0, 8, 6, orange, 235)
        for x, y in ((-6, 2), (2, 0), (8, 4), (-2, 6)):
            ell(x, y, 1.8, 1.6, spot, 230)
        ell(-16, -2, 2.4, 2.4, (28, 20, 16), 240)
        ln(-8, 8, -12, 12, orange, 2)
        ln(-4, 8, -4, 13, orange, 2)
        ln(4, 8, 6, 12, orange, 2)
        ln(8, 8, 12, 12, orange, 2)
    elif key == "salamander":
        # Black with yellow coins. No gills. Not Eft. Not Bloom.
        ink, coin, belly = (28, 28, 32), (232, 196, 56), (48, 44, 40)
        poly([(12, 2), (30, 0), (32, 6), (12, 8)], ink, 230)
        ell(0, 4, 18, 8, ink, 240)
        ell(0, 7, 10, 4, belly, 200)
        ell(-16, 0, 9, 7, ink, 240)
        for x, y in ((-8, 0), (2, -2), (10, 2), (-2, 6), (6, 6)):
            ell(x, y, 2.6, 2.2, coin, 235)
        ell(-18, -2, 2.4, 2.4, (16, 16, 14), 240)
        ln(-10, 10, -14, 14, ink, 2)
        ln(-4, 10, -4, 15, ink, 2)
        ln(4, 10, 6, 14, ink, 2)
        ln(10, 10, 14, 14, ink, 2)
    elif key == "caecilian":
        # Rings, a jaw, tiny eyes. An amphibian. Not a worm. Not a leech.
        slate, ring, jaw = (88, 96, 100), (64, 72, 76), (48, 52, 56)
        pts = [(-28 + t * 8, math.sin(t * 0.7 + index * 0.4) * 3) for t in range(9)]
        for k, (x, y) in enumerate(pts):
            t = k / 8
            ell(x, y, 7 - t * 2.4, 5.2 - t * 1.4, slate if k % 2 == 0 else ring, 230)
            if 0 < k < 8:
                ln(x - 6, y - 3, x - 6, y + 3, jaw, 1, 140)
        hx, hy = pts[0]
        ell(hx - 2, hy - 1, 8, 6, slate, 235)
        ell(hx - 4, hy + 2, 5, 2.4, jaw, 200)
        ell(hx - 2, hy - 3, 1.4, 1.4, (20, 20, 18), 220)
    elif key == "crayfish":
        # Ten legs, two claws, a tail fan. A crustacean. Not an insect.
        rust, claw, cream = (180, 64, 48), (156, 48, 36), (220, 180, 140)
        poly([(8, 2), (26, -4), (30, 2), (26, 8), (8, 8)], rust, 220)
        poly([(22, -2), (32, -8), (28, 0)], cream, 180)
        poly([(22, 6), (32, 12), (28, 4)], cream, 180)
        ell(-2, 2, 14, 8, rust, 235)
        ell(-4, 4, 8, 4, cream, 180)
        poly([(-16, -2), (-30, -10), (-22, 0), (-16, 4)], claw, 230)
        poly([(-16, 6), (-28, 14), (-20, 6), (-16, 2)], claw, 230)
        ell(-18, -6, 5, 3.2, rust, 230)
        ell(-18, 10, 5, 3.2, rust, 230)
        for ox, oy in ((-8, 10), (-2, 12), (6, 12), (12, 10)):
            ln(ox, 8, ox - 2, oy + 4, rust, 2)
        ell(-10, 0, 2.2, 2.2, (28, 16, 12), 240)
    elif key == "pond_snail":
        # Tall spiral she grew. Not Tenant's borrowed shell. Not a nautilus.
        shell, lip, body = (148, 132, 88), (212, 196, 148), (120, 108, 72)
        ell(6, -4, 16, 20, shell, 235)
        ell(8, -6, 10, 13, (168, 152, 104), 210)
        ell(9, -8, 5, 7, lip, 190)
        ell(10, -10, 2.2, 3, (88, 76, 48), 180)
        ln(6, -20, 8, 12, (88, 76, 48), 1, 140)
        ell(-10, 8, 10, 6, body, 230)
        ell(-16, 8, 4, 3, (72, 64, 48), 200)
    elif key == "mussel":
        # Two dark valves, a pale hinge, a siphon. Freshwater. Not the tide.
        valve, hinge, siphon = (72, 56, 44), (196, 180, 148), (168, 156, 132)
        gap = 3 + open_amt * 10
        poly([(-4, -18), (8, -14), (12, 4), (4, 18), (-8, 12), (-12, -4)], valve, 230)
        poly([(-4 + gap, -16), (10 + gap, -10), (14 + gap, 6), (6 + gap, 16), (-2 + gap, 8)], (56, 44, 36), 220)
        ln(-2, -8, 6, -4, hinge, 3)
        if open_amt > 0.15:
            ell(10 + gap, -8, 2.4, 5, siphon, 200)
            ell(12 + gap, -2, 1.8, 4, siphon, 180)
    elif key == "leech":
        # Flat ribbon, suckers, segments. Hunts worms. Not Slip. Not a blood rumor.
        olive, seg, sucker = (80, 72, 48), (56, 52, 36), (48, 40, 32)
        pts = [(-26 + t * 7, math.sin(t * 0.8 + index * 0.5) * 4) for t in range(9)]
        for k, (x, y) in enumerate(pts):
            t = k / 8
            ell(x, y, 8 - t * 1.6, 3.6, olive if k % 2 == 0 else seg, 230)
        hx, hy = pts[0]
        tx, ty = pts[-1]
        ell(hx - 2, hy, 5, 4, sucker, 220)
        ell(tx + 1, ty, 4, 3.2, sucker, 210)
    else:
        # Three-spined stickleback. Not Coin. A nest fish, not a bowl loop.
        silver, olive, spine = (120, 148, 128), (72, 100, 84), (40, 48, 40)
        poly([(16, 0), (34, -8), (32, 8)], olive, 220)
        ell(0, 2, 18, 9, silver, 235)
        ell(2, 5, 10, 4, (196, 212, 188), 180)
        ln(-2, -8, -2, -18, spine, 2)
        ln(4, -8, 4, -16, spine, 2)
        ln(10, -7, 10, -14, spine, 2)
        ell(-12, 0, 2.4, 2.4, (20, 24, 20), 240)
        poly([(-4, -8), (2, -14), (6, -8)], olive, 200)
        poly([(-2, 10), (6, 16), (8, 10)], olive, 200)

    return img.resize((OUT, OUT), Image.Resampling.LANCZOS)


def write_sprites():
    from house_walkers import PHOTO_KEEP, knockout_kind, write_kind
    for key in KEYS:
        if key in PHOTO_KEEP:
            knockout_kind(key)
        else:
            write_kind(key)
        print(f"sprites {key}", flush=True)


def write_portraits():
    from house_walkers import write_portrait
    for key in KEYS:
        write_portrait(key)
        print(f"portrait {key}", flush=True)

def extract_roster() -> list[dict]:
    src = POND_TS.read_text()
    start = src.index("export const POND_ROSTER")
    body = src[src.index("[", start) : src.index("];", start) + 1]
    entries = []
    for m in re.finditer(r"\{\s*key:\s*\"(\w+)\"", body):
        key = m.group(1)
        chunk = body[m.start() :]
        end = chunk.find("\n  },")
        block = chunk[: end + 5]

        def field(name: str) -> str:
            hit = re.search(rf"{name}:\s*\"([^\"]*)\"", block)
            return hit.group(1) if hit else ""

        lines_m = re.search(r"lines:\s*\{(.*?)\n    \},", block, re.S)
        lines_src = "{" + (lines_m.group(1) if lines_m else "") + "\n}"
        lines_src = re.sub(r"(\n\s*)([A-Za-z]+):", r'\1"\2":', lines_src)
        lines_src = re.sub(r",(\s*[}\]])", r"\1", lines_src)
        entries.append(
            {
                "key": key,
                "slug": field("slug"),
                "name": field("name"),
                "speciesLabel": field("speciesLabel"),
                "tagline": field("tagline"),
                "lines": json.loads(lines_src),
            }
        )
    if [e["key"] for e in entries] != KEYS:
        raise SystemExit(f"roster extract mismatch: {[e['key'] for e in entries]}")
    return entries


def write_roster():
    roster = json.loads(ROSTER_PATH.read_text())
    have = {row["key"] for row in roster}
    added = 0
    for row in extract_roster():
        if row["key"] not in have:
            roster.append(row)
            added += 1
    ROSTER_PATH.write_text(json.dumps(roster, separators=(",", ":")) + "\n")
    print(f"roster {len(roster)} (+{added})", flush=True)


def main():
    os.chdir(ROOT)
    write_sprites()
    write_portraits()
    write_roster()


if __name__ == "__main__":
    main()
