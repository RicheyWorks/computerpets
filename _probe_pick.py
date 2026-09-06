from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# extract DAUB and TEETH pick blocks
for label, start, end in [
 ("daub pick", 'if (kind === DAUB)', 'leave: "daubed"'),
 ("teeth pick", 'if (kind === TEETH)', 'leave: "teethed"'),
 ("float pick", 'if (kind === FLOAT)', 'leave: "floated"'),
]:
    i = js.find(start)
    # find last occurrence in pickTarget - search around pick
    print("===", label, "first idx", i)
# better: find pick sections by unique leave strings
for leave in ['daubed', 'teethed', 'floated']:
    i = js.find(f'leave: "{leave}"')
    print(leave, "at", i)
    print(js[i-900:i+80])
    print("---")
