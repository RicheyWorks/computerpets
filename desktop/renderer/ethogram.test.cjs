const assert = require("node:assert/strict");
const { test } = require("node:test");
const E = require("./ethogram.js");

test("snake keys never schedule scratch and can schedule tongue", () => {
  for (const key of E.TONGUE_KEYS) {
    const names = E.actsFor(key).map((a) => a.name);
    assert.ok(names.includes("tongue"), key);
    assert.equal(names.includes("scratch"), false, key);
  }
  let tongue = 0;
  for (let i = 0; i < 80; i++) {
    const act = E.pickAct("garter");
    assert.notEqual(act && act.name, "scratch");
    if (act && act.name === "tongue") tongue += 1;
  }
  assert.ok(tongue > 0);
});

test("only the scratching mammals list scratch", () => {
  assert.deepEqual(E.SCRATCH_KEYS, ["dog", "cat", "red_panda"]);
  assert.equal(E.actsFor("fox").some((a) => a.name === "scratch"), false);
  assert.equal(E.actsFor("iguana").some((a) => a.name === "scratch"), false);
  for (const key of ["octopus", "moon_jelly", "horseshoe_crab", "moray", "moss", "venus_flytrap", "saguaro"]) {
    const names = E.actsFor(key).map((a) => a.name);
    assert.ok(names.length > 0, key);
    assert.equal(names.includes("scratch"), false, key);
    assert.equal(names.includes("tongue"), false, key);
  }
});

test("horseshoe_crab ethogram is Ledger ultra (carapace + softs + freeze, not plow/still)", () => {
  const names = E.actsFor("horseshoe_crab").map((a) => a.name);
  assert.ok(names.includes("carapace"));
  assert.ok(names.includes("pusher_soft"));
  assert.ok(names.includes("ocular_soft"));
  assert.ok(names.includes("freeze"));
  assert.equal(names.includes("plow"), false);
  assert.equal(names.includes("still"), false);
  assert.equal(names.includes("molt"), false);
});

test("seahorse ethogram is Anchor ultra (coil + softs + freeze, not hitch/hover)", () => {
  const names = E.actsFor("seahorse").map((a) => a.name);
  assert.ok(names.includes("coil"));
  assert.ok(names.includes("dorsal_soft"));
  assert.ok(names.includes("pectoral_soft"));
  assert.ok(names.includes("freeze"));
  assert.equal(names.includes("hitch"), false);
  assert.equal(names.includes("hover"), false);
  assert.equal(names.includes("anchor"), false);
});

test("manta ethogram is Kite ultra (span + softs + freeze, not soar/glide)", () => {
  const names = E.actsFor("manta").map((a) => a.name);
  assert.ok(names.includes("span"));
  assert.ok(names.includes("breach_soft"));
  assert.ok(names.includes("ram_soft"));
  assert.ok(names.includes("freeze"));
  assert.equal(names.includes("soar"), false);
  assert.equal(names.includes("glide"), false);
  assert.equal(names.includes("barrel"), false);
});

test("moray ethogram is Door ultra (jamb + softs + freeze, not gape/hide/dart)", () => {
  const names = E.actsFor("moray").map((a) => a.name);
  assert.ok(names.includes("jamb"));
  assert.ok(names.includes("mucus_soft"));
  assert.ok(names.includes("sentry_soft"));
  assert.ok(names.includes("freeze"));
  assert.equal(names.includes("gape"), false);
  assert.equal(names.includes("hide"), false);
  assert.equal(names.includes("dart"), false);
});

test("moss ethogram is Felt ultra (thatch + softs + freeze, not lean/nod/still)", () => {
  const names = E.actsFor("moss").map((a) => a.name);
  assert.ok(names.includes("thatch"));
  assert.ok(names.includes("rhizoid_soft"));
  assert.ok(names.includes("seta_soft"));
  assert.ok(names.includes("freeze"));
  assert.equal(names.includes("lean"), false);
  assert.equal(names.includes("nod"), false);
  assert.equal(names.includes("still"), false);
});

test("maidenhair ethogram is Vein ultra (saucer + softs + freeze, not lean/nod/unfurl)", () => {
  const names = E.actsFor("maidenhair").map((a) => a.name);
  assert.ok(names.includes("saucer"));
  assert.ok(names.includes("sori_soft"));
  assert.ok(names.includes("stipe_soft"));
  assert.ok(names.includes("freeze"));
  assert.equal(names.includes("lean"), false);
  assert.equal(names.includes("nod"), false);
  assert.equal(names.includes("unfurl"), false);
});

test("ginkgo ethogram is Fan ultra (amber + softs + freeze, not lean/nod/still)", () => {
  const names = E.actsFor("ginkgo").map((a) => a.name);
  assert.ok(names.includes("amber"));
  assert.ok(names.includes("dichotomy_soft"));
  assert.ok(names.includes("petiole_soft"));
  assert.ok(names.includes("freeze"));
  assert.equal(names.includes("lean"), false);
  assert.equal(names.includes("nod"), false);
  assert.equal(names.includes("still"), false);
});

test("oak ethogram is Mast ultra (bole + softs + freeze, not lean/nod/still)", () => {
  const names = E.actsFor("oak").map((a) => a.name);
  assert.ok(names.includes("bole"));
  assert.ok(names.includes("catkin_soft"));
  assert.ok(names.includes("tyloses_soft"));
  assert.ok(names.includes("freeze"));
  assert.equal(names.includes("lean"), false);
  assert.equal(names.includes("nod"), false);
  assert.equal(names.includes("still"), false);
});

test("water_lily ethogram is Disk ultra (sheen + softs + freeze, not open/nod/lean)", () => {
  const names = E.actsFor("water_lily").map((a) => a.name);
  assert.ok(names.includes("sheen"));
  assert.ok(names.includes("peltate_soft"));
  assert.ok(names.includes("hydropote_soft"));
  assert.ok(names.includes("freeze"));
  assert.equal(names.includes("open"), false);
  assert.equal(names.includes("nod"), false);
  assert.equal(names.includes("lean"), false);
});

test("orchid ethogram is Moth ultra (epiphyte + softs + freeze, not unfurl/nod/lean)", () => {
  const names = E.actsFor("orchid").map((a) => a.name);
  assert.ok(names.includes("epiphyte"));
  assert.ok(names.includes("keiki_soft"));
  assert.ok(names.includes("pollinia_soft"));
  assert.ok(names.includes("freeze"));
  assert.equal(names.includes("unfurl"), false);
  assert.equal(names.includes("nod"), false);
  assert.equal(names.includes("lean"), false);
});


test("saguaro ethogram is Arm ultra (sentinel + softs + freeze, not still/nod/lean)", () => {
  const names = E.actsFor("saguaro").map((a) => a.name);
  assert.ok(names.includes("sentinel"));
  assert.ok(names.includes("pleat_soft"));
  assert.ok(names.includes("boot_soft"));
  assert.ok(names.includes("freeze"));
  assert.equal(names.includes("still"), false);
  assert.equal(names.includes("nod"), false);
  assert.equal(names.includes("lean"), false);
});

test("venus_flytrap ethogram is Snap ultra (poise + softs + freeze, not snap/nod/lean)", () => {
  const names = E.actsFor("venus_flytrap").map((a) => a.name);
  assert.ok(names.includes("poise"));
  assert.ok(names.includes("cage_soft"));
  assert.ok(names.includes("scape_soft"));
  assert.ok(names.includes("freeze"));
  assert.equal(names.includes("snap"), false);
  assert.equal(names.includes("nod"), false);
  assert.equal(names.includes("lean"), false);
});

test("pitcher ethogram is Well ultra (urn + softs + freeze, not still/nod/lean)", () => {
  const names = E.actsFor("pitcher").map((a) => a.name);
  assert.ok(names.includes("urn"));
  assert.ok(names.includes("ala_soft"));
  assert.ok(names.includes("baffle_soft"));
  assert.ok(names.includes("freeze"));
  assert.equal(names.includes("still"), false);
  assert.equal(names.includes("nod"), false);
  assert.equal(names.includes("lean"), false);
});

test("sundew ethogram is Dew ultra (rosette + softs + freeze, not curl/nod/lean)", () => {
  const names = E.actsFor("sundew").map((a) => a.name);
  assert.ok(names.includes("rosette"));
  assert.ok(names.includes("lamina_soft"));
  assert.ok(names.includes("circinate_soft"));
  assert.ok(names.includes("freeze"));
  assert.equal(names.includes("curl"), false);
  assert.equal(names.includes("nod"), false);
  assert.equal(names.includes("lean"), false);
});



test("luna ethogram is Ghost ultra (actias + softs + freeze, not still/drift/refuse)", () => {
  const names = E.actsFor("luna").map((a) => a.name);
  assert.ok(names.includes("actias"));
  assert.ok(names.includes("aphagy_soft"));
  assert.ok(names.includes("cauda_soft"));
  assert.ok(names.includes("freeze"));
  assert.equal(names.includes("still"), false);
  assert.equal(names.includes("drift"), false);
  assert.equal(names.includes("refuse"), false);
});


test("firefly ethogram is Spark ultra (photinus + softs + freeze, not flash/lift/still)", () => {
  const names = E.actsFor("firefly").map((a) => a.name);
  assert.ok(names.includes("photinus"));
  assert.ok(names.includes("photocyte_soft"));
  assert.ok(names.includes("sternite_soft"));
  assert.ok(names.includes("freeze"));
  assert.equal(names.includes("flash"), false);
  assert.equal(names.includes("lift"), false);
  assert.equal(names.includes("still"), false);
});


test("darner ethogram is Dart ultra (anax + softs + freeze, not hawk/hover/still)", () => {
  const names = E.actsFor("darner").map((a) => a.name);
  assert.ok(names.includes("anax"));
  assert.ok(names.includes("obelisk_soft"));
  assert.ok(names.includes("ommatidia_soft"));
  assert.ok(names.includes("freeze"));
  assert.equal(names.includes("hawk"), false);
  assert.equal(names.includes("hover"), false);
  assert.equal(names.includes("still"), false);
});



test("stick ethogram is Twig ultra (diapheromera + softs + freeze, not still/walk)", () => {
  const names = E.actsFor("stick").map((a) => a.name);
  assert.ok(names.includes("diapheromera"));
  assert.ok(names.includes("rocking_soft"));
  assert.ok(names.includes("catalepsy_soft"));
  assert.ok(names.includes("browse_soft"));
  assert.ok(names.includes("tread_soft"));
  assert.ok(names.includes("oviposit_soft"));
  assert.ok(names.includes("filiform_soft"));
  assert.ok(names.includes("freeze"));
  assert.equal(names.includes("still"), false);
  assert.equal(names.includes("walk"), false);
  assert.equal(names.length, 8);
});

test("carpenter_ant ethogram is Column ultra (camponotus + softs + freeze, not trail/dart/still)", () => {
  const names = E.actsFor("carpenter_ant").map((a) => a.name);
  assert.ok(names.includes("camponotus"));
  assert.ok(names.includes("gallery_soft"));
  assert.ok(names.includes("pheromone_soft"));
  assert.ok(names.includes("crumb_soft"));
  assert.ok(names.includes("bustle_soft"));
  assert.ok(names.includes("trophallaxis_soft"));
  assert.ok(names.includes("frass_soft"));
  assert.ok(names.includes("freeze"));
  assert.equal(names.includes("still"), false);
  assert.equal(names.includes("trail"), false);
  assert.equal(names.includes("dart"), false);
  assert.equal(names.length, 8);
});

test("ladybird ethogram is Seven ultra (coccinella + softs + freeze, not count/hunt/still)", () => {
  const names = E.actsFor("ladybird").map((a) => a.name);
  assert.ok(names.includes("coccinella"));
  assert.ok(names.includes("spots_soft"));
  assert.ok(names.includes("aphid_soft"));
  assert.ok(names.includes("reflex_soft"));
  assert.ok(names.includes("climb_soft"));
  assert.ok(names.includes("pronotum_soft"));
  assert.ok(names.includes("alar_soft"));
  assert.ok(names.includes("freeze"));
  assert.equal(names.includes("still"), false);
  assert.equal(names.includes("count"), false);
  assert.equal(names.includes("hunt"), false);
  assert.equal(names.length, 8);
});

test("mantis ethogram is Fold ultra (mantodea + softs + freeze, not fold/strike/still)", () => {
  const names = E.actsFor("mantis").map((a) => a.name);
  assert.ok(names.includes("mantodea"));
  assert.ok(names.includes("raptorial_soft"));
  assert.ok(names.includes("gimbal_soft"));
  assert.ok(names.includes("snatch_soft"));
  assert.ok(names.includes("pendulum_soft"));
  assert.ok(names.includes("ootheca_soft"));
  assert.ok(names.includes("deimatic_soft"));
  assert.ok(names.includes("freeze"));
  assert.equal(names.includes("still"), false);
  assert.equal(names.includes("fold"), false);
  assert.equal(names.includes("strike"), false);
  assert.equal(names.length, 8);
});


test("cicada ethogram is Brood ultra (magicicada + softs + freeze, not still/emerge/burst)", () => {
  const names = E.actsFor("cicada").map((a) => a.name);
  assert.ok(names.includes("magicicada"));
  assert.ok(names.includes("tymbal_soft"));
  assert.ok(names.includes("cast_soft"));
  assert.ok(names.includes("egress_soft"));
  assert.ok(names.includes("harden_soft"));
  assert.ok(names.includes("xylem_soft"));
  assert.ok(names.includes("pharaoh_soft"));
  assert.ok(names.includes("freeze"));
  assert.equal(names.includes("still"), false);
  assert.equal(names.includes("emerge"), false);
  assert.equal(names.includes("burst"), false);
  assert.equal(names.length, 8);
});

test("honeycomb ethogram is Wax ultra (tessera + softs + freeze, not hold/brood/still)", () => {
  const names = E.actsFor("honeycomb").map((a) => a.name);
  assert.ok(names.includes("tessera"));
  assert.ok(names.includes("alveoli_soft"));
  assert.ok(names.includes("foundation_soft"));
  assert.ok(names.includes("freeze"));
  assert.equal(names.includes("hold"), false);
  assert.equal(names.includes("brood"), false);
  assert.equal(names.includes("still"), false);
});


test("oyster ethogram is Frill ultra (pleurotus + softs + freeze, not lean/flush/still)", () => {
  const names = E.actsFor("oyster").map((a) => a.name);
  assert.ok(names.includes("pleurotus"));
  assert.ok(names.includes("lamella_soft"));
  assert.ok(names.includes("imbricate_soft"));
  assert.ok(names.includes("lasso_soft"));
  assert.ok(names.includes("margin_soft"));
  assert.ok(names.includes("sporulate_soft"));
  assert.ok(names.includes("hypha_soft"));
  assert.ok(names.includes("freeze"));
  assert.equal(names.includes("lean"), false);
  assert.equal(names.includes("flush"), false);
  assert.equal(names.includes("still"), false);
  assert.equal(names.length, 8);
});


test("fly_agaric ethogram is Cap ultra (amanita + softs + freeze, not lean/flush/still)", () => {
  const names = E.actsFor("fly_agaric").map((a) => a.name);
  assert.ok(names.includes("amanita"));
  assert.ok(names.includes("annulus_soft"));
  assert.ok(names.includes("volva_soft"));
  assert.ok(names.includes("flake_soft"));
  assert.ok(names.includes("symbiont_soft"));
  assert.ok(names.includes("pileus_soft"));
  assert.ok(names.includes("bulb_soft"));
  assert.ok(names.includes("freeze"));
  assert.equal(names.includes("lean"), false);
  assert.equal(names.includes("flush"), false);
  assert.equal(names.includes("still"), false);
  assert.equal(names.length, 8);
});

test("morel ethogram is Lattice ultra (morchella + softs + freeze, not lean/still/still_hold)", () => {
  const names = E.actsFor("morel").map((a) => a.name);
  assert.ok(names.includes("morchella"));
  assert.ok(names.includes("alveolus_soft"));
  assert.ok(names.includes("ridge_soft"));
  assert.ok(names.includes("ephemeral_soft"));
  assert.ok(names.includes("sclerotium_soft"));
  assert.ok(names.includes("costa_soft"));
  assert.ok(names.includes("hymenium_soft"));
  assert.ok(names.includes("freeze"));
  assert.equal(names.includes("lean"), false);
  assert.equal(names.includes("still"), false);
  assert.equal(names.includes("still_hold"), false);
  assert.equal(names.length, 8);
});

test("chanterelle ethogram is Horn ultra (cantharellus + softs + freeze, not lean/flush/still)", () => {
  const names = E.actsFor("chanterelle").map((a) => a.name);
  assert.ok(names.includes("cantharellus"));
  assert.ok(names.includes("apricot_soft"));
  assert.ok(names.includes("funnel_soft"));
  assert.ok(names.includes("decurrent_soft"));
  assert.ok(names.includes("flute_soft"));
  assert.ok(names.includes("vase_soft"));
  assert.ok(names.includes("plica_soft"));
  assert.ok(names.includes("freeze"));
  assert.equal(names.includes("lean"), false);
  assert.equal(names.includes("flush"), false);
  assert.equal(names.includes("still"), false);
  assert.equal(names.length, 8);
});

test("turkey_tail ethogram is Ring ultra (trametes + softs + freeze, not lean/zone/still)", () => {
  const names = E.actsFor("turkey_tail").map((a) => a.name);
  assert.ok(names.includes("trametes"));
  assert.ok(names.includes("pore_soft"));
  assert.ok(names.includes("bracket_soft"));
  assert.ok(names.includes("zonate_soft"));
  assert.ok(names.includes("leathery_soft"));
  assert.ok(names.includes("concentric_soft"));
  assert.ok(names.includes("tomentum_soft"));
  assert.ok(names.includes("freeze"));
  assert.equal(names.includes("lean"), false);
  assert.equal(names.includes("zone"), false);
  assert.equal(names.includes("still"), false);
  assert.equal(names.length, 8);
});

test("lions_mane ethogram is Mane ultra (hericium + softs + freeze, not lean/beard/still)", () => {
  const names = E.actsFor("lions_mane").map((a) => a.name);
  assert.ok(names.includes("hericium"));
  assert.ok(names.includes("spine_soft"));
  assert.ok(names.includes("icicle_soft"));
  assert.ok(names.includes("cascade_soft"));
  assert.ok(names.includes("wound_soft"));
  assert.ok(names.includes("pompon_soft"));
  assert.ok(names.includes("hydnoid_soft"));
  assert.ok(names.includes("freeze"));
  assert.equal(names.includes("lean"), false);
  assert.equal(names.includes("beard"), false);
  assert.equal(names.includes("still"), false);
  assert.equal(names.length, 8);
});

test("puffball ethogram is Puff ultra (lycoperdon + softs + freeze, not puff/lean/still)", () => {
  const names = E.actsFor("puffball").map((a) => a.name);
  assert.ok(names.includes("lycoperdon"));
  assert.ok(names.includes("ostiole_soft"));
  assert.ok(names.includes("gleba_soft"));
  assert.ok(names.includes("peridium_soft"));
  assert.ok(names.includes("duff_soft"));
  assert.ok(names.includes("gemmate_soft"));
  assert.ok(names.includes("capillitium_soft"));
  assert.ok(names.includes("freeze"));
  assert.equal(names.includes("puff"), false);
  assert.equal(names.includes("lean"), false);
  assert.equal(names.includes("still"), false);
  assert.equal(names.length, 8);
});

test("chicken_of_woods ethogram is Flame ultra (laetiporus + softs + freeze, not lean/flush/still)", () => {
  const names = E.actsFor("chicken_of_woods").map((a) => a.name);
  assert.ok(names.includes("laetiporus"));
  assert.ok(names.includes("sulfur_soft"));
  assert.ok(names.includes("tier_soft"));
  assert.ok(names.includes("oak_soft"));
  assert.ok(names.includes("tender_soft"));
  assert.ok(names.includes("poroid_soft"));
  assert.ok(names.includes("cluster_soft"));
  assert.ok(names.includes("freeze"));
  assert.equal(names.includes("lean"), false);
  assert.equal(names.includes("flush"), false);
  assert.equal(names.includes("still"), false);
  assert.equal(names.length, 8);
});

test("yeast ethogram is Starter ultra (saccharomyces + softs + freeze, not rise/foam/still)", () => {
  const names = E.actsFor("yeast").map((a) => a.name);
  assert.ok(names.includes("saccharomyces"));
  assert.ok(names.includes("bud_soft"));
  assert.ok(names.includes("proof_soft"));
  assert.ok(names.includes("levain_soft"));
  assert.ok(names.includes("ferment_soft"));
  assert.ok(names.includes("ascus_soft"));
  assert.ok(names.includes("floc_soft"));
  assert.ok(names.includes("freeze"));
  assert.equal(names.includes("rise"), false);
  assert.equal(names.includes("foam"), false);
  assert.equal(names.includes("still"), false);
  assert.equal(names.length, 8);
});

test("lichen ethogram is Pact ultra (cladonia + softs + freeze, not share-still/lean/still)", () => {
  const names = E.actsFor("lichen").map((a) => a.name);
  assert.ok(names.includes("cladonia"));
  assert.ok(names.includes("podetium_soft"));
  assert.ok(names.includes("photobiont_soft"));
  assert.ok(names.includes("fruticose_soft"));
  assert.ok(names.includes("stone_soft"));
  assert.ok(names.includes("soredia_soft"));
  assert.ok(names.includes("scyphi_soft"));
  assert.ok(names.includes("freeze"));
  assert.equal(names.includes("share-still"), false);
  assert.equal(names.includes("lean"), false);
  assert.equal(names.includes("still"), false);
});

test("photovore ethogram is Gleam ultra (photovore + softs + freeze, not drink-light/hover/still)", () => {
  const names = E.actsFor("photovore").map((a) => a.name);
  assert.ok(names.includes("photovore"));
  assert.ok(names.includes("photon_soft"));
  assert.ok(names.includes("wavelength_soft"));
  assert.ok(names.includes("fluence_soft"));
  assert.ok(names.includes("glass_soft"));
  assert.ok(names.includes("opsin_soft"));
  assert.ok(names.includes("iridophore_soft"));
  assert.ok(names.includes("freeze"));
  assert.equal(names.includes("drink-light"), false);
  assert.equal(names.includes("hover"), false);
  assert.equal(names.includes("still"), false);
});

test("choir ethogram is Choir ultra (harmonia + softs + freeze, not chord-pulse/overtone/still)", () => {
  const names = E.actsFor("choir").map((a) => a.name);
  assert.ok(names.includes("harmonia"));
  assert.ok(names.includes("polyphony_soft"));
  assert.ok(names.includes("partial_soft"));
  assert.ok(names.includes("timbre_soft"));
  assert.ok(names.includes("resonance_soft"));
  assert.ok(names.includes("formant_soft"));
  assert.ok(names.includes("dyad_soft"));
  assert.ok(names.includes("freeze"));
  assert.equal(names.includes("chord-pulse"), false);
  assert.equal(names.includes("overtone"), false);
  assert.equal(names.includes("still"), false);
});

test("nimbus ethogram is Drift ultra (stratus + softs + freeze, not float/still/hover)", () => {
  const names = E.actsFor("nimbus").map((a) => a.name);
  assert.ok(names.includes("stratus"));
  assert.ok(names.includes("waft_soft"));
  assert.ok(names.includes("billow_soft"));
  assert.ok(names.includes("cirrus_soft"));
  assert.ok(names.includes("virga_soft"));
  assert.ok(names.includes("tholin_soft"));
  assert.ok(names.includes("nucleate_soft"));
  assert.ok(names.includes("freeze"));
  assert.equal(names.includes("float"), false);
  assert.equal(names.includes("still"), false);
  assert.equal(names.includes("hover"), false);
});

test("silica ethogram is Shard ultra (crescit + softs + freeze, not facet/still/shed)", () => {
  const names = E.actsFor("silica").map((a) => a.name);
  assert.ok(names.includes("crescit"));
  assert.ok(names.includes("cleavage_soft"));
  assert.ok(names.includes("twinning_soft"));
  assert.ok(names.includes("inclusion_soft"));
  assert.ok(names.includes("grit_soft"));
  assert.ok(names.includes("hopper_soft"));
  assert.ok(names.includes("phantom_soft"));
  assert.ok(names.includes("freeze"));
  assert.equal(names.includes("facet"), false);
  assert.equal(names.includes("still"), false);
  assert.equal(names.includes("shed"), false);
});

test("terminator ethogram is Dusk ultra (limitor + softs + freeze, not edge-walk/still/rim)", () => {
  const names = E.actsFor("terminator").map((a) => a.name);
  assert.ok(names.includes("limitor"));
  assert.ok(names.includes("belt_soft"));
  assert.ok(names.includes("penumbra_soft"));
  assert.ok(names.includes("eclipse_soft"));
  assert.ok(names.includes("limb_soft"));
  assert.ok(names.includes("umbra_soft"));
  assert.ok(names.includes("syzygy_soft"));
  assert.ok(names.includes("freeze"));
  assert.equal(names.includes("edge-walk"), false);
  assert.equal(names.includes("still"), false);
  assert.equal(names.includes("rim"), false);
});

test("nexus ethogram is Knot ultra (mesh + softs + freeze, not count-ripple/still/name)", () => {
  const names = E.actsFor("nexus").map((a) => a.name);
  assert.ok(names.includes("mesh"));
  assert.ok(names.includes("plexus_soft"));
  assert.ok(names.includes("splice_soft"));
  assert.ok(names.includes("braid_soft"));
  assert.ok(names.includes("weft_soft"));
  assert.ok(names.includes("fascicle_soft"));
  assert.ok(names.includes("sennit_soft"));
  assert.ok(names.includes("freeze"));
  assert.equal(names.includes("count-ripple"), false);
  assert.equal(names.includes("still"), false);
  assert.equal(names.includes("name"), false);
});

test("halovore ethogram is Brine ultra (deliquesce + softs + freeze, not frost/still/waste)", () => {
  const names = E.actsFor("halovore").map((a) => a.name);
  assert.ok(names.includes("deliquesce"));
  assert.ok(names.includes("halite_soft"));
  assert.ok(names.includes("salina_soft"));
  assert.ok(names.includes("rime_soft"));
  assert.ok(names.includes("bittern_soft"));
  assert.ok(names.includes("ectoine_soft"));
  assert.ok(names.includes("sabkha_soft"));
  assert.ok(names.includes("freeze"));
  assert.equal(names.includes("frost"), false);
  assert.equal(names.includes("still"), false);
  assert.equal(names.includes("waste"), false);
});

test("magneton ethogram is Beacon ultra (remanence + softs + freeze, not align/still/north)", () => {
  const names = E.actsFor("magneton").map((a) => a.name);
  assert.ok(names.includes("remanence"));
  assert.ok(names.includes("lodestone_soft"));
  assert.ok(names.includes("flux_soft"));
  assert.ok(names.includes("azimuth_soft"));
  assert.ok(names.includes("dipole_soft"));
  assert.ok(names.includes("barkhausen_soft"));
  assert.ok(names.includes("hysteresis_soft"));
  assert.ok(names.includes("freeze"));
  assert.equal(names.includes("align"), false);
  assert.equal(names.includes("still"), false);
  assert.equal(names.includes("north"), false);
});

test("monarch ethogram is Milk ultra (danaus + softs + freeze, not flutter/migrate/still)", () => {
  const names = E.actsFor("monarch").map((a) => a.name);
  assert.ok(names.includes("danaus"));
  assert.ok(names.includes("cremaster_soft"));
  assert.ok(names.includes("tarsus_soft"));
  assert.ok(names.includes("freeze"));
  assert.equal(names.includes("flutter"), false);
  assert.equal(names.includes("migrate"), false);
  assert.equal(names.includes("still"), false);
});

test("honeybee ethogram is Comb ultra (hive + softs + freeze, not waggle/dart/still)", () => {
  const names = E.actsFor("honeybee").map((a) => a.name);
  assert.ok(names.includes("hive"));
  assert.ok(names.includes("ocelli_soft"));
  assert.ok(names.includes("nasonov_soft"));
  assert.ok(names.includes("freeze"));
  assert.equal(names.includes("waggle"), false);
  assert.equal(names.includes("dart"), false);
  assert.equal(names.includes("still"), false);
});





test("insect keys never schedule scratch, tongue, or a mammal nibble", () => {
  const insects = [
    "honeybee", "monarch", "luna", "firefly", "darner",
    "stick", "carpenter_ant", "ladybird", "mantis", "cicada",
  ];
  for (const key of insects) {
    const names = E.actsFor(key).map((a) => a.name);
    assert.ok(names.length > 0, key);
    assert.equal(names.includes("scratch"), false, key);
    assert.equal(names.includes("tongue"), false, key);
    assert.equal(names.includes("eat"), false, key);
  }
  assert.ok(E.actsFor("honeybee").some((a) => a.name === "hive"));
  assert.ok(E.actsFor("monarch").some((a) => a.name === "danaus"));
  assert.ok(E.actsFor("firefly").some((a) => a.name === "photinus"));
  assert.ok(E.actsFor("luna").some((a) => a.name === "actias"));
  assert.ok(E.actsFor("cicada").some((a) => a.name === "magicicada"));
});

test("fungi keys never schedule scratch or tongue", () => {
  const fungi = [
    "oyster", "fly_agaric", "morel", "chanterelle", "turkey_tail",
    "lions_mane", "puffball", "chicken_of_woods", "yeast", "lichen",
  ];
  for (const key of fungi) {
    const names = E.actsFor(key).map((a) => a.name);
    assert.ok(names.length > 0, key);
    assert.equal(names.includes("scratch"), false, key);
    assert.equal(names.includes("tongue"), false, key);
    assert.equal(names.includes("waggle"), false, key);
  }
  assert.ok(E.actsFor("puffball").some((a) => a.name === "lycoperdon"));
  assert.ok(E.actsFor("yeast").some((a) => a.name === "saccharomyces"));
  assert.ok(E.actsFor("lichen").some((a) => a.name === "cladonia"));
});

test("far keys never schedule scratch or tongue", () => {
  const far = [
    "photovore", "choir", "nimbus", "silica", "terminator",
    "nexus", "halovore", "magneton", "umbral", "cyst",
  ];
  for (const key of far) {
    const names = E.actsFor(key).map((a) => a.name);
    assert.ok(names.length > 0, key);
    assert.equal(names.includes("scratch"), false, key);
    assert.equal(names.includes("tongue"), false, key);
  }
  assert.ok(E.actsFor("photovore").some((a) => a.name === "photovore"));
  assert.ok(E.actsFor("choir").some((a) => a.name === "harmonia"));
  assert.ok(E.actsFor("choir").some((a) => a.name === "formant_soft"));
  assert.ok(E.actsFor("choir").some((a) => a.name === "dyad_soft"));
  assert.ok(E.actsFor("nimbus").some((a) => a.name === "stratus"));
  assert.ok(E.actsFor("nimbus").some((a) => a.name === "tholin_soft"));
  assert.ok(E.actsFor("nimbus").some((a) => a.name === "nucleate_soft"));
  assert.ok(E.actsFor("silica").some((a) => a.name === "crescit"));
  assert.ok(E.actsFor("silica").some((a) => a.name === "hopper_soft"));
  assert.ok(E.actsFor("silica").some((a) => a.name === "phantom_soft"));
  assert.ok(E.actsFor("terminator").some((a) => a.name === "limitor"));
  assert.ok(E.actsFor("terminator").some((a) => a.name === "umbra_soft"));
  assert.ok(E.actsFor("terminator").some((a) => a.name === "syzygy_soft"));
  assert.ok(E.actsFor("nexus").some((a) => a.name === "mesh"));
  assert.ok(E.actsFor("nexus").some((a) => a.name === "fascicle_soft"));
  assert.ok(E.actsFor("nexus").some((a) => a.name === "sennit_soft"));
  assert.ok(E.actsFor("halovore").some((a) => a.name === "deliquesce"));
  assert.ok(E.actsFor("halovore").some((a) => a.name === "ectoine_soft"));
  assert.ok(E.actsFor("halovore").some((a) => a.name === "sabkha_soft"));
  assert.ok(E.actsFor("magneton").some((a) => a.name === "remanence"));
  assert.ok(E.actsFor("magneton").some((a) => a.name === "barkhausen_soft"));
  assert.ok(E.actsFor("magneton").some((a) => a.name === "hysteresis_soft"));
  assert.ok(E.actsFor("umbral").some((a) => a.name === "caligo"));
  assert.ok(E.actsFor("umbral").some((a) => a.name === "sfumato_soft"));
  assert.ok(E.actsFor("umbral").some((a) => a.name === "tenebrae_soft"));
  assert.ok(E.actsFor("umbral").some((a) => a.name === "freeze"));
  assert.equal(E.actsFor("umbral").some((a) => a.name === "dim"), false);
  assert.equal(E.actsFor("umbral").some((a) => a.name === "still"), false);
  assert.equal(E.actsFor("umbral").some((a) => a.name === "cool"), false);
  assert.ok(E.actsFor("cyst").some((a) => a.name === "cryptobiosis"));
  assert.ok(E.actsFor("cyst").some((a) => a.name === "sporocyst_soft"));
  assert.ok(E.actsFor("cyst").some((a) => a.name === "tachyzoite_soft"));
  assert.ok(E.actsFor("cyst").some((a) => a.name === "freeze"));
  assert.ok(E.actsFor("frog").some((a) => a.name === "lentic"));
  assert.ok(E.actsFor("frog").some((a) => a.name === "toepad_soft"));
  assert.ok(E.actsFor("frog").some((a) => a.name === "webbing_soft"));
  assert.ok(E.actsFor("frog").some((a) => a.name === "freeze"));
assert.ok(E.actsFor("toad").some((a) => a.name === "bufonid"));
assert.ok(E.actsFor("toad").some((a) => a.name === "unken_soft"));
assert.ok(E.actsFor("toad").some((a) => a.name === "cranial_soft"));
assert.ok(E.actsFor("toad").some((a) => a.name === "freeze"));
assert.ok(E.actsFor("newt").some((a) => a.name === "caudate"));
assert.ok(E.actsFor("newt").some((a) => a.name === "hedonic_soft"));
assert.ok(E.actsFor("newt").some((a) => a.name === "aposematic_soft"));
assert.ok(E.actsFor("newt").some((a) => a.name === "freeze"));
assert.ok(E.actsFor("salamander").some((a) => a.name === "ambystomid"));
assert.ok(E.actsFor("salamander").some((a) => a.name === "mental_soft"));
assert.ok(E.actsFor("salamander").some((a) => a.name === "granular_soft"));
assert.ok(E.actsFor("salamander").some((a) => a.name === "freeze"));
assert.ok(E.actsFor("caecilian").some((a) => a.name === "gymnophion"));
assert.ok(E.actsFor("caecilian").some((a) => a.name === "stegos_soft"));
assert.ok(E.actsFor("caecilian").some((a) => a.name === "dualjaw_soft"));
assert.ok(E.actsFor("caecilian").some((a) => a.name === "freeze"));
assert.ok(E.actsFor("crayfish").some((a) => a.name === "astacid"));
assert.ok(E.actsFor("crayfish").some((a) => a.name === "scaph_soft"));
assert.ok(E.actsFor("crayfish").some((a) => a.name === "meral_soft"));
assert.ok(E.actsFor("crayfish").some((a) => a.name === "freeze"));
assert.ok(E.actsFor("pond_snail").some((a) => a.name === "lymnaeid"));
assert.ok(E.actsFor("pond_snail").some((a) => a.name === "odontophore_soft"));
assert.ok(E.actsFor("pond_snail").some((a) => a.name === "neuston_soft"));
assert.ok(E.actsFor("pond_snail").some((a) => a.name === "freeze"));
  assert.ok(E.actsFor("mussel").some((a) => a.name === "unionid"));
  assert.ok(E.actsFor("mussel").some((a) => a.name === "ligament_soft"));
  assert.ok(E.actsFor("mussel").some((a) => a.name === "glochid_soft"));
  assert.ok(E.actsFor("mussel").some((a) => a.name === "freeze"));
  assert.ok(E.actsFor("leech").some((a) => a.name === "hirudinean"));
  assert.ok(E.actsFor("leech").some((a) => a.name === "botryoidal_soft"));
  assert.ok(E.actsFor("leech").some((a) => a.name === "auricle_soft"));
  assert.ok(E.actsFor("leech").some((a) => a.name === "freeze"));
  assert.ok(E.actsFor("stickleback").some((a) => a.name === "gasterosteid"));
  assert.ok(E.actsFor("stickleback").some((a) => a.name === "nuptial_soft"));
  assert.ok(E.actsFor("stickleback").some((a) => a.name === "pelvic_soft"));
  assert.ok(E.actsFor("stickleback").some((a) => a.name === "freeze"));
  assert.ok(E.actsFor("paramecium").some((a) => a.name === "ciliophora"));
  assert.ok(E.actsFor("paramecium").some((a) => a.name === "trichocyst_soft"));
  assert.ok(E.actsFor("paramecium").some((a) => a.name === "avoiding_soft"));
  assert.ok(E.actsFor("paramecium").some((a) => a.name === "freeze"));
  assert.ok(E.actsFor("amoeba").some((a) => a.name === "proteus"));
  assert.ok(E.actsFor("amoeba").some((a) => a.name === "uroid_soft"));
  assert.ok(E.actsFor("amoeba").some((a) => a.name === "streaming_soft"));
  assert.ok(E.actsFor("amoeba").some((a) => a.name === "freeze"));
  assert.ok(E.actsFor("euglena").some((a) => a.name === "euglenid"));
  assert.ok(E.actsFor("euglena").some((a) => a.name === "metaboly_soft"));
  assert.ok(E.actsFor("euglena").some((a) => a.name === "paramylon_soft"));
  assert.ok(E.actsFor("euglena").some((a) => a.name === "freeze"));
  assert.ok(E.actsFor("volvox").some((a) => a.name === "coenobium"));
  assert.ok(E.actsFor("volvox").some((a) => a.name === "daughter_soft"));
  assert.ok(E.actsFor("volvox").some((a) => a.name === "gonidia_soft"));
  assert.ok(E.actsFor("volvox").some((a) => a.name === "freeze"));
  assert.ok(E.actsFor("diatom").some((a) => a.name === "navicula"));
  assert.ok(E.actsFor("diatom").some((a) => a.name === "pennate_soft"));
  assert.ok(E.actsFor("diatom").some((a) => a.name === "epitheca_soft"));
  assert.ok(E.actsFor("diatom").some((a) => a.name === "freeze"));
  assert.ok(E.actsFor("kelp").some((a) => a.name === "meristem"));
  assert.ok(E.actsFor("kelp").some((a) => a.name === "sorus_soft"));
  assert.ok(E.actsFor("kelp").some((a) => a.name === "sporophyll_soft"));
  assert.ok(E.actsFor("kelp").some((a) => a.name === "freeze"));
  assert.ok(E.actsFor("chlamydomonas").some((a) => a.name === "palmella"));
  assert.ok(E.actsFor("chlamydomonas").some((a) => a.name === "cellwall_soft"));
  assert.ok(E.actsFor("chlamydomonas").some((a) => a.name === "wetplate_soft"));
  assert.ok(E.actsFor("chlamydomonas").some((a) => a.name === "freeze"));
  assert.ok(E.actsFor("stentor").some((a) => a.name === "introversus"));
  assert.ok(E.actsFor("stentor").some((a) => a.name === "vortex_soft"));
  assert.ok(E.actsFor("stentor").some((a) => a.name === "beadedmac_soft"));
  assert.ok(E.actsFor("stentor").some((a) => a.name === "freeze"));
  assert.ok(E.actsFor("coli").some((a) => a.name === "nucleoid"));
  assert.ok(E.actsFor("coli").some((a) => a.name === "fimbria_soft"));
  assert.ok(E.actsFor("coli").some((a) => a.name === "flagmotor_soft"));
  assert.ok(E.actsFor("coli").some((a) => a.name === "freeze"));
  assert.ok(E.actsFor("haloarchaea").some((a) => a.name === "retinal"));
  assert.ok(E.actsFor("haloarchaea").some((a) => a.name === "archaellum_soft"));
  assert.ok(E.actsFor("haloarchaea").some((a) => a.name === "brinedrift_soft"));
  assert.ok(E.actsFor("haloarchaea").some((a) => a.name === "freeze"));
  assert.ok(E.actsFor("orb_weaver").some((a) => a.name === "araneus"));
  assert.ok(E.actsFor("orb_weaver").some((a) => a.name === "dragline_soft"));
  assert.ok(E.actsFor("orb_weaver").some((a) => a.name === "viscid_soft"));
  assert.ok(E.actsFor("orb_weaver").some((a) => a.name === "freeze"));
  assert.ok(E.actsFor("jumping_spider").some((a) => a.name === "phidippus"));
  assert.ok(E.actsFor("jumping_spider").some((a) => a.name === "safetyline_soft"));
  assert.ok(E.actsFor("jumping_spider").some((a) => a.name === "ame_soft"));
  assert.ok(E.actsFor("jumping_spider").some((a) => a.name === "scopula_soft"));
  assert.ok(E.actsFor("jumping_spider").some((a) => a.name === "freeze"));
  assert.ok(E.actsFor("wolf_spider").some((a) => a.name === "tigrosa"));
  assert.ok(E.actsFor("wolf_spider").some((a) => a.name === "spur_soft"));
  assert.ok(E.actsFor("wolf_spider").some((a) => a.name === "apron_soft"));
  assert.ok(E.actsFor("wolf_spider").some((a) => a.name === "cursor_soft"));
  assert.ok(E.actsFor("wolf_spider").some((a) => a.name === "freeze"));
  assert.ok(E.actsFor("tarantula").some((a) => a.name === "aphonopelma"));
  assert.ok(E.actsFor("tarantula").some((a) => a.name === "rastellum_soft"));
  assert.ok(E.actsFor("tarantula").some((a) => a.name === "apophysis_soft"));
  assert.ok(E.actsFor("tarantula").some((a) => a.name === "urticate_soft"));
  assert.ok(E.actsFor("tarantula").some((a) => a.name === "freeze"));
  assert.ok(E.actsFor("widow").some((a) => a.name === "latrodectus"));
  assert.ok(E.actsFor("widow").some((a) => a.name === "combfoot_soft"));
  assert.ok(E.actsFor("widow").some((a) => a.name === "theridiid_soft"));
  assert.ok(E.actsFor("widow").some((a) => a.name === "hourglass_soft"));
  assert.ok(E.actsFor("widow").some((a) => a.name === "freeze"));
  assert.ok(E.actsFor("harvestman").some((a) => a.name === "phalangium"));
  assert.ok(E.actsFor("harvestman").some((a) => a.name === "ozopore_soft"));
  assert.ok(E.actsFor("harvestman").some((a) => a.name === "leiobunum_soft"));
  assert.ok(E.actsFor("harvestman").some((a) => a.name === "legwave_soft"));
  assert.ok(E.actsFor("harvestman").some((a) => a.name === "freeze"));
  assert.ok(E.actsFor("scorpion").some((a) => a.name === "centruroides"));
  assert.ok(E.actsFor("scorpion").some((a) => a.name === "pectines_soft"));
  assert.ok(E.actsFor("scorpion").some((a) => a.name === "booklung_soft"));
  assert.ok(E.actsFor("scorpion").some((a) => a.name === "pedipalp_soft"));
  assert.ok(E.actsFor("scorpion").some((a) => a.name === "freeze"));
  assert.ok(E.actsFor("vinegaroon").some((a) => a.name === "mastigoproctus"));
  assert.ok(E.actsFor("vinegaroon").some((a) => a.name === "pygidial_soft"));
  assert.ok(E.actsFor("vinegaroon").some((a) => a.name === "antenniform_soft"));
  assert.ok(E.actsFor("vinegaroon").some((a) => a.name === "caudalwhip_soft"));
  assert.ok(E.actsFor("vinegaroon").some((a) => a.name === "freeze"));
  assert.ok(E.actsFor("tick").some((a) => a.name === "ixodes"));
  assert.ok(E.actsFor("tick").some((a) => a.name === "scutum_soft"));
  assert.ok(E.actsFor("tick").some((a) => a.name === "capitulum_soft"));
  assert.ok(E.actsFor("tick").some((a) => a.name === "quest_soft"));
  assert.ok(E.actsFor("tick").some((a) => a.name === "freeze"));
  assert.ok(E.actsFor("solifuge").some((a) => a.name === "eremobates"));
  assert.ok(E.actsFor("solifuge").some((a) => a.name === "propeltidium_soft"));
  assert.ok(E.actsFor("solifuge").some((a) => a.name === "tracheate_soft"));
  assert.ok(E.actsFor("solifuge").some((a) => a.name === "malleoli_soft"));
  assert.ok(E.actsFor("solifuge").some((a) => a.name === "freeze"));
  assert.ok(E.actsFor("deer").some((a) => a.name === "odocoileus"));
  assert.ok(E.actsFor("deer").some((a) => a.name === "flagtail_soft"));
  assert.ok(E.actsFor("deer").some((a) => a.name === "stotbound_soft"));
  assert.ok(E.actsFor("deer").some((a) => a.name === "snortblow_soft"));
  assert.ok(E.actsFor("deer").some((a) => a.name === "freeze"));
  assert.ok(E.actsFor("bat").some((a) => a.name === "eptesicus"));
  assert.ok(E.actsFor("bat").some((a) => a.name === "wingwrap_soft"));
  assert.ok(E.actsFor("bat").some((a) => a.name === "echolocate_soft"));
  assert.ok(E.actsFor("bat").some((a) => a.name === "calcar_soft"));
  assert.ok(E.actsFor("bat").some((a) => a.name === "freeze"));
  assert.ok(E.actsFor("squirrel").some((a) => a.name === "sciurus"));
  assert.ok(E.actsFor("squirrel").some((a) => a.name === "nutbury_soft"));
  assert.ok(E.actsFor("squirrel").some((a) => a.name === "barkscramble_soft"));
  assert.ok(E.actsFor("squirrel").some((a) => a.name === "scold_soft"));
  assert.ok(E.actsFor("squirrel").some((a) => a.name === "freeze"));
  assert.ok(E.actsFor("otter").some((a) => a.name === "lontra"));
  assert.ok(E.actsFor("otter").some((a) => a.name === "bellyglide_soft"));
  assert.ok(E.actsFor("otter").some((a) => a.name === "denslide_soft"));
  assert.ok(E.actsFor("otter").some((a) => a.name === "spraint_soft"));
  assert.ok(E.actsFor("otter").some((a) => a.name === "freeze"));
  assert.ok(E.actsFor("raccoon").some((a) => a.name === "procyon"));
  assert.ok(E.actsFor("raccoon").some((a) => a.name === "pawdouse_soft"));
  assert.ok(E.actsFor("raccoon").some((a) => a.name === "dexterous_soft"));
  assert.ok(E.actsFor("raccoon").some((a) => a.name === "ringtail_soft"));
  assert.ok(E.actsFor("raccoon").some((a) => a.name === "freeze"));
  assert.ok(E.actsFor("skunk").some((a) => a.name === "mephitis"));
  assert.ok(E.actsFor("skunk").some((a) => a.name === "footstomp_soft"));
  assert.ok(E.actsFor("skunk").some((a) => a.name === "scentraise_soft"));
  assert.ok(E.actsFor("skunk").some((a) => a.name === "plantigrade_soft"));
  assert.ok(E.actsFor("skunk").some((a) => a.name === "freeze"));
  assert.ok(E.actsFor("opossum").some((a) => a.name === "didelphis"));
  assert.ok(E.actsFor("opossum").some((a) => a.name === "stillfeign_soft"));
  assert.ok(E.actsFor("opossum").some((a) => a.name === "pouchcarry_soft"));
  assert.ok(E.actsFor("opossum").some((a) => a.name === "prehensile_soft"));
  assert.ok(E.actsFor("opossum").some((a) => a.name === "freeze"));
  assert.ok(E.actsFor("beaver").some((a) => a.name === "castor"));
  assert.ok(E.actsFor("beaver").some((a) => a.name === "woodfell_soft"));
  assert.ok(E.actsFor("beaver").some((a) => a.name === "aspen_soft"));
  assert.ok(E.actsFor("beaver").some((a) => a.name === "divehush_soft"));
  assert.ok(E.actsFor("beaver").some((a) => a.name === "freeze"));
  assert.ok(E.actsFor("porcupine").some((a) => a.name === "erethizon"));
  assert.ok(E.actsFor("porcupine").some((a) => a.name === "toothclack_soft"));
  assert.ok(E.actsFor("porcupine").some((a) => a.name === "guardhair_soft"));
  assert.ok(E.actsFor("porcupine").some((a) => a.name === "pinehush_soft"));
  assert.ok(E.actsFor("porcupine").some((a) => a.name === "freeze"));
  assert.ok(E.actsFor("black_bear").some((a) => a.name === "ursus"));
  assert.ok(E.actsFor("black_bear").some((a) => a.name === "bipedrise_soft"));
  assert.ok(E.actsFor("black_bear").some((a) => a.name === "bluffhuff_soft"));
  assert.ok(E.actsFor("black_bear").some((a) => a.name === "mastforage_soft"));
  assert.ok(E.actsFor("black_bear").some((a) => a.name === "freeze"));
  assert.ok(E.actsFor("capybara").some((a) => a.name === "hydrochoerus"));
  assert.ok(E.actsFor("capybara").some((a) => a.name === "mudwallow_soft"));
  assert.ok(E.actsFor("capybara").some((a) => a.name === "scentgland_soft"));
  assert.ok(E.actsFor("capybara").some((a) => a.name === "socialpile_soft"));
  assert.ok(E.actsFor("capybara").some((a) => a.name === "freeze"));
  assert.ok(E.actsFor("gecko").some((a) => a.name === "hemidactylus"));
  assert.ok(E.actsFor("gecko").some((a) => a.name === "toepadcling_soft"));
  assert.ok(E.actsFor("gecko").some((a) => a.name === "setae_soft"));
  assert.ok(E.actsFor("gecko").some((a) => a.name === "lamphush_soft"));
  assert.ok(E.actsFor("gecko").some((a) => a.name === "freeze"));
  assert.ok(E.actsFor("anole").some((a) => a.name === "anolis"));
  assert.ok(E.actsFor("anole").some((a) => a.name === "dewlapflash_soft"));
  assert.ok(E.actsFor("anole").some((a) => a.name === "nuchal_soft"));
  assert.ok(E.actsFor("anole").some((a) => a.name === "vinehush_soft"));
  assert.ok(E.actsFor("anole").some((a) => a.name === "freeze"));
  assert.equal(E.actsFor("anole").some((a) => a.name === "flash"), false);
  assert.equal(E.actsFor("anole").some((a) => a.name === "brown"), false);
  assert.equal(E.actsFor("anole").some((a) => a.name === "still"), false);

  assert.ok(E.actsFor("skink").some((a) => a.name === "plestiodon"));
  assert.ok(E.actsFor("skink").some((a) => a.name === "tailbluff_soft"));
  assert.ok(E.actsFor("skink").some((a) => a.name === "bluetail_soft"));
  assert.ok(E.actsFor("skink").some((a) => a.name === "stonehush_soft"));
  assert.ok(E.actsFor("skink").some((a) => a.name === "freeze"));
  assert.equal(E.actsFor("skink").some((a) => a.name === "dash"), false);
  assert.equal(E.actsFor("skink").some((a) => a.name === "tail"), false);
  assert.equal(E.actsFor("skink").some((a) => a.name === "still"), false);

  assert.ok(E.actsFor("chameleon").some((a) => a.name === "calyptratus"));
  assert.ok(E.actsFor("chameleon").some((a) => a.name === "veilflush_soft"));
  assert.ok(E.actsFor("chameleon").some((a) => a.name === "casque_soft"));
  assert.ok(E.actsFor("chameleon").some((a) => a.name === "zygodactyl_soft"));
  assert.ok(E.actsFor("chameleon").some((a) => a.name === "freeze"));
  assert.equal(E.actsFor("chameleon").some((a) => a.name === "aim"), false);
  assert.equal(E.actsFor("chameleon").some((a) => a.name === "walk"), false);
  assert.equal(E.actsFor("chameleon").some((a) => a.name === "catch"), false);

  assert.ok(E.actsFor("horned_lizard").some((a) => a.name === "phrynosoma"));
  assert.ok(E.actsFor("horned_lizard").some((a) => a.name === "bloodsquirt_soft"));
  assert.ok(E.actsFor("horned_lizard").some((a) => a.name === "coronal_soft"));
  assert.ok(E.actsFor("horned_lizard").some((a) => a.name === "sandhush_soft"));
  assert.ok(E.actsFor("horned_lizard").some((a) => a.name === "freeze"));
  assert.equal(E.actsFor("horned_lizard").some((a) => a.name === "crown"), false);
  assert.equal(E.actsFor("horned_lizard").some((a) => a.name === "squirt"), false);
  assert.equal(E.actsFor("horned_lizard").some((a) => a.name === "still"), false);

  assert.ok(E.actsFor("alligator").some((a) => a.name === "mississippi"));
  assert.ok(E.actsFor("alligator").some((a) => a.name === "bellowbank_soft"));
  assert.ok(E.actsFor("alligator").some((a) => a.name === "osteoderm_soft"));
  assert.ok(E.actsFor("alligator").some((a) => a.name === "scutehush_soft"));
  assert.ok(E.actsFor("alligator").some((a) => a.name === "freeze"));
  assert.equal(E.actsFor("alligator").some((a) => a.name === "bask"), false);
  assert.equal(E.actsFor("alligator").some((a) => a.name === "bank"), false);
  assert.equal(E.actsFor("alligator").some((a) => a.name === "close"), false);

  assert.ok(E.actsFor("crocodile").some((a) => a.name === "acutus"));
  assert.ok(E.actsFor("crocodile").some((a) => a.name === "toothlock_soft"));
  assert.ok(E.actsFor("crocodile").some((a) => a.name === "vsnout_soft"));
  assert.ok(E.actsFor("crocodile").some((a) => a.name === "keelridge_soft"));
  assert.ok(E.actsFor("crocodile").some((a) => a.name === "freeze"));
  assert.equal(E.actsFor("crocodile").some((a) => a.name === "show"), false);
  assert.equal(E.actsFor("crocodile").some((a) => a.name === "sit"), false);
  assert.equal(E.actsFor("crocodile").some((a) => a.name === "still"), false);

  assert.ok(E.actsFor("snapper").some((a) => a.name === "serpentina"));
  assert.ok(E.actsFor("snapper").some((a) => a.name === "ambushgape_soft"));
  assert.ok(E.actsFor("snapper").some((a) => a.name === "serrated_soft"));
  assert.ok(E.actsFor("snapper").some((a) => a.name === "plastron_soft"));
  assert.ok(E.actsFor("snapper").some((a) => a.name === "freeze"));
  assert.equal(E.actsFor("snapper").some((a) => a.name === "snap"), false);
  assert.equal(E.actsFor("snapper").some((a) => a.name === "sit"), false);
  assert.equal(E.actsFor("snapper").some((a) => a.name === "still"), false);

  assert.ok(E.actsFor("box_turtle").some((a) => a.name === "carolinae"));
  assert.ok(E.actsFor("box_turtle").some((a) => a.name === "hingeshut_soft"));
  assert.ok(E.actsFor("box_turtle").some((a) => a.name === "dome_soft"));
  assert.ok(E.actsFor("box_turtle").some((a) => a.name === "leafhush_soft"));
  assert.ok(E.actsFor("box_turtle").some((a) => a.name === "freeze"));
  assert.equal(E.actsFor("box_turtle").some((a) => a.name === "shut"), false);
  assert.equal(E.actsFor("box_turtle").some((a) => a.name === "walk"), false);
  assert.equal(E.actsFor("box_turtle").some((a) => a.name === "still"), false);

  assert.ok(E.actsFor("tuatara").some((a) => a.name === "punctatus"));
  assert.ok(E.actsFor("tuatara").some((a) => a.name === "parietalgaze_soft"));
  assert.ok(E.actsFor("tuatara").some((a) => a.name === "acrodont_soft"));
  assert.ok(E.actsFor("tuatara").some((a) => a.name === "diapsid_soft"));
  assert.ok(E.actsFor("tuatara").some((a) => a.name === "freeze"));
  assert.equal(E.actsFor("tuatara").some((a) => a.name === "still"), false);
  assert.equal(E.actsFor("tuatara").some((a) => a.name === "crest"), false);
  assert.equal(E.actsFor("tuatara").some((a) => a.name === "watch"), false);

  assert.ok(E.actsFor("bass").some((a) => a.name === "salmoides"));
  assert.ok(E.actsFor("bass").some((a) => a.name === "coverstrike_soft"));
  assert.ok(E.actsFor("bass").some((a) => a.name === "maxilla_soft"));
  assert.ok(E.actsFor("bass").some((a) => a.name === "weedline_soft"));
  assert.ok(E.actsFor("bass").some((a) => a.name === "freeze"));
  assert.equal(E.actsFor("bass").some((a) => a.name === "lunge"), false);
  assert.equal(E.actsFor("bass").some((a) => a.name === "sit"), false);
  assert.equal(E.actsFor("bass").some((a) => a.name === "gape"), false);

  assert.ok(E.actsFor("brook_trout").some((a) => a.name === "fontinalis"));
  assert.ok(E.actsFor("brook_trout").some((a) => a.name === "driftfeed_soft"));
  assert.ok(E.actsFor("brook_trout").some((a) => a.name === "adipose_soft"));
  assert.ok(E.actsFor("brook_trout").some((a) => a.name === "coldriffle_soft"));
  assert.ok(E.actsFor("brook_trout").some((a) => a.name === "freeze"));
  assert.equal(E.actsFor("brook_trout").some((a) => a.name === "dart"), false);
  assert.equal(E.actsFor("brook_trout").some((a) => a.name === "rise"), false);
  assert.equal(E.actsFor("brook_trout").some((a) => a.name === "still"), false);

  assert.equal(E.actsFor("cyst").some((a) => a.name === "wake"), false);
  assert.equal(E.actsFor("cyst").some((a) => a.name === "wait"), false);
  assert.equal(E.actsFor("cyst").some((a) => a.name === "still"), false);
});

test("shore and meadow keys never schedule scratch or a snake tongue", () => {
  const shore = [
    "fiddler_crab", "ghost_crab", "limpet", "barnacle", "chiton",
    "periwinkle", "sand_dollar", "sea_urchin", "knobbed_whelk", "lugworm",
  ];
  const meadow = [
    "field_cricket", "katydid", "grasshopper", "swallowtail", "jewelwing",
    "lacewing", "earwig", "acorn_weevil", "click_beetle", "robber_fly",
  ];
  for (const key of [...shore, ...meadow]) {
    const names = E.actsFor(key).map((a) => a.name);
    assert.ok(names.length > 0, key);
    assert.equal(names.includes("scratch"), false, key);
    assert.equal(names.includes("tongue"), false, key);
  }
  assert.ok(E.actsFor("fiddler_crab").some((a) => a.name === "pugilator"));
  assert.ok(E.actsFor("field_cricket").some((a) => a.name === "gryllushush"));
  assert.ok(E.actsFor("grasshopper").some((a) => a.name === "caeliferahush"));
  assert.ok(E.actsFor("grasshopper").some((a) => a.name === "hindleap_soft"));
  assert.ok(E.actsFor("grasshopper").some((a) => a.name === "deskbask_soft"));
  assert.ok(E.actsFor("grasshopper").some((a) => a.name === "mandiblegraze_soft"));
  assert.ok(E.actsFor("grasshopper").some((a) => a.name === "femurrasp_soft"));
  assert.ok(E.actsFor("grasshopper").some((a) => a.name === "tympanal_soft"));
  assert.ok(E.actsFor("grasshopper").some((a) => a.name === "saltatory_soft"));
  assert.ok(E.actsFor("grasshopper").some((a) => a.name === "freeze"));
  assert.equal(E.actsFor("grasshopper").some((a) => a.name === "vault"), false);
  assert.equal(E.actsFor("grasshopper").some((a) => a.name === "walk"), false);
  assert.equal(E.actsFor("grasshopper").some((a) => a.name === "still"), false);
  assert.ok(E.actsFor("swallowtail").some((a) => a.name === "papiliohush"));
  assert.ok(E.actsFor("swallowtail").some((a) => a.name === "wingbanner_soft"));
  assert.ok(E.actsFor("swallowtail").some((a) => a.name === "puddlesip_soft"));
  assert.ok(E.actsFor("swallowtail").some((a) => a.name === "flutterhop_soft"));
  assert.ok(E.actsFor("swallowtail").some((a) => a.name === "tailglidesettle_soft"));
  assert.ok(E.actsFor("swallowtail").some((a) => a.name === "tornusflash_soft"));
  assert.ok(E.actsFor("swallowtail").some((a) => a.name === "tigerband_soft"));
  assert.ok(E.actsFor("swallowtail").some((a) => a.name === "freeze"));
  assert.equal(E.actsFor("swallowtail").some((a) => a.name === "banner"), false);
  assert.equal(E.actsFor("swallowtail").some((a) => a.name === "flutter"), false);
  assert.equal(E.actsFor("swallowtail").some((a) => a.name === "still"), false);
  assert.equal(E.actsFor("swallowtail").some((a) => a.name === "walk"), false);
  assert.ok(E.actsFor("jewelwing").some((a) => a.name === "calopteryxhush"));
  assert.ok(E.actsFor("jewelwing").some((a) => a.name === "jewelflick_soft"));
  assert.ok(E.actsFor("jewelwing").some((a) => a.name === "creekpatrol_soft"));
  assert.ok(E.actsFor("jewelwing").some((a) => a.name === "perchfan_soft"));
  assert.ok(E.actsFor("jewelwing").some((a) => a.name === "ovipositdip_soft"));
  assert.ok(E.actsFor("jewelwing").some((a) => a.name === "metallicwing_soft"));
  assert.ok(E.actsFor("jewelwing").some((a) => a.name === "damselflick_soft"));
  assert.ok(E.actsFor("jewelwing").some((a) => a.name === "freeze"));
  assert.equal(E.actsFor("jewelwing").some((a) => a.name === "jewel"), false);
  assert.equal(E.actsFor("jewelwing").some((a) => a.name === "hover"), false);
  assert.equal(E.actsFor("jewelwing").some((a) => a.name === "still"), false);
  assert.equal(E.actsFor("jewelwing").some((a) => a.name === "walk"), false);
  assert.ok(E.actsFor("lacewing").some((a) => a.name === "chrysopahush"));
  assert.ok(E.actsFor("lacewing").some((a) => a.name === "wingtremble_soft"));
  assert.ok(E.actsFor("lacewing").some((a) => a.name === "aphidstalk_soft"));
  assert.ok(E.actsFor("lacewing").some((a) => a.name === "eggraise_soft"));
  assert.ok(E.actsFor("lacewing").some((a) => a.name === "nightglint_soft"));
  assert.ok(E.actsFor("lacewing").some((a) => a.name === "pedicel_soft"));
  assert.ok(E.actsFor("lacewing").some((a) => a.name === "laceveil_soft"));
  assert.ok(E.actsFor("lacewing").some((a) => a.name === "freeze"));
  assert.equal(E.actsFor("lacewing").some((a) => a.name === "lace"), false);
  assert.equal(E.actsFor("lacewing").some((a) => a.name === "hover"), false);
  assert.equal(E.actsFor("lacewing").some((a) => a.name === "still"), false);
  assert.equal(E.actsFor("lacewing").some((a) => a.name === "walk"), false);
  assert.equal(E.actsFor("lacewing").some((a) => a.name === "lace"), false);
  assert.equal(E.actsFor("lacewing").some((a) => a.name === "hover"), false);
  assert.equal(E.actsFor("lacewing").some((a) => a.name === "still"), false);
  assert.equal(E.actsFor("lacewing").some((a) => a.name === "walk"), false);
  assert.ok(E.actsFor("earwig").some((a) => a.name === "forficulahush"));
  assert.ok(E.actsFor("earwig").some((a) => a.name === "cercithreat_soft"));
  assert.ok(E.actsFor("earwig").some((a) => a.name === "fanwing_soft"));
  assert.ok(E.actsFor("earwig").some((a) => a.name === "nightscuttle_soft"));
  assert.ok(E.actsFor("earwig").some((a) => a.name === "broodguard_soft"));
  assert.ok(E.actsFor("earwig").some((a) => a.name === "tegminacurl_soft"));
  assert.ok(E.actsFor("earwig").some((a) => a.name === "cerciwhip_soft"));
  assert.ok(E.actsFor("earwig").some((a) => a.name === "freeze"));
  assert.equal(E.actsFor("earwig").some((a) => a.name === "raise"), false);
  assert.equal(E.actsFor("earwig").some((a) => a.name === "walk"), false);
  assert.equal(E.actsFor("earwig").some((a) => a.name === "still"), false);
  assert.equal(E.actsFor("earwig").some((a) => a.name === "earwig"), false);
  assert.ok(E.actsFor("acorn_weevil").some((a) => a.name === "curculiohush"));
  assert.ok(E.actsFor("acorn_weevil").some((a) => a.name === "rostrumdrill_soft"));
  assert.ok(E.actsFor("acorn_weevil").some((a) => a.name === "acornroll_soft"));
  assert.ok(E.actsFor("acorn_weevil").some((a) => a.name === "dropthanatosis_soft"));
  assert.ok(E.actsFor("acorn_weevil").some((a) => a.name === "snoutwalk_soft"));
  assert.ok(E.actsFor("acorn_weevil").some((a) => a.name === "elytraclamp_soft"));
  assert.ok(E.actsFor("acorn_weevil").some((a) => a.name === "cupprobe_soft"));
  assert.ok(E.actsFor("acorn_weevil").some((a) => a.name === "freeze"));
  assert.equal(E.actsFor("acorn_weevil").some((a) => a.name === "drill"), false);
  assert.equal(E.actsFor("acorn_weevil").some((a) => a.name === "walk"), false);
  assert.equal(E.actsFor("acorn_weevil").some((a) => a.name === "still"), false);
  assert.equal(E.actsFor("acorn_weevil").some((a) => a.name === "acorn_weevil"), false);
  assert.ok(E.actsFor("click_beetle").some((a) => a.name === "elaterhush"));
  assert.ok(E.actsFor("click_beetle").some((a) => a.name === "clickjack_soft"));
  assert.ok(E.actsFor("click_beetle").some((a) => a.name === "eyespotflash_soft"));
  assert.ok(E.actsFor("click_beetle").some((a) => a.name === "clickfreeze_soft"));
  assert.ok(E.actsFor("click_beetle").some((a) => a.name === "tickwalk_soft"));
  assert.ok(E.actsFor("click_beetle").some((a) => a.name === "feelertick_soft"));
  assert.ok(E.actsFor("click_beetle").some((a) => a.name === "rightingclick_soft"));
  assert.ok(E.actsFor("click_beetle").some((a) => a.name === "freeze"));
  assert.equal(E.actsFor("click_beetle").some((a) => a.name === "raise"), false);
  assert.equal(E.actsFor("click_beetle").some((a) => a.name === "walk"), false);
  assert.equal(E.actsFor("click_beetle").some((a) => a.name === "still"), false);
  assert.equal(E.actsFor("click_beetle").some((a) => a.name === "click"), false);
  assert.equal(E.actsFor("click_beetle").some((a) => a.name === "click_beetle"), false);
  assert.ok(E.actsFor("robber_fly").some((a) => a.name === "asilushush"));
  assert.ok(E.actsFor("robber_fly").some((a) => a.name === "sallyhawk_soft"));
  assert.ok(E.actsFor("robber_fly").some((a) => a.name === "beardgroom_soft"));
  assert.ok(E.actsFor("robber_fly").some((a) => a.name === "midsnatch_soft"));
  assert.ok(E.actsFor("robber_fly").some((a) => a.name === "stiltsstance_soft"));
  assert.ok(E.actsFor("robber_fly").some((a) => a.name === "mystaxwipe_soft"));
  assert.ok(E.actsFor("robber_fly").some((a) => a.name === "perchsally_soft"));
  assert.ok(E.actsFor("robber_fly").some((a) => a.name === "freeze"));
  assert.equal(E.actsFor("robber_fly").some((a) => a.name === "raise"), false);
  assert.equal(E.actsFor("robber_fly").some((a) => a.name === "walk"), false);
  assert.equal(E.actsFor("robber_fly").some((a) => a.name === "still"), false);
  assert.equal(E.actsFor("robber_fly").some((a) => a.name === "hunt"), false);
  assert.equal(E.actsFor("robber_fly").some((a) => a.name === "perch"), false);
  assert.equal(E.actsFor("robber_fly").some((a) => a.name === "robber_fly"), false);
  assert.equal(E.actsFor("robber_fly").some((a) => a.name === "rob"), false);
});

test("canopy keys never schedule scratch or a snake tongue", () => {
  const canopy = [
    "sloth", "lemur", "gibbon", "kinkajou", "colugo",
    "flying_squirrel", "howler", "tarsier", "potto", "koala",
  ];
  for (const key of canopy) {
    const names = E.actsFor(key).map((a) => a.name);
    assert.ok(names.length > 0, key);
    assert.equal(names.includes("scratch"), false, key);
    assert.equal(names.includes("tongue"), false, key);
  }
  assert.ok(E.actsFor("sloth").some((a) => a.name === "bradypushush"));
  assert.ok(E.actsFor("sloth").some((a) => a.name === "hangsway_soft"));
  assert.ok(E.actsFor("sloth").some((a) => a.name === "freeze"));
  assert.equal(E.actsFor("sloth").some((a) => a.name === "hang"), false);
  assert.equal(E.actsFor("sloth").some((a) => a.name === "still"), false);
  assert.ok(E.actsFor("lemur").some((a) => a.name === "lemurhush"));
  assert.ok(E.actsFor("lemur").some((a) => a.name === "sunworship_soft"));
  assert.ok(E.actsFor("lemur").some((a) => a.name === "freeze"));
  assert.equal(E.actsFor("lemur").some((a) => a.name === "sun"), false);
  assert.ok(E.actsFor("gibbon").some((a) => a.name === "hylobateshush"));
  assert.ok(E.actsFor("gibbon").some((a) => a.name === "brachiate_soft"));
  assert.ok(E.actsFor("gibbon").some((a) => a.name === "freeze"));
  assert.equal(E.actsFor("gibbon").some((a) => a.name === "swing"), false);
  assert.ok(E.actsFor("flying_squirrel").some((a) => a.name === "glaucomyshush"));
  assert.ok(E.actsFor("flying_squirrel").some((a) => a.name === "membranelaunch_soft"));
  assert.ok(E.actsFor("flying_squirrel").some((a) => a.name === "freeze"));
  assert.equal(E.actsFor("flying_squirrel").some((a) => a.name === "glide"), false);
  assert.ok(E.actsFor("koala").some((a) => a.name === "phascolarctoshush"));
  assert.ok(E.actsFor("koala").some((a) => a.name === "eucchewbrowse_soft"));
  assert.ok(E.actsFor("koala").some((a) => a.name === "freeze"));
  assert.equal(E.actsFor("koala").some((a) => a.name === "chew"), false);
});

test("reef keys never schedule scratch or a snake tongue", () => {
  const reef = [
    "brain_coral", "anemone", "clownfish", "parrotfish", "cleaner_shrimp",
    "sea_cucumber", "lionfish", "giant_clam", "eagle_ray", "grouper",
  ];
  for (const key of reef) {
    const names = E.actsFor(key).map((a) => a.name);
    assert.ok(names.length > 0, key);
    assert.equal(names.includes("scratch"), false, key);
    assert.equal(names.includes("tongue"), false, key);
  }
  assert.ok(E.actsFor("brain_coral").some((a) => a.name === "diploriahush"));
  assert.ok(E.actsFor("brain_coral").some((a) => a.name === "freeze"));
  assert.equal(E.actsFor("brain_coral").some((a) => a.name === "ridge"), false);
  assert.ok(E.actsFor("anemone").some((a) => a.name === "actiniahush"));
  assert.ok(E.actsFor("anemone").some((a) => a.name === "freeze"));
  assert.equal(E.actsFor("anemone").some((a) => a.name === "wreath"), false);
  assert.ok(E.actsFor("clownfish").some((a) => a.name === "amphiprionhush"));
  assert.ok(E.actsFor("clownfish").some((a) => a.name === "freeze"));
  assert.equal(E.actsFor("clownfish").some((a) => a.name === "dart"), false);
  assert.ok(E.actsFor("parrotfish").some((a) => a.name === "scarushush"));
  assert.ok(E.actsFor("parrotfish").some((a) => a.name === "freeze"));
  assert.equal(E.actsFor("parrotfish").some((a) => a.name === "scrape"), false);
  assert.ok(E.actsFor("cleaner_shrimp").some((a) => a.name === "lysmatahush"));
  assert.ok(E.actsFor("cleaner_shrimp").some((a) => a.name === "freeze"));
  assert.equal(E.actsFor("cleaner_shrimp").some((a) => a.name === "wave"), false);
  assert.equal(E.actsFor("cleaner_shrimp").some((a) => a.name === "wait"), false);
  assert.ok(E.actsFor("sea_cucumber").some((a) => a.name === "holothuriahush"));
  assert.ok(E.actsFor("sea_cucumber").some((a) => a.name === "freeze"));
  assert.equal(E.actsFor("sea_cucumber").some((a) => a.name === "crawl"), false);
  assert.equal(E.actsFor("sea_cucumber").some((a) => a.name === "still"), false);
  assert.ok(E.actsFor("lionfish").some((a) => a.name === "pteroishush"));
  assert.ok(E.actsFor("lionfish").some((a) => a.name === "freeze"));
  assert.equal(E.actsFor("lionfish").some((a) => a.name === "veil"), false);
  assert.equal(E.actsFor("lionfish").some((a) => a.name === "hover"), false);
  assert.equal(E.actsFor("lionfish").some((a) => a.name === "still"), false);
  assert.ok(E.actsFor("giant_clam").some((a) => a.name === "tridacnahush"));
  assert.ok(E.actsFor("giant_clam").some((a) => a.name === "freeze"));
  assert.equal(E.actsFor("giant_clam").some((a) => a.name === "open"), false);
  assert.equal(E.actsFor("giant_clam").some((a) => a.name === "mantle"), false);
  assert.equal(E.actsFor("giant_clam").some((a) => a.name === "still"), false);
  assert.ok(E.actsFor("eagle_ray").some((a) => a.name === "aetobatushush"));
  assert.ok(E.actsFor("eagle_ray").some((a) => a.name === "freeze"));
  assert.equal(E.actsFor("eagle_ray").some((a) => a.name === "soar"), false);
  assert.equal(E.actsFor("eagle_ray").some((a) => a.name === "glide"), false);
  assert.equal(E.actsFor("eagle_ray").some((a) => a.name === "still"), false);
  assert.ok(E.actsFor("grouper").some((a) => a.name === "epinephelushush"));
  assert.ok(E.actsFor("grouper").some((a) => a.name === "freeze"));
  assert.equal(E.actsFor("grouper").some((a) => a.name === "hide"), false);
  assert.equal(E.actsFor("grouper").some((a) => a.name === "gape"), false);
  assert.equal(E.actsFor("grouper").some((a) => a.name === "still"), false);
  assert.ok(E.actsFor("cyber_dragon").some((a) => a.name === "cyberhush"));
  assert.ok(E.actsFor("cyber_dragon").some((a) => a.name === "freeze"));
  assert.equal(E.actsFor("cyber_dragon").some((a) => a.name === "arc"), false);
  assert.equal(E.actsFor("cyber_dragon").some((a) => a.name === "still"), false);
  assert.equal(E.actsFor("cyber_dragon").some((a) => a.name === "watch"), false);
  assert.ok(E.actsFor("volt_dragon").some((a) => a.name === "volthush"));
  assert.ok(E.actsFor("volt_dragon").some((a) => a.name === "freeze"));
  assert.equal(E.actsFor("volt_dragon").some((a) => a.name === "current"), false);
  assert.equal(E.actsFor("volt_dragon").some((a) => a.name === "still"), false);
  assert.equal(E.actsFor("volt_dragon").some((a) => a.name === "watch"), false);
  assert.ok(E.actsFor("trace_dragon").some((a) => a.name === "tracehush"));
  assert.ok(E.actsFor("trace_dragon").some((a) => a.name === "freeze"));
  assert.equal(E.actsFor("trace_dragon").some((a) => a.name === "path"), false);
  assert.equal(E.actsFor("trace_dragon").some((a) => a.name === "still"), false);
  assert.equal(E.actsFor("trace_dragon").some((a) => a.name === "watch"), false);
  assert.ok(E.actsFor("flux_dragon").some((a) => a.name === "fluxhush"));
  assert.ok(E.actsFor("flux_dragon").some((a) => a.name === "freeze"));
  assert.equal(E.actsFor("flux_dragon").some((a) => a.name === "field"), false);
  assert.equal(E.actsFor("flux_dragon").some((a) => a.name === "still"), false);
  assert.equal(E.actsFor("flux_dragon").some((a) => a.name === "watch"), false);
  assert.ok(E.actsFor("spark_dragon").some((a) => a.name === "sparkhush"));
  assert.ok(E.actsFor("spark_dragon").some((a) => a.name === "freeze"));
  assert.equal(E.actsFor("spark_dragon").some((a) => a.name === "crackle"), false);
  assert.equal(E.actsFor("spark_dragon").some((a) => a.name === "still"), false);
  assert.equal(E.actsFor("spark_dragon").some((a) => a.name === "watch"), false);
  assert.ok(E.actsFor("ion_dragon").some((a) => a.name === "ionhush"));
  assert.ok(E.actsFor("ion_dragon").some((a) => a.name === "freeze"));
  assert.equal(E.actsFor("ion_dragon").some((a) => a.name === "haze"), false);
  assert.equal(E.actsFor("ion_dragon").some((a) => a.name === "still"), false);
  assert.equal(E.actsFor("ion_dragon").some((a) => a.name === "watch"), false);
  assert.ok(E.actsFor("gauss_dragon").some((a) => a.name === "gausshush"));
  assert.ok(E.actsFor("gauss_dragon").some((a) => a.name === "freeze"));
  assert.equal(E.actsFor("gauss_dragon").some((a) => a.name === "filing"), false);
  assert.equal(E.actsFor("gauss_dragon").some((a) => a.name === "still"), false);
  assert.equal(E.actsFor("gauss_dragon").some((a) => a.name === "watch"), false);
});
