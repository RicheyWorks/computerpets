from pathlib import Path
import re
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# all shouldAbort definitions/usages in exports
for m in re.finditer(r"shouldAbort", js):
    i=m.start()
    if js[max(0,i-30):i].endswith("function ") or "shouldAbort =" in js[max(0,i-20):i+20]:
        print("---", repr(js[i-40:i+200]))
# check how Veil test passes - maybe module wraps
# Look at stepPlay abort check
i = js.find("shouldAbort(")
print("first call", repr(js[i:i+120]))
# search for phase list including rays
for needle in ['"rays"', 'phase.startsWith', 'ABORT_PHASE', 'play.phase', 'rays-hold']:
    if needle in js[js.find("shouldAbort"):js.find("shouldAbort")+5000]:
        print("near shouldAbort:", needle)
# Maybe exported shouldAbort is different - check end of file exports usage in tests by running node
