#!/usr/bin/env python3
"""Paint honest meadow sprites and append the desktop roster.

The meadow needs distinct grass-and-night insects — Chirp is not Brood,
Blade is not Vault, Banner is not Milk, Jewel is not Dart, Lace is not
Ghost, Forceps is not Fold, Snout is not Auger, Click is not Snap, Rob
is not Thrum. These frames are painted specimen plates on black, then
copied to the Electron overlay. Comb stays Comb. Hive stays insects.
Do not make a second hive. Do not make a second garden.
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
MEADOW_TS = ROOT / "web" / "src" / "lib" / "pets" / "meadow.ts"
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
    "field_cricket",
    "katydid",
    "grasshopper",
    "swallowtail",
    "jewelwing",
    "lacewing",
    "earwig",
    "acorn_weevil",
    "click_beetle",
    "robber_fly",
]

LATIN = {
    "field_cricket": "Gryllus pennsylvanicus",
    "katydid": "Pterophylla camellifolia",
    "grasshopper": "Melanoplus differentialis",
    "swallowtail": "Papilio glaucus",
    "jewelwing": "Calopteryx maculata",
    "lacewing": "Chrysoperla carnea",
    "earwig": "Forficula auricularia",
    "acorn_weevil": "Curculio glandium",
    "click_beetle": "Alaus oculatus",
    "robber_fly": "Efferia aestuans",
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
        "song": 0.0,
        "vault": 0.0,
        "hover": 0.0,
        "click": 0.0,
        "raise": 0.0,
    }
    if anim == "idle":
        pose["rot"] = wave * (0.6 if key in ("katydid", "acorn_weevil") else 1.4)
        pose["dx"] = wave * 2.4
        if key == "field_cricket":
            pose["song"] = 0.35 + 0.2 * abs(wave)
        if key in ("swallowtail", "jewelwing", "lacewing"):
            pose["hover"] = 0.2 + 0.1 * abs(wave)
        if key == "earwig":
            pose["raise"] = 0.2
    elif anim == "walk":
        if key == "grasshopper":
            pose["vault"] = abs(wave)
            pose["dx"] = wave * 12
            pose["dy"] = -abs(wave) * 8
        elif key == "robber_fly":
            pose["dx"] = wave * 14
            pose["hover"] = 0.6
        elif key in ("swallowtail", "jewelwing", "lacewing"):
            pose["dx"] = wave * 10
            pose["dy"] = -4 + abs(wave) * 3
            pose["hover"] = 0.8
        elif key == "click_beetle":
            pose["click"] = abs(wave)
            pose["dx"] = wave * 8
        elif key == "katydid":
            pose["dx"] = wave * 4
            pose["dy"] = abs(wave) * 1.2
        else:
            pose["dx"] = wave * 8
            pose["rot"] = wave * 3
    elif anim == "sit":
        pose["dy"] = 10
        pose["scale"] = 0.96
        if key == "katydid":
            pose["dy"] = 12
        if key == "acorn_weevil":
            pose["dy"] = 14
        if key == "earwig":
            pose["raise"] = 0.15
            pose["dy"] = 12
    elif anim == "sleep":
        pose["rot"] = -6
        pose["dy"] = 16
        pose["dim"] = 0.78
        if key in ("katydid", "acorn_weevil"):
            pose["rot"] = 0
            pose["dy"] = 14
    elif anim == "talk":
        pose["dy"] = -2 + wave * 1.8
        if key == "field_cricket":
            pose["song"] = 0.9
        if key == "click_beetle":
            pose["click"] = 0.5
    elif anim == "eat":
        pose["dy"] = 6
        pose["open"] = 0.4 + 0.2 * abs(wave)
        if key == "acorn_weevil":
            pose["dy"] = 10
    elif anim == "play":
        if key == "grasshopper":
            pose["vault"] = 1.0
            pose["dx"] = wave * 10
            pose["dy"] = -10 + abs(wave) * 4
        elif key == "field_cricket":
            pose["song"] = 1.0
            pose["dx"] = wave * 6
        elif key == "click_beetle":
            pose["click"] = 1.0
            pose["dy"] = -8 + wave * 4
        elif key == "robber_fly":
            pose["dx"] = wave * 16
            pose["hover"] = 1.0
        else:
            pose["dx"] = wave * 8
            pose["dy"] = -4 + wave * 3
            pose["rot"] = wave * 3
            pose["hover"] = 0.6
    return pose


def _c(rgb, dim, a=255):
    return tuple(max(0, min(255, int(c * dim))) for c in rgb) + (a,)


def paint_meadow(key: str, anim: str, index: int) -> Image.Image:
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

    if key == "field_cricket":
        # Black cricket. Raised wings. The song is the tell. Not Brood.
        ink, shine, wing, eye = (28, 24, 22), (56, 48, 44), (72, 64, 56), (220, 200, 80)
        lift = -2 - pose["song"] * 6
        ell(0, 4, 16, 8, ink, 235)
        ell(10, 2, 8, 6, ink, 230)
        poly([(-4, lift), (-18, lift - 10), (-2, lift + 4)], wing, 200)
        poly([(2, lift), (16, lift - 8 + wave * 3), (4, lift + 4)], wing, 200)
        ln(-12, 8, -22, 16, shine, 2)
        ln(-8, 8, -18, 18, shine, 2)
        ln(8, 8, 16, 16, shine, 2)
        ln(-14, 6, -28, 4, shine, 1)
        ln(-14, 8, -28, 10, shine, 1)
        ell(16, 0, 1.8, 1.8, eye, 240)
        ell(-18, 6, 1.2, 4, shine, 200)
        ell(-22, 6, 1.2, 4, shine, 200)
    elif key == "katydid":
        # Leaf wings. A true katydid. Not Vault.
        leaf, vein, belly, eye = (88, 132, 56), (48, 80, 36), (140, 168, 88), (28, 24, 16)
        poly([(-6, -4), (-28, -18), (-22, 10), (0, 8)], leaf, 230)
        poly([(4, -4), (28, -16), (22, 10), (2, 8)], leaf, 230)
        ln(-16, -8, -8, 4, vein, 2)
        ln(16, -6, 8, 4, vein, 2)
        ell(2, 4, 10, 6, belly, 220)
        ell(12, 0, 6, 4, belly, 210)
        ell(16, -2, 1.6, 1.6, eye, 240)
        ln(-8, 8, -16, 16, vein, 2)
        ln(6, 8, 12, 16, vein, 2)
    elif key == "grasshopper":
        # Barred hind legs. A vault. Not Leap. Not Hop.
        tan, bar, cream, eye = (156, 132, 56), (88, 72, 32), (212, 196, 140), (24, 20, 12)
        hop = -pose["vault"] * 10
        ell(2, 2 + hop, 14, 7, tan, 235)
        ell(12, hop, 8, 5, tan, 230)
        ell(4, 5 + hop, 8, 3, cream, 180)
        ln(-6, 4 + hop, -4, -16 + hop, bar, 3)
        ln(-4, -16 + hop, 10, 8 + hop, bar, 3)
        ln(4, 6 + hop, 8, 16 + hop, bar, 2)
        ln(-2, 6 + hop, -8, 16 + hop, bar, 2)
        ln(-10, 0 + hop, 8, 0 + hop, bar, 2)
        ell(16, -2 + hop, 1.8, 1.8, eye, 240)
    elif key == "swallowtail":
        # Yellow bands. Tails. Not Milk. Not Ghost.
        gold, ink, cream, eye = (236, 196, 48), (24, 20, 16), (248, 228, 140), (20, 16, 12)
        hover = -pose["hover"] * 8
        poly([(-4, hover), (-32, hover - 8), (-28, hover + 18), (-2, hover + 6)], gold, 230)
        poly([(4, hover), (32, hover - 8), (28, hover + 18), (2, hover + 6)], gold, 230)
        ln(-18, hover + 2, -10, hover + 2, ink, 3)
        ln(10, hover + 2, 18, hover + 2, ink, 3)
        ln(-16, hover + 10, -8, hover + 10, ink, 2)
        ln(8, hover + 10, 16, hover + 10, ink, 2)
        poly([(-26, hover + 16), (-30, hover + 28), (-22, hover + 18)], gold, 210)
        poly([(26, hover + 16), (30, hover + 28), (22, hover + 18)], gold, 210)
        ell(0, 2 + hover, 6, 8, ink, 235)
        ell(0, -2 + hover, 2.4, 2.4, cream, 200)
        ell(-2, -6 + hover, 1.4, 1.4, eye, 240)
        ell(2, -6 + hover, 1.4, 1.4, eye, 240)
    elif key == "jewelwing":
        # Black wings. Green body. A damselfly. Not Dart.
        green, black, gloss, eye = (40, 88, 56), (16, 16, 20), (72, 140, 88), (220, 200, 80)
        hover = -pose["hover"] * 6
        poly([(-2, hover), (-30, hover - 4), (-28, hover + 10), (0, hover + 4)], black, 230)
        poly([(2, hover), (30, hover - 4), (28, hover + 10), (0, hover + 4)], black, 230)
        ell(0, 2 + hover, 4, 14, green, 235)
        ell(0, -10 + hover, 3.2, 3.2, gloss, 220)
        ell(-8, hover, 6, 3, black, 180)
        ell(8, hover, 6, 3, black, 180)
        ell(-2, -12 + hover, 1.4, 1.4, eye, 240)
        ell(2, -12 + hover, 1.4, 1.4, eye, 240)
    elif key == "lacewing":
        # Green lace. Gold eyes. Not a moth.
        mint, lace, gold, eye = (120, 176, 96), (200, 228, 188), (220, 180, 48), (24, 20, 12)
        hover = -pose["hover"] * 6
        poly([(-2, hover), (-26, hover - 10), (-22, hover + 16), (0, hover + 4)], lace, 170)
        poly([(2, hover), (26, hover - 10), (22, hover + 16), (0, hover + 4)], lace, 170)
        ln(-14, hover - 2, -8, hover + 8, mint, 1)
        ln(14, hover - 2, 8, hover + 8, mint, 1)
        ell(0, 2 + hover, 5, 10, mint, 230)
        ell(-4, -8 + hover, 2.4, 2.4, gold, 240)
        ell(4, -8 + hover, 2.4, 2.4, gold, 240)
        ell(-4, -8 + hover, 1.0, 1.0, eye, 240)
        ell(4, -8 + hover, 1.0, 1.0, eye, 240)
    elif key == "earwig":
        # Cerci, not a sting. Not Fold.
        rust, cream, cerci, eye = (88, 64, 40), (168, 140, 108), (40, 28, 20), (24, 18, 12)
        lift = 8 + pose["raise"] * 10
        ell(0, 0, 8, 14, rust, 235)
        ell(0, 4, 5, 8, cream, 180)
        ln(-4, 12, -10, 12 + lift, cerci, 3)
        ln(4, 12, 10, 12 + lift, cerci, 3)
        ln(-10, 12 + lift, -6, 18 + lift, cerci, 2)
        ln(10, 12 + lift, 6, 18 + lift, cerci, 2)
        ln(-6, -4, -16, -10 + wave * 2, rust, 2)
        ln(6, -4, 16, -10 + wave * 2, rust, 2)
        ell(-3, -10, 1.6, 1.6, eye, 240)
        ell(3, -10, 1.6, 1.6, eye, 240)
    elif key == "acorn_weevil":
        # A snout that drills. Not Auger. Not Mast.
        brown, nut, snout, eye = (120, 80, 44), (168, 120, 72), (72, 48, 28), (24, 16, 12)
        ell(2, 4, 10, 8, brown, 235)
        ell(4, 6, 6, 4, nut, 180)
        ln(10, 2, 28, -2, snout, 3)
        ell(30, -2, 2.4, 2.0, snout, 230)
        ell(-6, 2, 3, 3, brown, 200)
        ln(-4, 10, -8, 16, brown, 2)
        ln(4, 10, 8, 16, brown, 2)
        ell(6, 0, 1.6, 1.6, eye, 240)
    elif key == "click_beetle":
        # Two false eyes. A click, not a snap. Not Spark.
        ink, cream, spot, eye = (32, 32, 28), (196, 188, 164), (20, 20, 16), (220, 200, 80)
        flip = -pose["click"] * 12
        ell(0, 2 + flip, 12, 16, ink, 235)
        ell(0, 6 + flip, 7, 8, cream, 160)
        ell(-6, -4 + flip, 4.5, 4.5, spot, 240)
        ell(6, -4 + flip, 4.5, 4.5, spot, 240)
        ell(-6, -4 + flip, 1.6, 1.6, eye, 220)
        ell(6, -4 + flip, 1.6, 1.6, eye, 220)
        ell(0, -12 + flip, 5, 4, ink, 230)
        ln(-8, 12 + flip, -14, 18 + flip, ink, 2)
        ln(8, 12 + flip, 14, 18 + flip, ink, 2)
    else:
        # Robber fly. A hunt. Not a bee. Not Thrum. Not Sip.
        bristle, belly, wing, eye = (48, 40, 32), (120, 100, 72), (180, 184, 176), (20, 16, 12)
        hover = -pose["hover"] * 6
        ell(0, 2 + hover, 8, 12, bristle, 235)
        ell(2, 6 + hover, 5, 6, belly, 190)
        poly([(-4, hover), (-24, hover - 6), (-18, hover + 10), (0, hover + 2)], wing, 160)
        poly([(4, hover), (24, hover - 6), (18, hover + 10), (0, hover + 2)], wing, 160)
        ell(0, -10 + hover, 6, 5, bristle, 230)
        ln(-6, -8 + hover, -14, -16 + hover, bristle, 2)
        ln(6, -8 + hover, 14, -16 + hover, bristle, 2)
        ln(-4, 12 + hover, -10, 20 + hover, bristle, 2)
        ln(4, 12 + hover, 10, 20 + hover, bristle, 2)
        ell(-3, -12 + hover, 2.0, 2.0, eye, 240)
        ell(3, -12 + hover, 2.0, 2.0, eye, 240)

    return img.resize((OUT, OUT), Image.Resampling.LANCZOS)


def write_sprites():
    for key in KEYS:
        for anim, count in ANIMS.items():
            dest = WEB_SPRITES / key / anim
            dest.mkdir(parents=True, exist_ok=True)
            for i in range(count):
                paint_meadow(key, anim, i).save(dest / f"{i + 1}.png", "PNG", optimize=True)
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
        plate = paint_meadow(key, "idle", 0)
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
    src = MEADOW_TS.read_text()
    start = src.index("export const MEADOW_ROSTER")
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
