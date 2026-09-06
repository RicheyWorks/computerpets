  function manyPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 34;
    const span = Math.max(0, win.width - size - pad * 2);
    const x = win.x + pad + span * 0.51;
    // window stool as a paperweight — walk onto the stool, sit the colony; not Cache oak-dish bury, not Armor bark-dish roll, not Pale dry-sand, not Snap meeting-rail count, not Dusk lamp-edge stile, not Shard sash-gap inkstone
    const paper = Math.max(28, size * 0.16);
    const gripY = win.y + win.height - paper;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 20, maxLift) };
  }

  function manyFace(target) {
    return target.approachX >= target.holdX ? -1 : 1;
  }

  function manyOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.36) * 1.9;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (toX >= fromX ? 1 : -1) * 2.1 * (1 - ease) + stride * 0.07,
    };
  }

  function manyPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.22) {
      const s = t / 0.22;
      const ease = s * s * (3 - 2 * s);
      // walk onto the stool — take the paperweight; walking colony, not Cache bury, not Snap count, not Dusk rim
      return { x: ease * 1.4, lift: ease * 0.7, rot: ease * 3.6 };
    }
    if (t < 0.68) {
      const s = (t - 0.22) / 0.46;
      // sit the colony once — many as one name; many is the tell; not knot as kind, not nexus as kind, not count, not rim, not dusk, not bury
      const ripple = Math.sin(s * Math.PI);
      return { x: 1.4 + ripple * 0.55, lift: 0.7 + ripple * 1.15, rot: 3.6 + ripple * 2.8 };
    }
    if (t < 0.90) {
      const s = (t - 0.68) / 0.22;
      const ease = s * s * (3 - 2 * s);
      // remain one name
      return { x: 1.4 - ease * 0.12, lift: 0.7 + ease * 0.18, rot: 3.6 - ease * 0.7 };
    }
    return { x: 1.28, lift: 0.88, rot: 2.9 };
  }

  function manyHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.09;
    // sit the colony on the window stool as a paperweight
    return { x: 1.28, lift: 0.88 + hush, rot: 2.9 };
  }

  function manyOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.18) * 1.6;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (from && from.rot != null ? from.rot : 2.9) * (1 - ease),
    };
  }
