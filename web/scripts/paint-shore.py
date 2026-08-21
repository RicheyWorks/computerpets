#!/usr/bin/env python3
"""Paint honest shore sprites and append the desktop roster.

The shore needs distinct strand guests — Wave is not Tenant, Pale is not Ledger,
Cone is not Lid, Cement is not a limpet, Mail is not a snail, Token is not Coin,
Knurl is not Spire, Heap is not Cast. These frames are painted specimen plates
on black, then copied to the Electron overlay. Portraits sit the same plate on
the study blotter. Cup stays the octopus. Coin stays the goldfish. Cast stays
the earthworm. Do not make a second tide. Do not make a second log.
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
SHORE_TS = ROOT / "web" / "src" / "lib" / "pets" / "shore.ts"
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
    "fiddler_crab",
    "ghost_crab",
    "limpet",
    "barnacle",
    "chiton",
    "periwinkle",
    "sand_dollar",
    "sea_urchin",
    "knobbed_whelk",
    "lugworm",
]

LATIN = {
    "fiddler_crab": "Minuca pugnax",
    "ghost_crab": "Ocypode quadrata",
    "limpet": "Patella vulgata",
    "barnacle": "Semibalanus balanoides",
    "chiton": "Tonicella lineata",
    "periwinkle": "Littorina littorea",
    "sand_dollar": "Echinarachnius parma",
    "sea_urchin": "Strongylocentrotus purpuratus",
    "knobbed_whelk": "Busycon carica",
    "lugworm": "Arenicola marina",
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
        "signal": 0.0,
        "dash": 0.0,
        "kick": 0.0,
        "bury": 0.0,
        "heap": 0.0,
    }
    if anim == "idle":
        pose["rot"] = wave * (0.4 if key in ("limpet", "barnacle", "sand_dollar") else 1.2)
        pose["dx"] = wave * (1.2 if key in ("limpet", "barnacle") else 2.6)
        if key == "fiddler_crab":
            pose["signal"] = 0.35 + 0.2 * abs(wave)
        if key == "barnacle":
            pose["kick"] = 0.25 + 0.15 * abs(wave)
        if key == "lugworm":
            pose["heap"] = 0.2
    elif anim == "walk":
        if key == "fiddler_crab":
            pose["dx"] = wave * 10
            pose["signal"] = 0.7 + 0.2 * wave
            pose["rot"] = wave * 3
        elif key == "ghost_crab":
            pose["dash"] = wave
            pose["dx"] = wave * 16
            pose["dy"] = abs(wave) * 2
        elif key == "limpet":
            pose["dx"] = wave * 3
            pose["dy"] = 4
        elif key == "barnacle":
            pose["kick"] = 0.8
        elif key == "chiton":
            pose["dx"] = wave * 6
            pose["dy"] = abs(wave) * 1.2
        elif key == "periwinkle":
            pose["dx"] = wave * 5
            pose["rot"] = wave * 2
        elif key == "sand_dollar":
            pose["dx"] = wave * 4
            pose["bury"] = 0.15
        elif key == "sea_urchin":
            pose["dx"] = wave * 6
            pose["rot"] = wave * 4
        elif key == "knobbed_whelk":
            pose["dx"] = wave * 5
            pose["rot"] = wave * 2
        else:
            pose["dx"] = wave * 8
            pose["heap"] = 0.35
    elif anim == "sit":
        pose["dy"] = 10
        pose["scale"] = 0.96
        if key == "limpet":
            pose["dy"] = 14
        if key == "barnacle":
            pose["kick"] = 0.1
            pose["dy"] = 12
        if key == "sand_dollar":
            pose["bury"] = 0.7
            pose["dy"] = 16
        if key == "lugworm":
            pose["heap"] = 0.85
            pose["dy"] = 12
        if key == "fiddler_crab":
            pose["signal"] = 0.15
    elif anim == "sleep":
        pose["rot"] = -6
        pose["dy"] = 16
        pose["dim"] = 0.78
        if key in ("limpet", "barnacle", "sand_dollar"):
            pose["rot"] = 0
            pose["dy"] = 14
        if key == "sand_dollar":
            pose["bury"] = 0.85
        if key == "lugworm":
            pose["heap"] = 0.6
            pose["rot"] = -2
    elif anim == "talk":
        pose["dy"] = -2 + wave * 1.8
        if key == "fiddler_crab":
            pose["signal"] = 0.9
        if key == "barnacle":
            pose["kick"] = 0.55
    elif anim == "eat":
        pose["dy"] = 6
        pose["open"] = 0.4 + 0.2 * abs(wave)
        if key == "barnacle":
            pose["kick"] = 0.7
        if key == "lugworm":
            pose["heap"] = 0.5
    elif anim == "play":
        if key == "fiddler_crab":
            pose["signal"] = 1.0
            pose["dx"] = wave * 8
            pose["dy"] = -4 + wave * 3
        elif key == "ghost_crab":
            pose["dash"] = wave
            pose["dx"] = wave * 18
            pose["dy"] = -4 + abs(wave) * 3
        elif key == "barnacle":
            pose["kick"] = 1.0
        elif key == "sand_dollar":
            pose["bury"] = 0.4
            pose["dx"] = wave * 6
        elif key == "sea_urchin":
            pose["rot"] = wave * 8
            pose["dx"] = wave * 8
        elif key == "lugworm":
            pose["heap"] = 1.0
            pose["dx"] = wave * 6
        else:
            pose["dx"] = wave * 8
            pose["dy"] = -4 + wave * 3
            pose["rot"] = wave * 3
    return pose


def _c(rgb, dim, a=255):
    return tuple(max(0, min(255, int(c * dim))) for c in rgb) + (a,)


def paint_shore(key: str, anim: str, index: int) -> Image.Image:
    pose = pose_for(key, anim, index, ANIMS[anim])
    img = Image.new("RGBA", (HI, HI), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    cx, cy = HI // 2 + pose["dx"] * 4, HI // 2 + pose["dy"] * 4
    dim = pose["dim"]
    wave = math.sin(index * 1.15)

    def ell(x, y, rx, ry, rgb, a=255):
        draw.ellipse((cx + x - rx, cy + y - ry, cx + x + rx, cy + y + ry), fill=_c(rgb, dim, a))

    def poly(pts, rgb, a=255):
        draw.polygon([(cx + x, cy + y) for x, y in pts], fill=_c(rgb, dim, a))

    def ln(x1, y1, x2, y2, rgb, w=2, a=230):
        draw.line((cx + x1, cy + y1, cx + x2, cy + y2), fill=_c(rgb, dim, a), width=w)

    if key == "fiddler_crab":
        # One small claw, one signal. Not a hermit. Not Pinch.
        rust, cream, claw, eye = (156, 92, 56), (212, 172, 120), (196, 120, 48), (24, 16, 12)
        ell(0, 2, 14, 9, rust, 235)
        ell(2, 5, 8, 4, cream, 180)
        lift = -18 - pose["signal"] * 16 + wave * 3
        ln(8, 0, 16, lift + 6, (88, 48, 28), 3)
        ell(18, lift, 9, 7, claw, 240)
        ell(22, lift - 2, 4, 3, (220, 160, 80), 200)
        ell(-16, 2, 5, 4, rust, 220)
        for k in range(4):
            x = -10 + k * 6
            ln(x, 8, x - 2 + wave * 2, 18, (88, 48, 28), 2)
        ell(-8, -2, 2.0, 2.0, eye, 240)
        ell(-2, -2, 2.0, 2.0, eye, 240)
    elif key == "ghost_crab":
        # Pale, eyestalks, a sideways run. Not Tenant. Not Ledger. Not Ghost.
        sand, belly, stalk, eye = (220, 204, 172), (236, 224, 200), (188, 172, 140), (40, 32, 24)
        dash = pose["dash"] * 8
        ell(dash, 2, 16, 8, sand, 230)
        ell(dash + 2, 5, 8, 3.5, belly, 180)
        ln(dash - 6, -4, dash - 10, -20, stalk, 2)
        ln(dash + 4, -4, dash + 8, -20, stalk, 2)
        ell(dash - 10, -22, 2.6, 2.6, eye, 240)
        ell(dash + 8, -22, 2.6, 2.6, eye, 240)
        for k in range(5):
            x = -12 + k * 6
            ln(dash + x, 6, dash + x + wave * 5, 18, stalk, 2)
        ell(dash - 8, 0, 1.6, 1.6, eye, 200)
    elif key == "limpet":
        # A cone that clamps. Not Lid. Not Cement.
        slate, ring, rim = (132, 116, 96), (88, 72, 56), (188, 172, 148)
        peak = -18 + (4 if anim in ("sit", "sleep") else 0)
        poly([(0, peak), (24, 12), (-24, 12)], slate, 235)
        ln(-12, 2, 12, 2, ring, 2)
        ln(-7, -6, 7, -6, ring, 2)
        ell(0, 8, 10, 3, rim, 160)
        ell(0, 4, 1.6, 1.6, (32, 24, 20), 200)
    elif key == "barnacle":
        # Cemented plates. Cirri kick. A crustacean. Not a limpet. Not a crab.
        plate, seam, pale, cirri = (176, 164, 148), (120, 108, 92), (216, 208, 192), (200, 196, 184)
        poly([(-16, 14), (-11, -12), (11, -12), (16, 14)], plate, 235)
        ln(-4, -12, -6, 14, seam, 2)
        ln(4, -12, 6, 14, seam, 2)
        ell(0, -8, 6, 3, pale, 180)
        if anim != "sleep":
            kick = 8 + pose["kick"] * 14 + wave * 3
            ln(-2, -12, -8, -12 - kick, cirri, 2, 200)
            ln(2, -12, 8, -12 - kick, cirri, 2, 200)
            ln(0, -12, 0, -12 - kick * 0.7, cirri, 1, 170)
    elif key == "chiton":
        # Eight plates. A girdle. Not a limpet. Not Armor.
        slate, line, girdle, eye = (72, 88, 108), (196, 140, 88), (40, 48, 60), (24, 20, 16)
        ell(0, 2, 24, 11, girdle, 220)
        for t in range(8):
            x = -18 + t * 5
            ell(x, 0, 5, 8, slate if t % 2 == 0 else (88, 104, 124), 230)
            ln(x, -7, x + 1, 7, line, 2)
        ell(2, 6, 10, 3, (156, 172, 188), 150)
        ell(-20, 0, 4, 3, slate, 230)
        ell(-22, -1, 1.4, 1.4, eye, 240)
    elif key == "periwinkle":
        # A small dark spiral. A grazer. Not Chamber. Not Whorl. Not Knurl.
        ink, pale, foot = (48, 56, 64), (120, 128, 132), (88, 96, 104)
        ell(6, 4, 12, 11, ink, 235)
        ell(10, -8, 8, 8, ink, 230)
        ell(8, 2, 7, 6, pale, 120)
        for r in (9, 6, 3):
            draw.arc(
                (cx + 6 - r, cy + 4 - r, cx + 6 + r, cy + 4 + r),
                start=30,
                end=300,
                fill=_c((32, 36, 40), dim, 220),
                width=2,
            )
        ell(-12, 10, 8, 4, foot, 210)
        ell(-14, 9, 1.4, 1.4, (20, 20, 20), 240)
    elif key == "sand_dollar":
        # Flat, five petals. A buried urchin. Not Coin. Not Disk. Not Ochre.
        sand, petal, rim = (196, 180, 148), (148, 132, 104), (228, 216, 188)
        bury = pose["bury"]
        cy_off = bury * 10
        ell(0, cy_off, 22, 14 - bury * 4, sand, 230)
        ell(0, cy_off, 16, 10 - bury * 3, rim, 120)
        for ang in range(0, 360, 72):
            rad = math.radians(ang - 90)
            ln(0, cy_off, math.cos(rad) * 10, cy_off + math.sin(rad) * 6, petal, 2)
            ell(math.cos(rad) * 6, cy_off + math.sin(rad) * 4, 2.4, 3.2, petal, 180)
        if bury > 0.4:
            ell(0, 16, 20, 5, (168, 148, 112), 80)
    elif key == "sea_urchin":
        # A globe of spines. Not Burr. Not Spine. Not Token.
        purple, deep, tip = (88, 48, 108), (56, 28, 72), (176, 140, 196)
        ell(0, 2, 12, 11, purple, 235)
        ell(2, 5, 6, 4, (148, 108, 168), 160)
        extra = 4 if anim == "play" else 0
        for k in range(16):
            rad = math.radians(k * 22.5 + index * 4)
            ln(
                math.cos(rad) * 8,
                2 + math.sin(rad) * 7,
                math.cos(rad) * (22 + extra),
                2 + math.sin(rad) * (20 + extra),
                deep if k % 2 == 0 else tip,
                2,
            )
        ell(-2, 0, 1.4, 1.4, (24, 16, 28), 200)
    elif key == "knobbed_whelk":
        # Knobs, a canal. A hunter. Not Spire. Not Horn.
        tan, knob, canal, foot = (188, 148, 96), (120, 88, 52), (96, 68, 40), (220, 196, 156)
        ell(6, 4, 14, 13, tan, 235)
        ell(12, -10, 9, 9, tan, 230)
        ell(8, 2, 6, 5, (204, 172, 124), 140)
        for ox, oy, r in ((4, -2, 4), (12, 6, 4), (8, 12, 3.4), (16, -6, 3.2)):
            ell(ox, oy, r, r * 0.85, knob, 220)
        poly([(16, 12), (30, 22), (18, 18)], canal, 220)
        ell(-14, 12, 9, 5, foot, 210)
        ell(-16, 11, 1.4, 1.4, (40, 28, 16), 240)
    else:
        # Lugworm. Castings. No clitellum. Not Cast. Not Latch.
        rust, ring, silt = (148, 88, 72), (112, 64, 52), (168, 140, 108)
        pts = [(-28 + t * 7, math.sin(t * 0.55 + index * 0.5) * 4) for t in range(10)]
        for k, (x, y) in enumerate(pts[:-1]):
            t = k / 9
            rgb = rust if k % 2 == 0 else ring
            ell(x, y, 7 - t * 2.0, 5, rgb, 230)
        hx, hy = pts[0]
        ell(hx - 3, hy, 6, 4, rust, 230)
        ell(hx - 4, hy - 1, 1.4, 1.4, (64, 36, 28), 240)
        if pose["heap"] > 0.15 or anim in ("sit", "eat", "play"):
            h = pose["heap"]
            ell(10, 16, 10 + h * 6, 5 + h * 2, silt, int(120 + 80 * h))
            ell(16, 14, 6 + h * 3, 3 + h, (148, 120, 88), int(100 + 70 * h))

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
    src = SHORE_TS.read_text()
    start = src.index("export const SHORE_ROSTER")
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
    public = ROOT / "web" / "public" / "companion-roster.json"
    if public.exists():
        public.write_text(json.dumps(roster, separators=(",", ":")) + "\n")
        print(f"companion-roster {len(roster)}", flush=True)


def main():
    os.chdir(ROOT)
    write_sprites()
    write_portraits()
    write_roster()


if __name__ == "__main__":
    main()
