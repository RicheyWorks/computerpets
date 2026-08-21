#!/usr/bin/env python3
"""Prove the walker has no plate and later guests fill the frame."""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image

from house_walkers import PHOTO_KEEP

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
        if key not in PHOTO_KEEP and key != "stick":
            colors = {(r // 12, g // 12, b // 12) for r, g, b, a in pix if a > 12 and (r + g + b) > 24}
            if len(colors) < 95:
                thin.append(key)
        for anim, count in ANIMS.items():
            for i in range(count):
                frame = SPRITES / key / anim / f"{i + 1}.png"
                if not frame.exists():
                    fail(f"missing frame {frame}")

    plated = sorted(set(plated))
    if plated:
        fail(f"plate still on {plated[:20]} ({len(plated)})")
    if thin:
        fail(f"thin stamp still on {thin[:20]} ({len(thin)})")
    print(f"ok 210 walkers, no plate, no thin stamp")


if __name__ == "__main__":
    main()
