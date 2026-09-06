from pathlib import Path
# Exact current Last Updated lines
for p in ["docs/ARCHITECTURE.md","docs/ROADMAP.md"]:
    t=Path(p).read_text(encoding="utf-8")
    for line in t.splitlines():
        if "Last Updated" in line and "Pact" in line:
            print(p, "LEN", len(line))
            print(line)
            print("---")
# house title start
h=Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
print("HOUSE title start:")
print(h.splitlines()[18][:180])
# photovore sill counts
print("photovore sill", h.count('playFor("photovore"), "sill"'))
cjs=Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
mjs=Path("web/scripts/window-play.test.mjs").read_text(encoding="utf-8")
print("cjs photovore sill", cjs.count('playFor("photovore"), "sill"'))
print("mjs photovore sill", mjs.count('playFor("photovore"), "sill"'))
print("cjs tests", cjs.count('test("'), "mjs", mjs.count('test("'))
# pact abort marker uniqueness for insert
marker = (
    'assert.ok(Math.abs(play.target.holdX - beforeX) > 40, "refit follows the moved bark stone");\n'
    '  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });\n'
    '  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "plaque-off");\n'
    '  assert.equal(play.abort, true);\n'
    '});'
)
print("cjs pact abort marker", cjs.count(marker))
marker2 = (
    '  assert.equal(play.phase, "plaque");\n'
    '  const beforeX = play.target.holdX;\n'
    '  const moved = { ...WIN, x: WIN.x + 140 };\n'
    '  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });\n'
    '  assert.equal(play.phase, "plaque");\n'
    '  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);\n'
    '  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });\n'
    '  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "plaque-off");\n'
    '  assert.equal(play.abort, true);\n'
    '});'
)
print("mjs pact abort marker", mjs.count(marker2))
# pick insert anchors after plaque
js=Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
print("plaqued WRAP anchor", js.count('''        leave: "plaqued",
        spin: "none",
      };
    }


        if (kind === WRAP) {'''))
print("plaqued WRAP alt", js.count('''        leave: "plaqued",
        spin: "none",
      };
    }

    if (kind === WRAP) {'''))
# show exact after plaque pick
i=js.find('leave: "plaqued"')
print(repr(js[i:i+180]))
i=js.find('target.kind === PLAQUE')
# second is refit
idxs=[]; s=0
while True:
    j=js.find("target.kind === PLAQUE", s)
    if j<0: break
    idxs.append(j); s=j+1
print("target.kind PLAQUE", idxs)
for j in idxs:
    print(repr(js[j:j+220]))
