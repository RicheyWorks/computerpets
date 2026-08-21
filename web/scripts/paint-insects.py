#!/usr/bin/env python3
"""Paint honest Insecta sprites and append the desktop roster.

Garden/sea ship photographed frames. There is no generator in-repo.
The hive needs distinct insects — a firefly is a beetle, a luna is not
a monarch with tails, a stick is a stick, a cicada is not a fly — so
these frames are painted specimen plates on black, then copied to the
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
INSECTS_TS = ROOT / "web" / "src" / "lib" / "pets" / "insects.ts"
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
    "honeybee",
    "monarch",
    "luna",
    "firefly",
    "darner",
    "stick",
    "carpenter_ant",
    "ladybird",
    "mantis",
    "cicada",
]

LATIN = {
    "honeybee": "Apis mellifera",
    "monarch": "Danaus plexippus",
    "luna": "Actias luna",
    "firefly": "Photinus pyralis",
    "darner": "Anax junius",
    "stick": "Diapheromera femorata",
    "carpenter_ant": "Camponotus pennsylvanicus",
    "ladybird": "Coccinella septempunctata",
    "mantis": "Tenodera sinensis",
    "cicada": "Magicicada septendecim",
}


def pose_for(key: str, anim: str, i: int, n: int) -> dict:
    u = i / max(1, n - 1)
    wave = math.sin(i * 1.15)
    pose = {
        "dx": 0.0,
        "dy": 0.0,
        "rot": 0.0,
        "scale": 1.0,
        "wing": 1.0,
        "glow": 0.55,
        "fold": 1.0,
        "dim": 1.0,
    }
    if anim == "idle":
        pose["dy"] = wave * (4 if key not in ("stick", "cicada") else 1)
        pose["wing"] = 0.92 + 0.08 * math.sin(i * 1.7)
        pose["glow"] = 0.45 + 0.45 * (0.5 + 0.5 * math.sin(i * 2.2))
    elif anim == "walk":
        if key == "stick":
            pose["dx"] = (i - 2.5) * 6
            pose["rot"] = wave * 2
        elif key == "luna":
            pose["dx"] = wave * 20
            pose["dy"] = -12 + math.cos(i) * 10
            pose["rot"] = wave * 6
            pose["wing"] = 0.85 + 0.2 * abs(wave)
        elif key in ("honeybee", "darner"):
            pose["dx"] = math.sin(i * 1.8) * 32
            pose["dy"] = -20 + math.cos(i * 2.1) * 16
            pose["rot"] = math.sin(i * 1.8) * 8
            pose["wing"] = 0.7 + 0.35 * abs(math.sin(i * 2.4))
        elif key == "cicada":
            pose["dx"] = 0 if i < 4 else (i - 3) * 20
            pose["dy"] = 8 if i < 4 else -16
        else:
            pose["dx"] = math.sin(i * 1.4) * 20
            pose["dy"] = -8 + abs(math.sin(i * 1.4)) * 12
            pose["rot"] = math.sin(i * 1.4) * 5
            pose["wing"] = 0.8 + 0.25 * abs(math.sin(i * 2))
    elif anim == "sit":
        pose["dy"] = 20
        pose["scale"] = 0.96
        pose["wing"] = 0.55 if key in ("monarch", "luna") else 0.85
    elif anim == "sleep":
        pose["rot"] = -14
        pose["dy"] = 32
        pose["dim"] = 0.72
        pose["wing"] = 0.4
        pose["glow"] = 0.15
    elif anim == "talk":
        pose["dy"] = -4 + wave * 6
        pose["glow"] = 0.7 + 0.3 * (i % 2)
    elif anim == "eat":
        if key == "luna":
            pose["dy"] = -4
            pose["rot"] = -4 + wave * 2
            pose["wing"] = 0.7
        else:
            pose["dy"] = 16 + (i % 2) * 6
            pose["rot"] = 6
    elif anim == "play":
        pose["dy"] = -36 - abs(math.sin(u * math.pi)) * (36 if key == "firefly" else 16)
        pose["wing"] = 1.1
        pose["fold"] = 0.0
        pose["glow"] = 1.0
        pose["rot"] = wave * 8
    return pose


def _c(rgb, dim, a=255):
    return tuple(max(0, min(255, int(c * dim))) for c in rgb) + (a,)


def paint_insect(key: str, anim: str, index: int) -> Image.Image:
    n = ANIMS[anim]
    pose = pose_for(key, anim, index, n)
    img = Image.new("RGBA", (HI, HI), (0, 0, 0, 255))
    d = ImageDraw.Draw(img, "RGBA")
    cx, cy = HI / 2 + pose["dx"] * 2, HI / 2 + 36 + pose["dy"] * 2
    s = 2.35 * pose["scale"]
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

    wing = pose["wing"]
    glow = pose["glow"]
    if key == "honeybee":
        gold, band, wing_c = (232, 176, 48), (28, 24, 20), (220, 228, 236)
        ell(-16, -14 - wing * 3, 15, 9, wing_c, 140)
        ell(16, -14 + wing * 3, 15, 9, wing_c, 140)
        ell(0, 2, 26, 16, gold)
        for x in (-10, 0, 10):
            ln(x, -12, x, 14, band, 2)
        ell(-24, 0, 9, 7, band)
        ln(-28, -4, -40, -20, band, 1)
        ln(-24, -2, -34, -24, band, 1)
        ell(-30, -2, 2.5, 2.5, (252, 220, 80))
    elif key == "monarch":
        orange, vein, rim = (216, 96, 32), (20, 16, 14), (248, 248, 244)
        spread = 32 * wing
        for side in (-1, 1):
            chord([(0, 0), (side * spread, -20), (side * spread * 1.05, 4), (0, 6)], orange, 235)
            chord([(0, 4), (side * spread * 0.75, 8), (side * spread * 0.7, 24), (0, 10)], orange, 220)
            ln(0, 0, side * spread, -16, vein, 1, 200)
            ln(0, 4, side * spread * 0.65, 20, vein, 1, 200)
            ell(side * (spread - 3), -14, 2.6, 2.6, rim)
            ell(side * (spread - 7), 6, 2.0, 2.0, rim)
        ell(0, 0, 4, 16, vein)
    elif key == "luna":
        green, eye, body = (168, 216, 140), (232, 196, 88), (88, 120, 72)
        spread = 28 * wing
        for side in (-1, 1):
            chord([(0, 2), (side * spread, -22), (side * spread * 0.7, 8), (0, 8)], green, 230)
            chord([(side * 4, 8), (side * 20 * wing, 34), (side * 6, 42), (0, 10)], green, 200)
            ell(side * 14 * wing, -6, 5, 5, eye, 220)
        ell(0, 2, 5, 11, body)
        if anim == "eat":
            ln(-3, 8, 3, 8, body, 1, 140)
    elif key == "firefly":
        shell, glow_c, wing_c = (48, 40, 28), (255, 220, 64), (210, 216, 220)
        ell(-14, -12 - wing * 2, 12, 7, wing_c, 100)
        ell(14, -12 + wing * 2, 12, 7, wing_c, 100)
        ell(0, -2, 20, 12, shell)
        ell(0, -6, 18, 7, (72, 88, 40), 230)
        ga = int(80 + 160 * glow)
        ell(0, 14, 12 + glow * 5, 9 + glow * 4, glow_c, ga)
        ell(0, 14, 6, 4, (255, 255, 200), min(255, ga + 40))
    elif key == "darner":
        green, wing_c, eye = (64, 140, 88), (200, 220, 232), (232, 196, 64)
        for side in (-1, 1):
            ell(side * 26, -7 + (1 - wing) * 3, 24, 5, wing_c, 140)
            ell(side * 26, 2 - (1 - wing) * 2, 24, 5, wing_c, 130)
        ell(0, 6, 7, 26, green)
        ell(0, -20, 11, 9, (48, 96, 72))
        ell(0, -22, 4, 4, eye)
        ln(0, 28, 0, 40, (40, 72, 48), 1)
    elif key == "stick":
        twig, joint = (122, 88, 48), (88, 60, 32)
        ln(-2, -46, 6, 50, twig, 4)
        ln(-2, -16, -26, -8, twig, 2)
        ln(4, -8, 28, -2, twig, 2)
        ln(-1, 10, -24, 22, twig, 2)
        ln(5, 18, 26, 30, twig, 2)
        ln(0, 32, -16, 44, twig, 2)
        ln(6, 36, 18, 48, twig, 2)
        ell(0, -50, 5, 5, joint)
    elif key == "carpenter_ant":
        black = (24, 22, 20)
        ell(-26, 2, 11, 9, black)
        ell(-2, 0, 13, 11, black)
        ell(22, 2, 13, 10, black)
        ell(-2, -2, 5, 4, (56, 52, 48), 130)
        ln(-8, 8, -20, 26 + math.sin(index) * 3, black, 2)
        ln(2, 10, 8, 28 - math.sin(index) * 3, black, 2)
        ln(16, 8, 30, 26 + math.sin(index) * 3, black, 2)
        ln(-16, 8, -6, 26, black, 1)
        ln(10, 10, 18, 26, black, 1)
        ln(-34, -2, -48, -16, black, 1)
        ln(-32, 0, -46, -20, black, 1)
    elif key == "ladybird":
        red, spot, head = (196, 40, 36), (16, 14, 12), (20, 18, 16)
        ell(0, 4, 28, 22, red)
        ln(0, -16, 0, 22, spot, 2)
        for x, y in ((-10, -4), (10, -4), (-13, 10), (13, 10), (0, 6), (-8, 16), (8, 16)):
            ell(x, y, 3.8, 3.8, spot)
        ell(0, -20, 11, 7, head)
    elif key == "mantis":
        green, dark = (96, 148, 64), (56, 96, 44)
        ell(0, 8, 7, 24, green)
        ell(0, -18, 11, 11, green)
        ell(-4, -20, 2.6, 2.6, (232, 220, 96))
        ell(4, -20, 2.6, 2.6, (232, 220, 96))
        if pose["fold"] > 0.5:
            ln(-4, -4, -18, 12, green, 3)
            ln(-18, 12, -9, 20, green, 3)
            ln(4, -4, 18, 12, green, 3)
            ln(18, 12, 9, 20, green, 3)
        else:
            ln(-4, -4, -30, -10, green, 3)
            ln(4, -4, 30, -10, green, 3)
        ln(-2, 24, -14, 44, dark, 2)
        ln(2, 24, 14, 44, dark, 2)
    else:
        body, wing_c, eye = (32, 28, 26), (70, 64, 56), (176, 36, 32)
        chord([(-4, -8), (-32, 6), (-8, 30), (0, 6)], wing_c, 180)
        chord([(4, -8), (32, 6), (8, 30), (0, 6)], wing_c, 180)
        ell(0, 6, 14, 18, body)
        ell(-9, -8, 6, 6, eye)
        ell(9, -8, 6, 6, eye)
        if anim == "play":
            ln(-5, 8, 5, 8, (200, 160, 80), 1)
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
    src = INSECTS_TS.read_text()
    start = src.index("export const INSECT_ROSTER")
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
