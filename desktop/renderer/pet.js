const SPRITES = {
  idle: ["sprites/red_panda/idle/1.png", "sprites/red_panda/idle/2.png", "sprites/red_panda/idle/3.png", "sprites/red_panda/idle/4.png"],
  walk: [
    "sprites/red_panda/walk/1.png",
    "sprites/red_panda/walk/2.png",
    "sprites/red_panda/walk/3.png",
    "sprites/red_panda/walk/4.png",
    "sprites/red_panda/walk/5.png",
    "sprites/red_panda/walk/6.png",
  ],
  sit: ["sprites/red_panda/sit/1.png", "sprites/red_panda/sit/2.png"],
  sleep: [
    "sprites/red_panda/sleep/1.png",
    "sprites/red_panda/sleep/2.png",
    "sprites/red_panda/sleep/3.png",
    "sprites/red_panda/sleep/4.png",
  ],
  talk: ["sprites/red_panda/talk/1.png", "sprites/red_panda/talk/2.png", "sprites/red_panda/talk/3.png", "sprites/red_panda/talk/4.png"],
  eat: ["sprites/red_panda/eat/1.png", "sprites/red_panda/eat/2.png", "sprites/red_panda/eat/3.png", "sprites/red_panda/eat/4.png"],
  play: ["sprites/red_panda/play/1.png", "sprites/red_panda/play/2.png", "sprites/red_panda/play/3.png", "sprites/red_panda/play/4.png"],
};

const FPS = { idle: 3.2, walk: 7.5, sit: 2.4, sleep: 2, talk: 5.5, eat: 4.4, play: 7.2 };
const ONCE = new Set(["eat", "play"]);
const SPRITE = 176;
const PAD = 16;
const WALK_SPEED = 98;
const STORE = "computerpets.desktop.rui.v1";

const LINES = {
  ambient: [
    "There is a beetle. No — it is your cursor.",
    "I put a ribbon somewhere safer. You will find it.",
    "If you turn a page, I will count the rustle.",
    "Do not startle. I am being extremely still.",
    "Your hand is a weather system. I am tracking it.",
    "I climbed the taskbar. The view is smug.",
    "This window has no blotter. I forgive it.",
  ],
  greet: [
    "You came back. The desk was almost lonely.",
    "I saved you a corner of the screen.",
    "Hello. I have been practicing sitting.",
  ],
  feed: ["Bamboo-adjacent. I accept this treaty.", "One more bite. For science.", "Warm. I will remember this kindness."],
  play: ["Catch the ribbon. I invented this game.", "I win. The rules are private.", "Again. The desktop is a very fine arena."],
  rest: ["I will just close one eye.", "Wake me if the lamp goes out.", "The tail is a pillow. This is known."],
  hungry: ["The icons are not edible. I checked.", "A small snack would improve my philosophy."],
  tired: ["My paws have opinions about walking.", "A sit. Then perhaps a second sit."],
  listen: ["I am listening. Use small words. Or large ones.", "Say that again, closer to my ear tufts."],
};

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
for (let i = 0; i < 12; i++) dustRoot.appendChild(document.createElement("span"));

for (const frames of Object.values(SPRITES)) {
  for (const src of frames) {
    const img = new Image();
    img.src = src;
  }
}

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
};

let stats = { hunger: 76, mood: 72, energy: 80, lastTick: Date.now() };
try {
  const raw = localStorage.getItem(STORE);
  if (raw) stats = { ...stats, ...JSON.parse(raw) };
} catch {
  /* ignore */
}

let speechUntil = 0;
let clickable = false;

function save() {
  try {
    localStorage.setItem(STORE, JSON.stringify({ ...stats, lastTick: Date.now() }));
  } catch {
    /* ignore */
  }
}

function decay() {
  const now = Date.now();
  const dt = Math.max(0, now - (stats.lastTick || now));
  stats.hunger = clamp(Math.round(stats.hunger - dt * (100 / (8 * 60 * 60 * 1000))), 0, 100);
  stats.mood = clamp(Math.round(stats.mood - dt * (100 / (12 * 60 * 60 * 1000))), 0, 100);
  stats.energy = clamp(Math.round(stats.energy - dt * (100 / (10 * 60 * 60 * 1000))), 0, 100);
  stats.lastTick = now;
  save();
}

function say(text, hold = 4200) {
  bubbleText.textContent = text;
  bubble.classList.add("open");
  speechUntil = performance.now() + hold;
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.92;
    u.pitch = 1.15;
    window.speechSynthesis.speak(u);
  }
}

function issue(cmd) {
  sim.order += 1;
  sim.cmd = cmd;
}

function ambientLine() {
  if (stats.hunger < 28) return pick(LINES.hungry);
  if (stats.energy < 28) return pick(LINES.tired);
  return pick(LINES.ambient);
}

function playSound(kind) {
  try {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return;
    const ac = playSound.ctx || (playSound.ctx = new Ctor());
    void ac.resume();
    const now = ac.currentTime;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    const filter = ac.createBiquadFilter();
    filter.type = "lowpass";
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ac.destination);
    const j = 0.92 + Math.random() * 0.16;
    let end = now + 0.1;
    if (kind === "step") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(140 * j, now);
      filter.frequency.setValueAtTime(420, now);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      end = now + 0.08;
    } else if (kind === "hop") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(320 * j, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.16);
      filter.frequency.setValueAtTime(900, now);
      gain.gain.setValueAtTime(0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      end = now + 0.2;
    } else if (kind === "munch") {
      osc.type = "square";
      osc.frequency.setValueAtTime(90 * j, now);
      filter.frequency.setValueAtTime(280, now);
      gain.gain.setValueAtTime(0.028, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      end = now + 0.1;
    } else {
      osc.type = "sine";
      osc.frequency.setValueAtTime(520 * j, now);
      osc.frequency.exponentialRampToValueAtTime(380, now + 0.12);
      filter.frequency.setValueAtTime(1400, now);
      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      end = now + 0.15;
    }
    osc.start(now);
    osc.stop(end);
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

function applyCommand() {
  if (sim.dragging) return;
  if (sim.order === sim.lastOrder || sim.cmd === "none") return;
  sim.lastOrder = sim.order;
  const width = window.innerWidth;
  const max = Math.max(PAD, width - SPRITE - PAD);
  if (sim.cmd === "wander") {
    let next = PAD + Math.random() * Math.max(48, max - PAD);
    if (Math.abs(next - sim.x) < 50) next = clamp(sim.x + sim.facing * 120, PAD, max);
    sim.target = next;
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
  if (sim.cmd === "eat" || sim.cmd === "talk" || sim.cmd === "idle" || sim.cmd === "sit" || sim.cmd === "sleep") {
    sim.anim = sim.cmd;
    sim.target = null;
    sim.frame = 0;
    sim.acc = 0;
    if (sim.cmd === "eat") playSound("munch");
    if (sim.cmd === "talk") playSound("chirp");
  }
}

function handle(cmd) {
  decay();
  if (cmd === "feed") {
    stats.hunger = clamp(stats.hunger + 28, 0, 100);
    stats.mood = clamp(stats.mood + 6, 0, 100);
    stats.energy = clamp(stats.energy - 6, 0, 100);
    save();
    say(pick(LINES.feed));
    issue("eat");
    return;
  }
  if (cmd === "play") {
    stats.hunger = clamp(stats.hunger - 8, 0, 100);
    stats.mood = clamp(stats.mood + 26, 0, 100);
    stats.energy = clamp(stats.energy - 14, 0, 100);
    save();
    say(pick(LINES.play));
    issue("play");
    return;
  }
  if (cmd === "rest") {
    stats.hunger = clamp(stats.hunger - 4, 0, 100);
    stats.mood = clamp(stats.mood + 4, 0, 100);
    stats.energy = clamp(stats.energy + 34, 0, 100);
    save();
    say(pick(LINES.rest));
    issue("sleep");
    return;
  }
  if (cmd === "talk") {
    say(ambientLine());
    issue("talk");
  }
}

function walkSpeed(remaining, age) {
  const accel = Math.min(1, age / 0.28);
  const decel = remaining < 56 ? remaining / 56 : 1;
  return WALK_SPEED * Math.max(0.3, accel * decel);
}

function setClickable(next) {
  if (next === clickable) return;
  clickable = next;
  window.desk?.setClickable(next);
}

let last = performance.now();
function tick(now) {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  const width = window.innerWidth;
  const maxX = Math.max(PAD, width - SPRITE - PAD);

  if (now > speechUntil) bubble.classList.remove("open");

  if (sim.hop > 0) {
    const prev = sim.hop;
    sim.hop = Math.max(0, sim.hop - dt * 2.15);
    if (prev > 0 && sim.hop === 0) {
      sim.land = 1;
      puff(sim.x, 5);
    }
  }
  if (sim.land > 0) sim.land = Math.max(0, sim.land - dt * 3.4);

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
        sim.anim = "idle";
        sim.frame = 0;
        sim.land = 0.7;
        issue("idle");
      }
    } else if ((sim.anim === "idle" || sim.anim === "sit") && sim.cursorX != null && Math.abs(sim.cursorX - (sim.x + SPRITE / 2)) > 36) {
      sim.facing = sim.cursorX >= sim.x + SPRITE / 2 ? 1 : -1;
    }
    sim.x = clamp(sim.x, PAD, maxX);

    const fps = FPS[sim.anim];
    if (fps > 0) {
      sim.acc += dt;
      const step = 1 / fps;
      while (sim.acc >= step) {
        sim.acc -= step;
        const frames = SPRITES[sim.anim];
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

  const frames = SPRITES[sim.anim];
  const src = frames[Math.min(sim.frame, frames.length - 1)];
  if (!pet.src.endsWith(src.replace(/^\.\//, ""))) pet.src = src;

  const hopPx = sim.hop > 0 ? Math.sin(sim.hop * Math.PI) * 26 : 0;
  const breathe =
    sim.anim === "idle" || sim.anim === "sit" || sim.anim === "sleep"
      ? 1 + Math.sin(now * (sim.anim === "sleep" ? 0.0032 : 0.0046)) * (sim.anim === "sleep" ? 0.03 : 0.016)
      : 1;
  const stretch = sim.hop > 0 ? 1 + Math.sin(sim.hop * Math.PI) * 0.09 : sim.land > 0 ? 1 - Math.sin(sim.land * Math.PI) * 0.08 : breathe;
  const squat = 2 - stretch;
  pet.style.transform = `translate3d(${sim.x}px, ${-hopPx}px, 0) scale(${sim.facing * squat}, ${stretch})`;
  const shrink = 1 - hopPx / 90;
  shadow.style.transform = `translate3d(${sim.x + 40}px, 0, 0) scale(${shrink}, ${shrink})`;
  shadow.style.opacity = String(0.28 - hopPx / 90);
  const bx = clamp(sim.x + SPRITE * 0.5 - 110, 10, Math.max(10, width - 230));
  bubble.style.transform = `translate3d(${bx}px, ${-hopPx - 10}px, 0)`;

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
  const maxX = Math.max(PAD, window.innerWidth - SPRITE - PAD);
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
pet.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  window.desk?.openMenu(e.clientX, e.clientY);
});

window.desk?.onCommand((cmd) => handle(cmd));

decay();
setTimeout(() => {
  say(pick(LINES.greet), 5000);
  issue("talk");
}, 600);
setInterval(() => {
  if (document.hidden) return;
  if (performance.now() < speechUntil) return;
  const roll = Math.random();
  if (roll < 0.42) issue("wander");
  else if (roll < 0.64) issue(stats.energy < 35 ? "sleep" : "sit");
  else if (roll < 0.82) issue("idle");
  else {
    say(ambientLine());
    issue("talk");
  }
}, 5600);
setInterval(decay, 30_000);

pet.src = SPRITES.idle[0];
requestAnimationFrame(tick);
