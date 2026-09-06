
    if (kind === CHORD) {
      const hold = chordPoint(best, size, work);
      const fromLeft = hold.x >= workW / 2;
      const approachOff = fromLeft ? -48 : 48;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 44 : -44;
      return {
        id: best.id,
        kind,
        side: "blotterair",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, and clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "chorded",
        spin: "none",
      };
    }

