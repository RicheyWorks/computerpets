function chordPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 12;
    const span = Math.max(0, win.width - size - pad * 2);
    // mid-center blotter-air pane -- sounding membrane for a chord body; not Gleam's upper-right lamp glass, not Pact's cool left bark stile, not Starter's lower damp yeast film, not Pulse's chime moons, not Echo's mid jamb perch
    const x = win.x + pad + span * 0.48;
    const pane = Math.max(78, win.height * 0.42);
    const gripY = win.y + pane;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 36, maxLift) };
  }

  function chordFace(target) {
    return target.approachX >= target.holdX ? -1 : 1;
  }

  function chordOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.12) * 0.28;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (toX >= fromX ? 1 : -1) * 0.72 * (1 - ease) + stride * 0.02,
    };
  }

  function chordPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.2) {
      const s = t / 0.2;
      const ease = s * s * (3 - 2 * s);
      // take the blotter-air membrane -- one body against the pane; Harmonia plexus, not photovore thirst, not lichen plaque, not jelly chime
      return { x: ease * 0.12, lift: ease * 0.28, rot: ease * 2.4 };
    }
    if (t < 0.62) {
      const s = (t - 0.2) / 0.42;
      const wave = Math.sin(s * Math.PI * 2.05);
      // chord once -- overtones on the mid pane; chord is the tell; not choir as kind, not chorus, not hum, not chime, not drone, not sing, not song, not thirst
      return { x: 0.12 + wave * 1.55, lift: 0.28 + Math.abs(wave) * 2.05, rot: 2.4 + wave * 4.2 };
    }
    if (t < 0.88) {
      const s = (t - 0.62) / 0.26;
      const ease = s * s * (3 - 2 * s);
      // settle the chord -- soft blotter-air sit after the overtone
      return { x: 0.12 - ease * 0.04, lift: 0.28 - ease * 0.1, rot: 2.4 - ease * 1.4 };
    }
    return { x: 0.08, lift: 0.18, rot: 1.0 };
  }

  function chordHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.06;
    // sit the overtone; the chord records it
    return { x: 0.08, lift: 0.18 + hush, rot: 1.0 };
  }

  function chordOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.1) * 0.44;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (from && from.rot != null ? from.rot : 1.0) * (1 - ease),
    };
  }
