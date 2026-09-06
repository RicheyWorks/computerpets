from pathlib import Path
cjs = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
idx = cjs.find("other guests do not clone")
print(cjs[idx:idx+450])
print("---")
# also check BOM on Choir test
idx = cjs.find("Choir chords a mid pane")
print(repr(cjs[idx-2:idx+20]))
