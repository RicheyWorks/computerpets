#!/usr/bin/env python3
"""Paint honest Fungi sprites and append the desktop roster.

Garden/sea ship photographed frames. The hive painted Insecta plates.
The cellar needs distinct fungi — a morel is not a recolored amanita,
yeast is a jar that rises, lichen is a shrub, not a cap — so these
frames are painted specimen plates on black, then copied to the
Electron overlay. Portraits sit the same plate on the study blotter.
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
FUNGI_TS = ROOT / "web" / "src" / "lib" / "pets" / "fungi.ts"
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
    "oyster",
    "fly_agaric",
    "morel",
    "chanterelle",
    "turkey_tail",
    "lions_mane",
    "puffball",
    "chicken_of_woods",
    "yeast",
    "lichen",
]

LATIN = {
    "oyster": "Pleurotus ostreatus",
    "fly_agaric": "Amanita muscaria",
    "morel": "Morchella americana",
    "chanterelle": "Cantharellus cibarius",
    "turkey_tail": "Trametes versicolor",
    "lions_mane": "Hericium erinaceus",
    "puffball": "Lycoperdon perlatum",
    "chicken_of_woods": "Laetiporus sulphureus",
    "yeast": "Saccharomyces cerevisiae",
    "lichen": "Cladonia rangiferina",
}


def pose_for(key: str, anim: str, i: int, n: int) -> dict:
    u = i / max(1, n - 1)
    wave = math.sin(i * 1.15)
    pose = {
        "dx": 0.0,
        "dy": 0.0,
        "rot": 0.0,
        "scale": 1.0,
        "flush": 0.0,
        "puff": 0.0,
        "rise": 0.0,
        "dim": 1.0,
    }
    if anim == "idle":
        pose["rot"] = wave * (2 if key != "lichen" else 0.6)
        pose["flush"] = 0.15 + 0.15 * (0.5 + 0.5 * math.sin(i * 1.7))
        if key == "yeast":
            pose["rise"] = 4 + wave * 3
        if key == "puffball":
            pose["puff"] = 0.08 * abs(wave)
    elif anim == "walk":
        if key == "yeast":
            pose["rise"] = 8 + abs(wave) * 10
            pose["dy"] = -pose["rise"]
        elif key == "lichen":
            pose["dx"] = wave * 2
            pose["rot"] = wave * 1
        elif key == "puffball":
            pose["dx"] = wave * 8
            pose["puff"] = 0.2 * abs(wave)
        else:
            pose["dx"] = wave * 6
            pose["rot"] = wave * 4
            pose["dy"] = abs(wave) * 2
    elif anim == "sit":
        pose["dy"] = 18
        pose["scale"] = 0.96
        pose["rot"] = -3
    elif anim == "sleep":
        pose["rot"] = -12
        pose["dy"] = 28
        pose["dim"] = 0.72
    elif anim == "talk":
        pose["flush"] = 0.4 + 0.4 * (i % 2)
        pose["dy"] = -4 + wave * 3
    elif anim == "eat":
        pose["dy"] = 12
        pose["rot"] = 4 + wave * 2
    elif anim == "play":
        if key == "puffball":
            pose["puff"] = 0.4 + 0.6 * abs(math.sin(u * math.pi))
            pose["scale"] = 1.05 + 0.12 * pose["puff"]
            pose["dy"] = -8 - pose["puff"] * 16
        elif key == "yeast":
            pose["rise"] = 20 + abs(math.sin(u * math.pi)) * 24
            pose["dy"] = -pose["rise"]
        else:
            pose["rot"] = wave * 8
            pose["flush"] = 0.8
            pose["dy"] = -10 + wave * 4
    return pose


def _c(rgb, dim, a=255):
    return tuple(max(0, min(255, int(c * dim))) for c in rgb) + (a,)


def paint_fungus(key: str, anim: str, index: int) -> Image.Image:
    n = ANIMS[anim]
    pose = pose_for(key, anim, index, n)
    img = Image.new("RGBA", (HI, HI), (0, 0, 0, 255))
    d = ImageDraw.Draw(img, "RGBA")
    cx, cy = HI / 2 + pose["dx"] * 2, HI / 2 + 48 + pose["dy"] * 2
    s = 2.2 * pose["scale"]
    rot = math.radians(pose["rot"])
    dim = pose["dim"]

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

    def chord(pts, rgb, a=220):
        d.polygon([xf(*p) for p in pts], fill=_c(rgb, dim, a))

    flush = pose["flush"]
    puff = pose["puff"]

    if key == "oyster":
        cream, gill, wood = (232, 220, 196), (196, 180, 148), (88, 64, 40)
        ln(-8, 28, 8, 28, wood, 6)
        for i, (ox, oy, sc) in enumerate(((-18, 8, 0.85), (0, 0, 1.0), (16, 10, 0.8))):
            w = 28 * sc
            chord([(ox - w, oy + 8), (ox - w * 0.7, oy - 10), (ox + w * 0.2, oy - 14), (ox + w, oy + 4), (ox, oy + 12)], cream, 230)
            for t in range(-3, 4):
                ln(ox, oy + 6, ox + t * 7 * sc, oy - 6, gill, 1, 160)
    elif key == "fly_agaric":
        red = (196 + int(40 * flush), 36, 32)
        white, stem, volva = (248, 244, 236), (236, 228, 210), (244, 236, 220)
        ell(0, 28, 14, 8, volva)
        ell(0, 10, 7, 22, stem)
        ell(0, 8, 12, 3, white)
        ell(0, -16, 32, 16, red)
        for x, y in ((-14, -18), (10, -22), (-6, -10), (16, -12), (0, -24), (-18, -12), (6, -8)):
            ell(x, y, 3.2, 2.6, white)
        ln(-10, 8, 10, 8, white, 2)
    elif key == "morel":
        tan, pit, stem = (156, 112, 64), (88, 60, 36), (212, 188, 140)
        ell(0, 22, 8, 16, stem)
        cone = [(-4, -36), (10, -28), (16, -8), (10, 8), (-10, 8), (-16, -10), (-8, -30)]
        chord(cone, tan, 235)
        for x, y in ((-4, -24), (4, -20), (-8, -10), (8, -8), (0, -4), (-6, 0), (6, 2), (-2, -14), (2, -28)):
            ell(x, y, 3.4, 2.6, pit, 210)
    elif key == "chanterelle":
        gold = (232 + int(16 * flush), 168, 48)
        ridge, stem = (196, 132, 36), (236, 196, 96)
        ell(0, 18, 7, 16, stem)
        chord([(-6, 6), (-22, -8), (-10, -26), (10, -26), (22, -8), (6, 6)], gold, 235)
        for side in (-1, 1):
            ln(0, 8, side * 16, -8, ridge, 1, 180)
            ln(side * 6, 4, side * 18, -16, ridge, 1, 160)
            ln(side * 3, 2, side * 8, -22, ridge, 1, 150)
    elif key == "turkey_tail":
        zones = [(72, 56, 40), (168, 140, 72), (88, 120, 72), (196, 92, 48), (232, 220, 196)]
        for i, (ox, oy) in enumerate(((-10, 6), (8, 2), (20, 10))):
            for k, z in enumerate(zones):
                w = 22 - k * 3
                h = 10 - k * 1.2
                ell(ox, oy - k * 1.2, w, h, z, 210)
        ell(8, 10, 14, 4, (244, 236, 220), 180)
    elif key == "lions_mane":
        white, cream = (248, 244, 232), (228, 220, 200)
        ell(0, -8, 16, 10, cream)
        for x, y, L in (
            (-14, 0, 22), (-8, 4, 28), (-2, 2, 32), (4, 4, 30), (10, 0, 24),
            (-18, 6, 16), (16, 6, 18), (0, 8, 26), (-10, 10, 20), (8, 12, 18),
        ):
            ln(x, y, x + (1 if x >= 0 else -1), y + L, white, 3)
            ell(x + (1 if x >= 0 else -1), y + L, 2.4, 3.2, white)
    elif key == "puffball":
        pearl, wart, pore = (236, 228, 208), (212, 196, 168), (88, 72, 52)
        r = 22 + puff * 10
        ell(0, 4, r, r * 0.92, pearl)
        for x, y in ((-10, -6), (8, -10), (-4, 8), (12, 4), (0, -14), (-14, 4), (6, 12)):
            ell(x, y, 2.4, 2.0, wart)
        ell(0, -16, 4 + puff * 6, 3 + puff * 4, pore)
        if puff > 0.2:
            cloud = (220, 212, 196)
            for k in range(int(4 + puff * 8)):
                ang = k * 0.9 + index
                ell(math.cos(ang) * (28 + puff * 40), -20 - k * 6 - puff * 20, 4 + puff * 6, 3 + puff * 4, cloud, int(80 + 80 * puff))
    elif key == "chicken_of_woods":
        sulfur = (236 + int(12 * flush), 148, 40)
        edge, oak = (255, 208, 80), (88, 60, 32)
        ln(-6, 26, 10, 26, oak, 5)
        for i, (oy, w) in enumerate(((12, 18), (2, 26), (-8, 30), (-18, 24))):
            chord([(-w, oy + 8), (-w + 4, oy - 4), (w - 6, oy - 6), (w, oy + 6), (0, oy + 10)], sulfur, 230 - i * 8)
            ln(-w + 6, oy - 2, w - 8, oy - 4, edge, 1, 160)
    elif key == "yeast":
        glass, foam, dough = (196, 208, 212), (248, 236, 196), (212, 168, 96)
        rise = pose["rise"] * 0.15
        chord([(-18, 28), (-16, -8 - rise), (16, -8 - rise), (18, 28)], glass, 90)
        ell(0, 8, 14, 16, dough, 200)
        ell(0, -6 - rise, 15, 8, foam, 220)
        ell(-6, -2 - rise, 4, 4, foam, 180)
        ell(6, 0 - rise, 3.5, 3.5, foam, 180)
        ell(0, 6, 3, 4, (236, 196, 120), 160)
        ell(-5, 12, 2.6, 3.2, (236, 196, 120), 150)
        ell(5, 14, 2.4, 3.0, (236, 196, 120), 150)
        ln(-18, 28, 18, 28, (160, 168, 172), 2)
    else:
        pale, tip = (196, 204, 176), (168, 184, 148)
        for ang, L in ((-0.8, 28), (-0.4, 34), (0.0, 36), (0.35, 32), (0.75, 26), (-1.1, 20), (1.05, 18)):
            x = math.sin(ang) * 8
            y = -L
            ln(0, 16, x, y, pale, 3)
            for t in (0.35, 0.6, 0.8):
                bx, by = x * t, 16 + (y - 16) * t
                side = 8 if ang >= 0 else -8
                ln(bx, by, bx + side, by - 6, pale, 2)
                ell(bx + side, by - 6, 2.2, 2.2, tip)
        ell(0, 18, 8, 5, (148, 140, 112))
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
    src = FUNGI_TS.read_text()
    start = src.index("export const FUNGI_ROSTER")
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
