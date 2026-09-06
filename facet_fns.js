function facetPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const mouth = size * 0.09;
    // left sash gap as an inkstone — walk into the gap, sit the facet; not Mortar left inkstone-cell daub, not Mane right wood-wound teeth, not Nimbus methane bowl mid pane, not Choir blotter air, not Gleam lamp glass
    const x = win.x - mouth;
    const ink = Math.max(122, win.height * 0.61);
    const gripY = win.y + ink;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 30, maxLift) };
  }

  function facetFace(target) {
    return target.approachX >= target.holdX ? -1 : 1;
  }

  function facetOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const edge = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.18) * 0.58;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + edge,
      rot: (toX >= fromX ? 1 : -1) * 1.28 * (1 - ease) + edge * 0.05,
    };
  }

  function facetPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.18) {
      const s = t / 0.18;
      const ease = s * s * (3 - 2 * s);
      // take the inkstone — one cool face into the gap; living crystal, not Mortar mud daub, not Mane wood-wound teeth, not Nimbus methane float
      return { x: ease * 0.22, lift: -ease * 0.85, rot: ease * 3.1 };
    }
    if (t < 0.62) {
      const s = (t - 0.18) / 0.44;
      // facet once — sharp edge flash on the inkstone; facet is the tell; not silica as kind, not shard as kind, not daub, not teeth, not float, not plane, not edge
      const flash = s < 0.5 ? s * 2 : (1 - s) * 2;
      const bite = Math.sin(s * Math.PI);
      return { x: 0.22 + bite * 0.48, lift: -0.85 - flash * 1.12, rot: 3.1 + flash * 5.8 - bite * 1.1 };
    }
    if (t < 0.88) {
      const s = (t - 0.62) / 0.26;
      const ease = s * s * (3 - 2 * s);
      // settle the facet — cool inkstone sit after the edge
      return { x: 0.22 - ease * 0.06, lift: -0.85 - ease * 0.18, rot: 3.1 - ease * 1.4 };
    }
    return { x: 0.16, lift: -1.03, rot: 1.7 };
  }

  function facetHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.07;
    // sit the facet on the sash gap as an inkstone
    return { x: 0.16, lift: -1.03 + hush, rot: 1.7 };
  }

  function facetOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const edge = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.08) * 0.52;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + edge,
      rot: (from && from.rot != null ? from.rot : 1.7) * (1 - ease),
    };
  }

