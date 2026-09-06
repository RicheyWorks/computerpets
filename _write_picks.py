from pathlib import Path

Path("js_pick_silica.js").write_text(
    "\n"
    "    if (kind === FACET) {\n"
    "      const hold = facetPoint(best, size, work);\n"
    "      const approachOff = hold.x < workW / 2 ? -50 : 50;\n"
    "      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));\n"
    "      const away = hold.x < workW / 2 ? 44 : -44;\n"
    "      return {\n"
    "        id: best.id,\n"
    "        kind,\n"
    '        side: "inkstone",\n'
    "        holdX: hold.x,\n"
    "        holdLift: hold.lift,\n"
    "        approachX,\n"
    "        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),\n"
    '        leave: "faceted",\n'
    '        spin: "none",\n'
    "      };\n"
    "    }\n"
    "\n",
    encoding="utf-8",
    newline="\n",
)

Path("ts_pick_silica.js").write_text(
    "\n"
    "  if (kind === FACET) {\n"
    "    const hold = facetPoint(best, size, work);\n"
    "    const approachOff = hold.x < workW / 2 ? -50 : 50;\n"
    "    const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));\n"
    "    const away = hold.x < workW / 2 ? 44 : -44;\n"
    "    return {\n"
    "      id: best.id,\n"
    "      kind,\n"
    '      side: "inkstone",\n'
    "      holdX: hold.x,\n"
    "      holdLift: hold.lift,\n"
    "      approachX,\n"
    "      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),\n"
    '      leave: "faceted",\n'
    '      spin: "none",\n'
    "    };\n"
    "  }\n"
    "\n",
    encoding="utf-8",
    newline="\n",
)
print("picks ok")
