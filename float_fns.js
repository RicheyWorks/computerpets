function floatPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 12;
    const span = Math.max(0, win.width - size - pad * 2);
    // lower-mid methane-bowl pane -- cold-gas sea a floater keeps; not Choir's mid-center blotter air, not Gleam's upper-right lamp glass, not Pact's cool left bark stile, not Pulse's chime moons, not Coin's bowl circle
    const x = win.x + pad + span * 0.55;
    const pane = Math.max(82, win.height * 0.58);
    const gripY = win.y + pane;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 36, maxLift) };
  }

  function floatFace(target) {
    return target.approachX >= target.holdX ? -1 : 1;
  }

  function floatOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const bob = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.08) * 0.34;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + bob,
      rot: (toX >= fromX ? 1 : -1) * 0.58 * (1 - ease) + bob * 0.03,
    };
  }

  function floatPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.2) {
      const s = t / 0.2;
      const ease = s * s * (3 - 2 * s);
      // take the methane bowl -- one cold gas against the pane; methane floater, not chord body, not photovore thirst, not jelly chime
      return { x: ease * 0.1, lift: ease * 0.36, rot: ease * 1.8 };
    }
    if (t < 0.64) {
      const s = (t - 0.2) / 0.44;
      const wave = Math.sin(s * Math.PI * 1.72);
      // float once -- soft bob on the methane bowl; float is the tell; not nimbus as kind, not drift, not cloud, not mist, not fog, not haze, not puff, not dust, not chord, not thirst
      return { x: 0.1 + wave * 1.22, lift: 0.36 + Math.abs(wave) * 2.28, rot: 1.8 + wave * 3.1 };
    }
    if (t < 0.9) {
      const s = (t - 0.64) / 0.26;
      const ease = s * s * (3 - 2 * s);
      // settle the float -- soft methane-bowl sit after the bob
      return { x: 0.1 - ease * 0.03, lift: 0.36 - ease * 0.12, rot: 1.8 - ease * 1.1 };
    }
    return { x: 0.07, lift: 0.24, rot: 0.7 };
  }

  function floatHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.08;
    // sit the cold; the float records it
    return { x: 0.07, lift: 0.24 + hush, rot: 0.7 };
  }

  function floatOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const bob = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.06) * 0.4;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + bob,
      rot: (from && from.rot != null ? from.rot : 0.7) * (1 - ease),
    };
  }

