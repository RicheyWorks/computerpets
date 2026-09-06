from pathlib import Path
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
# extract full PlayPhase by finding export type PlayPhase to next export type
i = ts.find("export type PlayPhase")
j = ts.find("export type", i+10)
phase = ts[i:j]
print("has align-on", "align-on" in phase)
print("has frost-on count", phase.count("frost-on"))
# show end of phase
print("PHASE END:")
print(phase[-800:])
# how does beacon_core patch phase?
bc = Path("_beacon_core.py").read_text(encoding="utf-8")
# find ts phase
k = bc.find("ts phase")
print("beacon core ts phase context:")
print(bc[k-400:k+200])
