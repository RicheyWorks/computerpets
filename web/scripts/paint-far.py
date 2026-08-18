#!/usr/bin/env python3
"""Paint honest xenobiology sprites and append the desktop roster.

The far den needs distinct aliens — Gleam is not a firefly, Drift is not
Bell, Shard is faceted, Knot looks colonial, Arca is a cyst until wake.
These frames are painted specimen plates on black, then copied to the
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
FAR_TS = ROOT / "web" / "src" / "lib" / "pets" / "far.ts"
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
    "photovore",
    "choir",
    "nimbus",
    "silica",
    "terminator",
    "nexus",
    "halovore",
    "magneton",
    "umbral",
    "cyst",
]

LATIN = {
    "photovore": "Lucivora sitim",
    "choir": "Harmonia plexus",
    "nimbus": "Nimbus methanei",
    "silica": "Silica crescit",
    "terminator": "Limitor cursor",
    "nexus": "Nexus colonis",
    "halovore": "Halovora brina",
    "magneton": "Magneton natare",
    "umbral": "Umbralentis quietis",
    "cyst": "Arca vagans",
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
    }
    if anim == "idle":
        pose["rot"] = wave * (1.6 if key not in ("silica", "cyst") else 0.4)
        pose["glow"] = 0.2 + 0.2 * (0.5 + 0.5 * math.sin(i * 1.7))
        if key in ("photovore", "nimbus"):
            pose["dy"] = wave * 4
        if key == "cyst":
            pose["open"] = 0.05
    elif anim == "walk":
        if key == "photovore":
            pose["dy"] = -6 + abs(wave) * 4
            pose["dx"] = wave * 8
            pose["glow"] = 0.5
        elif key == "nimbus":
            pose["dx"] = wave * 10
            pose["dy"] = -8 + wave * 3
        elif key == "magneton":
            pose["dx"] = wave * 16
            pose["rot"] = wave * 2
        elif key == "terminator":
            pose["dx"] = wave * 12
            pose["dy"] = abs(wave) * 2
        elif key == "silica":
            pose["dx"] = wave * 2
            pose["rot"] = wave * 1
        elif key == "cyst":
            pose["dx"] = wave * 1
            pose["open"] = 0.08
        elif key == "umbral":
            pose["dx"] = wave * 3
            pose["dim"] = 0.85
        else:
            pose["dx"] = wave * 6
            pose["rot"] = wave * 3
            pose["dy"] = abs(wave) * 2
    elif anim == "sit":
        pose["dy"] = 16
        pose["scale"] = 0.96
        pose["rot"] = -2
        if key == "cyst":
            pose["open"] = 0.02
    elif anim == "sleep":
        pose["rot"] = -10
        pose["dy"] = 24
        pose["dim"] = 0.7
        pose["glow"] = 0.05
        if key == "cyst":
            pose["open"] = 0.0
    elif anim == "talk":
        pose["glow"] = 0.5 + 0.4 * (i % 2)
        pose["dy"] = -4 + wave * 3
        if key == "choir":
            pose["scale"] = 1.04 + 0.04 * (i % 2)
    elif anim == "eat":
        pose["dy"] = 10
        pose["rot"] = 3 + wave * 2
        pose["glow"] = 0.6
        if key == "photovore":
            pose["dy"] = -8
            pose["glow"] = 0.9
    elif anim == "play":
        if key == "cyst":
            pose["open"] = 0.7 + 0.3 * abs(math.sin(u * math.pi))
            pose["scale"] = 1.06 + 0.08 * pose["open"]
            pose["dy"] = -6 - pose["open"] * 10
        elif key == "photovore":
            pose["glow"] = 1.0
            pose["dy"] = -14 + wave * 4
        elif key == "nimbus":
            pose["dy"] = -16 + wave * 6
            pose["dx"] = wave * 8
        elif key == "magneton":
            pose["dx"] = wave * 18
            pose["rot"] = wave * 4
        else:
            pose["rot"] = wave * 8
            pose["glow"] = 0.8
            pose["dy"] = -10 + wave * 4
    return pose


def _c(rgb, dim, a=255):
    return tuple(max(0, min(255, int(c * dim))) for c in rgb) + (a,)


def paint_far(key: str, anim: str, index: int) -> Image.Image:
    n = ANIMS[anim]
    pose = pose_for(key, anim, index, n)
    img = Image.new("RGBA", (HI, HI), (0, 0, 0, 255))
    d = ImageDraw.Draw(img, "RGBA")
    cx, cy = HI / 2 + pose["dx"] * 2, HI / 2 + 48 + pose["dy"] * 2
    s = 2.2 * pose["scale"]
    rot = math.radians(pose["rot"])
    dim = pose["dim"]
    glow = pose["glow"]
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

    if key == "photovore":
        # Mouthless lens that drinks light — a teardrop of glass, not a beetle.
        gold = (255, 220 + int(20 * glow), 120)
        glass = (236, 228, 196)
        core = (255, 244, 180)
        ell(0, -4, 22 + glow * 6, 28 + glow * 4, gold, 80)
        ell(0, 2, 16, 22, glass, 230)
        ell(0, -2, 8, 12, core, 240)
        ell(-4, -8, 4, 5, (255, 255, 236), 200)
        # no mouth — a drink-slit of light only
        ell(0, -18, 3 + glow * 4, 2 + glow * 2, gold, 220)
        for k in range(3):
            ell(0, -24 - k * 6 - glow * 8, 2 + k, 2, gold, 90 - k * 20)
    elif key == "choir":
        # A body that is a chord: stacked resonant loops, not a person, not a whale.
        tones = [(196, 168, 220), (168, 188, 236), (220, 196, 168), (188, 220, 196)]
        for k, col in enumerate(tones):
            w = 28 - k * 3
            h = 7
            oy = -16 + k * 10
            pulse = 1 + glow * 0.15 * (1 if (index + k) % 2 == 0 else 0.6)
            ell(0, oy, w * pulse, h * pulse, col, 210)
            ln(-w * pulse, oy, w * pulse, oy, (244, 236, 220), 1, 160)
        ell(0, 4, 6, 8, (236, 220, 244), 200)
    elif key == "nimbus":
        # Cold-gas sack. Streamers of weather, not tentacles. Not a bell.
        pale = (196, 212, 220)
        mist = (168, 196, 208)
        ell(0, -6, 26, 20, pale, 200)
        ell(-8, -10, 14, 12, mist, 160)
        ell(10, -4, 12, 10, (220, 228, 232), 150)
        ell(0, 6, 18, 10, (148, 176, 188), 180)
        for ox, L in ((-10, 22), (-2, 28), (8, 20), (14, 16)):
            ln(ox, 10, ox + (2 if ox >= 0 else -2), 10 + L, mist, 2, 140)
            ell(ox + (2 if ox >= 0 else -2), 10 + L, 3, 4, pale, 120)
    elif key == "silica":
        # Faceted mineral. Planes, not a plant, not quartz jewelry.
        planes = [
            [(-4, -28), (14, -16), (8, 4), (-10, -2)],
            [(-16, -8), (-4, -28), (-10, -2), (-20, 8)],
            [(8, 4), (18, -6), (16, 16), (0, 18)],
            [(-10, -2), (8, 4), (0, 18), (-18, 14)],
        ]
        cols = [(196, 212, 220), (168, 188, 204), (220, 228, 236), (148, 172, 188)]
        for pts, col in zip(planes, cols):
            poly(pts, col, 230)
        ln(-4, -28, 8, 4, (244, 248, 252), 1, 180)
        ln(-10, -2, 16, 16, (220, 232, 240), 1, 140)
        if glow > 0.4:
            poly([(16, 16), (22, 10), (20, 22)], (236, 244, 248), 200)
    elif key == "terminator":
        # Thin crescent walker of the rim. Half lamp, half dark.
        lit = (236, 188, 96)
        dark = (48, 40, 36)
        poly([(-4, -24), (8, -8), (6, 20), (-8, 16), (-10, -6)], dark, 230)
        poly([(-4, -24), (2, -18), (4, 12), (-8, 16), (-10, -6)], lit, 220)
        ln(-2, -20, 2, 14, (255, 220, 140), 2, 200)
        ell(-6, -8, 3, 3, lit, 220)
        # two thin legs along the rim
        ln(-6, 16, -14, 26, dark, 2)
        ln(2, 18, 10, 26, lit, 2)
    elif key == "nexus":
        # Colonial: many nodes, one walk. Not a siphonophore plate.
        nodes = [(-12, -10), (8, -14), (14, 4), (0, 12), (-14, 6), (4, -2)]
        body, link = (168, 140, 196), (212, 196, 228)
        for i, (ax, ay) in enumerate(nodes):
            for bx, by in nodes[i + 1 :]:
                if (ax - bx) ** 2 + (ay - by) ** 2 < 420:
                    ln(ax, ay, bx, by, link, 1, 160)
        for k, (x, y) in enumerate(nodes):
            r = 6 if k == 5 else 5
            ell(x, y, r, r, body, 230)
            ell(x - 1, y - 2, 2, 2, (244, 236, 252), 200)
    elif key == "halovore":
        # Salt-drinker. Angular, frosted, not a crab.
        salt = (220, 228, 232)
        frost = (244, 248, 252)
        brine = (148, 176, 188)
        poly([(-8, -20), (12, -16), (18, 4), (4, 18), (-16, 10), (-18, -6)], brine, 220)
        poly([(-4, -16), (8, -12), (6, 2), (-8, -2)], salt, 210)
        for x, y in ((-10, 8), (10, 6), (0, 14), (14, -4), (-14, -2)):
            ell(x, y, 3.2, 2.6, frost, 200)
        ell(2, -6, 3, 3, (88, 120, 132), 180)
    elif key == "magneton":
        # Needle along an axis. Not a compass rose, not a manta wing.
        steel = (140, 156, 176)
        north = (196, 64, 56)
        south = (72, 96, 148)
        poly([(-28, -4), (0, -8), (32, 0), (0, 8)], steel, 230)
        poly([(8, -6), (32, 0), (8, 6)], north, 230)
        poly([(-28, -4), (-8, -6), (-8, 6), (-28, 4)], south, 220)
        ell(0, 0, 4, 4, (244, 236, 196), 230)
        ln(-20, 0, 24, 0, (236, 228, 200), 1, 160)
    elif key == "umbral":
        # Soft heat-shadow. Not a moth, not an orchid.
        umbra = (40, 36, 48)
        cool = (72, 80, 96)
        ell(0, 2, 24, 20, umbra, 210)
        ell(-8, -4, 14, 12, cool, 160)
        ell(10, 4, 12, 10, (28, 28, 36), 180)
        ell(0, 8, 16, 8, (56, 64, 80), 140)
        # no wings — a sink of heat
        ell(-2, -6, 4, 3, (120, 140, 156), 120)
    else:
        # Arca — sealed cyst / seed. Not a yeast jar. Opens on wake/play.
        husk = (148, 120, 80)
        inner = (212, 188, 140)
        seal = (88, 68, 44)
        split = 4 + open_amt * 18
        poly([(-16, -8 - split / 2), (0, -22 - split), (16, -8 - split / 2), (10, 4), (-10, 4)], husk, 230)
        poly([(-14, 2), (14, 2), (12, 18 + split / 2), (0, 22 + split), (-12, 18 + split / 2)], husk, 230)
        if open_amt > 0.15:
            ell(0, 2, 8, 6 + open_amt * 4, inner, 220)
            ell(0, 0, 3, 3, (236, 212, 160), 200)
        else:
            ln(-8, 2, 8, 2, seal, 2)
        ell(-6, -8, 3, 2, (180, 148, 100), 180)
        ell(6, 10, 2.6, 2, (180, 148, 100), 160)
    return img.resize((OUT, OUT), Image.Resampling.LANCZOS)


def write_sprites():
    for key in KEYS:
        for anim, count in ANIMS.items():
            dest = WEB_SPRITES / key / anim
            dest.mkdir(parents=True, exist_ok=True)
            for i in range(count):
                paint_far(key, anim, i).save(dest / f"{i + 1}.png", "PNG", optimize=True)
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
        plate = paint_far(key, "idle", 0)
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
    src = FAR_TS.read_text()
    start = src.index("export const FAR_ROSTER")
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
