#!/usr/bin/env python3
"""Paint honest reef sprites and append the desktop roster.

Ten guests of the living rock. A coral is an animal. An anemone is not a jelly.
Ridge ridges. Wreath opens. Paint nestles. Scrape rasps. Scrub waits.
Tube crawls. Veil veils. Gate opens. Soar soars. Hide sits a hole.
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
REEF_TS = ROOT / "web" / "src" / "lib" / "pets" / "reef.ts"
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
    "brain_coral",
    "anemone",
    "clownfish",
    "parrotfish",
    "cleaner_shrimp",
    "sea_cucumber",
    "lionfish",
    "giant_clam",
    "eagle_ray",
    "grouper",
]

LATIN = {
    "brain_coral": "Colpophyllia natans",
    "anemone": "Heteractis magnifica",
    "clownfish": "Amphiprion ocellaris",
    "parrotfish": "Sparisoma viride",
    "cleaner_shrimp": "Lysmata amboinensis",
    "sea_cucumber": "Thelenota ananas",
    "lionfish": "Pterois volitans",
    "giant_clam": "Tridacna gigas",
    "eagle_ray": "Aetobatus narinari",
    "grouper": "Epinephelus striatus",
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
        "veil": 0.0,
        "soar": 0.0,
        "wave": 0.0,
        "scrape": 0.0,
        "hide": 0.0,
    }
    sitters = {"brain_coral", "anemone", "giant_clam"}
    if anim == "idle":
        pose["rot"] = wave * (0.4 if key in sitters else 1.2)
        if key == "anemone":
            pose["open"] = 0.55 + 0.15 * abs(wave)
        if key == "lionfish":
            pose["veil"] = 0.55 + 0.2 * abs(wave)
        if key == "eagle_ray":
            pose["soar"] = 0.35
        if key == "cleaner_shrimp":
            pose["wave"] = 0.25
        if key == "grouper":
            pose["hide"] = 0.35
    elif anim == "walk":
        if key == "brain_coral":
            pose["dy"] = abs(wave)
        elif key == "anemone":
            pose["open"] = 0.7 + 0.2 * abs(wave)
        elif key == "clownfish":
            pose["dx"] = wave * 10
            pose["dy"] = -2 + abs(wave) * 3
        elif key == "parrotfish":
            pose["scrape"] = 0.6
            pose["dx"] = wave * 8
            pose["dy"] = abs(wave) * 2
        elif key == "cleaner_shrimp":
            pose["wave"] = 0.45
            pose["dx"] = wave * 6
        elif key == "sea_cucumber":
            pose["dx"] = wave * 5
            pose["rot"] = wave * 2
        elif key == "lionfish":
            pose["veil"] = 0.9
            pose["dx"] = wave * 6
            pose["dy"] = -2 + wave * 2
        elif key == "giant_clam":
            pose["open"] = 0.35
        elif key == "eagle_ray":
            pose["soar"] = 1.0
            pose["dx"] = wave * 12
            pose["dy"] = -8 + wave * 3
        else:
            pose["hide"] = 0.15
            pose["dx"] = wave * 6
    elif anim == "sit":
        pose["dy"] = 10
        pose["scale"] = 0.96
        if key == "brain_coral":
            pose["dy"] = 12
        if key == "giant_clam":
            pose["open"] = 0.2
            pose["dy"] = 12
        if key == "grouper":
            pose["hide"] = 0.75
            pose["dy"] = 14
        if key == "anemone":
            pose["open"] = 0.35
        if key == "cleaner_shrimp":
            pose["wave"] = 0.15
    elif anim == "sleep":
        pose["rot"] = -6
        pose["dy"] = 16
        pose["dim"] = 0.78
        if key in sitters:
            pose["rot"] = 0
            pose["dy"] = 14
        if key == "grouper":
            pose["hide"] = 0.85
        if key == "eagle_ray":
            pose["soar"] = 0.1
            pose["dy"] = 12
    elif anim == "talk":
        pose["dy"] = -2 + wave * 1.8
        if key == "cleaner_shrimp":
            pose["wave"] = 0.85
        if key == "anemone":
            pose["open"] = 0.8
        if key == "lionfish":
            pose["veil"] = 0.8
        if key == "grouper":
            pose["open"] = 0.45
    elif anim == "eat":
        pose["dy"] = 6
        pose["open"] = 0.4 + 0.2 * abs(wave)
        if key == "parrotfish":
            pose["scrape"] = 0.85
        if key == "anemone":
            pose["open"] = 0.7
        if key == "giant_clam":
            pose["open"] = 0.65
    elif anim == "play":
        if key == "clownfish":
            pose["dx"] = wave * 14
            pose["dy"] = -6 + abs(wave) * 4
        elif key == "parrotfish":
            pose["scrape"] = 1.0
            pose["dx"] = wave * 10
        elif key == "cleaner_shrimp":
            pose["wave"] = 1.0
            pose["dx"] = wave * 8
        elif key == "lionfish":
            pose["veil"] = 1.0
            pose["dx"] = wave * 8
        elif key == "eagle_ray":
            pose["soar"] = 1.0
            pose["dx"] = wave * 16
            pose["dy"] = -10 + wave * 4
        elif key == "grouper":
            pose["hide"] = 0.2
            pose["open"] = 0.6
            pose["dx"] = wave * 6
        elif key == "anemone":
            pose["open"] = 1.0
        elif key == "giant_clam":
            pose["open"] = 0.85
        else:
            pose["dx"] = wave * 6
            pose["dy"] = -2 + wave * 2
    return pose


def _c(rgb, dim, a=255):
    return tuple(max(0, min(255, int(c * dim))) for c in rgb) + (a,)


def paint_reef(key: str, anim: str, index: int) -> Image.Image:
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

    if key == "brain_coral":
        # Valleys on a boulder. An animal. Not Fan. Not Bloom. Not Hold. Not Coral.
        stone, valley, polyp = (176, 132, 88), (112, 76, 48), (220, 176, 120)
        ell(0, 4, 26, 20, stone, 235)
        ell(2, 8, 14, 8, (196, 156, 108), 140)
        for k in range(6):
            ang = math.radians(-40 + k * 16)
            ln(math.cos(ang) * 4, math.sin(ang) * 2, math.cos(ang) * 22, 4 + math.sin(ang) * 16, valley, 2)
        for k in range(8):
            rad = math.radians(k * 40 + index * 6)
            ell(math.cos(rad) * 12, 2 + math.sin(rad) * 8, 2.2, 1.6, polyp, 180)
        ell(-8, -6, 2.0, 2.0, (40, 28, 20), 200)
    elif key == "anemone":
        # A column, a wreath. Not Pulse. Not Snap.
        column, pale, tip = (196, 92, 72), (236, 168, 140), (248, 220, 196)
        reach = 16 + pose["open"] * 14
        ell(0, 16, 10, 6, (148, 68, 52), 220)
        ell(0, 6, 8, 14, column, 235)
        for k in range(12):
            rad = math.radians(k * 30 + wave * 8)
            ln(0, -4, math.cos(rad) * reach, -8 + math.sin(rad) * (reach * 0.45), pale, 3)
            ell(math.cos(rad) * reach, -8 + math.sin(rad) * (reach * 0.45), 3.2, 2.4, tip, 220)
        ell(0, -2, 6, 4, (168, 72, 56), 200)
    elif key == "clownfish":
        # Orange, white bars. She lives in the wreath. Not Stripe. Not Coin.
        orange, white, stripe, eye = (228, 116, 36), (248, 244, 236), (28, 20, 16), (20, 16, 12)
        ell(2, 2, 18, 9, orange, 235)
        ell(6, 4, 8, 4, (244, 168, 80), 160)
        poly([(-16, 0), (-26, -8 + wave * 2), (-24, 8)], orange, 210)
        poly([(16, -2), (28, -6 + wave), (26, 6)], orange, 210)
        ln(-4, -8, -4, 8, white, 5)
        ln(8, -7, 8, 7, white, 4)
        ln(-4, -8, -4, 8, stripe, 2)
        ln(8, -7, 8, 7, stripe, 2)
        ell(-12, 0, 5, 4, orange, 230)
        ell(-14, -1, 1.6, 1.6, eye, 240)
        ell(-13, -2, 0.7, 0.7, white, 240)
    elif key == "parrotfish":
        # A beak that rasps. Not Quill. Not Beak.
        teal, belly, beak, eye = (36, 148, 124), (196, 212, 120), (236, 196, 72), (20, 16, 12)
        scrape = pose["scrape"]
        ell(2, 2, 18, 10, teal, 235)
        ell(4, 5, 10, 5, belly, 160)
        poly([(16, -4 + scrape * 2), (28, 0), (16, 6)], beak, 230)
        poly([(-16, 0), (-26, -10 + wave * 2), (-22, 8)], teal, 210)
        poly([(10, -8), (18, -16 + wave), (14, -4)], (24, 96, 88), 200)
        ell(-12, 0, 5, 4, teal, 230)
        ell(-14, -1, 1.6, 1.6, eye, 240)
        ln(-6, 8, 8, 8 + scrape * 3, (20, 80, 68), 2)
    elif key == "cleaner_shrimp":
        # Bands, long antennae, a station. Not Tenant. Not Pinch.
        cream, band, antenna, eye = (244, 236, 220), (196, 48, 48), (220, 200, 176), (24, 16, 12)
        lift = -18 - pose["wave"] * 12
        ell(0, 4, 14, 6, cream, 230)
        for x in (-8, 0, 8):
            ell(x, 4, 3.4, 6, band, 220)
        ln(-4, -2, -16, lift, antenna, 2)
        ln(2, -2, 10, lift - 4, antenna, 2)
        ell(-16, lift, 1.6, 1.6, band, 220)
        for k in range(4):
            x = -8 + k * 6
            ln(x, 8, x - 2 + wave * 2, 18, (188, 168, 148), 2)
        ell(-12, 0, 3, 3, cream, 230)
        ell(-13, -1, 1.2, 1.2, eye, 240)
        ell(12, 2, 4, 3, cream, 200)
    elif key == "sea_cucumber":
        # Soft papillae. Not a worm. Not Heap. Not Cast.
        rust, papilla, tip = (196, 72, 48), (236, 124, 72), (248, 188, 120)
        pts = [(-26 + t * 6, math.sin(t * 0.4 + index * 0.4) * 3) for t in range(10)]
        for k, (x, y) in enumerate(pts[:-1]):
            t = k / 9
            ell(x, y, 8 - t * 2.2, 6, rust if k % 2 == 0 else papilla, 230)
            if k % 2 == 0:
                ell(x, y - 8, 2.4, 3.2, tip, 200)
        hx, hy = pts[0]
        ell(hx - 2, hy, 6, 4, rust, 230)
        ell(hx - 3, hy - 1, 1.4, 1.4, (64, 28, 20), 240)
    elif key == "lionfish":
        # A veil of rays. Not Mane. Not Fan. Not Spine. Not Spike.
        rust, cream, stripe, ray = (176, 56, 40), (244, 220, 196), (40, 20, 16), (212, 88, 56)
        veil = 10 + pose["veil"] * 18
        ell(0, 2, 16, 8, rust, 235)
        ell(2, 4, 8, 4, cream, 140)
        for k in range(7):
            ang = math.radians(-20 + k * 14)
            ln(6, 0, 8 + math.cos(ang) * veil, -4 + math.sin(ang) * veil * 0.7, ray, 2)
            ln(-4, -4, -8 + math.cos(ang + 2.4) * (veil * 0.55), -18 - k * 2, (148, 40, 32), 2)
        for x in (-6, 2, 10):
            ln(x, -6, x, 8, stripe, 2)
        poly([(-16, 0), (-24, -6 + wave), (-22, 6)], rust, 200)
        ell(-12, 0, 5, 4, rust, 230)
        ell(-14, -1, 1.6, 1.6, (20, 12, 8), 240)
    elif key == "giant_clam":
        # A door of a shell. Not Chamber. Not Cone.
        shell, mantle, lip = (188, 168, 140), (72, 156, 148), (236, 196, 88)
        gape = 6 + pose["open"] * 16
        poly([(-28, 8), (-8, -4), (8, -4), (28, 8), (20, 16), (-20, 16)], shell, 230)
        poly([(-22, 4), (0, -2 - gape * 0.15), (22, 4), (14, 10), (-14, 10)], mantle, 210)
        ell(0, 2 - gape * 0.1, 10, 4 + gape * 0.08, lip, 180)
        ln(-16, 8, 16, 8, (140, 120, 96), 2)
        ell(-6, 0, 2.0, 1.4, (244, 220, 120), 200)
        ell(6, 0, 2.0, 1.4, (244, 220, 120), 200)
    elif key == "eagle_ray":
        # Spotted wings. Not Kite. Not a bird.
        slate, cream, spot, tail = (48, 56, 72), (220, 216, 208), (236, 232, 224), (40, 44, 56)
        lift = -6 - pose["soar"] * 10
        poly([(-36, lift + 4), (0, lift - 8 + wave * 2), (36, lift + 4), (20, lift + 12), (-20, lift + 12)], slate, 230)
        ell(0, lift + 6, 12, 6, cream, 160)
        for ox, oy in ((-16, lift), (-6, lift - 2), (8, lift), (18, lift + 2), (-10, lift + 6), (4, lift + 6)):
            ell(ox, oy, 2.2, 1.8, spot, 210)
        ln(20, lift + 6, 46, lift + 10 + wave * 3, tail, 3)
        ell(-8, lift + 2, 5, 4, slate, 230)
        ell(-10, lift + 1, 1.4, 1.4, (16, 16, 16), 240)
    else:
        # A fish of a hole. Not Door. Not Lance.
        olive, bar, belly, eye = (92, 108, 72), (48, 56, 40), (188, 196, 152), (20, 16, 12)
        hide = pose["hide"]
        ell(2 + hide * 4, 2, 18, 11, olive, 235)
        ell(4 + hide * 4, 5, 9, 5, belly, 150)
        for x in (-6, 4, 12):
            ln(x + hide * 4, -8, x + hide * 4, 10, bar, 3)
        poly([(-16 + hide * 4, 0), (-26 + hide * 4, -8 + wave), (-24 + hide * 4, 8)], olive, 210)
        gape = pose["open"] * 6
        ell(-12 + hide * 4, 1, 6, 4 + gape * 0.3, olive, 230)
        ell(-14 + hide * 4, 0, 1.6, 1.6, eye, 240)
        if hide > 0.4:
            ell(18, 16, 16, 6, (88, 72, 48), 90)

    return img.resize((OUT, OUT), Image.Resampling.LANCZOS)


def write_sprites():
    for key in KEYS:
        for anim, count in ANIMS.items():
            dest = WEB_SPRITES / key / anim
            dest.mkdir(parents=True, exist_ok=True)
            for i in range(count):
                paint_reef(key, anim, i).save(dest / f"{i + 1}.png", "PNG", optimize=True)
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
        plate = paint_reef(key, "idle", 0)
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
    src = REEF_TS.read_text()
    start = src.index("export const REEF_ROSTER")
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
