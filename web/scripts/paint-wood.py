#!/usr/bin/env python3
"""Paint honest wood sprites and append the desktop roster.

Ten wild mammals of the wood. A bat is not a bird. A porcupine is not Burr.
Rack flags a tail. Cape hangs. Cache hides a thought. Slick slides.
Wash rinses. Stripe wears a warning. Grin goes still. Dam keeps a lodge.
Spine does not throw. Coal is a bear, not Rui.
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
WOOD_TS = ROOT / "web" / "src" / "lib" / "pets" / "wood.ts"
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
    "deer",
    "bat",
    "squirrel",
    "otter",
    "raccoon",
    "skunk",
    "opossum",
    "beaver",
    "porcupine",
    "black_bear",
]

LATIN = {
    "deer": "Odocoileus virginianus",
    "bat": "Eptesicus fuscus",
    "squirrel": "Sciurus carolinensis",
    "otter": "Lontra canadensis",
    "raccoon": "Procyon lotor",
    "skunk": "Mephitis mephitis",
    "opossum": "Didelphis virginiana",
    "beaver": "Castor canadensis",
    "porcupine": "Erethizon dorsatum",
    "black_bear": "Ursus americanus",
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
        "flag": 0.0,
        "hang": 0.0,
    }
    if anim == "idle":
        pose["rot"] = wave * (0.8 if key != "bat" else 1.6)
        if key == "bat":
            pose["hang"] = 1.0
            pose["dy"] = -6 + wave * 1.4
        if key == "deer":
            pose["flag"] = 0.2 + 0.15 * abs(wave)
        if key == "otter":
            pose["dx"] = wave * 2
        if key == "squirrel":
            pose["hop"] = abs(wave) * 0.2
    elif anim == "walk":
        if key == "bat":
            pose["hang"] = 0.0
            pose["dy"] = -10 + wave * 4
            pose["dx"] = wave * 8
            pose["rot"] = wave * 6
        elif key == "deer":
            pose["dx"] = wave * 8
            pose["dy"] = abs(wave) * 2
            pose["flag"] = 0.7 + 0.3 * abs(wave)
        elif key == "squirrel":
            pose["hop"] = abs(wave)
            pose["dy"] = -8 * pose["hop"]
            pose["dx"] = wave * 8
        elif key == "otter":
            pose["dx"] = wave * 12
            pose["dy"] = wave * 3
            pose["rot"] = wave * 3
        elif key == "porcupine":
            pose["dx"] = wave * 3
            pose["rot"] = wave * 1.2
        elif key == "black_bear":
            pose["dx"] = wave * 5
            pose["dy"] = abs(wave) * 1.4
        else:
            pose["dx"] = wave * 7
            pose["dy"] = abs(wave) * 2
    elif anim == "sit":
        pose["dy"] = 12
        pose["scale"] = 0.96
        pose["rot"] = -2
        if key == "bat":
            pose["hang"] = 1.0
            pose["dy"] = -8
        if key == "opossum":
            pose["rot"] = 8
            pose["dy"] = 18
        if key == "porcupine":
            pose["scale"] = 1.06
    elif anim == "sleep":
        pose["rot"] = -8 if key != "bat" else 0
        pose["dy"] = 18 if key != "bat" else -10
        pose["dim"] = 0.78
        if key == "bat":
            pose["hang"] = 1.0
        if key == "opossum":
            pose["rot"] = 12
    elif anim == "talk":
        pose["dy"] = -3 + wave * 2
        if key == "squirrel":
            pose["scale"] = 1.02 + 0.02 * (i % 2)
        if key == "bat":
            pose["hang"] = 0.6
    elif anim == "eat":
        pose["dy"] = 8
        pose["rot"] = 2 + wave * 2
        if key == "beaver":
            pose["open"] = 0.4
        if key == "black_bear":
            pose["scale"] = 1.04
    elif anim == "play":
        if key == "deer":
            pose["flag"] = 1.0
            pose["dx"] = wave * 8
        elif key == "bat":
            pose["dy"] = -14 + wave * 6
            pose["rot"] = wave * 10
        elif key == "otter":
            pose["dx"] = wave * 14
            pose["dy"] = -6 + wave * 5
            pose["rot"] = wave * 8
        elif key == "squirrel":
            pose["hop"] = 0.8
            pose["dy"] = -14
        elif key == "opossum":
            pose["rot"] = 16
            pose["dy"] = 16
        else:
            pose["rot"] = wave * 6
            pose["dy"] = -6 + wave * 3
    return pose


def _c(rgb, dim, a=255):
    return tuple(max(0, min(255, int(c * dim))) for c in rgb) + (a,)


def paint_wood(key: str, anim: str, index: int) -> Image.Image:
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

    def poly(pts, rgb, a=220):
        d.polygon([xf(*p) for p in pts], fill=_c(rgb, dim, a))

    if key == "deer":
        tan, cream, ink = (168, 132, 88), (236, 228, 212), (48, 36, 24)
        flag = pose["flag"]
        poly([(16, 2), (34, -2 - flag * 8), (36, 8), (18, 8)], cream, 230)
        poly([(18, 2), (32, 0 - flag * 4), (30, 6)], (220, 200, 176), 200)
        ell(0, 4, 20, 12, tan, 235)
        ell(2, 8, 12, 6, cream, 190)
        ell(-16, -2, 10, 8, tan, 235)
        ell(-18, -4, 3.6, 3.2, cream, 210)
        ell(-20, -4, 2.2, 2.2, ink, 240)
        ln(-22, -8, -28, -22, tan, 2)
        ln(-18, -8, -22, -24, tan, 2)
        ln(-12, 12, -16, 20, tan, 2)
        ln(-4, 12, -4, 20, tan, 2)
        ln(6, 12, 8, 20, tan, 2)
        ln(12, 12, 16, 20, tan, 2)
    elif key == "bat":
        brown, membrane, face = (72, 52, 36), (48, 36, 28), (96, 72, 52)
        flap = 0 if pose["hang"] > 0.5 else 8 + 6 * math.sin(index * 1.4)
        poly([(-6, 0), (-28, -10 - flap), (-32, 2), (-8, 6)], membrane, 210)
        poly([(6, 0), (28, -10 - flap), (32, 2), (8, 6)], membrane, 210)
        ln(-10, 2, -26, -6 - flap, (32, 24, 18), 1, 180)
        ln(10, 2, 26, -6 - flap, (32, 24, 18), 1, 180)
        ell(0, 2, 10, 8, brown, 235)
        ell(0, -2, 8, 6, face, 220)
        ell(-3, -4, 1.8, 1.8, (20, 16, 12), 240)
        ell(3, -4, 1.8, 1.8, (20, 16, 12), 240)
        ln(-2, -8, -6, -16, brown, 2)
        ln(2, -8, 6, -16, brown, 2)
        if pose["hang"] > 0.5:
            ln(-2, -16, 0, -28, brown, 2)
            ln(2, -16, 0, -28, brown, 2)
    elif key == "squirrel":
        gray, cream, ink = (148, 148, 140), (220, 212, 196), (36, 32, 28)
        poly([(10, 0), (28, -16), (32, -4), (14, 8)], gray, 220)
        poly([(16, -4), (28, -14), (26, -2)], cream, 180)
        ell(0, 4, 14, 10, gray, 235)
        ell(0, 8, 8, 5, cream, 200)
        ell(-12, -2, 8, 7, gray, 235)
        ell(-14, -4, 2.2, 2.2, ink, 240)
        ln(-8, 10, -12, 16, gray, 2)
        ln(-2, 10, -2, 16, gray, 2)
        ln(6, 10, 8, 16, gray, 2)
    elif key == "otter":
        slick, pale, ink = (72, 88, 96), (188, 196, 196), (24, 28, 32)
        poly([(12, 2), (34, 0), (36, 8), (14, 8)], slick, 220)
        ell(0, 4, 18, 8, slick, 235)
        ell(2, 7, 10, 4, pale, 190)
        ell(-16, 0, 9, 7, slick, 235)
        ell(-18, -2, 2.2, 2.2, ink, 240)
        ln(-10, 10, -16, 8, slick, 2)
        ln(-4, 10, -6, 14, slick, 2)
        ln(6, 10, 8, 14, slick, 2)
        ln(12, 10, 16, 8, slick, 2)
    elif key == "raccoon":
        gray, mask, cream = (120, 116, 108), (32, 28, 24), (220, 216, 208)
        poly([(12, 2), (30, 0), (32, 8), (14, 8)], gray, 220)
        for t in range(3):
            ell(18 + t * 4, 4, 2.4, 2.0, cream if t % 2 == 0 else mask, 210)
        ell(0, 4, 16, 10, gray, 235)
        ell(0, 8, 9, 5, cream, 200)
        ell(-14, -2, 9, 8, gray, 235)
        ell(-16, -2, 5, 3.2, mask, 230)
        ell(-12, -2, 4, 2.8, mask, 220)
        ell(-16, -4, 2.0, 2.0, (16, 14, 12), 240)
        ln(-10, 12, -14, 18, gray, 2)
        ln(-2, 12, -2, 18, gray, 2)
        ln(6, 12, 8, 18, gray, 2)
        ln(12, 12, 16, 18, gray, 2)
    elif key == "skunk":
        black, white, ink = (28, 28, 30), (236, 232, 224), (16, 16, 18)
        poly([(12, 0), (32, -6), (34, 4), (14, 8)], black, 220)
        poly([(14, -2), (30, -8), (28, 0)], white, 210)
        ell(0, 4, 16, 10, black, 235)
        ln(-6, -4, 12, -6, white, 3)
        ln(-4, 0, 10, -2, white, 2)
        ell(-14, -2, 8, 7, black, 235)
        ell(-16, -4, 2.2, 2.2, ink, 240)
        ln(-10, 12, -14, 18, black, 2)
        ln(-2, 12, -2, 18, black, 2)
        ln(6, 12, 8, 18, black, 2)
        ln(12, 12, 16, 18, black, 2)
    elif key == "opossum":
        gray, pink, ink = (168, 160, 148), (220, 168, 160), (40, 36, 32)
        poly([(12, 2), (32, 6), (30, 12), (12, 8)], gray, 200)
        ell(0, 4, 16, 10, gray, 230)
        ell(0, 8, 9, 5, (212, 204, 192), 190)
        ell(-14, -2, 9, 8, gray, 230)
        ell(-16, 2, 5, 2.4, pink, 200)
        ell(-16, -4, 2.2, 2.2, ink, 240)
        ln(-10, 12, -14, 16, gray, 2)
        ln(-2, 12, -2, 16, gray, 2)
        ln(6, 12, 8, 16, gray, 2)
        ln(12, 12, 16, 16, gray, 2)
    elif key == "beaver":
        brown, paddle, tooth = (112, 80, 52), (72, 52, 36), (236, 228, 208)
        poly([(12, 4), (30, 2), (32, 12), (14, 10)], paddle, 220)
        ell(0, 4, 16, 10, brown, 235)
        ell(0, 8, 9, 5, (168, 132, 88), 190)
        ell(-14, 0, 9, 7, brown, 235)
        ell(-16, 2, 3.2, 2.0, tooth, 230)
        ell(-16, -2, 2.2, 2.2, (28, 20, 16), 240)
        ln(-10, 12, -14, 16, brown, 2)
        ln(-2, 12, -2, 16, brown, 2)
        ln(6, 12, 8, 16, brown, 2)
        ln(12, 12, 14, 14, brown, 2)
    elif key == "porcupine":
        brown, quill, cream = (88, 68, 48), (48, 40, 32), (196, 180, 152)
        for x, y in ((-6, -10), (0, -14), (6, -12), (12, -10), (4, -8), (-2, -6), (10, -6)):
            ln(x, y + 8, x + 2, y - 6, quill, 2)
        ell(0, 4, 16, 11, brown, 235)
        ell(0, 8, 9, 5, cream, 190)
        ell(-14, 0, 8, 7, brown, 235)
        ell(-16, -2, 2.2, 2.2, (24, 18, 14), 240)
        ln(-10, 12, -14, 16, brown, 2)
        ln(-2, 12, -2, 16, brown, 2)
        ln(6, 12, 8, 16, brown, 2)
        ln(12, 12, 16, 16, brown, 2)
    else:
        coal, muzzle, ink = (36, 32, 30), (72, 60, 52), (16, 14, 12)
        poly([(14, 2), (28, 0), (30, 10), (16, 10)], coal, 220)
        ell(2, 4, 20, 14, coal, 235)
        ell(2, 10, 12, 6, muzzle, 200)
        ell(-16, -2, 12, 10, coal, 235)
        ell(-18, 2, 6, 4, muzzle, 210)
        ell(-20, -4, 2.6, 2.6, ink, 240)
        ell(-10, -8, 4, 4, coal, 230)
        ell(2, -8, 4, 4, coal, 230)
        ln(-12, 14, -16, 22, coal, 3)
        ln(-2, 14, -2, 22, coal, 3)
        ln(8, 14, 10, 22, coal, 3)
        ln(16, 14, 20, 22, coal, 3)

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
    src = WOOD_TS.read_text()
    start = src.index("export const WOOD_ROSTER")
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
        if row.get("key") == "garter":
            row["slug"] = "sash"
            row["name"] = "Sash"
            named = row.get("lines", {}).get("named")
            if isinstance(named, str) and named.startswith("Stripe"):
                row["lines"]["named"] = "Sash. There are three. I am all of them."
    ROSTER_PATH.write_text(json.dumps(roster, separators=(",", ":")) + "\n")
    print(f"roster {len(roster)} (+{added})", flush=True)


def main():
    os.chdir(ROOT)
    write_sprites()
    write_portraits()
    write_roster()


if __name__ == "__main__":
    main()
