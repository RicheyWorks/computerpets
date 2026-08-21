#!/usr/bin/env python3
"""Paint honest creek sprites and append the desktop roster.

The creek needs distinct freshwater fish — Lunge is not Speck, Penny is not Coin,
Round is a disk not a ribbon, Spoon filters. These frames are painted specimen
plates on black, then copied to the Electron overlay. Portraits sit the same
plate on the study blotter. Coin stays the goldfish. Prickle stays the
stickleback. Do not make a goldfish loop.
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
CREEK_TS = ROOT / "web" / "src" / "lib" / "pets" / "creek.ts"
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
    "bass",
    "brook_trout",
    "catfish",
    "bluegill",
    "perch",
    "pike",
    "walleye",
    "paddlefish",
    "lamprey",
    "american_eel",
]

LATIN = {
    "bass": "Micropterus salmoides",
    "brook_trout": "Salvelinus fontinalis",
    "catfish": "Ictalurus punctatus",
    "bluegill": "Lepomis macrochirus",
    "perch": "Perca flavescens",
    "pike": "Esox lucius",
    "walleye": "Sander vitreus",
    "paddlefish": "Polyodon spathula",
    "lamprey": "Petromyzon marinus",
    "american_eel": "Anguilla rostrata",
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
        "filter": 0.0,
        "disk": 0.0,
    }
    filters = ("paddlefish",)
    disks = ("lamprey",)
    if anim == "idle":
        pose["rot"] = wave * (0.4 if key in filters or key in disks else 1.1)
        if key not in disks:
            pose["dx"] = wave * (1.4 if key in filters else 3.2)
            pose["dy"] = math.sin(i * 0.9) * (1.2 if key in filters else 2.4)
        if key == "lamprey":
            pose["disk"] = 0.2
        if key == "paddlefish":
            pose["filter"] = 0.2 + 0.1 * abs(wave)
        if key == "walleye":
            pose["glow"] = 0.15 + 0.1 * abs(wave)
    elif anim == "walk":
        # Tide swim, not Coin's loop: a crossing, not a circle.
        if key == "paddlefish":
            pose["dx"] = wave * 6
            pose["dy"] = abs(wave) * 1.4
            pose["filter"] = 0.45
            pose["rot"] = wave * 0.8
        elif key == "lamprey":
            pose["dx"] = wave * 4
            pose["dy"] = abs(wave) * 0.8
            pose["disk"] = 0.4
            pose["rot"] = wave * 1.2
        elif key == "american_eel":
            pose["dx"] = wave * 14
            pose["dy"] = math.sin(i * 1.6) * 3
            pose["rot"] = wave * 5
        elif key == "pike":
            pose["dx"] = wave * 10
            pose["dy"] = abs(wave) * 1.2
            pose["rot"] = wave * 1.6
        elif key == "bass":
            pose["dx"] = wave * 11
            pose["dy"] = math.sin(i * 1.3) * 3
            pose["rot"] = wave * 2
        else:
            pose["dx"] = wave * 12
            pose["dy"] = math.sin(i * 1.4) * 3.2
            pose["rot"] = wave * 2.4
    elif anim == "sit":
        pose["dy"] = 10
        pose["scale"] = 0.96
        if key == "paddlefish":
            pose["filter"] = 0.55
        if key == "lamprey":
            pose["disk"] = 0.8
            pose["dy"] = 14
        if key == "pike":
            pose["dy"] = 12
    elif anim == "sleep":
        pose["rot"] = -7
        pose["dy"] = 18
        pose["dim"] = 0.78
        if key == "lamprey":
            pose["disk"] = 1.0
            pose["rot"] = -2
    elif anim == "talk":
        pose["dy"] = -2 + wave * 1.8
        if key == "bass":
            pose["open"] = 0.55
        if key == "walleye":
            pose["glow"] = 0.45
    elif anim == "eat":
        pose["dy"] = 6
        pose["open"] = 0.45 + 0.2 * abs(wave)
        if key == "paddlefish":
            pose["filter"] = 0.8
            pose["open"] = 0.7
        if key == "lamprey":
            pose["disk"] = 0.9
    elif anim == "play":
        if key == "bass":
            pose["open"] = 0.8
            pose["dx"] = wave * 14
            pose["dy"] = -8 + wave * 4
        elif key == "paddlefish":
            pose["filter"] = 1.0
            pose["dx"] = wave * 8
        elif key == "lamprey":
            pose["disk"] = 1.0
            pose["dy"] = 4
        elif key == "american_eel":
            pose["dx"] = wave * 18
            pose["rot"] = wave * 8
        else:
            pose["dx"] = wave * 14
            pose["dy"] = -6 + wave * 4
            pose["rot"] = wave * 5
    return pose


def _c(rgb, dim, a=255):
    return tuple(max(0, min(255, int(c * dim))) for c in rgb) + (a,)


def paint_creek(key: str, anim: str, index: int) -> Image.Image:
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

    def ln(x1, y1, x2, y2, rgb, w=2):
        draw.line((cx + x1, cy + y1, cx + x2, cy + y2), fill=_c(rgb, dim, 230), width=w)

    if key == "bass":
        # Wide mouth, dark stripe, olive. Not a trout. Not Speck.
        olive, belly, stripe, eye = (72, 108, 64), (196, 196, 148), (32, 40, 28), (20, 24, 16)
        gape = 10 + pose["open"] * 14
        poly([(28, -4), (48, -16 + wave), (46, 14 - wave)], olive, 220)
        ell(0, 2, 26, 14, olive, 235)
        ell(4, 6, 14, 7, belly, 190)
        ln(-16, 2, 18, 2, stripe, 3)
        poly([(-28, -2), (-28 - gape, 4), (-26, 10)], (48, 36, 28), 230)
        ell(-18, -4, 3.2, 3.2, eye, 240)
        poly([(-2, -14), (8, -22), (10, -12)], olive, 200)
        poly([(2, 14), (12, 20), (14, 12)], olive, 200)
    elif key == "brook_trout":
        # Worm marks, white-edged fins, red spots. A char. Not a bass.
        olive, belly, mark, spot = (56, 88, 68), (220, 196, 160), (36, 48, 40), (168, 48, 48)
        poly([(30, 0), (50, -12 + wave), (48, 12 - wave)], olive, 220)
        ell(0, 2, 24, 11, olive, 235)
        ell(4, 6, 12, 5, belly, 190)
        for mx in (-8, 0, 8, 16):
            ln(mx - 4, -6, mx + 2, -2, mark, 2)
            ln(mx - 2, 0, mx + 4, 4, mark, 2)
        for sx, sy in ((-6, 2), (4, -2), (12, 4), (2, 6)):
            ell(sx, sy, 1.6, 1.6, spot, 220)
        poly([(-4, -12), (4, -20), (8, -10)], (236, 236, 228), 210)
        poly([(0, 12), (8, 20), (12, 10)], (236, 236, 228), 210)
        ell(-16, -2, 2.6, 2.6, (20, 24, 16), 240)
    elif key == "catfish":
        # Barbels, forked tail, spots. Not a shark. Not Spoon.
        slate, belly, barb = (88, 80, 64), (196, 184, 152), (48, 40, 32)
        poly([(26, -2), (46, -14 + wave), (40, 2), (46, 14 - wave), (26, 6)], slate, 220)
        ell(0, 2, 24, 12, slate, 235)
        ell(4, 6, 12, 6, belly, 180)
        for bx, by in ((-18, 6), (-16, 10), (-20, 2), (-14, 12)):
            ln(-12, 4, bx - 10, by + 8, barb, 2)
        for sx, sy in ((-4, 0), (6, 4), (12, -2), (2, 6)):
            ell(sx, sy, 1.8, 1.4, (48, 40, 32), 200)
        ell(-16, -2, 2.4, 2.4, (20, 18, 14), 240)
    elif key == "bluegill":
        # Compressed sunfish, dark ear flap. Not Coin.
        olive, belly, flap, eye = (64, 112, 88), (212, 148, 72), (20, 20, 20), (20, 24, 16)
        poly([(18, 0), (32, -14 + wave), (30, 14 - wave)], olive, 210)
        ell(0, 2, 18, 16, olive, 235)
        ell(2, 6, 10, 8, belly, 190)
        ell(-10, 0, 5, 5, flap, 230)
        ell(-14, -4, 2.6, 2.6, eye, 240)
        poly([(-2, -16), (6, -24), (8, -14)], olive, 200)
        poly([(0, 16), (8, 24), (10, 14)], olive, 200)
    elif key == "perch":
        # Yellow gold, dark bars. Not a walleye. Not Night.
        gold, belly, bar, eye = (196, 164, 56), (232, 212, 140), (48, 40, 24), (20, 18, 12)
        poly([(26, 0), (44, -12 + wave), (42, 12 - wave)], gold, 220)
        ell(0, 2, 22, 12, gold, 235)
        ell(4, 6, 12, 6, belly, 180)
        for bx in (-8, 0, 8, 16):
            ln(bx, -10, bx + 2, 12, bar, 3)
        ell(-14, -2, 2.6, 2.6, eye, 240)
        poly([(-2, -12), (4, -22), (8, -10)], gold, 200)
        poly([(2, 12), (8, 20), (12, 10)], gold, 200)
    elif key == "pike":
        # Duckbill, long body, light spots. Not a muskellunge rumor.
        green, belly, bill, spot = (64, 100, 56), (180, 196, 140), (88, 108, 64), (212, 220, 176)
        poly([(40, 0), (64, -8 + wave), (62, 10 - wave)], green, 220)
        ell(8, 2, 32, 10, green, 235)
        ell(12, 6, 18, 5, belly, 180)
        poly([(-28, -2), (-52, 2), (-48, 8), (-24, 6)], bill, 230)
        for sx, sy in ((-4, 0), (8, -4), (16, 4), (24, -2), (4, 4)):
            ell(sx, sy, 2.2, 1.6, spot, 200)
        ell(-36, 0, 2.2, 2.2, (16, 20, 12), 240)
        poly([(0, -10), (10, -16), (12, -8)], green, 200)
    elif key == "walleye":
        # Olive-gold, milky tapetum. She hunts dusk. Not Bar.
        olive, belly, eye, glow = (88, 100, 56), (188, 180, 120), (220, 220, 196), (236, 228, 160)
        poly([(28, 0), (48, -12 + wave), (46, 12 - wave)], olive, 220)
        ell(0, 2, 24, 11, olive, 235)
        ell(4, 6, 12, 5, belly, 180)
        g = 0.35 + pose["glow"]
        ell(-16, -2, 4.2, 4.2, glow, int(180 + 60 * g))
        ell(-16, -2, 2.0, 2.0, eye, 240)
        ell(-14, -3, 1.2, 1.2, (40, 40, 28), 230)
        poly([(-2, -12), (6, -20), (10, -10)], olive, 200)
    elif key == "paddlefish":
        # Paddle rostrum, vast filter mouth. Not a shark. Not Whisk.
        slate, belly, paddle, gill = (72, 88, 96), (196, 200, 188), (88, 100, 108), (48, 60, 68)
        open_amt = 8 + pose["filter"] * 10 + pose["open"] * 8
        poly([(28, -2), (50, -10 + wave), (48, 12 - wave)], slate, 210)
        ell(4, 2, 26, 14, slate, 230)
        ell(8, 8, 14, 6, belly, 170)
        poly([(-18, -4), (-56, -8), (-60, 0), (-54, 8), (-16, 6)], paddle, 230)
        poly([(-16, -2), (-16 - open_amt * 0.2, 4), (-12, 10)], gill, 200)
        for gy in (-4, 2, 8):
            ln(-8, gy, 4, gy + 1, gill, 1)
        ell(-20, -2, 2.2, 2.2, (20, 24, 24), 240)
    elif key == "lamprey":
        # Disk mouth, no jaws, stout — not a ribbon. Not Silver. Not a moray.
        olive, disk, hole, ring = (72, 64, 48), (48, 40, 32), (24, 20, 16), (96, 84, 64)
        ell(6, 2, 20, 10, olive, 230)
        for t in range(5):
            ell(4 + t * 5, 2 + math.sin(t + index) * 1.2, 8 - t * 0.6, 7, olive if t % 2 == 0 else ring, 220)
        r = 14 + pose["disk"] * 4
        ell(-22, 2, r, r * 0.9, disk, 230)
        ell(-22, 2, r * 0.55, r * 0.5, hole, 230)
        for ang in range(0, 360, 30):
            rad = math.radians(ang)
            ell(-22 + math.cos(rad) * 8, 2 + math.sin(rad) * 7, 1.4, 1.4, ring, 210)
    else:
        # American eel. A true ribbon with jaws. Not Round. Not a moray.
        olive, belly, fin = (56, 72, 52), (168, 172, 120), (40, 56, 40)
        pts = [(-30 + t * 8, math.sin(t * 0.7 + index * 0.6) * 6) for t in range(10)]
        for k, (x, y) in enumerate(pts[:-1]):
            nx, ny = pts[k + 1]
            t = k / 9
            ell(x, y, 7 - t * 3.2, 4.2, olive if k % 2 == 0 else (48, 64, 44), 230)
            ln(x, y - 4, nx, ny - 5, fin, 2)
            ln(x, y + 4, nx, ny + 5, fin, 2)
        hx, hy = pts[0]
        ell(hx - 4, hy, 8, 5, olive, 230)
        ell(hx - 2, hy + 2, 4, 2.4, belly, 180)
        ell(hx - 6, hy - 1, 1.8, 1.8, (16, 20, 12), 240)

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
    src = CREEK_TS.read_text()
    start = src.index("export const CREEK_ROSTER")
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
