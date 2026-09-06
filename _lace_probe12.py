from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
for name in ["WEEK", "MOUNT", "weekPoint", "mountPoint", "weekPath", "spotPoint", "weekOn", "mountOn", "spotOn", "DUR.week", "week:"]:
    # count exports / defs
    print(name, js.count(name))
# check export list for weekPoint
i = js.find("weekPoint")
print("first weekPoint context", js[max(0,i-40):i+60] if i>=0 else "no")
# module.exports area for WEEK
i = js.find("WEEK,")
print("WEEK export", js[i-20:i+40] if i>=0 else "no")
