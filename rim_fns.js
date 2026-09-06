  function rimPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const workW = work && work.width ? work.width : 1280;
    const lampRight = win.x + win.width / 2 < workW / 2;
    // lamp-side stile as a lamp-edge — walk onto the stile, sit the rim; not Night dusk-run tapetum, not Penny dock-shade flare, not Swing lamp-arm sing, not Ghost lamp-side glass week, not Gleam bright pane lamp glass, not Shard sash-gap inkstone, not Miso top ledge
    const stile = Math.max(12, Math.min(size * 0.11, win.width * 0.06));
    const x = lampRight ? win.x + win.width - size - stile : win.x + stile;
    const sit = Math.max(102, win.height * 0.56);
    const gripY = win.y + sit;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 36, maxLift) };
  }

  function rimFace(target) {
    return target.approachX >= target.holdX ? -1 : 1;
  }

  function rimOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.42) * 2.1;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (toX >= fromX ? 1 : -1) * 2.4 * (1 - ease) + stride * 0.08,
    };
  }

  function rimPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.20) {
      const s = t / 0.20;
      const ease = s * s * (3 - 2 * s);
      // walk onto the stile — take the lamp-edge rim; twilight walker, not Night tapetum dusk, not Penny flare, not Ghost week, not Shard facet
      return { x: ease * 1.8, lift: ease * 0.9, rot: ease * 4.2 };
    }
    if (t < 0.64) {
      const s = (t - 0.20) / 0.44;
      // sit the rim once — thin belt; rim is the tell; not dusk as kind, not week, not creep, not facet, not float, not terminator as kind, not ledge
      const belt = Math.sin(s * Math.PI);
      return { x: 1.8 + belt * 0.7, lift: 0.9 + belt * 1.6, rot: 4.2 + belt * 3.4 };
    }
    if (t < 0.88) {
      const s = (t - 0.64) / 0.24;
      const ease = s * s * (3 - 2 * s);
      // remain a rim
      return { x: 1.8 - ease * 0.15, lift: 0.9 + ease * 0.22, rot: 4.2 - ease * 0.9 };
    }
    return { x: 1.65, lift: 1.12, rot: 3.3 };
  }

  function rimHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.11;
    // sit the rim on the lamp-side stile as a lamp-edge
    return { x: 1.65, lift: 1.12 + hush, rot: 3.3 };
  }

  function rimOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.22) * 1.8;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (from && from.rot != null ? from.rot : 3.3) * (1 - ease),
    };
  }
