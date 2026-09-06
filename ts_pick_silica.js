
  if (kind === FACET) {
    const hold = facetPoint(best, size, work);
    const approachOff = hold.x < workW / 2 ? -50 : 50;
    const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
    const away = hold.x < workW / 2 ? 44 : -44;
    return {
      id: best.id,
      kind,
      side: "inkstone",
      holdX: hold.x,
      holdLift: hold.lift,
      approachX,
      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
      leave: "faceted",
      spin: "none",
    };
  }

