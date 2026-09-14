import { SNAKE_KEYS } from "./snakes";

/** Species-true idle acts. Not player specials. Existing frames + a little motion. */
export type ActMotion =
  | "scratch"
  | "shake"
  | "yawn"
  | "groom"
  | "stretch"
  | "hop"
  | "talk"
  | "eat"
  | "sit_hold"
  | "freeze"
  | "wiggle"
  | "bob"
  | "pulse"
  | "dart"
  | "circle"
  | "tongue"
  | "gape"
  | "gulp"
  | "nod"
  | "lean"
  | "unfurl"
  | "snap"
  | "open"
  | "curl"
  | "waggle"
  | "flash"
  | "fold"
  | "trail"
  | "emerge"
  | "puff"
  | "flush"
  | "rise"
  | "share"
  | "drink"
  | "chord"
  | "float"
  | "facet"
  | "edge"
  | "ripple"
  | "frost"
  | "align"
  | "dim"
  | "wake";

export type IdleAct = {
  name: string;
  motion: ActMotion;
  anim?: "idle" | "sit" | "talk" | "eat" | "play";
  hold: number;
  weight: number;
};

const A = (
  name: string,
  motion: ActMotion,
  hold: number,
  weight: number,
  anim?: IdleAct["anim"],
): IdleAct => (anim ? { name, motion, hold, weight, anim } : { name, motion, hold, weight });

const PREEN: IdleAct[] = [
  A("preen", "groom", 1.4, 3, "sit"),
  A("hop_step", "hop", 0.5, 2, "play"),
  A("wings", "pulse", 0.7, 1, "play"),
];

export const ETHOGRAM: Record<string, IdleAct[]> = {
  dog: [A("wait", "sit_hold", 2.0, 4, "sit"), A("wag_soft", "wiggle", 1.0, 3, "play"), A("sniff_soft", "bob", 0.9, 2, "sit"), A("bow_soft", "stretch", 1.0, 2, "sit"), A("zoom_soft", "hop", 0.8, 2, "play"), A("beg_soft", "rise", 0.8, 2, "sit"), A("pant_soft", "nod", 0.8, 2, "sit"), A("scratch", "scratch", 1.1, 2, "sit")],
  cat: [A("loaf", "sit_hold", 2.0, 4, "sit"), A("knead_soft", "wiggle", 1.0, 3, "play"), A("wash_soft", "groom", 0.9, 2, "sit"), A("pounce_soft", "hop", 0.8, 2, "play"), A("bunting_soft", "bob", 0.8, 2, "sit"), A("mlem_soft", "nod", 0.8, 2, "sit"), A("scratch", "scratch", 1.1, 2, "sit"), A("alert", "freeze", 1.6, 2, "sit")],
  fox: [A("den", "sit_hold", 2.0, 4, "sit"), A("mouser_soft", "hop", 1.0, 3, "play"), A("stalk_soft", "bob", 0.9, 2, "sit"), A("trot_soft", "wiggle", 0.8, 2, "play"), A("prance_soft", "hop", 0.8, 2, "play"), A("cock_soft", "nod", 0.9, 2, "sit"), A("stash_soft", "wiggle", 0.8, 2, "sit"), A("freeze", "freeze", 1.4, 2)],
  red_panda: [
    A("groom", "groom", 1.5, 3, "sit"),
    A("scratch", "scratch", 1.1, 2, "sit"),
    A("steal_dart", "dart", 1.2, 2),
    A("wash", "groom", 1.3, 2, "sit"),
  ],
  rabbit: [A("flop", "sit_hold", 2.0, 4, "sit"), A("groom_soft", "groom", 1.0, 3, "sit"), A("peri_soft", "rise", 0.9, 2, "sit"), A("dig_soft", "wiggle", 0.9, 2, "sit"), A("binky_soft", "hop", 0.8, 2, "play"), A("rub_soft", "lean", 0.8, 2, "sit"), A("nosh_soft", "eat", 0.8, 2, "eat"), A("freeze", "freeze", 1.4, 2)],
  hamster: [A("nest", "sit_hold", 2.0, 4, "sit"), A("cheek_soft", "wiggle", 1.0, 3, "sit"), A("scurry_soft", "dart", 0.8, 2, "play"), A("pocket_soft", "lean", 0.9, 2, "sit"), A("reel_soft", "hop", 0.8, 2, "play"), A("scrub_soft", "groom", 0.9, 2, "sit"), A("seed_soft", "eat", 0.8, 2, "eat"), A("freeze", "freeze", 1.4, 2)],
  guinea_pig: [A("potato", "sit_hold", 2.0, 4, "sit"), A("hay_soft", "eat", 1.0, 3, "eat"), A("rumble_soft", "wiggle", 0.9, 2, "sit"), A("popcorn_soft", "hop", 0.8, 2, "play"), A("zig_soft", "dart", 0.8, 2, "play"), A("lookout_soft", "rise", 0.9, 2, "sit"), A("teeth_soft", "talk", 0.8, 2, "talk"), A("freeze", "freeze", 1.4, 2)],
  ferret: [A("tube", "sit_hold", 2.0, 4, "sit"), A("romp_soft", "hop", 1.0, 3, "play"), A("steal_soft", "walk", 0.9, 2, "sit"), A("puff_soft", "sit", 0.8, 2, "sit"), A("noodle_soft", "wiggle", 0.8, 2, "play"), A("corkscrew_soft", "hop", 0.9, 2, "play"), A("slink_soft", "walk", 0.8, 2, "sit"), A("freeze", "freeze", 1.4, 2)],
  hedgehog: [A("curl", "sit_hold", 2.0, 4, "sit"), A("snuffle_soft", "wiggle", 1.0, 3, "sit"), A("anoint_soft", "sit", 0.9, 2, "sit"), A("bristle_soft", "sit", 0.8, 2, "sit"), A("root_soft", "play", 0.9, 2, "play"), A("trundle_soft", "walk", 0.9, 2, "sit"), A("wheel_soft", "hop", 1.0, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  chinchilla: [A("ash", "sit_hold", 2.0, 4, "sit"), A("bound_soft", "hop", 1.0, 3, "play"), A("fluff_soft", "groom", 0.9, 2, "sit"), A("chin_soft", "sit", 0.9, 2, "sit"), A("sift_soft", "shake", 0.9, 2, "play"), A("ricochet_soft", "hop", 1.0, 2, "play"), A("gnaw_soft", "sit", 0.9, 2, "sit"), A("freeze", "freeze", 1.4, 2)],
  turtle: [A("soak", "sit_hold", 2.0, 4, "sit"), A("tuck_soft", "curl", 1.0, 3, "sit"), A("crane_soft", "rise", 0.9, 2, "sit"), A("plod_soft", "dart", 0.8, 2, "play"), A("paddle_soft", "wiggle", 0.8, 2, "play"), A("snorkel_soft", "rise", 0.9, 2, "sit"), A("wipe_soft", "groom", 0.8, 2, "sit"), A("freeze", "freeze", 1.4, 2)],
  iguana: [A("sun", "sit_hold", 2.2, 4, "sit"), A("dewlap_soft", "sit", 1.0, 3, "sit"), A("nod_soft", "bob", 1.0, 2, "talk"), A("press_soft", "play", 1.0, 2, "play"), A("flick_soft", "sit", 0.9, 2, "sit"), A("sneeze_soft", "sit", 0.9, 2, "sit"), A("lash_soft", "shake", 1.0, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  dragon: [A("sprawl", "sit_hold", 2.4, 4, "sit"), A("guard_soft", "sit", 1.0, 3, "sit"), A("smolder_soft", "pulse", 1.0, 2, "sit"), A("claim_soft", "play", 1.0, 2, "play"), A("fold_soft", "play", 0.9, 2, "sit"), A("ruff_soft", "sit", 0.9, 2, "talk"), A("scrape_soft", "scratch", 1.0, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  axolotl: [A("gill", "sit_hold", 2.0, 4, "sit"), A("amble_soft", "walk", 1.0, 3, "play"), A("mend_soft", "sit", 0.9, 2, "sit"), A("smile_soft", "sit", 0.9, 2, "sit"), A("plume_soft", "shake", 0.9, 2, "play"), A("sprout_soft", "play", 1.0, 2, "play"), A("glop_soft", "sit", 0.9, 2, "sit"), A("freeze", "freeze", 1.4, 2)],
  budgie: [A("preen", "groom", 1.4, 4, "sit"), A("bobble_soft", "bob", 0.9, 3, "sit"), A("mimic_soft", "talk", 0.8, 3, "talk"), A("sidle_soft", "hop", 0.6, 2, "play"), A("dangle_soft", "pulse", 0.7, 2, "play"), A("beakgrind_soft", "sit_hold", 1.2, 2, "sit"), A("alert", "freeze", 1.6, 2, "sit"), A("loaf", "sit_hold", 2.4, 2, "sit")],
  parrot: [A("quote", "talk", 2.0, 4, "talk"), A("strut_soft", "wiggle", 1.0, 3, "play"), A("pectoral_soft", "pulse", 0.9, 3, "play"), A("crack_soft", "nod", 0.9, 2, "sit"), A("flash_soft", "hop", 0.8, 2, "play"), A("pineye_soft", "bob", 0.8, 2, "sit"), A("alert", "freeze", 1.6, 2, "sit"), A("loaf", "sit_hold", 2.4, 2, "sit")],
  toucan: [A("roost", "sit_hold", 2.0, 4, "sit"), A("berry_soft", "nod", 1.0, 3, "sit"), A("juggle_soft", "pulse", 0.9, 3, "play"), A("peer_soft", "bob", 0.9, 2, "sit"), A("skip_soft", "hop", 0.8, 2, "play"), A("rattle_soft", "talk", 0.8, 2, "talk"), A("alert", "freeze", 1.6, 2, "sit"), A("loaf", "sit_hold", 2.4, 2, "sit")],
  phoenix: [A("cinder", "sit_hold", 2.0, 4, "sit"), A("blaze_soft", "pulse", 1.0, 3, "play"), A("shed_soft", "wiggle", 0.9, 3, "play"), A("lift_soft", "pulse", 0.9, 2, "play"), A("return_soft", "bob", 0.9, 2, "sit"), A("reignite_soft", "talk", 0.8, 2, "talk"), A("alert", "freeze", 1.6, 2, "sit"), A("loaf", "sit_hold", 2.4, 2, "sit")],
  penguin: [A("huddle", "sit_hold", 2.0, 4, "sit"), A("toboggan_soft", "pulse", 1.0, 3, "play"), A("waddle_soft", "wiggle", 1.0, 3, "play"), A("denslide_soft", "pulse", 0.9, 2, "play"), A("adoral_soft", "talk", 0.9, 3, "talk"), A("rockhop_soft", "hop", 0.8, 2, "play"), A("alert", "freeze", 1.6, 2, "sit"), A("loaf", "sit_hold", 2.4, 2, "sit")],
  goldfish: [A("drift", "sit_hold", 2.0, 4, "sit"), A("gulp_soft", "gulp", 1.0, 3, "talk"), A("flare_soft", "pulse", 0.9, 2, "play"), A("glint_soft", "lean", 0.8, 2, "sit"), A("dart_soft", "dart", 0.8, 2, "play"), A("yawn_soft", "yawn", 0.9, 2, "sit"), A("forage_soft", "eat", 0.8, 2, "eat"), A("freeze", "freeze", 1.4, 2)],
  ball_python: [A("tongue", "tongue", 0.7, 4), A("orb", "sit_hold", 2.4, 4, "sit"), A("nook_soft", "sit", 1.0, 3, "sit"), A("inch_soft", "play", 1.0, 2, "play"), A("loom_soft", "sit", 0.9, 2, "talk"), A("weave_soft", "play", 1.0, 2, "play"), A("gape_soft", "gape", 1.0, 1, "sit"), A("freeze", "freeze", 1.4, 2)],
  corn_snake: [A("tongue", "tongue", 0.7, 4), A("comma", "sit_hold", 2.4, 4, "sit"), A("gap_soft", "sit", 1.0, 3, "sit"), A("probe_soft", "tongue", 1.0, 2, "talk"), A("scribble_soft", "play", 1.0, 2, "play"), A("canyon_soft", "play", 0.9, 2, "play"), A("blotter_soft", "sit", 0.9, 2, "talk"), A("pencil_soft", "play", 1.0, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  kingsnake: [A("tongue", "tongue", 0.7, 4), A("verdict", "sit_hold", 2.4, 4, "sit"), A("audit_soft", "sit", 1.0, 3, "sit"), A("stripe_soft", "play", 1.0, 2, "play"), A("plumb_soft", "sit", 0.9, 2, "talk"), A("raid_soft", "play", 1.0, 2, "play"), A("band_soft", "play", 1.0, 2, "play"), A("drawer_soft", "sit", 0.9, 2, "talk"), A("freeze", "freeze", 1.4, 2)],
  green_tree_python: [A("tongue", "tongue", 0.7, 4), A("bracelet", "sit_hold", 2.6, 4, "sit"), A("sway_soft", "play", 1.0, 3, "play"), A("jewel_soft", "sit", 1.0, 2, "sit"), A("heat_soft", "sit", 0.9, 2, "talk"), A("bough_soft", "play", 1.0, 2, "play"), A("liana_soft", "play", 1.0, 2, "play"), A("arbor_soft", "sit", 0.9, 2, "talk"), A("freeze", "freeze", 1.4, 2)],
  hognose: [A("tongue", "tongue", 0.7, 4), A("flatten", "sit_hold", 2.4, 4, "sit"), A("playdead", "sit_hold", 2.2, 3, "sit"), A("gape", "gape", 1.2, 2, "talk"), A("shovel_soft", "sit", 1.0, 2, "talk"), A("encore_soft", "play", 1.0, 2, "play"), A("quiver_soft", "play", 1.0, 2, "play"), A("upright_soft", "sit", 0.9, 2, "sit"), A("freeze", "freeze", 1.4, 2)],
  garter: [A("tongue", "tongue", 0.7, 4), A("seam", "sit_hold", 2.4, 4, "sit"), A("rounds_soft", "wiggle", 1.0, 2), A("moss_soft", "sit", 1.0, 2, "sit"), A("fork_soft", "talk", 0.9, 2, "talk"), A("ribbon_soft", "play", 1.0, 2, "play"), A("creek_soft", "wiggle", 1.1, 2), A("freeze", "freeze", 1.4, 2)],
  boa: [A("tongue", "tongue", 0.7, 4), A("hold", "sit_hold", 2.8, 4, "sit"), A("pour_soft", "sit", 1.1, 2, "sit"), A("heft_soft", "sit", 1.0, 2, "sit"), A("oxbow_soft", "wiggle", 1.1, 2), A("anchor_soft", "sit", 1.2, 2, "sit"), A("meander_soft", "wiggle", 1.15, 2), A("freeze", "freeze", 1.5, 2)],
  milk_snake: [A("tongue", "tongue", 0.7, 4), A("rhyme", "sit_hold", 2.4, 4, "sit"), A("rumor_soft", "talk", 1.0, 2, "talk"), A("costume_soft", "sit", 1.0, 2, "sit"), A("cipher_soft", "sit", 1.1, 2, "sit"), A("verse_soft", "talk", 1.05, 2, "talk"), A("tile_soft", "play", 1.0, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  rosy_boa: [A("tongue", "tongue", 0.7, 4), A("pebble", "sit_hold", 2.4, 4, "sit"), A("crevice_soft", "wiggle", 1.0, 2), A("rosy_soft", "play", 1.0, 2, "play"), A("mesa_soft", "sit", 1.0, 2, "sit"), A("dune_soft", "walk", 1.1, 2), A("talus_soft", "sit", 1.05, 2, "sit"), A("freeze", "freeze", 1.4, 2)],
  carpet_python: [A("tongue", "tongue", 0.7, 4), A("legend", "sit_hold", 2.4, 4, "sit"), A("rung_soft", "play", 1.0, 2, "play"), A("contour_soft", "walk", 1.1, 2), A("runner_soft", "walk", 1.0, 2), A("canopy_soft", "play", 1.15, 2, "play"), A("inset_soft", "sit", 1.05, 2, "sit"), A("freeze", "freeze", 1.4, 2)],
  octopus: [A("hide", "sit_hold", 2.4, 4, "sit"), A("sucker_soft", "walk", 1.1, 2), A("jet_soft", "dart", 1.0, 2), A("veil_soft", "play", 1.15, 2, "play"), A("tinker_soft", "play", 1.1, 2, "play"), A("papilla_soft", "sit", 1.2, 2, "sit"), A("ooze_soft", "walk", 1.15, 2), A("freeze", "freeze", 1.4, 2)],
  cuttlefish: [A("hide", "sit_hold", 2.4, 4, "sit"), A("pupil_soft", "talk", 1.1, 2, "talk"), A("chroma_soft", "play", 1.15, 2, "play"), A("hover_soft", "walk", 1.1, 2), A("blot_soft", "play", 1.15, 2, "play"), A("strike_soft", "walk", 1.0, 2), A("zebra_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  nautilus: [A("hide", "sit_hold", 2.4, 4, "sit"), A("siphuncle_soft", "walk", 1.1, 2), A("nacre_soft", "sit", 1.15, 2, "sit"), A("pinhole_soft", "talk", 1.1, 2, "talk"), A("fringe_soft", "play", 1.15, 2, "play"), A("hyponome_soft", "walk", 1.0, 2), A("aperture_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  moon_jelly: [A("hide", "sit_hold", 2.4, 4, "sit"), A("oral_soft", "talk", 1.1, 2, "talk"), A("lucent_soft", "sit", 1.15, 2, "sit"), A("trail_soft", "play", 1.15, 2, "play"), A("medusa_soft", "walk", 1.1, 2), A("rhopalium_soft", "talk", 1.1, 2, "talk"), A("horseshoe_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  sea_star: [A("cling", "sit_hold", 2.4, 4, "sit"), A("righting_soft", "play", 1.15, 2, "play"), A("crawl_soft", "walk", 1.1, 2), A("evert_soft", "talk", 1.1, 2, "talk"), A("penta_soft", "sit", 1.15, 2, "sit"), A("madre_soft", "talk", 1.1, 2, "talk"), A("papula_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  hermit_crab: [A("withdraw", "sit_hold", 2.4, 4, "sit"), A("swap_soft", "play", 1.15, 2, "play"), A("antenna_soft", "talk", 1.1, 2, "talk"), A("scuttle_soft", "walk", 1.1, 2), A("vacancy_soft", "walk", 1.15, 2), A("chela_soft", "play", 1.2, 2, "play"), A("bailer_soft", "talk", 1.1, 2, "talk"), A("freeze", "freeze", 1.4, 2)],
  horseshoe_crab: [A("carapace", "sit_hold", 2.4, 4, "sit"), A("bookgill_soft", "talk", 1.15, 2, "talk"), A("telson_soft", "play", 1.2, 2, "play"), A("furrow_soft", "walk", 1.15, 2), A("fossil_soft", "sit", 1.2, 2, "sit"), A("pusher_soft", "walk", 1.2, 2), A("ocular_soft", "talk", 1.15, 2, "talk"), A("freeze", "freeze", 1.4, 2)],
  seahorse: [A("coil", "sit_hold", 2.4, 4, "sit"), A("buoy_soft", "play", 1.15, 2, "play"), A("siphon_soft", "talk", 1.2, 2, "talk"), A("swivel_soft", "talk", 1.15, 2, "talk"), A("pouch_soft", "sit", 1.2, 2, "sit"), A("dorsal_soft", "walk", 1.2, 2), A("pectoral_soft", "talk", 1.15, 2, "talk"), A("freeze", "freeze", 1.4, 2)],
  manta: [A("span", "sit_hold", 2.4, 4, "sit"), A("wing_soft", "walk", 1.15, 2), A("lobe_soft", "talk", 1.2, 2, "talk"), A("gyre_soft", "play", 1.2, 2, "play"), A("vault_soft", "play", 1.15, 2, "play"), A("breach_soft", "play", 1.25, 2, "play"), A("ram_soft", "talk", 1.2, 2, "talk"), A("freeze", "freeze", 1.4, 2)],
  moray: [A("jamb", "sit_hold", 2.4, 4, "sit"), A("hinge_soft", "talk", 1.2, 2, "talk"), A("pharynx_soft", "play", 1.15, 2, "play"), A("knot_soft", "play", 1.2, 2, "play"), A("lurk_soft", "talk", 1.15, 2, "talk"), A("mucus_soft", "sit", 1.2, 2, "sit"), A("sentry_soft", "talk", 1.15, 2, "talk"), A("freeze", "freeze", 1.4, 2)],
  moss: [A("thatch", "sit_hold", 2.4, 4, "sit"), A("tuft_soft", "talk", 1.2, 2, "talk"), A("bead_soft", "talk", 1.15, 2, "talk"), A("spore_soft", "play", 1.2, 2, "play"), A("cushion_soft", "sit", 1.2, 2, "sit"), A("rhizoid_soft", "sit", 1.15, 2, "sit"), A("seta_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  maidenhair: [A("saucer", "sit_hold", 2.4, 4, "sit"), A("frond_soft", "sit", 1.2, 2, "sit"), A("rachis_soft", "talk", 1.15, 2, "talk"), A("fiddle_soft", "play", 1.2, 2, "play"), A("pinna_soft", "talk", 1.15, 2, "talk"), A("sori_soft", "play", 1.2, 2, "play"), A("bulb_soft", "talk", 1.15, 2, "talk"), A("freeze", "freeze", 1.4, 2)],
  ginkgo: [A("amber", "sit_hold", 2.4, 4, "sit"), A("biloba_soft", "sit", 1.2, 2, "sit"), A("notch_soft", "talk", 1.15, 2, "talk"), A("flutter_soft", "play", 1.2, 2, "play"), A("drop_soft", "talk", 1.15, 2, "talk"), A("dichotomy_soft", "play", 1.2, 2, "play"), A("petiole_soft", "talk", 1.15, 2, "talk"), A("freeze", "freeze", 1.4, 2)],
  oak: [A("bole", "sit_hold", 2.4, 4, "sit"), A("acorn_soft", "talk", 1.15, 2, "talk"), A("sinus_soft", "sit", 1.2, 2, "sit"), A("gall_soft", "talk", 1.15, 2, "talk"), A("taproot_soft", "play", 1.2, 2, "play"), A("catkin_soft", "play", 1.2, 2, "play"), A("tyloses_soft", "talk", 1.15, 2, "talk"), A("freeze", "freeze", 1.4, 2)],
  water_lily: [A("sheen", "sit_hold", 2.4, 4, "sit"), A("pad_soft", "sit", 1.2, 2, "sit"), A("corolla_soft", "talk", 1.15, 2, "talk"), A("rhizome_soft", "play", 1.2, 2, "play"), A("calyx_soft", "talk", 1.15, 2, "talk"), A("peltate_soft", "play", 1.2, 2, "play"), A("hydropote_soft", "talk", 1.15, 2, "talk"), A("freeze", "freeze", 1.4, 2)],
  orchid: [A("unfurl", "unfurl", 1.6, 2, "sit"), A("lean", "lean", 1.4, 3), A("nod", "nod", 0.9, 2, "sit")],
  saguaro: [A("still", "freeze", 2.8, 4), A("lean", "lean", 1.6, 2), A("nod", "nod", 1.2, 1, "sit")],
  venus_flytrap: [A("snap", "snap", 0.7, 2, "play"), A("lean", "lean", 1.4, 3), A("nod", "nod", 1.0, 2, "sit")],
  pitcher: [A("still", "freeze", 3.2, 5), A("lean", "lean", 1.6, 2), A("nod", "nod", 1.0, 1, "sit")],
  sundew: [A("curl", "curl", 2.0, 4, "sit"), A("lean", "lean", 1.4, 2), A("nod", "nod", 0.9, 1, "sit")],
  honeybee: [A("waggle", "waggle", 1.2, 4), A("dart", "dart", 0.8, 2), A("still", "freeze", 1.4, 1)],
  monarch: [A("flutter", "pulse", 1.0, 3), A("migrate", "dart", 1.2, 2), A("still", "freeze", 1.8, 2)],
  luna: [A("still", "freeze", 2.6, 5), A("drift", "bob", 1.6, 2), A("refuse", "freeze", 1.8, 1)],
  firefly: [A("flash", "flash", 0.8, 4), A("lift", "hop", 0.55, 2, "play"), A("still", "freeze", 1.6, 2)],
  darner: [A("hawk", "dart", 0.9, 4), A("hover", "bob", 1.4, 2), A("still", "freeze", 1.2, 1)],
  stick: [A("freeze", "freeze", 3.0, 6), A("still", "sit_hold", 2.4, 2, "sit"), A("walk", "wiggle", 0.8, 1)],
  carpenter_ant: [A("trail", "trail", 1.0, 4), A("dart", "dart", 0.8, 2), A("still", "freeze", 1.2, 1)],
  ladybird: [A("count", "nod", 1.0, 3, "sit"), A("hunt", "dart", 0.8, 2), A("still", "freeze", 1.6, 2)],
  mantis: [A("fold", "fold", 2.0, 4, "sit"), A("strike", "snap", 0.6, 1, "play"), A("still", "freeze", 2.0, 2)],
  cicada: [A("magicicada", "sit_hold", 2.4, 4, "sit"), A("tymbal_soft", "talk", 1.2, 2, "talk"), A("cast_soft", "sit", 1.15, 2, "sit"), A("egress_soft", "play", 1.2, 2, "play"), A("harden_soft", "sit", 1.2, 2, "sit"), A("xylem_soft", "sit", 1.2, 2, "sit"), A("pharaoh_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  bumblebee: [A("thrum", "pulse", 1.2, 4), A("hover", "bob", 1.4, 2), A("still", "freeze", 1.6, 1)],
  carpenter_bee: [A("hover", "bob", 1.4, 3), A("bore", "sit_hold", 2.0, 3, "sit"), A("still", "freeze", 1.6, 2)],
  mason_bee: [A("seal", "sit_hold", 1.8, 4, "sit"), A("hover", "bob", 1.2, 2), A("still", "freeze", 1.6, 2)],
  leafcutter: [A("cut", "nod", 1.2, 4, "sit"), A("hover", "bob", 1.2, 2), A("still", "freeze", 1.6, 2)],
  stingless: [A("pot", "sit_hold", 1.8, 4, "sit"), A("hover", "bob", 1.2, 2), A("still", "freeze", 1.4, 2)],
  sweat_bee: [A("shine", "pulse", 1.0, 4), A("hover", "bob", 1.2, 2), A("still", "freeze", 1.4, 2)],
  mining_bee: [A("dig", "sit_hold", 1.8, 4, "sit"), A("hover", "bob", 1.2, 2), A("still", "freeze", 1.6, 2)],
  honey_drone: [A("hum", "pulse", 1.4, 4), A("hover", "bob", 1.6, 2), A("still", "freeze", 2.0, 3)],
  honey_queen: [A("lay", "sit_hold", 2.2, 5, "sit"), A("walk", "wiggle", 1.0, 1), A("still", "freeze", 2.0, 2)],
  honeycomb: [A("tessera", "sit_hold", 2.4, 4, "sit"), A("festoon_soft", "play", 1.2, 2, "play"), A("capped_soft", "talk", 1.15, 2, "talk"), A("midrib_soft", "talk", 1.2, 2, "talk"), A("stores_soft", "sit", 1.2, 2, "sit"), A("alveoli_soft", "sit", 1.2, 2, "sit"), A("foundation_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  oyster: [A("pleurotus", "sit_hold", 2.4, 4, "sit"), A("lamella_soft", "play", 1.2, 2, "play"), A("imbricate_soft", "talk", 1.15, 2, "talk"), A("lasso_soft", "talk", 1.2, 2, "talk"), A("margin_soft", "sit", 1.2, 2, "sit"), A("sporulate_soft", "sit", 1.2, 2, "sit"), A("hypha_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  fly_agaric: [A("amanita", "sit_hold", 2.4, 4, "sit"), A("annulus_soft", "play", 1.2, 2, "play"), A("volva_soft", "talk", 1.15, 2, "talk"), A("veil_soft", "talk", 1.2, 2, "talk"), A("symbiont_soft", "sit", 1.2, 2, "sit"), A("pileus_soft", "sit", 1.2, 2, "sit"), A("bulb_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  morel: [A("morchella", "sit_hold", 2.4, 4, "sit"), A("alveolus_soft", "play", 1.2, 2, "play"), A("ridge_soft", "talk", 1.15, 2, "talk"), A("ephemeral_soft", "talk", 1.2, 2, "talk"), A("sclerotium_soft", "sit", 1.2, 2, "sit"), A("costa_soft", "sit", 1.2, 2, "sit"), A("hymenium_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  chanterelle: [A("cantharellus", "sit_hold", 2.4, 4, "sit"), A("apricot_soft", "play", 1.2, 2, "play"), A("funnel_soft", "talk", 1.15, 2, "talk"), A("decurrent_soft", "talk", 1.2, 2, "talk"), A("flute_soft", "sit", 1.2, 2, "sit"), A("vase_soft", "sit", 1.2, 2, "sit"), A("plica_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  turkey_tail: [A("trametes", "sit_hold", 2.4, 4, "sit"), A("pore_soft", "play", 1.2, 2, "play"), A("bracket_soft", "talk", 1.15, 2, "talk"), A("band_soft", "talk", 1.2, 2, "talk"), A("leathery_soft", "sit", 1.2, 2, "sit"), A("concentric_soft", "sit", 1.2, 2, "sit"), A("tomentum_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  lions_mane: [A("hericium", "sit_hold", 2.4, 4, "sit"), A("spine_soft", "play", 1.2, 2, "play"), A("icicle_soft", "talk", 1.15, 2, "talk"), A("cascade_soft", "talk", 1.2, 2, "talk"), A("wound_soft", "sit", 1.2, 2, "sit"), A("pompon_soft", "sit", 1.2, 2, "sit"), A("hydnoid_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  puffball: [A("lycoperdon", "sit_hold", 2.4, 4, "sit"), A("ostiole_soft", "play", 1.2, 2, "play"), A("gleba_soft", "talk", 1.15, 2, "talk"), A("peridium_soft", "talk", 1.2, 2, "talk"), A("duff_soft", "sit", 1.2, 2, "sit"), A("gemmate_soft", "sit", 1.2, 2, "sit"), A("capillitium_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  chicken_of_woods: [A("laetiporus", "sit_hold", 2.4, 4, "sit"), A("sulfur_soft", "play", 1.2, 2, "play"), A("rosette_soft", "talk", 1.15, 2, "talk"), A("oak_soft", "talk", 1.2, 2, "talk"), A("soft_soft", "sit", 1.2, 2, "sit"), A("poroid_soft", "sit", 1.2, 2, "sit"), A("cluster_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  yeast: [A("saccharomyces", "sit_hold", 2.4, 4, "sit"), A("bud_soft", "play", 1.2, 2, "play"), A("proof_soft", "talk", 1.15, 2, "talk"), A("levain_soft", "talk", 1.2, 2, "talk"), A("ferment_soft", "sit", 1.2, 2, "sit"), A("ascus_soft", "sit", 1.2, 2, "sit"), A("floc_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  lichen: [A("cladonia", "sit_hold", 2.4, 4, "sit"), A("podetium_soft", "play", 1.2, 2, "play"), A("photobiont_soft", "talk", 1.15, 2, "talk"), A("fruticose_soft", "talk", 1.2, 2, "talk"), A("stone_soft", "sit", 1.2, 2, "sit"), A("soredia_soft", "sit", 1.2, 2, "sit"), A("scyphi_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  photovore: [A("photovore", "sit_hold", 2.4, 4, "sit"), A("photon_soft", "play", 1.2, 2, "play"), A("wavelength_soft", "talk", 1.15, 2, "talk"), A("lumen_soft", "talk", 1.2, 2, "talk"), A("glass_soft", "sit", 1.2, 2, "sit"), A("opsin_soft", "sit", 1.2, 2, "sit"), A("iridophore_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  choir: [A("harmonia", "sit_hold", 2.4, 4, "sit"), A("polyphony_soft", "play", 1.2, 2, "play"), A("partial_soft", "talk", 1.15, 2, "talk"), A("timbre_soft", "talk", 1.2, 2, "talk"), A("resonance_soft", "sit", 1.2, 2, "sit"), A("formant_soft", "sit", 1.2, 2, "sit"), A("dyad_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  nimbus: [A("stratus", "sit_hold", 2.4, 4, "sit"), A("waft_soft", "play", 1.2, 2, "play"), A("billow_soft", "talk", 1.15, 2, "talk"), A("cirrus_soft", "talk", 1.2, 2, "talk"), A("virga_soft", "sit", 1.2, 2, "sit"), A("tholin_soft", "sit", 1.2, 2, "sit"), A("nucleate_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  silica: [A("crescit", "sit_hold", 2.4, 4, "sit"), A("cleavage_soft", "play", 1.2, 2, "play"), A("twinning_soft", "talk", 1.15, 2, "talk"), A("inclusion_soft", "talk", 1.2, 2, "talk"), A("grit_soft", "sit", 1.2, 2, "sit"), A("hopper_soft", "sit", 1.2, 2, "sit"), A("phantom_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  terminator: [A("limitor", "sit_hold", 2.4, 4, "sit"), A("belt_soft", "play", 1.2, 2, "play"), A("penumbra_soft", "talk", 1.15, 2, "talk"), A("eclipse_soft", "talk", 1.2, 2, "talk"), A("limb_soft", "sit", 1.2, 2, "sit"), A("umbra_soft", "sit", 1.2, 2, "sit"), A("syzygy_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  nexus: [A("mesh", "sit_hold", 2.4, 4, "sit"), A("plexus_soft", "play", 1.2, 2, "play"), A("splice_soft", "talk", 1.15, 2, "talk"), A("braid_soft", "talk", 1.2, 2, "talk"), A("weft_soft", "sit", 1.2, 2, "sit"), A("fascicle_soft", "sit", 1.2, 2, "sit"), A("sennit_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  halovore: [A("deliquesce", "sit_hold", 2.4, 4, "sit"), A("halite_soft", "play", 1.2, 2, "play"), A("salina_soft", "talk", 1.15, 2, "talk"), A("rime_soft", "talk", 1.2, 2, "talk"), A("bittern_soft", "sit", 1.2, 2, "sit"), A("ectoine_soft", "sit", 1.2, 2, "sit"), A("sabkha_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  magneton: [A("remanence", "sit_hold", 2.4, 4, "sit"), A("lodestone_soft", "play", 1.2, 2, "play"), A("flux_soft", "talk", 1.15, 2, "talk"), A("azimuth_soft", "talk", 1.2, 2, "talk"), A("dipole_soft", "sit", 1.2, 2, "sit"), A("barkhausen_soft", "sit", 1.2, 2, "sit"), A("hysteresis_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  umbral: [A("caligo", "sit_hold", 2.4, 4, "sit"), A("silhouette_soft", "play", 1.2, 2, "play"), A("adumbrate_soft", "talk", 1.15, 2, "talk"), A("occultation_soft", "talk", 1.2, 2, "talk"), A("antumbra_soft", "sit", 1.2, 2, "sit"), A("sfumato_soft", "sit", 1.2, 2, "sit"), A("tenebrae_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  cyst: [A("cryptobiosis", "sit_hold", 2.4, 4, "sit"), A("lorica_soft", "play", 1.2, 2, "play"), A("tegument_soft", "talk", 1.15, 2, "talk"), A("ampoule_soft", "talk", 1.2, 2, "talk"), A("bradyzoite_soft", "sit", 1.2, 2, "sit"), A("sporocyst_soft", "sit", 1.2, 2, "sit"), A("tachyzoite_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  frog: [A("lentic", "sit_hold", 2.4, 4, "sit"), A("gular_soft", "talk", 1.2, 2, "talk"), A("nictitate_soft", "sit", 1.15, 2, "sit"), A("tympanum_soft", "talk", 1.2, 2, "talk"), A("iliac_soft", "play", 1.2, 2, "play"), A("toepad_soft", "sit", 1.2, 2, "sit"), A("webbing_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  toad: [A("bufonid", "sit_hold", 2.4, 4, "sit"), A("verruca_soft", "play", 1.2, 2, "play"), A("burrow_soft", "sit", 1.15, 2, "sit"), A("parotoid_soft", "sit", 1.2, 2, "sit"), A("tubercle_soft", "play", 1.2, 2, "play"), A("unken_soft", "play", 1.2, 2, "play"), A("cranial_soft", "talk", 1.2, 2, "talk"), A("freeze", "freeze", 1.4, 2)],
  newt: [A("caudate", "sit_hold", 2.4, 4, "sit"), A("crest_soft", "play", 1.2, 2, "play"), A("caudal_soft", "walk", 1.15, 2, "play"), A("filament_soft", "sit", 1.2, 2, "sit"), A("costal_soft", "walk", 1.2, 2, "play"), A("hedonic_soft", "sit", 1.2, 2, "sit"), A("aposematic_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  salamander: [A("ambystomid", "sit_hold", 2.4, 4, "sit"), A("maculate_soft", "play", 1.2, 2, "play"), A("litter_soft", "walk", 1.15, 2, "play"), A("cutaneous_soft", "sit", 1.2, 2, "sit"), A("nasolabial_soft", "sit", 1.2, 2, "sit"), A("mental_soft", "sit", 1.2, 2, "sit"), A("granular_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  caecilian: [A("gymnophion", "sit_hold", 2.4, 4, "sit"), A("annulate_soft", "play", 1.2, 2, "play"), A("fossorial_soft", "walk", 1.15, 2, "play"), A("tentacular_soft", "sit", 1.2, 2, "sit"), A("hydrostatic_soft", "play", 1.2, 2, "play"), A("stegos_soft", "sit", 1.2, 2, "sit"), A("dualjaw_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  crayfish: [A("astacid", "sit_hold", 2.4, 4, "sit"), A("chelate_soft", "play", 1.2, 2, "play"), A("caridoid_soft", "play", 1.15, 2, "play"), A("chimney_soft", "walk", 1.2, 2, "play"), A("antennule_soft", "sit", 1.2, 2, "sit"), A("scaph_soft", "sit", 1.2, 2, "sit"), A("meral_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  pond_snail: [A("lymnaeid", "sit_hold", 2.4, 4, "sit"), A("radula_soft", "play", 1.2, 2, "play"), A("pedal_soft", "walk", 1.2, 2, "play"), A("pneumostome_soft", "sit", 1.2, 2, "sit"), A("ommatophore_soft", "sit", 1.2, 2, "sit"), A("odontophore_soft", "play", 1.2, 2, "play"), A("neuston_soft", "walk", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  mussel: [A("unionid", "sit_hold", 2.4, 4, "sit"), A("adductor_soft", "play", 1.2, 2, "play"), A("protractor_soft", "walk", 1.2, 2, "play"), A("inhalant_soft", "sit", 1.2, 2, "sit"), A("ctenidium_soft", "sit", 1.2, 2, "sit"), A("ligament_soft", "play", 1.2, 2, "play"), A("glochid_soft", "walk", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  leech: [A("hirudinean", "sit_hold", 2.4, 4, "sit"), A("acetabulum_soft", "sit", 1.2, 2, "sit"), A("prostomium_soft", "play", 1.2, 2, "play"), A("looping_soft", "walk", 1.2, 2, "play"), A("undulatory_soft", "play", 1.2, 2, "play"), A("botryoidal_soft", "play", 1.2, 2, "play"), A("auricle_soft", "walk", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  stickleback: [A("gasterosteid", "sit_hold", 2.4, 4, "sit"), A("spiggin_soft", "sit", 1.2, 2, "sit"), A("zigzag_soft", "walk", 1.2, 2, "play"), A("spinous_soft", "play", 1.2, 2, "play"), A("fanning_soft", "play", 1.2, 2, "play"), A("nuptial_soft", "play", 1.2, 2, "play"), A("pelvic_soft", "walk", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  paramecium: [A("ciliophora", "sit_hold", 2.4, 4, "sit"), A("cilia_soft", "sit", 1.2, 2, "sit"), A("pellicle_soft", "walk", 1.2, 2, "play"), A("cytostome_soft", "play", 1.2, 2, "play"), A("vacuole_soft", "play", 1.2, 2, "play"), A("trichocyst_soft", "play", 1.2, 2, "play"), A("avoiding_soft", "walk", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  amoeba: [A("proteus", "sit_hold", 2.4, 4, "sit"), A("pseudopod_soft", "sit", 1.2, 2, "sit"), A("ectoplasm_soft", "walk", 1.2, 2, "play"), A("endoplasm_soft", "play", 1.2, 2, "play"), A("foodcup_soft", "play", 1.2, 2, "play"), A("uroid_soft", "play", 1.2, 2, "play"), A("streaming_soft", "walk", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  euglena: [A("euglenid", "sit_hold", 2.4, 4, "sit"), A("eyespot_soft", "sit", 1.2, 2, "sit"), A("flagellum_soft", "walk", 1.2, 2, "play"), A("chloroplast_soft", "play", 1.2, 2, "play"), A("phototaxis_soft", "play", 1.2, 2, "play"), A("metaboly_soft", "play", 1.2, 2, "play"), A("paramylon_soft", "walk", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  volvox: [A("coenobium", "sit_hold", 2.4, 4, "sit"), A("colony_soft", "walk", 1.2, 2, "play"), A("inversion_soft", "play", 1.2, 2, "play"), A("phialopore_soft", "sit", 1.2, 2, "sit"), A("somatic_soft", "play", 1.2, 2, "play"), A("daughter_soft", "sit", 1.2, 2, "sit"), A("gonidia_soft", "walk", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  diatom: [A("navicula", "sit_hold", 2.4, 4, "sit"), A("frustule_soft", "walk", 1.2, 2, "play"), A("raphe_soft", "play", 1.2, 2, "play"), A("girdle_soft", "sit", 1.2, 2, "sit"), A("oilstore_soft", "play", 1.2, 2, "play"), A("pennate_soft", "sit", 1.2, 2, "sit"), A("epitheca_soft", "walk", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  kelp: [A("meristem", "sit_hold", 2.4, 4, "sit"), A("holdfast_soft", "walk", 1.2, 2, "play"), A("haptera_soft", "play", 1.2, 2, "play"), A("blade_soft", "sit", 1.2, 2, "sit"), A("pneumatocyst_soft", "play", 1.2, 2, "play"), A("sorus_soft", "sit", 1.2, 2, "sit"), A("sporophyll_soft", "walk", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  chlamydomonas: [A("palmella", "sit_hold", 2.4, 4, "sit"), A("biflagellate_soft", "walk", 1.2, 2, "play"), A("cupplast_soft", "play", 1.2, 2, "play"), A("stigma_soft", "sit", 1.2, 2, "sit"), A("pyrenoid_soft", "play", 1.2, 2, "play"), A("cellwall_soft", "sit", 1.2, 2, "sit"), A("wetplate_soft", "walk", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  stentor: [A("introversus", "sit_hold", 2.4, 4, "sit"), A("adoral_soft", "open", 1.2, 2, "sit"), A("myoneme_soft", "sit", 1.2, 2, "sit"), A("membranelle_soft", "play", 1.2, 2, "play"), A("holdfoot_soft", "sit", 1.2, 2, "sit"), A("vortex_soft", "walk", 1.2, 2, "play"), A("beadedmac_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  coli: [A("nucleoid", "sit_hold", 2.4, 4, "sit"), A("runandtumble_soft", "walk", 1.2, 2, "play"), A("binaryfission_soft", "sit", 1.2, 2, "sit"), A("pilus_soft", "play", 1.2, 2, "play"), A("chemotax_soft", "sit", 1.2, 2, "sit"), A("fimbria_soft", "walk", 1.2, 2, "play"), A("flagmotor_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  haloarchaea: [A("retinal", "sit_hold", 2.4, 4, "sit"), A("bacteriorhodopsin_soft", "walk", 1.2, 2, "play"), A("saltsquare_soft", "sit", 1.2, 2, "sit"), A("gasvesicle_soft", "play", 1.2, 2, "play"), A("carotenoid_soft", "sit", 1.2, 2, "sit"), A("archaellum_soft", "walk", 1.2, 2, "play"), A("brinedrift_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  crow: [A("caw", "talk", 0.8, 4, "talk"), A("hop_step", "hop", 0.5, 3, "play"), A("preen", "groom", 1.5, 3, "sit"), A("cock_look", "nod", 1.2, 3, "sit"), A("bill_wipe", "wiggle", 0.9, 2, "sit"), A("alert", "freeze", 1.8, 2), A("wing_settle", "pulse", 0.9, 2, "play"), A("perch", "sit_hold", 2.2, 2, "sit")],
  raven: [A("kronk", "talk", 0.9, 4, "talk"), A("hop_step", "hop", 0.55, 3, "play"), A("preen", "groom", 1.5, 3, "sit"), A("ruff_flare", "pulse", 1.1, 3, "sit"), A("head_cock", "nod", 1.2, 3, "sit"), A("bill_wipe", "wiggle", 0.9, 2, "sit"), A("alert", "freeze", 1.8, 2), A("perch", "sit_hold", 2.4, 2, "sit")],
  barn_owl: [A("hiss", "talk", 0.8, 4, "talk"), A("swivel", "nod", 1.2, 3, "sit"), A("preen", "groom", 1.5, 3, "sit"), A("disk_listen", "freeze", 1.4, 3, "sit"), A("soft_settle", "lean", 1.1, 2, "sit"), A("alert", "freeze", 1.8, 2), A("wing_fold", "fold", 0.9, 2, "sit"), A("perch", "sit_hold", 2.4, 2, "sit")],
  red_tail: [A("soar", "pulse", 1.4, 4), A("stoop", "dart", 0.8, 3, "play"), A("still", "freeze", 1.6, 2), A("preen", "groom", 1.5, 3, "sit"), A("keeyer", "talk", 0.9, 3, "talk"), A("alert", "freeze", 1.8, 2), A("wing_settle", "pulse", 0.9, 2, "play"), A("perch", "sit_hold", 2.4, 2, "sit")],
  chickadee: [A("dee", "talk", 0.7, 4, "talk"), A("hop_step", "hop", 0.45, 3, "play"), A("preen", "groom", 1.5, 3, "sit"), A("fee_bee", "talk", 0.9, 3, "talk"), A("alert", "freeze", 1.8, 2), A("wing_flick", "pulse", 0.9, 2, "play"), A("cache_peek", "dart", 0.8, 2, "sit"), A("perch", "sit_hold", 2.4, 2, "sit")],
  robin: [A("hop", "hop", 0.5, 4, "play"), A("pull", "nod", 1.0, 3, "sit"), A("preen", "groom", 1.5, 3, "sit"), A("carol_soft", "talk", 0.9, 3, "talk"), A("alert", "freeze", 1.8, 2), A("wing_flick", "pulse", 0.9, 2, "play"), A("breast_puff", "pulse", 1.0, 2, "sit"), A("perch", "sit_hold", 2.4, 2, "sit")],
  mallard: [A("dabble", "eat", 1.2, 4, "eat"), A("waddle", "wiggle", 1.0, 3, "play"), A("preen", "groom", 1.5, 3, "sit"), A("quack_soft", "talk", 0.9, 3, "talk"), A("alert", "freeze", 1.8, 2), A("wing_flick", "pulse", 0.9, 2, "play"), A("upend_soft", "pulse", 1.2, 2, "sit"), A("loaf", "sit_hold", 2.4, 2, "sit")],
  canada_goose: [A("honk", "talk", 0.8, 4, "talk"), A("walk", "wiggle", 1.0, 3, "play"), A("preen", "groom", 1.5, 3, "sit"), A("graze_soft", "eat", 1.2, 3, "eat"), A("alert", "freeze", 1.8, 2), A("wing_flick", "pulse", 0.9, 2, "play"), A("hiss_soft", "pulse", 1.0, 2, "sit"), A("loaf", "sit_hold", 2.4, 2, "sit")],
  pileated: [A("drum", "snap", 0.7, 4, "play"), A("hop_step", "hop", 0.5, 3, "play"), A("preen", "groom", 1.4, 3, "sit"), A("excavate_soft", "eat", 1.2, 3, "play"), A("crest_soft", "pulse", 0.9, 2, "sit"), A("kuk_soft", "talk", 0.8, 3, "talk"), A("brace", "freeze", 1.6, 2, "sit"), A("loaf", "sit_hold", 2.4, 2, "sit")],
  hummingbird: [A("hover", "bob", 1.2, 5), A("dart", "dart", 0.7, 3, "play"), A("sip", "eat", 0.8, 3, "eat"), A("preen", "groom", 1.4, 3, "sit"), A("chip_soft", "talk", 0.8, 3, "talk"), A("gorget_soft", "pulse", 0.9, 2, "sit"), A("alert", "freeze", 1.6, 2, "sit"), A("perch", "sit_hold", 2.4, 2, "sit")],
  orb_weaver: [A("araneus", "sit_hold", 2.4, 4, "sit"), A("radiate_soft", "walk", 1.2, 2, "play"), A("stabilimentum_soft", "sit", 1.2, 2, "sit"), A("swathe_soft", "play", 1.2, 2, "play"), A("strum_soft", "sit", 1.2, 2, "sit"), A("dragline_soft", "walk", 1.2, 2, "play"), A("viscid_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  jumping_spider: [A("phidippus", "sit_hold", 2.4, 4, "sit"), A("orient_soft", "walk", 1.2, 2, "play"), A("saccade_soft", "sit", 1.2, 2, "sit"), A("palp_soft", "play", 1.2, 2, "play"), A("safetyline_soft", "sit", 1.2, 2, "sit"), A("ame_soft", "walk", 1.2, 2, "play"), A("scopula_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  wolf_spider: [A("tigrosa", "sit_hold", 2.4, 4, "sit"), A("cursor_soft", "walk", 1.2, 2, "play"), A("eggsac_soft", "sit", 1.2, 2, "sit"), A("spiderling_soft", "play", 1.2, 2, "play"), A("eyeshine_soft", "sit", 1.2, 2, "sit"), A("spur_soft", "walk", 1.2, 2, "play"), A("apron_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  tarantula: [A("aphonopelma", "sit_hold", 2.4, 4, "sit"), A("urticate_soft", "walk", 1.2, 2, "play"), A("threat_soft", "sit", 1.2, 2, "sit"), A("cork_soft", "play", 1.2, 2, "play"), A("ecdysis_soft", "sit", 1.2, 2, "sit"), A("rastellum_soft", "walk", 1.2, 2, "play"), A("apophysis_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  widow: [A("latrodectus", "sit_hold", 2.4, 4, "sit"), A("hourglass_soft", "sit", 1.2, 2, "sit"), A("tangle_soft", "talk", 1.2, 2, "talk"), A("wrap_soft", "play", 1.2, 2, "play"), A("gumfoot_soft", "play", 1.2, 2, "play"), A("combfoot_soft", "walk", 1.2, 2, "play"), A("theridiid_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  harvestman: [A("phalangium", "sit_hold", 2.4, 4, "sit"), A("legwave_soft", "talk", 1.2, 2, "talk"), A("oscillate_soft", "play", 1.2, 2, "play"), A("autotomy_soft", "play", 1.2, 2, "play"), A("gregarious_soft", "sit", 1.2, 2, "sit"), A("ozopore_soft", "play", 1.2, 2, "play"), A("leiobunum_soft", "walk", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  scorpion: [A("centruroides", "sit_hold", 2.4, 4, "sit"), A("pedipalp_soft", "talk", 1.2, 2, "talk"), A("metasoma_soft", "play", 1.2, 2, "play"), A("fluoresce_soft", "sit", 1.2, 2, "sit"), A("sanddig_soft", "play", 1.2, 2, "play"), A("pectines_soft", "talk", 1.2, 2, "talk"), A("booklung_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  vinegaroon: [A("mastigoproctus", "sit_hold", 2.4, 4, "sit"), A("caudalwhip_soft", "talk", 1.2, 2, "talk"), A("acetic_soft", "play", 1.2, 2, "play"), A("palpcrush_soft", "play", 1.2, 2, "play"), A("trayburrow_soft", "play", 1.2, 2, "play"), A("pygidial_soft", "talk", 1.2, 2, "talk"), A("antenniform_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  tick: [A("ixodes", "sit_hold", 2.4, 4, "sit"), A("quest_soft", "talk", 1.2, 2, "talk"), A("haller_soft", "talk", 1.2, 2, "talk"), A("hypostome_soft", "play", 1.2, 2, "play"), A("engorge_soft", "play", 1.2, 2, "play"), A("scutum_soft", "sit", 1.2, 2, "sit"), A("capitulum_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  solifuge: [A("eremobates", "sit_hold", 2.4, 4, "sit"), A("malleoli_soft", "talk", 1.2, 2, "talk"), A("suctorial_soft", "talk", 1.2, 2, "talk"), A("chelicrush_soft", "play", 1.2, 2, "play"), A("sprintburst_soft", "play", 1.2, 2, "play"), A("propeltidium_soft", "sit", 1.2, 2, "sit"), A("tracheate_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  deer: [A("odocoileus", "sit_hold", 2.4, 4, "sit"), A("flagtail_soft", "play", 1.2, 2, "play"), A("edgebrowse_soft", "talk", 1.2, 2, "talk"), A("earswivel_soft", "talk", 1.2, 2, "talk"), A("forestamp_soft", "play", 1.2, 2, "play"), A("stotbound_soft", "play", 1.2, 2, "play"), A("snortblow_soft", "talk", 1.2, 2, "talk"), A("freeze", "freeze", 1.4, 2)],
  bat: [A("eptesicus", "sit_hold", 2.4, 4, "sit"), A("wingwrap_soft", "play", 1.2, 2, "play"), A("traguscup_soft", "talk", 1.2, 2, "talk"), A("thumbcrawl_soft", "play", 1.2, 2, "play"), A("duskhang_soft", "play", 1.2, 2, "play"), A("echolocate_soft", "talk", 1.2, 2, "talk"), A("calcar_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  squirrel: [A("sciurus", "sit_hold", 2.4, 4, "sit"), A("nutbury_soft", "play", 1.2, 2, "play"), A("tailflick_soft", "play", 1.2, 2, "play"), A("cheekpouch_soft", "talk", 1.2, 2, "talk"), A("branchleap_soft", "play", 1.2, 2, "play"), A("barkscramble_soft", "play", 1.2, 2, "play"), A("scold_soft", "talk", 1.2, 2, "talk"), A("freeze", "freeze", 1.4, 2)],
  otter: [A("lontra", "sit_hold", 2.4, 4, "sit"), A("bellyglide_soft", "play", 1.2, 2, "play"), A("corkroll_soft", "play", 1.2, 2, "play"), A("shellcrunch_soft", "talk", 1.2, 2, "talk"), A("whiskernudge_soft", "play", 1.2, 2, "play"), A("denslide_soft", "play", 1.2, 2, "play"), A("spraint_soft", "talk", 1.2, 2, "talk"), A("freeze", "freeze", 1.4, 2)],
  raccoon: [A("procyon", "sit_hold", 2.4, 4, "sit"), A("pawdouse_soft", "play", 1.2, 2, "play"), A("litterdig_soft", "play", 1.2, 2, "play"), A("rearstand_soft", "talk", 1.2, 2, "talk"), A("maskpeer_soft", "talk", 1.2, 2, "talk"), A("dexterous_soft", "play", 1.2, 2, "play"), A("ringtail_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  skunk: [A("mephitis", "sit_hold", 2.4, 4, "sit"), A("footstomp_soft", "play", 1.2, 2, "play"), A("duffgrub_soft", "play", 1.2, 2, "play"), A("handwarn_soft", "talk", 1.2, 2, "talk"), A("plumeaim_soft", "talk", 1.2, 2, "talk"), A("scentraise_soft", "play", 1.2, 2, "play"), A("plantigrade_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  opossum: [A("didelphis", "sit_hold", 2.4, 4, "sit"), A("stillfeign_soft", "play", 1.2, 2, "play"), A("scrapnose_soft", "play", 1.2, 2, "play"), A("gapegrin_soft", "talk", 1.2, 2, "talk"), A("raftergrip_soft", "talk", 1.2, 2, "talk"), A("pouchcarry_soft", "play", 1.2, 2, "play"), A("prehensile_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  beaver: [A("castor", "sit_hold", 2.4, 4, "sit"), A("woodfell_soft", "play", 1.2, 2, "play"), A("paddleclap_soft", "play", 1.2, 2, "play"), A("lodgehaul_soft", "talk", 1.2, 2, "talk"), A("mudpack_soft", "talk", 1.2, 2, "talk"), A("aspen_soft", "play", 1.2, 2, "play"), A("divehush_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  capybara: [A("hydrochoerus", "sit_hold", 2.4, 4, "sit"), A("mudwallow_soft", "sit", 1.2, 2, "sit"), A("sedgecrop_soft", "play", 1.2, 2, "play"), A("alarmwhistle_soft", "talk", 1.2, 2, "talk"), A("pilelean_soft", "talk", 1.2, 2, "talk"), A("scentgland_soft", "talk", 1.2, 2, "talk"), A("socialpile_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  porcupine: [A("erethizon", "sit_hold", 2.4, 4, "sit"), A("toothclack_soft", "talk", 1.2, 2, "talk"), A("boleclimb_soft", "play", 1.2, 2, "play"), A("cambiumchew_soft", "play", 1.2, 2, "play"), A("dorsoflare_soft", "talk", 1.2, 2, "talk"), A("guardhair_soft", "talk", 1.2, 2, "talk"), A("pinehush_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  black_bear: [A("ursus", "sit_hold", 2.4, 4, "sit"), A("bipedrise_soft", "talk", 1.2, 2, "talk"), A("clawscar_soft", "play", 1.2, 2, "play"), A("berrypluck_soft", "play", 1.2, 2, "play"), A("denscrape_soft", "talk", 1.2, 2, "talk"), A("bluffhuff_soft", "talk", 1.2, 2, "talk"), A("mastforage_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  gecko: [A("hemidactylus", "sit_hold", 2.4, 4, "sit"), A("toepadcling_soft", "sit", 1.2, 2, "sit"), A("vocalclick_soft", "talk", 1.2, 2, "talk"), A("lickeye_soft", "play", 1.2, 2, "play"), A("mothstalk_soft", "talk", 1.2, 2, "talk"), A("setae_soft", "talk", 1.2, 2, "talk"), A("lamphush_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  anole: [A("anolis", "sit_hold", 2.4, 4, "sit"), A("dewlapflash_soft", "sit", 1.2, 2, "sit"), A("pushupshow_soft", "play", 1.2, 2, "play"), A("hueshift_soft", "talk", 1.2, 2, "talk"), A("preyinch_soft", "talk", 1.2, 2, "talk"), A("nuchal_soft", "talk", 1.2, 2, "talk"), A("vinehush_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  skink: [A("plestiodon", "sit_hold", 2.4, 4, "sit"), A("tailbluff_soft", "sit", 1.2, 2, "sit"), A("litterdash_soft", "play", 1.2, 2, "play"), A("tongueflick_soft", "talk", 1.2, 2, "talk"), A("sunbask_soft", "sit", 1.2, 2, "sit"), A("bluetail_soft", "talk", 1.2, 2, "talk"), A("stonehush_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  chameleon: [A("calyptratus", "sit_hold", 2.4, 4, "sit"), A("veilflush_soft", "sit", 1.2, 2, "sit"), A("turretgaze_soft", "talk", 1.2, 2, "talk"), A("tongueshot_soft", "play", 1.2, 2, "play"), A("branchrock_soft", "sit", 1.2, 2, "sit"), A("casque_soft", "talk", 1.2, 2, "talk"), A("zygodactyl_soft", "play", 1.2, 2, "play"), A("freeze", "freeze", 1.4, 2)],
  horned_lizard: [A("phrynosoma", "sit_hold", 2.4, 4, "sit"), A("bloodsquirt_soft", "play", 1.2, 2, "play"), A("antfeast_soft", "play", 1.2, 2, "play"), A("freezeflat_soft", "sit", 1.2, 2, "sit"), A("rainharvest_soft", "talk", 1.2, 2, "talk"), A("coronal_soft", "talk", 1.2, 2, "talk"), A("sandhush_soft", "sit", 1.2, 2, "sit"), A("freeze", "freeze", 1.4, 2)],
  alligator: [A("mississippi", "sit_hold", 2.4, 4, "sit"), A("bellowbank_soft", "talk", 1.2, 2, "talk"), A("deathcoil_soft", "play", 1.2, 2, "play"), A("snoutspy_soft", "play", 1.2, 2, "play"), A("baskgape_soft", "sit", 1.2, 2, "sit"), A("osteoderm_soft", "sit", 1.2, 2, "sit"), A("scutehush_soft", "sit", 1.2, 2, "sit"), A("freeze", "freeze", 1.4, 2)],
  crocodile: [A("acutus", "sit_hold", 2.4, 4, "sit"), A("toothlock_soft", "talk", 1.2, 2, "talk"), A("highwalk_soft", "play", 1.2, 2, "play"), A("nestpit_soft", "play", 1.2, 2, "play"), A("salttear_soft", "sit", 1.2, 2, "sit"), A("vsnout_soft", "sit", 1.2, 2, "sit"), A("keelridge_soft", "sit", 1.2, 2, "sit"), A("freeze", "freeze", 1.4, 2)],
  snapper: [A("serpentina", "sit_hold", 2.4, 4, "sit"), A("ambushgape_soft", "talk", 1.2, 2, "talk"), A("mudbury_soft", "sit", 1.2, 2, "sit"), A("necklunge_soft", "play", 1.2, 2, "play"), A("banksnap_soft", "play", 1.2, 2, "play"), A("serrated_soft", "sit", 1.2, 2, "sit"), A("plastron_soft", "sit", 1.2, 2, "sit"), A("freeze", "freeze", 1.4, 2)],
  box_turtle: [A("carolinae", "sit_hold", 2.4, 4, "sit"), A("hingeshut_soft", "sit", 1.2, 2, "sit"), A("berryforage_soft", "play", 1.2, 2, "play"), A("shellsoak_soft", "sit", 1.2, 2, "sit"), A("nestscrape_soft", "play", 1.2, 2, "play"), A("dome_soft", "sit", 1.2, 2, "sit"), A("leafhush_soft", "sit", 1.2, 2, "sit"), A("freeze", "freeze", 1.4, 2)],
  tuatara: [A("punctatus", "sit_hold", 2.4, 4, "sit"), A("parietalgaze_soft", "talk", 1.2, 2, "talk"), A("nuchalrise_soft", "play", 1.2, 2, "play"), A("burrowsit_soft", "sit", 1.2, 2, "sit"), A("eggseize_soft", "play", 1.2, 2, "play"), A("acrodont_soft", "sit", 1.2, 2, "sit"), A("diapsid_soft", "sit", 1.2, 2, "sit"), A("freeze", "freeze", 1.4, 2)],
  bass: [A("salmoides", "sit_hold", 2.4, 4, "sit"), A("coverstrike_soft", "play", 1.2, 2, "play"), A("bedfan_soft", "sit", 1.2, 2, "sit"), A("surboil_soft", "play", 1.2, 2, "play"), A("latline_soft", "talk", 1.2, 2, "talk"), A("maxilla_soft", "sit", 1.2, 2, "sit"), A("weedline_soft", "sit", 1.2, 2, "sit"), A("freeze", "freeze", 1.4, 2)],
  brook_trout: [A("fontinalis", "sit_hold", 2.4, 4, "sit"), A("driftfeed_soft", "talk", 1.2, 2, "talk"), A("insectrise_soft", "play", 1.2, 2, "play"), A("reddscrape_soft", "sit", 1.2, 2, "sit"), A("vermicflash_soft", "play", 1.2, 2, "play"), A("adipose_soft", "sit", 1.2, 2, "sit"), A("coldriffle_soft", "sit", 1.2, 2, "sit"), A("freeze", "freeze", 1.4, 2)],
  catfish: [A("ictalurus", "sit_hold", 2.4, 4, "sit"), A("barbelprobe_soft", "talk", 1.2, 2, "talk"), A("cavitynest_soft", "sit", 1.2, 2, "sit"), A("mudcloud_soft", "play", 1.2, 2, "play"), A("caudalthrash_soft", "play", 1.2, 2, "play"), A("channel_soft", "sit", 1.2, 2, "sit"), A("mudhush_soft", "sit", 1.2, 2, "sit"), A("freeze", "freeze", 1.4, 2)],
  bluegill: [A("macrochirus", "sit_hold", 2.4, 4, "sit"), A("platehover_soft", "sit", 1.2, 2, "sit"), A("colonyfan_soft", "sit", 1.2, 2, "sit"), A("insectpeck_soft", "talk", 1.2, 2, "talk"), A("gillflare_soft", "play", 1.2, 2, "play"), A("opercle_soft", "play", 1.2, 2, "play"), A("earflap_soft", "sit", 1.2, 2, "sit"), A("freeze", "freeze", 1.4, 2)],
  perch: [A("flavescens", "sit_hold", 2.4, 4, "sit"), A("tigerbar_soft", "sit", 1.2, 2, "sit"), A("schoolhover_soft", "sit", 1.2, 2, "sit"), A("duskrise_soft", "talk", 1.2, 2, "talk"), A("ribbonspawn_soft", "play", 1.2, 2, "play"), A("spiny_soft", "play", 1.2, 2, "play"), A("yellowflank_soft", "sit", 1.2, 2, "sit"), A("freeze", "freeze", 1.4, 2)],
  pike: [A("lucius", "sit_hold", 2.4, 4, "sit"), A("weedambush_soft", "sit", 1.2, 2, "sit"), A("scurve_soft", "play", 1.2, 2, "play"), A("toothclamp_soft", "talk", 1.2, 2, "talk"), A("torpedoglide_soft", "sit", 1.2, 2, "sit"), A("duckbill_soft", "talk", 1.2, 2, "talk"), A("lateral_soft", "sit", 1.2, 2, "sit"), A("freeze", "freeze", 1.4, 2)],
  walleye: [A("vitreus", "sit_hold", 2.4, 4, "sit"), A("tapetumglow_soft", "talk", 1.2, 2, "talk"), A("duskcruise_soft", "sit", 1.2, 2, "sit"), A("gravelspawn_soft", "play", 1.2, 2, "play"), A("softfinhover_soft", "sit", 1.2, 2, "sit"), A("canine_soft", "talk", 1.2, 2, "talk"), A("glassy_soft", "sit", 1.2, 2, "sit"), A("freeze", "freeze", 1.4, 2)],
  paddlefish: [A("spathula", "sit_hold", 2.4, 4, "sit"), A("rostrumscan_soft", "talk", 1.2, 2, "talk"), A("filterram_soft", "play", 1.2, 2, "play"), A("rivercruise_soft", "sit", 1.2, 2, "sit"), A("eggcast_soft", "play", 1.2, 2, "play"), A("ampullae_soft", "talk", 1.2, 2, "talk"), A("cartilaginous_soft", "sit", 1.2, 2, "sit"), A("freeze", "freeze", 1.4, 2)],
  lamprey: [A("disk", "sit_hold", 2.2, 5, "sit"), A("cling", "freeze", 2.0, 3), A("still", "freeze", 1.8, 2)],
  american_eel: [A("swim", "wiggle", 1.4, 5), A("silver", "pulse", 1.0, 3), A("still", "freeze", 1.6, 2)],
  house_centipede: [A("hunt", "dart", 0.5, 5), A("walk", "wiggle", 0.8, 3), A("still", "freeze", 1.4, 2)],
  millipede: [A("walk", "wiggle", 1.6, 5), A("oil", "puff", 1.2, 3, "sit"), A("still", "freeze", 2.0, 2)],
  pillbug: [A("roll", "sit_hold", 2.2, 5, "sit"), A("walk", "wiggle", 1.0, 3), A("still", "freeze", 1.6, 2)],
  earthworm: [A("cast", "nod", 1.4, 5, "sit"), A("crawl", "wiggle", 1.2, 3), A("still", "freeze", 1.8, 2)],
  velvet_worm: [A("jet", "snap", 0.7, 4, "play"), A("walk", "wiggle", 1.0, 3), A("still", "freeze", 1.8, 2)],
  springtail: [A("hop", "hop", 0.5, 5, "play"), A("still", "freeze", 1.4, 3), A("walk", "wiggle", 0.8, 2)],
  tardigrade: [A("tun", "sit_hold", 2.4, 5, "sit"), A("walk", "wiggle", 1.2, 3), A("still", "freeze", 2.0, 2)],
  planarian: [A("split", "pulse", 1.2, 5), A("glide", "wiggle", 1.4, 3), A("still", "freeze", 1.8, 2)],
  nematode: [A("thrash", "wiggle", 1.0, 5), A("still", "freeze", 1.6, 3), A("sit", "sit_hold", 1.8, 2, "sit")],
  amphipod: [A("scud", "wiggle", 1.2, 5), A("dart", "dart", 0.6, 3), A("still", "freeze", 1.6, 2)],
  fiddler_crab: [A("wave", "pulse", 0.8, 5), A("walk", "wiggle", 1.0, 3), A("still", "freeze", 1.6, 2)],
  ghost_crab: [A("run", "dart", 0.5, 5), A("walk", "wiggle", 0.8, 3), A("still", "freeze", 1.4, 2)],
  limpet: [A("clamp", "sit_hold", 2.4, 5, "sit"), A("rasp", "nod", 1.2, 3), A("still", "freeze", 2.0, 2)],
  barnacle: [A("kick", "pulse", 1.0, 5), A("still", "freeze", 2.2, 4), A("sit", "sit_hold", 2.0, 2, "sit")],
  chiton: [A("graze", "wiggle", 1.2, 5), A("plate", "sit_hold", 1.8, 3, "sit"), A("still", "freeze", 1.8, 2)],
  periwinkle: [A("rasp", "nod", 1.4, 5), A("sit", "sit_hold", 1.8, 3, "sit"), A("still", "freeze", 1.8, 2)],
  sand_dollar: [A("bury", "sit_hold", 2.2, 5, "sit"), A("flat", "freeze", 2.0, 3), A("still", "freeze", 1.8, 2)],
  sea_urchin: [A("walk", "wiggle", 1.2, 5), A("spine", "pulse", 1.0, 3), A("still", "freeze", 1.8, 2)],
  knobbed_whelk: [A("hunt", "wiggle", 1.2, 5), A("sit", "sit_hold", 1.8, 3, "sit"), A("still", "freeze", 1.8, 2)],
  lugworm: [A("heap", "nod", 1.4, 5, "sit"), A("cast", "wiggle", 1.2, 3), A("still", "freeze", 1.8, 2)],
  field_cricket: [A("chirp", "talk", 0.8, 5, "talk"), A("walk", "wiggle", 1.0, 3), A("still", "freeze", 1.6, 2)],
  katydid: [A("still", "sit_hold", 2.4, 5, "sit"), A("blade", "freeze", 2.0, 3), A("walk", "wiggle", 0.9, 1)],
  grasshopper: [A("vault", "hop", 0.55, 5, "play"), A("walk", "wiggle", 1.0, 3), A("still", "freeze", 1.6, 2)],
  swallowtail: [A("banner", "pulse", 1.0, 4), A("flutter", "bob", 1.2, 3), A("still", "freeze", 1.8, 2)],
  jewelwing: [A("jewel", "pulse", 1.2, 4), A("hover", "bob", 1.4, 3), A("still", "freeze", 1.6, 2)],
  lacewing: [A("lace", "pulse", 1.0, 4), A("hover", "bob", 1.2, 3), A("still", "freeze", 1.6, 2)],
  earwig: [A("raise", "sit_hold", 1.8, 5, "sit"), A("walk", "wiggle", 1.0, 3), A("still", "freeze", 1.6, 2)],
  acorn_weevil: [A("drill", "sit_hold", 2.0, 5, "sit"), A("walk", "wiggle", 1.0, 3), A("still", "freeze", 1.8, 2)],
  click_beetle: [A("click", "pulse", 0.7, 5), A("walk", "wiggle", 1.0, 3), A("still", "freeze", 1.6, 2)],
  robber_fly: [A("hunt", "dart", 0.6, 5), A("perch", "sit_hold", 1.8, 3, "sit"), A("still", "freeze", 1.4, 2)],
  sloth: [A("hang", "sit_hold", 2.6, 5, "sit"), A("reach", "stretch", 1.6, 3, "sit"), A("still", "freeze", 2.2, 2)],
  lemur: [A("sun", "sit_hold", 2.2, 5, "sit"), A("flag", "pulse", 0.8, 3), A("walk", "wiggle", 1.0, 2)],
  gibbon: [A("swing", "pulse", 1.2, 5), A("song", "talk", 0.8, 3, "talk"), A("still", "freeze", 1.6, 2)],
  kinkajou: [A("wrap", "sit_hold", 2.0, 5, "sit"), A("lick", "eat", 1.2, 3, "eat"), A("still", "freeze", 1.6, 2)],
  colugo: [A("sail", "pulse", 1.4, 5), A("cling", "sit_hold", 2.2, 3, "sit"), A("still", "freeze", 1.8, 2)],
  flying_squirrel: [A("glide", "pulse", 1.2, 5), A("hop", "hop", 0.5, 3, "play"), A("still", "freeze", 1.6, 2)],
  howler: [A("boom", "talk", 0.9, 5, "talk"), A("sit", "sit_hold", 2.2, 3, "sit"), A("still", "freeze", 1.8, 2)],
  tarsier: [A("gaze", "nod", 1.4, 5, "sit"), A("leap", "hop", 0.5, 3, "play"), A("still", "freeze", 1.6, 2)],
  potto: [A("still", "freeze", 2.6, 5), A("cling", "sit_hold", 2.2, 3, "sit"), A("walk", "wiggle", 1.0, 1)],
  koala: [A("chew", "eat", 1.6, 5, "eat"), A("cling", "sit_hold", 2.4, 3, "sit"), A("still", "freeze", 2.0, 2)],
  brain_coral: [A("ridge", "sit_hold", 2.6, 5, "sit"), A("polyp", "pulse", 1.4, 3), A("still", "freeze", 2.2, 2)],
  anemone: [A("wreath", "pulse", 1.6, 5), A("open", "open", 1.8, 3, "sit"), A("still", "freeze", 2.0, 2)],
  clownfish: [A("dart", "dart", 0.6, 5), A("nestle", "sit_hold", 1.8, 3, "sit"), A("still", "freeze", 1.4, 2)],
  parrotfish: [A("scrape", "nod", 1.2, 5), A("swim", "wiggle", 1.0, 3), A("still", "freeze", 1.6, 2)],
  cleaner_shrimp: [A("wave", "pulse", 0.8, 5), A("wait", "sit_hold", 2.0, 3, "sit"), A("still", "freeze", 1.6, 2)],
  sea_cucumber: [A("crawl", "wiggle", 1.4, 5), A("still", "sit_hold", 2.2, 3, "sit"), A("freeze", "freeze", 1.8, 2)],
  lionfish: [A("veil", "pulse", 1.4, 5), A("hover", "bob", 1.6, 3), A("still", "freeze", 1.8, 2)],
  giant_clam: [A("open", "open", 1.8, 5, "sit"), A("mantle", "sit_hold", 2.4, 4, "sit"), A("still", "freeze", 2.2, 2)],
  eagle_ray: [A("soar", "pulse", 1.4, 5), A("glide", "bob", 1.8, 3), A("still", "freeze", 1.6, 2)],
  grouper: [A("hide", "sit_hold", 2.4, 5, "sit"), A("gape", "gape", 1.0, 3), A("still", "freeze", 1.8, 2)],
  cyber_dragon: [A("arc", "pulse", 1.4, 5), A("still", "sit_hold", 2.2, 3, "sit"), A("watch", "freeze", 1.8, 2)],
  volt_dragon: [A("current", "pulse", 1.4, 5), A("still", "sit_hold", 2.2, 3, "sit"), A("watch", "freeze", 1.8, 2)],
  trace_dragon: [A("path", "pulse", 1.4, 5), A("still", "sit_hold", 2.2, 3, "sit"), A("watch", "freeze", 1.8, 2)],
  flux_dragon: [A("field", "pulse", 1.4, 5), A("still", "sit_hold", 2.2, 3, "sit"), A("watch", "freeze", 1.8, 2)],
  spark_dragon: [A("crackle", "pulse", 1.4, 5), A("still", "sit_hold", 2.2, 3, "sit"), A("watch", "freeze", 1.8, 2)],
  ion_dragon: [A("haze", "pulse", 1.4, 5), A("still", "sit_hold", 2.2, 3, "sit"), A("watch", "freeze", 1.8, 2)],
  gauss_dragon: [A("filing", "pulse", 1.4, 5), A("still", "sit_hold", 2.2, 3, "sit"), A("watch", "freeze", 1.8, 2)],
  relay_dragon: [A("relay", "pulse", 1.4, 5), A("still", "sit_hold", 2.2, 3, "sit"), A("watch", "freeze", 1.8, 2)],
  fuse_dragon: [A("fuse", "pulse", 1.4, 5), A("still", "sit_hold", 2.2, 3, "sit"), A("watch", "freeze", 1.8, 2)],
  ground_dragon: [A("earth", "pulse", 1.4, 5), A("still", "sit_hold", 2.2, 3, "sit"), A("watch", "freeze", 1.8, 2)],
};

export const TONGUE_KEYS = SNAKE_KEYS;
export const SCRATCH_KEYS = ["dog", "cat", "red_panda"] as const;

export function actsFor(key: string | undefined | null): IdleAct[] {
  return (key && ETHOGRAM[key]) || [];
}

export function pickAct(key: string | undefined | null): IdleAct | null {
  const list = actsFor(key);
  if (!list.length) return null;
  let roll = Math.random() * list.reduce((sum, act) => sum + act.weight, 0);
  for (const act of list) {
    roll -= act.weight;
    if (roll <= 0) return act;
  }
  return list[list.length - 1] ?? null;
}

export function nextActWait(wander: number, nocturnal = false, night = false) {
  let wait = 20 - Math.max(0, Math.min(1, wander)) * 12;
  if (wander < 0.18) wait += 8;
  if (nocturnal && night) wait *= 0.7;
  if (nocturnal && !night) wait *= 1.22;
  return Math.max(8, wait) * (0.85 + Math.random() * 0.35);
}

export function afterSettleWait(wander: number) {
  const late = wander < 0.18;
  return (late ? 6 : 3) + Math.random() * (late ? 5 : 4);
}

export function tongueFlick(t: number, hold: number) {
  if (t < 0 || t > hold) return 0;
  const cycle = 0.22;
  const n = Math.floor(t / cycle);
  if (n >= 3) return 0;
  const u = (t % cycle) / cycle;
  return u < 0.55 ? 1 - u / 0.55 : 0;
}

export function actPose(motion: ActMotion | null | undefined, t: number, hold: number) {
  const u = hold > 0 ? Math.max(0, Math.min(1, t / hold)) : 1;
  const pose = { dx: 0, dy: 0, rot: 0, stretch: 1, squat: 1 };
  if (!motion) return pose;
  if (motion === "scratch") {
    pose.dx = Math.sin(t * 28) * 2.2;
    pose.rot = Math.sin(t * 28) * 3.2;
  } else if (motion === "shake") {
    pose.dx = Math.sin(t * 40) * 3.4;
  } else if (motion === "yawn") {
    pose.stretch = 1 + Math.sin(u * Math.PI) * 0.08;
    pose.squat = 2 - pose.stretch;
  } else if (motion === "groom") {
    pose.dy = Math.sin(t * 10) * 3;
    pose.stretch = 1 + Math.sin(t * 10) * 0.02;
  } else if (motion === "stretch") {
    pose.stretch = 1 + Math.sin(u * Math.PI) * 0.1;
    pose.squat = 1 - Math.sin(u * Math.PI) * 0.05;
  } else if (motion === "wiggle") {
    pose.dx = Math.sin(t * 16) * 2;
  } else if (motion === "bob") {
    pose.dy = Math.sin(t * 8) * 4;
  } else if (motion === "pulse") {
    pose.stretch = 1 + Math.sin(u * Math.PI * 2) * 0.05;
    pose.squat = 2 - pose.stretch;
  } else if (motion === "gape") {
    pose.stretch = 1 + Math.sin(u * Math.PI) * 0.07;
    pose.squat = 2 - pose.stretch;
  } else if (motion === "gulp") {
    pose.dy = Math.sin(u * Math.PI) * 5;
    pose.stretch = 1 + Math.sin(u * Math.PI) * 0.04;
  } else if (motion === "nod") {
    pose.dy = -Math.sin(u * Math.PI) * 6;
    pose.stretch = 1 - Math.sin(u * Math.PI) * 0.04;
  } else if (motion === "lean") {
    pose.rot = Math.sin(u * Math.PI) * 8;
    pose.dx = Math.sin(u * Math.PI) * 4;
  } else if (motion === "unfurl") {
    pose.stretch = 0.88 + Math.sin(u * Math.PI) * 0.16;
    pose.squat = 2 - pose.stretch;
  } else if (motion === "snap") {
    pose.stretch = 1 - Math.sin(u * Math.PI) * 0.12;
    pose.squat = 2 - pose.stretch;
    pose.dy = Math.sin(u * Math.PI) * 3;
  } else if (motion === "open") {
    pose.stretch = 1 + Math.sin(u * Math.PI) * 0.1;
    pose.squat = 2 - pose.stretch;
  } else if (motion === "curl") {
    pose.rot = Math.sin(u * Math.PI) * 6;
    pose.stretch = 1 - Math.sin(u * Math.PI) * 0.08;
    pose.squat = 2 - pose.stretch;
  } else if (motion === "waggle") {
    pose.dx = Math.sin(t * 22) * 3.2;
    pose.rot = Math.sin(t * 22) * 10;
  } else if (motion === "flash") {
    pose.stretch = 1 + Math.sin(u * Math.PI * 2) * 0.07;
    pose.squat = 2 - pose.stretch;
    pose.dy = -Math.sin(u * Math.PI) * 5;
  } else if (motion === "fold") {
    pose.stretch = 1 - Math.sin(u * Math.PI) * 0.06;
    pose.squat = 2 - pose.stretch;
    pose.dy = Math.sin(u * Math.PI) * 2;
  } else if (motion === "trail") {
    pose.dx = Math.sin(t * 14) * 2.4;
    pose.dy = Math.sin(t * 28) * 1.2;
  } else if (motion === "emerge") {
    pose.stretch = 0.9 + Math.sin(u * Math.PI) * 0.18;
    pose.squat = 2 - pose.stretch;
    pose.dy = -Math.sin(u * Math.PI) * 4;
  } else if (motion === "puff") {
    pose.stretch = 1 + Math.sin(u * Math.PI) * 0.14;
    pose.squat = 2 - pose.stretch;
    pose.dy = -Math.sin(u * Math.PI) * 6;
  } else if (motion === "flush") {
    pose.stretch = 1 + Math.sin(u * Math.PI * 2) * 0.06;
    pose.squat = 2 - pose.stretch;
    pose.rot = Math.sin(u * Math.PI) * 3;
  } else if (motion === "rise") {
    pose.dy = -Math.sin(u * Math.PI) * 8;
    pose.stretch = 1 + Math.sin(u * Math.PI) * 0.08;
    pose.squat = 2 - pose.stretch;
  } else if (motion === "share") {
    pose.dx = Math.sin(u * Math.PI) * 1.2;
    pose.rot = Math.sin(u * Math.PI) * 2;
  } else if (motion === "drink") {
    pose.dy = -Math.sin(u * Math.PI) * 6;
    pose.stretch = 1 + Math.sin(u * Math.PI) * 0.07;
    pose.squat = 2 - pose.stretch;
  } else if (motion === "chord") {
    pose.stretch = 1 + Math.sin(u * Math.PI * 3) * 0.06;
    pose.squat = 2 - pose.stretch;
    pose.dx = Math.sin(t * 10) * 1.4;
  } else if (motion === "float") {
    pose.dy = Math.sin(t * 6) * 5;
    pose.dx = Math.sin(t * 3) * 2;
  } else if (motion === "facet") {
    pose.rot = Math.sin(u * Math.PI) * 4;
    pose.stretch = 1 + Math.sin(u * Math.PI) * 0.05;
  } else if (motion === "edge") {
    pose.dx = Math.sin(t * 12) * 3.2;
    pose.dy = Math.sin(t * 24) * 0.8;
  } else if (motion === "ripple") {
    pose.stretch = 1 + Math.sin(u * Math.PI * 3) * 0.05;
    pose.dx = Math.sin(u * Math.PI * 2) * 2.4;
  } else if (motion === "frost") {
    pose.stretch = 1 - Math.sin(u * Math.PI) * 0.04;
    pose.squat = 2 - pose.stretch;
    pose.dy = Math.sin(u * Math.PI) * 2;
  } else if (motion === "align") {
    pose.stretch = 1 + Math.sin(u * Math.PI) * 0.1;
    pose.dx = Math.sin(u * Math.PI) * 6;
  } else if (motion === "dim") {
    pose.dy = Math.sin(u * Math.PI) * 2;
    pose.rot = Math.sin(u * Math.PI) * 2;
  } else if (motion === "wake") {
    pose.stretch = 0.88 + Math.sin(u * Math.PI) * 0.2;
    pose.squat = 2 - pose.stretch;
    pose.dy = -Math.sin(u * Math.PI) * 5;
  }
  return pose;
}
