#!/usr/bin/env python3
"""Paint honest stone sprites and append the desktop roster.

Ten of the stone. A tuatara is not a lizard. An alligator is not a crocodile.
Pad climbs. Wink flashes. Dash is not Sash. Shift walks slow.
Spike wears a crown. Levee sits the bank. Jaw shows a tooth.
Beak is not Ink. Lid shuts. Peak is her own order.
The garden water lily keeps Disk; Pad is the gecko now.
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
STONE_TS = ROOT / "web" / "src" / "lib" / "pets" / "stone.ts"
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
    "gecko",
    "anole",
    "skink",
    "chameleon",
    "horned_lizard",
    "alligator",
    "crocodile",
    "snapper",
    "box_turtle",
    "tuatara",
]

LATIN = {
    "gecko": "Hemidactylus turcicus",
    "anole": "Anolis carolinensis",
    "skink": "Plestiodon fasciatus",
    "chameleon": "Chamaeleo calyptratus",
    "horned_lizard": "Phrynosoma cornutum",
    "alligator": "Alligator mississippiensis",
    "crocodile": "Crocodylus acutus",
    "snapper": "Chelydra serpentina",
    "box_turtle": "Terrapene carolina",
    "tuatara": "Sphenodon punctatus",
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
        "climb": 0.0,
        "dewlap": 0.0,
        "shut": 0.0,
    }
    if anim == "idle":
        pose["rot"] = wave * (0.4 if key in ("chameleon", "tuatara", "box_turtle") else 0.9)
        if key == "gecko":
            pose["climb"] = 0.4
            pose["dy"] = -4 + wave * 1.2
        if key == "anole":
            pose["dewlap"] = 0.15 + 0.1 * abs(wave)
        if key == "alligator":
            pose["dy"] = 6
        if key == "tuatara":
            pose["rot"] = wave * 0.2
    elif anim == "walk":
        if key == "gecko":
            pose["climb"] = 1.0
            pose["dy"] = -10 + wave * 3
            pose["dx"] = wave * 6
        elif key == "chameleon":
            pose["dx"] = wave * 2
            pose["dy"] = abs(wave) * 0.6
            pose["rot"] = wave * 0.8
        elif key == "skink":
            pose["dx"] = wave * 10
            pose["dy"] = abs(wave) * 1.4
        elif key in ("alligator", "crocodile"):
            pose["dx"] = wave * 4
            pose["dy"] = 4 + abs(wave)
        elif key == "tuatara":
            pose["dx"] = wave * 2
            pose["rot"] = wave * 0.6
        elif key == "box_turtle":
            pose["dx"] = wave * 3
            pose["dy"] = abs(wave) * 0.8
        else:
            pose["dx"] = wave * 6
            pose["dy"] = abs(wave) * 1.6
    elif anim == "sit":
        pose["dy"] = 10
        pose["scale"] = 0.96
        if key == "gecko":
            pose["climb"] = 0.8
            pose["dy"] = -6
        if key in ("alligator", "crocodile"):
            pose["dy"] = 14
        if key == "box_turtle":
            pose["shut"] = 0.7
        if key == "tuatara":
            pose["rot"] = -1
    elif anim == "sleep":
        pose["rot"] = -6 if key != "gecko" else 8
        pose["dy"] = 16 if key != "gecko" else -8
        pose["dim"] = 0.78
        if key == "box_turtle":
            pose["shut"] = 1.0
        if key == "gecko":
            pose["climb"] = 1.0
    elif anim == "talk":
        pose["dy"] = -2 + wave * 1.6
        if key == "anole":
            pose["dewlap"] = 0.9
        if key == "gecko":
            pose["open"] = 0.3
    elif anim == "eat":
        pose["dy"] = 8
        pose["open"] = 0.4 + 0.2 * abs(wave)
        if key == "chameleon":
            pose["dx"] = 4
        if key == "horned_lizard":
            pose["dy"] = 10
    elif anim == "play":
        if key == "gecko":
            pose["climb"] = 1.0
            pose["dy"] = -16 + wave * 4
        elif key == "anole":
            pose["dewlap"] = 1.0
            pose["dy"] = -4
        elif key == "skink":
            pose["dx"] = wave * 12
        elif key == "horned_lizard":
            pose["glow"] = 0.4
        elif key == "snapper":
            pose["open"] = 0.8
            pose["dx"] = wave * 4
        elif key == "box_turtle":
            pose["shut"] = 0.2 + 0.6 * (i % 2)
        else:
            pose["rot"] = wave * 4
            pose["dy"] = -4 + wave * 2
    return pose


def _c(rgb, dim, a=255):
    return tuple(max(0, min(255, int(c * dim))) for c in rgb) + (a,)


def paint_stone(key: str, anim: str, index: int) -> Image.Image:
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

    def ln(x1, y1, x2, y2, rgb, w=2, a=255):
        A, B = xf(x1, y1)
        C, D = xf(x2, y2)
        d.line((A, B, C, D), fill=_c(rgb, dim, a), width=max(1, int(w * s)))

    def poly(pts, rgb, a=255):
        d.polygon([xf(x, y) for x, y in pts], fill=_c(rgb, dim, a))

    if key == "gecko":
        pale, belly, pad, eye = (212, 188, 164), (236, 220, 200), (196, 148, 132), (40, 28, 20)
        climb = pose["climb"]
        ell(0, 0, 28, 14, pale)
        ell(4, 4, 16, 8, belly)
        ell(-26, -6, 14, 10, pale)
        ell(-30, -8, 4, 3, eye)
        ell(-22, -10, 3, 2, eye)
        for sx, sy in ((-10, 10), (6, 12), (16, 8), (-18, 8)):
            ell(sx, sy - climb * 4, 7, 4, pale)
            ell(sx + 4, sy + 2 - climb * 4, 5, 3, pad)
            ell(sx - 4, sy + 2 - climb * 4, 5, 3, pad)
        ln(22, 2, 40, 8 + math.sin(index) * 3, pale, 3)
        if pose["open"]:
            ell(-28, -2, 5, 3, (80, 40, 40))
        return img

    if key == "anole":
        green, brown, pink, eye = (72, 148, 72), (120, 92, 56), (220, 96, 112), (24, 20, 16)
        body = brown if pose["dewlap"] > 0.7 and index % 2 else green
        ell(0, 2, 22, 10, body)
        ell(-22, -4, 12, 8, body)
        ell(-26, -6, 3, 3, eye)
        if pose["dewlap"] > 0.2:
            poly(((-18, 4), (-8, 4 + pose["dewlap"] * 18), (-20, 6 + pose["dewlap"] * 10)), pink)
        ln(20, 2, 38, 0 + math.sin(index) * 2, body, 3)
        for sx, sy in ((-8, 10), (8, 10)):
            ell(sx, sy, 5, 3, body)
        return img

    if key == "skink":
        bronze, cream, blue, dark = (120, 80, 44), (228, 212, 176), (56, 120, 188), (36, 24, 16)
        ell(0, 2, 26, 11, bronze)
        ell(2, 5, 16, 6, cream)
        for y in (-4, 0, 4):
            ln(-16, y, 18, y, cream, 1, 200)
        ell(-24, -2, 10, 7, bronze)
        ell(-28, -4, 3, 2, dark)
        ln(22, 2, 44, 6, blue if index < 3 else bronze, 4)
        for sx in (-10, 6):
            ell(sx, 12, 5, 3, bronze)
        return img

    if key == "chameleon":
        green, lime, casque, eye = (88, 140, 64), (156, 188, 88), (72, 112, 52), (232, 228, 196)
        ell(2, 4, 24, 14, green)
        ell(6, 8, 14, 8, lime)
        poly((( -18, -16), (-8, -28), (4, -12), (-20, -6)), casque)
        ell(-22, -2, 12, 10, green)
        ell(-26, -4, 6, 6, eye)
        ell(-24, -4, 2, 2, (20, 16, 12))
        ell(-16, 0, 5, 5, eye)
        ell(-14, 1, 2, 2, (20, 16, 12))
        # tong feet
        poly(((-8, 12), (-18, 18), (-4, 20), (2, 14)), green)
        poly(((10, 12), (22, 16), (16, 22), (6, 16)), green)
        ln(22, 4, 36, -8 + math.sin(index) * 2, casque, 3)
        if pose["open"] or anim == "eat":
            ln(-28, 2, -48, 4, (200, 80, 80), 2)
        return img

    if key == "horned_lizard":
        tan, rust, horn, belly = (176, 132, 80), (140, 88, 48), (92, 64, 36), (220, 196, 156)
        ell(0, 4, 30, 16, tan)
        ell(2, 8, 18, 8, belly)
        for hx, hy in ((-22, -14), (-12, -20), (-2, -22), (8, -18), (16, -12)):
            poly(((hx, hy + 10), (hx + 3, hy), (hx + 6, hy + 10)), horn)
        ell(-24, -2, 12, 9, tan)
        ell(-26, -2, 3, 2, (28, 20, 14))
        if pose["glow"]:
            ell(-28, -4, 4, 3, (180, 32, 32), 180)
        ln(24, 6, 34, 10, rust, 3)
        return img

    if key == "alligator":
        olive, pale, dark = (56, 80, 48), (168, 172, 120), (28, 36, 24)
        ell(4, 6, 36, 16, olive)
        ell(6, 10, 22, 8, pale)
        # U-snout
        ell(-36, 2, 22, 12, olive)
        ell(-40, 4, 16, 8, pale)
        ell(-48, 0, 4, 3, dark)
        ell(-42, -2, 3, 2, dark)
        ln(-28, 10, -20, 10, dark, 1)
        for sx in (-8, 10, 24):
            ell(sx, 18, 6, 4, olive)
        ln(32, 6, 52, 10, olive, 5)
        return img

    if key == "crocodile":
        slate, cream, dark = (88, 100, 80), (196, 196, 168), (32, 36, 28)
        ell(4, 6, 34, 15, slate)
        ell(6, 10, 20, 7, cream)
        # V-snout
        poly(((-20, -2), (-56, 2), (-52, 12), (-16, 10)), slate)
        poly(((-24, 2), (-52, 6), (-20, 8)), cream)
        ell(-48, 0, 3, 2, dark)
        # fourth tooth shows
        ell(-40, 10, 2, 3, (236, 228, 216))
        for sx in (-6, 12, 24):
            ell(sx, 18, 6, 4, slate)
        ln(30, 6, 50, 8, slate, 5)
        return img

    if key == "snapper":
        mud, keel, beak, tail = (88, 72, 48), (56, 44, 28), (48, 36, 24), (40, 32, 24)
        ell(2, 2, 28, 18, mud)
        ln(-10, -8, 16, -10, keel, 3)
        ln(-6, 0, 14, -2, keel, 2)
        ell(-26, 2, 14, 10, mud)
        poly(((-36, 0), (-44, 6), (-32, 10)), beak)
        ln(24, 6, 48, 14, tail, 4)
        for sx in (-8, 10):
            ell(sx, 18, 6, 4, mud)
        if pose["open"]:
            poly(((-36, 4), (-46, 12), (-30, 12)), (40, 24, 20))
        return img

    if key == "box_turtle":
        dome, scute, skin, hinge = (72, 96, 52), (196, 140, 56), (64, 80, 44), (48, 40, 28)
        shut = pose["shut"]
        ell(0, 2, 26, 20 - shut * 4, dome)
        ell(-8, -6, 8, 6, scute)
        ell(8, -4, 7, 5, scute)
        ell(0, 6, 9, 5, scute)
        if shut < 0.8:
            ell(-24, 4, 10, 8, skin)
            ell(-28, 2, 3, 2, (20, 16, 12))
            for sx in (-8, 8):
                ell(sx, 18, 5, 3, skin)
        else:
            ell(0, 16, 22, 6, hinge)
        return img

    if key == "tuatara":
        olive, crest, eye, third = (108, 116, 88), (72, 80, 56), (28, 24, 16), (196, 180, 88)
        ell(2, 4, 26, 14, olive)
        ell(4, 8, 14, 7, (168, 172, 140))
        for i, x in enumerate((-8, 0, 8, 16, 22)):
            poly(((x, -6), (x + 2, -18 - (i % 2) * 2), (x + 4, -4)), crest)
        ell(-22, 0, 12, 9, olive)
        ell(-26, -2, 3, 3, eye)
        ell(-16, -10, 3, 2, third)
        ln(24, 4, 40, 8, olive, 4)
        for sx in (-8, 8):
            ell(sx, 16, 5, 3, olive)
        return img

    ell(0, 0, 24, 14, (120, 100, 80))
    return img


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
    src = STONE_TS.read_text()
    start = src.index("export const STONE_ROSTER")
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
    for row in roster:
        if row.get("key") == "water_lily":
            row["slug"] = "disk"
            row["name"] = "Disk"
            named = row.get("lines", {}).get("named")
            if isinstance(named, str) and named.startswith("Pad"):
                row["lines"]["named"] = "Disk. I am the floor that blooms."
    ROSTER_PATH.write_text(json.dumps(roster, separators=(",", ":")) + "\n")
    print(f"roster {len(roster)} (+{added})", flush=True)


def main():
    os.chdir(ROOT)
    write_sprites()
    write_portraits()
    write_roster()


if __name__ == "__main__":
    main()
