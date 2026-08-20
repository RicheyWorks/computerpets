#!/usr/bin/env python3
"""Paint honest canopy sprites and append the desktop roster.

Ten mammals of the trees. A sloth is not a red panda. A koala is not a bear.
Hang hangs. Sun flags a tail. Swing sings. Wrist wraps. Sail sails.
Glide glides. Boom howls. Gaze looks. Still grips. Gum chews.
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
CANOPY_TS = ROOT / "web" / "src" / "lib" / "pets" / "canopy.ts"
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
    "sloth",
    "lemur",
    "gibbon",
    "kinkajou",
    "colugo",
    "flying_squirrel",
    "howler",
    "tarsier",
    "potto",
    "koala",
]

LATIN = {
    "sloth": "Choloepus didactylus",
    "lemur": "Lemur catta",
    "gibbon": "Hylobates lar",
    "kinkajou": "Potos flavus",
    "colugo": "Galeopterus variegatus",
    "flying_squirrel": "Glaucomys volans",
    "howler": "Alouatta palliata",
    "tarsier": "Carlito syrichta",
    "potto": "Perodicticus potto",
    "koala": "Phascolarctos cinereus",
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
        "sail": 0.0,
    }
    hangers = {"sloth", "colugo", "potto", "koala"}
    if anim == "idle":
        pose["rot"] = wave * (0.6 if key != "gibbon" else 1.4)
        if key in hangers:
            pose["hang"] = 0.8
            pose["dy"] = -4 + wave * 1.2
        if key == "lemur":
            pose["flag"] = 0.5 + 0.2 * abs(wave)
        if key == "gibbon":
            pose["dx"] = wave * 3
        if key == "flying_squirrel":
            pose["sail"] = 0.2
        if key == "tarsier":
            pose["scale"] = 0.92
    elif anim == "walk":
        if key == "sloth":
            pose["hang"] = 0.6
            pose["dx"] = wave * 3
            pose["dy"] = -2 + abs(wave)
        elif key == "gibbon":
            pose["dx"] = wave * 10
            pose["dy"] = -6 + abs(wave) * 4
            pose["rot"] = wave * 8
        elif key == "flying_squirrel":
            pose["sail"] = 1.0
            pose["dx"] = wave * 10
            pose["dy"] = -8 + wave * 3
        elif key == "colugo":
            pose["sail"] = 1.0
            pose["dx"] = wave * 12
            pose["dy"] = -6 + wave * 2
        elif key == "tarsier":
            pose["hop"] = abs(wave)
            pose["dy"] = -10 * pose["hop"]
            pose["dx"] = wave * 6
        elif key == "koala":
            pose["hang"] = 0.4
            pose["dx"] = wave * 3
        else:
            pose["dx"] = wave * 7
            pose["dy"] = abs(wave) * 2
            if key == "lemur":
                pose["flag"] = 0.8
    elif anim == "sit":
        pose["dy"] = 12
        pose["scale"] = 0.96
        pose["rot"] = -2
        if key in hangers:
            pose["hang"] = 1.0
            pose["dy"] = -6
        if key == "lemur":
            pose["flag"] = 0.3
            pose["rot"] = -6
        if key == "tarsier":
            pose["scale"] = 0.9
    elif anim == "sleep":
        pose["rot"] = -8 if key not in hangers else 0
        pose["dy"] = 16 if key not in hangers else -8
        pose["dim"] = 0.78
        if key in hangers:
            pose["hang"] = 1.0
        if key == "lemur":
            pose["flag"] = 0.2
    elif anim == "talk":
        pose["dy"] = -3 + wave * 2
        if key == "howler":
            pose["open"] = 0.5
            pose["scale"] = 1.04
        if key == "gibbon":
            pose["dx"] = wave * 2
        if key in hangers:
            pose["hang"] = 0.6
    elif anim == "eat":
        pose["dy"] = 8
        pose["rot"] = 2 + wave * 2
        if key == "koala":
            pose["open"] = 0.3
            pose["hang"] = 0.5
        if key == "kinkajou":
            pose["dy"] = 6
    elif anim == "play":
        if key == "lemur":
            pose["flag"] = 1.0
            pose["dx"] = wave * 8
        elif key == "gibbon":
            pose["dy"] = -12 + wave * 6
            pose["rot"] = wave * 10
        elif key == "flying_squirrel" or key == "colugo":
            pose["sail"] = 1.0
            pose["dx"] = wave * 12
            pose["dy"] = -10 + wave * 4
        elif key == "tarsier":
            pose["hop"] = 0.9
            pose["dy"] = -14
        elif key == "sloth":
            pose["hang"] = 0.7
            pose["dy"] = -8 + wave * 3
        else:
            pose["rot"] = wave * 6
            pose["dy"] = -6 + wave * 3
    return pose


def _c(rgb, dim, a=255):
    return tuple(max(0, min(255, int(c * dim))) for c in rgb) + (a,)


def paint_canopy(key: str, anim: str, index: int) -> Image.Image:
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

    if key == "sloth":
        tan, cream, ink = (148, 108, 72), (212, 188, 152), (40, 28, 20)
        hang = pose["hang"]
        poly([(10, 2), (28, 8 + hang * 4), (24, 14), (8, 8)], tan, 210)
        ell(0, 4, 16, 11, tan, 235)
        ell(2, 8, 9, 5, cream, 190)
        ell(-14, 0, 9, 8, tan, 235)
        ell(-16, -2, 2.2, 2.2, ink, 240)
        ln(-8, 12, -18, 22 + hang * 4, tan, 3)
        ln(4, 12, 2, 24 + hang * 4, tan, 3)
        ln(-12, -4, -22, -16, tan, 2)
        ln(-8, -6, -16, -18, tan, 2)
    elif key == "lemur":
        gray, cream, ink, ring = (168, 164, 156), (236, 228, 212), (32, 28, 24), (40, 36, 32)
        flag = pose["flag"]
        poly([(12, 0), (30, -10 - flag * 8), (34, -2), (16, 8)], gray, 220)
        for t in range(4):
            ell(18 + t * 3.2, -2 - flag * 4 + t, 1.8, 2.2, cream if t % 2 == 0 else ring, 220)
        ell(0, 4, 14, 10, gray, 235)
        ell(0, 8, 8, 5, cream, 200)
        ell(-14, -2, 8, 7, gray, 235)
        ell(-16, -4, 2.0, 2.0, ink, 240)
        ln(-10, 12, -14, 18, gray, 2)
        ln(-2, 12, -2, 18, gray, 2)
        ln(6, 12, 8, 18, gray, 2)
        ln(12, 12, 16, 18, gray, 2)
    elif key == "gibbon":
        cream, ink, face = (220, 200, 160), (36, 28, 20), (236, 220, 196)
        poly([(8, -4), (26, -18), (22, -6), (6, 2)], cream, 210)
        poly([(-8, -4), (-26, -18), (-22, -6), (-6, 2)], cream, 210)
        ell(0, 2, 12, 10, cream, 235)
        ell(0, 6, 7, 5, face, 200)
        ell(-10, -4, 8, 7, cream, 235)
        ell(-12, -6, 2.0, 2.0, ink, 240)
        ln(-8, 10, -16, 20, cream, 2)
        ln(6, 10, 14, 20, cream, 2)
    elif key == "kinkajou":
        gold, cream, ink = (176, 124, 56), (232, 208, 160), (32, 24, 16)
        poly([(12, 4), (32, 10), (28, 16), (10, 8)], gold, 210)
        ell(0, 4, 14, 10, gold, 235)
        ell(0, 8, 8, 5, cream, 200)
        ell(-14, -2, 8, 7, gold, 235)
        ell(-16, -4, 2.0, 2.0, ink, 240)
        ln(-10, 12, -14, 16, gold, 2)
        ln(-2, 12, -2, 16, gold, 2)
        ln(6, 12, 8, 16, gold, 2)
        ln(12, 12, 16, 14, gold, 2)
    elif key == "colugo":
        brown, membrane, ink = (96, 72, 48), (72, 56, 40), (28, 20, 14)
        sail = pose["sail"]
        poly([(-8, 0), (-30, -8 - sail * 6), (-28, 10), (-4, 8)], membrane, 200)
        poly([(8, 0), (30, -8 - sail * 6), (28, 10), (4, 8)], membrane, 200)
        ell(0, 2, 14, 8, brown, 230)
        ell(-14, -2, 8, 6, brown, 230)
        ell(-16, -4, 1.8, 1.8, ink, 240)
        ln(-8, 8, -12, 14, brown, 2)
        ln(6, 8, 10, 14, brown, 2)
    elif key == "flying_squirrel":
        gray, cream, membrane, ink = (156, 148, 136), (228, 220, 204), (120, 112, 100), (36, 32, 28)
        sail = pose["sail"]
        poly([(-6, 2), (-24, -4 - sail * 8), (-22, 8), (-4, 8)], membrane, 200)
        poly([(6, 2), (24, -4 - sail * 8), (22, 8), (4, 8)], membrane, 200)
        poly([(10, 0), (26, -12), (28, 0), (12, 6)], gray, 210)
        ell(0, 4, 12, 8, gray, 235)
        ell(0, 7, 7, 4, cream, 200)
        ell(-12, -2, 7, 6, gray, 235)
        ell(-14, -4, 1.8, 1.8, ink, 240)
        ln(-8, 10, -12, 14, gray, 2)
        ln(6, 10, 10, 14, gray, 2)
    elif key == "howler":
        black, mantle, face = (48, 40, 36), (72, 56, 40), (156, 124, 96)
        poly([(8, -2), (22, -8), (24, 4), (10, 6)], mantle, 210)
        ell(0, 4, 16, 11, black, 235)
        ell(0, 8, 8, 5, face, 190)
        ell(-14, -2, 9, 8, black, 235)
        ell(-16, 0, 5, 3, face, 210)
        ell(-16, -4, 2.2, 2.2, (16, 12, 10), 240)
        if pose["open"] > 0.2:
            ell(-16, 2, 3.2, 2.4, (40, 24, 20), 220)
        ln(-10, 12, -14, 18, black, 2)
        ln(-2, 12, -2, 18, black, 2)
        ln(6, 12, 8, 18, black, 2)
        ln(12, 12, 16, 18, black, 2)
    elif key == "tarsier":
        tan, cream, ink = (176, 140, 88), (236, 220, 188), (16, 12, 10)
        ell(0, 4, 10, 8, tan, 230)
        ell(-12, -4, 8, 8, tan, 230)
        ell(-14, -6, 4.4, 4.4, cream, 230)
        ell(-10, -6, 4.0, 4.0, cream, 230)
        ell(-14, -6, 2.2, 2.2, ink, 240)
        ell(-10, -6, 2.0, 2.0, ink, 240)
        ln(-6, 10, -10, 18, tan, 2)
        ln(4, 10, 8, 18, tan, 2)
        poly([(8, 2), (18, 6), (16, 10), (6, 6)], tan, 200)
    elif key == "potto":
        brown, cream, ink = (88, 64, 44), (176, 148, 112), (24, 16, 12)
        hang = pose["hang"]
        ell(0, 4, 14, 9, brown, 230)
        ell(0, 8, 8, 4, cream, 190)
        ell(-12, 0, 7, 6, brown, 230)
        ell(-14, -2, 1.8, 1.8, ink, 240)
        ln(-8, 10, -14, 16 + hang * 3, brown, 3)
        ln(2, 10, 0, 18 + hang * 3, brown, 3)
        ln(10, 10, 14, 16, brown, 2)
        poly([(10, 2), (22, 6), (20, 10), (8, 6)], brown, 200)
    else:
        gray, cream, ink, ear = (168, 164, 156), (232, 224, 212), (28, 24, 20), (148, 144, 136)
        hang = pose["hang"]
        ell(2, 4, 16, 12, gray, 235)
        ell(2, 10, 9, 5, cream, 200)
        ell(-12, -2, 10, 9, gray, 235)
        ell(-14, 2, 5, 3, cream, 210)
        ell(-16, -4, 2.2, 2.2, ink, 240)
        ell(-8, -10, 5, 6, ear, 230)
        ell(4, -8, 5, 6, ear, 230)
        ln(-10, 14, -14, 20 + hang * 2, gray, 3)
        ln(0, 14, -2, 22 + hang * 2, gray, 3)
        ln(10, 14, 12, 20, gray, 3)

    return img.resize((OUT, OUT), Image.Resampling.LANCZOS)


def write_sprites():
    for key in KEYS:
        for anim, count in ANIMS.items():
            dest = WEB_SPRITES / key / anim
            dest.mkdir(parents=True, exist_ok=True)
            for i in range(count):
                paint_canopy(key, anim, i).save(dest / f"{i + 1}.png", "PNG", optimize=True)
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
        plate = paint_canopy(key, "idle", 0)
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
    src = CANOPY_TS.read_text()
    start = src.index("export const CANOPY_ROSTER")
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
