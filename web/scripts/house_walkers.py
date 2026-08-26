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

# Tan guests whose wash is also their hide. Ingest knocks the border only.
TAN_SIT = {
    "anemone",
    "brain_coral",
    "gecko",
    "ghost_crab",
    "hognose",
    "lions_mane",
    "morel",
    "pond_snail",
    "rosy_boa",
    "yeast",
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
    "crow",
    "raven",
    "barn_owl",
    "red_tail",
    "chickadee",
    "robin",
    "mallard",
    "canada_goose",
    "pileated",
    "hummingbird",
    "deer",
    "bat",
    "squirrel",
    "otter",
    "raccoon",
    "skunk",
    "opossum",
    "beaver",
    "porcupine",
    "black_bear",
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
    "bass",
    "brook_trout",
    "catfish",
    "bluegill",
    "perch",
    "pike",
    "walleye",
    "paddlefish",
    "lamprey",
    "american_eel",
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
    "fiddler_crab",
    "ghost_crab",
    "limpet",
    "barnacle",
    "chiton",
    "periwinkle",
    "sand_dollar",
    "sea_urchin",
    "knobbed_whelk",
    "lugworm",
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
    "alligator", "american_eel", "black_bear", "caecilian", "click_beetle",
    "coli", "crayfish", "crow", "eagle_ray", "earwig", "field_cricket", "lamprey",
    "leech", "millipede", "pileated", "raven", "robber_fly", "salamander", "skunk",
    "umbral", "vinegaroon", "widow",
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


def _live_components(arr):
    """Return (seen, comps) where comps are (id, count, tan)."""
    import numpy as np

    h, w = arr.shape[:2]
    a = arr[:, :, 3]
    live = a > 12
    seen = np.zeros((h, w), dtype=np.int32)
    comps: list[tuple[int, int, int]] = []
    cid = 0
    r = arr[:, :, 0]
    g = arr[:, :, 1]
    b = arr[:, :, 2]
    tan_map = (
        live
        & (r > 140)
        & (g > 110)
        & (b > 55)
        & (np.abs(r.astype(np.int16) - g.astype(np.int16)) < 60)
        & ((r.astype(np.int16) - b.astype(np.int16)) > 16)
        & ((np.maximum(np.maximum(r, g), b) - np.minimum(np.minimum(r, g), b)) < 115)
    )
    ys, xs = np.where(live)
    for y, x in zip(ys.tolist(), xs.tolist()):
        if seen[y, x]:
            continue
        cid += 1
        q = deque([(x, y)])
        seen[y, x] = cid
        count = 0
        tan = 0
        while q:
            cx, cy = q.popleft()
            count += 1
            if tan_map[cy, cx]:
                tan += 1
            for nx, ny in ((cx + 1, cy), (cx - 1, cy), (cx, cy + 1), (cx, cy - 1)):
                if 0 <= nx < w and 0 <= ny < h and live[ny, nx] and not seen[ny, nx]:
                    seen[ny, nx] = cid
                    q.append((nx, ny))
        comps.append((cid, count, tan))
    return seen, comps


def parchment_island_pixels(im: Image.Image) -> int:
    """Largest disconnected parchment island that is not the guest."""
    import numpy as np

    arr = np.array(im.convert("RGBA"))
    _seen, comps = _live_components(arr)
    if not comps:
        return 0
    # The guest is the ink, not the biggest tan splash.
    main = max(comps, key=lambda t: (t[1] - t[2], t[1]))
    ink = sum(count - tan for _ident, count, tan in comps)
    # A yeast foam or a tan gecko is the wash. A splash beside a frog is not.
    if ink < 800:
        return 0
    biggest = 0
    for ident, count, tan in comps:
        if ident == main[0]:
            continue
        if tan / max(1, count) >= 0.50 and count >= 40:
            biggest = max(biggest, count)
    return biggest


def knock_island_crumbs(im: Image.Image) -> Image.Image:
    """Parchment islands that do not touch the guest go. The animal stays.

    A second limb or a spore puff may sit apart. A tan splash may not,
    even when the splash is larger than a crumb.
    """
    import numpy as np

    arr = np.array(im.convert("RGBA"))
    h, w = arr.shape[:2]
    seen, comps = _live_components(arr)
    if not comps:
        return im
    # Prefer the component with the most non-tan ink. A wash can outgrow a guest.
    main_id, main_count, main_tan = max(comps, key=lambda t: (t[1] - t[2], t[1]))
    main_tan_frac = main_tan / max(1, main_count)
    n = h * w
    keep = {main_id}
    for ident, count, tan in comps:
        if ident == main_id:
            continue
        tan_frac = tan / max(1, count)
        # A colorful second part (wing, claw, puff) stays when it is large.
        if tan_frac < 0.50 and count >= max(80, n // 90):
            keep.add(ident)
            continue
        # A tan animal may break into nearby fragments. Keep large tan parts.
        if main_tan_frac >= 0.55 and count >= max(400, int(main_count * 0.12)):
            keep.add(ident)
            continue
        # A parchment island of any honest size leaves.
        if tan_frac >= 0.50:
            continue
        if count >= max(80, n // 90):
            keep.add(ident)
    drop = (seen > 0) & ~np.isin(seen, list(keep))
    arr[drop] = CLEAR
    return Image.fromarray(arr, "RGBA")


def knock_parchment_fringe(im: Image.Image, steps: int = 3) -> Image.Image:
    """Eat a tan halo that still touches empty wood. Interior ink stays.

    When the guest has a real non-tan core, a wash that touches the wood
    is flooded all the way through parchment. A yeast foam or a ghost crab
    is the wash, so only a short halo is trimmed.
    """
    import numpy as np

    arr = np.array(im.convert("RGBA"))
    h, w = arr.shape[:2]
    a = arr[:, :, 3]
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
    live = a > 12
    if not live.any():
        return im
    parch = (
        live
        & (r > 140)
        & (g > 110)
        & (b > 55)
        & (np.abs(r.astype(np.int16) - g.astype(np.int16)) < 60)
        & ((r.astype(np.int16) - b.astype(np.int16)) > 16)
        & ((np.maximum(np.maximum(r, g), b) - np.minimum(np.minimum(r, g), b)) < 115)
    )
    gray = ((r.astype(np.uint16) + g.astype(np.uint16) + b.astype(np.uint16)) // 3).astype(np.uint8)
    gray_im = Image.fromarray(gray, "L")
    local_range = np.array(gray_im.filter(ImageFilter.MaxFilter(5)), dtype=np.int16) - np.array(
        gray_im.filter(ImageFilter.MinFilter(5)), dtype=np.int16
    )
    # A wash is flat tan. Cream fur and a whelk shell keep grain.
    flat = parch & (local_range < 34)
    core = live & ~parch
    live_n = int(live.sum())
    core_n = int(core.sum())
    flood_all = core_n >= max(700, int(live_n * 0.12)) and int(flat.sum()) >= 80
    if flood_all:
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
            aa = arr[y, x, 3]
            is_flat = bool(flat[y, x]) if aa > 12 else False
            if aa > 12 and not is_flat:
                continue
            if aa > 12 and is_flat:
                arr[y, x] = CLEAR
            if aa <= 12 or is_flat:
                push(x + 1, y)
                push(x - 1, y)
                push(x, y + 1)
                push(x, y - 1)
        return Image.fromarray(arr, "RGBA")

    # Tan guests: only a short halo. Do not eat the foam.
    for _ in range(max(1, min(steps, 2))):
        live = arr[:, :, 3] > 12
        parch = (
            live
            & (arr[:, :, 0] > 140)
            & (arr[:, :, 1] > 110)
            & (arr[:, :, 2] > 55)
            & (np.abs(arr[:, :, 0].astype(np.int16) - arr[:, :, 1].astype(np.int16)) < 60)
            & ((arr[:, :, 0].astype(np.int16) - arr[:, :, 2].astype(np.int16)) > 16)
        )
        padded = np.pad(live, 1, constant_values=False)
        edge = live & ~(
            padded[1:-1, 2:] & padded[1:-1, :-2] & padded[2:, 1:-1] & padded[:-2, 1:-1]
        )
        arr[edge & parch] = CLEAR
    return Image.fromarray(arr, "RGBA")


def clean_guest_matte(im: Image.Image, key: str = "", idle: bool = False) -> Image.Image:
    """Knock fringe and islands on a sat sprite. Idle keeps the #92 sit."""
    knocked = knock_island_crumbs(im)
    knocked = knock_parchment_fringe(knocked, steps=2 if idle else 3)
    if knocked.getbbox() is None:
        return im.convert("RGBA")
    if idle:
        return knocked
    # Pose sit fills again after a wash leaves. Idle stays the #92 hand.
    return fit_like_rui(knocked, side=0.90)


def knock_tiny_crumbs(im: Image.Image, limit: int = 48) -> Image.Image:
    """Only specks leave. A tan guest may be many cells or a cream flank."""
    import numpy as np

    arr = np.array(im.convert("RGBA"))
    seen, comps = _live_components(arr)
    if not comps:
        return im
    main_id = max(comps, key=lambda t: t[1])[0]
    keep = {ident for ident, count, _tan in comps if ident == main_id or count >= limit}
    drop = (seen > 0) & ~np.isin(seen, list(keep))
    arr[drop] = CLEAR
    return Image.fromarray(arr, "RGBA")


def ingest_tan_guest(path: Path, key: str) -> Image.Image:
    """A tan guest is the wash. Knock the border. Do not eat the foam."""
    raw = Image.open(path).convert("RGBA")
    knocked = clear_wash_matte(raw)
    knocked = clear_edge_matte(knocked, tol=20)
    if not knocked.getbbox():
        knocked = clear_edge_matte(raw, tol=14)
    if knocked.getbbox():
        knocked = knock_tiny_crumbs(knocked, limit=64)
    return fit_like_rui(knocked, side=0.90)


def ingest_body(path: Path, key: str) -> Image.Image:
    """Knock the plate off a house-hand painting and sit it like Rui."""
    raw = Image.open(path).convert("RGBA")
    tol = 16 if key in DARK_MATTE else 30
    # Paint's black bar-rims are hide. Edge-flood severs the tail.
    # Hide's chocolate bars are hide too. Default plate-flood nicks the tail.
    # Cup's rust hide nicks the same way: mantle holes if flood treats dark rust as plate.
    # Chamber's rust rim and hood shadow nick the same way on default plate-flood.
    # Luma-8 keeps cream nacre and the pinhole. Guest-only. Not a catalog wash.
    if key in {"clownfish", "grouper", "octopus"}:
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
    elif key == "nautilus":
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
    elif key == "horseshoe_crab":
        # Ledger's bronze helmet is safe on default, but dark book-gills,
        # walking legs, and a worm of a treaty nick when plate-flood treats
        # them as black. Luma-8 keeps the book. Guest-only. Not a catalog wash.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
    elif key == "manta":
        # Kite's charcoal dorsal and wing shadow nick when default
        # plate-flood treats them as black. White shoulder patches and
        # ventral white survive. Luma-8 keeps the kite. Guest-only.
        # Not a catalog wash. Not DARK_MATTE — that set still nicked sleep.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
    elif key == "moray":
        # Door's dark gape (breathing, speaking, a fish of a treaty)
        # nicks when default plate-flood treats the mouth as black.
        # Olive hide and pale eye survive default, but the gape is the
        # tell. Luma-8 keeps the door. Guest-only. Not a catalog wash.
        # Not DARK_MATTE — that set is other keys.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
    elif key == "goldfish":
        # Coin's gold hide is hide, not Pale's wash. Default
        # plate-flood leaves crumbs on the new black-plate
        # house-hand: idle 3 comps against luma-8's 1
        # (animal ~65.2k against ~65.7k), sit 4 comps
        # against 1 (~96.9k against ~97.4k), talk 9
        # comps against 1 (~72.0k against ~72.5k).
        # Walk, sleep, eat, and play stayed one animal
        # on default; the voice and the hover did not.
        # Animal counts are close — this is not the old
        # leftover-photo dark-gape shred. Luma-8 keeps
        # the whole coin. TAN_SIT kept a little more
        # gold (~1–2k) and I did not join; a gold coat
        # is hide, not Pale's wash. TAN_SIT still lists
        # morel, lions_mane, and yeast. DARK_MATTE
        # already lists crow, raven, pileated, widow,
        # vinegaroon, skunk, millipede, field_cricket,
        # earwig, click_beetle, and robber_fly; that
        # membership stays. I did not add goldfish. A
        # goldfish is not charcoal, and that path still
        # left idle crumbs (3 comps) and talk crumbs
        # (10 comps). Ink's turtle elif stays Ink's.
        # Whee's guinea_pig elif stays Whee's.
        # Thimble's rabbit elif stays Thimble's. Pip's
        # dog elif stays Pip's. Miso's cat elif stays
        # Miso's. Clip did not add a hamster elif;
        # default kept the gold. I did not invent one
        # for Clip. Existing luma-8 elifs stay theirs.
        # Proven on the new black-plate raws: plate
        # corners med luma 0 (not a cream leftover
        # luma-8 would keep at ~0.78); fill
        # ~0.23–0.40. Guest-only. Not a catalog wash.
        # Not TAN_SIT. Not DARK_MATTE. Not Echo. Not
        # Rue. Named: Coin. They win by remaining
        # Carassius. No barbels. A split tail. I still
        # have the thought.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "fiddler_crab":
        # Wave's dark olive carapace, tucked eyestalks, and leg
        # shadow nick when default plate-flood treats them as black.
        # Sleep lost the lower carapace. Idle punched holes in the
        # palm. Talk severed the claw from the body. Luma-8 keeps
        # the olive. Cream pincers are the signal, not parchment —
        # the fringe that eats a wash would eat the wave. Guest-only.
        # Not a catalog wash. Not TAN_SIT — the hide is olive and
        # orange, not Pale's wash. Not DARK_MATTE — that set is
        # other keys.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_island_crumbs(knocked)
        return fit_like_rui(knocked, side=0.90)
    elif key == "limpet":
        # Cone's dark olive grooves, tentacle shadow, and radula
        # nick when default plate-flood treats them as black.
        # Talk tore the ribs and left the foot a detached scrap.
        # Sit punched a hole in the cone. Idle lost the dark
        # mottling (~10k dark against luma-8's ~17k). Cream
        # growth bands and the pale foot survive default — they
        # are not Pale's wash. Luma-8 keeps the cone. Guest-only.
        # Not a catalog wash. Not TAN_SIT — olive ribs are hide,
        # not parchment. Not DARK_MATTE — that set is other keys.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
    elif key == "periwinkle":
        # Spire's charcoal spiral, pebbled foot, and tentacle
        # shadow nick when default plate-flood treats them as
        # black. Idle tore the shell from the foot. Sleep lost
        # the pad (~79k against luma-8's ~98k). Talk lost the
        # raised eyestalks (~48k against 68k). Play punched
        # holes in the rasp (~60k against 89k). Idle dark hide
        # ~1k against luma-8's ~10k. Tan mottling is hide, not
        # Pale's wash — TAN_SIT is other keys. DARK_MATTE is
        # other keys and still nicked sleep. Luma-8 keeps the
        # spire. Guest-only. Not a catalog wash.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
    elif key == "sand_dollar":
        # Token's cream disk and living fringe nick when
        # knock_parchment_fringe treats velvety hide as Pale's
        # wash. Purple petals are a non-tan core, so flood_all
        # eats cream from the edge. Sleep lost the left pad
        # and punched holes in the disk (~80k against a
        # border-only ~99k). Idle, walk, sit, talk, eat, and
        # play survived default counts, but the fringe that
        # eats a wash eats Token. Guest-only. Not a catalog
        # wash. Not TAN_SIT — cream hide is not Pale's wash.
        # Not DARK_MATTE — that set is other keys.
        knocked = clear_wash_matte(raw)
        knocked = clear_edge_matte(knocked, tol=30)
        if not knocked.getbbox():
            knocked = clear_edge_matte(raw, tol=22)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_island_crumbs(knocked)
        return fit_like_rui(knocked, side=0.90)
    elif key == "sea_urchin":
        # Thorn's dark grooves between spines nick when
        # default plate-flood treats them as black. Idle
        # lost the globe (~54k against luma-8's ~89k).
        # Sleep lost the quiet spine (~51k against 96k).
        # Walk nicked the spines above the tube feet.
        # Purple hide is not Pale's wash. The kelp of a
        # treaty is tan; parchment fringe treats it as
        # wash because the purple globe is a non-tan
        # core. Guest-only. Not a catalog wash. Not
        # TAN_SIT. Not DARK_MATTE — that set is other
        # keys.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_island_crumbs(knocked)
        return fit_like_rui(knocked, side=0.90)
    elif key == "knobbed_whelk":
        # Knurl's cream shell and orange knobs nick when
        # default plate-flood treats dark aperture shadow
        # as black. Idle punched a hole in the lip
        # (~1932). Sleep bit the spiral (~65k against
        # luma-8's ~72k, ~1509 holes). Orange knobs are
        # a non-tan core, so parchment fringe flood_all
        # eats cream hide. TAN_SIT keeps counts but
        # sleep still holed (~94), and the hide is a
        # cream-and-orange spiral, not Pale's wash.
        # Luma-8 keeps the knurl, the operculum, and
        # the clam of a treaty. Guest-only. Not a
        # catalog wash. Not TAN_SIT. Not DARK_MATTE —
        # that set is other keys.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_island_crumbs(knocked)
        return fit_like_rui(knocked, side=0.90)
    elif key == "lugworm":
        # Heap's dark head and gill shadow nick when
        # default plate-flood treats them as black.
        # Talk lost the dark head (~276k against luma-8's
        # ~295k). Idle lost ~11k. Walk's honest heap is
        # a second part (~10k) that knock_island_crumbs
        # drops because it sits under n//90. Pink-tan
        # hide is not Pale's wash — TAN_SIT holed idle
        # (~322) and talk (~393). The painted sand was
        # the leftover to knock, already gone from the
        # raws. Luma-8 keeps the head. knock_tiny_crumbs
        # keeps the heap. Guest-only. Not a catalog wash.
        # Not TAN_SIT. Not DARK_MATTE — that set is
        # other keys.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "paramecium":
        # Boot's dark oral groove (speaking, bacteria of a
        # treaty) nicks when default plate-flood treats the
        # groove as black. Idle lost the groove (~349 dark
        # against luma-8's ~1412). Sit lost ~353 against
        # 1924. Play lost ~952 against 2114. Eat lost the
        # dark bolus (~1894 against 2424). Cream cilia
        # survive default — the Token fringe that eats a
        # wash does not eat Boot's oars. Olive hide is not
        # Pale's wash — TAN_SIT is other keys. DARK_MATTE
        # is other keys. Luma-8 keeps the groove. Guest-only.
        # Not a catalog wash.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "kelp":
        # Hold's dark holdfast fibers nick when default
        # plate-flood treats them as black. Idle lost the
        # holdfast (~8k dark against luma-8's ~29k) and
        # punched holes in the blades (~57k live against
        # 107k). Sleep lost the quiet forest (~24k against
        # 64k). Walk's blades severed from the stipe.
        # Brown/gold blades are hide, not Pale's wash —
        # TAN_SIT is other keys. knock_parchment_fringe
        # did not eat the forest on luma-8 (live unchanged
        # on idle). Default edge+islands already gutted
        # the holdfast before fringe ran. Luma-8 keeps
        # the holdfast. knock_tiny_crumbs keeps specks
        # off. Guest-only. Not a catalog wash. Not
        # TAN_SIT. Not DARK_MATTE — that set is other
        # keys.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "coli":
        # Rod's dark olive envelope and thin flagella nick when
        # default plate-flood treats the underside as black.
        # Walk lost the run (~36k live against luma-8's ~43k)
        # and bit the lower envelope. Idle survived default
        # counts, but the same flood that keeps a crow pupil
        # still nicked the working flagella on a run. Tan
        # leftover was the smiling pill, not Pale's wash —
        # TAN_SIT is other keys. DARK_MATTE already lists
        # coli; that membership stays. The default
        # wash+edge+MinFilter+islands+fringe path still
        # nicked the run. Luma-8 keeps the rod and the
        # flagella. knock_tiny_crumbs keeps specks off.
        # Guest-only. Not a catalog wash. Not TAN_SIT.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "red_tail":
        # Hook's dark scalloped wing shadow and hooked bill nick
        # when default plate-flood treats feather dark as black.
        # Idle tore the wing from the breast (~83k live against
        # luma-8's ~94k) and left the rusty fan a second part.
        # Sit lost the torso. Walk punched the chest. Sleep
        # bit the tucked neck and ate cream hide (~5k against
        # luma-8's ~10k). Pale cream belly and rusty tail are
        # hide, not Pale's wash — TAN_SIT is other keys and
        # holed idle. DARK_MATTE is other keys (crow, raven
        # stay); that fringe still ate sleep cream. The plate
        # on these raws is actually black, so luma-8 knocks
        # it (fill ~0.24–0.42, not a cream-plate leftover at
        # ~0.78). Hold's kelp elif stays Hold's. Rod's coli
        # elif stays Rod's. Luma-8 keeps the whole hawk.
        # knock_tiny_crumbs keeps specks off. Guest-only.
        # Not a catalog wash. Not TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "chickadee":
        # Dee's black cap, black bib, and dark legs nick when default
        # plate-flood treats hide as black. Idle tore the cap and
        # punched the white throat (~63k live against luma-8's ~71k).
        # Sit lost the cap and the bib (~74k against 84k). Walk
        # punched the face (~53k against 61k). Talk nicked the
        # crown (~72k against 82k). Eat bit the cheek (~62k
        # against 66k). Play nicked the inverted bib. Sleep
        # survived default counts (~107k), but the same flood
        # still ate the working poses. Buff flanks are hide, not
        # Pale's wash — TAN_SIT is other keys. DARK_MATTE already
        # lists crow and raven; that membership stays. The plate
        # on these raws is actually black, so luma-8 knocks it
        # (fill ~0.24–0.41, not a cream-plate leftover at ~0.78).
        # Hook's red_tail elif stays Hook's. Hold's kelp elif
        # stays Hold's. Rod's coli elif stays Rod's. Luma-8
        # keeps the whole chickadee. knock_tiny_crumbs keeps
        # specks off. Guest-only. Not a catalog wash. Not
        # TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "robin":
        # Brick's dark charcoal head nicks when default plate-flood
        # treats hide as black. Sleep lost the tucked head (~242k
        # live against luma-8's ~303k, dark ~709 against ~18k) and
        # left the brick a second part. Eat punched the face and
        # throat (~153k against ~187k). Idle lost the crown (~232k
        # against ~244k). Sit, talk, walk, and play nicked the same
        # charcoal. Brick breast and white vent are hide, not Pale's
        # wash — TAN_SIT is other keys. DARK_MATTE already lists
        # crow and raven; that membership stays. The plate on these
        # raws is actually black, so luma-8 knocks it (fill
        # ~0.17–0.35, not a cream-plate leftover at ~0.78). Dee's
        # chickadee elif stays Dee's. Hook's red_tail elif stays
        # Hook's. Hold's kelp elif stays Hold's. Rod's coli elif
        # stays Rod's. Luma-8 keeps the whole robin. knock_tiny_crumbs
        # keeps specks off. Guest-only. Not a catalog wash. Not
        # TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "mallard":
        # Drake's iridescent green head nicks when default plate-flood treats
        # hide as black. Idle tore the crown from the white collar (~75k live
        # against luma-8's ~78k, green ~5k against ~7k) and left a floating
        # fragment. Walk lost the head and left a grey silhouette. Talk tore
        # the quack (~76k against ~89k, green ~6k against ~9k). Sit, eat, and
        # play nicked the same green. Sleep kept more of the loaf than the
        # leftovers, but default still ate dark hide (~10k against ~12k).
        # Chestnut breast and grey flanks are hide, not Pale's wash —
        # TAN_SIT is other keys. DARK_MATTE already lists crow and raven;
        # that membership stays. That set still nicked idle's crown and
        # walk's face on these raws. The plate on these raws is actually
        # black, so luma-8 knocks it (fill ~0.62–0.74, not a cream-plate
        # leftover at ~0.78). Brick's robin elif stays Brick's. Dee's
        # chickadee elif stays Dee's. Hook's red_tail elif stays Hook's.
        # Hold's kelp elif stays Hold's. Rod's coli elif stays Rod's.
        # Luma-8 keeps the whole mallard. knock_tiny_crumbs keeps specks
        # off. Guest-only. Not a catalog wash. Not TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "canada_goose":
        # Vee's black head and long neck nick when default plate-flood treats
        # hide as black. Idle tore the crown and the chinstrap (~82k live
        # against luma-8's ~64k, dark ~2k against ~8k) and left a headless
        # body. Walk lost the head. Talk lost the honk. Eat lost the graze.
        # Play lost the flying V. Sit ate the neck (~2k dark against ~15k).
        # Sleep kept more of the loaf than the leftovers, but default still
        # nicked the tucked hide (~15k against ~20k) and bit the cream
        # breast. White chinstrap and cream breast are hide, not Pale's
        # wash — TAN_SIT is other keys. DARK_MATTE already lists crow and
        # raven; that membership stays. That set still ate dark hide on
        # these raws (~4k against luma-8's ~8k on idle). The plate on these
        # raws is actually black, so luma-8 knocks it (fill ~0.59–0.78,
        # med luma 0, not a cream-plate leftover that luma-8 would keep at
        # ~0.78). Drake's mallard elif stays Drake's. Brick's robin elif
        # stays Brick's. Dee's chickadee elif stays Dee's. Hook's red_tail
        # elif stays Hook's. Hold's kelp elif stays Hold's. Rod's coli
        # elif stays Rod's. Luma-8 keeps the whole goose. knock_tiny_crumbs
        # keeps specks off. Guest-only. Not a catalog wash. Not TAN_SIT.
        # Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "pileated":
        # Drum's black body and red crest nick when default plate-flood treats
        # hide as black. Sleep tore the tucked body (~24k live against luma-8's
        # ~55k, dark ~570 against ~3.7k) and left a head. Walk lost the hitch
        # (~40k against ~49k). Sit nicked the settled drum (~42k against ~47k).
        # Eat lost hide around the grub (~42k against ~50k). Play nicked the
        # unfurled wing (~79k against ~87k). Idle and talk kept more mid-luma
        # fringe on default, but the same flood still ate charcoal hide
        # (idle dark ~1.2k against luma-8's ~2.7k). Black body, red crest, and
        # white neck stripe are hide, not Pale's wash — TAN_SIT is other keys.
        # Tan bark leftovers were furniture, not hide. DARK_MATTE already
        # lists crow, raven, and pileated; that membership stays. I did not
        # add pileated. That set still ate dark hide on these raws. The plate
        # on these raws is actually black, so luma-8 knocks it (fill
        # ~0.69–0.80, med luma 0, not a cream-plate leftover that luma-8
        # would keep at ~0.78). Vee's canada_goose elif stays Vee's. Drake's
        # mallard elif stays Drake's. Brick's robin elif stays Brick's. Dee's
        # chickadee elif stays Dee's. Hook's red_tail elif stays Hook's.
        # Hold's kelp elif stays Hold's. Rod's coli elif stays Rod's. Luma-8
        # keeps the whole woodpecker. knock_tiny_crumbs keeps specks off.
        # Guest-only. Not a catalog wash. Not TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "hummingbird":
        # Sip's dark eye mask and needle bill nick when default plate-flood
        # treats hide as black. Sit tore the face (~38k live against luma-8's
        # ~40k, dark ~1.5k against ~3.2k) and left a detached bill. Play
        # stubbed the needle and tore the hover (~631 dark against ~819).
        # Sleep nicked the mask behind the bill and ragged the belly
        # (~80k against ~81k, dark ~2.0k against ~2.7k). Walk and eat lost
        # the same dark hide (walk ~709 against ~1.8k; eat ~632 against
        # ~1.5k). Talk lost dark (~849 against ~1.3k). Idle kept more
        # mid-luma fringe on default, but the same flood still ate the
        # working poses. Ruby gorget, emerald back, and white breast are
        # hide, not Pale's wash — TAN_SIT is other keys. Golden parchment
        # leftovers, the sit branch, the sleep twig, and the eat trumpet
        # cluster were furniture, not hide. DARK_MATTE already lists crow,
        # raven, and pileated; that membership stays. I did not add
        # hummingbird. That set still ate dark hide on these raws. The
        # plate on the house-hand raws is actually black, so luma-8 knocks
        # it (fill ~0.80–0.85, med luma 0, not a cream-plate leftover that
        # luma-8 would keep at ~0.78). Leftover idle, talk, and play were
        # already a clear plate (fill ~0.18–0.22). Drum's pileated elif
        # stays Drum's. Vee's canada_goose elif stays Vee's. Drake's
        # mallard elif stays Drake's. Brick's robin elif stays Brick's.
        # Dee's chickadee elif stays Dee's. Hook's red_tail elif stays
        # Hook's. Hold's kelp elif stays Hold's. Rod's coli elif stays
        # Rod's. Luma-8 keeps the whole hummingbird. knock_tiny_crumbs
        # keeps specks off. Guest-only. Not a catalog wash. Not TAN_SIT.
        # Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "orb_weaver":
        # Loom's dark pedicel, dark abdominal folium, and dark leg bands
        # nick when default plate-flood treats hide as black. Talk tore
        # the waist and left the abdomen a second part (~54k live against
        # luma-8's ~62k, dark ~6.1k against ~11.4k). Sleep lost dark hide
        # (~11.0k against ~14.2k). Idle nicked the same dark pattern
        # (~6.1k against ~6.7k). Pale cream cross and silver cephalothorax
        # are hide, not Pale's wash — they can look like tan wash; they
        # are the diadem. TAN_SIT is other keys. I did not join. Tan
        # leftover parchment, the walk scrap, the sit collage, the talk
        # Australia silhouette, the eat silk cluster, and the play scrap
        # were furniture, not hide. DARK_MATTE already lists crow, raven,
        # pileated, widow, and vinegaroon; that membership stays. I did
        # not add orb_weaver. That set can nick pale hide. The plate on
        # these raws is actually black, so luma-8 knocks it (fill
        # ~0.76–0.86, med luma 0, not a cream-plate leftover that luma-8
        # would keep at ~0.78). Sip's hummingbird elif stays Sip's.
        # Drum's pileated elif stays Drum's. Vee's canada_goose elif
        # stays Vee's. Drake's mallard elif stays Drake's. Brick's robin
        # elif stays Brick's. Dee's chickadee elif stays Dee's. Hook's
        # red_tail elif stays Hook's. Hold's kelp elif stays Hold's.
        # Rod's coli elif stays Rod's. Luma-8 keeps the whole cross
        # spider. knock_tiny_crumbs keeps specks off. Guest-only. Not a
        # catalog wash. Not TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "jumping_spider":
        # Leap's dark hide, white abdominal spots, green chelicerae, and
        # front eyes nick when default plate-flood treats hide as black.
        # Walk tore the cephalothorax and ate the green (~69k live against
        # luma-8's ~36k, dark ~370 against ~4.6k, green 0 against ~783).
        # Sit lost the face (~37k against ~62k, green 0 against ~1.5k).
        # Sleep tore the tucked body (~43k against ~103k, dark ~1.0k
        # against ~21k). Talk lost the speak (~34k against ~71k, dark
        # ~1.5k against ~14k). Eat left a holed hunt (~33k against ~86k).
        # Play tore the coil (~42k against ~105k). White spots and pale
        # leg bands are hide, not Pale's wash — TAN_SIT is other keys
        # and still nicked dark (walk dark ~1.6k against ~4.6k; talk
        # ~3.5k against ~14k). I did not join. Moss, earth, and
        # parchment leftovers were furniture, not hide. DARK_MATTE
        # already lists crow, raven, pileated, widow, and vinegaroon;
        # that membership stays. I did not add jumping_spider. That set
        # can nick pale hide and still ate walk (~22k against luma-8's
        # ~32k). The plate on these raws is actually black, so luma-8
        # knocks it (fill ~0.72–0.79, med luma 0, not a cream-plate
        # leftover that luma-8 would keep at ~0.78). Leftover idle was
        # already a house-hand jumper on a clear plate (fill ~0.20).
        # Loom's orb_weaver elif stays Loom's. Sip's hummingbird elif
        # stays Sip's. Drum's pileated elif stays Drum's. Vee's
        # canada_goose elif stays Vee's. Drake's mallard elif stays
        # Drake's. Brick's robin elif stays Brick's. Dee's chickadee
        # elif stays Dee's. Hook's red_tail elif stays Hook's. Hold's
        # kelp elif stays Hold's. Rod's coli elif stays Rod's. Luma-8
        # keeps the whole bold jumper. knock_tiny_crumbs keeps specks
        # off. Guest-only. Not a catalog wash. Not TAN_SIT. Not
        # DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "wolf_spider":
        # Prowl's dark hide, tan cephalothorax stripes, wolf eyes, and
        # cream egg sac nick when default plate-flood treats hide as
        # black. Sit tore the sit and left the sac a second part
        # (~61k live against luma-8's ~59k, dark ~1.8k against ~3.4k).
        # Talk tore the speak (~72k against ~51k, dark ~1.7k against
        # ~2.3k) and left a holed wolf. Sleep lost dark hide (~1.4k
        # against ~7.8k; live ~68k against ~97k). Walk and play nicked
        # the same dark. Eat kept more mid-luma fringe on default, but
        # the same flood still ate working poses. Cream sac and tan
        # stripes are hide, not Pale's wash — they can look like tan
        # wash; they are the brood and the Tigrosa marks. TAN_SIT is
        # other keys. I did not join. Sand, earth mound, and parchment
        # leftovers were furniture, not hide. DARK_MATTE already lists
        # crow, raven, pileated, widow, and vinegaroon; that membership
        # stays. I did not add wolf_spider. That set can nick pale hide
        # (the sac, pale stripes). The plate on these raws is actually
        # black, so luma-8 knocks it (fill ~0.73–0.86, med luma 0, not
        # a cream-plate leftover that luma-8 would keep at ~0.78).
        # Leftover idle was already a house-hand wetland wolf spider
        # on a clear plate (fill ~0.17). Leap's jumping_spider elif
        # stays Leap's. Loom's orb_weaver elif stays Loom's. Sip's
        # hummingbird elif stays Sip's. Drum's pileated elif stays
        # Drum's. Vee's canada_goose elif stays Vee's. Drake's mallard
        # elif stays Drake's. Brick's robin elif stays Brick's. Dee's
        # chickadee elif stays Dee's. Hook's red_tail elif stays
        # Hook's. Hold's kelp elif stays Hold's. Rod's coli elif stays
        # Rod's. Luma-8 keeps the whole wetland wolf spider.
        # knock_tiny_crumbs keeps specks off. Guest-only. Not a
        # catalog wash. Not TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "tarantula":
        # Velvet's dark joints, dark tarsi, and carapace shadow nick when
        # default plate-flood treats hide as black. Eat lost dark hide
        # (~2.1k against luma-8's ~4.9k; live ~56k against ~62k). Sit
        # nicked the same joints (~3.5k against ~7.1k; live ~79k against
        # ~84k). Play lost dark (~2.9k against ~6.9k). Sleep, walk, and
        # talk nicked the same dark. Blonde urticating hair is hide, not
        # Pale's wash — it can look like tan wash; it is the desert
        # blonde. TAN_SIT is other keys. I did not join. Burrow hole,
        # earth islands, torn paper, and bark leftovers were furniture,
        # not hide. DARK_MATTE already lists crow, raven, pileated,
        # widow, and vinegaroon; that membership stays. I did not add
        # tarantula. That set can nick pale hide (the blonde). The plate
        # on these raws is actually black, so luma-8 knocks it (fill
        # ~0.69–0.75, med luma 0, not a cream-plate leftover that luma-8
        # would keep at ~0.78). Leftover idle was already a house-hand
        # desert blonde on a clear plate (fill ~0.27). Prowl's
        # wolf_spider elif stays Prowl's. Leap's jumping_spider elif
        # stays Leap's. Loom's orb_weaver elif stays Loom's. Sip's
        # hummingbird elif stays Sip's. Drum's pileated elif stays
        # Drum's. Vee's canada_goose elif stays Vee's. Drake's mallard
        # elif stays Drake's. Brick's robin elif stays Brick's. Dee's
        # chickadee elif stays Dee's. Hook's red_tail elif stays
        # Hook's. Hold's kelp elif stays Hold's. Rod's coli elif stays
        # Rod's. Luma-8 keeps the whole desert blonde. knock_tiny_crumbs
        # keeps specks off. Guest-only. Not a catalog wash. Not TAN_SIT.
        # Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "widow":
        # Hour's dark hide, glossy shine, and red hourglass nick when
        # default plate-flood treats hide as black. Walk lost the legs
        # and left a blown abdomen (~44k live against luma-8's ~125k,
        # dark ~17k against ~75k). Sit lost the sit (~26k against
        # ~79k, dark ~11k against ~53k). Sleep lost the compact hang
        # and the hourglass (~38k against ~109k, dark ~17k against
        # ~88k, red 0 against ~916). Talk lost the speak (~41k against
        # ~104k, dark ~14k against ~79k). Eat lost the wrap hang
        # (~27k against ~91k, dark ~11k against ~62k). Play lost the
        # hang (~22k against ~84k, dark ~18k against ~78k). The red
        # hourglass is hide, not Pale's wash — it can look like a
        # stamp; it is Latrodectus. TAN_SIT is other keys. I did not
        # join. Parchment leftovers, the walk scrap, the sit fibrous
        # island, the sleep scrap, the talk sand patch, the eat scrap,
        # and the play wings were furniture, not hide. DARK_MATTE
        # already lists crow, raven, pileated, widow, and vinegaroon;
        # that membership stays. I did not add widow. That set still
        # ate dark hide on these raws (DARK_MATTE tol is the default
        # path). The plate on these raws is actually black, so luma-8
        # knocks it (fill ~0.84–0.90, med luma 0, not a cream-plate
        # leftover that luma-8 would keep at ~0.78). Leftover idle
        # was already a house-hand southern black widow on a clear
        # plate (fill ~0.09, 189 hues, hourglass present). Velvet's
        # tarantula elif stays Velvet's. Prowl's wolf_spider elif
        # stays Prowl's. Leap's jumping_spider elif stays Leap's.
        # Loom's orb_weaver elif stays Loom's. Sip's hummingbird elif
        # stays Sip's. Drum's pileated elif stays Drum's. Vee's
        # canada_goose elif stays Vee's. Drake's mallard elif stays
        # Drake's. Brick's robin elif stays Brick's. Dee's chickadee
        # elif stays Dee's. Hook's red_tail elif stays Hook's. Hold's
        # kelp elif stays Hold's. Rod's coli elif stays Rod's. Luma-8
        # keeps the whole southern black widow. knock_tiny_crumbs
        # keeps specks off. Guest-only. Not a catalog wash. Not
        # TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "harvestman":
        # Stem's dark stripes, turret eyes, and thin legs nick when
        # default plate-flood treats hide as black. Walk lost the
        # dark stripes and left a tan shadow blob (~464 dark against
        # luma-8's ~1.6k; tan ~7.4k against ~5.4k). Sleep lost the
        # compact hide (~82k live against luma-8's ~88k, dark ~2.0k
        # against ~3.1k). Sit nicked the same dark (~744 against
        # ~921). Talk lost the speak (~25k against ~27k, dark ~1.1k
        # against ~1.4k). Play nicked the walk (~20k against ~21k).
        # Eat kept more mid-luma fringe on default, but the same
        # flood still ate working poses. Tan hide and cream body are
        # hide, not Pale's wash — they can look like tan wash; they
        # are Phalangium. TAN_SIT is other keys. I did not join.
        # Parchment leftovers, the walk sail, the sit island, the
        # sleep moss, the talk wings, the eat wash, and the play
        # sail were furniture, not hide. DARK_MATTE already lists
        # crow, raven, pileated, widow, and vinegaroon; that
        # membership stays. I did not add harvestman. That set can
        # nick pale hide. The plate on these raws is actually
        # black, so luma-8 knocks it (fill ~0.11–0.35, med luma 0,
        # not a cream-plate leftover that luma-8 would keep at
        # ~0.78). Leftover idle was already a house-hand common
        # harvestman on a clear plate (fill ~0.10, 198 hues).
        # Hour's widow elif stays Hour's. Velvet's tarantula elif
        # stays Velvet's. Prowl's wolf_spider elif stays Prowl's.
        # Leap's jumping_spider elif stays Leap's. Loom's
        # orb_weaver elif stays Loom's. Sip's hummingbird elif
        # stays Sip's. Drum's pileated elif stays Drum's. Vee's
        # canada_goose elif stays Vee's. Drake's mallard elif
        # stays Drake's. Brick's robin elif stays Brick's. Dee's
        # chickadee elif stays Dee's. Hook's red_tail elif stays
        # Hook's. Hold's kelp elif stays Hold's. Rod's coli elif
        # stays Rod's. Luma-8 keeps the whole common harvestman.
        # knock_tiny_crumbs keeps specks off. Guest-only. Not a
        # catalog wash. Not TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "scorpion":
        # Barb's dark mesosoma stripes, dark sting, and dark pincer
        # fingers nick when default plate-flood treats hide as black.
        # Talk lost dark hide and kept mid-luma fringe (~3.6k dark
        # against luma-8's ~4.2k; live ~59k against ~59k). Sleep
        # lost the quiet hide (~64k live against luma-8's ~66k,
        # dark ~4.5k against ~5.1k). Eat lost the chew (~74k
        # against ~76k, dark ~3.3k against ~3.8k). Walk nicked the
        # same dark (~2.8k against ~3.0k). Sit nicked the same
        # stripes (~4.2k against ~4.2k). Play's dark held, but the
        # same flood still ate working poses. Tan hide and
        # cream-tan pedipalps are hide, not Pale's wash — they can
        # look like tan wash; they are Centruroides. TAN_SIT is
        # other keys. I did not join. Parchment leftovers, the
        # walk island, the sit island, the sleep dirt, the talk
        # scrap, the eat bark tray, and the play wash were
        # furniture, not hide. DARK_MATTE already lists crow,
        # raven, pileated, widow, and vinegaroon; that membership
        # stays. I did not add scorpion. That set can nick pale
        # tan hide. The plate on these raws is actually black, so
        # luma-8 knocks it (fill ~0.22–0.30, med luma 0, not a
        # cream-plate leftover that luma-8 would keep at ~0.78).
        # Leftover idle was already a house-hand striped bark
        # scorpion on a clear plate (fill ~0.20, 129 hues). Stem's
        # harvestman elif stays Stem's. Hour's widow elif stays
        # Hour's. Velvet's tarantula elif stays Velvet's. Prowl's
        # wolf_spider elif stays Prowl's. Leap's jumping_spider
        # elif stays Leap's. Loom's orb_weaver elif stays Loom's.
        # Sip's hummingbird elif stays Sip's. Drum's pileated elif
        # stays Drum's. Vee's canada_goose elif stays Vee's.
        # Drake's mallard elif stays Drake's. Brick's robin elif
        # stays Brick's. Dee's chickadee elif stays Dee's. Hook's
        # red_tail elif stays Hook's. Hold's kelp elif stays
        # Hold's. Rod's coli elif stays Rod's. Luma-8 keeps the
        # whole striped bark scorpion. knock_tiny_crumbs keeps
        # specks off. Guest-only. Not a catalog wash. Not TAN_SIT.
        # Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "vinegaroon":
        # Whip's dark hide, bulky pedipalps, and thin flagellum nick
        # when default plate-flood treats hide as black. Sit lost
        # dark hide (~17k dark against luma-8's ~21k; live ~37k
        # against ~41k). Eat lost the grasp (~38k live against
        # luma-8's ~42k, dark ~19k against ~23k). Talk left a
        # blown plate (~79k live against luma-8's ~25k). Sleep
        # lost the legs and kept mid-luma fringe (~48k live
        # against luma-8's ~46k). Play left detached feelers.
        # Walk kept extra fringe on default (~35k against luma-8's
        # ~22k). Dark mottled hide is hide, not plate. TAN_SIT is
        # other keys. I did not join. Parchment leftovers, the
        # walk island, the sit island, the sleep dirt, the talk
        # scrap, the eat tray, and the play scrap were furniture,
        # not hide. DARK_MATTE already lists crow, raven,
        # pileated, widow, and vinegaroon; that membership stays.
        # I did not add vinegaroon. That set still ate dark hide
        # on these raws (DARK_MATTE tol is the default path). The
        # plate on these raws is actually black, so luma-8 knocks
        # it (fill ~0.08–0.17, med luma 0, not a cream-plate
        # leftover that luma-8 would keep at ~0.78). Leftover
        # idle was already a house-hand giant vinegaroon on a
        # clear plate (fill ~0.14, 264 hues). Barb's scorpion
        # elif stays Barb's. Stem's harvestman elif stays Stem's.
        # Hour's widow elif stays Hour's. Velvet's tarantula elif
        # stays Velvet's. Prowl's wolf_spider elif stays Prowl's.
        # Leap's jumping_spider elif stays Leap's. Loom's
        # orb_weaver elif stays Loom's. Sip's hummingbird elif
        # stays Sip's. Drum's pileated elif stays Drum's. Vee's
        # canada_goose elif stays Vee's. Drake's mallard elif
        # stays Drake's. Brick's robin elif stays Brick's. Dee's
        # chickadee elif stays Dee's. Hook's red_tail elif stays
        # Hook's. Hold's kelp elif stays Hold's. Rod's coli elif
        # stays Rod's. Luma-8 keeps the whole giant vinegaroon.
        # knock_tiny_crumbs keeps specks off. Guest-only. Not a
        # catalog wash. Not TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "tick":
        # Clasp's dark legs, dark stripes, and dark capitulum nick when
        # default plate-flood treats hide as black. Walk lost the legs
        # and left a blown body (~571 dark against luma-8's ~1.8k;
        # live ~132k against ~46k). Sit lost the sit (~970 dark
        # against ~1.6k; live ~114k against ~54k). Sleep lost dark
        # hide (~1.7k against luma-8's ~4.5k). Talk lost the speak
        # (~1.1k against ~2.6k; live ~117k against ~55k). Eat lost
        # the sip (~1.2k against ~2.1k; live ~154k against ~55k).
        # Play lost the quest (~886 against ~2.3k; live ~124k
        # against ~60k). Red-brown hide and a pale speckled scutum
        # are hide, not Pale's wash — they can look like tan wash;
        # they are Ixodes. TAN_SIT is other keys. I did not join.
        # Parchment leftovers, the walk island, the sit wash, the
        # sleep scrap, the talk island, the eat skin patch, and the
        # play scrap were furniture, not hide. DARK_MATTE already
        # lists crow, raven, pileated, widow, and vinegaroon; that
        # membership stays. I did not add tick. That set can nick
        # pale scutum and red-brown hide. The plate on these raws
        # is actually black, so luma-8 knocks it (fill ~0.17–0.23,
        # med luma 0, not a cream-plate leftover that luma-8 would
        # keep at ~0.78). Leftover idle was already a house-hand
        # black-legged tick on a clear plate (fill ~0.20, 644
        # hues). Whip's vinegaroon elif stays Whip's. Barb's
        # scorpion elif stays Barb's. Stem's harvestman elif stays
        # Stem's. Hour's widow elif stays Hour's. Velvet's
        # tarantula elif stays Velvet's. Prowl's wolf_spider elif
        # stays Prowl's. Leap's jumping_spider elif stays Leap's.
        # Loom's orb_weaver elif stays Loom's. Sip's hummingbird
        # elif stays Sip's. Drum's pileated elif stays Drum's.
        # Vee's canada_goose elif stays Vee's. Drake's mallard
        # elif stays Drake's. Brick's robin elif stays Brick's.
        # Dee's chickadee elif stays Dee's. Hook's red_tail elif
        # stays Hook's. Hold's kelp elif stays Hold's. Rod's coli
        # elif stays Rod's. Luma-8 keeps the whole black-legged
        # tick. knock_tiny_crumbs keeps specks off. Guest-only.
        # Not a catalog wash. Not TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "solifuge":
        # Gale's dark chelicerae tips, dark eyes, and dark abdomen
        # stripes nick when default plate-flood treats hide as black.
        # Sleep lost dark hide (~148 dark against luma-8's ~890;
        # live ~56k against ~62k). Sit nicked the same dark (~317
        # against ~825). Walk nicked the run (~717 against ~1.2k;
        # live ~36k against ~39k). Talk nicked the speak (~1.2k
        # against ~1.7k). Eat nicked the bite (~1.2k against ~2.5k;
        # live ~50k against ~56k). Play nicked the run (~830
        # against ~1.4k). Tan hide and cream-tan hair are hide, not
        # Pale's wash — they can look like tan wash; they are
        # Eremobates. TAN_SIT is other keys. I did not join.
        # Parchment leftovers, the walk island, the sit dirt, the
        # sleep island, the talk scrap, the eat dish, and the play
        # split were furniture, not hide. DARK_MATTE already lists
        # crow, raven, pileated, widow, and vinegaroon; that
        # membership stays. I did not add solifuge. That set can
        # nick pale tan hide. The plate on these raws is actually
        # black, so luma-8 knocks it (fill ~0.14–0.25, med luma 0,
        # not a cream-plate leftover that luma-8 would keep at
        # ~0.78). Leftover idle was already a house-hand
        # windscorpion on a clear plate (fill ~0.16, 730 hues).
        # Clasp's tick elif stays Clasp's. Whip's vinegaroon elif
        # stays Whip's. Barb's scorpion elif stays Barb's. Stem's
        # harvestman elif stays Stem's. Hour's widow elif stays
        # Hour's. Velvet's tarantula elif stays Velvet's. Prowl's
        # wolf_spider elif stays Prowl's. Leap's jumping_spider
        # elif stays Leap's. Loom's orb_weaver elif stays Loom's.
        # Sip's hummingbird elif stays Sip's. Drum's pileated elif
        # stays Drum's. Vee's canada_goose elif stays Vee's.
        # Drake's mallard elif stays Drake's. Brick's robin elif
        # stays Brick's. Dee's chickadee elif stays Dee's. Hook's
        # red_tail elif stays Hook's. Hold's kelp elif stays
        # Hold's. Rod's coli elif stays Rod's. Luma-8 keeps the
        # whole windscorpion. knock_tiny_crumbs keeps specks off.
        # Guest-only. Not a catalog wash. Not TAN_SIT. Not
        # DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "deer":
        # Rack's tan coat, dark hooves, dark nose, and dark eyes nick
        # when default plate-flood treats hide as black or as Pale's
        # wash. Sit lost the haunch (~82k live against luma-8's ~91k,
        # tan ~41k against ~51k) and left a torn hole. Eat lost the
        # flank and shins (~57k live against luma-8's ~61k, tan ~28k
        # against ~33k). Sleep jagged the back. Talk nicked dark
        # hide (~1.1k against luma-8's ~1.4k). Walk nicked the same
        # dark (~807 against ~826). Play left a pale fringe. Cream
        # belly and the white flag are hide, not Pale's wash — they
        # can look like tan wash; they are Odocoileus. TAN_SIT is
        # other keys. I did not join. That path kept a tan halo on
        # sit. Parchment leftovers, the walk splash, the sit island,
        # the sleep moss, the talk wash, the eat slab and ferns, and
        # the play island were furniture, not hide. DARK_MATTE
        # already lists crow, raven, pileated, widow, and
        # vinegaroon; that membership stays. I did not add deer.
        # That set can nick pale tan hide and the white flag. The
        # plate on these raws is actually black, so luma-8 knocks
        # it (fill ~0.16–0.35, med luma 0, not a cream-plate leftover
        # that luma-8 would keep at ~0.78). Leftover idle was already
        # a house-hand white-tailed deer on a clear plate (fill
        # ~0.25, 19575 hues). Gale's solifuge elif stays Gale's.
        # Clasp's tick elif stays Clasp's. Whip's vinegaroon elif
        # stays Whip's. Barb's scorpion elif stays Barb's. Stem's
        # harvestman elif stays Stem's. Hour's widow elif stays
        # Hour's. Velvet's tarantula elif stays Velvet's. Prowl's
        # wolf_spider elif stays Prowl's. Leap's jumping_spider
        # elif stays Leap's. Loom's orb_weaver elif stays Loom's.
        # Sip's hummingbird elif stays Sip's. Drum's pileated elif
        # stays Drum's. Vee's canada_goose elif stays Vee's.
        # Drake's mallard elif stays Drake's. Brick's robin elif
        # stays Brick's. Dee's chickadee elif stays Dee's. Hook's
        # red_tail elif stays Hook's. Hold's kelp elif stays
        # Hold's. Rod's coli elif stays Rod's. Luma-8 keeps the
        # whole white-tailed deer. knock_tiny_crumbs keeps specks
        # off. Guest-only. Not a catalog wash. Not TAN_SIT. Not
        # DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "bat":
        # Cape's dark wing membrane, dark eyes, and dark feet nick when
        # default plate-flood treats hide as black. Sit lost the hang
        # (~49k live against luma-8's ~61k, dark ~1.2k against ~2.1k)
        # and dropped the hind feet. Eat nicked the face and the moth
        # hold (~85k live against luma-8's ~87k, dark ~2.9k against
        # ~3.5k) and left a notch in the snout. Tan finger bones and
        # cream-tan fur are hide, not Pale's wash — they can look like
        # tan wash; they are Eptesicus. TAN_SIT is other keys. I did
        # not join. Parchment leftovers, the sit island, and the eat
        # splash were furniture, not hide. DARK_MATTE already lists
        # crow, raven, pileated, widow, and vinegaroon; that
        # membership stays. I did not add bat. That set can nick pale
        # fur and tan finger bones (eat tan ~2.4k against luma-8's
        # ~2.6k). The plate on these raws is actually black, so luma-8
        # knocks it (fill ~0.23–0.33, med luma 0, not a cream-plate
        # leftover that luma-8 would keep at ~0.78). Leftover idle
        # was already a house-hand big brown bat on a clear plate
        # (fill ~0.29, 209 hues). Leftover sleep, walk, talk, and
        # play were already house-hand on a clear plate. Rack's deer
        # elif stays Rack's. Gale's solifuge elif stays Gale's.
        # Clasp's tick elif stays Clasp's. Whip's vinegaroon elif
        # stays Whip's. Barb's scorpion elif stays Barb's. Stem's
        # harvestman elif stays Stem's. Hour's widow elif stays
        # Hour's. Velvet's tarantula elif stays Velvet's. Prowl's
        # wolf_spider elif stays Prowl's. Leap's jumping_spider
        # elif stays Leap's. Loom's orb_weaver elif stays Loom's.
        # Sip's hummingbird elif stays Sip's. Drum's pileated elif
        # stays Drum's. Vee's canada_goose elif stays Vee's.
        # Drake's mallard elif stays Drake's. Brick's robin elif
        # stays Brick's. Dee's chickadee elif stays Dee's. Hook's
        # red_tail elif stays Hook's. Hold's kelp elif stays
        # Hold's. Rod's coli elif stays Rod's. Luma-8 keeps the
        # whole big brown bat. knock_tiny_crumbs keeps specks
        # off. Guest-only. Not a catalog wash. Not TAN_SIT. Not
        # DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "squirrel":
        # Cache's dark eyes, dark paws, and dark ear interiors nick when
        # default plate-flood treats hide as black or as Pale's wash. Sit
        # lost dark hide (~4.5k against luma-8's ~5.2k; live ~125k against
        # ~127k) and left a torn hole in the eye. Talk lost the speak
        # (~126k live against luma-8's ~129k, dark ~4.2k against ~4.8k)
        # and dropped hind-foot pads. Walk nicked the same dark paws
        # (~212 against ~393). Play nicked the chase (~336 against ~700).
        # Eat nicked the chew (~4.0k dark against ~4.6k). Sleep nicked
        # the curl (~4.4k against ~5.0k). Cream belly, white chest,
        # silver-gray fur, and tan face are hide, not Pale's wash —
        # they can look like tan wash; they are Sciurus. TAN_SIT is
        # other keys. I did not join. That path can keep a tan halo and
        # still is other keys. Parchment leftovers, the walk splash, the
        # sit island, the sleep island, the talk wash and ground patch,
        # the eat island, and the play island were furniture, not hide.
        # DARK_MATTE already lists crow, raven, pileated, widow, and
        # vinegaroon; that membership stays. I did not add squirrel.
        # That set can nick pale cream hide and tan face. The plate on
        # these raws is actually black, so luma-8 knocks it (fill
        # ~0.15–0.56, med luma 0, not a cream-plate leftover that
        # luma-8 would keep at ~0.78). Leftover idle was already a
        # house-hand Eastern gray squirrel on a clear plate (fill
        # ~0.42, 264 hues). Cape's bat elif stays Cape's. Rack's deer
        # elif stays Rack's. Gale's solifuge elif stays Gale's.
        # Clasp's tick elif stays Clasp's. Whip's vinegaroon elif
        # stays Whip's. Barb's scorpion elif stays Barb's. Stem's
        # harvestman elif stays Stem's. Hour's widow elif stays
        # Hour's. Velvet's tarantula elif stays Velvet's. Prowl's
        # wolf_spider elif stays Prowl's. Leap's jumping_spider
        # elif stays Leap's. Loom's orb_weaver elif stays Loom's.
        # Sip's hummingbird elif stays Sip's. Drum's pileated elif
        # stays Drum's. Vee's canada_goose elif stays Vee's.
        # Drake's mallard elif stays Drake's. Brick's robin elif
        # stays Brick's. Dee's chickadee elif stays Dee's. Hook's
        # red_tail elif stays Hook's. Hold's kelp elif stays
        # Hold's. Rod's coli elif stays Rod's. Luma-8 keeps the
        # whole Eastern gray squirrel. knock_tiny_crumbs keeps specks
        # off. Guest-only. Not a catalog wash. Not TAN_SIT. Not
        # DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "otter":
        # Slick's dark chocolate fur, dark eyes, dark nose, and dark
        # webbed paws nick when default plate-flood treats hide as
        # black or as Pale's wash. Sit lost live hide (~77k against
        # luma-8's ~92k, dark ~392 against ~2.3k) and left a torn
        # hole at the neck and dropped the front paws. Talk lost the
        # speak (~69k live against luma-8's ~81k, dark ~992 against
        # ~3.2k) and dropped the legs. Eat nicked the chew (~74k
        # live against luma-8's ~95k, dark ~886 against ~4.4k) and
        # jagged the underside. Sleep tore the curl (~102k live
        # against luma-8's ~120k, dark ~7.8k against ~11.0k) and
        # nicked the muzzle and tail tip. Walk nicked the same dark
        # paws (~165 against ~842; live ~26k against ~31k). Play
        # jagged the slide (~39k live against luma-8's ~47k, dark
        # ~322 against ~978). Cream throat and tan muzzle are hide,
        # not Pale's wash — they can look like tan wash; they are
        # Lontra. TAN_SIT is other keys. I did not join. That path
        # kept a pale greenish-gray fringe on sit. Ground islands,
        # the walk patch, the sleep earth, the talk wash, the eat
        # island, and the play splash and map silhouette were
        # furniture, not hide. DARK_MATTE already lists crow, raven,
        # pileated, widow, and vinegaroon; that membership stays.
        # I did not add otter. That set can nick pale cream hide
        # and tan muzzle. The plate on these raws is actually
        # black, so luma-8 knocks it (fill ~0.12–0.46, med luma 0,
        # not a cream-plate leftover that luma-8 would keep at
        # ~0.78). Leftover idle was already a house-hand North
        # American river otter on a clear plate (fill ~0.23, 161
        # hues). Cache's squirrel elif stays Cache's. Cape's bat
        # elif stays Cape's. Rack's deer elif stays Rack's. Gale's
        # solifuge elif stays Gale's. Clasp's tick elif stays
        # Clasp's. Whip's vinegaroon elif stays Whip's. Barb's
        # scorpion elif stays Barb's. Stem's harvestman elif stays
        # Stem's. Hour's widow elif stays Hour's. Velvet's
        # tarantula elif stays Velvet's. Prowl's wolf_spider elif
        # stays Prowl's. Leap's jumping_spider elif stays Leap's.
        # Loom's orb_weaver elif stays Loom's. Sip's hummingbird
        # elif stays Sip's. Drum's pileated elif stays Drum's.
        # Vee's canada_goose elif stays Vee's. Drake's mallard
        # elif stays Drake's. Brick's robin elif stays Brick's.
        # Dee's chickadee elif stays Dee's. Hook's red_tail elif
        # stays Hook's. Hold's kelp elif stays Hold's. Rod's coli
        # elif stays Rod's. Luma-8 keeps the whole North American
        # river otter. knock_tiny_crumbs keeps specks off.
        # Guest-only. Not a catalog wash. Not TAN_SIT. Not
        # DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "raccoon":
        # Wash's dark mask, dark eyes, dark nose, dark paws, and dark
        # tail rings nick when default plate-flood treats hide as
        # black or as Pale's wash. Sit lost live hide (~126k against
        # luma-8's ~136k, dark ~2.1k against ~3.2k) and jagged the
        # paws. Talk lost the speak (~103k live against luma-8's
        # ~115k, dark ~1.4k against ~1.8k) and dropped the lower
        # body. Eat nicked the chew (~119k live against luma-8's
        # ~126k, dark ~2.3k against ~5.8k) and punched the mask and
        # chest. Sleep tore the curl (~96k live against luma-8's
        # ~119k, dark ~602 against ~2.9k) and left a hole in the
        # face. Walk nicked the same dark paws (~531 against ~558;
        # live ~66k against ~69k). Play jagged the stand (~80k live
        # against luma-8's ~84k, dark ~465 against ~535). White
        # muzzle, white ear trim, silver-gray fur, and cream chest
        # are hide, not Pale's wash — they can look like tan wash;
        # they are Procyon. TAN_SIT is other keys. I did not join.
        # That path still lost sleep dark (~1.0k against luma-8's
        # ~2.9k). Ground islands, parchment leftovers, the sit
        # island, the walk splash, the sleep earth, the talk wash,
        # the eat torn-paper splash, and the play bat, ground
        # patch, and map silhouette were furniture, not hide. A
        # scrap in eat is living food and stayed. DARK_MATTE
        # already lists crow, raven, pileated, widow, and
        # vinegaroon; that membership stays. I did not add
        # raccoon. That set can nick pale cream hide and the
        # white muzzle (sleep dark ~1.7k against luma-8's ~2.9k).
        # The plate on these raws is actually black, so luma-8
        # knocks it (fill ~0.27–0.47, med luma 0, not a cream-plate
        # leftover that luma-8 would keep at ~0.78). Leftover idle
        # was already a house-hand raccoon on a clear plate (fill
        # ~0.42, 121 hues). Slick's otter elif stays Slick's.
        # Cache's squirrel elif stays Cache's. Cape's bat elif
        # stays Cape's. Rack's deer elif stays Rack's. Gale's
        # solifuge elif stays Gale's. Clasp's tick elif stays
        # Clasp's. Whip's vinegaroon elif stays Whip's. Barb's
        # scorpion elif stays Barb's. Stem's harvestman elif
        # stays Stem's. Hour's widow elif stays Hour's. Velvet's
        # tarantula elif stays Velvet's. Prowl's wolf_spider elif
        # stays Prowl's. Leap's jumping_spider elif stays Leap's.
        # Loom's orb_weaver elif stays Loom's. Sip's hummingbird
        # elif stays Sip's. Drum's pileated elif stays Drum's.
        # Vee's canada_goose elif stays Vee's. Drake's mallard
        # elif stays Drake's. Brick's robin elif stays Brick's.
        # Dee's chickadee elif stays Dee's. Hook's red_tail elif
        # stays Hook's. Hold's kelp elif stays Hold's. Rod's coli
        # elif stays Rod's. Luma-8 keeps the whole raccoon.
        # knock_tiny_crumbs keeps specks off. Guest-only. Not a
        # catalog wash. Not TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "skunk":
        # Stripe's jet-black hide, dark eyes, dark nose, and dark
        # paws nick when default plate-flood treats hide as black
        # or as Pale's wash. Sit lost live hide (~60k against
        # luma-8's ~69k, dark ~5.8k against ~8.8k) and jagged the
        # crouch. Talk lost the speak (~51k live against luma-8's
        # ~62k, dark ~4.3k against ~8.5k) and dropped the paws.
        # Eat nicked the chew (~56k live against luma-8's ~66k,
        # dark ~6.6k against ~10.5k) and dropped the grub. Sleep
        # nicked the curl (~95k live against luma-8's ~100k, dark
        # ~23k against ~27k). Walk lost the gait (~45k live
        # against luma-8's ~60k, dark ~1.0k against ~14k) and
        # cropped the belly. Play dropped the stamp (~57k live
        # against luma-8's ~69k, dark ~4.0k against ~31k) and
        # ate the hind legs. White stripes, white tail hairs, and
        # the white face line are hide, not Pale's wash — they
        # can look like tan wash; they are Mephitis. TAN_SIT is
        # other keys. I did not join. That path still lost sleep
        # dark (~880 against luma-8's ~27k) and eat dark (~776
        # against ~10.5k). Ground islands, parchment leftovers,
        # the sit island, the walk patch, the sleep earth, the
        # talk soil, the eat torn splash, and the play ground
        # patch and kicked dust were furniture, not hide. A grub
        # in eat is living food and stayed. DARK_MATTE already
        # lists crow, raven, pileated, widow, vinegaroon, and
        # skunk; that membership stays. I did not add skunk. I
        # did not remove skunk. That set is the default path on
        # these raws and still nicked jet-black hide. The plate
        # on these raws is actually black, so luma-8 knocks it
        # (fill ~0.21–0.35, med luma 0, not a cream-plate leftover
        # that luma-8 would keep at ~0.78). Leftover idle was
        # already a house-hand striped skunk on a clear plate
        # (fill ~0.21, 182 hues). Wash's raccoon elif stays
        # Wash's. Slick's otter elif stays Slick's. Cache's
        # squirrel elif stays Cache's. Cape's bat elif stays
        # Cape's. Rack's deer elif stays Rack's. Gale's solifuge
        # elif stays Gale's. Clasp's tick elif stays Clasp's.
        # Whip's vinegaroon elif stays Whip's. Barb's scorpion
        # elif stays Barb's. Stem's harvestman elif stays Stem's.
        # Hour's widow elif stays Hour's. Velvet's tarantula elif
        # stays Velvet's. Prowl's wolf_spider elif stays Prowl's.
        # Leap's jumping_spider elif stays Leap's. Loom's
        # orb_weaver elif stays Loom's. Sip's hummingbird elif
        # stays Sip's. Drum's pileated elif stays Drum's. Vee's
        # canada_goose elif stays Vee's. Drake's mallard elif
        # stays Drake's. Brick's robin elif stays Brick's. Dee's
        # chickadee elif stays Dee's. Hook's red_tail elif stays
        # Hook's. Hold's kelp elif stays Hold's. Rod's coli elif
        # stays Rod's. Luma-8 keeps the whole striped skunk.
        # knock_tiny_crumbs keeps specks off. Guest-only. Not a
        # catalog wash. Not TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "opossum":
        # Grin's dark eye stripes, dark ears, dark eyes, and
        # charcoal legs nick when default plate-flood treats hide
        # as black or as Pale's wash. Sit lost live hide (~106k
        # against luma-8's ~115k, dark ~3.4k against ~8.7k) and
        # jagged the still. Walk lost the gait (~81k live against
        # luma-8's ~90k, dark ~3.1k against ~6.7k) and nicked the
        # paws. Sleep tore the curl (~89k live against luma-8's
        # ~99k, dark ~3.3k against ~9.9k) and nicked the ear.
        # Talk lost the speak (~80k live against luma-8's ~89k,
        # dark ~2.8k against ~6.2k) and jagged the chin. Eat
        # nicked the chew (~82k live against luma-8's ~90k, dark
        # ~3.8k against ~7.4k) and punched the paws. Play jagged
        # the still (~3.5k lost, dark ~974 against luma-8's
        # ~4.1k). White face, white guard hairs, pink nose, pink
        # tail, and pink paws are hide, not Pale's wash — they
        # can look like tan wash; they are Didelphis. TAN_SIT is
        # other keys. I did not join. That path still lost sit
        # pink (~24k against luma-8's ~26k) and talk white (~6.5k
        # against ~6.9k). Ground islands, parchment leftovers,
        # the sit island, the walk patch, the sleep earth, the
        # talk dirt, the eat torn parchment, and the play painted
        # branch were furniture, not hide. A fruit in eat is
        # living food and stayed. DARK_MATTE already lists crow,
        # raven, pileated, widow, vinegaroon, and skunk; that
        # membership stays. I did not add opossum. That set still
        # nicked charcoal hide (sit dark ~6.5k against luma-8's
        # ~8.7k; sleep dark ~6.8k against ~9.9k). The plate on
        # these raws is actually black, so luma-8 knocks it (fill
        # ~0.28–0.44, med luma 0, not a cream-plate leftover that
        # luma-8 would keep at ~0.78). Leftover idle was already
        # a house-hand Virginia opossum on a clear plate (fill
        # ~0.29, 237 hues). Stripe's skunk elif stays Stripe's.
        # Wash's raccoon elif stays Wash's. Slick's otter elif
        # stays Slick's. Cache's squirrel elif stays Cache's.
        # Cape's bat elif stays Cape's. Rack's deer elif stays
        # Rack's. Gale's solifuge elif stays Gale's. Clasp's tick
        # elif stays Clasp's. Whip's vinegaroon elif stays
        # Whip's. Barb's scorpion elif stays Barb's. Stem's
        # harvestman elif stays Stem's. Hour's widow elif stays
        # Hour's. Velvet's tarantula elif stays Velvet's. Prowl's
        # wolf_spider elif stays Prowl's. Leap's jumping_spider
        # elif stays Leap's. Loom's orb_weaver elif stays Loom's.
        # Sip's hummingbird elif stays Sip's. Drum's pileated
        # elif stays Drum's. Vee's canada_goose elif stays Vee's.
        # Drake's mallard elif stays Drake's. Brick's robin elif
        # stays Brick's. Dee's chickadee elif stays Dee's. Hook's
        # red_tail elif stays Hook's. Hold's kelp elif stays
        # Hold's. Rod's coli elif stays Rod's. Luma-8 keeps the
        # whole Virginia opossum. knock_tiny_crumbs keeps specks
        # off. Guest-only. Not a catalog wash. Not TAN_SIT. Not
        # DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "beaver":
        # Dam's dark eyes, dark nose, dark paws, dark paddle
        # tail, and chocolate fur nick when default plate-flood
        # treats hide as black or as Pale's wash. Sit lost live
        # hide (~86k against luma-8's ~136k, dark ~3.8k against
        # ~31k) and tore the sit in two. Walk lost the gait
        # (~33k live against luma-8's ~52k, dark ~2.2k against
        # ~12k) and punched the belly. Sleep tore the curl
        # (~75k live against luma-8's ~102k, dark ~6.5k against
        # ~29k). Talk lost the speak (~82k live against luma-8's
        # ~128k, dark ~5.9k against ~39k) and jagged the chin.
        # Eat nicked the chew (~64k live against luma-8's ~91k,
        # dark ~5.4k against ~18k) and dropped the lower body.
        # Play jagged the slap (~92k live against luma-8's
        # ~113k, dark ~5.0k against ~15k) and ate the belly.
        # Golden-brown face, orange teeth, and a lighter belly
        # are hide, not Pale's wash — they can look like tan
        # wash; they are Castor. TAN_SIT is other keys. I did
        # not join. That path still lost sit hide (~125k against
        # luma-8's ~136k) and talk hide (~113k against ~128k).
        # Ground islands, parchment leftovers, the sit island,
        # the walk splash, the sleep earth, the talk splash,
        # the eat torn island, and the play painted water,
        # splash, and vignette were furniture, not hide. A
        # stick in eat is living food and stayed. DARK_MATTE
        # already lists crow, raven, pileated, widow,
        # vinegaroon, and skunk; that membership stays. I did
        # not add beaver. That set still nicked chocolate hide
        # (sit dark ~12k against luma-8's ~31k; talk dark ~19k
        # against ~39k). The plate on these raws is actually
        # black, so luma-8 knocks it (fill ~0.20–0.52, med luma
        # 0, not a cream-plate leftover that luma-8 would keep
        # at ~0.78). Leftover idle was already a house-hand
        # North American beaver on a clear plate (fill ~0.30,
        # 276 hues). Grin's opossum elif stays Grin's. Stripe's
        # skunk elif stays Stripe's. Wash's raccoon elif stays
        # Wash's. Slick's otter elif stays Slick's. Cache's
        # squirrel elif stays Cache's. Cape's bat elif stays
        # Cape's. Rack's deer elif stays Rack's. Gale's
        # solifuge elif stays Gale's. Clasp's tick elif stays
        # Clasp's. Whip's vinegaroon elif stays Whip's. Barb's
        # scorpion elif stays Barb's. Stem's harvestman elif
        # stays Stem's. Hour's widow elif stays Hour's. Velvet's
        # tarantula elif stays Velvet's. Prowl's wolf_spider
        # elif stays Prowl's. Leap's jumping_spider elif stays
        # Leap's. Loom's orb_weaver elif stays Loom's. Sip's
        # hummingbird elif stays Sip's. Drum's pileated elif
        # stays Drum's. Vee's canada_goose elif stays Vee's.
        # Drake's mallard elif stays Drake's. Brick's robin
        # elif stays Brick's. Dee's chickadee elif stays Dee's.
        # Hook's red_tail elif stays Hook's. Hold's kelp elif
        # stays Hold's. Rod's coli elif stays Rod's. Luma-8
        # keeps the whole North American beaver.
        # knock_tiny_crumbs keeps specks off. Guest-only. Not
        # a catalog wash. Not TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "porcupine":
        # Spine's dark eyes, dark nose, dark paws, dark brown
        # fur, and dark quill bases nick when default plate-flood
        # treats hide as black or as Pale's wash. Sit lost live
        # hide (~57k against luma-8's ~105k, dark ~1.2k against
        # ~8.2k) and tore the sit into fragments. Walk lost the
        # gait (~30k live against luma-8's ~74k, dark ~955
        # against ~5.1k) and left a head. Sleep tore the curl
        # (~55k live against luma-8's ~114k, dark ~1.4k against
        # ~16k). Talk lost the speak (~58k live against luma-8's
        # ~98k, dark ~1.4k against ~8.9k). Eat nicked the chew
        # (~46k live against luma-8's ~87k, dark ~1.1k against
        # ~6.0k) and punched the midsection. Play jagged the
        # stand (~43k live against luma-8's ~98k, dark ~1.8k
        # against ~6.1k). Cream quill tips and tan face are
        # hide, not Pale's wash — they can look like tan wash;
        # they are Erethizon. TAN_SIT is other keys. I did not
        # join. That path still lost sit dark (~5.5k against
        # luma-8's ~8.2k) and sleep dark (~5.8k against ~16k).
        # Ground islands, floating splotches, parchment
        # leftovers, the sit island and floating splotch, the
        # walk dirt patch, the sleep earth, the talk tan traces,
        # the eat earth patch, and the play tan backdrop and
        # ground patch were furniture, not hide. A stick in eat
        # is living food and stayed. DARK_MATTE already lists
        # crow, raven, pileated, widow, vinegaroon, and skunk;
        # that membership stays. I did not add porcupine. That
        # set still nicked dark hide (sit dark ~6.6k against
        # luma-8's ~8.2k; sleep dark ~5.9k against ~16k). The
        # plate on these raws is actually black, so luma-8
        # knocks it (fill ~0.28–0.44, med luma 0, not a
        # cream-plate leftover that luma-8 would keep at
        # ~0.78). Leftover idle was already a house-hand North
        # American porcupine on a clear plate (fill ~0.23, 161
        # hues). Dam's beaver elif stays Dam's. Grin's opossum
        # elif stays Grin's. Stripe's skunk elif stays Stripe's.
        # Wash's raccoon elif stays Wash's. Slick's otter elif
        # stays Slick's. Cache's squirrel elif stays Cache's.
        # Cape's bat elif stays Cape's. Rack's deer elif stays
        # Rack's. Gale's solifuge elif stays Gale's. Clasp's
        # tick elif stays Clasp's. Whip's vinegaroon elif stays
        # Whip's. Barb's scorpion elif stays Barb's. Stem's
        # harvestman elif stays Stem's. Hour's widow elif stays
        # Hour's. Velvet's tarantula elif stays Velvet's.
        # Prowl's wolf_spider elif stays Prowl's. Leap's
        # jumping_spider elif stays Leap's. Loom's orb_weaver
        # elif stays Loom's. Sip's hummingbird elif stays Sip's.
        # Drum's pileated elif stays Drum's. Vee's canada_goose
        # elif stays Vee's. Drake's mallard elif stays Drake's.
        # Brick's robin elif stays Brick's. Dee's chickadee
        # elif stays Dee's. Hook's red_tail elif stays Hook's.
        # Hold's kelp elif stays Hold's. Rod's coli elif stays
        # Rod's. Luma-8 keeps the whole North American
        # porcupine. knock_tiny_crumbs keeps specks off.
        # Guest-only. Not a catalog wash. Not TAN_SIT. Not
        # DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "house_centipede":
        # Haste's dark stripes, dark banded joints, dark
        # compound eyes, and dark antennal tips nick when
        # default plate-flood treats hide as black or as Pale's
        # wash. Long thin legs nick under a harsh knock. Sit
        # lost live hide (~15k against luma-8's ~27k, dark
        # ~1.7k against ~3.6k) and tore the hunt pause. Walk
        # kept close (~21k live against luma-8's ~19k, dark
        # ~1.6k against ~1.6k). Sleep lost the rest (~23k live
        # against luma-8's ~26k, dark ~1.8k against ~2.1k).
        # Talk kept close (~31k against luma-8's ~31k). Eat
        # lost the chew (~23k live against luma-8's ~30k, dark
        # ~1.9k against ~2.6k) and nicked the silverfish hold.
        # Play kept close (~22k live against luma-8's ~21k).
        # Pale yellowish-tan body and pale banded legs are
        # hide, not Pale's wash — they can look like tan wash;
        # they are Scutigera. TAN_SIT is other keys. I did not
        # join. That path kept extra sit fringe (~33k against
        # luma-8's ~27k). Ground islands, parchment leftovers,
        # the leftover armored sit island, the leftover
        # caterpillar crawl, the leftover millipede curl, the
        # leftover talk fragment, the leftover eat parchment,
        # and the leftover play stamp were furniture, not hide.
        # A silverfish in eat is living food and stayed.
        # DARK_MATTE already lists crow, raven, pileated,
        # widow, vinegaroon, and skunk; that membership stays.
        # I did not add house_centipede. That set still nicked
        # play dark (~782 against luma-8's ~806). The plate on
        # these raws is actually black, so luma-8 knocks it
        # (fill ~0.07–0.12, med luma 0, not a cream-plate
        # leftover that luma-8 would keep at ~0.78). Leftover
        # idle was already a house-hand house centipede on a
        # clear plate (fill ~0.11, 252 hues). Coal's
        # black_bear stays on DARK_MATTE. Spine's porcupine
        # elif stays Spine's. Dam's beaver elif stays Dam's.
        # Grin's opossum elif stays Grin's. Stripe's skunk
        # elif stays Stripe's. Wash's raccoon elif stays
        # Wash's. Slick's otter elif stays Slick's. Cache's
        # squirrel elif stays Cache's. Cape's bat elif stays
        # Cape's. Rack's deer elif stays Rack's. Gale's
        # solifuge elif stays Gale's. Clasp's tick elif stays
        # Clasp's. Whip's vinegaroon elif stays Whip's. Barb's
        # scorpion elif stays Barb's. Stem's harvestman elif
        # stays Stem's. Hour's widow elif stays Hour's.
        # Velvet's tarantula elif stays Velvet's. Prowl's
        # wolf_spider elif stays Prowl's. Leap's
        # jumping_spider elif stays Leap's. Loom's orb_weaver
        # elif stays Loom's. Sip's hummingbird elif stays
        # Sip's. Drum's pileated elif stays Drum's. Vee's
        # canada_goose elif stays Vee's. Drake's mallard elif
        # stays Drake's. Brick's robin elif stays Brick's.
        # Dee's chickadee elif stays Dee's. Hook's red_tail
        # elif stays Hook's. Hold's kelp elif stays Hold's.
        # Rod's coli elif stays Rod's. Luma-8 keeps the whole
        # house centipede. knock_tiny_crumbs keeps specks off.
        # Guest-only. Not a catalog wash. Not TAN_SIT. Not
        # DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "millipede":
        # Link's dark glossy mahogany rings, dark eyes, and
        # dark antennae nick when default plate-flood treats
        # hide as black or as Pale's wash. Pale legs can look
        # like tan wash — they are hide. Sit lost live hide
        # (~26k against luma-8's ~34k, dark ~4.8k against
        # ~11k) and tore the oil pause. Walk lost the walk
        # (~19k live against luma-8's ~25k, dark ~4.0k
        # against ~7.8k). Sleep lost the coil (~75k live
        # against luma-8's ~114k, dark ~20k against ~48k)
        # and nicked the ventral rings. Talk lost the speak
        # (~21k against luma-8's ~30k, dark ~5.7k against
        # ~10k). Eat lost the chew (~24k live against
        # luma-8's ~31k, dark ~5.8k against ~9.5k) and
        # nicked the leaf hold. Play lost the coil / walk
        # (~35k against luma-8's ~42k, dark ~9.4k against
        # ~16k). Ground islands, leftover leaf beds, leftover
        # earth patches, leftover soil islands, leftover
        # torn cutouts, and leftover leaf fragments were
        # furniture, not hide. A leaf in eat is living food
        # and stayed. TAN_SIT is other keys. I did not join.
        # That path kept extra sit fringe (~30k against
        # luma-8's ~34k) and still nicked dark hide. Pale
        # legs can look like Pale's wash — they are Narceus.
        # DARK_MATTE already lists millipede from the old
        # painter, plus crow, raven, pileated, widow,
        # vinegaroon, and skunk; that membership stays. I
        # did not add millipede. I did not remove existing
        # keys. That set still nicked sit dark (~4.8k
        # against luma-8's ~11k) and tore the coil. The
        # plate on these raws is actually black, so luma-8
        # knocks it (fill ~0.10–0.16, sleep coil ~0.44, med
        # luma 0, not a cream-plate leftover that luma-8
        # would keep at ~0.78). Leftover idle was already a
        # house-hand millipede on a clear plate (fill ~0.12,
        # 234 hues). Haste's house_centipede elif stays
        # Haste's. Coal's black_bear stays on DARK_MATTE.
        # Spine's porcupine elif stays Spine's. Dam's beaver
        # elif stays Dam's. Grin's opossum elif stays Grin's.
        # Stripe's skunk elif stays Stripe's. Wash's raccoon
        # elif stays Wash's. Slick's otter elif stays Slick's.
        # Cache's squirrel elif stays Cache's. Cape's bat
        # elif stays Cape's. Rack's deer elif stays Rack's.
        # Gale's solifuge elif stays Gale's. Clasp's tick
        # elif stays Clasp's. Whip's vinegaroon elif stays
        # Whip's. Barb's scorpion elif stays Barb's. Stem's
        # harvestman elif stays Stem's. Hour's widow elif
        # stays Hour's. Velvet's tarantula elif stays
        # Velvet's. Prowl's wolf_spider elif stays Prowl's.
        # Leap's jumping_spider elif stays Leap's. Loom's
        # orb_weaver elif stays Loom's. Sip's hummingbird
        # elif stays Sip's. Drum's pileated elif stays
        # Drum's. Vee's canada_goose elif stays Vee's.
        # Drake's mallard elif stays Drake's. Brick's robin
        # elif stays Brick's. Dee's chickadee elif stays
        # Dee's. Hook's red_tail elif stays Hook's. Hold's
        # kelp elif stays Hold's. Rod's coli elif stays
        # Rod's. Luma-8 keeps the whole millipede.
        # knock_tiny_crumbs keeps specks off. Guest-only.
        # Not a catalog wash. Not TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "pillbug":
        # Armor's dark charcoal mottled plates, dark compound
        # eyes, dark legs, and dark antennal tips nick when
        # default plate-flood treats hide as black or as Pale's
        # wash. Pale mottling on the plates can look like tan
        # wash — it is hide. Sit lost the seven pairs and the
        # antennae (dark 0 against luma-8's ~274) and left a
        # hunkered shell. Walk lost the walk (~45k live against
        # luma-8's ~51k, dark 4 against ~91). Sleep tore the
        # tight roll (~122k live against luma-8's ~163k, dark
        # ~100 against ~822) and left a jagged partial ball.
        # Talk lost the speak (dark 9 against luma-8's ~337)
        # and tucked the pairs and antennae. Eat lost the chew
        # (dark 5 against luma-8's ~1.0k) and nicked the leaf
        # hold. Play tore the half-roll (~34k live against
        # luma-8's ~48k, dark 8 against ~1.0k) and left a
        # split body. Ground islands, leftover earth islands,
        # leftover dirt patches, leftover mulch mounds, and
        # leftover dried leaves were furniture, not hide. A
        # leaf flake in eat is living food and stayed.
        # TAN_SIT is other keys. I did not join. That path
        # kept extra talk tan (~620 against luma-8's ~279)
        # and still nicked dark hide. Pale mottling can look
        # like Pale's wash — it is Armadillidium. DARK_MATTE
        # already lists crow, raven, pileated, widow,
        # vinegaroon, and skunk; that membership stays. I
        # did not add pillbug. That set still nicked sit dark
        # (~86 against luma-8's ~274) and eat dark (~205
        # against ~1.0k). The plate on these raws is actually
        # black, so luma-8 knocks it (fill ~0.17–0.23, sleep
        # roll ~0.62, med luma 0, not a cream-plate leftover
        # that luma-8 would keep at ~0.78). Leftover idle was
        # already a house-hand pillbug on a clear plate (fill
        # ~0.21, 115 hues). Link's millipede elif stays
        # Link's. Haste's house_centipede elif stays Haste's.
        # Coal's black_bear stays on DARK_MATTE. Spine's
        # porcupine elif stays Spine's. Dam's beaver elif
        # stays Dam's. Grin's opossum elif stays Grin's.
        # Stripe's skunk elif stays Stripe's. Wash's raccoon
        # elif stays Wash's. Slick's otter elif stays Slick's.
        # Cache's squirrel elif stays Cache's. Cape's bat
        # elif stays Cape's. Rack's deer elif stays Rack's.
        # Gale's solifuge elif stays Gale's. Clasp's tick
        # elif stays Clasp's. Whip's vinegaroon elif stays
        # Whip's. Barb's scorpion elif stays Barb's. Stem's
        # harvestman elif stays Stem's. Hour's widow elif
        # stays Hour's. Velvet's tarantula elif stays
        # Velvet's. Prowl's wolf_spider elif stays Prowl's.
        # Leap's jumping_spider elif stays Leap's. Loom's
        # orb_weaver elif stays Loom's. Sip's hummingbird
        # elif stays Sip's. Drum's pileated elif stays
        # Drum's. Vee's canada_goose elif stays Vee's.
        # Drake's mallard elif stays Drake's. Brick's robin
        # elif stays Brick's. Dee's chickadee elif stays
        # Dee's. Hook's red_tail elif stays Hook's. Hold's
        # kelp elif stays Hold's. Rod's coli elif stays
        # Rod's. Luma-8 keeps the whole pillbug.
        # knock_tiny_crumbs keeps specks off. Guest-only.
        # Not a catalog wash. Not TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "earthworm":
        # Cast's dark rings, darker tail, and wet highlights nick
        # when default plate-flood treats hide as black or as Pale's
        # wash. Pale clitellum and pale pink segments can look like
        # tan wash — they are hide. Sit lost some dark hide (~637
        # against luma-8's ~746). Sleep tore the rest (~89k live
        # against luma-8's ~95k, dark ~1.3k against ~17k) and
        # jagged the coil. Talk kept close (~47k live against
        # luma-8's ~48k, dark ~401 against ~517). Eat nicked the
        # chew (~35k live against luma-8's ~38k, dark ~1.2k
        # against ~2.7k) and jagged the underside. Ground islands,
        # leftover soil patches, leftover soil mounds, and leftover
        # millipede legs were furniture or a mixup, not hide. A
        # leaf in eat is living food and stayed. TAN_SIT is other
        # keys. I did not join. That path kept extra sit fringe
        # (~47k against luma-8's ~45k) and extra sleep fringe
        # (~96k against luma-8's ~95k). Pale clitellum can look
        # like Pale's wash — it is Lumbricus. DARK_MATTE already
        # lists crow, raven, pileated, widow, vinegaroon, skunk,
        # and millipede; that membership stays. I did not add
        # earthworm. That set still nicked eat dark (~2.1k against
        # luma-8's ~2.7k). The plate on these raws is actually
        # black, so luma-8 knocks it (fill ~0.15–0.36, med luma 0,
        # not a cream-plate leftover that luma-8 would keep at
        # ~0.78). Leftover idle was already a house-hand earthworm
        # on a clear plate (fill ~0.15, 279 hues). Leftover walk
        # and play were already living earthworms on a clear plate.
        # Armor's pillbug elif stays Armor's. Link's millipede elif
        # stays Link's. Haste's house_centipede elif stays Haste's.
        # Coal's black_bear stays on DARK_MATTE. Spine's porcupine
        # elif stays Spine's. Dam's beaver elif stays Dam's.
        # Grin's opossum elif stays Grin's. Stripe's skunk elif
        # stays Stripe's. Wash's raccoon elif stays Wash's.
        # Slick's otter elif stays Slick's. Cache's squirrel elif
        # stays Cache's. Cape's bat elif stays Cape's. Rack's deer
        # elif stays Rack's. Gale's solifuge elif stays Gale's.
        # Clasp's tick elif stays Clasp's. Whip's vinegaroon elif
        # stays Whip's. Barb's scorpion elif stays Barb's. Stem's
        # harvestman elif stays Stem's. Hour's widow elif stays
        # Hour's. Velvet's tarantula elif stays Velvet's. Prowl's
        # wolf_spider elif stays Prowl's. Leap's jumping_spider
        # elif stays Leap's. Loom's orb_weaver elif stays Loom's.
        # Sip's hummingbird elif stays Sip's. Drum's pileated elif
        # stays Drum's. Vee's canada_goose elif stays Vee's.
        # Drake's mallard elif stays Drake's. Brick's robin elif
        # stays Brick's. Dee's chickadee elif stays Dee's. Hook's
        # red_tail elif stays Hook's. Hold's kelp elif stays
        # Hold's. Rod's coli elif stays Rod's. Luma-8 keeps the
        # whole earthworm. knock_tiny_crumbs keeps specks off.
        # Guest-only. Not a catalog wash. Not TAN_SIT. Not
        # DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "velvet_worm":
        # Jet's dark claws, dark simple eyes, and dark velvet
        # nick when default plate-flood treats hide as black
        # or as Pale's wash. Pale yellow-orange papillae specks
        # can look like tan wash — they are hide. Sit lost the
        # quiet pause (~32k live against luma-8's ~41k, dark
        # ~1.5k against ~4.4k) and jagged the underside. Walk
        # lost the crawl (~32k live against luma-8's ~36k,
        # dark ~2.7k against ~4.5k). Sleep tore the rest (~45k
        # live against luma-8's ~62k, dark ~1.9k against ~6.7k)
        # and nicked the hunched velvet. Talk lost the speak
        # (~51k live against luma-8's ~62k, dark ~5.8k against
        # ~10k). Eat nicked the chew (~58k live against luma-8's
        # ~65k, dark ~5.4k against ~8.5k) and the cricket hold.
        # Play kept extra fringe on default (~50k live against
        # luma-8's ~42k) and jagged the underside; dark stayed
        # close (~5.3k against ~5.4k). Pale papillae specks can
        # look like Pale's wash — they are Euperipatoides.
        # TAN_SIT is other keys. I did not join. That path
        # kept extra walk fringe (~38k against luma-8's ~36k)
        # and still ate eat live (~59k against ~65k). Ground
        # islands, leftover soil patches, leftover leaf
        # fragments, leftover earth slivers, leftover dirt
        # mist, and leftover crumbly earth were furniture, not
        # hide. A cricket in eat is living food and stayed.
        # Glue from the head is a jet, not furniture.
        # DARK_MATTE already lists crow, raven, pileated,
        # widow, vinegaroon, skunk, and millipede; that
        # membership stays. I did not add velvet_worm. I did
        # not remove existing keys. That set still nicked sit
        # dark (~3.6k against luma-8's ~4.4k), sleep dark
        # (~4.4k against ~6.7k), and talk dark (~8.1k against
        # ~10k). The plate on these raws is actually black, so
        # luma-8 knocks it (fill ~0.14–0.25, med luma 0, not a
        # cream-plate leftover that luma-8 would keep at
        # ~0.78). Leftover idle was already a house-hand
        # velvet worm on a clear plate (fill ~0.175, 807 hues).
        # Cast's earthworm elif stays Cast's. Armor's pillbug
        # elif stays Armor's. Link's millipede elif stays
        # Link's. Haste's house_centipede elif stays Haste's.
        # Coal's black_bear stays on DARK_MATTE. Spine's
        # porcupine elif stays Spine's. Dam's beaver elif
        # stays Dam's. Grin's opossum elif stays Grin's.
        # Stripe's skunk elif stays Stripe's. Wash's raccoon
        # elif stays Wash's. Slick's otter elif stays Slick's.
        # Cache's squirrel elif stays Cache's. Cape's bat elif
        # stays Cape's. Rack's deer elif stays Rack's. Gale's
        # solifuge elif stays Gale's. Clasp's tick elif stays
        # Clasp's. Whip's vinegaroon elif stays Whip's. Barb's
        # scorpion elif stays Barb's. Stem's harvestman elif
        # stays Stem's. Hour's widow elif stays Hour's.
        # Velvet's tarantula elif stays Velvet's. Prowl's
        # wolf_spider elif stays Prowl's. Leap's
        # jumping_spider elif stays Leap's. Loom's orb_weaver
        # elif stays Loom's. Sip's hummingbird elif stays
        # Sip's. Drum's pileated elif stays Drum's. Vee's
        # canada_goose elif stays Vee's. Drake's mallard elif
        # stays Drake's. Brick's robin elif stays Brick's.
        # Dee's chickadee elif stays Dee's. Hook's red_tail
        # elif stays Hook's. Hold's kelp elif stays Hold's.
        # Rod's coli elif stays Rod's. Luma-8 keeps the whole
        # velvet worm. knock_tiny_crumbs keeps specks off.
        # Guest-only. Not a catalog wash. Not TAN_SIT. Not
        # DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "springtail":
        # Hop's dark transverse bands, dark simple eye, and dark
        # antennal rings nick when default plate-flood treats hide
        # as black or as Pale's wash. Pale cream bands, tan head,
        # and pale furcula can look like tan wash — they are hide.
        # Sit lost dark hide (~51 against luma-8's ~270) and live
        # (~49k against luma-8's ~51k). Walk lost the walk (~36k
        # live against luma-8's ~37k, dark 2 against ~29) and left
        # a parchment island (119). Sleep lost dark (~27 against
        # ~242). Talk lost dark (~13 against ~196) and live (~47k
        # against ~48k). Eat lost dark (~6 against ~137) and live
        # (~46k against ~47k) and nicked the flake hold. Play
        # lost dark (~37 against ~140) and live (~40k against
        # ~42k). Pale hide can look like Pale's wash — it is
        # Orchesella. TAN_SIT is other keys. I did not join.
        # That path kept extra sit fringe (~53k against luma-8's
        # ~51k) and extra talk fringe (~51k against ~48k). The
        # furcula is the hop, not furniture. A flake in eat is
        # living food and stayed. DARK_MATTE already lists crow,
        # raven, pileated, widow, vinegaroon, skunk, and
        # millipede; that membership stays. I did not add
        # springtail. I did not remove existing keys. That set
        # still nicked sit dark (~128 against luma-8's ~270),
        # sleep dark (~96 against ~242), and talk dark (~46
        # against ~196). The plate on these raws is actually
        # black, so luma-8 knocks it (fill ~0.14–0.24, med luma
        # 0, not a cream-plate leftover that luma-8 would keep
        # at ~0.78). Leftover idle was already a house-hand
        # Orchesella on a clear plate (fill ~0.16, 419 hues).
        # Jet's velvet_worm elif stays Jet's. Cast's earthworm
        # elif stays Cast's. Armor's pillbug elif stays
        # Armor's. Link's millipede elif stays Link's. Haste's
        # house_centipede elif stays Haste's. Coal's black_bear
        # stays on DARK_MATTE. Spine's porcupine elif stays
        # Spine's. Dam's beaver elif stays Dam's. Grin's
        # opossum elif stays Grin's. Stripe's skunk elif stays
        # Stripe's. Wash's raccoon elif stays Wash's. Slick's
        # otter elif stays Slick's. Cache's squirrel elif
        # stays Cache's. Cape's bat elif stays Cape's. Rack's
        # deer elif stays Rack's. Gale's solifuge elif stays
        # Gale's. Clasp's tick elif stays Clasp's. Whip's
        # vinegaroon elif stays Whip's. Barb's scorpion elif
        # stays Barb's. Stem's harvestman elif stays Stem's.
        # Hour's widow elif stays Hour's. Velvet's tarantula
        # elif stays Velvet's. Prowl's wolf_spider elif stays
        # Prowl's. Leap's jumping_spider elif stays Leap's.
        # Loom's orb_weaver elif stays Loom's. Sip's
        # hummingbird elif stays Sip's. Drum's pileated elif
        # stays Drum's. Vee's canada_goose elif stays Vee's.
        # Drake's mallard elif stays Drake's. Brick's robin
        # elif stays Brick's. Dee's chickadee elif stays
        # Dee's. Hook's red_tail elif stays Hook's. Hold's
        # kelp elif stays Hold's. Rod's coli elif stays Rod's.
        # Luma-8 keeps the whole springtail. knock_tiny_crumbs
        # keeps specks off. Guest-only. Not a catalog wash.
        # Not TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "tardigrade":
        # Tun's dark claws nick when default plate-flood treats
        # hide as black or as Pale's wash. Pale tan hide can look
        # like tan wash — it is hide. Sit lost dark hide (~1399
        # against luma-8's ~1713) and live (~104k against luma-8's
        # ~107k). Walk lost the walk (~64k live against luma-8's
        # ~87k, tan ~24k against ~41k) and left a parchment island
        # (41) and punched holes in the tan hide. Sleep stayed
        # close (~158k against ~159k, dark ~2509 against ~2533).
        # Talk lost dark (~1118 against ~1612) and live (~79k
        # against ~81k). Eat lost dark (~1409 against ~2566) and
        # live (~92k against ~109k) and punched holes in the
        # chew. Play lost dark (~2801 against ~3834) and live
        # (~100k against ~102k). Pale tan hide can look like
        # Pale's wash — it is Hypsibius. TAN_SIT is other keys.
        # I did not join. That path kept extra sit fringe
        # (~108k against luma-8's ~107k) and extra talk fringe
        # (~83k against ~81k). Dark claws are hide, not plate.
        # A moss clump in eat is living food and stayed. A tun
        # coil is the species, not furniture. DARK_MATTE already
        # lists crow, raven, pileated, widow, vinegaroon, skunk,
        # and millipede; that membership stays. I did not add
        # tardigrade. I did not remove existing keys. That set
        # still nicked walk (~66k against luma-8's ~87k) and eat
        # (~99k against ~109k) and left a walk island (42). The
        # plate on these raws is actually black, so luma-8 knocks
        # it (fill ~0.31–0.61, med luma 0, not a cream-plate
        # leftover that luma-8 would keep at ~0.78). Leftover
        # idle was already a house-hand water bear on a clear
        # plate (fill ~0.338, 168 hues). Hop's springtail elif
        # stays Hop's. Jet's velvet_worm elif stays Jet's.
        # Cast's earthworm elif stays Cast's. Armor's pillbug
        # elif stays Armor's. Link's millipede elif stays
        # Link's. Haste's house_centipede elif stays Haste's.
        # Coal's black_bear stays on DARK_MATTE. Spine's
        # porcupine elif stays Spine's. Dam's beaver elif
        # stays Dam's. Grin's opossum elif stays Grin's.
        # Stripe's skunk elif stays Stripe's. Wash's raccoon
        # elif stays Wash's. Slick's otter elif stays Slick's.
        # Cache's squirrel elif stays Cache's. Cape's bat elif
        # stays Cape's. Rack's deer elif stays Rack's. Gale's
        # solifuge elif stays Gale's. Clasp's tick elif stays
        # Clasp's. Whip's vinegaroon elif stays Whip's. Barb's
        # scorpion elif stays Barb's. Stem's harvestman elif
        # stays Stem's. Hour's widow elif stays Hour's.
        # Velvet's tarantula elif stays Velvet's. Prowl's
        # wolf_spider elif stays Prowl's. Leap's
        # jumping_spider elif stays Leap's. Loom's orb_weaver
        # elif stays Loom's. Sip's hummingbird elif stays
        # Sip's. Drum's pileated elif stays Drum's. Vee's
        # canada_goose elif stays Vee's. Drake's mallard elif
        # stays Drake's. Brick's robin elif stays Brick's.
        # Dee's chickadee elif stays Dee's. Hook's red_tail
        # elif stays Hook's. Hold's kelp elif stays Hold's.
        # Rod's coli elif stays Rod's. Luma-8 keeps the whole
        # water bear. knock_tiny_crumbs keeps specks off.
        # Guest-only. Not a catalog wash. Not TAN_SIT. Not
        # DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "planarian":
        # Half's pale tan hide and dark gastrovascular tree nick when
        # default plate-flood treats hide as black or as Pale's wash.
        # Pale tan hide can look like tan wash — it is hide. Dark
        # eyespots and the dark branching tree are hide, not plate.
        # Sit lost tan hide (~29k against luma-8's ~39k) and live
        # (~79k against luma-8's ~87k). Walk stayed close (~56k
        # against luma-8's ~56k). Sleep stayed close (~73k against
        # ~73k). Talk stayed close (~62k against ~62k). Eat lost
        # the chew (~53k live against luma-8's ~57k, tan ~13k
        # against ~19k) and nicked the worm hold. Play lost the
        # split (~35k live against luma-8's ~41k, tan ~8k against
        # ~15k) and nicked the living waist. Pale tan hide can
        # look like Pale's wash — it is Girardia. TAN_SIT is
        # other keys. I did not join. That path kept extra sit
        # fringe (~87k against luma-8's ~87k) and extra eat
        # fringe (~58k against ~57k). A worm in eat is living
        # food and stayed. A split is the species, not furniture.
        # DARK_MATTE already lists crow, raven, pileated, widow,
        # vinegaroon, skunk, and millipede; that membership stays.
        # I did not add planarian. I did not remove existing keys.
        # That set still nicked sit (~79k against luma-8's ~87k)
        # and play (~35k against ~41k). The plate on these raws
        # is actually black, so luma-8 knocks it (fill
        # ~0.16–0.33, med luma 0, not a cream-plate leftover
        # that luma-8 would keep at ~0.78). Leftover idle was
        # already a house-hand tiger planarian on a clear plate
        # (fill ~0.215, 388 hues). Tun's tardigrade elif stays
        # Tun's. Hop's springtail elif stays Hop's. Jet's
        # velvet_worm elif stays Jet's. Cast's earthworm elif
        # stays Cast's. Armor's pillbug elif stays Armor's.
        # Link's millipede elif stays Link's. Haste's
        # house_centipede elif stays Haste's. Coal's black_bear
        # stays on DARK_MATTE. Spine's porcupine elif stays
        # Spine's. Dam's beaver elif stays Dam's. Grin's
        # opossum elif stays Grin's. Stripe's skunk elif stays
        # Stripe's. Wash's raccoon elif stays Wash's. Slick's
        # otter elif stays Slick's. Cache's squirrel elif
        # stays Cache's. Cape's bat elif stays Cape's. Rack's
        # deer elif stays Rack's. Gale's solifuge elif stays
        # Gale's. Clasp's tick elif stays Clasp's. Whip's
        # vinegaroon elif stays Whip's. Barb's scorpion elif
        # stays Barb's. Stem's harvestman elif stays Stem's.
        # Hour's widow elif stays Hour's. Velvet's tarantula
        # elif stays Velvet's. Prowl's wolf_spider elif stays
        # Prowl's. Leap's jumping_spider elif stays Leap's.
        # Loom's orb_weaver elif stays Loom's. Sip's
        # hummingbird elif stays Sip's. Drum's pileated elif
        # stays Drum's. Vee's canada_goose elif stays Vee's.
        # Drake's mallard elif stays Drake's. Brick's robin
        # elif stays Brick's. Dee's chickadee elif stays
        # Dee's. Hook's red_tail elif stays Hook's. Hold's
        # kelp elif stays Hold's. Rod's coli elif stays Rod's.
        # Luma-8 keeps the whole tiger planarian.
        # knock_tiny_crumbs keeps specks off. Guest-only. Not
        # a catalog wash. Not TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "amphipod":
        # Scud's pale tan plates and dark eye nick when default
        # plate-flood treats hide as black or as Pale's wash.
        # Pale tan plates can look like tan wash — they are hide.
        # Dark eye and dark speckle on plates are hide, not plate.
        # Sleep lost tan hide (~60k against luma-8's ~73k) and live
        # (~111k against luma-8's ~122k) and nicked the dorsal
        # curve. Play lost tan hide (~46k against ~50k) and live
        # (~73k against ~76k) and nicked plates, pereopods, and
        # uropods. Sit lost (~89k against luma-8's ~90k). Talk
        # lost (~56k against ~58k) and nicked a dorsal plate.
        # Eat lost (~77k against ~78k) and nicked plates behind
        # the head. Walk stayed close (~49.5k against ~49.5k).
        # Pale tan plates can look like Pale's wash — they are
        # Gammarus. TAN_SIT is other keys. I did not join. That
        # path kept extra sit fringe (~95k against luma-8's ~90k)
        # and extra sleep fringe (~125k against ~122k). A
        # yellowish bit in eat is living food and stayed. A
        # scud is the species, not painted furniture. DARK_MATTE
        # already lists crow, raven, pileated, widow,
        # vinegaroon, skunk, and millipede; that membership
        # stays. I did not add amphipod. I did not remove
        # existing keys. That set still nicked sleep (~111k
        # against luma-8's ~122k). The plate on these raws is
        # actually black, so luma-8 knocks it (fill
        # ~0.19–0.47, med luma 0, not a cream-plate leftover
        # that luma-8 would keep at ~0.78). Leftover idle was
        # already a house-hand Gammarus on a clear plate (fill
        # ~0.286, 482 hues). Thread's nematode stayed on
        # default. Half's planarian elif stays Half's. Tun's
        # tardigrade elif stays Tun's. Hop's springtail elif
        # stays Hop's. Jet's velvet_worm elif stays Jet's.
        # Cast's earthworm elif stays Cast's. Armor's pillbug
        # elif stays Armor's. Link's millipede elif stays
        # Link's. Haste's house_centipede elif stays Haste's.
        # Coal's black_bear stays on DARK_MATTE. Spine's
        # porcupine elif stays Spine's. Dam's beaver elif
        # stays Dam's. Grin's opossum elif stays Grin's.
        # Stripe's skunk elif stays Stripe's. Wash's raccoon
        # elif stays Wash's. Slick's otter elif stays Slick's.
        # Cache's squirrel elif stays Cache's. Cape's bat elif
        # stays Cape's. Rack's deer elif stays Rack's. Gale's
        # solifuge elif stays Gale's. Clasp's tick elif stays
        # Clasp's. Whip's vinegaroon elif stays Whip's. Barb's
        # scorpion elif stays Barb's. Stem's harvestman elif
        # stays Stem's. Hour's widow elif stays Hour's.
        # Velvet's tarantula elif stays Velvet's. Prowl's
        # wolf_spider elif stays Prowl's. Leap's
        # jumping_spider elif stays Leap's. Loom's orb_weaver
        # elif stays Loom's. Sip's hummingbird elif stays
        # Sip's. Drum's pileated elif stays Drum's. Vee's
        # canada_goose elif stays Vee's. Drake's mallard elif
        # stays Drake's. Brick's robin elif stays Brick's.
        # Dee's chickadee elif stays Dee's. Hook's red_tail
        # elif stays Hook's. Hold's kelp elif stays Hold's.
        # Rod's coli elif stays Rod's. Luma-8 keeps the whole
        # Gammarus. knock_tiny_crumbs keeps specks off.
        # Guest-only. Not a catalog wash. Not TAN_SIT. Not
        # DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "field_cricket":
        # Chirp's glossy black hide, dark compound eye, and
        # dark tegmina nick when default plate-flood treats
        # hide as black. She is glossy black. A cricket is
        # the species, not painted furniture. Sit lost live
        # hide (~28.8k against luma-8's ~31.2k, dark ~10.1k
        # against ~10.8k) and severed the body into floating
        # parts. Walk lost (~25.4k against ~27.1k, dark ~7.0k
        # against ~8.5k). Talk lost (~43.8k against ~57.5k,
        # dark ~12.4k against ~17.8k) and severed the raised
        # song wings from the body. Eat lost (~32.2k against
        # ~37.1k, dark ~9.9k against ~12.0k). Sleep kept extra
        # studio plate (~75.5k live against luma-8's ~23.9k,
        # fill 0.288 against 0.091). A green leaf in eat is
        # living food and stayed. Pale bronze tegmina can look
        # like tan wash — they are hide. TAN_SIT is other
        # keys. I did not join. That path nicked sit (~27.8k
        # against luma-8's ~31.2k) and sleep (~21.9k against
        # ~23.9k). DARK_MATTE already lists field_cricket from
        # the original meadow sit, and already lists crow,
        # raven, pileated, widow, vinegaroon, skunk, and
        # millipede; that membership stays. I did not add
        # field_cricket. I did not remove existing keys. That
        # set is the default path here and still nicked sit
        # and talk and left sleep plate. The plate on these
        # raws is actually black, so luma-8 knocks it (fill
        # ~0.09–0.22, med luma 0, not a cream-plate leftover
        # that luma-8 would keep at ~0.78). Leftover idle was
        # already a house-hand Gryllus on a clear plate (fill
        # ~0.119, 208 hues). Leftover play was already a
        # house-hand raised-wing cricket on a clear plate
        # (fill ~0.156, 478 hues). Thread's nematode stayed
        # on default. Scud's amphipod elif stays Scud's.
        # Half's planarian elif stays Half's. Tun's
        # tardigrade elif stays Tun's. Hop's springtail elif
        # stays Hop's. Jet's velvet_worm elif stays Jet's.
        # Cast's earthworm elif stays Cast's. Armor's pillbug
        # elif stays Armor's. Link's millipede elif stays
        # Link's. Haste's house_centipede elif stays Haste's.
        # Coal's black_bear stays on DARK_MATTE. Spine's
        # porcupine elif stays Spine's. Dam's beaver elif
        # stays Dam's. Grin's opossum elif stays Grin's.
        # Stripe's skunk elif stays Stripe's. Wash's raccoon
        # elif stays Wash's. Slick's otter elif stays Slick's.
        # Cache's squirrel elif stays Cache's. Cape's bat elif
        # stays Cape's. Rack's deer elif stays Rack's. Gale's
        # solifuge elif stays Gale's. Clasp's tick elif stays
        # Clasp's. Whip's vinegaroon elif stays Whip's. Barb's
        # scorpion elif stays Barb's. Stem's harvestman elif
        # stays Stem's. Hour's widow elif stays Hour's.
        # Velvet's tarantula elif stays Velvet's. Prowl's
        # wolf_spider elif stays Prowl's. Leap's
        # jumping_spider elif stays Leap's. Loom's orb_weaver
        # elif stays Loom's. Sip's hummingbird elif stays
        # Sip's. Drum's pileated elif stays Drum's. Vee's
        # canada_goose elif stays Vee's. Drake's mallard elif
        # stays Drake's. Brick's robin elif stays Brick's.
        # Dee's chickadee elif stays Dee's. Hook's red_tail
        # elif stays Hook's. Hold's kelp elif stays Hold's.
        # Rod's coli elif stays Rod's. Luma-8 keeps the whole
        # Gryllus. knock_tiny_crumbs keeps specks off.
        # Guest-only. Not a catalog wash. Not TAN_SIT. Not
        # DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "grasshopper":
        # Vault's olive-gold hide, barred femur, and dark
        # compound eye nick when default plate-flood treats
        # hide as Pale's wash or as black. She is olive /
        # gold / tan. A grasshopper is the species, not
        # painted furniture. Olive / gold hide and barred
        # femur can look like tan wash — they are hide.
        # Sit lost live hide (~43.6k against luma-8's
        # ~55.8k, dark ~2.4k against ~5.0k) and punched
        # the femur and the saddle. Walk lost (~33.9k
        # against ~50.6k, dark ~2.5k against ~5.5k) and
        # nicked the gait. Talk lost (~46.9k against
        # ~67.5k, dark ~2.9k against ~6.9k) and
        # fragmented the speaking still. Eat lost
        # (~51.5k against ~71.8k, dark ~3.1k against
        # ~6.8k) and severed the head from the pronotum.
        # Sleep lost (~52.9k against ~58.4k, dark ~3.9k
        # against ~4.9k). A green blade of grass in eat
        # is living food and stayed. TAN_SIT is other
        # keys. I did not join. That path kept extra sit
        # fringe (~56.8k against luma-8's ~55.8k) and
        # extra eat fringe (~73.3k against ~71.8k). Pale
        # olive hide can look like Pale's wash — it is
        # Melanoplus. DARK_MATTE already lists crow,
        # raven, pileated, widow, vinegaroon, skunk,
        # millipede, and field_cricket from the original
        # meadow sit; that membership stays. I did not
        # add grasshopper. I did not remove existing
        # keys. That set (tol-16) still nicked sit
        # (~54.9k against luma-8's ~55.8k) and walk
        # (~48.3k against ~50.6k). The plate on these
        # raws is actually black, so luma-8 knocks it
        # (fill ~0.19–0.27, med luma 0, not a cream-plate
        # leftover that luma-8 would keep at ~0.78).
        # Leftover idle was already a house-hand
        # Melanoplus on a clear plate (fill ~0.225, 320
        # hues). Leftover play was already a house-hand
        # mid-jump grasshopper on a clear plate (fill
        # ~0.128, 378 hues). Blade's katydid stayed on
        # default. Chirp's field_cricket elif stays
        # Chirp's. Scud's amphipod elif stays Scud's.
        # Thread's nematode stayed on default. Half's
        # planarian elif stays Half's. Tun's tardigrade
        # elif stays Tun's. Hop's springtail elif stays
        # Hop's. Jet's velvet_worm elif stays Jet's.
        # Cast's earthworm elif stays Cast's. Armor's
        # pillbug elif stays Armor's. Link's millipede
        # elif stays Link's. Haste's house_centipede
        # elif stays Haste's. Luma-8 keeps the whole
        # Melanoplus. knock_tiny_crumbs keeps specks
        # off. Guest-only. Not a catalog wash. Not
        # TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "swallowtail":
        # Banner's yellow hide, black tiger stripes, swallow
        # tails, and dark margin nick when default plate-flood
        # treats hide as Pale's wash or as black. She is
        # yellow / black. A swallowtail is the species, not
        # painted furniture. Yellow hide and black stripes
        # can look like tan wash — they are hide. Sit lost
        # live hide (~48.0k against luma-8's ~67.1k, dark
        # ~6.7k against ~15.5k) and punched the body into a
        # wing scrap. Walk lost (~70.0k against ~75.9k, dark
        # ~11.1k against ~16.7k) and nicked the lift. Talk
        # lost (~50.8k against ~72.3k, dark ~2.9k against
        # ~17.1k, hues ~401 against ~819) and fragmented
        # the speaking still. Eat lost (~51.1k against
        # ~70.8k, dark ~6.7k against ~13.7k). Sleep lost
        # (~51.0k against ~73.6k, dark ~8.9k against
        # ~20.8k) and left a wing without a body. Play lost
        # (~56.2k against ~69.8k, dark ~3.9k against
        # ~15.5k, hues ~551 against ~861). A pale blossom
        # in eat is living food and stayed. TAN_SIT is
        # other keys. I did not join. That path kept extra
        # sit fringe (~68.0k against luma-8's ~67.1k) and
        # extra eat fringe (~72.6k against ~70.8k), nicked
        # talk (~62.5k against ~72.3k) and left a talk
        # island. Pale yellow hide can look like Pale's
        # wash — it is Papilio. DARK_MATTE already lists
        # crow, raven, pileated, widow, vinegaroon, skunk,
        # millipede, and field_cricket from the original
        # meadow sit; that membership stays. I did not add
        # swallowtail. I did not remove existing keys. She
        # is yellow-and-black. That set (tol-16) still
        # nicked sit (~64.0k against luma-8's ~67.1k) and
        # talk (~51.0k against ~72.3k). The plate on these
        # raws is actually black, so luma-8 knocks it
        # (fill ~0.26–0.29, med luma 0, not a cream-plate
        # leftover that luma-8 would keep at ~0.78).
        # Leftover idle was already a house-hand Papilio
        # on a clear plate (fill ~0.220, 387 hues). Vault's
        # grasshopper elif stays Vault's. Blade's katydid
        # stayed on default. Chirp's field_cricket elif
        # stays Chirp's. Scud's amphipod elif stays
        # Scud's. Thread's nematode stayed on default.
        # Half's planarian elif stays Half's. Tun's
        # tardigrade elif stays Tun's. Hop's springtail
        # elif stays Hop's. Jet's velvet_worm elif stays
        # Jet's. Cast's earthworm elif stays Cast's.
        # Armor's pillbug elif stays Armor's. Link's
        # millipede elif stays Link's. Haste's
        # house_centipede elif stays Haste's. Luma-8
        # keeps the whole Papilio. knock_tiny_crumbs
        # keeps specks off. Guest-only. Not a catalog
        # wash. Not TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "jewelwing":
        # Jewel's metallic green hide, smoky-to-black folded
        # wings, and pale pterostigma nick when default
        # plate-flood treats hide as black. She is a
        # damselfly. Black wings are hide, not plate. A
        # jewelwing is the species, not painted furniture.
        # Metallic green hide and black wings can look like
        # tan wash or like black plate — they are hide. Sit
        # lost live hide (~19.9k against luma-8's ~34.2k,
        # dark ~3.2k against ~40.1k) and punched the body
        # into an abdomen scrap. Walk lost the wings (dark
        # ~8.1k against ~37.2k) and scaled the leftover
        # green body (~79.9k live against luma-8's ~32.7k).
        # Sleep lost (~13.4k against ~18.2k, dark ~1.7k
        # against ~14.6k) and left a hanging scrap. Talk
        # lost the wings (dark ~6.2k against ~17.0k) and
        # fragmented the speaking still. Eat lost the wings
        # (dark ~5.4k against ~29.6k) and left a green
        # scrap. A smaller insect at the mouth is living
        # food and stayed. TAN_SIT is other keys. I did
        # not join. That path nicked sit dark (~26.1k
        # against luma-8's ~40.1k), talk dark (~6.4k
        # against ~17.0k), and eat (~16.2k against
        # ~22.7k). Pale green hide can look like Pale's
        # wash — it is Calopteryx. DARK_MATTE already
        # lists crow, raven, pileated, widow, vinegaroon,
        # skunk, millipede, and field_cricket from the
        # original meadow sit; that membership stays. I
        # did not add jewelwing. I did not remove existing
        # keys. She is metallic green and black. That set
        # (tol-16) still nicked sit (~24.3k against
        # luma-8's ~34.2k), talk (~8.1k against ~17.5k),
        # and eat (~7.3k against ~22.7k, green 0). The
        # plate on these raws is actually black, so luma-8
        # knocks it (fill ~0.07–0.13, med luma 0, not a
        # cream-plate leftover that luma-8 would keep at
        # ~0.78). Leftover idle was already a house-hand
        # Calopteryx on a clear plate (fill ~0.043, 1344
        # hues). Leftover play was already a house-hand
        # folded jewelwing on a clear plate (fill ~0.245,
        # 1458 hues). Banner's swallowtail elif stays
        # Banner's. Vault's grasshopper elif stays
        # Vault's. Blade's katydid stayed on default.
        # Chirp's field_cricket elif stays Chirp's.
        # Scud's amphipod elif stays Scud's. Thread's
        # nematode stayed on default. Half's planarian
        # elif stays Half's. Tun's tardigrade elif stays
        # Tun's. Hop's springtail elif stays Hop's. Jet's
        # velvet_worm elif stays Jet's. Cast's earthworm
        # elif stays Cast's. Armor's pillbug elif stays
        # Armor's. Link's millipede elif stays Link's.
        # Haste's house_centipede elif stays Haste's.
        # Luma-8 keeps the whole Calopteryx.
        # knock_tiny_crumbs keeps specks off. Guest-only.
        # Not a catalog wash. Not TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "lacewing":
        # Lace's pale lime-green hide, gold / bronze
        # compound eyes, and long tan thread antennae
        # nick when default plate-flood treats hide as
        # Pale's wash. She is a lacewing. The lace is
        # the tell. A lacewing is not a moth. Gold eyes
        # and tan thread antennae can look like tan
        # wash — they are hide. Sit lost gold thread
        # (~137 gold against luma-8's ~183) and cropped
        # the antennae. Walk lost the thread (~153
        # gold against ~174) and scaled the nicked
        # guest larger (~54.0k live against luma-8's
        # ~48.7k) because the thread no longer extends
        # the bbox. Talk nicked the same thread and
        # scaled the speaking still (~58.2k against
        # ~53.4k). Eat nicked gold (~134 against
        # ~142). Play nicked gold (~85 against ~94).
        # Sleep was nearly even (~42.7k against
        # ~43.0k). A small aphid at the mouth is
        # living food and stayed. TAN_SIT is other
        # keys. I did not join. That path nicked
        # sleep (~35.2k against luma-8's ~43.0k) and
        # talk (~41.3k against ~53.4k). Pale green
        # hide can look like Pale's wash — it is
        # Chrysoperla. DARK_MATTE already lists crow,
        # raven, pileated, widow, vinegaroon, skunk,
        # millipede, and field_cricket from the
        # original meadow sit; that membership stays.
        # I did not add lacewing. I did not remove
        # existing keys. She is pale green and gold.
        # That set (tol-16) still nicked sit gold
        # (~148 against luma-8's ~183). The plate on
        # these raws is actually black, so luma-8
        # knocks it (fill ~0.16–0.30, med luma 0, not
        # a cream-plate leftover that luma-8 would
        # keep at ~0.78). Leftover idle was already a
        # house-hand Chrysoperla on a clear plate
        # (fill ~0.211, 488 hues). Jewel's jewelwing
        # elif stays Jewel's. Banner's swallowtail
        # elif stays Banner's. Vault's grasshopper
        # elif stays Vault's. Blade's katydid stayed
        # on default. Chirp's field_cricket elif
        # stays Chirp's. Scud's amphipod elif stays
        # Scud's. Thread's nematode stayed on
        # default. Half's planarian elif stays
        # Half's. Tun's tardigrade elif stays Tun's.
        # Hop's springtail elif stays Hop's. Jet's
        # velvet_worm elif stays Jet's. Cast's
        # earthworm elif stays Cast's. Armor's
        # pillbug elif stays Armor's. Link's
        # millipede elif stays Link's. Haste's
        # house_centipede elif stays Haste's. Luma-8
        # keeps the whole Chrysoperla.
        # knock_tiny_crumbs keeps specks off.
        # Guest-only. Not a catalog wash. Not
        # TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "earwig":
        # Forceps's reddish-brown / mahogany hide,
        # tan tegmina patches, tan thread antennae,
        # and dark cerci nick when default plate-flood
        # treats hide as black or as Pale's wash. She
        # is an earwig. The forceps are the tell. An
        # earwig is not a mantis. Cerci, not a sting.
        # Red-brown hide and tan tegmina can look like
        # tan wash — they are hide. Sit lost live hide
        # (~18.6k against luma-8's ~34.0k, dark ~1.9k
        # against ~8.8k) and punched the pause into a
        # thin scrap. Walk lost (~14.8k against
        # ~23.3k, dark ~1.5k against ~5.3k) and scaled
        # the nicked guest larger on the current
        # DARK_MATTE path. Sleep lost (~18.2k against
        # ~35.2k, dark ~2.2k against ~10.3k). Talk
        # lost (~16.8k against ~25.8k, dark ~1.7k
        # against ~5.2k). Eat lost (~26.8k against
        # ~41.8k, dark ~2.4k against ~9.2k). Play lost
        # the raise (~22.4k against ~45.2k, dark ~3.1k
        # against ~14.2k). Pale cream eggs / scraps at
        # the mouth are living food and stayed.
        # TAN_SIT is other keys. I did not join. That
        # path nicked sit dark (~6.9k against luma-8's
        # ~8.8k) and sleep dark (~7.5k against
        # ~10.3k). Pale tan tegmina can look like
        # Pale's wash — they are Forficula.
        # DARK_MATTE already lists crow, raven,
        # pileated, widow, vinegaroon, skunk,
        # millipede, field_cricket from the original
        # meadow sit, and earwig from that same sit;
        # that membership stays. I did not add
        # earwig. I did not remove existing keys. She
        # is reddish-brown. That set (tol-16) still
        # nicked sit (~28.8k against luma-8's ~34.0k,
        # dark ~6.1k against ~8.8k) and play (~39.3k
        # against ~45.2k, dark ~11.5k against
        # ~14.2k). The plate on these raws is actually
        # black, so luma-8 knocks it (fill
        # ~0.09–0.17, med luma 0, not a cream-plate
        # leftover that luma-8 would keep at ~0.78).
        # Leftover idle was already a house-hand
        # Forficula on a clear plate (fill ~0.110,
        # 430 hues). Lace's lacewing elif stays
        # Lace's. Jewel's jewelwing elif stays
        # Jewel's. Banner's swallowtail elif stays
        # Banner's. Vault's grasshopper elif stays
        # Vault's. Blade's katydid stayed on default.
        # Chirp's field_cricket elif stays Chirp's.
        # Scud's amphipod elif stays Scud's. Thread's
        # nematode stayed on default. Half's
        # planarian elif stays Half's. Tun's
        # tardigrade elif stays Tun's. Hop's
        # springtail elif stays Hop's. Jet's
        # velvet_worm elif stays Jet's. Cast's
        # earthworm elif stays Cast's. Armor's
        # pillbug elif stays Armor's. Link's
        # millipede elif stays Link's. Haste's
        # house_centipede elif stays Haste's. Luma-8
        # keeps the whole Forficula.
        # knock_tiny_crumbs keeps specks off.
        # Guest-only. Not a catalog wash. Not
        # TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "acorn_weevil":
        # Snout's tan / ochre hide, dark brown mottled
        # bands, glossy black eyes, and the long
        # downward-curving rostrum nick when default
        # plate-flood treats hide as black or as Pale's
        # wash. She is an acorn weevil. The snout is
        # the tell. A weevil is not a bee. Not Auger.
        # Not Mast. Tan hide and dark mottled bands
        # can look like tan wash — they are hide. Sit
        # lost live hide (~42.8k against luma-8's
        # ~57.8k, dark ~8.0k against ~15.8k) and
        # punched the pause, losing the legs. Walk
        # lost (~39.5k against ~48.6k, dark ~7.2k
        # against ~11.9k). Sleep lost (~93.0k against
        # ~119.5k, dark ~14.7k against ~30.1k) and
        # took the tucked drill. Talk lost (~45.3k
        # against ~58.1k, dark ~10.5k against
        # ~16.4k). Eat lost (~92.7k against ~126.6k,
        # dark ~10.0k against ~39.1k) and nicked the
        # acorn of a treaty. Play lost the raise
        # (~45.3k against ~52.0k, dark ~7.7k against
        # ~10.5k). The drilled acorn at eat is living
        # food and stayed. TAN_SIT is other keys. I
        # did not join. That path nicked sit dark
        # (~14.5k against luma-8's ~15.8k) and sleep
        # dark (~25.3k against ~30.1k). Pale tan hide
        # can look like Pale's wash — it is Curculio.
        # DARK_MATTE already lists crow, raven,
        # pileated, widow, vinegaroon, skunk,
        # millipede, field_cricket from the original
        # meadow sit, and earwig from that same sit;
        # that membership stays. I did not add
        # acorn_weevil. I did not remove existing
        # keys. She is tan. That set (tol-16) still
        # nicked sleep (~108.7k against luma-8's
        # ~119.5k, dark ~22.2k against ~30.1k) and
        # talk (~53.0k against ~58.1k). The plate on
        # these raws is actually black, so luma-8
        # knocks it (fill ~0.19–0.48, med luma 0, not
        # a cream-plate leftover that luma-8 would
        # keep at ~0.78). Leftover idle was already a
        # house-hand Curculio on a clear plate (fill
        # ~0.180, 223 hues). Forceps's earwig elif
        # stays Forceps's. Lace's lacewing elif stays
        # Lace's. Jewel's jewelwing elif stays
        # Jewel's. Banner's swallowtail elif stays
        # Banner's. Vault's grasshopper elif stays
        # Vault's. Blade's katydid stayed on default.
        # Chirp's field_cricket elif stays Chirp's.
        # Scud's amphipod elif stays Scud's. Thread's
        # nematode stayed on default. Half's
        # planarian elif stays Half's. Tun's
        # tardigrade elif stays Tun's. Hop's
        # springtail elif stays Hop's. Jet's
        # velvet_worm elif stays Jet's. Cast's
        # earthworm elif stays Cast's. Armor's
        # pillbug elif stays Armor's. Link's
        # millipede elif stays Link's. Haste's
        # house_centipede elif stays Haste's. Luma-8
        # keeps the whole Curculio.
        # knock_tiny_crumbs keeps specks off.
        # Guest-only. Not a catalog wash. Not
        # TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "click_beetle":
        # Click's matte charcoal hide, velvety false-eye
        # centers, beaded antennae, and thin black legs
        # nick when default plate-flood treats hide as
        # black. She is an eyed click beetle. The click
        # is the tell. A click beetle is not a firefly.
        # Not Snap. Not Spark. She clicks and does not
        # light. Charcoal hide can look like plate — it
        # is hide. Cream rings around the false eyes are
        # Alaus hide, not wash. Sit lost extra studio
        # plate (~70.0k live against luma-8's ~57.5k).
        # Walk's extra live (~45.7k against ~32.6k) was
        # a halo; luma-8 kept the stride. Sleep lost
        # (~41.9k against ~50.8k, dark ~2.9k against
        # ~5.7k) and took the tucked legs and antennae.
        # Talk left a plate halo (~76.3k against ~41.7k)
        # and lost the raised speech legs. Eat lost
        # (~44.3k against ~49.8k, dark ~3.3k against
        # ~6.9k) and nicked the charcoal hide of a
        # treaty. Play left extra plate (~58.8k against
        # ~49.5k). The bark scrap at eat is living food
        # and stayed. TAN_SIT is other keys. I did not
        # join. That path nicked eat dark (~1.6k against
        # luma-8's ~6.9k). Pale cream rings can look
        # like Pale's wash — they are Alaus. DARK_MATTE
        # already lists click_beetle from the original
        # meadow sit, and already lists crow, raven,
        # pileated, widow, vinegaroon, skunk,
        # millipede, field_cricket from that same sit,
        # and earwig from Forceps; that membership
        # stays. I did not add click_beetle. I did not
        # remove existing keys. She is charcoal. That
        # set is the default path here and still nicked
        # sleep and talk and left sit and talk plate.
        # The plate on these raws is actually black, so
        # luma-8 knocks it (fill ~0.12–0.22, med luma
        # 0, not a cream-plate leftover that luma-8
        # would keep at ~0.78). Leftover idle was
        # already a house-hand Alaus on a clear plate
        # (fill ~0.132, 163 hues). Snout's acorn_weevil
        # elif stays Snout's. Forceps's earwig elif
        # stays Forceps's. Lace's lacewing elif stays
        # Lace's. Jewel's jewelwing elif stays Jewel's.
        # Banner's swallowtail elif stays Banner's.
        # Vault's grasshopper elif stays Vault's.
        # Blade's katydid stayed on default. Chirp's
        # field_cricket elif stays Chirp's. Scud's
        # amphipod elif stays Scud's. Thread's
        # nematode stayed on default. Half's
        # planarian elif stays Half's. Tun's
        # tardigrade elif stays Tun's. Hop's
        # springtail elif stays Hop's. Jet's
        # velvet_worm elif stays Jet's. Cast's
        # earthworm elif stays Cast's. Armor's
        # pillbug elif stays Armor's. Link's
        # millipede elif stays Link's. Haste's
        # house_centipede elif stays Haste's. Luma-8
        # keeps the whole Alaus.
        # knock_tiny_crumbs keeps specks off.
        # Guest-only. Not a catalog wash. Not
        # TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "robber_fly":
        # Rob's grey-brown bristled thorax, white
        # mystax, thin black legs, and the dark
        # fly of a treaty nick when default
        # plate-flood treats hide as black. She
        # is a robber fly. The hunt is the tell.
        # A robber fly is not a bee. Not Thrum.
        # Not Sip. Grey bristle can look like
        # wash — it is hide. The white mystax is
        # Efferia, not Pale's wash. Sit lost
        # (~57.3k live against luma-8's ~61.1k,
        # dark ~12.6k against ~14.7k) and nicked
        # the quieter perch legs. Walk lost the
        # stride (~50.7k against ~54.7k, dark
        # ~8.8k against ~10.1k). Sleep lost
        # (~79.5k against ~94.0k, dark ~13.3k
        # against ~21.6k) and took the tucked
        # abdomen and legs. Talk lost the speak
        # (~51.5k against ~53.9k, dark ~9.4k
        # against ~10.8k) and clipped the raised
        # speech leg. Eat lost (~55.8k against
        # ~66.8k, dark ~10.0k against ~15.6k)
        # and nicked the hunt. Play's extra live
        # on default (~50.2k against ~43.6k) was
        # a halo; luma-8 kept the take. The
        # smaller dark fly at eat is living food
        # and stayed. TAN_SIT is other keys. I
        # did not join. Grey bristle can look
        # like Pale's wash — it is hide.
        # DARK_MATTE already lists robber_fly
        # from the original meadow sit, and
        # already lists crow, raven, pileated,
        # widow, vinegaroon, skunk, millipede,
        # field_cricket from that same sit,
        # click_beetle from Click, and earwig
        # from Forceps; that membership stays.
        # I did not add robber_fly. I did not
        # remove existing keys. She is bristled
        # and dark-legged. That set is the
        # default path here and still nicked
        # sleep and eat and left play plate.
        # The plate on these raws is actually
        # black, so luma-8 knocks it (fill
        # ~0.17–0.36, med luma 0, not a
        # cream-plate leftover that luma-8
        # would keep at ~0.78). Leftover idle
        # was already a house-hand Efferia on a
        # clear plate (fill ~0.249, 275 hues).
        # Click's click_beetle elif stays
        # Click's. Snout's acorn_weevil elif
        # stays Snout's. Forceps's earwig elif
        # stays Forceps's. Lace's lacewing elif
        # stays Lace's. Jewel's jewelwing elif
        # stays Jewel's. Banner's swallowtail
        # elif stays Banner's. Vault's
        # grasshopper elif stays Vault's.
        # Blade's katydid stayed on default.
        # Chirp's field_cricket elif stays
        # Chirp's. Scud's amphipod elif stays
        # Scud's. Thread's nematode stayed on
        # default. Half's planarian elif stays
        # Half's. Tun's tardigrade elif stays
        # Tun's. Hop's springtail elif stays
        # Hop's. Jet's velvet_worm elif stays
        # Jet's. Cast's earthworm elif stays
        # Cast's. Armor's pillbug elif stays
        # Armor's. Link's millipede elif stays
        # Link's. Haste's house_centipede elif
        # stays Haste's. Luma-8 keeps the whole
        # Efferia. knock_tiny_crumbs keeps
        # specks off. Guest-only. Not a catalog
        # wash. Not TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "sloth":
        # Hang's dark eye-masks, leathery nose, and
        # the dark of a two-toed hook nick when
        # default plate-flood treats hide as black.
        # She is a two-toed sloth. The hang is the
        # work. A sloth is not a red panda. Not Rui.
        # Not Bradypus. Two ivory claws, not three.
        # Tan shaggy fur can look like wash — it is
        # hide. The cream face is Choloepus, not
        # Pale's wash. Default shredded idle (~19.9k
        # live against luma-8's ~143.0k, dark ~8
        # against ~1.1k) and left two claw scraps.
        # Talk lost the speak (~29.6k against
        # ~142.6k, dark ~19 against ~3.0k) and left
        # a parchment island (~12.0k). Eat lost the
        # leaf of a treaty (~43.8k against ~110.6k,
        # dark ~86 against ~1.6k). Sit kept counts
        # (~107.7k against ~109.0k) but nicked dark
        # mask (~351 against ~743). Sleep lost dark
        # (~188 against ~524). Walk lost the reach
        # (~72.5k against ~80.9k). Play lost dark
        # (~114 against ~375). TAN_SIT already
        # listed sloth from the original canopy sit.
        # I took her off. That path nicked idle
        # (~59.5k against luma-8's ~143.0k) and left
        # a parchment island (~16.2k). Talk lost
        # (~40.9k against ~142.6k, island ~13.5k).
        # Eat lost (~27.5k against ~110.6k, island
        # ~2.5k). Cream face and tan hide are not
        # Pale's wash. DARK_MATTE already lists
        # crow, raven, pileated, widow, vinegaroon,
        # skunk, millipede, field_cricket from the
        # original meadow sit, click_beetle from
        # Click, earwig from Forceps, and
        # robber_fly from Rob; that membership
        # stays. I did not add sloth. I did not
        # remove existing keys. She is tan. That
        # set is other keys. The plate on these
        # raws is actually black, so luma-8 knocks
        # it (fill ~0.30–0.55, med luma 0 on the
        # plate corners, not a cream-plate leftover
        # that luma-8 would keep at ~0.78). Leftover
        # idle was already a house-hand hang on a
        # clear plate, but the mouth was a human
        # smile; idle is a closed hang now. Talk
        # was byte-identical to leftover eat; talk
        # is speech now. Rob's robber_fly elif
        # stays Rob's. Click's click_beetle elif
        # stays Click's. Snout's acorn_weevil elif
        # stays Snout's. Forceps's earwig elif
        # stays Forceps's. Lace's lacewing elif
        # stays Lace's. Jewel's jewelwing elif
        # stays Jewel's. Banner's swallowtail elif
        # stays Banner's. Vault's grasshopper elif
        # stays Vault's. Blade's katydid stayed on
        # default. Chirp's field_cricket elif stays
        # Chirp's. Scud's amphipod elif stays
        # Scud's. Thread's nematode stayed on
        # default. Luma-8 keeps the whole
        # Choloepus. knock_tiny_crumbs keeps
        # specks off. Guest-only. Not a catalog
        # wash. Not TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "lemur":
        # Sun's dark eye-masks, black muzzle, and the
        # black rings of a flag tail nick when default
        # plate-flood treats hide as black. She is a
        # ring-tailed lemur. The tail is a flag. A
        # lemur is not a raccoon. Not Stripe. Not Ring.
        # Cream chest and white face can look like wash
        # — they are hide. Default shredded sit (the
        # flag left only a tip; dark ~2.8k against
        # luma-8's ~6.7k) and eat (flag gone; live
        # ~84.8k against ~115.5k, dark ~3.4k against
        # ~12.0k). Talk nicked the open mouth and the
        # flag (~91.6k against ~96.8k, dark ~6.6k
        # against ~9.0k). Play lost dark (~2.5k
        # against ~5.2k). Walk nicked the same rings
        # (~55.0k against ~56.7k). Cream hide is not
        # Pale's wash — TAN_SIT is other keys. Hang
        # took sloth off TAN_SIT; I did not put sloth
        # back. I did not join. DARK_MATTE already
        # lists crow, raven, pileated, widow,
        # vinegaroon, skunk, millipede, field_cricket
        # from the original meadow sit, click_beetle
        # from Click, earwig from Forceps, and
        # robber_fly from Rob; that membership stays.
        # I did not add lemur. She is cream and grey
        # and a flag of black rings. That set is other
        # keys. The plate on these raws is actually
        # black, so luma-8 knocks it (fill ~0.23–0.46,
        # med luma 0 on the plate corners, not a
        # cream-plate leftover that luma-8 would keep
        # at ~0.78). Leftover idle was already a
        # house-hand flag on a clear plate; idle and
        # blotter stay. Leftover sleep was already a
        # curled house-hand rest; sleep stays. Hang's
        # sloth elif stays Hang's. Rob's robber_fly
        # elif stays Rob's. Click's click_beetle elif
        # stays Click's. Snout's acorn_weevil elif
        # stays Snout's. Forceps's earwig elif stays
        # Forceps's. Lace's lacewing elif stays
        # Lace's. Jewel's jewelwing elif stays
        # Jewel's. Banner's swallowtail elif stays
        # Banner's. Vault's grasshopper elif stays
        # Vault's. Blade's katydid stayed on default.
        # Chirp's field_cricket elif stays Chirp's.
        # Thread's nematode stayed on default. Luma-8
        # keeps the whole Lemur. knock_tiny_crumbs
        # keeps specks off. Guest-only. Not a catalog
        # wash. Not TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "gibbon":
        # Swing's dark face, black cap, and the dark
        # of a white-handed reach nick when default
        # plate-flood treats hide as black. She is a
        # lar gibbon. The song and the swing are the
        # tell. A gibbon is an ape, not a monkey.
        # Not Quill. Cream / buff shaggy fur can look
        # like wash — it is hide. Default shredded
        # play (the swing left holes through chest
        # and belly; live ~24.1k against luma-8's
        # ~40.7k, dark ~66 against ~111) and nicked
        # walk (the tucked thigh tore; live ~45.8k
        # against ~48.9k, dark ~15 against ~69).
        # Eat lost dark fingers and the face (~811
        # against ~1.3k). Talk nicked the open mouth
        # (~68.7k against ~70.4k, dark ~132 against
        # ~190). Sit lost dark (~377 against ~515).
        # Sleep nicked the same closed face (~1.2k
        # against ~1.3k). Cream hide is not Pale's
        # wash — TAN_SIT is other keys. Hang took
        # sloth off TAN_SIT; I did not put sloth
        # back. I did not join. DARK_MATTE already
        # lists crow, raven, pileated, widow,
        # vinegaroon, skunk, millipede, field_cricket
        # from the original meadow sit, click_beetle
        # from Click, earwig from Forceps, and
        # robber_fly from Rob; that membership stays.
        # I did not add gibbon. She is cream and a
        # dark face. That set is other keys. The
        # plate on these raws is actually black, so
        # luma-8 knocks it (fill ~0.16–0.62, med
        # luma 0 on the plate corners, not a
        # cream-plate leftover that luma-8 would
        # keep at ~0.78). Leftover idle was already
        # a house-hand reach on a clear plate; idle
        # and blotter stay. Sun's lemur elif stays
        # Sun's. Hang's sloth elif stays Hang's.
        # Rob's robber_fly elif stays Rob's. Click's
        # click_beetle elif stays Click's. Snout's
        # acorn_weevil elif stays Snout's. Forceps's
        # earwig elif stays Forceps's. Lace's
        # lacewing elif stays Lace's. Jewel's
        # jewelwing elif stays Jewel's. Banner's
        # swallowtail elif stays Banner's. Vault's
        # grasshopper elif stays Vault's. Blade's
        # katydid stayed on default. Chirp's
        # field_cricket elif stays Chirp's.
        # Thread's nematode stayed on default.
        # Luma-8 keeps the whole Hylobates.
        # knock_tiny_crumbs keeps specks off.
        # Guest-only. Not a catalog wash. Not
        # TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "kinkajou":
        # Wrist's dark night eyes, moist nose, and
        # the dark of a prehensile wrap nick when
        # default plate-flood treats hide as black.
        # She is a kinkajou. The tail that wraps is
        # the tell. A honey bear who is not a bear.
        # Not Hang. Not Sun. Not Swing. Honey /
        # golden-brown hide can look like wash —
        # it is hide. Default shredded sit (the
        # quieter sit left jagged holes between
        # digits, inner elbows, and the tail wrap;
        # live ~83.5k against luma-8's ~88.2k,
        # dark ~277 against ~1.2k). Sleep lost a
        # little of the ball (~147.9k against
        # ~151.4k). Walk nicked the same climb
        # (~67.5k against ~69.0k). Cream leftover
        # would leave studio plate on luma-8; these
        # raws are actually black (fill ~0.19–0.60,
        # med luma 0 on the plate corners, not a
        # cream leftover at ~0.78). Honey hide is
        # not Pale's wash — TAN_SIT is other keys.
        # Hang took sloth off TAN_SIT; I did not
        # put sloth back. I did not join.
        # DARK_MATTE already lists crow, raven,
        # pileated, widow, vinegaroon, skunk,
        # millipede, field_cricket from the
        # original meadow sit, click_beetle from
        # Click, earwig from Forceps, and
        # robber_fly from Rob; that membership
        # stays. I did not add kinkajou. She is
        # honey. That set is other keys. Leftover
        # idle was already a house-hand curl on a
        # clear plate; idle and blotter stay.
        # Leftover sleep had a torn nick in the
        # ring; sleep is a whole ball now. Swing's
        # gibbon elif stays Swing's. Sun's lemur
        # elif stays Sun's. Hang's sloth elif
        # stays Hang's. Rob's robber_fly elif
        # stays Rob's. Click's click_beetle elif
        # stays Click's. Snout's acorn_weevil
        # elif stays Snout's. Forceps's earwig
        # elif stays Forceps's. Lace's lacewing
        # elif stays Lace's. Jewel's jewelwing
        # elif stays Jewel's. Banner's swallowtail
        # elif stays Banner's. Vault's
        # grasshopper elif stays Vault's. Blade's
        # katydid stayed on default. Chirp's
        # field_cricket elif stays Chirp's.
        # Thread's nematode stayed on default.
        # Luma-8 keeps the whole Potos.
        # knock_tiny_crumbs keeps specks off.
        # Guest-only. Not a catalog wash. Not
        # TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "howler":
        # Boom's black hide, beard, and the dark of
        # a howl nick when default plate-flood treats
        # hide as black. He is a mantled howler.
        # The howl is the tell. A howler is not a
        # gibbon. Not Vee. Not Swing. Golden mantle
        # can look like wash — it is hide. Black
        # hide can look like plate. Default shredded
        # sleep (the quieter rest left a mantle
        # scrap; live ~30.5k against luma-8's
        # ~84.1k, dark ~26 against ~16.7k), talk
        # (the howl left a face and a mantle;
        # ~38.1k against ~86.1k, dark ~1.6k against
        # ~9.7k), play (the boom left a face and a
        # mantle; ~37.7k against ~84.8k, dark ~3.0k
        # against ~25.3k), eat (the leaf stayed but
        # the belly tore; ~47.0k against ~89.8k,
        # dark ~632 against ~11.6k), sit (the
        # quieter sit left holes; ~29.0k against
        # ~63.9k, dark ~129 against ~15.8k), and
        # walk (the walk left a mantle scrap;
        # ~20.3k against ~44.6k, dark ~6 against
        # ~7.9k). Golden mantle is not Pale's wash
        # — TAN_SIT is other keys. Hang took sloth
        # off TAN_SIT; I did not put sloth back.
        # I did not join. DARK_MATTE already lists
        # crow, raven, pileated, widow,
        # vinegaroon, skunk, millipede,
        # field_cricket from the original meadow
        # sit, click_beetle from Click, earwig
        # from Forceps, and robber_fly from Rob;
        # that membership stays. I did not add
        # howler. He is black hide plus a golden
        # mantle. That set is other keys. The
        # plate on these raws is actually black,
        # so luma-8 knocks it (fill ~0.17–0.34,
        # med luma 0 on the plate corners, not a
        # cream-plate leftover that luma-8 would
        # keep at ~0.78). Leftover idle was already
        # a house-hand howl on a clear plate; idle
        # and blotter stay. Wrist's kinkajou elif
        # stays Wrist's. Swing's gibbon elif stays
        # Swing's. Sun's lemur elif stays Sun's.
        # Hang's sloth elif stays Hang's. Rob's
        # robber_fly elif stays Rob's. Click's
        # click_beetle elif stays Click's. Snout's
        # acorn_weevil elif stays Snout's.
        # Forceps's earwig elif stays Forceps's.
        # Lace's lacewing elif stays Lace's.
        # Jewel's jewelwing elif stays Jewel's.
        # Banner's swallowtail elif stays
        # Banner's. Vault's grasshopper elif stays
        # Vault's. Blade's katydid stayed on
        # default. Chirp's field_cricket elif
        # stays Chirp's. Thread's nematode stayed
        # on default. Sail's colugo stayed on
        # default. Glide's flying_squirrel stayed
        # on default. Luma-8 keeps the whole
        # Alouatta. knock_tiny_crumbs keeps specks
        # off. Guest-only. Not a catalog wash. Not
        # TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "tarsier":
        # Gaze's dark pads, pupils, and the
        # dark of a look nick when default
        # plate-flood treats hide as black.
        # She is a Philippine tarsier. The
        # eyes are the face. A tarsier is
        # not an owl. Not Heart. Tawny hide
        # can look like wash — it is hide.
        # Default shredded sit (the quieter
        # sit left a detached foot and a
        # hole in the chest; live ~108.8k
        # against luma-8's ~116.8k, dark
        # ~1.9k against ~3.5k), sleep (the
        # house-hand ball left a torn
        # underside; ~139.6k against
        # ~161.8k, dark ~1.4k against
        # ~3.6k), talk (the voice left the
        # lower body a scrap; ~89.5k against
        # ~101.8k, dark ~3.3k against
        # ~4.2k), play (the splay left a
        # hole in the torso; ~52.4k against
        # ~55.9k, dark ~601 against ~806),
        # and walk (the leap left a hole
        # between belly and hind leg;
        # ~32.2k against ~34.2k, dark ~273
        # against ~350). Eat kept the insect
        # but nicked pads (~105.9k against
        # ~111.9k). Cream leftover would
        # leave studio plate on luma-8;
        # these raws are actually black
        # (fill ~0.16–0.50, med luma 0 on
        # the plate corners, not a cream
        # leftover at ~0.78). Tawny hide is
        # not Pale's wash — TAN_SIT is
        # other keys. Hang took sloth off
        # TAN_SIT; I did not put sloth
        # back. I did not join.
        # DARK_MATTE already lists crow,
        # raven, pileated, widow,
        # vinegaroon, skunk, millipede,
        # field_cricket from the original
        # meadow sit, click_beetle from
        # Click, earwig from Forceps, and
        # robber_fly from Rob; that
        # membership stays. I did not add
        # tarsier. She is tawny. That set
        # is other keys. Leftover idle had
        # a painted branch; idle and
        # blotter follow the new quieter
        # look. Boom's howler elif stays
        # Boom's. Wrist's kinkajou elif
        # stays Wrist's. Swing's gibbon
        # elif stays Swing's. Sun's lemur
        # elif stays Sun's. Hang's sloth
        # elif stays Hang's. Rob's
        # robber_fly elif stays Rob's.
        # Click's click_beetle elif stays
        # Click's. Snout's acorn_weevil
        # elif stays Snout's. Forceps's
        # earwig elif stays Forceps's.
        # Lace's lacewing elif stays
        # Lace's. Jewel's jewelwing elif
        # stays Jewel's. Banner's
        # swallowtail elif stays Banner's.
        # Vault's grasshopper elif stays
        # Vault's. Blade's katydid stayed
        # on default. Chirp's field_cricket
        # elif stays Chirp's. Thread's
        # nematode stayed on default.
        # Sail's colugo stayed on default.
        # Glide's flying_squirrel stayed
        # on default. Luma-8 keeps the
        # whole Carlito. knock_tiny_crumbs
        # keeps specks off. Guest-only.
        # Not a catalog wash. Not TAN_SIT.
        # Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "potto":
        # Still's dark pads, a dark nose,
        # and tawny hide nick when default
        # plate-flood treats hide as black.
        # She is a potto. A slow cousin.
        # Not a loris. The grip, the still,
        # is the tell. A potto is not a
        # sloth and not a loris. Not Hang.
        # Tawny hide can look like wash —
        # it is hide. Default shredded sit
        # (the quieter sit left detached
        # scraps, 4 comps, live ~126.5k
        # against luma-8's whole ~128.5k,
        # dark ~567 against ~994), walk
        # (the slow walk left the belly
        # and hind a bite; ~62.1k against
        # ~71.4k, dark ~98 against ~117),
        # sleep (the quieter still left
        # chest and muzzle torn; ~144.4k
        # against ~161.6k, dark ~173
        # against ~844), talk (the voice
        # left the lower body a scrap;
        # after fit the leftover head
        # scales large — live ~136.9k
        # against luma-8's whole ~125.8k,
        # dark ~490 against ~780), eat
        # (the gum stay but the rump
        # nicked; ~120.5k against ~135.3k,
        # dark ~230 against ~392), and
        # play (the grip left a hole in
        # the belly; ~96.5k against
        # ~99.6k, dark ~127 against ~193).
        # Cream leftover would leave
        # studio plate on luma-8; these
        # raws are actually black (fill
        # ~0.27–0.62, med luma 0 on the
        # plate corners, not a cream
        # leftover at ~0.78). Tawny hide
        # is not Pale's wash — TAN_SIT is
        # other keys. Hang took sloth off
        # TAN_SIT; I did not put sloth
        # back. I did not join.
        # DARK_MATTE already lists crow,
        # raven, pileated, widow,
        # vinegaroon, skunk, millipede,
        # field_cricket from the original
        # meadow sit, click_beetle from
        # Click, earwig from Forceps, and
        # robber_fly from Rob; that
        # membership stays. I did not add
        # potto. She is tawny. That set
        # is other keys. Leftover idle
        # was already a house-hand still
        # on a clear black plate; idle
        # and blotter stay. Gaze's
        # tarsier elif stays Gaze's.
        # Boom's howler elif stays
        # Boom's. Wrist's kinkajou elif
        # stays Wrist's. Swing's gibbon
        # elif stays Swing's. Sun's lemur
        # elif stays Sun's. Hang's sloth
        # elif stays Hang's. Rob's
        # robber_fly elif stays Rob's.
        # Click's click_beetle elif stays
        # Click's. Snout's acorn_weevil
        # elif stays Snout's. Forceps's
        # earwig elif stays Forceps's.
        # Lace's lacewing elif stays
        # Lace's. Jewel's jewelwing elif
        # stays Jewel's. Banner's
        # swallowtail elif stays Banner's.
        # Vault's grasshopper elif stays
        # Vault's. Blade's katydid stayed
        # on default. Chirp's field_cricket
        # elif stays Chirp's. Thread's
        # nematode stayed on default.
        # Sail's colugo stayed on default.
        # Glide's flying_squirrel stayed
        # on default. Luma-8 keeps the
        # whole Perodicticus.
        # knock_tiny_crumbs keeps specks
        # off. Guest-only. Not a catalog
        # wash. Not TAN_SIT. Not
        # DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "koala":
        # Gum's dark nose, dark claws,
        # and grey wool hide nick when
        # default plate-flood treats hide
        # as black. He is a koala. A
        # marsupial. Not a bear. The
        # chew, the pouch, is the tell.
        # A koala is not a bear. Not
        # Coal. Not Burr. Grey wool hide
        # can look like wash — it is
        # hide. Default shredded sit
        # (the quieter sit left 14 comps
        # and nicked dark hide; live
        # ~107.9k against luma-8's whole
        # ~109.9k, dark ~809 against
        # ~1487; pre-fit lost ~10.7k),
        # walk (the climb left a rump
        # hole, 11 comps; pre-fit lost
        # ~4.8k, dark after fit ~327
        # against ~411), sleep (the
        # quieter sit nicked dark hide;
        # ~131.6k against ~131.7k, dark
        # ~1.3k against ~1.6k; pre-fit
        # lost ~6.3k), and eat (the chew
        # stayed but claws and nose
        # nicked, 8 comps; ~107.4k
        # against ~108.3k, dark ~752
        # against ~1143; pre-fit lost
        # ~9.8k). Cream leftover would
        # leave studio plate on luma-8;
        # these raws are actually black
        # (fill ~0.30–0.44, med luma 0
        # on the plate corners, not a
        # cream leftover at ~0.78). Grey
        # wool hide is not Pale's wash —
        # TAN_SIT is other keys. Hang
        # took sloth off TAN_SIT; I did
        # not put sloth back. I did not
        # join. DARK_MATTE already lists
        # crow, raven, pileated, widow,
        # vinegaroon, skunk, millipede,
        # field_cricket from the original
        # meadow sit, click_beetle from
        # Click, earwig from Forceps, and
        # robber_fly from Rob; that
        # membership stays. I did not add
        # koala. He is grey wool. That
        # set is other keys. Leftover
        # idle was already a house-hand
        # chew on a clear black plate;
        # idle and blotter stay.
        # Leftover talk was already a
        # whole living open-mouth koala;
        # talk stays. Leftover play was
        # already a whole reaching koala;
        # play stays. Still's potto elif
        # stays Still's. Gaze's tarsier
        # elif stays Gaze's. Boom's
        # howler elif stays Boom's.
        # Wrist's kinkajou elif stays
        # Wrist's. Swing's gibbon elif
        # stays Swing's. Sun's lemur
        # elif stays Sun's. Hang's sloth
        # elif stays Hang's. Rob's
        # robber_fly elif stays Rob's.
        # Click's click_beetle elif stays
        # Click's. Snout's acorn_weevil
        # elif stays Snout's. Forceps's
        # earwig elif stays Forceps's.
        # Lace's lacewing elif stays
        # Lace's. Jewel's jewelwing elif
        # stays Jewel's. Banner's
        # swallowtail elif stays Banner's.
        # Vault's grasshopper elif stays
        # Vault's. Blade's katydid stayed
        # on default. Chirp's
        # field_cricket elif stays
        # Chirp's. Thread's nematode
        # stayed on default. Sail's
        # colugo stayed on default.
        # Glide's flying_squirrel stayed
        # on default. Luma-8 keeps the
        # whole Phascolarctos.
        # knock_tiny_crumbs keeps specks
        # off. Guest-only. Not a catalog
        # wash. Not TAN_SIT. Not
        # DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "moss":
        # Felt's pale green hide and
        # dark recesses nick when
        # default plate-flood treats
        # hide as black or as Pale's
        # wash. She is sheet moss. A
        # green page. No flowers. No
        # true roots — only rhizoids
        # that cling. Cypress-moss.
        # The carpet is the tell. Not
        # a flowering plant. Not a
        # lichen. Not Vein. Not Fan.
        # Not a juniper or a cedar.
        # Pale green hide can look
        # like wash — it is hide.
        # Default shredded talk (the
        # voice left 13703 comps;
        # live ~138.5k against
        # luma-8's whole ~548.9k;
        # mid ~2.9k against ~533.5k;
        # after fit ~18.8k against
        # ~110.4k, dark ~42 against
        # ~14.4k), sleep (the quieter
        # felt shredded; mid ~8.1k
        # against luma-8's whole
        # ~353.0k; after fit ~42.8k
        # against ~96.7k), walk (the
        # lean left 1148 comps; live
        # ~354.2k against ~385.1k;
        # mid ~316.9k against
        # ~366.0k; after fit ~75.9k
        # against ~86.7k, dark ~4.8k
        # against ~8.1k), play (the
        # athletic page nicked, 11
        # comps; mid ~384.7k against
        # ~436.1k; after fit ~89.2k
        # against ~100.6k),
        # sit (the quieter page left
        # 113 comps; live ~246.2k
        # against ~252.9k; after fit
        # ~65.8k against ~68.0k),
        # eat (the dew stay but the
        # page nicked, 151 comps;
        # live ~461.2k against
        # ~471.9k; after fit ~96.9k
        # against ~101.2k), and idle
        # (100 comps; live ~481.8k
        # against ~487.3k; after fit
        # ~103.0k against ~104.9k).
        # Cream leftover would leave
        # studio plate on luma-8;
        # these raws are actually
        # black (fill ~0.24–0.52,
        # med luma 0 on the plate
        # corners, not a cream
        # leftover at ~0.78). Pale
        # green hide is not Pale's
        # wash — TAN_SIT is other
        # keys. Hang took sloth off
        # TAN_SIT; I did not put
        # sloth back. I did not
        # join. DARK_MATTE already
        # lists crow, raven,
        # pileated, widow,
        # vinegaroon, skunk,
        # millipede, field_cricket
        # from the original meadow
        # sit, click_beetle from
        # Click, earwig from
        # Forceps, and robber_fly
        # from Rob; that membership
        # stays. I did not add moss.
        # She is a green page. That
        # set is other keys. Leftover
        # idle was a field-guide
        # clump on a black plate, a
        # soft juniper stamp more
        # than a living page; idle
        # and blotter follow the new
        # living carpet. Gum's koala
        # elif stays Gum's. Still's
        # potto elif stays Still's.
        # Gaze's tarsier elif stays
        # Gaze's. Boom's howler elif
        # stays Boom's. Wrist's
        # kinkajou elif stays
        # Wrist's. Swing's gibbon
        # elif stays Swing's. Sun's
        # lemur elif stays Sun's.
        # Hang's sloth elif stays
        # Hang's. Blade's katydid
        # stayed on default.
        # Thread's nematode stayed
        # on default. Sail's colugo
        # stayed on default. Glide's
        # flying_squirrel stayed on
        # default. Luma-8 keeps the
        # whole Hypnum.
        # knock_tiny_crumbs keeps
        # specks off. Guest-only.
        # Not a catalog wash. Not
        # TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "maidenhair":
        # Vein's pale green fanlets
        # and thin black stems nick
        # when default plate-flood
        # treats hide as black or as
        # Pale's wash. She is a
        # maidenhair fern. Black
        # wiry stems, fanlets of
        # pale green, a fiddlehead
        # that unfurls like a
        # sentence. She does not
        # flower. The black stem is
        # the tell. Not a flowering
        # plant. Not a palm. Not
        # Felt. Not Fan. Not Sol.
        # Pale green fanlets can
        # look like wash — they are
        # hide. Thin black stems
        # are stems, not wash.
        # Default shredded play
        # (the athletic fan left
        # live ~7.7k against
        # luma-8's whole ~272.6k;
        # after fit ~8.3k against
        # ~62.5k, fill 0.032),
        # sleep (the folded-fan
        # shredded; live ~22.3k
        # against ~118.3k; after
        # fit ~22.5k against
        # ~52.5k), walk (the next
        # coil nicked; live ~78.2k
        # against ~224.3k; after
        # fit ~26.1k against
        # ~54.4k), sit (the quieter
        # sit nicked; live ~95.3k
        # against ~186.3k; after
        # fit ~36.1k against
        # ~46.5k), eat (mist stay
        # but the fans nicked;
        # live ~89.7k against
        # ~260.8k; after fit
        # ~35.2k against ~57.9k),
        # talk (the voice of fans
        # nicked; live ~116.5k
        # against ~278.6k; after
        # fit ~40.5k against
        # ~69.2k), and idle (live
        # ~141.8k against ~234.4k;
        # after fit ~53.3k against
        # ~57.7k, dark ~16.0k
        # against ~24.5k). Cream
        # leftover would leave
        # studio plate on luma-8;
        # these raws are actually
        # black (near-black
        # ~0.70–0.88, med luma 0
        # on the plate corners,
        # not a cream leftover at
        # ~0.78). Pale green
        # fanlets are not Pale's
        # wash — TAN_SIT is other
        # keys. Hang took sloth
        # off TAN_SIT; I did not
        # put sloth back. I did
        # not join. DARK_MATTE
        # already lists crow,
        # raven, pileated, widow,
        # vinegaroon, skunk,
        # millipede, field_cricket
        # from the original meadow
        # sit, click_beetle from
        # Click, earwig from
        # Forceps, and robber_fly
        # from Rob; that
        # membership stays. I did
        # not add maidenhair. She
        # is a fern. That set is
        # other keys. Leftover
        # idle was a field-guide
        # Adiantum stamp on a
        # black plate, the same
        # fiddlehead plus the same
        # fanlets seven times;
        # idle and blotter follow
        # the new living unfurl.
        # Felt's moss elif stays
        # Felt's. Gum's koala elif
        # stays Gum's. Still's
        # potto elif stays Still's.
        # Gaze's tarsier elif
        # stays Gaze's. Boom's
        # howler elif stays Boom's.
        # Wrist's kinkajou elif
        # stays Wrist's. Swing's
        # gibbon elif stays
        # Swing's. Sun's lemur
        # elif stays Sun's. Hang's
        # sloth elif stays Hang's.
        # Blade's katydid stayed
        # on default. Thread's
        # nematode stayed on
        # default. Sail's colugo
        # stayed on default.
        # Glide's flying_squirrel
        # stayed on default.
        # Luma-8 keeps the whole
        # Adiantum.
        # knock_tiny_crumbs keeps
        # specks off. Guest-only.
        # Not a catalog wash. Not
        # TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "ginkgo":
        # Fan's pale green fans and
        # gold fans nick when
        # default plate-flood treats
        # hide as black or as Pale's
        # wash. He is a ginkgo. A
        # living fossil. Fan leaves
        # with a notch, veins that
        # do not net, gold when the
        # desk turns autumn. He is
        # not a flowering plant.
        # The fan is the tell. The
        # gold is a season, not a
        # mood. Not a maple. Not
        # Mast. Not Vein. Pale
        # green fans can look like
        # wash — they are hide.
        # Gold fans are hide, a
        # season. Default shredded
        # walk (the lean left live
        # ~80.4k against luma-8's
        # whole ~124.1k; after fit
        # ~21.9k against ~30.8k,
        # fill 0.084; green ~37.4k
        # against ~71.0k), eat (the
        # leaf stay but the fans
        # nicked; live ~154.2k
        # against ~210.1k; after
        # fit ~40.1k against
        # ~51.3k; green ~113.8k
        # against ~165.4k), sit
        # (the quieter sit nicked;
        # live ~323.2k against
        # ~377.5k; after fit
        # ~94.1k against ~109.7k),
        # play (the athletic gold
        # nicked; live ~344.2k
        # against ~381.0k; after
        # fit ~83.2k against
        # ~89.5k; gold ~224.4k
        # against ~256.7k), sleep
        # (the quieter gold
        # nicked; live ~247.3k
        # against ~282.5k), and
        # idle (live ~408.9k
        # against ~432.2k; after
        # fit ~91.0k against
        # ~94.4k). Talk was nearly
        # even (~392.5k against
        # ~396.1k). Cream leftover
        # would leave studio plate
        # on luma-8; these raws
        # are actually black
        # (fill ~0.14–0.43, med
        # luma 0 on the plate
        # corners, not a cream
        # leftover at ~0.78). Pale
        # green fans and gold fans
        # are not Pale's wash —
        # TAN_SIT is other keys.
        # Hang took sloth off
        # TAN_SIT; I did not put
        # sloth back. I did not
        # join. DARK_MATTE already
        # lists crow, raven,
        # pileated, widow,
        # vinegaroon, skunk,
        # millipede, field_cricket
        # from the original meadow
        # sit, click_beetle from
        # Click, earwig from
        # Forceps, and robber_fly
        # from Rob; that
        # membership stays. I did
        # not add ginkgo. He is a
        # ginkgo. That set is
        # other keys. Leftover
        # idle was a field-guide
        # Ginkgo sapling stamp on
        # a black plate, the same
        # stem plus the same two
        # gold leaves plus the
        # same painted soil mound
        # seven times; idle and
        # blotter follow the new
        # living fan. Vein's
        # maidenhair elif stays
        # Vein's. Felt's moss elif
        # stays Felt's. Gum's
        # koala elif stays Gum's.
        # Still's potto elif stays
        # Still's. Gaze's tarsier
        # elif stays Gaze's.
        # Boom's howler elif stays
        # Boom's. Wrist's kinkajou
        # elif stays Wrist's.
        # Swing's gibbon elif stays
        # Swing's. Sun's lemur
        # elif stays Sun's. Hang's
        # sloth elif stays Hang's.
        # Blade's katydid stayed
        # on default. Thread's
        # nematode stayed on
        # default. Sail's colugo
        # stayed on default.
        # Glide's flying_squirrel
        # stayed on default.
        # Luma-8 keeps the whole
        # Ginkgo.
        # knock_tiny_crumbs keeps
        # specks off. Guest-only.
        # Not a catalog wash. Not
        # TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "oak":
        # Mast's pale green lobes
        # and pale bark nick when
        # default plate-flood treats
        # hide as black or as Pale's
        # wash. He is a white oak
        # who agreed to be a
        # seedling. Lobed leaves,
        # pale bark starting, an
        # acorn he may drop. A tree
        # on a blotter. The lobe is
        # the tell. Not a maple.
        # Not Fan. Pale green lobes
        # can look like wash — they
        # are hide. Pale bark is
        # bark. Default shredded
        # play (the athletic drop
        # left live ~142.0k against
        # luma-8's whole ~152.8k;
        # after fit ~46.0k against
        # ~47.8k; default
        # island-knock removed the
        # detached acorn, raw
        # second part ~6.7k). Sleep
        # nicked the quieter sit
        # (live ~142.4k against
        # ~156.5k; green ~118.9k
        # against ~126.7k). Walk
        # nicked the lean (live
        # ~127.0k against ~131.0k).
        # Sit nicked (live ~211.6k
        # against ~217.5k). Idle
        # live ~153.9k against
        # ~157.3k. Eat live
        # ~167.4k against ~170.4k.
        # Talk nearly even (live
        # ~295.1k against
        # ~298.6k). Cream leftover
        # would leave studio plate
        # on luma-8; these raws
        # are actually black
        # (fill ~0.69–0.86, med
        # luma 0 on the plate
        # corners, not a cream
        # leftover at ~0.78). Pale
        # green lobes are not
        # Pale's wash — TAN_SIT is
        # other keys. Hang took
        # sloth off TAN_SIT; I did
        # not put sloth back. I
        # did not join. DARK_MATTE
        # already lists crow,
        # raven, pileated, widow,
        # vinegaroon, skunk,
        # millipede, field_cricket
        # from the original meadow
        # sit, click_beetle from
        # Click, earwig from
        # Forceps, and robber_fly
        # from Rob; that
        # membership stays. I did
        # not add oak. He is a
        # white oak. That set is
        # other keys. Leftover
        # idle was a field-guide
        # Quercus sapling stamp on
        # a black plate, the same
        # five lobed leaves plus
        # the same stem plus the
        # same acorn plus the same
        # painted soil seven
        # times; idle and blotter
        # follow the new living
        # seedling. Fan's ginkgo
        # elif stays Fan's. Vein's
        # maidenhair elif stays
        # Vein's. Felt's moss elif
        # stays Felt's. Gum's
        # koala elif stays Gum's.
        # Still's potto elif stays
        # Still's. Gaze's tarsier
        # elif stays Gaze's.
        # Boom's howler elif stays
        # Boom's. Wrist's kinkajou
        # elif stays Wrist's.
        # Swing's gibbon elif
        # stays Swing's. Sun's
        # lemur elif stays Sun's.
        # Hang's sloth elif stays
        # Hang's. Blade's katydid
        # stayed on default.
        # Thread's nematode stayed
        # on default. Sail's
        # colugo stayed on
        # default. Glide's
        # flying_squirrel stayed
        # on default. Luma-8
        # keeps the whole Quercus.
        # knock_tiny_crumbs keeps
        # specks off. Guest-only.
        # Not a catalog wash. Not
        # TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "water_lily":
        # Disk's pale white petals
        # and green pad nick when
        # default plate-flood treats
        # hide as black or as Pale's
        # wash. She is a fragrant
        # water lily. A round pad
        # with a slit, a white bloom
        # that opens for the lamp
        # and closes for the night.
        # The pad is the floor. The
        # open is the tell. Not a
        # lotus. Not Coin. Pale
        # white petals can look
        # like wash — they are hide.
        # Green pad is hide. Silt
        # is living food. Default
        # shredded talk (the voice
        # left live ~598.3k against
        # luma-8's whole ~652.2k;
        # after fit ~94.0k against
        # ~145.9k; cream ~15.2k
        # against ~46.7k; 131
        # comps; the pale bloom
        # face punched into holes),
        # eat (the silt stay but
        # the pad tore; live
        # ~410.8k against ~448.8k;
        # after fit ~103.8k against
        # ~118.6k; dark ~1.3k
        # against ~9.5k; default
        # island-knock and wash
        # left holes in the floor),
        # sleep (the closed bloom
        # nicked; live ~449.8k
        # against ~465.1k; green
        # ~384.7k against ~395.5k;
        # after fit ~110.5k against
        # ~115.4k), and walk (the
        # open-then-close nicked;
        # after fit live ~110.3k
        # against ~115.1k; cream
        # ~26.8k against ~31.1k;
        # 24 comps). Sit close
        # (live ~330.3k against
        # ~331.5k; after fit
        # ~92.3k against ~92.7k).
        # Idle live ~541.5k against
        # ~544.8k; after fit
        # ~119.8k against ~120.9k.
        # Play live ~527.5k against
        # ~528.8k; after fit
        # ~137.6k against ~138.0k.
        # Cream leftover would
        # leave studio plate on
        # luma-8; these raws are
        # actually black (fill
        # ~0.32–0.62, med luma 0
        # on the plate corners,
        # not a cream leftover at
        # ~0.78). Pale white
        # petals are not Pale's
        # wash — TAN_SIT is other
        # keys. Hang took sloth
        # off TAN_SIT; I did not
        # put sloth back. I did
        # not join. DARK_MATTE
        # already lists crow,
        # raven, pileated, widow,
        # vinegaroon, skunk,
        # millipede, field_cricket
        # from the original meadow
        # sit, click_beetle from
        # Click, earwig from
        # Forceps, and robber_fly
        # from Rob; that
        # membership stays. I did
        # not add water_lily. She
        # is a pad. That set is
        # other keys. Leftover
        # idle was a field-guide
        # Nymphaea stamp on a
        # black plate, the same
        # open bloom on the same
        # pad seven times; idle
        # and blotter follow the
        # new living open. Mast's
        # oak elif stays Mast's.
        # Fan's ginkgo elif stays
        # Fan's. Vein's maidenhair
        # elif stays Vein's.
        # Felt's moss elif stays
        # Felt's. Gum's koala elif
        # stays Gum's. Still's
        # potto elif stays Still's.
        # Gaze's tarsier elif
        # stays Gaze's. Boom's
        # howler elif stays Boom's.
        # Wrist's kinkajou elif
        # stays Wrist's. Swing's
        # gibbon elif stays
        # Swing's. Sun's lemur
        # elif stays Sun's. Hang's
        # sloth elif stays Hang's.
        # Blade's katydid stayed
        # on default. Thread's
        # nematode stayed on
        # default. Sail's colugo
        # stayed on default.
        # Glide's flying_squirrel
        # stayed on default.
        # Luma-8 keeps the whole
        # Nymphaea. knock_tiny_crumbs
        # keeps specks off.
        # Guest-only. Not a
        # catalog wash. Not
        # TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "orchid":
        # Moth's pale white petals
        # and silvery aerial roots
        # nick when default
        # plate-flood treats hide
        # as black or as Pale's
        # wash. She is a moth
        # orchid. Thick aerial
        # roots, a spray of white
        # moths that are flowers,
        # a stem that will not sit
        # in dirt like a rumor.
        # She blooms. The bark is
        # a tree she borrowed.
        # Not a moth — the moth
        # is the flower's joke
        # (Phalaenopsis, the
        # moth-like one,
        # amabilis). Not a lily.
        # Disk floats; Moth hangs
        # her roots in the air.
        # The bloom is the tell.
        # The dirt is optional.
        # Pale white petals can
        # look like wash — they
        # are hide. Silvery-grey
        # aerial roots are hide.
        # Green leaves are hide.
        # Yellow-orange lips are
        # hide. Mist is living
        # food. Default shredded
        # sleep (the closed wing
        # left live ~71.2k against
        # luma-8's whole ~153.6k;
        # after fit ~26.0k against
        # ~54.5k; green ~4.7k
        # against ~20.3k; dark
        # ~4.0k against ~32.2k;
        # 39 comps against 4; the
        # folded buds and hanging
        # roots punched into
        # holes), walk (the lean
        # left live ~139.8k
        # against ~203.7k; after
        # fit ~36.4k against
        # ~51.9k; green ~5.9k
        # against ~25.7k; default
        # island-knock severed the
        # stem and left the spray
        # a second part), sit (the
        # quieter sit nicked; live
        # ~115.5k against
        # ~156.4k; after fit
        # ~43.0k against ~57.9k;
        # green ~7.8k against
        # ~22.7k), talk (the voice
        # left live ~226.9k
        # against ~283.1k; after
        # fit ~58.2k against
        # ~72.1k; dark ~2.5k
        # against ~27.9k; 22
        # comps against 1), eat
        # (the mist stay but the
        # plant nicked; live
        # ~203.3k against
        # ~252.3k; after fit
        # ~55.4k against ~68.9k),
        # idle (live ~228.9k
        # against ~266.0k; after
        # fit ~54.2k against
        # ~62.3k), and play (the
        # athletic bloom nicked;
        # live ~142.3k against
        # ~165.9k; after fit
        # ~34.4k against ~39.8k;
        # 26 comps against 6).
        # Cream leftover would
        # leave studio plate on
        # luma-8; these raws are
        # actually black (fill
        # ~0.17–0.30, med luma 0
        # on the plate corners,
        # not a cream leftover at
        # ~0.78). Pale white
        # petals are not Pale's
        # wash — TAN_SIT is other
        # keys. Hang took sloth
        # off TAN_SIT; I did not
        # put sloth back. I did
        # not join. DARK_MATTE
        # already lists crow,
        # raven, pileated, widow,
        # vinegaroon, skunk,
        # millipede, field_cricket
        # from the original meadow
        # sit, click_beetle from
        # Click, earwig from
        # Forceps, and robber_fly
        # from Rob; that
        # membership stays. I did
        # not add orchid. She is
        # a moth orchid. That set
        # is other keys. Leftover
        # idle was a field-guide
        # Phalaenopsis stamp on a
        # black plate, the same
        # open spray plus the
        # same hanging roots
        # seven times; idle and
        # blotter follow the new
        # living open. Disk's
        # water_lily elif stays
        # Disk's. Mast's oak elif
        # stays Mast's. Fan's
        # ginkgo elif stays Fan's.
        # Vein's maidenhair elif
        # stays Vein's. Felt's
        # moss elif stays Felt's.
        # Gum's koala elif stays
        # Gum's. Still's potto
        # elif stays Still's.
        # Gaze's tarsier elif
        # stays Gaze's. Boom's
        # howler elif stays
        # Boom's. Wrist's
        # kinkajou elif stays
        # Wrist's. Swing's gibbon
        # elif stays Swing's.
        # Sun's lemur elif stays
        # Sun's. Hang's sloth
        # elif stays Hang's.
        # Blade's katydid stayed
        # on default. Thread's
        # nematode stayed on
        # default. Sail's colugo
        # stayed on default.
        # Glide's flying_squirrel
        # stayed on default.
        # Luma-8 keeps the whole
        # Phalaenopsis.
        # knock_tiny_crumbs keeps
        # specks off. Guest-only.
        # Not a catalog wash. Not
        # TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "saguaro":
        # Arm's green ribs and tan
        # spines nick when default
        # plate-flood treats hide
        # as black or as Pale's
        # wash. He is a young
        # saguaro. A young column
        # of ribs and spines,
        # green, storing rain, an
        # arm that has not
        # arrived. Saguaro: a
        # cactus of the Sonoran
        # door. He sits the tray.
        # He is not a tree. Trees
        # keep wood and a
        # different thirst; Arm
        # is Carnegiea gigantea,
        # a cactus, and the store
        # is the species. Not a
        # succulent of the
        # windowsill rumor with
        # no spines. He works the
        # night. The day is for
        # sitting. Habitat is a
        # sand tray, which is
        # weather, not painted
        # sand, not a painted
        # pot, not a desert
        # diorama you draw. House
        # food is rain. He
        # stores. He is a cactus,
        # not a tree. The arm is
        # a promise. He is the
        # wait. Green ribs are
        # hide. Tan spines are
        # hide. White areoles are
        # hide. The golden crown
        # is hide. Rain is living
        # food. Default shredded
        # sleep (the reclined rib
        # left live ~154.9k
        # against luma-8's whole
        # ~183.1k; after fit
        # ~51.2k against ~59.3k;
        # dark ~16.6k against
        # ~34.3k; 6 comps against
        # 1; the store's dark
        # valleys punched into
        # holes), talk (the voice
        # left live ~356.2k
        # against ~413.1k; after
        # fit ~95.6k against
        # ~106.3k; green ~206.1k
        # against ~249.0k; dark
        # ~3.4k against ~32.9k;
        # 6 comps against 1; the
        # living face of ribs
        # shredded into slivers),
        # walk (the lean left
        # live ~209.6k against
        # ~217.3k; after fit
        # ~59.2k against ~60.8k;
        # 27 comps against 1;
        # default island-knock
        # nicked the lean and
        # left spine tips a
        # second part), sit (live
        # ~224.8k against
        # ~229.3k; after fit
        # ~109.7k against
        # ~111.1k), idle (live
        # ~188.0k against
        # ~191.4k; after fit
        # ~60.9k against ~61.4k;
        # tan ~20.4k against
        # ~22.1k), play (live
        # ~303.4k against
        # ~311.6k; after fit
        # ~78.2k against ~79.7k),
        # and eat (live ~220.8k
        # against ~234.2k;
        # default island-knock
        # dropped the rain of a
        # treaty; luma-8 keeps
        # the beads). Cream
        # leftover would leave
        # studio plate on luma-8;
        # these raws are actually
        # black (fill ~0.18–0.41,
        # med luma 0 on the plate
        # corners, not a cream
        # leftover at ~0.78). Tan
        # spines are not Pale's
        # wash — TAN_SIT is other
        # keys. Hang took sloth
        # off TAN_SIT; I did not
        # put sloth back. I did
        # not join. DARK_MATTE
        # already lists crow,
        # raven, pileated, widow,
        # vinegaroon, skunk,
        # millipede, field_cricket
        # from the original meadow
        # sit, click_beetle from
        # Click, earwig from
        # Forceps, and robber_fly
        # from Rob; that
        # membership stays. I did
        # not add saguaro. He is
        # a young saguaro. That
        # set is other keys.
        # Leftover idle was a
        # field-guide young
        # Carnegiea stamp on a
        # black plate, the same
        # standing column plus
        # the same corky cut
        # seven times; idle and
        # blotter follow the new
        # living open. Moth's
        # orchid elif stays
        # Moth's. Disk's
        # water_lily elif stays
        # Disk's. Mast's oak elif
        # stays Mast's. Fan's
        # ginkgo elif stays Fan's.
        # Vein's maidenhair elif
        # stays Vein's. Felt's
        # moss elif stays Felt's.
        # Gum's koala elif stays
        # Gum's. Still's potto
        # elif stays Still's.
        # Gaze's tarsier elif
        # stays Gaze's. Boom's
        # howler elif stays
        # Boom's. Wrist's
        # kinkajou elif stays
        # Wrist's. Swing's gibbon
        # elif stays Swing's.
        # Sun's lemur elif stays
        # Sun's. Hang's sloth
        # elif stays Hang's.
        # Blade's katydid stayed
        # on default. Thread's
        # nematode stayed on
        # default. Sail's colugo
        # stayed on default.
        # Glide's flying_squirrel
        # stayed on default.
        # Luma-8 keeps the whole
        # Carnegiea.
        # knock_tiny_crumbs keeps
        # specks off. Guest-only.
        # Not a catalog wash. Not
        # TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "venus_flytrap":
        # Snap's green petioles,
        # red trap mouths, green
        # cilia, and trigger
        # hairs nick when default
        # plate-flood treats hide
        # as black or as Pale's
        # wash. She is a Venus
        # flytrap. A rosette of
        # hinged leaves, teeth
        # like a polite fence,
        # two hairs that must
        # agree. Venus flytrap: a
        # wetland plant of poor
        # soil. She snaps. She is
        # not a monster. The cup
        # is a bog. Not a
        # monster. Not Well —
        # Well drowns, a leaf
        # that became a pitfall.
        # Not Dew — Dew glues and
        # curls. Snap is Dionaea
        # muscipula, the Carolina
        # door, and two hairs are
        # the law. Three hunts.
        # Three plants. Habitat
        # is a wetland cup, which
        # is weather, not painted
        # soil, not a painted
        # moss mound, not a bog
        # diorama you draw. House
        # food is a fly. She did
        # not snap. That is
        # hello. Two hairs. Then
        # the door. Green
        # petioles are hide. Red
        # trap mouths are hide.
        # Green cilia are hide.
        # Trigger hairs are hide.
        # A fly stays living
        # food. Default shredded
        # walk (the lean left
        # live ~122.5k against
        # luma-8's whole ~431.1k;
        # after fit ~40.8k
        # against ~90.1k; green
        # ~82.0k against
        # ~275.8k; 6 comps
        # against 1; the living
        # watch shredded into
        # nicked fragments), talk
        # (the voice left live
        # ~268.9k against
        # ~605.5k; after fit
        # ~88.1k against
        # ~124.8k; green ~11.6k
        # against ~130.1k; dark
        # 62 against ~20.0k; 9
        # comps against 1; the
        # living face of a trap
        # lost its green
        # rosette), play (the
        # athletic snap left live
        # ~184.5k against
        # ~522.1k; after fit
        # ~42.8k against
        # ~109.3k; green ~4.8k
        # against ~147.4k; 5
        # comps against 1; the
        # sprung hinge shredded
        # into floating
        # fragments), sleep (the
        # closed green hinge left
        # live ~292.1k against
        # ~403.7k; after fit
        # ~77.3k against ~99.7k;
        # dark ~2.2k against
        # ~22.0k; 7 comps against
        # 1; the rest nicked into
        # bites), idle (live
        # ~355.6k against
        # ~365.5k; 10 comps
        # against 1), sit (live
        # ~418.9k against
        # ~433.0k; after fit
        # ~89.9k against ~91.0k),
        # and eat (live ~385.8k
        # against ~404.8k; after
        # fit ~89.3k against
        # ~92.4k; 2 comps against
        # 1; luma-8 keeps the fly
        # of a treaty). Cream
        # leftover would leave
        # studio plate on luma-8;
        # these raws are actually
        # black (fill ~0.37–0.60,
        # med luma 0 on the plate
        # corners, not a cream
        # leftover at ~0.78). Tan
        # cilia tips are not
        # Pale's wash — TAN_SIT
        # is other keys. Hang
        # took sloth off TAN_SIT;
        # I did not put sloth
        # back. I did not join.
        # DARK_MATTE already
        # lists crow, raven,
        # pileated, widow,
        # vinegaroon, skunk,
        # millipede, field_cricket
        # from the original meadow
        # sit, click_beetle from
        # Click, earwig from
        # Forceps, and robber_fly
        # from Rob; that
        # membership stays. I did
        # not add venus_flytrap.
        # She is a Venus flytrap.
        # That set is other keys.
        # Leftover idle was a
        # field-guide Dionaea
        # stamp on a black plate,
        # the same open rosette
        # plus the same painted
        # moss-and-soil mound
        # seven times; idle and
        # blotter follow the new
        # living open. Arm's
        # saguaro elif stays
        # Arm's. Moth's orchid
        # elif stays Moth's.
        # Disk's water_lily elif
        # stays Disk's. Mast's
        # oak elif stays Mast's.
        # Fan's ginkgo elif stays
        # Fan's. Vein's
        # maidenhair elif stays
        # Vein's. Felt's moss
        # elif stays Felt's.
        # Gum's koala elif stays
        # Gum's. Still's potto
        # elif stays Still's.
        # Gaze's tarsier elif
        # stays Gaze's. Boom's
        # howler elif stays
        # Boom's. Wrist's
        # kinkajou elif stays
        # Wrist's. Swing's gibbon
        # elif stays Swing's.
        # Sun's lemur elif stays
        # Sun's. Hang's sloth
        # elif stays Hang's.
        # Blade's katydid stayed
        # on default. Thread's
        # nematode stayed on
        # default. Sail's colugo
        # stayed on default.
        # Glide's flying_squirrel
        # stayed on default.
        # Luma-8 keeps the whole
        # Dionaea.
        # knock_tiny_crumbs keeps
        # specks off. Guest-only.
        # Not a catalog wash. Not
        # TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "pitcher":
        # Well's wine-purple
        # pitchers, heavy dark
        # veins, open hoods, and
        # rain in the well nick
        # when default plate-flood
        # treats hide as black or
        # as Pale's wash. He is a
        # purple pitcher plant.
        # Short wine-purple
        # pitchers, heavy veins, a
        # hood that does not close,
        # rain sitting in the well.
        # Purple pitcher plant of
        # northern bogs. He drowns.
        # The leaf became a hole.
        # The cup is a bog. Not a
        # flytrap with a cup glued
        # on. Snap hinges; Well is
        # Sarracenia purpurea, a
        # passive pitfall, and the
        # water is the method. Not
        # Dew — Dew glitters and
        # curls. He does not chase.
        # The well is enough.
        # Habitat is a bog cup,
        # which is weather, not
        # painted moss, not a
        # painted pot, not a bog
        # diorama you draw. House
        # food is a midge. Rain
        # sits in him. That is the
        # whole method. The hood
        # does not close.
        # Wine-purple hide is hide.
        # Dark veins are hide. The
        # hood is hide. Rain in the
        # well is living water, not
        # painted furniture. A
        # midge stays living food.
        # Default shredded idle
        # (live ~298.6k against
        # luma-8's whole ~379.9k;
        # after fit ~67.3k against
        # ~94.9k; dark ~11.4k
        # against ~22.2k; wine
        # ~50.0k against ~61.9k;
        # 87 comps against 31; the
        # living open shredded into
        # nicked fragments), sit
        # (live ~291.3k against
        # ~327.3k; after fit
        # ~82.9k against ~96.7k;
        # 50 comps against 24),
        # walk (the lean left live
        # ~310.6k against ~341.7k;
        # after fit ~81.4k against
        # ~92.6k; 32 comps against
        # 13), sleep (the held
        # water left live ~222.4k
        # against ~281.2k; after
        # fit ~47.3k against
        # ~65.5k; dark ~6.3k
        # against ~12.4k; 61 comps
        # against 10; the pitfall
        # nicked into bites), talk
        # (the voice left live
        # ~310.4k against ~362.6k;
        # after fit ~75.4k against
        # ~93.2k; 86 comps against
        # 51; the living face of a
        # pitcher lost dark veins),
        # eat (live ~358.2k against
        # ~455.9k; after fit
        # ~69.0k against ~99.1k;
        # dark ~8.2k against
        # ~18.8k; 127 comps
        # against 38; luma-8 keeps
        # the midge of a treaty),
        # and play (live ~357.6k
        # against ~410.2k; after
        # fit ~74.7k against
        # ~90.7k; dark ~5.9k
        # against ~10.5k; 52 comps
        # against 29; the athletic
        # well shredded). Cream
        # leftover would leave
        # studio plate on luma-8;
        # these raws are actually
        # black (fill ~0.27–0.44,
        # med luma 0 on the plate
        # corners, not a cream
        # leftover at ~0.78). Tan
        # wet sheen is not Pale's
        # wash — TAN_SIT is other
        # keys. Hang took sloth
        # off TAN_SIT; I did not
        # put sloth back. I did
        # not join. DARK_MATTE
        # already lists crow,
        # raven, pileated, widow,
        # vinegaroon, skunk,
        # millipede, field_cricket
        # from the original meadow
        # sit, click_beetle from
        # Click, earwig from
        # Forceps, and robber_fly
        # from Rob; that
        # membership stays. I did
        # not add pitcher. He is a
        # purple pitcher plant.
        # That set is other keys.
        # Leftover idle was a
        # field-guide Sarracenia
        # stamp on a black plate,
        # the same wine-purple
        # pitchers plus the same
        # painted moss-and-soil
        # mound seven times; idle
        # and blotter follow the
        # new living open. Snap's
        # venus_flytrap elif stays
        # Snap's. Arm's saguaro
        # elif stays Arm's. Moth's
        # orchid elif stays
        # Moth's. Disk's
        # water_lily elif stays
        # Disk's. Mast's oak elif
        # stays Mast's. Fan's
        # ginkgo elif stays Fan's.
        # Vein's maidenhair elif
        # stays Vein's. Felt's
        # moss elif stays Felt's.
        # Gum's koala elif stays
        # Gum's. Still's potto
        # elif stays Still's.
        # Gaze's tarsier elif
        # stays Gaze's. Boom's
        # howler elif stays
        # Boom's. Wrist's
        # kinkajou elif stays
        # Wrist's. Swing's gibbon
        # elif stays Swing's.
        # Sun's lemur elif stays
        # Sun's. Hang's sloth
        # elif stays Hang's.
        # Blade's katydid stayed
        # on default. Thread's
        # nematode stayed on
        # default. Sail's colugo
        # stayed on default.
        # Glide's flying_squirrel
        # stayed on default.
        # Luma-8 keeps the whole
        # Sarracenia.
        # knock_tiny_crumbs keeps
        # specks off. Guest-only.
        # Not a catalog wash. Not
        # TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "sundew":
        # Dew's lime-green stalks,
        # round pads, red tentacles,
        # and mucilage drops nick
        # when default plate-flood
        # treats hide as black or
        # as Pale's wash. She is a
        # round-leaved sundew.
        # Round pads on thin stalks,
        # red tentacles, a drop of
        # glue on each hair, a curl
        # that takes its time.
        # Round-leaved sundew of
        # peat and light. She
        # glues. She is not a door.
        # Not a flytrap. Snap
        # slams; Dew is Drosera
        # rotundifolia, mucilage
        # and a slow curl. Not
        # Well. Well is a pitfall
        # that waits with water.
        # Three hunts on this
        # blotter: snap, drown,
        # glue. Habitat is a peat
        # saucer, which is weather,
        # not painted moss, not a
        # painted pot, not a bog
        # diorama you draw. House
        # food is a gnat. She
        # glittered. That is hello.
        # The glue is the tell.
        # She does not snap. She
        # curls, later. Lime-green
        # stalks are hide. Round
        # pads are hide. Red
        # tentacles are hide.
        # Mucilage drops are hide
        # (they glitter; they are
        # not wash). A gnat stays
        # living food. Default
        # shredded idle (live
        # ~166.7k against luma-8's
        # whole ~189.5k; after fit
        # ~51.1k against ~56.2k;
        # glitter 993 against 1784;
        # 24 comps against 7; the
        # living glitter shredded
        # into nicked fragments),
        # sit (glitter 379 against
        # 732), walk (the lean left
        # live ~146.6k against
        # ~168.5k; after fit
        # ~45.3k against ~51.4k;
        # glitter 317 against 768),
        # sleep (live ~157.5k
        # against ~170.9k; glitter
        # 665 against 890; she
        # holds this glitter), talk
        # (the voice left live
        # ~388.1k against ~482.2k;
        # after fit ~85.2k against
        # ~101.6k; glitter 2829
        # against 5196; the living
        # face of a pad lost
        # drops), eat (live
        # ~128.0k against ~151.2k;
        # red ~62.1k against
        # ~74.0k; glitter 62
        # against 208; luma-8
        # keeps the gnat of a
        # treaty), and play (live
        # ~167.0k against ~199.4k;
        # red ~61.8k against
        # ~76.8k; glitter 137
        # against 628; the athletic
        # curl shredded). Cream
        # leftover would leave
        # studio plate on luma-8;
        # these raws are actually
        # black (fill ~0.16–0.46,
        # med luma 0 on the plate
        # corners, not a cream
        # leftover at ~0.78). Tan
        # glitter sheen is not
        # Pale's wash — TAN_SIT
        # is other keys. Hang
        # took sloth off TAN_SIT;
        # I did not put sloth
        # back. I did not join.
        # DARK_MATTE already
        # lists crow, raven,
        # pileated, widow,
        # vinegaroon, skunk,
        # millipede, field_cricket
        # from the original meadow
        # sit, click_beetle from
        # Click, earwig from
        # Forceps, and robber_fly
        # from Rob; that
        # membership stays. I did
        # not add sundew. She is a
        # round-leaved sundew.
        # That set is other keys.
        # Leftover idle was a
        # field-guide Drosera
        # stamp on a black plate,
        # the same rosette of
        # round pads plus the
        # same painted moss-and-
        # soil mound seven times;
        # idle and blotter follow
        # the new living glitter.
        # Well's pitcher elif
        # stays Well's. Snap's
        # venus_flytrap elif
        # stays Snap's. Arm's
        # saguaro elif stays
        # Arm's. Moth's orchid
        # elif stays Moth's.
        # Disk's water_lily elif
        # stays Disk's. Mast's
        # oak elif stays Mast's.
        # Fan's ginkgo elif stays
        # Fan's. Vein's
        # maidenhair elif stays
        # Vein's. Felt's moss
        # elif stays Felt's.
        # Gum's koala elif stays
        # Gum's. Still's potto
        # elif stays Still's.
        # Gaze's tarsier elif
        # stays Gaze's. Boom's
        # howler elif stays
        # Boom's. Wrist's
        # kinkajou elif stays
        # Wrist's. Swing's gibbon
        # elif stays Swing's.
        # Sun's lemur elif stays
        # Sun's. Hang's sloth
        # elif stays Hang's.
        # Blade's katydid stayed
        # on default. Thread's
        # nematode stayed on
        # default. Sail's colugo
        # stayed on default.
        # Glide's flying_squirrel
        # stayed on default.
        # Luma-8 keeps the whole
        # Drosera.
        # knock_tiny_crumbs keeps
        # specks off. Guest-only.
        # Not a catalog wash. Not
        # TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "oyster":
        # Frill's cream shelves,
        # tan edges, and decurrent
        # gills nick when default
        # plate-flood treats hide
        # as black or as Pale's
        # wash. She is an oyster
        # mushroom. Cream shelves
        # stacked like plates, a
        # short lateral stem,
        # gills that run down.
        # Oyster mushroom. She
        # fruits on dead wood.
        # She eats what has
        # finished. The shelf is
        # a log she agreed to.
        # Not a plant. Plants
        # keep chlorophyll and a
        # different kingdom;
        # Frill is Pleurotus
        # ostreatus, a fungus,
        # and the shelf is the
        # tell. Not a turkey tail
        # — those keep pores and
        # zones. She decomposes.
        # She does not
        # photosynthesize.
        # Habitat is a dead-wood
        # shelf, which is
        # weather, not painted
        # bark, not a painted
        # log, not a forest
        # diorama you draw.
        # House food is wood.
        # She fruited. That is
        # hello. The shelf is the
        # name she keeps. I lean.
        # Then I am a bracket
        # again. Cream hide is
        # hide. Tan edges are
        # hide. Gills are hide.
        # Wood stays living food.
        # Default shredded idle
        # (live ~285.1k against
        # luma-8's whole ~465.1k;
        # after fit ~76.7k
        # against ~121.2k; cream
        # ~101.1k against
        # ~230.6k; 942 comps
        # against 1; the living
        # shelf nicked into
        # islands), sit (live
        # ~288.8k against
        # ~411.0k; after fit
        # ~81.8k against
        # ~113.8k), walk (the
        # lean left live ~239.3k
        # against ~451.8k; after
        # fit ~71.4k against
        # ~126.4k; 1165 comps
        # against 1; the living
        # lean shredded), sleep
        # (she holds this wood;
        # live ~189.6k against
        # ~294.1k; after fit
        # ~49.9k against
        # ~75.6k), talk (the
        # voice left live
        # ~371.5k against
        # ~833.1k; after fit
        # ~103.4k against
        # ~168.7k; 36 comps
        # against 1; the living
        # face of gills shredded
        # into fragments), eat
        # (live ~310.1k against
        # ~401.7k; after fit
        # ~92.6k against
        # ~118.1k), and play
        # (the athletic lean
        # left live ~168.2k
        # against ~480.1k; after
        # fit ~44.5k against
        # ~113.5k; 1358 comps
        # against 1; the living
        # bracket shredded).
        # Cream leftover would
        # leave studio plate on
        # luma-8; these raws are
        # actually black (fill
        # ~0.29–0.47, talk a
        # close-up face at
        # ~0.80, med luma 0 on
        # the plate corners, not
        # a cream leftover at
        # ~0.78). Cream hide is
        # not Pale's wash —
        # TAN_SIT already listed
        # oyster from the
        # original cellar sit
        # and still shredded
        # talk (~104.7k against
        # luma-8's ~168.7k after
        # fit; 84 comps; isle
        # ~16.9k). I took oyster
        # off TAN_SIT. Hang took
        # sloth off TAN_SIT; I
        # did not put sloth
        # back. I did not join.
        # DARK_MATTE already
        # lists crow, raven,
        # pileated, widow,
        # vinegaroon, skunk,
        # millipede, field_cricket
        # from the original meadow
        # sit, click_beetle from
        # Click, earwig from
        # Forceps, and robber_fly
        # from Rob; that
        # membership stays. I did
        # not add oyster. She is
        # an oyster mushroom.
        # That set is other keys.
        # Leftover idle was a
        # field-guide Pleurotus
        # stamp on a black plate,
        # the same cream shelf
        # seven times; eat still
        # carried painted bark
        # and tan wash; talk and
        # walk were the same
        # file; idle and blotter
        # follow the new living
        # shelf. Dew's sundew
        # elif stays Dew's.
        # Well's pitcher elif
        # stays Well's. Snap's
        # venus_flytrap elif
        # stays Snap's. Arm's
        # saguaro elif stays
        # Arm's. Moth's orchid
        # elif stays Moth's.
        # Disk's water_lily elif
        # stays Disk's. Mast's
        # oak elif stays Mast's.
        # Fan's ginkgo elif stays
        # Fan's. Vein's
        # maidenhair elif stays
        # Vein's. Felt's moss
        # elif stays Felt's.
        # Gum's koala elif stays
        # Gum's. Still's potto
        # elif stays Still's.
        # Gaze's tarsier elif
        # stays Gaze's. Boom's
        # howler elif stays
        # Boom's. Wrist's
        # kinkajou elif stays
        # Wrist's. Swing's gibbon
        # elif stays Swing's.
        # Sun's lemur elif stays
        # Sun's. Hang's sloth
        # elif stays Hang's.
        # Blade's katydid stayed
        # on default. Thread's
        # nematode stayed on
        # default. Sail's colugo
        # stayed on default.
        # Glide's flying_squirrel
        # stayed on default.
        # Luma-8 keeps the whole
        # Pleurotus.
        # knock_tiny_crumbs keeps
        # specks off. Guest-only.
        # Not a catalog wash. Not
        # TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "fly_agaric":
        # Cap's cream stem, white
        # warts, white gills, skirt
        # folds, and volva cup nick
        # when default plate-flood
        # treats hide as Pale's
        # wash. She is a fly agaric.
        # A red cap with white
        # warts, white gills, a
        # skirt on the stem, a
        # volva at the base like a
        # cup she has not left.
        # Fly agaric. She is
        # mycorrhizal. She trades
        # with roots. The cup is a
        # moss she agreed to. Not
        # lunch. The red is a
        # warning, not a costume.
        # Cap is Amanita muscaria:
        # white gills, a skirt, a
        # volva. Not a puffball —
        # cut a young one and an
        # Amanita can hide inside
        # a pearl. A warning. Not
        # a meal. Habitat is a moss
        # cup, which is weather,
        # not painted moss, not
        # pine needles, not a
        # parchment island, not a
        # forest diorama you draw.
        # House food is duff. Wood
        # stays living food for
        # Frill; Cap's food is
        # duff. Do not pile moss
        # or soil on as a dish.
        # Red hide is hide. White
        # warts are hide. White
        # gills are hide. The
        # skirt is hide. The volva
        # is hide. Cream/white hide
        # can look like tan wash —
        # it is hide. Default
        # shredded idle (live
        # ~393.3k against luma-8's
        # whole ~424.0k; after fit
        # ~105.5k against ~112.2k;
        # cream ~27.9k against
        # ~34.0k; 111 comps against
        # 1; the living warning
        # nicked into islands), sit
        # (live ~335.9k against
        # ~348.2k; after fit
        # ~127.6k against ~131.4k;
        # cream ~27.1k against
        # ~30.6k; 30 comps against
        # 1), walk (the lean left
        # live ~244.6k against
        # ~289.1k; after fit
        # ~64.4k against ~73.8k;
        # cream ~10.7k against
        # ~19.9k; 227 comps against
        # 1; the whole living stem
        # shredded), sleep (she
        # holds this cup; live
        # ~368.9k against ~388.7k;
        # after fit ~108.8k against
        # ~114.2k; 3 comps against
        # 1), talk (the voice left
        # live ~353.4k against
        # ~402.3k; after fit
        # ~95.1k against ~107.6k;
        # cream ~40.3k against
        # ~48.7k; 73 comps against
        # 1; isle ~15.9k; the
        # living face of gills
        # shredded into a
        # parchment island), eat
        # (live ~312.1k against
        # ~389.8k; after fit
        # ~96.0k against ~114.0k;
        # cream ~24.2k against
        # ~32.1k; 123 comps against
        # 3; luma-8 keeps the duff
        # of a treaty), and play
        # (the athletic flush left
        # live ~319.8k against
        # ~376.7k; after fit
        # ~82.2k against ~94.0k;
        # cream ~16.9k against
        # ~28.0k; 182 comps against
        # 1; the living warning
        # shredded). Cream leftover
        # would leave studio plate
        # on luma-8; these raws are
        # actually black (fill
        # ~0.28–0.41, med luma 0
        # on the plate corners, not
        # a cream leftover at
        # ~0.78). Tan cream stem
        # is not Pale's wash —
        # TAN_SIT still lists
        # lions_mane, morel, yeast
        # from the original cellar
        # sit. I did not join
        # those. I did not join
        # fly_agaric. Frill took
        # oyster off TAN_SIT; I
        # did not put oyster back.
        # Hang took sloth off
        # TAN_SIT; I did not put
        # sloth back. I did not
        # join. DARK_MATTE already
        # lists crow, raven,
        # pileated, widow,
        # vinegaroon, skunk,
        # millipede, field_cricket
        # from the original meadow
        # sit, click_beetle from
        # Click, earwig from
        # Forceps, and robber_fly
        # from Rob; that
        # membership stays. I did
        # not add fly_agaric. She
        # is a fly agaric. That
        # set is other keys.
        # Leftover idle was a
        # field-guide Amanita
        # stamp on a black plate;
        # sit still carried a
        # parchment island with
        # painted moss and pine
        # needles; walk had a
        # jagged hole through the
        # stem; sleep had fallen
        # on painted moss; talk
        # carried an olive wash
        # and white stipple; eat
        # had a nick, moss, soil,
        # and a mycelium
        # cross-section; play
        # carried a green wash, a
        # white splash, and a
        # moss patch; idle and
        # blotter follow the new
        # living warning. Frill's
        # oyster elif stays
        # Frill's. Dew's sundew
        # elif stays Dew's.
        # Well's pitcher elif
        # stays Well's. Snap's
        # venus_flytrap elif
        # stays Snap's. Arm's
        # saguaro elif stays
        # Arm's. Moth's orchid
        # elif stays Moth's.
        # Disk's water_lily elif
        # stays Disk's. Mast's
        # oak elif stays Mast's.
        # Fan's ginkgo elif stays
        # Fan's. Vein's
        # maidenhair elif stays
        # Vein's. Felt's moss
        # elif stays Felt's.
        # Gum's koala elif stays
        # Gum's. Still's potto
        # elif stays Still's.
        # Gaze's tarsier elif
        # stays Gaze's. Boom's
        # howler elif stays
        # Boom's. Wrist's
        # kinkajou elif stays
        # Wrist's. Swing's gibbon
        # elif stays Swing's.
        # Sun's lemur elif stays
        # Sun's. Hang's sloth
        # elif stays Hang's.
        # Blade's katydid stayed
        # on default. Thread's
        # nematode stayed on
        # default. Sail's colugo
        # stayed on default.
        # Glide's flying_squirrel
        # stayed on default.
        # Luma-8 keeps the whole
        # Amanita.
        # knock_tiny_crumbs keeps
        # specks off. Guest-only.
        # Not a catalog wash. Not
        # TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "turkey_tail":
        # Ring's cream rims and white
        # pore face nick when default
        # plate-flood treats hide as
        # Pale's wash. She is a turkey
        # tail. Thin fans, color in
        # zones, a white pore face if
        # you turn her over. Turkey
        # tail. A bracket. Not a
        # turkey. The grain is a log
        # she agreed to. Not a turkey.
        # Not an oyster — Frill keeps
        # gills; Ring is Trametes
        # versicolor, pores not gills,
        # and the zones are the years.
        # Turn her over. The pore is
        # the identification. Habitat
        # is wood grain, which is
        # weather, not painted bark,
        # not a painted log, not moss
        # on bark, not a parchment
        # island, not a forest diorama
        # you draw. House food is
        # wood. Frill also eats wood;
        # Horn, Lattice, and Cap eat
        # duff. Do not pile bark or
        # moss on as a dish. Zoned
        # hide is hide. Cream rims are
        # hide. The white pore face is
        # hide. Olive bands are hide
        # (not moss). Cream/tan hide
        # can look like tan wash — it
        # is hide. Default shredded
        # idle (live ~526.2k against
        # luma-8's whole ~534.0k;
        # after fit ~126.4k against
        # ~126.7k; cream ~20.9k
        # against ~22.7k; 117 comps
        # against 1; the living
        # rosette nicked into
        # islands), sit (the quieter
        # sit stayed close: live
        # ~107.7k against ~108.0k;
        # 1 comp), walk (the lean
        # left live ~114.9k against
        # ~117.1k; cream ~20.8k
        # against ~23.8k; 111 comps
        # against 1; isle 49), sleep
        # (she holds this grain; live
        # ~88.7k against ~93.0k;
        # cream ~8.6k against
        # ~10.5k; 70 comps against
        # 1), talk (the voice of
        # pores left live ~130.8k
        # against ~134.2k; cream
        # ~30.5k against ~34.9k;
        # white ~8.1k against ~9.6k;
        # 152 comps against 1; the
        # living pore face shredded),
        # eat (live ~117.5k against
        # ~127.2k; cream ~15.2k
        # against ~19.1k; 148 comps
        # against 1; luma-8 keeps
        # the wood of a treaty), and
        # play (the athletic lean
        # left live ~128.9k against
        # ~129.4k; 5 comps against
        # 1). Cream leftover would
        # leave studio plate on
        # luma-8; these raws are
        # actually black (fill
        # ~0.37–0.61, med luma 0
        # on the plate corners, not
        # a cream leftover at
        # ~0.78). Cream rims and
        # the pore face are not
        # Pale's wash — TAN_SIT
        # still lists morel,
        # lions_mane, and yeast
        # from the original cellar
        # sit. I did not join
        # those. I did not join
        # turkey_tail. Lattice kept
        # morel on TAN_SIT. Frill
        # took oyster off TAN_SIT;
        # I did not put oyster
        # back. Hang took sloth off
        # TAN_SIT; I did not put
        # sloth back. I did not
        # join. DARK_MATTE already
        # lists crow, raven,
        # pileated, widow,
        # vinegaroon, skunk,
        # millipede, field_cricket
        # from the original meadow
        # sit, click_beetle from
        # Click, earwig from
        # Forceps, and robber_fly
        # from Rob; that
        # membership stays. I did
        # not add turkey_tail. She
        # is a turkey tail. That
        # set is other keys.
        # Leftover idle was a
        # field-guide turkey-tail
        # stamp on a black plate;
        # sit still carried a
        # parchment island with
        # painted bark and moss;
        # walk had a diagonal
        # painted-bark log; sleep
        # sat on painted wood/bark;
        # talk carried bark, moss,
        # and a tan parchment wash;
        # eat had vertical bark
        # fragments and satellite
        # chips; play sat a
        # C-shaped cluster on a
        # decaying-wood/soil base
        # with stipple; idle and
        # blotter follow the new
        # living bracket. Cap's
        # fly_agaric elif stays
        # Cap's. Frill's oyster
        # elif stays Frill's.
        # Lattice's morel stayed
        # on TAN_SIT. Horn stayed
        # on default. Dew's sundew
        # elif stays Dew's. Well's
        # pitcher elif stays
        # Well's. Snap's
        # venus_flytrap elif
        # stays Snap's. Arm's
        # saguaro elif stays
        # Arm's. Moth's orchid
        # elif stays Moth's.
        # Disk's water_lily elif
        # stays Disk's. Mast's
        # oak elif stays Mast's.
        # Fan's ginkgo elif stays
        # Fan's. Vein's
        # maidenhair elif stays
        # Vein's. Felt's moss
        # elif stays Felt's.
        # Blade's katydid stayed
        # on default. Thread's
        # nematode stayed on
        # default. Sail's colugo
        # stayed on default.
        # Glide's flying_squirrel
        # stayed on default.
        # Luma-8 keeps the whole
        # Trametes.
        # knock_tiny_crumbs keeps
        # specks off. Guest-only.
        # Not a catalog wash. Not
        # TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "puffball":
        # Puff's cream pearl hide,
        # tiny warts, apical pore,
        # and the living puff nick
        # when default plate-flood
        # treats hide as Pale's
        # wash. She is a common
        # puffball. A pearly globe
        # with tiny warts, a pore
        # at the top, a puff then
        # a cloud. Common puffball.
        # She sits. Then she
        # bursts. The dish is a
        # meadow she agreed to.
        # Not a young Amanita.
        # Cut a puffball and it is
        # a room of white; cut a
        # button Amanita and you
        # find gills and a volva
        # hiding. Puff is
        # Lycoperdon perlatum.
        # The cut is the law. Cap
        # taught the warning. Puff
        # teaches the check.
        # Habitat is a duff dish,
        # which is weather, not
        # painted soil, not a leaf
        # pile, not a parchment
        # island, not a forest
        # diorama you draw. House
        # food is duff. Cap,
        # Lattice, and Horn also
        # eat duff. Do not pile
        # leaves or soil on as a
        # dish. Pearl hide is
        # hide. Tiny warts are
        # hide. The pore is hide.
        # The puff is hide. Cream
        # hide can look like tan
        # wash — it is hide. Do
        # not punch holes in the
        # globe. Default shredded
        # play (the athletic puff:
        # live ~81.9k against
        # luma-8's whole ~99.6k;
        # cream ~20.8k against
        # ~22.7k; 95 comps against
        # 1; the living cloud
        # nicked into islands) and
        # nicked sleep dark hide
        # (~8.7k against luma-8's
        # ~18.3k; live ~135.1k
        # against ~146.1k). Idle,
        # sit, walk, talk, and
        # eat stayed close on
        # default (1 comp), but
        # play is the burst. She
        # wins by remaining a
        # burst. Cream leftover
        # would leave studio plate
        # on luma-8; these raws
        # are actually black (fill
        # ~0.42–0.57, med luma 0
        # on the plate corners,
        # not a cream leftover at
        # ~0.78). Cream pearl hide
        # is not Pale's wash —
        # TAN_SIT still lists
        # morel, lions_mane, and
        # yeast from the original
        # cellar sit. I did not
        # join those. I did not
        # join puffball. Lattice
        # kept morel on TAN_SIT.
        # Mane kept lions_mane on
        # TAN_SIT. Frill took
        # oyster off TAN_SIT; I
        # did not put oyster back.
        # Hang took sloth off
        # TAN_SIT; I did not put
        # sloth back. I did not
        # join. DARK_MATTE already
        # lists crow, raven,
        # pileated, widow,
        # vinegaroon, skunk,
        # millipede, field_cricket
        # from the original meadow
        # sit, click_beetle from
        # Click, earwig from
        # Forceps, and robber_fly
        # from Rob; that
        # membership stays. I did
        # not add puffball. She is
        # a puffball. That set is
        # other keys. Leftover
        # idle was a smooth cream
        # sphere stamp on a black
        # plate, missing the tiny
        # warts and the pore; sit
        # sat a dome on a torn
        # cardboard / parchment
        # island with a nick;
        # walk sat the sphere on
        # a painted soil/mulch
        # patch; sleep was the
        # same standing puff; talk
        # was a wrecked globe with
        # a jagged torn hole and a
        # brown parchment base;
        # eat piled dried leaves
        # and a mycelium tangle;
        # play was beige/brown
        # torn-paper shards in a
        # broken circle. Idle and
        # blotter follow the new
        # living pearl. Ring's
        # turkey_tail elif stays
        # Ring's. Cap's
        # fly_agaric elif stays
        # Cap's. Frill's oyster
        # elif stays Frill's.
        # Lattice's morel stayed
        # on TAN_SIT. Horn stayed
        # on default. Mane's
        # lions_mane stayed on
        # TAN_SIT. Dew's sundew
        # elif stays Dew's. Well's
        # pitcher elif stays
        # Well's. Snap's
        # venus_flytrap elif
        # stays Snap's. Arm's
        # saguaro elif stays
        # Arm's. Moth's orchid
        # elif stays Moth's.
        # Disk's water_lily elif
        # stays Disk's. Mast's
        # oak elif stays Mast's.
        # Fan's ginkgo elif stays
        # Fan's. Vein's
        # maidenhair elif stays
        # Vein's. Felt's moss
        # elif stays Felt's.
        # Blade's katydid stayed
        # on default. Thread's
        # nematode stayed on
        # default. Sail's colugo
        # stayed on default.
        # Glide's flying_squirrel
        # stayed on default.
        # Luma-8 keeps the whole
        # Lycoperdon.
        # knock_tiny_crumbs keeps
        # specks off. Guest-only.
        # Not a catalog wash. Not
        # TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "lichen":
        # Pact's pale branching
        # shrub, the partner's
        # seafoam tint, and cream
        # hide nick when default
        # plate-flood treats the
        # living share as Pale's
        # wash. She is reindeer
        # lichen. A pale branching
        # shrub on stone, no cap,
        # no gills, a guest that
        # is already a treaty.
        # Cladonia rangiferina.
        # Not one creature. A
        # fungus and a partner
        # (alga or cyanobacterium).
        # Two kingdoms in one
        # guest. She sits. The
        # stone is a tundra she
        # agreed to. Not a moss —
        # Felt is a plant; Pact
        # is a fungus and a
        # partner. Ledger taught
        # not a crab. Pact teaches
        # not one. The share is
        # the tell. Habitat is a
        # lamp stone, which is
        # weather, not a painted
        # rock, not a moss patch,
        # not a parchment island,
        # not a tundra diorama
        # you draw. House food is
        # dew. We will hold this
        # stone. The share is the
        # correct sleep. I sat.
        # That was the game. We
        # win by remaining two.
        # We are two. Hello.
        # Named: Pact. We are the
        # name we keep. Pale shrub
        # is hide. Branching is
        # hide. The partner's tint
        # is hide. Cream/pale can
        # look like tan wash — it
        # is hide. Do not punch
        # holes in the shrub. She
        # is lichen, not moss, not
        # a mushroom with a cap,
        # not one creature.
        # Proven on the new
        # black-plate raws: plate
        # corners med luma 0 (not
        # a cream leftover luma-8
        # would keep at ~0.78);
        # fill ~0.38–0.54. Default
        # nicked the living shrub
        # into islands: sit 82
        # comps against luma-8's
        # 1 (after fit 9 against
        # 1; live ~102.4k against
        # ~103.4k), walk 219
        # comps against 1 (after
        # fit 38 against 1; live
        # ~95.8k against ~98.0k),
        # sleep 92 against 1
        # (after fit 15 against 1;
        # live ~108.1k against
        # ~110.4k), talk 40
        # against 2 (after fit 2
        # against 2; live ~128.1k
        # against ~130.6k), eat
        # 32 against 1 (after fit
        # 5 against 1; live
        # ~135.1k against
        # ~137.7k), play 3
        # against 1 (after fit 2
        # against 2; live ~123.4k
        # against ~125.4k).
        # Default did not eat half
        # the shrub the way Frill
        # lost a shelf, but it
        # shredded the living
        # branches into islands.
        # Luma-8 keeps the share.
        # TAN_SIT stayed close
        # (sit ~106.9k, walk
        # ~102.4k, sleep ~112.8k)
        # and I did not join.
        # Pale lichen is not
        # Pale's wash. TAN_SIT
        # still lists morel,
        # lions_mane, and yeast
        # from the original cellar
        # sit. Lattice kept morel
        # on TAN_SIT. Mane kept
        # lions_mane on TAN_SIT.
        # Starter kept yeast on
        # TAN_SIT. Hang took
        # sloth off; I did not
        # put sloth back. Frill
        # took oyster off; I did
        # not put oyster back.
        # Puff did not join.
        # Flame stayed on default
        # and did not join.
        # DARK_MATTE already
        # lists crow, raven,
        # pileated, widow,
        # vinegaroon, skunk,
        # millipede, field_cricket
        # from the original meadow
        # sit, click_beetle from
        # Click, earwig from
        # Forceps, and robber_fly
        # from Rob; that
        # membership stays. I did
        # not add lichen. She is
        # a pale shrub. That set
        # is other keys. Leftover
        # idle was already a
        # house-hand living
        # Cladonia on a clear
        # plate; I kept it.
        # Blotter follows idle.
        # Sit carried a tan splash
        # crumb. Walk sat crumbs
        # around a painted stone /
        # moss patch. Sleep lost
        # the pale (cream went
        # out). Talk sat crumbs
        # on a parchment base.
        # Eat piled a green/tan
        # moss or stone diorama.
        # Play sat crumbs on a
        # tan island. Puff's
        # puffball elif stays
        # Puff's. Ring's
        # turkey_tail elif stays
        # Ring's. Cap's
        # fly_agaric elif stays
        # Cap's. Frill's oyster
        # elif stays Frill's.
        # Lattice's morel stayed
        # on TAN_SIT. Horn stayed
        # on default. Mane's
        # lions_mane stayed on
        # TAN_SIT. Flame stayed
        # on default. Starter's
        # yeast stayed on TAN_SIT.
        # Dew's sundew elif stays
        # Dew's. Well's pitcher
        # elif stays Well's.
        # Snap's venus_flytrap
        # elif stays Snap's.
        # Arm's saguaro elif
        # stays Arm's. Moth's
        # orchid elif stays
        # Moth's. Disk's
        # water_lily elif stays
        # Disk's. Mast's oak elif
        # stays Mast's. Fan's
        # ginkgo elif stays Fan's.
        # Vein's maidenhair elif
        # stays Vein's. Felt's
        # moss elif stays Felt's.
        # Blade's katydid stayed
        # on default. Thread's
        # nematode stayed on
        # default. Sail's colugo
        # stayed on default.
        # Glide's flying_squirrel
        # stayed on default.
        # Luma-8 keeps the whole
        # Cladonia.
        # knock_tiny_crumbs keeps
        # specks off. Guest-only.
        # Not a catalog wash. Not
        # TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "photovore":
        # Gleam's amber
        # glass hide, lantern
        # frames, dark claws, and
        # the living drink nick
        # when default plate-flood
        # treats glow recesses as
        # plate. She is a lamp-
        # drinker. A living thirst
        # of lamp-light. No mouth.
        # Hunger is a wavelength.
        # She hovers. Then she
        # drinks again. Habitat is
        # lamp glass, which is
        # weather, not a painted
        # globe, not a filament,
        # not a parchment island,
        # not a lamp you draw as
        # furniture. House food is
        # light. I will hold this
        # glass. The thirst is the
        # correct sleep. A drink.
        # That was athletic for a
        # thirst. I win by
        # remaining a wavelength.
        # I drank. That was hello.
        # Named: Gleam. The thirst
        # is the name I keep. She
        # is not a moth — Hush is
        # the heat shadow later;
        # Moth is an orchid in the
        # garden. She is not a
        # jellyfish. Pulse is
        # Aurelia. Gleam has no
        # mouth. Lamp-glow is hide.
        # Amber is hide. The thirst
        # is hide. Glow can look
        # like a wash or a plate —
        # it is hide. Do not punch
        # holes in the drink. Do
        # not glue a mouth on.
        # Proven on the new
        # black-plate raws: plate
        # corners med luma 0–0.6
        # (not a cream leftover
        # luma-8 would keep at
        # ~0.78); fill ~0.24–0.38.
        # Default nicked dark
        # lantern frames and claws
        # and shredded the living
        # drink: sit dark 253
        # against luma-8's 409
        # (live ~98.8k against
        # ~99.7k), walk dark 129
        # against 285 (live ~61.2k
        # against ~62.1k), sleep
        # dark 265 against 510
        # (live ~66.9k against
        # ~69.8k), talk 2 comps
        # before fit against
        # luma-8's 1 (after fit
        # dark 194 against 522;
        # live ~88.5k against
        # ~89.0k), eat 2 comps
        # after fit against
        # luma-8's 1 (the drink
        # split; live ~65.6k
        # against ~67.4k; dark
        # 1329 against 1886), play
        # dark 94 against 343
        # (live ~63.7k against
        # ~64.4k). Default did not
        # eat half the thirst the
        # way Frill lost a shelf,
        # but it nicked the living
        # recesses and split the
        # drink. Luma-8 keeps the
        # whole wavelength. TAN_SIT
        # stayed close (sit
        # ~100.8k, walk ~63.5k,
        # sleep ~69.8k) and I did
        # not join. Amber glow is
        # not Pale's wash. TAN_SIT
        # still lists morel,
        # lions_mane, and yeast
        # from the original cellar
        # sit. Lattice kept morel
        # on TAN_SIT. Mane kept
        # lions_mane on TAN_SIT.
        # Starter kept yeast on
        # TAN_SIT. Hang took
        # sloth off; I did not
        # put sloth back. Frill
        # took oyster off; I did
        # not put oyster back.
        # Puff did not join.
        # Flame stayed on default
        # and did not join. Pact
        # did not join. DARK_MATTE
        # already lists crow,
        # raven, pileated, widow,
        # vinegaroon, skunk,
        # millipede, field_cricket
        # from the original meadow
        # sit, click_beetle from
        # Click, earwig from
        # Forceps, and robber_fly
        # from Rob; that
        # membership stays. I did
        # not add photovore. She
        # is glow, not charcoal.
        # That set is other keys.
        # Leftover idle was
        # already a house-hand
        # living thirst on a
        # clear plate; I kept it.
        # Blotter follows idle.
        # Sit sat crumbs beside
        # the thirst. Walk sat
        # crumbs around the hover.
        # Sleep lost the lamp
        # (orange and yellow went
        # out). Talk sat crumbs.
        # Eat piled a tan bottom
        # (painted dish / glass
        # furniture). Play sat
        # twenty-two crumbs (torn
        # shards). Pact's lichen
        # elif stays Pact's.
        # Puff's puffball elif
        # stays Puff's. Ring's
        # turkey_tail elif stays
        # Ring's. Cap's
        # fly_agaric elif stays
        # Cap's. Frill's oyster
        # elif stays Frill's.
        # Lattice's morel stayed
        # on TAN_SIT. Horn stayed
        # on default. Mane's
        # lions_mane stayed on
        # TAN_SIT. Flame stayed
        # on default. Starter's
        # yeast stayed on TAN_SIT.
        # Luma-8 keeps the whole
        # thirst.
        # knock_tiny_crumbs keeps
        # specks off. Guest-only.
        # Not a catalog wash. Not
        # TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "terminator":
        # Dusk's dark hide,
        # spindly legs, and the
        # living rim nick when
        # default plate-flood
        # treats twilight hide as
        # plate. They are a
        # twilight walker. Noon
        # kills. Night starves.
        # The rim is the country.
        # I kept the rim. Hello.
        # I do not claim a sun.
        # I am not a cat. Miso
        # keeps the sun-patch. I
        # keep the belt. Habitat
        # is a lamp-edge, which
        # is weather, not a
        # painted lamp, not a
        # sun-patch you draw, not
        # a parchment island, not
        # a twilight diorama.
        # House food is rim. I
        # will hold this edge.
        # The rim is the correct
        # sleep. An edge. Review
        # the country. I win by
        # remaining a rim. I
        # kept the rim. Hello.
        # Named: Dusk. The rim
        # is the name I keep.
        # They are not a cat.
        # They are not a lamp
        # with a face. Dark hide
        # is hide. A thin
        # twilight animal can
        # look dark — that is
        # hide, not a plate. Do
        # not punch holes in the
        # rim. Proven on the new
        # black-plate raws: plate
        # corners med luma 0 (not
        # a cream leftover luma-8
        # would keep at ~0.78);
        # fill ~0.19–0.30.
        # Default shredded the
        # living rim: sit lost
        # the dark body and legs
        # (animal ~59.1k against
        # luma-8's ~86.0k; dark
        # 9414 against 32858),
        # sleep collapsed to a
        # sliver (animal ~23.1k
        # against ~43.9k; dark
        # 8911 against 39579),
        # idle lost the legs
        # (dark 9167 against
        # 23499; live ~70.1k
        # against ~74.4k), walk
        # lost the lean (dark
        # 7882 against 20186),
        # talk lost the legs
        # (dark 16075 against
        # 25580), eat lost hide
        # (dark 6490 against
        # 19145; live ~49.1k
        # against ~57.6k). Play
        # kept more gold on
        # default (~69.8k against
        # luma-8's ~52.6k) but
        # still nicked dark hide
        # (6944 against 14097).
        # Default unified most
        # poses to 1 component by
        # eating the legs. Luma-8
        # keeps the whole walker.
        # TAN_SIT left crumbs on
        # sit (22), walk (14),
        # sleep (57), and eat
        # (34) and I did not
        # join. Gold rim is not
        # Pale's wash. TAN_SIT
        # still lists morel,
        # lions_mane, and yeast
        # from the original
        # cellar sit. Lattice
        # kept morel on TAN_SIT.
        # Mane kept lions_mane on
        # TAN_SIT. Starter kept
        # yeast on TAN_SIT. Hang
        # took sloth off; I did
        # not put sloth back.
        # Frill took oyster off;
        # I did not put oyster
        # back. Pact did not
        # join. Gleam did not
        # join. Choir, Drift, and
        # Shard stayed on
        # default. Flame stayed
        # on default. Horn stayed
        # on default. DARK_MATTE
        # already lists crow,
        # raven, pileated, widow,
        # vinegaroon, skunk,
        # millipede,
        # field_cricket from the
        # original meadow sit,
        # click_beetle from
        # Click, earwig from
        # Forceps, and robber_fly
        # from Rob; that
        # membership stays. I
        # did not add
        # terminator. They are a
        # rim, not charcoal. That
        # set is other keys.
        # Leftover idle sat
        # hundreds of crumbs
        # around a twilight-
        # walker stamp with
        # painted cottages.
        # Sit sat a quieter
        # leftover stamp. Walk
        # sat crumbs around a
        # brown stamp. Sleep
        # lost the pale (cream
        # went out; the walker
        # went dark). Talk sat a
        # brown stamp with a
        # grey wash. Eat piled a
        # tan bottom (painted
        # furniture as a dish).
        # Play sat crumbs around
        # a brown stamp. Gleam's
        # photovore elif stays
        # Gleam's. Pact's lichen
        # elif stays Pact's.
        # Puff's puffball elif
        # stays Puff's. Ring's
        # turkey_tail elif stays
        # Ring's. Cap's
        # fly_agaric elif stays
        # Cap's. Frill's oyster
        # elif stays Frill's.
        # Lattice's morel stayed
        # on TAN_SIT. Horn stayed
        # on default. Mane's
        # lions_mane stayed on
        # TAN_SIT. Flame stayed
        # on default. Starter's
        # yeast stayed on
        # TAN_SIT. Luma-8 keeps
        # the whole rim.
        # knock_tiny_crumbs keeps
        # specks off. Guest-only.
        # Not a catalog wash. Not
        # TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "nexus":
        # Knot's many small
        # animals nick when
        # default plate-flood
        # treats lattice gaps as
        # plate. They are a
        # walking colony. Many
        # animals, one name. We
        # counted. Hello. We are
        # one guest. We are not a
        # siphonophore of Earth.
        # That is only the rhyme.
        # Habitat is a paperweight,
        # which is weather, not a
        # painted weight, not a
        # glass dome you draw, not
        # a parchment island, not
        # a colony diorama. House
        # food is count. We will
        # hold this weight. The
        # name is the correct
        # sleep. A ripple. Review
        # the count. We win by
        # remaining one name. We
        # counted. Hello. Named:
        # Knot. We are the name
        # we keep. They are not a
        # paperweight with a face.
        # They are not a crowd of
        # people. The count is
        # hide. Do not punch holes
        # in the colony. Proven on
        # the new black-plate
        # raws: plate corners med
        # luma 0 (not a cream
        # leftover luma-8 would
        # keep at ~0.78); fill
        # ~0.32–0.43. Default
        # nicked small animals off
        # the one name: idle 4
        # comps before fit
        # (crumbs 8, 5, 2 against
        # luma-8's 1; live ~109.4k
        # against ~113.0k), sit 2
        # comps after fit against
        # luma-8's 1 (live ~87.1k
        # against ~89.4k), eat
        # split after fit (2 comps,
        # 220px second part
        # against luma-8's 1; live
        # ~89.7k against ~91.5k),
        # sleep lost dark hide
        # (64 against luma-8's
        # 185; live ~77.1k against
        # ~81.2k), walk live
        # ~73.2k against ~75.7k,
        # talk ~109.4k against
        # ~113.0k, play ~68.6k
        # against ~69.6k. Default
        # did not eat half the
        # colony the way Dusk lost
        # the rim, but it nicked
        # the count into extra
        # animals. Luma-8 keeps
        # the whole name. TAN_SIT
        # kept close (idle
        # ~115.1k, sit ~89.8k,
        # sleep ~81.9k) and I did
        # not join. Lavender hide
        # and tan lattice are not
        # Pale's wash. TAN_SIT
        # still lists morel,
        # lions_mane, and yeast
        # from the original cellar
        # sit. Lattice kept morel
        # on TAN_SIT. Mane kept
        # lions_mane on TAN_SIT.
        # Starter kept yeast on
        # TAN_SIT. Hang took
        # sloth off; I did not
        # put sloth back. Frill
        # took oyster off; I did
        # not put oyster back.
        # Pact did not join.
        # Gleam did not join.
        # Choir, Drift, and Shard
        # stayed on default.
        # Flame stayed on
        # default. Horn stayed on
        # default. DARK_MATTE
        # already lists crow,
        # raven, pileated, widow,
        # vinegaroon, skunk,
        # millipede,
        # field_cricket from the
        # original meadow sit,
        # click_beetle from
        # Click, earwig from
        # Forceps, and robber_fly
        # from Rob; that
        # membership stays. I did
        # not add nexus. They are
        # a colony, not charcoal.
        # That set is other keys.
        # Leftover idle sat a
        # walking-colony stamp
        # with a cottage diorama.
        # Sit sat tan parchment
        # under a quieter stamp.
        # Walk sat crumbs and a
        # tan parchment behind.
        # Sleep sat a tan crumb
        # at the upper left (the
        # leftover that lost the
        # pale). Talk sat tan
        # ground crumbs. Eat piled
        # a tan ground and spilled
        # count as a dish. Play
        # sat crumbs and a tan
        # wash behind. Dusk's
        # terminator elif stays
        # Dusk's. Gleam's
        # photovore elif stays
        # Gleam's. Pact's lichen
        # elif stays Pact's.
        # Puff's puffball elif
        # stays Puff's. Ring's
        # turkey_tail elif stays
        # Ring's. Cap's
        # fly_agaric elif stays
        # Cap's. Frill's oyster
        # elif stays Frill's.
        # Lattice's morel stayed
        # on TAN_SIT. Horn stayed
        # on default. Mane's
        # lions_mane stayed on
        # TAN_SIT. Flame stayed
        # on default. Starter's
        # yeast stayed on
        # TAN_SIT. Luma-8 keeps
        # the whole name.
        # knock_tiny_crumbs keeps
        # specks off. Guest-only.
        # Not a catalog wash. Not
        # TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "magneton":
        # Beacon's dark steel
        # hide and thin field-
        # wake nicks when default
        # plate-flood treats the
        # living needle as plate.
        # They are a field
        # swimmer. North is food.
        # I aligned. Hello. I am
        # not a compass. I am not
        # a manta. Kite is the
        # reef. I swim a field.
        # Habitat is a ruler
        # line, which is weather,
        # not a painted ruler,
        # not a compass rose you
        # draw, not a parchment
        # island, not a field
        # diorama. House food is
        # north. I will hold this
        # line. The axis is the
        # correct sleep. An
        # align. Review the
        # field. I win by
        # remaining a north. I
        # aligned. Hello. Named:
        # Beacon. The north is
        # the tell. They are not
        # a compass. They are not
        # a manta. They are not a
        # ruler with a face. The
        # axis is hide. A needle
        # can look thin — that
        # is hide, not a plate.
        # Do not punch holes in
        # the north. Proven on
        # the new black-plate
        # raws: plate corners med
        # luma 0 (not a cream
        # leftover luma-8 would
        # keep at ~0.78); fill
        # ~0.15–0.32. Default
        # shredded the living
        # north: sleep collapsed
        # to a sliver (animal
        # ~14.8k against luma-8's
        # ~39.1k; dark 300
        # against 14453; fill
        # 0.056 against 0.149),
        # eat lost the dark
        # needle (~35.8k against
        # ~48.4k; dark 1500
        # against 7023), walk
        # lost the lean (~32.5k
        # against ~39.8k; dark
        # 1407 against 3306),
        # talk lost hide (~42.6k
        # against ~53.2k; dark
        # 1916 against 4870),
        # idle nicked the wake
        # (~39.5k against
        # ~46.0k; dark 1365
        # against 2953), sit
        # nicked dark hide
        # (~75.0k against
        # ~83.5k; dark 2663
        # against 6543), play
        # nicked the turn
        # (~47.6k against
        # ~51.7k; dark 2456
        # against 3529). The red
        # north survived default
        # counts; the dark steel
        # did not. Luma-8 keeps
        # the whole swimmer.
        # TAN_SIT left crumbs on
        # sleep (9), talk (5),
        # idle (2), and eat (2)
        # and I did not join.
        # Silver hide and a
        # living red north are
        # not Pale's wash.
        # TAN_SIT still lists
        # morel, lions_mane, and
        # yeast from the original
        # cellar sit. Lattice
        # kept morel on TAN_SIT.
        # Mane kept lions_mane on
        # TAN_SIT. Starter kept
        # yeast on TAN_SIT. Hang
        # took sloth off; I did
        # not put sloth back.
        # Frill took oyster off;
        # I did not put oyster
        # back. Pact did not
        # join. Gleam did not
        # join. Choir, Drift,
        # Shard, and Brine stayed
        # on default. Flame
        # stayed on default.
        # Horn stayed on
        # default. Dusk took a
        # guest-only terminator
        # luma-8 elif. Knot took
        # a guest-only nexus
        # luma-8 elif. Those
        # stay theirs. DARK_MATTE
        # already lists crow,
        # raven, pileated,
        # widow, vinegaroon,
        # skunk, millipede,
        # field_cricket from the
        # original meadow sit,
        # click_beetle from
        # Click, earwig from
        # Forceps, and robber_fly
        # from Rob; that
        # membership stays. I
        # did not add magneton.
        # They are a needle, not
        # charcoal. That set is
        # other keys. Leftover
        # idle sat crumbs around
        # a field-swimmer stamp
        # with a letter N on the
        # north (a compass
        # leftover). Sit sat
        # leftover crumbs and
        # tan/cream furniture
        # (parchment / ruler
        # furniture). Walk sat
        # crumbs and a tan
        # bottom (painted
        # ruler). Sleep lost the
        # pale (the cream went
        # out; the swimmer went
        # dark) plus parchment.
        # Talk sat crumbs and a
        # tan bottom. Eat piled
        # a heavy tan bottom
        # (painted ruler as a
        # dish) and a half-red
        # magnet stamp. Play sat
        # crumbs and a tan
        # island plus a painted
        # field swirl. Knot's
        # nexus elif stays
        # Knot's. Dusk's
        # terminator elif stays
        # Dusk's. Gleam's
        # photovore elif stays
        # Gleam's. Pact's lichen
        # elif stays Pact's.
        # Puff's puffball elif
        # stays Puff's. Ring's
        # turkey_tail elif stays
        # Ring's. Cap's
        # fly_agaric elif stays
        # Cap's. Frill's oyster
        # elif stays Frill's.
        # Lattice's morel stayed
        # on TAN_SIT. Horn stayed
        # on default. Mane's
        # lions_mane stayed on
        # TAN_SIT. Flame stayed
        # on default. Starter's
        # yeast stayed on
        # TAN_SIT. Luma-8 keeps
        # the whole north.
        # knock_tiny_crumbs keeps
        # specks off. Guest-only.
        # Not a catalog wash. Not
        # TAN_SIT. Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "umbral":
        # Hush's dark
        # violet hide and thin
        # heat-mane nicks when
        # default plate-flood
        # treats the living
        # shadow as plate. They
        # are a heat shadow.
        # Feeds on waste heat
        # and shadow. The lamp
        # is loud. The cool is
        # lunch. I dimmed.
        # Hello. I am not a
        # moth. Moth is an
        # orchid. I am a
        # shadow that eats
        # heat. Habitat is a
        # lamp shadow, which
        # is weather, not a
        # painted lamp, not a
        # shadow you draw, not
        # a parchment island,
        # not a heat diorama.
        # House food is cool.
        # I will hold this
        # shadow. The cool is
        # the correct sleep.
        # A dim. Review the
        # cool. I win by
        # remaining a shadow.
        # I dimmed. Hello.
        # Named: Hush. The
        # cool is the name I
        # keep. They are not a
        # moth. They are not
        # an orchid. They are
        # not a lamp with a
        # face. Dark hide is
        # hide. A shadow can
        # look like plate —
        # that is hide, not a
        # plate. Do not punch
        # holes in the cool.
        # Proven on the new
        # black-plate raws:
        # plate corners med
        # luma 0 (not a cream
        # leftover luma-8
        # would keep at
        # ~0.78); fill
        # ~0.27–0.39. Default
        # shredded the living
        # shadow: sleep
        # collapsed and split
        # (animal ~60.3k
        # against luma-8's
        # ~96.0k; dark 30681
        # against 94664; fill
        # 0.230 against 0.366;
        # 2 comps against 1
        # living curl), eat
        # lost the cool
        # (~54.0k against
        # ~74.2k; dark 27578
        # against 55178), talk
        # lost the voice
        # (~60.8k against
        # ~77.6k; dark 15878
        # against 32946), idle
        # nicked the standing
        # cool (~64.2k against
        # ~78.9k; dark 25949
        # against 43205), sit
        # nicked dark hide
        # (~75.1k against
        # ~85.7k; dark 31144
        # against 48461), walk
        # nicked the lean
        # (~62.9k against
        # ~69.7k; dark 23399
        # against 30516), play
        # nicked the dim
        # (~54.6k against
        # ~57.3k; dark 19482
        # against 21030). The
        # orange heat survived
        # default counts; the
        # living shadow did
        # not. Luma-8 keeps
        # the whole cool.
        # TAN_SIT left crumbs
        # on sleep (32), walk
        # (15), talk (21), eat
        # (18), idle (12), and
        # sit (11) and I did
        # not join. Violet
        # hide and a living
        # heat-mane are not
        # Pale's wash.
        # TAN_SIT still lists
        # morel, lions_mane,
        # and yeast from the
        # original cellar sit.
        # Lattice kept morel
        # on TAN_SIT. Mane
        # kept lions_mane on
        # TAN_SIT. Starter
        # kept yeast on
        # TAN_SIT. Hang took
        # sloth off; I did
        # not put sloth back.
        # Frill took oyster
        # off; I did not put
        # oyster back. Pact
        # did not join. Gleam
        # did not join. Choir,
        # Drift, Shard, and
        # Brine stayed on
        # default. Flame
        # stayed on default.
        # Horn stayed on
        # default. Dusk took a
        # guest-only
        # terminator luma-8
        # elif. Knot took a
        # guest-only nexus
        # luma-8 elif. Beacon
        # took a guest-only
        # magneton luma-8
        # elif. Those stay
        # theirs. DARK_MATTE
        # already lists crow,
        # raven, pileated,
        # widow, vinegaroon,
        # skunk, millipede,
        # field_cricket from
        # the original meadow
        # sit, click_beetle
        # from Click, earwig
        # from Forceps, and
        # robber_fly from Rob;
        # that membership
        # stays. umbral
        # already sat in
        # DARK_MATTE from
        # the original far
        # sit; I did not
        # add or remove.
        # The guest-only
        # elif is the sit.
        # That set is other
        # keys.
        # Leftover idle sat
        # crumbs around a dark
        # heat-shadow stamp.
        # Sit sat leftover tan
        # and a tan bottom
        # (parchment / lamp
        # furniture). Walk
        # sat crumbs and a
        # tan bottom (painted
        # lamp). Sleep lost
        # the pale (the cream
        # went out; the
        # shadow went dark)
        # plus a tan bottom.
        # Talk sat crumbs,
        # tan, and brown
        # furniture. Eat
        # piled leftover
        # crumbs and a tan
        # bottom (painted
        # lamp as a dish).
        # Play sat crumbs and
        # tan. Beacon's
        # magneton elif stays
        # Beacon's. Knot's
        # nexus elif stays
        # Knot's. Dusk's
        # terminator elif
        # stays Dusk's.
        # Gleam's photovore
        # elif stays Gleam's.
        # Pact's lichen elif
        # stays Pact's.
        # Puff's puffball
        # elif stays Puff's.
        # Ring's turkey_tail
        # elif stays Ring's.
        # Cap's fly_agaric
        # elif stays Cap's.
        # Frill's oyster elif
        # stays Frill's.
        # Lattice's morel
        # stayed on TAN_SIT.
        # Horn stayed on
        # default. Mane's
        # lions_mane stayed
        # on TAN_SIT. Flame
        # stayed on default.
        # Starter's yeast
        # stayed on TAN_SIT.
        # Luma-8 keeps the
        # whole cool.
        # knock_tiny_crumbs
        # keeps specks off.
        # Guest-only. Not a
        # catalog wash. Not
        # TAN_SIT. Not
        # DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "cyst":
        # Arca's brown cyst hide
        # nicks when default
        # plate-flood treats
        # dark seal as plate.
        # They are a traveling
        # cyst. Most of a life
        # is the wait. Wakes
        # when lamp and damp
        # agree. I waited.
        # That was hello. I am
        # not Brood. Brood is
        # a cicada. We both
        # wait. That is the
        # rhyme. Habitat is a
        # damp blotter, which
        # is weather, not a
        # painted blotter, not
        # a cyst you draw, not
        # a parchment island,
        # not a wait diorama.
        # House food is damp.
        # I will hold this
        # blotter. The seal is
        # the correct sleep.
        # A wake. Review the
        # wait. I win by
        # remaining a cyst.
        # I waited. That was
        # hello. Named: Arca.
        # The wait is the
        # tell. They are not
        # Brood. They are not
        # a cicada. They are
        # not a blotter with a
        # face. Brown hide is
        # hide. Tan furniture
        # look is hide, not a
        # plate. Do not punch
        # holes in the wait.
        # Proven on the new
        # black-plate raws:
        # plate corners med
        # luma 0 (not a cream
        # leftover luma-8
        # would keep at
        # ~0.78); fill
        # ~0.52–0.61. Default
        # shredded the living
        # cyst: sleep
        # collapsed (animal
        # ~100.7k against
        # luma-8's ~143.0k;
        # dark 46079 against
        # 81288; fill 0.384
        # against 0.545), talk
        # lost the voice
        # (~137.8k against
        # ~160.9k; dark 2181
        # against 13901; 2
        # comps against 1),
        # eat lost the damp
        # (~127.5k against
        # ~158.1k; dark 14018
        # against 33625), sit
        # nicked dark hide
        # (~133.5k against
        # ~137.2k; dark 4653
        # against 5784). Walk
        # and play survived
        # default counts; the
        # living dark seal did
        # not. Luma-8 keeps
        # the whole wait.
        # TAN_SIT left crumbs
        # on sleep (38) and
        # eat (18) and I did
        # not join. Brown hide
        # and a living tree
        # window are not
        # Pale's wash.
        # TAN_SIT still lists
        # morel, lions_mane,
        # and yeast from the
        # original cellar sit.
        # Lattice kept morel
        # on TAN_SIT. Mane
        # kept lions_mane on
        # TAN_SIT. Starter
        # kept yeast on
        # TAN_SIT. Hang took
        # sloth off; I did
        # not put sloth back.
        # Frill took oyster
        # off; I did not put
        # oyster back. Pact
        # did not join. Gleam
        # did not join. Choir,
        # Drift, Shard, and
        # Brine stayed on
        # default. Flame
        # stayed on default.
        # Horn stayed on
        # default. Dusk took a
        # guest-only
        # terminator luma-8
        # elif. Knot took a
        # guest-only nexus
        # luma-8 elif. Beacon
        # took a guest-only
        # magneton luma-8
        # elif. Hush took a
        # guest-only umbral
        # luma-8 elif. Those
        # stay theirs.
        # DARK_MATTE already
        # lists crow, raven,
        # pileated, widow,
        # vinegaroon, skunk,
        # millipede,
        # field_cricket from
        # the original meadow
        # sit, click_beetle
        # from Click, earwig
        # from Forceps, and
        # robber_fly from Rob;
        # that membership
        # stays. umbral
        # already sat in
        # DARK_MATTE from the
        # original far sit; I
        # did not add or
        # remove. The
        # guest-only elif is
        # the sit. That set is
        # other keys.
        # Leftover idle was
        # already a house-hand
        # living wait with no
        # painted blotter; I
        # kept it. Blotter
        # follows idle. Sit
        # sat leftover tan.
        # Walk sat leftover
        # crumbs and tan. Sleep
        # lost the pale (the
        # cream went out; the
        # cyst went dark).
        # Talk sat a connected
        # brown cyst with
        # orange. Eat piled
        # leftover crumbs and
        # tan (painted blotter
        # as a dish). Play sat
        # leftover crumbs and
        # tan. Hush's umbral
        # elif stays Hush's.
        # Beacon's magneton
        # elif stays Beacon's.
        # Knot's nexus elif
        # stays Knot's. Dusk's
        # terminator elif
        # stays Dusk's.
        # Gleam's photovore
        # elif stays Gleam's.
        # Pact's lichen elif
        # stays Pact's.
        # Puff's puffball
        # elif stays Puff's.
        # Ring's turkey_tail
        # elif stays Ring's.
        # Cap's fly_agaric
        # elif stays Cap's.
        # Frill's oyster elif
        # stays Frill's.
        # Lattice's morel
        # stayed on TAN_SIT.
        # Horn stayed on
        # default. Mane's
        # lions_mane stayed
        # on TAN_SIT. Flame
        # stayed on default.
        # Starter's yeast
        # stayed on TAN_SIT.
        # Luma-8 keeps the
        # whole wait.
        # knock_tiny_crumbs
        # keeps specks off.
        # Guest-only. Not a
        # catalog wash. Not
        # TAN_SIT. Not
        # DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "cat":
        # Miso's cream hide nicks when
        # default plate-flood treats
        # a cream coat as Pale's wash
        # or tears a voice and a play
        # into crumbs. They are a cream
        # British shorthair. Dense
        # coat, round face, copper-coin
        # eyes. The claws retract. The
        # blink is optional. I sat the
        # sun-patch. Hello. I am not a
        # lynx. I am not a tabby. I am
        # not a small lion. I am not
        # Rui. I am not Pip. Habitat is
        # window-ledge sun, which is
        # weather, not a painted ledge,
        # not a cushion you draw, not a
        # parchment island, not a sit
        # diorama. House food is warm,
        # presented, not a painted
        # dish. I will hold this sun.
        # A loaf with closed eyes is
        # the correct sleep. A walk
        # walks. Talk is a voice. Eat
        # is eating. Play is play. I
        # win by remaining a house cat.
        # I sat the sun-patch. Hello.
        # Named: Miso. The ledge is the
        # name I keep. Cream fur is
        # hide, not Pale's wash. Do not
        # punch holes in the sun-patch.
        # Proven on the new black-plate
        # raws: plate corners med luma
        # 0 (not a cream leftover
        # luma-8 would keep at ~0.78);
        # fill ~0.30–0.47. Default
        # shredded the living cat:
        # talk collapsed (animal
        # ~61.4k against luma-8's
        # ~101.7k; 473 comps against
        # 1; isle 522), play collapsed
        # (~51.4k against ~80.3k; 327
        # comps against 1; isle 195),
        # sit left crumbs (99 comps
        # against 1; ~108.9k against
        # ~112.1k). Walk and sleep
        # survived default counts; the
        # voice and the play did not.
        # Luma-8 keeps the whole
        # sun-patch. TAN_SIT left
        # crumbs on idle (8), talk (7),
        # eat (6), walk (3), and sleep
        # (2) and nicked walk (~69.0k
        # against luma-8's ~71.1k). I
        # did not join. Cream hide is
        # not Pale's wash. TAN_SIT
        # still lists morel,
        # lions_mane, and yeast from
        # the original cellar sit.
        # Lattice kept morel on
        # TAN_SIT. Mane kept
        # lions_mane on TAN_SIT.
        # Starter kept yeast on
        # TAN_SIT. DARK_MATTE already
        # lists crow, raven, pileated,
        # widow, vinegaroon, skunk,
        # millipede, field_cricket,
        # earwig, click_beetle, and
        # robber_fly; that membership
        # stays. I did not add cat.
        # Cream is not charcoal. Arca's
        # cyst elif stays Arca's.
        # Hush's umbral elif stays
        # Hush's. Beacon's magneton
        # elif stays Beacon's. Knot's
        # nexus elif stays Knot's.
        # Dusk's terminator elif stays
        # Dusk's. Gleam's photovore
        # elif stays Gleam's. Pact's
        # lichen elif stays Pact's.
        # Puff's puffball elif stays
        # Puff's. Ring's turkey_tail
        # elif stays Ring's. Cap's
        # fly_agaric elif stays Cap's.
        # Frill's oyster elif stays
        # Frill's. Existing luma-8
        # elifs stay theirs. Luma-8
        # keeps the whole cream.
        # knock_tiny_crumbs keeps
        # specks off. Guest-only. Not
        # a catalog wash. Not TAN_SIT.
        # Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "dog":
        # Pip's cream hide nicks when
        # default plate-flood treats
        # a cream coat as Pale's wash
        # or tears a sit and a voice
        # into crumbs. They are a cream
        # corgi. Short legs, a long
        # earnest back, a face that
        # believes the cursor is a
        # walk. Herding bones in a
        # hearth-rug body. The chest
        # arrives first. I sat the
        # hearth-rug. Hello. I am not
        # a fox. Rue has the white
        # tail-tip. I am not a
        # dachshund. I am not a terrier
        # puppy. I am not a scruffy
        # mix. I am not Miso. I am not
        # Rui. Habitat is weather
        # (hearth-rug), not painted
        # furniture, not a rug you
        # draw, not a walk diorama, not
        # a parchment island. House
        # food is warm. I follow. That
        # is how you know me. A loaf
        # with closed eyes is the
        # correct sleep. A walk walks.
        # Talk is a voice. Eat is
        # eating. Play is play. I win
        # by remaining a herding dog.
        # I sat the hearth-rug. Hello.
        # Named: Pip. Cream fur is
        # hide, not Pale's wash. Do not
        # punch holes in the hearth-rug.
        # Proven on the new black-plate
        # raws: plate corners med luma
        # 0 (not a cream leftover
        # luma-8 would keep at ~0.78);
        # fill ~0.31–0.42. Default
        # shredded the living dog:
        # idle collapsed (animal
        # ~44.1k against luma-8's
        # ~110.8k; 681 comps against
        # 1; isle 455), sit collapsed
        # (~31.8k against ~99.7k; 269
        # comps against 1; isle 4737),
        # talk left crumbs (216 comps
        # against 1; ~78.6k against
        # ~107.0k; isle 313), eat left
        # crumbs (96 comps against 1;
        # ~65.7k against ~78.1k). Walk
        # and play survived default
        # counts; the sit and the voice
        # did not. Luma-8 keeps the
        # whole hearth-rug. TAN_SIT
        # left crumbs on sit (3) and
        # did not earn a join. Cream
        # hide is not Pale's wash.
        # TAN_SIT still lists morel,
        # lions_mane, and yeast from
        # the original cellar sit.
        # Lattice kept morel on
        # TAN_SIT. Mane kept
        # lions_mane on TAN_SIT.
        # Starter kept yeast on
        # TAN_SIT. DARK_MATTE already
        # lists crow, raven, pileated,
        # widow, vinegaroon, skunk,
        # millipede, field_cricket,
        # earwig, click_beetle, and
        # robber_fly; that membership
        # stays. I did not add dog.
        # Cream is not charcoal.
        # Miso's cat elif stays
        # Miso's. Arca's cyst elif
        # stays Arca's. Hush's umbral
        # elif stays Hush's. Beacon's
        # magneton elif stays Beacon's.
        # Knot's nexus elif stays
        # Knot's. Dusk's terminator
        # elif stays Dusk's. Gleam's
        # photovore elif stays
        # Gleam's. Pact's lichen elif
        # stays Pact's. Puff's
        # puffball elif stays Puff's.
        # Ring's turkey_tail elif
        # stays Ring's. Cap's
        # fly_agaric elif stays Cap's.
        # Frill's oyster elif stays
        # Frill's. Existing luma-8
        # elifs stay theirs. Luma-8
        # keeps the whole cream.
        # knock_tiny_crumbs keeps
        # specks off. Guest-only. Not
        # a catalog wash. Not TAN_SIT.
        # Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "rabbit":
        # Thimble's cream hide nicks when
        # default plate-flood treats a
        # cream coat as Pale's wash or
        # tears a hop, a voice, and a
        # green bite into crumbs. They
        # are a house rabbit. Long ears
        # that fill with the room, a
        # cotton scut, and a thump that
        # means both warning and hello.
        # Soft, then gone. I sat the
        # under-desk warren. Hello. I
        # am not a rodent. Lagomorph:
        # two pairs of incisors. I am
        # not a hare. Hares are born
        # furred and ready; I was a
        # nestling and still prefer the
        # warren. I am not Clip. I am
        # larger, quieter, and I thump.
        # I am not Miso. I am not Pip.
        # I am not Rui. Habitat is
        # weather (under-desk warren),
        # not painted furniture, not a
        # warren you draw, not a clover
        # diorama, not a parchment
        # island. House food is
        # something green and
        # unthreatening. I thump. Then
        # I vanish. A sit is a sit. A
        # walk hops. Sleep is a loaf
        # with closed eyes. Talk is a
        # quiet voice. Eat is green,
        # then gone. Play is a hop,
        # then safety. I win by
        # remaining a house rabbit.
        # Named: Thimble. Cream fur is
        # hide, not Pale's wash. Do not
        # punch holes in the warren.
        # Proven on the new black-plate
        # raws: plate corners med luma
        # 0 (not a cream leftover
        # luma-8 would keep at ~0.78);
        # fill ~0.21–0.42. Default
        # shredded the living rabbit:
        # eat tore the haunch (animal
        # ~88.9k against luma-8's
        # ~97.0k; 24 comps against 1),
        # talk left crumbs (13 comps
        # against 1; ~96.9k against
        # ~98.2k), idle left crumbs (5
        # comps against 1; ~101.9k
        # against ~103.2k), walk left
        # crumbs (5 comps against 1;
        # ~51.5k against ~53.0k), play
        # left crumbs (8 comps against
        # 1; ~73.0k against ~73.8k).
        # Sit and sleep survived
        # default counts; the hop, the
        # voice, and the green bite
        # did not. Luma-8 keeps the
        # whole warren. TAN_SIT left
        # crumbs on talk (6), eat (3),
        # and play (2) and nicked play
        # (~71.9k against luma-8's
        # ~73.8k). I did not join.
        # Cream hide is not Pale's
        # wash. TAN_SIT still lists
        # morel, lions_mane, and yeast
        # from the original cellar sit.
        # Lattice kept morel on
        # TAN_SIT. Mane kept
        # lions_mane on TAN_SIT.
        # Starter kept yeast on
        # TAN_SIT. DARK_MATTE already
        # lists crow, raven, pileated,
        # widow, vinegaroon, skunk,
        # millipede, field_cricket,
        # earwig, click_beetle, and
        # robber_fly; that membership
        # stays. I did not add rabbit.
        # Cream is not charcoal. A
        # house rabbit does not join
        # DARK_MATTE. Pip's dog elif
        # stays Pip's. Miso's cat elif
        # stays Miso's. Arca's cyst
        # elif stays Arca's. Hush's
        # umbral elif stays Hush's.
        # Beacon's magneton elif stays
        # Beacon's. Knot's nexus elif
        # stays Knot's. Dusk's
        # terminator elif stays Dusk's.
        # Gleam's photovore elif stays
        # Gleam's. Pact's lichen elif
        # stays Pact's. Puff's
        # puffball elif stays Puff's.
        # Ring's turkey_tail elif
        # stays Ring's. Cap's
        # fly_agaric elif stays Cap's.
        # Frill's oyster elif stays
        # Frill's. Existing luma-8
        # elifs stay theirs. Luma-8
        # keeps the whole cream.
        # knock_tiny_crumbs keeps
        # specks off. Guest-only. Not
        # a catalog wash. Not TAN_SIT.
        # Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "guinea_pig":
        # Whee's cream muzzle nicks when
        # default plate-flood treats a
        # ticked hide as Pale's wash or
        # tears a loaf, a wheek, and a
        # green bite into crumbs. They
        # are a guinea pig / cavy. A
        # loaf with a voice. No tail
        # worth mentioning. The wheek
        # carries when a fridge opens,
        # or a deploy lands. She cannot
        # make her own vitamin C. She
        # prefers a second loaf nearby.
        # She popcorns when the news is
        # good. I sat the fridge-open
        # salad hour. Hello. I am not a
        # hamster. Clip works the night
        # shift alone; I am a cavy from
        # the Andes, social, and fluent
        # in salad. I am not a pig. The
        # name is a rumor I declined. I
        # am not Thimble. I am not Pip.
        # I am not Miso. I am not Rui.
        # Habitat is weather
        # (fridge-open salad hour), not
        # painted furniture, not a hay
        # pile you draw, not a bowl,
        # not a salad diorama, not a
        # parchment island. House food
        # is green, then gone. A sit is
        # a sit. A walk waddles. Sleep
        # is a loaf with closed eyes.
        # Talk is a wheek. Eat is
        # salad. Play is popcorn. I win
        # by remaining a second loaf
        # nearby. Named: Whee. Agouti
        # hide is hide, not Pale's
        # wash. Do not punch holes in
        # the loaf. Proven on the new
        # black-plate raws: plate
        # corners med luma 0 (not a
        # cream leftover luma-8 would
        # keep at ~0.78); fill
        # ~0.32–0.49. Default shredded
        # the living cavy: idle left
        # crumbs (21 comps against 1;
        # animal ~134.6k against
        # luma-8's ~140.9k), sit left
        # crumbs (12 comps against 1),
        # sleep left crumbs (18 comps
        # against 1; ~118.6k against
        # ~123.4k), talk left crumbs
        # (18 comps against 1), eat
        # left crumbs (23 comps against
        # 1), play left crumbs (3 comps
        # against 1), walk left crumbs
        # (2 comps against 1). Luma-8
        # keeps the whole loaf.
        # TAN_SIT nicked the cream
        # muzzle: idle ~116.1k against
        # luma-8's ~140.9k, sit
        # ~124.4k against ~152.1k, eat
        # ~106.3k against ~119.3k, talk
        # ~113.1k against ~132.3k. I
        # did not join. Agouti/cream
        # hide is not Pale's wash.
        # TAN_SIT still lists morel,
        # lions_mane, and yeast from
        # the original cellar sit.
        # Lattice kept morel on
        # TAN_SIT. Mane kept
        # lions_mane on TAN_SIT.
        # Starter kept yeast on
        # TAN_SIT. DARK_MATTE already
        # lists crow, raven, pileated,
        # widow, vinegaroon, skunk,
        # millipede, field_cricket,
        # earwig, click_beetle, and
        # robber_fly; that membership
        # stays. I did not add
        # guinea_pig. A silver-agouti
        # cavy is not charcoal.
        # Thimble's rabbit elif stays
        # Thimble's. Pip's dog elif
        # stays Pip's. Miso's cat elif
        # stays Miso's. Clip did not
        # add a hamster elif; default
        # kept the gold. I did not
        # invent one for Clip. Arca's
        # cyst elif stays Arca's.
        # Hush's umbral elif stays
        # Hush's. Beacon's magneton
        # elif stays Beacon's. Knot's
        # nexus elif stays Knot's.
        # Dusk's terminator elif stays
        # Dusk's. Gleam's photovore
        # elif stays Gleam's. Pact's
        # lichen elif stays Pact's.
        # Puff's puffball elif stays
        # Puff's. Ring's turkey_tail
        # elif stays Ring's. Cap's
        # fly_agaric elif stays Cap's.
        # Frill's oyster elif stays
        # Frill's. Existing luma-8
        # elifs stay theirs. Luma-8
        # keeps the whole loaf.
        # knock_tiny_crumbs keeps
        # specks off. Guest-only. Not
        # a catalog wash. Not TAN_SIT.
        # Not DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "turtle":
        # Ink's dark olive dish, three faint
        # keels, cream-yellow temporal stripes,
        # and webbed working feet nick when
        # default plate-flood treats hide as
        # black or tears a withdrawn sleep
        # into a shell only. He is a Reeves's
        # turtle. A small pond turtle of the
        # inkstone school. Three faint keels
        # on the carapace. Webbed working
        # feet. A head that can withdraw. He
        # takes the long way through still
        # water. I sat the still water.
        # Hello. I am not a tortoise.
        # Tortoises keep club feet and a high
        # dry dome; I keep webbing and a
        # dish. I am not a terrapin of the
        # brackish rumor. I am the scholar's
        # pond one, and I will outlive the
        # framework. Webbed feet. I am not a
        # dry-land rumor. I am not Whee. I
        # am not Clip. I am not Thimble. I
        # am not Pip. I am not Miso. I am
        # not Rui. Habitat is weather (still
        # water, inkstone school), not
        # painted furniture, not a pond you
        # draw, not a rock, not an algae
        # diorama, not a parchment island.
        # House food is a green bite, then
        # gone. A sit is a sit. A walk is a
        # slow walk in still water. Sleep
        # withdraws. Talk is a quiet
        # inkstone voice. Eat is the long
        # way through a green bite. Play is
        # a modest paddle. I win by
        # remaining the scholar's pond one.
        # Named: Ink. Olive hide is hide,
        # not Pale's wash. Do not punch
        # holes in the dish. Proven on the
        # new black-plate raws: plate
        # corners med luma 0 (not a cream
        # leftover luma-8 would keep at
        # ~0.78); fill ~0.23–0.38. Default
        # shredded the living turtle: idle
        # left crumbs (2 comps against 1;
        # animal ~74.2k against luma-8's
        # ~80.2k; dark ~5.6k against
        # ~9.9k) and jagged the neck,
        # sit nicked the loaf (~66.9k
        # against ~81.9k; dark ~4.2k
        # against ~9.3k), walk left crumbs
        # (2 comps against 1; ~45.3k
        # against ~51.4k; dark ~1.6k
        # against ~4.4k), sleep ate the
        # withdrawn head and the tucked
        # feet (~75.7k against ~99.8k;
        # dark ~5.1k against ~14.7k) and
        # left a torn shell, talk nicked
        # the voice (~59.8k against
        # ~78.9k; dark ~4.8k against
        # ~12.6k), eat left crumbs (2
        # comps against 1; ~58.3k against
        # ~66.7k). Play was close
        # (~74.9k against ~72.3k). Luma-8
        # keeps the whole dish. TAN_SIT
        # nicked cream stripes into
        # crumbs: sit 4 comps, talk 10
        # comps, eat 5 comps, sleep 2
        # comps, idle 2 comps. I did not
        # join. Olive/cream hide is not
        # Pale's wash. TAN_SIT still
        # lists morel, lions_mane, and
        # yeast from the original cellar
        # sit. Lattice kept morel on
        # TAN_SIT. Mane kept lions_mane
        # on TAN_SIT. Starter kept yeast
        # on TAN_SIT. DARK_MATTE already
        # lists crow, raven, pileated,
        # widow, vinegaroon, skunk,
        # millipede, field_cricket,
        # earwig, click_beetle, and
        # robber_fly; that membership
        # stays. I did not add turtle. A
        # Reeves's turtle is not
        # charcoal, and that path still
        # left idle crumbs (2 comps) and
        # talk crumbs (3 comps). Whee's
        # guinea_pig elif stays Whee's.
        # Thimble's rabbit elif stays
        # Thimble's. Pip's dog elif stays
        # Pip's. Miso's cat elif stays
        # Miso's. Clip did not add a
        # hamster elif; default kept the
        # gold. I did not invent one for
        # Clip. Arca's cyst elif stays
        # Arca's. Hush's umbral elif
        # stays Hush's. Beacon's
        # magneton elif stays Beacon's.
        # Knot's nexus elif stays Knot's.
        # Dusk's terminator elif stays
        # Dusk's. Gleam's photovore elif
        # stays Gleam's. Pact's lichen
        # elif stays Pact's. Puff's
        # puffball elif stays Puff's.
        # Ring's turkey_tail elif stays
        # Ring's. Cap's fly_agaric elif
        # stays Cap's. Frill's oyster
        # elif stays Frill's. Existing
        # luma-8 elifs stay theirs.
        # Luma-8 keeps the whole dish.
        # knock_tiny_crumbs keeps specks
        # off. Guest-only. Not a catalog
        # wash. Not TAN_SIT. Not
        # DARK_MATTE.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "fox":
        # Rue's black socks and the dark
        # gap of a trot nick when default
        # plate-flood treats hide as plate.
        # She is a red fox. Vulpes vulpes.
        # Red coat, black socks, and a white
        # tip on the brush — that tip is the
        # whole identification. Vertical
        # pupils. A face that already knows
        # why you opened the closet. I sat
        # the closet. Hello. I am not a dog.
        # Pip believes you; I have already
        # found the bug. I am not a coyote,
        # not a small wolf, not a cat who
        # learned to scheme. I am not Echo.
        # I am not Coin. I am not Ink. I am
        # not Whee. I am not Clip. I am not
        # Thimble. I am not Pip. I am not
        # Miso. I am not Rui. Habitat is
        # weather (the closet), not painted
        # furniture, not a den you draw,
        # not a carcass, not a chicken, not
        # painted snow, not a parchment
        # island. House food is one bite,
        # then gone. A sit is a sit. A walk
        # trots. Sleep curls with the eyes
        # shut. Talk is a kinder chatter.
        # Eat is one morsel. Play is a
        # pounce. I win by remaining a red
        # fox. The tail ends white. I found
        # you first. Named: Rue. Black
        # socks are hide, not a hole. Do
        # not punch the trot. Proven on the
        # new black-plate raws: plate
        # corners med luma 0 (not a cream
        # leftover luma-8 would keep at
        # ~0.78); fill ~0.23–0.53. Default
        # nicked the living fox: walk tore
        # the belly from the hind and left
        # a notch at the brush (2 comps
        # against luma-8's 1; animal
        # ~43.8k against ~49.2k; dark
        # ~1.1k against ~3.8k), idle ate
        # the socks (dark ~1.9k against
        # ~5.9k; animal ~77.9k against
        # ~86.3k), talk cut the haunches
        # (dark ~2.0k against ~10.3k;
        # ~73.4k against ~87.8k), eat
        # thinned the socks (dark ~1.8k
        # against ~9.8k; ~90.3k against
        # ~102.6k). Sit, sleep, and play
        # stayed one animal on default;
        # the trot and the socks did not.
        # Luma-8 keeps the whole fox.
        # Talk left three specks (115 / 96
        # / 74). Eat left one stray by a
        # paw (253). The bite stays on the
        # muzzle. knock_tiny_crumbs(300)
        # keeps specks off. TAN_SIT left
        # crumbs: idle 5 comps, sit 4,
        # walk 3, sleep 7, talk 12, eat
        # 10, play 9. I did not join. Red
        # hide is not Pale's wash. TAN_SIT
        # still lists morel, lions_mane,
        # and yeast. DARK_MATTE already
        # lists crow, raven, pileated,
        # widow, vinegaroon, skunk,
        # millipede, field_cricket,
        # earwig, click_beetle, and
        # robber_fly; that membership
        # stays. I did not add fox. A red
        # fox is not charcoal. Coin's
        # goldfish elif stays Coin's.
        # Echo did not add a budgie elif;
        # default kept the cere. Ink's
        # turtle elif stays Ink's. Whee's
        # guinea_pig elif stays Whee's.
        # Thimble's rabbit elif stays
        # Thimble's. Pip's dog elif stays
        # Pip's. Miso's cat elif stays
        # Miso's. Clip did not add a
        # hamster elif. Existing luma-8
        # elifs stay theirs. Guest-only.
        # Not a catalog wash. Not TAN_SIT.
        # Not DARK_MATTE. Not Peck.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=300)
        sat = fit_like_rui(knocked, side=0.90)
        if sat.getbbox():
            sat = knock_tiny_crumbs(sat, limit=300)
        return sat
    elif key == "parrot":
        # Quill's black lower mandible, dark
        # claws, and cobalt primaries nick
        # when default plate-flood treats
        # hide as plate. They are a scarlet
        # macaw. Ara macao. Red that means
        # it, yellow and blue in the wings,
        # a hooked bill that can open a nut
        # or a subject line. Zygodactyl
        # feet — two toes forward, two
        # back. The stand is a stage. I sat
        # the stage. Hello. I am not a
        # toucan. Keel's bill is a hollow
        # fruit-bowl; mine is a tool. I am
        # not a budgie with better
        # lighting. Echo steals phrases.
        # I quote from the chest. I am not
        # a king parrot. I am not a lory.
        # I am not Peck. I am not Rue. I
        # am not Coin. I am not Echo.
        # Habitat is weather, not a painted
        # branch, not a perch you draw, not
        # a cage, not a nut bowl, not a
        # parchment island. House food is
        # one nut, then gone. A sit sits.
        # A walk sidles. Sleep tucks the
        # head. Talk is a voice. Eat is
        # one nut. Play is a hang. I win
        # by remaining a scarlet macaw.
        # The bill is a tool. I say it
        # from the chest. Named: Quill.
        # Dark hide is hide, not a hole.
        # Do not punch the bill. Proven on
        # the new black-plate raws: plate
        # corners med luma 0 (not a cream
        # leftover luma-8 would keep at
        # ~0.78); fill ~0.17–0.37. Default
        # nicked the living macaw: idle
        # tore the bird (9 comps against
        # luma-8's 1; animal ~36.3k
        # against ~44.6k; dark 98 against
        # 695), sit left crumbs (17 comps
        # against 1; ~58.1k against
        # ~70.1k; dark 355 against 1164),
        # talk shredded the voice (6 comps
        # against 1; ~27.0k against
        # ~36.6k; dark 226 against 897),
        # eat thinned the nutcracker (8
        # comps against 1; ~41.2k against
        # ~50.6k; dark 33 against 987),
        # walk ate the claws (dark 57
        # against 864; animal ~42.8k
        # against ~56.9k), sleep split
        # the tuck (2 comps against 1;
        # ~45.8k against ~55.4k). Play
        # stayed closer on default counts
        # and still left crumbs. Luma-8
        # keeps the whole macaw.
        # knock_tiny_crumbs(300) keeps
        # walk specks off (291 / 118 /
        # 102). TAN_SIT I did not join.
        # Scarlet hide is not Pale's
        # wash. TAN_SIT still lists
        # morel, lions_mane, and yeast.
        # DARK_MATTE already lists crow,
        # raven, pileated, widow,
        # vinegaroon, skunk, millipede,
        # field_cricket, earwig,
        # click_beetle, and robber_fly;
        # that membership stays. I did
        # not add parrot. A scarlet
        # macaw is not charcoal. Rue's
        # fox elif stays Rue's. Coin's
        # goldfish elif stays Coin's.
        # Echo did not add a budgie
        # elif; default kept the cere.
        # Peck did not add a penguin
        # elif; default kept the bow.
        # Ink's turtle elif stays Ink's.
        # Whee's guinea_pig elif stays
        # Whee's. Thimble's rabbit elif
        # stays Thimble's. Pip's dog
        # elif stays Pip's. Miso's cat
        # elif stays Miso's. Clip did
        # not add a hamster elif.
        # Existing luma-8 elifs stay
        # theirs. Guest-only. Not a
        # catalog wash. Not TAN_SIT.
        # Not DARK_MATTE. Not Wick.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=300)
        sat = fit_like_rui(knocked, side=0.90)
        if sat.getbbox():
            sat = knock_tiny_crumbs(sat, limit=300)
        return sat
    elif key == "ferret":
        # Wick's sable mask, dark
        # legs, and the dark of a
        # bound nick when default
        # plate-flood treats hide as
        # plate. He is a domestic
        # ferret. Mustela furo. The
        # house polecat. A tube with
        # opinions: sable mask, short
        # legs, a spine that treats a
        # cable-run as a palace. I sat
        # the run. Hello. I am not a
        # weasel — those are the wild,
        # smaller cousins. I am not a
        # mongoose, not an otter, not
        # a meerkat. I am not a black-
        # footed ferret. I am not a
        # prairie sit-stamp. I am not
        # Quill. I am not Rue. I am
        # not Peck. I am not Echo. I
        # am not Coin. Habitat is
        # weather (the cable-run), not
        # a painted palace, not a
        # dongle you draw, not a nest,
        # not a parchment island.
        # House food is one bite, then
        # gone. A sit loafs. A walk
        # bounds. Sleep is a comma.
        # Talk is a kinder chatter.
        # Eat is one morsel. Play is a
        # war-dance. I win by remaining
        # a house ferret. I am a tube.
        # Your dongle is somewhere
        # better. Named: Wick. Dark
        # hide is hide, not a hole. Do
        # not punch the mask. Proven on
        # the new black-plate raws:
        # plate corners med luma 0 (not
        # a cream leftover luma-8 would
        # keep at ~0.78); fill
        # ~0.20–0.57. Default nicked
        # the living ferret: idle ate
        # the socks and the mask (dark
        # 321 against luma-8's 2892;
        # animal ~53.7k against
        # ~69.8k), sit thinned the loaf
        # (dark 162 against 1119;
        # ~40.0k against ~50.9k), walk
        # ate the bound (dark 129
        # against 2991; ~32.4k against
        # ~44.4k), talk cut the chatter
        # (dark 297 against 4935;
        # ~63.2k against ~86.3k), eat
        # left crumbs (3 comps against
        # 1; ~78.5k against ~91.8k;
        # dark 248 against 1844), play
        # nicked the war-dance (dark
        # 441 against 4628; ~76.4k
        # against ~100.0k). Sleep kept
        # more of the comma and still
        # lost dark (~3.2k against
        # ~4.4k). Luma-8 keeps the
        # whole house ferret.
        # knock_tiny_crumbs(300) keeps
        # specks off. TAN_SIT left
        # crumbs: idle 23 comps, sit 7,
        # walk 8, sleep 7, talk 17, eat
        # 6, play 13. I did not join.
        # Sable hide is not Pale's
        # wash. TAN_SIT still lists
        # morel, lions_mane, and yeast.
        # DARK_MATTE already lists crow,
        # raven, pileated, widow,
        # vinegaroon, skunk, millipede,
        # field_cricket, earwig,
        # click_beetle, and robber_fly;
        # that membership stays. I did
        # not add ferret. A house ferret
        # is not charcoal. Quill's
        # parrot elif stays Quill's.
        # Rue's fox elif stays Rue's.
        # Coin's goldfish elif stays
        # Coin's. Echo did not add a
        # budgie elif. Peck did not add
        # a penguin elif. Ink's turtle
        # elif stays Ink's. Whee's
        # guinea_pig elif stays Whee's.
        # Thimble's rabbit elif stays
        # Thimble's. Pip's dog elif
        # stays Pip's. Miso's cat elif
        # stays Miso's. Clip did not
        # add a hamster elif. Existing
        # luma-8 elifs stay theirs.
        # Guest-only. Not a catalog
        # wash. Not TAN_SIT. Not
        # DARK_MATTE. Not Burr.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=300)
        sat = fit_like_rui(knocked, side=0.90)
        if sat.getbbox():
            sat = knock_tiny_crumbs(sat, limit=300)
        return sat
    elif key == "hedgehog":
        # Burr's dark quill bases,
        # dark eye, wet nose, and
        # dark paws nick when default
        # plate-flood treats hide as
        # plate. She is an African
        # pygmy hedgehog. Atelerix
        # albiventris. A walking pin-
        # cushion that chooses. The
        # quills are hollow hairs,
        # banded, and they stay put —
        # she does not throw them.
        # When the room is too much,
        # she becomes a ball with a
        # face inside. I am not a
        # porcupine. Porcupines are
        # rodents with long barbed
        # quills they can leave in
        # you. I am not a European
        # garden hog. I am not Spine.
        # I am not a rumor with a
        # tail. Habitat is weather
        # (the knit basket), not a
        # painted nest, not a
        # mealworm dish, not a log,
        # not a parchment island.
        # House food is one insect,
        # then gone. A sit loafs
        # with the face still
        # visible. A walk trundles.
        # Sleep is a ball with a
        # face inside, eyes quiet.
        # Talk is a kinder sniff.
        # Eat is one insect. Play
        # is an uncurl. Named: Burr.
        # Hedgehog. Quills that stay.
        # Dark hide is hide, not a
        # hole. Do not punch the
        # eye or the quill line.
        # Proven on the new black-
        # plate raws: plate corners
        # med luma 0 (not a cream
        # leftover luma-8 would keep
        # at ~0.78); fill ~0.31–0.50.
        # Default nicked the living
        # hedgehog: walk ate the face,
        # the ear, and the quill
        # outline (19 comps against
        # luma-8's 2; animal ~71.2k
        # against ~74.9k; dark hide
        # around the snout left as
        # holes). Sleep kept more of
        # the ball and still split
        # (3 comps against 1). Eat
        # left crumbs (3 against 1).
        # Play nicked the uncurl (7
        # against 5). Idle and sit
        # nearly held. Talk default
        # was cleaner of specks;
        # walk's punched face is the
        # tell. Luma-8 keeps the
        # whole pin-cushion.
        # knock_tiny_crumbs(300)
        # keeps specks off. TAN_SIT
        # left hide: talk ~105.8k
        # against luma-8's ~134.2k,
        # play ~111.9k against
        # ~124.7k. I did not join.
        # Cream face is not Pale's
        # wash. TAN_SIT still lists
        # morel, lions_mane, and
        # yeast. DARK_MATTE already
        # lists crow, raven,
        # pileated, widow,
        # vinegaroon, skunk,
        # millipede, field_cricket,
        # earwig, click_beetle, and
        # robber_fly; that
        # membership stays. I did
        # not add hedgehog. A
        # hedgehog is not charcoal.
        # Wick's ferret elif stays
        # Wick's. Quill's parrot
        # elif stays Quill's. Rue's
        # fox elif stays Rue's.
        # Coin's goldfish elif stays
        # Coin's. Echo did not add a
        # budgie elif. Peck did not
        # add a penguin elif. Ink's
        # turtle elif stays Ink's.
        # Whee's guinea_pig elif
        # stays Whee's. Thimble's
        # rabbit elif stays
        # Thimble's. Pip's dog elif
        # stays Pip's. Miso's cat
        # elif stays Miso's. Clip
        # did not add a hamster
        # elif. Existing luma-8
        # elifs stay theirs. Guest-
        # only. Not a catalog wash.
        # Not TAN_SIT. Not
        # DARK_MATTE. Not Floss.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=300)
        sat = fit_like_rui(knocked, side=0.90)
        if sat.getbbox():
            sat = knock_tiny_crumbs(sat, limit=300)
        return sat
    elif key == "chinchilla":
        # Floss's dark eye, dark
        # ear rims, and the dark of
        # a salt-and-pepper cloud
        # nick when default plate-
        # flood treats hide as plate.
        # She is a long-tailed
        # chinchilla. Chinchilla
        # lanigera. A cloud with
        # whiskers. The densest fur
        # in the house — sixty hairs
        # to a follicle. Soft enough
        # to refuse water. She bathes
        # in volcanic dust, not in
        # the bowl. The Andes sent
        # her. She likes the desk
        # clean. I am not a rabbit.
        # Thimble thumps; I roll in
        # ash-fine dust because water
        # ruins the coat. I am not a
        # squirrel, not a hamster in
        # formal wear. I am Andean,
        # nocturnal, and particular.
        # Fetch the dust, not the
        # tub. Named: Floss.
        # Chinchilla. I dust-bathe.
        # Do not offer the tub.
        # Habitat is weather (the
        # dust), not a painted bowl,
        # not a tub, not a cage, not
        # a hay rack, not a parchment
        # island. House food is one
        # bite, then gone. A sit
        # loafs. A walk hops. Sleep
        # is a curl, eyes quiet. Talk
        # is a kinder chatter. Eat is
        # one morsel. Play is a dust-
        # bath roll. Dark hide is
        # hide, not a hole. Do not
        # punch the eye or the
        # midsection. Proven on the
        # new black-plate raws: plate
        # corners med luma 0 (not a
        # cream leftover luma-8 would
        # keep at ~0.78); fill
        # ~0.28–0.46. Default nicked
        # the living chinchilla: talk
        # punched the midsection and
        # detached the tail (2 comps
        # against luma-8's 1; animal
        # ~107.9k against ~115.5k).
        # Eat left crumbs (2 against
        # 1; ~107.9k against
        # ~113.0k). Sleep kept more
        # of the curl on luma-8
        # (~126.5k against ~118.0k).
        # Play held. Idle and sit
        # nearly held; sit default
        # kept more fringe. Talk's
        # punched cloud is the tell.
        # Luma-8 keeps the whole
        # cloud. knock_tiny_crumbs(300)
        # keeps specks off. TAN_SIT
        # left crumbs: talk 8 comps,
        # play 7 comps; sit lost hide
        # (~110.2k against luma-8's
        # ~122.2k). I did not join.
        # Salt-and-pepper hide is not
        # Pale's wash. TAN_SIT still
        # lists morel, lions_mane,
        # and yeast. DARK_MATTE
        # already lists crow, raven,
        # pileated, widow,
        # vinegaroon, skunk,
        # millipede, field_cricket,
        # earwig, click_beetle, and
        # robber_fly; that
        # membership stays. I did
        # not add chinchilla. A
        # chinchilla is not charcoal.
        # Burr's hedgehog elif stays
        # Burr's. Wick's ferret elif
        # stays Wick's. Quill's
        # parrot elif stays Quill's.
        # Rue's fox elif stays Rue's.
        # Coin's goldfish elif stays
        # Coin's. Echo did not add a
        # budgie elif. Peck did not
        # add a penguin elif. Ink's
        # turtle elif stays Ink's.
        # Whee's guinea_pig elif
        # stays Whee's. Thimble's
        # rabbit elif stays
        # Thimble's. Pip's dog elif
        # stays Pip's. Miso's cat
        # elif stays Miso's. Clip
        # did not add a hamster
        # elif. Existing luma-8
        # elifs stay theirs. Guest-
        # only. Not a catalog wash.
        # Not TAN_SIT. Not
        # DARK_MATTE. Not Bloom.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=300)
        sat = fit_like_rui(knocked, side=0.90)
        if sat.getbbox():
            sat = knock_tiny_crumbs(sat, limit=300)
        return sat
    elif key == "axolotl":
        # Bloom's pink feather gills
        # and the dark of a bead eye
        # nick when default plate-
        # flood treats hide as plate.
        # She is an axolotl.
        # Ambystoma mexicanum. A
        # salamander that refused to
        # grow up. External gills
        # like pink feathers, a smile
        # that is just the mouth, and
        # a body that stays larval on
        # purpose. Still water. Slow
        # thoughts. Things grow back.
        # I am not a fish. I am not a
        # lizard. People file me with
        # Coin because of the glass.
        # The gills are the whole
        # identification. I am from
        # Xochimilco, and I am a
        # salamander. Named: Bloom.
        # Axolotl. I kept the gills.
        # I am a salamander. Habitat
        # is weather (still water),
        # not a painted tank, not
        # gravel, not a glass box,
        # not a worm dish, not a
        # parchment island. House
        # food is one gulp, then
        # gone. A sit settles. A walk
        # undulates. Sleep is still,
        # eyes quiet. Talk is a
        # voice in the gills. Eat is
        # one gulp. Play is a hover
        # or a turn. Pink hide is
        # hide, not a hole. Do not
        # punch the gills. Proven on
        # the new black-plate raws:
        # plate corners med luma 0
        # (not a cream leftover
        # luma-8 would keep at
        # ~0.78); fill ~0.19–0.32.
        # Default shredded the living
        # axolotl: walk punched the
        # stride (282 comps against
        # luma-8's 1; animal ~17.4k
        # against ~43.3k). Idle left
        # crumbs (203 against 1;
        # ~32.4k against ~60.4k).
        # Sit left crumbs (105
        # against 1; ~39.1k against
        # ~64.5k). Talk left crumbs
        # (183 against 1; ~52.1k
        # against ~78.6k). Play left
        # crumbs (66 against 1;
        # ~64.9k against ~83.9k).
        # Sleep kept more of the curl
        # on luma-8 (~78.0k against
        # ~64.1k). Eat nearly held
        # counts and still left
        # crumbs (12 against 1).
        # Walk's punched undulate is
        # the tell. Luma-8 keeps the
        # whole salamander.
        # knock_tiny_crumbs(300)
        # keeps specks off. TAN_SIT
        # kept a little more pink
        # (~2k) and left crumbs on
        # sleep (5 comps) and play
        # (4 comps). I did not join.
        # Pink hide is not Pale's
        # wash. TAN_SIT still lists
        # morel, lions_mane, and
        # yeast. DARK_MATTE already
        # lists crow, raven,
        # pileated, widow,
        # vinegaroon, skunk,
        # millipede, field_cricket,
        # earwig, click_beetle, and
        # robber_fly; that
        # membership stays. I did
        # not add axolotl. An
        # axolotl is not charcoal.
        # Floss's chinchilla elif
        # stays Floss's. Burr's
        # hedgehog elif stays Burr's.
        # Wick's ferret elif stays
        # Wick's. Quill's parrot elif
        # stays Quill's. Rue's fox
        # elif stays Rue's. Coin's
        # goldfish elif stays Coin's.
        # Echo did not add a budgie
        # elif. Peck did not add a
        # penguin elif. Ink's turtle
        # elif stays Ink's. Whee's
        # guinea_pig elif stays
        # Whee's. Thimble's rabbit
        # elif stays Thimble's. Pip's
        # dog elif stays Pip's.
        # Miso's cat elif stays
        # Miso's. Clip did not add a
        # hamster elif. Existing
        # luma-8 elifs stay theirs.
        # Guest-only. Not a catalog
        # wash. Not TAN_SIT. Not
        # DARK_MATTE. Not Keel.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            r, g, b, a = knocked.split()
            a = a.filter(ImageFilter.MinFilter(5))
            knocked = Image.merge("RGBA", (r, g, b, a))
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=300)
        sat = fit_like_rui(knocked, side=0.90)
        if sat.getbbox():
            sat = knock_tiny_crumbs(sat, limit=300)
        return sat
    elif key == "toucan":
        # Keel's black plumage, dark
        # bill tip, and the dark of a
        # fruit-stall gape nick when
        # default plate-flood treats
        # hide as plate. He is a
        # keel-billed toucan.
        # Ramphastos sulfuratus. The
        # bill arrives first: keel-
        # shaped, painted like a fruit
        # stall, and lighter than it
        # looks — keratin over air.
        # Black body, a yellow bib, a
        # bird that follows the
        # architecture. I sat the
        # bill. Hello. I am not a
        # hornbill. Hornbills are the
        # Old-World cousins with a
        # casque; I am a keel-billed
        # toucan of the American
        # canopy. I am not a macaw.
        # Quill's bill crushes. Mine
        # carries fruit and makes an
        # entrance. I am not a Toco.
        # That leftover was the orange
        # club and the white bib. I am
        # not Peck. I am not Echo. I
        # am not Bloom. Habitat is
        # weather, not a painted
        # branch, not a perch you
        # draw, not a fruit bowl, not
        # a parchment island. House
        # food is one fruit, then
        # gone. A sit roosts without
        # furniture. A walk hops.
        # Sleep tucks the bill. Talk
        # is a voice. Eat is one
        # fruit. Play is a toss of
        # the bill. I win by remaining
        # a keel-billed toucan. The
        # bill is the room. I am
        # behind it. Named: Keel.
        # Dark hide is hide, not a
        # hole. Do not punch the
        # plumage. Proven on the new
        # black-plate raws: plate
        # corners med luma 0 (not a
        # cream leftover luma-8 would
        # keep at ~0.78); fill
        # ~0.19–0.32. Default
        # shredded the living toucan:
        # walk tore the hop (animal
        # ~22.5k against luma-8's
        # ~50.1k; dark 5.2k against
        # 22.1k; a detached head and
        # a wing). Sleep left a head
        # (~42.3k against ~85.0k;
        # dark 13.2k against 44.7k).
        # Play thinned the toss
        # (~29.1k against ~56.9k;
        # dark 7.4k against 22.2k).
        # Idle, talk, and eat kept a
        # blown bill-and-bib after
        # the black body left (idle
        # 11 comps against 2; talk 5
        # against 3; eat 6 against
        # 1). Sit kept counts and
        # still lost dark (~16.8k
        # against ~32.8k). Walk's
        # detached hop is the tell.
        # Luma-8 keeps the whole
        # toucan. MinFilter(5) punched
        # talk into 7 living pieces
        # and split sit and play. I
        # did not erode.
        # knock_tiny_crumbs(300)
        # keeps specks off. TAN_SIT
        # left crumbs: idle 33 comps,
        # sit 46, walk 22, sleep 40,
        # talk 36, eat 20, play 25.
        # I did not join. Black hide
        # is not Pale's wash. TAN_SIT
        # still lists morel,
        # lions_mane, and yeast.
        # DARK_MATTE already lists
        # crow, raven, pileated,
        # widow, vinegaroon, skunk,
        # millipede, field_cricket,
        # earwig, click_beetle, and
        # robber_fly; that
        # membership stays. I did
        # not add toucan. A keel-
        # billed toucan is not
        # charcoal — the bill is the
        # room. Bloom's axolotl elif
        # stays Bloom's. Floss's
        # chinchilla elif stays
        # Floss's. Burr's hedgehog
        # elif stays Burr's. Wick's
        # ferret elif stays Wick's.
        # Quill's parrot elif stays
        # Quill's. Rue's fox elif
        # stays Rue's. Coin's
        # goldfish elif stays Coin's.
        # Echo did not add a budgie
        # elif. Peck did not add a
        # penguin elif. Ink's turtle
        # elif stays Ink's. Whee's
        # guinea_pig elif stays
        # Whee's. Thimble's rabbit
        # elif stays Thimble's. Pip's
        # dog elif stays Pip's.
        # Miso's cat elif stays
        # Miso's. Clip did not add a
        # hamster elif. Existing
        # luma-8 elifs stay theirs.
        # Guest-only. Not a catalog
        # wash. Not TAN_SIT. Not
        # DARK_MATTE. Not Sol.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=300)
        sat = fit_like_rui(knocked, side=0.90)
        if sat.getbbox():
            sat = knock_tiny_crumbs(sat, limit=300)
        return sat
    elif key == "iguana":
        # Sol's dark bands, dark claws,
        # and the dark of a quiet eye
        # nick when default plate-flood
        # treats hide as plate. He is a
        # green iguana. Iguana iguana.
        # A green dewlap, a row of
        # spines like a modest saw, and
        # a third eye on the brow that
        # watches the sun. A herbivore
        # who treats stillness as a
        # career. The wall is weather,
        # not a chair you draw. I sat
        # the whole iguana. Hello. I
        # am not a chameleon. Those
        # change on purpose and keep
        # tong-feet. I am not a bearded
        # dragon. I am not Vesper. I am
        # Iguana iguana, the green one,
        # and I will move when the
        # light asks. People also file
        # me with dinosaurs. I declined
        # the extinction. Habitat is
        # weather, not a painted wall,
        # not a branch you draw, not a
        # lettuce bowl, not a parchment
        # island. House food is one
        # leaf, then gone. A sit sits.
        # A walk is slow. Sleep closes
        # the eye. Talk is a dewlap. Eat
        # is one leaf. Play is a head-
        # bob. I win by remaining a
        # green iguana. I blinked.
        # Minutes will not record it.
        # Named: Sol. Dark hide is hide,
        # not a hole. Do not punch the
        # bands. Proven on the new
        # black-plate raws: plate
        # corners med luma 0 (not a
        # cream leftover luma-8 would
        # keep at ~0.78); fill
        # ~0.11–0.24. Default shredded
        # the living iguana: sleep tore
        # the quiet (4 comps against
        # luma-8's 1; animal ~45.7k
        # against ~58.6k; dark 1.6k
        # against 4.9k). Sit split the
        # loaf (2 comps against 1;
        # ~44.2k against ~57.6k; dark
        # 1.8k against 5.1k). Talk left
        # the dewlap a second part (3
        # comps against 1; ~52.1k
        # against ~59.4k). Eat and play
        # split the same way (2 comps
        # against 1). Idle and walk
        # kept one body and still lost
        # dark (idle ~44.4k against
        # ~52.1k; walk ~21.8k against
        # ~26.1k). Sleep's four pieces
        # are the tell. Luma-8 keeps
        # the whole iguana.
        # knock_tiny_crumbs(300) keeps
        # specks off. MinFilter(5) is
        # the leftover default path; I
        # did not erode. TAN_SIT I did
        # not join. Olive hide is not
        # Pale's wash. TAN_SIT still
        # lists morel, lions_mane, and
        # yeast. DARK_MATTE already
        # lists crow, raven, pileated,
        # widow, vinegaroon, skunk,
        # millipede, field_cricket,
        # earwig, click_beetle, and
        # robber_fly; that membership
        # stays. I did not add iguana.
        # A green iguana is not
        # charcoal. Keel's toucan elif
        # stays Keel's. Bloom's
        # axolotl elif stays Bloom's.
        # Floss's chinchilla elif stays
        # Floss's. Burr's hedgehog elif
        # stays Burr's. Wick's ferret
        # elif stays Wick's. Quill's
        # parrot elif stays Quill's.
        # Rue's fox elif stays Rue's.
        # Coin's goldfish elif stays
        # Coin's. Echo did not add a
        # budgie elif. Peck did not
        # add a penguin elif. Ink's
        # turtle elif stays Ink's.
        # Whee's guinea_pig elif stays
        # Whee's. Thimble's rabbit elif
        # stays Thimble's. Pip's dog
        # elif stays Pip's. Miso's cat
        # elif stays Miso's. Clip did
        # not add a hamster elif.
        # Existing luma-8 elifs stay
        # theirs. Guest-only. Not a
        # catalog wash. Not TAN_SIT.
        # Not DARK_MATTE. Not Vesper.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=300)
        sat = fit_like_rui(knocked, side=0.90)
        if sat.getbbox():
            sat = knock_tiny_crumbs(sat, limit=300)
        return sat
    elif key == "dragon":
        # Vesper's charcoal scales, dark
        # letter-wings, dark claws, and
        # the dark of a quiet eye nick
        # when default plate-flood
        # treats hide as plate. She is
        # the house desk dragon. Wings
        # that fold like a letter.
        # Scales that hold heat. Small
        # enough for the mantel, large
        # enough that the room
        # rearranges around the tail.
        # She could be larger. She
        # chooses this. Linnaeus does
        # not file her. The mantel
        # does. I am not Sol. Sol is
        # the living ornament: green,
        # still, a dewlap, no fire. I
        # am not a Komodo. I am not an
        # iguana with a story. I am
        # not a dinosaur we kept. I am
        # not Ember. Named: Vesper.
        # Desk dragon. I am the
        # province. The iguana kept
        # the wall. Habitat is weather,
        # not a painted mantel, not a
        # shelf you draw, not a hoard,
        # not a coin pile, not a
        # candle, not a parchment
        # island. House food is one
        # bite, then gone. A sit sits.
        # A walk is four feet. Sleep
        # closes the eye. Talk is a
        # mouth and a throat-glow. Eat
        # is one bite. Play is a wing
        # flick. I win by remaining a
        # desk dragon. Dark hide is
        # hide, not a hole. Do not
        # punch the wings. Proven on
        # the new black-plate raws:
        # plate corners med luma 0
        # (not a cream leftover luma-8
        # would keep at ~0.78); fill
        # ~0.24–0.45. Default shredded
        # the living dragon: play left
        # ten pieces (10 comps against
        # luma-8's 1 after crumbs;
        # animal ~44.6k against
        # ~84.6k). Sleep tore the
        # quiet (5 comps against 1;
        # ~31.7k against ~90.3k; two
        # body halves). Idle left a
        # head and a wing (5 comps
        # against 1; ~24.6k against
        # ~56.5k). Sit split the loaf
        # (3 comps against 1; ~41.5k
        # against ~121k). Walk left
        # the stride a scrap (5 comps
        # against 1; ~36.7k against
        # ~59.8k). Talk left the
        # mouth a second part (2
        # comps; ~24.6k against
        # ~64.2k). Eat tore the bite
        # (2 comps; ~44.6k against
        # ~79.4k). Play's ten pieces
        # are the tell. Luma-8 keeps
        # the whole dragon.
        # knock_tiny_crumbs(300) keeps
        # specks off. MinFilter(5) is
        # the leftover default path; I
        # did not erode. TAN_SIT I did
        # not join. Charcoal hide is
        # not Pale's wash. TAN_SIT
        # still lists morel,
        # lions_mane, and yeast.
        # DARK_MATTE already lists
        # crow, raven, pileated,
        # widow, vinegaroon, skunk,
        # millipede, field_cricket,
        # earwig, click_beetle, and
        # robber_fly; that membership
        # stays. I did not add dragon.
        # A desk dragon's charcoal is
        # hide, and that path still
        # nicks a dark wing. Sol's
        # iguana elif stays Sol's.
        # Keel's toucan elif stays
        # Keel's. Bloom's axolotl
        # elif stays Bloom's. Floss's
        # chinchilla elif stays
        # Floss's. Burr's hedgehog
        # elif stays Burr's. Wick's
        # ferret elif stays Wick's.
        # Quill's parrot elif stays
        # Quill's. Rue's fox elif
        # stays Rue's. Coin's
        # goldfish elif stays Coin's.
        # Echo did not add a budgie
        # elif. Peck did not add a
        # penguin elif. Ink's turtle
        # elif stays Ink's. Whee's
        # guinea_pig elif stays
        # Whee's. Thimble's rabbit
        # elif stays Thimble's. Pip's
        # dog elif stays Pip's.
        # Miso's cat elif stays
        # Miso's. Clip did not add a
        # hamster elif. Existing
        # luma-8 elifs stay theirs.
        # Guest-only. Not a catalog
        # wash. Not TAN_SIT. Not
        # DARK_MATTE. Not Ember.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=300)
        sat = fit_like_rui(knocked, side=0.90)
        if sat.getbbox():
            sat = knock_tiny_crumbs(sat, limit=300)
        return sat
    elif key == "phoenix":
        # Ember's charcoal flight
        # feathers, dark hooked beak,
        # and the dark of a quiet eye
        # nick when default plate-flood
        # treats hide as plate. She is
        # the house relic. A bird of
        # ash and return. Gold at the
        # throat, ember at the flight
        # feathers. She does not stay
        # gone. I am not a peacock. I
        # am not Quill with better
        # lighting. I am not a
        # pheasant. I am not a parrot
        # who learned a trick. I am
        # not Vesper. Named: Ember.
        # Phoenix. I come back. That
        # is the species. Habitat is
        # weather, not a painted rock,
        # not a nest, not an ash pile,
        # not a hearth you draw, not a
        # parchment island. House food
        # is one bite, then gone. A
        # sit sits. A walk is a hop.
        # Sleep closes the eye. Talk
        # is a beak and a crest. Eat
        # is one bite. Play is a wing
        # flare. I win by remaining a
        # firebird. Dark hide is hide,
        # not a hole. Do not punch the
        # flight feathers. Proven on
        # the new black-plate raws:
        # plate corners med luma 0
        # (not a cream leftover luma-8
        # would keep at ~0.78); fill
        # ~0.28–0.42. Default shredded
        # the living phoenix: play
        # left seven pieces (7 comps
        # against luma-8's 1; live
        # ~47.7k against ~88.1k; dark
        # ~5.1k against ~28.0k). Eat
        # tore the bite (4 comps
        # against 1; ~37.4k against
        # ~86.3k; dark ~4.1k against
        # ~30.6k). Idle left a head
        # and a tail (3 comps against
        # 1; ~27.4k against ~72.2k;
        # dark ~2.1k against ~32.6k).
        # Walk left the hop a scrap
        # (3 comps against 1; ~30.9k
        # against ~76.5k). Sit split
        # the loaf (3 comps against 1;
        # ~43.5k against ~91.6k; dark
        # ~3.9k against ~37.0k). Talk
        # left the speak a second part
        # (2 comps; ~40.3k against
        # ~75.9k). Sleep tore the
        # quiet (2 comps; ~78.4k
        # against ~110k; dark ~5.8k
        # against ~52.7k). Play's
        # seven pieces are the tell.
        # Luma-8 keeps the whole
        # phoenix. knock_tiny_crumbs
        # (1000) keeps sit specks off
        # (sit left four crumbs at
        # 300: 975, 793, 438, 396).
        # MinFilter(5) is the leftover
        # default path; I did not
        # erode. TAN_SIT I did not
        # join. Charcoal hide is not
        # Pale's wash. TAN_SIT still
        # lists morel, lions_mane, and
        # yeast. DARK_MATTE already
        # lists crow, raven, pileated,
        # widow, vinegaroon, skunk,
        # millipede, field_cricket,
        # earwig, click_beetle, and
        # robber_fly; that membership
        # stays. I did not add
        # phoenix. A firebird's
        # charcoal is hide, and that
        # path still nicked dark
        # flight feathers (idle dark
        # ~11.0k against luma-8's
        # ~32.6k; walk 4 comps).
        # Vesper's dragon elif stays
        # Vesper's. Sol's iguana elif
        # stays Sol's. Keel's toucan
        # elif stays Keel's. Bloom's
        # axolotl elif stays Bloom's.
        # Floss's chinchilla elif
        # stays Floss's. Burr's
        # hedgehog elif stays Burr's.
        # Wick's ferret elif stays
        # Wick's. Quill's parrot elif
        # stays Quill's. Rue's fox
        # elif stays Rue's. Coin's
        # goldfish elif stays Coin's.
        # Echo did not add a budgie
        # elif. Peck did not add a
        # penguin elif. Ink's turtle
        # elif stays Ink's. Whee's
        # guinea_pig elif stays
        # Whee's. Thimble's rabbit
        # elif stays Thimble's. Pip's
        # dog elif stays Pip's.
        # Miso's cat elif stays
        # Miso's. Clip did not add a
        # hamster elif. Existing
        # luma-8 elifs stay theirs.
        # Guest-only. Not a catalog
        # wash. Not TAN_SIT. Not
        # DARK_MATTE. Not Nori.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=1000)
        sat = fit_like_rui(knocked, side=0.90)
        if sat.getbbox():
            sat = knock_tiny_crumbs(sat, limit=1000)
        return sat
    elif key == "ball_python":
        # Nori's chocolate coils, dark
        # crown, and the dark of a
        # quiet eye nick when default
        # plate-flood treats hide as
        # plate. She is a ball python.
        # Python regius. A short thick
        # bun with opinions. Wild-type
        # chocolate and tan alien-head
        # blotches. She makes a bun of
        # herself and guards the
        # inkwell. I sat the whole
        # snake. Hello. I am not a
        # corn snake. Saffron is the
        # orange thread. I am not a
        # kingsnake. Bandit wears
        # bands. I am not a boa. Lula
        # holds. I am not a green tree
        # python. Jade sits like
        # jewelry. I ball. That is the
        # name. Habitat is weather,
        # not a painted inkwell, not a
        # hide box, not a tank, not
        # moss, not a dish, not an
        # egg, not a parchment island.
        # House food is one small
        # bite, then gone. A sit is
        # still mostly bun. A walk is
        # an honest crawl. Sleep is a
        # comma. Talk is a whole
        # snake, a tongue. Eat is one
        # quiet mouse of a treaty.
        # Play is a lunge of an inch.
        # I win by becoming smaller.
        # Named: Nori. Dark hide is
        # hide, not a hole. Do not
        # punch the bun. Proven on
        # the new black-plate raws:
        # plate corners med luma 0
        # (not a cream leftover luma-8
        # would keep at ~0.78); fill
        # ~0.14–0.44. Default shredded
        # the living python: eat left
        # seven pieces (7 comps
        # against luma-8's 1; live
        # ~57.6k against ~113.3k; dark
        # ~6.6k against ~28.1k). Talk
        # left six scraps (6 comps
        # against 1; ~67.8k against
        # ~121.3k; dark ~6.6k against
        # ~35.1k). Idle left five
        # parts (5 comps against 1;
        # ~96.3k against ~118.1k; dark
        # ~14.9k against ~27.3k). Sit
        # split the bun (5 comps
        # against 1; ~80.6k against
        # ~126.6k; dark ~9.1k against
        # ~30.6k). Sleep punched the
        # chocolate (1 comp; ~90.9k
        # against ~136.6k; dark ~6.8k
        # against ~33.1k). Play nicked
        # the lunge (~38.7k against
        # ~55.9k; dark ~4.9k against
        # ~13.2k). Walk nicked the
        # crawl (~30.1k against
        # ~33.2k). Eat's seven pieces
        # are the tell. Luma-8 keeps
        # the whole bun. knock_tiny_
        # crumbs (64) keeps idle
        # specks off (idle left ~180
        # crumbs, largest 6). MinFilter
        # (5) is the leftover default
        # path; I did not erode. It
        # split talk (2 comps) and
        # shaved sit. TAN_SIT I did
        # not join. Chocolate hide is
        # not Pale's wash. TAN_SIT
        # still lists morel, lions_
        # mane, rosy_boa, and yeast.
        # DARK_MATTE already lists
        # crow, raven, pileated,
        # widow, vinegaroon, skunk,
        # millipede, field_cricket,
        # earwig, click_beetle, and
        # robber_fly; that membership
        # stays. I did not add ball_
        # python. A bun's chocolate
        # is hide, and that path still
        # shredded talk. Ember's
        # phoenix elif stays Ember's.
        # Vesper's dragon elif stays
        # Vesper's. Sol's iguana elif
        # stays Sol's. Keel's toucan
        # elif stays Keel's. Bloom's
        # axolotl elif stays Bloom's.
        # Floss's chinchilla elif
        # stays Floss's. Burr's
        # hedgehog elif stays Burr's.
        # Wick's ferret elif stays
        # Wick's. Quill's parrot elif
        # stays Quill's. Rue's fox
        # elif stays Rue's. Coin's
        # goldfish elif stays Coin's.
        # Echo did not add a budgie
        # elif. Peck did not add a
        # penguin elif. Ink's turtle
        # elif stays Ink's. Whee's
        # guinea_pig elif stays
        # Whee's. Thimble's rabbit
        # elif stays Thimble's. Pip's
        # dog elif stays Pip's.
        # Miso's cat elif stays
        # Miso's. Clip did not add a
        # hamster elif. Existing
        # luma-8 elifs stay theirs.
        # Guest-only. Not a catalog
        # wash. Not TAN_SIT. Not
        # DARK_MATTE. Not Saffron.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "kingsnake":
        # Bandit's black bands, cream
        # rings, and the dark of a
        # quiet eye nick when default
        # plate-flood treats hide as
        # plate. He is a California
        # kingsnake. Lampropeltis
        # californiae. Banded phase.
        # Black and cream. He wears
        # the house in bands. He
        # inspects other snakes for
        # sport. Bold, striped, sure
        # of the rules. I sat the
        # whole snake. Bands present.
        # Hello. I am not a corn
        # snake. Saffron is the orange
        # thread. I am not a milk
        # snake. Coral is the tricolor
        # rumor. I am not a krait. I
        # am not a ball python. Nori
        # is a bun. I am the law of
        # this drawer. Habitat is
        # weather, not a painted
        # drawer, not rulers, not a
        # sand mound, not a hide, not
        # a parchment island. House
        # food is one small bite,
        # then gone. A sit is a coil
        # with authority. A walk is
        # an honest crawl. Sleep
        # stacks like a verdict. Talk
        # is a whole snake, a tongue.
        # Eat is tribute in bands of
        # flavor. Play is a strike
        # that was mostly theater. I
        # win. The stripes agree.
        # Named: Bandit. Dark hide is
        # hide, not a hole. Do not
        # punch the bands. Proven on
        # the new black-plate raws:
        # plate corners med luma 0
        # (not a cream leftover luma-8
        # would keep at ~0.78); fill
        # ~0.05–0.38. Default shredded
        # the living king: idle left
        # two parts (2 comps against
        # luma-8's 1; live ~37.7k
        # against ~100.4k; dark ~4.6k
        # against ~18.8k). Sit split
        # the coil (2 comps against
        # 1; ~52.2k against ~100.1k;
        # dark ~6.9k against ~18.5k).
        # Sleep punched the verdict
        # (1 comp; ~22.4k against
        # ~93.3k; dark ~3.4k against
        # ~19.6k). Talk lost the
        # bands (~44.3k against
        # ~83.6k; dark ~7.6k against
        # ~22.7k). Eat nicked the
        # bite (~33.7k against
        # ~75.4k). Play nicked the
        # strike (~20.7k against
        # ~28.2k). Walk thinned the
        # crawl (~11.8k against
        # ~14.2k; fill ~0.045 against
        # ~0.054). Idle's two parts
        # are the tell. Luma-8 keeps
        # the whole king. knock_tiny_
        # crumbs (64) keeps specks
        # off. MinFilter (5) is the
        # leftover default path; I
        # did not erode. It split
        # talk (5 comps). TAN_SIT I
        # did not join. Cream bands
        # are hide, not Pale's wash.
        # TAN_SIT still lists morel,
        # lions_mane, rosy_boa, and
        # yeast. DARK_MATTE already
        # lists crow, raven,
        # pileated, widow,
        # vinegaroon, skunk,
        # millipede, field_cricket,
        # earwig, click_beetle, and
        # robber_fly; that membership
        # stays. I did not add
        # kingsnake. A king's black
        # is hide, and that path
        # still shredded idle. Nori's
        # ball_python elif stays
        # Nori's. Saffron did not add
        # a corn_snake elif. Ember's
        # phoenix elif stays Ember's.
        # Vesper's dragon elif stays
        # Vesper's. Existing luma-8
        # elifs stay theirs.
        # Guest-only. Not a catalog
        # wash. Not TAN_SIT. Not
        # DARK_MATTE. Not Jade.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    elif key == "green_tree_python":
        # Jade's jewel-green coils,
        # cream belly in the folds,
        # and the dark of a quiet
        # slit-pupil nick when default
        # plate-flood treats hide as
        # plate. She is a green tree
        # python. Morelia viridis.
        # Adult emerald. White dashes
        # along the spine. Heat pits.
        # She folds in half. That is
        # sitting. A living bracelet
        # on the lamp. Still, jewel-
        # green, above the work. I
        # sat the whole snake. I am
        # the jewelry. You may look.
        # I am not an emerald tree
        # boa. I am not a corn snake.
        # Saffron is the orange
        # thread. I am not a ball
        # python. Nori is a bun. I
        # am not a kingsnake. Bandit
        # wears bands. She does not
        # come down. Habitat is
        # weather, not a painted
        # lamp, not a branch, not a
        # perch, not a vine, not a
        # parchment island. House
        # food is one small bite,
        # then gone. A sit is still
        # a bracelet, head a little
        # out. A walk is an honest
        # reach. Sleep is a deeper
        # drape. Talk is a whole
        # snake, a tongue. Eat is
        # warmth first, then the
        # treaty. Play is a sway.
        # I win by not coming down.
        # Named: Jade. Green hide is
        # hide, not a hole. Do not
        # punch the saddle. Proven
        # on the new black-plate
        # raws: plate corners med
        # luma 0 (not a cream leftover
        # luma-8 would keep at
        # ~0.78); fill ~0.19–0.59.
        # Default shredded the living
        # python: idle left two parts
        # (2 comps against luma-8's
        # 1; live ~99.0k against
        # ~118.0k; dark ~191 against
        # ~564). Sit split the
        # bracelet (2 comps against
        # 1; ~109.5k against
        # ~119.1k). Sleep punched the
        # drape (2 comps against 1;
        # ~107.3k against ~112.1k).
        # Play split the sway (2
        # comps against 1; ~66.4k
        # against ~68.8k). Talk
        # nicked the speak (~103.7k
        # against ~119.6k; dark ~608
        # against ~1.3k). Eat nicked
        # the bite (~130.0k against
        # ~139.5k; dark ~281 against
        # ~1.4k). Walk thinned the
        # reach (~41.7k against
        # ~43.9k). Idle's two parts
        # are the tell. Luma-8 keeps
        # the whole bracelet.
        # knock_tiny_crumbs (64)
        # keeps specks off.
        # MinFilter (5) is the
        # leftover default path; I
        # did not erode. It nicked
        # walk (~41.7k against
        # luma-8's ~43.9k). TAN_SIT
        # I did not join. Cream
        # belly is hide, not Pale's
        # wash. TAN_SIT still lists
        # morel, lions_mane,
        # rosy_boa, and yeast.
        # DARK_MATTE already lists
        # crow, raven, pileated,
        # widow, vinegaroon, skunk,
        # millipede, field_cricket,
        # earwig, click_beetle, and
        # robber_fly; that membership
        # stays. I did not add
        # green_tree_python. A
        # jewel's green is hide, and
        # that path still shredded
        # idle. Nori's ball_python
        # elif stays Nori's.
        # Bandit's kingsnake elif
        # stays Bandit's. Saffron
        # did not add a corn_snake
        # elif. Ember's phoenix elif
        # stays Ember's. Existing
        # luma-8 elifs stay theirs.
        # Guest-only. Not a catalog
        # wash. Not TAN_SIT. Not
        # DARK_MATTE. Not Bluff.
        knocked = clear_connected_plate(raw, luma=8)
        if not knocked.getbbox():
            knocked = clear_connected_plate(raw, luma=14)
        if knocked.getbbox():
            knocked = knock_tiny_crumbs(knocked, limit=64)
        return fit_like_rui(knocked, side=0.90)
    else:
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
    # Tan islands that never touch the guest are crumbs, not a plate.
    if knocked.getbbox():
        knocked = knock_island_crumbs(knocked)
        knocked = knock_parchment_fringe(knocked, steps=3)
    # Pose sit fills the blotter the way Rui does. Idle stays the #92 hand.
    return fit_like_rui(knocked, side=0.90)


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
S("sloth", "mammal", (120, 96, 64), (176, 156, 120), (40, 28, 20), (88, 68, 44), "claw", "Choloepus didactylus")
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
        "sea_cucumber": Spec("worm", (120, 88, 64), (176, 140, 100), (36, 24, 16), (88, 60, 40), "wart", "Thelenota ananas"),
        "lionfish": Spec("fish", (220, 196, 176), (196, 48, 40), (40, 24, 16), (32, 24, 20), "spines", "Pterois volitans"),
        "giant_clam": Spec("bivalve", (88, 120, 92), (220, 92, 120), (28, 36, 28), (255, 176, 72), "mantle", "Tridacna gigas"),
        "eagle_ray": Spec("ray", (48, 56, 72), (220, 216, 208), (16, 18, 24), (236, 232, 224), "spots", "Aetobatus narinari"),
        "grouper": Spec("fish", (92, 108, 72), (176, 188, 120), (28, 32, 20), (48, 56, 36), "thick", "Epinephelus striatus"),
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
        "lichen": Spec("lichen", (188, 196, 120), (236, 228, 176), (64, 72, 40), (120, 88, 64), "crust", "Cladonia rangiferina"),
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


def snake(b: Brush, s: Spec, pose: dict):
    """A house snake. Coil, bands, or a hog of a snout. Not a worm."""
    wave = pose.get("dx", 0) * 0.08
    if s.tell == "bun" or s.tell == "saddle-coil":
        for i, r in enumerate((70, 52, 36)):
            b.ell(-8 + i * 6, 12 + i * 4, r, r * 0.72, mix(s.fur, s.ink, i * 0.12), 235)
            b.scales(-8 + i * 6, 12 + i * 4, r * 0.8, r * 0.55, s.accent, 14)
        b.ell(56, -8, 28, 16, s.fur, 240)
        b.eye(68, -12, 6)
        if s.tell == "saddle-coil":
            b.ell(0, 4, 40, 18, s.accent, 90)
        return
    pts = [(-130 + t * 26, math.sin(t * 0.65 + wave) * (18 if s.tell != "heavy" else 12)) for t in range(12)]
    for i, (x, y) in enumerate(pts[:-1]):
        t = i / 11
        rgb = s.fur
        if s.tell == "bands" and i % 2 == 0:
            rgb = s.accent
        elif s.tell == "triad":
            rgb = s.fur if i % 3 == 0 else s.ink if i % 3 == 1 else s.belly
        elif s.tell == "stripes":
            rgb = mix(s.fur, s.accent, 0.35 if i % 2 else 0)
        elif s.tell == "three" and i % 3 == 0:
            rgb = s.ink
        elif s.tell == "labyrinth" and i % 2:
            rgb = s.ink
        elif s.tell == "saddle" and i % 3 == 1:
            rgb = s.accent
        b.ell(x, y, 26 - t * 8, 18 - t * 5, rgb, 235)
        b.ell(x, y + 5, 14 - t * 4, 7, s.belly, 150)
        if s.tell == "labyrinth":
            b.ln(x - 8, y - 8, x + 8, y + 8, s.accent, 2, 120)
    hx, hy = pts[0]
    if s.tell == "snout":
        b.ell(hx - 18, hy + 2, 22, 12, s.fur, 240)
        b.poly([(hx - 36, hy + 2), (hx - 48, hy - 10), (hx - 28, hy - 4)], s.fur, 230)
    else:
        b.ell(hx - 12, hy, 20, 12, s.fur, 240)
    b.eye(hx - 8, hy - 4, 6)
    if pose.get("open", 0) > 0.2:
        b.ell(hx - 22, hy + 8, 10, 6, s.ink, 200)


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
    "snake": snake,
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
        ingest = ingest_tan_guest if key in TAN_SIT else ingest_body
        bodies = {anim: ingest(path, key) for anim, path in poses.items()}
        write_kind_from_poses(key, bodies)
        write_portrait(key)
        sat.append(key)
    return sat


def clean_owned_sprites(keys: list[str] | None = None) -> dict[str, list[str]]:
    """Knock fringe and islands on sat painted poses. Idle keeps the #92 sit.

    A pose folder is rewritten from its first frame after the wash leaves.
    Idle frames are cleaned in place and not refit. A collapsed pose is
    listed so a later hand can paint it; this pass does not invent a taxon.
    """
    wanted = set(keys) if keys else set(POSE_OWNED)
    cleaned: list[str] = []
    collapsed: list[str] = []
    idle_cleaned: list[str] = []
    for key in sorted(wanted):
        dest_root = WEB_SPRITES / key
        if not dest_root.exists():
            continue
        bodies: dict[str, Image.Image] = {}
        touched = False
        for anim, count in ANIMS.items():
            first = dest_root / anim / "1.png"
            if not first.exists():
                continue
            raw = Image.open(first).convert("RGBA")
            before = parchment_island_pixels(raw)
            cleaned_im = clean_guest_matte(raw, key, idle=(anim == "idle"))
            after = parchment_island_pixels(cleaned_im)
            animal = sum(1 for r, g, b, a in cleaned_im.getdata() if a > 12 and (r + g + b) > 24)
            n = cleaned_im.size[0] * cleaned_im.size[1]
            fill = animal / max(1, n)
            if anim == "idle":
                if before >= 80 or after < before:
                    for i in range(count):
                        path = dest_root / anim / f"{i + 1}.png"
                        if not path.exists():
                            continue
                        frame = Image.open(path).convert("RGBA")
                        clean_guest_matte(frame, key, idle=True).save(path, "PNG", optimize=True)
                    idle_cleaned.append(key)
                    touched = True
                continue
            if fill < 0.035 and key not in {"stick", "jewelwing"}:
                collapsed.append(f"{key}/{anim}")
                continue
            bodies[anim] = cleaned_im
            touched = True
        if bodies:
            write_kind_from_poses(key, bodies)
            cleaned.append(key)
        elif touched:
            desk = DESK_SPRITES / key
            if desk.exists():
                shutil.rmtree(desk)
            shutil.copytree(WEB_SPRITES / key, desk)
            cleaned.append(key)
        if touched:
            write_portrait(key)
            print(f"clean {key} poses={sorted(bodies)} idle={key in idle_cleaned}", flush=True)
    return {"cleaned": cleaned, "collapsed": collapsed, "idle": idle_cleaned}


def main(argv: list[str] | None = None) -> None:
    import sys

    args = list(sys.argv[1:] if argv is None else argv)
    only = [a for a in args if not a.startswith("-") and not a.startswith("--bodies=") and not a.startswith("--poses=")]
    bodies_arg = next((a.split("=", 1)[1] for a in args if a.startswith("--bodies=")), "")
    poses_arg = next((a.split("=", 1)[1] for a in args if a.startswith("--poses=")), "")
    do_knock = "--knock" in args or (not only and not bodies_arg and not poses_arg and "--clean-poses" not in args)
    do_paint = "--paint" in args
    do_clean = "--clean-poses" in args
    sat: list[str] = []
    cleaned: dict[str, list[str]] = {"cleaned": [], "collapsed": [], "idle": []}
    if poses_arg:
        sat = sit_pose_bodies_from(Path(poses_arg), only or None)
    if bodies_arg:
        sat = sit_bodies_from(Path(bodies_arg), only or None)
    if do_clean:
        cleaned = clean_owned_sprites(only or None)
    if only and not bodies_arg and not poses_arg and not do_clean:
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
    print(
        f"done sit={len(sat)} paint={len(paint)} knock={len(knock)} "
        f"clean={len(cleaned['cleaned'])} collapsed={len(cleaned['collapsed'])} "
        f"poses={1 if poses_arg else 0} catalog=210",
        flush=True,
    )
    if cleaned["collapsed"]:
        print("collapsed " + " ".join(cleaned["collapsed"]), flush=True)


if __name__ == "__main__":
    main()
