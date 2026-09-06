from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# find API export block
i = js.find("freezeOffPath,\n    pickTarget")
print("api count", js.count("freezeOffPath,\n    pickTarget"))
print(repr(js[i-80:i+60]))
i = js.find("HAWK,\n    FREEZE,\n    IGNORE")
print("const api", repr(js[i:i+40]) if i>=0 else None)
# refit
i = js.find("if (target.kind === FREEZE) {\n      const hold = freezePoint")
print("refit", repr(js[i:i+200]))
i = js.find("if (target.kind === BURY)")
print("bury after", repr(js[i-120:i+40]))
# header end
i = js.find("Twig freezes a sash muntin")
print("header", js[i:i+280])
# size gate return
i = js.find("if (kind === FREEZE) return w.width >= 196 && w.height >= 188;")
print("size", repr(js[i:i+120]))
# DUR
i = js.find("freezeOff: 2.74,")
print("dur", repr(js[i:i+40]))
# generic sill in tests
cjs = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
print("cjs carpenter sill", cjs.count('playFor("carpenter_ant"), "sill"'))
print("cjs ladybird", cjs.count('ladybird'))
mjs = Path("web/scripts/window-play.test.mjs").read_text(encoding="utf-8")
print("mjs carpenter sill", mjs.count('playFor("carpenter_ant"), "sill"'))
