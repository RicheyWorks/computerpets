"""Species-true idle acts — same map as web ``ethogram.ts`` and Electron ``ethogram.js``."""

from __future__ import annotations

import math
import random
from typing import TypedDict

from .species import SNAKE_KEYS


class IdleAct(TypedDict, total=False):
    name: str
    motion: str
    hold: float
    weight: float
    anim: str


def _a(name: str, motion: str, hold: float, weight: float, anim: str | None = None) -> IdleAct:
    act: IdleAct = {"name": name, "motion": motion, "hold": hold, "weight": weight}
    if anim:
        act["anim"] = anim
    return act


_PREEN: tuple[IdleAct, ...] = (
    _a("preen", "groom", 1.4, 3, "sit"),
    _a("hop_step", "hop", 0.5, 2, "play"),
    _a("wings", "pulse", 0.7, 1, "play"),
)

ETHOGRAM: dict[str, tuple[IdleAct, ...]] = {
    "dog": (_a("wait", "sit_hold", 2.0, 4, "sit"), _a("wag_soft", "wiggle", 1.0, 3, "play"), _a("sniff_soft", "bob", 0.9, 2, "sit"), _a("bow_soft", "stretch", 1.0, 2, "sit"), _a("zoom_soft", "hop", 0.8, 2, "play"), _a("beg_soft", "rise", 0.8, 2, "sit"), _a("pant_soft", "nod", 0.8, 2, "sit"), _a("scratch", "scratch", 1.1, 2, "sit")),
    "cat": (_a("loaf", "sit_hold", 2.0, 4, "sit"), _a("knead_soft", "wiggle", 1.0, 3, "play"), _a("wash_soft", "groom", 0.9, 2, "sit"), _a("pounce_soft", "hop", 0.8, 2, "play"), _a("bunting_soft", "bob", 0.8, 2, "sit"), _a("mlem_soft", "nod", 0.8, 2, "sit"), _a("scratch", "scratch", 1.1, 2, "sit"), _a("alert", "freeze", 1.6, 2, "sit")),
    "fox": (_a("den", "sit_hold", 2.0, 4, "sit"), _a("mouser_soft", "hop", 1.0, 3, "play"), _a("stalk_soft", "bob", 0.9, 2, "sit"), _a("trot_soft", "wiggle", 0.8, 2, "play"), _a("prance_soft", "hop", 0.8, 2, "play"), _a("cock_soft", "nod", 0.9, 2, "sit"), _a("stash_soft", "wiggle", 0.8, 2, "sit"), _a("freeze", "freeze", 1.4, 2)),
    "red_panda": (_a("groom", "groom", 1.5, 3, "sit"), _a("scratch", "scratch", 1.1, 2, "sit"), _a("steal_dart", "dart", 1.2, 2), _a("wash", "groom", 1.3, 2, "sit")),
    "rabbit": (_a("flop", "sit_hold", 2.0, 4, "sit"), _a("groom_soft", "groom", 1.0, 3, "sit"), _a("peri_soft", "rise", 0.9, 2, "sit"), _a("dig_soft", "wiggle", 0.9, 2, "sit"), _a("binky_soft", "hop", 0.8, 2, "play"), _a("rub_soft", "lean", 0.8, 2, "sit"), _a("nosh_soft", "eat", 0.8, 2, "eat"), _a("freeze", "freeze", 1.4, 2)),
    "hamster": (_a("nest", "sit_hold", 2.0, 4, "sit"), _a("cheek_soft", "wiggle", 1.0, 3, "sit"), _a("scurry_soft", "dart", 0.8, 2, "play"), _a("pocket_soft", "lean", 0.9, 2, "sit"), _a("reel_soft", "hop", 0.8, 2, "play"), _a("scrub_soft", "groom", 0.9, 2, "sit"), _a("seed_soft", "eat", 0.8, 2, "eat"), _a("freeze", "freeze", 1.4, 2)),

    "guinea_pig": (_a("potato", "sit_hold", 2.0, 4, "sit"), _a("hay_soft", "eat", 1.0, 3, "eat"), _a("rumble_soft", "wiggle", 0.9, 2, "sit"), _a("popcorn_soft", "hop", 0.8, 2, "play"), _a("zig_soft", "dart", 0.8, 2, "play"), _a("lookout_soft", "rise", 0.9, 2, "sit"), _a("teeth_soft", "talk", 0.8, 2, "talk"), _a("freeze", "freeze", 1.4, 2)),
    "ferret": (_a("tube", "sit_hold", 2.0, 4, "sit"), _a("romp_soft", "hop", 1.0, 3, "play"), _a("steal_soft", "walk", 0.9, 2, "sit"), _a("puff_soft", "sit", 0.8, 2, "sit"), _a("noodle_soft", "wiggle", 0.8, 2, "play"), _a("corkscrew_soft", "hop", 0.9, 2, "play"), _a("slink_soft", "walk", 0.8, 2, "sit"), _a("freeze", "freeze", 1.4, 2)),
    "hedgehog": (_a("curl", "sit_hold", 2.0, 4, "sit"), _a("snuffle_soft", "wiggle", 1.0, 3, "sit"), _a("anoint_soft", "sit", 0.9, 2, "sit"), _a("bristle_soft", "sit", 0.8, 2, "sit"), _a("root_soft", "play", 0.9, 2, "play"), _a("trundle_soft", "walk", 0.9, 2, "sit"), _a("wheel_soft", "hop", 1.0, 2, "play"), _a("freeze", "freeze", 1.4, 2)),
    "chinchilla": (_a("ash", "sit_hold", 2.0, 4, "sit"), _a("bound_soft", "hop", 1.0, 3, "play"), _a("fluff_soft", "groom", 0.9, 2, "sit"), _a("chin_soft", "sit", 0.9, 2, "sit"), _a("sift_soft", "shake", 0.9, 2, "play"), _a("ricochet_soft", "hop", 1.0, 2, "play"), _a("gnaw_soft", "sit", 0.9, 2, "sit"), _a("freeze", "freeze", 1.4, 2)),
    "turtle": (_a("soak", "sit_hold", 2.0, 4, "sit"), _a("tuck_soft", "curl", 1.0, 3, "sit"), _a("crane_soft", "rise", 0.9, 2, "sit"), _a("plod_soft", "dart", 0.8, 2, "play"), _a("paddle_soft", "wiggle", 0.8, 2, "play"), _a("snorkel_soft", "rise", 0.9, 2, "sit"), _a("wipe_soft", "groom", 0.8, 2, "sit"), _a("freeze", "freeze", 1.4, 2)),
    "iguana": (_a("sun", "sit_hold", 2.2, 4, "sit"), _a("dewlap_soft", "sit", 1.0, 3, "sit"), _a("nod_soft", "bob", 1.0, 2, "talk"), _a("press_soft", "play", 1.0, 2, "play"), _a("flick_soft", "sit", 0.9, 2, "sit"), _a("sneeze_soft", "sit", 0.9, 2, "sit"), _a("lash_soft", "shake", 1.0, 2, "play"), _a("freeze", "freeze", 1.4, 2)),
    "dragon": (_a("sprawl", "sit_hold", 2.4, 4, "sit"), _a("guard_soft", "sit", 1.0, 3, "sit"), _a("smolder_soft", "pulse", 1.0, 2, "sit"), _a("claim_soft", "play", 1.0, 2, "play"), _a("fold_soft", "play", 0.9, 2, "sit"), _a("ruff_soft", "sit", 0.9, 2, "talk"), _a("scrape_soft", "scratch", 1.0, 2, "play"), _a("freeze", "freeze", 1.4, 2)),
    "axolotl": (_a("gill", "sit_hold", 2.0, 4, "sit"), _a("amble_soft", "walk", 1.0, 3, "play"), _a("mend_soft", "sit", 0.9, 2, "sit"), _a("smile_soft", "sit", 0.9, 2, "sit"), _a("plume_soft", "shake", 0.9, 2, "play"), _a("sprout_soft", "play", 1.0, 2, "play"), _a("glop_soft", "sit", 0.9, 2, "sit"), _a("freeze", "freeze", 1.4, 2)),
    "budgie": (_a("preen", "groom", 1.4, 4, "sit"), _a("bobble_soft", "bob", 0.9, 3, "sit"), _a("mimic_soft", "talk", 0.8, 3, "talk"), _a("sidle_soft", "hop", 0.6, 2, "play"), _a("dangle_soft", "pulse", 0.7, 2, "play"), _a("beakgrind_soft", "sit_hold", 1.2, 2, "sit"), _a("alert", "freeze", 1.6, 2, "sit"), _a("loaf", "sit_hold", 2.4, 2, "sit")),
    "parrot": (_a("quote", "talk", 2.0, 4, "talk"), _a("strut_soft", "wiggle", 1.0, 3, "play"), _a("pectoral_soft", "pulse", 0.9, 3, "play"), _a("crack_soft", "nod", 0.9, 2, "sit"), _a("flash_soft", "hop", 0.8, 2, "play"), _a("pineye_soft", "bob", 0.8, 2, "sit"), _a("alert", "freeze", 1.6, 2, "sit"), _a("loaf", "sit_hold", 2.4, 2, "sit")),
    "toucan": (_a("roost", "sit_hold", 2.0, 4, "sit"), _a("berry_soft", "nod", 1.0, 3, "sit"), _a("juggle_soft", "pulse", 0.9, 3, "play"), _a("peer_soft", "bob", 0.9, 2, "sit"), _a("skip_soft", "hop", 0.8, 2, "play"), _a("rattle_soft", "talk", 0.8, 2, "talk"), _a("alert", "freeze", 1.6, 2, "sit"), _a("loaf", "sit_hold", 2.4, 2, "sit")),
    "phoenix": (_a("cinder", "sit_hold", 2.0, 4, "sit"), _a("blaze_soft", "pulse", 1.0, 3, "play"), _a("shed_soft", "wiggle", 0.9, 3, "play"), _a("lift_soft", "pulse", 0.9, 2, "play"), _a("return_soft", "bob", 0.9, 2, "sit"), _a("reignite_soft", "talk", 0.8, 2, "talk"), _a("alert", "freeze", 1.6, 2, "sit"), _a("loaf", "sit_hold", 2.4, 2, "sit")),
    "penguin": (_a("huddle", "sit_hold", 2.0, 4, "sit"), _a("toboggan_soft", "pulse", 1.0, 3, "play"), _a("waddle_soft", "wiggle", 1.0, 3, "play"), _a("porpoise_soft", "pulse", 0.9, 2, "play"), _a("trumpet_soft", "talk", 0.9, 3, "talk"), _a("rockhop_soft", "hop", 0.8, 2, "play"), _a("alert", "freeze", 1.6, 2, "sit"), _a("loaf", "sit_hold", 2.4, 2, "sit")),
    "goldfish": (_a("drift", "sit_hold", 2.0, 4, "sit"), _a("gulp_soft", "gulp", 1.0, 3, "talk"), _a("flare_soft", "pulse", 0.9, 2, "play"), _a("glint_soft", "lean", 0.8, 2, "sit"), _a("dart_soft", "dart", 0.8, 2, "play"), _a("yawn_soft", "yawn", 0.9, 2, "sit"), _a("forage_soft", "eat", 0.8, 2, "eat"), _a("freeze", "freeze", 1.4, 2)),
    "ball_python": (_a("tongue", "tongue", 0.7, 4), _a("orb", "sit_hold", 2.4, 4, "sit"), _a("nook_soft", "sit", 1.0, 3, "sit"), _a("inch_soft", "play", 1.0, 2, "play"), _a("loom_soft", "sit", 0.9, 2, "talk"), _a("weave_soft", "play", 1.0, 2, "play"), _a("gape_soft", "gape", 1.0, 1, "sit"), _a("freeze", "freeze", 1.4, 2)),
    "corn_snake": (_a("tongue", "tongue", 0.7, 4), _a("comma", "sit_hold", 2.4, 4, "sit"), _a("gap_soft", "sit", 1.0, 3, "sit"), _a("probe_soft", "tongue", 1.0, 2, "talk"), _a("scribble_soft", "play", 1.0, 2, "play"), _a("canyon_soft", "play", 0.9, 2, "play"), _a("blotter_soft", "sit", 0.9, 2, "talk"), _a("pencil_soft", "play", 1.0, 2, "play"), _a("freeze", "freeze", 1.4, 2)),
    "kingsnake": (_a("tongue", "tongue", 0.7, 4), _a("verdict", "sit_hold", 2.4, 4, "sit"), _a("audit_soft", "sit", 1.0, 3, "sit"), _a("stripe_soft", "play", 1.0, 2, "play"), _a("plumb_soft", "sit", 0.9, 2, "talk"), _a("raid_soft", "play", 1.0, 2, "play"), _a("band_soft", "play", 1.0, 2, "play"), _a("drawer_soft", "sit", 0.9, 2, "talk"), _a("freeze", "freeze", 1.4, 2)),
    "green_tree_python": (_a("tongue", "tongue", 0.7, 4), _a("bracelet", "sit_hold", 2.6, 4, "sit"), _a("sway_soft", "play", 1.0, 3, "play"), _a("jewel_soft", "sit", 1.0, 2, "sit"), _a("heat_soft", "sit", 0.9, 2, "talk"), _a("bough_soft", "play", 1.0, 2, "play"), _a("liana_soft", "play", 1.0, 2, "play"), _a("arbor_soft", "sit", 0.9, 2, "talk"), _a("freeze", "freeze", 1.4, 2)),
    "hognose": (_a("tongue", "tongue", 0.7, 4), _a("flatten", "sit_hold", 2.4, 4, "sit"), _a("playdead", "sit_hold", 2.2, 3, "sit"), _a("gape", "gape", 1.2, 2, "talk"), _a("shovel_soft", "sit", 1.0, 2, "talk"), _a("encore_soft", "play", 1.0, 2, "play"), _a("quiver_soft", "play", 1.0, 2, "play"), _a("upright_soft", "sit", 0.9, 2, "sit"), _a("freeze", "freeze", 1.4, 2)),
    "garter": (_a("tongue", "tongue", 0.7, 4), _a("seam", "sit_hold", 2.4, 4, "sit"), _a("rounds_soft", "wiggle", 1.0, 2), _a("moss_soft", "sit", 1.0, 2, "sit"), _a("fork_soft", "talk", 0.9, 2, "talk"), _a("ribbon_soft", "play", 1.0, 2, "play"), _a("creek_soft", "wiggle", 1.1, 2), _a("freeze", "freeze", 1.4, 2)),
    "boa": (_a("tongue", "tongue", 0.7, 4), _a("hold", "sit_hold", 2.8, 4, "sit"), _a("pour_soft", "sit", 1.1, 2, "sit"), _a("heft_soft", "sit", 1.0, 2, "sit"), _a("oxbow_soft", "wiggle", 1.1, 2), _a("anchor_soft", "sit", 1.2, 2, "sit"), _a("meander_soft", "wiggle", 1.15, 2), _a("freeze", "freeze", 1.5, 2)),
    "milk_snake": (_a("tongue", "tongue", 0.7, 4), _a("rhyme", "sit_hold", 2.4, 4, "sit"), _a("rumor_soft", "talk", 1.0, 2, "talk"), _a("costume_soft", "sit", 1.0, 2, "sit"), _a("cipher_soft", "sit", 1.1, 2, "sit"), _a("verse_soft", "talk", 1.05, 2, "talk"), _a("tile_soft", "play", 1.0, 2, "play"), _a("freeze", "freeze", 1.4, 2)),
    "rosy_boa": (_a("tongue", "tongue", 0.7, 4), _a("pebble", "sit_hold", 2.4, 4, "sit"), _a("crevice_soft", "wiggle", 1.0, 2), _a("rosy_soft", "play", 1.0, 2, "play"), _a("mesa_soft", "sit", 1.0, 2, "sit"), _a("dune_soft", "walk", 1.1, 2), _a("talus_soft", "sit", 1.05, 2, "sit"), _a("freeze", "freeze", 1.4, 2)),
    "carpet_python": (_a("tongue", "tongue", 0.7, 4), _a("legend", "sit_hold", 2.4, 4, "sit"), _a("rung_soft", "play", 1.0, 2, "play"), _a("contour_soft", "walk", 1.1, 2), _a("runner_soft", "walk", 1.0, 2), _a("canopy_soft", "play", 1.15, 2, "play"), _a("inset_soft", "sit", 1.05, 2, "sit"), _a("freeze", "freeze", 1.4, 2)),
    "octopus": (_a("hide", "sit_hold", 2.4, 4, "sit"), _a("sucker_soft", "walk", 1.1, 2), _a("jet_soft", "dart", 1.0, 2), _a("veil_soft", "play", 1.15, 2, "play"), _a("tinker_soft", "play", 1.1, 2, "play"), _a("papilla_soft", "sit", 1.2, 2, "sit"), _a("ooze_soft", "walk", 1.15, 2), _a("freeze", "freeze", 1.4, 2)),
    "cuttlefish": (_a("hide", "sit_hold", 2.4, 4, "sit"), _a("pupil_soft", "talk", 1.1, 2, "talk"), _a("chroma_soft", "play", 1.15, 2, "play"), _a("hover_soft", "walk", 1.1, 2), _a("blot_soft", "play", 1.15, 2, "play"), _a("strike_soft", "walk", 1.0, 2), _a("zebra_soft", "play", 1.2, 2, "play"), _a("freeze", "freeze", 1.4, 2)),
    "nautilus": (_a("hide", "sit_hold", 2.4, 4, "sit"), _a("siphuncle_soft", "walk", 1.1, 2), _a("nacre_soft", "sit", 1.15, 2, "sit"), _a("pinhole_soft", "talk", 1.1, 2, "talk"), _a("fringe_soft", "play", 1.15, 2, "play"), _a("hyponome_soft", "walk", 1.0, 2), _a("aperture_soft", "play", 1.2, 2, "play"), _a("freeze", "freeze", 1.4, 2)),
    "moon_jelly": (_a("hide", "sit_hold", 2.4, 4, "sit"), _a("oral_soft", "talk", 1.1, 2, "talk"), _a("lucent_soft", "sit", 1.15, 2, "sit"), _a("trail_soft", "play", 1.15, 2, "play"), _a("medusa_soft", "walk", 1.1, 2), _a("rhopalium_soft", "talk", 1.1, 2, "talk"), _a("horseshoe_soft", "play", 1.2, 2, "play"), _a("freeze", "freeze", 1.4, 2)),
    "sea_star": (_a("cling", "sit_hold", 2.4, 4, "sit"), _a("righting_soft", "play", 1.15, 2, "play"), _a("crawl_soft", "walk", 1.1, 2), _a("evert_soft", "talk", 1.1, 2, "talk"), _a("penta_soft", "sit", 1.15, 2, "sit"), _a("madre_soft", "talk", 1.1, 2, "talk"), _a("papula_soft", "play", 1.2, 2, "play"), _a("freeze", "freeze", 1.4, 2)),
    "hermit_crab": (_a("withdraw", "sit_hold", 2.4, 4, "sit"), _a("swap_soft", "play", 1.15, 2, "play"), _a("antenna_soft", "talk", 1.1, 2, "talk"), _a("scuttle_soft", "walk", 1.1, 2), _a("vacancy_soft", "walk", 1.15, 2), _a("chela_soft", "play", 1.2, 2, "play"), _a("bailer_soft", "talk", 1.1, 2, "talk"), _a("freeze", "freeze", 1.4, 2)),
    "horseshoe_crab": (_a("carapace", "sit_hold", 2.4, 4, "sit"), _a("bookgill_soft", "talk", 1.15, 2, "talk"), _a("telson_soft", "play", 1.2, 2, "play"), _a("furrow_soft", "walk", 1.15, 2), _a("fossil_soft", "sit", 1.2, 2, "sit"), _a("pusher_soft", "walk", 1.2, 2), _a("ocular_soft", "talk", 1.15, 2, "talk"), _a("freeze", "freeze", 1.4, 2)),
    "seahorse": (_a("coil", "sit_hold", 2.4, 4, "sit"), _a("buoy_soft", "play", 1.15, 2, "play"), _a("siphon_soft", "talk", 1.2, 2, "talk"), _a("swivel_soft", "talk", 1.15, 2, "talk"), _a("pouch_soft", "sit", 1.2, 2, "sit"), _a("dorsal_soft", "walk", 1.2, 2), _a("pectoral_soft", "talk", 1.15, 2, "talk"), _a("freeze", "freeze", 1.4, 2)),
    "manta": (_a("span", "sit_hold", 2.4, 4, "sit"), _a("wing_soft", "walk", 1.15, 2), _a("lobe_soft", "talk", 1.2, 2, "talk"), _a("gyre_soft", "play", 1.2, 2, "play"), _a("vault_soft", "play", 1.15, 2, "play"), _a("breach_soft", "play", 1.25, 2, "play"), _a("ram_soft", "talk", 1.2, 2, "talk"), _a("freeze", "freeze", 1.4, 2)),
    "moray": (_a("jamb", "sit_hold", 2.4, 4, "sit"), _a("hinge_soft", "talk", 1.2, 2, "talk"), _a("pharynx_soft", "play", 1.15, 2, "play"), _a("knot_soft", "play", 1.2, 2, "play"), _a("lurk_soft", "talk", 1.15, 2, "talk"), _a("mucus_soft", "sit", 1.2, 2, "sit"), _a("sentry_soft", "talk", 1.15, 2, "talk"), _a("freeze", "freeze", 1.4, 2)),
    "moss": (_a("thatch", "sit_hold", 2.4, 4, "sit"), _a("tuft_soft", "talk", 1.2, 2, "talk"), _a("bead_soft", "talk", 1.15, 2, "talk"), _a("spore_soft", "play", 1.2, 2, "play"), _a("cushion_soft", "sit", 1.2, 2, "sit"), _a("rhizoid_soft", "sit", 1.15, 2, "sit"), _a("seta_soft", "play", 1.2, 2, "play"), _a("freeze", "freeze", 1.4, 2)),
    "maidenhair": (_a("saucer", "sit_hold", 2.4, 4, "sit"), _a("frond_soft", "sit", 1.2, 2, "sit"), _a("rachis_soft", "talk", 1.15, 2, "talk"), _a("fiddle_soft", "play", 1.2, 2, "play"), _a("pinna_soft", "talk", 1.15, 2, "talk"), _a("sori_soft", "play", 1.2, 2, "play"), _a("bulb_soft", "talk", 1.15, 2, "talk"), _a("freeze", "freeze", 1.4, 2)),
    "ginkgo": (_a("amber", "sit_hold", 2.4, 4, "sit"), _a("biloba_soft", "sit", 1.2, 2, "sit"), _a("notch_soft", "talk", 1.15, 2, "talk"), _a("flutter_soft", "play", 1.2, 2, "play"), _a("drop_soft", "talk", 1.15, 2, "talk"), _a("dichotomy_soft", "play", 1.2, 2, "play"), _a("petiole_soft", "talk", 1.15, 2, "talk"), _a("freeze", "freeze", 1.4, 2)),
    "oak": (_a("bole", "sit_hold", 2.4, 4, "sit"), _a("acorn_soft", "talk", 1.15, 2, "talk"), _a("sinus_soft", "sit", 1.2, 2, "sit"), _a("gall_soft", "talk", 1.15, 2, "talk"), _a("taproot_soft", "play", 1.2, 2, "play"), _a("catkin_soft", "play", 1.2, 2, "play"), _a("tyloses_soft", "talk", 1.15, 2, "talk"), _a("freeze", "freeze", 1.4, 2)),
    "water_lily": (_a("sheen", "sit_hold", 2.4, 4, "sit"), _a("pad_soft", "sit", 1.2, 2, "sit"), _a("corolla_soft", "talk", 1.15, 2, "talk"), _a("rhizome_soft", "play", 1.2, 2, "play"), _a("calyx_soft", "talk", 1.15, 2, "talk"), _a("peltate_soft", "play", 1.2, 2, "play"), _a("hydropote_soft", "talk", 1.15, 2, "talk"), _a("freeze", "freeze", 1.4, 2)),
    "orchid": (_a("bark", "sit_hold", 2.4, 4, "sit"), _a("labellum_soft", "sit", 1.2, 2, "sit"), _a("velamen_soft", "play", 1.2, 2, "play"), _a("column_soft", "talk", 1.15, 2, "talk"), _a("spike_soft", "talk", 1.15, 2, "talk"), _a("keiki_soft", "play", 1.2, 2, "play"), _a("pollinia_soft", "talk", 1.15, 2, "talk"), _a("freeze", "freeze", 1.4, 2)),
    "saguaro": (_a("sentinel", "sit_hold", 2.4, 4, "sit"), _a("rib_soft", "sit", 1.2, 2, "sit"), _a("branch_soft", "play", 1.2, 2, "play"), _a("nocturne_soft", "talk", 1.15, 2, "talk"), _a("areole_soft", "sit", 1.2, 2, "sit"), _a("pleat_soft", "play", 1.2, 2, "play"), _a("boot_soft", "talk", 1.15, 2, "talk"), _a("freeze", "freeze", 1.4, 2)),
    "venus_flytrap": (_a("poise", "sit_hold", 2.4, 4, "sit"), _a("clamp_soft", "play", 1.2, 2, "play"), _a("trichome_soft", "sit", 1.2, 2, "sit"), _a("stew_soft", "sit", 1.2, 2, "sit"), _a("unseal_soft", "talk", 1.15, 2, "talk"), _a("cage_soft", "play", 1.2, 2, "play"), _a("scape_soft", "talk", 1.15, 2, "talk"), _a("freeze", "freeze", 1.4, 2)),
    "pitcher": (_a("urn", "sit_hold", 2.4, 4, "sit"), _a("peristome_soft", "play", 1.2, 2, "play"), _a("cistern_soft", "sit", 1.2, 2, "sit"), _a("brine_soft", "sit", 1.2, 2, "sit"), _a("operculum_soft", "talk", 1.15, 2, "talk"), _a("ala_soft", "play", 1.2, 2, "play"), _a("baffle_soft", "talk", 1.15, 2, "talk"), _a("freeze", "freeze", 1.4, 2)),
    "sundew": (_a("rosette", "sit_hold", 2.4, 4, "sit"), _a("mucilage_soft", "play", 1.2, 2, "play"), _a("tentacle_soft", "talk", 1.2, 2, "talk"), _a("digest_soft", "sit", 1.2, 2, "sit"), _a("gland_soft", "talk", 1.15, 2, "talk"), _a("lamina_soft", "play", 1.2, 2, "play"), _a("circinate_soft", "talk", 1.15, 2, "talk"), _a("freeze", "freeze", 1.4, 2)),
    "honeybee": (_a("hive", "sit_hold", 2.4, 4, "sit"), _a("figure_soft", "play", 1.2, 2, "play"), _a("corbicula_soft", "talk", 1.2, 2, "talk"), _a("hex_soft", "sit", 1.2, 2, "sit"), _a("proboscis_soft", "talk", 1.15, 2, "talk"), _a("ocelli_soft", "play", 1.2, 2, "play"), _a("nasonov_soft", "talk", 1.15, 2, "talk"), _a("freeze", "freeze", 1.4, 2)),
    "monarch": (_a("danaus", "sit_hold", 2.4, 4, "sit"), _a("asclepias_soft", "talk", 1.2, 2, "talk"), _a("oyamel_soft", "sit", 1.2, 2, "sit"), _a("warning_soft", "play", 1.2, 2, "play"), _a("chrysalis_soft", "sit", 1.2, 2, "sit"), _a("cremaster_soft", "talk", 1.15, 2, "talk"), _a("tarsus_soft", "play", 1.2, 2, "play"), _a("freeze", "freeze", 1.4, 2)),
    "luna": (_a("actias", "sit_hold", 2.4, 4, "sit"), _a("plumose_soft", "talk", 1.2, 2, "talk"), _a("lunule_soft", "play", 1.2, 2, "play"), _a("silk_soft", "sit", 1.2, 2, "sit"), _a("stream_soft", "sit", 1.2, 2, "sit"), _a("aphagy_soft", "talk", 1.15, 2, "talk"), _a("cauda_soft", "play", 1.2, 2, "play"), _a("freeze", "freeze", 1.4, 2)),
    "firefly": (_a("photinus", "sit_hold", 2.4, 4, "sit"), _a("lantern_soft", "play", 1.2, 2, "play"), _a("jstroke_soft", "sit", 1.2, 2, "sit"), _a("semaphore_soft", "talk", 1.2, 2, "talk"), _a("elytra_soft", "sit", 1.2, 2, "sit"), _a("photocyte_soft", "play", 1.2, 2, "play"), _a("sternite_soft", "talk", 1.15, 2, "talk"), _a("freeze", "freeze", 1.4, 2)),
    "darner": (_a("anax", "sit_hold", 2.4, 4, "sit"), _a("hawking_soft", "play", 1.2, 2, "play"), _a("tandem_soft", "sit", 1.2, 2, "sit"), _a("nymph_soft", "sit", 1.2, 2, "sit"), _a("whir_soft", "talk", 1.2, 2, "talk"), _a("obelisk_soft", "sit", 1.15, 2, "sit"), _a("ommatidia_soft", "talk", 1.2, 2, "talk"), _a("freeze", "freeze", 1.4, 2)),
    "stick": (_a("diapheromera", "sit_hold", 2.4, 4, "sit"), _a("rocking_soft", "sit", 1.2, 2, "sit"), _a("catalepsy_soft", "sit", 1.2, 2, "sit"), _a("browse_soft", "sit", 1.2, 2, "sit"), _a("tread_soft", "walk", 1.2, 2, "walk"), _a("oviposit_soft", "sit", 1.15, 2, "sit"), _a("filiform_soft", "talk", 1.2, 2, "talk"), _a("freeze", "freeze", 1.4, 2)),
    "carpenter_ant": (_a("camponotus", "sit_hold", 2.4, 4, "sit"), _a("gallery_soft", "sit", 1.2, 2, "sit"), _a("pheromone_soft", "walk", 1.2, 2, "walk"), _a("crumb_soft", "walk", 1.2, 2, "walk"), _a("bustle_soft", "walk", 1.2, 2, "walk"), _a("trophallaxis_soft", "talk", 1.15, 2, "talk"), _a("frass_soft", "sit", 1.2, 2, "sit"), _a("freeze", "freeze", 1.4, 2)),
    "ladybird": (_a("coccinella", "sit_hold", 2.4, 4, "sit"), _a("spots_soft", "sit", 1.2, 2, "sit"), _a("aphid_soft", "walk", 1.2, 2, "walk"), _a("reflex_soft", "sit", 1.15, 2, "sit"), _a("climb_soft", "walk", 1.2, 2, "walk"), _a("pronotum_soft", "sit", 1.2, 2, "sit"), _a("alar_soft", "play", 1.2, 2, "play"), _a("freeze", "freeze", 1.4, 2)),
    "mantis": (_a("mantodea", "sit_hold", 2.4, 4, "sit"), _a("raptorial_soft", "sit", 1.2, 2, "sit"), _a("gimbal_soft", "sit", 1.15, 2, "sit"), _a("snatch_soft", "play", 1.2, 2, "play"), _a("pendulum_soft", "sit", 1.2, 2, "sit"), _a("ootheca_soft", "sit", 1.2, 2, "sit"), _a("deimatic_soft", "play", 1.2, 2, "play"), _a("freeze", "freeze", 1.4, 2)),
    "cicada": (_a("magicicada", "sit_hold", 2.4, 4, "sit"), _a("tymbal_soft", "talk", 1.2, 2, "talk"), _a("cast_soft", "sit", 1.15, 2, "sit"), _a("egress_soft", "play", 1.2, 2, "play"), _a("harden_soft", "sit", 1.2, 2, "sit"), _a("xylem_soft", "sit", 1.2, 2, "sit"), _a("pharaoh_soft", "play", 1.2, 2, "play"), _a("freeze", "freeze", 1.4, 2)),
    "bumblebee": (_a("thrum", "pulse", 1.2, 4), _a("hover", "bob", 1.4, 2), _a("still", "freeze", 1.6, 1)),
    "carpenter_bee": (_a("hover", "bob", 1.4, 3), _a("bore", "sit_hold", 2.0, 3, "sit"), _a("still", "freeze", 1.6, 2)),
    "mason_bee": (_a("seal", "sit_hold", 1.8, 4, "sit"), _a("hover", "bob", 1.2, 2), _a("still", "freeze", 1.6, 2)),
    "leafcutter": (_a("cut", "nod", 1.2, 4, "sit"), _a("hover", "bob", 1.2, 2), _a("still", "freeze", 1.6, 2)),
    "stingless": (_a("pot", "sit_hold", 1.8, 4, "sit"), _a("hover", "bob", 1.2, 2), _a("still", "freeze", 1.4, 2)),
    "sweat_bee": (_a("shine", "pulse", 1.0, 4), _a("hover", "bob", 1.2, 2), _a("still", "freeze", 1.4, 2)),
    "mining_bee": (_a("dig", "sit_hold", 1.8, 4, "sit"), _a("hover", "bob", 1.2, 2), _a("still", "freeze", 1.6, 2)),
    "honey_drone": (_a("hum", "pulse", 1.4, 4), _a("hover", "bob", 1.6, 2), _a("still", "freeze", 2.0, 3)),
    "honey_queen": (_a("lay", "sit_hold", 2.2, 5, "sit"), _a("walk", "wiggle", 1.0, 1), _a("still", "freeze", 2.0, 2)),
    "honeycomb": (_a("tessera", "sit_hold", 2.4, 4, "sit"), _a("festoon_soft", "play", 1.2, 2, "play"), _a("capped_soft", "talk", 1.15, 2, "talk"), _a("midrib_soft", "talk", 1.2, 2, "talk"), _a("stores_soft", "sit", 1.2, 2, "sit"), _a("alveoli_soft", "sit", 1.2, 2, "sit"), _a("foundation_soft", "play", 1.2, 2, "play"), _a("freeze", "freeze", 1.4, 2)),
    "oyster": (_a("pleurotus", "sit_hold", 2.4, 4, "sit"), _a("lamella_soft", "play", 1.2, 2, "play"), _a("imbricate_soft", "talk", 1.15, 2, "talk"), _a("lasso_soft", "talk", 1.2, 2, "talk"), _a("margin_soft", "sit", 1.2, 2, "sit"), _a("sporulate_soft", "sit", 1.2, 2, "sit"), _a("hypha_soft", "play", 1.2, 2, "play"), _a("freeze", "freeze", 1.4, 2)),
    "fly_agaric": (_a("amanita", "sit_hold", 2.4, 4, "sit"), _a("annulus_soft", "play", 1.2, 2, "play"), _a("volva_soft", "talk", 1.15, 2, "talk"), _a("veil_soft", "talk", 1.2, 2, "talk"), _a("symbiont_soft", "sit", 1.2, 2, "sit"), _a("pileus_soft", "sit", 1.2, 2, "sit"), _a("bulb_soft", "play", 1.2, 2, "play"), _a("freeze", "freeze", 1.4, 2)),
    "morel": (_a("morchella", "sit_hold", 2.4, 4, "sit"), _a("alveolus_soft", "play", 1.2, 2, "play"), _a("ridge_soft", "talk", 1.15, 2, "talk"), _a("ephemeral_soft", "talk", 1.2, 2, "talk"), _a("sclerotium_soft", "sit", 1.2, 2, "sit"), _a("costa_soft", "sit", 1.2, 2, "sit"), _a("hymenium_soft", "play", 1.2, 2, "play"), _a("freeze", "freeze", 1.4, 2)),
    "chanterelle": (_a("cantharellus", "sit_hold", 2.4, 4, "sit"), _a("apricot_soft", "play", 1.2, 2, "play"), _a("funnel_soft", "talk", 1.15, 2, "talk"), _a("decurrent_soft", "talk", 1.2, 2, "talk"), _a("flute_soft", "sit", 1.2, 2, "sit"), _a("vase_soft", "sit", 1.2, 2, "sit"), _a("plica_soft", "play", 1.2, 2, "play"), _a("freeze", "freeze", 1.4, 2)),
    "turkey_tail": (_a("trametes", "sit_hold", 2.4, 4, "sit"), _a("pore_soft", "play", 1.2, 2, "play"), _a("bracket_soft", "talk", 1.15, 2, "talk"), _a("band_soft", "talk", 1.2, 2, "talk"), _a("leathery_soft", "sit", 1.2, 2, "sit"), _a("concentric_soft", "sit", 1.2, 2, "sit"), _a("tomentum_soft", "play", 1.2, 2, "play"), _a("freeze", "freeze", 1.4, 2)),
    "lions_mane": (_a("hericium", "sit_hold", 2.4, 4, "sit"), _a("spine_soft", "play", 1.2, 2, "play"), _a("icicle_soft", "talk", 1.15, 2, "talk"), _a("cascade_soft", "talk", 1.2, 2, "talk"), _a("wound_soft", "sit", 1.2, 2, "sit"), _a("pompon_soft", "sit", 1.2, 2, "sit"), _a("hydnoid_soft", "play", 1.2, 2, "play"), _a("freeze", "freeze", 1.4, 2)),
    "puffball": (_a("lycoperdon", "sit_hold", 2.4, 4, "sit"), _a("ostiole_soft", "play", 1.2, 2, "play"), _a("gleba_soft", "talk", 1.15, 2, "talk"), _a("peridium_soft", "talk", 1.2, 2, "talk"), _a("duff_soft", "sit", 1.2, 2, "sit"), _a("gemmate_soft", "sit", 1.2, 2, "sit"), _a("capillitium_soft", "play", 1.2, 2, "play"), _a("freeze", "freeze", 1.4, 2)),
    "chicken_of_woods": (_a("laetiporus", "sit_hold", 2.4, 4, "sit"), _a("sulfur_soft", "play", 1.2, 2, "play"), _a("rosette_soft", "talk", 1.15, 2, "talk"), _a("oak_soft", "talk", 1.2, 2, "talk"), _a("soft_soft", "sit", 1.2, 2, "sit"), _a("poroid_soft", "sit", 1.2, 2, "sit"), _a("cluster_soft", "play", 1.2, 2, "play"), _a("freeze", "freeze", 1.4, 2)),
    "yeast": (_a("saccharomyces", "sit_hold", 2.4, 4, "sit"), _a("bud_soft", "play", 1.2, 2, "play"), _a("proof_soft", "talk", 1.15, 2, "talk"), _a("levain_soft", "talk", 1.2, 2, "talk"), _a("ferment_soft", "sit", 1.2, 2, "sit"), _a("ascus_soft", "sit", 1.2, 2, "sit"), _a("floc_soft", "play", 1.2, 2, "play"), _a("freeze", "freeze", 1.4, 2)),
    "lichen": (_a("cladonia", "sit_hold", 2.4, 4, "sit"), _a("podetium_soft", "play", 1.2, 2, "play"), _a("photobiont_soft", "talk", 1.15, 2, "talk"), _a("fruticose_soft", "talk", 1.2, 2, "talk"), _a("stone_soft", "sit", 1.2, 2, "sit"), _a("soredia_soft", "sit", 1.2, 2, "sit"), _a("scyphi_soft", "play", 1.2, 2, "play"), _a("freeze", "freeze", 1.4, 2)),
    "photovore": (_a("photovore", "sit_hold", 2.4, 4, "sit"), _a("photon_soft", "play", 1.2, 2, "play"), _a("wavelength_soft", "talk", 1.15, 2, "talk"), _a("lumen_soft", "talk", 1.2, 2, "talk"), _a("glass_soft", "sit", 1.2, 2, "sit"), _a("opsin_soft", "sit", 1.2, 2, "sit"), _a("iridophore_soft", "play", 1.2, 2, "play"), _a("freeze", "freeze", 1.4, 2)),
    "choir": (_a("harmonia", "sit_hold", 2.4, 4, "sit"), _a("polyphony_soft", "play", 1.2, 2, "play"), _a("partial_soft", "talk", 1.15, 2, "talk"), _a("timbre_soft", "talk", 1.2, 2, "talk"), _a("resonance_soft", "sit", 1.2, 2, "sit"), _a("formant_soft", "sit", 1.2, 2, "sit"), _a("dyad_soft", "play", 1.2, 2, "play"), _a("freeze", "freeze", 1.4, 2)),
    "nimbus": (_a("stratus", "sit_hold", 2.4, 4, "sit"), _a("waft_soft", "play", 1.2, 2, "play"), _a("billow_soft", "talk", 1.15, 2, "talk"), _a("cirrus_soft", "talk", 1.2, 2, "talk"), _a("virga_soft", "sit", 1.2, 2, "sit"), _a("tholin_soft", "sit", 1.2, 2, "sit"), _a("nucleate_soft", "play", 1.2, 2, "play"), _a("freeze", "freeze", 1.4, 2)),
    "silica": (_a("crescit", "sit_hold", 2.4, 4, "sit"), _a("cleavage_soft", "play", 1.2, 2, "play"), _a("twinning_soft", "talk", 1.15, 2, "talk"), _a("inclusion_soft", "talk", 1.2, 2, "talk"), _a("grit_soft", "sit", 1.2, 2, "sit"), _a("hopper_soft", "sit", 1.2, 2, "sit"), _a("phantom_soft", "play", 1.2, 2, "play"), _a("freeze", "freeze", 1.4, 2)),
    "terminator": (_a("limitor", "sit_hold", 2.4, 4, "sit"), _a("belt_soft", "play", 1.2, 2, "play"), _a("penumbra_soft", "talk", 1.15, 2, "talk"), _a("eclipse_soft", "talk", 1.2, 2, "talk"), _a("limb_soft", "sit", 1.2, 2, "sit"), _a("umbra_soft", "sit", 1.2, 2, "sit"), _a("syzygy_soft", "play", 1.2, 2, "play"), _a("freeze", "freeze", 1.4, 2)),
    "nexus": (_a("mesh", "sit_hold", 2.4, 4, "sit"), _a("plexus_soft", "play", 1.2, 2, "play"), _a("splice_soft", "talk", 1.15, 2, "talk"), _a("braid_soft", "talk", 1.2, 2, "talk"), _a("weft_soft", "sit", 1.2, 2, "sit"), _a("fascicle_soft", "sit", 1.2, 2, "sit"), _a("sennit_soft", "play", 1.2, 2, "play"), _a("freeze", "freeze", 1.4, 2)),
    "halovore": (_a("deliquesce", "sit_hold", 2.4, 4, "sit"), _a("halite_soft", "play", 1.2, 2, "play"), _a("salina_soft", "talk", 1.15, 2, "talk"), _a("rime_soft", "talk", 1.2, 2, "talk"), _a("bittern_soft", "sit", 1.2, 2, "sit"), _a("ectoine_soft", "sit", 1.2, 2, "sit"), _a("sabkha_soft", "play", 1.2, 2, "play"), _a("freeze", "freeze", 1.4, 2)),
    "magneton": (_a("remanence", "sit_hold", 2.4, 4, "sit"), _a("lodestone_soft", "play", 1.2, 2, "play"), _a("flux_soft", "talk", 1.15, 2, "talk"), _a("azimuth_soft", "talk", 1.2, 2, "talk"), _a("dipole_soft", "sit", 1.2, 2, "sit"), _a("barkhausen_soft", "sit", 1.2, 2, "sit"), _a("hysteresis_soft", "play", 1.2, 2, "play"), _a("freeze", "freeze", 1.4, 2)),
    "umbral": (_a("caligo", "sit_hold", 2.4, 4, "sit"), _a("silhouette_soft", "play", 1.2, 2, "play"), _a("adumbrate_soft", "talk", 1.15, 2, "talk"), _a("occultation_soft", "talk", 1.2, 2, "talk"), _a("antumbra_soft", "sit", 1.2, 2, "sit"), _a("sfumato_soft", "sit", 1.2, 2, "sit"), _a("tenebrae_soft", "play", 1.2, 2, "play"), _a("freeze", "freeze", 1.4, 2)),
    "cyst": (_a("cryptobiosis", "sit_hold", 2.4, 4, "sit"), _a("lorica_soft", "play", 1.2, 2, "play"), _a("tegument_soft", "talk", 1.15, 2, "talk"), _a("ampoule_soft", "talk", 1.2, 2, "talk"), _a("bradyzoite_soft", "sit", 1.2, 2, "sit"), _a("sporocyst_soft", "sit", 1.2, 2, "sit"), _a("tachyzoite_soft", "play", 1.2, 2, "play"), _a("freeze", "freeze", 1.4, 2)),
    "frog": (_a("lentic", "sit_hold", 2.4, 4, "sit"), _a("gular_soft", "talk", 1.2, 2, "talk"), _a("nictitate_soft", "sit", 1.15, 2, "sit"), _a("tympanum_soft", "talk", 1.2, 2, "talk"), _a("iliac_soft", "play", 1.2, 2, "play"), _a("toepad_soft", "sit", 1.2, 2, "sit"), _a("webbing_soft", "play", 1.2, 2, "play"), _a("freeze", "freeze", 1.4, 2)),
    "toad": (_a("bufonid", "sit_hold", 2.4, 4, "sit"), _a("verruca_soft", "play", 1.2, 2, "play"), _a("burrow_soft", "sit", 1.15, 2, "sit"), _a("parotoid_soft", "sit", 1.2, 2, "sit"), _a("tubercle_soft", "play", 1.2, 2, "play"), _a("unken_soft", "play", 1.2, 2, "play"), _a("cranial_soft", "talk", 1.2, 2, "talk"), _a("freeze", "freeze", 1.4, 2)),
    "newt": (_a("caudate", "sit_hold", 2.4, 4, "sit"), _a("crest_soft", "play", 1.2, 2, "play"), _a("caudal_soft", "walk", 1.15, 2, "play"), _a("filament_soft", "sit", 1.2, 2, "sit"), _a("costal_soft", "walk", 1.2, 2, "play"), _a("hedonic_soft", "sit", 1.2, 2, "sit"), _a("aposematic_soft", "play", 1.2, 2, "play"), _a("freeze", "freeze", 1.4, 2)),
    "salamander": (_a("ambystomid", "sit_hold", 2.4, 4, "sit"), _a("maculate_soft", "play", 1.2, 2, "play"), _a("litter_soft", "walk", 1.15, 2, "play"), _a("cutaneous_soft", "sit", 1.2, 2, "sit"), _a("nasolabial_soft", "sit", 1.2, 2, "sit"), _a("mental_soft", "sit", 1.2, 2, "sit"), _a("granular_soft", "play", 1.2, 2, "play"), _a("freeze", "freeze", 1.4, 2)),
    "caecilian": (_a("gymnophion", "sit_hold", 2.4, 4, "sit"), _a("annulate_soft", "play", 1.2, 2, "play"), _a("fossorial_soft", "walk", 1.15, 2, "play"), _a("tentacular_soft", "sit", 1.2, 2, "sit"), _a("hydrostatic_soft", "play", 1.2, 2, "play"), _a("stegos_soft", "sit", 1.2, 2, "sit"), _a("dualjaw_soft", "play", 1.2, 2, "play"), _a("freeze", "freeze", 1.4, 2)),
    "crayfish": (_a("astacid", "sit_hold", 2.4, 4, "sit"), _a("chelate_soft", "play", 1.2, 2, "play"), _a("caridoid_soft", "play", 1.15, 2, "play"), _a("chimney_soft", "walk", 1.2, 2, "play"), _a("antennule_soft", "sit", 1.2, 2, "sit"), _a("scaph_soft", "sit", 1.2, 2, "sit"), _a("meral_soft", "play", 1.2, 2, "play"), _a("freeze", "freeze", 1.4, 2)),
    "pond_snail": (_a("lymnaeid", "sit_hold", 2.4, 4, "sit"), _a("radula_soft", "play", 1.2, 2, "play"), _a("pedal_soft", "walk", 1.2, 2, "play"), _a("pneumostome_soft", "sit", 1.2, 2, "sit"), _a("ommatophore_soft", "sit", 1.2, 2, "sit"), _a("odontophore_soft", "play", 1.2, 2, "play"), _a("neuston_soft", "walk", 1.2, 2, "play"), _a("freeze", "freeze", 1.4, 2)),
    "mussel": (_a("siphon", "open", 1.8, 5, "sit"), _a("still", "sit_hold", 2.8, 4, "sit"), _a("filter", "freeze", 2.2, 2)),
    "leech": (_a("latch", "sit_hold", 1.8, 4, "sit"), _a("swim", "wiggle", 1.2, 3), _a("still", "freeze", 1.6, 2)),
    "stickleback": (_a("flare", "pulse", 1.0, 4), _a("dart", "dart", 0.8, 3), _a("still", "freeze", 1.4, 2)),
    "paramecium": (_a("cilia", "wiggle", 1.0, 5), _a("row", "dart", 0.8, 3), _a("still", "freeze", 1.4, 2)),
    "amoeba": (_a("reach", "stretch", 1.6, 5, "sit"), _a("foot", "sit_hold", 2.2, 3, "sit"), _a("still", "freeze", 2.0, 2)),
    "euglena": (_a("spot", "bob", 1.2, 4), _a("drink", "drink", 1.4, 3), _a("still", "freeze", 1.6, 2)),
    "volvox": (_a("roll", "pulse", 1.4, 5), _a("daughters", "ripple", 1.6, 2), _a("still", "freeze", 1.8, 2)),
    "diatom": (_a("glide", "sit_hold", 2.0, 4, "sit"), _a("pane", "facet", 1.8, 3, "sit"), _a("still", "freeze", 2.2, 2)),
    "kelp": (_a("sway", "lean", 1.8, 5), _a("holdfast", "sit_hold", 2.6, 3, "sit"), _a("still", "freeze", 2.4, 2)),
    "chlamydomonas": (_a("spin", "pulse", 1.0, 5), _a("oar", "dart", 0.8, 3), _a("still", "freeze", 1.4, 2)),
    "stentor": (_a("trumpet", "open", 1.6, 5, "sit"), _a("contract", "sit_hold", 1.8, 3, "sit"), _a("still", "freeze", 1.8, 2)),
    "coli": (_a("tumble", "dart", 0.7, 5), _a("run", "wiggle", 0.9, 3), _a("still", "freeze", 1.2, 2)),
    "haloarchaea": (_a("blush", "frost", 1.8, 5, "sit"), _a("still", "freeze", 2.2, 3), _a("pink", "flush", 1.4, 1)),
    "crow": (_a("caw", "talk", 0.8, 4, "talk"), _a("hop_step", "hop", 0.5, 3, "play"), _a("preen", "groom", 1.5, 3, "sit"), _a("cock_look", "nod", 1.2, 3, "sit"), _a("bill_wipe", "wiggle", 0.9, 2, "sit"), _a("alert", "freeze", 1.8, 2), _a("wing_settle", "pulse", 0.9, 2, "play"), _a("perch", "sit_hold", 2.2, 2, "sit")),
    "raven": (_a("kronk", "talk", 0.9, 4, "talk"), _a("hop_step", "hop", 0.55, 3, "play"), _a("preen", "groom", 1.5, 3, "sit"), _a("ruff_flare", "pulse", 1.1, 3, "sit"), _a("head_cock", "nod", 1.2, 3, "sit"), _a("bill_wipe", "wiggle", 0.9, 2, "sit"), _a("alert", "freeze", 1.8, 2), _a("perch", "sit_hold", 2.4, 2, "sit")),
    "barn_owl": (_a("hiss", "talk", 0.8, 4, "talk"), _a("swivel", "nod", 1.2, 3, "sit"), _a("preen", "groom", 1.5, 3, "sit"), _a("disk_listen", "freeze", 1.4, 3, "sit"), _a("soft_settle", "lean", 1.1, 2, "sit"), _a("alert", "freeze", 1.8, 2), _a("wing_fold", "fold", 0.9, 2, "sit"), _a("perch", "sit_hold", 2.4, 2, "sit")),
    "red_tail": (_a("soar", "pulse", 1.4, 4), _a("stoop", "dart", 0.8, 3, "play"), _a("still", "freeze", 1.6, 2), _a("preen", "groom", 1.5, 3, "sit"), _a("keeyer", "talk", 0.9, 3, "talk"), _a("alert", "freeze", 1.8, 2), _a("wing_settle", "pulse", 0.9, 2, "play"), _a("perch", "sit_hold", 2.4, 2, "sit")),
    "chickadee": (_a("dee", "talk", 0.7, 4, "talk"), _a("hop_step", "hop", 0.45, 3, "play"), _a("preen", "groom", 1.5, 3, "sit"), _a("fee_bee", "talk", 0.9, 3, "talk"), _a("alert", "freeze", 1.8, 2), _a("wing_flick", "pulse", 0.9, 2, "play"), _a("cache_peek", "dart", 0.8, 2, "sit"), _a("perch", "sit_hold", 2.4, 2, "sit")),
    "robin": (_a("hop", "hop", 0.5, 4, "play"), _a("pull", "nod", 1.0, 3, "sit"), _a("preen", "groom", 1.5, 3, "sit"), _a("carol_soft", "talk", 0.9, 3, "talk"), _a("alert", "freeze", 1.8, 2), _a("wing_flick", "pulse", 0.9, 2, "play"), _a("breast_puff", "pulse", 1.0, 2, "sit"), _a("perch", "sit_hold", 2.4, 2, "sit")),
    "mallard": (_a("dabble", "eat", 1.2, 4, "eat"), _a("waddle", "wiggle", 1.0, 3, "play"), _a("preen", "groom", 1.5, 3, "sit"), _a("quack_soft", "talk", 0.9, 3, "talk"), _a("alert", "freeze", 1.8, 2), _a("wing_flick", "pulse", 0.9, 2, "play"), _a("upend_soft", "pulse", 1.2, 2, "sit"), _a("loaf", "sit_hold", 2.4, 2, "sit")),
    "canada_goose": (_a("honk", "talk", 0.8, 4, "talk"), _a("walk", "wiggle", 1.0, 3, "play"), _a("preen", "groom", 1.5, 3, "sit"), _a("graze_soft", "eat", 1.2, 3, "eat"), _a("alert", "freeze", 1.8, 2), _a("wing_flick", "pulse", 0.9, 2, "play"), _a("hiss_soft", "pulse", 1.0, 2, "sit"), _a("loaf", "sit_hold", 2.4, 2, "sit")),
    "pileated": (_a("drum", "snap", 0.7, 4, "play"), _a("hop_step", "hop", 0.5, 3, "play"), _a("preen", "groom", 1.4, 3, "sit"), _a("excavate_soft", "eat", 1.2, 3, "play"), _a("crest_soft", "pulse", 0.9, 2, "sit"), _a("kuk_soft", "talk", 0.8, 3, "talk"), _a("brace", "freeze", 1.6, 2, "sit"), _a("loaf", "sit_hold", 2.4, 2, "sit")),
    "hummingbird": (_a("hover", "bob", 1.2, 5), _a("dart", "dart", 0.7, 3, "play"), _a("sip", "eat", 0.8, 3, "eat"), _a("preen", "groom", 1.4, 3, "sit"), _a("chip_soft", "talk", 0.8, 3, "talk"), _a("gorget_soft", "pulse", 0.9, 2, "sit"), _a("alert", "freeze", 1.6, 2, "sit"), _a("perch", "sit_hold", 2.4, 2, "sit")),
    "orb_weaver": (_a("sit_web", "sit_hold", 2.4, 5, "sit"), _a("still", "freeze", 2.0, 3), _a("wrap", "nod", 1.2, 1)),
    "jumping_spider": (_a("leap", "hop", 0.5, 5, "play"), _a("look", "nod", 1.0, 3, "sit"), _a("still", "freeze", 1.4, 2)),
    "wolf_spider": (_a("prowl", "wiggle", 1.0, 4), _a("carry", "sit_hold", 1.8, 3, "sit"), _a("still", "freeze", 1.6, 2)),
    "tarantula": (_a("flick", "snap", 0.8, 3, "play"), _a("walk", "wiggle", 1.2, 3), _a("still", "sit_hold", 2.2, 3, "sit")),
    "widow": (_a("hang", "sit_hold", 2.4, 5, "sit"), _a("still", "freeze", 2.2, 3), _a("hour", "nod", 1.4, 1)),
    "harvestman": (_a("walk", "wiggle", 1.0, 5), _a("stem", "nod", 1.2, 3), _a("still", "freeze", 1.6, 2)),
    "scorpion": (_a("sting", "snap", 0.7, 3, "play"), _a("walk", "wiggle", 1.0, 4), _a("still", "freeze", 1.8, 2)),
    "vinegaroon": (_a("whip", "snap", 0.8, 3, "play"), _a("walk", "wiggle", 1.0, 4), _a("still", "freeze", 1.8, 2)),
    "tick": (_a("clasp", "sit_hold", 2.6, 5, "sit"), _a("still", "freeze", 2.4, 3), _a("wait", "nod", 1.8, 1)),
    "solifuge": (_a("run", "dart", 0.6, 5), _a("bite", "snap", 0.7, 3, "play"), _a("still", "freeze", 1.4, 2)),
    "deer": (_a("flag", "pulse", 0.8, 4), _a("walk", "wiggle", 1.0, 3), _a("still", "freeze", 1.6, 2)),
    "bat": (_a("hang", "sit_hold", 2.2, 5, "sit"), _a("flutter", "pulse", 1.0, 3), _a("still", "freeze", 1.6, 2)),
    "squirrel": (_a("bury", "nod", 1.2, 4, "sit"), _a("hop", "hop", 0.5, 3, "play"), _a("chatter", "talk", 0.7, 2, "talk")),
    "otter": (_a("slide", "wiggle", 1.2, 5), _a("swim", "bob", 1.4, 3), _a("groom", "groom", 1.2, 2, "sit")),
    "raccoon": (_a("rinse", "groom", 1.4, 5, "sit"), _a("rummage", "nod", 1.0, 3, "sit"), _a("still", "freeze", 1.6, 2)),
    "skunk": (_a("stamp", "nod", 0.8, 4, "sit"), _a("raise", "pulse", 1.0, 3), _a("still", "freeze", 1.8, 2)),
    "opossum": (_a("playdead", "sit_hold", 2.2, 5, "sit"), _a("grin", "gape", 1.0, 2), _a("walk", "wiggle", 1.0, 2)),
    "beaver": (_a("gnaw", "eat", 1.4, 5, "eat"), _a("slap", "snap", 0.7, 2, "play"), _a("sit", "sit_hold", 2.0, 3, "sit")),
    "capybara": (_a("soak", "sit_hold", 2.2, 4, "sit"), _a("graze", "eat", 1.6, 5, "eat"), _a("nuzzle", "nuzzle", 1.0, 3, "play")),
    "porcupine": (_a("bristle", "puff", 1.4, 5, "sit"), _a("climb", "wiggle", 1.0, 2), _a("still", "freeze", 2.0, 3)),
    "black_bear": (_a("forage", "eat", 1.4, 4, "eat"), _a("sit", "sit_hold", 2.2, 4, "sit"), _a("huff", "pulse", 0.8, 2)),
    "gecko": (_a("climb", "wiggle", 1.0, 5), _a("chirp", "talk", 0.7, 3, "talk"), _a("cling", "sit_hold", 2.0, 2, "sit")),
    "anole": (_a("flash", "pulse", 0.8, 5), _a("brown", "nod", 1.2, 2, "sit"), _a("still", "freeze", 1.6, 2)),
    "skink": (_a("dash", "dart", 0.5, 5), _a("tail", "pulse", 0.8, 3), _a("still", "freeze", 1.4, 2)),
    "chameleon": (_a("aim", "nod", 1.6, 5, "sit"), _a("walk", "wiggle", 1.8, 3), _a("catch", "snap", 0.6, 2, "play")),
    "horned_lizard": (_a("crown", "sit_hold", 2.2, 5, "sit"), _a("squirt", "pulse", 0.8, 2), _a("still", "freeze", 2.0, 3)),
    "alligator": (_a("bask", "sit_hold", 2.4, 5, "sit"), _a("bank", "freeze", 2.0, 3), _a("close", "nod", 1.2, 2)),
    "crocodile": (_a("show", "gape", 1.2, 5), _a("sit", "sit_hold", 2.2, 3, "sit"), _a("still", "freeze", 1.8, 2)),
    "snapper": (_a("snap", "snap", 0.6, 5, "play"), _a("sit", "sit_hold", 2.0, 3, "sit"), _a("still", "freeze", 1.8, 2)),
    "box_turtle": (_a("shut", "sit_hold", 2.2, 5, "sit"), _a("walk", "wiggle", 1.0, 3), _a("still", "freeze", 1.8, 2)),
    "tuatara": (_a("still", "freeze", 2.6, 5), _a("crest", "sit_hold", 2.2, 3, "sit"), _a("watch", "nod", 1.6, 2)),
    "bass": (_a("lunge", "dart", 0.6, 5), _a("sit", "sit_hold", 2.0, 3, "sit"), _a("gape", "gape", 0.8, 2)),
    "brook_trout": (_a("dart", "dart", 0.5, 5), _a("rise", "bob", 1.0, 3), _a("still", "freeze", 1.6, 2)),
    "catfish": (_a("whisk", "wiggle", 1.2, 5), _a("sit", "sit_hold", 2.0, 3, "sit"), _a("still", "freeze", 1.8, 2)),
    "bluegill": (_a("flare", "pulse", 0.8, 5), _a("sit", "sit_hold", 1.8, 3, "sit"), _a("dart", "dart", 0.6, 2)),
    "perch": (_a("bar", "pulse", 0.8, 4), _a("dart", "dart", 0.6, 4), _a("still", "freeze", 1.6, 2)),
    "pike": (_a("wait", "sit_hold", 2.4, 5, "sit"), _a("lance", "dart", 0.5, 3), _a("still", "freeze", 2.0, 2)),
    "walleye": (_a("hunt", "dart", 0.8, 5), _a("glow", "pulse", 1.2, 3), _a("still", "freeze", 1.8, 2)),
    "paddlefish": (_a("filter", "sit_hold", 2.4, 5, "sit"), _a("paddle", "bob", 1.6, 3), _a("still", "freeze", 2.0, 2)),
    "lamprey": (_a("disk", "sit_hold", 2.2, 5, "sit"), _a("cling", "freeze", 2.0, 3), _a("still", "freeze", 1.8, 2)),
    "american_eel": (_a("swim", "wiggle", 1.4, 5), _a("silver", "pulse", 1.0, 3), _a("still", "freeze", 1.6, 2)),
    "house_centipede": (_a("hunt", "dart", 0.5, 5), _a("walk", "wiggle", 0.8, 3), _a("still", "freeze", 1.4, 2)),
    "millipede": (_a("walk", "wiggle", 1.6, 5), _a("oil", "puff", 1.2, 3, "sit"), _a("still", "freeze", 2.0, 2)),
    "pillbug": (_a("roll", "sit_hold", 2.2, 5, "sit"), _a("walk", "wiggle", 1.0, 3), _a("still", "freeze", 1.6, 2)),
    "earthworm": (_a("cast", "nod", 1.4, 5, "sit"), _a("crawl", "wiggle", 1.2, 3), _a("still", "freeze", 1.8, 2)),
    "velvet_worm": (_a("jet", "snap", 0.7, 4, "play"), _a("walk", "wiggle", 1.0, 3), _a("still", "freeze", 1.8, 2)),
    "springtail": (_a("hop", "hop", 0.5, 5, "play"), _a("still", "freeze", 1.4, 3), _a("walk", "wiggle", 0.8, 2)),
    "tardigrade": (_a("tun", "sit_hold", 2.4, 5, "sit"), _a("walk", "wiggle", 1.2, 3), _a("still", "freeze", 2.0, 2)),
    "planarian": (_a("split", "pulse", 1.2, 5), _a("glide", "wiggle", 1.4, 3), _a("still", "freeze", 1.8, 2)),
    "nematode": (_a("thrash", "wiggle", 1.0, 5), _a("still", "freeze", 1.6, 3), _a("sit", "sit_hold", 1.8, 2, "sit")),
    "amphipod": (_a("scud", "wiggle", 1.2, 5), _a("dart", "dart", 0.6, 3), _a("still", "freeze", 1.6, 2)),
    "fiddler_crab": (_a("wave", "pulse", 0.8, 5), _a("walk", "wiggle", 1.0, 3), _a("still", "freeze", 1.6, 2)),
    "ghost_crab": (_a("run", "dart", 0.5, 5), _a("walk", "wiggle", 0.8, 3), _a("still", "freeze", 1.4, 2)),
    "limpet": (_a("clamp", "sit_hold", 2.4, 5, "sit"), _a("rasp", "nod", 1.2, 3), _a("still", "freeze", 2.0, 2)),
    "barnacle": (_a("kick", "pulse", 1.0, 5), _a("still", "freeze", 2.2, 4), _a("sit", "sit_hold", 2.0, 2, "sit")),
    "chiton": (_a("graze", "wiggle", 1.2, 5), _a("plate", "sit_hold", 1.8, 3, "sit"), _a("still", "freeze", 1.8, 2)),
    "periwinkle": (_a("rasp", "nod", 1.4, 5), _a("sit", "sit_hold", 1.8, 3, "sit"), _a("still", "freeze", 1.8, 2)),
    "sand_dollar": (_a("bury", "sit_hold", 2.2, 5, "sit"), _a("flat", "freeze", 2.0, 3), _a("still", "freeze", 1.8, 2)),
    "sea_urchin": (_a("walk", "wiggle", 1.2, 5), _a("spine", "pulse", 1.0, 3), _a("still", "freeze", 1.8, 2)),
    "knobbed_whelk": (_a("hunt", "wiggle", 1.2, 5), _a("sit", "sit_hold", 1.8, 3, "sit"), _a("still", "freeze", 1.8, 2)),
    "lugworm": (_a("heap", "nod", 1.4, 5, "sit"), _a("cast", "wiggle", 1.2, 3), _a("still", "freeze", 1.8, 2)),
    "field_cricket": (_a("chirp", "talk", 0.8, 5, "talk"), _a("walk", "wiggle", 1.0, 3), _a("still", "freeze", 1.6, 2)),
    "katydid": (_a("still", "sit_hold", 2.4, 5, "sit"), _a("blade", "freeze", 2.0, 3), _a("walk", "wiggle", 0.9, 1)),
    "grasshopper": (_a("vault", "hop", 0.55, 5, "play"), _a("walk", "wiggle", 1.0, 3), _a("still", "freeze", 1.6, 2)),
    "swallowtail": (_a("banner", "pulse", 1.0, 4), _a("flutter", "bob", 1.2, 3), _a("still", "freeze", 1.8, 2)),
    "jewelwing": (_a("jewel", "pulse", 1.2, 4), _a("hover", "bob", 1.4, 3), _a("still", "freeze", 1.6, 2)),
    "lacewing": (_a("lace", "pulse", 1.0, 4), _a("hover", "bob", 1.2, 3), _a("still", "freeze", 1.6, 2)),
    "earwig": (_a("raise", "sit_hold", 1.8, 5, "sit"), _a("walk", "wiggle", 1.0, 3), _a("still", "freeze", 1.6, 2)),
    "acorn_weevil": (_a("drill", "sit_hold", 2.0, 5, "sit"), _a("walk", "wiggle", 1.0, 3), _a("still", "freeze", 1.8, 2)),
    "click_beetle": (_a("click", "pulse", 0.7, 5), _a("walk", "wiggle", 1.0, 3), _a("still", "freeze", 1.6, 2)),
    "robber_fly": (_a("hunt", "dart", 0.6, 5), _a("perch", "sit_hold", 1.8, 3, "sit"), _a("still", "freeze", 1.4, 2)),
    "sloth": (_a("hang", "sit_hold", 2.6, 5, "sit"), _a("reach", "stretch", 1.6, 3, "sit"), _a("still", "freeze", 2.2, 2)),
    "lemur": (_a("sun", "sit_hold", 2.2, 5, "sit"), _a("flag", "pulse", 0.8, 3), _a("walk", "wiggle", 1.0, 2)),
    "gibbon": (_a("swing", "pulse", 1.2, 5), _a("song", "talk", 0.8, 3, "talk"), _a("still", "freeze", 1.6, 2)),
    "kinkajou": (_a("wrap", "sit_hold", 2.0, 5, "sit"), _a("lick", "eat", 1.2, 3, "eat"), _a("still", "freeze", 1.6, 2)),
    "colugo": (_a("sail", "pulse", 1.4, 5), _a("cling", "sit_hold", 2.2, 3, "sit"), _a("still", "freeze", 1.8, 2)),
    "flying_squirrel": (_a("glide", "pulse", 1.2, 5), _a("hop", "hop", 0.5, 3, "play"), _a("still", "freeze", 1.6, 2)),
    "howler": (_a("boom", "talk", 0.9, 5, "talk"), _a("sit", "sit_hold", 2.2, 3, "sit"), _a("still", "freeze", 1.8, 2)),
    "tarsier": (_a("gaze", "nod", 1.4, 5, "sit"), _a("leap", "hop", 0.5, 3, "play"), _a("still", "freeze", 1.6, 2)),
    "potto": (_a("still", "freeze", 2.6, 5), _a("cling", "sit_hold", 2.2, 3, "sit"), _a("walk", "wiggle", 1.0, 1)),
    "koala": (_a("chew", "eat", 1.6, 5, "eat"), _a("cling", "sit_hold", 2.4, 3, "sit"), _a("still", "freeze", 2.0, 2)),
    "brain_coral": (_a("ridge", "sit_hold", 2.6, 5, "sit"), _a("polyp", "pulse", 1.4, 3), _a("still", "freeze", 2.2, 2)),
    "anemone": (_a("wreath", "pulse", 1.6, 5), _a("open", "open", 1.8, 3, "sit"), _a("still", "freeze", 2.0, 2)),
    "clownfish": (_a("dart", "dart", 0.6, 5), _a("nestle", "sit_hold", 1.8, 3, "sit"), _a("still", "freeze", 1.4, 2)),
    "parrotfish": (_a("scrape", "nod", 1.2, 5), _a("swim", "wiggle", 1.0, 3), _a("still", "freeze", 1.6, 2)),
    "cleaner_shrimp": (_a("wave", "pulse", 0.8, 5), _a("wait", "sit_hold", 2.0, 3, "sit"), _a("still", "freeze", 1.6, 2)),
    "sea_cucumber": (_a("crawl", "wiggle", 1.4, 5), _a("still", "sit_hold", 2.2, 3, "sit"), _a("freeze", "freeze", 1.8, 2)),
    "lionfish": (_a("veil", "pulse", 1.4, 5), _a("hover", "bob", 1.6, 3), _a("still", "freeze", 1.8, 2)),
    "giant_clam": (_a("open", "open", 1.8, 5, "sit"), _a("mantle", "sit_hold", 2.4, 4, "sit"), _a("still", "freeze", 2.2, 2)),
    "eagle_ray": (_a("soar", "pulse", 1.4, 5), _a("glide", "bob", 1.8, 3), _a("still", "freeze", 1.6, 2)),
    "grouper": (_a("hide", "sit_hold", 2.4, 5, "sit"), _a("gape", "gape", 1.0, 3), _a("still", "freeze", 1.8, 2)),
    "cyber_dragon": (_a("arc", "pulse", 1.4, 5), _a("still", "sit_hold", 2.2, 3, "sit"), _a("watch", "freeze", 1.8, 2)),
    "volt_dragon": (_a("current", "pulse", 1.4, 5), _a("still", "sit_hold", 2.2, 3, "sit"), _a("watch", "freeze", 1.8, 2)),
    "trace_dragon": (_a("path", "pulse", 1.4, 5), _a("still", "sit_hold", 2.2, 3, "sit"), _a("watch", "freeze", 1.8, 2)),
    "flux_dragon": (_a("field", "pulse", 1.4, 5), _a("still", "sit_hold", 2.2, 3, "sit"), _a("watch", "freeze", 1.8, 2)),
    "spark_dragon": (_a("crackle", "pulse", 1.4, 5), _a("still", "sit_hold", 2.2, 3, "sit"), _a("watch", "freeze", 1.8, 2)),
    "ion_dragon": (_a("haze", "pulse", 1.4, 5), _a("still", "sit_hold", 2.2, 3, "sit"), _a("watch", "freeze", 1.8, 2)),
    "gauss_dragon": (_a("filing", "pulse", 1.4, 5), _a("still", "sit_hold", 2.2, 3, "sit"), _a("watch", "freeze", 1.8, 2)),
    "relay_dragon": (_a("relay", "pulse", 1.4, 5), _a("still", "sit_hold", 2.2, 3, "sit"), _a("watch", "freeze", 1.8, 2)),
    "fuse_dragon": (_a("fuse", "pulse", 1.4, 5), _a("still", "sit_hold", 2.2, 3, "sit"), _a("watch", "freeze", 1.8, 2)),
    "ground_dragon": (_a("earth", "pulse", 1.4, 5), _a("still", "sit_hold", 2.2, 3, "sit"), _a("watch", "freeze", 1.8, 2)),
}

TONGUE_KEYS = SNAKE_KEYS
SCRATCH_KEYS = ("dog", "cat", "red_panda")


def acts_for(key: str | None) -> tuple[IdleAct, ...]:
    if not key:
        return ()
    return ETHOGRAM.get(key, ())


def pick_act(key: str | None) -> IdleAct | None:
    acts = acts_for(key)
    if not acts:
        return None
    roll = random.random() * sum(a["weight"] for a in acts)
    for act in acts:
        roll -= act["weight"]
        if roll <= 0:
            return act
    return acts[-1]


def next_act_wait(wander: float, nocturnal: bool = False, night: bool = False) -> float:
    wait = 20.0 - max(0.0, min(1.0, wander)) * 12.0
    if wander < 0.18:
        wait += 8.0
    if nocturnal and night:
        wait *= 0.7
    if nocturnal and not night:
        wait *= 1.22
    return max(8.0, wait) * (0.85 + random.random() * 0.35)


def after_settle_wait(wander: float) -> float:
    late = wander < 0.18
    return (6.0 if late else 3.0) + random.random() * (5.0 if late else 4.0)


def tongue_flick(t: float, hold: float) -> float:
    if t < 0 or t > hold:
        return 0.0
    cycle = 0.22
    n = math.floor(t / cycle)
    if n >= 3:
        return 0.0
    u = (t % cycle) / cycle
    return 1.0 - u / 0.55 if u < 0.55 else 0.0


def act_pose(motion: str | None, t: float, hold: float) -> dict[str, float]:
    u = max(0.0, min(1.0, t / hold)) if hold > 0 else 1.0
    pose = {"dx": 0.0, "dy": 0.0, "rot": 0.0, "stretch": 1.0, "squat": 1.0}
    if motion == "scratch":
        pose["dx"] = math.sin(t * 28) * 2.2
        pose["rot"] = math.sin(t * 28) * 3.2
    elif motion == "shake":
        pose["dx"] = math.sin(t * 40) * 3.4
    elif motion == "yawn":
        pose["stretch"] = 1.0 + math.sin(u * math.pi) * 0.08
        pose["squat"] = 2.0 - pose["stretch"]
    elif motion == "groom":
        pose["dy"] = math.sin(t * 10) * 3.0
        pose["stretch"] = 1.0 + math.sin(t * 10) * 0.02
    elif motion == "stretch":
        pose["stretch"] = 1.0 + math.sin(u * math.pi) * 0.1
        pose["squat"] = 1.0 - math.sin(u * math.pi) * 0.05
    elif motion == "wiggle":
        pose["dx"] = math.sin(t * 16) * 2.0
    elif motion == "bob":
        pose["dy"] = math.sin(t * 8) * 4.0
    elif motion == "pulse":
        pose["stretch"] = 1.0 + math.sin(u * math.pi * 2) * 0.05
        pose["squat"] = 2.0 - pose["stretch"]
    elif motion == "gape":
        pose["stretch"] = 1.0 + math.sin(u * math.pi) * 0.07
        pose["squat"] = 2.0 - pose["stretch"]
    elif motion == "gulp":
        pose["dy"] = math.sin(u * math.pi) * 5.0
        pose["stretch"] = 1.0 + math.sin(u * math.pi) * 0.04
    elif motion == "nod":
        pose["dy"] = -math.sin(u * math.pi) * 6.0
        pose["stretch"] = 1.0 - math.sin(u * math.pi) * 0.04
    elif motion == "lean":
        pose["rot"] = math.sin(u * math.pi) * 8.0
        pose["dx"] = math.sin(u * math.pi) * 4.0
    elif motion == "unfurl":
        pose["stretch"] = 0.88 + math.sin(u * math.pi) * 0.16
        pose["squat"] = 2.0 - pose["stretch"]
    elif motion == "snap":
        pose["stretch"] = 1.0 - math.sin(u * math.pi) * 0.12
        pose["squat"] = 2.0 - pose["stretch"]
        pose["dy"] = math.sin(u * math.pi) * 3.0
    elif motion == "open":
        pose["stretch"] = 1.0 + math.sin(u * math.pi) * 0.1
        pose["squat"] = 2.0 - pose["stretch"]
    elif motion == "curl":
        pose["rot"] = math.sin(u * math.pi) * 6.0
        pose["stretch"] = 1.0 - math.sin(u * math.pi) * 0.08
        pose["squat"] = 2.0 - pose["stretch"]
    elif motion == "waggle":
        pose["dx"] = math.sin(t * 22) * 3.2
        pose["rot"] = math.sin(t * 22) * 10.0
    elif motion == "flash":
        pose["stretch"] = 1.0 + math.sin(u * math.pi * 2) * 0.07
        pose["squat"] = 2.0 - pose["stretch"]
        pose["dy"] = -math.sin(u * math.pi) * 5.0
    elif motion == "fold":
        pose["stretch"] = 1.0 - math.sin(u * math.pi) * 0.06
        pose["squat"] = 2.0 - pose["stretch"]
        pose["dy"] = math.sin(u * math.pi) * 2.0
    elif motion == "trail":
        pose["dx"] = math.sin(t * 14) * 2.4
        pose["dy"] = math.sin(t * 28) * 1.2
    elif motion == "emerge":
        pose["stretch"] = 0.9 + math.sin(u * math.pi) * 0.18
        pose["squat"] = 2.0 - pose["stretch"]
        pose["dy"] = -math.sin(u * math.pi) * 4.0
    elif motion == "puff":
        pose["stretch"] = 1.0 + math.sin(u * math.pi) * 0.14
        pose["squat"] = 2.0 - pose["stretch"]
        pose["dy"] = -math.sin(u * math.pi) * 6.0
    elif motion == "flush":
        pose["stretch"] = 1.0 + math.sin(u * math.pi * 2) * 0.06
        pose["squat"] = 2.0 - pose["stretch"]
        pose["rot"] = math.sin(u * math.pi) * 3.0
    elif motion == "rise":
        pose["dy"] = -math.sin(u * math.pi) * 8.0
        pose["stretch"] = 1.0 + math.sin(u * math.pi) * 0.08
        pose["squat"] = 2.0 - pose["stretch"]
    elif motion == "share":
        pose["dx"] = math.sin(u * math.pi) * 1.2
        pose["rot"] = math.sin(u * math.pi) * 2.0
    elif motion == "drink":
        pose["dy"] = -math.sin(u * math.pi) * 6.0
        pose["stretch"] = 1.0 + math.sin(u * math.pi) * 0.07
        pose["squat"] = 2.0 - pose["stretch"]
    elif motion == "chord":
        pose["stretch"] = 1.0 + math.sin(u * math.pi * 3) * 0.06
        pose["squat"] = 2.0 - pose["stretch"]
        pose["dx"] = math.sin(t * 10) * 1.4
    elif motion == "float":
        pose["dy"] = math.sin(t * 6) * 5.0
        pose["dx"] = math.sin(t * 3) * 2.0
    elif motion == "facet":
        pose["rot"] = math.sin(u * math.pi) * 4.0
        pose["stretch"] = 1.0 + math.sin(u * math.pi) * 0.05
    elif motion == "edge":
        pose["dx"] = math.sin(t * 12) * 3.2
        pose["dy"] = math.sin(t * 24) * 0.8
    elif motion == "ripple":
        pose["stretch"] = 1.0 + math.sin(u * math.pi * 3) * 0.05
        pose["dx"] = math.sin(u * math.pi * 2) * 2.4
    elif motion == "frost":
        pose["stretch"] = 1.0 - math.sin(u * math.pi) * 0.04
        pose["squat"] = 2.0 - pose["stretch"]
        pose["dy"] = math.sin(u * math.pi) * 2.0
    elif motion == "align":
        pose["stretch"] = 1.0 + math.sin(u * math.pi) * 0.1
        pose["dx"] = math.sin(u * math.pi) * 6.0
    elif motion == "dim":
        pose["dy"] = math.sin(u * math.pi) * 2.0
        pose["rot"] = math.sin(u * math.pi) * 2.0
    elif motion == "wake":
        pose["stretch"] = 0.88 + math.sin(u * math.pi) * 0.2
        pose["squat"] = 2.0 - pose["stretch"]
        pose["dy"] = -math.sin(u * math.pi) * 5.0
    return pose
