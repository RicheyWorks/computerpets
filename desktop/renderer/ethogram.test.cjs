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
  assert.ok(names.includes("bulb_soft"));
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

test("orchid ethogram is Moth ultra (bark + softs + freeze, not unfurl/nod/lean)", () => {
  const names = E.actsFor("orchid").map((a) => a.name);
  assert.ok(names.includes("bark"));
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
  assert.ok(names.includes("veil_soft"));
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
  assert.ok(names.includes("band_soft"));
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
  assert.ok(names.includes("rosette_soft"));
  assert.ok(names.includes("oak_soft"));
  assert.ok(names.includes("soft_soft"));
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
  assert.ok(names.includes("lumen_soft"));
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
  assert.ok(E.actsFor("nexus").some((a) => a.name === "count-ripple"));
  assert.ok(E.actsFor("halovore").some((a) => a.name === "frost"));
  assert.ok(E.actsFor("magneton").some((a) => a.name === "align"));
  assert.ok(E.actsFor("umbral").some((a) => a.name === "dim"));
  assert.ok(E.actsFor("cyst").some((a) => a.name === "wake"));
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
  assert.ok(E.actsFor("fiddler_crab").some((a) => a.name === "wave"));
  assert.ok(E.actsFor("field_cricket").some((a) => a.name === "chirp"));
  assert.ok(E.actsFor("grasshopper").some((a) => a.name === "vault"));
  assert.ok(E.actsFor("click_beetle").some((a) => a.name === "click"));
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
  assert.ok(E.actsFor("sloth").some((a) => a.name === "hang"));
  assert.ok(E.actsFor("lemur").some((a) => a.name === "sun"));
  assert.ok(E.actsFor("gibbon").some((a) => a.name === "swing"));
  assert.ok(E.actsFor("flying_squirrel").some((a) => a.name === "glide"));
  assert.ok(E.actsFor("koala").some((a) => a.name === "chew"));
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
  assert.ok(E.actsFor("brain_coral").some((a) => a.name === "ridge"));
  assert.ok(E.actsFor("anemone").some((a) => a.name === "wreath"));
  assert.ok(E.actsFor("clownfish").some((a) => a.name === "dart"));
  assert.ok(E.actsFor("parrotfish").some((a) => a.name === "scrape"));
  assert.ok(E.actsFor("grouper").some((a) => a.name === "hide"));
});
