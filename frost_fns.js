  function frostPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 36;
    const span = Math.max(0, win.width - size - pad * 2);
    const x = win.x + pad + span * 0.44;
    // window stool as a salt dish — walk onto the stool, sit the frost; not Sheen salt-glass lick, not Tun dry moss-film, not Pale dry-sand, not Knot paperweight many, not Bank sand-bank dig, not Cache oak-dish bury
    const dish = Math.max(26, size * 0.14);
    const gripY = win.y + win.height - dish;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 20, maxLift) };
  }

  function frostFace(target) {
    return target.approachX >= target.holdX ? -1 : 1;
  }

  function frostOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.22) * 1.55;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (toX >= fromX ? 1 : -1) * 1.7 * (1 - ease) + stride * 0.05,
    };
  }

  function frostPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.24) {
      const s = t / 0.24;
      const ease = s * s * (3 - 2 * s);
      // walk onto the salt dish — take the stool; salt-drinker, not Sheen lick, not Tun dry, not Knot many
      return { x: ease * 1.15, lift: ease * 0.55, rot: ease * 2.8 };
    }
    if (t < 0.70) {
      const s = (t - 0.24) / 0.46;
      // sit the frost once — frost of waste; the frost is the tell; not dry as kind, not lick, not many, not sand
      const crystal = Math.sin(s * Math.PI);
      return { x: 1.15 + crystal * 0.38, lift: 0.55 + crystal * 0.95, rot: 2.8 + crystal * 2.1 };
    }
    if (t < 0.90) {
      const s = (t - 0.70) / 0.20;
      const ease = s * s * (3 - 2 * s);
      // leave a frost of waste
      return { x: 1.15 - ease * 0.08, lift: 0.55 + ease * 0.22, rot: 2.8 - ease * 0.55 };
    }
    return { x: 1.07, lift: 0.77, rot: 2.25 };
  }

  function frostHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.07;
    // sit the frost on the window stool as a salt dish
    return { x: 1.07, lift: 0.77 + hush, rot: 2.25 };
  }

  function frostOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.08) * 1.35;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (from && from.rot != null ? from.rot : 2.25) * (1 - ease),
    };
  }
