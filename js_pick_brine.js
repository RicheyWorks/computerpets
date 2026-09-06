    if (kind === FROST) {
      const hold = frostPoint(best, size, work);
      const fromLeft = hold.x >= workW / 2;
      const approachOff = fromLeft ? -52 : 52;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 47 : -47;
      return {
        id: best.id,
        kind,
        side: "saltdish",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "frosted",
        spin: "none",
      };
    }
