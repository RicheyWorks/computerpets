from pathlib import Path
cjs=Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
idx=cjs.find("refits Banner's blossom-dish tails")
print(cjs[idx:idx+2200])
print("====JEWEL====")
idx=cjs.find("refits Jewel's stream-jewel black")
print(cjs[idx:idx+1800])
