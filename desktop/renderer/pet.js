const BASE = 176;
const PAD = 16;
const STORE_KIND = "computerpets.desktop.kind.v1";
const FPS = { idle: 2.8, walk: 6.4, sit: 2.2, sleep: 1.8, talk: 4.6, eat: 3.8, play: 6.6 };
const ONCE = new Set(["eat", "play"]);

function pack(key) {
  const n = (anim, count) =>
    Array.from({ length: count }, (_, i) => `sprites/${key}/${anim}/${i + 1}.png`);
  return {
    idle: n("idle", 4),
    walk: n("walk", 6),
    sit: n("sit", key === "red_panda" ? 2 : 4),
    sleep: n("sleep", 4),
    talk: n("talk", 4),
    eat: n("eat", 4),
    play: n("play", 4),
  };
}

function pick(list) {
  return list[Math.floor(Math.random() * list.length)] ?? list[0];
}
function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

const pet = document.getElementById("pet");
const guestEl = document.getElementById("guest");
const tongueEl = document.getElementById("tongue");
const shadow = document.getElementById("shadow");
const bubble = document.getElementById("bubble");
const bubbleText = document.getElementById("bubble-text");
const dustRoot = document.getElementById("dust");
const messRoot = document.getElementById("mess");
const giftRoot = document.getElementById("gifts");
const weatherRoot = document.getElementById("weather");
const treatEl = document.getElementById("treat");
const lureEl = document.getElementById("lure");
const hud = document.getElementById("hud");
const hudName = document.getElementById("hud-name");
const hudVital = document.getElementById("hud-vital");
const barHunger = document.getElementById("bar-hunger");
const barMood = document.getElementById("bar-mood");
const barEnergy = document.getElementById("bar-energy");
const barHygiene = document.getElementById("bar-hygiene");
for (let i = 0; i < 12; i++) dustRoot.appendChild(document.createElement("span"));

let roster = [];
let kind = null;
let trait = null;
let life = null;

const sim = {
  x: 80,
  facing: 1,
  anim: "idle",
  frame: 0,
  acc: 0,
  target: null,
  hop: 0,
  land: 0,
  walkAge: 0,
  dragging: false,
  dragDx: 0,
  pointerStart: null,
  cursorX: null,
  dust: [],
  stepAcc: 0,
  lastOrder: -1,
  order: 0,
  cmd: "wander",
  bob: 0,
  turnHold: 0,
  pendingFacing: null,
  waypoints: [],
  pause: 0,
  settle: 0,
  settleDir: 1,
  overshoot: 0,
  poseHold: 0,
  pendingPose: null,
  shift: 0,
  shiftAge: 0,
  arrivedPending: false,
  act: null,
  actMotion: null,
  actT: 0,
  actHold: 0,
  actWait: 10 + Math.random() * 8,
  actWalk: false,
};

let speechUntil = 0;
let clickable = false;
let hudUntil = 0;
let mark = null;
let taken = false;
let leaving = false;
let lureTimer = 0;

function skyOf() {
  const n = new Date();
  const day = Math.floor(Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()) / 86400000);
  const r = ((day * 9301 + 49297) % 233280) / 233280;
  if (r < 0.4) return "clear";
  if (r < 0.62) return "rain";
  if (r < 0.82) return "wind";
  return "heat";
}

function skyLabel(w) {
  if (w === "rain") return "Rain";
  if (w === "wind") return "Wind";
  if (w === "heat") return "Heat";
  return "Clear";
}

function paintWeather() {
  if (!weatherRoot) return;
  const w = skyOf();
  weatherRoot.className = `weather weather-${w}`;
  weatherRoot.replaceChildren();
  if (w === "rain") {
    for (let i = 0; i < 16; i++) {
      const s = document.createElement("span");
      s.className = "wx-rain";
      s.style.left = `${4 + i * 6}%`;
      s.style.animationDelay = `${(i % 6) * 0.16}s`;
      weatherRoot.appendChild(s);
    }
  }
  if (w === "wind") {
    for (let i = 0; i < 7; i++) {
      const s = document.createElement("span");
      s.className = "wx-gust";
      s.style.top = `${16 + i * 10}%`;
      s.style.animationDelay = `${i * 0.35}s`;
      weatherRoot.appendChild(s);
    }
  }
}

function persist() {
  if (kind && life) window.PetLife.save(kind.key, life);
}

function say(text, hold = 4200) {
  if (!text) return;
  bubbleText.textContent = text;
  bubble.classList.add("open");
  speechUntil = performance.now() + hold;
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = trait?.rate ?? 0.94;
    u.pitch = trait?.pitch ?? 1.05;
    window.speechSynthesis.speak(u);
  }
  hudUntil = performance.now() + hold;
}

function issue(cmd) {
  sim.order += 1;
  sim.cmd = cmd;
}

function lineFrom(result) {
  if (result.line) return result.line;
  if (!kind || !result.useRoster) return null;
  const pack = kind.lines;
  if (result.useRoster === "hungry") return pick(pack.hungry);
  if (result.useRoster === "tired") return pick(pack.tired);
  if (result.useRoster === "feed") return pick(pack.feed);
  if (result.useRoster === "play") return pick(pack.play);
  if (result.useRoster === "rest") return pick(pack.rest);
  return pick(pack.ambient);
}

function paintHud() {
  if (!life || !kind) return;
  hudName.textContent = `${kind.name} · ${life.stage}`;
  const hive = window.PetHive && window.PetHive.isHivePlace(kind.key) ? window.PetHive.colonyOf(life, life.hidden) : null;
  const vital = hive
    ? `${window.PetHive.colonyWord(hive)} · Brood · ${hive.brood} · Stores · ${hive.stores}`
    : `${window.PetLife.vitals({ ...life, blue: window.PetLife.isBlue(life, kind.key) }, kind.key)} · ${skyLabel(skyOf())}${life.gifts?.length ? ` · ${life.gifts.length} gift${life.gifts.length > 1 ? "s" : ""}` : ""}`;
  hudVital.textContent = vital;
  pet.classList.toggle("dull", !!(hive && hive.quiet));
  barHunger.style.setProperty("--w", `${life.hunger}%`);
  barMood.style.setProperty("--w", `${life.mood}%`);
  barEnergy.style.setProperty("--w", `${life.energy}%`);
  barHygiene.style.setProperty("--w", `${life.hygiene}%`);
  hud.classList.toggle("show", performance.now() < hudUntil || life.sick || life.hidden);
  window.desk?.vitals({
    key: kind.key,
    name: kind.name,
    vital: window.PetLife.vitals(life, kind.key),
    hunger: life.hunger,
    sick: life.sick,
    hidden: life.hidden,
    mess: life.mess.length,
    stage: life.stage,
    bond: life.bond,
  });
}

function paintMess() {
  if (!life) return;
  const width = window.innerWidth;
  messRoot.replaceChildren();
  for (const m of life.mess) {
    const el = document.createElement("button");
    el.type = "button";
    el.className = "mess-dot";
    el.dataset.hit = "1";
    el.style.transform = `translate3d(${m.x * (width - 40)}px, 0, 0)`;
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      life.mess = life.mess.filter((x) => x.id !== m.id);
      life.hygiene = Math.min(100, life.hygiene + 10);
      persist();
      paintMess();
      paintHud();
    });
    messRoot.appendChild(el);
  }
  paintGifts();
}

function paintGifts() {
  if (!life || !giftRoot) return;
  const width = window.innerWidth;
  giftRoot.replaceChildren();
  for (const g of life.gifts || []) {
    const el = document.createElement("button");
    el.type = "button";
    el.className = g.kind === "shed" ? "shed-dot" : "gift-dot";
    el.dataset.hit = "1";
    el.style.transform = `translate3d(${g.x * (width - 40)}px, 0, 0)`;
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      life.gifts = (life.gifts || []).filter((x) => x.id !== g.id);
      life.mood = Math.min(100, life.mood + 6);
      life.bond = Math.min(100, life.bond + 2);
      persist();
      say("I left this.");
      paintGifts();
      paintHud();
    });
    giftRoot.appendChild(el);
  }
}

function maybeNotify() {
  if (!life || !kind) return;
  const alert = window.PetLife.alerts(life, kind.name);
  if (!alert) return;
  life.lastNotify = Date.now();
  persist();
  window.desk?.notify(alert.title, alert.body);
}

function tickLife() {
  if (!life || !trait) return;
  const { grew } = window.PetLife.decay(life, trait, Date.now(), kind.key);
  if (grew) {
    say(life.stage === "grown" ? "I grew into the room." : "I have been here a long while.");
    window.desk?.notify(kind.name, life.stage === "grown" ? `${kind.name} grew up.` : `${kind.name} is an elder now.`);
  }
  persist();
  paintHud();
  paintMess();
  maybeNotify();
}

function playSound(kindName) {
  try {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return;
    const ac = playSound.ctx || (playSound.ctx = new Ctor());
    void ac.resume();
    const now = ac.currentTime;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    const j = 0.92 + Math.random() * 0.16;
    osc.type = kindName === "munch" ? "square" : "sine";
    osc.frequency.setValueAtTime((kindName === "step" ? 140 : kindName === "hop" ? 320 : 480) * j, now);
    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.start(now);
    osc.stop(now + 0.12);
  } catch {
    /* ignore */
  }
}

function puff(x, n = 4) {
  for (let i = 0; i < n; i++) {
    sim.dust.push({
      x: x + 60 + (Math.random() - 0.5) * 36,
      y: 8,
      vx: (Math.random() - 0.5) * 36,
      vy: -12 - Math.random() * 22,
      life: 0.45 + Math.random() * 0.25,
      size: 3 + Math.random() * 4,
    });
  }
  if (sim.dust.length > 18) sim.dust.splice(0, sim.dust.length - 18);
}

const TREAT_SHAPE = {
  red_panda: "bamboo",
  cat: "crumb",
  dog: "crumb",
  rabbit: "leaf",
  hamster: "seed",
  guinea_pig: "leaf",
  turtle: "leaf",
  goldfish: "flake",
  budgie: "seed",
  fox: "crumb",
  penguin: "pebble",
  parrot: "seed",
  ferret: "crumb",
  hedgehog: "crumb",
  chinchilla: "seed",
  axolotl: "flake",
  toucan: "leaf",
  iguana: "leaf",
  dragon: "ember",
  phoenix: "ember",
  ball_python: "crumb",
  corn_snake: "crumb",
  kingsnake: "egg",
  green_tree_python: "ember",
  hognose: "crumb",
  garter: "flake",
  boa: "crumb",
  milk_snake: "egg",
  rosy_boa: "crumb",
  carpet_python: "crumb",
  octopus: "crumb",
  cuttlefish: "crumb",
  nautilus: "crumb",
  moon_jelly: "flake",
  sea_star: "pebble",
  hermit_crab: "crumb",
  horseshoe_crab: "flake",
  seahorse: "flake",
  manta: "flake",
  moray: "crumb",
  moss: "flake",
  maidenhair: "flake",
  ginkgo: "leaf",
  oak: "leaf",
  water_lily: "flake",
  orchid: "flake",
  saguaro: "pebble",
  venus_flytrap: "crumb",
  pitcher: "crumb",
  sundew: "crumb",
  honeybee: "flake",
  monarch: "leaf",
  luna: "flake",
  firefly: "crumb",
  darner: "crumb",
  stick: "leaf",
  carpenter_ant: "flake",
  ladybird: "crumb",
  mantis: "crumb",
  cicada: "flake",
  oyster: "leaf",
  fly_agaric: "flake",
  morel: "flake",
  chanterelle: "flake",
  turkey_tail: "leaf",
  lions_mane: "leaf",
  puffball: "flake",
  chicken_of_woods: "leaf",
  yeast: "crumb",
  lichen: "flake",
  photovore: "flake",
  choir: "flake",
  nimbus: "flake",
  silica: "pebble",
  terminator: "ember",
  nexus: "crumb",
  halovore: "flake",
  magneton: "pebble",
  umbral: "flake",
  cyst: "crumb",
  frog: "crumb",
  toad: "crumb",
  newt: "flake",
  salamander: "flake",
  caecilian: "flake",
  crayfish: "crumb",
  pond_snail: "flake",
  mussel: "flake",
  leech: "flake",
  stickleback: "flake",
  paramecium: "flake",
  amoeba: "crumb",
  euglena: "flake",
  volvox: "flake",
  diatom: "pebble",
  kelp: "flake",
  chlamydomonas: "flake",
  stentor: "flake",
  coli: "crumb",
  haloarchaea: "flake",
  crow: "crumb",
  raven: "crumb",
  barn_owl: "crumb",
  red_tail: "crumb",
  chickadee: "seed",
  robin: "flake",
  mallard: "seed",
  canada_goose: "leaf",
  pileated: "crumb",
  hummingbird: "flake",
  orb_weaver: "crumb",
  jumping_spider: "crumb",
  wolf_spider: "crumb",
  tarantula: "crumb",
  widow: "crumb",
  harvestman: "crumb",
  scorpion: "crumb",
  vinegaroon: "crumb",
  tick: "flake",
  solifuge: "crumb",
  deer: "leaf",
  bat: "crumb",
  squirrel: "seed",
  otter: "crumb",
  raccoon: "crumb",
  skunk: "crumb",
  opossum: "crumb",
  beaver: "leaf",
  porcupine: "leaf",
  black_bear: "leaf",
  gecko: "crumb",
  anole: "crumb",
  skink: "crumb",
  chameleon: "crumb",
  horned_lizard: "crumb",
  alligator: "crumb",
  crocodile: "crumb",
  snapper: "crumb",
  box_turtle: "crumb",
  tuatara: "crumb",
  bass: "flake",
  brook_trout: "flake",
  catfish: "crumb",
  bluegill: "flake",
  perch: "flake",
  pike: "crumb",
  walleye: "flake",
  paddlefish: "flake",
  lamprey: "pebble",
  american_eel: "crumb",
  house_centipede: "crumb",
  millipede: "leaf",
  pillbug: "leaf",
  earthworm: "leaf",
  velvet_worm: "crumb",
  springtail: "flake",
  tardigrade: "flake",
  planarian: "crumb",
  nematode: "flake",
  amphipod: "crumb",
  bumblebee: "flake",
  carpenter_bee: "flake",
  mason_bee: "flake",
  leafcutter: "flake",
  stingless: "flake",
  sweat_bee: "flake",
  mining_bee: "flake",
  honey_drone: "flake",
  honey_queen: "flake",
  honeycomb: "flake",
  fiddler_crab: "flake",
  ghost_crab: "crumb",
  limpet: "flake",
  barnacle: "flake",
  chiton: "flake",
  periwinkle: "flake",
  sand_dollar: "flake",
  sea_urchin: "leaf",
  knobbed_whelk: "crumb",
  lugworm: "pebble",
  field_cricket: "flake",
  katydid: "leaf",
  grasshopper: "leaf",
  swallowtail: "flake",
  jewelwing: "crumb",
  lacewing: "crumb",
  earwig: "crumb",
  acorn_weevil: "crumb",
  click_beetle: "crumb",
  robber_fly: "crumb",
  sloth: "leaf",
  lemur: "leaf",
  gibbon: "leaf",
  kinkajou: "flake",
  colugo: "leaf",
  flying_squirrel: "seed",
  howler: "leaf",
  tarsier: "crumb",
  potto: "flake",
  koala: "leaf",
  brain_coral: "flake",
  anemone: "flake",
  clownfish: "flake",
  parrotfish: "flake",
  cleaner_shrimp: "crumb",
  sea_cucumber: "pebble",
  lionfish: "crumb",
  giant_clam: "flake",
  eagle_ray: "crumb",
  grouper: "crumb",
};

function placeMark(kindName, x, hops = 0, meal) {
  taken = false;
  mark = { kind: kindName, x, hops, meal: kindName === "treat" ? meal || "snack" : undefined };
  const el = kindName === "treat" ? treatEl : lureEl;
  const other = kindName === "treat" ? lureEl : treatEl;
  other.classList.remove("show");
  el.classList.add("show");
  el.style.transform = `translate3d(${x}px, 0, 0)`;
  if (kindName === "treat") treatEl.dataset.shape = TREAT_SHAPE[kind?.key] || "crumb";
  window.clearTimeout(lureTimer);
  if (kindName === "lure" && hops === 0) {
    lureTimer = window.setTimeout(() => {
      if (!mark || mark.kind !== "lure" || mark.hops > 0) return;
      const width = window.innerWidth;
      placeMark("lure", 80 + Math.random() * Math.max(80, width - 200), 1);
      issue("seek");
    }, 2200);
  }
}

function clearMark() {
  mark = null;
  window.clearTimeout(lureTimer);
  treatEl.classList.remove("show");
  lureEl.classList.remove("show");
}

function applyCommand() {
  if (sim.dragging || !trait) return;
  if (life?.hidden && sim.cmd !== "enter") {
    sim.anim = "sit";
    sim.target = null;
    return;
  }
  if (life?.asleep && sim.cmd !== "talk" && sim.cmd !== "play" && sim.cmd !== "eat" && sim.cmd !== "seek" && sim.cmd !== "leave" && sim.cmd !== "enter") {
    sim.anim = "sleep";
    sim.target = null;
    return;
  }
  if (sim.order === sim.lastOrder || sim.cmd === "none") return;
  if (sim.act && (sim.cmd === "wander" || sim.cmd === "idle")) {
    sim.lastOrder = sim.order;
    return;
  }
  sim.lastOrder = sim.order;
  clearAct();
  const width = window.innerWidth;
  const max = Math.max(PAD, width - BASE - PAD);
  sim.poseHold = 0;
  sim.pendingPose = null;
  if (sim.cmd === "wander") {
    if (trait.wander < 0.1 && Math.random() > trait.wander * 8) {
      sim.anim = "sit";
      sim.target = null;
      return;
    }
    const p = gaitProfile();
    let next = PAD + Math.random() * Math.max(48, max - PAD);
    if (trait.clingy && sim.cursorX != null) next = clamp(sim.cursorX - BASE / 2, PAD, max);
    if (Math.abs(next - sim.x) < 50) next = clamp(sim.x + sim.facing * 120, PAD, max);
    sim.waypoints = [];
    const twoBeat = Math.random() < (p.low || p.crawl ? 0.7 : 0.42);
    if (twoBeat) {
      let second = PAD + Math.random() * Math.max(48, max - PAD);
      if (Math.abs(second - next) < 40) second = clamp(next + sim.facing * 80, PAD, max);
      sim.waypoints = [second];
    }
    aimAt(next);
    return;
  }
  if (sim.cmd === "seek" && mark) {
    leaving = false;
    sim.waypoints = [];
    aimAt(clamp(mark.x - BASE * 0.4, PAD, max));
    return;
  }
  if (sim.cmd === "leave") {
    leaving = true;
    sim.waypoints = [];
    aimAt(sim.x + BASE / 2 < width / 2 ? -BASE - 24 : width + 12);
    return;
  }
  if (sim.cmd === "enter") {
    leaving = false;
    sim.waypoints = [];
    sim.x = Math.random() < 0.5 ? -BASE : max + BASE;
    aimAt(clamp(80 + Math.random() * Math.max(40, max - 80), PAD, max));
    return;
  }
  if (sim.cmd === "play") {
    sim.hop = 1;
    sim.anim = "play";
    sim.target = null;
    sim.waypoints = [];
    sim.turnHold = 0;
    sim.pendingFacing = null;
    sim.frame = 0;
    sim.acc = 0;
    playSound("hop");
    return;
  }
  if (["eat", "talk", "idle", "sit", "sleep"].includes(sim.cmd)) {
    sim.target = null;
    sim.waypoints = [];
    sim.turnHold = 0;
    sim.pendingFacing = null;
    sim.frame = 0;
    sim.acc = 0;
    if (sim.cmd === "sit" || sim.cmd === "sleep") {
      sim.poseHold = window.PetGait.POSE_HOLD_S;
      sim.pendingPose = sim.cmd;
      sim.anim = "idle";
    } else {
      sim.anim = sim.cmd;
    }
    if (sim.cmd === "eat") playSound("munch");
    if (sim.cmd === "talk") playSound("chirp");
  }
}

function handle(cmd) {
  if (!life || !trait || !kind) return;
  tickLife();
  if (cmd === "play") {
    if (life.hidden) return;
    const width = window.innerWidth;
    placeMark("lure", 80 + Math.random() * Math.max(80, width - 200));
    say(trait.special === "bug" ? "There. A bug." : "A ribbon. Catch it.");
    issue("seek");
    hudUntil = performance.now() + 5000;
    return;
  }
  if (cmd === "snack" || cmd === "feed") {
    if (life.hidden) return;
    const width = window.innerWidth;
    placeMark("treat", 80 + Math.random() * Math.max(80, width - 200), 0, cmd === "feed" ? "feed" : "snack");
    issue("seek");
    hudUntil = performance.now() + 4000;
    return;
  }
  if (cmd === "hide") {
    if (life.hidden) return;
    say(pick(trait.extra.hide || ["I went where the ribbon goes."]));
    leaving = true;
    issue("leave");
    hudUntil = performance.now() + 5000;
    return;
  }
  const result = window.PetLife.act(life, trait, cmd, Date.now(), kind.key);
  persist();
  if (cmd === "talk") {
    void askMind(result);
    return;
  }
  if (cmd === "call") {
    leaving = false;
    pet.classList.remove("hidden");
    issue("enter");
  }
  const text = lineFrom(result);
  say(text);
  if (result.cmd && cmd !== "call") issue(result.cmd);
  paintHud();
  paintMess();
  if (result.notify === "ribbon") window.desk?.notify(kind.name, `${kind.name} hid a ribbon.`);
  if (result.notify === "steal") window.desk?.notify(kind.name, `${kind.name} rearranged something.`);
  if (result.notify === "bug") window.desk?.notify(kind.name, `${kind.name} found a bug.`);
  hudUntil = performance.now() + 5000;
}

async function askMind(result) {
  const fallback = lineFrom(result) || pick(kind.lines.ambient);
  issue("talk");
  paintHud();
  if (!window.PetMind) {
    say(fallback);
    return;
  }
  try {
    const reply = await window.PetMind.run({
      name: kind.name,
      species: kind.key,
      system: `You are ${kind.name}, a ${kind.speciesLabel}. Speak in 1-2 short sentences, under 32 words. Never mention being an AI.`,
      hunger: life.hunger,
      mood: life.mood,
      energy: life.energy,
      message: undefined,
      fallback,
    });
    say(reply.text);
  } catch {
    say(fallback);
  }
  hudUntil = performance.now() + 5000;
}

function gaitProfile() {
  const G = window.PetGait;
  const walk = trait?.walk ?? 98;
  const hop = trait?.hop ?? 20;
  const crawl = G.isCrawlKey(kind?.key);
  return {
    walk,
    hop,
    perch: !!trait?.perch,
    aquatic: !!trait?.aquatic,
    crawl,
    low: G.isLowWalk(hop, walk),
    high: G.isHighWalk(walk),
  };
}

function walkSpeed(remaining, age) {
  const base = trait?.walk ?? 98;
  const startled = life && Date.now() < life.startledUntil ? 1.55 : 1;
  return window.PetGait.walkSpeed(remaining, age, base) * startled;
}

function aimAt(next) {
  const G = window.PetGait;
  const p = gaitProfile();
  sim.target = next;
  sim.walkAge = 0;
  sim.pause = 0;
  sim.settle = 0;
  sim.arrivedPending = false;
  const desired = next >= sim.x ? 1 : -1;
  if (desired !== sim.facing) {
    sim.turnHold = G.turnHoldS({ crawl: p.crawl, hop: p.hop, walk: p.walk });
    sim.pendingFacing = desired;
    sim.anim = "idle";
    sim.frame = 0;
    return;
  }
  sim.turnHold = 0;
  sim.pendingFacing = null;
  sim.facing = desired;
  sim.anim = "walk";
  sim.frame = 0;
}

function chaseOf() {
  return { taken, cmd: sim.cmd, mark: mark?.kind ?? null };
}

function applyArrive(via) {
  if (!life || !trait || !kind) return;
  const hop = window.PetPlay.playHop(chaseOf(), via);
  taken = hop.next.taken;
  if (hop.act === "hide") {
    life.hidden = true;
    persist();
    leaving = false;
    issue("idle");
    paintHud();
    return;
  }
  if (hop.act === "snack") {
    const care = mark?.meal === "feed" ? "feed" : "snack";
    clearMark();
    const prevBond = life.bond;
    const result = window.PetLife.act(life, trait, care, Date.now(), kind.key);
    persist();
    say(lineFrom(result) || window.PetLife.snackLine(kind.key));
    const title = window.PetLife.crossedBond(prevBond, life.bond);
    if (title) window.setTimeout(() => say(window.PetLife.BOND_LINE[title]), 900);
    if (hop.issueEat) issue("eat");
    paintHud();
    return;
  }
  if (hop.act === "play") {
    clearMark();
    const prevBond = life.bond;
    const result = window.PetLife.act(life, trait, "play", Date.now(), kind.key);
    persist();
    say(lineFrom(result) || pick(kind.lines.play));
    const title = window.PetLife.crossedBond(prevBond, life.bond);
    if (title) window.setTimeout(() => say(window.PetLife.BOND_LINE[title]), 900);
    if (hop.issuePlay) issue("play");
    paintHud();
    return;
  }
  if (hop.act === "idle") issue("idle");
}

function finishArrive() {
  if (window.PetArrive.arriveFinish(leaving) === "now") {
    sim.x = sim.target ?? sim.x;
    sim.target = null;
    sim.anim = "idle";
    sim.frame = 0;
    applyArrive("arrive");
    return;
  }
  const p = gaitProfile();
  const dir = sim.target != null && sim.target >= sim.x ? 1 : sim.facing;
  sim.x = sim.target ?? sim.x;
  sim.target = null;
  sim.settle = 1;
  sim.settleDir = dir;
  sim.overshoot = window.PetGait.overshootPx({ crawl: p.crawl, hop: p.hop, walk: p.walk });
  sim.land = 1;
  sim.anim = "idle";
  sim.frame = 0;
  sim.arrivedPending = true;
  sim.actWait = window.PetEthogram.afterSettleWait(trait?.wander ?? 0.45);
}

function clearAct() {
  sim.act = null;
  sim.actMotion = null;
  sim.actT = 0;
  sim.actHold = 0;
  sim.actWalk = false;
}

function startAct(act) {
  if (!act) return;
  sim.act = act.name;
  sim.actMotion = act.motion;
  sim.actT = 0;
  sim.actHold = act.hold;
  sim.target = null;
  sim.waypoints = [];
  if (act.anim) {
    sim.anim = act.anim;
    sim.frame = 0;
    sim.acc = 0;
  }
  if (act.motion === "hop") {
    sim.hop = 1;
    sim.anim = "play";
    sim.frame = 0;
    playSound("hop");
  }
  if (act.anim === "talk") playSound("chirp");
  if (act.anim === "eat") playSound("munch");
  if (act.motion === "dart" || act.motion === "circle") {
    const max = Math.max(PAD, window.innerWidth - BASE - PAD);
    const dist = act.motion === "circle" ? 36 : 44 + Math.random() * 28;
    sim.actWalk = true;
    aimAt(clamp(sim.x + sim.facing * dist, PAD, max));
  }
}

function setClickable(next) {
  if (next === clickable) return;
  clickable = next;
  window.desk?.setClickable(next);
}

function hitRects() {
  return [...document.querySelectorAll("[data-hit]")].flatMap((el) => {
    const style = getComputedStyle(el);
    if (style.pointerEvents === "none" || style.visibility === "hidden" || style.display === "none") return [];
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return [];
    return [{ x: r.x, y: r.y, width: r.width, height: r.height }];
  });
}

function reportHits() {
  if (!window.PetDesk?.hitForward(window.desk?.platform)) return;
  const now = performance.now();
  if (now - reportHits.at < 80) return;
  reportHits.at = now;
  window.desk?.setHits(hitRects());
}
reportHits.at = 0;

function liftTapPx() {
  return window.PetDesk?.tapPx(window.desk?.platform) ?? window.PetArrive.TAP_PX;
}

function switchTo(key) {
  const next = roster.find((r) => r.key === key) ?? roster[0];
  kind = { ...next, sprites: pack(next.key) };
  trait = window.PET_TRAITS[next.key] || window.PET_TRAITS.red_panda;
  try {
    localStorage.setItem(STORE_KIND, next.key);
  } catch {
    /* ignore */
  }
  life = window.PetLife.load(next.key);
  const away = Date.now() - (life.lastTick || Date.now());
  window.PetLife.decay(life, trait, Date.now(), kind.key);
  persist();
  sim.anim = "idle";
  sim.frame = 0;
  sim.target = null;
  sim.turnHold = 0;
  sim.pendingFacing = null;
  sim.waypoints = [];
  sim.pause = 0;
  sim.settle = 0;
  sim.poseHold = 0;
  sim.pendingPose = null;
  sim.arrivedPending = false;
  taken = false;
  clearAct();
  sim.actWait = 10 + Math.random() * 8;
  pet.classList.toggle("sick", !!life.sick);
  pet.classList.toggle("blue", !!(kind && window.PetLife.isBlue(life, kind.key)));
  pet.classList.toggle("hidden", !!life.hidden);
  const back = away > 24 * 60 * 1000
    ? away >= 20 * 3600000
      ? "You were gone a night. I kept the desk."
      : away >= 6 * 3600000
        ? "Hours. I sat in most of them."
        : away >= 3600000
          ? "You were elsewhere. I practiced waiting."
          : "Back. I noticed."
    : null;
  say(life.hidden ? pick(trait.extra.hide) : back || pick(next.lines.greet), 5000);
  if (!life.hidden) issue("talk");
  paintHud();
  paintMess();
  for (const frames of Object.values(kind.sprites)) {
    for (const src of frames) {
      const img = new Image();
      img.src = src;
    }
  }
  if (guestEl) guestEl.classList.remove("show");
  visit = null;
  window.clearTimeout(startVisit.timer);
  startVisit.timer = window.setTimeout(startVisit, 7500);
}

function tick(now) {
  const dt = Math.min(0.08, (now - tick.last) / 1000);
  tick.last = now;
  if (!kind || !trait) {
    requestAnimationFrame(tick);
    return;
  }
  const width = window.innerWidth;
  const maxX = Math.max(PAD, width - BASE - PAD);
  const scale = window.PetLife.sizeScale(life, trait);

  if (now > speechUntil) bubble.classList.remove("open");
  pet.classList.toggle("sick", !!life.sick);
  pet.classList.toggle("blue", !!(kind && window.PetLife.isBlue(life, kind.key)));
  pet.classList.toggle("hidden", !!life.hidden);

  if (sim.hop > 0) {
    const prev = sim.hop;
    sim.hop = Math.max(0, sim.hop - dt * 2.15);
    if (prev > 0 && sim.hop === 0) {
      sim.land = 1;
      puff(sim.x, 5);
    }
  }
  if (sim.land > 0) sim.land = Math.max(0, sim.land - dt * window.PetGait.LAND_DECAY);
  if (sim.settle > 0 && !sim.dragging) {
    sim.settle = Math.max(0, sim.settle - dt / window.PetGait.SETTLE_S);
    if (sim.settle === 0 && sim.arrivedPending) {
      sim.arrivedPending = false;
      applyArrive("arrive");
    }
  }
  sim.bob += dt * (trait.aquatic ? 2.4 : 1.2);

  if (!sim.dragging) {
    applyCommand();
    const p = gaitProfile();
    if (sim.poseHold > 0) {
      sim.poseHold = Math.max(0, sim.poseHold - dt);
      if (sim.poseHold === 0 && sim.pendingPose) {
        sim.anim = sim.pendingPose;
        sim.pendingPose = null;
        sim.frame = 0;
        sim.acc = 0;
      }
    }
    if (sim.turnHold > 0) {
      sim.turnHold = Math.max(0, sim.turnHold - dt);
      if (sim.turnHold === 0 && sim.pendingFacing) {
        sim.facing = sim.pendingFacing;
        sim.pendingFacing = null;
        sim.anim = "walk";
        sim.frame = 0;
        sim.walkAge = 0;
      }
    } else if (sim.pause > 0) {
      sim.pause = Math.max(0, sim.pause - dt);
      sim.anim = "idle";
      if (sim.pause === 0 && sim.waypoints.length) aimAt(sim.waypoints.shift());
    } else if (sim.anim === "walk" && sim.target != null && sim.turnHold <= 0) {
      const remaining = Math.abs(sim.target - sim.x);
      const dir = sim.target >= sim.x ? 1 : -1;
      sim.walkAge += dt;
      sim.x += dir * walkSpeed(remaining, sim.walkAge) * dt;
      sim.stepAcc += dt;
      const stepEvery = p.high ? window.PetGait.STEP_S_QUICK : p.crawl ? 0.32 : window.PetGait.STEP_S;
      if (sim.stepAcc > stepEvery) {
        sim.stepAcc = 0;
        playSound("step");
        if (Math.random() < 0.45) puff(sim.x, 2);
      }
      if ((dir === 1 && sim.x >= sim.target) || (dir === -1 && sim.x <= sim.target)) {
        sim.x = sim.target;
        const land = window.PetArrive.walkLand(sim.actWalk, sim.waypoints.length);
        if (land === "act") {
          sim.target = null;
          sim.actWalk = false;
          sim.anim = sim.actMotion === "circle" ? "sit" : "idle";
          sim.frame = 0;
          sim.land = 0.4;
        } else if (land === "pause") {
          sim.target = null;
          sim.pause = window.PetGait.wanderPauseS();
          sim.anim = "idle";
          sim.frame = 0;
        } else {
          finishArrive();
        }
      }
    } else if (!sim.act && (sim.anim === "idle" || sim.anim === "sit") && sim.cursorX != null && Math.abs(sim.cursorX - (sim.x + BASE / 2)) > 36) {
      sim.facing = sim.cursorX >= sim.x + BASE / 2 ? 1 : -1;
    }
    if (trait.clingy && sim.cursorX != null && !life.hidden && !life.asleep && Math.random() < dt * 0.35) {
      const follow = clamp(sim.cursorX - BASE / 2, PAD, maxX);
      if (Math.abs(follow - sim.x) > 80) {
        sim.waypoints = [];
        aimAt(follow);
      }
    }
    if (sim.act) {
      sim.actT += dt;
      if (sim.actMotion === "stretch" && sim.actHold > 0 && sim.actT / sim.actHold > 0.55 && sim.anim === "sit") {
        sim.anim = "idle";
      }
      if (sim.actT >= sim.actHold && !sim.actWalk) {
        clearAct();
        sim.anim = "idle";
        sim.frame = 0;
      }
    } else if (
      !leaving &&
      sim.target == null &&
      sim.turnHold <= 0 &&
      sim.pause <= 0 &&
      sim.settle <= 0 &&
      (sim.anim === "idle" || sim.anim === "sit") &&
      !life.hidden &&
      !life.asleep
    ) {
      sim.actWait -= dt;
      if (sim.actWait <= 0) {
        const hour = new Date().getHours();
        const night = hour < 5 || hour >= 21;
        startAct(window.PetEthogram.pickAct(kind?.key));
        sim.actWait = window.PetEthogram.nextActWait(trait?.wander ?? 0.45, !!trait?.nocturnal, night);
      }
    }
    if ((sim.anim === "idle" || sim.anim === "sit") && sim.shiftAge <= 0 && sim.actMotion !== "freeze" && Math.random() < dt * 0.45) {
      sim.shift = (1 + Math.random() * 2) * (Math.random() < 0.5 ? 1 : -1);
      sim.shiftAge = 0.85;
    }
    if (sim.shiftAge > 0) sim.shiftAge = Math.max(0, sim.shiftAge - dt);
    if (!leaving) sim.x = clamp(sim.x, PAD, maxX);

    const fps = FPS[sim.anim] * (life.sick ? 0.75 : 1);
    if (fps > 0) {
      sim.acc += dt;
      const step = 1 / fps;
      while (sim.acc >= step) {
        sim.acc -= step;
        const frames = kind.sprites[sim.anim];
        const len = frames.length;
        if (sim.anim === "sit") sim.frame = Math.min(len - 1, sim.frame + 1);
        else if (ONCE.has(sim.anim)) {
          if (sim.frame + 1 >= len) {
            sim.anim = "idle";
            sim.frame = 0;
            issue("idle");
          } else {
            sim.frame += 1;
            if (sim.anim === "eat" && sim.frame === 1) playSound("munch");
          }
        } else sim.frame = (sim.frame + 1) % len;
      }
    }
  }

  for (const d of sim.dust) {
    d.life -= dt;
    d.x += d.vx * dt;
    d.y += d.vy * dt;
    d.vy += 28 * dt;
  }
  sim.dust = sim.dust.filter((d) => d.life > 0);

  const frames = kind.sprites[sim.anim];
  const src = frames[Math.min(sim.frame, frames.length - 1)];
  if (pet.getAttribute("src") !== src) pet.src = src;

  const G = window.PetGait;
  const p = gaitProfile();
  const hopPx = sim.hop > 0 ? Math.sin(sim.hop * Math.PI) * (trait.hop || 20) : 0;
  const walkBob =
    sim.anim === "walk"
      ? p.crawl
        ? 0
        : p.perch
          ? Math.abs(Math.sin(sim.walkAge * 8)) * G.PERCH_STEP_PX
          : (trait.hop || 0) > G.HIGH_HOP
            ? Math.abs(Math.sin(sim.walkAge * 10)) * G.WALK_HOP_PX
            : 0
      : 0;
  const water = trait.aquatic ? Math.sin(sim.bob) * 6 : 0;
  const perch = trait.perch ? 18 : 0;
  const breathe =
    sim.anim === "idle" || sim.anim === "sit" || sim.anim === "sleep"
      ? 1 + Math.sin(now * (sim.anim === "sleep" ? 0.0032 : 0.0046)) * (sim.anim === "sleep" ? G.BREATHE_SLEEP : G.BREATHE_IDLE)
      : 1;
  const pose = sim.act ? window.PetEthogram.actPose(sim.actMotion, sim.actT, sim.actHold) : { dx: 0, dy: 0, rot: 0, stretch: 1, squat: 1 };
  const stretch = sim.hop > 0 ? 1 + Math.sin(sim.hop * Math.PI) * 0.09 : sim.land > 0 ? 1 - Math.sin(sim.land * Math.PI) * 0.08 : sim.act ? breathe * pose.stretch : breathe;
  const squat = sim.act && pose.squat !== 1 ? pose.squat : 2 - stretch;
  const sway = sim.anim === "walk" && p.crawl ? Math.sin(sim.walkAge * 5.5) * G.SWAY_PX : 0;
  const shiftX = sim.shiftAge > 0 ? sim.shift * Math.sin((1 - sim.shiftAge / 0.85) * Math.PI) : 0;
  const settleX = sim.settle > 0 ? G.settleOffset(sim.settle, sim.settleDir, sim.overshoot) : 0;
  const drawX = sim.x + sway + shiftX + settleX + pose.dx;
  const lift = hopPx + walkBob + water + perch + pose.dy;
  pet.style.transform = `translate3d(${drawX}px, ${-lift}px, 0) rotate(${pose.rot}deg) scale(${sim.facing * squat * scale}, ${stretch * scale})`;
  const shrink = 1 - hopPx / 90;
  shadow.style.transform = `translate3d(${drawX + 40}px, 0, 0) scale(${shrink * scale}, ${shrink})`;
  shadow.style.opacity = String((0.28 - hopPx / 90) * (life.hidden ? 0.2 : 1));
  const bx = clamp(drawX + BASE * 0.5 - 110, 10, Math.max(10, width - 230));
  bubble.style.transform = `translate3d(${bx}px, ${-lift - 10}px, 0)`;
  hud.style.transform = `translate3d(${clamp(drawX + 4, 8, width - 180)}px, ${-lift}px, 0)`;
  if (tongueEl) {
    const flick = p.crawl && sim.actMotion === "tongue" ? window.PetEthogram.tongueFlick(sim.actT, sim.actHold) : 0;
    tongueEl.style.opacity = String(flick);
    tongueEl.style.transform = `translate3d(${drawX + BASE * 0.5 + sim.facing * 36 - 2}px, ${-(lift + 48)}px, 0) scale(${sim.facing}, 1)`;
  }

  const nodes = dustRoot.children;
  for (let i = 0; i < nodes.length; i++) {
    const el = nodes[i];
    const d = sim.dust[i];
    if (!d) {
      el.style.opacity = "0";
      continue;
    }
    el.style.opacity = String(Math.max(0, d.life * 1.4));
    el.style.width = `${d.size}px`;
    el.style.height = `${d.size}px`;
    el.style.transform = `translate3d(${d.x}px, ${d.y}px, 0)`;
  }

  tickVisit(dt, now, width);
  reportHits();

  requestAnimationFrame(tick);
}
tick.last = performance.now();

const VISIT_LINE = {
  red_panda: "I came for the ribbon. I'll put it back. Maybe.",
  cat: "I inspected the blotter. It will do.",
  dog: "I brought the whole tail. Then I took it home.",
  rabbit: "A short visit. The greens here are theoretical.",
  hamster: "I mapped the crumbs. Officially.",
  guinea_pig: "Wheek. That is the entire review.",
  turtle: "I arrived. I will leave in due course.",
  goldfish: "I drifted through. That counts.",
  budgie: "A note: your house is loud. I approve.",
  fox: "I found this desk first. Then I left it.",
  penguin: "A pebble of a visit.",
  parrot: "I came to quote the furniture.",
  ferret: "I borrowed a dongle. I'll return a better one.",
  hedgehog: "A quiet walk-through.",
  chinchilla: "The dust here is a scandal. I took a sample.",
  axolotl: "I grew a little more present. Then less.",
  toucan: "The bill approves of this blotter.",
  iguana: "I blinked at your lamp. Then I left.",
  dragon: "A courtesy inspection of the hoard.",
  phoenix: "I warmed the corner. You're welcome.",
  ball_python: "I came as a bun. I will leave as a bun.",
  corn_snake: "I threaded through. Your gap is fine.",
  kingsnake: "I inspected. You may keep the desk.",
  green_tree_python: "I hung on your lamp. Briefly.",
  hognose: "I died on your blotter. I got over it.",
  garter: "I patrolled. The moss is adequate.",
  boa: "I held the edge. Then I let go.",
  milk_snake: "I was a rumor. Then I was lunch-minded.",
  rosy_boa: "I borrowed the warm corner. I left it pink.",
  carpet_python: "I charted your shelf. You may land.",
  octopus: "I tasted the rim. Then I was a cup again.",
  cuttlefish: "I flushed. Then I left the weather.",
  nautilus: "I rose through. The house can wait.",
  moon_jelly: "I pulsed through. That counts.",
  sea_star: "I clung. Then I unclung. Slowly.",
  hermit_crab: "I measured the lids. None were free.",
  horseshoe_crab: "I walked the sand. I am not a crab.",
  seahorse: "I hitched your pencil. Briefly.",
  manta: "I soared the bowl. You may keep the sky.",
  moray: "I was the door. Then I was gone.",
  moss: "I carpeted. Then I was the page again.",
  maidenhair: "I unfurled. Then I folded.",
  ginkgo: "I golded. Then I left the autumn.",
  oak: "I dropped one. Then I was small again.",
  water_lily: "I opened. Then I closed.",
  orchid: "I bloomed. Then I was bark again.",
  saguaro: "I stored a visit. Then I sat.",
  venus_flytrap: "I did not snap. Then I left the cup.",
  pitcher: "I kept the well. Then I left the rain.",
  sundew: "I glittered. Then I uncurled.",
  honeybee: "I danced. Then I left the map.",
  monarch: "I kept the orange. Then I left the cup.",
  luna: "I drifted. I did not eat.",
  firefly: "I flashed. Then I left the grammar.",
  darner: "I hawed. Then I was air again.",
  stick: "I froze. Then I was a pencil again.",
  carpenter_ant: "I laid a road. Then I left the grain.",
  ladybird: "I counted. Then I left the seven.",
  mantis: "I folded. Then I left the stem.",
  cicada: "I sat. Then I left the years.",
  oyster: "I fruited. Then I left the wood.",
  fly_agaric: "I warned. Then I left the cup.",
  morel: "I sat hollow. Then I left the mold.",
  chanterelle: "I forked. Then I left the rim.",
  turkey_tail: "I zoned. Then I left the grain.",
  lions_mane: "I hung teeth. Then I left the wound.",
  puffball: "I puffed. Then I left the cloud.",
  chicken_of_woods: "I shelved. Then I left the oak.",
  yeast: "I rose. Then I left the crock.",
  lichen: "We sat. Then we left the share.",
  photovore: "I drank. Then I left the glass.",
  choir: "I sounded. Then I left the air.",
  nimbus: "I floated. Then I left the bowl.",
  silica: "I faceted. Then I left the stone.",
  terminator: "I kept the rim. Then I left the belt.",
  nexus: "We counted. Then we left the name.",
  halovore: "I frosted. Then I left the dish.",
  magneton: "I aligned. Then I left the line.",
  umbral: "I dimmed. Then I left the cool.",
  cyst: "I waited. Then I left the seal.",
  frog: "I jumped. Then I left the bank.",
  toad: "I hopped. Then I left the leaf.",
  newt: "I kept the orange. Then I left the moss.",
  salamander: "I hid. Then I left the mold.",
  caecilian: "I slipped. Then I left the silt.",
  crayfish: "I pinched. Then I left the pebble.",
  pond_snail: "I rasped. Then I left the rim.",
  mussel: "I filtered. Then I left the silt.",
  leech: "I latched. Then I left the damp.",
  stickleback: "I flared. Then I left the nest.",
  paramecium: "I rowed. Then I left the drop.",
  amoeba: "I reached. Then I left the film.",
  euglena: "I drank. Then I left the red.",
  volvox: "We rolled. Then we left the bowl.",
  diatom: "I glided. Then I left the pane.",
  kelp: "I held. Then I left the cold.",
  chlamydomonas: "I spun. Then I left the plate.",
  stentor: "I opened. Then I left the horn.",
  coli: "I tumbled. Then I left the broth.",
  haloarchaea: "I blushed. Then I left the pan.",
  crow: "I cawed. Then I left the ledge.",
  raven: "I croaked. Then I left the rafter.",
  barn_owl: "I hissed. Then I left the beam.",
  red_tail: "I soared. Then I left the post.",
  chickadee: "I deeed. Then I left the cup.",
  robin: "I hopped. Then I left the rim.",
  mallard: "I dabbled. Then I left the dish.",
  canada_goose: "I honked. Then I left the green.",
  pileated: "I drummed. Then I left the post.",
  hummingbird: "I hovered. Then I left the cup.",
  orb_weaver: "I sat. Then I left the web.",
  jumping_spider: "I leapt. Then I left the edge.",
  wolf_spider: "I prowled. Then I left the litter.",
  tarantula: "I sat. Then I left the silk.",
  widow: "I hung. Then I left the corner.",
  harvestman: "I walked. Then I left the stem.",
  scorpion: "I raised. Then I left the bark.",
  vinegaroon: "I whipped. Then I left the sand.",
  tick: "I clasped. Then I left the hem.",
  solifuge: "I ran. Then I left the dish.",
  deer: "I flagged. Then I left the edge.",
  bat: "I hung. Then I left the fold.",
  squirrel: "I hid a thought. Then I left the dish.",
  otter: "I slid. Then I left the dish.",
  raccoon: "I washed. Then I left the bowl.",
  skunk: "I stamped. Then I left the duff.",
  opossum: "I went still. Then I left the hem.",
  beaver: "I gnawed. Then I left the lodge.",
  porcupine: "I bristled. Then I left the post.",
  black_bear: "I foraged. Then I left the denside.",
  gecko: "I climbed. Then I left the plaster.",
  anole: "I flashed. Then I left the post.",
  skink: "I dashed. Then I left the crack.",
  chameleon: "I shifted. Then I left the perch.",
  horned_lizard: "I sat the crown. Then I left the sand.",
  alligator: "I sat the bank. Then I left the dish.",
  crocodile: "I showed. Then I left the dish.",
  snapper: "I snapped. Then I left the mud.",
  box_turtle: "I shut. Then I left the leaf.",
  tuatara: "I kept still. Then I left the burrow.",
  bass: "I lunged. Then I left the edge.",
  brook_trout: "I rose. Then I left the riffle.",
  catfish: "I whisked. Then I left the mud.",
  bluegill: "I flared. Then I left the shade.",
  perch: "I kept the bars. Then I left the rail.",
  pike: "I waited. Then I left the reed.",
  walleye: "I hunted dusk. Then I left the run.",
  paddlefish: "I filtered. Then I left the current.",
  lamprey: "I sat the disk. Then I left the stone.",
  american_eel: "I swam. Then I left the hole.",
  house_centipede: "I hunted. Then I left the crack.",
  millipede: "I oiled. Then I left the log.",
  pillbug: "I rolled. Then I left the bark.",
  earthworm: "I cast. Then I left the soil.",
  velvet_worm: "I jetted. Then I left the wood.",
  springtail: "I hopped. Then I left the duff.",
  tardigrade: "I sat the moss. Then I left the film.",
  planarian: "I split. Then I left the film.",
  nematode: "I thrashed. Then I left the film.",
  amphipod: "I swam on my side. Then I left the pool.",
  bumblebee: "I thrummed. Then I left the cup.",
  carpenter_bee: "I bored. Then I left the hole.",
  mason_bee: "I sealed. Then I left the stone.",
  leafcutter: "I cut. Then I left the disc.",
  stingless: "I potted. Then I left the wax.",
  sweat_bee: "I shone. Then I left the rim.",
  mining_bee: "I dug. Then I left the bank.",
  honey_drone: "I hummed. Then I left the dish.",
  honey_queen: "I stayed. Then I left the line.",
  honeycomb: "I sat. Then the line went quieter.",
  fiddler_crab: "I waved. Then I left the marsh.",
  ghost_crab: "I ran. Then I left the sand.",
  limpet: "I clamped. Then I left the rim.",
  barnacle: "I sat the stone. Then I left the rim.",
  chiton: "I plated. Then I left the rock.",
  periwinkle: "I rasped. Then I left the face.",
  sand_dollar: "I sat the sand. Then I left the plate.",
  sea_urchin: "I sat the spines. Then I left the pool.",
  knobbed_whelk: "I hunted. Then I left the wrack.",
  lugworm: "I heaped. Then I left the sand.",
  field_cricket: "I sang. Then I left the grass.",
  katydid: "I sat the leaf. Then I left the rim.",
  grasshopper: "I vaulted. Then I left the grass.",
  swallowtail: "I kept the yellow. Then I left the blossom.",
  jewelwing: "I kept the black. Then I left the stream.",
  lacewing: "I laced. Then I left the leaf.",
  earwig: "I raised the cerci. Then I left the bark.",
  acorn_weevil: "I sat the acorn. Then I left the cup.",
  click_beetle: "I clicked. Then I left the bark.",
  robber_fly: "I hunted. Then I left the perch.",
  sloth: "I hung. Then I left the bough.",
  lemur: "I sat the sun. Then I left the troop.",
  gibbon: "I sang. Then I left the swing.",
  kinkajou: "I wrapped. Then I left the nectar.",
  colugo: "I sailed. Then I left the trunk.",
  flying_squirrel: "I glided. Then I left the oak.",
  howler: "I howled. Then I left the crown.",
  tarsier: "I looked. Then I left the branch.",
  potto: "I kept still. Then I left the vine.",
  koala: "I chewed. Then I left the gum.",
  brain_coral: "I sat the rock. Then I left the boulder.",
  anemone: "I opened. Then I left the column.",
  clownfish: "I sat the wreath. Then I left the cup.",
  parrotfish: "I rasped. Then I left the plate.",
  cleaner_shrimp: "I waited. Then I left the station.",
  sea_cucumber: "I sat the sand. Then I left the well.",
  lionfish: "I veiled. Then I left the ledge.",
  giant_clam: "I opened. Then I left the mantle.",
  eagle_ray: "I soared. Then I left the sky.",
  grouper: "I sat the hole. Then I left the dish.",
};

let visit = null;

function pickVisitorKind() {
  if (!roster.length || !kind) return null;
  const n = new Date();
  const day = Math.floor(Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()) / 86400000);
  const others = roster.filter((r) => r.key !== kind.key);
  return others[Math.abs(day + kind.key.length) % others.length] ?? null;
}

function startVisit() {
  const g = pickVisitorKind();
  if (!g || !guestEl) return;
  const sprites = pack(g.key);
  visit = {
    key: g.key,
    name: g.name,
    sprites,
    x: window.innerWidth + 10,
    target: Math.max(80, window.innerWidth * 0.52),
    facing: -1,
    frame: 0,
    acc: 0,
    born: performance.now(),
    said: false,
  };
  guestEl.classList.add("show");
  guestEl.src = sprites.walk[0];
}

function tickVisit(dt, now, width) {
  if (!visit || !guestEl) return;
  const age = now - visit.born;
  if (age > 18000) {
    guestEl.classList.remove("show");
    visit = null;
    return;
  }
  if (age > 13500) visit.target = -140;
  const remaining = Math.abs(visit.target - visit.x);
  if (remaining > 2) {
    visit.facing = visit.target >= visit.x ? 1 : -1;
    visit.x += visit.facing * 86 * dt;
    visit.acc += dt;
    if (visit.acc > 1 / 6.4) {
      visit.acc = 0;
      visit.frame = (visit.frame + 1) % visit.sprites.walk.length;
    }
    guestEl.src = visit.sprites.walk[visit.frame];
  } else if (!visit.said && age > 2200) {
    visit.said = true;
    say(VISIT_LINE[visit.key] || "I came. I left.");
    guestEl.src = visit.sprites.idle[0];
  }
  guestEl.style.transform = `translate3d(${visit.x}px, 0, 0) scale(${visit.facing}, 1)`;
}

pet.addEventListener("pointerdown", (e) => {
  if (e.button === 2) return;
  if (window.PetDesk?.carePointer(e)) return;
  sim.dragging = true;
  sim.pointerStart = { x: e.clientX, y: e.clientY };
  sim.dragDx = e.clientX - sim.x;
  pet.setPointerCapture(e.pointerId);
  setClickable(true);
});
window.addEventListener("pointermove", (e) => {
  sim.cursorX = e.clientX;
  const over = e.target && e.target.closest && e.target.closest("[data-hit]");
  setClickable(!!over || sim.dragging);
  if (!sim.dragging) return;
  const maxX = Math.max(PAD, window.innerWidth - BASE - PAD);
  sim.x = clamp(e.clientX - sim.dragDx, PAD, maxX);
  if (sim.pointerStart && Math.abs(e.clientX - sim.pointerStart.x) > 10) {
    sim.facing = e.clientX >= sim.pointerStart.x ? 1 : -1;
  }
});
window.addEventListener("pointerup", (e) => {
  if (!sim.dragging) return;
  const start = sim.pointerStart;
  sim.dragging = false;
  sim.pointerStart = null;
  const dx = start ? e.clientX - start.x : 0;
  const dy = start ? e.clientY - start.y : 0;
  const lift = window.PetArrive.pointerUp(dx, dy, liftTapPx());
  if (lift.kind === "tap") {
    handle("talk");
    return;
  }
  sim.land = 0.55;
  puff(sim.x, 3);
  sim.arrivedPending = false;
  sim.settle = 0;
  if (window.PetArrive.afterPlace(sim.target != null) === "resume" && sim.target != null) {
    aimAt(sim.target);
  } else {
    sim.anim = "idle";
  }
});
window.addEventListener("pointercancel", () => {
  sim.dragging = false;
  sim.pointerStart = null;
});
pet.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  window.desk?.openMenu(e.clientX, e.clientY);
});
lureEl.addEventListener("click", (e) => {
  e.stopPropagation();
  if (!mark || mark.kind !== "lure" || !life || !trait || !kind) return;
  const hop = window.PetPlay.playHop(chaseOf(), "catch");
  if (hop.act !== "play") return;
  taken = hop.next.taken;
  clearMark();
  const result = window.PetLife.act(life, trait, "play", Date.now(), kind.key);
  persist();
  say("You caught it first. I still win.");
  if (hop.issuePlay) issue("play");
  paintHud();
});
window.addEventListener("resize", () => {
  sim.x = clamp(sim.x, PAD, Math.max(PAD, window.innerWidth - BASE - PAD));
  paintMess();
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) persist();
  else tickLife();
});

window.desk?.onCommand((cmd) => handle(cmd));
window.desk?.onSwitch((key) => switchTo(key));

setInterval(() => {
  if (document.hidden || !kind || !life) return;
  tickLife();
  if (performance.now() < speechUntil || life.hidden) return;
  if (life.asleep) {
    issue("sleep");
    return;
  }
  const sky = skyOf();
  if (sky === "rain" && Math.random() < 0.4 && !["goldfish", "axolotl", "penguin"].includes(kind.key)) {
    issue("sit");
    return;
  }
  if (sky === "heat" && Math.random() < 0.35 && ["iguana", "turtle", "cat", "dragon"].includes(kind.key)) {
    issue("sit");
    return;
  }
  const roll = Math.random();
  if (roll < (trait?.wander ?? 0.45)) issue("wander");
  else if (roll < 0.7) issue(life.energy < 35 ? "sleep" : "sit");
  else if (roll < 0.84) issue("idle");
  else if (roll < 0.92 && trait?.special) handle("special");
  else {
    say(lineFrom({ useRoster: "ambient" }));
    issue("talk");
  }
}, 5600);
setInterval(() => {
  if (kind) tickLife();
}, 20_000);

fetch("roster.json")
  .then((r) => r.json())
  .then((data) => {
    roster = data;
    let start = "red_panda";
    try {
      start = localStorage.getItem(STORE_KIND) || start;
    } catch {
      /* ignore */
    }
    switchTo(start);
    paintWeather();
    requestAnimationFrame(tick);
  })
  .catch(() => {
    say("The house could not find the roster.");
  });
