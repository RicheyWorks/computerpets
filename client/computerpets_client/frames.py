"""Procedural living-pet frames. The repo does not ship PNG sprite packs.

Drawn with QPainter into pixmaps, then composited by the GPU-backed scene.
Not photographed assets and not a shader engine.

Snakes crawl (S-curve / coil). The tide swims; hermit and horseshoe walk
the damp floor. The garden sits and leans. The hive stays — bee, butterfly, luna, firefly
beetle, darner, stick, ant, ladybird, mantis, cicada, then bees and comb. The cellar sits —
shelf, amanita, morel, chanterelle, bracket, mane, puffball, sulfur shelf,
yeast jar, lichen shrub. The far den stays — gleam, choir, nimbus, shard,
dusk, knot, brine, beacon, hush, cyst. The pond stays — frog, toad, newt,
salamander, caecilian, crayfish, snail, mussel, leech, stickleback. The others walk, with
silhouette tells from the house catalog — rust panda, cream cat, corgi,
bun, tuxedo, bill-first, moss carpet, fern frond, fan leaf, pitcher well, sundew, and so on.
Earth guests stay honest; the far ten are coined xenobiology. Bloom stays the only axolotl.
"""

from __future__ import annotations

import math

from PyQt6.QtCore import QPointF, QRectF, Qt
from PyQt6.QtGui import QBrush, QColor, QLinearGradient, QPainter, QPainterPath, QPen, QPixmap

from .species import Species

SIZE = 176
ANIMS = {
    "idle": 4,
    "walk": 6,
    "sit": 2,
    "eat": 4,
    "sleep": 4,
}


def _color(rgb: tuple[int, int, int], a: int = 255) -> QColor:
    return QColor(rgb[0], rgb[1], rgb[2], a)


def paint_frame(species: Species, anim: str, index: int) -> QPixmap:
    n = ANIMS.get(anim, 4)
    i = index % n
    pix = QPixmap(SIZE, SIZE)
    pix.fill(Qt.GlobalColor.transparent)
    painter = QPainter(pix)
    painter.setRenderHint(QPainter.RenderHint.Antialiasing, True)
    _draw_pet(painter, species, anim, i, n)
    painter.end()
    return pix


def frames_for(species: Species) -> dict[str, list[QPixmap]]:
    return {
        anim: [paint_frame(species, anim, i) for i in range(count)]
        for anim, count in ANIMS.items()
    }


def paint_treat(shape: str) -> QPixmap:
    pix = QPixmap(36, 28)
    pix.fill(Qt.GlobalColor.transparent)
    p = QPainter(pix)
    p.setRenderHint(QPainter.RenderHint.Antialiasing, True)
    if shape == "bamboo":
        p.setBrush(QBrush(QColor(168, 196, 92)))
        p.setPen(QPen(QColor(88, 120, 48), 1.4))
        p.drawRoundedRect(QRectF(6, 8, 24, 10), 4, 4)
        p.setPen(QPen(QColor(88, 120, 48), 1.2))
        p.drawLine(14, 8, 14, 18)
        p.drawLine(22, 8, 22, 18)
    elif shape == "seed":
        p.setBrush(QBrush(QColor(196, 148, 64)))
        p.setPen(QPen(QColor(120, 80, 32), 1.1))
        p.drawEllipse(QRectF(8, 10, 8, 8))
        p.drawEllipse(QRectF(16, 8, 7, 9))
        p.drawEllipse(QRectF(22, 11, 6, 7))
    elif shape == "leaf":
        p.setBrush(QBrush(QColor(88, 156, 72)))
        p.setPen(QPen(QColor(40, 88, 40), 1.2))
        path = QPainterPath()
        path.moveTo(8, 16)
        path.quadTo(18, 2, 30, 12)
        path.quadTo(20, 24, 8, 16)
        p.drawPath(path)
        p.setPen(QPen(QColor(40, 88, 40), 1))
        p.drawLine(10, 16, 26, 12)
    elif shape == "flake":
        p.setBrush(QBrush(QColor(232, 148, 64)))
        p.setPen(QPen(QColor(160, 80, 28), 1.1))
        p.drawPolygon(
            [QPointF(18, 6), QPointF(26, 12), QPointF(22, 22), QPointF(12, 20), QPointF(10, 10)]
        )
    elif shape == "pebble":
        p.setBrush(QBrush(QColor(148, 152, 160)))
        p.setPen(QPen(QColor(88, 92, 100), 1.2))
        p.drawEllipse(QRectF(10, 8, 16, 12))
    elif shape == "ember":
        p.setBrush(QBrush(QColor(232, 120, 48)))
        p.setPen(QPen(QColor(160, 48, 20), 1.1))
        p.drawEllipse(QRectF(10, 8, 16, 12))
        p.setBrush(QBrush(QColor(255, 208, 96, 180)))
        p.setPen(Qt.PenStyle.NoPen)
        p.drawEllipse(QRectF(14, 10, 8, 6))
    elif shape == "egg":
        p.setBrush(QBrush(QColor(244, 236, 216)))
        p.setPen(QPen(QColor(176, 160, 128), 1.2))
        p.drawEllipse(QRectF(12, 6, 12, 16))
    else:
        p.setBrush(QBrush(QColor(196, 148, 88)))
        p.setPen(QPen(QColor(120, 80, 40), 1.2))
        p.drawEllipse(QRectF(10, 8, 16, 12))
    p.end()
    return pix


def _pose(anim: str, i: int) -> tuple[float, float, float, float, float, float]:
    bob = lean = sit = eat = sleep = stride = 0.0
    if anim == "idle":
        bob = (-1, 0, 1, 0)[i] * 2.2
    elif anim == "walk":
        bob = (0, -3, 0, -3, 0, -2)[i]
        lean = (1, 0, -1, 0, 1, 0)[i] * 3
        stride = (1, 0, -1, 0, 1, 0)[i]
    elif anim == "sit":
        sit = 14 + i * 2
        bob = i
    elif anim == "eat":
        sit = 8
        eat = (0, 6, 2, 7)[i]
        bob = 1
    elif anim == "sleep":
        sit = 18
        sleep = 1
        bob = (0, 1, 0, 1)[i]
    return bob, lean, sit, eat, sleep, stride


def _draw_pet(p: QPainter, species: Species, anim: str, i: int, n: int) -> None:
    bob, lean, sit, eat, sleep, stride = _pose(anim, i)
    if species.aquatic and anim in ("idle", "walk"):
        bob += math.sin((i / max(1, n)) * math.pi * 2) * 3
    cx, cy = 88.0, 118.0 + bob + sit * 0.15
    p.translate(cx + lean, cy)
    if sleep and species.gait != "crawl":
        p.rotate(-18)

    p.setPen(Qt.PenStyle.NoPen)
    p.setBrush(QBrush(QColor(20, 14, 10, 50)))
    p.drawEllipse(QRectF(-38, 38 - sit * 0.2, 76, 14))

    if species.gait == "crawl" or species.silhouette == "snake":
        _draw_snake(p, species, anim, i, sit, eat, sleep, stride)
        return
    if species.silhouette in (
        "fish",
        "axolotl",
        "octopus",
        "cuttle",
        "nautilus",
        "jelly",
        "star",
        "seahorse",
        "manta",
        "moray",
    ):
        _draw_aquatic(p, species, anim, i, eat, sleep)
        return
    if species.silhouette in ("hermit", "horseshoe"):
        _draw_tide_walker(p, species, anim, i, sit, eat, sleep, stride)
        return
    if species.silhouette in (
        "moss",
        "fern",
        "fan",
        "seedling",
        "pad",
        "trap",
        "orchid",
        "cactus",
        "pitcher",
        "sundew",
    ):
        _draw_plant(p, species, anim, i, sit, eat, sleep)
        return
    if species.silhouette in (
        "bee",
        "butterfly",
        "luna",
        "firefly",
        "darner",
        "stick",
        "ant",
        "ladybird",
        "mantis",
        "cicada",
        "bumble",
        "carpenter",
        "mason",
        "leafcutter",
        "stingless",
        "sweat",
        "mining",
        "drone",
        "queen",
        "comb",
    ):
        _draw_insect(p, species, anim, i, sit, eat, sleep, stride)
        return
    if species.silhouette in (
        "shelf",
        "amanita",
        "morel",
        "chanterelle",
        "bracket",
        "mane",
        "puffball",
        "sulfur",
        "yeast",
        "lichen",
    ):
        _draw_fungus(p, species, anim, i, sit, eat, sleep)
        return
    if species.silhouette in (
        "gleam",
        "choir",
        "nimbus",
        "shard",
        "dusk",
        "knot",
        "brine",
        "beacon",
        "hush",
        "cyst",
    ):
        _draw_far(p, species, anim, i, sit, eat, sleep)
        return
    if species.silhouette in (
        "frog",
        "toad",
        "newt",
        "salamander",
        "caecilian",
        "crayfish",
        "snail",
        "mussel",
        "leech",
        "stickleback",
    ):
        _draw_pond(p, species, anim, i, sit, eat, sleep)
        return
    if species.silhouette in ("bird", "parrot", "toucan", "phoenix", "penguin"):
        _draw_bird(p, species, anim, i, sit, eat, sleep, stride)
        return
    _draw_quad(p, species, anim, i, sit, eat, sleep, stride)


def _draw_quad(
    p: QPainter,
    species: Species,
    anim: str,
    i: int,
    sit: float,
    eat: float,
    sleep: float,
    stride: float,
) -> None:
    pal = species.palette
    body = _color(pal.body)
    belly = _color(pal.belly)
    ear = _color(pal.ear)
    ear_inner = _color(pal.ear_inner)
    nose = _color(pal.nose)
    ring = _color(pal.ring)
    accent = _color(pal.accent)
    sil = species.silhouette

    long_body = sil in ("ferret", "dragon", "iguana")
    small = sil in ("hamster", "guinea", "hedgehog", "chinchilla", "rabbit")
    bw = 86 if long_body else 64 if small else 72
    bh = 40 if long_body else 46 if small else 52
    ox = -bw / 2

    tail = QPainterPath()
    if sil == "cat":
        tail.moveTo(40, 8)
        tail.cubicTo(62, -18 - stride * 6, 48, -40, 28, -36)
    elif sil in ("dog", "fox"):
        tail.moveTo(38, 10)
        tail.cubicTo(56, 4, 58, -8 - stride * 4, 50, -16)
    elif sil == "rabbit":
        tail.moveTo(28, 12)
        tail.cubicTo(40, 8, 42, 16, 34, 20)
    elif sil in ("hamster", "guinea"):
        tail.moveTo(24, 10)
        tail.cubicTo(30, 8, 32, 12, 28, 14)
    elif sil == "ferret":
        tail.moveTo(48, 6)
        tail.cubicTo(68, 0, 74, 10, 62, 16)
    elif sil == "dragon":
        tail.moveTo(44, 8)
        tail.cubicTo(72, 0, 80, 22, 58, 18)
    elif sil == "iguana":
        tail.moveTo(40, 8)
        tail.cubicTo(70, 4, 78, 16, 64, 14)
    elif sil == "turtle":
        tail.moveTo(28, 10)
        tail.cubicTo(36, 12, 38, 16, 32, 16)
    else:
        tail.moveTo(36, 10)
        tail.cubicTo(70, 8, 78, 36, 58, 44)
    p.setBrush(QBrush(body))
    p.setPen(QPen(accent, 1.2))
    p.drawPath(tail)
    if sil == "panda":
        p.setBrush(QBrush(ring))
        p.setPen(Qt.PenStyle.NoPen)
        p.drawEllipse(QRectF(48, 18, 10, 8))
        p.drawEllipse(QRectF(60, 28, 9, 7))
    if sil == "fox":
        p.setBrush(QBrush(ring))
        p.setPen(Qt.PenStyle.NoPen)
        p.drawEllipse(QRectF(46, -18, 10, 8))
    if sil == "rabbit":
        p.setBrush(QBrush(ring))
        p.setPen(Qt.PenStyle.NoPen)
        p.drawEllipse(QRectF(28, 12, 12, 10))

    if sil == "dragon":
        p.setBrush(QBrush(accent))
        p.setPen(QPen(accent, 1))
        wing = QPainterPath()
        wing.moveTo(4, -8)
        wing.cubicTo(28, -36 - stride * 4, 48, -18, 18, 4)
        p.drawPath(wing)

    p.setBrush(QBrush(ear if sil not in ("dog", "fox") else accent))
    p.setPen(Qt.PenStyle.NoPen)
    if sil != "turtle":
        hind = 6 * stride
        fore = -6 * stride
        lift = 0 if anim != "walk" else abs(hind)
        p.drawRoundedRect(QRectF(ox + 8, 22, 11, 18 + lift), 4, 4)
        p.drawRoundedRect(QRectF(ox + bw - 28, 22, 11, 18 + (0 if anim != "walk" else abs(fore))), 4, 4)
        p.drawRoundedRect(QRectF(ox + 22, 24, 10, 15), 4, 4)
        p.drawRoundedRect(QRectF(ox + bw - 16, 24, 10, 15), 4, 4)
    else:
        p.setBrush(QBrush(accent))
        p.drawEllipse(QRectF(-22, 20, 14, 10))
        p.drawEllipse(QRectF(8, 20, 14, 10))

    if sil == "turtle":
        p.setBrush(QBrush(accent))
        p.setPen(QPen(accent, 1.1))
        p.drawEllipse(QRectF(-34, -16, 68, 46 - sit * 0.2))
        p.setBrush(QBrush(body))
        p.drawEllipse(QRectF(-26, -10, 52, 34 - sit * 0.15))
        p.setPen(Qt.PenStyle.NoPen)
        p.setBrush(QBrush(ring))
        p.drawEllipse(QRectF(-8, -2, 16, 12))
    else:
        p.setBrush(QBrush(body))
        p.setPen(QPen(accent, 1.1))
        p.drawRoundedRect(QRectF(ox, -18, bw, bh - sit * 0.35), 28, 24)
        p.setPen(Qt.PenStyle.NoPen)
        p.setBrush(QBrush(belly))
        p.drawEllipse(QRectF(-18, -4, 36, 28 - sit * 0.2))
        if sil == "hedgehog" and sit < 16:
            p.setBrush(QBrush(ring))
            for dx in range(-22, 24, 7):
                p.drawEllipse(QRectF(dx, -22, 8, 10))
        if sil == "iguana":
            p.setBrush(QBrush(accent))
            for dx in range(-16, 22, 6):
                p.drawPolygon([QPointF(dx, -20), QPointF(dx + 3, -30), QPointF(dx + 6, -20)])

    hx, hy = (-8.0 if long_body else -2.0), -36.0 + eat * 0.4
    if sil == "turtle":
        hx, hy = -28.0, -6.0 + eat * 0.3
    if sil == "cat":
        p.setBrush(QBrush(ear))
        p.drawPolygon([QPointF(hx - 22, hy - 2), QPointF(hx - 8, hy - 28), QPointF(hx + 2, hy - 6)])
        p.drawPolygon([QPointF(hx + 22, hy - 2), QPointF(hx + 8, hy - 28), QPointF(hx - 2, hy - 6)])
        p.setBrush(QBrush(ear_inner))
        p.drawPolygon([QPointF(hx - 16, hy - 4), QPointF(hx - 8, hy - 20), QPointF(hx - 4, hy - 6)])
        p.drawPolygon([QPointF(hx + 16, hy - 4), QPointF(hx + 8, hy - 20), QPointF(hx + 4, hy - 6)])
    elif sil in ("dog",):
        p.setBrush(QBrush(ear))
        p.drawRoundedRect(QRectF(hx - 30, hy - 6, 16, 28), 7, 7)
        p.drawRoundedRect(QRectF(hx + 14, hy - 6, 16, 28), 7, 7)
    elif sil in ("fox", "rabbit"):
        p.setBrush(QBrush(ear))
        p.drawPolygon([QPointF(hx - 18, hy), QPointF(hx - 10, hy - (34 if sil == "rabbit" else 26)), QPointF(hx - 2, hy - 4)])
        p.drawPolygon([QPointF(hx + 18, hy), QPointF(hx + 10, hy - (34 if sil == "rabbit" else 26)), QPointF(hx + 2, hy - 4)])
        p.setBrush(QBrush(ear_inner))
        p.drawPolygon([QPointF(hx - 14, hy - 2), QPointF(hx - 10, hy - (24 if sil == "rabbit" else 16)), QPointF(hx - 6, hy - 4)])
        p.drawPolygon([QPointF(hx + 14, hy - 2), QPointF(hx + 10, hy - (24 if sil == "rabbit" else 16)), QPointF(hx + 6, hy - 4)])
    elif sil == "chinchilla":
        p.setBrush(QBrush(ear))
        p.drawEllipse(QRectF(hx - 32, hy - 18, 20, 26))
        p.drawEllipse(QRectF(hx + 12, hy - 18, 20, 26))
        p.setBrush(QBrush(ear_inner))
        p.drawEllipse(QRectF(hx - 26, hy - 10, 10, 14))
        p.drawEllipse(QRectF(hx + 16, hy - 10, 10, 14))
    elif sil != "turtle":
        p.setBrush(QBrush(ear))
        p.drawEllipse(QRectF(hx - 30, hy - 22, 22, 22))
        p.drawEllipse(QRectF(hx + 8, hy - 22, 22, 22))
        p.setBrush(QBrush(ear_inner))
        p.drawEllipse(QRectF(hx - 24, hy - 16, 12, 12))
        p.drawEllipse(QRectF(hx + 12, hy - 16, 12, 12))

    head_fill = belly if sil == "panda" else body
    p.setBrush(QBrush(head_fill))
    p.setPen(QPen(accent, 1.1))
    hw = 48 if sil == "turtle" else 56
    p.drawEllipse(QRectF(hx - hw / 2, hy - 16, hw, 44 if sil != "turtle" else 32))
    if sil == "panda":
        p.setPen(Qt.PenStyle.NoPen)
        p.setBrush(QBrush(body))
        p.drawEllipse(QRectF(hx - 26, hy + 2, 18, 16))
        p.drawEllipse(QRectF(hx + 8, hy + 2, 18, 16))
    if sil == "hamster":
        p.setPen(Qt.PenStyle.NoPen)
        p.setBrush(QBrush(belly))
        p.drawEllipse(QRectF(hx - 26, hy + 10, 16, 14))
        p.drawEllipse(QRectF(hx + 10, hy + 10, 16, 14))
    if sil == "dragon":
        p.setBrush(QBrush(accent))
        p.drawPolygon([QPointF(hx - 10, hy - 14), QPointF(hx - 4, hy - 28), QPointF(hx + 2, hy - 12)])
        p.drawPolygon([QPointF(hx + 6, hy - 12), QPointF(hx + 12, hy - 26), QPointF(hx + 16, hy - 10)])

    _draw_face(p, hx, hy, nose, sleep, anim, i, sil == "dog")
    if eat:
        p.setBrush(QBrush(QColor(40, 24, 20)))
        p.drawEllipse(QRectF(hx - 6, hy + 20, 12, 5 + eat * 0.15))
    _top_light(p, hx, hy)


def _draw_bird(
    p: QPainter,
    species: Species,
    anim: str,
    i: int,
    sit: float,
    eat: float,
    sleep: float,
    stride: float,
) -> None:
    pal = species.palette
    body = _color(pal.body)
    belly = _color(pal.belly)
    accent = _color(pal.accent)
    nose = _color(pal.nose)
    ring = _color(pal.ring)
    sil = species.silhouette
    upright = sil == "penguin"

    p.setBrush(QBrush(body))
    p.setPen(QPen(accent, 1.1))
    if upright:
        p.drawRoundedRect(QRectF(-22, -28, 44, 62 - sit * 0.2), 20, 18)
        p.setPen(Qt.PenStyle.NoPen)
        p.setBrush(QBrush(belly))
        p.drawEllipse(QRectF(-14, -10, 28, 36))
        p.setBrush(QBrush(accent))
        p.drawEllipse(QRectF(-28, 4, 16, 10))
        p.drawEllipse(QRectF(12, 4, 16, 10))
        p.setBrush(QBrush(QColor(232, 156, 64)))
        p.drawEllipse(QRectF(-12, 30, 10, 6))
        p.drawEllipse(QRectF(2, 30, 10, 6))
    else:
        p.drawEllipse(QRectF(-28, -16, 56, 42 - sit * 0.2))
        p.setPen(Qt.PenStyle.NoPen)
        p.setBrush(QBrush(belly))
        p.drawEllipse(QRectF(-14, -4, 28, 24))
        wing = QPainterPath()
        wing.moveTo(-4, 0)
        wing.cubicTo(18, -8 - stride * 5, 36, 8, 10, 16)
        p.setBrush(QBrush(ring if sil == "parrot" else accent))
        p.drawPath(wing)
        if sil == "phoenix":
            flame = QPainterPath()
            flame.moveTo(24, 4)
            flame.cubicTo(48, -10, 56, 20, 30, 18)
            p.setBrush(QBrush(_color(pal.ring)))
            p.drawPath(flame)

    hx, hy = (-2.0, -38.0 + eat * 0.3) if not upright else (0.0, -40.0 + eat * 0.2)
    p.setBrush(QBrush(body if sil != "toucan" else _color(pal.body)))
    p.setPen(QPen(accent, 1.1))
    p.drawEllipse(QRectF(hx - 18, hy - 10, 36, 32))

    p.setPen(Qt.PenStyle.NoPen)
    if sil == "toucan":
        p.setBrush(QBrush(_color(pal.nose)))
        bill = QPainterPath()
        bill.moveTo(hx + 10, hy + 6)
        bill.quadTo(hx + 48, hy - 8, hx + 52, hy + 10)
        bill.quadTo(hx + 40, hy + 22, hx + 8, hy + 14)
        p.drawPath(bill)
        p.setBrush(QBrush(ring))
        p.drawEllipse(QRectF(hx + 16, hy + 2, 14, 8))
    elif sil == "parrot":
        p.setBrush(QBrush(QColor(48, 36, 28)))
        p.drawEllipse(QRectF(hx + 8, hy + 6, 18, 12))
        p.setBrush(QBrush(QColor(32, 24, 20)))
        p.drawEllipse(QRectF(hx + 18, hy + 10, 10, 6))
    elif sil == "penguin":
        p.setBrush(QBrush(QColor(40, 36, 32)))
        p.drawEllipse(QRectF(hx - 4, hy + 10, 8, 6))
    else:
        p.setBrush(QBrush(QColor(48, 40, 32)))
        p.drawEllipse(QRectF(hx + 6, hy + 8, 14, 8))

    _draw_face(p, hx, hy, nose, sleep, anim, i, False)
    if eat:
        p.setBrush(QBrush(QColor(40, 24, 20)))
        p.drawEllipse(QRectF(hx - 4, hy + 16, 10, 4))
    _top_light(p, hx, hy)


def _draw_aquatic(p: QPainter, species: Species, anim: str, i: int, eat: float, sleep: float) -> None:
    pal = species.palette
    body = _color(pal.body)
    belly = _color(pal.belly)
    accent = _color(pal.accent)
    nose = _color(pal.nose)
    wave = math.sin(i * 0.9) * 6

    if species.silhouette == "fish":
        tail = QPainterPath()
        tail.moveTo(28, 0)
        tail.lineTo(52, -16 + wave)
        tail.lineTo(48, 16 - wave)
        tail.closeSubpath()
        p.setBrush(QBrush(_color(pal.ring)))
        p.setPen(QPen(accent, 1.1))
        p.drawPath(tail)
        p.setBrush(QBrush(body))
        p.drawEllipse(QRectF(-32, -18, 64, 36))
        p.setPen(Qt.PenStyle.NoPen)
        p.setBrush(QBrush(belly))
        p.drawEllipse(QRectF(-16, -4, 28, 16))
        hx, hy = -18.0, -4.0 + eat * 0.2
        _draw_face(p, hx, hy, nose, sleep, anim, i, False)
        return

    sil = species.silhouette
    if sil == "octopus":
        p.setPen(QPen(accent, 1.1))
        p.setBrush(QBrush(body))
        for k, ang in enumerate((-70, -40, -10, 20, 50, 80, 110, 140)):
            p.save()
            p.rotate(ang + wave * 0.4)
            p.drawEllipse(QRectF(8, -5, 28 + (k % 3), 8))
            p.restore()
        p.drawEllipse(QRectF(-22, -18, 40, 32))
        p.setPen(Qt.PenStyle.NoPen)
        p.setBrush(QBrush(belly))
        p.drawEllipse(QRectF(-10, -6, 20, 14))
        _draw_face(p, -8, -10, nose, sleep, anim, i, False)
        return
    if sil == "cuttle":
        fin = QPainterPath()
        fin.addEllipse(QRectF(-36, -22 + wave * 0.2, 72, 44))
        p.setBrush(QBrush(_color(pal.ring)))
        p.setPen(QPen(accent, 1.0))
        p.drawPath(fin)
        p.setBrush(QBrush(body))
        p.drawEllipse(QRectF(-28, -14, 56, 28))
        p.setPen(Qt.PenStyle.NoPen)
        p.setBrush(QBrush(belly))
        p.drawEllipse(QRectF(-8, -2, 24, 12))
        _draw_face(p, -16, -6, nose, sleep, anim, i, False)
        return
    if sil == "nautilus":
        p.setBrush(QBrush(body))
        p.setPen(QPen(accent, 1.2))
        p.drawEllipse(QRectF(-8, -28, 48, 48))
        p.setPen(QPen(_color(pal.ring), 1.4))
        p.setBrush(Qt.BrushStyle.NoBrush)
        p.drawEllipse(QRectF(4, -16, 22, 22))
        p.setBrush(QBrush(belly))
        p.setPen(QPen(accent, 1.0))
        p.drawEllipse(QRectF(-28, -10, 28, 20))
        _draw_face(p, -20, -6, nose, sleep, anim, i, False)
        return
    if sil == "jelly":
        p.setBrush(QBrush(body))
        p.setPen(QPen(accent, 1.0))
        p.drawEllipse(QRectF(-28, -24 + wave * 0.3, 56, 36))
        p.setPen(Qt.PenStyle.NoPen)
        p.setBrush(QBrush(_color(pal.ring)))
        p.drawEllipse(QRectF(-10, -10, 8, 8))
        p.drawEllipse(QRectF(2, -10, 8, 8))
        p.drawEllipse(QRectF(-10, 0, 8, 8))
        p.drawEllipse(QRectF(2, 0, 8, 8))
        p.setPen(QPen(accent, 1.0))
        for k in range(-3, 4):
            p.drawLine(k * 6, 10, k * 6, 22 + abs(k))
        return
    if sil == "star":
        p.setBrush(QBrush(body))
        p.setPen(QPen(accent, 1.1))
        for ang in range(0, 360, 72):
            p.save()
            p.rotate(ang)
            p.drawEllipse(QRectF(-8, -28, 16, 32))
            p.restore()
        p.drawEllipse(QRectF(-12, -12, 24, 24))
        p.setPen(Qt.PenStyle.NoPen)
        p.setBrush(QBrush(belly))
        p.drawEllipse(QRectF(-6, -6, 12, 12))
        return
    if sil == "seahorse":
        p.setBrush(QBrush(body))
        p.setPen(QPen(accent, 1.1))
        p.drawEllipse(QRectF(-8, -28, 20, 18))
        p.drawRoundedRect(QRectF(-4, -14, 14, 28), 6, 6)
        tail = QPainterPath()
        tail.moveTo(4, 12)
        tail.cubicTo(18, 16, 16, 28 + wave * 0.3, 2, 26)
        p.drawPath(tail)
        _draw_face(p, -2, -24, nose, sleep, anim, i, False)
        return
    if sil == "manta":
        wing = QPainterPath()
        wing.moveTo(-8, 0)
        wing.quadTo(-56, -8 + wave, -8, 10)
        wing.quadTo(56, -8 - wave, 8, 10)
        wing.closeSubpath()
        p.setBrush(QBrush(body))
        p.setPen(QPen(accent, 1.1))
        p.drawPath(wing)
        p.setPen(Qt.PenStyle.NoPen)
        p.setBrush(QBrush(belly))
        p.drawEllipse(QRectF(-16, -4, 32, 12))
        _draw_face(p, -6, -6, nose, sleep, anim, i, False)
        return
    if sil == "moray":
        phase = i * 0.5
        pts = [(-40 + t * 80, math.sin(t * 3 + phase) * 6) for t in (n / 7 for n in range(8))]
        for k, (x, y) in enumerate(pts):
            t = k / 7
            p.setBrush(QBrush(body if k % 2 == 0 else belly))
            p.setPen(QPen(accent, 0.8))
            p.drawEllipse(QRectF(x - 10, y - 7, 18 - t * 4, 14 - t * 2))
        hx, hy = pts[0]
        p.setBrush(QBrush(body))
        p.drawEllipse(QRectF(hx - 12, hy - 10, 24, 18))
        if anim == "talk" or eat:
            p.setBrush(QBrush(QColor(40, 24, 20)))
            p.drawEllipse(QRectF(hx - 8, hy + 2, 12, 5))
        _draw_face(p, hx - 2, hy - 6, nose, sleep, anim, i, False)
        return

    # Axolotl — salamander who kept the gills.
    p.setBrush(QBrush(_color(pal.ear)))
    p.setPen(Qt.PenStyle.NoPen)
    for k, ang in enumerate((-50, -20, 15)):
        p.save()
        p.translate(-22, -10)
        p.rotate(ang + wave * 0.3)
        p.drawEllipse(QRectF(-4, -18 - k, 10, 22))
        p.restore()
    p.setBrush(QBrush(body))
    p.setPen(QPen(accent, 1.1))
    p.drawRoundedRect(QRectF(-28, -10, 64, 24), 12, 10)
    p.setPen(Qt.PenStyle.NoPen)
    p.setBrush(QBrush(belly))
    p.drawEllipse(QRectF(-10, -2, 28, 14))
    p.setBrush(QBrush(body))
    p.drawEllipse(QRectF(-36, -16, 28, 24))
    _draw_face(p, -24, -10, nose, sleep, anim, i, False)
    p.setBrush(QBrush(accent))
    p.drawEllipse(QRectF(28, -2, 16, 8))


def _draw_tide_walker(
    p: QPainter,
    species: Species,
    anim: str,
    i: int,
    sit: float,
    eat: float,
    sleep: float,
    stride: float,
) -> None:
    pal = species.palette
    body = _color(pal.body)
    belly = _color(pal.belly)
    accent = _color(pal.accent)
    nose = _color(pal.nose)
    lift = 2 + stride * 3 - sit * 4
    if species.silhouette == "hermit":
        p.setBrush(QBrush(_color(pal.ring)))
        p.setPen(QPen(accent, 1.2))
        p.drawEllipse(QRectF(-6, -22 + sit, 36, 32))
        p.setBrush(QBrush(body))
        p.drawEllipse(QRectF(-28, -8 + sit, 28, 18))
        p.setPen(Qt.PenStyle.NoPen)
        p.setBrush(QBrush(belly))
        p.drawEllipse(QRectF(-22, -2 + sit, 14, 8))
        p.setBrush(QBrush(body))
        p.drawEllipse(QRectF(-18, 8 + sit - lift, 8, 6))
        p.drawEllipse(QRectF(-8, 10 + sit + lift * 0.4, 8, 6))
        _draw_face(p, -20, -6 + sit, nose, sleep, anim, i, False)
        return
    # Horseshoe — helmet, book-gills, telson. Not a crab.
    p.setBrush(QBrush(body))
    p.setPen(QPen(accent, 1.2))
    p.drawEllipse(QRectF(-28, -18 + sit, 52, 36))
    p.setPen(Qt.PenStyle.NoPen)
    p.setBrush(QBrush(belly))
    p.drawEllipse(QRectF(-14, -4 + sit, 24, 14))
    p.setBrush(QBrush(accent))
    p.drawPolygon(
        [QPointF(20, 4 + sit), QPointF(46, 8 + sit), QPointF(20, 12 + sit)]
    )
    _draw_face(p, -10, -8 + sit, nose, sleep, anim, i, False)
    if eat:
        p.setBrush(QBrush(QColor(40, 24, 20)))
        p.drawEllipse(QRectF(-8, 4 + sit, 8, 4))


def _draw_plant(
    p: QPainter,
    species: Species,
    anim: str,
    i: int,
    sit: float,
    eat: float,
    sleep: float,
) -> None:
    pal = species.palette
    body = _color(pal.body)
    belly = _color(pal.belly)
    accent = _color(pal.accent)
    ring = _color(pal.ring)
    ear = _color(pal.ear)
    lean = math.sin(i * 0.7) * (4 if anim in ("idle", "walk") else 1)
    p.rotate(lean)
    sil = species.silhouette

    if sil == "moss":
        p.setBrush(QBrush(body))
        p.setPen(QPen(accent, 1.0))
        p.drawEllipse(QRectF(-40, 8, 80, 22))
        p.setBrush(QBrush(belly))
        p.setPen(Qt.PenStyle.NoPen)
        for k, (x, y, w) in enumerate(((-28, 4, 22), (-8, 0, 26), (12, 6, 20), (-16, 12, 18))):
            p.drawEllipse(QRectF(x, y, w, 12 + k % 3))
        return
    if sil == "fern":
        p.setPen(QPen(ear, 2.2))
        p.setBrush(Qt.BrushStyle.NoBrush)
        p.drawLine(0, 28, 0, -8)
        p.setBrush(QBrush(body))
        p.setPen(QPen(accent, 0.8))
        for k in range(-4, 5):
            p.save()
            p.translate(0, 18 - abs(k) * 5)
            p.rotate(k * 18 + lean * 0.4)
            p.drawEllipse(QRectF(2, -5, 22, 9))
            p.restore()
        return
    if sil == "fan":
        p.setBrush(QBrush(body))
        p.setPen(QPen(accent, 1.1))
        for ang in (-40, -12, 16, 44):
            p.save()
            p.rotate(ang + lean * 0.3)
            fan = QPainterPath()
            fan.moveTo(0, 18)
            fan.quadTo(-18, -8, 0, -22)
            fan.quadTo(18, -8, 0, 18)
            p.drawPath(fan)
            p.restore()
        p.setBrush(QBrush(ring))
        p.drawEllipse(QRectF(-6, 14, 12, 10))
        return
    if sil == "seedling":
        p.setBrush(QBrush(ear))
        p.setPen(QPen(accent, 1.1))
        p.drawRoundedRect(QRectF(-5, 4, 10, 28), 4, 4)
        p.setBrush(QBrush(body))
        lobe = QPainterPath()
        lobe.moveTo(0, 8)
        lobe.quadTo(-28, -6, -8, -22)
        lobe.quadTo(4, -8, 0, 8)
        p.drawPath(lobe)
        lobe2 = QPainterPath()
        lobe2.moveTo(0, 8)
        lobe2.quadTo(28, -4, 10, -20)
        lobe2.quadTo(-2, -6, 0, 8)
        p.drawPath(lobe2)
        if anim == "play" or eat:
            p.setBrush(QBrush(ring))
            p.drawEllipse(QRectF(16, 18, 10, 8))
        return
    if sil == "pad":
        p.setBrush(QBrush(body))
        p.setPen(QPen(accent, 1.1))
        p.drawEllipse(QRectF(-34, -6, 68, 28))
        p.setPen(QPen(accent, 1.0))
        p.drawLine(-2, 8, 28, 4)
        open_bloom = anim in ("idle", "play", "talk") or eat
        if open_bloom:
            p.setBrush(QBrush(belly))
            p.setPen(QPen(ring, 1.0))
            for ang in range(0, 360, 45):
                p.save()
                p.translate(0, -6)
                p.rotate(ang)
                p.drawEllipse(QRectF(-5, -22, 10, 20))
                p.restore()
            p.setBrush(QBrush(ear))
            p.drawEllipse(QRectF(-6, -12, 12, 12))
        return
    if sil == "trap":
        p.setBrush(QBrush(body))
        p.setPen(QPen(accent, 1.1))
        p.drawEllipse(QRectF(-10, 10, 20, 16))
        snap = anim == "play" or eat
        gap = 4 if snap else 14
        p.setBrush(QBrush(belly))
        p.drawEllipse(QRectF(-22, -gap - 6, 20, 18))
        p.drawEllipse(QRectF(2, -gap - 6, 20, 18))
        p.setBrush(QBrush(body))
        p.drawEllipse(QRectF(-20, -gap, 16, 12))
        p.drawEllipse(QRectF(4, -gap, 16, 12))
        p.setPen(QPen(accent, 1.2))
        for t in range(-3, 4):
            p.drawLine(-12 + t * 3, -gap - 8, -12 + t * 3, -gap - 14)
            p.drawLine(12 + t * 3, -gap - 8, 12 + t * 3, -gap - 14)
        return
    if sil == "orchid":
        p.setBrush(QBrush(ear))
        p.setPen(QPen(accent, 1.0))
        root = QPainterPath()
        root.moveTo(-8, 20)
        root.cubicTo(-28, 8, -24, -8, -10, -4)
        p.drawPath(root)
        root2 = QPainterPath()
        root2.moveTo(6, 22)
        root2.cubicTo(24, 10, 20, -6, 8, 0)
        p.drawPath(root2)
        p.setBrush(QBrush(body))
        p.drawRoundedRect(QRectF(-6, -4, 12, 32), 5, 5)
        p.setBrush(QBrush(belly))
        p.setPen(QPen(ring, 1.0))
        p.drawEllipse(QRectF(-16, -28, 32, 22))
        p.drawEllipse(QRectF(-10, -36, 20, 16))
        p.setBrush(QBrush(body))
        p.drawEllipse(QRectF(-5, -22, 10, 8))
        return
    if sil == "pitcher":
        # Sarracenia purpurea — squat veined wells, not a flytrap cup.
        p.setBrush(QBrush(ear))
        p.setPen(QPen(accent, 1.0))
        p.drawEllipse(QRectF(-16, 16, 32, 12))
        for ang, dx, dy in ((-28, -18, 2), (0, 0, -4), (26, 16, 4)):
            p.save()
            p.translate(dx, dy)
            p.rotate(ang + lean * 0.2)
            well = QPainterPath()
            well.moveTo(-8, 18)
            well.quadTo(-14, 0, -6, -16)
            well.quadTo(0, -22, 8, -14)
            well.quadTo(12, 2, 8, 18)
            well.closeSubpath()
            p.setBrush(QBrush(body))
            p.setPen(QPen(accent, 1.1))
            p.drawPath(well)
            p.setPen(QPen(ring, 1.0))
            p.drawLine(-4, 8, -2, -8)
            p.drawLine(2, 8, 4, -6)
            p.setBrush(QBrush(belly))
            p.setPen(Qt.PenStyle.NoPen)
            p.drawEllipse(QRectF(-5, -12, 10, 6))
            p.restore()
        return
    if sil == "sundew":
        # Drosera rotundifolia — round pads, tentacles, dew. Not a flytrap.
        p.setBrush(QBrush(ear))
        p.setPen(QPen(accent, 1.0))
        p.drawEllipse(QRectF(-10, 16, 20, 10))
        curl = 0.55 if anim in ("play", "eat") else 1.0
        for ang, length in ((-50, 26), (-18, 30), (16, 28), (48, 24)):
            p.save()
            p.rotate(ang + lean * 0.25)
            p.setPen(QPen(body, 1.6))
            p.drawLine(0, 16, 0, 16 - length)
            p.setBrush(QBrush(belly))
            p.setPen(QPen(accent, 0.8))
            pad_w = 14 * curl
            p.drawEllipse(QRectF(-pad_w / 2, 16 - length - 8, pad_w, 12 * curl))
            p.setBrush(QBrush(ring))
            p.setPen(Qt.PenStyle.NoPen)
            for t in range(6):
                a = t * (math.pi * 2 / 6)
                r = 7 * curl
                p.drawEllipse(QRectF(math.cos(a) * r - 1.6, 16 - length - 2 + math.sin(a) * r * 0.6, 3.2, 3.2))
            p.restore()
        return
    # Cactus — ribs, spines, a young column. Not a tree.
    p.setBrush(QBrush(body))
    p.setPen(QPen(accent, 1.2))
    p.drawRoundedRect(QRectF(-14, -28, 28, 60), 12, 12)
    p.setPen(QPen(ring, 1.0))
    p.drawLine(-4, -20, -4, 24)
    p.drawLine(4, -20, 4, 24)
    p.setPen(QPen(accent, 1.1))
    for y in range(-18, 26, 8):
        p.drawLine(-14, y, -20, y - 3)
        p.drawLine(14, y, 20, y - 3)
    if sleep:
        p.setBrush(QBrush(QColor(24, 16, 14)))
        p.drawEllipse(QRectF(-6, -8, 5, 3))
        p.drawEllipse(QRectF(2, -8, 5, 3))


def _draw_insect(
    p: QPainter,
    species: Species,
    anim: str,
    i: int,
    sit: float,
    eat: float,
    sleep: float,
    stride: float,
) -> None:
    pal = species.palette
    body = _color(pal.body)
    belly = _color(pal.belly)
    accent = _color(pal.accent)
    ring = _color(pal.ring)
    ear = _color(pal.ear)
    sil = species.silhouette
    buzz = math.sin(i * 1.2) * (6 if anim == "walk" else 2 if anim == "idle" else 0)
    lift = 8 if anim == "play" else 4 if anim == "walk" else 0
    p.translate(0, sit * 0.15 - lift)
    if sleep:
        p.rotate(-12)

    if sil == "bee":
        p.setBrush(QBrush(QColor(220, 228, 236, 140)))
        p.setPen(QPen(QColor(180, 188, 196, 160), 1.0))
        p.drawEllipse(QRectF(-22, -18 + buzz, 18, 14))
        p.drawEllipse(QRectF(4, -18 - buzz, 18, 14))
        p.setBrush(QBrush(body))
        p.setPen(QPen(accent, 1.1))
        p.drawEllipse(QRectF(-16, -8, 32, 22))
        p.setPen(QPen(ear, 1.4))
        p.drawLine(-8, -6, -8, 12)
        p.drawLine(0, -6, 0, 12)
        p.drawLine(8, -6, 8, 12)
        p.setBrush(QBrush(ear))
        p.setPen(Qt.PenStyle.NoPen)
        p.drawEllipse(QRectF(-22, -4, 12, 10))
        p.setPen(QPen(ear, 1.2))
        p.drawLine(-20, -4, -28, -16)
        p.drawLine(-16, -4, -22, -18)
        return
    if sil == "butterfly":
        p.setBrush(QBrush(body))
        p.setPen(QPen(accent, 1.1))
        open_w = 1.0 if anim in ("walk", "play", "idle") else 0.45
        for side in (-1, 1):
            wing = QPainterPath()
            wing.moveTo(0, 0)
            wing.quadTo(side * 28 * open_w, -22, side * 36 * open_w, 2)
            wing.quadTo(side * 22 * open_w, 16, 0, 4)
            p.drawPath(wing)
        p.setBrush(QBrush(ring))
        p.setPen(Qt.PenStyle.NoPen)
        p.drawEllipse(QRectF(-28 * open_w, -16, 6, 6))
        p.drawEllipse(QRectF(22 * open_w, -16, 6, 6))
        p.setBrush(QBrush(ear))
        p.drawRoundedRect(QRectF(-3, -10, 6, 22), 2, 2)
        return
    if sil == "luna":
        p.setBrush(QBrush(body))
        p.setPen(QPen(accent, 1.0))
        open_w = 0.9 if anim != "sleep" else 0.5
        for side in (-1, 1):
            wing = QPainterPath()
            wing.moveTo(0, 2)
            wing.quadTo(side * 26 * open_w, -24, side * 20 * open_w, 6)
            wing.quadTo(side * 18 * open_w, 22, side * 8 * open_w, 28)
            wing.quadTo(side * 4 * open_w, 10, 0, 2)
            p.drawPath(wing)
        p.setBrush(QBrush(ring))
        p.setPen(Qt.PenStyle.NoPen)
        p.drawEllipse(QRectF(-16, -8, 8, 8))
        p.drawEllipse(QRectF(8, -8, 8, 8))
        p.setBrush(QBrush(ear))
        p.drawEllipse(QRectF(-4, -6, 8, 12))
        if eat:
            p.setPen(QPen(accent, 1.0))
            p.drawLine(-2, 4, 2, 4)
        return
    if sil == "firefly":
        p.setBrush(QBrush(QColor(40, 36, 28)))
        p.setPen(QPen(accent, 1.0))
        p.drawEllipse(QRectF(-14, -10, 28, 18))
        p.setBrush(QBrush(body))
        p.drawRoundedRect(QRectF(-12, -8, 24, 10), 4, 4)
        glow = 180 if anim in ("idle", "play", "talk") or i % 2 == 0 else 70
        p.setBrush(QBrush(QColor(255, 220, 64, glow)))
        p.setPen(Qt.PenStyle.NoPen)
        p.drawEllipse(QRectF(-8, 4, 16, 12))
        p.setBrush(QBrush(QColor(220, 228, 236, 90)))
        p.drawEllipse(QRectF(-18, -16 + buzz * 0.4, 14, 10))
        p.drawEllipse(QRectF(4, -16 - buzz * 0.4, 14, 10))
        return
    if sil == "darner":
        p.setBrush(QBrush(QColor(200, 220, 232, 120)))
        p.setPen(QPen(QColor(160, 180, 196, 140), 0.8))
        p.drawEllipse(QRectF(-36, -10 + buzz, 32, 8))
        p.drawEllipse(QRectF(4, -10 - buzz, 32, 8))
        p.drawEllipse(QRectF(-36, -2, 32, 8))
        p.drawEllipse(QRectF(4, -2, 32, 8))
        p.setBrush(QBrush(body))
        p.setPen(QPen(accent, 1.1))
        p.drawRoundedRect(QRectF(-6, -16, 12, 40), 5, 5)
        p.setBrush(QBrush(belly))
        p.drawEllipse(QRectF(-8, -22, 16, 12))
        p.setBrush(QBrush(ring))
        p.setPen(Qt.PenStyle.NoPen)
        p.drawEllipse(QRectF(-3, -20, 6, 6))
        return
    if sil == "stick":
        p.setPen(QPen(body, 3.2))
        p.drawLine(-2, -28, 4, 30)
        p.setPen(QPen(accent, 1.4))
        p.drawLine(-2, -8, -18, -4)
        p.drawLine(2, -4, 20, 0)
        p.drawLine(-1, 8, -16, 16)
        p.drawLine(3, 12, 18, 20)
        p.setBrush(QBrush(ear))
        p.setPen(Qt.PenStyle.NoPen)
        p.drawEllipse(QRectF(-6, -32, 8, 8))
        return
    if sil == "ant":
        p.setBrush(QBrush(body))
        p.setPen(QPen(accent, 1.0))
        p.drawEllipse(QRectF(-22, -6, 14, 12))
        p.drawEllipse(QRectF(-8, -8, 16, 14))
        p.drawEllipse(QRectF(8, -6, 16, 12))
        p.setPen(QPen(accent, 1.2))
        p.drawLine(-4, 4, -16, int(16 + stride * 4))
        p.drawLine(0, 6, 4, int(18 - stride * 4))
        p.drawLine(10, 4, 22, int(16 + stride * 4))
        p.drawLine(-18, -4, -28, -14)
        p.drawLine(-16, -2, -26, -16)
        return
    if sil == "ladybird":
        p.setBrush(QBrush(body))
        p.setPen(QPen(accent, 1.1))
        p.drawEllipse(QRectF(-18, -12, 36, 28))
        p.setPen(QPen(ear, 1.2))
        p.drawLine(0, -10, 0, 14)
        p.setBrush(QBrush(ear))
        p.setPen(Qt.PenStyle.NoPen)
        for x, y in ((-8, -4), (8, -4), (-10, 6), (10, 6), (0, 2), (-6, 12), (6, 12)):
            p.drawEllipse(QRectF(x - 2.4, y - 2.4, 4.8, 4.8))
        p.drawEllipse(QRectF(-8, -16, 16, 10))
        return
    if sil == "mantis":
        p.setBrush(QBrush(body))
        p.setPen(QPen(accent, 1.1))
        p.drawRoundedRect(QRectF(-5, -8, 10, 28), 4, 4)
        p.drawEllipse(QRectF(-8, -20, 16, 14))
        folded = anim != "play"
        p.setPen(QPen(body, 2.4))
        if folded:
            p.drawLine(-4, -4, -16, 8)
            p.drawLine(-16, 8, -8, 16)
            p.drawLine(4, -4, 16, 8)
            p.drawLine(16, 8, 8, 16)
        else:
            p.drawLine(-4, -4, -24, -8)
            p.drawLine(4, -4, 24, -8)
        p.setPen(QPen(accent, 1.4))
        p.drawLine(-2, 16, -14, 28)
        p.drawLine(2, 16, 14, 28)
        return
    if sil in ("bumble", "carpenter", "mason", "leafcutter", "stingless", "sweat", "mining", "drone", "queen"):
        scale = 1.18 if sil == "drone" else 1.28 if sil == "queen" else 1.12 if sil == "bumble" else 0.86 if sil == "stingless" else 0.9 if sil == "sweat" else 1.0
        p.scale(scale, 1.15 if sil == "queen" else scale)
        p.setBrush(QBrush(QColor(220, 228, 236, 140)))
        p.setPen(QPen(QColor(180, 188, 196, 160), 1.0))
        p.drawEllipse(QRectF(-22, -18 + buzz, 18, 14))
        p.drawEllipse(QRectF(4, -18 - buzz, 18, 14))
        p.setBrush(QBrush(body))
        p.setPen(QPen(accent, 1.1))
        abdomen = QRectF(-14, -6, 36 if sil == "queen" else 30, 20 if sil != "queen" else 26)
        if sil == "carpenter":
            p.setBrush(QBrush(ear))
            p.drawEllipse(QRectF(-8, -8, 20, 16))
            p.setBrush(QBrush(body))
            p.drawEllipse(QRectF(6, -6, 22, 18))
        else:
            p.drawEllipse(abdomen)
        if sil not in ("drone", "queen", "carpenter"):
            p.setPen(QPen(ear, 1.4))
            p.drawLine(-6, -4, -6, 12)
            p.drawLine(2, -4, 2, 12)
            p.drawLine(10, -4, 10, 12)
        if sil == "drone":
            p.setBrush(QBrush(ear))
            p.setPen(Qt.PenStyle.NoPen)
            p.drawEllipse(QRectF(-20, -10, 14, 12))
            p.drawEllipse(QRectF(-8, -10, 14, 12))
        else:
            p.setBrush(QBrush(ear))
            p.setPen(Qt.PenStyle.NoPen)
            p.drawEllipse(QRectF(-22, -4, 12, 10))
        if sil == "leafcutter":
            p.setBrush(QBrush(ring))
            p.drawEllipse(QRectF(-4, 8, 16, 8))
        p.setPen(QPen(ear, 1.2))
        p.drawLine(-20, -4, -28, -16)
        p.drawLine(-16, -4, -22, -18)
        return
    if sil == "comb":
        p.setBrush(QBrush(body))
        p.setPen(QPen(accent, 1.1))
        for col, row in ((-18, -8), (0, -8), (18, -8), (-9, 6), (9, 6), (0, 20)):
            hexp = QPainterPath()
            for n in range(6):
                ang = math.radians(60 * n - 30)
                x = col + math.cos(ang) * 10
                y = row + math.sin(ang) * 10 + sit * 0.04
                if n == 0:
                    hexp.moveTo(x, y)
                else:
                    hexp.lineTo(x, y)
            hexp.closeSubpath()
            p.drawPath(hexp)
        p.setBrush(QBrush(belly))
        p.setPen(Qt.PenStyle.NoPen)
        p.drawEllipse(QRectF(-6, -4, 8, 8))
        p.drawEllipse(QRectF(8, 10, 7, 7))
        return
    # Cicada — broad roof wings, red eyes, a sit that waits.
    p.setBrush(QBrush(QColor(40, 36, 32, 160)))
    p.setPen(QPen(accent, 1.0))
    roof = QPainterPath()
    roof.moveTo(-6, -8)
    roof.quadTo(-28, 4, -8, 22)
    roof.quadTo(0, 8, -6, -8)
    p.drawPath(roof)
    roof2 = QPainterPath()
    roof2.moveTo(6, -8)
    roof2.quadTo(28, 4, 8, 22)
    roof2.quadTo(0, 8, 6, -8)
    p.drawPath(roof2)
    p.setBrush(QBrush(body))
    p.drawEllipse(QRectF(-10, -6, 20, 22))
    p.setBrush(QBrush(ear))
    p.setPen(Qt.PenStyle.NoPen)
    p.drawEllipse(QRectF(-10, -10, 8, 8))
    p.drawEllipse(QRectF(2, -10, 8, 8))
    if anim == "play":
        p.setPen(QPen(ring, 1.2))
        p.drawLine(-4, 4, 4, 4)


def _draw_fungus(
    p: QPainter,
    species: Species,
    anim: str,
    i: int,
    sit: float,
    eat: float,
    sleep: float,
) -> None:
    pal = species.palette
    body = _color(pal.body)
    belly = _color(pal.belly)
    accent = _color(pal.accent)
    ring = _color(pal.ring)
    ear = _color(pal.ear)
    sil = species.silhouette
    lean = math.sin(i * 0.9) * (4 if anim in ("idle", "walk") else 1)
    flush = 8 if anim in ("play", "talk") else 0
    p.translate(lean, sit * 0.12)
    if sleep:
        p.rotate(-10)
    if sil == "shelf":
        p.setBrush(QBrush(ear))
        p.setPen(QPen(accent, 1.2))
        p.drawRoundedRect(QRectF(-10, 16, 22, 8), 3, 3)
        p.setBrush(QBrush(body))
        for ox, oy, w in ((-16, 4, 22), (0, -2, 28), (12, 6, 20)):
            fan = QPainterPath()
            fan.moveTo(ox - w / 2, oy + 8)
            fan.quadTo(ox - w / 3, oy - 8, ox, oy - 10)
            fan.quadTo(ox + w / 2, oy - 2, ox + w / 2, oy + 6)
            fan.quadTo(ox, oy + 10, ox - w / 2, oy + 8)
            p.drawPath(fan)
        return
    if sil == "amanita":
        p.setBrush(QBrush(belly))
        p.setPen(QPen(accent, 1.0))
        p.drawEllipse(QRectF(-12, 16, 24, 10))
        p.drawRoundedRect(QRectF(-6, -4, 12, 24), 5, 5)
        p.setBrush(QBrush(body))
        p.drawEllipse(QRectF(-26, -22, 52, 26))
        p.setBrush(QBrush(belly))
        p.setPen(Qt.PenStyle.NoPen)
        for x, y in ((-12, -14), (8, -16), (-4, -8), (14, -10), (0, -18)):
            p.drawEllipse(QRectF(x, y, 6, 5))
        p.setPen(QPen(belly, 2.0))
        p.drawLine(-10, 6, 10, 6)
        return
    if sil == "morel":
        p.setBrush(QBrush(ear))
        p.setPen(QPen(accent, 1.0))
        p.drawRoundedRect(QRectF(-6, 6, 12, 20), 4, 4)
        cone = QPainterPath()
        cone.moveTo(-4, -28)
        cone.lineTo(10, -20)
        cone.lineTo(14, 4)
        cone.lineTo(-14, 4)
        cone.lineTo(-12, -18)
        cone.closeSubpath()
        p.setBrush(QBrush(body))
        p.drawPath(cone)
        p.setBrush(QBrush(belly))
        p.setPen(Qt.PenStyle.NoPen)
        for x, y in ((-4, -16), (4, -12), (-6, -4), (6, -2), (0, -8)):
            p.drawEllipse(QRectF(x, y, 6, 5))
        return
    if sil == "chanterelle":
        p.setBrush(QBrush(belly))
        p.setPen(QPen(accent, 1.0))
        p.drawRoundedRect(QRectF(-5, 4, 10, 18), 4, 4)
        vase = QPainterPath()
        vase.moveTo(-6, 6)
        vase.quadTo(-22, -6, -8, -22)
        vase.quadTo(0, -28, 8, -22)
        vase.quadTo(22, -6, 6, 6)
        p.setBrush(QBrush(body))
        p.drawPath(vase)
        p.setPen(QPen(ring, 1.0))
        p.drawLine(0, 6, -14, -8)
        p.drawLine(0, 6, 14, -8)
        p.drawLine(-4, 4, -8, -18)
        p.drawLine(4, 4, 8, -18)
        return
    if sil == "bracket":
        p.setPen(Qt.PenStyle.NoPen)
        for k, (ox, oy, w, h, fill) in enumerate(
            (
                (-8, 6, 36, 14, ear),
                (2, 0, 32, 12, body),
                (8, -6, 28, 10, ring),
            )
        ):
            p.setBrush(QBrush(fill))
            p.drawEllipse(QRectF(ox - w / 2, oy - h / 2, w, h))
        p.setBrush(QBrush(belly))
        p.drawEllipse(QRectF(-6, 8, 22, 7))
        return
    if sil == "mane":
        p.setBrush(QBrush(belly))
        p.setPen(QPen(accent, 1.0))
        p.drawEllipse(QRectF(-12, -12, 24, 14))
        p.setPen(QPen(body, 2.4))
        for x, L in ((-14, 22), (-8, 28), (-2, 32), (4, 30), (10, 24), (16, 18)):
            p.drawLine(x, 0, x + (1 if x >= 0 else -1), L)
        return
    if sil == "puffball":
        puff = 6 if anim == "play" else 0
        p.setBrush(QBrush(body))
        p.setPen(QPen(accent, 1.1))
        p.drawEllipse(QRectF(-22 - puff / 2, -18 - puff / 2, 44 + puff, 40 + puff))
        p.setBrush(QBrush(belly))
        p.setPen(Qt.PenStyle.NoPen)
        for x, y in ((-8, -6), (8, -8), (0, 6), (-12, 4)):
            p.drawEllipse(QRectF(x, y, 5, 4))
        p.setBrush(QBrush(ear))
        p.drawEllipse(QRectF(-4, -16, 8, 6))
        if anim == "play":
            p.setBrush(QBrush(QColor(220, 212, 196, 120)))
            p.drawEllipse(QRectF(-10, -36, 12, 10))
            p.drawEllipse(QRectF(4, -40, 10, 8))
        return
    if sil == "sulfur":
        p.setBrush(QBrush(ear))
        p.setPen(QPen(accent, 1.1))
        p.drawRoundedRect(QRectF(-8, 16, 20, 8), 3, 3)
        p.setBrush(QBrush(body))
        for oy, w in ((10, 20), (0, 28), (-10, 32), (-20, 24)):
            fan = QPainterPath()
            fan.moveTo(-w / 2, oy + 8)
            fan.quadTo(-w / 3, oy - 4, 0, oy - 6)
            fan.quadTo(w / 2, oy, w / 2, oy + 6)
            fan.quadTo(0, oy + 10, -w / 2, oy + 8)
            p.drawPath(fan)
        return
    if sil == "yeast":
        rise = 6 if anim in ("walk", "play") else 2 if anim == "idle" else 0
        p.setBrush(QBrush(QColor(196, 208, 212, 90)))
        p.setPen(QPen(ear, 1.2))
        p.drawRoundedRect(QRectF(-16, -10 - rise, 32, 36 + rise), 4, 4)
        p.setBrush(QBrush(body))
        p.setPen(Qt.PenStyle.NoPen)
        p.drawEllipse(QRectF(-12, 2, 24, 18))
        p.setBrush(QBrush(belly))
        p.drawEllipse(QRectF(-13, -6 - rise, 26, 12))
        p.drawEllipse(QRectF(-6, 6, 5, 6))
        p.drawEllipse(QRectF(4, 10, 4, 5))
        return
    # Lichen — branching shrub, not a cap.
    p.setPen(QPen(body, 2.4))
    p.drawLine(0, 16, 0, -20)
    p.drawLine(0, 4, -16, -10)
    p.drawLine(0, 0, 16, -12)
    p.drawLine(-8, -4, -18, -18)
    p.drawLine(8, -6, 18, -20)
    p.setBrush(QBrush(belly))
    p.setPen(Qt.PenStyle.NoPen)
    for x, y in ((-16, -10), (16, -12), (-18, -18), (18, -20), (0, -20), (8, -8)):
        p.drawEllipse(QRectF(x - 3, y - 3, 6, 6))
    p.setBrush(QBrush(ear))
    p.drawEllipse(QRectF(-8, 14, 16, 8))
    _ = flush


def _draw_far(
    p: QPainter,
    species: Species,
    anim: str,
    i: int,
    sit: float,
    eat: float,
    sleep: float,
) -> None:
    pal = species.palette
    body = _color(pal.body)
    belly = _color(pal.belly)
    accent = _color(pal.accent)
    ring = _color(pal.ring)
    ear = _color(pal.ear)
    sil = species.silhouette
    lean = math.sin(i * 0.9) * (4 if anim in ("idle", "walk") else 1)
    p.translate(lean, sit * 0.12)
    if sleep:
        p.rotate(-10)
    if sil == "gleam":
        p.setPen(Qt.PenStyle.NoPen)
        p.setBrush(QBrush(QColor(ear.red(), ear.green(), ear.blue(), 70)))
        p.drawEllipse(QRectF(-22, -28, 44, 52))
        p.setBrush(QBrush(body))
        p.setPen(QPen(accent, 1.0))
        p.drawEllipse(QRectF(-14, -18, 28, 40))
        p.setBrush(QBrush(belly))
        p.setPen(Qt.PenStyle.NoPen)
        p.drawEllipse(QRectF(-6, -10, 12, 18))
        p.setBrush(QBrush(ear))
        p.drawEllipse(QRectF(-3, -22, 6, 5))
        return
    if sil == "choir":
        p.setPen(QPen(accent, 1.0))
        for k, (oy, w, fill) in enumerate(
            ((-16, 28, body), (-6, 24, belly), (4, 22, ring), (14, 18, ear))
        ):
            p.setBrush(QBrush(fill))
            p.drawEllipse(QRectF(-w / 2, oy, w, 8))
        return
    if sil == "nimbus":
        p.setBrush(QBrush(body))
        p.setPen(QPen(accent, 1.0))
        p.drawEllipse(QRectF(-24, -20, 48, 32))
        p.setBrush(QBrush(belly))
        p.setPen(Qt.PenStyle.NoPen)
        p.drawEllipse(QRectF(-16, -16, 22, 18))
        p.setPen(QPen(ear, 2.0))
        p.drawLine(-10, 10, -12, 28)
        p.drawLine(0, 12, 2, 32)
        p.drawLine(10, 10, 14, 26)
        return
    if sil == "shard":
        p.setBrush(QBrush(body))
        p.setPen(QPen(accent, 1.1))
        crystal = QPainterPath()
        crystal.moveTo(-4, -26)
        crystal.lineTo(14, -12)
        crystal.lineTo(8, 8)
        crystal.lineTo(-10, 4)
        crystal.closeSubpath()
        p.drawPath(crystal)
        side = QPainterPath()
        side.moveTo(-16, -6)
        side.lineTo(-4, -26)
        side.lineTo(-10, 4)
        side.lineTo(-20, 10)
        side.closeSubpath()
        p.setBrush(QBrush(belly))
        p.drawPath(side)
        return
    if sil == "dusk":
        p.setBrush(QBrush(body))
        p.setPen(QPen(accent, 1.0))
        dark = QPainterPath()
        dark.moveTo(-4, -22)
        dark.lineTo(8, -6)
        dark.lineTo(6, 18)
        dark.lineTo(-8, 14)
        dark.closeSubpath()
        p.drawPath(dark)
        p.setBrush(QBrush(belly))
        p.setPen(Qt.PenStyle.NoPen)
        lit = QPainterPath()
        lit.moveTo(-4, -22)
        lit.lineTo(2, -16)
        lit.lineTo(4, 12)
        lit.lineTo(-8, 14)
        lit.closeSubpath()
        p.drawPath(lit)
        p.setPen(QPen(ear, 2.0))
        p.drawLine(-6, 14, -12, 24)
        p.drawLine(2, 16, 8, 24)
        return
    if sil == "knot":
        p.setPen(QPen(belly, 1.2))
        for a, b in ((-12, -10), (8, -14), (14, 4), (0, 12), (-14, 6), (4, -2)):
            p.drawLine(-2, 0, a, b)
        p.setBrush(QBrush(body))
        p.setPen(QPen(accent, 1.0))
        for x, y in ((-12, -10), (8, -14), (14, 4), (0, 12), (-14, 6), (4, -2)):
            p.drawEllipse(QRectF(x - 5, y - 5, 10, 10))
        return
    if sil == "brine":
        p.setBrush(QBrush(body))
        p.setPen(QPen(accent, 1.1))
        salt = QPainterPath()
        salt.moveTo(-8, -18)
        salt.lineTo(12, -14)
        salt.lineTo(16, 4)
        salt.lineTo(4, 16)
        salt.lineTo(-14, 8)
        salt.closeSubpath()
        p.drawPath(salt)
        p.setBrush(QBrush(belly))
        p.setPen(Qt.PenStyle.NoPen)
        for x, y in ((-8, 6), (8, 4), (0, 12), (12, -6)):
            p.drawEllipse(QRectF(x, y, 6, 5))
        return
    if sil == "beacon":
        p.setBrush(QBrush(body))
        p.setPen(QPen(accent, 1.0))
        needle = QPainterPath()
        needle.moveTo(-28, -4)
        needle.lineTo(0, -8)
        needle.lineTo(30, 0)
        needle.lineTo(0, 8)
        needle.closeSubpath()
        p.drawPath(needle)
        p.setBrush(QBrush(ear))
        tip = QPainterPath()
        tip.moveTo(8, -6)
        tip.lineTo(30, 0)
        tip.lineTo(8, 6)
        p.drawPath(tip)
        p.setBrush(QBrush(belly))
        p.drawEllipse(QRectF(-4, -4, 8, 8))
        return
    if sil == "hush":
        p.setBrush(QBrush(body))
        p.setPen(QPen(accent, 1.0))
        p.drawEllipse(QRectF(-22, -16, 44, 36))
        p.setBrush(QBrush(belly))
        p.setPen(Qt.PenStyle.NoPen)
        p.drawEllipse(QRectF(-14, -12, 20, 16))
        p.setBrush(QBrush(ear))
        p.drawEllipse(QRectF(4, 0, 16, 12))
        return
    # Cyst — sealed seed, opens a little on play. Not a yeast jar.
    open_amt = 8 if anim == "play" else 0
    p.setBrush(QBrush(body))
    p.setPen(QPen(accent, 1.1))
    top = QPainterPath()
    top.moveTo(-14, -6 - open_amt / 2)
    top.lineTo(0, -20 - open_amt)
    top.lineTo(14, -6 - open_amt / 2)
    top.lineTo(8, 2)
    top.lineTo(-8, 2)
    top.closeSubpath()
    p.drawPath(top)
    bot = QPainterPath()
    bot.moveTo(-12, 2)
    bot.lineTo(12, 2)
    bot.lineTo(10, 16 + open_amt / 2)
    bot.lineTo(0, 20 + open_amt)
    bot.lineTo(-10, 16 + open_amt / 2)
    bot.closeSubpath()
    p.drawPath(bot)
    if anim == "play":
        p.setBrush(QBrush(belly))
        p.setPen(Qt.PenStyle.NoPen)
        p.drawEllipse(QRectF(-6, -2, 12, 8))
    _ = eat


def _draw_pond(
    p: QPainter,
    species: Species,
    anim: str,
    i: int,
    sit: float,
    eat: float,
    sleep: float,
) -> None:
    pal = species.palette
    body = _color(pal.body)
    belly = _color(pal.belly)
    accent = _color(pal.accent)
    ring = _color(pal.ring)
    nose = _color(pal.nose)
    sil = species.silhouette
    wave = math.sin(i * 0.9) * 5
    p.translate(0, sit * 0.12)
    if sleep:
        p.rotate(-10)

    if sil == "frog":
        p.setBrush(QBrush(body))
        p.setPen(QPen(accent, 1.1))
        hind = QPainterPath()
        hind.moveTo(-8, 8)
        hind.quadTo(-28, 22 + wave * 0.2, -6, 6)
        p.drawPath(hind)
        hind2 = QPainterPath()
        hind2.moveTo(8, 8)
        hind2.quadTo(28, 22 - wave * 0.2, 6, 6)
        p.drawPath(hind2)
        p.drawEllipse(QRectF(-18, -6, 36, 22))
        p.setPen(Qt.PenStyle.NoPen)
        p.setBrush(QBrush(belly))
        p.drawEllipse(QRectF(-10, 2, 20, 10))
        p.setBrush(QBrush(body))
        p.setPen(QPen(accent, 1.0))
        p.drawEllipse(QRectF(-20, -18, 18, 16))
        p.drawEllipse(QRectF(-2, -14, 14, 12))
        p.setPen(Qt.PenStyle.NoPen)
        p.setBrush(QBrush(ring))
        p.drawEllipse(QRectF(-6, -10, 7, 7))
        _draw_face(p, -14, -12, nose, sleep, anim, i, False)
        return

    if sil == "toad":
        p.setBrush(QBrush(body))
        p.setPen(QPen(accent, 1.1))
        p.drawEllipse(QRectF(-20, -4, 40, 26))
        p.setPen(Qt.PenStyle.NoPen)
        p.setBrush(QBrush(belly))
        p.drawEllipse(QRectF(-10, 6, 20, 10))
        p.setBrush(QBrush(body))
        p.setPen(QPen(accent, 1.0))
        p.drawEllipse(QRectF(-14, -16, 22, 18))
        p.setPen(Qt.PenStyle.NoPen)
        p.setBrush(QBrush(accent))
        p.drawEllipse(QRectF(-16, -12, 9, 7))
        p.drawEllipse(QRectF(2, -10, 8, 6))
        for x, y, r in ((-8, 4, 4), (6, 6, 3.6), (0, 0, 3.2), (10, 8, 2.8)):
            p.drawEllipse(QRectF(x, y, r, r * 0.8))
        p.setBrush(QBrush(body))
        p.drawEllipse(QRectF(-16, 14, 8, 6))
        p.drawEllipse(QRectF(8, 14, 8, 6))
        _draw_face(p, -8, -10, nose, sleep, anim, i, False)
        return

    if sil == "newt":
        tail = QPainterPath()
        tail.moveTo(10, 0)
        tail.quadTo(28, -8 + wave, 34, 2)
        tail.quadTo(26, 8, 10, 6)
        p.setBrush(QBrush(accent))
        p.setPen(QPen(accent, 1.0))
        p.drawPath(tail)
        p.setBrush(QBrush(body))
        p.drawRoundedRect(QRectF(-16, -6, 30, 14), 7, 7)
        p.setPen(Qt.PenStyle.NoPen)
        p.setBrush(QBrush(belly))
        p.drawEllipse(QRectF(-8, -1, 16, 7))
        p.setBrush(QBrush(ring))
        for x, y in ((-6, -2), (2, 0), (8, 2)):
            p.drawEllipse(QRectF(x, y, 3.2, 2.8))
        p.setBrush(QBrush(body))
        p.setPen(QPen(accent, 1.0))
        p.drawEllipse(QRectF(-24, -10, 16, 12))
        _draw_face(p, -18, -6, nose, sleep, anim, i, False)
        return

    if sil == "salamander":
        p.setBrush(QBrush(body))
        p.setPen(QPen(accent, 1.1))
        p.drawRoundedRect(QRectF(-16, -8, 36, 16), 8, 8)
        tail = QPainterPath()
        tail.moveTo(16, 0)
        tail.quadTo(30, -2, 32, 4)
        p.drawPath(tail)
        p.setPen(Qt.PenStyle.NoPen)
        p.setBrush(QBrush(ring))
        for x, y in ((-8, -4), (2, -6), (10, -2), (-2, 4), (8, 4)):
            p.drawEllipse(QRectF(x, y, 5, 4))
        p.setBrush(QBrush(body))
        p.setPen(QPen(accent, 1.0))
        p.drawEllipse(QRectF(-26, -12, 18, 14))
        _draw_face(p, -20, -6, nose, sleep, anim, i, False)
        return

    if sil == "caecilian":
        phase = i * 0.45
        pts = [(-36 + t * 72, math.sin(t * 2.4 + phase) * 4) for t in (n / 8 for n in range(9))]
        for k, (x, y) in enumerate(pts):
            t = k / 8
            p.setBrush(QBrush(body if k % 2 == 0 else ring))
            p.setPen(QPen(accent, 0.8))
            p.drawEllipse(QRectF(x - 8, y - 6, 16 - t * 4, 12 - t * 2))
        hx, hy = pts[0]
        p.setBrush(QBrush(body))
        p.drawEllipse(QRectF(hx - 10, hy - 8, 20, 14))
        p.setPen(Qt.PenStyle.NoPen)
        p.setBrush(QBrush(accent))
        p.drawEllipse(QRectF(hx - 6, hy + 2, 10, 3))
        _draw_face(p, hx - 2, hy - 4, nose, sleep, anim, i, False)
        return

    if sil == "crayfish":
        p.setBrush(QBrush(body))
        p.setPen(QPen(accent, 1.1))
        fan = QPainterPath()
        fan.moveTo(10, 0)
        fan.lineTo(28, -10 + wave * 0.2)
        fan.lineTo(26, 10 - wave * 0.2)
        fan.closeSubpath()
        p.drawPath(fan)
        p.drawEllipse(QRectF(-16, -10, 28, 20))
        claw = QPainterPath()
        claw.moveTo(-12, -4)
        claw.lineTo(-30, -14)
        claw.lineTo(-18, 0)
        claw.closeSubpath()
        p.drawPath(claw)
        claw2 = QPainterPath()
        claw2.moveTo(-12, 6)
        claw2.lineTo(-28, 16)
        claw2.lineTo(-16, 4)
        claw2.closeSubpath()
        p.drawPath(claw2)
        p.setPen(QPen(accent, 1.2))
        for ox in (-8, -2, 6):
            p.drawLine(ox, 8, ox - 2, 16)
        _draw_face(p, -10, -4, nose, sleep, anim, i, False)
        return

    if sil == "snail":
        p.setBrush(QBrush(body))
        p.setPen(QPen(accent, 1.2))
        p.drawEllipse(QRectF(-4, -28, 32, 40))
        p.setPen(QPen(ring, 1.4))
        p.setBrush(Qt.BrushStyle.NoBrush)
        p.drawEllipse(QRectF(4, -16, 16, 20))
        p.drawEllipse(QRectF(8, -10, 8, 10))
        p.setBrush(QBrush(belly))
        p.setPen(QPen(accent, 1.0))
        p.drawEllipse(QRectF(-24, 2, 22, 12))
        _draw_face(p, -18, 4, nose, sleep, anim, i, False)
        return

    if sil == "mussel":
        open_amt = 3 + (4 if anim in ("eat", "play") else 1) + eat * 0.3
        p.setBrush(QBrush(body))
        p.setPen(QPen(accent, 1.2))
        p.drawEllipse(QRectF(-16, -22, 22, 40))
        p.setBrush(QBrush(accent))
        p.drawEllipse(QRectF(-10 + open_amt, -20, 22, 38))
        p.setPen(QPen(ring, 2.0))
        p.drawLine(-6, -8, 4, -4)
        if anim in ("eat", "play") or eat:
            p.setPen(Qt.PenStyle.NoPen)
            p.setBrush(QBrush(ring))
            p.drawEllipse(QRectF(8, -12, 5, 10))
        return

    if sil == "leech":
        phase = i * 0.5
        pts = [(-32 + t * 64, math.sin(t * 2.2 + phase) * 5) for t in (n / 8 for n in range(9))]
        for k, (x, y) in enumerate(pts):
            t = k / 8
            p.setBrush(QBrush(body if k % 2 == 0 else ring))
            p.setPen(QPen(accent, 0.8))
            p.drawEllipse(QRectF(x - 10, y - 5, 18 - t * 3, 9))
        hx, hy = pts[0]
        tx, ty = pts[-1]
        p.setBrush(QBrush(accent))
        p.setPen(Qt.PenStyle.NoPen)
        p.drawEllipse(QRectF(hx - 6, hy - 4, 10, 8))
        p.drawEllipse(QRectF(tx - 4, ty - 3, 8, 6))
        return

    # stickleback — three spines, not Coin
    tail = QPainterPath()
    tail.moveTo(22, 0)
    tail.lineTo(40, -10 + wave)
    tail.lineTo(38, 10 - wave)
    tail.closeSubpath()
    p.setBrush(QBrush(ring))
    p.setPen(QPen(accent, 1.1))
    p.drawPath(tail)
    p.setBrush(QBrush(body))
    p.drawEllipse(QRectF(-22, -12, 44, 24))
    p.setPen(Qt.PenStyle.NoPen)
    p.setBrush(QBrush(belly))
    p.drawEllipse(QRectF(-8, -2, 20, 10))
    p.setPen(QPen(accent, 1.6))
    p.drawLine(-2, -12, -2, -24)
    p.drawLine(6, -12, 6, -22)
    p.drawLine(14, -10, 14, -20)
    _draw_face(p, -14, -4, nose, sleep, anim, i, False)


def _draw_snake(
    p: QPainter,
    species: Species,
    anim: str,
    i: int,
    sit: float,
    eat: float,
    sleep: float,
    stride: float,
) -> None:
    pal = species.palette
    body = _color(pal.body)
    belly = _color(pal.belly)
    accent = _color(pal.accent)
    ring = _color(pal.ring)
    third = _color(pal.ear)
    nose = _color(pal.nose)
    coiled = anim in ("sit", "sleep") or (species.key == "ball_python" and anim == "idle" and i % 2 == 0)
    if species.key == "green_tree_python" and anim in ("sit", "idle", "sleep"):
        coiled = True
    n = 9
    pts: list[tuple[float, float]] = []
    if coiled:
        for k in range(n):
            ang = k * 0.82 + i * 0.08
            r = 10 + k * 3.6
            pts.append((math.cos(ang) * r, math.sin(ang) * r + 6))
    else:
        phase = i * 0.7 + stride * 0.4
        for k in range(n):
            t = k / (n - 1)
            x = -46 + t * 92
            y = math.sin(t * math.pi * 2.2 + phase) * (9 if species.walk > 60 else 6)
            pts.append((x, y))

    for k, (x, y) in enumerate(pts):
        t = k / (n - 1)
        fill = _snake_fill(species.pattern, k, body, belly, ring, third, accent)
        p.setPen(QPen(accent, 0.8))
        p.setBrush(QBrush(fill))
        w = 16 + (1 - t) * 6
        h = 12 + (1 - t) * 3
        p.drawEllipse(QRectF(x - w / 2, y - h / 2, w, h))

    hx, hy = pts[0]
    if eat:
        hy += eat * 0.25
    p.setBrush(QBrush(body))
    p.setPen(QPen(accent, 1.1))
    p.drawEllipse(QRectF(hx - 14, hy - 11, 26, 22))
    if species.key == "hognose":
        p.setBrush(QBrush(body))
        p.drawEllipse(QRectF(hx - 20, hy - 2, 12, 8))
        p.setBrush(QBrush(nose))
        p.drawEllipse(QRectF(hx - 22, hy - 6, 8, 7))
    _draw_face(p, hx - 2, hy - 6, nose, sleep, anim, i, False)
    if eat:
        p.setBrush(QBrush(QColor(40, 24, 20)))
        p.drawEllipse(QRectF(hx - 8, hy + 6, 10, 4))


def _snake_fill(
    pattern: str,
    k: int,
    body: QColor,
    belly: QColor,
    ring: QColor,
    third: QColor,
    accent: QColor,
) -> QColor:
    if pattern == "bands":
        return ring if k % 2 == 0 else body
    if pattern == "tricolor":
        return (body, ring, third)[k % 3]
    if pattern == "stripe":
        return ring if k % 3 == 1 else body
    if pattern in ("blotch", "saddle", "map"):
        return ring if k % 3 == 0 else body
    return body if k % 2 == 0 else belly


def _draw_face(
    p: QPainter,
    hx: float,
    hy: float,
    nose: QColor,
    sleep: float,
    anim: str,
    i: int,
    dog_nose: bool,
) -> None:
    p.setPen(Qt.PenStyle.NoPen)
    if sleep:
        p.setPen(QPen(nose, 2.2))
        p.drawLine(int(hx - 12), int(hy + 6), int(hx - 4), int(hy + 8))
        p.drawLine(int(hx + 4), int(hy + 8), int(hx + 12), int(hy + 6))
        p.setPen(Qt.PenStyle.NoPen)
    else:
        blink = anim == "idle" and i == 3
        p.setBrush(QBrush(QColor(24, 16, 14)))
        if blink:
            p.setPen(QPen(QColor(24, 16, 14), 2))
            p.drawLine(int(hx - 12), int(hy + 6), int(hx - 4), int(hy + 6))
            p.drawLine(int(hx + 4), int(hy + 6), int(hx + 12), int(hy + 6))
            p.setPen(Qt.PenStyle.NoPen)
        else:
            p.drawEllipse(QRectF(hx - 13, hy + 2, 8, 9))
            p.drawEllipse(QRectF(hx + 5, hy + 2, 8, 9))
            p.setBrush(QBrush(QColor(250, 246, 236)))
            p.drawEllipse(QRectF(hx - 11, hy + 3, 3, 3))
            p.drawEllipse(QRectF(hx + 7, hy + 3, 3, 3))
    p.setBrush(QBrush(nose))
    if dog_nose:
        p.drawEllipse(QRectF(hx - 7, hy + 12, 14, 10))
    else:
        p.drawEllipse(QRectF(hx - 5, hy + 12, 10, 8))


def _top_light(p: QPainter, hx: float, hy: float) -> None:
    grad = QLinearGradient(QPointF(-20, -50), QPointF(20, 10))
    grad.setColorAt(0, QColor(255, 236, 210, 40))
    grad.setColorAt(1, QColor(255, 236, 210, 0))
    p.setBrush(QBrush(grad))
    p.setPen(Qt.PenStyle.NoPen)
    p.drawEllipse(QRectF(hx - 20, hy - 14, 40, 22))
