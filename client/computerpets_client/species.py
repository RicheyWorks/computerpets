"""First-cut living kinds. Rui is required; Miso and Pip reuse the same painter."""

from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(frozen=True)
class Palette:
    body: tuple[int, int, int]
    belly: tuple[int, int, int]
    ear: tuple[int, int, int]
    ear_inner: tuple[int, int, int]
    nose: tuple[int, int, int]
    ring: tuple[int, int, int]
    accent: tuple[int, int, int]


@dataclass(frozen=True)
class Species:
    key: str
    slug: str
    name: str
    label: str
    treat: str
    treat_shape: str
    silhouette: str
    palette: Palette
    greet: tuple[str, ...]
    ambient: tuple[str, ...]
    feed: tuple[str, ...]
    treat_lines: tuple[str, ...]
    hide: tuple[str, ...]
    call: tuple[str, ...]
    hungry: tuple[str, ...]
    fps: dict[str, float] = field(default_factory=dict)


RUI = Species(
    key="red_panda",
    slug="rui",
    name="Rui",
    label="Red Panda",
    treat="Bamboo",
    treat_shape="bamboo",
    silhouette="panda",
    palette=Palette(
        body=(196, 92, 58),
        belly=(236, 214, 186),
        ear=(48, 32, 28),
        ear_inner=(232, 196, 168),
        nose=(36, 24, 22),
        ring=(236, 214, 186),
        accent=(120, 48, 36),
    ),
    greet=(
        "You came back. The desk was almost lonely.",
        "I saved you a corner of the blotter.",
        "Hello. I have been practicing sitting.",
    ),
    ambient=(
        "The lamp is humming. I like that sound.",
        "There is a beetle. No — it is your cursor.",
        "I put a ribbon somewhere safer. You will find it.",
        "Rain on the glass. Good napping weather.",
    ),
    feed=(
        "Bamboo-adjacent. I accept this treaty.",
        "One more bite. For science.",
        "Warm. I will remember this kindness.",
    ),
    treat_lines=("A small treaty.", "Bamboo. Official.", "I will remember this kindness."),
    hide=("I went where the ribbon goes.", "The drawer is closed. By me."),
    call=("You found me. The blotter is still mine.", "I walked back. The lamp approved."),
    hungry=("The books are not edible. I checked.", "A small snack would improve my philosophy."),
    fps={"idle": 3.2, "walk": 7.5, "sit": 2.4, "eat": 4.4, "sleep": 2.0},
)

MISO = Species(
    key="cat",
    slug="miso",
    name="Miso",
    label="Cat",
    treat="Crumbs",
    treat_shape="crumb",
    silhouette="cat",
    palette=Palette(
        body=(196, 168, 132),
        belly=(236, 224, 208),
        ear=(168, 132, 96),
        ear_inner=(232, 196, 176),
        nose=(80, 48, 48),
        ring=(120, 88, 64),
        accent=(88, 64, 48),
    ),
    greet=("You may sit. Not there. There.", "I noticed you. That is the whole announcement."),
    ambient=("I was using that sun.", "Your cursor is loud.", "The ledge is correct."),
    feed=("Acceptable. Barely.", "I will allow this treaty."),
    treat_lines=("A crumb. Considered.", "I will not thank you twice."),
    hide=("The ledge is closed.", "I waited by the door that is not here."),
    call=("You may look. I was never gone.", "The sun moved. You may stay anyway."),
    hungry=("The books are not food. I checked, once.",),
    fps={"idle": 2.8, "walk": 6.4, "sit": 2.2, "eat": 3.8, "sleep": 1.8},
)

PIP = Species(
    key="dog",
    slug="pip",
    name="Pip",
    label="Dog",
    treat="Biscuit",
    treat_shape="crumb",
    silhouette="dog",
    palette=Palette(
        body=(184, 132, 80),
        belly=(232, 208, 168),
        ear=(120, 80, 48),
        ear_inner=(208, 168, 120),
        nose=(40, 28, 24),
        ring=(232, 208, 168),
        accent=(96, 64, 40),
    ),
    greet=("You came back. I kept the rug warm.", "Hello. I brought the whole heart."),
    ambient=("The cursor moved. I have prepared a walk.", "I will follow. You do not have to ask."),
    feed=("This is a treaty. I accept all of it.", "Warm. I will stay closer."),
    treat_lines=("A biscuit. Lawful.", "One more. For the walk later."),
    hide=("I waited by the door that is not here.", "Gone. Softly. I can wait."),
    call=("You came back. I kept the rug warm.", "I have been practicing sitting still."),
    hungry=("I have considered the keyboard. It is not food. Sadly.",),
    fps={"idle": 2.8, "walk": 6.8, "sit": 2.2, "eat": 3.8, "sleep": 1.8},
)

SPECIES: dict[str, Species] = {s.key: s for s in (RUI, MISO, PIP)}
DEFAULT_SPECIES_KEY = "red_panda"


def species_by_key(key: str | None) -> Species:
    if key and key in SPECIES:
        return SPECIES[key]
    return RUI
