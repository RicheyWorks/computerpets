  function waitPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 38;
    const span = Math.max(0, win.width - size - pad * 2);
    const x = win.x + pad + span * 0.58;
    // window stool as a damp blotter — sit sealed cyst on interior stool (papers damp); wait is the tell / traveling cyst
    // not Ochre pane reef, not Latch drip drink, not Lula apron loop, not Felt lean blotter-felt, not Brood emerge, not Vein damp saucer, not Brine salt-dish frost, not Knot paperweight many
    const blotter = Math.max(27, size * 0.145);
    const gripY = win.y + win.height - blotter;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 20, maxLift) };
  }

  function waitFace(target) {
    return target.approachX >= target.holdX ? -1 : 1;
  }

  function waitOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.12) * 1.28;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (toX >= fromX ? 1 : -1) * 1.38 * (1 - ease) + stride * 0.032,
    };
  }

  function waitPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.22) {
      const s = t / 0.22;
      const ease = s * s * (3 - 2 * s);
      // walk onto the stool — take the damp blotter; sealed cyst / the wait; not Ochre reef, not Latch drink, not Lula loop, not Brood emerge
      return { x: ease * 0.92, lift: ease * 0.48, rot: ease * 2.05 };
    }
    if (t < 0.68) {
      const s = (t - 0.22) / 0.46;
      // sit the wait once — remain the sealed cyst; wait is the tell; not reef, not drink, not loop, not emerge, not frost, not many, not cool
      const seal = Math.sin(s * Math.PI);
      return { x: 0.92 + seal * 0.18, lift: 0.48 + seal * 0.55, rot: 2.05 + seal * 1.35 };
    }
    if (t < 0.90) {
      const s = (t - 0.68) / 0.22;
      const ease = s * s * (3 - 2 * s);
      // remain sealed / review the wait
      return { x: 0.92 - ease * 0.04, lift: 0.48 + ease * 0.16, rot: 2.05 - ease * 0.32 };
    }
    return { x: 0.88, lift: 0.64, rot: 1.73 };
  }

  function waitHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.048;
    // sit the wait on the window stool as a damp blotter (papers damp)
    return { x: 0.88, lift: 0.64 + hush, rot: 1.73 };
  }

  function waitOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.02) * 1.15;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (from && from.rot != null ? from.rot : 1.73) * (1 - ease),
    };
  }
