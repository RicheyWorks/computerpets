  function finsPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 20;
    const span = Math.max(0, win.width - size - pad * 2);
    const x = win.x + pad + span * 0.58;
    // drip cap as a reef ledge — sit the fins on the cap; she fins, she does not veil/lionfish/papillae/station/rasps/bars/tentacles/valleys/reef/many; fins is the tell
    // not Tube sand-well papillae, not Scrub sash-well station, not Scrape rock-plate rasps, not Paint wreath-cup bars, not Wreath column-dish tentacles, not Ridge boulder-dish valleys, not Ochre damp-blotter reef, not Soot chimney-pot caw, not Fan lamp-side gold, not Spine pine-post bristle
    const cap = Math.max(14, size * 0.08);
    const gripY = win.y - cap;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 42, maxLift) };
  }
  function finsFace(target) {
    return target.approachX >= target.holdX ? -1 : 1;
  }
  function finsOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.41) * 1.57;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (toX >= fromX ? 1 : -1) * 2.48 * (1 - ease) + stride * 0.07,
    };
  }
  function finsPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.20) {
      const s = t / 0.20;
      const ease = s * s * (3 - 2 * s);
      return { x: ease * 0.19, lift: ease * 1.22, rot: ease * 3.4 };
    }
    if (t < 0.68) {
      const s = (t - 0.20) / 0.48;
      const fan = Math.sin(s * Math.PI * 2);
      return { x: 0.19 + fan * 0.27, lift: 1.22 + Math.abs(fan) * 0.48, rot: 3.4 + s * 4.1 };
    }
    if (t < 0.88) {
      const s = (t - 0.68) / 0.20;
      const ease = s * s * (3 - 2 * s);
      return { x: 0.19 + ease * 0.09, lift: 1.22 + ease * 0.24, rot: 3.4 + ease * 1.72 };
    }
    return { x: 0.28, lift: 1.46, rot: 5.12 };
  }
  function finsHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.16;
    return { x: 0.28, lift: 1.46 + hush, rot: 5.12 };
  }
  function finsOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.33) * 1.46;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (from && from.rot != null ? from.rot : 5.12) * (1 - ease),
    };
  }
