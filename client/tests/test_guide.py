"""Every catalog key has a plaque; the important mix-ups are actually taught.

Same spirit as web/scripts/house-guide.test.mjs and snake-guide.test.mjs.
Copy is ported from the web guides — do not invent new biology here.
"""

from __future__ import annotations

import os
import re
from pathlib import Path

from computerpets_client.guide import (
    FIELD_GUIDE,
    GARDEN_GUIDE,
    HOUSE_GUIDE,
    SEA_GUIDE,
    SNAKE_GUIDE,
    classroom_for,
    garden_guide_complete,
    garden_guide_keys,
    guide_complete,
    house_guide_complete,
    house_guide_keys,
    plaque_by_slug,
    plaque_for,
    sea_guide_complete,
    sea_guide_keys,
    snake_guide_complete,
    snake_guide_keys,
)
from computerpets_client.species import CATALOG_KEYS, GARDEN_KEYS, HOUSE_KEYS, SEA_KEYS, SNAKE_KEYS, SPECIES

HOUSE_EXPECTED = [
    ("red_panda", "rui", "Ailurus fulgens"),
    ("cat", "miso", "Felis catus"),
    ("dog", "pip", "Canis familiaris"),
    ("rabbit", "thimble", "Oryctolagus cuniculus"),
    ("hamster", "clip", "Mesocricetus auratus"),
    ("guinea_pig", "whee", "Cavia porcellus"),
    ("turtle", "ink", "Mauremys reevesii"),
    ("goldfish", "coin", "Carassius auratus"),
    ("budgie", "echo", "Melopsittacus undulatus"),
    ("fox", "rue", "Vulpes vulpes"),
    ("penguin", "peck", "Eudyptula minor"),
    ("parrot", "quill", "Ara macao"),
    ("ferret", "wick", "Mustela furo"),
    ("hedgehog", "burr", "Atelerix albiventris"),
    ("chinchilla", "floss", "Chinchilla lanigera"),
    ("axolotl", "bloom", "Ambystoma mexicanum"),
    ("toucan", "keel", "Ramphastos sulfuratus"),
    ("iguana", "sol", "Iguana iguana"),
    ("dragon", "vesper", "kept, not collected"),
    ("phoenix", "ember", "kept in the ash"),
]

SNAKE_EXPECTED = [
    ("ball_python", "nori", "Python regius"),
    ("corn_snake", "saffron", "Pantherophis guttatus"),
    ("kingsnake", "bandit", "Lampropeltis californiae"),
    ("green_tree_python", "jade", "Morelia viridis"),
    ("hognose", "bluff", "Heterodon nasicus"),
    ("garter", "stripe", "Thamnophis sirtalis"),
    ("boa", "lula", "Boa constrictor"),
    ("milk_snake", "coral", "Lampropeltis gentilis"),
    ("rosy_boa", "blush", "Lichanura trivirgata"),
    ("carpet_python", "atlas", "Morelia spilota cheynei"),
]

SEA_EXPECTED = [
    ("octopus", "cup", "Octopus vulgaris"),
    ("cuttlefish", "sepia", "Sepia officinalis"),
    ("nautilus", "chamber", "Nautilus pompilius"),
    ("moon_jelly", "bell", "Aurelia aurita"),
    ("sea_star", "ochre", "Pisaster ochraceus"),
    ("hermit_crab", "tenant", "Pagurus bernhardus"),
    ("horseshoe_crab", "ledger", "Limulus polyphemus"),
    ("seahorse", "anchor", "Hippocampus erectus"),
    ("manta", "kite", "Mobula alfredi"),
    ("moray", "door", "Gymnothorax funebris"),
]

GARDEN_EXPECTED = [
    ("moss", "felt", "Hypnum cupressiforme"),
    ("maidenhair", "vein", "Adiantum capillus-veneris"),
    ("ginkgo", "fan", "Ginkgo biloba"),
    ("oak", "mast", "Quercus alba"),
    ("water_lily", "pad", "Nymphaea odorata"),
    ("orchid", "moth", "Phalaenopsis amabilis"),
    ("saguaro", "arm", "Carnegiea gigantea"),
    ("venus_flytrap", "snap", "Dionaea muscipula"),
    ("pitcher", "well", "Sarracenia purpurea"),
    ("sundew", "dew", "Drosera rotundifolia"),
]

WEB_PETS = Path(__file__).resolve().parents[2] / "web" / "src" / "lib" / "pets"


def _taught(guide) -> str:
    return " ".join((guide.tell, guide.mixup, guide.lesson))


def test_every_catalog_key_has_a_tell_and_a_mixup():
    assert guide_complete()
    assert house_guide_complete()
    assert snake_guide_complete()
    assert sea_guide_complete()
    assert garden_guide_complete()
    assert house_guide_keys() == HOUSE_KEYS
    assert snake_guide_keys() == SNAKE_KEYS
    assert sea_guide_keys() == SEA_KEYS
    assert garden_guide_keys() == GARDEN_KEYS
    assert len(FIELD_GUIDE) == len(CATALOG_KEYS)
    assert len(HOUSE_GUIDE) == 20
    assert len(SNAKE_GUIDE) == 10
    assert len(SEA_GUIDE) == 10
    assert len(GARDEN_GUIDE) == 10
    for key in CATALOG_KEYS:
        guide = plaque_for(key)
        assert guide is not None, key
        assert guide.key == key
        assert guide.slug == SPECIES[key].slug
        assert guide.name == SPECIES[key].name
        assert guide.species == SPECIES[key].label
        assert guide.tell.strip()
        assert guide.mixup.strip()
        assert guide.lesson.strip()
        assert guide.latin.strip()
        assert guide.habitat.strip()
        assert guide.temperament.strip()


def test_house_and_den_list_the_same_keys_as_the_roster():
    assert [g.key for g in HOUSE_GUIDE] == [key for key, _, _ in HOUSE_EXPECTED]
    assert [g.key for g in SNAKE_GUIDE] == [key for key, _, _ in SNAKE_EXPECTED]
    assert [g.key for g in SEA_GUIDE] == [key for key, _, _ in SEA_EXPECTED]
    assert [g.key for g in GARDEN_GUIDE] == [key for key, _, _ in GARDEN_EXPECTED]
    for key, slug, latin in HOUSE_EXPECTED + SNAKE_EXPECTED + SEA_EXPECTED + GARDEN_EXPECTED:
        guide = plaque_for(key)
        assert guide is not None
        assert guide.slug == slug
        assert guide.latin == latin
        assert plaque_by_slug(slug) is guide
    for key in SNAKE_KEYS:
        assert plaque_for(key) is not None
        assert classroom_for(key).room == "den"
        assert classroom_for(key).verb == "crawl"
    for key in HOUSE_KEYS:
        assert classroom_for(key).room == "house"
        assert classroom_for(key).verb == "walk"
    for key in SEA_KEYS:
        assert plaque_for(key) is not None
        assert classroom_for(key).room == "tide"
        assert classroom_for(key).verb == "swim"
    for key in GARDEN_KEYS:
        assert plaque_for(key) is not None
        assert classroom_for(key).room == "garden"
        assert classroom_for(key).verb == "grow"


def test_the_important_house_mixups_are_actually_taught():
    panda = _taught(plaque_for("red_panda"))
    axolotl = _taught(plaque_for("axolotl"))
    chinchilla = _taught(plaque_for("chinchilla"))
    guinea = _taught(plaque_for("guinea_pig"))
    hedgehog = _taught(plaque_for("hedgehog"))
    rabbit = _taught(plaque_for("rabbit"))
    goldfish = _taught(plaque_for("goldfish"))
    fox = _taught(plaque_for("fox"))
    penguin = _taught(plaque_for("penguin"))
    dragon = _taught(plaque_for("dragon"))
    assert re.search(r"not a bear", panda, re.I)
    assert re.search(r"raccoon", panda, re.I)
    assert re.search(r"salamander", axolotl, re.I)
    assert re.search(r"gills", axolotl, re.I)
    assert re.search(r"not a fish", axolotl, re.I)
    assert re.search(r"dust", chinchilla, re.I)
    assert re.search(r"wheek", guinea, re.I)
    assert re.search(r"porcupine", hedgehog, re.I)
    assert re.search(r"quills that stay", hedgehog, re.I)
    assert re.search(r"not a rodent", rabbit, re.I)
    assert re.search(r"not a koi", goldfish, re.I)
    assert re.search(r"white tip", fox, re.I)
    assert re.search(r"puffin", penguin, re.I)
    assert re.search(r"not a Komodo", dragon, re.I)


def test_the_important_den_mixups_are_actually_taught():
    milk = _taught(plaque_for("milk_snake"))
    ball = _taught(plaque_for("ball_python"))
    king = _taught(plaque_for("kingsnake"))
    boa = _taught(plaque_for("boa"))
    assert re.search(r"coral snake", milk, re.I)
    assert re.search(r"red against yellow", milk, re.I)
    assert re.search(r"red against black", milk, re.I)
    assert re.search(r"boa", ball, re.I)
    assert re.search(r"ball python|Nori", boa, re.I)
    assert re.search(r"coral snake", king, re.I)
    assert re.search(r"no red", king, re.I)


def test_the_important_tide_mixups_are_actually_taught():
    jelly = _taught(plaque_for("moon_jelly"))
    star = _taught(plaque_for("sea_star"))
    horseshoe = _taught(plaque_for("horseshoe_crab"))
    moray = _taught(plaque_for("moray"))
    assert re.search(r"not a fish", jelly, re.I)
    assert re.search(r"not a fish", star, re.I)
    assert re.search(r"not a crab", horseshoe, re.I)
    assert re.search(r"book-gills", horseshoe, re.I)
    assert re.search(r"gape is breath", moray, re.I)


def test_the_important_garden_mixups_are_actually_taught():
    moss = _taught(plaque_for("moss"))
    fern = _taught(plaque_for("maidenhair"))
    ginkgo = _taught(plaque_for("ginkgo"))
    flytrap = _taught(plaque_for("venus_flytrap"))
    pitcher = _taught(plaque_for("pitcher"))
    sundew = _taught(plaque_for("sundew"))
    saguaro = _taught(plaque_for("saguaro"))
    assert re.search(r"no flower", moss, re.I)
    assert re.search(r"not a lichen", moss, re.I)
    assert re.search(r"not a flowering plant", fern, re.I)
    assert re.search(r"not a flowering plant", ginkgo, re.I)
    assert re.search(r"not a monster", flytrap, re.I)
    assert re.search(r"two hairs", flytrap, re.I)
    assert re.search(r"snap", flytrap, re.I)
    assert re.search(r"well", pitcher, re.I)
    assert re.search(r"drown", pitcher, re.I)
    assert re.search(r"not a flytrap", pitcher, re.I)
    assert re.search(r"glue", sundew, re.I)
    assert re.search(r"curl", sundew, re.I)
    assert re.search(r"not a flytrap", sundew, re.I)
    assert re.search(r"not a tree", saguaro, re.I)
    assert re.search(r"cactus", saguaro, re.I)


def _slice_entry(src: str, key: str, next_key: str | None) -> str:
    start = src.index(f'"{key}"')
    end = src.index(f'"{next_key}"') if next_key else len(src)
    return src[start:end]


def test_pyqt_guide_copy_matches_the_web_field_notes():
    house_src = (WEB_PETS / "house-guide.ts").read_text(encoding="utf-8")
    snake_src = (WEB_PETS / "snake-guide.ts").read_text(encoding="utf-8")
    sea_src = (WEB_PETS / "sea-guide.ts").read_text(encoding="utf-8")
    garden_src = (WEB_PETS / "garden-guide.ts").read_text(encoding="utf-8")
    house_keys = [key for key, _, _ in HOUSE_EXPECTED]
    snake_keys = [key for key, _, _ in SNAKE_EXPECTED]
    sea_keys = [key for key, _, _ in SEA_EXPECTED]
    garden_keys = [key for key, _, _ in GARDEN_EXPECTED]
    for index, (key, _slug, latin) in enumerate(HOUSE_EXPECTED):
        nxt = house_keys[index + 1] if index + 1 < len(house_keys) else None
        chunk = _slice_entry(house_src, key, nxt)
        guide = plaque_for(key)
        assert latin in chunk
        assert guide.tell in chunk
        assert guide.mixup in chunk
        assert guide.lesson in chunk
    for index, (key, _slug, latin) in enumerate(SNAKE_EXPECTED):
        nxt = snake_keys[index + 1] if index + 1 < len(snake_keys) else None
        chunk = _slice_entry(snake_src, key, nxt)
        guide = plaque_for(key)
        assert latin in chunk
        assert guide.tell in chunk
        assert guide.mixup in chunk
        assert guide.lesson in chunk
    for index, (key, _slug, latin) in enumerate(SEA_EXPECTED):
        nxt = sea_keys[index + 1] if index + 1 < len(sea_keys) else None
        chunk = _slice_entry(sea_src, key, nxt)
        guide = plaque_for(key)
        assert latin in chunk
        assert guide.tell in chunk
        assert guide.mixup in chunk
        assert guide.lesson in chunk
    for index, (key, _slug, latin) in enumerate(GARDEN_EXPECTED):
        nxt = garden_keys[index + 1] if index + 1 < len(garden_keys) else None
        chunk = _slice_entry(garden_src, key, nxt)
        guide = plaque_for(key)
        assert latin in chunk
        assert guide.tell in chunk
        assert guide.mixup in chunk
        assert guide.lesson in chunk


def test_plaque_widget_teaches_the_selected_species():
    os.environ["QT_QPA_PLATFORM"] = "offscreen"
    from PyQt6.QtWidgets import QApplication

    from computerpets_client.plaque import SpeciesPlaque

    app = QApplication.instance() or QApplication([])
    card = SpeciesPlaque()
    card.set_key("red_panda")
    assert card.guide() is plaque_for("red_panda")
    assert "Ailurus fulgens" in card.latin.text()
    assert "not a bear" in card.mixup.text().lower()
    assert "Red panda" in card.lesson.text()
    card.set_key("milk_snake")
    assert card.guide().key == "milk_snake"
    assert "red against black" in card.mixup.text().lower()
    assert "crawl" in card.classroom.text().lower()
    card.set_key("horseshoe_crab")
    assert card.guide().key == "horseshoe_crab"
    assert "not a crab" in card.mixup.text().lower()
    assert "swim" in card.classroom.text().lower()
    card.set_key("saguaro")
    assert card.guide().key == "saguaro"
    assert "not a tree" in card.mixup.text().lower()
    assert "grow" in card.classroom.text().lower()
    del app


def test_desk_window_plaque_follows_rail_and_guest_tap():
    os.environ["QT_QPA_PLATFORM"] = "offscreen"
    from PyQt6.QtWidgets import QApplication

    from computerpets_client.app import DeskWindow

    app = QApplication.instance() or QApplication([])
    window = DeskWindow()
    assert window.plaque.guide() is plaque_for("red_panda")
    window._pick_key("axolotl")
    assert window.species.key == "axolotl"
    assert window.plaque.guide().key == "axolotl"
    assert "gills" in window.plaque.tell.text().lower()
    window._tap_guest()
    assert "salamander" in window.bubble.toPlainText().lower()
    window._pick_key("kingsnake")
    assert window.plaque.guide().latin == "Lampropeltis californiae"
    assert "no red" in window.plaque.mixup.text().lower()
    window.close()
    del app
