#!/usr/bin/env python3
"""Paint honest Apoidea sprites and append the desktop roster.

Comb already lives in paint-insects.py. These ten are other bees, a drone,
a queen, and the nest as a place. A bumblebee is not a honey bee.
A carpenter bee does not keep honey the honey-bee way. A drone is not
a worker. The queen is not a second Comb. Wax is hex cells that sit.
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
BEES_TS = ROOT / "web" / "src" / "lib" / "pets" / "bees.ts"
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
    "bumblebee",
    "carpenter_bee",
    "mason_bee",
    "leafcutter",
    "stingless",
    "sweat_bee",
    "mining_bee",
    "honey_drone",
    "honey_queen",
    "honeycomb",
]

LATIN = {
    "bumblebee": "Bombus impatiens",
    "carpenter_bee": "Xylocopa virginica",
    "mason_bee": "Osmia lignaria",
    "leafcutter": "Megachile rotundata",
    "stingless": "Melipona beecheii",
    "sweat_bee": "Agapostemon virescens",
    "mining_bee": "Andrena vicina",
    "honey_drone": "Apis mellifera (drone)",
    "honey_queen": "Apis mellifera (queen)",
    "honeycomb": "Apis mellifera nest",
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
    if key == "honeycomb":
        if anim == "idle":
            pose["dy"] = wave * 1.2
        elif anim == "walk":
            pose["dy"] = 8
            pose["scale"] = 1.0
        elif anim == "sit":
            pose["dy"] = 16
        elif anim == "sleep":
            pose["rot"] = -6
            pose["dy"] = 22
            pose["dim"] = 0.78
        elif anim == "talk":
            pose["dy"] = wave * 2
        elif anim == "eat":
            pose["dy"] = 10
        elif anim == "play":
            pose["scale"] = 1.04
        return pose
    if anim == "idle":
        pose["dy"] = wave * (3 if key != "honey_queen" else 1)
        pose["wing"] = 0.92 + 0.08 * math.sin(i * 1.7)
    elif anim == "walk":
        if key == "honey_queen":
            pose["dx"] = (i - 2.5) * 4
            pose["dy"] = 10
            pose["wing"] = 0.7
        else:
            pose["dx"] = math.sin(i * 1.8) * 28
            pose["dy"] = -16 + math.cos(i * 2.1) * 12
            pose["rot"] = math.sin(i * 1.8) * 7
            pose["wing"] = 0.7 + 0.35 * abs(math.sin(i * 2.4))
    elif anim == "sit":
        pose["dy"] = 18
        pose["scale"] = 0.96
        pose["wing"] = 0.7
    elif anim == "sleep":
        pose["rot"] = -12
        pose["dy"] = 28
        pose["dim"] = 0.74
        pose["wing"] = 0.4
    elif anim == "talk":
        pose["dy"] = -4 + wave * 5
        pose["wing"] = 0.95
    elif anim == "eat":
        if key == "honeycomb":
            pose["dy"] = 8
        else:
            pose["dy"] = 14 + (i % 2) * 5
            pose["rot"] = 5
    elif anim == "play":
        pose["dy"] = -28 - abs(math.sin(u * math.pi)) * 14
        pose["wing"] = 1.1
        pose["rot"] = wave * 8
    return pose


def _c(rgb, dim, a=255):
    return tuple(max(0, min(255, int(c * dim))) for c in rgb) + (a,)


def paint_bee(key: str, anim: str, index: int) -> Image.Image:
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
    wing_c = (220, 228, 236)

    if key == "honeycomb":
        wax, dark, brood, store = (232, 188, 72), (120, 80, 28), (196, 140, 40), (248, 216, 96)
        cells = ((-22, -10), (0, -10), (22, -10), (-11, 8), (11, 8), (0, 26))
        for i, (ox, oy) in enumerate(cells):
            pts = []
            for nhex in range(6):
                ang = math.radians(60 * nhex - 30)
                pts.append((ox + math.cos(ang) * 13, oy + math.sin(ang) * 13))
            chord(pts, brood if i in (1, 4) else store if i == 2 else wax, 235)
            for a, b in zip(pts, pts[1:] + pts[:1]):
                ln(a[0], a[1], b[0], b[1], dark, 1, 200)
        return img.resize((OUT, OUT), Image.Resampling.LANCZOS)

    if key == "bumblebee":
        gold, band, fur = (232, 188, 48), (32, 24, 20), (248, 220, 96)
        ell(-18, -16 - wing * 3, 16, 10, wing_c, 130)
        ell(16, -16 + wing * 3, 16, 10, wing_c, 130)
        ell(0, 4, 30, 20, gold)
        ell(-8, -2, 14, 12, fur, 180)
        ell(10, 2, 16, 14, band)
        ell(-26, 2, 10, 8, band)
        ln(-30, -2, -42, -18, band, 1)
        ln(-26, 0, -36, -22, band, 1)
    elif key == "carpenter_bee":
        black, gold = (24, 20, 18), (232, 196, 72)
        ell(-16, -14 - wing * 3, 15, 9, wing_c, 140)
        ell(16, -14 + wing * 3, 15, 9, wing_c, 140)
        ell(-8, 0, 16, 14, gold)
        ell(14, 2, 20, 16, black)
        ell(-26, 0, 9, 7, black)
        ln(-30, -4, -42, -18, black, 1)
        ln(-26, -2, -36, -22, black, 1)
    elif key == "mason_bee":
        blue, dark = (48, 56, 88), (20, 22, 36)
        ell(-14, -12 - wing * 2, 13, 8, wing_c, 140)
        ell(12, -12 + wing * 2, 13, 8, wing_c, 140)
        ell(2, 4, 20, 14, blue)
        ell(-18, 0, 8, 6, dark)
        ln(-22, -2, -32, -16, dark, 1)
        ln(-18, 0, -28, -18, dark, 1)
    elif key == "leafcutter":
        brown, pollen, leaf = (72, 64, 40), (196, 168, 72), (88, 120, 56)
        ell(-14, -12 - wing * 2, 13, 8, wing_c, 140)
        ell(12, -12 + wing * 2, 13, 8, wing_c, 140)
        ell(0, 4, 20, 13, brown)
        ell(6, 10, 10, 6, pollen)
        ell(-22, -6, 8, 8, leaf)
        ell(-26, 0, 7, 6, brown)
    elif key == "stingless":
        brown, gold = (56, 40, 28), (196, 148, 64)
        ell(-12, -10 - wing * 2, 11, 7, wing_c, 140)
        ell(10, -10 + wing * 2, 11, 7, wing_c, 140)
        ell(0, 4, 16, 11, brown)
        for x in (-6, 0, 6):
            ln(x, -6, x, 12, gold, 1)
        ell(-18, 0, 6, 5, brown)
    elif key == "sweat_bee":
        green, band = (48, 148, 88), (32, 36, 40)
        ell(-12, -12 - wing * 2, 12, 7, wing_c, 150)
        ell(12, -12 + wing * 2, 12, 7, wing_c, 150)
        ell(-4, 0, 12, 10, green)
        ell(10, 4, 14, 10, band)
        ell(8, 2, 10, 4, (232, 220, 96), 160)
        ell(-18, 0, 6, 5, green)
    elif key == "mining_bee":
        brown, cream = (132, 96, 56), (232, 216, 176)
        ell(-14, -12 - wing * 2, 13, 8, wing_c, 140)
        ell(12, -12 + wing * 2, 13, 8, wing_c, 140)
        ell(0, 4, 20, 13, brown)
        ell(-4, -2, 10, 8, cream, 180)
        ell(-20, 0, 7, 6, brown)
        ln(-24, -2, -34, -16, brown, 1)
    elif key == "honey_drone":
        gold, band = (216, 164, 40), (28, 24, 20)
        ell(-18, -16 - wing * 3, 16, 10, wing_c, 140)
        ell(16, -16 + wing * 3, 16, 10, wing_c, 140)
        ell(2, 4, 28, 18, gold)
        ell(-8, -6, 12, 11, band)
        ell(4, -6, 12, 11, band)
        ell(-28, 2, 8, 7, band)
        # no pollen basket — drone
    elif key == "honey_queen":
        gold, band = (196, 148, 36), (28, 24, 20)
        ell(-16, -14 - wing * 2, 14, 8, wing_c, 130)
        ell(14, -14 + wing * 2, 14, 8, wing_c, 130)
        ell(8, 8, 34, 16, gold)
        for x in (-4, 8, 20):
            ln(x, -4, x, 20, band, 2)
        ell(-24, 0, 9, 7, band)
        ln(-28, -4, -38, -16, band, 1)
    return img.resize((OUT, OUT), Image.Resampling.LANCZOS)


def write_sprites():
    for key in KEYS:
        for anim, count in ANIMS.items():
            dest = WEB_SPRITES / key / anim
            dest.mkdir(parents=True, exist_ok=True)
            for i in range(count):
                paint_bee(key, anim, i).save(dest / f"{i + 1}.png", "PNG", optimize=True)
        desk = DESK_SPRITES / key
        if desk.exists():
            shutil.rmtree(desk)
        shutil.copytree(WEB_SPRITES / key, desk)
        print(f"sprites {key}", flush=True)


def write_portraits():
    if HABITAT.exists():
        study = Image.open(HABITAT).convert("RGB")
        study = ImageEnhance.Color(study).enhance(0.92)
        study = ImageEnhance.Brightness(study).enhance(0.72)
    else:
        study = Image.new("RGB", (1408, 1408), (42, 32, 24))
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSerif-Italic.ttf", 28)
        small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf", 18)
    except OSError:
        font = ImageFont.load_default()
        small = font
    for key in KEYS:
        plate = paint_bee(key, "idle", 0)
        canvas = study.resize((1408, 1408), Image.Resampling.LANCZOS)
        inset = plate.resize((720, 720), Image.Resampling.LANCZOS)
        mask = Image.new("L", inset.size, 0)
        ImageDraw.Draw(mask).ellipse((40, 40, 680, 680), fill=255)
        mask = mask.filter(ImageFilter.GaussianBlur(18))
        canvas.paste(inset, (344, 220), mask)
        draw = ImageDraw.Draw(canvas)
        draw.rounded_rectangle((90, 1120, 720, 1320), 10, fill=(236, 226, 206))
        draw.text((118, 1150), LATIN[key], font=font, fill=(32, 26, 20))
        draw.text((118, 1200), key.replace("_", " "), font=small, fill=(90, 72, 52))
        canvas.save(WEB_PETS / f"{key}.jpg", "JPEG", quality=90)
        print(f"portrait {key}", flush=True)


def extract_roster() -> list[dict]:
    src = BEES_TS.read_text()
    start = src.index("export const BEE_ROSTER")
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
