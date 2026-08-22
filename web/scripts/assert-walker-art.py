#!/usr/bin/env python3
"""Prove the walker has no plate and later guests fill the frame."""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image

from house_walkers import PHOTO_KEEP, POSE_OWNED, SNAKE_STAMPS, parchment_island_pixels

ROOT = Path(__file__).resolve().parents[2]
SPRITES = ROOT / "web" / "public" / "sprites"
DESK = ROOT / "desktop" / "renderer" / "sprites"

ANIMS = {
    "idle": 4,
    "walk": 6,
    "sit": 4,
    "sleep": 4,
    "talk": 4,
    "eat": 4,
    "play": 4,
}


def fail(msg: str) -> None:
    print(msg, file=sys.stderr)
    raise SystemExit(1)


def main() -> None:
    keys = sorted(p.name for p in SPRITES.iterdir() if p.is_dir())
    if len(keys) != 210:
        fail(f"catalog sprites {len(keys)}, want 210")
    desk_keys = sorted(p.name for p in DESK.iterdir() if p.is_dir())
    if set(desk_keys) != set(keys):
        fail(f"overlay sprites mismatch: {sorted(set(keys) ^ set(desk_keys))[:12]}")

    thin = []
    plated = []
    for key in keys:
        path = SPRITES / key / "idle" / "1.png"
        if not path.exists():
            fail(f"missing {path}")
        im = Image.open(path).convert("RGBA")
        w, h = im.size
        if (w, h) != (512, 512) and key != "red_panda":
            # Rui's first frames may keep their native size; later guests sit 512.
            pass
        corners = [
            im.getpixel((0, 0)),
            im.getpixel((w - 1, 0)),
            im.getpixel((0, h - 1)),
            im.getpixel((w - 1, h - 1)),
        ]
        if any(a > 18 for (*_, a) in corners):
            plated.append(key)
        pix = list(im.getdata())
        animal = sum(1 for r, g, b, a in pix if a > 12 and (r + g + b) > 24)
        black = sum(1 for r, g, b, a in pix if a > 200 and (r + g + b) <= 24)
        n = len(pix)
        if black / n > 0.18:
            plated.append(key)
        # A walkingstick is a stick. A jewelwing is a thread. The plate is gone.
        if animal / n < 0.045 and key not in {"stick", "jewelwing"}:
            thin.append(key)
        # A later guest that is still a two-color oval has not been painted.
        # Photographs already at Rui's hand keep their own count.
        # A raccoon is gray. A puffball is cream. They still need a house of hues.
        if key not in PHOTO_KEEP or key in SNAKE_STAMPS:
            if key != "stick":
                colors = {(r // 12, g // 12, b // 12) for r, g, b, a in pix if a > 12 and (r + g + b) > 24}
                if len(colors) < 95:
                    thin.append(key)
        for anim, count in ANIMS.items():
            for i in range(count):
                frame = SPRITES / key / anim / f"{i + 1}.png"
                if not frame.exists():
                    fail(f"missing frame {frame}")

    crumbs = []
    for anim, count in ANIMS.items():
        for i in range(count):
            path = SPRITES / "red_panda" / anim / f"{i + 1}.png"
            if not path.exists():
                continue
            im = Image.open(path).convert("RGBA")
            mag = 0
            for r, g, b, a in im.getdata():
                if a > 8 and r > 170 and b > 130 and g < 100 and (r - g) > 70:
                    mag += 1
            if mag >= 8:
                crumbs.append(f"red_panda/{anim}/{i + 1}")

    shared = []
    islands = []
    for key in sorted(POSE_OWNED):
        idle = SPRITES / key / "idle" / "1.png"
        walk = SPRITES / key / "walk" / "1.png"
        sleep = SPRITES / key / "sleep" / "1.png"
        if idle.exists() and walk.exists() and idle.read_bytes() == walk.read_bytes():
            shared.append(f"{key}/walk")
        if idle.exists() and sleep.exists() and idle.read_bytes() == sleep.read_bytes():
            shared.append(f"{key}/sleep")
        # A large tan splash that never touches the guest is not the house.
        # A walkingstick and a jewelwing may stay a thread. Yeast foam may clump.
        for anim in ("walk", "sit", "sleep", "talk", "eat", "play"):
            frame = SPRITES / key / anim / "1.png"
            if not frame.exists():
                continue
            # Yeast foam is many cells. A splash beside a frog is not foam.
            if key == "yeast":
                continue
            isle = parchment_island_pixels(Image.open(frame))
            # 4% of a 512 sheet, or 2500px. A second claw may sit apart.
            if isle >= 2500:
                islands.append(f"{key}/{anim}:{isle}")

    plated = sorted(set(plated))
    if plated:
        fail(f"plate still on {plated[:20]} ({len(plated)})")
    if thin:
        fail(f"thin stamp still on {thin[:20]} ({len(thin)})")
    if crumbs:
        fail(f"magenta crumbs still on {crumbs[:12]} ({len(crumbs)})")
    if shared:
        fail(f"walk/sleep still share idle on {shared}")
    if islands:
        fail(f"parchment island still on {islands[:20]} ({len(islands)})")
    print(f"ok 210 walkers, no plate, no thin stamp, rui crumbs gone, owned poses own, no parchment island")


if __name__ == "__main__":
    main()
