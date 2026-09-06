#!/usr/bin/env python3
"""Paint honest roost sprites and append the desktop roster.

The roost needs distinct birds — Soot is not Wedge, Heart is not Hook,
Drake is not Vee, Sip is not Thrum. These frames are painted specimen
plates on black, then copied to the Electron overlay. Portraits sit the
same plate on the study blotter. Quill stays the macaw. Ember stays the
phoenix. Bloom stays the only axolotl.
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
ROOST_TS = ROOT / "web" / "src" / "lib" / "pets" / "roost.ts"
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
    "crow",
    "raven",
    "barn_owl",
    "red_tail",
    "chickadee",
    "robin",
    "mallard",
    "canada_goose",
    "pileated",
    "hummingbird",
]

LATIN = {
    "crow": "Corvus brachyrhynchos",
    "raven": "Corvus corax",
    "barn_owl": "Tyto alba",
    "red_tail": "Buteo jamaicensis",
    "chickadee": "Poecile atricapillus",
    "robin": "Turdus migratorius",
    "mallard": "Anas platyrhynchos",
    "canada_goose": "Branta canadensis",
    "pileated": "Dryocopus pileatus",
    "hummingbird": "Archilochus colubris",
}

FLYERS = ("crow", "raven", "barn_owl", "red_tail", "chickadee", "pileated", "hummingbird")
HOPPERS = ("crow", "raven", "chickadee", "robin", "pileated")
WALKERS = ("mallard", "canada_goose")


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
        "wing": 0.0,
    }
    if anim == "idle":
        pose["rot"] = wave * (1.4 if key not in WALKERS else 0.6)
        if key == "hummingbird":
            pose["dy"] = -8 + wave * 3
            pose["wing"] = 0.6 + 0.4 * abs(math.sin(i * 2.4))
        if key == "red_tail":
            pose["dy"] = wave * 1.4
    elif anim == "walk":
        if key in HOPPERS:
            pose["hop"] = abs(wave)
            pose["dy"] = -8 * pose["hop"]
            pose["dx"] = wave * 8
            pose["wing"] = 0.2 + 0.3 * pose["hop"]
        elif key == "hummingbird":
            pose["dx"] = wave * 10
            pose["dy"] = -10 + wave * 4
            pose["wing"] = 0.8 + 0.2 * abs(wave)
        elif key == "red_tail":
            pose["dx"] = wave * 12
            pose["dy"] = -6 + abs(wave) * 4
            pose["wing"] = 0.7
            pose["rot"] = wave * 2
        elif key == "barn_owl":
            pose["dx"] = wave * 6
            pose["dy"] = -4 + abs(wave) * 2
            pose["wing"] = 0.45
        elif key == "mallard":
            pose["dx"] = wave * 7
            pose["dy"] = abs(wave) * 2
        else:
            pose["dx"] = wave * 8
            pose["dy"] = abs(wave) * 1.6
    elif anim == "sit":
        pose["dy"] = 12
        pose["scale"] = 0.96
        pose["rot"] = -2
        if key == "hummingbird":
            pose["dy"] = 4
            pose["wing"] = 0.15
    elif anim == "sleep":
        pose["rot"] = -8
        pose["dy"] = 18
        pose["dim"] = 0.78
        pose["wing"] = 0.05
    elif anim == "talk":
        pose["dy"] = -3 + wave * 2
        pose["open"] = 0.3 + 0.2 * (i % 2)
        if key in ("crow", "raven", "canada_goose", "chickadee"):
            pose["scale"] = 1.02 + 0.03 * (i % 2)
    elif anim == "eat":
        pose["dy"] = 8
        pose["rot"] = 2 + wave * 2
        pose["open"] = 0.25
        if key == "mallard":
            pose["rot"] = 8
        if key == "hummingbird":
            pose["dy"] = -4
            pose["wing"] = 0.5
    elif anim == "play":
        if key in HOPPERS:
            pose["hop"] = 0.8 + 0.2 * abs(math.sin(u * math.pi))
            pose["dy"] = -16 * pose["hop"]
            pose["dx"] = wave * 8
            pose["wing"] = 0.6
        elif key == "hummingbird":
            pose["dy"] = -14 + wave * 5
            pose["dx"] = wave * 12
            pose["wing"] = 1.0
        elif key == "red_tail":
            pose["dy"] = -12
            pose["wing"] = 0.9
            pose["rot"] = wave * 4
        elif key == "barn_owl":
            pose["dy"] = -8
            pose["wing"] = 0.7
        elif key == "mallard":
            pose["dy"] = 6 + wave * 3
            pose["rot"] = 6
        else:
            pose["rot"] = wave * 6
            pose["dy"] = -6 + wave * 3
    return pose


def _c(rgb, dim, a=255):
    return tuple(max(0, min(255, int(c * dim))) for c in rgb) + (a,)


def paint_roost(key: str, anim: str, index: int) -> Image.Image:
    n = ANIMS[anim]
    pose = pose_for(key, anim, index, n)
    img = Image.new("RGBA", (HI, HI), (0, 0, 0, 255))
    d = ImageDraw.Draw(img, "RGBA")
    cx, cy = HI / 2 + pose["dx"] * 2, HI / 2 + 48 + pose["dy"] * 2
    s = 2.2 * pose["scale"]
    rot = math.radians(pose["rot"])
    dim = pose["dim"]
    wing = pose["wing"]
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

    if key == "crow":
        # Fan tail. Black. Not a raven.
        ink, gloss, eye = (28, 28, 32), (56, 56, 64), (236, 196, 48)
        lift = -6 * wing
        poly([(8, 4), (22, 2 + lift), (26, 10), (10, 10)], ink, 220)
        poly([(-2, 8), (6, 18), (14, 20), (18, 16), (10, 10), (0, 8)], ink, 230)
        ell(0, 2, 16, 10, ink, 240)
        ell(-12, -4, 9, 8, ink, 240)
        ell(-16, -2, 2.2, 2.2, eye, 240)
        ln(-20, 0, -26, 4, (20, 20, 22), 2)
        ell(2, 6, 8, 4, gloss, 160)
    elif key == "raven":
        # Wedge tail. Larger. A croak. Not a crow.
        ink, gloss, eye = (20, 20, 24), (48, 48, 56), (220, 180, 40)
        lift = -7 * wing
        poly([(10, 2), (30, -4 + lift), (28, 8), (10, 8)], ink, 230)
        poly([(8, 6), (26, 4), (32, 10), (12, 12)], ink, 220)
        ell(0, 2, 18, 11, ink, 240)
        ell(-14, -6, 11, 9, ink, 240)
        ell(-18, -4, 2.4, 2.4, eye, 240)
        ln(-22, 0, -32, 4, (16, 16, 18), 3)
        ell(2, 6, 9, 4, gloss, 150)
    elif key == "barn_owl":
        # Heart face. Pale. Not a hawk.
        cream, disk, rust = (232, 220, 196), (244, 236, 220), (140, 96, 64)
        lift = -8 * wing
        poly([(6, 2), (24, -2 + lift), (22, 10), (6, 8)], rust, 200)
        ell(0, 4, 16, 11, (180, 156, 120), 230)
        ell(-10, -8, 14, 13, cream, 240)
        ell(-16, -10, 6, 7, disk, 230)
        ell(-6, -8, 6, 7, disk, 230)
        ell(-16, -9, 2.0, 2.4, (28, 24, 20), 240)
        ell(-6, -7, 2.0, 2.4, (28, 24, 20), 240)
        ln(-20, -2, -16, 2, rust, 2)
    elif key == "red_tail":
        # Rusty fan. Hooked bill. Not an owl. Not Felt.
        brown, rust, cream = (132, 88, 52), (176, 72, 40), (220, 196, 160)
        lift = -10 * wing
        poly([(8, 2), (28, -6 + lift), (30, 6), (10, 8)], rust, 230)
        poly([(10, 0), (26, -10 + lift), (24, 2)], (196, 96, 48), 200)
        ell(0, 2, 16, 10, brown, 235)
        ell(-12, -6, 10, 8, brown, 235)
        ell(0, 6, 8, 4, cream, 180)
        ln(-20, -2, -28, 2, (48, 36, 28), 3)
        ell(-16, -6, 2.2, 2.2, (20, 16, 12), 240)
    elif key == "chickadee":
        # Black cap. White cheeks. Small. Not a sparrow rumor.
        cap, cream, buff = (24, 24, 28), (244, 240, 232), (188, 168, 120)
        lift = -4 * wing
        poly([(6, 2), (16, 0 + lift), (18, 6), (8, 6)], buff, 210)
        ell(0, 4, 10, 7, buff, 235)
        ell(-8, -2, 7, 6, cream, 240)
        ell(-8, -6, 7, 4, cap, 240)
        ell(-10, -2, 2.0, 2.0, (20, 20, 18), 240)
        ln(-14, 0, -18, 2, (40, 36, 32), 2)
        ell(0, 6, 5, 3, cream, 180)
    elif key == "robin":
        # Brick breast. Dark head. A hop. Not the European robin.
        slate, brick, cream = (56, 56, 60), (176, 64, 48), (236, 220, 196)
        lift = -5 * wing
        poly([(6, 2), (18, 0 + lift), (20, 8), (8, 8)], slate, 210)
        ell(0, 4, 13, 9, slate, 235)
        ell(0, 8, 9, 5, brick, 230)
        ell(-10, -4, 8, 7, slate, 240)
        ell(-8, 0, 5, 4, cream, 180)
        ell(-12, -4, 2.0, 2.0, (20, 20, 16), 240)
        ln(-16, -1, -20, 2, (40, 32, 24), 2)
    elif key == "mallard":
        # Green head. Yellow bill. Not a goose. Not Coin.
        green, gray, yellow, rust = (32, 92, 56), (148, 148, 140), (232, 188, 48), (176, 72, 40)
        poly([(8, 2), (22, 0), (26, 6), (10, 8)], gray, 210)
        ell(0, 4, 16, 9, gray, 235)
        ell(2, 8, 8, 4, (220, 220, 212), 180)
        ell(-12, -2, 9, 7, green, 240)
        ln(-20, 0, -28, 2, yellow, 3)
        ell(-16, -4, 2.0, 2.0, (20, 24, 16), 240)
        poly([(4, 6), (12, 8), (10, 12)], rust, 180)
    elif key == "canada_goose":
        # Black head. White chinstrap. A V. Not a duck.
        brown, black, white = (120, 88, 56), (24, 24, 28), (240, 236, 228)
        poly([(10, 2), (28, -2), (30, 8), (12, 10)], brown, 220)
        ell(0, 4, 18, 10, brown, 235)
        ell(-14, -6, 10, 8, black, 240)
        ell(-12, 0, 6, 3, white, 230)
        ln(-22, -2, -28, 2, black, 3)
        ell(-18, -6, 2.2, 2.2, (20, 20, 16), 240)
        ell(2, 8, 8, 4, (196, 180, 148), 160)
    elif key == "pileated":
        # Red crest. Rectangular hole. Not a flicker.
        ink, crest, white = (24, 24, 28), (196, 40, 40), (236, 232, 224)
        lift = -5 * wing
        poly([(8, 2), (22, 0 + lift), (24, 8), (10, 8)], ink, 220)
        ell(0, 4, 14, 9, ink, 240)
        ell(-12, -6, 9, 8, ink, 240)
        poly([(-16, -12), (-10, -20), (-6, -12)], crest, 235)
        ell(-14, -4, 5, 3, white, 210)
        ln(-20, 0, -32, 2, (32, 28, 24), 3)
        ell(-16, -6, 2.0, 2.0, (220, 196, 48), 240)
    else:
        # Needle bill. Ruby throat. Hover. Not a bee. Not Thrum.
        green, ruby, cream = (48, 140, 80), (176, 32, 48), (236, 228, 196)
        lift = -8 * wing
        poly([(-2, 0), (10, -6 + lift), (12, 2), (2, 4)], green, 200)
        poly([(-2, 2), (10, 8 + lift), (12, 2), (2, 0)], green, 180)
        ell(0, 2, 7, 5, green, 235)
        ell(-6, -2, 5, 4, green, 240)
        ell(-4, 2, 4, 3, ruby, 220)
        ln(-10, 0, -20, 1, (40, 36, 28), 2)
        ell(-8, -2, 1.4, 1.4, (20, 20, 16), 240)
        ell(2, 4, 3, 2, cream, 160)

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
    src = ROOST_TS.read_text()
    start = src.index("export const ROOST_ROSTER")
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
