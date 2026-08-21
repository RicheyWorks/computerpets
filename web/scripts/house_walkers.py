#!/usr/bin/env python3
"""House walker paint law.

Later dens were sketched as stamps on an opaque black plate. Rui fills a
transparent frame. The plate is the square. The stamp is the thin guest.

This module:
- paints on a clear plate
- sits a house-hand painting the way Rui sits: large, low, clear corners
- knocks a connected plate off a photograph without inventing a taxon
- writes the same frames to the desk and the overlay
- does not flatten the first fifty or the hive photographs
"""

from __future__ import annotations

import math
import random
import shutil
from collections import deque
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[2]
WEB_SPRITES = ROOT / "web" / "public" / "sprites"
WEB_PETS = ROOT / "web" / "public" / "pets"
DESK_SPRITES = ROOT / "desktop" / "renderer" / "sprites"
HABITAT = ROOT / "web" / "public" / "habitat.jpg"

HI = 1024
OUT = 512
CLEAR = (0, 0, 0, 0)
ANIMS = {
    "idle": 4,
    "walk": 6,
    "sit": 4,
    "sleep": 4,
    "talk": 4,
    "eat": 4,
    "play": 4,
}

# Photographs that already meet Rui's hand. Knock a plate if one remains.
# A thin shared stamp in this set may still sit a house-hand painting.
PHOTO_KEEP = {
    "axolotl", "ball_python", "boa", "budgie", "carpet_python", "cat",
    "chinchilla", "corn_snake", "cuttlefish", "dog", "dragon", "ferret",
    "fox", "garter", "ginkgo", "goldfish", "green_tree_python", "guinea_pig",
    "hamster", "hedgehog", "hermit_crab", "hognose", "horseshoe_crab",
    "iguana", "kingsnake", "maidenhair", "manta", "milk_snake", "moon_jelly",
    "moray", "moss", "nautilus", "oak", "octopus", "orchid", "parrot",
    "penguin", "phoenix", "pitcher", "rabbit", "red_panda", "rosy_boa",
    "saguaro", "sea_star", "seahorse", "sundew", "toucan", "turtle",
    "venus_flytrap", "water_lily",
    "carpenter_ant", "cicada", "darner", "firefly", "honeybee", "ladybird",
    "luna", "mantis", "monarch", "stick",
}

# First-fifty stamps that share one thin frame. They sit a house-hand pose set.
SNAKE_STAMPS = {
    "ball_python",
    "boa",
    "carpet_python",
    "corn_snake",
    "garter",
    "green_tree_python",
    "hognose",
    "kingsnake",
    "milk_snake",
    "rosy_boa",
}

# Walk and sleep are their own paintings, not a gait stamp of idle.
POSE_OWNED = SNAKE_STAMPS | {
    "crocodile",
    "alligator",
    "anole",
    "tuatara",
    "gecko",
    "skink",
    "chameleon",
    "horned_lizard",
    "snapper",
    "box_turtle",
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
    "oyster",
    "fly_agaric",
    "morel",
    "chanterelle",
    "turkey_tail",
    "lions_mane",
    "puffball",
    "chicken_of_woods",
    "yeast",
    "lichen",
    "frog",
    "toad",
    "newt",
    "salamander",
    "caecilian",
    "crayfish",
    "pond_snail",
    "mussel",
    "leech",
    "stickleback",
}


def _c(rgb, dim, a=255):
    return tuple(max(0, min(255, int(c * dim))) for c in rgb) + (a,)


def mix(a, b, t):
    return tuple(int(a[i] * (1 - t) + b[i] * t) for i in range(3))


def pose_for(key: str, anim: str, i: int, n: int) -> dict:
    u = i / max(1, n - 1)
    wave = math.sin(i * 1.15)
    pose = {
        "dx": 0.0,
        "dy": 0.0,
        "rot": 0.0,
        "scale": 1.0,
        "dim": 1.0,
        "open": 0.0,
        "wing": 0.55,
        "glow": 0.0,
        "hop": 0.0,
        "seed": hash((key, anim, i)) & 0xFFFFFFFF,
    }
    if anim == "idle":
        pose["rot"] = wave * 1.6
        pose["dx"] = wave * 2.4
        pose["wing"] = 0.5 + 0.08 * abs(wave)
    elif anim == "walk":
        pose["dx"] = wave * 14
        pose["dy"] = -abs(wave) * 4
        pose["rot"] = wave * 5
        pose["wing"] = 0.75 + 0.25 * wave
        pose["hop"] = abs(wave)
    elif anim == "sit":
        pose["dy"] = 18
        pose["scale"] = 0.94
        pose["rot"] = -4
    elif anim == "sleep":
        pose["rot"] = -10
        pose["dy"] = 22
        pose["dim"] = 0.82
        pose["wing"] = 0.2
    elif anim == "talk":
        pose["open"] = 0.35 + 0.25 * abs(wave)
        pose["dy"] = -2 + wave * 2
    elif anim == "eat":
        pose["open"] = 0.5 + 0.2 * abs(wave)
        pose["dy"] = 8
    elif anim == "play":
        pose["dx"] = wave * 16
        pose["dy"] = -10 - abs(wave) * 8
        pose["rot"] = wave * 8
        pose["wing"] = 1.05
        pose["hop"] = 1
        pose["glow"] = 1
    return pose


def fit_like_rui(img: Image.Image, out: int = OUT, side: float = 0.84) -> Image.Image:
    """Sit the painted guest in the frame the way Rui sits: large, low, clear corners."""
    bbox = img.getbbox()
    canvas = Image.new("RGBA", (out, out), CLEAR)
    if not bbox:
        return canvas
    crop = img.crop(bbox)
    cw, ch = crop.size
    scale = (out * side) / max(cw, ch)
    nw, nh = max(1, int(cw * scale)), max(1, int(ch * scale))
    crop = crop.resize((nw, nh), Image.Resampling.LANCZOS)
    x = (out - nw) // 2
    y = out - nh - int(out * 0.06)
    canvas.paste(crop, (x, y), crop)
    return canvas


# Dark guests: only a near-black plate may leave. A pupil that does not
# touch the plate stays. A crow is charcoal, not a hole.
DARK_MATTE = {
    "alligator", "american_eel", "black_bear", "click_beetle", "coli",
    "crow", "earwig", "field_cricket", "lamprey", "millipede", "pileated",
    "raven", "robber_fly", "skunk", "umbral", "vinegaroon", "widow",
}


def clear_edge_matte(im: Image.Image, tol: int = 28) -> Image.Image:
    """Flood from the edge. A plate the color of the border goes. Interior ink stays."""
    im = im.convert("RGBA")
    w, h = im.size
    pix = im.load()
    samples = []
    for x in range(0, w, max(1, w // 64)):
        samples.append(pix[x, 0][:3])
        samples.append(pix[x, h - 1][:3])
    for y in range(0, h, max(1, h // 64)):
        samples.append(pix[0, y][:3])
        samples.append(pix[w - 1, y][:3])
    samples.sort()
    mid = samples[len(samples) // 2]
    limit = tol * 3

    def plate(x, y):
        r, g, b, a = pix[x, y]
        if a <= 10:
            return True
        return abs(r - mid[0]) + abs(g - mid[1]) + abs(b - mid[2]) <= limit

    seen = bytearray(w * h)
    q = deque()

    def push(x, y):
        if 0 <= x < w and 0 <= y < h and not seen[y * w + x]:
            seen[y * w + x] = 1
            q.append((x, y))

    for x in range(w):
        push(x, 0)
        push(x, h - 1)
    for y in range(h):
        push(0, y)
        push(w - 1, y)
    while q:
        x, y = q.popleft()
        if not plate(x, y):
            continue
        pix[x, y] = CLEAR
        push(x + 1, y)
        push(x - 1, y)
        push(x, y + 1)
        push(x, y - 1)
    return im


def sit_body_frame(body: Image.Image, pose: dict, out: int = OUT) -> Image.Image:
    """The walk and the sit share the same painted body. The pose is the gait."""
    img = body.convert("RGBA")
    dim = pose.get("dim", 1.0)
    if dim < 0.999:
        r, g, b, a = img.split()
        rgb = ImageEnhance.Brightness(Image.merge("RGB", (r, g, b))).enhance(dim)
        img = Image.merge("RGBA", (*rgb.split(), a))
    scale = pose.get("scale", 1.0)
    if abs(scale - 1.0) > 0.001:
        w, h = img.size
        img = img.resize((max(1, int(w * scale)), max(1, int(h * scale))), Image.Resampling.LANCZOS)
    rot = pose.get("rot", 0.0)
    if abs(rot) > 0.05:
        img = img.rotate(-rot, resample=Image.Resampling.BICUBIC, expand=False)
    canvas = Image.new("RGBA", (out, out), CLEAR)
    x = (out - img.size[0]) // 2 + int(pose.get("dx", 0))
    y = (out - img.size[1]) // 2 + int(pose.get("dy", 0))
    canvas.paste(img, (x, y), img)
    return canvas


def clear_wash_matte(im: Image.Image) -> Image.Image:
    """Flood every hue the parchment border already wears. Interior ink stays."""
    import numpy as np

    arr = np.array(im.convert("RGBA"))
    h, w = arr.shape[:2]
    qbin = (arr[:, :, 0].astype(np.uint16) >> 4) << 8
    qbin |= (arr[:, :, 1].astype(np.uint16) >> 4) << 4
    qbin |= arr[:, :, 2].astype(np.uint16) >> 4
    band = max(8, min(h, w) // 28)
    border = np.concatenate(
        [
            qbin[:band, :].ravel(),
            qbin[-band:, :].ravel(),
            qbin[:, :band].ravel(),
            qbin[:, -band:].ravel(),
        ]
    )
    counts = np.bincount(border, minlength=4096)
    wash_bins = counts >= max(12, border.size // 400)
    a = arr[:, :, 3]
    wash = (a <= 10) | wash_bins[qbin]
    seen = np.zeros((h, w), dtype=np.uint8)
    q = deque()

    def push(x, y):
        if 0 <= x < w and 0 <= y < h and not seen[y, x]:
            seen[y, x] = 1
            q.append((x, y))

    for x in range(w):
        push(x, 0)
        push(x, h - 1)
    for y in range(h):
        push(0, y)
        push(w - 1, y)
    while q:
        x, y = q.popleft()
        if not wash[y, x]:
            continue
        arr[y, x] = CLEAR
        push(x + 1, y)
        push(x - 1, y)
        push(x, y + 1)
        push(x, y - 1)
    return Image.fromarray(arr, "RGBA")


def ingest_body(path: Path, key: str) -> Image.Image:
    """Knock the plate off a house-hand painting and sit it like Rui."""
    raw = Image.open(path).convert("RGBA")
    tol = 16 if key in DARK_MATTE else 30
    # A parchment wash floods first. Then any leftover plate.
    knocked = clear_wash_matte(raw)
    knocked = clear_edge_matte(knocked, tol=tol)
    if not knocked.getbbox():
        knocked = clear_edge_matte(raw, tol=max(10, tol - 8))
    if not knocked.getbbox():
        knocked = clear_connected_plate(raw, luma=14)
    # A watercolor wash leaves a tan fringe. A short erode keeps the animal.
    if knocked.getbbox():
        r, g, b, a = knocked.split()
        a = a.filter(ImageFilter.MinFilter(5))
        knocked = Image.merge("RGBA", (r, g, b, a))
    return fit_like_rui(knocked)


def write_kind_from_body(key: str, body: Image.Image) -> None:
    for anim, count in ANIMS.items():
        dest = WEB_SPRITES / key / anim
        dest.mkdir(parents=True, exist_ok=True)
        for i in range(count):
            pose = pose_for(key, anim, i, count)
            sit_body_frame(body, pose).save(dest / f"{i + 1}.png", "PNG", optimize=True)
    desk = DESK_SPRITES / key
    if desk.exists():
        shutil.rmtree(desk)
    shutil.copytree(WEB_SPRITES / key, desk)


def mild_pose(pose: dict) -> dict:
    """The painting already holds the gait. The frames only breathe."""
    out = dict(pose)
    out["dx"] = pose.get("dx", 0.0) * 0.22
    out["dy"] = pose.get("dy", 0.0) * 0.12
    out["rot"] = pose.get("rot", 0.0) * 0.22
    out["scale"] = 1.0 + (pose.get("scale", 1.0) - 1.0) * 0.25
    out["hop"] = pose.get("hop", 0.0) * 0.15
    return out


def write_kind_from_poses(key: str, bodies: dict[str, Image.Image]) -> None:
    """Each pose folder keeps its own painted body. Walk is not a tilted idle.

    A later guest may keep the house-hand idle already sat in #92. New
    walk, sit, sleep, talk, eat, and play paintings replace only those folders.
    """
    idle = bodies.get("idle")
    preserve_idle = idle is None
    if idle is None:
        existing = WEB_SPRITES / key / "idle" / "1.png"
        if not existing.exists():
            raise ValueError(f"{key} needs an idle painting")
        idle = Image.open(existing).convert("RGBA")
    for anim, count in ANIMS.items():
        if preserve_idle and anim == "idle":
            continue
        body = bodies.get(anim) or idle
        dest = WEB_SPRITES / key / anim
        dest.mkdir(parents=True, exist_ok=True)
        for i in range(count):
            pose = mild_pose(pose_for(key, anim, i, count))
            sit_body_frame(body, pose).save(dest / f"{i + 1}.png", "PNG", optimize=True)
    desk = DESK_SPRITES / key
    if desk.exists():
        shutil.rmtree(desk)
    shutil.copytree(WEB_SPRITES / key, desk)


def clear_connected_plate(im: Image.Image, luma: int = 30) -> Image.Image:
    """Flood from the edge. A black plate goes. A pupil that does not touch the plate stays."""
    im = im.convert("RGBA")
    w, h = im.size
    pix = im.load()
    limit = luma * 3

    def plate(x, y):
        r, g, b, a = pix[x, y]
        return a > 10 and (r + g + b) <= limit

    seen = bytearray(w * h)
    q = deque()

    def push(x, y):
        if 0 <= x < w and 0 <= y < h and not seen[y * w + x]:
            seen[y * w + x] = 1
            q.append((x, y))

    for x in range(w):
        push(x, 0)
        push(x, h - 1)
    for y in range(h):
        push(0, y)
        push(w - 1, y)
    while q:
        x, y = q.popleft()
        if not plate(x, y):
            continue
        pix[x, y] = CLEAR
        push(x + 1, y)
        push(x - 1, y)
        push(x, y + 1)
        push(x, y - 1)
    return im


class Brush:
    def __init__(self, pose: dict):
        self.img = Image.new("RGBA", (HI, HI), CLEAR)
        self.d = ImageDraw.Draw(self.img, "RGBA")
        self.cx = HI / 2 + pose.get("dx", 0) * 5
        self.cy = HI / 2 + 36 + pose.get("dy", 0) * 5
        self.s = 1.0 * pose.get("scale", 1.0)
        self.rot = math.radians(pose.get("rot", 0))
        self.dim = pose.get("dim", 1.0)
        self.rng = random.Random(pose.get("seed", 1))
        self.pose = pose

    def xf(self, x, y):
        x, y = x * self.s, y * self.s
        c, s = math.cos(self.rot), math.sin(self.rot)
        return self.cx + x * c - y * s, self.cy + x * s + y * c

    def ell(self, x, y, rx, ry, rgb, a=255):
        X, Y = self.xf(x, y)
        rx, ry = abs(rx * self.s), abs(ry * self.s)
        self.d.ellipse((X - rx, Y - ry, X + rx, Y + ry), fill=_c(rgb, self.dim, a))

    def ln(self, x0, y0, x1, y1, rgb, w=3, a=230):
        A, B = self.xf(x0, y0)
        C, D = self.xf(x1, y1)
        self.d.line((A, B, C, D), fill=_c(rgb, self.dim, a), width=max(1, int(w * self.s)))

    def poly(self, pts, rgb, a=230):
        self.d.polygon([self.xf(*p) for p in pts], fill=_c(rgb, self.dim, a))

    def shade(self, x, y, rx, ry, rgb, a=255):
        self.ell(x, y, rx, ry, rgb, a)
        self.ell(x - rx * 0.18, y - ry * 0.22, rx * 0.62, ry * 0.55, mix(rgb, (255, 248, 236), 0.28), int(a * 0.55))
        self.ell(x + rx * 0.12, y + ry * 0.22, rx * 0.55, ry * 0.42, mix(rgb, (20, 16, 12), 0.22), int(a * 0.4))

    def fur(self, x, y, rx, ry, rgb, n=110, out=1.0):
        dark = mix(rgb, (20, 14, 10), 0.25)
        lite = mix(rgb, (255, 244, 230), 0.22)
        for i in range(n):
            ang = self.rng.random() * math.tau
            px = x + math.cos(ang) * rx * (0.42 + self.rng.random() * 0.58)
            py = y + math.sin(ang) * ry * (0.42 + self.rng.random() * 0.58)
            length = (7 + self.rng.random() * 11) * out
            col = lite if i % 3 == 0 else dark if i % 3 == 1 else rgb
            self.ln(px, py, px + math.cos(ang) * length, py + math.sin(ang) * length, col, 1, 150)

    def scales(self, x, y, rx, ry, rgb, step=11):
        dark = mix(rgb, (20, 16, 12), 0.3)
        for iy in range(int(-ry), int(ry), step):
            off = (iy // step) % 2 * (step * 0.45)
            for ix in range(int(-rx), int(rx), step):
                px, py = x + ix + off, y + iy
                if (px - x) ** 2 / (rx * rx) + (py - y) ** 2 / (ry * ry) <= 0.92:
                    self.ell(px, py, 4.2, 3.2, dark if (ix + iy) % 2 else rgb, 170)

    def veins(self, x, y, rx, ry, rgb, n=7):
        for k in range(n):
            t = k / max(1, n - 1)
            self.ln(x, y, x + (t - 0.5) * rx * 1.7, y - ry * (0.2 + t * 0.7), rgb, 1, 140)

    def eye(self, x, y, r=8, iris=(56, 42, 28)):
        self.ell(x, y, r * 1.15, r, (244, 236, 220), 240)
        self.ell(x, y, r * 0.78, r * 0.72, iris, 250)
        self.ell(x, y, r * 0.34, r * 0.34, (14, 10, 8), 255)
        self.ell(x - r * 0.28, y - r * 0.3, r * 0.2, r * 0.18, (255, 255, 246), 235)

    def finish(self) -> Image.Image:
        return fit_like_rui(self.img)


@dataclass(frozen=True)
class Spec:
    plan: str
    fur: tuple
    belly: tuple
    ink: tuple
    accent: tuple
    tell: str
    latin: str


SPECS: dict[str, Spec] = {}


def S(key, plan, fur, belly, ink, accent, tell, latin):
    SPECS[key] = Spec(plan, fur, belly, ink, accent, tell, latin)


# House snakes — first-fifty stamps that sit a house-hand pose set
S("ball_python", "snake", (92, 64, 40), (220, 196, 140), (32, 20, 12), (176, 140, 80), "bun", "Python regius")
S("corn_snake", "snake", (220, 120, 56), (244, 220, 176), (80, 36, 16), (196, 72, 40), "saddle", "Pantherophis guttatus")
S("kingsnake", "snake", (24, 24, 24), (236, 228, 212), (8, 8, 8), (244, 244, 236), "bands", "Lampropeltis californiae")
S("green_tree_python", "snake", (56, 148, 64), (220, 228, 160), (20, 48, 24), (236, 244, 220), "saddle-coil", "Morelia viridis")
S("hognose", "snake", (196, 164, 100), (236, 220, 176), (64, 44, 24), (88, 56, 32), "snout", "Heterodon nasicus")
S("garter", "snake", (40, 48, 32), (220, 196, 72), (16, 16, 12), (236, 212, 88), "stripes", "Thamnophis sirtalis")
S("boa", "snake", (168, 124, 72), (220, 196, 148), (40, 24, 12), (88, 56, 32), "heavy", "Boa constrictor")
S("milk_snake", "snake", (196, 48, 40), (244, 236, 220), (16, 12, 10), (24, 20, 16), "triad", "Lampropeltis triangulum")
S("rosy_boa", "snake", (212, 168, 140), (236, 212, 188), (72, 44, 28), (88, 52, 32), "three", "Lichanura trivirgata")
S("carpet_python", "snake", (236, 204, 64), (32, 28, 20), (16, 12, 8), (48, 40, 24), "labyrinth", "Morelia spilota")
# Wood
S("deer", "mammal", (168, 132, 88), (236, 228, 212), (48, 36, 24), (220, 200, 176), "antler", "Odocoileus virginianus")
S("bat", "bat", (72, 52, 36), (96, 72, 52), (20, 16, 12), (48, 36, 28), "wing", "Eptesicus fuscus")
S("squirrel", "mammal", (148, 148, 140), (220, 212, 196), (36, 32, 28), (176, 168, 152), "plume", "Sciurus carolinensis")
S("otter", "mammal", (72, 88, 96), (188, 196, 196), (24, 28, 32), (120, 140, 148), "slick", "Lontra canadensis")
S("raccoon", "mammal", (120, 116, 108), (220, 216, 208), (32, 28, 24), (48, 44, 40), "mask", "Procyon lotor")
S("skunk", "mammal", (28, 28, 30), (236, 232, 224), (16, 16, 18), (236, 232, 224), "stripe", "Mephitis mephitis")
S("opossum", "mammal", (168, 160, 148), (212, 204, 192), (40, 36, 32), (220, 168, 160), "pink", "Didelphis virginiana")
S("beaver", "mammal", (112, 80, 52), (168, 132, 88), (28, 20, 16), (72, 52, 36), "paddle", "Castor canadensis")
S("porcupine", "mammal", (88, 68, 48), (196, 180, 152), (24, 18, 14), (48, 40, 32), "quill", "Erethizon dorsatum")
S("black_bear", "mammal", (36, 32, 30), (72, 60, 52), (16, 14, 12), (56, 48, 40), "bear", "Ursus americanus")
# Canopy
S("sloth", "mammal", (120, 96, 64), (176, 156, 120), (40, 28, 20), (88, 68, 44), "claw", "Bradypus variegatus")
S("lemur", "mammal", (92, 80, 68), (236, 228, 216), (28, 22, 18), (220, 80, 64), "rings", "Lemur catta")
S("gibbon", "mammal", (92, 72, 48), (196, 176, 148), (32, 24, 18), (64, 48, 32), "arms", "Hylobates lar")
S("kinkajou", "mammal", (196, 140, 64), (232, 200, 140), (40, 24, 12), (168, 112, 48), "gold", "Potos flavus")
S("colugo", "mammal", (92, 76, 56), (176, 160, 132), (28, 20, 16), (64, 52, 40), "patagium", "Galeopterus variegatus")
S("flying_squirrel", "mammal", (156, 132, 100), (228, 216, 196), (36, 28, 22), (120, 100, 76), "flap", "Glaucomys volans")
S("howler", "mammal", (72, 48, 32), (140, 108, 80), (24, 16, 12), (48, 32, 20), "beard", "Alouatta palliata")
S("tarsier", "mammal", (148, 124, 88), (220, 204, 176), (28, 20, 14), (236, 228, 200), "orbs", "Carlito syrichta")
S("potto", "mammal", (88, 64, 44), (156, 124, 92), (28, 20, 14), (64, 48, 32), "blunt", "Perodicticus potto")
S("koala", "mammal", (92, 88, 80), (196, 188, 176), (32, 28, 24), (64, 60, 52), "spoon", "Phascolarctos cinereus")
# Roost
S("crow", "bird", (28, 28, 30), (48, 48, 52), (12, 12, 14), (72, 72, 80), "ink", "Corvus brachyrhynchos")
S("raven", "bird", (24, 24, 28), (40, 40, 48), (10, 10, 12), (64, 64, 72), "wedge", "Corvus corax")
S("barn_owl", "bird", (196, 176, 140), (244, 236, 220), (32, 24, 18), (88, 64, 40), "heart", "Tyto alba")
S("red_tail", "bird", (120, 84, 48), (220, 196, 156), (28, 18, 12), (176, 72, 40), "rust", "Buteo jamaicensis")
S("chickadee", "bird", (52, 52, 56), (236, 232, 224), (16, 16, 18), (196, 176, 72), "cap", "Poecile atricapillus")
S("robin", "bird", (52, 48, 44), (196, 92, 48), (20, 16, 12), (72, 88, 48), "brick", "Turdus migratorius")
S("mallard", "bird", (48, 92, 56), (236, 196, 72), (20, 16, 12), (32, 72, 48), "green", "Anas platyrhynchos")
S("canada_goose", "bird", (52, 56, 48), (196, 188, 172), (20, 16, 12), (28, 28, 28), "chin", "Branta canadensis")
S("pileated", "bird", (36, 32, 32), (236, 232, 228), (12, 10, 10), (196, 32, 32), "crest", "Dryocopus pileatus")
S("hummingbird", "bird", (32, 140, 92), (196, 64, 72), (16, 12, 10), (48, 196, 156), "jewel", "Archilochus colubris")
# Stone
S("gecko", "lizard", (196, 176, 72), (236, 220, 140), (40, 32, 16), (120, 100, 40), "pad", "Eublepharis macularius")
S("anole", "lizard", (72, 148, 64), (168, 196, 120), (24, 40, 20), (196, 64, 72), "dewlap", "Anolis carolinensis")
S("skink", "lizard", (72, 92, 64), (196, 140, 56), (24, 28, 20), (48, 140, 176), "blue", "Plestiodon fasciatus")
S("chameleon", "lizard", (88, 140, 64), (168, 176, 72), (28, 36, 20), (196, 92, 48), "turret", "Chamaeleo calyptratus")
S("horned_lizard", "lizard", (156, 108, 68), (196, 156, 108), (40, 28, 16), (88, 60, 36), "horns", "Phrynosoma cornutum")
S("alligator", "croc", (64, 88, 56), (156, 164, 88), (20, 24, 16), (40, 52, 32), "wide", "Alligator mississippiensis")
S("crocodile", "croc", (56, 76, 52), (140, 148, 80), (18, 22, 14), (36, 48, 28), "narrow", "Crocodylus acutus")
S("snapper", "turtle", (56, 72, 44), (168, 140, 72), (20, 24, 16), (88, 68, 40), "hook", "Chelydra serpentina")
S("box_turtle", "turtle", (88, 68, 40), (196, 156, 72), (28, 20, 12), (48, 92, 48), "dome", "Terrapene carolina")
S("tuatara", "lizard", (92, 108, 80), (168, 176, 140), (28, 32, 24), (64, 72, 52), "spine", "Sphenodon punctatus")
# Pond extras in later dens
S("frog", "frog", (72, 140, 64), (196, 220, 120), (24, 40, 20), (220, 92, 64), "leap", "Lithobates clamitans")
S("toad", "frog", (120, 96, 64), (176, 148, 100), (36, 28, 18), (88, 68, 44), "wart", "Anaxyrus americanus")
S("newt", "salamander", (196, 92, 48), (236, 176, 88), (40, 20, 12), (48, 32, 20), "spot", "Notophthalmus viridescens")
S("salamander", "salamander", (48, 72, 88), (196, 140, 72), (16, 24, 28), (236, 196, 72), "gold", "Ambystoma maculatum")
S("caecilian", "worm", (48, 40, 36), (88, 72, 56), (16, 12, 10), (72, 56, 44), "annuli", "Dermophis mexicanus")
S("crayfish", "crab", (176, 72, 48), (220, 140, 88), (40, 20, 16), (120, 40, 28), "pinch", "Faxonius rusticus")
S("pond_snail", "shell", (120, 92, 64), (196, 168, 120), (32, 24, 16), (88, 64, 44), "coil", "Lymnaea stagnalis")
S("mussel", "bivalve", (72, 80, 64), (188, 196, 176), (24, 28, 20), (140, 148, 120), "nacre", "Lampsilis siliquoidea")
S("leech", "worm", (72, 32, 36), (120, 56, 56), (24, 12, 12), (40, 16, 16), "suck", "Hirudo verbana")
S("stickleback", "fish", (72, 92, 64), (196, 176, 88), (24, 28, 20), (48, 40, 28), "spines", "Gasterosteus aculeatus")
# Creek
S("bass", "fish", (72, 92, 56), (196, 188, 120), (24, 28, 18), (40, 48, 28), "jaw", "Micropterus salmoides")
S("brook_trout", "fish", (72, 88, 64), (220, 140, 72), (24, 28, 20), (196, 72, 56), "spots", "Salvelinus fontinalis")
S("catfish", "fish", (64, 60, 52), (176, 164, 132), (24, 20, 16), (40, 36, 28), "whisker", "Ictalurus punctatus")
S("bluegill", "fish", (48, 92, 120), (220, 176, 72), (16, 28, 36), (196, 92, 48), "ear", "Lepomis macrochirus")
S("perch", "fish", (196, 156, 56), (236, 212, 140), (40, 32, 16), (72, 56, 28), "bars", "Perca flavescens")
S("pike", "fish", (72, 108, 64), (196, 212, 140), (24, 32, 20), (40, 56, 32), "long", "Esox lucius")
S("walleye", "fish", (72, 80, 64), (220, 196, 88), (24, 28, 20), (196, 176, 64), "glass", "Sander vitreus")
S("paddlefish", "fish", (88, 92, 96), (176, 180, 184), (28, 28, 32), (48, 48, 52), "paddle", "Polyodon spathula")
S("lamprey", "eel", (72, 56, 48), (140, 100, 80), (24, 16, 12), (48, 32, 28), "disk", "Petromyzon marinus")
S("american_eel", "eel", (64, 72, 56), (120, 132, 88), (20, 24, 16), (40, 48, 32), "slick", "Anguilla rostrata")
# Reef extras
S("brain_coral", "coral", (220, 156, 140), (236, 196, 176), (88, 48, 40), (196, 120, 108), "folds", "Diploria labyrinthiformis")
S("anemone", "anemone", (196, 72, 88), (244, 196, 140), (64, 24, 32), (255, 220, 160), "tent", "Heteractis magnifica")
S("clownfish", "fish", (220, 92, 32), (244, 244, 236), (40, 20, 12), (16, 12, 10), "bars", "Amphiprion ocellaris")
S("parrotfish", "fish", (72, 176, 156), (236, 140, 176), (20, 48, 44), (255, 196, 72), "beak", "Scarus taeniopterus")
S("cleaner_shrimp", "shrimp", (220, 220, 224), (255, 255, 252), (40, 32, 28), (196, 32, 40), "stripe", "Lysmata amboinensis")


# --- remaining specs filled below in _more() to keep the table readable

def _more():
    extra = {
        "cleaner_shrimp": Spec("shrimp", (220, 220, 224), (255, 255, 252), (40, 32, 28), (196, 32, 40), "stripe", "Lysmata amboinensis"),
        "sea_cucumber": Spec("worm", (120, 88, 64), (176, 140, 100), (36, 24, 16), (88, 60, 40), "wart", "Holothuria mexicana"),
        "lionfish": Spec("fish", (220, 196, 176), (196, 48, 40), (40, 24, 16), (32, 24, 20), "spines", "Pterois volitans"),
        "giant_clam": Spec("bivalve", (88, 120, 92), (220, 92, 120), (28, 36, 28), (255, 176, 72), "mantle", "Tridacna gigas"),
        "eagle_ray": Spec("ray", (48, 56, 72), (220, 216, 208), (16, 18, 24), (236, 232, 224), "spots", "Aetobatus narinari"),
        "grouper": Spec("fish", (92, 108, 72), (176, 188, 120), (28, 32, 20), (48, 56, 36), "thick", "Epinephelus itajara"),
        "fiddler_crab": Spec("crab", (156, 92, 56), (212, 172, 120), (24, 16, 12), (196, 120, 48), "signal", "Minuca pugnax"),
        "ghost_crab": Spec("crab", (220, 204, 172), (236, 224, 200), (40, 32, 24), (188, 172, 140), "stalk", "Ocypode quadrata"),
        "limpet": Spec("shell", (132, 116, 96), (188, 172, 148), (40, 32, 24), (88, 72, 56), "cone", "Patella vulgata"),
        "barnacle": Spec("barnacle", (176, 164, 148), (216, 208, 192), (72, 64, 52), (200, 196, 184), "cirri", "Semibalanus balanoides"),
        "chiton": Spec("chiton", (72, 88, 108), (156, 172, 188), (24, 20, 16), (196, 140, 88), "eight", "Tonicella lineata"),
        "periwinkle": Spec("shell", (48, 56, 64), (120, 128, 132), (20, 20, 20), (88, 96, 104), "spiral", "Littorina littorea"),
        "sand_dollar": Spec("dollar", (196, 180, 148), (228, 216, 188), (80, 68, 48), (148, 132, 104), "petals", "Echinarachnius parma"),
        "sea_urchin": Spec("urchin", (88, 48, 108), (176, 140, 196), (24, 16, 28), (56, 28, 72), "spines", "Strongylocentrotus purpuratus"),
        "knobbed_whelk": Spec("shell", (188, 148, 96), (220, 196, 156), (40, 28, 16), (120, 88, 52), "knobs", "Busycon carica"),
        "lugworm": Spec("worm", (148, 88, 72), (168, 140, 108), (64, 36, 28), (112, 64, 52), "cast", "Arenicola marina"),
        "house_centipede": Spec("centipede", (196, 188, 164), (236, 228, 208), (40, 32, 24), (72, 64, 48), "legs", "Scutigera coleoptrata"),
        "millipede": Spec("millipede", (72, 40, 36), (120, 72, 56), (24, 12, 10), (48, 24, 20), "many", "Narceus americanus"),
        "pillbug": Spec("pillbug", (132, 124, 108), (196, 188, 168), (40, 36, 28), (88, 80, 68), "roll", "Armadillidium vulgare"),
        "earthworm": Spec("worm", (176, 92, 80), (220, 156, 140), (64, 32, 28), (120, 56, 48), "clitellum", "Lumbricus terrestris"),
        "velvet_worm": Spec("worm", (72, 40, 56), (140, 80, 100), (24, 12, 16), (48, 24, 36), "velvet", "Euperipatoides rowelli"),
        "springtail": Spec("bug", (72, 88, 48), (168, 188, 88), (24, 28, 16), (48, 56, 28), "furcula", "Orchesella cincta"),
        "tardigrade": Spec("tardigrade", (196, 140, 156), (236, 196, 200), (64, 40, 48), (148, 88, 100), "bear", "Hypsibius exemplaris"),
        "planarian": Spec("flat", (176, 92, 72), (220, 156, 120), (48, 24, 20), (120, 56, 44), "arrow", "Dugesia japonica"),
        "nematode": Spec("worm", (220, 212, 180), (236, 228, 200), (80, 72, 48), (188, 176, 140), "thread", "Caenorhabditis elegans"),
        "amphipod": Spec("shrimp", (156, 120, 88), (212, 188, 148), (40, 28, 20), (88, 64, 44), "side", "Gammarus pulex"),
        "field_cricket": Spec("bug", (40, 36, 32), (72, 64, 52), (16, 12, 10), (88, 80, 64), "song", "Gryllus pennsylvanicus"),
        "katydid": Spec("bug", (88, 148, 56), (168, 196, 88), (28, 40, 16), (48, 88, 32), "leaf", "Pterophylla camellifolia"),
        "grasshopper": Spec("bug", (140, 156, 64), (196, 208, 100), (36, 40, 16), (88, 96, 36), "hop", "Melanoplus differentialis"),
        "swallowtail": Spec("moth", (236, 212, 48), (16, 16, 16), (16, 16, 16), (236, 80, 40), "tails", "Papilio glaucus"),
        "jewelwing": Spec("moth", (32, 120, 72), (48, 32, 56), (16, 12, 16), (176, 64, 176), "metal", "Calopteryx maculata"),
        "lacewing": Spec("moth", (196, 220, 120), (236, 244, 188), (40, 48, 24), (120, 156, 64), "lace", "Chrysoperla carnea"),
        "earwig": Spec("bug", (72, 56, 36), (140, 112, 72), (24, 16, 12), (40, 28, 16), "forceps", "Forficula auricularia"),
        "acorn_weevil": Spec("bug", (120, 72, 40), (176, 124, 72), (32, 20, 12), (88, 52, 28), "snout", "Curculio glandium"),
        "click_beetle": Spec("bug", (56, 48, 32), (120, 100, 64), (20, 16, 12), (176, 156, 72), "click", "Alaus oculatus") if False else Spec("bug", (56, 48, 32), (120, 100, 64), (20, 16, 12), (176, 156, 72), "click", "Alaus oculatus"),
        "robber_fly": Spec("bug", (48, 44, 36), (120, 108, 80), (16, 12, 10), (88, 72, 48), "bristle", "Efferia aestuans"),
        "orb_weaver": Spec("spider", (196, 140, 48), (48, 32, 20), (16, 12, 8), (236, 196, 88), "web", "Argiope aurantia"),
        "jumping_spider": Spec("spider", (48, 40, 36), (196, 80, 48), (12, 10, 8), (236, 196, 64), "face", "Phidippus audax"),
        "wolf_spider": Spec("spider", (72, 56, 40), (140, 112, 80), (20, 14, 10), (40, 28, 20), "wolf", "Hogna carolinensis"),
        "tarantula": Spec("spider", (72, 40, 28), (140, 72, 48), (20, 10, 8), (196, 92, 48), "fuzz", "Aphonopelma chalcodes"),
        "widow": Spec("spider", (20, 16, 16), (196, 32, 32), (8, 6, 6), (220, 40, 36), "hour", "Latrodectus mactans"),
        "harvestman": Spec("harvestman", (120, 88, 48), (176, 140, 88), (32, 24, 16), (64, 48, 28), "pill", "Leiobunum vittatum"),
        "scorpion": Spec("scorpion", (176, 140, 72), (220, 188, 120), (40, 28, 16), (88, 64, 32), "sting", "Centruroides vittatus"),
        "vinegaroon": Spec("scorpion", (36, 32, 28), (72, 64, 52), (12, 10, 8), (48, 40, 32), "whip", "Mastigoproctus giganteus"),
        "tick": Spec("tick", (72, 48, 32), (176, 140, 72), (24, 16, 12), (40, 28, 16), "scutum", "Dermacentor variabilis"),
        "solifuge": Spec("spider", (176, 140, 88), (220, 188, 132), (40, 28, 16), (88, 64, 36), "jaws", "Eremobates pallipes"),
        "bumblebee": Spec("bee", (32, 28, 24), (236, 188, 48), (16, 12, 10), (236, 188, 48), "fuzz", "Bombus impatiens"),
        "carpenter_bee": Spec("bee", (28, 28, 36), (236, 196, 56), (12, 12, 16), (48, 48, 64), "shine", "Xylocopa virginica"),
        "mason_bee": Spec("bee", (48, 56, 92), (196, 140, 72), (16, 16, 24), (88, 64, 40), "mud", "Osmia lignaria"),
        "leafcutter": Spec("bee", (48, 44, 36), (88, 140, 56), (16, 14, 12), (72, 120, 48), "disc", "Megachile rotundata"),
        "stingless": Spec("bee", (36, 28, 20), (196, 148, 48), (12, 10, 8), (220, 176, 72), "pot", "Melipona beecheii"),
        "sweat_bee": Spec("bee", (32, 120, 140), (220, 196, 72), (12, 32, 36), (48, 176, 188), "metal", "Agapostemon virescens"),
        "mining_bee": Spec("bee", (72, 56, 40), (196, 156, 72), (24, 16, 12), (120, 88, 52), "dust", "Andrena vicina"),
        "honey_drone": Spec("bee", (36, 28, 16), (220, 168, 48), (14, 10, 8), (196, 140, 40), "eye", "Apis mellifera"),
        "honey_queen": Spec("bee", (40, 28, 16), (236, 180, 48), (16, 10, 8), (196, 72, 40), "long", "Apis mellifera"),
        "honeycomb": Spec("comb", (236, 188, 72), (255, 220, 140), (120, 80, 32), (196, 140, 48), "hex", "Apis mellifera"),
        "oyster": Spec("shelf", (196, 188, 172), (236, 228, 212), (72, 64, 52), (148, 140, 120), "shelf", "Pleurotus ostreatus"),
        "fly_agaric": Spec("cap", (196, 40, 40), (244, 236, 220), (40, 16, 12), (255, 248, 236), "dots", "Amanita muscaria"),
        "morel": Spec("morel", (120, 84, 48), (176, 140, 88), (40, 28, 16), (72, 48, 28), "pits", "Morchella esculenta"),
        "chanterelle": Spec("cap", (220, 156, 48), (236, 196, 88), (80, 52, 16), (176, 112, 32), "fork", "Cantharellus cibarius"),
        "turkey_tail": Spec("shelf", (120, 72, 40), (196, 168, 88), (40, 24, 16), (48, 72, 48), "rings", "Trametes versicolor"),
        "lions_mane": Spec("mane", (236, 228, 208), (255, 248, 232), (120, 108, 88), (196, 184, 160), "teeth", "Hericium erinaceus"),
        "puffball": Spec("puff", (220, 212, 180), (244, 236, 208), (88, 80, 56), (176, 168, 132), "puff", "Calvatia gigantea"),
        "chicken_of_woods": Spec("shelf", (220, 92, 32), (255, 176, 64), (80, 32, 12), (196, 64, 24), "fan", "Laetiporus sulphureus"),
        "yeast": Spec("yeast", (236, 212, 140), (255, 236, 188), (120, 96, 48), (196, 168, 88), "foam", "Saccharomyces cerevisiae"),
        "lichen": Spec("lichen", (188, 196, 120), (236, 228, 176), (64, 72, 40), (120, 88, 64), "crust", "Xanthoria parietina"),
        "paramecium": Spec("slipper", (176, 196, 140), (220, 232, 176), (48, 64, 36), (120, 148, 80), "cilia", "Paramecium caudatum"),
        "amoeba": Spec("amoeba", (168, 176, 120), (220, 220, 168), (56, 60, 40), (120, 128, 80), "foot", "Amoeba proteus"),
        "euglena": Spec("slipper", (72, 140, 56), (168, 196, 88), (24, 48, 20), (196, 64, 48), "flag", "Euglena gracilis"),
        "volvox": Spec("volvox", (56, 120, 72), (120, 176, 88), (24, 48, 28), (196, 220, 140), "daughters", "Volvox aureus"),
    }
    extra["diatom"] = Spec("diatom", (196, 188, 120), (236, 228, 176), (72, 64, 36), (148, 140, 80), "glass", "Navicula tripunctata")
    extra["kelp"] = Spec("kelp", (48, 92, 56), (120, 156, 72), (16, 32, 20), (196, 176, 64), "blade", "Macrocystis pyrifera")
    extra["chlamydomonas"] = Spec("slipper", (72, 148, 64), (168, 196, 88), (24, 48, 20), (220, 220, 80), "cup", "Chlamydomonas reinhardtii")
    extra["stentor"] = Spec("stentor", (88, 72, 156), (176, 156, 220), (32, 24, 56), (220, 196, 255), "horn", "Stentor coeruleus")
    extra["coli"] = Spec("coli", (176, 156, 88), (220, 204, 140), (64, 52, 28), (120, 100, 56), "rod", "Escherichia coli")
    extra["haloarchaea"] = Spec("halo", (156, 48, 64), (220, 92, 100), (48, 16, 20), (255, 156, 140), "salt", "Halobacterium salinarum")
    extra["photovore"] = Spec("far", (255, 220, 120), (255, 255, 236), (80, 56, 16), (255, 196, 64), "drink", "lamp-drinker")
    extra["choir"] = Spec("choir", (196, 168, 220), (236, 220, 244), (80, 64, 96), (168, 188, 236), "notes", "chord body")
    extra["nimbus"] = Spec("nimbus", (196, 212, 220), (220, 228, 232), (80, 96, 104), (148, 176, 188), "sack", "cold-gas")
    extra["silica"] = Spec("silica", (196, 212, 220), (244, 248, 252), (80, 96, 104), (168, 188, 204), "facet", "mineral")
    extra["terminator"] = Spec("term", (236, 188, 96), (48, 40, 36), (20, 16, 12), (255, 220, 140), "rim", "crescent")
    extra["nexus"] = Spec("nexus", (168, 140, 196), (244, 236, 252), (56, 40, 72), (212, 196, 228), "nodes", "colony")
    extra["halovore"] = Spec("halo", (148, 176, 188), (244, 248, 252), (48, 64, 72), (220, 228, 232), "frost", "salt-drinker")
    extra["magneton"] = Spec("needle", (140, 156, 176), (220, 228, 236), (40, 48, 56), (196, 64, 56), "axis", "needle")
    extra["umbral"] = Spec("term", (40, 32, 48), (88, 72, 100), (12, 8, 16), (176, 140, 220), "shade", "shade")
    extra["cyst"] = Spec("cyst", (176, 156, 120), (220, 204, 168), (64, 52, 36), (120, 96, 64), "wall", "resting")
    SPECS.update(extra)


_more()
# cleaner_shrimp placeholder was invalid; overwrite
SPECS["cleaner_shrimp"] = Spec("shrimp", (220, 220, 224), (255, 255, 252), (40, 32, 28), (196, 32, 40), "stripe", "Lysmata amboinensis")


def mammal(b: Brush, s: Spec, pose: dict):
    fur, belly, ink, acc = s.fur, s.belly, s.ink, s.accent
    b.ell(8, 48, 70, 12, (20, 16, 12), 50)
    if s.tell == "patagium" or s.tell == "flap":
        b.poly([(-40, 0), (-110, 20), (-20, 36), (80, 20), (40, 0)], mix(fur, ink, 0.2), 160)
    if s.tell == "antler":
        b.ln(-70, -70, -92, -128, fur, 6)
        b.ln(-92, -128, -70, -150, fur, 4)
        b.ln(-92, -128, -118, -146, fur, 4)
        b.ln(-92, -118, -108, -108, fur, 3)
    if s.tell == "quill":
        for x, y in ((-10, -40), (10, -56), (30, -48), (50, -36), (18, -28), (-4, -20), (40, -20)):
            b.ln(x, y + 20, x + 8, y - 36, acc, 3)
    if s.tell == "arms":
        b.ln(-30, 8, -120, 40, fur, 10)
        b.ln(40, 12, 130, 8, fur, 10)
        b.ell(-126, 44, 12, 10, fur, 230)
        b.ell(136, 8, 12, 10, fur, 230)
    tail = {
        "plume": [(40, -4), (110, -70), (130, -20), (50, 20)],
        "paddle": [(36, 16), (120, 8), (128, 36), (40, 32)],
        "rings": [(40, 4), (120, -8), (128, 16), (46, 22)],
        "stripe": [(36, -8), (120, -24), (128, 8), (44, 16)],
        "slick": [(40, 8), (130, 4), (136, 22), (46, 24)],
        "gold": [(36, 8), (110, 40), (90, 56), (40, 28)],
    }.get(s.tell, [(36, 4), (110, -16), (118, 12), (44, 20)])
    b.poly(tail, fur if s.tell != "stripe" else ink, 220)
    if s.tell == "rings":
        for t in range(5):
            b.ell(70 + t * 10, 4, 7, 6, acc if t % 2 == 0 else fur, 220)
    if s.tell == "stripe":
        b.poly([(40, -16), (118, -30), (122, -8), (44, 0)], belly, 230)
    if s.tell == "paddle":
        b.poly([(70, 10), (124, 6), (126, 34), (76, 30)], acc, 230)
    b.shade(8, 8, 78, 48, fur, 240)
    b.ell(10, 22, 48, 22, belly, 200)
    b.fur(8, 6, 78, 48, fur, 130)
    b.shade(-62, -18, 42, 34, fur, 240)
    if s.tell == "mask":
        b.ell(-70, -16, 18, 10, ink, 230)
        b.ell(-52, -14, 14, 8, ink, 220)
    if s.tell == "stripe":
        b.ln(-40, -28, 40, -20, belly, 8)
        b.ln(-36, -16, 36, -10, belly, 5)
    if s.tell == "spoon":
        b.ell(-62, -10, 22, 16, (48, 40, 36), 240)
        b.ell(-80, -36, 22, 20, fur, 230)
        b.ell(-44, -36, 22, 20, fur, 230)
        b.fur(-80, -36, 22, 20, fur, 40, 1.3)
        b.fur(-44, -36, 22, 20, fur, 40, 1.3)
    elif s.tell == "orbs":
        b.eye(-78, -20, 16, (236, 220, 160))
        b.eye(-52, -18, 16, (236, 220, 160))
    else:
        b.ell(-78, -36, 16, 14, fur, 230)
        b.ell(-48, -38, 14, 12, fur, 230)
        if s.tell == "blunt":
            b.ell(-88, -8, 16, 10, fur, 230)
        b.eye(-76, -16, 8, (40, 36, 28) if s.tell != "lemur" else (196, 120, 48))
    if s.tell == "pink":
        b.ell(-92, 4, 16, 8, acc, 220)
    if s.tell == "beard":
        b.poly([(-80, 8), (-70, 36), (-50, 12)], fur, 220)
    if s.tell == "claw":
        for x in (-30, -8, 16):
            b.ln(x, 40, x - 8, 70, acc, 4)
    b.ell(-88, 2, 8, 5, ink, 240)
    for x, y in ((-28, 40), (-6, 44), (24, 42), (48, 38)):
        b.ln(x, y, x - 6, y + 28, fur, 7)
        b.ell(x - 6, y + 32, 8, 5, ink, 230)
    if pose.get("open", 0) > 0.2:
        b.ell(-86, 8, 10, 6, (120, 48, 48), 200)


def bat(b: Brush, s: Spec, pose: dict):
    flap = 20 + 28 * pose.get("wing", 0.5)
    b.poly([(-16, 0), (-120, -20 - flap), (-140, 16), (-20, 24)], s.accent, 210)
    b.poly([(16, 0), (120, -20 - flap), (140, 16), (20, 24)], s.accent, 210)
    b.ln(-30, 4, -110, -10 - flap, s.ink, 2, 180)
    b.ln(30, 4, 110, -10 - flap, s.ink, 2, 180)
    b.shade(0, 8, 36, 28, s.fur, 240)
    b.fur(0, 8, 36, 28, s.fur, 50, 0.7)
    b.ell(-10, -4, 6, 6, s.ink, 240)
    b.ell(10, -4, 6, 6, s.ink, 240)
    b.ln(-8, -20, -18, -40, s.fur, 4)
    b.ln(8, -20, 18, -40, s.fur, 4)
    b.eye(-8, -2, 5)
    b.eye(8, -2, 5)


def bird(b: Brush, s: Spec, pose: dict):
    wing = 70 + 40 * pose.get("wing", 0.55)
    b.ell(8, 48, 60, 10, (20, 16, 12), 45)
    b.poly([(-10, 0), (-wing, -30), (-wing + 10, 20), (10, 16)], s.fur, 220)
    b.poly([(10, -4), (wing * 0.4, -50), (40, 8)], mix(s.fur, s.accent, 0.3), 200)
    b.veins(-20, -4, wing * 0.5, 36, mix(s.fur, s.ink, 0.4), 6)
    b.shade(4, 6, 56, 36, s.fur, 240)
    b.ell(6, 16, 32, 16, s.belly, 210)
    b.fur(4, 4, 56, 36, s.fur, 80, 0.7)
    b.shade(-48, -10, 28, 24, s.fur, 240)
    if s.tell == "heart":
        b.ell(-48, -8, 26, 22, s.belly, 230)
    if s.tell == "cap":
        b.ell(-52, -22, 20, 12, s.ink, 240)
    if s.tell == "crest":
        b.poly([(-56, -28), (-48, -70), (-36, -28)], s.accent, 230)
    if s.tell == "chin":
        b.ell(-60, -16, 22, 18, s.ink, 240)
        b.ell(-48, 0, 10, 6, s.belly, 230)
    if s.tell == "green":
        b.ell(-52, -14, 24, 20, (32, 92, 56), 240)
    if s.tell == "brick":
        b.ell(6, 18, 30, 16, s.belly, 230)
    if s.tell == "rust":
        b.poly([(20, 8), (80, 4), (70, 28)], s.accent, 220)
    b.poly([(-78, -4), (-108, 4), (-78, 10)], s.accent if s.tell != "beak" else s.accent, 230)
    b.eye(-58, -12, 7, (40, 36, 28) if s.tell != "jewel" else (196, 48, 48))
    b.ln(-20, 36, -28, 64, s.ink, 4)
    b.ln(8, 36, 14, 64, s.ink, 4)
    if s.tell == "jewel":
        b.ell(-40, 0, 18, 12, s.accent, 180)
        b.ln(20, 8, 70, 40, s.ink, 2)


def lizard(b: Brush, s: Spec, pose: dict):
    b.ell(8, 48, 80, 10, (20, 16, 12), 40)
    b.poly([(40, 0), (130, -8), (150, 8), (44, 16)], s.fur, 220)
    if s.tell == "blue":
        b.poly([(80, 0), (148, -6), (150, 8), (84, 12)], s.accent, 220)
    b.shade(0, 6, 70, 28, s.fur, 240)
    b.ell(4, 14, 40, 12, s.belly, 200)
    b.scales(0, 6, 70, 28, s.fur, 12)
    b.shade(-70, -6, 28, 20, s.fur, 240)
    if s.tell == "dewlap":
        b.poly([(-70, 8), (-88, 40), (-50, 16)], s.accent, 220)
    if s.tell == "turret":
        b.ell(-78, -18, 8, 14, s.fur, 230)
        b.ell(-58, -18, 8, 14, s.fur, 230)
        b.eye(-78, -22, 5)
        b.eye(-58, -22, 5)
    elif s.tell == "horns":
        b.ln(-88, -16, -104, -40, s.accent, 4)
        b.ln(-72, -20, -80, -44, s.accent, 4)
        b.eye(-78, -6, 6)
    else:
        b.eye(-78, -8, 6)
    if s.tell == "spine":
        for x in range(-20, 60, 12):
            b.ln(x, -16, x + 2, -32, s.accent, 3)
    if s.tell == "pad":
        for x in (-30, -8, 16, 40):
            b.ell(x, 36, 10, 6, s.belly, 220)
    for x in (-28, -4, 22, 46):
        b.ln(x, 18, x - 4, 40, s.fur, 4)


def croc(b: Brush, s: Spec, pose: dict):
    long = 1.15 if s.tell == "narrow" else 1.0
    b.shade(10, 8, 90, 32, s.fur, 240)
    b.ell(8, 18, 60, 14, s.belly, 200)
    b.scales(10, 8, 90, 32, s.fur, 14)
    b.poly([(-70, -4), (-160 * long, 4), (-150 * long, 16), (-60, 14)], s.fur, 230)
    b.ln(-150 * long, 8, -70, 8, s.ink, 2)
    b.eye(-88, -10, 7, (196, 176, 48))
    b.poly([(70, 0), (150, -6), (160, 10), (74, 16)], s.fur, 220)
    for x in range(-40, 80, 16):
        b.ln(x, -20, x + 4, -36, s.accent, 4)


def turtle(b: Brush, s: Spec, pose: dict):
    b.shade(0, 4, 80, 52, s.fur, 240)
    if s.tell == "dome":
        b.ell(0, 0, 78, 56, s.fur, 240)
        b.ell(0, -8, 50, 28, s.accent, 160)
        for x, y in ((-24, -8), (0, -16), (24, -6), (-12, 12), (16, 14)):
            b.ell(x, y, 16, 12, mix(s.fur, s.accent, 0.3), 180)
    else:
        b.ell(0, 8, 84, 40, s.fur, 240)
        b.scales(0, 8, 84, 40, s.accent, 16)
    b.shade(-88, 8, 28, 20, s.belly, 230)
    if s.tell == "hook":
        b.poly([(-110, 8), (-130, 20), (-100, 18)], s.ink, 230)
    b.eye(-96, 2, 6)
    for x, y in ((-40, 40), (-10, 46), (24, 44), (50, 38)):
        b.ell(x, y, 14, 8, s.belly, 210)


def frog(b: Brush, s: Spec, pose: dict):
    hop = -20 * pose.get("hop", 0)
    b.shade(0, 8 + hop, 70, 40, s.fur, 240)
    b.ell(4, 20 + hop, 40, 16, s.belly, 210)
    if s.tell == "wart":
        for x, y in ((-16, 0), (12, -8), (28, 10), (-8, 16)):
            b.ell(x, y + hop, 8, 6, s.accent, 200)
    b.ell(-48, -8 + hop, 22, 20, s.fur, 230)
    b.eye(-56, -16 + hop, 10, (196, 176, 48))
    b.eye(-40, -14 + hop, 10, (196, 176, 48))
    b.poly([(-20, 28 + hop), (-70, 50 + hop), (-16, 40 + hop)], s.fur, 220)
    b.poly([(20, 28 + hop), (80, 16 + hop), (30, 40 + hop)], s.fur, 220)
    if pose.get("open", 0) > 0.2:
        b.ell(-48, 8 + hop, 14, 8, (176, 64, 64), 200)


def salamander(b: Brush, s: Spec, pose: dict):
    b.poly([(-20, 0), (120, -8), (140, 8), (-10, 16)], s.fur, 230)
    b.shade(-20, 4, 70, 24, s.fur, 240)
    if s.tell == "spot" or s.tell == "gold":
        for x, y in ((-20, -4), (8, 6), (40, -6), (70, 4), (-40, 8)):
            b.ell(x, y, 8, 6, s.accent, 220)
    b.shade(-80, 0, 28, 18, s.fur, 240)
    b.eye(-88, -4, 6)
    for x in (-40, -16, 16, 40):
        b.ln(x, 12, x - 6, 28, s.fur, 3)


def fish(b: Brush, s: Spec, pose: dict):
    b.shade(0, 0, 90, 42, s.fur, 240)
    b.ell(8, 10, 50, 18, s.belly, 190)
    b.scales(0, 0, 90, 42, mix(s.fur, s.accent, 0.2), 13)
    b.poly([(70, -8), (130, 0), (70, 16)], s.accent, 210)
    b.veins(70, 0, 50, 16, s.ink, 5)
    b.poly([(-10, -36), (20, -70), (30, -28)], s.fur, 210)
    b.poly([(-8, 28), (16, 60), (28, 22)], s.fur, 200)
    if s.tell == "bars":
        for x in (-30, -8, 16, 40):
            b.ln(x, -28, x + 4, 28, s.ink, 6)
    if s.tell == "spots":
        for x, y in ((-20, -8), (10, 8), (30, -12), (50, 6), (-8, 14)):
            b.ell(x, y, 7, 5, s.accent, 200)
    if s.tell == "whisker":
        b.ln(-80, 8, -120, 20, s.ink, 2)
        b.ln(-78, 12, -118, 32, s.ink, 2)
    if s.tell == "paddle":
        b.poly([(-80, -4), (-160, -8), (-158, 8), (-80, 8)], s.accent, 220)
    if s.tell == "spines":
        for x in (-20, -6, 8):
            b.ln(x, -30, x, -70, s.ink, 3)
    if s.tell == "ear":
        b.ell(40, 0, 14, 12, s.accent, 220)
    b.shade(-70, -4, 28, 22, s.fur, 240)
    if s.tell == "beak":
        b.poly([(-92, -4), (-120, 4), (-90, 10)], s.accent, 230)
    b.eye(-76, -8, 8, (40, 36, 28) if s.tell != "glass" else (196, 196, 120))
    if pose.get("open", 0) > 0.25:
        b.ell(-92, 6, 12, 6, (40, 20, 16), 200)


def eel(b: Brush, s: Spec, pose: dict):
    pts = [(-140 + t * 28, math.sin(t * 0.7 + pose.get("dx", 0) * 0.1) * 22) for t in range(12)]
    for i, (x, y) in enumerate(pts[:-1]):
        t = i / 11
        b.ell(x, y, 28 - t * 10, 20 - t * 6, mix(s.fur, s.accent, t * 0.3), 230)
        b.ell(x, y + 6, 16 - t * 6, 8, s.belly, 140)
    b.eye(pts[0][0] - 4, pts[0][1] - 2, 8)
    if s.tell == "disk":
        b.ell(pts[0][0] - 20, pts[0][1] + 8, 20, 14, s.ink, 220)


def ray(b: Brush, s: Spec, pose: dict):
    b.poly([(-20, 0), (-140, 20), (0, 36), (140, 20), (20, 0), (0, -20)], s.fur, 230)
    b.ell(0, 4, 50, 20, s.belly, 180)
    for x, y in ((-40, 4), (30, 8), (-10, -4), (50, -2), (-60, 12)):
        b.ell(x, y, 8, 6, s.accent, 210)
    b.poly([(20, 8), (80, 70), (8, 20)], s.fur, 210)
    b.eye(-16, -4, 6)


def crab(b: Brush, s: Spec, pose: dict):
    signal = -40 - 30 * pose.get("open", 0)
    b.shade(0, 8, 70, 36, s.fur, 240)
    b.ell(6, 18, 36, 14, s.belly, 200)
    if s.tell == "signal":
        b.ln(40, 0, 70, signal, s.ink, 5)
        b.ell(78, signal - 4, 28, 20, s.accent, 240)
        b.ell(-56, 4, 16, 12, s.fur, 230)
    elif s.tell == "pinch":
        b.ell(-70, -8, 22, 16, s.fur, 230)
        b.ell(70, -8, 22, 16, s.fur, 230)
    else:
        b.ell(-60, 0, 16, 12, s.fur, 220)
        b.ell(60, 0, 16, 12, s.fur, 220)
    if s.tell == "stalk":
        b.ln(-16, -16, -28, -56, s.accent, 3)
        b.ln(12, -16, 24, -56, s.accent, 3)
        b.ell(-28, -60, 8, 8, s.ink, 240)
        b.ell(24, -60, 8, 8, s.ink, 240)
    else:
        b.eye(-16, -8, 6)
        b.eye(10, -8, 6)
    for k in range(4):
        x = -36 + k * 24
        b.ln(x, 24, x - 8 + pose.get("dx", 0) * 0.2, 56, s.ink, 3)


def shrimp(b: Brush, s: Spec, pose: dict):
    b.poly([(-20, 0), (80, -16), (100, 4), (-10, 16)], s.fur, 230)
    b.shade(-40, 4, 36, 18, s.fur, 230)
    if s.tell == "stripe":
        for x in (-20, 8, 36, 64):
            b.ln(x, -16, x + 8, 16, s.accent, 5)
    b.ln(-60, 0, -90, -24, s.ink, 2)
    b.eye(-56, -4, 5)
    for k in range(5):
        b.ln(-20 + k * 16, 12, -24 + k * 16, 32, s.ink, 2)


def shell(b: Brush, s: Spec, pose: dict):
    if s.tell == "cone":
        b.poly([(-50, 36), (0, -70), (50, 36)], s.fur, 240)
        for y in (-20, 0, 16):
            b.ln(-30 + y * 0.2, y + 20, 30 - y * 0.2, y + 20, s.accent, 3)
    else:
        b.shade(10, 4, 56, 48, s.fur, 240)
        b.ell(24, -16, 32, 32, s.fur, 230)
        for r in (28, 18, 10):
            b.d.arc(
                (b.xf(10, 8)[0] - r * b.s, b.xf(10, 8)[1] - r * b.s, b.xf(10, 8)[0] + r * b.s, b.xf(10, 8)[1] + r * b.s),
                start=20,
                end=300,
                fill=_c(s.ink, b.dim, 200),
                width=3,
            )
        if s.tell == "knobs":
            for ox, oy in ((8, -8), (28, 12), (16, 24), (36, -16)):
                b.ell(ox, oy, 10, 8, s.accent, 220)
    b.ell(-56, 28, 28, 12, s.belly, 210)
    b.eye(-64, 24, 5)


def barnacle(b: Brush, s: Spec, pose: dict):
    b.poly([(-50, 50), (-32, -60), (32, -60), (50, 50)], s.fur, 240)
    b.ln(-12, -60, -16, 50, s.accent, 4)
    b.ln(12, -60, 16, 50, s.accent, 4)
    kick = 20 + 40 * pose.get("open", 0.2)
    b.ln(-6, -60, -20, -60 - kick, s.accent, 3)
    b.ln(6, -60, 20, -60 - kick, s.accent, 3)
    b.ln(0, -60, 0, -60 - kick * 0.7, s.belly, 2)


def chiton(b: Brush, s: Spec, pose: dict):
    b.ell(0, 8, 100, 36, s.ink, 220)
    for t in range(8):
        x = -70 + t * 20
        b.ell(x, 0, 16, 28, s.fur if t % 2 == 0 else s.belly, 230)
        b.ln(x, -24, x + 2, 24, s.accent, 3)
    b.eye(-88, 0, 5)


def dollar(b: Brush, s: Spec, pose: dict):
    b.ell(0, 8, 90, 56, s.fur, 240)
    b.ell(0, 8, 64, 40, s.belly, 140)
    for ang in range(0, 360, 72):
        rad = math.radians(ang - 90)
        b.ln(0, 8, math.cos(rad) * 40, 8 + math.sin(rad) * 24, s.accent, 4)
        b.ell(math.cos(rad) * 22, 8 + math.sin(rad) * 14, 8, 12, s.accent, 180)


def urchin(b: Brush, s: Spec, pose: dict):
    b.shade(0, 8, 40, 36, s.fur, 240)
    for k in range(22):
        rad = math.radians(k * 16.3)
        b.ln(math.cos(rad) * 24, 8 + math.sin(rad) * 20, math.cos(rad) * 90, 8 + math.sin(rad) * 80, s.accent if k % 2 else s.ink, 3)
    b.eye(-8, 4, 5)


def worm(b: Brush, s: Spec, pose: dict):
    pts = [(-140 + t * 26, math.sin(t * 0.55 + pose.get("dx", 0) * 0.08) * 14) for t in range(12)]
    for i, (x, y) in enumerate(pts[:-1]):
        t = i / 11
        rgb = s.accent if i % 2 == 0 else s.fur
        if s.tell == "clitellum" and 4 <= i <= 5:
            rgb = mix(s.fur, (220, 160, 140), 0.5)
        b.ell(x, y, 20 - t * 8, 14 - t * 4, rgb, 230)
        if s.tell == "annuli" or s.tell == "velvet":
            b.ln(x - 8, y - 10, x + 8, y + 10, s.ink, 1, 120)
    b.eye(pts[0][0] - 6, pts[0][1] - 2, 5)
    if s.tell == "cast":
        b.ell(40, 36, 36, 16, s.belly, 160)


def centipede(b: Brush, s: Spec, pose: dict):
    for t in range(10):
        x = -110 + t * 24
        b.ell(x, 0, 16, 12, s.fur, 230)
        b.ln(x, 8, x - 16, 40, s.ink, 2)
        b.ln(x, 8, x + 16, 40, s.ink, 2)
    b.ell(-128, -4, 14, 10, s.fur, 230)
    b.ln(-136, -8, -160, -28, s.ink, 2)
    b.eye(-132, -6, 4)


def millipede(b: Brush, s: Spec, pose: dict):
    for t in range(14):
        x = -130 + t * 20
        b.ell(x, 4, 14, 16, s.fur if t % 2 == 0 else s.accent, 230)
        b.ln(x, 16, x - 4, 28, s.ink, 2)
        b.ln(x, 16, x + 4, 28, s.ink, 2)
    b.eye(-136, 0, 4)


def pillbug(b: Brush, s: Spec, pose: dict):
    roll = pose.get("sit") if False else pose.get("scale", 1)
    if pose.get("dy", 0) > 14:
        b.ell(0, 8, 50, 48, s.fur, 240)
        for ang in range(0, 360, 28):
            rad = math.radians(ang)
            b.ell(math.cos(rad) * 28, 8 + math.sin(rad) * 26, 10, 8, s.accent, 200)
    else:
        b.shade(0, 8, 70, 32, s.fur, 240)
        for t in range(7):
            b.ell(-48 + t * 16, 0, 12, 18, s.accent if t % 2 else s.fur, 220)
        for x in range(-40, 50, 18):
            b.ln(x, 20, x - 4, 36, s.ink, 2)
    b.eye(-56, 0, 5)


def bug(b: Brush, s: Spec, pose: dict):
    wing = 50 + 30 * pose.get("wing", 0.5)
    b.shade(0, 8, 36, 50, s.fur, 240)
    if s.tell in ("leaf", "hop", "song"):
        b.poly([(-8, -10), (-wing, -40), (-wing + 8, 20), (0, 16)], s.fur, 200)
        b.poly([(8, -10), (wing, -40), (wing - 8, 20), (0, 16)], s.fur, 200)
        b.veins(-20, -8, wing * 0.6, 36, s.ink, 5)
    b.ell(0, -36, 18, 16, s.fur, 230)
    b.ln(-10, -48, -28, -80, s.ink, 2)
    b.ln(10, -48, 28, -80, s.ink, 2)
    if s.tell == "snout":
        b.ln(-8, -40, -60, -8, s.ink, 3)
        b.ell(-64, -6, 8, 6, s.fur, 230)
    if s.tell == "forceps":
        b.ln(-8, 50, -24, 80, s.ink, 3)
        b.ln(8, 50, 24, 80, s.ink, 3)
    if s.tell == "furcula":
        b.poly([(8, 40), (40, 70), (12, 48)], s.accent, 220)
    b.eye(-8, -36, 5)
    b.eye(8, -36, 5)
    for k in range(3):
        y = -10 + k * 16
        b.ln(-16, y, -50, y + 20, s.ink, 2)
        b.ln(16, y, 50, y + 20, s.ink, 2)


def moth(b: Brush, s: Spec, pose: dict):
    wing = 90 * (0.7 + 0.5 * pose.get("wing", 0.55))
    for side in (-1, 1):
        b.poly([(0, 0), (side * wing, -50), (side * wing * 1.05, 10), (0, 16)], s.fur, 230)
        b.poly([(0, 12), (side * wing * 0.7, 20), (side * wing * 0.65, 60), (0, 24)], s.fur, 210)
        b.ln(0, 0, side * wing, -40, s.ink, 2, 160)
        if s.tell == "tails":
            b.poly([(side * 40, 50), (side * 70, 90), (side * 36, 58)], s.fur, 220)
        if s.tell == "lace":
            b.veins(side * 20, 0, wing * 0.5, 40, s.ink, 6)
    b.shade(0, 4, 12, 40, s.ink, 240)
    b.eye(-4, -16, 4)
    b.ln(-6, -28, -20, -56, s.ink, 2)
    b.ln(6, -28, 20, -56, s.ink, 2)


def spider(b: Brush, s: Spec, pose: dict):
    b.shade(16, 8, 36, 28, s.fur, 240)
    b.shade(-24, 0, 28, 24, s.fur, 240)
    b.fur(16, 8, 36, 28, s.fur, 40, 0.6)
    if s.tell == "hour":
        b.ell(16, 8, 12, 10, s.accent, 230)
    if s.tell == "face":
        b.ell(-30, -8, 10, 8, s.accent, 220)
        b.ell(-16, -8, 10, 8, s.accent, 220)
    if s.tell == "fuzz":
        b.fur(16, 8, 36, 28, s.accent, 50, 0.9)
    b.eye(-30, -4, 5)
    b.eye(-18, -4, 5)
    for i, side in enumerate((-1, -1, -1, -1, 1, 1, 1, 1)):
        k = i % 4
        x0 = -8 if side < 0 else 8
        y0 = -8 + k * 10
        x1 = side * (70 + k * 8)
        y1 = -40 + k * 28
        b.ln(x0, y0, x1, y1, s.ink, 3)
        b.ln(x1, y1, x1 + side * 16, y1 + 20, s.ink, 2)


def harvestman(b: Brush, s: Spec, pose: dict):
    b.shade(0, 8, 36, 28, s.fur, 240)
    b.ell(0, 12, 20, 12, s.belly, 180)
    b.eye(-8, 4, 6)
    b.eye(8, 4, 6)
    for i in range(8):
        side = -1 if i < 4 else 1
        k = i % 4
        b.ln(side * 12, 8, side * (90 + k * 12), -36 + k * 32, s.ink, 3)


def scorpion(b: Brush, s: Spec, pose: dict):
    b.shade(0, 16, 40, 24, s.fur, 240)
    b.ell(-50, 4, 22, 14, s.fur, 230)
    b.ell(50, 4, 22, 14, s.fur, 230)
    pts = [(20, -8), (40, -28), (50, -56), (36, -84), (16, -96)]
    for i, (x, y) in enumerate(pts[:-1]):
        b.ell(x, y, 12 - i, 10 - i, s.fur, 230)
    b.ell(12, -104, 8, 8, s.accent, 240)
    if s.tell == "whip":
        b.ln(20, -8, 90, -80, s.ink, 2)
    b.eye(-8, 8, 5)
    for k in range(4):
        b.ln(-16, 20 + k * 4, -50, 40 + k * 8, s.ink, 2)
        b.ln(16, 20 + k * 4, 50, 40 + k * 8, s.ink, 2)


def tick(b: Brush, s: Spec, pose: dict):
    b.shade(0, 8, 50, 40, s.fur, 240)
    b.ell(-8, -16, 20, 16, s.accent, 220)
    b.eye(-12, -18, 4)
    b.eye(4, -18, 4)
    for k in range(4):
        b.ln(-16, 8 + k * 6, -48, 16 + k * 10, s.ink, 2)
        b.ln(16, 8 + k * 6, 48, 16 + k * 10, s.ink, 2)


def bee(b: Brush, s: Spec, pose: dict):
    wing = 16 * pose.get("wing", 0.55)
    b.ell(-28, -36 - wing, 48, 24, (220, 228, 236), 130)
    b.ell(28, -36 + wing, 48, 24, (220, 228, 236), 130)
    b.shade(8, 8, 70, 40, s.fur if s.tell == "shine" else s.belly, 240)
    if s.tell != "shine":
        for x in (-16, 4, 24):
            b.ln(x, -28, x + 4, 36, s.fur, 8)
        b.fur(8, 8, 70, 40, s.belly, 70, 0.8)
    else:
        b.shade(16, 12, 40, 28, s.fur, 230)
    if s.tell == "long":
        b.ell(50, 8, 28, 16, s.belly, 230)
    b.shade(-56, 0, 24, 20, s.fur, 240)
    b.ln(-70, -8, -100, -36, s.ink, 2)
    b.ln(-64, -4, -92, -40, s.ink, 2)
    if s.tell == "eye":
        b.ell(-62, -4, 12, 10, s.ink, 240)
    else:
        b.eye(-62, -4, 6, (252, 220, 80))
    if s.tell == "disc":
        b.ell(40, 24, 18, 10, s.accent, 220)
    for k in range(3):
        b.ln(-16 + k * 16, 28, -20 + k * 16, 52, s.ink, 2)


def comb(b: Brush, s: Spec, pose: dict):
    cells = ((-40, -20), (0, -20), (40, -20), (-20, 16), (20, 16), (0, 50))
    for ox, oy in cells:
        b.poly(
            [
                (ox, oy - 22),
                (ox + 20, oy - 10),
                (ox + 20, oy + 10),
                (ox, oy + 22),
                (ox - 20, oy + 10),
                (ox - 20, oy - 10),
            ],
            s.fur if (ox + oy) % 40 else s.belly,
            230,
        )
        b.ell(ox, oy, 6, 6, s.accent, 140)


def cap(b: Brush, s: Spec, pose: dict):
    b.ell(0, 40, 16, 40, s.ink, 230)
    b.ell(0, -8, 80, 36, s.fur, 240)
    b.ell(0, 8, 70, 16, mix(s.fur, s.ink, 0.2), 180)
    if s.tell == "dots":
        for x, y in ((-30, -12), (10, -20), (36, -4), (-8, 4), (20, 8), (-40, 4)):
            b.ell(x, y, 8, 6, s.belly, 230)
    if s.tell == "fork":
        for x in range(-40, 50, 12):
            b.ln(x, 16, x * 0.4, 48, s.accent, 2)
    b.ell(0, 70, 22, 10, s.ink, 220)


def morel(b: Brush, s: Spec, pose: dict):
    b.ell(0, 50, 16, 36, s.belly, 230)
    b.ell(0, -16, 40, 56, s.fur, 240)
    for y in range(-50, 30, 14):
        for x in range(-24, 30, 16):
            b.ell(x, y, 7, 5, s.ink, 180)


def shelf(b: Brush, s: Spec, pose: dict):
    for i, (ox, oy, rx) in enumerate(((-8, 16, 70), (8, -4, 58), (0, -24, 46))):
        col = mix(s.fur, s.accent, i * 0.2)
        b.ell(ox, oy, rx, 18, col, 230)
        if s.tell == "rings":
            b.ell(ox, oy, rx - 12, 10, s.belly, 80)


def mane(b: Brush, s: Spec, pose: dict):
    b.ell(0, 8, 36, 28, s.fur, 230)
    for k in range(26):
        ang = math.radians(k * 14 - 40)
        b.ln(math.cos(ang) * 20, 8 + math.sin(ang) * 14, math.cos(ang) * 80, 8 + math.sin(ang) * 70, s.belly, 3)


def puff(b: Brush, s: Spec, pose: dict):
    b.ell(0, 8, 70, 64, s.fur, 240)
    b.ell(0, -8, 40, 28, s.belly, 140)
    if pose.get("glow", 0) > 0.3 or pose.get("open", 0) > 0.2:
        for k in range(10):
            ang = k * 0.6
            b.ell(math.cos(ang) * 40, -40 - k * 6, 4, 4, s.accent, 140)


def yeast(b: Brush, s: Spec, pose: dict):
    for x, y, r in ((-20, 8, 36), (30, -8, 28), (8, 36, 22), (-40, -24, 18), (48, 28, 16)):
        b.ell(x, y, r, r * 0.85, s.fur, 200)
        b.ell(x - r * 0.2, y - r * 0.25, r * 0.4, r * 0.3, s.belly, 140)


def lichen(b: Brush, s: Spec, pose: dict):
    for x, y, r in ((-20, 0, 50), (24, 8, 40), (0, -24, 28), (40, -16, 22)):
        b.ell(x, y, r, r * 0.7, s.fur, 210)
    b.ell(-8, 4, 16, 12, s.accent, 180)


def slipper(b: Brush, s: Spec, pose: dict):
    b.shade(0, 0, 80, 36, s.fur, 230)
    b.ell(10, 4, 36, 16, s.belly, 180)
    if s.tell == "cilia":
        for k in range(16):
            ang = math.radians(-30 + k * 14)
            b.ln(math.cos(ang) * 70, math.sin(ang) * 28, math.cos(ang) * 92, math.sin(ang) * 40, s.accent, 2)
    if s.tell == "flag":
        b.ln(70, 0, 120, -20, s.ink, 2)
    if s.tell == "cup":
        b.ell(-20, -8, 16, 12, s.accent, 200)
    b.ell(-48, -4, 10, 8, s.ink, 220)


def amoeba(b: Brush, s: Spec, pose: dict):
    reach = 20 * pose.get("open", 0.2)
    b.poly([(-40, -10), (-80 - reach, -40), (-20, 10), (40, -20), (70 + reach, 10), (20, 40), (-30, 30)], s.fur, 210)
    b.ell(0, 4, 36, 24, s.belly, 180)
    b.ell(-8, 0, 12, 10, s.ink, 200)


def volvox(b: Brush, s: Spec, pose: dict):
    b.ell(0, 0, 80, 80, s.fur, 120)
    for k in range(12):
        ang = math.radians(k * 30)
        b.ell(math.cos(ang) * 48, math.sin(ang) * 48, 10, 10, s.belly, 200)
    b.ell(-16, -8, 16, 16, s.accent, 210)
    b.ell(18, 12, 12, 12, s.accent, 200)


def diatom(b: Brush, s: Spec, pose: dict):
    b.ell(0, 0, 70, 36, s.fur, 230)
    for x in range(-50, 60, 12):
        b.ln(x, -28, x, 28, s.accent, 2)
    b.ell(0, 0, 50, 20, s.belly, 120)


def kelp(b: Brush, s: Spec, pose: dict):
    b.ln(0, 80, 8, -80, s.ink, 8)
    for y, side in ((-40, -1), (-8, 1), (24, -1), (50, 1)):
        b.poly([(4, y), (side * 70, y - 16), (side * 80, y + 8), (6, y + 12)], s.fur, 220)
        b.veins(side * 20, y, 40, 16, s.accent, 4)


def stentor(b: Brush, s: Spec, pose: dict):
    b.poly([(0, 70), (-20, 20), (-50, -40), (0, -60), (50, -40), (20, 20)], s.fur, 220)
    b.ell(0, -48, 40, 16, s.belly, 200)
    for k in range(10):
        ang = math.radians(-40 + k * 8)
        b.ln(math.cos(ang) * 36, -48 + math.sin(ang) * 10, math.cos(ang) * 56, -48 + math.sin(ang) * 20, s.accent, 2)


def coli(b: Brush, s: Spec, pose: dict):
    b.shade(0, 0, 90, 28, s.fur, 230)
    for k in range(8):
        b.ln(-80 + k * 20, 0, -90 + k * 20, -36, s.ink, 1, 140)
    b.ell(-70, -4, 8, 6, s.ink, 200)


def halo(b: Brush, s: Spec, pose: dict):
    b.poly([(-20, -40), (40, -20), (50, 24), (0, 50), (-50, 20), (-40, -16)], s.fur, 220)
    b.ell(0, 0, 28, 20, s.belly, 180)
    for x, y in ((-24, 16), (20, 12), (8, 28), (28, -8)):
        b.ell(x, y, 8, 6, s.accent, 200)
    b.ell(4, -8, 8, 8, s.ink, 200)


def far(b: Brush, s: Spec, pose: dict):
    glow = pose.get("glow", 0.2)
    b.shade(0, -4, 36, 50, s.fur, 230)
    b.ell(-10, -20, 16, 18, s.belly, 200)
    b.ell(0, -50, 8 + glow * 10, 6 + glow * 6, s.accent, 210)
    for k in range(3):
        b.ell(0, -64 - k * 14 - glow * 10, 4 + k, 4, s.accent, 90)


def choir(b: Brush, s: Spec, pose: dict):
    tones = [s.fur, s.accent, s.belly, mix(s.fur, s.ink, 0.3)]
    for k, col in enumerate(tones):
        w = 80 - k * 10
        b.ell(0, -40 + k * 28, w, 14, col, 210)
        b.ln(-w, -40 + k * 28, w, -40 + k * 28, s.belly, 2, 140)
    b.ell(0, 20, 16, 20, s.belly, 200)


def nimbus(b: Brush, s: Spec, pose: dict):
    b.ell(0, -16, 80, 56, s.fur, 200)
    b.ell(-24, -24, 40, 32, s.accent, 160)
    b.ell(28, -8, 36, 28, s.belly, 150)
    for ox, L in ((-24, 50), (-4, 64), (20, 48), (36, 36)):
        b.ln(ox, 24, ox, 24 + L, s.ink, 3, 140)
        b.ell(ox, 24 + L, 8, 10, s.fur, 120)


def silica(b: Brush, s: Spec, pose: dict):
    planes = [
        [(-8, -70), (36, -40), (20, 10), (-24, -4)],
        [(-40, -20), (-8, -70), (-24, -4), (-50, 20)],
        [(20, 10), (46, -12), (40, 40), (0, 46)],
        [(-24, -4), (20, 10), (0, 46), (-44, 36)],
    ]
    cols = [s.fur, s.accent, s.belly, mix(s.fur, s.ink, 0.25)]
    for pts, col in zip(planes, cols):
        b.poly(pts, col, 230)


def term(b: Brush, s: Spec, pose: dict):
    b.poly([(-8, -60), (20, -16), (16, 50), (-20, 40), (-24, -12)], s.accent, 230)
    b.poly([(-8, -60), (6, -44), (10, 30), (-20, 40), (-24, -12)], s.fur, 220)
    b.ell(-14, -16, 8, 8, s.fur, 220)
    b.ln(-14, 40, -32, 70, s.accent, 4)
    b.ln(8, 46, 28, 70, s.fur, 4)


def nexus(b: Brush, s: Spec, pose: dict):
    nodes = [(-30, -24), (20, -36), (36, 10), (0, 30), (-36, 16), (10, -4)]
    for i, (ax, ay) in enumerate(nodes):
        for bx, by in nodes[i + 1 :]:
            if (ax - bx) ** 2 + (ay - by) ** 2 < 2800:
                b.ln(ax, ay, bx, by, s.accent, 2, 160)
    for k, (x, y) in enumerate(nodes):
        b.ell(x, y, 16 if k == 5 else 13, 16 if k == 5 else 13, s.fur, 230)
        b.ell(x - 3, y - 4, 5, 5, s.belly, 200)


def needle(b: Brush, s: Spec, pose: dict):
    b.poly([(-10, -80), (10, -80), (6, 70), (-6, 70)], s.fur, 230)
    b.poly([(-10, -80), (0, -110), (10, -80)], s.accent, 230)
    b.ell(0, -20, 16, 16, s.belly, 200)


def cyst(b: Brush, s: Spec, pose: dict):
    b.ell(0, 0, 70, 60, s.fur, 230)
    b.ell(0, 0, 48, 40, s.belly, 160)
    b.ell(-12, -8, 16, 14, s.ink, 180)


def bivalve(b: Brush, s: Spec, pose: dict):
    open_ = 8 + 22 * pose.get("open", 0)
    b.ell(0, 8 + open_, 80, 28, s.fur, 230)
    b.ell(0, 8 - open_, 80, 28, mix(s.fur, s.ink, 0.15), 230)
    b.ell(0, 8, 56, 16 + open_, s.belly, 180)
    if s.tell == "mantle":
        b.ell(0, 8, 48, 12 + open_, s.accent, 200)
        b.ell(-16, 8, 10, 8, (255, 176, 72), 180)
    b.ln(-70, 8, 70, 8, s.ink, 2, 140)


def coral(b: Brush, s: Spec, pose: dict):
    b.ell(0, 20, 80, 56, s.fur, 230)
    for y in range(-20, 50, 10):
        b.ln(-60, y, 60, y + 6, s.accent, 3)
        b.ln(-50, y + 4, 50, y - 4, mix(s.fur, s.ink, 0.3), 2)


def anemone(b: Brush, s: Spec, pose: dict):
    b.ell(0, 40, 40, 24, s.ink, 220)
    for k in range(16):
        ang = math.radians(-70 + k * 10)
        wob = 8 * math.sin(k + pose.get("dx", 0))
        b.ln(math.cos(ang) * 16, 20, math.cos(ang) * 70 + wob, -60 + math.sin(ang) * 20, s.fur, 5)
        b.ell(math.cos(ang) * 70 + wob, -60 + math.sin(ang) * 20, 8, 6, s.belly, 200)


def tardigrade(b: Brush, s: Spec, pose: dict):
    b.shade(0, 4, 70, 36, s.fur, 240)
    b.ell(8, 12, 40, 14, s.belly, 190)
    b.shade(-60, 0, 24, 18, s.fur, 230)
    b.eye(-68, -4, 6)
    for x in (-30, -6, 20, 44):
        b.ell(x, 28, 10, 8, s.accent, 220)
        b.ln(x - 4, 32, x - 8, 44, s.ink, 2)


def flat(b: Brush, s: Spec, pose: dict):
    b.poly([(-80, 0), (-20, -24), (80, 0), (-20, 24)], s.fur, 230)
    b.ell(-8, 0, 20, 10, s.belly, 180)
    b.eye(-56, -6, 6)
    b.eye(-56, 6, 6)


PLANS = {
    "mammal": mammal,
    "bat": bat,
    "bird": bird,
    "lizard": lizard,
    "croc": croc,
    "turtle": turtle,
    "frog": frog,
    "salamander": salamander,
    "fish": fish,
    "eel": eel,
    "ray": ray,
    "crab": crab,
    "shrimp": shrimp,
    "shell": shell,
    "barnacle": barnacle,
    "chiton": chiton,
    "dollar": dollar,
    "urchin": urchin,
    "worm": worm,
    "centipede": centipede,
    "millipede": millipede,
    "pillbug": pillbug,
    "bug": bug,
    "moth": moth,
    "spider": spider,
    "harvestman": harvestman,
    "scorpion": scorpion,
    "tick": tick,
    "bee": bee,
    "comb": comb,
    "cap": cap,
    "morel": morel,
    "shelf": shelf,
    "mane": mane,
    "puff": puff,
    "yeast": yeast,
    "lichen": lichen,
    "slipper": slipper,
    "amoeba": amoeba,
    "volvox": volvox,
    "diatom": diatom,
    "kelp": kelp,
    "stentor": stentor,
    "coli": coli,
    "halo": halo,
    "far": far,
    "choir": choir,
    "nimbus": nimbus,
    "silica": silica,
    "term": term,
    "nexus": nexus,
    "needle": needle,
    "cyst": cyst,
    "bivalve": bivalve,
    "coral": coral,
    "anemone": anemone,
    "tardigrade": tardigrade,
    "flat": flat,
}


def paint_frame(key: str, anim: str, index: int) -> Image.Image:
    spec = SPECS[key]
    pose = pose_for(key, anim, index, ANIMS[anim])
    brush = Brush(pose)
    PLANS[spec.plan](brush, spec, pose)
    return brush.finish()


def write_kind(key: str) -> None:
    for anim, count in ANIMS.items():
        dest = WEB_SPRITES / key / anim
        dest.mkdir(parents=True, exist_ok=True)
        for i in range(count):
            paint_frame(key, anim, i).save(dest / f"{i + 1}.png", "PNG", optimize=True)
    desk = DESK_SPRITES / key
    if desk.exists():
        shutil.rmtree(desk)
    shutil.copytree(WEB_SPRITES / key, desk)


def knockout_kind(key: str) -> None:
    for anim, count in ANIMS.items():
        dest = WEB_SPRITES / key / anim
        dest.mkdir(parents=True, exist_ok=True)
        for i in range(count):
            path = dest / f"{i + 1}.png"
            if not path.exists():
                continue
            im = clear_connected_plate(Image.open(path))
            # If a photo sat small on a plate, sit it like Rui after the plate leaves.
            if im.getbbox():
                im = fit_like_rui(im)
            im.save(path, "PNG", optimize=True)
    desk = DESK_SPRITES / key
    if desk.exists():
        shutil.rmtree(desk)
    if (WEB_SPRITES / key).exists():
        shutil.copytree(WEB_SPRITES / key, desk)


def write_portrait(key: str) -> None:
    idle = WEB_SPRITES / key / "idle" / "1.png"
    if not idle.exists():
        return
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
    plate = Image.open(idle).convert("RGBA")
    canvas = study.resize((1408, 1408), Image.Resampling.LANCZOS)
    inset = plate.resize((720, 720), Image.Resampling.LANCZOS)
    mask = Image.new("L", inset.size, 0)
    ImageDraw.Draw(mask).ellipse((40, 40, 680, 680), fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(18))
    canvas.paste(inset, (344, 220), mask)
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((90, 1120, 720, 1320), 10, fill=(236, 226, 206))
    spec = SPECS.get(key)
    latin = spec.latin if spec else key.replace("_", " ")
    draw.text((118, 1150), latin, font=font, fill=(32, 26, 20))
    draw.text((118, 1200), key.replace("_", " "), font=small, fill=(90, 72, 52))
    canvas.save(WEB_PETS / f"{key}.jpg", "JPEG", quality=90)


def paint_keys() -> list[str]:
    return sorted(SPECS)


def photo_plate_keys() -> list[str]:
    return ["carpenter_ant", "cicada", "darner", "firefly", "honeybee", "ladybird", "luna", "mantis", "monarch", "stick"]


def sit_bodies_from(folder: Path, keys: list[str] | None = None) -> list[str]:
    """Sit house-hand paintings. Do not redraw a photograph. Do not invent a taxon."""
    sat: list[str] = []
    wanted = set(keys) if keys else None
    for path in sorted(folder.glob("*_body.png")):
        key = path.name[: -len("_body.png")]
        if wanted is not None and key not in wanted:
            continue
        if key in PHOTO_KEEP and key not in SNAKE_STAMPS:
            print(f"skip photograph {key}", flush=True)
            continue
        print(f"sit {key}", flush=True)
        write_kind_from_body(key, ingest_body(path, key))
        write_portrait(key)
        sat.append(key)
    return sat


def sit_pose_bodies_from(folder: Path, keys: list[str] | None = None) -> list[str]:
    """Sit a painted pose set. `{key}_{anim}.png` or `{key}_{anim}_body.png`."""
    sat: list[str] = []
    wanted = set(keys) if keys else None
    found: dict[str, dict[str, Path]] = {}
    for path in sorted(folder.glob("*.png")):
        stem = path.stem[: -len("_body")] if path.stem.endswith("_body") else path.stem
        parts = stem.rsplit("_", 1)
        if len(parts) != 2 or parts[1] not in ANIMS:
            continue
        key, anim = parts
        if wanted is not None and key not in wanted:
            continue
        if key in PHOTO_KEEP and key not in SNAKE_STAMPS:
            print(f"skip photograph {key}", flush=True)
            continue
        found.setdefault(key, {})[anim] = path
    for key, poses in sorted(found.items()):
        existing_idle = WEB_SPRITES / key / "idle" / "1.png"
        if "idle" not in poses and not existing_idle.exists():
            print(f"skip {key}: no idle painting", flush=True)
            continue
        print(f"sit poses {key} {sorted(poses)}", flush=True)
        bodies = {anim: ingest_body(path, key) for anim, path in poses.items()}
        write_kind_from_poses(key, bodies)
        write_portrait(key)
        sat.append(key)
    return sat


def main(argv: list[str] | None = None) -> None:
    import sys

    args = list(sys.argv[1:] if argv is None else argv)
    only = [a for a in args if not a.startswith("-") and not a.startswith("--bodies=") and not a.startswith("--poses=")]
    bodies_arg = next((a.split("=", 1)[1] for a in args if a.startswith("--bodies=")), "")
    poses_arg = next((a.split("=", 1)[1] for a in args if a.startswith("--poses=")), "")
    do_knock = "--knock" in args or (not only and not bodies_arg and not poses_arg)
    do_paint = "--paint" in args
    sat: list[str] = []
    if poses_arg:
        sat = sit_pose_bodies_from(Path(poses_arg), only or None)
    if bodies_arg:
        sat = sit_bodies_from(Path(bodies_arg), only or None)
    if only and not bodies_arg and not poses_arg:
        keys = only
        knock = [k for k in keys if k in set(photo_plate_keys())]
        paint = [k for k in keys if k in SPECS]
    else:
        knock = photo_plate_keys() if do_knock else []
        paint = paint_keys() if do_paint else []
    for key in knock:
        print(f"knock {key}", flush=True)
        knockout_kind(key)
        write_portrait(key)
    for key in paint:
        print(f"paint {key}", flush=True)
        write_kind(key)
        write_portrait(key)
    print(f"done sit={len(sat)} paint={len(paint)} knock={len(knock)} poses={1 if poses_arg else 0} catalog=210", flush=True)


if __name__ == "__main__":
    main()
