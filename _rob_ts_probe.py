from pathlib import Path
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
# find type PlayKind or similar
for needle in ['| "right"', 'type PlayKind', 'RIGHT =', 'click_beetle', 'Others walk a sill']:
    i = ts.find(needle)
    print(needle, i)
# print around RIGHT const and type
i = ts.find('| "right"')
print(ts[i-200:i+80])
print('====')
i = ts.find('const RIGHT')
print(ts[i:i+80])
