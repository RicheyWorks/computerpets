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
const shadow = document.getElementById("shadow");
const bubble = document.getElementById("bubble");
const bubbleText = document.getElementById("bubble-text");
const dustRoot = document.getElementById("dust");
const messRoot = document.getElementById("mess");
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
};

let speechUntil = 0;
let clickable = false;
let hudUntil = 0;
let mark = null;
let leaving = false;
let lureTimer = 0;

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
  hudVital.textContent = window.PetLife.vitals(life);
  barHunger.style.setProperty("--w", `${life.hunger}%`);
  barMood.style.setProperty("--w", `${life.mood}%`);
  barEnergy.style.setProperty("--w", `${life.energy}%`);
  barHygiene.style.setProperty("--w", `${life.hygiene}%`);
  hud.classList.toggle("show", performance.now() < hudUntil || life.sick || life.hidden);
  window.desk?.vitals({
    key: kind.key,
    name: kind.name,
    vital: window.PetLife.vitals(life),
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
  const { grew } = window.PetLife.decay(life, trait);
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

function placeMark(kind, x, hops = 0) {
  mark = { kind, x, hops };
  const el = kind === "treat" ? treatEl : lureEl;
  const other = kind === "treat" ? lureEl : treatEl;
  other.classList.remove("show");
  el.classList.add("show");
  el.style.transform = `translate3d(${x}px, 0, 0)`;
  window.clearTimeout(lureTimer);
  if (kind === "lure" && hops === 0) {
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
  if (life?.asleep && sim.cmd !== "talk" && sim.cmd !== "play" && sim.cmd !== "eat") {
    sim.anim = "sleep";
    sim.target = null;
    return;
  }
  if (sim.order === sim.lastOrder || sim.cmd === "none") return;
  sim.lastOrder = sim.order;
  const width = window.innerWidth;
  const max = Math.max(PAD, width - BASE - PAD);
  if (sim.cmd === "wander") {
    if (trait.wander < 0.1 && Math.random() > trait.wander * 8) {
      sim.anim = "sit";
      sim.target = null;
      return;
    }
    let next = PAD + Math.random() * Math.max(48, max - PAD);
    if (trait.clingy && sim.cursorX != null) next = clamp(sim.cursorX - BASE / 2, PAD, max);
    if (Math.abs(next - sim.x) < 50) next = clamp(sim.x + sim.facing * 120, PAD, max);
    sim.target = next;
    sim.facing = sim.target >= sim.x ? 1 : -1;
    sim.anim = "walk";
    sim.frame = 0;
    sim.walkAge = 0;
    return;
  }
  if (sim.cmd === "seek" && mark) {
    leaving = false;
    sim.target = clamp(mark.x - BASE * 0.4, PAD, max);
    sim.facing = sim.target >= sim.x ? 1 : -1;
    sim.anim = "walk";
    sim.frame = 0;
    sim.walkAge = 0;
    return;
  }
  if (sim.cmd === "leave") {
    leaving = true;
    sim.target = sim.x + BASE / 2 < width / 2 ? -BASE - 24 : width + 12;
    sim.facing = sim.target >= sim.x ? 1 : -1;
    sim.anim = "walk";
    sim.frame = 0;
    sim.walkAge = 0;
    return;
  }
  if (sim.cmd === "enter") {
    leaving = false;
    sim.x = Math.random() < 0.5 ? -BASE : max + BASE;
    sim.target = clamp(80 + Math.random() * Math.max(40, max - 80), PAD, max);
    sim.facing = sim.target >= sim.x ? 1 : -1;
    sim.anim = "walk";
    sim.frame = 0;
    sim.walkAge = 0;
    return;
  }
  if (sim.cmd === "play") {
    sim.hop = 1;
    sim.anim = "play";
    sim.target = null;
    sim.frame = 0;
    sim.acc = 0;
    playSound("hop");
    return;
  }
  if (["eat", "talk", "idle", "sit", "sleep"].includes(sim.cmd)) {
    sim.anim = sim.cmd;
    sim.target = null;
    sim.frame = 0;
    sim.acc = 0;
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
  if (cmd === "snack") {
    if (life.hidden) return;
    const width = window.innerWidth;
    placeMark("treat", 80 + Math.random() * Math.max(80, width - 200));
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
  const result = window.PetLife.act(life, trait, cmd);
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

function walkSpeed(remaining, age) {
  const base = trait?.walk ?? 98;
  const accel = Math.min(1, age / 0.28);
  const decel = remaining < 56 ? remaining / 56 : 1;
  const startled = life && Date.now() < life.startledUntil ? 1.55 : 1;
  return base * Math.max(0.3, accel * decel) * startled;
}

function setClickable(next) {
  if (next === clickable) return;
  clickable = next;
  window.desk?.setClickable(next);
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
  window.PetLife.decay(life, trait);
  persist();
  sim.anim = "idle";
  sim.frame = 0;
  sim.target = null;
  pet.classList.toggle("sick", !!life.sick);
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
  pet.classList.toggle("hidden", !!life.hidden);

  if (sim.hop > 0) {
    const prev = sim.hop;
    sim.hop = Math.max(0, sim.hop - dt * 2.15);
    if (prev > 0 && sim.hop === 0) {
      sim.land = 1;
      puff(sim.x, 5);
    }
  }
  if (sim.land > 0) sim.land = Math.max(0, sim.land - dt * 3.4);
  sim.bob += dt * (trait.aquatic ? 2.4 : 1.2);

  if (!sim.dragging) {
    applyCommand();
    if (sim.anim === "walk" && sim.target != null) {
      const remaining = Math.abs(sim.target - sim.x);
      const dir = sim.target >= sim.x ? 1 : -1;
      sim.facing = dir;
      sim.walkAge += dt;
      sim.x += dir * walkSpeed(remaining, sim.walkAge) * dt;
      sim.stepAcc += dt;
      if (sim.stepAcc > 0.22) {
        sim.stepAcc = 0;
        playSound("step");
        if (Math.random() < 0.45) puff(sim.x, 2);
      }
      if ((dir === 1 && sim.x >= sim.target) || (dir === -1 && sim.x <= sim.target)) {
        sim.x = sim.target;
        sim.target = null;
        if (sim.cmd === "leave") {
          life.hidden = true;
          persist();
          leaving = false;
          issue("idle");
          paintHud();
        } else if (sim.cmd === "seek" && mark) {
          const kindMark = mark.kind;
          clearMark();
          if (kindMark === "treat") {
            const prevBond = life.bond;
            const result = window.PetLife.act(life, trait, "snack");
            persist();
            say(lineFrom(result) || "A small treaty.");
            const title = window.PetLife.crossedBond(prevBond, life.bond);
            if (title) window.setTimeout(() => say(window.PetLife.BOND_LINE[title]), 900);
            issue("eat");
          } else {
            const prevBond = life.bond;
            const result = window.PetLife.act(life, trait, "play");
            persist();
            say(lineFrom(result) || pick(kind.lines.play));
            const title = window.PetLife.crossedBond(prevBond, life.bond);
            if (title) window.setTimeout(() => say(window.PetLife.BOND_LINE[title]), 900);
            issue("play");
          }
          paintHud();
        } else {
          sim.anim = "idle";
          sim.frame = 0;
          sim.land = 0.7;
          issue("idle");
        }
      }
    } else if ((sim.anim === "idle" || sim.anim === "sit") && sim.cursorX != null && Math.abs(sim.cursorX - (sim.x + BASE / 2)) > 36) {
      sim.facing = sim.cursorX >= sim.x + BASE / 2 ? 1 : -1;
    }
    if (trait.clingy && sim.cursorX != null && !life.hidden && !life.asleep && Math.random() < dt * 0.35) {
      const follow = clamp(sim.cursorX - BASE / 2, PAD, maxX);
      if (Math.abs(follow - sim.x) > 80) {
        sim.target = follow;
        sim.anim = "walk";
      }
    }
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

  const hopPx = sim.hop > 0 ? Math.sin(sim.hop * Math.PI) * (trait.hop || 20) : 0;
  const water = trait.aquatic ? Math.sin(sim.bob) * 6 : 0;
  const perch = trait.perch ? 18 : 0;
  const breathe =
    sim.anim === "idle" || sim.anim === "sit" || sim.anim === "sleep"
      ? 1 + Math.sin(now * (sim.anim === "sleep" ? 0.0032 : 0.0046)) * (sim.anim === "sleep" ? 0.03 : 0.016)
      : 1;
  const stretch = sim.hop > 0 ? 1 + Math.sin(sim.hop * Math.PI) * 0.09 : sim.land > 0 ? 1 - Math.sin(sim.land * Math.PI) * 0.08 : breathe;
  const squat = 2 - stretch;
  pet.style.transform = `translate3d(${sim.x}px, ${-hopPx - water - perch}px, 0) scale(${sim.facing * squat * scale}, ${stretch * scale})`;
  const shrink = 1 - hopPx / 90;
  shadow.style.transform = `translate3d(${sim.x + 40}px, 0, 0) scale(${shrink * scale}, ${shrink})`;
  shadow.style.opacity = String((0.28 - hopPx / 90) * (life.hidden ? 0.2 : 1));
  const bx = clamp(sim.x + BASE * 0.5 - 110, 10, Math.max(10, width - 230));
  bubble.style.transform = `translate3d(${bx}px, ${-hopPx - water - perch - 10}px, 0)`;
  hud.style.transform = `translate3d(${clamp(sim.x + 4, 8, width - 180)}px, ${-hopPx - water - perch}px, 0)`;

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

  requestAnimationFrame(tick);
}
tick.last = performance.now();

pet.addEventListener("pointerdown", (e) => {
  if (e.button === 2) return;
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
  if (start && Math.hypot(e.clientX - start.x, e.clientY - start.y) < 8) handle("talk");
  else {
    sim.anim = "idle";
    sim.land = 0.55;
    puff(sim.x, 3);
    issue("idle");
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
  clearMark();
  const result = window.PetLife.act(life, trait, "play");
  persist();
  say("You caught it first. I still win.");
  issue("play");
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
    requestAnimationFrame(tick);
  })
  .catch(() => {
    say("The house could not find the roster.");
  });
