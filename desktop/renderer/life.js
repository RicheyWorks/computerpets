(function (root) {
  const STORE = "computerpets.desktop.life.v2";
  const Hours = () => root.PetHours;
  const Hive = () => root.PetHive;
  const Special = () => root.PetSpecial;

  function snackLine(key, existing) {
    const hours = Hours();
    if (hours && hours.snackLine) return hours.snackLine(key, existing);
    return existing || "A small treaty.";
  }

  function stampHive(life, key) {
    const hive = Hive();
    if (!hive || !hive.isHivePlace(key)) return life;
    const stamped = hive.stampColony(life);
    life.brood = stamped.brood;
    life.stores = stamped.stores;
    return life;
  }

  const SHEDDERS = new Set([
    "ball_python", "corn_snake", "kingsnake", "green_tree_python", "hognose",
    "garter", "boa", "milk_snake", "rosy_boa", "carpet_python",
  ]);

  function isBlue(life, key, now = Date.now()) {
    return SHEDDERS.has(key) && now - (life.shedAt || 0) >= 8 * 60 * 60 * 1000;
  }

  function clamp(n, a = 0, b = 100) {
    return Math.max(a, Math.min(b, Math.round(n)));
  }
  function hourNow() {
    return new Date().getHours() + new Date().getMinutes() / 60;
  }
  function inWindow(h, start, end) {
    if (start === end) return false;
    if (start < end) return h >= start && h < end;
    return h >= start || h < end;
  }
  function pick(list) {
    return list[Math.floor(Math.random() * list.length)] ?? list[0];
  }

  function blank(now = Date.now()) {
    return {
      v: 2,
      hunger: 78,
      mood: 74,
      energy: 80,
      hygiene: 86,
      health: 92,
      bond: 18,
      weight: 50,
      bornAt: now,
      lastTick: now,
      lastMeal: now,
      lastPlay: 0,
      lastClean: now,
      lastNotify: 0,
      sick: false,
      hidden: false,
      asleep: false,
      stage: "hatchling",
      mess: [],
      gifts: [],
      ribbon: 0,
      lives: 1,
      startledUntil: 0,
      shedAt: 0,
    };
  }

  function load(key) {
    try {
      const raw = localStorage.getItem(`${STORE}.${key}`);
      if (!raw) {
        const fresh = blank();
        fresh.key = key;
        return stampHive(fresh, key);
      }
      const data = JSON.parse(raw);
      const life = { ...blank(), ...data, v: 2, key, mess: Array.isArray(data.mess) ? data.mess : [], gifts: Array.isArray(data.gifts) ? data.gifts : [] };
      return stampHive(life, key);
    } catch {
      const fresh = blank();
      fresh.key = key;
      return stampHive(fresh, key);
    }
  }

  function save(key, life) {
    try {
      localStorage.setItem(`${STORE}.${key}`, JSON.stringify(life));
    } catch {
      /* ignore */
    }
  }

  function ageDays(life, now = Date.now()) {
    return Math.max(0, (now - (life.bornAt || now)) / 86400000);
  }

  function stageOf(life, now = Date.now()) {
    const d = ageDays(life, now);
    if (d < 1) return "hatchling";
    if (d < 7) return "grown";
    return "elder";
  }

  function sizeScale(life, trait) {
    const stage = life.stage === "hatchling" ? 0.82 : life.stage === "elder" ? 1.06 : 1;
    return (trait.size || 1) * stage;
  }

  function night(trait, h = hourNow(), key) {
    const hours = Hours();
    if (hours && hours.isRestingHour && key) return hours.isRestingHour(key, Math.floor(h));
    return inWindow(h, trait.sleepStart, trait.sleepEnd);
  }

  function decay(life, trait, now = Date.now(), key) {
    const dt = Math.max(0, now - (life.lastTick || now));
    const hours = dt / 3600000;
    if (hours <= 0) {
      if (!life.sick && life.health < 32) life.sick = true;
      if (life.sick && life.health > 64 && life.hygiene > 40) life.sick = false;
      life.stage = stageOf(life, now);
      stampHive(life, key);
      return { life, grew: false, asleep: !!life.asleep };
    }
    const hatch = life.stage === "hatchling" ? 1.35 : life.stage === "elder" ? 0.85 : 1;
    const when = new Date(now);
    const asleep = night(trait, when.getHours() + when.getMinutes() / 60, key) && !life.hidden;
    life.asleep = asleep && !life.sick;
    const hungerRate = 100 / (trait.hungerH * hatch);
    const energyRate = 100 / (trait.energyH);
    const hygieneRate = 100 / (trait.hygieneH);
    const moodRate = 100 / (14 / (trait.social || 1));

    life.hunger = clamp(life.hunger - hours * hungerRate * (asleep ? 0.45 : 1));
    if (asleep) life.energy = clamp(life.energy + hours * 18);
    else life.energy = clamp(life.energy - hours * energyRate);
    life.hygiene = clamp(life.hygiene - hours * hygieneRate * (trait.messy + 0.35));
    life.mood = clamp(life.mood - hours * moodRate * (life.sick ? 1.4 : 1) * (life.hidden ? 0.4 : 1));

    if (life.hunger < 18 || life.hygiene < 18) {
      life.health = clamp(life.health - hours * (8 * (1.15 - trait.hardy)));
    } else if (!life.sick) {
      life.health = clamp(life.health + hours * 3);
    }

    if (!life.sick && life.health < 32) life.sick = true;
    if (life.sick && life.health > 64 && life.hygiene > 40) life.sick = false;

    if (trait.special === "regrow" && life.health < 90) {
      life.health = clamp(life.health + hours * 6);
    }

    if (life.hygiene < 42 && life.mess.length < 5 && Math.random() < Math.min(0.35, dt / 120000)) {
      life.mess.push({ id: `${now}-${Math.random().toString(36).slice(2, 7)}`, x: 0.2 + Math.random() * 0.6, age: now });
    }
    if (life.bond >= 50 && (!life.gifts || life.gifts.length < 2) && Math.random() < hours * 0.35) {
      if (!life.gifts) life.gifts = [];
      life.gifts.push({ id: `g-${now}`, x: 0.18 + Math.random() * 0.64 });
    }

    const neglected = life.hunger < 8 && life.mood < 18 && ageDays(life, now) > 0.2;
    if (neglected && !life.hidden && Math.random() < hours * 0.8) life.hidden = true;

    if (trait.special === "reborn" && life.health <= 4) {
      life.hunger = 70;
      life.mood = 68;
      life.energy = 75;
      life.hygiene = 80;
      life.health = 88;
      life.sick = false;
      life.hidden = false;
      life.lives += 1;
      life.bond = clamp(life.bond + 8);
    }

    const nextStage = stageOf(life, now);
    const grew = nextStage !== life.stage;
    life.stage = nextStage;
    life.lastTick = now;
    stampHive(life, key);
    return { life, grew, asleep };
  }

  function bondUp(life, n) {
    life.bond = clamp(life.bond + n);
  }

  function actBody(life, trait, action, now = Date.now(), key) {
    const extra = trait.extra || {};
    if (life.hidden && action !== "call" && action !== "talk") {
      return { life, line: pick(extra.hide || ["..."]), cmd: "idle", notify: null };
    }

    if (action === "feed") {
      if (life.weight > 82) {
        life.mood = clamp(life.mood - 4);
        return { life, line: "Enough. The bowl is a mountain.", cmd: "idle", notify: null };
      }
      life.hunger = clamp(life.hunger + (trait.diet === "myth" ? 22 : 30));
      life.mood = clamp(life.mood + 6);
      life.energy = clamp(life.energy - 5);
      life.weight = clamp(life.weight + 4);
      life.lastMeal = now;
      bondUp(life, 2);
      return { life, line: null, cmd: "eat", notify: null, useRoster: "feed" };
    }
    if (action === "snack") {
      life.hunger = clamp(life.hunger + 12);
      life.mood = clamp(life.mood + 3);
      life.weight = clamp(life.weight + 1);
      bondUp(life, 1);
      return { life, line: snackLine(key), cmd: "eat", notify: null };
    }
    if (action === "shed") {
      const due = now - (life.shedAt || 0) >= 8 * 60 * 60 * 1000;
      if (!due) return { life, line: pick(extra.shedWait || ["The coat is still good."]), cmd: "sit", notify: null };
      life.hygiene = clamp(life.hygiene + 28);
      life.mood = clamp(life.mood + 12);
      life.health = clamp(life.health + 8);
      life.shedAt = now;
      if (life.gifts.length < 3) life.gifts.push({ id: `shed-${now}`, x: 0.2 + Math.random() * 0.55, kind: "shed" });
      bondUp(life, 3);
      return { life, line: pick(extra.shed || ["I left a copy."]), cmd: "sit", notify: "shed" };
    }
    if (action === "play") {
      if (life.energy < 12) return { life, line: "The paws vote no.", cmd: "sit", notify: null };
      if (trait.startle && Math.random() < 0.18) {
        life.startledUntil = now + 4000;
        life.mood = clamp(life.mood - 3);
        return { life, line: pick(extra.special || ["Thump."]), cmd: "wander", notify: null };
      }
      life.hunger = clamp(life.hunger - 8);
      life.mood = clamp(life.mood + 24);
      life.energy = clamp(life.energy - 14);
      life.weight = clamp(life.weight - 3);
      life.lastPlay = now;
      bondUp(life, 3);
      return { life, line: null, cmd: "play", notify: null, useRoster: "play" };
    }
    if (action === "rest") {
      life.hunger = clamp(life.hunger - 3);
      life.mood = clamp(life.mood + 4);
      life.energy = clamp(life.energy + 32);
      life.asleep = true;
      bondUp(life, 1);
      return { life, line: null, cmd: "sleep", notify: null, useRoster: "rest" };
    }
    if (action === "clean") {
      if (!life.mess.length && life.hygiene > 80) return { life, line: "Already honest.", cmd: "idle", notify: null };
      life.mess = [];
      life.hygiene = clamp(life.hygiene + 38);
      life.mood = clamp(life.mood + 8);
      life.lastClean = now;
      bondUp(life, 2);
      return { life, line: pick(extra.clean || ["Clean."]), cmd: "sit", notify: null };
    }
    if (action === "bath") {
      life.hygiene = clamp(life.hygiene + 48);
      life.mood = clamp(life.mood + (trait.special === "bath" ? 16 : 4));
      life.energy = clamp(life.energy - 6);
      life.mess = [];
      if (trait.special === "bath") bondUp(life, 4);
      else bondUp(life, 1);
      return { life, line: pick(extra.bath || ["Water. Then dignity."]), cmd: "sit", notify: null };
    }
    if (action === "medicine") {
      if (!life.sick && life.health > 70) return { life, line: "I am not a project.", cmd: "idle", notify: null };
      life.sick = false;
      life.health = clamp(life.health + 28);
      life.mood = clamp(life.mood - 2);
      bondUp(life, 3);
      return { life, line: pick(extra.medicine || ["Bitter. Fine."]), cmd: "sit", notify: null };
    }
    if (action === "praise") {
      life.mood = clamp(life.mood + 12);
      bondUp(life, 2);
      return { life, line: pick(extra.praise || ["I heard that."]), cmd: "talk", notify: null };
    }
    if (action === "call") {
      life.hidden = false;
      life.mood = clamp(life.mood + 6);
      bondUp(life, 2);
      return { life, line: pick(extra.call || ["You called."]), cmd: "talk", notify: null };
    }
    if (action === "gift") {
      return { life, line: "I left this.", cmd: "talk", notify: null };
    }
    if (action === "special") {
      return runSpecial(life, trait, now);
    }
    if (action === "talk") {
      bondUp(life, 1);
      if (life.sick) return { life, line: pick(extra.sick || ["Unwell."]), cmd: "talk", notify: null };
      if (life.hunger < 24) return { life, line: null, cmd: "talk", notify: null, useRoster: "hungry" };
      if (life.energy < 22) return { life, line: null, cmd: "talk", notify: null, useRoster: "tired" };
      return { life, line: null, cmd: "talk", notify: null, useRoster: "ambient" };
    }
    return { life, line: null, cmd: "idle", notify: null };
  }

  function act(life, trait, action, now = Date.now(), key) {
    const result = actBody(life, trait, action, now, key);
    stampHive(result.life, key);
    return result;
  }

  function runSpecial(life, trait, now) {
    const extra = trait.extra || {};
    const law = Special();
    const applied = law && law.applySpecial
      ? law.applySpecial(life, trait.special)
      : { stats: { ...life, bond: clamp(life.bond + 2) }, cmd: "idle" };
    life.bond = applied.stats.bond;
    life.mood = applied.stats.mood;
    life.energy = applied.stats.energy;
    life.hygiene = applied.stats.hygiene;
    life.health = applied.stats.health;
    let notify = null;
    if (trait.special === "ribbon") {
      life.ribbon += 1;
      if (life.bond >= 50 && life.gifts.length < 2) life.gifts.push({ id: `g-${now}`, x: 0.4 + Math.random() * 0.2 });
      notify = life.ribbon === 1 ? "ribbon" : null;
    }
    if (trait.special === "steal") {
      if (life.mess.length < 3) life.mess.push({ id: `steal-${now}`, x: 0.35 + Math.random() * 0.3, age: now });
      notify = "steal";
    }
    if (trait.special === "thump") life.startledUntil = now + 2500;
    if (trait.special === "wheek") notify = "wheek";
    if (trait.special === "bug") notify = "bug";
    if (trait.special === "reborn") notify = "reborn";
    return { life, line: pick(extra.special || ["..."]), cmd: applied.cmd, notify };
  }

  function bondTitle(bond) {
    if (bond >= 100) return "Soul";
    if (bond >= 75) return "Devoted";
    if (bond >= 50) return "Friend";
    if (bond >= 25) return "Known";
    return "New";
  }

  function crossedBond(prev, next) {
    const marks = [25, 50, 75, 100];
    for (const m of marks) {
      if (prev < m && next >= m) return bondTitle(m);
    }
    return null;
  }

  const BOND_LINE = {
    Known: "I know your hands now.",
    Friend: "We are past the first week.",
    Devoted: "I would wait by the door.",
    Soul: "The blotter is ours.",
  };

  function vitals(life, key) {
    const hive = Hive();
    if (hive && hive.isHivePlace(key || life.key)) {
      const colony = hive.colonyOf(life, life.hidden);
      if (colony.quiet) return `${hive.colonyWord(colony)} · ${bondTitle(life.bond)}`;
    }
    let word = "Settled";
    if (life.hidden) word = "Away";
    else if (life.sick) word = "Unwell";
    else if (life.asleep) word = "Asleep";
    else if (life.blue) word = "Blue";
    else if (life.hunger < 22) word = "Hungry";
    else if (life.hygiene < 24) word = "Unkempt";
    else if (life.energy < 20) word = "Tired";
    else if (life.bond >= 80) word = "Devoted";
    else if (life.mood >= 80) word = "Bright";
    else if (life.stage === "hatchling") word = "Hatchling";
    else if (life.stage === "elder") word = "Elder";
    return `${word} · ${bondTitle(life.bond)}`;
  }

  function alerts(life, name, now = Date.now()) {
    if (now - (life.lastNotify || 0) < 20 * 60 * 1000) return null;
    if (life.hidden) return { title: name, body: `${name} went to hide.` };
    if (life.sick) return { title: name, body: `${name} is unwell.` };
    if (life.hunger < 16) return { title: name, body: `${name} is hungry.` };
    if (life.mess.length >= 2) return { title: name, body: `${name} left a mess.` };
    return null;
  }

  const api = {
    load,
    save,
    decay,
    act,
    vitals,
    alerts,
    ageDays,
    sizeScale,
    night,
    blank,
    hourNow,
    bondTitle,
    crossedBond,
    BOND_LINE,
    isBlue,
    SHEDDERS,
    snackLine,
    stampHive,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetLife = api;
})(typeof window !== "undefined" ? window : globalThis);
