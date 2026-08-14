(function () {
  const STORE = "computerpets.desktop.life.v2";

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
    };
  }

  function load(key) {
    try {
      const raw = localStorage.getItem(`${STORE}.${key}`);
      if (!raw) return blank();
      const data = JSON.parse(raw);
      return { ...blank(), ...data, v: 2, mess: Array.isArray(data.mess) ? data.mess : [], gifts: Array.isArray(data.gifts) ? data.gifts : [] };
    } catch {
      return blank();
    }
  }

  function save(key, life) {
    try {
      localStorage.setItem(`${STORE}.${key}`, JSON.stringify({ ...life, lastTick: Date.now() }));
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

  function night(trait, h = hourNow()) {
    return inWindow(h, trait.sleepStart, trait.sleepEnd);
  }

  function decay(life, trait, now = Date.now()) {
    const dt = Math.max(0, now - (life.lastTick || now));
    const hours = dt / 3600000;
    if (hours <= 0) {
      life.stage = stageOf(life, now);
      return life;
    }
    const hatch = life.stage === "hatchling" ? 1.35 : life.stage === "elder" ? 0.85 : 1;
    const asleep = night(trait) && !life.hidden;
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

    if (!life.sick && life.health < 32 && Math.random() < hours * (0.55 - trait.hardy * 0.3)) {
      life.sick = true;
    }
    if (life.sick && life.health > 62 && life.hygiene > 40) life.sick = false;

    if (trait.special === "regrow" && life.health < 90) {
      life.health = clamp(life.health + hours * 6);
    }

    if (life.hygiene < 28 && life.mess.length < 4 && Math.random() < hours * trait.messy * 1.6) {
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
    return { life, grew, asleep };
  }

  function bondUp(life, n) {
    life.bond = clamp(life.bond + n);
  }

  function act(life, trait, action, now = Date.now()) {
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
      return { life, line: "A small treaty.", cmd: "eat", notify: null };
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

  function runSpecial(life, trait, now) {
    const extra = trait.extra || {};
    bondUp(life, 2);
    switch (trait.special) {
      case "ribbon":
        life.ribbon += 1;
        life.mood = clamp(life.mood + 8);
        if (life.bond >= 50 && life.gifts.length < 2) life.gifts.push({ id: `g-${now}`, x: 0.4 + Math.random() * 0.2 });
        return { life, line: pick(extra.special), cmd: "play", notify: life.ribbon === 1 ? "ribbon" : null };
      case "follow":
        life.mood = clamp(life.mood + 4);
        return { life, line: pick(extra.special), cmd: "wander", notify: null };
      case "thump":
        life.startledUntil = now + 2500;
        return { life, line: pick(extra.special), cmd: "wander", notify: null };
      case "hoard":
        life.mood = clamp(life.mood + 6);
        return { life, line: pick(extra.special), cmd: "sit", notify: null };
      case "wheek":
        life.mood = clamp(life.mood + 10);
        return { life, line: pick(extra.special), cmd: "talk", notify: "wheek" };
      case "still":
      case "bask":
        life.energy = clamp(life.energy + 8);
        return { life, line: pick(extra.special), cmd: "sit", notify: null };
      case "loop":
        return { life, line: pick(extra.special), cmd: "wander", notify: null };
      case "echo":
      case "quote":
        return { life, line: pick(extra.special), cmd: "talk", notify: null };
      case "bug":
        return { life, line: pick(extra.special), cmd: "talk", notify: "bug" };
      case "ritual":
        life.bond = clamp(life.bond + 3);
        return { life, line: pick(extra.special), cmd: "sit", notify: null };
      case "steal":
        life.mood = clamp(life.mood + 8);
        if (life.mess.length < 3) life.mess.push({ id: `steal-${now}`, x: 0.35 + Math.random() * 0.3, age: now });
        return { life, line: pick(extra.special), cmd: "play", notify: "steal" };
      case "curl":
        return { life, line: pick(extra.special), cmd: "sit", notify: null };
      case "bath":
        return act(life, trait, "bath", now);
      case "regrow":
        life.health = clamp(life.health + 12);
        return { life, line: pick(extra.special), cmd: "idle", notify: null };
      case "bill":
        return { life, line: pick(extra.special), cmd: "talk", notify: null };
      case "reborn":
        life.health = clamp(life.health + 10);
        return { life, line: pick(extra.special), cmd: "talk", notify: "reborn" };
      case "sun":
        life.mood = clamp(life.mood + 6);
        life.energy = clamp(life.energy + 4);
        return { life, line: pick(extra.special), cmd: "sit", notify: null };
      default:
        return { life, line: pick(extra.special || ["..."]), cmd: "idle", notify: null };
    }
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

  function vitals(life) {
    let word = "Settled";
    if (life.hidden) word = "Away";
    else if (life.sick) word = "Unwell";
    else if (life.asleep) word = "Asleep";
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

  window.PetLife = { load, save, decay, act, vitals, alerts, ageDays, sizeScale, night, blank, hourNow, bondTitle, crossedBond, BOND_LINE };
})();
