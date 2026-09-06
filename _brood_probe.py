from pathlib import Path
t=Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
needles=[
"const PRAY = \"pray\";\n  const SILL",
"prayOff: 2.42,\n    sillHop",
"if (key === \"mantis\") return PRAY;\n    return SILL",
"if (kind === PRAY) return w.width >= 184 && w.height >= 178;\n    return w.width",
"leave: \"prayed\"",
"SPOT,\n    PRAY,\n    IGNORE",
"spotOffPath,\n    prayPoint",
"if (next.phase === \"sill-hop\")",
"if (target.kind === PRAY)",
"ninth leftover of the remaining hive den.",
]
for n in needles:
    print(repr(n[:60]), "->", t.count(n))
ts=Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
for n in [
'export const PRAY = "pray";\nexport const SILL',
'prayOff: 2.42,\n  sillHop',
'if (key === "mantis") return PRAY;\n  return SILL',
'typeof SPOT | typeof PRAY | typeof SILL',
'| "pray-off"\n  | "sill-hop"',
'"pencilstem" | "timbergallery" | "greenhinge"',
'"nested" | "spotted" | "prayed"',
]:
    print("ts", repr(n[:50]), "->", ts.count(n))
house=Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
print("house cicada sill", house.count('playFor("cicada"), "sill"'))
print("house next Brood", house.count("next leftover is Brood"))
print("cjs cicada sill", Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8").count('playFor("cicada"), "sill"'))
print("mjs cicada sill", Path("web/scripts/window-play.test.mjs").read_text(encoding="utf-8").count('playFor("cicada"), "sill"'))
