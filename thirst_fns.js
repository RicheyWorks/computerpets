function thirstPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 10;
    const span = Math.max(0, win.width - size - pad * 2);
    // upper-right bright pane -- lamp-glass micro-site for a photovore thirst; not Pact's cool left bark stile, not Starter's lower damp yeast film, not Flame's right warm drip, not Sun's upper sash warm, not Spark's lower sash glow
    const x = win.x + pad + span * 0.68;
    const pane = Math.max(62, win.height * 0.26);
    const gripY = win.y + pane;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 34, maxLift) };
  }

  function thirstFace(target) {
    return target.approachX >= target.holdX ? -1 : 1;
  }

  function thirstOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.08) * 0.32;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (toX >= fromX ? 1 : -1) * 0.68 * (1 - ease) + stride * 0.022,
    };
  }

  function thirstPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.22) {
      const s = t / 0.22;
      const ease = s * s * (3 - 2 * s);
      // take the bright lamp glass -- mouthless lean into the wavelength; photovore, not lichen plaque, not yeast bloom, not warm sun ledge
      return { x: ease * 0.16, lift: ease * 0.34, rot: ease * 2.8 };
    }
    if (t < 0.58) {
      const s = (t - 0.22) / 0.36;
      const wave = Math.sin(s * Math.PI * 1.2);
      // thirst once -- drink the wavelength on the bright pane; thirst is the tell; not glow, not gleam as kind, not sun, not drink (leech), not sip, not warm, not flash, not plaque
      return { x: 0.16 + wave * 1.35, lift: 0.34 + Math.abs(wave) * 2.35, rot: 2.8 + wave * 3.1 };
    }
    if (t < 0.86) {
      const s = (t - 0.58) / 0.28;
      const ease = s * s * (3 - 2 * s);
      // settle the drink -- soft lamp-glass sit after the thirst
      return { x: 0.16 - ease * 0.05, lift: 0.34 - ease * 0.12, rot: 2.8 - ease * 1.6 };
    }
    return { x: 0.11, lift: 0.22, rot: 1.2 };
  }

  function thirstHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.05;
    // sit the wavelength drink; the thirst records it
    return { x: 0.11, lift: 0.22 + hush, rot: 1.2 };
  }

  function thirstOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.14) * 0.48;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (from && from.rot != null ? from.rot : 1.2) * (1 - ease),
    };
  }