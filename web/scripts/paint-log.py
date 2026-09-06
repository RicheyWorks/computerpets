#!/usr/bin/env python3
"""Paint honest log sprites and append the desktop roster.

The log needs distinct litter guests — Haste is not Link, Armor is not Comb,
Tun is not Coal, Jet is not Dew. These frames are painted specimen plates on
black, then copied to the Electron overlay. Portraits sit the same plate on
the study blotter. Comb stays a bee. Loom stays the orb weaver. Latch stays
the leech. Do not make them bees. Do not make them snakes that go blue.
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
LOG_TS = ROOT / "web" / "src" / "lib" / "pets" / "log.ts"
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
    "house_centipede",
    "millipede",
    "pillbug",
    "earthworm",
    "velvet_worm",
    "springtail",
    "tardigrade",
    "planarian",
    "nematode",
    "amphipod",
]

LATIN = {
    "house_centipede": "Scutigera coleoptrata",
    "millipede": "Narceus americanus",
    "pillbug": "Armadillidium vulgare",
    "earthworm": "Lumbricus terrestris",
    "velvet_worm": "Euperipatoides rowelli",
    "springtail": "Orchesella cincta",
    "tardigrade": "Hypsibius exemplaris",
    "planarian": "Girardia tigrina",
    "nematode": "Caenorhabditis elegans",
    "amphipod": "Gammarus minus",
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
        "roll": 0.0,
        "tun": 0.0,
        "jet": 0.0,
        "split": 0.0,
        "hop": 0.0,
    }
    if anim == "idle":
        pose["rot"] = wave * (0.4 if key in ("millipede", "earthworm", "tardigrade") else 1.2)
        pose["dx"] = wave * (1.2 if key in ("millipede", "earthworm") else 2.6)
        if key == "tardigrade":
            pose["tun"] = 0.08
        if key == "pillbug":
            pose["roll"] = 0.08
    elif anim == "walk":
        if key == "house_centipede":
            pose["dx"] = wave * 16
            pose["dy"] = abs(wave) * 2
            pose["rot"] = wave * 3
        elif key == "millipede":
            pose["dx"] = wave * 4
            pose["dy"] = abs(wave) * 0.6
            pose["rot"] = wave * 0.8
        elif key == "earthworm":
            pose["dx"] = wave * 6
            pose["dy"] = abs(wave) * 0.8
            pose["rot"] = wave * 1.2
        elif key == "springtail":
            pose["hop"] = abs(wave)
            pose["dy"] = -abs(wave) * 10
            pose["dx"] = wave * 8
        elif key == "amphipod":
            pose["dx"] = wave * 10
            pose["dy"] = math.sin(i * 1.6) * 4
            pose["rot"] = 18 + wave * 4
        elif key == "nematode":
            pose["dx"] = wave * 8
            pose["rot"] = wave * 8
        elif key == "planarian":
            pose["dx"] = wave * 6
            pose["dy"] = abs(wave) * 1.2
        else:
            pose["dx"] = wave * 8
            pose["dy"] = math.sin(i * 1.3) * 2.4
            pose["rot"] = wave * 2
    elif anim == "sit":
        pose["dy"] = 10
        pose["scale"] = 0.96
        if key == "pillbug":
            pose["roll"] = 0.85
            pose["dy"] = 14
        if key == "tardigrade":
            pose["tun"] = 0.7
            pose["dy"] = 12
        if key == "planarian":
            pose["split"] = 0.35
    elif anim == "sleep":
        pose["rot"] = -6
        pose["dy"] = 16
        pose["dim"] = 0.78
        if key == "pillbug":
            pose["roll"] = 1.0
            pose["rot"] = 0
        if key == "tardigrade":
            pose["tun"] = 1.0
            pose["rot"] = 0
        if key == "earthworm":
            pose["rot"] = -2
    elif anim == "talk":
        pose["dy"] = -2 + wave * 1.8
        if key == "house_centipede":
            pose["dx"] = wave * 3
        if key == "velvet_worm":
            pose["jet"] = 0.25
    elif anim == "eat":
        pose["dy"] = 6
        pose["open"] = 0.4 + 0.2 * abs(wave)
        if key == "velvet_worm":
            pose["jet"] = 0.45
    elif anim == "play":
        if key == "house_centipede":
            pose["dx"] = wave * 18
            pose["dy"] = -4 + wave * 3
        elif key == "pillbug":
            pose["roll"] = 1.0
            pose["dx"] = wave * 8
        elif key == "velvet_worm":
            pose["jet"] = 1.0
            pose["dx"] = wave * 4
        elif key == "springtail":
            pose["hop"] = 1.0
            pose["dy"] = -16 + wave * 4
        elif key == "tardigrade":
            pose["tun"] = 0.9
        elif key == "planarian":
            pose["split"] = 1.0
        elif key == "amphipod":
            pose["rot"] = 28 + wave * 8
            pose["dx"] = wave * 12
        else:
            pose["dx"] = wave * 10
            pose["dy"] = -4 + wave * 3
            pose["rot"] = wave * 4
    return pose


def _c(rgb, dim, a=255):
    return tuple(max(0, min(255, int(c * dim))) for c in rgb) + (a,)


def paint_log(key: str, anim: str, index: int) -> Image.Image:
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

    if key == "house_centipede":
        # Fifteen long pairs, striped body. She hunts. Not a millipede.
        tawny, band, leg, eye = (188, 156, 88), (72, 56, 36), (212, 196, 148), (24, 20, 16)
        ell(4, 2, 28, 8, tawny, 235)
        for bx in range(-18, 22, 6):
            ln(bx, -6, bx + 1, 8, band, 2)
        for k in range(15):
            t = k / 14
            x = -22 + t * 48
            swing = math.sin(index * 1.8 + k * 0.7) * (10 if anim in ("walk", "play") else 4)
            side = 1 if k % 2 == 0 else -1
            ln(x, 2, x + swing, 22 * side + wave * 2, leg, 2, 210)
            ln(x + swing, 22 * side, x + swing + 6, 28 * side, leg, 1, 180)
        ell(-26, 0, 8, 6, tawny, 230)
        ell(-30, -2, 2.2, 2.2, eye, 240)
        ln(-32, -4, -44, -14 + wave * 3, (48, 40, 28), 2)
        ln(-32, 2, -42, 10 + wave * 2, (48, 40, 28), 2)
    elif key == "millipede":
        # Cylindrical rings, two pairs each. She oils. Not Haste.
        umber, ring, oil = (72, 44, 32), (48, 28, 20), (120, 92, 48)
        for t in range(12):
            x = -28 + t * 6
            y = math.sin(t * 0.35 + index * 0.4) * 2
            ell(x, y, 8, 7, umber if t % 2 == 0 else ring, 230)
            if t < 11:
                ln(x, y + 6, x + 2, y + 10, (40, 24, 16), 1, 180)
                ln(x, y + 6, x - 1, y + 10, (40, 24, 16), 1, 180)
        if pose.get("open", 0) > 0 or anim == "sit":
            ell(8, 10, 6, 3, oil, 160)
        ell(-32, 0, 7, 6, umber, 230)
        ell(-36, -1, 1.8, 1.8, (20, 14, 10), 240)
    elif key == "pillbug":
        # Seven plates. A roll. A crustacean. Not Comb. Not Pinch.
        slate, plate, belly = (132, 124, 108), (88, 80, 68), (196, 188, 168)
        if pose["roll"] > 0.5:
            r = 16 + pose["roll"] * 4
            ell(0, 2, r, r, slate, 235)
            for ang in range(0, 360, 40):
                rad = math.radians(ang + index * 8)
                ell(math.cos(rad) * 8, 2 + math.sin(rad) * 8, 4, 3, plate, 210)
        else:
            ell(0, 2, 18, 12, slate, 235)
            ell(2, 6, 10, 5, belly, 180)
            for px in range(-12, 14, 5):
                ln(px, -8, px + 2, 10, plate, 2)
            for k in range(7):
                x = -12 + k * 4
                ln(x, 10, x - 2, 16, (72, 64, 52), 1)
            ell(-16, 0, 3, 2.4, (20, 18, 14), 240)
    elif key == "earthworm":
        # Segments, a clitellum. She casts. Not a snake. Not Slip. Not Latch.
        pink, clit, soil = (176, 112, 92), (148, 72, 64), (88, 64, 40)
        pts = [(-30 + t * 7, math.sin(t * 0.55 + index * 0.5) * 4) for t in range(10)]
        for k, (x, y) in enumerate(pts[:-1]):
            t = k / 9
            rgb = clit if 3 <= k <= 4 else (pink if k % 2 == 0 else (156, 96, 80))
            ell(x, y, 7 - t * 2.2, 5, rgb, 230)
        hx, hy = pts[0]
        ell(hx - 3, hy, 6, 4, pink, 230)
        if anim in ("sit", "eat"):
            ell(8, 16, 8, 4, soil, 160)
    elif key == "velvet_worm":
        # Velvet, stubby legs, glue from the head. Not Link. Not Dew.
        velvet, belly, glue = (88, 56, 72), (148, 108, 120), (220, 228, 200)
        ell(4, 2, 24, 10, velvet, 230)
        ell(6, 6, 14, 5, belly, 170)
        for t in range(7):
            x = -16 + t * 6
            y = 8 + math.sin(t + index) * 1.2
            ell(x, y, 3, 4, velvet, 210)
            ell(x, y + 6, 2, 3, (64, 40, 52), 200)
        ell(-22, 0, 8, 6, velvet, 230)
        ell(-26, -2, 2.0, 2.0, (24, 16, 20), 240)
        if pose["jet"] > 0:
            j = pose["jet"]
            ln(-28, 0, -28 - 28 * j, -6 - wave * 4, glue, 2, int(140 + 80 * j))
            ln(-28, 2, -28 - 24 * j, 8 + wave * 3, glue, 2, int(140 + 80 * j))
            ell(-28 - 28 * j, -6, 3 * j + 1, 2, glue, 180)
    elif key == "springtail":
        # Furcula, a hop. A hexapod that is not an insect. Not Comb.
        slate, band, furc = (64, 72, 56), (212, 212, 196), (48, 52, 40)
        hop = pose["hop"]
        ell(0, 2 - hop * 4, 12, 8, slate, 235)
        ell(2, 4 - hop * 4, 6, 3, (120, 128, 96), 180)
        ln(-4, -4 - hop * 4, 6, -4 - hop * 4, band, 3)
        ell(-10, 0 - hop * 4, 4, 3.4, slate, 230)
        ell(-12, -1 - hop * 4, 1.6, 1.6, (20, 24, 16), 240)
        fork = 8 + hop * 16
        ln(8, 6 - hop * 4, 8 + fork, 16, furc, 2)
        ln(8, 6 - hop * 4, 8 + fork * 0.7, 20, furc, 2)
        for lx in (-6, 0, 6):
            ln(lx, 8 - hop * 4, lx - 2, 14 - hop * 2, (40, 44, 32), 1)
    elif key == "tardigrade":
        # Plump, eight short legs. A tun when dry. Not Coal.
        rose, claw, tun = (180, 132, 140), (88, 64, 72), (148, 108, 116)
        if pose["tun"] > 0.55:
            r = 14 + pose["tun"] * 4
            ell(0, 2, r, r * 0.92, tun, 235)
            ell(2, 4, r * 0.5, r * 0.45, rose, 180)
        else:
            ell(0, 2, 16, 12, rose, 235)
            ell(2, 5, 8, 5, (212, 180, 180), 170)
            for sx, sy in ((-10, 8), (-2, 10), (6, 10), (12, 8), (-10, -6), (-2, -8), (6, -8), (12, -6)):
                ell(sx, sy, 3.2, 3.6, rose, 210)
                ln(sx, sy + 3, sx, sy + 7, claw, 1)
            ell(-14, 0, 5, 4, rose, 230)
            ell(-16, -1, 1.6, 1.6, (32, 20, 24), 240)
    elif key == "planarian":
        # Flat, comma eyes. She splits. Not Latch.
        olive, eye, pale = (72, 108, 88), (24, 28, 24), (168, 196, 172)
        split = pose["split"]
        def body(ox):
            poly([(-22 + ox, 0), (-8 + ox, -10), (16 + ox, -6), (28 + ox, 0), (16 + ox, 8), (-8 + ox, 10)], olive, 220)
            ell(-12 + ox, -2, 3.2, 4.4, eye, 240)
            ell(-6 + ox, -2, 3.2, 4.4, eye, 240)
            ell(4 + ox, 2, 8, 3, pale, 150)
        if split > 0.4:
            body(-10 - split * 8)
            body(10 + split * 8)
        else:
            body(0)
    elif key == "nematode":
        # A round thread. Not Cast. Not an earthworm you dig.
        cream, shade = (212, 196, 156), (168, 148, 112)
        pts = [(-32 + t * 7, math.sin(t * 0.9 + index * 0.8) * 7) for t in range(11)]
        for k, (x, y) in enumerate(pts[:-1]):
            t = k / 10
            ell(x, y, 4.2 - t * 1.6, 3.2, cream if k % 2 == 0 else shade, 230)
        hx, hy = pts[0]
        ell(hx - 2, hy, 4, 3, cream, 230)
        ell(hx - 3, hy - 1, 1.2, 1.2, (40, 32, 24), 240)
    else:
        # Amphipod. Swims on her side. Not Pinch. Not Armor.
        amber, belly, gnath = (148, 108, 64), (212, 188, 140), (88, 64, 40)
        rot = pose["rot"]
        # Side-on scud: compressed, curled, many legs on one edge.
        ell(0, 2, 18, 10, amber, 235)
        ell(2, 6, 10, 4, belly, 180)
        poly([(14, -2), (26, -10 + wave), (22, 6)], amber, 210)
        ell(-16, 0, 6, 5, amber, 230)
        ell(-18, -1, 1.8, 1.8, (24, 18, 12), 240)
        for k in range(6):
            x = -10 + k * 4
            ln(x, 8, x + math.sin(index + k) * 3, 16, gnath, 1)
        ln(-14, 4, -22, 10, gnath, 2)

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
    src = LOG_TS.read_text()
    start = src.index("export const LOG_ROSTER")
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
