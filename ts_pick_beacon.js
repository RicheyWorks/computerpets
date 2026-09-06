  if (kind === ALIGN) {
    const hold = alignPoint(best, size, work);
    const fromLeft = hold.x >= workW / 2;
    const approachOff = fromLeft ? -54 : 54;
    const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
    const away = hold.x < workW / 2 ? 49 : -49;
    return {
      id: best.id,
      kind,
      side: "rulerline",
      holdX: hold.x,
      holdLift: hold.lift,
      approachX,
      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
      leave: "aligned",
      spin: "none",
    };
  }
