  function alignPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const span = Math.max(0, win.width - size);
    // sash parting bead as a ruler line — sit the interior parting bead (vertical thin bead between sash and jamb / pencil-line of the frame); north needle; not Bandit jamb-as-ruler inspect, not Anchor hitch, not Stem stilt, not Shift aim, not Flux field, not Gauss orbit, not Brine frost
    const x = win.x + span * 0.18;
    const gripY = win.y + win.height * 0.52;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 36, maxLift) };
  }

  function alignFace(target) {
    return target.approachX >= target.holdX ? -1 : 1;
  }

  function alignOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.18) * 1.45;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (toX >= fromX ? 1 : -1) * 1.55 * (1 - ease) + stride * 0.04,
    };
  }

  function alignPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.22) {
      const s = t / 0.22;
      const ease = s * s * (3 - 2 * s);
      // walk onto the bead — take the ruler line; field swimmer, not Bandit inspect, not Anchor hitch, not Stem stilt
      return { x: ease * 0.95, lift: ease * 0.48, rot: ease * 2.4 };
    }
    if (t < 0.68) {
      const s = (t - 0.22) / 0.46;
      // sit the north once — remain a north / needle; align is the tell; not field as kind (Flux), not north as kind, not inspect, not hitch, not stilt
      const needle = Math.sin(s * Math.PI);
      return { x: 0.95 + needle * 0.28, lift: 0.48 + needle * 0.82, rot: 2.4 + needle * 1.85 };
    }
    if (t < 0.90) {
      const s = (t - 0.68) / 0.22;
      const ease = s * s * (3 - 2 * s);
      // remain a north / needle
      return { x: 0.95 - ease * 0.06, lift: 0.48 + ease * 0.2, rot: 2.4 - ease * 0.45 };
    }
    return { x: 0.89, lift: 0.68, rot: 1.95 };
  }

  function alignHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.06;
    // sit the north on the sash parting bead as a ruler line
    return { x: 0.89, lift: 0.68 + hush, rot: 1.95 };
  }

  function alignOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.05) * 1.25;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (from && from.rot != null ? from.rot : 1.95) * (1 - ease),
    };
  }
