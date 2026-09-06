  function wartsPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 34;
    const span = Math.max(0, win.width - size - pad * 2);
    // window apron — moss cup under the sill; not Frill stile shelf, not Vault grass plate, not Vee blotter green
    const x = win.x + pad + span * 0.38;
    const apron = Math.max(24, Math.min(size * 0.14, win.height * 0.065));
    const gripY = win.y + win.height - apron;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 16, maxLift) };
  }

  function wartsFace(target) {
    return target.approachX >= target.holdX ? -1 : 1;
  }

  function wartsOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.38) * 0.68;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (toX >= fromX ? 1 : -1) * 1.28 * (1 - ease) + stride * 0.04,
    };
  }

  function wartsPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.18) {
      const s = t / 0.18;
      const ease = s * s * (3 - 2 * s);
      // rise the red — white gills, skirt, volva; a warning, not lunch
      return { x: ease * 0.35, lift: ease * 1.15, rot: ease * -5.4 };
    }
    if (t < 0.52) {
      const s = (t - 0.18) / 0.34;
      const wave = Math.sin(s * Math.PI * 2.15);
      // wart once — white veil scraps on the red; warts is the tell; not Seven spot, not Sepia flush
      return { x: 0.35 + wave * 2.4, lift: 1.15 + Math.abs(wave) * 2.85, rot: -5.4 + wave * 3.6 };
    }
    if (t < 0.78) {
      const s = (t - 0.52) / 0.26;
      const ease = s * s * (3 - 2 * s);
      // flush then warning again — trade with roots; the cup kept my red
      return { x: 0.35 - ease * 0.12, lift: 1.15 - ease * 0.48, rot: -5.4 + ease * 2.8 };
    }
    return { x: 0.23, lift: 0.67, rot: -2.6 };
  }

  function wartsHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.08;
    // sit the moss cup; spots record the warning
    return { x: 0.23, lift: 0.67 + hush, rot: -2.6 };
  }

  function wartsOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.32) * 0.82;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (from && from.rot != null ? from.rot : -2.6) * (1 - ease),
    };
  }

