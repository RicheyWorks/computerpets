from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# first comment block ends at */
end = js.find("*/")
header = js[:end+2]
# find the Pact/fungi part
i = header.find("Pact plaques")
print("pact in header", i)
print(repr(header[i:i+600]))
print("---")
# find "closes fungi" 
i = header.find("closes fungi")
print(repr(header[max(0,i-200):i+120]))
print("---TAIL---")
print(repr(header[-400:]))

ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
end = ts.find("*/")
header = ts[:end+2]
i = header.find("Pact plaques")
print("\nTS pact", i)
print(repr(header[-450:]))

# check TS tick whitespace pattern for plaque-off -> sill-hop
i = ts.find('next.phase === "plaque-off"')
print("\nTS plaque-off block:")
print(repr(ts[i:i+550]))
i2 = ts.find('next.phase === "sill-hop"')
print("\nbetween plaque-off and sill-hop chars:", i2 - (i+400))
print(repr(ts[i:i2][-200:]))
