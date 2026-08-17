/** Species-true idle acts — same map as web `ethogram.ts` and PyQt `ethogram.py`. */
(function (root) {
  const A = (name, motion, hold, weight, anim) =>
    anim ? { name, motion, hold, weight, anim } : { name, motion, hold, weight };
  const PREEN = [
    A("preen", "groom", 1.4, 3, "sit"),
    A("hop_step", "hop", 0.5, 2, "play"),
    A("wings", "pulse", 0.7, 1, "play"),
  ];
  const ETHOGRAM = {
    dog: [A("scratch", "scratch", 1.2, 3, "sit"), A("shake", "shake", 0.7, 2), A("yawn", "yawn", 1.1, 2), A("circle_sit", "circle", 1.6, 2, "sit")],
    cat: [A("groom", "groom", 1.6, 3, "sit"), A("scratch", "scratch", 1.1, 2, "sit"), A("yawn", "yawn", 1.2, 2), A("stretch", "stretch", 1.4, 2, "sit"), A("claim", "sit_hold", 2.2, 1, "sit")],
    fox: [A("stretch", "stretch", 1.3, 2, "sit"), A("yawn", "yawn", 1.1, 2), A("pounce", "hop", 0.7, 2, "play")],
    red_panda: [A("groom", "groom", 1.5, 3, "sit"), A("scratch", "scratch", 1.1, 2, "sit"), A("steal_dart", "dart", 1.2, 2), A("wash", "groom", 1.3, 2, "sit")],
    rabbit: [A("face_wash", "groom", 1.2, 3, "sit"), A("freeze", "freeze", 1.4, 2), A("flop", "sit_hold", 2.4, 2, "sit"), A("binky", "hop", 0.6, 1, "play")],
    hamster: [A("nibble", "eat", 1.1, 3, "eat"), A("groom", "groom", 1.2, 2, "sit"), A("freeze", "freeze", 1.0, 2), A("burst", "dart", 0.9, 2)],
    guinea_pig: [A("wheek", "talk", 0.8, 1, "talk"), A("popcorn", "hop", 0.45, 2, "play"), A("freeze", "freeze", 1.2, 2), A("groom", "groom", 1.3, 3, "sit")],
    ferret: [A("warble", "hop", 0.7, 3, "play"), A("tunnel", "sit_hold", 1.4, 2, "sit"), A("dook", "talk", 0.7, 1, "talk")],
    hedgehog: [A("snuffle", "wiggle", 1.0, 3), A("curl", "sit_hold", 1.8, 2, "sit"), A("unroll", "stretch", 1.2, 2)],
    chinchilla: [A("dust_shake", "shake", 0.9, 3, "sit"), A("hop", "hop", 0.55, 2, "play"), A("groom", "groom", 1.2, 2, "sit")],
    turtle: [A("bask", "sit_hold", 3.2, 3, "sit"), A("blink", "freeze", 1.6, 2)],
    iguana: [A("bask", "sit_hold", 3.0, 3, "sit"), A("head_bob", "bob", 1.4, 2), A("still", "freeze", 2.0, 2)],
    dragon: [A("watch", "sit_hold", 2.4, 3, "sit"), A("huff", "pulse", 0.8, 2), A("bask", "sit_hold", 2.8, 2, "sit")],
    axolotl: [A("gill", "bob", 1.4, 3), A("still", "freeze", 2.0, 2), A("gulp", "gulp", 0.7, 1)],
    budgie: PREEN,
    parrot: PREEN,
    toucan: PREEN,
    phoenix: PREEN,
    penguin: [A("preen", "groom", 1.4, 3, "sit"), A("nod", "nod", 0.7, 2, "sit"), A("huddle", "sit_hold", 2.0, 2, "sit")],
    goldfish: [A("gulp", "gulp", 0.6, 2), A("flare", "pulse", 0.7, 2)],
    ball_python: [A("tongue", "tongue", 0.7, 4), A("coil", "sit_hold", 2.8, 3, "sit"), A("hide_head", "sit_hold", 1.6, 2, "sit"), A("gape", "gape", 1.2, 1)],
    corn_snake: [A("tongue", "tongue", 0.7, 4), A("explore", "freeze", 1.2, 2), A("slither", "dart", 1.0, 2)],
    kingsnake: [A("tongue", "tongue", 0.7, 4), A("inspect", "freeze", 1.4, 3), A("still", "sit_hold", 1.8, 2, "sit")],
    green_tree_python: [A("tongue", "tongue", 0.7, 4), A("drape", "sit_hold", 2.6, 3, "sit")],
    hognose: [A("tongue", "tongue", 0.7, 4), A("flatten", "sit_hold", 1.4, 2, "sit"), A("playdead", "sit_hold", 1.8, 1, "sit"), A("gape", "gape", 1.1, 1)],
    garter: [A("tongue", "tongue", 0.7, 4), A("patrol", "wiggle", 0.8, 2), A("dart", "dart", 0.9, 2)],
    boa: [A("tongue", "tongue", 0.7, 3), A("hold", "sit_hold", 3.0, 3, "sit")],
    milk_snake: [A("tongue", "tongue", 0.7, 4), A("mimic", "freeze", 1.6, 2)],
    rosy_boa: [A("tongue", "tongue", 0.7, 3), A("nest", "sit_hold", 2.6, 3, "sit")],
    carpet_python: [A("tongue", "tongue", 0.7, 4), A("drape", "sit_hold", 2.2, 3, "sit")],
  };
  const TONGUE_KEYS = [
    "ball_python", "corn_snake", "kingsnake", "green_tree_python", "hognose",
    "garter", "boa", "milk_snake", "rosy_boa", "carpet_python",
  ];
  const SCRATCH_KEYS = ["dog", "cat", "red_panda"];

  function actsFor(key) {
    return (key && ETHOGRAM[key]) || [];
  }

  function pickAct(key) {
    const list = actsFor(key);
    if (!list.length) return null;
    let roll = Math.random() * list.reduce((sum, act) => sum + act.weight, 0);
    for (const act of list) {
      roll -= act.weight;
      if (roll <= 0) return act;
    }
    return list[list.length - 1] || null;
  }

  function nextActWait(wander, nocturnal, night) {
    let wait = 20 - Math.max(0, Math.min(1, wander)) * 12;
    if (wander < 0.18) wait += 8;
    if (nocturnal && night) wait *= 0.7;
    if (nocturnal && !night) wait *= 1.22;
    return Math.max(8, wait) * (0.85 + Math.random() * 0.35);
  }

  function afterSettleWait(wander) {
    const late = wander < 0.18;
    return (late ? 6 : 3) + Math.random() * (late ? 5 : 4);
  }

  function tongueFlick(t, hold) {
    if (t < 0 || t > hold) return 0;
    const cycle = 0.22;
    const n = Math.floor(t / cycle);
    if (n >= 3) return 0;
    const u = (t % cycle) / cycle;
    return u < 0.55 ? 1 - u / 0.55 : 0;
  }

  function actPose(motion, t, hold) {
    const u = hold > 0 ? Math.max(0, Math.min(1, t / hold)) : 1;
    const pose = { dx: 0, dy: 0, rot: 0, stretch: 1, squat: 1 };
    if (!motion) return pose;
    if (motion === "scratch") {
      pose.dx = Math.sin(t * 28) * 2.2;
      pose.rot = Math.sin(t * 28) * 3.2;
    } else if (motion === "shake") pose.dx = Math.sin(t * 40) * 3.4;
    else if (motion === "yawn") {
      pose.stretch = 1 + Math.sin(u * Math.PI) * 0.08;
      pose.squat = 2 - pose.stretch;
    } else if (motion === "groom") {
      pose.dy = Math.sin(t * 10) * 3;
      pose.stretch = 1 + Math.sin(t * 10) * 0.02;
    } else if (motion === "stretch") {
      pose.stretch = 1 + Math.sin(u * Math.PI) * 0.1;
      pose.squat = 1 - Math.sin(u * Math.PI) * 0.05;
    } else if (motion === "wiggle") pose.dx = Math.sin(t * 16) * 2;
    else if (motion === "bob") pose.dy = Math.sin(t * 8) * 4;
    else if (motion === "pulse") {
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
    }
    return pose;
  }

  const api = {
    ETHOGRAM,
    TONGUE_KEYS,
    SCRATCH_KEYS,
    actsFor,
    pickAct,
    nextActWait,
    afterSettleWait,
    tongueFlick,
    actPose,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetEthogram = api;
})(typeof window !== "undefined" ? window : globalThis);
