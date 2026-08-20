#!/usr/bin/env python3
"""Paint honest corner sprites and append the desktop roster.

The corner needs distinct arachnids and neighbors — Loom is not Stem,
Leap is not Prowl, Barb is not Whip, Gale is not a spider. These frames
are painted specimen plates on black, then copied to the Electron overlay.
Portraits sit the same plate on the study blotter. Comb stays a bee.
Pinch stays a crayfish. Ledger stays on the tide. Bloom stays the only axolotl.
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
CORNER_TS = ROOT / "web" / "src" / "lib" / "pets" / "corner.ts"
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
    "orb_weaver",
    "jumping_spider",
    "wolf_spider",
    "tarantula",
    "widow",
    "harvestman",
    "scorpion",
    "vinegaroon",
    "tick",
    "solifuge",
]

LATIN = {
    "orb_weaver": "Araneus diadematus",
    "jumping_spider": "Phidippus audax",
    "wolf_spider": "Tigrosa helluo",
    "tarantula": "Aphonopelma chalcodes",
    "widow": "Latrodectus mactans",
    "harvestman": "Phalangium opilio",
    "scorpion": "Centruroides vittatus",
    "vinegaroon": "Mastigoproctus giganteus",
    "tick": "Ixodes scapularis",
    "solifuge": "Eremobates",
}

SITTERS = ("orb_weaver", "widow", "tick")
HOPPERS = ("jumping_spider",)
RUNNERS = ("solifuge",)
WALKERS = ("wolf_spider", "tarantula", "harvestman", "scorpion", "vinegaroon")


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
        "leg": 0.0,
    }
    if anim == "idle":
        pose["rot"] = wave * (0.8 if key in SITTERS else 1.4)
        pose["leg"] = wave * 0.4
        if key == "orb_weaver":
            pose["dy"] = -4 + wave * 1.2
        if key == "jumping_spider":
            pose["dy"] = wave * 1.6
        if key == "solifuge":
            pose["dx"] = wave * 2
    elif anim == "walk":
        if key in HOPPERS:
            pose["hop"] = abs(wave)
            pose["dy"] = -14 * pose["hop"]
            pose["dx"] = wave * 10
        elif key in RUNNERS:
            pose["dx"] = wave * 14
            pose["dy"] = abs(wave) * 2
            pose["leg"] = wave
            pose["rot"] = wave * 3
        elif key == "harvestman":
            pose["dx"] = wave * 8
            pose["dy"] = abs(wave) * 1.2
            pose["leg"] = wave * 1.2
        elif key in SITTERS:
            pose["dx"] = wave * 3
            pose["dy"] = abs(wave) * 0.8
            pose["leg"] = wave * 0.3
        else:
            pose["dx"] = wave * 7
            pose["dy"] = abs(wave) * 1.6
            pose["leg"] = wave * 0.8
    elif anim == "sit":
        pose["dy"] = 10
        pose["scale"] = 0.96
        pose["rot"] = -2
        if key == "orb_weaver":
            pose["dy"] = -2
        if key == "widow":
            pose["dy"] = 4
        if key == "tick":
            pose["dy"] = 14
            pose["scale"] = 0.9
    elif anim == "sleep":
        pose["rot"] = -8
        pose["dy"] = 16
        pose["dim"] = 0.78
    elif anim == "talk":
        pose["dy"] = -2 + wave * 2
        pose["open"] = 0.2 + 0.15 * (i % 2)
    elif anim == "eat":
        pose["dy"] = 6
        pose["rot"] = 2 + wave * 2
        pose["open"] = 0.25
    elif anim == "play":
        if key in HOPPERS:
            pose["hop"] = 0.85 + 0.15 * abs(math.sin(u * math.pi))
            pose["dy"] = -18 * pose["hop"]
            pose["dx"] = wave * 10
        elif key in RUNNERS:
            pose["dx"] = wave * 16
            pose["dy"] = -4 + abs(wave) * 3
            pose["leg"] = wave
        elif key == "scorpion":
            pose["rot"] = wave * 8
            pose["dy"] = -4
            pose["open"] = 0.6
        elif key == "vinegaroon":
            pose["rot"] = wave * 6
            pose["dy"] = -3
            pose["open"] = 0.5
        elif key == "orb_weaver":
            pose["dy"] = -6 + wave * 2
            pose["open"] = 0.4
        else:
            pose["rot"] = wave * 5
            pose["dy"] = -4 + wave * 2
    return pose


def _c(rgb, dim, a=255):
    return tuple(max(0, min(255, int(c * dim))) for c in rgb) + (a,)


def _legs(ell, ln, cx, cy, span, lift, rgb, n=8, thin=False):
    w = 1.4 if thin else 2.2
    for i in range(n):
        side = -1 if i < n / 2 else 1
        k = i if i < n / 2 else i - n // 2
        ang = (0.35 + k * 0.38) * side
        reach = span * (0.85 + 0.08 * k)
        mid_x = cx + math.cos(ang) * reach * 0.55
        mid_y = cy + 4 + math.sin(abs(ang)) * 6 + lift * (1 if k % 2 == 0 else -1)
        tip_x = cx + math.cos(ang) * reach
        tip_y = cy + 10 + math.sin(abs(ang)) * 10 + lift * (1 if k % 2 == 0 else -0.4)
        ln(cx, cy, mid_x, mid_y, rgb, w)
        ln(mid_x, mid_y, tip_x, tip_y, rgb, w)
        ell(tip_x, tip_y, 1.1, 1.0, rgb, 220)


def paint_corner(key: str, anim: str, index: int) -> Image.Image:
    n = ANIMS[anim]
    pose = pose_for(key, anim, index, n)
    img = Image.new("RGBA", (HI, HI), (0, 0, 0, 255))
    d = ImageDraw.Draw(img, "RGBA")
    cx, cy = HI / 2 + pose["dx"] * 2, HI / 2 + 48 + pose["dy"] * 2
    s = 2.2 * pose["scale"]
    rot = math.radians(pose["rot"])
    dim = pose["dim"]
    lift = pose["leg"] * 3
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

    if key == "orb_weaver":
        # Cross on the abdomen. A web she built. Not Stem.
        brown, cream, cross = (140, 92, 52), (228, 208, 168), (236, 228, 196)
        silk = (220, 220, 216)
        for r in (18, 28, 38):
            d.ellipse(
                (cx - r * s, cy - 8 * s - r * s * 0.4, cx + r * s, cy - 8 * s + r * s * 0.4),
                outline=_c(silk, dim, 70),
                width=max(1, int(s)),
            )
        for ang in range(0, 180, 30):
            a = math.radians(ang)
            ln(-math.cos(a) * 36, -8 - math.sin(a) * 14, math.cos(a) * 36, -8 + math.sin(a) * 14, silk, 1, 80)
        _legs(ell, ln, 0, 4, 22, lift, brown)
        ell(8, 2, 12, 10, brown, 235)
        ell(-8, 0, 8, 6, brown, 235)
        poly([(2, -4), (14, -2), (12, 4), (4, 2)], cross, 220)
        poly([(6, -6), (10, 0), (4, 2)], cream, 200)
        ell(-12, -2, 2.0, 2.0, (20, 16, 12), 240)
    elif key == "jumping_spider":
        # Huge front eyes. Compact. A leap. Not a wolf.
        ink, gloss, eye = (28, 28, 32), (72, 88, 96), (236, 220, 80)
        iri = (48, 140, 88)
        _legs(ell, ln, 0, 6, 14, lift, ink, thin=True)
        ell(2, 4, 9, 7, ink, 240)
        ell(-8, 0, 8, 7, ink, 240)
        ell(-10, -2, 3.4, 3.4, eye, 240)
        ell(-6, 0, 2.2, 2.2, (220, 200, 60), 230)
        ell(-12, 2, 1.4, 1.4, (200, 180, 48), 220)
        ell(2, 6, 5, 3, iri, 160)
        ell(-8, 2, 3, 2, gloss, 140)
    elif key == "wolf_spider":
        # Brood on the back. Ground hunter. No snare. Not Leap.
        brown, tan, brood = (88, 56, 36), (168, 124, 80), (196, 148, 88)
        _legs(ell, ln, 0, 6, 20, lift, brown)
        ell(2, 4, 13, 8, brown, 235)
        ell(-12, 0, 8, 6, brown, 235)
        ell(4, 2, 8, 4, tan, 180)
        for ox, oy in ((0, 0), (4, 2), (8, 0), (2, 4), (6, 4)):
            ell(ox, oy, 1.8, 1.6, brood, 220)
        ell(-14, -2, 2.2, 2.2, (20, 16, 12), 240)
        ell(-10, 0, 1.4, 1.4, (236, 196, 48), 200)
    elif key == "tarantula":
        # Blonde, stout, hairy. A kick, not a rumor of fangs first.
        blonde, dark, hair = (196, 156, 88), (88, 64, 36), (228, 196, 132)
        _legs(ell, ln, 0, 6, 22, lift, blonde)
        ell(2, 4, 16, 10, blonde, 235)
        ell(-12, 0, 10, 8, blonde, 235)
        ell(2, 6, 10, 5, dark, 160)
        for ox, oy in ((-8, -4), (0, -2), (8, 0), (12, 4), (-4, 6), (4, 8)):
            ell(ox, oy, 1.6, 1.2, hair, 180)
        ell(-16, -2, 2.2, 2.2, (20, 16, 12), 240)
    elif key == "widow":
        # Shiny black. Red hourglass. Not every dark spider.
        ink, red, gloss = (16, 16, 18), (188, 32, 40), (48, 48, 52)
        _legs(ell, ln, 0, 4, 18, lift, ink, thin=True)
        ell(6, 2, 10, 9, ink, 240)
        ell(-8, 0, 7, 5, ink, 240)
        poly([(4, 0), (8, 4), (4, 8), (0, 4)], red, 230)
        ell(6, 2, 4, 3, gloss, 120)
        ell(-12, -2, 1.8, 1.8, (220, 40, 40), 220)
    elif key == "harvestman":
        # One oval body. Two eyes. Long thin legs. Not a spider. Not Loom.
        tan, dark, eye = (156, 124, 72), (88, 68, 40), (28, 24, 18)
        _legs(ell, ln, 0, 4, 32, lift, dark, thin=True)
        ell(0, 2, 8, 6, tan, 235)
        ell(0, 0, 3, 2.4, dark, 200)
        ell(-1, -1, 1.4, 1.4, eye, 240)
        ell(2, -1, 1.4, 1.4, eye, 240)
        ell(4, 4, 3, 2, (196, 168, 112), 160)
    elif key == "scorpion":
        # Pincers. Metasoma. A sting. Not Whip.
        tan, stripe, barb = (168, 132, 72), (72, 52, 32), (48, 36, 24)
        raise_t = -10 - open_amt * 10
        _legs(ell, ln, 0, 8, 16, lift, tan)
        ell(0, 6, 12, 7, tan, 235)
        ell(-10, 2, 7, 5, tan, 235)
        ln(0, 4, 6, -2 + raise_t * 0.2, tan, 3)
        ln(6, -2 + raise_t * 0.2, 10, raise_t, tan, 3)
        ln(10, raise_t, 16, raise_t - 4, stripe, 2)
        ell(17, raise_t - 5, 2.2, 2.6, barb, 240)
        poly([(-16, -2), (-26, -8), (-20, 0), (-16, 4)], tan, 230)
        poly([(-16, 8), (-24, 14), (-18, 8), (-16, 4)], tan, 230)
        ln(-4, 2, 8, 4, stripe, 2)
        ell(-12, 0, 2.0, 2.0, (20, 16, 12), 240)
    elif key == "vinegaroon":
        # Whip. Acetic acid. No sting bulb. Not Barb.
        brown, cream, whip = (72, 52, 36), (168, 140, 96), (40, 32, 24)
        _legs(ell, ln, 0, 8, 16, lift, brown)
        ell(0, 6, 14, 8, brown, 235)
        ell(-12, 2, 8, 6, brown, 235)
        ln(8, 2, 22, -16 - open_amt * 8, whip, 2)
        ln(22, -16 - open_amt * 8, 30, -22 - open_amt * 10, whip, 1)
        poly([(-16, -2), (-28, -10), (-20, 2), (-16, 6)], cream, 220)
        poly([(-16, 8), (-26, 16), (-18, 8), (-16, 4)], cream, 220)
        ell(-14, 0, 2.0, 2.0, (20, 16, 12), 240)
        ell(2, 8, 6, 3, cream, 140)
    elif key == "tick":
        # Flattened. Eight short legs. A mite. Not Comb.
        rust, dark, pale = (88, 40, 32), (40, 20, 16), (168, 96, 80)
        _legs(ell, ln, 0, 6, 10, lift, dark, thin=True)
        ell(2, 4, 10, 8, rust, 235)
        ell(-6, 2, 6, 5, rust, 235)
        ell(2, 4, 5, 3, pale, 160)
        ell(-8, 0, 1.6, 1.6, (20, 12, 10), 240)
        ell(4, 6, 3, 2, dark, 140)
    else:
        # Huge chelicerae. A run. Not a spider. Not a scorpion.
        sand, jaw, dark = (188, 148, 88), (72, 52, 32), (40, 28, 20)
        _legs(ell, ln, 2, 6, 20, lift, sand)
        ell(4, 4, 12, 7, sand, 235)
        ell(-8, 2, 8, 6, sand, 235)
        poly([(-14, -2), (-26, -8), (-18, 2), (-12, 4)], jaw, 235)
        poly([(-14, 6), (-24, 12), (-16, 6), (-12, 2)], jaw, 235)
        ell(-12, 0, 2.2, 2.2, dark, 240)
        ell(6, 6, 6, 3, (220, 188, 120), 150)

    return img.resize((OUT, OUT), Image.Resampling.LANCZOS)


def write_sprites():
    for key in KEYS:
        for anim, count in ANIMS.items():
            dest = WEB_SPRITES / key / anim
            dest.mkdir(parents=True, exist_ok=True)
            for i in range(count):
                paint_corner(key, anim, i).save(dest / f"{i + 1}.png", "PNG", optimize=True)
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
        plate = paint_corner(key, "idle", 0)
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
    src = CORNER_TS.read_text()
    start = src.index("export const CORNER_ROSTER")
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
