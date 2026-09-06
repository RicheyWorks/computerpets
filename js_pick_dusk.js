    if (kind === RIM) {
      const hold = rimPoint(best, size, work);
      const fromLeft = hold.x >= workW / 2;
      const approachOff = fromLeft ? -61 : 61;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 53 : -53;
      return {
        id: best.id,
        kind,
        side: "lampedge",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "rimmed",
        spin: "none",
      };
    }
