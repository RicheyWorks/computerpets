function plaquePoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 10;
    const span = Math.max(0, win.width - size - pad * 2);
    // upper cool left stile — bark/stone micro-site for a two-kingdom plaque; not Frill's mid left timber shelf, not Flame's right warm drip, not Starter's lower damp yeast film, not Tun's dry moss-film center, not Ring's mid zones
    const x = win.x + pad + span * 0.08;
    const timber = Math.max(58, win.height * 0.22);
    const gripY = win.y + timber;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 34, maxLift) };
  }

  function plaqueFace(target) {
    return target.approachX >= target.holdX ? -1 : 1;
  }

  function plaqueOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.12) * 0.36;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (toX >= fromX ? 1 : -1) * 0.72 * (1 - ease) + stride * 0.025,
    };
  }

  function plaquePath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.2) {
      const s = t / 0.2;
      const ease = s * s * (3 - 2 * s);
      // take the cool bark wood — slow crust of two kingdoms; lichen, not yeast bloom, not shelf bracket, not drip
      return { x: ease * 0.18, lift: ease * 0.28, rot: ease * -3.1 };
    }
    if (t < 0.55) {
      const s = (t - 0.2) / 0.35;
      const wave = Math.sin(s * Math.PI * 1.15);
      // plaque once — two-kingdom share paints the cool stile; plaque is the tell; not bloom, not drip, not shelf, not crust as guest name, not stain, not paint
      return { x: 0.18 + wave * 1.6, lift: 0.28 + Math.abs(wave) * 1.9, rot: -3.1 + wave * 2.4 };
    }
    if (t < 0.84) {
      const s = (t - 0.55) / 0.29;
      const ease = s * s * (3 - 2 * s);
      // settle the share — thin slow plaque on cool bark stone
      return { x: 0.18 - ease * 0.04, lift: 0.28 - ease * 0.1, rot: -3.1 + ease * 1.4 };
    }
    return { x: 0.14, lift: 0.18, rot: -1.7 };
  }

  function plaqueHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.04;
    // sit the two-kingdom share; the plaque records it
    return { x: 0.14, lift: 0.18 + hush, rot: -1.7 };
  }

  function plaqueOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.16) * 0.5;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (from && from.rot != null ? from.rot : -1.7) * (1 - ease),
    };
  }