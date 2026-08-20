#!/usr/bin/env python3
"""Paint honest well sprites and append the desktop roster.

The well needs distinct leftovers — Boot is not Reed, Orb is not Pact,
Hold is not Felt, Pane is not Gleam, Rose is not Brine, Rod is not Starter.
These frames are painted specimen plates on black, then copied to the
Electron overlay. Portraits sit the same plate on the study blotter.
Bloom stays the only axolotl. Starter stays the yeast. Pact stays the lichen.
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
WELL_TS = ROOT / "web" / "src" / "lib" / "pets" / "well.ts"
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
    "paramecium",
    "amoeba",
    "euglena",
    "volvox",
    "diatom",
    "kelp",
    "chlamydomonas",
    "stentor",
    "coli",
    "haloarchaea",
]

LATIN = {
    "paramecium": "Paramecium caudatum",
    "amoeba": "Amoeba proteus",
    "euglena": "Euglena gracilis",
    "volvox": "Volvox aureus",
    "diatom": "Navicula",
    "kelp": "Macrocystis pyrifera",
    "chlamydomonas": "Chlamydomonas reinhardtii",
    "stentor": "Stentor coeruleus",
    "coli": "Escherichia coli",
    "haloarchaea": "Halobacterium salinarum",
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
    sitters = ("diatom", "kelp", "stentor", "haloarchaea")
    if anim == "idle":
        pose["rot"] = wave * (1.2 if key not in sitters else 0.3)
        if key in ("paramecium", "euglena", "chlamydomonas", "coli"):
            pose["dx"] = wave * 2
        if key == "volvox":
            pose["rot"] = wave * 4
        if key == "amoeba":
            pose["dx"] = wave * 1.4
            pose["open"] = 0.2 + 0.2 * (0.5 + 0.5 * wave)
        if key == "stentor":
            pose["open"] = 0.55 + 0.15 * (0.5 + 0.5 * math.sin(i * 1.4))
        if key == "kelp":
            pose["rot"] = wave * 2.4
    elif anim == "walk":
        if key == "paramecium":
            pose["dx"] = wave * 10
            pose["rot"] = wave * 3
        elif key == "amoeba":
            pose["dx"] = wave * 4
            pose["open"] = 0.4 + 0.3 * abs(wave)
        elif key == "euglena":
            pose["dx"] = wave * 8
            pose["dy"] = wave * 2
        elif key == "volvox":
            pose["rot"] = i * 12
            pose["dx"] = wave * 6
        elif key == "diatom":
            pose["dx"] = wave * 3
        elif key == "kelp":
            pose["rot"] = wave * 6
            pose["dx"] = wave * 2
        elif key == "chlamydomonas":
            pose["rot"] = wave * 18
            pose["dx"] = wave * 8
        elif key == "stentor":
            pose["open"] = 0.35 + 0.2 * abs(wave)
            pose["dy"] = abs(wave) * 2
        elif key == "coli":
            pose["dx"] = wave * 14
            pose["rot"] = wave * 8
        else:
            pose["dx"] = wave * 5
            pose["glow"] = 0.15 + 0.1 * abs(wave)
    elif anim == "sit":
        pose["dy"] = 14
        pose["scale"] = 0.96
        pose["rot"] = -2
        if key == "stentor":
            pose["open"] = 0.85
        if key == "amoeba":
            pose["open"] = 0.1
        if key == "kelp":
            pose["rot"] = -6
    elif anim == "sleep":
        pose["rot"] = -8
        pose["dy"] = 20
        pose["dim"] = 0.78
        if key == "stentor":
            pose["open"] = 0.12
        if key == "volvox":
            pose["rot"] = -4
    elif anim == "talk":
        pose["dy"] = -3 + wave * 2
        if key == "paramecium":
            pose["dx"] = wave * 3
        if key == "stentor":
            pose["open"] = 0.7 + 0.2 * (i % 2)
        if key == "haloarchaea":
            pose["glow"] = 0.25 + 0.15 * (i % 2)
    elif anim == "eat":
        pose["dy"] = 8
        pose["rot"] = 2 + wave * 2
        if key == "amoeba":
            pose["open"] = 0.7
        if key == "stentor":
            pose["open"] = 0.9
        if key == "diatom":
            pose["rot"] = 6
    elif anim == "play":
        if key == "volvox":
            pose["rot"] = u * 40
            pose["dy"] = -8 + wave * 4
        elif key == "chlamydomonas":
            pose["rot"] = wave * 24
            pose["dx"] = wave * 10
        elif key == "coli":
            pose["dx"] = wave * 16
            pose["rot"] = wave * 12
        elif key == "paramecium":
            pose["dx"] = wave * 12
            pose["rot"] = wave * 6
        elif key == "kelp":
            pose["rot"] = wave * 10
            pose["dy"] = -4 + wave * 3
        else:
            pose["rot"] = wave * 6
            pose["dy"] = -8 + wave * 3
    return pose


def _c(rgb, dim, a=255):
    return tuple(max(0, min(255, int(c * dim))) for c in rgb) + (a,)


def paint_well(key: str, anim: str, index: int) -> Image.Image:
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

    if key == "paramecium":
        # Slipper. Cilia. Not an animal. Not Reed.
        body, groove, cil = (168, 156, 132), (120, 108, 88), (212, 204, 180)
        ell(0, 2, 22, 11, body, 235)
        ell(4, 3, 14, 6, (196, 188, 164), 180)
        ell(-12, 0, 6, 5, groove, 200)
        ell(-14, -1, 2.2, 2.2, (40, 36, 28), 230)
        for t in range(14):
            a = t / 13 * math.pi * 2
            if abs(math.cos(a)) > 0.2 or abs(math.sin(a)) > 0.35:
                ln(20 * math.cos(a) * 0.9, 10 * math.sin(a), 26 * math.cos(a) * 0.9 + math.sin(index + t) * 1.4, 14 * math.sin(a), cil, 1, 160)
    elif key == "amoeba":
        # Irregular. Pseudopods. An office, not a blob.
        slate, pale, nuc = (140, 148, 156), (196, 204, 208), (72, 80, 88)
        reach = 8 + open_amt * 16
        poly([(-16, -4), (-6, -14), (10, -10), (18, 2), (10, 14), (-8, 12), (-18, 4)], slate, 220)
        ell(-2, 0, 12, 9, pale, 160)
        ell(-4, -2, 4, 3.6, nuc, 230)
        poly([(16, 0), (16 + reach, -8), (18, 4)], slate, 210)
        poly([(-10, 12), (-6, 12 + reach * 0.5), (0, 10)], slate, 200)
        ell(16 + reach * 0.7, -6, 3.2, 2.6, pale, 180)
    elif key == "euglena":
        # Green spindle, red eyespot, one flagellum. Not a plant.
        green, pale, red = (72, 140, 64), (168, 196, 120), (188, 48, 40)
        ell(0, 2, 16, 7, green, 235)
        ell(2, 3, 9, 4, pale, 180)
        ell(-12, 0, 3.2, 2.8, red, 240)
        ell(-10, -2, 2.2, 2.2, (28, 40, 24), 220)
        ln(16, 2, 34, -6 + math.sin(index) * 4, (48, 88, 40), 2, 200)
        ln(16, 2, 30, 8 + math.sin(index + 1) * 3, (48, 88, 40), 1, 140)
    elif key == "volvox":
        # Colony sphere, daughter rooms. Not Pact. Not one creature.
        rind, cell, daughter = (56, 120, 72), (120, 176, 88), (196, 220, 140)
        ell(0, 0, 22, 22, (32, 64, 40), 80)
        for t in range(16):
            a = t / 16 * math.pi * 2 + index * 0.2
            ell(16 * math.cos(a), 16 * math.sin(a), 2.8, 2.8, cell, 220)
        ell(-4, -2, 6, 6, daughter, 200)
        ell(6, 4, 4.5, 4.5, daughter, 190)
        ell(0, 8, 3.2, 3.2, (168, 200, 120), 180)
    elif key == "diatom":
        # Boat of silica she grew. Not Gleam. Not Shard.
        glass, rib, keel = (180, 188, 176), (88, 100, 96), (48, 56, 52)
        poly([(-22, 0), (-8, -10), (12, -10), (24, 0), (12, 10), (-8, 10)], glass, 230)
        poly([(-16, 0), (-6, -6), (10, -6), (18, 0), (10, 6), (-6, 6)], (212, 216, 208), 180)
        for x in range(-14, 16, 4):
            ln(x, -8, x, 8, rib, 1, 140)
        ln(-20, 0, 22, 0, keel, 2, 160)
    elif key == "kelp":
        # Holdfast, stipe, blades, bladders. Not Felt. Not a garden plant.
        brown, blade, hold = (120, 88, 40), (88, 120, 56), (72, 52, 28)
        poly([(-8, 22), (0, 28), (8, 22), (4, 16), (-4, 16)], hold, 230)
        ln(0, 16, 2, -8, brown, 5)
        poly([(-4, -4), (-22, -18), (-8, -8), (0, 2)], blade, 210)
        poly([(4, -6), (24, -20), (10, -4), (2, 4)], blade, 210)
        poly([(-2, -16), (8, -32), (4, -14)], (64, 96, 48), 200)
        ell(-6, -2, 3.6, 3.6, (196, 188, 120), 200)
        ell(8, -8, 3.2, 3.2, (196, 188, 120), 190)
    elif key == "chlamydomonas":
        # Oval green, two flagella, cup chloroplast. Not a land plant.
        green, cup, oar = (64, 140, 72), (40, 96, 48), (48, 88, 52)
        ell(0, 2, 12, 9, green, 235)
        ell(0, 4, 8, 5, cup, 200)
        ell(-4, -2, 2.4, 2.4, (28, 40, 24), 230)
        ln(-6, -8, -18, -22 + math.sin(index) * 3, oar, 2, 210)
        ln(2, -8, 14, -24 + math.sin(index + 1.2) * 3, oar, 2, 210)
    elif key == "stentor":
        # Trumpet, blue-green. Not a worm. Not Slip. Not Latch.
        blue, pale, mouth = (56, 92, 120), (120, 168, 180), (196, 220, 224)
        flare = 10 + open_amt * 16
        poly([(-4, 18), (4, 18), (flare, -8), (-flare, -8)], blue, 230)
        ell(0, 16, 5, 4, (40, 64, 80), 220)
        ell(0, -8, flare * 0.7, 5, pale, 200)
        if open_amt > 0.3:
            ell(0, -10, flare * 0.45, 3, mouth, 180)
            for t in range(8):
                a = (t / 8 - 0.5) * math.pi * 0.8
                ln(math.sin(a) * flare * 0.5, -10, math.sin(a) * flare * 0.85, -16, mouth, 1, 140)
    elif key == "coli":
        # Rod bacterium. Flagella. Not Starter. Not a fungus.
        rod, end, flag = (156, 164, 120), (120, 128, 88), (196, 200, 168)
        ell(0, 2, 18, 6, rod, 235)
        ell(-14, 2, 5, 5, end, 220)
        ell(14, 2, 5, 5, end, 220)
        ell(-8, 0, 2.2, 2.2, (40, 44, 32), 220)
        ln(16, 0, 30, -10 + math.sin(index) * 6, flag, 1, 180)
        ln(14, 4, 28, 12 + math.sin(index + 1) * 5, flag, 1, 160)
        ln(-16, 0, -28, -8 + math.sin(index + 2) * 4, flag, 1, 150)
    else:
        # Pink archaeon. Salt. Not a bacterium. Not Brine.
        rose, salt, dark = (188, 72, 88), (232, 180, 188), (88, 32, 40)
        glow = pose["glow"]
        ell(0, 2, 14, 8, rose, 230)
        ell(2, 3, 8, 4, salt, 160)
        ell(-8, 0, 4, 3.6, dark, 200)
        for x, y, r in ((-10, 10, 2.2), (8, 12, 1.8), (14, -8, 2), (-14, -6, 1.6), (0, -12, 2.4)):
            ell(x, y, r, r * 0.7, salt, 140)
        if glow > 0:
            ell(0, 2, 18, 12, (220, 120, 140), int(60 + glow * 80))

    return img.resize((OUT, OUT), Image.Resampling.LANCZOS)


def write_sprites():
    for key in KEYS:
        for anim, count in ANIMS.items():
            dest = WEB_SPRITES / key / anim
            dest.mkdir(parents=True, exist_ok=True)
            for i in range(count):
                paint_well(key, anim, i).save(dest / f"{i + 1}.png", "PNG", optimize=True)
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
    WEB_PETS.mkdir(parents=True, exist_ok=True)
    for key in KEYS:
        plate = paint_well(key, "idle", 0)
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
    src = WELL_TS.read_text()
    start = src.index("export const WELL_ROSTER")
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
        else:
            for i, existing in enumerate(roster):
                if existing["key"] == row["key"]:
                    roster[i] = row
                    break
    # Keep the tide moon jelly rename if the paint script already ran.
    for row in roster:
        if row.get("key") == "moon_jelly" and row.get("slug") == "bell":
            row["slug"] = "pulse"
            row["name"] = "Pulse"
            named = row.get("lines", {}).get("named")
            if isinstance(named, str) and named.startswith("Bell."):
                row["lines"]["named"] = "Pulse. I am the ringing without the brass."
    ROSTER_PATH.write_text(json.dumps(roster, separators=(",", ":")) + "\n")
    print(f"roster {len(roster)} (+{added})", flush=True)


def main():
    os.chdir(ROOT)
    write_sprites()
    write_portraits()
    write_roster()


if __name__ == "__main__":
    main()
